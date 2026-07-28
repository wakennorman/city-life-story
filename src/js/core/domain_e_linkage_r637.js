/**
 * 域E(经济/投资) 联动增强 R637
 * 桥接：
 *   E→A  e637_invest_data_diary  投资数据日记 → 消费 state.investment+state.stockMarket 数据,
 *     经济→"投资数据说话"数据回响
 *   E→D  e637_wealth_social_signal  财富社交信号 → 消费 state.resources+state.relationships 数据,
 *     经济→"财富改变社交"社交回响
 *   E→G  e637_financial_independence  财务独立觉醒 → 消费 state.resources+state.player 数据,
 *     经济→"财务自由之路"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR637Loaded) return;
  RANDOM_EVENTS._domainELinkageR637Loaded = true;

  // 辅助：获取已结识NPC列表
  function metNpcsR637(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0 });
    }
    return out;
  }

  var EVENTS = [
    // ================================================================
    // E→A: 投资数据日记 — 投资记录回顾
    // ================================================================
    {
      id: "e637_invest_data_diary",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资日记",
      triggers: { minDay: 12 },
      story: function (st) {
        var stocks = st.stockMarket || {};
        var stockCount = 0;
        var totalPl = 0;
        var totalInvested = 0;
        for (var sym in stocks) {
          var s = stocks[sym];
          if (s && s.shares > 0) {
            stockCount++;
            totalInvested += (s.shares || 0) * (s.avgPrice || 0);
            totalPl += ((s.currentPrice || 0) - (s.avgPrice || 0)) * (s.shares || 0);
          }
        }
        if (stockCount === 0) {
          return "你还没有开始投资。投资是让钱生钱的最好方式，即使从小额开始，也比把钱放在银行里强。" +
            "建议先从学习基础知识开始，逐步建立自己的投资组合。";
        }
        var plPct = totalInvested > 0 ? Math.round((totalPl / totalInvested) * 100) : 0;
        var plIcon = totalPl >= 0 ? "📈" : "📉";
        var lesson = totalPl >= 0 ? "你的投资策略总体有效，继续保持。" : "市场有起有落，亏损是学习的一部分。";

        return "【投资日记】" + plIcon + "<br>" +
          "持有" + stockCount + "只股票，总投入¥" + totalInvested.toLocaleString() + "<br>" +
          "浮动盈亏：" + (totalPl >= 0 ? "+" : "") + totalPl.toLocaleString() + "元（" + plPct + "%）<br>" +
          lesson + "<br>" +
          "投资是一场长跑，记录每一次操作，复盘每一次决策，才能不断进步。";
      },
      choices: [
        { text: "📝 记录心得", apply: function(st) {
          st.flags = st.flags || {};
          st.flags._e637_investDiary = (st.flags._e637_investDiary || 0) + 1;
          if (st.skills && st.skills.accounting) {
            st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 5;
          }
          StateManager.addMessage("📝 记录了投资心得，会计经验+5", "success");
        }},
        { text: "📈 继续持有", apply: function(st) {
          StateManager.addMessage("📈 你决定按兵不动，继续观察市场走势", "info");
        }},
      ],
      conditions: function (st) {
        var sm = st.stockMarket;
        if (!sm) return false;
        for (var sym in sm) {
          if (sm[sym] && sm[sym].shares > 0) return true;
        }
        return false;
      },
      weight: 1,
    },

    // ================================================================
    // E→D: 财富社交信号 — 财富水平影响社交感知
    // ================================================================
    {
      id: "e637_wealth_social_signal",
      phase: "street",
      _isChainEvent: false,
      icon: "💎",
      title: "财富与社交",
      triggers: { minDay: 15 },
      story: function (st) {
        var npcs = metNpcsR637(st);
        if (npcs.length === 0) return "你还没有朋友可以分享你的成就。财富不只是数字，它也是你能力和努力的证明。";
        var cash = st.resources && st.resources.cash || 0;
        var bank = st.resources && st.resources.bankBalance || 0;
        var totalWealth = cash + bank;
        var highAff = 0;
        for (var i = 0; i < npcs.length; i++) { if (npcs[i].affinity >= 40) highAff++; }

        if (totalWealth >= 100000 && highAff >= 2) {
          return "你的资产已超过¥100,000，身边有" + highAff + "位关系不错的朋友。" +
            "财富的增长让你的社交圈也发生了变化——朋友们更愿意听取你的建议，" +
            "你也更有底气在社交场合表达自己的观点。但记住，真正的朋友看重的是你这个人，而不是你的钱包。";
        } else if (totalWealth >= 30000) {
          return "你的财务状况正在改善（总资产¥" + totalWealth.toLocaleString() + "），" +
            "身边有" + highAff + "位关系不错的朋友。" +
            "经济基础决定上层建筑——当你的财务状况好转，你在社交中也更加自信。";
        }
        return "你的财务状况一般（总资产¥" + totalWealth.toLocaleString() + "）。" +
          "虽然金钱不是万能的，但足够的经济基础确实能让你在社交中更有底气。" +
          "继续努力提升收入，财务状况会逐步改善。";
      },
      choices: [
        { text: "💰 查看资产", apply: function(st) {
          StateManager.addMessage("💰 总资产 ¥" + ((st.resources && ((st.resources.cash || 0) + (st.resources.bankBalance || 0))) || 0).toLocaleString(), "info");
        }},
        { text: "🤝 关心朋友", apply: function(st) {
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage("🤝 无论贫富，真诚的朋友才是最大的财富，心情+3", "info");
        }},
      ],
      conditions: function (st) {
        var npcs = metNpcsR637(st);
        return npcs.length >= 1;
      },
      weight: 1,
    },

    // ================================================================
    // E→G: 财务独立觉醒 — 被动收入与财务自由
    // ================================================================
    {
      id: "e637_financial_independence",
      phase: "street",
      _isChainEvent: false,
      icon: "🕊️",
      title: "财务自由之路",
      triggers: { minDay: 25 },
      story: function (st) {
        var cash = st.resources && st.resources.cash || 0;
        var bank = st.resources && st.resources.bankBalance || 0;
        var totalWealth = cash + bank;
        var day = st.player && st.player.day || 1;
        var totalEarned = st.resources && st.resources.totalEarned || 0;
        var dailyIncome = Math.round(totalEarned / Math.max(1, day));
        var passiveIncome = 0;
        var stocks = st.stockMarket;
        if (stocks) {
          for (var sym in stocks) {
            var s = stocks[sym];
            if (s && s.shares > 0) {
              passiveIncome += (s.shares || 0) * (s.currentPrice || 0) * 0.002; // 估算股息
            }
          }
        }
        var investVal = (st.investment && st.investment.totalValue) || 0;
        passiveIncome += investVal * 0.005;

        if (totalWealth >= 50000 && passiveIncome >= 50) {
          return "你的总资产¥" + totalWealth.toLocaleString() + "，日均收入¥" + dailyIncome + "，" +
            "被动收入约¥" + Math.round(passiveIncome) + "/天。" +
            "被动收入已经开始为你工作了！虽然距离完全覆盖日常开支还有距离，但这是一个好的开始。" +
            "继续积累资产，让被动收入逐步替代主动收入，才是财务自由的真正含义。";
        } else if (totalWealth >= 10000) {
          return "你的总资产¥" + totalWealth.toLocaleString() + "，日均收入¥" + dailyIncome + "。" +
            "你的财务状况正在向好的方向发展。当被动收入能够覆盖基本生活开支时，" +
            "你就迈出了财务自由的第一步。" +
            "建议继续增加投资，提高被动收入占比。";
        }
        return "你的总资产¥" + totalWealth.toLocaleString() + "，日均收入¥" + dailyIncome + "。" +
          "财务自由的第一步是积累足够的本金。" +
          "建议先通过工作提高主动收入，同时学习投资知识，为未来的被动收入打基础。";
      },
      choices: [
        { text: "📈 增加投资", apply: function(st) {
          StateManager.addMessage("📈 你决定增加投资金额，加快资产积累速度", "info");
        }},
        { text: "📚 学习理财", apply: function(st) {
          if (st.skills && st.skills.accounting) {
            st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 10;
          }
          StateManager.addMessage("📚 花时间学习理财知识，会计经验+10", "success");
        }},
      ],
      conditions: function (st) {
        return st.resources && (st.resources.totalEarned > 0 || (st.resources.cash || 0) > 0);
      },
      weight: 1,
    },
  ];

  // 注册事件
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();