/**
 * 域E(经济/投资) 联动增强 R845 (第十七轮循环)
 * 桥接：
 *   E→A  e845_market_read 市场解读 → 消费 investment/stock 数据
 *   E→B  e845_fund_tale 基金故事 → 消费 投资盈亏+叙事
 *   E→G  e845_finance_health 财务健康 → 消费 财富数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR845Loaded) return;
  RANDOM_EVENTS._domainELinkageR845Loaded = true;

  function pv(st) {
    if (!st || !st.investment) return 0;
    var v = (st.resources && isFinite(st.resources.cash) ? st.resources.cash : 0) + (st.resources && isFinite(st.resources.bankBalance) ? st.resources.bankBalance : 0);
    var i = st.investment; if (i.stockHoldings && i.stockMarket) { for (var s in i.stockHoldings) { if (i.stockHoldings[s] && i.stockMarket[s]) { var sh = i.stockHoldings[s].shares || 0; var pr = i.stockMarket[s].price || 0; if (isFinite(sh) && isFinite(pr)) v += sh * pr; } } }
    return v;
  }

  var EVENTS = [
    {
      id: "e845_market_read", phase: "street", _isChainEvent: false, icon: "📶",
      title: "市场解读", story: "市场的每一次波动,都藏着机会——学会解读,就能把握先机。",
      triggers: { minDay: 80, interval: 150, maxRepeats: 3, excludeFlags: ["_e845ReadCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._e845ReadCd) return false; return st.player && st.player.day >= 80 && st.investment; },
      text: function (st) { if (!st) return null; var v = Math.round(pv(st)); return "组合市值¥" + v.toLocaleString() + "——'市场的每一次波动,都藏着机会。'"; },
      choices: [
        { text: "📈 分析", hint: "智力+20,会计XP+15,置_e845Analyst",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._e845ReadCd = true; st.flags._e845Analyst = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20); if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📈 '信号就在那里。' 智力+20,会计XP+15。", "success"); } }
        },
        { text: "📝 记录", hint: "心智+18,置_e845Observer",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._e845ReadCd = true; st.flags._e845Observer = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18); if (typeof StateManager !== "undefined") { StateManager.addMessage("📝 '观察是第一步。' 心智+18。", "info"); } }
        }
      ]
    },
    {
      id: "e845_fund_tale", phase: "street", _isChainEvent: false, icon: "📖",
      title: "基金故事", story: "每一次投资,都值得回味——涨跌之间,藏着人生的道理。",
      triggers: { minDay: 150, interval: 200, maxRepeats: 3, excludeFlags: ["_e845TaleCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._e845TaleCd) return false; return st.player && st.player.day >= 150 && st.investment && st.investment.stockHoldings; },
      text: function (st) { if (!st) return null; var s = st.investment && st.investment.stockHoldings ? Object.keys(st.investment.stockHoldings).length : 0; return "你持有" + s + "只股票——'每一次投资,都值得回味。'"; },
      choices: [
        { text: "📖 回味", hint: "心智+25,魅力+15,置_e845Chronicler",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._e845TaleCd = true; st.flags._e845Chronicler = true; if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 25); st.player.charm = Math.min(100, (st.player.charm || 50) + 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '投资是一场修行。' 心智+25,魅力+15。", "success"); } }
        },
        { text: "🗣️ 分享", hint: "社交XP+25,置_e845Share",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._e845TaleCd = true; st.flags._e845Share = true; if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("🗣️ '分享让智慧加倍。' 社交XP+25。", "info"); } }
        }
      ]
    },
    {
      id: "e845_finance_health", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "财务健康", story: "财富不是目的,健康的生活才是——平衡,才是最大的智慧。",
      triggers: { minDay: 220, interval: 280, maxRepeats: 4, excludeFlags: ["_e845HealthCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._e845HealthCd) return false; return st.player && st.player.day >= 220 && st.investment && st.needs && st.status; },
      text: function (st) { if (!st) return null; var v = Math.round(pv(st)); var h = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100; return "组合¥" + v.toLocaleString() + ",健康" + h + "%——'平衡才是最大的智慧。'"; },
      choices: [
        { text: "🧘 调整", hint: "心智+20,心情+20,置_e845Balanced",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._e845HealthCd = true; st.flags._e845Balanced = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20); if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("🧘 '财富诚可贵,健康价更高。' 心智+20,心情+20。", "success"); } }
        },
        { text: "🏃 运动", hint: "健康+18,疲劳-20,置_e845Fit",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._e845HealthCd = true; st.flags._e845Fit = true; if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18); if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("🏃 '健康是最大的财富。' 健康+18,疲劳-20。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();