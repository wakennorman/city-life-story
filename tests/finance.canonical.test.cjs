/*
 * 核心财务逻辑 · TS 规范源单元测试（阶段3迁移试点 · 安全网覆盖）
 *
 * 设计：
 * - 用本地已装的 esbuild 把 src/app/core/finance/factors.ts 转译为 CJS，
 *   再 require 进来断言（离线即可，无需 eslint/npm install/联网）。
 * - 断言 EXPECTED 为「独立给定值」，与 vanilla 基线（tests/finance.test.cjs）
 *   保持一致的期望值 —— 以此证明 TS 端口与旧实现行为等价，且各自独立可测。
 * - 运行：node tests/finance.canonical.test.cjs
 *
 * 运行前提：node_modules/esbuild 存在（已在 devDependencies，CI 与本地均装）。
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

let esbuild;
try {
  esbuild = require("esbuild");
} catch (e) {
  console.error("SKIP: esbuild 未安装（需 npm install -D esbuild），无法转译 TS 规范源。");
  process.exit(0);
}

const tsPath = path.join(__dirname, "../src/app/core/finance/factors.ts");
const tsSrc = fs.readFileSync(tsPath, "utf8");
const out = esbuild.transformSync(tsSrc, { loader: "ts", format: "cjs" });

const tmpFile = path.join(os.tmpdir(), "cls_factors_" + Date.now() + ".cjs");
fs.writeFileSync(tmpFile, out.code);
const factors = require(tmpFile);
fs.unlinkSync(tmpFile);

const { calculateAgeFactor, calculateDTIPenalty, calculateCreditHistoryFactor, calculateAssetBonus, calculateStabilityMultiplier } = factors;

let pass = 0;
let fail = 0;
function check(actual, expected, name) {
  if (actual === expected) {
    pass++;
    console.log("  ok   " + name);
  } else {
    fail++;
    console.log("  FAIL " + name + "  expected=" + expected + "  actual=" + actual);
  }
}

console.log("calculateAgeFactor (TS规范源):");
check(calculateAgeFactor(16), 0, "age<18  -> 0 (未成年拒贷)");
check(calculateAgeFactor(20), 0.7, "18<=age<23 -> 0.7");
check(calculateAgeFactor(30), 1.0, "23<=age<36 -> 1.0 (黄金年龄)");
check(calculateAgeFactor(40), 0.9, "36<=age<46 -> 0.9");
check(calculateAgeFactor(60), 0.7, "age>=46 -> 0.7");

console.log("calculateDTIPenalty (TS规范源):");
check(calculateDTIPenalty({ resources: {} }, 0), 0.05, "无收入 -> 0.05 (近拒贷)");
check(calculateDTIPenalty({ resources: { debt: 500 } }, 1000), 1.0, "DTI=0.5 (<1) -> 1.0");
check(calculateDTIPenalty({ resources: { debt: 2000 } }, 1000), 0.7, "DTI=2 (<3) -> 0.7");
check(calculateDTIPenalty({ resources: { debt: 4000 } }, 1000), 0.4, "DTI=4 (<5) -> 0.4");
check(calculateDTIPenalty({ resources: { debt: 6000 } }, 1000), 0.1, "DTI=6 (>=5) -> 0.1 (近拒贷)");

console.log("calculateCreditHistoryFactor (TS规范源):");
check(calculateCreditHistoryFactor({ resources: {} }), 1.0, "无记录 -> 1.0 (中性)");
check(
  calculateCreditHistoryFactor({ resources: { bankCreditHistory: [{ repaid: true, rating: "good" }] } }),
  1.1,
  "全良好 -> 1.1"
);
check(
  calculateCreditHistoryFactor({
    resources: {
      bankCreditHistory: [
        { repaid: true, rating: "good" },
        { repaid: false, rating: "bad" },
      ],
    },
  }),
  1.0,
  "1良1坏(goodRatio=0.5) -> 1.0 (中性，命中 >=0.5 分支)"
);
check(
  calculateCreditHistoryFactor({
    resources: {
      bankCreditHistory: [
        { repaid: true, rating: "good" },
        { repaid: false, rating: "bad" },
        { repaid: false, rating: "bad" },
        { repaid: false, rating: "bad" },
      ],
    },
  }),
  0.8,
  "1良3坏(goodRatio=0.25, 不良占优) -> 0.8 (有不良)"
);

console.log("calculateAssetBonus (TS规范源):");
check(calculateAssetBonus({ resources: {}, investment: {} }), 0, "无资产 -> 0");
check(
  calculateAssetBonus({
    resources: { bankBalance: 20000 },
    investment: { properties: [{ currentPrice: 100000 }], cars: [{ currentPrice: 50000 }] },
  }),
  100000 * 0.05 + 50000 * 0.02 + 5000,
  "房产5%+车2%+存款>1万+5000"
);

console.log("calculateStabilityMultiplier (TS规范源):");
check(calculateStabilityMultiplier({ player: { phase: "street" } }), 0.3, "街头无业 -> 0.3");
check(
  calculateStabilityMultiplier({ player: { phase: "street" }, flags: { hasStreetStall: true } }),
  0.5,
  "街头有摊 -> 0.5"
);
check(calculateStabilityMultiplier({ player: { phase: "corporate", corpYear: 3 } }), 1.0, "职场≥2年 -> 1.0");
check(
  calculateStabilityMultiplier({ player: { phase: "corporate", corpYear: 0.2 }, corporate: { rank: "P7" } }),
  Math.min(1.1, 0.6 + 0.1),
  "职场P7刚入职 -> 0.7"
);
check(calculateStabilityMultiplier({}), 0.3, "未知阶段 -> 0.3");

console.log("\nfinance canonical (TS) unit: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
