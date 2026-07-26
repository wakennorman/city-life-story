/**
 * 域E(经济/投资) 联动增强 R359
 * 第十三轮循环——投资积累的多维回响。
 * 桥接：
 *   E→F  investment_ui_insight       投资→UI洞察（UI/UX·投资可视化）
 *   E→H  investment_company_v3       投资→公司反哺（公司·资本变现）
 *   E→A  investment_data_v3          投资→数据沉淀（数据/数值·信息价值）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR359Loaded) return;
  RANDOM_EVENTS._domainELinkageR359Loaded = true;

  // 计算总投资组合价值
  function portfolioValue(st) {
    if (!st || !st.investment) return 0;
    var total = 0;
    // 股票持仓
    if (Array.isArray(st.investment.stockHoldings)) {
      for (var i = 0; i < st.investment.stockHoldings.length; i++) {
        var h = st.investment.stockHoldings[i];
        if (h) total += (h.shares || 0) * (h.currentPrice || h.purchasePrice || 0);
      }
    }
    // BTC
    total += (st.investment.btcHoldings || 0) * (st.investment.btcPrice || 0);
    return total;
  }

  var EVENTS = [
    {
      // E→F: 投资组合→UI洞察（UI/UX·投资可视化）
      id: "investment_ui_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "看懂你的投资",
      story: "你打开投资账户，看着那些起起伏伏的数字。以前你只知道看涨了还是跌了，但现在你开始看得更深入——\n\n哪些资产在为你赚钱，哪些在拖后腿，你的持仓是否过于集中，风险是否分散。\n\n「投资不是赌博，是认知的变现。」你开始用数据审视自己的投资策略。",
      triggers: { minDay: 60, excludeFlags: ["_investmentUiInsightSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要有投资组合价值≥5000
        if (portfolioValue(st) < 5000) return false;
        // 需要有至少2类投资（股票+BTC 或 多种股票）
        var types = 0;
        if (st.investment && Array.isArray(st.investment.stockHoldings) && st.investment.stockHoldings.length > 0) types++;
        if (st.investment && (st.investment.btcHoldings || 0) > 0) types++;
        return types >= 2;
      },
      choices: [
        {
          text: "📊 审视持仓，优化配置",
          hint: "心智+5，投资决策更清晰，flag投资洞察",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentUiInsightSeen = true;
            st.flags._investmentPortfolioOptimized = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你审视了自己的持仓，发现了一些优化的空间。投资是认知的变现。心智+5。", "success");
            }
          },
        },
        {
          text: "📈 继续持有，相信长期",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentUiInsightSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你选择继续持有。长期主义是最好的策略。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // E→H: 投资收益→公司反哺（公司·资本变现）
      id: "investment_company_v3",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏗️",
      title: "投资反哺公司",
      story: "你在公司的会议室里，看着财务报表。个人的投资收益为公司的扩张提供了额外的资本。\n\n「以前我是用劳动换钱，现在钱也在为我工作。」\n\n你决定把一部分投资收益注入公司，加速业务发展。",
      triggers: { minDay: 120, excludeFlags: ["_investmentCompanyV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要公司已成立
        if (!st.startup || !st.startup.company) return false;
        // 需要个人投资组合≥20000
        if (portfolioValue(st) < 20000) return false;
        return true;
      },
      choices: [
        {
          text: "🏗️ 注入资本，加速公司发展",
          hint: "公司声誉+8，发展加速，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentCompanyV3Seen = true;
            if (st.startup && st.startup.company) {
              st.startup.company.reputation = (st.startup.company.reputation || 0) + 8;
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏗️ 你把投资收益注入公司。钱在为你工作，公司也在成长。声誉+8，心智+5。", "success");
            }
          },
        },
        {
          text: "💰 保持独立，个人继续投资",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentCompanyV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你决定保持个人投资独立。鸡蛋不放在一个篮子里。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // E→A: 投资数据→数据沉淀（数据/数值·信息价值）
      id: "investment_data_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "📋",
      title: "投资数据的价值",
      story: "你整理了自己的投资记录，发现这些数据本身就很有价值——\n\n哪些时间点买入胜率高？哪些行业你的判断最准？你的投资行为有什么规律？\n\n你开始用数据「复盘」自己的投资决策，而不是凭印象总结经验。",
      triggers: { minDay: 90, excludeFlags: ["_investmentDataV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要有投资记录（至少交易过5次）
        var tradeCount = (st.flags && st.flags._investmentTradeCount) || 0;
        if (tradeCount < 5) return false;
        return true;
      },
      choices: [
        {
          text: "📋 整理投资日志，定期复盘",
          hint: "心智+6，投资经验值+5，flag投资复盘",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentDataV3Seen = true;
            st.flags._investmentReviewHabit = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            // 加投资经验（通过技能或flag）
            if (st.skills && st.skills.accounting && typeof addSkillXp === "function") {
              addSkillXp(st, "accounting", 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你建立了投资复盘习惯。数据是经验的沉淀，经验是直觉的来源。心智+6，会计经验+5。", "success");
            }
          },
        },
        {
          text: "🤷 凭感觉就行，不搞那么复杂",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentDataV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭感觉就行。简单也是一种策略。心智+2。", "info");
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