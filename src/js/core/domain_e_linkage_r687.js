/**
 * 域E(经济/投资) 联动增强 R687
 * 桥接：
 *   E→B  e687_invest_story_narrative   投资故事叙事 → 消费 state.investment+state.flags,
 *     投资经历成为人生故事
 *   E→F  e687_portfolio_snapshot       投资组合快照 → 消费 state.investment,
 *     定期投资复盘与可视化
 *   E→G  e687_wealth_life_reflection   财富人生反思 → 消费 state.resources+state.needs,
 *     财富积累后的人生思考
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR687Loaded) return;
  RANDOM_EVENTS._domainELinkageR687Loaded = true;

  function hasInvestment(st) {
    if (!st || !st.investment) return false;
    return (st.investment.stockHoldings && st.investment.stockHoldings.length > 0) ||
           (st.investment.btcHoldings && st.investment.btcHoldings > 0) ||
           (st.investment.properties && st.investment.properties.length > 0);
  }

  var EVENTS = [
    {
      id: "e687_invest_story_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "投资故事",
      story: "每一段投资经历都值得被记录",
      triggers: { minDay: 100, interval: 120, maxRepeats: 2, excludeFlags: ["_e687StoryCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e687StoryCd) return false;
        return hasInvestment(st) && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "📝 写下投资日记",
          hint: "会计XP+5,心智+3,置_e687Diary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e687StoryCd = true;
            st.flags._e687Diary = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 好记性不如烂笔头,投资日记是最好的复盘。会计XP+5,心智+3。", "success");
            }
          }
        },
        {
          text: "🤫 记在心里",
          hint: "智力+4,置_e687Memory",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e687StoryCd = true;
            st.flags._e687Memory = true;
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
      id: "e687_portfolio_snapshot",
      phase: "street",
      _isChainEvent: false,
      icon: "📸",
      title: "投资组合快照",
      story: "定期复盘是投资的好习惯",
      triggers: { minDay: 90, interval: 90, maxRepeats: 3, excludeFlags: ["_e687SnapCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e687SnapCd) return false;
        return hasInvestment(st) && st.player && st.player.day >= 90;
      },
      choices: [
        {
          text: "📊 详细复盘",
          hint: "会计XP+6,智力+3,置_e687Review",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e687SnapCd = true;
            st.flags._e687Review = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 复盘是进步的阶梯。会计XP+6,智力+3。", "success");
            }
          }
        },
        {
          text: "⚡ 快速扫一眼",
          hint: "智力+2,置_e687Glance",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e687SnapCd = true;
            st.flags._e687Glance = true;
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
      id: "e687_wealth_life_reflection",
      phase: "street",
      _isChainEvent: false,
      icon: "🤔",
      title: "财富与人生的反思",
      story: "有钱之后,你开始思考人生的意义",
      triggers: { minDay: 200, interval: 180, maxRepeats: 2, excludeFlags: ["_e687ReflectCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e687ReflectCd) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        return cash >= 50000 && st.player && st.player.day >= 200;
      },
      choices: [
        {
          text: "🌟 追求更大目标",
          hint: "管理XP+5,智力+3,置_e687Vision",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e687ReflectCd = true;
            st.flags._e687Vision = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌟 财富是手段,不是目的。管理XP+5,智力+3。", "success");
            }
          }
        },
        {
          text: "😊 享受当下",
          hint: "心情+10,心智+4,置_e687Enjoy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e687ReflectCd = true;
            st.flags._e687Enjoy = true;
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
        return "存款突破五万,你突然觉得——'钱是赚不完的,但时间不会等你。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
