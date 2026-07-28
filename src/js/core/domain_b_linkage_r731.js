/**
 * 域B(事件/叙事) 联动增强 R731 (第四轮循环)
 * 桥接：
 *   B→A  b731_event_legacy_v3 事件遗产v3 → 消费 events_core 统计数据
 *   B→D  b731_npc_bond_v2 NPC羁绊v2 → 消费 事件+NPC关系
 *   B→G  b731_narrative_growth_v3 叙事成长v3 → 消费 事件历史+status
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR731Loaded) return;
  RANDOM_EVENTS._domainBLinkageR731Loaded = true;

  var EVENTS = [
    {
      id: "b731_event_legacy_v3", phase: "street", _isChainEvent: false, icon: "📜",
      title: "事件遗产",
      story: "你经历的事件正在积累成遗产——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 3, excludeFlags: ["_b731LegacyCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b731LegacyCd) return false;
        return st.player && st.player.day >= 200;
      },
      choices: [
        {
          text: "📊 回顾事件模式", hint: "智力+7,心智+5,置_b731PatternAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b731LegacyCd = true;
            st.flags._b731PatternAnalyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 7);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📜 '每一个事件,都是人生的一块拼图。' 智力+7,心智+5。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+9,置_b731LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b731LegacyCd = true;
            st.flags._b731LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 9); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '记录,让记忆永存。' 社交XP+9。", "info");
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
      id: "b731_npc_bond_v2", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "NPC羁绊",
      story: "你和NPC之间的羁绊正在加深——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 3, excludeFlags: ["_b731BondCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b731BondCd) return false;
        return st.player && st.player.day >= 150 && st.relationships;
      },
      choices: [
        {
          text: "💕 深化友谊", hint: "社交XP+9,置_b731DeepFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b731BondCd = true;
            st.flags._b731DeepFriend = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 9); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '友谊,需要用心经营。' 社交XP+9。", "success");
            }
          }
        },
        {
          text: "📖 记录羁绊故事", hint: "心智+7,置_b731BondChronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b731BondCd = true;
            st.flags._b731BondChronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '羁绊,是人生最珍贵的财富。' 心智+7。", "info");
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
      id: "b731_narrative_growth_v3", phase: "street", _isChainEvent: false, icon: "💪",
      title: "叙事成长",
      story: "你正在从经历中汲取力量——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 4, excludeFlags: ["_b731GrowthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b731GrowthCd) return false;
        return st.player && st.player.day >= 120 && st.status && st.needs;
      },
      choices: [
        {
          text: "💪 从挫折中学习", hint: "心智+8,健康+4,置_b731Resilient",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b731GrowthCd = true;
            st.flags._b731Resilient = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 '挫折,是成长的垫脚石。' 心智+8,健康+4。", "success");
            }
          }
        },
        {
          text: "🧘 正念反思", hint: "心情+10,置_b731Mindful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b731GrowthCd = true;
            st.flags._b731Mindful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '正念,让心更平静。' 心情+10。", "info");
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
