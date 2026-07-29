/*
 * 城市浮生记 — 域C(职业/成长) 联动增强 R813
 * 全系统优化·Domain C 第六十轮循环
 *
 * 【联动增强3项】
 *   1. C→A 技能市场数据 — 技能等级转化为数值平衡数据资产
 *   2. C→E 职业技能→投资 — 职业技能引导经济/投资决策
 *   3. C→G 职业健康→生命质量 — 职业状态反馈为身心恢复
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR813Loaded) return;
  RANDOM_EVENTS._domainCLinkageR813Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: C→A 技能市场数据 — 技能等级转化为数值平衡数据资产
    // 设计意图：技能数据应成为数值域可消费的资产，让玩家感到"技能有价值"。
    // 本事件在玩家拥有≥2个Lv.50+技能时触发，给予"技能市场数据"标记。
    // 心理学：禀赋效应 — 玩家更珍视自己投入时间培养的技能。
    // ========================================================================
    {
      id: "c813_skill_market_data",
      phase: "street",
      icon: "📊",
      title: "你的技能，在市场上值多少钱？",
      story: "你查看了技能市场报告——自己的技能水平，在市场上的定价一目了然。\n\n技能越高，市场定价越高。这不是抽象的感觉，而是真实的数据。\n\n数据告诉你：技能就是钱。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c813SkillDataDone) return false;
        if (!st.skills) return false;
        var _count = 0;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 50) _count++;
        }
        return _count >= 2;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 查看技能市场数据",
          hint: "智力+5, 会计XP+8, 置_c813SkillValueData",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c813SkillDataDone = true;
            st.flags._c813SkillValueData = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            grantXp("accounting", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 技能市场数据已生成——智力+5, 会计XP+8。技能就是钱。", "success");
            }
          }
        },
        {
          text: "😅 技能不用数据衡量",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c813SkillDataDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 技能不用数据衡量。心智+2。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: C→E 职业技能→投资 — 职业技能引导经济/投资决策
    // 设计意图：职业技能应引导玩家关注投资，形成"技能→投资"决策链。
    // 本事件在玩家拥有≥1个Lv.40+技能且总资产≥¥5万时触发。
    // 心理学：禀赋效应 — 玩家感到"技能应该变现"。
    // ========================================================================
    {
      id: "c813_skill_to_invest",
      phase: "street",
      icon: "💰",
      title: "用技能赚钱，让钱生钱",
      story: "你发现——自己的技能水平已经足够高了，但收入增长却遇到了瓶颈。\n\n是时候考虑：如何让技能赚到的钱，继续为你赚钱？\n\n从「打工者」到「投资者」，是人生的重要跨越。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c813SkillInvestDone) return false;
        if (!st.skills || !st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        if (_total < 50000) return false;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 40) return true;
        }
        return false;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 学习用技能收益投资",
          hint: "智力+8, 会计XP+10, 置_c813SkillInvestor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c813SkillInvestDone = true;
            st.flags._c813SkillInvestor = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 你开始学习用技能收益投资——智力+8, 会计XP+10。", "success");
            }
          }
        },
        {
          text: "😅 技能赚钱就够了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c813SkillInvestDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 技能赚钱就够了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: C→G 职业健康→生命质量 — 职业状态反馈为身心恢复
    // 设计意图：职业状态(倦怠/压力)应反馈为身心恢复需求，形成"工作→健康"反馈环。
    // 本事件在玩家倦怠≥50时触发，给予"职业健康"标记。
    // 心理学：损失厌恶 — 玩家更害怕因工作失去健康。
    // ========================================================================
    {
      id: "c813_career_health_recovery",
      phase: "street",
      icon: "💚",
      title: "工作再忙，也要照顾好自己",
      story: "你感到疲惫——长时间的工作让身体发出了警告。\n\n健康不是无限的资源，它需要被照顾、被恢复。\n\n工作再忙，也要照顾好自己。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c813CareerHealthDone) return false;
        var _burnout = st.player.corporate ? (st.player.corporate.burnout || 0) : (st.needs ? st.needs.fatigue : 0);
        return _burnout >= 50;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "💚 主动恢复身心健康",
          hint: "健康+10, 疲劳-15, 置_c813CareerHealthRecovery",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c813CareerHealthDone = true;
            st.flags._c813CareerHealthRecovery = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 你主动恢复了身心健康——健康+10, 疲劳-15。", "success");
            }
          }
        },
        {
          text: "🔥 再撑一阵子就好了",
          hint: "健康-5, 置_c813BurnoutRisk",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c813CareerHealthDone = true;
            st.flags._c813BurnoutRisk = true;
            if (st.status) st.status.health = Math.max(0, (st.status.health || 50) - 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔥 你选择继续硬撑——健康-5。注意身体！", "warning");
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
