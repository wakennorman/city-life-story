/**
 * 域B(事件/叙事) 联动增强 R715
 * 桥接：
 *   B→A  b714_event_data_v3 事件数据v3 → 消费 events_core 统计数据,
 *     将隐形事件数据显性化为"事件遗产"
 *   B→D  b714_npc_story_echo NPC故事回响 → 消费 事件+NPC关系,
 *     事件触发NPC关系变化
 *   B→G  b714_narrative_resilience_v2 叙事韧性v2 → 消费 事件历史+status,
 *     叙事影响心理健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR715Loaded) return;
  RANDOM_EVENTS._domainBLinkageR715Loaded = true;

  var EVENTS = [
    {
      id: "b714_event_data_v3", phase: "street", _isChainEvent: false, icon: "📜",
      title: "事件遗产",
      story: "你经历的事件正在积累成遗产——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 3, excludeFlags: ["_b714DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b714DataCd) return false;
        return st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "📊 回顾事件模式", hint: "智力+5,心智+3,置_b714PatternAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b714DataCd = true;
            st.flags._b714PatternAnalyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📜 '每一个事件,都是人生的一块拼图。' 智力+5,心智+3。", "success");
            }
          }
        },
        {
          text: "📖 记录人生故事", hint: "社交XP+6,置_b714Storyteller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b714DataCd = true;
            st.flags._b714Storyteller = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '记录,让记忆永存。' 社交XP+6。", "info");
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
      id: "b714_npc_story_echo", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "NPC故事回响",
      story: "你讲给NPC的故事,正在产生回响——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_b714EchoCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b714EchoCd) return false;
        return st.player && st.player.day >= 100 && st.relationships;
      },
      choices: [
        {
          text: "🤝 分享经历", hint: "社交XP+8,置_b714Sharer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b714EchoCd = true;
            st.flags._b714Sharer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 8); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗣️ '分享,让故事更有力量。' 社交XP+8。", "success");
            }
          }
        },
        {
          text: "👂 倾听他人", hint: "心智+5,置_b714Listener",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b714EchoCd = true;
            st.flags._b714Listener = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("👂 '倾听,是最好的陪伴。' 心智+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现,和NPC分享经历让你们的关系更近了——'故事,是连接人心的桥梁。'";
      }
    },
    {
      id: "b714_narrative_resilience_v2", phase: "street", _isChainEvent: false, icon: "💪",
      title: "叙事韧性",
      story: "你正在从经历中汲取力量——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 4, excludeFlags: ["_b714ResilienceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b714ResilienceCd) return false;
        return st.player && st.player.day >= 80 && st.status && st.needs;
      },
      choices: [
        {
          text: "💪 从挫折中学习", hint: "心智+6,健康+2,置_b714Resilient",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b714ResilienceCd = true;
            st.flags._b714Resilient = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 '挫折,是成长的垫脚石。' 心智+6,健康+2。", "success");
            }
          }
        },
        {
          text: "🧘 正念反思", hint: "心情+7,置_b714Mindful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b714ResilienceCd = true;
            st.flags._b714Mindful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 7);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '正念,让心更平静。' 心情+7。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "每一次挫折,都让你更强大——'这就是叙事韧性。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
