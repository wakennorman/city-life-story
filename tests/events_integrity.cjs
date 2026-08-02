/**
 * events_integrity.cjs — 事件系统静态完整性断言（P0-4）
 *
 * 纯静态、秒级、无模拟。加载全部游戏脚本后，对 RANDOM_EVENTS 等事件池做
 * 结构不变式检查，专治「语法正确却永不触发 / 永不施效」的死代码：
 *   - 事件缺 phase 且非链事件且无 triggers → queueRandomEvent 永远选不到
 *   - choice 无 apply/effect → 玩家选了什么都不发生
 *   - TriggerRegistry 读错字段导致某槽 0 注册 → 静默失效数年
 *
 * 退出码：全绿 0；有硬失败（不变式违反）非 0。存量红项视为「揪出存量 bug」，
 * 严禁为过测放宽不变式——真发现历史死事件应单列 P1 修复项。
 */

const runner = require("./headless_runner.cjs");

var failures = [];
var warnings = [];
function fail(msg) {
  failures.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

// ── 引导：加载全部脚本 ────────────────────────────────────────────
runner.init({ strict: false });

var loadErrors = runner.getLoadErrors();
if (loadErrors.length > 0) {
  for (var i = 0; i < loadErrors.length; i++) {
    fail("脚本加载错误: " + loadErrors[i].file + " — " + loadErrors[i].error);
  }
}

// ── 事件池（top-level const，通过 globalThis 取用） ────────────────
var RE = typeof RANDOM_EVENTS !== "undefined" ? RANDOM_EVENTS : globalThis.RANDOM_EVENTS;
if (!Array.isArray(RE)) {
  fail("RANDOM_EVENTS 未定义或非数组——游戏未正确加载");
  report();
}

var VALID_PHASES = { street: true, corporate: true };

// ── 断言 1：事件 id 全局唯一 ──────────────────────────────────────
(function checkUniqueIds() {
  var seen = {};
  for (var i = 0; i < RE.length; i++) {
    var e = RE[i];
    if (!e || !e.id) {
      fail("RANDOM_EVENTS[" + i + "] 缺少 id");
      continue;
    }
    if (seen[e.id]) {
      fail("事件 id 重复: '" + e.id + "'（索引 " + seen[e.id].idx + " 与 " + i + "）");
    } else {
      seen[e.id] = { idx: i };
    }
  }
})();

// ── 断言 2：可达性不变式 ──────────────────────────────────────────
// 每个事件必须满足以下三者之一，否则是「死事件」（永不被任何路径选中）：
//   a) phase ∈ {street, corporate}         → queueRandomEvent 常规池
//   b) _isChainEvent === true              → 由 triggerChainEvent 主动调度
//   c) Array.isArray(triggers)             → 走 TriggerRegistry 槽
(function checkReachability() {
  for (var i = 0; i < RE.length; i++) {
    var e = RE[i];
    if (!e || !e.id) continue;
    var reachable =
      VALID_PHASES[e.phase] === true ||
      e._isChainEvent === true ||
      Array.isArray(e.triggers);
    if (!reachable) {
      fail(
        "死事件（不可达）: '" +
          e.id +
          "' — phase=" +
          JSON.stringify(e.phase) +
          " 不在 {street,corporate}，且非 _isChainEvent，且无 triggers 数组",
      );
    }
  }
})();

// ── 断言 3：可施效不变式 ──────────────────────────────────────────
// 事件本体或其某个 choice 至少要有一个施效字段，否则玩家操作后无任何效果。
(function checkApplicability() {
  function hasEffect(obj) {
    if (!obj || typeof obj !== "object") return false;
    return (
      typeof obj.apply === "function" ||
      typeof obj.immediate === "function" ||
      typeof obj.effect === "function" ||
      typeof obj.effects === "object" ||
      typeof obj.flags === "object" ||
      typeof obj.outcome === "function"
    );
  }
  for (var i = 0; i < RE.length; i++) {
    var e = RE[i];
    if (!e || !e.id) continue;
    var choices = Array.isArray(e.choices) ? e.choices : [];
    var eventEffect = hasEffect(e);
    var anyChoiceEffect = false;
    for (var c = 0; c < choices.length; c++) {
      if (hasEffect(choices[c])) {
        anyChoiceEffect = true;
        break;
      }
    }
    // 纯叙事事件（无 choices）允许仅靠事件级 apply；有 choices 则要求至少一个可施效
    if (choices.length === 0 && !eventEffect) {
      warn("事件 '" + e.id + "' 无 choices 且无事件级施效字段（可能是纯展示，请人工确认）");
    } else if (choices.length > 0 && !anyChoiceEffect && !eventEffect) {
      fail("事件 '" + e.id + "' 的所有 choice 均无 apply/effect/flags——玩家选择后无任何效果");
    }
  }
})();

// ── 断言 4：类型正确性（conditions/trigger 若存在须为函数/对象） ──
(function checkTypes() {
  for (var i = 0; i < RE.length; i++) {
    var e = RE[i];
    if (!e || !e.id) continue;
    if (
      e.conditions !== undefined &&
      typeof e.conditions !== "function" &&
      typeof e.conditions !== "object"
    ) {
      fail("事件 '" + e.id + "' 的 conditions 类型非法: " + typeof e.conditions);
    }
    if (e.trigger !== undefined && typeof e.trigger !== "function") {
      fail("事件 '" + e.id + "' 的 trigger 类型非法: " + typeof e.trigger);
    }
    if (
      e.triggers !== undefined &&
      !Array.isArray(e.triggers) &&
      (typeof e.triggers !== "object" || e.triggers === null)
    ) {
      fail("事件 '" + e.id + "' 的 triggers 类型非法（须为数组=TriggerRegistry槽 或 对象=evaluateTriggers条件）: " + typeof e.triggers);
    }
  }
})();

// ── 断言 5：TriggerRegistry 活跃槽注册数 > 0 ──────────────────────
// 检出「读错字段导致某槽 0 注册」的静默失效。注意 loadAll 读 window.RANDOM_EVENTS，
// 无头环境下 window 可能不指向真实全局——先桥接再断言，避免误报。
(function checkTriggerRegistry() {
  var TR = typeof TriggerRegistry !== "undefined" ? TriggerRegistry : globalThis.TriggerRegistry;
  if (!TR || typeof TR.loadAll !== "function") {
    warn("TriggerRegistry 不可用，跳过槽注册检查");
    return;
  }
  // 桥接：确保 loadAll 能看到事件池（复现浏览器语义前提下的健壮性）
  if (typeof window !== "undefined" && !window.RANDOM_EVENTS && Array.isArray(RE)) {
    window.RANDOM_EVENTS = RE;
  }
  try {
    TR.loadAll();
  } catch (e) {
    fail("TriggerRegistry.loadAll() 抛异常: " + e.message);
    return;
  }
  // 统计有 triggers 数组的事件数——若 >0 但注册总数为 0，说明注册链断裂
  var withTriggers = RE.filter(function (e) {
    return e && Array.isArray(e.triggers) && e.triggers.length > 0;
  }).length;
  if (withTriggers > 0 && typeof TR.getEventsForSlot === "function") {
    var SLOTS = [
      "daily_start",
      "after_work",
      "after_travel",
      "after_trade",
      "after_heal",
      "daily_mid",
      "daily_end",
      "monthly",
      "weekly",
      "career_promo",
      "corp_startup",
      "random_encounter",
    ];
    var totalRegistered = 0;
    for (var s = 0; s < SLOTS.length; s++) {
      var arr = TR.getEventsForSlot(SLOTS[s]);
      totalRegistered += arr ? arr.length : 0;
    }
    if (totalRegistered === 0) {
      fail(
        "TriggerRegistry 注册链断裂: 有 " +
          withTriggers +
          " 个事件带 triggers 数组，但全部槽注册总数为 0（疑似 loadAll 读错字段/window 未桥接）",
      );
    } else {
      console.log(
        "  ℹ️ TriggerRegistry: " +
          withTriggers +
          " 个约定式事件，槽注册总数 " +
          totalRegistered,
      );
    }
  }
})();

report();

// ── 结论输出 ──────────────────────────────────────────────────────
function report() {
  console.log("\n🧪 事件完整性断言\n");
  console.log("   事件池规模: " + (Array.isArray(RE) ? RE.length : "N/A"));
  if (warnings.length > 0) {
    console.log("\n⚠️  警告（不阻塞）:");
    for (var w = 0; w < warnings.length; w++) {
      console.log("   - " + warnings[w]);
    }
  }
  if (failures.length > 0) {
    console.error("\n❌ 硬失败（" + failures.length + " 项）:");
    for (var f = 0; f < failures.length; f++) {
      console.error("   ✗ " + failures[f]);
    }
    console.error("\n事件完整性检查未通过。存量红项 = 揪出存量死事件，请单列 P1 修复，勿放宽不变式。\n");
    process.exit(1);
  } else {
    console.log("\n✅ 事件完整性全部通过。\n");
    process.exit(0);
  }
}
