/**
 * 域B(事件/叙事) 联动增强 R739 (第五轮循环)
 * 桥接：
 *   B→A  b739_event_legacy_v4 事件遗产v4 → 消费 events_core 统计数据
 *   B→D  b739_npc_bond_v3 NPC羁绊v3 → 消费 事件+NPC关系
 *   B→G  b739_narrative_growth_v4 叙事成长v4 → 消费 事件历史+status
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR739Loaded) return;
  RANDOM_EVENTS._domainBLinkageR739Loaded = true;

  var EVENTS = [
    {
      id: "b739_event_legacy_v4", phase: "street", _isChainEvent: false, icon: "📜",
      title: "事件遗产",
      story: "你经历的事件正在积累成遗产——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 3, excludeFlags: ["_b739LegacyCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b739LegacyCd) return false;
        return st.player && st.player.day >= 250;
      },
      choices: [
        {
          text: "📊 回顾事件模式", hint: "智力+8,心智+6,置_b739PatternAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b739LegacyCd = true;
            st.flags._b739PatternAnalyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📜 '每一个事件,都是人生的一块拼图。' 智力+8,心智+6。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+10,置_b739LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b739LegacyCd = true;
            st.flags._b739LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '记录,让记忆永存。' 社交XP+10。", "info");
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
      id: "b739_npc_bond_v3", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "NPC羁绊",
      story: "你和NPC之间的羁绊正在加深——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 3, excludeFlags: ["_b739BondCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b739BondCd) return false;
        return st.player && st.player.day >= 200 && st.relationships;
      },
      choices: [
        {
          text: "💕 深化友谊", hint: "社交XP+10,置_b739DeepFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b739BondCd = true;
            st.flags._b739DeepFriend = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '友谊,需要用心经营。' 社交XP+10。", "success");
            }
          }
        },
        {
          text: "📖 记录羁绊故事", hint: "心智+8,置_b739BondChronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b739BondCd = true;
            st.flags._b739BondChronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '羁绊,是人生最珍贵的财富。' 心智+8。", "info");
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
      id: "b739_narrative_growth_v4", phase: "street", _isChainEvent: false, icon: "💪",
      title: "叙事成长",
      story: "你正在从经历中汲取力量——{desc}",
      triggers: { minDay: 180, interval: 240, maxRepeats: 4, excludeFlags: ["_b739GrowthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b739GrowthCd) return false;
        return st.player && st.player.day >= 180 && st.status && st.needs;
      },
      choices: [
        {
          text: "💪 从挫折中学习", hint: "心智+9,健康+5,置_b739Resilient",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b739GrowthCd = true;
            st.flags._b739Resilient = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 '挫折,是成长的垫脚石。' 心智+9,健康+5。", "success");
            }
          }
        },
        {
          text: "🧘 正念反思", hint: "心情+12,置_b739Mindful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b739GrowthCd = true;
            st.flags._b739Mindful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '正念,让心更平静。' 心情+12。", "info");
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
