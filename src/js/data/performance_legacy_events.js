/**
 * 绩效里程碑事件 — H→F/G 联动
 * 基于 perfHistory 时间序列生成叙事回响
 * [全系统自洽修复] 域H: perfHistory数组守卫+grade映射防御
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  function analyzePerfTrend(st, n) {
    var history = (st.corporate && st.corporate.perfHistory) || [];
    var recent = history.slice(-Math.min(n, history.length));
    if (recent.length === 0) return { grades: [], score: 0, streakS: 0, streakC: 0, avg: 0 };
    var grades = recent.map(function (r) { return r.grade || "C"; });
    var scoreMap = { "S+": 5, S: 4, A: 3, B: 2, C: 1 };
    var total = grades.reduce(function (sum, g) { return sum + (scoreMap[g] || 1); }, 0);
    var avg = total / grades.length;
    var streakS = 0, streakC = 0;
    for (var i = grades.length - 1; i >= 0; i--) {
      if (grades[i] === "S+" || grades[i] === "S") streakS++;
      else break;
    }
    for (var j = grades.length - 1; j >= 0; j--) {
      if (grades[j] === "C") streakC++;
      else break;
    }
    return { grades: grades, score: avg, streakS: streakS, streakC: streakC, avg: avg };
  }

  // 事件1: S/S+连胜庆典
  var perf_s_streak_celebration = {
    id: "perf_s_streak_celebration",
    title: "🎉 三连S绩效！",
    phase: "corporate",
    repeatable: false,
    priority: 90,
    conditions: function (st) {
      if (!st.corporate || !st.corporate.active) return false;
      if (st.flags && st.flags._perfSStrikeDone) return false; // [全系统自洽修复] 域C A类: st.flags 守卫
      var trend = analyzePerfTrend(st, 4);
      return trend.streakS >= 3;
    },
    probability: 1.0,
    story:
      "连续三个季度S级绩效！人事部打电话来说老板要把你列入「高潜人才计划」。\n\n「你这个季度可以选：额外休假一周、或者¥20000现金激励、或者参加高管午餐会。」",
    choices: [
      {
        text: "🏖️ 休假一周（疲劳-20/心情+10）",
        apply: function (st) {
          if (!st.flags._perfSStrikeDone) st.flags._perfSStrikeDone = true;
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 50) - 20);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage("🏖️ 你选了休假，身心大爽！疲劳-20，心情+10。", "success");
        },
      },
      {
        text: "💰 ¥20000现金奖励",
        apply: function (st) {
          if (!st.flags._perfSStrikeDone) st.flags._perfSStrikeDone = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 20000;
          if (typeof addDailyTransaction === "function") addDailyTransaction(st, "income", "perf_bonus", 20000, "S级绩效连续奖金");
          StateManager.addMessage("💰 你选了¥20000现金激励！", "success");
        },
      },
      {
        text: "🍽️ 高管午餐会（向上+10/人缘+5）",
        apply: function (st) {
          if (!st.flags._perfSStrikeDone) st.flags._perfSStrikeDone = true;
          var c = st.player.corporate;
          if (!c) return;
          c.upwardMgmt = Math.min(100, (c.upwardMgmt || 0) + 10);
          c.popularity = Math.min(100, (c.popularity || 0) + 5);
          StateManager.addMessage("🍽️ 高管午餐会上了！向上管理+10，人气+5。", "success");
        },
      },
    ],
    icons: ["🎉", "⭐"],
  };

  // 事件2: 绩效低谷反思
  var perf_lowpoint_reflection = {
    id: "perf_lowpoint_reflection",
    title: "🌧️ 绩效滑铁卢",
    phase: "corporate",
    repeatable: false,
    priority: 85,
    conditions: function (st) {
      if (!st.corporate || !st.corporate.active) return false;
      if (st.flags && st.flags._perfLowPointDone) return false; // [全系统自洽修复] 域C A类: st.flags 守卫
      var trend = analyzePerfTrend(st, 3);
      return trend.streakC >= 2;
    },
    probability: 1.0,
    story:
      "又一个季度C。你开始怀疑自己是不是选错了路。\n\n深夜下班的时候，你在天台上抽了根烟，看着远处城中村的方向——那些搬砖、跑外卖的日子，至少收入是看得见的。\n\n「你是想留在城市里拼，还是回去？」风很大，但你听见了自己的心跳。",
    choices: [
      {
        text: "💪 继续拼（能力+5/疲劳+10）",
        apply: function (st) {
          if (!st.flags._perfLowPointDone) st.flags._perfLowPointDone = true;
          var c = st.player.corporate;
          if (!c) return;
          c.risk = Math.max(0, (c.risk || 0) - 5);
          c.ability = Math.min(100, (c.ability || 0) + 5);
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 50) + 10);
          StateManager.addMessage("💪 你把烟掐了，决定再拼一次。能力提升+5，但疲劳+10。", "info");
        },
      },
      {
        text: "🧘 休息调整（疲劳-15/心情+5）",
        apply: function (st) {
          if (!st.flags._perfLowPointDone) st.flags._perfLowPointDone = true;
          var c = st.player.corporate;
          if (!c) return;
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 50) - 15);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          c.dignity = Math.min(100, (c.dignity || 0) + 3);
          StateManager.addMessage("🧘 你决定给自己放几天假。疲劳-15，心情+5，尊严+3。", "info");
        },
      },
      {
        text: "🔄 换方向（向上+5/道德+3）",
        apply: function (st) {
          if (!st.flags._perfLowPointDone) st.flags._perfLowPointDone = true;
          var c = st.player.corporate;
          if (!c) return;
          c.upwardMgmt = Math.min(100, (c.upwardMgmt || 0) + 5);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          StateManager.addMessage("🔄 你决定换个方向。向上管理+5，道德感+3。", "info");
        },
      },
    ],
    icons: ["🌧️", "💭"],
  };

  // 事件3: 绩效翻身仗
  var perf_comeback_story = {
    id: "perf_comeback_story",
    title: "🔥 翻身仗",
    phase: "corporate",
    repeatable: true,
    cooldownDays: 180,
    priority: 80,
    conditions: function (st) {
      if (!st.corporate || !st.corporate.active) return false;
      if (st.flags && st.flags._perfComebackCooldown) return false; // [全系统自洽修复] 域C A类: st.flags 守卫
      var history = (st.corporate.perfHistory) || [];
      if (history.length < 2) return false;
      var last2 = history.slice(-2);
      var prevGrade = (last2[0] && last2[0].grade || "").toUpperCase();
      var currGrade = (last2[1] && last2[1].grade || "").toUpperCase();
      if (prevGrade === "C" || prevGrade === "D") {
        if (currGrade === "A" || currGrade === "S" || currGrade === "S+") {
          return true;
        }
      }
      return false;
    },
    probability: 0.5,
    story:
      "你从上一个季度的C逆袭到了A！\n\n曾经看不起你的人现在对你刮目相看。李工头在朋友圈发了你绩效截图配文「牛啊兄弟」。小美说「我就知道你行的」。",
    choices: [
      {
        text: "🔥 庆祝翻身（尊严+10/人缘+5/心情+10）",
        apply: function (st) {
          st.flags._perfComebackCooldown = true;
          var c = st.player.corporate;
          if (!c) return;
          c.dignity = Math.min(100, (c.dignity || 0) + 10);
          c.popularity = Math.min(100, (c.popularity || 0) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage("🔥 你打了一场漂亮的翻身仗！尊严+10，人缘+5，心情+10。", "success");
        },
      },
    ],
    icons: ["🔥", "💯"],
  };

  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(perf_s_streak_celebration, perf_lowpoint_reflection, perf_comeback_story);
  }
})();
// [R338] 域B
// [R418] 域B
// [R506] 域B
// [R586] 域B
