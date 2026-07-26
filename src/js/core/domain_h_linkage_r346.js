/**
 * 域H(Phase2/公司) 联动增强 R346
 * 第十一轮循环——公司运营的多维回响，完成11域十一轮全覆盖。
 * 桥接：
 *   H→B  company_event_story       公司→事件故事（事件/叙事·企业历史）
 *   H→A  company_data_dashboard_v4 公司→数据面板（数据/数值·经营可视化）
 *   H→G  company_founder_life       创始人→生活（核心机制·工作生活平衡）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR346Loaded) return;
  RANDOM_EVENTS._domainHLinkageR346Loaded = true;

  var EVENTS = [
    {
      id: "company_event_story",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📖",
      title: "公司事件故事",
      story: "你开始收集公司的「事件故事」——创业路上的每一个重要时刻、每一次危机、每一次突破。\n\n这些故事不仅是回忆，也是公司文化的载体。你决定把它们整理成一本「公司历史书」，让每一个新员工都能了解公司的过去，传承公司的精神。\n\n「公司会倒闭，但故事会留下来。」",
      triggers: { minDay: 600, excludeFlags: ["_companyEventStorySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 120000;
      },
      choices: [
        {
          text: "📖 写下公司历史书",
          hint: "心智+13，公司声誉+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyEventStorySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 13);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 12;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了公司历史书。公司会倒闭，但故事会留下来。心智+13，声誉+12。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，赚钱就行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyEventStorySeen = true;
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
      id: "company_data_dashboard_v4",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司数据面板v4",
      story: "你打开公司数据面板，看到营收、利润、现金流、团队效率、市场份额等关键经营指标的实时数据。\n\n这些数字是你创业多年积累的成果。每一条上升的曲线，都是团队一起拼出来的。\n\n你开始用数据「驾驶」公司，而不是凭感觉。",
      triggers: { minDay: 550, excludeFlags: ["_companyDataDashV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 150000;
      },
      choices: [
        {
          text: "📊 设置经营预警系统",
          hint: "心智+13，公司声誉+11",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyDataDashV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 13);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 11;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了经营预警系统。数据让经营更精准。心智+13，声誉+11。", "success");
            }
          },
        },
        {
          text: "🤷 大概看看就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyDataDashV4Seen = true;
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
      id: "company_founder_life",
      phase: "corporate",
      _isChainEvent: false,
      icon: "⚖️",
      title: "创始人的生活平衡",
      story: "公司终于走上了正轨，你开始有时间关注自己的生活。\n\n你发现，创业多年，身体已经发出了不少警告——颈椎不适、睡眠不足、偶尔的胃痛。你决定开始锻炼、调整作息、定期体检。\n\n你意识到，创始人健康是公司最大的「无形资产」。没有健康的创始人，就没有健康的公司。",
      triggers: { minDay: 500, excludeFlags: ["_companyFounderLifeSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company || !st.status || !st.needs) return false;
        return (st.startup.company.valuation || 0) >= 1500000 && ((st.status.health || 100) < 75 || (st.needs.happiness || 50) < 60);
      },
      choices: [
        {
          text: "⚖️ 给自己放一天假",
          hint: "健康+18，心情+15",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyFounderLifeSeen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 18);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("⚖️ 你给自己放了一天假。创始人健康是公司最大的无形资产。健康+18，心情+15。", "success");
            }
          },
        },
        {
          text: "💼 公司离不开我，继续干",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyFounderLifeSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你选择继续干。但身体记住了这一次。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
