/**
 * 域D(NPC/社交) 联动增强 R405
 * 第十七轮循环——把隐藏在NPC关系矩阵/礼物偏好/社交行为中的数据转化为叙事体验。
 * 桥接：
 *   D→C  d405_npc_career_magnet      NPC职业推荐 → 消费 relationships+employment 数据,
 *     高好感NPC→"TA推荐了一个好工作"的职业推荐叙事
 *   D→B  d405_shared_memory          共同记忆 → 消费 _eventHistory+relationships,
 *     与NPC共同经历的事件→"我们的故事"叙事回响
 *   D→E  d405_npc_trade_intel         NPC交易情报v2 → 消费 relationships+trade 数据,
 *     高好感NPC→"TA透漏了一个商机"的投资情报
 *
 * 严格照 domain_d_linkage_r395.js / r382.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR405Loaded) return;
  RANDOM_EVENTS._domainDLinkageR405Loaded = true;

  // 取首个高好感NPC
  function firstHighAffNpcR405(st, minAff) {
    minAff = minAff || 40;
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) return id;
    }
    return null;
  }

  // 安全好感变更
  function bumpAffinityR405(st, npcId, delta) {
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, delta); } catch(e) { /* safe */ }
    }
  }

  // 安全NPC中文名
  function npcNameR405(st, npcId) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(npcId) || npcId; } catch(e) { /* safe */ }
    }
    return npcId;
  }

  var EVENTS = [
    {
      // D→C: NPC职业推荐 — 消费 relationships+employment
      id: "d405_npc_career_magnet",
      phase: "street",
      _isChainEvent: false,
      icon: "💼",
      title: "熟人推荐的好工作",
      story:
        "{npcName}跟你说：「我听说{jobHint}在招人,你{skillMatch}条件,要不要去试试?」",
      triggers: { minDay: 55, excludeFlags: ["_d405CareerMagCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return firstHighAffNpcR405(st, 40) !== null;
      },
      choices: [
        {
          text: "🙏 谢谢推荐,我去看看",
          hint: "好感+4,置 _d405CareerMagCooldown(75天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d405CareerMagCooldown = true;
            var npc = firstHighAffNpcR405(st, 40);
            if (npc) bumpAffinityR405(st, npc, 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💼 熟人推荐了一个工作机会——人脉就是资源。好感+4。", "success");
          }
        },
        {
          text: "😊 心领了,暂时不需要",
          hint: "好感+1",
          apply: function (st) {
            var npc = firstHighAffNpcR405(st, 40);
            if (npc) bumpAffinityR405(st, npc, 1);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var npc = firstHighAffNpcR405(st, 40);
        if (!npc) return null;
        var npcN = npcNameR405(st, npc);
        // 根据玩家技能推荐工作类型
        var hint = "商业区的一家店铺";
        if (st.skills) {
          var top = null, topLv = 0;
          for (var k in st.skills) {
            if (st.skills[k] && (st.skills[k].level || 0) > topLv) {
              topLv = st.skills[k].level || 0; top = k;
            }
          }
          if (top === "coding") hint = "科技园的一家互联网公司";
          else if (top === "cooking") hint = "商业区的一家餐厅";
          else if (top === "sales") hint = "商业区的一家门店";
          else if (top === "repair") hint = "城中村的一家维修店";
        }
        return npcN + "跟你说:「我听说" + hint + "在招人,你有手艺,要不要去试试?」";
      }
    },
    {
      // D→B: 共同记忆 — 消费 _eventHistory+relationships
      id: "d405_shared_memory",
      phase: "street",
      _isChainEvent: false,
      icon: "📸",
      title: "我们的故事",
      story:
        "你和{npcName}一起回忆起曾经的经历——{memoryText}\n\n共同经历,是关系最好的纽带。",
      triggers: { minDay: 65, excludeFlags: ["_d405MemoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return firstHighAffNpcR405(st, 30) !== null;
      },
      choices: [
        {
          text: "😊 感恩这些共同经历",
          hint: "好感+3,心情+4,置 _d405MemoryCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d405MemoryCooldown = true;
            var npc = firstHighAffNpcR405(st, 30);
            if (npc) bumpAffinityR405(st, npc, 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📸 你们一起回顾共同经历——回忆是关系的纽带。好感+3,心情+4。", "success");
          }
        },
        {
          text: "💪 向前看,未来更精彩",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var npc = firstHighAffNpcR405(st, 30);
        if (!npc) return null;
        var npcN = npcNameR405(st, npc);
        var mem = "那些一起度过的日子,让彼此更加了解";
        if (st.flags && st.flags._eventHistory && st.flags._eventHistory.length > 5) {
          mem = "经历了这么多事,你们已经不再是普通朋友";
        }
        return "你和" + npcN + "一起回忆起曾经的经历——" + mem + "。\n\n共同经历,是关系最好的纽带。";
      }
    },
    {
      // D→E: NPC交易情报v2 — 消费 relationships+trade
      id: "d405_npc_trade_intel",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "商机情报",
      story:
        "{npcName}悄悄告诉你——{tradeIntel}\n\n消息就是财富,朋友就是情报网。",
      triggers: { minDay: 75, excludeFlags: ["_d405TradeIntelCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return firstHighAffNpcR405(st, 50) !== null;
      },
      choices: [
        {
          text: "📝 记下这个情报",
          hint: "好感+3,accounting XP+3,置 _d405TradeIntelCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d405TradeIntelCooldown = true;
            var npc = firstHighAffNpcR405(st, 50);
            if (npc) bumpAffinityR405(st, npc, 3);
            if (typeof addSkillXp === "function") {
              try { addSkillXp("accounting", 3); } catch(e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💡 你记下了朋友提供的商机情报——信息就是财富。好感+3,会计XP+3。", "success");
          }
        },
        {
          text: "😅 投资风险太大,算了",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var npc = firstHighAffNpcR405(st, 50);
        if (!npc) return null;
        var npcN = npcNameR405(st, npc);
        var intel = "最近市场上有些商品在涨价,提前囤货能赚一笔";
        if (st.trade && st.trade.marketEvents && st.trade.marketEvents.length > 0) {
          var evt = st.trade.marketEvents[0];
          intel = "「" + (evt.name || "市场异动") + "」正在影响价格,关注相关商品能获利";
        }
        return npcN + "悄悄告诉你——" + intel + "。\n\n消息就是财富,朋友就是情报网。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
