/**
 * 域A(数据/数值平衡) 联动增强 R848
 * 全系统优化·Domain A 第七十一轮循环
 *
 * 【联动增强3项】
 *   1. A→B 价格波动叙事v21 — 价格数据触发事件叙事回响
 *   2. A→G 经济健康度v20 — 经济数据反馈为生命质量
 *   3. A→C 技能市场需求v20 — 技能数据影响职业市场需求
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR848Loaded) return;
  RANDOM_EVENTS._domainALinkageR848Loaded = true;

  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "a848_price_narrative_v21",
      phase: "street",
      icon: "📈",
      title: "市场脉搏，机会浮现",
      story: "最近市场价格波动带着一种奇特的规律——你隐约觉得，市场在向你传递某种信号。那些被大多数人忽略的细微波动，或许藏着真正的机会。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a848PriceNarrDone) return false;
        var _volEvents = st.flags._priceVolatilityCount || 0;
        return _volEvents >= 20 && st.player.day >= 450;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📈 深入研究市场规律",
          hint: "智力+28, 心智+26, 置_a848MarketSense",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a848PriceNarrDone = true;
            st.flags._a848MarketSense = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 28);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 26);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 你开始深入研究市场规律——智力+28, 心智+26。", "success");
            }
          }
        },
        {
          text: "😅 市场太复杂了",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a848PriceNarrDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 市场太复杂了。心智+5。", "info");
            }
          }
        }
      ]
    },
    {
      id: "a848_econ_health_v20",
      phase: "street",
      icon: "💚",
      title: "经济健康，生活从容",
      story: "你算了算——总资产突破了八十万。这些数字的背后，是你在这座城市里一步步积累的成果。经济上的从容，让你开始真正享受生活本身。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a848EconHealthDone) return false;
        if (!st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return _total >= 800000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💚 评估经济健康度",
          hint: "心智+28, 会计XP+35, 置_a848EconHealthy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a848EconHealthDone = true;
            st.flags._a848EconHealthy = true;
            var _debt = (st.resources.villageDebt || 0) + (st.resources.fineDebt || 0) + (st.resources.bankDebt || 0);
            var _assets = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
            st.flags._a848DebtToAssetRatio = _assets > 0 ? Math.round(_debt / _assets * 100) / 100 : 0;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 28);
            grantXp("accounting", 35);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 经济健康度评估完成——心智+28, 会计XP+35。", "success");
            }
          }
        },
        {
          text: "😅 有钱就行，不用评估",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a848EconHealthDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 有钱就行。心智+5。", "info");
            }
          }
        }
      ]
    },
    {
      id: "a848_skill_demand_v20",
      phase: "street",
      icon: "📈",
      title: "技能溢价，市场认可",
      story: "你打开求职市场——发现自己的技能水平已经远超同龄人。市场的需求在变化，而你恰好站在了正确的位置上。这不是运气，是你持续投入的结果。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a848SkillDemandDone) return false;
        if (!st.skills) return false;
        var _count = 0;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 85) _count++;
        }
        return _count >= 5;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📈 用技能溢价兑换机会",
          hint: "会计XP+32, 智力+26, 置_a848SkillMonetizer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a848SkillDemandDone = true;
            st.flags._a848SkillMonetizer = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 26);
            grantXp("accounting", 32);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 你用技能溢价兑换到更好的机会——智力+26, 会计XP+32。", "success");
            }
          }
        },
        {
          text: "😅 慢慢来，不急",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a848SkillDemandDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 慢慢来。心智+5。", "info");
            }
          }
        }
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