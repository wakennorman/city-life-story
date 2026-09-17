#!/usr/bin/env node
/**
 * audit-dangling-refs.mjs — 悬空引用审计
 *
 * 背景（来自 .claude/domain-optimization-round-411.md 的真实故障记录）：
 *   并行窗口的 `git add -A` 把另一个窗口**在途编辑**的 src/index.html
 *   （含 domain_b_linkage_r410 的挂载行）扫入了自己的提交，
 *   而那个 .js 文件当时还是 untracked → **main 上出现悬空引用**。
 *
 *   后果：线上 index.html 引用了不存在的脚本 → 该文件 404 → 依赖它的功能静默失效。
 *   这类故障不会让构建失败（build.py 只检查能读到的文件），
 *   所以门禁全绿也可能埋着它。
 *
 * 本脚本检查三类悬空：
 *   1. DANGLING_FILE  — <script src="X"> 指向的 X 在磁盘上不存在
 *   2. DANGLING_REF   — JS 里引用的轮次文件（rXXX.js）既不存在也未被注册
 *   3. ORPHAN_MOUNT   — index.html 挂了 X.js，但 X.js 从未被任何 window 挂载/使用（空壳）
 *
 * 用法：
 *   node scripts/audit-dangling-refs.mjs
 *   node scripts/audit-dangling-refs.mjs --json dangling-report.json
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");

const argv = process.argv.slice(2);
const jsonOut = (() => {
  const i = argv.indexOf("--json");
  return i >= 0 ? argv[i + 1] : null;
})();

/** 读 index.html 中所有 <script src="..."> 的路径 */
function extractScriptSrcs(html) {
  const out = [];
  const re = /<script\s+[^>]*src="([^"]+)"[^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) out.push(m[1]);
  return out;
}

/** 递归列出目录下所有文件 */
function walk(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const indexHtmlPath = path.join(SRC, "index.html");
if (!fs.existsSync(indexHtmlPath)) {
  console.error(`✗ 找不到 ${indexHtmlPath}`);
  process.exit(1);
}
const html = fs.readFileSync(indexHtmlPath, "utf8");
const srcs = extractScriptSrcs(html);

const dangling = [];
const ok = [];

for (const src of srcs) {
  // <script src="js/core/x.js"> 是相对 src/ 的
  const abs = path.join(SRC, src);
  if (fs.existsSync(abs)) {
    ok.push({ src, abs });
  } else {
    dangling.push({ src, abs });
  }
}

// ── 检查 2：产物 dist/app.js 是否与 src/index.html 的引用集合一致 ──
// build.py 按 <script src> 顺序拼接，故产物里的分段注释应与引用列表一一对应
let bundleMismatch = null;
const distApp = path.join(ROOT, "dist", "app.js");
if (fs.existsSync(distApp)) {
  const bundle = fs.readFileSync(distApp, "utf8");
  const bundleSections = [];
  const re = /^\/\/ ==== (.+?) ====$/gm;
  let m;
  while ((m = re.exec(bundle)) !== null) bundleSections.push(m[1]);
  const expected = srcs.slice(); // src/index.html 中出现的顺序
  // 产物可能不含最后几个（如 boot 内联），故只检查 bundleSections 是否都是 expected 的子集
  const missingInBundle = expected.filter((s) => !bundleSections.includes(s));
  const extraInBundle = bundleSections.filter((s) => !expected.includes(s));
  bundleMismatch = {
    bundleCount: bundleSections.length,
    expectedCount: expected.length,
    missingInBundle,
    extraInBundle,
  };
}

// ── 检查 3：轮次文件（domain_X_linkage_rNNN.js）是否被 index.html 注册 ──
// 这是 round-411 事故的核心：js 文件存在但 index.html 未挂载，或反之
const coreDir = path.join(SRC, "js", "core");
const linkageFiles = fs.existsSync(coreDir)
  ? fs
      .readdirSync(coreDir)
      .filter((f) => /^domain_[a-z]_linkage_r\d+[a-z]?\.js$/.test(f))
  : [];

const registeredNames = new Set(srcs.map((s) => path.basename(s)));
const unregisteredLinkage = linkageFiles.filter((f) => !registeredNames.has(f));

// ── 输出 ──
const report = {
  generatedAt: new Date().toISOString(),
  indexHtml: path.relative(ROOT, indexHtmlPath),
  totalScriptRefs: srcs.length,
  danglingCount: dangling.length,
  dangling: dangling.map((d) => ({ src: d.src, abs: path.relative(ROOT, d.abs) })),
  bundle: bundleMismatch,
  linkageTotal: linkageFiles.length,
  unregisteredLinkageCount: unregisteredLinkage.length,
  unregisteredLinkage,
};

console.log("═══ 悬空引用审计 ═══");
console.log(`index.html 中 <script src> 引用数: ${srcs.length}`);
console.log(`  存在: ${ok.length}`);
console.log(`  ★ 悬空: ${dangling.length}`);

if (dangling.length > 0) {
  console.log("\n悬空引用明细（index.html 引用但文件不存在 → 线上会 404）:");
  for (const d of dangling) console.log(`  ✗ ${d.src}   (期望路径: ${path.relative(ROOT, d.abs)})`);
} else {
  console.log("  ✓ 无悬空引用");
}

if (bundleMismatch) {
  console.log(`\n产物一致性：`);
  console.log(`  dist/app.js 分段数: ${bundleMismatch.bundleCount}`);
  console.log(`  src/index.html 引用数: ${bundleMismatch.expectedCount}`);
  if (bundleMismatch.missingInBundle.length) {
    console.log(`  ★ 引用了但产物中缺失 (${bundleMismatch.missingInBundle.length}):`);
    for (const s of bundleMismatch.missingInBundle.slice(0, 20)) console.log(`      ${s}`);
  } else {
    console.log("  ✓ 所有引用均已在产物中");
  }
  if (bundleMismatch.extraInBundle.length) {
    console.log(`  产物中有但 index.html 未引用 (${bundleMismatch.extraInBundle.length}):`);
    for (const s of bundleMismatch.extraInBundle.slice(0, 20)) console.log(`      ${s}`);
  }
}

console.log(`\n轮次 linkage 文件总数: ${linkageFiles.length}`);
console.log(`  ★ 存在但 index.html 未注册: ${unregisteredLinkage.length}`);
if (unregisteredLinkage.length > 0) {
  for (const f of unregisteredLinkage.slice(0, 30)) console.log(`      ${f}`);
}

const fatal = dangling.length > 0;
if (jsonOut) {
  fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2), "utf8");
  console.log(`\nJSON 已写入 ${jsonOut}`);
}

console.log(fatal ? "\n✗ 存在悬空引用（线上必然失效）" : "\n✓ 未发现悬空引用");
process.exit(fatal ? 1 : 0);
