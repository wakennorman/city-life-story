/**
 * 域F(UI/UX) 联动增强 R521
 * 桥接：
 *   F→H  f521_corp_achievement_ui 公司成就UI → 消费 corporate 数据,
 *     成就→"公司获得的荣誉"的成就展示
 *   F→D  f521_social_quick_actions 社交快捷操作 → 消费 relationships 数据,
 *     快捷→"快速联系"的社交快捷面板
 *   F→G  f521_life_tips_ui        生活小贴士UI → 消费 needs+status 数据,
 *     提示→"根据你的状态推荐行动"的智能提示
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR521Loaded) return;
  RANDOM_EVENTS._domainFLinkageR521Loaded = true;

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
      id: "f521_corp_achievement_ui", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司荣誉榜",
      story: "公司获得了一个行业奖项——{desc}",
      triggers: { minDay: 55, interval: 180, maxRepeats: 3, excludeFlags: ["_f521AchievementUICooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._f521AchievementUICooldown);
      },
      choices: [
        { text: "🏆 展示出来", hint: "管理XP+5,公司知名度+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f521AchievementUICooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 '把奖杯放在最显眼的位置！' 管理XP+5,公司知名度+5,心情+3。", "success");
        }},
        { text: "📣 发新闻稿", hint: "管理XP+3,名气+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f521AchievementUICooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 你发了新闻稿——'XX公司荣获行业大奖！' 管理XP+3,名气+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司获得了一个行业奖项——'恭喜！你们的努力被看到了！' 奖杯虽小，却是对团队最大的肯定。";
      }
    },
    {
      id: "f521_social_quick_actions", phase: "street", _isChainEvent: false, icon: "⚡",
      title: "快捷操作",
      story: "你发现了一个快捷联系朋友的按钮——{desc}",
      triggers: { minDay: 10, interval: 30, maxRepeats: 5, excludeFlags: ["_f521QuickActionsCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f521QuickActionsCooldown);
      },
      choices: [
        { text: "⚡ 使用快捷操作", hint: "好感+1,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f521QuickActionsCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "快捷联系");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚡ 一键发送了问候——'最近好吗？' 简单快捷，但心意不减。好感+1,心情+1。", "success");
        }},
        { text: "📞 亲自打电话", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f521QuickActionsCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "亲自打电话");
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚡ 你选择了亲自打电话——'快捷操作虽然方便，但亲自打电话更有温度。' 好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现了一个快捷联系朋友的按钮——'一键就能问候所有朋友，太方便了！' 科技让社交更容易，但别忘了真诚。";
      }
    },
    {
      id: "f521_life_tips_ui", phase: "street", _isChainEvent: false, icon: "💡",
      title: "生活小贴士",
      story: "系统根据你的状态推荐了一个行动——{desc}",
      triggers: { minDay: 10, interval: 20, maxRepeats: 10, excludeFlags: ["_f521LifeTipsCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f521LifeTipsCooldown);
      },
      choices: [
        { text: "💡 采纳建议", hint: "健康+1,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f521LifeTipsCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '系统建议你出去走走，呼吸新鲜空气。' 你听从了建议。健康+1,心情+1。", "success");
        }},
        { text: "⏰ 稍后再说", hint: "无奖励", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f521LifeTipsCooldown = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "系统根据你的状态推荐了一个行动——'今天你的疲劳值较高，建议休息一下。' 智能助手，比你更了解你的状态。";
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