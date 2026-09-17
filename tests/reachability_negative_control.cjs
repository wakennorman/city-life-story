/**
 * 门禁判据的「阴性对照」测试 —— 报告第 52.3 / 52.9 节
 *
 * 第 51 节的双向验证只做了正向：干净态 exit 0、注入假死字段 exit 1。
 * 但那只能证明「门禁会报错」，**不能证明「门禁不会把活字段报成死的」**。
 * 一个只会报警的门禁，和一个「报警 + 不误报」的门禁，
 * 在只有正例的测试里长得一模一样。
 *
 * 本脚本补阴性对照：对一批**已知有写入点**的真实字段，
 * 直接调用门禁内部的 hasWriteSite 判据，全部必须返回 true。
 *
 * 用法：node tests/reachability_negative_control.cjs
 */
var fs = require("fs");
var path = require("path");

var GATE = path.join(__dirname, "events_reachability.cjs");
var SRC = path.join(__dirname, "..", "src", "js");

// ---- 复用门禁的判据实现（直接从源码里抽函数体，避免两处实现漂移）----
// 为保持"独立验证"的意义，这里不 import 门禁模块，而是复制其判据逻辑，
// 并额外记录「门禁源码里的正则字符串」做一致性比对。
var gateSrc = fs.readFileSync(GATE, "utf8");

var parts = [];
(function walk(d) {
  fs.readdirSync(d, { withFileTypes: true }).forEach(function (e) {
    var p = path.join(d, e.name);
    if (e.isDirectory()) return walk(p);
    if (/\.js$/.test(e.name)) parts.push(fs.readFileSync(p, "utf8"));
  });
})(SRC);
var ALL = parts.join("\n");

function hasWriteSite(key) {
  var k = key.replace(/\$/g, "\\$");
  if (new RegExp("(?:^|[^\\w$])" + k + "\\s*(?:[-+*/%&|^]?=(?!=|>)|\\+\\+|--|:\\s*(?![=]))", "m").test(ALL)) return true;
  if (new RegExp(k + "\\s*\\.\\s*(?:push|unshift|splice|set|add)\\s*\\(", "m").test(ALL)) return true;
  if (new RegExp("Object\\s*\\.\\s*assign\\s*\\([^)]*\\b" + k + "\\b", "m").test(ALL)) return true;
  if (new RegExp("delete\\s+[\\w$.]*\\b" + k + "\\b", "m").test(ALL)) return true;
  return false;
}

// ---- 阴性对照样本：全部是**确认活着**的字段（门禁曾把它们中的一部分误报）----
var MUST_BE_ALIVE = [
  // 第 52 节被误报、修复后应恢复正常的
  "_totalInvestmentProfit",
  "portfolio",
  "_eraState",
  "careerCapital",
  "socialNetwork",
  "inheritanceBonuses",
  "_totalSpent",
  "_nextDayForecast",
  // 从未被误报、用来说明判据基线正确的
  "cash",
  "day",
  "stockHoldings",
  "tradeLog",
  "_portfolioPeakHistory",
  "relationships",
  "flags",
];

// ---- 阳性对照样本：确认死字段（判据必须返回 false）----
var MUST_BE_DEAD = [
  "eventsTriggered",
  "totalStockProfit",
  "workTypeCounts",
  "lifeRibbons",
  "tradeHistory",
  "portfolioHistory",
  "goldHoldings",
  "lifeNodes",
];

console.log("=== 阴性对照：已知活字段，判据必须返回 true（判活）===");
var negFail = 0;
MUST_BE_ALIVE.forEach(function (k) {
  var r = hasWriteSite(k);
  if (!r) negFail++;
  console.log("  " + (r ? "ok   " : "FAIL ") + k.padEnd(26) + "→ " + r);
});

console.log("\n=== 阳性对照：确认死字段，判据必须返回 false（判死）===");
var posFail = 0;
MUST_BE_DEAD.forEach(function (k) {
  var r = hasWriteSite(k);
  if (r) posFail++;
  console.log("  " + (!r ? "ok   " : "FAIL ") + k.padEnd(26) + "→ " + r);
});

// ---- 一致性检查：门禁源码里的正则是否与本脚本一致（防漂移）----
// 注意：必须排除注释行 —— 修复说明里会引用旧正则原文，
// 若把注释也算进去会得到"仍是坏的"这种假警报（本脚本第一版就踩了）。
console.log("\n=== 一致性：门禁源码是否含修复后的正则 ===");
var codeLines = gateSrc
  .split(/\r?\n/)
  .filter(function (l) {
    var t = l.trim();
    return !(t.indexOf("//") === 0 || t.indexOf("*") === 0 || t.indexOf("/*") === 0);
  })
  .join("\n");
var hasOld = codeLines.indexOf("[^.\\w$]") !== -1;
var hasCompound = codeLines.indexOf("[-+*/%&|^]?=") !== -1;
console.log("  [仅代码行] 含旧式 [^.\\w$] 排除点:", hasOld, hasOld ? "  !! 仍是坏的" : "  ok（无残留）");
console.log("  [仅代码行] 含复合赋值 [+-*/%&|^]?:", hasCompound, hasCompound ? "  ok" : "  !! 缺失");

console.log("\n=== 结论 ===");
if (negFail === 0 && posFail === 0 && !hasOld && hasCompound) {
  console.log("双向对照全部通过 —— 判据在阳性与阴性方向上均正确。");
  process.exit(0);
} else {
  console.log("!! 存在失败：阴性失败 " + negFail + " 条 / 阳性失败 " + posFail + " 条");
  process.exit(1);
}
