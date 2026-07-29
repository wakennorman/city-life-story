/*
 * 城市浮生记 — 域A(数据/数值平衡) 联动增强 R811
 * 全系统优化·Domain A 第十四轮循环
 *
 * 【联动增强3项】
 *   1. A→F 价格预警UI — 价格数据在UI层的预警展示
 *   2. A→B 价格波动叙事 — 价格异常触发事件叙事
 *   3. A→E 通胀投资觉醒 — 通胀数据引导投资决策
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR811Loaded) return;
  RANDOM_EVENTS._domainALinkageR811Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: A→F 价格预警UI — 价格数据在UI层的预警展示
    // 设计意图：价格异常应在UI层有预警提示，让玩家感到"数据在说话"。
    // 本事件在玩家发现≥2个商品价格异常时触发，给予"价格预警"标记。
    // 心理学：认知负荷 — 预警系统降低玩家信息处理负担。
    // ========================================================================
    {
      id: "a811_price_warning_ui",
      phase: "street",
      icon: "⚠️",
      title: "价格预警：有些商品正在异动",
      story: "你打开价格预警面板——系统标记了几个价格异常的商品。\n\n有的暴涨，有的暴跌。这些数据在告诉你：机会和风险并存。\n\n听懂数据的声音，才能先人一步。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a811PriceWarnDone) return false;
        if (!st.trade || !st.trade.priceIndex) return false;
        var _anomalies = 0;
        var _pi = st.trade.priceIndex;
        for (var _g in _pi) {
          if (isFinite(_pi[_g]) && (_pi[_g] > 1.5 || _pi[_g] < 0.5)) _anomalies++;
        }
        return _anomalies >= 2;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "⚠️ 关注价格预警",
          hint: "智力+5, 会计XP+8, 置_a811PriceWatcher",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a811PriceWarnDone = true;
            st.flags._a811PriceWatcher = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            grantXp("accounting", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("⚠️ 价格预警已启用——智力+5, 会计XP+8。听懂数据的声音，才能先人一步。", "success");
            }
          }
        },
        {
          text: "😅 价格波动正常",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a811PriceWarnDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 价格波动正常，不必在意。心智+2。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: A→B 价格波动叙事 — 价格异常触发事件叙事
    // 设计意图：价格异常应产生叙事回响，让玩家感到"市场在说话"。
    // 本事件在玩家经历≥3次价格异常事件时触发，给予"市场感知"标记。
    // 心理学：峰终定律 — 极端价格时刻成为记忆锚点。
    // ========================================================================
    {
      id: "a811_price_volatility_narrative",
      phase: "street",
      icon: "📈",
      title: "市场在说话，你听懂了吗？",
      story: "最近市场价格波动剧烈——有人赚得盆满钵满，有人亏得血本无归。\n\n你开始意识到：市场不是随机的，它有自己的语言。\n\n听懂市场的人，才能驾驭市场。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a811VolatilityDone) return false;
        var _volEvents = st.flags._priceVolatilityCount || 0;
        return _volEvents >= 3 && st.player.day >= 90;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📈 学习读懂市场语言",
          hint: "智力+8, 置_a811MarketSense",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a811VolatilityDone = true;
            st.flags._a811MarketSense = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 你开始学习读懂市场语言——智力+8。", "success");
            }
          }
        },
        {
          text: "😅 市场太复杂了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a811VolatilityDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 市场太复杂了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: A→E 通胀投资觉醒 — 通胀数据引导投资决策
    // 设计意图：通胀数据应引导玩家关注投资，形成"数据→投资"决策链。
    // 本事件在通胀指数≥1.25且玩家总资产≥¥3万时触发。
    // 心理学：损失厌恶 — 玩家更害怕资产贬值。
    // ========================================================================
    {
      id: "a811_inflation_invest_awakening",
      phase: "street",
      icon: "💰",
      title: "通胀在吞噬你的存款",
      story: "你算了算——银行利息跑不赢通胀，存款每年都在悄悄缩水。\n\n「钱放着不动就贬值」——这不再是一句话，而是你正在经历的事实。\n\n是时候让钱为你工作了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a811InflationDone) return false;
        if (!st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        if (_total < 30000) return false;
        var _era = st._eraState;
        return _era && isFinite(_era.inflationIndex) && _era.inflationIndex >= 1.25;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 学习抗通胀投资",
          hint: "智力+8, 会计XP+10, 置_a811InflationAware",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a811InflationDone = true;
            st.flags._a811InflationAware = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 你开始学习抗通胀投资——智力+8, 会计XP+10。", "success");
            }
          }
        },
        {
          text: "😅 存银行最安全",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a811InflationDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 存银行最安全。心智+3。", "info");
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
