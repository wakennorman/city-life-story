/**
 * 域D(NPC/社交) 联动增强 R761 (第八轮循环)
 * 桥接：
 *   D→B  d761_npc_event_story_v5 NPC事件故事v5 → 消费 事件+NPC关系
 *   D→G  d761_social_wellness_v6 社交健康v6 → 消费 社交数据+needs
 *   D→A  d761_social_capital_v6 社交资本v6 → 消费 NPC关系+pricing
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR761Loaded) return;
  RANDOM_EVENTS._domainDLinkageR761Loaded = true;

  var EVENTS = [
    {
      id: "d761_npc_event_story_v5", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "NPC事件故事",
      story: "你和NPC共同经历的事件,正在产生回响——{desc}",
      triggers: { minDay: 500, interval: 600, maxRepeats: 3, excludeFlags: ["_d761EchoCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d761EchoCd) return false;
        return st.player && st.player.day >= 500 && st.relationships;
      },
      choices: [
        {
          text: "📖 分享故事", hint: "社交XP+18,置_d761StorySharer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d761EchoCd = true;
            st.flags._d761StorySharer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗣️ '故事,让关系更有温度。' 社交XP+18。", "success");
            }
          }
        },
        {
          text: "🤝 深化友谊", hint: "心智+15,置_d761DeepFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d761EchoCd = true;
            st.flags._d761DeepFriend = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '友谊,需要用心经营。' 心智+15。", "info");
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
      id: "d761_social_wellness_v6", phase: "street", _isChainEvent: false, icon: "💚",
      title: "社交健康",
      story: "良好的社交关系让身心更健康——{desc}",
      triggers: { minDay: 400, interval: 500, maxRepeats: 4, excludeFlags: ["_d761HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d761HealthCd) return false;
        return st.player && st.player.day >= 400 && st.needs && st.status && st.relationships;
      },
      choices: [
        {
          text: "😊 感恩社交圈", hint: "心情+18,健康+10,置_d761Thankful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d761HealthCd = true;
            st.flags._d761Thankful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '有朋友,真好。' 心情+18,健康+10。", "success");
            }
          }
        },
        {
          text: "🏃 独处充电", hint: "心智+12,疲劳-12,置_d761SoloRecharger",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d761HealthCd = true;
            st.flags._d761SoloRecharger = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '独处,也是一种自我关爱。' 心智+12,疲劳-12。", "info");
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
      id: "d761_social_capital_v6", phase: "street", _isChainEvent: false, icon: "💰",
      title: "社交资本",
      story: "NPC朋友带来的情报,让你占了先机——{desc}",
      triggers: { minDay: 600, interval: 700, maxRepeats: 3, excludeFlags: ["_d761CapitalCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d761CapitalCd) return false;
        if (!st.relationships || !st.trade) return false;
        var highAff = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 85) highAff++;
        }
        return highAff >= 6 && st.player && st.player.day >= 600;
      },
      choices: [
        {
          text: "📊 利用信息优势", hint: "智力+12,会计XP+12,置_d761InfoAdvantager",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d761CapitalCd = true;
            st.flags._d761InfoAdvantager = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '人脉就是钱脉。' 智力+12,会计XP+12。", "success");
            }
          }
        },
        {
          text: "🤝 回馈朋友", hint: "社交XP+12,置_d761Reciprocator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d761CapitalCd = true;
            st.flags._d761Reciprocator = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '互惠,让关系更持久。' 社交XP+12。", "info");
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
