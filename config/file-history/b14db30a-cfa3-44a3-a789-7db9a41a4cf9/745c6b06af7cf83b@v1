/**
 * 随机新闻事件 — 影响价格、工作收入、玩家状态
 */

const NEWS_EVENTS = [
  // === 价格影响事件 ===
  {
    id: "metal_boom",
    headline: "📈 国际金属价格暴涨！废品回收利润翻倍！",
    effects: {
      priceMod: { scrap_metal: 2.0, scrap_plastic: 1.5 },
      duration: 5,
    },
    type: "price",
  },
  {
    id: "heatwave",
    headline: "☀️ 高温来袭！瓶装水和饮料需求暴增",
    effects: { priceMod: { water: 1.8, beer: 1.5, snacks: 1.3 }, duration: 3 },
    type: "price",
  },
  {
    id: "crackdown",
    headline: "🚔 城管严查摆摊！商业区摆摊收入减半",
    effects: {
      jobPenalty: ["street_vending_food", "street_vending_goods", "food_stall"],
      jobMultiplier: 0.5,
      duration: 4,
    },
    type: "job",
  },
  {
    id: "factory_boom",
    headline: "🏭 电子厂订单暴增！工厂加班工资翻倍",
    effects: {
      jobBonus: ["factory_work_assembly", "factory_overtime"],
      jobMultiplier: 1.6,
      duration: 5,
    },
    type: "job",
  },
  {
    id: "fruit_glut",
    headline: "🍎 水果大丰收！批发市场价格暴跌",
    effects: { priceMod: { fruits: 0.4, vegetables: 0.5 }, duration: 4 },
    type: "price",
  },
  {
    id: "construction_boom",
    headline: "🏗️ 新楼盘开工！工地大量招人，工资上涨",
    effects: {
      jobBonus: ["manual_labor_construction", "skilled_labor_construction"],
      jobMultiplier: 1.5,
      duration: 6,
    },
    type: "job",
  },
  {
    id: "cigarette_ban",
    headline: "🚭 公共场所禁烟令升级！香烟滞销",
    effects: { priceMod: { cigarettes: 0.3, beer: 0.7 }, duration: 5 },
    type: "price",
  },
  {
    id: "back_to_school",
    headline: "🎒 开学季！大学城快递和家教需求暴涨",
    effects: {
      jobBonus: ["package_delivery", "tutoring"],
      jobMultiplier: 1.8,
      duration: 7,
    },
    type: "job",
  },
  {
    id: "cold_wave",
    headline: "🥶 寒潮来袭！二手衣物和日用品涨价",
    effects: { priceMod: { clothing: 2.5, daily_use: 1.8 }, duration: 4 },
    type: "price",
  },
  {
    id: "tech_fair",
    headline: "📱 科技展会举办！小电子产品价格飙升",
    effects: { priceMod: { electronics: 2.5 }, duration: 3 },
    type: "price",
  },

  // === 玩家个人事件 ===
  {
    id: "found_money",
    headline: "🍀 在路边捡到了50块钱！运气不错",
    effects: { cashBonus: 50 },
    type: "personal",
  },
  {
    id: "pickpocket",
    headline: "👛 在公交车上被偷了100块...注意保管财物",
    effects: { cashLoss: 100 },
    type: "personal",
  },
  {
    id: "free_meal",
    headline: "🍱 社区有免费午餐活动，吃了顿饱的",
    effects: { hungerBonus: 30, cashLoss: 0 },
    type: "personal",
  },
  {
    id: "rain_storm",
    headline: "🌧️ 暴雨倾盆！今天不适合户外工作",
    effects: { fatiguePenalty: 15 },
    type: "personal",
  },
  {
    id: "good_sleep",
    headline: "😴 昨晚睡得特别好，今天精神焕发",
    effects: { fatigueBonus: 20, happinessBonus: 10 },
    type: "personal",
  },
  {
    id: "friendly_neighbor",
    headline: "👋 邻居送了些水果，心情不错",
    effects: { happinessBonus: 15 },
    type: "personal",
  },
  {
    id: "skill_book",
    headline: "📖 在二手书店淘到一本有用的教材",
    effects: { skillXp: 30 },
    type: "personal",
  },

  // === 政策事件 ===
  {
    id: "subsidy",
    headline: "🏛️ 政府推出职业技能培训补贴！培训费用减半",
    effects: { trainingDiscount: 0.5, duration: 8 },
    type: "policy",
  },
  {
    id: "min_wage",
    headline: "📋 最低工资标准上调！所有工作收入+20%",
    effects: { allJobsBonus: 1.2, duration: 10 },
    type: "policy",
  },
];

/** 获取随机新闻事件 */
function getRandomNewsEvent() {
  // 按类型加权：价格40%，工作25%，个人20%，政策15%
  const weights = { price: 40, job: 25, personal: 20, policy: 15 };
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;

  for (const [type, weight] of Object.entries(weights)) {
    roll -= weight;
    if (roll <= 0) {
      const typeEvents = NEWS_EVENTS.filter((e) => e.type === type);
      return typeEvents[Math.floor(Math.random() * typeEvents.length)];
    }
  }
  return NEWS_EVENTS[Math.floor(Math.random() * NEWS_EVENTS.length)];
}

/** 应用新闻效果 */
function applyNewsEffect(news, state) {
  const effects = news.effects;

  // 价格修正
  if (effects.priceMod) {
    for (const [goodId, multiplier] of Object.entries(effects.priceMod)) {
      for (const locKey of Object.keys(LOCATIONS)) {
        const prices = state.trade.goodsPrices[locKey];
        if (prices && prices[goodId]) {
          prices[goodId] = Math.round(prices[goodId] * multiplier * 100) / 100;
        }
      }
    }
  }

  // 工作奖励/惩罚
  if (effects.jobBonus) {
    for (const jobId of effects.jobBonus) {
      state._jobMultipliers = state._jobMultipliers || {};
      state._jobMultipliers[jobId] =
        (state._jobMultipliers[jobId] || 1) * effects.jobMultiplier;
    }
  }
  if (effects.jobPenalty) {
    for (const jobId of effects.jobPenalty) {
      state._jobMultipliers = state._jobMultipliers || {};
      state._jobMultipliers[jobId] =
        (state._jobMultipliers[jobId] || 1) * effects.jobMultiplier;
    }
  }
  if (effects.allJobsBonus) {
    state._allJobsBonus = (state._allJobsBonus || 1) * effects.allJobsBonus;
  }

  // 现金
  if (effects.cashBonus) {
    state.resources.cash += effects.cashBonus;
    state.resources.totalEarned += effects.cashBonus;
  }
  if (effects.cashLoss) {
    state.resources.cash = Math.max(0, state.resources.cash - effects.cashLoss);
  }

  // 需求
  if (effects.hungerBonus)
    state.needs.hunger = Math.min(
      100,
      state.needs.hunger + effects.hungerBonus,
    );
  if (effects.fatigueBonus)
    state.needs.fatigue = Math.max(
      0,
      state.needs.fatigue - effects.fatigueBonus,
    );
  if (effects.fatiguePenalty)
    state.needs.fatigue = Math.min(
      100,
      state.needs.fatigue + effects.fatiguePenalty,
    );
  if (effects.happinessBonus)
    state.needs.happiness = Math.min(
      100,
      state.needs.happiness + effects.happinessBonus,
    );

  // 技能经验
  if (effects.skillXp) {
    const skillKeys = Object.keys(state.skills);
    const key = skillKeys[Math.floor(Math.random() * skillKeys.length)];
    state.skills[key].xp += effects.skillXp;
  }

  return effects;
}

/** 清除过期新闻效果 */
function cleanupExpiredNews(state) {
  state.activeNews = (state.activeNews || []).filter((news) => {
    if (news._appliedDay === undefined) news._appliedDay = state.player.day;
    return state.player.day - news._appliedDay < (news.effects.duration || 5);
  });

  // 恢复工作倍率
  if (state.activeNews.length === 0) {
    state._jobMultipliers = {};
    state._allJobsBonus = 1;
  }
}
