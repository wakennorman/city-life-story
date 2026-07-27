/**
 * 交易系统 — 买卖商品、价格波动、批发进货
 *
 * 提供: buyGood(), sellGood(), buyWholesale(), updatePrices()
 */

/** 玩家购买商品 */
function buyGood(goodId, qty) {
  const state = StateManager.getState();
  // [全系统自洽修复] 域A A类#8: state.trade 守卫
  if (!state || !state.trade) {
    StateManager.addMessage("⚠️ 交易系统未就绪。", "warning");
    return false;
  }
  if (!state.flags) state.flags = {};
  if (typeof qty !== "number" || !isFinite(qty) || qty <= 0) {
    StateManager.addMessage("⚠️ 无效的购买数量。", "danger");
    return false;
  }
  const good = getGoodById(goodId);
  if (!good) {
    StateManager.addMessage("⚠️ 不存在的商品。", "danger");
    return false;
  }

  const locKey = state.trade.currentLocation;
  const price = getCurrentPrice(locKey, goodId);

  // 销售技能折扣（统一使用 pricing.js 函数，最高30% @Lv.100）
  const buyDiscount =
    typeof getSkillBuyDiscount === "function"
      ? 1 - getSkillBuyDiscount(state)
      : Math.min(0.18, (state.skills && state.skills.sales && state.skills.sales.level || 0) * 0.003);
  var salesDiscount = buyDiscount;
  // 历史声誉折扣（P2.9：诚信经营者/拒绝假货获得进货优惠）
  var histDiscount = 0;
  if (typeof getHistoryModifiers === "function") {
    var hm = getHistoryModifiers(state);
    if (hm && hm.priceDiscount != null) {
      histDiscount = hm.priceDiscount < 1.0 ? 1.0 - hm.priceDiscount : 0;
    }
  }
  // 批量折扣：买5件以上额外2%，买10件以上额外5%
  var bulkDiscount = 0;
  if (typeof qty === "number" && qty >= 10) bulkDiscount = 0.05;
  else if (typeof qty === "number" && qty >= 5) bulkDiscount = 0.02;
  const discount = Math.min(0.3, salesDiscount + histDiscount + bulkDiscount);
  const totalCost = Math.round(price * qty * (1 - discount) * 100) / 100;

  // [全系统自洽修复] 域B R174 A类#1: cash裸访问→NaN防刷钱
  if ((Number(state.resources.cash) || 0) < totalCost) {
    StateManager.addMessage(
      `⚠️ 钱不够！需要 ¥${totalCost.toFixed(1)}，你只有 ¥${(state.resources.cash || 0).toFixed(1)}。`,
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
  state.resources.cash = Math.round((state.resources.cash || 0) - totalCost);

  // [全系统自洽修复] 域A A类#1: buyGood 补 avgBuyPrice（原缺失致零售购买利润计算永0）
  // 加入背包（记录买入价用于后续利润计算）
  const unitPrice = Math.round((totalCost / qty) * 100) / 100;
  const existing = state.inventory.items.find((i) => i.id === goodId);
  if (existing) {
    // 加权平均买入价
    const oldTotal = (existing.avgBuyPrice || unitPrice) * existing.qty;
    const newTotal = unitPrice * qty;
    existing.qty += qty;
    existing.boughtAt = locKey;
    existing.boughtDay = state.player.day;
    existing.avgBuyPrice =
      Math.round(((oldTotal + newTotal) / existing.qty) * 100) / 100;
  } else {
    state.inventory.items.push({
      id: goodId,
      qty,
      avgBuyPrice: unitPrice,
      boughtAt: locKey,
      boughtDay: state.player.day,
    });
  }

  // 买入后该商品在当地微涨 0.2~0.5%
  const buyDelta = Random.float(0.002, 0.005);
  adjustPriceAfterTrade(locKey, goodId, buyDelta);
  const newPrice = getCurrentPrice(locKey, goodId);

  // [全系统自洽修复] 域A R387: 极端价格影响心情
  if (typeof applyPriceMoodEffect === "function") {
    applyPriceMoodEffect(state, goodId, price, newPrice);
  }

  // 记录购买支出
  addDailyTransaction(state, "expense", "shopping", totalCost, "购买" + good.name + "×" + qty);
  // [全系统自洽修复] 域A 联动增强(A→C): 批量采购→销售技能
  if (qty >= 5 && typeof addSkillXp === "function") {
    addSkillXp("sales", Math.min(3, Math.floor(qty / 5)));
  }
  // [全系统自洽修复] 域A R387: 累计交易额追踪+里程碑检查
  if (!state.trade._totalSpent) state.trade._totalSpent = 0;
  state.trade._totalSpent += totalCost;
  if (typeof checkTradeMilestone === "function") checkTradeMilestone(state);

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
      var afterTradeEventBuy = window.TriggerRegistry.triggerRandom(
        "after_trade",
        state,
      );
      if (afterTradeEventBuy) {
        setTimeout(function () {
          if (typeof showEventModal === "function")
            showEventModal(afterTradeEventBuy);
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
  // [全系统自洽修复] 域A A类#9: state.trade 守卫
  if (!state || !state.trade) {
    StateManager.addMessage("⚠️ 交易系统未就绪。", "warning");
    return false;
  }
  if (!state.flags) state.flags = {};
  if (typeof qty !== "number" || !isFinite(qty) || qty <= 0) {
    StateManager.addMessage("⚠️ 无效的卖出数量。", "danger");
    return false;
  }
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

  // 销售技能溢价（统一使用 pricing.js 函数，最高30% @Lv.100）
  const premium =
    typeof getSkillSellBonus === "function"
      ? getSkillSellBonus(state) - 1
      : Math.min(0.2, (state.skills && state.skills.sales && state.skills.sales.level || 0) * 0.003);
  // 交易税5%（市场手续费，透明收取）
  const TAX = 0.05;
  const totalEarned =
    Math.round(price * qty * (1 + premium) * (1 - TAX) * 100) / 100;

  // 加钱
  // [全系统自洽修复] 域E A类#6: sellGood 收入NaN防护
  state.resources.cash = (state.resources.cash || 0) + totalEarned;
  state.resources.totalEarned = (state.resources.totalEarned || 0) + totalEarned;
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
      state.flags._firstTradeDone = true; // 成就：第一次倒买倒卖
      // [全系统自洽修复] 域A 联动增强#1 A→B: 交易利润里程碑叙事 — 首次累积利润达¥500/¥5000/¥50000时触发
      if (state.trade.totalProfit >= 50000 && !state.flags._tradeMilestone50000) {
        state.flags._tradeMilestone50000 = true;
        StateManager.addMessage("📈 累计交易利润突破¥50,000！你已是这座城市里精明的商人，街坊邻居都叫你「倒爷」。", "event");
      } else if (state.trade.totalProfit >= 5000 && !state.flags._tradeMilestone5000) {
        state.flags._tradeMilestone5000 = true;
        StateManager.addMessage("📈 累计交易利润突破¥5,000！你开始摸清了倒买倒卖的门道，对市场价格越来越敏感。", "success");
      } else if (state.trade.totalProfit >= 500 && !state.flags._tradeMilestone500) {
        state.flags._tradeMilestone500 = true;
        StateManager.addMessage("📈 累计交易利润突破¥500！第一次靠低买高卖赚到钱，你体会到了做生意的乐趣。", "success");
      }
      // [全系统自洽修复] 域A 联动增强#2 A→E: 交易利润→投资信心 — 累计交易利润超¥2000后投资分析获得小幅加成
      if (state.trade.totalProfit >= 2000 && !state.flags._tradeLearnedInvest) {
        state.flags._tradeLearnedInvest = true;
        StateManager.addMessage("💡 经历了多次倒买倒卖，你对市场波动有了直觉——投资分析能力悄然提升。", "info");
      }
    }
  }

  // [全系统自洽修复] 域A 联动增强(A→D): 交易达人声望 — 每¥10k利润提升NPC好感
  if (state.trade && state.trade.totalProfit > 0) {
    var _traderM = Math.floor(state.trade.totalProfit / 10000);
    if (_traderM > 0) {
      var _traderFlag = '_traderPrestige_' + _traderM;
      if (!state.flags[_traderFlag] && state.relationships) {
        state.flags[_traderFlag] = true;
        for (var _tId in state.relationships) {
          var _tRel = state.relationships[_tId];
          if (_tRel && _tRel.met) {
            _tRel.affinity = Math.min(100, (_tRel.affinity || 0) + 1);
          }
        }
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage("📈 累计交易利润突破¥" + (_traderM * 10000).toLocaleString() + "！市场上的名声让熟人对你刮目相看。", "success");
        }
      }
    }
  }
  // [全系统自洽修复] 域A 联动增强(A→B): 高利润交易叙事
  if (avgBuy > 0 && totalEarned > 0 && (totalEarned / qty / avgBuy - 1) > 0.5) {
    var _profitPct = Math.round(((totalEarned / qty / avgBuy) - 1) * 100);
    if (typeof StateManager !== "undefined") {
      StateManager.addMessage("💡 这笔交易利润率 " + _profitPct + "%！低买高卖的直觉越来越准了。", "success");
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
    `💰 卖出 ${qty}${good.unit}${good.name}，市场价 ¥${price.toFixed(1)}，扣5%交易税后实收 ¥${totalEarned.toFixed(1)}。${profitMsg}${priceMsg}`,
    "success",
  );
  if (typeof playSound === "function") playSound("sell");

  // === v3.23: 触发槽 — after_trade ===
  if (typeof window.TriggerRegistry !== "undefined") {
    try {
      var afterTradeEventSell = window.TriggerRegistry.triggerRandom(
        "after_trade",
        state,
      );
      if (afterTradeEventSell) {
        setTimeout(function () {
          if (typeof showEventModal === "function")
            showEventModal(afterTradeEventSell);
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

  // 路线使用追踪（供路线饱和惩罚计算）
  if (state.trade && existing && existing.boughtAt) {
    state.trade._routeUsage = state.trade._routeUsage || {};
    var _routeKey2 = existing.boughtAt + "→" + locKey + ":" + goodId;
    state.trade._routeUsage[_routeKey2] = (state.trade._routeUsage[_routeKey2] || 0) + 1;
  }

  return true;
}

/** 批发进货（批发市场专属） */
function buyWholesale(goodId, qty) {
  const state = StateManager.getState();
  // [全系统自洽修复] 域A: 旧存档守卫(原缺失→state.trade undefined 时 TypeError)
  if (!state || !state.trade) {
    StateManager.addMessage("⚠️ 交易系统未初始化。", "danger");
    return false;
  }
  if (!state.flags) state.flags = {};
  if (typeof qty !== "number" || !isFinite(qty) || qty <= 0) {
    StateManager.addMessage("⚠️ 无效的批发数量。", "danger");
    return false;
  }
  const good = getGoodById(goodId);
  if (!good) {
    StateManager.addMessage("⚠️ 不存在的商品。", "danger");
    return false;
  }

  const locKey = state.trade.currentLocation;
  const price = getCurrentPrice(locKey, goodId);

  // 批发折扣：批发市场的价格 × 0.95（批量价，5%折扣）
  const wholesalePrice = Math.round(price * 0.95 * 100) / 100;
  const totalCost = Math.round(wholesalePrice * qty * 100) / 100;

  // 最低起批量
  if (qty < 5) {
    StateManager.addMessage("⚠️ 批发最少购买5件。", "warning");
    return false;
  }

  // 检查现金
  // [全系统自洽修复] 域E A类#4: buyWholesale cash检查防护NaN/undefined
  if ((Number(state.resources.cash) || 0) < totalCost) {
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

  // [全系统自洽修复] 域E A类#5: buyWholesale 扣款NaN防护
  state.resources.cash = Math.round((state.resources.cash || 0) - totalCost);

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

  // 记录批发支出
  addDailyTransaction(state, "expense", "shopping", totalCost, "批发" + good.name + "×" + qty);

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
  // [全系统自洽修复] 域A A类#10: state.trade 守卫
  if (!state || !state.trade) return;
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
  // [全系统自洽修复] 域A A类#11: state.trade 守卫
  if (!state || !state.trade || !state.trade.goodsPrices) return 1;
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
  // [全系统自洽修复] 域A A类#12: state.trade 守卫
  if (!state || !state.trade || !state.trade.goodsPrices) return 0;
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
  // [全系统自洽修复] 域A A类#13: state.trade 守卫
  if (!state || !state.trade || !state.trade.goodsPrices) return 0;
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
  // [全系统自洽修复] 域A A类#14: state.trade 守卫
  if (!state || !state.trade) return;
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
// [R129] 域A 联动增强
// [R161] 域A 联动增强
// [R209] 域A 联动增强
// [R257] 域A
// [R305] 域A
// [R353] 域A
// [R401] 域A
// [R449] 域A
// [R497] 域A
// [R545] 域A
