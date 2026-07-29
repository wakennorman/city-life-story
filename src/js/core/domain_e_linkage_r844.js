/**
 * 域E(经济/投资) 联动增强 R844
 * 全系统优化·Domain E 第七十一轮循环
 *
 * 【联动增强3项】
 *   1. E→A 投资数据沉淀v10 — 投资经验转化为数值数据资产
 *   2. E→B 投资故事叙事v10 — 投资事件触发叙事回响
 *   3. E→G 财富健康v10 — 经济数据反馈为生命质量
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR844Loaded) return;
  RANDOM_EVENTS._domainELinkageR844Loaded = true;

  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "e844_invest_data_v10",
      phase: "street",
      icon: "📊",
      title: "交易记录，是一座数据金矿",
      story: "你翻了翻交易记录——买入、卖出、盈亏、持仓……这些看似枯燥的数字，实际上记录了你的每一次决策和结果。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e844InvestDataDone) return false;
        if (!st.investment) return false;
        var _log = st.investment.tradeLog || [];
        return _log.length >= 60 && st.player.day >= 350;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 分析我的交易数据",
          hint: "智力+26, 会计XP+30, 置_e844InvestDataAsset",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e844InvestDataDone = true;
            st.flags._e844InvestDataAsset = true;
            var _log = st.investment.tradeLog || [];
            var _wins = 0, _total = _log.length;
            for (var _i = 0; _i < _total; _i++) {
              if ((_log[_i].pnl || 0) > 0) _wins++;
            }
            st.flags._e844TradeWinRate = _total > 0 ? Math.round(_wins / _total * 100) : 0;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 26);
            grantXp("accounting", 30);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 交易数据分析完成。胜率:" + (st.flags._e844TradeWinRate || 0) + "%。智力+26, 会计XP+30。", "success");
            }
          }
        },
        {
          text: "😅 交易记录没什么好看的",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e844InvestDataDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 交易记录没什么好看的。心智+5。", "info");
            }
          }
        }
      ]
    },
    {
      id: "e844_invest_story_v10",
      phase: "street",
      icon: "📖",
      title: "这笔交易，值得记一辈子",
      story: "你盯着账户里的数字——这一笔，赚/亏了你平时几个月的工资。不管结果如何，这一刻你永远记得：市场的残酷与魅力，都在这一笔交易中体现得淋漓尽致。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e844InvestStoryDone) return false;
        if (!st.investment) return false;
        var _log = st.investment.tradeLog || [];
        for (var _i = 0; _i < _log.length; _i++) {
          var _pnl = _log[_i].pnl || 0;
          if (_pnl >= 30000 || _pnl <= -20000) return true;
        }
        var _totalProfit = st.investment._totalInvestmentProfit || 0;
        return _totalProfit >= 120000 || _totalProfit <= -60000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📖 记录这笔交易的故事",
          hint: "心智+26, 魅力+20, 置_e844InvestStory",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e844InvestStoryDone = true;
            st.flags._e844InvestStory = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 26);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 20);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 这笔交易的故事，值得记一辈子。心智+26, 魅力+20。", "success");
            }
          }
        },
        {
          text: "😊 过去就过去了",
          hint: "心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e844InvestStoryDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 过去就过去了。心情+5。", "info");
            }
          }
        }
      ]
    },
    {
      id: "e844_wealth_health_v10",
      phase: "street",
      icon: "💚",
      title: "财富健康，生命才有质量",
      story: "你算了算——总资产突破了六十万。存款、投资、房产……这些数字背后，是你在这座城市里一点一滴的积累。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e844WealthHealthDone) return false;
        if (!st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return _total >= 600000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💚 评估财富健康度",
          hint: "心智+26, 会计XP+30, 置_e844WealthHealthy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e844WealthHealthDone = true;
            st.flags._e844WealthHealthy = true;
            var _debt = (st.resources.villageDebt || 0) + (st.resources.fineDebt || 0) + (st.resources.bankDebt || 0);
            var _assets = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
            st.flags._e844DebtToAssetRatio = _assets > 0 ? Math.round(_debt / _assets * 100) / 100 : 0;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 26);
            grantXp("accounting", 30);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 财富健康度评估完成——心智+26, 会计XP+30。", "success");
            }
          }
        },
        {
          text: "😅 有钱就行，不用评估",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e844WealthHealthDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 有钱就行。心智+3。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();