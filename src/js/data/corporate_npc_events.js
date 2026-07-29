/**
 * 职场NPC深度互动事件 — D→H 联动
 * [全系统自洽修复] 域H: conditions全部门控 state.corporate.active + NPC met/goodwill
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  function npcMetCheck(st, npcId) {
    var rel = st.relationships && st.relationships[npcId];
    return rel && rel.met === true && (rel.affinity || 0) >= 30;
  }

  // 事件1: 李工头的技术顾问邀请
  var li_guru_invite = {
    id: "li_guru_invite",
    title: "🔧 李工头的技术顾问",
    phase: "corporate",
    repeatable: true,
    cooldownDays: 90,
    priority: 70,
    conditions: function (st) {
      if (!st.corporate || !st.corporate.active) return false;
      if (!npcMetCheck(st, "boss_li")) return false;
      if (st.flags && st.flags._liGuruInviteDone) return false;
      if (!st.skills) return false;
      return (st.skills.coding && st.skills.coding.level || 0) >= 35;
    },
    probability: 0.03,
    story:
      "李工头打电话来：「兄弟，听说你在大公司上班了？我们工地有几个设备要改造，你能不能周末来帮我看一下？」\n\n他说报酬不低，而且想正式聘你为技术顾问。",
    choices: [
      {
        text: "✅ 周末去看看（赚钱但累）",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 3000;
          if (typeof addDailyTransaction === "function") addDailyTransaction(st, "income", "li_consulting", 3000, "周末技术咨询费（李工头）");
          st.player.physique = Math.max(0, (st.player.physique || 10) - 2);
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 50) + 10);
          if (!st.relationships.boss_li) st.relationships.boss_li = { met: true, affinity: 0 };
          st.relationships.boss_li.affinity = Math.min(100, (st.relationships.boss_li.affinity || 0) + 8);
          st.flags._liGuruInviteDone = true;
          StateManager.addMessage("🛠️ 周末帮李工头看工地，赚了¥3000，体力-2，疲劳+10。", "success");
        },
      },
      {
        text: "❌ 太忙了，下次吧",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._liGuruInviteDone = true;
          st.flags._liGuruInviteDeclined = true;
          StateManager.addMessage("🚫 你以加班为由婉拒了李工头。", "info");
        },
      },
    ],
    icons: ["🔧", "💰"],
  };

  // 事件2: 小美的职业建议
  var xiaomei_career_tip = {
    id: "xiaomei_career_tip",
    title: "💬 小美的职业建议",
    phase: "corporate",
    repeatable: true,
    cooldownDays: 120,
    priority: 60,
    conditions: function (st) {
      if (!st.corporate || !st.corporate.active) return false;
      if (!npcMetCheck(st, "xiao_mei")) return false;
      if (st.flags && st.flags._xiaomeiCareerTipDone) return false;
      return (st.player.day || 0) >= 120;
    },
    probability: 0.04,
    story:
      "小美约你喝咖啡：「你现在在大厂了吧？我刚认识几个同行朋友，听说现在AI和新能源方向最火。你要不要考虑转岗？」",
    choices: [
      {
        text: "🤖 关注AI赛道（向上管理+KPI）",
        apply: function (st) {
          if (!st.flags) st.flags = {}; // [全系统自洽修复] 域D: state.flags守卫(旧存档防TypeError)
          var c = st.player.corporate;
          if (!c) return;
          c.upwardMgmt = Math.min(100, (c.upwardMgmt || 0) + 5);
          c.kpi = Math.min(150, (c.kpi || 0) + 5);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 500;
          if (!st.relationships.xiao_mei) st.relationships.xiao_mei = { met: true, affinity: 0 };
          st.relationships.xiao_mei.affinity = Math.min(100, (st.relationships.xiao_mei.affinity || 0) + 5);
          st.flags._xiaomeiCareerTipDone = true;
          StateManager.addMessage("💡 听取小美建议关注AI赛道，向上管理+5，KPI+5，交通费¥500。", "success");
        },
      },
      {
        text: "🌱 转向新能源（人缘+能力）",
        apply: function (st) {
          if (!st.flags) st.flags = {}; // [全系统自洽修复] 域D: state.flags守卫(旧存档防TypeError)
          var c = st.player.corporate;
          if (!c) return;
          c.popularity = Math.min(100, (c.popularity || 0) + 5);
          c.ability = Math.min(100, (c.ability || 0) + 3);
          if (!st.relationships.xiao_mei) st.relationships.xiao_mei = { met: true, affinity: 0 };
          st.relationships.xiao_mei.affinity = Math.min(100, (st.relationships.xiao_mei.affinity || 0) + 5);
          st.flags._xiaomeiCareerTipDone = true;
          StateManager.addMessage("🌱 转向新能源方向，人缘+5，能力+3。", "success");
        },
      },
      {
        text: "⏸️ 先稳住再说",
        apply: function (st) {
          if (!st.flags) st.flags = {}; // [全系统自洽修复] 域D: state.flags守卫(旧存档防TypeError)
          if (!st.relationships.xiao_mei) st.relationships.xiao_mei = { met: true, affinity: 0 };
          st.relationships.xiao_mei.affinity = Math.min(100, (st.relationships.xiao_mei.affinity || 0) + 5);
          st.flags._xiaomeiCareerTipDone = true;
          StateManager.addMessage("🤔 你决定先稳住当前方向，不急转岗。", "info");
        },
      },
    ],
    icons: ["☕", "💡"],
  };

  // 事件3: 赵姐的内部推荐
  var zhaojie_jump_info = {
    id: "zhaojie_jump_info",
    title: "📋 赵姐的内部推荐",
    phase: "corporate",
    repeatable: true,
    cooldownDays: 180,
    priority: 75,
    conditions: function (st) {
      if (!st.corporate || !st.corporate.active) return false;
      if (!npcMetCheck(st, "zhaojie")) return false;
      if (st.flags && st.flags._zhaojieJumpInfoDone) return false;
      return (st.relationships.zhaojie && st.relationships.zhaojie.affinity || 0) >= 50;
    },
    probability: 0.035,
    story:
      "赵姐发来微信：「我们公司正在招高级工程师，五险一金齐全，年薪¥40W起，你要不要看看？」",
    choices: [
      {
        text: "📝 好好准备（锁定内部推荐）",
        apply: function (st) {
          if (!st.flags) st.flags = {}; // [全系统自洽修复] 域D: state.flags守卫(旧存档防TypeError)
          var c = st.player.corporate;
          if (!c) return;
          st.flags._zhaojieJumpPrepared = true;
          c.upwardMgmt = Math.min(100, (c.upwardMgmt || 0) + 3);
          st.relationships.zhaojie.affinity = Math.min(100, (st.relationships.zhaojie.affinity || 0) + 3);
          st.flags._zhaojieJumpInfoDone = true;
          StateManager.addMessage("📋 你开始准备跳槽材料，赵姐的推荐通道已锁定。向上管理+3。", "info");
        },
      },
      {
        text: "🙅 暂时不跳（礼貌拒绝）",
        apply: function (st) {
          if (!st.flags) st.flags = {}; // [全系统自洽修复] 域D: state.flags守卫(旧存档防TypeError)
          st.flags._zhaojieJumpPassed = true;
          st.relationships.zhaojie.affinity = Math.min(100, (st.relationships.zhaojie.affinity || 0) + 3);
          st.flags._zhaojieJumpInfoDone = true;
          StateManager.addMessage("🙅 你觉得目前还不想动，礼貌拒绝了赵姐的好意。", "info");
        },
      },
    ],
    icons: ["💬", "💼"],
  };

  // 事件4: 老周的旧部招聘
  var oldzhou_hiring = {
    id: "oldzhou_hiring",
    title: "🏗️ 老周扩建队伍",
    phase: "corporate",
    repeatable: true,
    cooldownDays: 180,
    priority: 60,
    conditions: function (st) {
      if (!st.corporate || !st.corporate.active) return false;
      if (!npcMetCheck(st, "old_zhou")) return false;
      if (st.flags && st.flags._oldzhouHiringDone) return false;
      return (st.player.physique || 0) >= 40;
    },
    probability: 0.025,
    story:
      "老周在群里喊话：「兄弟，我承包了新的大项目，缺几个带班和质检的。你有大厂背景又懂体力活，来当我的工程主管怎么样？」",
    choices: [
      {
        text: "👥 介绍工人给他（赚咨询费）",
        apply: function (st) {
          if (!st.flags) st.flags = {}; // [全系统自洽修复] 域D: state.flags守卫(旧存档防TypeError)
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
          if (typeof addDailyTransaction === "function") addDailyTransaction(st, "income", "oldzhou_referral", 2000, "工程外包咨询费");
          if (!st.relationships.old_zhou) st.relationships.old_zhou = { met: true, affinity: 0 };
          st.relationships.old_zhou.affinity = Math.min(100, (st.relationships.old_zhou.affinity || 0) + 5);
          st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 2);
          st.flags._oldzhouHiringDone = true;
          StateManager.addMessage("🏗️ 给老周介绍2个靠谱工人，赚了¥2000，智力+2。", "success");
        },
      },
      {
        text: "👷 跟着老周跑工程（锻炼管理）",
        apply: function (st) {
          if (!st.flags) st.flags = {}; // [全系统自洽修复] 域D: state.flags守卫(旧存档防TypeError)
          st.flags._oldzhouSelfManage = true;
          st.player.charm = Math.min(100, (st.player.charm || 10) + 3);
          st.flags._oldzhouHiringDone = true;
          StateManager.addMessage("👷 你决定自己跟老周跑工程，锻炼了管理能力。魅力+3。", "success");
        },
      },
      {
        text: "🚫 专心大厂工作",
        apply: function (st) {
          if (!st.flags) st.flags = {}; // [全系统自洽修复] 域D: state.flags守卫(旧存档防TypeError)
          st.flags._oldzhouHiringDone = true;
          StateManager.addMessage("🤝 你感谢老周抬爱，但现在在大厂干得还不错。", "info");
        },
      },
    ],
    icons: ["🏗️", "💪"],
  };

  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(li_guru_invite, xiaomei_career_tip, zhaojie_jump_info, oldzhou_hiring);
  }
})();
// [R346] 域B
// [R426] 域B
// [R514] 域B
// [R594] 域B
