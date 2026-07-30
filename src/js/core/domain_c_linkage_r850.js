/**
 * 域C(职业/成长) 联动增强 R850
 * 全系统优化·Domain C 第七十一轮循环
 *
 * 【联动增强3项】
 *   1. C→A 技能市场数据v11 — 职业技能数据转化为数值洞察
 *   2. C→E 职业技能→投资v11 — 职业经验转化为投资洞察
 *   3. C→G 职业健康→生命质量v10 — 职业倦怠反馈为生命质量
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR850Loaded) return;
  RANDOM_EVENTS._domainCLinkageR850Loaded = true;

  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "c850_skill_market_v11",
      phase: "street", icon: "📊",
      title: "技能市场价值，你在哪个档位？",
      story: "你打开行业薪酬报告——发现自己的技能组合，在市场上有明确的定价。不是所有技能都值钱，但值钱的技能，都值得你投入时间。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c850SkillMarketDone) return false;
        if (!st.skills) return false;
        var _count = 0;
        for (var _sk in st.skills) {
          if (st.skills[_sk] && (st.skills[_sk].level || 0) >= 75) _count++;
        }
        return _count >= 5 && st.player.day >= 350;
      },
      probability: 0.05, repeatable: false,
      choices: [
        {
          text: "📊 评估技能市场价值",
          hint: "智力+28, 会计XP+32, 置_c850SkillMarketValue",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c850SkillMarketDone = true;
            st.flags._c850SkillMarketValue = true;
            var _total = 0, _c = 0;
            for (var _sk in st.skills) {
              if (st.skills[_sk] && (st.skills[_sk].level || 0) > 0) { _total += st.skills[_sk].level; _c++; }
            }
            st.flags._c850AvgSkillLevel = _c > 0 ? Math.round(_total / _c) : 0;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 28);
            grantXp("accounting", 32);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage("📊 技能市场价值评估完成——平均Lv." + (st.flags._c850AvgSkillLevel || 0) + "。智力+28, 会计XP+32。", "success");
          }
        },
        {
          text: "😅 技能够用就行", hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c850SkillMarketDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") StateManager.addMessage("😅 技能够用就行。心智+5。", "info");
          }
        }
      ]
    },
    {
      id: "c850_career_invest_v11",
      phase: "street", icon: "💼",
      title: "职业技能，也是投资资本",
      story: "你发现——职场上学到的技能，在投资场上也能用。市场分析、风险判断、长期规划……这些能力，不仅在职场有用，在资本市场同样有价值。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c850CareerInvestDone) return false;
        if (!st.skills) return false;
        var _mgmt = (st.skills.management && st.skills.management.level) || 0;
        var _acc = (st.skills.accounting && st.skills.accounting.level) || 0;
        return (_mgmt >= 55 || _acc >= 55) && st.player.day >= 400;
      },
      probability: 0.06, repeatable: false,
      choices: [
        {
          text: "💼 将职业技能用于投资", hint: "智力+26, 管理XP+32, 置_c850CareerInvestor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c850CareerInvestDone = true;
            st.flags._c850CareerInvestor = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 26);
            grantXp("management", 32);
            if (typeof StateManager !== "undefined") StateManager.addMessage("💼 你将职业技能用于投资分析——智力+26, 管理XP+32。", "success");
          }
        },
        {
          text: "😅 职场和投资是两回事", hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c850CareerInvestDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") StateManager.addMessage("😅 职场和投资是两回事。心智+3。", "info");
          }
        }
      ]
    },
    {
      id: "c850_career_health_v10",
      phase: "street", icon: "💪",
      title: "职业倦怠，身体在报警",
      story: "连续加班、高压KPI、无休止的会议……你的身体在发出警告。职业成就固然重要，但用健康换来的成功，值得吗？",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c850CareerHealthDone) return false;
        if (!st.needs || !st.status) return false;
        return (st.needs.fatigue || 0) >= 85 && (st.status.health || 100) <= 25 && st.player.day >= 250;
      },
      probability: 0.08, repeatable: false,
      choices: [
        {
          text: "💪 调整工作节奏，关注健康", hint: "疲劳-35, 健康+28, 心智+22, 置_c850HealthFirst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c850CareerHealthDone = true;
            st.flags._c850HealthFirst = true;
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 35);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 28);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 22);
            if (typeof StateManager !== "undefined") StateManager.addMessage("💪 你调整了工作节奏——疲劳-35, 健康+28, 心智+22。身体是革命的本钱。", "success");
          }
        },
        {
          text: "🔥 再坚持一下", hint: "疲劳+20, 健康-18, 心智+8, 置_c850BurnoutRisk",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c850CareerHealthDone = true;
            st.flags._c850BurnoutRisk = true;
            if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
            if (st.status) st.status.health = Math.max(0, (st.status.health || 50) - 18);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") StateManager.addMessage("🔥 你选择再坚持一下——疲劳+20, 健康-18, 心智+8。注意身体！", "warning");
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