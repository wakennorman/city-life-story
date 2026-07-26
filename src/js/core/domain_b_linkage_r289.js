/**
 * 域B(事件/叙事) 联动增强 R289
 * 第五轮循环——叙事积累的多维回响。
 * 桥接：
 *   B→A  event_data_accumulation    事件→数据积累（数据/数值·信息沉淀）
 *   B→G  event_emotional_resilience  事件→情感韧性（核心机制·心理成长）
 *   B→C  event_career_inspiration    事件→职业灵感（职业/成长·经历催化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR289Loaded) return;
  RANDOM_EVENTS._domainBLinkageR289Loaded = true;

  var EVENTS = [
    {
      id: "event_data_accumulation",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "事件数据的积累",
      story: "你开始系统地记录和分析自己经历过的每一个事件——类型、频率、结果、教训。\n\n这些数据让你发现了一些有趣的规律：某些类型的事件总是在特定时期密集出现，某些选择总是导致更好的长期结果。\n\n你开始用数据理解自己的人生轨迹，而不是用感觉。",
      triggers: { minDay: 250, excludeFlags: ["_eventDataAccumSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 40;
      },
      choices: [
        {
          text: "📊 建立事件数据库",
          hint: "心智+8，置事件分析flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventDataAccumSeen = true;
            st.flags._eventDatabase = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你建立了事件数据库。数据让人生有迹可循。心智+8。", "success");
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
      id: "event_emotional_resilience",
      phase: "street",
      _isChainEvent: false,
      icon: "💪",
      title: "事件培养的情感韧性",
      story: "你发现，经历过的每一个困难事件，都让你变得更强大。\n\n那些曾经让你崩溃的瞬间，现在看来都是成长的契机。你不再害怕困难，因为你知道——每一次跌倒，都是站起来变得更强的机会。\n\n「韧性不是天生的，是练出来的。」",
      triggers: { minDay: 300, excludeFlags: ["_eventEmoResilienceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.needs) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 30 && (st.needs.happiness || 50) >= 50;
      },
      choices: [
        {
          text: "💪 感谢困难让我成长",
          hint: "心情+12，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventEmoResilienceSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💪 你感谢困难让你成长。韧性不是天生的，是练出来的。心情+12，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 不用感谢，继续前行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventEmoResilienceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用感谢。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "event_career_inspiration",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "事件是职业的灵感来源",
      story: "你发现，很多随机事件其实蕴含着职业的灵感。\n\n一个关于环保的新闻让你开始关注绿色能源，一个关于教育的讨论让你想做一个教育类产品，一个关于医疗的故事让你关注健康产业。\n\n你不再把事件当作独立的故事，而是当作职业灵感的源泉。",
      triggers: { minDay: 200, excludeFlags: ["_eventCareerInspSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 20;
      },
      choices: [
        {
          text: "💡 从事件中提取职业灵感",
          hint: "最高技能XP+10，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCareerInspSeen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💡 你从事件中提取职业灵感。经历是最好的老师。技能XP+10，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 事件是事件，工作是工作",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCareerInspSeen = true;
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
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
