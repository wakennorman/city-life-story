/**
 * 域A(数据/数值平衡) 联动增强 R682
 * 桥接：
 *   A→B  a682_price_narrative_v2  价格叙事v2 → 消费 state.trade.goodsPrices 数据,
 *     数据→"价格波动背后的人间故事"叙事回响
 *   A→D  a682_npc_price_insight     NPC价格洞察 → 消费 state.relationships+state.trade 数据,
 *     数据→"NPC眼中的价格秘密"社交回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR682Loaded) return;
  RANDOM_EVENTS._domainALinkageR682Loaded = true;

  var EVENTS = [
    {
      id: "a682_price_narrative_v2", phase: "street", _isChainEvent: false, icon: "📈",
      title: "价格波动背后的人间故事",
      story: "每一个商品价格的波动,都藏着这座城市的故事——{desc}",
      triggers: { minDay: 80, interval: 150, maxRepeats: 3, excludeFlags: ["_a682PriceNarrativeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a682PriceNarrativeCooldown) return false;
        return st.trade && st.trade.goodsPrices;
      },
      choices: [
        { text: "📖 了解市场故事", hint: "智力+4,社交XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a682PriceNarrativeCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '每个价格都有故事。' 你了解了市场背后的故事。智力+4,社交XP+3。", "success");
        }},
        { text: "📊 分析价格趋势", hint: "会计XP+5,管理XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a682PriceNarrativeCooldown = true;
          if (typeof addSkillXp === "function") {
            try { addSkillXp("accounting", 5); } catch(e) {}
            try { addSkillXp("management", 2); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '价格趋势里有大智慧。' 你分析了价格走势。会计XP+5,管理XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "每一个商品价格的波动,都藏着这座城市的故事——'价格背后,是这座城市的人间烟火。'";
      }
    },
    {
      id: "a682_npc_price_insight", phase: "street", _isChainEvent: false, icon: "💬",
      title: "NPC眼中的价格秘密",
      story: "你从朋友那里听到了关于价格的秘密——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_a682NpcPriceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a682NpcPriceCooldown) return false;
        var rels = st.relationships || {};
        var metCount = 0;
        for (var k in rels) { if (rels[k] && rels[k].met) metCount++; }
        return metCount >= 2 && st.trade;
      },
      choices: [
        { text: "💡 采纳建议", hint: "销售XP+5,现金+800", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a682NpcPriceCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 800;
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '朋友的建议,就是最好的商机。' 你采纳了朋友的价格建议。销售XP+5,现金+¥800。", "success");
        }},
        { text: "🤝 分享信息", hint: "好感+4,社交XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a682NpcPriceCooldown = true;
          var rels = st.relationships || {};
          var firstMet = null;
          for (var k2 in rels) { if (rels[k2] && rels[k2].met) { firstMet = k2; break; } }
          if (firstMet && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, firstMet, 4, "分享价格信息"); } catch(e) {}
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '信息越分享越有价值。' 你和朋友分享了价格信息。好感+4,社交XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你从朋友那里听到了关于价格的秘密——'这座城市的价格秘密,都藏在朋友的话里。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();