/**
 * 域C(职业/成长) 联动增强 R693
 * 桥接：
 *   C→B  c693_career_story_echo     职业故事回响 → 消费 state.career+state.employment 数据,
 *     职业→"每一次成长都是故事"叙事回响
 *   C→E  c693_skill_income_insight  技能收入洞察 → 消费 state.skills+state.resources 数据,
 *     职业→"技能价值变现"经济回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR693Loaded) return;
  RANDOM_EVENTS._domainCLinkageR693Loaded = true;

  var EVENTS = [
    {
      id: "c693_career_story_echo", phase: "street", _isChainEvent: false, icon: "📖",
      title: "每一次成长都是故事",
      story: "回顾职场历程,每一个职位都是一段故事——{desc}",
      triggers: { minDay: 120, interval: 200, maxRepeats: 2, excludeFlags: ["_c693StoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c693StoryCooldown) return false;
        return st.employment && st.employment.currentJob;
      },
      choices: [
        { text: "📝 记录成长", hint: "心智+5,社交XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c693StoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📝 '成长值得被记录。' 你写下了职场故事。心智+5,社交XP+3。", "success");
        }},
        { text: "🗣️ 分享经验", hint: "管理XP+4,名气+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c693StoryCooldown = true;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🗣️ '分享经验,成就他人。' 你分享了职场经验。管理XP+4,名气+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var job = st.employment && st.employment.currentJob;
        return "回顾职场历程——'" + (job ? job.name : "未知") + "的每一天,都是成长的故事。'";
      }
    },
    {
      id: "c693_skill_income_insight", phase: "street", _isChainEvent: false, icon: "💡",
      title: "技能价值变现",
      story: "你的技能正在为你创造真正的价值——{desc}",
      triggers: { minDay: 90, interval: 180, maxRepeats: 2, excludeFlags: ["_c693SkillIncomeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c693SkillIncomeCooldown) return false;
        var hasSkills = st.skills && Object.keys(st.skills).length > 0;
        return hasSkills && (st.resources && (st.resources.totalEarned || 0) > 5000);
      },
      choices: [
        { text: "📊 评估技能价值", hint: "会计XP+5,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c693SkillIncomeCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '技能是最好的投资。' 你评估了技能的市场价值。会计XP+5,智力+3。", "success");
        }},
        { text: "🎯 专注高价值技能", hint: "最高技能XP+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c693SkillIncomeCooldown = true;
          if (st.skills) {
            var best = null, bestLv = -1;
            for (var _sk in st.skills) {
              if (st.skills[_sk] && typeof st.skills[_sk].level === "number" && st.skills[_sk].level > bestLv) {
                bestLv = st.skills[_sk].level; best = _sk;
              }
            }
            if (best && typeof addSkillXp === "function") { try { addSkillXp(best, 8); } catch(e) {} }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '专注高价值技能,让收入翻倍。' 你专注提升了最有价值的技能。最高技能XP+8。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var totalEarned = (st.resources && st.resources.totalEarned) || 0;
        return "你的技能正在为你创造真正的价值——'累计赚取¥" + Math.round(totalEarned).toLocaleString() + ",技能是最好的投资。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();