/**
 * 域A(数据/数值平衡) 联动增强 R288
 * 第五轮循环——数据积累的多维回响。
 * 桥接：
 *   A→G  data_health_optimization    数据→健康优化（核心机制·精准健康）
 *   A→B  data_driven_event_story     数据→事件故事（事件/叙事·量化人生）
 *   A→C  data_market_data_insight   技能→市场数据（职业/成长·数据驱动）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR288Loaded) return;
  RANDOM_EVENTS._domainALinkageR288Loaded = true;

  var EVENTS = [
    {
      id: "data_health_optimization",
      phase: "street",
      _isChainEvent: false,
      icon: "💪",
      title: "数据驱动的精准健康",
      story: "你开始用数据精准优化自己的健康——追踪睡眠质量与工作效率的关系、运动频率与心情的关联、饮食结构与体能的变化。\n\n这些数据分析让你发现了一些以前没注意到的规律：某些食物让你更清醒，某些运动时间让你睡得更好。\n\n你开始用数据「定制」自己的健康方案，而不是跟风。",
      triggers: { minDay: 200, excludeFlags: ["_dataHealthOptSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.status || !st.needs || !st.stats) return false;
        return (st.stats.actionFreq && (st.stats.actionFreq.exercise || 0) >= 8);
      },
      choices: [
        {
          text: "💪 制定精准健康方案",
          hint: "健康+12，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataHealthOptSeen = true;
            st.flags._precisionHealth = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💪 你制定了精准健康方案。数据让健康更科学。健康+12，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 健康生活不用那么精确",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataHealthOptSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得健康生活不用那么精确。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "data_driven_event_story",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "量化人生的事件故事",
      story: "你开始用数据讲述自己的人生故事——不是冷冰冰的数字，而是有温度的量化叙事。\n\n「这一年，我经历了42个事件，其中12个让我成长，8个让我感动，3个让我重新认识自己。」\n\n这些数字让模糊的记忆变得清晰，让无形的成长变得可见。",
      triggers: { minDay: 300, excludeFlags: ["_dataEventStorySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 35;
      },
      choices: [
        {
          text: "📖 写下量化人生故事",
          hint: "心情+10，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataEventStorySeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了量化人生故事。数字让成长变得可见。心情+10，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 故事不用量化",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataEventStorySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得故事不用量化。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "skill_market_data_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "技能与市场数据的洞察",
      story: "你开始分析技能与市场需求的关系——哪些技能最赚钱？哪些技能在走下坡路？哪些新兴技能值得学习？\n\n这些数据分析让你发现了一些有趣趋势：某些传统技能正在被自动化取代，某些新技能正在崛起。\n\n你开始用数据指导自己的学习方向，而不是盲目跟风。",
      triggers: { minDay: 180, excludeFlags: ["_skillMarketDataSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.stats || !st.stats.actionFreq) return false;
        var totalTrades = (st.stats.actionFreq.buyGood || 0) + (st.stats.actionFreq.sellGood || 0);
        if (totalTrades < 15) return false;
        var topSkill = "", topLv = 0;
        for (var k in st.skills) {
          var lv = (st.skills[k] && st.skills[k].level) || 0;
          if (lv > topLv) { topLv = lv; topSkill = k; }
        }
        return topSkill === "coding" || topSkill === "sales" || topSkill === "management";
      },
      choices: [
        {
          text: "📊 用数据指导技能学习",
          hint: "最高技能XP+12，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillMarketDataSeen = true;
            var bizSkills = ["coding", "sales", "management", "accounting"];
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              if (bizSkills.indexOf(k) >= 0) {
                var lv = (st.skills[k] && st.skills[k].level) || 0;
                if (lv > topLv) { topLv = lv; topSkill = k; }
              }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据指导技能学习。数据让选择更理性。技能XP+12，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 凭兴趣学就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillMarketDataSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭兴趣学就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
