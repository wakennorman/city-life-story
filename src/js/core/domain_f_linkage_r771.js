/**
 * 域F(UI/UX) 联动增强 R771 (第九轮循环)
 * 桥接：
 *   F→A  f771_data_story_v10 数据故事v10 → 消费 jobs/skills/wealth 数据
 *   F→B  f771_event_memory_v10 事件记忆墙v10 → 消费 events_core+news 数据
 *   F→G  f771_health_tracker_v10 健康追踪v10 → 消费 status/needs 数据
 *
 * [全系统自洽修复] R771 A类#1: minDay 1000/900/700过高→降至160/200/120(事件不可达)
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR771Loaded) return;
  RANDOM_EVENTS._domainFLinkageR771Loaded = true;

  var EVENTS = [
    {
      id: "f771_data_story_v10", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据故事",
      story: "你的数据正在讲述故事——{desc}",
      triggers: { minDay: 160, interval: 220, maxRepeats: 3, excludeFlags: ["_f771DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f771DataCd) return false;
        return st.player && st.player.day >= 160 && st.skills;
      },
      choices: [
        {
          text: "📈 回顾成长轨迹", hint: "心智+18,置_f771GrowthReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f771DataCd = true;
            st.flags._f771GrowthReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据背后,是成长的足迹。' 心智+18。", "success");
            }
          }
        },
        {
          text: "🎯 设定数据目标", hint: "智力+15,置_f771DataGoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f771DataCd = true;
            st.flags._f771DataGoalSetter = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,数据才有意义。' 智力+15。", "info");
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
      id: "f771_event_memory_v10", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "事件记忆墙",
      story: "你经历的事件正在组成记忆墙——{desc}",
      triggers: { minDay: 200, interval: 260, maxRepeats: 3, excludeFlags: ["_f771MemoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f771MemoryCd) return false;
        return st.player && st.player.day >= 200;
      },
      choices: [
        {
          text: "📜 回顾重要事件", hint: "心智+18,置_f771EventReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f771MemoryCd = true;
            st.flags._f771EventReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🖼️ '记忆,是人生最珍贵的财富。' 心智+18。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+18,置_f771LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f771MemoryCd = true;
            st.flags._f771LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '书写,让记忆永存。' 社交XP+18。", "info");
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
      id: "f771_health_tracker_v10", phase: "street", _isChainEvent: false, icon: "💚",
      title: "健康追踪",
      story: "你的健康状况需要持续关注——{desc}",
      triggers: { minDay: 120, interval: 200, maxRepeats: 4, excludeFlags: ["_f771HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f771HealthCd) return false;
        return st.status && st.needs && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "🏃 制定健康计划", hint: "健康+15,疲劳-20,置_f771HealthPlan",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f771HealthCd = true;
            st.flags._f771HealthPlan = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 15);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '健康,需要持续管理。' 健康+15,疲劳-20。", "success");
            }
          }
        },
        {
          text: "😴 调整作息", hint: "心情+20,置_f771SleepAdjust",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f771HealthCd = true;
            st.flags._f771SleepAdjust = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😴 '早睡早起,精神百倍。' 心情+20。", "info");
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
    },

    // ===== F→D: 社交发现UI =====
    {
      id: "f771_social_discovery_v10", phase: "street", _isChainEvent: false, icon: "👥",
      title: "社交发现",
      story: "你的社交圈子在你的生活中逐渐浮现——{desc}",
      triggers: { minDay: 90, interval: 200, maxRepeats: 3, excludeFlags: ["_f771SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f771SocialCd) return false;
        return st.player && st.player.day >= 90 && st.relationships;
      },
      choices: [
        {
          text: "👋 主动结识新朋友", hint: "社交XP+15,魅力+10,置_f771Socializer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f771SocialCd = true;
            st.flags._f771Socializer = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 10);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("👥 '每一次相遇,都是人生的礼物。' 社交XP+15,魅力+10。", "success");
            }
          }
        },
        {
          text: "💬 维系现有关系", hint: "心智+12,置_f771RelationKeeper",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f771SocialCd = true;
            st.flags._f771RelationKeeper = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💬 '真正的朋友,不在于多,而在于深。' 心智+12。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var metCount = 0;
        if (st.relationships) { for (var rid in st.relationships) { if (st.relationships[rid] && st.relationships[rid].met) metCount++; } }
        return "你已结识" + metCount + "位朋友——'社交网络,是你最宝贵的财富之一。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
