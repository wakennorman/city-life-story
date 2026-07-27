/**
 * 域G(核心机制/生命周期) 联动增强 R512
 * 桥接：
 *   G→A  g512_life_data_legacy   人生数据遗产 → 消费 player.day+resources 数据,
 *     记录→"你的人生数据，是一笔财富"的数据积累
 *   G→D  g512_life_farewell      人生告别 → 消费 player.day+relationships 数据,
 *     离别→"在这座城市，有人离开，有人到来"的离别叙事
 *   G→F  g512_life_ui_legacy     人生UI遗产 → 消费 player.day+flags 数据,
 *     回忆→"你留下的痕迹"的人生纪念册
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR512Loaded) return;
  RANDOM_EVENTS._domainGLinkageR512Loaded = true;

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
      id: "g512_life_data_legacy", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据遗产",
      story: "你翻看着自己在这座城市留下的数据足迹——{desc}",
      triggers: { minDay: 50, interval: 180, maxRepeats: 3, excludeFlags: ["_g512DataLegacyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g512DataLegacyCooldown);
      },
      choices: [
        { text: "📊 回顾成长", hint: "心智+3,心情+2,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g512DataLegacyCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '这些数据记录了我在城市里的每一步成长。' 心智+3,心情+2,会计XP+2。", "success");
        }},
        { text: "📝 写总结", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g512DataLegacyCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据不会说谎，它记录了我的每一次选择。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var cash = (st.resources && st.resources.cash) || 0;
        return "你翻看着自己在这座城市留下的数据足迹——第" + day + "天，从¥" + Math.floor(cash).toLocaleString() + "开始... 每一个数字都是故事。";
      }
    },
    {
      id: "g512_life_farewell", phase: "street", _isChainEvent: false, icon: "👋",
      title: "送别",
      story: "一个朋友要离开这座城市了——{desc}",
      triggers: { minDay: 45, interval: 180, maxRepeats: 3, excludeFlags: ["_g512FarewellCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._g512FarewellCooldown);
      },
      choices: [
        { text: "👋 好好送别", hint: "好感+4,心情+2,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g512FarewellCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 4, "送别");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👋 '以后常联系！' 你给了朋友一个大大的拥抱。在这座城市，离别是常态，但真正的友谊不会因为距离而改变。好感+4,心情+2,心智+2。", "success");
        }},
        { text: "📞 保持联系", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g512FarewellCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "承诺保持联系");
          if (typeof StateManager !== "undefined") StateManager.addMessage("👋 '到了那边记得找我！' 你送朋友上了车，看着车远去。好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一个朋友要离开这座城市了——'我要回老家了，这里太累了。' 你沉默了一会儿，然后笑了：'祝你一切都好。'";
      }
    },
    {
      id: "g512_life_ui_legacy", phase: "street", _isChainEvent: false, icon: "📖",
      title: "人生纪念册",
      story: "你翻开这本记录着城市生活的纪念册——{desc}",
      triggers: { minDay: 60, interval: 180, maxRepeats: 3, excludeFlags: ["_g512UILegacyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g512UILegacyCooldown);
      },
      choices: [
        { text: "📖 一页一页翻", hint: "心情+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g512UILegacyCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '每一页都是回忆，每一段回忆都是人生。' 心情+4,心智+2。", "success");
        }},
        { text: "📝 写新的一页", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g512UILegacyCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '过去的已经翻篇，新的一页等着我去写。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        return "你翻开这本记录着城市生活的纪念册——第" + day + "天，每一页都是故事。你笑了笑，继续翻了下去。";
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