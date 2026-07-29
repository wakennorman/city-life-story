/**
 * 域C联动增强 R363 — 职业倦怠恢复叙事化
 * [全系统自洽修复] 域C R363: 倦怠恢复首次被事件叙事消费
 *
 * 1个新事件：
 *   C→G: 倦怠恢复觉醒 — 倦怠值显著下降后获得成长感悟
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== C→G: 倦怠恢复觉醒 =====
  var burnout_recovery_awakening = {
    id: "burnout_recovery_awakening",
    title: "💪 倦怠恢复",
    phase: "street",
    repeatable: true,
    cooldownDays: 90,
    priority: 70,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      // 冷却检查
      if (st.flags._burnoutRecoveryCooldown) {
        if ((st.player.day || 0) - st.flags._burnoutRecoveryCooldown < 90) return false;
      }
      // 检查倦怠值是否曾经很高且现在显著下降
      if (!st.careerCapital) return false;
      var cap = st.careerCapital;
      // 倦怠值必须曾经 >= 70，现在 <= 50（下降了至少20点）
      if (!cap._prevBurnout || cap._prevBurnout < 70) return false;
      if ((cap.burnout || 0) > 50) return false; // 还没降到50以下
      return true;
    },
    probability: 0.2,
    getStory: function (st) {
      var cap = st.careerCapital || {};
      var prevBurnout = cap._prevBurnout || 80;
      var currentBurnout = Math.round(cap.burnout || 0);
      var drop = prevBurnout - currentBurnout;
      return "经过一段时间的调整，你的倦怠值从「" + prevBurnout + "」降到了「" + currentBurnout + "」。\n\n" +
             "下降了 " + drop + " 点！你终于意识到：\n" +
             "「原来适当的休息不是偷懒，而是为了走得更远。」\n\n" +
             "这段经历让你重新审视工作与生活的平衡，\n" +
             "也许你开始更愿意尝试一些能带来真正快乐的工作了？";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._burnoutRecoveryCooldown = st.player.day;
      // 记录历史倦怠值
      if (!st.careerCapital) st.careerCapital = {};
      st.careerCapital._prevBurnout = Math.round((st.careerCapital.burnout || 0) * 0.8); // 稍微降低，作为下次比较基准
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
      if (st.player) {
        st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
        st.player.morality = Math.max(0, (st.player.morality || 50) + 5);
      }
      if (typeof addSkillXp === "function") addSkillXp("management", 6);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("💪 倦怠恢复觉醒！心智+8，心情+15，道德+5，管理XP+6。你找到了工作与生活的平衡！", "success");
      }
    },
    choices: [],
    icons: ["💪", "恢复"],
  };

  // 注入事件
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(burnout_recovery_awakening);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R363] 1 burnout recovery event registered");
    }
  }
})();
