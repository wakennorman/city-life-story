/*
 * 城市浮生记 — 域E（经济/投资）A类修复 + 联动增强 · R195
 * 全系统优化 loop R195
 *
 * 本轮核心：复活「止损止盈/技术分析」死子系统（investment_analysis.js）。
 *  - A类修复：checkStopLoss(state) 全库无任何调用方 → 玩家即使持有止损单
 *    (inv.stopLossOrders) 也永远不会被评估/触发，整条
 *    setStopLoss → stopLossOrders → checkStopLoss → sellInvStock 链为死机制。
 *    因 daily_pipeline.js / investment.js 均有并行窗口在途改动（本轮铁律不碰），
 *    此处以安全包装 tickInvestmentDaily 的方式接线：每日投资 tick 后评估止损单。
 *  - 联动增强 3 项：复活 setStopLoss（券商顾问引导事件 E→F）、
 *    消费 order.triggered（止损纪律叙事 E→G）、
 *    复活 analyzeStockTechnicals（技术面复盘 E→C）。
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS；所有 state 访问均 || / typeof 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重；数值标 [PLACEHOLDER]。
 *  - 本文件须在 investment.js / investment_analysis.js 之后加载（src/index.html 注册序保证）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR195Loaded) return;
  RANDOM_EVENTS._domainELinkageR195Loaded = true;

  // 注：checkStopLoss 死机制的每日接线（A类修复）在 investment_analysis.js 末尾
  //     （包装 tickInvestmentDaily），本文件仅承担联动事件与 setStopLoss/
  //     analyzeStockTechnicals 的玩法入口复活。

  // ---- 本地助手 ----

  // 取市值最大的持仓（symbol），全防御；无持仓返回 null
  function biggestHoldingR195(st) {
    if (!st || !st.investment) return null;
    var inv = st.investment;
    if (!Array.isArray(inv.stockHoldings) || inv.stockHoldings.length === 0) return null;
    if (!inv.stockMarket) return null;
    var best = null,
      bestVal = -1;
    for (var i = 0; i < inv.stockHoldings.length; i++) {
      var h = inv.stockHoldings[i];
      if (!h || !h.symbol) continue;
      var m = inv.stockMarket[h.symbol];
      var price = m && typeof m.price === "number" && isFinite(m.price) ? m.price : 0;
      var val = price * (h.shares || 0);
      if (val > bestVal) {
        bestVal = val;
        best = h;
      }
    }
    return best;
  }

  // 是否存在已触发的止损单（消费 checkStopLoss 写入的 order.triggered）
  function hasTriggeredStopR195(st) {
    if (!st || !st.investment || !Array.isArray(st.investment.stopLossOrders)) return false;
    for (var i = 0; i < st.investment.stopLossOrders.length; i++) {
      var o = st.investment.stopLossOrders[i];
      if (o && o.triggered) return true;
    }
    return false;
  }

  // ===== 联动1: E→F 券商顾问引导设置止损（复活 setStopLoss，新玩法引导） =====
  RANDOM_EVENTS.push({
    id: "invest_r195_stoploss_advisor",
    phase: "street",
    icon: "🛑",
    title: "券商客户经理的一通电话",
    desc:
      "券商的客户经理打来回访电话，语气挺诚恳：\n\n" +
      "「看您持仓有段时间了，一直没设风控。市场这东西谁也说不准——" +
      "给最大那笔仓位挂个止损单吧？亏到一成自动出，睡觉都踏实。」\n\n" +
      "你想起身边人被深套的故事，握着手机犹豫了一下。",
    conditions: function (st) {
      if (!st || !st.player || !st.investment) return false;
      if (st.flags && st.flags._investStopAdvisorDone) return false;
      if ((st.player.day || 0) < 40) return false;
      if (!Array.isArray(st.investment.stockHoldings) || st.investment.stockHoldings.length === 0)
        return false;
      // 已有止损单则不再引导
      if (Array.isArray(st.investment.stopLossOrders) && st.investment.stopLossOrders.length > 0)
        return false;
      return !!biggestHoldingR195(st);
    },
    choices: [
      {
        text: "🛑 听劝，给最大持仓挂10%止损单",
        hint: "设置固定百分比止损，mental+2",
        apply: function (st) {
          if (st.flags) st.flags._investStopAdvisorDone = true;
          var h = biggestHoldingR195(st);
          if (h && typeof setStopLoss === "function") {
            // 复活 setStopLoss：threshold 取 STOP_LOSS_STRATEGIES.fixed_percent 合法档位
            setStopLoss(st, h.symbol, "fixed_percent", { threshold: 10 }); // [PLACEHOLDER]
          }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🛑 你给最大持仓挂上了止损单——涨跌之外，多了一层底线。mental+2。",
              "good",
            );
        },
      },
      {
        text: "😤 我看好的票，不用止损",
        hint: "保持现状",
        apply: function (st) {
          if (st.flags) st.flags._investStopAdvisorDone = true;
        },
      },
    ],
    probability: 0.035,
  });

  // ===== 联动2: E→G 止损单真实触发后 → 止损纪律的人生体悟 =====
  RANDOM_EVENTS.push({
    id: "invest_r195_stoploss_discipline",
    phase: "street",
    icon: "🧘",
    title: "那笔被止损卖掉的股票",
    desc:
      "复盘账户时你看到那笔被系统自动止损卖出的股票——\n\n" +
      "当时肉疼，可它后来跌得更深。你保住的不是几个点的本金，" +
      "是「亏损不与自己较劲」的纪律。\n\n" +
      "投资如此，过日子好像也如此。",
    conditions: function (st) {
      if (!st || !st.player) return false;
      if (st.flags && st.flags._investStopDisciplineDone) return false;
      return hasTriggeredStopR195(st);
    },
    choices: [
      {
        text: "🧘 把纪律写进性格里",
        hint: "mental+5, happiness+3",
        apply: function (st) {
          if (st.flags) st.flags._investStopDisciplineDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5); // [PLACEHOLDER]
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🧘 及时止损保住了本金，也磨出了心性。mental+5，happiness+3。",
              "good",
            );
        },
      },
      {
        text: "😮‍💨 还是有点心疼",
        hint: "无变化",
        apply: function (st) {
          if (st.flags) st.flags._investStopDisciplineDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ===== 联动3: E→C 技术面复盘（复活 analyzeStockTechnicals）→ 财务技能成长 =====
  RANDOM_EVENTS.push({
    id: "invest_r195_technical_review",
    phase: "corporate",
    icon: "📊",
    title: "深夜的一次技术面复盘",
    desc:
      "夜深人静，你翻出自己最大持仓的K线，把均线、MACD、RSI逐个看了一遍。\n\n" +
      "指标不是水晶球，但一遍遍复盘下来，你对「涨跌背后的节奏」" +
      "有了自己的手感——这份手感，白天做账做分析时也用得上。",
    conditions: function (st) {
      if (!st || !st.player || !st.investment) return false;
      if (st.player.phase !== "corporate") return false;
      if (st.flags && st.flags._investTechReviewDone) return false;
      if ((st.player.day || 0) < 50) return false;
      return !!biggestHoldingR195(st);
    },
    choices: [
      {
        text: "📊 认真复盘一遍（财务技能XP）",
        hint: "accounting XP+8, mental+2",
        apply: function (st) {
          if (st.flags) st.flags._investTechReviewDone = true;
          var summary = "";
          var h = biggestHoldingR195(st);
          if (h && typeof analyzeStockTechnicals === "function") {
            try {
              // 复活 analyzeStockTechnicals：真实调用产出评级摘要
              var r = analyzeStockTechnicals(h.symbol, st);
              if (r && !r.error && r.rating) summary = h.symbol + "：" + r.trend + "，评级 " + r.rating;
            } catch (e) {
              summary = "";
            }
          }
          if (typeof addSkillXp === "function") addSkillXp("accounting", 8); // [PLACEHOLDER] 真实技能键
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "📊 复盘完毕。" + (summary ? summary + "。" : "") + "accounting XP+8，mental+2。",
              "good",
            );
        },
      },
      {
        text: "🥱 太晚了，明天再说",
        hint: "无变化",
        apply: function (st) {
          if (st.flags) st.flags._investTechReviewDone = true;
        },
      },
    ],
    probability: 0.03,
  });
})();
