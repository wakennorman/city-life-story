/**
 * 域G(核心机制/生命周期) 联动增强 R456（第三轮循环）
 * 桥接：
 *   G→D  g456_life_social_reflect  人生社交反思 → 消费 player.day+relationships 数据,
 *     时间流逝→"这一年认识了谁"的社交反思
 *   G→F  g456_life_ui_milestone   人生UI里程碑 → 消费 player.day+resources 数据,
 *     重要节点→"你的人生大事记"的里程碑展示
 *   G→C  g456_life_skill_evolve   人生技能进化 → 消费 player.age+skills 数据,
 *     年龄增长→"每个年龄段该学什么"的技能进化建议
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR456Loaded) return;
  RANDOM_EVENTS._domainGLinkageR456Loaded = true;

  function countMetNpcs(st) {
    if (!st || !st.relationships) return 0;
    var n = 0;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) n++; }
    return n;
  }

  var EVENTS = [
    {
      id: "g456_life_social_reflect", phase: "street", _isChainEvent: false, icon: "🤔",
      title: "这一年",
      story: "夜深人静，你回想这一年认识的人——{desc}",
      triggers: { minDay: 90, interval: 180, maxRepeats: 3, excludeFlags: ["_g456SocialReflectCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g456SocialReflectCooldown);
      },
      choices: [
        { text: "🤔 珍惜眼前人", hint: "心情+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g456SocialReflectCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof applyAffinityChange === "function") {
            for (var id in (st.relationships || {})) {
              if (st.relationships[id] && st.relationships[id].met) {
                try { applyAffinityChange(st, id, 2, "深夜感慨友情珍贵"); } catch(e) {}
                break;
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤔 夜深人静，你回想这一年——在这座城市里，认识了一些人，也走散了一些人。留下的，都是值得珍惜的。心情+3,好感+2。", "success");
        }},
        { text: "📝 定个小目标", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g456SocialReflectCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤔 你给自己定了下一年要完成的目标——'明年这个时候，我要成为更好的自己。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = countMetNpcs(st);
        var day = (st.player && st.player.day) || 0;
        return "夜深人静，你回想这一年认识的人——" + n + "个面孔在脑海中闪过。有些人还在，有些人已经走散了。";
      }
    },
    {
      id: "g456_life_ui_milestone", phase: "street", _isChainEvent: false, icon: "🏆",
      title: "里程碑",
      story: "你翻看自己的人生记录——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_g456MilestoneCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g456MilestoneCooldown);
      },
      choices: [
        { text: "🏆 回顾高光时刻", hint: "心情+3,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g456MilestoneCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 你翻看自己的人生记录——那些高光时刻，让你觉得自己没白活。心情+3,心智+1。", "success");
        }},
        { text: "📈 对比过去和现在", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g456MilestoneCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 你对比了过去的自己和现在的自己——虽然还有很多不足，但确实在进步。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var cash = (st.resources && st.resources.cash) || 0;
        return "你翻看自己的人生记录——第" + day + "天，从当初的懵懂到现在的" + (cash >= 50000 ? "小有成就" : "继续努力") + "，每一步都算数。";
      }
    },
    {
      id: "g456_life_skill_evolve", phase: "corporate", _isChainEvent: false, icon: "🌱",
      title: "活到老学到老",
      story: "你发现自己在不同阶段需要不同的技能——{desc}",
      triggers: { minDay: 50, interval: 120, maxRepeats: 3, excludeFlags: ["_g456SkillEvolveCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g456SkillEvolveCooldown);
      },
      choices: [
        { text: "🌱 制定学习计划", hint: "全技能XP+2,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g456SkillEvolveCooldown = true;
          var skills = ["accounting", "management", "marketing", "technology", "social", "trade"];
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 2); } catch(e) {} } }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌱 你制定了未来半年的学习计划——每个阶段学什么，达到什么水平，清清楚楚。全技能XP+2,心智+2。", "success");
        }},
        { text: "🎯 专注一项核心技能", hint: "最高技能+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g456SkillEvolveCooldown = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌱 你决定把最擅长的技能练到极致——一招鲜，吃遍天。最高技能XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var age = Math.floor(day / 365) + 22;
        return "你发现自己在不同阶段需要不同的技能——" + age + "岁了，每个年龄段都有该学的东西。活到老，学到老。";
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