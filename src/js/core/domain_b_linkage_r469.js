/**
 * 域B(事件/叙事) 联动增强 R469（第二十四轮循环）
 * 桥接：
 *   B→C  b469_event_catalyst      事件职业催化剂 → 消费 event+skills 数据,
 *     事件→"这件事改变了你的职业轨迹"的成长叙事
 *   B→G  b469_event_life_impact    事件人生影响 → 消费 event+status 数据,
 *     事件→"这件事如何改变了你"的生命叙事
 *   b469_event_narrative_web(B→B 事件叙事网): events_core→"故事之间的关联"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR469Loaded) return;
  RANDOM_EVENTS._domainBLinkageR469Loaded = true;

  var EVENTS = [
    {
      id: "b469_event_catalyst", phase: "street", _isChainEvent: false, icon: "⚡",
      title: "转折点",
      story: "一件事改变了你的职业轨迹——{desc}",
      triggers: { minDay: 50, interval: 90, maxRepeats: 3, excludeFlags: ["_b469CatalystCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.eventHistory) return false;
        return Object.keys(st.stats.eventHistory).length >= 5 && (st.flags && !st.flags._b469CatalystCooldown);
      },
      choices: [
        { text: "🎯 深耕新方向", hint: "最高技能XP+6,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b469CatalystCooldown = true;
          var best = null, bestLv = -1;
          for (var k in st.skills) { var lv = st.skills[k] && st.skills[k].level ? st.skills[k].level : 0; if (lv > bestLv) { bestLv = lv; best = k; } }
          if (best && typeof addSkillXp === "function") { try { addSkillXp(best, 6); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你决定深耕新方向——'危机就是转机。' 最高技能XP+6,心智+2。", "success");
        }},
        { text: "🔄 回到老本行", hint: "心情+5,现金+300", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b469CatalystCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 300;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 你选择回到老本行——'还是熟悉的感觉最踏实。' 心情+5,现金+300。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你经历了一些事，它们在你心中埋下了种子——你开始思考：这些经历是否正在悄悄改变你的职业方向？";
      }
    },
    {
      id: "b469_event_life_impact", phase: "street", _isChainEvent: false, icon: "🌊",
      title: "改变",
      story: "你回顾了一件事对人生的影响——{desc}",
      triggers: { minDay: 70, interval: 100, maxRepeats: 3, excludeFlags: ["_b469ImpactCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.eventHistory) return false;
        return Object.keys(st.stats.eventHistory).length >= 4 && (st.flags && !st.flags._b469ImpactCooldown);
      },
      choices: [
        { text: "📖 写进回忆录", hint: "心智+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b469ImpactCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你把这段经历写进了回忆录——'记录，是为了更好地理解自己。' 心智+4,心情+3。", "success");
        }},
        { text: "🎯 转化为行动", hint: "智力+2,敏捷+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b469ImpactCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2); st.player.agility = Math.min(100, (st.player.agility || 50) + 1); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你把感悟转化为行动——'知行合一。' 智力+2,敏捷+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你回顾了一件事对人生的影响——有些经历当时不觉得，回头看才发现，它已经悄悄改变了你。";
      }
    },
    {
      id: "b469_event_narrative_web", phase: "street", _isChainEvent: false, icon: "🕸️",
      title: "故事之网",
      story: "你发现不同事件之间有着微妙的联系——{desc}",
      triggers: { minDay: 90, interval: 120, maxRepeats: 2, excludeFlags: ["_b469WebCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.eventHistory) return false;
        return Object.keys(st.stats.eventHistory).length >= 8 && (st.flags && !st.flags._b469WebCooldown);
      },
      choices: [
        { text: "🔗 寻找关联", hint: "智力+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b469WebCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔗 你寻找了事件之间的关联——'万事皆有联系。' 智力+3,心智+2。", "success");
        }},
        { text: "🎨 创作故事", hint: "魅力+3,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b469WebCooldown = true;
          if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎨 你把这些故事编织成了更大的叙事——'人生就是一部小说。' 魅力+3,心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var count = st.stats && st.stats.eventHistory ? Object.keys(st.stats.eventHistory).length : 0;
        return "你发现" + count + "个不同事件之间有着微妙的联系——看似孤立的故事，实际上编织成了一张人生的网。";
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
