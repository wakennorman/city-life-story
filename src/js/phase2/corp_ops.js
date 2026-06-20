/**
 * 职场行动执行引擎
 */

/** 执行职场行动 */
function doCorporateAction(actionId) {
  const state = StateManager.getState();
  const action = CORP_ACTIONS.find((a) => a.id === actionId);
  if (!action) return false;

  // 检查职级要求
  if (action.requiresRank) {
    const rankIndex = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(
      state.corporate.rank,
    );
    const requiredIndex = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(
      action.requiresRank,
    );
    if (rankIndex < requiredIndex) {
      StateManager.addMessage(
        `⚠️ 需要${action.requiresRank}以上才能执行此操作。`,
        "warning",
      );
      return false;
    }
  }

  // 检查费用
  if (action.cost && state.resources.cash < action.cost) {
    StateManager.addMessage(`⚠️ 需要 ¥${action.cost}，现金不足。`, "warning");
    return false;
  }

  // 特殊处理：股票交易
  if (action.special === "stock") {
    showStockTradeModal();
    return true;
  }

  // 扣费
  if (action.cost) {
    state.resources.cash -= action.cost;
  }

  // 应用效果（Q4冲刺KPI+50%）
  const c = state.player.corporate;
  const effects = action.effects;
  const sprintBonus = state.flags.q4Sprint ? 1.5 : 1;
  if (effects.kpi)
    c.kpi = Math.max(
      0,
      Math.min(150, c.kpi + Math.round(effects.kpi * sprintBonus)),
    );
  if (effects.ability)
    c.ability = Math.max(0, Math.min(100, c.ability + effects.ability));
  if (effects.hair) c.hair = Math.max(0, Math.min(100, c.hair + effects.hair));
  if (effects.dignity)
    c.dignity = Math.max(0, Math.min(100, c.dignity + effects.dignity));
  if (effects.upwardMgmt)
    c.upwardMgmt = Math.max(
      0,
      Math.min(100, c.upwardMgmt + effects.upwardMgmt),
    );
  if (effects.popularity)
    c.popularity = Math.max(
      0,
      Math.min(100, c.popularity + effects.popularity),
    );
  if (effects.risk) c.risk = Math.max(0, Math.min(100, c.risk + effects.risk));
  if (effects.fatigue)
    state.needs.fatigue = Math.max(
      0,
      Math.min(100, state.needs.fatigue + effects.fatigue),
    );
  if (effects.happiness)
    state.needs.happiness = Math.max(
      0,
      Math.min(100, state.needs.happiness + effects.happiness),
    );
  if (effects.intelligence)
    state.player.intelligence = Math.min(
      100,
      state.player.intelligence + effects.intelligence,
    );

  state.corporate.actionsUsed++;
  StateManager.addMessage(`${action.icon} ${action.name}完成！`, "success");

  // 检查季度是否用完
  const rankData = CORP_RANKS[state.corporate.rank];
  const maxActions = rankData ? rankData.maxActions : 3;
  if (state.corporate.actionsUsed >= maxActions) {
    endQuarter();
  }

  return true;
}

/** 季度结束 */
function endQuarter() {
  const state = StateManager.getState();
  const c = state.corporate;

  // 绩效考核
  const perfResult = calculatePerfScore(state);
  const grade = assignGrade(perfResult.score, state);
  c.perfHistory.push({
    year: state.player.corpYear,
    quarter: state.player.corpQuarter,
    grade: grade.grade,
    score: perfResult.score,
  });

  // 追踪连续C
  if (grade.grade === "C") {
    c.consecutiveC++;
  } else {
    c.consecutiveC = 0;
  }

  // 发放季度工资
  const rankData = CORP_RANKS[c.rank];
  const salary = rankData ? rankData.baseSalary * 3 : 45000;
  state.resources.cash += salary;
  state.resources.totalEarned += salary;
  addDailyTransaction(
    state,
    "income",
    "salary",
    salary,
    "季度工资 - " + c.rank,
  );

  StateManager.addMessage(
    `💰 Q${c.corpQuarter} 结束。工资到账 ¥${salary.toLocaleString()}。绩效: ${grade.grade}`,
    "success",
  );

  // Q1 年终奖（发放后清除冲刺标记）
  if (c.corpQuarter === 1 && c.perfHistory.length >= 4) {
    const bonusMultiplier =
      { "S+": 3, S: 2, A: 1.5, B: 1, C: 0 }[grade.grade] || 0;
    const bonus = Math.round(rankData.baseSalary * bonusMultiplier);
    if (bonus > 0) {
      state.resources.cash += bonus;
      addDailyTransaction(
        state,
        "income",
        "salary",
        bonus,
        "年终奖 - 绩效" + grade.grade,
      );
      StateManager.addMessage(
        `🎉 年终奖到账！绩效 ${grade.grade}，奖金 ¥${bonus.toLocaleString()}！`,
        "success",
      );
    }
    state.flags.q4Sprint = false;
  }

  // Q4 冲刺（下季度 KPI 增益 +50%）
  if (c.corpQuarter === 4) {
    state.flags.q4Sprint = true;
    StateManager.addMessage(
      "🏃 进入Q4冲刺季！下季度所有KPI增益+50%，绩效评分×1.1。",
      "event",
    );
  }

  // Q3 晋升判定
  if (c.corpQuarter === 3) {
    const promoResult = checkPromotion(state);
    if (promoResult) {
      applyPromotion(state, promoResult);
    }
  }

  // 更新股票市场（延迟初始化+每季度行情刷新）
  if (
    typeof initStockMarket === "function" &&
    Object.keys(c.stockMarket || {}).length === 0
  ) {
    initStockMarket(state);
  }
  if (
    typeof updateStockPrices === "function" &&
    Object.keys(c.stockMarket || {}).length > 0
  ) {
    updateStockPrices(state, false);
  }

  // 职场随机事件
  if (Random.chance(0.2)) {
    rollCorporateEvent(state);
  }

  // ====== Phase 2: 季末内幕交易审查 ======
  if (typeof auditInsiderTrading === "function") {
    var auditResults = auditInsiderTrading(state);
    if (auditResults && auditResults.length > 0) {
      // 已在 auditInsiderTrading 中发送消息
    }
  }

  // ====== Phase 2: 创业系统季度结算（已移至每日管线 tickStartup(daily)）======

  // ====== Phase 2: 检查创业公司收购要约（季度检查）======
  if (typeof getAcquisitionOffer === "function") {
    var offer = getAcquisitionOffer(state);
    if (offer) {
      // 显示收购要约弹窗
      if (typeof showAcquisitionModal === "function") {
        showAcquisitionModal(state);
      }
    }
  }

  // ====== Phase 2: 检查交易处罚是否到期 ======
  if (typeof checkTradingPenalty === "function") {
    checkTradingPenalty(state);
  }

  // 推进季度
  c.actionsUsed = 0;
  if (c.corpQuarter >= 4) {
    c.corpQuarter = 1;
    state.player.corpYear++;
    state.player.age++;
    StateManager.addMessage(
      `🎂 又一年过去了，你现在${state.player.age}岁了。`,
      "event",
    );
  } else {
    c.corpQuarter++;
  }

  // 失败条件
  checkCorpLoseConditions(state);
  // 胜利条件
  checkCorpWinConditions(state);

  autoSave();
}

/** 进入职场阶段 */
function enterCorporatePhase(companyId) {
  const state = StateManager.getState();
  const p = state.player;

  // 多周目保护：如果所选公司已倒闭，自动选一个活着的
  if (typeof isCompanyDeceased === "function" && isCompanyDeceased(companyId)) {
    var alive =
      typeof getAvailableCompanies === "function"
        ? getAvailableCompanies()
        : COMPANIES;
    if (alive.length > 0) {
      companyId = alive[0].id;
      StateManager.addMessage(
        "⚠️ 你选择的公司已在历史中倒闭，自动转向" + alive[0].name,
        "warning",
      );
    }
  }

  const company =
    COMPANIES.find((c) => c.id === (companyId || "star_tech")) || COMPANIES[0];

  p.phase = "corporate";
  p.corpYear = 1;
  p.corpQuarter = 1;

  p.corporate.hair = 100;
  p.corporate.dignity = Math.min(100, Math.round(p.mental * 1.2));
  p.corporate.upwardMgmt = Math.min(
    100,
    Math.round(state.skills.sales.level * 0.8 + 15),
  );
  p.corporate.kpi = Math.min(
    150,
    Math.round(p.agility * 0.5 + state.skills.coding.level * 0.5 + 15),
  );
  p.corporate.ability = Math.min(
    100,
    Math.round(p.intelligence * 0.8 + state.skills.coding.level * 0.5 + 10),
  );
  p.corporate.risk = Math.min(100, 8 + Random.int(0, 11));
  p.corporate.popularity = Math.min(
    100,
    Math.round(state.player.fame * 0.5 + 25),
  );

  state.corporate.rank = "P5";
  state.corporate.company = company;
  state.corporate.joinedDay = p.day;
  state.corporate.actionsUsed = 0;

  // 初始化股票市场
  if (typeof initStockMarket === "function") {
    initStockMarket(state);
    if (typeof bootstrapStockHistory === "function") {
      bootstrapStockHistory(state);
    }
  }

  // 立即初始化投资系统（首日即显示走势图）
  if (typeof initInvestment === "function") {
    initInvestment(state);
  }

  // 张姐内推：入职时额外向上管理+10、人缘+10（有人脉就是不一样）
  if (state.flags.zhangReferred) {
    p.corporate.upwardMgmt = Math.min(100, p.corporate.upwardMgmt + 10);
    p.corporate.popularity = Math.min(100, p.corporate.popularity + 10);
    StateManager.addMessage(
      "🤝 张姐内推加分：向上管理和人缘都好了不少！",
      "success",
    );
  }
  // 小美实习引荐：入职时额外能力+15、KPI+10（实习经历是资本）
  if (state.flags.xiaomeiInternship) {
    p.corporate.ability = Math.min(100, p.corporate.ability + 15);
    p.corporate.kpi = Math.min(150, p.corporate.kpi + 10);
    StateManager.addMessage(
      "💻 小美的实习引荐：工作能力和KPI起点高了不少！",
      "success",
    );
  }

  StateManager.addMessage(
    `🏢 入职 ${company.name}！从P5开始职场生涯。${company.culture}。`,
    "success",
  );
  StateManager.addMessage(
    "💡 做项目提升KPI，向上社交获取信任。每季度有行动次数限制。Q3有晋升答辩。",
    "info",
  );

  document.querySelector(".modal-overlay")?.remove();
  currentTab = "actions";
  renderAll();
}
