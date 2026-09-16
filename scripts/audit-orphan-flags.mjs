/**
 * audit-orphan-flags.mjs — 孤儿 flag 审计（写入但零消费）
 *
 * 背景：项目长期存在「写入成功但没人读取」的死状态问题（开发闸门与优化路线.md
 * P1-3 明确要求杜绝）。本脚本做静态双向对账：
 *   1) 扫出所有 flags.xxx = / flags["xxx"] = / flags.xxx++ 写入点
 *   2) 统计每个 flag 名在全部源码中的出现次数
 *   3) 出现次数 == 写入次数 → 孤儿（除写入点外无人引用，含声明式 flagMet:"xxx"）
 *
 * 用法：
 *   node scripts/audit-orphan-flags.mjs              # 汇总 + 前 60 条样例
 *   node scripts/audit-orphan-flags.mjs --all        # 列出全部孤儿
 *   node scripts/audit-orphan-flags.mjs --json out.json
 *
 * 退出码：始终 0（纯审计，不作门禁，避免阻塞既有流程）。
 * 注意：本脚本是启发式静态分析，动态拼接键（flags[k]）无法覆盖，结果供人工复核。
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "src/js");
const args = process.argv.slice(2);
const SHOW_ALL = args.includes("--all");
const jsonIdx = args.indexOf("--json");
const JSON_OUT = jsonIdx >= 0 ? args[jsonIdx + 1] : "";

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".js")) files.push(p);
  }
})(ROOT);

const sources = files.map((f) => ({ f, src: fs.readFileSync(f, "utf8") }));
const all = sources.map((s) => s.src).join("\n");

// 1) 写入点
const writeSites = new Map(); // flag -> 写入次数
const writeRe =
  /flags\s*(?:\.\s*([A-Za-z_$][\w$]*)|\[\s*["']([A-Za-z_$][\w$]*)["']\s*\])\s*(=[^=]|\+\+|--|\+=|-=|\*=|\|=|&&=|\?\?=)/g;
for (const { src } of sources) {
  let m;
  while ((m = writeRe.exec(src))) {
    const k = m[1] || m[2];
    if (k) writeSites.set(k, (writeSites.get(k) || 0) + 1);
  }
}

// 2) 全库出现次数
function countOccurrences(name) {
  let n = 0;
  let idx = 0;
  while ((idx = all.indexOf(name, idx)) !== -1) {
    n++;
    idx += name.length;
  }
  return n;
}

const orphans = [];
for (const [k, w] of writeSites) {
  const total = countOccurrences(k);
  if (total <= w) orphans.push({ flag: k, writes: w, occurrences: total });
}

// 3) 按命名段归类
const prefix = new Map();
for (const o of orphans) {
  const seg = o.flag.startsWith("_")
    ? o.flag.split("_")[1] || "_"
    : o.flag.split("_")[0];
  prefix.set(seg, (prefix.get(seg) || 0) + 1);
}

console.log("扫描文件数:", files.length);
console.log("写入过的 flag 总数:", writeSites.size);
console.log(
  "孤儿 flag（除写入点外零引用）:",
  orphans.length,
  "(" + ((orphans.length / writeSites.size) * 100).toFixed(1) + "%)"
);
console.log("\n孤儿 flag 命名段分布（前 25）:");
[...prefix.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 25)
  .forEach(([p, n]) => console.log("  " + p + ": " + n));

const shown = SHOW_ALL ? orphans : orphans.slice(0, 60);
console.log("\n孤儿 flag" + (SHOW_ALL ? "（全部）" : "样例（前 60）") + ":");
shown.forEach((o) => console.log("  -", o.flag, "写入" + o.writes + "次"));

if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify(orphans, null, 2), "utf8");
  console.log("\n已写出 JSON:", JSON_OUT);
}
