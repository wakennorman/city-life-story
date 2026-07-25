/**
 * 域E(经济/投资) 联动增强 R262
 * 投资积累的多维回响——投资不仅是数字，还在UI/身心/自我认知层面留下痕迹。
 * 桥接：
 *   E→F  investment_dashboard      多类投资→组合面板UI（UI/UX信息展示）
 *   E→G  financial_stress         投资亏损→心情/健康受损（核心机制·心理账户）
 *   E→E  investment_milestone     投资组合达标→自我肯定（经济·峰终定律）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR262Loaded) return;
  RANDOM_EVENTS._domainELinkageR262Loaded = true;

  function calcPortfolioValueE262(st) {
    if (!st || !st.investment) return 0;
    var inv = st.investment;
    var total = 0;
    if (inv.stockHoldings && inv.stockHoldings.length > 0) {
      for (var i = 0; i < inv.stockHoldings.length; i++) {
        var h = inv.stockHoldings[i];
        total += (h.shares || 0) * (h.avgPrice || 0);
      }
    }
    total += (inv.btcHoldings || 0) * (inv.btcPrice || 0);
    if (inv.properties && inv.properties.length > 0) {
      for (var j = 0; j < inv.properties.length; j++) {
        total += inv.properties[j].currentPrice || inv.properties[j].buyPrice || 0;
      }
    }
    if (inv.cars && inv.cars.length > 0) {
      for (var k = 0; k < inv.cars.length; k++) {
        total += inv.cars[k].currentPrice || inv.cars[k].buyPrice || 0;
      }
    }
    return total;
  }

  var EVENTS = [
    {
      id: "investment_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资组合面板",
      story: "你打开投资APP，看到自己这些年的投资组合——股票、比特币、房产、汽车，每一项都有涨有跌。\n\n这些数字和图表，是你在这座城市奋斗的另一种见证。每一个百分比，都是一次选择的结果。",
      triggers: { minDay: 120, excludeFlags: ["_invDashboardSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var inv = st.investment;
        var types = 0;
        if (inv.stockHoldings && inv.stockHoldings.length > 0) types++;
        if ((inv.btcHoldings || 0) > 0) types++;
        if (inv.properties && inv.properties.length > 0) types++;
        if (inv.cars && inv.cars.length > 0) types++;
        return types >= 2;
      },
      choices: [
        {
          text: "📊 截个图保存",
          hint: "心情+5，解锁投资面板flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invDashboardSeen = true;
            st.flags._investmentDashboard = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你截下了投资组合面板。这些数字，是你一点一滴攒出来的。心情+5。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续盯盘",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invDashboardSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用形式化，继续盯盘。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "financial_stress",
      phase: "street",
      _isChainEvent: false,
      icon: "😰",
      title: "投资焦虑",
      story: "最近投资不太顺利，账户里的数字一天比一天少。\n\n你开始失眠，开始怀疑自己的选择。每次打开APP，心跳都会加速——不是期待涨，而是害怕又跌了。\n\n投资考验的不是判断力，是心态。这个道理，你以前不懂，现在开始懂了。",
      triggers: { minDay: 90, excludeFlags: ["_financialStressSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.needs || !st.status) return false;
        var portfolioValue = calcPortfolioValueE262(st);
        if (portfolioValue < 5000) return false;
        var happiness = st.needs.happiness || 50;
        var health = st.status.health || 100;
        return happiness < 40 || health < 50;
      },
      choices: [
        {
          text: "🧘 暂时不看账户，调整心态",
          hint: "心情+8，健康+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._financialStressSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧘 你决定暂时不看账户。数字重要，但身体更重要。心情+8，健康+5。", "success");
            }
          },
        },
        {
          text: "💊 吃片安眠药继续盯",
          hint: "健康-3，心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._financialStressSeen = true;
            if (st.status) st.status.health = Math.max(0, (st.status.health || 50) - 3);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💊 你咬牙扛住了。但身体记住了这一次。健康-3，心智+3。", "warning");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
    {
      id: "investment_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "🏆",
      title: "投资里程碑",
      story: "你打开账户，看到投资组合的总值达到了一个你以前想都不敢想的数字。\n\n这不是终点，但值得停下来看看自己走了多远。从一个口袋里揣着几百块来到这座城市的人，到现在有了一笔不小的投资。\n\n你值得为自己骄傲。",
      triggers: { minDay: 150, excludeFlags: ["_invMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var portfolioValue = calcPortfolioValueE262(st);
        return portfolioValue >= 50000;
      },
      choices: [
        {
          text: "🏆 给自己一个小奖励",
          hint: "心情+10，现金-500",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invMilestoneSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏆 你给自己买了一份小奖励。这是你投资路上的第一个里程碑。心情+10。", "success");
            }
          },
        },
        {
          text: "📈 继续投资，让钱生钱",
          hint: "心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invMilestoneSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你选择继续投资。让钱生钱，这是最好的庆祝方式。心智+5。", "info");
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
