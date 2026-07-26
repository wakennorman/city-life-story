/**
 * 域B(事件/叙事) 联动增强 R388
 * 第十六轮循环——事件叙事的经济与社交回响。
 * 桥接：
 *   B→E  event_investment_nudge      事件→投资觉醒(经济·新闻驱动投资意识)
 *   B→D  event_npc_story_echo       事件→NPC故事回响(社交·共同经历深化关系)
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR388Loaded) return;
  RANDOM_EVENTS._domainBLinkageR388Loaded = true;

  // 安全改好感
  function safeAffinity(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "R388域B联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId]) st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity = (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 获取第一个好感达阈值的NPC ID
  function firstHighAffNpc(st, minAff) {
    minAff = minAff || 30;
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (Object.prototype.hasOwnProperty.call(st.relationships, id)) {
        var r = st.relationships[id];
        if (r && r.met && (r.affinity || 0) >= minAff) return id;
      }
    }
    return null;
  }

  var EVENTS = [
    {
      // B→E: 新闻驱动投资意识（事件叙事→经济投资）
      id: "event_investment_nudge",
      phase: "street",
      _isChainEvent: false,
      icon: "📰",
      title: "新闻里的投资机会",
      story: "你刷到一条新闻——某行业政策利好,相关股票连续上涨。\n\n你想起之前一个朋友也提过类似的信息。「早知道当时就买了。」你有点后悔。\n\n但你也明白:新闻不是投资依据,情绪驱动的决策往往是陷阱。真正的投资机会,来自于对行业的深度理解,而不是头条的喧嚣。",
      triggers: { minDay: 90, excludeFlags: ["_eventInvestNudgeSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要有一些现金储备(有投资能力)
        var cash = (st.resources && st.resources.cash) || 0;
        if (cash < 3000) return false;
        return true;
      },
      choices: [
        {
          text: "📰 理性分析,不追涨",
          hint: "心智+8,智力+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventInvestNudgeSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📰 你选择理性分析,不被新闻情绪裹挟。心智+8,智力+3。", "success");
            }
          },
        },
        {
          text: "💰 小仓位跟着试试",
          hint: "心情+5,置_dataInvestorMindset投资意识",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventInvestNudgeSeen = true;
            st.flags._dataInvestorMindset = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你决定小仓位试试,体验市场波动。心情+5,投资意识觉醒。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
    {
      // B→D: 共同经历深化关系（事件叙事→NPC社交）
      id: "event_npc_story_echo",
      phase: "street",
      _isChainEvent: false,
      icon: "🗣️",
      title: "一起经历过的事",
      story: "你在街上遇到一个熟人,聊起之前一起经历的那场大雨——那天你们一起在屋檐下躲雨,聊了很久。\n\n「还记得吗?」对方笑着说。\n\n你点点头。有些关系,不是靠送礼或者频繁联系维持的,而是靠共同经历的那些瞬间。一场雨、一次帮忙、一个笑点——这些记忆让关系有了温度。",
      triggers: { minDay: 60, excludeFlags: ["_eventNpcStoryEchoSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要至少1个好感≥40的NPC(有共同经历的基础)
        var npc = firstHighAffNpc(st, 40);
        if (!npc) return false;
        return true;
      },
      choices: [
        {
          text: "🗣️ 聊聊那次经历,加深感情",
          hint: "NPC好感+6,心情+5,心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventNpcStoryEchoSeen = true;
            var npc = firstHighAffNpc(st, 40);
            if (npc) safeAffinity(st, npc, 6, "共同经历");
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🗣️ 你们聊起一起经历的事,关系更近了一步。好感+6,心情+5,心智+4。", "success");
            }
          },
        },
        {
          text: "😊 笑笑点头,不必多言",
          hint: "心情+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventNpcStoryEchoSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("😊 你笑笑点头,有些默契不必多言。心情+4。", "info");
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
