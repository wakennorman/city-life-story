/**
 * 域C(职业/成长) 联动增强 R518
 * 桥接（首消费两个死 flag + 1 个职业清晰度叙事）：
 *   C→D  c518_skill_respect_d   技能被看见 → 首消费 career_dev.js:3693 写入的死 flag _skillRespectNotified(总技能≥50 置位却零读取) → 熟人敬重(守域D铁律)
 *   C→B  c518_mentor_legacy_b   师徒传承 → 首消费 career_dev.js:5509 写入的死 flag _hasApprentice(收徒却零读取) → 匠人传奇叙事
 *   C→F  c518_career_clarity_f  职业清晰感 → 心智+幸福感(double 防御)
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR518Loaded) return;
  RANDOM_EVENTS._domainCLinkageR518Loaded = true;

  // ---- 辅助：域D 铁律兼容 ----
  function firstMetNpcC518(st) {
    if (!st || !st.relationships) return null;
    for (var k in st.relationships) {
      if (!st.relationships.hasOwnProperty(k)) continue;
      var rel = st.relationships[k];
      if (rel && rel.met) return k;
    }
    return null;
  }
  function npcNameC518(st, nid) {
    if (typeof getNpcDisplayName === "function" && nid) {
      try { return getNpcDisplayName(st, nid); } catch (e) {}
    }
    return nid || "熟人";
  }
  function bumpAffinityC518(st, nid, delta, reason) {
    if (!st || !nid) return;
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, nid, delta, reason || "职业被认可"); } catch (e) {}
    }
  }

  var EVENTS = [
    {
      id: "c518_skill_respect_d", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "手艺被人记在心里",
      story: "你一门手艺练到炉火纯青，街坊邻里都听说了——{desc}",
      triggers: { minDay: 30, interval: 120, maxRepeats: 3, excludeFlags: ["_c518SkillRespectCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || !st.flags._skillRespectNotified) return false; // 首消费死 flag：总技能≥50 置位
        return !!firstMetNpcC518(st);
      },
      choices: [
        { text: "🤝 谦逊受教", hint: "好感+6,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c518SkillRespectCooldown = true;
          var nid = firstMetNpcC518(st);
          bumpAffinityC518(st, nid, 6, "你的手艺让人佩服");
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 " + npcNameC518(st, nid) + "由衷地说：『你这手艺，是真功夫。』 好感+6,心智+2。", "success");
        }},
        { text: "📣 收个徒弟", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c518SkillRespectCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你寻思着：『这么好的手艺，得传下去。』 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你一门手艺练到炉火纯青，街坊邻里都听说了——『这年头，肯下苦功的人不多了。』";
      }
    },
    {
      id: "c518_mentor_legacy_b", phase: "street", _isChainEvent: false, icon: "📜",
      title: "师徒一段缘",
      story: "你带过的徒弟出师了，回来看你——{desc}",
      triggers: { minDay: 60, interval: 200, maxRepeats: 2, excludeFlags: ["_c518MentorLegacyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || !st.flags._hasApprentice) return false; // 首消费死 flag：收徒置位却零读取
        return true;
      },
      choices: [
        { text: "📜 感慨传承", hint: "名气+4,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c518MentorLegacyCooldown = true;
          if (st.player) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📜 『师傅领进门，修行在个人。』徒弟敬你一杯，你也成了别人生命里的贵人。名气+4,心智+3。", "success");
        }},
        { text: "💡 写本心得", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c518MentorLegacyCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📜 你把带徒的心得记下来——『经验不传下去，就烂在肚子里了。』 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你带过的徒弟出师了，回来看你——『师傅，我如今也能独当一面了。』";
      }
    },
    {
      id: "c518_career_clarity_f", phase: "street", _isChainEvent: false, icon: "🧭",
      title: "忽然看清了方向",
      story: "做了这么久，你头一回清楚自己想要什么——{desc}",
      triggers: { minDay: 25, interval: 150, maxRepeats: 3, excludeFlags: ["_c518CareerClarityCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate && !st.career) return false;
        return (st.flags && !st.flags._c518CareerClarityCooldown);
      },
      choices: [
        { text: "🧭 定下目标", hint: "心智+5,幸福感+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c518CareerClarityCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4); // 真实幸福感字段(非 player.happiness 死字段)
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧭 你在本子上写下三年目标——『知道自己要去哪儿，走路都带风。』 心智+5,幸福感+4。", "success");
        }},
        { text: "📊 盘点能力", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c518CareerClarityCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧭 你把会的、想学的列成清单——『原来我已经走了这么远。』 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "做了这么久，你头一回清楚自己想要什么——『不再随波逐流了。』";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();
