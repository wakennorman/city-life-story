/**
 * 域D(NPC/社交) 联动增强 R822 (第十四轮循环)
 * 桥接：
 *   D→B  d822_npc_story_net NPC故事网 → 消费 NPC关系+事件
 *   D→G  d822_social_health_v10 社交健康v10 → 消费 社交数据+needs
 *   D→A  d822_social_worth_v9 社交价值v9 → 消费 社交关系+经济
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR822Loaded) return;
  RANDOM_EVENTS._domainDLinkageR822Loaded = true;

  var EVENTS = [
    {
      id: "d822_npc_story_net", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "NPC故事网",
      story: "你认识的人,都有自己的故事——倾听,是最好的社交。",
      triggers: { minDay: 120, interval: 200, maxRepeats: 3, excludeFlags: ["_d822StoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d822StoryCd) return false;
        return st.player && st.player.day >= 120 && st.relationships;
      },
      text: function (st) {
        if (!st) return null;
        var rels = st.relationships ? Object.keys(st.relationships).length : 0;
        return "你已结识" + rels + "位朋友——'倾听,是最好的社交。'";
      },
      choices: [
        {
          text: "💬 倾听朋友故事", hint: "社交XP+25,魅力+15,置_d822Listener",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d822StoryCd = true;
            st.flags._d822Listener = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💬 '倾听,是最好的社交。' 社交XP+25,魅力+15。", "success");
            }
          }
        },
        {
          text: "📖 记录故事", hint: "心智+20,置_d822Scribe",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d822StoryCd = true;
            st.flags._d822Scribe = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '每个人都是一本书。' 心智+20。", "info");
            }
          }
        }
      ]
    },
    {
      id: "d822_social_health_v10", phase: "street", _isChainEvent: false, icon: "💚",
      title: "社交健康",
      story: "良好的社交关系,是健康生活的重要组成部分——朋友,是最好的良药。",
      triggers: { minDay: 200, interval: 250, maxRepeats: 4, excludeFlags: ["_d822HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d822HealthCd) return false;
        return st.player && st.player.day >= 200 && st.relationships && st.needs;
      },
      text: function (st) {
        if (!st) return null;
        var rels = st.relationships ? Object.keys(st.relationships).length : 0;
        var happiness = st.needs && isFinite(st.needs.happiness) ? Math.round(st.needs.happiness) : 50;
        return "你已结识" + rels + "位朋友,心情" + happiness + "——'朋友,是最好的良药。'";
      },
      choices: [
        {
          text: "🤝 主动社交", hint: "心情+25,社交XP+20,置_d822Socializer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d822HealthCd = true;
            st.flags._d822Socializer = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '主动社交,让生活更精彩。' 心情+25,社交XP+20。", "success");
            }
          }
        },
        {
          text: "🧘 独处充电", hint: "心智+20,疲劳-15,置_d822Recharge",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d822HealthCd = true;
            st.flags._d822Recharge = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '独处,是为了更好地相处。' 心智+20,疲劳-15。", "info");
            }
          }
        }
      ]
    },
    {
      id: "d822_social_worth_v9", phase: "street", _isChainEvent: false, icon: "🏦",
      title: "社交价值",
      story: "人脉就是财富——你的社交圈,正在变成你的经济资本。",
      triggers: { minDay: 300, interval: 350, maxRepeats: 3, excludeFlags: ["_d822WorthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d822WorthCd) return false;
        return st.player && st.player.day >= 300 && st.relationships && st.resources;
      },
      text: function (st) {
        if (!st) return null;
        var rels = st.relationships ? Object.keys(st.relationships).length : 0;
        var cash = st.resources && isFinite(st.resources.cash) ? Math.round(st.resources.cash) : 0;
        return rels + "位朋友,存款¥" + cash.toLocaleString() + "——'人脉,就是财富。'";
      },
      choices: [
        {
          text: "📈 扩展社交圈", hint: "社交XP+30,魅力+20,置_d822Networker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d822WorthCd = true;
            st.flags._d822Networker = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 20);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 30); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '人脉,是最大的财富。' 社交XP+30,魅力+20。", "success");
            }
          }
        },
        {
          text: "💡 利用人脉资源", hint: "智力+20,管理XP+15,置_d822Connector",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d822WorthCd = true;
            st.flags._d822Connector = true;
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