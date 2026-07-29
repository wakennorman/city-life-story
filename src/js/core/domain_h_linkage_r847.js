/**
 * 域H(Phase2/公司) 联动增强 R847
 * 全系统优化·Domain H 第六十九轮循环
 *
 * 【联动增强3项】
 *   1. H→A 企业数据资产v11 — 公司运营数据转化为数值洞察
 *   2. H→B 公司传奇叙事v11 — 公司里程碑成为城内叙事事件
 *   3. H→G 创始人健康v11 — 创业者身心状态影响公司决策
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR847Loaded) return;
  RANDOM_EVENTS._domainHLinkageR847Loaded = true;

  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "h847_corporate_data_v11",
      phase: "corporate",
      icon: "📊",
      title: "公司数据，是决策的基石",
      story: "你翻开公司的季度报表——营收增长、成本控制、团队效率、客户留存……这些数据背后，是每一个决策的痕迹。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h847CorpDataDone) return false;
        if (st.player.phase !== "corporate" || !st.startup || !st.startup.company) return false;
        var _valuation = st.startup.company.valuation || 0;
        return _valuation >= 100000000 && st.player.day >= 550;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "📊 建立数据驱动的决策体系",
          hint: "智力+28, 管理XP+38, 置_h847DataDriven",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h847CorpDataDone = true;
            st.flags._h847DataDriven = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 28);
            grantXp("management", 38);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据驱动的决策体系建立——智力+28, 管理XP+38。", "success");
            }
          }
        },
        {
          text: "💼 凭直觉就够了",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h847CorpDataDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 凭直觉就够了。心智+5。", "info");
            }
          }
        }
      ]
    },
    {
      id: "h847_corporate_legend_v11",
      phase: "corporate",
      icon: "🏆",
      title: "公司传奇，城市为你侧目",
      story: "消息传开了——你的公司成了行业标杆。街头巷尾的茶馆里，有人在议论你公司的名字。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h847LegendDone) return false;
        if (st.player.phase !== "corporate" || !st.startup || !st.startup.company) return false;
        var _rounds = st.startup.company.fundingRounds;
        return Array.isArray(_rounds) && _rounds.length >= 5;
      },
      probability: 0.1,
      repeatable: false,
      choices: [
        {
          text: "🏆 谦虚回应，继续前行",
          hint: "名气+28, 心智+26, 置_h847CityLegend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h847LegendDone = true;
            st.flags._h847CityLegend = true;
            if (st.player) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 28);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 26);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 你的公司成了这座城市的创业传奇——名气+28, 心智+26。", "success");
            }
          }
        },
        {
          text: "😊 只是开始，路还长",
          hint: "心智+28",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h847LegendDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 28);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 你告诉自己：这只是开始。心智+28。", "success");
            }
          }
        }
      ]
    },
    {
      id: "h847_founder_health_v11",
      phase: "corporate",
      icon: "💪",
      title: "创始人健康，是公司最大的资产",
      story: "你连续高强度工作了一个月。身体的警告信号越来越明显。但公司正处于关键期——产品迭代、市场扩张、团队扩充。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h847FounderHealthDone) return false;
        if (st.player.phase !== "corporate") return false;
        var _health = st.status ? st.status.health : 100;
        return _health < 12 && st.player.day >= 200;
      },
      probability: 0.12,
      repeatable: false,
      choices: [
        {
          text: "💪 调整节奏，健康第一",
          hint: "健康+45, KPI-8, 置_h847HealthFirst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h847FounderHealthDone = true;
            st.flags._h847HealthFirst = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 45);
            if (st.player && st.player.corporate) {
              st.player.corporate.kpi = Math.max(0, (st.player.corporate.kpi || 0) - 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 你调整了生活节奏——健康+45, KPI-8。身体是创业的本钱。", "success");
            }
          }
        },
        {
          text: "🔥 再拼一把，等公司稳定了再说",
          hint: "健康-28, KPI+38, 置_h847BurnoutRisk",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h847FounderHealthDone = true;
            st.flags._h847BurnoutRisk = true;
            if (st.status) st.status.health = Math.max(0, (st.status.health || 50) - 28);
            if (st.player && st.player.corporate) {
              st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 0) + 38);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔥 你选择再拼一把——健康-28, KPI+38。注意身体！", "warning");
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