/**
 * 域B(事件/叙事) 联动增强 R759 (第八轮循环)
 * 桥接：
 *   B→A  b759_event_legacy_v6 事件遗产v6 → 消费 events_core 统计数据
 *   B→D  b759_npc_bond_v5 NPC羁绊v5 → 消费 事件+NPC关系
 *   B→G  b759_narrative_growth_v6 叙事成长v6 → 消费 事件历史+status
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR759Loaded) return;
  RANDOM_EVENTS._domainBLinkageR759Loaded = true;

  var EVENTS = [
    {
      id: "b759_event_legacy_v6", phase: "street", _isChainEvent: false, icon: "📜",
      title: "事件遗产",
      story: "你经历的事件正在积累成遗产——{desc}",
      triggers: { minDay: 500, interval: 600, maxRepeats: 3, excludeFlags: ["_b759LegacyCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b759LegacyCd) return false;
        return st.player && st.player.day >= 500;
      },
      choices: [
        {
          text: "📊 回顾事件模式", hint: "智力+15,心智+12,置_b759PatternAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b759LegacyCd = true;
            st.flags._b759PatternAnalyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📜 '每一个事件,都是人生的一块拼图。' 智力+15,心智+12。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+15,置_b759LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b759LegacyCd = true;
            st.flags._b759LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '记录,让记忆永存。' 社交XP+15。", "info");
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
      id: "b759_npc_bond_v5", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "NPC羁绊",
      story: "你和NPC之间的羁绊正在加深——{desc}",
      triggers: { minDay: 400, interval: 500, maxRepeats: 3, excludeFlags: ["_b759BondCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b759BondCd) return false;
        return st.player && st.player.day >= 400 && st.relationships;
      },
      choices: [
        {
          text: "💕 深化友谊", hint: "社交XP+15,置_b759DeepFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b759BondCd = true;
            st.flags._b759DeepFriend = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '友谊,需要用心经营。' 社交XP+15。", "success");
            }
          }
        },
        {
          text: "📖 记录羁绊故事", hint: "心智+12,置_b759BondChronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b759BondCd = true;
            st.flags._b759BondChronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '羁绊,是人生最珍贵的财富。' 心智+12。", "info");
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
      id: "b759_narrative_growth_v6", phase: "street", _isChainEvent: false, icon: "💪",
      title: "叙事成长",
      story: "你正在从经历中汲取力量——{desc}",
      triggers: { minDay: 365, interval: 400, maxRepeats: 4, excludeFlags: ["_b759GrowthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b759GrowthCd) return false;
        return st.player && st.player.day >= 365 && st.status && st.needs;
      },
      choices: [
        {
          text: "💪 从挫折中学习", hint: "心智+15,健康+8,置_b759Resilient",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b759GrowthCd = true;
            st.flags._b759Resilient = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 '挫折,是成长的垫脚石。' 心智+15,健康+8。", "success");
            }
          }
        },
        {
          text: "🧘 正念反思", hint: "心情+18,置_b759Mindful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b759GrowthCd = true;
            st.flags._b759Mindful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '正念,让心更平静。' 心情+18。", "info");
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
