/**
 * 域E(经济/投资) 联动增强 R269
 * 投资积累的多维回响——投资不仅是数字，还在社交/职业/健康层面留下痕迹。
 * 桥接：
 *   E→D  investment_social_capital  投资经验→社交资本（社交·知识分享）
 *   E→C  investment_career_confidence 投资底气→职业自信（职业·心理账户）
 *   E→G  investment_lifestyle_quality 投资收益→生活品质（核心机制·恩格尔系数）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR269Loaded) return;
  if (RANDOM_EVENTS._domainELinkageR269) return;
  RANDOM_EVENTS._domainELinkageR269 = true;

  function calcTotalInvValueE269(st) {
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
      id: "investment_social_capital",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "投资经验是社交资本",
      story: "圈子里的人开始找你聊投资。\n\n「你之前买的那只股票怎么样了？」「你觉得现在适合入场吗？」\n\n你发现，投资经验不仅是赚钱的工具，也是社交的谈资。在这个城市里，懂投资的人总是受欢迎的。",
      triggers: { minDay: 150, excludeFlags: ["_invSocialCapitalSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.relationships) return false;
        var totalInv = calcTotalInvValueE269(st);
        if (totalInv < 10000) return false;
        var metNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met) metNpcs++;
        }
        return metNpcs >= 2;
      },
      choices: [
        {
          text: "🤝 分享你的投资经验",
          hint: "已结识NPC好感+3，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invSocialCapitalSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met) {
                  applyAffinityChange(st, id, 3, "投资经验分享");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你分享了投资经验。知识分享是双向的。好感+3，心智+5。", "success");
            }
          },
        },
        {
          text: "🤫 低调，不张扬",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invSocialCapitalSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你选择低调。闷声发大财。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "investment_career_confidence",
      phase: "street",
      _isChainEvent: false,
      icon: "💪",
      title: "投资底气带来的职业自信",
      story: "你的投资组合开始有了稳定的收益。这种「底气」开始影响你在职场中的表现。\n\n你不再为了一份工资忍气吞声，开始敢于表达自己的观点、争取自己的权益。\n\n你发现，经济独立带来的不仅是物质保障，更是精神自由。",
      triggers: { minDay: 200, excludeFlags: ["_invCareerConfidenceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.career || !st.career.currentJob) return false;
        var totalInv = calcTotalInvValueE269(st);
        return totalInv >= 20000;
      },
      choices: [
        {
          text: "💪 把底气带到职场",
          hint: "心智+7，心情+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCareerConfidenceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💪 你把投资底气带到了职场。经济独立带来精神自由。心智+7，心情+6。", "success");
            }
          },
        },
        {
          text: "🤷 投资归投资，工作归工作",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCareerConfidenceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得投资和工作应该分开。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "investment_lifestyle_quality",
      phase: "street",
      _isChainEvent: false,
      icon: "🏠",
      title: "投资收益改善生活",
      story: "你的投资收益开始覆盖一部分日常开销。你不再为每一分钱斤斤计较，开始有了「闲钱」——不是很多，但足够让你偶尔犒劳自己。\n\n你第一次感受到「钱生钱」的复利效应。这不是暴富，但是一种持续的、稳定的改善。",
      triggers: { minDay: 250, excludeFlags: ["_invLifestyleSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.resources) return false;
        var totalInv = calcTotalInvValueE269(st);
        if (totalInv < 30000) return false;
        return (st.investment.dailyInvIncome || 0) > 0;
      },
      choices: [
        {
          text: "🏠 用投资收益改善生活",
          hint: "心情+10，现金-1000",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifestyleSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏠 你用投资收益改善了生活。复利是最强大的力量。心情+10。", "success");
            }
          },
        },
        {
          text: "📈 继续复投，让雪球越滚越大",
          hint: "心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifestyleSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你选择继续复投。耐心是投资者最重要的品质。心智+5。", "info");
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
