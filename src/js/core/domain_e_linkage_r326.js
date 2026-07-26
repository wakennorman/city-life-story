/**
 * 域E(经济/投资) 联动增强 R326
 * 第九轮循环——投资积累的多维回响。
 * 桥接：
 *   E→G  investment_life_balance      投资→生活平衡（核心机制·身心健康）
 *   E→A  investment_data_dashboard    投资→数据面板（数据/数值·信息展示）
 *   E→B  investment_narrative         投资→叙事（事件/叙事·财富故事）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR326Loaded) return;
  RANDOM_EVENTS._domainELinkageR326Loaded = true;

  function calcTotalInvValueE326(st) {
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
      id: "investment_life_balance",
      phase: "street",
      _isChainEvent: false,
      icon: "⚖️",
      title: "投资与生活的平衡",
      story: "你发现，过度关注投资开始影响你的生活——每天盯盘、焦虑涨跌、忽略了身边的人和事。\n\n你开始思考：投资的目的是什么？是为了更好的生活，还是成了生活的全部？\n\n你决定设定一个「投资时间上限」，把更多的时间留给生活本身。\n\n「投资是为了更好的生活，而不是生活的全部。」",
      triggers: { minDay: 400, excludeFlags: ["_invLifeBalanceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.needs || !st.status) return false;
        return calcTotalInvValueE326(st) >= 50000 && ((st.needs.happiness || 50) < 50 || (st.status.health || 100) < 60);
      },
      choices: [
        {
          text: "⚖️ 设定投资时间上限",
          hint: "心情+15，健康+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeBalanceSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("⚖️ 你设定了投资时间上限。投资是为了更好的生活。心情+15，健康+10。", "success");
            }
          },
        },
        {
          text: "💼 投资更重要，继续盯盘",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeBalanceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你选择继续盯盘。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "investment_data_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资数据面板",
      story: "你打开投资数据面板，看到股票、基金、房产、比特币等各类资产的实时收益和风险评估。\n\n这些数据和图表，让你的投资决策更加理性。你不再凭感觉买卖，而是用数据说话。\n\n你发现，「数据」本身就是一种纪律。",
      triggers: { minDay: 350, excludeFlags: ["_invDataDashSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        return calcTotalInvValueE326(st) >= 40000;
      },
      choices: [
        {
          text: "📊 设置投资预警",
          hint: "心智+9，置投资面板flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invDataDashSeen = true;
            st.flags._investmentDashboard = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了投资数据面板。数据让决策更理性。心智+9。", "success");
            }
          },
        },
        {
          text: "🤷 大概看看就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invDataDashSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得大概看看就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "investment_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "投资的叙事",
      story: "你开始把投资经历变成故事——不仅是冷冰冰的数字，而是有温度的叙事。\n\n「那一年，我因为贪心亏了三个月工资。」「那次，我坚持持有了一年终于回本。」\n\n这些故事不仅是回忆，也是你理解「风险」和「耐心」的方式。\n\n「数字是结果，故事是意义。」",
      triggers: { minDay: 450, excludeFlags: ["_invNarrativeSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        return calcTotalInvValueE326(st) >= 120000;
      },
      choices: [
        {
          text: "📖 写下投资故事",
          hint: "心情+12，心智+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invNarrativeSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了投资故事。数字是结果，故事是意义。心情+12，心智+10。", "success");
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
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
