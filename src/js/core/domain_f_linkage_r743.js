/**
 * 域F(UI/UX) 联动增强 R743 (第五轮循环)
 * 桥接：
 *   F→A  f743_data_story_v7 数据故事v7 → 消费 jobs/skills/wealth 数据
 *   F→B  f743_event_memory_v7 事件记忆墙v7 → 消费 events_core+news 数据
 *   F→G  f743_health_tracker_v7 健康追踪v7 → 消费 status/needs 数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR743Loaded) return;
  RANDOM_EVENTS._domainFLinkageR743Loaded = true;

  var EVENTS = [
    {
      id: "f743_data_story_v7", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据故事",
      story: "你的数据正在讲述故事——{desc}",
      triggers: { minDay: 365, interval: 400, maxRepeats: 3, excludeFlags: ["_f743DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f743DataCd) return false;
        return st.player && st.player.day >= 365 && st.skills;
      },
      choices: [
        {
          text: "📈 回顾成长轨迹", hint: "心智+10,置_f743GrowthReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f743DataCd = true;
            st.flags._f743GrowthReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据背后,是成长的足迹。' 心智+10。", "success");
            }
          }
        },
        {
          text: "🎯 设定数据目标", hint: "智力+8,置_f743DataGoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f743DataCd = true;
            st.flags._f743DataGoalSetter = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,数据才有意义。' 智力+8。", "info");
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
      id: "f743_event_memory_v7", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "事件记忆墙",
      story: "你经历的事件正在组成记忆墙——{desc}",
      triggers: { minDay: 300, interval: 365, maxRepeats: 3, excludeFlags: ["_f743MemoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f743MemoryCd) return false;
        return st.player && st.player.day >= 300;
      },
      choices: [
        {
          text: "📜 回顾重要事件", hint: "心智+10,置_f743EventReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f743MemoryCd = true;
            st.flags._f743EventReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🖼️ '记忆,是人生最珍贵的财富。' 心智+10。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+10,置_f743LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f743MemoryCd = true;
            st.flags._f743LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '书写,让记忆永存。' 社交XP+10。", "info");
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
      id: "f743_health_tracker_v7", phase: "street", _isChainEvent: false, icon: "💚",
      title: "健康追踪",
      story: "你的健康状况需要持续关注——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 4, excludeFlags: ["_f743HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f743HealthCd) return false;
        return st.status && st.needs && st.player && st.player.day >= 250;
      },
      choices: [
        {
          text: "🏃 制定健康计划", hint: "健康+8,疲劳-12,置_f743HealthPlan",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f743HealthCd = true;
            st.flags._f743HealthPlan = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 8);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '健康,需要持续管理。' 健康+8,疲劳-12。", "success");
            }
          }
        },
        {
          text: "😴 调整作息", hint: "心情+12,置_f743SleepAdjust",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f743HealthCd = true;
            st.flags._f743SleepAdjust = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😴 '早睡早起,精神百倍。' 心情+12。", "info");
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
