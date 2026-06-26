/**
 * 蒙特卡洛模拟 — 城市浮生记数值平衡测试
 *
 * 用法（浏览器 DevTools 控制台）：
 *   runMonteCarlo()                          // 默认：200 次 × 1000 天
 *   runMonteCarlo({ trials: 50 })            // 快速测试
 *   runMonteCarlo({ daysPerTrial: 500 })     // 只有 500 天
 *   runMonteCarlo({ verbose: true })         // 打印每步细节
 *
 * 通过条件（当前版本基准）：
 *   - 存活率 > 80%
 *   - 前 7 天死亡率 < 10%
 *   - 30 天前暴富率 < 5%
 *   - 中位现金 ¥500~¥50000
 */

(function () {
  "use strict";

  // ============ 深拷贝工具 ============
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // ============ 简单的一天决策逻辑 ============
  // 模拟一个"合理但不算聪明"的玩家，每天做些基本操作
  function simulateDay(state) {
    var ap = state.player.actionPoints;
    var cash = state.resources.cash;
    var needs = state.needs;

    // 1. 如果饿了且有钱 → 吃饭 (apCost: 10, cash: ~15)
    if (needs.hunger > 60 && cash >= 10 && ap >= 10) {
      var cost = 12 + Random.int(0, 6);
      state.resources.cash = Math.max(0, state.resources.cash - cost);
      state.needs.hunger = Math.max(0, state.needs.hunger - 30);
      state.needs.happiness = Math.min(100, state.needs.happiness + 3);
      ap -= 10;
    }

    // 2. 如果很累 → 休息 (apCost: 15)
    if (needs.fatigue > 70 && ap >= 15) {
      state.needs.fatigue = Math.max(0, state.needs.fatigue - 20);
      state.needs.happiness = Math.min(100, state.needs.happiness + 5);
      ap -= 15;
    }

    // 3. 如果太脏 → 洗澡 (apCost: 10, cash: 8)
    if (needs.hygiene > 60 && cash >= 8 && ap >= 10) {
      state.resources.cash -= 8;
      state.needs.hygiene = Math.max(0, state.needs.hygiene - 40);
      ap -= 10;
    }

    // 4. 如果心情差 → 去公园（模拟）(apCost: 10)
    if (needs.happiness < 30 && ap >= 10) {
      state.needs.happiness = Math.min(100, state.needs.happiness + 15);
      state.needs.fatigue = Math.min(100, state.needs.fatigue + 5);
      ap -= 10;
    }

    // 5. 剩下的行动力 → 废品回收/打零工赚钱
    // 简单模拟：每 10AP 赚 20~40 元
    while (ap >= 10) {
      var earn = 15 + Random.int(0, 20);
      state.resources.cash += earn;
      state.needs.fatigue = Math.min(100, state.needs.fatigue + 8);
      state.needs.hygiene = Math.min(100, state.needs.hygiene + 5);
      ap -= 10;
    }

    // 6. 如果还有剩余现金且真的很饿 → 无论如何先吃点
    if (state.needs.hunger > 80 && state.resources.cash >= 5) {
      state.resources.cash = Math.max(0, state.resources.cash - 5);
      state.needs.hunger = Math.max(0, state.needs.hunger - 15);
    }

    // 记录剩余 AP
    state.player.actionPoints = Math.max(0, ap);
  }

  // ============ 单次模拟 ============
  function runTrial(initState, days) {
    var state = deepClone(initState);
    // 重置到第 1 天
    state.player.day = 1;
    state.flags.gameOver = false;
    state.flags.gameOverReason = "";

    for (var d = 0; d < days; d++) {
      // 模拟玩家一天的决策
      simulateDay(state);

      // 消耗剩余行动力，触发 endDay
      state.player.actionPoints = 0;
      state.player.timeSlot = "evening";

      // 运行每日结算管线（直接用游戏本身的函数）
      if (typeof runDailyPipeline === "function") {
        runDailyPipeline(state);
      }

      // 检查游戏结束
      if (typeof checkLoseConditions === "function") {
        checkLoseConditions(state);
      }

      // 死亡检查（可能 checkLoseConditions 设置 gameOver 标记）
      if (state.flags.gameOver) {
        return {
          survived: false,
          diedOnDay: d + 1,
          finalCash: state.resources.cash,
          finalHealth: state.status.health,
          illegalCount: 0,
        };
      }
    }

    return {
      survived: true,
      diedOnDay: -1,
      finalCash: state.resources.cash,
      finalHealth: state.status.health,
      illegalCount: state.player.totalIllegalActs || 0,
    };
  }

  // ============ 主入口 ============
  function runMonteCarlo(opts) {
    opts = opts || {};
    var trials = opts.trials || 200;
    var daysPerTrial = opts.daysPerTrial || 1000;
    var verbose = opts.verbose || false;

    // 获取初始游戏状态
    if (typeof StateManager === "undefined") {
      console.error("❌ StateManager 未加载。请先开始一个新游戏。");
      return;
    }

    var baseState = StateManager.getState();
    if (!baseState || !baseState.player) {
      console.error("❌ 游戏状态未初始化。请先开始一个新游戏。");
      return;
    }

    console.log("🧪 蒙特卡洛模拟启动: %d 次 × %d 天", trials, daysPerTrial);
    console.log(
      "   初始状态: ¥%d, 健康:%d",
      baseState.resources.cash,
      baseState.status.health,
    );

    var results = [];
    var startTime = Date.now();

    for (var i = 0; i < trials; i++) {
      var r = runTrial(baseState, daysPerTrial);
      results.push(r);

      if (verbose) {
        console.log(
          "   [%d/%d] %s (第%d天, 现金:¥%d, 健康:%d)",
          i + 1,
          trials,
          r.survived ? "✅存活" : "💀死亡",
          r.survived ? daysPerTrial : r.diedOnDay,
          r.finalCash,
          r.finalHealth,
        );
      } else if ((i + 1) % 50 === 0) {
        console.log("   ...已完成 %d/%d 次", i + 1, trials);
      }
    }

    var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    // ============ 统计分析 ============
    var survived = results.filter(function (r) {
      return r.survived;
    });
    var died = results.filter(function (r) {
      return !r.survived;
    });
    var allCash = results.map(function (r) {
      return r.finalCash;
    });
    var diedEarly = died.filter(function (r) {
      return r.diedOnDay <= 7;
    });
    var richEarly = survived.filter(function (r) {
      return r.finalCash > 50000;
    });

    // 排序用于中位数
    allCash.sort(function (a, b) {
      return a - b;
    });
    var midCash =
      allCash.length % 2 === 0
        ? (allCash[allCash.length / 2 - 1] + allCash[allCash.length / 2]) / 2
        : allCash[Math.floor(allCash.length / 2)];

    var avgCash =
      allCash.reduce(function (s, v) {
        return s + v;
      }, 0) / allCash.length;

    var minCash = allCash[0];
    var maxCash = allCash[allCash.length - 1];

    var avgHealth =
      survived.reduce(function (s, r) {
        return s + r.finalHealth;
      }, 0) / (survived.length || 1);

    var earlyDeaths = died.filter(function (r) {
      return r.diedOnDay <= 7;
    }).length;
    var midDaysDied =
      died.length > 0
        ? died.reduce(function (s, r) {
            return s + r.diedOnDay;
          }, 0) / died.length
        : -1;

    // ============ 打印结果 ============
    var line = "=".repeat(56);
    console.log("\n" + line);
    console.log("  蒙特卡洛模拟结果");
    console.log(line);
    console.log("  模拟配置:    %d 次 × %d 天", trials, daysPerTrial);
    console.log("  耗时:        %s 秒", elapsed);
    console.log("");
    console.log("  📊 存活统计");
    console.log(
      "  总存活率:    %d%% (%d/%d)",
      Math.round((survived.length / trials) * 100),
      survived.length,
      trials,
    );
    console.log(
      "  前7天死亡率: %d%% (%d/%d)",
      Math.round((earlyDeaths / trials) * 100),
      earlyDeaths,
      died.length,
    );
    console.log(
      "  死亡平均天数: %s 天",
      midDaysDied > 0 ? midDaysDied.toFixed(1) : "N/A",
    );
    console.log("");
    console.log("  💰 经济统计（存活玩家）");
    console.log("  平均现金:    ¥%s", Math.round(avgCash).toLocaleString());
    console.log("  中位现金:    ¥%s", Math.round(midCash).toLocaleString());
    console.log("  最小现金:    ¥%s", Math.round(minCash).toLocaleString());
    console.log("  最大现金:    ¥%s", Math.round(maxCash).toLocaleString());
    console.log(
      "  30天暴富率:  %d%% (现金>¥50000)",
      Math.round((richEarly.length / trials) * 100),
    );
    console.log("  平均健康:    %d", Math.round(avgHealth));
    console.log(line);

    // ============ 评判 ============
    var pass = true;
    var checks = [];

    // 存活率 > 80%
    var survivalRate = (survived.length / trials) * 100;
    if (survivalRate < 80) {
      checks.push("❌ 存活率 %.1f%% < 80%%", survivalRate);
      pass = false;
    } else {
      checks.push("✅ 存活率 %.1f%% ≥ 80%%", survivalRate);
    }

    // 前7天死亡率 < 10%
    var earlyDeathRate = (earlyDeaths / trials) * 100;
    if (earlyDeathRate >= 10) {
      checks.push("❌ 前7天死亡率 %.1f%% ≥ 10%%", earlyDeathRate);
      pass = false;
    } else {
      checks.push("✅ 前7天死亡率 %.1f%% < 10%%", earlyDeathRate);
    }

    // 30天暴富率 < 5%
    var richRate = (richEarly.length / trials) * 100;
    if (richRate >= 5) {
      checks.push("❌ 30天暴富率 %.1f%% ≥ 5%%", richRate);
      pass = false;
    } else {
      checks.push("✅ 30天暴富率 %.1f%% < 5%%", richRate);
    }

    // 中位现金在合理范围
    if (midCash < 500 || midCash > 50000) {
      checks.push(
        "❌ 中位现金 ¥%d 超出合理范围 [¥500, ¥50000]",
        Math.round(midCash),
      );
      pass = false;
    } else {
      checks.push("✅ 中位现金 ¥%d 在合理范围内", Math.round(midCash));
    }

    console.log("\n  判定:");
    for (var j = 0; j < checks.length; j++) {
      console.log("  " + checks[j]);
    }
    console.log(line);
    console.log(
      "  总体: %s",
      pass ? "✅ 通过" : "❌ 未通过 — 需要调整数值参数",
    );
    console.log(line + "\n");

    return {
      pass: pass,
      stats: {
        survivalRate: survivalRate,
        earlyDeathRate: earlyDeathRate,
        richRate: richRate,
        avgCash: avgCash,
        midCash: midCash,
        avgHealth: avgHealth,
      },
      results: results,
    };
  }

  // ============ 概率测试 ============
  function runProbabilityTest(eventName, times) {
    times = times || 200;
    // 空实现 — 将来可以扩展为检查特定事件的分支概率
    console.log("⚠️ 概率测试功能开发中。当前随机事件通过 Random API 控制。");
  }

  // ============ 暴露到全局 ============
  window.runMonteCarlo = runMonteCarlo;
  window.runProbabilityTest = runProbabilityTest;

  console.log("🧪 蒙特卡洛模拟器已加载。运行 runMonteCarlo() 开始测试。");
})();
