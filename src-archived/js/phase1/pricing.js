/**
 * 地区差价系统
 *
 * 设计参考：Port Royale/Patrician（供需曲线）、Recettear（市场崩溃/繁荣）、Uncharted Waters（区域特产+距离溢价）
 *
 * 核心机制：
 * - 区域特产：每个地点有便宜和昂贵的商品
 * - 供需动态：频繁买卖影响当地价格
 * - 距离溢价：越远的地方价格差异越大
 * - 市场事件：短缺/过剩/炒作导致价格剧烈波动
 * - 技能影响：销售技能降低买入价/提高卖出价，提供价格信息
 */

// ====== 区域特产与定价标签 ======
// 每个地点的商品分类：特产（便宜）、稀缺（贵）、普通
const LOCATION_GOODS_TAGS = {
  slum: {
    specialties: ["daily_use", "cigarettes", "instant_noodles"], // 城中村特产：日用品便宜
    scarce: ["electronics", "clothing", "fruits"], // 城中村稀缺：电子产品贵
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
    desc: "进货天堂，几乎所有商品都便宜，但废品没人要",
  },
  construction: {
    specialties: ["scrap_metal", "water"],
    scarce: ["fruits", "vegetables", "clothing", "electronics"],
    desc: "废金属便宜，但生活物资贵",
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
    specialties: [], // 商业区没有特别便宜的
    scarce: ["scrap_metal", "scrap_paper", "scrap_plastic"], // 废品没人收
    desc: "消费中心，价格偏高但需求旺盛",
  },
  techPark: {
    specialties: ["electronics", "clothing"],
    scarce: ["scrap_metal", "scrap_paper", "scrap_plastic", "vegetables"],
    desc: "电子产品和衣物好卖，废品和生活必需品稀缺",
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

// ====== 供需动态 ======

/** 获取商品在某地的供需标签 */
function getGoodTag(locKey, goodId) {
  const tags = LOCATION_GOODS_TAGS[locKey];
  if (!tags) return "normal";
  if (tags.specialties && tags.specialties.includes(goodId)) return "specialty";
  if (tags.scarce && tags.scarce.includes(goodId)) return "scarce";
  return "normal";
}

/** 计算商品在某地的基准价格修正（不含天气） */
function getLocationPriceModifier(locKey, goodId) {
  // 1. 地点 priceMod（来自 locations.js 硬编码）
  const loc =
    typeof getLocation === "function"
      ? getLocation(locKey)
      : LOCATIONS
        ? LOCATIONS[locKey]
        : null;
  let mod = 1.0;
  if (loc && loc.priceMod && loc.priceMod[goodId]) {
    mod = loc.priceMod[goodId];
  }

  // 2. 特产/稀缺标签修正
  const tag = getGoodTag(locKey, goodId);
  if (tag === "specialty") {
    mod *= 0.85; // 特产再打85折
  } else if (tag === "scarce") {
    mod *= 1.2; // 稀缺再加20%
  }

  return mod;
}

/** 计算地区差价利润率（用于UI提示） */
function calcTradeProfitRate(fromLoc, toLoc, goodId) {
  const fromPrice = getLocationPriceModifier(fromLoc, goodId);
  const toPrice = getLocationPriceModifier(toLoc, goodId);
  if (fromPrice === 0) return 0;
  return Math.round(((toPrice - fromPrice) / fromPrice) * 100);
}

// ====== 供需记录（玩家买卖影响当地价格） ======

/** 记录玩家在某地买入了商品（推高当地价格） */
function recordLocalPurchase(state, locKey, goodId, qty) {
  if (!state.trade.supplyDemand) state.trade.supplyDemand = {};
  if (!state.trade.supplyDemand[locKey]) state.trade.supplyDemand[locKey] = {};
  if (!state.trade.supplyDemand[locKey][goodId])
    state.trade.supplyDemand[locKey][goodId] = 0;
  // 买入推高价格（需求增加）
  state.trade.supplyDemand[locKey][goodId] += qty;
  // 衰减上限：最多影响50%价格
  state.trade.supplyDemand[locKey][goodId] = Math.min(
    state.trade.supplyDemand[locKey][goodId],
    50,
  );
}

/** 记录玩家在某地卖出了商品（压低当地价格） */
function recordLocalSale(state, locKey, goodId, qty) {
  if (!state.trade.supplyDemand) state.trade.supplyDemand = {};
  if (!state.trade.supplyDemand[locKey]) state.trade.supplyDemand[locKey] = {};
  if (!state.trade.supplyDemand[locKey][goodId])
    state.trade.supplyDemand[locKey][goodId] = 0;
  // 卖出压低价格（供给增加）
  state.trade.supplyDemand[locKey][goodId] -= qty;
  // 衰减下限：最多影响50%价格
  state.trade.supplyDemand[locKey][goodId] = Math.max(
    state.trade.supplyDemand[locKey][goodId],
    -50,
  );
}

/** 获取供需对价格的修正 */
function getSupplyDemandPriceMod(state, locKey, goodId) {
  if (!state.trade.supplyDemand || !state.trade.supplyDemand[locKey])
    return 1.0;
  const sd = state.trade.supplyDemand[locKey][goodId] || 0;
  // 每点影响0.5%：买入50点→+25%价格，卖出50点→-25%价格
  return 1.0 + sd * 0.005;
}

/** 每日衰减供需记录（回归均值） */
function decaySupplyDemand(state) {
  if (!state.trade.supplyDemand) return;
  for (const locKey of Object.keys(state.trade.supplyDemand)) {
    for (const goodId of Object.keys(state.trade.supplyDemand[locKey])) {
      // 每天向0衰减20%
      state.trade.supplyDemand[locKey][goodId] *= 0.8;
      if (Math.abs(state.trade.supplyDemand[locKey][goodId]) < 0.5) {
        delete state.trade.supplyDemand[locKey][goodId];
      }
    }
    if (Object.keys(state.trade.supplyDemand[locKey]).length === 0) {
      delete state.trade.supplyDemand[locKey];
    }
  }
}

// ====== 市场事件（随机短缺/过剩/炒作） ======

const MARKET_EVENTS = [
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
    desc: "新款手机发布，电子配件需求暴涨",
  },
  {
    id: "scrap_surge",
    name: "废金属涨价",
    goodId: "scrap_metal",
    priceMod: 1.6,
    duration: 3,
    prob: 0.03,
    season: ["spring"],
    desc: "钢材价格上涨，废金属收购价跟着涨",
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
    desc: "高温导致供水紧张，矿泉水价格翻倍",
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
  state.trade.marketEvents = state.trade.marketEvents.filter((evt) => {
    evt.remaining--;
    return evt.remaining > 0;
  });

  // 随机触发新事件
  const season =
    typeof getSeason === "function" ? getSeason(state.player.day) : "spring";
  for (const template of MARKET_EVENTS) {
    // 检查季节限制
    if (template.season && !template.season.includes(season)) continue;
    // 检查是否已有同类事件
    if (state.trade.marketEvents.find((e) => e.id === template.id)) continue;
    // 概率触发
    if (Random.chance(template.prob)) {
      state.trade.marketEvents.push({
        id: template.id,
        name: template.name,
        goodId: template.goodId,
        priceMod: template.priceMod,
        remaining: template.duration,
        desc: template.desc,
      });
      StateManager.addMessage(`📰 ${template.name}：${template.desc}`, "event");
    }
  }
}

/** 获取市场事件对某商品的价格修正 */
function getMarketEventPriceMod(state, goodId) {
  if (!state.trade.marketEvents) return 1.0;
  let mod = 1.0;
  for (const evt of state.trade.marketEvents) {
    if (evt.goodId === goodId) {
      mod *= evt.priceMod;
    }
  }
  return mod;
}

// ====== 技能影响 ======

/** 销售技能对买入价格的折扣（降低买入价） */
function getSkillBuyDiscount(state) {
  const salesLevel = state.skills?.sales?.level || 0;
  // 每级销售技能降低0.3%买入价，最多30%
  return Math.max(0.7, 1 - salesLevel * 0.003);
}

/** 销售技能对卖出价格的加成（提高卖出价） */
function getSkillSellBonus(state) {
  const salesLevel = state.skills?.sales?.level || 0;
  // 每级销售技能提高0.3%卖出价，最多30%
  return Math.min(1.3, 1 + salesLevel * 0.003);
}

/** 获取技能等级能看到的额外价格信息 */
function getSkillPriceInfoLevel(state) {
  const salesLevel = state.skills?.sales?.level || 0;
  if (salesLevel >= 50) return 3; // 完整信息：全城最低/最高+利润预估
  if (salesLevel >= 25) return 2; // 部分信息：知道哪里便宜/贵
  if (salesLevel >= 10) return 1; // 基础信息：知道当前是贵还是便宜
  return 0; // 无额外信息
}

// ====== 综合定价引擎 ======

/** 计算某商品在某地的最终零售价（所有因素叠加） */
function calcFinalPrice(state, locKey, goodId) {
  const good = typeof getGoodById === "function" ? getGoodById(goodId) : null;
  if (!good) return 1;

  let price = good.basePrice;

  // 1. 地点基础价格修正
  price *= getLocationPriceModifier(locKey, goodId);

  // 2. 供需修正
  price *= getSupplyDemandPriceMod(state, locKey, goodId);

  // 3. 市场事件修正
  price *= getMarketEventPriceMod(state, goodId);

  // 4. 天气修正
  if (typeof getWeatherGoodPriceMod === "function") {
    price *= getWeatherGoodPriceMod(state, goodId);
  }

  // 5. 价格范围限制（基准价的20%-600%）
  price = Math.max(good.basePrice * 0.2, Math.min(good.basePrice * 6, price));

  return Math.round(price * 100) / 100;
}
