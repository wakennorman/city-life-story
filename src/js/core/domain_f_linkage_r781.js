/**
 * 域F(UI/UX) 联动增强 R781 (第十轮循环)
 * 桥接：
 *   F→A  f781_data_story_v11 数据故事v11 → 消费 jobs/skills/wealth 数据
 *   F→B  f781_event_memory_v11 事件记忆墙v11 → 消费 events_core+news 数据
 *   F→G  f781_health_tracker_v11 健康追踪v11 → 消费 status/needs 数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR781Loaded) return;
  RANDOM_EVENTS._domainFLinkageR781Loaded = true;

  var EVENTS = [
    {
      id: "f781_data_story_v11", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据故事",
      story: "你的数据正在讲述故事——{desc}",
      triggers: { minDay: 1200, interval: 1300, maxRepeats: 3, excludeFlags: ["_f781DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f781DataCd) return false;
        return st.player && st.player.day >= 1200 && st.skills;
      },
      choices: [
        {
          text: "📈 回顾成长轨迹", hint: "心智+20,置_f781GrowthReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f781DataCd = true;
            st.flags._f781GrowthReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据背后,是成长的足迹。' 心智+20。", "success");
            }
          }
        },
        {
          text: "🎯 设定数据目标", hint: "智力+18,置_f781DataGoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f781DataCd = true;
            st.flags._f781DataGoalSetter = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,数据才有意义。' 智力+18。", "info");
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
      id: "f781_event_memory_v11", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "事件记忆墙",
      story: "你经历的事件正在组成记忆墙——{desc}",
      triggers: { minDay: 1100, interval: 1200, maxRepeats: 3, excludeFlags: ["_f781MemoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f781MemoryCd) return false;
        return st.player && st.player.day >= 1100;
      },
      choices: [
        {
          text: "📜 回顾重要事件", hint: "心智+20,置_f781EventReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f781MemoryCd = true;
            st.flags._f781EventReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🖼️ '记忆,是人生最珍贵的财富。' 心智+20。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+20,置_f781LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f781MemoryCd = true;
            st.flags._f781LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '书写,让记忆永存。' 社交XP+20。", "info");
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
      id: "f781_health_tracker_v11", phase: "street", _isChainEvent: false, icon: "💚",
      title: "健康追踪",
      story: "你的健康状况需要持续关注——{desc}",
      triggers: { minDay: 1000, interval: 1100, maxRepeats: 4, excludeFlags: ["_f781HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f781HealthCd) return false;
        return st.status && st.needs && st.player && st.player.day >= 1000;
      },
      choices: [
        {
          text: "🏃 制定健康计划", hint: "健康+18,疲劳-25,置_f781HealthPlan",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f781HealthCd = true;
            st.flags._f781HealthPlan = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '健康,需要持续管理。' 健康+18,疲劳-25。", "success");
            }
          }
        },
        {
          text: "😴 调整作息", hint: "心情+25,置_f781SleepAdjust",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f781HealthCd = true;
            st.flags._f781SleepAdjust = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😴 '早睡早起,精神百倍。' 心情+25。", "info");
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
