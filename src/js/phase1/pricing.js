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
  var loc = getLocation(locKey);
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
  if (!state.trade.supplyDemand || !state.trade.supplyDemand[locKey])
    return 1.0;
  var sd = state.trade.supplyDemand[locKey][goodId] || 0;
  return 1.0 + sd * 0.005;
}

/** 每日衰减供需（向0回归20%） */
function decaySupplyDemand(state) {
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
];

/** 检查并触发市场事件 */
function checkMarketEvents(state) {
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
  if (!state.trade.marketEvents) return 1.0;
  var mod = 1.0;
  for (var i = 0; i < state.trade.marketEvents.length; i++) {
    if (state.trade.marketEvents[i].goodId === goodId)
      mod *= state.trade.marketEvents[i].priceMod;
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
    // 叠加节日价格修正（春节食物×1.25、劳动节电子×0.88 等）
    var festivalMod = 1.0;
    if (typeof getFestivalPriceMod === "function" && good) {
      festivalMod = getFestivalPriceMod(state, good.category);
    }
    var finalPrice = basePrice * supplyMod * eventMod * weatherMod * festivalMod;
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
