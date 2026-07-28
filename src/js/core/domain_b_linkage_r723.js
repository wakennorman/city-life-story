/**
 * 域B(事件/叙事) 联动增强 R723 (第三轮循环)
 * 桥接：
 *   B→A  b723_event_legacy_v2 事件遗产v2 → 消费 events_core 统计数据
 *   B→D  b723_npc_bond_story NPC羁绊故事 → 消费 事件+NPC关系
 *   B→G  b723_narrative_growth_v2 叙事成长v2 → 消费 事件历史+status
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR723Loaded) return;
  RANDOM_EVENTS._domainBLinkageR723Loaded = true;

  var EVENTS = [
    {
      id: "b723_event_legacy_v2", phase: "street", _isChainEvent: false, icon: "📜",
      title: "事件遗产",
      story: "你经历的事件正在积累成遗产——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 3, excludeFlags: ["_b723LegacyCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b723LegacyCd) return false;
        return st.player && st.player.day >= 150;
      },
      choices: [
        {
          text: "📊 回顾事件模式", hint: "智力+6,心智+4,置_b723PatternAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b723LegacyCd = true;
            st.flags._b723PatternAnalyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📜 '每一个事件,都是人生的一块拼图。' 智力+6,心智+4。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+8,置_b723LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b723LegacyCd = true;
            st.flags._b723LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 8); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '记录,让记忆永存。' 社交XP+8。", "info");
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
      id: "b723_npc_bond_story", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "NPC羁绊故事",
      story: "你和NPC之间的羁绊正在加深——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 3, excludeFlags: ["_b723BondCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b723BondCd) return false;
        return st.player && st.player.day >= 120 && st.relationships;
      },
      choices: [
        {
          text: "💕 深化友谊", hint: "社交XP+8,置_b723DeepFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b723BondCd = true;
            st.flags._b723DeepFriend = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 8); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '友谊,需要用心经营。' 社交XP+8。", "success");
            }
          }
        },
        {
          text: "📖 记录羁绊故事", hint: "心智+6,置_b723BondChronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b723BondCd = true;
            st.flags._b723BondChronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '羁绊,是人生最珍贵的财富。' 心智+6。", "info");
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
      id: "b723_narrative_growth_v2", phase: "street", _isChainEvent: false, icon: "💪",
      title: "叙事成长",
      story: "你正在从经历中汲取力量——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 4, excludeFlags: ["_b723GrowthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b723GrowthCd) return false;
        return st.player && st.player.day >= 100 && st.status && st.needs;
      },
      choices: [
        {
          text: "💪 从挫折中学习", hint: "心智+7,健康+3,置_b723Resilient",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b723GrowthCd = true;
            st.flags._b723Resilient = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 '挫折,是成长的垫脚石。' 心智+7,健康+3。", "success");
            }
          }
        },
        {
          text: "🧘 正念反思", hint: "心情+8,置_b723Mindful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b723GrowthCd = true;
            st.flags._b723Mindful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '正念,让心更平静。' 心情+8。", "info");
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
