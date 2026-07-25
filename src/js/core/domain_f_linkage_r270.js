/**
 * 域F(UI/UX) 联动增强 R270
 * UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   E→A  ui_economic_dashboard   经济数据→数值面板（数据/数值·信息展示）
 *   F→C  ui_career_pathfinder     职业路径→UI导航（职业/成长·路径引导）
 *   F→D  ui_social_relationship_map 社交关系→关系图谱（NPC/社交·可视化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR270Loaded) return;
  RANDOM_EVENTS._domainFLinkageR270Loaded = true;

  var EVENTS = [
    {
      id: "ui_economic_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "经济仪表盘",
      story: "你开始用APP追踪自己的收支、资产、负债。这些数字变成了一张张清晰的图表。\n\n你第一次看清了自己的财务状况——哪里在赚钱、哪里在烧钱、哪里可以优化。\n\n「你不理财，财不理你」不是口号，是你用数据换来的觉悟。",
      triggers: { minDay: 90, excludeFlags: ["_uiEconDashboardSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return total >= 5000;
      },
      choices: [
        {
          text: "📊 深入分析收支结构",
          hint: "心智+6，置投资意识flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiEconDashboardSeen = true;
            st.flags._dataInvestorMindset = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你深入分析了收支结构。数据让决策更清晰。心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 知道大概就够了",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiEconDashboardSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得知道大概就够了。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_career_pathfinder",
      phase: "street",
      _isChainEvent: false,
      icon: "🗺️",
      title: "职业路径导航",
      story: "你打开职业页面，看到自己当前的职业路径和可选的晋升方向。\n\n每一条路径都有清晰的要求和预期收入。你不再盲目试错，而是有目标地前进。\n\n「选择比努力更重要」——当你有了地图，走路就不再是赌博。",
      triggers: { minDay: 60, excludeFlags: ["_uiCareerPathSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        return job && job.path ? true : false;
      },
      choices: [
        {
          text: "🗺️ 研究晋升路径",
          hint: "心智+5，解锁职业导航flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCareerPathSeen = true;
            st.flags._careerPathfinder = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🗺️ 你研究了晋升路径。有目标的努力，效率更高。心智+5。", "success");
            }
          },
        },
        {
          text: "🤷 边走边看，不用规划",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCareerPathSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得边走边看就好。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_social_relationship_map",
      phase: "street",
      _isChainEvent: false,
      icon: "🕸️",
      title: "社交关系图谱",
      story: "你开始整理自己的人际关系——谁认识谁、谁和谁关系好、谁是关键节点。\n\n这些关系变成了一张图谱。你发现，社交不是点对点的连线，而是一张网。\n\n「六度分隔」不是理论，是你在这座城市的真实体验。",
      triggers: { minDay: 120, excludeFlags: ["_uiSocialMapSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var metNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met) metNpcs++;
        }
        return metNpcs >= 4;
      },
      choices: [
        {
          text: "🕸️ 整理成关系图谱",
          hint: "心智+6，解锁社交图谱flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiSocialMapSeen = true;
            st.flags._socialRelationshipMap = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🕸️ 你整理了社交关系图谱。关系是比简历更重要的资产。心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 不用整理，心里有数",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiSocialMapSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用整理。心智+2。", "info");
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
