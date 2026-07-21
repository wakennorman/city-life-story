// 阶段3批次14 — 地点旅行纯函数 TS↔vanilla 双向比对
// 验证 src/app/core/travel/travel.ts 与 src/js/data/locations.js 行为严格一致
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const esbuild = require("esbuild");
const os = require("os");

const ROOT = path.resolve(__dirname, "..");
const VANILLA_FILE = path.join(ROOT, "src/js/data/locations.js");
const TS_ENTRY = path.join(ROOT, "src/app/core/travel/travel.ts");

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

// ---- TS 端：esbuild 转译后 require ----
const out = path.join(os.tmpdir(), `travel_hops_${Date.now()}.cjs`);
esbuild.buildSync({
  entryPoints: [TS_ENTRY],
  bundle: true,
  format: "cjs",
  platform: "node",
  outfile: out,
  logLevel: "silent",
});
const T = require(out);

// ---- 1) 全地点两两组合：hops / taxi 一致 ----
const keys = Object.keys(LOCATIONS);
for (const a of keys) {
  for (const b of keys) {
    eq(V.getLocationHops(a, b), T.getLocationHops(a, b, TRAVEL_GRAPH, LOCATIONS), `getLocationHops(${a},${b})`);
    eq(V.getTaxiCost(a, b), T.getTaxiCost(a, b, TRAVEL_GRAPH, LOCATIONS), `getTaxiCost(${a},${b})`);
  }
}

// ---- 2) 不存在 / 不可达 key：hops=99 / taxi=35，或同地=0 ----
const weird = [
  ["nowhere", "slum"], ["slum", "zzz"], ["", "slum"], ["slum", ""],
  ["zzz", "qqq"], ["", ""],
];
for (const [a, b] of weird) {
  eq(V.getLocationHops(a, b), T.getLocationHops(a, b, TRAVEL_GRAPH, LOCATIONS), `getLocationHops(${a},${b})`);
  eq(V.getTaxiCost(a, b), T.getTaxiCost(a, b, TRAVEL_GRAPH, LOCATIONS), `getTaxiCost(${a},${b})`);
}

// ---- 汇总 ----
try { fs.unlinkSync(out); } catch (_) {}
console.log(`travelHops canonical: ${pass} passed, ${fail} failed (覆盖 ${keys.length} 地点 × ${keys.length} 对 + ${weird.length} 异常对)`);
if (fail > 0) {
  console.log("\n失败用例:\n" + fails.slice(0, 20).join("\n"));
  process.exit(1);
}
