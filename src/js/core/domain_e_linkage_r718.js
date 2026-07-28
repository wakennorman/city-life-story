/**
 * 域E(经济/投资) 联动增强 R718
 * 桥接：
 *   E→A  e718_investment_intelligence_v2 投资情报v2 → 消费 investment 全量数据,
 *     将隐形投资数据显性化为"投资智慧报告"
 *   E→B  e718_market_story_v2 市场故事v2 → 消费 投资盈亏+市场趋势,
 *     市场波动产生叙事回响
 *   E→G  e718_wealth_wellbeing_v2 财富幸福感v2 → 消费 财富数据+needs,
 *     财富状态影响身心健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR718Loaded) return;
  RANDOM_EVENTS._domainELinkageR718Loaded = true;

  var EVENTS = [
    {
      id: "e718_investment_intelligence_v2", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "投资智慧报告",
      story: "你的投资数据正在讲述经营故事——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 3, excludeFlags: ["_e718IntelCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e718IntelCd) return false;
        return st.investment && st.investment.portfolio && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "📈 分析投资模式", hint: "智力+6,会计XP+5,置_e718Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e718IntelCd = true;
            st.flags._e718Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据不说谎,但需要解读。' 智力+6,会计XP+5。", "success");
            }
          }
        },
        {
          text: "🎯 调整投资策略", hint: "管理XP+6,置_e718Strategist",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e718IntelCd = true;
            st.flags._e718Strategist = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '策略,决定成败。' 管理XP+6。", "info");
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
      id: "e718_market_story_v2", phase: "corporate", _isChainEvent: false, icon: "📰",
      title: "市场故事",
      story: "市场的波动正在书写故事——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_e718StoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e718StoryCd) return false;
        return st.investment && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "📖 记录市场感悟", hint: "心智+5,置_e718Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e718StoryCd = true;
            st.flags._e718Chronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '市场是最好的老师。' 心智+5。", "success");
            }
          }
        },
        {
          text: "🤝 分享投资心得", hint: "社交XP+7,置_e718Sharer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e718StoryCd = true;
            st.flags._e718Sharer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 7); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '分享,让知识增值。' 社交XP+7。", "info");
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
      id: "e718_wealth_wellbeing_v2", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "财富幸福感",
      story: "财务健康与身心健康息息相关——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 4, excludeFlags: ["_e718WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e718WellbeingCd) return false;
        return st.resources && st.needs && st.status && st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "😊 感恩财务安全", hint: "心情+8,健康+3,置_e718Secure",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e718WellbeingCd = true;
            st.flags._e718Secure = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 '财务安全,是幸福的基础。' 心情+8,健康+3。", "success");
            }
          }
        },
        {
          text: "🎯 设定财富目标", hint: "心智+5,置_e718GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e718WellbeingCd = true;
            st.flags._e718GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '财富目标,需要规划。' 心智+5。", "info");
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
