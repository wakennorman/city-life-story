/**
 * 域F(UI/UX) 联动增强 R301
 * 第六轮循环——UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   F→G  ui_life_dashboard          人生→仪表盘（核心机制·信息中枢）
 *   F→H  ui_company_dashboard       公司→仪表盘（公司·经营可视化）
 *   F→C  ui_career_path_explorer    职业→路径探索（职业/成长·导航升级）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR301Loaded) return;
  RANDOM_EVENTS._domainFLinkageR301Loaded = true;

  var EVENTS = [
    {
      id: "ui_life_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "人生仪表盘",
      story: "你打开人生仪表盘，看到自己这些年的关键指标——工作天数、收入增长、健康趋势、社交密度、技能水平。\n\n这些数字和图表，是你在这座城市存在过的证据。每一个指标都是一段真实经历的浓缩。\n\n你开始用数据「驾驶」自己的人生，而不是随波逐流。",
      triggers: { minDay: 365, excludeFlags: ["_uiLifeDashboardSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 365;
      },
      choices: [
        {
          text: "📊 设置人生目标提醒",
          hint: "心情+10，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiLifeDashboardSeen = true;
            st.flags._lifeDashboardV2 = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了人生仪表盘。数据让人生有方向。心情+10，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 不用设置，随遇而安",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiLifeDashboardSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得随遇而安就好。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_company_dashboard",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📈",
      title: "公司仪表盘",
      story: "你打开公司仪表盘，看到营收、利润、现金流、团队效率等关键指标的实时数据。\n\n这些数字是你创业多年积累的成果。每一条上升的曲线，都是团队一起拼出来的。\n\n你开始用数据「驾驶」公司，而不是凭感觉。",
      triggers: { minDay: 250, excludeFlags: ["_uiCompanyDashboardSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 20000;
      },
      choices: [
        {
          text: "📈 设置经营预警",
          hint: "心智+8，公司声誉+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCompanyDashboardSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你设置了公司仪表盘。数据让经营更精准。心智+8，声誉+5。", "success");
            }
          },
        },
        {
          text: "🤷 大概看看就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCompanyDashboardSeen = true;
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
      id: "ui_career_path_explorer",
      phase: "street",
      _isChainEvent: false,
      icon: "🗺️",
      title: "职业路径探索器",
      story: "你打开职业路径探索器，看到自己当前的职业路径和所有可选的晋升方向。\n\n每一条路径都有清晰的要求、预期收入、和发展前景。你不再盲目试错，而是有目标地前进。\n\n「选择比努力更重要」——当你有了地图，走路就不再是赌博。",
      triggers: { minDay: 180, excludeFlags: ["_uiCareerPathExplorerSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        return job && job.path ? true : false;
      },
      choices: [
        {
          text: "🗺️ 探索更多职业路径",
          hint: "心智+7，解锁路径探索flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCareerPathExplorerSeen = true;
            st.flags._careerPathExplorerV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🗺️ 你探索了更多职业路径。有地图的走路不是赌博。心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 走好眼前的路就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCareerPathExplorerSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得走好眼前的路就行。心智+3。", "info");
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
