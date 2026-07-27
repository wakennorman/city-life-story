/**
 * 域A(数据/数值平衡) 联动增强 R468（第四轮循环·续）
 * 桥接：
 *   A→C  a468_skill_market_price   技能市场价 → 消费 skills+jobs 数据,
 *     技能→"你的手艺在市场上值多少钱"
 *   A→B  a468_price_volatility     价格波动叙事 → 消费 pricing+news 数据,
 *     市场→"市场在传递什么信号"的叙事
 *   a468_economy_health(A→G 经济健康度): economy_v3.1→"城市经济还好吗"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR468Loaded) return;
  RANDOM_EVENTS._domainALinkageR468Loaded = true;

  var EVENTS = [
    {
      id: "a468_skill_market_price", phase: "street", _isChainEvent: false, icon: "💵",
      title: "手艺值多少",
      story: "你了解了市场上各技能的价值——{desc}",
      triggers: { minDay: 35, interval: 70, maxRepeats: 4, excludeFlags: ["_a468SkillPriceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills) return false;
        return (st.flags && !st.flags._a468SkillPriceCooldown);
      },
      choices: [
        { text: "📊 对比市场行情", hint: "智力+2,销售XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a468SkillPriceCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你对比了市场行情——'知己知彼，才能卖个好价钱。' 智力+2,销售XP+2。", "success");
        }},
        { text: "🎯 专攻高价技能", hint: "最高技能XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a468SkillPriceCooldown = true;
          var best = null, bestLv = -1;
          for (var k in st.skills) { var lv = st.skills[k] && st.skills[k].level ? st.skills[k].level : 0; if (lv > bestLv) { bestLv = lv; best = k; } }
          if (best && typeof addSkillXp === "function") { try { addSkillXp(best, 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你决定专攻高价技能——'一招鲜，吃遍天。' 最高技能XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你了解了市场上各技能的价值——有些技能供不应求，有些已经饱和。你的技能在市场上到底值多少钱？";
      }
    },
    {
      id: "a468_price_volatility", phase: "street", _isChainEvent: false, icon: "📈",
      title: "市场信号",
      story: "你注意到市场价格在剧烈波动——{desc}",
      triggers: { minDay: 45, interval: 80, maxRepeats: 4, excludeFlags: ["_a468VolatilityCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.trade || !st.trade.priceIndex) return false;
        return (st.flags && !st.flags._a468VolatilityCooldown);
      },
      choices: [
        { text: "🔍 分析波动原因", hint: "智力+2,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a468VolatilityCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔍 你分析了价格波动——'市场在传递信号。' 智力+2,会计XP+2。", "success");
        }},
        { text: "🛒 趁机囤货", hint: "现金-300,随机商品×3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a468VolatilityCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 300);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛒 你趁机囤了一批货——'低买高卖。' 现金-300。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var idx = st.trade && st.trade.priceIndex ? st.trade.priceIndex.toFixed(2) : "1.00";
        return "你注意到市场价格在波动——价格指数已经到了" + idx + "。市场在传递什么信号？";
      }
    },
    {
      id: "a468_economy_health", phase: "street", _isChainEvent: false, icon: "❤️",
      title: "城市经济",
      story: "你感受到了城市经济的温度——{desc}",
      triggers: { minDay: 50, interval: 90, maxRepeats: 3, excludeFlags: ["_a468EconHealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.economy) return false;
        return (st.flags && !st.flags._a468EconHealthCooldown);
      },
      choices: [
        { text: "📊 关注税收政策", hint: "心智+2,智力+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a468EconHealthCooldown = true;
          if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 2); st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你关注了税收政策——'了解规则，才能利用规则。' 心智+2,智力+1。", "success");
        }},
        { text: "💪 专注自身成长", hint: "全技能XP+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a468EconHealthCooldown = true;
          var skills = ["accounting", "management", "sales", "coding", "social"]; // [全系统自洽修复] 域E R588 修复:trade非真实技能键(addSkillXp静默丢弃XP)→映射social
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 1); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 你决定专注自身成长——'打铁还需自身硬。' 全技能XP+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cycle = st.economy && st.economy.cycle ? st.economy.cycle : "normal";
        var desc = cycle === "boom" ? "城市经济一片繁荣，机会到处都是。" : cycle === "recession" ? "经济不景气，大家都在节衣缩食。" : "经济平稳，日子照过。";
        return desc + "你开始思考——在这个经济环境下，该怎么管好自己的钱？";
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
