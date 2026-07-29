/**
 * 域C联动增强 R376 — 退休叙事化
 * [全系统自洽修复] 域C R376: 退休首次被事件叙事消费
 * [全系统自洽修复] R376 A类: getStory/getText→text函数(旧格式不被事件引擎读取,故事永不可见)
 * [全系统自洽修复] R376 A类: 添加triggers字段(缺触发条件,事件永不可达)
 *
 * 1个新事件：
 *   C→G: 退休感悟 — 退休时的人生感悟与职业总结
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR376Loaded) return;
  RANDOM_EVENTS._domainCLinkageR376Loaded = true;

  // ===== C→G: 退休感悟 =====
  var EVENTS = [{
    id: "retirement_reflection",
    title: "退休感悟",
    icon: "🌅",
    phase: "street",
    _isChainEvent: false,
    triggers: { minDay: 365, interval: 730, maxRepeats: 1, excludeFlags: ["_retirementReflected"] },
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._retirementReflected) return false;
      // 检查年龄是否达到退休年龄（通常60岁）
      if (!st.player || (st.player.age || 0) < 60) return false;
      // 检查是否有长期稳定的工作经历
      if (!st.career || !st.career.currentJob) return false;
      var job = st.career.currentJob;
      // 工作至少10年（3650天）
      if ((job.workDays || 0) < 3650) return false;
      // 检查是否有技能分支的成就
      if (!st.skillBranches || !st.skillBranches._lastChosen) return false;
      // 检查是否有高级技能（>=50级）
      var hasAdvancedSkill = false;
      if (st.skills) {
        for (var skillKey in st.skills) {
          var skill = st.skills[skillKey];
          if (skill && skill.level >= 50) {
            hasAdvancedSkill = true;
            break;
          }
        }
      }
      if (!hasAdvancedSkill) return false;

      return true;
    },
    text: function (st) {
      if (!st) return null;
      var age = st.player.age || 0;
      var job = st.career.currentJob;
      var totalWorkDays = job.workDays || 0;
      var years = Math.floor(totalWorkDays / 365);

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

      // 找到最高等级的技能
      var topSkill = null;
      var topSkillLevel = 0;
      if (st.skills) {
        for (var skillKey in st.skills) {
          var skill = st.skills[skillKey];
          if (skill && skill.level > topSkillLevel) {
            topSkillLevel = skill.level;
            topSkill = skillKey;
          }
        }
      }
      var topSkillName = topSkill ? topSkill.replace(/./g, function(c) {
        var map = {coding:'编程',sales:'销售',management:'管理',accounting:'会计',
                   english:'英语',physique:'体质',agility:'敏捷',intelligence:'智力',
                   mental:'心智',charming:'魅力',repair:'维修',welding:'焊接',
                    cooking:'烹饪',driving:'驾驶',electrician:'电工',medicine:'医学'};
        return map[c] || c;
      }) : "某项技能";

      return "你" + age + "岁了，站在职业生涯的终点回望。\n\n" +
             "你工作了" + years + "年（" + totalWorkDays + "天），\n" +
             "在「" + branchLabel + "」方向上深耕，" + topSkillName + "达到 Lv." + topSkillLevel + "，\n" +
             "从最初的手忙脚乱，到如今的游刃有余。\n\n" +
             "你教会过徒弟，带过团队，创过业，也经历过失败的痛苦和成功的喜悦。\n" +
             "现在的你，不再需要为了生计奔波，\n" +
             "可以悠闲地享受退休生活，\n" +
             "或者选择继续发挥余热，指导年轻一代。\n\n" +
             "你这一生，或许平凡，但绝不平庸。\n" +
             "每一天的汗水，每一次的选择，都塑造了现在的你。\n" +
             "这就是职业的意义——不仅仅是谋生，更是实现自我价值。";
    },
    choices: [
      {
        text: "🌅 享受退休生活", hint: "心情+25,心智+15,声望+20",
        apply: function (st) {
          if (!st) return;
          st.flags = st.flags || {};
          st.flags._retirementReflected = st.player ? st.player.day : true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25);
          if (st.player) {
            st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            st.player.fame = Math.min(100, (st.player.fame || 50) + 20);
          }
          if (typeof addSkillXp === "function") {
            addSkillXp("management", 30);
            addSkillXp("social", 20);
          }
          if (typeof StateManager !== "undefined" && StateManager.addMessage) {
            StateManager.addMessage("🌅 退休感悟！心情+25，心智+15，声望+20，管理XP+30，社交XP+20。你圆满结束了职业生涯。", "success");
          }
        }
      },
      {
        text: "📖 写下回忆录", hint: "智力+15,声望+10,置_c376Memoir",
        apply: function (st) {
          if (!st) return;
          st.flags = st.flags || {};
          st.flags._retirementReflected = st.player ? st.player.day : true;
          st.flags._c376Memoir = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            st.player.fame = Math.min(100, (st.player.fame || 50) + 10);
          }
          if (typeof StateManager !== "undefined" && StateManager.addMessage) {
            StateManager.addMessage("📖 你决定将一生的职业经验写成书，留给后人。智力+15，声望+10。", "success");
          }
        }
      }
    ]
  }];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
