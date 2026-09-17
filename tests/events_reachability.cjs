/**
 * events_reachability.cjs — 事件 conditions「引用了不存在字段」断言
 *
 * 【为什么需要这个门禁】
 * tests/events_integrity.cjs 的断言 2（可达性）只检查**结构性**可达：
 *   phase ∈ {street,corporate} || _isChainEvent || Array.isArray(triggers)
 * 它不检查 conditions() 读的字段**在 state 里是否存在**。
 *
 * 于是产生一整类盲区：事件的 phase 结构合法、能进池子、语法全对，
 * 但它的 conditions() 读了一个 state 里**根本不存在的路径** ——
 * 该路径恒 undefined → 条件恒 false → 运行时永不触发。
 * 而所有静态检查（语法 / 结构 / 门禁）全部通过。
 *
 * [真实案例 · 2026-09-17 · 报告第 50 节]
 *   - `st.player.workTypeCounts`（7 个事件的 conditions）—— schema 中无此键
 *   - `state.career.currentJob`（副业系统的"主业冲突惩罚"）—— schema 中是
 *     `state.employment.currentJob`，`state.career` 整块不存在
 *   npm test 当时全绿。
 *
 * 【判据：三层，全部确定性，不要用启发式】
 *
 * 初版曾用「基线态 0 通过」+「正则扫写入点」做聚类 → 37 条误报，
 * 两个原因（都是审计者自己的口径问题）：
 *   ① 「基线态不通过」是**正常现象**（初始状态 charm=20、无证书、未结识 NPC），
 *      不是缺陷 —— 实测 89.8% 的事件在基线态恒 false。
 *   ② 「正则扫写入点」漏判：写入有四种形态（`=` 赋值 / `.push()` /
 *      `Object.assign` / 嵌套字面量），只认赋值会漏掉 `.push()` 类
 *      （`certificates` 因此被误报）。
 *   → 教训：不要用「我的正则匹配不到」冒充「没有写入点」（skill 陷阱 21）。
 *
 * 现在改用**真实 schema** 做判据（用游戏自己的 createDefaultState 递归取键）：
 *
 *   第 1 层（硬失败）：conditions 读取的路径在真实 schema 中不存在。
 *                      —— `st.player.workTypeCounts` 属此类。确定性判据。
 *   第 2 层（硬失败）：conditions 求值抛错。说明读了非法路径并解引用。
 *   第 3 层（信息）  ：路径存在但基线态全族 0 通过。
 *                      —— 单独列出供人工复核（可能是正常设计）。
 *
 * 退出码：0 全绿；1 有硬失败。
 */

const runner = require("./headless_runner.cjs");
const fs = require("fs");
const path = require("path");
// [报告第 58 节] 与 reachability_same_name_crosstalk.cjs 共用同一份剥注释实现
//   （纪律 7：单一事实来源 —— 修一处、两处同时生效，避免判据漂移）。
const { stripComments, extractReadPaths } = require("./lib/path_aware_write.cjs");
const SRC_ROOT = path.join(__dirname, "..", "src", "js");
var srcCache = null;

var failures = [];
var warnings = [];
function fail(msg) { failures.push(msg); }
function warn(msg) { warnings.push(msg); }

// 忽略清单：非 state 键的合法后缀（属性/方法名，不是字段）
const IGNORED_LAST_SEG = {
  length: true, push: true, pop: true, shift: true, unshift: true,
  splice: true, slice: true, concat: true, join: true, map: true,
  filter: true, reduce: true, forEach: true, includes: true, indexOf: true,
  hasOwnProperty: true, toString: true, valueOf: true, keys: true,
  values: true, entries: true, sort: true, reverse: true, find: true,
  some: true, every: true, trim: true, split: true, replace: true,
  toFixed: true, toUpperCase: true, toLowerCase: true, toString: true,
};

// 忽略清单：动态字典（schema 里是空对象，运行时按 id 挂载子键）。
// 格式：`<父路径>.` —— 命中即视为合法。
// 每项必须写明理由，禁止为过测而添加。
const KNOWN_DYNAMIC_DICT = {
  "state.relationships.": "relationships 是按 NPC id 动态挂载的字典",
  "state.flags.": "flags 是按语义动态挂载的标记字典",
};

// 忽略清单（第 ④ 层）：经审计确认属于**历史遗留死路径**，
// 已知存在但不在本轮修复范围。每项必须写明理由与登记日期。
//
// ⚠️ 纪律：这是一份**债务清单**，不是免死金牌。
// 新增条目必须同时：① 说明为何本轮不修 ② 在报告中登记编号。
// 禁止为了"让门禁变绿"而添加条目。
const KNOWN_ABSENT_OK = {
  // { 路径: "理由 [登记: 报告第 N 节]" }
};

const VALID_PHASES = { street: true, corporate: true };

// ── 引导 ──────────────────────────────────────────────────────────
runner.init({ strict: false });

var loadErrors = runner.getLoadErrors();
if (loadErrors.length > 0) {
  for (var i = 0; i < loadErrors.length; i++) {
    fail("脚本加载错误: " + loadErrors[i].file + " — " + loadErrors[i].error);
  }
}

var RE = typeof RANDOM_EVENTS !== "undefined" ? RANDOM_EVENTS : globalThis.RANDOM_EVENTS;
if (!Array.isArray(RE)) {
  fail("RANDOM_EVENTS 未定义或非数组——游戏未正确加载");
  report();
}

// ── 第 0 步：取真实 schema ────────────────────────────────────────
var baseline = runner.createState({ seed: 42 });
if (!baseline) {
  fail("无法创建基线 state（createState 返回 null）");
  report();
}

// 递归收集所有键路径（不展开数组元素）
var schemaKeys = {};
(function collect(o, prefix) {
  if (!o || typeof o !== "object") return;
  var ks = Object.keys(o);
  for (var i = 0; i < ks.length; i++) {
    var k = ks[i];
    var p = prefix ? prefix + "." + k : k;
    schemaKeys[p] = true;
    var v = o[k];
    if (v && typeof v === "object" && !Array.isArray(v)) collect(v, p);
  }
})(baseline, "state");

var schemaCount = Object.keys(schemaKeys).length;
console.log("[reachability] 真实 schema 键数 = " + schemaCount);

// 逐级校验：`state.a.b.c` 是否在 schema 中（前缀不存在即报）
//
// [仪器 bug 修复 · 2026-09-17] 初版漏掉根节点 `state` 自身，
// 导致 pathExists("state.flags") 在第一轮查 schemaKeys["state"] 时失败，
// 把 state.player / state.flags / state.status 全报成"不存在"（3832 条误报）。
// 修复：把根 `state` 也记入 schemaKeys。
schemaKeys["state"] = true;

function pathExists(pathStr) {
  // 动态字典：父路径命中忽略项即视为存在
  for (var dk in KNOWN_DYNAMIC_DICT) {
    if (pathStr.indexOf(dk) === 0 || pathStr === dk.replace(/\.$/, "")) return true;
  }
  var segs = pathStr.split(".");
  var cur = "";
  for (var i = 0; i < segs.length; i++) {
    cur = cur ? cur + "." + segs[i] : segs[i];
    if (!schemaKeys[cur]) return false;
  }
  return true;
}

// ── 断言 1：conditions 不得读取「schema 中不存在且无任何运行时写入点」的路径 ──
//
// 【判据必须三条件，缺一不可 —— 这是踩了四次坑才定下来的】
//
// 坑 ①（初版）：只用「基线态 0 通过」→ 37 条误报。
//   原因：基线 state 是**初始状态**（charm=20、无证书、未结识 NPC），
//   大多数事件本就该不满足。「基线态不通过」是正常现象，实测占 89.8%。
//
// 坑 ②（二版）：加「正则扫写入点」，但正则只认 `key = value` 赋值
//   → `certificates`（用 `.push()`）被误报。
//   写入有四种形态：`=` 赋值 / `.push()`·`.splice()` / `Object.assign` / 嵌套字面量。
//
// 坑 ③（三版）：schema 收集漏了根节点 `state` 本身
//   → `state.player` / `state.flags` / `state.status` 全被报成"不存在"（3832 条）。
//
// 坑 ④（四版）：只判断**叶子键**，未判断**父路径是否在 schema 中**
//   → `state.investment.portfolio` 被误报。
//   原因：`investment` 整块不在 state.js 里，是另一模块用
//   `if (!st.investment) st.investment = {...}` 懒初始化的。
//   此时叶子键在不在 schema 里**根本不重要** —— 父容器本身就是运行时建的。
//
// 【最终判据：三条件全部成立才报】
//   ① 父路径在真实 schema 中存在（排除懒初始化子树）
//   ② 叶子键不在真实 schema 中
//   ③ 全库无任何形态的写入点
//
// 反例对照表：
//   | 路径 | ①父路径在 | ②叶子在 | ③有写入 | 判定 |
//   |---|---|---|---|---|
//   | state.player.day | ✓ | ✓ | — | 活 |
//   | state.career ... | ✗ | ✗ | ✓(懒初始化) | 活（06 节曾误判） |
//   | state.investment.* | ✗ | ✗ | ✓(懒初始化) | 活 |
//   | state.employment.currentJob | ✓ | ✓ | **✗ 无写入** | **死（129 处读取）** |
//   | state.player.workTypeCounts | ✓ | **✗** | ✗ | **死（7 处读取）** |
//   | state.stats.actionFreq.exercise | ✓ | ✗ | — | 动态字典，白名单 |
function loadSrcText() {
  if (srcCache !== null) return srcCache;
  var parts = [];
  (function walk(dir) {
    var ents;
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    for (var i = 0; i < ents.length; i++) {
      var ent = ents[i];
      var p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.name.endsWith(".js")) {
        try { parts.push(fs.readFileSync(p, "utf8")); } catch (e) {}
      }
    }
  })(SRC_ROOT);
  srcCache = parts.join("\n");
  return srcCache;
}

// 查某路径是否有写入点（覆盖四种形态）
//
// 【坑⑤ · 2026-09-17 · 报告第 52 节】字符类里排除 `.` = 排除全部真实写入
//   初版形态 1 用 `(?:^|[^.\w$])` 作前导边界，本意是"跳过 obj.x 这种属性访问"。
//   但**真实写入恰恰就是属性访问形态**：`inv._totalInvestmentProfit = ...`
//   字段前一个字符就是 `.` → 全部真实写入被前导边界挡掉。
//   → 把有写入的活字段（_totalInvestmentProfit / portfolio 等）系统性判成死字段。
//   修复：字符类去掉 `.`，改为 `(?:^|[^\w$])`；并补上复合赋值 `+= -= *=` 与 `++/--`。
//   定稿正则经 19 条正反例验证（见 .tmp-probe/write-site-fix2.cjs 思路）：
//     ✓ 排除 `=== == => >= <=`、纯读取、函数调用
//     ✓ 命中 `x = 1` / `o.x = 1` / `o.x += 1` / `o.x++` / `{ x: 0 }`
//     ~ 已知残留：`||=` 漏判（偏保守，判为死）、`x: () => 1` 误判（偏保守，判为活）
//   两个残留方向都朝「判为活」倾斜 —— 门禁宁可漏报不可误报，符合预期姿态。
function hasWriteSite(pathStr) {
  var text = loadSrcText();
  var segs = pathStr.split(".");
  if (segs[0] === "state") segs = segs.slice(1);
  if (segs.length === 0) return true;
  var key = segs[segs.length - 1];
  if (!key || !/^[A-Za-z_$][\w$]*$/.test(key)) return true; // 非法键名不判
  var k = key.replace(/\$/g, "\\$");

  // 形态 1：赋值 / 复合赋值 / 自增自减 / 对象字面量 key
  //   `[-+*/%&|^]?=` 覆盖 = += -= *= /= %= &= |= ^=；
  //   `(?!=|>)` 排除 == === =>；`:\s*(?![=])` 排除 `x: () =>`（但允许 `{x: 0}`）
  if (new RegExp("(?:^|[^\\w$])" + k + "\\s*(?:[-+*/%&|^]?=(?!=|>)|\\+\\+|--|:\\s*(?![=]))", "m").test(text)) return true;
  // 形态 2：数组/集合方法
  if (new RegExp(k + "\\s*\\.\\s*(?:push|unshift|splice|set|add)\\s*\\(", "m").test(text)) return true;
  // 形态 3：Object.assign
  if (new RegExp("Object\\s*\\.\\s*assign\\s*\\([^)]*\\b" + k + "\\b", "m").test(text)) return true;
  // 形态 4：delete
  if (new RegExp("delete\\s+[\\w$.]*\\b" + k + "\\b", "m").test(text)) return true;
  return false;
}

// 查某路径是否"整块被懒初始化"（父容器不在 schema 中）
function parentIsLazy(pathStr) {
  var segs = pathStr.split(".");
  if (segs.length < 2) return false;               // 顶层路径不适用
  var parent = segs.slice(0, segs.length - 1).join(".");
  if (parent === "state") return false;            // state 自身是根
  // 父路径不在 schema 中 → 整块是运行时建的
  return !schemaKeys[parent];
}
// 只检查**条件判断**用的路径，即 `st.x.y` / `state.x.y` 形式。
// 允许带下标动态访问（st.relationships[id]）——那属于动态键，跳过。
//
// [报告第 58 节] `extractReadPaths` 已收进 `tests/lib/path_aware_write.cjs`。
//   原先是本文件与 `reachability_same_name_crosstalk.cjs` 各持一份逐字相同的
//   实现（一份 var、一份 const）—— 两份会漂移的清单。
//   调用方**必须**自己配 `stripComments`（见下方调用处注释）。

var absentRefs = {}; // path -> [eventId]
(function checkSchemaRefs() {
  for (var i = 0; i < RE.length; i++) {
    var e = RE[i];
    if (!e || typeof e.conditions !== "function") continue;
    if (!VALID_PHASES[e.phase]) continue;

    // [报告第 58 节] 必须先剥注释 —— `toString()` 原样保留函数体内注释，
    //   注释里引用的「旧字段名」会被当成真实读取点 → 虚增死路径清单。
    var paths = extractReadPaths(stripComments(e.conditions.toString()));
    for (var j = 0; j < paths.length; j++) {
      var p = paths[j];
      var lastSeg = p.substring(p.lastIndexOf(".") + 1);
      if (IGNORED_LAST_SEG[lastSeg]) continue;   // .length / .push 等，非 state 键
      if (pathExists(p)) continue;               // ① 完整路径在 schema 中 → 活
      if (parentIsLazy(p)) continue;             // ② 父容器懒初始化 → 整块运行时建，跳过
      if (hasWriteSite(p)) continue;             // ③ 有写入点 → 活（懒初始化/动态字典）
      if (KNOWN_ABSENT_OK[p]) continue;          // ④ 经审计确认的历史遗留（见清单）
      if (!absentRefs[p]) absentRefs[p] = [];    // 三条件全中 → 真死
      absentRefs[p].push(e.id);
    }
  }
})();

var absentPaths = Object.keys(absentRefs);
absentPaths.sort(function (a, b) {
  return absentRefs[b].length - absentRefs[a].length;
});

console.log(
  "[reachability] 命中「schema 无此键 && 全库无写入点」的路径 " +
    absentPaths.length + " 个",
);

// （基线比对在 report() 中进行，见文件末尾）

// ── 断言 2：conditions 求值不得抛错 ───────────────────────────────
(function checkConditionsNoThrow() {
  var threw = [];
  for (var i = 0; i < RE.length; i++) {
    var e = RE[i];
    if (!e || typeof e.conditions !== "function") continue;
    if (!VALID_PHASES[e.phase]) continue;
    try {
      e.conditions(baseline);
    } catch (err) {
      threw.push({ id: e.id, msg: err && err.message ? err.message : String(err) });
    }
  }
  for (var j = 0; j < Math.min(threw.length, 10); j++) {
    fail("conditions 求值抛错: '" + threw[j].id + "' — " + threw[j].msg);
  }
  if (threw.length > 10) {
    warn("另有 " + (threw.length - 10) + " 个事件的 conditions 抛错未逐条列出");
  }
})();

// ── 断言 3（信息）：基线态通过率 ──────────────────────────────────
// 只做信息输出。高恒 false 比例是正常现象（初始状态）。
var stat = { total: 0, pass: 0 };
for (var s = 0; s < RE.length; s++) {
  var ev = RE[s];
  if (!ev || typeof ev.conditions !== "function") continue;
  if (!VALID_PHASES[ev.phase]) continue;
  stat.total++;
  try { if (ev.conditions(baseline)) stat.pass++; } catch (err) {}
}
console.log(
  "[reachability] 基线态 conditions 通过 " + stat.pass + " / " + stat.total +
    "（恒 false " + (stat.total - stat.pass) + "）",
);

// ── 报告 ──────────────────────────────────────────────────────────
//
// 【存量基线机制】
// 本门禁初次引入时，存量死路径有 47 条（覆盖 300+ 事件）。
// 若直接接进 npm test，会让整个门禁链立即变红，无法区分
// 「本次改动引入的新缺陷」与「历史遗留」。
//
// 所以引入基线快照 tests/reachability_baseline.json：
//   - 基线内的路径  → 只作为「存量」提示，不失败
//   - 基线外的路径  → **硬失败**（这是防复发的核心）
//   - 基线内的路径已修复（不再出现）→ 提示可从基线移除，不失败
//
// 这样做的效果：**存量债务透明可见，但新增债务立即拦截。**
// 修好一条就从基线删一条，基线只减不增。
//
// 用法：
//   node tests/events_reachability.cjs                 常规检查
//   node tests/events_reachability.cjs --print-all     打印全部死路径
//   node tests/events_reachability.cjs --dump-baseline 输出基线 JSON
var ARGV = process.argv.slice(2);
var PRINT_ALL = ARGV.indexOf("--print-all") !== -1;
var DUMP_BASELINE = ARGV.indexOf("--dump-baseline") !== -1;

var BASELINE_PATH = path.join(__dirname, "reachability_baseline.json");
var baselineData = { paths: {} };
try {
  baselineData = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
} catch (e) {
  baselineData = { paths: {} };
}
if (!baselineData.paths) baselineData.paths = {};

if (DUMP_BASELINE) {
  var dump = {
    _comment:
      "事件 conditions 死路径基线快照（报告第 51 节）。每条为「schema 无此键 && 全库无写入点」的确认死路径。修复后请从此移除，本文件只减不增。",
    _generatedAt: "2026-09-17",
    paths: {},
  };
  for (var d = 0; d < absentPaths.length; d++) dump.paths[absentPaths[d]] = 1;
  // 注意：JSON 走 stderr，因为 stdout 混有游戏引擎的加载日志。
  process.stderr.write(JSON.stringify(dump, null, 2) + "\n");
  process.exit(0);
}

var regressions = [];   // 基线外的新死路径 → 硬失败
var known = [];         // 基线内 → 提示
for (var a2 = 0; a2 < absentPaths.length; a2++) {
  var pp = absentPaths[a2];
  if (Object.prototype.hasOwnProperty.call(baselineData.paths, pp)) known.push(pp);
  else regressions.push(pp);
}

// 基线中「本次未再命中」的条目。
//
// 【措辞坑 · 2026-09-17 · 报告第 52.5 节】
//   初版把这类条目叫「已修复」并打印 `✓ 已修复: xxx`。这是**误导性**的：
//   "不再命中"有三种可能，其中只有第一种是真修复 —
//     ① 有人补了写入点（真修复）
//     ② 门禁判据被修正，之前的命中是假阳性（代码一行没动）
//     ③ 事件被删除/改名（路径不再被引用）
//   第 52 节实测：一次性消掉 23 条，**全部属于②**。
//   继续叫「已修复」会把"我的尺子修好了"写进历史，让后人误以为问题已解决。
//   → 改叫「不再命中」，并要求人工确认属于哪一种。
var noLongerHit = [];
for (var bp in baselineData.paths) {
  if (absentPaths.indexOf(bp) === -1) noLongerHit.push(bp);
}

for (var r2 = 0; r2 < regressions.length; r2++) {
  var rp = regressions[r2];
  var rids = absentRefs[rp];
  fail(
    "【新增死路径】'" + rp + "'（schema 无此键且全库无写入点；被 " +
      rids.length + " 个事件引用: " + rids.slice(0, 4).join(", ") +
      (rids.length > 4 ? " 等" : "") + "）—— 该条件恒 false，事件永不触发",
  );
}

function report() {
  console.log(
    "[reachability] 死路径 " + absentPaths.length + " 条（存量 " + known.length +
      " / 新增 " + regressions.length + "）",
  );
  if (noLongerHit.length > 0) {
    console.log(
      "[reachability] 基线中已有 " + noLongerHit.length +
        " 条本次未再命中 —— 请人工确认属于哪种（勿直接当成已修复）：",
    );
    for (var fi = 0; fi < Math.min(noLongerHit.length, 10); fi++) {
      console.log("  ? 未命中: " + noLongerHit[fi] +
        "   [需确认: 补了写入点 / 判据修正 / 事件已删除]");
    }
  }
  if (PRINT_ALL) {
    console.log("\n[reachability] 全部死路径（按引用事件数降序）：");
    for (var pa = 0; pa < absentPaths.length; pa++) {
      console.log(
        "  " + absentRefs[absentPaths[pa]].length + "\t" + absentPaths[pa],
      );
    }
  }
  if (warnings.length > 0) {
    console.log("\n[reachability] 警告 " + warnings.length + " 条：");
    for (var i = 0; i < Math.min(warnings.length, 20); i++) {
      console.log("  ⚠ 「" + warnings[i] + "」");
    }
  }
  if (failures.length > 0) {
    console.log("\n[reachability] 硬失败 " + failures.length + " 条：");
    for (var j = 0; j < Math.min(failures.length, 30); j++) {
      console.log("  ✗ 「" + failures[j] + "」");
    }
    if (failures.length > 30) {
      console.log("  ... 另有 " + (failures.length - 30) + " 条");
    }
    console.log("\n[reachability] FAILED");
    process.exit(1);
  }
  console.log(
    "\n[reachability] OK — 无新增死路径（存量 " + known.length + " 条为已知债务）",
  );
  process.exit(0);
}

report();
