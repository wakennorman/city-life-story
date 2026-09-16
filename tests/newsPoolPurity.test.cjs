/**
 * 共享新闻池「纯度」· 回归测试
 *
 * 背景（2026-09-16 修复）：
 *   events_core.js 的 `_rollOneDailyNews(state)` 原是：
 *       news._appliedDay = state.player.day;
 *       state.activeNews.push(news);
 *   而 `news` 来自 `getRandomNewsByLevel()` / `getRandomNewsEvent()`，
 *   两者内部都是 `Random.fromArray(candidates)` —— 返回的是 **NEWS_L1_L4 池里的引用**。
 *   于是：
 *     ① `state.activeNews` 里存的是**池对象本身**，池被永久污染；
 *     ② 同一进程里开第二局时，池对象的 `_appliedDay` 还留着上一局的天数；
 *     ③ 残留值会让 news_event_bridge / investment 的到期判定
 *        （`state.player.day - _appliedDay > duration`）读到旧天数
 *        → 新闻效果被误判「已过期」而**静默失效**；
 *     ④ 同一条新闻跨天再次被抽中时，旧 activeNews 条目的 `_appliedDay`
 *        会被就地改写 → 旧条目「续命」，到期语义错乱。
 *
 *   这与第十二节修过的 `_conduitChecked` 是**同一类问题**（当时只修了后者）。
 *   注意：夹具侧 `headless_runner.resetSharedState()` 会擦除残留，
 *   所以这个 bug 在 MC 里被**掩盖**了 —— 单局行为正常，跨局才暴露。
 *   本测试因此**不调用** resetSharedState 作为"证据"，而是用它当**检测器**。
 *
 * 修法：push 一份浅拷贝，`_appliedDay` 写在副本上
 *   （与 news.js:2121 intelNewsEntry、news_system.js:29510 的既有写法一致）。
 *
 * 运行：node tests/newsPoolPurity.test.cjs
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const runner = require("./headless_runner.cjs");

let pass = 0;
let fail = 0;
const fails = [];
function check(actual, expected, name) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) pass++;
  else {
    fail++;
    fails.push(`${name}\n  expected: ${e}\n  actual:   ${a}`);
  }
}
function ok(cond, name) {
  check(!!cond, true, name);
}

const ROOT = path.resolve(__dirname, "..");
const EVENTS_CORE = path.join(ROOT, "src/js/core/events_core.js");

// ---- 源码守卫：_rollOneDailyNews 不得把 _appliedDay 写在池对象上 ----
// 剥注释，避免被解释性注释里的代码片段误伤
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}
const src = stripComments(fs.readFileSync(EVENTS_CORE, "utf8"));

// 定位 _rollOneDailyNews 函数体（到下一个顶层 function 声明为止）
const fnStart = src.indexOf("function _rollOneDailyNews(");
ok(fnStart >= 0, "源码守卫: 能找到 _rollOneDailyNews");
const rest = src.slice(fnStart);
const nextFn = rest.indexOf("\nfunction ", 1);
const fnBody = nextFn > 0 ? rest.slice(0, nextFn) : rest;

ok(
  !/\bnews\._appliedDay\s*=/.test(fnBody),
  "源码守卫: _rollOneDailyNews 内不得有 `news._appliedDay =`（池对象就地写入）",
);
ok(
  /Object\.assign\(\{\},\s*news\)/.test(fnBody),
  "源码守卫: 应通过 Object.assign({}, news) 生成副本",
);
ok(
  /appliedNews\._appliedDay\s*=/.test(fnBody),
  "源码守卫: _appliedDay 应写在副本 appliedNews 上",
);
ok(
  /state\.activeNews\.push\(appliedNews\)/.test(fnBody),
  "源码守卫: state.activeNews 应 push 副本而非池引用",
);

// ---- 行为守卫：跑一段真实对局，池必须保持纯净 ----
const okInit = runner.init({ strict: false });
ok(okInit, "行为守卫: headless_runner.init 成功");

const state = runner.createState({ seed: 42, scenario: "classic" });
ok(!!state, "行为守卫: createState 成功");
if (typeof Random !== "undefined" && Random.setSeed) Random.setSeed(42);

const DAYS = 40;
for (let d = 1; d <= DAYS; d++) {
  state.player.day = d;
  try {
    runDailyPipeline(state);
  } catch (_) {
    /* 单日异常不影响池纯度结论 */
  }
}

// 前提：新闻链路确实被走到过（否则"残留=0"是空断言）
ok(
  state.activeNews && state.activeNews.length > 0,
  `行为守卫: ${DAYS} 天内至少抽到 1 条新闻（activeNews 非空）`,
);
ok(
  state.activeNews &&
    state.activeNews[0] &&
    typeof state.activeNews[0]._appliedDay === "number",
  "行为守卫: activeNews 条目自身带有 _appliedDay（消费端依赖它）",
);

// 池残留计数（resetSharedState 在此充当检测器，返回被擦除的字段数）
const residue = runner.resetSharedState();
check(residue.newsFields, 0, "行为守卫: 共享新闻池 _appliedDay/_conduitChecked 残留数 = 0");

// ---- 反向对照：证明检测器不是恒真（否则上一条断言没有意义）----
// 手动往池里注入一个 _appliedDay，检测器必须能发现
const injected = vm.runInThisContext(
  "(function(){if(typeof NEWS_L1_L4==='undefined'||!NEWS_L1_L4.length)return 0;" +
    "NEWS_L1_L4[0]._appliedDay=99;return 1;})()",
);
ok(injected === 1, "反向对照: 成功向池注入 _appliedDay（池确实可被污染）");
const residue2 = runner.resetSharedState();
check(residue2.newsFields, 1, "反向对照: 注入后检测器报告残留数 = 1（检测器有效）");

// 清掉注入痕迹
runner.resetSharedState();

// ---- 汇总 ----
console.log(
  `newsPoolPurity: ${pass} passed, ${fail} failed ` +
    `(源码守卫4 + 行为守卫4 + 反向对照2)`,
);
if (fail > 0) {
  console.log("\n失败用例:\n" + fails.slice(0, 20).join("\n"));
  process.exit(1);
}
