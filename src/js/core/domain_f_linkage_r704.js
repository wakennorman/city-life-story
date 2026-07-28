/**
 * 域F(UI/UX) 联动增强 R704
 * 桥接：
 *   F→A  f704_wealth_dashboard_v3      财富仪表盘v3 → 消费 state.resources,
 *     财务数据可视化
 *   F→B  f704_event_memory_wall_v2    事件记忆墙v2 → 消费 state.flags._eventHistory,
 *     过往事件可视化
 *   F→G  f704_health_tracker_v3        健康追踪v3 → 消费 state.status+state.needs,
 *     综合健康管理
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR704Loaded) return;
  RANDOM_EVENTS._domainFLinkageR704Loaded = true;

  function eventCount(st) {
    return (st && st.flags && st.flags._eventHistory) ? st.flags._eventHistory.length : 0;
  }

  var EVENTS = [
    {
      id: "f704_wealth_dashboard_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "财富仪表盘",
      story: "你的财务状况一目了然",
      triggers: { minDay: 70, interval: 90, maxRepeats: 3, excludeFlags: ["_f704WealthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._f704WealthCd) return false;
        return st.player && st.player.day >= 70;
      },
      choices: [
        {
          text: "📊 详细复盘",
          hint: "会计XP+5,智力+3,置_f704Review",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f704WealthCd = true;
            st.flags._f704Review = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据是发现规律的眼睛。会计XP+5,智力+3。", "success");
            }
          }
        },
        {
          text: "⚡ 快速扫一眼",
          hint: "智力+2,置_f704Glance",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f704WealthCd = true;
            st.flags._f704Glance = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("⚡ 大方向没问题就行。智力+2。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        return "存款¥" + cash + "——'看着仪表盘,今天该关注哪个指标?'";
      }
    },
    {
      id: "f704_event_memory_wall_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🖼️",
      title: "事件记忆墙",
      story: "那些刻骨铭心的时刻值得被铭记",
      triggers: { minDay: 80, interval: 100, maxRepeats: 3, excludeFlags: ["_f704WallCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._f704WallCd) return false;
        return eventCount(st) >= 10 && st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "📖 回顾往事",
          hint: "心智+5,心情+5,置_f704Nostalgia",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f704WallCd = true;
            st.flags._f704Nostalgia = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 回忆是最美的礼物。心智+5,心情+5。", "success");
            }
          }
        },
        {
          text: "🎯 向前看",
          hint: "智力+4,置_f704Forward",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f704WallCd = true;
            st.flags._f704Forward = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 过去是参考,不是枷锁。智力+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "已经经历了" + eventCount(st) + "个事件——'如果有一面墙,每一块砖都是一段回忆。'";
      }
    },
    {
      id: "f704_health_tracker_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "💚",
      title: "健康追踪",
      story: "你的健康数据一目了然",
      triggers: { minDay: 50, interval: 70, maxRepeats: 3, excludeFlags: ["_f704HealthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._f704HealthCd) return false;
        return st.player && st.player.day >= 50;
      },
      choices: [
        {
          text: "🏃 制定运动计划",
          hint: "健康+5,心智+3,置_f704Exercise",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f704HealthCd = true;
            st.flags._f704Exercise = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 身体是革命的本钱。健康+5,心智+3。", "success");
            }
          }
        },
        {
          text: "😴 关注睡眠",
          hint: "健康+3,心情+6,置_f704Sleep",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f704HealthCd = true;
            st.flags._f704Sleep = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😴 睡好觉,一切都好。健康+3,心情+6。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 0;
        return "健康" + health + "%——'看着仪表盘,今天该关注哪个指标?'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
