#!/usr/bin/env node
/* ──────────────────────────────────────────────────────────────────────────────
   程序化贴图取证：把 materials.js 的地面/立面贴图渲染成接触表 PNG，
   并给出**可量化**的读数（块级明度离散度 CV），用来和参考图比。

   为什么要有这个脚本：
     改贴图时如果每次都靠"开 3D 场景 + 截图"来验证，一轮要几分钟，
     而且看到的已经是"贴图 × 光照 × 相机"的混合结果 ——
     贴图本身糊了还是暗了，判断不出来。
     这里把贴图**单独**摊开看，一轮几秒。

   ★ 为什么读数用「块级 CV」而不是目测：
     板间明度差是靠 `tone` 控制的，调大了会变成**棋盘格**，
     调小了地面变成一片死灰。目测在这个区间里分不出来，
     但把"一块板"这个尺度上的明度标准差算出来就能定位。
     实测参照：参考图《大多数》ss3.jpg 里**连没有板的沥青马路**
     块级 CV 都有 7.5% —— 说明它地面的信息量主要来自脏污杂物，
     而不是板间色差。这条读数直接决定了 slabTex 该往哪个方向改。

   用法：
     node scripts/shot-textures.cjs
     node scripts/shot-textures.cjs --ref <参考图.jpg>     # 额外打印参考图的读数
   产物：dev/_3dtest/shots-textures/contact-sheet.png + 每张单图
   ────────────────────────────────────────────────────────────────────────────── */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright-core');
const { EDGE } = require('./_boot.cjs');
const { ensureServer, closeServer } = require('./lib/serve.cjs');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dev/_3dtest/shots-textures');

/* 一块板在贴图里的像素边长 —— 与 materials.js 的 gridCount 同一套算法。
   为了不重复实现，这里直接问页面要（见下面 evaluate）。 */

/* ★★ 多尺度块级 CV（2026-09-19 修）—— 原实现用单一固定块 `width/5`，会被**混叠**骗过：
     周期性纹理与块大小对齐时，每块含等量明/暗 → 块均值全相同 → CV 读成 0。
     合成棋盘实测：块=周期→68.75%，块=2×周期→**0.00%**（完全失明）。
     真实影响：`ground.paver` 用 `width/5`(205px) 读 **0.87%**，
     多尺度真值 **5.04%（低估 6 倍）** —— 会被误判成"纯色"。
     取一组互质块大小的**最大值**，混叠就无从发生。
     （完整论证与独立门禁见 `scripts/verify-textures.cjs`） */
const BLOCK_SCALES = [9, 12, 16, 21, 25, 32];

async function blockCVAt(sharp, file, block, region) {
  let img = sharp(file).greyscale();
  if (region) img = img.extract(region);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const bx = Math.floor(W / block), by = Math.floor(H / block);
  if (!bx || !by) return null;
  const means = [];
  for (let r = 0; r < by; r++) {
    for (let q = 0; q < bx; q++) {
      let s = 0, c = 0;
      for (let y = r * block; y < (r + 1) * block; y++) {
        for (let x = q * block; x < (q + 1) * block; x++) { s += data[y * W + x]; c++; }
      }
      means.push(s / c);
    }
  }
  const m = means.reduce((a, b) => a + b, 0) / means.length;
  if (!m) return null;
  const sd = Math.sqrt(means.reduce((a, b) => a + (b - m) ** 2, 0) / means.length);
  return { mean: m, sd, cv: sd / m, block };
}

/** 多尺度取最大 —— 返回最高 CV 的那个尺度（防混叠） */
async function blockCV(sharp, file, _blockIgnored, region) {
  let best = null;
  for (const blk of BLOCK_SCALES) {
    const r = await blockCVAt(sharp, file, blk, region);
    if (r && (!best || r.cv > best.cv)) best = r;
  }
  return best;
}

(async () => {
  const refArg = process.argv.indexOf('--ref');
  const REF = refArg > -1 ? process.argv[refArg + 1] : null;

  fs.mkdirSync(OUT, { recursive: true });
  const own = await ensureServer({ root: ROOT, port: 8991, label: 'texsheet' });
  const b = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1660, height: 900 }, deviceScaleFactor: 1 });
  p.on('pageerror', (e) => console.log('[pageerror]', e.message));
  p.on('console', (m) => {
    const t = m.text();
    if (m.type() === 'error' && !/favicon|404/.test(t)) console.log('[console]', t.slice(0, 300));
  });
  await p.goto('http://127.0.0.1:8991/dev/_3dtest/textures.html', { waitUntil: 'load', timeout: 60000 });
  await p.waitForFunction(() => window.__texSheetDone, { timeout: 60000 });

  const timings = await p.evaluate(() => window.__texTimings || []);
  const full = await p.evaluate(() => window.__texFull || {});
  await p.screenshot({ path: path.join(OUT, 'contact-sheet.png'), fullPage: true });

  /* 逐张落盘**原生分辨率** —— 缩略图会把板缝（2~3px）糊掉，
     而"缝清不清楚"正是地面像不像铺装的关键。 */
  const names = Object.keys(full);
  for (const name of names) {
    fs.writeFileSync(path.join(OUT, `${name}.png`),
      Buffer.from(full[name].split(',')[1], 'base64'));
  }
  await b.close();
  if (own) await closeServer();

  const sharp = require('sharp');
  console.log(`\n接触表：dev/_3dtest/shots-textures/contact-sheet.png（${names.length} 张）`);
  console.log('\n单张读数（块级明度离散度，块 = 一块板）：');
  console.log('  ' + '贴图'.padEnd(24) + '均值'.padEnd(8) + 'CV');
  for (const n of names) {
    const f = path.join(OUT, `${n}.png`);
    /* 多尺度取最大（见文件头 blockCV 注释）—— 单一固定块会被周期性条纹混叠骗过。
       这里不再传块大小：函数内部扫一组互质尺度取最高 CV。 */
    const st = await blockCV(sharp, f, null);
    if (st) console.log('  ' + n.padEnd(24) + st.mean.toFixed(1).padEnd(8)
      + (st.cv * 100).toFixed(2) + '%' + `  (块=${st.block})`);
  }

  /* ★ 构建耗时预算。normalFromHeight 是逐像素 Sobel，EXT(1024²) 一张 = 100 万次循环，
     而贴图是在首次进入 3D 时**同步**生成的 —— 超标会变成"进场景卡一下"。
     经验阈值：单张 1024² ≤ 120ms，全部 ≤ 900ms。 */
  if (timings.length) {
    const total = timings.reduce((a, t) => a + t.ms, 0);
    console.log('\n构建耗时（首次进 3D 时同步跑）：');
    for (const t of timings) {
      const flag = t.px >= 1024 && t.ms > 120 ? '  ⚠️ 偏慢' : '';
      console.log('  ' + t.name.padEnd(24) + `${String(t.px).padStart(4)}px  ${t.ms.toFixed(0).padStart(4)}ms${flag}`);
    }
    console.log('  ' + '合计'.padEnd(24) + `          ${total.toFixed(0).padStart(4)}ms`
      + (total > 900 ? '  ⚠️ 超过 900ms 预算' : '  ✅ 在 900ms 预算内'));
  }

  if (REF) {
    const st = await blockCV(sharp, REF, 105, { left: 0, top: 60, width: 900, height: 300 });
    console.log(`\n参考图 ${path.basename(REF)}（人行道区，块 105px）：`
      + ` 均值 ${st.mean.toFixed(1)} · CV ${(st.cv * 100).toFixed(2)}%`);
    console.log('  ★ 对照要点：参考图的"马路"（无板的沥青）CV 也在 7% 上下 ——');
    console.log('    地面信息量主要来自脏污与杂物，不要靠加大板间色差去凑这个数（会变棋盘格）。');
  }
  process.exit(0);
})();
