/**
 * 域D(NPC/社交) 联动增强 R621
 * 桥接：
 *   D→A  d621_social_market_intel  社交市场情报 → 消费 state.relationships 数据,
 *     社交→"朋友口中的市场情报"的数值回响
 *   D→F  d621_friend_suggestion_ui  好友推荐UI → 消费 state.relationships 数据,
 *     社交→"社交关系可视化推荐"的UI回响
 *   D→H  d621_npc_business_intro  NPC生意介绍 → 消费 state.relationships+state.startup 数据,
 *     社交→"朋友介绍生意"的公司回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR621Loaded) return;
  RANDOM_EVENTS._domainDLinkageR621Loaded = true;

  function metNpcsR621(st, minAff) {
    var out = [];
    var rels = st.relationships || {};
    minAff = minAff || 0;
    for (var k in rels) {
      if (rels[k] && rels[k].met && (rels[k].affinity || 0) >= minAff) {
        out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
      }
    }
    return out;
  }

  var EVENTS = [
    // ====== D→A: 社交市场情报 ======
    {
      id: "d621_social_market_intel", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "市井消息",
      story: "你在和朋友的闲聊中得到了一个有用的信息——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 10, excludeFlags: ["_d621MarketIntelCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d621MarketIntelCooldown) return false;
        return metNpcsR621(st, 30).length >= 1;
      },
      choices: [
        { text: "💡 记下这个信息", hint: "智力+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d621MarketIntelCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🗣️ '听说XX东西要涨价了,赶紧囤点。' 你默默记下了这个信息。智力+3,心智+2。", "success");
        }},
        { text: "🔄 分享另一个消息", hint: "好感+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d621MarketIntelCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          var met = metNpcsR621(st, 30);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "信息交换"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🗣️ '你知道吗,我也有个消息...' 你们交换了各自的情报,关系更近了。好感+5,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR621(st, 30);
        var name = met.length > 0 ? met[0].name : "朋友";
        return name + "神秘地说:'我刚得到一个内部消息,XX市场要变天了。' 你竖起耳朵,生怕漏掉一个字。";
      }
    },

    // ====== D→F: 好友推荐UI ======
    {
      id: "d621_friend_suggestion_ui", phase: "street", _isChainEvent: false, icon: "👥",
      title: "好友推荐",
      story: "一个朋友想介绍TA的朋友给你认识——{desc}",
      triggers: { minDay: 25, interval: 90, maxRepeats: 5, excludeFlags: ["_d621FriendSuggestionCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d621FriendSuggestionCooldown) return false;
        return metNpcsR621(st, 50).length >= 1;
      },
      choices: [
        { text: "🤝 认识新朋友", hint: "结识新NPC,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d621FriendSuggestionCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.flags) st.flags._newFriendIntroduced = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 '这是我朋友XX,做XX行业的,你们一定聊得来!' 你认识了一个新朋友。心情+5。", "success");
        }},
        { text: "💬 先加个微信", hint: "心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d621FriendSuggestionCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 你加了对方的微信。'保持联系,以后有机会合作。' 心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR621(st, 50);
        var name = met.length > 0 ? met[0].name : "朋友";
        return name + "说:'我有个朋友,跟你挺像的,介绍你们认识?' 你犹豫了一下,多个朋友多条路。";
      }
    },

    // ====== D→H: NPC生意介绍 ======
    {
      id: "d621_npc_business_intro", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "生意介绍",
      story: "一个朋友给你介绍了一单生意——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 4, excludeFlags: ["_d621BusinessIntroCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d621BusinessIntroCooldown) return false;
        if (!st.startup || !st.startup.company) return false;
        return metNpcsR621(st, 60).length >= 1;
      },
      choices: [
        { text: "💼 接下这单", hint: "收益¥5000-15000,公司声誉+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d621BusinessIntroCooldown = true;
          var earn = 5000 + Random.int(0, 10000);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + earn;
          if (st.startup && st.startup.company) {
            st.startup.company.reputation = Math.min(100, (st.startup.company.reputation || 50) + 10);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '这单生意够你吃半年了!' 朋友介绍的大客户,让你赚了¥" + earn.toLocaleString() + "。公司声誉+10。", "success");
        }},
        { text: "🤔 先考察一下", hint: "心智+3,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d621BusinessIntroCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '小心驶得万年船。' 你决定先考察一下对方的背景。心智+3,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR621(st, 60);
        var name = met.length > 0 ? met[0].name : "朋友";
        return name + "打来电话:'我这边有个大客户,正好需要你们公司的服务,要不要接?' 这可能是公司的一个转折点。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();