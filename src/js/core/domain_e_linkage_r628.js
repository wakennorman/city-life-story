/**
 * 域E(经济/投资) 联动增强 R628
 * 桥接：
 *   E→F  e628_invest_portfolio_ui  投资组合UI提示 → 消费 state.investment+state.stock 数据,
 *     经济→"投资组合一目了然"UI回响
 *   E→D  e628_market_news_social  市场消息社交 → 消费 state.stockMarket+state.relationships 数据,
 *     经济→"市场消息"社交回响
 *   E→G  e628_financial_planning  财务规划人生 → 消费 state.resources+state.player 数据,
 *     经济→"财务健康度"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR628Loaded) return;
  RANDOM_EVENTS._domainELinkageR628Loaded = true;

  // 辅助：获取已结识NPC列表
  function metNpcsR628(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0 });
    }
    return out;
  }

  var EVENTS = [
    // ================================================================
    // E→F: 投资组合UI提示 — 投资组合表现概览
    // ================================================================
    {
      id: "e628_invest_portfolio_ui",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资组合月报",
      triggers: { minDay: 15 },
      story: function (st) {
        var stocks = st.stockMarket || {};
        var stockCount = 0;
        var totalValue = 0;
        var totalCost = 0;
        for (var sym in stocks) {
          var s = stocks[sym];
          if (s && s.shares > 0) {
            stockCount++;
            totalValue += (s.shares || 0) * (s.currentPrice || 0);
            totalCost += (s.shares || 0) * (s.avgPrice || 0);
          }
        }
        var investTotal = (st.investment && st.investment.totalValue) || 0;
        var totalPortfolio = totalValue + investTotal;
        var cash = st.resources && st.resources.cash || 0;
        var bank = st.resources && st.resources.bankBalance || 0;
        var totalAssets = totalPortfolio + cash + bank;

        if (stockCount === 0 && investTotal === 0) {
          return "你目前还没有任何投资。把闲钱放在银行虽然安全，但跑不赢通胀。" +
            "建议从学习投资知识开始，逐步建立自己的投资组合。";
        }
        var pl = totalValue - totalCost;
        var plPct = totalCost > 0 ? Math.round((pl / totalCost) * 100) : 0;
        var plIcon = pl >= 0 ? "📈" : "📉";
        var plColor = pl >= 0 ? "var(--success)" : "var(--danger)";

        return "【投资组合月报】" + plIcon + "<br>" +
          "持有股票 " + stockCount + " 只，市值 ¥" + totalValue.toLocaleString() +
          (totalCost > 0 ? "（成本 ¥" + totalCost.toLocaleString() + "，<span style=\"color:" + plColor + "\">" + (pl >= 0 ? "+" : "") + pl + "元/" + plPct + "%</span>）" : "") + "<br>" +
          (investTotal > 0 ? "基金/理财 ¥" + investTotal.toLocaleString() + "<br>" : "") +
          "总资产 ¥" + totalAssets.toLocaleString() + "（含现金¥" + cash.toLocaleString() + "）<br>" +
          (totalAssets >= 100000 ? "🎉 资产已过10万，继续坚持！" :
           totalAssets >= 50000 ? "💪 资产稳步增长，保持节奏。" :
           totalAssets >= 10000 ? "🌱 投资刚刚起步，持续学习最重要。" :
           "📚 积累本金是投资的第一步，继续努力。");
      },
      choices: [
        { text: "📈 查看持仓", apply: function(st) {
          if (typeof showStockTab === "function") showStockTab();
          else StateManager.addMessage("📈 前往「投资」Tab查看持仓详情", "info");
        }},
        { text: "💰 查看资产", apply: function(st) {
          StateManager.addMessage("💰 总资产 ¥" + ((st.resources && (st.resources.cash || 0) + (st.resources.bankBalance || 0)) || 0).toLocaleString(), "info");
        }},
      ],
      conditions: function (st) {
        return (st.stockMarket && Object.keys(st.stockMarket).length > 0) || (st.investment && st.investment.totalValue > 0);
      },
      weight: 1,
    },

    // ================================================================
    // E→D: 市场消息社交 — 投资市场消息成为社交话题
    // ================================================================
    {
      id: "e628_market_news_social",
      phase: "street",
      _isChainEvent: false,
      icon: "📰",
      title: "市场消息",
      triggers: { minDay: 12 },
      story: function (st) {
        var npcs = metNpcsR628(st);
        if (npcs.length === 0) return "市场最近有些波动，但你没找到可以聊这些的人。多认识些朋友，交流市场信息也是投资的一部分。";
        var highAff = 0;
        for (var i = 0; i < npcs.length; i++) {
          if (npcs[i].affinity >= 40) highAff++;
        }
        var hasStock = false;
        var sm = st.stockMarket;
        if (sm) {
          for (var sym in sm) {
            if (sm[sym] && sm[sym].shares > 0) { hasStock = true; break; }
          }
        }
        if (highAff >= 2 && hasStock) {
          return "最近市场不太平静，你身边有" + highAff + "位关系不错的朋友也在关注。" +
            "朋友们聚在一起聊起股市走向、行业新闻，气氛热烈。" +
            "交流市场信息不仅能拓宽视野，还能帮你发现一些自己没注意到的机会。";
        } else if (hasStock) {
          return "你持有了股票，但身边能聊投资的朋友不多。" +
            "试着和关系好的朋友聊聊市场，说不定能碰撞出新的想法。";
        }
        return "你的朋友们偶尔会聊起经济形势和市场变化。" +
          "虽然大家都不太专业，但集思广益总比一个人瞎琢磨强。";
      },
      choices: [
        { text: "💬 聊聊市场", apply: function(st) {
          st.flags = st.flags || {};
          st.flags._e628_marketChat = (st.flags._e628_marketChat || 0) + 1;
          if (st.skills && st.skills.accounting) {
            st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 5;
          }
          StateManager.addMessage("💬 和朋友聊市场动态，会计经验+5", "success");
        }},
        { text: "📊 自己研究", apply: function(st) {
          StateManager.addMessage("📊 你决定自己研究市场数据，不依赖别人的观点", "info");
        }},
      ],
      conditions: function (st) {
        var npcs = metNpcsR628(st);
        return npcs.length >= 1;
      },
      weight: 1,
    },

    // ================================================================
    // E→G: 财务规划人生 — 财务健康度评估
    // ================================================================
    {
      id: "e628_financial_planning",
      phase: "street",
      _isChainEvent: false,
      icon: "💎",
      title: "财务健康检查",
      triggers: { minDay: 20 },
      story: function (st) {
        var cash = st.resources && st.resources.cash || 0;
        var bank = st.resources && st.resources.bankBalance || 0;
        var debt = st.resources && st.resources.debt || 0;
        var totalAssets = cash + bank;
        var day = st.player && st.player.day || 1;
        var dailyIncome = st.resources && st.resources.totalEarned ? Math.round((st.resources.totalEarned || 0) / Math.max(1, day)) : 0;

        if (debt > 0) {
          return "⚠️ 你目前有 ¥" + debt.toLocaleString() + " 负债。总资产 ¥" + totalAssets.toLocaleString() + "。" +
            "负债会持续产生利息，建议优先偿还高息债务。" +
            "可以考虑制定一个还款计划，比如每月固定还一部分。";
        }
        if (totalAssets < 1000) {
          return "你的财务状况比较紧张，总资产仅 ¥" + totalAssets.toLocaleString() + "。" +
            "建议先通过工作赚取稳定收入，控制日常开支，逐步积累应急储备金。" +
            "目标是存够3-6个月的生活费作为安全垫。";
        }
        if (totalAssets >= 100000) {
          return "🎉 你的总资产已达 ¥" + totalAssets.toLocaleString() + "！日均收入 ¥" + dailyIncome + "。" +
            "财务状况良好，可以考虑更进取的投资策略。" +
            "但别忘了保持适当的现金储备，应对突发情况。";
        }
        return "你的总资产 ¥" + totalAssets.toLocaleString() + "，日均收入 ¥" + dailyIncome + "。" +
          (totalAssets >= 30000 ? "财务状况稳健，可以考虑适当增加投资比例。" :
           totalAssets >= 10000 ? "财务状况正在改善，继续积累本金。" :
           "继续努力工作和储蓄，财务状况会逐步好转。");
      },
      choices: [
        { text: "📋 制定预算", apply: function(st) {
          st.flags = st.flags || {};
          st.flags._e628_budgetPlan = (st.flags._e628_budgetPlan || 0) + 1;
          if (st.skills && st.skills.accounting) {
            st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 8;
          }
          StateManager.addMessage("📋 制定了月度预算计划，会计经验+8", "success");
        }},
        { text: "💪 继续攒钱", apply: function(st) {
          StateManager.addMessage("💪 你决定继续保持节俭，加快储蓄速度", "info");
        }},
      ],
      conditions: function (st) {
        return st.resources && (st.resources.cash > 0 || st.resources.totalEarned > 0);
      },
      weight: 1,
    },
  ];

  // 注册事件
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();