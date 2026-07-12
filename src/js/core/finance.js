/**
 * 金融计算模块 — 贷款额度动态评估引擎
 *
 * 参考现实银行风控模型，基于玩家身份、职业、学历、资产、负债等综合评估。
 * 设计原则：
 *   1. 失业/无收入 = 不能贷款
 *   2. 月收入是核心指标，贷款额度为月收入 6~12 倍
 *   3. 学历、职业稳定性、负债率、资产、年龄、信贷历史共同影响最终额度
 *   4. 游戏内日息 0.3% 属于"紧急贷款"定位（年化约 109.5%），需明确风险提示
 */

// ====== 学历加成 ======
const EDUCATION_MULTIPLIER = [1.0, 1.2, 1.4]; // 0=大专, 1=本科, 2=研究生

// ====== 计算月收入 ======
/**
 * 根据玩家当前阶段计算月收入
 * @param {Object} state - 游戏状态
 * @returns {number} 月收入（元）
 */
function calculateMonthlyIncome(state) {
  const player = state.player;
  const phase = player.phase;

  if (phase === "corporate") {
    // === 职场阶段 ===
    const rank = CORP_RANKS[player.corporate?.rank || "P5"];
    if (!rank) return 0;

    // 找到当前公司
    const companyId = state.corporate?.companyId;
    let salaryMod = 1.0;
    if (companyId && state.startup?.companies) {
      const company = state.startup.companies.find((c) => c.id === companyId);
      if (company) {
        salaryMod = company.salaryMod || 1.0;
      }
    }

    const monthlySalary =
      rank.baseSalary * (rank.salaryMultiplier || 1.0) * salaryMod;
    return monthlySalary;
  }

  if (phase === "street") {
    // === 街头阶段 ===
    // 街头收入来源：拾荒、摆摊、街头工作等
    // 计算方式：最近 7 天的日均收入 × 22 个工作日
    const transactions = state.resources?.dailyTransactions || [];
    const recentDays = {};

    // 聚合最近 7 天的收入
    for (const tx of transactions) {
      if (tx.type === "income" && tx.category === "job_income") {
        const day = tx.day;
        if (!recentDays[day]) recentDays[day] = 0;
        recentDays[day] += tx.amount;
      }
    }

    const daysWithData = Object.keys(recentDays).length;
    if (daysWithData > 0) {
      const totalRecent = Object.values(recentDays).reduce((a, b) => a + b, 0);
      const avgDaily = totalRecent / daysWithData;
      return Math.round(avgDaily * 22); // 月工作天数约 22 天
    }

    // 无收入记录 → 尝试从街头工作配置估算
    // 如果有固定街头工作（如摆摊），估算日收入
    const hasStreetJob =
      state.flags?.hasStreetStall || state.flags?.hasScavengeRoute;
    if (hasStreetJob) {
      // 保守估算：日收入 ¥50~150，取中值
      return Math.round(100 * 22); // ¥2,200
    }

    return 0; // 完全无收入
  }

  return 0;
}

// ====== 计算职业稳定性系数 ======
function calculateStabilityMultiplier(state) {
  const player = state.player;
  const phase = player.phase;

  if (phase === "street") {
    // 街头阶段：无固定工作 → 极低稳定性
    const hasStreetJob =
      state.flags?.hasStreetStall || state.flags?.hasScavengeRoute;
    return hasStreetJob ? 0.5 : 0.3;
  }

  if (phase === "corporate") {
    // 职场阶段：入职时长 + 职级
    const corpYear = player.corpYear || 0;
    const rank = player.corporate?.rank || "P5";

    let stability = 0.6; // 默认：刚入职
    if (corpYear >= 2) {
      stability = 1.0;
    } else if (corpYear >= 0.5) {
      stability = 0.8;
    }

    // P7+ 额外 +0.1
    const seniorRanks = ["P7", "P8", "P9", "P10"];
    if (seniorRanks.includes(rank)) {
      stability = Math.min(1.1, stability + 0.1);
    }

    return stability;
  }

  return 0.3;
}

// ====== 计算负债率惩罚系数 ======
function calculateDTIPenalty(state, monthlyIncome) {
  if (monthlyIncome <= 0) return 0.05; // 无收入 → 接近拒贷

  // [全系统自洽修复] 域E 修复:运算符优先级——+高于||，导致debt非零时bankDebt和villageDebt被静默忽略
  const totalDebt =
    (state.resources?.debt || 0) +
    (state.resources?.bankDebt || 0) +
    (state.resources?.villageDebt || 0);

  const dtI = totalDebt / monthlyIncome;

  if (dtI < 1) return 1.0;
  if (dtI < 3) return 0.7;
  if (dtI < 5) return 0.4;
  return 0.1; // DTI >= 5，接近拒贷
}

// ====== 计算资产增信 ======
function calculateAssetBonus(state) {
  let bonus = 0;
  const inv = state.investment;

  // 房产增信：房产估值的 5%
  if (inv?.properties) {
    for (const prop of inv.properties) {
      const propValue = prop.currentPrice || prop.buyPrice || 0;
      bonus += propValue * 0.05;
    }
  }

  // 车辆增信：车辆估值的 2%
  if (inv?.cars) {
    for (const car of inv.cars) {
      const carValue = car.currentPrice || car.buyPrice || 0;
      bonus += carValue * 0.02;
    }
  }

  // 银行存款增信
  if (state.resources?.bankBalance > 10000) {
    bonus += 5000;
  }

  return Math.round(bonus);
}

// ====== 计算年龄因子 ======
function calculateAgeFactor(age) {
  if (age < 18) return 0; // 未成年，不能贷款
  if (age < 23) return 0.7; // 刚成年，谨慎
  if (age < 36) return 1.0; // 黄金年龄
  if (age < 46) return 0.9;
  return 0.7;
}

// ====== 计算信贷历史系数 ======
function calculateCreditHistoryFactor(state) {
  const history = state.resources?.bankCreditHistory || [];
  if (history.length === 0) return 1.0; // 无历史记录，中性

  let goodCount = 0;
  let badCount = 0;

  for (const record of history) {
    if (record.repaid && record.rating === "good") {
      goodCount++;
    } else if (!record.repaid || record.rating === "bad") {
      badCount++;
    }
  }

  const total = goodCount + badCount;
  if (total === 0) return 1.0;

  const goodRatio = goodCount / total;
  if (goodRatio >= 0.8) return 1.1; // 良好记录 → +10%
  if (goodRatio >= 0.5) return 1.0; // 中性
  return 0.8; // 有不良记录 → -20%
}

// ====== 核心函数：计算贷款额度 ======
/**
 * 综合评估玩家贷款能力
 * @param {Object} state - 游戏状态
 * @returns {Object} { maxLoan, monthlyRepayment, interestRate, reasons, canLoan }
 */
function calculateLoanCapacity(state) {
  const player = state.player;
  const reasons = [];
  let canLoan = true;

  // Step 1: 基础资格检查
  if (!player || player.day === undefined) {
    return {
      maxLoan: 0,
      monthlyRepayment: 0,
      interestRate: 0.003,
      reasons: ["游戏未开始"],
      canLoan: false,
    };
  }

  if (player.age < 18) {
    return {
      maxLoan: 0,
      monthlyRepayment: 0,
      interestRate: 0.003,
      reasons: ["未成年不能贷款"],
      canLoan: false,
    };
  }

  // Step 2: 计算月收入
  const monthlyIncome = calculateMonthlyIncome(state);

  if (monthlyIncome <= 0) {
    reasons.push({
      key: "income",
      status: "fail",
      text: "无稳定收入（失业/无工作），银行拒绝贷款",
    });
    return {
      maxLoan: 0,
      monthlyRepayment: 0,
      interestRate: 0.003,
      reasons,
      canLoan: false,
    };
  }

  reasons.push({
    key: "income",
    status: "ok",
    text: `月收入 ¥${Math.round(monthlyIncome).toLocaleString()}（${state.player.phase === "corporate" ? "职场" : "街头"}）`,
  });

  // Step 3: 学历加成
  const education = player.education || 0;
  const eduMod = EDUCATION_MULTIPLIER[education] || 1.0;
  const eduLabels = ["大专", "本科", "研究生"];
  reasons.push({
    key: "education",
    status: eduMod > 1.0 ? "ok" : "neutral",
    text: `学历: ${eduLabels[education]}（${eduMod > 1.0 ? "+" + ((eduMod - 1) * 100).toFixed(0) + "%" : "基准"}）`,
  });

  // Step 4: 职业稳定性
  const stabilityMod = calculateStabilityMultiplier(state);
  const stabilityLabels = {
    0.3: "无固定工作（稳定性低）",
    0.5: "街头工作（稳定性一般）",
    0.6: "试用期（稳定性偏低）",
    0.8: "转正中（稳定性良好）",
    1.0: "稳定在职（稳定性高）",
    1.1: "资深员工（稳定性很高）",
  };
  const stabilityLabel = stabilityLabels[stabilityMod] || "在职";
  reasons.push({
    key: "stability",
    status: stabilityMod >= 0.8 ? "ok" : stabilityMod >= 0.5 ? "warn" : "fail",
    text: `职业稳定性: ${stabilityLabel}（×${stabilityMod.toFixed(1)}）`,
  });

  // Step 5: 负债率惩罚
  const dtiMod = calculateDTIPenalty(state, monthlyIncome);
  const totalDebt =
    (state.resources?.debt || 0) +
    (state.resources?.bankDebt || 0) +
    (state.resources?.villageDebt || 0);
  const dtI = totalDebt / monthlyIncome;

  if (dtI >= 1) {
    reasons.push({
      key: "dti",
      status: dtiMod <= 0.4 ? "fail" : "warn",
      text: `负债率: ${dtI.toFixed(1)}倍（已有债务 ¥${Math.round(totalDebt).toLocaleString()}，额度 ${dtiMod === 0.1 ? "接近拒贷" : "大幅降低"}）`,
    });
  } else {
    reasons.push({
      key: "dti",
      status: "ok",
      text: `负债率: ${dtI.toFixed(1)}倍（健康）`,
    });
  }

  // Step 6: 资产增信
  const assetBonus = calculateAssetBonus(state);
  if (assetBonus > 0) {
    reasons.push({
      key: "assets",
      status: "ok",
      text: `资产增信: +¥${Math.round(assetBonus).toLocaleString()}（房产/车辆/存款抵押）`,
    });
  }

  // Step 7: 年龄因子
  const ageFactor = calculateAgeFactor(player.age);
  if (ageFactor === 0) {
    return {
      maxLoan: 0,
      monthlyRepayment: 0,
      interestRate: 0.003,
      reasons: ["未成年不能贷款"],
      canLoan: false,
    };
  }
  if (ageFactor < 1.0) {
    reasons.push({
      key: "age",
      status: "warn",
      text: `年龄 ${player.age} 岁（×${ageFactor.toFixed(1)}，${player.age < 23 ? "刚成年谨慎" : "年龄偏大"}）`,
    });
  }

  // Step 8: 信贷历史
  const creditFactor = calculateCreditHistoryFactor(state);
  if (creditFactor > 1.0) {
    reasons.push({
      key: "credit",
      status: "ok",
      text: `信贷历史: 良好（+10% 额度）`,
    });
  } else if (creditFactor < 1.0) {
    reasons.push({
      key: "credit",
      status: "fail",
      text: `信贷历史: 有不良记录（-20% 额度）`,
    });
  }

  // Step 9: 最终计算
  // 基础倍数：月收入 6~12 倍（根据稳定性调整）
  const baseMultiple = 6 + stabilityMod * 6; // 6~12
  let rawLimit =
    monthlyIncome * baseMultiple * eduMod * dtiMod * ageFactor * creditFactor;

  // 社保信用佐证：激活社保卡 → 额度 +10%（来源：城市服务·社保查询累计≥3次）
  if (state.flags && state.flags._socialCardReady) {
    rawLimit *= 1.1;
    reasons.push({
      key: "social_credit",
      status: "ok",
      text: "社保信用佐证: 社保卡已激活（+10% 额度）",
    });
  }

  // 资产增信
  rawLimit += assetBonus;

  // 绝对上限
  const ABSOLUTE_MAX = 500000;
  let finalLimit = Math.min(rawLimit, ABSOLUTE_MAX);

  // 取整到千位
  finalLimit = Math.max(0, Math.floor(finalLimit / 1000) * 1000);

  // Step 10: 计算利率和月供
  // v3.1：基础日息 0.012%（年化≈4.4%），与存款利率（3.65%）保持合理利差
  // 根据风险上下浮动，最高日息 0.02%（年化≈7.3%）
  const baseDailyRate = 0.00012;
  let riskAdjustment = 1.0;
  if (stabilityMod < 0.5)
    riskAdjustment = 1.3; // 高风险 → 利率上浮 30%
  else if (stabilityMod < 0.8) riskAdjustment = 1.15;
  if (dtiMod <= 0.4) riskAdjustment *= 1.2; // 高负债 → 再上浮 20%
  if (creditFactor < 1.0) riskAdjustment *= 1.1;

  // 征信报告：查过信用报告且记录良好 → 利率降 15%（来源：城市服务·个人信用报告）
  if (state.flags && state.flags._creditInfoReady) {
    riskAdjustment *= 0.85;
    reasons.push({
      key: "credit_report",
      status: "ok",
      text: "征信报告: 记录良好（利率 -15%）",
    });
  }

  const interestRate = Math.min(0.0002, baseDailyRate * riskAdjustment); // 最高日息 0.02%

  // 月供：月收入 30%
  const monthlyRepaymentCap = Math.round(monthlyIncome * 0.3);

  // 最长还款期（月）
  const dailyCostPer10k = interestRate * 10000 * 30; // 每月利息
  let maxMonths = 60;
  if (finalLimit > 0) {
    maxMonths = Math.min(
      60,
      Math.max(
        3,
        Math.floor(monthlyRepaymentCap / (finalLimit * interestRate * 30)),
      ),
    );
  }

  return {
    maxLoan: finalLimit,
    monthlyRepayment: monthlyRepaymentCap,
    interestRate,
    maxMonths,
    baseMultiple: baseMultiple.toFixed(1),
    reasons,
    canLoan: finalLimit > 0,
  };
}

// ====== 贷款发放 ======
/**
 * 发放银行贷款
 * @param {Object} state - 游戏状态
 * @param {number} amount - 贷款金额
 * @returns {boolean} 是否成功
 */
function grantLoan(state, amount) {
  amount = Math.floor(amount);
  if (amount <= 0) {
    StateManager.addMessage("⚠️ 贷款金额必须大于 0。", "warning");
    return false;
  }

  const capacity = calculateLoanCapacity(state);
  if (!capacity.canLoan) {
    StateManager.addMessage(
      "⚠️ " +
        capacity.reasons
          .filter((r) => r.status === "fail")
          .map((r) => r.text)
          .join("、"),
      "danger",
    );
    return false;
  }

  if (amount > capacity.maxLoan) {
    StateManager.addMessage(
      "⚠️ 超过银行授信额度 ¥" + capacity.maxLoan.toLocaleString() + "。",
      "danger",
    );
    return false;
  }

  // 发放贷款
  state.resources.cash += amount;
  state.resources.bankDebt += amount;
  state.resources.bankDebtDay = state.player.day;

  // 记录信贷历史
  state.resources.bankCreditHistory.push({
    day: state.player.day,
    amount: amount,
    repaid: false,
    rating: "pending",
  });

  StateManager.addMessage(
    `📝 银行贷款 ¥${amount.toLocaleString()}，日息 ${(capacity.interestRate * 100).toFixed(3)}%（复利）。请按时还款！`,
    "warning",
  );

  // 记录交易
  if (typeof addDailyTransaction === "function") {
    addDailyTransaction(state, "income", "bank_loan", amount, "银行贷款");
  }

  return true;
}

// ====== 还款 ======
/**
 * 偿还银行贷款
 * @param {Object} state - 游戏状态
 * @param {number} amount - 还款金额
 * @returns {boolean} 是否成功
 */
function repayLoan(state, amount) {
  amount = Math.floor(amount);
  if (amount <= 0) {
    StateManager.addMessage("⚠️ 还款金额必须大于 0。", "warning");
    return false;
  }

  const bankDebt = state.resources.bankDebt || 0;
  if (bankDebt <= 0) {
    StateManager.addMessage("✅ 你并不欠银行钱。", "info");
    return false;
  }

  const actualRepay = Math.min(amount, state.resources.cash, bankDebt);
  if (actualRepay <= 0) {
    StateManager.addMessage("⚠️ 现金不足或无债务可还。", "warning");
    return false;
  }

  state.resources.cash -= actualRepay;
  state.resources.bankDebt -= actualRepay;

  // 更新总债务
  state.resources.debt =
    (state.resources.villageDebt || 0) + (state.resources.bankDebt || 0);

  // 更新信贷记录：若还清，标记为良好
  if (state.resources.bankDebt <= 0) {
    const history = state.resources.bankCreditHistory;
    // 找到最近一笔未结清的贷款记录
    for (let i = history.length - 1; i >= 0; i--) {
      if (!history[i].repaid) {
        history[i].repaid = true;
        history[i].rating = "good";
        history[i].repaidDay = state.player.day;
        break;
      }
    }
    StateManager.addMessage(
      `🏦 还清银行贷款 ¥${actualRepay.toLocaleString()}！信贷记录更新 ✅`,
      "success",
    );
  } else {
    StateManager.addMessage(
      `🏦 偿还银行贷款 ¥${actualRepay.toLocaleString()}。还剩 ¥${state.resources.bankDebt.toLocaleString()}。`,
      "success",
    );
  }

  return true;
}

// ====== 导出（供全局访问）=====
if (typeof window !== "undefined") {
  window.calculateLoanCapacity = calculateLoanCapacity;
  window.grantLoan = grantLoan;
  window.repayLoan = repayLoan;
}
