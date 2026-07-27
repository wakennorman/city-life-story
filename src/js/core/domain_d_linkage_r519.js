/**
 * 域D(NPC/社交) 联动增强 R519
 * 桥接：
 *   D→H  d519_npc_headhunt      NPC猎头 → 消费 relationships 数据,
 *     人脉→"朋友推荐了一个好工作"的猎头叙事
 *   D→A  d519_npc_market_talk   NPC市场谈 → 消费 relationships 数据,
 *     交流→"和业内人士聊市场"的信息交换
 *   D→F  d519_npc_social_feed   NPC社交动态 → 消费 relationships 数据,
 *     动态→"朋友最近在忙什么"的社交动态
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR519Loaded) return;
  RANDOM_EVENTS._domainDLinkageR519Loaded = true;

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
      id: "d519_npc_headhunt", phase: "corporate", _isChainEvent: false, icon: "🎯",
      title: "猎头来了",
      story: "一个朋友推荐了一个工作机会给你——{desc}",
      triggers: { minDay: 35, interval: 120, maxRepeats: 3, excludeFlags: ["_d519HeadhuntCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._d519HeadhuntCooldown);
      },
      choices: [
        { text: "🎯 了解一下", hint: "管理XP+5,社交XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d519HeadhuntCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "推荐工作机会");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 'XX公司正在招人，我觉得你很适合！' 朋友的推荐，是最好的信任背书。管理XP+5,社交XP+3,好感+2。", "success");
        }},
        { text: "📋 推荐给别人", hint: "社交XP+3,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d519HeadhuntCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "转介绍工作机会");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '这个工作更适合我朋友，我推荐TA去。' 社交XP+3,好感+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一个朋友推荐了一个工作机会给你——'我觉得你挺适合这个岗位的，要不要试试？' 人脉，就是最好的职业中介。";
      }
    },
    {
      id: "d519_npc_market_talk", phase: "street", _isChainEvent: false, icon: "💬",
      title: "行业交流",
      story: "你和业内人士聊了聊市场行情——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_d519MarketTalkCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d519MarketTalkCooldown);
      },
      choices: [
        { text: "💬 多听多学", hint: "贸易XP+4,心智+1,好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d519MarketTalkCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("trade", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "交流市场信息");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💬 '听君一席话，胜读十年书。' 和业内人士交流，收获满满。贸易XP+4,心智+1,好感+1。", "success");
        }},
        { text: "📝 记下关键信息", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d519MarketTalkCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💬 你记下了交流中的关键信息——'这些信息，以后可能用得上。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你和业内人士聊了聊市场行情——'最近XX行业不太好做啊，但YY方向有机会。' 信息差，就是赚钱的机会。";
      }
    },
    {
      id: "d519_npc_social_feed", phase: "street", _isChainEvent: false, icon: "📱",
      title: "朋友动态",
      story: "你刷到朋友的动态，TA最近在忙一件有趣的事——{desc}",
      triggers: { minDay: 10, interval: 25, maxRepeats: 10, excludeFlags: ["_d519SocialFeedCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d519SocialFeedCooldown);
      },
      choices: [
        { text: "📱 点赞评论", hint: "好感+1,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d519SocialFeedCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "点赞互动");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 你点了赞，评论了一句——'厉害！' 简单的互动，也能拉近距离。好感+1,心情+1。", "success");
        }},
        { text: "💬 私聊关心", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d519SocialFeedCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "私聊关心近况");
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 你发了条私信——'看到你最近在做XX，好棒！' 朋友很高兴你关注TA。好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你刷到朋友的动态，TA最近在忙一件有趣的事——'看到朋友过得不错，自己也开心。'";
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