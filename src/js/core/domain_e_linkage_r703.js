/**
 * 域E(经济/投资) 联动增强 R703
 * 桥接：
 *   E→B  e703_investment_narrative     投资叙事 → 消费 state.investment+state.flags,
 *     投资经历成为人生故事
 *   E→F  e703_portfolio_dashboard      投资组合仪表盘 → 消费 state.investment,
 *     投资组合可视化
 *   E→G  e703_wealth_happiness         财富与幸福 → 消费 state.resources+state.needs,
 *     财富积累后的幸福感反思
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR703Loaded) return;
  RANDOM_EVENTS._domainELinkageR703Loaded = true;

  function hasInvestment(st) {
    if (!st || !st.investment) return false;
    return (st.investment.stockHoldings && st.investment.stockHoldings.length > 0) ||
           (st.investment.btcHoldings && st.investment.btcHoldings > 0) ||
           (st.investment.properties && st.investment.properties.length > 0);
  }

  var EVENTS = [
    {
      id: "e703_investment_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "投资故事",
      story: "每一段投资经历都值得被记录",
      triggers: { minDay: 90, interval: 100, maxRepeats: 2, excludeFlags: ["_e703NarrCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e703NarrCd) return false;
        return hasInvestment(st) && st.player && st.player.day >= 90;
      },
      choices: [
        {
          text: "📝 写投资日记",
          hint: "会计XP+5,心智+3,置_e703Diary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e703NarrCd = true;
            st.flags._e703Diary = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 好记性不如烂笔头,投资日记是最好的复盘。会计XP+5,心智+3。", "success");
            }
          }
        },
        {
          text: "🤫 记在心里",
          hint: "智力+4,置_e703Memory",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e703NarrCd = true;
            st.flags._e703Memory = true;
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
      id: "e703_portfolio_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资组合仪表盘",
      story: "你的投资组合一目了然",
      triggers: { minDay: 80, interval: 90, maxRepeats: 3, excludeFlags: ["_e703DashCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e703DashCd) return false;
        return hasInvestment(st) && st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "📈 详细复盘",
          hint: "会计XP+6,智力+3,置_e703Review",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e703DashCd = true;
            st.flags._e703Review = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 复盘是进步的阶梯。会计XP+6,智力+3。", "success");
            }
          }
        },
        {
          text: "⚡ 快速扫一眼",
          hint: "智力+2,置_e703Glance",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e703DashCd = true;
            st.flags._e703Glance = true;
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
      id: "e703_wealth_happiness",
      phase: "street",
      _isChainEvent: false,
      icon: "😊",
      title: "财富与幸福",
      story: "有钱之后,你开始思考幸福的意义",
      triggers: { minDay: 150, interval: 180, maxRepeats: 2, excludeFlags: ["_e703HappyCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e703HappyCd) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        return cash >= 30000 && st.player && st.player.day >= 150;
      },
      choices: [
        {
          text: "🌟 追求更大目标",
          hint: "管理XP+5,智力+3,置_e703Vision",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e703HappyCd = true;
            st.flags._e703Vision = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌟 财富是手段,不是目的。管理XP+5,智力+3。", "success");
            }
          }
        },
        {
          text: "😊 享受当下",
          hint: "心情+10,心智+4,置_e703Enjoy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e703HappyCd = true;
            st.flags._e703Enjoy = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 幸福不是拥有很多,而是懂得珍惜。心情+10,心智+4。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "存款突破三万,你突然觉得——'钱是赚不完的,但时间不会等你。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
