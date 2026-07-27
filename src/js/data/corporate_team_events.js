/**
 * 职场团队叙事事件 — H内部联动（team数据→事件叙事）
 * [全系统自洽修复] 域H: team数组守卫 + rank门控
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  /** 技术极客的神来之笔 */
  var geek_brilliant_moment = {
    id: "geek_brilliant_moment",
    title: "🐛 极客修了一个没人搞定的Bug",
    phase: "corporate",
    repeatable: true,
    cooldownDays: 60,
    priority: 65,
    conditions: function (st) {
      if (!st.corporate || !st.corporate.active) return false;
      if (st.flags && st.flags._geekBrilliantCooldown && (st.player.day || 0) < st.flags._geekBrilliantCooldown) return false; // [全系统自洽修复] 域H A类: st.flags 守卫
      var rankData = st.corporate.rank ? CORP_RANKS[st.corporate.rank] : null;
      if (!rankData || !rankData.canManageTeam) return false;
      if (!st.corporate.team || st.corporate.team.length === 0) return false;
      return st.corporate.team.some(function (t) { return t.id === "geek_coder"; });
    },
    probability: 0.04,
    story:
      "技术极客突然冲进你办公室：「老大！那个生产环境的老Bug我找到了！」\n\n他熬了两个通宵，修好了一个困扰团队半年的性能瓶颈。老板在群里点名表扬了你这个'技术骨干'。",
    choices: [
      {
        text: "👍 表扬团队（KPI+10/能力+3/奖金¥1000）",
        apply: function (st) {
          var c = st.player.corporate;
          if (!c) return;
          c.kpi = Math.min(150, (c.kpi || 0) + 10);
          c.ability = Math.min(100, (c.ability || 0) + 3);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1000;
          if (typeof addDailyTransaction === "function") addDailyTransaction(st, "income", "geek_bonus", 1000, "极客突破奖金");
          st.flags._geekBrilliantCooldown = (st.player.day || 0) + 90; // 90天冷却
          StateManager.addMessage("🐛 技术极客神来之笔！KPI+10，能力+3，团队奖金¥1000。", "success");
        },
      },
    ],
    icons: ["🐛", "💪"],
  };

  /** 房贷战神的崩溃边缘 */
  var warrior_burnout_warning = {
    id: "warrior_burnout_warning",
    title: "😰 房贷战神倒下了",
    phase: "corporate",
    repeatable: false,
    cooldownDays: 365,
    priority: 70,
    conditions: function (st) {
      if (!st.corporate || !st.corporate.active) return false;
      if (st.flags && st.flags._warriorBurnoutDone) return false; // [全系统自洽修复] 域H A类: st.flags 守卫
      var rankData = st.corporate.rank ? CORP_RANKS[st.corporate.rank] : null;
      if (!rankData || !rankData.canManageTeam) return false;
      if (!st.corporate.team || st.corporate.team.length === 0) return false;
      return st.corporate.team.some(function (t) { return t.id === "mortgage_warrior"; });
    },
    probability: 0.02,
    story:
      "早上打卡时发现房贷战神没来。下午接到医院电话——他心脏病突发送急诊了。\n\n他背了180万房贷，孩子还在上幼儿园。他同事说他连续三个月每天只睡5小时。",
    choices: [
      {
        text: "💝 自掏腰包帮助（现金-¥5000，尊严+5）",
        apply: function (st) {
          var c = st.player.corporate;
          if (!c) return;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) - 5000;
          if (typeof addDailyTransaction === "function") addDailyTransaction(st, "expense", "team_help", 5000, "团队成员紧急救助金");
          c.dignity = Math.min(100, (c.dignity || 0) + 5);
          c.popularity = Math.min(100, (c.popularity || 0) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          st.flags._warriorBurnoutDone = true;
          StateManager.addMessage("💝 你自掏腰包资助了战友，尊严+5，人缘+5，心情+5。", "success");
        },
      },
      {
        text: "📋 按流程提交报告（风险+5）",
        apply: function (st) {
          var c = st.player.corporate;
          if (!c) return;
          c.risk = Math.min(100, (c.risk || 0) + 5);
          c.dignity = Math.min(100, (c.dignity || 0) - 3);
          st.flags._warriorBurnoutDone = true;
          StateManager.addMessage("📋 你向HR提交了事故报告，但心里不是滋味。风险+5，尊严-3。", "warning");
        },
      },
      {
        text: "😶 什么都没说（人气-5）",
        apply: function (st) {
          var c = st.player.corporate;
          if (!c) return;
          c.popularity = Math.max(0, (c.popularity || 0) - 5);
          st.flags._warriorBurnoutDone = true;
          StateManager.addMessage("😶 你选择了沉默。人气-5。", "info");
        },
      },
    ],
    icons: ["🏥", "💔"],
  };

  /** 应届生离职危机 */
  var grad_quitting_crisis = {
    id: "grad_quitting_crisis",
    title: "📄 应届生递了辞职信",
    phase: "corporate",
    repeatable: true,
    cooldownDays: 90,
    priority: 60,
    conditions: function (st) {
      if (!st.corporate || !st.corporate.active) return false;
      if (st.flags && st.flags._gradQuitCooldown && (st.player.day || 0) < st.flags._gradQuitCooldown) return false; // [全系统自洽修复] 域H A类: st.flags 守卫
      var rankData = st.corporate.rank ? CORP_RANKS[st.corporate.rank] : null;
      if (!rankData || !rankData.canManageTeam) return false;
      if (!st.corporate.team || st.corporate.team.length === 0) return false;
      return st.corporate.team.some(function (t) { return t.id === "new_graduate"; });
    },
    probability: 0.05,
    story:
      "应届生小刘把辞职信放在你桌上：「哥，我扛不住了。天天加班到凌晨，工资连房租都不够……我去考公了。」\n\n他刚来半年，是你亲手带的。",
    choices: [
      {
        text: "💬 试着挽留（需能力40+或人气40+）",
        apply: function (st) {
          var c = st.player.corporate;
          if (!c) return;
          st.flags._gradQuitCooldown = (st.player.day || 0) + 90;
          if ((c.ability || 0) >= 40 || (c.popularity || 0) >= 40) {
            c.popularity = Math.min(100, (c.popularity || 0) + 3);
            StateManager.addMessage("💬 你与小刘深谈，用愿景留住了他。人缘+3。", "success");
          } else {
            StateManager.addMessage("😔 你没能说服小刘，他走了。但你知道这不是你的错。", "info");
          }
        },
      },
      {
        text: "🔄 换人（现金-¥2000）",
        apply: function (st) {
          st.flags._gradQuitCooldown = (st.player.day || 0) + 90;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) - 2000;
          if (typeof addDailyTransaction === "function") addDailyTransaction(st, "expense", "recruit", 2000, "应届生替代招聘费");
          StateManager.addMessage("🔄 你花了¥2000重新招了个人，疲惫感增加。", "info");
        },
      },
      {
        text: "🤷 让他走吧",
        apply: function (st) {
          st.flags._gradQuitCooldown = (st.player.day || 0) + 90;
          StateManager.addMessage("🤷 你叹了口气，让HR走流程。", "info");
        },
      },
    ],
    icons: ["📄", "😢"],
  };

  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(geek_brilliant_moment, warrior_burnout_warning, grad_quitting_crisis);
  }
})();
// [R354] 域B
// [R434] 域B
// [R522] 域B
