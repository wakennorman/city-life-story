/**
 * 域B(事件/叙事) 联动增强 R297
 * 第六轮循环——叙事积累的多维回响。
 * 桥接：
 *   B→G  event_life_milestone_marker  事件→人生里程碑标记（核心机制·峰终定律）
 *   B→A  event_economic_pattern       事件→经济模式（数据/数值·信息沉淀）
 *   B→D  event_social_resonance       事件→社交共鸣（NPC/社交·情感连接）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR297Loaded) return;
  RANDOM_EVENTS._domainBLinkageR297Loaded = true;

  var EVENTS = [
    {
      id: "event_life_milestone_marker",
      phase: "street",
      _isChainEvent: false,
      icon: "🏅",
      title: "人生里程碑标记",
      story: "今天，你经历了一件值得记住的事——也许是第一次赚到¥1000，也许是第一次被老板表扬，也许是第一次在深夜觉得自己长大了。\n\n你拿出手机，把这个里程碑标记在时间线上。不是为了炫耀，而是为了在未来的某一天，当你怀疑自己时，可以翻回这一页，告诉自己：「我已经走了这么远。」",
      triggers: { minDay: 200, excludeFlags: ["_eventLifeMilestoneMarkerSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 25;
      },
      choices: [
        {
          text: "🏅 标记这个里程碑",
          hint: "心情+10，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeMilestoneMarkerSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏅 你标记了人生里程碑。每一个值得被记住的瞬间，都是你存在的证明。心情+10，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 不用标记，心里记得就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeMilestoneMarkerSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用标记。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "event_economic_pattern",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "事件中的经济模式",
      story: "你开始分析自己经历的事件与经济状况的关系——某些事件总是伴随着收入增长，某些事件总是导致支出增加。\n\n这些规律让你发现了一些有趣的经济模式：某些类型的事件是「赚钱机会」，某些类型的事件是「花钱陷阱」。\n\n你开始用数据理解事件的经济影响，而不是用感觉。",
      triggers: { minDay: 250, excludeFlags: ["_eventEconPatternSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 30 && (st.resources.cash || 0) >= 5000;
      },
      choices: [
        {
          text: "📊 分析事件的经济模式",
          hint: "心智+8，置经济模式flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventEconPatternSeen = true;
            st.flags._eventEconomicPattern = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你分析了事件的经济模式。数据让决策更理性。心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 事件是随机的不需要分析",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventEconPatternSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得事件是随机的。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "event_social_resonance",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "事件的社交共鸣",
      story: "你发现，和已结识的NPC聊起共同经历的事件，能迅速拉近彼此的距离。\n\n「你也经历过这种事？」「原来你也是这么过来的。」共同经历是社交的催化剂，让陌生人变成朋友，让朋友变成挚友。\n\n你开始主动和NPC分享自己的故事，也倾听TA们的故事。",
      triggers: { minDay: 180, excludeFlags: ["_eventSocialResonanceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var highNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 30) highNpcs++;
        }
        return highNpcs >= 2;
      },
      choices: [
        {
          text: "🤝 和NPC分享你的故事",
          hint: "NPC好感+5，心情+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventSocialResonanceSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 30) {
                  applyAffinityChange(st, id, 5, "故事分享");
                }
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你和NPC分享了你的故事。共同经历是社交的催化剂。好感+5，心情+8。", "success");
            }
          },
        },
        {
          text: "🤫 故事不用分享，自己知道就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventSocialResonanceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你觉得故事不用分享。心智+3。", "info");
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
