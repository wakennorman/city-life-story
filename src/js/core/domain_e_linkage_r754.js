/**
 * 域E(经济/投资) 联动增强 R754 (第七轮循环)
 * 桥接：
 *   E→A  e754_investment_wisdom_v6 投资智慧v6 → 消费 investment 全量数据
 *   E→B  e754_market_narrative_v6 市场叙事v6 → 消费 投资盈亏+市场趋势
 *   E→G  e754_wealth_health_v5 财富健康v5 → 消费 财富数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR754Loaded) return;
  RANDOM_EVENTS._domainELinkageR754Loaded = true;

  var EVENTS = [
    {
      id: "e754_investment_wisdom_v6", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "投资智慧",
      story: "你的投资数据正在讲述经营故事——{desc}",
      triggers: { minDay: 400, interval: 500, maxRepeats: 3, excludeFlags: ["_e754WisdomCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e754WisdomCd) return false;
        return st.investment && st.investment.portfolio && st.player && st.player.day >= 400;
      },
      choices: [
        {
          text: "📈 分析投资模式", hint: "智力+15,会计XP+12,置_e754Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e754WisdomCd = true;
            st.flags._e754Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据不说谎,但需要解读。' 智力+15,会计XP+12。", "success");
            }
          }
        },
        {
          text: "🎯 调整投资策略", hint: "管理XP+15,置_e754Strategist",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e754WisdomCd = true;
            st.flags._e754Strategist = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '策略,决定成败。' 管理XP+15。", "info");
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
      id: "e754_market_narrative_v6", phase: "corporate", _isChainEvent: false, icon: "📰",
      title: "市场叙事",
      story: "市场的波动正在书写故事——{desc}",
      triggers: { minDay: 365, interval: 400, maxRepeats: 3, excludeFlags: ["_e754NarrCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e754NarrCd) return false;
        return st.investment && st.player && st.player.day >= 365;
      },
      choices: [
        {
          text: "📖 记录市场感悟", hint: "心智+15,置_e754Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e754NarrCd = true;
            st.flags._e754Chronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '市场是最好的老师。' 心智+15。", "success");
            }
          }
        },
        {
          text: "🤝 分享投资心得", hint: "社交XP+15,置_e754Sharer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e754NarrCd = true;
            st.flags._e754Sharer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '分享,让知识增值。' 社交XP+15。", "info");
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
      id: "e754_wealth_health_v5", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "财富健康",
      story: "财务健康与身心健康息息相关——{desc}",
      triggers: { minDay: 300, interval: 365, maxRepeats: 4, excludeFlags: ["_e754HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e754HealthCd) return false;
        return st.resources && st.needs && st.status && st.player && st.player.day >= 300;
      },
      choices: [
        {
          text: "😊 感恩财务安全", hint: "心情+15,健康+8,置_e754Secure",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e754HealthCd = true;
            st.flags._e754Secure = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 '财务安全,是幸福的基础。' 心情+15,健康+8。", "success");
            }
          }
        },
        {
          text: "🎯 设定财富目标", hint: "心智+10,置_e754GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e754HealthCd = true;
            st.flags._e754GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '财富目标,需要规划。' 心智+10。", "info");
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
