/**
 * 域E(经济/投资) 联动增强 R284
 * 第四轮循环——投资积累的多维回响。
 * 桥接：
 *   E→G  investment_health_impact   投资压力→健康影响（核心机制·身心平衡）
 *   E→A  investment_data_feedback   投资数据→数值回馈（数据/数值·信息沉淀）
 *   E→C  investment_career_transfer 投资经验→职业迁移（职业/成长·知识迁移）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR284Loaded) return;
  RANDOM_EVENTS._domainELinkageR284Loaded = true;

  function calcTotalInvValueE284(st) {
    if (!st || !st.investment) return 0;
    var inv = st.investment;
    var total = (inv.cash || 0) + (inv.bankBalance || 0);
    if (inv.stockHoldings) {
      for (var i = 0; i < inv.stockHoldings.length; i++) {
        total += (inv.stockHoldings[i].shares || 0) * (inv.stockHoldings[i].currentPrice || inv.stockHoldings[i].avgPrice || 0);
      }
    }
    total += (inv.btcHoldings || 0) * (inv.btcPrice || 0);
    if (inv.properties) {
      for (var j = 0; j < inv.properties.length; j++) {
        total += inv.properties[j].currentPrice || inv.properties[j].buyPrice || 0;
      }
    }
    return total;
  }

  var EVENTS = [
    {
      id: "investment_health_impact",
      phase: "street",
      _isChainEvent: false,
      icon: "😰",
      title: "投资压力对健康的影响",
      story: "最近投资不太顺利，你开始失眠、焦虑、食欲下降。\n\n你发现，投资不仅是金钱游戏，也是心理游戏。账户里的数字波动，直接影响你的身体健康。\n\n你开始理解「风险承受能力」的真正含义——不是你能亏多少钱，而是你能承受多大的心理压力。",
      triggers: { minDay: 180, excludeFlags: ["_invHealthImpactSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.status || !st.needs) return false;
        var totalInv = calcTotalInvValueE284(st);
        if (totalInv < 10000) return false;
        return (st.status.health || 100) < 60 || (st.needs.happiness || 50) < 45;
      },
      choices: [
        {
          text: "😰 降低投资仓位，保护健康",
          hint: "健康+8，心情+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invHealthImpactSeen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 8);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("😰 你降低了投资仓位。投资是为了更好的生活，不是透支生活。健康+8，心情+8。", "success");
            }
          },
        },
        {
          text: "💊 扛过去，市场总会回暖",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invHealthImpactSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💊 你选择扛过去。但身体记住了这一次。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "investment_data_feedback",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资数据回馈",
      story: "你开始用数据审视自己的投资历程——收益率、最大回撤、持仓分布。\n\n这些数字让你发现了一些有趣的规律：某些时段的投资决策质量更高，某些类型的资产更适合你的风险偏好。\n\n你开始用数据优化投资策略，而不是凭感觉。",
      triggers: { minDay: 200, excludeFlags: ["_invDataFeedbackSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var totalInv = calcTotalInvValueE284(st);
        return totalInv >= 20000;
      },
      choices: [
        {
          text: "📊 用数据优化投资策略",
          hint: "心智+7，置投资数据flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invDataFeedbackSeen = true;
            st.flags._investmentDataDriven = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据优化投资策略。数据让决策更理性。心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 凭经验就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invDataFeedbackSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭经验就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "investment_career_transfer",
      phase: "street",
      _isChainEvent: false,
      icon: "🔄",
      title: "投资经验迁移职场",
      story: "你发现，投资中学到的经验开始在职场中发挥作用。\n\n「分散风险」让你不把所有希望押在一个客户身上，「长期主义」让你愿意花时间培养新人，「止损」让你及时放弃不靠谱的项目。\n\n投资不仅是赚钱，也是一种思维方式。",
      triggers: { minDay: 250, excludeFlags: ["_invCareerTransferSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.career || !st.career.currentJob) return false;
        var totalInv = calcTotalInvValueE284(st);
        return totalInv >= 15000 && (st.career.currentJob.workDays || 0) >= 100;
      },
      choices: [
        {
          text: "🔄 把投资思维带入职场",
          hint: "心智+8，最高技能XP+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCareerTransferSeen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔄 你把投资思维带入职场。投资不仅是赚钱，也是思维方式。技能XP+10，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 投资归投资，工作归工作",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCareerTransferSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得投资和工作应该分开。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
