/**
 * 域C联动增强 R360 — 技能连携解锁叙事化
 * [全系统自洽修复] 域C R360: 连携工作解锁首次被事件叙事消费
 *
 * 3个新事件：
 *   ① C→F: 连携解锁叙事 — 双技能连携解锁后获得新工作机会(消费flag _justUnlockedDual)
 *   ② C→F: 三联携解锁叙事 — 三联携解锁后获得高端工作机会(消费flag _justUnlockedTriple)
 *   ③ C→G: 连携生涯沉淀 — 持续使用连携技能获得职业沉淀(消费技能连携总数)
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== ① C→F: 连携解锁叙事 =====
  var synergy_unlock_dual_story = {
    id: "synergy_unlock_dual_story",
    title: "🔗 技能连携",
    phase: "street",
    repeatable: false,
    priority: 75,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (!st.flags._justUnlockedDual || !st.flags._currentUnlockSynergyId) return false;
      if (st.flags._synergyUnlockStoryShown) return false;
      return true;
    },
    probability: 1.0,
    getStory: function (st) {
      var sid = st.flags && st.flags._currentUnlockSynergyId;
      var syn = typeof SKILL_SYNERGY_DUAL !== "undefined" ? (SKILL_SYNERGY_DUAL[sid] || null) : null;
      if (syn) {
        return "你发现" + syn.name + "这门连携技能被解锁了！\n\n" +
               "这两门技能同时使用，让你拥有了别人没有的优势。\n" +
               "也许可以尝试一些新的工作机会？";
      }
      return "两门技能的交汇产生了奇妙的化学反应，你获得了新的职业视角。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._synergyUnlockStoryShown = st.player.day;
      st.flags._justUnlockedDual = false;
      st.flags._currentUnlockSynergyId = null;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("🔗 技能连携解锁！你获得了新的职业视角，心情+8。", "success");
      }
    },
    choices: [],
    icons: ["🔗", "连携"],
  };

  // ===== ② C→F: 三联携解锁叙事 =====
  var synergy_unlock_triple_story = {
    id: "synergy_unlock_triple_story",
    title: "👑 三连携",
    phase: "street",
    repeatable: false,
    priority: 85,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (!st.flags._justUnlockedTriple || !st.flags._currentUnlockSynergyId) return false;
      if (st.flags._synergyTripleStoryShown) return false;
      return true;
    },
    probability: 1.0,
    getStory: function (st) {
      var sid = st.flags && st.flags._currentUnlockSynergyId;
      var syn = typeof SKILL_SYNERGY_TRIPLE !== "undefined" ? (SKILL_SYNERGY_TRIPLE[sid] || null) : null;
      if (syn) {
        return "你解锁了「" + syn.name + "」三连携！\n\n" +
               "这是少数人能触及的境界——三门技能的完美融合。\n" +
               "你已经具备了顶尖专业人士的能力，可以尝试更高阶的工作了。";
      }
      return "三门技能同时达到临界点，你感受到了前所未有的力量！";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._synergyTripleStoryShown = st.player.day;
      st.flags._justUnlockedTriple = false;
      st.flags._currentUnlockSynergyId = null;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
      if (typeof addSkillXp === "function") addSkillXp("management", 5);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("👑 三连携解锁！你具备了顶尖专业能力，管理XP+5，心情+12。", "success");
      }
    },
    choices: [],
    icons: ["👑", "三连携"],
  };

  // ===== ③ C→G: 连携生涯沉淀 =====
  var synergy_career_settling = {
    id: "synergy_career_settling",
    title: "📚 职业沉淀",
    phase: "street",
    repeatable: true,
    cooldownDays: 90,
    priority: 60,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._synergyCareerSettlingCooldown) {
        if ((st.player.day || 0) - st.flags._synergyCareerSettlingCooldown < 90) return false;
      }
      // 检查是否有双技能连携成就
      if (typeof SKILL_SYNERGY_DUAL !== "undefined") {
        var usedSynergies = 0;
        for (var key in st.flags) {
          if (key.startsWith("synergy_")) usedSynergies++;
        }
        if (usedSynergies < 3) return false; // 至少3次连携解锁
      }
      return true;
    },
    probability: 0.05,
    getStory: function (st) {
      var synergyCount = 0;
      for (var key in st.flags) {
        if (key.startsWith("synergy_")) synergyCount++;
      }
      return "回顾职业生涯，你已经解锁了" + synergyCount + "个技能连携。\n\n" +
             "这些技能组合让你在工作中游刃有余，形成了独特的职业竞争力。\n" +
             "是时候把这些经验沉淀下来，指导更年轻的同行？";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._synergyCareerSettlingCooldown = st.player.day;
      if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
      if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
      if (typeof addSkillXp === "function") addSkillXp("management", 8);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage("📚 职业经验沉淀！心智+5，心情+10，管理XP+8。", "success");
      }
    },
    choices: [],
    icons: ["📚", "沉淀"],
  };

  // 注入事件
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(synergy_unlock_dual_story, synergy_unlock_triple_story, synergy_career_settling);
    if (typeof console !== "undefined" && console.log) {
      console.log("[C R360] 3 synergy unlock narrative events registered");
    }
  }
})();
