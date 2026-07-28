/**
 * 域E(经济/投资) 联动增强 R678
 * 桥接：
 *   E→C  e678_invest_career_boost     投资赋能职业 → 消费 state.investment+state.career 数据,
 *     投资收益为职业发展提供资金支持和技能加持
 *   E→F  e678_invest_dashboard_v2     投资仪表盘v2 → 消费 state.investment+state.flags 数据,
 *     投资组合风险提示与可视化增强
 *   E→A  e678_econ_data_insight       经济数据洞察 → 消费 state.investment+state.trade 数据,
 *     投资经验提升对经济数据的分析能力
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR678Loaded) return;
  RANDOM_EVENTS._domainELinkageR678Loaded = true;

  // 辅助：获取总投资组合市值
  function totalPortfolioValue(st) {
    if (!st || !st.investment) return 0;
    var total = 0;
    if (st.investment.stockHoldings) {
      for (var i = 0; i < st.investment.stockHoldings.length; i++) {
        var h = st.investment.stockHoldings[i];
        total += (h.shares || 0) * (h.currentPrice || h.buyPrice || 0);
      }
    }
    if (st.investment.btcHoldings) {
      total += (st.investment.btcHoldings || 0) * (st.investment.btcPrice || 0);
    }
    if (st.investment.preciousHoldings) {
      total += st.investment.preciousHoldings || 0;
    }
    return total;
  }

  // 辅助：获取投资经验等级
  function investLevel(st) {
    if (!st || !st.investment) return 0;
    var totalInvested = 0;
    if (st.investment.stockHoldings) {
      for (var i = 0; i < st.investment.stockHoldings.length; i++) {
        totalInvested += (st.investment.stockHoldings[i].shares || 0) * (st.investment.stockHoldings[i].buyPrice || 0);
      }
    }
    var totalProfit = st.investment._totalProfit || 0;
    var combined = totalInvested + totalProfit;
    if (combined >= 500000) return 5;
    if (combined >= 100000) return 4;
    if (combined >= 30000) return 3;
    if (combined >= 5000) return 2;
    if (combined >= 1000) return 1;
    return 0;
  }

  var EVENTS = [
    {
      id: "e678_invest_career_boost", phase: "street", _isChainEvent: false, icon: "🚀",
      title: "投资赋能职业",
      story: "你的投资收益正在为职业发展提供新的可能——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_e678CareerBoostCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e678CareerBoostCooldown) return false;
        var il = investLevel(st);
        return il >= 2 && (st.employment && st.employment.currentJob);
      },
      choices: [
        { text: "📚 投资自己", hint: "各技能XP+5,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e678CareerBoostCooldown = true;
          st.flags._investCareerBoost = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          // 给所有技能加少量经验
          if (st.skills) {
            var _count = 0;
            for (var _sk in st.skills) {
              if (st.skills[_sk] && typeof st.skills[_sk].xp === "number" && _count < 5) {
                st.skills[_sk].xp = (st.skills[_sk].xp || 0) + 5;
                _count++;
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '最好的投资,是投资自己。' 你利用投资收益充实自己。技能XP+5,智力+3。", "success");
        }},
        { text: "💼 职业转型", hint: "管理XP+8,现金+2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e678CareerBoostCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 8); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '底气来自实力,实力来自积累。' 你利用投资收益支持职业转型。管理XP+8,现金+¥2000。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var il = investLevel(st);
        var labels = ["", "初入市场", "小有积累", "驾轻就熟", "投资老手", "资本玩家"];
        var label = labels[il] || "资本玩家";
        return "你的投资收益正在为职业发展提供新的可能——'" + label + "的你,开始用资本反哺职业发展。'";
      }
    },
    {
      id: "e678_invest_dashboard_v2", phase: "street", _isChainEvent: false, icon: "📊",
      title: "投资仪表盘",
      story: "你审视自己的投资组合,发现了一些风险信号——{desc}",
      triggers: { minDay: 100, interval: 180, maxRepeats: 3, excludeFlags: ["_e678DashCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e678DashCooldown) return false;
        var il = investLevel(st);
        return il >= 1;
      },
      choices: [
        { text: "⚖️ 分散风险", hint: "会计XP+7,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e678DashCooldown = true;
          st.flags._diversifiedInvestor = true;
          if (typeof addSkillXp === "function") {
            try { addSkillXp("accounting", 7); } catch(e) {}
            try { addSkillXp("management", 3); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ '不要把所有鸡蛋放在一个篮子里。' 你调整了投资组合分散风险。会计XP+7,管理XP+3。", "success");
        }},
        { text: "📈 聚焦优势", hint: "财务分析+1,现金+1500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e678DashCooldown = true;
          st.flags._focusedInvestor = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1500;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '专注才能深入。' 你聚焦了投资方向。现金+¥1500,投资分析能力提升。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var pv = totalPortfolioValue(st);
        var il = investLevel(st);
        return "你审视自己的投资组合,发现了一些风险信号——'组合市值¥" + Math.round(pv).toLocaleString() + ",投资等级" + il + "。知风险,方能稳收益。'";
      }
    },
    {
      id: "e678_econ_data_insight", phase: "street", _isChainEvent: false, icon: "🔍",
      title: "经济数据洞察",
      story: "多年的投资经验让你对经济数据有了更敏锐的洞察——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_e678DataInsightDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e678DataInsightDone) return false;
        var il = investLevel(st);
        return il >= 3 && st.trade && st.trade.totalProfit > 0;
      },
      choices: [
        { text: "📊 分析宏观数据", hint: "会计XP+10,智力+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e678DataInsightDone = true;
          st.flags._macroEconAnalyst = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 10); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据是经济的脉搏。' 你分析了宏观数据。会计XP+10,智力+5。", "success");
        }},
        { text: "🔄 调整交易策略", hint: "销售XP+6,现金+3000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e678DataInsightDone = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 3000;
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 '经济数据驱动交易策略。' 你调整了交易策略。销售XP+6,现金+¥3000。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var il = investLevel(st);
        var tp = (st.trade && st.trade.totalProfit) || 0;
        return "多年的投资经验让你对经济数据有了更敏锐的洞察——'投资等级" + il + ",交易利润¥" + Math.round(tp).toLocaleString() + "。数据会说话,经验会积累。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();