/*
 * 城市浮生记 — 域E(经济/投资) 联动增强 R800
 * 全系统优化·Domain E 第六十二轮循环
 *
 * 【联动增强3项】
 *   1. E→A 投资数据沉淀 — 投资经验转化为数值平衡数据资产
 *   2. E→B 投资故事叙事 — 投资事件触发叙事回响
 *   3. E→D 投资者社交 — 投资圈层拓展NPC关系
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR800Loaded) return;
  RANDOM_EVENTS._domainELinkageR800Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: E→A 投资数据沉淀 — 投资经验转化为数值平衡数据资产
    // 设计意图：投资过程中积累的数据(交易记录/盈亏)应成为数值域可消费的资产。
    // 本事件在玩家完成≥10笔交易时触发，给予"投资数据资产"标记。
    // 心理学：禀赋效应 — 玩家感到"我的交易记录是我的经验"。
    // ========================================================================
    {
      id: "e800_invest_data_asset",
      phase: "street",
      icon: "📊",
      title: "你的交易记录，是一座数据金矿",
      story: "你翻了翻交易记录——买入、卖出、盈亏、持仓……\n\n这些看似枯燥的数字，实际上记录了你的每一次决策和结果。\n\n数据分析师管这叫「行为金融数据」，但你管它叫「花钱买的经验」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e800InvestDataDone) return false;
        if (!st.investment) return false;
        var _log = st.investment.tradeLog || [];
        return _log.length >= 10 && st.player.day >= 60;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 分析我的交易数据",
          hint: "智力+8, 会计XP+10, 置_e800InvestDataAsset",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e800InvestDataDone = true;
            st.flags._e800InvestDataAsset = true;
            // 计算交易数据统计供A域消费
            var _log = st.investment.tradeLog || [];
            var _wins = 0, _total = _log.length;
            for (var _i = 0; _i < _total; _i++) {
              if ((_log[_i].pnl || 0) > 0) _wins++;
            }
            st.flags._e800TradeWinRate = _total > 0 ? Math.round(_wins / _total * 100) : 0;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 交易数据分析完成。胜率：" + st.flags._e800TradeWinRate + "%。智力+8, 会计XP+10。", "success");
            }
          }
        },
        {
          text: "😅 交易记录没什么好看的",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e800InvestDataDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 交易记录没什么好看的。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: E→B 投资故事叙事 — 投资事件触发叙事回响
    // 设计意图：投资中的重大事件(大赚/大亏)应产生叙事回响，成为人生故事的一部分。
    // 本事件在单笔盈利≥¥5000或亏损≥¥3000时触发。
    // 心理学：峰终定律 — 重大盈亏时刻成为人生记忆锚点。
    // ========================================================================
    {
      id: "e800_invest_story_narrative",
      phase: "street",
      icon: "📖",
      title: "这笔交易，值得记一辈子",
      story: "你盯着账户里的数字——这一笔，赚/亏了你平时几个月的工资。\n\n不管结果如何，这一刻你永远记得：市场的残酷与魅力，都在这一笔交易中体现得淋漓尽致。\n\n这是你投资生涯的「标志性时刻」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e800InvestStoryDone) return false;
        if (!st.investment) return false;
        // 检查是否有大盈亏交易
        var _log = st.investment.tradeLog || [];
        for (var _i = 0; _i < _log.length; _i++) {
          var _pnl = _log[_i].pnl || 0;
          if (_pnl >= 5000 || _pnl <= -3000) return true;
        }
        // 或者总投资盈亏超过阈值
        var _totalProfit = st.investment._totalInvestmentProfit || 0;
        return _totalProfit >= 20000 || _totalProfit <= -10000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📖 记录这笔交易的故事",
          hint: "心智+8, 置_e800InvestStory",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e800InvestStoryDone = true;
            st.flags._e800InvestStory = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 这笔交易的故事，值得记一辈子。心智+8。", "success");
            }
          }
        },
        {
          text: "😊 过去就过去了",
          hint: "心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e800InvestStoryDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 过去就过去了。心情+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: E→D 投资者社交 — 投资圈层拓展NPC关系
    // 设计意图：投资活动应带来社交机会，让玩家感到"投资圈有人脉"。
    // 本事件在玩家持有≥3个不同标的时触发，给予"投资者圈子"标记。
    // 心理学：社会认同 — 被同类人认同的满足感。
    // ========================================================================
    {
      id: "e800_investor_social_circle",
      phase: "street",
      icon: "🤝",
      title: "投资路上，你并不孤单",
      story: "你在投资交流会上遇到了几个志同道合的人——大家都在讨论市场、分析数据、分享经验。\n\n原来，投资路上还有这么多同行者。你们交换了联系方式，约好下次一起复盘。\n\n投资不只是数字游戏，更是一个圈子。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e800InvestorSocialDone) return false;
        if (!st.investment) return false;
        // 持有≥3个不同标的
        var _holdings = st.investment.stockHoldings || [];
        var _stockCount = 0;
        for (var _s in _holdings) { if (_holdings[_s] && _holdings[_s].shares > 0) _stockCount++; }
        var _types = _stockCount + (st.investment.btcHoldings > 0 ? 1 : 0) + (st.investment.properties.length > 0 ? 1 : 0);
        return _types >= 3 && st.player.day >= 45;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🤝 加入投资者圈子",
          hint: "魅力+5, 社交XP+8, 置_e800InvestorCircle",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e800InvestorSocialDone = true;
            st.flags._e800InvestorCircle = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
            grantXp("social", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 你加入了投资者圈子——魅力+5, 社交XP+8。", "success");
            }
          }
        },
        {
          text: "😊 独自投资更自在",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e800InvestorSocialDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 独自投资更自在。心智+3。", "info");
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
