/**
 * 域E(经济/投资) 联动增强 R780 (第十轮循环)
 * 桥接：
 *   E→A  e780_investment_wisdom_v9 投资智慧v9 → 消费 investment 全量数据
 *   E→B  e780_market_narrative_v9 市场叙事v9 → 消费 投资盈亏+市场趋势
 *   E→G  e780_wealth_health_v8 财富健康v8 → 消费 财富数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR780Loaded) return;
  RANDOM_EVENTS._domainELinkageR780Loaded = true;

  var EVENTS = [
    {
      id: "e780_investment_wisdom_v9", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "投资智慧",
      story: "你的投资数据正在讲述经营故事——{desc}",
      triggers: { minDay: 1000, interval: 1100, maxRepeats: 3, excludeFlags: ["_e780WisdomCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e780WisdomCd) return false;
        return st.investment && st.investment.portfolio && st.player && st.player.day >= 1000;
      },
      choices: [
        {
          text: "📈 分析投资模式", hint: "智力+25,会计XP+20,置_e780Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e780WisdomCd = true;
            st.flags._e780Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 25);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据不说谎,但需要解读。' 智力+25,会计XP+20。", "success");
            }
          }
        },
        {
          text: "🎯 调整投资策略", hint: "管理XP+25,置_e780Strategist",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e780WisdomCd = true;
            st.flags._e780Strategist = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '策略,决定成败。' 管理XP+25。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var pv = st.investment && st.investment.portfolio ? Math.round(st.investment.portfolio.totalValue || 0) : 0;
        return "投资组合¥" + pv.toLocaleString() + "——'这些数据,就是你的投资智慧。'";
      }
    },
    {
      id: "e780_market_narrative_v9", phase: "corporate", _isChainEvent: false, icon: "📰",
      title: "市场叙事",
      story: "市场的波动正在书写故事——{desc}",
      triggers: { minDay: 900, interval: 1000, maxRepeats: 3, excludeFlags: ["_e780NarrCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e780NarrCd) return false;
        return st.investment && st.player && st.player.day >= 900;
      },
      choices: [
        {
          text: "📖 记录市场感悟", hint: "心智+25,置_e780Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e780NarrCd = true;
            st.flags._e780Chronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '市场是最好的老师。' 心智+25。", "success");
            }
          }
        },
        {
          text: "🤝 分享投资心得", hint: "社交XP+25,置_e780Sharer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e780NarrCd = true;
            st.flags._e780Sharer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '分享,让知识增值。' 社交XP+25。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "市场的起起落落,正在书写属于你的投资故事——'这些波动,意味着什么?'";
      }
    },
    {
      id: "e780_wealth_health_v8", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "财富健康",
      story: "财务健康与身心健康息息相关——{desc}",
      triggers: { minDay: 800, interval: 900, maxRepeats: 4, excludeFlags: ["_e780HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e780HealthCd) return false;
        return st.resources && st.needs && st.status && st.player && st.player.day >= 800;
      },
      choices: [
        {
          text: "😊 感恩财务安全", hint: "心情+25,健康+15,置_e780Secure",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e780HealthCd = true;
            st.flags._e780Secure = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 '财务安全,是幸福的基础。' 心情+25,健康+15。", "success");
            }
          }
        },
        {
          text: "🎯 设定财富目标", hint: "心智+20,置_e780GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e780HealthCd = true;
            st.flags._e780GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '财富目标,需要规划。' 心智+20。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var totalAssets = (st.resources && st.resources.cash || 0) + (st.resources && st.resources.bankBalance || 0);
        return "总资产¥" + Math.round(totalAssets).toLocaleString() + "——'财富,带来了安全感。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
