/**
 * 域F(UI/UX) 联动增强 R293
 * 第五轮循环——UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   F→B  ui_event_timeline          事件→时间线UI（事件/叙事·历史可视化）
 *   F→E  ui_finance_dashboard       财务→仪表盘（经济·数据可视化）
 *   F→D  ui_social_network_map      社交→关系图谱（NPC/社交·网络可视化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR293Loaded) return;
  RANDOM_EVENTS._domainFLinkageR293Loaded = true;

  var EVENTS = [
    {
      id: "ui_event_timeline",
      phase: "street",
      _isChainEvent: false,
      icon: "📅",
      title: "事件时间线UI",
      story: "你打开人生事件时间线，看到自己这些年经历的所有事件——从第一个工作到第一次搬家，从第一次赚到¥100到第一次投资成功。\n\n这些事件在时间线上排列成一条清晰的轨迹，让你直观地看到自己的成长历程。\n\n「时间线让模糊的记忆变成清晰的历史。」",
      triggers: { minDay: 300, excludeFlags: ["_uiEventTimelineSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 50;
      },
      choices: [
        {
          text: "📅 整理成可视化时间线",
          hint: "心情+10，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiEventTimelineSeen = true;
            st.flags._eventTimelineUI = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📅 你整理了事件时间线。时间线让记忆变成历史。心情+10，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 不用整理，记住就好",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiEventTimelineSeen = true;
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
    {
      id: "ui_finance_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "财务仪表盘",
      story: "你打开财务仪表盘，看到自己的收支曲线、资产分布、负债结构。\n\n这些数字和图表让你第一次看清了自己的财务状况——哪里在赚钱、哪里在烧钱、哪里可以优化。\n\n「你不理财，财不理你」从口号变成了可执行的计划。",
      triggers: { minDay: 200, excludeFlags: ["_uiFinanceDashSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return total >= 20000;
      },
      choices: [
        {
          text: "📊 设置财务预警",
          hint: "心智+7，置财务面板flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiFinanceDashSeen = true;
            st.flags._financeDashboard = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了财务仪表盘。数据让理财更科学。心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 大概看看就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiFinanceDashSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得大概看看就行。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_social_network_map",
      phase: "street",
      _isChainEvent: false,
      icon: "🕸️",
      title: "社交关系图谱",
      story: "你打开社交关系图谱，看到自己认识的NPC之间的关系网络——谁和谁关系好、谁和谁有矛盾、谁是关键节点。\n\n这些关系在图谱上可视化，让你发现了一些以前没注意到的社交结构。你开始理解，社交不是点对点的连线，而是一张复杂的网。",
      triggers: { minDay: 250, excludeFlags: ["_uiSocialMapSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var metNpcs = 0;
        for (var id in st.relationships) if (st.relationships[id] && st.relationships[id].met) metNpcs++;
        return metNpcs >= 6;
      },
      choices: [
        {
          text: "🕸️ 整理成关系图谱",
          hint: "心智+7，解锁社交图谱flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiSocialMapSeen = true;
            st.flags._socialNetworkMapUI = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🕸️ 你整理了社交关系图谱。关系是张网，你是网上的节点。心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 不用整理，心里有数",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiSocialMapSeen = true;
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
