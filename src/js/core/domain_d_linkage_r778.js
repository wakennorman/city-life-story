/**
 * 域D(NPC/社交) 联动增强 R778 (第十轮循环)
 * 桥接：
 *   D→B  d778_npc_event_story_v7 NPC事件故事v7 → 消费 事件+NPC关系
 *   D→G  d778_social_wellness_v8 社交健康v8 → 消费 社交数据+needs
 *   D→A  d778_social_capital_v8 社交资本v8 → 消费 NPC关系+pricing
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR778Loaded) return;
  RANDOM_EVENTS._domainDLinkageR778Loaded = true;

  var EVENTS = [
    {
      id: "d778_npc_event_story_v7", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "NPC事件故事",
      story: "你和NPC共同经历的事件,正在产生回响——{desc}",
      triggers: { minDay: 1000, interval: 1100, maxRepeats: 3, excludeFlags: ["_d778EchoCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d778EchoCd) return false;
        return st.player && st.player.day >= 1000 && st.relationships;
      },
      choices: [
        {
          text: "📖 分享故事", hint: "社交XP+25,置_d778StorySharer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d778EchoCd = true;
            st.flags._d778StorySharer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗣️ '故事,让关系更有温度。' 社交XP+25。", "success");
            }
          }
        },
        {
          text: "🤝 深化友谊", hint: "心智+20,置_d778DeepFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d778EchoCd = true;
            st.flags._d778DeepFriend = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '友谊,需要用心经营。' 心智+20。", "info");
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
      id: "d778_social_wellness_v8", phase: "street", _isChainEvent: false, icon: "💚",
      title: "社交健康",
      story: "良好的社交关系让身心更健康——{desc}",
      triggers: { minDay: 900, interval: 1000, maxRepeats: 4, excludeFlags: ["_d778HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d778HealthCd) return false;
        return st.player && st.player.day >= 900 && st.needs && st.status && st.relationships;
      },
      choices: [
        {
          text: "😊 感恩社交圈", hint: "心情+25,健康+15,置_d778Thankful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d778HealthCd = true;
            st.flags._d778Thankful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '有朋友,真好。' 心情+25,健康+15。", "success");
            }
          }
        },
        {
          text: "🏃 独处充电", hint: "心智+18,疲劳-18,置_d778SoloRecharger",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d778HealthCd = true;
            st.flags._d778SoloRecharger = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '独处,也是一种自我关爱。' 心智+18,疲劳-18。", "info");
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
      id: "d778_social_capital_v8", phase: "street", _isChainEvent: false, icon: "💰",
      title: "社交资本",
      story: "NPC朋友带来的情报,让你占了先机——{desc}",
      triggers: { minDay: 1100, interval: 1200, maxRepeats: 3, excludeFlags: ["_d778CapitalCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d778CapitalCd) return false;
        if (!st.relationships || !st.trade) return false;
        var highAff = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 95) highAff++;
        }
        return highAff >= 8 && st.player && st.player.day >= 1100;
      },
      choices: [
        {
          text: "📊 利用信息优势", hint: "智力+18,会计XP+18,置_d778InfoAdvantager",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d778CapitalCd = true;
            st.flags._d778InfoAdvantager = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '人脉就是钱脉。' 智力+18,会计XP+18。", "success");
            }
          }
        },
        {
          text: "🤝 回馈朋友", hint: "社交XP+18,置_d778Reciprocator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d778CapitalCd = true;
            st.flags._d778Reciprocator = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '互惠,让关系更持久。' 社交XP+18。", "info");
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
