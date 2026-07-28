/**
 * 域A(数据/数值平衡) 联动增强 R497
 * 桥接：
 *   A→E  a497_invest_tax_awareness 投资税务意识 → 消费 investment+resources 数据,
 *     收益→"赚了钱要交多少税"的财务规划
 *   A→B  a497_price_index_news    价格指数新闻 → 消费 goods 数据,
 *     物价→"CPI又涨了"的民生新闻叙事
 *   A→D  a497_market_friend_tip   市场朋友提示 → 消费 goods 数据,
 *     行情→"朋友告诉你什么好卖"的社交情报
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR497Loaded) return;
  RANDOM_EVENTS._domainALinkageR497Loaded = true;

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
      id: "a497_invest_tax_awareness", phase: "corporate", _isChainEvent: false, icon: "🧾",
      title: "税务规划",
      story: "你算了算投资赚的钱，发现要交不少税——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 3, excludeFlags: ["_a497TaxAwarenessCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 10000 && (st.flags && !st.flags._a497TaxAwarenessCooldown);
      },
      choices: [
        { text: "🧾 学习税务知识", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a497TaxAwarenessCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧾 你开始学习税务知识——'合理避税和偷税漏税是两回事。' 会计XP+5,心智+2。", "success");
        }},
        { text: "📋 找会计师咨询", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a497TaxAwarenessCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧾 你找了专业会计师咨询——'专业的事交给专业的人。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var pv = Math.floor(calcPortfolioValue(st));
        return "你算了算投资赚的钱，发现要交不少税——'赚了¥" + pv.toLocaleString() + "，要交多少税？' 你开始认真考虑税务规划的问题。";
      }
    },
    {
      id: "a497_price_index_news", phase: "street", _isChainEvent: false, icon: "📰",
      title: "CPI又涨了",
      story: "新闻里说上个月的CPI又涨了——{desc}",
      triggers: { minDay: 20, interval: 30, maxRepeats: 5, excludeFlags: ["_a497PriceIndexCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a497PriceIndexCooldown);
      },
      choices: [
        { text: "📰 关注物价变动", hint: "会计XP+3,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a497PriceIndexCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📰 'CPI涨了，意味着生活成本又要提高了。' 你开始关注物价变化。会计XP+3,心智+1。", "success");
        }},
        { text: "🛒 囤点日用品", hint: "无奖励", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a497PriceIndexCooldown = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📰 你趁涨价前去囤了点日用品——'能省一点是一点。'", "info");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "新闻里说上个月的CPI又涨了——'物价又涨了，工资什么时候涨？' 这是每个打工人都在问的问题。";
      }
    },
    {
      id: "a497_market_friend_tip", phase: "street", _isChainEvent: false, icon: "🤫",
      title: "悄悄告诉你",
      story: "一个朋友神秘地告诉你，最近什么好卖——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_a497MarketFriendTipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a497MarketFriendTipCooldown);
      },
      choices: [
        { text: "🤫 试试水", hint: "销售XP+4,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a497MarketFriendTipCooldown = true;
          // [全系统自洽修复] 域C R515 修复:addSkillXp("trade")非真实技能键(XP静默丢弃)→映射sales(市场买卖=销售)
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 4); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "分享了市场信息");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 你根据朋友的消息试了试——'真的挺好卖的！' 销售XP+4,好感+2。", "success");
        }},
        { text: "📝 记下情报", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a497MarketFriendTipCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 你默默记下了这个情报——'信息就是金钱。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一个朋友神秘地告诉你，最近什么好卖——'我只告诉你一个人，你别往外传...' 你竖起耳朵，生怕漏掉一个字。";
      }
    }
  ];

  function calcPortfolioValue(st) {
    if (!st || !st.investment || !st.investment.portfolio) return 0;
    var p = st.investment.portfolio, total = 0;
    if (p.stocks) { for (var s in p.stocks) { total += (p.stocks[s].shares || 0) * (p.stocks[s].avgPrice || 0); } }
    if (p.funds) { for (var f in p.funds) { total += (p.funds[f].shares || 0) * (p.funds[f].avgPrice || 0); } }
    return total;
  }

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