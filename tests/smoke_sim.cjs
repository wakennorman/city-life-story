/**
 * smoke_sim.cjs — 单种子冒烟模拟（P0-4）
 *
 * 用固定种子跑 300 天 advanceDay，断言全程结构有效：
 *   - 不抛未捕获异常
 *   - day 单调递增
 *   - health ∈ [0,100]（或已 gameOver）
 *   - cash / bankBalance / needs.* 均为有限数（非 NaN/Infinity）
 * gameOver（正常死亡结局）不算失败——只要它是「干净地结束」而非崩溃。
 *
 * 这是最轻量的行为回归：语法检查过不了的 bug node --check 能抓；语法正确但
 * 一跑就 NaN/崩溃的 bug 只有真跑一遍才现形。
 */

const runner = require("./headless_runner.cjs");

var SEED = 12345;
var DAYS = 300;
var failures = [];
function fail(msg) {
  failures.push(msg);
}

function isFiniteNum(x) {
  return typeof x === "number" && isFinite(x);
}

runner.init({ strict: false });

var loadErrors = runner.getLoadErrors();
if (loadErrors.length > 0) {
  // 加载错误不直接判死（events_integrity 已专门覆盖），但打印以便定位
  console.warn("[smoke] 加载错误 " + loadErrors.length + " 项（详见 events_integrity）");
}

var state = runner.createState({ seed: SEED, scenario: "classic" });
if (!state) {
  console.error("❌ createState 返回 null——无法启动冒烟模拟");
  process.exit(1);
}

var strategy = runner.getStrategy("balanced");
var prevDay = state.player.day;
var survivedDays = 0;
var endedReason = null;

for (var d = 0; d < DAYS; d++) {
  var alive;
  try {
    alive = runner.advanceDay(state, strategy);
  } catch (err) {
    fail("Day " + state.player.day + " advanceDay 抛异常: " + err.message);
    break;
  }

  // 结构不变式（每天都查）
  var m;
  try {
    m = runner.getMetrics(state);
  } catch (e) {
    fail("Day " + state.player.day + " getMetrics 抛异常: " + e.message);
    break;
  }

  if (!isFiniteNum(m.cash)) fail("Day " + m.day + " cash 非有限数: " + m.cash);
  if (!isFiniteNum(m.bankBalance)) fail("Day " + m.day + " bankBalance 非有限数: " + m.bankBalance);
  if (!isFiniteNum(m.health)) fail("Day " + m.day + " health 非有限数: " + m.health);
  if (isFiniteNum(m.health) && (m.health < 0 || m.health > 100)) {
    fail("Day " + m.day + " health 越界 [0,100]: " + m.health);
  }
  var needs = m.needs || {};
  var nk = ["hunger", "fatigue", "hygiene", "happiness"];
  for (var i = 0; i < nk.length; i++) {
    if (!isFiniteNum(needs[nk[i]])) {
      fail("Day " + m.day + " needs." + nk[i] + " 非有限数: " + needs[nk[i]]);
    }
  }

  // day 单调递增（advanceDay 存活时应 +1）
  if (alive && state.player.day <= prevDay) {
    fail("Day 未递增: prev=" + prevDay + " now=" + state.player.day);
  }
  prevDay = state.player.day;
  survivedDays = d + 1;

  if (!alive) {
    endedReason = state.flags && state.flags.gameOverReason ? state.flags.gameOverReason : "gameOver";
    break;
  }
}

console.log("\n💨 单种子冒烟模拟 (seed=" + SEED + ", 目标 " + DAYS + " 天)\n");
console.log("   实际推进: " + survivedDays + " 天" + (endedReason ? "（结局: " + endedReason + "）" : "（存活至上限）"));
console.log("   末日现金: " + (state.resources ? state.resources.cash : "?"));
console.log("   末日健康: " + (state.status ? state.status.health : "?"));

if (failures.length > 0) {
  console.error("\n❌ 冒烟失败（" + failures.length + " 项）:");
  for (var f = 0; f < failures.length; f++) {
    console.error("   ✗ " + failures[f]);
  }
  console.error("");
  process.exit(1);
} else {
  console.log("\n✅ 冒烟通过：全程结构有效，无崩溃/NaN。\n");
  process.exit(0);
}
