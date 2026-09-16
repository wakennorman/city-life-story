#!/usr/bin/env node
/**
 * probe-startup-survival.cjs — 探测「注册公司后能不能活到第一个产品上线」
 *
 * 动机：报告第二十八节发现，真实游戏里注册资金 ¥15,000
 *   但做出第一个产品的总需求 ¥34,000~108,000 → 缺口 2.3~7.2x，
 *   玩家注册后 37 天内必然破产、数学上做不出产品。
 *
 * 本脚本直接驱动真实游戏代码路径（registerStartup → developProduct → tickStartup），
 * 在无头环境里跑「注册 → 开发 → 上线」全流程，回答两个问题：
 *   1. cashReserve 在哪一天归零（= 破产日）？
 *   2. 产品能不能在上线前做出来？
 *
 * 用法：
 *   node scripts/probe-startup-survival.cjs
 *   node scripts/probe-startup-survival.cjs --industry tech --effort 2
 *   node scripts/probe-startup-survival.cjs --CLS_AB=... (不支持)
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
  if (i < 0) return def;
  return argv[i + 1] || def;
}

const INDUSTRY = argStr("industry", "tech");
const EFFORT = argNum("effort", 2);
const MAX_DAYS = argNum("days", 120);

const ok = runner.init({ strict: false });
if (!ok) {
  console.error("引擎加载失败");
  process.exit(0);
}

// [修复] 原写法 `StateManager.getState()` 直接抛 "GameState not initialized"，
//   因为 init() 只加载引擎、不建局。正确做法是用 runner.createState() 建一局：
//   它内部调用 createDefaultState(scenario) 并把 StateManager._state 指向新状态。
//   （与 tests/monte_carlo.cjs:2795 `runner.createState({seed, scenario:"classic"})` 同源。）
const SEED = argNum("seed", 20260916);
let state = runner.createState({ seed: SEED, scenario: "classic" });
if (!state) {
  console.error("createState 返回 null（createDefaultState 不可用）");
  process.exit(0);
}

// 把玩家摆在「刚攒够注册资金」的状态
state.player.day = 61; // 创业条件之一：Day>=60
state.resources.cash = 15000;
state.player.phase = "corporate";
// 创业要求：3 项技能 ≥ 15 级（见 startup.js:300 注释与 canRegisterStartup 校验）
state.skills = state.skills || {};
["coding", "english", "writing"].forEach((k) => {
  state.skills[k] = { level: 16, xp: 0 };
});

// 创业要求：至少 2 位 NPC 好感 ≥ 40。
// [修复] 好感存放于 state.relationships[npcId].affinity（state.js:157），
//   而非 state.npcs[...].affinity —— 原写法写错了字段路径，导致条件恒不满足。
if (!state.relationships) state.relationships = {};
// 先看是否已有可用的 NPC 关系条目；没有就造两个。
let relKeys = Object.keys(state.relationships);
if (relKeys.length < 2) {
  const pool =
    (typeof NPC_DATABASE !== "undefined" && NPC_DATABASE && Object.keys(NPC_DATABASE)) ||
    (typeof NPCS !== "undefined" && NPCS && Object.keys(NPCS)) ||
    ["npc_probe_a", "npc_probe_b", "npc_probe_c"];
  pool.slice(0, 3).forEach((id) => {
    if (!state.relationships[id]) {
      state.relationships[id] = { affinity: 50, met: true, discovered: {} };
    }
  });
  relKeys = Object.keys(state.relationships);
}
relKeys.slice(0, 3).forEach((id) => {
  const rel = state.relationships[id];
  if (rel && typeof rel === "object") {
    rel.affinity = Math.max(50, rel.affinity || 0);
    rel.met = true;
  }
});

console.log("=".repeat(72));
console.log("  创业生存探针 — 注册后能否活到第一个产品上线");
console.log("=".repeat(72));
console.log(`  行业: ${INDUSTRY}   开发力度: effort=${EFFORT}   上限: ${MAX_DAYS} 天`);
console.log("");

// === 1. 注册公司 ===
const registerCost =
  typeof getStartupRegistrationCost === "function"
    ? getStartupRegistrationCost(state)
    : 15000;
console.log(`  [注册前] 现金 ¥${state.resources.cash}  注册门槛 ¥${registerCost}`);

let regResult = null;
if (typeof registerStartup === "function") {
  try {
    regResult = registerStartup(state, "探针公司", INDUSTRY, "");
  } catch (e) {
    console.log("  ❌ registerStartup 抛错: " + e.message);
  }
}
const company = state.startup && state.startup.company;
if (!company) {
  console.log("  ❌ 注册失败 —— 未创建公司。结果: " + JSON.stringify(regResult));
  console.log("     （可能是不满足技能/NPC/Day 条件，探针已尽量满足）");
  process.exit(0);
}

console.log(`  [注册后] 现金 ¥${state.resources.cash}  公司 cashReserve ¥${company.cashReserve}`);
console.log(
  `           初始 runway = ${Number(company.monthsOfRunway).toFixed(2)} 月` +
    ` (${
      company.burnRate > 0
        ? ((company.cashReserve / (company.burnRate / 30)) * 1).toFixed(1)
        : "∞"
    } 天)`,
);
console.log(`           burnRate = ¥${company.burnRate}/月`);
console.log("");

// === 2. 建一个产品并开始开发 ===
// [第四轮修正] `registerStartup` 内部**已自动创建**初始 MVP 产品，只有它没建时才补。
//   原先无条件 createProduct → 公司 2 个产品，第二个永远卡 developing 却照付
//   DAILY_RD 日费 → 日支出虚高、上线被拖慢（报告 32.3）。
let product = null;
const _hasProduct = Array.isArray(company.products) && company.products.length > 0;
if (!_hasProduct && typeof createProduct === "function") {
  try {
    const cr = createProduct(state, "探针产品", "app");
    product = (cr && cr.product) || (company.products && company.products[0]);
  } catch (e) {
    console.log("  ⚠️ createProduct 抛错: " + e.message);
  }
}
if (!product && company.products) product = company.products[0];
if (!product) {
  console.log("  ❌ 无法创建产品，探针终止");
  process.exit(0);
}
console.log(`  [产品] 公司产品数=${company.products.length}（应为 1）「${product.name}」status=${product.status} progress=${product.developmentProgress || 0}`);
console.log("");

// === 3. 逐日推进：每天 tick 一次公司运营 + 开发一次 ===
console.log("  日  现金(reserve)  进度   状态");
console.log("  " + "-".repeat(48));

let launchedDay = -1;
let bankruptDay = -1;
let devCount = 0;

for (let d = 0; d < MAX_DAYS; d++) {
  // 每天先做一次开发（模拟玩家投入 AP）
  if (product.status === "developing" && typeof developProduct === "function") {
    try {
      developProduct(state, product.id, EFFORT);
      devCount++;
    } catch (e) {
      /* 忽略 */
    }
  }
  // 开发完成 → 上线
  if (product.status === "ready_to_launch" && launchedDay < 0) {
    if (typeof launchProduct === "function") {
      try {
        launchProduct(state, product.id);
      } catch (e) {
        /* 忽略 */
      }
    }
    if (product.status === "launched") launchedDay = d + 1;
  }

  // 推进公司每日运营（真实路径）
  state.player.day += 1;
  if (typeof tickStartup === "function" && state.startup.company) {
    try {
      tickStartup(state, "daily");
    } catch (e) {
      /* 忽略 */
    }
  }

  const co = state.startup.company;
  if (!co) {
    bankruptDay = d + 1;
    console.log(
      `  ${String(d + 1).padStart(3)}  —破产—        ${
        product.status === "launched" ? "已上线" : "未上线"
      }`,
    );
    break;
  }

  // 每 5 天或关键节点打印一次
  const progress = Math.round(product.developmentProgress || 0);
  if ((d + 1) % 5 === 0 || product.status === "launched") {
    console.log(
      `  ${String(d + 1).padStart(3)}  ¥${String(Math.round(co.cashReserve)).padStart(8)}  ${String(progress).padStart(3)}%  ${
        product.status === "launched" ? "✅已上线" : product.status
      }`,
    );
  }
  if (product.status === "launched" && launchedDay === d + 1) {
    console.log(`  → 产品于第 ${d + 1} 天上线（开发 ${devCount} 次）`);
    break;
  }
}

console.log("");
console.log("=".repeat(72));
const co2 = state.startup.company;
if (launchedDay > 0) {
  console.log(`  ✅ 产品在第 ${launchedDay} 天上线`);
  console.log(`     上线时公司现金: ¥${co2 ? Math.round(co2.cashReserve) : "已破产"}`);
  console.log(`     开发次数: ${devCount}`);
  // 继续跑 30 天看能否盈利
  let profitDays = 0;
  for (let k = 0; k < 30 && state.startup.company; k++) {
    state.player.day += 1;
    if (typeof tickStartup === "function") {
      try {
        tickStartup(state, "daily");
      } catch (e) {
        /* 忽略 */
      }
    }
    profitDays++;
  }
  const co3 = state.startup.company;
  console.log(
    `     上线后再跑 ${profitDays} 天: ${
      co3 ? "现金 ¥" + Math.round(co3.cashReserve) : "❌ 已破产"
    }`,
  );
} else if (bankruptDay > 0) {
  console.log(`  ❌ 第 ${bankruptDay} 天破产（产品进度 ${Math.round(product.developmentProgress || 0)}%）`);
  console.log(`     开发次数: ${devCount}`);
  console.log(`     → 玩家在做出产品前就破产了`);
} else {
  console.log(`  ⚠️ ${MAX_DAYS} 天内既未上线也未破产（进度 ${Math.round(product.developmentProgress || 0)}%）`);
}
console.log("=".repeat(72));
