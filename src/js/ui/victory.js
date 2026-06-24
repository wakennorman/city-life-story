/**
 * 多种胜利路线系统
 *
 * 打破固定套路，提供5种不同的获胜方式：
 *   🏪 经商大亨 | ⭐ 城市名人 | 🎓 技能大师 | 💰 投资天才 | 🏢 职场巅峰 | 💵 财务自由
 */

/** 每日检查所有胜利路线 */
function checkVictoryPaths(state) {
  if (state.flags.gameOver || state.flags.victory) return;
  const inv = state.investment;

  // 🏪 经商大亨：累计交易利润 >= ¥500,000
  const totalProfit = state.trade?.totalProfit || 0;
  if (totalProfit >= 500000) {
    triggerVictory(
      state,
      "merchant",
      "🏪 经商大亨！",
      "你靠倒买倒卖积累了 ¥" +
        totalProfit.toLocaleString() +
        " 交易利润，成为城中传奇商人！",
    );
    return;
  }

  // ⭐ 城市名人：名气 >= 100 持续 10 天
  if (state.player.fame >= 100) {
    state.status.fameDays = (state.status.fameDays || 0) + 1;
    if (state.status.fameDays >= 10) {
      triggerVictory(
        state,
        "celebrity",
        "⭐ 城市名人！",
        "你的名气响彻全城，走到哪里都有人认出你。你成了这座城市的象征！",
      );
      return;
    }
  } else {
    state.status.fameDays = 0;
  }

  // 🎓 技能大师：全部10项技能达到80级
  const skillValues = Object.values(state.skills);
  if (
    skillValues.length >= 10 &&
    skillValues.every(function (s) {
      return s.level >= 80;
    })
  ) {
    triggerVictory(
      state,
      "master",
      "🎓 技能大师！",
      "十项全能，样样精通！任何工作在你手里都是大师级水准。",
    );
    return;
  }

  // 💰 投资天才：投资资产 >= ¥10,000,000
  var stockVal = 0;
  if (inv && inv.stockHoldings) {
    stockVal = inv.stockHoldings.reduce(function (s, h) {
      var mkt = inv.stockMarket ? inv.stockMarket[h.symbol] : null;
      return s + (mkt ? mkt.price : 0) * (h.shares || 0);
    }, 0);
  }
  var btcVal =
    (inv && inv.btcPrice ? inv.btcPrice : 0) *
    (inv && inv.btcHoldings ? inv.btcHoldings : 0);
  var propVal = (inv && inv.properties ? inv.properties : []).reduce(function (
    s,
    p,
  ) {
    return s + (p.currentPrice || p.buyPrice || 0);
  }, 0);
  var carVal = (inv && inv.cars ? inv.cars : []).reduce(function (s, c) {
    return s + (c.currentPrice || c.buyPrice || 0);
  }, 0);
  var totalInv = stockVal + btcVal + propVal + carVal;
  if (totalInv >= 10000000) {
    triggerVictory(
      state,
      "investor",
      "💰 投资天才！",
      "你的投资组合突破了千万大关！钱生钱，你已经掌握了财富密码。",
    );
    return;
  }

  // 🏢 职场巅峰（保留原有逻辑）
  if (state.player.phase === "corporate" && state.corporate.rank === "P10") {
    triggerVictory(
      state,
      "p10",
      "🏆 登峰造极！",
      "你成功晋升到了P10合伙人级别，站在了职场金字塔的顶端！",
    );
    return;
  }

  // 💵 财务自由（保留原有 ¥20,000,000）
  if (state.resources.cash + (state.resources.bankBalance || 0) >= 20000000) {
    triggerVictory(
      state,
      "money",
      "💵 财务自由！",
      "你积累了2000万财富，实现了财务自由。不再为钱发愁的人生，开始了！",
    );
    return;
  }
}

/** 触发胜利 */
function triggerVictory(state, type, title, desc) {
  state.flags.victory = true;
  state.flags.victoryType = type;
  state.flags.gameOver = true;
  state.flags.victoryTitle = title;
  state.flags.victoryDesc = desc;
  // v3.1：人生缎带判定
  if (typeof determineLifeRibbon === "function") {
    var result = determineLifeRibbon(state);
    state.flags._lifeRibbon = result.ribbon.id;
    state.flags._lifeRibbonName = result.ribbon.icon + " " + result.ribbon.name;
    if (typeof recordRibbon === "function") {
      var isNew = recordRibbon(result.ribbon.id, result.stats);
      if (isNew) {
        state.flags._newRibbonEarned = true;
      }
    }
  }
  // v3.6 P1-4: 生成人生回忆录摘要
  if (typeof lifeMemoir !== "undefined" && typeof lifeMemoir.generateEnding === "function") {
    var memoirSummary = lifeMemoir.generateEnding(state);
    state.flags._memoirSummary = memoirSummary;
    // 记录到回忆录
    lifeMemoir.add("career", {
      title: "游戏结局",
      content: title + " - " + desc,
      day: state.player.day,
    });
  }
  // 记录公司命运到多周目记忆
  if (typeof recordPlaythroughEnd === "function") {
    recordPlaythroughEnd(state);
  }
  if (typeof showVictoryModal === "function") showVictoryModal();
}

// 全局挂载
if (typeof window !== "undefined") {
  Object.assign(window, {
    checkVictoryPaths: checkVictoryPaths,
    triggerVictory: triggerVictory,
  });
}
