/**
 * 域C联动增强 R361 — 技能等级里程碑叙事化
 * [全系统自洽修复] 域C R361: 技能等级首次被事件叙事消费
 *
 * 3个新事件：
 *   ① C→F: 技能Lv.30里程碑 — 技能达30级获得职业飞跃反馈
 *   ② C→F: 技能Lv.50里程碑 — 技能达50级获得专家级认可反馈
 *   ③ C→F: 技能Lv.70里程碑 — 技能达70级获得大师级地位反馈
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== ① C→F: 技能Lv.30里程碑 =====
  var skill_level_30_milestone = {
    id: "skill_level_30_milestone",
    title: "🎯 30级里程碑",
    phase: "street",
    repeatable: false,
    priority: 70,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._skillLevel30StoryShown) return false;
      // 检查是否有任意技能达到30级
      if (typeof state === "undefined" || !state || !state.skills) return false;
      for (var skillKey in state.skills) {
        var skill = state.skills[skillKey];
        if (skill && skill.level && skill.level >= 30) {
          return true;
        }
      }
      return false;
    },
    probability: 0.5,
    getStory: function (st) {
      var reachedSkills = [];
      for (var skillKey in state.skills) {
        var skill = state.skills[skillKey];
        if (skill && skill.level && skill.level >= 30) {
          var skillName = getSkillChineseName(skillKey);
          reachedSkills.push(skillName + " Lv." + skill.level);
        }
      }
      return "你的" + reachedSkills.join("、") + "已经达到30级！\n\n" +
             "这个级别已经让你在行业里小有建树了，\n" +
             "许多雇主都对你刮目相看。是时候考虑更专业的路线了？";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._skillLevel30StoryShown = st.player.day;
      // 记录达到的技能
      st.flags._skillLevel30Skills = [];
      for (var skillKey in state.skills) {
        var skill = state.skills[skillKey];
        if (skill && skill.level && skill.level >= 30) {
          st.flags._skillLevel30Skills.push(skillKey);
        }
      }
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
      if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
      if (typeof addSkillXp === "function") addSkillXp("management", 3);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🎯 技能30级里程碑！心智+5，心情+10，管理XP+3。", "success");
      }
    },
    choices: [],
    icons: ["🎯", "30级"],
  };

  // ===== ② C→F: 技能Lv.50里程碑 =====
  var skill_level_50_milestone = {
    id: "skill_level_50_milestone",
    title: "🏆 50级里程碑",
    phase: "street",
    repeatable: false,
    priority: 80,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._skillLevel50StoryShown) return false;
      if (typeof state === "undefined" || !state || !state.skills) return false;
      for (var skillKey in state.skills) {
        var skill = state.skills[skillKey];
        if (skill && skill.level && skill.level >= 50) {
          return true;
        }
      }
      return false;
    },
    probability: 0.3,
    getStory: function (st) {
      var reachedSkills = [];
      for (var skillKey in state.skills) {
        var skill = state.skills[skillKey];
        if (skill && skill.level && skill.level >= 50) {
          var skillName = getSkillChineseName(skillKey);
          reachedSkills.push(skillName + " Lv." + skill.level);
        }
      }
      return "你的" + reachedSkills.join("、") + "已经达到50级！\n\n" +
             "这已经是行业专家的水平了，\n" +
             "同行们开始向你请教，客户也主动找你合作。\n" +
             "你是选择继续深耕，还是尝试跨界发展？";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._skillLevel50StoryShown = st.player.day;
      st.flags._skillLevel50Skills = [];
      for (var skillKey in state.skills) {
        var skill = state.skills[skillKey];
        if (skill && skill.level && skill.level >= 50) {
          st.flags._skillLevel50Skills.push(skillKey);
        }
      }
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
      if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
      if (typeof addSkillXp === "function") addSkillXp("management", 8);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🏆 技能50级里程碑！魅力+5，心智+15，管理XP+8。", "success");
      }
    },
    choices: [],
    icons: ["🏆", "50级"],
  };

  // ===== ③ C→F: 技能Lv.70里程碑 =====
  var skill_level_70_milestone = {
    id: "skill_level_70_milestone",
    title: "⭐ 70级里程碑",
    phase: "street",
    repeatable: false,
    priority: 90,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._skillLevel70StoryShown) return false;
      if (typeof state === "undefined" || !state || !state.skills) return false;
      for (var skillKey in state.skills) {
        var skill = state.skills[skillKey];
        if (skill && skill.level && skill.level >= 70) {
          return true;
        }
      }
      return false;
    },
    probability: 0.1,
    getStory: function (st) {
      var reachedSkills = [];
      for (var skillKey in state.skills) {
        var skill = state.skills[skillKey];
        if (skill && skill.level && skill.level >= 70) {
          var skillName = getSkillChineseName(skillKey);
          reachedSkills.push(skillName + " Lv." + skill.level);
        }
      }
      return "你的" + reachedSkills.join("、") + "已经达到70级！\n\n" +
             "这是顶尖大师的水平，\n" +
             "行业内的权威人物，你的经验可以影响整个领域。\n" +
             "许多年轻人向你拜师学艺，你也面临着传承的选择。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._skillLevel70StoryShown = st.player.day;
      st.flags._skillLevel70Skills = [];
      for (var skillKey in state.skills) {
        var skill = state.skills[skillKey];
        if (skill && skill.level && skill.level >= 70) {
          st.flags._skillLevel70Skills.push(skillKey);
        }
      }
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
      if (st.player) st.player.fame = Math.min(100, (st.player.fame || 50) + 10);
      if (typeof addSkillXp === "function") addSkillXp("management", 15);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("⭐ 技能70级里程碑！ Fame+10，心智+20，管理XP+15。你已成为行业大师！", "success");
      }
    },
    choices: [],
    icons: ["⭐", "70级"],
  };

  // 注入事件
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(skill_level_30_milestone, skill_level_50_milestone, skill_level_70_milestone);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R361] 3 skill level milestone events registered");
    }
  }
})();
