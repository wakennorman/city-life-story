/**
 * 域G(核心机制/生命周期) 联动增强 R591
 * 桥接：
 *   G→D  g591_life_friend_intro  人生朋友介绍 → 消费 player.day+relationships 数据,
 *     介绍→"朋友介绍新朋友"的社交扩展
 *   G→E  g591_life_financial_goal 人生财务目标 → 消费 player.day+resources 数据,
 *     目标→"设定财务目标并跟踪"的目标管理
 *   G→F  g591_life_ui_weather   人生UI天气 → 消费 player.day+needs 数据,
 *     天气→"天气影响心情的UI反馈"的天气UI
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR591Loaded) return;
  RANDOM_EVENTS._domainGLinkageR591Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "g591_life_friend_intro", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "朋友的朋友",
      story: "朋友介绍了一个新朋友给你认识——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_g591FriendIntroCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g591FriendIntroCooldown);
      },
      choices: [
        { text: "🤝 认识一下", hint: "社交XP+3,好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g591FriendIntroCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "介绍新朋友");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '你好！经常听XX提起你。' 社交XP+3,好感+1。", "success");
        }},
        { text: "📱 加微信", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g591FriendIntroCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "加微信");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '扫个微信，以后常联系！' 好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友介绍了一个新朋友给你认识——'这是我朋友XX，做XX行业的，你们应该聊得来。' 朋友的朋友，就是朋友。";
      }
    },
    {
      id: "g591_life_financial_goal", phase: "street", _isChainEvent: false, icon: "🎯",
      title: "财务目标",
      story: "你设定了一个新的财务目标——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_g591FinancialGoalCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g591FinancialGoalCooldown);
      },
      choices: [
        { text: "🎯 努力实现", hint: "会计XP+4,心智+2,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g591FinancialGoalCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '今年存够XX万，一步一步来。' 会计XP+4,心智+2,心情+1。", "success");
        }},
        { text: "📊 分解目标", hint: "会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g591FinancialGoalCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '把大目标分解成每月的小目标，更容易实现。' 会计XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你设定了一个新的财务目标——'今年要存够XX万，明年要买房...' 有目标的人生，才有方向。";
      }
    },
    {
      id: "g591_life_ui_weather", phase: "street", _isChainEvent: false, icon: "🌤️",
      title: "天气心情",
      story: "今天的天气影响了你的心情——{desc}",
      triggers: { minDay: 10, interval: 15, maxRepeats: 10, excludeFlags: ["_g591WeatherCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g591WeatherCooldown);
      },
      choices: [
        { text: "🌤️ 出去走走", hint: "心情+2,健康+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g591WeatherCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌤️ '天气这么好，出去走走心情好多了。' 心情+2,健康+1。", "success");
        }},
        { text: "☕ 在家喝茶", hint: "心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g591WeatherCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌤️ '下雨天，适合在家喝茶看书。' 心情+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "今天的天气影响了你的心情——'阳光明媚，心情也跟着好了起来。' 天气和心情，总有一种奇妙的联系。";
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