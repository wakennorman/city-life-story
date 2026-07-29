/**
 * 域C联动增强 R362 — 跳槽里程碑叙事化
 * [全系统自洽修复] 域C R362: 跳槽次数首次被事件叙事消费
 *
 * 3个新事件：
 *   ① C→B: 首次跳槽叙事 — 第1次跳槽时的职业选择反思
 *   ② C→B: 第5次跳槽叙事 — 中期职业选择的十字路口
 *   ③ C→G: 第10次跳槽叙事 — 频繁跳槽的职业代价与反思
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== ① C→B: 首次跳槽叙事 =====
  var first_job_change = {
    id: "first_job_change",
    title: "🔄 第一份工作变动",
    phase: "street",
    repeatable: false,
    priority: 60,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._firstJobChangeShown) return false;
      // 检查是否至少跳槽过一次
      var career = st.career || {};
      var history = career.jobHistory || [];
      return history.length >= 2; // 至少有2份工作经历才算跳槽1次
    },
    probability: 0.8,
    getStory: function (st) {
      var career = st.career || {};
      var history = career.jobHistory || [];
      var current = history[history.length - 1] || {};
      var previous = history[history.length - 2] || {};
      return "这是你职业生涯的第一次变动。\n\n" +
             "你从「" + (previous.name || "旧职位") + "」跳槽到了「" + (current.name || "新职位") + "」。\n\n" +
             "选择背后有你的考量：更高的薪水？更好的发展？还是对现状的不满？\n" +
             "无论原因如何，这都是你职业成长的第一步。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._firstJobChangeShown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
      if (typeof addSkillXp === "function") addSkillXp("management", 2);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🔄 首次跳槽经历！心智+2，心情+8，你迈出了职业探索的第一步。", "info");
      }
    },
    choices: [],
    icons: ["🔄", "首次"],
  };

  // ===== ② C→B: 第5次跳槽叙事 =====
  var fifth_job_change = {
    id: "fifth_job_change",
    title: "🎯 第五次职业转折",
    phase: "street",
    repeatable: false,
    priority: 75,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._fifthJobChangeShown) return false;
      var career = st.career || {};
      var history = career.jobHistory || [];
      // 检查是否跳槽了至少5次（即至少有6份工作）
      return history.length >= 6;
    },
    probability: 0.5,
    getStory: function (st) {
      var career = st.career || {};
      var history = career.jobHistory || [];
      var current = history[history.length - 1] || {};
      return "这是你职业生涯的第5次变动。\n\n" +
             "频繁的选择让你开始思考：\n" +
             "「我到底在追求什么？」\n" +
             "是不断跳动的薪水，还是真正的职业成长？\n" +
             "或许，是时候找到一个能让你长期发展的方向了？";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._fifthJobChangeShown = st.player.day;
      if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
      if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
      if (typeof addSkillXp === "function") addSkillXp("management", 5);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🎯 第5次职业转折！心智+5，管理XP+5，但心情-10。你开始反思职业道路的选择。", "warning");
      }
    },
    choices: [],
    icons: ["🎯", "第五次"],
  };

  // ===== ③ C→G: 第10次跳槽叙事 =====
  var tenth_job_change = {
    id: "tenth_job_change",
    title: "⚠️ 第十次频繁跳槽",
    phase: "street",
    repeatable: false,
    priority: 85,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._tenthJobChangeShown) return false;
      var career = st.career || {};
      var history = career.jobHistory || [];
      // 检查是否跳槽了至少10次（即至少有11份工作）
      return history.length >= 11;
    },
    probability: 0.3,
    getStory: function (st) {
      var career = st.career || {};
      var history = career.jobHistory || [];
      var current = history[history.length - 1] || {};
      return "这是你职业生涯的第10次变动！\n\n" +
             "雇主们开始对你的频繁跳槽产生疑虑：\n" +
             "「他/她是不是缺乏稳定性？」「真的能在这里长久发展吗？」\n\n" +
             "频繁跳槽虽然让你接触了多种工作，\n" +
             "但也可能让你在某个领域难以深耕。\n" +
             "是时候认真考虑下一份工作了，找到一个既能发挥你多种经验，又能让你长期发展的平台。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._tenthJobChangeShown = st.player.day;
      if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 20);
      if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 10);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("⚠️ 第10次频繁跳槽！心智-10，心情-20。你的职业稳定性受到雇主的质疑。建议慎重选择下一份工作！", "error");
      }
    },
    choices: [],
    icons: ["⚠️", "第十次"],
  };

  // 注入事件
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(first_job_change, fifth_job_change, tenth_job_change);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R362] 3 job change milestone events registered");
    }
  }
})();
