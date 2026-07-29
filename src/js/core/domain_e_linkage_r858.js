/*
 * 城市浮生记 — 域E(经济/投资) 联动增强 R858
 * 全系统优化·Domain E 第六十八轮循环
 *
 * 【联动增强3项】
 *   1. E→A 投资数据沉淀v6 — 投资经验转化为数值平衡数据资产
 *   2. E→B 投资故事叙事v6 — 投资事件触发叙事回响
 *   3. E→G 财富健康v6 — 经济数据反馈为生命质量
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR858Loaded) return;
  RANDOM_EVENTS._domainELinkageR858Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: E→A 投资数据沉淀v6 — 投资经验转化为数值平衡数据资产
    // 设计意图：投资过程中积累的数据应成为数值域可消费的资产。
    // 本事件在玩家完成≥35笔交易时触发，给予"投资数据资产v6"标记。
    // 心理学：禀赋效应 — 玩家感到"我的交易记录是我的经验"。
    // ========================================================================
    {
      id: "e858_invest_data_v6",
      phase: "street",
      icon: "📊",
      title: "你的交易记录，是一座数据金矿",
      story: "你翻了翻交易记录——买入、卖出、盈亏、持仓……\n\n这些看似枯燥的数字，实际上记录了你的每一次决策和结果。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e858InvestDataDone) return false;
        if (!st.investment) return false;
        var _log = st.investment.tradeLog || [];
        return _log.length >= 35 && st.player.day >= 200;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 分析我的交易数据",
          hint: "智力+20, 会计XP+22, 置_e858InvestDataAsset",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e858InvestDataDone = true;
            st.flags._e858InvestDataAsset = true;
            var _log = st.investment.tradeLog || [];
            var _wins = 0, _total = _log.length;
            for (var _i = 0; i < _total; i++) {
              if ((_log[_i].pnl || 0) > 0) _wins++;
            }
            st.flags._e858TradeWinRate = _total > 0 ? Math.round(_wins / _total * 100) : 0;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            grantXp("accounting", 22);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 交易数据分析完成。胜率：" + st.flags._e858TradeWinRate + "%。智力+20, 会计XP+22。", "success");
            }
          }
        },
        {
          text: "😅 交易记录没什么好看的",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e858InvestDataDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 交易记录没什么好看的。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: E→B 投资故事叙事v6 — 投资事件触发叙事回响
    // 设计意图：投资中的重大事件应产生叙事回响，成为人生故事的一部分。
    // 本事件在单笔盈利≥¥18000或亏损≥¥12000时触发。
    // 心理学：峰终定律 — 重大盈亏时刻成为人生记忆锚点。
    // ========================================================================
    {
      id: "e858_invest_story_v6",
      phase: "street",
      icon: "📖",
      title: "这笔交易，值得记一辈子",
      story: "你盯着账户里的数字——这一笔，赚/亏了你平时几个月的工资。\n\n不管结果如何，这一刻你永远记得：市场的残酷与魅力，都在这一笔交易中体现得淋漓尽致。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e858InvestStoryDone) return false;
        if (!st.investment) return false;
        var _log = st.investment.tradeLog || [];
        for (var _i = 0; i < _log.length; i++) {
          var _pnl = _log[_i].pnl || 0;
          if (_pnl >= 18000 || _pnl <= -12000) return true;
        }
        var _totalProfit = st.investment._totalInvestmentProfit || 0;
        return _totalProfit >= 70000 || _totalProfit <= -35000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📖 记录这笔交易的故事",
          hint: "心智+20, 置_e858InvestStory",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e858InvestStoryDone = true;
            st.flags._e858InvestStory = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 这笔交易的故事，值得记一辈子。心智+20。", "success");
            }
          }
        },
        {
          text: "😊 过去就过去了",
          hint: "心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e858InvestStoryDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 过去就过去了。心情+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: E→G 财富健康v6 — 经济数据反馈为生命质量
    // 设计意图：经济数据(收支/储蓄/负债)应反馈为生命质量评分。
    // 本事件在玩家总资产≥¥35万时触发，给予"财富健康v6"标记。
    // 心理学：认知负荷 — 综合经济评分降低玩家信息处理负担。
    // ========================================================================
    {
      id: "e858_wealth_health_v6",
      phase: "street",
      icon: "💚",
      title: "财富健康，生命才有质量",
      story: "你算了算——总资产突破了三十五万。\n\n存款、投资、房产……这些数字背后，是你在这座城市里一点一滴的积累。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e858WealthHealthDone) return false;
        if (!st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return _total >= 350000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💚 评估财富健康度",
          hint: "心智+20, 会计XP+22, 置_e858WealthHealthy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e858WealthHealthDone = true;
            st.flags._e858WealthHealthy = true;
            var _debt = (st.resources.villageDebt || 0) + (st.resources.fineDebt || 0) + (st.resources.bankDebt || 0);
            var _assets = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
            st.flags._e858DebtToAssetRatio = _assets > 0 ? Math.round(_debt / _assets * 100) / 100 : 0;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            grantXp("accounting", 22);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 财富健康度评估完成——心智+20, 会计XP+22。", "success");
            }
          }
        },
        {
          text: "😅 有钱就行，不用评估",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e858WealthHealthDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 有钱就行。心智+3。", "info");
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
