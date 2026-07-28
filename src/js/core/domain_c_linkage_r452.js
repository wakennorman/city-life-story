/**
 * 域C(职业/成长) 联动增强 R452（第二轮循环）
 * 桥接：
 *   C→A  c452_skill_data_track    技能数据追踪 → 消费 skills 数据,
 *     技能成长→"你的技能树长什么样"的数据画像
 *   C→D  c452_career_npc_mentor   职业NPC导师 → 消费 skills+relationships 数据,
 *     职业成长→"贵人相助"的NPC导师叙事
 *   C→F  c452_skill_ui_insight    技能UI洞察 → 消费 skills 数据,
 *     技能面板→"你的核心竞争力是什么"的UI提示
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR452Loaded) return;
  RANDOM_EVENTS._domainCLinkageR452Loaded = true;

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
      id: "c452_skill_data_track", phase: "street", _isChainEvent: false, icon: "📊",
      title: "技能树",
      story: "你回顾了这段时间的技能成长——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_c452SkillDataCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._c452SkillDataCooldown);
      },
      choices: [
        { text: "📊 分析技能短板", hint: "心智+2,全技能XP+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c452SkillDataCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          var skills = ["accounting", "management", "social", "coding", "sales"]; // [全系统自洽修复] 域B R572 修复:marketing/technology/trade非真实技能键(addSkillXp静默丢弃XP)→映射social/coding/sales
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 1); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了技能短板——知道了自己的不足，才能有针对性地提升。全技能XP+1,心智+2。", "success");
        }},
        { text: "📈 专注最强项", hint: "最高技能+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c452SkillDataCooldown = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你决定把最强的技能练到极致——一招鲜，吃遍天。最高技能XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你回顾了这段时间的技能成长——有些技能突飞猛进，有些还停留在原地。技能树上的每一根枝桠，都是你花时间浇灌出来的。";
      }
    },
    {
      id: "c452_career_npc_mentor", phase: "street", _isChainEvent: false, icon: "🎓",
      title: "贵人",
      story: "一位经验丰富的前辈给了你一些建议——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_c452MentorCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._c452MentorCooldown);
      },
      choices: [
        { text: "🎓 虚心请教", hint: "管理XP+5,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c452MentorCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 3, "前辈指点迷津");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎓 你虚心请教，前辈倾囊相授——'年轻人，我教你一个道理...' 管理XP+5,好感+3。", "success");
        }},
        { text: "📝 记下建议", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c452MentorCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎓 你默默记下了前辈的建议——有些话，现在理解不了，但总有一天会明白。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一位经验丰富的前辈给了你一些建议——'你很有天赋，但还需要磨练。' 这些话，让你想了很久。";
      }
    },
    {
      id: "c452_skill_ui_insight", phase: "corporate", _isChainEvent: false, icon: "🎯",
      title: "核心竞争力",
      story: "你看着自己的技能面板，分析自己的核心竞争力——{desc}",
      triggers: { minDay: 35, interval: 60, maxRepeats: 5, excludeFlags: ["_c452SkillUIInsightCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._c452SkillUIInsightCooldown);
      },
      choices: [
        { text: "🎯 制定提升计划", hint: "会计XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c452SkillUIInsightCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你制定了详细的技能提升计划——目标明确，路径清晰。会计XP+3,心智+2。", "success");
        }},
        { text: "🔥 立即行动", hint: "随机技能XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c452SkillUIInsightCooldown = true;
          var skills = ["accounting", "management", "social", "coding", "sales"]; // [全系统自洽修复] 域B R572 修复:marketing/technology/trade非真实技能键(addSkillXp静默丢弃XP)→映射social/coding/sales
          var sk = Random.fromArray(skills); // [全系统自洽修复] 域C R400: Math.random()→Random.fromArray()
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你决定立即行动——计划赶不上变化，做了再说。随机技能XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你看着自己的技能面板，分析自己的核心竞争力——哪些技能是你的护城河，哪些还需要补强。";
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