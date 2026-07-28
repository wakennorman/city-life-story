/**
 * 域F(UI/UX) 联动增强 R623
 * 桥接：
 *   F→A  f623_ui_price_trend  价格趋势可视化 → 消费 state.trade+state.player 数据,
 *     UI→"看得见的价格脉搏"数据回响
 *   F→E  f623_ui_invest_dashboard  投资仪表盘 → 消费 state.investment+state.stock 数据,
 *     UI→"投资全景图"财务回响
 *   F→H  f623_ui_corp_dashboard  公司运营仪表盘 → 消费 state.corporate+state.startup 数据,
 *     UI→"公司健康度"经营回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR623Loaded) return;
  RANDOM_EVENTS._domainFLinkageR623Loaded = true;

  var EVENTS = [
    // ================================================================
    // F→A: 价格趋势可视化 — 商品价格波动提醒
    // ================================================================
    {
      id: "f623_ui_price_trend",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "市场价格脉搏",
      triggers: { minDay: 3 },
      story: function (st) {
        var trade = st.trade || {};
        var location = trade.currentLocation || "commercialDist";
        var goods = (typeof GOODS !== "undefined" && GOODS) ? GOODS : [];
        var priceChanges = [];
        for (var gi = 0; gi < goods.length; gi++) {
          var g = goods[gi];
          if (!g || !g.id) continue;
          var curPrice = (typeof getPrice === "function") ? getPrice(g.id, location, st) : 0;
          var basePrice = g.basePrice || 100;
          var ratio = curPrice > 0 ? Math.round((curPrice / basePrice) * 100) : 100;
          if (ratio >= 120) priceChanges.push({ name: g.name || g.id, trend: "📈高", ratio: ratio });
          else if (ratio <= 80) priceChanges.push({ name: g.name || g.id, trend: "📉低", ratio: ratio });
        }
        if (priceChanges.length === 0) {
          return "今天市场行情平稳，各商品价格在正常范围内波动。没有特别明显的价格洼地或泡沫，适合按需采购。";
        }
        // 只显示前3个
        var topChanges = priceChanges.slice(0, 3);
        var parts = topChanges.map(function(p) { return p.name + p.trend + "(" + p.ratio + "%)"; });
        return "今日市场价格波动：<br>" + parts.join("、") + "<br>" +
          (priceChanges.length > 3 ? "还有" + (priceChanges.length - 3) + "种商品价格异常。" : "") +
          "低价商品适合买入囤货，高价商品可考虑卖出获利。";
      },
      choices: [
        { text: "🛒 去市场看看", next: null, handler: function(st) {
          if (typeof showLocationNavModal === "function") {
            showLocationNavModal(trade.currentLocation || "commercialDist", "🏪 市场行情", "trade");
          } else {
            StateManager.addMessage("🛒 前往商业区查看商品价格", "info");
          }
        }},
        { text: "📊 记录价格", next: null, handler: function(st) {
          st.flags = st.flags || {};
          st.flags._f623_priceAware = (st.flags._f623_priceAware || 0) + 1;
          StateManager.addMessage("📊 你记录了今天的市场价格，对行情更敏感了", "info");
        }},
      ],
      conditions: function (st) {
        if (!st.trade || !st.trade.currentLocation) return false;
        return (st.player.day || 0) % 5 === 0; // 每5天触发一次
      },
      weight: 1,
    },

    // ================================================================
    // F→E: 投资仪表盘 — 投资组合表现概览
    // ================================================================
    {
      id: "f623_ui_invest_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "投资组合概览",
      triggers: { minDay: 10 },
      story: function (st) {
        var stocks = st.stockMarket || {};
        var holdings = st.investment || {};
        var stockCount = 0;
        var totalValue = 0;
        for (var sym in stocks) {
          if (stocks[sym] && stocks[sym].shares > 0) {
            stockCount++;
            totalValue += (stocks[sym].shares || 0) * (stocks[sym].currentPrice || 0);
          }
        }
        var investmentTotal = (st.investment && st.investment.totalValue) || 0;
        var totalPortfolio = totalValue + investmentTotal;

        if (totalPortfolio <= 0) {
          return "你目前没有持有任何投资标的。可以考虑从股票或基金开始，让钱为你工作。";
        }
        return "你的投资组合总市值约 ¥" + totalPortfolio.toLocaleString() + "。<br>" +
          "持有 " + stockCount + " 只股票" +
          (investmentTotal > 0 ? "，投资基金/理财 ¥" + investmentTotal.toLocaleString() : "") + "。<br>" +
          (totalPortfolio >= 100000 ? "资产配置已初具规模，建议定期复盘调整比例。" :
           totalPortfolio >= 10000 ? "投资组合正在成长，建议关注分散风险。" :
           "小额投资是好的开始，持续积累才能看到复利的力量。");
      },
      choices: [
        { text: "📈 查看股票", next: null, handler: function(st) {
          if (typeof showStockTab === "function") {
            showStockTab();
          } else {
            StateManager.addMessage("📈 前往「投资」Tab查看股票详情", "info");
          }
        }},
        { text: "💹 查看基金", next: null, handler: function(st) {
          StateManager.addMessage("💹 前往「投资」Tab查看基金/理财详情", "info");
        }},
      ],
      conditions: function (st) {
        var hasStocks = false;
        var sm = st.stockMarket;
        if (sm) {
          for (var sym in sm) {
            if (sm[sym] && sm[sym].shares > 0) { hasStocks = true; break; }
          }
        }
        return hasStocks || (st.investment && st.investment.totalValue > 0);
      },
      weight: 1,
    },

    // ================================================================
    // F→H: 公司运营仪表盘 — 公司健康度提示
    // ================================================================
    {
      id: "f623_ui_corp_dashboard",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "公司运营健康度",
      triggers: { minDay: 30 },
      story: function (st) {
        var startup = st.startup;
        if (!startup || !startup.company) {
          return "你还没有创办公司。创业需要足够的资金、人脉和行业经验，做好准备后可以前往「事业发展」注册。";
        }
        var co = startup.company;
        var cash = co.cash || 0;
        var employees = (co.employees || []).length;
        var valuation = co.valuation || 0;
        var revenue = co.revenue || 0;
        var burnRate = co.burnRate || 0;

        var warnings = [];
        if (cash < 10000) warnings.push("⚠️ 现金储备不足¥10,000，需尽快融资");
        else if (cash < 50000) warnings.push("⚡ 现金储备¥" + cash.toLocaleString() + "，建议谨慎运营");
        else warnings.push("✅ 现金储备充足¥" + cash.toLocaleString());

        if (burnRate > 0 && cash / burnRate < 3) {
          warnings.push("⚠️ 现金流仅够支撑" + Math.floor(cash / burnRate) + "个月");
        }
        if (employees < 2) warnings.push("👤 团队规模较小，建议招聘核心岗位");
        if (revenue <= 0 && (co.stage || "seed") === "seed") {
          warnings.push("🌱 种子期公司，重点放在产品开发和市场验证");
        }

        return "【" + (co.name || "未命名") + "】运营报告<br>" +
          "估值 ¥" + valuation.toLocaleString() + " · 月营收 ¥" + revenue.toLocaleString() + "<br>" +
          warnings.join("<br>");
      },
      choices: [
        { text: "🏢 查看公司详情", next: null, handler: function(st) {
          if (typeof showStartupTab === "function") {
            showStartupTab();
          } else {
            StateManager.addMessage("🏢 前往「公司」Tab查看详情", "info");
          }
        }},
        { text: "💰 查看现金流", next: null, handler: function(st) {
          StateManager.addMessage("💰 公司现金流 ¥" + ((st.startup && st.startup.company && st.startup.company.cash) || 0).toLocaleString(), "info");
        }},
      ],
      conditions: function (st) {
        return st.startup && st.startup.status !== "none" && st.startup.company;
      },
      weight: 1,
    },
  ];

  // 注册事件
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();