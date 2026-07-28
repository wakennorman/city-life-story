/**
 * 域D(NPC/社交) 联动增强 R668
 * 桥接：
 *   D→A  d650_social_capital_deep  社交资本深度 → 消费 state.relationships 数据,
 *     社交→"深度关系是财富"数据回响
 *   D→B  d650_npc_story_arc  NPC故事弧 → 消费 state.relationships+state.flags 数据,
 *     社交→"每个人都有自己的故事弧"叙事回响
 *   D→C  d650_mentor_legacy  师徒传承 → 消费 state.relationships+state.skills 数据,
 *     社交→"名师出高徒"职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR668Loaded) return;
  RANDOM_EVENTS._domainDLinkageR668Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR668(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "d650_social_capital_deep", phase: "street", _isChainEvent: false, icon: "💎",
      title: "深度关系是财富",
      story: "你开始意识到深度关系比广泛人脉更有价值——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 1, excludeFlags: ["_d650DeepDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d650DeepDone) return false;
        var met = metNpcsR668(st);
        var deep = 0;
        for (var i = 0; i < met.length; i++) { if (met[i].affinity >= 85) deep++; }
        return deep >= 2;
      },
      choices: [
        { text: "💝 深耕关系", hint: "全NPC好感+4,心情+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d650DeepDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          var met = metNpcsR668(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 4, "深耕关系"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 '深度关系是财富。' 你深耕了重要关系。全NPC好感+4,心情+6。", "success");
        }},
        { text: "📖 记录关系", hint: "社交XP+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d650DeepDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把关系写下来,就是人生故事。' 你记录了深度关系。社交XP+6。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始意识到深度关系比广泛人脉更有价值——'深度关系是财富,值得被珍惜。'";
      }
    },
    {
      id: "d650_npc_story_arc", phase: "street", _isChainEvent: false, icon: "📖",
      title: "每个人都有自己的故事弧",
      story: "你开始关注身边朋友的人生故事弧——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 2, excludeFlags: ["_d650ArcCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d650ArcCooldown) return false;
        var met = metNpcsR668(st);
        var highAff = 0;
        for (var i = 0; i < met.length; i++) { if (met[i].affinity >= 65) highAff++; }
        return highAff >= 2;
      },
      choices: [
        { text: "👂 倾听故事", hint: "好感+6,社交XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d650ArcCooldown = true;
          var met = metNpcsR668(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 6, "倾听故事弧"); } catch(e) {}
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("👂 '每个人都有自己的故事弧。' 你倾听了朋友的故事。好感+6,社交XP+5。", "success");
        }},
        { text: "🤫 尊重隐私", hint: "心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d650ArcCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 '尊重隐私,是交友的基本。' 你选择了尊重。心智+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR668(st);
        return "你开始关注身边朋友的人生故事弧——'" + (met.length > 0 ? met[0].name : "朋友") + "的故事,让我对TA有了更深的了解。'";
      }
    },
    {
      id: "d650_mentor_legacy", phase: "street", _isChainEvent: false, icon: "🎓",
      title: "名师出高徒",
      story: "你遇到了一位愿意指点你的前辈,开始了一段师徒关系——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_d650MentorCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d650MentorCooldown) return false;
        var met = metNpcsR668(st);
        var highAff = 0;
        for (var i = 0; i < met.length; i++) { if (met[i].affinity >= 80) highAff++; }
        return highAff >= 1;
      },
      choices: [
        { text: "🙏 虚心请教", hint: "最高技能XP+8,好感+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d650MentorCooldown = true;
          var met = metNpcsR668(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "拜师请教"); } catch(e) {}
          }
          var skills = st.skills || {};
          var best = null, bestLv = -1;
          for (var k in skills) {
            var lv = skills[k] && typeof skills[k].level === "number" ? skills[k].level : 0;
            if (lv > bestLv) { bestLv = lv; best = k; }
          }
          if (best && typeof addSkillXp === "function") { try { addSkillXp(best, 8); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙏 '听君一席话,胜读十年书。' 你虚心请教,收获颇丰。最高技能XP+8,好感+5。", "success");
        }},
        { text: "💪 自己摸索", hint: "智力+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d650MentorCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '师傅领进门,修行在个人。' 你选择自己摸索。智力+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你遇到了一位愿意指点你的前辈——'在这座城市里,有人愿意帮你,是最大的幸运。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
