/*
 * 城市浮生记 — 域C(职业/成长) 联动增强 R864
 * 全系统优化·Domain C 第六十七轮循环
 *
 * 【联动增强3项】
 *   1. C→A 技能市场数据v6 — 技能等级转化为数值平衡数据资产
 *   2. C→E 职业技能→投资v7 — 职业技能深度引导投资决策
 *   3. C→G 职业健康→生命质量v6 — 职业状态深度反馈为身心恢复
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR864Loaded) return;
  RANDOM_EVENTS._domainCLinkageR864Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: C→A 技能市场数据v6 — 技能等级转化为数值平衡数据资产
    // 设计意图：技能数据应成为数值域可消费的资产，让玩家感到"技能有价值"。
    // 本事件在玩家拥有≥5个Lv.70+技能时触发，给予"技能市场数据v6"标记。
    // 心理学：禀赋效应 — 玩家更珍视自己投入时间培养的技能。
    // ========================================================================
    {
      id: "c864_skill_data_v6",
      phase: "street",
      icon: "📊",
      title: "你的技能，在市场上值多少钱？",
      story: "你查看了技能市场报告——自己的技能水平，在市场上的定价一目了然。\n\n技能越高，市场定价越高。这不是抽象的感觉，而是真实的数据。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c864SkillDataDone) return false;
        if (!st.skills) return false;
        var _count = 0;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 70) _count++;
        }
        return _count >= 5;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 查看技能市场数据",
          hint: "智力+18, 会计XP+20, 置_c864SkillValueData",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c864SkillDataDone = true;
            st.flags._c864SkillValueData = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            grantXp("accounting", 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 技能市场数据已生成——智力+18, 会计XP+20。技能就是钱。", "success");
            }
          }
        },
        {
          text: "😅 技能不用数据衡量",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c864SkillDataDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 技能不用数据衡量。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: C→E 职业技能→投资v7 — 职业技能深度引导投资决策
    // 设计意图：职业技能应深度引导玩家关注投资，形成"技能→投资"决策链。
    // 本事件在玩家拥有≥4个Lv.60+技能且总资产≥¥20万时触发。
    // 心理学：禀赋效应 — 玩家感到"技能应该变现"。
    // ========================================================================
    {
      id: "c864_skill_to_invest_v7",
      phase: "street",
      icon: "💰",
      title: "用技能赚钱，让钱生钱",
      story: "你发现——自己的技能水平已经足够高了，但收入增长却遇到了瓶颈。\n\n是时候考虑：如何让技能赚到的钱，继续为你赚钱？",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c864SkillInvestDone) return false;
        if (!st.skills || !st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        if (_total < 200000) return false;
        var _count = 0;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 60) _count++;
        }
        return _count >= 4;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 学习用技能收益投资",
          hint: "智力+20, 会计XP+22, 置_c864SkillInvestor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c864SkillInvestDone = true;
            st.flags._c864SkillInvestor = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            grantXp("accounting", 22);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 你开始学习用技能收益投资——智力+20, 会计XP+22。", "success");
            }
          }
        },
        {
          text: "😅 技能赚钱就够了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c864SkillInvestDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 技能赚钱就够了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: C→G 职业健康→生命质量v6 — 职业状态深度反馈为身心恢复
    // 设计意图：职业状态(倦怠/压力)应深度反馈为身心恢复需求。
    // 本事件在玩家倦怠≥80且健康<30时触发，给予"职业健康v6"标记。
    // 心理学：损失厌恶 — 玩家更害怕因工作失去健康。
    // ========================================================================
    {
      id: "c864_career_health_v6",
      phase: "street",
      icon: "💚",
      title: "工作再忙，也要照顾好自己",
      story: "你感到疲惫——长时间的工作让身体发出了警告。\n\n健康不是无限的资源，它需要被照顾、被恢复。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c864CareerHealthDone) return false;
        var _burnout = st.player.corporate ? (st.player.corporate.burnout || 0) : (st.needs ? st.needs.fatigue : 0);
        if (_burnout < 80) return false;
        var _health = st.status ? st.status.health : 100;
        return _health < 30;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "💚 主动恢复身心健康",
          hint: "健康+25, 疲劳-35, 置_c864CareerHealthRecovery",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c864CareerHealthDone = true;
            st.flags._c864CareerHealthRecovery = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 25);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 35);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 你主动恢复了身心健康——健康+25, 疲劳-35。", "success");
            }
          }
        },
        {
          text: "🔥 再撑一阵子就好了",
          hint: "健康-12, 置_c864BurnoutRisk",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c864CareerHealthDone = true;
            st.flags._c864BurnoutRisk = true;
            if (st.status) st.status.health = Math.max(0, (st.status.health || 50) - 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔥 你选择继续硬撑——健康-12。注意身体！", "warning");
            }
          }
        }
      ]
    }
  ];

  // ---- 注入全局 RANDOM_EVENTS ---->
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
