/**
 * 域C(职业/成长) 联动增强 R480（第十七轮循环）
 * 桥接：
 *   C→H  c480_career_legacy        职业传承 → 消费 employment+startup 数据,
 *     职场积累→"从打工到当老板"的创业桥接
 *   C→F  c480_skill_mastery_ui    技能精通UI → 消费 skills 数据,
 *     技能→"你精通什么"的UI展示
 *   c480_career_crossroad(C→B 职业十字路口): employment→"你该何去何从"叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR480Loaded) return;
  RANDOM_EVENTS._domainCLinkageR480Loaded = true;

  function topSkillKey(st) {
    if (!st || !st.skills) return null;
    var best = null, bestLv = -1;
    for (var k in st.skills) { var lv = st.skills[k] && st.skills[k].level ? st.skills[k].level : 0; if (lv > bestLv) { bestLv = lv; best = k; } }
    return best;
  }

  var EVENTS = [
    {
      id: "c480_career_legacy", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "职业传承",
      story: "你开始思考职场的未来——{desc}",
      triggers: { minDay: 200, interval: 200, maxRepeats: 2, excludeFlags: ["_c480LegacyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.career || !st.career.currentJob) return false;
        return (st.career.currentJob.workDays || 0) >= 730 && (st.flags && !st.flags._c480LegacyCooldown);
      },
      choices: [
        { text: "🚀 准备创业", hint: "现金+2000,管理XP+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c480LegacyCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 8); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 你开始准备创业——'打工是为了不打工。' 现金+2000,管理XP+8。", "success");
        }},
        { text: "📚 传帮带新人", hint: "心智+5,人缘+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c480LegacyCooldown = true;
          if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 5); st.player.corporate.popularity = Math.min(100, (st.player.corporate.popularity || 50) + 5); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 你决定传帮带新人——'最好的学习是教别人。' 心智+5,人缘+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.career && st.career.currentJob ? (st.career.currentJob.workDays || 0) : 0;
        return "你已经工作了" + days + "天——是时候思考：这些经验该怎么传承？";
      }
    },
    {
      id: "c480_skill_mastery_ui", phase: "street", _isChainEvent: false, icon: "🏅",
      title: "技能精通",
      story: "你查看了自己的技能精通度——{desc}",
      triggers: { minDay: 40, interval: 70, maxRepeats: 4, excludeFlags: ["_c480MasteryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills) return false;
        return (st.flags && !st.flags._c480MasteryCooldown);
      },
      choices: [
        { text: "📊 分析精通度", hint: "智力+2,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c480MasteryCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了技能精通度——'知道自己知道什么，是智慧的开始。' 智力+2,心智+2。", "success");
        }},
        { text: "🎯 追求精通", hint: "最高技能XP+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c480MasteryCooldown = true;
          var sk = topSkillKey(st);
          if (sk && typeof addSkillXp === "function") { try { addSkillXp(sk, 8); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你决定追求精通——'一招鲜，吃遍天。' 最高技能XP+8。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var sk = topSkillKey(st);
        var lv = sk && st.skills[sk] ? st.skills[sk].level : 0;
        var name = sk && typeof getSkillChineseName === "function" ? getSkillChineseName(sk) : (sk || "技能");
        return "你查看了技能精通度——最强的" + name + "Lv." + lv + "。你精通什么？还差什么？";
      }
    },
    {
      id: "c480_career_crossroad", phase: "corporate", _isChainEvent: false, icon: "🔀",
      title: "十字路口",
      story: "你站在职业的十字路口——{desc}",
      triggers: { minDay: 150, interval: 180, maxRepeats: 2, excludeFlags: ["_c480CrossroadCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.career || !st.career.currentJob) return false;
        return (st.career.currentJob.workDays || 0) >= 365 && (st.flags && !st.flags._c480CrossroadCooldown);
      },
      choices: [
        { text: "🔄 跳槽", hint: "现金+1000,风险+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c480CrossroadCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1000;
          if (st.player) st.player.risk = Math.min(100, (st.player.risk || 0) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 你决定跳槽——'树挪死，人挪活。' 现金+1000,风险+5。", "success");
        }},
        { text: "💪 坚守", hint: "心智+5,业绩+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c480CrossroadCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.career && st.career.currentJob) st.career.currentJob.performance = Math.min(100, (st.career.currentJob.performance || 50) + 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 你决定坚守——'深耕出专家。' 心智+5,业绩+10。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.career && st.career.currentJob ? (st.career.currentJob.workDays || 0) : 0;
        return "你已经工作了" + days + "天——站在十字路口，你该何去何从？";
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
