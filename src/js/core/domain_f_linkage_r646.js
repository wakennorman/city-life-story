/**
 * 域F(UI/UX) 联动增强 R646
 * 桥接：
 *   F→A  f646_ui_data_dashboard_v4  数据仪表盘v4 → 消费 state.player+state.stats+state.skills 数据,
 *     UI→"一屏看全数据"数据回响
 *   F→B  f646_ui_event_timeline_v5  事件时间线v5 → 消费 state.flags._eventHistory 数据,
 *     UI→"往事如烟"叙事回响
 *   F→G  f646_ui_health_tracker_v3  健康追踪v3 → 消费 state.status+state.needs 数据,
 *     UI→"健康一目了然"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR646Loaded) return;
  RANDOM_EVENTS._domainFLinkageR646Loaded = true;

  var EVENTS = [
    {
      id: "f646_ui_data_dashboard_v4", phase: "street", _isChainEvent: false, icon: "📊",
      title: "一屏看全数据",
      story: "你开始用数据仪表盘来管理自己的生活——{desc}",
      triggers: { minDay: 200, interval: 300, maxRepeats: 1, excludeFlags: ["_f646DashDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f646DashDone) return false;
        var day = (st.player && st.player.day) || 0;
        return day >= 200;
      },
      choices: [
        { text: "📈 深度分析", hint: "智力+5,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f646DashDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '数据是了解自己最好的方式。' 你制作了数据仪表盘。智力+5,心智+4。", "success");
        }},
        { text: "🎯 设定目标", hint: "心智+6,置_f646Goal", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f646DashDone = true;
          st.flags._f646Goal = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '有数据,才能设定合理目标。' 你设定了数据驱动的目标。心智+6。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var totalEarned = (st.stats && st.stats.totalEarned) || 0;
        return "你开始用数据仪表盘来管理自己的生活——" + day + "天,赚了¥" + totalEarned + "。'一屏看全数据,决策更清晰。'";
      }
    },
    {
      id: "f646_ui_event_timeline_v5", phase: "street", _isChainEvent: false, icon: "📜",
      title: "往事如烟",
      story: "你翻看旧日的事件记录,仿佛在看一部自己的人生电影——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 1, excludeFlags: ["_f646TimelineDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f646TimelineDone) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 30;
      },
      choices: [
        { text: "📖 回顾往事", hint: "心情+6,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f646TimelineDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '往事如烟,历历在目。' 你回顾了走过的路。心情+6,心智+3。", "success");
        }},
        { text: "🎯 向前看", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f646TimelineDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '往事不恋,未来可期。' 你选择向前看。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var hist = st.flags._eventHistory || [];
        return "你翻看旧日的事件记录——" + hist.length + "段经历,仿佛在看一部自己的人生电影。'往事如烟,历历在目。'";
      }
    },
    {
      id: "f646_ui_health_tracker_v3", phase: "street", _isChainEvent: false, icon: "❤️",
      title: "健康一目了然",
      story: "你开始用健康追踪来管理自己的身体——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 1, excludeFlags: ["_f646HealthDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f646HealthDone) return false;
        var health = (st.status && st.status.health) || 100;
        return health < 60;
      },
      choices: [
        { text: "🏃 制定健康计划", hint: "心智+5,置_f646HealthPlan", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f646HealthDone = true;
          st.flags._f646HealthPlan = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 '健康是1,其他是0。' 你制定了健康计划。心智+5。", "success");
        }},
        { text: "😌 顺其自然", hint: "心情+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f646HealthDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 '心态好,身体自然好。' 你选择顺其自然。心情+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 100;
        return "你开始用健康追踪来管理自己的身体——健康" + Math.round(health) + "%,'健康一目了然,问题早发现。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
