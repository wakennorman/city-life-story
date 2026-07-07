/**
 * 交易系统 — 买卖商品、价格波动、批发进货
 *
 * 提供: buyGood(), sellGood(), buyWholesale(), updatePrices()
 */

/** 玩家购买商品 */
function buyGood(goodId, qty) {
  const state = StateManager.getState();
  const good = getGoodById(goodId);
  if (!good) {
    StateManager.addMessage("⚠️ 不存在的商品。", "danger");
    return false;
  }

  const locKey = state.trade.currentLocation;
  const price = getCurrentPrice(locKey, goodId);

  // 销售技能折扣（最高18%）
  const salesLvl = state.skills.sales.level || 0;
  var salesDiscount = Math.min(0.18, salesLvl * 0.003);
  // 历史声誉折扣（P2.9：诚信经营者/拒绝假货获得进货优惠）
  var histDiscount = 0;
  if (typeof getHistoryModifiers === "function") {
    var hm = getHistoryModifiers(state);
    histDiscount = hm.priceDiscount < 1.0 ? 1.0 - hm.priceDiscount : 0;
  }
  // 批量折扣：买5件以上额外2%，买10件以上额外5%
  var bulkDiscount = 0;
  if (typeof qty === "number" && qty >= 10) bulkDiscount = 0.05;
  else if (typeof qty === "number" && qty >= 5) bulkDiscount = 0.02;
  const discount = Math.min(0.3, salesDiscount + histDiscount + bulkDiscount);
  const totalCost = Math.round(price * qty * (1 - discount) * 100) / 100;

  // 检查现金
  if (state.resources.cash < totalCost) {
    StateManager.addMessage(
      `⚠️ 钱不够！需要 ¥${totalCost.toFixed(1)}，你只有 ¥${state.resources.cash}。`,
      "danger",
    );
    return false;
  }

  // 检查背包容量
  const currentItems = state.inventory.items.reduce(
    (sum, item) => sum + item.qty,
    0,
  );
  if (currentItems + qty > state.inventory.capacity) {
    StateManager.addMessage(
      `⚠️ 仓库空间不足！（${currentItems}/${state.inventory.capacity} 槽位）`,
      "danger",
    );
    return false;
  }

  // 扣钱
  state.resources.cash -= totalCost;

  // 加入背包
  const existing = state.inventory.items.find((i) => i.id === goodId);
  if (existing) {
    existing.qty += qty;
    existing.boughtAt = locKey;
    existing.boughtDay = state.player.day;
  } else {
    state.inventory.items.push({
      id: goodId,
      qty,
      boughtAt: locKey,
      boughtDay: state.player.day,
    });
  }

  // 买入后该商品在当地微涨 0.2~0.5%
  const buyDelta = Random.float(0.002, 0.005);
  adjustPriceAfterTrade(locKey, goodId, buyDelta);
  const newPrice = getCurrentPrice(locKey, goodId);

  // 交易获得销售经验
  if (typeof gainTradeXp === "function") {
    gainTradeXp(state);
  }

  StateManager.addMessage(
    `🛒 购买了 ${qty}${good.unit}${good.name}，单价 ¥${price.toFixed(1)}，共 ¥${totalCost.toFixed(1)}。${newPrice !== price ? ` 当地价格调整至 ¥${newPrice.toFixed(1)}` : ""}`,
    "success",
  );
  if (typeof playSound === "function") playSound("buy");

  // === v3.23: 触发槽 — after_trade ===
  if (typeof window.TriggerRegistry !== "undefined") {
    try {
      var afterTradeEventBuy = window.TriggerRegistry.triggerRandom("after_trade", state);
      if (afterTradeEventBuy) {
        setTimeout(function () {
          if (typeof showEventModal === "function") showEventModal(afterTradeEventBuy);
        }, 100);
      }
    } catch (e) {
      console.warn("TriggerRegistry after_trade 触发失败:", e);
    }
  }

  // 剁手节进货成就追踪
  if (typeof getCurrentFestival === "function") {
    var fest = getCurrentFestival(state.player.day);
    if (fest && fest.id === "shopping_festival") {
      state.flags._shoppingFestTotalStockup =
        (state.flags._shoppingFestTotalStockup || 0) + totalCost;
    }
  }

  return true;
}

/** 玩家卖出商品 */
function sellGood(goodId, qty) {
  const state = StateManager.getState();
  const good = getGoodById(goodId);
  if (!good) {
    StateManager.addMessage("⚠️ 不存在的商品。", "danger");
    return false;
  }

  // 检查背包
  const existing = state.inventory.items.find((i) => i.id === goodId);
  if (!existing || existing.qty < qty) {
    StateManager.addMessage(`⚠️ 背包中没有足够的${good.name}！`, "danger");
    return false;
  }

  const locKey = state.trade.currentLocation;
  let price = getCurrentPrice(locKey, goodId);

  // 同地转卖惩罚：如果卖出地点就是购买地点，售价打2折（现实：原地倒卖几乎必亏）
  let sameLocationPenalty = false;
  if (existing.boughtAt === locKey) {
    price = Math.round(price * 0.2 * 100) / 100;
    sameLocationPenalty = true;
  }

  // 销售技能溢价（最高20%）
  const salesLvl = state.skills.sales.level || 0;
  const premium = Math.min(0.2, salesLvl * 0.003);
  // 交易税5%（市场手续费，透明收取）
  const TAX = 0.05;
  const totalEarned =
    Math.round(price * qty * (1 + premium) * (1 - TAX) * 100) / 100;

  // 加钱
  state.resources.cash += totalEarned;
  state.resources.totalEarned += totalEarned;
  addDailyTransaction(
    state,
    "income",
    "trade_profit",
    totalEarned,
    "卖出" + good.name + "×" + qty,
  );
  // 追踪累计交易利润
  const avgBuy = getAvgBuyPrice(state, goodId);
  if (avgBuy > 0) {
    const unitProfit = totalEarned / qty - avgBuy;
    if (unitProfit > 0) {
      state.trade.totalProfit =
        (state.trade.totalProfit || 0) + unitProfit * qty;
    }
  }

  // 从背包移除
  existing.qty -= qty;
  if (existing.qty <= 0) {
    state.inventory.items = state.inventory.items.filter(
      (i) => i.id !== goodId,
    );
  }

  // 低买高卖时显示利润
  const buyPrice = getAvgBuyPrice(state, goodId);
  let profitMsg = "";
  if (sameLocationPenalty) {
    profitMsg = " ⚠️ 同地转卖，贬值严重！";
  } else if (buyPrice > 0) {
    const profit = totalEarned - buyPrice * qty;
    if (profit > 0) {
      profitMsg = ` 📈 获利 ¥${profit.toFixed(1)}！`;
    } else if (profit < 0) {
      profitMsg = ` 📉 亏损 ¥${Math.abs(profit).toFixed(1)}。`;
    }
  }

  // 卖出后该商品在当地微降 0.2~0.5%
  const sellDelta = -Random.float(0.002, 0.005);
  adjustPriceAfterTrade(locKey, goodId, sellDelta);
  const newPrice = getCurrentPrice(locKey, goodId);

  // 交易获得销售经验
  if (typeof gainTradeXp === "function") {
    gainTradeXp(state);
  }

  const priceMsg =
    newPrice !== price ? ` 当地价格调整至 ¥${newPrice.toFixed(1)}` : "";

  StateManager.addMessage(
    `💰 卖出 ${qty}${good.unit}${good.name}，市场价 ¥${price.toFixed(1)}，扣10%税后实收 ¥${totalEarned.toFixed(1)}。${profitMsg}${priceMsg}`,
    "success",
  );
  if (typeof playSound === "function") playSound("sell");

  // === v3.23: 触发槽 — after_trade ===
  if (typeof window.TriggerRegistry !== "undefined") {
    try {
      var afterTradeEventSell = window.TriggerRegistry.triggerRandom("after_trade", state);
      if (afterTradeEventSell) {
        setTimeout(function () {
          if (typeof showEventModal === "function") showEventModal(afterTradeEventSell);
        }, 100);
      }
    } catch (e) {
      console.warn("TriggerRegistry after_trade 触发失败:", e);
    }
  }

  // 剁手节利润成就追踪
  if (typeof getCurrentFestival === "function") {
    var fest2 = getCurrentFestival(state.player.day);
    if (fest2 && fest2.id === "shopping_festival") {
      state.flags._shoppingFestTotalProfit =
        (state.flags._shoppingFestTotalProfit || 0) + totalEarned;
    }
  }

  return true;
}

/** 批发进货（批发市场专属） */
function buyWholesale(goodId, qty) {
  const state = StateManager.getState();
  const good = getGoodById(goodId);
  if (!good) {
    StateManager.addMessage("⚠️ 不存在的商品。", "danger");
    return false;
  }

  const locKey = state.trade.currentLocation;
  const price = getCurrentPrice(locKey, goodId);

  // 批发折扣：批发市场的价格 × 0.9（批量价，现实批发仅10%折扣）
  const wholesalePrice = Math.round(price * 0.95 * 100) / 100;
  const totalCost = Math.round(wholesalePrice * qty * 100) / 100;

  // 最低起批量
  if (qty < 5) {
    StateManager.addMessage("⚠️ 批发最少购买5件。", "warning");
    return false;
  }

  // 检查现金
  if (state.resources.cash < totalCost) {
    StateManager.addMessage(
      `⚠️ 钱不够！需要 ¥${totalCost.toFixed(1)}。`,
      "danger",
    );
    return false;
  }

  // 检查背包
  const currentItems = state.inventory.items.reduce(
    (sum, item) => sum + item.qty,
    0,
  );
  if (currentItems + qty > state.inventory.capacity) {
    StateManager.addMessage(
      `⚠️ 仓库空间不足！（${currentItems}/${state.inventory.capacity} 槽位）`,
      "danger",
    );
    return false;
  }

  // 扣钱
  state.resources.cash -= totalCost;

  // 记录买入价（用于后续利润计算）
  const existing = state.inventory.items.find((i) => i.id === goodId);
  if (existing) {
    // 加权平均买入价
    const oldTotal = (existing.avgBuyPrice || wholesalePrice) * existing.qty;
    const newTotal = wholesalePrice * qty;
    existing.qty += qty;
    existing.boughtAt = locKey;
    existing.boughtDay = state.player.day;
    existing.avgBuyPrice =
      Math.round(((oldTotal + newTotal) / existing.qty) * 100) / 100;
  } else {
    state.inventory.items.push({
      id: goodId,
      qty,
      avgBuyPrice: wholesalePrice,
      boughtAt: locKey,
      boughtDay: state.player.day,
    });
  }

  StateManager.addMessage(
    `📦 批发进货 ${qty}${good.unit}${good.name}，批发价 ¥${wholesalePrice.toFixed(1)}/件，共 ¥${totalCost.toFixed(1)}。`,
    "success",
  );
  if (typeof playSound === "function") playSound("buy");

  // 剁手节进货成就追踪（批发也算）
  if (typeof getCurrentFestival === "function") {
    var fest3 = getCurrentFestival(state.player.day);
    if (fest3 && fest3.id === "shopping_festival") {
      state.flags._shoppingFestTotalStockup =
        (state.flags._shoppingFestTotalStockup || 0) + totalCost;
    }
  }

  return true;
}

/** 快速出售（从背包里选一个商品卖） */
function quickSell(goodId) {
  const state = StateManager.getState();
  const existing = state.inventory.items.find((i) => i.id === goodId);
  if (!existing || existing.qty <= 0) {
    StateManager.addMessage(`⚠️ 背包中没有该商品。`, "warning");
    return false;
  }
  const qty = Math.min(existing.qty, 1); // 默认卖1个
  return sellGood(goodId, qty);
}

/** 交易后动态调价：买入涨价，卖出降价 */
function adjustPriceAfterTrade(locKey, goodId, delta) {
  const state = StateManager.getState();
  const good = getGoodById(goodId);
  if (!good) return;
  const prices = state.trade.goodsPrices[locKey];
  if (!prices) return;
  const oldPrice = prices[goodId] || good.basePrice;
  const change = oldPrice * delta;
  let newPrice = oldPrice + change;
  newPrice = Math.max(
    good.basePrice * 0.65,
    Math.min(good.basePrice * 1.5, newPrice),
  );
  newPrice = Math.round(newPrice * 100) / 100;
  prices[goodId] = newPrice;
}

/** 获取当前地点某商品的零售价（含节日价格修正） */
function getCurrentPrice(locKey, goodId) {
  const state = StateManager.getState();
  const prices = state.trade.goodsPrices[locKey];
  let price;
  if (prices && prices[goodId] !== undefined) {
    price = prices[goodId];
  } else {
    const good = getGoodById(goodId);
    price = good ? good.basePrice : 1;
  }
  // 节日价格修正
  if (typeof getFestivalPriceMod === "function") {
    const good = getGoodById(goodId);
    if (good && good.category) {
      const mod = getFestivalPriceMod(state, good.category);
      if (mod !== 1.0) price = Math.round(price * mod * 10) / 10;
    }
  }
  return price;
}

/** 获取某商品在所有地点的最低价格（用于价格对比） */
function getLowestPrice(goodId) {
  const state = StateManager.getState();
  let lowest = Infinity;
  let lowestLoc = null;
  for (const locKey of Object.keys(LOCATIONS)) {
    const prices = state.trade.goodsPrices[locKey] || {};
    const price = prices[goodId];
    if (price && price < lowest) {
      lowest = price;
      lowestLoc = locKey;
    }
  }
  return { price: lowest, location: lowestLoc };
}

/** 获取某商品在所有地点的最高价格 */
function getHighestPrice(goodId) {
  const state = StateManager.getState();
  let highest = 0;
  let highestLoc = null;
  for (const locKey of Object.keys(LOCATIONS)) {
    const prices = state.trade.goodsPrices[locKey] || {};
    const price = prices[goodId];
    if (price && price > highest) {
      highest = price;
      highestLoc = locKey;
    }
  }
  return { price: highest, location: highestLoc };
}

/** 估算平均买入价 */
function getAvgBuyPrice(state, goodId) {
  const item = state.inventory.items.find((i) => i.id === goodId);
  return item ? item.avgBuyPrice || 0 : 0;
}

/** 更新所有地点所有商品的价格（每3天调用一次） */
function updateAllPrices(state) {
  for (const locKey of Object.keys(LOCATIONS)) {
    const loc = LOCATIONS[locKey];
    // 确保价格对象存在
    if (!state.trade.goodsPrices[locKey]) {
      state.trade.goodsPrices[locKey] = {};
    }
    for (const good of GOODS) {
      let price = good.basePrice;

      // 1. 地点倍率
      if (loc.priceMod && loc.priceMod[good.id]) {
        price *= loc.priceMod[good.id];
      }

      // 2. 随机波动 ±4%（极小差价，倒卖基本不赚钱）
      const fluctuation = Random.float(0.96, 1.04);
      price *= fluctuation;

      // 3. 均值回归（10%向旧价格靠拢）
      const oldPrice = state.trade.goodsPrices[locKey][good.id] || price;
      price = price + (oldPrice - price) * 0.1;

      // 4. 限制在合理范围（含 priceMod 差异，最终区间 0.7x~1.3x）
      price = Math.max(
        good.basePrice * 0.7,
        Math.min(good.basePrice * 1.3, price),
      );
      price = Math.round(price * 100) / 100;

      state.trade.goodsPrices[locKey][good.id] = price;
    }
  }
  state.trade.lastPriceUpdate = state.player.day;
}

/**
 * 获取某地点今日可交易的商品列表
 * 委托至 trade_intel.js 的 getDailyGoodsForLocation
 * @param {string} locKey - 地点 ID
 * @param {object} state - 游戏状态
 * @returns {Array} 可用商品列表
 */
function getAvailableGoodsAtLocation(locKey, state) {
  if (typeof getDailyGoodsForLocation === "function") {
    return getDailyGoodsForLocation(locKey, state);
  }
  // 降级：如果没有 trade_intel.js，返回全部商品
  return GOODS.slice();
}
