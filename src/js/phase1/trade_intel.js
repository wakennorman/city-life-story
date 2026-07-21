/**
 * 交易情报系统 — 技能驱动的价格信息可见度 + 区域商品概率 + NPC情报
 *
 * 核心原则：
 *   1. 销售技能决定价格信息可见度（技能越高，看到越多）
 *   2. 今日访问过的区域才能对比价格（"记忆"机制，次日清空精确记忆）
 *   3. 前3日保留模糊印象（"偏低/正常/偏高"），不显示精确数字
 *   4. NPC在好感足够时可分享专业领域价格情报
 *   5. 每个区域有特产（必出）+ 随机商品（按概率）+ 日常（必出）
 *
 * 依赖: locations.js, goods.js, npcs.js, state.js
 * 在 index.html 中位于 trade.js 之后加载
 */

// ====== 销售技能等级门槛 ======
var SALES_SKILL_THRESHOLDS = {
  LOCAL_ONLY: 0, // 只能看当前地点价格
  CAN_COMPARE: 20, // 可以对比已访问区域（红/绿）
  CAN_SEE_VISITED_EXTREMES: 40, // 可以看到"已访问区域中"最低/最高
  CAN_SEE_CITY_EXTREMES: 60, // 可以看到全城最低/最高（需今日跑完全城）
  CAN_PREDICT_TREND: 80, // 可以看到下个周期价格走势箭头
};

// ====== 模糊记忆等级（前几日） ======
var PRICE_TIER_LABELS = {
  low: "偏低",
  mid: "正常",
  high: "偏高",
};

/** 前3日模糊记忆保留天数 */
var MEMORY_RETENTION_DAYS = 3;

/**
 * 获取某商品的模糊价格区间
 * @param {number} price - [current price
 * @param {number} basePrice - base price of the good
 * @returns {"low"|"mid"|"high"} 模糊等级
 */
function getPriceTier(price, basePrice) {
  var ratio = price / basePrice;
  if (ratio < 0.85) return "low";
  if (ratio > 1.15) return "high";
  return "mid";
}

/**
 * 记录玩家访问某个区域（今日价格快照）
 * 调用时机：玩家进入某地点并打开交易页时
 * @param {object} state - 游戏状态
 * @param {string} locKey - 地点 ID
 */
function recordLocationVisit(state, locKey) {
  var today = state.player && state.player.day ? state.player.day : 1;
  var visited = state.trade.visitedToday || {};

  // 如果今天是新的一天，重置 visitedToday（保留 visitedTodayPrices）
  if (state.trade._visitedDay !== today) {
    // 将昨日 visitedToday 转入模糊记忆
    archiveYesterdayMemory(state);
    state.trade.visitedToday = {};
    state.trade._visitedDay = today;
    visited = {};
  }

  // 如果该地点今日已访问过，不重复记录
  if (visited[locKey]) return;

  // 快照当前价格
  var prices = state.trade.goodsPrices[locKey] || {};
  var snapshot = {};
  for (var gid in prices) {
    if (prices.hasOwnProperty(gid)) {
      snapshot[gid] = prices[gid];
    }
  }
  visited[locKey] = {
    visitDay: today,
    prices: snapshot,
  };
  state.trade.visitedToday = visited;
  state.trade._visitedDay = today;
}

/**
 * 将昨日精确记忆归档为模糊记忆（滚动保留3天）
 */
function archiveYesterdayMemory(state) {
  var yesterday = state.trade._visitedDay;
  if (!yesterday) return;

  var visited = state.trade.visitedToday || {};
  var memory = state.trade.priceMemory || [];

  for (var locKey in visited) {
    if (!visited.hasOwnProperty(locKey)) continue;
    var snap = visited[locKey].prices;
    for (var gid in snap) {
      if (!snap.hasOwnProperty(gid)) continue;
      var price = snap[gid];
      var good = getGoodById(gid);
      if (!good) continue;
      memory.push({
        day: yesterday,
        locKey: locKey,
        goodId: gid,
        tier: getPriceTier(price, good.basePrice),
      });
    }
  }

  // 只保留最近 MEMORY_RETENTION_DAYS 天
  var cutoff = yesterday - MEMORY_RETENTION_DAYS;
  memory = memory.filter(function (m) {
    return m.day >= cutoff;
  });

  state.trade.priceMemory = memory;
}

/**
 * 获取今日已访问的地点列表
 * @param {object} state
 * @returns {string[]} 地点 ID 数组
 */
function getRememberedLocations(state) {
  var visited = state.trade.visitedToday || {};
  return Object.keys(visited);
}

/**
 * 判断销售技能是否达到"可对比已访问区域价格"的门槛
 * 门槛: 销售 >= 20
 * @param {object} state
 * @returns {boolean}
 */
function canSeePriceMarkers(state) {
  var salesLvl =
    (state.skills && state.skills.sales && state.skills.sales.level) || 0;
  return salesLvl >= SALES_SKILL_THRESHOLDS.CAN_COMPARE;
}

/**
 * 判断销售技能是否达到"可看到已访问区域中最低/最高"的门槛
 * 门槛: 销售 >= 40
 * @param {object} state
 * @returns {boolean}
 */
function canSeeVisitedExtremes(state) {
  var salesLvl =
    (state.skills && state.skills.sales && state.skills.sales.level) || 0;
  return salesLvl >= SALES_SKILL_THRESHOLDS.CAN_SEE_VISITED_EXTREMES;
}

/**
 * 判断能否看到全城最低/最高
 * 条件：销售 >= 60 + 今日已跑完全城所有地点
 * @param {object} state
 * @returns {boolean}
 */
function canSeeCityExtremes(state) {
  var salesLvl =
    (state.skills && state.skills.sales && state.skills.sales.level) || 0;
  if (salesLvl < SALES_SKILL_THRESHOLDS.CAN_SEE_CITY_EXTREMES) return false;

  var visited = getRememberedLocations(state);
  var allLocs = Object.keys(LOCATIONS);
  // 检查是否所有地点都访问过
  for (var i = 0; i < allLocs.length; i++) {
    if (visited.indexOf(allLocs[i]) === -1) return false;
  }
  return true;
}

/**
 * 判断能否看到价格趋势箭头（↑↓→）
 * 门槛: 销售 >= 80
 * @param {object} state
 * @returns {boolean}
 */
function canPredictTrend(state) {
  var salesLvl =
    (state.skills && state.skills.sales && state.skills.sales.level) || 0;
  return salesLvl >= SALES_SKILL_THRESHOLDS.CAN_PREDICT_TREND;
}

/**
 * 获取前几日的价格模糊记忆提示
 * @param {object} state
 * @param {string} locKey - 可选，过滤某个地点
 * @returns {string[]} 提示文本数组
 */
function getPriceMemoryHints(state, locKey) {
  var memory = state.trade.priceMemory || [];
  var hints = [];

  // 过滤
  var filtered = locKey
    ? memory.filter(function (m) {
        return m.locKey === locKey;
      })
    : memory;

  // 按天分组去重（同一天同一地点同一商品只保留一条）
  var seen = {};
  filtered = filtered.filter(function (m) {
    var key = m.day + "_" + m.locKey + "_" + m.goodId;
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });

  for (var i = 0; i < filtered.length; i++) {
    var m = filtered[i];
    var loc = getLocation(m.locKey);
    var good = getGoodById(m.goodId);
    if (!loc || !good) continue;
    var tierLabel = PRICE_TIER_LABELS[m.tier] || "正常";
    var dayDiff = (state.player.day || 1) - m.day;
    var dayStr =
      dayDiff === 0 ? "今天" : dayDiff === 1 ? "昨天" : dayDiff + "天前";
    hints.push(dayStr + loc.name + "的" + good.name + "价格" + tierLabel);
  }

  // 最多返回 5 条
  return hints.slice(0, 5);
}

/**
 * 检查某个商品在当前地点是否需要显示红/绿价格标记
 *
 * 规则：
 *   - 销售 < 20：不显示任何标记
 *   - 销售 >= 20：对比已访问区域，比已访问均价低→绿，高→红
 *
 * @param {object} state
 * @param {string} locKey - 当前地点
 * @param {string} goodId - 商品 ID
 * @param {number} price - 当前价格
 * @returns {{ direction: "up"|"down"|null, label: string }}
 */
function getPriceMarker(state, locKey, goodId, price) {
  var result = { direction: null, label: "" };
  if (!canSeePriceMarkers(state)) return result;

  var visited = state.trade.visitedToday || {};
  var comparePrices = [];

  for (var vLocKey in visited) {
    if (!visited.hasOwnProperty(vLocKey)) continue;
    if (vLocKey === locKey) continue; // 不和自己比
    var snap = visited[vLocKey].prices;
    if (snap && snap[goodId] !== undefined) {
      comparePrices.push(snap[goodId]);
    }
  }

  if (comparePrices.length === 0) return result;

  var avg =
    comparePrices.reduce(function (a, b) {
      return a + b;
    }, 0) / comparePrices.length;

  if (price < avg * 0.98) {
    result.direction = "down";
    result.label = "🟢 低于已访区域均价";
  } else if (price > avg * 1.02) {
    result.direction = "up";
    result.label = "🔴 高于已访区域均价";
  }

  return result;
}

/**
 * 检查某商品在当前地点是否是"已访问区域中的最低/最高"
 * @param {object} state
 * @param {string} locKey - 当前地点
 * @param {string} goodId - 商品 ID
 * @returns {{ isVisitedLowest: boolean, isVisitedHighest: boolean, label: string }}
 */
function getVisitedExtreme(state, locKey, goodId) {
  var result = { isVisitedLowest: false, isVisitedHighest: false, label: "" };
  if (!canSeeVisitedExtremes(state)) return result;

  var visited = state.trade.visitedToday || {};
  var allPrices = [];

  for (var vLocKey in visited) {
    if (!visited.hasOwnProperty(vLocKey)) continue;
    var snap = visited[vLocKey].prices;
    if (snap && snap[goodId] !== undefined) {
      allPrices.push({ loc: vLocKey, price: snap[goodId] });
    }
  }

  if (allPrices.length < 2) return result;

  var currentPrice = 0;
  for (var i = 0; i < allPrices.length; i++) {
    if (allPrices[i].loc === locKey) {
      currentPrice = allPrices[i].price;
      break;
    }
  }
  if (!currentPrice) return result;

  var min = Infinity,
    max = -Infinity;
  for (var j = 0; j < allPrices.length; j++) {
    if (allPrices[j].price < min) min = allPrices[j].price;
    if (allPrices[j].price > max) max = allPrices[j].price;
  }

  if (currentPrice <= min) {
    result.isVisitedLowest = true;
  }
  if (currentPrice >= max) {
    result.isVisitedHighest = true;
  }

  if (result.isVisitedLowest && result.isVisitedHighest) {
    result.label = "🟡 唯一价格（仅访问过1处）";
  } else if (result.isVisitedLowest) {
    result.label = "🟢 已访区域最低";
  } else if (result.isVisitedHighest) {
    result.label = "🔴 已访区域最高";
  }

  return result;
}

/**
 * 检查是否全城最低/全城最高（需销售>=60+跑完全城）
 * @param {object} state
 * @param {string} locKey
 * @param {string} goodId
 * @returns {{ isCityLowest: boolean, isCityHighest: boolean, label: string }}
 */
function getCityExtreme(state, locKey, goodId) {
  var result = { isCityLowest: false, isCityHighest: false, label: "" };
  if (!canSeeCityExtremes(state)) return result;

  var lowest = getLowestPrice(goodId);
  var highest = getHighestPrice(goodId);

  if (lowest.location === locKey) {
    result.isCityLowest = true;
    result.label = "🏆 全城最低！";
  }
  if (highest.location === locKey) {
    result.isCityHighest = true;
    result.label = result.isCityLowest ? "🏆 全城最低！" : "📈 全城最高";
  }

  return result;
}

/**
 * 获取价格趋势预测箭头
 * @param {object} state
 * @param {string} locKey
 * @param {string} goodId
 * @returns {string} "↑" | "↓" | "→" | ""
 */
function getPriceTrend(state, locKey, goodId) {
  if (!canPredictTrend(state)) return "";

  // 基于历史价格趋势判断（看过去3天的模糊记忆）
  var memory = state.trade.priceMemory || [];
  var relevant = memory.filter(function (m) {
    return m.locKey === locKey && m.goodId === goodId;
  });

  if (relevant.length < 2) return "→";

  // 按天排序
  relevant.sort(function (a, b) {
    return a.day - b.day;
  });

  var tiers = relevant.map(function (m) {
    return m.tier;
  });
  var recent = tiers.slice(-3);

  var lowCount = 0,
    highCount = 0;
  for (var i = 0; i < recent.length; i++) {
    if (recent[i] === "low") lowCount++;
    if (recent[i] === "high") highCount++;
  }

  // 连续低价→可能涨
  if (lowCount >= 2) return "↑";
  // 连续高价→可能跌
  if (highCount >= 2) return "↓";
  return "→";
}

// ====== NPC 价格情报系统 ======

/**
 * NPC价格情报专业领域定义
 * 每个NPC可以透露的信息由其职业/背景决定
 */
var NPC_TRADE_INFO = {
  // 王大婶 — 房东，最懂柴米油盐
  aunt_wang: {
    expertise: ["daily", "food"],
    infoTypes: {
      price_level: { label: "日用品价格水平", threshold: 30, cost: 50 },
      category_lowest: { label: "全城日用品哪最便宜", threshold: 60, cost: 20 },
    },
  },
  // 李工头 — 包工头，懂废品/建材
  boss_li: {
    expertise: ["scrap"],
    infoTypes: {
      price_level: { label: "废品行情走势", threshold: 30, cost: 50 },
      good_highest: { label: "哪收废品价最高", threshold: 60, cost: 30 },
    },
  },
  // 张姐 — 中介，消息灵通
  sister_zhang: {
    expertise: ["clothing", "electronics", "luxury"],
    infoTypes: {
      price_level: { label: "商业区价格资讯", threshold: 30, cost: 60 },
      category_highest: { label: "哪卖服装电子最贵", threshold: 60, cost: 30 },
    },
  },
  // 老周 — 收废品老人，废品行家
  old_zhou: {
    expertise: ["scrap"],
    infoTypes: {
      good_highest: { label: "废品全城最高价", threshold: 30, cost: 40 },
      category_lowest: { label: "全城废品回收比价", threshold: 60, cost: 20 },
    },
  },
  // 小美 — 大学生，懂二手/平价商品
  xiao_mei: {
    expertise: ["daily", "food", "clothing"],
    infoTypes: {
      price_level: { label: "平价商品情报", threshold: 30, cost: 30 },
      category_lowest: { label: "哪买东西最便宜", threshold: 60, cost: 10 },
    },
  },
  // 陈师傅 — 大厨，懂食材
  chef_chen: {
    expertise: ["food"],
    infoTypes: {
      price_level: { label: "食材价格行情", threshold: 30, cost: 40 },
      category_lowest: { label: "哪买菜最便宜", threshold: 60, cost: 15 },
    },
  },
};

/**
 * 获取某NPC可提供的交易情报（基于好感度过滤）
 * @param {string} npcId
 * @param {object} state
 * @returns {object|null} { expertise, availableInfo: [...] }
 */
function getNPCTradeInfo(npcId, state) {
  var infoDef = NPC_TRADE_INFO[npcId];
  if (!infoDef) return null;

  var rel = state.relationships && state.relationships[npcId];
  var affinity = rel ? rel.affinity : 0;
  var met = rel ? rel.met : false;
  if (!met) return null;

  var availableInfo = [];
  var types = infoDef.infoTypes;
  for (var typeId in types) {
    if (!types.hasOwnProperty(typeId)) continue;
    var typeDef = types[typeId];
    if (affinity >= typeDef.threshold) {
      availableInfo.push({
        id: typeId,
        label: typeDef.label,
        threshold: typeDef.threshold,
        baseCost: typeDef.cost,
        // 好感越高价格越低
        currentCost: getInfoCost(typeDef.cost, affinity),
        free: affinity >= 80,
      });
    }
  }

  return {
    expertise: infoDef.expertise,
    availableInfo: availableInfo,
  };
}

/**
 * 根据好感度计算情报价格
 * 好感30: 原价
 * 好感30~59: 原价 ~ 6折 线性递减
 * 好感60~79: 6折 ~ 3折 线性递减
 * 好感80+: 免费
 */
function getInfoCost(baseCost, affinity) {
  if (affinity >= 80) return 0;
  if (affinity >= 60) {
    // 60→0.6x, 79→0.3x
    var t = (affinity - 60) / 19;
    return Math.round(baseCost * (0.6 - t * 0.3));
  }
  if (affinity >= 30) {
    // 30→1.0x, 59→0.6x
    var t2 = (affinity - 30) / 29;
    return Math.round(baseCost * (1.0 - t2 * 0.4));
  }
  return baseCost;
}

/**
 * 从NPC购买情报
 * @param {string} npcId
 * @param {string} infoTypeId
 * @param {object} state
 * @returns {{ success: boolean, message: string, info?: string }}
 */
function buyInfoFromNpc(npcId, infoTypeId, state) {
  var npc = getNpcById(npcId);
  if (!npc) return { success: false, message: "⚠️ 找不到该NPC。" };

  var infoData = getNPCTradeInfo(npcId, state);
  if (!infoData) return { success: false, message: "⚠️ 该NPC没有情报可提供。" };

  var foundInfo = null;
  for (var i = 0; i < infoData.availableInfo.length; i++) {
    if (infoData.availableInfo[i].id === infoTypeId) {
      foundInfo = infoData.availableInfo[i];
      break;
    }
  }
  if (!foundInfo) {
    return {
      success: false,
      message: "⚠️ 好感度不够，该NPC还不愿意分享这项情报。",
    };
  }

  var cost = foundInfo.currentCost;
  var rel = state.relationships && state.relationships[npcId];
  if (!rel) return { success: false, message: "⚠️ 还不认识该NPC。" };

  // 好感80+免费
  if (foundInfo.free) {
    rel.affinity = Math.min(100, rel.affinity + 2);
    return {
      success: true,
      message:
        "💬 " +
        npc.name +
        "主动告诉你：" +
        generateInfoText(npcId, infoTypeId, state),
      info: generateInfoText(npcId, infoTypeId, state),
    };
  }

  if (state.resources.cash < cost) {
    return {
      success: false,
      message: "⚠️ 钱不够，需要 ¥" + cost + "。",
    };
  }

  state.resources.cash -= cost;

  // 销售技能微量增长
  if (state.skills && state.skills.sales) {
    state.skills.sales.xp += 5;
  }

  // 好感微量增加
  rel.affinity = Math.min(100, rel.affinity + 1);

  return {
    success: true,
    message:
      "💰 花了 ¥" +
      cost +
      " 从" +
      npc.name +
      "那里打听情报：" +
      generateInfoText(npcId, infoTypeId, state),
    info: generateInfoText(npcId, infoTypeId, state),
  };
}

/**
 * 生成NPC情报的具体内容文本
 */
function generateInfoText(npcId, infoTypeId, state) {
  var infoDef = NPC_TRADE_INFO[npcId];
  if (!infoDef) return "";

  var expertise = infoDef.expertise || [];

  switch (infoTypeId) {
    case "price_level": {
      // 告诉某类商品整体价格水平
      var cat = expertise[0] || "daily";
      var catLabel =
        {
          daily: "日用品",
          food: "食品",
          scrap: "废品",
          clothing: "服装",
          electronics: "电子",
          luxury: "奢侈品",
        }[cat] || cat;
      var locs = Object.keys(state.trade.goodsPrices || {});
      var cheapLocs = [];
      for (var i = 0; i < locs.length; i++) {
        var lk = locs[i];
        var loc = getLocation(lk);
        if (!loc) continue;
        var prices = state.trade.goodsPrices[lk] || {};
        var catGoods = GOODS.filter(function (g) {
          return g.category === cat;
        });
        var total = 0,
          count = 0;
        for (var j = 0; j < catGoods.length; j++) {
          if (prices[catGoods[j].id] !== undefined) {
            total += prices[catGoods[j].id];
            count++;
          }
        }
        if (count > 0) {
          cheapLocs.push({ loc: loc.name, avg: total / count });
        }
      }
      cheapLocs.sort(function (a, b) {
        return a.avg - b.avg;
      });
      if (cheapLocs.length >= 2) {
        return (
          "最近" +
          catLabel +
          "整体行情，" +
          cheapLocs[0].loc +
          "最便宜（均¥" +
          cheapLocs[0].avg.toFixed(1) +
          "），" +
          cheapLocs[cheapLocs.length - 1].loc +
          "最贵（均¥" +
          cheapLocs[cheapLocs.length - 1].avg.toFixed(1) +
          "）。"
        );
      }
      return "最近" + catLabel + "价格还算平稳。";
    }
    case "category_lowest": {
      var cat2 = expertise[0] || "daily";
      var catLabel2 =
        {
          daily: "日用品",
          food: "食品",
          scrap: "废品",
          clothing: "服装",
          electronics: "电子",
          luxury: "奢侈品",
        }[cat2] || cat2;
      var lowest = null;
      var lowestPrice = Infinity;
      for (var lk2 in state.trade.goodsPrices) {
        var prices2 = state.trade.goodsPrices[lk2] || {};
        var catGoods2 = GOODS.filter(function (g) {
          return g.category === cat2;
        });
        for (var k = 0; k < catGoods2.length; k++) {
          var gid = catGoods2[k].id;
          if (prices2[gid] !== undefined && prices2[gid] < lowestPrice) {
            lowestPrice = prices2[gid];
            var locObj = getLocation(lk2);
            lowest = locObj ? locObj.name : lk2;
          }
        }
      }
      if (lowest) {
        return (
          "据我所知，今天" +
          catLabel2 +
          "最便宜的是" +
          lowest +
          "，" +
          catLabel2 +
          "最低价 ¥" +
          lowestPrice.toFixed(1) +
          "！"
        );
      }
      return "今天" + catLabel2 + "的价格我不太确定。";
    }
    case "category_highest": {
      var cat3 = expertise[0] || "clothing";
      var catLabel3 =
        {
          daily: "日用品",
          food: "食品",
          scrap: "废品",
          clothing: "服装",
          electronics: "电子",
          luxury: "奢侈品",
        }[cat3] || cat3;
      var highest = null;
      var highestPrice = 0;
      for (var lk3 in state.trade.goodsPrices) {
        var prices3 = state.trade.goodsPrices[lk3] || {};
        var catGoods3 = GOODS.filter(function (g) {
          return g.category === cat3;
        });
        for (var m = 0; m < catGoods3.length; m++) {
          var gid2 = catGoods3[m].id;
          if (prices3[gid2] !== undefined && prices3[gid2] > highestPrice) {
            highestPrice = prices3[gid2];
            var locObj2 = getLocation(lk3);
            highest = locObj2 ? locObj2.name : lk3;
          }
        }
      }
      if (highest) {
        return (
          "听说今天" +
          catLabel3 +
          "卖价最高的是" +
          highest +
          "，" +
          catLabel3 +
          "最高到 ¥" +
          highestPrice.toFixed(1) +
          "！去那边卖准没错。"
        );
      }
      return "今天" + catLabel3 + "的价格我不太确定。";
    }
    case "good_highest": {
      // 告诉某个具体类目哪收价最高（针对废品：老周/李工头）
      var scrapGoods = GOODS.filter(function (g) {
        return g.category === "scrap";
      });
      if (scrapGoods.length === 0) return "今天废品行情一般。";
      var randomGood = Random.fromArray(scrapGoods);
      var bestLoc = null;
      var bestPrice2 = 0;
      for (var lk4 in state.trade.goodsPrices) {
        var p = (state.trade.goodsPrices[lk4] || {})[randomGood.id];
        if (p && p > bestPrice2) {
          bestPrice2 = p;
          var locObj3 = getLocation(lk4);
          bestLoc = locObj3 ? locObj3.name : lk4;
        }
      }
      if (bestLoc) {
        return (
          randomGood.name +
          "今天" +
          bestLoc +
          "收得最高，¥" +
          bestPrice2.toFixed(1) +
          "/" +
          randomGood.unit +
          "！"
        );
      }
      return "今天废品行情一般，再看看。";
    }
    default:
      return "暂时没什么特别的消息。";
  }
}

/**
 * 尝试触发NPC主动分享情报（每日结算时调用）
 * 条件：好感>=60，且今日玩家在该NPC所在地点交易过
 * @param {string} npcId
 * @param {object} state
 * @returns {string|null} 情报文本，如果没有则返回 null
 */
function tryTriggerNPCInfoShare(npcId, state) {
  var rel = state.relationships && state.relationships[npcId];
  if (!rel || !rel.met) return null;
  if (rel.affinity < 60) return null;

  var npc = getNpcById(npcId);
  if (!npc) return null;

  // 30%概率触发
  if (!Random.chance(0.3)) return null;

  var infoDef = NPC_TRADE_INFO[npcId];
  if (!infoDef) return null;

  var types = Object.keys(infoDef.infoTypes);
  if (types.length === 0) return null;

  // 选一个好感足够的类型
  var availableTypes = [];
  for (var i = 0; i < types.length; i++) {
    var t = infoDef.infoTypes[types[i]];
    if (rel.affinity >= t.threshold) {
      availableTypes.push(types[i]);
    }
  }
  if (availableTypes.length === 0) return null;

  var chosenType = Random.fromArray(availableTypes);
  var infoText = generateInfoText(npcId, chosenType, state);

  // 微量销售XP
  if (state.skills && state.skills.sales) {
    state.skills.sales.xp += 10;
  }

  return infoText;
}

// ====== 区域商品概率系统 ======

/**
 * 获取某个地点今日可交易的商品列表
 *
 * 规则：
 *   1. 日常必需品（水、方便面、零食、日用品）每个区域必有
 *   2. 区域特产（specialties）100%出现
 *   3. 其他商品按 dailyProbability 概率出现
 *   4. 每日刷新（由 state 的 _goodsSeed 决定，每天不同）
 *
 * @param {string} locKey - 地点 ID
 * @param {object} state - 游戏状态
 * @returns {Array} 可用商品列表
 */
function getDailyGoodsForLocation(locKey, state) {
  var loc = getLocation(locKey);
  if (!loc) return [];

  // 批发市场特殊处理：所有商品都可交易
  if (locKey === "wholesaleMarket") {
    return GOODS.slice(); // 返回全部商品
  }

  // 构建天的确定性种子（每天不同，保证当天内一致）
  var day = state.player && state.player.day ? state.player.day : 1;
  var seed = day * 7 + locKey.length * 13 + 3;
  var rng = createSeededRandom(seed);

  // 1. 日常必需品（每个区域必有）
  var dailyEssentials = ["water", "instant_noodles", "snacks", "daily_use"];

  // 2. 区域特产（100%出现）
  var specialties = loc.specialties || [];

  // 3. 其他商品按概率出现
  var dailyProb = loc.dailyProbability || 0.5; // 默认 50%
  var otherGoods = [];

  for (var i = 0; i < GOODS.length; i++) {
    var g = GOODS[i];
    // 跳过必需品和特产
    if (dailyEssentials.indexOf(g.id) !== -1) continue;
    if (specialties.indexOf(g.id) !== -1) continue;

    // 用确定性随机判断
    var goodSeed = seed + g.id.length * 3;
    var prob = rng(); // 0~1
    var threshold = dailyProb;
    // 如果该商品的 category 在 loc.specialCategory 中，提高概率
    if (loc.specialCategory && loc.specialCategory.indexOf(g.category) !== -1) {
      threshold = Math.min(1.0, threshold + 0.3);
    }

    if (prob < threshold) {
      otherGoods.push(g);
    }
  }

  // 合并结果（去重）
  var resultIds = [];
  var resultMap = {};

  // 日常必需品
  for (var d = 0; d < dailyEssentials.length; d++) {
    var gid = dailyEssentials[d];
    if (!resultMap[gid]) {
      resultMap[gid] = true;
      resultIds.push(gid);
    }
  }
  // 特产
  for (var s = 0; s < specialties.length; s++) {
    var sid = specialties[s];
    if (!resultMap[sid]) {
      resultMap[sid] = true;
      resultIds.push(sid);
    }
  }
  // 其他
  for (var o = 0; o < otherGoods.length; o++) {
    var og = otherGoods[o];
    if (!resultMap[og.id]) {
      resultMap[og.id] = true;
      resultIds.push(og.id);
    }
  }

  // 按原始 GOODS 顺序排序
  var orderMap = {};
  for (var idx = 0; idx < GOODS.length; idx++) {
    orderMap[GOODS[idx].id] = idx;
  }
  resultIds.sort(function (a, b) {
    return (orderMap[a] || 999) - (orderMap[b] || 999);
  });

  return resultIds
    .map(function (id) {
      return getGoodById(id);
    })
    .filter(Boolean);
}

/**
 * 创建一个确定性随机数生成器（mulberry32）
 * 用于每日商品刷新，保证同一天内结果一致
 */
function createSeededRandom(seed) {
  var s = seed >>> 0;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    var t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 检查某商品在当前地点今日是否可交易
 */
function isGoodAvailableToday(locKey, goodId, state) {
  var available = getDailyGoodsForLocation(locKey, state);
  for (var i = 0; i < available.length; i++) {
    if (available[i].id === goodId) return true;
  }
  return false;
}

// ====== 每日交易销售XP增长 ======
var DAILY_TRADE_XP_LIMIT = 30; // 每天通过交易获得的销售XP上限

/**
 * 交易后获得销售经验（买卖双方都调用）
 * @param {object} state
 * @param {number} amount - 交易金额（用于计算，但实际限制每日上限）
 */
function gainTradeXp(state) {
  if (!state.skills || !state.skills.sales) return;
  if (!state.trade) return;

  var todayXp = state.trade._todayTradeXp || 0;
  if (todayXp >= DAILY_TRADE_XP_LIMIT) return;

  var gain = Math.min(5, DAILY_TRADE_XP_LIMIT - todayXp); // 每次2~5, 不超过上限
  state.skills.sales.xp += gain;
  state.trade._todayTradeXp = (state.trade._todayTradeXp || 0) + gain;
}

/**
 * 每日重置交易XP计数器（每天第一次调用时执行）
 */
function resetDailyTradeXp(state) {
  var today = state.player && state.player.day ? state.player.day : 1;
  if (state.trade._xpResetDay !== today) {
    state.trade._todayTradeXp = 0;
    state.trade._xpResetDay = today;
  }
}

// ====== NPCTradeInfo 注册到全局（供Wiki引用） ======
if (typeof window !== "undefined") {
  window.NPC_TRADE_INFO = NPC_TRADE_INFO;
  window.SALES_SKILL_THRESHOLDS = SALES_SKILL_THRESHOLDS;
}
