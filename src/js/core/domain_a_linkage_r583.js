/**
 * 域A(数据/数值平衡) 联动增强 R583
 * 桥接：
 *   A→D  a583_npc_shopping_list  NPC购物清单 → 消费 goods 数据,
 *     购物→"帮朋友带东西"的社交购物
 *   A→G  a583_data_health_check 数据健康检查 → 消费 goods 数据,
 *     健康→"用数据检查健康"的健康分析
 *   A→C  a583_skill_gap_analysis 技能差距分析 → 消费 skills 数据,
 *     差距→"你的技能差距分析"的职业规划
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR583Loaded) return;
  RANDOM_EVENTS._domainALinkageR583Loaded = true;

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
      id: "a583_npc_shopping_list", phase: "street", _isChainEvent: false, icon: "🛍️",
      title: "帮带东西",
      story: "朋友让你帮忙带点东西——{desc}",
      triggers: { minDay: 10, interval: 30, maxRepeats: 5, excludeFlags: ["_a583ShoppingListCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a583ShoppingListCooldown);
      },
      choices: [
        { text: "🛍️ 帮忙带", hint: "好感+2,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a583ShoppingListCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "帮带东西");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛍️ '顺路的事，客气啥！' 好感+2,心情+1。", "success");
        }},
        { text: "📋 列清单", hint: "会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a583ShoppingListCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛍️ '列个清单，一次性买齐，省时省力。' 会计XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友让你帮忙带点东西——'帮我带瓶酱油回来，顺便买点菜。' 邻里之间，互相帮忙是常事。";
      }
    },
    {
      id: "a583_data_health_check", phase: "street", _isChainEvent: false, icon: "📋",
      title: "健康数据分析",
      story: "你用数据分析了近期的健康状况——{desc}",
      triggers: { minDay: 20, interval: 45, maxRepeats: 5, excludeFlags: ["_a583HealthCheckCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a583HealthCheckCooldown);
      },
      choices: [
        { text: "📋 改善健康", hint: "健康+2,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a583HealthCheckCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 '数据显示你最近睡眠不足，建议早睡早起。' 健康+2,心智+1。", "success");
        }},
        { text: "📊 记录数据", hint: "会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a583HealthCheckCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 '记录健康数据，才能更好地了解自己的身体。' 会计XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你用数据分析了近期的健康状况——'平均睡眠6小时，运动频率每周1次，饮食质量中等。' 数据告诉你，健康需要改善。";
      }
    },
    {
      id: "a583_skill_gap_analysis", phase: "corporate", _isChainEvent: false, icon: "🎯",
      title: "技能差距",
      story: "你分析了目标岗位的技能要求，发现了差距——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_a583SkillGapCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a583SkillGapCooldown);
      },
      choices: [
        { text: "🎯 制定学习计划", hint: "管理XP+4,心智+2,全技能XP+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a583SkillGapCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          var skills = ["accounting", "management", "social", "coding", "sales"]; // [全系统自洽修复] 域E R588 修复:marketing/technology/trade非真实技能键(addSkillXp静默丢弃XP)→映射social/coding/sales
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 1); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '差距就是提升空间，制定计划，一步步赶上。' 管理XP+4,心智+2,全技能XP+1。", "success");
        }},
        { text: "📈 专注优势", hint: "随机技能XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a583SkillGapCooldown = true;
          var skills = ["accounting", "management", "social", "coding", "sales"]; // [全系统自洽修复] 域E R588 修复:marketing/technology/trade非真实技能键(addSkillXp静默丢弃XP)→映射social/coding/sales
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '发挥优势，比弥补短板更容易出成绩。' 随机技能XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你分析了目标岗位的技能要求，发现了差距——'目标岗位需要XX技能，我还有差距。' 知道差距，才能有针对性地提升。";
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