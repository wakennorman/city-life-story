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
];

const SEASONS = [
  {
    id: "spring",
    name: "春天",
    icon: "🌸",
    tempRange: [15, 28],
    weatherWeights: {
      sunny: 0.3,
      cloudy: 0.3,
      rainy: 0.2,
      windy: 0.15,
      foggy: 0.05,
    },
  },
  {
    id: "summer",
    name: "夏天",
    icon: "☀️",
    tempRange: [25, 38],
    weatherWeights: {
      sunny: 0.4,
      cloudy: 0.2,
      rainy: 0.15,
      stormy: 0.15,
      foggy: 0.1,
    },
  },
  {
    id: "autumn",
    name: "秋天",
    icon: "🍂",
    tempRange: [12, 25],
    weatherWeights: {
      sunny: 0.25,
      cloudy: 0.3,
      rainy: 0.2,
      windy: 0.2,
      foggy: 0.05,
    },
  },
  {
    id: "winter",
    name: "冬天",
    icon: "❄️",
    tempRange: [-5, 10],
    weatherWeights: {
      sunny: 0.2,
      cloudy: 0.25,
      snowy: 0.25,
      windy: 0.2,
      rainy: 0.1,
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

/** 每日天气判定 */
function rollWeather(state) {
  if (!state.weather) {
    state.weather = {
      current: "sunny",
      temperature: 22,
      season: "spring",
      lastChanged: 0,
    };
  }

  const season = getSeason(state.player.day);
  state.weather.season = season.id;

  // 25%概率天气变化
  if (Random.chance(0.25) || !state.weather.current) {
    const weights = season.weatherWeights;
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let roll = Random.float(0, total);
    let newWeather = "sunny";
    for (const [wid, wgt] of Object.entries(weights)) {
      roll -= wgt;
      if (roll <= 0) {
        newWeather = wid;
        break;
      }
    }
    state.weather.current = newWeather;
    state.weather.lastChanged = state.player.day;
  }

  // 温度 = 季节基础范围中值 + 天气偏移 + 随机噪声
  const [tMin, tMax] = season.tempRange;
  const weatherDef = WEATHER_TYPES.find((w) => w.id === state.weather.current);
  const tempBase = (tMin + tMax) / 2;
  const weatherOffset = weatherDef ? (weatherDef.outdoorMod - 1) * 10 : 0;
  const noise = Random.float(-3, 3);
  state.weather.temperature = Math.round(
    Math.max(-15, Math.min(45, tempBase + weatherOffset + noise)),
  );
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
