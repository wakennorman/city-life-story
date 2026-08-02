/**
 * 域B(事件/叙事) 联动增强 R1021
 * — B→E 经济周期眼 / B→A 风险溢价 / B→C 叙事催化剂
 *
 * 设计意图：本轮 A类修复加固了事件系统的稳定性（4处 st.player 守卫 +
 * 1处 NaN 守卫 + 1处 var 重复声明）。本联动在叙事层面消费事件数据，
 * 让玩家可感知的「经历」转化为可量化的成长反馈。
 *
 * 约束：IIFE 注册 RANDOM_EVENTS；显式 phase；全 || 防御；
 *       done-flag 防重；NPC 一律 met 铁律。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR1021Loaded) return;
  RANDOM_EVENTS._domainBLinkageR1021Loaded = true;

  function gx(k, a) {
    if (typeof addSkillXp === "function") { try { addSkillXp(k, a); } catch (e) {} }
  }
  function msg(t, k) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage) StateManager.addMessage(t, k || "info");
  }

  var EVENTS = [
    // ===== 1. B→E 经济周期眼 =====
    {
      id: "b1021_economic_cycle_eye",
      phase: "street",
      icon: "👁️",
      title: "你开始看懂经济周期",
      story: "你翻着手机上的新闻，忽然发现一件以前从没注意过的事——\n\n那些涨涨跌跌的消息，好像不是孤立的。\n\n利率一降，房价就涨；房价一涨，建材就跟着涨；建材涨完，装修工就忙了……\n\n你以前只觉得这些是「新闻」，现在你看到的是「链条」。\n\n这种眼光，是钱买不来的。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b1021EconCycleDone) return false;
        // 消费多个经济类事件后触发
        var ecoCount = (st.flags._economicEventCount || 0);
        return ecoCount >= 5 && st.player.day >= 65;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "📈 开始关注经济指标",
          hint: "会计XP+30, 智力+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1021EconCycleDone = true;
            st.flags._b1021EconEye = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            gx("accounting", 30);
            msg("📈 会计XP+30，智力+8。你开始关注经济指标的联动关系。", "success");
          },
        },
        {
          text: "🧠 记在心里，以后用得上",
          hint: "心智+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1021EconCycleDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            msg("🧠 心智+8。有些事，看懂了比赚到钱更有用。", "info");
          },
        },
      ],
    },

    // ===== 2. B→A 风险溢价 =====
    {
      id: "b1021_risk_premium",
      phase: "street",
      icon: "⚠️",
      title: "高风险背后的溢价",
      story: "你回顾自己经历过的那些风险事件——\n\n有几回差点翻车，有几回侥幸脱身，也有几回确实付出了代价。\n\n但你发现一个规律：那些高风险的选择，虽然吓人，但回报也确实更高。\n\n问题不在于「该不该冒险」，而在于「你知不知道自己在冒多大的险」。\n\n现在的你，至少能判断这个了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b1021RiskPremiumDone) return false;
        // 风险事件数量和道德事件都达到阈值
        var riskCount = (st.flags._negativeEventStreak || 0) + (st.stats && st.stats.eventCounts && st.stats.eventCounts.risk || 0);
        return riskCount >= 3 && st.player.day >= 50;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "⚖️ 学会评估风险收益比",
          hint: "销售XP+25, 智力+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1021RiskPremiumDone = true;
            st.flags._b1021RiskAssessor = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            gx("sales", 25);
            msg("⚖️ 销售XP+25，智力+5。你开始学会评估风险——不是不冒险，而是有选择地冒险。", "success");
          },
        },
        {
          text: "😌 稳一点，活得久",
          hint: "心智+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1021RiskPremiumDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            msg("😌 心智+10。你选择了稳妥——不是胆小，是从经历中学会了敬畏。", "info");
          },
        },
      ],
    },

    // ===== 3. B→C 叙事催化剂 =====
    {
      id: "b1021_narrative_catalyst",
      phase: "street",
      icon: "🔥",
      title: "经历是最好的老师",
      story: "你坐在路边摊吃晚饭，隔壁桌两个年轻人在聊职业规划。\n\n一个说：「我想转行做运营，但不知道从哪开始。」\n另一个说：「要不报个班？」\n\n你听着，忽然意识到自己这些年的经历——那些跟人打交道的、讨价还价的、协调资源的时刻——其实已经教会了你很多书上没有的东西。\n\n你没有上过课，但你上过「真战场」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b1021CatalystDone) return false;
        // 经历足够多事件后触发
        var evtCount = (st.flags._eventsExperienced || 0) + (st.flags._eventHistory ? st.flags._eventHistory.length : 0);
        return evtCount >= 30 && st.player.day >= 45;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🔥 把经历转化为技能",
          hint: "管理XP+20, 社交XP+20",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1021CatalystDone = true;
            st.flags._b1021CatalystUnlocked = true;
            gx("management", 20);
            gx("social", 20);
            msg("🔥 管理XP+20，社交XP+20。你发现经历本身就是最好的教材。", "success");
          },
        },
        {
          text: "📝 把经验写成笔记",
          hint: "心智+8, 智力+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1021CatalystDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            msg("📝 心智+8，智力+5。你把这些年积累的经验写成了笔记。", "success");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();