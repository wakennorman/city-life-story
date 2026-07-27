/**
 * 域D(NPC/社交) 联动增强 R492
 * 桥接：
 *   D→H  d492_npc_business_ref    NPC生意推荐 → 消费 relationships 数据,
 *     人脉→"朋友介绍了一单生意"的商业社交
 *   D→A  d492_npc_price_network   NPC价格网络 → 消费 relationships 数据,
 *     社交→"朋友多了好砍价"的社交资本
 *   D→G  d492_npc_mood_boost      NPC情绪提升 → 消费 relationships+needs 数据,
 *     社交→"心情不好的时候找朋友"的情绪支持
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR492Loaded) return;
  RANDOM_EVENTS._domainDLinkageR492Loaded = true;

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
      id: "d492_npc_business_ref", phase: "corporate", _isChainEvent: false, icon: "📇",
      title: "朋友介绍",
      story: "一个朋友给你介绍了一单生意——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 3, excludeFlags: ["_d492BusinessRefCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._d492BusinessRefCooldown);
      },
      choices: [
        { text: "📇 接下来", hint: "社交XP+5,公司资金+3000,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d492BusinessRefCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (st.corporate && st.corporate.company) st.corporate.company.funds = (st.corporate.company.funds || 0) + 3000;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "介绍生意");
          if (typeof StateManager !== "undefined") StateManager.addMessage("📇 朋友介绍的生意谈成了——'谢谢！下次请你吃饭！' 社交XP+5,公司资金+¥3000,好感+2。", "success");
        }},
        { text: "📋 转介绍给别人", hint: "社交XP+3,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d492BusinessRefCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "转介绍生意");
          if (typeof StateManager !== "undefined") StateManager.addMessage("📇 你把这单生意转介绍给了更合适的朋友——'这个我更专业的朋友做更合适。' 社交XP+3,好感+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一个朋友给你介绍了一单生意——'这事儿我觉得你能做，就推荐你了。' 人脉，就是钱脉。";
      }
    },
    {
      id: "d492_npc_price_network", phase: "street", _isChainEvent: false, icon: "🔗",
      title: "朋友价",
      story: "你通过朋友认识了另一个朋友，买东西便宜了——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_d492PriceNetworkCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d492PriceNetworkCooldown);
      },
      choices: [
        { text: "🔗 交个朋友", hint: "好感+2,现金+300", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d492PriceNetworkCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "朋友的朋友");
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 300;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔗 '你是XX的朋友啊？那给你打个折！' 朋友的朋友，也是朋友。好感+2,省了¥300。", "success");
        }},
        { text: "📝 记下这个渠道", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d492PriceNetworkCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔗 你记下了这个渠道——'以后买东西有门路了。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你通过朋友认识了另一个朋友，买东西便宜了——'世界真小，原来你们都认识！' 社交网络的价值，超乎你的想象。";
      }
    },
    {
      id: "d492_npc_mood_boost", phase: "street", _isChainEvent: false, icon: "💛",
      title: "心情急救",
      story: "你心情不好的时候，朋友正好来找你——{desc}",
      triggers: { minDay: 10, interval: 30, maxRepeats: 5, excludeFlags: ["_d492MoodBoostCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var h = (st.needs && st.needs.happiness) || 50;
        return h < 30 && (st.flags && !st.flags._d492MoodBoostCooldown);
      },
      choices: [
        { text: "💛 跟朋友聊聊", hint: "心情+5,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d492MoodBoostCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "心情不好时陪伴");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💛 朋友看出了你的低落——'走，带你吃点好的去！' 有人关心的感觉，真好。心情+5,好感+2。", "success");
        }},
        { text: "😤 自己待着", hint: "无奖励", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d492MoodBoostCooldown = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你心情不好的时候，朋友正好来找你——'你脸色不太好，发生什么事了？' 真正的朋友，总能在你需要的时候出现。";
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