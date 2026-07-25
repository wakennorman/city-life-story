/**
 * 域H(Phase2/公司) 联动增强 R287
 * 第四轮循环——公司运营的多维回响，完成8域四轮全覆盖。
 * 桥接：
 *   H→B  company_milestone_narrative  公司里程碑→叙事事件（事件/叙事·历史感）
 *   H→G  company_founder_wellness      创始人→健康（核心机制·工作生活平衡）
 *   H→A  company_economic_feedback    公司→经济回馈（数据/数值·经营可视化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR287Loaded) return;
  RANDOM_EVENTS._domainHLinkageR287Loaded = true;

  var EVENTS = [
    {
      id: "company_milestone_narrative",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🎉",
      title: "公司里程碑叙事",
      story: "今天，你的公司达成了一个重要的里程碑——也许是营收破百万，也许是团队突破50人。\n\n你决定把这个时刻记录下来，不是作为冷冰冰的财报数据，而是作为一段有温度的故事。这个故事里，有团队的汗水、有客户的信任、有无数个加班的夜晚。\n\n「数字是结果，故事是意义。」",
      triggers: { minDay: 300, excludeFlags: ["_companyMilestoneNarrSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 80000 || (st.startup.company.valuation || 0) >= 800000;
      },
      choices: [
        {
          text: "🎉 写下这个里程碑的故事",
          hint: "心智+8，公司声誉+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyMilestoneNarrSeen = true;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎉 你写下了公司里程碑的故事。数字是结果，故事是意义。心智+8，声誉+5。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前进",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyMilestoneNarrSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "company_founder_wellness",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🧘",
      title: "创始人健康关怀",
      story: "公司终于走上了正轨，你开始有时间关注自己的健康。\n\n你发现，创业多年，身体已经发出了不少警告——颈椎不适、睡眠不足、偶尔的胃痛。你决定开始锻炼、调整作息、定期体检。\n\n你意识到，创始人健康是公司最大的「无形资产」。",
      triggers: { minDay: 250, excludeFlags: ["_companyFounderWellnessSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company || !st.status || !st.needs) return false;
        return (st.startup.company.valuation || 0) >= 200000 && ((st.status.health || 100) < 70 || (st.needs.happiness || 50) < 55);
      },
      choices: [
        {
          text: "🧘 开始关注自己的健康",
          hint: "健康+10，心情+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyFounderWellnessSeen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧘 你开始关注自己的健康。创始人健康是公司最大的无形资产。健康+10，心情+8。", "success");
            }
          },
        },
        {
          text: "💼 公司离不开我，继续扛",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyFounderWellnessSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你选择继续扛。但身体记住了这一次。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "company_economic_feedback",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司经济回馈",
      story: "公司开始稳定盈利了。这些利润不仅是数字，更是你多年努力的回报。\n\n你第一次感受到「企业家精神」的创造——不仅是为自己，也是为团队、为社会创造价值。公司的成功，反哺了你的个人财富，也带动了团队的成长。\n\n你开始理解「商业向善」的真正含义。",
      triggers: { minDay: 200, excludeFlags: ["_companyEconFeedbackSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 15000;
      },
      choices: [
        {
          text: "📊 把部分利润投入团队福利",
          hint: "团队平均忠诚度+6，心智+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyEconFeedbackSeen = true;
            if (st.startup && st.startup.company && st.startup.company.team) {
              for (var i = 0; i < st.startup.company.team.length; i++) {
                if (st.startup.company.team[i]) {
                  st.startup.company.team[i].loyalty = Math.min(100, (st.startup.company.team[i].loyalty || 50) + 6);
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你把部分利润投入团队福利。商业向善，是最好的商业模式。忠诚度+6，心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 利润再投入公司发展",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyEconFeedbackSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你选择把利润再投入公司。心智+4。", "info");
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
