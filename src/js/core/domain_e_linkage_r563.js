/**
 * 域E(经济/投资) 联动增强 R563
 * 桥接：
 *   E→F  e563_invest_risk_ui    投资风险UI → 消费 investment 数据,
 *     风险→"投资风险可视化"的UI展示
 *   E→D  e563_invest_team_trust 投资团队信任 → 消费 investment+relationships 数据,
 *     团队→"和团队一起投资"的协作叙事
 *   E→G  e563_invest_lifestyle  投资生活方式 → 消费 investment+needs 数据,
 *     生活→"被动收入改变了生活方式"的财务自由
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR563Loaded) return;
  RANDOM_EVENTS._domainELinkageR563Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }
  function calcPortfolioValue(st) {
    if (!st || !st.investment || !st.investment.portfolio) return 0;
    var p = st.investment.portfolio, total = 0;
    if (p.stocks) { for (var s in p.stocks) { total += (p.stocks[s].shares || 0) * (p.stocks[s].avgPrice || 0); } }
    if (p.funds) { for (var f in p.funds) { total += (p.funds[f].shares || 0) * (p.funds[f].avgPrice || 0); } }
    return total;
  }

  var EVENTS = [
    {
      id: "e563_invest_risk_ui", phase: "corporate", _isChainEvent: false, icon: "⚠️",
      title: "风险可视化",
      story: "你查看了投资组合的风险评估——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_e563RiskUICooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._e563RiskUICooldown);
      },
      choices: [
        { text: "⚠️ 调整风险", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e563RiskUICooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ '风险评级显示当前组合风险偏高，建议减仓。' 会计XP+5,心智+2。", "success");
        }},
        { text: "📊 接受风险", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e563RiskUICooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ '高风险高回报，我能承受。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你查看了投资组合的风险评估——'高风险资产占比XX%，建议控制在XX%以内。' 风险可视化，让你更清楚自己的承受能力。";
      }
    },
    {
      id: "e563_invest_team_trust", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "投资团队",
      story: "你加入了一个投资团队——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_e563TeamTrustCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 30000 && (st.flags && !st.flags._e563TeamTrustCooldown);
      },
      choices: [
        { text: "🤝 团队协作", hint: "社交XP+5,会计XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e563TeamTrustCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "投资团队");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '团队里每个人都有自己的专长，一起投资效果更好。' 社交XP+5,会计XP+3,好感+2。", "success");
        }},
        { text: "📊 贡献分析", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e563TeamTrustCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '你用数据分析能力为团队提供了有价值的投资建议。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你加入了一个投资团队——'每个人负责不同的领域，一起分析、一起决策。' 团队投资，比单打独斗更有优势。";
      }
    },
    {
      id: "e563_invest_lifestyle", phase: "street", _isChainEvent: false, icon: "🏖️",
      title: "被动收入",
      story: "你的被动收入已经能覆盖日常开销了——{desc}",
      triggers: { minDay: 50, interval: 180, maxRepeats: 3, excludeFlags: ["_e563LifestyleCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 100000 && (st.flags && !st.flags._e563LifestyleCooldown);
      },
      choices: [
        { text: "🏖️ 享受自由", hint: "心情+5,健康+2,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e563LifestyleCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏖️ '被动收入覆盖了生活开销，我终于自由了！' 心情+5,健康+2,心智+2。", "success");
        }},
        { text: "💰 继续积累", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e563LifestyleCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏖️ '还不够，要继续积累，让被动收入更稳定。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var pv = Math.floor(calcPortfolioValue(st));
        return "你的被动收入已经能覆盖日常开销了——'¥" + pv.toLocaleString() + "的投资组合，每月产生的收益足够生活了。' 财务自由，不再是梦。";
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