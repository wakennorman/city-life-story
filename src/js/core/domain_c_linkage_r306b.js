/**
 * 域C(职业/成长) 联动增强 R306b（并行窗口原创内容,因R306文件覆盖竞态丢失,R309轮恢复）
 * 第七轮循环——技能积累的多维回响。
 * 桥接：
 *   C→B  career_event_catalyst_v2     职业→事件催化剂（事件/叙事·经历变现）
 *   C→D  career_social_network        职业→社交网络（NPC/社交·职业人脉）
 * 注：原第3事件 skill_investment_insight 为 domain_c_linkage_r272.js 既有事件的同id重复（C类缺陷），恢复时剔除以免双注册。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR306bLoaded) return;
  RANDOM_EVENTS._domainCLinkageR306bLoaded = true;

  var EVENTS = [
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
