/**
 * 域F(UI/UX) 联动增强 R1028
 * — F→A 价格趋势面板 / F→E 财富仪表盘 / F→G 健康趋势
 *
 * 设计意图：UI数据消费到其他域，提供可视化反馈闭环。
 * 1. 价格趋势可视化 → 提高市场感知能力
 * 2. 财富仪表盘 → 提升投资决策质量
 * 3. 健康趋势 → 促进健康管理意识
 *
 * 约束：IIFE 注册 RANDOM_EVENTS；显式 phase；全 || 防御。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR1028Loaded) return;
  RANDOM_EVENTS._domainFLinkageR1028Loaded = true;

  function msg(t, k) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage) StateManager.addMessage(t, k || "info");
  }
  function gx(k, a) {
    if (typeof addSkillXp === "function") { try { addSkillXp(k, a); } catch (e) {} }
  }

  var EVENTS = [
    // ===== 1. F→A 价格趋势洞察 =====
    {
      id: "f1028_price_trend_insight",
      phase: "street",
      icon: "📉",
      title: "你开始看懂价格趋势图",
      story: "以前你看价格——只是数字。\n\n现在你看价格——是趋势。\n\n涨的时候，你在想：是季节性的，还是周期性的？\n跌的时候，你在想：是恐慌性的，还是结构性的？\n\n这些判断，不是从书本上学来的，\n而是你每天盯着市场、记录价格、分析走势，\n一点一点积累出来的直觉。\n\n图表不会说谎，但看懂图表需要时间。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f1028PriceInsightDone) return false;
        var tradeCount = (st.flags && st.flags._dailyTradeCount) || 0;
        return tradeCount >= 30 && st.player.day >= 50;
      },
      probability: 0.025,
      repeatable: false,
      choices: [
        {
          text: "📊 深入学习技术分析",
          hint: "会计XP+50, 智力+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f1028PriceInsightDone = true;
            st.flags._f1028PriceEye = true;
            gx("accounting", 50);
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 3);
            msg("📊 你开始用技术分析的方法看市场。会计EXP+50，智力+3。", "success");
          },
        },
        {
          text: "📝 记录交易日志",
          hint: "销售XP+30",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f1028PriceInsightDone = true;
            gx("sales", 30);
            msg("📝 你开始记录每次交易的思考过程。销售EXP+30。", "info");
          },
        },
      ],
    },

    // ===== 2. F→E 财富仪表盘 =====
    {
      id: "f1028_wealth_dashboard",
      phase: "street",
      icon: "🏦",
      title: "你的财富仪表盘",
      story: "你制作了一张自己的财富仪表盘——\n\n左边是资产：现金、股票、比特币、房产、收藏品……\n右边是负债：房租、贷款、欠款……\n中间是一条曲线，记录着你从零到现在的财富轨迹。\n\n看着这条曲线，你感慨万千。\n\n那些艰苦的日子，那些焦虑的夜晚，\n那些差点放弃的时刻……\n\n这条曲线不仅是财富的增长，\n更是你在这个城市里成长的轨迹。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f1028WealthDashDone) return false;
        var totalEarned = (st.resources && st.resources.totalEarned) || 0;
        return totalEarned >= 30000 && st.player.day >= 60;
      },
      probability: 0.025,
      repeatable: false,
      choices: [
        {
          text: "🏦 制定财务目标",
          hint: "会计XP+40, 心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f1028WealthDashDone = true;
            gx("accounting", 40);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            msg("🏦 你制定了清晰的财务目标和执行计划。会计EXP+40，心智+5。", "success");
          },
        },
        {
          text: "📈 分享你的财富故事",
          hint: "名气+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f1028WealthDashDone = true;
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            msg("📈 你分享了自己的财富故事，激励了很多人。名气+5。", "info");
          },
        },
      ],
    },

    // ===== 3. F→G 健康趋势 =====
    {
      id: "f1028_health_trend",
      phase: "street",
      icon: "❤️",
      title: "健康数据不会骗人",
      story: "你翻看了自己这段时间的健康记录——\n\n熬夜的天数、生病的次数、\n体力下降的趋势、精神状态的波动……\n\n这些数据摆在你面前，比任何人的劝告都更有说服力。\n\n你意识到：身体才是你在这个城市里最核心的资产。\n\n没有健康，赚再多钱也没有意义。\n\n该好好照顾自己了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f1028HealthTrendDone) return false;
        var fatigue = (st.needs && st.needs.fatigue) || 0;
        var health = (st.status && st.status.health) || 100;
        return (fatigue >= 60 || health <= 70) && st.player.day >= 40;
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "💪 开始锻炼身体",
          hint: "健康+10, 疲劳-10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f1028HealthTrendDone = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 10);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            msg("💪 你决定开始锻炼身体，健康第一。健康+10，疲劳-10。", "success");
          },
        },
        {
          text: "😴 调整作息时间",
          hint: "疲劳-15",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f1028HealthTrendDone = true;
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            msg("😴 你决定调整作息，保证充足睡眠。疲劳-15。", "info");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    if (typeof RANDOM_EVENTS.push === "function") {
      RANDOM_EVENTS.push(EVENTS[i]);
    }
  }
})();