/**
 * 域C联动增强 R367 — 导师/学徒系统叙事化
 * [全系统自洽修复] 域C R367: 导师关系首次被事件叙事消费
 *
 * 2个新事件：
 *   C→D: 导师指点获得成长 — 从导师那里得到专业指导后的成长感悟
 *   C→F: 首次收徒成就感 — 第一次拥有徒弟的成就感
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== C→D: 导师指点获得成长 =====
  var mentor_guidance_growth = {
    id: "mentor_guidance_growth",
    title: "👨‍🏫 导师指点",
    phase: "street",
    repeatable: true,
    cooldownDays: 60,
    priority: 70,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      // 冷却检查
      if (st.flags._mentorGuidanceCooldown) {
        if ((st.player.day || 0) - st.flags._mentorGuidanceCooldown < 60) return false;
      }
      // 检查是否有导师（career.mentorId）
      if (!st.career || !st.career.mentorId) return false;
      // 检查与导师的好感度是否达到一定水平
      if (!st.relationships) return false;
      var rel = st.relationships[st.career.mentorId];
      if (!rel || (rel.affinity || 0) < 30) return false;
      // 检查导师的技能是否高于玩家
      if (!st.skills || !st.careerCapital) return false;
      var mentorSkills = typeof getNpcMentorSkills === "function" ? getNpcMentorSkills(st.career.mentorId) : {};
      for (var skillKey in mentorSkills) {
        if (st.skills[skillKey] && st.skills[skillKey].level < mentorSkills[skillKey]) {
          // 至少有一个技能导师比玩家高
          return true;
        }
      }
      return false; // 所有技能都比导师高，不需要再指点
    },
    probability: 0.25,
    getStory: function (st) {
      var mentorId = st.career.mentorId;
      var mentorName = typeof getNpcById !== "undefined" ? (getNpcById(mentorId) || {}).name || "导师" : "你的导师";
      return "你找到了「" + mentorName + "」请教问题。\n\n" +
             "导师指出你在「" + (typeof getNpcMentorAdvice === "function" ? getNpcMentorAdvice(st) : "某个技能") + "」上的不足，\n" +
             "并给出了宝贵的建议。\n\n" +
             "听君一席话，胜读十年书！你茅塞顿开，对职业发展有了更清晰的认识。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._mentorGuidanceCooldown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
      if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
      // 随机给一个技能的XP加成
      var skillsToImprove = [];
      if (typeof getNpcMentorSkills === "function") {
        var mentorSkills = getNpcMentorSkills(mentorId);
        for (var skillKey in mentorSkills) {
          if (st.skills[skillKey] && st.skills[skillKey].level < mentorSkills[skillKey]) {
            skillsToImprove.push(skillKey);
          }
        }
      }
      if (skillsToImprove.length > 0) {
        var randomSkill = skillsToImprove[Math.floor(Math.random() * skillsToImprove.length)];
        if (typeof addSkillXp === "function") addSkillXp(randomSkill, 10);
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage("👨‍🏫 导师指点！心情+12，心智+8，随机技能XP+10。", "success");
        }
      } else {
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage("👨‍🏫 导师指点！心情+12，心智+8。", "success");
        }
      }
      // 增加师徒好感
      if (typeof applyAffinityChange === "function") {
        applyAffinityChange(st, mentorId, 5, "mentor_guidance");
      }
    },
    choices: [],
    icons: ["👨‍🏫", "导师"],
  };

  // ===== C→F: 首次收徒成就感 =====
  var first_apprentice_completion = {
    id: "first_apprentice_completion",
    title: "🎓 首个徒弟",
    phase: "street",
    repeatable: false,
    priority: 85,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._firstApprenticeShown) return false;
      // 检查是否有徒弟（career.apprenticeId）
      if (!st.career || !st.career.apprenticeId) return false;
      // 检查是否至少培养了徒弟一段时间
      if (!st.career.apprenticeStartDate) return false;
      var daysWithApprentice = (st.player.day || 0) - st.career.apprenticeStartDate;
      return daysWithApprentice >= 30; // 至少30天
    },
    probability: 1.0,
    getStory: function (st) {
      var apprenticeId = st.career.apprenticeId;
      var apprenticeName = typeof getNpcById !== "undefined" ? (getNpcById(apprenticeId) || {}).name || "徒弟" : "你的徒弟";
      return "你成功带出了第一个徒弟「" + apprenticeName + "」！\n\n" +
             "经过30多天的指导，ta现在已经能够独立处理一些基础工作。\n" +
             "作为导师，你感受到了传承的责任，\n" +
             "也体会到了教学相长的乐趣——教别人的同时，自己也巩固了知识。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._firstApprenticeShown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
      if (st.player) {
        st.player.fame = Math.min(100, (st.player.fame || 50) + 10);
        st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
      }
      if (typeof addSkillXp === "function") addSkillXp("management", 15);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🎓 首个徒弟毕业！ Fame+10，心情+20，心智+10，管理XP+15。你体会到了作为导师的喜悦！", "success");
      }
      // 增加徒弟的好感
      if (typeof applyAffinityChange === "function") {
        applyAffinityChange(st, apprenticeId, 10, "graduation");
      }
    },
    choices: [],
    icons: ["🎓", "首个"],
  };

  // 注入事件
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(mentor_guidance_growth, first_apprentice_completion);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R367] 2 mentor-apprentice narrative events registered");
    }
  }
})();
