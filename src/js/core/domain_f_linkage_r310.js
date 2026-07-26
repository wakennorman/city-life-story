/**
 * 域F(UI/UX) 联动增强 R310
 * 第七轮循环——UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   F→A  ui_data_dashboard_v2         数据→仪表盘（数据/数值·信息中枢）
 *   F→E  ui_investment_tracker_v2     投资→追踪器（经济·数据驱动）
 *   F→D  ui_social_map_v2             社交→关系图（NPC/社交·网络可视化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR310Loaded) return;
  RANDOM_EVENTS._domainFLinkageR310Loaded = true;

  var EVENTS = [
    {
      id: "ui_data_dashboard_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "数据仪表盘v2",
      story: "你打开数据仪表盘，看到自己这些年的关键指标——工作天数、收入增长、健康趋势、社交密度、技能水平。\n\n这些数字和图表，是你在这座城市存在过的证据。每一条曲线、每一个百分比，都是一段真实经历的浓缩。\n\n你开始用数据「驾驶」自己的人生，而不是随波逐流。",
      triggers: { minDay: 400, excludeFlags: ["_uiDataDashV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 400;
      },
      choices: [
        {
          text: "📊 设置数据预警",
          hint: "心智+10，置数据中枢flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiDataDashV2Seen = true;
            st.flags._dataHubV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了数据仪表盘。数据让人生有方向。心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用设置，随遇而安",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiDataDashV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得随遇而安就好。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_investment_tracker_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "投资追踪器v2",
      story: "你打开投资追踪器，看到股票、基金、房产、比特币等各类资产的实时收益和风险评估。\n\n这些数据和图表，让你的投资决策更加理性。你不再凭感觉买卖，而是用数据说话。\n\n你发现，「追踪」本身就是一种纪律。",
      triggers: { minDay: 300, excludeFlags: ["_uiInvTrackerV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var inv = st.investment;
        var types = 0;
        if (inv.stockHoldings && inv.stockHoldings.length > 0) types++;
        if ((inv.btcHoldings || 0) > 0) types++;
        if (inv.properties && inv.properties.length > 0) types++;
        return types >= 2;
      },
      choices: [
        {
          text: "📈 设置投资提醒",
          hint: "心智+8，置投资追踪flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiInvTrackerV2Seen = true;
            st.flags._investmentTrackerV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你设置了投资追踪器。追踪就是纪律。心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 不用那么复杂",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiInvTrackerV2Seen = true;
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
      id: "ui_social_map_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🕸️",
      title: "社交关系图谱v2",
      story: "你打开社交关系图谱，看到自己认识的NPC之间的关系网络——谁和谁关系好、谁和谁有矛盾、谁是关键节点。\n\n这些关系在图谱上可视化，让你发现了一些以前没注意到的社交结构。你开始理解，社交不是点对点的连线，而是一张复杂的网。",
      triggers: { minDay: 350, excludeFlags: ["_uiSocialMapV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var metNpcs = 0;
        for (var id in st.relationships) if (st.relationships[id] && st.relationships[id].met) metNpcs++;
        return metNpcs >= 7;
      },
      choices: [
        {
          text: "🕸️ 整理成关系图谱",
          hint: "心智+8，解锁社交图谱flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiSocialMapV2Seen = true;
            st.flags._socialNetworkMapV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🕸️ 你整理了社交关系图谱。关系是张网，你是网上的节点。心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 不用整理，心里有数",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiSocialMapV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用整理。心智+3。", "info");
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
