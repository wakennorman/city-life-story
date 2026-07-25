/**
 * 域H(Phase2/公司) 联动增强 R279
 * 第三轮循环——公司运营的多维回响，完成8域三轮全覆盖。
 * 桥接：
 *   H→G  company_founder_lifestyle  创始人→生活品质（核心机制·工作生活平衡）
 *   H→A  company_economic_impact    公司→经济数据（数据/数值·经营回馈）
 *   H→C  company_team_growth        团队→职业成长（职业/成长·管理传承）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR279Loaded) return;
  RANDOM_EVENTS._domainHLinkageR279Loaded = true;

  var EVENTS = [
    {
      id: "company_founder_lifestyle",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🧘",
      title: "创始人的生活品质",
      story: "公司终于走上了正轨，你开始有时间思考一个问题：创业的目的是什么？\n\n是为了赚钱？是为了实现梦想？还是为了证明自己？\n\n你决定给自己放一天假，去做一些「无用」的事——看一场电影、吃一顿好饭、陪陪家人。你发现，生活品质不是创业的代价，而是创业的意义。",
      triggers: { minDay: 300, excludeFlags: ["_companyFounderLifestyleSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        if (!st.needs) return false;
        return (st.startup.company.valuation || 0) >= 100000 && (st.needs.happiness || 50) < 55;
      },
      choices: [
        {
          text: "🧘 给自己放一天假",
          hint: "心情+12，健康+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyFounderLifestyleSeen = true;
            st.flags._founderWellnessDay = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧘 你给自己放了一天假。生活品质不是创业的代价，而是创业的意义。心情+12，健康+8。", "success");
            }
          },
        },
        {
          text: "💼 公司离不开我，继续干",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyFounderLifestyleSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你选择继续干。创业者没有假期。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "company_economic_impact",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司对个人经济的回馈",
      story: "公司开始盈利了。这些利润不仅是数字，更是你多年努力的回报。\n\n你第一次感受到「钱生钱」的复利效应——不仅是个人的投资，也是公司的成长。公司的成功，反哺了你的个人财富。\n\n你开始理解「企业家精神」的真正含义：创造不只是为自己，也是为团队、为社会。",
      triggers: { minDay: 250, excludeFlags: ["_companyEconImpactSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 10000;
      },
      choices: [
        {
          text: "📊 把部分利润投入个人投资",
          hint: "现金+3000，置投资意识flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyEconImpactSeen = true;
            st.flags._dataInvestorMindset = true;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 3000;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你把部分利润投入个人投资。公司是最大的资产。现金+3000。", "success");
            }
          },
        },
        {
          text: "🏭 把利润再投入公司发展",
          hint: "心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyEconImpactSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏭 你把利润再投入公司发展。规模是最好的护城河。心智+5。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "company_team_growth",
      phase: "corporate",
      _isChainEvent: false,
      icon: "👥",
      title: "团队成长是最好的回报",
      story: "你发现，公司最宝贵的资产不是产品、不是利润，而是团队。\n\n那些和你一起熬过难关的人，那些从新手成长为核心骨干的人，那些愿意相信你并跟随你的人——他们是公司真正的价值。\n\n你开始把「培养人」作为管理的核心，而不仅仅是「完成事」。",
      triggers: { minDay: 200, excludeFlags: ["_companyTeamGrowthSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return st.startup.company.team && st.startup.company.team.length >= 4;
      },
      choices: [
        {
          text: "👥 投资团队培训",
          hint: "心智+7，团队平均忠诚度+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyTeamGrowthSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (st.startup && st.startup.company && st.startup.company.team) {
              for (var i = 0; i < st.startup.company.team.length; i++) {
                if (st.startup.company.team[i]) {
                  st.startup.company.team[i].loyalty = Math.min(100, (st.startup.company.team[i].loyalty || 50) + 5);
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👥 你投资了团队培训。人是最重要的资产。心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 团队自己成长就好",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyTeamGrowthSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得团队自己成长就好。心智+3。", "info");
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
