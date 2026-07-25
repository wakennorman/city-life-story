/**
 * 域D(NPC/社交) 联动增强 R275
 * 第三轮循环——社交积累的多维回响。
 * 桥接：
 *   D→A  social_data_insight      社交数据→数值分析（数据/数值·关系洞察）
 *   D→G  social_mental_health     社交支持→心理健康（核心机制·心理韧性）
 *   D→C  social_career_network    社交关系→职业人脉（职业/成长·关系变现）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR275Loaded) return;
  RANDOM_EVENTS._domainDLinkageR275Loaded = true;

  function countMetNpcsD275(st, minAff) {
    minAff = minAff || 0;
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= minAff) count++;
    }
    return count;
  }

  var EVENTS = [
    {
      id: "social_data_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "社交数据洞察",
      story: "你开始分析自己的人际关系数据——认识多少人、好感分布、互动频率。\n\n这些数字让你发现了一些有趣的规律：某些NPC总是出现在你低谷时，某些关系需要定期维护才能保持。\n\n你开始用数据管理人际关系，而不是凭感觉。",
      triggers: { minDay: 180, excludeFlags: ["_socialDataInsightSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return countMetNpcsD275(st, 0) >= 5;
      },
      choices: [
        {
          text: "📊 深入分析社交数据",
          hint: "心智+7，解锁社交分析flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataInsightSeen = true;
            st.flags._socialDataAnalysis = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你深入分析了社交数据。关系也需要经营。心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 关系不用分析，用心就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataInsightSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得关系不用分析。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "social_mental_health",
      phase: "street",
      _isChainEvent: false,
      icon: "🧠",
      title: "社交的心理健康价值",
      story: "你发现，心情不好的时候和朋友聊一聊，比独自扛过去有效得多。\n\n社交不是负担，是心理健康的「维生素」。你开始主动维护重要的关系，而不是等到需要时才想起。\n\n「独行者速，众行者远」——在这座城市里，你需要同行者。",
      triggers: { minDay: 120, excludeFlags: ["_socialMentalHealthSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.needs || !st.relationships) return false;
        if ((st.needs.happiness || 50) > 60) return false;
        return countMetNpcsD275(st, 30) >= 2;
      },
      choices: [
        {
          text: "🧠 主动联系朋友",
          hint: "心情+12，NPC好感+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialMentalHealthSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (typeof applyAffinityChange === "function") {
              var npcs = [];
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 30) npcs.push(id);
              }
              for (var i = 0; i < Math.min(3, npcs.length); i++) {
                applyAffinityChange(st, npcs[i], 4, "主动联系");
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧠 你主动联系了朋友。社交是心理健康的维生素。心情+12，好感+4。", "success");
            }
          },
        },
        {
          text: "🤫 想一个人静静",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialMentalHealthSeen = true;
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
      id: "social_career_network",
      phase: "street",
      _isChainEvent: false,
      icon: "🕸️",
      title: "社交关系变职业人脉",
      story: "你发现，认识的人开始在你的职业中发挥作用。\n\n一个朋友介绍了一个客户，一个熟人推荐了一个机会，一个前辈给了一个建议。你不再是单打独斗，而是有一张无形的「人脉网」在支撑你。",
      triggers: { minDay: 200, excludeFlags: ["_socialCareerNetworkSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return countMetNpcsD275(st, 40) >= 3;
      },
      choices: [
        {
          text: "🕸️ 主动经营职业人脉",
          hint: "心智+8，最高技能XP+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCareerNetworkSeen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🕸️ 你开始主动经营职业人脉。关系就是资源。技能XP+10，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 人脉不用经营，本事最重要",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCareerNetworkSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得本事比人脉重要。心智+4。", "info");
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
