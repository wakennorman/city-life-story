/**
 * 域H(Phase2/公司) 联动增强 R648
 * 桥接：
 *   H→A  h648_corp_kpi_dashboard  KPI仪表盘 → 消费 state.startup 数据,
 *    公司→"数据驱动管理"数据回响
 *   H→D  h648_team_bonding  团队凝聚力 → 消费 state.startup+state.relationships 数据,
 *    公司→"团队就是家人"社交回响
 *   H→G  h648_founder_reflection  创始人反思 → 消费 state.startup+state.player 数据,
 *    公司→"创业路上的人生感悟"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR648Loaded) return;
  RANDOM_EVENTS._domainHLinkageR648Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR648(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "h648_corp_kpi_dashboard", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "KPI仪表盘",
      story: "你开始用KPI仪表盘来管理公司的核心指标——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 1, excludeFlags: ["_h648KpiDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h648KpiDone) return false;
        return st.startup && st.startup.company && (st.startup.company.employees || 0) >= 3;
      },
      choices: [
        { text: "📈 数据驱动", hint: "管理XP+5,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h648KpiDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '数据驱动管理,管理产生效率。' 你建立了KPI仪表盘。管理XP+5,智力+3。", "success");
        }},
        { text: "🎯 目标导向", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h648KpiDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '目标是方向,数据是罗盘。' 你设定了公司目标。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var empCount = (st.startup && st.startup.company && st.startup.company.employees) || 0;
        return "你开始用KPI仪表盘来管理公司的核心指标——" + empCount + "名员工,需要统一的目标和衡量标准。'数据驱动管理,管理产生效率。'";
      }
    },
    {
      id: "h648_team_bonding", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "团队就是家人",
      story: "公司的团队,慢慢变成了一个大家庭——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 2, excludeFlags: ["_h648BondCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h648BondCooldown) return false;
        var met = metNpcsR648(st);
        return met.length >= 1;
      },
      choices: [
        { text: "🍻 团建聚餐", hint: "好感+5,心情+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h648BondCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          var met = metNpcsR648(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "团建聚餐"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍻 '团队就是家人。' 你组织了团建聚餐。好感+5,心情+4。", "success");
        }},
        { text: "💼 专业管理", hint: "管理XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h648BondCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '专业管理,才能持久。' 你选择了专业管理。管理XP+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var empCount = (st.startup && st.startup.company && st.startup.company.employees) || 0;
        return "公司的团队,慢慢变成了一个大家庭——" + empCount + "名员工,一起奋斗,一起成长。'团队就是家人。'";
      }
    },
    {
      id: "h648_founder_reflection", phase: "corporate", _isChainEvent: false, icon: "🧘",
      title: "创业路上的人生感悟",
      story: "创业路上,你开始思考人生的意义——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 1, excludeFlags: ["_h648ReflectDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h648ReflectDone) return false;
        return st.startup && st.startup.company && (st.startup.company.valuation || 0) >= 200000;
      },
      choices: [
        { text: "📖 写创业笔记", hint: "智力+5,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h648ReflectDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把创业路上的感悟写下来。' 你写下了创业笔记。智力+5,心智+5。", "success");
        }},
        { text: "🚀 继续前行", hint: "心智+8,置_h648KeepGoing", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h648ReflectDone = true;
          st.flags._h648KeepGoing = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '创业路上,不断前行。' 你选择了继续前行。心智+8。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var val = (st.startup && st.startup.company && st.startup.company.valuation) || 0;
        return "创业路上,你开始思考人生的意义——公司估值¥" + val + "。'创业不仅是赚钱,更是一段人生旅程。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
