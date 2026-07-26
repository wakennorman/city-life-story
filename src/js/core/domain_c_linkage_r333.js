/**
 * 域C(职业/成长) 联动增强 R333
 * 第十轮循环——技能积累的多维回响。
 * 桥接：
 *   C→H  skill_entrepreneurship         技能→创业（公司·技能变现）
 *   C→A  career_data_v2                职业→数据（数据/数值·信息沉淀）
 *   C→B  career_narrative_v2           职业→叙事（事件/叙事·职业故事）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR333Loaded) return;
  RANDOM_EVENTS._domainCLinkageR333Loaded = true;

  var EVENTS = [
    {
      id: "skill_entrepreneurship",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🚀",
      title: "技能是创业的根基",
      story: "你发现，多年积累的技能是创业最坚实的基础。\n\n编程技能让你能快速验证产品想法，销售技能让你能拿到第一批客户，管理技能让你能带好团队。你不再是「只会打工的人」，而是「能创造价值的人」。\n\n你开始把职业积累「迁移」到公司运营中，而不是从零开始。\n\n「打工不是目的，是积累创业资本的过程。」",
      triggers: { minDay: 500, excludeFlags: ["_skillEntrepreneurshipSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.startup || !st.startup.company) return false;
        var topSkill = "", topLv = 0;
        for (var k in st.skills) {
          var lv = (st.skills[k] && st.skills[k].level) || 0;
          if (lv > topLv) { topLv = lv; topSkill = k; }
        }
        return topLv >= 60;
      },
      choices: [
        {
          text: "🚀 把技能转化为公司的核心竞争力",
          hint: "心智+12，公司声誉+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillEntrepreneurshipSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 10;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🚀 你把技能转化为公司的核心竞争力。技能是最好的创业资本。心智+12，声誉+10。", "success");
            }
          },
        },
        {
          text: "🤷 技能和创业是两回事",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillEntrepreneurshipSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得技能和创业是两回事。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "career_data_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "职业数据v2",
      story: "你开始用数据审视自己的职业历程——工作天数、收入增长、技能提升速度、晋升次数。\n\n这些数字让你发现了一些有趣的规律：某些时段进步更快，某些技能组合更有价值，某些选择导致更好的长期结果。\n\n你开始用数据「驾驶」自己的职业发展，而不是凭感觉。",
      triggers: { minDay: 450, excludeFlags: ["_careerDataV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 350;
      },
      choices: [
        {
          text: "📊 建立职业数据面板",
          hint: "心智+10，置职业数据flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDataV2Seen = true;
            st.flags._careerDataPanelV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你建立了职业数据面板。数据让职业发展有迹可循。心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用那么系统",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDataV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用那么系统。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "career_narrative_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "职业经历是故事素材v2",
      story: "你发现，职业生涯中的经历是最好的故事素材——第一次入职的紧张、第一次晋升的喜悦、第一次被解雇的失落、第一次创业的决定。\n\n你开始把这些经历写下来，不仅是记录，也是对自己人生的「叙事重构」。\n\n「经历不仅是记忆，也是故事。」",
      triggers: { minDay: 500, excludeFlags: ["_careerNarrativeV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 400;
      },
      choices: [
        {
          text: "📖 写下职业故事",
          hint: "心情+15，心智+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerNarrativeV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了职业故事。经历不仅是记忆，也是故事。心情+15，心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，记住就好",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerNarrativeV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+3。", "info");
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
