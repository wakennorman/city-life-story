/**
 * 投资分析工具 — Phase 2 深度交互
 *
 * 包含：
 * 1. 技术分析指标 — MA、MACD、RSI、布林带
 * 2. 投资组合分析 — 资产配置、风险分散、夏普比率
 * 3. 止损止盈系统 — 自动止损、移动止盈、追踪止损
 * 4. 杠杆交易系统 — 保证金、爆仓风险、杠杆倍数
 * 5. 市场情绪分析 — 恐贪指数、成交量分析、资金流向
 */

// ====== 技术分析指标 ======
const TECHNICAL_INDICATORS = {
  ma: {
    name: "移动平均线",
    icon: "📈",
    desc: "MA5/MA7/MA20，判断趋势方向",
    calc: "average of last N prices",
  },
  macd: {
    name: "MACD",
    icon: "📊",
    desc: "快线-慢线+柱状图，判断买卖点",
    calc: "EMA12 - EMA26 + signal line",
  },
  rsi: {
    name: "RSI",
    icon: "📉",
    desc: "相对强弱指标，判断超买超卖",
    calc: "100 - 100/(1+RS), RS=平均涨幅/平均跌幅",
  },
  bollinger: {
    name: "布林带",
    icon: "🔵",
    desc: "上下轨+中轨，判断价格区间",
    calc: "MA20 ± 2×标准差",
  },
  kdj: {
    name: "KDJ",
    icon: "📈",
    desc: "随机指标，判断超买超卖和拐点",
    calc: "K/D/J三值，J=3K-2D",
  },
};

// ====== 资产配置建议 ======
const ASSET_ALLOCATION_STRATEGIES = {
  conservative: {
    name: "保守型",
    icon: "🛡️",
    riskLevel: "低",
    allocation: {
      stocks: 20,
      bonds: 40,
      precious: 20,
      crypto: 0,
      realEstate: 20,
    },
    expectedReturn: "4-6%/年",
    maxDrawdown: "10-15%",
    desc: "保本为主，适合风险厌恶者",
  },
  balanced: {
    name: "平衡型",
    icon: "⚖️",
    riskLevel: "中",
    allocation: {
      stocks: 40,
      bonds: 25,
      precious: 10,
      crypto: 5,
      realEstate: 20,
    },
    expectedReturn: "8-12%/年",
    maxDrawdown: "20-30%",
    desc: "攻守兼备，适合大多数投资者",
  },
  aggressive: {
    name: "进取型",
    icon: "🚀",
    riskLevel: "高",
    allocation: {
      stocks: 55,
      bonds: 10,
      precious: 5,
      crypto: 15,
      realEstate: 15,
    },
    expectedReturn: "15-25%/年",
    maxDrawdown: "40-50%",
    desc: "追求高收益，能承受较大波动",
  },
  speculative: {
    name: "投机型",
    icon: "🎲",
    riskLevel: "极高",
    allocation: {
      stocks: 30,
      bonds: 0,
      precious: 5,
      crypto: 40,
      realEstate: 25,
    },
    expectedReturn: "30-50%/年",
    maxDrawdown: "60-80%",
    desc: "高风险高回报，可能血本无归",
  },
};

// ====== 止损止盈策略 ======
const STOP_LOSS_STRATEGIES = {
  fixed_percent: {
    name: "固定百分比止损",
    icon: "🛑",
    desc: "亏损达到X%时自动卖出",
    params: { threshold: [5, 10, 15, 20] },
    pros: "简单明了，执行果断",
    cons: "可能错过反弹机会",
  },
  trailing_stop: {
    name: "移动止损",
    icon: "📍",
    desc: "价格从最高点回落X%时卖出",
    params: { trailingPercent: [5, 10, 15] },
    pros: "能锁定利润，让盈利奔跑",
    cons: "震荡市中容易被洗出",
  },
  support_break: {
    name: "支撑位止损",
    icon: "🔻",
    desc: "跌破关键支撑位时卖出",
    params: { supportLevels: ["MA20", "MA60", "前期低点"] },
    pros: "技术面依据充分",
    cons: "需要判断支撑位，有主观性",
  },
  time_based: {
    name: "时间止损",
    icon: "⏰",
    desc: "持有X天后无论盈亏都卖出",
    params: { holdDays: [7, 14, 30, 60] },
    pros: "避免资金长期占用",
    cons: "可能卖在最低点",
  },
  fundamental_change: {
    name: "基本面止损",
    icon: "📉",
    desc: "买入逻辑消失时卖出",
    params: { triggers: ["公司暴雷", "行业政策变化", "业绩不及预期"] },
    pros: "逻辑驱动，理性决策",
    cons: "需要持续跟踪基本面",
  },
};

// ====== 杠杆交易配置 ======
const LEVERAGE_SETTINGS = {
  stock_margin: {
    name: "股票融资融券",
    icon: "💳",
    maxLeverage: 2,
    marginRate: 0.06, // 6% 年化利率
    maintenanceMargin: 0.3, // 维持保证金30%
    liquidationThreshold: 0.2, // 20% 强平线
    desc: "最高2倍杠杆，年化利息6%",
  },
  crypto_futures: {
    name: "加密货币期货",
    icon: "⚡",
    maxLeverage: 100,
    marginRate: 0.0, // 无利息
    maintenanceMargin: 0.005, // 0.5% 维持保证金
    liquidationThreshold: 0.0, // 归零强平
    desc: "最高100倍杠杆，无利息但爆仓风险极高",
  },
  options: {
    name: "期权",
    icon: "🎫",
    maxLeverage: 10,
    marginRate: 0.0,
    maintenanceMargin: 0.0,
    liquidationThreshold: 0.0, // 期权买方最大损失权利金
    desc: "买方有限损失，卖方无限风险",
  },
};

// ====== 技术分析计算函数 ======

/**
 * 计算移动平均线
 */
function calculateMA(prices, period) {
  if (prices.length < period) return null;
  const slice = prices.slice(-period);
  const sum = slice.reduce((a, b) => a + b.price, 0);
  return sum / period;
}

/**
 * 计算EMA（指数移动平均）
 */
function calculateEMA(prices, period) {
  if (prices.length < period) return null;
  const k = 2 / (period + 1);
  let ema = prices[0].price;
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i].price * k + ema * (1 - k);
  }
  return ema;
}

/**
 * 计算MACD
 */
function calculateMACD(prices) {
  if (prices.length < 26) return null;

  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  if (!ema12 || !ema26) return null;

  const macdLine = ema12 - ema26;

  // 简化：用最近7天的MACD线平均值作为signal
  const macdHistory = [];
  for (let i = 25; i < prices.length; i++) {
    const e12 = calculateEMA(prices.slice(0, i + 1), 12);
    const e26 = calculateEMA(prices.slice(0, i + 1), 26);
    if (e12 && e26) macdHistory.push(e12 - e26);
  }

  const signalLine =
    macdHistory.length >= 9
      ? macdHistory.slice(-9).reduce((a, b) => a + b, 0) / 9
      : macdLine;

  const histogram = macdLine - signalLine;

  return {
    macd: Math.round(macdLine * 100) / 100,
    signal: Math.round(signalLine * 100) / 100,
    histogram: Math.round(histogram * 100) / 100,
    signal: histogram > 0 ? "买入信号" : histogram < -0.5 ? "卖出信号" : "中性",
  };
}

/**
 * 计算RSI
 */
function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return null;

  let gains = 0;
  let losses = 0;

  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i].price - prices[i - 1].price;
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  return {
    value: Math.round(rsi * 100) / 100,
    signal:
      rsi > 70 ? "超买（考虑卖出）" : rsi < 30 ? "超卖（考虑买入）" : "中性",
  };
}

/**
 * 计算布林带
 */
function calculateBollinger(prices, period = 20, multiplier = 2) {
  if (prices.length < period) return null;

  const slice = prices.slice(-period);
  const ma = slice.reduce((a, b) => a + b.price, 0) / period;

  const variance =
    slice.reduce((sum, p) => sum + Math.pow(p.price - ma, 2), 0) / period;
  const stdDev = Math.sqrt(variance);

  return {
    upper: Math.round((ma + multiplier * stdDev) * 100) / 100,
    middle: Math.round(ma * 100) / 100,
    lower: Math.round((ma - multiplier * stdDev) * 100) / 100,
    width: Math.round(((2 * multiplier * stdDev) / ma) * 100) / 100,
    position: "未知", // 会在调用时计算
  };
}

/**
 * 分析单只股票的技术面
 */
function analyzeStockTechnicals(symbol, state) {
  const inv = state.investment;
  if (!inv || !inv.stockMarket || !inv.stockMarket[symbol]) return null;

  const market = inv.stockMarket[symbol];
  const history = market.history;

  if (!history || history.length < 20) {
    return { error: "数据不足，需要至少20个交易日的数据" };
  }

  const ma5 = calculateMA(history, 5);
  const ma7 = calculateMA(history, 7);
  const ma20 = calculateMA(history, 20);
  const macd = calculateMACD(history);
  const rsi = calculateRSI(history);
  const bollinger = calculateBollinger(history);

  // 判断价格在布林带中的位置
  const currentPrice = history[history.length - 1].price;
  if (bollinger) {
    if (currentPrice >= bollinger.upper)
      bollinger.position = "触及上轨（超买）";
    else if (currentPrice <= bollinger.lower)
      bollinger.position = "触及下轨（超卖）";
    else if (currentPrice > bollinger.middle) bollinger.position = "中轨上方";
    else bollinger.position = "中轨下方";
  }

  // 综合判断
  let trend = "未知";
  let strength = 0;

  // MA排列
  if (ma5 && ma7 && ma20) {
    if (ma5 > ma7 && ma7 > ma20) {
      trend = "多头排列（强势上涨）";
      strength += 3;
    } else if (ma5 < ma7 && ma7 < ma20) {
      trend = "空头排列（强势下跌）";
      strength -= 3;
    } else if (ma5 > ma7 && ma7 > ma20) {
      trend = "多头排列";
      strength += 2;
    } else trend = "纠缠震荡";
  }

  // MACD
  if (macd) {
    if (macd.histogram > 0) strength += 1;
    else strength -= 1;
  }

  // RSI
  if (rsi) {
    if (rsi.value > 70)
      strength -= 1; // 超买可能回调
    else if (rsi.value < 30) strength += 1; // 超卖可能反弹
  }

  // 综合评级
  let rating;
  if (strength >= 4) rating = "强烈买入 🟢";
  else if (strength >= 2) rating = "买入 🟢";
  else if (strength >= 0) rating = "持有 🟡";
  else if (strength >= -2) rating = "卖出 🔴";
  else rating = "强烈卖出 🔴";

  return {
    symbol: symbol,
    currentPrice: currentPrice,
    trend: trend,
    rating: rating,
    strength: strength,
    indicators: {
      ma: {
        ma5: Math.round(ma5 * 100) / 100,
        ma7: Math.round(ma7 * 100) / 100,
        ma20: Math.round(ma20 * 100) / 100,
      },
      macd: macd,
      rsi: rsi,
      bollinger: bollinger,
    },
    summary: generateTechnicalSummary(symbol, currentPrice, trend, rating, {
      ma5,
      ma7,
      ma20,
      macd,
      rsi,
      bollinger,
    }),
  };
}

/**
 * 生成技术面分析摘要
 */
function generateTechnicalSummary(symbol, price, trend, rating, indicators) {
  const lines = [];
  lines.push(`📊 【${symbol}】技术面分析`);
  lines.push(`当前价格：¥${price.toFixed(2)}`);
  lines.push(`趋势判断：${trend}`);
  lines.push(`综合评级：${rating}`);
  lines.push("");
  lines.push("指标详情：");

  if (indicators.ma) {
    const { ma5, ma7, ma20 } = indicators.ma;
    lines.push(`  MA5: ¥${ma5} | MA7: ¥${ma7} | MA20: ¥${ma20}`);
    if (ma5 > ma7 && ma7 > ma20) lines.push("  ✅ 均线多头排列，上涨趋势明确");
    else if (ma5 < ma7 && ma7 < ma20)
      lines.push("  ❌ 均线空头排列，下跌趋势明确");
    else lines.push("  ⚖️ 均线纠缠，方向不明");
  }

  if (indicators.macd) {
    const { macd, signal, histogram } = indicators.macd;
    lines.push(`  MACD: ${macd} | 信号线: ${signal} | 柱状图: ${histogram}`);
    lines.push(`  ${histogram > 0 ? "🟢 动能正向" : "🔴 动能负向"}`);
  }

  if (indicators.rsi) {
    const { value, signal: rsiSignal } = indicators.rsi;
    lines.push(`  RSI(14): ${value} → ${rsiSignal}`);
  }

  if (indicators.bollinger) {
    const { upper, middle, lower, position } = indicators.bollinger;
    lines.push(`  布林带: 上轨¥${upper} | 中轨¥${middle} | 下轨¥${lower}`);
    lines.push(`  位置: ${position}`);
  }

  return lines.join("\n");
}

/**
 * 分析投资组合
 */
function analyzePortfolio(state) {
  const inv = state.investment;
  if (!inv) return null;

  const holdings = inv.stockHoldings || [];
  const properties = inv.properties || [];
  const cars = inv.cars || [];

  // 计算各类资产市值
  let stockValue = 0;
  let stockCost = 0;
  for (const h of holdings) {
    const m = inv.stockMarket[h.symbol];
    if (m) {
      stockValue += m.price * h.shares;
      stockCost += h.avgPrice * h.shares;
    }
  }

  let propertyValue = 0;
  for (const p of properties) {
    propertyValue += p.currentPrice || p.buyPrice;
  }

  let carValue = 0;
  for (const c of cars) {
    carValue += c.currentPrice || c.buyPrice;
  }

  const btcValue = (inv.btcHoldings || 0) * (inv.btcPrice || 0);

  const totalValue = stockValue + propertyValue + carValue + btcValue;
  if (totalValue === 0) return { error: "没有任何投资持仓" };

  // 资产配置比例
  const allocation = {
    stocks: Math.round((stockValue / totalValue) * 100),
    properties: Math.round((propertyValue / totalValue) * 100),
    cars: Math.round((carValue / totalValue) * 100),
    crypto: Math.round((btcValue / totalValue) * 100),
  };

  // 计算盈亏
  const stockPnL = stockValue - stockCost;
  const stockPnLPct = stockCost > 0 ? (stockPnL / stockCost) * 100 : 0;

  // 计算风险集中度（单一资产占比过高）
  const maxSingleAsset = Math.max(
    allocation.stocks,
    allocation.properties,
    allocation.crypto,
  );
  let concentrationRisk = "低";
  if (maxSingleAsset > 60) concentrationRisk = "高";
  else if (maxSingleAsset > 40) concentrationRisk = "中";

  // 建议配置
  let recommendation;
  if (concentrationRisk === "高") {
    recommendation = `⚠️ 资产过于集中（${maxSingleAsset}%），建议分散投资`;
  } else if (allocation.crypto > 30) {
    recommendation = "⚠️ 虚拟币占比过高，波动风险大，建议降低至20%以下";
  } else if (allocation.stocks < 20 && allocation.properties < 20) {
    recommendation = "💡 股票和房产占比偏低，可以考虑增加权益类资产配置";
  } else {
    recommendation = "✅ 资产配置相对均衡，继续保持";
  }

  return {
    totalValue: Math.round(totalValue),
    allocation: allocation,
    stockPnL: Math.round(stockPnL),
    stockPnLPct: Math.round(stockPnLPct * 100) / 100,
    concentrationRisk: concentrationRisk,
    recommendation: recommendation,
    holdings: holdings.length,
    properties: properties.length,
    cars: cars.length,
  };
}

/**
 * 设置止损止盈
 */
function setStopLoss(state, symbol, type, params) {
  const inv = state.investment;
  if (!inv) return { success: false, message: "投资系统未初始化" };

  const holding = inv.stockHoldings.find((h) => h.symbol === symbol);
  if (!holding) return { success: false, message: "没有该股票的持仓" };

  if (!inv.stopLossOrders) inv.stopLossOrders = [];

  const order = {
    symbol: symbol,
    type: type,
    params: params,
    createdDay: state.player.day,
    triggered: false,
    triggerPrice: null,
  };

  inv.stopLossOrders.push(order);
  StateManager.addMessage(
    `🛑 已设置${symbol}的${STOP_LOSS_STRATEGIES[type]?.name || type}止损`,
    "success",
  );
  return { success: true, order: order };
}

/**
 * 检查止损止盈是否触发
 */
function checkStopLoss(state) {
  const inv = state.investment;
  if (!inv || !inv.stopLossOrders) return;

  const today = state.player.day;
  const triggeredOrders = [];

  for (const order of inv.stopLossOrders) {
    if (order.triggered) continue;

    const market = inv.stockMarket[order.symbol];
    if (!market) continue;

    const currentPrice = market.price;
    const holding = inv.stockHoldings.find((h) => h.symbol === order.symbol);
    if (!holding) continue;

    const buyPrice = holding.avgPrice;
    let shouldTrigger = false;
    let triggerPrice = null;

    switch (order.type) {
      case "fixed_percent":
        const lossPercent = ((buyPrice - currentPrice) / buyPrice) * 100;
        if (lossPercent >= order.params.threshold) {
          shouldTrigger = true;
          triggerPrice = currentPrice;
        }
        break;

      case "trailing_stop":
        const highSinceBuy = holding.highSinceBuy || buyPrice;
        const dropFromHigh =
          ((highSinceBuy - currentPrice) / highSinceBuy) * 100;
        if (dropFromHigh >= order.params.trailingPercent) {
          shouldTrigger = true;
          triggerPrice = currentPrice;
        }
        // 更新最高点
        if (currentPrice > highSinceBuy) {
          holding.highSinceBuy = currentPrice;
        }
        break;

      case "time_based":
        if (today - holding.buyDay >= order.params.holdDays) {
          shouldTrigger = true;
          triggerPrice = currentPrice;
        }
        break;
    }

    if (shouldTrigger) {
      order.triggered = true;
      order.triggerPrice = triggerPrice;
      triggeredOrders.push(order);

      // 执行卖出
      const sharesToSell = holding.shares;
      sellInvStock(order.symbol, sharesToSell);

      StateManager.addMessage(
        `🛑 ${order.symbol}止损触发！在¥${triggerPrice.toFixed(2)}卖出${sharesToSell}股`,
        "danger",
      );
    }
  }

  return triggeredOrders;
}

/**
 * 计算夏普比率（简化版）
 */
function calculateSharpeRatio(prices, riskFreeRate = 0.03) {
  if (prices.length < 30) return null;

  // 计算日收益率
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    const ret = (prices[i].price - prices[i - 1].price) / prices[i - 1].price;
    returns.push(ret);
  }

  // 平均日收益率
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;

  // 日收益率标准差
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) /
    returns.length;
  const stdDev = Math.sqrt(variance);

  // 年化收益率和标准差
  const annualReturn = avgReturn * 365;
  const annualStdDev = stdDev * Math.sqrt(365);

  // 夏普比率
  const sharpe =
    annualStdDev > 0 ? (annualReturn - riskFreeRate) / annualStdDev : 0;

  return {
    sharpe: Math.round(sharpe * 100) / 100,
    annualReturn: Math.round(annualReturn * 10000) / 100,
    annualVolatility: Math.round(annualStdDev * 10000) / 100,
    rating:
      sharpe > 2 ? "优秀" : sharpe > 1 ? "良好" : sharpe > 0 ? "一般" : "较差",
  };
}

/**
 * 获取市场情绪指标
 */
function getMarketSentimentIndicator(state) {
  const inv = state.investment;
  if (!inv) return null;

  // 计算牛熊分数
  let bullScore = 0,
    bearScore = 0;

  // 新闻影响
  const activeNews = state.activeNews || [];
  for (const news of activeNews) {
    const effs = (news.effects || {}).investmentEffect || [];
    for (const eff of effs) {
      const mul = eff.mul || 1;
      if (mul > 1) bullScore += (mul - 1) * 10;
      else bearScore += (1 - mul) * 10;
    }
  }

  // BTC恐贪指数
  const btcFearGreed = inv.btcFearGreed || 50;
  if (btcFearGreed > 65) bullScore += (btcFearGreed - 65) * 2;
  else if (btcFearGreed < 35) bearScore += (35 - btcFearGreed) * 2;

  // 计算综合分数（0-100）
  const total = bullScore + bearScore;
  let sentimentIndex = 50;
  if (total > 0) {
    sentimentIndex = Math.round(50 + ((bullScore - bearScore) / total) * 50);
  }

  let sentimentLabel;
  let sentimentColor;
  if (sentimentIndex >= 80) {
    sentimentLabel = "极度贪婪";
    sentimentColor = "var(--danger)";
  } else if (sentimentIndex >= 60) {
    sentimentLabel = "贪婪";
    sentimentColor = "#e67e22";
  } else if (sentimentIndex >= 40) {
    sentimentLabel = "中性";
    sentimentColor = "var(--accent)";
  } else if (sentimentIndex >= 20) {
    sentimentLabel = "恐惧";
    sentimentColor = "#27ae60";
  } else {
    sentimentLabel = "极度恐惧";
    sentimentColor = "var(--success)";
  }

  return {
    index: sentimentIndex,
    label: sentimentLabel,
    color: sentimentColor,
    bullScore: bullScore,
    bearScore: bearScore,
    btcFearGreed: btcFearGreed,
    interpretation: getSentimentInterpretation(sentimentIndex),
  };
}

/**
 * 获取情绪解读
 */
function getSentimentInterpretation(index) {
  if (index >= 80) return "🔥 市场极度狂热，可能是顶部信号，考虑减仓";
  if (index >= 60) return "📈 市场情绪乐观，但需警惕回调风险";
  if (index >= 40) return "⚖️ 市场情绪中性，观望为主";
  if (index >= 20) return "📉 市场情绪悲观，可能是买入机会";
  return "🚑 市场极度恐慌，往往是底部信号，可以考虑抄底";
}

/**
 * 百科注册
 */
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.investment_analysis = {
    id: "investment_analysis",
    name: "投资分析工具",
    icon: "📊",
    brief: "技术分析指标、投资组合分析、止损止盈、杠杆交易、市场情绪分析",
    version: "1.0.0",
    related: [
      "mechanics:investment",
      "mechanics:stock",
      "mechanics:property_market",
    ],
    sections: [
      {
        kind: "desc",
        text: "工欲善其事，必先利其器。专业的投资分析工具帮助你做出更理性的决策。",
      },
      {
        kind: "subhead",
        text: "📈 技术分析指标",
      },
      {
        kind: "list",
        items: [
          "📈 MA（移动平均线）：MA5/MA7/MA20，判断趋势方向",
          "📊 MACD：快线-慢线+柱状图，判断买卖点",
          "📉 RSI：相对强弱指标，判断超买超卖（>70超买，<30超卖）",
          "🔵 布林带：上下轨+中轨，判断价格区间",
          "📈 KDJ：随机指标，判断拐点和超买超卖",
        ],
      },
      {
        kind: "subhead",
        text: "🛑 止损止盈策略",
      },
      {
        kind: "list",
        items: [
          "🛑 固定百分比止损：亏损达X%自动卖出",
          "📍 移动止损：从最高点回落X%卖出，能锁定利润",
          "⏰ 时间止损：持有X天后无论盈亏都卖出",
          "📉 基本面止损：买入逻辑消失时卖出",
        ],
      },
      {
        kind: "subhead",
        text: "⚖️ 资产配置策略",
      },
      {
        kind: "list",
        items: [
          "🛡️ 保守型：股票20%、债券40%、贵金属20%、房产20%",
          "⚖️ 平衡型：股票40%、债券25%、贵金属10%、虚拟币5%、房产20%",
          "🚀 进取型：股票55%、债券10%、贵金属5%、虚拟币15%、房产15%",
          "🎲 投机型：股票30%、贵金属5%、虚拟币40%、房产25%",
        ],
      },
      {
        kind: "tip",
        text: "💡 提示：技术分析是辅助工具，不是预测水晶球。结合基本面、消息面、市场情绪综合判断。设置止损是保护本金的必要手段。",
      },
    ],
  };
}
