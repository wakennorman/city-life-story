/**
 * 域B(事件/叙事) 联动增强 R534
 * 桥接：
 *   B→A  b534_story_data_wealth  故事数据财富 → 消费 event+resources 数据,
 *     叙事→"你的故事就是财富"的数据沉淀
 *   B→G  b534_story_life_chapter  故事人生章节 → 消费 event+player 数据,
 *     叙事→"每个事件都是人生一章"的生命回响
 *   B→C  b534_story_career_tale   故事职业传说 → 消费 event+skills 数据,
 *     叙事→"经历成就职业"的成长回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR534Loaded) return;
  RANDOM_EVENTS._domainBLinkageR534Loaded = true;

  var EVENTS = [
    {
      id: "b534_story_data_wealth", phase: "street", _isChainEvent: false, icon: "📖",
      title: "你的故事就是财富",
      story: "回顾这些年的经历，你发现每一段故事都有价值——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_b534StoryWealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b534StoryWealthCooldown) return false;
        return st.stats && st.stats.eventsTriggered >= 10;
      },
      choices: [
        { text: "📝 写成书", hint: "智力+3,现金+1000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b534StoryWealthCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.mental || 50) + 3);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把经历写出来，竟然有人愿意看。' 你写了一本自传。智力+3,现金+¥1000。", "success");
        }},
        { text: "🗣️ 讲给后辈", hint: "社交XP+5,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b534StoryWealthCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '年轻人，我跟你讲讲当年的故事。' 你把经历分享给后辈。社交XP+5,心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "回顾这些年的经历，你发现每一段故事都有价值——'这些经历，值得被记住。' 你开始思考如何把故事变成财富。";
      }
    },
    {
      id: "b534_story_life_chapter", phase: "street", _isChainEvent: false, icon: "📚",
      title: "每个事件都是人生一章",
      story: "你翻看人生篇章，发现已经经历了这么多——{desc}",
      triggers: { minDay: 80, interval: 150, maxRepeats: 3, excludeFlags: ["_b534LifeChapterCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b534LifeChapterCooldown) return false;
        return st.stats && st.stats.eventsTriggered >= 15;
      },
      choices: [
        { text: "🎉 庆祝成长", hint: "心情+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b534LifeChapterCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '原来我已经走了这么远。' 你为自己的成长感到骄傲。心情+8。", "success");
        }},
        { text: "🎯 立下新目标", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b534LifeChapterCooldown = true;
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
      id: "b534_story_career_tale", phase: "street", _isChainEvent: false, icon: "🏆",
      title: "经历成就职业",
      story: "你发现曾经的经历正在帮助你的职业发展——{desc}",
      triggers: { minDay: 50, interval: 100, maxRepeats: 3, excludeFlags: ["_b534CareerTaleCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b534CareerTaleCooldown) return false;
        return st.stats && st.stats.eventsTriggered >= 8;
      },
      choices: [
        { text: "💼 应用到工作", hint: "管理XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b534CareerTaleCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 '经历是最好的老师。' 你把经历应用到工作中。管理XP+5。", "success");
        }},
        { text: "📖 分享经验", hint: "社交XP+3,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b534CareerTaleCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 '分享经验让大家少走弯路。' 社交XP+3,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现曾经的经历正在帮助你的职业发展——'原来经历真的有用。' 你开始思考如何把经历转化为职业资本。";
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
