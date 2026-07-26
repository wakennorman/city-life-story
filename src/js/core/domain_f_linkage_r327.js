/**
 * 域F(UI/UX) 联动增强 R327
 * 第九轮循环——UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   F→A  ui_data_hub             数据→信息中枢（数据/数值·信息展示）
 *   F→C  ui_career_compass       职业→指南针（职业/成长·导航升级）
 *   F→E  ui_finance_command      财务→指挥中心（经济·数据可视化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR327Loaded) return;
  RANDOM_EVENTS._domainFLinkageR327Loaded = true;

  var EVENTS = [
    {
      id: "ui_data_hub",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "数据信息中枢",
      story: "你打开数据信息中枢，看到自己这些年的全方位数据——交易统计、生产记录、社交网络、健康状况。\n\n这些数字和图表，是你在这座城市存在过的全方位证据。每一个数据点都是一段真实经历的浓缩。\n\n你开始用数据「理解」自己的人生，而不是用感觉。",
      triggers: { minDay: 500, excludeFlags: ["_uiDataHubSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 500;
      },
      choices: [
        {
          text: "📊 设置数据信息中枢",
          hint: "心智+12，置数据中枢flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiDataHubSeen = true;
            st.flags._dataHub = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了数据信息中枢。数据让人生变得全面可见。心智+12。", "success");
            }
          },
        },
        {
          text: "🤷 不用设置，随遇而安",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiDataHubSeen = true;
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
    {
      id: "ui_career_compass",
      phase: "street",
      _isChainEvent: false,
      icon: "🧭",
      title: "职业指南针",
      story: "你打开职业指南针，看到自己当前的职业位置和所有可选的发展方向。\n\n每一个方向都有清晰的要求、预期收入、和发展前景。你不再盲目试错，而是有目标地前进。\n\n「选择比努力更重要」——当你有了指南针，走路就不再是赌博。",
      triggers: { minDay: 350, excludeFlags: ["_uiCareerCompassSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        return job && job.path ? true : false;
      },
      choices: [
        {
          text: "🧭 探索更多职业方向",
          hint: "心智+9，置职业指南针flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCareerCompassSeen = true;
            st.flags._careerCompass = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧭 你探索了更多职业方向。有指南针的走路不是赌博。心智+9。", "success");
            }
          },
        },
        {
          text: "🤷 走好眼前的路就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCareerCompassSeen = true;
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
    {
      id: "ui_finance_command",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "财务指挥中心",
      story: "你打开财务指挥中心，看到收支曲线、资产分布、负债结构、投资回报等关键财务指标。\n\n这些数字让你第一次看清了自己的财务状况——哪里在赚钱、哪里在烧钱、哪里可以优化。\n\n「你不理财，财不理你」从口号变成了可执行的计划。",
      triggers: { minDay: 400, excludeFlags: ["_uiFinanceCommandSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return total >= 30000;
      },
      choices: [
        {
          text: "💰 设置财务预警",
          hint: "心智+10，置财务指挥flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiFinanceCommandSeen = true;
            st.flags._financeCommandCenter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你设置了财务指挥中心。数据让理财更科学。心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 大概看看就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiFinanceCommandSeen = true;
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
