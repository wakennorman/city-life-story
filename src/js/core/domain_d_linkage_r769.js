/**
 * 域D(NPC/社交) 联动增强 R769 (第九轮循环)
 * 桥接：
 *   D→B  d769_npc_event_story_v6 NPC事件故事v6 → 消费 事件+NPC关系
 *   D→G  d769_social_wellness_v7 社交健康v7 → 消费 社交数据+needs
 *   D→A  d769_social_capital_v7 社交资本v7 → 消费 NPC关系+pricing
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR769Loaded) return;
  RANDOM_EVENTS._domainDLinkageR769Loaded = true;

  var EVENTS = [
    {
      id: "d769_npc_event_story_v6", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "NPC事件故事",
      story: "你和NPC共同经历的事件,正在产生回响——{desc}",
      triggers: { minDay: 800, interval: 900, maxRepeats: 3, excludeFlags: ["_d769EchoCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d769EchoCd) return false;
        return st.player && st.player.day >= 800 && st.relationships;
      },
      choices: [
        {
          text: "📖 分享故事", hint: "社交XP+20,置_d769StorySharer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d769EchoCd = true;
            st.flags._d769StorySharer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗣️ '故事,让关系更有温度。' 社交XP+20。", "success");
            }
          }
        },
        {
          text: "🤝 深化友谊", hint: "心智+18,置_d769DeepFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d769EchoCd = true;
            st.flags._d769DeepFriend = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '友谊,需要用心经营。' 心智+18。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "你和NPC之间的故事,正在加深你们的友谊——'共同经历,是最好的纽带。'";
      }
    },
    {
      id: "d769_social_wellness_v7", phase: "street", _isChainEvent: false, icon: "💚",
      title: "社交健康",
      story: "良好的社交关系让身心更健康——{desc}",
      triggers: { minDay: 600, interval: 700, maxRepeats: 4, excludeFlags: ["_d769HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d769HealthCd) return false;
        return st.player && st.player.day >= 600 && st.needs && st.status && st.relationships;
      },
      choices: [
        {
          text: "😊 感恩社交圈", hint: "心情+20,健康+12,置_d769Thankful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d769HealthCd = true;
            st.flags._d769Thankful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '有朋友,真好。' 心情+20,健康+12。", "success");
            }
          }
        },
        {
          text: "🏃 独处充电", hint: "心智+15,疲劳-15,置_d769SoloRecharger",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d769HealthCd = true;
            st.flags._d769SoloRecharger = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '独处,也是一种自我关爱。' 心智+15,疲劳-15。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        if (!st.relationships) return "社交关系,是健康的重要支柱...";
        var metCount = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met) metCount++;
        }
        return "你有" + metCount + "位结识的朋友——'社交,是最好的保健品。'";
      }
    },
    {
      id: "d769_social_capital_v7", phase: "street", _isChainEvent: false, icon: "💰",
      title: "社交资本",
      story: "NPC朋友带来的情报,让你占了先机——{desc}",
      triggers: { minDay: 900, interval: 1000, maxRepeats: 3, excludeFlags: ["_d769CapitalCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d769CapitalCd) return false;
        if (!st.relationships || !st.trade) return false;
        var highAff = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 90) highAff++;
        }
        return highAff >= 7 && st.player && st.player.day >= 900;
      },
      choices: [
        {
          text: "📊 利用信息优势", hint: "智力+15,会计XP+15,置_d769InfoAdvantager",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d769CapitalCd = true;
            st.flags._d769InfoAdvantager = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '人脉就是钱脉。' 智力+15,会计XP+15。", "success");
            }
          }
        },
        {
          text: "🤝 回馈朋友", hint: "社交XP+15,置_d769Reciprocator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d769CapitalCd = true;
            st.flags._d769Reciprocator = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '互惠,让关系更持久。' 社交XP+15。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "NPC朋友带来的情报,让你在市场上更有优势——'信息,就是财富。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
