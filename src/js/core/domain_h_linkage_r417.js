/**
 * 域H(Phase2/公司) 联动增强 R417
 * 第十七轮循环——把隐藏在startup/corp经营/团队管理中的数据转化为叙事体验。
 * 桥接：
 *   H→F  h417_corp_dashboard         公司仪表盘 → 消费 corporate+startup 数据,
 *     把经营数据→"公司运营状况如何"的UI摘要
 *   H→G  h417_founder_health          创始人健康v2 → 消费 corporate+needs+status 数据,
 *     高压经营→"创业者也要关注身体"的健康回响
 *   H→E  h417_corp_finance_v2        公司财务v2 → 消费 corporate+investment 数据,
 *     公司财务→"公司理财vs个人理财"的经济联动
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR417Loaded) return;
  RANDOM_EVENTS._domainHLinkageR417Loaded = true;

  function grantSkillXpR417(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  var EVENTS = [
    {
      id: "h417_corp_dashboard",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司运营仪表盘",
      story: "你审视了公司的整体运营状况——{dashboardDesc}\n\n数据驱动决策,是现代企业的核心竞争力。",
      triggers: { minDay: 65, excludeFlags: ["_h417DashCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.corporate;
      },
      choices: [
        {
          text: "📈 用数据驱动经营决策",
          hint: "心智+4,management XP+4,置 _h417DashCooldown(80天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h417DashCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            grantSkillXpR417("management", 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📊 你用数据审视公司运营——仪表盘是经营者的眼睛。心智+4,管理XP+4。", "success");
          }
        },
        {
          text: "🤷 凭经验管理就好",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        var corp = st.player.corporate;
        var desc = "公司运营正在步入正轨";
        if (typeof corp.kpi === "number") {
          desc = corp.kpi >= 80 ? "KPI表现优秀(" + corp.kpi + "分)" :
                 corp.kpi >= 50 ? "KPI达标(" + corp.kpi + "分)" : "KPI偏低(" + corp.kpi + "分),需要关注";
        }
        return "你审视了公司的整体运营状况——" + desc + "。\n\n数据驱动决策,是现代企业的核心竞争力。";
      }
    },
    {
      id: "h417_founder_health",
      phase: "corporate",
      _isChainEvent: false,
      icon: "❤️",
      title: "创业者的身体",
      story: "你意识到创业不能以牺牲健康为代价——{healthDesc}\n\n{healthAdvice}",
      triggers: { minDay: 75, excludeFlags: ["_h417FounderCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.corporate;
      },
      choices: [
        {
          text: "🧘 调整工作节奏,关注健康",
          hint: "心智+4,心情+5,置 _h417FounderCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h417FounderCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("❤️ 你调整工作节奏关注健康——创业者也是人,需要休息。心智+4,心情+5。", "success");
          }
        },
        {
          text: "💪 再拼一把,熬过这阵就好了",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var desc = "长期高压经营,身体在发出警告";
        var advice = "适当休息,才能走得更远";
        if (st.needs) {
          if ((st.needs.fatigue || 0) > 70) desc = "过度疲劳已经影响了工作效率";
          if ((st.needs.happiness || 100) < 40) advice = "心情低落时,更要关注身心健康";
        }
        return "你意识到创业不能以牺牲健康为代价——" + desc + "。\n\n" + advice + "。";
      }
    },
    {
      id: "h417_corp_finance_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "💰",
      title: "公司理财vs个人理财",
      story: "你思考公司与个人的财务关系——{financeDesc}\n\n健康的财务分离,是创业的基本功。",
      triggers: { minDay: 90, excludeFlags: ["_h417FinanceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.corporate && st.investment;
      },
      choices: [
        {
          text: "📊 做好公司与个人的财务分离",
          hint: "accounting XP+5,心智+3,置 _h417FinanceCooldown(100天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h417FinanceCooldown = true;
            grantSkillXpR417("accounting", 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💰 你做好公司个人财务分离——清晰的财务是企业的生命线。会计XP+5,心智+3。", "success");
          }
        },
        {
          text: "🤷 公司和个人分不开",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "公司财务和个人财务需要明确区分";
        if (st.investment && st.investment._totalInvestmentProfit !== undefined) {
          var profit = st.investment._totalInvestmentProfit;
          desc = profit > 0 ? "个人投资盈利¥" + profit.toLocaleString() + ",财务状况良好" :
                 "个人投资亏损¥" + Math.abs(profit).toLocaleString() + ",需要调整策略";
        }
        return "你思考公司与个人的财务关系——" + desc + "。\n\n健康的财务分离,是创业的基本功。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
