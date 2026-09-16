#!/usr/bin/env node
/**
 * probe-post-launch.cjs — 诊断「产品上线后为何持续亏损」（报告 29.6 节）
 *
 * 目的：把收入公式逐项拆开，找出到底哪一项在压制收入，
 *   以及"要多少收入才能打平"。
 *
 * 收入公式（src/js/phase2/startup.js:2547~2555，第三轮修复后）：
 *   product.revenue = DAILY_BASE_REVENUE(480)
 *                   × scoreMod       = (techMod + marketMod) / 2   ← 原为 techMod × marketMod
 *                   × industryMod    = avgBurnRate / 50000
 *                   × growthMod      = 1 + (revenue>0 ? 0.001 : 0)
 *                   × heatMod        = 1 + (sectorHeat-1)*0.5
 *                   × Random[0.9, 1.2]
 *
 * 用法：
 *   node scripts/probe-post-launch.cjs
 *   node scripts/probe-post-launch.cjs --industry finance --effort 1
 *   node scripts/probe-post-launch.cjs --sales 12   # 加练 sales 技能看效果
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
const EFFORT = argNum("effort", 1);
const SALES_LV = argNum("sales", 0);
const CODING_LV = argNum("coding", 16);
const MAX_DEV = argNum("maxdev", 200);

const ok = runner.init({ strict: false });
if (!ok) { console.error("引擎加载失败"); process.exit(0); }

const Random = globalThis.Random;
const StateManager = globalThis.StateManager;

/** 建一局满足创业条件的游戏 */
function buildGame(seed) {
  const state = runner.createState({ seed: seed, scenario: "classic" });
  state.player.day = 61;
  state.resources.cash = 15000;
  state.player.phase = "corporate";
  state.skills = state.skills || {};
  state.skills.coding = { level: CODING_LV, xp: 0 };
  state.skills.english = { level: 16, xp: 0 };
  if (SALES_LV > 0) state.skills.sales = { level: SALES_LV, xp: 0 };
  // 社交门：直接给两位 NPC 好感 50（等价于"已经拜访够"）
  if (!state.relationships) state.relationships = {};
  ["aunt_wang", "old_zhou"].forEach((id) => {
    state.relationships[id] = { affinity: 50, met: true, discovered: {} };
  });
  return state;
}

console.log("=".repeat(74));
console.log("  上线后经济诊断 — 收入为何盖不住支出");
console.log("=".repeat(74));
console.log(`  行业: ${INDUSTRY}   effort=${EFFORT}   coding=${CODING_LV}   sales=${SALES_LV}`);

const state = buildGame(20260916);

// ---- 1. 注册 + 开发到上线 ----
const reg = registerStartup(state, "诊断公司", INDUSTRY, "");
if (!reg || !reg.success) {
  console.log("  ❌ 注册失败: " + (reg && reg.message));
  process.exit(0);
}
const company = state.startup.company;
// [第四轮修正] 不要无条件 createProduct —— `registerStartup` 内部**已自动创建**
//   一个初始 MVP 产品（startup.js:690~705，status="developing"）。原先这里又建
//   一个 → 公司有 2 个产品，而下面的开发循环只推进 products[0]，第二个永远卡在
//   developing 却照付 DAILY_RD 日费 → 日支出虚高、上线被拖慢（报告 32.3）。
if (!Array.isArray(company.products) || company.products.length === 0) {
  createProduct(state, "诊断产品", "app");
}
const product = company.products[0];
console.log(`  [诊断] 公司产品数 = ${company.products.length}（应为 1）`);

let devCount = 0;
while (product.status === "developing" && devCount < MAX_DEV) {
  try { developProduct(state, product.id, EFFORT); } catch (e) { break; }
  devCount++;
  state.player.day += 1;
  tickStartup(state, "daily");
  if (!state.startup.company) break;
}
if (product.status === "ready_to_launch") launchProduct(state, product.id);

const co = state.startup.company;
if (!co) { console.log("  ❌ 开发期就破产了"); process.exit(0); }
console.log(`\n  【上线】第 ${state.player.day} 天，开发 ${devCount} 次`);
console.log(`         公司现金 ¥${Math.round(co.cashReserve)}`);
console.log(`         techScore=${product.technologyScore}  marketScore=${product.marketScore}`);

// ---- 2. 逐项拆解收入公式 ----
const DAILY_BASE_REVENUE = 480; // 第三轮修复：180 → 480
let industryMod = 1;
try {
  // [第四轮修复] 优先读显式的 revenueMultiplier；兜底保留旧的 avgBurnRate/50000 算式
  const rm = vmRun(`STARTUP_INDUSTRIES["${INDUSTRY}"].revenueMultiplier`);
  if (typeof rm === "number" && isFinite(rm)) {
    industryMod = rm;
  } else {
    const av = vmRun(`STARTUP_INDUSTRIES["${INDUSTRY}"].avgBurnRate`);
    industryMod = av / 50000;
  }
} catch (e) { /* ignore */ }
let sectorHeat = 1.0;
if (typeof getSectorHeat === "function") {
  try { sectorHeat = getSectorHeat(INDUSTRY); } catch (e) {}
}

const techMod = product.technologyScore / 100;
const marketMod = product.marketScore / 100;
// [第三轮修复] 乘法 → 取平均（与 src 保持一致）
const scoreMod = (techMod + marketMod) / 2;
const growthMod = 1 + 0.001;
const heatMod = 1 + (sectorHeat - 1.0) * 0.5;

console.log("\n  【收入公式逐项拆解】");
console.log(`    DAILY_BASE_REVENUE     ${DAILY_BASE_REVENUE}`);
console.log(`    techMod                ${techMod.toFixed(3)}   (technologyScore ${product.technologyScore}/100)`);
console.log(`    marketMod              ${marketMod.toFixed(3)}   (marketScore ${product.marketScore}/100)`);
console.log(`  → scoreMod (取平均)      ${scoreMod.toFixed(3)}   ← 第三轮修复：原为 techMod×marketMod=${(techMod * marketMod).toFixed(3)}`);
console.log(`  × industryMod          ${industryMod.toFixed(3)}   (revenueMultiplier)`);
console.log(`  × growthMod            ${growthMod.toFixed(4)}`);
console.log(`  × heatMod              ${heatMod.toFixed(4)}   (sectorHeat ${sectorHeat.toFixed(3)})`);
console.log(`  × Random[0.9,1.2]      1.000   (取中值)`);
const expected =
  DAILY_BASE_REVENUE * scoreMod * industryMod * growthMod * heatMod;
console.log(`  ${"─".repeat(58)}`);
console.log(`  = 期望日收入           ¥${expected.toFixed(1)}`);

/** 用 vm 读游戏里的全局常量（headless 里 const 不在 global 上） */
function vmRun(expr) {
  const vm = require("vm");
  return vm.runInThisContext("(function(){" + "try{return " + expr + ";}catch(e){return undefined;}" + "})()");
}

// ---- 3. 实测 20 天 ----
console.log("\n  【实测 20 天】");
console.log("    日   收入   支出    净    现金");
console.log("    " + "-".repeat(46));
let revSum = 0, expSum = 0, n = 0;
for (let d = 1; d <= 20; d++) {
  state.player.day += 1;
  tickStartup(state, "daily");
  const c = state.startup.company;
  if (!c) { console.log(`    D+${String(d).padStart(2)}  — 破产 —`); break; }
  const rev = Math.round(c.revenue || 0), exp = Math.round(c.expenses || 0);
  revSum += rev; expSum += exp; n++;
  if (d <= 5 || d % 5 === 0) {
    console.log(
      `    D+${String(d).padStart(2)}  ¥${String(rev).padStart(5)}  ¥${String(exp).padStart(5)}  ` +
      `${String(rev - exp).padStart(6)}  ¥${String(Math.round(c.cashReserve)).padStart(7)}`
    );
  }
}
if (n > 0) {
  const netAvg = (revSum - expSum) / n;
  console.log(
    `\n    均值: 日收入 ¥${(revSum / n).toFixed(1)}  日支出 ¥${(expSum / n).toFixed(1)}  ` +
    `日${netAvg >= 0 ? "盈" : "亏"} ¥${Math.abs(netAvg).toFixed(1)}`
  );
}

// ---- 4. 打平需要多少 ----
console.log("\n  【打平分析】");
const c2 = state.startup.company;
if (c2) {
  const exp = expSum / n;
  const rev = revSum / n;
  const neededMult = exp / rev;
  console.log(`    当前日支出 ¥${exp.toFixed(1)}，日收入 ¥${rev.toFixed(1)}`);
  if (neededMult >= 1) {
    console.log(`    ⚠️ 未打平：收入需再涨 ${((neededMult - 1) * 100).toFixed(0)}%（×${neededMult.toFixed(2)}）`);
    console.log(`    → marketMod 需从 ${marketMod.toFixed(3)} 提升到 ${(marketMod * neededMult).toFixed(3)}`);
    console.log(`       （等价 marketScore ${product.marketScore} → ${Math.min(100, Math.round(product.marketScore * neededMult))}）`);
    console.log(`    → 或 DAILY_BASE_REVENUE ${DAILY_BASE_REVENUE} → ${Math.round(DAILY_BASE_REVENUE * neededMult)}`);
  } else {
    console.log(`    ✅ 已打平，安全边际 ${((1 - neededMult) * 100).toFixed(0)}%（支出仅为收入的 ×${neededMult.toFixed(2)}）`);
    console.log(`    → 收入余量：可承受收入下滑 ${((1 - neededMult) * 100).toFixed(0)}% 才回到盈亏平衡`);
    console.log(`    → 等价 marketMod 从 ${marketMod.toFixed(3)} 掉到 ${(marketMod * neededMult).toFixed(3)} 才会亏损`);
  }
}

// ---- 5. 收入随时间的趋势（产品生命周期） ----
console.log("\n  【继续跑 60 天，看收入是否自然增长】");
for (let d = 21; d <= 80; d++) {
  state.player.day += 1;
  tickStartup(state, "daily");
  const c = state.startup.company;
  if (!c) { console.log(`    D+${d}  — 破产 —`); break; }
  if (d % 10 === 0) {
    console.log(
      `    D+${String(d).padStart(2)}  收入¥${String(Math.round(c.revenue || 0)).padStart(5)}  ` +
      `支出¥${String(Math.round(c.expenses || 0)).padStart(5)}  ` +
      `现金¥${String(Math.round(c.cashReserve)).padStart(7)}  ` +
      `阶段=${product.lifecycleStage || "-"}  用户=${product.users || 0}`
    );
  }
}
console.log("=".repeat(74));
