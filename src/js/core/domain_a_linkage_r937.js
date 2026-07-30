/*
 * 城市浮生记 — 域A(数据/数值平衡) 联动增强 R937
 * 全系统优化·Domain A 第七十三轮循环
 *
 * 【联动增强3项 — 新循环第一轮】
 *   1. A→B 市场情绪叙事v1 — 价格波动触发市场情绪叙事
 *   2. A→G 经济健康度v1 — 综合经济数据反馈生命质量
 *   3. A→H 企业数据资产v1 — 市场数据影响企业运营决策
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动现有文件。
 *  - 所有 state 访问均 || 防御。
 *  - 严格遵守目标域数据格式。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR937Loaded) return;
  RANDOM_EVENTS._domainALinkageR937Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: A→B 市场情绪叙事v1
    // 设计意图：极端价格波动触发市场情绪叙事事件，
    //    让玩家感受到市场温度。
    // 心理学：损失厌恶 — 极端价格唤醒风险意识
    // ========================================================================
    {
      id: "a937_market_sentiment_v1",
      phase: "street",
      icon: "📊",
      title: "市场情绪波动",
      story: "你注意到最近市场情绪有些异常。\n\n摊贩们议论纷纷，有人在囤货，有人在抛售。空气中弥漫着一种不安的气氛。\n\n「每次市场情绪这样，都意味着变局要来了。」你心里暗暗警觉。",
      triggers: { minDay: 30, interval: 90, maxRepeats: 5, excludeFlags: ["_a937SentimentCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a937SentimentCd) return false;
        if (!st.flags) return false;
        // 需要通胀数据或价格波动记录
        var _inf = Math.abs(st.flags._cumulativeInflation || 0);
        var _vol = st.flags._priceVolatilityCount || 0;
        return (_inf > 0.08 || _vol >= 3) && st.player.day >= 30;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "📊 分析市场情绪",
          hint: "智力+12, 销售XP+15, 置_a937SentimentAware",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a937SentimentCd = true;
            st.flags._a937SentimentAware = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            grantXp("sales", 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 你分析了市场情绪——智力+12, 销售XP+15。", "success");
            }
          }
        },
        {
          text: "😅 不管了，照常做事",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a937SentimentCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 不管了，照常做事。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: A→G 经济健康度v1
    // 设计意图：综合经济数据(通胀/负债/收入)反馈为生命质量评分，
    //    让玩家直观感受经济状况对生活的影响。
    // 心理学：认知负荷 — 综合评分降低信息处理负担
    // ========================================================================
    {
      id: "a937_econ_health_life_v1",
      phase: "street",
      icon: "💚",
      title: "经济基础决定生活质量",
      story: "你算了算自己的收支状况——物价、收入、负债，这些数字直接影响着你的生活品质。\n\n当物价上涨而收入不变时，生活质量就在悄悄下降。反之，当收入跑赢通胀时，日子就会越过越好。",
      triggers: { minDay: 45, interval: 90, maxRepeats: 5, excludeFlags: ["_a937EconHealthCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a937EconHealthCd) return false;
        if (!st.flags || !st.resources) return false;
        var _inf = st.flags._cumulativeInflation || 0;
        var _cash = st.resources.cash || 0;
        // 通胀显著或资金紧张时触发
        return (Math.abs(_inf) > 0.1 || _cash < 500) && st.player.day >= 45;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "💚 评估经济健康度",
          hint: "心智+12, 会计XP+15, 置_a937EconHealth",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a937EconHealthCd = true;
            st.flags._a937EconHealth = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            grantXp("accounting", 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 你评估了经济健康度——心智+12, 会计XP+15。", "success");
            }
          }
        },
        {
          text: "😅 走一步看一步",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a937EconHealthCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 走一步看一步。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: A→H 企业数据资产v1
    // 设计意图：市场数据(通胀/价格指数)影响企业运营决策，
    //    让企业经营者获得数据驱动的决策支持。
    // 心理学：控制感 — 数据降低不确定性带来的焦虑
    // ========================================================================
    {
      id: "a937_corp_data_asset_v1",
      phase: "corporate",
      icon: "🏢",
      title: "数据驱动企业决策",
      story: "你的公司运营数据里，市场价格波动和通胀率是需要密切关注的两个指标。\n\n「原材料成本在涨，但我们的定价策略还没调整……」你翻开报表，心里盘算着对策。",
      triggers: { minDay: 100, interval: 120, maxRepeats: 4, excludeFlags: ["_a937CorpDataCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a937CorpDataCd) return false;
        if (!st.corporate || !st.corporate.active) return false;
        if (!st.flags) return false;
        var _inf = st.flags._cumulativeInflation || 0;
        return Math.abs(_inf) > 0.05 && st.player.day >= 100;
      },
      probability: 0.05,
      repeatable: true,
      choices: [
        {
          text: "🏢 用数据优化运营",
          hint: "管理XP+18, 智力+10, 置_a937CorpDataDriven",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a937CorpDataCd = true;
            st.flags._a937CorpDataDriven = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            grantXp("management", 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏢 你用市场数据优化了企业运营——管理XP+18, 智力+10。", "success");
            }
          }
        },
        {
          text: "😅 凭经验就够了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a937CorpDataCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 凭经验就够了。心智+3。", "info");
            }
          }
        }
      ]
    }
  ];

  // 去重注册
  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();