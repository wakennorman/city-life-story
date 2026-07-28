/**
 * 域B(事件/叙事) 联动增强 R498
 * 桥接：
 *   B→A  b498_event_data_impact   事件数据影响 → 消费 flags 数据,
 *     事件→"数据背后的故事"的经济影响数字
 *   B→G  b498_event_life_lesson   事件人生教训 → 消费 flags 数据,
 *     经历→"吃一堑长一智"的人生智慧
 *   B→C  b498_event_career_insight 事件职业洞察 → 消费 flags 数据,
 *     新闻→"行业趋势告诉你该学什么"的职业方向
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR498Loaded) return;
  RANDOM_EVENTS._domainBLinkageR498Loaded = true;

  var EVENTS = [
    {
      id: "b498_event_data_impact", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据背后的故事",
      story: "一个新闻里提到的数字，让你陷入了沉思——{desc}",
      triggers: { minDay: 20, interval: 45, maxRepeats: 5, excludeFlags: ["_b498DataImpactCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b498DataImpactCooldown);
      },
      choices: [
        { text: "📊 深入分析", hint: "会计XP+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b498DataImpactCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你深入分析了这个数字背后的含义——'数据不会说谎，但解读数据的人会。' 会计XP+4,心智+2。", "success");
        }},
        { text: "📝 记下来", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b498DataImpactCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你把这个数字记在了心里——'以后可能会用到。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一个新闻里提到的数字，让你陷入了沉思——'X万人失业'、'X亿市值蒸发'... 冰冷的数字背后，是多少人的故事。";
      }
    },
    {
      id: "b498_event_life_lesson", phase: "street", _isChainEvent: false, icon: "💡",
      title: "吃一堑长一智",
      story: "回想之前犯过的错，你有了新的感悟——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_b498LifeLessonCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b498LifeLessonCooldown);
      },
      choices: [
        { text: "💡 总结经验", hint: "心智+4,管理XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b498LifeLessonCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '以前犯的错，都是现在交的学费。' 你认真总结了经验教训。心智+4,管理XP+2。", "success");
        }},
        { text: "📝 写下来", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b498LifeLessonCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 你把教训写了下来——'好记性不如烂笔头。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "回想之前犯过的错，你有了新的感悟——'如果当时没那么做就好了...' 但你知道，没有那些错误，就没有今天的自己。";
      }
    },
    {
      id: "b498_event_career_insight", phase: "corporate", _isChainEvent: false, icon: "🎯",
      title: "行业趋势",
      story: "一篇行业分析报告让你看到了未来的方向——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_b498CareerInsightCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b498CareerInsightCooldown);
      },
      choices: [
        { text: "🎯 学习新技能", hint: "编程XP+5,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b498CareerInsightCooldown = true;
          // [全系统自洽修复] 域C R515 修复:addSkillXp("technology")非真实技能键(XP静默丢弃)→映射coding(学新技术=编程)
          if (typeof addSkillXp === "function") { try { addSkillXp("coding", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 'AI时代来了，不学点新技术就要被淘汰了。' 编程XP+5,心智+1。", "success");
        }},
        { text: "📈 关注行业动态", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b498CareerInsightCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你订阅了几个行业资讯平台——'了解趋势，才能把握未来。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一篇行业分析报告让你看到了未来的方向——'XX行业正在崛起，人才缺口巨大。' 你开始思考自己的技能是否跟得上时代。";
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