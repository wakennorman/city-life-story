#!/usr/bin/env node
/**
 * 生成 Poly Haven **贴图集**的游戏侧清单（src/app/3d/polyhaven-textures.js）。
 *
 * ★ 为什么产物是 .js 模块而不是 .json（2026-09-19 踩过）：
 *   `dev/_3dtest/textures.html`（程序化贴图接触表）是**直接以原生 ES 模块**
 *   导入 `/src/app/3d/materials.js` 的，而 materials.js 链式导入本清单。
 *   浏览器原生 ESM **不能导入裸 JSON**（`import x from './a.json'` 直接报错，
 *   要用 import attributes 且各版本支持不一）。
 *   后果不是"某个数读不到"，而是**整个页面模块图加载失败** ——
 *   `__texSheetDone` 永不置位 → verify-textures 门禁 30 秒超时。
 *   包成 `export default {...}` 后原生 ESM 与 esbuild 两条路都通，
 *   且仍然是**构建期内联**（dist 单文件离线分发不受影响）。
 *
 * 与 gen-polyhaven-manifest.cjs（模型清单）同思路：
 *   `src/assets/polyhaven/textures-manifest.json` 是**下载台账** —— 记来源 URL、
 *   md5、字节数，面向"可追溯性/审计"，结构是扁平数组。
 *   游戏要的是**能内联、无冗余**的按用途索引表。
 *
 * 本脚本做的转换：
 *   ① 数组 → 以 `as`（用途名）为键的对象，调用方直接 O(1) 取
 *   ② 剔掉 url / md5 / bytes（运行时用不上，白占包体）
 *   ③ 把 `dimensionsMM` 转成 `meters` —— **这是接入的关键输入**：
 *      贴图的 repeat 必须由"一格覆盖多少米 ÷ 贴图真实米数"反推，
 *      不能拍脑袋。尺寸错了，砖在屏上的大小就错了。
 *
 * 用法：
 *   node scripts/gen-texture-manifest.cjs          # 生成
 *   node scripts/gen-texture-manifest.cjs --check  # 只校验不写（CI 用）
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LEDGER = path.join(ROOT, 'src/assets/polyhaven/textures-manifest.json');
const OUT = path.join(ROOT, 'src/app/3d/polyhaven-textures.js');

/** 台账里的槽位名 → 游戏清单里的语义名。
 *  ★ 语义名按 **three.js 的槽位**取，不按 Poly Haven 的叫法 ——
 *    读代码的人看到 `roughnessMap` 就知道它接到哪，不用去查 arm 是什么。 */
const SLOT_MAP = [
  ['diff', 'map'],        // Diffuse → map（颜色贴图，走 sRGB）
  ['nor', 'normalMap'],   // nor_gl → normalMap（OpenGL 约定，绿通道朝上）
  ['arm', 'roughnessMap'],// arm → roughnessMap（**绿**通道，见下方长注）
];

function build() {
  if (!fs.existsSync(LEDGER)) {
    console.error(`缺少下载台账：${path.relative(ROOT, LEDGER)}`);
    console.error('先跑：node scripts/fetch-textures.cjs');
    process.exit(1);
  }
  const led = JSON.parse(fs.readFileSync(LEDGER, 'utf8'));

  const out = {
    _generated: 'scripts/gen-texture-manifest.cjs —— 请勿手改',
    source: led.source,
    license: led.license,
    licenseUrl: led.licenseUrl,
    commercialUse: led.commercialUse,
    attributionRequired: led.attributionRequired,
    resolution: led.resolution,
    /* ★ arm 通道语义必须写在这里，否则接的人会以为它是普通的灰度粗糙度图，
         把它当 `map` 用 —— 那会得到一张"紫色/绿色"的贴图贴在墙上。 */
    note: '真实照片扫描 PBR 贴图集（1k）。arm.jpg = AO(R) + Roughness(G) + Metalness(B)；'
      + 'three.js 的 roughnessMap 读绿通道（源码注释原文：reads channel G, '
      + 'compatible with a combined OcclusionRoughnessMetallic (RGB) texture）。'
      + '本清单只把 arm 接到 roughnessMap；metalness 仍由材质显式给 0'
      + '（见 3D_ART_SPEC §6.2 的 P0-2：非金属 metalness 必须归 0）。',
    base: 'assets/polyhaven/',
    items: {},
  };

  const problems = [];
  for (const a of led.assets) {
    if (a.error) { problems.push(`${a.as}: 下载失败（${a.error}）`); continue; }
    if (!a.dimensionsMM || a.dimensionsMM.length < 2) {
      problems.push(`${a.as}: 缺 dimensionsMM —— 没有它就推不出 repeat，不能接入`);
      continue;
    }
    const files = {};
    for (const [ledKey, gameKey] of SLOT_MAP) {
      const f = a.files && a.files[ledKey];
      if (!f || f.missing || !f.rel) { problems.push(`${a.as}: 缺 ${ledKey}（→ ${gameKey}）`); continue; }
      files[gameKey] = f.rel;
    }
    if (Object.keys(files).length !== SLOT_MAP.length) continue;

    out.items[a.as] = {
      use: a.use,                                  // ground | wall
      note: a.note,
      /* 贴图在真实世界里覆盖多少米 —— repeat = 材质一格米数 ÷ 这个值。
         取 X 分量（贴图基本是方的；非方的话这里也该拆开，但目前没有）。 */
      meters: +(a.dimensionsMM[0] / 1000).toFixed(3),
      source: a.source,
      files,
    };
  }

  return { out, problems, count: Object.keys(out.items).length };
}

/** 渲染成 ES 模块源码。
 *  ★ 内容仍然用 JSON.stringify —— 只把外壳换成 `export default …`。
 *    这样字段顺序与引号风格稳定，`--check` 才能逐字节比对（否则每次生成
 *    都可能因为空白差异判"清单已过期"，变成噪声门禁）。 */
function render(out) {
  const body = JSON.stringify(out, null, 2)
    .split('\n').map((l) => '  ' + l).join('\n').trimStart();
  return '/* 由 scripts/gen-texture-manifest.cjs 生成 —— 请勿手改 */\n'
    + 'export default ' + body + ';\n';
}

const r = build();
const args = process.argv.slice(2);

if (r.problems.length) {
  console.log('⚠️  以下条目有问题，已跳过：');
  r.problems.forEach((p) => console.log('   · ' + p));
  console.log('');
}

if (args.includes('--check')) {
  const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  const next = render(r.out);
  if (prev !== next) { console.error('❌ 清单已过期，请跑 node scripts/gen-texture-manifest.cjs'); process.exit(1); }
  console.log(`✅ 清单是最新的（${r.count} 项）`);
  process.exit(0);
}

fs.writeFileSync(OUT, render(r.out));
const grounds = Object.values(r.out.items).filter((v) => v.use === 'ground').length;
const walls = Object.values(r.out.items).filter((v) => v.use === 'wall').length;
console.log(`✅ 已写出 ${path.relative(ROOT, OUT)}`);
console.log(`   ${r.count} 项（地面 ${grounds} · 立面 ${walls}）`
  + ` · ${(fs.statSync(OUT).size / 1024).toFixed(1)}KB`);
for (const [as, it] of Object.entries(r.out.items)) {
  console.log(`   ${it.use.padEnd(7)} ${as.padEnd(22)} ${it.meters}m  ${it.note}`);
}
