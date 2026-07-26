/**
 * 域D(NPC/社交) 联动增强 R308
 * 第七轮循环——社交积累的多维回响。
 * 桥接：
 *   D→E  npc_investment_intel_v2      NPC→投资情报（经济·社交信息变现）
 *   D→B  npc_life_narrative_v2         NPC→人生叙事（事件/叙事·人物深度）
 *   D→H  npc_company_advisor_v2        NPC→公司顾问（公司·社交资本变现）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR308Loaded) return;
  RANDOM_EVENTS._domainDLinkageR308Loaded = true;

  function countHighNpcsD308(st, minAff) {
    minAff = minAff || 50;
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= minAff) count++;
    }
    return count;
  }

  var EVENTS = [
    {
      id: "npc_investment_intel_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "NPC的投资情报",
      story: "一个在金融圈工作的老朋友找到你，分享了一些「内部消息」。\n\n「这个消息还没公开，你可以提前布局。」\n\n你开始理解，社交网络不仅是情感支持，也是「信息渠道」。高好感的NPC会主动分享有价值的信息。",
      triggers: { minDay: 250, excludeFlags: ["_npcInvIntelV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships || !st.investment) return false;
        return countHighNpcsD308(st, 60) >= 1;
      },
      choices: [
        {
          text: "💡 根据情报调整投资策略",
          hint: "心智+8，置投资情报flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcInvIntelV2Seen = true;
            st.flags._npcInvestmentIntelV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💡 你根据NPC情报调整了投资策略。社交网络是信息渠道。心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 消息不可靠，不理会",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcInvIntelV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得消息不可靠。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "npc_life_narrative_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "NPC的人生叙事",
      story: "你和某个NPC的关系越来越深，开始了解TA的完整故事——TA的梦想、TA的遗憾、TA的秘密。\n\n你发现，每个NPC都有自己的弧线，不只是你人生的配角。他们是自己故事的主角。\n\n你开始理解，深度社交不仅是「认识人」，也是「看见彼此」。",
      triggers: { minDay: 300, excludeFlags: ["_npcLifeNarrV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD308(st, 70) >= 1;
      },
      choices: [
        {
          text: "📖 认真倾听TA的故事",
          hint: "NPC好感+10，心智+9",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcLifeNarrV2Seen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 70) {
                  applyAffinityChange(st, id, 10, "深度倾听");
                  break;
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你认真倾听了TA的故事。深度社交是看见彼此。好感+10，心智+9。", "success");
            }
          },
        },
        {
          text: "👋 保持适当的距离",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcLifeNarrV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👋 你选择保持适当的距离。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "npc_company_advisor_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "NPC成为公司顾问",
      story: "一个在相关行业有丰富经验的老朋友找到你，愿意成为公司的「顾问」。\n\n「我经验丰富，可以帮你少走弯路。不用给钱，就当帮朋友。」\n\n你开始理解，高好感的NPC不仅是朋友，也是事业上的「贵人」。",
      triggers: { minDay: 350, excludeFlags: ["_npcCompanyAdvisorV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company || !st.relationships) return false;
        return countHighNpcsD308(st, 75) >= 1;
      },
      choices: [
        {
          text: "🏢 接受NPC的顾问邀请",
          hint: "公司声誉+8，NPC好感+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcCompanyAdvisorV2Seen = true;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 8;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 75) {
                  applyAffinityChange(st, id, 8, "顾问邀请");
                  break;
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏢 你接受了NPC的顾问邀请。高好感NPC是事业上的贵人。声誉+8，好感+8。", "success");
            }
          },
        },
        {
          text: "🤷 公司不需要外部顾问",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcCompanyAdvisorV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得公司不需要外部顾问。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
