/**
 * 域A(数据/数值平衡) 联动增强 R603
 * 桥接：
 *   A→G  a603_price_health_awareness  价格健康觉醒 → 消费 state.resources+state.status 数据,
 *     数据→"物价影响健康选择"的生命回响
 *   A→C  a603_job_skill_market  技能市场数据 → 消费 state.skills 数据,
 *     数据→"技能市场需求导向"的职业回响
 *   A→E  a603_market_trade_insight  市场交易洞察 → 消费 state.resources+state.flags 数据,
 *     数据→"价格波动中的投资机会"的经济回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR603Loaded) return;
  RANDOM_EVENTS._domainALinkageR603Loaded = true;

  var EVENTS = [
    // ====== A→G: 价格健康觉醒 ======
    {
      id: "a603_price_health_awareness", phase: "street", _isChainEvent: false, icon: "🥦",
      title: "物价与健康",
      story: "你去菜市场逛了一圈,发现物价又涨了——{desc}",
      triggers: { minDay: 15, interval: 60, maxRepeats: 10, excludeFlags: ["_a603PriceHealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a603PriceHealthCooldown) return false;
        return true;
      },
      choices: [
        { text: "🥗 买新鲜食材自己做", hint: "健康+5,饥饿+30,现金-300", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a603PriceHealthCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 300);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (st.needs) st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 30);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🥦 你买了新鲜蔬菜和肉,自己做了顿营养餐。'还是自己做饭实惠又健康。' 健康+5,饥饿+30,现金-300。", "success");
        }},
        { text: "🍜 凑合吃泡面", hint: "现金-50,健康-2,饥饿+15", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a603PriceHealthCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50);
          if (st.status) st.status.health = Math.max(0, (st.status.health || 100) - 2);
          if (st.needs) st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 15);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍜 '又涨价了...算了,吃泡面吧。' 你叹了口气。健康-2,现金-50。", "warning");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "菜市场的价格又涨了。猪肉¥35/斤,鸡蛋¥8/斤,连青菜都涨到了¥5/斤。你摸了摸钱包,开始思考:为了健康,值得多花这些钱吗?";
      }
    },

    // ====== A→C: 技能市场数据 ======
    {
      id: "a603_job_skill_market", phase: "street", _isChainEvent: false, icon: "📊",
      title: "技能市场行情",
      story: "你研究了一下当前市场上什么技能最值钱——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 8, excludeFlags: ["_a603SkillMarketCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a603SkillMarketCooldown) return false;
        return true;
      },
      choices: [
        { text: "🎯 学习热门技能", hint: "random技能XP+10,智力+3,现金-500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a603SkillMarketCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          var hotSkills = ["coding", "accounting", "sales", "management", "electrician", "repair"];
          if (typeof Random !== "undefined" && typeof addSkillXp === "function") {
            try { addSkillXp(Random.fromArray(hotSkills), 10); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你报了一个热门技能培训班。'市场需要的,就是我要学的!' random技能XP+10,智力+3,现金-500。", "success");
        }},
        { text: "📈 研究市场趋势", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a603SkillMarketCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '知己知彼,百战不殆。' 你花了时间研究各行业的技能需求趋势。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你研究了当前的就业市场——编程、会计、销售、管理是最热门的方向。'技能学对了,收入翻倍不是梦。' 你盘算着该往哪个方向努力。";
      }
    },

    // ====== A→E: 市场交易洞察 ======
    {
      id: "a603_market_trade_insight", phase: "street", _isChainEvent: false, icon: "💰",
      title: "倒卖机会",
      story: "你发现了一个价格差——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 8, excludeFlags: ["_a603TradeInsightCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a603TradeInsightCooldown) return false;
        return (st.resources.cash || 0) >= 2000;
      },
      choices: [
        { text: "💰 进货倒卖", hint: "收益¥500-2500,风险亏¥1000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a603TradeInsightCooldown = true;
          var cost = Math.min(1000, (st.resources.cash || 0) * 0.2);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
          var win = Random.chance(0.6);
          if (win) {
            var profit = Math.round(cost * Random.float(0.5, 2.5));
            st.resources.cash = (st.resources.cash || 0) + cost + profit;
            if (typeof StateManager !== "undefined") StateManager.addMessage("💰 低价买入,高价卖出!你赚了¥" + profit.toLocaleString() + "。'做生意,就是低买高卖!'", "success");
          } else {
            var loss = Math.round(cost * Random.float(0.3, 0.8));
            st.resources.cash = (st.resources.cash || 0) + loss;
            if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '看走眼了...' 这次倒卖亏了¥" + (cost - loss) + "。吃一堑长一智。", "warning");
          }
        }},
        { text: "📝 记下价格信息", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a603TradeInsightCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 你记下了各种商品的价格信息。'信息就是财富,等时机成熟再出手。' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现城西的电子产品比城东便宜不少。'这个差价,够我赚一笔了。' 你心里盘算着,要不要做一回倒爷。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();