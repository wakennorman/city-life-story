#!/usr/bin/env node
/**
 * probe-phase-reach.cjs — 探测「关键状态在模拟里到底有没有到达过」
 *
 * 动机：可达性审计显示 ~585 个被阻塞事件的 conditions 依赖 corporate / startup 状态，
 * 但 MC 报告里出现过 "corporate 创业0%"。若这些状态在模拟中从未出现，
 * 那这批事件就是集体沉默——而这既可能是"测试没跑到"，也可能是"游戏里根本到不了"。
 *
 * 本脚本同时跑两种驱动：
 *   A. 现有策略（与 MC / 覆盖率审计同源）—— 反映"自动化测试能跑到哪"
 *   B. 强制驱动（直接调推进函数，把玩家推到目标状态）—— 反映"游戏里能不能到"
 *
 * 用法：
 *   node scripts/probe-phase-reach.cjs
 *   node scripts/probe-phase-reach.cjs --trials 6 --days 400
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
const TRIALS = argNum("trials", 6);
const DAYS = argNum("days", 400);

const ok = runner.init({ strict: false });
if (!ok) {
  console.error("引擎加载失败");
  process.exit(0);
}

/** 观测一组"关键状态"，记录是否到达过、以及最大值 */
function makeProbe() {
  return {
    phases: new Set(),
    maxDay: 0,
    everStartupCompany: false,
    everCorporateActive: false,
    maxWorkDays: 0,
    maxEventHistory: 0,
    everJobPath: false,
    maxSkillsAbove3: 0,
    everTradeLocation: false,
    everStockHoldings: false,
    everRelationship40: false,
    everAge: 0,
  };
}

function observe(state, p) {
  if (!state) return;
  const pl = state.player || {};
  p.phases.add(pl.phase || "(undefined)");
  p.maxDay = Math.max(p.maxDay, pl.day || 0);
  p.everAge = Math.max(p.everAge, pl.age || 0);
  if (state.startup && state.startup.company) p.everStartupCompany = true;
  if (state.corporate && state.corporate.active) p.everCorporateActive = true;
  const job = state.career && state.career.currentJob;
  if (job && job.path) p.everJobPath = true;
  if (job) p.maxWorkDays = Math.max(p.maxWorkDays, job.workDays || 0);
  const hist = state.flags && state.flags._eventHistory;
  if (Array.isArray(hist)) p.maxEventHistory = Math.max(p.maxEventHistory, hist.length);
  if (state.skills) {
    let n = 0;
    for (const k of Object.keys(state.skills)) {
      const s = state.skills[k];
      if (s && (s.level || 0) >= 3) n++;
    }
    p.maxSkillsAbove3 = Math.max(p.maxSkillsAbove3, n);
  }
  if (state.trade && state.trade.currentLocation) p.everTradeLocation = true;
  if (state.investment && state.investment.stockHoldings) {
    const sh = state.investment.stockHoldings;
    if (Array.isArray(sh) ? sh.length > 0 : Object.keys(sh).length > 0)
      p.everStockHoldings = true;
  }
  if (state.relationships) {
    for (const id of Object.keys(state.relationships)) {
      const r = state.relationships[id];
      if (r && r.met && (r.affinity || 0) >= 40) {
        p.everRelationship40 = true;
        break;
      }
    }
  }
}

function drive(state, strategyName) {
  const policy = runner.getStrategy(strategyName);
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
}

const strategies = ["balanced", "grinder", "skiller", "trader", "social", "corporate"];
const agg = makeProbe();

console.log("关键状态可达性探测");
console.log("  种子数: " + TRIALS + "  每次天数: " + DAYS);
console.log("");
console.log("跑 " + strategies.length + " 策略 × " + TRIALS + " 种子 …");

for (const st of strategies) {
  const per = makeProbe();
  for (let t = 0; t < TRIALS; t++) {
    const seed = 1000 + t * 7919;
    let state;
    try {
      state = runner.createState({ seed, scenario: "classic" });
    } catch {
      continue;
    }
    if (!state) continue;
    drive(state, st);
    observe(state, per);
    observe(state, agg);
  }
  const hit = (b) => (b ? "✅" : "❌");
  console.log(
    "  " + st.padEnd(11) +
      " phase=" + [...per.phases].join("/").padEnd(22) +
      " 创业=" + hit(per.everStartupCompany) +
      " corporate=" + hit(per.everCorporateActive) +
      " 职业path=" + hit(per.everJobPath) +
      " 工作天数max=" + String(per.maxWorkDays).padStart(4) +
      " 事件史max=" + String(per.maxEventHistory).padStart(3),
  );
}

console.log("");
console.log("=".repeat(72));
console.log("  汇总（全部策略 × 全部种子）");
console.log("=".repeat(72));
const row = (label, val) => console.log("  " + label.padEnd(30) + val);
row("到达过的 phase", [...agg.phases].join(", "));
row("最大 player.day", agg.maxDay);
row("最大 player.age", agg.everAge);
row("★ 曾进入 startup.company", agg.everStartupCompany ? "是" : "**否**");
row("★ 曾进入 corporate.active", agg.everCorporateActive ? "是" : "**否**");
row("曾持有带 path 的职业", agg.everJobPath ? "是" : "**否**");
row("单份工作最大 workDays", agg.maxWorkDays);
row("flags._eventHistory 最大长度", agg.maxEventHistory);
row("单次最多「等级≥3 的技能数」", agg.maxSkillsAbove3);
row("曾到过 trade.currentLocation", agg.everTradeLocation ? "是" : "**否**");
row("曾持有股票", agg.everStockHoldings ? "是" : "**否**");
row("曾有 NPC 好感 ≥40", agg.everRelationship40 ? "是" : "**否**");
