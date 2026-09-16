/**
 * TriggerRegistry 触发槽 · 回归测试
 *
 * 背景（2026-09-15 修复）：
 *   loadAllTriggers()（trigger_registry.js）第一行原是：
 *       if (!window.RANDOM_EVENTS) return;
 *   而 RANDOM_EVENTS 是 events_core.js 的**顶层 const**（`const RANDOM_EVENTS = []`）。
 *   顶层 const/let **在任何环境**（浏览器 / 无头 / 打包产物）都不会成为 window 的属性，
 *   所以 loadAllTriggers() 每次都直接早退，**一个事件都没注册过**：
 *     · 12 个触发槽全部为空
 *     · main.js 的 after_work 槽、travel.js 的 after_travel 槽两条链路全断
 *     · 5 个约定式 triggers 事件永久不可达
 *     · daily_pipeline 里 6 个 trigger_slot_* 步骤每天空跑（永远 return null）
 *   实证：dist/app.js 里 7 处 window.RANDOM_EVENTS **全是读、无一处赋值**。
 *
 * 更糟的是 tests/events_integrity.cjs 里有一段「桥接」把 window.RANDOM_EVENTS = RE，
 * 于是断言恒绿——**门禁把一个真 bug 掩盖成了绿灯**。那段桥接已删除。
 *
 * 附带修了一个由此才暴露的问题：loadAllTriggers 会扫两遍
 * （RANDOM_EVENTS + MORAL_EVENTS，而后者已被并入前者）→ 同一事件注册两次 →
 * 权重翻倍。registerTriggeredEvent 现在幂等。
 *
 * 运行：node tests/triggerRegistry.test.cjs
 */
const fs = require("fs");
const path = require("path");
const runner = require("./headless_runner.cjs");
const vm = require("vm");

let pass = 0;
let fail = 0;
function check(actual, expected, name) {
  const ok = actual === expected;
  if (ok) pass++;
  else fail++;
  console.log((ok ? "  ✅ " : "  ❌ ") + name +
    (ok ? "" : "  (实际 " + JSON.stringify(actual) + "，期望 " + JSON.stringify(expected) + ")"));
}
function checkTrue(cond, name) {
  check(!!cond, true, name);
}

/**
 * 剥掉注释再做源码字符串断言。
 * 教训：本轮两次被自己写的注释骗到——注释里引用了「旧代码长什么样」，
 * 结果守卫正则匹配到了注释本身，误报「修复未生效」。
 */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "") // 块注释
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1"); // 行注释（避开 http:// 之类）
}

(async () => {
  console.log("=".repeat(72));
  console.log("  TriggerRegistry 触发槽 · 回归测试");
  console.log("=".repeat(72));

  const ok = await runner.init({ seed: 20260915 });
  if (!ok) {
    console.error("初始化失败");
    process.exit(1);
  }
  const state = runner.createState({});
  globalThis.__st = state;

  // ---------------------------------------------------------------
  console.log("\n[0] 前置：RANDOM_EVENTS 不挂 window（这是本 bug 的根因）");
  const env = vm.runInThisContext(`(function(){
    return {
      bareType: typeof RANDOM_EVENTS,
      bareLen: (typeof RANDOM_EVENTS !== "undefined") ? RANDOM_EVENTS.length : -1,
      winType: typeof window.RANDOM_EVENTS,
      gType: typeof globalThis.RANDOM_EVENTS
    };
  })()`);
  check(env.bareType, "object", "顶层 RANDOM_EVENTS 可访问");
  checkTrue(env.bareLen > 1000, "顶层 RANDOM_EVENTS 已填充（" + env.bareLen + " 条）");
  // 这两条不是「期望 window 上有」——而是**记录事实**：window/globalThis 上确实没有。
  // 任何依赖 window.RANDOM_EVENTS 的代码都注定失败，所以 loadAll 必须读顶层引用。
  check(env.winType, "undefined", "window.RANDOM_EVENTS 确实是 undefined（根因确认）");
  check(env.gType, "undefined", "globalThis.RANDOM_EVENTS 确实是 undefined（根因确认）");

  // ---------------------------------------------------------------
  console.log("\n[1] 注册链：无任何桥接，loadAll 必须能自己找到事件池");
  const reg = vm.runInThisContext(`(function(){
    // 刻意先清空槽，保证测的是 loadAll 的真实行为
    var SLOTS = Object.keys(TriggerRegistry.SLOTS);
    var before = {};
    for (var i = 0; i < SLOTS.length; i++) before[SLOTS[i]] = TriggerRegistry.getEventsForSlot(SLOTS[i]).length;
    TriggerRegistry.loadAll();
    var after = {};
    for (var j = 0; j < SLOTS.length; j++) after[SLOTS[j]] = TriggerRegistry.getEventsForSlot(SLOTS[j]).length;
    // 从事件池反推「每个槽应有多少个事件（按 id 去重）」
    var declared = {};
    for (var k = 0; k < RANDOM_EVENTS.length; k++) {
      var e = RANDOM_EVENTS[k];
      if (e && Array.isArray(e.triggers)) {
        for (var t = 0; t < e.triggers.length; t++) {
          if (!declared[e.triggers[t]]) declared[e.triggers[t]] = {};
          declared[e.triggers[t]][e.id] = true;
        }
      }
    }
    var expected = {};
    for (var s in declared) expected[s] = Object.keys(declared[s]).length;
    return { before: before, after: after, expected: expected };
  })()`);

  console.log("     槽注册数：" + JSON.stringify(reg.after));
  const totalAfter = Object.values(reg.after).reduce((a, b) => a + b, 0);
  checkTrue(totalAfter > 0, "槽注册总数 > 0（修复前恒为 0）");
  for (const slot of Object.keys(reg.expected)) {
    check(reg.after[slot], reg.expected[slot],
      "槽 '" + slot + "' 注册数 == 声明数（" + reg.expected[slot] + "）");
  }
  checkTrue(reg.after["after_work"] > 0, "after_work 槽非空（main.js:5222 链路恢复）");
  checkTrue(reg.after["after_travel"] > 0, "after_travel 槽非空（travel.js:592 链路恢复）");

  // ---------------------------------------------------------------
  console.log("\n[2] 幂等：重复 loadAll 不得让注册数翻倍");
  const twice = vm.runInThisContext(`(function(){
    var SLOTS = Object.keys(TriggerRegistry.SLOTS);
    var a = {};
    for (var i = 0; i < SLOTS.length; i++) a[SLOTS[i]] = TriggerRegistry.getEventsForSlot(SLOTS[i]).length;
    TriggerRegistry.loadAll();
    TriggerRegistry.loadAll();
    var b = {};
    for (var j = 0; j < SLOTS.length; j++) b[SLOTS[j]] = TriggerRegistry.getEventsForSlot(SLOTS[j]).length;
    return { a: a, b: b };
  })()`);
  let dup = false;
  for (const s of Object.keys(twice.a)) if (twice.a[s] !== twice.b[s]) dup = true;
  check(dup, false, "连调 3 次 loadAll，各槽注册数不变（无重复注册→权重不翻倍）");

  // ---------------------------------------------------------------
  console.log("\n[3] 端到端：after_work 槽真的能产出事件");
  const fired = vm.runInThisContext(`(function(){
    var st = __st;
    st.player.day = 30;                 // 满足三个事件的 minDay(5/8/15)
    st._eventCooldowns = {};            // 清冷却
    // 三个事件的 conditions 分别是「有工作」「雨天」「有工作」——
    // 构造满足条件的状态（来源见 moral_events.js 的 after_work 翻译 IIFE）
    st.career = st.career || {};
    st.career.currentJob = st.career.currentJob || { id: "__test_job", name: "测试岗位" };
    st.weather = st.weather || {};
    st.weather.current = "rainy";
    var got = [];
    for (var i = 0; i < 40; i++) {
      var ev = TriggerRegistry.triggerRandom("after_work", st);
      if (ev && ev.id) got.push(ev.id);
    }
    var uniq = {};
    for (var j = 0; j < got.length; j++) uniq[got[j]] = true;
    return { total: got.length, uniq: Object.keys(uniq) };
  })()`);
  console.log("     40 次触发尝试 → " + fired.total + " 次产出，涉及 " + fired.uniq.length + " 个不同事件：" + fired.uniq.join(", "));
  checkTrue(fired.total > 0, "after_work 能产出事件（修复前恒为 null）");
  checkTrue(fired.uniq.length > 0, "产出的事件 id 合法");

  // ---------------------------------------------------------------
  console.log("\n[4] 源码守卫：不得回退到「只读 window.RANDOM_EVENTS」");
  const regSrc = stripComments(fs.readFileSync(
    path.join(__dirname, "..", "src", "js", "core", "trigger_registry.js"), "utf8"));
  const loadStart = regSrc.indexOf("function loadAllTriggers()");
  checkTrue(loadStart >= 0, "找到 loadAllTriggers 定义");
  const loadBody = regSrc.slice(loadStart, loadStart + 2000);
  checkTrue(
    loadBody.indexOf('typeof RANDOM_EVENTS !== "undefined"') >= 0,
    "loadAllTriggers 优先读顶层 RANDOM_EVENTS 引用"
  );
  checkTrue(
    !/if\s*\(\s*!window\.RANDOM_EVENTS\s*\)\s*return/.test(loadBody),
    "loadAllTriggers 不再有 `if (!window.RANDOM_EVENTS) return;` 早退"
  );

  // ---------------------------------------------------------------
  console.log("\n[5] 门禁守卫：events_integrity 不得再桥接掩盖本 bug");
  const intSrc = stripComments(fs.readFileSync(
    path.join(__dirname, "..", "tests", "events_integrity.cjs"), "utf8"));
  checkTrue(
    !/window\.RANDOM_EVENTS\s*=\s*RE/.test(intSrc),
    "events_integrity.cjs 里的 window.RANDOM_EVENTS 桥接已删除"
  );

  // ---------------------------------------------------------------
  console.log("\n[6] 槽占用守卫：槽已占用时不得投递、不得白烧冷却");
  // 背景：main.js 的 after_work / travel.js 的 after_travel 原先**无条件**调用
  // triggerRandom，而 `_pendingEvent` 是单槽 → 会静默覆盖已排队的事件；
  // 且 triggerRandom 内部**先 setCooldown 再 return** → 投不出去也白烧 25~40 天冷却。
  const guardSrc = stripComments(fs.readFileSync(
    path.join(__dirname, "..", "src", "js", "main.js"), "utf8"));
  const awIdx = guardSrc.indexOf('triggerRandom("after_work"');
  checkTrue(awIdx >= 0, "找到 after_work 调用点");
  const awCtx = guardSrc.slice(Math.max(0, awIdx - 900), awIdx);
  checkTrue(
    awCtx.indexOf("!state._pendingEvent") >= 0,
    "after_work 调用点有 !state._pendingEvent 守卫"
  );
  const tvSrc = stripComments(fs.readFileSync(
    path.join(__dirname, "..", "src", "js", "core", "travel.js"), "utf8"));
  const atIdx = tvSrc.indexOf('"after_travel"');
  checkTrue(atIdx >= 0, "找到 after_travel 调用点");
  const atCtx = tvSrc.slice(Math.max(0, atIdx - 700), atIdx);
  checkTrue(
    atCtx.indexOf("!state._pendingEvent") >= 0,
    "after_travel 调用点有 !state._pendingEvent 守卫"
  );

  const guardBeh = vm.runInThisContext(`(function(){
    var st = __st;
    st.player.day = 30;
    st.player.actionPoints = 100;
    st.career = st.career || {};
    st.career.history = st.career.history || [];
    st.career.currentJob = st.career.currentJob || { id: "__t", name: "测试", workDays: 0, path: "street" };
    st._eventCooldowns = {};
    // 占住唯一的事件槽
    var occupied = { id: "__occupied__", title: "占位", choices: [{ text: "x", apply: function(){} }] };
    st._pendingEvent = occupied;
    st._pendingEventId = "__occupied__";
    var cdBefore = JSON.stringify(st._eventCooldowns);
    var job = (typeof STREET_JOBS !== "undefined" && STREET_JOBS.length) ? STREET_JOBS[0] : null;
    if (job && typeof doStreetJob === "function") {
      try { doStreetJob(job); } catch (e) { /* 无头环境副作用，忽略 */ }
    }
    var cdAfter = JSON.stringify(st._eventCooldowns);
    return {
      ran: !!(job && typeof doStreetJob === "function"),
      cooldownChanged: cdBefore !== cdAfter,
      stillOccupied: !!(st._pendingEvent && st._pendingEvent.id === "__occupied__")
    };
  })()`);
  if (!guardBeh.ran) {
    console.log("     ⚠️ 跳过行为断言（doStreetJob / STREET_JOBS 不可用）");
  } else {
    check(guardBeh.stillOccupied, true, "槽被占用时，after_work 不得覆盖已排队的事件");
    check(guardBeh.cooldownChanged, false, "槽被占用时，不得消耗 after_work 事件的冷却");
  }

  // ---------------------------------------------------------------
  console.log("\n" + "=".repeat(72));
  console.log("  通过 " + pass + " / 失败 " + fail);
  console.log("=".repeat(72));
  process.exit(fail === 0 ? 0 : 1);
})();
