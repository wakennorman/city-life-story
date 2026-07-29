/*
 * 城市浮生记 — 域H(Phase2/公司) 联动增强 R810
 * 全系统优化·Domain H 第五十八轮循环
 *
 * 【联动增强3项】
 *   1. H→A 企业数据资产 — 公司运营数据转化为数值平衡洞察
 *   2. H→B 公司传奇叙事 — 公司里程碑成为城内叙事事件
 *   3. H→E 公司现金流→投资 — 公司收益引导个人投资
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR810Loaded) return;
  RANDOM_EVENTS._domainHLinkageR810Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: H→A 企业数据资产 — 公司运营数据转化为数值洞察
    // 设计意图：公司运营产生的数据(营收/估值/KPI)应成为数值域可消费的资产。
    // 本事件在公司估值首次突破¥50万时触发，给予"企业数据资产"标记。
    // 心理学：认知负荷 — 综合数据仪表盘降低玩家信息处理负担。
    // ========================================================================
    {
      id: "h810_corporate_data_asset",
      phase: "corporate",
      icon: "📊",
      title: "公司数据，是你的经营资产",
      story: "你看着公司的运营数据——营收、成本、利润、现金流、KPI……\n\n这些不只是数字，它们是你经营决策的「数据资产」。\n\n会用数据看公司，才能做对决策。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h810CorpDataDone) return false;
        if (st.player.phase !== "corporate" || !st.startup || !st.startup.company) return false;
        var _valuation = st.startup.company.valuation || 0;
        return _valuation >= 500000 && st.player.day >= 90;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "📊 建立数据驱动的经营体系",
          hint: "智力+8, 管理XP+10, 置_h810DataDriven",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h810CorpDataDone = true;
            st.flags._h810DataDriven = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("management", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据驱动的经营体系建立——智力+8, 管理XP+10。", "success");
            }
          }
        },
        {
          text: "💼 凭经验就够了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h810CorpDataDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 凭经验就够了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: H→B 公司传奇叙事 — 公司里程碑成为城内叙事事件
    // 设计意图：公司里程碑(融资/IPO)应成为城内的叙事事件，让玩家感到"公司成了传奇"。
    // 本事件在公司A轮融资成功时触发，给予"城市传奇"标记。
    // 心理学：社会认同 — 被社会认可的经营成就带来满足感。
    // ========================================================================
    {
      id: "h810_corporate_legend",
      phase: "corporate",
      icon: "🏆",
      title: "你的公司，成了这座城市的传奇",
      story: "消息传开了——你的公司完成了A轮融资。\n\n街头巷尾的茶馆里，有人议论：「听说那个年轻人/姑娘，创业两年就做到了A轮。」\n\n你不再是那个刚来这座城市时什么都不懂的新人了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h810LegendDone) return false;
        if (st.player.phase !== "corporate" || !st.startup || !st.startup.company) return false;
        var _rounds = st.startup.company.fundingRounds;
        return Array.isArray(_rounds) && _rounds.length >= 1;
      },
      probability: 0.08,
      repeatable: false,
      choices: [
        {
          text: "🏆 谦虚回应，继续前行",
          hint: "名气+10, 心智+5, 置_h810CityLegend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h810LegendDone = true;
            st.flags._h810CityLegend = true;
            if (st.player) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 你的公司成了这座城市的创业传奇——名气+10, 心智+5。", "success");
            }
          }
        },
        {
          text: "😊 只是开始，路还长",
          hint: "心智+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h810LegendDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 你告诉自己：这只是开始。心智+8。", "success");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: H→E 公司现金流→投资 — 公司收益引导个人投资
    // 设计意图：公司收益应引导玩家关注个人投资，形成"公司→个人"财富循环。
    // 本事件在公司月营收≥¥10万时触发，给予"财富循环"标记。
    // 心理学：禀赋效应 — 玩家感到"公司赚的钱应该增值"。
    // ========================================================================
    {
      id: "h810_corp_to_personal_invest",
      phase: "corporate",
      icon: "💰",
      title: "公司赚钱了，然后呢？",
      story: "公司月营收突破了六位数。\n\n你开始思考：公司赚到的钱，除了再投入，是不是也应该做一些个人投资？\n\n让钱为你工作，而不只是你为钱工作。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h810WealthCycleDone) return false;
        if (st.player.phase !== "corporate" || !st.startup || !st.startup.company) return false;
        var _revenue = st.startup.company.revenue || 0;
        return _revenue >= 100000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 学习让公司收益增值",
          hint: "智力+8, 会计XP+10, 置_h810WealthCycle",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h810WealthCycleDone = true;
            st.flags._h810WealthCycle = true;
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
            st.flags._h810WealthCycleDone = true;
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
