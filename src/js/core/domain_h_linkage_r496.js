/**
 * 域H(Phase2/公司) 联动增强 R496
 * 桥接：
 *   H→E  h496_corp_equity_plan    公司股权激励 → 消费 corporate+team 数据,
 *     股权→"用股权留住人才"的激励叙事
 *   H→C  h496_corp_skill_school   公司技能学校 → 消费 corporate+skills 数据,
 *     培训→"公司是最好的学校"的成长叙事
 *   H→D  h496_corp_industry_party 公司行业派对 → 消费 corporate+relationships 数据,
 *     社交→"行业聚会上的那些事"的商务社交
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR496Loaded) return;
  RANDOM_EVENTS._domainHLinkageR496Loaded = true;

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
      id: "h496_corp_equity_plan", phase: "corporate", _isChainEvent: false, icon: "📜",
      title: "股权激励",
      story: "你决定给核心团队分配股权——{desc}",
      triggers: { minDay: 60, interval: 180, maxRepeats: 3, excludeFlags: ["_h496EquityPlanCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.team || st.corporate.team.length < 2) return false;
        return (st.flags && !st.flags._h496EquityPlanCooldown);
      },
      choices: [
        { text: "📜 分配股权", hint: "管理XP+5,团队忠诚+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h496EquityPlanCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 5); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📜 你给核心团队分配了股权——'从今天起，你们不只是员工，更是合伙人。' 管理XP+5,团队忠诚+5。", "success");
        }},
        { text: "💰 发奖金", hint: "管理XP+3,团队忠诚+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h496EquityPlanCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 2); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📜 你给团队发了丰厚的奖金——'年底了，大家辛苦了！' 管理XP+3,团队忠诚+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你决定给核心团队分配股权——'公司不是我一个人的，是大家的。' 股权，是最好的绑定。";
      }
    },
    {
      id: "h496_corp_skill_school", phase: "corporate", _isChainEvent: false, icon: "📚",
      title: "公司大学",
      story: "你在公司内部建立了培训体系——{desc}",
      triggers: { minDay: 50, interval: 180, maxRepeats: 3, excludeFlags: ["_h496SkillSchoolCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h496SkillSchoolCooldown);
      },
      choices: [
        { text: "📚 定期培训", hint: "管理XP+5,全技能XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h496SkillSchoolCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          var skills = ["accounting", "management", "social", "coding", "sales"]; // [全系统自洽修复] 域B R572 修复:marketing/technology/trade非真实技能键(addSkillXp静默丢弃XP)→映射social/coding/sales
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 2); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 你建立了公司内部培训体系——'最好的公司，是一所大学。' 管理XP+5,全技能XP+2。", "success");
        }},
        { text: "👥 导师制", hint: "管理XP+3,社交XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h496SkillSchoolCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 你推行了导师制——'老带新，传帮带。' 管理XP+3,社交XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你在公司内部建立了培训体系——'员工成长了，公司才能成长。' 最好的投资，是投资员工的未来。";
      }
    },
    {
      id: "h496_corp_industry_party", phase: "corporate", _isChainEvent: false, icon: "🎉",
      title: "行业酒会",
      story: "你参加了一场行业酒会——{desc}",
      triggers: { minDay: 45, interval: 120, maxRepeats: 3, excludeFlags: ["_h496IndustryPartyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._h496IndustryPartyCooldown);
      },
      choices: [
        { text: "🎉 多认识人", hint: "社交XP+5,公司知名度+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h496IndustryPartyCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 3);
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "行业酒会上认识");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎉 你在酒会上如鱼得水——'这是我的名片，多多关照。' 社交XP+5,公司知名度+3,好感+2。", "success");
        }},
        { text: "🥂 跟老朋友叙旧", hint: "好感+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h496IndustryPartyCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "酒会叙旧");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎉 你端着酒杯找到了老朋友——'好久不见！最近怎么样？' 好感+3,心情+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你参加了一场行业酒会——衣香鬓影，觥筹交错。每个人都在寻找机会，而你，在寻找对的人。";
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