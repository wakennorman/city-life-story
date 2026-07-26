/**
 * 域E(经济/投资) 联动增强 R383
 * 第十六轮循环——投资积累的多维回响。
 * 桥接：
 *   E→F  investment_ui_v2            投资→UIv2（UI/UX·投资可视化）
 *   E→G  investment_life_v4          投资→人生v4（核心机制·财务自由）
 *   E→D  investment_social_v5        投资→社交v5（NPC/社交·投资圈）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR383Loaded) return;
  RANDOM_EVENTS._domainELinkageR383Loaded = true;

  var EVENTS = [
    {
      id: "investment_ui_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资仪表盘",
      story: "你建立了一个投资仪表盘，把所有投资信息集中在一个界面上。\n\n收益曲线、风险指标、持仓比例、市场趋势……一目了然。\n\n好的工具让你事半功倍，投资也是一样。\n\n「投资工具不是用来预测未来的，而是用来理解现在的。」",
      triggers: { minDay: 60, excludeFlags: ["_investmentUiV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.investment && (st.investment.stockHoldings || st.investment.btcHoldings));
      },
      choices: [
        {
          text: "📊 建立投资仪表盘",
          hint: "心智+5，投资工具flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentUiV2Seen = true;
            st.flags._investmentDashboardBuilt = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你建立了投资仪表盘。工具不是用来预测未来的，而是用来理解现在的。心智+5。", "success");
            }
          },
        },
        {
          text: "📈 相信直觉",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentUiV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你相信直觉。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "investment_life_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "🏡",
      title: "投资改变生活",
      story: "你的投资收益开始改变你的生活品质。\n\n你可以住更好的房子、吃更好的食物、有更多的时间做自己喜欢的事。\n\n你发现，投资的终极目的不是钱本身，而是钱带来的选择权。\n\n「财务自由不是终点，而是选择权的起点。」",
      triggers: { minDay: 120, excludeFlags: ["_investmentLifeV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var total = (st.resources && st.resources.cash || 0) + (st.resources && st.resources.bankBalance || 0);
        return total >= 50000;
      },
      choices: [
        {
          text: "🏡 享受投资成果",
          hint: "心智+5，心情+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentLifeV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏡 你享受了投资成果。财务自由是选择权的起点。心智+5，心情+10。", "success");
            }
          },
        },
        {
          text: "💰 继续投资",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentLifeV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你继续投资。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "investment_social_v5",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "投资者的社交圈",
      story: "你在投资圈里认识了一些有趣的人。\n\n有经验丰富的老手，有初出茅庐的新人，有专注技术的分析师，有擅长宏观的策略师。\n\n每个人都有自己的投资哲学，而你从每个人身上都学到了东西。\n\n「投资圈的价值，不在于你认识谁，而在于你能从谁身上学到什么。」",
      triggers: { minDay: 90, excludeFlags: ["_investmentSocialV5Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.investment && (st.investment.stockHoldings || st.investment.btcHoldings));
      },
      choices: [
        {
          text: "🤝 拓展投资社交圈",
          hint: "心智+5，投资圈flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentSocialV5Seen = true;
            st.flags._investorNetworkJoined = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你拓展了投资社交圈。投资圈的价值在于你能从谁身上学到什么。心智+5。", "success");
            }
          },
        },
        {
          text: "📚 自己研究",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentSocialV5Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📚 你自己研究。心智+2。", "info");
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