/**
 * 域C(职业/成长) 联动增强 R517
 * 桥接：
 *   C→H  c517_career_equity_plan 职业股权计划 → 消费 skills+corporate 数据,
 *     股权→"用技能换股权"的合伙人路径
 *   C→E  c517_career_salary_invest 职业薪资投资 → 消费 skills+resources 数据,
 *     工资→"把工资的一部分拿来投资"的理财习惯
 *   C→A  c517_career_tax_plan    职业税务规划 → 消费 skills+resources 数据,
 *     税务→"工资越高，税越多"的税务规划
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR517Loaded) return;
  RANDOM_EVENTS._domainCLinkageR517Loaded = true;

  var EVENTS = [
    {
      id: "c517_career_equity_plan", phase: "corporate", _isChainEvent: false, icon: "📜",
      title: "技术入股",
      story: "公司想用股权换你的技术——{desc}",
      triggers: { minDay: 45, interval: 180, maxRepeats: 3, excludeFlags: ["_c517EquityPlanCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._c517EquityPlanCooldown);
      },
      choices: [
        { text: "📜 接受股权", hint: "管理XP+5,心智+2,公司知名度+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c517EquityPlanCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📜 '技术换股权，这是最好的合作方式。' 你成了公司的合伙人之一。管理XP+5,心智+2,公司知名度+2。", "success");
        }},
        { text: "💰 要现金", hint: "现金+8000,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c517EquityPlanCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 8000;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📜 '现金更实在，风险更小。' 现金+¥8000,会计XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司想用股权换你的技术——'你的技术值这个价，我们想用股权绑住你。' 你陷入了沉思。";
      }
    },
    {
      id: "c517_career_salary_invest", phase: "corporate", _isChainEvent: false, icon: "💰",
      title: "工资投资计划",
      story: "你决定每个月从工资里拿一部分出来投资——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_c517SalaryInvestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c517SalaryInvestCooldown);
      },
      choices: [
        { text: "💰 定投基金", hint: "会计XP+5,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c517SalaryInvestCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '每个月工资到账，先转20%去投资账户。' 强制储蓄+投资，是最好的理财习惯。会计XP+5,心智+1。", "success");
        }},
        { text: "📈 学习投资知识", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c517SalaryInvestCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '先学再投，不盲目。' 你买了几本投资书籍。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你决定每个月从工资里拿一部分出来投资——'工资是收入，投资是第二收入。'";
      }
    },
    {
      id: "c517_career_tax_plan", phase: "corporate", _isChainEvent: false, icon: "🧾",
      title: "个税规划",
      story: "你发现工资越高，税扣得越多——{desc}",
      triggers: { minDay: 35, interval: 180, maxRepeats: 3, excludeFlags: ["_c517TaxPlanCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c517TaxPlanCooldown);
      },
      choices: [
        { text: "🧾 合理避税", hint: "会计XP+5,心智+2,现金+2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c517TaxPlanCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧾 '合理避税和偷税漏税是两回事。' 你优化了税务结构。会计XP+5,心智+2,现金+¥2000。", "success");
        }},
        { text: "📋 找会计师", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c517TaxPlanCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧾 '专业的事交给专业的人。' 你找了会计师帮忙规划。会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现工资越高，税扣得越多——'到手工资比预期少了一大截。' 是时候认真考虑税务规划了。";
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