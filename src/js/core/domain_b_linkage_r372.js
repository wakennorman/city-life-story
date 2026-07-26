/**
 * 域B(事件/叙事) 联动增强 R372
 * 第十五轮循环——叙事积累的多维回响。
 * 桥接：
 *   B→D  event_npc_connection_v2    事件→NPC连接v2（NPC/社交·人际温度）
 *   B→E  event_economic_awareness    事件→经济意识（经济·理财觉醒）
 *   B→F  event_ui_timeline           事件→UI时间线（UI/UX·事件可视化）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR372Loaded) return;
  RANDOM_EVENTS._domainBLinkageR372Loaded = true;

  var EVENTS = [
    {
      id: "event_npc_connection_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💬",
      title: "一次深入的对话",
      story: "你和一个朋友坐在路边的小摊上，有一搭没一搭地聊着。\n\n从天气聊到工作，从工作聊到人生，从人生聊到那些平时不会说出口的话。\n\n你发现，有些话只有对特定的人才能说出口。\n\n「在这个城市里，能有一个可以深度对话的人，是一种奢侈。」",
      triggers: { minDay: 30, excludeFlags: ["_eventNpcConnectionV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        for (var id in st.relationships) {
          if (Object.prototype.hasOwnProperty.call(st.relationships, id)) {
            if (st.relationships[id] && st.relationships[id].met) return true;
          }
        }
        return false;
      },
      choices: [
        {
          text: "💬 敞开心扉聊天",
          hint: "心情+8，好感+5，心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventNpcConnectionV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💬 你们聊了很久。能有一个可以深度对话的人是一种奢侈。心情+8，心智+3。", "success");
            }
          },
        },
        {
          text: "☕ 安静地喝杯茶",
          hint: "心情+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventNpcConnectionV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("☕ 你们安静地喝茶。有些陪伴不需要言语。心情+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "event_economic_awareness",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "钱的概念",
      story: "你算了一笔账——每天的收入、支出、结余。\n\n不算不知道，一算吓一跳。那些你觉得不起眼的小开销，加起来竟然是一笔不小的数目。\n\n你开始意识到，理财不是有钱人的专利，而是每个在城市里生活的人必须掌握的技能。\n\n「你不理财，财不理你。」",
      triggers: { minDay: 20, excludeFlags: ["_eventEconomicAwarenessSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.player && st.player.day >= 20);
      },
      choices: [
        {
          text: "💰 开始记账理财",
          hint: "心智+5，理财意识flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventEconomicAwarenessSeen = true;
            st.flags._moneyManagementAware = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你开始记账理财。你不理财，财不理你。心智+5。", "success");
            }
          },
        },
        {
          text: "📱 心里有数就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventEconomicAwarenessSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📱 你心里有数就行。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "event_ui_timeline",
      phase: "street",
      _isChainEvent: false,
      icon: "📋",
      title: "时间线",
      story: "你回顾自己来到这座城市后的经历，发现可以画成一条时间线——\n\n第1天：抵达，陌生而兴奋\n第7天：找到第一份工作\n第30天：第一次发工资\n第60天：认识第一个好朋友\n第90天：第一次遇到困难\n……\n\n每一条时间线上，都有你的足迹。",
      triggers: { minDay: 30, excludeFlags: ["_eventUiTimelineSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 5;
      },
      choices: [
        {
          text: "📋 回顾自己的时间线",
          hint: "心智+5，心情+5，时间线flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventUiTimelineSeen = true;
            st.flags._lifeTimelineAware = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你回顾了自己的时间线。每一条时间线上都有你的足迹。心智+5，心情+5。", "success");
            }
          },
        },
        {
          text: "📝 继续向前走",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventUiTimelineSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你继续向前走。最好的时间线是未来。心智+2。", "info");
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