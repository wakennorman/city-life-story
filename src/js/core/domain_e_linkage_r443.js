/**
 * 域E(经济/投资) 联动增强 R443
 * 桥接：
 *   E→A  e443_invest_data_insight    投资数据洞察 → 消费 investment+portfolio 数据,
 *     投资回报→"从数字里看趋势"的经济数据积累
 *   E→H  e443_invest_fund_startup    投资反哺创业 → 消费 investment+portfolio 数据,
 *     投资获利→"用投资赚的钱开公司"的创业资金
 *   E→B  e443_market_news            市场波动叙事 → 消费 investment+stockMarket 数据,
 *     股票涨跌→"今天股市又震荡了"的市井新闻
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR443Loaded) return;
  RANDOM_EVENTS._domainELinkageR443Loaded = true;

  function calcPortfolioValue(st) {
    if (!st || !st.investment || !st.investment.portfolio) return 0;
    var p = st.investment.portfolio;
    var total = 0;
    if (p.stocks) { for (var s in p.stocks) { total += (p.stocks[s].shares || 0) * (p.stocks[s].avgPrice || 0); } }
    if (p.funds) { for (var f in p.funds) { total += (p.funds[f].shares || 0) * (p.funds[f].avgPrice || 0); } }
    return total;
  }
  function portfolioStockCount(st) {
    if (!st || !st.investment || !st.investment.portfolio || !st.investment.portfolio.stocks) return 0;
    var n = 0;
    for (var s in st.investment.portfolio.stocks) { if (st.investment.portfolio.stocks[s].shares > 0) n++; }
    return n;
  }

  var EVENTS = [
    // E→A: 投资数据洞察 → 经济数据积累
    {
      id: "e443_invest_data_insight", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "投资复盘",
      story: "你坐在电脑前，翻看着这个月的投资记录——{desc}",
      triggers: { minDay: 50, interval: 60, maxRepeats: 5, excludeFlags: ["_e443DataInsightCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (portfolioStockCount(st) < 1) return false;
        return (st.flags && !st.flags._e443DataInsightCooldown);
      },
      choices: [
        { text: "📈 分析收益率曲线", hint: "会计XP+5,心智+2,投资洞察+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e443DataInsightCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你仔细分析了这个月的投资数据——收益率曲线里藏着市场的秘密。会计XP+5,心智+2。", "success");
        }},
        { text: "📝 记下心得", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e443DataInsightCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你把投资心得记在本子上——好记性不如烂笔头。心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var pv = Math.floor(calcPortfolioValue(st));
        var sc = portfolioStockCount(st);
        return "你坐在电脑前，翻看着这个月的投资记录——" + sc + "只股票的总市值约¥" + pv.toLocaleString() + "。数字背后是市场的脉搏。";
      }
    },
    // E→H: 投资反哺创业
    {
      id: "e443_invest_fund_startup", phase: "corporate", _isChainEvent: false, icon: "🚀",
      title: "用投资养创业",
      story: "看着账户里的投资收益，你开始盘算——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 3, excludeFlags: ["_e443FundStartupCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        if (pv < 30000) return false;
        return (st.flags && !st.flags._e443FundStartupCooldown);
      },
      choices: [
        { text: "💰 追加公司资金", hint: "公司资金+5000,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e443FundStartupCooldown = true;
          if (st.corporate && st.corporate.company) {
            st.corporate.company.funds = (st.corporate.company.funds || 0) + 5000;
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 你从投资收益里拿出一笔钱注入公司——'用投资养创业'，这是你给自己定的规矩。公司资金+¥5000,管理XP+3。", "success");
        }},
        { text: "📈 继续投资,扩大本金", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e443FundStartupCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 你决定让钱继续生钱——现在还不是抽离的时候，等到雪球滚得足够大再考虑。会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var pv = Math.floor(calcPortfolioValue(st));
        return "看着账户里的投资收益（¥" + pv.toLocaleString() + "），你开始盘算——这笔钱能帮公司做多少事？还是说，钱生钱才是最好的路？";
      }
    },
    // E→B: 市场波动 → 市井新闻
    {
      id: "e443_market_news", phase: "street", _isChainEvent: false, icon: "📰",
      title: "股市风云",
      story: "路边报摊的电视正播着财经新闻——{desc}",
      triggers: { minDay: 30, interval: 45, maxRepeats: 10, excludeFlags: ["_e443MarketNewsCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._e443MarketNewsCooldown);
      },
      choices: [
        { text: "📰 驻足看一会儿", hint: "会计XP+2,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e443MarketNewsCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📰 财经新闻里说今天大盘震荡——你琢磨着这跟自己手里的股票有没有关系。会计XP+2,心智+1。", "success");
        }},
        { text: "🚶 匆匆走过", hint: "无奖励", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e443MarketNewsCooldown = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "路边报摊的电视正播着财经新闻——今天股市又震荡了。有人驻足叹息，有人匆匆而过，只有你知道，这跟自己有没有关系。";
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