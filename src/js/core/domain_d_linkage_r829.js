/**
 * 域D(NPC/社交) 联动增强 R829 (第十五轮循环)
 * 桥接：
 *   D→B  d829_npc_tale NPC故事 → 消费 NPC关系+事件
 *   D→G  d829_social_health_v11 社交健康v11 → 消费 社交数据+needs
 *   D→A  d829_social_value_v10 社交价值v10 → 消费 社交关系+经济
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR829Loaded) return;
  RANDOM_EVENTS._domainDLinkageR829Loaded = true;

  var EVENTS = [
    {
      id: "d829_npc_tale", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "NPC故事", story: "你认识的人,都有自己的故事——倾听,是最好的社交。",
      triggers: { minDay: 100, interval: 180, maxRepeats: 3, excludeFlags: ["_d829StoryCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._d829StoryCd) return false; return st.player && st.player.day >= 100 && st.relationships; },
      text: function (st) { if (!st) return null; var r = st.relationships ? Object.keys(st.relationships).length : 0; return "你已结识" + r + "位朋友——'倾听,是最好的社交。'"; },
      choices: [
        { text: "💬 倾听故事", hint: "社交XP+25,魅力+15,置_d829Listener",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d829StoryCd = true; st.flags._d829Listener = true; if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 15); if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("💬 '倾听是最好的社交。' 社交XP+25,魅力+15。", "success"); } }
        },
        { text: "📖 记录故事", hint: "心智+20,置_d829Scribe",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d829StoryCd = true; st.flags._d829Scribe = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '每个人都是一本书。' 心智+20。", "info"); } }
        }
      ]
    },
    {
      id: "d829_social_health_v11", phase: "street", _isChainEvent: false, icon: "💚",
      title: "社交健康", story: "良好的社交关系,是健康生活的重要组成部分。",
      triggers: { minDay: 180, interval: 220, maxRepeats: 4, excludeFlags: ["_d829HealthCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._d829HealthCd) return false; return st.player && st.player.day >= 180 && st.relationships && st.needs; },
      text: function (st) { if (!st) return null; var r = st.relationships ? Object.keys(st.relationships).length : 0; var h = st.needs && isFinite(st.needs.happiness) ? Math.round(st.needs.happiness) : 50; return "你已结识" + r + "位朋友,心情" + h + "——'朋友是最好的良药。'"; },
      choices: [
        { text: "🤝 主动社交", hint: "心情+25,社交XP+20,置_d829Socializer",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d829HealthCd = true; st.flags._d829Socializer = true; if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25); if (typeof addSkillXp === "function") { try { addSkillXp("social", 20); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("🤝 '主动社交让生活更精彩。' 心情+25,社交XP+20。", "success"); } }
        },
        { text: "🧘 独处充电", hint: "心智+20,疲劳-15,置_d829Recharge",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d829HealthCd = true; st.flags._d829Recharge = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20); if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15); if (typeof StateManager !== "undefined") { StateManager.addMessage("🧘 '独处是为了更好地相处。' 心智+20,疲劳-15。", "info"); } }
        }
      ]
    },
    {
      id: "d829_social_value_v10", phase: "street", _isChainEvent: false, icon: "🏦",
      title: "社交价值", story: "人脉就是财富——你的社交圈,正在变成你的经济资本。",
      triggers: { minDay: 250, interval: 300, maxRepeats: 3, excludeFlags: ["_d829ValueCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._d829ValueCd) return false; return st.player && st.player.day >= 250 && st.relationships && st.resources; },
      text: function (st) { if (!st) return null; var r = st.relationships ? Object.keys(st.relationships).length : 0; var c = st.resources && isFinite(st.resources.cash) ? Math.round(st.resources.cash) : 0; return r + "位朋友,存款¥" + c.toLocaleString() + "——'人脉就是财富。'"; },
      choices: [
        { text: "📈 扩展社交圈", hint: "社交XP+30,魅力+20,置_d829Networker",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d829ValueCd = true; st.flags._d829Networker = true; if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 20); if (typeof addSkillXp === "function") { try { addSkillXp("social", 30); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📈 '人脉是最大的财富。' 社交XP+30,魅力+20。", "success"); } }
        },
        { text: "💡 利用人脉", hint: "智力+20,管理XP+15,置_d829Connector",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d829ValueCd = true; st.flags._d829Connector = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20); if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("💡 '人脉不是名片夹而是关系网。' 智力+20,管理XP+15。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();