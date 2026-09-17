#!/usr/bin/env node
/**
 * 路径感知写入判据 —— 阴性对照测试 —— 报告第 56 节
 * ============================================================================
 *
 * 【为什么必须有这个文件】
 *
 * 第 52 节的教训：**正向验证只能证明「会报警」**。
 *
 * > 一个只会报警的门禁，和一个「报警 + 不误报」的门禁，
 * > 在只有正例的测试里长得一模一样。
 *
 * `tests/lib/path_aware_write.cjs` 是**判据**，它宣称的能力是：
 *   「写入必须挂在同一父容器上，因此能识破同名串扰」
 * 但如果它把**活**字段也判成死，那它产出的候选清单就是垃圾 ——
 * 而这件事**只有阴性对照能发现**。
 *
 * 【对照样本全部取自真实数据，不自己造】（第 52 节纪律）
 * 每个用例都标注了真实写入点的文件:行号，可人工复核。
 *
 * 【退出码】任一断言失败 → exit 1（接入 npm test）
 *
 * 用法：node tests/reachability_path_aware_control.cjs
 */

const { createIndex } = require("./lib/path_aware_write.cjs");

const idx = createIndex();
let failed = 0;
const results = [];

function check(name, actual, expected, note) {
  const ok = actual === expected;
  if (!ok) failed++;
  results.push({ name, ok, actual, expected, note });
}

// 门禁口径的"全局写入点"（只取叶子键名）—— 用来复现盲区七
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

function verdictOf(fullPath) {
  const segs = fullPath.split(".");
  const key = segs[segs.length - 1];
  const parent = segs.slice(0, segs.length - 1).join(".");
  return idx.verdict(parent, key);
}

// ══════════════════════════════════════════════════════════════════════════
// A. 阳性用例：**真实死路径** → 判据必须判死（alive === false）
//
//    全部经人工确认：真实容器不存在该键 / 全库零写入。
// ══════════════════════════════════════════════════════════════════════════
const POSITIVE = [
  {
    path: "state.startup.company.team",
    why: "company 字面量（startup.js:537-749）无 team 键；37 处引用全为读取。" +
      "真实容器是 company.employees（startup.js:1480 push）。",
  },
  {
    path: "state.trade.totalTrades",
    why: "全库零写入（叶子键名 totalTrades 亦为 0 处）。",
  },
  {
    path: "state.investment.totalInvested",
    why: "全库零写入；真实容器 _totalInvested 本身也是死的。",
  },
  {
    path: "state.trade.totalBuys",
    why: "全库零写入。",
  },
];

for (const c of POSITIVE) {
  check("阳性·判死  " + c.path, verdictOf(c.path).alive, false, c.why);
}

// ══════════════════════════════════════════════════════════════════════════
// B. 阴性用例：**真实活字段** → 判据必须判活（alive === true）
//
//    ★ 必须覆盖 4 种"路径感知看不见"的形态 —— 这是判据最容易误报的地方。
// ══════════════════════════════════════════════════════════════════════════
const NEGATIVE = [
  {
    kind: "直接写入",
    path: "state.trade.totalProfit",
    site: "phase1/trade.js:222  state.trade.totalProfit = (state.trade.totalProfit || 0) + ...",
  },
  {
    kind: "直接写入（对象）",
    path: "state.resources.totalEarned",
    site: "core/state.js:74 schema 初始化 + cross_system_events*.js 数十处写入",
  },
  {
    kind: "别名写入",
    path: "state.investment._totalInvestmentProfit",
    site: "phase2/investment.js:2146  inv._totalInvestmentProfit = ...（inv 是 state.investment 的别名）",
  },
  {
    kind: "别名写入",
    path: "state.startup.company.revenue",
    site: "phase2/startup.js:2282  company.revenue = Math.max(0, company.revenue + value)",
  },
  {
    kind: "整体赋值+字面量",
    path: "state.startup.company.industry",
    site: "phase2/startup.js:540  industry: industry（company 字面量）→ :749 整体赋值",
  },
  {
    kind: "数组方法（同一父容器）",
    path: "state.corporate.team",
    site: "phase2/team.js:62  state.corporate.team.push(member)",
  },
  {
    kind: "数组方法（别名）",
    path: "state.startup.company.employees",
    site: "phase2/startup.js:1480  company.employees.push(employee)",
  },
];

for (const c of NEGATIVE) {
  const v = verdictOf(c.path);
  check("阴性·判活  " + c.path + "  [" + c.kind + "]", v.alive, true,
    "真实写入点：" + c.site + "（判据命中方式：" + v.how + "）");
}

// ══════════════════════════════════════════════════════════════════════════
// C. 核心断言：**同名串扰**必须被区分
//
//    state.corporate.team 与 state.startup.company.team 叶子键名相同、前缀不同。
//    门禁（叶子判据）对两者给**相同**结论（都判活）；
//    路径感知判据必须给**不同**结论。
//    这一条通过 = 盲区七被堵上。
// ══════════════════════════════════════════════════════════════════════════
check(
  "核心·门禁对同名两者都判活（复现盲区七）",
  globalLeafHasWrite("team") && globalLeafHasWrite("team"),
  true,
  "叶子键名 'team' 在全库有写入（来自 state.corporate.team）→ 门禁据此把 startup.company.team 也判活",
);
check(
  "核心·路径感知区分两者（corporate.team 活）",
  verdictOf("state.corporate.team").alive,
  true,
  "phase2/team.js:62/86",
);
check(
  "核心·路径感知区分两者（startup.company.team 死）",
  verdictOf("state.startup.company.team").alive,
  false,
  "startup.company 字面量无 team 键",
);

// ══════════════════════════════════════════════════════════════════════════
// D. 一致性：判据的"活"结论必须能给出**具体写入点**（不能凭空说活）
// ══════════════════════════════════════════════════════════════════════════
for (const c of NEGATIVE) {
  const v = verdictOf(c.path);
  check("一致性·有活必有据  " + c.path, v.sites.length > 0, true,
    "命中方式=" + v.how + "，命中 " + v.sites.length + " 处");
}

// ── 输出 ────────────────────────────────────────────────────────────────
console.log("[path-aware-control] 路径感知写入判据 · 阴性对照");
console.log("[path-aware-control] 阳性 " + POSITIVE.length +
  " / 阴性 " + NEGATIVE.length + " / 核心 3 / 一致性 " + NEGATIVE.length +
  "，共 " + results.length + " 条断言");
console.log("");

for (const r of results) {
  console.log((r.ok ? "  ✓ " : "  ✗ ") + r.name);
  if (!r.ok) {
    console.log("      期望 alive=" + r.expected + "，实际 alive=" + r.actual);
    console.log("      依据：" + r.note);
  }
}

console.log("");
if (failed > 0) {
  console.log("[path-aware-control] FAIL — " + failed + " / " + results.length + " 条断言失败");
  console.log("  ★ 判据不可信 → 它产出的候选清单不得写进任何台账。");
  process.exit(1);
}
console.log("[path-aware-control] PASS — 判据既不漏报（阳性全判死）也不误报（阴性全判活）");
process.exit(0);
