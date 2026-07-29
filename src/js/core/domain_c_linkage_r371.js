/**
 * 域C联动增强 R371 — 热爱工作叙事化
 * [全系统自洽修复] 域C R371: 热爱工作首次被事件叙事消费
 *
 * 1个新事件：
 *   C→G: 找到热爱工作 — 通过多段工作经历找到真正热爱的方向，获得职业幸福
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== C→G: 找到热爱工作 =====
  var found_passion_work = {
    id: "found_passion_work",
    title: "❤️ 热爱工作",
    phase: "street",
    repeatable: false,
    priority: 95,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._foundPassionWorkShown) return false;
      // 检查是否有足够的工作经历（至少5段，表明经过多次尝试）
      if (!st.career || !st.career.jobHistory) return false;
      if (st.career.jobHistory.length < 5) return false; // 至少尝试过5份工作
      // 检查当前工作是否是分支工作或高技能要求的工作
      if (!st.career.currentJob) return false;
      var job = st.career.currentJob;
      // 检查是否有分支要求（表明是经过选择的专长方向）
      var hasBranchRequirement = false;
      if (typeof STREET_JOBS !== "undefined" && Array.isArray(STREET_JOBS)) {
        for (var i = 0; i < STREET_JOBS.length; i++) {
          if (STREET_JOBS[i].id === job.id && STREET_JOBS[i].branchRequirement) {
            hasBranchRequirement = true;
            break;
          }
        }
      }
      // 或者高技能要求的工作（技能等级>=30）
      var hasHighSkill = false;
      if (st.skills) {
        for (var skillKey in st.skills) {
          var skill = st.skills[skillKey];
          if (skill && skill.level >= 30) {
            hasHighSkill = true;
            break;
          }
        }
      }
      if (!hasBranchRequirement && !hasHighSkill) return false;
      // 检查倦怠值很低（表明工作让人享受而非痛苦）
      if (!st.careerCapital) return false;
      var burnout = (st.careerCapital.burnout || 0);
      if (burnout > 30) return false; // 倦怠值不能太高
      
      return true;
    },
    probability: 1.0,
    getStory: function (st) {
      var job = st.career.currentJob;
      return "经过「" + (st.career.jobHistory.length - 1) + "」次的工作尝试，\n" +
             "你终于找到了一份真正热爱的「" + job.name + "」。\n\n" +
             "这份工作不再是谋生的手段，而是你施展才华、实现价值的舞台。\n" +
             "每天上班不再是煎熬，而是一种期待；\n" +
             "付出的努力有了意义，收获的成就感源源不断。\n\n" +
             "这就是职业幸福的真正来源——\n" +
             "做你喜欢的事，并且为此获得回报。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._foundPassionWorkShown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 30);
      if (st.player) {
        st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
        st.player.fame = Math.min(100, (st.player.fame || 50) + 15);
      }
      // 大幅降低倦怠值
      if (st.careerCapital) {
        st.careerCapital.burnout = Math.max(0, (st.careerCapital.burnout || 0) - 50);
      }
      if (typeof addSkillXp === "function") addSkillXp("management", 20);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("❤️ 找到热爱工作！心情+30，心智+20， Fame +15，倦怠-50，管理XP+20。你找到了职业幸福的真谛！", "success");
      }
    },
    choices: [],
    icons: ["❤️", "热爱"],
  };

  // 注入事件
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(found_passion_work);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R371] 1 passion work event registered");
    }
  }
})();
