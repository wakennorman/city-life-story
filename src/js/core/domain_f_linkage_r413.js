/**
 * 域F(UI/UX) 联动增强 R413
 * 第十七轮循环——把隐藏在UI状态/导航/教程中的数据转化为叙事体验。
 * 桥接：
 *   F→A  f413_data_narrative         数据叙事化 → 消费 goods/pricing/jobs 数据,
 *     把抽象数据→"为什么这个数字重要"的UI叙事提示
 *   F→C  f413_career_ui_v2           职业UI增强v2 → 消费 employment+skills 数据,
 *     把职业状态→"我的职业发展如何"的UI洞察
 *   F→G  f413_health_ui_v2           健康UI增强v2 → 消费 status/illnesses 数据,
 *     把健康状态→"我的健康如何"的UI预警
 *
 * 严格照 domain_f_linkage_r390.js / r384.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR413Loaded) return;
  RANDOM_EVENTS._domainFLinkageR413Loaded = true;

  // 安全技能经验
  function grantSkillXpR413(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  var EVENTS = [
    {
      // F→A: 数据叙事化 — 消费 goods/pricing/jobs
      id: "f413_data_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "数字会说话",
      story:
        "你看着屏幕上的数据——{dataDesc}\n\n{insight}",
      triggers: { minDay: 45, excludeFlags: ["_f413DataCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "🧠 从数据中发现规律",
          hint: "心智+3,accounting XP+3,置 _f413DataCooldown(60天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f413DataCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            grantSkillXpR413("accounting", 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📊 你从数据中发现规律——数字背后是真实的生活。心智+3,会计XP+3。", "success");
          }
        },
        {
          text: "🤷 数据只是参考",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var day = st.player.day || 1;
        var cash = (st.resources && st.resources.cash) || 0;
        var desc = "第" + day + "天,当前现金¥" + cash.toLocaleString();
        var insight = "每一个数字都是你努力的结果";
        if (cash > 100000) insight = "六位数的积蓄,是你辛勤工作的见证";
        else if (cash < 500) insight = "资金紧张,需要更谨慎地规划支出";
        return "你看着屏幕上的数据——" + desc + "。\n\n" + insight + "。";
      }
    },
    {
      // F→C: 职业UI增强v2 — 消费 employment+skills
      id: "f413_career_ui_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💼",
      title: "职业发展一览",
      story:
        "你查看了职业发展面板——{careerDesc}\n\n{careerInsight}",
      triggers: { minDay: 55, excludeFlags: ["_f413CareerCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "📈 根据数据制定职业规划",
          hint: "心智+4,management XP+3,置 _f413CareerCooldown(80天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f413CareerCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            grantSkillXpR413("management", 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💼 你根据职业数据制定规划——明确的目标是成功的第一步。心智+4,管理XP+3。", "success");
          }
        },
        {
          text: "😊 顺其自然,做好当下",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var desc = "各项技能正在稳步提升";
        var insight = "持续积累,终会有所成就";
        if (st.skills) {
          var top = null, topLv = 0;
          for (var k in st.skills) {
            if (st.skills[k] && (st.skills[k].level || 0) > topLv) {
              topLv = st.skills[k].level || 0; top = k;
            }
          }
          var cn = { cooking: "烹饪", repair: "维修", coding: "编程", english: "英语",
            driving: "驾驶", sales: "销售", management: "管理", accounting: "会计",
            electrician: "电工", welding: "焊接", medicine: "医护", social: "社交" };
          if (top && topLv > 0) {
            desc = "最强技能:" + (cn[top] || top) + "(Lv." + topLv + ")";
            insight = "继续深耕,这项技能将成为你的核心竞争力";
          }
        }
        return "你查看了职业发展面板——" + desc + "。\n\n" + insight + "。";
      }
    },
    {
      // F→G: 健康UI增强v2 — 消费 status/illnesses
      id: "f413_health_ui_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "❤️",
      title: "健康仪表盘",
      story:
        "你查看了健康状态——{healthDesc}\n\n{healthAdvice}",
      triggers: { minDay: 40, excludeFlags: ["_f413HealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.status !== undefined;
      },
      choices: [
        {
          text: "💪 根据数据调整生活习惯",
          hint: "心智+4,置 _f413HealthCooldown(70天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f413HealthCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("❤️ 你根据健康数据调整习惯——身体是革命的本钱。心智+4。", "success");
          }
        },
        {
          text: "😅 感觉还行,不用太关注",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "健康状态良好";
        var advice = "保持当前的生活习惯";
        if (st.status) {
          var health = st.status.health;
          if (typeof health === "number") {
            desc = health >= 70 ? "健康状态良好(" + health + "分)" :
                   health >= 50 ? "健康状态一般(" + health + "分),需要关注" :
                   "健康状态欠佳(" + health + "分),需要休息";
            advice = health < 50 ? "建议减少工作强度,多休息" : "继续保持良好的生活习惯";
          }
        }
        return "你查看了健康状态——" + desc + "。\n\n" + advice + "。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
