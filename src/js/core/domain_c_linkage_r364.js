/**
 * 域C联动增强 R364 — 技能分支解锁工作叙事化
 * [全系统自洽修复] 域C R364: 分支工作解锁首次被事件叙事消费
 *
 * 3个新事件：
 *   ① C→F: 分支工作解锁叙事 — 技能分支解锁后获得特殊工作机会
 *   ② C→F: 分支成就认可 — 使用分支工作获得他人认可
 *   ③ C→E: 分支经济收益 — 分支工作带来的经济优势
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== ① C→F: 分支工作解锁叙事 =====
  var branch_job_unlock_story = {
    id: "branch_job_unlock_story",
    title: "🎓 分支专业",
    phase: "street",
    repeatable: false,
    priority: 70,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._branchJobUnlockStoryShown) return false;
      // 检查是否有分支技能
      if (typeof SKILL_BRANCHES === "undefined") return false;
      // 检查是否有分支解锁的工作
      var hasBranchJob = false;
      if (typeof STREET_JOBS !== "undefined" && Array.isArray(STREET_JOBS)) {
        for (var i = 0; i < STREET_JOBS.length; i++) {
          var job = STREET_JOBS[i];
          if (job.branchRequirement) {
            hasBranchJob = true;
            break;
          }
        }
      }
      if (!hasBranchJob) return false;
      // 检查是否有技能分支的进展
      if (st.skillBranches && st.skillBranches._lastChosen) {
        return true;
      }
      return false;
    },
    probability: 0.6,
    getStory: function (st) {
      var lastBranch = st.skillBranches && st.skillBranches._lastChosen;
      var label = "";
      if (lastBranch) {
        var allBranches = typeof SKILL_BRANCHES === "object" ? SKILL_BRANCHES : {};
        for (var sk in allBranches) {
          var brs = allBranches[sk];
          if (brs && Array.isArray(brs)) {
            for (var bi = 0; bi < brs.length; bi++) {
              if (brs[bi].id === lastBranch) {
                label = (brs[bi].icon || "") + brs[bi].name + "（" + sk + "）";
                break;
              }
            }
          }
        }
      }
      return "你选择了「" + label + "」技能分支，这让你解锁了特殊的工作机会。\n\n" +
             "这些工作只有具备特定分支技能的人才能胜任，\n" +
             "意味着你拥有了比别人更多的职业选择！";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._branchJobUnlockStoryShown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
      if (typeof addSkillXp === "function") addSkillXp("management", 3);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🎓 分支专业解锁！心情+10，管理XP+3。你拥有了特殊的职业机会！", "success");
      }
    },
    choices: [],
    icons: ["🎓", "分支"],
  };

  // ===== ② C→F: 分支成就认可 =====
  var branch_recognition = {
    id: "branch_recognition",
    title: "💼 行业认可",
    phase: "street",
    repeatable: true,
    cooldownDays: 60,
    priority: 65,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._branchRecognitionCooldown) {
        if ((st.player.day || 0) - st.flags._branchRecognitionCooldown < 60) return false;
      }
      // 检查是否有分支工作经验
      if (!st.career || !st.career.currentJob) return false;
      var job = st.career.currentJob;
      // 检查当前工作是否是分支工作
      var hasBranchRequirement = false;
      if (typeof STREET_JOBS !== "undefined" && Array.isArray(STREET_JOBS)) {
        for (var i = 0; i < STREET_JOBS.length; i++) {
          if (STREET_JOBS[i].id === job.id && STREET_JOBS[i].branchRequirement) {
            hasBranchRequirement = true;
            break;
          }
        }
      }
      if (!hasBranchRequirement) return false;
      // 检查从事分支工作的天数
      var workDays = st.career.currentJob?.days || 0;
      return workDays >= 30; // 至少工作了30天
    },
    probability: 0.15,
    getStory: function (st) {
      var job = st.career.currentJob;
      return "你在「" + (job.name || "本专业") + "」岗位上已经工作了足够长的时间，\n" +
             "你的专业技能得到了同事和客户的认可。\n\n" +
             "有人开始向你请教问题，你的分支技能让你在工作中独具优势。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._branchRecognitionCooldown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
      if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 3);
      if (typeof addSkillXp === "function") addSkillXp("social", 5);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("💼 行业认可！心情+8，魅力+3，社交XP+5。你的专业技能得到了认可。", "success");
      }
    },
    choices: [],
    icons: ["💼", "认可"],
  };

  // ===== ③ C→E: 分支经济收益 =====
  var branch_economic_benefit = {
    id: "branch_economic_benefit",
    title: "💰 专业溢价",
    phase: "street",
    repeatable: true,
    cooldownDays: 30,
    priority: 75,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._branchEconomicBenefitCooldown) {
        if ((st.player.day || 0) - st.flags._branchEconomicBenefitCooldown < 30) return false;
      }
      // 检查是否有分支工作经验且收入较高
      if (!st.career || !st.career.currentJob) return false;
      var job = st.career.currentJob;
      var hasBranchRequirement = false;
      if (typeof STREET_JOBS !== "undefined" && Array.isArray(STREET_JOBS)) {
        for (var i = 0; i < STREET_JOBS.length; i++) {
          if (STREET_JOBS[i].id === job.id && STREET_JOBS[i].branchRequirement) {
            hasBranchRequirement = true;
            break;
          }
        }
      }
      if (!hasBranchRequirement) return false;
      // 检查收入是否高于平均水平
      var salary = job.salary || 0;
      return salary > 10000; // 月薪超过1万
    },
    probability: 0.2,
    getStory: function (st) {
      var job = st.career.currentJob;
      var salary = job.salary || 0;
      return "你的「" + (job.branchRequirement?.skill || "专业") + "」分支技能，\n" +
             "让你获得了比普通同事更高的收入——¥" + salary.toLocaleString() + "/月。\n\n" +
             "专业壁垒就是你的经济优势，这就是深耕一个领域的回报。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._branchEconomicBenefitCooldown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
      if (typeof addSkillXp === "function") addSkillXp("accounting", 3);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("💰 专业溢价！心情+12，会计XP+3。你的专业技能带来了经济收益。", "success");
      }
    },
    choices: [],
    icons: ["💰", "溢价"],
  };

  // 注入事件
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(branch_job_unlock_story, branch_recognition, branch_economic_benefit);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R364] 3 branch job narrative events registered");
    }
  }
})();
