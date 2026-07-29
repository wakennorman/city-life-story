/**
 * 域E(经济/投资) 联动增强 R807 (第十二轮循环)
 * 桥接：
 *   E→A  e807_invest_price_insight 投资价格洞察 → 消费 investment/stock 数据
 *   E→B  e807_invest_market_story 市场故事 → 消费 投资盈亏+市场趋势
 *   E→G  e807_invest_health_balance 投资健康平衡 → 消费 财富+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR807Loaded) return;
  RANDOM_EVENTS._domainELinkageR807Loaded = true;

  function getPortfolioVal(st) {
    if (!st || !st.investment) return 0;
    var pv = (st.resources && isFinite(st.resources.cash) ? st.resources.cash : 0) +
      (st.resources && isFinite(st.resources.bankBalance) ? st.resources.bankBalance : 0);
    var inv = st.investment;
    if (inv.stockHoldings && inv.stockMarket) {
      for (var sym in inv.stockHoldings) {
        if (inv.stockHoldings[sym] && inv.stockMarket[sym]) {
          var shares = inv.stockHoldings[sym].shares || 0;
          var price = inv.stockMarket[sym].price || 0;
          if (isFinite(shares) && isFinite(price)) pv += shares * price;
        }
      }
    }
    return pv;
  }

  var EVENTS = [
    // ====== E→A 投资价格洞察 ======
    {
      id: "e807_invest_price_insight", phase: "street", _isChainEvent: false, icon: "📊",
      title: "投资价格洞察",
      story: "市场的每一次波动,都藏着价格信号——读懂它们,就能把握先机。",
      triggers: { minDay: 100, interval: 200, maxRepeats: 3, excludeFlags: ["_e807PriceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e807PriceCd) return false;
        return st.player && st.player.day >= 100 && st.investment;
      },
      text: function (st) {
        if (!st) return null;
        var pv = Math.round(getPortfolioVal(st));
        return "你的投资组合市值¥" + pv.toLocaleString() + "——'市场的每一次波动,都藏着价格信号。'";
      },
      choices: [
        {
          text: "📈 分析价格趋势", hint: "智力+20,会计XP+15,置_e807PriceAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e807PriceCd = true;
            st.flags._e807PriceAnalyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '价格背后,是供需的博弈。' 智力+20,会计XP+15。", "success");
            }
          }
        },
        {
          text: "📝 记录市场观察", hint: "心智+18,置_e807MarketObserver",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e807PriceCd = true;
            st.flags._e807MarketObserver = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 '市场是最好的老师。' 心智+18。", "info");
            }
          }
        }
      ]
    },

    // ====== E→B 市场故事 ======
    {
      id: "e807_invest_market_story", phase: "street", _isChainEvent: false, icon: "📰",
      title: "市场故事",
      story: "每一次投资,都是一个故事——涨跌之间,藏着这座城市的财富密码。",
      triggers: { minDay: 200, interval: 250, maxRepeats: 3, excludeFlags: ["_e807StoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e807StoryCd) return false;
        return st.player && st.player.day >= 200 && st.investment && st.investment.stockHoldings;
      },
      text: function (st) {
        if (!st) return null;
        var stocks = st.investment && st.investment.stockHoldings ? Object.keys(st.investment.stockHoldings).length : 0;
        return "你持有" + stocks + "只股票——'每一次投资,都是一个故事。'";
      },
      choices: [
        {
          text: "📖 回顾投资历程", hint: "心智+22,魅力+15,置_e807InvestChronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e807StoryCd = true;
            st.flags._e807InvestChronicler = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 22);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '投资,是一场与自己的对话。' 心智+22,魅力+15。", "success");
            }
          }
        },
        {
          text: "🗣️ 分享投资心得", hint: "销售XP+20,置_e807StoryTeller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e807StoryCd = true;
            st.flags._e807StoryTeller = true;
            // [全系统自洽修复] 域E R815 A类: addSkillXp("social") 假技能键(真实12键无social)→XP静默丢弃,改为 sales(社交=销售口才)
            if (typeof addSkillXp === "function") { try { addSkillXp("sales", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗣️ '故事比数字更有感染力。' 销售XP+20。", "info");
            }
          }
        }
      ]
    },

    // ====== E→G 投资健康平衡 ======
    {
      id: "e807_invest_health_balance", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "投资健康平衡",
      story: "投资不是生活的全部——健康的心态,才是最大的财富。",
      triggers: { minDay: 300, interval: 300, maxRepeats: 4, excludeFlags: ["_e807HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e807HealthCd) return false;
        return st.player && st.player.day >= 300 && st.investment && st.needs && st.status;
      },
      text: function (st) {
        if (!st) return null;
        var pv = Math.round(getPortfolioVal(st));
        var health = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100;
        return "组合市值¥" + pv.toLocaleString() + ",健康" + health + "%——'健康的身体,才是最大的财富。'";
      },
      choices: [
        {
          text: "🧘 投资心态调整", hint: "心智+20,心情+20,置_e807Mindful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e807HealthCd = true;
            st.flags._e807Mindful = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '涨跌不惊,闲看庭前花开花落。' 心智+20,心情+20。", "success");
            }
          }
        },
        {
          text: "🏃 运动减压", hint: "健康+15,疲劳-20,置_e807Exerciser",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e807HealthCd = true;
            st.flags._e807Exerciser = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 15);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '运动是最好的减压方式。' 健康+15,疲劳-20。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();