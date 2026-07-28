/**
 * 域G(核心机制/生命周期) 联动增强 R705
 * 桥接：
 *   G→B  g705_life_chapter_echo     人生章节回响 → 消费 state.player+state.flags 数据,
 *     生命→"人生阶段的叙事回响"
 *   G→C  g705_age_skill_synergy     年龄技能协同 → 消费 state.player+state.skills 数据,
 *     生命→"年龄与技能的协同效应"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR705Loaded) return;
  RANDOM_EVENTS._domainGLinkageR705Loaded = true;

  var EVENTS = [
    {
      id: "g705_life_chapter_echo", phase: "street", _isChainEvent: false, icon: "📖",
      title: "人生阶段的叙事回响",
      story: "每个阶段都有独特的故事——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 2, excludeFlags: ["_g705ChapterCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g705ChapterCooldown) return false;
        return st.player && (st.player.age || 0) >= 25;
      },
      choices: [
        { text: "📝 写人生回忆", hint: "心智+6,社交XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g705ChapterCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📝 '人生如书,每一章都精彩。' 心智+6,社交XP+3。", "success");
        }},
        { text: "🎯 规划下一章", hint: "管理XP+5,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g705ChapterCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '规划下一章,让人生更精彩。' 管理XP+5,智力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var age = (st.player && st.player.age) || 0;
        return "每个阶段都有独特的故事——'年龄" + age + "岁,人生阶段的叙事回响,每个阶段都值得被铭记。'";
      }
    },
    {
      id: "g705_age_skill_synergy", phase: "street", _isChainEvent: false, icon: "📈",
      title: "年龄与技能的协同效应",
      story: "年龄增长带来的不仅是皱纹,还有技能的沉淀——{desc}",
      triggers: { minDay: 200, interval: 300, maxRepeats: 1, excludeFlags: ["_g705AgeSkillDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g705AgeSkillDone) return false;
        return st.player && (st.player.age || 0) >= 30 && st.skills;
      },
      choices: [
        { text: "📚 沉淀经验", hint: "所有技能XP+3,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g705AgeSkillDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          var count = 0;
          if (st.skills) {
            for (var _sk in st.skills) {
              if (st.skills[_sk] && typeof st.skills[_sk].xp === "number" && count < 5) {
                st.skills[_sk].xp = (st.skills[_sk].xp || 0) + 3;
                count++;
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '年龄是经验的沉淀。' 所有技能XP+3,心智+4。", "success");
        }},
        { text: "🎯 发挥优势", hint: "最高技能XP+10,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g705AgeSkillDone = true;
          if (st.skills) {
            var best = null, bestLv = -1;
            for (var _sk2 in st.skills) {
              if (st.skills[_sk2] && typeof st.skills[_sk2].level === "number" && st.skills[_sk2].level > bestLv) {
                bestLv = st.skills[_sk2].level; best = _sk2;
              }
            }
            if (best && typeof addSkillXp === "function") { try { addSkillXp(best, 10); } catch(e) {} }
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '发挥年龄优势,做最擅长的事。' 最高技能XP+10,管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var age = (st.player && st.player.age) || 0;
        return "年龄增长带来的不仅是皱纹,还有技能的沉淀——'年龄" + age + "岁,年龄与技能的协同效应正在显现。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
