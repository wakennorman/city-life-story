/*
 * 城市浮生记 — 域H(Phase2/公司) 联动增强 R853
 * 全系统优化·Domain H 第六十三轮循环
 *
 * 【联动增强3项】
 *   1. H→A 企业数据资产v5 — 公司运营数据转化为数值平衡洞察
 *   2. H→B 公司传奇叙事v5 — 公司里程碑成为城内叙事事件
 *   3. H→G 创始人健康v5 — 创业者身心状态影响公司决策
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR853Loaded) return;
  RANDOM_EVENTS._domainHLinkageR853Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: H→A 企业数据资产v5 — 公司运营数据转化为数值洞察
    // 设计意图：公司运营产生的数据(营收/估值/KPI)应成为数值域可消费的资产。
    // 本事件在公司估值首次突破¥1000万时触发，给予"企业数据资产v5"标记。
    // 心理学：认知负荷 — 综合数据仪表盘降低玩家信息处理负担。
    // ========================================================================
    {
      id: "h853_corporate_data_v5",
      phase: "corporate",
      icon: "📊",
      title: "公司数据，是你的经营资产",
      story: "你看着公司的运营数据——营收、成本、利润、现金流、KPI……\n\n这些不只是数字，它们是你经营决策的「数据资产」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h853CorpDataDone) return false;
        if (st.player.phase !== "corporate" || !st.startup || !st.startup.company) return false;
        var _valuation = st.startup.company.valuation || 0;
        return _valuation >= 10000000 && st.player.day >= 250;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "📊 建立数据驱动的经营体系",
          hint: "智力+18, 管理XP+20, 置_h853DataDriven",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h853CorpDataDone = true;
            st.flags._h853DataDriven = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            grantXp("management", 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据驱动的经营体系建立——智力+18, 管理XP+20。", "success");
            }
          }
        },
        {
          text: "💼 凭经验就够了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h853CorpDataDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 凭经验就够了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: H→B 公司传奇叙事v5 — 公司里程碑成为城内叙事事件
    // 设计意图：公司里程碑(融资/IPO)应成为城内的叙事事件，让玩家感到"公司成了传奇"。
    // 本事件在公司B轮融资成功时触发，给予"城市传奇v5"标记。
    // 心理学：社会认同 — 被社会认可的经营成就带来满足感。
    // ========================================================================
    {
      id: "h853_corporate_legend_v5",
      phase: "corporate",
      icon: "🏆",
      title: "你的公司，成了这座城市的传奇",
      story: "消息传开了——你的公司完成了B轮融资。\n\n街头巷尾的茶馆里，有人议论：「听说那个年轻人/姑娘，创业三年就做到了B轮。」",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h853LegendDone) return false;
        if (st.player.phase !== "corporate" || !st.startup || !st.startup.company) return false;
        var _rounds = st.startup.company.fundingRounds;
        return Array.isArray(_rounds) && _rounds.length >= 2;
      },
      probability: 0.1,
      repeatable: false,
      choices: [
        {
          text: "🏆 谦虚回应，继续前行",
          hint: "名气+18, 心智+12, 置_h853CityLegend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h853LegendDone = true;
            st.flags._h853CityLegend = true;
            if (st.player) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 18);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 你的公司成了这座城市的创业传奇——名气+18, 心智+12。", "success");
            }
          }
        },
        {
          text: "😊 只是开始，路还长",
          hint: "心智+15",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h853LegendDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 你告诉自己：这只是开始。心智+15。", "success");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: H→G 创始人健康v5 — 创业者身心状态影响公司决策
    // 设计意图：创业者的身心状态应影响公司决策质量，形成"个人→公司"反馈环。
    // 本事件在corporate阶段且玩家健康<35时触发。
    // 心理学：损失厌恶 — 玩家更害怕因个人问题影响公司。
    // ========================================================================
    {
      id: "h853_founder_health_v5",
      phase: "corporate",
      icon: "💪",
      title: "身体是创业的本钱",
      story: "你连续加班第四周了。头痛、胃痛、失眠……身体的警告信号越来越明显。\n\n但公司正处于关键期——产品要上线、融资要谈判、团队要稳定。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h853FounderHealthDone) return false;
        if (st.player.phase !== "corporate") return false;
        var _health = st.status ? st.status.health : 100;
        return _health < 35 && st.player.day >= 90;
      },
      probability: 0.12,
      repeatable: false,
      choices: [
        {
          text: "💪 调整节奏，健康第一",
          hint: "健康+20, KPI-12, 置_h853HealthFirst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h853FounderHealthDone = true;
            st.flags._h853HealthFirst = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 20);
            if (st.player && st.player.corporate) {
              st.player.corporate.kpi = Math.max(0, (st.player.corporate.kpi || 0) - 12);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 你调整了生活节奏——健康+20, KPI-12。身体是创业的本钱。", "success");
            }
          }
        },
        {
          text: "🔥 再拼一把，等公司稳定了再说",
          hint: "健康-12, KPI+20, 置_h853BurnoutRisk",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h853FounderHealthDone = true;
            st.flags._h853BurnoutRisk = true;
            if (st.status) st.status.health = Math.max(0, (st.status.health || 50) - 12);
            if (st.player && st.player.corporate) {
              st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 0) + 20);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔥 你选择再拼一把——健康-12, KPI+20。注意身体！", "warning");
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
