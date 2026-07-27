/**
 * 域B(事件/叙事) 联动增强 R490（第二十六轮循环·续）
 * 桥接：
 *   B→F  b490_event_wall_ui         事件记忆墙UI → 消费 event_history 数据,
 *     事件→"你经历了什么"的UI展示
 *   B→B  b490_narrative_evolution    叙事演化 → 消费 events_core 数据,
 *     事件→"故事如何演变"的叙事自我指涉
 *   b490_life_milestone(G→B 人生里程碑v2): age+stats→"你的人生走到哪了"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR490Loaded) return;
  RANDOM_EVENTS._domainBLinkageR490Loaded = true;

  var EVENTS = [
    {
      id: "b490_event_wall_ui", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "事件记忆墙",
      story: "你制作了事件记忆墙——{desc}",
      triggers: { minDay: 40, interval: 60, maxRepeats: 5, excludeFlags: ["_b490WallCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.eventHistory) return false;
        return Object.keys(st.stats.eventHistory).length >= 3 && (st.flags && !st.flags._b490WallCooldown);
      },
      choices: [
        { text: "📖 回顾历程", hint: "心智+3,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b490WallCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你回顾了事件记忆墙——'每一个事件都是人生的一笔。' 心智+3,心情+3。", "success");
        }},
        { text: "🎯 提炼教训", hint: "智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b490WallCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你提炼了经验教训——'经历不总结就是白经历。' 智力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var count = st.stats && st.stats.eventHistory ? Object.keys(st.stats.eventHistory).length : 0;
        return "你制作了事件记忆墙——已经经历了" + count + "种不同的事件。每一个都是你人生故事的素材。";
      }
    },
    {
      id: "b490_narrative_evolution", phase: "street", _isChainEvent: false, icon: "🦋",
      title: "叙事演化",
      story: "你发现故事在传播中不断演变——{desc}",
      triggers: { minDay: 80, interval: 100, maxRepeats: 3, excludeFlags: ["_b490NarrEvolveCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.eventHistory) return false;
        return Object.keys(st.stats.eventHistory).length >= 6 && (st.flags && !st.flags._b490NarrEvolveCooldown);
      },
      choices: [
        { text: "📊 分析演变", hint: "智力+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b490NarrEvolveCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了故事演变——'传播就是再创作。' 智力+3,心智+2。", "success");
        }},
        { text: "🎨 引导叙事", hint: "魅力+3,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b490NarrEvolveCooldown = true;
          if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎨 你引导了叙事方向——'故事的力量在于共鸣。' 魅力+3,心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现故事在传播中不断演变——同一个事件，在不同人嘴里有了不同的版本。这就是叙事的魔力。";
      }
    },
    {
      id: "b490_life_milestone", phase: "street", _isChainEvent: false, icon: "🏆",
      title: "人生里程碑",
      story: "你回顾了自己的人生走到哪了——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 4, excludeFlags: ["_b490MilestoneCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.player) return false;
        return (st.flags && !st.flags._b490MilestoneCooldown);
      },
      choices: [
        { text: "📖 回顾成长", hint: "心智+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b490MilestoneCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你回顾了人生成长——'每一段都值得铭记。' 心智+4,心情+3。", "success");
        }},
        { text: "🎯 设定新目标", hint: "智力+2,全技能XP+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b490MilestoneCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          var skills = ["accounting", "management", "sales", "coding", "trade"];
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 1); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你设定了人生新目标——'每一个终点都是新的起点。' 智力+2,全技能XP+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        return "你回顾了自己的人生——已经走过了" + days + "天。你走到哪了？下一站去哪？";
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
