/**
 * 域A(数据/数值平衡) 联动增强 R363
 * 第十四轮循环——数据不仅是数字，还在叙事/UI/核心机制层面留下痕迹。
 * 桥接：
 *   A→B  quantified_life_v2         数据→量化人生v2（事件/叙事·数据故事）
 *   A→F  data_ui_insight            数据→UI洞察（UI/UX·数据可视化）
 *   A→G  precision_health_v2        数据→精确健康v2（核心机制·健康管理）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR363Loaded) return;
  RANDOM_EVENTS._domainALinkageR363Loaded = true;

  var EVENTS = [
    {
      // A→B: 数据→量化人生v2（事件/叙事·数据故事）
      id: "quantified_life_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "数据里的自己",
      story: "你翻看了自己在这座城市积累的数据——总收入、总支出、工作天数、技能等级、社交圈大小……\n\n这些数字拼凑出一个你从未见过的自己：\n\n原来你已经工作了这么久，原来你认识了不少人，原来你的技能已经成长了这么多。\n\n「数据不会说谎，它就是你的另一面镜子。」",
      triggers: { minDay: 30, excludeFlags: ["_quantifiedLifeV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.player && st.player.day >= 30);
      },
      choices: [
        {
          text: "📊 看看自己的数据画像",
          hint: "心智+5，心情+5，自我认知flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._quantifiedLifeV2Seen = true;
            st.flags._dataSelfAwareness = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你看到了数据里的自己。数据不会说谎，它是你的另一面镜子。心智+5，心情+5。", "success");
            }
          },
        },
        {
          text: "📝 数据和感觉都要看",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._quantifiedLifeV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 数据和感觉都要看，两者结合才是完整的自己。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // A→F: 数据→UI洞察（UI/UX·数据可视化）
      id: "data_ui_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "数据的可视化",
      story: "你看着满屏的数字，觉得应该有个更直观的方式来看待这些数据。\n\n如果把收入画成一条上升的曲线，把技能画成一张雷达图，把社交关系画成一个网络……\n\n数据就不仅仅是数字，而是一幅关于你生活的画卷。\n\n「可视化，是让数据说话的最好方式。」",
      triggers: { minDay: 45, excludeFlags: ["_dataUiInsightSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 8;
      },
      choices: [
        {
          text: "📈 建立数据可视化看板",
          hint: "心智+6，数据意识+5，flag数据可视化",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataUiInsightSeen = true;
            st.flags._dataVisualizationAware = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.skills && st.skills.coding && typeof addSkillXp === "function") {
              addSkillXp("coding", 5); // [R620 A类修复] 原addSkillXp(st,...) state作首参→XP静默丢弃
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你建立了数据可视化看板。可视化让数据自己说话。心智+6，编程经验+5。", "success");
            }
          },
        },
        {
          text: "🤷 数字心里有数就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataUiInsightSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得数字心里有数就行。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // A→G: 数据→精确健康v2（核心机制·健康管理）
      id: "precision_health_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💊",
      title: "健康数据管理",
      story: "你开始记录自己的健康数据——睡眠质量、饮食习惯、运动频率、身体指标变化。\n\n以前你只知道自己「不太舒服」，现在你有了数据，就能知道到底是哪里出了问题。\n\n「没有数据，健康管理就是凭感觉。」\n\n你决心用数据来管理自己的健康，而不是等生病了再去医院。",
      triggers: { minDay: 60, excludeFlags: ["_precisionHealthV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要至少经历过一些健康相关事件
        var history = (st.flags && st.flags._eventHistory) || [];
        if (history.length < 10) return false;
        // 健康低于某个值才有意义
        return !!(st.status && st.status.health < 70);
      },
      choices: [
        {
          text: "💊 建立健康数据档案",
          hint: "健康+10，心智+5，flag健康管理",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._precisionHealthV2Seen = true;
            st.flags._healthDataManagement = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💊 你建立了健康数据档案。用数据管理健康，比等生病了再去医院强。健康+10，心智+5。", "success");
            }
          },
        },
        {
          text: "🏃 多运动就好",
          hint: "健康+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._precisionHealthV2Seen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏃 你决定多运动。有时候最简单的办法就是最好的。健康+5。", "info");
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