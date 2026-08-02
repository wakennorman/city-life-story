// ============================================================
// economy_v3.1.js — 城市浮生记 经济系统 v3.1 改进
// ============================================================
// v3.0 审查问题修复:
//   B1: 中后期指数膨胀 → 多级累进闸门
//   B2: 村长债利率对老玩家无效 → 动态利率
//   B4: 财富税 ¥20万阈值过低 → 多级累进税
//   B5: 难度只调惩罚不调收益 → 收益曲线调节
// ============================================================

const EconomySystem = (function () {
  "use strict";

  // ============================================================
  // 1. 多级累进财富税系统 (修复 B4)
  // ============================================================
  // v3.0 问题: 单一 ¥20万阈值, 高端玩家(¥500万+)几乎无感
  // v3.1 改进: 四级累进阈值, 边际税率递增

  const WEALTH_TAX_THRESHOLDS = [
    { min: 200000, max: 500000, rate: 0.0003, label: "入门税" }, // 日 0.03%
    { min: 500000, max: 2000000, rate: 0.0005, label: "中产税" }, // 日 0.05%
    { min: 2000000, max: 10000000, rate: 0.0008, label: "精英税" }, // 日 0.08%
    { min: 10000000, max: Infinity, rate: 0.0012, label: "富豪税" }, // 日 0.12%
  ];

  // 难度系数: 休闲/标准/困难/地狱 → 税率乘数
  // [域A 修复] 原键名 casual 与 difficulty_system.js 写入 state._difficulty 的
  //   真实取值 (easy/normal/hard/hell) 不匹配 → easy/hell 档税率乘数恒回落 1.0。
  //   改为 easy/normal/hard/hell 与难度系统对齐，并补地狱档。
  const DIFFICULTY_TAX_MULTIPLIER = {
    easy: 0.7, // 休闲模式减 30%
    normal: 1.0, // 标准模式
    hard: 1.4, // 困难模式增 40%
    hell: 1.6, // 地狱模式增 60%
  };

  // [全系统自洽修复] 域A A类#3: 原算法用 remaining=totalAssets 直接减 bracket 宽度，
  //   未扣除 bracket.min 偏移，导致跨档部分被重复征税（如¥200001征税¥60而非¥0）。
  //   改为标准累进：每档仅对 (min, min(max, totalAssets)) 区间征税。
  function calculateProgressiveWealthTax(totalAssets, difficulty) {
    if (
      typeof totalAssets !== "number" ||
      !isFinite(totalAssets) ||
      totalAssets <= 0
    )
      return 0;
    const mult = DIFFICULTY_TAX_MULTIPLIER[difficulty] || 1.0;
    let totalTax = 0;

    for (const tier of WEALTH_TAX_THRESHOLDS) {
      if (totalAssets <= tier.min) break; // 资产未达该档起征点
      const upper = Math.min(totalAssets, tier.max);
      const taxable = upper - tier.min;
      if (taxable <= 0) continue;
      totalTax += taxable * tier.rate;
    }

    return Math.round(totalTax * mult);
  }

  // [全系统自洽修复] 域A A类#2: 原逻辑返回首个命中档（最低档），高资产玩家永远显示入门税
  //   改为逆序遍历，返回最高命中档
  function getActiveTaxTier(totalAssets) {
    for (let i = WEALTH_TAX_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalAssets >= WEALTH_TAX_THRESHOLDS[i].min) {
        return WEALTH_TAX_THRESHOLDS[i];
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
    { assetFloor: 0, ratePerDay: 0.2 / 100, label: "基础利率" },
    { assetFloor: 100000, ratePerDay: 0.3 / 100, label: "提升利率" },
    { assetFloor: 300000, ratePerDay: 0.4 / 100, label: "进阶利率" },
    { assetFloor: 500000, ratePerDay: 0.55 / 100, label: "高级利率" },
    { assetFloor: 1000000, ratePerDay: 0.75 / 100, label: "专家利率" },
    { assetFloor: 3000000, ratePerDay: 1.0 / 100, label: "大师利率" },
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
    maxDailyStockTrades: 5, // 每日股票交易上限
    maxDailyPropertyDeals: 2, // 每日房产交易上限
    maxConsecutiveWins: 7, // 连续盈利上限
    decayStart: 4, // 第 N 次连续盈利开始衰减
  };

  // 连续盈利衰减系数
  function getConsecutiveWinDecay(consecutiveWins) {
    // [全系统自洽修复] 域E A类#12: consecutiveWins NaN 防御
    if (typeof consecutiveWins !== "number" || !isFinite(consecutiveWins)) return 1.0;
    if (consecutiveWins < INVESTMENT_CAPS.decayStart) return 1.0;
    const excess = consecutiveWins - INVESTMENT_CAPS.decayStart + 1;
    // 每多一次衰减 8%, 最大衰减 50%
    const decay = Math.min(0.5, excess * 0.08);
    return 1.0 - decay;
  }

  // 市场饱和度: 当玩家总资产/城市总财富比超过阈值时, 投资收益下降
  function getMarketSaturationPenalty(playerAssets, cityWealth, difficulty) {
    // [全系统自洽修复] 域E A类#13: playerAssets/cityWealth NaN 防御
    if (typeof playerAssets !== "number" || !isFinite(playerAssets) || playerAssets <= 0) return 1.0;
    if (typeof cityWealth !== "number" || !isFinite(cityWealth) || cityWealth <= 0) return 1.0;
    const ratio = playerAssets / cityWealth;
    const threshold =
      difficulty === "hard"
        ? 0.15
        : difficulty === "easy"
          ? 0.25
          : difficulty === "hell"
            ? 0.1
            : 0.2;
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

  // [域A 修复] 同上：原 casual 键名无法命中 easy 档，导致休闲档收益曲线恒用 normal。
  //   改为 easy/normal/hard/hell 对齐，并补地狱档更陡曲线。
  const DIFFICULTY_INCOME_CURVE = {
    easy: { baseSalaryMult: 1.0, jobOpportunity: 1.2, promotionSpeed: 0.8 },
    normal: { baseSalaryMult: 1.0, jobOpportunity: 1.0, promotionSpeed: 1.0 },
    hard: { baseSalaryMult: 0.9, jobOpportunity: 0.7, promotionSpeed: 1.3 },
    hell: { baseSalaryMult: 0.8, jobOpportunity: 0.5, promotionSpeed: 1.5 },
  };

  function getDifficultyIncomeMultiplier(difficulty, category) {
    const config =
      DIFFICULTY_INCOME_CURVE[difficulty] || DIFFICULTY_INCOME_CURVE.normal;
    return config[category] || 1.0;
  }

  // ============================================================
  // 5. 综合每日经济结算
  // ============================================================
  function dailyEconomicSettlement(state) {
    if (!state || !state.resources) {
      return { wealthTax: 0, loanInterest: 0, netDailyChange: 0 };
    }

    const cash = state.resources.cash || 0;
    const bankBalance = state.resources.bankBalance || 0;
    const totalAssets = cash + bankBalance;
    const difficulty = state._difficulty || "normal";

    // 1. 财富税
    const wealthTax = calculateProgressiveWealthTax(totalAssets, difficulty);

    // 2. 动态村长债利率（返回日利率）
    const loanRate = getDynamicLoanRate(totalAssets);

    // 3. 投资衰减（连续盈利衰减：第4次后每次-8%，最多-50%）
    const winDecay = getConsecutiveWinDecay(
      (state.investment && state.investment._consecutiveWins) || 0,
    );

    // 4. 市场饱和惩罚
    const saturationPenalty = getMarketSaturationPenalty(
      totalAssets,
      10000000,
      difficulty,
    );

    // 5. 难度收入系数
    const incomeMult = getDifficultyIncomeMultiplier(
      difficulty,
      "baseSalaryMult",
    );

    // [R811 域A A→G 联动增强]: 高额税负心情影响
    if (wealthTax > 500 && state.needs) {
      state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 1);
    }

    // [R811 域A A→F 联动增强]: 记录经济健康度供UI展示
    if (state.flags) {
      state.flags._econHealth = {
        day: state.player ? state.player.day : 0,
        wealthTax: wealthTax,
        totalAssets: totalAssets,
        loanRate: loanRate,
        saturationPenalty: saturationPenalty,
      };
    }

    // [R822 域A A→H 联动增强]: 经济周期影响公司运营成本
    if (state.flags && state.corporate) {
      var _econCycle = state.flags._economicCycle || "normal";
      state.flags._corpCostMod = _econCycle === "recession" ? 1.15 : _econCycle === "boom" ? 0.9 : 1.0;
    }

    // [R822 域A A→B 联动增强]: 每月经济叙事
    if (state.flags && state.player && state.player.day % 30 === 1) {
      var _inf = state.flags._cumulativeInflation || 0;
      if (Math.abs(_inf) > 0.1 && (!state.flags._econNarrativeMonth || state.flags._econNarrativeMonth < state.player.day - 25)) {
        state.flags._econNarrativeMonth = state.player.day;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage(_inf > 0 ? "📊 经济月报：物价持续上涨，通货压力加大。" : "📊 经济月报：物价下行，通货紧缩风险显现。", "info");
        }
      }
    }

    // [R794 域A A→G 联动增强]: 经济健康度影响疲劳恢复 — 高通胀/高税负环境降低生活质量
    if (state.needs && state.flags) {
      var _econFatigueMod = 0;
      if (Math.abs(state.flags._cumulativeInflation || 0) > 0.15) _econFatigueMod += 1;
      if (wealthTax > 1000) _econFatigueMod += 1;
      if (getMarketSaturationPenalty(totalAssets, 10000000, difficulty) < 0.8) _econFatigueMod += 1;
      if (_econFatigueMod > 0) {
        state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + _econFatigueMod);
        if (state.player && state.player.day % 5 === 0 && _econFatigueMod >= 2) {
          if (typeof StateManager !== "undefined") {
            StateManager.addMessage("📉 经济环境不佳，生活压力让你感到格外疲惫。", "warning");
          }
        }
      }
    }

    // [R794 域A A→F 联动增强]: 记录价格趋势数据供UI展示
    if (state.flags && state.trade && state.trade._lastPrices) {
      if (!state.flags._priceTrendData) state.flags._priceTrendData = {};
      if (state.player) {
        var _trendDay = state.player.day || 0;
        for (var _tgid in state.trade._lastPrices) {
          if (state.trade._lastPrices.hasOwnProperty(_tgid)) {
            var _arr = state.trade._lastPrices[_tgid];
            if (_arr && _arr.length >= 2) {
              var _trend = _arr[_arr.length - 1] - _arr[0];
              state.flags._priceTrendData[_tgid] = {
                direction: _trend > 0.5 ? "up" : (_trend < -0.5 ? "down" : "stable"),
                change: Math.round(_trend * 100) / 100,
                day: _trendDay,
              };
            }
          }
        }
      }
    }

    // [R794 域A A→D 联动增强]: 经济周期影响NPC社交对话氛围
    if (state.flags && state.relationships && state.player) {
      if (!state.flags._econSocialDay || state.flags._econSocialDay < state.player.day - 10) {
        var _cumInf = state.flags._cumulativeInflation || 0;
        if (Math.abs(_cumInf) > 0.12) {
          state.flags._econSocialDay = state.player.day;
          if (typeof StateManager !== "undefined") {
            var _econMsg = _cumInf > 0
              ? "💬 街坊邻居都在抱怨物价又涨了，连老张小卖部的茶叶蛋都贵了5毛。"
              : "💬 菜市场的大妈高兴地说最近菜价便宜了不少，日子好过些了。";
            StateManager.addMessage(_econMsg, "hint");
          }
        }
      }
    }

    // [R1017 域A 联动增强 A→B]: 市场情绪叙事 — 经济周期/税收/通胀综合触发市场情绪文本
    if (state.flags && state.player && state.player.day % 15 === 0) {
      if (!state.flags._marketSentimentLog) state.flags._marketSentimentLog = [];
      var _sentiment = "neutral";
      if (wealthTax > 1000 && Math.abs(state.flags._cumulativeInflation || 0) > 0.15) {
        _sentiment = "bearish";
      } else if (wealthTax < 100 && (state.flags._cumulativeInflation || 0) < 0.05) {
        _sentiment = "bullish";
      }
      state.flags._marketSentimentLog.push({ day: state.player.day, sentiment: _sentiment });
      if (state.flags._marketSentimentLog.length > 20) state.flags._marketSentimentLog.shift();
      // 仅在情绪变化时通知
      var _prevSentiment = state.flags._prevMarketSentiment;
      if (_prevSentiment !== _sentiment && _sentiment !== "neutral" && typeof StateManager !== "undefined") {
        state.flags._prevMarketSentiment = _sentiment;
        StateManager.addMessage(
          _sentiment === "bullish" ? "📈 市场情绪向好，物价稳定，正是投资的好时机。" : "📉 市场情绪偏空，高通胀高税负让商人们谨慎观望。",
          "info"
        );
      }
    }

    // [R1017 域A 联动增强 A→G]: 经济压力影响睡眠质量 — 高通胀/高负债/低收入降低疲劳恢复
    if (state.needs && state.flags && state.player) {
      var _sleepDebtPenalty = 0;
      if (state.resources && (state.resources.bankDebt || 0) > 50000) _sleepDebtPenalty += 1;
      if (Math.abs(state.flags._cumulativeInflation || 0) > 0.15) _sleepDebtPenalty += 1;
      if (wealthTax > 500) _sleepDebtPenalty += 1;
      if (_sleepDebtPenalty > 0) {
        state.flags._sleepQualityPenalty = Math.min(5, _sleepDebtPenalty);
      } else {
        state.flags._sleepQualityPenalty = 0;
      }
    }

    // [R1017 域A 联动增强 A→F]: 经济指标仪表盘 — 汇总关键经济指标供UI渲染
    if (state.flags) {
      state.flags._econDashboard = {
        day: state.player ? state.player.day : 0,
        inflation: Math.round((state.flags._cumulativeInflation || 0) * 100) / 100,
        wealthTax: wealthTax,
        totalAssets: totalAssets,
        loanRate: loanRate,
        saturationPenalty: Math.round(saturationPenalty * 100) / 100,
        incomeMult: incomeMult,
        activeTaxTier: (getActiveTaxTier(totalAssets) || {}).label || "无",
        marketSentiment: state.flags._prevMarketSentiment || "neutral",
        sleepPenalty: state.flags._sleepQualityPenalty || 0,
      };
    }

    const effectiveCash = Math.max(0, cash - wealthTax);

    return {
      wealthTax,
      loanRate,
      consecutiveWinDecay: winDecay,
      marketSaturationPenalty: saturationPenalty,
      incomeMultiplier: incomeMult,
      effectiveCash,
      activeTaxTier: getActiveTaxTier(totalAssets),
      netDailyChange: -wealthTax,
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
    // [R1033 域A 联动增强 A→B]: 经济周期叙事 — 返回当前经济周期状态
    getEconomicCycleState: function (state) {
      if (!state || !state.flags) return "normal";
      var _inf = state.flags._cumulativeInflation || 0;
      var _confidence = state.flags._corpMarketConfidence || 0;
      if (_inf > 0.15 && _confidence < 30) return "recession";
      if (_inf < 0.05 && _confidence > 60) return "boom";
      return "normal";
    },
    // [R1033 域A 联动增强 A→C]: 技能市场需求指数 — 经济周期影响技能需求
    getSkillDemandIndex: function (state, skillId) {
      if (!state || !state.flags) return 1.0;
      var _cycle = this.getEconomicCycleState(state);
      if (_cycle === "boom") return 1.2;
      if (_cycle === "recession") return 0.8;
      return 1.0;
    },
    // [R1033 域A 联动增强 A→F]: 经济健康度评分 — 综合评分供UI展示
    getEconomicHealthScore: function (state) {
      if (!state || !state.flags || !state.resources) return 50;
      var _inf = Math.abs(state.flags._cumulativeInflation || 0);
      var _tax = state.flags._econDashboard ? state.flags._econDashboard.wealthTax || 0 : 0;
      var _cash = state.resources.cash || 0;
      var _score = 50;
      if (_inf < 0.05) _score += 10;
      else if (_inf > 0.2) _score -= 15;
      else if (_inf > 0.1) _score -= 5;
      if (_tax < 100) _score += 5;
      else if (_tax > 500) _score -= 10;
      if (_cash > 100000) _score += 10;
      else if (_cash > 10000) _score += 5;
      return Math.max(0, Math.min(100, _score));
    },
  };
})();

if (typeof window !== "undefined") {
  window.EconomySystem = EconomySystem;
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.economy_v3 = {
    id: "economy_v3",
    name: "经济平衡",
    icon: "⚖️",
    brief: "累进财富税/动态利率/难度收入曲线/市场饱和度",
    version: "1.0.0",
    related: ["mechanics:world_params", "mechanics:era_transform"],
    sections: [
      {
        kind: "desc",
        text: "中后期经济平衡系统。防止指数膨胀，让不同难度有不同体验。",
      },
      {
        kind: "list",
        items: [
          "四级累进财富税（¥20万~¥1000万+）",
          "动态村长债利率（基于总资产阶梯）",
          "连续盈利衰减（第4次后每次-8%）",
          "市场饱和度惩罚（玩家/城市财富比>20%后下降）",
          "难度收入曲线（困难模式收入×0.9但晋升×1.3）",
        ],
      },
    ],
  };
}
