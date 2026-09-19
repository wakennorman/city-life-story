#!/usr/bin/env node
/**
 * 真实扫描贴图 · 同机位 A/B 对照取证。
 *
 * ── 为什么必须有这个脚本 ──────────────────────────────────────────────────
 *   `verify-texload.cjs` 能证明"贴图挂上了、上到了 GPU"，但证明不了
 *   **"画面变好看了"**。数值全绿而画面更糟，是完全可能的 ——
 *   比如砖的尺度错了三成、或者真实贴图的色调与程序化那套对不上。
 *
 *   本脚本把同一台机器、同一个相机、同一帧光照下的两张图并排放在一起：
 *     左 = 真实扫描贴图（setTextureEnabled(true)）
 *     右 = 程序化贴图  （setTextureEnabled(false)，真的退回原状）
 *   差别只在**贴图内容**这一件事上（尺度在绑定时就定死了，开关不改变它，
 *   见 textures.js 总开关上方的注释）—— 这才叫控制变量。
 *
 *   ★ 开关必须可逆才有意义：如果关掉开关后画面不变，
 *     "两张图一样"会被误读成"真实贴图没效果"。verify-texload 里有这条断言。
 *
 * 用法：node scripts/shot-texab.cjs
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright-core');
const { EDGE, attachErrorSink } = require('./_boot.cjs');
const { ensureServer, closeServer } = require('./lib/serve.cjs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dev/_3dtest/shots-texab');
const PORT = Number(process.env.PORT || 8984);
const DOC = '/dev/_3dtest/shell.html';
const PROBE = 'dev/_3dtest/bundle-probe.js';
const W = 1280, H = 720;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  console.log('重建探针包…');
  execFileSync(process.execPath,
    [path.join(__dirname, 'build-3d-bundle.cjs'), '--out', PROBE],
    { cwd: ROOT, stdio: 'pipe' });

  const own = await ensureServer({ root: ROOT, port: PORT, label: '贴图A/B' });
  const browser = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  attachErrorSink(page);
  await page.goto(`http://127.0.0.1:${PORT}${DOC}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => !!window.Scene3D && window.__shellReady === true, { timeout: 60000 });
  /* ★ 必须等贴图落定，否则拍到的是"还没换完"的中间态。 */
  await page.waitForFunction(() => window.Scene3D.textureSettled(), { timeout: 30000 });

  const settle = (frames = 40) => page.evaluate((n) => new Promise((r) => {
    let i = 0;
    const f = () => (++i >= n ? r(i) : requestAnimationFrame(f));
    requestAnimationFrame(f);
  }), frames);

  const pickLoc = (layout) => page.evaluate((lay) => {
    const spec = window.Scene3D.SPECS || {};
    const id = Object.keys(spec).find((k) => spec[k].layout === lay);
    if (id) window.__shell.loadLocation(id);
    return id || null;
  }, layout);

  const sharp = require('sharp');
  const raw = async (f) => (await sharp(f).greyscale().raw().toBuffer({ resolveWithObject: true })).data;
  const mad = (a, b) => {
    const n = Math.min(a.length, b.length);
    let s = 0;
    for (let i = 0; i < n; i++) s += Math.abs(a[i] - b[i]);
    return s / n;
  };

  const pairs = [];

  /** 一个机位：拍 ON / OFF 两张，再合成左右并排对照图。
   *  ★ zoom 是唯一可调的机位参数（IsoCamera 的 dist 被 clamp 在 [9,32]，
   *    见 player.js::zoom）—— 没有 setPitch 之类的接口，别去调不存在的 API。 */
  async function ab(label, { zoom = -99 } = {}) {
    await page.evaluate(() => window.Scene3D.setTextureEnabled(true));
    await settle(60);
    await page.evaluate((z) => window.__shell.view3d.zoom(z), zoom);
    await settle(30);
    const onF = path.join(OUT, `_${label}-ON.png`);
    await page.screenshot({ path: onF });

    await page.evaluate(() => window.Scene3D.setTextureEnabled(false));
    await settle(40);
    const offF = path.join(OUT, `_${label}-OFF.png`);
    await page.screenshot({ path: offF });

    await page.evaluate(() => window.Scene3D.setTextureEnabled(true));
    await settle(30);

    const d = mad(await raw(onF), await raw(offF));
    const bar = `<svg width="${W * 2}" height="46"><rect width="${W * 2}" height="46" fill="#111"/>
      <text x="16" y="31" font-family="sans-serif" font-size="20" fill="#7ee787">左：真实扫描贴图（Poly Haven CC0）</text>
      <text x="${W + 16}" y="31" font-family="sans-serif" font-size="20" fill="#ffa657">右：程序化贴图（原来的样子）</text></svg>`;
    const [a, b2] = await Promise.all([
      sharp(onF).resize(W).toBuffer(), sharp(offF).resize(W).toBuffer(),
    ]);
    const cmp = path.join(OUT, `${label}.jpg`);
    await sharp({ create: { width: W * 2, height: H + 46, channels: 3, background: '#111' } })
      .composite([
        { input: Buffer.from(bar), top: 0, left: 0 },
        { input: a, top: 46, left: 0 },
        { input: b2, top: 46, left: W },
      ])
      .jpeg({ quality: 88 }).toFile(cmp);

    fs.unlinkSync(onF); fs.unlinkSync(offF);
    pairs.push({ label, mad: +d.toFixed(2), file: cmp });
    console.log(`  · ${label}.jpg   平均绝对差 ${d.toFixed(2)}/255`);
  }

  console.log('\n拍摄中…');
  await pickLoc('lane');   await settle(80);  await ab('1-城中村-街面');
  await pickLoc('avenue'); await settle(80);  await ab('2-大道-街面');
  /* 俯瞰：一眼看整条街的铺装与立面，最能判断"整体质感" */
  await pickLoc('lane');   await settle(80);  await ab('3-城中村-俯瞰', { zoom: 32 });

  await browser.close();
  if (own) await closeServer();

  console.log('\n对照图（左=真实扫描 / 右=程序化）：');
  for (const p of pairs) console.log(`  ${path.relative(ROOT, p.file)}   差异 ${p.mad}/255`);
  console.log(pairs.every((p) => p.mad > 1)
    ? '\n✅ 每对都有可见差异 —— 开关确实在改变画面内容'
    : '\n❌ 有对照图几乎没有差异，说明贴图没真正生效');
  process.exit(pairs.every((p) => p.mad > 1) ? 0 : 1);
})().catch((e) => { console.error('脚本异常：', e); process.exit(2); });
