/**
 * 域E(经济/投资) 联动增强 R343
 * 第十一轮循环——投资积累的多维回响。
 * 桥接：
 *   E→H  investment_company_v2       投资→公司（公司·资本反哺）
 *   E→C  investment_career_v3        投资→职业（职业/成长·知识复用）
 *   E→A  investment_data_v2          投资→数据（数据/数值·信息沉淀）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR343Loaded) return;
  RANDOM_EVENTS._domainELinkageR343Loaded = true;

  function calcTotalInvValueE343(st) {
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
      id: "investment_company_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🚀",
      title: "投资公司v2",
      story: "你发现，投资积累的经验和资本开始反哺公司。\n\n投资眼光让你能识别有潜力的供应商，财务分析让你能优化公司现金流，风险管理让你能规避经营风险。\n\n你开始理解，「投资思维」和「经营思维」是相通的。",
      triggers: { minDay: 500, excludeFlags: ["_invCompanyV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.startup || !st.startup.company) return false;
        return calcTotalInvValueE343(st) >= 100000;
      },
      choices: [
        {
          text: "🚀 把投资经验用于公司经营",
          hint: "心智+12，公司声誉+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCompanyV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 10;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🚀 你把投资经验用于公司经营。投资思维和经营思维是相通的。心智+12，声誉+10。", "success");
            }
          },
        },
        {
          text: "🤷 投资归投资，经营归经营",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCompanyV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得投资和经营应该分开。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "investment_career_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "🔄",
      title: "投资经验迁移职业v3",
      story: "你发现，投资中学到的经验开始在职场中发挥作用。\n\n「分散风险」让你不把所有希望押在一个客户身上，「长期主义」让你愿意花时间培养新人，「止损」让你及时放弃不靠谱的项目。\n\n投资不仅是赚钱，也是一种思维方式。",
      triggers: { minDay: 500, excludeFlags: ["_invCareerV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.career || !st.career.currentJob) return false;
        return calcTotalInvValueE343(st) >= 80000;
      },
      choices: [
        {
          text: "🔄 把投资思维带入职场",
          hint: "最高技能XP+15，心智+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCareerV3Seen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔄 你把投资思维带入职场。投资不仅是赚钱，也是思维方式。技能XP+15，心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 投资归投资，工作归工作",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCareerV3Seen = true;
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
      id: "investment_data_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资数据v2",
      story: "你开始用数据审视自己的投资历程——收益率、最大回撤、持仓分布、交易频率。\n\n这些数字让你发现了一些有趣的规律：某些时段的投资决策质量更高，某些类型的资产更适合你的风险偏好。\n\n你开始用数据优化投资策略，而不是凭感觉。",
      triggers: { minDay: 600, excludeFlags: ["_invDataV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        return calcTotalInvValueE343(st) >= 150000;
      },
      choices: [
        {
          text: "📊 用数据优化投资策略",
          hint: "心智+12，置投资数据flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invDataV2Seen = true;
            st.flags._investmentDataDrivenV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据优化投资策略。数据让决策更理性。心智+12。", "success");
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
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
