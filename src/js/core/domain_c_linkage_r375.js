/**
 * 域C联动增强 R375 — 年度调薪叙事化
 * [全系统自洽修复] 域C R375: 年度调薪首次被事件叙事消费
 *
 * 1个新事件：
 *   C→E: 年度调薪感悟 — 每年获得薪资调整时的财务感悟
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  var annual_salary_review = {
    id: "annual_salary_review",
    title: "年度调薪",
    phase: "street",
    repeatable: true,
    cooldownDays: 365,
    priority: 75,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._annualSalaryReviewLastYear) {
        if ((st.player.day || 0) - st.flags._annualSalaryReviewLastYear < 365) return false;
      }
      if (!st.career || !st.career.currentJob) return false;
      if (!st.career.currentJob.startDate) return false;
      var daysInJob = (st.player.day || 0) - st.career.currentJob.startDate;
      if (daysInJob < 90) return false;
      st.flags._annualSalaryReviewLastYear = st.player.day;
      return true;
    },
    probability: 0.6,
    getStory: function (st) {
      var job = st.career.currentJob;
      var oldSalary = job.__oldSalary || job.salary || 0;
      var newSalary = job.salary || 0;
      var increase = newSalary - oldSalary;
      var percent = oldSalary > 0 ? Math.round((increase / oldSalary) * 100) : 0;
      job.__oldSalary = newSalary;
      return "又到了一年一度的薪资调整时间。\n\n" +
             "你的月薪从 " + oldSalary + " 调整为 " + newSalary + "，\n" +
             "涨幅 " + percent + "%（+" + increase + "）。\n\n" +
             "这份涨薪是对过去一年工作的认可，\n" +
             "也意味着你的经济状况有了实质性改善。\n" +
             "是时候重新规划你的财务了。\n" +
             "多出来的收入，是用于提升生活品质，还是投资未来？";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._annualSalaryReviewLastYear = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
      if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("年度调薪！心情+10，心智+3。你的薪资获得了上涨，经济状况改善。", "success");
      }
    },
    choices: [],
    icons: ["年度", "调薪"],
  };

  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(annual_salary_review);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R375] 1 annual salary review event registered");
    }
  }
})();
