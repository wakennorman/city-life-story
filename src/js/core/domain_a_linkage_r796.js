/*
 * 城市浮生记 — 域A(数据/数值平衡) 联动增强 R796
 * 全系统优化·Domain A 第十二轮循环
 *
 * 【联动增强3项】
 *   1. A→E 数据驱动定价 — 市场供需数据引导投资决策
 *   2. A→H 数据资产→公司KPI — 个人数据积累转化为公司运营加成
 *   3. A→B 价格异常叙事 — 市场数据异常触发事件叙事
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR796Loaded) return;
  RANDOM_EVENTS._domainALinkageR796Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: A→E 数据驱动定价 — 市场供需数据引导投资决策
    // 设计意图：pricing.js 已追踪供需状态，但缺少"用数据指导投资"的叙事层。
    // 本事件在玩家发现某商品低价时触发，引导玩家关注市场数据。
    // 心理学：禀赋效应 — 玩家感到"数据是我的竞争优势"。
    // ========================================================================
    {
      id: "a796_data_driven_pricing",
      phase: "street",
      icon: "📉",
      title: "数据告诉你什么时候该买",
      story: "你路过批发市场，发现某样商品的进货价跌到了近期最低点。\n\n别人看到的是「便宜」，你看到的是——供需曲线在底部，行业热度即将回升。\n\n数据不会说谎，但需要有人读懂它。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a796DataPricingDone) return false;
        if (!st.trade || !st.trade.priceIndex) return false;
        // 发现至少一个商品处于低价位(<0.7)
        var _pi = st.trade.priceIndex;
        for (var _g in _pi) {
          if (isFinite(_pi[_g]) && _pi[_g] < 0.7) return true;
        }
        return false;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 记录这个数据，等待回升",
          hint: "智力+5, 会计XP+8, 置_a796DataTrader",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a796DataPricingDone = true;
            st.flags._a796DataTrader = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            grantXp("accounting", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📉 你学会了用数据指导交易——智力+5, 会计XP+8。", "success");
            }
          }
        },
        {
          text: "😅 便宜就买，想那么多干嘛",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a796DataPricingDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 便宜就买，简单直接。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: A→H 数据资产→公司KPI — 个人数据积累转化为公司运营加成
    // 设计意图：玩家积累的市场数据(价格/供需/行业)应能反哺公司运营。
    // 本事件在corporate阶段且玩家拥有"dataTrader"类标记时触发。
    // 心理学：禀赋效应 — 玩家感到数据积累没有白费。
    // ========================================================================
    {
      id: "a796_data_to_corporate",
      phase: "corporate",
      icon: "🏢",
      title: "你的数据资产，公司的竞争优势",
      story: "公司开会讨论市场策略，你拿出了过去几个月积累的价格数据和行业分析。\n\n团队沉默了——这些数据，比任何市场调研都值钱。\n\n「这些数据是哪来的？」有人问。你笑了笑：「我自己跑的。」",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a796DataCorpDone) return false;
        if (st.player.phase !== "corporate") return false;
        // 拥有数据交易类标记
        return st.flags && (st.flags._a796DataTrader || st.flags._a794MarketSense || st.flags._dataInvestorMindset);
      },
      probability: 0.08,
      repeatable: false,
      choices: [
        {
          text: "📊 用数据为公司制定策略",
          hint: "KPI+10, 管理XP+10, 置_a796DataDrivenCorp",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a796DataCorpDone = true;
            st.flags._a796DataDrivenCorp = true;
            if (st.player && st.player.corporate) {
              st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 0) + 10);
            }
            grantXp("management", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据驱动的公司策略——KPI+10, 管理XP+10。", "success");
            }
          }
        },
        {
          text: "🤝 数据只是参考，经验更重要",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a796DataCorpDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 数据是工具，经验是判断。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: A→B 价格异常叙事 — 市场数据异常触发事件叙事
    // 设计意图：市场数据异常(暴涨/暴跌)应产生叙事回响，让玩家感受到"数据在说话"。
    // 本事件在价格指数>1.5(暴涨)或<0.5(暴跌)时触发。
    // 心理学：峰终定律 — 极端数据时刻应成为玩家记忆锚点。
    // ========================================================================
    {
      id: "a796_price_anomaly_narrative",
      phase: "street",
      icon: "⚡",
      title: "市场在尖叫",
      story: "你打开价格面板——某个商品的价格指数飙升到了" + "{value}" + "。\n\n这不是正常波动。有人在囤货？还是供应链出了问题？\n\n市场不会无缘无故尖叫。听懂它的人，先人一步。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a796AnomalyDone) return false;
        if (!st.trade || !st.trade.priceIndex) return false;
        var _pi = st.trade.priceIndex;
        for (var _g in _pi) {
          if (isFinite(_pi[_g]) && (_pi[_g] > 1.5 || _pi[_g] < 0.5)) return true;
        }
        return false;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "⚡ 调查异常原因",
          hint: "智力+8, 置_a796AnomalyHunter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a796AnomalyDone = true;
            st.flags._a796AnomalyHunter = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("⚡ 你开始调查市场异常——智力+8。机会藏在混乱中。", "success");
            }
          }
        },
        {
          text: "😅 市场波动正常，不管它",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a796AnomalyDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 市场总有波动，不必大惊小怪。", "info");
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
