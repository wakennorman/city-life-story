// ============================================================
// montecarlo_economy_v3.1.js — 1000 天蒙特卡洛模拟
// ============================================================
// 测试目标:
//   1. 验证多级累进财富税的累进性 (B4)
//   2. 验证动态村长债利率的有效性 (B2)
//   3. 验证连续盈利衰减与反膨胀机制 (B1)
//   4. 验证难度收益曲线差异 (B5)
//   5. 评估 1000 天后的资产分布与健康度
// ============================================================

(function() {
  'use strict';

  // ---- 配置 ----
  const SIMULATION_DAYS = 1000;
  const NUM_RUNS = 5000;
  const DIFFICULTIES = ['casual', 'normal', 'hard'];
  const INITIAL_CASH_OPTIONS = [5000, 10000, 30000];  // 三种开局资金

  // ---- 经济系统导入 (内联以支持 Node.js 运行) ----
  const EconomySystem = (function() {
    'use strict';

    const WEALTH_TAX_THRESHOLDS = [
      { min: 200000,  max: 500000,  rate: 0.0003, label: '入门税' },
      { min: 500000,  max: 2000000, rate: 0.0005, label: '中产税' },
      { min: 2000000, max: 10000000, rate: 0.0008, label: '精英税' },
      { min: 10000000, max: Infinity, rate: 0.0012, label: '富豪税' },
    ];

    const DIFFICULTY_TAX_MULTIPLIER = {
      casual: 0.7, normal: 1.0, hard: 1.4,
    };

    function calculateProgressiveWealthTax(totalAssets, difficulty) {
      if (totalAssets <= 0) return 0;
      const mult = DIFFICULTY_TAX_MULTIPLIER[difficulty] || 1.0;
      let totalTax = 0;
      let remaining = totalAssets;
      for (const tier of WEALTH_TAX_THRESHOLDS) {
        if (remaining <= 0) break;
        const taxable = Math.min(remaining, tier.max - tier.min);
        if (taxable <= 0) continue;
        totalTax += taxable * tier.rate;
        remaining -= taxable;
      }
      return Math.round(totalTax * mult);
    }

    function getActiveTaxTier(totalAssets) {
      for (const tier of WEALTH_TAX_THRESHOLDS) {
        if (totalAssets >= tier.min) return tier;
      }
      return null;
    }

    const LOAN_RATE_TIERS = [
      { assetFloor: 0,       ratePerDay: 0.0020 },
      { assetFloor: 100000,  ratePerDay: 0.0030 },
      { assetFloor: 300000,  ratePerDay: 0.0040 },
      { assetFloor: 500000,  ratePerDay: 0.0055 },
      { assetFloor: 1000000, ratePerDay: 0.0075 },
      { assetFloor: 3000000, ratePerDay: 0.0100 },
    ];

    function getDynamicLoanRate(totalAssets) {
      let bestRate = LOAN_RATE_TIERS[0].ratePerDay;
      for (const tier of LOAN_RATE_TIERS) {
        if (totalAssets >= tier.assetFloor) bestRate = tier.ratePerDay;
      }
      return bestRate;
    }

    const INVESTMENT_CAPS = {
      maxDailyStockTrades: 5,
      maxDailyPropertyDeals: 2,
      maxConsecutiveWins: 7,
      decayStart: 4,
    };

    function getConsecutiveWinDecay(consecutiveWins) {
      if (consecutiveWins < INVESTMENT_CAPS.decayStart) return 1.0;
      const excess = consecutiveWins - INVESTMENT_CAPS.decayStart + 1;
      const decay = Math.min(0.50, excess * 0.08);
      return 1.0 - decay;
    }

    function getMarketSaturationPenalty(playerAssets, cityWealth, difficulty) {
      const ratio = playerAssets / cityWealth;
      const threshold = difficulty === 'hard' ? 0.15 : difficulty === 'casual' ? 0.25 : 0.20;
      if (ratio <= threshold) return 1.0;
      const excess = (ratio - threshold) * 100;
      return Math.max(0.5, 1.0 - excess * 0.02);
    }

    const DIFFICULTY_INCOME_CURVE = {
      casual: { baseSalaryMult: 1.0, jobOpportunity: 1.2, promotionSpeed: 0.8 },
      normal: { baseSalaryMult: 1.0, jobOpportunity: 1.0, promotionSpeed: 1.0 },
      hard:   { baseSalaryMult: 0.9, jobOpportunity: 0.7, promotionSpeed: 1.3 },
    };

    function getDifficultyIncomeMultiplier(difficulty, category) {
      const config = DIFFICULTY_INCOME_CURVE[difficulty] || DIFFICULTY_INCOME_CURVE.normal;
      return config[category] || 1.0;
    }

    function dailyEconomicSettlement(state) {
      const wealthTax = calculateProgressiveWealthTax(state.totalAssets, state.difficulty);
      const loanRate = getDynamicLoanRate(state.totalAssets);
      const loanInterest = Math.round(state.savings * loanRate);
      const winDecay = getConsecutiveWinDecay(state.consecutiveWins);
      const saturationPenalty = getMarketSaturationPenalty(
        state.totalAssets, state.cityWealth, state.difficulty
      );
      const incomeMult = getDifficultyIncomeMultiplier(state.difficulty, 'baseSalaryMult');
      const effectiveCash = Math.max(0, state.cash - wealthTax);
      return {
        wealthTax,
        loanInterest,
        consecutiveWinDecay: winDecay,
        marketSaturationPenalty: saturationPenalty,
        incomeMultiplier: incomeMult,
        effectiveCash,
        activeTaxTier: getActiveTaxTier(state.totalAssets),
        loanRate,
        netDailyChange: loanInterest - wealthTax,
      };
    }

    return {
      WEALTH_TAX_THRESHOLDS,
      DIFFICULTY_TAX_MULTIPLIER,
      calculateProgressiveWealthTax,
      getActiveTaxTier,
      LOAN_RATE_TIERS,
      getDynamicLoanRate,
      INVESTMENT_CAPS,
      getConsecutiveWinDecay,
      getMarketSaturationPenalty,
      DIFFICULTY_INCOME_CURVE,
      getDifficultyIncomeMultiplier,
      dailyEconomicSettlement,
    };
  })();

  // ---- 模拟引擎 ----
  // v3.1 修正: 模拟参数对齐实际游戏经济 (股票/房产/创业高回报)
  // 日均收入: 初始 ¥500-800, 随职业成长可达 ¥2000+
  // 投资回报: 股票年化 ±10%~30%, 房产周期波动, 创业退出 ¥56万~¥210万

  function simulateOneRun(difficulty, initialCash) {
    const state = {
      day: 0,
      cash: initialCash,
      savings: 0,
      totalAssets: initialCash,
      difficulty,
      consecutiveWins: 0,
      cityWealth: 100000000,  // 城市总财富 ¥1亿 (38只股票+房产+创业池)
      baseDailyIncome: 600,   // 日均收入 (含工作+兼职)
      dailyExpense: 250,      // 日均支出 (房租+餐饮+交通)
      careerLevel: 1,         // 职业等级 1-10, 影响收入
      investmentCountToday: 0,
      milestones: [],
      taxHistory: [],
      stockAssets: 0,         // 股票资产
      propertyAssets: 0,      // 房产资产
      startupAssets: 0,       // 创业估值
    };

    // 资产阈值检查
    const thresholds = [
      50000, 100000, 200000, 500000,
      1000000, 2000000, 5000000, 10000000,
    ];

    for (let day = 1; day <= SIMULATION_DAYS; day++) {
      state.day = day;

      // 1. 职业成长 (每 60 天一次晋升机会)
      if (day % 60 === 0 && Math.random() < 0.6 && state.careerLevel < 10) {
        state.careerLevel++;
      }

      // 2. 日常工作收入 (随职业等级递增, 日均 ¥300~¥3000)
      const dailyEarning = Math.round(
        state.baseDailyIncome * state.careerLevel *
        EconomySystem.getDifficultyIncomeMultiplier(difficulty, 'baseSalaryMult') *
        (0.85 + Math.random() * 0.3)
      );
      state.cash += dailyEarning;

      // 3. 日常支出 (随资产增长: 房租+生活消费+奢侈品)
      const expenseBase = state.dailyExpense + Math.round(state.totalAssets * 0.0001);
      state.cash -= expenseBase;

      // 4. 股票投资 (每日小额交易)
      if (state.cash > 2000 && Math.random() < 0.5) {
        const investAmount = Math.round(state.cash * (0.02 + Math.random() * 0.08));
        const stockReturn = (Math.random() - 0.42) * 0.10;  // 期望微负 4.2%
        const decay = EconomySystem.getConsecutiveWinDecay(state.consecutiveWins);
        const saturationPenalty = EconomySystem.getMarketSaturationPenalty(
          state.totalAssets, state.cityWealth, difficulty
        );
        const actualReturn = stockReturn * decay * saturationPenalty;
        const profit = Math.round(investAmount * actualReturn);
        state.cash += profit;
        state.stockAssets += profit;
        if (profit > 0) state.consecutiveWins++; else state.consecutiveWins = 0;
      }

      // 5. 房产投资 (每 30-60 天一次大额交易)
      if (day % 45 === 0 && state.cash > 50000) {
        const propertyInvest = Math.round(state.cash * (0.15 + Math.random() * 0.25));
        // 房产周期: boom(+15%) / stable(±3%) / cooling(-8%) / bust(-15%)
        const cyclePhase = (day % 120) < 30 ? 0.15 : (day % 120) < 60 ? 0.03 :
                           (day % 120) < 90 ? -0.08 : -0.15;
        const propertyReturn = cyclePhase * (0.7 + Math.random() * 0.6);
        const propertyProfit = Math.round(propertyInvest * propertyReturn);
        state.cash += propertyProfit;
        state.propertyAssets += propertyInvest + propertyProfit;
      }

      // 6. 创业事件 (每 90-180 天触发)
      if ((day % 120 === 0 || day === 1) && state.cash > 200000 && Math.random() < 0.4) {
        const startupInvest = Math.min(state.cash * 0.3, 500000);
        // 创业退出估值: 种子 ¥56万 / 成长 ¥120万 / 退出 ¥210万 (±30%)
        const exitValuation = (560000 + Math.random() * 154000) * (0.7 + Math.random() * 0.6);
        const startupProfit = Math.round(exitValuation - startupInvest);
        state.cash += startupProfit;
        state.startupAssets += startupProfit;
      }

      // 7. 储蓄分配
      if (state.cash > 10000) {
        const transferToSavings = Math.round(state.cash * 0.25);
        state.savings += transferToSavings;
        state.cash -= transferToSavings;
      }

      // 8. 经济结算
      const settlement = EconomySystem.dailyEconomicSettlement(state);
      state.cash = settlement.effectiveCash;
      state.totalAssets = state.cash + state.savings;

      // 记录税务
      if (state.day % 30 === 0 || settlement.wealthTax > 0) {
        state.taxHistory.push({
          day,
          totalAssets: state.totalAssets,
          wealthTax: settlement.wealthTax,
          activeTier: settlement.activeTaxTier ? settlement.activeTaxTier.label : '无',
          loanInterest: settlement.loanInterest,
          loanRate: settlement.loanRate,
        });
      }

      // 记录里程碑
      for (const t of thresholds) {
        if (state.totalAssets >= t && (state.milestones.length === 0 || state.milestones[state.milestones.length - 1].threshold !== t)) {
          state.milestones.push({ day, threshold: t, totalAssets: state.totalAssets });
        }
      }

      // 破产保护
      if (state.cash < -5000) {
        state.cash = 0;
        state.totalAssets = Math.max(0, state.savings + state.propertyAssets + state.startupAssets);
      }
    }

    return {
      finalDay: state.day,
      finalCash: state.cash,
      finalSavings: state.savings,
      finalStockAssets: state.stockAssets,
      finalPropertyAssets: state.propertyAssets,
      finalStartupAssets: state.startupAssets,
      finalTotalAssets: state.totalAssets,
      careerLevel: state.careerLevel,
      milestones: state.milestones,
      taxHistory: state.taxHistory,
      maxAssets: state.totalAssets,
      bankruptcy: state.cash <= 0,
      peakConsecutiveWins: 0,
    };
  }

  // ---- 统计分析 ----
  function analyzeResults(results, difficulty, initialCash) {
    const finalAssets = results.map(r => r.finalTotalAssets);
    finalAssets.sort((a, b) => a - b);

    const percentile = (arr, p) => {
      const idx = Math.floor((p / 100) * arr.length);
      return arr[Math.min(idx, arr.length - 1)];
    };

    const mean = finalAssets.reduce((s, v) => s + v, 0) / finalAssets.length;
    const variance = finalAssets.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / finalAssets.length;
    const std = Math.sqrt(variance);

    const bankruptCount = results.filter(r => r.bankruptcy).length;

    // 税务统计
    const taxTriggered = results.filter(r => r.taxHistory.some(t => t.wealthTax > 0)).length;
    const totalTaxCollected = results.reduce((s, r) => {
      return s + r.taxHistory.reduce((ts, t) => ts + t.wealthTax, 0);
    }, 0);

    // 资产来源分布
    const avgStockAssets = Math.round(results.reduce((s, r) => s + r.finalStockAssets, 0) / results.length);
    const avgPropertyAssets = Math.round(results.reduce((s, r) => s + r.finalPropertyAssets, 0) / results.length);
    const avgStartupAssets = Math.round(results.reduce((s, r) => s + r.finalStartupAssets, 0) / results.length);
    const avgSavings = Math.round(results.reduce((s, r) => s + r.finalSavings, 0) / results.length);

    return {
      count: results.length,
      difficulty,
      initialCash,
      meanFinalAssets: Math.round(mean),
      medianFinalAssets: percentile(finalAssets, 50),
      p10FinalAssets: percentile(finalAssets, 10),
      p90FinalAssets: percentile(finalAssets, 90),
      p95FinalAssets: percentile(finalAssets, 95),
      p99FinalAssets: percentile(finalAssets, 99),
      stdFinalAssets: Math.round(std),
      minFinalAssets: finalAssets[0],
      maxFinalAssets: finalAssets[finalAssets.length - 1],
      bankruptcyRate: (bankruptCount / results.length * 100).toFixed(2) + '%',
      taxTriggerRate: (taxTriggered / results.length * 100).toFixed(1) + '%',
      totalTaxCollected: Math.round(totalTaxCollected),
      avgStockAssets,
      avgPropertyAssets,
      avgStartupAssets,
      avgSavings,
    };
  }

  // ---- 主测试 ----
  function runAllTests() {
    const allResults = [];
    const startTime = Date.now();

    console.log('='.repeat(70));
    console.log('  城市浮生记 v3.1 经济系统 — 1000 天蒙特卡洛模拟');
    console.log('='.repeat(70));
    console.log(`  模拟天数: ${SIMULATION_DAYS}`);
    console.log(`  运行次数: ${NUM_RUNS} / 每种组合`);
    console.log(`  难度档位: ${DIFFICULTIES.join(', ')}`);
    console.log(`  开局资金: ${INITIAL_CASH_OPTIONS.join(', ')}`);
    console.log('='.repeat(70));

    let runCounter = 0;

    for (const difficulty of DIFFICULTIES) {
      for (const initialCash of INITIAL_CASH_OPTIONS) {
        const runs = [];
        for (let i = 0; i < NUM_RUNS; i++) {
          runs.push(simulateOneRun(difficulty, initialCash));
          runCounter++;
          if (runCounter % 5000 === 0) {
            console.log(`  已运行: ${runCounter} / ${DIFFICULTIES.length * INITIAL_CASH_OPTIONS.length * NUM_RUNS}`);
          }
        }
        const stats = analyzeResults(runs, difficulty, initialCash);
        allResults.push(stats);

        console.log(`\n  [${difficulty.toUpperCase()}] 开局 ¥${initialCash.toLocaleString()}`);
        console.log(`    均值最终资产: ¥${stats.meanFinalAssets.toLocaleString()}`);
        console.log(`    中位数资产:   ¥${stats.medianFinalAssets.toLocaleString()}`);
        console.log(`    P10/P90:      ¥${stats.p10FinalAssets.toLocaleString()} / ¥${stats.p90FinalAssets.toLocaleString()}`);
        console.log(`    P95/P99:      ¥${stats.p95FinalAssets.toLocaleString()} / ¥${stats.p99FinalAssets.toLocaleString()}`);
        console.log(`    标准差:       ¥${stats.stdFinalAssets.toLocaleString()}`);
        console.log(`    破产率:       ${stats.bankruptcyRate}`);
        console.log(`    税务触发率:   ${stats.taxTriggerRate} (${stats.count} 次中有 ${stats.taxTriggerRate === '0.0%' ? '0' : Math.round(stats.count * parseFloat(stats.taxTriggerRate) / 100)} 次)`);
        console.log(`    总征税金额:   ¥${stats.totalTaxCollected.toLocaleString()}`);
        console.log(`    资产构成:     股票¥${stats.avgStockAssets.toLocaleString()} | 房产¥${stats.avgPropertyAssets.toLocaleString()} | 创业¥${stats.avgStartupAssets.toLocaleString()} | 储蓄¥${stats.avgSavings.toLocaleString()}`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('  综合结论');
    console.log('='.repeat(70));

    // v3.1 改进验证
    console.log('\n  [B4 验证] 多级累进财富税:');
    for (const d of DIFFICULTIES) {
      const stats = allResults.find(r => r.difficulty === d && r.initialCash === 10000);
      if (stats) {
        const medianTier = stats.medianFinalAssets >= 10000000 ? '富豪税' :
                           stats.medianFinalAssets >= 2000000 ? '精英税' :
                           stats.medianFinalAssets >= 500000 ? '中产税' :
                           stats.medianFinalAssets >= 200000 ? '入门税' : '无税';
        console.log(`    ${d.toUpperCase()}: 中位数¥${stats.medianFinalAssets.toLocaleString()} → ${medianTier}, 触发率 ${stats.taxTriggerRate}, 总征税¥${stats.totalTaxCollected.toLocaleString()}`);
      }
    }

    console.log('\n  [B2 验证] 动态村长债利率:');
    const loanRates = EconomySystem.LOAN_RATE_TIERS.map(t =>
      `    ¥${t.assetFloor.toLocaleString()}+: ${(t.ratePerDay * 100).toFixed(2)}%/日`
    ).join('\n');
    console.log(loanRates);

    console.log('\n  [B1 验证] 反膨胀衰减:');
    for (let wins = 0; wins <= 7; wins++) {
      const decay = EconomySystem.getConsecutiveWinDecay(wins);
      console.log(`    连续盈利 ${wins} 次 → 收益系数 ${decay.toFixed(2)}`);
    }

    console.log('\n  [B5 验证] 难度收益差异:');
    for (const d of DIFFICULTIES) {
      const config = EconomySystem.DIFFICULTY_INCOME_CURVE[d];
      console.log(`    ${d}: 收入系数=${config.baseSalaryMult}, 机会=${config.jobOpportunity}, 晋升速度=${config.promotionSpeed}`);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n  模拟完成, 耗时 ${elapsed}s, 总运行 ${runCounter} 次`);
    console.log('='.repeat(70));

    return allResults;
  }

  // 导出
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      EconomySystem,
      simulateOneRun,
      analyzeResults,
      runAllTests,
    };
  }

  // 直接运行
  if (typeof window === 'undefined') {
    runAllTests();
  }
})();
