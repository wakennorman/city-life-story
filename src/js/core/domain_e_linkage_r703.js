/**
 * 域E(经济/投资) 联动增强 R703
 * 桥接：
 *   E→A  e703_invest_data_network   投资数据网络 → 消费 state.investment+state.trade 数据,
 *     经济→"投资数据编织市场网络"数据回响
 *   E→D  e703_wealth_social_ripple  财富社交涟漪 → 消费 state.resources+state.relationships 数据,
 *     经济→"财富的社交涟漪"社交回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR703Loaded) return;
  RANDOM_EVENTS._domainELinkageR703Loaded = true;

  var EVENTS = [
    {
      id: "e703_invest_data_network", phase: "street", _isChainEvent: false, icon: "🔗",
      title: "投资数据编织市场网络",
      story: "你的投资数据正在编织一张市场网络——{desc}",
      triggers: { minDay: 130, interval: 200, maxRepeats: 2, excludeFlags: ["_e703DataNetCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e703DataNetCooldown) return false;
        return st.investment && (st.investment.stockHoldings || st.investment.btcHoldings);
      },
      choices: [
        { text: "📊 分析数据网络", hint: "会计XP+6,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e703DataNetCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据编织成网,网络就是市场。' 会计XP+6,智力+3。", "success");
        }},
        { text: "🎯 发现机会", hint: "销售XP+4,现金+1500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e703DataNetCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1500;
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '数据中发现机会,机会创造价值。' 销售XP+4,现金+¥1500。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你的投资数据正在编织一张市场网络——'投资数据编织市场网络,洞察先机。'";
      }
    },
    {
      id: "e703_wealth_social_ripple", phase: "street", _isChainEvent: false, icon: "🌊",
      title: "财富的社交涟漪",
      story: "你的财富变化正在影响你的社交圈——{desc}",
      triggers: { minDay: 100, interval: 180, maxRepeats: 2, excludeFlags: ["_e703RippleCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e703RippleCooldown) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        return cash >= 30000;
      },
      choices: [
        { text: "💫 分享财富", hint: "全NPC好感+3,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e703RippleCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          var rels = st.relationships || {};
          for (var k in rels) {
            if (rels[k] && rels[k].met && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, k, 3, "财富分享"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💫 '分享财富,快乐加倍。' 全NPC好感+3,心情+5。", "success");
        }},
        { text: "🤫 低调行事", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e703RippleCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 '财不外露,低调是智慧。' 心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        return "你的财富变化正在影响你的社交圈——'现金¥" + Math.round(cash).toLocaleString() + ",财富的社交涟漪正在扩散。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
