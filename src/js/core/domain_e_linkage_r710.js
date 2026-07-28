/**
 * 域E(经济/投资) 联动增强 R710
 * 桥接：
 *   E→A  e710_investment_data_driven 投资数据洞察 → 消费 state.investment 全量数据,
 *     将隐形投资数据显性化为"投资智慧"
 *   E→B  e710_market_narrative 市场叙事 → 消费 投资盈亏+市场趋势,
 *     让经济波动产生叙事回响
 *   E→G  e710_financial_wellbeing 财务幸福感 → 消费 财富数据+needs,
 *     财务健康影响身心健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR710Loaded) return;
  RANDOM_EVENTS._domainELinkageR710Loaded = true;

  var EVENTS = [
    {
      id: "e710_investment_data_driven", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "投资数据洞察",
      story: "你回顾这段时间的投资——{desc}",
      triggers: { minDay: 120, interval: 150, maxRepeats: 3, excludeFlags: ["_e710DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e710DataCd) return false;
        return st.investment && st.investment.portfolio && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "📈 分析盈亏模式", hint: "会计XP+6,智力+3,置_e710Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e710DataCd = true;
            st.flags._e710Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据不说谎,但需要解读。' 会计XP+6,智力+3。", "success");
            }
          }
        },
        {
          text: "💰 调整资产配置", hint: "管理XP+5,置_e710Allocator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e710DataCd = true;
            st.flags._e710Allocator = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '分散风险,稳定收益。' 管理XP+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var pv = st.investment && st.investment.portfolio ? st.investment.portfolio.totalValue || 0 : 0;
        return "你的投资组合市值¥" + Math.round(pv).toLocaleString() + "——'这些数据,说明了什么?'";
      }
    },
    {
      id: "e710_market_narrative", phase: "corporate", _isChainEvent: false, icon: "📰",
      title: "市场叙事",
      story: "市场的波动正在书写故事——{desc}",
      triggers: { minDay: 90, interval: 120, maxRepeats: 3, excludeFlags: ["_e710NarrCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e710NarrCd) return false;
        if (!st.investment) return false;
        var inv = st.investment;
        return (inv.stockHoldings && inv.stockHoldings.length > 0) || (inv.btcHoldings && inv.btcHoldings > 0);
      },
      choices: [
        {
          text: "📖 记录市场感悟", hint: "心智+4,智力+2,置_e710Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e710NarrCd = true;
            st.flags._e710Chronicler = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '市场是最好的老师。' 心智+4,智力+2。", "success");
            }
          }
        },
        {
          text: "🤝 分享投资心得", hint: "社交XP+6,置_e710Sharer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e710NarrCd = true;
            st.flags._e710Sharer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '分享让知识增值。' 社交XP+6。", "info");
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
      id: "e710_financial_wellbeing", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "财务幸福感",
      story: "财务健康与身心健康息息相关——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 4, excludeFlags: ["_e710WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e710WellbeingCd) return false;
        if (!st.resources || !st.needs || !st.status) return false;
        var totalAssets = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return totalAssets >= 50000 && st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "😊 感恩财务安全", hint: "心情+8,健康+2,置_e710Secure",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e710WellbeingCd = true;
            st.flags._e710Secure = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 '钱不是万能的,但没有钱是万万不能的。' 心情+8,健康+2。", "success");
            }
          }
        },
        {
          text: "🎯 设定新目标", hint: "心智+5,置_e710GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e710WellbeingCd = true;
            st.flags._e710GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '财务自由不是终点,而是新起点。' 心智+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var totalAssets = (st.resources && st.resources.cash || 0) + (st.resources && st.resources.bankBalance || 0);
        return "你的总资产¥" + Math.round(totalAssets).toLocaleString() + "——'财富,带来了安全感。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
