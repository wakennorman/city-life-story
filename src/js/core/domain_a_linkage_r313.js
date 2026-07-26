/**
 * 域A(数据/数值平衡) 联动增强 R313
 * 第八轮循环——数据积累的多维回响。
 * 桥接：
 *   A→C  data_skill_optimization       数据→技能优化（职业/成长·数据驱动）
 *   A→D  data_npc_insight_v2          数据→NPC洞察（NPC/社交·数据理解）
 *   A→E  data_investment_intelligence  数据→投资情报（经济·数据驱动）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR313Loaded) return;
  RANDOM_EVENTS._domainALinkageR313Loaded = true;

  var EVENTS = [
    {
      id: "data_skill_optimization",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "数据驱动的技能优化",
      story: "你开始用数据优化自己的技能学习路径——追踪每项技能的成长速度、投入产出比、与职业目标的匹配度。\n\n这些数据让你发现了一些有趣的规律：某些技能在特定阶段提升更快，某些技能组合的协同效应更强。\n\n你开始用数据「设计」自己的技能树，而不是盲目学习。",
      triggers: { minDay: 300, excludeFlags: ["_dataSkillOptSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.career || !st.career.currentJob) return false;
        var topSkill = "", topLv = 0;
        for (var k in st.skills) {
          var lv = (st.skills[k] && st.skills[k].level) || 0;
          if (lv > topLv) { topLv = lv; topSkill = k; }
        }
        return topLv >= 40;
      },
      choices: [
        {
          text: "📊 用数据优化技能路径",
          hint: "最高技能XP+15，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataSkillOptSeen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据优化技能路径。数据让学习更高效。技能XP+15，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 凭兴趣学就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataSkillOptSeen = true;
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
    {
      id: "data_npc_insight_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "👥",
      title: "NPC行为数据洞察v2",
      story: "你开始深度分析已结识NPC的行为模式——互动频率、好感变化、在场概率。\n\n这些洞察让你发现了一些以前没注意到的规律：某些NPC在特定时段更容易互动，某些类型的礼物效果更好。\n\n你开始用数据「理解」NPC，而不是凭感觉。",
      triggers: { minDay: 250, excludeFlags: ["_dataNpcInsightV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var highNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 45) highNpcs++;
        }
        return highNpcs >= 3;
      },
      choices: [
        {
          text: "👥 用数据优化社交策略",
          hint: "心智+8，NPC好感+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataNpcInsightV2Seen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 45) {
                  applyAffinityChange(st, id, 4, "数据洞察");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👥 你用数据优化社交策略。数据让社交更精准。心智+8，好感+4。", "success");
            }
          },
        },
        {
          text: "🤷 凭直觉就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataNpcInsightV2Seen = true;
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
    {
      id: "data_investment_intelligence",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "数据驱动的投资情报",
      story: "你开始用数据分析自己的投资决策——哪些时段的投资质量最高？哪些类型的资产最适合你的风险偏好？\n\n这些分析让你发现了一些有趣规律：某些时段的投资决策质量更高，某些类型的资产更适合长期持有。\n\n你开始用数据「优化」投资策略，而不是凭感觉。",
      triggers: { minDay: 350, excludeFlags: ["_dataInvIntelSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var inv = st.investment;
        var types = 0;
        if (inv.stockHoldings && inv.stockHoldings.length > 0) types++;
        if ((inv.btcHoldings || 0) > 0) types++;
        if (inv.properties && inv.properties.length > 0) types++;
        return types >= 2;
      },
      choices: [
        {
          text: "📈 用数据优化投资策略",
          hint: "心智+9，置投资情报flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataInvIntelSeen = true;
            st.flags._dataDrivenInvestment = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你用数据优化投资策略。数据让决策更理性。心智+9。", "success");
            }
          },
        },
        {
          text: "🤷 凭经验就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataInvIntelSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭经验就行。心智+3。", "info");
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
