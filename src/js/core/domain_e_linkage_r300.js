/**
 * 域E(经济/投资) 联动增强 R300
 * 第六轮循环——投资积累的多维回响。
 * 桥接：
 *   E→C  investment_skill_transfer    投资→技能迁移（职业/成长·知识复用）
 *   E→D  investment_npc_network      投资→NPC网络（NPC/社交·投资社交）
 *   E→B  investment_life_milestone   投资→人生里程碑（事件/叙事·财富故事）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR300Loaded) return;
  RANDOM_EVENTS._domainELinkageR300Loaded = true;

  function calcTotalInvValueE300(st) {
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
      id: "investment_skill_transfer",
      phase: "street",
      _isChainEvent: false,
      icon: "🔄",
      title: "投资经验迁移技能",
      story: "你发现，投资中学到的经验开始迁移到其他技能领域。\n\n「分散风险」让你在学习新技能时不把所有时间押在一个方向，「长期主义」让你愿意花时间深耕一个领域，「止损」让你及时放弃不适合自己的技能。\n\n你开始理解，投资思维是一种通用的「决策框架」。",
      triggers: { minDay: 250, excludeFlags: ["_invSkillTransferSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.skills) return false;
        return calcTotalInvValueE300(st) >= 30000;
      },
      choices: [
        {
          text: "🔄 把投资思维应用到技能学习",
          hint: "最高技能XP+15，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invSkillTransferSeen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔄 你把投资思维应用到技能学习。投资思维是通用的决策框架。技能XP+15，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 投资归投资，学习归学习",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invSkillTransferSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得投资和学习应该分开。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "investment_npc_network",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "投资圈的社交网络",
      story: "你开始认识一些同样关注投资的朋友——有的是股市老手，有的是房产专家，有的是创业导师。\n\n你们分享投资经验、交流市场看法、互相推荐机会。你发现，投资不仅是金钱游戏，也是社交游戏。\n\n「信息不对称」是最大的竞争优势，而社交网络是信息的来源。",
      triggers: { minDay: 300, excludeFlags: ["_invNpcNetworkSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.relationships) return false;
        return calcTotalInvValueE300(st) >= 50000;
      },
      choices: [
        {
          text: "🤝 主动拓展投资圈人脉",
          hint: "已结识NPC好感+4，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invNpcNetworkSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met) {
                  applyAffinityChange(st, id, 4, "投资圈交流");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你主动拓展投资圈人脉。社交网络是信息的来源。好感+4，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 投资是个人行为，不需要社交",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invNpcNetworkSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得投资是个人行为。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
    {
      id: "investment_life_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "🏆",
      title: "投资人生里程碑",
      story: "你的投资组合总值达到了一个新的里程碑——也许是¥500,000，也许是¥1,000,000。\n\n这个数字，一年前的你想都不敢想。你决定把这个时刻记录下来——不是作为炫耀，而是作为对未来的自己在低谷时的鼓励。\n\n「投资不仅是赚钱，也是人生修行。」",
      triggers: { minDay: 365, excludeFlags: ["_invLifeMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        return calcTotalInvValueE300(st) >= 500000;
      },
      choices: [
        {
          text: "🏆 记录这个投资里程碑",
          hint: "心情+15，心智+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeMilestoneSeen = true;
            st.flags._investmentMilestone500k = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏆 你记录了投资里程碑。投资是人生修行。心情+15，心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续投资",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._invLifeMilestoneSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+4。", "info");
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
