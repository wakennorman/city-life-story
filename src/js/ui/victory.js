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
  if (totalProfit >= 50000) {
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
  if (totalInv >= 1000000) {
    triggerVictory(
      state,
      "investor",
      "💰 投资天才！",
      "你的投资组合突破了千万大关！钱生钱，你已经掌握了财富密码。",
    );
    return;
  }

  // 🎓 学术大师（博士+多项研究成果）
  if (state.player.education >= 3 && (state.player.research || 0) >= 3) {
    triggerVictory(
      state,
      "academic_master",
      "🎓 学术大师！",
      "你读完博士并发表多项研究成果，在学术界赢得一席之地，桃李满天下！",
    );
    return;
  }

  // 🏠 中产稳稳（月薪>2万+有房产/产业+流动资金5万+）
  var _vcCurrentSalary = state.career && state.career.currentJob ? state.career.currentJob.salary || 0 : 0;
  var _vcOwnsHouse = (state.housing && state.housing.tier >= 2) || ((state.investment && state.investment.properties ? state.investment.properties.length : 0) > 0);
  var _vcLiquid = state.resources.cash + (state.resources.bankBalance || 0);
  if (_vcCurrentSalary > 20000 && _vcOwnsHouse && _vcLiquid >= 50000) {
    triggerVictory(
      state,
      "middle_class",
      "🏠 中产稳稳！",
      "月入过万、有房有存款——你在这座城市扎下了根，日子平淡却踏实。",
    );
    return;
  }

  // 👨‍👩‍👧 幸福家庭（有配偶+子女已成年+家庭净资产为正）
  var _vcFam = state.family || {};
  if (_vcFam.spouse && _vcFam.children && _vcFam.children.length > 0) {
    var _vcAllGrown = _vcFam.children.every(function (c) {
      return (c.age || 0) >= 18 || c.stage === "working" || c.stage === "graduated";
    });
    if (_vcAllGrown) {
      triggerVictory(
        state,
        "happy_family",
        "👨‍👩‍👧 幸福家庭！",
        "子女长大成人，家庭美满——这是多少人奋斗一生的归宿。",
      );
      return;
    }
  }

  // 🛠️ 匠人一生（单项技能满级+证书>=5+同职业>=15年）
  var _vcHasMasterSkill = false;
  for (var _vcSk in state.skills) {
    if (state.skills[_vcSk] && state.skills[_vcSk].level >= 100) { _vcHasMasterSkill = true; break; }
  }
  var _vcCertLen = (state.certificates || []).length;
  var _vcJobYears = ((state.career && state.career.currentJob ? state.career.currentJob.workDays || 0 : 0) / 365);
  if (_vcHasMasterSkill && _vcCertLen >= 5 && _vcJobYears >= 15) {
    triggerVictory(
      state,
      "craftsman",
      "🛠️ 匠人一生！",
      "一件事做到极致。技能满级、证书齐全、三十年坚守——你就是传说中的大国工匠。",
    );
    return;
  }

  // 🏚️ 流浪终老（暗结局：35岁后+无房+赤贫+失业）
  var _vcAgeYear = state.player.day / 365;
  if (_vcAgeYear >= 35 && (!state.housing || state.housing.tier === 0) && state.resources.cash < 500 && !state.career.currentJob) {
    triggerVictory(
      state,
      "homeless",
      "🏚️ 流浪终老",
      "三十五岁后居无定所、身无分文。城市很大，却容不下一个你……",
    );
    return;
  }

  // 🏛️ 体制内消失（暗结局：公务员路径+15年未晋升）
  var _vcCurPath = state.career && state.career.currentJob ? state.career.currentJob.path || "" : "";
  if ((_vcCurPath.indexOf("gov") >= 0 || _vcCurPath.indexOf("civil") >= 0) && _vcJobYears >= 15) {
    var _vcHistory = (state.career.history || []).filter(function (h) {
      return h.event && (h.event.indexOf("晋升") >= 0 || h.event.indexOf("promo") >= 0);
    });
    if (_vcHistory.length <= 1) {
      triggerVictory(
        state,
        "civil_servant",
        "🏛️ 体制内消失",
        "上岸十五年，原地踏步。你成了单位里那个"还在的老同志"。",
      );
      return;
    }
  }

  // 🏙️ 城市套牢（暗结局：房贷车贷占收入>80%持续5年+）
  var _vcMonthlyIncome = _vcCurrentSalary || 1;
  var _vcMonthlyDebt = (state.family && state.family.expenses ? state.family.expenses.monthlyMortgage || 0 : 0) + (state.resources.bankDebt > 0 ? Math.round(state.resources.bankDebt * 0.05) : 0);
  var _vcDebtRatio = _vcMonthlyDebt / _vcMonthlyIncome;
  if (_vcDebtRatio > 0.8 && _vcAgeYear >= 5) {
    triggerVictory(
      state,
      "city_trapped",
      "🏙️ 城市套牢",
      "收入的80%以上都给了银行。房子在，自由却没——这城市套住了你。",
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
  if (state.resources.cash + (state.resources.bankBalance || 0) >= 2000000) {
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
  if (
    typeof lifeMemoir !== "undefined" &&
    typeof lifeMemoir.generateEnding === "function"
  ) {
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
