/**
 * 域B(事件/叙事) 联动增强 R526
 * 桥接：
 *   B→A  b526_event_data_wisdom  事件数据智慧 → 消费 flags 数据,
 *     数据→"从数据中提取智慧"的量化叙事
 *   B→D  b526_event_friendship_test 事件友谊考验 → 消费 flags+relationships 数据,
 *     考验→"患难见真情"的友谊考验
 *   B→G  b526_event_life_turning  事件人生转折 → 消费 flags 数据,
 *     转折→"一个改变人生轨迹的事件"的转折叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR526Loaded) return;
  RANDOM_EVENTS._domainBLinkageR526Loaded = true;

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
      id: "b526_event_data_wisdom", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据的智慧",
      story: "你从一堆数据中发现了一个规律——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_b526DataWisdomCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b526DataWisdomCooldown);
      },
      choices: [
        { text: "📊 验证规律", hint: "会计XP+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b526DataWisdomCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据不会说谎，这个规律值得验证一下。' 会计XP+4,心智+2。", "success");
        }},
        { text: "📝 记录下来", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b526DataWisdomCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '把这个规律记下来，以后可能用得上。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你从一堆数据中发现了一个规律——'原来周末和周一的市场表现有这么大的差异。' 数据里藏着智慧，只要你愿意找。";
      }
    },
    {
      id: "b526_event_friendship_test", phase: "street", _isChainEvent: false, icon: "💪",
      title: "患难见真情",
      story: "你遇到困难的时候，一个朋友站了出来——{desc}",
      triggers: { minDay: 30, interval: 120, maxRepeats: 3, excludeFlags: ["_b526FriendshipTestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._b526FriendshipTestCooldown);
      },
      choices: [
        { text: "💪 感激不尽", hint: "好感+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b526FriendshipTestCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 5, "患难见真情");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '在我最需要帮助的时候，你出现了。' 这份情谊，一辈子都不会忘。好感+5,心情+3。", "success");
        }},
        { text: "💝 回报TA", hint: "社交XP+3,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b526FriendshipTestCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "回报帮助");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '你帮了我，我也要帮你。' 好感+3,社交XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你遇到困难的时候，一个朋友站了出来——'别怕，有我在。' 简单的一句话，却让你热泪盈眶。";
      }
    },
    {
      id: "b526_event_life_turning", phase: "street", _isChainEvent: false, icon: "🔄",
      title: "转折点",
      story: "一件看似偶然的事，改变了你的人生轨迹——{desc}",
      triggers: { minDay: 40, interval: 180, maxRepeats: 3, excludeFlags: ["_b526LifeTurningCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b526LifeTurningCooldown);
      },
      choices: [
        { text: "🔄 拥抱变化", hint: "心智+4,管理XP+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b526LifeTurningCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 '人生没有白走的路，每一步都算数。' 心智+4,管理XP+3,心情+2。", "success");
        }},
        { text: "💭 深度思考", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b526LifeTurningCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 '如果当时没有发生那件事，我现在会在哪里？' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一件看似偶然的事，改变了你的人生轨迹——'如果当时没有走进那家店，就不会有后来的故事。' 人生，充满了偶然。";
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