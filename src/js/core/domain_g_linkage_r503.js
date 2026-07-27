/**
 * 域G(核心机制/生命周期) 联动增强 R503
 * 桥接：
 *   G→D  g503_life_friend_season  人生朋友四季 → 消费 player.day+relationships 数据,
 *     时间→"朋友像四季，有的在春天相遇"的友情叙事
 *   G→F  g503_life_ui_annual     人生UI年度回顾 → 消费 player.day+resources 数据,
 *     年末→"这一年你过得怎么样"的年度总结
 *   G→H  g503_life_corp_season   人生公司四季 → 消费 player.day+corporate 数据,
 *     创业→"公司经历的春夏秋冬"的创业周期
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR503Loaded) return;
  RANDOM_EVENTS._domainGLinkageR503Loaded = true;

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
      id: "g503_life_friend_season", phase: "street", _isChainEvent: false, icon: "🌸",
      title: "朋友四季",
      story: "你发现有些朋友在某个季节特别活跃——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_g503FriendSeasonCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g503FriendSeasonCooldown);
      },
      choices: [
        { text: "🌸 随缘相处", hint: "好感+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g503FriendSeasonCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "随缘相处");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌸 '有些人出现在你的生命里，就是为了陪你走一段路。' 好感+2,心情+2。", "success");
        }},
        { text: "📞 主动联系", hint: "好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g503FriendSeasonCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "主动联系");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌸 你主动联系了那些好久不见的朋友——'最近怎么样？想你了！' 好感+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现有些朋友在某个季节特别活跃——'春天到了，该约朋友去春游了。' 朋友和时间一样，都有季节。";
      }
    },
    {
      id: "g503_life_ui_annual", phase: "street", _isChainEvent: false, icon: "📅",
      title: "年度总结",
      story: "一年快过去了，你该做个年度总结了——{desc}",
      triggers: { minDay: 60, interval: 365, maxRepeats: 2, excludeFlags: ["_g503AnnualCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g503AnnualCooldown);
      },
      choices: [
        { text: "📅 写总结", hint: "心智+4,会计XP+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g503AnnualCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📅 '这一年，有收获也有遗憾，但总体来说，我在成长。' 心智+4,会计XP+3,心情+2。", "success");
        }},
        { text: "🎯 定新年目标", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g503AnnualCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📅 '新的一年，新的目标。' 你写下了明年的计划。管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        return "一年快过去了，你该做个年度总结了——第" + day + "天，这一年你经历了什么？";
      }
    },
    {
      id: "g503_life_corp_season", phase: "corporate", _isChainEvent: false, icon: "🍂",
      title: "公司的四季",
      story: "你回顾公司的发展历程，发现它也有四季——{desc}",
      triggers: { minDay: 80, interval: 180, maxRepeats: 3, excludeFlags: ["_g503CorpSeasonCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._g503CorpSeasonCooldown);
      },
      choices: [
        { text: "🍂 总结经验", hint: "管理XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g503CorpSeasonCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍂 '公司也有春夏秋冬，春天播种，夏天生长，秋天收获，冬天蓄力。' 管理XP+5,心智+2。", "success");
        }},
        { text: "📈 规划明年", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g503CorpSeasonCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍂 '冬天来了，春天还会远吗？' 你在冬天开始规划春天的事。管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你回顾公司的发展历程，发现它也有四季——创业期是春天，成长期是夏天，成熟期是秋天，转型期是冬天。";
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