/**
 * 域E(经济/投资) 联动增强 R695
 * 桥接：
 *   E→B  e695_investment_story      投资故事 → 消费 state.investment+state.flags,
 *     投资经历成为人生叙事
 *   E→F  e695_invest_tracker_ui     投资追踪UI → 消费 state.investment,
 *     投资管理可视化
 *   E→G  e695_financial_stress      财务压力 → 消费 state.resources+state.needs,
 *     财务压力影响生活质量
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR695Loaded) return;
  RANDOM_EVENTS._domainELinkageR695Loaded = true;

  function hasInvestment(st) {
    if (!st || !st.investment) return false;
    return (st.investment.stockHoldings && st.investment.stockHoldings.length > 0) ||
           (st.investment.btcHoldings && st.investment.btcHoldings > 0) ||
           (st.investment.properties && st.investment.properties.length > 0);
  }

  var EVENTS = [
    {
      id: "e695_investment_story",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "投资故事",
      story: "每一段投资经历都值得被记录",
      triggers: { minDay: 90, interval: 100, maxRepeats: 2, excludeFlags: ["_e695StoryCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e695StoryCd) return false;
        return hasInvestment(st) && st.player && st.player.day >= 90;
      },
      choices: [
        {
          text: "📝 写投资日记",
          hint: "会计XP+5,心智+3,置_e695Diary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e695StoryCd = true;
            st.flags._e695Diary = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 好记性不如烂笔头,投资日记是最好的复盘。会计XP+5,心智+3。", "success");
            }
          }
        },
        {
          text: "🤫 记在心里",
          hint: "智力+4,置_e695Memory",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e695StoryCd = true;
            st.flags._e695Memory = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤫 经验是最好的老师。智力+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "买入、持有、卖出——'每一次决策,都是人生故事里的一个章节。'";
      }
    },
    {
      id: "e695_invest_tracker_ui",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资追踪",
      story: "定期复盘是投资的好习惯",
      triggers: { minDay: 80, interval: 90, maxRepeats: 3, excludeFlags: ["_e695TrackCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e695TrackCd) return false;
        return hasInvestment(st) && st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "📈 详细复盘",
          hint: "会计XP+6,智力+3,置_e695Review",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e695TrackCd = true;
            st.flags._e695Review = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 复盘是进步的阶梯。会计XP+6,智力+3。", "success");
            }
          }
        },
        {
          text: "⚡ 快速扫一眼",
          hint: "智力+2,置_e695Glance",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e695TrackCd = true;
            st.flags._e695Glance = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("⚡ 大方向没问题就行。智力+2。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "打开投资账户,看着持仓——'定期给自己的资产拍个快照,看看成长轨迹。'";
      }
    },
    {
      id: "e695_financial_stress",
      phase: "street",
      _isChainEvent: false,
      icon: "😰",
      title: "财务压力",
      story: "钱不够用的压力真的很大",
      triggers: { minDay: 40, interval: 60, maxRepeats: 3, excludeFlags: ["_e695StressCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e695StressCd) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        return cash < 1000 && st.player && st.player.day >= 40;
      },
      choices: [
        {
          text: "🧘 调整心态",
          hint: "心智+5,心情+5,置_e695Calm",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e695StressCd = true;
            st.flags._e695Calm = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 钱可以慢慢赚,心态先稳住。心智+5,心情+5。", "success");
            }
          }
        },
        {
          text: "💪 加倍努力",
          hint: "管理XP+4,置_e695Grind",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e695StressCd = true;
            st.flags._e695Grind = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 压力就是动力,加油干!管理XP+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        return "存款只剩¥" + cash + "——'钱到用时方恨少,没钱的日子真不好过。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
