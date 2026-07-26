/**
 * 域C(职业/成长) 联动增强 R365
 * 第十四轮循环——技能积累的多维回响。
 * 桥接：
 *   C→B  career_event_v4             职业→事件（事件/叙事·职业故事）
 *   C→G  career_life_balance_v3       职业→生活平衡（核心机制·身心健康）
 *   C→H  career_company_v3            职业→公司（公司·技能变现）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR365Loaded) return;
  RANDOM_EVENTS._domainCLinkageR365Loaded = true;

  var EVENTS = [
    {
      id: "career_event_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "职业故事",
      story: "你发现，职业生涯中的经历是最好的故事素材——第一次入职的紧张、第一次晋升的喜悦、第一次被解雇的失落、第一次创业的决定。\n\n你开始把这些经历写下来，不仅是记录，也是对自己人生的「叙事重构」。\n\n「经历不仅是记忆，也是故事。」",
      triggers: { minDay: 60, excludeFlags: ["_careerEventV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        return !!(job && job.path && (job.workDays || 0) >= 60);
      },
      choices: [
        {
          text: "📖 写下职业故事",
          hint: "心情+8，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerEventV4Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了职业故事。经历不仅是记忆，也是故事。心情+8，心智+5。", "success");
            }
          },
        },
        {
          text: "🤷 记住就好",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerEventV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得记住就好。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "career_life_balance_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "⚖️",
      title: "职业与生活",
      story: "你发现，过度投入工作开始影响你的生活——忽略了健康、疏远了朋友、失去了爱好。\n\n你开始思考：工作的目的是什么？是为了更好的生活，还是成了生活的全部？\n\n你决定设定一个「工作结束时间」，把更多的时间留给生活本身。",
      triggers: { minDay: 90, excludeFlags: ["_careerLifeBalanceV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.career || !st.career.currentJob || !st.needs || !st.status) return false;
        return (st.career.currentJob.workDays || 0) >= 90 && ((st.needs.happiness || 50) < 50 || (st.status.health || 100) < 60);
      },
      choices: [
        {
          text: "⚖️ 设定工作结束时间",
          hint: "心情+10，健康+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerLifeBalanceV3Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("⚖️ 你设定了工作结束时间。工作是为了更好地生活。心情+10，健康+10。", "success");
            }
          },
        },
        {
          text: "💼 继续拼",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerLifeBalanceV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你选择继续拼。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "career_company_v3",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "职业是创业的资本",
      story: "你发现，多年的职业经历是创业最坚实的基础——行业知识、人脉资源、管理经验、对市场的理解。\n\n你开始把职业积累「迁移」到公司运营中，而不是从零开始。\n\n「打工不是目的，是积累创业资本的过程。」",
      triggers: { minDay: 120, excludeFlags: ["_careerCompanyV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.career || !st.career.currentJob || !st.startup || !st.startup.company) return false;
        return (st.career.currentJob.workDays || 0) >= 120;
      },
      choices: [
        {
          text: "🏢 把职业积累迁移到公司",
          hint: "心智+6，公司声誉+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerCompanyV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 6;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏢 你把职业积累迁移到公司。打工是积累创业资本的过程。心智+6，声誉+6。", "success");
            }
          },
        },
        {
          text: "💼 专注公司运营",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerCompanyV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你专注公司运营。心智+2。", "info");
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