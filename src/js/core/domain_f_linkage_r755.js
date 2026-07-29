/**
 * 域F(UI/UX) 联动增强 R755 (第七轮循环)
 * 桥接：
 *   F→A  f755_data_story_v8 数据故事v8 → 消费 jobs/skills/wealth 数据
 *   F→B  f755_event_memory_v8 事件记忆墙v8 → 消费 events_core+news 数据
 *   F→G  f755_health_tracker_v8 健康追踪v8 → 消费 status/needs 数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR755Loaded) return;
  RANDOM_EVENTS._domainFLinkageR755Loaded = true;

  var EVENTS = [
    {
      id: "f755_data_story_v8", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据故事",
      story: "你的数据正在讲述故事——{desc}",
      triggers: { minDay: 500, interval: 600, maxRepeats: 3, excludeFlags: ["_f755DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f755DataCd) return false;
        return st.player && st.player.day >= 500 && st.skills;
      },
      choices: [
        {
          text: "📈 回顾成长轨迹", hint: "心智+12,置_f755GrowthReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f755DataCd = true;
            st.flags._f755GrowthReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据背后,是成长的足迹。' 心智+12。", "success");
            }
          }
        },
        {
          text: "🎯 设定数据目标", hint: "智力+10,置_f755DataGoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f755DataCd = true;
            st.flags._f755DataGoalSetter = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,数据才有意义。' 智力+10。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        return "你已度过" + days + "天——'这些数据,诉说着你的成长。'";
      }
    },
    {
      id: "f755_event_memory_v8", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "事件记忆墙",
      story: "你经历的事件正在组成记忆墙——{desc}",
      triggers: { minDay: 400, interval: 500, maxRepeats: 3, excludeFlags: ["_f755MemoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f755MemoryCd) return false;
        return st.player && st.player.day >= 400;
      },
      choices: [
        {
          text: "📜 回顾重要事件", hint: "心智+12,置_f755EventReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f755MemoryCd = true;
            st.flags._f755EventReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🖼️ '记忆,是人生最珍贵的财富。' 心智+12。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+12,置_f755LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f755MemoryCd = true;
            st.flags._f755LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '书写,让记忆永存。' 社交XP+12。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        return "你已度过" + days + "天——'这些记忆,构成了你的人生。'";
      }
    },
    {
      id: "f755_health_tracker_v8", phase: "street", _isChainEvent: false, icon: "💚",
      title: "健康追踪",
      story: "你的健康状况需要持续关注——{desc}",
      triggers: { minDay: 365, interval: 400, maxRepeats: 4, excludeFlags: ["_f755HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f755HealthCd) return false;
        return st.status && st.needs && st.player && st.player.day >= 365;
      },
      choices: [
        {
          text: "🏃 制定健康计划", hint: "健康+10,疲劳-15,置_f755HealthPlan",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f755HealthCd = true;
            st.flags._f755HealthPlan = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 10);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '健康,需要持续管理。' 健康+10,疲劳-15。", "success");
            }
          }
        },
        {
          text: "😴 调整作息", hint: "心情+15,置_f755SleepAdjust",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f755HealthCd = true;
            st.flags._f755SleepAdjust = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😴 '早睡早起,精神百倍。' 心情+15。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var health = st.status && st.status.health ? Math.round(st.status.health) : 100;
        var fatigue = st.needs && st.needs.fatigue ? Math.round(st.needs.fatigue) : 0;
        return "健康" + health + "%,疲劳" + fatigue + "——'身体,最诚实的仪表盘。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
