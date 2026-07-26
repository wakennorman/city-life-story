/**
 * 域H(Phase2/公司) 联动增强 R393
 * 第十七轮循环——公司阶段的数据回响:把隐藏的职场/经营数据转化为叙事体验。
 * 桥接：
 *   H→F  h393_culture_dashboard       公司文化仪表盘 → 消费 corporate.culture/perfHistory 数据,
 *     把抽象职场数字转化为"公司文化如何"的UI提示,mental+happiness
 *   H→B  h393_milestone_anniversary    里程碑周年 → 消费 corpYear/corpQuarter 数据,
 *     公司周年/季度节点触发"又一年"叙事回响,management XP
 *   H→E  h393_corporate_invest_loop    公司反哺投资 → 消费 corporate.salary+investment 数据,
 *     在职薪资+投资意识→"用工资收入做投资"的财富觉醒
 *
 * 严格照 domain_h_linkage_r386.js / r378.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR393Loaded) return;
  RANDOM_EVENTS._domainHLinkageR393Loaded = true;

  // 安全技能经验
  function grantSkillXpR393(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  // 安全地点中文名
  function locNameR393(locKey) {
    if (typeof getLocation === "function") {
      try { var l = getLocation(locKey); if (l && l.name) return l.name; } catch (e) { /* safe */ }
    }
    return locKey;
  }

  var EVENTS = [
    {
      // H→F: 公司文化仪表盘 — 消费 corporate.culture/perfHistory 数据
      id: "h393_culture_dashboard",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏛️",
      title: "公司文化仪表盘",
      story:
        "你回顾了团队近期的氛围和文化。{cultureInsight}\n\n{perfSummary}",
      triggers: { minDay: 90, excludeFlags: ["_h393CultureDashCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        var corp = st.player.corporate;
        // 需要在职一定天数
        if ((corp.daysInJob || 0) < 30) return false;
        return true;
      },
      choices: [
        {
          text: "👍 文化是团队的粘合剂",
          hint: "心智+3,心情+4,置 _h393CultureDashCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h393CultureDashCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🏛️ 你审视了公司文化,好的文化让团队更有凝聚力。心智+3,心情+4。", "success");
          }
        },
        {
          text: "😐 先把业绩做好再说",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        var corp = st.player.corporate;
        var culture = corp.culture || "standard";
        var cultureMap = { wolf: "狼性文化——拼搏但压力大", engineer: "工程师文化——务实但社交少", family: "家文化——温暖但边界模糊", standard: "务实文化——平衡务实与人文" };
        var insight = "当前团队文化偏向「" + (cultureMap[culture] || culture) + "」";
        var perfSummary = "";
        if (corp.perfHistory && corp.perfHistory.length > 0) {
          var recent = corp.perfHistory.slice(-4);
          var avgScore = 0;
          for (var i = 0; i < recent.length; i++) avgScore += (recent[i] && recent[i].score) || 0;
          avgScore = Math.round(avgScore / recent.length);
          perfSummary = "近" + recent.length + "个季度平均绩效" + avgScore + "分。";
        } else {
          perfSummary = "绩效记录正在积累中。";
        }
        return "你回顾了团队近期的氛围和文化。" + insight + "。\n\n" + perfSummary;
      }
    },
    {
      // H→B: 里程碑周年 — 消费 corpYear/corpQuarter 数据
      id: "h393_milestone_anniversary",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🎂",
      title: "又一个里程碑",
      story:
        "时间过得真快——{milestoneText}。{yearInsight}\n\n回望这一路,你从{fromRole}走到了今天。",
      triggers: { minDay: 60, excludeFlags: ["_h393MilestoneAnnivCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        var corp = st.player.corporate;
        // 在职满一年(365天)或满100天触发
        var days = corp.daysInJob || 0;
        return days >= 100;
      },
      choices: [
        {
          text: "🎉 纪念这个时刻",
          hint: "management XP+8,心智+4,置 _h393MilestoneAnnivCooldown(180天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h393MilestoneAnnivCooldown = true;
            grantSkillXpR393("management", 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🎉 你纪念了在职的又一个里程碑。管理XP+8,心智+4。", "achievement");
          }
        },
        {
          text: "💪 继续前进,还有更多挑战",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        var days = st.player.corporate.daysInJob || 0;
        var milestoneText, yearInsight;
        if (days >= 365) {
          var years = Math.floor(days / 365);
          milestoneText = "你已在职" + years + "年了";
          yearInsight = "这一年里你经历了许多挑战,也收获了许多成长。";
        } else if (days >= 180) {
          milestoneText = "你已在职半年了";
          yearInsight = "从初见到现在,你已经融入了这个团队。";
        } else {
          milestoneText = "你已在职" + days + "天了";
          yearInsight = "初来乍到的新鲜感还在,你已经不再是新人了。";
        }
        return "时间过得真快——" + milestoneText + "。" + yearInsight + "\n\n回望这一路,你从职场新人走到了今天。";
      }
    },
    {
      // H→E: 公司反哺投资 — 消费 corporate.salary + investment 数据
      id: "h393_corporate_invest_loop",
      phase: "corporate",
      _isChainEvent: false,
      icon: "💹",
      title: "工资与投资的良性循环",
      story:
        "这个月工资到账了——¥{salaryAmt}。{investInsight}\n\n打工人的收入不只是消费,也可以是投资的种子资金。",
      triggers: { minDay: 90, excludeFlags: ["_h393InvestLoopCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        var corp = st.player.corporate;
        // 需要有薪资收入
        if ((corp.salary || 0) <= 0) return false;
        // 需要有投资系统
        if (!st.investment) return false;
        return true;
      },
      choices: [
        {
          text: "📈 拿一部分工资做投资",
          hint: "置 _dataInvestorMindset+_salaryInvestIntent,accounting XP+5,置 _h393InvestLoopCooldown(60天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h393InvestLoopCooldown = true;
            st.flags._dataInvestorMindset = true;
            st.flags._salaryInvestIntent = true;
            grantSkillXpR393("accounting", 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📈 你决定用工资收入做投资——从打工人到投资者的思维转变。会计XP+5。", "success");
          }
        },
        {
          text: "🛍️ 先改善一下生活",
          hint: "心情+3",
          apply: function (st) {
            if (st && st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        var salary = st.player.corporate.salary || 0;
        var investInsight = "";
        if (st.investment) {
          var hasInvested = (st.investment.stockHoldings && st.investment.stockHoldings.length > 0) ||
                           (st.investment.btcHoldings && st.investment.btcHoldings > 0) ||
                           (st.investment.properties && st.investment.properties.length > 0);
          investInsight = hasInvested
            ? "你已经有了一些投资经验,用工资收入继续布局是明智之举。"
            : "开始学习投资,让钱为你工作是人生的重要一课。";
        }
        return "这个月工资到账了——¥" + salary.toLocaleString() + "。" + investInsight + "\n\n打工人的收入不只是消费,也可以是投资的种子资金。";
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
