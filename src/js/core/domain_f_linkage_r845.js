/**
 * 域F(UI/UX) 联动增强 R845
 * 全系统优化·Domain F 第七十二轮循环
 *
 * 【联动增强3项】
 *   1. F→A 数据可视化v12 — UI数据消费转化为数值洞察资产
 *   2. F→B 事件记忆墙v12 — UI事件历史触发叙事回响
 *   3. F→E 财务仪表盘v12 — UI财务数据反馈为投资洞察
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR845Loaded) return;
  RANDOM_EVENTS._domainFLinkageR845Loaded = true;

  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "f845_data_viz_v12",
      phase: "street",
      icon: "📊",
      title: "数据可视化，洞察先机",
      story: "你盯着各种数据面板——价格走势、资产分布、技能雷达……这些图表把枯燥的数字变成了直观的图形。你发现，当数据变得可视化，决策也变得更容易了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f845DataVizDone) return false;
        return st.player.day >= 180;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 深入分析可视化数据",
          hint: "智力+26, 会计XP+32, 置_f845DataVizInsight",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f845DataVizDone = true;
            st.flags._f845DataVizInsight = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 26);
            grantXp("accounting", 32);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据可视化分析完成——智力+26, 会计XP+32。", "success");
            }
          }
        },
        {
          text: "📝 简单记下关键数字",
          hint: "心智+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f845DataVizDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 记下了几个关键数字。心智+8。", "info");
            }
          }
        }
      ]
    },
    {
      id: "f845_event_memory_v12",
      phase: "street",
      icon: "📖",
      title: "记忆墙，人生回放",
      story: "你在事件日志里翻看过去的记录——那些曾经让你开心、难过、紧张、兴奋的瞬间，现在都变成了文字，静静地躺在记忆墙上。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f845EventMemoryDone) return false;
        return st.player.day >= 300;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📖 翻阅记忆墙，写下感悟",
          hint: "心智+28, 魅力+22, 置_f845EventMemory",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f845EventMemoryDone = true;
            st.flags._f845EventMemory = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 28);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 22);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 记忆墙上每一行字,都是你走过的路。心智+28, 魅力+22。", "success");
            }
          }
        },
        {
          text: "😊 回味一下就好",
          hint: "心情+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f845EventMemoryDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 过去的就让它过去吧。心情+10。", "info");
            }
          }
        }
      ]
    },
    {
      id: "f845_finance_dashboard_v12",
      phase: "street",
      icon: "💰",
      title: "财务仪表盘，看清钱袋子",
      story: "你打开财务仪表盘——收入、支出、储蓄、投资……一张图看清你所有的钱。你发现，当财务数据以可视化的方式呈现时，那些模糊的焦虑变成了清晰的数字。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f845FinanceDashboardDone) return false;
        if (!st.resources) return false;
        var cash = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return cash >= 120000 && st.player.day >= 150;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 深度分析财务数据",
          hint: "会计XP+35, 智力+24, 置_f845FinanceDashboard",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f845FinanceDashboardDone = true;
            st.flags._f845FinanceDashboard = true;
            if (st.resources) {
              var income = st.flags._dailyIncome || 0;
              var expense = st.flags._dailyExpense || 0;
              st.flags._f845SaveRatio = (income > 0 && isFinite(income) && isFinite(expense))
                ? Math.round((1 - expense / income) * 100) : 0;
            }
            grantXp("accounting", 35);
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 24);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 财务仪表盘分析完成——储蓄率约" + (st.flags._f845SaveRatio || 0) + "%。会计XP+35, 智力+24。", "success");
            }
          }
        },
        {
          text: "😅 知道有钱就行",
          hint: "心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f845FinanceDashboardDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 有钱就行。心情+5。", "info");
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