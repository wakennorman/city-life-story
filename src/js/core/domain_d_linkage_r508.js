/**
 * 域D(NPC/社交) 联动增强 R508
 * 桥接：
 *   D→F  d508_npc_relationship_ui  NPC关系UI → 消费 relationships 数据,
 *     社交→"谁是你最重要的朋友"的关系可视化
 *   D→E  d508_npc_business_angel  NPC商业天使 → 消费 relationships 数据,
 *     贵人→"在你最需要的时候出现的人"的贵人叙事
 *   D→G  d508_npc_life_share     NPC生活分享 → 消费 relationships+needs 数据,
 *     日常→"朋友分享的生活小确幸"的温暖叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR508Loaded) return;
  RANDOM_EVENTS._domainDLinkageR508Loaded = true;

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
      id: "d508_npc_relationship_ui", phase: "street", _isChainEvent: false, icon: "👥",
      title: "朋友圈",
      story: "你翻看通讯录，给朋友们排了个序——{desc}",
      triggers: { minDay: 15, interval: 60, maxRepeats: 5, excludeFlags: ["_d508RelationshipUICooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d508RelationshipUICooldown);
      },
      choices: [
        { text: "👥 联系最亲近的", hint: "好感+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d508RelationshipUICooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "主动联系亲近朋友");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 你给最好的朋友发了条消息——'想你了，今晚有空吗？' 对方秒回：'有！' 好感+2,心情+2。", "success");
        }},
        { text: "📊 分析社交圈", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d508RelationshipUICooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 你分析了自己的社交圈结构——'原来我的社交圈可以分为这几类人。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你翻看通讯录，给朋友们排了个序——谁是最重要的、谁是经常联系的、谁是好久没见的。社交圈，需要定期整理。";
      }
    },
    {
      id: "d508_npc_business_angel", phase: "corporate", _isChainEvent: false, icon: "👼",
      title: "生命中的贵人",
      story: "在你最困难的时候，一个朋友伸出了援手——{desc}",
      triggers: { minDay: 40, interval: 180, maxRepeats: 3, excludeFlags: ["_d508BusinessAngelCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._d508BusinessAngelCooldown);
      },
      choices: [
        { text: "👼 铭记在心", hint: "好感+4,心情+3,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d508BusinessAngelCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 4, "雪中送炭");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("👼 '在最困难的时候拉我一把的人，我一辈子记得。' 好感+4,心情+3,管理XP+3。", "success");
        }},
        { text: "💪 传递善意", hint: "社交XP+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d508BusinessAngelCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👼 '把这份善意传递下去。' 你决定以后也要像TA一样帮助别人。社交XP+3,心情+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "在你最困难的时候，一个朋友伸出了援手——'需要多少钱？我这里有。' 那一刻，你差点哭出来。";
      }
    },
    {
      id: "d508_npc_life_share", phase: "street", _isChainEvent: false, icon: "☀️",
      title: "小确幸",
      story: "朋友跟你分享了一件开心的小事——{desc}",
      triggers: { minDay: 10, interval: 20, maxRepeats: 10, excludeFlags: ["_d508LifeShareCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d508LifeShareCooldown);
      },
      choices: [
        { text: "☀️ 一起开心", hint: "心情+3,好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d508LifeShareCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "分享快乐");
          if (typeof StateManager !== "undefined") StateManager.addMessage("☀️ '真的吗？太好了！' 朋友开心的事，也让你开心了起来。快乐是会传染的。心情+3,好感+1。", "success");
        }},
        { text: "🎉 帮TA庆祝", hint: "好感+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d508LifeShareCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "帮朋友庆祝");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("☀️ '走，请你吃顿好的庆祝一下！' 朋友的好事，值得一起庆祝。好感+2,心情+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友跟你分享了一件开心的小事——'我家的猫今天学会开门了！' 生活中的小确幸，虽然小，但很暖。";
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