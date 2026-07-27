/**
 * 域F(UI/UX) 联动增强 R476
 * 桥接：
 *   F→H  f476_corp_dashboard_v2   公司仪表盘v2 → 消费 corporate 数据,
 *     经营面板→"公司健康状况"的仪表盘叙事
 *   F→B  f476_event_memory_wall   事件记忆墙 → 消费 flags 数据,
 *     事件记录→"那些值得记住的日子"的回忆墙
 *   F→E  f476_invest_tracker      投资追踪器 → 消费 investment 数据,
 *     投资记录→"你的投资足迹"的追踪面板
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR476Loaded) return;
  RANDOM_EVENTS._domainFLinkageR476Loaded = true;

  var EVENTS = [
    {
      id: "f476_corp_dashboard_v2", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "公司健康度",
      story: "你打开公司的运营仪表盘——{desc}",
      triggers: { minDay: 50, interval: 90, maxRepeats: 5, excludeFlags: ["_f476CorpDashboardCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._f476CorpDashboardCooldown);
      },
      choices: [
        { text: "🔍 分析关键指标", hint: "管理XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f476CorpDashboardCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了仪表盘上的关键指标——'营收在涨，但成本涨得更快，得优化了。' 管理XP+5,心智+2。", "success");
        }},
        { text: "📈 关注增长趋势", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f476CorpDashboardCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你重点关注了公司的增长趋势——'方向对了，增长是水到渠成的事。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你打开公司的运营仪表盘——营收、成本、利润、团队规模，一目了然。数据不会骗人。";
      }
    },
    {
      id: "f476_event_memory_wall", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "记忆墙",
      story: "你翻看手机里存下的照片和记录——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_f476MemoryWallCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f476MemoryWallCooldown);
      },
      choices: [
        { text: "🖼️ 整理成相册", hint: "心情+3,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f476MemoryWallCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🖼️ 你把照片整理成了相册——每一张都是回忆，每一段回忆都是人生。心情+3,心智+1。", "success");
        }},
        { text: "📝 写篇总结", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f476MemoryWallCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🖼️ 你写了一篇总结——'这些经历，都是我的财富。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你翻看手机里存下的照片和记录——那些走过的路、见过的人、经历的事，都是你的人生记忆墙。";
      }
    },
    {
      id: "f476_invest_tracker", phase: "corporate", _isChainEvent: false, icon: "📈",
      title: "投资足迹",
      story: "你查看自己的投资历史记录——{desc}",
      triggers: { minDay: 40, interval: 60, maxRepeats: 5, excludeFlags: ["_f476InvestTrackerCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        return (st.flags && !st.flags._f476InvestTrackerCooldown);
      },
      choices: [
        { text: "📈 复盘得失", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f476InvestTrackerCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你复盘了过去的投资——'赚在哪、亏在哪，清清楚楚。' 会计XP+5,心智+2。", "success");
        }},
        { text: "📝 调整策略", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f476InvestTrackerCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你根据历史数据调整了投资策略——'同样的错误，不能犯两次。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你查看自己的投资历史记录——每次买入卖出，都是当时认知的体现。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();