/**
 * 域E(经济/投资) 联动增强 R837 (第十六轮循环)
 * 桥接：
 *   E→A  e837_market_pulse 市场脉搏 → 消费 investment/stock 数据
 *   E→B  e837_invest_story 投资故事 → 消费 投资盈亏+叙事
 *   E→G  e837_wealth_balance 财富平衡 → 消费 财富数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR837Loaded) return;
  RANDOM_EVENTS._domainELinkageR837Loaded = true;

  function pv(st) {
    if (!st || !st.investment) return 0;
    var v = (st.resources && isFinite(st.resources.cash) ? st.resources.cash : 0) + (st.resources && isFinite(st.resources.bankBalance) ? st.resources.bankBalance : 0);
    var i = st.investment; if (i.stockHoldings && i.stockMarket) { for (var s in i.stockHoldings) { if (i.stockHoldings[s] && i.stockMarket[s]) { var sh = i.stockHoldings[s].shares || 0; var pr = i.stockMarket[s].price || 0; if (isFinite(sh) && isFinite(pr)) v += sh * pr; } } }
    return v;
  }

  var EVENTS = [
    {
      id: "e837_market_pulse", phase: "street", _isChainEvent: false, icon: "📶",
      title: "市场脉搏", story: "市场的每一次波动,都藏着机会——学会解读,就能把握先机。",
      triggers: { minDay: 100, interval: 180, maxRepeats: 3, excludeFlags: ["_e837PulseCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._e837PulseCd) return false; return st.player && st.player.day >= 100 && st.investment; },
      text: function (st) { if (!st) return null; var v = Math.round(pv(st)); return "组合市值¥" + v.toLocaleString() + "——'市场的每一次波动,都藏着机会。'"; },
      choices: [
        { text: "📈 分析", hint: "智力+20,会计XP+15,置_e837Analyst",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._e837PulseCd = true; st.flags._e837Analyst = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20); if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📈 '信号就在那里。' 智力+20,会计XP+15。", "success"); } }
        },
        { text: "📝 记录", hint: "心智+18,置_e837Observer",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._e837PulseCd = true; st.flags._e837Observer = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18); if (typeof StateManager !== "undefined") { StateManager.addMessage("📝 '观察是第一步。' 心智+18。", "info"); } }
        }
      ]
    },
    {
      id: "e837_invest_story", phase: "street", _isChainEvent: false, icon: "📖",
      title: "投资故事", story: "每一次投资,都值得回味——涨跌之间,藏着人生的道理。",
      triggers: { minDay: 180, interval: 220, maxRepeats: 3, excludeFlags: ["_e837StoryCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._e837StoryCd) return false; return st.player && st.player.day >= 180 && st.investment && st.investment.stockHoldings; },
      text: function (st) { if (!st) return null; var s = st.investment && st.investment.stockHoldings ? Object.keys(st.investment.stockHoldings).length : 0; return "你持有" + s + "只股票——'每一次投资,都值得回味。'"; },
      choices: [
        { text: "📖 回味", hint: "心智+25,魅力+15,置_e837Chronicler",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._e837StoryCd = true; st.flags._e837Chronicler = true; if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 25); st.player.charm = Math.min(100, (st.player.charm || 50) + 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '投资是一场修行。' 心智+25,魅力+15。", "success"); } }
        },
        { text: "🗣️ 分享", hint: "社交XP+25,置_e837Share",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._e837StoryCd = true; st.flags._e837Share = true; if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("🗣️ '分享让智慧加倍。' 社交XP+25。", "info"); } }
        }
      ]
    },
    {
      id: "e837_wealth_balance", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "财富平衡", story: "财富不是目的,健康的生活才是——平衡,才是最大的智慧。",
      triggers: { minDay: 250, interval: 300, maxRepeats: 4, excludeFlags: ["_e837HealthCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._e837HealthCd) return false; return st.player && st.player.day >= 250 && st.investment && st.needs && st.status; },
      text: function (st) { if (!st) return null; var v = Math.round(pv(st)); var h = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100; return "组合¥" + v.toLocaleString() + ",健康" + h + "%——'平衡才是最大的智慧。'"; },
      choices: [
        { text: "🧘 调整", hint: "心智+20,心情+20,置_e837Balanced",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._e837HealthCd = true; st.flags._e837Balanced = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20); if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("🧘 '财富诚可贵,健康价更高。' 心智+20,心情+20。", "success"); } }
        },
        { text: "🏃 运动", hint: "健康+18,疲劳-20,置_e837Fit",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._e837HealthCd = true; st.flags._e837Fit = true; if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18); if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("🏃 '健康是最大的财富。' 健康+18,疲劳-20。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();