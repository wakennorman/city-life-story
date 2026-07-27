/**
 * 域A(数据/数值平衡) 联动增强 R460（第三轮循环·续）
 * 桥接：
 *   A→F  a460_price_forecast     价格预测UI → 消费 pricing 数据,
 *     市场价格→"明天会涨还是跌"的UI情报
 *   A→E  a460_market_arbitrage   市场套利 → 消费 pricing+investment 数据,
 *     价格差→"低买高卖"的投资意识觉醒
 *   A→G  a460_economy_lifecycle  经济生命周期 → 消费 economy_v3.1 数据,
 *     经济周期→"人生与周期共振"的生命叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR460Loaded) return;
  RANDOM_EVENTS._domainALinkageR460Loaded = true;

  var EVENTS = [
    {
      id: "a460_price_forecast", phase: "street", _isChainEvent: false, icon: "📉",
      title: "价格风向",
      story: "你分析了最近的市场价格走势——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 5, excludeFlags: ["_a460ForecastCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.trade || !st.trade.visitedLocations || st.trade.visitedLocations.length < 2) return false;
        return (st.flags && !st.flags._a460ForecastCooldown);
      },
      choices: [
        { text: "📊 记录价格规律", hint: "智力+2,销售XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a460ForecastCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你记录了不同地点的价格差异——'知己知彼，百战不殆。' 智力+2,销售XP+3。", "success");
        }},
        { text: "🗺️ 规划最优路线", hint: "会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a460ForecastCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🗺️ 你在地图上标注了最优买卖路线——'时间就是金钱。' 会计XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var visited = st.trade && st.trade.visitedLocations ? st.trade.visitedLocations.length : 0;
        return "你跑遍了" + visited + "个地点，记录了每种商品的价格。数据在手，你开始看出一些规律——什么时候买、在哪里卖，都有讲究。";
      }
    },
    {
      id: "a460_market_arbitrage", phase: "street", _isChainEvent: false, icon: "💰",
      title: "套利机会",
      story: "你发现了一个低买高卖的机会——{desc}",
      triggers: { minDay: 50, interval: 90, maxRepeats: 3, excludeFlags: ["_a460ArbitrageCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.trade || !st.trade.visitedLocations || st.trade.visitedLocations.length < 2) return false;
        if ((st.resources && st.resources.cash || 0) < 500) return false;
        return (st.flags && !st.flags._a460ArbitrageCooldown);
      },
      choices: [
        { text: "💨 快进快出", hint: "现金+300~800,风险+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a460ArbitrageCooldown = true;
          var profit = typeof Random !== "undefined" ? Random.int(300, 800) : 500;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + profit;
          if (st.player) st.player.risk = Math.min(100, (st.player.risk || 0) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💨 你快进快出赚了一笔——'天下武功，唯快不破。' 现金+" + profit + "。", "success");
        }},
        { text: "🐢 稳健倒货", hint: "现金+150~400,无风险", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a460ArbitrageCooldown = true;
          var profit = typeof Random !== "undefined" ? Random.int(150, 400) : 250;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + profit;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🐢 你稳健地倒了一手货——'稳中求进。' 现金+" + profit + "。", "success");
        }},
        { text: "🚫 不碰灰色地带", hint: "道德+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a460ArbitrageCooldown = true;
          if (st.player) { st.player.morality = Math.min(100, (st.player.morality || 50) + 3); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚫 你决定不碰灰色地带——'有些钱，不赚也罢。' 道德+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现了一个套利机会——同样的商品，不同地点价格差了好几成。这是市场给你的礼物，但也伴随着风险。";
      }
    },
    {
      id: "a460_economy_lifecycle", phase: "street", _isChainEvent: false, icon: "🔄",
      title: "周期之轮",
      story: "你感受到了经济周期的脉动——{desc}",
      triggers: { minDay: 60, interval: 100, maxRepeats: 3, excludeFlags: ["_a460CycleCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.economy) return false;
        return (st.flags && !st.flags._a460CycleCooldown);
      },
      choices: [
        { text: "🌱 低谷布局", hint: "心智+3,现金-200", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a460CycleCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌱 你在低谷时布局——'别人恐惧我贪婪。' 心智+3,现金-200。", "success");
        }},
        { text: "☀️ 高峰收割", hint: "现金+500,智力+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a460CycleCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 500;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("☀️ 你在高峰时收割——'顺势而为，落袋为安。' 现金+500,智力+1。", "success");
        }},
        { text: "🧘 不为所动", hint: "心情+5,健康+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a460CycleCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 你选择不为所动——'不以物喜，不以己悲。' 心情+5,健康+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cycle = st.economy && st.economy.cycle ? st.economy.cycle : "normal";
        var desc = cycle === "boom" ? "经济一片繁荣，但你知道繁荣不会永远持续。" : cycle === "recession" ? "经济寒冬，但冬天来了春天还会远吗？" : "经济平稳，但暗流涌动。";
        return desc + "你开始思考——在人生的不同阶段，该怎么与经济周期共舞？";
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
