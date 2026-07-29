/**
 * 域C联动增强 R374 — 职业发展里程碑完整叙事链
 * [全系统自洽修复] 域C R374: 职业发展里程碑完整叙事链整合
 *
 * 2个新事件：
 *   C→G: 职业里程碑回顾 — 回顾职业发展历程的总结性叙事
 *   C→H: 职业经验创业转化 — 将职场经验转化为创业资本（C→H桥接）
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== C→G: 职业里程碑回顾 =====
  var career_milestone_review = {
    id: "career_milestone_review",
    title: "📜 职业回顾",
    phase: "street",
    repeatable: false,
    priority: 85,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._careerMilestoneReviewShown) return false;
      // 检查是否工作了足够长的时间（至少365天）
      if (!st.career || !st.career.currentJob) return false;
      var totalWorkDays = 0;
      var history = st.career.jobHistory || [];
      // 计算所有工作的总天数
      for (var i = 0; i < history.length; i++) {
        var job = history[i];
        if (job.startDate && job.endDate) {
          totalWorkDays += (job.endDate - job.startDate);
        } else if (job.startDate) {
          // 当前工作，计算至今的天数
          totalWorkDays += ((st.player.day || 0) - job.startDate);
        }
      }
      if (totalWorkDays < 365) return false; // 至少工作1年
      
      // 检查是否有技能分支的选择
      if (!st.skillBranches || !st.skillBranches._lastChosen) return false;
      
      return true;
    },
    probability: 0.4,
    getStory: function (st) {
      var totalWorkDays = 0;
      var history = st.career.jobHistory || [];
      for (var i = 0; i < history.length; i++) {
        var job = history[i];
        if (job.startDate) {
          if (job.endDate) {
            totalWorkDays += (job.endDate - job.startDate);
          } else {
            totalWorkDays += ((st.player.day || 0) - job.startDate);
          }
        }
      }
      var years = Math.floor(totalWorkDays / 365);
      var remaining = totalWorkDays % 365;
      
      var lastBranch = st.skillBranches && st.skillBranches._lastChosen;
      var allBranches = typeof SKILL_BRANCHES === "object" ? SKILL_BRANCHES : {};
      var branchLabel = "";
      var skillKey = "";
      for (var sk in allBranches) {
        var brs = allBranches[sk];
        if (brs && Array.isArray(brs)) {
          for (var bi = 0; bi < brs.length; bi++) {
            if (brs[bi].id === lastBranch) {
              branchLabel = (brs[bi].icon || "") + brs[bi].name + "（" + sk + "）";
              skillKey = sk;
              break;
            }
          }
        }
        if (branchLabel) break;
      }
      
      return "经过「" + years + "年" + remaining + "天」的职业旅程，\n" +
             "你回首来时的路：\n\n" +
             "你从最初的「" + (history.length > 0 ? history[0].name || "未知" : "起点") + "」，\n" +
             "到现在「" + (st.career.currentJob && st.career.currentJob.name || "当前工作") + "」，\n" +
             "经历「" + history.length + "」份工作，跨越「" + (st.career.jobHistory.length - 1) + "」次跳槽，\n" +
             "在「" + branchLabel + "」方向上深耕，技能逐渐成熟。\n\n" +
             "这些数据串联起来，构成了你的职业故事——\n" +
             "每一次选择，每一次坚持，每一次调整，\n" +
             "都塑造了今天的你。\n\n" +
             "这段旅程，你收获的不只是薪水，\n" +
             "更是能力的成长、视野的拓展和人生的领悟。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._careerMilestoneReviewShown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
      if (st.player) {
        st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
        st.player.fame = Math.min(100, (st.player.fame || 50) + 5);
      }
      if (typeof addSkillXp === "function") {
        // 给所有高技能少量XP作为回顾的奖励
        for (var skillKey in st.skills) {
          var skill = st.skills[skillKey];
          if (skill && skill.level >= 30) {
            addSkillXp(skillKey, 2);
          }
        }
      }
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("📜 职业回顾！心情+15，心智+10， Fame +5，高技能XP+2。你的职业历程值得铭记。", "success");
      }
    },
    choices: [],
    icons: ["📜", "回顾"],
  };

  // ===== C→H: 职业经验创业转化 =====
  var career_experience_to_startup = {
    id: "career_experience_to_startup",
    title: "🚀 创业转化",
    phase: "street",
    repeatable: false,
    priority: 90,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._careerStartupConversionShown) return false;
      // 检查是否有丰富的职业经验（高技能、多份工作、高管经验等）
      if (!st.career || !st.career.currentJob) return false;
      // 检查是否有管理技能达到一定水平
      if (!st.skills || !st.skills.management) return false;
      if (st.skills.management.level < 30) return false;
      // 检查是否有工作管理经验（upward指标）
      if (!st.careerCapital || (st.careerCapital.upward || 0) < 30) return false;
      // 检查是否有足够的资金启动创业
      if (!st.resources || (st.resources.cash || 0) < 50000) return false; // 至少5万现金
      // 检查年龄（至少25岁）
      if (!st.player || (st.player.age || 0) < 25) return false;
      
      return true;
    },
    probability: 0.3,
    getStory: function (st) {
      var job = st.career.currentJob;
      var upward = (st.careerCapital && st.careerCapital.upward) || 0;
      var managementLv = st.skills && st.skills.management && st.skills.management.level || 0;
      
      return "你在职场积累的经验和人脉，\n" +
             "现在可以转化为创业的资本。\n\n" +
             "「" + (job && job.name || "当前工作") + "」的「" + managementLv + "」级管理经验，\n" +
             "向上管理指数「" + upward + "」，\n" +
             "加上你稳定的现金流，\n" +
             "都指向一个可能性——\n" +
             "是时候自己当老板了。\n\n" +
             "这不是逃避职场，而是将多年积累的价值变现，\n" +
             "创造属于你的事业。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._careerStartupConversionShown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
      if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
      // 置一个标志，表示玩家有创业意愿
      st.flags._hasStartupIntent = true;
      // 增加一些创业相关的属性
      if (typeof addSkillXp === "function") {
        addSkillXp("management", 10); // 管理技能加成
        // 随机增加一个商业相关技能
        if (st.skills && st.skills.accounting) addSkillXp("accounting", 5);
      }
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🚀 创业转化！心情+20，心智+10，管理XP+10，会计XP+5。你的职场经验可以转化为创业资本。", "info");
      }
    },
    choices: [],
    icons: ["🚀", "创业"],
  };

  // 注入事件
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(career_milestone_review, career_experience_to_startup);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R374] 2 career milestone narrative events registered");
    }
  }
})();
