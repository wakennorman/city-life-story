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
  // [全系统自洽修复] 域A A类: state.player 守卫(防旧存档崩溃)
  var season =
    typeof getSeason === "function" && state && state.player ? getSeason(state.player.day) : "spring";
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

  // [全系统自洽修复] 域A R51 联动增强(A→B): 价格波动周报
  if (state.trade && state.trade.supplyDemand && state.player && state.player.day % 7 === 0) {
    var _maxFluct = 0, _maxGood = "", _maxLoc = "";
    for (var _loc in state.trade.supplyDemand) {
      for (var _gid in state.trade.supplyDemand[_loc]) {
        var _sd = state.trade.supplyDemand[_loc][_gid] || 0;
        if (Math.abs(_sd) > Math.abs(_maxFluct)) {
          _maxFluct = _sd;
          _maxGood = _gid;
          _maxLoc = _loc;
        }
      }
    }
    if (Math.abs(_maxFluct) >= 20) {
      var _dir = _maxFluct > 0 ? "📈 涨价" : "📉 降价";
      var _locName = (typeof getLocation === "function" && getLocation(_maxLoc)) ? getLocation(_maxLoc).name : _maxLoc;
      var _goodName = (typeof getGoodById === "function" && getGoodById(_maxGood)) ? getGoodById(_maxGood).name : _maxGood;
      StateManager.addMessage("📊 市场周报：" + _locName + "的" + _goodName + _dir + "显著（供需偏移" + _maxFluct + "点），精明商人正在调整策略。", "info");
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
  // [全系统自洽修复] 域A R1045 A类#1: state 守卫 — 防止极端情况下 state 为 null/undefined 时抛 TypeError
  if (state && good.seasonal && state.weather && state.weather.season) {
    var sMod = good.seasonal[state.weather.season];
    if (isFinite(sMod) && sMod > 0) price *= sMod;
  }
  // [全系统自洽修复] 域A R1045 A类#2: state 守卫 — 防止极端情况下 state 为 null/undefined 时抛 TypeError
  var rl = state && state.relationships
    ? Object.keys(state.relationships).filter(function (k) {
        return state.relationships[k] && state.relationships[k].met;
      }).length
    : 0;
  var npcP = Math.min(10, Math.floor(rl / 2) * 0.5);
  if (npcP > 0) price *= 1 - npcP / 100; // [全系统自洽修复] 域A A类#1: NPC关系定价方向反转（原为+导致认识越多NPC物价越高，应折扣而非加价）
  // v3.1: 难度物价乘数（休闲档-10%，地狱档+30%）
  if (typeof getDifficultyMultiplier === "function") {
    var priceMult = getDifficultyMultiplier(state, "price");
    if (priceMult !== 1.0) price *= priceMult;
  }
  price = Math.max(good.basePrice * 0.2, Math.min(good.basePrice * 6, price));
  // [全系统自洽修复] 域A R1023: NaN 兜底 — 任何修正因子返回 NaN 时防止污染下游
  if (!isFinite(price) || isNaN(price)) price = good.basePrice;
  return Math.round(price * 100) / 100;
}

/** 计算两地差价利润率（用于UI提示）— 使用 calcFinalPrice 综合所有因素 */
function calcTradeProfitRate(fromLoc, toLoc, goodId) {
  var state = (typeof StateManager !== "undefined") ? StateManager.getState() : null;
  if (!state) return 0;
  var fromPrice = calcFinalPrice(state, fromLoc, goodId);
  var toPrice = calcFinalPrice(state, toLoc, goodId);
  if (fromPrice <= 0) return 0;
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
        return tk !== fromKey && (typeof getLocationHops === "function" ? getLocationHops(fromKey, tk) : 1) < 99;
      });
      for (var ti = 0; ti < toKeys.length; ti++) {
        var toKey = toKeys[ti];
        var fromPrice = calcFinalPrice(state, fromKey, g.id);
        var toPrice = calcFinalPrice(state, toKey, g.id);
        if (fromPrice <= 0) continue;
        var rawProfitRate = Math.round(
          ((toPrice - fromPrice) / fromPrice) * 100,
        );
        var hops = typeof getLocationHops === "function" ? getLocationHops(fromKey, toKey) : 1;

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
    getPriceExtremeAlert: getPriceExtremeAlert,
    getAllPriceAnomalies: getAllPriceAnomalies,
    checkPriceAnomalyNarrative: checkPriceAnomalyNarrative,
    getPriceIndexSummary: getPriceIndexSummary,
    applyEconomicHealthToDaily: applyEconomicHealthToDaily,
    triggerInflationNarrative: triggerInflationNarrative,
    getSkillPriceInsight: getSkillPriceInsight,
    getPriceFairness: getPriceFairness,
    getPriceAnomalyStory: getPriceAnomalyStory,
    getCorpCostFromMarket: getCorpCostFromMarket,
    getSkillValueByMarket: getSkillValueByMarket,
    getTradeSkillBonus: getTradeSkillBonus,
    getMarketVolatilityRisk: getMarketVolatilityRisk,
    getGoodsIntelStory: getGoodsIntelStory,
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

// [全系统自洽修复] 域A R250 联动增强(A→B): 价格波动叙事
function checkPriceFluctuationNarrative(state, goodId, oldPrice, newPrice) {
  if (!state || !goodId || !oldPrice || !newPrice || oldPrice <= 0) return;
  var change = (newPrice - oldPrice) / oldPrice;
  if (change > 0.5) {
    StateManager.addMessage("📈 " + (getGoodById(goodId) ? getGoodById(goodId).name : goodId) + "价格暴涨" + Math.round(change * 100) + "%！市场出现抢购潮。", "info");
  } else if (change < -0.5) {
    StateManager.addMessage("📉 " + (getGoodById(goodId) ? getGoodById(goodId).name : goodId) + "价格暴跌" + Math.round(Math.abs(change) * 100) + "%！供应过剩导致价格跳水。", "warning");
  }
}

// [全系统自洽修复] 域A R250 联动增强(A→C): 价格波动影响技能经验
function applyPriceSkillXp(state, goodId, change) {
  if (!state || !state.skills || !goodId || !change || typeof addSkillXp !== "function") return;
  if (change > 0.3) addSkillXp("sales", 2);
  else if (change < -0.3) addSkillXp("accounting", 1);
}

// [全系统自洽修复] 域A R250 联动增强(A→F): 价格预警数据
function getPriceAlertData(state, goodId, currentPrice) {
  if (!state || !goodId || !currentPrice) return null;
  var good = getGoodById(goodId);
  if (!good) return null;
  var ratio = currentPrice / (good.basePrice || 1);
  if (ratio > 1.5) return { level: "high", text: "价格偏高(" + Math.round((ratio - 1) * 100) + "%)", color: "var(--danger)" };
  if (ratio < 0.5) return { level: "low", text: "价格偏低(" + Math.round((1 - ratio) * 100) + "%)", color: "var(--success)" };
  return null;
}

// [全系统自洽修复] 域A R387 联动增强(A→D): NPC交易情报—高好感NPC提供更准的买卖建议
function getNpcTradeAdvice(state, goodId) {
  if (!state || !goodId) return null;
  var good = getGoodById(goodId);
  if (!good || !good.buyLocations || !good.sellLocations) return null;
  var rels = state.relationships || {};
  var totalFavor = 0, count = 0;
  for (var k in rels) {
    if (rels[k] && rels[k].met) {
      totalFavor += rels[k].favor || 0;
      count++;
    }
  }
  var avgFavor = count > 0 ? totalFavor / count : 0;
  if (avgFavor < 30) return null;
  var bestBuy, bestSell, bestMargin = 0;
  for (var bi = 0; bi < good.buyLocations.length; bi++) {
    for (var si = 0; si < good.sellLocations.length; si++) {
      var from = good.buyLocations[bi], to = good.sellLocations[si];
      if (from === to) continue;
      var buyP = calcFinalPrice(state, from, goodId);
      var sellP = calcFinalPrice(state, to, goodId);
      if (buyP <= 0) continue;
      var margin = (sellP - buyP) / buyP;
      if (margin > bestMargin) {
        bestMargin = margin;
        bestBuy = from; bestSell = to;
      }
    }
  }
  if (!bestBuy || !bestSell) return null;
  var locFrom = getLocation(bestBuy), locTo = getLocation(bestSell);
  var advice = {
    buyLoc: bestBuy, buyLocName: locFrom ? locFrom.name : bestBuy,
    sellLoc: bestSell, sellLocName: locTo ? locTo.name : bestSell,
    margin: Math.round(bestMargin * 100),
    level: avgFavor >= 70 ? "expert" : (avgFavor >= 50 ? "good" : "basic"),
  };
  if (avgFavor >= 70 && state.trade && state.trade._routeUsage) {
    var rk = bestBuy + "→" + bestSell + ":" + goodId;
    var usage = state.trade._routeUsage[rk] || 0;
    advice.saturationWarning = usage > 3 ? "该路线已使用" + usage + "次，利润可能下降" : null;
  }
  return advice;
}

// [全系统自洽修复] 域A R387 联动增强(A→G): 价格波动心情影响—极端价格影响玩家情绪
function applyPriceMoodEffect(state, goodId, oldPrice, newPrice) {
  if (!state || !goodId || !oldPrice || !newPrice || oldPrice <= 0) return;
  if (!state.needs) return;
  var change = (newPrice - oldPrice) / oldPrice;
  if (change > 0.8) {
    state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 3);
    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      StateManager.addMessage("😰 " + (getGoodById(goodId) ? getGoodById(goodId).name : goodId) + "价格暴涨让你感到焦虑。心情-3。", "warning");
    }
  } else if (change < -0.5) {
    state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 2);
    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      StateManager.addMessage("😊 " + (getGoodById(goodId) ? getGoodById(goodId).name : goodId) + "价格大跌，你趁机囤货。心情+2。", "success");
    }
  }
}

// [R714 域A 联动增强 A→G]: 通货膨胀感知 — 跟踪商品价格指数,持续通胀影响生活成本感知
function trackInflationPerception(state) {
  if (!state || !state.trade) return;
  if (!state.flags) state.flags = {};
  var _inflationSample = state.flags._inflationSampleDay || 0;
  var _day = state.player && state.player.day;
  if (!_day || _day - _inflationSample < 5) return;
  state.flags._inflationSampleDay = _day;
  var _sampleGoods = ["rice", "egg", "cooking_oil", "vegetables", "pork"]; // [全系统自洽修复] 域A R870 A类#2: "oil"→"cooking_oil", "vegetable"→"vegetables"
  var _totalPrice = 0, _count = 0;
  for (var _gi = 0; _gi < _sampleGoods.length; _gi++) {
    var _prices = state.trade._lastPrices && state.trade._lastPrices[_sampleGoods[_gi]];
    if (_prices && _prices.length > 0) {
      _totalPrice += _prices[_prices.length - 1] || 0;
      _count++;
    }
  }
  if (_count < 3) return;
  var _avgPrice = _totalPrice / _count;
  var _prevAvg = state.flags._inflationBaseAvg || _avgPrice;
  if (!state.flags._inflationBaseAvg) {
    state.flags._inflationBaseAvg = _avgPrice;
    return;
  }
  var _inflationRate = (_avgPrice - _prevAvg) / _prevAvg;
  state.flags._inflationBaseAvg = _avgPrice;
  state.flags._cumulativeInflation = (state.flags._cumulativeInflation || 0) + _inflationRate;
  if (state.flags._cumulativeInflation > 0.15 && state.needs) {
    state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 1);
    if (typeof StateManager !== "undefined" && _day % 10 === 0) {
      StateManager.addMessage("📈 物价持续上涨，生活成本越来越高。心情-1。", "warning");
    }
  }
  if (state.flags._cumulativeInflation < -0.10 && state.needs) {
    state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 1);
  }

  // [R817 域A A→F 联动增强]: 记录价格指数供UI展示
  if (state.flags) {
    if (!state.flags._priceIndexHistory) state.flags._priceIndexHistory = [];
    state.flags._priceIndexHistory.push({
      day: _day,
      avgPrice: _avgPrice,
      inflation: _inflationRate,
      cumulativeInflation: state.flags._cumulativeInflation || 0,
    });
    if (state.flags._priceIndexHistory.length > 90) {
      state.flags._priceIndexHistory = state.flags._priceIndexHistory.slice(-90);
    }
  }

  // [R817 域A A→D 联动增强]: 价格异常社交传播 — 持续通胀时NPC会谈论物价
  if (state.flags && state.flags._cumulativeInflation && Math.abs(state.flags._cumulativeInflation) > 0.12 && state.relationships && state.player) {
    if (!state.flags._inflationSocialTalkDay || state.flags._inflationSocialTalkDay < state.player.day - 7) {
      state.flags._inflationSocialTalkDay = state.player.day;
      if (typeof StateManager !== "undefined") {
        var _dNpc = "老周";
        if (state.flags._cumulativeInflation > 0) {
          StateManager.addMessage("💬 在菜市场遇到" + _dNpc + "，他摇头叹气说物价涨得厉害，日子越来越紧巴了。", "hint");
        } else {
          StateManager.addMessage("💬 " + _dNpc + "高兴地说最近物价降了，能多买点肉了。", "hint");
        }
      }
    }
  }
}

// [R714 域A 联动增强 A→H]: 经济周期信号 — 基于价格走势检测经济周期,为公司运营提供商业洞察
function detectEconomicCycle(state) {
  if (!state || !state.trade || !state.flags) return null;
  if (!state.flags._inflationBaseAvg) return null;
  var cumInflation = state.flags._cumulativeInflation || 0;
  var cycle = "normal";
  if (cumInflation > 0.25) cycle = "boom";
  else if (cumInflation > 0.15) cycle = "inflation";
  else if (cumInflation < -0.15) cycle = "recession";
  else if (cumInflation < -0.08) cycle = "cooling";
  if (cycle !== "normal" && state.flags._lastEconomicCycle !== cycle) {
    state.flags._lastEconomicCycle = cycle;
    if (typeof StateManager !== "undefined") {
      var msgs = { boom: "📈 经济过热信号：物价持续上涨，投资需谨慎。", inflation: "📊 通胀加剧，生活成本上升，考虑增加收入来源。", recession: "📉 经济衰退信号：消费低迷，现金为王。", cooling: "🌡️ 经济降温，市场趋于理性，适合长期布局。" };
      StateManager.addMessage(msgs[cycle] || "🔄 经济周期转换。", "info");
      state.flags._economicCycle = cycle;
    }
  } else if (cycle === "normal" && state.flags._lastEconomicCycle !== "normal") {
    state.flags._lastEconomicCycle = "normal";
    state.flags._economicCycle = "normal";
  }
  return cycle;
}

// [全系统自洽修复] 域A R387 联动增强(A→B): 交易里程碑叙事—累计交易额触发成就事件
function checkTradeMilestone(state) {
  if (!state || !state.trade) return;
  if (!state.flags) state.flags = {};
  var totalSpent = state.trade._totalSpent || 0;
  var milestones = [1000, 5000, 10000, 50000, 100000, 500000];
  var triggered = state.flags._tradeMilestones || [];
  for (var mi = 0; mi < milestones.length; mi++) {
    var m = milestones[mi];
    if (totalSpent >= m && triggered.indexOf(m) < 0) {
      triggered.push(m);
      if (!state.flags) state.flags = {};
      state.flags._tradeMilestones = triggered;
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🏆 交易里程碑：累计交易额已达 ¥" + m.toLocaleString() + "！你在市场中越来越游刃有余。", "achievement");
      }
      break;
    }
  }
}

// [全系统自洽修复] 域A 联动增强(A→F): 价格极端预警 — 当前价格相对基准价偏离超过阈值时返回HTML提示
function getPriceExtremeAlert(goodId, currentPrice) {
  if (!goodId || currentPrice == null) return "";
  var good = getGoodById(goodId);
  if (!good || !good.basePrice) return "";
  var ratio = currentPrice / good.basePrice;
  if (ratio > 1.8) return '<span style="color:var(--danger);font-size:10px;">🔥 暴涨 ' + Math.round((ratio - 1) * 100) + '% 警惕回调</span>';
  if (ratio > 1.4) return '<span style="color:var(--warning);font-size:10px;">📈 偏高 ' + Math.round((ratio - 1) * 100) + '% 注意风险</span>';
  if (ratio < 0.4) return '<span style="color:var(--success);font-size:10px;">💎 低估 ' + Math.round((1 - ratio) * 100) + '% 可考虑入手</span>';
  if (ratio < 0.6) return '<span style="color:var(--info);font-size:10px;">📉 偏低 ' + Math.round((1 - ratio) * 100) + '% 关注机会</span>';
  return "";
}

// [全系统自洽修复] 域A R675 联动增强(A→F): 全城价格异常检测 — 返回所有地点的价格异常商品列表
function getAllPriceAnomalies(state) {
  if (!state || !state.trade || !state.trade.goodsPrices) return [];
  var anomalies = [];
  var seen = {};
  for (var _locKey in state.trade.goodsPrices) {
    if (!state.trade.goodsPrices.hasOwnProperty(_locKey)) continue;
    var _prices = state.trade.goodsPrices[_locKey];
    if (!_prices) continue;
    for (var _gid in _prices) {
      if (!_prices.hasOwnProperty(_gid)) continue;
      var _pp = _prices[_gid];
      if (seen[_gid]) continue;
      var _good = getGoodById(_gid);
      if (!_good || !_good.basePrice || _good.basePrice <= 0) continue;
      var _ratio = _pp / _good.basePrice;
      if (_ratio > 1.5 || _ratio < 0.5) {
        seen[_gid] = true;
        anomalies.push({
          goodId: _gid,
          goodName: _good.name,
          location: _locKey,
          ratio: Math.round(_ratio * 100) / 100,
          level: _ratio > 1.5 ? "high" : "low",
          price: _pp,
          basePrice: _good.basePrice,
        });
      }
    }
  }
  anomalies.sort(function (a, b) { return a.level === b.level ? b.ratio - a.ratio : a.level === "high" ? -1 : 1; });
  return anomalies.slice(0, 10);
}

// [全系统自洽修复] 域A R675 联动增强(A→B): 价格异常叙事 — 检测到全城价格异常时触发市场叙事
function checkPriceAnomalyNarrative(state) {
  if (!state || !state.flags || !state.player) return;
  var anomalies = getAllPriceAnomalies(state);
  if (anomalies.length === 0) return;
  // 每30天最多触发一次，避免刷屏
  var _lastNarrativeDay = state.flags._priceAnomalyNarrativeDay || 0;
  if (state.player.day - _lastNarrativeDay < 30) return;
  var _highCount = anomalies.filter(function (a) { return a.level === "high"; }).length;
  var _lowCount = anomalies.filter(function (a) { return a.level === "low"; }).length;
  if (_highCount >= 3) {
    state.flags._priceAnomalyNarrativeDay = state.player.day;
    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      StateManager.addMessage("📊 市场观察：全城有 " + _highCount + " 种商品价格异常偏高，商贩们都在谈论这波涨价潮。", "event");
    }
  } else if (_lowCount >= 3) {
    state.flags._priceAnomalyNarrativeDay = state.player.day;
    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      StateManager.addMessage("📊 市场观察：全城有 " + _lowCount + " 种商品价格异常偏低，精明的买家开始囤货。", "event");
    }
  }
}

// [全系统自洽修复] 域A R405 联动增强(A→F): 价格波动可视化 — 返回商品价格趋势箭头
function getPriceTrendIcon(locKey, goodId) {
  if (typeof getDailyPriceShock !== "function") return "➡️";
  var shock = getDailyPriceShock(locKey, goodId);
  if (shock > 0.05) return "📈";
  if (shock < -0.05) return "📉";
  return "➡️";
}

// [全系统自洽修复] 域A R51 联动增强(A→C): 技能驱动的市场分析 — 返回基于销售技能的价格洞察文本
function getSkillPriceInsight(state, locKey, goodId) {
  if (!state || !state.skills) return "";
  var salesLevel = (state.skills.sales && state.skills.sales.level) || 0;
  if (salesLevel < 20) return "";
  var good = getGoodById(goodId);
  if (!good) return "";
  var basePrice = good.basePrice || 0;
  var currentPrice = 0;
  if (typeof calcFinalPrice === "function") {
    currentPrice = calcFinalPrice(state, locKey, goodId);
  }
  if (currentPrice <= 0) return "";
  var ratio = currentPrice / basePrice;
  var insight = "";
  if (ratio > 1.3) insight = "当前价格偏高，适合出货";
  else if (ratio > 1.15) insight = "价格处于高位，可考虑卖出";
  else if (ratio < 0.7) insight = "当前价格偏低，适合囤货";
  else if (ratio < 0.85) insight = "价格处于低位，可考虑买入";
  else insight = "价格在合理区间波动";
  if (salesLevel >= 50) {
    var trend = getPriceTrendIcon(locKey, goodId);
    insight = trend + " " + insight + "（销售Lv." + salesLevel + "分析）";
  }
  return insight;
}
// [R722 第三轮 域A 联动增强 A→B]: 价格波动叙事
function getMarketNarrativeFromPrice(goodId, oldPrice, newPrice) {
  if (!goodId || !oldPrice || !newPrice || oldPrice <= 0) return null;
  var change = (newPrice - oldPrice) / oldPrice;
  var name = (getGoodById && getGoodById(goodId) && getGoodById(goodId).name) || goodId;
  if (change > 0.5) return { type: "price_surge", title: name + "暴涨", text: name + "价格暴涨" + Math.round(change * 100) + "%！市场一片恐慌。" };
  if (change > 0.2) return { type: "price_rise", title: name + "上涨", text: name + "价格上涨" + Math.round(change * 100) + "%，行情看涨。" };
  if (change < -0.3) return { type: "price_crash", title: name + "暴跌", text: name + "价格暴跌" + Math.round(Math.abs(change) * 100) + "%！抄底的机会？" };
  if (change < -0.1) return { type: "price_drop", title: name + "下跌", text: name + "价格下跌" + Math.round(Math.abs(change) * 100) + "%，可以关注。" };
  return null;
}

// [R722 第三轮 域A 联动增强 A→D]: 价格公平感知
function getPriceFairnessReaction(state, goodId, price) {
  if (!state || !goodId || !price) return 0;
  var basePrice = 0;
  var goods = typeof GOODS !== "undefined" ? GOODS : [];
  for (var _gi = 0; _gi < goods.length; _gi++) {
    if (goods[_gi] && goods[_gi].id === goodId) { basePrice = goods[_gi].basePrice || 0; break; }
  }
  if (basePrice <= 0) return 0;
  var ratio = price / basePrice;
  if (ratio > 2.5) return -2;
  if (ratio > 1.5) return -1;
  if (ratio < 0.6) return 1;
  return 0;
}


// [R730 第四轮 域A 联动增强 A→G]: 经济健康度指数
function getEconomicHealthIndex(state) {
  if (!state || !state.trade) return 50;
  var priceStability = 1.0;
  var count = 0;
  if (state.trade._lastPrices) {
    for (var gid in state.trade._lastPrices) {
      var arr = state.trade._lastPrices[gid];
      if (arr && arr.length >= 2) {
        var recent = arr.slice(-5);
        var avg = recent.reduce(function(s, v) { return s + v; }, 0) / recent.length;
        // [R1045 域A A类#2]: avg 为0时 variance 计算 NaN 风险 — 加 isFinite 守卫
        if (!isFinite(avg) || avg <= 0) continue;
        var variance = recent.reduce(function(s, v) { return s + Math.abs(v - avg); }, 0) / avg;
        if (!isFinite(variance)) continue;
        priceStability += Math.max(0, 1 - variance);
        count++;
      }
    }
  }
  var score = count > 0 ? Math.round((priceStability / count) * 50) : 50;
  if (!isFinite(score)) score = 50;
  return Math.max(0, Math.min(100, score));
}

// [R730 第四轮 域A 联动增强 A→B]: 商品情报叙事
function getGoodsIntelStory(goodId, state) {
  if (!goodId || !state || !state.trade) return null;
  var prices = state.trade._lastPrices && state.trade._lastPrices[goodId];
  if (!prices || prices.length < 3) return null;
  var recent = prices.slice(-3);
  var trend = recent[2] - recent[0];
  var name = (getGoodById && getGoodById(goodId) && getGoodById(goodId).name) || goodId;
  if (trend > 0) return { type: 'uptrend', title: name + '上行', text: name + '价格连续上涨，市场看好。' };
  if (trend < 0) return { type: 'downtrend', title: name + '下行', text: name + '价格连续下跌，观望为宜。' };
  return null;
}

// [R802 域A 联动增强 A→E]: 价格波动率影响投资风险评估 — 高波动市场提示风险
function getMarketVolatilityRisk(state) {
  if (!state || !state.trade || !state.trade._lastPrices) return "normal";
  var _volCount = 0, _totalCount = 0;
  for (var _gid in state.trade._lastPrices) {
    var _arr = state.trade._lastPrices[_gid];
    if (_arr && _arr.length >= 3) {
      _totalCount++;
      var _min = Math.min.apply(null, _arr);
      var _max = Math.max.apply(null, _arr);
      if (_min > 0 && (_max - _min) / _min > 0.3) _volCount++;
    }
  }
  if (_totalCount === 0) return "normal";
  var _ratio = _volCount / _totalCount;
  if (_ratio > 0.5) return "high";
  if (_ratio > 0.25) return "medium";
  return "low";
}

// [R802 域A 联动增强 A→C]: 交易次数积累提升职业技能 — 每交易100次提升销售/会计技能
function getTradeSkillBonus(state) {
  if (!state || !state.trade) return { sales: 0, accounting: 0 };
  var _totalTrades = (state.trade._totalBuyCount || 0) + (state.trade._totalSellCount || 0);
  var _salesBonus = Math.floor(_totalTrades / 100) * 2;
  var _accountingBonus = Math.floor(_totalTrades / 200) * 2;
  return { sales: _salesBonus, accounting: _accountingBonus };
}

// [R810 域A 联动增强 A→B]: 价格异常触发市场传闻 — 极端价格波动生成叙事素材
function getPriceAnomalyStory(goodId, change) {
  if (!goodId || !change) return null;
  var _good = typeof getGoodById === "function" ? getGoodById(goodId) : null;
  var _name = _good ? _good.name : goodId;
  if (change > 0.8) return { type: "panic", title: _name + "暴涨", text: _name + "价格暴涨" + Math.round(change * 100) + "%！市场恐慌情绪蔓延。" };
  if (change < -0.5) return { type: "opportunity", title: _name + "暴跌", text: _name + "价格暴跌" + Math.round(Math.abs(change) * 100) + "%！精明的买家开始行动。" };
  return null;
}

// [R810 域A 联动增强 A→H]: 市场价格波动影响公司运营成本 — 通胀/通缩影响公司成本
function getCorpCostFromMarket(state) {
  if (!state || !state.flags) return 1.0;
  var _inf = state.flags._cumulativeInflation || 0;
  if (_inf > 0.2) return 1.1;
  if (_inf > 0.1) return 1.05;
  if (_inf < -0.1) return 0.95;
  return 1.0;
}

// [R818 域A 联动增强 A→C]: 市场价格波动影响技能价值 — 高通胀时销售技能更值钱
function getSkillValueByMarket(state, skillId) {
  if (!state || !skillId || !state.flags) return 1.0;
  var _inf = state.flags._cumulativeInflation || 0;
  if (skillId === "sales" && _inf > 0.1) return 1.15;
  if (skillId === "accounting" && _inf > 0.15) return 1.1;
  if (skillId === "management" && _inf < -0.05) return 1.1;
  return 1.0;
}

// [R818 域A 联动增强 A→D]: 价格公平感影响NPC好感 — 高价买入/低价卖出影响情绪
function getPriceFairness(state, goodId, price) {
  if (!state || !goodId || !price) return 0;
  var _good = typeof getGoodById === "function" ? getGoodById(goodId) : null;
  if (!_good || !_good.basePrice) return 0;
  var _ratio = price / _good.basePrice;
  if (_ratio > 2.0) return -2;
  if (_ratio > 1.5) return -1;
  if (_ratio < 0.5) return 1;
  return 0;
}

// [R870 域A 联动增强 A→F]: 价格指数摘要 — 供UI展示通胀/通缩/经济健康度
function getPriceIndexSummary(state) {
  if (!state || !state.flags) return { level: "normal", text: "📊 物价平稳", color: "var(--text-muted)" };
  var cumInflation = state.flags._cumulativeInflation || 0;
  var indexHistory = state.flags._priceIndexHistory || [];
  var recentTrend = "stable";
  if (indexHistory.length >= 5) {
    var recent = indexHistory.slice(-5);
    var first = recent[0].avgPrice || 0;
    var last = recent[recent.length - 1].avgPrice || 0;
    if (first > 0) {
      var pct = (last - first) / first;
      if (pct > 0.05) recentTrend = "up";
      else if (pct < -0.05) recentTrend = "down";
    }
  }
  if (cumInflation > 0.25) return { level: "boom", text: "📈 经济过热（通胀+" + Math.round(cumInflation * 100) + "%）", color: "var(--danger)", trend: recentTrend };
  if (cumInflation > 0.1) return { level: "inflation", text: "📊 温和通胀（+" + Math.round(cumInflation * 100) + "%）", color: "var(--warning)", trend: recentTrend };
  if (cumInflation < -0.15) return { level: "recession", text: "📉 经济衰退（通缩" + Math.round(Math.abs(cumInflation) * 100) + "%）", color: "#9c27b0", trend: recentTrend };
  if (cumInflation < -0.05) return { level: "cooling", text: "🌡️ 经济降温（-" + Math.round(Math.abs(cumInflation) * 100) + "%）", color: "var(--info)", trend: recentTrend };
  return { level: "normal", text: "📊 物价平稳", color: "var(--text-muted)", trend: recentTrend };
}

// [R870 域A 联动增强 A→G]: 经济健康度影响日常状态 — 经济不稳定时增加疲劳/降低心情
function applyEconomicHealthToDaily(state) {
  if (!state || !state.needs || !state.flags) return;
  var healthIndex = typeof getEconomicHealthIndex === "function" ? getEconomicHealthIndex(state) : 50;
  if (healthIndex < 30) {
    state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 2);
    state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 3);
  } else if (healthIndex < 45) {
    state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 1);
    state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 1);
  } else if (healthIndex > 70) {
    state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 1);
  }
}

// [R870 域A 联动增强 A→B]: 通胀/通缩叙事 — 基于累积通胀触发更丰富的市场叙事
function triggerInflationNarrative(state) {
  if (!state || !state.flags || !state.player) return;
  var cumInflation = state.flags._cumulativeInflation || 0;
  var lastNarrativeDay = state.flags._lastInflationNarrativeDay || 0;
  var day = state.player.day || 0;
  if (day - lastNarrativeDay < 15) return;
  if (Math.abs(cumInflation) < 0.08) return;
  state.flags._lastInflationNarrativeDay = day;
  if (cumInflation > 0.2) {
    if (typeof StateManager !== "undefined") {
      StateManager.addMessage("🏪 菜市场里到处是抱怨声——" + (cumInflation > 0.3 ? "猪肉涨到买不起，连青菜都翻倍了。摊主说再这样下去只能改行。" : "物价涨得厉害，老主顾都少买了一半。卖菜大婶说今年的生意最难做。"), "event");
    }
  } else if (cumInflation > 0.1) {
    if (typeof StateManager !== "undefined") {
      StateManager.addMessage("💬 街坊邻居都在议论物价:" + (day % 2 === 0 ? "「昨天鸡蛋还3块，今天就3块5了!」" : "「米面油都涨了，工资怎么不涨啊!」"), "hint");
    }
  } else if (cumInflation < -0.15) {
    if (typeof StateManager !== "undefined") {
      StateManager.addMessage("🏪 市场格外冷清——" + (cumInflation < -0.2 ? "降价都没人买，经济确实不景气。一些店铺已经贴出了转让告示。" : "东西便宜了但买的人更少了，经济降温的寒意扑面而来。"), "warning");
    }
  } else if (cumInflation < -0.05) {
    if (typeof StateManager !== "undefined") {
      StateManager.addMessage("💬 超市打出促销牌:" + (day % 2 === 0 ? "「全场八折，抓紧囤货!」" : "「换季清仓，买一送一!」"), "hint");
    }
  }
}

// ====== [R915 域A 联动增强] 3项: A→B/A→C/A→G ======
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._pricingLinkageR915Loaded) return;
  RANDOM_EVENTS._pricingLinkageR915Loaded = true;

  RANDOM_EVENTS.push({
    id: "a_price_wave_story",
    phase: "street",
    icon: "📈",
    title: "市场价格波动",
    text: function (st) {
      if (!st || !st.flags) return "市场正在波动。";
      var inf = st.flags._cumulativeInflation || 0;
      if (inf > 0.15) return "菜市场的摊主们都在抱怨进货价一天比一天高。";
      if (inf < -0.1) return "物价持续下跌，街上冷冷清清的。";
      return "市场价格基本稳定。";
    },
    triggers: { minDay: 45, interval: 45 },
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._aPriceWaveCd && (st.player.day || 0) - st.flags._aPriceWaveCd < 45) return false;
      return true;
    },
    probability: 0.025,
    repeatable: true,
    choices: [
      { text: "囤点必需品", hint: "抵御通胀", apply: function (st) {
        if (!st.flags) st.flags = {};
        st.flags._aPriceWaveCd = st.player.day;
        var cash = st.resources ? (st.resources.cash || 0) : 0;
        if (cash >= 500) { st.resources.cash = cash - 500; if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3); }
        StateManager.addMessage("你囤了一些米面油。心情+3。", "info");
      }},
      { text: "记录价格变化", hint: "心智+3", apply: function (st) {
        if (!st.flags) st.flags = {};
        st.flags._aPriceWaveCd = st.player.day;
        if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
        StateManager.addMessage("你记录了价格变化。心智+3。", "info");
      }},
    ],
  });

  RANDOM_EVENTS.push({
    id: "a_skill_market_demand",
    phase: "street",
    icon: "💼",
    title: "技能市场风向",
    text: function (st) {
      return "编程和会计技能需求旺盛，传统手艺活市场在萎缩。";
    },
    triggers: { minDay: 60, interval: 60 },
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._aSkillDemandCd && (st.player.day || 0) - st.flags._aSkillDemandCd < 60) return false;
      return true;
    },
    probability: 0.02,
    repeatable: true,
    choices: [
      { text: "研究市场趋势", hint: "会计XP+10", apply: function (st) {
        if (!st.flags) st.flags = {};
        st.flags._aSkillDemandCd = st.player.day;
        if (typeof addSkillXp === "function") addSkillXp("accounting", 10);
        StateManager.addMessage("你研究了技能市场报告。会计XP+10。", "info");
      }},
      { text: "扫一眼", hint: "心智+2", apply: function (st) {
        if (!st.flags) st.flags = {};
        st.flags._aSkillDemandCd = st.player.day;
        if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
        StateManager.addMessage("你心里有数了。心智+2。", "info");
      }},
    ],
  });
})();

// ====== [R1023 域A 联动增强] 2项: A→E/A→F ======

// [R1023 域A 联动增强 A→E]: 价格波动指数影响投资信心
// 当市场价格波动剧烈时，玩家获得风险感知加成，投资决策更理性
function getPriceVolatilityInvestmentMod(state) {
  if (!state || !state.trade) return 0;
  var _events = state.trade.marketEvents || [];
  var _volatility = 0;
  for (var _ei = 0; _ei < _events.length; _ei++) {
    var _evt = _events[_ei];
    var _mod = _evt.priceMod || 1.0;
    _volatility += Math.abs(_mod - 1.0);
  }
  var _sd = state.trade.supplyDemand || {};
  for (var _lk in _sd) {
    for (var _gi in _sd[_lk]) {
      var _val = _sd[_lk][_gi] || 0;
      _volatility += Math.abs(_val) * 0.005;
    }
  }
  // 波动指数 0-1，越高表示市场越不稳定，玩家对投资风险更敏感
  return Math.min(1, _volatility);
}

// [R1023 域A 联动增强 A→F]: 价格异常摘要 — 供UI展示当前价格异常概况
function getPriceAnomalySummary(state) {
  if (!state || !state.trade) return [];
  var _anomalies = [];
  var _events = state.trade.marketEvents || [];
  for (var _ei = 0; _ei < _events.length; _ei++) {
    var _evt = _events[_ei];
    var _good = _evt.goodId === "*" ? null : getGoodById(_evt.goodId);
    _anomalies.push({
      name: _evt.name || "市场事件",
      goodName: _good ? _good.name : "全品类",
      icon: (_evt.priceMod || 1) > 1 ? "📈" : "📉",
      desc: _evt.desc || "",
      remaining: _evt.remaining || 0,
    });
  }
  return _anomalies;
}

// ====== [R1031 域A 联动增强] 2项: A→H/A→C ======

// [R1031 域A 联动增强 A→H]: 价格波动影响公司招聘成本
// 当市场波动剧烈时，公司招聘成本上升（人才更难招）；
// 当市场低迷时，招聘成本下降（求职者更多）
function getRecruitCostFromMarket(state) {
  // [全系统自洽修复] 域A R1045 A类#3: state 守卫 — 防止 state 为 null/undefined 时抛 TypeError
  if (!state || !state.flags) return 1.0;
  var _vol = 0;
  // 用市场事件数量+价格波动率估算人才市场竞争程度
  if (state.trade && state.trade.marketEvents) {
    _vol = state.trade.marketEvents.length * 0.05;
  }
  var _inf = Math.abs(state.flags._cumulativeInflation || 0);
  if (_inf > 0.15) _vol += 0.1;
  var _econCycle = state.flags._economicCycle || "normal";
  if (_econCycle === "boom") _vol += 0.15;
  else if (_econCycle === "recession") _vol = Math.max(0, _vol - 0.1);
  // 招聘成本乘数: 0.8~1.3
  return Math.max(0.8, Math.min(1.3, 1.0 + _vol));
}

// [R1031 域A 联动增强 A→C]: 技能市场价值动态 — 经济周期影响特定技能的市场溢价
// 通胀期：销售/会计技能更值钱；通缩期：管理/技术技能更稳定
function getDynamicSkillMarketValue(state, skillId) {
  if (!state || !state.flags || !skillId) return 1.0;
  var _inf = state.flags._cumulativeInflation || 0;
  if (_inf > 0.15) {
    // 通胀期 — 销售溢价
    if (skillId === "sales") return 1.2;
    if (skillId === "accounting") return 1.15;
    if (skillId === "cooking") return 1.1; // 通胀期自己做饭更省钱
  } else if (_inf < -0.1) {
    // 通缩期 — 技术/管理更稳定
    if (skillId === "coding") return 1.15;
    if (skillId === "management") return 1.1;
    if (skillId === "repair") return 1.1;
  } else {
    // 平稳期 — 技能价值回归基准
    return 1.0;
  }
  return 1.0;
}

// 导出到window
if (typeof window !== "undefined") {
  window.getPriceVolatilityInvestmentMod = getPriceVolatilityInvestmentMod;
  window.getPriceAnomalySummary = getPriceAnomalySummary;
  window.getRecruitCostFromMarket = getRecruitCostFromMarket;
  window.getDynamicSkillMarketValue = getDynamicSkillMarketValue;

  // [R1039 域A 第二轮 联动增强 A→B]: 极端价格波动叙事 — 价格异常时生成市场传闻
  window.getPriceAnomalyNarrative = function (state) {
    if (!state || !state.trade || !state.trade.marketEvents) return null;
    var _events = state.trade.marketEvents;
    for (var _ei = 0; _ei < _events.length; _ei++) {
      var _evt = _events[_ei];
      if (_evt && (_evt.priceMod || 1) > 1.5) {
        return { type: "surge", title: _evt.name + "暴涨", text: _evt.desc + "。市场上的货被抢购一空。" };
      }
      if (_evt && (_evt.priceMod || 1) < 0.6) {
        return { type: "crash", title: _evt.name + "暴跌", text: _evt.desc + "。到处都是跳楼价。" };
      }
    }
    return null;
  };

  // [R1039 域A 第二轮 联动增强 A→F]: 价格趋势可视化 — 供UI渲染价格走势折线图
  window.getPriceTrendsForUI = function (state, days) {
    if (!state || !state.trade || !state.trade._lastPrices) return [];
    days = days || 14;
    var _result = [];
    for (var _gid in state.trade._lastPrices) {
      var _arr = state.trade._lastPrices[_gid];
      if (_arr && Array.isArray(_arr) && _arr.length >= 2) {
        _result.push({
          goodId: _gid,
          goodName: (typeof getGoodById === "function" && getGoodById(_gid)) ? getGoodById(_gid).name : _gid,
          prices: _arr.slice(-days),
          trend: _arr[_arr.length - 1] > _arr[0] ? "up" : (_arr[_arr.length - 1] < _arr[0] ? "down" : "stable"),
          change: _arr.length >= 2 ? Math.round(((_arr[_arr.length - 1] - _arr[0]) / _arr[0]) * 100) : 0,
        });
      }
    }
    _result.sort(function (a, b) { return Math.abs(b.change) - Math.abs(a.change); });
    return _result.slice(0, 8);
  };

  // [R1025 域A 联动增强 A→B]: 市场数据叙事 — 基于价格波动/供需数据触发市场叙事
  window.getMarketDataNarrative = function (state) {
    if (!state || !state.trade || !state.trade.supplyDemand) return null;
    var _narratives = [];
    var _topFluct = 0, _topGood = "", _topLoc = "";
    for (var _loc in state.trade.supplyDemand) {
      for (var _gid in state.trade.supplyDemand[_loc]) {
        var _sd = state.trade.supplyDemand[_loc][_gid] || 0;
        if (Math.abs(_sd) > Math.abs(_topFluct)) {
          _topFluct = _sd;
          _topGood = _gid;
          _topLoc = _loc;
        }
      }
    }
    if (Math.abs(_topFluct) >= 15) {
      var _dir = _topFluct > 0 ? "供大于求" : "供不应求";
      _narratives.push({ good: _topGood, location: _topLoc, direction: _dir, intensity: Math.abs(_topFluct) });
    }
    return _narratives.length > 0 ? _narratives : null;
  };

  // [R1025 域A 联动增强 A→C]: 技能市场价值排名 — 注意：不与 skills.js 的 getSkillMarketValue(skillId) 冲突
// [R1045 域A A类#1]: 命名冲突修复 — 原为 getSkillMarketValue 覆盖 skills.js 同名函数
  window.getSkillMarketValueRanking = function (state) {
    if (!state || !state.skills) return null;
    var _topSkills = [];
    for (var _sk in state.skills) {
      if (state.skills[_sk] && state.skills[_sk].level) {
        _topSkills.push({ id: _sk, level: state.skills[_sk].level });
      }
    }
    _topSkills.sort(function (a, b) { return b.level - a.level; });
    return _topSkills.slice(0, 3);
  };

  // [R1025 域A 联动增强 A→F]: 价格趋势图表 — 供UI渲染的价格趋势数据
  window.getPriceTrendChartData = function (state, goodId, days) {
    if (!state || !goodId || !state.trade || !state.trade._lastPrices) return [];
    days = days || 14;
    var _prices = state.trade._lastPrices[goodId];
    if (!_prices || !Array.isArray(_prices)) return [];
    return _prices.slice(-days).map(function (p, i) {
      return { day: i + 1, price: p };
    });
  };

  // ====== [R1045 域A 联动增强] 2项: A→B/A→G ======

  // [R1045 域A 联动增强 A→B]: 价格波动日报叙事 — 每日价格波动生成市场简短叙事
  window.getPriceDailyNarrative = function (state) {
    if (!state || !state.trade || !state.trade._lastPrices) return null;
    var _goods = state.trade._lastPrices;
    var _upCount = 0, _downCount = 0, _topGood = "", _topChange = 0;
    for (var _gid in _goods) {
      var _arr = _goods[_gid];
      if (!Array.isArray(_arr) || _arr.length < 2) continue;
      var _change = _arr[_arr.length - 1] - _arr[_arr.length - 2];
      if (_change > 0) { _upCount++; if (_change > _topChange) { _topChange = _change; _topGood = _gid; } }
      else if (_change < 0) { _downCount++; if (Math.abs(_change) > _topChange) { _topChange = Math.abs(_change); _topGood = _gid; } }
    }
    if (_upCount === 0 && _downCount === 0) return null;
    var _goodName = (typeof getGoodById === "function" && getGoodById(_topGood)) ? getGoodById(_topGood).name : _topGood;
    if (_upCount > _downCount * 2) return { type: "bullish", text: "📈 今日" + _upCount + "种商品涨价，市场情绪偏多。其中" + _goodName + "涨幅最大。" };
    if (_downCount > _upCount * 2) return { type: "bearish", text: "📉 今日" + _downCount + "种商品降价，市场情绪偏空。" + _goodName + "跌幅领先。" };
    if (_upCount > _downCount) return { type: "slight_up", text: "📊 今日" + _upCount + "涨" + _downCount + "跌，市场整体平稳偏强。" };
    if (_downCount > _upCount) return { type: "slight_down", text: "📊 今日" + _downCount + "跌" + _upCount + "涨，市场整体偏弱。" };
    return { type: "stable", text: "📊 今日市场价格波动不大，整体平稳。" };
  };

  // [R1045 域A 联动增强 A→G]: 经济健康度影响睡眠质量 — 高通胀/高税负环境降低疲劳恢复
  window.getSleepQualityFromEconomy = function (state) {
    if (!state || !state.flags || !state.needs) return 1.0;
    var _penalty = 0;
    if (Math.abs(state.flags._cumulativeInflation || 0) > 0.15) _penalty += 0.15;
    if (state.flags._sleepQualityPenalty) _penalty += state.flags._sleepQualityPenalty * 0.05;
    var _econDashboard = state.flags._econDashboard;
    if (_econDashboard && _econDashboard.wealthTax > 1000) _penalty += 0.1;
    if (_penalty <= 0) return 1.0;
    return Math.max(0.65, 1.0 - _penalty);
  };

  // [R1045 域A 联动增强 A→E #3]: 市场波动影响投资风险提示 — 价格波动剧烈时投资系统获得风险感知加成
  window.getMarketVolatilityRiskLevel = function (state) {
    if (!state || !state.trade) return "normal";
    var _events = state.trade.marketEvents || [];
    var _volScore = 0;
    for (var _ei = 0; _ei < _events.length; _ei++) {
      var _evt = _events[_ei];
      _volScore += Math.abs((_evt.priceMod || 1.0) - 1.0);
    }
    if (_volScore > 1.0) return "high";
    if (_volScore > 0.5) return "medium";
    return "low";
  };

  // [R1045 域A 联动增强 A→F #4]: 价格异常摘要UI — 返回当前市场事件列表供UI顶部提示条渲染
  window.getMarketEventSummaryForUI = function (state) {
    if (!state || !state.trade || !state.trade.marketEvents) return [];
    return state.trade.marketEvents.map(function (evt) {
      return {
        name: evt.name || "市场事件",
        icon: (evt.priceMod || 1) > 1 ? "📈" : "📉",
        desc: evt.desc || "",
        remaining: evt.remaining || 0,
      };
    });
  };

  // [R1045 域A 联动增强 A→G #5]: 经济压力影响AP消耗 — 经济不稳定时日常行动消耗增加
  window.getEconomyActionApCost = function (state, baseCost) {
    if (!state || !state.flags || typeof baseCost !== "number") return baseCost;
    var _penalty = 0;
    var _inf = Math.abs(state.flags._cumulativeInflation || 0);
    if (_inf > 0.2) _penalty = 2;
    else if (_inf > 0.1) _penalty = 1;
    var _sleep = state.flags._sleepQualityPenalty || 0;
    if (_sleep > 2) _penalty += 1;
    return Math.max(0, baseCost + _penalty);
  };

  // [R1017 域A 联动增强 A→D]: 价格公平NPC好感影响 — 异常价格影响NPC社交情绪
  window.getPriceFairnessSocialEffect = function (state, price, basePrice) {
    if (!state || typeof price !== "number" || typeof basePrice !== "number" || basePrice <= 0) return 0;
    var _ratio = price / basePrice;
    if (_ratio > 2.0) return -2;
    if (_ratio > 1.5) return -1;
    if (_ratio < 0.5) return 1;
    return 0;
  };

  // [R1017 域A 联动增强 A→B]: 季节性价格波动叙事 — 季节变化对价格的影响文本
  window.getSeasonalPriceNarrative = function (state, goodId) {
    if (!state || !goodId) return null;
    var _good = typeof getGoodById === "function" ? getGoodById(goodId) : null;
    if (!_good || !_good.seasonal) return null;
    var _season = (state.weather && state.weather.season) || "spring";
    var _mod = _good.seasonal[_season];
    if (!isFinite(_mod) || _mod === 1.0) return null;
    var _name = _good.name || goodId;
    if (_mod > 1.3) return { icon: "📈", text: _name + "因季节原因价格偏高（旺季倍率×" + _mod.toFixed(1) + "）" };
    if (_mod < 0.7) return { icon: "📉", text: _name + "正值当季，价格比平时便宜（淡季倍率×" + _mod.toFixed(1) + "）" };
    return { icon: "🌤️", text: _name + "的季节性价格波动在正常范围内（×" + _mod.toFixed(1) + "）" };
  };

  // [R1017 域A 联动增强 A→F]: 价格热力图数据 — 商品价格相对基准偏离程度
  window.getPriceHeatmapData = function (state) {
    if (!state || !state.trade || !state.trade.goodsPrices) return [];
    var _result = [];
    for (var _locKey in state.trade.goodsPrices) {
      if (!state.trade.goodsPrices.hasOwnProperty(_locKey)) continue;
      var _goods = state.trade.goodsPrices[_locKey];
      if (!_goods) continue;
      for (var _gid in _goods) {
        if (!_goods.hasOwnProperty(_gid)) continue;
        var _price = _goods[_gid];
        if (typeof _price !== "number" || !isFinite(_price)) continue;
        var _good = typeof getGoodById === "function" ? getGoodById(_gid) : null;
        var _base = _good ? (_good.basePrice || 1) : 1;
        if (_base <= 0) _base = 1;
        var _ratio = _price / _base;
        var _level = "normal";
        if (_ratio > 1.5) _level = "high";
        else if (_ratio > 1.2) _level = "elevated";
        else if (_ratio < 0.6) _level = "low";
        else if (_ratio < 0.8) _level = "discount";
        _result.push({
          location: _locKey,
          goodId: _gid,
          goodName: _good ? _good.name : _gid,
          currentPrice: _price,
          basePrice: _base,
          ratio: Math.round(_ratio * 100) / 100,
          level: _level,
        });
      }
    }
    _result.sort(function (a, b) { return a.ratio - b.ratio; });
    return _result;
  };
}
