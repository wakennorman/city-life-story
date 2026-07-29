/**
 * 域E(经济/投资) 联动增强 R822 (第二十二轮循环)
 * 桥接：
 *   E→A  e822_invest_data_v8  投资数据沉淀v8 — 定期投资分析转化为数值洞察资产
 *   E→B  e822_invest_narrative_v8 投资叙事v8 — 重大投资事件触发人生故事回响
 *   E→G  e822_wealth_health_v8 财富健康v8 — 投资组合健康度反馈生命质量
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 使用 Random.fromArray/Random.int 而非 Math.random()，保持种子RNG一致性。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR822Loaded) return;
  RANDOM_EVENTS._domainELinkageR822Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  /** 计算投资组合总市值（含股票+房产+BTC） */
  function calcPortfolioValue(st) {
    if (!st || !st.investment) return 0;
    var v = 0;
    var inv = st.investment;
    var holdings = inv.stockHoldings || [];
    var market = inv.stockMarket || {};
    for (var i = 0; i < holdings.length; i++) {
      var h = holdings[i];
      var m = market[h.symbol];
      if (m && isFinite(m.price) && isFinite(h.shares)) v += m.price * h.shares;
    }
    var props = inv.properties || [];
    for (var i = 0; i < props.length; i++) {
      v += props[i].currentPrice || props[i].buyPrice || 0;
    }
    if ((inv.btcHoldings || 0) > 0 && isFinite(inv.btcPrice || 0)) {
      v += inv.btcPrice * inv.btcHoldings;
    }
    return v;
  }

  /** 计算投资组合多样性得分（0-3，每类资产1分） */
  function calcDiversity(st) {
    if (!st || !st.investment) return 0;
    var inv = st.investment;
    var score = 0;
    if (inv.stockHoldings && inv.stockHoldings.length > 0) score++;
    if (inv.properties && inv.properties.length > 0) score++;
    if ((inv.btcHoldings || 0) > 0) score++;
    return score;
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: E→A 投资数据沉淀v8 — 投资经验转化为数值数据资产
    // 设计意图：玩家的投资行为应持续产生可消费的数据资产，为数值域提供洞察。
    // 本事件在玩家持仓≥3只不同标的时触发，给予"投资数据资产v8"标记。
    // 心理学：禀赋效应 — 玩家感到"我的持仓数据是我的经验资产"。
    // ========================================================================
    {
      id: "e822_invest_data_v8",
      phase: "street",
      icon: "🔬",
      title: "持仓数据，是一座待挖掘的金矿",
      story: "你打开持仓列表，看着各只股票的涨跌数字——\n\n这些数据背后，藏着市场的规律。如果能系统性地分析持仓数据，也许能发现一些被忽略的投资机会。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e822InvestDataDone) return false;
        if (!st.investment) return false;
        var holdings = st.investment.stockHoldings || [];
        return holdings.length >= 3 && st.player.day >= 200;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 系统性分析持仓数据",
          hint: "智力+25, 会计XP+30, 置_e822InvestDataAsset",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e822InvestDataDone = true;
            st.flags._e822InvestDataAsset = true;
            // 计算持仓集中度（最大持仓占比）
            var inv = st.investment;
            var holdings = inv.stockHoldings || [];
            var market = inv.stockMarket || {};
            var total = 0, maxVal = 0;
            for (var i = 0; i < holdings.length; i++) {
              var h = holdings[i];
              var m = market[h.symbol];
              var val = m && isFinite(m.price) && isFinite(h.shares) ? m.price * h.shares : 0;
              total += val;
              if (val > maxVal) maxVal = val;
            }
            st.flags._e822ConcentrationRatio = total > 0 ? Math.round(maxVal / total * 100) : 0;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 25);
            grantXp("accounting", 30);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 持仓数据分析完成。集中度:" + (st.flags._e822ConcentrationRatio || 0) + "%。智力+25, 会计XP+30。", "success");
            }
          }
        },
        {
          text: "📝 简单记录一下趋势",
          hint: "心智+5, 会计XP+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e822InvestDataDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 简单记录了一下持仓趋势。心智+5, 会计XP+10。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: E→B 投资叙事v8 — 重大投资事件触发人生故事回响
    // 设计意图：投资中的重大决策应成为人生叙事的一部分，强化沉浸感。
    // 本事件在玩家持有时间最长的投资标的达到一定天数时触发。
    // 心理学：峰终定律 — 长期持有的过程本身就是一个值得讲述的故事。
    // ========================================================================
    {
      id: "e822_invest_narrative_v8",
      phase: "street",
      icon: "📖",
      title: "投资路上，有故事可说",
      story: "你翻看交易记录，发现有一笔投资已经持有了很久。\n\n从买入的那天到现在，市场涨涨跌跌，你经历了无数次想卖出的冲动，但最终坚持了下来。这段经历，值得记录下来。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e822InvestNarrativeDone) return false;
        if (!st.investment) return false;
        var holdings = st.investment.stockHoldings || [];
        if (holdings.length === 0) return false;
        if (!st.investment.tradeLog) return false;
        // 找最早买入的标的是否持有超过100天
        for (var i = 0; i < holdings.length; i++) {
          var h = holdings[i];
          // 遍历交易日志找首次买入
          for (var j = 0; j < st.investment.tradeLog.length; j++) {
            var t = st.investment.tradeLog[j];
            if (t.symbol === h.symbol && t.type === "buy") {
              var daysHeld = st.player.day - (t.day || 0);
              if (daysHeld >= 100) return true;
              break;
            }
          }
        }
        return false;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📖 写下这段投资故事",
          hint: "心智+25, 魅力+15, 置_e822InvestStory",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e822InvestNarrativeDone = true;
            st.flags._e822InvestStory = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 投资故事写完了——每一笔交易背后,都是一个人生片段。心智+25, 魅力+15。", "success");
            }
          }
        },
        {
          text: "🤫 默默记在心里",
          hint: "心智+8, 心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e822InvestNarrativeDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤫 有些故事,适合自己慢慢回味。心智+8, 心情+5。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: E→G 财富健康v8 — 投资组合健康度反馈生命质量
    // 设计意图：投资组合的多样性+稳定性应反馈为生命质量评分。
    // 本事件在玩家组合多样性≥2且总资产≥¥20万时触发。
    // 心理学：认知负荷 — 多样性降低风险感知，提升心理安全感。
    // ========================================================================
    {
      id: "e822_wealth_health_v8",
      phase: "street",
      icon: "💚",
      title: "财富健康，生活质量",
      story: "你审视自己的投资组合——股票、房产、比特币……\n\n分散投资不仅降低了风险，还让你对各种经济变化有了更从容的心态。财富的真正意义，是让你能安心地活在当下。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e822WealthHealthDone) return false;
        if (!st.investment) return false;
        var pv = calcPortfolioValue(st);
        var div = calcDiversity(st);
        return pv >= 200000 && div >= 2 && st.player.day >= 150;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💚 评估财富健康度",
          hint: "健康+18, 心智+20, 会计XP+20, 置_e822WealthHealthy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e822WealthHealthDone = true;
            st.flags._e822WealthHealthy = true;
            var pv = calcPortfolioValue(st);
            var div = calcDiversity(st);
            st.flags._e822PortfolioHealth = Math.min(100, Math.round(div * 25 + (pv >= 500000 ? 20 : 10) + (pv >= 1000000 ? 15 : 0)));
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            grantXp("accounting", 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 财富健康度评估完成——多元化投资让你身心俱安。健康+18, 心智+20, 会计XP+20。", "success");
            }
          }
        },
        {
          text: "😊 有钱就行，不用评估",
          hint: "心情+8, 置_e822WealthEasy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e822WealthHealthDone = true;
            st.flags._e822WealthEasy = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 有钱就有底气。心情+8。", "info");
            }
          }
        }
      ]
    }
  ];

  // ---- 注入全局 RANDOM_EVENTS（去重） ----
  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();