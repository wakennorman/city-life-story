/*
 * 城市浮生记 — 域C（职业/成长）联动增强 · R165
 * 全系统优化 loop R165 · 联动增强 2项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR165) return;
  RANDOM_EVENTS._domainCLinkageR165 = true;

  // ---- 本地助手 ----

  // 安全改好感
  function safeAffinityR165(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域C R165联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 取最高等级技能值
  function topSkillLevelR165(st) {
    if (!st || !st.skills) return 0;
    var top = 0;
    for (var k in st.skills) {
      if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
      var lv = (st.skills[k] && st.skills[k].level) || 0;
      if (lv > top) top = lv;
    }
    return top;
  }

  // 取技能总数（已学习的技能数量）
  function skillCountR165(st) {
    if (!st || !st.skills) return 0;
    var count = 0;
    for (var k in st.skills) {
      if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
      if (st.skills[k] && (st.skills[k].level || 0) > 0) count++;
    }
    return count;
  }

  // 检查是否连续工作超过N天
  function consecutiveWorkDaysR165(st) {
    if (!st || !st.flags) return 0;
    return st.flags._consecutiveWorkDays || 0;
  }

  // ---- 联动事件 ----

  var C_EVENTS = [

    // ===== C→B 职业坚守叙事 =====
    // 设计意图：当玩家连续工作达到一定天数时，触发职业坚守叙事，
    //   让"坚持"这个抽象概念变成有情感温度的叙事体验。
    {
      id: "career_longevity_reflection",
      title: "日复一日的意义",
      desc: "你在这份工作上已经坚持了很长一段时间。从最初的生涩到现在的熟练，从每天的挣扎到现在的从容——时间在你身上刻下了痕迹，也给了你回报。\n\n你想起第一天上班时的紧张，现在只觉得好笑。人果然是会成长的。",
      phase: "street",
      triggers: { minDay: 45 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._careerLongevityReflectionDone) return false;
        // 连续工作≥30天
        if (consecutiveWorkDaysR165(st) < 30) return false;
        // 至少有1个工作经验
        if (!st.career && !st.employment) return false;
        return true;
      },
      choices: [
        {
          text: "🌟 给新入行的后辈写点心得",
          apply: function (st) {
            if (st.flags) st.flags._careerLongevityReflectionDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            }
            if (st.flags) st.flags._careerMentorMindset = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你的心得在后辈中传阅，有人因此少走了很多弯路。心智+5，智力+2。",
                "good"
              );
          },
        },
        {
          text: "💪 继续默默积累，不急不躁",
          apply: function (st) {
            if (st.flags) st.flags._careerLongevityReflectionDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你相信时间的力量。坚持本身就是最好的策略。心智+3。",
                "info"
              );
          },
        },
      ],
      probability: 0.05,
    },

    // ===== C→G 技能成长停滞预警 =====
    // 设计意图：当玩家长时间未提升任何技能时，触发成长停滞预警，
    //   损失厌恶驱动玩家重新投入技能学习，
    //   连接职业成长系统(C)与核心机制(G)。
    {
      id: "career_skill_stagnation_warning",
      title: "成长曲线开始变平",
      desc: "你翻看自己的技能记录，发现最近一段时间几乎没有进步。\n\n在这个城市里，不进步就是退步——房租不会降，物价不会跌，但你的竞争力如果停在原地，迟早会被淘汰。",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._careerSkillStagnationWarned) return false;
        // 等级≥20但最近没提升（技能总数≤2且最高技能≤20）
        var topLv = topSkillLevelR165(st);
        var count = skillCountR165(st);
        if (topLv >= 30) return false; // 高手不需要此预警
        if (count >= 3) return false; // 已有多样化技能
        // 30天以上的玩家但技能仍很低
        if (topLv >= 15) return false; // 有一定基础
        return true;
      },
      choices: [
        {
          text: "📚 报名一个技能培训班",
          apply: function (st) {
            if (st.flags) st.flags._careerSkillStagnationWarned = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
            if (st.flags) st.flags._skillTrainingMotivated = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你报了一个培训班，开始系统提升自己。智力+3，心智+2。技能成长效率暂时提升。",
                "good"
              );
          },
        },
        {
          text: "🔧 在工作中多练，在实践中成长",
          apply: function (st) {
            if (st.flags) st.flags._careerSkillStagnationWarned = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你决定在工作中多用心，把每一次重复都变成练习。心智+2。",
                "info"
              );
          },
        },
      ],
      probability: 0.04,
    },
  ];

  // 注册到 RANDOM_EVENTS
  for (var i = 0; i < C_EVENTS.length; i++) {
    var evt = C_EVENTS[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions) evt.conditions = function () { return false; };
    RANDOM_EVENTS.push(evt);
  }
})();