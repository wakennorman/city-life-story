/**
 * 域D(NPC/社交) 联动增强 R253
 * 社交积累的多维回响——好感不仅是数值，还在公司/叙事/自我认知层面留下痕迹。
 * 桥接：
 *   D→H  npc_business_referral   已结识NPC好感达标→介绍生意给公司（跨阶段桥接）
 *   D→G  npc_social_support      心情低落时多个已结识NPC主动关怀（社交支持网络）
 *   D→D  npc_relationship_web    NPC间关系因玩家而改变（蝴蝶效应·关系网演化）
 *
 * 严格照 domain_d_linkage_r194.js 已验证 IIFE 注入范式：
 *   显式 phase、RANDOM_EVENTS 守卫、triggers 用引擎白名单字段、
 *   conditions 全字段防御、gameOver 闸门、apply 内自理副作用。
 * 真实字段核实：
 *   NPC 好感走 applyAffinityChange 守 rel.met（域D铁律）；
 *   公司 st.startup.company；心情 st.needs.happiness；心智 st.player.mental；
 *   现金 st.resources.cash；NPC_RELATION_MATRIX（npc_relationships.js）；
 *   标志 _npcBusinessReferralSeen / _npcSocialSupportSeen / _npcRelationshipWebSeen（去重）。
 *   数值标 [PLACEHOLDER] 待平衡组校准。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR253Loaded) return;
  RANDOM_EVENTS._domainDLinkageR253Loaded = true;

  // 取好感达标的已结识NPC列表
  function getHighAffinityNpcsD253(st, minAff) {
    minAff = minAff || 40;
    if (!st || !st.relationships) return [];
    var out = [];
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) out.push({ id: id, aff: r.affinity || 0 });
    }
    out.sort(function (a, b) { return b.aff - a.aff; });
    return out;
  }

  // 安全改好感：走 applyAffinityChange（自动 clamp + 记 _lastInteractionDay）
  function safeAffinityD253(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "R253域D联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId]) st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity = Math.max(-100, Math.min(100, (st.relationships[npcId].affinity || 0) + change));
    st.relationships[npcId].met = true;
  }

  var EVENTS = [
    {
      // D→H: 已结识NPC好感达标→介绍生意给公司（跨阶段桥接）
      id: "npc_business_referral",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🤝",
      title: "老关系介绍生意",
      story:
        "你正在公司加班，一个老朋友打来电话。他从共同认识的人那里听说了你的公司，正好他手上有个活想找靠谱的人做。\n\n「我信得过你，这单你先试试？做得好以后还有。」\n\n这是你第一次因为「认识人」而拿到生意。原来那些年攒下的人脉，不只是喝酒吹牛的资本。",
      triggers: { minDay: 120, excludeFlags: ["_npcBusinessReferralSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要有公司
        if (!st.startup || !st.startup.company) return false;
        // 至少一个好感≥60的已结识NPC
        var highNpcs = getHighAffinityNpcsD253(st, 60);
        return highNpcs.length >= 1;
      },
      choices: [
        {
          text: "🎯 接下这单，好好干",
          hint: "公司声誉+5，现金+2000",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcBusinessReferralSeen = true;
            if (st.startup && st.startup.company) {
              st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
            }
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + 2000;
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎯 你接下了老关系介绍的生意。公司声誉+5，现金+2000。", "success");
            }
          },
        },
        {
          text: "📋 先评估一下再接",
          hint: "心智+3，现金+500",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcBusinessReferralSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + 500;
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你先做了个简单评估再决定。谨慎不是坏事。心智+3，现金+500。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
    {
      // D→G: 心情低落时多个已结识NPC主动关怀（社交支持网络）
      id: "npc_social_support",
      phase: "street",
      _isChainEvent: false,
      icon: "💝",
      title: "有人惦记你",
      story:
        "你最近心情不太好，但你知道——这座城市里有人惦记你。\n\n早上出门时，邻居给你塞了个馒头。中午吃饭时，老朋友发来一条消息：「最近怎么样？」下班路上，一个许久没联系的熟人递了根烟，什么都没问，就是陪你站了一会儿。\n\n你不知道该怎么解释这种感受。但你知道，自己不是一个人在扛。",
      triggers: { minDay: 30, excludeFlags: ["_npcSocialSupportSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.needs) return false;
        // 心情低于30时才触发
        if ((st.needs.happiness || 50) > 30) return false;
        // 至少2个已结识NPC（有社交支持网络）
        var metNpcs = getHighAffinityNpcsD253(st, 0);
        return metNpcs.length >= 2;
      },
      choices: [
        {
          text: "😢 被惦记的感觉真好",
          hint: "心情+12，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcSocialSupportSeen = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💝 被惦记的感觉真好。你不是一个人在扛。心情+12，心智+5。", "success");
            }
          },
        },
        {
          text: "💪 谢谢，但我能自己扛",
          hint: "心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcSocialSupportSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💪 你谢绝了他们的好意，选择自己扛。独立，是一种力量。心智+8。", "info");
            }
          },
        },
      ],
      probability: 0.7,
      repeatable: false,
    },
    {
      // D→D: NPC间关系因玩家而改变（蝴蝶效应·关系网演化）
      id: "npc_relationship_web",
      phase: "street",
      _isChainEvent: false,
      icon: "🕸️",
      title: "关系网在变化",
      story:
        "你发现一件有趣的事——你认识的这些人之间，关系似乎在悄悄变化。\n\n有些人因为你的缘故走近了，有些人因为你的选择疏远了。你就像一张网的节点，你的每一个动作都牵动着整张网的张力。\n\n这就是人情江湖——你不是在经营一段段孤立的关系，你是在编织一张网。",
      triggers: { minDay: 180, excludeFlags: ["_npcRelationshipWebSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 至少3个已结识NPC（有足够的关系网）
        var metNpcs = getHighAffinityNpcsD253(st, 0);
        if (metNpcs.length < 3) return false;
        // 至少一对NPC之间有关系条目（有NPC-NPC关系）
        if (typeof NPC_RELATION_MATRIX === "undefined") return false;
        var hasRelation = false;
        for (var i = 0; i < metNpcs.length; i++) {
          for (var j = 0; j < metNpcs.length; j++) {
            if (i === j) continue;
            var row = NPC_RELATION_MATRIX[metNpcs[i].id];
            if (row && row[metNpcs[j].id]) {
              hasRelation = true;
              break;
            }
          }
          if (hasRelation) break;
        }
        return hasRelation;
      },
      choices: [
        {
          text: "🕸️ 顺势而为，让网更紧密",
          hint: "所有已结识NPC好感+2，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcRelationshipWebSeen = true;
            var metNpcs = getHighAffinityNpcsD253(st, 0);
            for (var i = 0; i < metNpcs.length; i++) {
              safeAffinityD253(st, metNpcs[i].id, 2, "关系网编织");
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🕸️ 你开始有意识地编织这张关系网。所有已结识NPC好感+2，心智+5。", "success");
            }
          },
        },
        {
          text: "🙈 顺其自然，不刻意经营",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcRelationshipWebSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🙈 你觉得关系不能强求，顺其自然就好。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.35,
      repeatable: false,
    },
  ];

  // 注入全局事件池
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
