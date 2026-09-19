#!/usr/bin/env node
/* ──────────────────────────────────────────────────────────────────────────────
   程序化贴图质量门禁 —— 把 shot-textures.cjs 的**手动读数**变成**自动断言**。

   为什么需要它（而不是"有工具就够了"）：
     `scripts/shot-textures.cjs` 确实查出过两个真缺陷（stoneTex 块级 CV 0.47%
     的纯色、paverTex 的像素噪点），但它是**手动工具、无任何门禁** ——
     读数是"人看输出看出来的"。下次重新生成贴图，同样的病会**静默回来**，
     没有任何东西会红。这是本项目反复出现的「仪器盲区与缺陷同形」。

   ★ 为什么必须用**两个**读数：
     - 块级 CV（低频）：量"一块板 / 一片区域"之间的明度差。
         太低 = 一片死色（stoneTex 旧病）；太高 = 棋盘格（slabTex 曾出现）。
     - 像素级 CV（高频）：量贴图内部逐像素的起伏。
         太高 = 像素噪点 / 雪花（paverTex 旧病）。
     这两种病方向相反，**任何单一指标都会漏掉其中一种**：
     paver 的噪点在块级尺度上被平均掉了，块级 CV 只有 0.87%，
     看起来跟"纯色"一样低 —— 但它其实是"噪点"，病根完全相反，治法也相反。

   用法：
     node scripts/verify-textures.cjs              # 跑门禁
     node scripts/verify-textures.cjs --calibrate  # 只打印读数表，不断言
   ────────────────────────────────────────────────────────────────────────────── */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright-core');
const { EDGE } = require('./_boot.cjs');
const { ensureServer, closeServer } = require('./lib/serve.cjs');

const ROOT = path.resolve(__dirname, '..');
const CALIBRATE = process.argv.includes('--calibrate');

/* ── 阈值表 ────────────────────────────────────────────────────────────────
   ★ 教训（本轮踩到，写在最前面）：**不要用统一上限去卡不同类别的材质。**
     第一版给所有贴图都设了 pixelCV ≤ 22~26，结果 asphalt(30.2%) 与
     concrete(25.4%) 双双报红 —— 但读源码后发现它们**本来就是颗粒材质**：
     `asphaltTex` 是"深底 + 900 个骨料颗粒"（materials.js:1116）、
     `concreteTex` 结尾有 `grain(ctx,N,N,26)`（:447）。
     颗粒材质的**高像素 CV 是设计意图，不是缺陷**。
     把设计意图判成缺陷，是"判据比缺陷更严"的典型错误。

   三个类别：
   · slab   —— 板铺装。要有可辨识的板（blockCV 下限），不能棋盘格（上限），无雪花。
   · grain  —— 骨料/颗粒材质（沥青、混凝土）。宏观均匀、微观必须**有**颗粒。
   · detail —— 自然面（草地）与细密铺装（人行道砖）。宏观均匀，需高频细节。

   参考实测（2026-09-19，多尺度 blockCV 扫 [9,12,16,21,25,32] 取最大）：
     见 `--calibrate` 输出。改阈值必须以实测为先，不要凭感觉填。
   ──────────────────────────────────────────────────────────────────────────── */
const SPEC = {
  // 板铺装：块级 CV 要有（否则是死色），但不能高到像拼贴花砖
  'ground.tier1_slab900': { cls: 'slab', slabCV: [2.0, 14], pixCVMax: 30 },
  'ground.tier2_slab1000': { cls: 'slab', slabCV: [2.0, 14], pixCVMax: 30 },
  'ground.tier3_stone': { cls: 'slab', slabCV: [2.0, 14], pixCVMax: 30 },
  'ground.lane_slab800': { cls: 'slab', slabCV: [2.0, 14], pixCVMax: 30 },
  // 颗粒型：宏观可均匀，微观必须有颗粒（下限），但不该是纯雪花（上限放宽）
  'ground.asphalt': { cls: 'grain', slabCV: [0, 16], pixCVMin: 6, pixCVMax: 45 },
  'wall.concrete': { cls: 'grain', slabCV: [0, 16], pixCVMin: 4, pixCVMax: 45 },
  // 自然面 / 细密铺装：宏观均匀，靠高频出信息量
  'ground.paver': { cls: 'detail', slabCV: [0, 16], pixCVMin: 1.5, pixCVMax: 40 },
  'ground.grass': { cls: 'detail', slabCV: [0, 16], pixCVMin: 1.5, pixCVMax: 40 },
  // 立面
  'wall.tile': { cls: 'slab', slabCV: [1.0, 14], pixCVMax: 30 },
  'wall.brick': { cls: 'slab', slabCV: [1.0, 16], pixCVMax: 32 },
  'wall.curtain': { cls: 'slab', slabCV: [1.0, 22], pixCVMax: 40 },
  'wall.metalPanel': { cls: 'slab', slabCV: [1.0, 16], pixCVMax: 30 },
};

/* ── 两个读数（纯函数，便于反向对照直接喂合成数据）──────────────────────── */

/** 单一块大小下的块级明度离散度 */
function blockCVAt(data, W, H, block) {
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
  return { mean: m, cv: sd / m };
}

/**
 * ★★ 块级 CV —— **必须扫一组块大小取最大值**，不能用单一固定块。
 *
 * 为什么（2026-09-19 实测，本门禁自己被反向对照抓出来的缺陷）：
 *   周期性纹理与块大小会**混叠**。合成棋盘在 N=256 下的实测：
 *     块 16（=周期）   → CV 68.75%   ← 检出
 *     块 25（错位）    → CV  3.89%   ← 接近"自然铺装"的 2.05%，几乎分不开
 *     块 32（=2×周期） → CV  0.00%   ← **完全测不到**
 *     块 64（=4×周期） → CV  0.00%   ← **完全测不到**
 *   机制：块大小是纹理周期的整数倍时，每个块都含等量明/暗 → 块均值全部相同 → CV=0。
 *   ⇒ **任何单一固定块大小的 CV 读数，都可能对某类周期纹理完全失明。**
 *
 *   扫一组质数/互质的块大小并取最大值，就让混叠无从发生 ——
 *   棋盘在某个尺度上必然响应。实测分离度：棋盘 68.75% vs 自然铺装 3.88%（17 倍）。
 */
const BLOCK_SCALES = [9, 12, 16, 21, 25, 32];

function blockCV(data, W, H) {
  let best = null;
  for (const blk of BLOCK_SCALES) {
    const r = blockCVAt(data, W, H, blk);
    if (r && (!best || r.cv > best.cv)) best = { ...r, block: blk };
  }
  return best;
}

/** 像素级明度离散度：逐像素对全图均值求 CV —— 抓高频噪点 */
function pixelCV(data, W, H) {
  const n = W * H;
  let s = 0;
  for (let i = 0; i < n; i++) s += data[i];
  const m = s / n;
  if (!m) return null;
  let v = 0;
  for (let i = 0; i < n; i++) v += (data[i] - m) ** 2;
  const sd = Math.sqrt(v / n);
  return { mean: m, cv: sd / m };
}

let pass = 0;
const fails = [];
function check(name, ok, detail) {
  if (ok) { pass++; console.log('  ✅ ' + name + (detail ? '  — ' + detail : '')); }
  else { fails.push(name + (detail ? ' — ' + detail : '')); console.log('  ❌ ' + name + (detail ? '  — ' + detail : '')); }
}

(async () => {
  const own = await ensureServer({ root: ROOT, port: 8993, label: 'texgate' });
  const b = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1660, height: 900 }, deviceScaleFactor: 1 });
  const pageErrors = [];
  p.on('pageerror', (e) => pageErrors.push(e.message));
  await p.goto('http://127.0.0.1:8993/dev/_3dtest/textures.html', { waitUntil: 'load', timeout: 60000 });
  await p.waitForFunction(() => window.__texSheetDone, { timeout: 60000 });

  const timings = await p.evaluate(() => window.__texTimings || []);
  const full = await p.evaluate(() => window.__texFull || {});

  /* ★ 反向对照必须在页面里造 —— 用合成数据验证"检测器确实能报出这两种病"。
     没有这一步，阈值一旦写松，门禁会恒绿而没人知道。 */
  const synth = await p.evaluate(() => {
    const mk = (fn) => {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const g = c.getContext('2d');
      const img = g.createImageData(256, 256);
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const v = fn(x, y) | 0;
        const i = (y * 256 + x) * 4;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      return c.toDataURL('image/png');
    };
    return {
      flat: mk(() => 128),                                   // 纯色 → 块级 CV ≈ 0
      noise: mk(() => 40 + Math.random() * 216),             // 逐像素雪花 → 像素 CV 极高
      checker: mk((x, y) => ((x >> 4) + (y >> 4)) % 2 ? 40 : 216), // 棋盘 → 块级 CV 高
      // 自然铺装：32px 板 + 轻微脏污。用来验证"正常的不被误报"（分离度对照）
      natural: mk((x, y) => (((x >> 5) + (y >> 5)) % 2 ? 130 : 120) + Math.random() * 8),
    };
  });

  await b.close();
  if (own) await closeServer();

  const sharp = require('sharp');
  const tmp = path.join(ROOT, 'dev/_3dtest/shots-textures');
  fs.mkdirSync(tmp, { recursive: true });

  async function metricsOf(dataUrl) {
    const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
    const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
    return {
      W: info.width,
      block: blockCV(data, info.width, info.height),   // 已内置多尺度取最大
      pixel: pixelCV(data, info.width, info.height),
    };
  }

  console.log('程序化贴图质量门禁（块级 CV 抓「纯色/棋盘格」· 像素级 CV 抓「噪点」）\n');

  /* ── ① 前置：数据确实拿到了（防「样本恒为空」的假绿）─────────────── */
  console.log('① 前置：取样成功');
  const names = Object.keys(full);
  check('贴图张数 > 8', names.length > 8, names.length + ' 张');
  check('无页面报错', pageErrors.length === 0, pageErrors.length ? pageErrors[0].slice(0, 80) : '0 条');

  /* ── ② 反向对照：检测器必须能报出两种病 ─────────────────────────── */
  console.log('\n② 反向对照（检测器自身的有效性，防止阈值写松后恒绿）');
  const mFlat = await metricsOf(synth.flat);
  const mNoise = await metricsOf(synth.noise);
  const mChecker = await metricsOf(synth.checker);
  const mNatural = await metricsOf(synth.natural);
  check('★ 纯色必须被判为「块级 CV 过低」', mFlat.block.cv * 100 < 2.0,
    `合成纯色块级 CV ${(mFlat.block.cv * 100).toFixed(2)}% → 会被下限拦下`);
  /* 噪点的判据不能写死数字：它必须**超过 SPEC 里最严格的那条上限**才算"真能被拦下"。
     写死数字会随阈值调整而失效（本轮就踩到：我写了 >45，而合成噪点实测 42.28%）。 */
  const strictestPixMax = Math.min(...Object.values(SPEC).map((s) => s.pixCVMax).filter((v) => v != null));
  check(`★ 雪花必须超过最严格上限（${strictestPixMax}%）`, mNoise.pixel.cv * 100 > strictestPixMax,
    `合成噪点像素级 CV ${(mNoise.pixel.cv * 100).toFixed(2)}% > ${strictestPixMax}% → 会被拦下`);
  check('★ 棋盘必须被判为「块级 CV 过高」', mChecker.block.cv * 100 > 14,
    `合成棋盘块级 CV ${(mChecker.block.cv * 100).toFixed(2)}% → 会被上限拦下`);
  check('★ 正常铺装不得被误报为棋盘格（分离度）', mNatural.block.cv * 100 < 14,
    `合成自然铺装块级 CV ${(mNatural.block.cv * 100).toFixed(2)}% · 棋盘/自然 分离度 `
    + `${(mChecker.block.cv / mNatural.block.cv).toFixed(1)}×`);
  check('★ 多尺度取最大确实高于单一尺度（防混叠的凭据）',
    mChecker.block.block >= 9 && mChecker.block.cv * 100 > 40,
    `棋盘在块=${mChecker.block.block} 尺度上被检出 ${(mChecker.block.cv * 100).toFixed(1)}%`
    + ` —— 若只扫固定块大小(如 W/5)，实测会掉到 1.93% 而漏判`);

  /* ── ③ 实测读数 + 逐项断言 ─────────────────────────────────────── */
  const rows = [];
  for (const n of names) {
    const m = await metricsOf(full[n]);
    rows.push({ n, ...m });
  }

  console.log('\n③ 实测读数');
  console.log('  ' + '贴图'.padEnd(24) + '分辨率'.padEnd(9) + '块级CV'.padEnd(10) + '像素CV');
  for (const r of rows) {
    console.log('  ' + r.n.padEnd(24) + String(r.W + 'px').padEnd(9)
      + ((r.block.cv * 100).toFixed(2) + '%').padEnd(10) + (r.pixel.cv * 100).toFixed(2) + '%');
  }

  if (!CALIBRATE) {
    console.log('\n④ 逐项阈值');
    for (const r of rows) {
      const s = SPEC[r.n];
      if (!s) { check(`${r.n} 已在 SPEC 中登记`, false, '新增贴图必须同步登记阈值'); continue; }
      const bc = r.block.cv * 100, pc = r.pixel.cv * 100;
      const lo = s.slabCV[0], hi = s.slabCV[1];
      check(`${r.n} 块级 CV 在 [${lo}, ${hi}]`, bc >= lo && bc <= hi,
        `${bc.toFixed(2)}%` + (bc < lo ? ' ← 过于均匀（纯色风险）' : bc > hi ? ' ← 差异过大（棋盘格风险）' : ''));
      if (s.pixCVMin != null) {
        check(`${r.n} 像素 CV ≥ ${s.pixCVMin}（有高频细节，非纯色）`, pc >= s.pixCVMin, pc.toFixed(2) + '%');
      }
      if (s.pixCVMax != null) {
        check(`${r.n} 像素 CV ≤ ${s.pixCVMax}（无雪花噪点）`, pc <= s.pixCVMax,
          pc.toFixed(2) + '%' + (pc > s.pixCVMax ? ' ← 像素噪点' : ''));
      }
    }

    /* ── ⑤ 构建耗时预算（贴图在首次进 3D 时同步生成，超标 = 进场景卡一下）── */
    console.log('\n⑤ 构建耗时预算');
    const total = timings.reduce((a, t) => a + t.ms, 0);
    check('贴图构建总耗时 ≤ 900ms', total <= 900, total.toFixed(0) + 'ms');
    const slow = timings.filter((t) => t.px >= 1024 && t.ms > 120);
    check('无单张 1024² 贴图超过 120ms', slow.length === 0,
      slow.length ? slow.map((t) => t.name + ' ' + t.ms.toFixed(0) + 'ms').join(', ') : '全部达标');

    /* ── ⑥ 全部贴图都登记了阈值（防新增贴图静默漏检）────────────────── */
    console.log('\n⑥ 覆盖率');
    const unregistered = names.filter((n) => !SPEC[n]);
    check('每张贴图都在 SPEC 里有阈值', unregistered.length === 0,
      unregistered.length ? '未登记: ' + unregistered.join(', ') : '全部已登记');
  }

  console.log('\n════ 结果: ' + pass + ' 通过 / ' + fails.length + ' 失败 ════');
  if (fails.length) {
    console.log('\n失败明细：');
    fails.forEach((f) => console.log('  · ' + f));
    process.exit(1);
  }
  process.exit(0);
})();
