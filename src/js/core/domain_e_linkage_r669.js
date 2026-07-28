/**
 * 域E(经济/投资) 联动增强 R669
 * 桥接：
 *   E→B  e653_investment_life_chapter  投资人生章节 → 消费 state.investment+state.player 数据,
 *     经济→"投资即人生"叙事回响
 *   E→D  e653_investor_friendship_v2  投资者友谊v2 → 消费 state.investment+state.relationships 数据,
 *     经济→"志同道合"社交回响
 *   E→G  e653_wealth_wellbeing_v2  财富幸福v2 → 消费 state.resources+state.needs 数据,
 *     经济→"钱与幸福"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR669Loaded) return;
  RANDOM_EVENTS._domainELinkageR669Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR669(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "e653_investment_life_chapter", phase: "street", _isChainEvent: false, icon: "📖",
      title: "投资即人生",
      story: "回望投资历程,你发现每一笔交易都是一次人生选择——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 1, excludeFlags: ["_e653ChapterDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e653ChapterDone) return false;
        return st.investment && (st.investment.stockHoldings || st.investment.btcHoldings);
      },
      choices: [
        { text: "📝 写投资笔记", hint: "会计XP+6,智力+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e653ChapterDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📝 '投资是一场修行。' 你写下了投资笔记。会计XP+6,智力+4。", "success");
        }},
        { text: "🎯 调整策略", hint: "管理XP+5,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e653ChapterDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '策略要随市场进化。' 你调整了投资策略。管理XP+5,心智+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var stocks = (st.investment && st.investment.stockHoldings) ? st.investment.stockHoldings.length : 0;
        return "回望投资历程——持有" + stocks + "只股票,每一笔交易都是一次人生选择。'投资即人生,盈亏自渡。'";
      }
    },
    {
      id: "e653_investor_friendship_v2", phase: "street", _isChainEvent: false, icon: "👥",
      title: "志同道合",
      story: "你发现身边有朋友也在投资理财——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 2, excludeFlags: ["_e653FriendCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e653FriendCooldown) return false;
        var met = metNpcsR669(st);
        return met.length >= 2;
      },
      choices: [
        { text: "💬 交流心得", hint: "好感+5,会计XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e653FriendCooldown = true;
          var met = metNpcsR669(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "投资交流"); } catch(e) {}
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💬 '三人行必有我师。' 你和朋友交流了投资心得。好感+5,会计XP+4。", "success");
        }},
        { text: "🤫 低调赚钱", hint: "心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e653FriendCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 '财不外露。' 你选择低调。心智+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR669(st);
        return "你发现身边有朋友也在投资理财——'" + (met.length > 0 ? met[0].name : "朋友") + "也在炒股?这下有共同话题了。'";
      }
    },
    {
      id: "e653_wealth_wellbeing_v2", phase: "street", _isChainEvent: false, icon: "❤️",
      title: "钱与幸福",
      story: "你开始思考:赚那么多钱,到底是为了什么?——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_e653WellDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e653WellDone) return false;
        var happiness = (st.needs && st.needs.happiness) || 50;
        var cash = (st.resources && st.resources.cash) || 0;
        return happiness < 35 && cash >= 15000;
      },
      choices: [
        { text: "🏥 花钱买健康", hint: "现金-4000,健康+18,心情+7", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e653WellDone = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 4000);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 7);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏥 '身体是1,其他是0。' 你花钱做了全面体检。现金-¥4000,健康+18,心情+7。", "success");
        }},
        { text: "😌 调整心态", hint: "心智+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e653WellDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 '幸福是一种能力。' 你选择调整心态。心智+6。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var happiness = (st.needs && st.needs.happiness) || 50;
        return "你开始思考:赚那么多钱,到底是为了什么?——心情" + Math.round(happiness) + "%,'钱买不来幸福,但没有钱更难幸福。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
