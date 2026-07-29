/**
 * 域E(经济/投资) 联动增强 R823 (第十四轮循环)
 * 桥接：
 *   E→A  e823_price_wisdom 价格智慧 → 消费 investment/stock 数据
 *   E→B  e823_market_tale 市场故事 → 消费 投资盈亏+叙事
 *   E→G  e823_wealth_health_v10 财富健康v10 → 消费 财富数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR823Loaded) return;
  RANDOM_EVENTS._domainELinkageR823Loaded = true;

  function portVal(st) {
    if (!st || !st.investment) return 0;
    var pv = (st.resources && isFinite(st.resources.cash) ? st.resources.cash : 0) +
      (st.resources && isFinite(st.resources.bankBalance) ? st.resources.bankBalance : 0);
    var inv = st.investment;
    if (inv.stockHoldings && inv.stockMarket) {
      for (var s in inv.stockHoldings) {
        if (inv.stockHoldings[s] && inv.stockMarket[s]) {
          var sh = inv.stockHoldings[s].shares || 0;
          var pr = inv.stockMarket[s].price || 0;
          if (isFinite(sh) && isFinite(pr)) pv += sh * pr;
        }
      }
    }
    return pv;
  }

  var EVENTS = [
    {
      id: "e823_price_wisdom", phase: "street", _isChainEvent: false, icon: "📶",
      title: "价格智慧",
      story: "市场的每一次波动,都藏着机会——学会解读,就能把握先机。",
      triggers: { minDay: 120, interval: 200, maxRepeats: 3, excludeFlags: ["_e823PriceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e823PriceCd) return false;
        return st.player && st.player.day >= 120 && st.investment;
      },
      text: function (st) {
        if (!st) return null;
        var pv = Math.round(portVal(st));
        return "组合市值¥" + pv.toLocaleString() + "——'市场的每一次波动,都藏着机会。'";
      },
      choices: [
        {
          text: "📈 分析趋势", hint: "智力+20,会计XP+15,置_e823Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e823PriceCd = true;
            st.flags._e823Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '信号就在那里。' 智力+20,会计XP+15。", "success");
            }
          }
        },
        {
          text: "📝 记录观察", hint: "心智+18,置_e823Observer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e823PriceCd = true;
            st.flags._e823Observer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 '观察是第一步。' 心智+18。", "info");
            }
          }
        }
      ]
    },
    {
      id: "e823_market_tale", phase: "street", _isChainEvent: false, icon: "📖",
      title: "市场故事",
      story: "每一次投资,都值得回味——涨跌之间,藏着人生的道理。",
      triggers: { minDay: 200, interval: 250, maxRepeats: 3, excludeFlags: ["_e823TaleCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e823TaleCd) return false;
        return st.player && st.player.day >= 200 && st.investment && st.investment.stockHoldings;
      },
      text: function (st) {
        if (!st) return null;
        var stocks = st.investment && st.investment.stockHoldings ? Object.keys(st.investment.stockHoldings).length : 0;
        return "你持有" + stocks + "只股票——'每一次投资,都值得回味。'";
      },
      choices: [
        {
          text: "📖 回味历程", hint: "心智+25,魅力+15,置_e823Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e823TaleCd = true;
            st.flags._e823Chronicler = true;
            if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 25); st.player.charm = Math.min(100, (st.player.charm || 50) + 15); }
            if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '投资是一场修行。' 心智+25,魅力+15。", "success"); }
          }
        },
        {
          text: "🗣️ 分享心得", hint: "社交XP+25,置_e823Share",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e823TaleCd = true;
            st.flags._e823Share = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") { StateManager.addMessage("🗣️ '分享让智慧加倍。' 社交XP+25。", "info"); }
          }
        }
      ]
    },
    {
      id: "e823_wealth_health_v10", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "财富健康",
      story: "财富不是目的,健康的生活才是——平衡,才是最大的智慧。",
      triggers: { minDay: 300, interval: 300, maxRepeats: 4, excludeFlags: ["_e823HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e823HealthCd) return false;
        return st.player && st.player.day >= 300 && st.investment && st.needs && st.status;
      },
      text: function (st) {
        if (!st) return null;
        var pv = Math.round(portVal(st));
        var h = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100;
        return "组合¥" + pv.toLocaleString() + ",健康" + h + "%——'平衡才是最大的智慧。'";
      },
      choices: [
        {
          text: "🧘 调整心态", hint: "心智+20,心情+20,置_e823Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e823HealthCd = true; st.flags._e823Balanced = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (typeof StateManager !== "undefined") { StateManager.addMessage("🧘 '财富诚可贵,健康价更高。' 心智+20,心情+20。", "success"); }
          }
        },
        {
          text: "🏃 运动放松", hint: "健康+18,疲劳-20,置_e823Fit",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e823HealthCd = true; st.flags._e823Fit = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
            if (typeof StateManager !== "undefined") { StateManager.addMessage("🏃 '健康是最大的财富。' 健康+18,疲劳-20。", "info"); }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();