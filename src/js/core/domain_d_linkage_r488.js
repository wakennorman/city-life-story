/**
 * 域D(NPC/社交) 联动增强 R488（第二十七轮循环）
 * 桥接：
 *   D→F  d488_social_map_ui       社交图谱UI → 消费 relationships 数据,
 *     关系→"你的社交圈长什么样"的UI展示
 *   D→D  d488_npc_influence_web    NPC影响网 → 消费 relationships 数据,
 *     影响→"谁影响了你"的社交演化
 *   d488_npc_gift(D→A NPC礼物): relationships→"送什么礼物"的数据洞察
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR488Loaded) return;
  RANDOM_EVENTS._domainDLinkageR488Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "d488_social_map_ui", phase: "street", _isChainEvent: false, icon: "🗺️",
      title: "社交图谱",
      story: "你查看了自己的社交图谱——{desc}",
      triggers: { minDay: 45, interval: 70, maxRepeats: 4, excludeFlags: ["_d488MapUiCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var count = 0;
        for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) count++; }
        return count >= 4 && (st.flags && !st.flags._d488MapUiCooldown);
      },
      choices: [
        { text: "📊 分析结构", hint: "智力+2,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d488MapUiCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了社交图谱结构——'结构决定功能。' 智力+2,会计XP+2。", "success");
        }},
        { text: "💝 维护弱关系", hint: "好感+3(最低者),心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d488MapUiCooldown = true;
          var lowest = null, lowestAff = 999;
          for (var k in st.relationships) {
            if (st.relationships[k] && st.relationships[k].met) {
              var aff = st.relationships[k].affinity || 0;
              if (aff < lowestAff) { lowestAff = aff; lowest = k; }
            }
          }
          bumpAffinity(st, lowest, 3, "维护弱关系");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 你维护了最弱的关系——'弱关系是潜在的资源。' 好感+3,心情+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var count = 0, totalAff = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met) { count++; totalAff += st.relationships[k].affinity || 0; }
        }
        var avg = count > 0 ? Math.round(totalAff / count) : 0;
        return "你查看了自己的社交图谱——" + count + "个熟人，平均好感" + avg + "。你的社交圈长什么样？";
      }
    },
    {
      id: "d488_npc_influence_web", phase: "street", _isChainEvent: false, icon: "🕸️",
      title: "影响之网",
      story: "你发现某些NPC对你的影响很大——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 3, excludeFlags: ["_d488InfluenceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var hasHigh = false;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 60) { hasHigh = true; break; }
        }
        return hasHigh && (st.flags && !st.flags._d488InfluenceCooldown);
      },
      choices: [
        { text: "📖 分析影响", hint: "智力+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d488InfluenceCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你分析了谁对你影响最大——'近朱者赤。' 智力+3,心智+2。", "success");
        }},
        { text: "🎯 主动接近", hint: "好感+5(最高者)", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d488InfluenceCooldown = true;
          var highest = null, highestAff = -1;
          for (var k in st.relationships) {
            if (st.relationships[k] && st.relationships[k].met) {
              var aff = st.relationships[k].affinity || 0;
              if (aff > highestAff) { highestAff = aff; highest = k; }
            }
          }
          bumpAffinity(st, highest, 5, "主动接近");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你决定主动接近——'与优秀的人为伍。' 好感+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现某些NPC对你的影响很大——他们改变了你的想法，影响了你的决策。谁在你的人生中留下了深刻的印记？";
      }
    },
    {
      id: "d488_npc_gift", phase: "street", _isChainEvent: false, icon: "🎁",
      title: "送什么好",
      story: "你思考着给朋友送什么礼物——{desc}",
      triggers: { minDay: 50, interval: 80, maxRepeats: 4, excludeFlags: ["_d488GiftCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return !!firstMetNpc(st) && (st.flags && !st.flags._d488GiftCooldown);
      },
      choices: [
        { text: "🎁 投其所好", hint: "好感+8,现金-100", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d488GiftCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 8, "投其所好");
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 100);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎁 你送了投其所好的礼物——'礼轻情意重。' 好感+8,现金-100。", "success");
        }},
        { text: "💝 用心就好", hint: "好感+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d488GiftCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 4, "用心送礼");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 你送了用心的礼物——'心意比价格重要。' 好感+4,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你思考着给朋友送什么礼物——礼物不是价格，是心意。你决定送什么？";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();
