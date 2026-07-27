/**
 * 域A(数据/数值平衡) 联动增强 R446
 * 桥接：
 *   A→D  a446_market_gossip       市场价格情报 → 消费 goods+trade 数据,
 *     商品价格波动→"菜市场上新了"的NPC闲聊
 *   A→F  a446_price_trend_v3      价格趋势v3 → 消费 goods 数据,
 *     价格走势→"现在买什么最划算"的购物时机提示
 *   A→E  a446_trade_to_invest     倒卖到投资 → 消费 trade+goods 数据,
 *     倒卖经验→"从倒爷到投资客"的财务升级叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR446Loaded) return;
  RANDOM_EVENTS._domainALinkageR446Loaded = true;

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
    // A→D: 市场价格情报 → NPC闲聊
    {
      id: "a446_market_gossip", phase: "street", _isChainEvent: false, icon: "🧑‍🌾",
      title: "菜市场行情",
      story: "卖菜的大姐朝你招手——{desc}",
      triggers: { minDay: 10, interval: 30, maxRepeats: 5, excludeFlags: ["_a446MarketGossipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a446MarketGossipCooldown);
      },
      choices: [
        { text: "🧑‍🌾 跟大姐唠两句", hint: "好感+2,心情+1,价格情报+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a446MarketGossipCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "菜市场闲聊拉近了关系");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧑‍🌾 '今天猪肉又涨价了，但青菜便宜得很！'——菜市场的大姐总是知道什么最划算。好感+2,心情+1,心智+1。", "success");
        }},
        { text: "💰 买点便宜的菜", hint: "伙食费-100", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a446MarketGossipCooldown = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧑‍🌾 你听大姐的建议买了些当季蔬菜——便宜又新鲜。伙食费省了100块。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "卖菜的大姐朝你招手——'小伙子/姑娘，今天菜价可便宜了，不来点？'——菜市场是这座城市最有烟火气的地方。";
      }
    },
    // A→F: 价格趋势 → 购物时机
    {
      id: "a446_price_trend_v3", phase: "street", _isChainEvent: false, icon: "🏷️",
      title: "比价高手",
      story: "你掏出手机查了查最近的价格走势——{desc}",
      triggers: { minDay: 20, interval: 45, maxRepeats: 5, excludeFlags: ["_a446PriceTrendCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a446PriceTrendCooldown);
      },
      choices: [
        { text: "📊 研究价格规律", hint: "会计XP+3,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a446PriceTrendCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏷️ 你研究了最近的价格走势——发现每周三蔬菜最便宜，周末水果打折。这些规律记下来，能省不少钱。会计XP+3,心智+1。", "success");
        }},
        { text: "🛒 趁便宜囤点货", hint: "获得食材×2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a446PriceTrendCooldown = true;
          if (st.inventory) st.inventory.food = (st.inventory.food || 0) + 2;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏷️ 你趁便宜囤了些耐放的食材——米面粮油，有备无患。食材+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你掏出手机查了查最近的价格走势——什么东西在涨价、什么东西在打折，心里有数。在这座城市，会买东西也是一种本事。";
      }
    },
    // A→E: 倒卖到投资 → 财务升级
    {
      id: "a446_trade_to_invest", phase: "corporate", _isChainEvent: false, icon: "🔄",
      title: "从倒爷到投资客",
      story: "你翻着过去倒买倒卖的记录，忽然有了新的想法——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_a446TradeInvestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var spent = (st.trade && st.trade._totalSpent) || 0;
        return spent >= 5000 && (st.flags && !st.flags._a446TradeInvestCooldown);
      },
      choices: [
        { text: "📈 把经验用到投资上", hint: "会计XP+5,投资意识+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a446TradeInvestCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          st.flags._dataInvestorMindset = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 '低价买入、高价卖出'——倒卖和投资的本质是一样的。你决定把倒卖练出的眼光用到投资上。会计XP+5,解锁投资意识。", "success");
        }},
        { text: "📝 继续专注倒卖", hint: "销售XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a446TradeInvestCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 3); } catch(e) {} } // [全系统自洽修复] 域B R469 修复:假技能键"trade"(state.skills无此键,XP静默丢弃)→真实键"sales"
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 你决定先把倒卖这条路走透——投资有风险，倒卖虽然辛苦，但每一分钱都赚得踏实。销售XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var spent = (st.trade && st.trade._totalSpent) || 0;
        return "你翻着过去倒买倒卖的记录，忽然有了新的想法——累计进货¥" + Math.floor(spent).toLocaleString() + "，这些经验如果用到投资上...";
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