/**
 * 域D(NPC/社交) 联动增强 R342
 * 第十一轮循环——社交积累的多维回响。
 * 桥接：
 *   D→H  social_company_culture_v2   社交→公司文化（公司·人文温度）
 *   D→A  social_data_v3              社交→数据（数据/数值·关系分析）
 *   D→B  social_event_resonance_v2   社交→事件共鸣（事件/叙事·人物连接）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR342Loaded) return;
  RANDOM_EVENTS._domainDLinkageR342Loaded = true;

  function countHighNpcsD342(st, minAff) {
    minAff = minAff || 50;
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= minAff) count++;
    }
    return count;
  }

  var EVENTS = [
    {
      id: "social_company_culture_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏛️",
      title: "社交关系塑造公司文化v2",
      story: "你发现，公司的文化深受你个人社交风格的影响。\n\n如果你是一个热心的人，公司就会充满人情味；如果你是一个严谨的人，公司就会注重细节。你开始意识到，创始人就是公司文化的「源头」。\n\n你决定有意识地塑造一种「温暖而专业」的文化。",
      triggers: { minDay: 500, excludeFlags: ["_socialCompanyCultureV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return countHighNpcsD342(st, 60) >= 2;
      },
      choices: [
        {
          text: "🏛️ 有意识地塑造公司文化",
          hint: "心智+12，公司声誉+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCompanyCultureV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 10;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏛️ 你有意识地塑造公司文化。创始人就是公司文化的源头。心智+12，声誉+10。", "success");
            }
          },
        },
        {
          text: "🤷 文化不用刻意塑造",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCompanyCultureV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得文化不用刻意塑造。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
    {
      id: "social_data_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "社交数据v3",
      story: "你开始分析自己的社交网络数据——好感分布、互动频率、关系深度、互惠次数。\n\n这些数字让你发现了一些有趣的规律：某些NPC是「关键节点」，某些关系是「高价值投资」。\n\n你开始用数据「经营」人际关系，而不是凭感觉。",
      triggers: { minDay: 600, excludeFlags: ["_socialDataV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD342(st, 45) >= 6;
      },
      choices: [
        {
          text: "📊 用数据优化社交策略",
          hint: "心智+12，NPC好感+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataV3Seen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 45) {
                  applyAffinityChange(st, id, 6, "数据洞察");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据优化社交策略。数据让社交更精准。心智+12，好感+6。", "success");
            }
          },
        },
        {
          text: "🤷 凭直觉就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataV3Seen = true;
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
      id: "social_event_resonance_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "社交是事件的共鸣v2",
      story: "你发现，和已结识NPC聊起共同经历的事件，能迅速拉近彼此的距离。\n\n「你也经历过这种事？」「原来你也是这么过来的。」共同经历是社交的催化剂，让陌生人变成朋友，让朋友变成挚友。\n\n你开始主动和NPC分享自己的故事，也倾听TA们的故事。",
      triggers: { minDay: 550, excludeFlags: ["_socialEventResonanceV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD342(st, 35) >= 4;
      },
      choices: [
        {
          text: "🤝 和NPC分享你的故事",
          hint: "NPC好感+8，心情+15",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEventResonanceV2Seen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 35) {
                  applyAffinityChange(st, id, 8, "故事分享");
                }
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你和NPC分享了你的故事。共同经历是社交的催化剂。好感+8，心情+15。", "success");
            }
          },
        },
        {
          text: "🤫 故事不用分享，自己知道就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEventResonanceV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你觉得故事不用分享。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
