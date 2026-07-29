/**
 * 域B(事件/叙事) 联动增强 R776 (第十轮循环)
 * 桥接：
 *   B→A  b776_event_legacy_v8 事件遗产v8 → 消费 events_core 统计数据
 *   B→D  b776_npc_bond_v7 NPC羁绊v7 → 消费 事件+NPC关系
 *   B→G  b776_narrative_growth_v8 叙事成长v8 → 消费 事件历史+status
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR776Loaded) return;
  RANDOM_EVENTS._domainBLinkageR776Loaded = true;

  var EVENTS = [
    {
      id: "b776_event_legacy_v8", phase: "street", _isChainEvent: false, icon: "📜",
      title: "事件遗产",
      story: "你经历的事件正在积累成遗产——{desc}",
      triggers: { minDay: 1000, interval: 1100, maxRepeats: 3, excludeFlags: ["_b776LegacyCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b776LegacyCd) return false;
        return st.player && st.player.day >= 1000;
      },
      choices: [
        {
          text: "📊 回顾事件模式", hint: "智力+20,心智+18,置_b776PatternAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b776LegacyCd = true;
            st.flags._b776PatternAnalyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📜 '每一个事件,都是人生的一块拼图。' 智力+20,心智+18。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+20,置_b776LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b776LegacyCd = true;
            st.flags._b776LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '记录,让记忆永存。' 社交XP+20。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        return "你已度过" + days + "天——'这些经历,就是你的人生遗产。'";
      }
    },
    {
      id: "b776_npc_bond_v7", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "NPC羁绊",
      story: "你和NPC之间的羁绊正在加深——{desc}",
      triggers: { minDay: 900, interval: 1000, maxRepeats: 3, excludeFlags: ["_b776BondCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b776BondCd) return false;
        return st.player && st.player.day >= 900 && st.relationships;
      },
      choices: [
        {
          text: "💕 深化友谊", hint: "社交XP+20,置_b776DeepFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b776BondCd = true;
            st.flags._b776DeepFriend = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '友谊,需要用心经营。' 社交XP+20。", "success");
            }
          }
        },
        {
          text: "📖 记录羁绊故事", hint: "心智+18,置_b776BondChronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b776BondCd = true;
            st.flags._b776BondChronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '羁绊,是人生最珍贵的财富。' 心智+18。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "你和NPC之间的羁绊正在加深——'这些关系,值得珍惜。'";
      }
    },
    {
      id: "b776_narrative_growth_v8", phase: "street", _isChainEvent: false, icon: "💪",
      title: "叙事成长",
      story: "你正在从经历中汲取力量——{desc}",
      triggers: { minDay: 800, interval: 900, maxRepeats: 4, excludeFlags: ["_b776GrowthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b776GrowthCd) return false;
        return st.player && st.player.day >= 800 && st.status && st.needs;
      },
      choices: [
        {
          text: "💪 从挫折中学习", hint: "心智+20,健康+12,置_b776Resilient",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b776GrowthCd = true;
            st.flags._b776Resilient = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 '挫折,是成长的垫脚石。' 心智+20,健康+12。", "success");
            }
          }
        },
        {
          text: "🧘 正念反思", hint: "心情+25,置_b776Mindful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b776GrowthCd = true;
            st.flags._b776Mindful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '正念,让心更平静。' 心情+25。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "每一次挫折,都让你更强大——'这就是叙事成长的力量。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
