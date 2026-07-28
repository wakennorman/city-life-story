/**
 * 域F(UI/UX) 联动增强 R727 (第三轮循环)
 * 桥接：
 *   F→A  f727_data_story_v5 数据故事v5 → 消费 jobs/skills/wealth 数据
 *   F→B  f727_event_memory_v5 事件记忆墙v5 → 消费 events_core+news 数据
 *   F→G  f727_health_tracker_v5 健康追踪v5 → 消费 status/needs 数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR727Loaded) return;
  RANDOM_EVENTS._domainFLinkageR727Loaded = true;

  var EVENTS = [
    {
      id: "f727_data_story_v5", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据故事",
      story: "你的数据正在讲述故事——{desc}",
      triggers: { minDay: 180, interval: 240, maxRepeats: 3, excludeFlags: ["_f727DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f727DataCd) return false;
        return st.player && st.player.day >= 180 && st.skills;
      },
      choices: [
        {
          text: "📈 回顾成长轨迹", hint: "心智+7,置_f727GrowthReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f727DataCd = true;
            st.flags._f727GrowthReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据背后,是成长的足迹。' 心智+7。", "success");
            }
          }
        },
        {
          text: "🎯 设定数据目标", hint: "智力+6,置_f727DataGoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f727DataCd = true;
            st.flags._f727DataGoalSetter = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,数据才有意义。' 智力+6。", "info");
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
      id: "f727_event_memory_v5", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "事件记忆墙",
      story: "你经历的事件正在组成记忆墙——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 3, excludeFlags: ["_f727MemoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f727MemoryCd) return false;
        return st.player && st.player.day >= 200;
      },
      choices: [
        {
          text: "📜 回顾重要事件", hint: "心智+7,置_f727EventReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f727MemoryCd = true;
            st.flags._f727EventReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🖼️ '记忆,是人生最珍贵的财富。' 心智+7。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+8,置_f727LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f727MemoryCd = true;
            st.flags._f727LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 8); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '书写,让记忆永存。' 社交XP+8。", "info");
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
      id: "f727_health_tracker_v5", phase: "street", _isChainEvent: false, icon: "💚",
      title: "健康追踪",
      story: "你的健康状况需要持续关注——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 4, excludeFlags: ["_f727HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f727HealthCd) return false;
        return st.status && st.needs && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "🏃 制定健康计划", hint: "健康+6,疲劳-9,置_f727HealthPlan",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f727HealthCd = true;
            st.flags._f727HealthPlan = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 6);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 9);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '健康,需要持续管理。' 健康+6,疲劳-9。", "success");
            }
          }
        },
        {
          text: "😴 调整作息", hint: "心情+9,置_f727SleepAdjust",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f727HealthCd = true;
            st.flags._f727SleepAdjust = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 9);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😴 '早睡早起,精神百倍。' 心情+9。", "info");
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
