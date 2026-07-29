/**
 * 域C联动增强 R372 — 职业技能跨界应用叙事化
 * [全系统自洽修复] 域C R372: 技能跨界应用首次被事件叙事消费
 *
 * 2个新事件：
 *   C→E: 技能跨界经济收益 — 将某技能应用于不同领域获得额外收益
 *   C→D: 技能跨界社交认可 — 跨界技能获得他人认可建立人脉
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== C→E: 技能跨界经济收益 =====
  var skill_cross_over_income = {
    id: "skill_cross_over_income",
    title: "💰 跨界收益",
    phase: "street",
    repeatable: true,
    cooldownDays: 60,
    priority: 70,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      // 冷却检查
      if (st.flags._crossOverCooldown) {
        if ((st.player.day || 0) - st.flags._crossOverCooldown < 60) return false;
      }
      // 检查是否有多个高技能（至少2个技能>=30）
      if (!st.skills) return false;
      var highSkillCount = 0;
      for (var skillKey in st.skills) {
        var skill = st.skills[skillKey];
        if (skill && skill.level >= 30) {
          highSkillCount++;
        }
      }
      if (highSkillCount < 2) return false; // 至少2个高技能
      // 检查当前工作是否与这些高技能不完全匹配（体现跨界）
      if (!st.career || !st.career.currentJob) return false;
      var job = st.career.currentJob;
      // 检查工作需求是否只涉及其中一个高技能，而不是所有高技能
      var jobRequirements = job.requirements || {};
      var matchedSkills = 0;
      for (var reqKey in jobRequirements) {
        if (st.skills[reqKey] && st.skills[reqKey].level >= 30) {
          matchedSkills++;
        }
      }
      // 如果高技能中只有部分被工作用到，说明有跨界可能
      if (matchedSkills >= highSkillCount) return false; // 所有高技能都用到了，不是跨界
      
      st.flags._crossOverCooldown = st.player.day;
      return true;
    },
    probability: 0.25,
    getStory: function (st) {
      var skills = [];
      if (st.skills) {
        for (var skillKey in st.skills) {
          var skill = st.skills[skillKey];
          if (skill && skill.level >= 30) {
            skills.push(skillKey + " Lv." + skill.level);
          }
        }
      }
      return "你发现，你的「" + skills.join("、") + "」技能可以在当前工作中发挥更大作用。\n\n" +
             "虽然这些技能不是工作的核心要求，\n" +
             "但你找到了将它们跨界应用的场景，\n" +
             "这为你带来了额外的收益——也许是更好的工作效率，\n" +
             "也许是额外的副业机会，或是解决问题的独特视角。\n" +
             "多技能组合的优势正在显现。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
      if (st.resources) {
        // 给予一些额外收入作为跨界收益
        var extraIncome = Math.floor((st.resources.cash || 0) * 0.05) + 500;
        st.resources.cash = (st.resources.cash || 0) + extraIncome;
      }
      if (typeof addSkillXp === "function") {
        // 随机给一个高技能少量XP
        var highSkills = [];
        for (var skillKey in st.skills) {
          var skill = st.skills[skillKey];
          if (skill && skill.level >= 30) {
            highSkills.push(skillKey);
          }
        }
        if (highSkills.length > 0) {
          var randomSkill = Random.fromArray(highSkills);
          addSkillXp(randomSkill, 5);
        }
      }
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("💰 跨界收益！心情+12，获得额外收入，随机技能XP+5。你的多技能组合开始产生价值。", "success");
      }
    },
    choices: [],
    icons: ["💰", "跨界"],
  };

  // ===== C→D: 技能跨界社交认可 =====
  var skill_cross_over_social = {
    id: "skill_cross_over_social",
    title: "🤝 跨界认可",
    phase: "street",
    repeatable: true,
    cooldownDays: 90,
    priority: 65,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      // 冷却检查
      if (st.flags._crossOverSocialCooldown) {
        if ((st.player.day || 0) - st.flags._crossOverSocialCooldown < 90) return false;
      }
      // 检查是否有多个高技能（至少2个技能>=30）
      if (!st.skills) return false;
      var highSkillCount = 0;
      for (var skillKey in st.skills) {
        var skill = st.skills[skillKey];
        if (skill && skill.level >= 30) {
          highSkillCount++;
        }
      }
      if (highSkillCount < 2) return false;
      // 检查是否有已结识的NPC且有一定好感
      if (!st.relationships) return false;
      var hasMetNpc = false;
      for (var npcId in st.relationships) {
        var rel = st.relationships[npcId];
        if (rel && rel.met === true && (rel.affinity || 0) >= 20) {
          hasMetNpc = true;
          break;
        }
      }
      if (!hasMetNpc) return false;
      
      st.flags._crossOverSocialCooldown = st.player.day;
      return true;
    },
    probability: 0.2,
    getStory: function (st) {
      // 找到第一个已结识的高好感NPC
      var bestNpcId = null;
      var bestAff = -1;
      for (var npcId in st.relationships) {
        var rel = st.relationships[npcId];
        if (rel && rel.met === true && (rel.affinity || 0) > bestAff) {
          bestAff = rel.affinity;
          bestNpcId = npcId;
        }
      }
      var npcName = typeof getNpcById !== "undefined" ? (getNpcById(bestNpcId) || {}).name || "朋友" : "朋友";
      
      var skills = [];
      for (var skillKey in st.skills) {
        var skill = st.skills[skillKey];
        if (skill && skill.level >= 30) {
          skills.push(skillKey);
        }
      }
      
      return "你在「" + (skills[0] || "某项") + "」技能上的跨界应用，\n" +
             "得到了「" + npcName + "」的认可。\n\n" +
             "跨领域的技能组合让你看到别人看不到的机会，\n" +
             "「原来这个技能还可以这么用！」\n" +
             "朋友对你的见识和能力有了新的评价，\n" +
             "你们的关系因此更近了一步。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
      if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
      // 增加与该NPC的好感
      if (typeof applyAffinityChange === "function" && st.relationships) {
        // 找到第一个高好感NPC并增加好感
        for (var npcId in st.relationships) {
          var rel = st.relationships[npcId];
          if (rel && rel.met === true && (rel.affinity || 0) >= 20) {
            applyAffinityChange(st, npcId, 8, "cross_over_recognition");
            break;
          }
        }
      }
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🤝 跨界认可！心情+8，心智+3，首个高好感NPC好感+8。你的跨界能力获得了他人认可。", "success");
      }
    },
    choices: [],
    icons: ["🤝", "认可"],
  };

  // 注入事件
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(skill_cross_over_income, skill_cross_over_social);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R372] 2 skill cross-over narrative events registered");
    }
  }
})();
