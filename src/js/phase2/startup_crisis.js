/**
 * 创业危机事件系统 — Phase 2 深度交互
 *
 * 包含：
 * 1. 资金链危机 — 现金流断裂、紧急融资、资产变现
 * 2. 团队危机 — 核心员工离职、团队内讧、集体罢工
 * 3. 产品危机 — 重大BUG、用户流失、竞品碾压
 * 4. 公关危机 — 负面舆情、媒体曝光、用户维权
 * 5. 法律危机 — 诉讼纠纷、知识产权、合规问题
 * 6. 竞争危机 — 巨头入场、价格战、人才挖角
 */

// ====== 危机事件定义 ======
const STARTUP_CRISIS_EVENTS = {
  // 资金链危机
  cash_crunch: {
    id: "cash_crunch",
    name: "资金链告急",
    icon: "💸",
    severity: ["warning", "danger", "critical"],
    trigger: { monthsOfRunway: 2, probability: 0.15 },
    desc: "公司现金流只够维持不到2个月，必须尽快找到资金",
    options: [
      {
        text: "紧急融资",
        effect: "需要估值≥500万，成功则获得资金但稀释股权，失败则声誉受损",
        cost: 0,
        risk: "高",
        successChance: 0.5,
      },
      {
        text: "裁员降本",
        effect: "裁员30%，现金消耗减少40%，但团队忠诚度-30，声誉-15",
        cost: 0,
        risk: "中",
        successChance: 1.0,
      },
      {
        text: "变卖资产",
        effect: "卖掉办公设备/房产，获得现金但影响运营",
        cost: 0,
        risk: "中",
        successChance: 1.0,
      },
      {
        text: "创始人自掏腰包",
        effect: "从个人现金注入公司，需要个人现金≥10万",
        cost: "个人现金",
        risk: "低",
        successChance: 1.0,
      },
      {
        text: "借高利贷",
        effect: "快速获得资金，但月利息10%，后续麻烦不断",
        cost: 0,
        risk: "极高",
        successChance: 0.8,
      },
    ],
  },

  // 核心员工离职
  key_employee_leaving: {
    id: "key_employee_leaving",
    name: "核心员工离职",
    icon: "👋",
    severity: ["warning", "danger"],
    trigger: { employeeCount: 5, loyaltyLow: true, probability: 0.1 },
    desc: "核心技术人员/销售骨干收到竞品offer，准备离职",
    options: [
      {
        text: "加薪挽留",
        effect: "薪资+50%，该员工忠诚度+40，但其他员工期望加薪",
        cost: "薪资成本+50%",
        risk: "中",
        successChance: 0.7,
      },
      {
        text: "给期权",
        effect: "授予期权（稀释0.5-1%），忠诚度+30，员工感受到重视",
        cost: "股权稀释",
        risk: "低",
        successChance: 0.6,
      },
      {
        text: "谈心了解诉求",
        effect: "需要该员工忠诚度≥40，成功则了解真实原因并针对性解决",
        cost: 0,
        risk: "低",
        successChance: 0.5,
      },
      {
        text: "放人",
        effect: "该员工离开，技术分/市场分-10，但避免内耗",
        cost: "能力-10",
        risk: "低",
        successChance: 1.0,
      },
    ],
  },

  // 重大BUG
  major_bug: {
    id: "major_bug",
    name: "重大产品BUG",
    icon: "🐛",
    severity: ["warning", "danger", "critical"],
    trigger: { productLaunched: true, userCount: 1000, probability: 0.08 },
    desc: "产品出现严重BUG，影响大量用户，投诉激增",
    options: [
      {
        text: "紧急修复",
        effect: "需要工程师团队，2-3天修复，用户满意度短期下降",
        cost: "工程师时间",
        risk: "中",
        successChance: 0.8,
      },
      {
        text: "发布公告道歉",
        effect: "坦诚沟通，用户理解度+20，但需要后续快速修复",
        cost: 0,
        risk: "低",
        successChance: 0.9,
      },
      {
        text: "补偿用户",
        effect: "给受影响用户发放优惠券/退款，成本较高但挽回口碑",
        cost: "¥5000-20000",
        risk: "低",
        successChance: 0.85,
      },
      {
        text: "冷处理",
        effect: "不回应，风险极大，可能被媒体曝光放大",
        cost: 0,
        risk: "极高",
        successChance: 0.2,
      },
    ],
  },

  // 负面舆情
  negative_pr: {
    id: "negative_pr",
    name: "负面舆情爆发",
    icon: "📰",
    severity: ["danger", "critical"],
    trigger: { reputation: 50, probability: 0.05 },
    desc: "媒体/大V曝光公司负面新闻，舆论发酵中",
    options: [
      {
        text: "官方回应",
        effect: "需要事实清晰，成功则平息舆论，失败则越描越黑",
        cost: 0,
        risk: "中",
        successChance: 0.5,
      },
      {
        text: "找媒体公关",
        effect: "花费¥20000-50000，转移舆论焦点",
        cost: "¥20000-50000",
        risk: "中",
        successChance: 0.6,
      },
      {
        text: "法律手段",
        effect: "起诉造谣者，需要证据确凿，成功则震慑但耗时",
        cost: "法律费用",
        risk: "中",
        successChance: 0.4,
      },
      {
        text: "沉默应对",
        effect: "冷处理，舆论可能自然消退，也可能持续发酵",
        cost: 0,
        risk: "高",
        successChance: 0.3,
      },
    ],
  },

  // 巨头入场
  giant_enters: {
    id: "giant_enters",
    name: "巨头进入赛道",
    icon: "🦄",
    severity: ["warning", "danger"],
    trigger: { marketScore: 30, probability: 0.06 },
    desc: "行业巨头宣布进入你的赛道，资源碾压式的竞争",
    options: [
      {
        text: "差异化竞争",
        effect: "聚焦细分市场，需要产品有独特优势，成功则稳住用户",
        cost: 0,
        risk: "中",
        successChance: 0.4,
      },
      {
        text: "价格战",
        effect: "降价抢用户，需要资金充足，否则撑不住",
        cost: "利润损失",
        risk: "高",
        successChance: 0.3,
      },
      {
        text: "寻求被收购",
        effect: "主动找巨头谈收购，可能获得不错报价",
        cost: 0,
        risk: "低",
        successChance: 0.5,
      },
      {
        text: "转型其他赛道",
        effect: "放弃当前方向，需要快速调整，风险高",
        cost: "前期投入沉没",
        risk: "极高",
        successChance: 0.2,
      },
    ],
  },

  // 数据泄露
  data_breach: {
    id: "data_breach",
    name: "用户数据泄露",
    icon: "🔓",
    severity: ["danger", "critical"],
    trigger: { userCount: 5000, probability: 0.03 },
    desc: "公司用户数据被黑客攻击泄露，涉及大量个人信息",
    options: [
      {
        text: "立即公告",
        effect: "坦诚告知用户，建议用户修改密码，配合调查",
        cost: 0,
        risk: "低",
        successChance: 0.7,
      },
      {
        text: "聘请安全团队",
        effect: "花费¥50000+，全面排查漏洞，修复安全问题",
        cost: "¥50000+",
        risk: "低",
        successChance: 0.8,
      },
      {
        text: "掩盖真相",
        effect: "风险极高，一旦曝光公司将万劫不复",
        cost: 0,
        risk: "极高",
        successChance: 0.1,
      },
    ],
  },

  // 投资人撤资
  investor_withdraw: {
    id: "investor_withdraw",
    name: "投资人要求撤资",
    icon: "📉",
    severity: ["danger", "critical"],
    trigger: { fundingRounds: 1, performancePoor: true, probability: 0.04 },
    desc: "投资人对公司表现不满，要求提前退出或减少后续投资",
    options: [
      {
        text: "说服继续投资",
        effect: "需要展示增长潜力和清晰规划，成功则留住投资",
        cost: 0,
        risk: "中",
        successChance: 0.4,
      },
      {
        text: "找新投资人",
        effect: "紧急接触新投资人接盘，需要估值有吸引力",
        cost: 0,
        risk: "高",
        successChance: 0.3,
      },
      {
        text: "回购股份",
        effect: "用公司现金回购投资人股份，需要资金充足",
        cost: "大量现金",
        risk: "高",
        successChance: 1.0,
      },
      {
        text: "接受撤资",
        effect: "投资人退出，公司失去重要支持，声誉-20",
        cost: "声誉-20，资金减少",
        risk: "高",
        successChance: 1.0,
      },
    ],
  },

  // 知识产权纠纷
  ip_dispute: {
    id: "ip_dispute",
    name: "知识产权纠纷",
    icon: "⚖️",
    severity: ["warning", "danger"],
    trigger: { technologyScore: 30, probability: 0.05 },
    desc: "被指控侵犯他人专利权/著作权，面临诉讼风险",
    options: [
      {
        text: "和解",
        effect: "支付赔偿金¥50000-200000，换取撤诉",
        cost: "¥50000-200000",
        risk: "低",
        successChance: 0.9,
      },
      {
        text: "应诉到底",
        effect: "聘请律师团队，胜诉则无损，败诉则赔偿+声誉受损",
        cost: "法律费用",
        risk: "高",
        successChance: 0.4,
      },
      {
        text: "技术规避",
        effect: "修改产品绕过专利，需要技术团队能力足够",
        cost: "开发时间",
        risk: "中",
        successChance: 0.5,
      },
    ],
  },
};

/**
 * 检查并触发创业危机
 */
function checkStartupCrises(state) {
  const startup = state.startup;
  if (!startup || !startup.company) return null;

  const company = startup.company;
  const day = state.player.day;

  // 随机触发
  for (const [crisisId, crisis] of Object.entries(STARTUP_CRISIS_EVENTS)) {
    if (!Random.chance(crisis.trigger.probability)) continue;

    // 检查触发条件
    if (!checkCrisisTriggerConditions(crisis, company)) continue;

    // 检查冷却期（同一危机30天内不重复触发）
    if (company.lastCrisisDay && day - company.lastCrisisDay < 30) continue;

    company.lastCrisisDay = day;
    return { crisisId, crisis };
  }

  return null;
}

/**
 * 检查危机触发条件
 */
function checkCrisisTriggerConditions(crisis, company) {
  const trigger = crisis.trigger;

  if (
    trigger.monthsOfRunway !== undefined &&
    company.monthsOfRunway > trigger.monthsOfRunway
  )
    return false;
  if (
    trigger.employeeCount !== undefined &&
    company.employees.length < trigger.employeeCount
  )
    return false;
  if (trigger.userCount !== undefined) {
    const maxUsers = Math.max(
      0,
      ...(company.products || []).map((p) => p.users || 0),
    );
    if (maxUsers < trigger.userCount) return false;
  }
  if (
    trigger.reputation !== undefined &&
    company.reputation > trigger.reputation
  )
    return false;
  if (
    trigger.technologyScore !== undefined &&
    company.technologyScore < trigger.technologyScore
  )
    return false;

  return true;
}

/**
 * 显示危机弹窗
 */
function showCrisisModal(state, crisisId, crisis) {
  const company = state.startup.company;
  if (!company) return;

  // 确定严重程度
  let severityIndex = 0;
  if (company.monthsOfRunway < 1) severityIndex = 2;
  else if (company.monthsOfRunway < 2) severityIndex = 1;

  const severity =
    crisis.severity[Math.min(severityIndex, crisis.severity.length - 1)];

  const body = `
    <div style="font-size:13px;">
      <div style="padding:16px;background:var(--bg-card);border-radius:8px;margin-bottom:12px;border-left:4px solid var(--${severity});">
        <div style="font-size:16px;font-weight:bold;margin-bottom:8px;color:var(--${severity});">
          ${crisis.icon} ${crisis.name}
        </div>
        <div style="font-size:11px;color:var(--text-secondary);line-height:1.6;">
          ${crisis.desc}
        </div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:8px;">
          当前状态：Runway ${Math.round(company.monthsOfRunway)}月 | 估值 ¥${Math.round(company.valuation).toLocaleString()} | 团队 ${company.employees.length}人
        </div>
      </div>

      <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">选择应对方案：</div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        ${crisis.options
          .map(
            (opt, i) => `
          <div style="padding:10px;background:var(--bg-secondary);border-radius:6px;border:1px solid var(--border);cursor:pointer;" onclick="handleCrisisChoice('${crisisId}', ${i})">
            <div style="font-size:12px;font-weight:bold;margin-bottom:4px;">${opt.text}</div>
            <div style="font-size:10px;color:var(--text-muted);">效果：${opt.effect}</div>
            <div style="font-size:9px;color:var(--text-muted);margin-top:4px;">
              成本：${opt.cost} | 风险：${opt.risk} | 成功率：${Math.round(opt.successChance * 100)}%
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;

  showModal({
    title: `${crisis.icon} 创业危机：${crisis.name}`,
    body: body,
    buttons: [{ text: "取消", cls: "", callback: () => {} }],
  });

  state._pendingCrisis = { crisisId, crisis };
}

/**
 * 处理危机选择
 */
function handleCrisisChoice(crisisId, optionIndex) {
  const state = StateManager.getState();
  const pending = state._pendingCrisis;
  if (!pending) return;

  const { crisis, crisisId: pendingCrisisId } = pending;
  const option = crisis.options[optionIndex];

  // 执行选择
  applyCrisisChoice(state, pendingCrisisId, option);

  document.querySelector(".modal-overlay")?.remove();
  state._pendingCrisis = null;

  renderAll();
}

/**
 * 应用危机选择效果
 */
function applyCrisisChoice(state, crisisId, option) {
  const startup = state.startup;
  const company = startup.company;
  if (!company) return;

  // 计算成功率
  const success = Random.chance(option.successChance);

  if (success) {
    // 成功效果
    StateManager.addMessage(`✅ 危机应对成功：${option.text}`, "success");

    // 根据选项类型应用效果
    if (option.text.includes("融资")) {
      // [全系统自洽修复] 域E A类修复: cashReserve/valuation NaN 守卫
      if (!isFinite(company.valuation) || company.valuation <= 0) company.valuation = 1000000;
      const raiseAmount = Math.round(company.valuation * 0.1);
      const dilution = Random.float(0.1, 0.2);
      company.cashReserve = (isFinite(company.cashReserve) ? company.cashReserve : 0) + raiseAmount;
      company.valuation = Math.round(
        company.valuation + raiseAmount / dilution,
      );
      company.equity.investors += dilution * 100;
      company.equity.player = Math.round(
        company.equity.player * (1 - dilution),
      );
    }

    if (option.text.includes("裁员")) {
      const toFire = Math.min(
        company.employees.length,
        Math.ceil(company.employees.length * 0.3),
      );
      for (let i = 0; i < toFire; i++) {
        company.employees.pop();
      }
      // [全系统自洽修复] 域E A类修复: cashReserve NaN 守卫
      company.cashReserve = (isFinite(company.cashReserve) ? company.cashReserve : 0) + 5000 * toFire;
      company.reputation = Math.max(0, (company.reputation || 0) - 15);
    }

    if (option.text.includes("变卖")) {
      var _cr = isFinite(company.cashReserve) ? company.cashReserve : 0;
      company.cashReserve = _cr + Math.round(_cr * 0.3);
      company.marketScore = Math.max(0, (company.marketScore || 0) - 10);
    }

    if (option.text.includes("自掏")) {
      // [全系统自洽修复] 域E A类修复: cash NaN 守卫（防止旧存档/极端值导致现金永久损坏）
      var _personalCash = isFinite(state.resources.cash) ? state.resources.cash : 0;
      const injectAmount = Math.min(_personalCash, 100000);
      state.resources.cash = _personalCash - injectAmount;
      company.cashReserve = (isFinite(company.cashReserve) ? company.cashReserve : 0) + injectAmount;
    }

    if (option.text.includes("加薪")) {
      for (const emp of company.employees) {
        emp.salary = Math.round(emp.salary * 1.5);
        emp.loyalty = Math.min(100, emp.loyalty + 40);
      }
      company.burnRate = Math.round(company.burnRate * 1.3);
    }

    if (option.text.includes("期权")) {
      company.equity.employees += 0.5;
      company.equity.player = Math.max(0, company.equity.player - 0.5);
      for (const emp of company.employees) {
        emp.loyalty = Math.min(100, emp.loyalty + 30);
      }
    }

    if (option.text.includes("公告")) {
      company.reputation = Math.min(100, company.reputation + 10);
    }

    if (option.text.includes("补偿")) {
      const cost = Random.int(5000, 19999);
      // [全系统自洽修复] 域E A类修复: cashReserve NaN 守卫
      company.cashReserve = Math.max(0, (isFinite(company.cashReserve) ? company.cashReserve : 0) - cost);
      company.reputation = Math.min(100, (company.reputation || 0) + 15);
    }

    if (option.text.includes("公关")) {
      const cost = Random.int(20000, 49999);
      // [全系统自洽修复] 域E A类修复: cashReserve NaN 守卫
      company.cashReserve = Math.max(0, (isFinite(company.cashReserve) ? company.cashReserve : 0) - cost);
      company.reputation = Math.min(100, (company.reputation || 0) + 20);
    }

    if (option.text.includes("和解")) {
      const cost = Random.int(50000, 199999);
      company.cashReserve = Math.max(0, company.cashReserve - cost);
      company.reputation = Math.max(0, company.reputation - 5);
    }

    // 记录危机历史
    if (!company.crisisHistory) company.crisisHistory = [];
    company.crisisHistory.push({
      crisisId: crisisId,
      day: state.player.day,
      choice: option.text,
      success: true,
    });
  } else {
    // 失败效果
    StateManager.addMessage(
      `❌ 危机应对失败：${option.text}，情况恶化`,
      "danger",
    );

    if (option.text.includes("融资")) {
      company.reputation = Math.max(0, company.reputation - 20);
    }

    if (option.text.includes("应诉")) {
      company.cashReserve = Math.max(0, company.cashReserve - 100000);
      company.reputation = Math.max(0, company.reputation - 20);
    }

    if (option.text.includes("冷处理")) {
      company.reputation = Math.max(0, company.reputation - 30);
    }

    // 记录危机历史
    if (!company.crisisHistory) company.crisisHistory = [];
    company.crisisHistory.push({
      crisisId: crisisId,
      day: state.player.day,
      choice: option.text,
      success: false,
    });
  }

  // 检查是否破产
  if (company.cashReserve <= 0 && company.monthsOfRunway <= 0) {
    if (typeof bankrupt === "function") {
      bankrupt(state);
    }
  }
}

/**
 * 获取危机摘要
 */
if (typeof getCrisisSummary === "undefined") {
function getCrisisSummary(company) {
  if (!company.crisisHistory || company.crisisHistory.length === 0) {
    return { total: 0, survived: 0, failed: 0 };
  }

  const total = company.crisisHistory.length;
  const survived = company.crisisHistory.filter((c) => c.success).length;
  const failed = total - survived;

  return {
    total,
    survived,
    failed,
    survivalRate: Math.round((survived / total) * 100),
  };
}
}

/**
 * 百科注册
 */
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.startup_crisis = {
    id: "startup_crisis",
    name: "创业危机事件",
    icon: "🚨",
    brief: "资金链危机、团队危机、产品危机、公关危机、法律危机、竞争危机",
    version: "1.0.0",
    related: ["mechanics:startup_system", "mechanics:corp_ops"],
    sections: [
      {
        kind: "desc",
        text: "创业路上危机四伏，每一次危机都是对创始人决策能力和心理素质的考验。",
      },
      {
        kind: "subhead",
        text: "🚨 危机类型",
      },
      {
        kind: "list",
        items: [
          "💸 资金链告急：现金流断裂，需要紧急融资或降本",
          "👋 核心员工离职：技术/销售骨干被挖角",
          "🐛 重大产品BUG：影响大量用户，投诉激增",
          "📰 负面舆情爆发：媒体曝光，舆论发酵",
          "🦄 巨头进入赛道：资源碾压式竞争",
          "🔓 用户数据泄露：黑客攻击，隐私曝光",
          "📉 投资人撤资：对表现不满要求退出",
          "⚖️ 知识产权纠纷：专利/著作权诉讼",
        ],
      },
      {
        kind: "tip",
        text: "💡 提示：危机应对没有完美方案，每个选择都有代价。提前储备现金、维护团队忠诚度、建立良好公关关系可以降低危机发生概率。",
      },
    ],
  };
}
