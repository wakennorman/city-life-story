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
//
// 两类「零效果」必须分开报，否则会把真实缺陷伪装成「待人工确认的纯展示事件」：
//   A) 原生事件（无 _converted）：确实可能是有意为之的纯展示事件 → 软警告
//   B) 转换事件（有 _converted）：载荷在转换时被丢弃 → 硬性质缺陷，必须点名根因
//
// [已修复 · 2026-09-15] 原案例：registerNewsEventsToPool() 只拷贝 id/title/story/
// phase/probability/_converted/choices/conditions，未拷贝 effects/newsEffects；
// 而消费方（原 events_core.js:925，在选项点击回调里）读取 evt.newsEffects.priceMod
// → 该分支永远不成立，46 个宏观新闻事件触发后零效果。
// 修复内容（见 docs/完善评估报告-2026-09-15.md 第十五节）：
//   ① 转换器补 `newsEffects: ne.effects`
//   ② 消费点从「选项点击回调」搬到「投递时」（queueRandomEvent 内），
//      因为新闻条目 choices 为空、根本没有按钮可点
//   ③ 新增 expireNewsPriceMods() 到期还原 + 不可叠加，避免 ×2 连乘摧毁经济
// 因此 hasEffect() 现在也必须认识 `newsEffects`，否则修复完成后
// 这个断言会一直报 46 条假警告。
(function checkApplicability() {
  function hasEffect(obj) {
    if (!obj || typeof obj !== "object") return false;
    return (
      typeof obj.apply === "function" ||
      typeof obj.immediate === "function" ||
      typeof obj.effect === "function" ||
      typeof obj.effects === "object" ||
      // [2026-09-15] 转换来的新闻条目把载荷放在 newsEffects 上（投递时施加）
      typeof obj.newsEffects === "object" ||
      typeof obj.flags === "object" ||
      typeof obj.outcome === "function"
    );
  }
  var displayOnly = [];
  var convertedGroups = {}; // _converted 来源 -> id 列表
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
    if (choices.length === 0 && !eventEffect) {
      if (e._converted) {
        var src = String(e._converted);
        if (!convertedGroups[src]) convertedGroups[src] = [];
        convertedGroups[src].push(e.id);
      } else {
        displayOnly.push(e.id);
      }
    } else if (choices.length > 0 && !anyChoiceEffect && !eventEffect) {
      fail("事件 '" + e.id + "' 的所有 choice 均无 apply/effect/flags——玩家选择后无任何效果");
    }
  }

  // B 类：转换载荷丢失 —— 单独报，附根因与消费方位置，避免与「纯展示」混为一谈
  Object.keys(convertedGroups).forEach(function (src) {
    var ids = convertedGroups[src];
    warn(
      "【转换载荷丢失】" +
        ids.length +
        " 个 _converted:\"" +
        src +
        "\" 事件无 choices 也无事件级施效字段——转换器 register" +
        (src === "news" ? "News" : src === "moral" ? "Moral" : "Xxx") +
        "EventsToPool() 未拷贝 effects/newsEffects 载荷，消费方读取的字段恒为 undefined，事件触发但零效果。ids: " +
        ids.join(", "),
    );
  });

  // A 类：原生纯展示事件 —— 保持软警告
  for (var d = 0; d < displayOnly.length; d++) {
    warn(
      "事件 '" + displayOnly[d] + "' 无 choices 且无事件级施效字段（可能是纯展示，请人工确认）",
    );
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
// 检出「读错字段导致某槽 0 注册」的静默失效。
//
// [更正 · 2026-09-15] 这里原本有一段「桥接」：
//     if (typeof window !== "undefined" && !window.RANDOM_EVENTS && Array.isArray(RE))
//       window.RANDOM_EVENTS = RE;
// 理由是「无头环境下 window 可能不指向真实全局，先桥接避免误报」——
// **这个理由本身是错的**：RANDOM_EVENTS 是 events_core.js 的顶层 const，
// 顶层 const/let 在任何环境（浏览器 / 无头 / 打包产物）都**不会**成为 window 的属性。
// 所以 `window.RANDOM_EVENTS` 在生产里同样是 undefined，loadAll 一直在早退。
// 那段桥接不但没有「避免误报」，反而**把一个真 bug 掩盖成了绿灯**。
// 现在源码已改成优先读顶层引用（trigger_registry.js:loadAllTriggers），
// 因此桥接已删除——本断言从此走真实路径，任何人回退修复都会被它抓住。
(function checkTriggerRegistry() {
  var TR = typeof TriggerRegistry !== "undefined" ? TriggerRegistry : globalThis.TriggerRegistry;
  if (!TR || typeof TR.loadAll !== "function") {
    warn("TriggerRegistry 不可用，跳过槽注册检查");
    return;
  }
  // 刻意**不**做任何桥接：loadAll 必须能在「只有顶层 const」的前提下自己找到事件池
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

    // ── 断言 5b（加强 · 2026-09-15）：有声明者的槽必须非空，且不得重复注册 ──
    // 只查「总数 > 0」是不够的：曾经 after_work 声明了 3 个事件却注册 0 个，
    // 而只要有任何一个槽非空，旧断言就会放过。逐槽核对。
    var declared = {};
    for (var e2 = 0; e2 < RE.length; e2++) {
      var ev2 = RE[e2];
      if (ev2 && Array.isArray(ev2.triggers)) {
        for (var t2 = 0; t2 < ev2.triggers.length; t2++) {
          var sl2 = ev2.triggers[t2];
          if (!declared[sl2]) declared[sl2] = {};
          declared[sl2][ev2.id] = true; // 用 id 去重：同一事件即使被扫两遍也只算一次
        }
      }
    }
    for (var sl3 in declared) {
      var want = Object.keys(declared[sl3]).length;
      var got = TR.getEventsForSlot(sl3).length;
      if (got === 0) {
        fail("槽 '" + sl3 + "' 有 " + want + " 个事件声明了它，但注册数为 0（注册链断裂）");
      } else if (got > want) {
        fail("槽 '" + sl3 + "' 注册数 " + got + " > 声明数 " + want + "（疑似重复注册→权重翻倍）");
      } else if (got < want) {
        fail("槽 '" + sl3 + "' 注册数 " + got + " < 声明数 " + want + "（部分事件未注册）");
      }
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
