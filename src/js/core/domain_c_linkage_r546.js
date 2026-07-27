/**
 * 域C(职业/成长) 联动增强 R546
 * 桥接：
 *   C→D  c546_career_team_building 职业团队建设 → 消费 skills+relationships 数据,
 *     团建→"工作中的团队活动"的职业社交
 *   C→G  c546_career_work_anniversary 职业工作周年 → 消费 skills+player 数据,
 *     周年→"入职一周年纪念"的里程碑
 *   C→E  c546_career_freelance_income 职业自由职业收入 → 消费 skills+resources 数据,
 *     自由→"做自由职业能赚多少"的收入对比
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR546Loaded) return;
  RANDOM_EVENTS._domainCLinkageR546Loaded = true;

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
      id: "c546_career_team_building", phase: "corporate", _isChainEvent: false, icon: "🎳",
      title: "团队活动",
      story: "部门组织了一次团队建设活动——{desc}",
      triggers: { minDay: 25, interval: 90, maxRepeats: 3, excludeFlags: ["_c546TeamBuildingCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c546TeamBuildingCooldown);
      },
      choices: [
        { text: "🎳 积极参加", hint: "管理XP+4,社交XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c546TeamBuildingCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "团队活动");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎳 '团队活动让大家更了解彼此了。' 管理XP+4,社交XP+3,好感+2。", "success");
        }},
        { text: "📋 组织活动", hint: "管理XP+3,社交XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c546TeamBuildingCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎳 '你组织了这次活动，大家玩得很开心。' 管理XP+3,社交XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "部门组织了一次团队建设活动——'今天不聊工作，只聊感情！' 团队活动，是拉近同事关系的最好方式。";
      }
    },
    {
      id: "c546_career_work_anniversary", phase: "corporate", _isChainEvent: false, icon: "🎂",
      title: "入职周年",
      story: "今天是你入职X周年的日子——{desc}",
      triggers: { minDay: 30, interval: 365, maxRepeats: 2, excludeFlags: ["_c546WorkAnniversaryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c546WorkAnniversaryCooldown);
      },
      choices: [
        { text: "🎂 庆祝一下", hint: "管理XP+4,心智+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c546WorkAnniversaryCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎂 '入职一周年了，时间过得真快。' 管理XP+4,心智+2,心情+2。", "success");
        }},
        { text: "📝 写总结", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c546WorkAnniversaryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎂 '这一年，我学到了很多，成长了很多。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        return "今天是你入职" + Math.floor(day / 365) + "周年的日子——'从新人到老人，从生疏到熟练。' 时间是最好的老师。";
      }
    },
    {
      id: "c546_career_freelance_income", phase: "corporate", _isChainEvent: false, icon: "💼",
      title: "自由职业",
      story: "你在想如果做自由职业能赚多少——{desc}",
      triggers: { minDay: 35, interval: 120, maxRepeats: 3, excludeFlags: ["_c546FreelanceIncomeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._c546FreelanceIncomeCooldown);
      },
      choices: [
        { text: "💼 算笔账", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c546FreelanceIncomeCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '自由职业虽然自由，但收入不稳定，还要自己交社保。' 会计XP+5,心智+2。", "success");
        }},
        { text: "📈 试试水", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c546FreelanceIncomeCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '先接个小项目试试，看看自己能不能适应。' 管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你在想如果做自由职业能赚多少——'时间自由、地点自由，但收入也自由...' 自由职业，是天堂还是地狱？";
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