/**
 * 域E(经济/投资) 联动增强 R462（第二十三轮循环·续）
 * 桥接：
 *   E→F  e462_invest_dashboard   投资仪表盘 → 消费 investment 数据,
 *     资产组合→"你的钱都在哪"的UI情报
 *   E→B  e462_invest_story       投资故事 → 消费 investment+flags 数据,
 *     投资浮沉→"你的投资人生"的叙事回响
 *   E→A  e462_invest_data        投资数据沉淀 → 消费 investment 数据,
 *     投资记录→"你的投资风格"的数据画像
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR462Loaded) return;
  RANDOM_EVENTS._domainELinkageR462Loaded = true;

  var EVENTS = [
    {
      id: "e462_invest_dashboard", phase: "street", _isChainEvent: false, icon: "📊",
      title: "资产一览",
      story: "你打开投资账户，看了看自己的资产分布——{desc}",
      triggers: { minDay: 40, interval: 70, maxRepeats: 4, excludeFlags: ["_e462DashCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var inv = st.investment;
        var hasAny = (inv.stockHoldings && inv.stockHoldings.length > 0) || (inv.properties && inv.properties.length > 0) || (inv.btcHoldings && inv.btcHoldings.length > 0);
        return hasAny && (st.flags && !st.flags._e462DashCooldown);
      },
      choices: [
        { text: "📈 分析集中度", hint: "会计XP+3,智力+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e462DashCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你分析了资产的集中度——'不要把鸡蛋放在一个篮子里。' 会计XP+3,智力+1。", "success");
        }},
        { text: "🎯 设定止损线", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e462DashCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你给每笔投资设定了止损线——'纪律是投资的生命线。' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var inv = st.investment;
        var stockCount = inv && inv.stockHoldings ? inv.stockHoldings.length : 0;
        var propCount = inv && inv.properties ? inv.properties.length : 0;
        var btcCount = inv && inv.btcHoldings ? inv.btcHoldings.length : 0;
        return "你打开投资账户——持有" + stockCount + "只股票、" + propCount + "套房产" + (btcCount > 0 ? "、还有比特币" : "") + "。资产分布一目了然。";
      }
    },
    {
      id: "e462_invest_story", phase: "street", _isChainEvent: false, icon: "📖",
      title: "投资人生",
      story: "你回顾了自己的投资历程——{desc}",
      triggers: { minDay: 60, interval: 100, maxRepeats: 3, excludeFlags: ["_e462StoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.flags) return false;
        var profit = st.investment._totalInvestmentProfit || 0;
        return (profit > 0 || profit < 0) && (st.flags && !st.flags._e462StoryCooldown);
      },
      choices: [
        { text: "😌 知足常乐", hint: "心情+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e462StoryCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 你选择了知足常乐——'赚多赚少，心态最重要。' 心情+5,心智+2。", "success");
        }},
        { text: "🔥 越战越勇", hint: "现金+500,风险+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e462StoryCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 500;
          if (st.player) st.player.risk = Math.min(100, (st.player.risk || 0) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔥 你决定越战越勇——'投资如逆水行舟，不进则退。' 现金+500,风险+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var profit = st.investment && st.investment._totalInvestmentProfit ? st.investment._totalInvestmentProfit : 0;
        if (profit > 0) return "你的投资目前盈利¥" + profit.toLocaleString() + "——从最初的小额试水到现在的投资组合，每一步都是学习。";
        return "你的投资目前亏损¥" + Math.abs(profit).toLocaleString() + "——投资有风险，但每一次跌倒都是成长的代价。";
      }
    },
    {
      id: "e462_invest_data", phase: "street", _isChainEvent: false, icon: "🧮",
      title: "投资风格",
      story: "你分析了过往的交易记录——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 3, excludeFlags: ["_e462DataCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.investment.tradeLog) return false;
        return st.investment.tradeLog.length >= 5 && (st.flags && !st.flags._e462DataCooldown);
      },
      choices: [
        { text: "📊 总结规律", hint: "智力+2,会计XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e462DataCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你总结了交易规律——'历史不会重复，但会押韵。' 智力+2,会计XP+4。", "success");
        }},
        { text: "🎲 保持灵活", hint: "心智+2,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e462DataCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎲 你决定保持灵活——'市场唯一不变的是变化本身。' 心智+2,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = st.investment && st.investment.tradeLog ? st.investment.tradeLog.length : 0;
        return "你分析了过往" + n + "笔交易记录——每一次买卖都是一次决策，这些决策定义了你的投资风格。";
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
