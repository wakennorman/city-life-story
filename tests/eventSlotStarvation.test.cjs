/**
 * 事件槽饿死 · 回归测试
 *
 * 背景（2026-09-15）：
 *   rollStreetEvent()（events_core.js）里「心理危机」和「村长债务」两段
 *   注释都写着**不占用随机事件槽**，但实现是：
 *       state._pendingEvent = X; return;
 *   而 `_pendingEvent` 是**单槽**，且函数开头第一行就是：
 *       if (state._pendingEvent) return;
 *   → 强制事件实际上**独占了当天唯一的名额**，注释意图完全落空。
 *
 *   实测（seed=20260915，玩家状态正常，400 天）：
 *     · 事件槽被占用 398 次，`mental_therapy_chance` 独占 **375 次（94%）**
 *     · 来自 4276 条随机事件池的投递 **0 次**
 *       （queueRandomEvent 全程只被调用 1 次）
 *   → 只要玩家心智长期低于 35，整个随机事件池等于不存在。
 *
 * 修复：强制通道命中时打「次日让位」标记（flags._yieldEventSlotToPool），
 *       次日跳过这两段检查直接走随机池。修复后实测：
 *       占用 398→238，强制 375→156，随机池投递 0→82。
 *
 * 本测试守住三条：
 *   ① 源码结构：强制分支必须被让位闸包裹，且命中时必须打标记
 *   ② 行为：强制通道不再吃掉 100% 的事件槽（修复前命中率恒 1.0）
 *   ③ 让位标记的消费语义：打了标记的次日确实让位，且标记只用一次
 *
 * 运行：node tests/eventSlotStarvation.test.cjs
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

const FORCED_IDS = [
  "mental_breakdown_edge",
  "mental_therapy_chance",
  "mental_recovery_milestone",
  "village_chief_warning",
  "village_chief_pressure",
  "village_chief_final",
];

(async () => {
  console.log("=".repeat(72));
  console.log("  事件槽饿死 · 回归测试");
  console.log("=".repeat(72));

  const ok = await runner.init({ seed: 424242 });
  if (!ok) {
    console.error("初始化失败");
    process.exit(1);
  }

  // ---------------------------------------------------------------
  console.log("\n[0] 前置检查");
  const hasRoll = vm.runInThisContext("typeof rollStreetEvent === 'function'");
  check(hasRoll, true, "rollStreetEvent 已定义");
  const hasQRE = vm.runInThisContext("typeof queueRandomEvent === 'function'");
  check(hasQRE, true, "queueRandomEvent 已定义");
  const poolSize = vm.runInThisContext(
    "RANDOM_EVENTS.filter(function(e){return e.phase==='street';}).length"
  );
  checkTrue(poolSize > 100, "street 阶段事件池规模合理（" + poolSize + " 条）");

  // ---------------------------------------------------------------
  console.log("\n[1] 源码守卫：让位闸必须存在且包住强制分支");
  const src = fs.readFileSync(
    path.join(__dirname, "..", "src", "js", "core", "events_core.js"),
    "utf8"
  );
  const fnStart = src.indexOf("function rollStreetEvent(state)");
  checkTrue(fnStart >= 0, "找到 rollStreetEvent 定义");
  // 取到下一个顶层函数定义为止
  const fnEnd = src.indexOf("\nfunction rollCorporateEvent", fnStart);
  const body = src.slice(fnStart, fnEnd > 0 ? fnEnd : fnStart + 8000);

  checkTrue(body.indexOf("_yieldEventSlotToPool") >= 0, "存在让位标记 _yieldEventSlotToPool");
  checkTrue(body.indexOf("if (!_yieldToPool)") >= 0, "强制分支被 if (!_yieldToPool) 包裹");
  // 两段强制通道命中后都必须打让位标记
  const yieldSetCount = (body.match(/_yieldEventSlotToPool\s*=\s*true/g) || []).length;
  checkTrue(yieldSetCount >= 2, "两段强制通道命中后都打了让位标记（实际 " + yieldSetCount + " 处）");
  // 标记必须在函数早期被消费（先读后清）
  const readIdx = body.indexOf("state.flags._yieldEventSlotToPool === true");
  const clearIdx = body.indexOf("state.flags._yieldEventSlotToPool = false");
  checkTrue(readIdx >= 0 && clearIdx > readIdx, "标记先读后清（消费语义正确）");

  // ---------------------------------------------------------------
  console.log("\n[2] 行为：强制通道不得吃掉 100% 的事件槽");
  const state = runner.createState({});
  globalThis.__st = state;

  // 构造一个必然命中强制通道的玩家：心智极低 + 从未咨询过
  vm.runInThisContext(`(function(){
    __st.player.day = 30;
    __st.player.mental = 5;
    __st.player.actionPoints = 100;
    __st.flags = __st.flags || {};
    delete __st.flags._hadTherapy;
    __st.flags._yieldEventSlotToPool = false;
  })()`);

  const N = 200;
  const res = vm.runInThisContext(`(function(){
    var forcedIds = ${JSON.stringify(FORCED_IDS)};
    var isForced = {};
    for (var i = 0; i < forcedIds.length; i++) isForced[forcedIds[i]] = true;
    var forced = 0, other = 0, none = 0;
    var firstForcedThenYield = false;
    for (var k = 0; k < ${N}; k++) {
      // 每次调用前清空事件槽，模拟「玩家已处理/进入次日」
      __st._pendingEvent = null;
      __st._pendingEventId = null;
      __st.player.day = 30 + k;          // 满足 minDay:5
      __st.player.mental = 5;            // 恒低，保证强制通道条件始终成立
      rollStreetEvent(__st);
      var ev = __st._pendingEvent;
      if (!ev) { none++; continue; }
      if (isForced[ev.id]) {
        forced++;
        if (__st.flags._yieldEventSlotToPool === true) firstForcedThenYield = true;
      } else {
        other++;
      }
    }
    return { forced: forced, other: other, none: none, marked: firstForcedThenYield };
  })()`);

  console.log("     强制命中 " + res.forced + " / 其它 " + res.other + " / 无事件 " + res.none);
  checkTrue(res.marked, "强制通道命中后确实打了让位标记");
  checkTrue(res.forced > 0, "强制通道仍会出现（危机未被静音）");
  const forcedRate = res.forced / N;
  // 修复前：强制分支无条件 return → forcedRate 恒为 1.0
  checkTrue(forcedRate < 0.85, "强制通道不再独占事件槽（命中率 " + forcedRate.toFixed(2) + " < 0.85）");
  checkTrue(forcedRate > 0.20, "强制通道未被过度压制（命中率 " + forcedRate.toFixed(2) + " > 0.20）");
  checkTrue(res.other > 0, "让位日能走到随机池并成功投递（" + res.other + " 次）");

  // ---------------------------------------------------------------
  console.log("\n[3] 让位标记的消费语义");
  const oneShot = vm.runInThisContext(`(function(){
    __st._pendingEvent = null; __st._pendingEventId = null;
    __st.player.day = 60; __st.player.mental = 5;
    __st.flags._yieldEventSlotToPool = false;
    rollStreetEvent(__st);                       // 第 1 次：命中强制 + 打标记
    var markedAfter1 = __st.flags._yieldEventSlotToPool === true;
    var ev1 = __st._pendingEvent ? __st._pendingEvent.id : null;
    __st._pendingEvent = null; __st._pendingEventId = null;
    rollStreetEvent(__st);                       // 第 2 次：应让位，且标记被消费
    var markedAfter2 = __st.flags._yieldEventSlotToPool === true;
    return { markedAfter1: markedAfter1, ev1: ev1, markedAfter2: markedAfter2 };
  })()`);
  checkTrue(oneShot.markedAfter1, "第 1 次命中强制通道后标记为 true");
  checkTrue(FORCED_IDS.indexOf(oneShot.ev1) >= 0, "第 1 次投递的确实是强制通道事件（" + oneShot.ev1 + "）");
  check(oneShot.markedAfter2, false, "第 2 次让位后标记被消费（不会连让两天）");

  // ---------------------------------------------------------------
  console.log("\n" + "=".repeat(72));
  console.log("  通过 " + pass + " / 失败 " + fail);
  console.log("=".repeat(72));
  process.exit(fail === 0 ? 0 : 1);
})();
