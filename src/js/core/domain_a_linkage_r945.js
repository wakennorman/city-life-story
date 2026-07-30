/*
 * 城市浮生记 — 域A(数据/数值平衡) 联动增强 R945
 * 全系统优化·Domain A 第七十四轮循环
 *
 * 【联动增强3项】
 *   1. A→B 市场情绪叙事v1 — 价格波动触发市场情绪
 *   2. A→G 经济健康度v1 — 经济数据反馈生命质量
 *   3. A→E 通胀投资觉醒v1 — 通胀数据触发投资觉醒
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR945Loaded) return;
  RANDOM_EVENTS._domainALinkageR945Loaded = true;

  function grantXp(k, a) { if (typeof addSkillXp === "function") { try { addSkillXp(k, a); } catch(e) {} } }

  var EVENTS = [
    {
      id: "a945_market_sentiment_v1", phase: "street", icon: "📊",
      title: "市场情绪波动",
      story: "你注意到最近市场情绪有些不寻常。摊贩们议论纷纷，空气中弥漫着不安的气氛。",
      triggers: { minDay: 25, interval: 80, maxRepeats: 5, excludeFlags: ["_a945SentimentCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a945SentimentCd) return false;
        if (!st.flags) return false;
        var _inf = Math.abs(st.flags._cumulativeInflation || 0);
        var _vol = st.flags._priceVolatilityCount || 0;
        return (_inf > 0.06 || _vol >= 2) && st.player.day >= 25;
      },
      probability: 0.04, repeatable: true,
      choices: [
        { text: "📊 分析市场情绪", hint: "智力+10,销售XP+12,置_a945SentimentAware", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._a945SentimentCd = true; st.flags._a945SentimentAware = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
          grantXp("sales", 12);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 分析了市场情绪——智力+10,销售XP+12。", "success");
        }},
        { text: "😅 照常做事", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._a945SentimentCd = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😅 照常做事。心智+3。", "info");
        }}
      ]
    },
    {
      id: "a945_econ_health_v1", phase: "street", icon: "💚",
      title: "经济基础决定生活质量",
      story: "你算了算自己的收支状况。物价、收入、负债——这些数字直接影响生活品质。",
      triggers: { minDay: 40, interval: 80, maxRepeats: 5, excludeFlags: ["_a945EconHealthCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a945EconHealthCd) return false;
        if (!st.flags || !st.resources) return false;
        return (Math.abs(st.flags._cumulativeInflation || 0) > 0.08 || (st.resources.cash || 0) < 300) && st.player.day >= 40;
      },
      probability: 0.04, repeatable: true,
      choices: [
        { text: "💚 评估经济健康度", hint: "心智+10,会计XP+12,置_a945EconHealth", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._a945EconHealthCd = true; st.flags._a945EconHealth = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
          grantXp("accounting", 12);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💚 评估了经济健康度——心智+10,会计XP+12。", "success");
        }},
        { text: "😅 走一步看一步", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._a945EconHealthCd = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😅 走一步看一步。心智+3。", "info");
        }}
      ]
    },
    {
      id: "a945_inflation_invest_v1", phase: "street", icon: "📈",
      title: "通胀觉醒",
      story: "物价持续上涨，你意识到现金放在手里会越来越不值钱。\n\n「也许该做点什么让钱保值……」你开始认真考虑投资的事。",
      triggers: { minDay: 50, interval: 100, maxRepeats: 3, excludeFlags: ["_a945InflationInvestCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a945InflationInvestCd) return false;
        if (!st.flags) return false;
        return (st.flags._cumulativeInflation || 0) > 0.12 && st.player.day >= 50;
      },
      probability: 0.04, repeatable: true,
      choices: [
        { text: "📈 学习投资抗通胀", hint: "智力+12,会计XP+15,置_a945InflationInvestor", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._a945InflationInvestCd = true; st.flags._a945InflationInvestor = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
          grantXp("accounting", 15);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 学习了投资抗通胀——智力+12,会计XP+15。", "success");
        }},
        { text: "😅 现金为王", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._a945InflationInvestCd = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😅 现金为王。心智+3。", "info");
        }}
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();