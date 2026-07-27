/**
 * 域E(经济/投资) 联动增强 R501
 * 桥接：
 *   E→D  e501_invest_team_trust  投资团队信任 → 消费 investment+relationships 数据,
 *     理财→"朋友帮我理财"的信任叙事
 *   E→B  e501_economic_trend_story 经济趋势故事 → 消费 investment 数据,
 *     市场→"经济周期中的赢家和输家"的叙事
 *   E→C  e501_invest_career_shift 投资职业转变 → 消费 investment+skills 数据,
 *     财务自由→"钱够了就去做喜欢的事"的职业转变
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR501Loaded) return;
  RANDOM_EVENTS._domainELinkageR501Loaded = true;

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
      id: "e501_invest_team_trust", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "帮朋友理财",
      story: "朋友想让你帮忙打理闲钱——{desc}",
      triggers: { minDay: 35, interval: 90, maxRepeats: 3, excludeFlags: ["_e501TeamTrustCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 20000 && (st.flags && !st.flags._e501TeamTrustCooldown);
      },
      choices: [
        { text: "🤝 帮忙打理", hint: "社交XP+5,好感+3,会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e501TeamTrustCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "帮忙理财");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '你帮我理理财，赚了分你一半！' 朋友的信任，是最好的认可。社交XP+5,好感+3,会计XP+3。", "success");
        }},
        { text: "📚 教TA理财", hint: "社交XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e501TeamTrustCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "教理财知识");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '授人以鱼不如授人以渔，我教你理财吧。' 社交XP+3,好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友想让你帮忙打理闲钱——'听说你投资挺厉害的，帮我看看呗？' 被人信任的感觉，还不错。";
      }
    },
    {
      id: "e501_economic_trend_story", phase: "street", _isChainEvent: false, icon: "📈",
      title: "经济周期",
      story: "你观察到经济好像进入了一个新阶段——{desc}",
      triggers: { minDay: 40, interval: 120, maxRepeats: 3, excludeFlags: ["_e501TrendStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._e501TrendStoryCooldown);
      },
      choices: [
        { text: "📈 调整投资策略", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e501TrendStoryCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '经济周期不同阶段，投资策略也要不同。' 你调整了投资组合。会计XP+5,心智+2。", "success");
        }},
        { text: "📝 观察学习", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e501TrendStoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '每个经济周期都是一次学习机会。' 你决定先观察再行动。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你观察到经济好像进入了一个新阶段——'利息在降，物价在涨，这是要进入什么周期了？'";
      }
    },
    {
      id: "e501_invest_career_shift", phase: "corporate", _isChainEvent: false, icon: "🎯",
      title: "财务自由后",
      story: "你的投资收益已经能覆盖基本生活了——{desc}",
      triggers: { minDay: 60, interval: 180, maxRepeats: 3, excludeFlags: ["_e501CareerShiftCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 100000 && (st.flags && !st.flags._e501CareerShiftCooldown);
      },
      choices: [
        { text: "🎯 做喜欢的事", hint: "管理XP+5,心情+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e501CareerShiftCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '钱够花了，是时候去做真正想做的事了。' 你感觉前所未有的自由。管理XP+5,心情+4,心智+2。", "success");
        }},
        { text: "💰 继续积累", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e501CareerShiftCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '还不够，再积累一些，等更安全了再说。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var pv = Math.floor(calcPortfolioValue(st));
        return "你的投资收益已经能覆盖基本生活了——'¥" + pv.toLocaleString() + "，够了。' 财务自由的门槛，其实没你想的那么高。";
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