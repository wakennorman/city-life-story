/**
 * 域C联动增强：技能分支选择仪式 + 技能连携觉醒 + 分支工作浮现
 * [全系统自洽修复] 域C R173: skill_branches/chainEvent/SYNERGY首次被事件消费
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== 事件1: 技能分支选择仪式 =====
  // 根因：chooseSkillBranch()只发一行消息，零仪式感
  var skill_branch_ritual = {
    id: "skill_branch_ritual",
    title: "🌳 天赋树分叉",
    phase: "street",
    repeatable: false,
    priority: 85,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._skillBranchRitualDone) return false;
      var lastBranch = st.skillBranches && st.skillBranches._lastChosen;
      return !!lastBranch;
    },
    probability: 1.0,
    getText: function (st) {
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
      return label
        ? "你确定了「" + label + "」的发展方向——这是一条单行道，但深耕必有回响。\n\n你想起导师的话：「选定了方向，就别回头。」"
        : "你确定了一个新的发展方向。";
    },
    getStory: function (st) { return this.getText(st); },
    apply: function (st) {
      st.flags._skillBranchRitualDone = true;
      if (st.player) {
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 3);
        st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
      }
      StateManager.addMessage("🌳 你坚定地选择了自己的发展方向！心情+3，心智+2。", "success");
    },
    choices: [],
    icons: ["🌳", "🛤️"],
  };

  // ===== 事件2: 双技能连携觉醒 =====
  // 根因：checkSkillSynergies()检测到新连携后设置flag但没有叙事包装
  var synergy_dual_unlock = {
    id: "synergy_dual_unlock",
    title: "🔗 连携觉醒",
    phase: "street",
    repeatable: true,
    cooldownDays: 60,
    priority: 70,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (!st.flags._justUnlockedDual || !st.flags._currentUnlockSynergyId) return false;
      return true;
    },
    probability: 1.0,
    getText: function (st) {
      var sid = st.flags && st.flags._currentUnlockSynergyId;
      var syn = typeof SKILL_SYNERGY_DUAL === "object" ? (SKILL_SYNERGY_DUAL[sid] || null) : null;
      if (syn) {
        return syn.icon + "「" + syn.name + "」觉醒！\n\n" + syn.desc;
      }
      return "两门技能的交汇产生了奇妙的化学反应！";
    },
    getStory: function (st) { return this.getText(st); },
    apply: function (st) {
      st.flags._justUnlockedDual = false;
      st.flags._currentUnlockSynergyId = null;
      st.flags._synergyDualEventShown = st.player.day;
      if (st.player) st.player.happiness = Math.min(100, (st.player.happiness || 50) + 5);
      StateManager.addMessage("🔗 连携觉醒！你感受到某种力量在汇聚……心情+5。", "success");
    },
    choices: [],
    icons: ["🔗", "⚡"],
  };

  // ===== 事件3: 三联携降临 =====
  var synergy_triple_unlock = {
    id: "synergy_triple_unlock",
    title: "👑 三连携降临",
    phase: "street",
    repeatable: true,
    cooldownDays: 180,
    priority: 90,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (!st.flags._justUnlockedTriple || !st.flags._currentUnlockSynergyId) return false;
      return true;
    },
    probability: 1.0,
    getText: function (st) {
      var sid = st.flags && st.flags._currentUnlockSynergyId;
      var syn = typeof SKILL_SYNERGY_TRIPLE === "object" ? (SKILL_SYNERGY_TRIPLE[sid] || null) : null;
      if (syn) {
        return syn.icon + "「" + syn.name + "」觉醒！\n\n" + syn.desc;
      }
      return "三门技能同时达到临界点——你感受到了前所未有的力量！";
    },
    getStory: function (st) { return this.getText(st); },
    apply: function (st) {
      st.flags._justUnlockedTriple = false;
      st.flags._currentUnlockSynergyId = null;
      st.flags._synergyTripleEventShown = st.player.day;
      if (st.player) {
        st.player.charm = Math.min(100, (st.player.charm || 50) + 3);
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 10);
      }
      StateManager.addMessage("👑 三连携降临！这是少数人能触及的境界。魅力+3，心情+10。", "success");
    },
    choices: [],
    icons: ["👑", "✨"],
  };

  // ===== 事件4: 分支解锁工作浮现 =====
  // 根因：SKILL_BRANCHES的jobBonuses选择了分支才有效，但玩家不知道
  var branch_job_discovery = {
    id: "branch_job_discovery",
    title: "📋 新机会浮现",
    phase: "street",
    repeatable: false,
    priority: 60,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (st.flags._branchJobDiscovered) return false;
      var lastBranch = st.skillBranches && st.skillBranches._lastChosenForJob;
      if (!lastBranch) return false;
      // 需要已选择分支≥30天
      var foundedDay = st.skillBranches && st.skillBranches._lastChosenDay;
      var day = st.player.day || 0;
      return foundedDay && (day - foundedDay) >= 30;
    },
    probability: 0.15,
    getText: function (st) {
      var lastBranch = st.skillBranches && st.skillBranches._lastChosenForJob;
      if (!lastBranch) return "你留意到了一些新的工作机会。";
      var allBranches = typeof SKILL_BRANCHES === "object" ? SKILL_BRANCHES : {};
      var label = "";
      for (var sk in allBranches) {
        var brs = allBranches[sk];
        if (brs && Array.isArray(brs)) {
          for (var bi = 0; bi < brs.length; bi++) {
            if (brs[bi].id === lastBranch) {
              label = (brs[bi].icon || "") + brs[bi].name;
              break;
            }
          }
        }
      }
      return "经过一段时间的学习，" + label + "方向的专精让你发现了一些别人看不到的机会！";
    },
    getStory: function (st) { return this.getText(st); },
    apply: function (st) {
      st.flags._branchJobDiscovered = true;
      if (st.player) {
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 5);
      }
      StateManager.addMessage("📋 你的专长为你打开了新的大门！心情+5。", "info");
    },
    choices: [],
    icons: ["📋", "🔍"],
  };

  // ===== IIFE注入 =====
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(skill_branch_ritual, synergy_dual_unlock, synergy_triple_unlock, branch_job_discovery);
  }
})();
