/**
 * 地区定价增强系统 — 特产标签 / 供需动态 / 市场事件 / 技能影响
 *
 * 在 trade.js 随机游走定价基础上叠加：
 * - 区域特产标签：每个地点有便宜/贵的商品类型
 * - 供需追踪：玩家买卖行为影响当地价格
 * - 市场事件：随机短缺/过剩/炒作
 * - 销售技能：影响买入/卖出价格
 */
"use strict";

// ====== 区域特产标签 ======
// 补充 locations.js 中的 priceMod：标注各地便宜（特产）和贵（稀缺）的商品
const LOCATION_GOODS_TAGS = {
  slum: {
    specialties: ["daily_use", "cigarettes", "instant_noodles"],
    scarce: ["electronics", "clothing", "fruits"],
    desc: "日用品便宜，废品收购价高",
  },
  wholesaleMarket: {
    specialties: [
      "fruits",
      "vegetables",
      "water",
      "snacks",
      "instant_noodles",
      "beer",
      "clothing",
      "electronics",
    ],
    scarce: ["scrap_metal", "scrap_paper", "scrap_plastic"],
    desc: "进货天堂，几乎所有商品都便宜",
  },
  construction: {
    specialties: ["scrap_metal", "water"],
    scarce: ["fruits", "vegetables", "clothing", "electronics"],
    desc: "废金属便宜，生活物资贵",
  },
  factoryZone: {
    specialties: ["scrap_metal", "scrap_plastic", "water"],
    scarce: ["fruits", "vegetables", "clothing", "snacks"],
    desc: "工业废料便宜，新鲜食品稀缺",
  },
  school: {
    specialties: ["snacks", "instant_noodles", "water"],
    scarce: ["cigarettes", "beer", "electronics"],
    desc: "零食泡面便宜，烟酒管控严",
  },
  commercialDist: {
    specialties: [],
    scarce: ["scrap_metal", "scrap_paper", "scrap_plastic"],
    desc: "消费中心，价格偏高但需求旺盛",
  },
  techPark: {
    specialties: ["electronics", "clothing"],
    scarce: ["scrap_metal", "scrap_paper", "scrap_plastic", "vegetables"],
    desc: "电子产品和衣物好卖，生活必需品稀缺",
  },
  hospital: {
    specialties: [],
    scarce: [],
    desc: "医疗场所，商品交易有限",
  },
  bank: {
    specialties: [],
    scarce: [],
    desc: "金融服务区，没有商品交易",
  },
  park: {
    specialties: ["fruits", "water"],
    scarce: ["scrap_metal", "scrap_paper", "scrap_plastic"],
    desc: "游客多，水果水饮好卖",
  },
  trainingCenter: {
    specialties: [],
    scarce: [],
    desc: "教育区，商品交易有限",
  },
  vegetable_market: {
    specialties: ["vegetables", "fruits", "cooking_oil", "rice", "salt"],
    scarce: ["electronics", "clothing", "cigarettes"],
    desc: "食材批发价，日用品偏贵",
  },
  // ====== 新激活8个地点 ======
  luxury_community: {
    specialties: ["clothing", "electronics", "cigarettes"],
    scarce: ["daily_use", "fruits", "vegetables"],
    desc: "高档商品好卖，生活必需品稀缺",
  },
  old_community: {
    specialties: ["daily_use", "vegetables", "instant_noodles"],
    scarce: ["electronics", "clothing", "cigarettes"],
    desc: "日用品便宜，高档商品不好卖",
  },
  court: {
    specialties: [],
    scarce: [],
    desc: "司法场所，商品交易有限",
  },
  gym: {
    specialties: ["water", "snacks"],
    scarce: ["electronics", "clothing", "cigarettes"],
    desc: "运动饮料和水好卖，适合摆摊",
  },
  internet_cafe: {
    specialties: ["snacks", "instant_noodles", "water"],
    scarce: ["vegetables", "fruits", "clothing"],
    desc: "零食泡面好卖，健康食品稀缺",
  },
  logistics_park: {
    specialties: ["scrap_paper", "water", "instant_noodles"],
    scarce: ["fruits", "vegetables", "electronics"],
    desc: "快递纸箱废料多，食品稀缺",
  },
  auto_city: {
    specialties: ["electronics", "clothing"],
    scarce: ["scrap_metal", "vegetables", "fruits"],
    desc: "汽车城消费力强，电子产品好卖",
  },
  flower_bird_market: {
    specialties: ["vegetables", "fruits", "snacks"],
    scarce: ["electronics", "cigarettes", "scrap_metal"],
    desc: "花鸟市场休闲人群多，食品好卖",
  },
};

/** 获取商品在某地的供需标签 (specialty/scarce/normal) */
function getGoodTag(locKey, goodId) {
  var tags = LOCATION_GOODS_TAGS[locKey];
  if (!tags) return "normal";
  if (tags.specialties && tags.specialties.indexOf(goodId) >= 0)
    return "specialty";
  if (tags.scarce && tags.scarce.indexOf(goodId) >= 0) return "scarce";
  return "normal";
}

/** 计算地点 + 标签综合价格修正系数（不含供需/市场事件） */
function getLocationPriceModifier(locKey, goodId) {
  // [全系统自洽修复] 域A A类#7: getLocation 函数守卫
  var loc = typeof getLocation === "function" ? getLocation(locKey) : null;
  var mod = 1.0;
  if (loc && loc.priceMod && loc.priceMod[goodId]) {
    mod = loc.priceMod[goodId];
  }
  var tag = getGoodTag(locKey, goodId);
  if (tag === "specialty") mod *= 0.85;
  else if (tag === "scarce") mod *= 1.2;
  return mod;
}

// ====== 供需动态（玩家买卖影响价格） ======

/** 记录玩家在某地买入（推高价格） */
function recordLocalPurchase(state, locKey, goodId, qty) {
  // [全系统自洽修复] 域A A类#1: state.trade 守卫
  if (!state || !state.trade) return;
  if (!state.trade.supplyDemand) state.trade.supplyDemand = {};
  if (!state.trade.supplyDemand[locKey]) state.trade.supplyDemand[locKey] = {};
  if (!state.trade.supplyDemand[locKey][goodId])
    state.trade.supplyDemand[locKey][goodId] = 0;
  state.trade.supplyDemand[locKey][goodId] += qty;
  state.trade.supplyDemand[locKey][goodId] = Math.min(
    state.trade.supplyDemand[locKey][goodId],
    50,
  );
}

/** 记录玩家在某地卖出（压低价格） */
function recordLocalSale(state, locKey, goodId, qty) {
  // [全系统自洽修复] 域A A类#2: state.trade 守卫
  if (!state || !state.trade) return;
  if (!state.trade.supplyDemand) state.trade.supplyDemand = {};
  if (!state.trade.supplyDemand[locKey]) state.trade.supplyDemand[locKey] = {};
  if (!state.trade.supplyDemand[locKey][goodId])
    state.trade.supplyDemand[locKey][goodId] = 0;
  state.trade.supplyDemand[locKey][goodId] -= qty;
  state.trade.supplyDemand[locKey][goodId] = Math.max(
    state.trade.supplyDemand[locKey][goodId],
    -50,
  );
}

/** 供需对价格的影响（每点 ±0.5%） */
function getSupplyDemandPriceMod(state, locKey, goodId) {
  // [全系统自洽修复] 域A A类#5: state.trade 守卫
  if (!state || !state.trade) return 1.0;
  if (!state.trade.supplyDemand || !state.trade.supplyDemand[locKey])
    return 1.0;
  var sd = state.trade.supplyDemand[locKey][goodId] || 0;
  return 1.0 + sd * 0.005;
}

/** 每日衰减供需（向0回归20%） */
function decaySupplyDemand(state) {
  // [全系统自洽修复] 域A A类#3: state.trade 守卫
  if (!state || !state.trade) return;
  if (!state.trade.supplyDemand) return;
  for (var locKey in state.trade.supplyDemand) {
    if (!state.trade.supplyDemand.hasOwnProperty(locKey)) continue;
    var loc = state.trade.supplyDemand[locKey];
    for (var goodId in loc) {
      if (!loc.hasOwnProperty(goodId)) continue;
      loc[goodId] *= 0.8;
      if (Math.abs(loc[goodId]) < 0.5) delete loc[goodId];
    }
    if (Object.keys(loc).length === 0) delete state.trade.supplyDemand[locKey];
  }
}

// ====== 市场事件 ======

var MARKET_EVENTS = [
  {
    id: "fruit_shortage",
    name: "水果短缺",
    goodId: "fruits",
    priceMod: 1.8,
    duration: 3,
    prob: 0.03,
    season: ["spring", "autumn"],
    desc: "连日暴雨导致水果供应紧张",
  },
  {
    id: "veggie_glut",
    name: "蔬菜丰收",
    goodId: "vegetables",
    priceMod: 0.5,
    duration: 2,
    prob: 0.04,
    season: ["summer", "autumn"],
    desc: "当季蔬菜大量上市，价格暴跌",
  },
  {
    id: "electronics_boom",
    name: "数码热销",
    goodId: "electronics",
    priceMod: 1.5,
    duration: 2,
    prob: 0.02,
    season: null,
    desc: "新款手机发布，配件需求暴涨",
  },
  {
    id: "scrap_surge",
    name: "废金属涨价",
    goodId: "scrap_metal",
    priceMod: 1.6,
    duration: 3,
    prob: 0.03,
    season: ["spring"],
    desc: "钢材价格上涨，废金属跟着涨",
  },
  {
    id: "beer_festival",
    name: "啤酒节",
    goodId: "beer",
    priceMod: 1.4,
    duration: 2,
    prob: 0.02,
    season: ["summer"],
    desc: "啤酒节开幕，啤酒需求大增",
  },
  {
    id: "cloth_sale",
    name: "换季清仓",
    goodId: "clothing",
    priceMod: 0.6,
    duration: 3,
    prob: 0.03,
    season: ["autumn", "spring"],
    desc: "换季大甩卖，衣服白菜价",
  },
  {
    id: "water_shortage",
    name: "供水紧张",
    goodId: "water",
    priceMod: 2.0,
    duration: 2,
    prob: 0.02,
    season: ["summer"],
    desc: "高温导致矿泉水价格翻倍",
  },
  {
    id: "cigarette_tax",
    name: "烟草加税",
    goodId: "cigarettes",
    priceMod: 1.3,
    duration: 5,
    prob: 0.01,
    season: null,
    desc: "烟草税上调，香烟价格普涨",
  },

  // ====== 新增多样化市场事件（v3.6 扩展） ======
  {
    id: "book_craze",
    name: "读书热",
    goodId: "second_hand_book",
    priceMod: 1.5,
    duration: 3,
    prob: 0.02,
    season: ["spring", "autumn"],
    desc: "新学期开学，二手书需求暴增",
  },
  {
    id: "flower_valentine",
    name: "情人节花市",
    goodId: "rose",
    priceMod: 2.0,
    duration: 2,
    prob: 0.015,
    season: null,
    desc: "情人节/七夕临近，玫瑰花价格暴涨",
  },
  {
    id: "flu_medicine",
    name: "流感爆发",
    goodId: "cold_medicine",
    priceMod: 1.8,
    duration: 4,
    prob: 0.03,
    season: ["winter", "autumn"],
    desc: "季节性流感来袭，感冒药供不应求",
  },
  {
    id: "construction_boom",
    name: "基建项目启动",
    goodId: "scrap_metal",
    priceMod: 1.6,
    duration: 5,
    prob: 0.025,
    season: ["spring", "summer"],
    desc: "市政工程项目启动，废金属回收价大涨",
  },
  {
    id: "delivery_surge",
    name: "快递旺季",
    goodId: "scrap_paper",
    priceMod: 1.4,
    duration: 3,
    prob: 0.03,
    season: ["autumn", "winter"],
    desc: "电商促销旺季，废纸板回收价上涨",
  },
  {
    id: "stationery_sale",
    name: "文具促销",
    goodId: "notebook_item",
    priceMod: 0.6,
    duration: 3,
    prob: 0.02,
    season: ["summer"],
    desc: "暑期文具促销大减价",
  },
  {
    id: "med_supply",
    name: "医疗物资补充",
    goodId: "painkiller",
    priceMod: 0.7,
    duration: 3,
    prob: 0.02,
    season: ["spring"],
    desc: "医疗机构统一采购补货，止痛药批发价下降",
  },
  {
    id: "clothes_clearance",
    name: "品牌清仓",
    goodId: "clothing",
    priceMod: 0.55,
    duration: 3,
    prob: 0.02,
    season: ["summer", "winter"],
    desc: "品牌换季清仓大甩卖",
  },

  // ====== 宏观经济周期事件（影响所有商品） ======
  // 联动增强：数据→经济系统深度联动，模拟宏观经济波动
  {
    id: "inflation_cycle",
    name: "通胀周期",
    goodId: "*", // 特殊标记：影响所有商品
    priceMod: 1.15,
    duration: 5,
    prob: 0.015,
    season: null,
    desc: "宏观经济通胀，所有商品价格上涨15%",
  },
  {
    id: "deflation_cycle",
    name: "通缩周期",
    goodId: "*",
    priceMod: 0.85,
    duration: 5,
    prob: 0.015,
    season: null,
    desc: "宏观经济通缩，所有商品价格下降15%",
  },
];

/** 检查并触发市场事件 */
function checkMarketEvents(state) {
  // [全系统自洽修复] 域A A类#4: state.trade 守卫
  if (!state || !state.trade) return;
  if (!state.trade.marketEvents) state.trade.marketEvents = [];
  // 衰减现有事件
  state.trade.marketEvents = state.trade.marketEvents.filter(function (evt) {
    evt.remaining--;
    return evt.remaining > 0;
  });
  // 随机触发新事件
  var season =
    typeof getSeason === "function" ? getSeason(state.player.day) : "spring";
  var seasonId = season && season.id ? season.id : season;
  for (var i = 0; i < MARKET_EVENTS.length; i++) {
    var template = MARKET_EVENTS[i];
    if (template.season && template.season.indexOf(seasonId) < 0) continue;
    if (
      state.trade.marketEvents.find(function (e) {
        return e.id === template.id;
      })
    )
      continue;
    if (Random.chance(template.prob)) {
      state.trade.marketEvents.push({
        id: template.id,
        name: template.name,
        goodId: template.goodId,
        priceMod: template.priceMod,
        remaining: template.duration,
        desc: template.desc,
      });
      StateManager.addMessage(
        "📰 " + template.name + "：" + template.desc,
        "event",
      );
    }
  }
}

/** 市场事件对某商品的价格修正 */
function getMarketEventPriceMod(state, goodId) {
  // [全系统自洽修复] 域A A类#6: state.trade 守卫
  if (!state || !state.trade) return 1.0;
  if (!state.trade.marketEvents) return 1.0;
  var mod = 1.0;
  for (var i = 0; i < state.trade.marketEvents.length; i++) {
    var evt = state.trade.marketEvents[i];
    if (evt.goodId === goodId || evt.goodId === "*") // 支持"*"全商品事件
      mod *= evt.priceMod;
  }
  return mod;
}

// ====== 技能影响 ======

function getSkillBuyDiscount(state) {
  var salesLevel =
    (state.skills && state.skills.sales && state.skills.sales.level) || 0;
  return Math.max(0.7, 1 - salesLevel * 0.003);
}

function getSkillSellBonus(state) {
  var salesLevel =
    (state.skills && state.skills.sales && state.skills.sales.level) || 0;
  return Math.min(1.3, 1 + salesLevel * 0.003);
}

function getSkillPriceInfoLevel(state) {
  var salesLevel =
    (state.skills && state.skills.sales && state.skills.sales.level) || 0;
  if (salesLevel >= 50) return 3;
  if (salesLevel >= 25) return 2;
  if (salesLevel >= 10) return 1;
  return 0;
}

// ====== 综合定价引擎 ======

/**
 * 每日随机价格冲击 — 给价格增加小幅日常波动，避免价格完全静态。
 * 使用确定性种子（天 + 地点 + 商品），保证同一天内同一商品价格一致。
 * @param {string} locKey - 地点 ID
 * @param {string} goodId - 商品 ID
 * @returns {number} 价格乘数，通常在 0.93～1.07 之间
 */
function getDailyPriceShock(locKey, goodId) {
  // 使用全局游戏天数作为种子一部分（无法从函数参数直接获取 state）
  var day = 1;
  if (typeof StateManager !== "undefined") {
    try {
      var st = StateManager.getState();
      if (st && st.player && st.player.day) day = st.player.day;
    } catch (e) {
      /* 静默降级 */
    }
  }
  var seed = day * 31 + locKey.length * 17 + goodId.length * 13 + 7;
  var rng;
  if (typeof createSeededRandom === "function") {
    rng = createSeededRandom(seed);
  } else {
    // 降级：简单 hash 伪随机
    var s = seed >>> 0;
    s = (s + 0x9e3779b9) | 0;
    s = Math.imul(s ^ (s >>> 16), 0x85ebca6b);
    s = Math.imul(s ^ (s >>> 13), 0xc2b2ae35);
    s = (s ^ (s >>> 16)) >>> 0;
    rng = function () {
      return (s % 1000) / 1000;
    };
  }
  // ±7% 的价格波动：0.93 ~ 1.07
  return 0.93 + rng() * 0.14;
}

/** 计算某商品在某地的最终零售价（所有因素叠加） */
function calcFinalPrice(state, locKey, goodId) {
  var good = getGoodById(goodId);
  if (!good) return 1;
  var price = good.basePrice;
  price *= getLocationPriceModifier(locKey, goodId);
  price *= getSupplyDemandPriceMod(state, locKey, goodId);
  price *= getMarketEventPriceMod(state, goodId);
  // 天气影响
  if (typeof getWeatherGoodPriceMod === "function")
    price *= getWeatherGoodPriceMod(state, goodId);
  // 每日随机价格冲击
  price *= getDailyPriceShock(locKey, goodId);
  // [全系统自洽修复] 域A 联动增强1: 季节性物价（goods.js seasonal 字段原dead data，现接入计算）
  if (good.seasonal && state.weather && state.weather.season) {
    var sMod = good.seasonal[state.weather.season];
    if (isFinite(sMod) && sMod > 0) price *= sMod;
  }
  var rl = state.relationships
    ? Object.keys(state.relationships).filter(function (k) {
        return state.relationships[k] && state.relationships[k].met;
      }).length
    : 0;
  var npcP = Math.min(10, Math.floor(rl / 2) * 0.5);
  if (npcP > 0) price *= 1 + npcP / 100;
  // v3.1: 难度物价乘数（休闲档-10%，地狱档+30%）
  if (typeof getDifficultyMultiplier === "function") {
    var priceMult = getDifficultyMultiplier(state, "price");
    if (priceMult !== 1.0) price *= priceMult;
  }
  price = Math.max(good.basePrice * 0.2, Math.min(good.basePrice * 6, price));
  return Math.round(price * 100) / 100;
}

/** 计算两地差价利润率（用于UI提示） */
function calcTradeProfitRate(fromLoc, toLoc, goodId) {
  var fromPrice = getLocationPriceModifier(fromLoc, goodId);
  var toPrice = getLocationPriceModifier(toLoc, goodId);
  if (fromPrice === 0) return 0;
  return Math.round(((toPrice - fromPrice) / fromPrice) * 100);
}

/**
 * 获取当前动态最佳交易路线推荐（考虑季节、市场事件、供需等综合因素）
 * @param {object} state - 游戏状态
 * @returns {object} { tips: [{ route, goods, profitRate }] }
 */
function getBestTradeRoutes(state) {
  var tips = [];
  if (!state || !state.trade) return { tips: [] };

  var locKeys = Object.keys(LOCATIONS);
  var currentLoc = state.trade.currentLocation;

  // 遍历所有消费品类（非食材），找所有可行路线
  var tradeGoods = GOODS.filter(function (g) {
    return !g.isIngredient && g.buyLocations && g.sellLocations;
  });

  // 综合评分：利润率 - 交通成本(AP+疲劳) - 饱和惩罚 - 门槛
  var routeProfits = [];
  for (var gi = 0; gi < tradeGoods.length; gi++) {
    var g = tradeGoods[gi];
    for (var li = 0; li < locKeys.length; li++) {
      var fromKey = locKeys[li];
      // 这个商品可以在 fromKey 买到吗？
      if (!g.buyLocations || g.buyLocations.indexOf(fromKey) < 0) continue;

      // 从 fromKey 出发可以到哪些地方卖？
      var toKeys = (g.sellLocations || []).filter(function (tk) {
        return tk !== fromKey && getLocationHops(fromKey, tk) < 99;
      });
      for (var ti = 0; ti < toKeys.length; ti++) {
        var toKey = toKeys[ti];
        var fromPrice = calcFinalPrice(state, fromKey, g.id);
        var toPrice = calcFinalPrice(state, toKey, g.id);
        if (fromPrice <= 0) continue;
        var rawProfitRate = Math.round(
          ((toPrice - fromPrice) / fromPrice) * 100,
        );
        var hops = getLocationHops(fromKey, toKey);

        // 综合成本：每跳 −2% 利润 + 疲劳消耗影响未来效率
        var transportCost = hops * 2.5;
        // 路线饱和惩罚（用得越多利润越低）
        // [全系统自洽修复] 域A B类: 原 getRouteSaturationPenalty 从未定义→死代码。
        //   改为内联实现：基于玩家近期同路线交易次数计算饱和惩罚。
        var saturationPenalty = 0;
        if (state.trade && state.trade._routeUsage) {
          var routeKey = fromKey + "→" + toKey + ":" + g.id;
          var usage = state.trade._routeUsage[routeKey] || 0;
          // 每用过一次 +5% 饱和惩罚，上限 30%
          saturationPenalty = Math.min(30, usage * 5);
        }
        // 是否从当前位置出发（就近优先）
        var isNearby = fromKey === currentLoc;
        var nearbyBonus = isNearby ? 5 : 0;

        var adjustedRate =
          rawProfitRate - transportCost - saturationPenalty + nearbyBonus;

        routeProfits.push({
          goodId: g.id,
          goodName: g.name,
          fromLoc: fromKey,
          fromLocName: getLocation(fromKey)
            ? getLocation(fromKey).name
            : fromKey,
          toLoc: toKey,
          toLocName: getLocation(toKey) ? getLocation(toKey).name : toKey,
          profitRate: rawProfitRate,
          adjustedRate: adjustedRate,
          hops: hops,
          saturationPenalty: saturationPenalty,
          isNearby: isNearby,
        });
      }
    }
  }

  // 按调整后利润率排序
  routeProfits.sort(function (a, b) {
    return b.adjustedRate - a.adjustedRate;
  });

  // 去重（同商品只保留最佳路线），取前 5 条
  var seen = {};
  for (var ri = 0; ri < routeProfits.length; ri++) {
    var rp = routeProfits[ri];
    if (seen[rp.goodId]) continue;
    seen[rp.goodId] = true;
    if (rp.adjustedRate > -5) {
      // 至少别亏太多
      var label =
        rp.fromLocName + " → " + rp.toLocName + "（" + rp.goodName + "）";
      if (!rp.isNearby) label += " 📍需前往";
      if (rp.saturationPenalty > 5) label += " ⚠️过度使用";
      tips.push({
        route: label,
        profitRate: rp.adjustedRate,
        rawRate: rp.profitRate,
        hops: rp.hops,
        fromLoc: rp.fromLoc,
        toLoc: rp.toLoc,
        goodId: rp.goodId,
        goodName: rp.goodName,
        isNearby: rp.isNearby,
      });
    }
    if (tips.length >= 5) break;
  }

  return { tips: tips };
}

// 全局导出
if (typeof window !== "undefined") {
  Object.assign(window, {
    LOCATION_GOODS_TAGS: LOCATION_GOODS_TAGS,
    MARKET_EVENTS: MARKET_EVENTS,
    getGoodTag: getGoodTag,
    getLocationPriceModifier: getLocationPriceModifier,
    recordLocalPurchase: recordLocalPurchase,
    recordLocalSale: recordLocalSale,
    getSupplyDemandPriceMod: getSupplyDemandPriceMod,
    decaySupplyDemand: decaySupplyDemand,
    checkMarketEvents: checkMarketEvents,
    getMarketEventPriceMod: getMarketEventPriceMod,
    getSkillBuyDiscount: getSkillBuyDiscount,
    getSkillSellBonus: getSkillSellBonus,
    getSkillPriceInfoLevel: getSkillPriceInfoLevel,
    calcFinalPrice: calcFinalPrice,
    calcTradeProfitRate: calcTradeProfitRate,
    getBestTradeRoutes: getBestTradeRoutes,
  });

  // ====== 整合钩子：增强现有交易函数 ======

  // 1. 增强 getCurrentPrice()：叠加供需 + 市场事件 + 天气修正
  var _origGetCurrentPrice = window.getCurrentPrice;
  window.getCurrentPrice = function (locKey, goodId) {
    // 先调用原函数获得基础价格
    var basePrice = _origGetCurrentPrice(locKey, goodId);
    var state = StateManager.getState();
    // 叠加供需修正
    var supplyMod = getSupplyDemandPriceMod(state, locKey, goodId);
    // 叠加市场事件
    var eventMod = getMarketEventPriceMod(state, goodId);
    // 叠加天气（如果有）
    var weatherMod = 1.0;
    if (typeof getWeatherGoodPriceMod === "function") {
      weatherMod = getWeatherGoodPriceMod(state, goodId);
    }
    // 叠加节日价格修正（原始 getCurrentPrice 已处理，此处不重复）
    var festivalMod = 1.0;
    var finalPrice =
      basePrice * supplyMod * eventMod * weatherMod * festivalMod;
    // 限制在合理范围
    var good = getGoodById(goodId);
    if (good) {
      finalPrice = Math.max(
        good.basePrice * 0.3,
        Math.min(good.basePrice * 3, finalPrice),
      );
    }
    return Math.round(finalPrice * 100) / 100;
  };

  // 2. 增强 buyGood()：记录供需 + 检查负重
  var _origBuyGood = window.buyGood;
  window.buyGood = function (goodId, qty) {
    // 先检查负重（如果 carry.js 已加载）
    if (typeof canCarryMore === "function") {
      var state = StateManager.getState();
      var carry = canCarryMore(state, goodId, qty);
      if (!carry.weightOk || !carry.volumeOk) {
        StateManager.addMessage(
          "⚠️ 超出负重上限！（加强体质可提升负重）",
          "danger",
        );
        return false;
      }
      if (carry.overLimit) {
        StateManager.addMessage("⚠️ 负重较高，行动会变慢。", "warning");
      }
    }
    // 调用原购买函数
    var result = _origBuyGood(goodId, qty);
    if (result) {
      // 记录供需：买入推高价格
      var s = StateManager.getState();
      if (typeof recordLocalPurchase === "function") {
        recordLocalPurchase(s, s.trade.currentLocation, goodId, qty);
      }
    }
    return result;
  };

  // 3. 增强 sellGood()：记录供需
  var _origSellGood = window.sellGood;
  window.sellGood = function (goodId, qty) {
    var result = _origSellGood(goodId, qty);
    if (result) {
      var s = StateManager.getState();
      if (typeof recordLocalSale === "function") {
        recordLocalSale(s, s.trade.currentLocation, goodId, qty);
      }
    }
    return result;
  };
}
