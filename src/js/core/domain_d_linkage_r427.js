/**
 * 域D(NPC/社交) 联动增强 R427
 * 桥接：
 *   D→A  d427_social_capital_v3       社交资本v3 → 消费 relationships→资本量化
 *   D→G  d427_npc_milestone            NPC里程碑 → 消费 relationships+age→人生节点
 *   D→E  d427_friend_invest_v2         朋友投资v2 → 消费 relationships+investment
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR427Loaded) return;
  RANDOM_EVENTS._domainDLinkageR427Loaded = true;
  function grantXp(key, amt) { if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} } }
  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  var EVENTS = [
    {
      id: "d427_social_capital_v3", phase: "street", _isChainEvent: false, icon: "💰",
      title: "社交资本",
      story: "你量化了自己的社交资本——{desc}",
      triggers: { minDay: 60, excludeFlags: ["_d427CapCooldown"] },
      conditions: function (st) { return !st.gameOver && st.relationships; },
      choices: [
        { text: "📊 社交就是财富", hint: "心智+4,accounting XP+3", apply: function (st) {
          if (!st) return; st.flags._d427CapCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          grantXp("accounting", 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 你量化了社交资本——人脉是最有价值的无形资产。心智+4,会计XP+3。", "success");
        }},
        { text: "😊 朋友不是财富", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        var met = 0, total = 0;
        if (st.relationships) { for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) { met++; total += (st.relationships[id].affinity || 0); } } }
        return "你量化了自己的社交资本——已结识" + met + "位NPC,累计好感度" + total + "点。";
      }
    },
    {
      id: "d427_npc_milestone", phase: "street", _isChainEvent: false, icon: "🎂",
      title: "与NPC的共同回忆",
      story: "你和一位朋友共同经历了许多——{desc}",
      triggers: { minDay: 75, excludeFlags: ["_d427MilestoneCooldown"] },
      conditions: function (st) { return !st.gameOver && firstMetNpc(st) !== null; },
      choices: [
        { text: "💕 感恩这段友谊", hint: "心情+5,心智+3", apply: function (st) {
          if (!st) return; st.flags._d427MilestoneCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎂 你感恩与朋友的共同回忆——友谊是人生最珍贵的礼物。心情+5,心智+3。", "success");
        }},
        { text: "💪 继续前行", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        return "你和一位朋友共同经历了许多——那些一起度过的日子,成为了珍贵的回忆。";
      }
    },
    {
      id: "d427_friend_invest_v2", phase: "street", _isChainEvent: false, icon: "💡",
      title: "朋友的投资建议",
      story: "朋友给了你投资建议——{desc}",
      triggers: { minDay: 85, excludeFlags: ["_d427InvestCooldown"] },
      conditions: function (st) { return !st.gameOver && st.investment && firstMetNpc(st) !== null; },
      choices: [
        { text: "📝 认真听取", hint: "accounting XP+4,心智+3", apply: function (st) {
          if (!st) return; st.flags._d427InvestCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          grantXp("accounting", 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 你听取朋友的投资建议——多元视角降低决策风险。会计XP+4,心智+3。", "success");
        }},
        { text: "🤷 投资靠自己", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) { return "朋友给了你投资建议——来自不同行业的视角,能帮你发现盲点。"; }
    }
  ];
  for (var i = 0; i < EVENTS.length; i++) { if (!RANDOM_EVENTS.find(function (ev) { return ev.id === EVENTS[i].id; })) RANDOM_EVENTS.push(EVENTS[i]); }
})();
