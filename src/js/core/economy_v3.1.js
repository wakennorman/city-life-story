// ============================================================
// economy_v3.1.js — 城市浮生记 经济系统 v3.1 改进
// ============================================================
// v3.0 审查问题修复:
//   B1: 中后期指数膨胀 → 多级累进闸门
//   B2: 村长债利率对老玩家无效 → 动态利率
//   B4: 财富税 ¥20万阈值过低 → 多级累进税
//   B5: 难度只调惩罚不调收益 → 收益曲线调节
// ============================================================

const EconomySystem = (function() {
  'use strict';

  // ============================================================
  // 1. 多级累进财富税系统 (修复 B4)
  // ============================================================
  // v3.0 问题: 单一 ¥20万阈值, 高端玩家(¥500万+)几乎无感
  // v3.1 改进: 四级累进阈值, 边际税率递增

  const WEALTH_TAX_THRESHOLDS = [
    { min: 200000,  max: 500000,  rate: 0.0003, label: '入门税' },    // 日 0.03%
    { min: 500000,  max: 2000000, rate: 0.0005, label: '中产税' },    // 日 0.05%
    { min: 2000000, max: 10000000, rate: 0.0008, label: '精英税' },   // 日 0.08%
    { min: 10000000, max: Infinity, rate: 0.0012, label: '富豪税' },   // 日 0.12%
  ];

  // 难度系数: 休闲/标准/困难 → 税率乘数
  const DIFFICULTY_TAX_MULTIPLIER = {
    casual: 0.7,   // 休闲模式减 30%
    normal: 1.0,   // 标准模式
    hard: 1.4,     // 困难模式增 40%
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
      if (totalAssets >= tier.min) {
        return tier;
      }
    }
    return null;
  }

  // ============================================================
  // 2. 动态村长债利率 (修复 B2)
  // ============================================================
  // v3.0 问题: 0.35%/日 对 ¥50万+ 玩家完全可忽略 (日息仅 ¥1,750)
  // v3.1 改进: 基于总资产的阶梯利率, 鼓励玩家持续投资

  const LOAN_RATE_TIERS = [
    { assetFloor: 0,       ratePerDay: 0.20 / 100, label: '基础利率' },
    { assetFloor: 100000,  ratePerDay: 0.30 / 100, label: '提升利率' },
    { assetFloor: 300000,  ratePerDay: 0.40 / 100, label: '进阶利率' },
    { assetFloor: 500000,  ratePerDay: 0.55 / 100, label: '高级利率' },
    { assetFloor: 1000000, ratePerDay: 0.75 / 100, label: '专家利率' },
    { assetFloor: 3000000, ratePerDay: 1.00 / 100, label: '大师利率' },
  ];

  function getDynamicLoanRate(totalAssets) {
    let bestRate = LOAN_RATE_TIERS[0].ratePerDay;
    for (const tier of LOAN_RATE_TIERS) {
      if (totalAssets >= tier.assetFloor) {
        bestRate = tier.ratePerDay;
      }
    }
    return bestRate;
  }

  // ============================================================
  // 3. 投资冷却与反膨胀机制 (修复 B1)
  // ============================================================
  // v3.0 问题: 股票+房产+创业+套利多系统收益叠加无减速
  // v3.1 改进: 日投资次数限制 + 连续盈利衰减 + 市场饱和度

  const INVESTMENT_CAPS = {
    maxDailyStockTrades: 5,        // 每日股票交易上限
    maxDailyPropertyDeals: 2,      // 每日房产交易上限
    maxConsecutiveWins: 7,         // 连续盈利上限
    decayStart: 4,                 // 第 N 次连续盈利开始衰减
  };

  // 连续盈利衰减系数
  function getConsecutiveWinDecay(consecutiveWins) {
    if (consecutiveWins < INVESTMENT_CAPS.decayStart) return 1.0;
    const excess = consecutiveWins - INVESTMENT_CAPS.decayStart + 1;
    // 每多一次衰减 8%, 最大衰减 50%
    const decay = Math.min(0.50, excess * 0.08);
    return 1.0 - decay;
  }

  // 市场饱和度: 当玩家总资产/城市总财富比超过阈值时, 投资收益下降
  function getMarketSaturationPenalty(playerAssets, cityWealth, difficulty) {
    const ratio = playerAssets / cityWealth;
    const threshold = difficulty === 'hard' ? 0.15 : difficulty === 'casual' ? 0.25 : 0.20;
    if (ratio <= threshold) return 1.0;
    // 超过阈值后每 1% 额外比例衰减 2%
    const excess = (ratio - threshold) * 100;
    return Math.max(0.5, 1.0 - excess * 0.02);
  }

  // ============================================================
  // 4. 难度收益曲线调节 (修复 B5)
  // ============================================================
  // v3.0 问题: 困难模式只加惩罚, 熟练玩家可沿用相同策略
  // v3.1 改进: 困难模式收益曲线更陡, 需要更高效率才能达标

  const DIFFICULTY_INCOME_CURVE = {
    casual: { baseSalaryMult: 1.0, jobOpportunity: 1.2, promotionSpeed: 0.8 },
    normal: { baseSalaryMult: 1.0, jobOpportunity: 1.0, promotionSpeed: 1.0 },
    hard:   { baseSalaryMult: 0.9, jobOpportunity: 0.7, promotionSpeed: 1.3 },
  };

  function getDifficultyIncomeMultiplier(difficulty, category) {
    const config = DIFFICULTY_INCOME_CURVE[difficulty] || DIFFICULTY_INCOME_CURVE.normal;
    return config[category] || 1.0;
  }

  // ============================================================
  // 5. 综合每日经济结算
  // ============================================================
  function dailyEconomicSettlement(state) {
    const {
      totalAssets,
      cash,
      savings,
      difficulty,
      investmentCountToday,
      consecutiveWins,
      cityWealth,
    } = state;

    // 1. 财富税
    const wealthTax = calculateProgressiveWealthTax(totalAssets, difficulty);

    // 2. 动态村长债收益
    const loanRate = getDynamicLoanRate(totalAssets);
    const loanInterest = Math.round(savings * loanRate);

    // 3. 投资衰减
    const winDecay = getConsecutiveWinDecay(consecutiveWins);

    // 4. 市场饱和惩罚
    const saturationPenalty = getMarketSaturationPenalty(
      totalAssets, cityWealth || 10000000, difficulty
    );

    // 5. 难度收入系数
    const incomeMult = getDifficultyIncomeMultiplier(difficulty, 'baseSalaryMult');

    const effectiveCash = Math.max(0, cash - wealthTax);

    return {
      wealthTax,
      loanInterest,
      consecutiveWinDecay: winDecay,
      marketSaturationPenalty: saturationPenalty,
      incomeMultiplier: incomeMult,
      effectiveCash,
      activeTaxTier: getActiveTaxTier(totalAssets),
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
