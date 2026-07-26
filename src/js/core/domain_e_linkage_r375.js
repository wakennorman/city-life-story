/**
 * 域E(经济/投资) 联动增强 R375
 * 第十五轮循环——投资积累的多维回响。
 * 桥接：
 *   E→A  investment_data_v4         投资→数据v4（数据/数值·信息沉淀）
 *   E→C  investment_career_v5       投资→职业v5（职业/成长·知识复用）
 *   E→H  investment_company_v4      投资→公司v4（公司·资本反哺）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR375Loaded) return;
  RANDOM_EVENTS._domainELinkageR375Loaded = true;

  var EVENTS = [
    {
      id: "investment_data_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资数据分析",
      story: "你整理了自己的投资数据，发现有些规律——\n\n哪些类型的投资赚钱最多、哪些时间点买入最合适、你的投资风格偏向保守还是激进。\n\n这些数据让你更了解自己，也让你更了解市场。\n\n「投资数据不仅是历史记录，也是未来决策的指南针。」",
      triggers: { minDay: 60, excludeFlags: ["_investmentDataV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.investment && (st.investment.stockHoldings || st.investment.btcHoldings));
      },
      choices: [
        {
          text: "📊 分析投资数据",
          hint: "心智+5，投资洞察flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentDataV4Seen = true;
            st.flags._investmentDataDriven = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你分析了投资数据。数据是未来决策的指南针。心智+5。", "success");
            }
          },
        },
        {
          text: "📈 相信直觉",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentDataV4Seen = true;
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
      id: "investment_career_v5",
      phase: "street",
      _isChainEvent: false,
      icon: "💼",
      title: "投资的职业启发",
      story: "你发现，投资中学到的知识和技能，在工作中也很有用。\n\n风险管理让你在做项目决策时更谨慎，市场分析让你更懂行业趋势，长期主义让你在职业规划上更有耐心。\n\n「投资不只是赚钱，它也在塑造你的思维方式。」",
      triggers: { minDay: 90, excludeFlags: ["_investmentCareerV5Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.investment && (st.investment.stockHoldings || st.investment.btcHoldings));
      },
      choices: [
        {
          text: "💼 把投资思维用到工作中",
          hint: "心智+5，职业思维flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentCareerV5Seen = true;
            st.flags._investmentCareerMindset = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你把投资思维用到工作中。投资不只是赚钱，也在塑造你的思维方式。心智+5。", "success");
            }
          },
        },
        {
          text: "📝 分开看待",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentCareerV5Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你分开看待投资和工作。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "investment_company_v4",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "投资反哺公司",
      story: "你的投资收益为公司提供了额外的资金支持。\n\n不用融资、不用贷款，用自己的钱来发展公司，这种感觉很踏实。\n\n「最好的融资方式，就是用自己的盈利来投资。」",
      triggers: { minDay: 120, excludeFlags: ["_investmentCompanyV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.startup && st.startup.company);
      },
      choices: [
        {
          text: "🏢 用投资收益发展公司",
          hint: "心智+5，公司声誉+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentCompanyV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏢 你用投资收益发展公司。最好的融资方式是用自己的盈利来投资。心智+5，声誉+5。", "success");
            }
          },
        },
        {
          text: "💰 继续投资",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._investmentCompanyV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你继续投资。心智+2。", "info");
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