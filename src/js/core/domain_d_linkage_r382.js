/**
 * 域D(NPC/社交) 联动增强 R382
 * 第十六轮循环——社交积累的多维回响。
 * 桥接：
 *   D→A  social_network_value       社交→网络价值（数据/数值·社交资本）
 *   D→G  social_emotional_support    社交→情感支持（核心机制·心理健康）
 *   D→B  social_life_story          社交→生活故事（事件/叙事·人物共鸣）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR382Loaded) return;
  RANDOM_EVENTS._domainDLinkageR382Loaded = true;

  function countMetNpcs(st) {
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (Object.prototype.hasOwnProperty.call(st.relationships, id)) {
        if (st.relationships[id] && st.relationships[id].met) count++;
      }
    }
    return count;
  }

  var EVENTS = [
    {
      id: "social_network_value_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🔗",
      title: "社交网络的价值",
      story: "你开始计算自己的社交网络价值——你认识多少人、这些人的背景是什么、你们之间有什么样的联系。\n\n你发现，社交网络的价值不是由数量决定的，而是由「连接的质量」决定的。\n\n一个真正愿意帮你的朋友，比一百个点赞之交更有价值。\n\n「社交资本是最隐形的财富，但它确实存在。」",
      triggers: { minDay: 45, excludeFlags: ["_socialNetworkValueSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return countMetNpcs(st) >= 4;
      },
      choices: [
        {
          text: "🔗 评估社交网络价值",
          hint: "心智+5，社交资本flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialNetworkValueSeen = true;
            st.flags._socialCapitalAwareness = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔗 你评估了社交网络价值。社交资本是最隐形的财富。心智+5。", "success");
            }
          },
        },
        {
          text: "🤝 用心交友",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialNetworkValueSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你用心交友。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "social_emotional_support_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💗",
      title: "情感支持",
      story: "你最近遇到了一些挫折，心情不太好。\n\n一个朋友看出了你的状态，默默地陪着你，什么也没说。\n\n有时候，最好的安慰不是言语，而是「我在」。\n\n「在这个城市里，有人在乎你的感受，就是最大的温暖。」",
      triggers: { minDay: 20, excludeFlags: ["_socialEmotionalSupportSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (countMetNpcs(st) < 2) return false;
        return !!(st.needs && (st.needs.happiness || 50) < 45);
      },
      choices: [
        {
          text: "💗 接受朋友的关心",
          hint: "心情+12，心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEmotionalSupportSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💗 你接受了朋友的关心。有人在乎你的感受就是最大的温暖。心情+12，心智+4。", "success");
            }
          },
        },
        {
          text: "😤 自己扛着",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEmotionalSupportSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("😤 你自己扛着。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "social_life_story",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "每个人都有自己的故事",
      story: "你在街头遇到了一个熟悉的面孔，你们聊起了各自的近况。\n\n你发现，每个人都有自己的故事——有人在为梦想奋斗，有人在为生活奔波，有人刚刚经历了人生的转折。\n\n你开始理解，这座城市里的每一个人，都是自己人生的主角。\n\n「倾听别人的故事，也是在丰富自己的人生。」",
      triggers: { minDay: 30, excludeFlags: ["_socialLifeStorySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return countMetNpcs(st) >= 3;
      },
      choices: [
        {
          text: "📖 倾听朋友的故事",
          hint: "心情+8，心智+5，好感+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialLifeStorySeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你倾听了朋友的故事。倾听别人的故事也在丰富自己的人生。心情+8，心智+5。", "success");
            }
          },
        },
        {
          text: "☕ 一起喝杯茶",
          hint: "心情+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialLifeStorySeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("☕ 你们一起喝了杯茶。心情+4。", "info");
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