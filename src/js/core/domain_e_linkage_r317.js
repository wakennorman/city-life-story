/**
 * 域E(经济/投资) 联动增强 R317
 * 第八轮循环——投资积累的多维回响。
 * 桥接：
 *   E→B  investment_life_chapter_v2   投资→人生章节（事件/叙事·财富故事）
 *   E→D  investment_social_network   投资→社交网络（NPC/社交·投资圈）
 *   E→C  investment_career_boost      投资→职业提升（职业/成长·资本反哺）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR317Loaded) return;
  RANDOM_EVENTS._domainELinkageR317Loaded = true;

  function calcTotalInvValueE317(st) {
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
      id: "investment_life_chapter_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "投资人生章节v2",
      story: "你回顾自己的投资历程——第一次买股票的紧张，第一次亏损的心跳，第一次盈利的狂喜，第一次长期持有的耐心。\n\n这些经历不仅是财务记录，也是你人生故事的一部分。它们教会了你风险、耐心、纪律、和对自己决策的负责。\n\n你开始理解，投资不仅是赚钱，也是一种人生修行。",
      triggers: { minDay: 400, excludeFlags: ["_invLifeChapterV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        return calcTotalInvValueE317(st) >= 100000;
      },
      choices: [
        {
          text: "📖 写下投资人生故事",
          hint: "心情+12，心智+9",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeChapterV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了投资人生故事。投资是人生修行。心情+12，心智+9。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，赚钱就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeChapterV2Seen = true;
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
    {
      id: "investment_social_network",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "投资圈的社交网络",
      story: "你开始认识一些同样关注投资的朋友——有的是股市老手，有的是房产专家，有的是创业导师。\n\n你们分享投资经验、交流市场看法、互相推荐机会。你发现，投资不仅是金钱游戏，也是社交游戏。\n\n「信息不对称」是最大的竞争优势，而社交网络是信息的来源。",
      triggers: { minDay: 300, excludeFlags: ["_invSocialNetworkSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.relationships) return false;
        return calcTotalInvValueE317(st) >= 60000;
      },
      choices: [
        {
          text: "🤝 主动拓展投资圈人脉",
          hint: "已结识NPC好感+5，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invSocialNetworkSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met) {
                  applyAffinityChange(st, id, 5, "投资圈交流");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你主动拓展投资圈人脉。社交网络是信息的来源。好感+5，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 投资是个人行为，不需要社交",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invSocialNetworkSeen = true;
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
      id: "investment_career_boost",
      phase: "street",
      _isChainEvent: false,
      icon: "🚀",
      title: "投资助力职业发展",
      story: "你发现，投资积累的资本和经验开始反哺你的职业发展。\n\n投资眼光让你能识别有潜力的行业，财务分析让你能评估职业机会的成本收益，风险管理让你能做出更理性的职业决策。\n\n你开始理解，「投资思维」和「职业思维」是相通的。",
      triggers: { minDay: 350, excludeFlags: ["_invCareerBoostSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.career || !st.career.currentJob || !st.skills) return false;
        return calcTotalInvValueE317(st) >= 80000;
      },
      choices: [
        {
          text: "🚀 把投资思维用于职业发展",
          hint: "最高技能XP+15，心智+9",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCareerBoostSeen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🚀 你把投资思维用于职业发展。投资思维和职业思维是相通的。技能XP+15，心智+9。", "success");
            }
          },
        },
        {
          text: "🤷 投资归投资，职业归职业",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invCareerBoostSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得投资和职业应该分开。心智+3。", "info");
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
