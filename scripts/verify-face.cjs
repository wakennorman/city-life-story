#!/usr/bin/env node
/**
 * 面部特写门禁 + 实物取证（2026-09-19）
 *
 * ── 为什么必须有这个脚本 ──────────────────────────────────────────────────
 * 恒稳要"面部特写"。而 2026-09-19 之前的取证装置（shot-actors.cjs 的
 * 3b-face-closeup-x4.png）**名字叫脸特写，实际拍到的是腿**：
 * 它把人放大 4 倍（1.72m → 6.88m），而相机 lookAt 的是玩家脚边高度
 * （p.y + 0.9），于是从 12.4m 高空俯下去只看见小腿和鞋。
 * 那张图存在了很久，一直是"人物有没有脸"的唯一证据 —— 而它从未拍到过脸。
 *
 * 这件事的教训不是"参数调错了"，而是：
 *   **"拍到了脸"这件事必须由可计算的量来判定，不能由文件名和肉眼来判定。**
 * 所以本脚本的第一职责是断言，第二职责才是截图。断言三条，全部是数：
 *   ① 相机到头心的距离 ≈ r / (fill·tan(fov/2))   —— 取景数学成立
 *   ② 相机高度 ≈ 头心高度（±0.1m）              —— **这条才能杀掉"拍成腿"**
 *   ③ 头心投影到画面中心附近，且头在画面里占 ≥45% 高度 —— 真的框住了
 * 再加一条**反向对照**：release 之后距离必须回到 ≥10m、头必须缩小到 1/6 以下。
 * 没有反向对照的门禁是假门禁（本项目已踩过两次，见 memory）。
 *
 * ── 为什么不用"图像里有没有人脸"来判 ──────────────────────────────────────
 * 那需要人脸检测，依赖外部模型，而且**它给出的恰恰是"结论"不是"判据"**。
 * 用几何量判定，失败时能直接指出是哪一条不成立（距离？高度？中心？），
 * 修法完全不同 —— 这才是门禁的价值。
 *
 * ⚠ 不得与其它浏览器脚本并行运行（会留下成片僵尸 msedge，见 memory）。
 *
 * 用法：node scripts/verify-face.cjs
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright-core');
const { EDGE, attachErrorSink } = require('./_boot.cjs');
const { ensureServer, closeServer } = require('./lib/serve.cjs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dev/_3dtest/shots-face');
const PORT = Number(process.env.PORT || 8987);
const DOC = '/dev/_3dtest/shell.html';
const PROBE = 'dev/_3dtest/bundle-probe.js';

/* 取景参数必须与 facecam.js::PORTRAIT 一致。
   ★ 故意在这里**重写一遍常量**而不是从 bundle 里 import：门禁如果读的是
     被测代码自己算出来的期望值，那它永远会通过（"自证"）。
     两处不一致时门禁会红 —— 那正是它该做的事。 */
const FILL = 0.62, FOV = 32, PITCH = 0.055;

const results = [];
function ok(name, pass, detail) {
  results.push({ name, pass: !!pass, detail });
  console.log(`  ${pass ? '✓' : '✗'} ${name}${detail ? '　→ ' + detail : ''}`);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  console.log('重建探针包…');
  execFileSync(process.execPath,
    [path.join(__dirname, 'build-3d-bundle.cjs'), '--out', PROBE],
    { cwd: ROOT, stdio: 'pipe' });

  const own = await ensureServer({ root: ROOT, port: PORT, label: '面部特写取证' });
  const browser = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  /* ★ attachErrorSink 返回的是**活数组**（page.on 往里 push），
     不是挂在 window 上的全局 —— 所以必须拿住返回值在后面读长度。 */
  const pageErrs = attachErrorSink(page);
  await page.goto(`http://127.0.0.1:${PORT}${DOC}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => !!window.Scene3D && window.__shellReady === true, { timeout: 60000 });

  /* ── 页面内投影探针 ─────────────────────────────────────────────────────
     用相机矩阵手算 NDC。**不引入 THREE**（主包刻意不导出 THREE，见 index.js），
     所以自己乘矩阵 —— 十几行，零依赖。
     ★★ 它量的是 debug.headX/Y/Z，而 facecam 现在**每帧重解**这三个值，
        所以探针量到的就是"屏幕上真正被拍到的那个头"。
        这一点很关键：facecam 的旧实现只在 focus() 解算一次，
        于是探针会对一份**过期坐标**背书 —— 断言全绿，而画面上人已经走出框
        （本轮实测踩到：路人走开后脸被挤到画面下半、下巴被切）。
        教训：断言必须量"当下的真实点"，否则它是为数据背书，不是为画面背书。 */
  await page.evaluate(() => {
    window.__faceProbe = () => {
      const v = window.__shell.view3d, c = v.camera, d = v.faceCam.debug;
      if (!d || d.headX == null) return null;
      c.updateMatrixWorld(true);
      const e = c.matrixWorldInverse.elements, p = c.projectionMatrix.elements;
      const proj = (x, y, z) => {
        const vx = e[0] * x + e[4] * y + e[8] * z + e[12];
        const vy = e[1] * x + e[5] * y + e[9] * z + e[13];
        const vz = e[2] * x + e[6] * y + e[10] * z + e[14];
        const cx = p[0] * vx + p[4] * vy + p[8] * vz + p[12];
        const cy = p[1] * vx + p[5] * vy + p[9] * vz + p[13];
        const cw = p[3] * vx + p[7] * vy + p[11] * vz + p[15];
        return { x: cx / cw, y: cy / cw };
      };
      const top = proj(d.headX, d.headY + d.r, d.headZ);
      const bot = proj(d.headX, d.headY - d.r, d.headZ);
      const mid = proj(d.headX, d.headY, d.headZ);
      /* 脸的可见宽度：球面上 ±0.0742m 对应贴图 u∈0.125~0.375 那段。 */
      const a = proj(d.headX - 0.0742, d.headY, d.headZ);
      const b = proj(d.headX + 0.0742, d.headY, d.headZ);
      return {
        headFrac: Math.abs(top.y - bot.y) / 2,   // NDC 高 2 = 整个画面高
        midX: mid.x, midY: mid.y,
        facePx: Math.abs(a.x - b.x) / 2 * window.innerHeight * c.aspect,
      };
    };
  });

  const settle = (frames = 40) => page.evaluate((n) => new Promise((r) => {
    let i = 0;
    const f = () => (++i >= n ? r(i) : requestAnimationFrame(f));
    requestAnimationFrame(f);
  }), frames);
  const shot = async (name) => {
    await settle(10);
    await page.screenshot({ path: path.join(OUT, name) });
    console.log(`  · ${name}`);
  };
  const V = () => page.evaluate(() => window.__shell.view3d.faceCam.debug);
  /* 等过渡真正走完 —— 用**读数**等，不用固定 sleep。
     固定 sleep 在不同机器上会得到不同结果，那时测到的是机器快慢而不是功能。 */
  const waitFace = (want, timeout = 8000) => page.waitForFunction(
    (w) => {
      const d = window.__shell.view3d.faceCam.debug;
      return d && (w ? d.t > 0.995 : d.t < 0.005);
    }, want, { timeout });

  console.log('\n── ① 加载地点 + 强制生成 4 种脸型 ──');
  const lane = await page.evaluate(() => {
    const spec = window.Scene3D.SPECS || {};
    const id = Object.keys(spec).find((k) => spec[k].layout === 'lane');
    if (id) window.__shell.loadLocation(id);
    /* 强制把 4 种脸型 + 4 张法线都生成出来：
       正常游玩要靠"人多"碰齐 4 种，而门禁不该依赖概率。 */
    for (let v = 0; v < 4; v++) { window.Scene3D.faceTexture(v); window.Scene3D.faceNormal(v); }
    return id || null;
  });
  await settle(60);
  console.log(`     地点 ${lane}`);

  const fd = await page.evaluate(() => window.Scene3D.faceDebug());
  console.log(`     faceDebug ${JSON.stringify(fd)}`);
  ok('脸贴图分辨率 ≥ 1024 宽（2 倍超采样生效）', fd.texW >= 1024 && fd.texH >= 512,
    `${fd.texW}×${fd.texH}（设计空间 ${fd.desW}×${fd.desH} × ${fd.ss}）`);
  ok('4 种脸型全部生成', fd.variants === 4, `variants=${fd.variants}`);
  ok('每种脸型都有对应法线贴图', fd.normalVariants === fd.variants,
    `normalVariants=${fd.normalVariants}/${fd.variants}`);
  /* 脸只占 u∈(0.125,0.375) → 0.25 × 贴图宽。这条是"特写下够不够清晰"的
     唯一**可算**判据；512 时代这个数是 128，特写下必然糊。 */
  ok('脸可用像素宽 ≥ 256（512 时代只有 128）', fd.facePxW >= 256, `facePxW=${fd.facePxW}`);

  console.log('\n── ② 取景数学（裸坐标，不依赖场景）──');
  await page.evaluate(() => window.__shell.view3d.faceFocus({ x: 0, z: 0, y: 1.60, r: 0.105, yaw: 0 }));
  await waitFace(true);
  const m1 = await V();
  const want1 = 0.105 / (FILL * Math.tan((FOV / 2) * Math.PI / 180));
  ok('相机到头心距离 = r/(fill·tan(fov/2))', Math.abs(m1.camDist - want1) < 0.012,
    `实测 ${m1.camDist}m · 期望 ${want1.toFixed(3)}m`);
  /* ★★ 这条是杀掉"拍成腿"的那一条：机位必须落在**头的视平线**上。
     旧装置 lookAt(p.y+0.9) 而人放大 4 倍后头在 6.4m → 相机比头低 11m。 */
  ok('相机高度 ≈ 头心高度（视平线机位）', Math.abs(m1.camY - m1.headY) < 0.1,
    `camY=${m1.camY} · headY=${m1.headY}`);
  ok('肖像 FOV 生效', m1.fov === FOV, `fov=${m1.fov}`);
  ok('近裁剪面压到 0.05（否则 0.59m 处头会被裁掉）', m1.near === 0.05, `near=${m1.near}`);
  ok('遮挡回避已关闭（否则 0.7m 余量会把机位拉到 0.35m）', m1.avoid === false, `avoid=${m1.avoid}`);

  /* 投影：头在画面里的占比 / 是否居中 / 脸的屏幕宽度。 */
  const frame1 = await page.evaluate(() => window.__faceProbe());
  ok('头心投影在画面中心（±0.06 NDC）',
    Math.abs(frame1.midX) < 0.06 && Math.abs(frame1.midY) < 0.06,
    `mid=(${frame1.midX.toFixed(3)}, ${frame1.midY.toFixed(3)})`);
  ok('头占画面高度 ≥ 45%', frame1.headFrac >= 0.45, `${(frame1.headFrac * 100).toFixed(1)}%`);

  /* 贴图拉伸倍率：脸在屏幕上被拉多少倍。
     这个数是"清晰度"的**真实**度量 —— 期望 ≤2.2（512 时代是 4.3）。 */
  const faceTexPx = fd.facePxW;
  ok('脸贴图拉伸 ≤ 2.2 倍（512 时代为 4.3 倍）', frame1.facePx / faceTexPx <= 2.2,
    `屏幕 ${frame1.facePx.toFixed(0)}px / 贴图 ${faceTexPx}px = ${(frame1.facePx / faceTexPx).toFixed(2)}×`);

  await page.screenshot({ path: path.join(OUT, 'face-math-closeup.png') });
  console.log('  · face-math-closeup.png');

  console.log('\n── ③ 反向对照：release 必须真的回到跟随机位 ──');
  await page.evaluate(() => window.__shell.view3d.faceRelease());
  await waitFace(false);
  await settle(10);
  const m2 = await V();
  const frame2 = await page.evaluate(() => window.__faceProbe());
  ok('release 后相机脱离头心（≥10m）', m2.camDist >= 10, `${m2.camDist}m`);
  ok('release 后 FOV 还原到 46', m2.fov === 46, `fov=${m2.fov}`);
  ok('release 后近裁剪面还原到 0.5', m2.near === 0.5, `near=${m2.near}`);
  ok('release 后遮挡回避恢复（跟随视角不穿墙）', m2.avoid === true, `avoid=${m2.avoid}`);
  ok('反向对照：特写/跟随的头占比相差 ≥6 倍',
    frame1.headFrac / Math.max(1e-6, frame2.headFrac) >= 6,
    `${(frame1.headFrac * 100).toFixed(1)}% vs ${(frame2.headFrac * 100).toFixed(2)}%`);

  console.log('\n── ④ 舞台：4 种脸型逐个特写（真实 buildHuman）──');
  const staged = await page.evaluate(() => {
    const S = window.Scene3D, v = window.__shell.view3d;
    for (const o of window.__stagedFace || []) o.parent && o.parent.remove(o);
    let seed = 20260919;
    const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    /* 摆位靠真实机位推，不猜相机在哪一侧（本项目吃过"猜方向"的亏）。 */
    const C = v.cameraPos, P = v.playerPos;
    let fx = P.x - C.x, fz = P.z - C.z;
    const fl = Math.hypot(fx, fz) || 1; fx /= fl; fz /= fl;
    const rx = fz, rz = -fx;
    const bx = C.x + fx * fl * 0.55, bz = C.z + fz * fl * 0.55;
    const made = [];
    for (let i = 0; i < 6; i++) {
      const o = S.buildHuman(rng, 1.0);
      const lat = (i - 2.5) * 1.5;
      o.position.set(bx + rx * lat, 0, bz + rz * lat);
      o.rotation.y = Math.atan2(C.x - o.position.x, C.z - o.position.z);
      v.scene.add(o);
      made.push(o);
    }
    window.__stagedFace = made;
    /* 顺便把"人形有没有把头心交给相机"这条读出来 —— facecam 全靠它。 */
    const h = made[0].userData.head;
    return { n: made.length, head: h ? { y: h.y, r: h.r } : null };
  });
  console.log(`     摆位 ${staged.n} 人 · userData.head=${JSON.stringify(staged.head)}`);
  ok('人形声明了头心与半径（facecam 取景的唯一真源）',
    !!staged.head && Math.abs(staged.head.y - 1.60) < 1e-6 && staged.head.r > 0.105,
    `y=${staged.head && staged.head.y} · r=${staged.head && staged.head.r}`);

  for (let i = 0; i < 4; i++) {
    await page.evaluate((k) => window.__shell.view3d.faceFocus(window.__stagedFace[k]), i);
    await waitFace(true);
    const mi = await V();
    const want = mi.r / (FILL * Math.tan((FOV / 2) * Math.PI / 180));
    ok(`#${i} 取景关系成立且机位在视平线`,
      Math.abs(mi.camDist - want) < 0.012 && Math.abs(mi.camY - mi.headY) < 0.1,
      `dist=${mi.camDist}（期望 ${want.toFixed(3)}）· camY=${mi.camY} headY=${mi.headY}`);
    await shot(`face-v${i}.png`);
  }

  /* ── ④b 侧面像 ────────────────────────────────────────────────────────
     ★ 为什么必须有一张侧脸：正面看不到"头是个球、头发是个盖子"这件事 ——
       正面只暴露五官，而轮廓缺陷（颅型、发际线、帽檐）**只在侧面成立**。
       取景用 side=π/2 把机位摆到面部轴线的 90°，就是纯侧脸。 */
  await page.evaluate(() => window.__shell.view3d.faceFocus(window.__stagedFace[0], { side: Math.PI / 2 }));
  await waitFace(true);
  await shot('face-profile.png');
  await page.evaluate(() => window.__shell.view3d.faceRelease());
  await waitFace(false, 6000).catch(() => {});
  await page.evaluate(() => window.__shell.view3d.faceRelease());
  await waitFace(false);
  /* 把玩家挪到一个行人旁边，验证"F 键找最近的人"这一条真实链路。 */
  const near = await page.evaluate(() => {
    const v = window.__shell.view3d;
    const peds = [];
    v.scene.traverse((o) => { if (o.userData && o.userData.__actorKind === 'ped') peds.push(o); });
    if (!peds.length) return null;
    const p = peds[0];
    v.teleport(p.position.x + 1.8, p.position.z + 1.8);
    return { x: p.position.x, z: p.position.z };
  });
  if (near) {
    await settle(30);
    await shot('face-ingame-before.png');
    const hit = await page.evaluate(() => window.__shell.view3d.faceNearest());
    await waitFace(true, 6000).catch(() => {});
    const m3 = await V();
    ok('F 键路径能锁定并推到人脸上', hit === true && m3.camDist != null && m3.camDist < 1.0,
      `hit=${hit} · camDist=${m3.camDist}`);
    /* ★ 游戏内路径也要查"框住了没有" —— 上一轮这里只查了距离，
       于是"距离对了、但人被挤到画面下半、下巴被切"这种事它抓不到。 */
    const f3 = await page.evaluate(() => window.__faceProbe());
    ok('游戏内路径：头心居中且占画面 ≥45%',
      Math.abs(f3.midX) < 0.10 && Math.abs(f3.midY) < 0.10 && f3.headFrac >= 0.45,
      `mid=(${f3.midX.toFixed(3)}, ${f3.midY.toFixed(3)}) · 占比 ${(f3.headFrac * 100).toFixed(1)}%`);
    await shot('face-ingame-closeup.png');
    /* 走 bridge 的 key() 钩子而不是直接 release —— 那才是"按 F 两次"的真实路径
       （key() 里的 KeyF 分支若写错，这样才抓得到）。 */
    await page.evaluate(() => window.__shell.view3d.key('KeyF'));
    await waitFace(false, 6000).catch(() => {});
    await shot('face-ingame-back.png');
  } else {
    ok('F 键路径能锁定并推到人脸上', false, '场景里没找到行人');
  }

  console.log('\n── ⑥ 跟踪移动目标（本轮实测 bug 的护栏）──');
  /* ★★ 这一节的存在理由写清楚：facecam 的**第一版**只在 focus() 里解算一次头心，
     而项目里的路人一直在走 —— 过渡（0.42s）还没走完，人已经走出取景框。
     更糟的是当时所有取景断言**全绿**：它们量的是 focus 时存下的那份坐标。
     所以这里必须：① 量"当下真实投影"；② 让被测对象真的在移动（否则测试是空的）。 */
  await page.evaluate(() => window.__shell.view3d.faceRelease());
  await waitFace(false, 6000).catch(() => {});
  const walk = await page.evaluate(() => {
    const v = window.__shell.view3d;
    let ped = null;
    v.scene.traverse((o) => { if (!ped && o.userData && o.userData.__actorKind === 'ped') ped = o; });
    if (!ped) return null;
    /* 站到它侧后方 2m：这个距离在 faceNearest 的 14m 内，
       而相机最终会跑到它脸前 —— 所以玩家站在哪不影响构图。 */
    v.teleport(ped.position.x + 1.4, ped.position.z + 1.4);
    return { x: ped.position.x, z: ped.position.z };
  });
  if (walk) {
    await page.evaluate(() => {
      const v = window.__shell.view3d;
      let ped = null;
      v.scene.traverse((o) => { if (!ped && o.userData && o.userData.__actorKind === 'ped') ped = o; });
      window.__trackTarget = ped;
      v.faceFocus(ped);
    });
    await waitFace(true, 6000).catch(() => {});
    const samples = [];
    for (let i = 0; i < 4; i++) {
      await settle(20);
      const s = await page.evaluate(() => {
        const o = window.__trackTarget;
        const p = window.__faceProbe();
        return p ? { ...p, ox: o.position.x, oz: o.position.z } : null;
      });
      if (s) samples.push(s);
    }
    const moved = samples.length >= 2
      ? Math.hypot(samples[samples.length - 1].ox - samples[0].ox, samples[samples.length - 1].oz - samples[0].oz)
      : 0;
    const worst = samples.reduce((a, s) => Math.max(a, Math.abs(s.midX), Math.abs(s.midY)), 0);
    const minFrac = samples.reduce((a, s) => Math.min(a, s.headFrac), 1);
    /* 对照先行：被测对象在采样期间必须真的走过一段，
       否则"头像始终居中"这件事可能只是因为**它压根没动**（空测试）。 */
    ok('对照：被测路人确实在移动（否则本节是空测试）', moved > 0.05,
      `采样期间位移 ${moved.toFixed(3)}m`);
    ok('移动中头像始终居中（±0.12 NDC）', samples.length >= 2 && worst < 0.12,
      `最大偏移 ${worst.toFixed(3)}（${samples.length} 次采样）`);
    ok('移动中头始终占画面 ≥45%', samples.length >= 2 && minFrac >= 0.45,
      `最小占比 ${(minFrac * 100).toFixed(1)}%`);
    await shot('face-tracking-walk.png');
  } else {
    ok('对照：被测路人确实在移动（否则本节是空测试）', false, '场景里没找到路人');
  }

  ok('页面无 JS 错误', !pageErrs.length,
    pageErrs.length ? pageErrs.slice(0, 3).join(' | ').slice(0, 300) : '0 条');

  await browser.close();
  if (own) await closeServer();

  const bad = results.filter((r) => !r.pass);
  console.log(`\n═══ 面部特写：${results.length - bad.length} / ${results.length} 通过 ═══`);
  if (bad.length) {
    console.log('失败项：');
    for (const b of bad) console.log(`  ✗ ${b.name}　${b.detail || ''}`);
  }
  console.log(`截图 → ${path.relative(ROOT, OUT)}`);
  process.exit(bad.length ? 1 : 0);
})().catch((e) => {
  console.error('取证脚本自身异常：', e && e.stack || e);
  process.exit(2);
});
