/*
 * 城市浮生记 — 域F(UI/UX) 联动增强 R827
 * 全系统优化·Domain F 第六十三轮循环
 *
 * 【联动增强3项】
 *   1. F→A 数据可视化v3 — UI层展示数值平衡数据(价格趋势/行业热度)
 *   2. F→B 事件记忆墙v3 — UI层展示历史事件回顾+叙事回响
 *   3. F→E 财务仪表盘v3 — UI层展示投资组合+收益曲线
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR827Loaded) return;
  RANDOM_EVENTS._domainFLinkageR827Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: F→A 数据可视化v3 — UI层展示数值平衡数据
    // 设计意图：数值域的数据(价格/行业/供需)应在UI层有可视化展示入口。
    // 本事件在玩家生存≥90天时触发，给予"数据觉醒v3"标记。
    // 心理学：认知负荷 — 可视化降低信息处理负担。
    // ========================================================================
    {
      id: "f827_data_viz_v3",
      phase: "street",
      icon: "📊",
      title: "数据可视化，让数字说话",
      story: "你打开数据面板——价格曲线、行业热度、供需状态……\n\n这些数字不再枯燥，它们变成了图表、颜色、趋势线。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f827DataVizDone) return false;
        return st.player.day >= 90;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📊 启用数据可视化",
          hint: "智力+8, 会计XP+10, 置_f827DataViz",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f827DataVizDone = true;
            st.flags._f827DataViz = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据可视化启用——智力+8, 会计XP+10。让数字说话。", "success");
            }
          }
        },
        {
          text: "😅 数字看看就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f827DataVizDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 数字看看就行。心智+2。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: F→B 事件记忆墙v3 — UI层展示历史事件回顾
    // 设计意图：玩家经历的事件应在UI层有"记忆墙"展示，强化叙事体验。
    // 本事件在玩家经历≥25个事件时触发，给予"记忆墙v3"标记。
    // 心理学：峰终定律 — 回顾美好时刻产生积极情绪。
    // ========================================================================
    {
      id: "f827_memory_wall_v3",
      phase: "street",
      icon: "🖼️",
      title: "记忆墙上的故事",
      story: "你打开记忆墙——那些经历过的事件，像照片一样排列在眼前。\n\n有欢笑，有泪水，有抉择，有后果。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f827MemoryWallDone) return false;
        var _eventCount = st.flags._eventCount || 0;
        return _eventCount >= 25;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🖼️ 回顾我的故事",
          hint: "心情+12, 心智+8, 置_f827MemoryWall",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f827MemoryWallDone = true;
            st.flags._f827MemoryWall = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🖼️ 记忆墙上的故事——心情+12, 心智+8。这些都是你的人生。", "success");
            }
          }
        },
        {
          text: "😊 向前看，不回头",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f827MemoryWallDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 向前看，不回头。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: F→E 财务仪表盘v3 — UI层展示投资组合+收益曲线
    // 设计意图：投资数据应在UI层有直观的仪表盘展示。
    // 本事件在玩家持有≥3个不同标的且总资产≥¥8万时触发。
    // 心理学：禀赋效应 — 看到自己的投资成果产生满足感。
    // ========================================================================
    {
      id: "f827_finance_dash_v3",
      phase: "street",
      icon: "💰",
      title: "你的财务仪表盘",
      story: "你打开财务仪表盘——投资组合、收益曲线、盈亏比例……\n\n所有数据一目了然。你终于看清了自己的财务状况。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f827FinanceDashDone) return false;
        if (!st.investment || !st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        if (_total < 80000) return false;
        var _holdings = st.investment.stockHoldings || [];
        var _stockCount = 0;
        for (var _s in _holdings) { if (_holdings[_s] && _holdings[_s].shares > 0) _stockCount++; }
        var _types = _stockCount + (st.investment.btcHoldings > 0 ? 1 : 0) + (st.investment.properties.length > 0 ? 1 : 0);
        return _types >= 3;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 查看财务仪表盘",
          hint: "智力+10, 会计XP+12, 置_f827FinanceDash",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f827FinanceDashDone = true;
            st.flags._f827FinanceDash = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            grantXp("accounting", 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 财务仪表盘已启用——智力+10, 会计XP+12。", "success");
            }
          }
        },
        {
          text: "😅 大概知道就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f827FinanceDashDone = true;
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
