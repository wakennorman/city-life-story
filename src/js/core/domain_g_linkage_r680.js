/**
 * 域G(核心机制/生命周期) 联动增强 R680
 * 桥接：
 *   G→A  g680_life_stage_data_insight  人生阶段数据洞察 → 消费 state.player+state.stats 数据,
 *     生命→不同人生阶段的数据特征分析
 *   G→E  g680_lifecycle_financial_plan 生命周期财务规划 → 消费 state.player+state.resources 数据,
 *     生命→按人生阶段调整财务策略
 *   G→F  g680_life_quality_dashboard   生活品质仪表盘 → 消费 state.needs+state.status 数据,
 *     生命→综合生活品质指数展示
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR680Loaded) return;
  RANDOM_EVENTS._domainGLinkageR680Loaded = true;

  // 辅助：获取人生阶段标签
  function lifeStageLabel(st) {
    if (!st || !st.player) return "未知";
    var age = st.player.age || 0;
    if (age < 18) return "少年";
    if (age < 25) return "青年";
    if (age < 35) return "奋斗期";
    if (age < 45) return "成熟期";
    if (age < 55) return "中年";
    if (age < 65) return "中老年";
    return "老年";
  }

  // 辅助：计算生活品质指数(0-100)
  function lifeQualityIndex(st) {
    if (!st) return 0;
    var n = st.needs || {};
    var s = st.status || {};
    var health = s.health || 100;
    var happiness = n.happiness || 50;
    var hunger = n.hunger || 50;
    var hygiene = n.hygiene || 50;
    var fatigue = 100 - (n.fatigue || 0);
    var cash = (st.resources && st.resources.cash) || 0;
    var wealthScore = Math.min(100, Math.round(cash / 1000));
    return Math.round((health * 0.3 + happiness * 0.25 + hunger * 0.15 + hygiene * 0.1 + fatigue * 0.1 + wealthScore * 0.1));
  }

  var EVENTS = [
    {
      id: "g680_life_stage_data_insight", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生阶段数据洞察",
      story: "不同的人生阶段,有着不同的数据特征——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 2, excludeFlags: ["_g680StageInsightCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g680StageInsightCooldown) return false;
        return st.player && (st.player.age || 0) >= 20;
      },
      choices: [
        { text: "📈 分析阶段数据", hint: "智力+5,管理XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g680StageInsightCooldown = true;
          st.flags._lifeStageDataTracked = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '了解自己,从数据开始。' 你分析了人生阶段数据。智力+5,管理XP+4。", "success");
        }},
        { text: "🎯 调整方向", hint: "心智+6,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g680StageInsightCooldown = true;
          if (st.player) {
            st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '每个阶段都有不同的使命。' 你根据人生阶段调整了方向。心智+6,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var stage = lifeStageLabel(st);
        var age = (st.player && st.player.age) || 0;
        var day = (st.player && st.player.day) || 0;
        return "不同的人生阶段,有着不同的数据特征——'" + stage + "(年龄" + age + ",第" + day + "天),每个阶段都有不同的数据特征。'";
      }
    },
    {
      id: "g680_lifecycle_financial_plan", phase: "street", _isChainEvent: false, icon: "💰",
      title: "生命周期财务规划",
      story: "你开始根据人生阶段来规划财务——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_g680FinancePlanCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g680FinancePlanCooldown) return false;
        return st.player && (st.resources && (st.resources.cash || 0) >= 5000);
      },
      choices: [
        { text: "📋 制定储蓄计划", hint: "会计XP+7,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g680FinancePlanCooldown = true;
          st.flags._lifecycleSavingsPlan = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 7); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 '储蓄是财务自由的起点。' 你制定了储蓄计划。会计XP+7,心智+4。", "success");
        }},
        { text: "📈 优化投资比例", hint: "管理XP+5,现金+1500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g680FinancePlanCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1500;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '不同人生阶段,需要不同的投资策略。' 你优化了投资比例。管理XP+5,现金+¥1500。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var stage = lifeStageLabel(st);
        var cash = (st.resources && st.resources.cash) || 0;
        return "你开始根据人生阶段来规划财务——'" + stage + "阶段,现金¥" + Math.round(cash).toLocaleString() + "。不同的阶段,需要不同的财务策略。'";
      }
    },
    {
      id: "g680_life_quality_dashboard", phase: "street", _isChainEvent: false, icon: "📋",
      title: "生活品质仪表盘",
      story: "你开始用综合指标来衡量自己的生活品质——{desc}",
      triggers: { minDay: 100, interval: 180, maxRepeats: 3, excludeFlags: ["_g680QualityCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g680QualityCooldown) return false;
        return st.player && (st.player.day || 0) >= 100;
      },
      choices: [
        { text: "📊 全面评估", hint: "心智+5,社交XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g680QualityCooldown = true;
          st.flags._lifeQualityTracked = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '生活质量,不止是钱。' 你全面评估了生活品质。心智+5,社交XP+3。", "success");
        }},
        { text: "🎯 提升短板", hint: "健康+5,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g680QualityCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '找到短板,针对提升。' 你针对性地提升了生活品质。健康+5,心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var lq = lifeQualityIndex(st);
        var stage = lifeStageLabel(st);
        var level = lq >= 80 ? "优秀" : lq >= 60 ? "良好" : lq >= 40 ? "一般" : "较差";
        return "你开始用综合指标来衡量自己的生活品质——'" + stage + "阶段,生活品质指数" + lq + "(" + level + ")。衡量生活,才能改善生活。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();