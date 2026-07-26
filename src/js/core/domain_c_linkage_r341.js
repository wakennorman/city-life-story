/**
 * 域C(职业/成长) 联动增强 R341
 * 第十一轮循环——技能积累的多维回响。
 * 桥接：
 *   C→A  career_data_v3              职业→数据（数据/数值·信息沉淀）
 *   C→B  career_event_v2             职业→事件（事件/叙事·职业故事）
 *   C→D  career_social_v2            职业→社交（NPC/社交·职业人脉）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR341Loaded) return;
  RANDOM_EVENTS._domainCLinkageR341Loaded = true;

  var EVENTS = [
    {
      id: "career_data_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "职业数据v3",
      story: "你开始用数据审视自己的职业历程——工作天数、收入增长、技能提升速度、晋升次数。\n\n这些数字让你发现了一些有趣的规律：某些时段进步更快，某些技能组合更有价值，某些选择导致更好的长期结果。\n\n你开始用数据「驾驶」自己的职业发展，而不是凭感觉。",
      triggers: { minDay: 600, excludeFlags: ["_careerDataV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 500;
      },
      choices: [
        {
          text: "📊 建立职业数据面板",
          hint: "心智+12，置职业数据flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDataV3Seen = true;
            st.flags._careerDataPanelV3 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你建立了职业数据面板。数据让职业发展有迹可循。心智+12。", "success");
            }
          },
        },
        {
          text: "🤷 不用那么系统",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDataV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用那么系统。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "career_event_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "职业经历是事件素材v2",
      story: "你发现，职业生涯中的经历是最好的故事素材——第一次入职的紧张、第一次晋升的喜悦、第一次被解雇的失落、第一次创业的决定。\n\n你开始把这些经历写下来，不仅是记录，也是对自己人生的「叙事重构」。\n\n「经历不仅是记忆，也是故事。」",
      triggers: { minDay: 550, excludeFlags: ["_careerEventV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 450;
      },
      choices: [
        {
          text: "📖 写下职业故事",
          hint: "心情+18，心智+11",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerEventV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 11);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了职业故事。经历不仅是记忆，也是故事。心情+18，心智+11。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，记住就好",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerEventV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "career_social_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "职业社交v2",
      story: "你发现，职业积累让你结识了很多有价值的人脉——前同事、客户、供应商、行业前辈。\n\n这些人不仅是职业资源，也是你在这座城市里的「社交资本」。你开始理解，「专业能力」和「社交网络」是职业发展的双翼。",
      triggers: { minDay: 500, excludeFlags: ["_careerSocialV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships || !st.career || !st.career.currentJob) return false;
        var metNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 40) metNpcs++;
        }
        return metNpcs >= 5;
      },
      choices: [
        {
          text: "🤝 主动经营职业社交网络",
          hint: "NPC好感+6，心智+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerSocialV2Seen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 40) {
                  applyAffinityChange(st, id, 6, "职业社交");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你主动经营职业社交网络。专业能力和社交网络是职业发展的双翼。好感+6，心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 社交不用经营，本事最重要",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerSocialV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得本事比社交重要。心智+3。", "info");
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
