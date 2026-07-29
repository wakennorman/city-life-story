/**
 * 域B(事件/叙事) 联动增强 R777 (sensenova-exp 第三轮循环)
 * 桥接：
 *   B→A  b777_event_data_legacy 事件数据沉淀 → 消费 事件统计数据
 *   B→D  b777_event_social_ripple 事件社交涟漪 → 消费 事件+NPC关系
 *   B→G  b777_narrative_resilience 叙事韧性 → 消费 事件历史+心智
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR777Loaded) return;
  RANDOM_EVENTS._domainBLinkageR777Loaded = true;

  var EVENTS = [
    // ====== B→A 事件数据沉淀 ======
    {
      id: "b777_event_data_legacy", phase: "street", _isChainEvent: false, icon: "📊",
      title: "事件数据沉淀",
      story: "每一段经历都在数据中留下痕迹——{desc}",
      triggers: { minDay: 480, interval: 600, maxRepeats: 3, excludeFlags: ["_b777DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b777DataCd) return false;
        return st.player && st.player.day >= 480;
      },
      choices: [
        {
          text: "📋 回顾经历事件", hint: "心智+12, 智力+8, 置_b777EventReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b777DataCd = true;
            st.flags._b777EventReviewer = true;
            // 记录事件数据供A域消费
            if (!st.flags._eventDataMilestones) st.flags._eventDataMilestones = [];
            st.flags._eventDataMilestones.push({
              day: st.player && st.player.day || 0,
              type: "review"
            });
            if (st.flags._eventDataMilestones.length > 15) st.flags._eventDataMilestones.shift();
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📋 '经历是最好的老师。' 心智+12, 智力+8。", "info");
            }
          }
        },
        {
          text: "📈 分析事件模式", hint: "智力+15, 会计XP+10, 置_b777EventPattern",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b777DataCd = true;
            st.flags._b777EventPattern = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '数据中藏着答案。' 智力+15, 会计XP+10。", "success");
            }
          }
        }
      ]
    },

    // ====== B→D 事件社交涟漪 ======
    {
      id: "b777_event_social_ripple", phase: "street", _isChainEvent: false, icon: "🔄",
      title: "事件社交涟漪",
      story: "你经历的大事，也在影响身边的人——{desc}",
      triggers: { minDay: 600, interval: 500, maxRepeats: 3, excludeFlags: ["_b777SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b777SocialCd) return false;
        return st.player && st.player.day >= 600 && st.relationships;
      },
      choices: [
        {
          text: "💬 与朋友分享经历", hint: "魅力+10, 心智+8, 置_b777StoryTeller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b777SocialCd = true;
            st.flags._b777StoryTeller = true;
            // 记录社交涟漪事件供D域消费
            st.flags._b777LastSocialRipple = st.player && st.player.day || 0;
            if (st.player) {
              st.player.charm = Math.min(100, (st.player.charm || 50) + 10);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💬 '分享让快乐加倍，让痛苦减半。' 魅力+10, 心智+8。", "info");
            }
          }
        },
        {
          text: "📝 写下经历感悟", hint: "心智+15, 魅力+5, 置_b777DiaryWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b777SocialCd = true;
            st.flags._b777DiaryWriter = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 '文字是思想的锚。' 心智+15, 魅力+5。", "success");
            }
          }
        }
      ]
    },

    // ====== B→G 叙事韧性 ======
    {
      id: "b777_narrative_resilience", phase: "street", _isChainEvent: false, icon: "🛡️",
      title: "叙事韧性",
      story: "每一次挫折都在塑造更强大的你——{desc}",
      triggers: { minDay: 720, interval: 600, maxRepeats: 3, excludeFlags: ["_b777ResilienceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b777ResilienceCd) return false;
        return st.player && st.player.day >= 720 && st.status;
      },
      choices: [
        {
          text: "💪 从经历中汲取力量", hint: "心智+18, 健康+5, 置_b777Resilient",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b777ResilienceCd = true;
            st.flags._b777Resilient = true;
            // 记录叙事韧性供G域消费
            st.flags._b777NarrativeResilience = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 80) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🛡️ '杀不死你的，终将使你更强大。' 心智+18, 健康+5。", "success");
            }
          }
        },
        {
          text: "🧘 反思人生教训", hint: "心智+20, 置_b777LifeReflector",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b777ResilienceCd = true;
            st.flags._b777LifeReflector = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '反思是最好的成长。' 心智+20。", "success");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();