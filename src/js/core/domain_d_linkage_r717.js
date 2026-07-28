/**
 * 域D(NPC/社交) 联动增强 R717
 * 桥接：
 *   D→B  d717_npc_event_echo NPC事件回响 → 消费 事件+NPC关系,
 *     事件触发NPC关系叙事
 *   D→G  d717_social_health_v2 社交健康v2 → 消费 社交数据+needs,
 *     社交质量影响身心健康
 *   D→A  d717_social_price_intel_v2 社交价格情报v2 → 消费 NPC关系+pricing,
 *     NPC关系带来交易优势
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR717Loaded) return;
  RANDOM_EVENTS._domainDLinkageR717Loaded = true;

  var EVENTS = [
    {
      id: "d717_npc_event_echo", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "NPC事件回响",
      story: "你和NPC共同经历的事件,正在产生回响——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_d717EchoCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d717EchoCd) return false;
        return st.player && st.player.day >= 100 && st.relationships;
      },
      choices: [
        {
          text: "📖 分享故事", hint: "社交XP+8,置_d717StorySharer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d717EchoCd = true;
            st.flags._d717StorySharer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 8); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗣️ '故事,让关系更有温度。' 社交XP+8。", "success");
            }
          }
        },
        {
          text: "🤝 深化友谊", hint: "心智+5,置_d717DeepFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d717EchoCd = true;
            st.flags._d717DeepFriend = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '友谊,需要用心经营。' 心智+5。", "info");
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
      id: "d717_social_health_v2", phase: "street", _isChainEvent: false, icon: "💚",
      title: "社交健康",
      story: "良好的社交关系让身心更健康——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 4, excludeFlags: ["_d717HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d717HealthCd) return false;
        return st.player && st.player.day >= 80 && st.needs && st.status && st.relationships;
      },
      choices: [
        {
          text: "😊 感恩社交圈", hint: "心情+8,健康+3,置_d717Thankful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d717HealthCd = true;
            st.flags._d717Thankful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '有朋友,真好。' 心情+8,健康+3。", "success");
            }
          }
        },
        {
          text: "🏃 独处充电", hint: "心智+5,疲劳-6,置_d717SoloRecharger",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d717HealthCd = true;
            st.flags._d717SoloRecharger = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '独处,也是一种自我关爱。' 心智+5,疲劳-6。", "info");
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
      id: "d717_social_price_intel_v2", phase: "street", _isChainEvent: false, icon: "💰",
      title: "社交价格情报",
      story: "NPC朋友带来的价格情报,让你占了先机——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 3, excludeFlags: ["_d717PriceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d717PriceCd) return false;
        if (!st.relationships || !st.trade) return false;
        var highAff = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 50) highAff++;
        }
        return highAff >= 2 && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "📊 利用价格优势", hint: "智力+5,会计XP+4,置_d717PriceAdvantager",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d717PriceCd = true;
            st.flags._d717PriceAdvantager = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '人脉就是钱脉。' 智力+5,会计XP+4。", "success");
            }
          }
        },
        {
          text: "🤝 回馈朋友", hint: "社交XP+6,置_d717Reciprocator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d717PriceCd = true;
            st.flags._d717Reciprocator = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '互惠,让关系更持久。' 社交XP+6。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "NPC朋友带来的价格情报,让你在市场上更有优势——'信息,就是财富。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
