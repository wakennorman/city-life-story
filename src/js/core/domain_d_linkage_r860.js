/**
 * 域D(NPC/社交) 联动增强 R860 (第十九轮循环)
 * 桥接：
 *   D→B  d860_npc_talk NPC交谈 → 消费 NPC关系+事件
 *   D→G  d860_social_shine 社交光彩 → 消费 社交数据+needs
 *   D→A  d860_social_credit 社交信用 → 消费 社交关系+经济
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR860Loaded) return;
  RANDOM_EVENTS._domainDLinkageR860Loaded = true;

  var EVENTS = [
    {
      id: "d860_npc_talk", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "NPC交谈", story: "你认识的人,都有自己的故事——倾听,是最好的社交。",
      triggers: { minDay: 50, interval: 100, maxRepeats: 3, excludeFlags: ["_d860TalkCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._d860TalkCd) return false; return st.player && st.player.day >= 50 && st.relationships; },
      text: function (st) { if (!st) return null; var r = st.relationships ? Object.keys(st.relationships).length : 0; return "你已结识" + r + "位朋友。"; },
      choices: [
        { text: "💬 倾听", hint: "社交XP+25,魅力+15,置_d860Listener", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d860TalkCd = true; st.flags._d860Listener = true; if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 15); if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("💬 '倾听是最好的社交。' 社交XP+25,魅力+15。", "success"); } } },
        { text: "📖 记录", hint: "心智+20,置_d860Scribe", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d860TalkCd = true; st.flags._d860Scribe = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '每个人都是一本书。' 心智+20。", "info"); } } }
      ]
    },
    {
      id: "d860_social_shine", phase: "street", _isChainEvent: false, icon: "💚",
      title: "社交光彩", story: "良好的社交关系,是健康生活的重要组成部分。",
      triggers: { minDay: 100, interval: 140, maxRepeats: 4, excludeFlags: ["_d860ShineCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._d860ShineCd) return false; return st.player && st.player.day >= 100 && st.relationships && st.needs; },
      text: function (st) { if (!st) return null; var r = st.relationships ? Object.keys(st.relationships).length : 0; var h = st.needs && isFinite(st.needs.happiness) ? Math.round(st.needs.happiness) : 50; return "你已结识" + r + "位朋友,心情" + h + "。"; },
      choices: [
        { text: "🤝 主动", hint: "心情+25,社交XP+20,置_d860Socializer", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d860ShineCd = true; st.flags._d860Socializer = true; if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25); if (typeof addSkillXp === "function") { try { addSkillXp("social", 20); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("🤝 '主动社交让生活更精彩。' 心情+25,社交XP+20。", "success"); } } },
        { text: "🧘 独处", hint: "心智+20,疲劳-15,置_d860Recharge", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d860ShineCd = true; st.flags._d860Recharge = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20); if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15); if (typeof StateManager !== "undefined") { StateManager.addMessage("🧘 '独处是为了更好地相处。' 心智+20,疲劳-15。", "info"); } } }
      ]
    },
    {
      id: "d860_social_credit", phase: "street", _isChainEvent: false, icon: "🏦",
      title: "社交信用", story: "人脉就是财富——你的社交圈,正在变成你的经济资本。",
      triggers: { minDay: 160, interval: 200, maxRepeats: 3, excludeFlags: ["_d860CreditCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._d860CreditCd) return false; return st.player && st.player.day >= 160 && st.relationships && st.resources; },
      text: function (st) { if (!st) return null; var r = st.relationships ? Object.keys(st.relationships).length : 0; var c = st.resources && isFinite(st.resources.cash) ? Math.round(st.resources.cash) : 0; return r + "位朋友,存款¥" + c.toLocaleString() + "。"; },
      choices: [
        { text: "📈 扩展", hint: "社交XP+30,魅力+20,置_d860Networker", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d860CreditCd = true; st.flags._d860Networker = true; if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 20); if (typeof addSkillXp === "function") { try { addSkillXp("social", 30); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📈 '人脉是最大的财富。' 社交XP+30,魅力+20。", "success"); } } },
        { text: "💡 利用", hint: "智力+20,管理XP+15,置_d860Connector", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d860CreditCd = true; st.flags._d860Connector = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20); if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("💡 '人脉不是名片夹而是关系网。' 智力+20,管理XP+15。", "info"); } } }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();