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
 * 【第 58 节新增 E 段：判据的**输入层**】
 *   上面 A~D 段守的是「判据算得对不对」，E 段守的是「喂给判据的东西干不干净」。
 *   两个判据都用 `conditions.toString()` 取源码 —— 而它**保留函数体内注释**，
 *   于是修复说明注释里的旧字段名会被当成真实读取点。
 *   真实案例：`state.needs.health` 在全库**只出现在注释里**，
 *   却作为候选在 35 / 34 / 29 三份清单里连续存在了三轮。
 *
 * 【退出码】任一断言失败 → exit 1（接入 npm test）
 *
 * 用法：node tests/reachability_path_aware_control.cjs
 */

const { createIndex, stripComments, extractReadPaths } = require("./lib/path_aware_write.cjs");

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
    path: "state.investment.totalInvested",
    why: "全库零写入；真实容器 _totalInvested 本身也是死的。",
  },
  {
    // [报告第 57 节] 原为 state.trade.totalTrades / totalBuys —— 本节已补写入端
    //   （investment.js:2004/2176 + state.js:940-942），故从阳性移到阴性。
    //   换入的两个新阳性都是**双方法交叉验证过**的真死路径。
    path: "state.employment.currentJob.id",
    why: "父容器 employment.currentJob 全库零写入（仅 main.js:4762 初始化为 null），" +
      "129 处读取全为死读。叶子键名 'id' 有大量写入（DOM container.id 等）→ 正是盲区七的形态。",
  },
  {
    path: "state.stats.actionFreq.buyGood",
    why: "叶子键名 'buyGood' 的\"写入\"是 window.buyGood = function（phase1/pricing.js:771、" +
      "phase1/trade.js:649）—— 那是全局函数定义，不是 state.stats.actionFreq 的键。",
  },
  {
    // [报告第 58 节] 两者均为幻影容器，消费者已改指向真实容器：
    //   startup.team      → startup.company.employees（r870:72 / r826:204）
    //   startup.companies → startup.company          （career_linkage_events.js:230）
    //   加入阳性的目的：**防止有人把旧名字再加回来**。
    path: "state.startup.team",
    why: "不在 startup schema、全库零写入。两个消费者（r870 当数组用 .length、" +
      "r826 当对象用 .members.length）契约互斥，但语义都是「团队人数」→ 已统一改读 " +
      "startup.company.employees。",
  },
  {
    path: "state.startup.companies",
    why: "不在 startup schema、全库零写入。⚠️ 真实容器不是 state.enterpriseFate.companies" +
      "（那是 company_spawner 生成的**市场公司池**，语义完全不同）——" +
      "正确目标是单数的 startup.company，与同链的 st.corporate.company 对齐。",
  },
  {
    // [报告第 59 节] 7 个 C→G「职业倦怠→健康」阶梯事件（c798/c813/c824/c840/c848/c856/c864）
    //   的 conditions 都读这个路径 → 恒 0 → 7 个事件全死。
    //   ★ 父容器有 20 处「整体赋值」，但**全部是 `x = x || {}` 幂等守卫**，无一处写 burnout
    //     —— 这正是判据把「整体赋值」当作写入信号的假阳性形态（人工逐条确认后才排除）。
    //   ★ 运行时决定性证据：`st.player.corporate` 是**职场 7 维属性容器**
    //     （state.js:36，schema 恒存在）→ 三元表达式**恒取第一支**，
    //     作者写的 `needs.fatigue` 回退支**永远不可达**（死代码）。
    path: "state.player.corporate.burnout",
    why: "全库零写入。真实容器是 state.careerCapital.burnout" +
      "（career_dev.js:703 ensureCareerCapital 懒初始化，0-100，clampCareerCapital 夹紧）。",
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
  {
    // [报告第 57 节] 果实 G3 补写入端后由死转活 —— 同时验证判据跟得上修复。
    kind: "直接写入（本节新增）",
    path: "state.trade.totalTrades",
    site: "phase2/investment.js:2004（买）/:2176（卖）+ core/state.js:940 加载时按 tradeLog 重算",
  },
  {
    kind: "直接写入（本节新增）",
    path: "state.trade.totalBuys",
    site: "phase2/investment.js:2005 + core/state.js:941",
  },
  {
    kind: "直接写入（本节新增）",
    path: "state.trade.totalSells",
    site: "phase2/investment.js:2177 + core/state.js:942",
  },
  {
    kind: "直接写入（本节新增）",
    path: "state.employment.completedShifts",
    site: "main.js:4764  doStreetJob() 每次上工 completedShifts[job.id]++",
  },
  {
    // [报告第 59 节] 果实 G8 改指向后由死转活 —— 同时验证判据跟得上修复。
    //   注意父容器 careerCapital 是**懒初始化**（不在 schema），判据靠「有写入点」判活。
    kind: "直接写入（本节新增）",
    path: "state.careerCapital.burnout",
    site: "core/domain_c_linkage_r371.js:79（scoped）+ career_path_events.js 等 cap.burnout 写入（别名）",
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

// ══════════════════════════════════════════════════════════════════════════
// E. 判据的**输入层**：必须剥注释 —— 报告第 58 节
//
//   背景：两个判据都用 `e.conditions.toString()` 拿函数源码再提取路径，
//   而 `Function.prototype.toString()` **原样保留函数体内的注释**。
//   于是「修复说明注释」里写的旧字段名会被当成真实读取点：
//
//     conditions: function (st) {
//       // [自洽修复] st.needs.health 不存在 → 改为 st.status.health
//       return st.status.health < 50;          // ← 真正在跑的代码
//     }
//
//   → 提取器同时得到 `state.needs.health`（注释）与 `state.status.health`（代码）
//   → 凭空多出一条候选。**注释写得越认真，清单越长。**
//
//   真实数据佐证：`st.needs.health` 在**全库每一次出现都是注释**
//   （events_street_survival.js:246 / events_corp.js:417 / cross_system_events_part2.js:497,509 /
//     domain_h_linkage_r170.js:39 / r188.js:144,157,178 / investment.js:1494 …），
//   真实字段早已改成 st.status.health。它是**纯注释假候选**。
// ══════════════════════════════════════════════════════════════════════════

// E1~E3：剥注释本体
const _blockComment = "var a = 1; /* st.fake.path */ var b = 2;";
check("输入层·剥块注释", extractReadPaths(stripComments(_blockComment)).length, 0,
  "块注释里的 st.fake.path 不应被提取");

const _lineComment = "var a = 1; // st.fake.path\nvar b = 2;";
check("输入层·剥行注释", extractReadPaths(stripComments(_lineComment)).length, 0,
  "行注释里的 st.fake.path 不应被提取");

const _urlGuard = 'var u = "https://example.com/x"; // st.fake.path';
check("输入层·URL 不被误当行注释起点",
  stripComments(_urlGuard).indexOf("https://example.com/x") >= 0, true,
  "`[^:]` 保护：`://` 后的内容不得被吞掉");

// E4：反向验证 —— 不剥注释时**确实会**提取到（证明 E1~E3 不是恒真断言）
check("输入层·未剥注释时确实会误提取（反向验证）",
  extractReadPaths(_lineComment).indexOf("state.fake.path") >= 0, true,
  "若不剥注释会得到 state.fake.path → 证明剥注释是真的在起作用，而非断言恒真");

// E5：真实数据 —— 全库 st.needs.health 只出现在注释里
let _rawHits = 0;
let _strippedHits = 0;
for (const f of idx.files) {
  _rawHits += (f.text.match(/st\.needs\.health/g) || []).length;
  _strippedHits += (stripComments(f.text).match(/st\.needs\.health/g) || []).length;
}
check("输入层·真实数据：未剥注释时能看到 st.needs.health（" + _rawHits + " 处）",
  _rawHits > 0, true, "全库 " + _rawHits + " 处，全部位于修复说明注释中");
check("输入层·真实数据：剥注释后 st.needs.health 归零",
  _strippedHits, 0,
  "真实字段是 st.status.health —— 该候选此前是纯注释假候选");

// ── E6~E7：源码守卫 —— 判据**必须真的调用** stripComments ────────────────
//
// 【为什么必须有这两条】上面的 E1~E5 只验证 `stripComments` **本身**正确。
// 它们**不验证判据是否调用了它**。
//
// 于是一个完全隐蔽的回归是可能发生的：
//   有人重构 events_reachability.cjs，把 `extractReadPaths(stripComments(src))`
//   改回 `extractReadPaths(src)` —— E1~E5 **全部继续通过**，
//   因为 `stripComments` 函数还在、还正确，只是**没人调用它了**。
//
// 这正是纪律 5 的「源码守卫」要防的形态：
// **行为守卫防逻辑回退，源码守卫防"代码在但调用点被删"。**
//
// 守卫必须**剥注释后再匹配**（纪律 5 的教训）—— 否则本文件自己的说明注释
// 里就写着 `extractReadPaths(stripComments(`，会把自己匹配上，形成恒真断言。
const fsx = require("fs");
const pathx = require("path");
const _judgeSources = [
  ["硬门禁", "events_reachability.cjs"],
  ["信息层", "reachability_same_name_crosstalk.cjs"],
];
for (const [label, rel] of _judgeSources) {
  const src = stripComments(
    fsx.readFileSync(pathx.join(__dirname, rel), "utf8"),
  );
  const hasCall = /extractReadPaths\s*\(\s*stripComments\s*\(/.test(src);
  const bareCall = /extractReadPaths\s*\(\s*(?!stripComments)/.test(src);
  check("输入层·源码守卫：" + label + " 必须调用 extractReadPaths(stripComments(…))",
    hasCall, true,
    rel + " —— 删掉这处调用后 E1~E5 仍会全绿，只有本守卫能发现");
  check("输入层·源码守卫：" + label + " 不得有未剥注释的裸调用",
    bareCall, false,
    rel + " 中不得出现 extractReadPaths( 后面直接跟非 stripComments 的实参");
}

// ── 输出 ────────────────────────────────────────────────────────────────
console.log("[path-aware-control] 路径感知写入判据 · 阴性对照");
console.log("[path-aware-control] 阳性 " + POSITIVE.length +
  " / 阴性 " + NEGATIVE.length + " / 核心 3 / 一致性 " + NEGATIVE.length +
  " / 输入层 6，共 " + results.length + " 条断言");
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
