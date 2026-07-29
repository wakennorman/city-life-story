/**
 * 域E(经济/投资) 联动增强 R815 (第十三轮循环)
 * 桥接：
 *   E→A  e815_market_signal 市场信号 → 消费 investment/stock 数据
 *   E→B  e815_invest_fable 投资寓言 → 消费 投资盈亏+叙事
 *   E→G  e815_wealth_health_v9 财富健康v9 → 消费 财富数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR815Loaded) return;
  RANDOM_EVENTS._domainELinkageR815Loaded = true;

  function getPortfolioVal(st) {
    if (!st || !st.investment) return 0;
    var pv = (st.resources && isFinite(st.resources.cash) ? st.resources.cash : 0) +
      (st.resources && isFinite(st.resources.bankBalance) ? st.resources.bankBalance : 0);
    var inv = st.investment;
    if (inv.stockHoldings && inv.stockMarket) {
      for (var sym in inv.stockHoldings) {
        if (inv.stockHoldings[sym] && inv.stockMarket[sym]) {
          var shares = inv.stockHoldings[sym].shares || 0;
          var price = inv.stockMarket[sym].price || 0;
          if (isFinite(shares) && isFinite(price)) pv += shares * price;
        }
      }
    }
    return pv;
  }

  var EVENTS = [
    {
      id: "e815_market_signal", phase: "street", _isChainEvent: false, icon: "📶",
      title: "市场信号",
      story: "市场在向你发送信号——学会解读,就能把握先机。",
      triggers: { minDay: 150, interval: 250, maxRepeats: 3, excludeFlags: ["_e815SignalCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e815SignalCd) return false;
        return st.player && st.player.day >= 150 && st.investment;
      },
      text: function (st) {
        if (!st) return null;
        var pv = Math.round(getPortfolioVal(st));
        return "组合市值¥" + pv.toLocaleString() + "——'市场在向你发送信号。'";
      },
      choices: [
        {
          text: "📈 分析信号", hint: "智力+22,会计XP+18,置_e815Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e815SignalCd = true;
            st.flags._e815Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 22);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '信号就在那里,关键是你是否看见。' 智力+22,会计XP+18。", "success");
            }
          }
        },
        {
          text: "📝 记录观察", hint: "心智+18,置_e815Observer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e815SignalCd = true;
            st.flags._e815Observer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 '观察,是投资的第一步。' 心智+18。", "info");
            }
          }
        }
      ]
    },
    {
      id: "e815_invest_fable", phase: "street", _isChainEvent: false, icon: "📖",
      title: "投资寓言",
      story: "每一次投资,都是一则寓言——涨跌之间,藏着人生的道理。",
      triggers: { minDay: 250, interval: 300, maxRepeats: 3, excludeFlags: ["_e815FableCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e815FableCd) return false;
        return st.player && st.player.day >= 250 && st.investment && st.investment.stockHoldings;
      },
      text: function (st) {
        if (!st) return null;
        var stocks = st.investment && st.investment.stockHoldings ? Object.keys(st.investment.stockHoldings).length : 0;
        return "你持有" + stocks + "只股票——'每一次投资,都是一则寓言。'";
      },
      choices: [
        {
          text: "📖 回味投资故事", hint: "心智+25,魅力+15,置_e815Storyteller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e815FableCd = true;
            st.flags._e815Storyteller = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '投资,是一场与自己的对话。' 心智+25,魅力+15。", "success");
            }
          }
        },
        {
          text: "🗣️ 分享心得", hint: "社交XP+25,置_e815Share",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e815FableCd = true;
            st.flags._e815Share = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗣️ '分享,让智慧加倍。' 社交XP+25。", "info");
            }
          }
        }
      ]
    },
    {
      id: "e815_wealth_health_v9", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "财富健康",
      story: "财富不是目的,健康的生活才是——平衡,才是最大的智慧。",
      triggers: { minDay: 350, interval: 350, maxRepeats: 4, excludeFlags: ["_e815HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e815HealthCd) return false;
        return st.player && st.player.day >= 350 && st.investment && st.needs && st.status;
      },
      text: function (st) {
        if (!st) return null;
        var pv = Math.round(getPortfolioVal(st));
        var health = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100;
        return "组合市值¥" + pv.toLocaleString() + ",健康" + health + "%——'平衡,才是最大的智慧。'";
      },
      choices: [
        {
          text: "🧘 调整心态", hint: "心智+20,心情+20,置_e815Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e815HealthCd = true;
            st.flags._e815Balanced = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '财富诚可贵,健康价更高。' 心智+20,心情+20。", "success");
            }
          }
        },
        {
          text: "🏃 运动放松", hint: "健康+18,疲劳-20,置_e815Fit",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e815HealthCd = true;
            st.flags._e815Fit = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '健康,才是最大的财富。' 健康+18,疲劳-20。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();