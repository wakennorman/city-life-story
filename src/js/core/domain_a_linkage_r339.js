/**
 * 域A(数据/数值平衡) 联动增强 R339
 * 第十一轮循环——数据积累的多维回响。
 * 桥接：
 *   A→B  data_event_pattern_v5       数据→事件模式（事件/叙事·量化故事）
 *   A→C  data_skill_mastery_v2       数据→技能掌握（职业/成长·数据驱动）
 *   A→D  data_npc_insight_v3         数据→NPC洞察（NPC/社交·数据理解）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR339Loaded) return;
  RANDOM_EVENTS._domainALinkageR339Loaded = true;

  var EVENTS = [
    {
      id: "data_event_pattern_v5",
      phase: "street",
      _isChainEvent: false,
      icon: "🔍",
      title: "事件数据模式v5",
      story: "你开始深度分析自己经历的事件数据——不仅是频率和类型，还有事件之间的因果关系、时间间隔的规律、选择的长期影响。\n\n这些分析让你发现了一些更深层的模式：某些事件是「因」，某些事件是「果」，某些事件是「催化剂」。\n\n你开始用数据「理解」人生的因果链，而不是用命运。",
      triggers: { minDay: 600, excludeFlags: ["_dataEventPatternV5Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.actionFreq) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 100;
      },
      choices: [
        {
          text: "🔍 深度分析事件因果",
          hint: "心智+14，置因果分析flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataEventPatternV5Seen = true;
            st.flags._eventCausalAnalysisV5 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 14);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔍 你深度分析了事件因果。数据让人生有因可循。心智+14。", "success");
            }
          },
        },
        {
          text: "🤷 事件是随机的，没有因果",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataEventPatternV5Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得事件是随机的。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "data_skill_mastery_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "数据驱动技能掌握v2",
      story: "你开始用数据优化自己的技能学习路径——追踪每项技能的成长速度、投入产出比、与职业目标的匹配度。\n\n这些数据让你发现了一些有趣的规律：某些技能在特定阶段提升更快，某些技能组合的协同效应更强。\n\n你开始用数据「设计」自己的技能树，而不是盲目学习。",
      triggers: { minDay: 500, excludeFlags: ["_dataSkillMasteryV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.career || !st.career.currentJob) return false;
        var topSkill = "", topLv = 0;
        for (var k in st.skills) {
          var lv = (st.skills[k] && st.skills[k].level) || 0;
          if (lv > topLv) { topLv = lv; topSkill = k; }
        }
        return topLv >= 50;
      },
      choices: [
        {
          text: "📊 用数据优化技能路径",
          hint: "最高技能XP+18，心智+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataSkillMasteryV2Seen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 18);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据优化技能路径。数据让学习更高效。技能XP+18，心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 凭兴趣学就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataSkillMasteryV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭兴趣学就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "data_npc_insight_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "👥",
      title: "NPC行为数据洞察v3",
      story: "你开始分析已结识NPC的行为模式——什么时候在场、什么时候互动、什么时候给出好处。\n\n这些洞察让你发现了一些有趣的规律：某些NPC在特定时段更容易互动，某些类型的礼物效果更好，某些话题更能拉近距离。\n\n你开始用数据「理解」NPC，而不是凭感觉。",
      triggers: { minDay: 550, excludeFlags: ["_dataNpcInsightV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var highNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 50) highNpcs++;
        }
        return highNpcs >= 4;
      },
      choices: [
        {
          text: "👥 用数据优化社交策略",
          hint: "心智+11，NPC好感+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataNpcInsightV3Seen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 50) {
                  applyAffinityChange(st, id, 6, "数据洞察");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 11);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👥 你用数据优化社交策略。数据让社交更精准。心智+11，好感+6。", "success");
            }
          },
        },
        {
          text: "🤷 凭直觉就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataNpcInsightV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭直觉就行。心智+3。", "info");
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
