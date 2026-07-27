/**
 * 域G(核心机制/生命周期) 联动增强 R478（第六轮循环·续）
 * 桥接：
 *   G→F  g478_weather_life_ui      天气生活UI → 消费 weather 数据,
 *     天气→"今天适合做什么"的UI提示
 *   G→H  g478_founder_life_v2      创始人生活v2 → 消费 corporate+needs 数据,
 *     创业→"老板也要生活"的职场叙事
 *   g478_season_narrative(G→B 季节叙事): weather.season→"四季人生"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR478Loaded) return;
  RANDOM_EVENTS._domainGLinkageR478Loaded = true;

  var EVENTS = [
    {
      id: "g478_weather_life_ui", phase: "street", _isChainEvent: false, icon: "🌤️",
      title: "今日宜忌",
      story: "你根据今天的天气安排了行程——{desc}",
      triggers: { minDay: 25, interval: 40, maxRepeats: 5, excludeFlags: ["_g478WeatherUiCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.weather || !st.weather.current) return false;
        return (st.flags && !st.flags._g478WeatherUiCooldown);
      },
      choices: [
        { text: "☀️ 好天气出门", hint: "心情+3,敏捷+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g478WeatherUiCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (st.player) st.player.agility = Math.min(100, (st.player.agility || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("☀️ 你趁好天气出了门——'好天气不该被浪费。' 心情+3,敏捷+1。", "success");
        }},
        { text: "🌧️ 雨天读书", hint: "智力+2,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g478WeatherUiCooldown = true;
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
      id: "g478_founder_life_v2", phase: "corporate", _isChainEvent: false, icon: "🧘",
      title: "创始人生活",
      story: "你开始关注创业者的生活平衡——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_g478FounderLifeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        if (!st.needs) return false;
        return (st.flags && !st.flags._g478FounderLifeCooldown);
      },
      choices: [
        { text: "🏃 运动减压", hint: "健康+5,疲劳-10,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g478FounderLifeCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 5);
          if (st.needs) { st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10); st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 你开始运动减压——'身体是创业的本钱。' 健康+5,疲劳-10,心情+5。", "success");
        }},
        { text: "👨‍👩‍👧 陪伴家人", hint: "心情+8,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g478FounderLifeCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👨‍👩‍👧 你决定多陪陪家人——'创业不是为了错过生活。' 心情+8,心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始关注创业者的生活平衡——创业是一场马拉松，不是短跑。你决定怎么平衡工作和生活？";
      }
    },
    {
      id: "g478_season_narrative", phase: "street", _isChainEvent: false, icon: "🍂",
      title: "四季人生",
      story: "你感受到了季节的更替——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 4, excludeFlags: ["_g478SeasonCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.weather || !st.weather.season) return false;
        return (st.flags && !st.flags._g478SeasonCooldown);
      },
      choices: [
        { text: "🌸 春耕夏耘", hint: "全技能XP+1,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g478SeasonCooldown = true;
          var skills = ["accounting", "management", "sales", "coding", "trade"];
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 1); } catch(e) {} } }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌸 你决定春耕夏耘——'一年之计在于春。' 全技能XP+1,心情+3。", "success");
        }},
        { text: "🍂 秋收冬藏", hint: "心智+3,现金+300", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g478SeasonCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 300;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍂 你决定秋收冬藏——'收获的季节。' 心智+3,现金+300。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var season = st.weather && st.weather.season ? st.weather.season : "spring";
        var desc = season === "spring" ? "春天来了，万物复苏。" : season === "summer" ? "夏日炎炎，热情似火。" : season === "autumn" ? "秋高气爽，收获的季节。" : "冬日蛰伏，蓄势待发。";
        return desc + "你开始思考——在这个季节，该怎么安排自己的人生？";
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
