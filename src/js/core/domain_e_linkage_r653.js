/**
 * 域E(经济/投资) 联动增强 R653
 * 桥接：
 *   E→B  e647_investment_story  投资故事 → 消费 state.investment+state.player 数据,
 *     经济→"投资即人生"叙事回响
 *   E→D  e647_investor_friendship  投资者友谊 → 消费 state.investment+state.relationships 数据,
 *     经济→"志同道合"社交回响
 *   E→G  e647_financial_stress  财务压力 → 消费 state.resources+state.needs 数据,
 *     经济→"钱不是万能的"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR653Loaded) return;
  RANDOM_EVENTS._domainELinkageR653Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR653(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "e647_investment_story", phase: "street", _isChainEvent: false, icon: "📖",
      title: "投资即人生",
      story: "回望投资历程,你发现每一笔交易都是一次人生选择——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_e647StoryDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e647StoryDone) return false;
        return st.investment && (st.investment.stockHoldings || st.investment.btcHoldings);
      },
      choices: [
        { text: "📝 写投资笔记", hint: "会计XP+5,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e647StoryDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📝 '投资是一场修行。' 你写下了投资笔记。会计XP+5,智力+3。", "success");
        }},
        { text: "🎯 调整策略", hint: "管理XP+4,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e647StoryDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '策略要随市场进化。' 你调整了投资策略。管理XP+4,心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var stocks = (st.investment && st.investment.stockHoldings) ? st.investment.stockHoldings.length : 0;
        return "回望投资历程——持有" + stocks + "只股票,每一笔交易都是一次人生选择。'投资即人生,盈亏自渡。'";
      }
    },
    {
      id: "e647_investor_friendship", phase: "street", _isChainEvent: false, icon: "👥",
      title: "志同道合",
      story: "你发现身边有朋友也在投资理财——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_e647FriendCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e647FriendCooldown) return false;
        var met = metNpcsR653(st);
        return met.length >= 2;
      },
      choices: [
        { text: "💬 交流心得", hint: "好感+4,会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e647FriendCooldown = true;
          var met = metNpcsR653(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 4, "投资交流"); } catch(e) {}
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💬 '三人行必有我师。' 你和朋友交流了投资心得。好感+4,会计XP+3。", "success");
        }},
        { text: "🤫 低调赚钱", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e647FriendCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 '财不外露。' 你选择低调。心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR653(st);
        return "你发现身边有朋友也在投资理财——'" + (met.length > 0 ? met[0].name : "朋友") + "也在炒股?这下有共同话题了。'";
      }
    },
    {
      id: "e647_financial_stress", phase: "street", _isChainEvent: false, icon: "😰",
      title: "钱不是万能的",
      story: "你开始感受到财务压力对生活的负面影响——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 1, excludeFlags: ["_e647StressDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e647StressDone) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        var debt = (st.resources && st.resources.debt) || 0;
        return cash < 1000 && debt > 5000;
      },
      choices: [
        { text: "🏦 借钱周转", hint: "现金+2000,债务+2000,心情-3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e647StressDone = true;
          if (st.resources) {
            st.resources.cash = (st.resources.cash || 0) + 2000;
            st.resources.debt = (st.resources.debt || 0) + 2000;
          }
          if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏦 '借钱周转,渡过难关。' 你借了钱。现金+¥2000,债务+¥2000,心情-3。", "warning");
        }},
        { text: "💪 咬牙硬扛", hint: "心智+5,心情-5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e647StressDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '咬牙硬扛,总会过去的。' 你选择硬扛。心智+5,心情-5。", "warning");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        var debt = (st.resources && st.resources.debt) || 0;
        return "你开始感受到财务压力——现金¥" + cash + ",债务¥" + debt + "。'钱不是万能的,但没有钱是万万不能的。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
