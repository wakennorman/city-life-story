/**
 * 域F(UI/UX) 联动增强 R763 (第八轮循环)
 * 桥接：
 *   F→A  f763_data_story_v9 数据故事v9 → 消费 jobs/skills/wealth 数据
 *   F→B  f763_event_memory_v9 事件记忆墙v9 → 消费 events_core+news 数据
 *   F→G  f763_health_tracker_v9 健康追踪v9 → 消费 status/needs 数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR763Loaded) return;
  RANDOM_EVENTS._domainFLinkageR763Loaded = true;

  var EVENTS = [
    {
      id: "f763_data_story_v9", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据故事",
      story: "你的数据正在讲述故事——{desc}",
      triggers: { minDay: 700, interval: 800, maxRepeats: 3, excludeFlags: ["_f763DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f763DataCd) return false;
        return st.player && st.player.day >= 700 && st.skills;
      },
      choices: [
        {
          text: "📈 回顾成长轨迹", hint: "心智+15,置_f763GrowthReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f763DataCd = true;
            st.flags._f763GrowthReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据背后,是成长的足迹。' 心智+15。", "success");
            }
          }
        },
        {
          text: "🎯 设定数据目标", hint: "智力+12,置_f763DataGoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f763DataCd = true;
            st.flags._f763DataGoalSetter = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,数据才有意义。' 智力+12。", "info");
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
      id: "f763_event_memory_v9", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "事件记忆墙",
      story: "你经历的事件正在组成记忆墙——{desc}",
      triggers: { minDay: 600, interval: 700, maxRepeats: 3, excludeFlags: ["_f763MemoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f763MemoryCd) return false;
        return st.player && st.player.day >= 600;
      },
      choices: [
        {
          text: "📜 回顾重要事件", hint: "心智+15,置_f763EventReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f763MemoryCd = true;
            st.flags._f763EventReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🖼️ '记忆,是人生最珍贵的财富。' 心智+15。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+15,置_f763LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f763MemoryCd = true;
            st.flags._f763LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '书写,让记忆永存。' 社交XP+15。", "info");
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
      id: "f763_health_tracker_v9", phase: "street", _isChainEvent: false, icon: "💚",
      title: "健康追踪",
      story: "你的健康状况需要持续关注——{desc}",
      triggers: { minDay: 500, interval: 600, maxRepeats: 4, excludeFlags: ["_f763HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f763HealthCd) return false;
        return st.status && st.needs && st.player && st.player.day >= 500;
      },
      choices: [
        {
          text: "🏃 制定健康计划", hint: "健康+12,疲劳-18,置_f763HealthPlan",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f763HealthCd = true;
            st.flags._f763HealthPlan = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 12);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '健康,需要持续管理。' 健康+12,疲劳-18。", "success");
            }
          }
        },
        {
          text: "😴 调整作息", hint: "心情+18,置_f763SleepAdjust",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f763HealthCd = true;
            st.flags._f763SleepAdjust = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😴 '早睡早起,精神百倍。' 心情+18。", "info");
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
