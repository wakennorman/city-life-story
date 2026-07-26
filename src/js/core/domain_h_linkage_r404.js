/**
 * 域H(Phase2/公司) 联动增强 R404
 * 第十七轮循环——把隐藏在startup/corp经营数据中的数字转化为叙事体验。
 * 桥接：
 *   H→A  h404_business_data_viz    经营数据可视化 → 消费 startup.company/corporate 数据,
 *     把公司经营数字转化为"我的企业画像"数据摘要
 *   H→G  h404_founder_lifestyle     创始人生活方式 → 消费 corporate+needs 数据,
 *     高压经营→"创业者也是人"的身心回响
 *   H→B  h404_corp_legacy           公司传承 → 消费 startup.history/flags 数据,
 *     创业历程→"这段经历如何改变了我"的叙事
 *
 * 严格照 domain_h_linkage_r393.js / r386.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR404Loaded) return;
  RANDOM_EVENTS._domainHLinkageR404Loaded = true;

  // 安全技能经验
  function grantSkillXpR404(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  var EVENTS = [
    {
      // H→A: 经营数据可视化 — 消费 startup.company/corporate
      id: "h404_business_data_viz",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "企业画像",
      story:
        "你审视了自己创办的企业——{bizSummary}\n\n数字背后,是一个活生生的组织。",
      triggers: { minDay: 60, excludeFlags: ["_h404BizDataCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        return true;
      },
      choices: [
        {
          text: "📈 用数据驱动决策",
          hint: "心智+4,management XP+3,置 _h404BizDataCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h404BizDataCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            grantSkillXpR404("management", 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📊 你用数据审视企业——数字是决策的基石。心智+4,管理XP+3。", "success");
          }
        },
        {
          text: "🤷 感觉比数字更重要",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        var corp = st.player.corporate;
        var summary = "在职" + (corp.daysInJob || 0) + "天";
        if (corp.kpi !== undefined) summary += ",KPI " + corp.kpi + "分";
        if (corp.rank) summary += ",职级" + corp.rank;
        return "你审视了自己创办的企业——" + summary + "。\n\n数字背后,是一个活生生的组织。";
      }
    },
    {
      // H→G: 创始人生活方式 — 消费 corporate+needs
      id: "h404_founder_lifestyle",
      phase: "corporate",
      _isChainEvent: false,
      icon: "⚖️",
      title: "创业者的生活",
      story:
        "你意识到创业不只是工作——{lifeInsight}\n\n{balanceAdvice}",
      triggers: { minDay: 80, excludeFlags: ["_h404LifeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        return true;
      },
      choices: [
        {
          text: "🧘 关注身心健康",
          hint: "心智+4,心情+5,置 _h404LifeCooldown(100天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h404LifeCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("⚖️ 你关注创业者生活平衡——身心健康是持久战的基础。心智+4,心情+5。", "success");
          }
        },
        {
          text: "💪 再拼一把",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var insight = "创业是一场马拉松,不是百米冲刺";
        var advice = "注意休息,才能走得更远";
        if (st.needs) {
          var fatigue = st.needs.fatigue || 0;
          if (fatigue > 70) {
            insight = "最近工作强度很大,身体已经在发出警告";
            advice = "适当休息,不是懈怠,是为了更好地前进";
          }
        }
        return "你意识到创业不只是工作——" + insight + "。\n\n" + advice + "。";
      }
    },
    {
      // H→B: 公司传承 — 消费 startup.history/flags
      id: "h404_corp_legacy",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📜",
      title: "创业历程",
      story:
        "回望创业这条路——{legacyText}\n\n这段经历,已经成为你人生的一部分。",
      triggers: { minDay: 100, excludeFlags: ["_h404LegacyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        return true;
      },
      choices: [
        {
          text: "🌟 感恩这段经历",
          hint: "心智+5,管理XP+4,置 _h404LegacyCooldown(120天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h404LegacyCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            grantSkillXpR404("management", 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📜 你回望创业历程——这段经历塑造了今天的你。心智+5,管理XP+4。", "achievement");
          }
        },
        {
          text: "💪 继续书写新的篇章",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        var days = st.player.corporate.daysInJob || 0;
        var text = "从入职到今天,你已经在职场走了" + days + "天";
        if (days >= 365) text = "一年多的职场生涯,你从新人成长为独当一面的经营者";
        return "回望创业这条路——" + text + "。\n\n这段经历,已经成为你人生的一部分。";
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
