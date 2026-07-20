/*
 * 难度分层系统 · TS↔vanilla 双向保真测试（阶段3 批次2）
 *
 * 设计（比 finance 试点更严格）：
 * - 用本地 esbuild 把 src/app/core/difficulty/difficultySelectors.ts 转译为 CJS 断言（TS 端口）
 * - 用 vm 加载「正在运行的」vanilla src/js/core/difficulty_system.js（挂 window 桩）断言（ vanilla 运行时）
 * - 对每一档难度、每一个乘数 key 做 TS 输出 vs vanilla 输出逐项比对，
 *   任一偏差即判定端口与运行时行为不等价 —— 这是「迁移不破坏游戏」的硬证据。
 *
 * 运行：node tests/difficulty.canonical.test.cjs   （离线，无需联网/eslint）
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const vm = require("vm");

let esbuild;
try {
  esbuild = require("esbuild");
} catch (e) {
  console.error("SKIP: esbuild 未安装（需 npm install -D esbuild），无法转译 TS 规范源。");
  process.exit(0);
}

// ===== 1) TS 规范源端口（bundle 以解析相对 import）=====
const tsPath = path.join(__dirname, "../src/app/core/difficulty/difficultySelectors.ts");
const buildResult = esbuild.buildSync({
  entryPoints: [tsPath],
  bundle: true,
  format: "cjs",
  platform: "node",
  write: false,
});
const tmpFile = path.join(os.tmpdir(), "cls_diff_" + Date.now() + ".cjs");
fs.writeFileSync(tmpFile, buildResult.outputFiles[0].text);
const ts = require(tmpFile);
fs.unlinkSync(tmpFile);

// ===== 2) vanilla 运行时（vm 加载，挂 window/document 桩）=====
const vanillaPath = path.join(__dirname, "../src/js/core/difficulty_system.js");
const vanillaSrc = fs.readFileSync(vanillaPath, "utf8");
const sandbox = {
  window: {},
  document: { querySelectorAll: () => [] },
  console,
};
vm.createContext(sandbox);
vm.runInContext(vanillaSrc, sandbox);
const vanilla = sandbox.window;

if (
  typeof vanilla.getDifficultyConfig !== "function" ||
  typeof vanilla.getDifficultyMultiplier !== "function"
) {
  console.error("FAIL: vanilla difficulty_system.js 未挂出预期 window 函数（加载异常）");
  process.exit(1);
}

let pass = 0;
let fail = 0;
function check(actual, expected, name) {
  if (actual === expected) {
    pass++;
    console.log("  ok   " + name);
  } else {
    fail++;
    console.log("  FAIL " + name + "  expected=" + JSON.stringify(expected) + "  actual=" + JSON.stringify(actual));
  }
}

const LEVELS = ["easy", "normal", "hard", "hell"];
const KEYS = ["eventPenalty", "needsDecay", "wealthTaxProb", "dailyInterest", "wage", "price", "illness"];
const BOGUS = ["", "bogus", null, undefined, {}, { _difficulty: "nope" }];

console.log("[TS↔vanilla] getDifficultyConfig.level 一致性:");
for (const lvl of LEVELS) {
  const t = ts.getDifficultyConfig(lvl).level;
  const v = vanilla.getDifficultyConfig(lvl).level;
  check(t, v, "level=" + lvl + " -> " + v);
}
// 非法 level 回退到 normal
for (const b of BOGUS) {
  const t = ts.getDifficultyConfig(b).level;
  const v = vanilla.getDifficultyConfig(b).level;
  check(t, v, "非法 level(" + JSON.stringify(b) + ") -> " + v);
}

console.log("[TS↔vanilla] DIFFICULTY_LEVELS 配置表逐字段一致性:");
const CFG_FIELDS = [
  "dailyInterestBase", "wealthTaxProbability", "eventPenaltyMultiplier",
  "needsDecayMultiplier", "wageMultiplier", "priceMultiplier",
  "illnessRateMultiplier", "startingCashBonus", "name", "icon",
];
for (const lvl of LEVELS) {
  const t = ts.getDifficultyConfig(lvl);
  const v = vanilla.getDifficultyConfig(lvl);
  for (const f of CFG_FIELDS) {
    check(t[f], v[f], lvl + "." + f + " = " + v[f]);
  }
}

console.log("[TS↔vanilla] getDifficultyMultiplier 全矩阵一致性:");
for (const lvl of LEVELS) {
  for (const key of KEYS) {
    const t = ts.getDifficultyMultiplier({ _difficulty: lvl }, key);
    const v = vanilla.getDifficultyMultiplier({ _difficulty: lvl }, key);
    check(t, v, lvl + "/" + key + " = " + v);
  }
}
// 空 state / 非法 _difficulty 都回退 normal 乘数
for (const b of BOGUS) {
  for (const key of KEYS) {
    const t = ts.getDifficultyMultiplier(b, key);
    const v = vanilla.getDifficultyMultiplier(b, key);
    check(t, v, "state=" + JSON.stringify(b) + "/" + key + " = " + v);
  }
}

console.log("\ndifficulty canonical (TS↔vanilla) unit: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
