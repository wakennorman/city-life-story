/**
 * 交易系统 — 买卖商品、价格波动、批发进货
 *
 * 提供: buyGood(), sellGood(), buyWholesale(), updatePrices()
 */

/** 玩家购买商品 */
function buyGood(goodId, qty) {
  // 新版背包系统优先
  if (typeof buyGoodV2 === "function") return buyGoodV2(goodId, qty);

  const state = StateManager.getState();
  const good = getGoodById(goodId);
  if (!good) {
    StateManager.addMessage("⚠️ 不存在的商品。", "danger");
    return false;
  }

  const locKey = state.trade.currentLocation;
  const price = getCurrentPrice(locKey, goodId);

  const totalCost = Math.round(price * qty * 100) / 100;

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
      `⚠️ 背包空间不足！（${currentItems}/${state.inventory.capacity}）`,
      "danger",
    );
    return false;
  }

  // 扣钱（NPC好感折扣）
  let npcDiscount = 0;
  if (typeof getNpcPresenceBonus === "function") {
    const npcBonus = getNpcPresenceBonus(state, "priceDiscount");
    if (npcBonus.bonus > 0) {
      const discountMult = 1 - npcBonus.bonus;
      const discountedCost = Math.round(totalCost * discountMult * 100) / 100;
      npcDiscount = totalCost - discountedCost;
      state.resources.cash -= discountedCost;
    } else {
      state.resources.cash -= totalCost;
    }
  } else {
    state.resources.cash -= totalCost;
  }

  // 加入背包
  const existing = state.inventory.items.find((i) => i.id === goodId);
  if (existing) {
    existing.qty += qty;
  } else {
    state.inventory.items.push({ id: goodId, qty });
  }

  const discountMsg =
    npcDiscount > 0 ? ` NPC好感打折省了¥${npcDiscount.toFixed(1)}！` : "";
  StateManager.addMessage(
    `🛒 购买了 ${qty}${good.unit}${good.name}，单价 ¥${price.toFixed(1)}，共 ¥${(totalCost - npcDiscount).toFixed(1)}。${discountMsg}`,
    "success",
  );
  return true;
}

/** 玩家卖出商品 */
function sellGood(goodId, qty) {
  // 新版背包系统优先
  if (typeof sellGoodV2 === "function") return sellGoodV2(goodId, qty);

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
  const price = getCurrentPrice(locKey, goodId);

  const totalEarned = Math.round(price * qty * 100) / 100;

  // 加钱
  state.resources.cash += totalEarned;
  state.resources.totalEarned += totalEarned;

  // 从背包移除
  existing.qty -= qty;
  if (existing.qty <= 0) {
    state.inventory.items = state.inventory.items.filter(
      (i) => i.id !== goodId,
    );
  }

  // 低买高卖时显示利润
  const buyPrice = getAvgBuyPrice(state, goodId); // 估算买入价
  let profitMsg = "";
  if (buyPrice > 0) {
    const profit = totalEarned - buyPrice * qty;
    if (profit > 0) {
      profitMsg = ` 📈 获利 ¥${profit.toFixed(1)}！`;
    } else if (profit < 0) {
      profitMsg = ` 📉 亏损 ¥${Math.abs(profit).toFixed(1)}。`;
    }
  }

  StateManager.addMessage(
    `💰 卖出了 ${qty}${good.unit}${good.name}，单价 ¥${price.toFixed(1)}，共 ¥${totalEarned.toFixed(1)}。${profitMsg}`,
    "success",
  );
  return true;
}

/** 批发进货（批发市场专属） */
function buyWholesale(goodId, qty) {
  // 新版背包系统优先
  if (typeof buyWholesaleV2 === "function") return buyWholesaleV2(goodId, qty);

  const state = StateManager.getState();
  const good = getGoodById(goodId);
  if (!good) {
    StateManager.addMessage("⚠️ 不存在的商品。", "danger");
    return false;
  }

  const locKey = state.trade.currentLocation;
  const price = getCurrentPrice(locKey, goodId);

  // 批发折扣：批发市场的价格 × 0.7（批量价）
  const wholesalePrice = Math.round(price * 0.7 * 100) / 100;
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
      `⚠️ 背包空间不足！（${currentItems}/${state.inventory.capacity}）`,
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
    existing.avgBuyPrice =
      Math.round(((oldTotal + newTotal) / existing.qty) * 100) / 100;
  } else {
    state.inventory.items.push({
      id: goodId,
      qty,
      avgBuyPrice: wholesalePrice,
    });
  }

  StateManager.addMessage(
    `📦 批发进货 ${qty}${good.unit}${good.name}，批发价 ¥${wholesalePrice.toFixed(1)}/件，共 ¥${totalCost.toFixed(1)}。`,
    "success",
  );
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

/** 获取当前地点某商品的零售价（含天气影响） */
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

  // 天气对商品价格的影响
  if (typeof getWeatherGoodPriceMod === "function") {
    price *= getWeatherGoodPriceMod(state, goodId);
  }

  // 供需影响（pricing.js）
  if (typeof getSupplyDemandPriceMod === "function") {
    price *= getSupplyDemandPriceMod(state, locKey, goodId);
  }

  // 市场事件影响
  if (typeof getMarketEventPriceMod === "function") {
    price *= getMarketEventPriceMod(state, goodId);
  }

  // 关系影响：批发商关系好，买入更便宜
  if (
    locKey === "wholesaleMarket" &&
    state.relationships &&
    state.relationships.wholesaler
  ) {
    const aff = state.relationships.wholesaler.affinity || 0;
    if (aff > 0) {
      price *= Math.max(0.85, 1 - aff * 0.002); // 最高降价15%
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

      // 2. 随机波动 ±25%
      const fluctuation = Random.float(0.75, 1.25);
      price *= fluctuation;

      // 3. 均值回归（10%向旧价格靠拢）
      const oldPrice = state.trade.goodsPrices[locKey][good.id] || price;
      price = price + (oldPrice - price) * 0.1;

      // 4. 限制在合理范围
      price = Math.max(
        good.basePrice * 0.25,
        Math.min(good.basePrice * 6, price),
      );
      price = Math.round(price * 100) / 100;

      state.trade.goodsPrices[locKey][good.id] = price;
    }
  }
  state.trade.lastPriceUpdate = state.player.day;
}
