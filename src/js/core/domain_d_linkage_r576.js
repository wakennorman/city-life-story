/**
 * 域D(NPC/社交) 联动增强 R576
 * 桥接：
 *   D→A  d576_npc_gift_market  NPC礼物市场 → 消费 relationships 数据,
 *     礼物→"送什么礼物最合适"的社交礼物
 *   D→C  d576_npc_career_boost  NPC职业助推 → 消费 relationships 数据,
 *     助推→"朋友帮你介绍工作"的职业助推
 *   D→E  d576_npc_fund_advice  NPC资金建议 → 消费 relationships 数据,
 *     建议→"朋友给的理财建议"的财务建议
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR576Loaded) return;
  RANDOM_EVENTS._domainDLinkageR576Loaded = true;

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
      id: "d576_npc_gift_market", phase: "street", _isChainEvent: false, icon: "🎁",
      title: "送礼",
      story: "朋友过生日，你在想送什么礼物——{desc}",
      triggers: { minDay: 15, interval: 60, maxRepeats: 5, excludeFlags: ["_d576GiftMarketCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d576GiftMarketCooldown);
      },
      choices: [
        { text: "🎁 用心挑选", hint: "好感+3,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d576GiftMarketCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "用心送礼");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎁 '送TA一直想要的那本书，TA一定会喜欢的。' 好感+3,心情+1。", "success");
        }},
        { text: "💰 送红包", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d576GiftMarketCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "送红包");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎁 '直接发红包，最实在。' 好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友过生日，你在想送什么礼物——'送什么好呢？' 送礼是一门艺术，也是一门学问。";
      }
    },
    {
      id: "d576_npc_career_boost", phase: "street", _isChainEvent: false, icon: "🚀",
      title: "工作机会",
      story: "朋友告诉你TA公司有个好职位——{desc}",
      triggers: { minDay: 25, interval: 90, maxRepeats: 3, excludeFlags: ["_d576CareerBoostCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._d576CareerBoostCooldown);
      },
      choices: [
        { text: "🚀 去试试", hint: "管理XP+4,社交XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d576CareerBoostCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "推荐工作");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 'TA们公司正在招人，我觉得你特别适合！' 管理XP+4,社交XP+3,好感+2。", "success");
        }},
        { text: "🙏 感谢推荐", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d576CareerBoostCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "感谢推荐");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '谢谢推荐！我考虑一下。' 好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友告诉你TA公司有个好职位——'我觉得你挺适合的，要不要我帮你内推？' 有这样的朋友，是职场上的幸运。";
      }
    },
    {
      id: "d576_npc_fund_advice", phase: "street", _isChainEvent: false, icon: "💡",
      title: "理财建议",
      story: "朋友给了你一个理财建议——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_d576FundAdviceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d576FundAdviceCooldown);
      },
      choices: [
        { text: "💡 认真研究", hint: "会计XP+4,心智+2,好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d576FundAdviceCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "理财建议");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '朋友推荐的理财方式，研究了一下确实不错。' 会计XP+4,心智+2,好感+1。", "success");
        }},
        { text: "📝 记下来", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d576FundAdviceCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '先记下来，以后可能用得上。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友给了你一个理财建议——'我最近发现一个不错的理财方式，你要不要试试？' 朋友的理财建议，比广告靠谱多了。";
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