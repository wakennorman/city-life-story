/**
 * 域B(事件/叙事) 联动增强 R651
 * 桥接：
 *   B→D  b651_event_friend_bond  事件友谊纽带 → 消费 state.flags+state.relationships 数据,
 *     事件→"共同经历加深友谊"的社交回响
 *   B→E  b651_news_economic_awareness  新闻经济意识 → 消费 state.activeNews+state.resources 数据,
 *     事件→"新闻塑造经济观念"的经济回响
 *   B→G  b651_weather_story_mood  天气故事心情 → 消费 state.player.day+state.needs 数据,
 *     事件→"天气变化影响心情"的生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR651Loaded) return;
  RANDOM_EVENTS._domainBLinkageR651Loaded = true;

  function metNpcsR651(st, minAff) {
    var out = [];
    var rels = st.relationships || {};
    minAff = minAff || 0;
    for (var k in rels) {
      if (rels[k] && rels[k].met && (rels[k].affinity || 0) >= minAff) {
        out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
      }
    }
    return out;
  }

  function getSeasonR651(st) {
    var day = (st.player && st.player.day) || 1;
    var doy = ((day - 1) % 365) + 1;
    if (doy <= 90) return { name: "spring", label: "春天", icon: "🌸" };
    if (doy <= 181) return { name: "summer", label: "夏天", icon: "🌻" };
    if (doy <= 273) return { name: "autumn", label: "秋天", icon: "🍂" };
    return { name: "winter", label: "冬天", icon: "❄️" };
  }

  var EVENTS = [
    // ====== B→D: 事件友谊纽带 ======
    {
      id: "b651_event_friend_bond", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "共同经历",
      story: "你和朋友聊起了一起经历过的那些事——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 8, excludeFlags: ["_b651FriendBondCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b651FriendBondCooldown) return false;
        return metNpcsR651(st, 30).length >= 1;
      },
      choices: [
        { text: "🤗 一起回忆", hint: "好感+8,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b651FriendBondCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          var met = metNpcsR651(st, 30);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 8, "共同回忆"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '还记得那次咱们一起...' 你们笑作一团。共同的回忆,是友谊最好的粘合剂。好感+8,心情+5。", "success");
        }},
        { text: "🍻 喝一杯", hint: "好感+5,心情+5,现金-200", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b651FriendBondCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          var met = metNpcsR651(st, 30);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "小酌叙旧"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '来,走一个!' 一杯酒下肚,话匣子就打开了。好感+5,心情+5,现金-200。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR651(st, 30);
        var name = met.length > 0 ? met[0].name : "朋友";
        return name + "突然说:'还记得咱们刚认识那会儿吗?' 你笑了笑,那段日子虽然苦,但现在想起来全是美好的回忆。";
      }
    },

    // ====== B→E: 新闻经济意识 ======
    {
      id: "b651_news_economic_awareness", phase: "street", _isChainEvent: false, icon: "📰",
      title: "新闻启发",
      story: "一条经济新闻让你有了新的想法——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 10, excludeFlags: ["_b651NewsEconomicCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b651NewsEconomicCooldown) return false;
        return true;
      },
      choices: [
        { text: "💡 学点经济知识", hint: "智力+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b651NewsEconomicCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📰 '经济学的第一课:供需决定价格。' 你开始认真研究经济知识。智力+5,心智+2。", "success");
        }},
        { text: "📈 关注市场动态", hint: "智力+3,市场洞察+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b651NewsEconomicCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (st.flags) st.flags._marketAwareness = (st.flags._marketAwareness || 0) + 1;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📰 你开始每天关注市场动态。'信息就是金钱,这句话一点没错。' 智力+3,市场洞察+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你看到一条新闻:'央行宣布降息,房贷利率创历史新低。' 你心里一动:'这对我的财务状况会有什么影响?'";
      }
    },

    // ====== B→G: 天气故事心情 ======
    {
      id: "b651_weather_story_mood", phase: "street", _isChainEvent: false, icon: "🌤️",
      title: "天气心情",
      story: "天气的变化,让人的心情也跟着起伏——{desc}",
      triggers: { minDay: 10, interval: 30, maxRepeats: 15, excludeFlags: ["_b651WeatherMoodCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b651WeatherMoodCooldown) return false;
        return true;
      },
      choices: [
        { text: "🚶 出去走走感受天气", hint: "心情+5,健康+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b651WeatherMoodCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 2);
          var season = getSeasonR651(st);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌤️ " + season.icon + " " + season.label + "的街上,微风拂面。你深吸一口气,感觉整个人都活过来了。心情+5,健康+2。", "success");
        }},
        { text: "☕ 窝在家里喝杯热饮", hint: "心情+5,疲劳-5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b651WeatherMoodCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌤️ 你泡了一杯热茶,窝在窗边看外面的风景。'这样的日子,也挺好。' 心情+5,疲劳-5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var season = getSeasonR651(st);
        return season.icon + " " + season.label + "的天气,总是让人思绪万千。'阳光好的时候,觉得世界充满希望;阴天的时候,又觉得孤独。' 天气和心情,原来这么像。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();