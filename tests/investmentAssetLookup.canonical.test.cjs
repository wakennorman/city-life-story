// 阶段3批次13 — 投资标的配置查表纯函数 TS↔vanilla 双向比对
// 验证 src/app/core/investment/assetLookup.ts 与 src/js/phase2/investment.js 行为严格一致
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const esbuild = require("esbuild");
const os = require("os");

const ROOT = path.resolve(__dirname, "..");
const VANILLA_FILE = path.join(ROOT, "src/js/phase2/investment.js");
const TS_ENTRY = path.join(ROOT, "src/app/core/investment/assetLookup.ts");

let pass = 0, fail = 0;
const fails = [];
function eq(actual, expect, name) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expect);
  if (a === e) { pass++; }
  else { fail++; fails.push(`${name}\n  expected: ${e}\n  actual:   ${a}`); }
}

// ---- vanilla 端：vm 加载 investment.js（INV_STOCKS 与函数同文件同作用域）----
const vanillaSrc = fs.readFileSync(VANILLA_FILE, "utf8");
const ctx = {
  console,
  Math, JSON, Date, Array, Object, String, Number, Boolean,
  setTimeout, clearTimeout, parseInt, parseFloat, isNaN, RegExp,
};
vm.createContext(ctx);
vm.runInContext(vanillaSrc, ctx, { filename: VANILLA_FILE });
const V = ctx;
const INV_STOCKS = vm.runInContext("INV_STOCKS", ctx); // const 在脚本作用域内可求值取出
if (!Array.isArray(INV_STOCKS)) { console.error("FAIL: INV_STOCKS 未取到"); process.exit(1); }

// ---- TS 端：esbuild 转译后 require ----
const out = path.join(os.tmpdir(), `inv_asset_lookup_${Date.now()}.cjs`);
esbuild.buildSync({
  entryPoints: [TS_ENTRY],
  bundle: true,
  format: "cjs",
  platform: "node",
  outfile: out,
  logLevel: "silent",
});
const T = require(out);

// ---- 1) 每个真实标的：def / group 一致 ----
const realSymbols = INV_STOCKS.map((s) => s.symbol).filter(Boolean);
for (const sym of realSymbols) {
  const vDef = V.getInvestmentAssetDef(sym);
  const tDef = T.getInvestmentAssetDef(sym, INV_STOCKS);
  eq(
    vDef ? { symbol: vDef.symbol, category: vDef.category } : null,
    tDef ? { symbol: tDef.symbol, category: tDef.category } : null,
    `getInvestmentAssetDef(${JSON.stringify(sym)})`
  );
  const vGrp = V.getInvestmentAssetGroup(sym);
  const tGrp = T.getInvestmentAssetGroup(sym, INV_STOCKS);
  eq(vGrp, tGrp, `getInvestmentAssetGroup(${JSON.stringify(sym)})`);
}

// ---- 2) 不存在的 symbol：def null / group "other" ----
for (const sym of ["", "ZZZ999", "NON_EXISTENT_SYMBOL_XYZ"]) {
  const vDef = V.getInvestmentAssetDef(sym);
  const tDef = T.getInvestmentAssetDef(sym, INV_STOCKS);
  eq(vDef, tDef, `getInvestmentAssetDef(${JSON.stringify(sym)})`);
  const vGrp = V.getInvestmentAssetGroup(sym);
  const tGrp = T.getInvestmentAssetGroup(sym, INV_STOCKS);
  eq(vGrp, tGrp, `getInvestmentAssetGroup(${JSON.stringify(sym)})`);
}

// ---- 3) getInvestmentGroupLabel 各 key + 未知 key ----
const labelKeys = ["stocks", "crypto", "precious", "futures", "properties", "cars", "unknown_key", ""];
for (const k of labelKeys) {
  eq(V.getInvestmentGroupLabel(k), T.getInvestmentGroupLabel(k), `getInvestmentGroupLabel(${JSON.stringify(k)})`);
}

// ---- 汇总 ----
try { fs.unlinkSync(out); } catch (_) {}
console.log(`investmentAssetLookup canonical: ${pass} passed, ${fail} failed (覆盖 ${realSymbols.length} 真实标的)`);
if (fail > 0) {
  console.log("\n失败用例:\n" + fails.slice(0, 20).join("\n"));
  process.exit(1);
}
