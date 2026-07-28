/**
 * 域F(UI/UX) 联动增强 R654
 * 桥接：
 *   F→A  f648_ui_wealth_dashboard_v3  财富仪表盘v3 → 消费 state.resources+state.investment 数据,
 *     UI→"一屏看全资产"数据回响
 *   F→B  f648_ui_story_wall_v6  故事墙v6 → 消费 state.flags._eventHistory 数据,
 *     UI→"往事值得被铭记"叙事回响
 *   F→G  f648_ui_life_dashboard_v4  人生仪表盘v4 → 消费 state.player+state.status+state.needs 数据,
 *     UI→"人生数据一目了然"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR654Loaded) return;
  RANDOM_EVENTS._domainFLinkageR654Loaded = true;

  var EVENTS = [
    {
      id: "f648_ui_wealth_dashboard_v3", phase: "street", _isChainEvent: false, icon: "💰",
      title: "一屏看全资产",
      story: "你开始用财富仪表盘来管理自己的资产——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 1, excludeFlags: ["_f648WealthDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f648WealthDone) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        return cash >= 5000;
      },
      choices: [
        { text: "📊 深度分析", hint: "智力+5,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f648WealthDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '清楚自己的家底,才能做出好决策。' 你制作了财富仪表盘。智力+5,心智+4。", "success");
        }},
        { text: "🎯 优化配置", hint: "管理XP+4,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f648WealthDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '资产配置,需要不断优化。' 你思考了优化方案。管理XP+4,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        var bank = (st.resources && st.resources.bankBalance) || 0;
        return "你开始用财富仪表盘来管理自己的资产——现金¥" + cash + ",存款¥" + bank + "。'一屏看全资产,决策更清晰。'";
      }
    },
    {
      id: "f648_ui_story_wall_v6", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "往事值得被铭记",
      story: "你翻看旧日的事件记录,仿佛在看一部自己的人生电影——{desc}",
      triggers: { minDay: 200, interval: 300, maxRepeats: 1, excludeFlags: ["_f648WallDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f648WallDone) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 40;
      },
      choices: [
        { text: "📖 回顾往事", hint: "心情+7,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f648WallDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 7);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '回顾走过的路,是为了更好地向前。' 你翻看旧日记忆。心情+7,心智+4。", "success");
        }},
        { text: "🎯 向前看", hint: "心智+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f648WallDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '往事不恋,未来可期。' 你选择向前看。心智+6。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var hist = st.flags._eventHistory || [];
        return "你翻看旧日的事件记录——" + hist.length + "段经历,仿佛在看一部自己的人生电影。'往事值得被铭记。'";
      }
    },
    {
      id: "f648_ui_life_dashboard_v4", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生数据一目了然",
      story: "你开始用人生仪表盘来管理自己的生活——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 1, excludeFlags: ["_f648LifeDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f648LifeDone) return false;
        var day = (st.player && st.player.day) || 0;
        return day >= 120;
      },
      choices: [
        { text: "📈 深度分析", hint: "智力+5,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f648LifeDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '人生数据,一目了然。' 你制作了人生仪表盘。智力+5,心智+4。", "success");
        }},
        { text: "🎯 设定目标", hint: "心智+6,置_f648LifeGoal", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f648LifeDone = true;
          st.flags._f648LifeGoal = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '有数据,才能设定合理目标。' 你设定了人生目标。心智+6。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var health = (st.status && st.status.health) || 100;
        return "你开始用人生仪表盘来管理自己的生活——" + day + "天,健康" + Math.round(health) + "%。'人生数据,一目了然。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
