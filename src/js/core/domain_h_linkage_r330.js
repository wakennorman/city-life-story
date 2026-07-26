/**
 * 域H(Phase2/公司) 联动增强 R330
 * 第九轮循环——公司运营的多维回响，完成9域九轮全覆盖。
 * 桥接：
 *   H→C  company_leadership_v2       公司→领导力（职业/成长·管理传承）
 *   H→G  company_sustainability_v2   公司→可持续发展（核心机制·基业长青）
 *   H→A  company_economic_dashboard  公司→经济面板（数据/数值·经营可视化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR330Loaded) return;
  RANDOM_EVENTS._domainHLinkageR330Loaded = true;

  var EVENTS = [
    {
      id: "company_leadership_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "👥",
      title: "领导力成长v2",
      story: "你发现，带团队不仅是管理任务，也是自我成长的过程。\n\n每一次解决团队冲突、每一次激励员工、每一次做出艰难决定，都在塑造你的领导力。你开始理解，「领导力」不是天赋，是练出来的。\n\n你开始把「培养人」作为管理的核心，而不仅仅是「完成事」。",
      triggers: { minDay: 400, excludeFlags: ["_companyLeadershipV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return st.startup.company.team && st.startup.company.team.length >= 7;
      },
      choices: [
        {
          text: "👥 投资团队领导力培训",
          hint: "心智+11，团队平均忠诚度+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyLeadershipV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 11);
            if (st.startup && st.startup.company && st.startup.company.team) {
              for (var i = 0; i < st.startup.company.team.length; i++) {
                if (st.startup.company.team[i]) {
                  st.startup.company.team[i].loyalty = Math.min(100, (st.startup.company.team[i].loyalty || 50) + 10);
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👥 你投资了团队领导力培训。领导力是练出来的。心智+11，忠诚度+10。", "success");
            }
          },
        },
        {
          text: "🤷 领导力不用培训，实战中成长",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyLeadershipV2Seen = true;
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
      id: "company_sustainability_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🌱",
      title: "公司可持续发展v2",
      story: "你开始思考公司的「可持续发展」——不仅是财务上的可持续，还有环境和社会责任的可持续。\n\n你决定推行一些「绿色办公」措施：减少纸张使用、鼓励远程办公、支持员工志愿者活动。这些举措虽然短期增加成本，但长期来看提升了公司的品牌价值。\n\n「基业长青不是赚快钱，是创造长期价值。」",
      triggers: { minDay: 500, excludeFlags: ["_companySustainabilityV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.valuation || 0) >= 600000;
      },
      choices: [
        {
          text: "🌱 推行绿色办公v2",
          hint: "心智+12，公司声誉+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companySustainabilityV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 12;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌱 你推行了绿色办公。基业长青是创造长期价值。心智+12，声誉+12。", "success");
            }
          },
        },
        {
          text: "🤷 赚钱更重要",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companySustainabilityV2Seen = true;
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
    {
      id: "company_economic_dashboard",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司经济面板",
      story: "你打开公司经济面板，看到营收、利润、现金流、团队效率、市场份额等关键经营指标的实时数据。\n\n这些数字是你创业多年积累的成果。每一条上升的曲线，都是团队一起拼出来的。\n\n你开始用数据「驾驶」公司，而不是凭感觉。",
      triggers: { minDay: 450, excludeFlags: ["_companyEconDashSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 60000;
      },
      choices: [
        {
          text: "📊 设置经营预警系统",
          hint: "心智+10，公司声誉+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyEconDashSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 8;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了经营预警系统。数据让经营更精准。心智+10，声誉+8。", "success");
            }
          },
        },
        {
          text: "🤷 大概看看就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyEconDashSeen = true;
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
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
