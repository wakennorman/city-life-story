/**
 * 域C联动增强 R370 — 技能树分支选择深化叙事化
 * [全系统自洽修复] 域C R370: 分支选择仪式首次被事件深化叙事消费
 *
 * 2个新事件：
 *   C→F: 分支深化认可 — 在分支方向上取得显著进展获得认可
 *   C→G: 分支专精心法 — 深入某个分支后领悟的心法/心得
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== C→F: 分支深化认可 =====
  var branch_deepening_recognition = {
    id: "branch_deepening_recognition",
    title: "📖 分支深化",
    phase: "street",
    repeatable: true,
    cooldownDays: 90,
    priority: 65,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      // 冷却检查
      if (st.flags._branchDeepeningCooldown) {
        if ((st.player.day || 0) - st.flags._branchDeepeningCooldown < 90) return false;
      }
      // 检查是否有选择的分支
      if (!st.skillBranches || !st.skillBranches._lastChosen) return false;
      // 检查该分支相关技能的等级
      var lastBranch = st.skillBranches._lastChosen;
      var allBranches = typeof SKILL_BRANCHES === "object" ? SKILL_BRANCHES : {};
      var skillKey = null;
      // 找到这个分支所属的技能
      for (var sk in allBranches) {
        var brs = allBranches[sk];
        if (brs && Array.isArray(brs)) {
          for (var bi = 0; bi < brs.length; bi++) {
            if (brs[bi].id === lastBranch) {
              skillKey = sk;
              break;
            }
          }
        }
        if (skillKey) break;
      }
      if (!skillKey || !st.skills || !st.skills[skillKey]) return false;
      // 技能等级需要达到一定深度（比如 >= 40）
      if (st.skills[skillKey].level < 40) return false;
      // 检查是否已经有过分支深化的记录（防重复）
      if (st.flags._branchDeepeningLevel && st.flags._branchDeepeningLevel === st.skills[skillKey].level) return false;
      
      // 更新记录
      st.flags._branchDeepeningLevel = st.skills[skillKey].level;
      st.flags._branchDeepeningCooldown = st.player.day;
      return true;
    },
    probability: 0.3,
    getStory: function (st) {
      var lastBranch = st.skillBranches && st.skillBranches._lastChosen;
      var allBranches = typeof SKILL_BRANCHES === "object" ? SKILL_BRANCHES : {};
      var label = "";
      var skillKey = "";
      for (var sk in allBranches) {
        var brs = allBranches[sk];
        if (brs && Array.isArray(brs)) {
          for (var bi = 0; bi < brs.length; bi++) {
            if (brs[bi].id === lastBranch) {
              label = (brs[bi].icon || "") + brs[bi].name;
              skillKey = sk;
              break;
            }
          }
        }
        if (label) break;
      }
      var level = st.skills[skillKey] && st.skills[skillKey].level || 0;
      return "你在「" + label + "」方向上已经达到 Lv." + level + "的深度，\n" +
             "同行们开始认可你的专业度。\n\n" +
             "有人向你请教问题，你的经验开始被重视；\n" +
             "有些工作机会只向有这个深度的人开放。\n" +
             "深耕必有回响，这条路没有选错。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
      if (st.player) st.player.fame = Math.min(100, (st.player.fame || 50) + 3);
      if (typeof addSkillXp === "function") addSkillXp("social", 5);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("📖 分支深化认可！心情+10， Fame +3，社交XP+5。你的专业深度得到了行业认可。", "success");
      }
    },
    choices: [],
    icons: ["📖", "深化"],
  };

  // ===== C→G: 分支专精心法 =====
  var branch_mastery_art = {
    id: "branch_mastery_art",
    title: "💡 心法领悟",
    phase: "street",
    repeatable: false,
    priority: 90,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._branchMasteryArtShown) return false;
      // 检查是否有选择的分支
      if (!st.skillBranches || !st.skillBranches._lastChosen) return false;
      // 检查该分支相关技能的等级是否非常高（>= 70）
      var lastBranch = st.skillBranches._lastChosen;
      var allBranches = typeof SKILL_BRANCHES === "object" ? SKILL_BRANCHES : {};
      var skillKey = null;
      for (var sk in allBranches) {
        var brs = allBranches[sk];
        if (brs && Array.isArray(brs)) {
          for (var bi = 0; bi < brs.length; bi++) {
            if (brs[bi].id === lastBranch) {
              skillKey = sk;
              break;
            }
          }
        }
        if (skillKey) break;
      }
      if (!skillKey || !st.skills || !st.skills[skillKey]) return false;
      if (st.skills[skillKey].level < 70) return false;
      return true;
    },
    probability: 1.0,
    getStory: function (st) {
      var lastBranch = st.skillBranches && st.skillBranches._lastChosen;
      var allBranches = typeof SKILL_BRANCHES === "object" ? SKILL_BRANCHES : {};
      var label = "";
      var skillKey = "";
      for (var sk in allBranches) {
        var brs = allBranches[sk];
        if (brs && Array.isArray(brs)) {
          for (var bi = 0; bi < brs.length; bi++) {
            if (brs[bi].id === lastBranch) {
              label = (brs[bi].icon || "") + brs[bi].name;
              skillKey = sk;
              break;
            }
          }
        }
        if (label) break;
      }
      var level = st.skills[skillKey] && st.skills[skillKey].level || 0;
      return "在「" + label + "」方向深耕至 Lv." + level + "，你终于领悟了这门技能的「心法」。\n\n" +
             "这不仅仅是技术的堆砌，而是对底层逻辑的深刻理解。\n" +
             "现在你看待问题的视角已经不同：\n" +
             "• 别人看到的是表象，你看得到本质\n" +
             "• 别人只能按部就班，你能举一反三\n" +
             "• 别人解决问题靠技巧，你解决问题靠直觉\n\n" +
             "这就是大师与普通人的差距。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._branchMasteryArtShown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25);
      if (st.player) {
        st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
        st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
      }
      if (typeof addSkillXp === "function") {
        addSkillXp(skillKey, 20); // 给予分支技能大量 XP
        addSkillXp("management", 10);
      }
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("💡 心法领悟！心情+25，心智+15，魅力+5，分支技能 XP+20，管理XP+10。你进入了大师境界！", "success");
      }
    },
    choices: [],
    icons: ["💡", "心法"],
  };

  // 注入事件
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(branch_deepening_recognition, branch_mastery_art);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R370] 2 branch mastery narrative events registered");
    }
  }
})();
