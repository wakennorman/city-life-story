/**
 * 域C联动增强 R366 — 职业倦怠预防叙事化
 * [全系统自洽修复] 域C R366: 倦怠预防首次被事件叙事消费
 *
 * 2个新事件：
 *   ① C→G: 工作生活平衡觉醒 — 主动调整工作节奏获得身心平衡
 *   ② C→G: 职业倦怠预防策略 — 学习预防倦怠的方法
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== ① C→G: 工作生活平衡觉醒 =====
  var work_life_balance_awareness = {
    id: "work_life_balance_awareness",
    title: "⚖️ 平衡觉醒",
    phase: "street",
    repeatable: true,
    cooldownDays: 120,
    priority: 60,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      // 冷却检查
      if (st.flags._balanceAwakeningCooldown) {
        if ((st.player.day || 0) - st.flags._balanceAwakeningCooldown < 120) return false;
      }
      // 检查倦怠值不太高但也不太低（在中等水平，有预防空间）
      if (!st.careerCapital) return false;
      var cap = st.careerCapital;
      var burnout = (cap.burnout || 0);
      // 倦怠值在 30-60 之间是预防的最佳窗口期
      if (burnout < 30 || burnout > 60) return false;
      // 检查最近有没有休息过（防止事件刷屏）
      if (st.flags._lastRestDay) {
        var daysSinceRest = (st.player.day || 0) - st.flags._lastRestDay;
        if (daysSinceRest < 30) return false;
      }
      return true;
    },
    probability: 0.1,
    getStory: function (st) {
      var cap = st.careerCapital || {};
      var burnout = Math.round(cap.burnout || 0);
      return "倦怠值维持在「" + burnout + "」的平衡状态，\n" +
             "你意识到不必等到崩溃才需要调整。\n\n" +
             "你开始主动管理自己的工作节奏：\n" +
             "• 每工作5天安排1天休息\n" +
             "• 下班后培养兴趣爱好\n" +
             "• 定期与朋友家人交流\n\n" +
             "这种有节奏的生活方式，让你既能高效工作，又不会过度消耗。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._balanceAwakeningCooldown = st.player.day;
      st.flags._lastRestDay = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
      if (st.player) {
        st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
        st.player.morality = Math.max(0, (st.player.morality || 50) + 2);
      }
      if (typeof addSkillXp === "function") addSkillXp("management", 4);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("⚖️ 平衡觉醒！心情+10，心智+5，道德+2，管理XP+4。你找到了工作与生活的平衡点。", "success");
      }
    },
    choices: [],
    icons: ["⚖️", "平衡"],
  };

  // ===== ② C→G: 职业倦怠预防策略 =====
  var burnout_prevention_strategy = {
    id: "burnout_prevention_strategy",
    title: "🛡️ 预防策略",
    phase: "street",
    repeatable: true,
    cooldownDays: 90,
    priority: 55,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      // 冷却检查
      if (st.flags._preventionStrategyCooldown) {
        if ((st.player.day || 0) - st.flags._preventionStrategyCooldown < 90) return false;
      }
      // 检查倦怠值在中等偏上（40-65），需要预防但还没到危险程度
      if (!st.careerCapital) return false;
      var cap = st.careerCapital;
      var burnout = (cap.burnout || 0);
      if (burnout < 40 || burnout > 65) return false;
      // 检查是否有相关技能（管理、心理等）
      var hasUsefulSkill = false;
      if (st.skills && st.skills.management) {
        if (st.skills.management.level >= 20) hasUsefulSkill = true;
      }
      if (st.skills && st.skills.psychology) {
        if (st.skills.psychology.level >= 15) hasUsefulSkill = true;
      }
      if (!hasUsefulSkill) {
        // 如果没有相关技能，但倦怠值在范围内，也可以触发（作为学习契机）
        hasUsefulSkill = true;
      }
      return true;
    },
    probability: 0.15,
    getStory: function (st) {
      var cap = st.careerCapital || {};
      var burnout = Math.round(cap.burnout || 0);
      return "倦怠值「" + burnout + "」让你意识到：\n" +
             "预防胜于治疗。\n\n" +
             "你开始学习职业倦怠预防的策略：\n" +
             "• 规律作息，保证7小时睡眠\n" +
             "• 每周至少3次运动锻炼\n" +
             "• 培养1-2个与工作无关的兴趣爱好\n" +
             "• 定期做心理健康自我评估\n\n" +
             "这些策略帮助你维持长期的职业活力。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._preventionStrategyCooldown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
      if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
      // 略微增加倦怠恢复速度作为奖励
      if (st.careerCapital) st.careerCapital._preventionBonus = (st.careerCapital._preventionBonus || 0) + 1;
      // [全系统自洽修复] 域A R770b 修复: addSkillXp("health") 假技能键(真实12键无health,XP静默丢弃)→改写真实健康字段 st.status.health(同R621/R631假键修复先例)
      if (st.status && typeof st.status.health === "number") {
        st.status.health = Math.min(100, st.status.health + 3);
      }
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🛡️ 预防策略！心情+8，心智+6，健康+3。你掌握了职业倦怠的预防方法。", "success");
      }
    },
    choices: [],
    icons: ["🛡️", "预防"],
  };

  // 注入事件
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(work_life_balance_awareness, burnout_prevention_strategy);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R366] 2 burnout prevention events registered");
    }
  }
})();
