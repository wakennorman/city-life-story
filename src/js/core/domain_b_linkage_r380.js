/**
 * 域B(事件/叙事) 联动增强 R380
 * 第十六轮循环——叙事积累的多维回响。
 * 桥接：
 *   B→C  event_career_reflection     事件→职业反思（职业/成长·经历沉淀）
 *   B→G  event_life_rhythm           事件→生活节奏（核心机制·日常叙事）
 *   B→H  event_company_culture       事件→公司文化（公司·价值观传递）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR380Loaded) return;
  RANDOM_EVENTS._domainBLinkageR380Loaded = true;

  var EVENTS = [
    {
      id: "event_career_reflection",
      phase: "street",
      _isChainEvent: false,
      icon: "💭",
      title: "经历塑造职业",
      story: "你回顾自己最近经历的事情，发现每一件事都在悄悄影响你的职业选择。\n\n被解雇让你学会了职场政治的重要性，创业让你明白了风险管理的价值，帮朋友解决困难让你发现了自己没意识到的技能。\n\n「经历不是弯路，每一步都算数。」",
      triggers: { minDay: 50, excludeFlags: ["_eventCareerReflectionSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 8;
      },
      choices: [
        {
          text: "💭 从经历中提炼职业智慧",
          hint: "心智+5，随机技能+3XP",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCareerReflectionSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.skills) {
              var keys = Object.keys(st.skills);
              if (keys.length > 0 && typeof addSkillXp === "function") {
                addSkillXp(st, keys[Math.floor(Math.random() * keys.length)], 3);
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💭 你从经历中提炼了职业智慧。经历不是弯路，每一步都算数。心智+5，随机技能+3XP。", "success");
            }
          },
        },
        {
          text: "📝 记下来",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCareerReflectionSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你记了下来。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "event_life_rhythm",
      phase: "street",
      _isChainEvent: false,
      icon: "🌅",
      title: "城市的节奏",
      story: "你走在清晨的街道上，看着这座城市慢慢苏醒。\n\n早餐摊的老板在忙碌，环卫工人在清扫街道，晨练的老人在公园里打着太极，上班族匆匆走过。\n\n你突然意识到，你已经成为这座城市节奏的一部分了。\n\n「城市有自己的心跳，而你已经融入了它的节拍。」",
      triggers: { minDay: 15, excludeFlags: ["_eventLifeRhythmSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.player && st.player.day >= 15);
      },
      choices: [
        {
          text: "🌅 感受城市节奏",
          hint: "心情+8，心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeRhythmSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌅 你感受着城市的节奏。你已经融入了它的节拍。心情+8，心智+3。", "success");
            }
          },
        },
        {
          text: "☕ 买杯咖啡",
          hint: "心情+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeRhythmSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("☕ 你买了杯咖啡。心情+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "event_company_culture",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "价值观的力量",
      story: "你在公司里跟团队讨论公司的价值观。\n\n不仅是挂在墙上的标语，而是真正指导每个人做决策的原则。\n\n你发现，一家公司能走多远，取决于它的价值观有多清晰。\n\n「价值观不是约束，而是指南针。」",
      triggers: { minDay: 100, excludeFlags: ["_eventCompanyCultureSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.startup && st.startup.company && (st.startup.company.employees || []).length >= 2);
      },
      choices: [
        {
          text: "🏢 确立公司价值观",
          hint: "心智+5，声誉+5，忠诚+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCompanyCultureSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.startup && st.startup.company) {
              st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
              if (st.startup.company.employees) {
                for (var i = 0; i < st.startup.company.employees.length; i++) {
                  if (st.startup.company.employees[i]) {
                    st.startup.company.employees[i].loyalty = Math.min(100, (st.startup.company.employees[i].loyalty || 50) + 3);
                  }
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏢 你确立了公司价值观。价值观不是约束，而是指南针。心智+5，声誉+5，忠诚+3。", "success");
            }
          },
        },
        {
          text: "📋 专注业务",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCompanyCultureSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你专注业务。心智+2。", "info");
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