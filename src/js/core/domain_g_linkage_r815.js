/*
 * 城市浮生记 — 域G(核心机制/生命周期) 联动增强 R815
 * 全系统优化·Domain G 第五十九轮循环
 *
 * 【联动增强3项】
 *   1. G→C 年龄技能协同 — 年龄节点触发技能成长事件
 *   2. G→E 生命周期投资 — 年龄/阶段引导投资策略调整
 *   3. G→F 人生仪表盘UI — 核心机制数据在UI层的综合展示
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR815Loaded) return;
  RANDOM_EVENTS._domainGLinkageR815Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: G→C 年龄技能协同 — 年龄节点触发技能成长事件
    // 设计意图：年龄增长应触发技能成长事件，让玩家感到"每个阶段都有成长"。
    // 本事件在玩家年龄≥28且拥有≥2个Lv.30+技能时触发。
    // 心理学：技能协同 — 不同领域的技能互相强化。
    // ========================================================================
    {
      id: "g815_age_skill_synergy",
      phase: "street",
      icon: "🎓",
      title: "这个年纪，该学点新东西了",
      story: "你发现——随着年龄增长，学习新技能的速度虽然慢了，但理解却更深了。\n\n年轻人学得快，年长者想得深。每个年纪，都有自己的学习方式。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g815AgeSkillDone) return false;
        if (!st.skills) return false;
        var _age = st.player.age || 18;
        if (_age < 28) return false;
        var _count = 0;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 30) _count++;
        }
        return _count >= 2;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🎓 学习新技能",
          hint: "最高技能XP+12, 置_g815LifelongLearner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g815AgeSkillDone = true;
            st.flags._g815LifelongLearner = true;
            // 找到最高等级技能并给予XP
            var _topSkill = "", _topLevel = 0;
            if (st.skills) {
              for (var _sk in st.skills) {
                var _sl = st.skills[_sk];
                if (_sl && (_sl.level || 0) > _topLevel) {
                  _topLevel = _sl.level || 0;
                  _topSkill = _sk;
                }
              }
            }
            if (_topSkill && typeof addSkillXp === "function") {
              try { addSkillXp(_topSkill, 12); } catch(e) {}
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎓 你开始学习新技能——" + (_topSkill || "技能") + "XP+12。活到老学到老。", "success");
            }
          }
        },
        {
          text: "😅 现在这样挺好",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g815AgeSkillDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 现在这样挺好。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: G→E 生命周期投资 — 年龄/阶段引导投资策略调整
    // 设计意图：不同年龄阶段应引导不同的投资策略，让玩家感到"阶段不同策略不同"。
    // 本事件在玩家年龄≥35且总资产≥¥10万时触发。
    // 心理学：损失厌恶 — 年长者更害怕风险。
    // ========================================================================
    {
      id: "g815_life_cycle_invest",
      phase: "street",
      icon: "📈",
      title: "不同年纪，不同的投资策略",
      story: "你发现——年轻时可以冒险，年纪大了应该稳健。\n\n不同的人生阶段，适合不同的投资策略。这不是保守，而是智慧。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g815LifeInvestDone) return false;
        if (!st.resources) return false;
        var _age = st.player.age || 18;
        if (_age < 35) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return _total >= 100000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📈 调整投资策略",
          hint: "智力+8, 会计XP+10, 置_g815LifeCycleInvestor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g815LifeInvestDone = true;
            st.flags._g815LifeCycleInvestor = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 你调整了投资策略——智力+8, 会计XP+10。不同年纪，不同策略。", "success");
            }
          }
        },
        {
          text: "😅 投资策略不用变",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g815LifeInvestDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 投资策略不用变。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: G→F 人生仪表盘UI — 核心机制数据在UI层的综合展示
    // 设计意图：核心机制数据应在UI层有直观的仪表盘展示。
    // 本事件在玩家生存≥150天时触发，给予"人生仪表盘"标记。
    // 心理学：认知负荷 — 综合仪表盘降低玩家信息处理负担。
    // ========================================================================
    {
      id: "g815_life_dashboard_ui",
      phase: "street",
      icon: "🌟",
      title: "人生仪表盘：一眼看清自己的状态",
      story: "你打开人生仪表盘——健康、心情、财富、社交、技能……\n\n所有指标汇聚成一个清晰的综合评分。你终于看清了自己的生命状态：哪里好、哪里需要改善。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g815LifeDashDone) return false;
        return st.player.day >= 150 && st.needs && st.status;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🌟 启用人生仪表盘",
          hint: "心智+8, 置_g815LifeDashboard",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g815LifeDashDone = true;
            st.flags._g815LifeDashboard = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌟 人生仪表盘已启用——心智+8。一眼看清自己的状态。", "success");
            }
          }
        },
        {
          text: "😅 看看就行",
          hint: "心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g815LifeDashDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 看看就行。心情+3。", "info");
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
