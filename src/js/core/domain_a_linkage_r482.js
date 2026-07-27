/**
 * 域A(数据/数值平衡) 联动增强 R482（第五轮循环·续）
 * 桥接：
 *   A→E  a482_market_invest_bridge  市场投资桥接 → 消费 pricing+investment 数据,
 *     价格→"市场在告诉你什么"的投资意识
 *   A→F  a482_data_visualization    数据可视化 → 消费 stats 数据,
 *     数据→"你的数字长什么样"的UI展示
 *   a482_economy_cycle(G→B 经济周期叙事): economy→"经济在哪个阶段"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR482Loaded) return;
  RANDOM_EVENTS._domainALinkageR482Loaded = true;

  var EVENTS = [
    {
      id: "a482_market_invest_bridge", phase: "street", _isChainEvent: false, icon: "📈",
      title: "市场在说话",
      story: "你从市场价格中读出了投资信号——{desc}",
      triggers: { minDay: 50, interval: 80, maxRepeats: 4, excludeFlags: ["_a482MarketBridgeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.trade || !st.investment) return false;
        return (st.flags && !st.flags._a482MarketBridgeCooldown);
      },
      choices: [
        { text: "📊 跟随市场", hint: "现金+200~500,风险+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a482MarketBridgeCooldown = true;
          var profit = typeof Random !== "undefined" ? Random.int(200, 500) : 350;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + profit;
          if (st.player) st.player.risk = Math.min(100, (st.player.risk || 0) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你跟随了市场信号——'市场永远是对的。' 现金+" + profit + "。", "success");
        }},
        { text: "🧘 独立判断", hint: "智力+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a482MarketBridgeCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 你选择独立判断——'市场先生是你的仆人，不是你的主人。' 智力+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你从市场价格中读出了投资信号——价格波动背后是供需关系，供需关系背后是人性。";
      }
    },
    {
      id: "a482_data_visualization", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据可视化",
      story: "你把自己的数据做成了图表——{desc}",
      triggers: { minDay: 40, interval: 60, maxRepeats: 5, excludeFlags: ["_a482VizCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.resources) return false;
        return (st.flags && !st.flags._a482VizCooldown);
      },
      choices: [
        { text: "📈 趋势图", hint: "智力+2,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a482VizCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你画了趋势图——'一图胜千言。' 智力+2,会计XP+2。", "success");
        }},
        { text: "🎯 目标追踪", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a482VizCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你做了目标追踪——'有可视化才有执行力。' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var totalEarned = st.resources && st.resources.totalEarned ? st.resources.totalEarned : 0;
        return "你把自己的数据做成了图表——累计赚取¥" + totalEarned.toLocaleString() + "。数字变成图表，故事就清楚了。";
      }
    },
    {
      id: "a482_economy_cycle", phase: "street", _isChainEvent: false, icon: "🔄",
      title: "经济周期",
      story: "你感受到了经济周期的脉动——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 3, excludeFlags: ["_a482CycleCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.economy) return false;
        return (st.flags && !st.flags._a482CycleCooldown);
      },
      choices: [
        { text: "📊 分析周期阶段", hint: "智力+3,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a482CycleCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了经济周期——'知己知彼，百战不殆。' 智力+3,会计XP+2。", "success");
        }},
        { text: "💪 专注自身", hint: "全技能XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a482CycleCooldown = true;
          var skills = ["accounting", "management", "sales", "coding", "trade"];
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 2); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 你决定专注自身——'打铁还需自身硬。' 全技能XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cycle = st.economy && st.economy.cycle ? st.economy.cycle : "normal";
        var desc = cycle === "boom" ? "经济一片繁荣，到处是机会。" : cycle === "recession" ? "经济寒冬，到处是挑战。" : "经济平稳，暗流涌动。";
        return desc + "你开始思考——在这个经济周期里，该怎么管好自己的钱？";
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
