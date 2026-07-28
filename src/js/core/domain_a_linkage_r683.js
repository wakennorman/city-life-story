/**
 * 域A(数据/数值平衡) 联动增强 R683
 * 桥接：
 *   A→G  a683_data_health_awakening  数据健康觉醒 → 消费 state.status+state.player 数据,
 *     用数据驱动健康意识
 *   A→C  a683_skill_market_value      技能市场价值 → 消费 state.skills+state.employment 数据,
 *     技能等级与市场定价的关联叙事
 *   A→E  a683_price_wealth_insight    价格财富洞察 → 消费 state.trade+state.resources 数据,
 *     市场价格波动中的财富机会
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR683Loaded) return;
  RANDOM_EVENTS._domainALinkageR683Loaded = true;

  function topSkill(st) {
    if (!st || !st.skills) return null;
    var best = null, bestLv = -1;
    for (var k in st.skills) {
      var s = st.skills[k];
      if (s && typeof s.level === "number" && s.level > bestLv) {
        bestLv = s.level; best = k;
      }
    }
    return best;
  }

  var EVENTS = [
    {
      id: "a683_data_health_awakening",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "数据驱动的健康觉醒",
      story: "你开始用数据关注自己的健康",
      triggers: { minDay: 50, interval: 80, maxRepeats: 3, excludeFlags: ["_a683HealthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a683HealthCd) return false;
        return st.player && st.player.day >= 50;
      },
      choices: [
        {
          text: "🏃 制定健康计划",
          hint: "健康+5,心智+3,置_a683HealthPlan",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a683HealthCd = true;
            st.flags._a683HealthPlan = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 数据不会说谎,健康需要管理。健康+5,心智+3。", "success");
            }
          }
        },
        {
          text: "📊 继续观察",
          hint: "智力+3,置_a683Observer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a683HealthCd = true;
            st.flags._a683Observer = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 观察是分析的第一步。智力+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 0;
        return "健康" + health + "%——'如果健康是资产,现在值多少?'";
      }
    },
    {
      id: "a683_skill_market_value",
      phase: "street",
      _isChainEvent: false,
      icon: "💎",
      title: "技能的市场定价",
      story: "你的技能在市场上值多少钱",
      triggers: { minDay: 70, interval: 90, maxRepeats: 2, excludeFlags: ["_a683SkillCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a683SkillCd) return false;
        return topSkill(st) && st.player && st.player.day >= 70;
      },
      choices: [
        {
          text: "💰 用技能变现",
          hint: "销售XP+5,现金+800,置_a683Monetize",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a683SkillCd = true;
            st.flags._a683Monetize = true;
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + 800;
              st.resources.totalEarned = (st.resources.totalEarned || 0) + 800;
            }
            if (typeof addSkillXp === "function") { try { addSkillXp("sales", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 技能变现,收入¥800!销售XP+5。", "success");
            }
          }
        },
        {
          text: "📚 继续投资自己",
          hint: "心智+4,置_a683InvestSelf",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a683SkillCd = true;
            st.flags._a683InvestSelf = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📚 最好的投资是自己。心智+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var sk = topSkill(st);
        return "技能'" + (sk || "无") + "'等级提升——'这门手艺,在市场上到底值多少?'";
      }
    },
    {
      id: "a683_price_wealth_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "🔍",
      title: "价格波动中的财富机会",
      story: "你开始从价格数据中发现机会",
      triggers: { minDay: 90, interval: 100, maxRepeats: 2, excludeFlags: ["_a683PriceCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a683PriceCd) return false;
        return st.player && st.player.day >= 90;
      },
      choices: [
        {
          text: "📊 记录价格规律",
          hint: "会计XP+5,智力+3,置_a683Tracker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a683PriceCd = true;
            st.flags._a683Tracker = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据是发现规律的眼睛。会计XP+5,智力+3。", "success");
            }
          }
        },
        {
          text: "🛒 趁机低买高卖",
          hint: "销售XP+4,现金+500,置_a683Arbitrage",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a683PriceCd = true;
            st.flags._a683Arbitrage = true;
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + 500;
              st.resources.totalEarned = (st.resources.totalEarned || 0) + 500;
            }
            if (typeof addSkillXp === "function") { try { addSkillXp("sales", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🛒 低买高卖,赚¥500!销售XP+4。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "菜价涨了,肉价跌了——'价格波动不是噪音,是信号。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
