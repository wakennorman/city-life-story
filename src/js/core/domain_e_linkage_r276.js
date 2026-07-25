/**
 * 域E(经济/投资) 联动增强 R276
 * 第三轮循环——投资积累的多维回响。
 * 桥接：
 *   E→B  investment_narrative       投资故事→叙事事件（事件/叙事·投资人生）
 *   E→F  investment_dashboard_ui    投资数据→UI面板（UI/UX·信息展示）
 *   E→G  investment_life_balance     投资与生活平衡（核心机制·身心健康）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR276Loaded) return;
  RANDOM_EVENTS._domainELinkageR276Loaded = true;

  function calcTotalInvValueE276(st) {
    if (!st || !st.investment) return 0;
    var inv = st.investment;
    var total = (inv.cash || 0) + (inv.bankBalance || 0);
    if (inv.stockHoldings) {
      for (var i = 0; i < inv.stockHoldings.length; i++) {
        total += (inv.stockHoldings[i].shares || 0) * (inv.stockHoldings[i].currentPrice || inv.stockHoldings[i].avgPrice || 0);
      }
    }
    total += (inv.btcHoldings || 0) * (inv.btcPrice || 0);
    if (inv.properties) {
      for (var j = 0; j < inv.properties.length; j++) {
        total += inv.properties[j].currentPrice || inv.properties[j].buyPrice || 0;
      }
    }
    return total;
  }

  var EVENTS = [
    {
      id: "investment_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "投资人生故事",
      story: "你开始回顾自己的投资历程——第一次买股票的紧张，第一次亏损的心跳，第一次盈利的狂喜。\n\n这些经历不仅是财务记录，更是你人生故事的一部分。每一个决定、每一次选择，都塑造了今天的你。\n\n你决定把这些故事写下来，不是为了炫耀，而是为了在未来的某一天，当你迷茫时，可以翻回这些页面，告诉自己：「我已经走过了这么远。」",
      triggers: { minDay: 200, excludeFlags: ["_invNarrativeSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var totalInv = calcTotalInvValueE276(st);
        if (totalInv < 10000) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 15;
      },
      choices: [
        {
          text: "📖 写下投资故事",
          hint: "心情+8，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invNarrativeSeen = true;
            st.flags._investmentJournalKeeper = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了投资人生故事。经历是比收益更珍贵的资产。心情+8，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，赚钱就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invNarrativeSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得赚钱比记录重要。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "investment_dashboard_ui",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资数据面板",
      story: "你开始用APP追踪自己的投资组合——股票、基金、房产、比特币，每一项都有详细的收益曲线和风险评估。\n\n这些数据和图表，让你的投资决策更加理性。你不再凭感觉买卖，而是用数据说话。\n\n你第一次感受到「信息对称」的力量。",
      triggers: { minDay: 150, excludeFlags: ["_invDashboardSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var inv = st.investment;
        var types = 0;
        if (inv.stockHoldings && inv.stockHoldings.length > 0) types++;
        if ((inv.btcHoldings || 0) > 0) types++;
        if (inv.properties && inv.properties.length > 0) types++;
        return types >= 2;
      },
      choices: [
        {
          text: "📊 设置投资提醒",
          hint: "心智+6，解锁投资面板flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invDashboardSeen = true;
            st.flags._investmentDashboardUI = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了投资数据面板。信息就是力量。心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 不用那么复杂",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invDashboardSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用那么复杂。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "investment_life_balance",
      phase: "street",
      _isChainEvent: false,
      icon: "⚖️",
      title: "投资与生活的平衡",
      story: "你发现，过度关注投资开始影响你的生活——每天盯盘、焦虑涨跌、忽略了身边的人和事。\n\n你开始思考：投资的目的是什么？是为了更好的生活，还是成了生活的全部？\n\n你决定设定一个「投资时间上限」，把更多的时间留给生活本身。",
      triggers: { minDay: 250, excludeFlags: ["_invLifeBalanceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.needs || !st.status) return false;
        var totalInv = calcTotalInvValueE276(st);
        if (totalInv < 20000) return false;
        return (st.needs.happiness || 50) < 45 || (st.status.health || 100) < 55;
      },
      choices: [
        {
          text: "⚖️ 设定投资时间上限",
          hint: "心情+10，健康+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeBalanceSeen = true;
            st.flags._investmentTimeLimit = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("⚖️ 你设定了投资时间上限。投资是为了更好的生活，而不是生活的全部。心情+10，健康+5。", "success");
            }
          },
        },
        {
          text: "🤷 投资就是生活的一部分",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeBalanceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得投资就是生活的一部分。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
