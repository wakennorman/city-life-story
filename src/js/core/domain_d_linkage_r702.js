/**
 * 域D(NPC/社交) 联动增强 R702
 * 桥接：
 *   D→A  d702_social_market_network  社交市场网络 → 消费 state.relationships+state.trade 数据,
 *     社交→"人脉即商路"数据回响
 *   D→E  d702_friend_invest_network  朋友投资网络 → 消费 state.relationships+state.investment 数据,
 *     社交→"朋友的投资情报"经济回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR702Loaded) return;
  RANDOM_EVENTS._domainDLinkageR702Loaded = true;

  function metNpcs(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) { if (rels[k] && rels[k].met) out.push(k); }
    return out;
  }

  var EVENTS = [
    {
      id: "d702_social_market_network", phase: "street", _isChainEvent: false, icon: "🔗",
      title: "人脉即商路",
      story: "你的朋友网络正在为你打开新的市场通路——{desc}",
      triggers: { minDay: 90, interval: 180, maxRepeats: 2, excludeFlags: ["_d702MarketCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d702MarketCooldown) return false;
        return metNpcs(st).length >= 3 && st.trade;
      },
      choices: [
        { text: "🤝 拓展商路", hint: "销售XP+6,现金+1500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d702MarketCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1500;
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '人脉就是商路。' 销售XP+6,现金+¥1500。", "success");
        }},
        { text: "🗺️ 了解市场", hint: "会计XP+4,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d702MarketCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🗺️ '了解市场,才能把握商机。' 会计XP+4,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你的朋友网络正在为你打开新的市场通路——'人脉即商路,朋友即市场。'";
      }
    },
    {
      id: "d702_friend_invest_network", phase: "street", _isChainEvent: false, icon: "💼",
      title: "朋友的投资情报",
      story: "朋友们带来了各种投资消息——{desc}",
      triggers: { minDay: 120, interval: 200, maxRepeats: 2, excludeFlags: ["_d702InvestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d702InvestCooldown) return false;
        return metNpcs(st).length >= 2 && st.investment;
      },
      choices: [
        { text: "📈 研究一下", hint: "会计XP+5,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d702InvestCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '朋友的消息,值得研究。' 会计XP+5,智力+3。", "success");
        }},
        { text: "💡 小试牛刀", hint: "现金+2000,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d702InvestCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '小试牛刀,验证想法。' 现金+¥2000,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友们带来了各种投资消息——'朋友的投资情报,比任何报告都靠谱。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
