/**
 * 域H(Phase2/公司) 联动增强 R481（第六轮循环·续）
 * 桥接：
 *   H→F  h481_corp_transparency   公司透明度UI → 消费 corporate 数据,
 *     职场→"公司运营状况"的UI展示
 *   H→H  h481_corp_evolution       公司演化 → 消费 corporate 数据,
 *     公司→"从创业到企业"的自叙事
 *   h481_team_culture(H→C 团队文化v2): team→"团队氛围怎么样"的职业成长
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR481Loaded) return;
  RANDOM_EVENTS._domainHLinkageR481Loaded = true;

  var EVENTS = [
    {
      id: "h481_corp_transparency", phase: "corporate", _isChainEvent: false, icon: "🔍",
      title: "公司透明度",
      story: "你向团队公开了公司的运营数据——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_h481TransparencyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        if (!st.corporate.team || st.corporate.team.length < 2) return false;
        return (st.flags && !st.flags._h481TransparencyCooldown);
      },
      choices: [
        { text: "📊 全面公开", hint: "团队忠诚+10,人缘+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h481TransparencyCooldown = true;
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 10); } }
          if (st.player && st.player.corporate) st.player.corporate.popularity = Math.min(100, (st.player.corporate.popularity || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你全面公开了公司数据——'透明建立信任。' 团队忠诚+10,人缘+5。", "success");
        }},
        { text: "🔒 选择性公开", hint: "心智+3,KPI+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h481TransparencyCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.player && st.player.corporate) st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔒 你选择性地公开了数据——'信息需要过滤。' 心智+3,KPI+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = st.corporate && st.corporate.team ? st.corporate.team.length : 0;
        return "你向" + n + "个团队成员公开了公司的运营数据——透明度是团队信任的基石。";
      }
    },
    {
      id: "h481_corp_evolution", phase: "corporate", _isChainEvent: false, icon: "🦋",
      title: "公司演化",
      story: "你回顾了公司从创业到现在的历程——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_h481EvolutionCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.player && st.player.corpYear >= 3) && (st.flags && !st.flags._h481EvolutionCooldown);
      },
      choices: [
        { text: "📖 记录公司史", hint: "心智+5,管理XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h481EvolutionCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你记录了公司史——'历史是最好的老师。' 心智+5,管理XP+4。", "success");
        }},
        { text: "🚀 规划未来", hint: "智力+3,KPI+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h481EvolutionCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (st.player && st.player.corporate) st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 50) + 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 你规划了公司未来——'看到过去，才能看到未来。' 智力+3,KPI+10。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var year = st.player && st.player.corpYear ? st.player.corpYear : 3;
        return "公司已经走到第" + year + "年了——从最初的几个人到现在，公司经历了怎样的演化？";
      }
    },
    {
      id: "h481_team_culture", phase: "corporate", _isChainEvent: false, icon: "🎭",
      title: "团队氛围",
      story: "你关注了一下团队的氛围——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 3, excludeFlags: ["_h481CultureCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        if (!st.corporate.team || st.corporate.team.length < 2) return false;
        return (st.flags && !st.flags._h481CultureCooldown);
      },
      choices: [
        { text: "🎉 组织团建", hint: "团队忠诚+10,心情+5,现金-1000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h481CultureCooldown = true;
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 10); } }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎉 你组织了一次团建——'团队凝聚力需要经营。' 团队忠诚+10,心情+5,现金-1000。", "success");
        }},
        { text: "💬 一对一沟通", hint: "团队忠诚+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h481CultureCooldown = true;
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 5); } }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💬 你进行了一对一沟通——'倾听是最好的管理。' 团队忠诚+5,心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = st.corporate && st.corporate.team ? st.corporate.team.length : 0;
        return "你关注了一下" + n + "个人的团队氛围——团队文化不是口号，是每天的选择。";
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
