/**
 * 域F(UI/UX) 联动增强 R670
 * 桥接：
 *   F→A  f652_ui_data_dashboard_v5  数据仪表盘v5 → 消费 state.player+state.stats+state.skills 数据,
 *     UI→"一屏看全数据"数据回响
 *   F→B  f652_ui_event_memory_wall_v8  事件记忆墙v8 → 消费 state.flags._eventHistory 数据,
 *     UI→"往事值得被铭记"叙事回响
 *   F→G  f652_ui_health_tracker_v4  健康追踪v4 → 消费 state.status+state.needs 数据,
 *     UI→"健康一目了然"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR670Loaded) return;
  RANDOM_EVENTS._domainFLinkageR670Loaded = true;

  var EVENTS = [
    {
      id: "f652_ui_data_dashboard_v5", phase: "street", _isChainEvent: false, icon: "📊",
      title: "一屏看全数据",
      story: "你开始用数据仪表盘来管理自己的生活——{desc}",
      triggers: { minDay: 300, interval: 365, maxRepeats: 1, excludeFlags: ["_f652DashDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f652DashDone) return false;
        var day = (st.player && st.player.day) || 0;
        return day >= 300;
      },
      choices: [
        { text: "📈 深度分析", hint: "智力+7,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f652DashDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 7);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '数据是了解自己最好的方式。' 你制作了数据仪表盘。智力+7,心智+5。", "success");
        }},
        { text: "🎯 设定目标", hint: "心智+8,置_f652Goal", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f652DashDone = true;
          st.flags._f652Goal = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '有数据,才能设定合理目标。' 你设定了数据驱动的目标。心智+8。", "success");
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
      id: "f652_ui_event_memory_wall_v8", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "往事值得被铭记",
      story: "你翻看旧日的事件记录,仿佛在看一部自己的人生电影——{desc}",
      triggers: { minDay: 350, interval: 365, maxRepeats: 1, excludeFlags: ["_f652WallDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f652WallDone) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 70;
      },
      choices: [
        { text: "📖 回顾往事", hint: "心情+9,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f652WallDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 9);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '回顾走过的路,是为了更好地向前。' 你翻看旧日记忆。心情+9,心智+5。", "success");
        }},
        { text: "🎯 向前看", hint: "心智+7", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f652WallDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '往事不恋,未来可期。' 你选择向前看。心智+7。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var hist = st.flags._eventHistory || [];
        return "你翻看旧日的事件记录——" + hist.length + "段经历,仿佛在看一部自己的人生电影。'往事值得被铭记。'";
      }
    },
    {
      id: "f652_ui_health_tracker_v4", phase: "street", _isChainEvent: false, icon: "❤️",
      title: "健康一目了然",
      story: "你开始用健康追踪来管理自己的身体——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 1, excludeFlags: ["_f652HealthDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f652HealthDone) return false;
        var health = (st.status && st.status.health) || 100;
        return health < 50;
      },
      choices: [
        { text: "🏃 制定健康计划", hint: "心智+7,置_f652HealthPlan", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f652HealthDone = true;
          st.flags._f652HealthPlan = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 '健康是1,其他是0。' 你制定了健康计划。心智+7。", "success");
        }},
        { text: "😌 顺其自然", hint: "心情+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f652HealthDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 '心态好,身体自然好。' 你选择顺其自然。心情+6。", "success");
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
