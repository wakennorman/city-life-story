/**
 * 域H(Phase2/公司) 联动增强 R295
 * 第五轮循环——公司运营的多维回响，完成8域五轮全覆盖。
 * 桥接：
 *   H→C  company_leadership_growth  公司→领导力成长（职业/成长·管理传承）
 *   H→G  company_work_life_balance  公司→工作生活平衡（核心机制·身心健康）
 *   H→B  company_legacy_narrative    公司→传承叙事（事件/叙事·历史感）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR295Loaded) return;
  RANDOM_EVENTS._domainHLinkageR295Loaded = true;

  var EVENTS = [
    {
      id: "company_leadership_growth",
      phase: "corporate",
      _isChainEvent: false,
      icon: "👥",
      title: "领导力成长",
      story: "你发现，带团队不仅是管理任务，也是自我成长的过程。\n\n每一次解决团队冲突、每一次激励员工、每一次做出艰难决定，都在塑造你的领导力。你开始理解，「领导力」不是天赋，是练出来的。\n\n你开始把「培养人」作为管理的核心，而不仅仅是「完成事」。",
      triggers: { minDay: 300, excludeFlags: ["_companyLeadershipGrowthSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return st.startup.company.team && st.startup.company.team.length >= 5;
      },
      choices: [
        {
          text: "👥 投资团队领导力培训",
          hint: "心智+9，团队平均忠诚度+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyLeadershipGrowthSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (st.startup && st.startup.company && st.startup.company.team) {
              for (var i = 0; i < st.startup.company.team.length; i++) {
                if (st.startup.company.team[i]) {
                  st.startup.company.team[i].loyalty = Math.min(100, (st.startup.company.team[i].loyalty || 50) + 8);
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👥 你投资了团队领导力培训。领导力是练出来的。心智+9，忠诚度+8。", "success");
            }
          },
        },
        {
          text: "🤷 领导力不用培训，实战中成长",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyLeadershipGrowthSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得实战比培训更重要。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "company_work_life_balance",
      phase: "corporate",
      _isChainEvent: false,
      icon: "⚖️",
      title: "创始人的工作生活平衡",
      story: "公司终于走上了正轨，你开始有时间关注自己的生活。\n\n你发现，创业多年，身体已经发出了不少警告——颈椎不适、睡眠不足、偶尔的胃痛。你决定开始锻炼、调整作息、定期体检。\n\n你意识到，创始人健康是公司最大的「无形资产」。没有健康的创始人，就没有健康的公司。",
      triggers: { minDay: 250, excludeFlags: ["_companyWLBSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company || !st.status || !st.needs) return false;
        return (st.startup.company.valuation || 0) >= 300000 && ((st.status.health || 100) < 65 || (st.needs.happiness || 50) < 55);
      },
      choices: [
        {
          text: "⚖️ 给自己放一天假",
          hint: "健康+12，心情+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyWLBSeen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 12);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("⚖️ 你给自己放了一天假。创始人健康是公司最大的无形资产。健康+12，心情+10。", "success");
            }
          },
        },
        {
          text: "💼 公司离不开我，继续干",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyWLBSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你选择继续干。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "company_legacy_narrative",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📖",
      title: "公司传承叙事",
      story: "你开始思考公司的「传承」——你希望这家公司在你离开后，留下什么？\n\n不仅是产品和利润，还有文化、价值观、和一群被培养出来的人。你开始写一本「公司历史书」，记录创业路上的每一个重要时刻。\n\n「公司会倒闭，但故事会留下来。」",
      triggers: { minDay: 400, excludeFlags: ["_companyLegacySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.valuation || 0) >= 500000;
      },
      choices: [
        {
          text: "📖 写下公司历史书",
          hint: "心智+10，公司声誉+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyLegacySeen = true;
            st.flags._companyHistoryBook = true;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 8;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了公司历史书。公司会倒闭，但故事会留下来。心智+10，声誉+8。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，赚钱就行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyLegacySeen = true;
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
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
