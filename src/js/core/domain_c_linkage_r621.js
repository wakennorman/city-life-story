/**
 * 域C(职业/成长) 联动增强 R621
 * 桥接：
 *   C→A  c621_skill_data_analysis  技能数据分析 → 消费 state.skills+state.career 数据,
 *     职业→"技能数据指导职业选择"的数值回响
 *   C→D  c621_mentor_appreciation  师恩难忘 → 消费 state.relationships+state.career 数据,
 *     职业→"职业生涯中的贵人"的社交回响
 *   C→F  c621_career_achievement_ui  职业成就UI → 消费 state.career 数据,
 *     职业→"成就可视化展示"的UI回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR621Loaded) return;
  RANDOM_EVENTS._domainCLinkageR621Loaded = true;

  var EVENTS = [
    // ====== C→A: 技能数据分析 ======
    {
      id: "c621_skill_data_analysis", phase: "street", _isChainEvent: false, icon: "📊",
      title: "技能分析报告",
      story: "你对自己的技能做了一次全面分析——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 10, excludeFlags: ["_c621SkillAnalysisCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c621SkillAnalysisCooldown) return false;
        return true;
      },
      choices: [
        { text: "🔍 深度分析技能组合", hint: "智力+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c621SkillAnalysisCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '我的技能组合是...' 你清晰地看到自己的优势和短板。智力+5,心智+3。", "success");
        }},
        { text: "📈 制定学习计划", hint: "weeklySkillXP+5,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c621SkillAnalysisCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (st.flags) st.flags._weeklySkillBonus = (st.flags._weeklySkillBonus || 0) + 5;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你制定了接下来一个月的学习计划。'有目标,才有动力。' 智力+2,每周技能XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.skills) return null;
        var best = "无", bestLv = 0;
        for (var s in st.skills) {
          if (st.skills[s] && st.skills[s].level > bestLv) { best = s; bestLv = st.skills[s].level; }
        }
        return "你打开技能面板,看着自己的数据。最强的" + best + "已经达到Lv." + bestLv + "了。'是继续强化优势,还是补齐短板?' 你陷入了思考。";
      }
    },

    // ====== C→D: 师恩难忘 ======
    {
      id: "c621_mentor_appreciation", phase: "street", _isChainEvent: false, icon: "🙏",
      title: "师恩难忘",
      story: "你想起了一路走来帮助过你的人——{desc}",
      triggers: { minDay: 40, interval: 120, maxRepeats: 5, excludeFlags: ["_c621MentorCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c621MentorCooldown) return false;
        if (!st.relationships) return false;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 50) return true;
        }
        return false;
      },
      choices: [
        { text: "🙏 登门道谢", hint: "好感+10,心情+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c621MentorCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          // 找好感最高的NPC
          var bestNpc = null, bestAff = 0;
          for (var k in (st.relationships || {})) {
            var r = st.relationships[k];
            if (r && r.met && (r.affinity || 0) > bestAff) { bestAff = r.affinity || 0; bestNpc = k; }
          }
          if (bestNpc && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, bestNpc, 10, "登门道谢"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙏 '谢谢你当初的帮助,没有你就没有我的今天。' 你真诚地道谢。好感+10,心情+5,心智+3。", "success");
        }},
        { text: "📞 打个电话问候", hint: "好感+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c621MentorCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          var bestNpc = null, bestAff = 0;
          for (var k in (st.relationships || {})) {
            var r = st.relationships[k];
            if (r && r.met && (r.affinity || 0) > bestAff) { bestAff = r.affinity || 0; bestNpc = k; }
          }
          if (bestNpc && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, bestNpc, 5, "电话问候"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙏 一个简单的电话,让恩人感受到你的心意。'好孩子,有出息了还记得我。' 好感+5,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你突然想起,当初刚来这座城市时,有一个好心人给了你很多帮助。'没有TA,我可能走不到今天。' 你决定找个机会好好感谢TA。";
      }
    },

    // ====== C→F: 职业成就UI ======
    {
      id: "c621_career_achievement_ui", phase: "street", _isChainEvent: false, icon: "🏅",
      title: "职业成就",
      story: "你回顾了自己的职业生涯,发现了一些值得骄傲的成就——{desc}",
      triggers: { minDay: 50, interval: 90, maxRepeats: 5, excludeFlags: ["_c621CareerAchievementCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c621CareerAchievementCooldown) return false;
        return st.career && st.career.history && st.career.history.length >= 2;
      },
      choices: [
        { text: "🏆 分享成就", hint: "名气+5,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c621CareerAchievementCooldown = true;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏅 '看看我这一路走来的成绩!' 你把自己的职业成就分享了出去。名气+5,心情+5。", "success");
        }},
        { text: "📝 记录在简历里", hint: "智力+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c621CareerAchievementCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏅 你认真更新了简历。'这些经历,都是我的资本。' 智力+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.career || !st.career.history) return null;
        var count = st.career.history.length;
        var last = st.career.history[count - 1];
        var event = (last && last.event) || "这段经历";
        return "你翻看自己的职业历程,已经经历了" + count + "个重要节点。最新的一条是:'" + event + "'。'不知不觉,已经走了这么远。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();