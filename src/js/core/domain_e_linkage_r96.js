/*
 * 城市浮生记 — 域E（经济/投资）联动增强 · R96
 * 全系统优化 loop R96 · 联动增强 2项
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR96) return;
  RANDOM_EVENTS._domainELinkageR96 = true;

  var E_EVENTS = [
    // ===== 联动1: E→C 投资收益职业觉醒 =====
    // 设计意图：投资盈利后触发职业觉醒叙事，连接经济系统与职业成长。
    {
      id: "investment_profit_career_awakening",
      title: "第一桶金的觉醒",
      desc: "看着账户里的投资收益，你突然意识到：钱生钱比人赚钱快得多。你开始重新思考自己的职业方向。",
      phase: "street",
      triggers: { minDay: 45 },
      conditions: function (st) {
        if (!st || !st.player || !st.investment || !st.flags) return false;
        if (st.flags._investmentCareerAwakeningSeen) return false;
        // 累计投资收益≥¥10000
        return (st.investment._totalInvestmentProfit || 0) >= 10000;
      },
      choices: [
        {
          text: "💰 继续加大投资，让钱生钱",
          apply: function (st) {
            if (st.flags) st.flags._investmentCareerAwakeningSeen = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
            if (st.flags) st.flags._investmentMindset = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你决定继续加大投资。钱生钱的感觉，让人上瘾。智力+3，心智+2。",
                "good"
              );
          },
        },
        {
          text: "🤔 用投资收益提升技能",
          apply: function (st) {
            if (st.flags) st.flags._investmentCareerAwakeningSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你决定用投资收益提升自己。技能才是最大的资本。心智+5。",
                "info"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 联动2: E→A 市场情绪数据感知 =====
    // 设计意图：玩家对市场情绪变化的感知，连接经济系统与数据平衡。
    {
      id: "market_sentiment_sense",
      title: "市场情绪的温度",
      desc: "你开始能感受到市场的情绪——什么时候乐观，什么时候恐慌。这种直觉来自长期的观察和体验。",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player || !st.investment || !st.flags) return false;
        if (st.flags._marketSentimentSeen) return false;
        // 持有至少1笔投资且总资产≥¥50000
        var hasInvestment = st.investment && st.investment.stockHoldings && st.investment.stockHoldings.length > 0;
        var totalAssets = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return hasInvestment && totalAssets >= 50000;
      },
      choices: [
        {
          text: "📈 跟着市场情绪走",
          apply: function (st) {
            if (st.flags) st.flags._marketSentimentSeen = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你学会了感受市场情绪。贪婪和恐惧，是最好的老师。智力+3。",
                "good"
              );
          },
        },
        {
          text: "🧘 保持冷静，不被情绪左右",
          apply: function (st) {
            if (st.flags) st.flags._marketSentimentSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你决定保持冷静。市场情绪是噪音，价值投资才是根本。心智+5。",
                "good"
              );
          },
        },
      ],
      probability: 0.03,
    },
  ];

  for (var i = 0; i < E_EVENTS.length; i++) {
    var evt = E_EVENTS[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions) evt.conditions = function () { return false; };
    RANDOM_EVENTS.push(evt);
  }
})();
