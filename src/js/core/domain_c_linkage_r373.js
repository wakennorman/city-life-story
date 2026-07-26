/**
 * 域C(职业/成长) 联动增强 R373
 * 第十五轮循环——技能积累的多维回响。
 * 桥接：
 *   C→A  career_data_v4             职业→数据v4（数据/数值·信息沉淀）
 *   C→D  career_social_v3           职业→社交v3（NPC/社交·职业人脉）
 *   C→F  career_skill_ui            职业→技能UI（UI/UX·技能可视化）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR373Loaded) return;
  RANDOM_EVENTS._domainCLinkageR373Loaded = true;

  var EVENTS = [
    {
      id: "career_data_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "职业数据的价值",
      story: "你整理了自己的职业数据——工作时间、收入变化、技能成长、晋升记录。\n\n这些数据告诉你一个故事：你从什么都不会的新手，成长为现在独当一面的专业人士。\n\n「数据不仅是记录，更是你职业生涯的见证者。」",
      triggers: { minDay: 60, excludeFlags: ["_careerDataV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        return !!(job && job.path && (job.workDays || 0) >= 60);
      },
      choices: [
        {
          text: "📊 分析职业数据",
          hint: "心智+5，职业洞察flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDataV4Seen = true;
            st.flags._careerDataAwareness = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你分析了职业数据。数据是职业生涯的见证者。心智+5。", "success");
            }
          },
        },
        {
          text: "📝 继续工作",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDataV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你继续工作。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "career_social_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "职场人脉",
      story: "你在工作中认识了一些志同道合的人。\n\n有些人成了你的良师益友，有些人给你带来了新的机会，有些人只是点头之交但也让你觉得这个城市不那么陌生。\n\n「职场不仅是谋生的地方，也是建立关系的地方。」",
      triggers: { minDay: 45, excludeFlags: ["_careerSocialV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        return !!(job && job.path);
      },
      choices: [
        {
          text: "🤝 拓展职场人脉",
          hint: "心智+5，好感+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerSocialV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你拓展了职场人脉。职场不仅是谋生的地方，也是建立关系的地方。心智+5。", "success");
            }
          },
        },
        {
          text: "💼 专注工作",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerSocialV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你专注工作。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "career_skill_ui",
      phase: "street",
      _isChainEvent: false,
      icon: "📚",
      title: "技能图谱",
      story: "你画了一张自己的技能图谱，看看自己会什么、不会什么、想学什么。\n\n你发现，有些技能在工作中很常用，有些技能虽然不常用但在关键时刻很有用，还有些技能你一直想学但没有机会。\n\n「技能图谱就是你的职业地图，知道自己在哪，才能知道要去哪。」",
      triggers: { minDay: 30, excludeFlags: ["_careerSkillUiSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.skills);
      },
      choices: [
        {
          text: "📚 规划技能成长路线",
          hint: "心智+5，技能规划flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerSkillUiSeen = true;
            st.flags._skillPlanMade = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📚 你规划了技能成长路线。技能图谱就是你的职业地图。心智+5。", "success");
            }
          },
        },
        {
          text: "📖 边学边看",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerSkillUiSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你边学边看。心智+2。", "info");
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