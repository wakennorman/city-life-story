/*
 * 城市浮生记 — 域G（核心机制/生命周期）联动增强事件
 * v3.120 · loop R192 全系统优化·Domain G 第五轮
 *
 * 设计约束：
 *  - IIFE 注入 RANDOM_EVENTS，phase:"street"/"corporate"
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainG_linkage_r192) return;
  RANDOM_EVENTS._domainG_linkage_r192 = true;

  // ---- 本地助手 ----
  function safeState(st, path) {
    var parts = path.split('.');
    var obj = st;
    for (var i = 0; i < parts.length; i++) {
      if (!obj || typeof obj !== 'object') return null;
      obj = obj[parts[i]] || {};
    }
    return obj;
  }

  // ====== 联动1: G→D 极端天气生存记忆 — 长期极端天气后NPC关心 ======
  // [联动意图] weather系统(极端天气)首次被社交消费——暴雨/台风后NPC主动问候，体现社交温度
  RANDOM_EVENTS.push({
    id: "g_weather_survival_memory",
    phase: "street",
    icon: "🌊",
    title: "极端天气后的问候",
    story: "连续几天的极端天气让你苦不堪言。但出乎意料的是，有几位熟人察觉到了你的困境，主动来关心你。",
    conditions: function (st) {
      var w = st && st.weather ? st.weather.current : null;
      var extremeWeathers = ["stormy","snowy","typhoon","sandstorm","heavy_smog","heatwave"];
      var isExtreme = extremeWeathers.indexOf(w) >= 0;
      var recentStormyDays = st.flags._habits && st.flags._habits.extremeWeatherDays ? st.flags._habits.extremeWeatherDays : 0;
      return (
        st &&
        st.player &&
        st.player.day >= 30 &&
        isExtreme &&
        recentStormyDays >= 2 &&
        (!st.flags || !st.flags._weatherSurvivalMemoryDone)
      );
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🙏 感谢关心，继续奋斗",
        hint: "心情+5 · 已结识NPC好感各+1",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._weatherSurvivalMemoryDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          // 给已结识的2个NPC广播好感+1
          if (st.relationships) {
            var count = 0;
            for (var rid in st.relationships) {
              var r = st.relationships[rid];
              if (r && r.met && count < 2) {
                if (typeof applyAffinityChange === "function") {
                  applyAffinityChange(st, rid, 1, "天气问候");
                } else {
                  r.affinity = Math.min(100, (r.affinity || 0) + 1);
                }
                count++;
              }
            }
          }
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🌊 极端天气让人际温暖格外珍贵。有人记得你的处境，这本身就是一种力量。心情+5。", "success");
        },
      },
      {
        text: "😐 习惯了，没什么",
        hint: "无变化",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._weatherSurvivalMemoryDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("😐 你已经习惯了这种天气。但内心深处，那些关心还是让你感到了一丝温暖。", "info");
        },
      },
    ],
  });

  // ====== 联动2: G→B 季节更替叙事 — 每年季节轮换触发情感锚点 ======
  // [联动意图] weather.season首次被事件消费，让玩家感受到「时间流逝」的情感重量
  RANDOM_EVENTS.push({
    id: "g_season_transition_narrative",
    phase: "street",
    icon: "🍂",
    title: "又一个秋天",
    story: function (st) {
      var seasonNames = { spring: "春天", summer: "夏天", autumn: "秋天", winter: "冬天" };
      var s = st && st.weather ? st.weather.season : "";
      var sn = seasonNames[s] || s;
      return "日历翻过了一页，城市进入了" + sn + "。空气中开始有" + (s === "spring" ? "花香" : s === "summer" ? "蝉鸣" : s === "autumn" ? "落叶的味道" : "寒意") + "了。\n\n这个季节让你想起了什么？";
    },
    conditions: function (st) {
      // [全系统自洽修复] 域G A类修复: seasonChanged flag防止每日重复触发
      if (!st.flags || st.flags._seasonTransitionSeenDay === (st.player && st.player.day)) return false;
      return !!(st && st.player && st.player.day >= 30);
    },
    probability: 0.08,
    repeatable: false,
    choices: [
      {
        text: "🍁 想起了家乡的" + "🍃春风/☀️夏夜/🍂秋叶/❄️冬雪",
        hint: "心情+3 · 心智+2 · 建立季节记忆flag",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._seasonTransitionSeenDay = st.player.day;
          st.flags._seasonNarrativeTriggered = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🍁 你停下脚步，想起家乡的季节。时光匆匆，但你已经在这座城市扎下了根。心情+3，心智+2。", "success");
        },
      },
      {
        text: "🚶 忙起来就没空想这些",
        hint: "无变化",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._seasonTransitionSeenDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🚶 你选择继续前行。城市永远在运转，没有人会因为季节更替而停下脚步。", "info");
        },
      },
    ],
  });

})();
