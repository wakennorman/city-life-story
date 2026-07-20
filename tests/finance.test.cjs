/*
 * 核心财务逻辑 · 单元测试（阶段2安全网 · 模板）
 *
 * 设计：
 * - 用 Node vm 直接加载 legacy 经典脚本 src/js/core/finance.js，
 *   不修改任何游戏代码，也不引入运行时依赖。
 * - 只测“纯函数 / 给定 state 即确定性输出”的逻辑，作为团队单测范本。
 * - 运行：node tests/finance.test.cjs  （离线即可，无需 eslint/npm install）
 *
 * 后续扩展：为 settlement / state / save 等补同类测试，逐步建立重构安全网。
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// 加载被测模块（经典脚本，顶层只有声明，无副作用）
const code = fs.readFileSync(
  path.join(__dirname, "../src/js/core/finance.js"),
  "utf8"
);
const sandbox = { Math, JSON, console };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const { calculateAgeFactor, calculateDTIPenalty } = sandbox;

let pass = 0;
let fail = 0;
function check(actual, expected, name) {
  if (actual === expected) {
    pass++;
    console.log("  ok   " + name);
  } else {
    fail++;
    console.log(
      "  FAIL " + name + "  expected=" + expected + "  actual=" + actual
    );
  }
}

console.log("calculateAgeFactor:");
check(calculateAgeFactor(16), 0, "age<18  -> 0 (未成年拒贷)");
check(calculateAgeFactor(20), 0.7, "18<=age<23 -> 0.7");
check(calculateAgeFactor(30), 1.0, "23<=age<36 -> 1.0 (黄金年龄)");
check(calculateAgeFactor(40), 0.9, "36<=age<46 -> 0.9");
check(calculateAgeFactor(60), 0.7, "age>=46 -> 0.7");

console.log("calculateDTIPenalty:");
check(calculateDTIPenalty({ resources: {} }, 0), 0.05, "无收入 -> 0.05 (近拒贷)");
check(
  calculateDTIPenalty({ resources: { debt: 500 } }, 1000),
  1.0,
  "DTI=0.5 (<1) -> 1.0"
);
check(
  calculateDTIPenalty({ resources: { debt: 2000 } }, 1000),
  0.7,
  "DTI=2 (<3) -> 0.7"
);
check(
  calculateDTIPenalty({ resources: { debt: 4000 } }, 1000),
  0.4,
  "DTI=4 (<5) -> 0.4"
);
check(
  calculateDTIPenalty({ resources: { debt: 6000 } }, 1000),
  0.1,
  "DTI=6 (>=5) -> 0.1 (近拒贷)"
);

console.log("\nfinance unit: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
