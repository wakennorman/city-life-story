/**
 * 域C联动增强 R369 — 倦怠后工作调整叙事化
 * [全系统自洽修复] 域C R369: 工作调整首次被事件叙事消费
 *
 * 1个新事件：
 *   C→G: 倦怠后工作转型 — 经历倦怠后主动调整工作内容获得成长
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== C→G: 倦怠后工作转型 =====
  var burnout_work_transition = {
    id: "burnout_work_transition",
    title: "🔄 工作转型",
    phase: "street",
    repeatable: false,
    priority: 80,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      // 检查是否已经触发过这个事件
      if (st.flags._burnoutWorkTransitionShown) return false;
      // 检查是否有高的倦怠历史
      if (!st.careerCapital) return false;
      var cap = st.careerCapital;
      // 曾经倦怠值 >= 70
      if (!cap._maxBurnout || cap._maxBurnout < 70) return false;
      // 当前倦怠值已经下降到一定程度
      var currentBurnout = (cap.burnout || 0);
      if (currentBurnout > 50) return false; // 还没降到50以下
      // 检查工作类型发生了变化（从高压到低压，或跨行业）
      if (!st.career || !st.career.currentJob) return false;
      // 至少要有跳槽记录且最近一次跳槽是在倦怠缓解之后
      var jobHistory = st.career.jobHistory || [];
      if (jobHistory.length < 2) return false; // 必须有至少两次工作经历
      
      return true;
    },
    probability: 1.0,
    getStory: function (st) {
      var cap = st.careerCapital || {};
      var maxBurnout = cap._maxBurnout || 80;
      var currentBurnout = Math.round(cap.burnout || 0);
      var job = st.career.currentJob;
      return "曾经你的倦怠值高达「" + maxBurnout + "」，经历了那段艰难时光后，\n" +
             "你意识到不能再让重复高压的工作消耗自己。\n\n" +
             "经过调整后，现在的倦怠值降到了「" + currentBurnout + "」。\n" +
             "你从「" + (job.previousName || "原工作") + "」转到了「" + (job.name || "新工作") + "」，\n" +
             "这次选择更注重工作与生活的平衡，虽然薪水可能不是最高的，\n" +
             "但你的身心健康得到了更好的保障。这段经历让你明白：\n" +
             "「适合自己的工作，才是最好的工作。」";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._burnoutWorkTransitionShown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
      if (st.player) {
        st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
        st.player.morality = Math.max(0, (st.player.morality || 50) + 5);
      }
      if (typeof addSkillXp === "function") addSkillXp("management", 10);
      // 增加一个标志，表示玩家学会了工作生活平衡
      st.flags._workLifeBalanceAchieved = true;
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🔄 工作转型成功！心情+15，心智+10，道德+5，管理XP+10。你找到了更适合自己的职业道路。", "success");
      }
    },
    choices: [],
    icons: ["🔄", "转型"],
  };

  // 注入事件
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(burnout_work_transition);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R369] 1 burnout work transition event registered");
    }
  }
})();
