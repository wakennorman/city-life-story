/**
 * 域E(经济/投资) 联动增强 R309
 * 第七轮循环——投资积累的多维回响。
 * 桥接：
 *   E→A  investment_data_v2            投资→数据回馈（数据/数值·信息沉淀）
 *   E→C  investment_career_v2         投资→职业联动（职业/成长·知识复用）
 *   E→G  investment_wellbeing_v2       投资→幸福感（核心机制·心理健康）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR309Loaded) return;
  RANDOM_EVENTS._domainELinkageR309Loaded = true;

  function calcTotalInvValueE309(st) {
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
      id: "investment_data_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资数据回馈",
      story: "你开始用数据审视自己的投资历程——收益率、最大回撤、持仓分布、交易频率。\n\n这些数字让你发现了一些有趣的规律：某些时段的投资决策质量更高，某些类型的资产更适合你的风险偏好。\n\n你开始用数据优化投资策略，而不是凭感觉。",
      triggers: { minDay: 300, excludeFlags: ["_invDataV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        return calcTotalInvValueE309(st) >= 40000;
      },
      choices: [
        {
          text: "📊 用数据优化投资策略",
          hint: "心智+9，置投资数据flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invDataV2Seen = true;
            st.flags._investmentDataDriven = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据优化投资策略。数据让决策更理性。心智+9。", "success");
            }
          },
        },
        {
          text: "🤷 凭经验就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invDataV2Seen = true;
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
      id: "investment_career_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🔄",
      title: "投资经验迁移职场",
      story: "你发现，投资中学到的经验开始在职场中发挥作用。\n\n「分散风险」让你不把所有希望押在一个客户身上，「长期主义」让你愿意花时间培养新人，「止损」让你及时放弃不靠谱的项目。\n\n投资不仅是赚钱，也是一种思维方式。",
      triggers: { minDay: 250, excludeFlags: ["_invCareerV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.career || !st.career.currentJob) return false;
        return calcTotalInvValueE309(st) >= 30000;
      },
      choices: [
        {
          text: "🔄 把投资思维带入职场",
          hint: "最高技能XP+12，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCareerV2Seen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔄 你把投资思维带入职场。投资不仅是赚钱，也是思维方式。技能XP+12，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 投资归投资，工作归工作",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCareerV2Seen = true;
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
    {
      id: "investment_wellbeing_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "😊",
      title: "投资带来的幸福感",
      story: "你发现，稳定的投资收益开始带来一种「安全感」。\n\n不是暴富的快乐，而是「即使今天不工作，也有收入」的踏实感。这种安全感让你更敢于追求自己真正想要的东西，而不是被生存压力推着走。\n\n你开始理解，「财务自由」不是有很多钱，而是有选择的自由。",
      triggers: { minDay: 350, excludeFlags: ["_invWellbeingV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.needs) return false;
        return calcTotalInvValueE309(st) >= 80000 && (st.investment.dailyInvIncome || 0) > 0;
      },
      choices: [
        {
          text: "😊 享受投资带来的安全感",
          hint: "心情+15，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invWellbeingV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("😊 你享受了投资带来的安全感。财务自由是有选择的自由。心情+15，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 继续积累，延迟满足",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invWellbeingV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得继续积累更重要。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
