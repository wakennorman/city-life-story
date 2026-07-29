/**
 * 域D(NPC/社交) 联动增强 R844 (第十七轮循环)
 * 桥接：
 *   D→B  d844_npc_chat NPC闲谈 → 消费 NPC关系+事件
 *   D→G  d844_social_boost 社交提振 → 消费 社交数据+needs
 *   D→A  d844_social_asset 社交资产 → 消费 社交关系+经济
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR844Loaded) return;
  RANDOM_EVENTS._domainDLinkageR844Loaded = true;

  var EVENTS = [
    {
      id: "d844_npc_chat", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "NPC闲谈", story: "你认识的人,都有自己的故事——倾听,是最好的社交。",
      triggers: { minDay: 70, interval: 130, maxRepeats: 3, excludeFlags: ["_d844ChatCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._d844ChatCd) return false; return st.player && st.player.day >= 70 && st.relationships; },
      text: function (st) { if (!st) return null; var r = st.relationships ? Object.keys(st.relationships).length : 0; return "你已结识" + r + "位朋友——'倾听,是最好的社交。'"; },
      choices: [
        { text: "💬 倾听", hint: "社交XP+25,魅力+15,置_d844Listener",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d844ChatCd = true; st.flags._d844Listener = true; if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 15); if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("💬 '倾听是最好的社交。' 社交XP+25,魅力+15。", "success"); } }
        },
        { text: "📖 记录", hint: "心智+20,置_d844Scribe",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d844ChatCd = true; st.flags._d844Scribe = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '每个人都是一本书。' 心智+20。", "info"); } }
        }
      ]
    },
    {
      id: "d844_social_boost", phase: "street", _isChainEvent: false, icon: "💚",
      title: "社交提振", story: "良好的社交关系,是健康生活的重要组成部分。",
      triggers: { minDay: 130, interval: 180, maxRepeats: 4, excludeFlags: ["_d844BoostCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._d844BoostCd) return false; return st.player && st.player.day >= 130 && st.relationships && st.needs; },
      text: function (st) { if (!st) return null; var r = st.relationships ? Object.keys(st.relationships).length : 0; var h = st.needs && isFinite(st.needs.happiness) ? Math.round(st.needs.happiness) : 50; return "你已结识" + r + "位朋友,心情" + h + "——'朋友是最好的良药。'"; },
      choices: [
        { text: "🤝 主动", hint: "心情+25,社交XP+20,置_d844Socializer",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d844BoostCd = true; st.flags._d844Socializer = true; if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25); if (typeof addSkillXp === "function") { try { addSkillXp("social", 20); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("🤝 '主动社交让生活更精彩。' 心情+25,社交XP+20。", "success"); } }
        },
        { text: "🧘 独处", hint: "心智+20,疲劳-15,置_d844Recharge",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d844BoostCd = true; st.flags._d844Recharge = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20); if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15); if (typeof StateManager !== "undefined") { StateManager.addMessage("🧘 '独处是为了更好地相处。' 心智+20,疲劳-15。", "info"); } }
        }
      ]
    },
    {
      id: "d844_social_asset", phase: "street", _isChainEvent: false, icon: "🏦",
      title: "社交资产", story: "人脉就是财富——你的社交圈,正在变成你的经济资本。",
      triggers: { minDay: 200, interval: 250, maxRepeats: 3, excludeFlags: ["_d844AssetCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._d844AssetCd) return false; return st.player && st.player.day >= 200 && st.relationships && st.resources; },
      text: function (st) { if (!st) return null; var r = st.relationships ? Object.keys(st.relationships).length : 0; var c = st.resources && isFinite(st.resources.cash) ? Math.round(st.resources.cash) : 0; return r + "位朋友,存款¥" + c.toLocaleString() + "——'人脉就是财富。'"; },
      choices: [
        { text: "📈 扩展", hint: "社交XP+30,魅力+20,置_d844Networker",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d844AssetCd = true; st.flags._d844Networker = true; if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 20); if (typeof addSkillXp === "function") { try { addSkillXp("social", 30); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📈 '人脉是最大的财富。' 社交XP+30,魅力+20。", "success"); } }
        },
        { text: "💡 利用", hint: "智力+20,管理XP+15,置_d844Connector",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._d844AssetCd = true; st.flags._d844Connector = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20); if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("💡 '人脉不是名片夹而是关系网。' 智力+20,管理XP+15。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();