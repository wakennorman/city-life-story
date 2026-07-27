/**
 * 域H(Phase2/公司) 联动增强 R581
 * 桥接：
 *   H→A  h581_corp_efficiency    公司运营效率 → 消费 corporate 数据,
 *     效率→"公司运营效率分析"的数据洞察
 *   H→D  h581_corp_team_spirit   公司团队精神 → 消费 corporate+team 数据,
 *     精神→"团队精神的力量"的凝聚力叙事
 *   H→F  h581_corp_office_mood   公司办公情绪 → 消费 corporate+needs 数据,
 *     情绪→"办公室的情绪管理"的氛围叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR581Loaded) return;
  RANDOM_EVENTS._domainHLinkageR581Loaded = true;

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
      id: "h581_corp_efficiency", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "运营效率",
      story: "你分析了公司的运营效率数据——{desc}",
      triggers: { minDay: 40, interval: 60, maxRepeats: 5, excludeFlags: ["_h581EfficiencyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h581EfficiencyCooldown);
      },
      choices: [
        { text: "📊 优化流程", hint: "管理XP+5,会计XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h581EfficiencyCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '运营效率提升了20%，成本下降了15%。' 管理XP+5,会计XP+3,心智+2。", "success");
        }},
        { text: "📈 看趋势", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h581EfficiencyCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '效率数据在稳步提升，方向对了。' 管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你分析了公司的运营效率数据——'人均产出、周转率、响应时间...' 数据告诉你，公司在往哪个方向走。";
      }
    },
    {
      id: "h581_corp_team_spirit", phase: "corporate", _isChainEvent: false, icon: "🔥",
      title: "团队精神",
      story: "团队在困难面前展现了惊人的凝聚力——{desc}",
      triggers: { minDay: 35, interval: 120, maxRepeats: 3, excludeFlags: ["_h581TeamSpiritCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.team || st.corporate.team.length < 2) return false;
        return (st.flags && !st.flags._h581TeamSpiritCooldown);
      },
      choices: [
        { text: "🔥 表扬团队", hint: "管理XP+5,团队忠诚+4,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h581TeamSpiritCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 4); } }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔥 '团队在困难面前没有退缩，我为你们骄傲！' 管理XP+5,团队忠诚+4,心情+2。", "success");
        }},
        { text: "🏆 设立奖励", hint: "管理XP+3,团队忠诚+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h581TeamSpiritCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 2); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔥 '给团队设立了特别奖励，大家士气高涨。' 管理XP+3,团队忠诚+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "团队在困难面前展现了惊人的凝聚力——'没有人抱怨，大家都在想办法。' 这样的团队，没有什么困难能难倒。";
      }
    },
    {
      id: "h581_corp_office_mood", phase: "corporate", _isChainEvent: false, icon: "😊",
      title: "办公室情绪",
      story: "你注意到办公室的氛围有些变化——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_h581OfficeMoodCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._h581OfficeMoodCooldown);
      },
      choices: [
        { text: "😊 改善氛围", hint: "管理XP+4,心情+2,团队忠诚+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h581OfficeMoodCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 2); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("😊 '办公室多了绿植和零食角，大家的笑容多了。' 管理XP+4,心情+2,团队忠诚+2。", "success");
        }},
        { text: "📋 调查满意度", hint: "管理XP+3,社交XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h581OfficeMoodCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("😊 '做了一次匿名满意度调查，了解大家的真实想法。' 管理XP+3,社交XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你注意到办公室的氛围有些变化——'最近大家好像有点沉闷，是不是压力太大了？' 办公室的情绪，直接影响工作效率。";
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