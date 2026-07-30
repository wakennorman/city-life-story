/*
 * 城市浮生记 — 域C(职业/成长) 联动增强 R939
 * 全系统优化·Domain C 第七十一轮循环
 *
 * 【联动增强3项】
 *   1. C→G 职业健康平衡v1 — 职业倦怠触发健康管理事件
 *   2. C→E 技能投资回报v1 — 技能等级驱动投资判断
 *   3. C→D 职业社交圈v1 — 职业成就拓展社交人脉
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS。
 *  - 所有 state 访问均 || 防御。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR939Loaded) return;
  RANDOM_EVENTS._domainCLinkageR939Loaded = true;

  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "c939_health_balance_v1",
      phase: "street", icon: "🏥", title: "工作与健康的平衡",
      story: "你最近工作压力不小，身体开始发出警告信号。\n\n颈椎酸痛、眼睛干涩、睡眠质量下降——这些都是身体在告诉你：该休息了。",
      triggers: { minDay: 25, interval: 80, maxRepeats: 5, excludeFlags: ["_c939HealthCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c939HealthCd) return false;
        var _fatigue = (st.needs && st.needs.fatigue) || 0;
        var _hasJob = st.career && st.career.currentJob;
        return (_fatigue >= 60 || (st.flags._workStreak || 0) >= 4) && _hasJob && st.player.day >= 25;
      },
      probability: 0.04, repeatable: true,
      choices: [
        { text: "🏥 调整作息，注意健康", hint: "疲劳-18,健康+5,置_c939HealthBalance", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._c939HealthCd = true; st.flags._c939HealthBalance = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 18);
          if (st.player) st.player.health = Math.min(100, (st.player.health || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏥 你调整了作息，身体舒服多了——疲劳-18,健康+5。", "success");
        }},
        { text: "💪 再坚持一下", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._c939HealthCd = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 再坚持一下。心智+5。", "info");
        }}
      ]
    },
    {
      id: "c939_skill_invest_v1",
      phase: "street", icon: "📈", title: "技能驱动投资眼光",
      story: "你在工作中积累的专业技能，不知不觉间也提升了你的投资判断力。\n\n同一个行业干久了，哪些公司有前途、哪些技术有前景，你心里自然有数。",
      triggers: { minDay: 70, interval: 100, maxRepeats: 3, excludeFlags: ["_c939SkillInvestCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c939SkillInvestCd) return false;
        if (!st.skills) return false;
        var _maxLv = 0;
        for (var _sk in st.skills) { var _sl = st.skills[_sk]; if (_sl && (_sl.level || 0) > _maxLv) _maxLv = _sl.level || 0; }
        return _maxLv >= 35 && st.player.day >= 70;
      },
      probability: 0.04, repeatable: true,
      choices: [
        { text: "📈 用专业技能指导投资", hint: "智力+12,会计XP+15,置_c939SkillInvestor", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._c939SkillInvestCd = true; st.flags._c939SkillInvestor = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
          grantXp("accounting", 15);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你用专业技能指导了投资——智力+12,会计XP+15。", "success");
        }},
        { text: "😅 投资太复杂", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._c939SkillInvestCd = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😅 投资太复杂。心智+3。", "info");
        }}
      ]
    },
    {
      id: "c939_career_social_v1",
      phase: "street", icon: "👥", title: "职业成就带来社交圈",
      story: "你在职场上的发展让你接触到了更多优秀的人。\n\n行业会议、同行交流、前辈指点——你的社交圈在不知不觉中扩大。",
      triggers: { minDay: 50, interval: 110, maxRepeats: 4, excludeFlags: ["_c939CareerSocialCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c939CareerSocialCd) return false;
        if (!st.career || !st.career.currentJob) return false;
        var _daysInJob = st.player.day - (st.career.currentJob.startedDay || 0);
        return (_daysInJob >= 25 || (st.career.totalWorkDays || 0) >= 100) && st.player.day >= 50;
      },
      probability: 0.04, repeatable: true,
      choices: [
        { text: "👥 拓展职业人脉", hint: "魅力+8,管理XP+12,置_c939CareerNetwork", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._c939CareerSocialCd = true; st.flags._c939CareerNetwork = true;
          if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 8);
          grantXp("management", 12);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 你拓展了职业人脉——魅力+8,管理XP+12。", "success");
        }},
        { text: "😅 专注工作", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._c939CareerSocialCd = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😅 专注工作。心智+3。", "info");
        }}
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