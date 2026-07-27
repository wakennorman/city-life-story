/**
 * 域B(事件/叙事) 联动增强 R461（第二十三轮循环·续）
 * 桥接：
 *   B→A  b461_event_data_pattern  事件数据积累 → 消费 event_history 数据,
 *     事件频率→"你经历了什么"的数据画像
 *   B→D  b461_event_friendship     事件友谊深化 → 消费 event+relationships 数据,
 *     共同经历→"患难见真情"的社交回响
 *   B→H  b461_event_company_culture 事件公司文化 → 消费 event+corporate 数据,
 *     公司事件→"我们一起经历的故事"的文化沉淀
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR461Loaded) return;
  RANDOM_EVENTS._domainBLinkageR461Loaded = true;

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
      id: "b461_event_data_pattern", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生轨迹",
      story: "你回顾了这段时间的经历——{desc}",
      triggers: { minDay: 45, interval: 80, maxRepeats: 4, excludeFlags: ["_b461DataPatternCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.eventHistory) return false;
        return Object.keys(st.stats.eventHistory).length >= 3 && (st.flags && !st.flags._b461DataPatternCooldown);
      },
      choices: [
        { text: "📈 分析高频事件", hint: "智力+2,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b461DataPatternCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你分析了高频事件——'知道自己在经历什么，才能改变未来。' 智力+2,心智+2。", "success");
        }},
        { text: "🎯 专注避免负面", hint: "心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b461DataPatternCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你决定专注避免负面事件——'上医治未病。' 心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var count = st.stats && st.stats.eventHistory ? Object.keys(st.stats.eventHistory).length : 0;
        return "你回顾了这段时间的经历——已经触发过" + count + "种不同的事件。每一种经历都在塑造你的人生轨迹。";
      }
    },
    {
      id: "b461_event_friendship", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "患难之情",
      story: "你和{npc}一起经历了一些事——{desc}",
      triggers: { minDay: 60, interval: 100, maxRepeats: 3, excludeFlags: ["_b461FriendshipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.eventHistory) return false;
        return !!firstMetNpc(st) && (st.flags && !st.flags._b461FriendshipCooldown);
      },
      choices: [
        { text: "💬 主动联系", hint: "好感+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b461FriendshipCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 5, "患难之情");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💬 你主动联系了老朋友——'患难见真情。' 好感+5,心情+3。", "success");
        }},
        { text: "📝 写下感悟", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b461FriendshipCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📝 你写下了感悟——'有些经历，值得铭记。' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你和认识的人一起经历了一些事——那些共同度过的时光，让关系变得更加牢固。";
      }
    },
    {
      id: "b461_event_company_culture", phase: "corporate", _isChainEvent: false, icon: "🏢",
      title: "公司故事",
      story: "公司里发生了一件事，成了大家茶余饭后的谈资——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 3, excludeFlags: ["_b461CorpCultureCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        if (!st.corporate.team || st.corporate.team.length < 2) return false;
        return (st.flags && !st.flags._b461CorpCultureCooldown);
      },
      choices: [
        { text: "📖 写进公司Wiki", hint: "管理XP+3,团队忠诚+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b461CorpCultureCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 2); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你把这件事写进了公司Wiki——'好故事是公司文化的基石。' 管理XP+3,团队忠诚+2。", "success");
        }},
        { text: "🍻 聚餐时当笑话讲", hint: "团队忠诚+5,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b461CorpCultureCooldown = true;
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 5); } }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍻 聚餐时你把这件事当笑话讲——笑声是最好的团队粘合剂。团队忠诚+5,心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = st.corporate && st.corporate.team ? st.corporate.team.length : 0;
        return "公司里发生了一件事，成了" + n + "个人的谈资——好故事是团队文化的基石，它在口口相传中塑造着公司的灵魂。";
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
