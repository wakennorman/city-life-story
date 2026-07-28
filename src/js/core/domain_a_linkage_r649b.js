/**
 * 域A(数据/数值平衡) 联动增强 R649b
 * 本轮主题：personalGrowth健康数据层激活（配合R649b对personal_growth.js双结构分歧的A类修复）
 * 桥接：
 *   A→G  a649b_checkup_trend  体检历史趋势 → checkupHistory(修复崩溃后)全库首个读者,
 *     两次体检对比→"数据见证身体变化"生命回响（峰终定律：把离散体检变成连续叙事）
 *   A→B  a649b_depression_shadow  情绪低谷 → health.mental.depression与pg.psychology.depression
 *     双心理系统零消费字段首次阈值叙事,并在选择中双向同步弥合（损失厌恶：低成本干预避免更大损失）
 *   A→F  a649b_bmi_wakeup  体重的悄悄话 → metabolic.bmi恒22死数据的全库首个写入者,
 *     由_habits.junkFoodMeals饮食习惯驱动,激活render.js:5803既有BMI展示（禀赋效应：身材是玩家资产）
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR649bLoaded) return;
  RANDOM_EVENTS._domainALinkageR649bLoaded = true;

  // 辅助：双形态安全读分(数字/对象{score}均兼容,防NaN)
  function scoreOf(v, def) {
    if (typeof v === "number" && isFinite(v)) return v;
    if (v && typeof v === "object" && typeof v.score === "number" && isFinite(v.score)) return v.score;
    return def;
  }

  // 辅助：双心理系统抑郁读取(取二者较大值,防undefined)
  function depressionOf(st) {
    var a = 0, b = 0;
    var pg = st.personalGrowth;
    if (pg && pg.health && pg.health.mental && typeof pg.health.mental === "object") {
      a = pg.health.mental.depression || 0;
    }
    if (pg && pg.psychology) b = pg.psychology.depression || 0;
    return Math.max(a, b);
  }

  // 辅助：双心理系统抑郁同步写入(delta为负数=缓解)
  function shiftDepression(st, delta) {
    var pg = st.personalGrowth;
    if (!pg) return;
    if (pg.health && pg.health.mental && typeof pg.health.mental === "object") {
      pg.health.mental.depression = Math.max(0, Math.min(100, (pg.health.mental.depression || 0) + delta));
    }
    if (pg.psychology) {
      pg.psychology.depression = Math.max(0, Math.min(100, (pg.psychology.depression || 0) + delta));
    }
  }

  var EVENTS = [
    {
      id: "a649b_checkup_trend", phase: "street", _isChainEvent: false, icon: "📈",
      title: "体检报告的曲线",
      story: "你把历年体检报告摊在桌上对比——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 2 },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pg = st.personalGrowth;
        if (!pg || !pg.health || !Array.isArray(pg.health.checkupHistory)) return false;
        return pg.health.checkupHistory.length >= 2;
      },
      choices: [
        { text: "🏃 按数据调整作息", hint: "健康+3,心智+2", apply: function (st) {
          if (!st) return;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 0) + 3);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 '身体的账,数据不会记错。' 你按体检趋势调整了作息。健康+3,心智+2。", "success");
        }},
        { text: "🗂️ 存档观察", hint: "心情+2", apply: function (st) {
          if (!st) return;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🗂️ 你把报告收好,'先观察一年再说。' 心情+2。", "info");
        }}
      ],
      text: function (st) {
        if (!st || !st.personalGrowth || !st.personalGrowth.health) return null;
        var hist = st.personalGrowth.health.checkupHistory;
        if (!Array.isArray(hist) || hist.length < 2) return null;
        var prev = hist[hist.length - 2], last = hist[hist.length - 1];
        var d = Math.round((last.physical || 0) - (prev.physical || 0));
        var trend = d > 2 ? "身体指标在变好(+" + d + ")" : d < -2 ? "身体指标在下滑(" + d + ")" : "身体指标基本持平";
        return "你把历年体检报告摊在桌上对比——" + trend + "。'健康是长期主义,曲线比单点更诚实。'";
      }
    },
    {
      id: "a649b_depression_shadow", phase: "street", _isChainEvent: false, icon: "🌧️",
      title: "情绪的低气压",
      story: "最近你总提不起劲，对以前喜欢的事也没了兴趣。{desc}",
      triggers: { minDay: 90, interval: 60, maxRepeats: 3 },
      conditions: function (st) {
        if (st.gameOver) return false;
        return depressionOf(st) >= 40;
      },
      choices: [
        { text: "👂 预约心理咨询(¥500)", hint: "抑郁-12,心智+3", apply: function (st) {
          if (!st || !st.resources) return;
          if ((st.resources.cash || 0) < 500) {
            if (typeof StateManager !== "undefined") StateManager.addMessage("💸 现金不足¥500,咨询没约成。'先照顾好钱包,再照顾情绪。'", "warning");
            return;
          }
          st.resources.cash = Math.max(0, st.resources.cash - 500);
          shiftDepression(st, -12);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👂 '被听见,本身就是治疗。' 咨询后你轻松了不少。抑郁-12,心智+3,现金-500。", "success");
        }},
        { text: "🚶 强迫自己出门走走", hint: "抑郁-5,心情+3", apply: function (st) {
          if (!st) return;
          shiftDepression(st, -5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚶 傍晚的风把心里的雾吹散了一点。抑郁-5,心情+3。", "info");
        }},
        { text: "🛏️ 硬扛过去", hint: "心智-3", apply: function (st) {
          if (!st) return;
          if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛏️ 你选择硬扛。'情绪不会消失,只会换个方式回来。' 心智-3。", "warning");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var dep = Math.round(depressionOf(st));
        return "最近你总提不起劲,对以前喜欢的事也没了兴趣。情绪自评量表显示抑郁指数" + dep + "/100。'承认低落,是走出低落的第一步。'";
      }
    },
    {
      id: "a649b_bmi_wakeup", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "体重的悄悄话",
      story: "换季整理衣柜时，去年的裤子扣不上了。{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 2 },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || !st.flags._habits) return false;
        if ((st.flags._habits.junkFoodMeals || 0) < 8) return false;
        var pg = st.personalGrowth;
        return !!(pg && pg.health && pg.health.metabolic && typeof pg.health.metabolic === "object");
      },
      choices: [
        { text: "🥗 从下一餐开始改", hint: "BMI回落,厨艺XP+4", apply: function (st) {
          if (!st) return;
          var m = st.personalGrowth && st.personalGrowth.health && st.personalGrowth.health.metabolic;
          if (m && typeof m === "object") {
            m.bmi = Math.max(18.5, Math.round(((m.bmi || 22) - 0.8) * 10) / 10);
            m.score = Math.min(100, scoreOf(m, 75) + 3);
          }
          if (st.flags && st.flags._habits) st.flags._habits.junkFoodMeals = Math.floor((st.flags._habits.junkFoodMeals || 0) / 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("cooking", 4); } catch (e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🥗 '身材是一日三餐投的票。' 你开始自己做饭控制饮食。BMI回落,代谢+3,厨艺XP+4。", "success");
        }},
        { text: "🍔 快乐最重要", hint: "心情+4,BMI上升", apply: function (st) {
          if (!st) return;
          var m = st.personalGrowth && st.personalGrowth.health && st.personalGrowth.health.metabolic;
          if (m && typeof m === "object") {
            m.bmi = Math.min(35, Math.round(((m.bmi || 22) + 1.2) * 10) / 10);
            m.score = Math.max(0, scoreOf(m, 75) - 4);
          }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍔 '人生苦短,先吃为敬。' 心情+4,但腰围默默记下了这笔账。BMI上升,代谢-4。", "info");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var m = st.personalGrowth && st.personalGrowth.health && st.personalGrowth.health.metabolic;
        var bmi = (m && typeof m === "object" && isFinite(m.bmi)) ? m.bmi : 22;
        var junk = (st.flags && st.flags._habits && st.flags._habits.junkFoodMeals) || 0;
        return "换季整理衣柜时,去年的裤子扣不上了。最近你已经吃了" + junk + "次垃圾食品,BMI悄悄爬到了" + bmi + "。'体重从不说谎,它只是慢慢说。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
