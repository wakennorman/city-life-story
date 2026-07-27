/**
 * 域D(NPC/社交) 联动增强 R587
 * 桥接：
 *   D→B  d587_npc_story_share   NPC故事分享 → 消费 relationships 数据,
 *     故事→"朋友分享的人生故事"的生命叙事
 *   D→E  d587_npc_invest_circle  NPC投资圈 → 消费 relationships 数据,
 *     投资→"朋友的投资心得"的投资社交
 *   D→G  d587_npc_life_celebrate NPC生活庆祝 → 消费 relationships+needs 数据,
 *     庆祝→"和朋友一起庆祝生活"的快乐叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR587Loaded) return;
  RANDOM_EVENTS._domainDLinkageR587Loaded = true;

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
      id: "d587_npc_story_share", phase: "street", _isChainEvent: false, icon: "📖",
      title: "人生故事",
      story: "朋友跟你分享了TA的人生故事——{desc}",
      triggers: { minDay: 15, interval: 60, maxRepeats: 5, excludeFlags: ["_d587StoryShareCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d587StoryShareCooldown);
      },
      choices: [
        { text: "📖 认真倾听", hint: "好感+3,心情+2,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d587StoryShareCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "倾听故事");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '每个人都有自己的故事，能倾听是一种幸运。' 好感+3,心情+2,心智+1。", "success");
        }},
        { text: "💬 分享自己的", hint: "好感+2,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d587StoryShareCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "分享故事");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '听完你的故事，我也分享了我的。' 好感+2,心情+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友跟你分享了TA的人生故事——'我从来没跟别人说过这些...' 能被朋友信任，是一种幸福。";
      }
    },
    {
      id: "d587_npc_invest_circle", phase: "street", _isChainEvent: false, icon: "💹",
      title: "投资圈",
      story: "朋友们在群里讨论投资心得——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_d587InvestCircleCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d587InvestCircleCooldown);
      },
      choices: [
        { text: "💹 参与讨论", hint: "会计XP+4,社交XP+3,好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d587InvestCircleCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "投资讨论");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💹 '群里讨论的投资思路很有启发性。' 会计XP+4,社交XP+3,好感+1。", "success");
        }},
        { text: "👀 潜水学习", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d587InvestCircleCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💹 '先看看大家怎么说，再自己判断。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友们在群里讨论投资心得——'最近买的那只基金涨了！''我买的股票跌了...' 投资群里，有人欢喜有人愁。";
      }
    },
    {
      id: "d587_npc_life_celebrate", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "一起庆祝",
      story: "朋友们聚在一起庆祝生活中的好事——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_d587LifeCelebrateCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d587LifeCelebrateCooldown);
      },
      choices: [
        { text: "🎉 一起庆祝", hint: "好感+2,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d587LifeCelebrateCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "一起庆祝");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎉 '生活值得庆祝，和朋友们在一起就是最大的快乐。' 好感+2,心情+3。", "success");
        }},
        { text: "🍻 举杯", hint: "好感+1,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d587LifeCelebrateCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "举杯庆祝");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍻 '来，干杯！' 为生活中的美好时刻干杯。好感+1,心情+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友们聚在一起庆祝生活中的好事——'我升职了！''我买房了！''我结婚了！' 生活中的好事，值得和朋友一起分享。";
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