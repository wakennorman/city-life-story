/**
 * 域B(事件/叙事) 联动增强 R767 (第九轮循环)
 * 桥接：
 *   B→A  b767_event_legacy_v7 事件遗产v7 → 消费 events_core 统计数据
 *   B→D  b767_npc_bond_v6 NPC羁绊v6 → 消费 事件+NPC关系
 *   B→G  b767_narrative_growth_v7 叙事成长v7 → 消费 事件历史+status
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR767Loaded) return;
  RANDOM_EVENTS._domainBLinkageR767Loaded = true;

  var EVENTS = [
    {
      id: "b767_event_legacy_v7", phase: "street", _isChainEvent: false, icon: "📜",
      title: "事件遗产",
      story: "你经历的事件正在积累成遗产——{desc}",
      triggers: { minDay: 800, interval: 900, maxRepeats: 3, excludeFlags: ["_b767LegacyCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b767LegacyCd) return false;
        return st.player && st.player.day >= 800;
      },
      choices: [
        {
          text: "📊 回顾事件模式", hint: "智力+18,心智+15,置_b767PatternAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b767LegacyCd = true;
            st.flags._b767PatternAnalyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📜 '每一个事件,都是人生的一块拼图。' 智力+18,心智+15。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+18,置_b767LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b767LegacyCd = true;
            st.flags._b767LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '记录,让记忆永存。' 社交XP+18。", "info");
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
      id: "b767_npc_bond_v6", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "NPC羁绊",
      story: "你和NPC之间的羁绊正在加深——{desc}",
      triggers: { minDay: 600, interval: 700, maxRepeats: 3, excludeFlags: ["_b767BondCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b767BondCd) return false;
        return st.player && st.player.day >= 600 && st.relationships;
      },
      choices: [
        {
          text: "💕 深化友谊", hint: "社交XP+18,置_b767DeepFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b767BondCd = true;
            st.flags._b767DeepFriend = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '友谊,需要用心经营。' 社交XP+18。", "success");
            }
          }
        },
        {
          text: "📖 记录羁绊故事", hint: "心智+15,置_b767BondChronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b767BondCd = true;
            st.flags._b767BondChronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '羁绊,是人生最珍贵的财富。' 心智+15。", "info");
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
      id: "b767_narrative_growth_v7", phase: "street", _isChainEvent: false, icon: "💪",
      title: "叙事成长",
      story: "你正在从经历中汲取力量——{desc}",
      triggers: { minDay: 500, interval: 600, maxRepeats: 4, excludeFlags: ["_b767GrowthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b767GrowthCd) return false;
        return st.player && st.player.day >= 500 && st.status && st.needs;
      },
      choices: [
        {
          text: "💪 从挫折中学习", hint: "心智+18,健康+10,置_b767Resilient",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b767GrowthCd = true;
            st.flags._b767Resilient = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 '挫折,是成长的垫脚石。' 心智+18,健康+10。", "success");
            }
          }
        },
        {
          text: "🧘 正念反思", hint: "心情+20,置_b767Mindful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b767GrowthCd = true;
            st.flags._b767Mindful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '正念,让心更平静。' 心情+20。", "info");
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
