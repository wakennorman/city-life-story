/*
 * 城市浮生记 — 域H(Phase2/公司) 联动增强 R795
 * 全系统优化·Domain H 第六轮循环
 *
 * 【联动增强3项】
 *   1. H→A 企业数据资产 — 公司运营数据转化为个人数据洞察+经营仪表盘
 *   2. H→B 公司传奇叙事 — 公司里程碑成为城内叙事事件
 *   3. H→G 创始人健康 — 创业者身心状态影响公司决策质量
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR795Loaded) return;
  RANDOM_EVENTS._domainHLinkageR795Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: H→A 企业数据资产 — 公司运营数据转化为个人数据洞察
    // 设计意图：公司运营产生大量数据(营收/估值/KPI)，但缺少"用数据看公司"的视角。
    // 本事件在估值首次突破¥100万时触发，给予"数据驱动经营者"标记。
    // 心理学：认知负荷 — 综合数据仪表盘降低玩家信息处理负担。
    // ========================================================================
    {
      id: "h795_corporate_data_asset",
      phase: "corporate",
      icon: "📊",
      title: "用数据看懂你的公司",
      story: "你坐在办公桌前，看着这个月的报表——营收、成本、利润、现金流……\n\n数字很多，但你需要的不是更多数据，而是一个清晰的答案：「我的公司，到底健不健康？」\n\n一个数据驱动的经营者，不会被情绪左右决策。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h795CorpDataDone) return false;
        if (st.player.phase !== "corporate" || !st.startup || !st.startup.company) return false;
        var _valuation = st.startup.company.valuation || 0;
        return _valuation >= 1000000 && st.player.day >= 120;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "📊 建立数据驱动的经营习惯",
          hint: "智力+8, 管理XP+10, 置_h795DataDriven",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h795CorpDataDone = true;
            st.flags._h795DataDriven = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("management", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 你开始用数据驱动决策——智力+8, 管理XP+10。", "success");
            }
          }
        },
        {
          text: "💼 凭直觉经营就好",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h795CorpDataDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 直觉也是一种经营智慧。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: H→B 公司传奇叙事 — 公司里程碑成为城内叙事事件
    // 设计意图：公司里程碑(融资/IPO/并购)应成为城内的叙事事件，让玩家感受到"我的公司成了传奇"。
    // 本事件在B轮融资成功时触发，给予"城市传奇"标记。
    // 心理学：社会认同 — 被社会认可的经营成就带来满足感。
    // ========================================================================
    {
      id: "h795_corporate_legend_narrative",
      phase: "corporate",
      icon: "🏆",
      title: "你成了这座城市的创业传奇",
      story: "消息传开了——你的公司完成了B轮融资。\n\n街头巷尾的茶馆里，有人议论：「听说那个年轻人/姑娘，创业三年就做到了B轮。」\n\n你不再是那个刚来这座城市时什么都不懂的新人了。你的名字，开始和「成功」联系在一起。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h795LegendDone) return false;
        if (st.player.phase !== "corporate" || !st.startup || !st.startup.company) return false;
        // B轮及以上
        var _round = st.startup.company.fundingRound || "seed";
        return (_round === "series_a" || _round === "series_b" || _round === "ipo");
      },
      probability: 0.1,
      repeatable: false,
      choices: [
        {
          text: "🏆 谦虚回应，继续前行",
          hint: "名气+10, 心智+5, 置_h795CityLegend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h795LegendDone = true;
            st.flags._h795CityLegend = true;
            if (st.player) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 你成了这座城市的创业传奇——名气+10, 心智+5。", "success");
            }
          }
        },
        {
          text: "😊 只是开始，路还长",
          hint: "心智+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h795LegendDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 你告诉自己：这只是开始。心智+8。", "success");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: H→G 创始人健康 — 创业者身心状态影响公司决策
    // 设计意图：创始人健康与公司绩效应形成反馈环。
    // 本事件在创始人健康<40且公司KPI>100时触发，警示"身体是创业的本钱"。
    // 心理学：损失厌恶 — 玩家更害怕因健康问题失去已有成就。
    // ========================================================================
    {
      id: "h795_founder_health",
      phase: "corporate",
      icon: "💪",
      title: "身体是创业的本钱",
      story: "你连续加班第三周了。头痛、胃痛、失眠……身体的警告信号越来越明显。\n\n但公司正处于关键期——产品要上线、融资要谈判、团队要稳定。\n\n你咬了咬牙，继续工作。但身体，不会陪你撒谎。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h795FounderHealthDone) return false;
        if (st.player.phase !== "corporate" || !st.startup) return false;
        // 健康<40且KPI>100（高压高绩效状态）
        var _health = st.status ? st.status.health : 100;
        var _kpi = st.player.corporate ? st.player.corporate.kpi : 0;
        return _health < 40 && _kpi > 100;
      },
      probability: 0.12,
      repeatable: false,
      choices: [
        {
          text: "💪 调整节奏，健康第一",
          hint: "健康+15, KPI-10, 置_h795HealthFirst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h795FounderHealthDone = true;
            st.flags._h795HealthFirst = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 15);
            if (st.player && st.player.corporate) {
              st.player.corporate.kpi = Math.max(0, (st.player.corporate.kpi || 0) - 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 你决定调整节奏。健康+15, KPI-10。身体是创业的本钱。", "success");
            }
          }
        },
        {
          text: "🔥 再拼一把，等公司稳定了再说",
          hint: "健康-10, KPI+15, 置_h795BurnoutRisk",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h795FounderHealthDone = true;
            st.flags._h795BurnoutRisk = true;
            if (st.status) st.status.health = Math.max(0, (st.status.health || 50) - 10);
            if (st.player && st.player.corporate) {
              st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 0) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔥 你选择再拼一把。健康-10, KPI+15。注意身体！", "warning");
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
