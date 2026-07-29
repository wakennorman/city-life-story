/**
 * 域D(NPC/社交) 联动增强 R814 (第十三轮循环)
 * 桥接：
 *   D→B  d814_npc_story_echo NPC故事回声 → 消费 NPC关系+事件
 *   D→G  d814_social_health_v9 社交健康v9 → 消费 社交数据+needs
 *   D→A  d814_social_capital_v8 社交资本v8 → 消费 社交关系+经济
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR814Loaded) return;
  RANDOM_EVENTS._domainDLinkageR814Loaded = true;

  var EVENTS = [
    // ====== D→B NPC故事回声 ======
    {
      id: "d814_npc_story_echo", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "NPC故事回声",
      story: "你认识的人,都有自己的故事——倾听,是最好的社交。",
      triggers: { minDay: 150, interval: 250, maxRepeats: 3, excludeFlags: ["_d814StoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d814StoryCd) return false;
        return st.player && st.player.day >= 150 && st.relationships;
      },
      text: function (st) {
        if (!st) return null;
        var rels = st.relationships ? Object.keys(st.relationships).length : 0;
        return "你已结识" + rels + "位朋友——'倾听,是最好的社交。'";
      },
      choices: [
        {
          text: "💬 倾听朋友故事", hint: "社交XP+25,魅力+15,置_d814Listener",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d814StoryCd = true;
            st.flags._d814Listener = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💬 '倾听,是最好的社交。' 社交XP+25,魅力+15。", "success");
            }
          }
        },
        {
          text: "📖 记录故事", hint: "心智+20,置_d814Scribe",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d814StoryCd = true;
            st.flags._d814Scribe = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '每个人都是一本书。' 心智+20。", "info");
            }
          }
        }
      ]
    },

    // ====== D→G 社交健康v9 ======
    {
      id: "d814_social_health_v9", phase: "street", _isChainEvent: false, icon: "💚",
      title: "社交健康",
      story: "良好的社交关系,是健康生活的重要组成部分——朋友,是最好的良药。",
      triggers: { minDay: 250, interval: 300, maxRepeats: 4, excludeFlags: ["_d814HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d814HealthCd) return false;
        return st.player && st.player.day >= 250 && st.relationships && st.needs;
      },
      text: function (st) {
        if (!st) return null;
        var rels = st.relationships ? Object.keys(st.relationships).length : 0;
        var happiness = st.needs && isFinite(st.needs.happiness) ? Math.round(st.needs.happiness) : 50;
        return "你已结识" + rels + "位朋友,心情" + happiness + "——'朋友,是最好的良药。'";
      },
      choices: [
        {
          text: "🤝 主动社交", hint: "心情+25,社交XP+20,置_d814Socializer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d814HealthCd = true;
            st.flags._d814Socializer = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '主动社交,让生活更精彩。' 心情+25,社交XP+20。", "success");
            }
          }
        },
        {
          text: "🧘 独处充电", hint: "心智+20,疲劳-15,置_d814Recharge",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d814HealthCd = true;
            st.flags._d814Recharge = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '独处,是为了更好地相处。' 心智+20,疲劳-15。", "info");
            }
          }
        }
      ]
    },

    // ====== D→A 社交资本v8 ======
    {
      id: "d814_social_capital_v8", phase: "street", _isChainEvent: false, icon: "🏦",
      title: "社交资本",
      story: "人脉就是财富——你的社交圈,正在变成你的经济资本。",
      triggers: { minDay: 350, interval: 400, maxRepeats: 3, excludeFlags: ["_d814CapitalCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d814CapitalCd) return false;
        return st.player && st.player.day >= 350 && st.relationships && st.resources;
      },
      text: function (st) {
        if (!st) return null;
        var rels = st.relationships ? Object.keys(st.relationships).length : 0;
        var cash = st.resources && isFinite(st.resources.cash) ? Math.round(st.resources.cash) : 0;
        return rels + "位朋友,存款¥" + cash.toLocaleString() + "——'人脉,就是财富。'";
      },
      choices: [
        {
          text: "📈 扩展社交圈", hint: "社交XP+30,魅力+20,置_d814Networker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d814CapitalCd = true;
            st.flags._d814Networker = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 20);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 30); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '人脉,是最大的财富。' 社交XP+30,魅力+20。", "success");
            }
          }
        },
        {
          text: "💡 利用人脉资源", hint: "智力+20,管理XP+15,置_d814Connector",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d814CapitalCd = true;
            st.flags._d814Connector = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 '人脉不是名片夹,而是关系网。' 智力+20,管理XP+15。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();