/*
 * 城市浮生记 — 域E(经济/投资) 联动增强 R792
 * 全系统优化·Domain E 第六轮循环
 *
 * 【联动增强3项】
 *   1. E→F 投资复盘UI — 投资组合历史曲线可视化+券商顾问引导调仓
 *   2. E→C 投资眼光→会计技能 — 投资经验迁移为职场会计能力
 *   3. E→H 财富变种子金 — 个人投资收益反哺创业启动资金
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域E铁律：金融计算必 isFinite 守卫。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR792Loaded) return;
  RANDOM_EVENTS._domainELinkageR792Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }
  function getPortfolioValue(st) {
    if (!st || !st.investment) return 0;
    var _pv = st.resources ? (st.resources.cash || 0) + (st.resources.bankBalance || 0) : 0;
    var _inv = st.investment;
    if (_inv.stockHoldings && _inv.stockMarket) {
      for (var _s in _inv.stockHoldings) {
        var _h = _inv.stockHoldings[_s];
        var _m = _inv.stockMarket[_s];
        _pv += (_m ? _m.price : 0) * (_h.shares || 0);
      }
    }
    if ((_inv.btcHoldings || 0) > 0) _pv += (_inv.btcPrice || 0) * _inv.btcHoldings;
    var _props = _inv.properties || [];
    for (var _pi = 0; _pi < _props.length; _pi++) {
      _pv += _props[_pi].currentPrice || _props[_pi].buyPrice || 0;
    }
    return isFinite(_pv) ? _pv : 0;
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: E→F 投资复盘UI — 投资组合历史曲线+券商顾问引导调仓
    // 设计意图：portfolioPeakHistory 已有数据但缺少UI层的"复盘行动"。
    // 本事件在组合总市值首次突破¥5万时触发，引导玩家查看曲线+获得调仓建议。
    // 心理学：禀赋效应 — 看到自己的投资曲线会产生"这是我的成果"的满足感。
    // ========================================================================
    {
      id: "e792_portfolio_review_ui",
      phase: "street",
      icon: "📊",
      title: "券商顾问的一个建议",
      story: "你打开了投资账户，看着那条曲折的市值曲线——它记录了你在这座城市里每一次买入和卖出的决定。\n\n一个券商顾问看了看你的账户，说：「你的组合已经初具规模了。但有些地方可以优化。」",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e792PortfolioReviewDone) return false;
        if (!st.investment) return false;
        var _pv = getPortfolioValue(st);
        return _pv >= 50000 && st.player.day >= 60;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📊 认真复盘，听取建议",
          hint: "心智+8, 会计XP+10, 置_e792ReviewDone",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e792PortfolioReviewDone = true;
            st.flags._e792AdvisorConsulted = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            grantXp("accounting", 10);
            // 记录复盘数据供UI消费
            var _pv = getPortfolioValue(st);
            st.flags._e792LastReviewValue = _pv;
            st.flags._e792LastReviewDay = st.player.day;
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 你认真审视了每一条投资曲线。经验是最好的老师——心智+8, 会计XP+10。", "success");
            }
          }
        },
        {
          text: "🤷 看看就行，不急着调",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e792PortfolioReviewDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤷 你瞥了一眼曲线，关上了APP。也许下次吧。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: E→C 投资眼光→会计技能 — 投资经验迁移为职场能力
    // 设计意图：投资系统中的分析经验（看财报、判断价值）应能迁移到职业技能。
    // 本事件在玩家持有≥3个不同标的且总资产≥¥3万时触发。
    // 心理学：技能协同 — 不同领域的分析能力互相强化。
    // ========================================================================
    {
      id: "e792_invest_to_career_skill",
      phase: "street",
      icon: "🎓",
      title: "投资教会你的事",
      story: "今天在工作中遇到一个财务分析的问题，你忽然发现——过去几个月看财报、分析投资标的的经验，让你对数字有了天然的敏感。\n\n那些K线图、市盈率、现金流，不再只是投资术语，而是变成了你理解商业的语言。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e792InvestCareerDone) return false;
        if (!st.investment) return false;
        // 持有≥3个不同标的（股票+BTC+房产合计）
        var _holdings = st.investment.stockHoldings || [];
        var _stockCount = 0;
        for (var _s in _holdings) { if (_holdings[_s] && _holdings[_s].shares > 0) _stockCount++; }
        var _totalTypes = _stockCount + (st.investment.btcHoldings > 0 ? 1 : 0) + (st.investment.properties.length > 0 ? 1 : 0);
        if (_totalTypes < 3) return false;
        var _pv = getPortfolioValue(st);
        return _pv >= 30000 && st.player.day >= 45;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📈 把投资分析方法用到工作中",
          hint: "会计XP+15, 管理XP+8, 置_e792InvestCareer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e792InvestCareerDone = true;
            st.flags._e792InvestCareer = true;
            grantXp("accounting", 15);
            grantXp("management", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎓 投资视野迁移为职场能力——会计XP+15, 管理XP+8。", "success");
            }
          }
        },
        {
          text: "😊 投资和工作是两回事",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e792InvestCareerDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 你觉得投资和工作还是分开比较好。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: E→H 财富变种子金 — 个人投资收益反哺创业启动资金
    // 设计意图：个人投资积累的财富应能反哺创业阶段。
    // 本事件在投资总收益首次突破¥10万时触发，给予"创业者种子金"标记。
    // 心理学：禀赋效应 — 玩家感到投资积累没有白费，为创业铺路。
    // ========================================================================
    {
      id: "e792_wealth_to_seed",
      phase: "street",
      icon: "🌱",
      title: "第一桶金的种子",
      story: "你算了算——投资账户里的总收益，已经突破了十万。\n\n这笔钱，不再只是数字。它是你未来创业的种子金，是你从「打工者」走向「经营者」的底气。\n\n也许有一天，你会用这笔钱，开启一段全新的人生。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e792WealthSeedDone) return false;
        if (!st.investment) return false;
        var _profit = st.investment._totalInvestmentProfit || 0;
        return _profit >= 100000 && st.player.day >= 90;
      },
      probability: 0.08,
      repeatable: false,
      choices: [
        {
          text: "🌱 标记为创业种子金",
          hint: "置_e792SeedFund标记,H→E解锁创业初始资金加成",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e792WealthSeedDone = true;
            st.flags._e792SeedFund = true;
            // 将部分投资收益锁定为创业种子金（记录数值供H域消费）
            var _seed = Math.min((st.investment._totalInvestmentProfit || 0) * 0.5, 200000);
            st.flags._e792SeedAmount = isFinite(_seed) ? Math.round(_seed) : 0;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌱 你将¥" + st.flags._e792SeedAmount.toLocaleString() + "标记为创业种子金。这笔钱，终将开花结果。心智+10。", "success");
            }
          }
        },
        {
          text: "💰 继续滚动投资",
          hint: "心智+5, 保留收益继续增长",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e792WealthSeedDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 你决定让收益继续滚动。种子金，不急。", "info");
            }
          }
        }
      ]
    }
  ];

  // ---- 注入全局 RANDOM_EVENTS ----
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
