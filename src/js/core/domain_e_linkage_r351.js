/**
 * 域E(经济/投资) 联动增强 R351
 * 第十二轮循环——投资积累的多维回响。
 * 桥接：
 *   E→C  investment_career_v4        投资→职业（职业/成长·知识复用）
 *   E→D  investment_social_v3       投资→社交（NPC/社交·投资圈）
 *   E→B  investment_narrative_v2    投资→叙事（事件/叙事·财富故事）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR351Loaded) return;
  RANDOM_EVENTS._domainELinkageR351Loaded = true;

  function calcTotalInvValueE351(st) {
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
      id: "investment_career_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "🔄",
      title: "投资经验迁移职业v4",
      story: "你发现，投资中学到的经验开始在职场中发挥作用。\n\n「分散风险」让你不把所有希望押在一个客户身上，「长期主义」让你愿意花时间培养新人，「止损」让你及时放弃不靠谱的项目。\n\n投资不仅是赚钱，也是一种思维方式。",
      triggers: { minDay: 600, excludeFlags: ["_invCareerV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.career || !st.career.currentJob) return false;
        return calcTotalInvValueE351(st) >= 100000;
      },
      choices: [
        {
          text: "🔄 把投资思维带入职场",
          hint: "最高技能XP+18，心智+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCareerV4Seen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 18);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔄 你把投资思维带入职场。投资不仅是赚钱，也是思维方式。技能XP+18，心智+12。", "success");
            }
          },
        },
        {
          text: "🤷 投资归投资，工作归工作",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCareerV4Seen = true;
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
      id: "investment_social_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "投资圈社交v3",
      story: "你开始认识一些同样关注投资的朋友——有的是股市老手，有的是房产专家，有的是创业导师。\n\n你们分享投资经验、交流市场看法、互相推荐机会。你发现，投资不仅是金钱游戏，也是社交游戏。\n\n「信息不对称」是最大的竞争优势，而社交网络是信息的来源。",
      triggers: { minDay: 650, excludeFlags: ["_invSocialV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.relationships) return false;
        return calcTotalInvValueE351(st) >= 120000;
      },
      choices: [
        {
          text: "🤝 主动拓展投资圈人脉",
          hint: "已结识NPC好感+8，心智+11",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invSocialV3Seen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met) {
                  applyAffinityChange(st, id, 8, "投资圈交流");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 11);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你主动拓展投资圈人脉。社交网络是信息的来源。好感+8，心智+11。", "success");
            }
          },
        },
        {
          text: "🤷 投资是个人行为，不需要社交",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invSocialV3Seen = true;
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
      id: "investment_narrative_r351",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "投资人生故事v2",
      story: "你回顾自己的投资历程——第一次买股票的紧张，第一次亏损的心跳，第一次盈利的狂喜，第一次长期持有的耐心。\n\n这些经历不仅是财务记录，也是你人生故事的一部分。它们教会了你风险、耐心、纪律、和对自己决策的负责。\n\n你开始理解，投资不仅是赚钱，也是一种人生修行。",
      triggers: { minDay: 700, excludeFlags: ["_invNarrativeV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        return calcTotalInvValueE351(st) >= 200000;
      },
      choices: [
        {
          text: "📖 写下投资人生故事",
          hint: "心情+18，心智+14",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invNarrativeV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 14);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了投资人生故事。投资是人生修行。心情+18，心智+14。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，赚钱就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invNarrativeV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得赚钱比记录重要。心智+3。", "info");
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
