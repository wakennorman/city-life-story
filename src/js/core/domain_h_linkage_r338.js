/**
 * 域H(Phase2/公司) 联动增强 R338
 * 第十轮循环——公司运营的多维回响，完成10域十轮全覆盖。
 * 桥接：
 *   H→A  company_data_dashboard_v3    公司→数据面板（数据/数值·经营可视化）
 *   H→C  company_leadership_v3        公司→领导力（职业/成长·管理传承）
 *   H→D  company_social_impact        公司→社会影响（NPC/社交·企业责任）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR338Loaded) return;
  RANDOM_EVENTS._domainHLinkageR338Loaded = true;

  var EVENTS = [
    {
      id: "company_data_dashboard_v3",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司数据面板v3",
      story: "你打开公司数据面板，看到营收、利润、现金流、团队效率、市场份额等关键经营指标的实时数据。\n\n这些数字是你创业多年积累的成果。每一条上升的曲线，都是团队一起拼出来的。\n\n你开始用数据「驾驶」公司，而不是凭感觉。",
      triggers: { minDay: 500, excludeFlags: ["_companyDataDashV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 100000;
      },
      choices: [
        {
          text: "📊 设置经营预警系统",
          hint: "心智+12，公司声誉+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyDataDashV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 10;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了经营预警系统。数据让经营更精准。心智+12，声誉+10。", "success");
            }
          },
        },
        {
          text: "🤷 大概看看就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyDataDashV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得大概看看就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "company_leadership_v3",
      phase: "corporate",
      _isChainEvent: false,
      icon: "👥",
      title: "领导力成长v3",
      story: "你发现，带团队不仅是管理任务，也是自我成长的过程。\n\n每一次解决团队冲突、每一次激励员工、每一次做出艰难决定，都在塑造你的领导力。你开始理解，「领导力」不是天赋，是练出来的。\n\n你开始把「培养人」作为管理的核心，而不仅仅是「完成事」。",
      triggers: { minDay: 500, excludeFlags: ["_companyLeadershipV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return st.startup.company.team && st.startup.company.team.length >= 8;
      },
      choices: [
        {
          text: "👥 投资团队领导力培训",
          hint: "心智+12，团队平均忠诚度+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyLeadershipV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (st.startup && st.startup.company && st.startup.company.team) {
              for (var i = 0; i < st.startup.company.team.length; i++) {
                if (st.startup.company.team[i]) {
                  st.startup.company.team[i].loyalty = Math.min(100, (st.startup.company.team[i].loyalty || 50) + 12);
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👥 你投资了团队领导力培训。领导力是练出来的。心智+12，忠诚度+12。", "success");
            }
          },
        },
        {
          text: "🤷 领导力不用培训，实战中成长",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyLeadershipV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得实战比培训重要。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "company_social_impact",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🌍",
      title: "公司社会影响",
      story: "你开始思考公司的「社会影响」——不仅是赚钱，也是为社会创造价值。\n\n你决定推行一些企业社会责任举措：支持本地社区、减少环境污染、提供员工福利。这些举措虽然短期增加成本，但长期来看提升了公司的品牌价值。\n\n「商业向善，是最好的商业模式。」",
      triggers: { minDay: 600, excludeFlags: ["_companySocialImpactSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company || !st.relationships) return false;
        return (st.startup.company.valuation || 0) >= 1000000;
      },
      choices: [
        {
          text: "🌍 推行企业社会责任",
          hint: "心智+13，公司声誉+15，NPC好感+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companySocialImpactSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 13);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 15;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met) {
                  applyAffinityChange(st, id, 8, "企业社会责任");
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌍 你推行了企业社会责任。商业向善是最好的商业模式。心智+13，声誉+15，好感+8。", "success");
            }
          },
        },
        {
          text: "🤷 赚钱更重要",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companySocialImpactSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得赚钱更重要。心智+4。", "info");
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
