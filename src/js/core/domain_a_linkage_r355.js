/**
 * 域A(数据/数值平衡) 联动增强 R355
 * 第十三轮循环——数据积累的多维回响。
 * 桥接：
 *   A→B  data_event_correlation_v6   数据→事件关联（事件/叙事·量化故事）
 *   A→C  data_career_optimization     数据→职业优化（职业/成长·数据驱动）
 *   A→D  data_social_intelligence     数据→社交情报（NPC/社交·数据洞察）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR355Loaded) return;
  RANDOM_EVENTS._domainALinkageR355Loaded = true;

  var EVENTS = [
    {
      id: "data_event_correlation_v6",
      phase: "street",
      _isChainEvent: false,
      icon: "🔗",
      title: "数据与事件的关联v6",
      story: "你开始分析自己的行为数据与经历事件之间的关联——什么时候最容易遇到好事？什么时候最容易遭遇挫折？\n\n这些分析让你发现了一些有趣的规律：某些行为模式总是伴随着某些类型的事件。你开始用数据「预测」未来，而不是被动等待。",
      triggers: { minDay: 800, excludeFlags: ["_dataEventCorrV6Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.actionFreq) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 170;
      },
      choices: [
        {
          text: "🔗 用数据预测未来",
          hint: "心智+16，置预测flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataEventCorrV6Seen = true;
            st.flags._dataDrivenPrediction = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 16);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔗 你用数据预测未来。数据让选择更主动。心智+16。", "success");
            }
          },
        },
        {
          text: "🤷 未来不可预测",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataEventCorrV6Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得未来不可预测。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "data_career_optimization",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "数据驱动职业优化",
      story: "你开始用数据优化自己的职业路径——追踪每项技能的成长速度、投入产出比、与职业目标的匹配度。\n\n这些数据让你发现了一些有趣的规律：某些技能在特定阶段提升更快，某些技能组合的协同效应更强。\n\n你开始用数据「设计」自己的职业路径，而不是盲目试错。",
      triggers: { minDay: 700, excludeFlags: ["_dataCareerOptSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.career || !st.career.currentJob) return false;
        var topSkill = "", topLv = 0;
        for (var k in st.skills) {
          var lv = (st.skills[k] && st.skills[k].level) || 0;
          if (lv > topLv) { topLv = lv; topSkill = k; }
        }
        return topLv >= 60;
      },
      choices: [
        {
          text: "📊 用数据优化职业路径",
          hint: "最高技能XP+20，心智+13",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataCareerOptSeen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 20);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 13);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据优化职业路径。数据让选择更理性。技能XP+20，心智+13。", "success");
            }
          },
        },
        {
          text: "🤷 凭感觉走就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataCareerOptSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭感觉走就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "data_social_intelligence",
      phase: "street",
      _isChainEvent: false,
      icon: "👥",
      title: "数据驱动的社交情报",
      story: "你开始分析自己的社交网络数据——好感分布、互动频率、关系深度、互惠次数。\n\n这些洞察让你发现了一些有趣规律：某些NPC是「关键节点」，某些关系是「高价值投资」。\n\n你开始用数据「经营」人际关系，而不是凭感觉。",
      triggers: { minDay: 750, excludeFlags: ["_dataSocIntelSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var highNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 55) highNpcs++;
        }
        return highNpcs >= 8;
      },
      choices: [
        {
          text: "👥 用数据经营社交网络",
          hint: "心智+14，NPC好感+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataSocIntelSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 55) {
                  applyAffinityChange(st, id, 10, "数据洞察");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 14);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👥 你用数据经营社交网络。数据让关系更精准。心智+14，好感+10。", "success");
            }
          },
        },
        {
          text: "🤷 关系不用分析，真心换真心",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataSocIntelSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得真心换真心就好。心智+3。", "info");
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
