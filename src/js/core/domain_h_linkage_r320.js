/**
 * 域H(Phase2/公司) 联动增强 R320
 * 第八轮循环——公司运营的多维回响，完成8域八轮全覆盖。
 * 桥接：
 *   H→A  company_data_dashboard_v2    公司→数据面板（数据/数值·经营可视化）
 *   H→G  company_founder_wellness_v2   创始人→健康v2（核心机制·工作生活平衡）
 *   H→B  company_history_book          公司→历史书（事件/叙事·企业传承）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR320Loaded) return;
  RANDOM_EVENTS._domainHLinkageR320Loaded = true;

  var EVENTS = [
    {
      id: "company_data_dashboard_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司数据面板v2",
      story: "你打开公司数据面板，看到营收、利润、现金流、团队效率、市场份额等关键经营指标。\n\n这些数字是你创业多年积累的成果。每一条上升的曲线，都是团队一起拼出来的。\n\n你开始用数据「驾驶」公司，而不是凭感觉。",
      triggers: { minDay: 400, excludeFlags: ["_companyDataDashV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 50000;
      },
      choices: [
        {
          text: "📊 设置经营预警系统",
          hint: "心智+10，公司声誉+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyDataDashV2Seen = true;
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
            st.flags._companyDataDashV2Seen = true;
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
      id: "company_founder_wellness_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🧘",
      title: "创始人健康v2",
      story: "公司终于走上了正轨，你开始有时间关注自己的健康。\n\n你发现，创业多年，身体已经发出了不少警告——颈椎不适、睡眠不足、偶尔的胃痛。你决定开始锻炼、调整作息、定期体检。\n\n你意识到，创始人健康是公司最大的「无形资产」。",
      triggers: { minDay: 350, excludeFlags: ["_companyFounderWellnessV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company || !st.status || !st.needs) return false;
        return (st.startup.company.valuation || 0) >= 400000 && ((st.status.health || 100) < 70 || (st.needs.happiness || 50) < 55);
      },
      choices: [
        {
          text: "🧘 开始关注自己的健康",
          hint: "健康+15，心情+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyFounderWellnessV2Seen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 15);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧘 你开始关注自己的健康。创始人健康是公司最大的无形资产。健康+15，心情+12。", "success");
            }
          },
        },
        {
          text: "💼 公司离不开我，继续扛",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyFounderWellnessV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你选择继续扛。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "company_history_book",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📖",
      title: "公司历史书",
      story: "你开始写一本「公司历史书」，记录创业路上的每一个重要时刻——第一次入职、第一次晋升、第一次拿到融资、第一次遇到危机。\n\n这些故事不仅是回忆，也是公司文化的载体。你决定让每一个新员工都能读到这本书，了解公司的过去，传承公司的精神。\n\n「公司会倒闭，但故事会留下来。」",
      triggers: { minDay: 500, excludeFlags: ["_companyHistoryBookSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.valuation || 0) >= 1000000;
      },
      choices: [
        {
          text: "📖 写下公司历史书",
          hint: "心智+12，公司声誉+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyHistoryBookSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 12;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了公司历史书。公司会倒闭，但故事会留下来。心智+12，声誉+12。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，赚钱就行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyHistoryBookSeen = true;
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
