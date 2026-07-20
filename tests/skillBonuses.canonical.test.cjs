/**
 * 技能加成纯函数 —— TS 规范源 ↔ 运行中 vanilla 双向比对
 *
 * 与 batch1/finance、batch2/difficulty 同模式：
 *   (1) 用本地 esbuild(bundle) 把 src/app TS 端口打进 CJS 后加载
 *   (2) 用 vm 加载 src/js/phase1/skill_bonuses.js 运行时
 *   (3) 对每个函数 × 多档等级，比对 TS 输出 == vanilla 输出（epsilon 容差）
 * 任一偏差即判"端口不等价"，强制暴露迁移回归。
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const vm = require("vm");
const esbuild = require("esbuild");

const EPS = 1e-9;
let passed = 0;
let failed = 0;
function check(name, tsVal, vanillaVal) {
  const ok = Math.abs(tsVal - vanillaVal) < EPS;
  if (ok) {
    passed++;
  } else {
    failed++;
    console.error(`  ✗ ${name}: TS=${tsVal}  vanilla=${vanillaVal}`);
  }
}

// ===== 1) TS 规范源端口（bundle 含相对依赖） =====
const tsEntry = path.join(__dirname, "../src/app/core/skills/skillBonuses.ts");
const bundleOut = esbuild.buildSync({
  entryPoints: [tsEntry],
  bundle: true,
  format: "cjs",
  platform: "node",
  write: false,
});
const tmpTs = path.join(os.tmpdir(), "cls_skill_" + Date.now() + ".cjs");
fs.writeFileSync(tmpTs, bundleOut.outputFiles[0].text);
const ts = require(tmpTs);
fs.unlinkSync(tmpTs);

// ===== 2) vanilla 运行时（vm 加载，提取全局函数） =====
const vanillaPath = path.join(__dirname, "../src/js/phase1/skill_bonuses.js");
const vanillaSrc = fs.readFileSync(vanillaPath, "utf8");
const ctx = { Math, console, module: { exports: {} }, exports: {}, window: {} };
vm.createContext(ctx);
vm.runInContext(vanillaSrc, ctx);

// ===== 3) 双向比对 =====
const fns = [
  "getCookingDiscount",
  "getTravelApReduction",
  "getTutoringBonus",
  "getBankRateBonus",
  "getFactoryBonus",
  "getConstructionBonus",
  "getCorpAbilityBonus",
  "getCorpUpwardBonus",
  "getRepairBonus",
  "getSalesTradeDiscount",
  "getSalesTradePremium",
];
// 覆盖边界：倍数点(10/20)、封顶点(100)、越界(150/200)、跨边界(9/11/19/21/49/51/69/71/99)
const levels = [0, 1, 5, 9, 10, 11, 19, 20, 21, 29, 30, 49, 50, 51, 69, 70, 71, 99, 100, 150, 200];

for (const fn of fns) {
  const tsFn = ts[fn];
  const vanillaFn = ctx[fn];
  if (typeof tsFn !== "function" || typeof vanillaFn !== "function") {
    failed++;
    console.error(`  ✗ ${fn}: 函数缺失 (ts=${typeof tsFn}, vanilla=${typeof vanillaFn})`);
    continue;
  }
  for (const lv of levels) {
    check(`${fn}(${lv})`, tsFn(lv), vanillaFn(lv));
  }
}

// ===== 结果 =====
const total = passed + failed;
console.log(`技能加成 TS↔vanilla 比对: ${passed}/${total} 通过`);
if (failed > 0) {
  console.error(`❌ ${failed} 项不等价`);
  process.exit(1);
} else {
  console.log("✅ 全部等价");
}
