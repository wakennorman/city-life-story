/**
 * 域E(经济/投资) 联动增强 R578
 * 桥接：
 *   E→G  e578_invest_retire_plan 投资退休计划 → 消费 investment+player 数据,
 *     退休→"提前退休计划"的财务自由
 *   E→D  e578_invest_friend_trust 投资朋友信任 → 消费 investment+relationships 数据,
 *     信任→"朋友之间的投资信任"的合伙叙事
 *   E→B  e578_economic_cycle_story 经济周期故事 → 消费 investment 数据,
 *     周期→"经济周期中的投资机会"的市场叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR578Loaded) return;
  RANDOM_EVENTS._domainELinkageR578Loaded = true;

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
      id: "e578_invest_retire_plan", phase: "corporate", _isChainEvent: false, icon: "🏖️",
      title: "提前退休",
      story: "你算了一笔账，发现可以提前退休了——{desc}",
      triggers: { minDay: 50, interval: 180, maxRepeats: 3, excludeFlags: ["_e578RetirePlanCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 100000 && (st.flags && !st.flags._e578RetirePlanCooldown);
      },
      choices: [
        { text: "🏖️ 规划退休", hint: "会计XP+5,心智+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e578RetirePlanCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏖️ '按照现在的资产和开支，X年后就可以退休了。' 会计XP+5,心智+3,心情+2。", "success");
        }},
        { text: "💰 继续积累", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e578RetirePlanCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏖️ '还不够，再多积累一些，退休生活要更从容。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var pv = Math.floor(calcPortfolioValue(st));
        return "你算了一笔账，发现可以提前退休了——'¥" + pv.toLocaleString() + "，按照4%法则，每年可以花¥" + Math.floor(pv * 0.04).toLocaleString() + "。' 财务自由，近在咫尺。";
      }
    },
    {
      id: "e578_invest_friend_trust", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "合伙投资",
      story: "朋友想和你一起投资一个项目——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_e578FriendTrustCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 30000 && (st.flags && !st.flags._e578FriendTrustCooldown);
      },
      choices: [
        { text: "🤝 一起投资", hint: "社交XP+5,会计XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e578FriendTrustCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "合伙投资");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '信任是合作的基础，一起赚钱！' 社交XP+5,会计XP+3,好感+2。", "success");
        }},
        { text: "📋 评估风险", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e578FriendTrustCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '先评估一下项目的风险和回报。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友想和你一起投资一个项目——'我发现了很好的机会，一起投吧！' 朋友合伙投资，信任是基础。";
      }
    },
    {
      id: "e578_economic_cycle_story", phase: "street", _isChainEvent: false, icon: "🔄",
      title: "经济周期",
      story: "你发现经济周期中总有规律可循——{desc}",
      triggers: { minDay: 35, interval: 120, maxRepeats: 3, excludeFlags: ["_e578CycleStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._e578CycleStoryCooldown);
      },
      choices: [
        { text: "🔄 顺势投资", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e578CycleStoryCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 '经济周期就像四季，春种秋收。' 会计XP+5,心智+2。", "success");
        }},
        { text: "📊 研究历史", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e578CycleStoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 '历史不会重演，但会押韵。研究过去的周期，可以预测未来。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现经济周期中总有规律可循——'衰退期买入，繁荣期卖出。' 简单的道理，执行起来却不容易。";
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