/**
 * 域B(事件/叙事) 联动增强 R323
 * 第九轮循环——叙事积累的多维回响。
 * 桥接：
 *   B→A  event_data_accumulation     事件→数据积累（数据/数值·信息沉淀）
 *   B→C  event_career_milestone_v2   事件→职业里程碑（职业/成长·时间积累）
 *   B→G  event_life_chapter_v2       事件→人生章节（核心机制·生命主线）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR323Loaded) return;
  RANDOM_EVENTS._domainBLinkageR323Loaded = true;

  var EVENTS = [
    {
      id: "event_data_accumulation",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "事件数据的积累",
      story: "你开始系统地记录和分析自己经历过的每一个事件——类型、频率、结果、教训。\n\n这些数据让你发现了一些有趣的规律：某些类型的事件总是在特定时期密集出现，某些选择总是导致更好的长期结果。\n\n你开始用数据理解自己的人生轨迹，而不是用感觉。",
      triggers: { minDay: 400, excludeFlags: ["_eventDataAccumSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 75;
      },
      choices: [
        {
          text: "📊 建立事件数据库",
          hint: "心智+10，置事件分析flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventDataAccumSeen = true;
            st.flags._eventDatabaseV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你建立了事件数据库。数据让人生有迹可循。心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用那么系统",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventDataAccumSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用那么系统。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "event_career_milestone_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "事件触发职业里程碑",
      story: "你发现，某些随机事件会触发职业发展的关键时刻——一个关于行业的讲座让你找到方向，一个关于成功的故事让你坚定信念，一个关于失败的教训让你避免重蹈覆辙。\n\n你开始主动从事件中提取「职业灵感」，而不是被动等待机会。\n\n「经历不仅是故事，也是职业发展的催化剂。」",
      triggers: { minDay: 350, excludeFlags: ["_eventCareerMilestoneV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 50;
      },
      choices: [
        {
          text: "🎯 从事件中提取职业灵感",
          hint: "最高技能XP+12，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCareerMilestoneV2Seen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎯 你从事件中提取了职业灵感。经历是职业发展的催化剂。技能XP+12，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 事件是事件，工作是工作",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCareerMilestoneV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得事件和工作应该分开。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "event_life_chapter_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "事件构成人生章节",
      story: "你回顾自己这些年经历的事件，发现它们构成了你人生故事的各个章节——生存、立足、选择、成长。\n\n每一个章节都有其主题和挑战，每一个事件都是这个章节的一个注脚。你开始理解，人生不是线性的，而是由无数个事件编织而成的「叙事网络」。\n\n「人生不是找到答案，是学会讲故事。」",
      triggers: { minDay: 500, excludeFlags: ["_eventLifeChapterV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 90;
      },
      choices: [
        {
          text: "📖 写下人生章节",
          hint: "心情+15，心智+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeChapterV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了人生章节。人生不是找到答案，是学会讲故事。心情+15，心智+12。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeChapterV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+4。", "info");
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
