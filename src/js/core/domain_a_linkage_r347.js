/**
 * 域A(数据/数值平衡) 联动增强 R347
 * 第十二轮循环——数据积累的多维回响。
 * 桥接：
 *   A→G  data_health_dashboard_v2     数据→健康仪表盘（核心机制·预防医学）
 *   A→H  data_business_intelligence_v3 数据→商业智能（公司·数据驱动经营）
 *   A→F  data_life_dashboard_v2       数据→人生仪表盘（UI/UX·信息中枢）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR347Loaded) return;
  RANDOM_EVENTS._domainALinkageR347Loaded = true;

  var EVENTS = [
    {
      id: "data_health_dashboard_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "❤️",
      title: "健康数据仪表盘v2",
      story: "你打开健康数据仪表盘，看到自己这些年的健康趋势——体重变化、运动频率、睡眠质量、疾病记录。\n\n这些数字让你第一次直观地看到自己的健康轨迹——什么时候状态好、什么时候在透支、什么时候需要调整。\n\n你开始用数据「管理」自己的健康，而不是等到生病才重视。",
      triggers: { minDay: 700, excludeFlags: ["_dataHealthDashV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.status || !st.needs || !st.stats) return false;
        return (st.stats.actionFreq && (st.stats.actionFreq.exercise || 0) >= 20);
      },
      choices: [
        {
          text: "❤️ 设置健康预警",
          hint: "健康+18，心智+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataHealthDashV2Seen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 18);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("❤️ 你设置了健康数据仪表盘。数据让健康管理更科学。健康+18，心智+12。", "success");
            }
          },
        },
        {
          text: "🤷 不用设置，感觉身体好就行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataHealthDashV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得感觉比数据重要。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "data_business_intelligence_v3",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "商业智能v3",
      story: "你开始用数据分析自己的商业决策——哪些产品最赚钱？哪些客户最有价值？哪些渠道效率最高？\n\n这些洞察让你发现了一些以前没注意到的市场机会。你开始用数据「看见」商业的本质，而不是凭感觉。\n\n「数据不会说谎，但需要会提问。」",
      triggers: { minDay: 600, excludeFlags: ["_dataBizIntelV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company || !st.stats || !st.stats.actionFreq) return false;
        return (st.stats.actionFreq.buyGood || 0) + (st.stats.actionFreq.sellGood || 0) >= 60;
      },
      choices: [
        {
          text: "📊 用数据指导商业决策",
          hint: "心智+14，公司声誉+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataBizIntelV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 14);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 12;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据指导商业决策。数据让商业本质变得可见。心智+14，声誉+12。", "success");
            }
          },
        },
        {
          text: "🤷 凭经验就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataBizIntelV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭经验就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "data_life_dashboard_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "人生数据仪表盘v2",
      story: "你打开人生数据仪表盘，看到自己这些年的全方位关键指标——工作、收入、健康、社交、技能、投资、公司。\n\n这些数字和图表，是你在这座城市存在过的全方位证据。每一个指标都是一段真实经历的浓缩。\n\n你开始用数据「理解」自己的人生，而不是用感觉。",
      triggers: { minDay: 800, excludeFlags: ["_dataLifeDashV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 800;
      },
      choices: [
        {
          text: "📊 设置人生数据仪表盘",
          hint: "心智+16，置人生仪表盘flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataLifeDashV2Seen = true;
            st.flags._lifeDataDashboardV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 16);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了人生数据仪表盘。数据让人生变得全面可见。心智+16。", "success");
            }
          },
        },
        {
          text: "🤷 不用设置，随遇而安",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataLifeDashV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得随遇而安就好。心智+4。", "info");
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
