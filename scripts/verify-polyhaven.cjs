#!/usr/bin/env node
/**
 * Poly Haven 资产接入验证。
 *
 * ── 这个脚本存在的理由 ────────────────────────────────────────────────────
 *   外部资产接入最容易"假通过"：模型 404 了、路径错了、尺寸大了 8 倍 ——
 *   **全都不报错**。加载器设计成"永不 reject"，调用方降级到程序化几何，
 *   于是画面照常渲染，只是那些细节**静默消失**了。
 *   所以这里的断言必须能区分"真的用上了 Poly Haven 模型"与
 *   "悄悄退回了兜底几何"。
 *
 *   具体做法：
 *     ① 断言加载状态是 ready（不是 failed / pending）
 *     ② 断言**实测尺寸**与清单里的米制尺寸一致（±5%）——
 *        这条能直接抓住"缩放系数错了"这类缺陷
 *     ③ 断言缩放系数是 ×1（不是 Kenney 的 ×8）—— 两源不能混
 *     ④ 断言附属文件（.bin / textures/*.jpg）真的被请求了
 *        —— 抓"只下了主 .gltf"这个最隐蔽的缺陷
 *     ⑤ 断言 Kenney 那条路没被打破（回归）
 *
 * 用法：node scripts/verify-polyhaven.cjs
 */

const path = require('path');
const http = require('http');
const fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright-core');
const { EDGE, attachErrorSink } = require('./_boot.cjs');

const PORT = Number(process.env.PORT || 8983);
const ROOT = path.resolve(__dirname, '..');
const DOC = '/dev/_3dtest/assets-probe.html';
const PROBE = 'dev/_3dtest/bundle-probe.js';

/* ★ 必须先重建探针包再测。
   为什么不省这一步：探针页加载的是 `bundle-probe.js` —— 那是**构建产物**，
   不是源码。改了 assets.js 却不重建，测的就是**旧代码**，
   结论会是"我明明改了却没生效"（本项目反复踩过：用旧代码验证新代码）。 */
function rebuild() {
  console.log('重建探针包（避免用旧代码验证新代码）…');
  execFileSync(process.execPath, [path.join(__dirname, 'build-3d-bundle.cjs'), '--out', PROBE], { cwd: ROOT, stdio: 'pipe' });
}

let pass = 0, fail = 0;
const failures = [];
function check(name, ok, detail) {
  if (ok) { pass++; console.log(`  ✅ ${name}${detail ? '  — ' + detail : ''}`); }
  else { fail++; failures.push(name); console.log(`  ❌ ${name}${detail ? '  — ' + detail : ''}`); }
}

/* ══ ⓪ 磁盘层：资产在盘 + 台账自洽 ═══════════════════════════════════════════
 *
 * ★ 为什么这一节必须存在，且必须**排在浏览器之前**（2026-09-19 补）
 *
 *   本脚本原先只测"运行时载入对不对"，于是漏掉了一整类失效：
 *   **资产根本不在仓库里**。而它的症状恰恰是"看起来一切正常"——
 *   `gen-polyhaven-manifest.cjs` 是**扫描目录**生成清单的，目录空 → 清单空 →
 *   `python build.py` 成功 → 页面能开 → **只是满城没有卷帘门和电线杆，不报错**。
 *   实测过的状态：13 个 GLB（79MB）+ 4 个 HDRI（5.8MB）长期只在某台机器磁盘上，
 *   git 里一个都没有（2026-09-19 已补齐入库）。
 *
 *   为什么排在浏览器之前：这一节**不需要浏览器**，几毫秒就能给结论。
 *   台账过期这种问题，不该让人等 30 秒的 SwiftShader 跑完才知道。
 *
 *   为什么不从被测对象读期望值：断言里写死的 13 / 4 来自
 *   `fetch-polyhaven.cjs` 的下载清单。从被测系统读期望值再跟它自己比，
 *   永远绿（本项目 §62 标本⑪ 的老坑）。
 */
const PH_ROOT = path.join(ROOT, 'src/assets/polyhaven');
const PH_MODELS = path.join(PH_ROOT, 'models');
const PH_HDRI = path.join(PH_ROOT, 'hdri');

function checkAssetsOnDisk() {
  console.log('⓪ 磁盘层：资产在盘 + 台账自洽（不依赖浏览器，先跑）');

  /* ① 台账与磁盘逐条自洽（bytes + md5）。
        走生成器的 --check —— 复用它，避免"门禁自己重算一遍 md5"产生第二套真相。 */
  let ledgerOk = true, ledgerOut = '';
  try {
    execFileSync(process.execPath, [path.join(__dirname, 'gen-asset-ledger.cjs'), '--check'],
      { cwd: ROOT, stdio: 'pipe' });
  } catch (e) {
    ledgerOk = false;
    ledgerOut = (String(e.stdout || '') + String(e.stderr || '')).trim().split('\n').slice(-4).join(' / ');
  }
  check('资产台账与磁盘自洽（逐条 md5）', ledgerOk, ledgerOut || '全部一致');

  /* ② 盘上真的有那么多个。这一条与 ① 互补：
        台账可能"自洽"却只记了 3 个（如果生成器被改坏了），
        所以数量要跟**写死的期望值**比，不跟台账比。 */
  const nModels = fs.existsSync(PH_MODELS)
    ? fs.readdirSync(PH_MODELS).filter((d) => fs.statSync(path.join(PH_MODELS, d)).isDirectory()).length : 0;
  const nHdri = fs.existsSync(PH_HDRI)
    ? fs.readdirSync(PH_HDRI).filter((f) => /\.hdr$/i.test(f)).length : 0;
  check('13 个模型目录在盘', nModels === 13, `实际 ${nModels}`);
  check('4 个 HDRI 在盘', nHdri === 4, `实际 ${nHdri}`);

  /* ③ 每个模型目录里真的有单文件 .glb（打包真的发生过）。
        抓"只剩 .gltf/.bin 没打包"或"打包到一半"这类中间态。 */
  const missing = [];
  if (fs.existsSync(PH_MODELS)) {
    for (const d of fs.readdirSync(PH_MODELS)) {
      if (!fs.statSync(path.join(PH_MODELS, d)).isDirectory()) continue;
      if (!fs.existsSync(path.join(PH_MODELS, d, d + '.glb'))) missing.push(d);
    }
  }
  check('每个模型目录都有同名单文件 .glb', missing.length === 0, missing.join(', ') || '13/13');

  /* ④ 台账条目数 == 盘上资产数（抓"台账漏登记"）。
        反过来"台账多登记"由 ① 的 --check 覆盖（会报「已消失」）。 */
  let nLedger = -1;
  try {
    nLedger = JSON.parse(fs.readFileSync(path.join(PH_ROOT, 'assets-ledger.json'), 'utf8')).assets.length;
  } catch (_) { /* 台账缺失/坏掉 → ① 已报红，这里只记 -1 */ }
  check('台账条目数 == 盘上资产数', nLedger === nModels + nHdri, `台账 ${nLedger} · 盘上 ${nModels + nHdri}`);
  console.log('');
}

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.hdr': 'image/vnd.radiance', '.css': 'text/css',
};

(async () => {
  console.log('Poly Haven 资产接入验证\n');

  /* ⓪ 磁盘层先跑：不需要浏览器，几毫秒出结论 —— 台账过期不该让人等 SwiftShader。 */
  checkAssetsOnDisk();

  rebuild();

  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, u);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(PORT, r));

  const browser = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage();
  const errs = attachErrorSink(page);

  try {
    await page.goto(`http://127.0.0.1:${PORT}${DOC}`, { waitUntil: 'load', timeout: 60000 });
    await page.waitForFunction(() => !!window.Scene3D, { timeout: 60000 });
    await page.waitForFunction(() => window.__assetProbe && window.__assetProbe.ready, { timeout: 60000 }).catch(() => {});
    /* 等预热有结果 —— 探针页 start() 里发起。给足时间（单个模型 2-17MB）。 */
    await page.waitForTimeout(6000);

    console.log('① 清单已内联、分组正确、资产根正确');
    const man = await page.evaluate(() => {
      const S = window.Scene3D;
      /* ★ 走**顶层导出**，不走 S.assets。
         为什么：`createGame3D` 与 `create3DShell` 都产出名为 `assets` 的键，
         `S.assets` 解析到 shell 那个（getter 不存在）→ 拿到 null，
         于是这条断言长期假失败（真凶不是被测代码）。顶层导出是构建脚本
         显式挂上去的清单查询接口，唯一且稳定。 */
      if (!S.listPolyHaven) return null;
      const all = S.listPolyHaven();
      const groupOf = (g) => S.polyHavenGroup(g);
      const groups = ['detail', 'structure', 'road', 'facade'].filter((g) => groupOf(g).length > 0);
      return {
        total: all.length,
        detail: groupOf('detail').map((e) => e.name),
        facade: groupOf('facade').map((e) => e.name),
        groupNames: groups,
        hdri: S.listHdri().map((h) => h.name).sort(),
        base: S.assetBase ? S.assetBase() : null,
      };
    });
    if (!man) {
      check('Scene3D 暴露了 Poly Haven 清单接口', false, 'Scene3D.listPolyHaven 不可用');
    } else {
      check('清单已内联（13 个模型）', man.total === 13, `实际 ${man.total}`);
      check('4 个分组齐全', man.groupNames.length === 4, man.groupNames.join(', '));
      check('detail 组含卷帘门与消防栓',
        man.detail.includes('rollershutter-door') && man.detail.includes('fire-hydrant'),
        man.detail.join(', '));
      check('facade 组含两个建筑立面', man.facade.length === 2, man.facade.join(', '));
      check('HDRI 四时段齐全', man.hdri.length === 4, man.hdri.join(', '));
      check('资产根是 assets/（不是 assets/kenney/）', man.base === '/src/assets/', `base=${man.base}`);
    }

    console.log('\n② 模型真的载入（不是静默降级）');
    const loaded = await page.evaluate(async () => {
      const L = window.__assetLoader;
      if (!L) return { err: 'window.__assetLoader 未暴露（无法取证）' };
      const names = ['rollershutter-door', 'fire-hydrant', 'electricity-poles', 'fire-escape', 'chainlink-fence', 'apartments-facade'];
      await Promise.all(names.map((n) => L.load('polyhaven', n, n)));
      const out = {};
      for (const n of names) {
        const proto = L.get('polyhaven', n, n);
        if (!proto) { out[n] = null; continue; }
        /* 实测包围盒：遍历几何的 boundingBox，不依赖 THREE 全局。 */
        let mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
        proto.updateMatrixWorld(true);
        proto.traverse((o) => {
          if (!o.isMesh || !o.geometry) return;
          if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
          const b = o.geometry.boundingBox;
          if (!b) return;
          for (const p of [b.min, b.max]) {
            mn[0] = Math.min(mn[0], p.x); mn[1] = Math.min(mn[1], p.y); mn[2] = Math.min(mn[2], p.z);
            mx[0] = Math.max(mx[0], p.x); mx[1] = Math.max(mx[1], p.y); mx[2] = Math.max(mx[2], p.z);
          }
        });
        out[n] = { w: +(mx[0] - mn[0]).toFixed(3), h: +(mx[1] - mn[1]).toFixed(3), d: +(mx[2] - mn[2]).toFixed(3) };
      }
      return { out, report: L.report() };
    });

    if (loaded.err) {
      check('资产加载器可取（__assetLoader）', false, loaded.err);
    } else {
      /* 期望值来自清单（gen 脚本实测得到）。这里**写死**是为了让断言
         独立于被测系统 —— 从被测对象读期望值再跟它自己比，永远绿。 */
      const EXPECT = {
        'rollershutter-door': 2.40,
        'fire-hydrant': 0.799,
        'electricity-poles': 10.039,
        'fire-escape': 6.466,
        'chainlink-fence': 3.468,
        'apartments-facade': 3.055,
      };
      for (const [n, expH] of Object.entries(EXPECT)) {
        const got = loaded.out[n];
        if (!got) { check(`${n} 已载入`, false, '原型为 null —— 静默降级了'); continue; }
        const diff = Math.abs(got.h - expH) / expH;
        check(`${n} 载入且尺寸正确`, diff < 0.05,
          `实测高 ${got.h}m（期望 ${expH}m，偏差 ${(diff * 100).toFixed(1)}%）`);
      }
      const r = loaded.report;
      check('加载器零失败', r.failed === 0,
        `failed=${r.failed}${r.failures && r.failures.length ? ' — ' + r.failures[0].error : ''}`);
      check('分源统计含 polyhaven', (r.bySource || {}).polyhaven > 0, JSON.stringify(r.bySource));
    }

    console.log('\n③ 缩放系数：两源不能混');
    const scale = await page.evaluate(() => {
      const L = window.__assetLoader;
      if (!L) return { err: 'no loader' };
      const ph = L.instance('polyhaven', 'fire-hydrant', 'fire-hydrant', { x: 0, z: 0 });
      const kn = L.instance('roads', 'light-square', { x: 0, z: 0 });
      return { ph: ph ? ph.scale.x : null, kn: kn ? kn.scale.x : null };
    });
    if (scale.err) {
      check('实例化可用', false, scale.err);
    } else {
      check('Poly Haven 用 ×1（米制）', scale.ph === 1, `scale=${scale.ph}`);
      /* ★ 守门断言：Kenney 走 SIZE_OVERRIDE（light-square=9.5）。
         若有人把默认缩放"统一"，这条会立刻红。 */
      check('Kenney 仍 ×9.5（未被 ×1 污染）', scale.kn === 9.5, `scale=${scale.kn}`);
    }

    console.log('\n④ 实例共享几何 + glbSourced 标记（dispose 安全）');
    const inst = await page.evaluate(() => {
      const L = window.__assetLoader;
      if (!L) return { err: 'no loader' };
      const a = L.instance('polyhaven', 'fire-hydrant', 'fire-hydrant', { x: 0, z: 0 });
      const b = L.instance('polyhaven', 'fire-hydrant', 'fire-hydrant', { x: 5, z: 0 });
      if (!a || !b) return { err: 'instance 返回 null' };
      let ga = null, gb = null;
      a.traverse((o) => { if (o.isMesh && !ga) ga = o.geometry; });
      b.traverse((o) => { if (o.isMesh && !gb) gb = o.geometry; });
      const meshes = [];
      a.traverse((o) => { if (o.isMesh) meshes.push(o); });
      return { sameGeo: ga === gb, allFlagged: meshes.length > 0 && meshes.every((o) => o.userData.glbSourced === true), meshCount: meshes.length };
    });
    if (inst.err) {
      check('实例化可用', false, inst.err);
    } else {
      check('同款多实例共享几何（省显存）', inst.sameGeo === true, `mesh 数=${inst.meshCount}`);
      check('网格已标 glbSourced（dispose 会跳过）', inst.allFlagged === true);
    }

    console.log('\n⑤ 单文件 GLB：不再依赖分离式 glTF 附属文件（IDM 拦截修复的守卫）');
    /* ★ 这条断言的方向在 2026-09-18 被**反转**了，值得记下来。
       原先是"断言 .bin / textures 被请求了" —— 那是分离式 glTF 时代的验收标准。
       但正是那些附属文件把下载管理器（IDM/迅雷/FDM）引来了：
       `.bin` 的 MIME 是 application/octet-stream，命中拦截清单，
       响应在浏览器拿到之前就被吸走 → 我们自己起的那点 204/0 字节 → GLTFLoader
       报"Failed to load buffer"或干脆静默不显示。这就是用户看到的
       "一直在唤起 IDM"。
       修法：把 gltf+bin+贴图**打包成单文件 .glb**（MIME model/gltf-binary，
       不在拦截清单里）。所以现在正确的守卫是**反向**的：
       断言这些附属文件**不再**出现（出现了说明打包被打回原形，
       IDM 拦截会复发）。 */
    const net = await page.evaluate(() => {
      const rs = performance.getEntriesByType('resource').map((e) => e.name);
      return {
        gltf: rs.filter((u) => /\.gltf(\?|$)/.test(u)).length,
        bin: rs.filter((u) => /\.bin(\?|$)/.test(u)).length,
        tex: rs.filter((u) => /polyhaven\/models\/.*\/textures\/.*\.(jpg|png)/.test(u)).length,
        glb: rs.filter((u) => /polyhaven\/models\/.*\.glb(\?|$)/.test(u)).length,
      };
    });
    check('单文件 .glb 已被请求（打包真的生效）', net.glb > 0, `${net.glb} 个`);
    check('不再请求分离式 .gltf（否则打包未生效）', net.gltf === 0, `${net.gltf} 个`);
    check('不再请求 `.bin`（IDM 拦截的元凶，必须为 0）', net.bin === 0, `${net.bin} 个`);
    check('贴图已内嵌，不再单独请求 textures/*.jpg', net.tex === 0, `${net.tex} 个`);

    console.log('\n⑥ 降级路径完好（引入新源不能打破旧行为）');
    const fb = await page.evaluate(async () => {
      const L = window.__assetLoader;
      if (!L) return { err: 'no loader' };
      let threw = null, ret = 'unset';
      try { ret = await L.load('polyhaven', '__nope__', '__nope__'); } catch (e) { threw = String(e); }
      return { threw, ret, get: L.get('polyhaven', '__nope__', '__nope__') };
    });
    if (fb.err) {
      check('降级检查可用', false, fb.err);
    } else {
      check('缺失资产不抛异常', fb.threw === null, fb.threw || '无抛错');
      check('缺失资产返回 null（调用方降级）', fb.ret === null && fb.get === null);
    }

    console.log('\n⑦ Kenney 回归：旧签名仍可用');
    const kn = await page.evaluate(async () => {
      const L = window.__assetLoader;
      if (!L) return { err: 'no loader' };
      /* 旧的两参数签名 load(kit, name) —— 生产代码大量这么写 */
      const p = await L.load('roads', 'light-square');
      return { ok: !!p, get: !!L.get('roads', 'light-square') };
    });
    if (kn.err) {
      check('Kenney 旧签名可用', false, kn.err);
    } else {
      check('load(kit, name) 旧签名仍返回模型', kn.ok && kn.get);
    }

    check('无页面报错（已滤外部新闻源）', errs.length === 0, errs.slice(0, 2).join(' | ') || '无');
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\n结果：${pass} 通过 · ${fail} 失败`);
  if (failures.length) {
    console.log('失败项：');
    failures.forEach((f) => console.log('  · ' + f));
    process.exit(1);
  }
})();
