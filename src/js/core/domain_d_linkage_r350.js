/**
 * 域D(NPC/社交) 联动增强 R350
 * 第十二轮循环——社交积累的多维回响。
 * 桥接：
 *   D→A  social_data_v2              社交→数据（数据/数值·关系分析）
 *   D→G  social_wellbeing_v2         社交→幸福感（核心机制·心理健康）
 *   D→B  social_event_v2            社交→事件（事件/叙事·人物连接）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR350Loaded) return;
  RANDOM_EVENTS._domainDLinkageR350Loaded = true;

  function countHighNpcsD350(st, minAff) {
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
      id: "social_data_r350",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "社交数据v2",
      story: "你开始分析自己的社交网络数据——好感分布、互动频率、关系深度、互惠次数。\n\n这些数字让你发现了一些有趣的规律：某些NPC是「关键节点」，某些关系是「高价值投资」。\n\n你开始用数据「经营」人际关系，而不是凭感觉。",
      triggers: { minDay: 700, excludeFlags: ["_socialDataV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD350(st, 45) >= 7;
      },
      choices: [
        {
          text: "📊 用数据优化社交策略",
          hint: "心智+13，NPC好感+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataV2Seen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 45) {
                  applyAffinityChange(st, id, 8, "数据洞察");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 13);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据优化社交策略。数据让社交更精准。心智+13，好感+8。", "success");
            }
          },
        },
        {
          text: "🤷 凭直觉就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataV2Seen = true;
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
      id: "social_wellbeing_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "😊",
      title: "社交带来的幸福感v2",
      story: "你发现，和朋友们在一起的时光，是你在城市中最快乐的时刻。\n\n不是花钱的快乐，不是成功的快乐，而是「有人在乎你、你也在乎别人」的快乐。\n\n你开始理解，幸福感不是来自物质，而是来自「连接」。",
      triggers: { minDay: 600, excludeFlags: ["_socialWellbeingV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.needs || !st.relationships) return false;
        return countHighNpcsD350(st, 30) >= 4;
      },
      choices: [
        {
          text: "😊 珍惜这些朋友",
          hint: "心情+20，NPC好感+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialWellbeingV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 30) {
                  applyAffinityChange(st, id, 10, "幸福感分享");
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("😊 你珍惜了这些朋友。幸福感来自连接，不是物质。心情+20，好感+10。", "success");
            }
          },
        },
        {
          text: "🤷 朋友不用刻意维护",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialWellbeingV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得朋友不用刻意维护。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
    {
      id: "social_event_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "社交是事件的共鸣v2",
      story: "你发现，和已结识NPC聊起共同经历的事件，能迅速拉近彼此的距离。\n\n「你也经历过这种事？」「原来你也是这么过来的。」共同经历是社交的催化剂，让陌生人变成朋友，让朋友变成挚友。\n\n你开始主动和NPC分享自己的故事，也倾听TA们的故事。",
      triggers: { minDay: 650, excludeFlags: ["_socialEventV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD350(st, 35) >= 5;
      },
      choices: [
        {
          text: "🤝 和NPC分享你的故事",
          hint: "NPC好感+10，心情+18",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEventV2Seen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 35) {
                  applyAffinityChange(st, id, 10, "故事分享");
                }
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你和NPC分享了你的故事。共同经历是社交的催化剂。好感+10，心情+18。", "success");
            }
          },
        },
        {
          text: "🤫 故事不用分享，自己知道就行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEventV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你觉得故事不用分享。心智+4。", "info");
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
