/**
 * 域E(经济/投资) 联动增强 R661
 * 桥接：
 *   E→B  e661_investment_story  投资故事 → 消费 state.investment+state.stockMarket 数据,
 *     经济→"投资背后的故事"叙事回响
 *   E→D  e661_investor_network  投资者社交圈 → 消费 state.investment+state.relationships 数据,
 *     经济→"投资圈人脉"社交回响
 *   E→F  e661_portfolio_ui  投资组合仪表盘 → 消费 state.investment+state.resources 数据,
 *     经济→"投资全景"UI回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR661Loaded) return;
  RANDOM_EVENTS._domainELinkageR661Loaded = true;

  function metNpcsR661(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) { if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0 }); }
    return out;
  }

  var EVENTS = [
    {
      id: "e661_investment_story", phase: "street", _isChainEvent: false, icon: "📖",
      title: "投资故事", triggers: { minDay: 15 },
      story: function(st) {
        var sm = st.stockMarket || {}; var count = 0, pl = 0, cost = 0;
        for (var k in sm) { var s = sm[k]; if (s && s.shares > 0) { count++; cost += (s.shares||0)*(s.avgPrice||0); pl += ((s.currentPrice||0)-(s.avgPrice||0))*(s.shares||0); } }
        if (count === 0) return "你还没有投资经历。每一笔投资背后都有一个故事，等你去书写。";
        var pct = cost > 0 ? Math.round(pl/cost*100) : 0;
        return "你持有" + count + "只股票，投入¥" + cost.toLocaleString() + "，当前" + (pl>=0?"盈利":"亏损") + "¥" + Math.abs(pl).toLocaleString() + "(" + (pl>=0?"+":"") + pct + "%)。" + (pl>=0?"投资需要眼光，更需要耐心。":"市场波动是常态，长期持有才是王道。");
      },
      choices: [
        { text: "📈 查看持仓", apply: function(st) { if (typeof showStockTab === "function") showStockTab(); else StateManager.addMessage("📈 前往投资Tab", "info"); }},
        { text: "📝 记录心得", apply: function(st) { st.flags=st.flags||{}; st.flags._e661_story=(st.flags._e661_story||0)+1; StateManager.addMessage("📝 记录了投资心得", "info"); }},
      ],
      conditions: function(st) { var sm=st.stockMarket; if(!sm) return false; for(var k in sm){if(sm[k]&&sm[k].shares>0) return true} return false; },
      weight: 1,
    },
    {
      id: "e661_investor_network", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "投资圈", triggers: { minDay: 12 },
      story: function(st) {
        var npcs = metNpcsR661(st); if (npcs.length === 0) return "你还没有投资圈的朋友。";
        var high = 0; for (var i=0;i<npcs.length;i++) { if (npcs[i].affinity >= 40) high++; }
        var sm = st.stockMarket || {}; var hasStock = false; for (var k in sm) { if (sm[k] && sm[k].shares > 0) { hasStock = true; break; } }
        if (high >= 2 && hasStock) return "你有" + high + "位关系不错的朋友也关注投资。" + "你们偶尔交流投资心得，分享市场信息，互相提醒风险。";
        return "你认识" + npcs.length + "位朋友，但能聊投资的还不多。";
      },
      choices: [
        { text: "💬 聊投资", apply: function(st) { st.flags=st.flags||{}; st.flags._e661_network=(st.flags._e661_network||0)+1; StateManager.addMessage("💬 和朋友聊了聊投资", "info"); }},
        { text: "📊 自己研究", apply: function(st) { StateManager.addMessage("📊 自己研究市场", "info"); }},
      ],
      conditions: function(st) { var npcs = metNpcsR661(st); return npcs.length >= 2; },
      weight: 1,
    },
    {
      id: "e661_portfolio_ui", phase: "street", _isChainEvent: false, icon: "📋",
      title: "投资全景", triggers: { minDay: 10 },
      story: function(st) {
        var cash = st.resources && st.resources.cash || 0;
        var bank = st.resources && st.resources.bankBalance || 0;
        var sm = st.stockMarket || {}; var stockVal = 0;
        for (var k in sm) { var s = sm[k]; if (s && s.shares > 0) stockVal += (s.shares||0)*(s.currentPrice||0); }
        var inv = (st.investment && st.investment.totalValue) || 0;
        var total = cash + bank + stockVal + inv;
        if (total === 0) return "你还没有资产。开始攒钱吧，每一分钱都是未来的种子。";
        return "总资产 ¥" + total.toLocaleString() + "<br>现金¥" + cash.toLocaleString() + " 存款¥" + bank.toLocaleString() + (stockVal>0?"<br>股票¥" + stockVal.toLocaleString():"") + (inv>0?"<br>理财¥" + inv.toLocaleString():"");
      },
      choices: [
        { text: "💰 查看详情", apply: function(st) { StateManager.addMessage("💰 总资产 ¥" + ((st.resources&&((st.resources.cash||0)+(st.resources.bankBalance||0)))||0).toLocaleString(), "info"); }},
        { text: "📈 继续投资", apply: function(st) { StateManager.addMessage("📈 继续积累资产", "info"); }},
      ],
      conditions: function(st) { return st.resources && (st.resources.cash > 0 || st.resources.bankBalance > 0); },
      weight: 1,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();