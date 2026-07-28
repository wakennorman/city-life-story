/**
 * 域D(NPC/社交) 联动增强 R652
 * 桥接：
 *   D→A  d646_social_capital_quantified  社交资本量化 → 消费 state.relationships 数据,
 *     社交→"人脉值多少钱"数据回响
 *   D→B  d646_npc_life_milestone  NPC人生里程碑 → 消费 state.relationships+state.player 数据,
 *     社交→"朋友的人生大事"叙事回响
 *   D→C  d646_mentor_culture  师徒文化 → 消费 state.relationships+state.skills 数据,
 *     社交→"名师出高徒"职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR652Loaded) return;
  RANDOM_EVENTS._domainDLinkageR652Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR652(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "d646_social_capital_quantified", phase: "street", _isChainEvent: false, icon: "💎",
      title: "人脉值多少钱",
      story: "你开始量化自己的人脉网络——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 1, excludeFlags: ["_d646QuantDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d646QuantDone) return false;
        var met = metNpcsR652(st);
        return met.length >= 8;
      },
      choices: [
        { text: "📊 深度分析", hint: "智力+5,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d646QuantDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '人脉不是认识多少人,而是能帮多少人。' 你深度分析了社交资本。智力+5,心智+4。", "success");
        }},
        { text: "🤝 主动经营", hint: "全NPC好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d646QuantDone = true;
          var met = metNpcsR652(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 3, "经营人脉"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '人脉是要经营的。' 你主动联系了朋友们。全NPC好感+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR652(st);
        var totalAff = 0;
        for (var i = 0; i < met.length; i++) { totalAff += met[i].affinity; }
        return "你开始量化自己的人脉网络——" + met.length + "位朋友,总好感" + totalAff + "。'人脉值多少钱?取决于你如何经营。'";
      }
    },
    {
      id: "d646_npc_life_milestone", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "朋友的人生大事",
      story: "你身边的朋友正在经历人生中的重要时刻——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 1, excludeFlags: ["_d646MilestoneDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d646MilestoneDone) return false;
        var met = metNpcsR652(st);
        var highAff = 0;
        for (var i = 0; i < met.length; i++) { if (met[i].affinity >= 60) highAff++; }
        return highAff >= 2;
      },
      choices: [
        { text: "💝 真心祝福", hint: "好感+6,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d646MilestoneDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          var met = metNpcsR652(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 6, "祝福朋友"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 '朋友的成功,也是自己的骄傲。' 你真心祝福了朋友们。全NPC好感+6,心情+5。", "success");
        }},
        { text: "📖 记录时刻", hint: "社交XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d646MilestoneDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把朋友的幸福时刻记下来。' 你记录了这些美好时刻。社交XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你身边的朋友正在经历人生中的重要时刻——'朋友的成功,也是自己的骄傲。'";
      }
    },
    {
      id: "d646_mentor_culture", phase: "street", _isChainEvent: false, icon: "🎓",
      title: "名师出高徒",
      story: "你遇到了一位愿意指点你的前辈,开始了一段师徒关系——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 2, excludeFlags: ["_d646MentorCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d646MentorCooldown) return false;
        var met = metNpcsR652(st);
        var highAff = 0;
        for (var i = 0; i < met.length; i++) { if (met[i].affinity >= 75) highAff++; }
        return highAff >= 1;
      },
      choices: [
        { text: "🙏 虚心请教", hint: "最高技能XP+7,好感+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d646MentorCooldown = true;
          var met = metNpcsR652(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 4, "拜师请教"); } catch(e) {}
          }
          var skills = st.skills || {};
          var best = null, bestLv = -1;
          for (var k in skills) {
            var lv = skills[k] && typeof skills[k].level === "number" ? skills[k].level : 0;
            if (lv > bestLv) { bestLv = lv; best = k; }
          }
          if (best && typeof addSkillXp === "function") { try { addSkillXp(best, 7); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙏 '听君一席话,胜读十年书。' 你虚心请教,收获颇丰。最高技能XP+7,好感+4。", "success");
        }},
        { text: "💪 自己摸索", hint: "智力+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d646MentorCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '师傅领进门,修行在个人。' 你选择自己摸索。智力+4。", "success");
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
