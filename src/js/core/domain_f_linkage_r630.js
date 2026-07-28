/**
 * 域F(UI/UX) 联动增强 R630
 * 桥接：
 *   F→B  f630_event_memory_wall  事件记忆墙 → 消费 state.flags._eventHistory 数据,
 *     UI→"往事值得被记住"叙事回响
 *   F→E  f630_portfolio_snapshot  投资组合快照 → 消费 state.investment+state.resources 数据,
 *     UI→"一页看清所有资产"经济回响
 *   F→G  f630_health_dashboard_v2  健康仪表盘v2 → 消费 state.status+state.needs+state.player 数据,
 *     UI→"健康数据一目了然"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR630Loaded) return;
  RANDOM_EVENTS._domainFLinkageR630Loaded = true;

  var EVENTS = [
    {
      id: "f630_event_memory_wall", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "事件记忆墙",
      story: "那些经历过的事,值得被铭记——{desc}",
      triggers: { minDay: 80, interval: 150, maxRepeats: 2, excludeFlags: ["_f630MemoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f630MemoryCooldown) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 10;
      },
      choices: [
        { text: "📖 回顾往事", hint: "心情+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f630MemoryCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '回顾走过的路,是为了更好地向前。' 你翻看旧日记忆,感触良多。心情+5,心智+3。", "success");
        }},
        { text: "🎯 向前看", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f630MemoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '往事不恋,未来可期。' 你选择向前看。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var hist = st.flags._eventHistory || [];
        return "那些经历过的事,值得被铭记——" + hist.length + "条事件记录,是你在城市中活过的证明。";
      }
    },
    {
      id: "f630_portfolio_snapshot", phase: "street", _isChainEvent: false, icon: "📊",
      title: "投资组合快照",
      story: "一页看清所有资产,是理财的基本功——{desc}",
      triggers: { minDay: 100, interval: 120, maxRepeats: 2, excludeFlags: ["_f630SnapshotCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f630SnapshotCooldown) return false;
        return st.investment && (st.investment.stockHoldings || st.investment.btcHoldings);
      },
      choices: [
        { text: "📈 资产健康", hint: "心智+4,会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f630SnapshotCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '清楚自己的家底,才能做出好决策。' 你梳理了资产组合。心智+4,会计XP+3。", "success");
        }},
        { text: "💡 优化配置", hint: "智力+3,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f630SnapshotCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '分散风险,稳健增长。' 你思考了优化方案。智力+3,管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var stocks = (st.investment && st.investment.stockHoldings) ? st.investment.stockHoldings.length : 0;
        var btc = (st.investment && st.investment.btcHoldings) || 0;
        return "一页看清所有资产——持有" + stocks + "只股票" + (btc > 0 ? ",BTC持仓" + btc + "枚" : "") + "。'清楚自己的家底,才能做出好决策。'";
      }
    },
    {
      id: "f630_health_dashboard_v2", phase: "street", _isChainEvent: false, icon: "❤️",
      title: "健康仪表盘",
      story: "健康数据一目了然,是自我管理的第一步——{desc}",
      triggers: { minDay: 60, interval: 100, maxRepeats: 2, excludeFlags: ["_f630HealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f630HealthCooldown) return false;
        return st.status && st.status.health !== undefined;
      },
      choices: [
        { text: "🏃 制定健康计划", hint: "心智+5,置_f630HealthPlan", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f630HealthCooldown = true;
          st.flags._f630HealthPlan = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 '身体是革命的本钱。' 你制定了健康计划。心智+5。", "success");
        }},
        { text: "😌 顺其自然", hint: "心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f630HealthCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 '心态好,身体自然好。' 你选择顺其自然。心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 0;
        var happiness = (st.needs && st.needs.happiness) || 0;
        return "健康仪表盘——健康" + Math.round(health) + "%,心情" + Math.round(happiness) + "%。'健康数据一目了然,是自我管理的第一步。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
