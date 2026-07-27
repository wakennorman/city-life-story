/**
 * 域G(核心机制/生命周期) 联动增强 R464（第四轮循环·续）
 * 桥接：
 *   G→F  g464_weather_ui         天气UI增强 → 消费 weather 数据,
 *     天气变化→"今日宜忌"的UI提示
 *   G→H  g464_life_phase_corporate 人生阶段创业 → 消费 age+corporate 数据,
 *     年龄→"什么年龄做什么事"的创业叙事
 *   g464_life_milestone_event(G→B 人生里程碑事件): age+life_nodes→"被看见的里程碑"叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR464Loaded) return;
  RANDOM_EVENTS._domainGLinkageR464Loaded = true;

  var EVENTS = [
    {
      id: "g464_weather_ui", phase: "street", _isChainEvent: false, icon: "🌤️",
      title: "今日天象",
      story: "你看了看今天的天气预报——{desc}",
      triggers: { minDay: 20, interval: 30, maxRepeats: 6, excludeFlags: ["_g464WeatherUiCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.weather || !st.weather.forecast) return false;
        return (st.flags && !st.flags._g464WeatherUiCooldown);
      },
      choices: [
        { text: "☀️ 趁好天气出门", hint: "心情+3,敏捷+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g464WeatherUiCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (st.player) st.player.agility = Math.min(100, (st.player.agility || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("☀️ 你趁好天气出了门——'好天气不该被浪费。' 心情+3,敏捷+1。", "success");
        }},
        { text: "🌧️ 雨天读书学习", hint: "智力+2,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g464WeatherUiCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2); st.player.mental = Math.min(100, (st.player.mental || 50) + 1); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌧️ 你在雨天静心读书——'雨天是思考的好时机。' 智力+2,心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var current = st.weather && st.weather.current ? st.weather.current : "晴朗";
        return "今天的天气是" + current + "——天气影响心情，心情影响决策。你决定怎么利用今天的天气？";
      }
    },
    {
      id: "g464_life_phase_corporate", phase: "corporate", _isChainEvent: false, icon: "🎂",
      title: "什么年纪",
      story: "你迎来了{age}岁生日——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_g464LifePhaseCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        if (!st.player || st.player.age < 28) return false;
        return (st.flags && !st.flags._g464LifePhaseCooldown);
      },
      choices: [
        { text: "🚀 加速冲刺", hint: "KPI+10,疲劳+8,风险+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g464LifePhaseCooldown = true;
          if (st.player && st.player.corporate) st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 50) + 10);
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);
          if (st.player && st.player.corporate) st.player.corporate.risk = Math.min(100, (st.player.corporate.risk || 0) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 你决定加速冲刺——'年纪不等人。' KPI+10,但代价不小。", "warning");
        }},
        { text: "🧘 稳中求进", hint: "心智+3,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g464LifePhaseCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 你选择稳中求进——'慢就是快。' 心智+3,管理XP+3。", "success");
        }},
        { text: "🌱 培养接班人", hint: "团队忠诚+8,能力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g464LifePhaseCooldown = true;
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 8); } }
          if (st.player && st.player.corporate) st.player.corporate.ability = Math.min(100, (st.player.corporate.ability || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌱 你开始培养接班人——'一个人走得快，一群人走得远。' 团队忠诚+8,能力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var age = st.player && st.player.age ? st.player.age : 30;
        return "你迎来了" + age + "岁生日——在职场，年龄既是资本也是压力。你开始思考：在这个人生阶段，什么才是最重要的？";
      }
    },
    {
      id: "g464_life_milestone_event", phase: "street", _isChainEvent: false, icon: "🏆",
      title: "人生节点",
      story: "你回顾了自己的人生轨迹——{desc}",
      triggers: { minDay: 50, interval: 80, maxRepeats: 4, excludeFlags: ["_g464MilestoneCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.lifeNodes || !st.lifeNodes.completed) return false;
        return st.lifeNodes.completed.length >= 1 && (st.flags && !st.flags._g464MilestoneCooldown);
      },
      choices: [
        { text: "📖 写下感悟", hint: "心智+3,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g464MilestoneCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你写下了人生感悟——'记录，是为了更好地前行。' 心智+3,心情+3。", "success");
        }},
        { text: "🎯 设定新目标", hint: "智力+2,管理XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g464MilestoneCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你设定了新目标——'每一个终点都是新的起点。' 智力+2,管理XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var completed = st.lifeNodes && st.lifeNodes.completed ? st.lifeNodes.completed.length : 0;
        return "你回顾了自己的人生轨迹——已经经历了" + completed + "个人生节点。每一个节点都是一次选择，每一次选择都塑造了现在的你。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();
