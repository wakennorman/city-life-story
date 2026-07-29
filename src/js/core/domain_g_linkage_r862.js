/*
 * 城市浮生记 — 域G(核心机制/生命周期) 联动增强 R862
 * 全系统优化·Domain G 第六十六轮循环
 *
 * 联动增强3项(补齐历轮域G未覆盖的 G→C/G→E/G→F 三大方向):
 *   1. g862_life_stage_career    G→C 生命阶段职业转折 — 年龄/人生节点触发职业反思
 *   2. g862_wealth_life_cycle    G→E 财富生命周期 — 人生阶段引导投资节奏
 *   3. g862_life_quality_index   G→F 生命质量指数 — UI层综合评分仪表盘+改善建议
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 使用现代 conditions/probability/repeatable 范式(同R860)。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR862Loaded) return;
  RANDOM_EVENTS._domainGLinkageR862Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: G→C 生命阶段职业转折 — 年龄/人生节点触发职业反思
    // 设计意图：核心机制(年龄/人生节点)应与职业域产生联动,阶段变化触发职业反思。
    // 本事件在玩家年龄≥25岁且已在职场≥60天时触发。
    // 心理学：峰终定律 — 人生阶段转折点的职业反思产生顿悟感。
    // ========================================================================
    {
      id: "g862_life_stage_career",
      phase: "street",
      icon: "🔄",
      title: "生命阶段的职业转折",
      story: "你站在人生的一个转折点上——年龄增长,身体不如从前,但经验越来越丰富。\n\n是时候重新审视自己的职业方向了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g862CareerTurnDone) return false;
        if (!st.employment || !st.employment.currentJob) return false;
        var _age = st.player.age || 18;
        var _day = st.player.day || 0;
        return _age >= 25 && _day >= 60;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🔄 重新规划职业",
          hint: "管理XP+18, 心智+15, 置_g862CareerTurn",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g862CareerTurnDone = true;
            st.flags._g862CareerTurn = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            grantXp("management", 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔄 职业转折反思—─管理XP+18, 心智+15。", "success");
            }
          }
        },
        {
          text: "💪 坚守现有方向",
          hint: "心智+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g862CareerTurnDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 坚守现有方向。心智+10。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: G→E 财富生命周期 — 人生阶段引导投资节奏
    // 设计意图：核心机制(年龄/资产阶段)应与经济域产生联动,阶段变化引导投资节奏。
    // 本事件在玩家总资产≥[PLACEHOLDER]¥8万且年龄≥28岁时触发。
    // 心理学：损失厌恶 — 年龄增长引发投资保守化反思。
    // ========================================================================
    {
      id: "g862_wealth_life_cycle",
      phase: "street",
      icon: "📈",
      title: "财富生命周期",
      story: "你开始思考——年龄增长,风险承受能力在变,投资策略也该跟着调整。\n\n年轻时可以冒险,现在需要更稳健的配置。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g862WealthCycleDone) return false;
        if (!st.resources) return false;
        var _age = st.player.age || 18;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return _age >= 28 && _total >= 80000;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📈 调整投资策略",
          hint: "智力+18, 会计XP+15, 置_g862WealthCycle",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g862WealthCycleDone = true;
            st.flags._g862WealthCycle = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            grantXp("accounting", 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 财富生命周期调整—─智力+18, 会计XP+15。", "success");
            }
          }
        },
        {
          text: "😅 保持现状",
          hint: "心智+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g862WealthCycleDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 保持现状,也是一种选择。心智+8。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: G→F 生命质量指数 — UI层综合评分仪表盘
    // 设计意图：核心机制(健康/需求/心情)的综合评分应在UI层有可视化仪表盘。
    // 本事件在玩家生存≥150天且健康/需求数据完整时触发。
    // 心理学：禀赋效应 — 看到自己的生命质量评分产生自我认同。
    // ========================================================================
    {
      id: "g862_life_quality_index",
      phase: "street",
      icon: "💎",
      title: "生命质量指数",
      story: "你打开生命质量仪表盘——健康、需求、心情、社交……\n\n所有维度汇成一个综合评分,直观展现你的生命质量。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g862LifeQualityDone) return false;
        return st.player.day >= 150 && st.status && st.needs;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "💎 查看生命质量",
          hint: "心情+20, 心智+15, 置_g862LifeQuality",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g862LifeQualityDone = true;
            st.flags._g862LifeQuality = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💎 生命质量指数已启用—─心情+20, 心智+15。", "success");
            }
          }
        },
        {
          text: "🌱 关注成长",
          hint: "心智+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g862LifeQualityDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌱 关注成长,分数只是参考。心智+10。", "info");
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
