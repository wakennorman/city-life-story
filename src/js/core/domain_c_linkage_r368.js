/**
 * 域C联动增强 R368 — 职业成就墙叙事化
 * [全系统自洽修复] 域C R368: 职业成就墙首次被事件叙事消费
 *
 * 3个新事件：
 *   C→F: 职业成就墙更新 — 获得新成就时在成就墙上展示
 *   C→F: 连续工作纪念日 — 在职某公司的纪念日的成就感
 *   C→G: 职业路径选择反思 — 回顾职业道路时的成长感悟
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== C→F: 职业成就墙更新 =====
  var career_wall_update = {
    id: "career_wall_update",
    title: "🏆 成就更新",
    phase: "street",
    repeatable: true,
    cooldownDays: 15,
    priority: 50,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      // 冷却检查
      if (st.flags._careerWallCooldown) {
        if ((st.player.day || 0) - st.flags._careerWallCooldown < 15) return false;
      }
      // 检查是否有新的成就（成就数增加）
      if (!st.player || !st.player.achievements) return false;
      var currentCount = st.player.achievements.length;
      // 检查是否有记录上次成就数
      if (st.flags._lastAchievementCount === undefined) {
        st.flags._lastAchievementCount = currentCount;
        return false; // 第一次记录，不触发
      }
      if (currentCount <= st.flags._lastAchievementCount) return false; // 没有新成就
      st.flags._lastAchievementCount = currentCount;
      return true;
    },
    probability: 0.8,
    getStory: function (st) {
      var achievements = st.player.achievements || [];
      var latest = achievements[achievements.length - 1];
      return "你的职业成就墙上又新增了一个成就：「" + (latest.name || "未知成就") + "」。\n\n" +
             "这些成就记录了你职业道路上的重要时刻，\n" +
             "每一个都是你努力和成长的见证。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._careerWallCooldown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
      if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🏆 成就墙更新！心情+5，心智+2。你获得了一个新职业成就。", "info");
      }
    },
    choices: [],
    icons: ["🏆", "成就"],
  };

  // ===== C→F: 连续工作纪念日 =====
  var work_anniversary = {
    id: "work_anniversary",
    title: "📅 工作周年",
    phase: "street",
    repeatable: true,
    cooldownDays: 365,
    priority: 60,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      // 冷却检查：每年只触发一次
      if (st.flags._workAnniversaryLastDay) {
        var daysPassed = (st.player.day || 0) - st.flags._workAnniversaryLastDay;
        if (daysPassed < 365) return false;
      }
      // 检查是否有当前工作
      if (!st.career || !st.career.currentJob) return false;
      // 检查当前工作是否已经持续至少30天
      if (!st.career.currentJob.startDate) return false;
      var daysInJob = (st.player.day || 0) - st.career.currentJob.startDate;
      if (daysInJob < 30) return false;
      // 设置纪念日标志
      st.flags._workAnniversaryLastDay = st.player.day;
      return true;
    },
    probability: 0.5,
    getStory: function (st) {
      var job = st.career.currentJob;
      var daysInJob = (st.player.day || 0) - job.startDate;
      var years = Math.floor(daysInJob / 365);
      var remaining = daysInJob % 365;
      return "你在「" + job.name + "」已经工作了「" + daysInJob + "」天（约" + years + "年" + remaining + "天）。\n\n" +
             "连续工作的经历让你对这家公司和工作内容有了深刻的理解，\n" +
             "也许你已经成为了团队中的骨干力量。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._workAnniversaryLastDay = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
      if (st.player) st.player.fame = Math.min(100, (st.player.fame || 50) + 5);
      if (typeof addSkillXp === "function") addSkillXp("management", 5);
      // 发放一些奖金作为纪念
      if (st.resources) {
        st.resources.cash = (st.resources.cash || 0) + (st.career.currentJob.salary || 0) * 0.1;
      }
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("📅 工作周年纪念日！心情+10， Fame +5，管理XP+5，获得相当于10%月薪的奖金。", "success");
      }
    },
    choices: [],
    icons: ["📅", "周年"],
  };

  // ===== C→G: 职业路径选择反思 =====
  var career_path_reflection = {
    id: "career_path_reflection",
    title: "🗺️ 职业路标",
    phase: "street",
    repeatable: true,
    cooldownDays: 180,
    priority: 70,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      // 冷却检查
      if (st.flags._careerReflectionCooldown) {
        if ((st.player.day || 0) - st.flags._careerReflectionCooldown < 180) return false;
      }
      // 检查是否有至少2段不同的工作经历（跳槽过）
      if (!st.career || !st.career.jobHistory) return false;
      if (st.career.jobHistory.length < 2) return false;
      // 检查当前工作年限是否达到一定长度（避免刚跳槽就反思）
      if (st.career.currentJob && st.career.currentJob.startDate) {
        var daysInCurrentJob = (st.player.day || 0) - st.career.currentJob.startDate;
        if (daysInCurrentJob < 90) return false; // 至少工作90天
      }
      st.flags._careerReflectionCooldown = st.player.day;
      return true;
    },
    probability: 0.2,
    getStory: function (st) {
      var history = st.career.jobHistory || [];
      var current = history[history.length - 1] || {};
      var previous = history[history.length - 2] || {};
      return "回顾你的职业道路，从「" + (previous.name || "起点") + "」到「" + (current.name || "当前") + "」，\n" +
             "你已经走过了相当长的路。\n\n" +
             "每次选择都塑造了今天的你，\n" +
             "是时候思考：下一站，你想去哪里？";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._careerReflectionCooldown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
      if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
      if (typeof addSkillXp === "function") addSkillXp("management", 3);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🗺️ 职业路标反思！心情+8，心智+6，管理XP+3。你开始规划职业发展方向。", "info");
      }
    },
    choices: [],
    icons: ["🗺️", "反思"],
  };

  // 注入事件
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(career_wall_update, work_anniversary, career_path_reflection);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R368] 3 career wall narrative events registered");
    }
  }
})();
