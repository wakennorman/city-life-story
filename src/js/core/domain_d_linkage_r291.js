/**
 * 域D(NPC/社交) 联动增强 R291
 * 第五轮循环——社交积累的多维回响。
 * 桥接：
 *   D→B  npc_life_story               NPC→人生故事（事件/叙事·人物深度）
 *   D→G  social_stress_relief        社交→压力缓解（核心机制·心理健康）
 *   D→A  social_capital_quantify     社交→资本量化（数据/数值·关系价值）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR291Loaded) return;
  RANDOM_EVENTS._domainDLinkageR291Loaded = true;

  function countHighNpcsD291(st, minAff) {
    minAff = minAff || 60;
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= minAff) count++;
    }
    return count;
  }

  var EVENTS = [
    {
      id: "npc_life_story",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "NPC的人生故事",
      story: "你和某个NPC的关系越来越深，开始了解TA的完整故事——TA的过去、TA的梦想、TA的遗憾。\n\n你发现，每个NPC都有自己的弧线，不只是你人生的配角。他们是自己故事的主角。\n\n你开始理解，社交不只是利益交换，也是「看见彼此」的过程。",
      triggers: { minDay: 250, excludeFlags: ["_npcLifeStorySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD291(st, 70) >= 1;
      },
      choices: [
        {
          text: "📖 认真倾听TA的故事",
          hint: "NPC好感+10，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcLifeStorySeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 70) {
                  applyAffinityChange(st, id, 10, "深度了解");
                  break;
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你认真倾听了TA的故事。每个人都有自己的弧线。好感+10，心智+8。", "success");
            }
          },
        },
        {
          text: "👋 保持适当的距离",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcLifeStorySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👋 你选择保持适当的距离。亲疏有度，是一种智慧。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "social_stress_relief",
      phase: "street",
      _isChainEvent: false,
      icon: "🧘",
      title: "社交是压力的缓解剂",
      story: "你发现，心情不好的时候和朋友聊一聊，比独自扛过去有效得多。\n\n社交不是负担，是心理健康的「解压阀」。你开始主动维护重要的关系，而不是等到需要时才想起。\n\n「有人倾听」这件事本身，就是最好的治愈。",
      triggers: { minDay: 180, excludeFlags: ["_socialStressReliefSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.needs || !st.relationships) return false;
        if ((st.needs.happiness || 50) > 55) return false;
        return countHighNpcsD291(st, 40) >= 2;
      },
      choices: [
        {
          text: "🧘 主动找朋友倾诉",
          hint: "心情+15，NPC好感+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialStressReliefSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (typeof applyAffinityChange === "function") {
              var count = 0;
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 40) {
                  applyAffinityChange(st, id, 4, "倾诉");
                  count++;
                  if (count >= 3) break;
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧘 你主动找朋友倾诉。有人倾听，就是最好的治愈。心情+15，好感+4。", "success");
            }
          },
        },
        {
          text: "🤫 想一个人静静",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialStressReliefSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你想一个人静静。独处，也是一种力量。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
    {
      id: "social_capital_quantify",
      phase: "street",
      _isChainEvent: false,
      icon: "💎",
      title: "社交资本的量化",
      story: "你开始量化自己的社交网络价值——高好感NPC数量、关系活跃度、互惠次数。\n\n这些数字让你发现，社交不仅是情感需求，也是「社会资本」。高好感的NPC会在关键时刻帮你：介绍工作、提供信息、借钱应急。\n\n你开始理解「关系就是资源」的真正含义。",
      triggers: { minDay: 200, excludeFlags: ["_socialCapitalQuantSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD291(st, 50) >= 4;
      },
      choices: [
        {
          text: "💎 系统经营社交资本",
          hint: "心智+8，置社交资本系统flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCapitalQuantSeen = true;
            st.flags._socialCapitalSystemV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💎 你系统经营社交资本。关系就是资源。心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 关系不用量化",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCapitalQuantSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得关系不用量化。心智+3。", "info");
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
