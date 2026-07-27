/**
 * 域B(事件/叙事) 联动增强 R429
 * 桥接：
 *   B→C  b429_event_catalyst_v3         事件催化剂v3 → 经历→职业灵感
 *   B→D  b429_shared_story               共同故事 → 事件→社交深化
 *   B→G  b429_narrative_health           叙事健康 → 故事→身心健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR429Loaded) return;
  RANDOM_EVENTS._domainBLinkageR429Loaded = true;
  function grantXp(key, amt) { if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} } }
  var EVENTS = [
    {
      id: "b429_event_catalyst_v3", phase: "street", _isChainEvent: false, icon: "⚡",
      title: "经历是职业的催化剂",
      story: "你发现经历在催化职业发展——{desc}",
      triggers: { minDay: 75, excludeFlags: ["_b429CatalystCooldown"] },
      conditions: function (st) { return !st.gameOver; },
      choices: [
        { text: "📚 把经历转化为能力", hint: "心智+4,management XP+3", apply: function (st) {
          if (!st) return; st.flags._b429CatalystCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          grantXp("management", 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚡ 经历是职业的催化剂——每段故事都在塑造你的能力。心智+4,管理XP+3。", "success");
        }},
        { text: "🤷 经历就是经历", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "每段经历都在悄然催化职业发展";
        if (st.flags && st.flags._eventHistory && st.flags._eventHistory.length > 10) desc = "丰富的人生经历,正在成为你职业发展的独特优势";
        return "你发现经历在催化职业发展——" + desc + "。";
      }
    },
    {
      id: "b429_shared_story", phase: "street", _isChainEvent: false, icon: "📖",
      title: "共同的故事",
      story: "你和朋友分享彼此的故事——{desc}",
      triggers: { minDay: 60, excludeFlags: ["_b429StoryCooldown"] },
      conditions: function (st) { return !st.gameOver && st.relationships && Object.keys(st.relationships).length > 0; },
      choices: [
        { text: "💕 共同故事深化关系", hint: "心情+5,心智+2", apply: function (st) {
          if (!st) return; st.flags._b429StoryCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 共同故事深化关系——分享是友谊的催化剂。心情+5,心智+2。", "success");
        }},
        { text: "😊 故事留在心里", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        return "你和朋友分享彼此的故事——共同的经历是关系的纽带。";
      }
    },
    {
      id: "b429_narrative_health", phase: "street", _isChainEvent: false, icon: "💚",
      title: "叙事与健康",
      story: "你发现讲述故事对健康有益——{desc}",
      triggers: { minDay: 70, excludeFlags: ["_b429HealthCooldown"] },
      conditions: function (st) { return !st.gameOver && st.status; },
      choices: [
        { text: "💪 叙事是最好的疗愈", hint: "心智+3,心情+4", apply: function (st) {
          if (!st) return; st.flags._b429HealthCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💚 叙事是最好的疗愈——讲述故事,治愈心灵。心智+3,心情+4。", "success");
        }},
        { text: "😅 健康靠锻炼", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现讲述故事对健康有益——叙事疗法是身心健康的自然良药。";
      }
    }
  ];
  for (var i = 0; i < EVENTS.length; i++) { if (!RANDOM_EVENTS.find(function (ev) { return ev.id === EVENTS[i].id; })) RANDOM_EVENTS.push(EVENTS[i]); }
})();
