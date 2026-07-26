/**
 * 域A(数据/数值平衡) 联动增强 R304
 * 第七轮循环——数据积累的多维回响。
 * 桥接：
 *   A→B  data_event_correlation       数据→事件关联（事件/叙事·数据驱动叙事）
 *   A→D  data_npc_behavior_pattern   数据→NPC行为模式（NPC/社交·数据洞察）
 *   A→G  data_health_lifestyle        数据→健康生活方式（核心机制·精准健康）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR304Loaded) return;
  RANDOM_EVENTS._domainALinkageR304Loaded = true;

  var EVENTS = [
    {
      id: "data_event_correlation",
      phase: "street",
      _isChainEvent: false,
      icon: "🔗",
      title: "数据与事件的关联",
      story: "你开始分析自己的行为数据与经历事件之间的关联——什么时候最容易遇到好事？什么时候最容易遭遇挫折？\n\n这些分析让你发现了一些有趣的规律：某些行为模式总是伴随着某些类型的事件。你开始用数据「预测」未来，而不是被动等待。",
      triggers: { minDay: 300, excludeFlags: ["_dataEventCorrSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.actionFreq) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 40;
      },
      choices: [
        {
          text: "🔗 用数据预测未来",
          hint: "心智+9，置预测flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataEventCorrSeen = true;
            st.flags._dataDrivenPrediction = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔗 你用数据预测未来。数据让选择更主动。心智+9。", "success");
            }
          },
        },
        {
          text: "🤷 未来不可预测",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataEventCorrSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得未来不可预测。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "data_npc_behavior_pattern",
      phase: "street",
      _isChainEvent: false,
      icon: "👥",
      title: "NPC行为模式的数据洞察",
      story: "你开始分析已结识NPC的行为模式——什么时候在场、什么时候互动、什么时候给出好处。\n\n这些洞察让你发现了一些有趣的规律：某些NPC在特定时段更容易互动，某些类型的礼物效果更好。你开始用数据「理解」NPC，而不是凭感觉。",
      triggers: { minDay: 250, excludeFlags: ["_dataNpcPatternSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var highNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 40) highNpcs++;
        }
        return highNpcs >= 3;
      },
      choices: [
        {
          text: "👥 用数据理解NPC",
          hint: "心智+8，NPC好感+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataNpcPatternSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 40) {
                  applyAffinityChange(st, id, 3, "数据洞察");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👥 你用数据理解NPC。数据让社交更精准。心智+8，好感+3。", "success");
            }
          },
        },
        {
          text: "🤷 凭直觉就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataNpcPatternSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭直觉就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "data_health_lifestyle",
      phase: "street",
      _isChainEvent: false,
      icon: "💪",
      title: "数据驱动的健康生活",
      story: "你开始用数据设计自己的健康生活方式——追踪睡眠、运动、饮食对心情和工作的影响。\n\n这些分析让你发现了一些精确的规律：某种运动时间让你睡得更好，某种饮食结构让你工作时更专注。你开始用数据「定制」自己的健康生活。",
      triggers: { minDay: 200, excludeFlags: ["_dataHealthLifestyleSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.status || !st.needs || !st.stats) return false;
        return (st.stats.actionFreq && (st.stats.actionFreq.exercise || 0) >= 6);
      },
      choices: [
        {
          text: "💪 定制数据驱动的健康方案",
          hint: "健康+12，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataHealthLifestyleSeen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💪 你定制了数据驱动的健康方案。数据让健康更精准。健康+12，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 健康生活不用那么精确",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataHealthLifestyleSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得健康生活不用那么精确。心智+3。", "info");
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
