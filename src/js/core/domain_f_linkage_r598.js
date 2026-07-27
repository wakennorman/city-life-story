/**
 * 域F(UI/UX) 联动增强 R598
 * 桥接：
 *   F→G  f598_ui_life_dashboard   UI人生仪表盘 → 消费 player+needs 数据,
 *     UI→"数据可视化人生"的生命回响
 *   F→C  f598_ui_career_portfolio  UI职业作品集 → 消费 skills+jobs 数据,
 *     UI→"技能可视化展示"的职业回响
 *   F→E  f598_ui_finance_overview   UI财务概览 → 消费 resources 数据,
 *     UI→"财务清晰可视化"的经济回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR598Loaded) return;
  RANDOM_EVENTS._domainFLinkageR598Loaded = true;

  var EVENTS = [
    {
      id: "f598_ui_life_dashboard", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据可视化人生",
      story: "看着仪表盘上的数据，你开始思考——{desc}",
      triggers: { minDay: 50, interval: 100, maxRepeats: 3, excludeFlags: ["_f598LifeDashCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f598LifeDashCooldown) return false;
        return st.player && st.player.day >= 30;
      },
      choices: [
        { text: "📈 追踪进度", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f598LifeDashCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据让进步可见。' 你开始追踪人生进度。心智+2。", "success");
        }},
        { text: "🎯 设定目标", hint: "智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f598LifeDashCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '有目标才有方向。' 你设定了人生目标。智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "看着仪表盘上的数据，你开始思考——'数据让人生更清晰。' 你开始思考如何可视化自己的人生。";
      }
    },
    {
      id: "f598_ui_career_portfolio", phase: "corporate", _isChainEvent: false, icon: "💼",
      title: "技能可视化展示",
      story: "你开始整理自己的技能作品集——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 3, excludeFlags: ["_f598CareerPortCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f598CareerPortCooldown) return false;
        var hasSkill = false;
        if (st.skills) {
          for (var k in st.skills) {
            if (st.skills[k] && (st.skills[k].level || 0) >= 15) { hasSkill = true; break; }
          }
        }
        return hasSkill;
      },
      choices: [
        { text: "📝 整理作品", hint: "管理XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f598CareerPortCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '技能需要被看见。' 你整理了技能作品集。管理XP+5。", "success");
        }},
        { text: "🎓 继续学习", hint: "随机技能XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f598CareerPortCooldown = true;
          var skills = ["coding", "sales", "accounting", "management", "cooking", "repair"];
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '学无止境。' " + sk + "XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始整理自己的技能作品集——'技能需要被展示。' 你开始思考如何让自己的技能更有价值。";
      }
    },
    {
      id: "f598_ui_finance_overview", phase: "street", _isChainEvent: false, icon: "💰",
      title: "财务清晰可视化",
      story: "看着财务报表，你开始规划——{desc}",
      triggers: { minDay: 30, interval: 80, maxRepeats: 3, excludeFlags: ["_f598FinanceOverCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f598FinanceOverCooldown) return false;
        return st.resources && (st.resources.cash || 0) >= 1000;
      },
      choices: [
        { text: "📊 分析收支", hint: "会计XP+3,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f598FinanceOverCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '收支要清楚。' 你分析了财务状况。会计XP+3,智力+2。", "success");
        }},
        { text: "🎯 设定预算", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f598FinanceOverCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '预算让花钱更理性。' 你设定了预算。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "看着财务报表，你开始规划——'钱要花在刀刃上。' 你开始思考如何管理财务。";
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
