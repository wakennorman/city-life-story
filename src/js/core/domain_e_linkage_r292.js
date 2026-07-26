/**
 * 域E(经济/投资) 联动增强 R292
 * 第五轮循环——投资积累的多维回响。
 * 桥接：
 *   E→H  investment_company_boost   投资→公司助力（公司·资本反哺）
 *   E→G  investment_life_quality     投资→生活品质（核心机制·恩格尔系数）
 *   E→B  investment_life_chapter    投资→人生章节（事件/叙事·财富故事）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR292Loaded) return;
  RANDOM_EVENTS._domainELinkageR292Loaded = true;

  function calcTotalInvValueE292(st) {
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
      id: "investment_company_boost",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🚀",
      title: "投资助力公司发展",
      story: "你发现，投资积累的经验和资本开始反哺公司。\n\n投资眼光让你能识别有潜力的供应商，财务分析让你能优化公司现金流，风险管理让你能规避经营风险。\n\n你开始理解，「投资思维」和「经营思维」是相通的。",
      triggers: { minDay: 300, excludeFlags: ["_invCompanyBoostSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.startup || !st.startup.company) return false;
        return calcTotalInvValueE292(st) >= 50000;
      },
      choices: [
        {
          text: "🚀 把投资经验用于公司经营",
          hint: "公司声誉+8，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCompanyBoostSeen = true;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 8;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🚀 你把投资经验用于公司经营。投资思维和经营思维是相通的。声誉+8，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 投资归投资，经营归经营",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCompanyBoostSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得投资和经营应该分开。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "investment_life_quality",
      phase: "street",
      _isChainEvent: false,
      icon: "🏠",
      title: "投资收益改善生活品质",
      story: "你的投资收益开始稳定覆盖一部分日常开销。你不再为每一分钱斤斤计较，开始有了「闲钱」——不是很多，但足够让你偶尔犒劳自己。\n\n你第一次感受到「钱生钱」的复利效应。这不是暴富，但是一种持续的、稳定的改善。\n\n你开始理解「财务自由」的雏形：不是有很多钱，而是钱为你工作。",
      triggers: { minDay: 250, excludeFlags: ["_invLifeQualitySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.needs) return false;
        return calcTotalInvValueE292(st) >= 40000 && (st.investment.dailyInvIncome || 0) > 0;
      },
      choices: [
        {
          text: "🏠 用投资收益改善生活",
          hint: "心情+12，现金-3000",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeQualitySeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 3000);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏠 你用投资收益改善生活。钱为你工作，而不是你为钱工作。心情+12。", "success");
            }
          },
        },
        {
          text: "📈 继续复投，延迟满足",
          hint: "心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeQualitySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你选择继续复投。延迟满足是投资者最重要的品质。心智+5。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "investment_life_chapter",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "投资是人生的一章",
      story: "你回顾自己的投资历程——第一次买股票的紧张，第一次亏损的心跳，第一次盈利的狂喜，第一次长期持有的耐心。\n\n这些经历不仅是财务记录，也是你人生故事的一部分。它们教会了你风险、耐心、纪律、和对自己决策的负责。\n\n你开始理解，投资不仅是赚钱，也是一种人生修行。",
      triggers: { minDay: 300, excludeFlags: ["_invLifeChapterSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        return calcTotalInvValueE292(st) >= 60000;
      },
      choices: [
        {
          text: "📖 写下投资人生故事",
          hint: "心情+10，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeChapterSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了投资人生故事。投资是人生修行。心情+10，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，赚钱就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeChapterSeen = true;
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
