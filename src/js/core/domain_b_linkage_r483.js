/**
 * 域B(事件/叙事) 联动增强 R483（第二十五轮循环·续）
 * 桥接：
 *   B→F  b483_event_memory_ui      事件记忆UI → 消费 event_history 数据,
 *     事件→"你经历了什么"的UI展示
 *   B→B  b483_story_web            故事网 → 消费 events_core 数据,
 *     事件→"故事之间的关联"的叙事演化
 *   b483_life_chapter(G→B 人生章节v2): story_chapters→"你的人生走到哪了"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR483Loaded) return;
  RANDOM_EVENTS._domainBLinkageR483Loaded = true;

  var EVENTS = [
    {
      id: "b483_event_memory_ui", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "事件记忆",
      story: "你回顾了自己经历过的事件——{desc}",
      triggers: { minDay: 40, interval: 60, maxRepeats: 5, excludeFlags: ["_b483MemoryUiCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.eventHistory) return false;
        return Object.keys(st.stats.eventHistory).length >= 3 && (st.flags && !st.flags._b483MemoryUiCooldown);
      },
      choices: [
        { text: "📖 制作记忆墙", hint: "心智+3,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b483MemoryUiCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你制作了事件记忆墙——'每一个事件都是人生的一笔。' 心智+3,心情+3。", "success");
        }},
        { text: "🎯 提炼教训", hint: "智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b483MemoryUiCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你提炼了经验教训——'经历不总结就是白经历。' 智力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var count = st.stats && st.stats.eventHistory ? Object.keys(st.stats.eventHistory).length : 0;
        return "你回顾了自己经历过的" + count + "种事件——每一个都是你人生故事的素材。";
      }
    },
    {
      id: "b483_story_web", phase: "street", _isChainEvent: false, icon: "🕸️",
      title: "故事之网",
      story: "你发现不同事件之间有着微妙的联系——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 3, excludeFlags: ["_b483StoryWebCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.eventHistory) return false;
        return Object.keys(st.stats.eventHistory).length >= 8 && (st.flags && !st.flags._b483StoryWebCooldown);
      },
      choices: [
        { text: "🔗 寻找关联", hint: "智力+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b483StoryWebCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔗 你寻找了事件之间的关联——'万事皆有联系。' 智力+3,心智+2。", "success");
        }},
        { text: "🎨 创作故事", hint: "魅力+3,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b483StoryWebCooldown = true;
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
    },
    {
      id: "b483_life_chapter", phase: "street", _isChainEvent: false, icon: "📖",
      title: "人生章节",
      story: "你回顾了自己的人生走到哪了——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_b483ChapterCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.storyChapters || !st.storyChapters.current) return false;
        return (st.flags && !st.flags._b483ChapterCooldown);
      },
      choices: [
        { text: "📖 回顾章节", hint: "心智+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b483ChapterCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你回顾了人生章节——'每一段都值得铭记。' 心智+4,心情+3。", "success");
        }},
        { text: "🎯 规划下一章", hint: "智力+2,全技能XP+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b483ChapterCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          var skills = ["accounting", "management", "sales", "coding", "social"]; // [全系统自洽修复] 域E R588 修复:trade非真实技能键(addSkillXp静默丢弃XP)→映射social
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 1); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你规划了下一章——'人生需要新目标。' 智力+2,全技能XP+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var chapter = st.storyChapters && st.storyChapters.current ? st.storyChapters.current : "生存";
        return "你回顾了自己的人生——当前章节是「" + chapter + "」。你走到哪了？下一章写什么？";
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
