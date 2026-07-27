/**
 * 域B(事件/叙事) 联动增强 R544
 * 桥接：
 *   B→G  b544_story_life_milestone  故事人生里程碑 → 消费 event+player 数据,
 *     叙事→"每个事件都是人生一章"的生命回响
 *   B→C  b544_story_career_catalyst  故事职业催化剂 → 消费 event+skills 数据,
 *     叙事→"经历成就职业"的成长回响
 *   B→E  b544_story_economic_ripple  故事经济涟漪 → 消费 event+resources 数据,
 *     叙事→"事件影响经济"的经济回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR544Loaded) return;
  RANDOM_EVENTS._domainBLinkageR544Loaded = true;

  var EVENTS = [
    {
      id: "b544_story_life_milestone", phase: "street", _isChainEvent: false, icon: "📚",
      title: "每个事件都是人生一章",
      story: "你翻看人生篇章，发现已经经历了这么多——{desc}",
      triggers: { minDay: 70, interval: 120, maxRepeats: 3, excludeFlags: ["_b544LifeMilestoneCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b544LifeMilestoneCooldown) return false;
        return st.stats && st.stats.eventsTriggered >= 12;
      },
      choices: [
        { text: "🎉 庆祝成长", hint: "心情+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b544LifeMilestoneCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '原来我已经走了这么远。' 你为自己的成长感到骄傲。心情+8。", "success");
        }},
        { text: "🎯 立下新目标", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b544LifeMilestoneCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '下一章，要写得更加精彩。' 你立下新目标。心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你翻看人生篇章，发现已经经历了这么多——'每一个事件，都是人生的一章。' 你开始思考下一章该怎么写。";
      }
    },
    {
      id: "b544_story_career_catalyst", phase: "street", _isChainEvent: false, icon: "💡",
      title: "经历成就职业",
      story: "你发现曾经的经历正在帮助你的职业发展——{desc}",
      triggers: { minDay: 50, interval: 100, maxRepeats: 3, excludeFlags: ["_b544CareerCatalystCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b544CareerCatalystCooldown) return false;
        return st.stats && st.stats.eventsTriggered >= 8;
      },
      choices: [
        { text: "💼 应用到工作", hint: "管理XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b544CareerCatalystCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '经历是最好的老师。' 你把经历应用到工作中。管理XP+5。", "success");
        }},
        { text: "📖 分享经验", hint: "社交XP+3,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b544CareerCatalystCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '分享经验让大家少走弯路。' 社交XP+3,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现曾经的经历正在帮助你的职业发展——'原来经历真的有用。' 你开始思考如何把经历转化为职业资本。";
      }
    },
    {
      id: "b544_story_economic_ripple", phase: "street", _isChainEvent: false, icon: "💰",
      title: "事件影响经济",
      story: "最近发生的事件对你的经济状况产生了影响——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 3, excludeFlags: ["_b544EconRippleCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b544EconRippleCooldown) return false;
        return st.stats && st.stats.eventsTriggered >= 6;
      },
      choices: [
        { text: "📈 抓住机会", hint: "现金+800", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b544EconRippleCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 800;
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '危机就是转机。' 你抓住了机会。现金+¥800。", "success");
        }},
        { text: "🛡️ 谨慎行事", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b544EconRippleCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '小心驶得万年船。' 你选择谨慎行事。会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "最近发生的事件对你的经济状况产生了影响——'事件的影响正在显现。' 你开始思考如何应对。";
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
