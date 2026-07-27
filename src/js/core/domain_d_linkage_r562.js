/**
 * 域D(NPC/社交) 联动增强 R562
 * 桥接：
 *   D→F  d562_npc_social_timeline NPC社交时间线 → 消费 relationships 数据,
 *     时间→"朋友圈的时间线"的社交动态
 *   D→E  d562_npc_mutual_fund    NPC共同基金 → 消费 relationships 数据,
 *     基金→"和朋友一起投资"的共同基金
 *   D→G  d562_npc_weekend_plan   NPC周末计划 → 消费 relationships+needs 数据,
 *     周末→"周末约朋友出去玩"的社交计划
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR562Loaded) return;
  RANDOM_EVENTS._domainDLinkageR562Loaded = true;

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
      id: "d562_npc_social_timeline", phase: "street", _isChainEvent: false, icon: "📱",
      title: "社交时间线",
      story: "你刷着朋友圈，看着大家的动态——{desc}",
      triggers: { minDay: 10, interval: 20, maxRepeats: 10, excludeFlags: ["_d562SocialTimelineCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d562SocialTimelineCooldown);
      },
      choices: [
        { text: "📱 点赞互动", hint: "好感+1,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d562SocialTimelineCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "点赞");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 '看到朋友们的动态，感觉大家都在努力生活。' 好感+1,心情+1。", "success");
        }},
        { text: "💬 评论", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d562SocialTimelineCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "评论互动");
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 你认真评论了朋友的动态——'说得好！' 好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你刷着朋友圈，看着大家的动态——'有人晒美食、有人晒旅行、有人晒加班...' 每个人的生活，都在朋友圈里上演。";
      }
    },
    {
      id: "d562_npc_mutual_fund", phase: "street", _isChainEvent: false, icon: "💰",
      title: "共同基金",
      story: "朋友们想一起凑钱投资——{desc}",
      triggers: { minDay: 35, interval: 120, maxRepeats: 3, excludeFlags: ["_d562MutualFundCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d562MutualFundCooldown);
      },
      choices: [
        { text: "💰 参与", hint: "社交XP+4,会计XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d562MutualFundCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "共同投资");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '大家一起凑钱投资，风险共担，收益共享。' 社交XP+4,会计XP+3,好感+2。", "success");
        }},
        { text: "📋 研究风险", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d562MutualFundCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '先研究清楚风险，再决定投不投。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友们想一起凑钱投资——'我们每人出一点，凑一笔钱一起投资。' 共同基金，是朋友间的金融合作。";
      }
    },
    {
      id: "d562_npc_weekend_plan", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "周末计划",
      story: "朋友们在群里讨论周末去哪玩——{desc}",
      triggers: { minDay: 10, interval: 30, maxRepeats: 10, excludeFlags: ["_d562WeekendPlanCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d562WeekendPlanCooldown);
      },
      choices: [
        { text: "🎉 积极参与", hint: "好感+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d562WeekendPlanCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "周末相约");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎉 '周末一起去爬山吧！' 好感+2,心情+2。", "success");
        }},
        { text: "😅 婉拒", hint: "无奖励", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d562WeekendPlanCooldown = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友们在群里讨论周末去哪玩——'去爬山、去聚餐、还是去看电影？' 周末的社交活动，是城市生活的重要部分。";
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