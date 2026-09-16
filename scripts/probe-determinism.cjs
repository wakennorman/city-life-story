#!/usr/bin/env node
/**
 * probe-determinism.cjs — 证明「同样的种子跑两次，结果不一样」
 *
 * 动机：project 约定「游戏中所有随机判定必须通过 Random.* API，禁止裸 Math.random()」
 * （src/js/core/random.js:67）。但全库有 49 处裸 Math.random()。
 * 若这些裸调用落在模拟热路径上，则 headless_runner 的 Random.setSeed() 形同虚设，
 * 所有 Monte Carlo / 覆盖率跑分**不可复现**——历史数字无法互相比较。
 *
 * 本脚本：同样 seed、同样策略、同样天数，跑两次，逐项对比终局状态。
 *
 * 用法：
 *   node scripts/probe-determinism.cjs
 *   node scripts/probe-determinism.cjs --days 200 --strategy balanced
 */
"use strict";

const path = require("path");
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
const DAYS = argNum("days", 200);
const STRATEGY = argStr("strategy", "balanced");
const SEED = argNum("seed", 12345);

const ok = runner.init({ strict: false });
if (!ok) {
  console.error("引擎加载失败");
  process.exit(0);
}

function runOnce(tag) {
  const state = runner.createState({ seed: SEED, scenario: "classic" });
  if (!state) return null;
  const policy = runner.getStrategy(STRATEGY);
  let fired = 0;
  let pe = null;
  Object.defineProperty(state, "_pendingEvent", {
    configurable: true,
    get() {
      return pe;
    },
    set(v) {
      pe = v;
      if (v && v.id) fired++;
    },
  });
  let days = 0;
  for (let d = 0; d < DAYS; d++) {
    try {
      if (typeof policy === "function") policy(state);
    } catch {
      /* ignore */
    }
    try {
      state.player.actionPoints = 0;
      state.player.timeSlot = "evening";
      if (typeof runDailyPipeline === "function") runDailyPipeline(state);
    } catch {
      break;
    }
    days++;
    if (state._pendingEvent) {
      const c = state._pendingEvent.choices && state._pendingEvent.choices[0];
      try {
        if (c && typeof c.apply === "function") c.apply(state);
      } catch {
        /* ignore */
      }
    }
    state._pendingEvent = null;
    state._pendingEventId = null;
    if (state.flags && Array.isArray(state.flags._dailyTransactions)) {
      state.flags._dailyTransactions = [];
    }
    if (state.flags && state.flags.gameOver) break;
    if (state.status && state.status.health <= 0) break;
  }
  return {
    tag,
    days,
    cash: Math.round(state.resources.cash),
    bank: Math.round(state.resources.bankBalance || 0),
    health: Math.round(state.status.health),
    happiness: Math.round((state.needs && state.needs.happiness) || 0),
    fatigue: Math.round((state.needs && state.needs.fatigue) || 0),
    day: state.player.day,
    phase: state.player.phase,
    fired,
    skillsSum: Object.keys(state.skills || {}).reduce(
      (s, k) => s + ((state.skills[k] && state.skills[k].level) || 0),
      0,
    ),
    npcMet: Object.keys(state.relationships || {}).filter(
      (k) => state.relationships[k] && state.relationships[k].met,
    ).length,
  };
}

console.log("确定性实验：同样 seed=" + SEED + "、策略=" + STRATEGY + "、天数=" + DAYS + "，跑两次");
console.log("");

const a = runOnce("A");
const b = runOnce("B");
const c = runOnce("C");

const rows = [
  ["模拟天数", "days"],
  ["player.day", "day"],
  ["现金", "cash"],
  ["银行存款", "bank"],
  ["健康", "health"],
  ["心情", "happiness"],
  ["疲劳", "fatigue"],
  ["事件入队次数", "fired"],
  ["技能等级合计", "skillsSum"],
  ["已结识 NPC 数", "npcMet"],
];

console.log("| 指标 | 第 1 次 | 第 2 次 | 第 3 次 | 一致? |");
console.log("|------|---------|---------|---------|-------|");
let allSame = true;
for (const [label, key] of rows) {
  const va = a[key];
  const vb = b[key];
  const vc = c[key];
  const same = va === vb && vb === vc;
  if (!same) allSame = false;
  console.log(
    "| " + label + " | " + va + " | " + vb + " | " + vc + " | " + (same ? "✅" : "❌ 不一致") + " |",
  );
}

console.log("");
console.log("=".repeat(72));
if (allSame) {
  console.log("  ✅ 三次结果完全一致 —— 该配置下模拟是确定性的");
} else {
  console.log("  ❌ 三次结果不一致 —— **模拟不可复现**");
  console.log("");
  console.log("  后果：所有 Monte Carlo / 覆盖率跑分**每次都不一样**，");
  console.log("        历史数字之间无法比较（无法判断某次改动是变好还是变坏）。");
  console.log("        本次体检报告里的所有平衡数字都受此影响，只能当「量级参考」，不能当「回归基线」。");
  console.log("");
  console.log("  已诊断出的成因（按发现顺序）：");
  console.log("");
  console.log("  [1] 裸 Math.random() 绕过种子化 PRNG");
  console.log("      · src/js/core/random.js:67 明文约定「禁止使用裸 Math.random()」");
  console.log("      · 实际：src/js 全库 49 处（其中 45 处违规；random.js 内 4 处为兜底）");
  console.log("      · tests/ 内另有 8 处");
  console.log("      · eslint 配置无对应规则；npm test 门禁也不检查 → 无人拦");
  console.log("      · 【已修·测试侧】headless_runner 现在把 Math.random 也接到同一个 PRNG");
  console.log("        验证：连续 3 次 createState 后的随机序列已完全一致");
  console.log("");
  console.log("  [2] createState 未重定向 StateManager._state（跨局污染）");
  console.log("      · 原实现 `if (StateManager._state === null)` → 只有第 1 局生效");
  console.log("      · 后果：第 2 局起所有经由 StateManager 的读写都落在第 1 局的 state 上");
  console.log("        实测：messageLog 首局 260 条 → 次局起 0 条");
  console.log("      · 【已修】改为每次 createState 都重新指向（可用 keepStateManagerRef 关掉）");
  console.log("");
  console.log("  [3] 新闻模块的模块级全局缓存跨局存活（未修）");
  console.log("      · src/js/core/world_news_intro.js:1003-1005");
  console.log("        `_cachedRealNews` / `_cachedRealNewsTime` / `_realNewsStatus`");
  console.log("      · 这些缓存会经 getNewsBonusWeight 影响事件权重 → 影响抽中哪些事件");
  console.log("      · 从夹具外部**够不到**：脚本被包裹执行，模块级 var 不是全局属性，");
  console.log("        实测在 harness 里 `globalThis._cachedRealNews = null` 无效");
  console.log("      · 需在 src/js 侧提供 reset 接口，或让缓存挂到 state 上");
  console.log("");
  console.log("  → 结论：[1][2] 已修，但**仍未完全确定**，至少还有一个成因（[3] 最可疑）。");
  console.log("    在完全修好之前，不要把任何 MC/覆盖率数字当作回归基线。");
}
console.log("=".repeat(72));
