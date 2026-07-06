/**
 * 投资系统 — 股票 / 比特币 / 房产 / 汽车
 *
 * 与旧 stock.js 兼容：showStockTradeModal() 作为桥接函数跳转到新投资面板。
 * syncStockToInvestment() 在 endDay 时将旧 corporate.stocks 数据迁移到 investment。
 * 新投资面板通过 showInvestmentModal(activeTab) 统一入口。
 */

// ====== 股票数据 ======
const INVEST_STOCK_LIST = [
  {
    symbol: "STAR",
    name: "星辰科技",
    basePrice: 120,
    sector: "科技",
    volatility: 0.08, // 降低：从0.12到0.08
  },
  {
    symbol: "BYTE",
    name: "字节龙",
    basePrice: 280,
    sector: "科技",
    volatility: 0.1, // 降低：从0.15到0.1
  },
  {
    symbol: "GAME",
    name: "好玩游戏",
    basePrice: 45,
    sector: "娱乐",
    volatility: 0.12, // 降低：从0.18到0.12
  },
  {
    symbol: "SAFE",
    name: "安信金融",
    basePrice: 65,
    sector: "金融",
    volatility: 0.06, // 降低：从0.1到0.06
  },
  {
    symbol: "BREW",
    name: "醇香酒业",
    basePrice: 38,
    sector: "消费",
    volatility: 0.06, // 降低：从0.08到0.06
  },
  {
    symbol: "DRUG",
    name: "康健药业",
    basePrice: 92,
    sector: "医药",
    volatility: 0.09, // 降低：从0.14到0.09
  },
  {
    symbol: "OIL",
    name: "远东石油",
    basePrice: 55,
    sector: "能源",
    volatility: 0.12, // 降低：从0.2到0.12
  },
  {
    symbol: "ESTATE",
    name: "鼎盛地产",
    basePrice: 30,
    sector: "地产",
    volatility: 0.14, // 降低：从0.22到0.14
  },
];

// ====== 房产数据 ======
const REAL_ESTATE_TYPES = [
  {
    id: "old_flat",
    name: "老破小",
    price: 500000,
    monthlyRent: 1500,
    appreciationRate: 0.001, // 月升值率0.1%
    desc: "30年老房，位置还行，租售比不错。",
    icon: "🏚️",
  },
  {
    id: "nice_apartment",
    name: "精装两居",
    price: 1500000,
    monthlyRent: 3500,
    appreciationRate: 0.002,
    desc: "地段好的精装公寓，稳定增值。",
    icon: "🏢",
  },
  {
    id: "luxury_condo",
    name: "江景豪宅",
    price: 5000000,
    monthlyRent: 8000,
    appreciationRate: 0.003,
    desc: "稀缺江景资源，长期升值潜力大。",
    icon: "🏰",
  },
  {
    id: "street_shop",
    name: "街边商铺",
    price: 800000,
    monthlyRent: 5000,
    appreciationRate: 0.0015,
    desc: "人流量大的商铺，租金回报率高。",
    icon: "🏪",
  },
  {
    id: "office_building",
    name: "写字楼",
    price: 2000000,
    monthlyRent: 6000,
    appreciationRate: 0.002,
    desc: "CBD写字楼，稳健投资。",
    icon: "🏛️",
  },
];

// ====== 汽车数据 ======
const VEHICLE_TYPES = [
  {
    id: "used_van",
    name: "二手面包车",
    price: 30000,
    depreciationRate: 0.003, // 月贬值0.3%
    monthlyMaint: 200,
    apBonus: 5,
    desc: "破旧但实用的面包车，出行效率提升。",
    icon: "🚐",
  },
  {
    id: "family_sedan",
    name: "家用轿车",
    price: 120000,
    depreciationRate: 0.004,
    monthlyMaint: 500,
    apBonus: 10,
    desc: "体面的家用车，出行更方便更舒适。",
    icon: "🚗",
  },
  {
    id: "luxury_sports",
    name: "豪华跑车",
    price: 500000,
    depreciationRate: 0.006,
    monthlyMaint: 2000,
    apBonus: 15,
    desc: "拉风跑车，出行效率最高，但保养费惊人。",
    icon: "🏎️",
  },
];

// ====== 比特币市场事件 ======
const BTC_EVENTS = [
  { text: "🚀 比特币突破历史新高！", fearChange: 20, priceMod: 1.15 },
  { text: "📉 比特币闪崩30%！", fearChange: -25, priceMod: 0.7 },
  { text: "🏦 某国宣布比特币合法化", fearChange: 15, priceMod: 1.08 },
  { text: "⚠️ 某国封杀加密货币交易", fearChange: -20, priceMod: 0.8 },
  { text: "⛏️ 算力创新高，网络安全增强", fearChange: 5, priceMod: 1.03 },
  { text: "💰 机构大举买入比特币", fearChange: 10, priceMod: 1.06 },
  { text: "😱 交易所被盗5万枚BTC", fearChange: -15, priceMod: 0.85 },
  { text: "📊 BTC ETF获批，资金涌入", fearChange: 18, priceMod: 1.1 },
];

// ====== 股票新闻事件 ======
const STOCK_NEWS = [
  { sector: "科技", text: "AI大模型突破，科技股暴涨", priceMod: 1.12 },
  { sector: "科技", text: "科技公司大规模裁员", priceMod: 0.88 },
  { sector: "娱乐", text: "爆款游戏上线，流水破亿", priceMod: 1.15 },
  { sector: "娱乐", text: "版号收紧，游戏股承压", priceMod: 0.85 },
  { sector: "金融", text: "央行降息，金融股利好", priceMod: 1.08 },
  { sector: "金融", text: "金融监管加强，银行股下跌", priceMod: 0.9 },
  { sector: "消费", text: "消费升级趋势明显", priceMod: 1.06 },
  { sector: "消费", text: "消费降级，白酒股受挫", priceMod: 0.92 },
  { sector: "医药", text: "创新药获批，医药股大涨", priceMod: 1.14 },
  { sector: "医药", text: "集采降价超预期", priceMod: 0.82 },
  { sector: "能源", text: "国际油价飙升", priceMod: 1.18 },
  { sector: "能源", text: "新能源冲击传统能源", priceMod: 0.88 },
  { sector: "地产", text: "限购松绑，地产股反弹", priceMod: 1.16 },
  { sector: "地产", text: "房企暴雷，地产股暴跌", priceMod: 0.75 },
];

// ====== 初始化 ======

/** 初始化投资市场 */
function initInvestmentMarket(state) {
  const inv = state.investment;
  // 初始化股票市场
  for (const stock of INVEST_STOCK_LIST) {
    inv.stockMarket[stock.symbol] = {
      price: stock.basePrice * Random.float(0.8, 1.2),
      prevPrice: stock.basePrice,
      trend: 0, // -2 ~ +2 趋势
      history: [],
    };
  }
  // 比特币初始价
  inv.bitcoinMarket.price = 200000 * Random.float(0.85, 1.15);
  inv.bitcoinMarket.prevPrice = inv.bitcoinMarket.price;
  inv.bitcoinMarket.fearGreed = Random.int(40, 69);
  inv.bitcoinMarket.halvingCountdown = Random.int(1000, 1459);
}

// ====== 每日市场更新 ======

/** 每日市场更新（在 endDay 中调用） */
function tickInvestmentDaily(state) {
  const inv = state.investment;

  // 如果市场未初始化则初始化
  if (Object.keys(inv.stockMarket).length === 0) {
    initInvestmentMarket(state);
  }

  // === 股票更新 ===
  for (const stock of INVEST_STOCK_LIST) {
    const market = inv.stockMarket[stock.symbol];
    if (!market) continue;

    market.prevPrice = market.price;

    // 均值回归力
    const meanPull =
      ((stock.basePrice - market.price) / stock.basePrice) * 0.02;
    // 趋势延续
    const trendForce = market.trend * 0.005;
    // 随机波动
    const randomWalk = Random.float(-0.5, 0.5) * stock.volatility;
    // 总变化
    const change = meanPull + trendForce + randomWalk;

    market.price = Math.max(1, market.price * (1 + change));
    market.price = Math.round(market.price * 100) / 100;

    // 趋势衰减+随机漂移
    market.trend = market.trend * 0.7 + Random.float(-0.5, 0.5) * 0.8;
    market.trend = Math.max(-2, Math.min(2, market.trend));

    // 历史记录
    market.history.push(market.price);
    if (market.history.length > 30) market.history.shift();
  }

  // 随机股票新闻（5%概率）
  if (Random.chance(0.05)) {
    const news = Random.fromArray(STOCK_NEWS);
    for (const stock of INVEST_STOCK_LIST) {
      if (stock.sector === news.sector) {
        const market = inv.stockMarket[stock.symbol];
        if (market) {
          market.price = Math.max(1, market.price * news.priceMod);
          market.price = Math.round(market.price * 100) / 100;
        }
      }
    }
    StateManager.addMessage(`📰 ${news.text}`, "event");
  }

  // === 比特币更新 ===
  const btc = inv.bitcoinMarket;
  btc.prevPrice = btc.price;

  // 减半倒计时
  btc.halvingCountdown--;
  if (btc.halvingCountdown <= 0) {
    btc.halvingCountdown = 1460;
    btc.price *= 1.3; // 减半后历史性上涨30%
    StateManager.addMessage("⛏️ 比特币减半！矿工奖励减半，价格暴涨！", "event");
  }

  // 恐慌贪婪指数波动
  btc.fearGreed += Random.float(-0.5, 0.5) * 15;
  btc.fearGreed = Math.max(5, Math.min(95, btc.fearGreed));
  // 恐贪指数回归中值
  btc.fearGreed += (50 - btc.fearGreed) * 0.02;

  // 价格波动
  const fearMod = (btc.fearGreed - 50) / 200; // 贪婪时偏涨，恐慌时偏跌
  const btcVolatility = 0.05 + Math.abs(fearMod) * 0.1;
  const btcChange = fearMod + Random.float(-0.5, 0.5) * btcVolatility;
  btc.price = Math.max(10000, btc.price * (1 + btcChange));
  btc.price = Math.round(btc.price);

  // 随机BTC事件（2%概率）
  if (Random.chance(0.02)) {
    const evt = Random.fromArray(BTC_EVENTS);
    btc.price = Math.max(10000, Math.round(btc.price * evt.priceMod));
    btc.fearGreed = Math.max(5, Math.min(95, btc.fearGreed + evt.fearChange));
    StateManager.addMessage(`₿ ${evt.text}`, "event");
  }

  // === 房产月度更新 ===
  if (state.player.day % 30 === 0) {
    for (const prop of inv.realEstate) {
      // 收租金
      state.resources.cash += prop.monthlyRent;
      state.resources.totalEarned += prop.monthlyRent;
      // 房产升值
      const typeDef = REAL_ESTATE_TYPES.find((t) => t.id === prop.type);
      if (typeDef) {
        prop.currentValue = Math.round(
          prop.currentValue *
            (1 + typeDef.appreciationRate + Random.float(-0.5, 0.5) * 0.002),
        );
      }
    }
    // 汽车贬值
    for (const car of inv.vehicles) {
      const typeDef = VEHICLE_TYPES.find((v) => v.id === car.type);
      if (typeDef) {
        car.currentValue = Math.round(
          car.currentValue * (1 - typeDef.depreciationRate),
        );
        // 扣保养费
        if (state.resources.cash >= typeDef.monthlyMaint) {
          state.resources.cash -= typeDef.monthlyMaint;
        } else {
          StateManager.addMessage(
            `⚠️ 付不起${car.name}保养费¥${typeDef.monthlyMaint}！`,
            "danger",
          );
        }
      }
    }
  }
}

// ====== AP 计算 ======

/** 计算当前AP上限（含汽车加成） */
function calcMaxAP(state) {
  let maxAP = 100;
  // 汽车加成
  for (const car of state.investment.vehicles) {
    const typeDef = VEHICLE_TYPES.find((v) => v.id === car.type);
    if (typeDef) maxAP += typeDef.apBonus;
  }
  return maxAP;
}

/** 消耗AP，返回是否成功。AP不足时自动推进时段并恢复 */
function consumeAP(amount) {
  const state = StateManager.getState();
  if (state.player.actionPoints < amount) {
    // AP不足：自动推进到下一个时段
    const oldSlot = state.player.timeSlot;
    if (typeof advanceTimeSlot === "function") {
      advanceTimeSlot();
    }
    // 恢复AP（新时段恢复40AP，上限为maxAP）
    const recoveryAP = 40;
    const maxAP = calcMaxAP(state);
    state.player.actionPoints = Math.min(maxAP, recoveryAP);
    StateManager.addMessage(
      `⏰ AP不足，时间从${oldSlot === "morning" ? "上午" : oldSlot === "afternoon" ? "下午" : "晚上"}推进。恢复${recoveryAP}AP。`,
      "info",
    );
    // 推进后仍然扣减本次AP
    state.player.actionPoints = Math.max(0, state.player.actionPoints - amount);
    // 如果还是不够（极端情况），再推进一次
    if (state.player.actionPoints <= 0 && amount > 0) {
      if (typeof advanceTimeSlot === "function") {
        advanceTimeSlot();
      }
      state.player.actionPoints = Math.min(maxAP, recoveryAP);
      state.player.actionPoints = Math.max(
        0,
        state.player.actionPoints - Math.min(amount, state.player.actionPoints),
      );
    }
    return true; // 允许操作继续
  }
  state.player.actionPoints -= amount;
  // AP耗尽到0时推进时段
  if (state.player.actionPoints <= 0) {
    state.player.actionPoints = 0;
    if (typeof advanceTimeSlot === "function") {
      advanceTimeSlot();
    }
    // 恢复部分AP（新时段开始恢复40AP）
    const recoveryAP = 40;
    const maxAP = calcMaxAP(state);
    state.player.actionPoints = Math.min(maxAP, recoveryAP);
    StateManager.addMessage(
      `⏰ 行动力耗尽，时间推进。恢复${recoveryAP}AP。`,
      "info",
    );
  }
  return true;
}

/** 获取两个地点间的旅行AP消耗 */
function getTravelAPCost(fromKey, toKey) {
  const dist = TRAVEL_DISTANCES[fromKey]?.[toKey];
  if (dist) return dist * AP_COSTS.travel_per_distance;
  // 不在距离表中则默认中等距离
  return 2 * AP_COSTS.travel_per_distance;
}

// ====== 投资操作 ======

/** 买入股票 */
function investBuyStock(symbol, shares) {
  const state = StateManager.getState();
  const market = state.investment.stockMarket[symbol];
  if (!market) {
    StateManager.addMessage("⚠️ 不存在的股票。", "danger");
    return false;
  }
  const stockDef = INVEST_STOCK_LIST.find((s) => s.symbol === symbol);

  const cost = Math.round(market.price * shares);
  if (state.resources.cash < cost) {
    StateManager.addMessage(
      `⚠️ 需要 ¥${cost.toLocaleString()}，现金不足。`,
      "danger",
    );
    return false;
  }

  if (!consumeAP(AP_COSTS.trade_stock)) return false;

  state.resources.cash -= cost;
  const existing = state.investment.stocks.find((s) => s.symbol === symbol);
  if (existing) {
    const totalShares = existing.shares + shares;
    existing.avgPrice =
      Math.round(
        ((existing.avgPrice * existing.shares + cost) / totalShares) * 100,
      ) / 100;
    existing.shares = totalShares;
  } else {
    state.investment.stocks.push({
      symbol,
      name: stockDef ? stockDef.name : symbol,
      shares,
      avgPrice: market.price,
    });
  }

  StateManager.addMessage(
    `📈 买入 ${symbol} ×${shares}股，均价 ¥${market.price.toFixed(1)}，共 ¥${cost.toLocaleString()}`,
    "success",
  );
  return true;
}

/** 卖出股票 */
function investSellStock(symbol, shares) {
  const state = StateManager.getState();
  const holding = state.investment.stocks.find((s) => s.symbol === symbol);
  if (!holding || holding.shares < shares) {
    StateManager.addMessage("⚠️ 持仓不足。", "danger");
    return false;
  }

  if (!consumeAP(AP_COSTS.trade_stock)) return false;

  const market = state.investment.stockMarket[symbol];
  const revenue = Math.round(market.price * shares);
  const profit = revenue - holding.avgPrice * shares;

  state.resources.cash += revenue;
  state.resources.totalEarned += Math.max(0, profit);

  holding.shares -= shares;
  if (holding.shares <= 0) {
    state.investment.stocks = state.investment.stocks.filter(
      (s) => s.symbol !== symbol,
    );
  }

  const profitStr =
    profit >= 0
      ? `📈 盈利 ¥${Math.round(profit).toLocaleString()}`
      : `📉 亏损 ¥${Math.abs(Math.round(profit)).toLocaleString()}`;
  StateManager.addMessage(
    `💰 卖出 ${symbol} ×${shares}股，¥${revenue.toLocaleString()}。${profitStr}`,
    "success",
  );
  return true;
}

/** 买入比特币 */
function investBuyBitcoin(amountCNY) {
  const state = StateManager.getState();
  if (state.resources.cash < amountCNY) {
    StateManager.addMessage(
      `⚠️ 现金不足 ¥${amountCNY.toLocaleString()}`,
      "danger",
    );
    return false;
  }

  if (!consumeAP(AP_COSTS.trade_stock)) return false;

  const btcAmount = amountCNY / state.investment.bitcoinMarket.price;
  const btc = state.investment.bitcoin;

  state.resources.cash -= amountCNY;
  if (btc.holdings > 0) {
    btc.avgPrice =
      Math.round(
        ((btc.avgPrice * btc.holdings + amountCNY) /
          (btc.holdings + btcAmount)) *
          100,
      ) / 100;
  } else {
    btc.avgPrice = state.investment.bitcoinMarket.price;
  }
  btc.holdings = Math.round((btc.holdings + btcAmount) * 1000000) / 1000000;

  StateManager.addMessage(
    `₿ 买入比特币 ¥${amountCNY.toLocaleString()}（≈${btcAmount.toFixed(6)} BTC）`,
    "success",
  );
  return true;
}

/** 卖出比特币 */
function investSellBitcoin(btcAmount) {
  const state = StateManager.getState();
  const btc = state.investment.bitcoin;
  if (btc.holdings < btcAmount) {
    StateManager.addMessage("⚠️ 比特币持仓不足。", "danger");
    return false;
  }

  if (!consumeAP(AP_COSTS.trade_stock)) return false;

  const revenue = Math.round(btcAmount * state.investment.bitcoinMarket.price);
  const profit = revenue - btc.avgPrice * btcAmount;

  state.resources.cash += revenue;
  state.resources.totalEarned += Math.max(0, profit);

  btc.holdings = Math.round((btc.holdings - btcAmount) * 1000000) / 1000000;
  if (btc.holdings < 0.000001) btc.holdings = 0;

  const profitStr =
    profit >= 0
      ? `📈 盈利 ¥${Math.round(profit).toLocaleString()}`
      : `📉 亏损 ¥${Math.abs(Math.round(profit)).toLocaleString()}`;
  StateManager.addMessage(
    `₿ 卖出 ${btcAmount.toFixed(6)} BTC，¥${revenue.toLocaleString()}。${profitStr}`,
    "success",
  );
  return true;
}

/** 买入房产 */
function investBuyRealEstate(typeId) {
  const state = StateManager.getState();
  const typeDef = REAL_ESTATE_TYPES.find((t) => t.id === typeId);
  if (!typeDef) return false;

  if (state.resources.cash < typeDef.price) {
    StateManager.addMessage(
      `⚠️ 需要 ¥${typeDef.price.toLocaleString()}，现金不足。`,
      "danger",
    );
    return false;
  }

  if (!consumeAP(AP_COSTS.buy_realestate)) return false;

  state.resources.cash -= typeDef.price;
  state.investment.realEstate.push({
    type: typeId,
    name: typeDef.name,
    buyPrice: typeDef.price,
    buyDay: state.player.day,
    currentValue: typeDef.price,
    monthlyRent: typeDef.monthlyRent,
  });

  StateManager.addMessage(
    `${typeDef.icon} 购入${typeDef.name}！月租金 ¥${typeDef.monthlyRent.toLocaleString()}`,
    "success",
  );
  return true;
}

/** 卖出房产 */
function investSellRealEstate(index) {
  const state = StateManager.getState();
  const prop = state.investment.realEstate[index];
  if (!prop) return false;

  // 5%交易税
  const revenue = Math.round(prop.currentValue * 0.95);
  const profit = revenue - prop.buyPrice;

  state.resources.cash += revenue;
  state.resources.totalEarned += Math.max(0, profit);
  state.investment.realEstate.splice(index, 1);

  const profitStr =
    profit >= 0
      ? `📈 盈利 ¥${Math.round(profit).toLocaleString()}`
      : `📉 亏损 ¥${Math.abs(Math.round(profit)).toLocaleString()}`;
  StateManager.addMessage(
    `🏠 卖出${prop.name}，¥${revenue.toLocaleString()}（扣5%税）。${profitStr}`,
    "success",
  );
  return true;
}

/** 买入汽车 */
function investBuyVehicle(typeId) {
  const state = StateManager.getState();
  const typeDef = VEHICLE_TYPES.find((v) => v.id === typeId);
  if (!typeDef) return false;

  if (state.resources.cash < typeDef.price) {
    StateManager.addMessage(
      `⚠️ 需要 ¥${typeDef.price.toLocaleString()}，现金不足。`,
      "danger",
    );
    return false;
  }

  if (!consumeAP(AP_COSTS.buy_vehicle)) return false;

  state.resources.cash -= typeDef.price;
  state.investment.vehicles.push({
    type: typeId,
    name: typeDef.name,
    buyPrice: typeDef.price,
    buyDay: state.player.day,
    currentValue: typeDef.price,
    monthlyMaint: typeDef.monthlyMaint,
    apBonus: typeDef.apBonus,
  });

  // 更新AP上限
  state.player.maxActionPoints = calcMaxAP(state);

  StateManager.addMessage(
    `${typeDef.icon} 购入${typeDef.name}！行动力上限+${typeDef.apBonus}`,
    "success",
  );
  return true;
}

/** 卖出汽车 */
function investSellVehicle(index) {
  const state = StateManager.getState();
  const car = state.investment.vehicles[index];
  if (!car) return false;

  const revenue = Math.round(car.currentValue * 0.8); // 二手折价20%
  state.resources.cash += revenue;
  state.investment.vehicles.splice(index, 1);

  // 更新AP上限
  state.player.maxActionPoints = calcMaxAP(state);
  // 如果当前AP超过新上限则裁减
  if (state.player.actionPoints > state.player.maxActionPoints) {
    state.player.actionPoints = state.player.maxActionPoints;
  }

  StateManager.addMessage(
    `🚗 卖出${car.name}，二手价 ¥${revenue.toLocaleString()}`,
    "success",
  );
  return true;
}

// ====== 投资面板 UI ======

/** 显示投资面板主入口 */
function showInvestmentModal(activeTab) {
  activeTab = activeTab || "stocks";
  const state = StateManager.getState();

  // 确保市场已初始化
  if (Object.keys(state.investment.stockMarket).length === 0) {
    initInvestmentMarket(state);
  }

  const tabs = [
    { id: "stocks", name: "📈 股票" },
    { id: "bitcoin", name: "₿ 比特币" },
    { id: "realestate", name: "🏠 房产" },
    { id: "vehicles", name: "🚗 汽车" },
  ];

  let body = '<div style="max-height:500px;overflow-y:auto;">';

  // Tab切换
  body +=
    '<div style="display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap;">';
  for (const tab of tabs) {
    const isActive = tab.id === activeTab;
    body += `<button class="btn btn-sm ${isActive ? "btn-primary" : ""}" onclick="showInvestmentModal('${tab.id}')" style="margin:2px;">${tab.name}</button>`;
  }
  body += "</div>";

  // 内容区
  switch (activeTab) {
    case "stocks":
      body += renderStocksContent(state);
      break;
    case "bitcoin":
      body += renderBitcoinContent(state);
      break;
    case "realestate":
      body += renderRealEstateContent(state);
      break;
    case "vehicles":
      body += renderVehiclesContent(state);
      break;
  }

  body += "</div>";

  // 移除旧的模态框
  document.querySelector(".modal-overlay")?.remove();

  showModal({
    title: "💼 投资中心",
    body,
    buttons: [{ text: "关闭", cls: "", callback: () => renderAll() }],
  });

  // 绑定投资操作按钮
  setTimeout(bindInvestmentEvents, 50);
}

function renderStocksContent(state) {
  const inv = state.investment;
  let html =
    '<h4 style="color:var(--text-muted);margin-bottom:8px;">📊 股票行情</h4>';

  for (const stock of INVEST_STOCK_LIST) {
    const market = inv.stockMarket[stock.symbol];
    if (!market) continue;
    const price = market.price;
    const prevPrice = market.prevPrice || price;
    const changePct = (((price - prevPrice) / prevPrice) * 100).toFixed(1);
    const isUp = price >= prevPrice;

    const holding = inv.stocks.find((s) => s.symbol === stock.symbol);
    const shares = holding ? holding.shares : 0;
    const pnl = holding ? Math.round((price - holding.avgPrice) * shares) : 0;
    const pnlColor = pnl >= 0 ? "var(--success)" : "var(--danger)";

    html += `
      <div style="padding:10px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <strong style="color:var(--accent)">${stock.symbol}</strong>
            <span style="font-size:12px;color:var(--text-muted);margin-left:6px;">${stock.name}</span>
            <span style="font-size:10px;color:var(--text-muted);margin-left:4px;">[${stock.sector}]</span>
          </div>
          <div style="text-align:right;">
            <span style="font-size:16px;font-weight:bold;color:${isUp ? "var(--success)" : "var(--danger)"}">¥${price.toFixed(1)}</span>
            <span style="font-size:11px;color:${isUp ? "var(--success)" : "var(--danger)"};margin-left:4px;">${isUp ? "▲" : "▼"}${changePct}%</span>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
          <span style="font-size:11px;color:var(--text-muted);">
            持仓: ${shares}股 ${holding ? `| 均价 ¥${holding.avgPrice.toFixed(1)}` : ""}
            ${shares > 0 ? `| <span style="color:${pnlColor}">${pnl >= 0 ? "+" : ""}¥${pnl.toLocaleString()}</span>` : ""}
          </span>
          <div style="display:flex;gap:4px;">
            <button class="btn btn-sm btn-success inv-buy-stock" data-sym="${stock.symbol}" data-qty="10">买10股</button>
            <button class="btn btn-sm btn-success inv-buy-stock" data-sym="${stock.symbol}" data-qty="50">买50股</button>
            ${shares > 0 ? `<button class="btn btn-sm btn-danger inv-sell-stock" data-sym="${stock.symbol}" data-qty="${Math.min(10, shares)}">卖10</button>` : ""}
            ${shares > 10 ? `<button class="btn btn-sm btn-danger inv-sell-stock" data-sym="${stock.symbol}" data-qty="${shares}">全卖</button>` : ""}
          </div>
        </div>
        ${market.history.length > 1 ? renderMiniChart(market.history, isUp) : ""}
      </div>`;
  }
  return html;
}

function renderMiniChart(history, isUp) {
  const max = Math.max(...history);
  const min = Math.min(...history);
  const range = max - min || 1;
  const w = 200;
  const h = 30;
  const points = history
    .slice(-20)
    .map((v, i) => {
      const x = (i / (Math.min(20, history.length) - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const color = isUp ? "var(--success)" : "var(--danger)";
  return `<svg width="${w}" height="${h}" style="margin-top:4px;opacity:0.6;"><polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5"/></svg>`;
}

function renderBitcoinContent(state) {
  const btc = state.investment.bitcoinMarket;
  const holding = state.investment.bitcoin;
  const prevPrice = btc.prevPrice || btc.price;
  const changePct = (((btc.price - prevPrice) / prevPrice) * 100).toFixed(1);
  const isUp = btc.price >= prevPrice;

  const holdingValue = Math.round(holding.holdings * btc.price);
  const pnl =
    holding.holdings > 0
      ? holdingValue - Math.round(holding.avgPrice * holding.holdings)
      : 0;
  const pnlColor = pnl >= 0 ? "var(--success)" : "var(--danger)";

  // 恐慌贪婪指数条
  const fearLabel =
    btc.fearGreed < 25
      ? "极度恐慌"
      : btc.fearGreed < 45
        ? "恐慌"
        : btc.fearGreed < 55
          ? "中性"
          : btc.fearGreed < 75
            ? "贪婪"
            : "极度贪婪";
  const fearColor =
    btc.fearGreed < 30
      ? "var(--danger)"
      : btc.fearGreed < 50
        ? "var(--warning)"
        : btc.fearGreed < 70
          ? "var(--accent)"
          : "var(--success)";

  let html = `
    <div style="padding:12px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;margin-bottom:12px;">
      <div style="text-align:center;margin-bottom:8px;">
        <span style="font-size:28px;">₿</span>
        <div style="font-size:24px;font-weight:bold;color:${isUp ? "var(--success)" : "var(--danger)"}">¥${btc.price.toLocaleString()}</div>
        <span style="font-size:12px;color:${isUp ? "var(--success)" : "var(--danger)"}">${isUp ? "▲" : "▼"}${changePct}%</span>
      </div>
      <div style="margin:8px 0;">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);">
          <span>极度恐慌</span>
          <span style="color:${fearColor};font-weight:bold;">${fearLabel} (${Math.round(btc.fearGreed)})</span>
          <span>极度贪婪</span>
        </div>
        <div style="height:8px;background:linear-gradient(to right, var(--danger), var(--warning), var(--success));border-radius:4px;margin-top:4px;">
          <div style="width:4px;height:12px;background:white;border-radius:2px;margin-left:${btc.fearGreed}%;margin-top:-2px;box-shadow:0 0 4px rgba(255,255,255,0.5);"></div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">
        减半倒计时: ${btc.halvingCountdown}天
      </div>
    </div>

    <div style="padding:10px;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;margin-bottom:8px;">
      <div style="font-size:13px;margin-bottom:6px;">💰 我的持仓</div>
      <div style="font-size:12px;color:var(--text-secondary);">
        持有: ${holding.holdings.toFixed(6)} BTC | 价值: ¥${holdingValue.toLocaleString()}
        ${holding.holdings > 0 ? `<br>均价: ¥${Math.round(holding.avgPrice).toLocaleString()} | <span style="color:${pnlColor}">${pnl >= 0 ? "+" : ""}¥${pnl.toLocaleString()}</span>` : ""}
      </div>
    </div>

    <div style="display:flex;gap:6px;flex-wrap:wrap;">
      <button class="btn btn-sm btn-success inv-btc-buy" data-amount="10000">买¥1万</button>
      <button class="btn btn-sm btn-success inv-btc-buy" data-amount="50000">买¥5万</button>
      <button class="btn btn-sm btn-success inv-btc-buy" data-amount="100000">买¥10万</button>
      ${holding.holdings > 0 ? `<button class="btn btn-sm btn-danger inv-btc-sell" data-pct="25">卖25%</button>` : ""}
      ${holding.holdings > 0 ? `<button class="btn btn-sm btn-danger inv-btc-sell" data-pct="50">卖50%</button>` : ""}
      ${holding.holdings > 0 ? `<button class="btn btn-sm btn-danger inv-btc-sell" data-pct="100">全卖</button>` : ""}
    </div>
  `;
  return html;
}

function renderRealEstateContent(state) {
  const inv = state.investment;
  let html =
    '<h4 style="color:var(--text-muted);margin-bottom:8px;">🏠 房产市场</h4>';

  // 已持有
  if (inv.realEstate.length > 0) {
    html += '<div style="margin-bottom:12px;">';
    for (let i = 0; i < inv.realEstate.length; i++) {
      const prop = inv.realEstate[i];
      const typeDef = REAL_ESTATE_TYPES.find((t) => t.id === prop.type);
      const profit = prop.currentValue - prop.buyPrice;
      const profitColor = profit >= 0 ? "var(--success)" : "var(--danger)";
      html += `
        <div style="padding:8px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;">
          <div style="display:flex;justify-content:space-between;">
            <span>${typeDef ? typeDef.icon : "🏠"} ${prop.name}</span>
            <span style="color:${profitColor};font-size:11px;">${profit >= 0 ? "+" : ""}¥${profit.toLocaleString()}</span>
          </div>
          <div style="font-size:11px;color:var(--text-muted);">
            买入: ¥${prop.buyPrice.toLocaleString()} | 当前: ¥${prop.currentValue.toLocaleString()} | 月租: ¥${prop.monthlyRent.toLocaleString()}
          </div>
          <button class="btn btn-sm btn-danger inv-sell-property" data-idx="${i}" style="margin-top:4px;">卖出(扣5%税)</button>
        </div>`;
    }
    html += "</div>";
  }

  // 可购买
  html +=
    '<h4 style="color:var(--text-muted);margin-bottom:8px;">📋 可购房产</h4>';
  for (const typeDef of REAL_ESTATE_TYPES) {
    const canAfford = state.resources.cash >= typeDef.price;
    html += `
      <div style="padding:8px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;${canAfford ? "" : "opacity:0.5;"}">
        <div style="display:flex;justify-content:space-between;">
          <span>${typeDef.icon} ${typeDef.name}</span>
          <span style="color:var(--accent);font-weight:bold;">¥${typeDef.price.toLocaleString()}</span>
        </div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">${typeDef.desc}</div>
        <div style="font-size:10px;color:var(--text-muted);">月租: ¥${typeDef.monthlyRent.toLocaleString()} | 月升值: ${(typeDef.appreciationRate * 100).toFixed(1)}%</div>
        <button class="btn btn-sm btn-success inv-buy-property" data-type="${typeDef.id}" style="margin-top:4px;" ${canAfford ? "" : "disabled"}>购买</button>
      </div>`;
  }
  return html;
}

function renderVehiclesContent(state) {
  const inv = state.investment;
  let html =
    '<h4 style="color:var(--text-muted);margin-bottom:8px;">🚗 车辆市场</h4>';

  // 已持有
  if (inv.vehicles.length > 0) {
    html += '<div style="margin-bottom:12px;">';
    for (let i = 0; i < inv.vehicles.length; i++) {
      const car = inv.vehicles[i];
      const typeDef = VEHICLE_TYPES.find((v) => v.id === car.type);
      const depreciation = car.buyPrice - car.currentValue;
      html += `
        <div style="padding:8px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;">
          <div style="display:flex;justify-content:space-between;">
            <span>${typeDef ? typeDef.icon : "🚗"} ${car.name}</span>
            <span style="color:var(--danger);font-size:11px;">贬值 ¥${depreciation.toLocaleString()}</span>
          </div>
          <div style="font-size:11px;color:var(--text-muted);">
            买入: ¥${car.buyPrice.toLocaleString()} | 当前: ¥${car.currentValue.toLocaleString()} | AP+${car.apBonus} | 月保养¥${car.monthlyMaint}
          </div>
          <button class="btn btn-sm btn-danger inv-sell-car" data-idx="${i}" style="margin-top:4px;">卖出(8折)</button>
        </div>`;
    }
    html += "</div>";
  }

  // 可购买
  html +=
    '<h4 style="color:var(--text-muted);margin-bottom:8px;">📋 可购车辆</h4>';
  for (const typeDef of VEHICLE_TYPES) {
    const canAfford = state.resources.cash >= typeDef.price;
    html += `
      <div style="padding:8px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;${canAfford ? "" : "opacity:0.5;"}">
        <div style="display:flex;justify-content:space-between;">
          <span>${typeDef.icon} ${typeDef.name}</span>
          <span style="color:var(--accent);font-weight:bold;">¥${typeDef.price.toLocaleString()}</span>
        </div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">${typeDef.desc}</div>
        <div style="font-size:10px;color:var(--text-muted);">AP上限+${typeDef.apBonus} | 月贬值${(typeDef.depreciationRate * 100).toFixed(1)}% | 月保养¥${typeDef.monthlyMaint}</div>
        <button class="btn btn-sm btn-success inv-buy-car" data-type="${typeDef.id}" style="margin-top:4px;" ${canAfford ? "" : "disabled"}>购买</button>
      </div>`;
  }
  return html;
}

// ====== 事件绑定 ======

function bindInvestmentEvents() {
  // 买股票
  document.querySelectorAll(".inv-buy-stock").forEach((btn) => {
    btn.onclick = () => {
      investBuyStock(btn.dataset.sym, parseInt(btn.dataset.qty));
      showInvestmentModal("stocks");
    };
  });
  // 卖股票
  document.querySelectorAll(".inv-sell-stock").forEach((btn) => {
    btn.onclick = () => {
      investSellStock(btn.dataset.sym, parseInt(btn.dataset.qty));
      showInvestmentModal("stocks");
    };
  });
  // 买BTC
  document.querySelectorAll(".inv-btc-buy").forEach((btn) => {
    btn.onclick = () => {
      investBuyBitcoin(parseInt(btn.dataset.amount));
      showInvestmentModal("bitcoin");
    };
  });
  // 卖BTC
  document.querySelectorAll(".inv-btc-sell").forEach((btn) => {
    btn.onclick = () => {
      const state = StateManager.getState();
      const pct = parseInt(btn.dataset.pct) / 100;
      const amount = state.investment.bitcoin.holdings * pct;
      investSellBitcoin(amount);
      showInvestmentModal("bitcoin");
    };
  });
  // 买房
  document.querySelectorAll(".inv-buy-property").forEach((btn) => {
    btn.onclick = () => {
      investBuyRealEstate(btn.dataset.type);
      showInvestmentModal("realestate");
    };
  });
  // 卖房
  document.querySelectorAll(".inv-sell-property").forEach((btn) => {
    btn.onclick = () => {
      investSellRealEstate(parseInt(btn.dataset.idx));
      showInvestmentModal("realestate");
    };
  });
  // 买车
  document.querySelectorAll(".inv-buy-car").forEach((btn) => {
    btn.onclick = () => {
      investBuyVehicle(btn.dataset.type);
      showInvestmentModal("vehicles");
    };
  });
  // 卖车
  document.querySelectorAll(".inv-sell-car").forEach((btn) => {
    btn.onclick = () => {
      investSellVehicle(parseInt(btn.dataset.idx));
      showInvestmentModal("vehicles");
    };
  });
}

// ====== 旧 stock.js 兼容桥接 ======

/** 兼容旧版 showStockTradeModal —— 跳转到新版投资面板股票Tab */
function showStockTradeModal() {
  showInvestmentModal("stocks");
}

/** 同步旧 corporate.stocks 到新 investment（旧存档迁移用，迁移后清理旧数据） */
function syncStockToInvestment(state) {
  // 兼容旧存档：如果 corporate 对象上仍残留 stocks/stockMarket 字段
  const corp = state.corporate;
  if (!corp) return;

  // 迁移持仓
  if (
    Array.isArray(corp.stocks) &&
    corp.stocks.length > 0 &&
    state.investment.stocks.length === 0
  ) {
    for (const s of corp.stocks) {
      state.investment.stocks.push({ ...s });
    }
    corp.stocks = []; // 清理旧数据
  }
  // 迁移行情
  if (
    corp.stockMarket &&
    Object.keys(corp.stockMarket).length > 0 &&
    Object.keys(state.investment.stockMarket).length === 0
  ) {
    for (const [sym, data] of Object.entries(corp.stockMarket)) {
      state.investment.stockMarket[sym] = {
        ...data,
        prevPrice:
          data.history?.length > 1
            ? data.history[data.history.length - 2]
            : data.price,
        trend: 0,
      };
    }
    delete corp.stockMarket; // 清理旧数据
  }
}
