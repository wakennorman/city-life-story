/**
 * 域F(UI/UX) 联动增强 R368
 * 第十四轮循环——UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   F→B  ui_event_journal_v5          事件→日记v5（事件/叙事·个人记录）
 *   F→E  ui_investment_tracker_v4     投资→追踪器v4（经济·数据驱动）
 *   F→H  ui_company_dashboard_v5      公司→仪表盘v5（公司·经营可视化）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR368Loaded) return;
  RANDOM_EVENTS._domainFLinkageR368Loaded = true;

  var EVENTS = [
    {
      id: "ui_event_journal_v5",
      phase: "street",
      _isChainEvent: false,
      icon: "📔",
      title: "日记·城市记忆",
      story: "你翻开日记本，里面记录着你在城市中的点点滴滴。\n\n每一页都是你生活的痕迹——第一次租房的忐忑、第一次加班的疲惫、第一次和陌生人成为朋友的温暖。\n\n这些文字串联起来，就是你在城市中的生命轨迹。\n\n「日记不是为了记住过去，而是为了不忘记自己为什么出发。」",
      triggers: { minDay: 20, excludeFlags: ["_uiEventJournalV5Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 5;
      },
      choices: [
        {
          text: "📔 写下今天的城市记忆",
          hint: "心智+5，心情+5，记录习惯",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiEventJournalV5Seen = true;
            st.flags._cityMemoryJournal = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📔 你写下了今天的城市记忆。日记不是为了记住过去，而是为了不忘记自己为什么出发。心智+5，心情+5。", "success");
            }
          },
        },
        {
          text: "📱 拍张照记录",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiEventJournalV5Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📱 你拍了张照。一张照片就是一个故事。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_investment_tracker_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "投资追踪器",
      story: "你打开投资追踪工具，看着自己的投资组合变化。\n\n收益曲线、风险分布、持仓比例、市场趋势……这些数据让你对自己的投资状况一目了然。\n\n你发现，好的工具不仅是记录数据，更是帮你做出更好的决策。",
      triggers: { minDay: 60, excludeFlags: ["_uiInvestmentTrackerV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.investment && (st.investment.stockHoldings || st.investment.btcHoldings));
      },
      choices: [
        {
          text: "📈 优化投资追踪工具",
          hint: "心智+5，投资决策更清晰",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiInvestmentTrackerV4Seen = true;
            st.flags._investmentTrackerOptimized = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你优化了投资追踪工具。好的工具帮你做出更好的决策。心智+5。", "success");
            }
          },
        },
        {
          text: "📊 看看就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiInvestmentTrackerV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你看了看数据。心里有数就好。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_company_dashboard_v5",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "公司经营看板",
      story: "你坐在办公室里，面前的屏幕上显示着公司的经营看板。\n\n收入趋势、成本结构、团队效率、客户满意度……所有关键指标一目了然。\n\n你发现，经营一家公司就像是驾驶一艘船，而数据就是你的仪表盘。\n\n「没有数据的决策，就像闭着眼睛开车。」",
      triggers: { minDay: 90, excludeFlags: ["_uiCompanyDashboardV5Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.startup && st.startup.company);
      },
      choices: [
        {
          text: "🏢 完善经营看板",
          hint: "心智+5，运营效率+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCompanyDashboardV5Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.startup && st.startup.company) {
              st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏢 你完善了经营看板。没有数据的决策就像闭着眼睛开车。心智+5，声誉+5。", "success");
            }
          },
        },
        {
          text: "📋 看报表就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCompanyDashboardV5Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你看报表就行。心里有数。心智+2。", "info");
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