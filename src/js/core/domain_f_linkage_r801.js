/*
 * 城市浮生记 — 域F(UI/UX) 联动增强 R801
 * 全系统优化·Domain F 第六十轮循环
 *
 * 【联动增强3项】
 *   1. F→A 数据可视化增强 — UI层展示数值平衡数据(价格趋势/行业热度)
 *   2. F→B 事件记忆墙 — UI层展示历史事件回顾+叙事回响
 *   3. F→E 财务仪表盘 — UI层展示投资组合+收益曲线
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR801Loaded) return;
  RANDOM_EVENTS._domainFLinkageR801Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: F→A 数据可视化增强 — UI层展示数值平衡数据
    // 设计意图：数值域的数据(价格/行业/供需)应在UI层有可视化展示入口。
    // 本事件在玩家生存≥60天时触发，给予"数据觉醒"标记。
    // 心理学：认知负荷 — 可视化降低信息处理负担。
    // ========================================================================
    {
      id: "f801_data_visualization",
      phase: "street",
      icon: "📊",
      title: "数据可视化，让数字说话",
      story: "你打开数据面板——价格曲线、行业热度、供需状态……\n\n这些数字不再枯燥，它们变成了图表、颜色、趋势线。\n\n原来，数据也可以很美。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f801DataVizDone) return false;
        return st.player.day >= 60;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📊 启用数据可视化",
          hint: "智力+5, 会计XP+8, 置_f801DataViz",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f801DataVizDone = true;
            st.flags._f801DataViz = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            grantXp("accounting", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据可视化启用——智力+5, 会计XP+8。让数字说话。", "success");
            }
          }
        },
        {
          text: "😅 数字看看就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f801DataVizDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 数字看看就行，不必太认真。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: F→B 事件记忆墙 — UI层展示历史事件回顾
    // 设计意图：玩家经历的事件应在UI层有"记忆墙"展示，强化叙事体验。
    // 本事件在玩家经历≥15个事件时触发，给予"记忆墙"标记。
    // 心理学：峰终定律 — 回顾美好时刻产生积极情绪。
    // ========================================================================
    {
      id: "f801_event_memory_wall",
      phase: "street",
      icon: "🖼️",
      title: "记忆墙上的故事",
      story: "你打开记忆墙——那些经历过的事件，像照片一样排列在眼前。\n\n有欢笑，有泪水，有抉择，有后果。\n\n每一个故事，都是你在这座城市里的足迹。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f801MemoryWallDone) return false;
        var _eventCount = st.flags._eventCount || 0;
        return _eventCount >= 15;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🖼️ 回顾我的故事",
          hint: "心情+10, 心智+5, 置_f801MemoryWall",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f801MemoryWallDone = true;
            st.flags._f801MemoryWall = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🖼️ 记忆墙上的故事——心情+10, 心智+5。这些都是你的人生。", "success");
            }
          }
        },
        {
          text: "😊 向前看，不回头",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f801MemoryWallDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 向前看，不回头。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: F→E 财务仪表盘 — UI层展示投资组合+收益曲线
    // 设计意图：投资数据应在UI层有直观的仪表盘展示。
    // 本事件在玩家持有≥2个不同标的且总资产≥¥3万时触发。
    // 心理学：禀赋效应 — 看到自己的投资成果产生满足感。
    // ========================================================================
    {
      id: "f801_finance_dashboard",
      phase: "street",
      icon: "💰",
      title: "你的财务仪表盘",
      story: "你打开财务仪表盘——投资组合、收益曲线、盈亏比例……\n\n所有数据一目了然。你终于看清了自己的财务状况：资产多少、负债多少、净值为多少。\n\n清晰的财务认知，是财务自由的第一步。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f801FinanceDashDone) return false;
        if (!st.investment || !st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        var _holdings = st.investment.stockHoldings || [];
        var _stockCount = 0;
        for (var _s in _holdings) { if (_holdings[_s] && _holdings[_s].shares > 0) _stockCount++; }
        var _types = _stockCount + (st.investment.btcHoldings > 0 ? 1 : 0) + (st.investment.properties.length > 0 ? 1 : 0);
        return _types >= 2 && _total >= 30000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 查看财务仪表盘",
          hint: "智力+8, 会计XP+10, 置_f801FinanceDash",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f801FinanceDashDone = true;
            st.flags._f801FinanceDash = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 财务仪表盘已启用——智力+8, 会计XP+10。", "success");
            }
          }
        },
        {
          text: "😅 大概知道就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f801FinanceDashDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 大概知道就行。心智+3。", "info");
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
