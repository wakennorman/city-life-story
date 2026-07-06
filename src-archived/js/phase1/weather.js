/**
 * 天气与气候系统
 *
 * 设计参考：Don't Starve（四季+温度+理智）、Project Zomboid（雨→感冒+季节）、Stardew Valley（雨影响作物+季节循环）
 *
 * 核心机制：
 * - 四季循环（春→夏→秋→冬，每季30天）
 * - 温度系统（影响健康、体感、衣物需求）
 * - 天气类型（晴/多云/阴/小雨/大雨/暴雨/雷暴/小雪/大雪/暴雪/雾/沙尘暴/台风）
 * - 天气对游戏的影响：AP消耗、交易价格、运输风险、健康/心情、随机事件触发
 */

// ====== 季节定义 ======
const SEASONS = {
  spring: {
    name: "春",
    icon: "🌸",
    tempRange: [8, 22],
    daysPerSeason: 30,
    desc: "万物复苏，偶有春雨",
  },
  summer: {
    name: "夏",
    icon: "☀️",
    tempRange: [25, 38],
    daysPerSeason: 30,
    desc: "酷暑难耐，时有暴雨台风",
  },
  autumn: {
    name: "秋",
    icon: "🍂",
    tempRange: [10, 25],
    daysPerSeason: 30,
    desc: "秋高气爽，偶有秋雨大雾",
  },
  winter: {
    name: "冬",
    icon: "❄️",
    tempRange: [-8, 8],
    daysPerSeason: 30,
    desc: "天寒地冻，时有风雪",
  },
};

const SEASON_ORDER = ["spring", "summer", "autumn", "winter"];

/** 根据天数获取当前季节 */
function getSeason(day) {
  const yearDay = (day - 1) % 120; // 120天 = 1年
  const seasonIdx = Math.floor(yearDay / 30);
  return SEASON_ORDER[Math.min(seasonIdx, 3)];
}

/** 获取季节内的天数（1-30） */
function getSeasonDay(day) {
  return ((day - 1) % 30) + 1;
}

/** 获取年份 */
function getYear(day) {
  return Math.floor((day - 1) / 120) + 1;
}

// ====== 天气类型定义 ======
const WEATHER_TYPES = {
  sunny: {
    name: "晴",
    icon: "☀️",
    apMod: 0,
    priceMod: 1.0,
    transportRisk: 0,
    moodMod: 3,
    fatigueMod: 0,
    healthMod: 0,
    tempMod: 2,
    visible: true,
  },
  partly_cloudy: {
    name: "多云",
    icon: "⛅",
    apMod: 0,
    priceMod: 1.0,
    transportRisk: 0,
    moodMod: 0,
    fatigueMod: 0,
    healthMod: 0,
    tempMod: 0,
    visible: true,
  },
  cloudy: {
    name: "阴",
    icon: "☁️",
    apMod: 0,
    priceMod: 1.0,
    transportRisk: 0,
    moodMod: -2,
    fatigueMod: 0,
    healthMod: 0,
    tempMod: -1,
    visible: true,
  },
  light_rain: {
    name: "小雨",
    icon: "🌦️",
    apMod: 2,
    priceMod: 0.95,
    transportRisk: 1.05,
    moodMod: -3,
    fatigueMod: 1,
    healthMod: 0,
    tempMod: -2,
    visible: true,
  },
  heavy_rain: {
    name: "大雨",
    icon: "🌧️",
    apMod: 5,
    priceMod: 0.9,
    transportRisk: 1.15,
    moodMod: -5,
    fatigueMod: 2,
    healthMod: -1,
    tempMod: -3,
    visible: true,
  },
  thunderstorm: {
    name: "雷暴",
    icon: "⛈️",
    apMod: 5, // 降低：从10减到5
    priceMod: 0.85,
    transportRisk: 1.2, // 降低：从1.3到1.2
    moodMod: -6, // 降低：从-8到-6
    fatigueMod: 2, // 降低：从3到2
    healthMod: -1, // 降低：从-2到-1
    tempMod: -2, // 降低：从-3到-2
    visible: false,
  },
  light_snow: {
    name: "小雪",
    icon: "🌨️",
    apMod: 3,
    priceMod: 1.05,
    transportRisk: 1.1,
    moodMod: -2,
    fatigueMod: 2,
    healthMod: -1,
    tempMod: -5,
    visible: true,
  },
  heavy_snow: {
    name: "大雪",
    icon: "❄️",
    apMod: 8,
    priceMod: 1.1,
    transportRisk: 1.3,
    moodMod: -5,
    fatigueMod: 3,
    healthMod: -2,
    tempMod: -8,
    visible: false,
  },
  blizzard: {
    name: "暴雪",
    icon: "🌨️",
    apMod: 15,
    priceMod: 1.2,
    transportRisk: 1.6,
    moodMod: -10,
    fatigueMod: 5,
    healthMod: -3,
    tempMod: -12,
    visible: false,
  },
  fog: {
    name: "大雾",
    icon: "🌫️",
    apMod: 3,
    priceMod: 0.98,
    transportRisk: 1.1,
    moodMod: -1,
    fatigueMod: 1,
    healthMod: 0,
    tempMod: 0,
    visible: true,
  },
  sandstorm: {
    name: "沙尘暴",
    icon: "💨",
    apMod: 10,
    priceMod: 1.1,
    transportRisk: 1.4,
    moodMod: -8,
    fatigueMod: 3,
    healthMod: -2,
    tempMod: 3,
    visible: false,
  },
  typhoon: {
    name: "台风",
    icon: "🌀",
    apMod: 20,
    priceMod: 0.8,
    transportRisk: 1.8,
    moodMod: -15,
    fatigueMod: 5,
    healthMod: -3,
    tempMod: -5,
    visible: false,
  },
  heatwave: {
    name: "热浪",
    icon: "🔥",
    apMod: 5,
    priceMod: 1.1,
    transportRisk: 1.05,
    moodMod: -5,
    fatigueMod: 3,
    healthMod: -2,
    tempMod: 8,
    visible: true,
  },
  cold_snap: {
    name: "寒潮",
    icon: "🥶",
    apMod: 8,
    priceMod: 1.15,
    transportRisk: 1.2,
    moodMod: -6,
    fatigueMod: 3,
    healthMod: -2,
    tempMod: -10,
    visible: false,
  },
};

// ====== 各季节天气概率表 ======
// 每个季节有不同的天气出现概率（百分比）
const SEASON_WEATHER_PROBS = {
  spring: {
    sunny: 25,
    partly_cloudy: 25,
    cloudy: 15,
    light_rain: 20,
    heavy_rain: 8,
    thunderstorm: 2,
    fog: 5,
    light_snow: 0,
    heavy_snow: 0,
    blizzard: 0,
    sandstorm: 0,
    typhoon: 0,
    heatwave: 0,
    cold_snap: 0,
  },
  summer: {
    sunny: 30,
    partly_cloudy: 20,
    cloudy: 8,
    light_rain: 10,
    heavy_rain: 12,
    thunderstorm: 5,
    fog: 0,
    light_snow: 0,
    heavy_snow: 0,
    blizzard: 0,
    sandstorm: 2,
    typhoon: 3,
    heatwave: 10,
    cold_snap: 0,
  },
  autumn: {
    sunny: 20,
    partly_cloudy: 25,
    cloudy: 15,
    light_rain: 15,
    heavy_rain: 8,
    thunderstorm: 2,
    fog: 10,
    light_snow: 0,
    heavy_snow: 0,
    blizzard: 0,
    sandstorm: 2,
    typhoon: 1,
    heatwave: 0,
    cold_snap: 2,
  },
  winter: {
    sunny: 15,
    partly_cloudy: 15,
    cloudy: 15,
    light_rain: 0,
    heavy_rain: 0,
    thunderstorm: 0,
    fog: 5,
    light_snow: 25,
    heavy_snow: 15,
    blizzard: 5,
    sandstorm: 0,
    typhoon: 0,
    heatwave: 0,
    cold_snap: 5,
  },
};

// ====== 温度体感与效果 ======
const TEMP_EFFECTS = [
  {
    name: "酷热",
    minTemp: 38,
    maxTemp: 99,
    fatigueMod: 5,
    healthMod: -3,
    moodMod: -8,
    desc: "热得喘不过气，中暑风险极高",
  },
  {
    name: "炎热",
    minTemp: 32,
    maxTemp: 38,
    fatigueMod: 3,
    healthMod: -1,
    moodMod: -4,
    desc: "汗如雨下，体力消耗加快",
  },
  {
    name: "温暖",
    minTemp: 18,
    maxTemp: 32,
    fatigueMod: 0,
    healthMod: 0,
    moodMod: 2,
    desc: "体感舒适",
  },
  {
    name: "凉爽",
    minTemp: 8,
    maxTemp: 18,
    fatigueMod: 0,
    healthMod: 0,
    moodMod: 1,
    desc: "微凉，精神不错",
  },
  {
    name: "寒冷",
    minTemp: 0,
    maxTemp: 8,
    fatigueMod: 2,
    healthMod: -1,
    moodMod: -3,
    desc: "冻手冻脚，行动迟缓",
  },
  {
    name: "严寒",
    minTemp: -8,
    maxTemp: 0,
    fatigueMod: 4,
    healthMod: -2,
    moodMod: -6,
    desc: "刺骨寒冷，随时可能冻伤",
  },
  {
    name: "极寒",
    minTemp: -99,
    maxTemp: -8,
    fatigueMod: 6,
    healthMod: -4,
    moodMod: -10,
    desc: "随时可能冻死！",
  },
];

/** 获取温度体感效果 */
function getTempEffect(temperature) {
  for (const eff of TEMP_EFFECTS) {
    if (temperature >= eff.minTemp && temperature < eff.maxTemp) return eff;
  }
  return TEMP_EFFECTS[3]; // 默认凉爽
}

// ====== 天气生成器 ======

/** 根据季节和随机数生成天气（加权随机选择天气类型） */
function generateWeather(season) {
  const probs = SEASON_WEATHER_PROBS[season];
  if (!probs) return "sunny";

  const entries = Object.entries(probs);
  const result = Random.weighted(entries, (e) => e[1]);
  return result ? result[0] : "sunny";
}

/** 根据季节和天气生成温度 */
function generateTemperature(season, weatherId) {
  const seasonDef = SEASONS[season];
  const [minT, maxT] = seasonDef.tempRange;
  const weatherDef = WEATHER_TYPES[weatherId];

  // 基础温度在季节范围内随机
  let temp = minT + Random.float(0, maxT - minT);

  // 天气对温度的影响
  temp += weatherDef.tempMod;

  // 昼夜温差（上午偏暖+2，晚上偏凉-3）
  // 注意：这里只返回基础温度，昼夜调整在 tick 时根据时段做

  return Math.round(temp * 10) / 10;
}

/** 初始化天气状态（新游戏或新的一天） */
function initWeatherState(state) {
  if (!state.weather) {
    state.weather = {};
  }

  const season = getSeason(state.player.day);
  const weatherId = generateWeather(season);
  const temperature = generateTemperature(season, weatherId);

  // 连续性：30%概率延续昨天的天气
  if (state.weather.weatherId && Random.chance(0.3)) {
    // 延续昨日天气，但温度微调
    state.weather.temperature =
      Math.round((state.weather.temperature + Random.float(-1.5, 1.5)) * 10) /
      10;
  } else {
    state.weather.weatherId = weatherId;
    state.weather.temperature = temperature;
  }

  state.weather.season = season;
  state.weather.seasonDay = getSeasonDay(state.player.day);
  state.weather.year = getYear(state.player.day);

  // 根据时段调整温度
  adjustTempForTimeSlot(state);

  // 缓存天气定义
  state.weather.weatherDef =
    WEATHER_TYPES[state.weather.weatherId] || WEATHER_TYPES.sunny;
  state.weather.tempEffect = getTempEffect(state.weather.temperature);
}

/** 根据时段微调温度 */
function adjustTempForTimeSlot(state) {
  if (!state.weather) return;
  const slot = state.player.timeSlot;
  const adj = slot === "morning" ? 1 : slot === "afternoon" ? 3 : -2;
  state.weather.temperature =
    Math.round((state.weather.temperature + adj) * 10) / 10;
}

// ====== 天气对游戏的影响 ======

/** 获取天气对旅行AP的额外消耗 */
function getWeatherTravelAPPenalty(state) {
  if (!state.weather || !state.weather.weatherDef) return 0;
  return state.weather.weatherDef.apMod;
}

/** 获取天气对交易价格的修正系数 */
function getWeatherPriceModifier(state) {
  if (!state.weather || !state.weather.weatherDef) return 1.0;
  return state.weather.weatherDef.priceMod;
}

/**
 * 获取天气对客流量（foot traffic）的影响修正系数
 *
 * 客流量直接影响摆摊收入：晴天人多生意好，雨天没人出门。
 * 返回 0.0 ~ 1.0+，1.0 为正常水平
 */
function getWeatherFootTrafficModifier(state) {
  if (!state.weather || !state.weather.weatherDef) return 1.0;
  const w = state.weather.weatherDef;
  const footTraffic = {
    sunny: 1.0,
    partly_cloudy: 0.95,
    cloudy: 0.9,
    light_rain: 0.65,
    heavy_rain: 0.4,
    thunderstorm: 0.2,
    light_snow: 0.55,
    heavy_snow: 0.35,
    blizzard: 0.15,
    fog: 0.6,
    sandstorm: 0.15,
    typhoon: 0.1,
    heatwave: 0.7,
    cold_snap: 0.6,
  };
  const base = footTraffic[w.id] || 1.0;

  // 时段修正：下午客流量高于上午和晚上
  if (state.player) {
    const slot = state.player.timeSlot;
    if (slot === "afternoon") return Math.min(1.0, base + 0.1);
    if (slot === "evening") return Math.max(0.05, base - 0.05);
  }
  return base;
}

/**
 * 获取天气下特定商品的"需求加成"倍率
 * 某些坏天气下特定商品反而热卖（雨天卖伞、热天卖水）
 * 在 footTraffic 的基础上叠加此倍率，可部分抵消交通量下降
 */
function getWeatherDemandBonus(weatherId, goodId) {
  // 需求图谱: weatherId → goodId → demandBonus
  const demandMap = {
    light_rain: { daily_use: 1.3, cigarettes: 1.1, instant_noodles: 1.1 },
    heavy_rain: { daily_use: 1.5, cigarettes: 1.15, instant_noodles: 1.15 },
    thunderstorm: { daily_use: 1.6, cigarettes: 1.2, instant_noodles: 1.2 },
    typhoon: { daily_use: 1.8, cigarettes: 1.3 },
    heatwave: { water: 1.5, beer: 1.3, fruits: 1.15, snacks: 1.1 },
    sunny: { water: 1.1, beer: 1.15, fruits: 1.1 },
    cold_snap: { clothing: 1.3, instant_noodles: 1.2, cigarettes: 1.1 },
    light_snow: { clothing: 1.2, instant_noodles: 1.15 },
    heavy_snow: { clothing: 1.4, instant_noodles: 1.2, cigarettes: 1.15 },
    blizzard: { clothing: 1.6, instant_noodles: 1.3, cigarettes: 1.2 },
    fog: { daily_use: 1.1, cigarettes: 1.1 },
  };
  return demandMap[weatherId]?.[goodId] || 1.0;
}

/** 获取天气对运输风险的修正系数 */
function getWeatherTransportRiskModifier(state) {
  if (!state.weather || !state.weather.weatherDef) return 1.0;
  return state.weather.weatherDef.transportRisk;
}

/** 天气是否导致无法出行（极端天气） */
function isWeatherTravelBlocked(state) {
  if (!state.weather || !state.weather.weatherDef) return false;
  return !state.weather.weatherDef.visible;
}

/** 每日结算天气对属性的影响 */
function applyWeatherDailyEffects(state) {
  if (!state.weather) return;

  const w = state.weather.weatherDef;
  const t = state.weather.tempEffect;

  // 天气对心情的影响
  state.needs.happiness = Math.max(
    0,
    Math.min(100, state.needs.happiness + (w.moodMod || 0) + (t.moodMod || 0)),
  );

  // 天气对疲劳的影响
  state.needs.fatigue = Math.max(
    0,
    Math.min(
      100,
      state.needs.fatigue + (w.fatigueMod || 0) + (t.fatigueMod || 0),
    ),
  );

  // 天气对健康的影响
  state.status.health = Math.max(
    0,
    Math.min(
      100,
      state.status.health + (w.healthMod || 0) + (t.healthMod || 0),
    ),
  );

  // 极端天气导致生病/受伤
  if (w.healthMod <= -2 && Random.chance(0.15)) {
    if (!state.status.sick) {
      state.status.sick = true;
      StateManager.addMessage(`🤒 ${w.name}天气导致你生病了！`, "danger");
    }
  }
  if (t.healthMod <= -3 && Random.chance(0.1)) {
    if (!state.status.injured) {
      state.status.injured = true;
      StateManager.addMessage(`🩹 ${t.name}导致你受了伤！`, "danger");
    }
  }

  // 大雨/暴雪天气的额外事件
  if (state.weather.weatherId === "heavy_rain" && Random.chance(0.2)) {
    StateManager.addMessage("🌧️ 大雨倾盆，路面积水，行动困难。", "warning");
  }
  if (state.weather.weatherId === "thunderstorm" && Random.chance(0.15)) {
    StateManager.addMessage("⚡ 雷电交加，不宜外出！", "danger");
  }
  if (state.weather.weatherId === "blizzard" && Random.chance(0.2)) {
    StateManager.addMessage(
      "❄️ 暴风雪肆虐，能见度极低，请留在室内！",
      "danger",
    );
  }
  if (state.weather.weatherId === "typhoon" && Random.chance(0.3)) {
    StateManager.addMessage("🌀 台风来袭，不要外出！", "danger");
  }
  if (state.weather.weatherId === "sandstorm" && Random.chance(0.2)) {
    StateManager.addMessage("💨 沙尘漫天，呼吸困难，货物可能受损！", "warning");
  }
  if (state.weather.weatherId === "heatwave" && Random.chance(0.15)) {
    StateManager.addMessage("🔥 热浪滚滚，注意防暑降温！", "warning");
  }
  if (state.weather.weatherId === "cold_snap" && Random.chance(0.15)) {
    StateManager.addMessage("🥶 寒潮来袭，冻得直哆嗦！", "warning");
  }

  // 舒适天气的正面事件
  if (
    state.weather.weatherId === "sunny" &&
    state.weather.season === "autumn" &&
    Random.chance(0.2)
  ) {
    StateManager.addMessage("🍂 秋高气爽，阳光正好，心情不错！", "success");
    state.needs.happiness = Math.min(100, state.needs.happiness + 5);
  }
  if (
    state.weather.weatherId === "sunny" &&
    state.weather.season === "spring" &&
    Random.chance(0.15)
  ) {
    StateManager.addMessage("🌸 春暖花开，空气清新！", "success");
    state.needs.happiness = Math.min(100, state.needs.happiness + 3);
  }

  // 下雨影响运输中货物的损坏（与 carry.js 的天气事件联动）
  // 已在 carry.js 的 hireTransport 中预留了天气检查接口

  // === 舒适度结算 ===
  applyComfortEffects(state);
}

/** 计算并应用舒适度影响 */
function applyComfortEffects(state) {
  if (!state.status) return;

  let comfort = 50; // 基础舒适度

  // 住所加成
  const housingBonus = [0, 10, 20, 35][state.housing?.tier || 0];
  comfort += housingBonus;

  // 衣物加成（身体装备位）
  const bodyEquip = state.inventory?.equipment?.body;
  if (bodyEquip && typeof ITEMS !== "undefined") {
    const item = ITEMS.find((i) => i.id === bodyEquip);
    if (item && item.effects) {
      if (item.effects.comfort) comfort += item.effects.comfort;
    }
  }

  // 天气对舒适度的影响
  if (state.weather && state.weather.tempEffect) {
    const tempName = state.weather.tempEffect.name;
    if (tempName === "酷热") comfort -= 20;
    else if (tempName === "炎热") comfort -= 10;
    else if (tempName === "温暖") comfort += 10;
    else if (tempName === "凉爽") comfort += 5;
    else if (tempName === "寒冷") comfort -= 10;
    else if (tempName === "严寒") comfort -= 20;
    else if (tempName === "极寒") comfort -= 30;
  }

  // 卫生影响舒适度
  if (state.needs?.hygiene < 30) comfort -= 15;
  else if (state.needs?.hygiene < 60) comfort -= 5;

  // 限制范围
  comfort = Math.max(0, Math.min(100, comfort));
  state.status.comfort = comfort;

  // 舒适度对心情的影响
  if (comfort < 20) {
    state.needs.happiness = Math.max(0, state.needs.happiness - 5);
  } else if (comfort < 40) {
    state.needs.happiness = Math.max(0, state.needs.happiness - 2);
  } else if (comfort > 80) {
    state.needs.happiness = Math.min(100, state.needs.happiness + 2);
  }
}

/** 获取衣物对极端天气的防护效果 */
function getClothingWeatherProtection(state) {
  let coldProtection = 0; // 防寒值
  let heatProtection = 0; // 防暑值

  // 检查所有装备位的衣物
  const equip = state.inventory?.equipment || {};
  for (const [slot, itemId] of Object.entries(equip)) {
    if (!itemId || typeof ITEMS === "undefined") continue;
    const item = ITEMS.find((i) => i.id === itemId);
    if (!item || !item.effects) continue;
    coldProtection += item.effects.coldProtection || 0;
    heatProtection += item.effects.heatProtection || 0;
  }

  return { coldProtection, heatProtection };
}

/** 计算天气+衣物对健康的综合影响（考虑防护后） */
function getNetWeatherHealthImpact(state) {
  if (!state.weather || !state.weather.tempEffect) return 0;

  const tempEffect = state.weather.tempEffect;
  const weatherDef = state.weather.weatherDef;
  const protection = getClothingWeatherProtection(state);

  let healthImpact = (weatherDef?.healthMod || 0) + (tempEffect.healthMod || 0);

  // 防寒效果：寒冷/严寒/极寒时减少健康损失
  if (tempEffect.minTemp < 8) {
    const coldReduction = Math.min(
      protection.coldProtection,
      Math.abs(tempEffect.healthMod),
    );
    healthImpact += coldReduction; // 抵消部分健康损失
  }

  // 防暑效果：酷热/炎热时减少健康损失
  if (tempEffect.minTemp >= 32) {
    const heatReduction = Math.min(
      protection.heatProtection,
      Math.abs(tempEffect.healthMod),
    );
    healthImpact += heatReduction;
  }

  return healthImpact;
}

/** 获取天气描述文本 */
function getWeatherDescription(state) {
  if (!state.weather) return "未知";

  const w = state.weather.weatherDef;
  const t = state.weather.tempEffect;
  const s = SEASONS[state.weather.season];

  let desc = `${s.icon} ${s.name}季 · ${w.icon} ${w.name} · 🌡️ ${state.weather.temperature}°C（${t.name}）`;

  // 天气影响提示
  const effects = [];
  if (w.apMod > 0) effects.push(`出行+${w.apMod}AP`);
  if (w.priceMod !== 1.0)
    effects.push(w.priceMod < 1 ? "物价下降" : "物价上涨");
  if (w.moodMod < -3) effects.push("心情变差");
  if (w.transportRisk > 1.1) effects.push("运输风险增加");
  if (!w.visible) effects.push("⚠️不宜出行");

  // 客流量提示
  const trafficMod = getWeatherFootTrafficModifier(state);
  if (trafficMod < 0.8)
    effects.push(`🚶客流量低(${Math.round(trafficMod * 100)}%)`);
  else if (trafficMod > 1.0) effects.push("🚶客流量高");

  if (effects.length > 0) {
    desc += `\n${effects.join(" | ")}`;
  }

  return desc;
}

/** 获取天气对特定商品的价格影响 */
function getWeatherGoodPriceMod(state, goodId) {
  if (!state.weather) return 1.0;

  const baseMod = getWeatherPriceModifier(state);
  let extraMod = 1.0;

  const phys =
    typeof getGoodPhysics === "function" ? getGoodPhysics(goodId) : null;

  // 下雨天：雨具/日常用品需求增加
  if (
    state.weather.weatherId === "heavy_rain" ||
    state.weather.weatherId === "thunderstorm" ||
    state.weather.weatherId === "typhoon"
  ) {
    if (goodId === "daily_use") extraMod = 1.15; // 日用品需求涨
    if (goodId === "cigarettes") extraMod = 1.1; // 烟也需求涨（无聊待家里）
  }

  // 热浪：水和饮料需求增加
  if (state.weather.weatherId === "heatwave") {
    if (goodId === "water" || goodId === "beer") extraMod = 1.2;
    if (goodId === "fruits") extraMod = 1.1;
  }

  // 寒潮：保暖品需求增加
  if (
    state.weather.weatherId === "cold_snap" ||
    state.weather.weatherId === "blizzard"
  ) {
    if (goodId === "clothing") extraMod = 1.2;
    if (goodId === "instant_noodles") extraMod = 1.15;
  }

  // 暴雪：所有商品运输困难，价格普涨
  if (state.weather.weatherId === "blizzard") {
    extraMod *= 1.1;
  }

  // 沙尘暴：易损商品（电子产品）风险
  if (state.weather.weatherId === "sandstorm") {
    if (goodId === "electronics") extraMod = 0.9; // 电子产品可能进沙
  }

  return Math.round(baseMod * extraMod * 100) / 100;
}
