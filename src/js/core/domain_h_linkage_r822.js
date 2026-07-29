/*
 * 城市浮生记 — 域H(Phase2/公司) 联动增强 R822
 * 全系统优化·Domain H 第五十九轮循环
 *
 * 【联动增强3项】
 *   1. H→C 公司职业成长 — 公司经历转化为职场技能
 *   2. H→F 公司健康度UI — 公司数据在UI层的综合展示
 *   3. H→E 公司现金流→投资v2 — 公司收益引导个人投资
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR822Loaded) return;
  RANDOM_EVENTS._domainHLinkageR822Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: H→C 公司职业成长 — 公司经历转化为职场技能
    // 设计意图：公司运营经历应转化为职场技能成长，让玩家感到"创业有回报"。
    // 本事件在公司存续≥180天时触发，给予"创业者技能"标记。
    // 心理学：禀赋效应 — 玩家感到"创业经历没有白费"。
    // ========================================================================
    {
      id: "h822_corporate_career_growth",
      phase: "corporate",
      icon: "🎓",
      title: "创业教会你的，比职场更多",
      story: "你回顾了这一年的创业经历——带团队、做决策、应对风险、把握机会。\n\n这些经历，比任何职场培训都来得深刻。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h822CorpCareerDone) return false;
        if (st.player.phase !== "corporate" || !st.startup) return false;
        return st.player.day >= 180;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "🎓 总结创业经验，沉淀为技能",
          hint: "管理XP+15, 置_h822EntrepreneurSkill",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h822CorpCareerDone = true;
            st.flags._h822EntrepreneurSkill = true;
            grantXp("management", 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎓 创业经验沉淀为职场能力——管理XP+15。", "success");
            }
          }
        },
        {
          text: "😊 创业就是创业，职场就是职场",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h822CorpCareerDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 创业就是创业，职场就是职场。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: H→F 公司健康度UI — 公司数据在UI层的综合展示
    // 设计意图：公司运营数据应在UI层有直观的仪表盘展示。
    // 本事件在公司存续≥90天时触发，给予"经营仪表盘"标记。
    // 心理学：认知负荷 — 综合仪表盘降低玩家信息处理负担。
    // ========================================================================
    {
      id: "h822_corporate_dashboard",
      phase: "corporate",
      icon: "📊",
      title: "一眼看清公司全貌",
      story: "你打开经营仪表盘——KPI、现金流、团队士气、市场份额……\n\n所有数据一目了然。你终于看清了公司的全貌：哪里健康、哪里需要调整。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h822CorpDashDone) return false;
        if (st.player.phase !== "corporate" || !st.startup) return false;
        return st.player.day >= 90;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "📊 启用经营仪表盘",
          hint: "智力+5, 管理XP+8, 置_h822CorpDashboard",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h822CorpDashDone = true;
            st.flags._h822CorpDashboard = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            grantXp("management", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 经营仪表盘已启用——智力+5, 管理XP+8。", "success");
            }
          }
        },
        {
          text: "😅 看报表就够了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h822CorpDashDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 看报表就够了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: H→E 公司现金流→投资v2 — 公司收益引导个人投资
    // 设计意图：公司收益应引导玩家关注个人投资，形成"公司→个人"财富循环。
    // 本事件在公司月营收≥¥10万时触发，给予"财富循环"标记。
    // 心理学：禀赋效应 — 玩家感到"公司赚的钱应该增值"。
    // ========================================================================
    {
      id: "h822_corp_to_personal_invest",
      phase: "corporate",
      icon: "💰",
      title: "公司赚钱了，然后呢？",
      story: "公司月营收突破了六位数。\n\n你开始思考：公司赚到的钱，除了再投入，是不是也应该做一些个人投资？",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h822WealthCycleDone) return false;
        if (st.player.phase !== "corporate" || !st.startup || !st.startup.company) return false;
        var _revenue = st.startup.company.revenue || 0;
        return _revenue >= 100000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 学习让公司收益增值",
          hint: "智力+8, 会计XP+10, 置_h822WealthCycle",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h822WealthCycleDone = true;
            st.flags._h822WealthCycle = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 你开始学习让公司收益增值——智力+8, 会计XP+10。", "success");
            }
          }
        },
        {
          text: "😅 再投入公司更划算",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h822WealthCycleDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 再投入公司更划算。心智+3。", "info");
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
