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
     场景里还有建筑/道具，混在一起数不出"这个人像不像人"。
     ★ 2026-09-19：五官从"6 个碎件网格"改成"一张脸贴图"（原因见
       actors.js::faceTexture 顶注 —— 原来的眼球半径 1.9cm 且被头发盖住）。
       所以"数眼部球体"这条断言已经**过时**，改成查脸的**贴图与方位**：
       方位查不出来，"脸长在后脑勺"就是个静默缺陷（不报错、不崩）。 */
  console.log('① 人形外观（不是无脸胶囊）');
  const body = await page.evaluate(() => {
    const S = window.Scene3D;
    let seed = 12345;
    const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const g = S.buildHuman(rng, 1);
    /* ★ 脸的画布尺寸**必须问实现**，不能在这里抄一份魔数。
       踩过（2026-09-19）：actors.js 给脸加了 4 倍超采样（FACE_SS=2，画布
       512×256 → 1024×512），而这里还写着 `width === 512` ——
       于是"头上有脸贴图"直接判成"没有带头贴图的材质"，
       后面两条取像素的断言也跟着 null。**产品是好的，是断言过期了。**
       这正是本项目反复强调的"判据必须来自单一真源"：
       尺寸抄一份、采样倍率再抄一份，改一处忘一处就假红（或更糟：假绿）。 */
    const FD = S.faceDebug();
    let meshes = 0;
    const geos = [];
    let faceMat = null, faceMeshY = null;
    g.traverse((o) => {
      if (!o.isMesh) return;
      meshes++;
      geos.push(o.geometry.parameters || {});
      /* 带头贴图的材质 = 脸。同时记下它挂在哪个 y（头的世界高度）。 */
      if (o.material && o.material.map && o.material.map.image
        && o.material.map.image.width === FD.texW && o.material.map.image.height === FD.texH) {
        faceMat = o.material.map;
        faceMeshY = o.position.y;
      }
    });
    const feet = geos.filter((p) => p.width !== undefined && p.depth !== undefined
      && Math.abs(p.width - 0.105) < 1e-6 && Math.abs(p.depth - 0.225) < 1e-6).length;
    const hands = geos.filter((p) => p.radius !== undefined && p.radius > 0.045 && p.radius < 0.055).length;

    /* ★ 脸的方位必须**从贴图里量**，不能看代码里的数字。
       方法：把脸贴图按球面 UV 反查两个世界方向上的像素——
         眼睛处应为深色（画了眼睛），后脑（phi=3π/2，即 -Z）处应为纯白（没画东西）。
       写反了（脸画到 -Z）这条立刻红。
       canvas 的 getImageData 在 512×256 上很便宜。 */
    let eyeDark = null, backWhite = null;
    if (faceMat && faceMat.image) {
      const c = faceMat.image;
      const ctx2 = c.getContext('2d');
      /* ★ faceX / faceY 返回的是**设计空间**坐标（512×256），而画布按 FACE_SS
         放大过 —— 取样前必须乘同一个倍率，否则取到的是画布左上角那一小块
         （纯白底），"眼睛是深色"会假红、"后脑留白"会假绿。倍率同样问 faceDebug()。 */
      const px = (x, y) => {
        const d = ctx2.getImageData(Math.round(x * FD.ss), Math.round(y * FD.ss), 1, 1).data;
        return (d[0] + d[1] + d[2]) / 3;
      };
      /* 眼睛：世界 (±0.040, 1.622) → 画布坐标（用 actors.js 同款公式）。 */
      eyeDark = px(S.faceX(0.040, 1.622), S.faceY(1.622));
      /* 后脑：u = 0.75（phi=3π/2 即 -Z）。整行取三个点看有没有被画过东西。 */
      const b1 = px(0.75 * FD.desW, S.faceY(1.60));
      const b2 = px(0.75 * FD.desW, S.faceY(1.66));
      const b3 = px(0.75 * FD.desW, S.faceY(1.55));
      backWhite = (b1 + b2 + b3) / 3;
    }
    void faceMeshY;

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
      meshes, feet, hands, height: +(maxY - minY).toFixed(3),
      hasFaceMap: !!faceMat,
      faceW: faceMat && faceMat.image ? faceMat.image.width : 0,
      faceH: faceMat && faceMat.image ? faceMat.image.height : 0,
      eyeDark, backWhite,
      handMinY: handsP.length ? Math.min(...handsP.map((p) => p.y)) : null,
      feetMaxY: feetP.length ? Math.max(...feetP.map((p) => p.y)) : null,
      handAttached: handsP.length > 0 && handsP.every((p) => p.attached),
      footAttached: feetP.length > 0 && feetP.every((p) => p.attached),
    };
  });
  check('人形有完整的部件（≥10 个网格）', body.meshes >= 10, `${body.meshes} 个`);
  check('★ 头上有脸贴图（五官画在贴图上，不是碎件网格）', body.hasFaceMap === true,
    body.hasFaceMap ? `${body.faceW}×${body.faceH}` : '没有带头贴图的材质');
  /* ★ 这两条是"脸有没有画对地方"的唯一守卫：
       眼睛处必须明显比后脑暗（画了眼睛 vs 后脑留白）。
       脸画到后脑、或 UV 方位算反，这条立刻红 —— 而从代码上完全看不出来。 */
  check('★ 脸画在正面（眼睛处是深色）',
    body.eyeDark !== null && body.eyeDark < 170, `眼部灰度 ${body.eyeDark}`);
  check('★ 后脑是留白的（没有把脸画满一圈）',
    body.backWhite !== null && body.backWhite > 200, `后脑灰度 ${body.backWhite}`);
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

  /* ══ ①b 角色贴图（衣物 / 车）—— 2026-09-19 新增段落 ══════════════════════
     贴图"生成了"与"真的挂上了、画对了"是三件事，而**三件都不报错**：
     材质没挂 map 时角色只是"纯色"；贴图画错行时角色只是"衣服缺了下摆"。
     本节新增当天就抓到三处这类静默失效（都是"代码逐行看全对"）：
       · 下摆用 vm(0.945)（把"比例"当"米"传）→ 算出 432px，超出 256px 画布，
         fillRect 高度为负 → **下摆整个没画上去**；
       · 裤脚卷边同样的错 → 296px → **卷边没画上去**；
       · 卷边/膝部用 source-over 画白色 → 白底叠白 = **一个像素都没变**。
     三者都只能靠"量贴图像素"发现。所以下面不看代码，直接对贴图取样比对。
     取样一律用 4×4 小方块平均，避开颗粒噪声与虚线明线。 */
  console.log('\n①b 角色贴图（衣物 / 车）');
  const skin = await page.evaluate(() => {
    const S = window.Scene3D;
    const d = S.charSkinDebug();
    let seed = 12345;
    const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const g = S.buildHuman(rng, 1);

    const byName = {};
    let torsoThetaStart = null;
    /* ★ 认躯干**不能**用"是个有 radiusTop/radiusBottom 的圆柱"：
       脖子（0.09m）与帽子（0.022m）也是圆柱，遍历顺序上排在躯干之后，
       会把躯干的结果**覆盖**掉 —— 实测就是这样拿到 thetaStart = 0 的假红。
       改按高度认：整个角色里只有躯干的高度是 0.56m。 */
    const TORSO_H = d.geom.TORSO_H;
    g.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const p = o.geometry && o.geometry.parameters;
      if (p && p.radiusTop !== undefined && Math.abs((p.height || 0) - TORSO_H) < 1e-6) {
        torsoThetaStart = p.thetaStart;
      }
      if (o.material.map) byName[o.material.map.name] = o.material.map;
    });

    const avg = (tex, x, y, w = 4, h = 4) => {
      const c2 = tex.image.getContext('2d');
      const px = c2.getImageData(Math.round(x), Math.round(y), w, h).data;
      let s = 0;
      for (let i = 0; i < px.length; i += 4) s += (px[i] + px[i + 1] + px[i + 2]) / 3;
      return +(s / (px.length / 4)).toFixed(1);
    };

    const top = byName['charskin:tee'] || byName['charskin:shirt'] || byName['charskin:jacket'];
    const pants = byName['charskin:pants'];
    const out = {
      hasTop: !!top, hasSleeve: !!byName['charskin:sleeve'],
      hasPants: !!pants, hasSkin: !!byName['charskin:skin'],
      topName: top ? top.name : null,
      torsoThetaStart,
      texCount: d.textures, matCount: d.materials,
      carUvRemapped: d.carUvRemapped, carUvFaces: d.carUvFaces, carUvRects: d.carUvRects,
      sizes: d.sizes,
    };
    if (top) {
      /* 领口：正面（u≈0.45）在这一行应已进领口，背面（u≈0.02）还没进 ——
         因为领深是"前深后浅"。写反了（前浅后深）这条立刻红。 */
      out.collarFront = avg(top, 116, 20);
      out.collarBack = avg(top, 4, 20);
      /* 下摆：最底行必须明显比腰线暗（画了压暗带）。 */
      out.hemBottom = avg(top, 40, 250);
      out.hemMid = avg(top, 40, 150);
    }
    if (pants) {
      /* 侧缝：u=0.25（x=64）必须比邻域暗。 */
      out.seamAt = avg(pants, 63, 128);
      out.seamOff = avg(pants, 40, 128);
      /* 裤脚折痕：卷边分界的那条硬线必须存在。 */
      out.cuffCrease = avg(pants, 40, 227, 8, 3);
      out.cuffMid = avg(pants, 40, 150);
      /* 膝部磨白：中段应比上段亮（加法提亮）。 */
      out.kneePeak = avg(pants, 20, 175);
      out.kneeAbove = avg(pants, 20, 100);
    }
    return out;
  });
  check('★ 躯干挂了上衣贴图（不是纯色圆柱）', skin.hasTop === true,
    skin.hasTop ? skin.topName : '没有任何带 charskin: 前缀的贴图');
  check('★ 手臂/腿/皮肤各有独立贴图（不是共用一份）',
    skin.hasSleeve && skin.hasPants && skin.hasSkin,
    `袖 ${skin.hasSleeve ? '✓' : '✗'} · 裤 ${skin.hasPants ? '✓' : '✗'} · 皮肤 ${skin.hasSkin ? '✓' : '✗'}`);
  /* ★ 这条守的是"正面落在画布接缝上"——躯干 thetaStart 忘了改成 π 时，
     门襟与领口会被劈成两半甩到左右两侧，而从代码上完全看不出来。 */
  check('★ 躯干 thetaStart = π（正面落在画布正中，不在接缝上）',
    skin.torsoThetaStart !== null && Math.abs(skin.torsoThetaStart - Math.PI) < 1e-6,
    `thetaStart = ${skin.torsoThetaStart}`);
  check('★ 领口前深后浅（背面没画成一片黑）',
    skin.collarFront != null && skin.collarBack != null
    && skin.collarBack - skin.collarFront > 20,
    `正面 ${skin.collarFront} · 背面 ${skin.collarBack}`);
  /* ★ 下摆那条：把"比例当米用"的写法挡在门外 —— 没有它，下摆整条是空的。 */
  check('★ 下摆画出来了（底部明显比腰部暗）',
    skin.hemBottom != null && skin.hemMid - skin.hemBottom > 20,
    `腰部 ${skin.hemMid} · 下摆 ${skin.hemBottom}`);
  check('★ 裤侧缝画出来了（u=0.25 比邻域暗）',
    skin.seamAt != null && skin.seamOff - skin.seamAt > 15,
    `缝上 ${skin.seamAt} · 缝旁 ${skin.seamOff}`);
  check('★ 裤脚卷边画出来了（折痕存在）',
    skin.cuffCrease != null && skin.cuffMid - skin.cuffCrease > 20,
    `裤面 ${skin.cuffMid} · 折痕 ${skin.cuffCrease}`);
  check('★ 膝部磨白真的变亮了（加法提亮，不是白底叠白）',
    skin.kneePeak != null && skin.kneePeak - skin.kneeAbove > 8,
    `上段 ${skin.kneeAbove} · 膝部 ${skin.kneePeak}`);
  /* ★ 车身：BoxGeometry 六个面的 uv 默认全是 0..1 ——
     重映射没跑的话，车头上会长出车门缝，而且**完全看不出来是错的**。
     这里直接读重映射后的 uv 区域，断言六面确实落在图集的不同区里。 */
  const cr = skin.carUvRects || {};
  const keys = Object.keys(cr);
  /* ★ 比较要**整个矩形**比，不能只比 u 原点：
     侧面与车头的 u 原点都是 0（都贴在图集左缘），
     只比 u0 会得到"两者相同"的假红。 */
  const sameRect = (a, b) => !!a && !!b && a.length === b.length
    && a.every((v, i) => Math.abs(v - b[i]) < 1e-9);
  const sameSide = sameRect(cr.px, cr.nx);
  const frontDiff = !!cr.pz && !!cr.px && !sameRect(cr.pz, cr.px);
  check('★ 车身六面重映射到图集（六个区都在）',
    skin.carUvRemapped === true && skin.carUvFaces === 6 && keys.length === 6,
    `重映射 ${skin.carUvRemapped} · 面数 ${skin.carUvFaces} · 区数 ${keys.length}`);
  check('★ 车侧面左右共用一区（天然镜像）、车头与侧面不同区',
    !!sameSide && !!frontDiff,
    `px=${JSON.stringify(cr.px)} · pz=${JSON.stringify(cr.pz)}`);
  check('贴图与材质有缓存（不是每个角色都新建一份）',
    skin.texCount > 0 && skin.matCount > 0 && skin.matCount < 60,
    `${skin.texCount} 张纹理 / ${skin.matCount} 份材质`);

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
      /* ★ 第三个分量是**尾巴的摆动相位**（2026-09-19）。
         为什么动物的活性不能只看位移：猫有长达 6 秒的静止期，
         "蹲着不动"正是它该有的样子。只查位移就会把"正常的猫"
         判成"僵死的猫"，而这条断言的本意恰恰是抓"update 没接进主循环"。
         尾巴由 `a.phase += dt*4.5` 驱动 —— 只要 _updCat/_updDog 在跑，
         它就一定在摆；主循环断了，位移和尾巴会**同时**冻住。
         所以"位移 或 尾巴在摆"才是这个物种真正的活性信号，不是放水。 */
      const tl = o.userData.tail;
      (out[a] || (out[a] = [])).push([
        +o.position.x.toFixed(3), +o.position.z.toFixed(3),
        tl ? +tl.rotation.z.toFixed(4) : 0,
      ]);
    });
    return out;
  });
  const s1 = await sample();
  const adv = await advanceSim(1.8);
  const s2 = await sample();
  /* ★ 动物需要**更长的专属窗口**：狗会走动、猫有长静止期，
     1.8s 撞进静止期就是假红（实测：城中村只有 1 只猫，一个窗口 0/1）。
     再推一段、两段取并集 —— 这条断言的本意是"动物会动"，
     不是"任意 1.8s 窗口里都在动"。 */
  const advAnimal = await advanceSim(3.2);
  const s3 = await sample();
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
  /* 动物：两个窗口取并集，任意一段有位移即算"会动"。
     ★ 为什么不直接放宽位移阈值：0.05m 是对的（低于它分不清"在走"和"抖动"），
       真正错的是**观察窗太短**。放宽阈值会让"动物其实冻住了"也变绿 —— 那是假通过。 */
  const animalAcross = (k) => {
    const A = s1[k] || [], B = s2[k] || [], C = s3[k] || [];
    let any = 0, byMove = 0, byTail = 0;
    for (let i = 0; i < A.length; i++) {
      const d1 = B[i] ? Math.hypot(B[i][0] - A[i][0], B[i][1] - A[i][1]) : 0;
      const d2 = (B[i] && C[i]) ? Math.hypot(C[i][0] - B[i][0], C[i][1] - B[i][1]) : 0;
      const moved = Math.max(d1, d2) > 0.05;
      /* 尾巴摆动量取两段窗口的最大值（同位移的处理方式）。 */
      const t1 = B[i] ? Math.abs(B[i][2] - A[i][2]) : 0;
      const t2 = (B[i] && C[i]) ? Math.abs(C[i][2] - B[i][2]) : 0;
      const swayed = Math.max(t1, t2) > 0.02;
      if (moved) byMove++;
      if (swayed) byTail++;
      if (moved || swayed) any++;
    }
    return { any, n: A.length, byMove, byTail };
  };
  const anim = { dog: animalAcross('dog'), cat: animalAcross('cat') };
  check('动物活着（走动 或 蹲着摆尾）',
    anim.dog.any > 0 || anim.cat.any > 0,
    `狗 ${anim.dog.any}/${anim.dog.n}(走${anim.dog.byMove}/摆尾${anim.dog.byTail}) · `
    + `猫 ${anim.cat.any}/${anim.cat.n}(走${anim.cat.byMove}/摆尾${anim.cat.byTail})`
    + `（两段窗口 ${adv.sim}+${advAnimal.sim}s 仿真）`);
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
    let n = 0, minAbsX = Infinity, maxAbsX = -Infinity;
    for (const o of grp.children) {
      if (o.userData.__actorKind !== 'ped') continue;
      n++;
      const ax = Math.abs(o.position.x);
      minAbsX = Math.min(minAbsX, ax);
      maxAbsX = Math.max(maxAbsX, ax);
    }
    return {
      n,
      minAbsX: minAbsX === Infinity ? null : +minAbsX.toFixed(2),
      maxAbsX: maxAbsX === -Infinity ? null : +maxAbsX.toFixed(2),
      laneHalf: window.__shell.view3d.actors.layoutHalf || null,
    };
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
    /* ★ 上限同样重要：原来只查下限，于是"所有人都贴在路沿/楼里"照样全绿。
       实测踩过：行人带公式退化成一条线，17 个人全站在 |x|≈4.75~4.93 ——
       正是恒稳看到的"人贴着墙走、像穿墙"。所以必须同时卡住外沿。 */
    check('★ 没有行人贴在路沿外（最大 |x| 有上限）',
      pedCheck.maxAbsX !== null && pedCheck.maxAbsX < pedCheck.laneHalf - 0.3,
      `离路沿最近的一个人 |x|=${pedCheck.maxAbsX}m（路沿 ${pedCheck.laneHalf}m）`);
  }

  /* ── ⑤-b ★ 穿模守卫：角色不得落在任何碰撞盒内 ──
     ★ 这是恒稳反馈「人物、车辆可以直接穿墙而过」的直接守卫。
     之前 colliders 一路传进 actors.js 却**一次都没被读过**，
     而当时所有断言都只查"位置合不合理"，没有一条查"是不是在墙里" ——
     所以这个缺陷可以一直存在且全绿。
     判据：把每个角色的包围圆与全部碰撞盒求交，交了的必须为 0。
     为了让"刚好擦着墙走"不被误判，半径取角色的**碰撞半径**而不是视觉半径。

     ★★ 但"眼下 0 个在盒里"这一句**单独成立时并不能证明守卫在工作**：
        如果这次根本没有角色生在盒里（换个地点就可能发生），
        断言照样通过 —— 那是假绿。所以这里并排三条互补判据：
          (1) 眼下 0 个在盒内                     ← 结果对不对
          (2) 出生解算账 stuckSpawns === 0        ← 解算有没有卡住
          (3) **解算活性自检**：给一个已知在盒内的点，必须得到干净落点
                                                  ← 机制是不是活的
        (3) 与"数据恰好没触发"完全无关，是唯一能证伪"机制死了"的一条。 */
  console.log('\n⑤-b ★ 穿模守卫（角色不得落在碰撞盒内）');
  const clip = await page.evaluate(() => {
    const v = window.__shell.view3d;
    const sc = v.scene;
    const grp = sc.children.find((g) => g.name === 'actors');
    if (!grp) return { err: '找不到 actors 组' };
    /* 碰撞盒从场景读：bridge 把它们挂在 scene.userData.__colliders 上
       （与 wires 同一个入口，都是给验证用的读数）。 */
    const cols = sc.userData.__colliders || [];
    if (!cols.length) {
      /* ★ 空数组有两种成因，修法完全不同，必须能分开：
         (a) bridge 没导出这个读数 → 改 bridge；
         (b) world 本来就产出 0 个碰撞盒 → 改 world.js，而且此时
             "穿模守卫"是**静默失效**的（0 个盒 ∩ 任何角色 = 空集 → 永远通过）。 */
      return {
        err: '场景里没有碰撞盒读数（bridge 未导出）',
        diag: {
          有该字段: '__colliders' in sc.userData,
          电线条数: (sc.userData.wires || []).length,
          actors内在盒数: window.__shell.view3d.actors.colliders,
          同一场景: window.__shell.view3d.scene === sc,
        },
      };
    }
    /* ★★ 半径取**唯一真源**（index.js 导出的 Scene3D.ACTOR_R）。
       绝不在这里抄一份 {ped:0.26,...}：actors.js 若把行人半径改成 0.34，
       而守卫仍按 0.26 量，角色半个身子插进墙里也照样全绿 —— 且不会报错。
       取不到就直接判红（"唯一真源缺失"本身就是缺陷），不做数值兜底。 */
    const R = window.Scene3D && window.Scene3D.ACTOR_R;
    if (!R) return { err: 'Scene3D.ACTOR_R 未导出（碰撞半径唯一真源缺失）' };
    const bad = [];
    let checked = 0;
    for (const o of grp.children) {
      const k = o.userData.__actorKind;
      if (!R[k]) continue;
      checked++;
      const x = o.position.x, z = o.position.z;
      for (const c of cols) {
        if (x > c.minX - R[k] && x < c.maxX + R[k] && z > c.minZ - R[k] && z < c.maxZ + R[k]) {
          /* ★ 必须报出**撞的是哪个盒** —— 只说"在墙里"是查不下去的：
             撞到建筑（w/d 大）是摆放错误，撞到摊位/电线杆（w/d 小）
             则可能是"摊主本来就站在自己摊位上"，两者修法完全不同。 */
          bad.push({
            k, x: +x.toFixed(2), z: +z.toFixed(2),
            box: { w: +(c.maxX - c.minX).toFixed(2), d: +(c.maxZ - c.minZ).toFixed(2) },
            /* ★ tag 必报：撞建筑（摆放错误）与撞墙根道具（锚点被顶）
               修法完全不同，不给 tag 就只能靠猜。 */
            tag: c.tag || 'untagged',
          });
          break;
        }
      }
    }
    const A = v.actors;
    /* (3) 活性自检：拿**已知在盒内**的点喂给解算口。
       取"靠街心那一面往里缩 0.1m"的点（而不是盒中心）——
       因为盒中心距面可能有 4m，超出解算的 maxPush=1.8m，
       那会得到"推不动"，而那是**用例本身不合理**，不是机制坏了。 */
    const small = cols.filter((c) => (c.maxX - c.minX) * (c.maxZ - c.minZ) < 12);
    let tried = 0, resolved = 0, firstFail = null;
    for (const c of small.slice(0, 24)) {
      const faceX = Math.abs(c.minX) < Math.abs(c.maxX) ? c.minX : c.maxX;
      const cx = faceX + (faceX === c.minX ? 0.1 : -0.1);
      const cz = (c.minZ + c.maxZ) / 2;
      const r = v.__probeSpawnResolve(cx, cz);
      if (!r || !r.blocked0) continue;   /* 起点竟不在盒内 → 该盒不可用于本用例 */
      tried++;
      if (!r.blocked1) resolved++;
      else if (!firstFail) firstFail = { w: +(c.maxX - c.minX).toFixed(2), d: +(c.maxZ - c.minZ).toFixed(2) };
    }
    return {
      checked, bad, nCols: cols.length,
      spawn: { pushedSpawns: A.pushedSpawns, stuckSpawns: A.stuckSpawns },
      probe: { tried, resolved, firstFail },
    };
  });
  if (clip.err) {
    check('碰撞盒读数可用', false,
      clip.err + (clip.diag ? ' ｜ ' + JSON.stringify(clip.diag) : ''));
  } else {
    check('碰撞盒已导出到场景（供穿模守卫使用）', clip.nCols > 0, `${clip.nCols} 个盒`);
    /* ★ 锚点收口必须真的跑过（2026-09-19）。
       world.js::Ctx.resolveAnchors 把落在道具/建筑里的锚点让开；
       若调用点被删、或它自己失效，"摊位又站进墙里"只能靠穿模守卫间接推出。
       这里同时给出 pushed / stuck 两个读数，把两类失败分开：
         stuck > 0 → 有锚点被彻底堵死，**要改布局**，不是继续加大让位距离。 */
    const ap = await page.evaluate(() => ({
      pushed: window.__shell.view3d.actors.anchorPushed,
      stuck: window.__shell.view3d.actors.anchorStuck,
      n: window.__shell.view3d.actors.anchors,
    }));
    check('锚点收口已执行且无"堵死"的锚点', ap.stuck === 0,
      `锚点 ${ap.n} 个 · 让位 ${ap.pushed} 个 · 堵死 ${ap.stuck} 个`);
    check('★ 没有任何角色落在碰撞盒内（穿墙守卫）', clip.bad.length === 0,
      clip.bad.length
        ? `${clip.bad.length}/${clip.checked} 个在墙里：` + clip.bad.slice(0, 5).map((b) => `${b.k}(${b.x},${b.z}) 撞盒${b.box.w}x${b.box.d}`).join(' ')
        : `${clip.checked} 个角色全部在墙外`);
    check('★ 出生解算无卡死（stuckSpawns === 0）', clip.spawn.stuckSpawns === 0,
      `推出去 ${clip.spawn.pushedSpawns} 个，卡住 ${clip.spawn.stuckSpawns} 个`);
    check('★ 出生解算机制是活的（已知盒内点能被推出）', clip.probe.resolved > 0,
      clip.probe.tried === 0
        ? '没有任何可用小盒 → 本用例无意义（等同守卫跑不起来）'
        : `试了 ${clip.probe.tried} 个盒内点，干净落点 ${clip.probe.resolved} 个`
          + (clip.probe.firstFail ? `，首个失败盒 ${clip.probe.firstFail.w}x${clip.probe.firstFail.d}` : ''));
  }

  /* ── ⑤-c ★ 电线不得穿在建筑里 ──
     恒稳反馈「街道上很乱，特别是电线混在一起了」。
     根因是杆位 x = ±(half+0.6) 落在建筑轮廓内（建筑近面在 half+0.05~0.6）。
     电线会被 mergeStatics 合批、合批后无法从场景树逐条核对，
     所以 world.js 把每条线的两端登记进 ctx.wires，bridge 转存到场景上。 */
  console.log('\n⑤-c ★ 电线布局（不得穿在建筑轮廓内）');
  const wires = await page.evaluate(() => {
    const sc = window.__shell.view3d.scene;
    const ws = sc.userData.wires || [];
    const cols = sc.userData.__colliders || [];
    /* 建筑盒：★ 用 colliders 上的 `tag` 判，而不是"边长 > 3m"的尺寸启发式
       （2026-09-19）。尺寸启发式会把"大型摊位/围墙"也算成建筑，
       也会因为某天冒出个 3m 的道具而悄悄把判据挪掉 —— 判据必须是**语义**的。
       world.js::place 现在给每个盒子写了 tag（bld:low / bld:hero / stall / pole…），
       让"这堵墙是不是楼"由登记方自己说，而不是由验证脚本猜。 */
    const big = cols.filter((c) => String(c.tag || '').startsWith('bld:'));
    let inside = 0;
    for (const w of ws) {
      /* 两端各自落在建筑盒的水平范围内 = 线插在楼里。 */
      for (const [x, z] of [[w.ax, w.az], [w.bx, w.bz]]) {
        if (big.some((c) => x > c.minX && x < c.maxX && z > c.minZ && z < c.maxZ)) { inside++; break; }
      }
    }
    /* 同一条线两端是否等高（不等高的跨街线就是"混在一起"的主要来源）。 */
    let uneven = 0;
    for (const w of ws) if (Math.abs(w.ay - w.by) > 0.35) uneven++;
    return { n: ws.length, inside, uneven, bigBoxes: big.length };
  });
  check('取到飞线读数', wires.n > 0, `${wires.n} 条`);
  check('★ 没有飞线插在建筑里', wires.inside === 0,
    wires.inside ? `${wires.inside}/${wires.n} 条线端点在建筑内` : `${wires.n} 条全部在建筑外`);
  check('★ 跨街线两端等高（不是斜挂的乱麻）', wires.uneven === 0,
    wires.uneven ? `${wires.uneven} 条不等高` : '全部等高或沿街');

  /* ── ⑤-d ★ 车道走廊：静态碰撞盒不得压到机动车道 ──
     ★ 这是恒稳反馈「车辆停在路上一动不动」的直接守卫（2026-09-19 定位）。
     根因不是车流逻辑，而是 **world.js 把垃圾桶/垃圾箱/电线杆按"整条路宽"
     随机撒**（sp(-half, half, …)），落在了车道中央 —— 车流的前向避障发现
     障碍就停，于是车永久停死，且页面**不报任何错**。
     症状极具迷惑性：车流代码逐行看都对、方向/靠右/跟车断言全绿，
     只有"车有没有真的动"这条能抓到它 —— 而那正是 ③ 里那条时红时绿的断言。

     ★ 为什么这里判的是 carClearance（硬线）而不是 corridor（带留白的建造线）：
       corridor = carClearance + 0.15。窄巷里有些件（转过角的高压杆，
       包围盒半宽 1.3m）挤不进留白区，但外沿仍远在车的实际半径之外，不挡车。
       若按 corridor 判，就会为 0.02~0.06m 的浮点级差报红 —— 假红与假绿
       一样会让人不再相信断言。两条线的定义与理由见 road.js::carCorridor。

     ★ 读数取自 scene.userData.__carClearance，而它由 world.js 计算、
       公式来自 road.js —— 与 actors.js 的车流避障**同一个来源**。
       守卫绝不自己再抄一份近似值：那正是"两套判定分叉"的起点。
     活性自检：读数缺失/为 0 时直接判红（不能静默通过）。 */
  console.log('\n⑤-d ★ 车道走廊（静态盒不得压到机动车道）');
  const corridorProbe = () => page.evaluate(() => {
    const sc = window.__shell.view3d.scene;
    const cols = sc.userData.__colliders || [];
    const hard = sc.userData.__carClearance || 0;
    const A = window.__shell.view3d.actors;
    const bad = [];
    for (const c of cols) {
      /* 盒离街心最近的那条边 */
      const inner = Math.min(Math.abs(c.minX), Math.abs(c.maxX));
      if (hard > 0 && inner < hard - 1e-9) {
        bad.push({
          tag: c.tag || 'untagged', inner: +inner.toFixed(3),
          w: +(c.maxX - c.minX).toFixed(2), d: +(c.maxZ - c.minZ).toFixed(2),
        });
      }
    }
    return {
      id: window.__shell.locationId,
      hard: +hard.toFixed(2), soft: +(sc.userData.__corridor || 0).toFixed(2),
      n: cols.length, bad,
      /* 兜底账目：pushed = 原本会伸进车道、被推回路沿的件数；
         stuck = 推到路沿仍放不下的（软越线，不挡车，仅供参考）。 */
      pushed: A.corridorPushed || 0, stuck: A.corridorStuck || 0,
      clamped: A.corridorClamped || 0,
    };
  });
  const laneCorr = await corridorProbe();
  const laneLocId = laneCorr.id;
  check('★ 车道走廊读数可用（巷弄）', laneCorr.hard > 0,
    laneCorr.hard > 0
      ? `硬线 |x|<${laneCorr.hard}（建造线 ${laneCorr.soft}）· 采样区间被挖 ${laneCorr.clamped} 次 · 兜底推开 ${laneCorr.pushed} 件`
      : '★ 车流硬线读数为 0 —— 守卫会**静默通过**（这正是最危险的情况）');
  check('★ 巷弄：没有静态盒压到机动车道', laneCorr.hard > 0 && laneCorr.bad.length === 0,
    laneCorr.bad.length
      ? `${laneCorr.bad.length}/${laneCorr.n} 个盒越线：`
        + laneCorr.bad.slice(0, 4).map((b) => `${b.tag}(|x|=${b.inner}, ${b.w}x${b.d})`).join(' ')
      : `${laneCorr.n} 个盒全部在车道外（硬线 ${laneCorr.hard}）`);
  /* 大道另验一遍：车道中心 = min(roadW*0.25, half-3.6)，与巷弄是**两个值**，
     只验巷弄会漏掉"大道上 half 大、留白被吃光"这一类。 */
  const avenueId = await page.evaluate(() => {
    const spec = (window.Scene3D && window.Scene3D.SPECS) || {};
    return Object.keys(spec).find((k) => spec[k].layout === 'avenue') || null;
  });
  if (avenueId) {
    await page.evaluate((id) => window.__shell.loadLocation(id), avenueId);
    const aveCorr = await corridorProbe();
    check('★ 大道：没有静态盒压到机动车道', aveCorr.hard > 0 && aveCorr.bad.length === 0,
      aveCorr.bad.length
        ? `${aveCorr.bad.length}/${aveCorr.n} 个盒越线：`
          + aveCorr.bad.slice(0, 4).map((b) => `${b.tag}(|x|=${b.inner}, ${b.w}x${b.d})`).join(' ')
        : `${aveCorr.n} 个盒全部在车道外（硬线 ${aveCorr.hard}，建造线 ${aveCorr.soft}）`);
    /* ★ 切回巷弄：⑥ 要拿"巷弄车流少"做对照，留在大道上会让它失去意义。 */
    await page.evaluate((id) => window.__shell.loadLocation(id), laneLocId);
  } else {
    check('★ 大道：找到 avenue 地点', false, '找不到 avenue 布局的地点，本用例无法覆盖');
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
    /* ★ 先把测量点固定下来，否则这条断言是在掷硬币。
       ⑨ 走的是**真实玩家路径**（点托盘行动），玩家可能因此换了地点 ——
       于是"这次量在大道、上次量在城中村"，同一个 420 阈值量的根本不是
       同一件事。实测：脚本一字未改，两次分别读到 +415 / +471，
       差值全部来自地点（slum 的角色比大道多），不来自代码。
       强制回到一个确定的 lane 地点，让这个数字可跨运行比较。 */
    const spec = (window.Scene3D && window.Scene3D.SPECS) || {};
    const laneId = Object.keys(spec).find((k) => spec[k].layout === 'lane');
    if (laneId && window.__shell.locationId !== laneId) {
      window.__shell.loadLocation(laneId);
      for (let i = 0; i < 4; i++) await frame();
    }
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
    /* ★ 命名 NPC 是 2026-09-19 新增的一层，必须**单独量**它的增量：
       否则它吃的是"匿名人流/车流"那条护栏的额度，匿名侧一旦退化，
       总数被命名 NPC 撑着，护栏照样全绿 —— 那就是假通过。
       隐藏整棵角色对象（名牌 sprite 是 obj 的子节点，会一起隐藏）。 */
    let namedAdded = 0, namedCount = 0;
    if (grp) {
      const named = grp.children.filter((o) => o.userData.__actorKind === 'npc');
      namedCount = named.length;
      for (const o of named) o.visible = false;
      await frame();
      /* 取 max(0,·)：帧间 draw call 本身有 ±2 抖动，0 人时会量到负数，
         报出来只会让人误以为"隐藏命名 NPC 反而多画了 2 次"。 */
      namedAdded = Math.max(0, withActors - v.stats.calls);
      for (const o of named) o.visible = true;
      await frame();
    }
    /* ★ 必须连"在哪量的"一起报：draw call 增量随地点剧变
       （城中村 vs 大道，角色数量差一倍），不写出地点的话，
       同一个数字这次和下次根本不是一回事，也就无从判断回归。 */
    /* 阴影 LOD 的取舍读数（见 actors.js::update 末尾）。 */
    const sh = { on: v.actors.shadowOn, off: v.actors.shadowOff, total: v.actors.shadowTotal };
    /* ★ 同一帧、同一地点量"关掉 LOD 会多出多少次" —— 这是这次优化**确切**
       的收益归属。没有这一步，只能说"现在是 359，记忆里是 442"，
       而地点不同、期间还夹着别的改动，因果并不成立。 */
    let noLod = null;
    if (typeof v.__setShadowLod === 'function') {
      v.__setShadowLod(false);
      await frame();
      noLod = v.stats.calls;
      v.__setShadowLod(true);
      for (let i = 0; i < 3; i++) await frame();  /* 让 LOD 重新评估到位 */
    }
    return { withActors, withoutActors, added: withActors - withoutActors,
             actorMeshes, namedAdded, namedCount, locId: window.__shell.locationId,
             shadow: sh, noLod, lodSaved: noLod === null ? null : noLod - withActors };
  });
  console.log(`     归因：场景本体 ${perf.withoutActors} 次 · 角色系统 +${perf.added} 次`
    + `（${perf.actorMeshes} 个网格 · 地点 ${perf.locId}）`);
  console.log(`     再拆分：匿名角色 +${perf.added - perf.namedAdded} 次 ·`
    + ` 命名 NPC +${perf.namedAdded} 次（${perf.namedCount} 人）`);
  console.log(`     阴影 LOD：仍投影 ${perf.shadow.on} 人 · 已停投影 ${perf.shadow.off} 人`
    + `（合计 ${perf.shadow.total}）`);
  if (perf.lodSaved !== null) {
    console.log(`     LOD 收益（同地点同帧对照）：关掉 LOD 为 ${perf.noLod} 次，`
      + `开 LOD 为 ${perf.withActors} 次 → 省下 ${perf.lodSaved} 次 draw call`);
  }
  /* ★ 断言的是**增量**而不是绝对总量 —— 绝对总量里绝大部分是场景本体的开销
     （城中村实测约 1500 次，那是 world.js 的水位，与角色系统无关）。
     拿一个够不到的绝对阈值卡自己，只会得到"改不动就调阈值"的坏习惯。
     ★ 新增系统顶红时**分账、不抬阈值**：匿名侧继续守原来的 <420，
       命名 NPC 单列一条预算，由它自己那条断言负责。 */
  check('匿名角色增量可控（< 420 次 draw call，不含命名 NPC）',
    perf.added - perf.namedAdded < 420, `+${perf.added - perf.namedAdded} 次`);
  /* 16 次/人 = 实测（1 张名牌 sprite + 约 13 个躯干网格）留的余量。
     超了通常是：名牌没走缓存（每人一张新贴图）或人形几何没复用。 */
  check('命名 NPC 增量符合单列预算（≤ 16 次/人）',
    perf.namedAdded <= 16 * Math.max(1, perf.namedCount),
    `+${perf.namedAdded} 次 / ${perf.namedCount} 人`);
  check('开启角色后总量未失控（< 2200，防角色侧回归）',
    perf.withActors < 2200, `${perf.withActors} 次`);
  /* ★ 阴影 LOD 的**判别性**断言：两侧都必须有数。
     只查 shadowOff > 0 是不够的 —— 一个"距离门算错、全员恒关"的实现
     （街上一个人影都没有）会让这个断言漂亮地通过。反过来，
     恒开的实现则 shadowOff === 0。**两侧同时 > 0** 才说明这个门真的
     在按距离取舍，而不是被短路成了全开或全关。 */
  check('★ 阴影 LOD 真的在按距离取舍（开/关两侧都非空）',
    perf.shadow.on > 0 && perf.shadow.off > 0,
    `开 ${perf.shadow.on} / 关 ${perf.shadow.off}（合计 ${perf.shadow.total}）`);
  /* ★ 收益断言：关掉 LOD 必须**确实更贵**。若这条为红，说明 LOD 关的是
     一群本来就不投影的网格（比如把鸟/虫算进去了），"优化"是假的。 */
  check('★ 阴影 LOD 有可测收益（关掉后 draw call 上升）',
    perf.lodSaved !== null && perf.lodSaved > 0,
    perf.lodSaved === null ? '开关口缺失，无法对照' : `省下 ${perf.lodSaved} 次`);

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
