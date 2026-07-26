/**
 * 域H(Phase2/公司) 联动增强 R378
 * 第十五轮循环——公司运营的多维回响，完成15域十五轮全覆盖。
 * 桥接：
 *   H→B  company_narrative_v2       公司→叙事v2（事件/叙事·企业故事）
 *   H→D  company_social_v3          公司→社交v3（NPC/社交·企业责任）
 *   H→E  company_finance_v2         公司→财务v2（经济·资本运作）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR378Loaded) return;
  RANDOM_EVENTS._domainHLinkageR378Loaded = true;

  var EVENTS = [
    {
      id: "company_narrative_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📖",
      title: "公司的故事",
      story: "你在公司内部发起了一个「故事分享会」，让员工们分享自己在公司的经历和感受。\n\n你发现，每家公司都有自己的故事——那些加班到深夜的日子、那些攻克难关的时刻、那些团队一起欢笑的瞬间。\n\n这些故事构成了公司的文化，也是公司最宝贵的资产。\n\n「伟大的公司不仅卖产品，还在创造故事。」",
      triggers: { minDay: 90, excludeFlags: ["_companyNarrativeV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.employees && st.startup.company.employees.length) >= 2;
      },
      choices: [
        {
          text: "📖 分享公司故事",
          hint: "心智+5，公司文化+5，员工忠诚+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyNarrativeV2Seen = true;
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
              StateManager.addMessage("📖 你分享了公司故事。伟大的公司不仅卖产品，还在创造故事。心智+5，声誉+5，忠诚+3。", "success");
            }
          },
        },
        {
          text: "📋 专注业务",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyNarrativeV2Seen = true;
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
    {
      id: "company_social_v3",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🌍",
      title: "公司的社会角色",
      story: "你意识到，公司不仅是一个经济组织，也是社会的一部分。\n\n员工在这里工作、成长、建立关系；客户因为信任而选择你们；社区因为你们的存在而受益。\n\n「一家好的公司，既要赚钱，也要让世界变得更好一点。」",
      triggers: { minDay: 120, excludeFlags: ["_companySocialV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.startup && st.startup.company && (st.startup.company.reputation || 0) >= 20);
      },
      choices: [
        {
          text: "🌍 践行企业社会责任",
          hint: "心智+5，声誉+8，心情+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companySocialV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 8;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌍 你践行了企业社会责任。好的公司既要赚钱，也要让世界更好。心智+5，声誉+8，心情+5。", "success");
            }
          },
        },
        {
          text: "📊 专注增长",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companySocialV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你专注增长。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "company_finance_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "💰",
      title: "公司的财务智慧",
      story: "你开始用更专业的视角来看待公司的财务——\n\n现金流管理、成本控制、投资回报率、财务风险……\n\n你发现，很多公司倒闭不是因为不赚钱，而是因为财务管理不善。\n\n「会赚钱是本事，会管钱是智慧。」",
      triggers: { minDay: 150, excludeFlags: ["_companyFinanceV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.startup && st.startup.company);
      },
      choices: [
        {
          text: "💰 优化财务管理",
          hint: "心智+5，会计经验+5，财务健康",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyFinanceV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.skills && st.skills.accounting && typeof addSkillXp === "function") {
              addSkillXp(st, "accounting", 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你优化了财务管理。会赚钱是本事，会管钱是智慧。心智+5，会计经验+5。", "success");
            }
          },
        },
        {
          text: "📊 看报表就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyFinanceV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你看报表就行。心智+2。", "info");
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