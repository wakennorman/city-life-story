#!/usr/bin/env node
/**
 * probe-startup-breakdown.cjs — 拆解创业期每日现金流，找出真正的烧钱项
 *
 * 动机：probe-startup-survival.cjs 显示第 18 天破产，但手算预期余量 19%，
 *   说明有未计入的支出项。
 *
 * 用法：node scripts/probe-startup-breakdown.cjs
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

const ok = runner.init({ strict: false });
if (!ok) { console.error("引擎加载失败"); process.exit(0); }

let state = runner.createState({ seed: 20260916, scenario: "classic" });
state.player.day = 61;
state.resources.cash = 15000;
state.player.phase = "corporate";
state.skills = state.skills || {};
["coding", "english", "writing"].forEach((k) => { state.skills[k] = { level: 16, xp: 0 }; });
if (!state.relationships) state.relationships = {};
["npc_a", "npc_b", "npc_c"].forEach((id) => {
  if (!state.relationships[id]) state.relationships[id] = { affinity: 50, met: true, discovered: {} };
});
Object.keys(state.relationships).slice(0, 3).forEach((id) => {
  state.relationships[id].affinity = Math.max(50, state.relationships[id].affinity || 0);
  state.relationships[id].met = true;
});

const reg = registerStartup(state, "拆解公司", INDUSTRY, "");
const company = state.startup && state.startup.company;
console.log("注册结果:", reg && reg.success, "| cashReserve:", company && company.cashReserve);

// [第四轮修正] `registerStartup` 内部已自动创建初始 MVP 产品，不要再无条件建一个
//   （否则公司有 2 个产品，第二个永远卡 developing 却照付 DAILY_RD 日费）。
if (!Array.isArray(company.products) || company.products.length === 0) {
  createProduct(state, "拆解产品", "app");
}
const product = company.products[0];
console.log("公司产品数:", company.products.length, "（应为 1）");

// 读一次 tick 内部各项：手工复制 tickStartup 的支出口径做对照
function snapshot(label) {
  const co = state.startup.company;
  if (!co) { console.log(label, "— 公司已不存在"); return; }
  console.log(
    label,
    "reserve=¥" + Math.round(co.cashReserve),
    "revenue=¥" + Math.round(co.revenue || 0),
    "expenses=¥" + Math.round(co.expenses || 0),
    "burnRate=¥" + Math.round(co.burnRate || 0) + "/月",
  );
}

console.log("\n--- 逐日 ---");
for (let d = 1; d <= 25; d++) {
  if (product.status === "developing") {
    try { developProduct(state, product.id, EFFORT); } catch (e) {}
  }
  state.player.day += 1;
  try { tickStartup(state, "daily"); } catch (e) { console.log("tick 抛错:", e.message); }
  if (!state.startup.company) { console.log(`第 ${d} 天 — 破产`); break; }
  if (d <= 3 || d % 5 === 0) {
    const co = state.startup.company;
    snapshot(`第 ${String(d).padStart(2)} 天:`);
    if (d === 2) {
      // 打印支出明细（用 tick 里同样的公式重算）
      console.log("       支出口径重算:");
      console.log("         租金 DAILY_RENT_BASE 180 ×1 = 180");
      console.log("         研发 DAILY_RD 180 × 开发中产品 1 = 180");
      console.log("         水电 50 × corpCostMod");
      console.log("         已减免: 营销/合规/杂项（_preLaunch）");
      console.log("         → 预期 ≈ 410/天，实测 expenses =", Math.round(co.expenses));
      console.log("         开发成本另计: 200 × effort=" + EFFORT + " = " + 200 * EFFORT + "/次");
    }
  }
}
