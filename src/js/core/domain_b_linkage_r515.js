/**
 * 域B(事件/叙事) 联动增强 R515
 * 桥接：
 *   B→C  b515_event_skill_awakening 事件技能觉醒 → 消费 flags 数据,
 *     触动→"这件事让你发现自己的潜力"的技能觉醒
 *   B→D  b515_event_community     事件社区 → 消费 flags 数据,
 *     集体→"大家一起经历的事"的社区共鸣
 *   B→F  b515_event_diary_ui      事件日记UI → 消费 flags 数据,
 *     记录→"把事情写进日记"的UI日记功能
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR515Loaded) return;
  RANDOM_EVENTS._domainBLinkageR515Loaded = true;

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
      id: "b515_event_skill_awakening", phase: "street", _isChainEvent: false, icon: "💡",
      title: "潜力觉醒",
      story: "一件偶然的事，让你发现了自己的隐藏技能——{desc}",
      triggers: { minDay: 20, interval: 90, maxRepeats: 3, excludeFlags: ["_b515SkillAwakeningCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b515SkillAwakeningCooldown);
      },
      choices: [
        { text: "💡 好好培养", hint: "全技能XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b515SkillAwakeningCooldown = true;
          var skills = ["accounting", "management", "marketing", "technology", "social", "trade"];
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 3); } catch(e) {} } }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '原来我在这方面还有天赋！' 你决定好好培养这个技能。全技能XP+3,心智+2。", "success");
        }},
        { text: "📝 记下来", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b515SkillAwakeningCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 你把这个发现记在了日记里——'原来我还可以这样。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一件偶然的事，让你发现了自己的隐藏技能——'原来我还能做这个！' 有时候，你不试试，永远不知道自己的潜力。";
      }
    },
    {
      id: "b515_event_community", phase: "street", _isChainEvent: false, icon: "🏘️",
      title: "社区共鸣",
      story: "小区里发生了一件让大家团结起来的事——{desc}",
      triggers: { minDay: 25, interval: 120, maxRepeats: 3, excludeFlags: ["_b515CommunityCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b515CommunityCooldown);
      },
      choices: [
        { text: "🏘️ 参与其中", hint: "社交XP+4,好感+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b515CommunityCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "一起参与社区活动");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏘️ '大家一起来，就没有解决不了的问题。' 社区的力量，让你感动。社交XP+4,好感+2,心情+2。", "success");
        }},
        { text: "👀 默默支持", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b515CommunityCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏘️ 你在心里默默支持——'虽然没出声，但心是热的。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "小区里发生了一件让大家团结起来的事——'我们一起去跟物业谈谈！' 平时不怎么说话的邻居，此刻成了一家人。";
      }
    },
    {
      id: "b515_event_diary_ui", phase: "street", _isChainEvent: false, icon: "📔",
      title: "写日记",
      story: "你打开日记本，把今天的事记了下来——{desc}",
      triggers: { minDay: 10, interval: 30, maxRepeats: 10, excludeFlags: ["_b515DiaryUICooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b515DiaryUICooldown);
      },
      choices: [
        { text: "📔 写详细些", hint: "心智+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b515DiaryUICooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📔 你写了一大篇——'把今天的事记下来，以后回头看，一定很有意思。' 心智+2,心情+2。", "success");
        }},
        { text: "✍️ 简单记", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b515DiaryUICooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📔 '今天，晴，心情不错。' 简单几个字，记录了一天的心情。心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你打开日记本，把今天的事记了下来——'第X天，今天发生了...' 写日记，是和自己的对话。";
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