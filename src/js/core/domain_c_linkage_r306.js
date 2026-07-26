/**
 * 域C(职业/成长) 联动增强 R306
 * 第七轮循环——技能积累的多维回响。
 * 桥接：
 *   C→E  skill_investment_insight     技能→投资洞察（经济·知识迁移）
 *   C→B  career_event_catalyst_v2     职业→事件催化剂（事件/叙事·经历变现）
 *   C→D  career_social_network        职业→社交网络（NPC/社交·职业人脉）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR306Loaded) return;
  RANDOM_EVENTS._domainCLinkageR306Loaded = true;

  function countHighSkillsC306(st, threshold) {
    threshold = threshold || 40;
    if (!st || !st.skills) return 0;
    var count = 0;
    for (var k in st.skills) {
      if ((st.skills[k] && st.skills[k].level || 0) >= threshold) count++;
    }
    return count;
  }

  var EVENTS = [
    {
      id: "skill_investment_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "技能洞察迁移投资",
      story: "你发现，多年积累的专业技能开始影响你的投资判断。\n\n一个懂编程的人能看懂科技公司的技术壁垒，一个懂财务的人能分析上市公司的报表，一个懂销售的人能感知市场需求的微妙变化。\n\n你的专业，成了你投资的「护城河」。",
      triggers: { minDay: 250, excludeFlags: ["_skillInvInsightSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.investment) return false;
        return countHighSkillsC306(st, 50) >= 1;
      },
      choices: [
        {
          text: "💡 用专业眼光选投资标的",
          hint: "心智+9，置投资洞察flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillInvInsightSeen = true;
            st.flags._skillDrivenInvestment = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💡 你用专业眼光选投资标的。知识就是最大的护城河。心智+9。", "success");
            }
          },
        },
        {
          text: "🤷 投资归投资，专业归专业",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillInvInsightSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得投资和专业应该分开。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "career_event_catalyst_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "⚡",
      title: "职业经历是事件的催化剂",
      story: "你发现，职业积累的经历开始催化更多有趣的事件。\n\n一个手艺人会遇到更多「被认可」的故事，一个销售会遇到更多「被拒绝」的故事，一个管理者会遇到更多「被依赖」的故事。\n\n你的职业，成了你人生故事的「催化剂」。",
      triggers: { minDay: 200, excludeFlags: ["_careerEventCatalystV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 25;
      },
      choices: [
        {
          text: "⚡ 主动寻找职业相关的事件",
          hint: "最高技能XP+12，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerEventCatalystV2Seen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("⚡ 你主动寻找职业相关的事件。经历是故事的催化剂。技能XP+12，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 事件是随机的，不用刻意寻找",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerEventCatalystV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得事件是随机的。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "career_social_network",
      phase: "street",
      _isChainEvent: false,
      icon: "🕸️",
      title: "职业社交网络",
      story: "你发现，职业积累让你结识了很多有价值的人脉。\n\n前同事、客户、供应商、行业前辈——这些人不仅是职业资源，也是你在这座城市里的「社交资本」。\n\n你开始理解，「专业能力」和「社交网络」是职业发展的双翼。",
      triggers: { minDay: 250, excludeFlags: ["_careerSocialNetworkSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships || !st.career || !st.career.currentJob) return false;
        var metNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 35) metNpcs++;
        }
        return metNpcs >= 4;
      },
      choices: [
        {
          text: "🕸️ 主动经营职业社交网络",
          hint: "NPC好感+4，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerSocialNetworkSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 35) {
                  applyAffinityChange(st, id, 4, "职业社交");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🕸️ 你主动经营职业社交网络。专业能力和社交网络是职业发展的双翼。好感+4，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 社交不用经营，本事最重要",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerSocialNetworkSeen = true;
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
