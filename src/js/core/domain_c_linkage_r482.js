/**
 * 域C(职业/成长) 联动增强 R482
 * 桥接：
 *   C→D  c482_career_friend_support 职业朋友支持 → 消费 skills+relationships 数据,
 *     职场压力→"朋友的理解是最好的安慰"的社交支持
 *   C→E  c482_career_side_income   职业副业收入 → 消费 skills+resources 数据,
 *     技能变现→"用技能赚外快"的副业经济
 *   C→A  c482_skill_market_worth   技能市场价值 → 消费 skills 数据,
 *     技能→"你的技能在市场上的真实价值"的数据分析
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR482Loaded) return;
  RANDOM_EVENTS._domainCLinkageR482Loaded = true;

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
      id: "c482_career_friend_support", phase: "street", _isChainEvent: false, icon: "🤗",
      title: "朋友的理解",
      story: "你跟朋友吐槽工作的压力——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_c482FriendSupportCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._c482FriendSupportCooldown);
      },
      choices: [
        { text: "🤗 倾诉烦恼", hint: "好感+3,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c482FriendSupportCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 3, "倾诉工作烦恼");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤗 你把工作的烦恼一股脑说了出来——朋友没有打断你，只是静静地听。'说出来就好多了。' 好感+3,心情+3。", "success");
        }},
        { text: "🍺 一起喝酒", hint: "好感+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c482FriendSupportCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "一起喝酒解压");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤗 你们找了家小酒馆——'什么都不说了，都在酒里。' 几杯下去，心情好多了。好感+2,心情+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你跟朋友吐槽工作的压力——'最近真的太累了...' 话还没说完，朋友就递过来一瓶啤酒。";
      }
    },
    {
      id: "c482_career_side_income", phase: "corporate", _isChainEvent: false, icon: "💡",
      title: "技能变现",
      story: "有人找你帮忙做个项目，愿意付钱——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_c482SideIncomeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._c482SideIncomeCooldown);
      },
      choices: [
        { text: "💡 接！", hint: "现金+2000,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c482SideIncomeCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 你接下了这个项目——'技能就是用来变现的。' 现金+¥2000,会计XP+2。", "success");
        }},
        { text: "📋 推荐给别人", hint: "社交XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c482SideIncomeCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "推荐了项目机会");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 你把这个机会推荐给了朋友——'我觉得TA更适合这个项目。' 社交XP+3,好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "有人找你帮忙做个项目，愿意付钱——'听说你在这方面很厉害，能帮个忙吗？' 你的技能，比你想象的更值钱。";
      }
    },
    {
      id: "c482_skill_market_worth", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "技能估值",
      story: "你算了一笔账——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_c482SkillWorthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._c482SkillWorthCooldown);
      },
      choices: [
        { text: "📊 算算技能值多少钱", hint: "会计XP+5,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c482SkillWorthCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你算了一笔账——'如果我把所有技能都变现，一年能赚...' 数字让你吃了一惊。会计XP+5,心智+1。", "success");
        }},
        { text: "📈 制定提升计划", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c482SkillWorthCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你制定了技能提升计划——'把最值钱的技能练到顶尖，其他的够用就行。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你算了一笔账——你的技能如果全部变现，值多少钱？答案可能比你想象的多。";
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