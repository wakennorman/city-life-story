/**
 * 域H(Phase2/公司) 联动增强 R467（第五轮循环）
 * 桥接：
 *   H→F  h467_corp_dashboard_v2   公司仪表盘v2 → 消费 corporate 数据,
 *     职场阶段→"一屏看公司"的UI升级
 *   H→C  h467_leadership_v6        领导力成长v6 → 消费 corporate+skills 数据,
 *     管理实践→"从做事到带人"的职业成长
 *   h467_corp_self_reflection(H→H 公司自我反思): corporate→"公司走到哪了"的内省
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR467Loaded) return;
  RANDOM_EVENTS._domainHLinkageR467Loaded = true;

  var EVENTS = [
    {
      id: "h467_corp_dashboard_v2", phase: "corporate", _isChainEvent: false, icon: "🖥️",
      title: "经营看板",
      story: "你设计了公司的经营看板——{desc}",
      triggers: { minDay: 90, interval: 120, maxRepeats: 3, excludeFlags: ["_h467DashCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h467DashCooldown);
      },
      choices: [
        { text: "📊 KPI优先", hint: "管理XP+4,KPI+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h467DashCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.player && st.player.corporate) st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你设计了KPI优先的看板——'没有衡量就没有管理。' 管理XP+4,KPI+5。", "success");
        }},
        { text: "👥 团队优先", hint: "团队忠诚+8,人缘+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h467DashCooldown = true;
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 8); } }
          if (st.player && st.player.corporate) st.player.corporate.popularity = Math.min(100, (st.player.corporate.popularity || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 你设计了团队优先的看板——'人是最重要的资产。' 团队忠诚+8,人缘+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var company = st.corporate && st.corporate.company;
        var name = company ? company.name : "公司";
        return "你设计了" + name + "的经营看板——哪些数据放在最显眼的位置，决定了团队关注什么。";
      }
    },
    {
      id: "h467_leadership_v6", phase: "corporate", _isChainEvent: false, icon: "👔",
      title: "带队心得",
      story: "你在管理团队的过程中，有了一些新的领悟——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_h467LeaderCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        if (!st.corporate.team || st.corporate.team.length < 2) return false;
        return (st.flags && !st.flags._h467LeaderCooldown);
      },
      choices: [
        { text: "🎯 目标导向", hint: "管理XP+5,KPI+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h467LeaderCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player && st.player.corporate) st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你领悟了目标导向的管理——'上下同欲者胜。' 管理XP+5,KPI+8。", "success");
        }},
        { text: "❤️ 赋能团队", hint: "团队忠诚+10,能力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h467LeaderCooldown = true;
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 10); } }
          if (st.player && st.player.corporate) st.player.corporate.ability = Math.min(100, (st.player.corporate.ability || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("❤️ 你领悟了赋能团队的管理——'最好的领导让团队成长。' 团队忠诚+10,能力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = st.corporate && st.corporate.team ? st.corporate.team.length : 0;
        return "你在管理" + n + "个人的过程中，有了一些新的领悟——从'自己干'到'带人干'，是职场最重要的跃迁。";
      }
    },
    {
      id: "h467_corp_self_reflection", phase: "corporate", _isChainEvent: false, icon: "🪞",
      title: "公司走到哪了",
      story: "你回顾了公司的发展历程——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 2, excludeFlags: ["_h467ReflectCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.player && st.player.corpYear >= 2) && (st.flags && !st.flags._h467ReflectCooldown);
      },
      choices: [
        { text: "📖 写下复盘", hint: "心智+4,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h467ReflectCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你写下了公司复盘——'复盘是最好的学习。' 心智+4,管理XP+3。", "success");
        }},
        { text: "🚀 继续前进", hint: "KPI+10,疲劳+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h467ReflectCooldown = true;
          if (st.player && st.player.corporate) st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 50) + 10);
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 你选择继续前进——'不要停下来。' KPI+10,疲劳+5。", "info");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var year = st.player && st.player.corpYear ? st.player.corpYear : 2;
        return "公司已经走到第" + year + "年了——从最初的几个人到现在，你开始思考：这家公司要去向何方？";
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
