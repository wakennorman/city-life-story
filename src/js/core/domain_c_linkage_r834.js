/**
 * 域C(职业/成长) 联动增强 R834
 * 全系统优化·Domain C 第六十九轮循环
 *
 * 【联动增强3项】
 *   1. C→A 技能市场数据v9 — 职业技能数据转化为数值洞察
 *   2. C→E 职业技能→投资v9 — 职业经验转化为投资洞察
 *   3. C→G 职业健康→生命质量v8 — 职业倦怠反馈为生命质量
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR834Loaded) return;
  RANDOM_EVENTS._domainCLinkageR834Loaded = true;

  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "c834_skill_market_v9",
      phase: "street",
      icon: "📊",
      title: "技能市场价值，你在哪个档位？",
      story: "你打开行业薪酬报告——发现自己的技能组合，在市场上有明确的定价。不是所有技能都值钱，但值钱的技能，都值得你投入时间。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c834SkillMarketDone) return false;
        if (!st.skills) return false;
        var _count = 0;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 65) _count++;
        }
        return _count >= 5 && st.player.day >= 250;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 评估技能市场价值",
          hint: "智力+25, 会计XP+28, 置_c834SkillMarketValue",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c834SkillMarketDone = true;
            st.flags._c834SkillMarketValue = true;
            var _total = 0, _count = 0;
            for (var _sk in st.skills) {
              var _sl = st.skills[_sk];
              if (_sl && (_sl.level || 0) > 0) { _total += _sl.level; _count++; }
            }
            st.flags._c834AvgSkillLevel = _count > 0 ? Math.round(_total / _count) : 0;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 25);
            grantXp("accounting", 28);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 技能市场价值评估完成——平均Lv." + (st.flags._c834AvgSkillLevel || 0) + "。智力+25, 会计XP+28。", "success");
            }
          }
        },
        {
          text: "😅 技能够用就行",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c834SkillMarketDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 技能够用就行。心智+5。", "info");
            }
          }
        }
      ]
    },
    {
      id: "c834_career_invest_v9",
      phase: "street",
      icon: "💼",
      title: "职业技能，也是投资资本",
      story: "你发现——职场上学到的技能，在投资场上也能用。市场分析、风险判断、长期规划……这些能力，不仅在职场有用，在资本市场同样有价值。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c834CareerInvestDone) return false;
        if (!st.skills) return false;
        var _mgmt = (st.skills.management && st.skills.management.level) || 0;
        var _acc = (st.skills.accounting && st.skills.accounting.level) || 0;
        return (_mgmt >= 45 || _acc >= 45) && st.player.day >= 300;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💼 将职业技能用于投资",
          hint: "智力+24, 管理XP+28, 置_c834CareerInvestor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c834CareerInvestDone = true;
            st.flags._c834CareerInvestor = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 24);
            grantXp("management", 28);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 你将职业技能用于投资分析——智力+24, 管理XP+28。", "success");
            }
          }
        },
        {
          text: "😅 职场和投资是两回事",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c834CareerInvestDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 职场和投资是两回事。心智+3。", "info");
            }
          }
        }
      ]
    },
    {
      id: "c834_career_health_v8",
      phase: "street",
      icon: "💪",
      title: "职业倦怠，身体在报警",
      story: "连续加班、高压KPI、无休止的会议……你的身体在发出警告。职业成就固然重要，但用健康换来的成功，值得吗？",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c834CareerHealthDone) return false;
        if (!st.needs || !st.status) return false;
        var _fatigue = st.needs.fatigue || 0;
        var _health = st.status.health || 100;
        return _fatigue >= 75 && _health <= 35 && st.player.day >= 180;
      },
      probability: 0.08,
      repeatable: false,
      choices: [
        {
          text: "💪 调整工作节奏，关注健康",
          hint: "疲劳-28, 健康+22, 心智+18, 置_c834HealthFirst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c834CareerHealthDone = true;
            st.flags._c834HealthFirst = true;
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 28);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 22);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 你调整了工作节奏——疲劳-28, 健康+22, 心智+18。身体是革命的本钱。", "success");
            }
          }
        },
        {
          text: "🔥 再坚持一下，项目快结束了",
          hint: "疲劳+15, 健康-12, 心智+8, 置_c834BurnoutRisk",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c834CareerHealthDone = true;
            st.flags._c834BurnoutRisk = true;
            if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
            if (st.status) st.status.health = Math.max(0, (st.status.health || 50) - 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔥 你选择再坚持一下——疲劳+15, 健康-12, 心智+8。注意身体！", "warning");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();