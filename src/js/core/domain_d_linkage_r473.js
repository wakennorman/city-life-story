/**
 * 域D(NPC/社交) 联动增强 R473（第二十五轮循环）
 * 桥接：
 *   D→F  d465_social_portfolio    社交资产UI → 消费 relationships 数据,
 *     人脉→"你的社交资本有多少"的UI洞察
 *   D→C  d465_npc_career_mentor_v2 NPC职业导师v2 → 消费 relationships+skills 数据,
 *     贵人→"前辈指路"的职业成长
 *   d465_npc_gossip_web(D→D NPC八卦网): relationships→"朋友的朋友"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR473Loaded) return;
  RANDOM_EVENTS._domainDLinkageR473Loaded = true;

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
      id: "d473_social_portfolio", phase: "street", _isChainEvent: false, icon: "💎",
      title: "社交资本",
      story: "你盘点了一下自己的人脉——{desc}",
      triggers: { minDay: 40, interval: 70, maxRepeats: 4, excludeFlags: ["_d473PortfolioCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var count = 0;
        for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) count++; }
        return count >= 4 && (st.flags && !st.flags._d473PortfolioCooldown);
      },
      choices: [
        { text: "📊 量化社交资本", hint: "智力+2,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d473PortfolioCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你量化了自己的社交资本——'人脉就是钱脉。' 智力+2,会计XP+2。", "success");
        }},
        { text: "💝 投资关系", hint: "好感+3(随机2人),现金-200", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d473PortfolioCooldown = true;
          var npcs = [];
          for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) npcs.push(k); }
          if (npcs.length > 0) {
            var picks = npcs.length >= 2 ? 2 : 1;
            for (var i = 0; i < picks; i++) {
              var idx = typeof Random !== "undefined" ? Random.int(0, npcs.length - 1) : 0;
              bumpAffinity(st, npcs[idx], 3, "投资关系");
            }
          }
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 你决定投资关系——'关系需要经营。' 好感+3,现金-200。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var count = 0, totalAff = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met) { count++; totalAff += st.relationships[k].affinity || 0; }
        }
        var avg = count > 0 ? Math.round(totalAff / count) : 0;
        return "你盘点了一下自己的人脉——" + count + "个熟人，平均好感" + avg + "。你的社交资本值多少钱？";
      }
    },
    {
      id: "d473_npc_career_mentor_v2", phase: "street", _isChainEvent: false, icon: "👨‍🏫",
      title: "前辈指路",
      story: "一位经验丰富的前辈给了你职业建议——{desc}",
      triggers: { minDay: 50, interval: 90, maxRepeats: 3, excludeFlags: ["_d473MentorCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var hasHigh = false;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 50) { hasHigh = true; break; }
        }
        return hasHigh && (st.flags && !st.flags._d473MentorCooldown);
      },
      choices: [
        { text: "🎯 听从建议", hint: "最高技能XP+6,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d473MentorCooldown = true;
          var best = null, bestLv = -1;
          for (var k in st.skills) { var lv = st.skills[k] && st.skills[k].level ? st.skills[k].level : 0; if (lv > bestLv) { bestLv = lv; best = k; } }
          if (best && typeof addSkillXp === "function") { try { addSkillXp(best, 6); } catch(e) {} }
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 3, "前辈指路");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你听从了前辈的建议——'听君一席话，胜读十年书。' 最高技能XP+6,好感+3。", "success");
        }},
        { text: "🤔 独立思考", hint: "智力+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d473MentorCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤔 你决定独立思考——'别人的建议只是参考。' 智力+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一位经验丰富的前辈给了你职业建议——'我走过的弯路，你不用再走。'你开始思考：该怎么对待这些过来人的经验？";
      }
    },
    {
      id: "d473_npc_gossip_web", phase: "street", _isChainEvent: false, icon: "🕸️",
      title: "关系网",
      story: "你发现朋友之间也互相认识——{desc}",
      triggers: { minDay: 70, interval: 100, maxRepeats: 3, excludeFlags: ["_d473GossipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var count = 0;
        for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) count++; }
        return count >= 5 && (st.flags && !st.flags._d473GossipCooldown);
      },
      choices: [
        { text: "🔗 牵线搭桥", hint: "好感+5(双方),心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d473GossipCooldown = true;
          var npcs = [];
          for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) npcs.push(k); }
          if (npcs.length >= 2) {
            bumpAffinity(st, npcs[0], 5, "牵线搭桥");
            bumpAffinity(st, npcs[1], 5, "牵线搭桥");
          }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔗 你帮两个朋友牵了线——'朋友的朋友也是朋友。' 好感+5,心情+3。", "success");
        }},
        { text: "🤫 保守秘密", hint: "心智+3,道德+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d473GossipCooldown = true;
          if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 3); st.player.morality = Math.min(100, (st.player.morality || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 你选择保守秘密——'嘴严是信任的基础。' 心智+3,道德+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var count = 0;
        for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) count++; }
        return "你发现" + count + "个朋友之间也互相认识——社交圈原来是一张网，牵一发而动全身。";
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
