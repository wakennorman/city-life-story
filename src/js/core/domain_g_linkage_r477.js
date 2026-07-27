/**
 * 域G(核心机制/生命周期) 联动增强 R477
 * 桥接：
 *   G→H  g477_life_corp_reflect   人生公司反思 → 消费 player.day+corporate 数据,
 *     时间沉淀→"创业这些年"的人生回顾
 *   G→D  g477_life_friend_gather  人生朋友聚会 → 消费 player.day+relationships 数据,
 *     时光流逝→"老友记"的定期聚会叙事
 *   G→A  g477_life_data_anniversary 人生数据周年 → 消费 player.day+resources 数据,
 *     城市生活周年→"一年了,你过得怎么样"的数据总结
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR477Loaded) return;
  RANDOM_EVENTS._domainGLinkageR477Loaded = true;

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
      id: "g477_life_corp_reflect", phase: "corporate", _isChainEvent: false, icon: "🏢",
      title: "创业这些年",
      story: "你坐在办公室里，回想创业以来的点点滴滴——{desc}",
      triggers: { minDay: 90, interval: 180, maxRepeats: 3, excludeFlags: ["_g477CorpReflectCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._g477CorpReflectCooldown);
      },
      choices: [
        { text: "📖 写下创业故事", hint: "管理XP+5,心智+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g477CorpReflectCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏢 你写下了一路走来的故事——从一个人到一群人，从想法到公司。这些故事，值得被记住。管理XP+5,心智+2,心情+2。", "success");
        }},
        { text: "🎯 规划未来", hint: "管理XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g477CorpReflectCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏢 你开始规划公司的下一个五年——'过去的成绩已经翻篇，未来才是重点。' 管理XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        return "你坐在办公室里，回想创业以来的点点滴滴——从第1天到第" + day + "天，这条路走得不容易，但值得。";
      }
    },
    {
      id: "g477_life_friend_gather", phase: "street", _isChainEvent: false, icon: "🍻",
      title: "老友记",
      story: "几个老朋友约你出来聚聚——{desc}",
      triggers: { minDay: 40, interval: 120, maxRepeats: 3, excludeFlags: ["_g477FriendGatherCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._g477FriendGatherCooldown);
      },
      choices: [
        { text: "🍻 不醉不归", hint: "好感+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g477FriendGatherCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 4, "老友聚会");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍻 老友见面，几杯酒下肚，话匣子就打开了——'还是跟你们在一起最自在。' 好感+4,心情+3。", "success");
        }},
        { text: "☕ 喝茶聊天", hint: "好感+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g477FriendGatherCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "老友喝茶");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍻 你们找了家安静的茶馆，一边喝茶一边聊近况——平淡但温暖。好感+2,心情+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "几个老朋友约你出来聚聚——'好久不见了，出来坐坐？' 有些朋友，不管多久没见，见面还是那么亲。";
      }
    },
    {
      id: "g477_life_data_anniversary", phase: "street", _isChainEvent: false, icon: "🎂",
      title: "城市生活周年",
      story: "今天是你来到这座城市的第N天——{desc}",
      triggers: { minDay: 60, interval: 180, maxRepeats: 3, excludeFlags: ["_g477DataAnniversaryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var day = (st.player && st.player.day) || 0;
        return (day % 30 === 0) && (st.flags && !st.flags._g477DataAnniversaryCooldown);
      },
      choices: [
        { text: "📊 看看数据", hint: "心智+3,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g477DataAnniversaryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎂 你打开自己的城市生存数据——'原来我在这里已经这么久了。' 数据记录了你的每一步成长。心智+3,会计XP+2。", "success");
        }},
        { text: "🎉 庆祝一下", hint: "心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g477DataAnniversaryCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎂 你决定庆祝一下——'来这座城市第N天了，谢谢自己坚持了下来。' 心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var cash = (st.resources && st.resources.cash) || 0;
        return "今天是你来到这座城市的第" + day + "天——从当初的迷茫到现在的" + (cash >= 50000 ? "小有成绩" : "仍在奋斗") + "，每一步都算数。";
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