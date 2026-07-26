/**
 * 域H(Phase2/公司) 联动增强 R362
 * 第十三轮循环——公司运营的多维回响，完成13域十三轮全覆盖。
 * 桥接：
 *   H→C  company_leadership_v4       公司→领导力（职业/成长·管理传承）
 *   H→D  company_social_impact_v2    公司→社会影响（NPC/社交·企业责任）
 *   H→F  company_ui_dashboard        公司→UI仪表盘（UI/UX·经营可视化）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR362Loaded) return;
  RANDOM_EVENTS._domainHLinkageR362Loaded = true;

  var EVENTS = [
    {
      // H→C: 公司领导力→职业成长（职业/成长·管理传承）
      id: "company_leadership_v4",
      phase: "corporate",
      _isChainEvent: false,
      icon: "👔",
      title: "管理是一门手艺",
      story: "你在公司里管理团队已经有一段时间了。你发现，管理不是「发号施令」，而是「让每个人变得更好」。\n\n你开始把管理经验沉淀下来——如何激励员工、如何处理冲突、如何做决策。\n\n这些经验不仅对公司有用，对你个人的职业成长也是宝贵的财富。",
      triggers: { minDay: 120, excludeFlags: ["_companyLeadershipV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        var empCount = (st.startup.company.employees && st.startup.company.employees.length) || 0;
        return empCount >= 3;
      },
      choices: [
        {
          text: "👔 总结管理经验，提升领导力",
          hint: "心智+6，管理经验+5，领导力flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyLeadershipV4Seen = true;
            st.flags._leadershipInsight = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.skills && st.skills.management && typeof addSkillXp === "function") {
              addSkillXp(st, "management", 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👔 你总结了管理经验。管理不是发号施令，是让每个人变得更好。心智+6，管理经验+5。", "success");
            }
          },
        },
        {
          text: "📋 做好本职工作就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyLeadershipV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你做好本职工作。以身作则也是领导力。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // H→D: 公司社会影响→NPC社交（NPC/社交·企业责任）
      id: "company_social_impact_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🌍",
      title: "企业的社会责任",
      story: "你的公司有了一定的规模，开始有员工、有客户、有社区影响力。\n\n你发现，企业不只是赚钱的工具，它还对员工、对社区、对社会有责任。\n\n你决定做一些力所能及的事——也许是为社区提供就业机会，也许是支持当地的公益项目。",
      triggers: { minDay: 90, excludeFlags: ["_companySocialImpactV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.reputation || 0) >= 30;
      },
      choices: [
        {
          text: "🌍 开展社区公益项目",
          hint: "公司声誉+10，NPC好感+5，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companySocialImpactV2Seen = true;
            if (st.startup && st.startup.company) {
              st.startup.company.reputation = (st.startup.company.reputation || 0) + 10;
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌍 你开展了社区公益项目。企业不只是赚钱，还要有社会担当。声誉+10，心智+5。", "success");
            }
          },
        },
        {
          text: "🏢 专注业务发展",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companySocialImpactV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏢 你专注业务发展。先把公司做好，才有能力回馈社会。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // H→F: 公司UI仪表盘（UI/UX·经营可视化）
      id: "company_ui_dashboard",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "经营仪表盘",
      story: "你看着公司的经营数据，发现信息越来越多了——收入、支出、利润、员工满意度、客户评价……\n\n需要把这些数据整合到一个清晰的仪表盘上，才能快速做出决策。\n\n你开始设计公司的经营仪表盘，让数据自己说话。",
      triggers: { minDay: 60, excludeFlags: ["_companyUiDashboardSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.employees && st.startup.company.employees.length) >= 2;
      },
      choices: [
        {
          text: "📊 建立数据仪表盘",
          hint: "心智+5，办公效率+5，数据驱动flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyUiDashboardSeen = true;
            st.flags._dataDrivenCompany = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.skills && st.skills.accounting && typeof addSkillXp === "function") {
              addSkillXp(st, "accounting", 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你建立了数据仪表盘。让数据自己说话。心智+5，会计经验+5。", "success");
            }
          },
        },
        {
          text: "📋 看看报表就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyUiDashboardSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你看看报表，心里有数。心智+2。", "info");
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