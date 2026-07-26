/**
 * 域H(Phase2/公司) 联动增强 R312
 * 第七轮循环——公司运营的多维回响，完成8域七轮全覆盖。
 * 桥接：
 *   H→G  company_founder_legacy      创始人→人生传承（核心机制·生命主线）
 *   H→A  company_economic_impact_v2  公司→经济回馈（数据/数值·经营贡献）
 *   H→C  company_team_culture_v2    公司→团队文化（职业/成长·管理传承）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR312Loaded) return;
  RANDOM_EVENTS._domainHLinkageR312Loaded = true;

  var EVENTS = [
    {
      id: "company_founder_legacy",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🌟",
      title: "创始人的传承",
      story: "你开始思考自己的「传承」——你希望在这座城市留下什么？\n\n不仅是公司和利润，还有文化、价值观、和一群被培养出来的人。你开始写一本「创始人手记」，记录自己的创业心得和人生感悟。\n\n「公司会倒闭，但精神会传承。」",
      triggers: { minDay: 500, excludeFlags: ["_companyFounderLegacySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.valuation || 0) >= 1000000;
      },
      choices: [
        {
          text: "🌟 写下创始人手记",
          hint: "心智+12，公司声誉+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyFounderLegacySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 10;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌟 你写下了创始人手记。公司会倒闭，但精神会传承。心智+12，声誉+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，赚钱就行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyFounderLegacySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得赚钱比记录重要。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "company_economic_impact_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司对个人经济的回馈",
      story: "公司开始稳定盈利了。这些利润不仅是数字，也是你多年努力的回报。\n\n你第一次感受到「企业家精神」的创造——不仅是为自己，也是为团队、为社会创造价值。公司的成功，反哺了你的个人财富。\n\n你开始理解「商业向善」的真正含义。",
      triggers: { minDay: 400, excludeFlags: ["_companyEconImpactV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company || !st.resources) return false;
        return (st.startup.company.revenue || 0) >= 50000;
      },
      choices: [
        {
          text: "📊 把部分利润投入个人投资",
          hint: "现金+10000，置投资意识flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyEconImpactV2Seen = true;
            st.flags._dataInvestorMindset = true;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 10000;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你把部分利润投入个人投资。商业向善，是最好的商业模式。现金+10000。", "success");
            }
          },
        },
        {
          text: "🏭 利润再投入公司发展",
          hint: "心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyEconImpactV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏭 你选择把利润再投入公司。心智+5。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "company_team_culture_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "👥",
      title: "公司团队文化v2",
      story: "你发现，公司的文化深受你个人风格的影响。\n\n如果你是一个热心的人，公司就会充满人情味；如果你是一个严谨的人，公司就会注重细节。你开始有意识地塑造一种「温暖而专业」的文化。\n\n你决定投资团队建设——不仅是技能培训，还有团队凝聚力和员工福利。",
      triggers: { minDay: 350, excludeFlags: ["_companyTeamCultureV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return st.startup.company.team && st.startup.company.team.length >= 6;
      },
      choices: [
        {
          text: "👥 投资团队文化建设",
          hint: "团队平均忠诚度+10，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyTeamCultureV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (st.startup && st.startup.company && st.startup.company.team) {
              for (var i = 0; i < st.startup.company.team.length; i++) {
                if (st.startup.company.team[i]) {
                  st.startup.company.team[i].loyalty = Math.min(100, (st.startup.company.team[i].loyalty || 50) + 10);
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👥 你投资了团队文化建设。文化不是口号，是每天的选择。忠诚度+10，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 文化不用投资，赚钱最重要",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyTeamCultureV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得赚钱比文化重要。心智+3。", "info");
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
