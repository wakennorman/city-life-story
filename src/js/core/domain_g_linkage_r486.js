/**
 * 域G(核心机制/生命周期) 联动增强 R486
 * 桥接：
 *   G→E  g486_life_financial_review 人生财务回顾 → 消费 player.day+resources 数据,
 *     定期→"每季度看看钱花在哪"的财务习惯
 *   G→B  g486_life_story_chapter  人生篇章 → 消费 player.day+flags 数据,
 *     阶段→"每30天一个篇章"的人生叙事
 *   G→F  g486_life_ui_rhythm      人生UI节奏 → 消费 player.day+needs 数据,
 *     时间→"根据时间调整状态"的UI动态提示
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR486Loaded) return;
  RANDOM_EVENTS._domainGLinkageR486Loaded = true;

  var EVENTS = [
    {
      id: "g486_life_financial_review", phase: "street", _isChainEvent: false, icon: "💰",
      title: "季度财务回顾",
      story: "又到了季度末，你该看看自己的财务状况了——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 5, excludeFlags: ["_g486FinancialReviewCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g486FinancialReviewCooldown);
      },
      choices: [
        { text: "💰 仔细对账", hint: "会计XP+5,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g486FinancialReviewCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 你仔细对了这个季度的账——'收入不错，但支出也要控制。' 会计XP+5,心智+1。", "success");
        }},
        { text: "📈 看个大概", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g486FinancialReviewCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 你大概看了看——'还行，没乱花钱。' 心里有数就好。心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        var bank = (st.resources && st.resources.bankBalance) || 0;
        return "又到了季度末，你该看看自己的财务状况了——现金¥" + Math.floor(cash).toLocaleString() + "，存款¥" + Math.floor(bank).toLocaleString() + "。";
      }
    },
    {
      id: "g486_life_story_chapter", phase: "street", _isChainEvent: false, icon: "📖",
      title: "新篇章",
      story: "你感觉人生翻开了新的一页——{desc}",
      triggers: { minDay: 30, interval: 30, maxRepeats: 10, excludeFlags: ["_g486StoryChapterCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var day = (st.player && st.player.day) || 0;
        return (day % 30 === 0) && (st.flags && !st.flags._g486StoryChapterCooldown);
      },
      choices: [
        { text: "📖 回顾这一章", hint: "心智+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g486StoryChapterCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '这一章有笑有泪，但总算翻过去了。' 你回顾着过去一个月的经历，感慨万千。心智+3,心情+2。", "success");
        }},
        { text: "📝 写下新目标", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g486StoryChapterCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你给新的一章定下了目标——'这一章，我要活得更精彩。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var chapter = Math.floor(day / 30) + 1;
        return "你感觉人生翻开了新的一页——第" + chapter + "章，第" + day + "天。每一章都是一个故事。";
      }
    },
    {
      id: "g486_life_ui_rhythm", phase: "street", _isChainEvent: false, icon: "🔄",
      title: "生活节奏",
      story: "你的生活渐渐形成了一种节奏——{desc}",
      triggers: { minDay: 15, interval: 30, maxRepeats: 5, excludeFlags: ["_g486UIRhythmCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g486UIRhythmCooldown);
      },
      choices: [
        { text: "🔄 保持节奏", hint: "心智+2,健康+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g486UIRhythmCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 '好的节奏，是成功的一半。' 你找到了适合自己的生活节奏。心智+2,健康+1。", "success");
        }},
        { text: "📅 调整计划", hint: "管理XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g486UIRhythmCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 你调整了每天的安排——'时间管理好了，一天能当两天用。' 管理XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你的生活渐渐形成了一种节奏——每天早起、工作、学习、休息。规律的节奏，让生活变得简单而高效。";
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