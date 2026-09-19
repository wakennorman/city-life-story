#!/usr/bin/env node
/**
 * Poly Haven 摆放取证截图。
 *
 * ── 为什么需要这个脚本 ─────────────────────────────────────────────────
 *   资产下载了、打包了、加载器也验证通过了 —— 但**用户看到的还是旧模型**。
 *   这中间的断点是"资产有没有真的被摆进场景"。
 *   前面所有验证都在测加载器，没有一条在测"场景树里有没有这些东西"。
 *
 *   所以本脚本反过来做：进游戏 → 切到城中村 → **数场景里的 GLB 实例**，
 *   每一个都带 userData.glb.source === 'polyhaven'。
 *   计数 > 0 才说明摆放那段代码真的执行了（而不是被某个 return 早退掉了）。
 *   再配合截图，给"看得见"这件事留证据。
 *
 * 用法：node scripts/shot-polyhaven-placement.cjs
 */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright-core');
const { EDGE } = require('./_boot.cjs');
const { ensureServer, closeServer } = require('./lib/serve.cjs');

const PORT = Number(process.env.PORT || 8987);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dev/_3dtest/shots-polyhaven');
/* ★ 用 shell 探针页而不是 index.html。
   为什么：真实游戏的 3D 场景是**懒创建**的（要点开 3D 浮层才 createGame3D），
   直接开 index.html 会停在欢迎页，Scene3D 永远不出现 ——
   那样测出来的 0 个实例是假象，不是缺陷。
   探针页加载同一份 bundle-probe.js，且一上来就 loadLocation('slum')，
   场景树和正式游戏完全一致。（它与 §验证脚本 里其它取证脚本同一套路。） */
const DOC = '/dev/_3dtest/shell.html';
const PROBE = 'dev/_3dtest/bundle-probe.js';

let pass = 0, fail = 0;
function check(name, ok, detail) {
  (ok ? pass++ : fail++);
  console.log(`  ${ok ? '✅' : '❌'} ${name}${detail ? `  — ${detail}` : ''}`);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  /* ★ 必须重建探针包：它加载的是 bundle-probe.js（构建产物），
     不是源码。改了 world.js/kit.js 却不重建，测的就是旧代码。 */
  console.log('重建探针包…');
  require('child_process').execFileSync(process.execPath,
    [path.join(__dirname, 'build-3d-bundle.cjs'), '--out', PROBE], { cwd: ROOT, stdio: 'pipe' });

  const own = await ensureServer({ root: ROOT, port: PORT, label: 'Poly Haven 摆放取证' });
  const browser = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`http://127.0.0.1:${PORT}${DOC}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => !!window.Scene3D && window.__shellReady === true, { timeout: 60000 });
  await page.waitForTimeout(2500);

  console.log('Poly Haven 摆放取证\n');

  /* ── 确认当前 layout 真的含摆放分支 ──
     ★ 为什么先断言这个：world.js 的 Poly Haven 摆放按 kind 分支
       （lane 有消防梯/高压杆/铁丝网，avenue 有路障/卷帘门）。
       若停在 compound/yard 之类，会得到 0 个实例但代码其实没错。
       先锁定 layout，后面的 0 才是真缺陷。
       ★ 取 layout 的正确来源是 SPECS[id].layout。
         LAYOUT_KIND 是**中文标签表**（lane→'巷弄'），不是 id→kind 的映射 ——
         早先照名字猜成后者，于是永远拿到 null（自己写错的假失败）。 */
  const lay = await page.evaluate(() => {
    const S = window.Scene3D;
    const id = window.__shell.locationId;
    const spec = (S.SPECS || {})[id] || null;
    return { id, kind: spec ? spec.layout : null };
  });
  check('停在含摆放分支的 layout（lane/avenue）',
    lay.kind === 'lane' || lay.kind === 'avenue',
    `地点 ${lay.id} · layout=${lay.kind}`);

  /* ── 重新加载一次地点，确保在"资产已就绪"的稳定态下清点 ──
     ★ 为什么要多这一步：首屏那次 loadLocation 跑在资产回来**之前**，
       那一刻登记的包装还只有兜底，清点会低估（甚至为 0）。
       真实的用户体验正是"进游戏 → 切一次地点 → 细节才齐"，
       所以这里显式复现那一次切换，测的是用户实际会看到的状态。
       顺带验证"重载不泄漏"：pending 必须再次收敛到 0。 */
  await page.evaluate(() => {
    window.__shell.loadLocation(window.__shell.locationId);
  });
  await page.waitForFunction(() => {
    const S = window.Scene3D;
    return S.pendingAssetCount && S.pendingAssetCount() === 0;
  }, { timeout: 40000, polling: 300 }).catch(() => {});
  await page.waitForTimeout(1500);

  /* ── 数场景树里的 Poly Haven 实例 ──
     ★ 判据用 userData.glb.source —— 这是 glbProp 自己写的字段，
       不是我们事后猜的。数量 > 0 = 摆放代码真的跑了。
       同时数"还停在兜底"的（source 已登记但 ready=false），
       因为那代表"摆了但没换上"（也是缺陷，只是形态不同）。 */
  const counts = await page.evaluate(() => {
    const S = window.Scene3D;
    const found = { polyhaven: {}, kenney: {}, fallbackWaiting: 0, total: 0 };
    let nodes = 0;
    const walk = (o, depth) => {
      if (!o || depth > 60) return;
      nodes++;
      const g = o.userData && o.userData.glb;
      if (g && g.ready) {
        found.total++;
        const key = g.name || g.kit;
        if (g.source === 'polyhaven') found.polyhaven[key] = (found.polyhaven[key] || 0) + 1;
        else found.kenney[key] = (found.kenney[key] || 0) + 1;
      } else if (g && !g.ready) found.fallbackWaiting++;
      const cs = o.children || [];
      for (let i = 0; i < cs.length; i++) walk(cs[i], depth + 1);
    };
    /* ★ 场景根：__shell.view3d 是外壳内部持有的 createGame3D 实例，
       它的 `scene` getter 给出真正的 THREE.Scene。
       （__shell 本身不转发 scene —— 只有 view3d / assets / debug。）
       拿不到就 hasRoot=false，不做"遍历 DOM"那类无效兜底。 */
    const v = window.__shell && window.__shell.view3d;
    const rootObj = (v && v.scene) || null;
    if (rootObj) walk(rootObj, 0);
    return { found, nodes, hasRoot: !!rootObj,
      pending: S.pendingAssetCount ? S.pendingAssetCount() : -1,
      dropped: S.lastDroppedAssets ? S.lastDroppedAssets() : -1 };
  });

  const phTotal = Object.values(counts.found.polyhaven).reduce((a, b) => a + b, 0);
  const phKinds = Object.keys(counts.found.polyhaven).length;
  if (!counts.hasRoot) {
    check('能遍历到场景树', false, '拿不到场景根（需要 view3d.scene）');
  } else {
    check('能遍历到场景树', true, `${counts.nodes} 个节点`);
    check('场景里真的有 Poly Haven 实例', phTotal > 0,
      phTotal ? Object.entries(counts.found.polyhaven).map(([k, v]) => `${k}×${v}`).join(', ')
        : '0 个 —— 摆放没生效');
    /* ★ 数"种类"而不只是"总数"：只摆上消防栓(1 种)×20 也算"有实例"，
       但那说明其余 8 个工厂的调用点全都早退了。种类数才能证明
       消防栓/落水管/卷帘/消防梯/高压杆/铁丝网/路障几条支线都真的执行了。 */
    check('Poly Haven 实例种类 ≥ 3（不是某一件刷屏）', phKinds >= 3,
      phKinds ? `${phKinds} 种` : '0 种');
    /* ★ 关于 dropped>0：这是**正常**的，不是缺陷。
       本次流程刻意重载了一次地点 —— 首屏那次构建登记的 4 个包装
       随旧世界一起被摘掉，pumpAssets 把它们的登记项扫了出去。
       这正是"自愈"该有的行为（否则它们会永远 pending）。
       真正要守的不变式是下面这条：**当前场景里不能有卡在兜底的项**。
       用"树里未 ready 的包装数"来判断，才是与树一致的口径。 */
    check('当前场景里没有卡在兜底的资产包装（摆了但没换上）',
      counts.found.fallbackWaiting === 0,
      `未换上 ${counts.found.fallbackWaiting} 个 · 本轮清理过期登记 ${counts.dropped} 个`);
    check('待回填已收敛到 0（没有永远 pending 的登记项）',
      counts.pending === 0, `pending=${counts.pending}`);
  }

  await page.screenshot({ path: path.join(OUT, '1-lane-polyhaven.png') });

  console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════`);
  console.log(`截图：${path.relative(ROOT, OUT)}`);

  await browser.close();
  await closeServer(own);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
