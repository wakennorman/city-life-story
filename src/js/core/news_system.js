/**
 * 新闻生态系统 — L1~L4 四层新闻分类 + 传导机制
 *
 * L1 国际新闻：地缘冲突、贸易制裁、货币危机、科技封锁、大国商战
 * L2 国内政策：行业整顿、房地产调控、最低工资上调、平台经济监管、碳排放政策
 * L3 城市动态：拆迁公告、地铁开通、产业园招商、城管专项整治、节日消费季
 * L4 街头见闻：邻居纠纷、市场八卦、工友传言、NPC日常动态
 *
 * 传导机制：
 *   L1 → 60%概率触发 L2（2~4日后）
 *   L2 → 50%概率触发 L3（1~3日后）
 *   L3 → 40%概率触发 L4（1~2日后）
 *
 * 集成方式：
 *   在 daily_pipeline 的 "news" 步骤中已调用 rollDailyNews()，
 *   本系统通过 hook 注入传导链检查，不修改现有逻辑。
 */

// ============================================================
//  一、L1-L4 新闻事件（30+个，补充现有 NEWS_EVENTS）
// ============================================================

const NEWS_L1_L4 = [
  // ====== L1 国际新闻 ======
  {
    id: "geopolitical_tension",
    headline: "🌐 地缘冲突升级，全球市场震荡，黄金暴涨！",
    level: "L1",
    type: "price",
    effects: {
      priceMod: { scrap_metal: 1.8, scrap_plastic: 1.3 },
      investmentEffect: [
        { category: "贵金属", mul: 1.25 },
        { symbols: ["CL", "NG"], mul: 1.15 },
        { industry: "金融", mul: 0.85 },
      ],
      duration: 7,
    },
    conduit: { targetLevel: "L2", delayRange: [2, 4], chance: 0.6 },
  },
  {
    id: "trade_sanctions",
    headline: "🚫 大国贸易制裁升级，出口企业面临新壁垒",
    level: "L1",
    type: "investment",
    effects: {
      investmentEffect: [
        { industry: "科技", mul: 0.8 },
        { industry: "新能源", mul: 0.85 },
        { symbols: ["COPPER", "ALUM"], mul: 0.75 },
      ],
      duration: 10,
    },
    conduit: { targetLevel: "L2", delayRange: [3, 5], chance: 0.5 },
  },
  {
    id: "fed_rate_hike",
    headline: "🏦 美联储加息75基点，全球资本回流美元资产",
    level: "L1",
    type: "investment",
    effects: {
      investmentEffect: [
        { symbols: ["BTC"], mul: 0.82 },
        { industry: "科技", mul: 0.88 },
        { category: "贵金属", mul: 0.92 },
      ],
      duration: 8,
    },
    conduit: { targetLevel: "L2", delayRange: [2, 5], chance: 0.55 },
  },
  {
    id: "tech_blockade",
    headline: "🔒 先进芯片出口管制再收紧，国产替代刻不容缓",
    level: "L1",
    type: "policy",
    effects: {
      investmentEffect: [
        { industry: "科技", mul: 0.75 },
        { symbols: ["NVDA", "AMD"], mul: 0.85 },
      ],
      jobBonus: ["chip_fab_worker", "chip_tester"],
      jobMultiplier: 1.3,
      duration: 12,
    },
    conduit: { targetLevel: "L2", delayRange: [2, 4], chance: 0.65 },
  },
  {
    id: "global_recession_fear",
    headline: "📉 IMF下调全球经济增长预期至2.1%，衰退阴影笼罩",
    level: "L1",
    type: "investment",
    effects: {
      investmentEffect: [
        { allStocks: true, mul: 0.88 },
        { symbols: ["CL", "COPPER"], mul: 0.78 },
        { category: "贵金属", mul: 1.12 },
      ],
      allJobsBonus: 0.9,
      duration: 10,
    },
    conduit: { targetLevel: "L2", delayRange: [2, 4], chance: 0.5 },
  },
  {
    id: "rare_earth_dispute",
    headline: "⚔️ 关键矿产出口管制加码，稀土价格单月暴涨60%",
    level: "L1",
    type: "price",
    effects: {
      priceMod: { scrap_metal: 2.2, electronics: 1.5 },
      investmentEffect: [
        { industry: "科技", mul: 0.85 },
        { symbols: ["COPPER", "ALUM"], mul: 1.3 },
      ],
      duration: 9,
    },
    conduit: { targetLevel: "L2", delayRange: [3, 6], chance: 0.45 },
  },

  // ====== L2 国内政策 ======
  {
    id: "real_estate_new_deal",
    headline: "🏠 房地产新政：一线城市二套房首付降至30%",
    level: "L2",
    type: "policy",
    effects: {
      investmentEffect: [
        { industry: "房地产", mul: 1.25 },
        { industry: "金融", mul: 1.1 },
      ],
      duration: 10,
    },
    conduit: { targetLevel: "L3", delayRange: [2, 4], chance: 0.5 },
  },
  {
    id: "carbon_emission_policy",
    headline: "🌱 碳交易市场扩容，钢铁水泥行业配额收紧",
    level: "L2",
    type: "policy",
    effects: {
      priceMod: { scrap_metal: 1.25 },
      jobPenalty: ["construction_worker", "steel_worker"],
      jobMultiplier: 0.9,
      investmentEffect: [
        { industry: "新能源", mul: 1.2 },
        { symbols: ["COPPER"], mul: 1.15 },
      ],
      duration: 8,
    },
    conduit: { targetLevel: "L3", delayRange: [1, 3], chance: 0.45 },
  },
  {
    id: "minimum_wage_policy",
    headline: "📋 多省上调最低工资标准，平均涨幅12%",
    level: "L2",
    type: "job",
    effects: {
      allJobsBonus: 1.12,
      priceMod: { food: 1.05, snacks: 1.05 },
      duration: 15,
    },
    conduit: { targetLevel: "L3", delayRange: [1, 3], chance: 0.4 },
  },
  {
    id: "platform_economy_regulation",
    headline: "⚖️ 平台经济监管新规出台，外卖骑手社保全覆盖",
    level: "L2",
    type: "policy",
    effects: {
      jobBonus: ["delivery_rider", "takeout_rider"],
      jobMultiplier: 1.15,
      investmentEffect: [
        { industry: "科技", mul: 0.92 },
        { symbols: ["BABA", "TCEHY"], mul: 0.88 },
      ],
      duration: 12,
    },
    conduit: { targetLevel: "L3", delayRange: [2, 4], chance: 0.5 },
  },
  {
    id: "tax_reform_small_biz",
    headline: "📄 小微企业税收优惠延期，增值税起征点提至¥15万/月",
    level: "L2",
    type: "policy",
    effects: {
      cashBonus: 2000,
      duration: 20,
    },
    conduit: { targetLevel: "L3", delayRange: [1, 3], chance: 0.35 },
  },
  {
    id: "education_reform_new",
    headline: "📚 职业教育改革：技能证书与学历证书同等效力",
    level: "L2",
    type: "policy",
    effects: {
      skillXp: 15,
      duration: 14,
    },
    conduit: { targetLevel: "L3", delayRange: [2, 4], chance: 0.4 },
  },
  {
    id: "health_insurance_expand",
    headline: "🏥 医保目录扩容，67种新药纳入报销范围",
    level: "L2",
    type: "policy",
    effects: {
      investmentEffect: [{ industry: "医药", mul: 1.12 }],
      duration: 10,
    },
    conduit: { targetLevel: "L3", delayRange: [1, 3], chance: 0.35 },
  },

  // ====== L3 城市动态 ======
  {
    id: "subway_line_opening",
    headline: "🚇 地铁5号线开通，城郊到市中心通勤时间缩短40分钟",
    level: "L3",
    type: "price",
    effects: {
      priceMod: { snacks: 1.15, drinks: 1.1 },
      jobBonus: ["street_vending_food", "street_vending_goods"],
      jobMultiplier: 1.2,
      duration: 6,
    },
    conduit: { targetLevel: "L4", delayRange: [1, 2], chance: 0.4 },
  },
  {
    id: "tech_park_recruitment",
    headline: "🏗️ 高新区产业园招商，入驻企业免租三年",
    level: "L3",
    type: "job",
    effects: {
      jobBonus: ["security_guard", "cleaner", "office_worker"],
      jobMultiplier: 1.15,
      duration: 8,
    },
    conduit: { targetLevel: "L4", delayRange: [1, 2], chance: 0.35 },
  },
  {
    id: "chengguan_special_op",
    headline: "🚨 市容专项整治启动，严查占道经营",
    level: "L3",
    type: "job",
    effects: {
      jobPenalty: ["street_vending_food", "street_vending_goods", "food_stall"],
      jobMultiplier: 0.55,
      duration: 5,
    },
    conduit: { targetLevel: "L4", delayRange: [1, 2], chance: 0.5 },
  },
  {
    id: "night_economy_promotion",
    headline: "🌙 夜经济示范区挂牌，商铺营业时间延长至凌晨2点",
    level: "L3",
    type: "price",
    effects: {
      jobBonus: ["street_vending_food", "bartender"],
      jobMultiplier: 1.25,
      priceMod: { beer: 1.2, snacks: 1.15 },
      duration: 7,
    },
    conduit: { targetLevel: "L4", delayRange: [1, 2], chance: 0.4 },
  },
  {
    id: "old_city_renewal",
    headline: "🏚️ 老城区改造工程启动，部分路段封闭施工三个月",
    level: "L3",
    type: "job",
    effects: {
      jobBonus: ["construction_worker", "demolition_worker"],
      jobMultiplier: 1.3,
      jobPenalty: ["street_vending_food"],

      duration: 10,
    },
    conduit: { targetLevel: "L4", delayRange: [1, 3], chance: 0.4 },
  },
  {
    id: "college_entrance_season",
    headline: "🎓 高考分数线公布，大学城周边旅馆爆满",
    level: "L3",
    type: "price",
    effects: {
      priceMod: { snacks: 1.3, drinks: 1.25 },
      cashBonus: 500,
      duration: 5,
    },
    conduit: { targetLevel: "L4", delayRange: [1, 2], chance: 0.3 },
  },
  {
    id: "wet_market_upgrade",
    headline: "🥬 农贸市场标准化改造，摊位费上涨30%",
    level: "L3",
    type: "price",
    effects: {
      priceMod: { food: 1.15, vegetables: 1.2 },
      jobPenalty: ["street_vending_goods"],
      jobMultiplier: 0.85,
      duration: 6,
    },
    conduit: { targetLevel: "L4", delayRange: [1, 2], chance: 0.35 },
  },

  // ====== L4 街头见闻 ======
  {
    id: "neighbor_dispute",
    headline: "🗣️ 楼下住户因为漏水问题跟楼上吵了一整夜",
    level: "L4",
    type: "personal",
    effects: {
      happinessPenalty: 5,
      duration: 1,
    },
  },
  {
    id: "street_rumor",
    headline: "👂 听说城中村要整体改造，房东们都在讨论补偿方案",
    level: "L4",
    type: "personal",
    effects: {
      duration: 3,
    },
  },
  {
    id: "auntie_matchmaking",
    headline: "👵 房东王婶在给你张罗相亲——「姑娘在老家当老师，可好了」",
    level: "L4",
    type: "personal",
    effects: {
      happinessBonus: 3,
      duration: 1,
    },
  },
  {
    id: "street_cat_rescue",
    headline: "🐱 楼下便利店收养了一窝流浪猫，居民们凑钱做绝育",
    level: "L4",
    type: "personal",
    effects: {
      happinessBonus: 5,
      duration: 1,
    },
  },
  {
    id: "workmate_quits",
    headline: "👷 工友老赵不干了——他说老家宅基地要拆迁，回去盖房",
    level: "L4",
    type: "personal",
    effects: {
      duration: 2,
    },
  },
  {
    id: "delivery_guy_story",
    headline: "📦 那个总在半夜送外卖的小哥考上了公务员",
    level: "L4",
    type: "personal",
    effects: {
      happinessBonus: 5,
      duration: 1,
    },
  },
  {
    id: "street_performer",
    headline: "🎸 天桥下多了个弹吉他的年轻人，唱得还挺好听",
    level: "L4",
    type: "personal",
    effects: {
      happinessBonus: 3,
      duration: 1,
    },
  },
  {
    id: "community_meal",
    headline: "🥟 居委会组织包饺子活动，免费吃还有剩的打包",
    level: "L4",
    type: "personal",
    effects: {
      hungerBonus: 20,
      happinessBonus: 8,
      duration: 1,
    },
  },
  {
    id: "gym_scam_warning",
    headline: "⚠️ 群里有人发了防骗提醒——「XX健身房跑路了，别办年卡！」",
    level: "L4",
    type: "personal",
    effects: {
      duration: 2,
    },
  },
  {
    id: "lost_and_found",
    headline: "🔍 有人在社区群说捡到一个钱包——里面的身份证是隔壁栋的",
    level: "L4",
    type: "personal",
    effects: {
      happinessBonus: 3,
      duration: 1,
    },
  },
  {
    id: "price_compare_tip",
    headline: "🛒 王婶告诉你：菜市场西门的土豆比东门便宜¥0.5一斤",
    level: "L4",
    type: "personal",
    effects: {
      cashBonus: 30,
      duration: 1,
    },
  },
  {
    id: "late_night_bbq",
    headline: "🍖 楼下新开了烧烤摊——每晚10点后五折",
    level: "L4",
    type: "personal",
    effects: {
      happinessBonus: 5,
      hungerBonus: 10,
      duration: 1,
    },
  },
];

// ============================================================
//  二、L1-L4 注册到全局新闻池
// ============================================================

(function registerNewsL1L4() {
  if (typeof NEWS_EVENTS !== "undefined" && NEWS_EVENTS) {
    // 将新事件追加到现有新闻池
    for (var i = 0; i < NEWS_L1_L4.length; i++) {
      NEWS_EVENTS.push(NEWS_L1_L4[i]);
    }
  }
})();

// ============================================================
//  三、新闻传导引擎
// ============================================================

/**
 * 检查是否需要触发新闻传导链。
 * 在 rollDailyNews 调用后由 daily_pipeline 调用。
 */
function checkNewsConduit(state) {
  if (!state.activeNews || state.activeNews.length === 0) return;

  // 获取今日新增的高层新闻（L1/L2/L3）
  var todayNews = state.activeNews.filter(function (n) {
    if (!n._conduitChecked) {
      n._conduitChecked = true;
      return true;
    }
    return false;
  });

  for (var i = 0; i < todayNews.length; i++) {
    var news = todayNews[i];
    // 从原始 NEWS_EVENTS 或 NEWS_L1_L4 中找传导配置
    var template = findNewsTemplate(news.id);
    if (!template || !template.conduit) continue;

    var conduit = template.conduit;
    if (!Random.chance(conduit.chance)) continue;

    // 找目标层级的事件
    var targetLevel = conduit.targetLevel;
    var candidates = findNewsByLevel(targetLevel);
    if (candidates.length === 0) continue;

    var targetNews = Random.fromArray(candidates);
    var delay =
      conduit.delayRange[0] +
      Math.floor(
        Random.float(0, conduit.delayRange[1] - conduit.delayRange[0] + 1),
      );

    scheduleNewsConduit(state, targetNews, delay);
  }
}

/** 按 ID 查找新闻模板 */
function findNewsTemplate(id) {
  if (typeof NEWS_EVENTS !== "undefined") {
    for (var i = 0; i < NEWS_EVENTS.length; i++) {
      if (NEWS_EVENTS[i].id === id) return NEWS_EVENTS[i];
    }
  }
  for (var j = 0; j < NEWS_L1_L4.length; j++) {
    if (NEWS_L1_L4[j].id === id) return NEWS_L1_L4[j];
  }
  return null;
}

/** 按层级查找新闻事件（增强版：支持季节过滤） */
function findNewsByLevel(level, seasonId) {
  var result = [];
  var sources = [];
  if (typeof NEWS_EVENTS !== "undefined") {
    sources = sources.concat(NEWS_EVENTS);
  }
  // 也检查 NEWS_L1_L4
  if (typeof NEWS_L1_L4 !== "undefined") {
    sources = sources.concat(NEWS_L1_L4);
  }

  for (var i = 0; i < sources.length; i++) {
    var news = sources[i];
    // 层级过滤
    if (level && news.level !== level) continue;
    // 季节过滤：如果新闻有seasons字段，必须匹配当前季节
    if (seasonId && news.seasons && !news.seasons.includes(seasonId)) {
      continue;
    }
    result.push(news);
  }
  return result;
}

/** 安排传导链新闻（存入 state 的待触发队列） */
function scheduleNewsConduit(state, news, delayDays) {
  state.flags._conduitNewsQueue = state.flags._conduitNewsQueue || [];
  state.flags._conduitNewsQueue.push({
    newsId: news.id,
    triggerDay: state.player.day + delayDays,
  });
}

/** 清理过期传导新闻 */
function cleanupConduitQueue(state) {
  if (!state.flags._conduitNewsQueue) return;
  state.flags._conduitNewsQueue = state.flags._conduitNewsQueue.filter(
    function (entry) {
      return entry.triggerDay >= state.player.day;
    },
  );
}

/** 触发已到期的传导链新闻 */
function applyPendingConduitNews(state) {
  if (!state.flags._conduitNewsQueue) return false;
  var triggered = false;
  var remaining = [];

  for (var i = 0; i < state.flags._conduitNewsQueue.length; i++) {
    var entry = state.flags._conduitNewsQueue[i];
    if (entry.triggerDay <= state.player.day) {
      // 触发新闻
      var template = findNewsTemplate(entry.newsId);
      if (template) {
        applyNewsEffect(template, state);
        StateManager.addMessage("📡 " + template.headline, "news");
        // 也记录到 activeNews
        state.activeNews = state.activeNews || [];
        state.activeNews.push({
          id: template.id,
          headline: template.headline,
          effects: template.effects,
          _appliedDay: state.player.day,
          _conduitChecked: true,
        });
        triggered = true;
      }
    } else {
      remaining.push(entry);
    }
  }
  state.flags._conduitNewsQueue = remaining;
  return triggered;
}

// ============================================================
//  四、L1-L4 感知的新闻获取增强
// ============================================================

/** 获取按层级筛选的随机新闻（增强版：支持季节过滤） */
function getRandomNewsByLevel(level, state) {
  var seasonId = state && state.weather && state.weather.season;
  var candidates = findNewsByLevel(level, seasonId);
  if (candidates.length === 0) return null;
  return Random.fromArray(candidates);
}

/** 获取今日新闻摘要（含层级标注，用于UI展示） */
function getTodayNewsSummary(state) {
  if (!state.activeNews || state.activeNews.length === 0) return "";
  var todayNews = state.activeNews.filter(function (n) {
    return state.player.day - (n._appliedDay || 0) <= 1;
  });
  if (todayNews.length === 0) return "";
  var lines = todayNews.map(function (n) {
    var levelTag = "";
    var tmpl = findNewsTemplate(n.id);
    if (tmpl && tmpl.level) levelTag = "[" + tmpl.level + "] ";
    return levelTag + n.headline;
  });
  return "📰 " + lines.join(" | ");
}

// ============================================================
//  五、百科自更新
// ============================================================

if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.news_system = {
    id: "news_system",
    name: "L1-L4 新闻生态系统",
    icon: "🌐",
    brief:
      "四层新闻分类 + 国际→国内→城市→街头的传导链，新闻不只是背景而是决策依据",
    version: "1.0.0",
    related: ["mechanics:critical_needs", "mechanics:investment"],
    sections: [
      {
        kind: "desc",
        text: "游戏中的新闻分为四个层级，从宏观到微观形成传导链。高层新闻有概率触发低层新闻——国际事件影响国内政策，政策改变城市动态，城市动态最终体现在街头见闻中。",
      },
      {
        kind: "subhead",
        text: "📊 四层分类",
      },
      {
        kind: "list",
        items: [
          "L1 国际新闻：地缘冲突、贸易制裁、货币危机，影响大宗商品和股市",
          "L2 国内政策：行业整顿、利率调整、社保改革，影响工作和收入",
          "L3 城市动态：地铁开通、夜市经济、城管行动，影响地点和商品",
          "L4 街头见闻：邻里八卦、社区活动、实用信息，影响心情和日常",
        ],
      },
      {
        kind: "subhead",
        text: "🔄 传导机制",
      },
      {
        kind: "html",
        get: function () {
          return (
            '<p>当高层新闻发生时：</p><ul class="wiki-list">' +
            "<li>L1 → 60%概率在2~4天后触发相关L2新闻</li>" +
            "<li>L2 → 50%概率在1~3天后触发相关L3新闻</li>" +
            "<li>L3 → 40%概率在1~2天后触发相关L4新闻</li>" +
            "</ul><p>这意味着今天的国际新闻，后天可能会在街头巷尾听到它的回响。</p>"
          );
        },
      },
      {
        kind: "subhead",
        text: "📡 新闻影响范围",
      },
      {
        kind: "list",
        items: [
          "商品价格波动（+20%~-30%）",
          "工作收入和可用性",
          "投资市场（股票/期货/币圈）",
          "玩家心情和日常开销",
          "NPC对话内容和态度",
        ],
      },
    ],
  };
}
