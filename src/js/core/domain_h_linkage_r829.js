/*
 * 城市浮生记 — 域H(Phase2/公司) 联动增强 R829
 * 全系统优化·Domain H 第六十轮循环
 *
 * 【联动增强3项】
 *   1. H→A 企业数据资产v2 — 公司运营数据转化为数值平衡洞察
 *   2. H→C 公司职业成长v2 — 公司经历转化为职场技能
 *   3. H→E 公司现金流→投资v3 — 公司收益引导个人投资
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR829Loaded) return;
  RANDOM_EVENTS._domainHLinkageR829Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: H→A 企业数据资产v2 — 公司运营数据转化为数值洞察
    // 设计意图：公司运营产生的数据(营收/估值/KPI)应成为数值域可消费的资产。
    // 本事件在公司估值首次突破¥200万时触发，给予"企业数据资产v2"标记。
    // 心理学：认知负荷 — 综合数据仪表盘降低玩家信息处理负担。
    // ========================================================================
    {
      id: "h829_corporate_data_v2",
      phase: "corporate",
      icon: "📊",
      title: "公司数据，是你的经营资产",
      story: "你看着公司的运营数据——营收、成本、利润、现金流、KPI……\n\n这些不只是数字，它们是你经营决策的「数据资产」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h829CorpDataDone) return false;
        if (st.player.phase !== "corporate" || !st.startup || !st.startup.company) return false;
        var _valuation = st.startup.company.valuation || 0;
        return _valuation >= 2000000 && st.player.day >= 150;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "📊 建立数据驱动的经营体系",
          hint: "智力+10, 管理XP+12, 置_h829DataDriven",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h829CorpDataDone = true;
            st.flags._h829DataDriven = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            grantXp("management", 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据驱动的经营体系建立——智力+10, 管理XP+12。", "success");
            }
          }
        },
        {
          text: "💼 凭经验就够了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h829CorpDataDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 凭经验就够了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: H→C 公司职业成长v2 — 公司经历转化为职场技能
    // 设计意图：公司运营经历应转化为职场技能成长，让玩家感到"创业有回报"。
    // 本事件在公司存续≥250天时触发，给予"创业者技能v2"标记。
    // 心理学：禀赋效应 — 玩家感到"创业经历没有白费"。
    // ========================================================================
    {
      id: "h829_corporate_career_v2",
      phase: "corporate",
      icon: "🎓",
      title: "创业教会你的，比职场更多",
      story: "你回顾了这一年的创业经历——带团队、做决策、应对风险、把握机会。\n\n这些经历，比任何职场培训都来得深刻。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h829CorpCareerDone) return false;
        if (st.player.phase !== "corporate" || !st.startup) return false;
        return st.player.day >= 250;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "🎓 总结创业经验，沉淀为技能",
          hint: "管理XP+18, 置_h829EntrepreneurSkill",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h829CorpCareerDone = true;
            st.flags._h829EntrepreneurSkill = true;
            grantXp("management", 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎓 创业经验沉淀为职场能力——管理XP+18。", "success");
            }
          }
        },
        {
          text: "😊 创业就是创业，职场就是职场",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h829CorpCareerDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 创业就是创业，职场就是职场。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: H→E 公司现金流→投资v3 — 公司收益引导个人投资
    // 设计意图：公司收益应引导玩家关注个人投资，形成"公司→个人"财富循环。
    // 本事件在公司月营收≥¥15万时触发，给予"财富循环v3"标记。
    // 心理学：禀赋效应 — 玩家感到"公司赚的钱应该增值"。
    // ========================================================================
    {
      id: "h829_corp_to_personal_v3",
      phase: "corporate",
      icon: "💰",
      title: "公司赚钱了，然后呢？",
      story: "公司月营收突破了十五万。\n\n你开始思考：公司赚到的钱，除了再投入，是不是也应该做一些个人投资？",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h829WealthCycleDone) return false;
        if (st.player.phase !== "corporate" || !st.startup || !st.startup.company) return false;
        var _revenue = st.startup.company.revenue || 0;
        return _revenue >= 150000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 学习让公司收益增值",
          hint: "智力+10, 会计XP+12, 置_h829WealthCycle",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h829WealthCycleDone = true;
            st.flags._h829WealthCycle = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            grantXp("accounting", 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 你开始学习让公司收益增值——智力+10, 会计XP+12。", "success");
            }
          }
        },
        {
          text: "😅 再投入公司更划算",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h829WealthCycleDone = true;
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
