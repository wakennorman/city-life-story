/**
 * 域F(UI/UX) 联动增强 R662
 * 桥接：
 *   F→A  f650_ui_market_intelligence_v3  市场情报v3 → 消费 state.trade+state.goods 数据,
 *     UI→"市场数据一目了然"数据回响
 *   F→B  f650_ui_event_memory_wall_v7  事件记忆墙v7 → 消费 state.flags._eventHistory 数据,
 *     UI→"往事值得被铭记"叙事回响
 *   F→G  f650_ui_wellbeing_tracker  幸福追踪 → 消费 state.player+state.needs 数据,
 *     UI→"幸福数据一目了然"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR662Loaded) return;
  RANDOM_EVENTS._domainFLinkageR662Loaded = true;

  var EVENTS = [
    {
      id: "f650_ui_market_intelligence_v3", phase: "street", _isChainEvent: false, icon: "📊",
      title: "市场数据一目了然",
      story: "你开始用市场情报面板来追踪商品价格——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 1, excludeFlags: ["_f650MarketDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f650MarketDone) return false;
        return st.trade && st.trade.supplyDemand;
      },
      choices: [
        { text: "📈 深度分析", hint: "智力+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f650MarketDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '市场数据,一目了然。' 你制作了市场情报面板。智力+5,心智+3。", "success");
        }},
        { text: "🎯 制定策略", hint: "管理XP+4,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f650MarketDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '有数据,才能制定好策略。' 你制定了市场策略。管理XP+4,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始用市场情报面板来追踪商品价格——'市场数据,一目了然,决策更清晰。'";
      }
    },
    {
      id: "f650_ui_event_memory_wall_v7", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "往事值得被铭记",
      story: "你翻看旧日的事件记录,仿佛在看一部自己的人生电影——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 1, excludeFlags: ["_f650WallDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f650WallDone) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 50;
      },
      choices: [
        { text: "📖 回顾往事", hint: "心情+8,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f650WallDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '回顾走过的路,是为了更好地向前。' 你翻看旧日记忆。心情+8,心智+4。", "success");
        }},
        { text: "🎯 向前看", hint: "心智+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f650WallDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '往事不恋,未来可期。' 你选择向前看。心智+6。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var hist = st.flags._eventHistory || [];
        return "你翻看旧日的事件记录——" + hist.length + "段经历,仿佛在看一部自己的人生电影。'往事值得被铭记。'";
      }
    },
    {
      id: "f650_ui_wellbeing_tracker", phase: "street", _isChainEvent: false, icon: "💖",
      title: "幸福数据一目了然",
      story: "你开始用幸福追踪来管理自己的心情——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 1, excludeFlags: ["_f650WellDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f650WellDone) return false;
        var happy = (st.needs && st.needs.happiness) || 50;
        return happy < 45;
      },
      choices: [
        { text: "🧘 调整心情", hint: "心情+8,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f650WellDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 '幸福是一种能力。' 你调整了心情。心情+8,心智+5。", "success");
        }},
        { text: "😌 顺其自然", hint: "心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f650WellDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 '心态好,身体自然好。' 你选择顺其自然。心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var happy = (st.needs && st.needs.happiness) || 50;
        return "你开始用幸福追踪来管理自己的心情——心情" + Math.round(happy) + "%,'幸福数据一目了然。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
