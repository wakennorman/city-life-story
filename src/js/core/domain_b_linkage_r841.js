/**
 * 域B(事件/叙事) 联动增强 R841
 * 全系统优化·Domain B 第七十轮循环
 *
 * 【联动增强3项】
 *   1. B→A 事件数据遗产v8 — 事件数据转化为数值洞察
 *   2. B→D 事件友谊深化v8 — 事件触发NPC社交回响
 *   3. B→G 事件人生影响v8 — 事件触发人生成长智慧
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR841Loaded) return;
  RANDOM_EVENTS._domainBLinkageR841Loaded = true;

  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  function pickMetNpc(st) {
    if (!st || !st.relationships) return null;
    var ids = [];
    for (var k in st.relationships) {
      if (st.relationships[k] && st.relationships[k].met) ids.push(k);
    }
    return ids.length > 0 ? ids[Random.int(0, ids.length - 1)] : null;
  }

  function npcName(id) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(id) || "老友"; } catch (e) { return "老友"; }
    }
    return "老友";
  }

  var EVENTS = [
    {
      id: "b841_event_data_v8",
      phase: "street",
      icon: "📊",
      title: "事件数据，是经验的沉淀",
      story: "你翻看过去发生的事件记录——每一个事件都是一次经验。成功或失败，都在你的人生数据中留下了印记。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b841EventDataDone) return false;
        return st.player.day >= 250;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 分析事件数据沉淀",
          hint: "智力+25, 心智+24, 置_b841EventData",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b841EventDataDone = true;
            st.flags._b841EventData = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 25);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 24);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 事件数据分析完成——智力+25, 心智+24。", "success");
            }
          }
        },
        {
          text: "😊 过去的就让它过去",
          hint: "心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b841EventDataDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 过去的就让它过去。心情+5。", "info");
            }
          }
        }
      ]
    },
    {
      id: "b841_event_friendship_v8",
      phase: "street",
      icon: "🤝",
      title: "共同经历，友谊更深",
      story: "你和朋友聊起过去一起经历的那些事——有开心的，也有艰难的。但无论好坏，这些共同的记忆，让你们的友谊更加深厚。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b841EventFriendshipDone) return false;
        var npc = pickMetNpc(st);
        return npc !== null && st.player.day >= 180;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🤝 回忆共同的经历",
          hint: "好感+6, 心情+18, 社交XP+22, 置_b841Friendship",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b841EventFriendshipDone = true;
            st.flags._b841Friendship = true;
            var nid = pickMetNpc(st);
            if (nid && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, nid, 6, "共同经历回忆"); } catch (e) {}
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
            grantXp("social", 22);
            if (typeof StateManager !== "undefined") {
              var name = nid ? npcName(nid) : "老友";
              StateManager.addMessage("🤝 你和" + name + "回忆了过去的经历——好感+6, 心情+18, 社交XP+22。", "success");
            }
          }
        },
        {
          text: "😊 珍惜当下就好",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b841EventFriendshipDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 珍惜当下就好。心智+5。", "info");
            }
          }
        }
      ]
    },
    {
      id: "b841_event_life_v8",
      phase: "street",
      icon: "🌱",
      title: "经历，是最好的老师",
      story: "夜深人静，你回想起这一路走来的经历。每一次挫折，每一次成功，都让你变得更强大。经历，是人生最好的老师。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b841EventLifeDone) return false;
        return st.player.day >= 300;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🌱 从经历中汲取智慧",
          hint: "心智+26, 魅力+20, 置_b841LifeWisdom",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b841EventLifeDone = true;
            st.flags._b841LifeWisdom = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 26);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 20);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌱 你从经历中汲取了智慧——心智+26, 魅力+20。", "success");
            }
          }
        },
        {
          text: "😊 睡一觉，明天再说",
          hint: "疲劳-10, 心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b841EventLifeDone = true;
            if (st.needs) {
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 睡一觉，明天再说。疲劳-10, 心情+5。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();