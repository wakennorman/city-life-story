/**
 * 域B(事件/叙事) 联动增强 R751 (第七轮循环)
 * 桥接：
 *   B→A  b751_event_legacy_v5 事件遗产v5 → 消费 events_core 统计数据
 *   B→D  b751_npc_bond_v4 NPC羁绊v4 → 消费 事件+NPC关系
 *   B→G  b751_narrative_growth_v5 叙事成长v5 → 消费 事件历史+status
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR751Loaded) return;
  RANDOM_EVENTS._domainBLinkageR751Loaded = true;

  var EVENTS = [
    {
      id: "b751_event_legacy_v5", phase: "street", _isChainEvent: false, icon: "📜",
      title: "事件遗产",
      story: "你经历的事件正在积累成遗产——{desc}",
      triggers: { minDay: 365, interval: 500, maxRepeats: 3, excludeFlags: ["_b751LegacyCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b751LegacyCd) return false;
        return st.player && st.player.day >= 365;
      },
      choices: [
        {
          text: "📊 回顾事件模式", hint: "智力+12,心智+10,置_b751PatternAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b751LegacyCd = true;
            st.flags._b751PatternAnalyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📜 '每一个事件,都是人生的一块拼图。' 智力+12,心智+10。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+12,置_b751LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b751LegacyCd = true;
            st.flags._b751LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '记录,让记忆永存。' 社交XP+12。", "info");
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
      id: "b751_npc_bond_v4", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "NPC羁绊",
      story: "你和NPC之间的羁绊正在加深——{desc}",
      triggers: { minDay: 300, interval: 365, maxRepeats: 3, excludeFlags: ["_b751BondCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b751BondCd) return false;
        return st.player && st.player.day >= 300 && st.relationships;
      },
      choices: [
        {
          text: "💕 深化友谊", hint: "社交XP+12,置_b751DeepFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b751BondCd = true;
            st.flags._b751DeepFriend = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '友谊,需要用心经营。' 社交XP+12。", "success");
            }
          }
        },
        {
          text: "📖 记录羁绊故事", hint: "心智+10,置_b751BondChronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b751BondCd = true;
            st.flags._b751BondChronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '羁绊,是人生最珍贵的财富。' 心智+10。", "info");
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
      id: "b751_narrative_growth_v5", phase: "street", _isChainEvent: false, icon: "💪",
      title: "叙事成长",
      story: "你正在从经历中汲取力量——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 4, excludeFlags: ["_b751GrowthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b751GrowthCd) return false;
        return st.player && st.player.day >= 250 && st.status && st.needs;
      },
      choices: [
        {
          text: "💪 从挫折中学习", hint: "心智+12,健康+6,置_b751Resilient",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b751GrowthCd = true;
            st.flags._b751Resilient = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 '挫折,是成长的垫脚石。' 心智+12,健康+6。", "success");
            }
          }
        },
        {
          text: "🧘 正念反思", hint: "心情+15,置_b751Mindful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b751GrowthCd = true;
            st.flags._b751Mindful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '正念,让心更平静。' 心情+15。", "info");
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
