/**
 * 域F(UI/UX) 联动增强 R688
 * 桥接：
 *   F→B  f688_event_memory_wall      事件记忆墙 → 消费 state.flags._eventHistory,
 *     将过往事件可视化展示
 *   F→D  f688_social_discovery       社交发现 → 消费 state.relationships,
 *     发现新的社交机会
 *   F→G  f688_health_dashboard_v2    健康仪表盘v2 → 消费 state.status+state.needs,
 *     综合健康数据可视化
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR688Loaded) return;
  RANDOM_EVENTS._domainFLinkageR688Loaded = true;

  function eventCount(st) {
    return (st && st.flags && st.flags._eventHistory) ? st.flags._eventHistory.length : 0;
  }

  function metNpcCount(st) {
    if (!st || !st.relationships) return 0;
    var cnt = 0;
    for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) cnt++; }
    return cnt;
  }

  var EVENTS = [
    {
      id: "f688_event_memory_wall",
      phase: "street",
      _isChainEvent: false,
      icon: "🖼️",
      title: "事件记忆墙",
      story: "那些刻骨铭心的时刻值得被铭记",
      triggers: { minDay: 80, interval: 100, maxRepeats: 3, excludeFlags: ["_f688WallCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._f688WallCd) return false;
        return eventCount(st) >= 10 && st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "📖 回顾往事",
          hint: "心智+5,心情+5,置_f688Nostalgia",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f688WallCd = true;
            st.flags._f688Nostalgia = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 回忆是最美的礼物。心智+5,心情+5。", "success");
            }
          }
        },
        {
          text: "🎯 向前看",
          hint: "智力+4,置_f688Forward",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f688WallCd = true;
            st.flags._f688Forward = true;
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
      id: "f688_social_discovery",
      phase: "street",
      _isChainEvent: false,
      icon: "🔍",
      title: "社交发现",
      story: "你发现了新的社交机会",
      triggers: { minDay: 60, interval: 80, maxRepeats: 3, excludeFlags: ["_f688DiscoverCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._f688DiscoverCd) return false;
        return metNpcCount(st) >= 1 && st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "👋 主动认识新朋友",
          hint: "社交XP+6,置_f688Extrovert",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f688DiscoverCd = true;
            st.flags._f688Extrovert = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("👋 多一个朋友,多一条路。社交XP+6。", "success");
            }
          }
        },
        {
          text: "🤫 享受现有圈子",
          hint: "心智+4,置_f688Content",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f688DiscoverCd = true;
            st.flags._f688Content = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤫 朋友不在多,在精。心智+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "已结识" + metNpcCount(st) + "个朋友——'这个城市里,还有多少有趣的人等着相遇?'";
      }
    },
    {
      id: "f688_health_dashboard_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💚",
      title: "健康仪表盘",
      story: "你的健康数据一目了然",
      triggers: { minDay: 50, interval: 70, maxRepeats: 3, excludeFlags: ["_f688DashCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._f688DashCd) return false;
        return st.player && st.player.day >= 50;
      },
      choices: [
        {
          text: "🏃 制定运动计划",
          hint: "健康+5,心智+3,置_f688Exercise",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f688DashCd = true;
            st.flags._f688Exercise = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 身体是革命的本钱。健康+5,心智+3。", "success");
            }
          }
        },
        {
          text: "😴 关注睡眠",
          hint: "健康+3,心情+6,置_f688Sleep",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f688DashCd = true;
            st.flags._f688Sleep = true;
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
        var happy = (st.needs && st.needs.happiness) || 0;
        return "健康" + health + "%,心情" + happy + "%——'看着仪表盘,今天该关注哪个指标?'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
