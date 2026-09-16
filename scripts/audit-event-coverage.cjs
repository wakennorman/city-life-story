#!/usr/bin/env node
/**
 * audit-event-coverage.cjs — 事件覆盖率审计
 *
 * 回答一个此前无人验证过的问题：
 *   RANDOM_EVENTS 里那 4276 个事件，到底有多少能在真实游玩中被触发？
 *
 * 为什么不能直接数 queueRandomEvent 的调用：
 *   随机池只是事件入队的**其中一条**通道。以下通道都会直接写 state._pendingEvent，
 *   绕过 queueRandomEvent：
 *     · rollStreetEvent 内的心理危机优先检查（mental_* 三事件）
 *     · rollStreetEvent 内的村长债务优先检查（village_chief_* 三事件）
 *     · checkChainEventQueue 链式事件队列
 *     · daily_pipeline 的触发槽 / 随机遭遇 / 节日事件 / 人生抉择
 *   因此本脚本改为在 state 上挂 _pendingEvent 的 setter，捕获**所有**入队路径。
 *
 * 为什么必须替玩家做选择：
 *   headless 下 showEventModal 不会真正关闭弹窗，若不做选择：
 *     · _pendingEvent 永久占用 → rollStreetEvent 开头的守卫让后续天数再也抽不到事件
 *     · 事件 apply 从不执行 → 退出条件（flag）永不写入 → 同一事件天天重播
 *   所以每天结束后模拟玩家选第一个选项并执行其 apply/effect。
 *
 * 用法：
 *   node scripts/audit-event-coverage.cjs                       # 默认 10 种子 × 365 天
 *   node scripts/audit-event-coverage.cjs --trials 30 --days 500
 *   node scripts/audit-event-coverage.cjs --strategy all
 *   node scripts/audit-event-coverage.cjs --all                 # 列出全部未触发事件
 *   node scripts/audit-event-coverage.cjs --json coverage.json
 *
 * 退出码：始终 0（纯审计）。
 */
"use strict";

const path = require("path");
const fs = require("fs");
const runner = require(path.join(__dirname, "..", "tests", "headless_runner.cjs"));

const argv = process.argv.slice(2);
function argNum(name, def) {
  const i = argv.indexOf("--" + name);
  if (i < 0) return def;
  const v = Number(argv[i + 1]);
  return Number.isFinite(v) ? v : def;
}
function argStr(name, def) {
  const i = argv.indexOf("--" + name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
}

const TRIALS = argNum("trials", 10);
const DAYS = argNum("days", 365);
const STRATEGY = argStr("strategy", "balanced");
const SHOW_ALL = argv.includes("--all");
const JSON_OUT = argStr("json", "");

// ── 加载引擎 ──────────────────────────────────────────────────
const ok = runner.init({ strict: false });
if (!ok) {
  console.error("引擎加载失败，无法审计");
  process.exit(0);
}

const ALL_EVENTS = typeof RANDOM_EVENTS !== "undefined" ? RANDOM_EVENTS : [];
if (!Array.isArray(ALL_EVENTS) || ALL_EVENTS.length === 0) {
  console.error("RANDOM_EVENTS 不可用，无法审计");
  process.exit(0);
}

// ── 通道计数：区分「随机池」与「其它通道」 ────────────────────
let viaRandomPool = 0;
const origQueue = globalThis.queueRandomEvent;
if (typeof origQueue === "function") {
  globalThis.queueRandomEvent = function (state, phase) {
    const before = state._pendingEventId;
    const r = origQueue.call(this, state, phase);
    if (state._pendingEventId && state._pendingEventId !== before) viaRandomPool++;
    return r;
  };
}

// ── 全局统计 ──────────────────────────────────────────────────
const fired = new Map(); // id -> 触发次数
const channel = { randomPool: 0, other: 0 };
let daysSimulated = 0;
let eventsAnswered = 0;
let answerErrors = 0;
let choicesWithoutApply = 0;

function answerEvent(state, evt) {
  if (!evt) return;
  let choices = evt.choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    // 无选项事件：直接执行事件级施效字段
    if (typeof evt.apply === "function") {
      try { evt.apply(state); } catch (e) { answerErrors++; }
    }
    return;
  }
  const c = choices[0];
  let applied = false;
  if (c && typeof c.apply === "function") {
    try { c.apply(state); applied = true; } catch (e) { answerErrors++; }
  } else if (c && typeof c.effect === "function") {
    try { c.effect(state); applied = true; } catch (e) { answerErrors++; }
  }
  if (!applied) choicesWithoutApply++;
}

// ── 跑模拟 ────────────────────────────────────────────────────
const strategies =
  STRATEGY === "all"
    ? ["balanced", "grinder", "skiller", "trader", "social", "corporate"]
    : [STRATEGY];

console.log("事件覆盖率审计");
console.log("  种子数:", TRIALS, " 每次天数:", DAYS, " 策略:", strategies.join(","));
console.log("");

const runStats = [];
for (const st of strategies) {
  let ranTrials = 0;
  let totalDays = 0;
  for (let t = 0; t < TRIALS; t++) {
    const seed = 1000 + t * 7919;
    let state;
    try {
      state = runner.createState({ seed, scenario: "classic" });
    } catch (e) {
      continue;
    }
    if (!state) continue;
    ranTrials++;

    // 挂 _pendingEvent setter，捕获所有入队路径
    let pe = null;
    Object.defineProperty(state, "_pendingEvent", {
      configurable: true,
      get() {
        return pe;
      },
      set(v) {
        pe = v;
        if (v && v.id) {
          fired.set(v.id, (fired.get(v.id) || 0) + 1);
          if (viaRandomPool > 0) {
            channel.randomPool++;
            viaRandomPool = 0;
          } else {
            channel.other++;
          }
        }
      },
    });

    const policyFn = runner.getStrategy(st);
    for (let d = 0; d < DAYS; d++) {
      try {
        if (typeof policyFn === "function") policyFn(state);
      } catch (e) {}
      try {
        state.player.actionPoints = 0;
        state.player.timeSlot = "evening";
        if (typeof runDailyPipeline === "function") runDailyPipeline(state);
      } catch (e) {
        break;
      }
      totalDays++;
      daysSimulated++;

      // 模拟玩家回答弹窗
      if (state._pendingEvent) {
        answerEvent(state, state._pendingEvent);
        eventsAnswered++;
      }
      // 关闭弹窗，让下一天能继续抽
      state._pendingEvent = null;
      state._pendingEventId = null;
      // 防流水无限累积（真实游戏里由 daily_report 清空）
      if (state.flags && Array.isArray(state.flags._dailyTransactions)) {
        state.flags._dailyTransactions = [];
      }

      if (state.flags && state.flags.gameOver) break;
      if (state.status && state.status.health <= 0) break;
    }
  }
  runStats.push({ strategy: st, trials: ranTrials, days: totalDays });
  console.log("  [" + st + "] 完成 " + ranTrials + " 次 / 累计 " + totalDays + " 天");
}

// ── 统计 ──────────────────────────────────────────────────────
const byId = new Map();
for (const e of ALL_EVENTS) if (e && e.id && !byId.has(e.id)) byId.set(e.id, e);

const uniqueIds = [...byId.keys()];
const didFire = uniqueIds.filter((id) => fired.has(id));
const neverFired = uniqueIds.filter((id) => !fired.has(id));

const poolRandom = uniqueIds.filter((id) => {
  const e = byId.get(id);
  return e.phase === "street" || e.phase === "corporate";
});
const poolChain = uniqueIds.filter((id) => byId.get(id)._isChainEvent === true);
const poolTrigger = uniqueIds.filter((id) => Array.isArray(byId.get(id).triggers));

console.log("");
console.log("═══════════════════════════════════════════════════════════");
console.log("  模拟总天数                : " + daysSimulated);
console.log("  事件被送达玩家            : " + eventsAnswered + " 次");
console.log("  事件池规模（唯一 id）      : " + uniqueIds.length);
console.log("  实际被触发过              : " + didFire.length + "  (" + ((didFire.length / uniqueIds.length) * 100).toFixed(1) + "%)");
console.log("  从未被触发                : " + neverFired.length + "  (" + ((neverFired.length / uniqueIds.length) * 100).toFixed(1) + "%)");
console.log("");
console.log("  入队通道分布：");
console.log("    随机池 (queueRandomEvent) : " + channel.randomPool);
console.log("    其它通道（优先/链式/节日/管线触发槽）: " + channel.other);
console.log("");
console.log("  按可选通道拆分：");
console.log("    phase ∈ {street,corporate} : " + poolRandom.length);
console.log("    _isChainEvent              : " + poolChain.length);
console.log("    带 triggers 数组           : " + poolTrigger.length);
console.log("");
console.log("  选项 apply 缺失             : " + choicesWithoutApply);
console.log("  选项 apply 抛错             : " + answerErrors);
console.log("═══════════════════════════════════════════════════════════");

// 触发次数分布
const buckets = { "1 次": 0, "2-3 次": 0, "4-10 次": 0, "11-50 次": 0, ">50 次": 0 };
for (const [, n] of fired) {
  if (n === 1) buckets["1 次"]++;
  else if (n <= 3) buckets["2-3 次"]++;
  else if (n <= 10) buckets["4-10 次"]++;
  else if (n <= 50) buckets["11-50 次"]++;
  else buckets[">50 次"]++;
}
console.log("\n已触发事件的次数分布：");
for (const [k, v] of Object.entries(buckets)) console.log("  " + k + ": " + v);

const top = [...fired.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
console.log("\n触发最频繁的事件（前 15）：");
top.forEach(([id, n]) => console.log("  " + String(n).padStart(5) + " 次  " + id));

// 未触发事件前缀分布
const prefix = new Map();
for (const id of neverFired) {
  const m = id.match(/^([a-z]+)/);
  prefix.set(m ? m[1] : "_", (prefix.get(m ? m[1] : "_") || 0) + 1);
}
console.log("\n未触发事件前缀分布（前 25）：");
[...prefix.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 25)
  .forEach(([p, n]) => console.log("  " + p + ": " + n));

const shown = SHOW_ALL ? neverFired : neverFired.slice(0, 60);
console.log("\n未触发事件" + (SHOW_ALL ? "（全部）" : "样例（前 60）") + "：");
shown.forEach((id) => console.log("  - " + id));

if (JSON_OUT) {
  fs.writeFileSync(
    JSON_OUT,
    JSON.stringify(
      {
        params: { trials: TRIALS, days: DAYS, strategies },
        runStats,
        daysSimulated,
        eventsAnswered,
        total: uniqueIds.length,
        firedCount: didFire.length,
        neverFiredCount: neverFired.length,
        coveragePct: Number(((didFire.length / uniqueIds.length) * 100).toFixed(2)),
        channel,
        fired: Object.fromEntries([...fired.entries()].sort((a, b) => b[1] - a[1])),
        neverFired,
      },
      null,
      2
    ),
    "utf8"
  );
  console.log("\n已写出 JSON: " + JSON_OUT);
}
