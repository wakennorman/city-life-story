/**
 * 域F(UI/UX) 联动增强 R823
 * 全系统优化·Domain F 第六十九轮循环
 *
 * 【联动增强3项】
 *   1. F→A 数据可视化v9 — UI数据消费转化为数值洞察资产
 *   2. F→B 事件记忆墙v9 — UI事件历史触发叙事回响
 *   3. F→E 财务仪表盘v9 — UI财务数据反馈为投资洞察
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR823Loaded) return;
  RANDOM_EVENTS._domainFLinkageR823Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: F→A 数据可视化v9 — UI数据消费转化为数值洞察资产
    // 设计意图：玩家在UI中查看数据的行为应产生可量化的洞察资产。
    // 本事件在玩家查看过多次数据面板后触发，给予"数据可视化v9"标记。
    // 心理学：认知负荷 — 数据可视化降低信息处理成本，提升决策质量。
    // ========================================================================
    {
      id: "f823_data_viz_v9",
      phase: "street",
      icon: "📊",
      title: "数据可视化，让数字会说话",
      story: "你盯着各种数据面板——价格走势、资产分布、技能雷达……\n\n这些图表把枯燥的数字变成了直观的图形。你发现，当数据变得可视化，决策也变得更容易了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f823DataVizDone) return false;
        // 玩家至少触发了3次数据面板查看（通过检查是否有足够多的知情决策）
        return st.player.day >= 100;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 深入分析可视化数据",
          hint: "智力+22, 会计XP+25, 置_f823DataVizInsight",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f823DataVizDone = true;
            st.flags._f823DataVizInsight = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 22);
            grantXp("accounting", 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据可视化分析完成——数字会说话,但图表讲得更清楚。智力+22, 会计XP+25。", "success");
            }
          }
        },
        {
          text: "📝 简单记下关键数字",
          hint: "心智+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f823DataVizDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 记下了几个关键数字。心智+8。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: F→B 事件记忆墙v9 — UI事件历史触发叙事回响
    // 设计意图：玩家在UI中回顾事件历史时，应触发叙事回响。
    // 本事件在玩家经历过足够多的事件后触发，唤醒记忆墙中的故事。
    // 心理学：峰终定律 — 汇聚的记忆墙上每一条记录都是人生故事的锚点。
    // ========================================================================
    {
      id: "f823_event_memory_v9",
      phase: "street",
      icon: "📖",
      title: "记忆墙上的故事",
      story: "你在事件日志里翻看过去的记录——\n\n那些曾经让你开心、难过、紧张、兴奋的瞬间，现在都变成了文字，静静地躺在记忆墙上。每一段文字背后，都是一个故事。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f823EventMemoryDone) return false;
        // 玩家至少经历过一些事件 (通过检查 day 推断)
        return st.player.day >= 150;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📖 翻阅记忆墙，写下感悟",
          hint: "心智+25, 魅力+15, 置_f823EventMemory",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f823EventMemoryDone = true;
            st.flags._f823EventMemory = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 记忆墙上每一行字,都是你走过的路。心智+25, 魅力+15。", "success");
            }
          }
        },
        {
          text: "😊 回味一下就好",
          hint: "心情+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f823EventMemoryDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 过去的就让它过去吧。心情+8。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: F→E 财务仪表盘v9 — UI财务数据反馈为投资洞察
    // 设计意图：玩家在财务仪表盘中查看数据，应产生投资洞察。
    // 本事件在玩家查看过财务数据后触发，给予"财务仪表盘v9"标记。
    // 心理学：社会比较 — 看到自己的财务数据可视化，激发更强的财务规划意识。
    // ========================================================================
    {
      id: "f823_finance_dashboard_v9",
      phase: "street",
      icon: "💰",
      title: "财务仪表盘，看清你的钱袋子",
      story: "你打开财务仪表盘——收入、支出、储蓄、投资……\n\n一张图看清你所有的钱。你发现，当财务数据以可视化的方式呈现时，那些模糊的焦虑变成了清晰的数字，反而没那么可怕了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f823FinanceDashboardDone) return false;
        if (!st.resources) return false;
        var cash = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return cash >= 50000 && st.player.day >= 80;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 深度分析财务数据",
          hint: "会计XP+30, 智力+18, 置_f823FinanceDashboard",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f823FinanceDashboardDone = true;
            st.flags._f823FinanceDashboard = true;
            // 计算收支比率
            if (st.resources) {
              var income = st.flags._dailyIncome || 0;
              var expense = st.flags._dailyExpense || 0;
              st.flags._f823SaveRatio = (income > 0 && isFinite(income) && isFinite(expense))
                ? Math.round((1 - expense / income) * 100) : 0;
            }
            grantXp("accounting", 30);
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 财务仪表盘分析完成——储蓄率约" + (st.flags._f823SaveRatio || 0) + "%。会计XP+30, 智力+18。", "success");
            }
          }
        },
        {
          text: "😅 知道有钱就行",
          hint: "心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f823FinanceDashboardDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 有钱就有底气。心情+5。", "info");
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