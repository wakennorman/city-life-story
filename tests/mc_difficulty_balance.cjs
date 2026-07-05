/**
 * 难度系统平衡验证 — 独立 MC 模拟
 * 4 难度 × 4 策略 × 100 次 × 1000 天
 * 核心验证：难度差异化是否合理（生存率/现金/健康梯度）
 */
(function () {
  "use strict";

  // ====== 确定性 PRNG（Linear Congruential Generator）======
  function createRNG(seed) {
    var s = (seed || 1) >>> 0;
    return function () {
      s = (s * 1103515245 + 12345) >>> 0;
      return s / 4294967296;
    };
  }

  // ====== 难度配置 ======
  var DIFFICULTIES = [
    {
      key: "easy",
      label: "休闲",
      wage: 1.15,
      price: 0.9,
      decay: 0.85,
      startCash: 800,
    },
    {
      key: "normal",
      label: "标准",
      wage: 1.0,
      price: 1.0,
      decay: 1.0,
      startCash: 500,
    },
    {
      key: "hard",
      label: "困难",
      wage: 0.85,
      price: 1.15,
      decay: 1.15,
      startCash: 500,
    },
    {
      key: "hell",
      label: "地狱",
      wage: 0.7,
      price: 1.3,
      decay: 1.4,
      startCash: 500,
    },
  ];

  // ====== 策略配置 ======
  var STRATEGIES = [
    {
      key: "balanced",
      label: "平衡型",
      baseWage: 45,
      baseExpense: 25,
      eatEveryDay: true,
      workEvery: 2,
    },
    {
      key: "grinder",
      label: "苦力型",
      baseWage: 55,
      baseExpense: 15,
      eatEveryDay: false,
      workEvery: 1,
    },
    {
      key: "skiller",
      label: "技能型",
      baseWage: 50,
      baseExpense: 30,
      eatEveryDay: true,
      workEvery: 3,
    },
    {
      key: "trader",
      label: "商人类",
      baseWage: 50,
      baseExpense: 20,
      eatEveryDay: true,
      workEvery: 2,
      tradeVariance: true,
    },
  ];

  var NUM_RUNS = 100;
  var DAYS = 1000;

  // ====== 核心模拟 ======
  function simulate(difficulty, strategy, runSeed) {
    var rng = createRNG(runSeed);
    var d = difficulty;
    var s = strategy;

    var cash = d.startCash;
    var health = 85;
    var hunger = 65;
    var hygiene = 60;
    var happiness = 60;
    var totalEarned = 0;
    var daysSurvived = 0;

    for (var day = 1; day <= DAYS; day++) {
      // 需求衰减（受难度乘数影响）
      hunger = Math.max(0, hunger - Math.round(13 * d.decay));
      hygiene = Math.max(0, hygiene - Math.round(7 * d.decay));
      happiness = Math.max(0, happiness - Math.round(4 * d.decay));

      // 需求阈值惩罚
      if (hunger < 10) health -= 1;
      if (hunger <= 0) health -= 1; // 极度饥饿双倍
      if (hygiene < 10) health -= 1;
      if (happiness < 5) health -= 0.5;

      // 健康自然恢复
      if (health < 100) health = Math.min(100, health + 2.5);

      // 收入
      if (day % s.workEvery === 0) {
        var wageFactor = s.tradeVariance
          ? 0.4 + rng() * 1.2
          : 0.8 + rng() * 0.4;
        var income = Math.round(s.baseWage * d.wage * wageFactor);
        if (s.key === "skiller" && day % 2 === 0)
          income = Math.round(income * 0.6);
        cash += income;
        totalEarned += income;
      }

      // 每日开支
      if (s.eatEveryDay) {
        cash -= Math.round(15 * d.price);
      } else {
        // grinder 偶尔不吃，但健康下降更快
        if (rng() < 0.3) {
          cash -= Math.round(10 * d.price);
        }
      }

      // 随机支出事件
      if (rng() < 0.02) {
        cash -= Math.round(50 * d.price);
      }

      // 疾病风险（受难度影响）
      if (rng() < 0.015 * (d.decay > 1 ? d.decay : 1)) {
        health -= Math.round(10 + rng() * 15);
      }

      // 游戏结束判定
      if (health <= 0 || cash < -300) {
        return {
          survived: false,
          day: day,
          cash: cash,
          health: Math.max(0, health),
          totalEarned: totalEarned,
        };
      }

      // 需求恢复
      if (s.eatEveryDay) hunger = Math.min(100, hunger + 25);
      hygiene = Math.min(100, hygiene + 5);
      happiness = Math.min(100, happiness + 2);
    }

    return {
      survived: true,
      day: DAYS,
      cash: cash,
      health: Math.min(100, health),
      totalEarned: totalEarned,
    };
  }

  // ====== 统计函数 ======
  function calcStats(arr) {
    var n = arr.length;
    var sorted = arr
      .map(function (r) {
        return r.cash;
      })
      .sort(function (a, b) {
        return a - b;
      });
    var survived = arr.filter(function (r) {
      return r.survived;
    });
    return {
      n: n,
      survivedCount: survived.length,
      survivalRate: survived.length / n,
      medianCash: sorted[Math.floor(n / 2)],
      avgCash: Math.round(
        sorted.reduce(function (a, b) {
          return a + b;
        }, 0) / n,
      ),
      p10: sorted[Math.floor(n * 0.1)],
      p90: sorted[Math.floor(n * 0.9)],
      avgHealth:
        survived.length > 0
          ? Math.round(
              (survived.reduce(function (s, r) {
                return s + r.health;
              }, 0) /
                survived.length) *
                10,
            ) / 10
          : 0,
      avgTotalEarned: Math.round(
        arr.reduce(function (s, r) {
          return s + r.totalEarned;
        }, 0) / n,
      ),
    };
  }

  // ====== 运行所有模拟 ======
  console.log("=".repeat(78));
  console.log("城市浮生记 — 难度系统 MC 平衡验证 v3.1");
  console.log("4 难度 × 4 策略 × " + NUM_RUNS + " 次 × " + DAYS + " 天");
  console.log("=".repeat(78));

  var allResults = {};
  var globalSeed = 1001;

  for (var di = 0; di < DIFFICULTIES.length; di++) {
    var diff = DIFFICULTIES[di];
    allResults[diff.key] = {};

    for (var si = 0; si < STRATEGIES.length; si++) {
      var strat = STRATEGIES[si];
      var runs = [];

      for (var ri = 0; ri < NUM_RUNS; ri++) {
        var result = simulate(diff, strat, globalSeed++);
        runs.push(result);
      }

      allResults[diff.key][strat.key] = runs;
    }
  }

  // ====== 输出报告 ======
  for (var di = 0; di < DIFFICULTIES.length; di++) {
    var diff = DIFFICULTIES[di];
    console.log("\n" + diff.label + " 难度");
    console.log("-".repeat(76));
    console.log(
      "策略        存活率    中位现金      P10       P90       总收入      平均健康",
    );
    console.log("-".repeat(76));

    for (var si = 0; si < STRATEGIES.length; si++) {
      var strat = STRATEGIES[si];
      var stats = calcStats(allResults[diff.key][strat.key]);
      var sr = Math.round(stats.survivalRate * 100);
      var mc = stats.medianCash.toLocaleString();
      var p10 = stats.p10.toLocaleString();
      var p90 = stats.p90.toLocaleString();
      var te = stats.avgTotalEarned.toLocaleString();
      var ah = stats.avgHealth.toFixed(1);

      console.log(
        strat.label.padEnd(8) +
          " " +
          sr.toString().padStart(3) +
          "%   ¥" +
          mc.padStart(10) +
          "  ¥" +
          p10.padStart(8) +
          "  ¥" +
          p90.padStart(8) +
          "  ¥" +
          te.padStart(8) +
          "  " +
          ah,
      );
    }
  }

  // ====== 跨难度对比 ======
  console.log("\n" + "=".repeat(78));
  console.log("跨难度对比（balanced 策略）");
  console.log("-".repeat(50));
  for (var di = 0; di < DIFFICULTIES.length; di++) {
    var diff = DIFFICULTIES[di];
    var stats = calcStats(allResults[diff.key]["balanced"]);
    console.log(
      diff.label.padEnd(4) +
        " | ¥" +
        stats.medianCash.toLocaleString().padStart(10) +
        " | 存活 " +
        Math.round(stats.survivalRate * 100) +
        "%" +
        " | 健康 " +
        stats.avgHealth.toFixed(1),
    );
  }

  // ====== 跨策略对比（标准难度）======
  console.log("\n跨策略对比（标准难度）");
  console.log("-".repeat(50));
  for (var si = 0; si < STRATEGIES.length; si++) {
    var strat = STRATEGIES[si];
    var stats = calcStats(allResults["normal"][strat.key]);
    console.log(
      strat.label.padEnd(8) +
        " | ¥" +
        stats.medianCash.toLocaleString().padStart(10) +
        " | 存活 " +
        Math.round(stats.survivalRate * 100) +
        "%" +
        " | 健康 " +
        stats.avgHealth.toFixed(1),
    );
  }

  // ====== 验证结论 ======
  console.log("\n" + "=".repeat(78));
  console.log("验证结论");
  console.log("-".repeat(78));

  var balancedNormal = calcStats(allResults["normal"]["balanced"]);
  var balancedEasy = calcStats(allResults["easy"]["balanced"]);
  var balancedHard = calcStats(allResults["hard"]["balanced"]);
  var balancedHell = calcStats(allResults["hell"]["balanced"]);

  var checks = [];

  // 检查1：休闲档中位现金 > 标准档
  checks.push({
    name: "休闲档中位现金 > 标准档",
    pass: balancedEasy.medianCash > balancedNormal.medianCash,
    detail:
      "休闲¥" +
      balancedEasy.medianCash.toLocaleString() +
      " vs 标准¥" +
      balancedNormal.medianCash.toLocaleString(),
  });

  // 检查2：困难档中位现金 < 标准档
  checks.push({
    name: "困难档中位现金 < 标准档",
    pass: balancedHard.medianCash < balancedNormal.medianCash,
    detail:
      "困难¥" +
      balancedHard.medianCash.toLocaleString() +
      " vs 标准¥" +
      balancedNormal.medianCash.toLocaleString(),
  });

  // 检查3：地狱档中位现金 << 困难档
  checks.push({
    name: "地狱档中位现金 < 困难档",
    pass: balancedHell.medianCash < balancedHard.medianCash,
    detail:
      "地狱¥" +
      balancedHell.medianCash.toLocaleString() +
      " vs 困难¥" +
      balancedHard.medianCash.toLocaleString(),
  });

  // 检查4：标准档存活率 >= 50%
  checks.push({
    name: "标准档存活率 >= 50%",
    pass: balancedNormal.survivalRate >= 0.5,
    detail: "存活率 " + Math.round(balancedNormal.survivalRate * 100) + "%",
  });

  // 检查5：休闲档存活率 > 标准档
  checks.push({
    name: "休闲档存活率 > 标准档",
    pass: balancedEasy.survivalRate > balancedNormal.survivalRate,
    detail:
      "休闲" +
      Math.round(balancedEasy.survivalRate * 100) +
      "% vs 标准" +
      Math.round(balancedNormal.survivalRate * 100) +
      "%",
  });

  // 检查6：地狱档存活率 < 标准档
  checks.push({
    name: "地狱档存活率 < 标准档",
    pass: balancedHell.survivalRate < balancedNormal.survivalRate,
    detail:
      "地狱" +
      Math.round(balancedHell.survivalRate * 100) +
      "% vs 标准" +
      Math.round(balancedNormal.survivalRate * 100) +
      "%",
  });

  for (var ci = 0; ci < checks.length; ci++) {
    var c = checks[ci];
    var icon = c.pass ? "✅" : "❌";
    console.log(icon + " " + c.name + " — " + c.detail);
  }

  var allPass = checks.every(function (c) {
    return c.pass;
  });
  console.log(
    "\n总评：" +
      (allPass ? "✅ 全部通过 — 难度分层有效" : "❌ 部分未通过 — 需调参"),
  );

  // 保存报告
  var report = {
    version: "v3.1-difficulty-balance",
    date: new Date().toISOString(),
    params: { runs: NUM_RUNS, days: DAYS },
    difficulties: {},
    checks: checks,
    allPass: allPass,
  };
  for (var di = 0; di < DIFFICULTIES.length; di++) {
    report.difficulties[DIFFICULTIES[di].key] = {};
    for (var si = 0; si < STRATEGIES.length; si++) {
      report.difficulties[DIFFICULTIES[di].key][STRATEGIES[si].key] = calcStats(
        allResults[DIFFICULTIES[di].key][STRATEGIES[si].key],
      );
    }
  }

  require("fs").writeFileSync(
    __dirname + "/mc_difficulty_report.json",
    JSON.stringify(report, null, 2),
  );
  console.log("\n报告已保存至: mc_difficulty_report.json");
})();
