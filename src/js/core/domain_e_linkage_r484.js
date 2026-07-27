/**
 * 域E(经济/投资) 联动增强 R484（第二十六轮循环·续）
 * 桥接：
 *   E→F  e484_invest_tracker_ui    投资追踪UI → 消费 investment 数据,
 *     投资→"你的钱在怎么动"的UI展示
 *   E→E  e484_invest_journal       投资日记 → 消费 investment 数据,
 *     投资→"你的投资心路历程"的自叙事
 *   e484_crypto_narrative(E→B 加密货币叙事): btc→"数字黄金"的叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR484Loaded) return;
  RANDOM_EVENTS._domainELinkageR484Loaded = true;

  var EVENTS = [
    {
      id: "e484_invest_tracker_ui", phase: "street", _isChainEvent: false, icon: "📈",
      title: "投资追踪",
      story: "你追踪了自己的投资走势——{desc}",
      triggers: { minDay: 50, interval: 70, maxRepeats: 4, excludeFlags: ["_e484TrackerCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var inv = st.investment;
        return (inv.stockHoldings && inv.stockHoldings.length > 0) && (st.flags && !st.flags._e484TrackerCooldown);
      },
      choices: [
        { text: "📊 分析走势", hint: "会计XP+3,智力+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e484TrackerCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了投资走势——'趋势是你的朋友。' 会计XP+3,智力+1。", "success");
        }},
        { text: "🎯 调整策略", hint: "心智+3,风险-3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e484TrackerCooldown = true;
          if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 3); st.player.risk = Math.max(0, (st.player.risk || 0) - 3); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你调整了投资策略——'灵活应变。' 心智+3,风险-3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = st.investment && st.investment.stockHoldings ? st.investment.stockHoldings.length : 0;
        return "你追踪了自己的投资走势——持有" + n + "只股票。它们在怎么动？";
      }
    },
    {
      id: "e484_invest_journal", phase: "street", _isChainEvent: false, icon: "📔",
      title: "投资日记",
      story: "你写下了投资日记——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 3, excludeFlags: ["_e484JournalCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.investment.tradeLog) return false;
        return st.investment.tradeLog.length >= 5 && (st.flags && !st.flags._e484JournalCooldown);
      },
      choices: [
        { text: "📖 记录心路", hint: "心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e484JournalCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你写下了投资日记——'记录是最好的复盘。' 心智+4。", "success");
        }},
        { text: "🎯 制定纪律", hint: "管理XP+3,风险-5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e484JournalCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.player) st.player.risk = Math.max(0, (st.player.risk || 0) - 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你制定了投资纪律——'纪律胜于直觉。' 管理XP+3,风险-5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = st.investment && st.investment.tradeLog ? st.investment.tradeLog.length : 0;
        return "你写下了投资日记——已经记录了" + n + "笔交易。每一笔都是一次决策，每一次决策都值得记录。";
      }
    },
    {
      id: "e484_crypto_narrative", phase: "street", _isChainEvent: false, icon: "₿",
      title: "数字黄金",
      story: "你了解了加密货币的世界——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 3, excludeFlags: ["_e484CryptoCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.investment.btcHoldings) return false;
        return st.investment.btcHoldings.length >= 1 && (st.flags && !st.flags._e484CryptoCooldown);
      },
      choices: [
        { text: "📖 深入了解", hint: "智力+3,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e484CryptoCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你深入了解了加密货币——'了解你投资的东西。' 智力+3,会计XP+2。", "success");
        }},
        { text: "🧘 谨慎观望", hint: "心智+3,风险-3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e484CryptoCooldown = true;
          if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 3); st.player.risk = Math.max(0, (st.player.risk || 0) - 3); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 你选择谨慎观望——'不懂不投。' 心智+3,风险-3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你了解了加密货币的世界——有人暴富，有人血本无归。这是一场关于信念和风险的游戏。";
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
