/**
 * 域H(Phase2/公司) 联动增强 R273
 * 公司运营的多维回响——公司不仅是赚钱机器，还在社交/经济/UI层面留下痕迹。
 * 桥接：
 *   H→A  company_data_dashboard   公司数据→数值面板（数据/数值·经营可视化）
 *   H→E  company_exit_strategy     公司退出→个人投资（经济·资本传承）
 *   H→F  company_brand_wall       公司品牌→成就墙UI（UI/UX·品牌展示）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR273Loaded) return;
  RANDOM_EVENTS._domainHLinkageR273Loaded = true;

  var EVENTS = [
    {
      id: "company_data_dashboard",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司经营仪表盘",
      story: "你打开公司的数据仪表盘，看到营收、利润、现金流、团队效率等关键指标。\n\n这些数字是你创业多年积累的成果。每一个百分比，都是团队一起拼出来的。\n\n你开始用数据驱动决策，不再凭感觉拍脑袋。",
      triggers: { minDay: 180, excludeFlags: ["_companyDashboardSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) > 0 || (st.startup.company.valuation || 0) > 50000;
      },
      choices: [
        {
          text: "📊 深入分析经营数据",
          hint: "心智+7，解锁经营面板flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyDashboardSeen = true;
            st.flags._companyDataDashboard = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你深入分析了经营数据。数据驱动决策，是成熟企业的标志。心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 大概看看就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyDashboardSeen = true;
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
      id: "company_exit_strategy",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🚀",
      title: "退出策略",
      story: "你开始思考公司的未来——是继续做大，还是适时退出？\n\n「上市、被收购、传给下一代……」每一种选择都有不同的代价和回报。\n\n你意识到，创业不是为了永远经营，而是为了在合适的时候收获。",
      triggers: { minDay: 300, excludeFlags: ["_companyExitSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.valuation || 0) >= 200000;
      },
      choices: [
        {
          text: "🚀 开始规划退出策略",
          hint: "心智+8，置投资意识flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyExitSeen = true;
            st.flags._dataInvestorMindset = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🚀 你开始规划退出策略。知道什么时候退出，和知道什么时候进入一样重要。心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 继续经营，不想退出",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyExitSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你选择继续经营。创业是一场没有终点的旅程。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
    {
      id: "company_brand_wall",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏆",
      title: "公司品牌墙",
      story: "你开始整理公司的品牌资产——LOGO、口号、产品截图、媒体报道。\n\n这些素材不仅是公司的门面，更是你创业多年的心血凝聚。\n\n你决定把它们整理成一面「品牌墙」，让每一个加入公司的人都能感受到这份沉淀。",
      triggers: { minDay: 200, excludeFlags: ["_companyBrandWallSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.reputation || 0) >= 30;
      },
      choices: [
        {
          text: "🏆 整理成品牌墙",
          hint: "公司声誉+5，心情+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyBrandWallSeen = true;
            st.flags._companyBrandWall = true;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏆 你整理了公司品牌墙。品牌是时间沉淀的结果。声誉+5，心情+8。", "success");
            }
          },
        },
        {
          text: "🤷 品牌不用刻意经营",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyBrandWallSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得品牌不用刻意经营。心智+3。", "info");
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
