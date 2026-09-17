#!/usr/bin/env node
/**
 * 同名串扰检测（信息层）—— 报告第 56 节
 * ============================================================================
 *
 * 【为什么需要】
 * `events_reachability.cjs` 的 `hasWriteSite(pathStr)` 只取**叶子键名**在全库找
 * 写入点、**不校验路径前缀** → 死字段被同名活字段"洗白"（第 55 节「盲区七」）。
 * 后果是**漏报**：真死路径从未入账，债务清单**虚低**，让人以为做完了。
 *
 * 【设计姿态：信息层，不硬失败】
 * 门禁原注释写着「宁可漏报不可误报，符合预期姿态」。收紧判据会引入新误报
 * （别名 / 整体赋值+字面量 / 动态键都会让"路径感知"判据看不见写入）。
 * 所以本脚本**不改动门禁的硬失败判据**，只产出**候选清单 + 诊断信息**：
 *
 *   - 候选  ：门禁判活、路径感知判死
 *   - 诊断① ：同名写入点在哪（串扰来源，前 3 处）
 *   - 诊断② ：父容器是否有**整体赋值**（`parent = ...`）→ 需人工确认
 *
 * 判据实现在 `tests/lib/path_aware_write.cjs`，与阴性对照测试**共用同一份**，
 * 避免两处实现漂移。
 *
 * 【退出码】始终 0（信息层）。判据可信度由
 * `tests/reachability_path_aware_control.cjs` 的阴性对照保证，那个脚本才失败。
 *
 * 用法：
 *   node tests/reachability_same_name_crosstalk.cjs
 *   node tests/reachability_same_name_crosstalk.cjs --json
 */

const path = require("path");
const { createIndex } = require("./lib/path_aware_write.cjs");

// 与门禁同口径的忽略清单（保持同步；不同步会产出假候选）
const IGNORED_LAST_SEG = {
  length: true, push: true, pop: true, shift: true, unshift: true,
  splice: true, slice: true, concat: true, join: true, map: true,
  filter: true, reduce: true, forEach: true, includes: true, indexOf: true,
  hasOwnProperty: true, toString: true, valueOf: true, keys: true,
  values: true, entries: true, sort: true, reverse: true, find: true,
  some: true, every: true, trim: true, split: true, replace: true,
  toFixed: true, toUpperCase: true, toLowerCase: true,
};

const KNOWN_DYNAMIC_DICT = {
  "state.relationships.": "relationships 是按 NPC id 动态挂载的字典",
  "state.flags.": "flags 是按语义动态挂载的标记字典",
};

// 已人工确认"活"的路径白名单（避免每轮重复报）。
// ⚠️ 纪律：每项必须写明**确认依据**（真实容器 + 写入点），禁止为"让输出变短"而添加。
const KNOWN_ALIVE = {
  // { 路径: "确认依据 [日期]" }
};

const idx = createIndex();

// `--json` 模式：headless 加载时会往 stdout 打大量 `[C Rxxx]` 注册日志，
// 会污染 JSON 输出。在 require headless **之前**就把 console.log 静音，
// 最后再用原函数输出 JSON。
const AS_JSON = process.argv.slice(2).indexOf("--json") !== -1;
const _realLog = console.log;
if (AS_JSON) console.log = function () {};

// ── 载入 headless 引擎，取 schema 与事件表（与门禁同源）──────────────────
const runner = require("./headless_runner.cjs");

// ⚠️ 必须先 init，否则 RANDOM_EVENTS 尚未挂到全局（门禁第 85 行同理）。
//    漏掉这一步的表现是 "无法获取 RANDOM_EVENTS"。
runner.init({ strict: false });

const baseline = runner.createState({ seed: 42 });
const schemaKeys = {};
(function collect(o, prefix) {
  if (!o || typeof o !== "object") return;
  for (const k of Object.keys(o)) {
    const p = prefix ? prefix + "." + k : k;
    schemaKeys[p] = true;
    const v = o[k];
    if (v && typeof v === "object" && !Array.isArray(v)) collect(v, p);
  }
})(baseline, "state");
schemaKeys["state"] = true;

const RE = typeof RANDOM_EVENTS !== "undefined" ? RANDOM_EVENTS : globalThis.RANDOM_EVENTS;
if (!RE) {
  console.error("[crosstalk] 无法获取 RANDOM_EVENTS");
  process.exit(0);
}

const VALID_PHASES = { street: true, corporate: true };

function extractReadPaths(fnSrc) {
  const out = {};
  const re = /\b(?:st|state)\s*\.\s*([A-Za-z_$][\w$]*)(?:\s*\.\s*([A-Za-z_$][\w$]*))?(?:\s*\.\s*([A-Za-z_$][\w$]*))?/g;
  let m;
  while ((m = re.exec(fnSrc))) {
    let p = "state." + m[1];
    if (m[2]) p += "." + m[2];
    if (m[3]) p += "." + m[3];
    out[p] = true;
  }
  return Object.keys(out);
}

// 门禁口径的"全局写入点"（只取叶子键名）—— 复现门禁的判定
function globalLeafHasWrite(key) {
  const k = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re1 = new RegExp("(?:^|[^\\w$])" + k + "\\s*(?:[-+*/%&|^]?=(?!=|>)|\\+\\+|--|:\\s*(?![=]))", "m");
  const re2 = new RegExp(k + "\\s*\\.\\s*(?:push|unshift|splice|set|add)\\s*\\(", "m");
  const re3 = new RegExp("Object\\s*\\.\\s*assign\\s*\\([^)]*\\b" + k + "\\b", "m");
  const re4 = new RegExp("delete\\s+[\\w$.]*\\b" + k + "\\b", "m");
  for (const f of idx.filesWith(key)) {
    if (re1.test(f.text) || re2.test(f.text) || re3.test(f.text) || re4.test(f.text)) return true;
  }
  return false;
}

// ── 主流程 ──────────────────────────────────────────────────────────────
const candidates = {}; // path -> { events:Set, parent, key }
const excluded = { alias: new Set(), literal: new Set(), knownAlive: new Set() };

for (const e of RE) {
  if (!e || typeof e.conditions !== "function") continue;
  if (!VALID_PHASES[e.phase]) continue;

  for (const p of extractReadPaths(e.conditions.toString())) {
    const lastSeg = p.substring(p.lastIndexOf(".") + 1);
    if (IGNORED_LAST_SEG[lastSeg]) continue;
    if (schemaKeys[p]) continue;                  // ① 完整路径在 schema → 活
    if (candidates[p]) { candidates[p].events.add(e.id); continue; }
    if (excluded.alias.has(p) || excluded.literal.has(p) || excluded.knownAlive.has(p)) continue;

    const segs = p.split(".");
    const parent = segs.slice(0, segs.length - 1).join(".");
    if (parent !== "state" && !schemaKeys[parent]) continue;        // ② 父容器懒初始化
    if (parent === "state") continue;                               // ②b 顶层：无新信息
    if (Object.keys(KNOWN_DYNAMIC_DICT).some((d) => p.startsWith(d))) continue; // ②c 动态字典

    // ③ 门禁：叶子键名有写入点 → 判活（否则属基线，不在本工具范围）
    if (!globalLeafHasWrite(lastSeg)) continue;

    // ★ 路径感知判定
    if (KNOWN_ALIVE[p]) { excluded.knownAlive.add(p); continue; }
    const v = idx.verdict(parent, lastSeg);
    if (v.how === "alias") { excluded.alias.add(p); continue; }
    if (v.how === "literal") { excluded.literal.add(p); continue; }
    if (v.alive) continue; // scoped

    candidates[p] = { events: new Set([e.id]), parent, key: lastSeg };
  }
}

// ── 输出 ────────────────────────────────────────────────────────────────
const rows = Object.keys(candidates).map((p) => {
  const c = candidates[p];
  const bulk = idx.parentBulkAssignSites(c.parent);
  const global = idx.globalWriteSites(c.key);
  return {
    path: p,
    events: c.events.size,
    parent: c.parent,
    key: c.key,
    bulkAssign: bulk.length,
    bulkSamples: bulk.slice(0, 3),
    crosstalkCount: global.length,
    crosstalkSamples: global.slice(0, 3),
  };
});
rows.sort((a, b) => b.events - a.events);

if (AS_JSON) {
  _realLog(JSON.stringify({
    total: rows.length,
    excluded: { alias: excluded.alias.size, literal: excluded.literal.size, knownAlive: excluded.knownAlive.size },
    rows,
  }, null, 2));
  process.exit(0);
}

console.log("[crosstalk] 同名串扰候选（门禁判活、路径感知判死）—— 信息层，不失败");
console.log("[crosstalk] 候选数 = " + rows.length +
  "（降噪排除：" + excluded.alias.size + " 条经「别名写入」、" +
  excluded.literal.size + " 条经「整体赋值+字面量键」近似判活、" +
  excluded.knownAlive.size + " 条在白名单）");
console.log("");

for (const r of rows) {
  console.log("─ " + r.path + "  （" + r.events + " 个事件引用）");
  console.log("    串扰来源：叶子键名 '" + r.key + "' 全库 " + r.crosstalkCount + " 处写入");
  for (const s of r.crosstalkSamples) console.log("      · " + s.file + ":" + s.line + "  " + s.text);
  if (r.bulkAssign > 0) {
    console.log("    ⚠ 父容器有 " + r.bulkAssign + " 处整体赋值 → **必须人工确认**（可能是局部对象构造后整体赋值，即真活）");
    for (const s of r.bulkSamples) console.log("      · " + s.file + ":" + s.line + "  " + s.text);
  } else {
    console.log("    ✓ 父容器无整体赋值 → 高度疑似真死");
  }
  console.log("");
}

console.log("[crosstalk] 人工确认流程：");
console.log("  1. 看「父容器整体赋值」→ 若赋值源的字面量/构造体里**没有**这个 key → 真死");
console.log("  2. 真死 → 找真实容器，改消费点（或补写入点）");
console.log("  3. 真活 → 加进 KNOWN_ALIVE，并写明确认依据");
process.exit(0);
