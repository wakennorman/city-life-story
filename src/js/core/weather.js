/**
 * 天气系统 — 季节/天气/温度模拟
 *
 * 每天有概率变化天气，影响户外工作收入/疲劳/心情等
 */

const WEATHER_TYPES = [
  {
    id: "sunny",
    name: "晴天",
    icon: "☀️",
    outdoorMod: 1.0,
    fatigueBonus: 0,
    happinessBonus: 5,
  },
  {
    id: "cloudy",
    name: "多云",
    icon: "⛅",
    outdoorMod: 0.95,
    fatigueBonus: 0,
    happinessBonus: 2,
  },
  {
    id: "rainy",
    name: "小雨",
    icon: "🌧️",
    outdoorMod: 0.75,
    fatigueBonus: 8,
    happinessBonus: -5,
  },
  {
    id: "stormy",
    name: "暴雨",
    icon: "⛈️",
    outdoorMod: 0.4,
    fatigueBonus: 15,
    happinessBonus: -10,
  },
  {
    id: "windy",
    name: "大风",
    icon: "🌬️",
    outdoorMod: 0.8,
    fatigueBonus: 5,
    happinessBonus: -3,
  },
  {
    id: "snowy",
    name: "下雪",
    icon: "❄️",
    outdoorMod: 0.3,
    fatigueBonus: 10,
    happinessBonus: 0,
  },
  {
    id: "foggy",
    name: "雾霾",
    icon: "🌫️",
    outdoorMod: 0.85,
    fatigueBonus: 3,
    happinessBonus: -5,
  },

  // ============================================================
  // 极端天气 — 正式实现（v2.1 Batch 6，参考真实中国气象数据）
  // ============================================================
  {
    id: "heatwave",
    name: "高温预警",
    icon: "🥵",
    outdoorMod: 0.6,
    fatigueBonus: 10,
    happinessBonus: -8,
    healthMod: -2,
    desc: "室外工作疲劳+10，卫生-5，水价格×1.5",
    effects: {
      outdoorFatigueBonus: 10,
      hygieneMod: -5,
      priceMod: { water: 1.5, beer: 1.3 },
      illnessRisk: { heatStroke: 0.05 },
    },
  },
  {
    id: "cold_snap",
    name: "寒潮",
    icon: "🥶",
    outdoorMod: 0.5,
    fatigueBonus: 8,
    happinessBonus: -5,
    healthMod: -3,
    desc: "室外工作疲劳+8，健康-3，衣物价格×1.3",
    effects: {
      outdoorFatigueBonus: 8,
      healthMod: -3,
      priceMod: { clothing: 1.3, warm_coat: 1.2 },
      illnessRisk: { coldFlu: 0.08 },
    },
  },
  {
    id: "heavy_smog",
    name: "重度雾霾",
    icon: "😷",
    outdoorMod: 0.5,
    fatigueBonus: 5,
    happinessBonus: -8,
    healthMod: -2,
    respiratoryDiseaseBonus: 0.15,
    desc: "所有工作健康-2，呼吸系统疾病概率+15%",
    effects: {
      healthMod: -2,
      illnessRisk: { respiratoryDisease: 0.15 },
      outdoorMod: 0.5,
      maskRequired: true,
    },
  },
  {
    id: "typhoon",
    name: "台风",
    icon: "🌀",
    outdoorMod: 0,
    fatigueBonus: 20,
    happinessBonus: -15,
    healthMod: -2,
    outdoorJobsBlocked: true,
    indoorJobIncomeMod: 0.8,
    desc: "所有室外工作不可用，室内工作收入-20%",
    effects: {
      outdoorJobsBlocked: true,
      indoorJobIncomeMod: 0.8,
      footTrafficMod: 0.1,
      duration: { min: 1, max: 2 },
    },
  },
  {
    id: "sandstorm",
    name: "沙尘暴",
    icon: "🌪️",
    outdoorMod: 0.4,
    fatigueBonus: 12,
    happinessBonus: -10,
    healthMod: -3,
    desc: "室外工作疲劳+12，健康-3，呼吸系统疾病概率+20%",
    effects: {
      outdoorFatigueBonus: 12,
      healthMod: -3,
      illnessRisk: { respiratoryDisease: 0.2 },
      hygieneMod: -10,
    },
  },
  {
    id: "plum_rain",
    name: "梅雨季",
    icon: "🌧️",
    outdoorMod: 0.6,
    fatigueBonus: 8,
    happinessBonus: -6,
    healthMod: -1,
    desc: "连续阴雨，室外工作疲劳+8，心情-6，食物易发霉",
    effects: {
      outdoorFatigueBonus: 8,
      happinessBonus: -6,
      foodPerishRate: 1.5,
      humidity: 90,
    },
  },
];

/**
 * 极端天气持续天数配置（天气深化系统 v2）
 * key = weather id, value = [min, max] 持续天数
 */
const EXTREME_WEATHER_DURATION = {
  heatwave: [3, 5],
  cold_snap: [2, 3],
  heavy_smog: [2, 3],
  typhoon: [1, 2],
  sandstorm: [1, 2],
  plum_rain: [3, 5],
};

/** 该天气是否为极端天气（需要持续期） */
function isExtremeWeather(weatherId) {
  return !!EXTREME_WEATHER_DURATION[weatherId];
}

/** 该天气是否为降水类（影响客流量更大） */
function isPrecipitationWeather(weatherId) {
  return ["rainy", "stormy", "snowy", "plum_rain"].includes(weatherId);
}

const SEASONS = [
  {
    id: "spring",
    name: "春天",
    icon: "🌸",
    tempRange: [15, 28],
    weatherWeights: {
      sunny: 0.25,
      cloudy: 0.25,
      rainy: 0.15,
      windy: 0.12,
      foggy: 0.05,
      heavy_smog: 0.05,
      sandstorm: 0.08,
      plum_rain: 0.05,
    },
  },
  {
    id: "summer",
    name: "夏天",
    icon: "☀️",
    tempRange: [25, 38],
    weatherWeights: {
      sunny: 0.3,
      cloudy: 0.15,
      rainy: 0.12,
      stormy: 0.12,
      heatwave: 0.12,
      foggy: 0.06,
      heavy_smog: 0.05,
      typhoon: 0.05,
      plum_rain: 0.03,
    },
  },
  {
    id: "autumn",
    name: "秋天",
    icon: "🍂",
    tempRange: [12, 25],
    weatherWeights: {
      sunny: 0.22,
      cloudy: 0.25,
      rainy: 0.15,
      windy: 0.15,
      foggy: 0.05,
      heavy_smog: 0.08,
      sandstorm: 0.05,
      plum_rain: 0.05,
    },
  },
  {
    id: "winter",
    name: "冬天",
    icon: "❄️",
    tempRange: [-5, 10],
    weatherWeights: {
      sunny: 0.18,
      cloudy: 0.22,
      snowy: 0.22,
      windy: 0.15,
      rainy: 0.05,
      foggy: 0.05,
      heavy_smog: 0.08,
      cold_snap: 0.05,
    },
  },
];

/** 根据日期获取当前季节 */
function getSeason(day) {
  // 一年365天，每月约30天
  const month = Math.floor((day % 365) / 30) + 1;
  if (month >= 3 && month <= 5) return SEASONS[0]; // 春
  if (month >= 6 && month <= 8) return SEASONS[1]; // 夏
  if (month >= 9 && month <= 11) return SEASONS[2]; // 秋
  return SEASONS[3]; // 冬
}

/** 每日天气判定（增强版：持续期+预报） */
function rollWeather(state) {
  if (!state.weather) {
    state.weather = {
      current: "sunny",
      temperature: 22,
      season: "spring",
      lastChanged: 0,
      forecast: [],
      duration: 1,
      daysActive: 0,
      persistent: false,
    };
  }

  var w = state.weather;
  var season = getSeason(state.player.day);
  w.season = season.id;

  // 持续期模式：天气尚未结束，递增天数，不重新roll
  if (w.persistent && w.duration && w.daysActive < w.duration) {
    w.daysActive++;
    // 梅雨季特殊持续效果
    if (w.current === "plum_rain") {
      state.needs.fatigue = Math.max(0, Math.min(100, state.needs.fatigue + 2));
      state.needs.happiness = Math.max(
        0,
        Math.min(100, state.needs.happiness - 1),
      );
    }
    // 更新温度（极端天气温度每天微浮动）
    updateWeatherTemperature(state, season);
    // 更新预报（每天推移一天）
    generateWeatherForecast(state, season);
    return;
  }

  // 非持续期（或持续期已结束）：正常25%概率变化
  var shouldChange =
    Random.chance(0.25) || !w.current || w.daysActive >= w.duration;
  if (!shouldChange) {
    w.daysActive = (w.daysActive || 0) + 1;
    updateWeatherTemperature(state, season);
    generateWeatherForecast(state, season);
    return;
  }

  // === 天气变化：从季节权重中roll新天气 ===
  var weights = season.weatherWeights;
  var total = Object.values(weights).reduce(function (a, b) {
    return a + b;
  }, 0);
  var roll = Random.float(0, total);
  var newWeather = "sunny";
  for (var wid in weights) {
    if (!weights.hasOwnProperty(wid)) continue;
    roll -= weights[wid];
    if (roll <= 0) {
      newWeather = wid;
      break;
    }
  }

  // 应用新天气
  w.current = newWeather;
  w.lastChanged = state.player.day;

  // 极端天气 → 进入持续期
  if (isExtremeWeather(newWeather)) {
    var durRange = EXTREME_WEATHER_DURATION[newWeather];
    w.duration = Random.int(durRange[0], durRange[1]);
    w.daysActive = 1;
    w.persistent = true;
  } else {
    w.duration = 1;
    w.daysActive = 1;
    w.persistent = false;
  }

  // 更新温度
  updateWeatherTemperature(state, season);

  // 生成未来3天预报
  generateWeatherForecast(state, season);
}

/** 更新天气温度（抽取自 rollWeather，供持续期调用） */
function updateWeatherTemperature(state, season) {
  var w = state.weather;
  var [tMin, tMax] = season.tempRange;
  var weatherDef = WEATHER_TYPES.find(function (wt) {
    return wt.id === w.current;
  });
  var tempBase = (tMin + tMax) / 2;
  var weatherOffset = weatherDef ? (weatherDef.outdoorMod - 1) * 10 : 0;
  var noise = Random.float(-3, 3);
  w.temperature = Math.round(
    Math.max(-15, Math.min(45, tempBase + weatherOffset + noise)),
  );
  // [全系统自洽修复] 域G A类#1: 温度极端值防御（NaN/Infinity→回退22°C）
  if (!isFinite(w.temperature) || isNaN(w.temperature)) w.temperature = 22;
}

/**
 * 生成未来3天天气预报（在 rollWeather 中调用）
 * @param {Object} state - 游戏状态
 * @param {Object} season - 当前季节对象
 */
function generateWeatherForecast(state, season) {
  var w = state.weather;
  var forecast = [];
  var dayOffset = state.player.day + 1;

  // 预测未来3天
  for (var i = 0; i < 3; i++) {
    var confidence = i === 0 ? 0.85 : i === 1 ? 0.65 : 0.45;

    // 如果当前是持续期，预报偏向持续
    var extendsCurrent = w.persistent && Random.chance(0.6 - i * 0.15);

    var fWeather;
    if (extendsCurrent) {
      fWeather = w.current;
    } else {
      // 从季节权重roll
      var weights = season.weatherWeights;
      var total = Object.values(weights).reduce(function (a, b) {
        return a + b;
      }, 0);
      var r = Random.float(0, total);
      fWeather = "sunny";
      for (var wid in weights) {
        if (!weights.hasOwnProperty(wid)) continue;
        r -= weights[wid];
        if (r <= 0) {
          fWeather = wid;
          break;
        }
      }
    }

    forecast.push({
      day: dayOffset + i,
      weatherId: fWeather,
      confidence: confidence,
    });
  }

  w.forecast = forecast;
}

/** 获取天气对户外工作的修正系数 */
function getWeatherWorkMod(state) {
  if (!state.weather) return 1.0;
  const w = WEATHER_TYPES.find((w) => w.id === state.weather.current);
  return w ? w.outdoorMod : 1.0;
}

/** 获取天气额外疲劳 */
function getWeatherFatigue(state) {
  if (!state.weather) return 0;
  const w = WEATHER_TYPES.find((w) => w.id === state.weather.current);
  return w ? w.fatigueBonus : 0;
}

/** 获取天气心情修正 */
function getWeatherHappiness(state) {
  if (!state.weather) return 0;
  const w = WEATHER_TYPES.find((w) => w.id === state.weather.current);
  return w ? w.happinessBonus : 0;
}

/**
 * 获取天气对客流量的影响系数（仅摆摊类工作）
 * 0.0 ~ 1.0，1.0 = 正常客流量
 */
/**
 * 获取天气对客流量的影响系数（仅摆摊类工作）
 * 0.0 ~ 1.0，1.0 = 正常客流量
 * @param {Object} state - 游戏状态
 * @param {string} [locKey] - 可选，地点ID，叠加地点特定天气修正
 */
function getWeatherFootTrafficMod(state, locKey) {
  if (!state.weather) return 1.0;
  const traffic = {
    sunny: 1.0,
    cloudy: 0.9,
    rainy: 0.55,
    stormy: 0.2,
    windy: 0.7,
    snowy: 0.25,
    foggy: 0.5,
    heatwave: 0.4,
    cold_snap: 0.3,
    heavy_smog: 0.35,
    typhoon: 0.05,
    sandstorm: 0.2,
    plum_rain: 0.45,
  };
  var base = traffic[state.weather.current] || 1.0;

  // 地点特定天气修正
  if (locKey) {
    var locMod = getWeatherModForLocation(locKey, state);
    if (locMod.footfallMod !== 1.0) {
      base = base * locMod.footfallMod;
    }
  }

  // 时段修正：下午人流多，晚上少
  if (state.player && state.player.timeSlot === "afternoon")
    return Math.min(1.0, base + 0.1);
  if (state.player && state.player.timeSlot === "evening")
    return Math.max(0.05, base - 0.05);
  return base;
}

/**
 * 获取天气下特定商品的需求加成
 * 坏天气下某些商品反而好卖，返回 > 1.0 表示有额外需求
 */
function getWeatherDemandBonus(weatherId, goodId) {
  const demandMap = {
    rainy: { daily_use: 1.4, cigarettes: 1.1, instant_noodles: 1.1 },
    stormy: { daily_use: 1.6, cigarettes: 1.15, instant_noodles: 1.15 },
    windy: { clothing: 1.1 },
    snowy: { clothing: 1.4, instant_noodles: 1.2, cigarettes: 1.1 },
    foggy: { daily_use: 1.1, cigarettes: 1.1 },
    heatwave: { water: 1.8, beer: 1.5, ice_cream: 1.6 },
    cold_snap: { clothing: 1.5, instant_noodles: 1.3, beer: 1.2 },
    heavy_smog: { daily_use: 1.2, masks: 2.0, cigarettes: 1.1 },
    typhoon: { instant_noodles: 1.5, water: 1.4, canned_food: 1.3 },
    sandstorm: { masks: 2.0, daily_use: 1.2, water: 1.3 },
    plum_rain: { instant_noodles: 1.2, daily_use: 1.1, rice: 1.1 },
  };
  return demandMap[weatherId]?.[goodId] || 1.0;
}

// ===================================================================
// 以下为 v1.5 增强：温度体感 / 舒适度 / 衣物防护 / 每日效果
// ===================================================================

const TEMP_EFFECTS = [
  {
    name: "酷热",
    minTemp: 38,
    maxTemp: 99,
    fatigueMod: 5,
    healthMod: -3,
    moodMod: -8,
    desc: "中暑风险极高",
  },
  {
    name: "炎热",
    minTemp: 32,
    maxTemp: 38,
    fatigueMod: 3,
    healthMod: -1,
    moodMod: -4,
    desc: "汗如雨下",
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
    desc: "微凉",
  },
  {
    name: "寒冷",
    minTemp: 0,
    maxTemp: 8,
    fatigueMod: 2,
    healthMod: -1,
    moodMod: -3,
    desc: "冻手冻脚",
  },
  {
    name: "严寒",
    minTemp: -8,
    maxTemp: 0,
    fatigueMod: 4,
    healthMod: -2,
    moodMod: -6,
    desc: "刺骨寒冷",
  },
  {
    name: "极寒",
    minTemp: -99,
    maxTemp: -8,
    fatigueMod: 6,
    healthMod: -4,
    moodMod: -10,
    desc: "随时冻伤",
  },
];

/** 获取温度体感效果 */
function getTempEffect(temperature) {
  for (var i = 0; i < TEMP_EFFECTS.length; i++) {
    if (
      temperature >= TEMP_EFFECTS[i].minTemp &&
      temperature < TEMP_EFFECTS[i].maxTemp
    )
      return TEMP_EFFECTS[i];
  }
  return TEMP_EFFECTS[3]; // 默认凉爽
}

/** 获取衣物对极端天气的防护效果（从装备 items 读取 coldProtection/heatProtection） */
function getClothingWeatherProtection(state) {
  var cold = 0,
    heat = 0;
  var equip =
    state.inventory && state.inventory.equipment
      ? state.inventory.equipment
      : {};
  for (var slot in equip) {
    if (!equip.hasOwnProperty(slot)) continue;
    var itemId = equip[slot];
    if (!itemId || typeof ITEMS === "undefined") continue;
    var item = ITEMS.find(function (i) {
      return i.id === itemId;
    });
    if (item && item.effects) {
      cold += item.effects.coldProtection || 0;
      heat += item.effects.heatProtection || 0;
    }
  }
  return { coldProtection: cold, heatProtection: heat };
}

/** 计算天气+衣物的综合健康影响 */
function getNetWeatherHealthImpact(state) {
  if (!state.weather || !state.weather.current) return 0;
  var wDef = WEATHER_TYPES.find(function (w) {
    return w.id === state.weather.current;
  });
  var protection = getClothingWeatherProtection(state);
  var tempEffect = getTempEffect(state.weather.temperature || 22);
  var base = tempEffect.healthMod;
  // 防寒
  if (tempEffect.minTemp < 8)
    base += Math.min(protection.coldProtection, Math.abs(tempEffect.healthMod));
  // 防暑
  if (tempEffect.minTemp >= 32)
    base += Math.min(protection.heatProtection, Math.abs(tempEffect.healthMod));
  return base;
}

/** 每日结算天气对属性影响（在 daily_pipeline 中调用） */
function applyWeatherDailyEffects(state) {
  if (!state.weather) return;
  var wDef =
    WEATHER_TYPES.find(function (w) {
      return w.id === state.weather.current;
    }) || WEATHER_TYPES[0];
  var tempEffect = getTempEffect(
    state.weather.temperature != null ? state.weather.temperature : 22,
  );

  // [全系统自洽修复] 域G A类修复: 防止 NaN 传播 — 用 (x || 0) 替代裸 x 以免 NaN 永久固化
  state.needs.happiness = Math.max(
    0,
    Math.min(
      100,
      (state.needs.happiness || 0) +
        (wDef.happinessBonus || 0) +
        (tempEffect.moodMod || 0),
    ),
  );
  // 天气对疲劳
  state.needs.fatigue = Math.max(
    0,
    Math.min(
      100,
      (state.needs.fatigue || 0) +
        (wDef.fatigueBonus || 0) +
        (tempEffect.fatigueMod || 0),
    ),
  );
  // 天气对健康 — [全系统自洽修复] 域G 联动增强: 接入 getNetWeatherHealthImpact 使防寒/防暑装备生效
  if (state.status && state.status.health !== undefined) {
    var netHealthImpact = getNetWeatherHealthImpact(state);
    state.status.health = Math.max(
      0,
      Math.min(100, state.status.health + netHealthImpact),
    );
  }

  // 极端天气特殊效果
  var wId = state.weather.current;
  var prevWeather = state.weather._previousWeather;
  state.weather._previousWeather = wId; // 记录当前天气供下次对比

  // [全系统自洽修复] 域G 联动增强: 极端天气结束时触发叙事消息（G→B 叙事层增强）
  if (prevWeather && isExtremeWeather(prevWeather) && !isExtremeWeather(wId)) {
    var reliefMsgs = {
      heatwave: "🥵 高温预警终于解除了！你深吸一口凉下来的空气，感觉整个人都活过来了。",
      cold_snap: "🥶 寒潮过去了，阳光重新照在身上，暖洋洋的。",
      heavy_smog: "😷 雾霾散了！天空终于露出了蓝色，你忍不住多看了几眼。",
      typhoon: "🌀 台风过境，城市一片狼藉，但天空放晴了——你长舒一口气。",
      sandstorm: "🌪️ 沙尘暴终于停了，空气里弥漫着泥土的气息，但至少能看清前路了。",
      plum_rain: "🌧️ 梅雨季结束了，阳光穿过云层，被子终于可以晒干了。",
    };
    var msg = reliefMsgs[prevWeather];
    if (msg) {
      StateManager.addMessage(msg, "event");
    }
  }
  if (wId === "heatwave" && Random.chance(0.2))
    StateManager.addMessage("🥵 高温预警！注意防暑，多喝水！", "warning");
  if (wId === "cold_snap" && Random.chance(0.2))
    StateManager.addMessage("🥶 寒潮来袭！注意保暖，避免感冒！", "warning");
  if (wId === "heavy_smog" && Random.chance(0.25))
    StateManager.addMessage(
      "😷 重度雾霾！建议佩戴口罩，减少户外活动！",
      "danger",
    );
  if (wId === "typhoon" && Random.chance(0.3))
    StateManager.addMessage(
      "🌀 台风登陆！所有室外工作暂停，注意安全！",
      "danger",
    );
  if (wId === "sandstorm" && Random.chance(0.25))
    StateManager.addMessage("🌪️ 沙尘暴！注意防护，避免呼吸道疾病！", "danger");
  if (wId === "plum_rain" && Random.chance(0.15))
    StateManager.addMessage("🌧️ 梅雨季来临！注意防潮防霉！", "warning");

  // 舒适度计算
  if (!state.status) state.status = {};
  var comfort = 50 + ((state.housing && state.housing.tier) || 0) * 10;
  if (tempEffect.name === "酷热") comfort -= 20;
  else if (tempEffect.name === "炎热") comfort -= 10;
  else if (tempEffect.name === "温暖") comfort += 10;
  else if (tempEffect.name === "凉爽") comfort += 5;
  else if (tempEffect.name === "寒冷") comfort -= 10;
  else if (tempEffect.name === "严寒") comfort -= 20;
  else if (tempEffect.name === "极寒") comfort -= 30;
  // 极端天气额外影响舒适度
  if (wId === "heatwave") comfort -= 10;
  else if (wId === "cold_snap") comfort -= 10;
  else if (wId === "heavy_smog") comfort -= 15;
  else if (wId === "typhoon") comfort -= 20;
  else if (wId === "sandstorm") comfort -= 15;
  else if (wId === "plum_rain") comfort -= 8;
  if (state.needs.hygiene < 30) comfort -= 15;
  else if (state.needs.hygiene < 60) comfort -= 5;
  comfort = Math.max(0, Math.min(100, comfort));
  state.status.comfort = comfort;

  if (comfort < 20)
    state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 5);
  else if (comfort < 40)
    state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 2);
  else if (comfort > 80)
    state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 2);
}

/** 获取天气对特定商品的价格影响（风/雨/雪天某些商品涨价） */
function getWeatherGoodPriceMod(state, goodId, locKey) {
  if (!state.weather) return 1.0;
  var base = 1.0;
  var wId = state.weather.current;

  // 地点特定天气价格修正
  if (locKey) {
    var locMod = getWeatherModForLocation(locKey, state);
    if (locMod.priceMod && locMod.priceMod[goodId]) {
      base = base * locMod.priceMod[goodId];
    }
  }
  if (wId === "rainy" || wId === "stormy") {
    if (goodId === "daily_use") base = 1.15;
    if (goodId === "cigarettes") base = 1.1;
  }
  if (wId === "snowy") {
    if (goodId === "clothing") base = 1.2;
    if (goodId === "instant_noodles") base = 1.15;
  }
  if (wId === "windy") {
    if (goodId === "clothing") base = 1.1;
  }
  // 新增极端天气价格影响
  if (wId === "heatwave") {
    if (goodId === "water") base = 1.5;
    if (goodId === "beer") base = 1.3;
  }
  if (wId === "cold_snap") {
    if (goodId === "clothing") base = 1.3;
    if (goodId === "warm_coat") base = 1.2;
  }
  if (wId === "heavy_smog" || wId === "sandstorm") {
    if (goodId === "masks") base = 2.0;
    if (goodId === "daily_use") base = 1.2;
  }
  if (wId === "typhoon") {
    if (goodId === "instant_noodles") base = 1.5;
    if (goodId === "water") base = 1.4;
  }
  if (wId === "plum_rain") {
    if (goodId === "instant_noodles") base = 1.2;
    if (goodId === "rice") base = 1.1;
  }
  return base;
}

/** 获取天气对运输风险的修正（>1 = 风险增加） */
function getWeatherTransportRiskMod(state) {
  if (!state.weather) return 1.0;
  var riskMap = {
    rainy: 1.05,
    stormy: 1.15,
    windy: 1.1,
    snowy: 1.3,
    foggy: 1.1,
    heatwave: 1.1,
    cold_snap: 1.15,
    heavy_smog: 1.2,
    typhoon: 1.5,
    sandstorm: 1.3,
    plum_rain: 1.1,
  };
  return riskMap[state.weather.current] || 1.0;
}

/**
 * 获取天气对旅行 AP 消耗的倍率（天气深化系统）
 * 大雾/暴雨/台风/暴雪 等降低能见度的天气增加出行成本
 */
function getWeatherTravelApMod(state) {
  if (!state.weather) return 1.0;
  var apModMap = {
    rainy: 1.0,
    stormy: 1.25,
    windy: 1.05,
    snowy: 1.5,
    foggy: 1.3,
    heavy_smog: 1.35,
    typhoon: 2.0,
    sandstorm: 1.5,
    cold_snap: 1.15,
    plum_rain: 1.1,
  };
  return apModMap[state.weather.current] || 1.0;
}

/**
 * 获取天气对特定地点的修正系数（天气深化系统）
 * 读取 LOCATIONS[locKey].weatherEffects 匹配当前天气
 * @returns {{ footfallMod: number, priceMod: Object }}
 */
function getWeatherModForLocation(locKey, state) {
  if (!state.weather || !locKey) return { footfallMod: 1.0, priceMod: {} };
  if (typeof LOCATIONS === "undefined" || !LOCATIONS[locKey])
    return { footfallMod: 1.0, priceMod: {} };
  var effects = LOCATIONS[locKey].weatherEffects;
  if (!effects) return { footfallMod: 1.0, priceMod: {} };
  var wId = state.weather.current;
  // 匹配天气别名
  var matched = effects[wId] || null;
  if (!matched) {
    // 尝试匹配通用类别
    if (isPrecipitationWeather(wId) && effects.rain) matched = effects.rain;
    else if (wId === "snowy" && effects.snow) matched = effects.snow;
  }
  if (!matched) return { footfallMod: 1.0, priceMod: {} };
  return {
    footfallMod: matched.footfallMod != null ? matched.footfallMod : 1.0,
    priceMod: matched.priceMod || {},
  };
}

/**
 * 根据健康/体质修正极端天气发病概率（天气深化系统）
 * @param {number} baseProb - 基础概率（来自 WEATHER_TYPES.effects.illnessRisk）
 * @param {Object} state - 游戏状态
 * @returns {number} 修正后概率
 */
function getWeatherIllnessAdjustedProb(baseProb, state) {
  var health =
    state.status && state.status.health != null ? state.status.health : 100;
  var physique =
    state.player && state.player.physique != null ? state.player.physique : 50;
  // 健康乘数：越健康概率越低
  var healthMul =
    health <= 30 ? 3.0 : health <= 50 ? 2.0 : health <= 70 ? 1.3 : 1.0;
  // 体质乘数：体质越好概率越低
  var physMul =
    physique >= 80 ? 0.3 : physique >= 60 ? 0.6 : physique >= 40 ? 0.9 : 1.2;
  return baseProb * healthMul * physMul;
}

/**
 * 每日天气→疾病风险（天气深化系统）
 * 极端天气触发对应疾病，健康/体质越低概率越大
 */
function applyWeatherIllnessRisk(state) {
  if (!state.weather || !state.weather.current) return;
  var wDef = WEATHER_TYPES.find(function (w) {
    return w.id === state.weather.current;
  });
  if (!wDef || !wDef.effects || !wDef.effects.illnessRisk) return;

  var risks = wDef.effects.illnessRisk;
  for (var illId in risks) {
    if (!risks.hasOwnProperty(illId)) continue;
    var baseProb = risks[illId];
    var adjustedProb = getWeatherIllnessAdjustedProb(baseProb, state);
    if (Random.chance(adjustedProb)) {
      // 触发疾病
      if (typeof triggerIllness === "function") {
        triggerIllness(state, illId, "weather");
        var illName = getIllnessName(illId);
        if (illName) {
          StateManager.addMessage("🌡️ " + illName + "（天气诱发）", "danger");
        }
      }
    }
  }
}

/** 辅助：根据疾病ID获取名称 */
function getIllnessName(illId) {
  if (typeof ILLNESSES !== "undefined" && ILLNESSES[illId]) {
    return ILLNESSES[illId].name || illId;
  }
  return null;
}

/** 天气是否不宜出行 */
function isWeatherTravelBlocked(state) {
  if (!state.weather) return false;
  // 极端天气阻断出行
  const blockedWeathers = [
    "stormy",
    "snowy",
    "typhoon",
    "sandstorm",
    "cold_snap",
    "heatwave",
  ];
  return blockedWeathers.includes(state.weather.current);
}

/** 获取天气详细描述文本 */
function getWeatherEnhancedDesc(state) {
  if (!state.weather) return "未知";
  var wDef =
    WEATHER_TYPES.find(function (w) {
      return w.id === state.weather.current;
    }) || WEATHER_TYPES[0];
  var tempEffect = getTempEffect(
    state.weather.temperature != null ? state.weather.temperature : 22,
  );
  var parts = [
    wDef.icon + " " + wDef.name,
    "🌡️ " +
      (state.weather.temperature != null ? state.weather.temperature : "?") +
      "°C（" +
      tempEffect.name +
      "）",
  ];
  if (wDef.happinessBonus < -3) parts.push("☹️心情差");
  if (wDef.fatigueBonus > 5) parts.push("😰易疲劳");
  if (tempEffect.healthMod < -2) parts.push("⚠️影响健康");
  if (wDef.outdoorMod <= 0.4) parts.push("🚫户外受限");
  if (wDef.id === "typhoon") parts.push("🔒室外停工");
  if (wDef.id === "heavy_smog" || wDef.id === "sandstorm")
    parts.push("😷需防护");
  return parts.join(" · ");
}

/**
 * 初始化天气系统（游戏开始时调用）
 * 随机选择开局季节，并设置合理温度
 */
function initWeather(state) {
  if (!state.weather) {
    state.weather = {};
  }
  var w = state.weather;

  // 随机选择开局季节
  var seasonIndex = Random.int(0, 3);
  var season = SEASONS[seasonIndex];
  w.season = season.id;
  w.current = "sunny"; // 开局默认晴天
  w.lastChanged = state.player.day;
  w.duration = 1;
  w.daysActive = 1;
  w.persistent = false;
  w.forecast = [];

  // 设置合理温度（季节范围内随机）
  var [tMin, tMax] = season.tempRange;
  w.temperature = Random.int(tMin, tMax);

  // 生成初始预报
  generateWeatherForecast(state, season);

  return w;
}
