/**
 * 域F(UI/UX) 联动增强 R285
 * 第四轮循环——UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   F→C  ui_career_milestone_display  职业里程碑→UI展示（职业/成长·成就可视化）
 *   F→E  ui_investment_tracker         投资追踪→经济意识（经济·数据驱动）
 *   F→G  ui_health_tracker             健康追踪→健康自觉（核心机制·预防医学）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR285Loaded) return;
  RANDOM_EVENTS._domainFLinkageR285Loaded = true;

  var EVENTS = [
    {
      id: "ui_career_milestone_display",
      phase: "street",
      _isChainEvent: false,
      icon: "🏆",
      title: "职业里程碑展示",
      story: "你打开职业页面，看到自己这些年的职业里程碑——第一次入职、第一次晋升、第一次拿到奖金。\n\n这些里程碑不仅是回忆，也是你职业成长的见证。每一个节点，都是一段故事的浓缩。\n\n你决定把这些里程碑整理成一面「职业成就墙」，让每一次努力都被看见。",
      triggers: { minDay: 180, excludeFlags: ["_uiCareerMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 180;
      },
      choices: [
        {
          text: "🏆 整理成职业成就墙",
          hint: "心情+8，心智+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCareerMilestoneSeen = true;
            st.flags._careerMilestoneWall = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏆 你整理了职业成就墙。让每一次努力都被看见。心情+8，心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 不用展示，自己知道就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCareerMilestoneSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用展示。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_investment_tracker",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资追踪器",
      story: "你开始用APP追踪自己的投资组合——股票、基金、比特币，每一项都有详细的收益曲线和风险评估。\n\n这些数据和图表，让你的投资决策更加理性。你不再凭感觉买卖，而是用数据说话。\n\n你发现，「追踪」本身就是一种纪律。",
      triggers: { minDay: 150, excludeFlags: ["_uiInvTrackerSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var inv = st.investment;
        var types = 0;
        if (inv.stockHoldings && inv.stockHoldings.length > 0) types++;
        if ((inv.btcHoldings || 0) > 0) types++;
        if (inv.properties && inv.properties.length > 0) types++;
        return types >= 1;
      },
      choices: [
        {
          text: "📊 设置投资追踪提醒",
          hint: "心智+6，置投资追踪flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiInvTrackerSeen = true;
            st.flags._investmentTracker = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了投资追踪器。追踪就是纪律。心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 不用那么复杂",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiInvTrackerSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用那么复杂。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_health_tracker",
      phase: "street",
      _isChainEvent: false,
      icon: "❤️",
      title: "健康追踪器",
      story: "你开始用APP追踪自己的健康数据——睡眠、运动、饮食、心情。这些数据变成了一张张清晰的图表。\n\n你第一次直观地看到自己的健康趋势——什么时候状态好、什么时候在透支。数据让你更早发现问题，更早调整。\n\n「追踪」让你对自己的身体有了掌控感。",
      triggers: { minDay: 120, excludeFlags: ["_uiHealthTrackerSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.actionFreq) return false;
        return (st.stats.actionFreq.exercise || 0) >= 3;
      },
      choices: [
        {
          text: "❤️ 设置健康追踪提醒",
          hint: "健康+6，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiHealthTrackerSeen = true;
            st.flags._healthTracker = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 6);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("❤️ 你设置了健康追踪器。追踪让你对身体有掌控感。健康+6，心智+5。", "success");
            }
          },
        },
        {
          text: "🤷 不用那么复杂",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiHealthTrackerSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用那么复杂。心智+2。", "info");
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
