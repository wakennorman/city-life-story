/**
 * 域E(经济/投资) 联动增强 R493
 * 桥接：
 *   E→G  e493_invest_health_tradeoff 投资健康权衡 → 消费 investment+status 数据,
 *     赚钱→"用健康换钱，值不值"的人生选择
 *   E→C  e493_invest_skill_fund     投资技能基金 → 消费 investment+skills 数据,
 *     收益→"用投资收益投资自己"的成长循环
 *   E→D  e493_invest_friend_debt    投资朋友债务 → 消费 investment+relationships 数据,
 *     借钱→"朋友借钱该不该借"的社交困境
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR493Loaded) return;
  RANDOM_EVENTS._domainELinkageR493Loaded = true;

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
      id: "e493_invest_health_tradeoff", phase: "corporate", _isChainEvent: false, icon: "⚖️",
      title: "用健康换钱",
      story: "为了盯盘，你熬夜到凌晨——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 5, excludeFlags: ["_e493HealthTradeoffCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 5000 && (st.flags && !st.flags._e493HealthTradeoffCooldown);
      },
      choices: [
        { text: "⚖️ 减少盯盘时间", hint: "健康+2,疲劳-2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e493HealthTradeoffCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ 你决定少盯盘——'健康比那点波动重要多了。' 健康+2,疲劳-2。", "success");
        }},
        { text: "📈 设自动提醒", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e493HealthTradeoffCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ 你设置了价格提醒——'不用一直盯着，到了价位它会通知我。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "为了盯盘，你熬夜到凌晨——'再跌我就加仓！' 但第二天醒来，你发现累的不是身体，是心。";
      }
    },
    {
      id: "e493_invest_skill_fund", phase: "corporate", _isChainEvent: false, icon: "🎓",
      title: "用钱生能力",
      story: "你决定用投资收益报个培训课程——{desc}",
      triggers: { minDay: 35, interval: 90, maxRepeats: 3, excludeFlags: ["_e493SkillFundCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 10000 && (st.flags && !st.flags._e493SkillFundCooldown);
      },
      choices: [
        { text: "🎓 报个管理课程", hint: "管理XP+8,花费2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e493SkillFundCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 8); } catch(e) {} }
          if (st.resources && st.resources.cash >= 2000) { st.resources.cash -= 2000; }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎓 你报了一个管理课程——'投资自己，是回报率最高的投资。' 管理XP+8,花费¥2000。", "success");
        }},
        { text: "💻 学编程", hint: "编程XP+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e493SkillFundCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("coding", 8); } catch(e) {} } // [全系统自洽修复] 域B R572 修复:addSkillXp("technology")非真实技能键(XP静默丢弃)→映射coding
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎓 你报了一个编程培训班——'未来是数字化的世界，不会编程就是新文盲。' 编程XP+8。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你决定用投资收益报个培训课程——'钱放着也是放着，不如用来提升自己。'";
      }
    },
    {
      id: "e493_invest_friend_debt", phase: "street", _isChainEvent: false, icon: "💸",
      title: "朋友借钱",
      story: "一个朋友开口找你借钱——{desc}",
      triggers: { minDay: 25, interval: 90, maxRepeats: 3, excludeFlags: ["_e493FriendDebtCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        return cash >= 5000 && (st.flags && !st.flags._e493FriendDebtCooldown);
      },
      choices: [
        { text: "💸 借了", hint: "好感+3,现金-2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e493FriendDebtCooldown = true;
          if (st.resources && st.resources.cash >= 2000) {
            st.resources.cash -= 2000;
            var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "慷慨解囊");
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💸 '什么时候还都行，不急。' 朋友感激地看着你。好感+3,借出¥2000。", "success");
        }},
        { text: "💡 教他赚钱", hint: "社交XP+4,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e493FriendDebtCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "教赚钱方法");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💸 '我给你讲讲怎么理财吧，比借钱更有用。' 社交XP+4,好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一个朋友开口找你借钱——'最近手头有点紧，能不能...' 你看着朋友为难的样子，想起了自己曾经的窘迫。";
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