/**
 * 域E(经济/投资) 联动增强 R335
 * 第十轮循环——投资积累的多维回响。
 * 桥接：
 *   E→C  investment_career_v2        投资→职业（职业/成长·知识复用）
 *   E→D  investment_social_v2        投资→社交（NPC/社交·投资圈）
 *   E→G  investment_life_v2          投资→人生（核心机制·财务自由）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR335Loaded) return;
  RANDOM_EVENTS._domainELinkageR335Loaded = true;

  function calcTotalInvValueE335(st) {
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
      id: "investment_career_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "🔄",
      title: "投资经验迁移职业v2",
      story: "你发现，投资中学到的经验开始在职场中发挥作用。\n\n「分散风险」让你不把所有希望押在一个客户身上，「长期主义」让你愿意花时间培养新人，「止损」让你及时放弃不靠谱的项目。\n\n投资不仅是赚钱，也是一种思维方式。",
      triggers: { minDay: 400, excludeFlags: ["_invCareerV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.career || !st.career.currentJob) return false;
        return calcTotalInvValueE335(st) >= 50000;
      },
      choices: [
        {
          text: "🔄 把投资思维带入职场",
          hint: "最高技能XP+13，心智+9",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCareerV2Seen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 13);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔄 你把投资思维带入职场。投资不仅是赚钱，也是思维方式。技能XP+13，心智+9。", "success");
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
      id: "investment_social_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "投资圈社交v2",
      story: "你开始认识一些同样关注投资的朋友——有的是股市老手，有的是房产专家，有的是创业导师。\n\n你们分享投资经验、交流市场看法、互相推荐机会。你发现，投资不仅是金钱游戏，也是社交游戏。\n\n「信息不对称」是最大的竞争优势，而社交网络是信息的来源。",
      triggers: { minDay: 450, excludeFlags: ["_invSocialV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.relationships) return false;
        return calcTotalInvValueE335(st) >= 80000;
      },
      choices: [
        {
          text: "🤝 主动拓展投资圈人脉",
          hint: "已结识NPC好感+6，心智+9",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invSocialV2Seen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met) {
                  applyAffinityChange(st, id, 6, "投资圈交流");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你主动拓展投资圈人脉。社交网络是信息的来源。好感+6，心智+9。", "success");
            }
          },
        },
        {
          text: "🤷 投资是个人行为，不需要社交",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invSocialV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得投资是个人行为。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "investment_life_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🌟",
      title: "投资带来人生自由",
      story: "你的投资组合开始稳定收益。这种「财务自由」的雏形让你开始思考人生的更多可能。\n\n你不再为生存压力所迫，开始有时间追求自己真正想要的东西——学习、旅行、创业、或者只是好好生活。\n\n你开始理解，「财务自由」不是有很多钱，而是有选择的自由。",
      triggers: { minDay: 500, excludeFlags: ["_invLifeV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.needs) return false;
        return calcTotalInvValueE335(st) >= 150000 && (st.investment.dailyInvIncome || 0) > 0;
      },
      choices: [
        {
          text: "🌟 享受财务自由带来的选择权",
          hint: "心情+18，心智+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌟 你享受了财务自由带来的选择权。财务自由是有选择的自由。心情+18，心智+12。", "success");
            }
          },
        },
        {
          text: "🤷 继续积累，延迟满足",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得继续积累更重要。心智+4。", "info");
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
