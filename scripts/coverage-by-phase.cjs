#!/usr/bin/env node
/**
 * coverage-by-phase.cjs — 把事件覆盖率按 phase 拆开看
 *
 * 动机：覆盖率审计（13.4%）是在一个**只能探索 street 阶段**的夹具上跑出来的。
 * 若 corporate 阶段的事件压根到不了，把它们算进"未触达"的分母里就是不公平的。
 * 本脚本回答：分开看，street 和 corporate 各自的覆盖率是多少？
 *
 * 用法：
 *   node scripts/coverage-by-phase.cjs
 *   node scripts/coverage-by-phase.cjs --coverage coverage-report.json --reach reachability-report.json
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
const COV = path.resolve(ROOT, argStr("coverage", "coverage-report.json"));
const REACH = path.resolve(ROOT, argStr("reach", "reachability-report.json"));

if (!fs.existsSync(COV)) {
  console.error("找不到 " + COV);
  process.exit(1);
}
const cov = JSON.parse(fs.readFileSync(COV, "utf8"));
const reach = fs.existsSync(REACH) ? JSON.parse(fs.readFileSync(REACH, "utf8")) : null;

const ok = runner.init({ strict: false });
if (!ok) {
  console.error("引擎加载失败");
  process.exit(0);
}
const ALL_EVENTS = typeof RANDOM_EVENTS !== "undefined" ? RANDOM_EVENTS : [];
const byId = new Map();
for (const e of ALL_EVENTS) if (e && e.id && !byId.has(e.id)) byId.set(e.id, e);

const firedSet = new Set(Object.keys(cov.fired || {}));
const neverSet = new Set(cov.neverFired || []);
const reachById = new Map();
if (reach) for (const d of reach.details || []) reachById.set(d.id, d);

// ── 按 phase 拆分 ─────────────────────────────────────────────
const groups = new Map(); // phase -> {total, fired, never, verdicts:Map}
for (const [id, e] of byId) {
  const ph = e.phase || "(无 phase)";
  if (!groups.has(ph)) {
    groups.set(ph, { total: 0, fired: 0, never: 0, verdicts: new Map(), chain: 0 });
  }
  const g = groups.get(ph);
  g.total++;
  if (e._isChainEvent) g.chain++;
  if (firedSet.has(id)) g.fired++;
  else if (neverSet.has(id)) g.never++;
  const rd = reachById.get(id);
  if (rd) g.verdicts.set(rd.verdict, (g.verdicts.get(rd.verdict) || 0) + 1);
}

console.log("事件覆盖率 · 按 phase 拆分");
console.log("  覆盖率数据: " + path.relative(ROOT, COV));
if (reach) console.log("  可达性数据: " + path.relative(ROOT, REACH));
console.log("  覆盖率采样: " + (cov.daysSimulated || "?") + " 模拟日");
console.log("");

const rows = [...groups.entries()].sort((a, b) => b[1].total - a[1].total);
console.log("| phase | 事件总数 | 触发过 | 覆盖率 | 未触发 | 其中链式 |");
console.log("|-------|---------|--------|--------|--------|---------|");
for (const [ph, g] of rows) {
  const pct = g.total ? ((g.fired / g.total) * 100).toFixed(1) : "0.0";
  console.log(
    "| " + ph + " | " + g.total + " | " + g.fired + " | **" + pct + "%** | " + g.never + " | " + g.chain + " |",
  );
}
const totTotal = rows.reduce((s, [, g]) => s + g.total, 0);
const totFired = rows.reduce((s, [, g]) => s + g.fired, 0);
console.log(
  "| **合计** | " + totTotal + " | " + totFired + " | **" +
    ((totFired / totTotal) * 100).toFixed(1) + "%** | " + (totTotal - totFired) + " | " +
    rows.reduce((s, [, g]) => s + g.chain, 0) + " |",
);

if (reach) {
  console.log("");
  console.log("各 phase 的阻塞判定分布:");
  for (const [ph, g] of rows) {
    if (g.verdicts.size === 0) continue;
    const parts = [...g.verdicts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => k + "=" + n)
      .join(", ");
    console.log("  " + String(ph).padEnd(12) + parts);
  }

  console.log("");
  console.log("─".repeat(72));
  console.log("★ 关键修正：把「夹具到不了的 phase」从分母里剔掉后的真实覆盖率");
  console.log("─".repeat(72));
  // 用可达性判定判断"夹具够不够得着"：若该 phase 的事件几乎全是 BLOCK_*，
  // 说明该 phase 整体不可达，不是单个事件的问题。
  for (const [ph, g] of rows) {
    const blocked = ["DEAD_FLAG", "BLOCK_CONDITIONS", "BLOCK_TRIGGERS", "BLOCK_TRIGGER_FN", "BLOCK_CASH"]
      .reduce((s, k) => s + (g.verdicts.get(k) || 0), 0);
    const rare = g.verdicts.get("RARE") || 0;
    const fired = g.verdicts.get("FIRED") || 0;
    const judged = blocked + rare + fired + (g.verdicts.get("CHAIN_ONLY") || 0);
    if (judged === 0) continue;
    console.log(
      "  " + String(ph).padEnd(12) +
        " 已判定 " + String(judged).padStart(5) +
        " | 触发 " + String(fired).padStart(4) +
        " | 通过闸门未抽中(RARE) " + String(rare).padStart(4) +
        " | 从未过闸门 " + String(blocked).padStart(5) +
        " (" + ((blocked / judged) * 100).toFixed(1) + "%)",
    );
  }
  console.log("");
  console.log("  读法：某 phase 的「从未过闸门」占比接近 100% → 该 phase 整体不可达（夹具问题或设计门槛过高），");
  console.log("        而非「这一批事件质量差」。修夹具/降门槛的收益远大于逐条改事件。");
}
