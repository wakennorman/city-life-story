// 阶段3批次15 — 地点旅行 AP 消耗纯函数 TS↔vanilla 双向比对
// 验证 src/app/core/travel/travel.ts 的 getTravelApCost 与 src/js/data/locations.js 行为严格一致
// 覆盖全部分支：基础/富区互通/贫富跨区/驾驶技能减免/老周三轮车/天气倍率/保底5AP
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const esbuild = require("esbuild");
const os = require("os");

const ROOT = path.resolve(__dirname, "..");
const VANILLA_FILE = path.join(ROOT, "src/js/data/locations.js");
const TS_ENTRY = path.join(ROOT, "src/app/core/travel/apCost.ts");

let pass = 0, fail = 0;
const fails = [];
function eq(actual, expect, name) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expect);
  if (a === e) { pass++; }
  else { fail++; fails.push(`${name}\n  expected: ${e}\n  actual:   ${a}`); }
}

// ---- vanilla 端：vm 加载 locations.js（TRAVEL_GRAPH / LOCATIONS 与函数同文件同作用域）----
const vanillaSrc = fs.readFileSync(VANILLA_FILE, "utf8");
const ctx = {
  console,
  Math, JSON, Date, Array, Object, String, Number, Boolean,
  setTimeout, clearTimeout, parseInt, parseFloat, isNaN, RegExp,
  window: {},
};
vm.createContext(ctx);
vm.runInContext(vanillaSrc, ctx, { filename: VANILLA_FILE });
const V = ctx;
const TRAVEL_GRAPH = vm.runInContext("TRAVEL_GRAPH", ctx);
const LOCATIONS = vm.runInContext("LOCATIONS", ctx);
if (!TRAVEL_GRAPH || !LOCATIONS) { console.error("FAIL: TRAVEL_GRAPH/LOCATIONS 未取到"); process.exit(1); }

// ---- 向 vm 注入 getTravelApReduction / getWeatherTravelApMod（与 vanilla 同款实现）----
// vanilla getTravelApCost 以 typeof 守卫调用这两个可选依赖；单文件加载时它们不在作用域会跳过，
// 此处注入后可使两个分支在比对中真实生效，验证 TS 注入同款实现时完全等价。
vm.runInContext(`
function getTravelApReduction(drivingLevel) { return Math.min(5, Math.floor(drivingLevel / 20)); }
function getWeatherTravelApMod(state) {
  if (!state || !state.weather) return 1.0;
  var apModMap = { rainy:1.0, stormy:1.25, windy:1.05, snowy:1.5, foggy:1.3, heavy_smog:1.35, typhoon:2.0, sandstorm:1.5, cold_snap:1.15, plum_rain:1.1 };
  return apModMap[state.weather.current] || 1.0;
}
`, ctx);

// ---- TS 端：esbuild 转译后 require ----
const out = path.join(os.tmpdir(), `travel_apcost_${Date.now()}.cjs`);
esbuild.buildSync({
  entryPoints: [TS_ENTRY],
  bundle: true,
  format: "cjs",
  platform: "node",
  outfile: out,
  logLevel: "silent",
});
const T = require(out);

// 同款依赖注入 TS 端
const getTravelApReduction = (lvl) => Math.min(5, Math.floor(lvl / 20));
const getWeatherTravelApMod = (state) => {
  if (!state || !state.weather) return 1.0;
  const m = { rainy:1.0, stormy:1.25, windy:1.05, snowy:1.5, foggy:1.3, heavy_smog:1.35, typhoon:2.0, sandstorm:1.5, cold_snap:1.15, plum_rain:1.1 };
  return m[state.weather.current] || 1.0;
};

// ---- state 形状矩阵 ----
const states = [
  undefined,
  null,
  {},
  { skills: {} },
  { skills: { driving: { level: 0 } } },
  { skills: { driving: { level: 15 } } },  // floor(15/20)=0
  { skills: { driving: { level: 40 } } },  // floor(40/20)=2
  { skills: { driving: { level: 100 } } }, // min(5,5)=5
  { skills: { driving: {} } },             // level undefined -> 0
  { flags: { oldZhouTricycle: true } },
  { skills: { driving: { level: 40 } }, flags: { oldZhouTricycle: true } },
  { weather: { current: "stormy" } },      // 1.25
  { weather: { current: "rainy" } },       // 1.0
  { weather: { current: "typhoon" } },     // 2.0
  { weather: { current: "foggy" } },       // 1.3
  { weather: { current: "unknown_w" } },   // 1.0 fallback
  { skills: { driving: { level: 40 } }, weather: { current: "foggy" } },
  { skills: { driving: { level: 40 } }, flags: { oldZhouTricycle: true }, weather: { current: "typhoon" } },
];

function runOver(pairs) {
  for (const [a, b] of pairs) {
    for (const st of states) {
      const vk = V.getTravelApCost(a, b, st);
      const tk = T.getTravelApCost(a, b, st, TRAVEL_GRAPH, LOCATIONS, getTravelApReduction, getWeatherTravelApMod);
      eq(vk, tk, `getTravelApCost(${a},${b},${JSON.stringify(st)})`);
    }
  }
}

// 全地点两两 + 异常 key
const keys = Object.keys(LOCATIONS);
const normalPairs = [];
for (const a of keys) for (const b of keys) normalPairs.push([a, b]);
const weirdPairs = [["nowhere","slum"],["slum","zzz"],["","slum"],["slum",""],["zzz","qqq"],["",""],["slum","slum"]];
runOver(normalPairs);
runOver(weirdPairs);

// ---- 汇总 ----
try { fs.unlinkSync(out); } catch (_) {}
console.log(`travelApCost canonical: ${pass} passed, ${fail} failed (覆盖 ${keys.length}×${keys.length} 对 + ${weirdPairs.length} 异常对，各 × ${states.length} 状态)`);
if (fail > 0) {
  console.log("\n失败用例:\n" + fails.slice(0, 20).join("\n"));
  process.exit(1);
}
