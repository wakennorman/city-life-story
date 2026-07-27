/**
 * 域F(UI/UX) 联动增强 R477（第二十六轮循环）
 * 桥接：
 *   F→A  f477_data_narrative_v2    数据叙事化v2 → 消费 stats 数据,
 *     数据→"你的数字在说什么"的经济面板
 *   F→H  f477_corp_健康度          公司健康度UI → 消费 corporate 数据,
 *     职场→"公司还好吗"的UI洞察
 *   f477_life_dashboard(F→G 人生仪表盘): stats→"你的人生数据"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR477Loaded) return;
  RANDOM_EVENTS._domainFLinkageR477Loaded = true;

  var EVENTS = [
    {
      id: "f477_data_narrative_v2", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据讲故事",
      story: "你的数据开始编织出故事——{desc}",
      triggers: { minDay: 40, interval: 60, maxRepeats: 5, excludeFlags: ["_f477DataNarrCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.resources) return false;
        return (st.flags && !st.flags._f477DataNarrCooldown);
      },
      choices: [
        { text: "📈 解读趋势", hint: "智力+2,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f477DataNarrCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你解读了数据趋势——'数字背后是人生。' 智力+2,会计XP+2。", "success");
        }},
        { text: "🎯 设定数据目标", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f477DataNarrCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你设定了数据目标——'有目标才有方向。' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var totalEarned = st.resources && st.resources.totalEarned ? st.resources.totalEarned : 0;
        return "你的数据开始编织出故事——累计赚取¥" + totalEarned.toLocaleString() + "。这些数字在说什么？";
      }
    },
    {
      id: "f477_corp_health", phase: "corporate", _isChainEvent: false, icon: "❤️",
      title: "公司健康度",
      story: "你查看了公司的健康度指标——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 3, excludeFlags: ["_f477CorpHealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._f477CorpHealthCooldown);
      },
      choices: [
        { text: "📊 数据诊断", hint: "管理XP+4,KPI+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f477CorpHealthCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.player && st.player.corporate) st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你用数据诊断公司健康——'预防胜于治疗。' 管理XP+4,KPI+5。", "success");
        }},
        { text: "👥 团队座谈", hint: "团队忠诚+8,人缘+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f477CorpHealthCooldown = true;
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 8); } }
          if (st.player && st.player.corporate) st.player.corporate.popularity = Math.min(100, (st.player.corporate.popularity || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 你召开了团队座谈——'听听一线的声音。' 团队忠诚+8,人缘+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var company = st.corporate && st.corporate.company;
        var name = company ? company.name : "公司";
        return "你查看了" + name + "的健康度指标——公司还好吗？数字会告诉你答案。";
      }
    },
    {
      id: "f477_life_dashboard", phase: "street", _isChainEvent: false, icon: "📋",
      title: "人生仪表盘",
      story: "你查看了自己的人生数据——{desc}",
      triggers: { minDay: 50, interval: 80, maxRepeats: 4, excludeFlags: ["_f477LifeDashCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.player) return false;
        return (st.flags && !st.flags._f477LifeDashCooldown);
      },
      choices: [
        { text: "📊 全面分析", hint: "智力+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f477LifeDashCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你全面分析了人生数据——'知己知彼，百战不殆。' 智力+3,心智+2。", "success");
        }},
        { text: "🎯 聚焦成长", hint: "全技能XP+1,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f477LifeDashCooldown = true;
          var skills = ["accounting", "management", "sales", "coding", "social"]; // [全系统自洽修复] 域E R588 修复:trade非真实技能键(addSkillXp静默丢弃XP)→映射social
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 1); } catch(e) {} } }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你聚焦于成长——'每天进步一点点。' 全技能XP+1,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        return "你查看了自己的人生数据——已经走过了" + days + "天。这些数据就是你的人生故事。";
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
