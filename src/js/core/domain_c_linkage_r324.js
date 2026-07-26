/**
 * 域C(职业/成长) 联动增强 R324
 * 第九轮循环——技能积累的多维回响。
 * 桥接：
 *   C→A  career_data_accumulation    职业→数据积累（数据/数值·信息沉淀）
 *   C→B  career_event_story          职业→事件故事（事件/叙事·职业叙事）
 *   C→H  career_company_bridge       职业→公司桥梁（公司·技能变现）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR324Loaded) return;
  RANDOM_EVENTS._domainCLinkageR324Loaded = true;

  var EVENTS = [
    {
      id: "career_data_accumulation",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "职业数据的积累",
      story: "你开始系统地记录和分析自己的职业数据——工作天数、收入增长、技能提升、晋升次数。\n\n这些数据让你发现了一些有趣的规律：某些时段进步更快，某些技能组合更有价值，某些选择导致更好的长期结果。\n\n你开始用数据「驾驶」自己的职业发展，而不是凭感觉。",
      triggers: { minDay: 400, excludeFlags: ["_careerDataAccumSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 300;
      },
      choices: [
        {
          text: "📊 建立职业数据面板",
          hint: "心智+10，置职业数据flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDataAccumSeen = true;
            st.flags._careerDataPanel = true;
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
            st.flags._careerDataAccumSeen = true;
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
      id: "career_event_story",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "职业经历是故事素材",
      story: "你发现，职业生涯中的经历是最好的故事素材——第一次入职的紧张、第一次晋升的喜悦、第一次被解雇的失落、第一次创业的决定。\n\n你开始把这些经历写下来，不仅是记录，也是对自己人生的「叙事重构」。\n\n「经历不仅是记忆，也是故事。」",
      triggers: { minDay: 350, excludeFlags: ["_careerEventStorySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 250;
      },
      choices: [
        {
          text: "📖 写下职业故事",
          hint: "心情+12，心智+9",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerEventStorySeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了职业故事。经历不仅是记忆，也是故事。心情+12，心智+9。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，记住就好",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerEventStorySeen = true;
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
    {
      id: "career_company_bridge",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🌉",
      title: "职业经历是创业桥梁",
      story: "你发现，多年的职业经历是创业最坚实的基础——行业知识、人脉资源、管理经验、对市场的理解。\n\n你开始把职业积累「迁移」到公司运营中，而不是从零开始。\n\n「打工不是目的，是积累创业资本的过程。」",
      triggers: { minDay: 400, excludeFlags: ["_careerCompanyBridgeSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.career || !st.career.currentJob || !st.startup || !st.startup.company) return false;
        return (st.career.currentJob.workDays || 0) >= 365;
      },
      choices: [
        {
          text: "🌉 把职业积累迁移到公司",
          hint: "心智+10，公司声誉+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerCompanyBridgeSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 8;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌉 你把职业积累迁移到公司。打工是积累创业资本的过程。心智+10，声誉+8。", "success");
            }
          },
        },
        {
          text: "🤷 职业归职业，创业归创业",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerCompanyBridgeSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得职业和创业应该分开。心智+3。", "info");
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
