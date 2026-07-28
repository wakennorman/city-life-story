/**
 * 域D(NPC/社交) 联动增强 R636
 * 桥接：
 *   D→A  d636_social_capital_report  社交资本报告 → 消费 state.relationships 数据,
 *     社交→"人脉值多少钱"数据回响
 *   D→B  d636_rumor_mill  谣言工坊 → 消费 state.relationships+state.flags 数据,
 *     社交→"三人成虎"叙事回响
 *   D→C  d636_mentor_match  师徒匹配 → 消费 state.relationships+state.skills 数据,
 *     社交→"名师出高徒"职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR636Loaded) return;
  RANDOM_EVENTS._domainDLinkageR636Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR636(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "d636_social_capital_report", phase: "street", _isChainEvent: false, icon: "📊",
      title: "社交资本报告",
      story: "你的人脉网络,是一笔无形的资产——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 1, excludeFlags: ["_d636ReportDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d636ReportDone) return false;
        var met = metNpcsR636(st);
        return met.length >= 5;
      },
      choices: [
        { text: "📈 量化人脉价值", hint: "智力+4,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d636ReportDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '人脉不是认识多少人,而是多少人认识你。' 你量化了社交资本。智力+4,心智+3。", "success");
        }},
        { text: "🤝 主动维护关系", hint: "全NPC好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d636ReportDone = true;
          var met = metNpcsR636(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 2, "社交资本维护"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '关系是要维护的。' 你主动联系了朋友们。全NPC好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR636(st);
        var totalAff = 0;
        for (var i = 0; i < met.length; i++) { totalAff += met[i].affinity; }
        return "你的人脉网络——" + met.length + "位朋友,总好感" + totalAff + "。'社交资本,是最被低估的资产。'";
      }
    },
    {
      id: "d636_rumor_mill", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "谣言工坊",
      story: "你发现有些消息在朋友圈里传得比真的还快——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 2, excludeFlags: ["_d636RumorCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d636RumorCooldown) return false;
        var met = metNpcsR636(st);
        return met.length >= 3;
      },
      choices: [
        { text: "🔍 核实真相", hint: "智力+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d636RumorCooldown = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔍 '谣言止于智者。' 你选择了核实真相。智力+4,心智+2。", "success");
        }},
        { text: "🤫 不传谣", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d636RumorCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 '不信谣,不传谣。' 你选择了沉默。心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现有些消息在朋友圈里传得比真的还快——'三人成虎,谣言重复一千遍就成了真理。'";
      }
    },
    {
      id: "d636_mentor_match", phase: "street", _isChainEvent: false, icon: "🎓",
      title: "名师出高徒",
      story: "你遇到了一位愿意指点你的前辈——{desc}",
      triggers: { minDay: 80, interval: 150, maxRepeats: 2, excludeFlags: ["_d636MentorCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d636MentorCooldown) return false;
        var met = metNpcsR636(st);
        var highAff = 0;
        for (var i = 0; i < met.length; i++) { if (met[i].affinity >= 60) highAff++; }
        return highAff >= 1;
      },
      choices: [
        { text: "🙏 虚心请教", hint: "最高技能XP+6,好感+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d636MentorCooldown = true;
          var met = metNpcsR636(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 4, "拜师请教"); } catch(e) {}
          }
          var skills = st.skills || {};
          var best = null, bestLv = -1;
          for (var k in skills) {
            var lv = skills[k] && typeof skills[k].level === "number" ? skills[k].level : 0;
            if (lv > bestLv) { bestLv = lv; best = k; }
          }
          if (best && typeof addSkillXp === "function") { try { addSkillXp(best, 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙏 '听君一席话,胜读十年书。' 你虚心请教,收获颇丰。最高技能XP+6,好感+4。", "success");
        }},
        { text: "💪 自己摸索", hint: "智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d636MentorCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '师傅领进门,修行在个人。' 你选择自己摸索。智力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你遇到了一位愿意指点你的前辈——'高人一句点拨,胜过自己摸索三年。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
