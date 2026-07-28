/**
 * 域H(Phase2/公司) 联动增强 R370
 * 第十四轮循环——公司运营的多维回响，完成14域十四轮全覆盖。
 * 桥接：
 *   H→C  company_leadership_v5       公司→领导力v5（职业/成长·管理传承）
 *   H→G  company_sustainability_v3   公司→可持续发展v3（核心机制·基业长青）
 *   H→A  company_economic_dashboard_v2 公司→经济面板v2（数据/数值·经营可视化）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR370Loaded) return;
  RANDOM_EVENTS._domainHLinkageR370Loaded = true;

  var EVENTS = [
    {
      id: "company_leadership_v5",
      phase: "corporate",
      _isChainEvent: false,
      icon: "👔",
      title: "领导力的传承",
      story: "你在公司里培养了一批骨干，他们开始独当一面。\n\n你发现，真正的领导力不是你有多强，而是你能让多少人变强。\n\n你开始把自己的管理经验整理成文档，分享给团队。\n\n「一个好的领导者，不是拥有最多追随者的人，而是培养最多领导者的人。」",
      triggers: { minDay: 120, excludeFlags: ["_companyLeadershipV5Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        var empCount = (st.startup.company.employees && st.startup.company.employees.length) || 0;
        return empCount >= 4;
      },
      choices: [
        {
          text: "👔 培养团队领导力",
          hint: "心智+6，全员忠诚+3，管理经验+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyLeadershipV5Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.skills && st.skills.management && typeof addSkillXp === "function") {
              addSkillXp("management", 5); // [R620 A类修复] 原addSkillXp(st,...) state作首参→XP静默丢弃
            }
            if (st.startup && st.startup.company && st.startup.company.employees) {
              for (var i = 0; i < st.startup.company.employees.length; i++) {
                if (st.startup.company.employees[i]) {
                  st.startup.company.employees[i].loyalty = Math.min(100, (st.startup.company.employees[i].loyalty || 50) + 3);
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👔 你培养了团队领导力。好的领导者培养更多领导者。心智+6，管理经验+5，全员忠诚+3。", "success");
            }
          },
        },
        {
          text: "📋 做好自己",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyLeadershipV5Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你做好自己。以身作则也是领导力。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "company_sustainability_v3",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🌱",
      title: "可持续的发展",
      story: "你发现，公司的发展不能只靠烧钱和冲业绩。\n\n真正的可持续发展，是建立健康的现金流、培养稳定的团队、打造有竞争力的产品。\n\n你开始思考：三年后公司在做什么？五年后呢？十年后呢？\n\n「做一家百年老店，不是靠运气，而是靠每一天的积累。」",
      triggers: { minDay: 150, excludeFlags: ["_companySustainabilityV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.reputation || 0) >= 25;
      },
      choices: [
        {
          text: "🌱 制定可持续发展计划",
          hint: "心智+6，公司声誉+6，心情+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companySustainabilityV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 6;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌱 你制定了可持续发展计划。做百年老店靠每一天的积累。心智+6，声誉+6，心情+5。", "success");
            }
          },
        },
        {
          text: "📊 专注当下",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companySustainabilityV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你专注当下。把握今天才能拥有明天。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "company_economic_dashboard_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司经济面板",
      story: "你打开公司的经济面板，上面显示着各项财务数据。\n\n收入、成本、利润、现金流、资产负债……每一项数据都在告诉你公司的健康状况。\n\n你发现，经营公司就像驾驶一艘船，经济面板就是你的导航仪。\n\n「没有数据支撑的决策，就像没有导航的航行。」",
      triggers: { minDay: 90, excludeFlags: ["_companyEconomicDashboardV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.startup && st.startup.company);
      },
      choices: [
        {
          text: "📊 完善经济分析面板",
          hint: "心智+5，会计经验+5，运营效率",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyEconomicDashboardV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.skills && st.skills.accounting && typeof addSkillXp === "function") {
              addSkillXp("accounting", 5); // [R620 A类修复] 原addSkillXp(st,...) state作首参→XP静默丢弃
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你完善了经济分析面板。没有数据支撑的决策就像没有导航的航行。心智+5，会计经验+5。", "success");
            }
          },
        },
        {
          text: "📋 看报表就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyEconomicDashboardV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你看报表就行。心里有数。心智+2。", "info");
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