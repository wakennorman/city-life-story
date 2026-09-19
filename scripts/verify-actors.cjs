#!/usr/bin/env node
/**
 * 动态角色系统验证（人流 / 车流 / 动物 / 人形外观）。
 *
 * ── 为什么这个脚本必须存在 ────────────────────────────────────────────────
 *   角色系统有一种特别隐蔽的失败模式：**静默为空或静默僵死**。
 *     · 地点分支写错（把 avenue 判断写成 compound）→ 街上一个活物都没有，
 *       但画面照常渲染、控制台一个字都不报；
 *     · 角色生成了但 update 没接进主循环 → 摆在那儿一动不动，
 *       截图看上去"有内容"，实际是雕塑。
 *     · 车流逻辑错（不跟车）→ 两辆车叠在一起，静止时看不出来，
 *       跑起来才穿模。
 *   所以这里断言的不是"有没有角色对象"，而是：
 *     ① 各类角色的**数量**符合地点类型
 *     ② 它们**真的在动**（隔 1 秒采样位置，位移必须 > 0）
 *     ③ **行进逻辑正确**：靠右行驶、同向车不重叠、行人不占车道
 *     ④ 人形**有五官与手脚**（不是无脸胶囊）
 *
 * 用法：node scripts/verify-actors.cjs
 */

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright-core');
const { EDGE, attachErrorSink } = require('./_boot.cjs');
const { ensureServer, closeServer } = require('./lib/serve.cjs');

const PORT = Number(process.env.PORT || 8981);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dev/_3dtest/shots-actors');
const DOC = '/dev/_3dtest/shell.html';
const PROBE = 'dev/_3dtest/bundle-probe.js';

let pass = 0, fail = 0;
function check(name, ok, detail) {
  (ok ? pass++ : fail++);
  console.log(`  ${ok ? '✅' : '❌'} ${name}${detail ? `  — ${detail}` : ''}`);
}

/* ★ 必须先重建探针包：探针页加载的是构建产物，不是源码。
   改了 actors.js 却不重建 → 测的是旧代码（本项目反复踩过）。 */
function rebuild() {
  console.log('重建探针包（避免用旧代码验证新代码）…');
  execFileSync(process.execPath, [path.join(__dirname, 'build-3d-bundle.cjs'), '--out', PROBE],
    { cwd: ROOT, stdio: 'pipe' });
}

(async () => {
  rebuild();
  fs.mkdirSync(OUT, { recursive: true });
  const own = await ensureServer({ root: ROOT, port: PORT, label: '动态角色验证' });
  const browser = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = attachErrorSink(page);

  await page.goto(`http://127.0.0.1:${PORT}${DOC}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => !!window.Scene3D && window.__shellReady === true, { timeout: 60000 });

  /* ★ 用"仿真时间"而不是"墙钟时间"等待。
     主循环把 dt clamp 到 0.05s/帧（见 bridge.js loop），所以帧率低的时候
     墙钟 1 秒只推进很少的仿真时间 —— "等 1.4 秒看角色动没动"会因此假红。
     这里按帧累加 min(0.05, 实际帧间隔)，等够真正的仿真秒数再采样，
     并把实际推进量与帧率一并报出来，失败时能立刻区分"逻辑坏了"和"机器太慢"。 */
  const advanceSim = (sec) => page.evaluate((sec) => new Promise((resolve) => {
    let sim = 0, frames = 0;
    const t0 = performance.now();
    let prev = t0;
    const f = () => {
      const now = performance.now();
      sim += Math.min(0.05, (now - prev) / 1000);
      prev = now; frames++;
      if (sim >= sec || frames > 1800) {
        resolve({ sim: +sim.toFixed(2), frames, wall: +((now - t0) / 1000).toFixed(2) });
      } else requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }), sec);

  const warm = await advanceSim(2.5);
  console.log(`（预热：推进 ${warm.sim}s 仿真 / ${warm.wall}s 墙钟 / ${warm.frames} 帧）`);

  console.log('动态角色系统验证\n');

  /* ── ① 人形外观：必须真的有五官与手脚 ──
     直接调 buildHuman 来数网格。为什么不从场景里数：
     场景里还有建筑/道具，混在一起数不出"这个人像不像人"。 */
  console.log('① 人形外观（不是无脸胶囊）');
  const body = await page.evaluate(() => {
    const S = window.Scene3D;
    let seed = 12345;
    const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const g = S.buildHuman(rng, 1);
    let meshes = 0;
    const geos = [];
    g.traverse((o) => { if (o.isMesh) { meshes++; geos.push(o.geometry.parameters || {}); } });
    /* 眼眶/眼睛的球体半径只有 0.019 —— 用它识别"确实有眼睛"，
       而不是靠网格总数（总数多可能只是堆了别的方块）。 */
    const eyes = geos.filter((p) => p.radius !== undefined && p.radius > 0.015 && p.radius < 0.025).length;
    const feet = geos.filter((p) => p.width !== undefined && p.depth !== undefined
      && Math.abs(p.width - 0.105) < 1e-6 && Math.abs(p.depth - 0.225) < 1e-6).length;
    const hands = geos.filter((p) => p.radius !== undefined && p.radius > 0.045 && p.radius < 0.055).length;
    let minY = Infinity, maxY = -Infinity;
    g.updateMatrixWorld(true);
    /* ★ 必须用**世界矩阵**逐角点变换，不能用 `b.min.y + o.position.y`。
       后者只对"直接挂在组根下"的网格成立；一旦把手掌挂到手臂下（见 actors.js），
       它算的就是"相对手臂的局部 y"，身高立刻虚高（实测 1.72 被算成 2.17）。
       矩阵是列主序：Y = e[1]*x + e[5]*y + e[9]*z + e[13]。 */
    g.traverse((o) => {
      if (!o.isMesh || !o.geometry) return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      const b = o.geometry.boundingBox;
      if (!b) return;
      const e = o.matrixWorld.elements;
      for (const x of [b.min.x, b.max.x]) {
        for (const y of [b.min.y, b.max.y]) {
          for (const z of [b.min.z, b.max.z]) {
            const wy = e[1] * x + e[5] * y + e[9] * z + e[13];
            if (wy < minY) minY = wy;
            if (wy > maxY) maxY = wy;
          }
        }
      }
    });

    /* ★ 光数"有几个手掌网格"是假通过：手挂在哪儿、朝向哪，它一概不管。
       实测踩过：手掌被挂到组根、组空间 y = −0.245，**17 个行人的手全埋在地下**，
       而"有双手 ✅"照样亮着。所以这里改查**世界坐标与父子关系**：
         · 手必须在腰以上的高度；
         · 手必须挂在手臂下、脚必须挂在腿下（否则腿摆动时手脚不跟着走）。 */
    const worldPt = (o) => {
      const m = o.matrixWorld.elements;
      return { x: m[12], y: m[13], z: m[14] };
    };
    /* 肢体的判定：CapsuleGeometry 的参数是 { radius, length }（没有 height）。
       写成只认 height 会永远匹配不到，于是"手挂在手臂下"永远为假 —— 又一条静默永假的断言。 */
    const isLimb = (np) => !!np && np.radius !== undefined
      && (np.length !== undefined || np.height !== undefined);
    const parts = [];
    g.traverse((o) => {
      if (!o.isMesh || !o.geometry || !o.geometry.parameters) return;
      const p = o.geometry.parameters;
      const isHand = p.radius !== undefined && p.radius > 0.045 && p.radius < 0.055;
      const isFoot = p.width !== undefined && p.depth !== undefined
        && Math.abs(p.width - 0.105) < 1e-6 && Math.abs(p.depth - 0.225) < 1e-6;
      if (!isHand && !isFoot) return;
      const w = worldPt(o);
      /* 父级链里有没有胶囊体（手臂/腿）—— 有才说明是"挂在肢体上"而非挂根。 */
      let attached = false;
      for (let n = o.parent; n && n !== g; n = n.parent) {
        if (isLimb(n.geometry && n.geometry.parameters)) attached = true;
      }
      parts.push({ kind: isHand ? 'hand' : 'foot', y: +w.y.toFixed(3), attached });
    });
    const handsP = parts.filter((p) => p.kind === 'hand');
    const feetP = parts.filter((p) => p.kind === 'foot');
    return {
      meshes, eyes, feet, hands, height: +(maxY - minY).toFixed(3),
      handMinY: handsP.length ? Math.min(...handsP.map((p) => p.y)) : null,
      feetMaxY: feetP.length ? Math.max(...feetP.map((p) => p.y)) : null,
      handAttached: handsP.length > 0 && handsP.every((p) => p.attached),
      footAttached: feetP.length > 0 && feetP.every((p) => p.attached),
    };
  });
  check('人形有完整的部件（≥14 个网格）', body.meshes >= 14, `${body.meshes} 个`);
  check('有眼睛（可识别到眼部球体）', body.eyes >= 2, `${body.eyes} 个`);
  check('有双脚', body.feet >= 2, `${body.feet} 只`);
  check('有双手', body.hands >= 2, `${body.hands} 只`);
  /* ★ 下面两条抓的是"位置/父子关系写错"——数个数永远查不出来的那一类。 */
  check('★ 手在腰以上（没有埋进地面）',
    body.handMinY !== null && body.handMinY > 0.6, `手的最低点 y=${body.handMinY}`);
  check('★ 脚踩在地面上（没有悬空或穿地）',
    body.feetMaxY !== null && body.feetMaxY > -0.05 && body.feetMaxY < 0.2,
    `脚的最高点 y=${body.feetMaxY}`);
  check('★ 手挂在手臂下、脚挂在腿下（摆动时跟着走）',
    body.handAttached === true && body.footAttached === true,
    `手 ${body.handAttached ? '已挂' : '未挂'} · 脚 ${body.footAttached ? '已挂' : '未挂'}`);
  /* 身高必须落在真实区间：0.9~1.2 缩放后应约 1.55~2.1m。
     这条能抓住"比例写错"（比如腿长取错，人只有半米高）。 */
  check('身高在人类区间（1.5~2.1m）', body.height > 1.5 && body.height < 2.1, `${body.height} m`);

  /* ── ② 城中村（lane）的角色构成 ── */
  console.log('\n② 城中村（lane）角色构成');
  const lane = await page.evaluate(() => ({
    loc: window.__shell.locationId,
    actors: window.__shell.view3d.actors,
  }));
  const c = lane.actors.counts;
  check('生成了人流', (c.ped || 0) >= 2, `${c.ped || 0} 个行人`);
  check('生成了车流', (c.car || 0) >= 1, `${c.car || 0} 辆车`);
  check('生成了鸟', (c.bird || 0) >= 3, `${c.bird || 0} 只`);
  check('城中村有狗或猫（看门/流浪）', (c.dog || 0) + (c.cat || 0) >= 1,
    `狗 ${c.dog || 0} · 猫 ${c.cat || 0}`);
  /* 昆虫只在"脏"的布局成群。广场/商业街不该有苍蝇群。 */
  check('城中村有虫群（脏环境才有）', (c.insect || 0) >= 4, `${c.insect || 0} 只`);

  /* ── ③ 真的在动 ──
     ★ 必须按种类看，不能只看总数。
       总数 10/31 通过不了，但你不知道"是谁不动"——是车停了（严重）
       还是猫蹲着（应该的）。按种类拆开才能判断。 */
  console.log('\n③ 角色真的在动（不是僵死雕塑）');
  const sample = () => page.evaluate(() => {
    const out = {};
    const sc = window.__shell.view3d.scene;
    sc.traverse((o) => {
      if (!o.userData) return;
      const a = o.userData.__actorKind;
      if (!a) return;
      (out[a] || (out[a] = [])).push([+o.position.x.toFixed(3), +o.position.z.toFixed(3)]);
    });
    return out;
  });
  const s1 = await sample();
  const adv = await advanceSim(1.8);
  const s2 = await sample();
  const moveStat = {};
  for (const k of Object.keys(s1)) {
    const a = s1[k], b = s2[k] || [];
    let mv = 0, tot = 0;
    for (let i = 0; i < a.length; i++) {
      if (!b[i]) continue;
      tot++;
      if (Math.hypot(b[i][0] - a[i][0], b[i][1] - a[i][1]) > 0.05) mv++;
    }
    moveStat[k] = { moved: mv, total: tot };
  }
  const rate = (k) => {
    const m = moveStat[k];
    return m && m.total ? m.moved / m.total : -1;
  };
  const pct = (k) => (rate(k) < 0 ? '无' : `${moveStat[k].moved}/${moveStat[k].total}`);
  console.log('     位移明细：' + Object.keys(moveStat)
    .map((k) => `${k} ${pct(k)}`).join(' · ')
    + `   （观察窗 ${adv.sim}s 仿真 / ${adv.wall}s 墙钟）`);
  /* 车必须 100% 在跑 —— 车流是"永远不会静"的，停车即 bug。 */
  const vehRate = Math.min(
    rate('car') < 0 ? 1 : rate('car'),
    rate('bike') < 0 ? 1 : rate('bike'),
  );
  check('★ 车辆全部在行驶（车流不会静）', vehRate >= 1,
    `车 ${pct('car')} · 摩托 ${pct('bike')}`);
  /* 行人：允许一部分停下（本来就该有人站着看手机），但过半数必须在走。 */
  check('过半行人在走动', rate('ped') >= 0.5, pct('ped'));
  check('飞虫全部在飞', rate('insect') >= 1, pct('insect'));
  /* 鸟会落地啄食，允许少数停着，但不能整群不动。 */
  check('过半鸟在飞', rate('bird') >= 0.5, pct('bird'));
  /* 狗会走动；猫有长静止期，只要求"二者至少有一个在动"。 */
  check('动物有活动（狗走/猫蹲）',
    rate('dog') > 0 || rate('cat') > 0, `狗 ${pct('dog')} · 猫 ${pct('cat')}`);
  const allMoved = Object.values(moveStat).reduce((s, m) => s + m.moved, 0);
  const allTotal = Object.values(moveStat).reduce((s, m) => s + m.total, 0);
  check('整体在动（> 50%）', allTotal > 0 && allMoved / allTotal > 0.5,
    `${allMoved}/${allTotal} 个在动`);

  /* ── ④ 车流逻辑：靠右 + 不重叠 ──
     ★ 这两条是"逻辑要对"的核心。做不到就是逆行 + 穿模。 */
  console.log('\n④ 车流逻辑（靠右行驶 · 跟车不穿模）');
  const traffic = await page.evaluate(() => {
    const sc = window.__shell.view3d.scene;
    const grp = sc.children.find((g) => g.name === 'actors');
    if (!grp) return { err: '找不到 actors 组' };
    const cars = [];
    for (const o of grp.children) {
      /* 车 = tag 为 car 或 bike（摩托也是靠右行驶的机动车）。
         ★ 原先这里靠"车轮圆柱 radius===0.31"识别 —— 永远数到 0 辆，
           因为 three 的 CylinderGeometry 参数是 radiusTop/radiusBottom，
           **没有 radius 字段**。这条断言当时是"静默永假"。 */
      const k = o.userData.__actorKind;
      if (k !== 'car' && k !== 'bike') continue;
      /* 朝向：rotation.y ≈ 0 表示面向 +Z；≈ PI 表示面向 -Z */
      const dir = Math.abs(o.rotation.y) < 0.6 ? 1 : (Math.abs(Math.abs(o.rotation.y) - Math.PI) < 0.6 ? -1 : 0);
      cars.push({ x: +o.position.x.toFixed(3), z: +o.position.z.toFixed(3), dir, k });
    }
    let wrongSide = 0;
    for (const car of cars) {
      /* 靠右：面向 +Z 时应在 x<0；面向 -Z 时应在 x>0（推导见 actors.js 文件头） */
      if (car.dir === 1 && car.x > 0.05) wrongSide++;
      if (car.dir === -1 && car.x < -0.05) wrongSide++;
    }
    /* 同向车不重叠：按 z 排序后相邻间距必须 > 车长(4.05) */
    let overlap = 0, minGap = Infinity;
    const byDir = { 1: cars.filter((c) => c.dir === 1), '-1': cars.filter((c) => c.dir === -1) };
    for (const d of [1, -1]) {
      const arr = byDir[d].slice().sort((a, b) => a.z - b.z);
      for (let i = 1; i < arr.length; i++) {
        const gap = Math.abs(arr[i].z - arr[i - 1].z);
        minGap = Math.min(minGap, gap);
        if (gap < 3.0) overlap++;
      }
    }
    return {
      n: cars.length, wrongSide, overlap,
      minGap: minGap === Infinity ? null : +minGap.toFixed(2),
      dirs: cars.map((c) => c.dir),
    };
  });
  if (traffic.err) {
    check('车流可采样', false, traffic.err);
  } else {
    check('取到车辆样本', traffic.n >= 1, `${traffic.n} 辆`);
    /* 双向车流必须真的存在（只有单向 = 一半车道的逻辑没跑，
       或者方向判断退化成了常量）。 */
    check('双向车流都存在', traffic.dirs.includes(1) && traffic.dirs.includes(-1),
      `方向 [${traffic.dirs.join(', ')}]`);
    check('★ 靠右行驶（无逆行）', traffic.wrongSide === 0, `逆行 ${traffic.wrongSide} 辆`);
    check('★ 同向车不重叠（跟车生效）', traffic.overlap === 0,
      traffic.minGap === null ? '单向只有 1 辆，无从重叠' : `最小车距 ${traffic.minGap}m`);
  }

  /* ── ⑤ 行人不占车道 ── */
  console.log('\n⑤ 人流逻辑（行人应在路侧，不占车道中央）');
  const pedCheck = await page.evaluate(() => {
    const sc = window.__shell.view3d.scene;
    const grp = sc.children.find((g) => g.name === 'actors');
    if (!grp) return { err: 'no group' };
    let n = 0, minAbsX = Infinity;
    for (const o of grp.children) {
      if (o.userData.__actorKind !== 'ped') continue;
      n++;
      minAbsX = Math.min(minAbsX, Math.abs(o.position.x));
    }
    return { n, minAbsX: minAbsX === Infinity ? null : +minAbsX.toFixed(2) };
  });
  if (pedCheck.err) {
    check('人流可采样', false, pedCheck.err);
  } else {
    check('取到行人样本', pedCheck.n >= 2, `${pedCheck.n} 人`);
    /* lane 布局没有独立人行道，人就贴着路边走；
       只要没人跑到 x=0 的车道中心线上就说明摆放逻辑正确。
       ★ 注意断言的是**最小值**：原先写成"最大 |x| > 0.5"，
         而所有人都满足 |x|>0.5（因为人行道带本身就有下限），
         等于什么都没验证 —— 只要有一个行人站在车道上就该红。 */
    check('★ 没有行人站在车道中心线上（最小 |x| 有下限）',
      pedCheck.minAbsX !== null && pedCheck.minAbsX > 0.5,
      `离街心最近的一个人 ${pedCheck.minAbsX}m`);
  }

  /* ── ⑥ 换到大道：车流应变多 ── */
  console.log('\n⑥ 换到大道（车流应显著增加）');
  const av = await page.evaluate(() => {
    const S = window.Scene3D;
    const spec = S.SPECS || {};
    const id = Object.keys(spec).find((k) => spec[k].layout === 'avenue');
    if (!id) return { err: '找不到 avenue 布局的地点' };
    window.__shell.loadLocation(id);
    return { id, before: window.__shell.view3d.actors.counts };
  });
  await advanceSim(1.6);
  const avAfter = await page.evaluate(() => ({
    id: window.__shell.locationId,
    counts: window.__shell.view3d.actors.counts,
  }));
  if (av.err) {
    check('存在 avenue 布局的地点', false, av.err);
  } else {
    check('换到大道后车流更多', (avAfter.counts.car || 0) >= (c.car || 0),
      `${av.id}(${avAfter.id}): ${avAfter.counts.car || 0} 辆 vs 城中村 ${c.car || 0} 辆`);
    check('大道上有人流', (avAfter.counts.ped || 0) >= 2, `${avAfter.counts.ped || 0} 人`);
  }

  await page.screenshot({ path: path.join(OUT, '1-actors-avenue.png') });
  await page.evaluate(() => {
    const S = window.Scene3D;
    const spec = S.SPECS || {};
    const lane = Object.keys(spec).find((k) => spec[k].layout === 'lane');
    if (lane) window.__shell.loadLocation(lane);
  });
  await advanceSim(1.6);
  await page.screenshot({ path: path.join(OUT, '2-actors-lane.png') });

  /* ── ⑦ 3D 提醒 ── */
  console.log('\n⑦ 3D 场景内提醒（替代 DOM toast）');
  const notice = await page.evaluate(async () => {
    const v = window.__shell.view3d;
    const sc = v.scene;
    const before = sc.children.filter((g) => g.type === 'Group' && g.children.length
      && g.children[0].isSprite).length;
    v.notify('测试提醒：条件不满足');
    await new Promise((r) => setTimeout(r, 120));
    let sprites = 0;
    const found = [];
    sc.traverse((o) => { if (o.isSprite) { sprites++; found.push(o); } });
    return {
      before, sprites,
      hasTex: found.some((s) => !!(s.material && s.material.map)),
      isWorldSpace: found.every((s) => s.parent && s.parent.type === 'Group'),
      y: found.length ? +found[found.length - 1].position.y.toFixed(2) : null,
    };
  });
  check('notify() 生成了 3D sprite', notice.sprites >= 1, `${notice.sprites} 个 sprite`);
  check('提示带纹理（是真的画了字）', notice.hasTex === true);
  check('提示在世界空间（挂在场景组里，不是 DOM）', notice.isWorldSpace === true,
    `y=${notice.y}`);

  /* ── ⑨ 反馈载体：场景内提醒，而不是网页浮条 ──
     ★ 必须**同时**断言"出现了 sprite"和"DOM 浮条没有出现"。
       只查 sprite 是假通过：DOM 浮条完全可能照弹不误（两套并行在跑），
       那样玩家看到的仍然是网页式的那一个 —— 而这正是要修掉的东西。 */
  console.log('\n⑨ 反馈载体（HUD → 场景内 sprite · 网页浮条应消失）');
  const fb = await page.evaluate(async () => {
    const v = window.__shell.view3d;
    const sc = v.scene;
    const grab = () => { const out = []; sc.traverse((o) => { if (o.isSprite) out.push(o); }); return out; };
    const domToast = () => document.querySelectorAll('.s3h-toast').length;
    const before = { notices: v.notices, sprites: grab().length, dom: domToast() };

    /* ① 游戏消息回显那条路：scene3d_bridge 把 messageLog 增量交给 shell.notify
          → hud.notify → （本次改动）场景内 sprite。 */
    window.__shell.notify('测试：这一步现在做不了', 'warn');
    /* ② 同一句文案、三种 kind 走一遍，专门验证 "kind → 配色" 真的分叉了：
          同 kind 复用同一张 canvas 纹理（缓存生效），不同 kind 必须是不同纹理。
          只查"有没有弹出来"是查不出配色的：全用一个白色也能过。 */
    v.notify('同文案同 kind', { kind: 'ok' });
    v.notify('同文案同 kind', { kind: 'warn' });
    v.notify('同文案同 kind', { kind: 'ok' });

    const after = grab();
    const news = after.slice(before.sprites);
    const tails = news.slice(-3).map((s) => s.material.map.uuid);
    const topY = after.reduce((m, s) => Math.max(m, s.position.y), -Infinity);

    /* ③ 真实玩家路径：点开托盘、点一个可执行的行动。
          （成功路径外壳本来就不弹提示，只 refresh —— 这里要盯的是
           "它不会把反馈退回成 DOM 浮条"。） */
    const toggle = document.querySelector('.s3h-tray-toggle');
    if (toggle && !document.querySelector('.s3h-tray.is-open')) toggle.click();
    await new Promise((r) => setTimeout(r, 80));
    const btn = Array.from(document.querySelectorAll('.s3h-act'))
      .find((b) => !b.classList.contains('is-off'));
    if (btn) btn.click();
    await new Promise((r) => setTimeout(r, 300));

    return {
      before,
      notices: v.notices,
      sprites: after.length,
      added: news.length,
      sameKindReuse: tails[0] === tails[2],
      diffKindDiffer: tails[0] !== tails[1],
      allTex: news.every((s) => !!(s.material && s.material.map)),
      topY: Number.isFinite(topY) ? +topY.toFixed(2) : null,
      dom: domToast(),
      clicked: !!btn,
    };
  });
  check('点击托盘行动这条真实玩家路径走通（未回退 DOM）', fb.clicked === true);
  check('HUD 反馈产生场景内提醒（计数 +4：接口 1 次 + 直接 3 次）',
    fb.notices >= fb.before.notices + 4 && fb.added >= 4,
    `notices ${fb.before.notices}→${fb.notices} · 新增 sprite ${fb.added}`);
  check('★ 网页浮条没有出现（DOM .s3h-toast = 0）',
    fb.dom === 0 && fb.before.dom === 0, `before ${fb.before.dom} · after ${fb.dom}`);
  check('提醒是带纹理的字（不是空 sprite）', fb.allTex === true);
  check('同文案同 kind 复用同一张纹理（缓存生效）', fb.sameKindReuse === true);
  check('★ 不同 kind 配色真的分叉（不是所有提醒同一个白）',
    fb.diffKindDiffer === true);
  check('提醒浮在玩家头顶上方（世界坐标 y > 2）', fb.topY !== null && fb.topY > 2, `y=${fb.topY}`);

  /* ── ⑩ 性能护栏 ──
     ★ 只报总数没有意义：1784 次里到底多少是"场景本来就有"、
       多少是"角色系统加出来的"？不知道就无从优化。
       这里用 group.visible 开关量出角色的**真实增量**（隐藏对象
       在 three 里连阴影 pass 都不进，所以这是干净的一次归因）。 */
  console.log('\n⑩ 性能护栏（含角色系统增量归因）');
  const perf = await page.evaluate(async () => {
    const v = window.__shell.view3d;
    const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const grp = v.scene.children.find((g) => g.name === 'actors');
    await frame();
    const withActors = v.stats.calls;
    if (grp) grp.visible = false;
    await frame();
    const withoutActors = v.stats.calls;
    if (grp) grp.visible = true;
    await frame();
    let actorMeshes = 0;
    if (grp) grp.traverse((o) => { if (o.isMesh) actorMeshes++; });
    return { withActors, withoutActors, added: withActors - withoutActors, actorMeshes };
  });
  console.log(`     归因：场景本体 ${perf.withoutActors} 次 · 角色系统 +${perf.added} 次`
    + `（${perf.actorMeshes} 个网格）`);
  /* ★ 断言的是**增量**而不是绝对总量 —— 绝对总量里绝大部分是场景本体的开销
     （城中村实测约 1500 次，那是 world.js 的水位，与角色系统无关）。
     拿一个够不到的绝对阈值卡自己，只会得到"改不动就调阈值"的坏习惯。 */
  check('角色系统增量可控（< 420 次 draw call）', perf.added < 420, `+${perf.added} 次`);
  check('开启角色后总量未失控（< 2200，防角色侧回归）',
    perf.withActors < 2200, `${perf.withActors} 次`);

  console.log('\n=== 页面报错 ===');
  if (errors.length) errors.slice(0, 6).forEach((e) => console.log('   ❌ ' + e.slice(0, 150)));
  else console.log('   （无）');
  check('无页面报错', errors.length === 0, errors.length ? `${errors.length} 条` : '0 条');

  console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════`);
  console.log(`截图：${path.relative(ROOT, OUT)}`);

  await browser.close();
  await closeServer(own);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
