#!/usr/bin/env node
/**
 * analyze-event-blockers.cjs — 分析「事件为什么过不了闸门」的模式
 *
 * 输入：reachability-report.json（由 audit-event-reachability.cjs --json 生成）
 * 输出：控制台报告（可选 --json）
 *
 * 回答的问题：
 *   · 那些从未通过闸门的事件，条件里到底依赖了什么状态？（路径聚合）
 *   · 它们要求的数值门槛有多高？（阈值聚合）
 *   · 是不是集中在某个 phase / 某类前置条件上？
 *
 * 做法：把每个失败事件的 `conditions.toString()` 与 `triggers` 当作文本，
 * 提取「状态路径引用」与「比较阈值」，再按事件数聚合排序。
 *
 * 用法：
 *   node scripts/analyze-event-blockers.cjs
 *   node scripts/analyze-event-blockers.cjs --json blocker-patterns.json
 *   node scripts/analyze-event-blockers.cjs --verdict BLOCK_TRIGGERS
 */
"use strict";

const path = require("path");
const fs = require("fs");
const runner = require(path.join(__dirname, "..", "tests", "headless_runner.cjs"));

const argv = process.argv.slice(2);
function argStr(name, def) {
  const i = argv.indexOf("--" + name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
}
const ROOT = path.join(__dirname, "..");
const JSON_IN = path.resolve(ROOT, argStr("json-in", "reachability-report.json"));
const JSON_OUT = argStr("json", "");
const ONLY_VERDICT = argStr("verdict", "");

if (!fs.existsSync(JSON_IN)) {
  console.error("找不到 " + JSON_IN + "，请先跑 audit-event-reachability.cjs --json");
  process.exit(1);
}
const report = JSON.parse(fs.readFileSync(JSON_IN, "utf8"));

const ok = runner.init({ strict: false });
if (!ok) {
  console.error("引擎加载失败");
  process.exit(0);
}
const ALL_EVENTS = typeof RANDOM_EVENTS !== "undefined" ? RANDOM_EVENTS : [];
const byId = new Map();
for (const e of ALL_EVENTS) if (e && e.id && !byId.has(e.id)) byId.set(e.id, e);

// ── 取要分析的事件 ────────────────────────────────────────────
const BLOCKED_VERDICTS = ONLY_VERDICT
  ? [ONLY_VERDICT]
  : ["DEAD_FLAG", "BLOCK_CONDITIONS", "BLOCK_TRIGGERS", "BLOCK_TRIGGER_FN", "BLOCK_CASH"];
const targets = (report.details || []).filter((d) => BLOCKED_VERDICTS.includes(d.verdict));

// ── 提取器 ────────────────────────────────────────────────────
// 状态路径：st.xxx / state.xxx / snap.xxx 起的链式访问
const PATH_RE = /\b(?:st|state|snap)\.([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*)/g;
// 比较阈值：(>=|<=|>|<|===|!==|==|!=) 数字
const NUM_RE = /(?:>=|<=|===|!==|==|!=|>|<)\s*(-?\d[\d_]*(?:\.\d+)?)/g;
// flags 引用
const FLAG_RE = /flags\s*(?:\.\s*([A-Za-z_$][\w$]*)|\[\s*["']([A-Za-z_$][\w$]*)["']\s*\])/g;

/** 把 `st.player.phase` 归到一级域 `player`；保留二级以兼顾可读性 */
function topPath(p) {
  const parts = p.split(".");
  return parts.length >= 2 ? parts[0] + "." + parts[1] : parts[0];
}

const pathCount = new Map(); // 路径 -> Set(eventId)
const flagCount = new Map();
const numCount = new Map(); // "player.day>=200" 这种不好归，只统计数值本身
const phaseCount = new Map();
const verdictCount = new Map();

let analyzed = 0;
for (const d of targets) {
  const e = byId.get(d.id);
  if (!e) continue;
  analyzed++;
  verdictCount.set(d.verdict, (verdictCount.get(d.verdict) || 0) + 1);
  phaseCount.set(d.phase || "(无)", (phaseCount.get(d.phase || "(无)") || 0) + 1);

  const src =
    (typeof e.conditions === "function" ? e.conditions.toString() : "") +
    "\n" +
    (e.triggers ? JSON.stringify(e.triggers) : "") +
    "\n" +
    (typeof e.trigger === "function" ? e.trigger.toString() : "");

  const add = (map, key) => {
    if (!key) return;
    if (!map.has(key)) map.set(key, new Set());
    map.get(key).add(d.id);
  };

  PATH_RE.lastIndex = 0;
  let m;
  while ((m = PATH_RE.exec(src)) !== null) add(pathCount, topPath(m[1]));
  FLAG_RE.lastIndex = 0;
  while ((m = FLAG_RE.exec(src)) !== null) add(flagCount, m[1] || m[2]);
  NUM_RE.lastIndex = 0;
  while ((m = NUM_RE.exec(src)) !== null) {
    const v = Number(String(m[1]).replace(/_/g, ""));
    if (Number.isFinite(v) && Math.abs(v) >= 10) add(numCount, String(v));
  }
}

// ── 输出 ──────────────────────────────────────────────────────
/** Map<key, Set> -> [[key, size]] 降序 */
const sortMap = (map) =>
  [...map.entries()].map(([k, s]) => [k, s.size]).sort((a, b) => b[1] - a[1]);
/** Map<key, number> -> [[key, n]] 降序 */
const sortCount = (map) => [...map.entries()].sort((a, b) => b[1] - a[1]);

// 条件源码指纹：归一化空白后取前 240 字符，用于找"共用同一套条件"的事件群
const fingerprint = (src) => {
  const s = src.replace(/\s+/g, " ").replace(/\/\*[\s\S]*?\*\//g, "").trim();
  return s.slice(0, 240);
};
const fpGroups = new Map(); // fingerprint -> Set(eventId)
for (const d of targets) {
  const e = byId.get(d.id);
  if (!e || typeof e.conditions !== "function") continue;
  const fp = fingerprint(e.conditions.toString());
  if (!fpGroups.has(fp)) fpGroups.set(fp, new Set());
  fpGroups.get(fp).add(d.id);
}
const fpSorted = [...fpGroups.entries()]
  .map(([fp, ids]) => ({ fp, n: ids.size, ids: [...ids] }))
  .sort((a, b) => b.n - a.n);

console.log("事件阻塞原因模式分析");
console.log("  数据源: " + path.relative(ROOT, JSON_IN));
console.log("  分析范围: " + BLOCKED_VERDICTS.join(", "));
console.log("  分析事件数: " + analyzed);
console.log("");

console.log("按判定分布:");
for (const [k, n] of sortCount(verdictCount)) {
  console.log("  " + String(k).padEnd(20) + n);
}
console.log("");
console.log("按 phase 分布:");
for (const [k, n] of sortCount(phaseCount)) {
  console.log("  " + String(k).padEnd(20) + n);
}

console.log("");
console.log("═".repeat(72));
console.log("★★ 共用同一套 conditions 的事件群（Top 15）");
console.log("═".repeat(72));
console.log("说明：conditions 源码归一化后完全相同 → 一次修复可解锁整群。");
console.log("");
for (const g of fpSorted.slice(0, 15)) {
  if (g.n < 2) break;
  console.log("  ▸ " + g.n + " 个事件共用同一套条件");
  console.log("    示例 id: " + g.ids.slice(0, 3).join(", "));
  console.log("    条件片段: " + g.fp.slice(0, 150).replace(/\n/g, " ") + "…");
  console.log("");
}
const fpDupTotal = fpSorted.filter((g) => g.n >= 2).reduce((s, g) => s + g.n, 0);
console.log(
  "  小计: " + fpSorted.filter((g) => g.n >= 2).length + " 组 / " + fpDupTotal +
    " 个事件（占被阻塞事件的 " + ((fpDupTotal / Math.max(1, analyzed)) * 100).toFixed(1) + "%）",
);

console.log("");
console.log("─".repeat(72));
console.log("依赖最多的状态路径（Top 30）—— 即「这些事件在等什么」");
console.log("─".repeat(72));
console.log("依赖事件数 | 状态路径");
for (const [k, n] of sortMap(pathCount).slice(0, 30)) {
  console.log("  " + String(n).padStart(6) + "   | " + k);
}

console.log("");
console.log("─".repeat(72));
console.log("引用最多的 flag（Top 30）");
console.log("─".repeat(72));
console.log("依赖事件数 | flag");
for (const [k, n] of sortMap(flagCount).slice(0, 30)) {
  console.log("  " + String(n).padStart(6) + "   | " + k);
}

console.log("");
console.log("─".repeat(72));
console.log("出现最多的数值门槛（Top 30）—— 可能是「阈值定太高」");
console.log("─".repeat(72));
console.log("依赖事件数 | 阈值");
for (const [k, n] of sortMap(numCount).slice(0, 30)) {
  console.log("  " + String(n).padStart(6) + "   | " + k);
}

if (JSON_OUT) {
  const out = {
    source: path.relative(ROOT, JSON_IN),
    analyzed,
    verdicts: Object.fromEntries(sortCount(verdictCount)),
    phases: Object.fromEntries(sortCount(phaseCount)),
    sharedConditionGroups: fpSorted
      .filter((g) => g.n >= 2)
      .slice(0, 40)
      .map((g) => ({ count: g.n, ids: g.ids, snippet: g.fp.slice(0, 300) })),
    topPaths: Object.fromEntries(sortMap(pathCount).slice(0, 60)),
    topFlags: Object.fromEntries(sortMap(flagCount).slice(0, 60)),
    topThresholds: Object.fromEntries(sortMap(numCount).slice(0, 60)),
  };
  fs.writeFileSync(path.resolve(ROOT, JSON_OUT), JSON.stringify(out, null, 2), "utf8");
  console.log("");
  console.log("已写出 JSON: " + JSON_OUT);
}
