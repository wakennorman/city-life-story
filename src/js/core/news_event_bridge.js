/**
 * 新闻-事件桥接系统 — 让新闻影响事件触发、NPC态度和游戏机制
 *
 * 设计目标（1.4标准）：
 * 1. 逻辑自洽：新闻影响应有可感知的后续
 * 2. 系统联动：新闻至少影响2个其他系统
 * 3. 玩家可感知：新闻不只是公告栏文字
 * 4. 重复价值：不同周目不同新闻组合产生不同效果
 */

// ============================================================
// 第一层：新闻→事件触发
// ============================================================

/** 新闻触发事件映射 — 当特定新闻生效时，提高相关事件的触发权重 */
const NEWS_TRIGGERED_EVENTS = {
  metal_boom: {
    boostedEvents: ["wholesale_bargain"],
    weightBonus: 0.15,
    npcComment: "old_zhou",
    npcMsg: "老周眉飞色舞：'看见没！废铁涨了！我早说了吧！'",
  },
  heatwave: {
    boostedEvents: ["food_poisoning"],
    weightBonus: 0.12,
    npcComment: "chef_chen",
    npcMsg: "陈师傅抹了把汗：'这天气，食材放不住，赶紧卖完。'",
  },
  cold_wave: {
    boostedEvents: ["rainy_day_dilemma"],
    weightBonus: 0.15,
    npcComment: "aunt_wang",
    npcMsg: "王大婶裹着棉衣：'这天冷得邪乎，多穿点。'",
  },
  construction_boom: {
    boostedEvents: ["coworker_injured"],
    weightBonus: 0.1,
    npcComment: "boss_li",
    npcMsg: "李工头忙得脚不沾地：'活太多，你盯紧点安全。'",
  },
  flu_surge: {
    boostedEvents: ["sick_desperate"],
    weightBonus: 0.15,
    npcComment: "xiao_mei",
    npcMsg: "小美戴着口罩给你发消息：'学校好多人感冒了，你小心。'",
  },
  platform_subsidy_war: {
    boostedEvents: ["food_poisoning", "rainy_day_dilemma"],
    weightBonus: 0.08,
    npcComment: "sister_zhang",
    npcMsg: "张姐刷着手机说：'平台补贴来了，跑外卖的这波赚了。'",
  },
  fruit_glut: {
    boostedEvents: ["wholesale_bargain"],
    weightBonus: 0.2,
    npcComment: "chef_chen",
    npcMsg: "陈师傅开心：'水果降价了，我这成本又能降一成！'",
  },
  subsidy: {
    boostedEvents: [],
    weightBonus: 0,
    npcComment: "sister_zhang",
    npcMsg: "张姐转发了一条政策新闻：'培训有补贴，你赶紧去考个证！'",
  },
};

/**
 * 检查当前活跃新闻并应用事件权重加成
 * 在每日事件 rollStreetEvent / rollCorporateEvent 前调用
 */
function applyNewsEventWeights(state) {
  if (!state.flags) state.flags = {};
  // 清除旧的权重加成
  state.flags._newsEventWeights = {};

  var activeNews = state.activeNews || [];
  if (activeNews.length === 0) return;

  for (var ni = 0; ni < activeNews.length; ni++) {
    var newsItem = activeNews[ni];
    var trigger = NEWS_TRIGGERED_EVENTS[newsItem.id];
    if (!trigger) continue;
    // 检查新闻是否仍生效（_appliedDay 同理）
    var appliedDay = newsItem._appliedDay || 0;
    var duration = (newsItem.effects && newsItem.effects.duration) || 0;
    if (state.player.day - appliedDay > duration) continue;

    // 加成相关事件权重
    var events = trigger.boostedEvents;
    if (!events || events.length === 0) continue;
    for (var ei = 0; ei < events.length; ei++) {
      var eid = events[ei];
      state.flags._newsEventWeights[eid] =
        (state.flags._newsEventWeights[eid] || 0) +
        (trigger.weightBonus || 0.1);
    }
  }
}

/** 获取某个事件因新闻获得的额外权重 */
function getNewsBonusWeight(eventId, state) {
  if (!state.flags || !state.flags._newsEventWeights) return 0;
  return state.flags._newsEventWeights[eventId] || 0;
}

// ============================================================
// 第二层：新闻→价格情绪联动
// ============================================================

/** 新闻对商品价格的"预期修正"（新闻刚出时价格未动但消息已扩散） */
function applyNewsPriceSentiment(state) {
  if (!state.flags) return;
  var activeNews = state.activeNews || [];
  if (activeNews.length === 0) return;

  for (var ni = 0; ni < activeNews.length; ni++) {
    var news = activeNews[ni];
    var effects = news.effects;
    if (!effects || !effects.priceMod) continue;

    // 新闻发布后1-2天内，价格向新闻方向漂移（模拟市场滞后反应）
    var daysSinceNews = (state.player.day || 1) - (news._appliedDay || 0);
    if (daysSinceNews > 2) continue;
    if (daysSinceNews < 0) continue;

    var driftFactor = 0.15; // 每日漂移15%，2天到30%
    for (var goodId in effects.priceMod) {
      var targetMult = effects.priceMod[goodId];
      var currentPrices = state.trade && state.trade.goodsPrices;
      if (!currentPrices) continue;
      for (var locKey in currentPrices) {
        if (
          currentPrices[locKey] &&
          currentPrices[locKey][goodId] !== undefined
        ) {
          var currentPrice = currentPrices[locKey][goodId];
          var basePrice = state.flags._basePrices
            ? state.flags._basePrices[locKey] &&
              state.flags._basePrices[locKey][goodId]
            : null;
          if (!basePrice) continue;
          var targetPrice = basePrice * targetMult;
          // 往target方向漂移
          var diff = targetPrice - currentPrice;
          currentPrices[locKey][goodId] =
            Math.round((currentPrice + diff * driftFactor) * 100) / 100;
        }
      }
    }
  }
}

// ============================================================
// 第三层：新闻→工作热力图（动态改变哪些工作"热门"）
// ============================================================

/** 新闻影响工作可见性和收益加成 */
function getNewsJobBoost(jobId, state) {
  var activeNews = state.activeNews || [];
  var bonus = 1.0;

  for (var ni = 0; ni < activeNews.length; ni++) {
    var news = activeNews[ni];
    var effects = news.effects;
    if (!effects) continue;

    // jobBonus/jobPenalty 已经由 applyNewsEffect 处理
    // 这里补充"软性"影响：新闻地区的工作额外吸引力或风险
    var newsLocationBoost = {
      construction_boom: [
        "manual_labor_construction",
        "skilled_labor_construction",
      ],
      factory_boom: ["factory_work_assembly", "factory_overtime"],
      back_to_school: ["package_delivery", "tutoring"],
      platform_subsidy_war: ["delivery_rider"],
      heatwave: ["delivery_rider", "hospital_caregiver"],
      cold_wave: ["hospital_caregiver", "cleaning_service"],
      urban_renewal_pilot: ["manual_labor_construction", "repair_service"],
      flu_surge: ["hospital_caregiver"],
    };

    var boosted = newsLocationBoost[news.id];
    if (boosted && boosted.indexOf(jobId) >= 0) {
      bonus += 0.08; // 额外8%新闻热度加成
    }
  }

  return bonus;
}

// ============================================================
// 第四层：桥接管线的全量执行
// ============================================================

/** 每日管线中的新闻桥接步骤 */
function runDailyNewsBridge(state) {
  if (!state) return;

  // 1. 新闻事件权重加成
  applyNewsEventWeights(state);

  // 2. 新闻价格情绪传导（仅新闻后1-2天）
  applyNewsPriceSentiment(state);

  // 3. NPC对新闻的反馈（已由 npc_event_bridge.js 处理，这里补充新闻专属消息）
  var activeNews = state.activeNews || [];
  if (activeNews.length > 0 && Math.random() < 0.15) {
    var latest = activeNews[activeNews.length - 1];
    var trigger = NEWS_TRIGGERED_EVENTS[latest.id];
    if (trigger && trigger.npcMsg) {
      StateManager.addMessage("💬 " + trigger.npcMsg, "info");
    }
  }
}
