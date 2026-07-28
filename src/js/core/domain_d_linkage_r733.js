/**
 * 域D(NPC/社交) 联动增强 R733 (第四轮循环)
 * 桥接：
 *   D→B  d733_npc_event_story_v2 NPC事件故事v2 → 消费 事件+NPC关系
 *   D→G  d733_social_wellness_v3 社交健康v3 → 消费 社交数据+needs
 *   D→A  d733_social_capital_v3 社交资本v3 → 消费 NPC关系+pricing
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR733Loaded) return;
  RANDOM_EVENTS._domainDLinkageR733Loaded = true;

  var EVENTS = [
    {
      id: "d733_npc_event_story_v2", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "NPC事件故事",
      story: "你和NPC共同经历的事件,正在产生回响——{desc}",
      triggers: { minDay: 180, interval: 240, maxRepeats: 3, excludeFlags: ["_d733EchoCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d733EchoCd) return false;
        return st.player && st.player.day >= 180 && st.relationships;
      },
      choices: [
        {
          text: "📖 分享故事", hint: "社交XP+10,置_d733StorySharer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d733EchoCd = true;
            st.flags._d733StorySharer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗣️ '故事,让关系更有温度。' 社交XP+10。", "success");
            }
          }
        },
        {
          text: "🤝 深化友谊", hint: "心智+8,置_d733DeepFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d733EchoCd = true;
            st.flags._d733DeepFriend = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '友谊,需要用心经营。' 心智+8。", "info");
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
      id: "d733_social_wellness_v3", phase: "street", _isChainEvent: false, icon: "💚",
      title: "社交健康",
      story: "良好的社交关系让身心更健康——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 4, excludeFlags: ["_d733HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d733HealthCd) return false;
        return st.player && st.player.day >= 150 && st.needs && st.status && st.relationships;
      },
      choices: [
        {
          text: "😊 感恩社交圈", hint: "心情+10,健康+5,置_d733Thankful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d733HealthCd = true;
            st.flags._d733Thankful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '有朋友,真好。' 心情+10,健康+5。", "success");
            }
          }
        },
        {
          text: "🏃 独处充电", hint: "心智+7,疲劳-8,置_d733SoloRecharger",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d733HealthCd = true;
            st.flags._d733SoloRecharger = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '独处,也是一种自我关爱。' 心智+7,疲劳-8。", "info");
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
      id: "d733_social_capital_v3", phase: "street", _isChainEvent: false, icon: "💰",
      title: "社交资本",
      story: "NPC朋友带来的情报,让你占了先机——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 3, excludeFlags: ["_d733CapitalCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d733CapitalCd) return false;
        if (!st.relationships || !st.trade) return false;
        var highAff = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 60) highAff++;
        }
        return highAff >= 3 && st.player && st.player.day >= 200;
      },
      choices: [
        {
          text: "📊 利用信息优势", hint: "智力+7,会计XP+6,置_d733InfoAdvantager",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d733CapitalCd = true;
            st.flags._d733InfoAdvantager = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 7);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '人脉就是钱脉。' 智力+7,会计XP+6。", "success");
            }
          }
        },
        {
          text: "🤝 回馈朋友", hint: "社交XP+8,置_d733Reciprocator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d733CapitalCd = true;
            st.flags._d733Reciprocator = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 8); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '互惠,让关系更持久。' 社交XP+8。", "info");
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
