/**
 * 域D(NPC/社交) 联动增强 R283
 * 第四轮循环——社交积累的多维回响。
 * 桥接：
 *   D→H  social_company_culture   社交→公司文化（公司·人文温度）
 *   D→G  social_emotional_support  社交→情感支持（核心机制·心理健康）
 *   D→A  social_network_value      社交网络→数值价值（数据/数值·关系资本）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR283Loaded) return;
  RANDOM_EVENTS._domainDLinkageR283Loaded = true;

  function countHighNpcsD283(st, minAff) {
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
      id: "social_company_culture",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏛️",
      title: "社交关系塑造公司文化",
      story: "你发现，公司的文化深受你个人社交风格的影响。\n\n如果你是一个热心的人，公司就会充满人情味；如果你是一个严谨的人，公司就会注重细节。你开始意识到，创始人就是公司文化的「源头」。\n\n你决定有意识地塑造一种「温暖而专业」的文化。",
      triggers: { minDay: 250, excludeFlags: ["_socialCompanyCultureSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return countHighNpcsD283(st, 60) >= 2;
      },
      choices: [
        {
          text: "🏛️ 有意识地塑造公司文化",
          hint: "公司声誉+8，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCompanyCultureSeen = true;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 8;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏛️ 你有意识地塑造公司文化。创始人就是公司文化的源头。声誉+8，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 文化不用刻意塑造",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCompanyCultureSeen = true;
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
      id: "social_emotional_support",
      phase: "street",
      _isChainEvent: false,
      icon: "💝",
      title: "社交的情感支持",
      story: "你经历了一段低谷期——也许是工作不顺，也许是生活压力。\n\n但朋友们主动找到了你，陪你聊天、给你鼓励、帮你分析问题。你发现，社交不只是利益交换，更是情感的支撑。\n\n「有人在乎你」这件事本身，就是最大的力量。",
      triggers: { minDay: 180, excludeFlags: ["_socialEmoSupportSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.needs || !st.relationships) return false;
        if ((st.needs.happiness || 50) > 50) return false;
        return countHighNpcsD283(st, 40) >= 2;
      },
      choices: [
        {
          text: "💝 感谢朋友的情感支持",
          hint: "心情+15，NPC好感+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEmoSupportSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 40) {
                  applyAffinityChange(st, id, 5, "情感支持");
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💝 你感谢了朋友的情感支撑。有人在乎你，就是最大的力量。心情+15，好感+5。", "success");
            }
          },
        },
        {
          text: "🤫 不想麻烦别人",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEmoSupportSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你不想麻烦别人。独立，是一种选择。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
    {
      id: "social_network_value",
      phase: "street",
      _isChainEvent: false,
      icon: "💎",
      title: "社交网络的数值价值",
      story: "你开始量化自己社交网络的价值——多少个高好感NPC、多少条活跃关系、多少次有效互动。\n\n这些数字让你发现，社交不仅是情感需求，也是「社会资本」。高好感的NPC会在关键时刻帮你：介绍工作、提供信息、借钱应急。\n\n你开始理解「关系就是资源」的真正含义。",
      triggers: { minDay: 200, excludeFlags: ["_socialNetValueSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD283(st, 60) >= 3;
      },
      choices: [
        {
          text: "💎 系统经营社交网络",
          hint: "心智+8，置社交资本flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialNetValueSeen = true;
            st.flags._socialCapitalSystem = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💎 你开始系统经营社交网络。关系就是资源。心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 关系不用经营，真心换真心",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialNetValueSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得真心换真心就好。心智+4。", "info");
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
