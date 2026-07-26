/**
 * 域E(经济/投资) 联动增强 R367
 * 第十四轮循环——投资积累的多维回响。
 * 桥接：
 *   E→B  investment_narrative_v3     投资→叙事（事件/叙事·财富故事）
 *   E→D  investment_social_v4        投资→社交（NPC/社交·投资圈）
 *   E→G  investment_life_v3          投资→人生（核心机制·财务自由）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR367Loaded) return;
  RANDOM_EVENTS._domainELinkageR367Loaded = true;

  var EVENTS = [
    {
      id: "investment_narrative_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "投资的故事",
      story: "你回顾自己的投资经历，发现每一笔投资背后都有一个故事——\n\n第一次买股票时的紧张、第一次赚到钱时的兴奋、第一次亏损时的失落、第一次抄底成功时的得意……\n\n这些经历不仅是投资记录，也是你在城市中成长的见证。\n\n「投资不仅仅是数字的游戏，更是人性的修炼。」",
      triggers: { minDay: 60, excludeFlags: ["_investmentNarrativeV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.investment && (st.investment.stockHoldings || st.investment.btcHoldings));
      },
      choices: [
        {
          text: "📖 记录投资故事",
          hint: "心智+5，心情+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentNarrativeV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你记录了投资故事。投资不仅仅是数字的游戏，更是人性的修炼。心智+5，心情+5。", "success");
            }
          },
        },
        {
          text: "📈 继续关注市场",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentNarrativeV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你继续关注市场。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "investment_social_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "投资圈的朋友",
      story: "你在投资过程中认识了一些志同道合的朋友。\n\n大家聚在一起，聊聊市场、聊聊机会、聊聊各自的投资哲学。\n\n你发现，投资圈的朋友不仅带来信息，也带来了不同视角的思考方式。\n\n「投资路上，有同行者，就不会孤单。」",
      triggers: { minDay: 90, excludeFlags: ["_investmentSocialV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.investment && (st.investment.stockHoldings || st.investment.btcHoldings));
      },
      choices: [
        {
          text: "🤝 加入投资圈子",
          hint: "心智+5，投资信心+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentSocialV4Seen = true;
            st.flags._investmentCircleJoined = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你加入了投资圈子。投资路上有同行者就不孤单。心智+5。", "success");
            }
          },
        },
        {
          text: "📚 自己研究就好",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentSocialV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📚 你决定自己研究。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "investment_life_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "🏡",
      title: "投资让生活更好",
      story: "你看着自己的投资账户，想起这些钱能做什么——\n\n可以换一个好一点的房子、可以给家人更好的生活、可以去做一些一直想做但不敢做的事。\n\n投资的目的不是钱本身，而是钱能带来的自由和选择。\n\n「财务自由不是终点，而是通向更好生活的门票。」",
      triggers: { minDay: 120, excludeFlags: ["_investmentLifeV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var total = (st.resources && st.resources.cash || 0) + (st.resources && st.resources.bankBalance || 0);
        return total >= 50000;
      },
      choices: [
        {
          text: "🏡 规划财务自由之路",
          hint: "心智+6，心情+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentLifeV3Seen = true;
            st.flags._financialFreedomPlan = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏡 你规划了财务自由之路。财务自由是通向更好生活的门票。心智+6，心情+8。", "success");
            }
          },
        },
        {
          text: "💰 继续积累",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentLifeV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你继续积累。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();