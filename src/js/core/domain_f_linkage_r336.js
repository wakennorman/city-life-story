/**
 * 域F(UI/UX) 联动增强 R336
 * 第十轮循环——UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   F→G  ui_life_command_v2         人生→指挥中心（核心机制·信息中枢）
 *   F→E  ui_investment_tracker_v3   投资→追踪器（经济·数据驱动）
 *   F→H  ui_company_dashboard_v3    公司→仪表盘（公司·经营可视化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR336Loaded) return;
  RANDOM_EVENTS._domainFLinkageR336Loaded = true;

  var EVENTS = [
    {
      id: "ui_life_command_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🎛️",
      title: "人生指挥中心v2",
      story: "你打开人生指挥中心，看到自己这些年的全方位关键指标——工作、收入、健康、社交、技能、投资、公司。\n\n这些数字和图表，是你在这座城市存在过的全方位证据。每一个指标都是一段真实经历的浓缩。\n\n你开始用数据「指挥」自己的人生，而不是随波逐流。",
      triggers: { minDay: 700, excludeFlags: ["_uiLifeCommandV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 700;
      },
      choices: [
        {
          text: "🎛️ 设置人生指挥中心",
          hint: "心智+14，置指挥中心flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiLifeCommandV2Seen = true;
            st.flags._lifeCommandCenterV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 14);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎛️ 你设置了人生指挥中心。数据让人生有方向。心智+14。", "success");
            }
          },
        },
        {
          text: "🤷 不用设置，随遇而安",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiLifeCommandV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得随遇而安就好。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_investment_tracker_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "投资追踪器v3",
      story: "你打开投资追踪器，看到股票、基金、房产、比特币等各类资产的实时收益和风险评估。\n\n这些数据和图表，让你的投资决策更加理性。你不再凭感觉买卖，而是用数据说话。\n\n你发现，「追踪」本身就是一种纪律。",
      triggers: { minDay: 500, excludeFlags: ["_uiInvTrackerV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var inv = st.investment;
        var types = 0;
        if (inv.stockHoldings && inv.stockHoldings.length > 0) types++;
        if ((inv.btcHoldings || 0) > 0) types++;
        if (inv.properties && inv.properties.length > 0) types++;
        return types >= 3;
      },
      choices: [
        {
          text: "📈 设置投资提醒",
          hint: "心智+10，置投资追踪flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiInvTrackerV3Seen = true;
            st.flags._investmentTrackerV3 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你设置了投资追踪器。追踪就是纪律。心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用那么复杂",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiInvTrackerV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用那么复杂。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_company_dashboard_v3",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司仪表盘v3",
      story: "你打开公司仪表盘，看到营收、利润、现金流、团队效率、市场份额等关键经营指标的实时数据。\n\n这些数字是你创业多年积累的成果。每一条上升的曲线，都是团队一起拼出来的。\n\n你开始用数据「驾驶」公司，而不是凭感觉。",
      triggers: { minDay: 500, excludeFlags: ["_uiCompanyDashV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 80000;
      },
      choices: [
        {
          text: "📊 设置经营预警系统",
          hint: "心智+11，公司声誉+9",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCompanyDashV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 11);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 9;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了公司仪表盘。数据让经营更精准。心智+11，声誉+9。", "success");
            }
          },
        },
        {
          text: "🤷 大概看看就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCompanyDashV3Seen = true;
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
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
