/**
 * 域E(经济/投资) 联动增强 R509
 * 桥接：
 *   E→F  e509_invest_dashboard_tip 投资仪表盘提示 → 消费 investment 数据,
 *     面板→"投资仪表盘上的关键信号"的UI提示
 *   E→D  e509_invest_social_proof 投资社会证明 → 消费 investment+relationships 数据,
 *     从众→"大家都在买，我要不要跟"的社会证明
 *   E→G  e509_invest_life_change  投资人生改变 → 消费 investment+needs 数据,
 *     财富→"钱真的能改变生活吗"的反思
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR509Loaded) return;
  RANDOM_EVENTS._domainELinkageR509Loaded = true;

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
      id: "e509_invest_dashboard_tip", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "仪表盘信号",
      story: "投资仪表盘上出现了一个警示信号——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 5, excludeFlags: ["_e509DashboardTipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 5000 && (st.flags && !st.flags._e509DashboardTipCooldown);
      },
      choices: [
        { text: "📊 及时调整", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e509DashboardTipCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 'RSI指标显示超买，该减仓了。' 你及时调整了仓位。会计XP+5,心智+2。", "success");
        }},
        { text: "🔍 再观察", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e509DashboardTipCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '先看看再说，不急于操作。' 有时候，不动是最好的策略。心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "投资仪表盘上出现了一个警示信号——'技术指标显示市场可能过热。' 你盯着屏幕，思考着下一步。";
      }
    },
    {
      id: "e509_invest_social_proof", phase: "street", _isChainEvent: false, icon: "👀",
      title: "大家都在买",
      story: "你发现身边很多人都在买同一个东西——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_e509SocialProofCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._e509SocialProofCooldown);
      },
      choices: [
        { text: "👀 研究一下", hint: "会计XP+4,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e509SocialProofCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👀 '大家都在买，不代表我也要买。' 你决定先研究清楚再说。会计XP+4,心智+1。", "success");
        }},
        { text: "💡 逆向思考", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e509SocialProofCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👀 '当所有人都冲进去的时候，也许该出来了。' 逆向思考，让你避免了很多坑。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现身边很多人都在买同一个东西——'XX币又涨了！你买了没？' 从众心理，是投资最大的敌人。";
      }
    },
    {
      id: "e509_invest_life_change", phase: "street", _isChainEvent: false, icon: "💭",
      title: "钱改变了什么",
      story: "你发现账户里的数字变多了，但生活好像没什么变化——{desc}",
      triggers: { minDay: 40, interval: 120, maxRepeats: 3, excludeFlags: ["_e509LifeChangeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 50000 && (st.flags && !st.flags._e509LifeChangeCooldown);
      },
      choices: [
        { text: "💭 享受生活", hint: "心情+4,健康+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e509LifeChangeCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💭 '钱不是目的，幸福才是。' 你决定用一部分钱去体验生活。心情+4,健康+1。", "success");
        }},
        { text: "🎯 设定新目标", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e509LifeChangeCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💭 '有了钱，就有了选择的自由。' 你设定了新的人生目标。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var pv = Math.floor(calcPortfolioValue(st));
        return "你发现账户里的数字变多了（¥" + pv.toLocaleString() + "），但生活好像没什么变化——'原来我追求的并不是钱本身。'";
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