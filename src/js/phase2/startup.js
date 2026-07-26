// ====== 生成唯一ID ======
function _startupGenerateId() {
  return (
    "sid_" + Random.int(100000, 999999) + "_" + Random.float(0, 1).toString(36).substr(2, 9)
  );
}

// ====== 生成公司名 ======
function _startupGenerateCompanyName(industry) {
  const prefixes = {
    tech: ["智", "云", "星", "闪", "极", "元", "深", "联"],
    consumer: ["优", "美", "鲜", "乐", "惠", "好", "精", "趣"],
    finance: ["安", "信", "富", "盈", "通", "稳", "金", "融"],
    healthcare: ["康", "健", "仁", "寿", "安", "和", "泰", "宁"],
    education: ["启", "智", "博", "雅", "明", "慧", "学", "思"],
    manufacturing: ["工", "创", "精", "智", "新", "科", "力", "恒"],
  };
  const suffixes = [
    "科技",
    "智能",
    "创新",
    "数字",
    "云图",
    "智联",
    "未来",
    "先锋",
    "卓越",
    "天成",
  ];
  const industryPrefixes = prefixes[industry] || prefixes.tech;
  const prefix = Random.fromArray(industryPrefixes);
  const suffix = Random.fromArray(suffixes);
  return prefix + suffix;
}

// ====== 生成联合创始人 ======
function _startupGenerateCoFounder(index) {
  const names = [
    "老陈",
    "阿杰",
    "小美",
    "老张",
    "阿强",
    "小林",
    "小芳",
    "老李",
  ];
  const skills = [
    "coding",
    "sales",
    "management",
    "design",
    "marketing",
    "accounting",
  ];
  const personalities = [
    { id: "visionary", name: "愿景驱动", desc: "长期主义，能说服投资人" },
    { id: "executor", name: "执行狂人", desc: "落地能力强，但缺乏耐心" },
    { id: "tech_paranoic", name: "技术偏执", desc: "产品极致，不懂商业" },
    { id: "sales_shark", name: "销售鲨鱼", desc: "搞定客户，但技术理解浅" },
    { id: "balanced", name: "均衡型", desc: "各方面都不差，也不突出" },
  ];

  const name = names[index % names.length];
  const skill = Random.fromArray(skills);
  const personality = Random.fromArray(personalities);
  const equityReq = Random.int(5, 19);

  return {
    id: "cofounder_" + index,
    name: name,
    skill: skill,
    skillLevel: Random.int(50, 79),
    personality: personality,
    equityRequest: equityReq,
    joinedDay: null,
    loyalty: Random.int(70, 89),
  };
}

/**
 * 获取创业系统触发条件（剧本感知）
 * 去除硬编码 day>200，改为按剧本设置不同的资金/职级门槛
 */
function getStartupTriggerConditions(state) {
  var scenarioId = state.flags && state.flags._scenarioId;
  var careerJob = state.career && state.career.currentJob;
  var phase =
    state.player && state.player.phase === "corporate"
      ? "corporate"
      : careerJob
        ? "corporate"
        : "street";
  var cash = (state.resources && state.resources.cash) || 0;

  // 各剧本触发条件（v3.3 降低经典/下岗/应届门槛，使街头→创业路径可达）
  var conditions = {
    classic: {
      street: { cash: 15000, label: "街头发家" },
      corporate: { rank: "P5", cash: 15000, label: "职场攒够启动金" },
    },
    laid_off: {
      street: { cash: 15000, label: "摆摊/零工攒够本钱" },
      corporate: { rank: "P5", cash: 15000, label: "技术岗转创业" },
    },
    small_town_grinder: {
      street: { cash: 25000, label: "白领工作积累" },
      corporate: { rank: "P5", cash: 25000, label: "大厂经验+启动金" },
    },
    foreign_worker: {
      street: { cash: 10000, label: "省吃俭用攒下第一桶金" },
      corporate: { rank: "P5", cash: 10000, label: "技术移民转创业" },
    },
    second_gen: {
      street: { cash: 25000, label: "家里支持启动资金" },
      corporate: { rank: "P5", cash: 25000, label: "家里支持启动资金" },
    },
    midlife_crisis: {
      street: { cash: 25000, label: "补偿金/积蓄转型" },
      corporate: { rank: "P6", cash: 25000, label: "P6+管理经验转型" },
    },
    fresh_grad: {
      street: { cash: 15000, label: "实习+兼职攒钱" },
      corporate: { rank: "P5", cash: 15000, label: "职场新人创业梦" },
    },
  };

  var cond = conditions[scenarioId];
  if (!cond) cond = conditions.classic;
  var pc = cond[phase] || cond.street;
  var baseCash = pc.cash || 50000;
  var discount =
    typeof getCareerCapitalStartupDiscount === "function"
      ? getCareerCapitalStartupDiscount(state)
      : 0;
  var requiredCash = Math.max(10000, Math.floor(baseCash * (1 - discount)));
  var rankMet = true;
  if (phase === "corporate" && pc.rank) {
    var rankNames = ["P5", "P6", "P7", "P8", "P9", "P10"];
    var reqIdx = rankNames.indexOf(pc.rank);
    var playerRank = getStartupEffectiveCareerRank(state);
    var pIdx = rankNames.indexOf(playerRank);
    rankMet = pIdx >= reqIdx;
  }
  return {
    cashRequired: requiredCash,
    baseCashRequired: baseCash,
    careerDiscount: discount,
    phase: phase,
    rankRequired: pc.rank || null,
    effectiveRank:
      phase === "corporate" ? getStartupEffectiveCareerRank(state) : null,
    label: pc.label || "资源积累",
    cashOk: cash >= (requiredCash || 50000),
    rankOk: rankMet,
    canRegister: cash >= (requiredCash || 50000) && rankMet,
    met: cash >= (requiredCash || 50000) && rankMet,
  };
}

function getStartupEffectiveCareerRank(state) {
  var rankNames = ["P5", "P6", "P7", "P8", "P9", "P10"];
  var rank = state && state.corporate && state.corporate.rank;
  var job = state && state.career && state.career.currentJob;
  if (!job || !job.levelId) return rank || "P5";
  var jobRank = "P5";
  if (/_lead|_manager|_director|_head|_partner|_architect/.test(job.levelId)) {
    jobRank = "P8";
  } else if (/_senior/.test(job.levelId)) {
    jobRank = "P7";
  } else if (/_mid/.test(job.levelId)) {
    jobRank = "P6";
  }
  return rankNames.indexOf(jobRank) > rankNames.indexOf(rank || "P5")
    ? jobRank
    : rank || "P5";
}

function getStartupRegistrationCost(state) {
  var stc = getStartupTriggerConditions(state);
  var base = stc.cashRequired || 50000;
  // [全系统自洽修复] 域G A类: 创业路线(_routeStartupCostMod)应减免注册费，此前仅 UI 展示未实际生效
  var mod = state.flags && isFinite(state.flags._routeStartupCostMod)
    ? state.flags._routeStartupCostMod
    : 1.0;
  if (mod > 0 && mod < 1) base = Math.round(base * mod);
  return base;
}

/** 打开注册公司弹窗 */
function showStartupRegisterModal() {
  var state = StateManager.getState();
  var cash = (state.resources && state.resources.cash) || 0;
  var registerCost = getStartupRegistrationCost(state);
  var readinessNote =
    typeof getStartupReadinessNote === "function"
      ? getStartupReadinessNote(state)
      : "";
  if (cash < registerCost) {
    StateManager.addMessage(
      "⚠️ 注册公司需要 ¥" + registerCost.toLocaleString() + " 启动资金。",
      "warning",
    );
    return;
  }

  // 构建行业选择 HTML
  var industryHtml = "";
  for (var indKey in STARTUP_INDUSTRIES) {
    if (STARTUP_INDUSTRIES.hasOwnProperty(indKey)) {
      var ind = STARTUP_INDUSTRIES[indKey];
      industryHtml +=
        '<label style="display:block;padding:6px 8px;margin:2px 0;border:1px solid var(--border);border-radius:4px;cursor:pointer;">' +
        '<input type="radio" name="startup-industry" value="' +
        indKey +
        '"> ' +
        ind.icon +
        " <strong>" +
        ind.name +
        "</strong> — " +
        ind.desc +
        "</label>";
    }
  }

  var bodyHtml =
    '<div style="font-size:13px;">' +
    "<p>注册公司需缴纳 <strong>¥" +
    registerCost.toLocaleString() +
    "</strong> 启动资金。选择行业后即可开始创业之旅。</p>" +
    (readinessNote
      ? '<div style="padding:8px 10px;margin:8px 0;background:rgba(74,158,92,0.08);border:1px solid rgba(74,158,92,0.22);border-radius:6px;font-size:12px;color:var(--text-secondary);">💼 ' +
        readinessNote +
        "</div>"
      : "") +
    '<div style="margin:12px 0;">' +
    '<label style="font-weight:600;font-size:12px;">🏢 公司名称</label>' +
    '<input id="startup-name-input" type="text" placeholder="输入公司名（可选）" maxlength="16" style="width:100%;padding:8px;margin-top:4px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text-primary);font-size:13px;">' +
    "</div>" +
    '<div style="margin:12px 0;">' +
    '<label style="font-weight:600;font-size:12px;">📋 选择行业</label>' +
    '<div style="margin-top:4px;">' +
    industryHtml +
    "</div>" +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-muted);">当前现金：¥' +
    cash.toLocaleString() +
    " | 注册后剩余：¥" +
    (cash - registerCost).toLocaleString() +
    "</div>" +
    "</div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "🚀 注册公司",
    body: bodyHtml,
    buttons: [
      { text: "取消", cls: "", callback: function () {} },
      {
        text: "✅ 确认注册",
        cls: "btn-primary",
        callback: function () {
          // 在弹窗关闭前获取选中的行业值
          var nameInput = document.getElementById("startup-name-input");
          var name = nameInput ? nameInput.value.trim() : "";
          // 找选中的行业
          var selected = document.querySelector(
            'input[name="startup-industry"]:checked',
          );
          if (!selected) {
            StateManager.addMessage("⚠️ 请选择一个行业。", "warning");
            // 返回 false 保持弹窗打开
            return false;
          }
          var industry = selected.value;
          var result = registerStartup(state, name || null, industry, "");
          if (result.success) {
            StateManager.addMessage(
              result.message || "公司注册成功！",
              "success",
            );
            if (typeof renderAll === "function") renderAll();
            // 切换到创业Tab
            if (typeof switchTab === "function") switchTab("startup");
            // 返回 true 关闭弹窗（默认行为）
            return true;
          } else {
            StateManager.addMessage(result.message || "注册失败", "warning");
            // 返回 false 保持弹窗打开，让用户修改
            return false;
          }
        },
      },
    ],
  });
}

/**
 * 检查创业前置条件 — 防止跳过街头阶段直接创业
 * 要求：3项技能≥15级 + 2NPC好感≥40 + 游戏天数≥60
 */
function canStartStartup(state) {
  var reasons = [];

  // 1. 技能门槛：至少 2 项技能达到 12 级（有基础能力即可起步）
  var skillCount = 0;
  var skills = state.skills || {};
  for (var k in skills) {
    if (skills[k] && skills[k].level >= 12) skillCount++;
  }
  if (skillCount < 2) reasons.push("至少 2 项技能达到 12 级");

  // 2. 社会关系：需要至少 2 个 NPC 好感 ≥ 40（商业合作基础）
  var highAffNpcs = 0;
  var rels = state.relationships || {};
  for (var nid in rels) {
    if (rels[nid] && (rels[nid].affinity || 0) >= 40) highAffNpcs++;
  }
  if (highAffNpcs < 2) reasons.push("至少 2 位 NPC 好感 ≥ 40");

  // 3. 天数门槛：Day 60+，前期先体验街头/职场生活
  if (state.player.day < 60) reasons.push("游戏天数 ≥ 60 天");

  return { ok: reasons.length === 0, reasons: reasons };
}

/**
 * 详细的创业条件检查 — 返回每条条件的 ✅/❌ 状态
 * @returns {Array<{label:string, ok:boolean, current:*, required:*}>}
 */
function canStartStartupDetailed(state) {
  var results = [];

  // 1. 技能门槛：至少 2 项技能达到 12 级
  var skillCount = 0;
  var skills = state.skills || {};
  for (var k in skills) {
    if (skills[k] && skills[k].level >= 12) skillCount++;
  }
  results.push({
    label: "至少2项技能≥12级",
    ok: skillCount >= 2,
    current: skillCount + "项达标",
    required: "2项",
  });

  // 2. 社会关系：至少 2 个 NPC 好感 ≥ 40
  var highAffNpcs = 0;
  var rels = state.relationships || {};
  for (var nid in rels) {
    if (rels[nid] && (rels[nid].affinity || 0) >= 40) highAffNpcs++;
  }
  results.push({
    label: "至少2位NPC好感≥40",
    ok: highAffNpcs >= 2,
    current: highAffNpcs + "位达标",
    required: "2位",
  });

  // 3. 天数门槛：Day 60+
  results.push({
    label: "游戏天数≥60天",
    ok: (state.player.day || 0) >= 60,
    current: "第" + (state.player.day || 0) + "天",
    required: "第60天",
  });

  return results;
}

/** 渲染创业条件 HTML（✅/❌ + 当前值） */
function renderStartupConditionRows(results) {
  if (typeof ConditionSystem !== "undefined" && ConditionSystem.renderRows) {
    return ConditionSystem.renderRows(results);
  }
  // fallback（旧版兼容）
  var html = "";
  for (var i = 0; i < results.length; i++) {
    var r = results[i];
    html +=
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 4px;border-radius:3px;' +
      (r.ok
        ? "background:rgba(46,204,113,0.06);"
        : "background:rgba(231,76,60,0.06);") +
      '">' +
      '<span style="font-size:12px;">' +
      (r.ok ? "✅" : "❌") +
      ' <span style="color:' +
      (r.ok ? "var(--success)" : "var(--danger)") +
      ';">' +
      r.label +
      "</span></span>" +
      '<span style="font-size:11px;color:' +
      (r.ok ? "var(--success)" : "var(--danger)") +
      ';">当前' +
      r.current +
      "</span></div>";
  }
  return html;
}

/** 注册新公司 */
function _ensureStartupProductDefaults(product, day) {
  if (!product) return product;
  product.features = Array.isArray(product.features) ? product.features : [];
  product.version = product.version || "v1.0";
  product.versionHistory = Array.isArray(product.versionHistory)
    ? product.versionHistory
    : [];
  product.lifecycleStage = product.lifecycleStage || "introduction";
  product.marketShare = product.marketShare || 0;
  product.userGrowthRate = product.userGrowthRate || 0;
  product.churnRate = product.churnRate || 0;
  product.consecutiveGrowthDays = product.consecutiveGrowthDays || 0;
  product.consecutiveDeclineDays = product.consecutiveDeclineDays || 0;
  product.peakUsers = product.peakUsers || 0;
  product.peakRevenue = product.peakRevenue || 0;
  product.retired = !!product.retired;
  product.retireDay = product.retireDay || null;
  product.retireReason = product.retireReason || "";
  product.versionIterationCount = product.versionIterationCount || 0;
  product.retentionHistory = Array.isArray(product.retentionHistory)
    ? product.retentionHistory
    : [];
  product.funnelHistory = Array.isArray(product.funnelHistory)
    ? product.funnelHistory
    : [];
  product.techDebtHistory = Array.isArray(product.techDebtHistory)
    ? product.techDebtHistory
    : [];
  product.bugHistory = Array.isArray(product.bugHistory)
    ? product.bugHistory
    : [];
  product.crisisHistory = Array.isArray(product.crisisHistory)
    ? product.crisisHistory
    : [];
  product.technicalDebt = product.technicalDebt || 0;
  product.bugRate = product.bugRate || 0;
  product.lastRefactorDay = product.lastRefactorDay || day || 0;
  product.refactorBonus = product.refactorBonus || 0;
  product.techDebtCrisis = !!product.techDebtCrisis;
  product.techDebtSources = product.techDebtSources || {};
  product.techDebtSources.rushDevelopment =
    product.techDebtSources.rushDevelopment || 0;
  product.techDebtSources.skippedTests =
    product.techDebtSources.skippedTests || 0;
  product.techDebtSources.cutFeatures =
    product.techDebtSources.cutFeatures || 0;
  product.techDebtSources.quickFixes = product.techDebtSources.quickFixes || 0;
  product.techDebtSources.legacyCode = product.techDebtSources.legacyCode || 0;
  product.activationRate = product.activationRate || 0.3;
  product.activatedUsers = product.activatedUsers || 0;
  product.onboardingCompleteRate = product.onboardingCompleteRate || 0.5;
  product.dau = product.dau || 0;
  product.wau = product.wau || 0;
  product.mau = product.mau || 0;
  product.retentionD1 = product.retentionD1 || 0.4;
  product.retentionD7 = product.retentionD7 || 0.25;
  product.retentionD30 = product.retentionD30 || 0.15;
  product.arpu = product.arpu || 0;
  product.arppu = product.arppu || 0;
  product.payRate = product.payRate || 0.05;
  product.payingUsers = product.payingUsers || 0;
  product.ltv = product.ltv || 0;
  product.kFactor = product.kFactor || 0;
  product.referralRate = product.referralRate || 0.02;
  product.referralConversion = product.referralConversion || 0.1;
  product.viralCycleTime = product.viralCycleTime || 7;
  product.newUsersToday = product.newUsersToday || 0;
  product.acquisitionChannel = product.acquisitionChannel || "organic";
  product.cac = product.cac || 0;
  product.adSpend = product.adSpend || 0;
  product.funnelData = product.funnelData || {
    impressions: 0,
    clicks: 0,
    registrations: 0,
    activated: 0,
    retainedD7: 0,
    retainedD30: 0,
    paying: 0,
    referred: 0,
  };
  return product;
}

function registerStartup(state, name, industry, description) {
  // 检查触发条件
  // 前置条件：2技能12级+2NPC好感40+Day60
  var prereq = canStartStartup(state);
  if (!prereq.ok) {
    return {
      success: false,
      message:
        "创业条件不足：" +
        prereq.reasons.join("；") +
        "。请在创业Tab查看详细条件。",
    };
  }
  // [全系统自洽修复] 域H R61: cash裸访问防御，旧存档resources可能缺失
  const cash = (state.resources && isFinite(state.resources.cash)) ? state.resources.cash : 0;
  const day = state.player.day;
  const minCash = getStartupRegistrationCost(state); // 剧本/阶段感知启动资金

  // [全系统自洽修复] 域E A类#3: minCash 可能 NaN（状态未初始化），防御兜底
  if (!isFinite(minCash) || minCash <= 0) {
    return {
      success: false,
      message: "启动资金计算异常，请检查游戏状态后重试。",
    };
  }

  if (cash < minCash) {
    return {
      success: false,
      message: "启动资金不足，至少需要¥" + minCash,
    };
  }

  if (!STARTUP_INDUSTRIES[industry]) {
    return {
      success: false,
      message: "无效的行业选择",
    };
  }

  // 扣减启动资金
  // [全系统自洽修复] 域E A类#7: registerStartup cash守卫
  state.resources.cash = Math.max(0, (state.resources.cash || 0) - minCash);
  if (typeof addDailyTransaction === "function") {
    addDailyTransaction(state, "expense", "misc", minCash, "注册公司启动资金");
  }

  // 生成公司名（如果玩家没输入）
  const companyName = name || _startupGenerateCompanyName(industry);

  // 初始化公司状态
  const company = {
    id: _startupGenerateId(),
    name: companyName,
    industry: industry,
    description: description || "",
    foundedDay: day,
    valuation: Math.min(STARTUP_INDUSTRIES[industry].baseValuation, 15000000),
    // 估值上限 ¥15M（防止街头→创业 1000x 跳跃，资产绑定估值锚点）
    equity: {
      player: 100,
      coFounders: 0,
      employees: 0,
      investors: 0,
    },
    phase: "seed",
    fundingRounds: [],
    products: [],
    revenue: 0,
    expenses: 0,
    cashReserve: minCash, // 剩余启动资金
    burnRate: STARTUP_INDUSTRIES[industry].avgBurnRate,
    monthsOfRunway: 3, // 初始3个月 runway
    employees: [],
    reputation: 30,
    technologyScore: 20,
    marketScore: 10,
    coFounders: [],
    // ====== P0-5: KPI/OKR 目标系统 ======
    okrs: [], // 季度 OKR 列表 [{id, quarter, year, objective, keyResults: [], status, progress}]
    currentQuarterOkr: null, // 当前季度正在执行的 OKR
    investorRelationship: 30, // 投资人关系基础值（默认30，范围0-100）
    kpiHistory: [], // KPI 历史 [{quarter, year, kpi, score, bonus}]
    teamGoals: [], // 团队目标 [{id, team, target, progress, deadline}]
    employeeGoals: [], // 个人目标 [{employeeId, goal, target, progress}]
    quarterlyBonusPool: 0, // 季度奖金池
    okrCompletionRate: 0, // OKR 完成率（历史平均）
    // ====== P1-6: 董事会/股东压力系统 ======
    boardMembers: [], // 董事会成员 [{name, investorType, role, personality, joinedDay, satisfaction, trust, pressureLevel, lastEvaluation}]
    boardPressureLevel: 0, // 董事会压力等级 0-4 (0=无压力, 4=最后通牒)
    boardPressureHistory: [], // 压力事件历史 [{quarter, year, level, event, resolved}]
    lastBoardEvaluation: null, // 上次董事会评估 {quarter, year, score, passed, details}
    boardKPIHistory: [], // KPI 完成历史 [{quarter, year, scores: {}, totalScore, passed}]
    shareholderSatisfaction: 50, // 股东满意度 0-100
    shareholderTrust: 50, // 股东信任度 0-100
    boardAlignment: 50, // 董事会战略一致性 0-100
    pendingBoardAction: null, // 待处理的董事会行动 {type, deadline, options}
    CEOReplaced: false, // CEO是否被更换过
    forcedFinancing: false, // 是否接受过强制融资
    // ====== P1-7: 公关/媒体系统 ======
    mediaRelations: 0, // 媒体关系度 0-100
    mediaRelationHistory: [], // 媒体关系历史 [{day, change, reason}]
    mediaRelationLevel: 0, // 当前媒体关系等级 0-5
    mediaContacts: [], // 媒体联系人 [{name, outlet, type, relationship, lastContact}]
    prEvents: [], // 公关事件队列 [{id, type, severity, title, desc, triggeredDay, deadline, resolved, response}]
    pendingCrisisEvent: null, // 待处理的危机事件 {id, event, deadline}
    crisisLevel: 0, // 危机等级 0-4
    crisisHistory: [], // 危机事件历史 [{day, type, severity, response, outcome}]
    crisisPrepLevel: 0, // 危机准备度 0-100
    mediaTrainingLevel: 0, // 媒体培训水平 0-100
    lastMediaAction: null, // 上次媒体行动 {actionId, day}
    positiveNewsCount: 0, // 近期正面新闻计数
    negativeNewsCount: 0, // 近期负面新闻计数
    brandMentions: 0, // 品牌提及次数
    sentimentScore: 50, // 媒体情绪分 -100~100
    // ====== P1-8: 法律/合规风险系统 ======
    legalRisk: 0, // 法律风险值 0-100（越高越危险）
    legalRiskHistory: [], // 法律风险历史 [{day, change, reason}]
    legalRiskLevel: 0, // 当前法律风险等级 0-4
    complianceLevel: 0, // 合规水平 0-100
    complianceLevelHistory: [], // 合规水平历史 [{day, change, reason}]
    complianceGrade: 0, // 合规等级 0-4
    legalBudget: 100000, // 法律预算（初始10万）
    legalSpent: 0, // 已花费法律费用
    patents: [], // 已申请专利 [{id, type, name, applyDay, grantDay, status, protectionYears}]
    patentCount: 0, // 专利数量
    legalCases: [], // 法律案件 [{id, type, eventTemplateId, triggeredDay, status, response, outcome, financialImpact}]
    legalCasesActive: 0, // 活跃法律案件数
    legalHistory: [], // 法律事件历史 [{day, type, severity, outcome, financialImpact}]
    pendingLegalEvent: null, // 待处理的法律事件 {id, event, deadline}
    legalChecklist: {}, // 合规检查清单完成情况 {checklistId: completedDay}
    legalRiskFlags: {}, // 法律风险标记 {riskType: true/false}
    lastLegalAction: null, // 上次法律行动 {actionId, day, cost}
    legalInsurance: false, // 是否购买法律保险
    legalInsuranceLevel: 0, // 法律保险等级 0-3
    regulatoryRelationship: 0, // 监管机构关系 0-100
    industryComplianceRank: 0, // 行业合规排名 0-100
    // ====== P1-9: 竞争对手策略应对系统 ======
    activeCompetitorAttacks: [], // 活跃竞争对手攻击 [{id, attackType, name, competitorName, severity, urgency, remainingDays, effects, startedDay, resolved}]
    pendingCompetitorAttack: null, // 待处理攻击 {id, event, deadline}
    competitorAttackHistory: [], // 攻击历史 [{id, attackType, name, competitorName, severity, response, success, cost, outcome, startedDay, resolvedDay}]
    competitorDefenseLevel: 0, // 竞争防御等级 0-100
    marketShareTrend: [], // 市场份额趋势 [7天历史]
    brandDefenseBudget: 0, // 品牌防御预算
    talentRetentionFund: 0, // 人才留任基金
    techDefensePatents: [], // 防御性专利 [{patentId, filedDay, status}]
    competitiveIntelligence: 0, // 竞争情报等级 0-100
    // ====== P1-10: 危机事件系统 ======
    activeCrisisEvents: [], // 活跃危机事件 [{id, crisisType, name, severity, urgency, remainingDays, effects, startedDay, resolved}]
    pendingCrisisEvent: null, // 待处理危机 {id, event, deadline}
    crisisEventHistory: [], // 危机历史 [{id, crisisType, name, severity, response, success, cost, outcome, startedDay, resolvedDay}]
    crisisResilienceLevel: 0, // 危机韧性等级 0-100
    crisisPreparationLevel: 0, // 危机准备度 0-100
    crisisInsuranceLevel: 0, // 危机保险等级 0-3
    crisisResponseTeam: [], // 危机应对团队 [{role, name, expertise, availability}]
    crisisCommunicationPlan: null, // 危机沟通计划
    lastCrisisDay: null, // 上次危机发生日
    crisisFreeDays: 0, // 无危机天数
    // ====== P2-11: 办公地点系统 ======
    officeLocation: "shared", // 当前办公地点 ID (shared/normal/techPark/headquarters/campus)
    officeUpgradeHistory: [], // 升级历史 [{from, to, day, cost}]
    officeUnlockDay: {}, // 各等级解锁日 {shared: foundedDay, normal: day, ...}
    // ====== P2-12: 企业文化系统 ======
    companyCulture: "engineer", // 当前企业文化 ID (wolf/engineer/family)
    cultureChangeHistory: [], // 文化变更历史 [{from, to, day, reason}]
    cultureAdoptionProgress: 100, // 文化适应度 0-100
    cultureConflictLevel: 0, // 文化冲突等级 0-4
    // ====== P2-13: 合作伙伴/渠道商系统 ======
    partners: [], // 合作伙伴列表 [{id, type, name, focus, trust, joinedDay, revenueShare, status, lastInteractionDay, cooperationLevel, contractExpiryDay}]
    partnerHistory: [], // 伙伴历史 [{action, partnerId, partnerName, type, day, ...}]
    partnerTrustLevel: 0, // 整体伙伴信任等级 0-100
    // ====== P2-14: 产品定价策略系统 ======
    pricingStrategy: "tiered", // 整体定价策略 (fixed/tiered/subscription/freemium/dynamic)
    priceHistory: [], // 价格变更历史 [{productId, oldPrice, newPrice, day, reason}]
    abTestHistory: [], // A/B测试历史
    // ====== P2-15: 供应链系统 ======
    suppliers: [], // 供应商列表 [{id, type, name, focus, quality, price, leadTime, reliability, joinedDay, status, contractExpiryDay, lastDeliveryDay, qualityHistory[]}]
    inventory: {}, // 库存 {raw_material: {quantity, value}, component_stock: {...}, ...}
    supplyChainRisk: 0, // 供应链风险等级 0-100
    supplyChainHistory: [], // 供应链历史 [{action, supplierId, supplierName, type, day, ...}]
    leadTime: 30, // 平均交期（天）
  };

  // 生成1-2个联合创始人
  const numCoFounders = Random.chance(0.6) ? 1 : 2;
  for (let i = 0; i < numCoFounders; i++) {
    const cofounder = _startupGenerateCoFounder(i);
    // 扣除玩家股权
    company.equity.player -= cofounder.equityRequest;
    company.equity.coFounders += cofounder.equityRequest;
    cofounder.joinedDay = day;
    company.coFounders.push(cofounder);
  }

  // 初始产品（MVP）
  const initialProduct = {
    id: _startupGenerateId(),
    name: companyName + "MVP",
    category: "app",
    description: "最小可行产品",
    developmentProgress: 0,
    targetDay: day + PRODUCT_CATEGORIES.app.baseDevTime,
    launchDay: null,
    technologyScore: 0,
    marketScore: 0,
    revenue: 0,
    status: "developing",
  };
  _ensureStartupProductDefaults(initialProduct, day);
  company.products.push(initialProduct);

  // ====== P2-11: 初始化办公地点（从共享办公开始） ======
  company.officeLocation = "shared";
  company.officeUnlockDay = {
    shared: day,
  };

  // ====== 创业前街头技能联动：初始分数受玩家街头技能影响 ======
  // [全系统自洽修复] 域H 联动增强: 技能→创业初始属性
  var codingLvl = state.skills.coding ? state.skills.coding.level : 0;
  var salesLvl = state.skills.sales ? state.skills.sales.level : 0;
  var mgmtLvl = state.skills.management ? state.skills.management.level : 0;
  var accountingLvl = state.skills.accounting
    ? state.skills.accounting.level
    : 0;
  company.technologyScore = Math.min(
    80,
    Math.max(10, company.technologyScore + Math.floor(codingLvl * 0.3)),
  );
  company.marketScore = Math.min(
    80,
    Math.max(5, company.marketScore + Math.floor(salesLvl * 0.3)),
  );
  company.reputation = Math.min(
    80,
    Math.max(10, company.reputation + Math.floor((salesLvl + mgmtLvl) * 0.2)),
  );
  // 会计技能降低初始烧钱率
  if (accountingLvl >= 20) {
    company.burnRate = Math.round(
      company.burnRate * (1 - Math.min(0.15, accountingLvl * 0.002)),
    );
  }

  // ====== P2-12: 初始化企业文化（默认工程师文化） ======
  company.companyCulture = "engineer";
  company.cultureAdoptionProgress = 100;
  company.cultureConflictLevel = 0;

  // 更新状态
  state.startup.status = "seed";
  state.startup.company = company;
  state.startup.flags.registered = true;
  // [全系统自洽修复] 域A R231: startup.history 旧存档兼容守卫 — history 可能为 undefined（v1.5 以前存档未含创业字段）
  if (!state.startup.history) state.startup.history = {};
  state.startup.history.foundedDay = day;

  // 加入企业命运系统（Phase 2 联动）
  if (state.enterpriseFate && state.enterpriseFate.companies) {
    state.enterpriseFate.companies[company.id] = {
      phase: "startup",
      health: 60,
      marketShare: 0.5,
      sentiment: 40,
      productScore: 20,
      talentScore: 30,
      trend: "up",
      knownToPlayer: true,
      fateEventHistory: [],
      ceasedExistence: false,
      ceasedAt: null,
      isPlayerCompany: true,
      ownerId: "player",
    };
  }

  // 初始化竞争对手（Phase 4）
  if (typeof generateCompetitors === "function") {
    state.startup.competitors = generateCompetitors(state, company);
    StateManager.addMessage(
      "👀 市场上出现了" + state.startup.competitors.length + "家竞争对手",
      "info",
    );
  }

  StateManager.addMessage(
    "🏢 公司「" +
      companyName +
      "」已注册！行业：" +
      STARTUP_INDUSTRIES[industry].name +
      "，初始估值：¥" +
      company.valuation.toLocaleString(),
    "success",
  );

  // === v3.23: 触发槽 — corp_startup ===
  if (typeof window.TriggerRegistry !== "undefined") {
    try {
      var corpStartupEvent = window.TriggerRegistry.triggerRandom(
        "corp_startup",
        state,
      );
      if (corpStartupEvent) {
        setTimeout(function () {
          if (typeof showEventModal === "function")
            showEventModal(corpStartupEvent);
        }, 100);
      }
    } catch (e) {
      console.warn("TriggerRegistry corp_startup 触发失败:", e);
    }
  }

  // 里程碑：创业注册
  if (typeof autoSave === "function") autoSave("milestone");

  return {
    success: true,
    message: "公司注册成功！",
    company: company,
  };
}

// ====== 核心：产品开发 ======
function createProduct(state, name, category) {
  const company = state.startup.company;
  if (!company || company.phase === "exited") {
    return { success: false, message: "没有可运营的公司" };
  }

  if (!PRODUCT_CATEGORIES[category]) {
    return { success: false, message: "无效的产品类别" };
  }

  const categoryInfo = PRODUCT_CATEGORIES[category];
  const product = {
    id: _startupGenerateId(),
    name: name || company.name + "产品" + (company.products.length + 1),
    category: category,
    description: "",
    developmentProgress: 0,
    targetDay: state.player.day + categoryInfo.baseDevTime,
    launchDay: null,
    technologyScore: 0,
    marketScore: 0,
    revenue: 0,
    status: "developing",
    // 功能模块（产品竞争力来源）
    features: [],
    // 用户数据
    users: 0,
    rating: 3.5,
    // 竞争力评分（0-100）
    competitiveness: 0,
    // ====== P0-1: 产品生命周期管理新增字段 ======
    version: "v1.0",
    versionHistory: [], // [{version, date, day, changes, techScore, marketScore}]
    lifecycleStage: "introduction", // introduction/growth/maturity/decline
    marketShare: 0, // 市场份额 0-100
    userGrowthRate: 0, // 用户增长率
    churnRate: 0, // 用户流失率
    consecutiveGrowthDays: 0, // 连续增长天数（用于判断进入成长期）
    consecutiveDeclineDays: 0, // 连续衰退天数（用于判断进入衰退期）
    peakUsers: 0, // 历史最高用户数
    peakRevenue: 0, // 历史最高收入
    retired: false, // 是否已退市
    retireDay: null, // 退市日期
    retireReason: "", // 退市原因
    versionIterationCount: 0, // 版本迭代次数
    // ====== P0-2: AARRR 用户增长漏斗 ======
    // Acquisition (获客)
    newUsersToday: 0, // 今日新增用户
    acquisitionChannel: "organic", // 主要获客渠道
    cac: 0, // 获客成本（元/用户）
    adSpend: 0, // 今日广告投入
    // Activation (激活)
    activationRate: 0.3, // 激活率（注册用户→激活用户）
    activatedUsers: 0, // 激活用户数
    onboardingCompleteRate: 0.5, // 新手引导完成率
    // Retention (留存)
    dau: 0, // 日活跃用户
    wau: 0, // 周活跃用户
    mau: 0, // 月活跃用户
    retentionD1: 0.4, // 次日留存率
    retentionD7: 0.25, // 7日留存率
    retentionD30: 0.15, // 30日留存率
    retentionHistory: [], // 留存率历史 [{day, d1, d7, d30}]
    // Revenue (变现)
    arpu: 0, // 每用户平均收入（元/天）
    arppu: 0, // 每付费用户平均收入
    payRate: 0.05, // 付费率
    payingUsers: 0, // 付费用户数
    ltv: 0, // 用户生命周期价值
    // Referral (推荐)
    kFactor: 0, // 病毒系数（每个用户带来多少新用户）
    referralRate: 0.02, // 分享率
    referralConversion: 0.1, // 推荐转化率
    viralCycleTime: 7, // 病毒传播周期（天）
    // 漏斗数据
    funnelData: {
      impressions: 0, // 曝光量
      clicks: 0, // 点击量
      registrations: 0, // 注册量
      activated: 0, // 激活量
      retainedD7: 0, // 7日留存
      retainedD30: 0, // 30日留存
      paying: 0, // 付费用户
      referred: 0, // 推荐用户
    },
    funnelHistory: [], // 漏斗历史数据
    // ====== P0-3: 技术债务系统 ======
    technicalDebt: 0, // 技术债指数（0-100，越高越严重）
    techDebtHistory: [], // 技术债历史 [{day, debt, cause}]
    bugRate: 0, // 当前 bug 率（每千用户每日 bug 数）
    bugHistory: [], // bug 历史
    lastRefactorDay: 0, // 上次重构日期
    refactorBonus: 0, // 重构带来的临时效率加成
    techDebtCrisis: false, // 是否发生技术债危机
    crisisHistory: [], // 危机历史 [{day, type, impact}]
    // 技术债来源标记
    techDebtSources: {
      rushDevelopment: 0, // 赶工积累
      skippedTests: 0, // 跳过测试
      cutFeatures: 0, // 砍需求
      quickFixes: 0, // 临时修复
      legacyCode: 0, // 遗留代码
    },
  };
  _ensureStartupProductDefaults(product, state.player.day);

  company.products.push(product);
  StateManager.addMessage("💻 新产品「" + product.name + "」开始开发", "info");
  return { success: true, product: product };
}

function developProduct(state, productId, effort) {
  // effort: 1-3 点行动力
  if (effort < 1 || effort > 3) {
    return { success: false, message: "投入力度应为1-3" };
  }

  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const product = company.products.find((p) => p.id === productId);
  if (!product || product.status !== "developing") {
    return { success: false, message: "产品不存在或已发布" };
  }

  // 计算开发进度增量
  const playerIntelligence = state.player.intelligence || 20;
  const playerCoding = (state.player.skills || {}).coding?.level || 0;
  const teamTechScore = company.technologyScore || 20;

  // 基础进度 + 智力加成 + 技能加成 + 团队加成 + 随机波动
  const baseProgress = 2 + effort;
  const intelligenceBonus = playerIntelligence / 20;
  const codingBonus = playerCoding / 50;
  const teamBonus = teamTechScore / 100;
  const randomFactor = Random.float(0.8, 1.2);

  const progressGain =
    (baseProgress + intelligenceBonus + codingBonus + teamBonus) * randomFactor;

  product.developmentProgress = Math.min(
    100,
    product.developmentProgress + progressGain,
  );

  // 消耗公司现金（研发成本）
  const devCost = 1000 * effort;
  // [全系统自洽修复] 域E A类#8: developProduct cashReserve NaN防护
  company.cashReserve = Math.max(0, (company.cashReserve || 0) - devCost);
  company.expenses += devCost;

  // P0-3: 高强度开发积累技术债（effort=3 时）
  if (effort >= 3) {
    // 赶工积累技术债：基础0.5 + 随机0~1
    const debtGain = Random.float(0.5, 1.5);
    recordTechDebtEvent(state, productId, "rush", debtGain);
  }

  // 检查是否完成
  if (product.developmentProgress >= 100) {
    product.status = "ready_to_launch";
    StateManager.addMessage(
      "🎉 产品「" + product.name + "」开发完成，可以发布了！",
      "success",
    );
  } else {
    StateManager.addMessage(
      "💻 产品「" +
        product.name +
        "」开发进度：" +
        Math.round(product.developmentProgress) +
        "%（投入" +
        effort +
        "点）",
      "info",
    );
  }

  return { success: true, progress: product.developmentProgress };
}

function launchProduct(state, productId) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const product = company.products.find((p) => p.id === productId);
  if (!product || product.status !== "ready_to_launch") {
    return { success: false, message: "产品未开发完成" };
  }

  // 计算产品分数
  const techScore = Math.min(
    100,
    30 +
      company.technologyScore +
      (state.player.skills?.coding?.level || 0) * 0.3,
  );
  const marketScore = Math.min(
    100,
    20 + company.marketScore + (state.player.skills?.sales?.level || 0) * 0.3,
  );

  product.technologyScore = Math.round(techScore);
  product.marketScore = Math.round(marketScore);
  product.launchDay = state.player.day;
  product.status = "launched";
  // P0-1: 初始化生命周期字段
  product.lifecycleStage = "introduction";
  product.marketShare = 0;
  product.userGrowthRate = 0;
  product.churnRate = 0;
  product.consecutiveGrowthDays = 0;
  product.consecutiveDeclineDays = 0;
  product.peakUsers = 0;
  product.peakRevenue = 0;
  product.retired = false;
  product.retireDay = null;
  product.retireReason = "";
  product.versionIterationCount = 0;
  // P0-2: 初始化 AARRR 字段
  product.newUsersToday = 0;
  product.acquisitionChannel = "organic";
  product.cac = 0;
  product.adSpend = 0;
  product.activationRate = 0.3;
  product.activatedUsers = 0;
  product.onboardingCompleteRate = 0.5;
  product.dau = 0;
  product.wau = 0;
  product.mau = 0;
  product.retentionD1 = 0.4;
  product.retentionD7 = 0.25;
  product.retentionD30 = 0.15;
  product.retentionHistory = [];
  product.arpu = 0;
  product.arppu = 0;
  product.payRate = 0.05;
  product.payingUsers = 0;
  product.ltv = 0;
  product.kFactor = 0;
  product.referralRate = 0.02;
  product.referralConversion = 0.1;
  product.viralCycleTime = 7;
  product.funnelData = {
    impressions: 0,
    clicks: 0,
    registrations: 0,
    activated: 0,
    retainedD7: 0,
    retainedD30: 0,
    paying: 0,
    referred: 0,
  };
  product.funnelHistory = [];
  // P0-3: 初始化技术债字段
  product.technicalDebt = 0;
  product.techDebtHistory = [];
  product.bugRate = 0;
  product.bugHistory = [];
  product.lastRefactorDay = state.player.day;
  product.refactorBonus = 0;
  product.techDebtCrisis = false;
  product.crisisHistory = [];
  product.techDebtSources = {
    rushDevelopment: 0,
    skippedTests: 0,
    cutFeatures: 0,
    quickFixes: 0,
    legacyCode: 0,
  };

  // 计算市场反响
  const productScore = techScore * 0.6 + marketScore * 0.4;
  const marketReaction = productScore / 100;

  // 更新公司分数
  company.technologyScore = Math.max(company.technologyScore, techScore * 0.3);
  company.marketScore = Math.max(company.marketScore, marketScore * 0.3);
  company.reputation = Math.min(
    100,
    company.reputation + 5 + Math.floor(marketReaction * 10),
  );

  // 更新估值
  const valuationBoost = company.valuation * 0.1 * marketReaction;
  company.valuation = Math.round(company.valuation + valuationBoost);

  // 标记首次发布
  if (!state.startup.flags.firstProductLaunched) {
    state.startup.flags.firstProductLaunched = true;
  }

  StateManager.addMessage(
    "🚀 产品「" +
      product.name +
      "」正式发布！技术分：" +
      Math.round(techScore) +
      "，市场分：" +
      Math.round(marketScore) +
      "，公司估值提升至¥" +
      company.valuation.toLocaleString(),
    "success",
  );

  return { success: true, product: product, marketReaction: marketReaction };
}

// ====== 产品功能模块系统 ======

/** 通用功能模块定义 */
const FEATURE_MODULES = {
  user_system: {
    name: "用户系统",
    icon: "👤",
    cost: 10000,
    devTime: 15,
    techBonus: 5,
    marketBonus: 3,
    desc: "注册/登录/个人资料，产品的基础设施",
  },
  payment: {
    name: "支付系统",
    icon: "💳",
    cost: 20000,
    devTime: 20,
    techBonus: 8,
    marketBonus: 5,
    desc: "支持多种支付方式，变现的基础",
  },
  analytics: {
    name: "数据看板",
    icon: "📊",
    cost: 15000,
    devTime: 15,
    techBonus: 6,
    marketBonus: 2,
    desc: "用户行为分析/业务指标监控",
  },
  social_share: {
    name: "社交分享",
    icon: "🔗",
    cost: 8000,
    devTime: 10,
    techBonus: 2,
    marketBonus: 6,
    desc: "一键分享到社交平台，病毒传播",
  },
  push_notification: {
    name: "推送通知",
    icon: "🔔",
    cost: 10000,
    devTime: 12,
    techBonus: 3,
    marketBonus: 5,
    desc: "提升用户活跃度和留存率",
  },
  api_gateway: {
    name: "API网关",
    icon: "🔌",
    cost: 25000,
    devTime: 25,
    techBonus: 10,
    marketBonus: 2,
    desc: "开放API接口，构建生态系统",
  },
  ai_recommend: {
    name: "AI推荐引擎",
    icon: "🧠",
    cost: 40000,
    devTime: 30,
    techBonus: 12,
    marketBonus: 8,
    desc: "个性化推荐，提升用户粘性",
  },
  live_stream: {
    name: "直播功能",
    icon: "📹",
    cost: 35000,
    devTime: 35,
    techBonus: 8,
    marketBonus: 10,
    desc: "实时互动，提升用户参与度",
  },
  search: {
    name: "智能搜索",
    icon: "🔍",
    cost: 12000,
    devTime: 15,
    techBonus: 5,
    marketBonus: 4,
    desc: "全文搜索/智能推荐/搜索结果优化",
  },
  multi_platform: {
    name: "多平台支持",
    icon: "📱",
    cost: 30000,
    devTime: 30,
    techBonus: 7,
    marketBonus: 6,
    desc: "iOS/Android/Web多端同步",
  },
  security: {
    name: "安全加固",
    icon: "🔒",
    cost: 15000,
    devTime: 15,
    techBonus: 8,
    marketBonus: 2,
    desc: "数据加密/风控/防攻击",
  },
  customer_support: {
    name: "客服系统",
    icon: "💬",
    cost: 10000,
    devTime: 12,
    techBonus: 2,
    marketBonus: 5,
    desc: "在线客服/工单系统/FAQ",
  },
  membership: {
    name: "会员体系",
    icon: "⭐",
    cost: 18000,
    devTime: 20,
    techBonus: 3,
    marketBonus: 7,
    desc: "等级/权益/积分体系，提升LTV",
  },
  marketplace_integration: {
    name: "市场对接",
    icon: "🏪",
    cost: 25000,
    devTime: 25,
    techBonus: 4,
    marketBonus: 8,
    desc: "对接第三方市场/平台",
  },
  cloud_scale: {
    name: "云扩展",
    icon: "☁️",
    cost: 20000,
    devTime: 20,
    techBonus: 10,
    marketBonus: 1,
    desc: "弹性伸缩/高可用架构",
  },
};

/** 获取产品可用的功能模块 */
function getProductAvailableFeatures(product) {
  const category = PRODUCT_CATEGORIES[product.category];
  if (!category || !category.features) return [];

  const available = [];
  for (const featName of category.features) {
    // 查找对应的功能模块定义
    for (const [key, def] of Object.entries(FEATURE_MODULES)) {
      if (def.name.includes(featName) || featName.includes(def.name)) {
        if (!product.features.find((f) => f.key === key)) {
          available.push({ key, ...def });
        }
      }
    }
  }
  return available;
}

/** 开发功能模块 */
function developFeature(state, productId, featureKey, skipTests) {
  // skipTests: 是否跳过测试（会积累技术债）
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const product = company.products.find((p) => p.id === productId);
  if (!product) return { success: false, message: "产品不存在" };

  const feature = FEATURE_MODULES[featureKey];
  if (!feature) return { success: false, message: "功能模块不存在" };

  // 检查是否已开发
  if (product.features.find((f) => f.key === featureKey)) {
    return { success: false, message: "该功能已开发完成" };
  }

  // 检查现金
  if (company.cashReserve < feature.cost) {
    return {
      success: false,
      message: "现金不足，需要¥" + feature.cost.toLocaleString(),
    };
  }

  // 扣除现金，开始开发
  company.cashReserve -= feature.cost;
  company.expenses += feature.cost;

  // 添加开发中的功能
  product.features.push({
    key: featureKey,
    name: feature.name,
    status: "developing",
    progress: 0,
    targetDay: state.player.day + feature.devTime,
  });

  // P0-3: 跳过测试积累技术债
  if (skipTests) {
    const debtGain = Random.float(2, 5);
    recordTechDebtEvent(state, productId, "skip_test", debtGain);
    StateManager.addMessage(
      "⚠️ 跳过测试开发「" + feature.name + "」，技术债+" + debtGain.toFixed(0),
      "warning",
    );
  } else {
    StateManager.addMessage(
      "🔧 「" + feature.name + "」开始开发，预计" + feature.devTime + "天完成",
      "info",
    );
  }

  return { success: true, feature: feature };
}

/** 完成功能开发（每日管线中检查） */
function checkFeatureCompletion(state) {
  const startup = state.startup;
  if (!startup || !startup.company) return;

  const company = startup.company;
  const day = state.player.day;

  for (const product of company.products) {
    if (product.status !== "launched" && product.status !== "ready_to_launch")
      continue;

    for (let i = product.features.length - 1; i >= 0; i--) {
      const feat = product.features[i];
      if (feat.status === "developing" && day >= feat.targetDay) {
        feat.status = "completed";
        const featDef = FEATURE_MODULES[feat.key];
        if (featDef) {
          product.technologyScore = Math.min(
            100,
            product.technologyScore + featDef.techBonus,
          );
          product.marketScore = Math.min(
            100,
            product.marketScore + featDef.marketBonus,
          );
          StateManager.addMessage(
            "✅ 「" +
              feat.name +
              "」开发完成！技术分+" +
              featDef.techBonus +
              "，市场分+" +
              featDef.marketBonus,
            "success",
          );
        }
      }
    }
  }
}

/** 计算产品竞争力 */
function calculateProductCompetitiveness(product) {
  _ensureStartupProductDefaults(product, 0);
  const category = PRODUCT_CATEGORIES[product.category];
  if (!category) return 0;

  let score = 0;
  // 基础分
  score += product.technologyScore * 0.4;
  score += product.marketScore * 0.3;
  // 功能模块加成
  score += product.features.length * 5;
  // 用户规模加成
  score += Math.min(20, (product.users || 0) / 1000);
  // 评分加成
  score += (product.rating || 3.5) * 4;
  // P0-1: 生命周期阶段加成
  const stageBonuses = {
    introduction: 0, // 引入期无加成
    growth: 5, // 成长期 +5
    maturity: 8, // 成熟期 +8
    decline: -10, // 衰退期 -10
  };
  score += stageBonuses[product.lifecycleStage] || 0;
  // P0-3: 技术债惩罚
  const techDebtPenalty = (product.technicalDebt || 0) * 0.15; // 技术债每10点惩罚1.5分
  score -= techDebtPenalty;
  // 重构加成
  if (product.refactorBonus > 0) {
    score += product.refactorBonus;
  }

  product.competitiveness = Math.round(Math.min(100, Math.max(0, score)));
  return product.competitiveness;
}

// ====== 核心：招聘员工 ======
function hireEmployee(state, role, salary) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  if (!EMPLOYEE_ROLES[role]) {
    return { success: false, message: "无效的员工角色" };
  }

  const baseSalary = EMPLOYEE_ROLES[role].baseSalary;
  const actualSalary = salary || baseSalary;

  // 检查现金
  if (company.cashReserve < actualSalary) {
    return { success: false, message: "现金不足以支付月薪" };
  }

  // 生成员工
  const employee = {
    id: _startupGenerateId(),
    role: role,
    name: "员工" + (company.employees.length + 1),
    salary: actualSalary,
    productivity: EMPLOYEE_ROLES[role].baseProductivity,
    loyalty: Random.int(60, 89),
    skillFocus: EMPLOYEE_ROLES[role].skillFocus,
    skillLevel: Random.int(30, 59),
    joinedDay: state.player.day,
    // ====== P0-4: 员工满意度/倦怠系统 ======
    satisfaction: Random.int(50, 79), // 综合满意度（0-100）
    satisfactionDetails: {
      salary: Random.int(50, 79), // 薪资满意度
      workload: Random.int(60, 79), // 工作强度满意度
      growth: Random.int(40, 79), // 成长空间满意度
      atmosphere: Random.int(50, 79), // 团队氛围满意度
    },
    burnoutRisk: 0, // 倦怠风险指数（0-100）
    burnoutLevel: 0, // 倦怠等级（0=正常, 1=轻度, 2=中度, 3=重度）
    stressLevel: Random.int(30, 59), // 压力水平
    overtimeDays: 0, // 连续加班天数
    lastWorkDay: state.player.day, // 最后工作日
    health: Random.int(80, 99), // 健康值
    _satisfactionHistory: [], // 满意度历史
    _burnoutHistory: [], // 倦怠历史
  };

  company.employees.push(employee);
  company.cashReserve -= actualSalary;
  company.expenses += actualSalary;
  company.equity.employees += 0.5; // 每个员工分配0.5%期权
  company.employeesHired = (company.employeesHired || 0) + 1;

  // 更新公司分数
  if (role === "engineer") {
    company.technologyScore = Math.min(100, company.technologyScore + 3);
  } else if (role === "sales" || role === "marketing") {
    company.marketScore = Math.min(100, company.marketScore + 3);
  }

  // [全系统自洽修复] 域H R170 H→D 联动增强: 招募员工提升创业圈人脉
  if (state.player) {
    state.player.fame = Math.min(100, (state.player.fame || 0) + 1);
  }

  // 检查阶段升级
  if (company.employees.length >= 5 && company.phase === "seed") {
    company.phase = "growth";
    state.startup.status = "growth";
    StateManager.addMessage("📈 团队达到5人，公司进入成长期！", "success");
  }

  // [全系统自洽修复] 域A R231: startup.history 守卫（同上 registerStartup）
  if (!state.startup.history) state.startup.history = {};
  state.startup.history.employeesHired = company.employeesHired || 0;

  StateManager.addMessage(
    "👥 招聘「" +
      EMPLOYEE_ROLES[role].name +
      "」成功！月薪¥" +
      actualSalary.toLocaleString() +
      "，团队规模：" +
      company.employees.length +
      "人",
    "success",
  );

  return { success: true, employee: employee };
}

function fireEmployee(state, employeeId) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const idx = company.employees.findIndex((e) => e.id === employeeId);
  if (idx === -1) return { success: false, message: "员工不存在" };

  const employee = company.employees[idx];
  company.employees.splice(idx, 1);
  company.equity.employees = Math.max(0, company.equity.employees - 0.5);

  // 离职影响
  company.reputation = Math.max(0, company.reputation - 2);
  // [全系统自洽修复] 域H A类修复: company.loyalty 不存在(忠诚度是员工级属性), 删除无意义赋值

  StateManager.addMessage(
    "👋 「" + employee.name + "」已离职，公司声誉-2",
    "warning",
  );

  return { success: true };
}

// ====== 核心：融资 ======
function getEligibleRounds(state) {
  const company = state.startup.company;
  if (!company) return [];

  const eligible = [];
  for (const [roundId, roundDef] of Object.entries(FUNDING_ROUNDS)) {
    if (company.phase === "seed" && roundId !== "seed") continue;
    if (company.phase === "growth" && roundId === "seed") continue;

    if (
      company.valuation >= roundDef.minValuation &&
      company.revenue >= roundDef.minRevenue &&
      company.employees.length >= roundDef.minEmployees
    ) {
      eligible.push(roundId);
    }
  }
  return eligible;
}

function raiseFunding(state, roundId) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  if (!FUNDING_ROUNDS[roundId]) {
    return { success: false, message: "无效融资轮次" };
  }

  const roundDef = FUNDING_ROUNDS[roundId];
  const eligibleRounds = getEligibleRounds(state);
  if (!eligibleRounds.includes(roundId)) {
    return {
      success: false,
      message:
        "公司尚未达到" +
        roundDef.name +
        "的标准（估值¥" +
        roundDef.minValuation.toLocaleString() +
        "起）",
    };
  }

  // 生成投资人谈判
  const investorType =
    INVESTOR_TYPES[
      roundDef.investorTypes[Random.int(0, roundDef.investorTypes.length - 1)]
    ];

  const raiseAmount = Math.floor(roundDef.maxRaise * Random.float(0.5, 1.0));
  const equityDilution =
    roundDef.equityDilution[0] +
    Random.float(0, roundDef.equityDilution[1] - roundDef.equityDilution[0]);

  // [全系统自洽修复] 域H R61: equityDilution极小值→估值暴涨防御
  if (equityDilution < 0.001) {
    return { success: false, message: "融资比例异常，请重试。" };
  }

  // 更新股权
  const oldPlayerEquity = company.equity.player;
  company.equity.player =
    Math.round(company.equity.player * (1 - equityDilution) * 100) / 100;
  company.equity.investors += equityDilution * 100;

  // 更新公司状态
  company.cashReserve += raiseAmount;
  company.valuation = Math.round(
    company.valuation + raiseAmount / (equityDilution || 0.15),
  );
  company.phase = roundId === "seed" ? "seed" : "growth";
  if (roundId === "C") {
    state.startup.status = "ipo_preparing";
  }

  company.fundingRounds.push({
    round: roundId,
    amount: raiseAmount,
    investorType: investorType.name,
    equityDilution: Math.round(equityDilution * 100),
    postValuation: company.valuation,
    day: state.player.day,
  });

  state.startup.flags.hasInvestors = true;

  // 更新企业命运系统中的公司
  if (state.enterpriseFate && state.enterpriseFate.companies && company.id) {
    const fateCo = state.enterpriseFate.companies[company.id];
    if (fateCo) {
      fateCo.health = Math.min(100, fateCo.health + 15);
      fateCo.sentiment = Math.min(100, fateCo.sentiment + 20);
      fateCo.trend = "up";
    }
  }

  StateManager.addMessage(
    "💰 " +
      roundDef.name +
      "融资成功！融资金额：¥" +
      raiseAmount.toLocaleString() +
      "，出让股权：" +
      Math.round(equityDilution * 100) +
      "%，投后估值：¥" +
      company.valuation.toLocaleString() +
      "（玩家持股从" +
      Math.round(oldPlayerEquity) +
      "%稀释至" +
      Math.round(company.equity.player) +
      "%）",
    "success",
  );

  // ====== P1-6: 融资后添加董事会成员 ======
  _addBoardMemberAfterFunding(state, roundId, investorType);

  return {
    success: true,
    round: roundDef,
    amount: raiseAmount,
    equityDilution: equityDilution,
    investor: investorType,
  };
}

// ====== P1-6: 董事会/股东压力系统核心函数 ======

/** 融资后添加董事会成员 */
function _addBoardMemberAfterFunding(state, roundId, investorType) {
  const company = state.startup.company;
  if (!company) return;

  const template =
    BOARD_MEMBER_TEMPLATES[
      Object.keys(BOARD_MEMBER_TEMPLATES).find(
        (k) => BOARD_MEMBER_TEMPLATES[k].name === investorType.name,
      )
    ];
  if (!template) return;

  // 生成董事会成员名字
  const names = [
    "张总",
    "李总",
    "王总",
    "陈总",
    "刘总",
    "赵总",
    "周总",
    "吴总",
    "孙总",
    "郑总",
  ];
  const name = Random.fromArray(names) || investorType.name;

  const boardMember = {
    id: _startupGenerateId(),
    name: name,
    investorType: investorType.name,
    investorKey:
      investorType.key ||
      Object.keys(BOARD_MEMBER_TEMPLATES).find(
        (k) => BOARD_MEMBER_TEMPLATES[k].name === investorType.name,
      ),
    role: template.role,
    personality: template.personality,
    patience: template.patience,
    focusAreas: [...template.focusAreas],
    pressureTolerance: template.pressureTolerance,
    joinedDay: state.player.day,
    satisfaction: Random.int(60, 79), // 初始满意度 60-80
    trust: Random.int(50, 69), // 初始信任度 50-70
    lastEvaluation: null,
    concerns: [], // 当前关注的问题
  };

  company.boardMembers.push(boardMember);

  // 根据融资轮次调整初始满意度
  if (roundId === "seed") {
    company.shareholderSatisfaction = Math.min(
      100,
      company.shareholderSatisfaction + 15,
    );
    company.shareholderTrust = Math.min(100, company.shareholderTrust + 10);
  } else if (roundId === "A") {
    company.shareholderSatisfaction = Math.min(
      100,
      company.shareholderSatisfaction + 10,
    );
    company.shareholderTrust = Math.min(100, company.shareholderTrust + 15);
  } else if (roundId === "B") {
    company.shareholderSatisfaction = Math.min(
      100,
      company.shareholderSatisfaction + 5,
    );
    company.shareholderTrust = Math.min(100, company.shareholderTrust + 10);
  } else if (roundId === "C") {
    company.shareholderSatisfaction = Math.min(
      100,
      company.shareholderSatisfaction + 5,
    );
    company.shareholderTrust = Math.min(100, company.shareholderTrust + 5);
    // C轮后董事会压力更大
    company.boardAlignment = Math.max(0, company.boardAlignment - 10);
  }

  StateManager.addMessage(
    `📋 ${investorType.name}派${template.role}「${name}」进入董事会（${template.personality}型，耐心${template.patience}%）`,
    "event",
  );
}

/** 计算季度KPI完成率 */
function _calculateQuarterlyKPIScore(state, company) {
  const quarter = Math.floor((state.player.day - company.foundedDay) / 90) + 1;
  const fundingRound =
    company.phase === "seed"
      ? "seed"
      : company.fundingRounds.length >= 3
        ? "C"
        : company.fundingRounds.length >= 2
          ? "B"
          : company.fundingRounds.length >= 1
            ? "A"
            : "seed";

  const kpiDef = BOARD_KPI_REQUIREMENTS[fundingRound];
  if (!kpiDef) return { score: 0, details: {}, passed: false };

  const scores = {};
  let totalWeightedScore = 0;
  let totalWeight = 0;

  // 营收考核
  if (kpiDef.revenue) {
    const revenueScore = Math.min(1.0, company.revenue / kpiDef.revenue.target);
    scores.revenue = {
      achieved: company.revenue,
      target: kpiDef.revenue.target,
      score: revenueScore,
    };
    totalWeightedScore += revenueScore * kpiDef.revenue.weight;
    totalWeight += kpiDef.revenue.weight;
  }

  // 营收增长率
  if (kpiDef.revenueGrowth && company.kpiHistory.length > 0) {
    const lastRevenue =
      company.kpiHistory[company.kpiHistory.length - 1].revenue || 0;
    const growthRate =
      lastRevenue > 0 ? (company.revenue - lastRevenue) / lastRevenue : 0;
    const growthScore = Math.min(
      1.0,
      Math.max(0, growthRate / kpiDef.revenueGrowth.target),
    );
    scores.revenueGrowth = {
      achieved: growthRate,
      target: kpiDef.revenueGrowth.target,
      score: growthScore,
    };
    totalWeightedScore += growthScore * kpiDef.revenueGrowth.weight;
    totalWeight += kpiDef.revenueGrowth.weight;
  }

  // 用户增长率
  if (kpiDef.userGrowth) {
    const avgGrowthRate = _calculateAvgUserGrowthRate(company);
    const userScore = Math.min(
      1.0,
      Math.max(0, avgGrowthRate / kpiDef.userGrowth.target),
    );
    scores.userGrowth = {
      achieved: avgGrowthRate,
      target: kpiDef.userGrowth.target,
      score: userScore,
    };
    totalWeightedScore += userScore * kpiDef.userGrowth.weight;
    totalWeight += kpiDef.userGrowth.weight;
  }

  // 产品开发进度
  if (kpiDef.productMilestone) {
    const developingProducts = company.products.filter(
      (p) => p.status === "developing",
    );
    if (developingProducts.length > 0) {
      const avgProgress =
        developingProducts.reduce(
          (sum, p) => sum + (p.developmentProgress || 0),
          0,
        ) / developingProducts.length;
      const prodScore = Math.min(1.0, avgProgress / 100);
      scores.productMilestone = {
        achieved: avgProgress,
        target: kpiDef.productMilestone.target * 100,
        score: prodScore,
      };
      totalWeightedScore += prodScore * kpiDef.productMilestone.weight;
      totalWeight += kpiDef.productMilestone.weight;
    } else {
      scores.productMilestone = {
        achieved: 100,
        target: kpiDef.productMilestone.target * 100,
        score: 1.0,
      };
      totalWeightedScore += 1.0 * kpiDef.productMilestone.weight;
      totalWeight += kpiDef.productMilestone.weight;
    }
  }

  // 团队稳定性/规模
  if (kpiDef.teamStability) {
    const totalHired =
      company.employees.length + (company.coFounders?.length || 0);
    const retained = company.employees.length;
    const stabilityRate = totalHired > 0 ? retained / totalHired : 1.0;
    const teamScore = Math.min(
      1.0,
      stabilityRate / kpiDef.teamStability.target,
    );
    scores.teamStability = {
      achieved: stabilityRate,
      target: kpiDef.teamStability.target,
      score: teamScore,
    };
    totalWeightedScore += teamScore * kpiDef.teamStability.weight;
    totalWeight += kpiDef.teamStability.weight;
  }

  if (kpiDef.teamGrowth) {
    const teamScore = Math.min(
      1.0,
      company.employees.length / kpiDef.teamGrowth.target,
    );
    scores.teamGrowth = {
      achieved: company.employees.length,
      target: kpiDef.teamGrowth.target,
      score: teamScore,
    };
    totalWeightedScore += teamScore * kpiDef.teamGrowth.weight;
    totalWeight += kpiDef.teamGrowth.weight;
  }

  if (kpiDef.teamScale) {
    const teamScore = Math.min(
      1.0,
      company.employees.length / kpiDef.teamScale.target,
    );
    scores.teamScale = {
      achieved: company.employees.length,
      target: kpiDef.teamScale.target,
      score: teamScore,
    };
    totalWeightedScore += teamScore * kpiDef.teamScale.weight;
    totalWeight += kpiDef.teamScale.weight;
  }

  // 市场份额
  if (kpiDef.marketShare) {
    const marketShare = _calculateMarketShare(state, company.products[0] || {});
    const msScore = Math.min(1.0, marketShare / kpiDef.marketShare.target);
    scores.marketShare = {
      achieved: marketShare,
      target: kpiDef.marketShare.target,
      score: msScore,
    };
    totalWeightedScore += msScore * kpiDef.marketShare.weight;
    totalWeight += kpiDef.marketShare.weight;
  }

  // 盈利能力/净现金流
  if (kpiDef.profitability) {
    const netCash = company.cashReserve - (company.burnRate || 0) * 30;
    // [全系统自洽修复] 域H 修复:B轮 profitability.target=0.0(盈亏平衡) 时原公式分母为 target*valuation*2=0 →
    // netCash/0：净现金流>0恒得满分1.0(无梯度)、<0恒得0、恰为0时 0/0=NaN 污染 totalWeightedScore →
    // finalScore=NaN → 董事会评分崩溃(passed恒false、UI显示NaN)。改比例式:盈亏平衡目标下 netCash>=0 即满分,
    // 亏损以估值5%为负向缩放基准平滑递减;正目标分支补分母>0守卫;末尾 isFinite 兜底杜绝任何极端值污染。
    const _profTarget = kpiDef.profitability.target;
    const _valScale = Math.max(1, Math.abs(company.valuation || 0) * 0.05);
    let profitScore;
    if (_profTarget <= 0) {
      profitScore = Math.min(1.0, Math.max(0, 1 + netCash / _valScale));
    } else {
      const _denom = _profTarget * (company.valuation || 0);
      profitScore =
        _denom > 0
          ? Math.min(1.0, Math.max(0, netCash / _denom))
          : netCash >= 0
            ? 1.0
            : 0;
    }
    if (!isFinite(profitScore)) profitScore = 0;
    scores.profitability = {
      achieved: netCash,
      target: kpiDef.profitability.targetDesc,
      score: profitScore,
    };
    totalWeightedScore += profitScore * kpiDef.profitability.weight;
    totalWeight += kpiDef.profitability.weight;
  }

  // 估值增长率
  if (kpiDef.valuationGrowth && company.kpiHistory.length > 0) {
    const lastValuation =
      company.kpiHistory[company.kpiHistory.length - 1].valuation ||
      company.valuation;
    const valGrowth =
      lastValuation > 0
        ? (company.valuation - lastValuation) / lastValuation
        : 0;
    const valScore = Math.min(
      1.0,
      Math.max(0, valGrowth / kpiDef.valuationGrowth.target),
    );
    scores.valuationGrowth = {
      achieved: valGrowth,
      target: kpiDef.valuationGrowth.target,
      score: valScore,
    };
    totalWeightedScore += valScore * kpiDef.valuationGrowth.weight;
    totalWeight += kpiDef.valuationGrowth.weight;
  }

  const finalScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  const passed = finalScore >= kpiDef.passThreshold;

  return {
    score: Math.round(finalScore * 100) / 100,
    details: scores,
    passed,
    threshold: kpiDef.passThreshold,
    warningThreshold: kpiDef.warningThreshold,
    fundingRound: fundingRound,
  };
}

/** 计算平均用户增长率 */
function _calculateAvgUserGrowthRate(company) {
  if (!company.products || company.products.length === 0) return 0;
  let totalGrowth = 0;
  let count = 0;
  for (const p of company.products) {
    if (p.status === "launched" && p.userGrowthRate !== undefined) {
      totalGrowth += p.userGrowthRate || 0;
      count++;
    }
  }
  return count > 0 ? totalGrowth / count : 0;
}

/** 季度董事会评估 */
function evaluateBoardPerformance(state) {
  const company = state.startup.company;
  if (!company || !company.boardMembers || company.boardMembers.length === 0)
    return null;

  const evalResult = _calculateQuarterlyKPIScore(state, company);

  // 记录KPI历史
  const quarter = Math.floor((state.player.day - company.foundedDay) / 90) + 1;
  const year = Math.floor((state.player.day - 1) / 365) + 1;

  company.kpiHistory.push({
    quarter,
    year,
    revenue: company.revenue,
    valuation: company.valuation,
    kpi: evalResult.score,
    passed: evalResult.passed,
    details: evalResult.details,
  });

  company.boardKPIHistory.push({
    quarter,
    year,
    scores: evalResult.details,
    totalScore: evalResult.score,
    passed: evalResult.passed,
    fundingRound: evalResult.fundingRound,
  });

  company.lastBoardEvaluation = {
    quarter,
    year,
    score: evalResult.score,
    passed: evalResult.passed,
    details: evalResult.details,
  };

  // 更新股东满意度和信任度
  if (evalResult.passed) {
    company.shareholderSatisfaction = Math.min(
      100,
      company.shareholderSatisfaction + 5,
    );
    company.shareholderTrust = Math.min(100, company.shareholderTrust + 3);
  } else {
    company.shareholderSatisfaction = Math.max(
      0,
      company.shareholderSatisfaction - 8,
    );
    company.shareholderTrust = Math.max(0, company.shareholderTrust - 5);
  }

  // 更新每个董事会成员的满意度
  for (const member of company.boardMembers) {
    const memberFocusBonus = _getMemberFocusBonus(member, evalResult.details);
    if (evalResult.passed) {
      member.satisfaction = Math.min(
        100,
        member.satisfaction + 3 + memberFocusBonus,
      );
      member.trust = Math.min(100, member.trust + 2);
    } else {
      member.satisfaction = Math.max(
        0,
        member.satisfaction - 5 - memberFocusBonus,
      );
      member.trust = Math.max(0, member.trust - 3);
    }
    member.lastEvaluation = { quarter, year, score: evalResult.score };
  }

  // 计算董事会压力等级
  const newPressureLevel = _calculateBoardPressureLevel(
    state,
    company,
    evalResult,
  );
  const pressureChanged = newPressureLevel !== company.boardPressureLevel;
  company.boardPressureLevel = newPressureLevel;

  // 压力等级变化时触发事件
  if (pressureChanged && newPressureLevel > 0) {
    _triggerBoardPressureEvent(state, company, newPressureLevel);
  }

  // 检查连续未达标
  const consecutiveFailures = _countConsecutiveFailures(company.kpiHistory);
  if (consecutiveFailures >= 2) {
    company.shareholderTrust = Math.max(0, company.shareholderTrust - 5);
    for (const member of company.boardMembers) {
      member.concerns = ["连续未达标"];
    }
  }

  return {
    score: evalResult.score,
    passed: evalResult.passed,
    threshold: evalResult.threshold,
    pressureLevel: newPressureLevel,
    consecutiveFailures,
    details: evalResult.details,
  };
}

/** 获取董事会成员关注领域加成 */
function _getMemberFocusBonus(member, kpiDetails) {
  let bonus = 0;
  for (const area of member.focusAreas) {
    const areaKey =
      area === "增长率"
        ? "revenueGrowth"
        : area === "市场份额"
          ? "marketShare"
          : area === "现金流"
            ? "profitability"
            : area === "团队稳定性"
              ? "teamStability"
              : area === "团队规模"
                ? "teamScale"
                : area === "产品方向"
                  ? "productMilestone"
                  : area === "战略协同"
                    ? "marketShare"
                    : area === "技术壁垒"
                      ? "productMilestone"
                      : area === "对赌条款"
                        ? "profitability"
                        : area === "合规性"
                          ? "productMilestone"
                          : area === "就业贡献"
                            ? "teamScale"
                            : area === "业务整合"
                              ? "marketShare"
                              : null;

    if (areaKey && kpiDetails[areaKey] && kpiDetails[areaKey].score >= 0.8) {
      bonus += 2;
    } else if (
      areaKey &&
      kpiDetails[areaKey] &&
      kpiDetails[areaKey].score < 0.5
    ) {
      bonus -= 2;
    }
  }
  return Math.max(-3, Math.min(3, bonus));
}

/** 计算董事会压力等级 */
function _calculateBoardPressureLevel(state, company, evalResult) {
  // 基础压力来自KPI完成率
  let basePressure = 0;
  if (evalResult.score < 0.2) basePressure = 4;
  else if (evalResult.score < 0.3) basePressure = 3;
  else if (evalResult.score < 0.45) basePressure = 2;
  else if (evalResult.score < 0.6) basePressure = 1;
  else basePressure = 0;

  // 连续未达标加重
  const consecutiveFailures = _countConsecutiveFailures(company.kpiHistory);
  if (consecutiveFailures >= 3) basePressure = Math.min(4, basePressure + 1);

  // Runway过低加重
  if (company.monthsOfRunway < 3) basePressure = Math.min(4, basePressure + 1);
  else if (company.monthsOfRunway < 6) basePressure = Math.max(1, basePressure);

  // 股东满意度低加重
  if (company.shareholderSatisfaction < 30)
    basePressure = Math.min(4, basePressure + 1);

  // 董事会成员平均满意度
  if (company.boardMembers.length > 0) {
    const avgMemberSatisfaction =
      company.boardMembers.reduce((s, m) => s + m.satisfaction, 0) /
      company.boardMembers.length;
    if (avgMemberSatisfaction < 30)
      basePressure = Math.min(4, basePressure + 1);
  }

  // 激进型投资人（VC/PE）加重
  for (const member of company.boardMembers) {
    if (
      member.pressureTolerance === "低" ||
      member.pressureTolerance === "极低"
    ) {
      if (evalResult.score < member.patience / 100) {
        basePressure = Math.min(4, basePressure + 1);
      }
    }
  }

  return Math.min(4, Math.max(0, basePressure));
}

/** 统计连续未达标次数 */
function _countConsecutiveFailures(kpiHistory) {
  if (!kpiHistory || kpiHistory.length === 0) return 0;
  let count = 0;
  for (let i = kpiHistory.length - 1; i >= 0; i--) {
    if (!kpiHistory[i].passed) count++;
    else break;
  }
  return count;
}

/** 触发董事会压力事件 */
function _triggerBoardPressureEvent(state, company, pressureLevel) {
  const eventKey =
    pressureLevel >= 4
      ? "ultimatum"
      : pressureLevel === 3
        ? "severe_warning"
        : pressureLevel === 2
          ? "moderate_warning"
          : "mild_warning";

  const event = BOARD_PRESSURE_EVENTS[eventKey];
  if (!event) return;

  company.pendingBoardAction = {
    type: eventKey,
    deadline: state.player.day + 30, // 30天内必须处理
    event,
    pressureLevel,
  };

  StateManager.addMessage(
    `${event.icon} 【${event.title}】KPI完成率${Math.round((company.boardKPIHistory[company.boardKPIHistory.length - 1]?.totalScore || 0) * 100)}%，${event.trigger}，请在30天内做出决策！`,
    pressureLevel >= 3 ? "warning" : "event",
  );
}

/** 处理董事会压力事件选择 */
function resolveBoardPressureAction(state, optionIndex) {
  const company = state.startup.company;
  if (!company || !company.pendingBoardAction)
    return { success: false, message: "没有待处理的董事会行动" };

  const action = company.pendingBoardAction;
  const event = action.event;
  const option = event.options[optionIndex];
  if (!option) return { success: false, message: "无效选项" };

  // 检查费用
  if (company.cashReserve < option.cost) {
    return { success: false, message: `现金不足，需要¥${option.cost}` };
  }

  // 扣费
  company.cashReserve -= option.cost;

  // 应用效果
  if (option.effects) {
    for (const [key, value] of Object.entries(option.effects)) {
      if (key === "satisfaction") {
        company.shareholderSatisfaction = Math.max(
          0,
          Math.min(100, company.shareholderSatisfaction + value),
        );
      } else if (key === "trust") {
        company.shareholderTrust = Math.max(
          0,
          Math.min(100, company.shareholderTrust + value),
        );
      } else if (key === "alignment") {
        company.boardAlignment = Math.max(
          0,
          Math.min(100, company.boardAlignment + value),
        );
      } else if (key === "revenue") {
        company.revenue = Math.max(0, company.revenue + value);
      } else if (key === "employeeMorale") {
        for (const emp of company.employees) {
          emp.satisfaction = Math.max(
            0,
            Math.min(100, emp.satisfaction + value),
          );
        }
      } else if (key === "risk") {
        // 风险标记
        company._boardRisk = (company._boardRisk || 0) + value;
      } else if (key === "debt") {
        // 新增债务
        company.boardDebt = (company.boardDebt || 0) + value;
        company.boardInterestRate = Math.max(
          company.boardInterestRate || 0,
          value / 1000,
        );
      } else if (key === "interestRate") {
        company.boardInterestRate = Math.max(
          company.boardInterestRate || 0,
          value,
        );
      } else if (key === "dilution") {
        // 股权稀释
        company.equity.player = Math.max(
          0,
          company.equity.player - value * 100,
        );
        company.equity.investors += value * 100;
      } else if (key === "leadershipChange") {
        company.CEOReplaced = true;
        state.startup.flags.ceoReplaced = true;
      } else if (key === "crisisMitigation") {
        state.flags.boardCrisisResolved = true;
      } else if (key === "boardRevolt") {
        state.flags.boardRevolt = true;
      } else if (key === "playerRoleChange") {
        state.player.corporate?.rank && (company.CEOReplaced = true);
      }
    }
  }

  // 更新董事会成员满意度
  for (const member of company.boardMembers) {
    member.satisfaction = Math.max(
      0,
      Math.min(
        100,
        member.satisfaction + (option.effects?.satisfaction || 0) / 2,
      ),
    );
    member.trust = Math.max(
      0,
      Math.min(100, member.trust + (option.effects?.trust || 0) / 2),
    );
  }

  // 记录压力事件历史
  company.boardPressureHistory.push({
    quarter: Math.floor((state.player.day - company.foundedDay) / 90) + 1,
    year: Math.floor((state.player.day - 1) / 365) + 1,
    level: action.pressureLevel,
    event: eventKey,
    resolved: true,
    choice: option.text,
    day: state.player.day,
  });

  // 清除待处理行动
  company.pendingBoardAction = null;

  // 降低压力等级
  company.boardPressureLevel = Math.max(0, company.boardPressureLevel - 1);

  StateManager.addMessage(
    `✅ 董事会决策：${option.text} → ${option.feedback}`,
    "success",
  );

  return { success: true, feedback: option.feedback };
}

/** 股东沟通行动 */
function executeShareholderCommunication(state, actionId) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const action = SHAREHOLDER_COMMUNICATION_ACTIONS[actionId];
  if (!action) return { success: false, message: "无效行动" };

  // 检查费用
  if (company.cashReserve < action.cost) {
    return { success: false, message: `现金不足，需要¥${action.cost}` };
  }

  // 扣费
  company.cashReserve -= action.cost;

  // 应用效果
  if (action.effects) {
    for (const [key, value] of Object.entries(action.effects)) {
      if (key === "satisfaction") {
        company.shareholderSatisfaction = Math.max(
          0,
          Math.min(100, company.shareholderSatisfaction + value),
        );
      } else if (key === "trust") {
        company.shareholderTrust = Math.max(
          0,
          Math.min(100, company.shareholderTrust + value),
        );
      } else if (key === "alignment") {
        company.boardAlignment = Math.max(
          0,
          Math.min(100, company.boardAlignment + value),
        );
      } else if (key === "reputation") {
        company.reputation = Math.max(
          0,
          Math.min(100, company.reputation + value),
        );
      }
    }
  }

  // 更新董事会成员
  for (const member of company.boardMembers) {
    member.satisfaction = Math.max(
      0,
      Math.min(
        100,
        member.satisfaction + Math.round(action.effects?.satisfaction / 2),
      ),
    );
    member.trust = Math.max(
      0,
      Math.min(100, member.trust + Math.round(action.effects?.trust / 2)),
    );
  }

  StateManager.addMessage(
    `📋 ${action.name}：${action.desc} → 股东满意度${Math.round(company.shareholderSatisfaction)}%，信任度${Math.round(company.shareholderTrust)}%`,
    "success",
  );

  return { success: true };
}

/** 获取可用的股东沟通行动 */
function getAvailableShareholderActions() {
  return Object.values(SHAREHOLDER_COMMUNICATION_ACTIONS);
}

/** 获取董事会压力等级文本 */
function getPressureLevelText(level) {
  const texts = {
    0: "无压力 ✅",
    1: "温和提醒 ⚠️",
    2: "正式警告 🔶",
    3: "紧急会议 🔴",
    4: "最后通牒 💀",
  };
  return texts[level] || "未知";
}

/** 获取董事会压力等级颜色 */
function getPressureLevelColor(level) {
  const colors = {
    0: "var(--success)",
    1: "var(--warning)",
    2: "#e6a23c",
    3: "var(--danger)",
    4: "#901717",
  };
  return colors[level] || "#999";
}

// ====== 核心：公司运营（每日/季度）======
/**
 * @param {Object} state - 游戏状态
 * @param {string} tickType - 'daily' | 'quarterly' 调用类型
 */
function tickStartup(state, tickType) {
  tickType = tickType || "quarterly"; // 默认季度（兼容旧调用）
  const startup = state.startup;
  if (!startup || startup.status === "none" || startup.flags.exited) return;

  const company = startup.company;
  if (!company) return;

  // 创业危机子系统接入（原死代码：checkStartupCrises 此前无任何调用方，危机永不触发）
  if (tickType === "quarterly" && typeof checkStartupCrises === "function") {
    try {
      const _crisis = checkStartupCrises(state);
      if (_crisis && typeof showCrisisModal === "function") {
        showCrisisModal(state, _crisis.crisisId, _crisis.crisis);
      }
    } catch (e) {
      /* 危机检查/展示失败不应中断每日结算 */
    }
  }

  const day = state.player.day;

  // 时间倍率：daily=1, quarterly=90（天）
  const timeMult = tickType === "daily" ? 1 : 90;
  // 每日基础参数
  const DAILY_BASE_REVENUE = 180; // ~¥180/天/产品 → ~¥16,200/季度
  const DAILY_SALARY_DIV = 30; // 月薪÷30 = 日薪
  const DAILY_RENT_BASE = 180; // ~¥180/天 → ~¥5,400/季度
  const DAILY_RENT_PER_EMP = 33; // ~¥33/天/人 → ~¥1,000/季度
  const DAILY_RD = 180; // ~¥180/天/产品 → ~¥16,200/季度
  const DAILY_MARKETING_BASE = 120; // ~¥120/天 → ~¥3,600/季度
  const DAILY_MARKETING_RATIO = 0.05 / 90; // 日营收比例
  const DAILY_LOYALTY_DECAY_BAD = 0.12; // ~3.6/季度
  const DAILY_LOYALTY_DECAY_GOOD = 0.02; // ~0.6/季度
  const DAILY_FIRE_PROB = 0.003; // ~0.3%/天 → ~2.7%/季度
  const DAILY_WORD_OF_MOUTH_PROB = 0.003; // ~0.3%/天 → ~2.7%/季度
  const DAILY_BASE_GROWTH = 0.0008; // ~0.08%/天 → ~7%/季度
  const DAILY_CHURN_BASE = 0.002; // ~0.2%/天 → ~18%/季度
  // P0-2: 降低成长加成，使创业更难
  const DAILY_GROWTH_BONUS = 0.001; // ~0.1%/天 → ~9%/季度（原0.003）

  // 1. 收入计算
  let totalRevenue = 0;
  // [全系统自洽修复] 域H A类修复: company.products 数组守卫(旧存档可能缺失products字段)
  if (!Array.isArray(company.products)) company.products = [];
  for (const product of company.products) {
    if (product.status === "launched") {
      const baseRevenue = DAILY_BASE_REVENUE * timeMult;
      // [全系统自洽修复] 域H A类#25: 防止 revenue 计算中 technologyScore/marketScore NaN 传播
      var _tech = (typeof product.technologyScore === "number" && isFinite(product.technologyScore)) ? product.technologyScore : 50;
      var _market = (typeof product.marketScore === "number" && isFinite(product.marketScore)) ? product.marketScore : 50;
      const techMod = _tech / 100;
      const marketMod = _market / 100;
      const industryMod =
        STARTUP_INDUSTRIES[company.industry]?.avgBurnRate / 50000 || 1;
      const growthMod = 1 + (company.revenue > 0 ? DAILY_GROWTH_BONUS : 0);

      // 行业热度联动：sectorHeat 偏离 1.0 的每 10% 转化 ±5% 收入调整
      var sectorHeat = 1.0;
      if (typeof getSectorHeat === "function") {
        try {
          sectorHeat = getSectorHeat(company.industry);
        } catch (e) {
          /* ignore */
        }
      }
      var heatMod = 1 + (sectorHeat - 1.0) * 0.5; // 50% 传导系数

      product.revenue = Math.round(
        baseRevenue *
          techMod *
          marketMod *
          industryMod *
          growthMod *
          heatMod *
          Random.float(0.9, 1.2),
      );
      totalRevenue += product.revenue;
    }
  }

  // 2. 支出计算
  let totalExpenses = 0;
  // 员工工资（日薪 × 天数）
  for (const emp of company.employees) {
    totalExpenses += Math.round((emp.salary / DAILY_SALARY_DIV) * timeMult);
  }
  // 办公租金（P2-11：基于办公地点等级）
  let rent = 0;
  if (company.officeLocation && OFFICE_LOCATIONS[company.officeLocation]) {
    // 使用办公地点的月租
    const officeCost = OFFICE_LOCATIONS[company.officeLocation].cost;
    rent = Math.round((officeCost * timeMult) / 90); // 月租转日租
  } else {
    // 默认基础租金（含员工空间）
    rent =
      Math.round(DAILY_RENT_BASE * timeMult) +
      company.employees.length * Math.round(DAILY_RENT_PER_EMP * timeMult);
  }
  // [全系统自洽修复] 域H R61: 删除员工空间租金重复计算（原L2509重复累加）
  totalExpenses += rent;
  // 研发成本
  const rAndD =
    (Array.isArray(company.products) ? company.products.filter((p) => p.status === "developing") : []).length *
    Math.round(DAILY_RD * timeMult);
  totalExpenses += rAndD;
  // 营销
  const marketing =
    Math.round(DAILY_MARKETING_BASE * timeMult) +
    Math.round(company.revenue * DAILY_MARKETING_RATIO * timeMult);
  totalExpenses += marketing;

  // ====== 新增运营成本（使创业更难更真实）=======
  // 水电网络费 ~¥50/天
  const utilities = Math.round(50 * timeMult);
  totalExpenses += utilities;

  // 法律合规费 ~¥30/天（工商年检、商标、许可证等）
  const legalCompliance = Math.round(30 * timeMult);
  totalExpenses += legalCompliance;

  // 杂项（办公耗材、茶水、清洁等）~¥25/天
  const miscOps = Math.round(25 * timeMult);
  totalExpenses += miscOps;

  // 社保公积金（每个员工额外40%用工成本）
  const socialInsurance = company.employees.reduce(function (sum, emp) {
    return sum + Math.round((emp.salary / DAILY_SALARY_DIV) * 0.4 * timeMult);
  }, 0);
  totalExpenses += socialInsurance;

  company.revenue = totalRevenue;
  company.expenses = totalExpenses;

  // 3. 净现金流
  // [全系统自洽修复] 域H A类#21: 防止 totalRevenue/totalExpenses NaN 传播
  if (typeof totalRevenue !== "number" || !isFinite(totalRevenue)) totalRevenue = 0;
  if (typeof totalExpenses !== "number" || !isFinite(totalExpenses)) totalExpenses = 0;
  const netCash = totalRevenue - totalExpenses;
  company.cashReserve = (typeof company.cashReserve === "number" && isFinite(company.cashReserve)) ? company.cashReserve + netCash : netCash;

  // 4. 烧钱率 & runway
  company.burnRate = Math.max(0, totalExpenses - totalRevenue);
  if (!isFinite(company.burnRate)) company.burnRate = 0;
  company.monthsOfRunway =
    company.burnRate > 0 ? (company.cashReserve || 0) / (company.burnRate / 30) : 999;

  // 5. 估值漂移
  // [全系统自洽修复] 域H A类#22: 防止 company.valuation NaN 传播
  if (typeof company.valuation !== "number" || !isFinite(company.valuation)) {
    company.valuation = 5000000; // 默认估值500万
  }
  const valuationUpMod = tickType === "daily" ? 0.0003 : 0.02;
  const valuationDownMod = tickType === "daily" ? 0.0002 : 0.01;
  if (netCash > 0) {
    company.valuation *= 1 + valuationUpMod + Random.float(0, valuationUpMod);
  } else if (netCash < 0) {
    company.valuation *=
      1 - valuationDownMod - Random.float(0, valuationDownMod);
  }
  company.valuation = Math.round(company.valuation);
  if (!isFinite(company.valuation)) company.valuation = 5000000;

  // 更新峰值估值
  if (!startup.history) startup.history = {};
  var _prevPeak = startup.history.peakValuation || 0;
  if (company.valuation > _prevPeak) {
    startup.history.peakValuation = company.valuation;
  }
  // [全系统自洽修复] 域H联动: 估值里程碑→心情峰终峰值(H→G 峰终定律·成就时刻)
  if (typeof StateManager !== "undefined" && state.needs) {
    var _milestones = [
      { threshold: 1000000, flag: "_startupValuation1M", h: 8, msg: "🎉 公司估值突破¥1,000,000！你的坚持开始有了回报。" },
      { threshold: 10000000, flag: "_startupValuation10M", h: 15, msg: "🚀 公司估值突破¥10,000,000！你正在创造属于自己的商业传奇！" },
      { threshold: 100000000, flag: "_startupValuation100M", h: 25, msg: "💎 公司估值突破¥100,000,000！曾经的街头创业者,如今身价过亿！" },
    ];
    for (var _mi = 0; _mi < _milestones.length; _mi++) {
      var _m = _milestones[_mi];
      if (startup.history.peakValuation >= _m.threshold && _prevPeak < _m.threshold) {
        if (!state.flags[_m.flag]) {
          state.flags[_m.flag] = true;
          state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + _m.h);
          StateManager.addMessage(_m.msg, "success");
        }
      }
    }
  }

  // 6. 团队忠诚度衰减
  for (const emp of company.employees) {
    emp.loyalty = Math.max(
      0,
      emp.loyalty -
        (netCash < 0 ? DAILY_LOYALTY_DECAY_BAD : DAILY_LOYALTY_DECAY_GOOD) *
          timeMult,
    );
    // 低忠诚度可能离职
    if (emp.loyalty < 20 && Random.chance(DAILY_FIRE_PROB * timeMult)) {
      StateManager.addMessage(
        "⚠️ 「" + emp.name + "」因不满公司状况离职！",
        "danger",
      );
      fireEmployee(state, emp.id);
    }

    // P0-4: 员工满意度/倦怠演化
    _tickEmployeeSatisfaction(state, emp, company, netCash, timeMult);
  }

  // 7. 破产检测
  if (company.monthsOfRunway <= 0 && company.fundingRounds.length >= 2) {
    StateManager.addMessage("⚠️ 资金链告急！尝试紧急融资...", "warning");
  }

  if (company.monthsOfRunway <= 0) {
    bankrupt(state);
  }

  // 8. 阶段升级检查
  if (company.phase === "seed" && company.employees.length >= 5) {
    company.phase = "growth";
    state.startup.status = "growth";
    StateManager.addMessage("📈 团队扩大，公司进入成长期！", "success");
  }

  // 9. 产品运营 — 用户增长 + 口碑传播
  for (const product of company.products) {
    if (product.status === "launched") {
      const wordOfMouth = Random.chance(DAILY_WORD_OF_MOUTH_PROB * timeMult)
        ? 0.05
        : 0;
      const baseGrowth = DAILY_BASE_GROWTH * timeMult;
      // [全系统自洽修复] 域H A类#23: 防止 technologyScore/marketScore NaN 传播
      var techScore = (typeof product.technologyScore === "number" && isFinite(product.technologyScore)) ? product.technologyScore : 50;
      var marketScore = (typeof product.marketScore === "number" && isFinite(product.marketScore)) ? product.marketScore : 50;
      const productFactor = (techScore + marketScore) / 200;
      const growthRate = baseGrowth * productFactor + wordOfMouth;

      if (!product.users) product.users = 100;
      product.users = Math.round(product.users * (1 + growthRate));

      // 口碑评分
      if (!product.rating) product.rating = 3.5;
      // [全系统自洽修复] 域H A类#24: 防止 ratingChange NaN 传播
      var _techForRating = (typeof product.technologyScore === "number" && isFinite(product.technologyScore)) ? product.technologyScore : 50;
      const ratingChange =
        ((_techForRating / 100 - 0.5) * 0.2) / timeMult +
        Random.float(-0.05, 0.05) / timeMult;
      product.rating = Math.max(1, Math.min(5, product.rating + ratingChange));

      // 用户留存
      const churnRate =
        DAILY_CHURN_BASE * timeMult + (1 - product.rating / 5) * 0.1;
      const retained = Math.floor(
        product.users * (1 - Math.min(churnRate, 0.5)),
      );
      const lost = product.users - retained;

      if (wordOfMouth > 0) {
        StateManager.addMessage(
          "🔥 「" +
            product.name +
            "」口碑爆发！新增用户 +" +
            Math.round(product.users * growthRate) +
            "，当前用户 " +
            product.users +
            "，评分 " +
            product.rating.toFixed(1) +
            "★",
          "success",
        );
      }

      if (lost > 0 && Random.chance(0.2 / timeMult)) {
        StateManager.addMessage(
          "📉 「" +
            product.name +
            "」流失 " +
            lost +
            " 用户（留存率 " +
            (100 - Math.min(churnRate, 0.5) * 100).toFixed(0) +
            "%）",
          "warning",
        );
      }

      // ====== P0-1: 产品生命周期演化 ======
      // 计算今日增长率和流失率
      const prevUsers = product.usersBeforeTick || product.users;
      product.usersBeforeTick = product.users; // 保存供下一天比较
      const userChange = product.users - prevUsers;
      product.userGrowthRate =
        prevUsers > 0 ? (userChange / prevUsers) * 100 : 0;
      product.churnRate = churnRate * 100; // 转换为百分比

      // 更新峰值记录
      if (product.users > product.peakUsers) product.peakUsers = product.users;
      if (product.revenue > product.peakRevenue)
        product.peakRevenue = product.revenue;

      // 计算市场份额（基于公司总收入占所有活跃公司总收入的比例）
      if (typeof _calculateMarketShare === "function") {
        product.marketShare = _calculateMarketShare(state, product);
      }

      // 生命周期阶段转换
      const oldStage = product.lifecycleStage;
      _evolveProductLifecycle(state, product, timeMult);

      // 阶段转换通知
      if (oldStage !== product.lifecycleStage) {
        const stageNames = {
          introduction: "引入期",
          growth: "成长期",
          maturity: "成熟期",
          decline: "衰退期",
        };
        StateManager.addMessage(
          `🔄 「${product.name}」进入${stageNames[product.lifecycleStage]}！`,
          product.lifecycleStage === "growth"
            ? "success"
            : product.lifecycleStage === "decline"
              ? "danger"
              : "info",
        );
      }

      // 衰退期产品可能退市
      if (product.lifecycleStage === "decline" && product.retired === false) {
        if (typeof _checkProductRetirement === "function") {
          _checkProductRetirement(state, product);
        }
      }

      // ====== P0-2: AARRR 用户增长漏斗演化 ======
      _tickAARRRFunnel(state, product, timeMult);

      // ====== P0-3: 技术债务演化 ======
      _tickTechnicalDebt(state, product, timeMult);
    }
  }

  // 10. 检查收购要约（仅季度调用时检查，避免每日都弹）
  if (
    tickType !== "daily" &&
    !startup.flags._acquisitionOfferExpired &&
    !startup.flags.ipoFiled
  ) {
    const offer = getAcquisitionOffer(state);
    if (offer) {
      state.startup.pendingAcquisitionOffer = offer;
      StateManager.addMessage(
        "🤝 「" +
          offer.acquirerName +
          "」向你提出收购要约！估值 " +
          offer.offerMultiplier.toFixed(2) +
          "x，前往创业Tab查看详情",
        "event",
      );
    }
  }

  // 11. 检查功能模块开发完成
  checkFeatureCompletion(state);

  // 12. 更新产品竞争力
  for (const product of company.products) {
    calculateProductCompetitiveness(product);
  }

  // 13. 竞争对手演化（每日）
  if (state.startup.competitors && state.startup.competitors.length > 0) {
    if (typeof tickCompetitors === "function") {
      tickCompetitors(state, state.startup.competitors);
    }

    // P1-9: 检测竞争对手攻击（每日）
    if (typeof detectCompetitorAttack === "function") {
      const newAttacks = detectCompetitorAttack(
        state,
        company,
        state.startup.competitors,
      );
      if (newAttacks && newAttacks.length > 0) {
        for (const attack of newAttacks) {
          // 添加到活跃攻击
          company.activeCompetitorAttacks.push({
            ...attack,
            startedDay: attack.startedDay || day,
            remainingDays: attack.durationDays,
            resolved: false,
          });
          // 应用初始效果
          applyCompetitorAttackEffects(state, company, attack);
          // 通知玩家
          StateManager.addMessage(
            `${attack.icon} 【${attack.name}】「${attack.competitorName}」发起${attack.attackType.replace("_", "/")}攻击！剩余${attack.durationDays}天。前往创业Tab应对`,
            attack.severity >= 4 ? "warning" : "event",
          );
        }
      }
    }

    // P1-9: 更新市场份额趋势
    if (!company.marketShareTrend) company.marketShareTrend = [];
    const currentShare =
      typeof calculateMarketShare === "function"
        ? calculateMarketShare(state, company, state.startup.competitors)
        : 0;
    company.marketShareTrend.push(currentShare);
    if (company.marketShareTrend.length > 30) company.marketShareTrend.shift();

    // P1-9: 更新竞争防御等级
    if (typeof _updateCompetitorDefenseLevel === "function") {
      _updateCompetitorDefenseLevel(state, company);
    }

    // P1-10: 检测运营危机事件（每日）
    if (typeof detectOperationalCrisis === "function") {
      const newCrises = detectOperationalCrisis(state, company);
      if (newCrises && newCrises.length > 0) {
        for (const crisis of newCrises) {
          // 添加到活跃危机
          company.activeCrisisEvents.push({
            ...crisis,
            startedDay: crisis.startedDay || day,
            remainingDays: crisis.durationDays,
            resolved: false,
          });
          // 应用初始效果
          applyCrisisEffects(state, company, crisis);
          // 更新记录
          company.lastCrisisDay = day;
          company.crisisFreeDays = 0;
          // 通知玩家
          const crisisType = CRISIS_EVENT_TYPES[crisis.crisisType];
          StateManager.addMessage(
            `${crisis.icon} 【${crisis.name}】${crisisType ? crisisType.name : "危机"}发生！严重程度${crisis.severity}/5，紧急度${crisis.urgency}。剩余${crisis.durationDays}天。前往创业Tab应对`,
            crisis.severity >= 4 ? "warning" : "event",
          );
        }
      } else {
        // 无新危机，增加无危机天数
        company.crisisFreeDays = (company.crisisFreeDays || 0) + 1;
      }
    }

    // P1-10: 更新危机韧性等级
    if (typeof _updateCrisisResilienceLevel === "function") {
      _updateCrisisResilienceLevel(state, company);
    }
  }

  // ====== P0-5: 季末 OKR 评估 ======
  if (tickType === "quarterly" && typeof evaluateQuarterlyOkr === "function") {
    evaluateQuarterlyOkr(state);
  }

  // ====== P1-6: 季末董事会评估 ======
  if (tickType === "quarterly") {
    const boardResult = evaluateBoardPerformance(state);
    if (boardResult) {
      const scorePct = Math.round(boardResult.score * 100);
      if (boardResult.passed) {
        StateManager.addMessage(
          `📋 董事会评估通过！KPI完成率 ${scorePct}%（目标≥${Math.round(boardResult.threshold * 100)}%），股东满意度${Math.round(company.shareholderSatisfaction)}%`,
          "success",
        );
      } else {
        StateManager.addMessage(
          `⚠️ 董事会评估未通过！KPI完成率 ${scorePct}%（目标≥${Math.round(boardResult.threshold * 100)}%），股东满意度${Math.round(company.shareholderSatisfaction)}%，压力等级：${getPressureLevelText(company.boardPressureLevel)}`,
          boardResult.pressureLevel >= 3 ? "warning" : "event",
        );
      }
    }
  }

  // ====== P1-7: 公关/媒体系统季度评估 ======
  if (tickType === "quarterly") {
    _evaluateMediaRelationships(state, company);
    _processPendingCrisisEvents(state, company);
    _updateMediaRelationLevel(company);
    _evaluateCrisisProbability(state, company);
  }

  // ====== P1-8: 法律/合规风险系统季度评估 ======
  if (tickType === "quarterly") {
    _evaluateLegalRisk(state, company);
    _updateLegalRiskLevel(company);
    _updateComplianceGrade(company);
    _processPendingLegalEvent(state, company);
    _evaluateLegalEventProbability(state, company);
  }

  // ====== P2-11: 办公地点系统每日效果 ======
  if (company.officeLocation && OFFICE_LOCATIONS[company.officeLocation]) {
    const office = OFFICE_LOCATIONS[company.officeLocation];

    // 应用办公地点加成（每日）
    if (office.loyaltyMod) {
      for (const emp of company.employees) {
        emp.loyalty = Math.min(100, emp.loyalty + office.loyaltyMod * timeMult);
      }
    }
    if (office.recruitMod && company.phase !== "seed") {
      // 招聘加成在员工入职时应用
    }
    if (office.techBonus) {
      for (const product of company.products) {
        if (product.status === "launched") {
          product.technologyScore = Math.min(
            100,
            product.technologyScore + office.techBonus / timeMult,
          );
        }
      }
    }
    if (office.marketBonus) {
      for (const product of company.products) {
        if (product.status === "launched") {
          product.marketScore = Math.min(
            100,
            product.marketScore + office.marketBonus / timeMult,
          );
        }
      }
    }
    if (office.imageBonus) {
      company.reputation = Math.min(
        100,
        company.reputation + (office.imageBonus / 30) * timeMult,
      );
    }
  }

  // ====== P2-12: 企业文化系统每日效果 ======
  if (company.companyCulture && COMPANY_CULTURES[company.companyCulture]) {
    const culture = COMPANY_CULTURES[company.companyCulture];

    // 每日提升文化适应度（+1%/天，最高100%）
    if (company.cultureAdoptionProgress < 100) {
      company.cultureAdoptionProgress = Math.min(
        100,
        company.cultureAdoptionProgress + (1 * timeMult) / 90,
      );
    }

    // 适应度达标后降低文化冲突
    if (
      company.cultureAdoptionProgress >= 100 &&
      company.cultureConflictLevel > 0
    ) {
      company.cultureConflictLevel = Math.max(
        0,
        company.cultureConflictLevel - (0.1 * timeMult) / 90,
      );
    }

    // 应用文化对员工的影响（每日）
    const adoptionFactor = company.cultureAdoptionProgress / 100; // 适应度因子 0-1
    const conflictFactor = 1 - company.cultureConflictLevel / 4; // 冲突因子 0-1

    for (const emp of company.employees) {
      // 忠诚度影响
      const loyaltyMod =
        (culture.loyaltyMod || 0) * adoptionFactor * conflictFactor * timeMult;
      emp.loyalty = Math.max(0, Math.min(100, emp.loyalty + loyaltyMod));

      // 生产力影响（体现在产出上）
      if (emp.productivity === undefined) emp.productivity = 1.0;
      const productivityMod =
        (culture.productivityMod || 1.0) * adoptionFactor * conflictFactor;
      emp.productivity = productivityMod;
    }
  }

  // ====== P2-13: 合作伙伴系统每日演化 ======
  if (typeof tickPartners === "function") {
    tickPartners(state, company);
  }

  // ====== P2-15: 供应链系统每日演化 ======
  if (typeof tickSupplyChain === "function") {
    tickSupplyChain(state, company);
  }

  // [全系统自洽修复] 域H R170 H→G 联动增强: 创业现金流影响日常心情
  if (tickType === "daily" && state.needs) {
    if (netCash > 0) {
      state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 1);
    } else if (netCash < -1000) {
      state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 1);
    }
  }
}

// ====== P1-8: 法律/合规风险系统核心函数 ======

/** 评估法律风险 */
function _evaluateLegalRisk(state, company) {
  // 法律风险自然衰减（每季度 -3，最低 0）
  const decay = Math.max(0, company.legalRisk - 3);
  company.legalRisk = decay;

  // 合规水平高降低风险
  if (company.complianceGrade >= 3) {
    company.legalRisk = Math.max(0, company.legalRisk - 5);
  } else if (company.complianceGrade <= 1) {
    company.legalRisk = Math.min(100, company.legalRisk + 3);
  }

  // 专利数量高降低风险
  if (company.patentCount >= 3) {
    company.legalRisk = Math.max(0, company.legalRisk - 3);
  }

  // 活跃案件增加风险
  company.legalRisk = Math.min(
    100,
    company.legalRisk + company.legalCasesActive * 5,
  );

  // 记录历史
  company.legalRiskHistory.push({
    day: state.player.day,
    change: company.legalRisk - decay,
    reason: "季度评估",
    complianceGrade: company.complianceGrade,
    activeCases: company.legalCasesActive,
  });

  // 清理历史（保留最近 20 条）
  if (company.legalRiskHistory.length > 20) {
    company.legalRiskHistory = company.legalRiskHistory.slice(-20);
  }

  // 合规水平自然增长（每季度 +2，最高 100）
  company.complianceLevel = Math.min(100, company.complianceLevel + 2);
  company.complianceLevelHistory.push({
    day: state.player.day,
    change: 2,
    reason: "季度自然增长",
  });
  if (company.complianceLevelHistory.length > 20) {
    company.complianceLevelHistory = company.complianceLevelHistory.slice(-20);
  }

  // 监管关系衰减
  company.regulatoryRelationship = Math.max(
    0,
    company.regulatoryRelationship - 2,
  );
}

/** 更新法律风险等级 */
function _updateLegalRiskLevel(company) {
  const newLevel =
    LEGAL_RISK_LEVELS.findLast((l) => company.legalRisk >= l.threshold) ||
    LEGAL_RISK_LEVELS[0];
  if (newLevel.level !== company.legalRiskLevel) {
    const oldLevel =
      LEGAL_RISK_LEVELS.find((l) => l.level === company.legalRiskLevel) ||
      LEGAL_RISK_LEVELS[0];
    StateManager.addMessage(
      `⚖️ 法律风险等级变化：${oldLevel.name} → ${newLevel.name}（${newLevel.icon}）${newLevel.description ? ` · ${newLevel.description}` : ""}`,
      "event",
    );
    company.legalRiskLevel = newLevel.level;
  }
}

/** 更新合规等级 */
function _updateComplianceGrade(company) {
  const newGrade =
    COMPLIANCE_LEVELS.findLast((l) => company.complianceLevel >= l.threshold) ||
    COMPLIANCE_LEVELS[0];
  if (newGrade.level !== company.complianceGrade) {
    const oldGrade =
      COMPLIANCE_LEVELS.find((l) => l.level === company.complianceGrade) ||
      COMPLIANCE_LEVELS[0];
    StateManager.addMessage(
      `📋 合规等级变化：${oldGrade.name} → ${newGrade.name}（${newGrade.icon}）${newGrade.description ? ` · ${newGrade.description}` : ""}`,
      "event",
    );
    company.complianceGrade = newGrade.level;
  }
}

/** 处理待处理的法律事件 */
function _processPendingLegalEvent(state, company) {
  if (!company.pendingLegalEvent) return;

  const legalEvent = company.pendingLegalEvent;
  const daysRemaining = legalEvent.deadline - state.player.day;

  if (daysRemaining <= 0) {
    // 超时未处理，法律风险增加
    _resolveLegalEvent(state, company, -1);
    return;
  }

  // 法律风险随时间增加
  if (daysRemaining <= 14 && company.legalRiskLevel < 4) {
    company.legalRiskLevel = Math.min(4, company.legalRiskLevel + 1);
    StateManager.addMessage(
      `⚖️ 法律事件倒计时：${daysRemaining}天内必须处理「${legalEvent.name || legalEvent.eventName || "未知"}」！`,
      "warning",
    );
  }
}

/** 评估法律事件触发概率 */
function _evaluateLegalEventProbability(state, company) {
  // 基础触发概率
  let baseChance = 0.003; // 0.3%/天

  // 合规等级低增加触发概率
  if (company.complianceGrade <= 1) {
    baseChance *= 2.0;
  } else if (company.complianceGrade >= 3) {
    baseChance *= 0.5;
  }

  // 法律风险高增加触发概率
  if (company.legalRiskLevel >= 3) {
    baseChance *= 1.5;
  }

  // 行业因素
  const industry = company.industry;
  if (industry === "finance" || industry === "tech") {
    baseChance *= 1.3; // 金融/科技行业风险更高
  }

  // 活跃案件增加触发概率
  if (company.legalCasesActive > 0) {
    baseChance *= 1 + company.legalCasesActive * 0.3;
  }

  // 法律保险降低触发概率
  if (company.legalInsurance) {
    baseChance *= 0.7;
  }

  // 随机触发
  if (Random.chance(baseChance)) {
    _triggerLegalEvent(state, company);
  }
}

/** 触发法律事件 */
function _triggerLegalEvent(state, company) {
  // 选择风险类型
  const riskTypes = Object.keys(LEGAL_RISK_TYPES);
  const industry = company.industry;

  // 根据行业筛选可用风险类型
  const availableRiskTypes = riskTypes.filter((riskType) => {
    const typeInfo = LEGAL_RISK_TYPES[riskType];
    return (
      typeInfo.industries.includes(industry) ||
      typeInfo.industries.includes("all")
    );
  });

  if (availableRiskTypes.length === 0) return;

  const selectedRiskType = Random.fromArray(availableRiskTypes);

  // 筛选该风险类型的事件模板
  const eventTemplates = Object.values(LEGAL_EVENT_TEMPLATES).filter(
    (e) => e.riskType === selectedRiskType && e.type === "crisis",
  );

  if (eventTemplates.length === 0) return;

  const eventTemplate = Random.fromArray(eventTemplates);

  // 生成事件
  const eventId = _startupGenerateId();
  const event = {
    id: eventId,
    eventTemplateId: eventTemplate.id,
    type: eventTemplate.type,
    severity: eventTemplate.severity,
    riskType: selectedRiskType,
    title: eventTemplate.descTemplate
      ? eventTemplate.descTemplate.replace("公司", company.name)
      : eventTemplate.name,
    name: eventTemplate.name,
    triggeredDay: state.player.day,
    deadline:
      state.player.day +
      (eventTemplate.severity === "high"
        ? 14
        : eventTemplate.severity === "medium"
          ? 21
          : 30),
    resolved: false,
    response: null,
    financialImpact: 0,
  };

  company.pendingLegalEvent = event;
  company.legalRisk = Math.min(
    100,
    company.legalRisk + (eventTemplate.effects?.legalRisk || 5),
  );

  StateManager.addMessage(
    `⚖️ 法律事件：${event.title}（${LEGAL_RISK_TYPES[selectedRiskType].name}）`,
    "warning",
  );
}

/** 解决法律事件 */
function _resolveLegalEvent(state, company, responseIndex) {
  if (!company.pendingLegalEvent) return;

  const event = company.pendingLegalEvent;
  const eventTemplate = LEGAL_EVENT_TEMPLATES[event.eventTemplateId];

  if (responseIndex === -1) {
    // 超时未处理
    event.resolved = true;
    event.response = "timeout";
    event.outcome = "failed";
    event.financialImpact = (eventTemplate.effects?.financialLoss || 0) * 1.5;
    company.legalRisk = Math.min(100, company.legalRisk + 10);
    company.legalRiskLevel = Math.min(4, company.legalRiskLevel + 1);
    StateManager.addMessage(
      `⚖️ 法律事件超时：「${event.name}」未及时处理，风险升级！`,
      "danger",
    );
  } else {
    // 有响应
    const responseKey = eventTemplate.responseOptions[responseIndex];
    const response = LEGAL_RESPONSE_OPTIONS[responseKey];

    if (!response) return;

    event.resolved = true;
    event.response = responseKey;
    event.outcome = "resolved";

    // 计算效果
    const effectiveness = _calculateLegalResponseEffectiveness(
      company,
      response,
    );
    const actualFinancialLoss = response.cost * (1 - effectiveness * 0.3);

    // 应用效果
    if (response.effect) {
      for (const [key, value] of Object.entries(response.effect)) {
        if (key === "financialLoss") {
          event.financialImpact = actualFinancialLoss;
          company.legalBudget = Math.max(
            0,
            company.legalBudget - actualFinancialLoss,
          );
          company.legalSpent += actualFinancialLoss;
        } else if (key === "legalRisk") {
          company.legalRisk = Math.max(0, company.legalRisk + value);
        } else if (key === "reputation") {
          company.reputation = Math.max(
            0,
            Math.min(100, company.reputation + value),
          );
        } else if (key === "employeeMorale") {
          // 员工士气影响通过员工系统处理
        }
      }
    }

    // 合规水平提升
    if (effectiveness > 0.5) {
      company.complianceLevel = Math.min(100, company.complianceLevel + 5);
    }

    StateManager.addMessage(
      `⚖️ 法律事件处理：${response.label}，${effectiveness > 0.5 ? "成功" : "部分成功"}`,
      effectiveness > 0.5 ? "success" : "warning",
    );
  }

  // 记录历史
  company.legalHistory.push({
    day: state.player.day,
    type: event.riskType,
    severity: event.severity,
    outcome: event.outcome,
    financialImpact: event.financialImpact,
  });
  if (company.legalHistory.length > 20) {
    company.legalHistory = company.legalHistory.slice(-20);
  }

  // 清除待处理事件
  company.pendingLegalEvent = null;
  company.legalCasesActive = Math.max(0, company.legalCasesActive - 1);

  // 记录案件
  company.legalCases.push({
    ...event,
    resolvedDay: state.player.day,
  });
}

/** 计算法律事件应对效果 */
function _calculateLegalResponseEffectiveness(company, response) {
  // 基础效果
  let effectiveness = 0.5;

  // 合规等级加成
  effectiveness += company.complianceGrade * 0.05; // 每级 +5%

  // 法律风险等级惩罚
  effectiveness -= company.legalRiskLevel * 0.03; // 每级 -3%

  // 专利数量加成（专利相关事件）
  if (response.effect?.legalRisk && company.patentCount > 0) {
    effectiveness += Math.min(0.1, company.patentCount * 0.02);
  }

  // 监管关系加成
  if (company.regulatoryRelationship > 50) {
    effectiveness += 0.1;
  }

  // 法律保险加成
  if (company.legalInsurance) {
    effectiveness += 0.05;
  }

  return Math.max(0, Math.min(1, effectiveness));
}

/** 执行法律合规检查 */
function executeLegalChecklistAction(state, checklistId) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有可运营的公司" };

  const checklist = LEGAL_CHECKLIST[checklistId];
  if (!checklist) return { success: false, message: "无效的检查项" };

  // 检查是否已完成
  if (company.legalChecklist[checklistId]) {
    return { success: false, message: "该项已完成" };
  }

  // 检查预算
  if (company.legalBudget < checklist.cost) {
    return {
      success: false,
      message: `法律预算不足，需要 ¥${checklist.cost.toLocaleString()}`,
    };
  }

  // 检查行业匹配
  const industry = company.industry;
  if (
    !checklist.categories ||
    (!checklist.categories.includes(industry) &&
      checklist.categories?.includes("all") === false)
  ) {
    // 部分检查项对所有行业可用
  }

  // 执行检查
  company.legalBudget -= checklist.cost;
  company.legalSpent += checklist.cost;
  company.legalChecklist[checklistId] = state.player.day;

  // 应用效果
  if (checklist.benefit) {
    for (const [key, value] of Object.entries(checklist.benefit)) {
      if (key === "legalRisk") {
        company.legalRisk = Math.max(0, company.legalRisk + value);
      } else if (
        key === "technologyScore" &&
        company.technologyScore !== undefined
      ) {
        company.technologyScore = Math.min(
          100,
          company.technologyScore + value,
        );
      } else if (key === "complianceLevel") {
        company.complianceLevel = Math.min(
          100,
          company.complianceLevel + value,
        );
      } else if (
        key === "employeeMorale" &&
        company.employeeMorale !== undefined
      ) {
        company.employeeMorale = Math.max(
          0,
          Math.min(100, company.employeeMorale + value),
        );
      } else if (key === "financialRisk") {
        // 财务风险降低
      } else if (key === "reputation") {
        company.reputation = Math.max(
          0,
          Math.min(100, company.reputation + value),
        );
      }
    }
  }

  StateManager.addMessage(
    `✅ 法律合规检查：${checklist.name} 完成，法律风险降低`,
    "success",
  );

  return { success: true, message: `${checklist.name} 完成！` };
}

/** 申请专利 */
function applyPatent(state, patentTypeId) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有可运营的公司" };

  const patentType = PATENT_TYPES[patentTypeId];
  if (!patentType) return { success: false, message: "无效的专利类型" };

  // 检查行业匹配
  const industry = company.industry;
  if (
    !patentType.categories.includes(industry) &&
    !patentType.categories.includes("all")
  ) {
    return {
      success: false,
      message: `该专利类型不适用于${STARTUP_INDUSTRIES[industry].name}行业`,
    };
  }

  // 检查预算
  if (company.legalBudget < patentType.cost) {
    return {
      success: false,
      message: `法律预算不足，需要 ¥${patentType.cost.toLocaleString()}`,
    };
  }

  // 生成专利
  const patentId = _startupGenerateId();
  const patent = {
    id: patentId,
    type: patentTypeId,
    typeName: patentType.name,
    name: company.name + "核心专利" + (company.patents.length + 1),
    applyDay: state.player.day,
    grantDay: null,
    status: "pending", // pending/granted/expired/rejected
    protectionYears: patentType.protectionYears,
    cost: patentType.cost,
  };

  company.patents.push(patent);
  company.patentCount = company.patents.length;
  company.legalBudget -= patentType.cost;
  company.legalSpent += patentType.cost;
  company.legalRisk = Math.max(0, company.legalRisk - 5);

  StateManager.addMessage(
    `📜 已申请 ${patentType.name}：${patent.name}，预计 ${patentType.protectionYears} 年保护期`,
    "success",
  );

  return { success: true, message: `专利申请成功！`, patent };
}

/** 购买法律保险 */
function buyLegalInsurance(state, level) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有可运营的公司" };

  const insuranceCosts = [0, 50000, 150000, 300000];
  const cost = insuranceCosts[level] || 0;

  if (level <= company.legalInsuranceLevel) {
    return { success: false, message: "已拥有该等级或更高等级保险" };
  }

  if (company.legalBudget < cost) {
    return {
      success: false,
      message: `法律预算不足，需要 ¥${cost.toLocaleString()}`,
    };
  }

  company.legalInsurance = true;
  company.legalInsuranceLevel = level;
  company.legalBudget -= cost;
  company.legalSpent += cost;

  StateManager.addMessage(
    `🛡️ 已购买法律保险（${level === 1 ? "基础" : level === 2 ? "标准" : "高级"}）`,
    "success",
  );

  return { success: true, message: `法律保险购买成功！` };
}

/** 与监管机构沟通 */
function regulatoryCommunication(state, actionType) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有可运营的公司" };

  const actions = {
    build_relation: { cost: 30000, effect: +15 },
    compliance_report: { cost: 20000, effect: +10 },
    consultation: { cost: 10000, effect: +5 },
    lobby: { cost: 100000, effect: +25 },
  };

  const action = actions[actionType];
  if (!action) return { success: false, message: "无效的行动类型" };

  if (company.legalBudget < action.cost) {
    return {
      success: false,
      message: `法律预算不足，需要 ¥${action.cost.toLocaleString()}`,
    };
  }

  company.legalBudget -= action.cost;
  company.legalSpent += action.cost;
  company.regulatoryRelationship = Math.min(
    100,
    company.regulatoryRelationship + action.effect,
  );
  company.legalRisk = Math.max(0, company.legalRisk - action.effect * 0.3);

  StateManager.addMessage(
    `🏛️ 与监管机构沟通：${actionType === "lobby" ? "游说" : actionType === "compliance_report" ? "合规报告" : "建立关系"}，监管关系提升`,
    "success",
  );

  return { success: true, message: "监管关系提升！" };
}

/** 获取法律风险等级信息 */
function getLegalRiskLevelInfo(level) {
  return (
    LEGAL_RISK_LEVELS.find((l) => l.level === level) || LEGAL_RISK_LEVELS[0]
  );
}

/** 获取合规等级信息 */
function getComplianceGradeInfo(level) {
  return (
    COMPLIANCE_LEVELS.find((l) => l.level === level) || COMPLIANCE_LEVELS[0]
  );
}

/** 获取法律事件摘要 */
function getLegalEventSummary(eventId) {
  const eventTemplate = LEGAL_EVENT_TEMPLATES[eventId];
  if (!eventTemplate) return null;

  return {
    id: eventTemplate.id,
    name: eventTemplate.name,
    icon: eventTemplate.icon,
    type: eventTemplate.type,
    severity: eventTemplate.severity,
    riskType: eventTemplate.riskType,
    desc: eventTemplate.descTemplate || eventTemplate.desc,
    cost: eventTemplate.cost,
    successChance: eventTemplate.successChance,
  };
}

/** 获取可用法律事件 */
function getAvailableLegalEvents(state) {
  const company = state.startup.company;
  if (!company) return [];

  const industry = company.industry;
  return Object.values(LEGAL_EVENT_TEMPLATES).filter((event) => {
    if (event.type !== "opportunity") return false;
    const typeInfo = LEGAL_RISK_TYPES[event.riskType];
    return (
      typeInfo.industries.includes(industry) ||
      typeInfo.industries.includes("all")
    );
  });
}

/** 获取可用法律应对选项 */
function getAvailableLegalResponses(eventId) {
  const eventTemplate = LEGAL_EVENT_TEMPLATES[eventId];
  if (!eventTemplate || !eventTemplate.responseOptions) return [];

  return eventTemplate.responseOptions.map((optKey) => ({
    key: optKey,
    ...LEGAL_RESPONSE_OPTIONS[optKey],
  }));
}

/** 获取法律检查清单进度 */
function getLegalChecklistProgress(state) {
  const company = state.startup.company;
  if (!company) return [];

  return Object.values(LEGAL_CHECKLIST).map((checklist) => ({
    ...checklist,
    completed: !!company.legalChecklist[checklist.id],
    completedDay: company.legalChecklist[checklist.id],
  }));
}

/** 获取专利列表 */
function getPatentList(state) {
  const company = state.startup.company;
  if (!company) return [];
  return company.patents.map((p) => ({
    ...p,
    typeName: PATENT_TYPES[p.type]?.name || p.type,
    typeInfo: PATENT_TYPES[p.type],
  }));
}

// ====== P1-7: 公关/媒体系统核心函数 ======

/** 评估媒体关系 */
function _evaluateMediaRelationships(state, company) {
  // 媒体关系自然衰减（每季度 -5，最低 0）
  const decay = Math.max(0, company.mediaRelations - 5);
  company.mediaRelations = decay;

  // 根据正面/负面新闻调整
  if (company.positiveNewsCount > company.negativeNewsCount) {
    company.mediaRelations = Math.min(100, company.mediaRelations + 5);
    company.sentimentScore = Math.min(100, company.sentimentScore + 3);
  } else if (company.negativeNewsCount > company.positiveNewsCount) {
    company.mediaRelations = Math.max(0, company.mediaRelations - 5);
    company.sentimentScore = Math.max(-100, company.sentimentScore - 3);
  }

  // 记录历史
  company.mediaRelationHistory.push({
    day: state.player.day,
    change: company.mediaRelations - decay,
    reason: "季度评估",
    positiveNews: company.positiveNewsCount,
    negativeNews: company.negativeNewsCount,
  });

  // 清理历史（保留最近 20 条）
  if (company.mediaRelationHistory.length > 20) {
    company.mediaRelationHistory = company.mediaRelationHistory.slice(-20);
  }

  // 重置新闻计数
  company.positiveNewsCount = 0;
  company.negativeNewsCount = 0;

  // 更新媒体关系等级
  _updateMediaRelationLevel(company);
}

/** 更新媒体关系等级 */
function _updateMediaRelationLevel(company) {
  const newLevel =
    MEDIA_RELATION_LEVELS.findLast(
      (l) => company.mediaRelations >= l.threshold,
    ) || MEDIA_RELATION_LEVELS[0];
  if (newLevel.level !== company.mediaRelationLevel) {
    const oldLevel =
      MEDIA_RELATION_LEVELS.find(
        (l) => l.level === company.mediaRelationLevel,
      ) || MEDIA_RELATION_LEVELS[0];
    StateManager.addMessage(
      `📰 媒体关系等级变化：${oldLevel.name} → ${newLevel.name}（${newLevel.icon}）${newLevel.bonus ? ` · ${newLevel.bonus}` : ""}`,
      "event",
    );
    company.mediaRelationLevel = newLevel.level;
  }
}

/** 处理待处理的危机事件 */
function _processPendingCrisisEvents(state, company) {
  if (!company.pendingCrisisEvent) return;

  const crisis = company.pendingCrisisEvent;
  const daysRemaining = crisis.deadline - state.player.day;

  if (daysRemaining <= 0) {
    // 超时未处理，危机升级
    _resolveCrisisEvent(state, company, -1); // -1 表示超时未处理
    return;
  }

  // 危机等级随时间增加
  if (daysRemaining <= 7 && company.crisisLevel < 4) {
    company.crisisLevel = Math.min(4, company.crisisLevel + 1);
    StateManager.addMessage(
      `🚨 危机倒计时：${daysRemaining}天内必须处理「${crisis.event.title}」！`,
      "warning",
    );
  }
}

/** 评估危机触发概率 */
function _evaluateCrisisProbability(state, company) {
  // 基础触发概率
  let baseChance = 0.005; // 0.5%/天

  // 媒体关系低增加危机概率
  if (company.mediaRelationLevel < 2) {
    baseChance *= 1.5;
  } else if (company.mediaRelationLevel >= 4) {
    baseChance *= 0.5;
  }

  // 危机准备度降低危机概率
  baseChance *= 1 - company.crisisPrepLevel / 200;

  // 媒体培训水平降低危机概率
  baseChance *= 1 - company.mediaTrainingLevel / 200;

  // 品牌等级高降低危机概率
  const brandLevel = _getCompanyBrandLevel(company);
  if (brandLevel >= 4) {
    baseChance *= 0.7;
  }

  // 随机触发
  if (Random.chance(baseChance)) {
    _triggerRandomCrisis(state, company);
  }
}

/** 触发随机危机事件 */
function _triggerRandomCrisis(state, company) {
  // 根据公司发展阶段选择危机类型
  const phase = company.phase || "seed";
  const availableCrisisTypes = [];

  // 所有危机类型都有基础概率
  for (const [key, template] of Object.entries(PR_EVENT_TEMPLATES)) {
    if (template.type !== "crisis") continue;

    // 某些危机在特定阶段概率更高
    let weight = template.triggerChance || 0.01;

    // 数据泄露在 A 轮后更常见
    if (key === "data_breach" && phase === "A") weight *= 2;
    if (key === "data_breach" && phase === "B") weight *= 3;
    if (key === "data_breach" && phase === "C") weight *= 4;

    // 监管调查在 C 轮/IPO 前更常见
    if (key === "regulatory_investigation" && phase === "C") weight *= 3;
    if (key === "regulatory_investigation" && phase === "IPO") weight *= 5;

    // 高管丑闻在有一定规模后更常见
    if (key === "executive_scandal" && company.employees.length < 5)
      weight *= 0.3;

    // 用户投诉在产品发布后更常见
    if (
      key === "customer_complaint" &&
      company.products.some((p) => p.status === "launched")
    )
      weight *= 2;

    availableCrisisTypes.push({ key, weight, template });
  }

  // 按权重选择
  const totalWeight = availableCrisisTypes.reduce(
    (sum, c) => sum + c.weight,
    0,
  );
  let random = Random.float(0, totalWeight);
  let selected = availableCrisisTypes[0];

  for (const crisis of availableCrisisTypes) {
    random -= crisis.weight;
    if (random <= 0) {
      selected = crisis;
      break;
    }
  }

  // 生成危机事件
  const crisisId = _startupGenerateId();
  const crisisEvent = {
    id: crisisId,
    type: selected.key,
    severity: selected.template.severity,
    title: selected.template.descTemplate,
    icon: selected.template.icon,
    triggeredDay: state.player.day,
    deadline: state.player.day + 14, // 14天处理期限
    resolved: false,
    response: null,
    outcome: null,
  };

  company.prEvents.push(crisisEvent);
  company.pendingCrisisEvent = {
    id: crisisId,
    event: crisisEvent,
    deadline: crisisEvent.deadline,
  };

  // 增加危机等级
  company.crisisLevel = Math.min(
    4,
    company.crisisLevel +
      (selected.template.severity === "high"
        ? 2
        : selected.template.severity === "medium"
          ? 1
          : 0),
  );

  StateManager.addMessage(
    `${crisisEvent.icon} 【危机事件】${crisisEvent.title}，请在14天内做出决策！`,
    selected.template.severity === "high" ? "danger" : "warning",
  );
}

/** 执行危机应对 */
function resolveCrisisEvent(state, optionIndex) {
  const company = state.startup.company;
  if (!company || !company.pendingCrisisEvent)
    return { success: false, message: "没有待处理的危机事件" };

  const crisis = company.pendingCrisisEvent;
  const eventTemplate = PR_EVENT_TEMPLATES[crisis.event.type];
  if (!eventTemplate) return { success: false, message: "无效危机类型" };

  const options = eventTemplate.responseOptions;
  const optionKey = options[optionIndex];
  if (!optionKey) return { success: false, message: "无效选项" };

  const option = CRISIS_RESPONSE_OPTIONS[optionKey];
  if (!option) return { success: false, message: "无效应对方案" };

  // [全系统自洽修复] 域H R61: cashReserve扣费前NaN守卫
  if (!isFinite(company.cashReserve)) company.cashReserve = 0;
  if (company.cashReserve < option.cost) {
    return {
      success: false,
      message: `现金不足，需要¥${option.cost.toLocaleString()}`,
    };
  }

  // 执行应对
  company.cashReserve -= option.cost;

  // 应用效果
  for (const [key, value] of Object.entries(option.effect)) {
    if (company[key] !== undefined) {
      company[key] = Math.max(0, Math.min(100, company[key] + value));
    }
  }

  // 媒体关系影响
  if (company.mediaRelations) {
    const mediaBonus = company.mediaRelationLevel >= 3 ? 0.2 : 0; // 高媒体关系有 20% 缓冲
    company.mediaRelations = Math.max(
      0,
      Math.min(
        100,
        company.mediaRelations +
          (option.effect.mediaRelations || 0) * (1 - mediaBonus),
      ),
    );
  }

  // 记录结果
  crisis.resolved = true;
  crisis.response = optionKey;
  crisis.outcome = {
    cost: option.cost,
    effects: option.effect,
    resolvedDay: state.player.day,
  };

  // 记录危机历史
  company.crisisHistory.push({
    day: state.player.day,
    type: crisis.event.type,
    severity: crisis.event.severity,
    response: optionKey,
    outcome: option.effect,
    cost: option.cost,
  });

  // 清理待处理事件
  company.pendingCrisisEvent = null;

  // 根据应对效果调整声誉
  const effectiveness = _calculateCrisisResponseEffectiveness(
    crisis.event.type,
    optionKey,
    company,
  );
  if (effectiveness > 0.7) {
    StateManager.addMessage(
      `✅ 危机处理成功！${option.desc}，声誉+${Math.round(effectiveness * 10)}，${Object.entries(
        option.effect,
      )
        .map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`)
        .join(", ")}`,
      "success",
    );
  } else if (effectiveness > 0.4) {
    StateManager.addMessage(
      `🔶 危机处理一般，${option.desc}，${Object.entries(option.effect)
        .map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`)
        .join(", ")}`,
      "event",
    );
  } else {
    StateManager.addMessage(
      `❌ 危机处理不理想，${option.desc}，声誉继续受损`,
      "warning",
    );
  }

  // 重置危机等级（根据处理效果）
  company.crisisLevel = Math.max(
    0,
    company.crisisLevel -
      (effectiveness > 0.7 ? 2 : effectiveness > 0.4 ? 1 : 0),
  );

  return { success: true, outcome: option.effect, effectiveness };
}

/** 计算危机应对效果 */
function _calculateCrisisResponseEffectiveness(
  crisisType,
  responseKey,
  company,
) {
  let baseEffectiveness = 0.5;

  // 媒体关系加成
  baseEffectiveness += company.mediaRelationLevel * 0.03;

  // 危机准备度加成
  baseEffectiveness += company.crisisPrepLevel * 0.003;

  // 媒体培训加成
  baseEffectiveness += company.mediaTrainingLevel * 0.002;

  // 特定应对的效果加成
  const effectivenessBonuses = {
    // 产品故障：召回 > 赔偿 > 道歉 > 冷处理
    product_failure: {
      recall: 0.3,
      compensate: 0.15,
      apologize: 0.05,
      ignore: -0.3,
    },
    // 数据泄露：配合调查 > 聘请安全 > 通知用户 > 和解
    data_breach: {
      cooperate_authorities: 0.3,
      hire_security: 0.2,
      notify_users: 0.1,
      settle: 0.05,
    },
    // 高管丑闻：暂停职务 > 法律行动 > 发布声明 > 等待
    executive_scandal: {
      suspend_exec: 0.25,
      legal_action: 0.1,
      public_statement: 0.05,
      wait: -0.1,
    },
    // 用户投诉：公开回应 > 改进服务 > 私下和解 > 冷处理
    customer_complaint: {
      respond_publicly: 0.2,
      improve_service: 0.15,
      private_settlement: 0.05,
      ignore_crisis: -0.2,
    },
    // 竞争对手抹黑：专注产品 > 法律诉讼 > 反驳声明 > 无视
    competitor_attack: {
      focus_product: 0.25,
      legal_action_competitor: 0.15,
      counter_statement: 0.05,
      ignore_competitor: -0.1,
    },
    // 监管调查：全力配合 > 和解 > 法律抗辩 > 游说
    regulatory_investigation: {
      cooperate_regulatory: 0.3,
      settle_regulatory: 0.15,
      legal_defense: 0.05,
      lobby: -0.2,
    },
  };

  const bonuses = effectivenessBonuses[crisisType] || {};
  baseEffectiveness += bonuses[responseKey] || 0;

  return Math.max(0, Math.min(1, baseEffectiveness));
}

/** 执行公关活动 */
function executePREvent(state, eventId) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const eventTemplate = PR_EVENT_TEMPLATES[eventId];
  if (!eventTemplate || eventTemplate.type !== "positive") {
    return { success: false, message: "无效的公关活动" };
  }

  // 检查触发条件
  if (eventTemplate.triggerConditions) {
    if (
      eventTemplate.triggerConditions.minRevenue &&
      company.revenue < eventTemplate.triggerConditions.minRevenue
    ) {
      return {
        success: false,
        message: `需要月收入¥${eventTemplate.triggerConditions.minRevenue.toLocaleString()}才能举办`,
      };
    }
  }

  // 检查费用
  if (company.cashReserve < eventTemplate.cost) {
    return {
      success: false,
      message: `现金不足，需要¥${eventTemplate.cost.toLocaleString()}`,
    };
  }

  // 检查冷却
  if (company.lastMediaAction && company.lastMediaAction.actionId === eventId) {
    const daysSinceLast = state.player.day - company.lastMediaAction.day;
    const actionTemplate = MEDIA_RELATION_ACTIONS[eventId];
    if (actionTemplate && daysSinceLast < actionTemplate.cooldown) {
      return {
        success: false,
        message: `该活动冷却中，还需${actionTemplate.cooldown - daysSinceLast}天`,
      };
    }
  }

  // 执行活动
  company.cashReserve -= eventTemplate.cost;
  company.lastMediaAction = { actionId: eventId, day: state.player.day };

  // 应用效果（成功率影响）
  const success = Random.chance(eventTemplate.successChance);
  const multiplier = success ? 1 : 0.5; // 失败时效果减半

  for (const [key, value] of Object.entries(eventTemplate.effects)) {
    if (company[key] !== undefined) {
      const adjustedValue = Math.round(value * multiplier);
      company[key] = Math.max(0, Math.min(100, company[key] + adjustedValue));
    }
  }

  // 记录公关事件
  company.prEvents.push({
    id: _startupGenerateId(),
    type: "positive",
    title: eventTemplate.name,
    triggeredDay: state.player.day,
    resolved: true,
    success: success,
    outcome: eventTemplate.effects,
  });

  // 更新媒体关系等级
  _updateMediaRelationLevel(company);

  StateManager.addMessage(
    `${success ? "✅" : "🔶"} 【${eventTemplate.name}】${success ? "成功举办" : "效果一般"}，${Object.entries(eventTemplate.effects).map(([k, v]) => `${k} +${Math.round(v * multiplier)}）。${success ? "" : "(效果减半)"}`)}`,
    success ? "success" : "event",
  );

  return {
    success: true,
    outcome: eventTemplate.effects,
    successRate: eventTemplate.successChance,
  };
}

/** 执行媒体关系管理行动 */
function executeMediaRelationAction(state, actionId) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const action = MEDIA_RELATION_ACTIONS[actionId];
  if (!action) return { success: false, message: "无效行动" };

  // 检查费用
  if (company.cashReserve < action.cost) {
    return {
      success: false,
      message: `现金不足，需要¥${action.cost.toLocaleString()}`,
    };
  }

  // 检查冷却
  if (
    company.lastMediaAction &&
    company.lastMediaAction.actionId === actionId
  ) {
    const daysSinceLast = state.player.day - company.lastMediaAction.day;
    if (daysSinceLast < action.cooldown) {
      return {
        success: false,
        message: `该行动冷却中，还需${action.cooldown - daysSinceLast}天`,
      };
    }
  }

  // 执行行动
  company.cashReserve -= action.cost;
  company.lastMediaAction = { actionId, day: state.player.day };

  // 应用效果
  for (const [key, value] of Object.entries(action.effect)) {
    if (company[key] !== undefined) {
      company[key] = Math.max(0, Math.min(100, company[key] + value));
    }
  }

  // 更新媒体关系等级
  _updateMediaRelationLevel(company);

  StateManager.addMessage(
    `🤝 【${action.name}】${action.desc}，${Object.entries(action.effect)
      .map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`)
      .join(", ")}`,
    "success",
  );

  return { success: true, outcome: action.effect };
}

/** 获取可用公关活动 */
function getAvailablePREvents() {
  return Object.values(PR_EVENT_TEMPLATES).filter((e) => e.type === "positive");
}

/** 获取可用危机应对选项 */
function getAvailableCrisisResponses(crisisType) {
  const template = PR_EVENT_TEMPLATES[crisisType];
  if (!template || !template.responseOptions) return [];
  return template.responseOptions.map((optKey) => ({
    key: optKey,
    ...CRISIS_RESPONSE_OPTIONS[optKey],
  }));
}

/** 获取媒体关系等级信息 */
function getMediaRelationLevelInfo(level) {
  return (
    MEDIA_RELATION_LEVELS.find((l) => l.level === level) ||
    MEDIA_RELATION_LEVELS[0]
  );
}

/** 获取危机等级信息 */
function getCrisisLevelInfo(level) {
  return CRISIS_LEVELS.find((l) => l.level === level) || CRISIS_LEVELS[0];
}

/** 获取公关事件摘要 */
function getPREventSummary(state) {
  const company = state.startup.company;
  if (!company) return null;

  const recentEvents = company.prEvents.slice(-10);
  const positiveCount = recentEvents.filter(
    (e) => e.type === "positive" && e.success,
  ).length;
  const crisisCount = recentEvents.filter(
    (e) => e.type === "crisis" && e.resolved,
  ).length;
  const pendingCrisis = company.pendingCrisisEvent ? 1 : 0;

  return {
    mediaRelations: company.mediaRelations,
    mediaRelationLevel: company.mediaRelationLevel,
    crisisLevel: company.crisisLevel,
    positiveNews: positiveCount,
    crisisEvents: crisisCount,
    pendingCrisis,
    sentimentScore: company.sentimentScore,
    recentEvents: recentEvents.map((e) => ({
      type: e.type,
      title: e.title,
      day: e.triggeredDay,
      success: e.success,
      severity: e.severity,
    })),
  };
}

// ====== P0-1: 产品生命周期管理 ======
/** 产品生命周期演化 */
function _evolveProductLifecycle(state, product, timeMult) {
  const stage = product.lifecycleStage;

  // 引入期 → 成长期：用户增长率 > 5%/天 持续7天
  if (stage === "introduction") {
    if (product.userGrowthRate > 5) {
      product.consecutiveGrowthDays++;
      product.consecutiveDeclineDays = 0;
    } else {
      product.consecutiveGrowthDays = 0;
    }

    if (product.consecutiveGrowthDays >= 7) {
      product.lifecycleStage = "growth";
    }
  }

  // 成长期 → 成熟期：增长率 < 1% 且市场份额 > 15%
  else if (stage === "growth") {
    if (product.userGrowthRate < 1 && product.marketShare > 15) {
      product.lifecycleStage = "maturity";
    }
    // 追踪连续下降天数（用于触发衰退期）
    if (product.userGrowthRate < 0) {
      product.consecutiveDeclineDays =
        (product.consecutiveDeclineDays || 0) + 1;
    } else {
      product.consecutiveDeclineDays = 0;
    }
    if (product.userGrowthRate < -3 && product.consecutiveDeclineDays >= 14) {
      product.lifecycleStage = "decline";
    }
  }

  // 成熟期 → 衰退期：流失率 > 3%/天 持续14天 或 被新技术替代
  else if (stage === "maturity") {
    // 追踪连续下降天数（用于触发衰退期）
    if (product.churnRate > 3) {
      product.consecutiveDeclineDays =
        (product.consecutiveDeclineDays || 0) + 1;
    } else {
      product.consecutiveDeclineDays = 0;
    }
    if (product.churnRate > 3 && product.consecutiveDeclineDays >= 14) {
      product.lifecycleStage = "decline";
    }
    // 随机技术替代概率（每年约5%）
    if (Random.chance(0.0006)) {
      // 0.06%/天 ≈ 5%/年
      product.lifecycleStage = "decline";
      StateManager.addMessage(
        `⚡ 「${product.name}」遭遇技术颠覆！行业出现替代方案`,
        "danger",
      );
    }
  }

  // 衰退期：持续流失，可能退市
  else if (stage === "decline") {
    if (product.userGrowthRate < 0) {
      product.consecutiveDeclineDays++;
    } else {
      product.consecutiveDeclineDays = 0;
    }
  }
}

/** 检查产品是否应退市 */
function _checkProductRetirement(state, product) {
  // 退市条件：连续60天用户<100 或 连续90天收入<¥1000
  if (product.users < 100 && product.consecutiveDeclineDays >= 60) {
    _retireProductInternal(
      state,
      product,
      "market_decline",
      "用户基数过低，市场自然淘汰",
    );
    return;
  }

  if (product.revenue < 1000 && product.consecutiveDeclineDays >= 90) {
    _retireProductInternal(
      state,
      product,
      "market_decline",
      "收入持续低迷，无法覆盖成本",
    );
    return;
  }

  // 主动退市判定：产品收入占比 < 1% 且连续30天负增长
  const totalRevenue = state.startup.company?.revenue || 1;
  if (
    product.revenue / totalRevenue < 0.01 &&
    product.userGrowthRate < -1 &&
    product.consecutiveDeclineDays >= 30
  ) {
    // 自动建议退市（不强制，只是标记）
    product._retirementRecommended = true;
  }
}

/** 执行产品退市 */
function _retireProductInternal(state, product, reason, reasonText) {
  product.retired = true;
  product.retireDay = state.player.day;
  product.retireReason = reasonText;

  const stageNames = {
    replaced_by_new: "被新产品替代",
    market_decline: "市场萎缩",
    strategic_pivot: "战略调整",
    failure: "产品失败",
  };

  StateManager.addMessage(
    `💀 「${product.name}」正式退市（${stageNames[reason] || reason}）`,
    "danger",
  );

  // 退市影响
  // 1. 员工流失概率增加
  const company = state.startup.company;
  if (company && company.employees.length > 0) {
    const fireChance = reason === "failure" ? 0.3 : 0.1;
    for (const emp of company.employees) {
      if (Random.chance(fireChance)) {
        StateManager.addMessage(
          `⚠️ 「${emp.name}」因「${product.name}」退市离职`,
          "warning",
        );
        fireEmployee(state, emp.id);
      }
    }
  }

  // 2. 公司声誉影响
  const repImpact = reason === "failure" ? -10 : -3;
  company.reputation = Math.max(0, company.reputation + repImpact);

  // 3. 技术/专利可被新产品继承（标记）
  product._inheritableTech = product.technologyScore * 0.3;
}

/** 计算产品市场份额 */
function _calculateMarketShare(state, product) {
  // 简化：基于产品竞争力评分占所有已发布产品的比例
  const company = state.startup.company;
  if (!company) return 0;

  let totalCompetitiveness = 0;
  for (const p of company.products) {
    if (p.status === "launched" && !p.retired) {
      totalCompetitiveness += p.competitiveness || 0;
    }
  }

  if (totalCompetitiveness <= 0) return 0;

  return Math.min(100, (product.competitiveness / totalCompetitiveness) * 100);
}

// ====== P1-9: 竞争对手策略应对辅助函数 ======

/** 更新竞争防御等级 */
function _updateCompetitorDefenseLevel(state, company) {
  let defense = 0;

  // 基础：有活跃攻击时防御等级提升
  if (
    company.activeCompetitorAttacks &&
    company.activeCompetitorAttacks.length > 0
  ) {
    defense += company.activeCompetitorAttacks.length * 10;
  }

  // 品牌防御预算加成
  defense += Math.min(30, company.brandDefenseBudget / 10000);

  // 人才留任基金加成
  defense += Math.min(20, company.talentRetentionFund / 5000);

  // 防御性专利加成
  if (company.techDefensePatents && company.techDefensePatents.length > 0) {
    defense += company.techDefensePatents.length * 5;
  }

  // 竞争情报等级加成
  defense += company.competitiveIntelligence * 0.2;

  // 市场份额趋势稳定加成
  if (company.marketShareTrend && company.marketShareTrend.length >= 7) {
    const recent = company.marketShareTrend.slice(-7);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const variance =
      recent.reduce((a, b) => a + Math.abs(b - avg), 0) / recent.length;
    if (variance < 2) defense += 10; // 市场份额稳定
  }

  company.competitorDefenseLevel = Math.max(0, Math.min(100, defense));
}

// ====== P1-10: 危机事件系统辅助函数 ======

/** 更新危机韧性等级 */
function _updateCrisisResilienceLevel(state, company) {
  let resilience = 0;

  // 无危机天数加成（连续无危机时间越长，韧性越高）
  resilience += Math.min(30, (company.crisisFreeDays || 0) / 10);

  // 危机准备度加成
  resilience += (company.crisisPreparationLevel || 0) * 0.4;

  // 危机保险等级加成
  resilience += (company.crisisInsuranceLevel || 0) * 10;

  // 危机应对团队加成
  if (company.crisisResponseTeam && company.crisisResponseTeam.length > 0) {
    resilience += Math.min(20, company.crisisResponseTeam.length * 5);
  }

  // 危机沟通计划加成
  if (company.crisisCommunicationPlan) {
    resilience += 10;
  }

  // 历史危机处理经验（处理过的危机越多，韧性越高）
  if (company.crisisEventHistory && company.crisisEventHistory.length > 0) {
    const successfulResponses = company.crisisEventHistory.filter(
      (c) => c.success,
    ).length;
    resilience += Math.min(20, successfulResponses * 2);
  }

  // 媒体关系加成（好的媒体关系有助于危机公关）
  resilience += Math.min(10, (company.mediaRelations || 0) * 0.1);

  // 法律保险加成
  if (company.legalInsurance) {
    resilience += 5;
  }

  company.crisisResilienceLevel = Math.max(0, Math.min(100, resilience));
}

// ====== P0-4: 员工满意度/倦怠系统 ======
/** 每日员工满意度/倦怠演化 */
function _tickEmployeeSatisfaction(state, emp, company, netCash, timeMult) {
  if (emp.burnoutLevel >= 3) return; // 重度倦怠员工不演化（已请假/离职中）
  // [全系统自洽修复] 域H A类修复: satisfactionDetails 守卫(旧存档/新员工可能缺失)
  if (!emp.satisfactionDetails) {
    emp.satisfactionDetails = { salary: 50, workload: 50, growth: 50, atmosphere: 50 };
  }
  if (typeof emp.stressLevel !== "number" || !isFinite(emp.stressLevel)) emp.stressLevel = 50;
  if (typeof emp.overtimeDays !== "number" || !isFinite(emp.overtimeDays)) emp.overtimeDays = 0;
  if (typeof emp.burnoutRisk !== "number" || !isFinite(emp.burnoutRisk)) emp.burnoutRisk = 0;
  if (typeof emp.burnoutLevel !== "number" || !isFinite(emp.burnoutLevel)) emp.burnoutLevel = 0;

  const day = state.player.day;
  const sat = emp.satisfactionDetails;
  const roleInfo = EMPLOYEE_ROLES[emp.role];

  // === 薪资满意度 ===
  // 薪资 vs 行业基准比较
  const roleBaseSalary = roleInfo ? roleInfo.baseSalary : 15000;
  const salaryRatio = emp.salary / roleBaseSalary;
  const targetSalarySat = Math.min(80, 30 + salaryRatio * 25);
  sat.salary = sat.salary + (targetSalarySat - sat.salary) * 0.02 * timeMult;

  // === 工作强度满意度 ===
  // 公司现金流差 → 加班多 → 工作强度满意度下降
  if (netCash < 0) {
    emp.overtimeDays++;
    sat.workload = Math.max(10, sat.workload - 0.3 * timeMult);
    emp.stressLevel = Math.min(100, emp.stressLevel + 0.5 * timeMult);
  } else {
    emp.overtimeDays = Math.max(0, emp.overtimeDays - 0.1 * timeMult);
    sat.workload = Math.min(90, sat.workload + 0.1 * timeMult);
    emp.stressLevel = Math.max(20, emp.stressLevel - 0.2 * timeMult);
  }

  // === 成长空间满意度 ===
  // 公司技术/市场分数增长 → 成长空间提升
  const companyGrowth = (company.technologyScore + company.marketScore) / 200;
  const targetGrowthSat = 30 + companyGrowth * 40;
  sat.growth = sat.growth + (targetGrowthSat - sat.growth) * 0.01 * timeMult;

  // === 团队氛围满意度 ===
  // 员工总数多 → 氛围复杂 → 满意度略降
  const teamSizeFactor = Math.max(0, 1 - company.employees.length * 0.01);
  const targetAtmosphere = 40 + teamSizeFactor * 40;
  sat.atmosphere =
    sat.atmosphere + (targetAtmosphere - sat.atmosphere) * 0.015 * timeMult;

  // === 综合满意度 ===
  emp.satisfaction = Math.round(
    sat.salary * 0.35 +
      sat.workload * 0.25 +
      sat.growth * 0.25 +
      sat.atmosphere * 0.15,
  );

  // === 倦怠风险计算 ===
  // 连续加班、低满意度、高压力 → 倦怠风险增加
  let burnoutFactor = 0;
  burnoutFactor += emp.overtimeDays * 2; // 连续加班
  burnoutFactor += (100 - emp.satisfaction) * 0.3; // 低满意度
  burnoutFactor += emp.stressLevel * 0.4; // 高压力
  burnoutFactor += (100 - sat.workload) * 0.3; // 工作强度不满

  emp.burnoutRisk = Math.min(100, burnoutFactor);

  // === 倦怠等级判定 ===
  const oldBurnout = emp.burnoutLevel;
  if (emp.burnoutRisk >= 80) {
    emp.burnoutLevel = 3; // 重度倦怠
  } else if (emp.burnoutRisk >= 60) {
    emp.burnoutLevel = 2; // 中度倦怠
  } else if (emp.burnoutRisk >= 40) {
    emp.burnoutLevel = 1; // 轻度倦怠
  } else {
    emp.burnoutLevel = 0; // 正常
  }

  // === 健康值衰减 ===
  if (emp.burnoutLevel >= 2) {
    emp.health = Math.max(20, emp.health - 0.3 * timeMult);
  } else if (emp.burnoutLevel === 1) {
    emp.health = Math.max(30, emp.health - 0.1 * timeMult);
  } else {
    emp.health = Math.min(100, emp.health + 0.05 * timeMult);
  }

  // === 倦怠爆发判定 ===
  if (emp.burnoutLevel >= 2 && !emp._burnoutTriggered) {
    _triggerBurnout(state, emp, company);
  }

  // === 记录历史（每周）===
  if (day % 7 === 0 || timeMult >= 90) {
    emp._satisfactionHistory.push({
      day: day,
      satisfaction: emp.satisfaction,
      salary: sat.salary,
      workload: sat.workload,
      growth: sat.growth,
      atmosphere: sat.atmosphere,
      burnoutRisk: emp.burnoutRisk,
      burnoutLevel: emp.burnoutLevel,
    });
    if (emp._satisfactionHistory.length > 52) emp._satisfactionHistory.shift();
  }

  // === 倦怠恢复（如果情况好转）===
  if (emp.burnoutRisk < 30 && emp.burnoutLevel > 0) {
    emp.burnoutLevel = 0;
    emp._burnoutTriggered = false;
  }
}

/** 触发员工倦怠 */
function _triggerBurnout(state, emp, company) {
  emp._burnoutTriggered = true;

  const burnoutTypes = {
    1: { name: "轻度倦怠", impact: "工作效率下降", productivityLoss: 0.1 },
    2: {
      name: "中度倦怠",
      impact: "频繁请假，效率大降",
      productivityLoss: 0.3,
    },
    3: {
      name: "重度倦怠",
      impact: "可能离职或健康受损",
      productivityLoss: 0.5,
    },
  };

  const burnout = burnoutTypes[emp.burnoutLevel];
  emp.productivity = Math.max(
    0.3,
    emp.productivity * (1 - burnout.productivityLoss),
  );

  StateManager.addMessage(
    `😟 「${emp.name}」${burnout.name}！${burnout.impact}（倦怠风险${emp.burnoutRisk.toFixed(0)}）`,
    emp.burnoutLevel >= 2 ? "danger" : "warning",
  );

  emp._burnoutHistory.push({
    day: state.player.day,
    level: emp.burnoutLevel,
    type: burnout.name,
    impact: burnout.impact,
  });

  // 重度倦怠可能离职
  if (emp.burnoutLevel >= 3 && Random.chance(0.3)) {
    StateManager.addMessage(`💔 「${emp.name}」因重度倦怠离职！`, "danger");
    fireEmployee(state, emp.id);
  }
}

/** 提升员工满意度（团建/调薪/培训等） */
function improveEmployeeSatisfaction(state, action, params) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const actions = {
    team_building: {
      name: "团队建设",
      cost: 5000,
      effect: { satisfaction: 8, workload: 5, atmosphere: 10 },
      desc: "组织团建活动，缓解工作压力",
    },
    salary_adjustment: {
      name: "薪资调整",
      cost: 15000,
      effect: { salary: 15, satisfaction: 10 },
      desc: "为全员调薪，提升薪资满意度",
    },
    training: {
      name: "技能培训",
      cost: 8000,
      effect: { growth: 12, satisfaction: 5 },
      desc: "安排培训课程，增加成长空间",
    },
    flexible_work: {
      name: "弹性工作",
      cost: 3000,
      effect: { workload: 10, atmosphere: 5, satisfaction: 5 },
      desc: "推行弹性工作制，减少加班",
    },
    health_check: {
      name: "健康检查",
      cost: 6000,
      effect: { health: 10, workload: 3, satisfaction: 3 },
      desc: "安排体检，关注员工健康",
    },
    oneOnOne: {
      name: "一对一沟通",
      cost: 2000,
      effect: { atmosphere: 8, growth: 5, satisfaction: 5 },
      desc: "管理者与员工一对一沟通，了解需求",
    },
  };

  const act = actions[action];
  if (!act) return { success: false, message: "无效的操作" };
  if (!company.employees || company.employees.length === 0) {
    return { success: false, message: "团队还没有成员，无法开展团队活动" };
  }

  if (company.cashReserve < act.cost) {
    return {
      success: false,
      message: `现金不足，需要¥${act.cost.toLocaleString()}`,
    };
  }

  company.cashReserve -= act.cost;
  company.expenses += act.cost;

  // 应用效果到所有员工
  let totalSatisfactionGain = 0;
  for (const emp of company.employees) {
    if (act.effect.salary)
      emp.satisfactionDetails.salary = Math.min(
        100,
        emp.satisfactionDetails.salary + act.effect.salary,
      );
    if (act.effect.workload)
      emp.satisfactionDetails.workload = Math.min(
        100,
        emp.satisfactionDetails.workload + act.effect.workload,
      );
    if (act.effect.growth)
      emp.satisfactionDetails.growth = Math.min(
        100,
        emp.satisfactionDetails.growth + act.effect.growth,
      );
    if (act.effect.atmosphere)
      emp.satisfactionDetails.atmosphere = Math.min(
        100,
        emp.satisfactionDetails.atmosphere + act.effect.atmosphere,
      );
    if (act.effect.satisfaction)
      emp.satisfaction = Math.min(
        100,
        emp.satisfaction + act.effect.satisfaction,
      );
    if (act.effect.health)
      emp.health = Math.min(100, emp.health + act.effect.health);

    // 倦怠风险降低
    emp.burnoutRisk = Math.max(0, emp.burnoutRisk - 5);
    totalSatisfactionGain += emp.satisfaction;
  }

  const avgSatisfaction = (
    totalSatisfactionGain / company.employees.length
  ).toFixed(0);

  StateManager.addMessage(
    `✅ ${act.name}完成！全员满意度提升至平均${avgSatisfaction}分，${act.desc}`,
    "success",
  );

  return { success: true, action: action, avgSatisfaction: avgSatisfaction };
}

/** 获取员工满意度详情 */
function getEmployeeSatisfactionSummary(company) {
  if (!company || company.employees.length === 0) return null;

  let totalSat = 0,
    totalBurnout = 0,
    totalHealth = 0;
  let burnoutCount = { 0: 0, 1: 0, 2: 0, 3: 0 };

  for (const emp of company.employees) {
    totalSat += emp.satisfaction || 50;
    totalBurnout += emp.burnoutRisk || 0;
    totalHealth += emp.health || 80;
    burnoutCount[emp.burnoutLevel] = (burnoutCount[emp.burnoutLevel] || 0) + 1;
  }

  const n = company.employees.length;
  return {
    avgSatisfaction: Math.round(totalSat / n),
    avgBurnoutRisk: Math.round(totalBurnout / n),
    avgHealth: Math.round(totalHealth / n),
    burnoutDistribution: burnoutCount,
    totalEmployees: n,
    atRiskCount: burnoutCount[2] + burnoutCount[3], // 中重度倦怠人数
  };
}

// ====== P0-5: KPI/OKR 目标系统 ======
/** 设定季度 OKR */
function setQuarterlyOkr(state, objective, keyResults) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const year = state.player.corpYear || 1;
  const quarter = state.player.corpQuarter || 1;

  // 检查是否已有当前季度 OKR
  const existing = company.okrs.find(
    (o) => o.year === year && o.quarter === quarter,
  );
  if (existing) {
    return {
      success: false,
      message: "本季度已设定 OKR，请先完成或放弃当前 OKR",
    };
  }

  // 生成 OKR ID
  const okrId = "okr_" + year + "q" + quarter + "_" + Random.int(100000, 999999);

  // 处理关键结果
  const processedKR = [];
  for (const kr of keyResults || []) {
    processedKR.push({
      id: kr.id || "kr_" + processedKR.length,
      description: kr.description,
      target: kr.target, // 目标值
      unit: kr.unit || "", // 单位
      current: 0, // 当前值
      weight: kr.weight || 1, // 权重
      progress: 0, // 进度 0-100
    });
  }

  const okr = {
    id: okrId,
    year: year,
    quarter: quarter,
    objective: objective,
    keyResults: processedKR,
    status: "active", // active / completed / abandoned
    progress: 0,
    createdDay: state.player.day,
    completedDay: null,
    score: 0, // 最终评分
  };

  company.okrs.push(okr);
  company.currentQuarterOkr = okrId;

  StateManager.addMessage(
    `🎯 设定 Q${quarter} 目标：「${objective}」\n关键结果：${processedKR.map((k) => k.description + " → " + k.target + k.unit).join(" | ")}`,
    "success",
  );

  return { success: true, okr: okr };
}

/** 更新 OKR 进度（每日/每周调用） */
function updateOkrProgress(state, okrId, updates) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const okr = company.okrs.find((o) => o.id === okrId);
  if (!okr || okr.status !== "active") {
    return { success: false, message: "OKR 不存在或未激活" };
  }

  let updated = false;

  // 更新关键结果
  for (const kr of okr.keyResults) {
    if (updates[kr.id]) {
      kr.current = Math.max(0, updates[kr.id]);
      // 计算进度
      const progress = Math.min(100, (kr.current / kr.target) * 100);
      kr.progress = Math.round(progress);
      updated = true;
    }
  }

  // 计算整体进度
  if (okr.keyResults.length > 0) {
    const totalWeight = okr.keyResults.reduce((sum, kr) => sum + kr.weight, 0);
    const weightedProgress = okr.keyResults.reduce(
      (sum, kr) => sum + kr.progress * kr.weight,
      0,
    );
    okr.progress = Math.round(weightedProgress / totalWeight);
  }

  // 进度里程碑通知
  if (updated && okr.progress >= 25 && okr.progress < 50) {
    StateManager.addMessage(
      `📊 「${okr.objective}」进度 25%，稳步推进`,
      "info",
    );
  } else if (updated && okr.progress >= 50 && okr.progress < 75) {
    StateManager.addMessage(
      `📈 「${okr.objective}」进度 50%，进展良好`,
      "info",
    );
  } else if (updated && okr.progress >= 75) {
    StateManager.addMessage(
      `🚀 「${okr.objective}」进度 75%，接近完成！`,
      "success",
    );
  }

  return { success: true, okr: okr };
}

/** 季末评估 OKR 完成度 */
function evaluateQuarterlyOkr(state) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const year = state.player.corpYear || 1;
  const quarter = state.player.corpQuarter || 1;

  // 找到当前季度 OKR
  const okr = company.okrs.find(
    (o) => o.year === year && o.quarter === quarter && o.status === "active",
  );
  if (!okr) {
    StateManager.addMessage("⚠️ 本季度未设定 OKR，跳过评估", "warning");
    return { success: false, message: "本季度未设定 OKR" };
  }

  // 计算完成度评分
  let totalScore = 0;
  let totalWeight = 0;
  for (const kr of okr.keyResults) {
    const score = kr.progress / 100; // 0-1
    totalScore += score * kr.weight;
    totalWeight += kr.weight;
  }

  const completionRate = totalWeight > 0 ? totalScore / totalWeight : 0;
  okr.score = Math.round(completionRate * 100);
  okr.status = "completed";
  okr.completedDay = state.player.day;

  // 记录历史
  company.kpiHistory.push({
    quarter: quarter,
    year: year,
    kpi: okr.objective,
    score: okr.score,
    completionRate: completionRate,
    keyResults: okr.keyResults.map((k) => ({
      description: k.description,
      target: k.target,
      current: k.current,
      progress: k.progress,
    })),
  });

  // 更新历史完成率
  const completedOkr = company.kpiHistory.filter((k) => k.score !== undefined);
  if (completedOkr.length > 0) {
    company.okrCompletionRate = Math.round(
      completedOkr.reduce((sum, k) => sum + k.score, 0) / completedOkr.length,
    );
  }

  // 发放季度奖金
  let bonus = 0;
  if (okr.score >= 80) {
    bonus = 10000 * (okr.score / 100);
    company.employees.forEach((emp) => {
      emp.satisfaction = Math.min(100, emp.satisfaction + 5);
      if (emp.satisfactionDetails)
        emp.satisfactionDetails.growth = Math.min(
          100,
          emp.satisfactionDetails.growth + 3,
        );
    });
    StateManager.addMessage(
      `🎉 Q${quarter} OKR 完成度 ${okr.score}%！优秀！全员满意度+5，奖金池+¥${bonus.toLocaleString()}`,
      "success",
    );
  } else if (okr.score >= 60) {
    bonus = 5000 * (okr.score / 100);
    StateManager.addMessage(
      `✅ Q${quarter} OKR 完成度 ${okr.score}%，达标。奖金池+¥${bonus.toLocaleString()}`,
      "info",
    );
  } else if (okr.score >= 40) {
    bonus = 2000 * (okr.score / 100);
    StateManager.addMessage(
      `⚠️ Q${quarter} OKR 完成度 ${okr.score}%，未达标。奖金池+¥${bonus.toLocaleString()}`,
      "warning",
    );
  } else {
    StateManager.addMessage(
      `💀 Q${quarter} OKR 完成度 ${okr.score}%，严重未达标。团队士气受挫。`,
      "danger",
    );
    company.employees.forEach((emp) => {
      emp.satisfaction = Math.max(0, emp.satisfaction - 5);
      if (emp.satisfactionDetails)
        emp.satisfactionDetails.growth = Math.max(
          0,
          emp.satisfactionDetails.growth - 3,
        );
    });
  }

  company.quarterlyBonusPool += bonus;

  // 清除当前 OKR
  company.currentQuarterOkr = null;

  return { success: true, okr: okr, bonus: bonus, score: okr.score };
}

/** 设定团队目标 */
function setTeamGoal(state, team, target, deadlineDays) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const teams = {
    engineering: { name: "技术团队", roles: ["engineer"] },
    product: { name: "产品团队", roles: ["designer", "product_manager"] },
    sales: { name: "销售团队", roles: ["sales"] },
    marketing: { name: "市场团队", roles: ["marketing"] },
    operations: { name: "运营团队", roles: ["operations"] },
    finance: { name: "财务团队", roles: ["finance"] },
  };

  const teamInfo = teams[team];
  if (!teamInfo) {
    return { success: false, message: "无效的团队" };
  }

  const goalId = "tg_" + Random.int(100000, 999999);
  const goal = {
    id: goalId,
    team: team,
    teamName: teamInfo.name,
    target: target,
    progress: 0,
    current: 0,
    deadline: state.player.day + (deadlineDays || 30),
    status: "active",
  };

  company.teamGoals.push(goal);

  StateManager.addMessage(
    `👥 「${teamInfo.name}」目标设定：${target}（期限：${deadlineDays || 30}天）`,
    "info",
  );

  return { success: true, goal: goal };
}

/** 更新团队目标进度 */
function updateTeamGoalProgress(state, goalId, progress) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const goal = company.teamGoals.find((g) => g.id === goalId);
  if (!goal || goal.status !== "active") {
    return { success: false, message: "目标不存在或未激活" };
  }

  goal.progress = Math.max(0, Math.min(100, progress));
  goal.current = Math.round((goal.target * progress) / 100);

  // 检查是否到期
  if (state.player.day >= goal.deadline) {
    goal.status = "completed";
    if (goal.progress >= 80) {
      StateManager.addMessage(
        `✅ 「${goal.teamName}」目标达成！进度${goal.progress}%`,
        "success",
      );
    } else {
      StateManager.addMessage(
        `⚠️ 「${goal.teamName}」目标未达成。进度${goal.progress}%`,
        "warning",
      );
    }
  }

  return { success: true, goal: goal };
}

/** 设定员工个人目标 */
function setEmployeeGoal(state, employeeId, goalDescription, target) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const emp = company.employees.find((e) => e.id === employeeId);
  if (!emp) return { success: false, message: "员工不存在" };

  const goalId = "eg_" + Random.int(100000, 999999);
  const goal = {
    id: goalId,
    employeeId: employeeId,
    employeeName: emp.name,
    goal: goalDescription,
    target: target,
    progress: 0,
    current: 0,
    status: "active",
  };

  company.employeeGoals.push(goal);

  StateManager.addMessage(
    `👤 「${emp.name}」个人目标：${goalDescription}（目标：${target}）`,
    "info",
  );

  return { success: true, goal: goal };
}

/** 更新员工目标进度 */
function updateEmployeeGoalProgress(state, goalId, progress) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const goal = company.employeeGoals.find((g) => g.id === goalId);
  if (!goal || goal.status !== "active") {
    return { success: false, message: "目标不存在或未激活" };
  }

  goal.progress = Math.max(0, Math.min(100, progress));
  goal.current = Math.round((goal.target * progress) / 100);

  // 目标达成奖励
  if (goal.progress >= 100) {
    const emp = company.employees.find((e) => e.id === goal.employeeId);
    if (emp) {
      emp.loyalty = Math.min(100, emp.loyalty + 5);
      emp.satisfaction = Math.min(100, emp.satisfaction + 3);
      StateManager.addMessage(
        `🎉 「${goal.employeeName}」个人目标达成！忠诚度+5`,
        "success",
      );
    }
    goal.status = "completed";
  }

  return { success: true, goal: goal };
}

/** 获取 OKR/KPI 汇总 */
function getKpiSummary(company) {
  if (!company) return null;

  const activeOkr = company.okrs.find((o) => o.status === "active");
  const completedOkr = company.kpiHistory;

  return {
    currentOkr: activeOkr
      ? {
          objective: activeOkr.objective,
          progress: activeOkr.progress,
          keyResults: activeOkr.keyResults.map((k) => ({
            description: k.description,
            progress: k.progress,
            target: k.target,
            current: k.current,
          })),
        }
      : null,
    history: completedOkr.map((k) => ({
      quarter: "Q" + k.quarter + "/" + k.year,
      kpi: k.kpi,
      score: k.score,
      completionRate: Math.round(k.completionRate * 100) + "%",
    })),
    avgCompletion: company.okrCompletionRate,
    bonusPool: company.quarterlyBonusPool || 0,
    teamGoalsActive: company.teamGoals.filter((g) => g.status === "active")
      .length,
    employeeGoalsActive: company.employeeGoals.filter(
      (g) => g.status === "active",
    ).length,
  };
}

/** 显示 OKR/KPI 面板弹窗 */
function showKpiDashboard(state) {
  const company = state.startup.company;
  if (!company) return;

  const summary = getKpiSummary(company);

  let html = '<div style="font-size:12px;max-height:65vh;overflow-y:auto;">';

  // 当前 OKR
  if (summary && summary.currentOkr) {
    html +=
      '<div style="margin-bottom:16px;">' +
      '<div style="font-weight:bold;margin-bottom:8px;font-size:13px;">🎯 当前季度 OKR</div>' +
      '<div style="padding:10px;background:var(--bg-secondary);border-radius:6px;">' +
      '<div style="font-size:12px;font-weight:bold;margin-bottom:6px;">' +
      summary.currentOkr.objective +
      "</div>" +
      '<div style="height:8px;background:rgba(255,255,255,0.1);border-radius:4px;margin-bottom:6px;">' +
      '<div style="height:100%;width:' +
      summary.currentOkr.progress +
      '%;background:var(--success);border-radius:4px;"></div>' +
      "</div>" +
      '<div style="font-size:10px;color:var(--text-muted);">整体进度：' +
      summary.currentOkr.progress +
      "%</div>" +
      '<div style="margin-top:6px;font-size:10px;">';
    for (const kr of summary.currentOkr.keyResults) {
      const krColor =
        kr.progress >= 80
          ? "var(--success)"
          : kr.progress >= 50
            ? "var(--warning)"
            : "var(--danger)";
      html +=
        '<div style="margin-bottom:4px;">' +
        '<div style="display:flex;justify-content:space-between;font-size:10px;">' +
        "<span>" +
        kr.description +
        "</span>" +
        '<span style="color:' +
        krColor +
        ';">' +
        kr.progress +
        "%</span>" +
        "</div>" +
        '<div style="height:4px;background:rgba(255,255,255,0.1);border-radius:2px;">' +
        '<div style="height:100%;width:' +
        kr.progress +
        "%;background:" +
        krColor +
        ';border-radius:2px;"></div>' +
        "</div>" +
        "</div>";
    }
    html += "</div></div></div>";
  } else {
    html +=
      '<div style="margin-bottom:16px;padding:16px;text-align:center;color:var(--text-muted);border:2px dashed var(--border);border-radius:8px;">' +
      "📋 本季度未设定 OKR<br>" +
      '<button class="btn btn-sm btn-primary" onclick="showSetOkrModal()" style="margin-top:8px;">设定季度 OKR</button>' +
      "</div>";
  }

  // 历史 KPI
  if (summary && summary.history && summary.history.length > 0) {
    html +=
      '<div style="margin-bottom:16px;">' +
      '<div style="font-weight:bold;margin-bottom:8px;font-size:13px;">📊 KPI 历史</div>' +
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">';
    for (const h of summary.history) {
      const scoreColor =
        h.score >= 80
          ? "var(--success)"
          : h.score >= 60
            ? "var(--warning)"
            : "var(--danger)";
      html +=
        '<div style="padding:8px;background:var(--bg-secondary);border-radius:6px;text-align:center;">' +
        '<div style="font-size:10px;color:var(--text-muted);">' +
        h.quarter +
        "</div>" +
        '<div style="font-size:11px;margin:2px 0;">' +
        h.kpi.substring(0, 15) +
        (h.kpi.length > 15 ? "..." : "") +
        "</div>" +
        '<div style="font-size:14px;font-weight:bold;color:' +
        scoreColor +
        ';">' +
        h.score +
        "%</div>" +
        "</div>";
    }
    html += "</div></div>";
  }

  // 汇总统计
  if (summary) {
    html +=
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:16px;">' +
      '<div style="padding:8px;background:var(--bg-secondary);border-radius:6px;text-align:center;">' +
      '<div style="font-size:10px;color:var(--text-muted);">平均完成率</div>' +
      '<div style="font-size:16px;font-weight:bold;color:var(--success);">' +
      summary.avgCompletion +
      "%</div>" +
      "</div>" +
      '<div style="padding:8px;background:var(--bg-secondary);border-radius:6px;text-align:center;">' +
      '<div style="font-size:10px;color:var(--text-muted);">奖金池</div>' +
      '<div style="font-size:16px;font-weight:bold;color:var(--success);">¥' +
      (summary.bonusPool || 0).toLocaleString() +
      "</div>" +
      "</div>" +
      '<div style="padding:8px;background:var(--bg-secondary);border-radius:6px;text-align:center;">' +
      '<div style="font-size:10px;color:var(--text-muted);">活跃目标</div>' +
      '<div style="font-size:16px;font-weight:bold;">' +
      summary.teamGoalsActive +
      "/" +
      summary.employeeGoalsActive +
      "</div>" +
      "</div>" +
      "</div>";
  }

  // 操作按钮
  html +=
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">' +
    '<button class="btn btn-sm btn-primary" onclick="showSetOkrModal()" style="font-size:11px;">🎯 设定 OKR</button>' +
    '<button class="btn btn-sm btn-warning" onclick="showTeamGoalModal()" style="font-size:11px;">👥 团队目标</button>' +
    "</div>" +
    "</div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "📊 KPI/OKR 目标管理",
    body: html,
    buttons: [{ text: "关闭", cls: "", callback: function () {} }],
  });
}

/** 全局 key result 输入框添加函数（供 inline onclick 调用）— 修复幽灵按钮：原定义在 innerHTML <script> 中永不执行 */
function addKrInput() {
  const container = document.getElementById("okrKeyResults");
  if (!container) return;
  var state =
    typeof StateManager !== "undefined" ? StateManager.getState() : null;
  container.insertAdjacentHTML("beforeend", _renderKrInput(""));
}

/** 显示设定 OKR 弹窗 */
function showSetOkrModal() {
  const state = StateManager.getState();
  const company = state.startup.company;
  if (!company) return;

  const html =
    '<div style="font-size:13px;">' +
    '<div style="margin-bottom:12px;">' +
    '<label style="display:block;margin-bottom:4px;font-weight:bold;">🎯 季度目标（Objective）</label>' +
    '<input type="text" id="okrObjective" placeholder="例如：打造行业领先的用户体验" style="width:100%;padding:8px;border-radius:4px;border:1px solid var(--border);">' +
    "</div>" +
    '<div style="margin-bottom:12px;">' +
    '<div style="font-weight:bold;margin-bottom:6px;">📋 关键结果（Key Results，至少 2 个）</div>' +
    '<div id="okrKeyResults">' +
    _renderKrInput("") +
    _renderKrInput("") +
    "</div>" +
    '<button class="btn btn-sm btn-secondary" onclick="addKrInput()" style="margin-top:6px;font-size:11px;">+ 添加关键结果</button>' +
    "</div>" +
    "</div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "🎯 设定季度 OKR",
    body: html,
    buttons: [
      { text: "取消", cls: "", callback: function () {} },
      {
        text: "设定 OKR",
        cls: "btn-primary",
        callback: function () {
          const objective = document
            .getElementById("okrObjective")
            .value.trim();
          if (!objective) {
            StateManager.addMessage("请输入季度目标", "warning");
            return;
          }

          // 收集关键结果
          const krInputs = document.querySelectorAll("#okrKeyResults > div");
          const keyResults = [];
          for (const input of krInputs) {
            const desc = input.querySelector(".kr-desc").value.trim();
            const target = parseFloat(input.querySelector(".kr-target").value);
            const unit = input.querySelector(".kr-unit").value.trim();
            if (desc && !isNaN(target)) {
              keyResults.push({
                description: desc,
                target: target,
                unit: unit,
                weight: 1,
              });
            }
          }

          if (keyResults.length < 2) {
            StateManager.addMessage("请至少填写 2 个关键结果", "warning");
            return;
          }

          const result = setQuarterlyOkr(state, objective, keyResults);
          if (result.success) {
            StateManager.addMessage("✅ OKR 设定成功", "success");
            renderAll();
          } else {
            StateManager.addMessage("⚠️ " + result.message, "warning");
          }
        },
      },
    ],
  });
}

/** 渲染关键结果输入框 */
function _renderKrInput(value) {
  return (
    '<div style="display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:4px;margin-bottom:4px;align-items:end;">' +
    '<div><label style="font-size:10px;color:var(--text-muted);">描述</label>' +
    '<input type="text" class="kr-desc" placeholder="例如：日活用户数" style="width:100%;padding:4px;font-size:11px;border-radius:4px;border:1px solid var(--border);"></div>' +
    '<div><label style="font-size:10px;color:var(--text-muted);">目标值</label>' +
    '<input type="number" class="kr-target" placeholder="10000" style="width:100%;padding:4px;font-size:11px;border-radius:4px;border:1px solid var(--border);"></div>' +
    '<div><label style="font-size:10px;color:var(--text-muted);">单位</label>' +
    '<input type="text" class="kr-unit" placeholder="人" style="width:100%;padding:4px;font-size:11px;border-radius:4px;border:1px solid var(--border);"></div>' +
    '<div style="padding-bottom:4px;">' +
    '<button class="btn btn-sm btn-danger" onclick="this.parentElement.parentElement.remove()" style="font-size:10px;padding:4px 8px;">✕</button>' +
    "</div>" +
    "</div>"
  );
}

/** 显示团队目标弹窗 */
function showTeamGoalModal() {
  const state = StateManager.getState();
  const company = state.startup.company;
  if (!company) return;

  const teams = [
    { key: "engineering", name: "技术团队" },
    { key: "product", name: "产品团队" },
    { key: "sales", name: "销售团队" },
    { key: "marketing", name: "市场团队" },
    { key: "operations", name: "运营团队" },
    { key: "finance", name: "财务团队" },
  ];

  let html =
    '<div style="font-size:13px;">' +
    '<div style="margin-bottom:12px;">' +
    '<label style="display:block;margin-bottom:4px;font-weight:bold;">选择团队</label>' +
    '<select id="goalTeam" style="width:100%;padding:8px;border-radius:4px;border:1px solid var(--border);">' +
    teams
      .map((t) => '<option value="' + t.key + '">' + t.name + "</option>")
      .join("") +
    "</select>" +
    "</div>" +
    '<div style="margin-bottom:12px;">' +
    '<label style="display:block;margin-bottom:4px;font-weight:bold;">目标描述</label>' +
    '<input type="text" id="goalTarget" placeholder="例如：完成用户系统重构" style="width:100%;padding:8px;border-radius:4px;border:1px solid var(--border);">' +
    "</div>" +
    '<div style="margin-bottom:12px;">' +
    '<label style="display:block;margin-bottom:4px;font-weight:bold;">期限（天）</label>' +
    '<input type="number" id="goalDeadline" value="30" min="7" max="90" style="width:100%;padding:8px;border-radius:4px;border:1px solid var(--border);">' +
    "</div>" +
    "</div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "👥 设定团队目标",
    body: html,
    buttons: [
      { text: "取消", cls: "", callback: function () {} },
      {
        text: "设定目标",
        cls: "btn-warning",
        callback: function () {
          const team = document.getElementById("goalTeam").value;
          const target = document.getElementById("goalTarget").value.trim();
          const deadline = parseInt(
            document.getElementById("goalDeadline").value,
          );

          if (!target) {
            StateManager.addMessage("请输入目标描述", "warning");
            return;
          }

          const result = setTeamGoal(state, team, target, deadline);
          if (result.success) {
            StateManager.addMessage("✅ 团队目标设定成功", "success");
            renderAll();
          } else {
            StateManager.addMessage("⚠️ " + result.message, "warning");
          }
        },
      },
    ],
  });
}

// ====== P0-3: 技术债务系统 ======
/** 每日技术债演化 */
function _tickTechnicalDebt(state, product, timeMult) {
  if (product.retired) return;

  const debt = product.technicalDebt || 0;
  const day = state.player.day;

  // === 技术债自然积累 ===
  // 基础积累：随着产品复杂度增加，技术债自然增长
  const complexityFactor =
    1 +
    (product.features.length || 0) * 0.05 +
    (product.versionIterationCount || 0) * 0.02;
  const naturalAccumulation = 0.02 * complexityFactor * timeMult;

  product.technicalDebt = Math.min(100, debt + naturalAccumulation);

  // === Bug 率计算 ===
  // bug 率与技术债正相关，评分负相关
  const baseBugRate = 0.5; // 基础 bug 率（每千用户每日）
  const debtBugMultiplier = 1 + debt / 20; // 技术债越高，bug 越多
  const ratingFactor = 1 - (product.rating || 3.5) / 10; // 评分越低，bug 越多
  product.bugRate =
    baseBugRate *
    debtBugMultiplier *
    (0.5 + ratingFactor) *
    Random.float(0.8, 1.2);

  // === 技术债危机判定 ===
  if (debt >= 80 && !product.techDebtCrisis) {
    _triggerTechDebtCrisis(state, product, "critical");
  } else if (
    debt >= 60 &&
    !product.techDebtCrisis &&
    Random.chance(0.01 * timeMult)
  ) {
    _triggerTechDebtCrisis(state, product, "moderate");
  }

  // === 重构加成衰减 ===
  if (product.refactorBonus > 0) {
    product.refactorBonus = Math.max(
      0,
      product.refactorBonus - 0.01 * timeMult,
    );
  }

  // === 记录历史（每周）===
  if (day % 7 === 0 || timeMult >= 90) {
    product.techDebtHistory.push({
      day: day,
      debt: product.technicalDebt,
      bugRate: product.bugRate,
      sources: { ...product.techDebtSources },
    });
    product.bugHistory.push({
      day: day,
      bugRate: product.bugRate,
      usersAffected: Math.round((product.users * product.bugRate) / 1000),
    });
    if (product.techDebtHistory.length > 52) product.techDebtHistory.shift();
    if (product.bugHistory.length > 52) product.bugHistory.shift();
  }
}

/** 触发技术债危机 */
function _triggerTechDebtCrisis(state, product, severity) {
  product.techDebtCrisis = true;

  const crisisTypes = {
    critical: {
      name: "严重技术故障",
      impact: "产品核心功能崩溃，大量用户流失",
      userLoss: 0.15, // 15% 用户流失
      reputationLoss: -15,
      revenueLoss: 0.3, // 30% 收入下降
      duration: 7, // 恢复天数
    },
    moderate: {
      name: "频繁故障",
      impact: "产品间歇性故障，用户体验下降",
      userLoss: 0.05,
      reputationLoss: -8,
      revenueLoss: 0.15,
      duration: 3,
    },
  };

  const crisis = crisisTypes[severity];
  const company = state.startup.company;

  StateManager.addMessage(
    `💥 「${product.name}」${crisis.name}！技术债爆表（${product.technicalDebt.toFixed(0)}）\n${crisis.impact}`,
    "danger",
  );

  // 记录危机历史
  product.crisisHistory.push({
    day: state.player.day,
    type: crisis.name,
    severity: severity,
    impact: crisis.impact,
  });

  // 立即影响
  const userLoss = Math.round(product.users * crisis.userLoss);
  product.users = Math.max(0, product.users - userLoss);
  company.reputation = Math.max(0, company.reputation + crisis.reputationLoss);

  // 设置恢复标记
  product._crisisRecoveryDays = crisis.duration;
  product._crisisRecoveryStarted = state.player.day;

  // 危机期间 bug 率暴增
  product.bugRate *= 3;
}

/** 重构代码（偿还技术债） */
function refactorProduct(state, productId, scope) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const product = company.products.find((p) => p.id === productId);
  if (!product || product.status !== "launched" || product.retired) {
    return { success: false, message: "产品不存在或未发布" };
  }

  const scopes = {
    minor: {
      name: "小范围重构",
      cost: 15000,
      debtReduction: [5, 10],
      time: 7,
      desc: "重构部分模块，修复明显代码异味",
    },
    major: {
      name: "全面重构",
      cost: 50000,
      debtReduction: [15, 30],
      time: 14,
      desc: "系统级重构，优化架构，补充测试",
    },
    emergency: {
      name: "紧急修复",
      cost: 30000,
      debtReduction: [3, 8],
      time: 3,
      desc: "快速修复关键 bug，稳定系统",
    },
  };

  const scopeConfig = scopes[scope];
  if (!scopeConfig) {
    return { success: false, message: "无效的重构范围" };
  }

  if (company.cashReserve < scopeConfig.cost) {
    return {
      success: false,
      message: `现金不足，需要¥${scopeConfig.cost.toLocaleString()}`,
    };
  }

  // 执行重构
  company.cashReserve -= scopeConfig.cost;
  company.expenses += scopeConfig.cost;

  const debtReduction = Random.int(
    scopeConfig.debtReduction[0],
    scopeConfig.debtReduction[1],
  );

  product.technicalDebt = Math.max(0, product.technicalDebt - debtReduction);
  product.lastRefactorDay = state.player.day;
  product.refactorBonus = 5; // 重构后短期效率提升

  // 清除危机状态
  if (product.techDebtCrisis) {
    product.techDebtCrisis = false;
    product.bugRate = product.bugRate / 3; // 恢复基准
  }

  // 清除部分技术债来源
  const sourceKeys = Object.keys(product.techDebtSources);
  for (const key of sourceKeys) {
    product.techDebtSources[key] = Math.max(
      0,
      product.techDebtSources[key] - debtReduction * 0.2,
    );
  }

  StateManager.addMessage(
    `🔧 「${product.name}」${scopeConfig.name}完成！技术债-${debtReduction}，当前${product.technicalDebt.toFixed(0)}`,
    "success",
  );

  return {
    success: true,
    debtReduction: debtReduction,
    newDebt: product.technicalDebt,
    cost: scopeConfig.cost,
  };
}

/** 记录技术债积累事件 */
function recordTechDebtEvent(state, productId, cause, amount) {
  const company = state.startup.company;
  if (!company) return;

  const product = company.products.find((p) => p.id === productId);
  if (!product) return;

  product.technicalDebt = Math.min(100, product.technicalDebt + amount);

  // 记录来源
  if (cause === "rush") {
    product.techDebtSources.rushDevelopment += amount;
  } else if (cause === "skip_test") {
    product.techDebtSources.skippedTests += amount;
  } else if (cause === "cut_feature") {
    product.techDebtSources.cutFeatures += amount;
  } else if (cause === "quick_fix") {
    product.techDebtSources.quickFixes += amount;
  }

  product.techDebtHistory.push({
    day: state.player.day,
    debt: product.technicalDebt,
    cause: cause,
    amount: amount,
  });

  // 技术债过高警告
  if (product.technicalDebt >= 70 && product.technicalDebt - amount < 70) {
    StateManager.addMessage(
      `⚠️ 「${product.name}」技术债达到${product.technicalDebt.toFixed(0)}，建议尽快重构！`,
      "warning",
    );
  }
}

// ====== P0-2: AARRR 用户增长漏斗演化 ======
/** 每日 AARRR 漏斗演化 */
function _tickAARRRFunnel(state, product, timeMult) {
  const users = product.users || 0;
  if (users <= 0) return;

  // === A: Acquisition (获客) ===
  // 自然增长 + 广告获客 + 病毒传播
  const organicGrowth = Math.round(users * 0.001 * timeMult); // 自然增长 0.1%/天
  const adGrowth = _calculateAdGrowth(state, product, timeMult);
  const viralGrowth = _calculateViralGrowth(product, timeMult);

  product.newUsersToday = organicGrowth + adGrowth + viralGrowth;

  // 计算获客成本
  if (product.adSpend > 0) {
    product.cac = adGrowth > 0 ? product.adSpend / adGrowth : 0;
  } else {
    product.cac = 0;
  }

  // === A: Activation (激活) ===
  // 激活率受产品评分、新手引导影响
  const newActivated = Math.round(
    product.newUsersToday * product.activationRate,
  );
  product.activatedUsers = newActivated;

  // 新手引导完成率影响激活率
  if (product.onboardingCompleteRate < 0.8 && Random.chance(0.05)) {
    product.onboardingCompleteRate = Math.min(
      0.95,
      product.onboardingCompleteRate + 0.02,
    );
    product.activationRate = Math.min(0.6, product.activationRate + 0.01);
  }

  // === R: Retention (留存) ===
  // 日活/周活/月活计算
  product.dau = Math.round(users * (0.3 + (product.rating / 5) * 0.3)); // 30%-60% 日活
  product.wau = Math.round(users * (0.5 + (product.rating / 5) * 0.3)); // 50%-80% 周活
  product.mau = Math.round(users * (0.7 + (product.rating / 5) * 0.25)); // 70%-90% 月活

  // 留存率演化：评分高→留存提升，评分低→留存下降
  const ratingFactor = product.rating / 5;
  const retentionChange = (ratingFactor - 0.5) * 0.002 * timeMult;

  product.retentionD1 = Math.max(
    0.1,
    Math.min(0.8, product.retentionD1 + retentionChange),
  );
  product.retentionD7 = Math.max(
    0.05,
    Math.min(0.6, product.retentionD7 + retentionChange * 0.7),
  );
  product.retentionD30 = Math.max(
    0.02,
    Math.min(0.4, product.retentionD30 + retentionChange * 0.4),
  );

  // 记录留存历史
  if (state.player.day % 7 === 0 || timeMult >= 90) {
    product.retentionHistory.push({
      day: state.player.day,
      d1: product.retentionD1,
      d7: product.retentionD7,
      d30: product.retentionD30,
      dau: product.dau,
      mau: product.mau,
    });
    // 限制历史记录长度
    if (product.retentionHistory.length > 52) {
      product.retentionHistory.shift();
    }
  }

  // === R: Revenue (变现) ===
  // 付费率演化
  const payRateChange = (product.rating - 3.5) * 0.001 * timeMult;
  product.payRate = Math.max(
    0.01,
    Math.min(0.3, product.payRate + payRateChange),
  );

  product.payingUsers = Math.round(users * product.payRate);

  // ARPU 计算（基于产品类别）
  const categoryInfo = PRODUCT_CATEGORIES[product.category];
  const baseArpu = categoryInfo?.baseArpu || 0.5; // 元/天/用户
  const arpuMultiplier =
    (product.rating / 3.5) * (1 + product.features.length * 0.05);
  product.arpu = baseArpu * arpuMultiplier;

  // ARPPU（每付费用户平均收入）
  if (product.payingUsers > 0) {
    product.arppu = (product.arpu * users) / product.payingUsers;
  }

  // LTV 计算：ARPU × 平均留存天数
  const avgLifetime = 1 / (1 - product.retentionD30); // 简化模型
  product.ltv = product.arpu * avgLifetime * 30; // 月度 LTV

  // === R: Referral (推荐) ===
  // 病毒系数 K = 分享率 × 推荐转化率 × 分享次数
  const shareRate =
    product.rating >= 4 ? 0.05 : product.rating >= 3.5 ? 0.02 : 0.01;
  product.referralRate = shareRate;
  product.kFactor = shareRate * product.referralConversion * 3; // 每个用户平均分享3次

  // 病毒传播
  const viralNewUsers = Math.round(
    ((users * product.kFactor) / product.viralCycleTime) * timeMult,
  );
  product.viralNewUsers = viralNewUsers;

  // === 漏斗数据记录 ===
  product.funnelData.impressions += product.newUsersToday * 10 * timeMult; // 曝光量 ≈ 新增×10
  product.funnelData.clicks += Math.round(product.funnelData.impressions * 0.1);
  product.funnelData.registrations += product.newUsersToday;
  product.funnelData.activated += newActivated;
  product.funnelData.retainedD7 += Math.round(users * product.retentionD7);
  product.funnelData.retainedD30 += Math.round(users * product.retentionD30);
  product.funnelData.paying += product.payingUsers;
  product.funnelData.referred += viralNewUsers;

  // 记录漏斗历史（每周）
  if (state.player.day % 7 === 0 || timeMult >= 90) {
    product.funnelHistory.push({
      day: state.player.day,
      funnel: { ...product.funnelData },
      cac: product.cac,
      ltv: product.ltv,
      kFactor: product.kFactor,
    });
    if (product.funnelHistory.length > 52) {
      product.funnelHistory.shift();
    }
  }

  // === LTV/CAC 比率检查 ===
  if (product.cac > 0 && product.ltv > 0) {
    const ltvcacRatio = product.ltv / product.cac;
    if (ltvcacRatio < 1 && timeMult >= 90) {
      StateManager.addMessage(
        `⚠️ 「${product.name}」LTV/CAC < 1（${ltvcacRatio.toFixed(1)}），获客成本超过用户价值！`,
        "warning",
      );
    } else if (ltvcacRatio > 3 && timeMult >= 90) {
      StateManager.addMessage(
        `📈 「${product.name}」LTV/CAC = ${ltvcacRatio.toFixed(1)}，获客效率优秀！`,
        "success",
      );
    }
  }

  // === 病毒爆发通知 ===
  if (product.kFactor > 1 && viralNewUsers > product.newUsersToday * 0.3) {
    StateManager.addMessage(
      `🚀 「${product.name}」病毒传播爆发！K因子=${product.kFactor.toFixed(2)}，今日推荐带来+${viralNewUsers}用户`,
      "success",
    );
  }
}

/** 计算广告获客 */
function _calculateAdGrowth(state, product, timeMult) {
  if (product.adSpend <= 0) return 0;

  // 广告效果：基于投入金额 + 产品竞争力
  const baseEfficiency = 50; // 每元广告费带来多少曝光
  const efficiencyMult = 0.8 + (product.competitiveness / 100) * 0.4;
  const clickRate = 0.05; // 5% 点击率
  const installRate = 0.2; // 20% 安装率

  const impressions = product.adSpend * baseEfficiency * efficiencyMult;
  const clicks = Math.round(impressions * clickRate);
  const installs = Math.round(clicks * installRate);

  return Math.max(0, (installs * timeMult) / 90); // 按天分摊
}

/** 计算病毒传播 */
function _calculateViralGrowth(product, timeMult) {
  if (product.kFactor <= 0) return 0;
  const users = product.users || 0;
  return Math.round(
    ((users * product.kFactor) / product.viralCycleTime) * timeMult,
  );
}

/** 更新产品变现参数（通过运营活动） */
function updateProductMonetization(state, productId, action, params) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const product = company.products.find((p) => p.id === productId);
  if (!product || product.status !== "launched" || product.retired) {
    return { success: false, message: "产品不存在或未发布" };
  }

  if (action === "improve_onboarding") {
    // 优化新手引导
    const cost = params.cost || 10000;
    if (company.cashReserve < cost) {
      return {
        success: false,
        message: `现金不足，需要¥${cost.toLocaleString()}`,
      };
    }

    product.onboardingCompleteRate = Math.min(
      0.95,
      product.onboardingCompleteRate + 0.1,
    );
    product.activationRate = Math.min(0.6, product.activationRate + 0.05);
    company.cashReserve -= cost;
    company.expenses += cost;

    StateManager.addMessage(
      `✅ 「${product.name}」优化新手引导！激活率提升至${(product.activationRate * 100).toFixed(0)}%`,
      "success",
    );
    return { success: true, activationRate: product.activationRate };
  }

  if (action === "increase_payrate") {
    // 提高付费转化
    const cost = params.cost || 20000;
    if (company.cashReserve < cost) {
      return {
        success: false,
        message: `现金不足，需要¥${cost.toLocaleString()}`,
      };
    }

    product.payRate = Math.min(0.25, product.payRate + 0.02);
    company.cashReserve -= cost;
    company.expenses += cost;

    StateManager.addMessage(
      `💰 「${product.name}」优化付费转化！付费率提升至${(product.payRate * 100).toFixed(1)}%`,
      "success",
    );
    return { success: true, payRate: product.payRate };
  }

  if (action === "improve_retention") {
    // 提升留存
    const cost = params.cost || 15000;
    if (company.cashReserve < cost) {
      return {
        success: false,
        message: `现金不足，需要¥${cost.toLocaleString()}`,
      };
    }

    product.retentionD1 = Math.min(0.85, product.retentionD1 + 0.02);
    product.retentionD7 = Math.min(0.65, product.retentionD7 + 0.02);
    product.retentionD30 = Math.min(0.45, product.retentionD30 + 0.02);
    company.cashReserve -= cost;
    company.expenses += cost;

    StateManager.addMessage(
      `📈 「${product.name}」提升留存体验！D1留存提升至${(product.retentionD1 * 100).toFixed(0)}%`,
      "success",
    );
    return { success: true, retentionD1: product.retentionD1 };
  }

  if (action === "boost_viral") {
    // 病毒传播优化
    const cost = params.cost || 25000;
    if (company.cashReserve < cost) {
      return {
        success: false,
        message: `现金不足，需要¥${cost.toLocaleString()}`,
      };
    }

    product.referralRate = Math.min(0.1, product.referralRate + 0.02);
    product.referralConversion = Math.min(
      0.2,
      product.referralConversion + 0.03,
    );
    product.kFactor = product.referralRate * product.referralConversion * 3;
    company.cashReserve -= cost;
    company.expenses += cost;

    StateManager.addMessage(
      `🚀 「${product.name}」优化病毒传播！K因子提升至${product.kFactor.toFixed(2)}`,
      "success",
    );
    return { success: true, kFactor: product.kFactor };
  }

  return { success: false, message: "无效的运营动作" };
}

/** 投放广告（获客） */
function runAdCampaign(state, productId, channel, budget) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const product = company.products.find((p) => p.id === productId);
  if (!product || product.status !== "launched" || product.retired) {
    return { success: false, message: "产品不存在或未发布" };
  }

  if (company.cashReserve < budget) {
    return {
      success: false,
      message: `现金不足，需要¥${budget.toLocaleString()}`,
    };
  }

  // 渠道效果差异
  const channelEfficiency = {
    social: { name: "社交媒体", multiplier: 1.2, cac: 15 },
    search: { name: "搜索广告", multiplier: 1.0, cac: 25 },
    video: { name: "视频平台", multiplier: 1.3, cac: 20 },
    influencer: { name: "KOL合作", multiplier: 1.5, cac: 35 },
    programmatic: { name: "程序化投放", multiplier: 0.9, cac: 12 },
  };

  const channelData = channelEfficiency[channel];
  if (!channelData) {
    return { success: false, message: "无效的广告渠道" };
  }

  company.cashReserve -= budget;
  product.adSpend = budget;

  // 计算获客
  const estimatedUsers = _calculateAdGrowth(state, product, 90);
  const actualGrowth = Math.round(estimatedUsers * Random.float(0.8, 1.2));

  StateManager.addMessage(
    `📢 「${product.name}」投放${channelData.name}广告¥${budget.toLocaleString()}，预计带来${actualGrowth}新用户（CAC≈¥${(budget / actualGrowth).toFixed(0)}）`,
    "info",
  );

  return {
    success: true,
    channel: channelData.name,
    budget: budget,
    estimatedUsers: actualGrowth,
    cac: budget / actualGrowth,
  };
}

// ====== 更新产品版本（版本迭代） ======
function updateProductVersion(state, productId, versionType, budget) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const product = company.products.find((p) => p.id === productId);
  if (!product || product.status !== "launched" || product.retired) {
    return { success: false, message: "产品不存在或未发布" };
  }

  // 版本类型配置
  const versionConfigs = {
    minor: {
      name: "小版本迭代",
      costRange: [5000, 20000],
      techBonus: [2, 5],
      marketBonus: [1, 3],
      desc: "v1.0 → v1.1，修复bug，小幅优化",
    },
    major: {
      name: "大版本更新",
      costRange: [50000, 200000],
      techBonus: [8, 15],
      marketBonus: [5, 10],
      desc: "v1.x → v2.0，新功能，体验升级",
    },
    revolutionary: {
      name: "革命性升级",
      costRange: [200000, 1000000],
      techBonus: [15, 30],
      marketBonus: [10, 20],
      desc: "v.x → v3.0+，重构核心，颠覆创新",
    },
  };

  const config = versionConfigs[versionType];
  if (!config) {
    return { success: false, message: "无效的版本类型" };
  }

  // 预算检查
  const minCost = config.costRange[0];
  const maxCost = config.costRange[1];
  if (budget < minCost) {
    return {
      success: false,
      message: `预算不足，${config.name}至少需要¥${minCost.toLocaleString()}`,
    };
  }

  const actualCost = Math.min(budget, maxCost);
  if (company.cashReserve < actualCost) {
    return {
      success: false,
      message: `现金不足，需要¥${actualCost.toLocaleString()}`,
    };
  }

  // 计算实际效果（基于预算投入比例）
  const投入比例 = actualCost / maxCost;
  const techGain = Math.round(
    (config.techBonus[0] +
      (config.techBonus[1] - config.techBonus[0]) * 投入比例) *
      Random.float(0.8, 1.2),
  );
  const marketGain = Math.round(
    (config.marketBonus[0] +
      (config.marketBonus[1] - config.marketBonus[0]) * 投入比例) *
      Random.float(0.8, 1.2),
  );

  // 应用效果
  product.technologyScore = Math.min(100, product.technologyScore + techGain);
  product.marketScore = Math.min(100, product.marketScore + marketGain);

  // 生成新版本号
  const versionParts = product.version.replace("v", "").split(".").map(Number);
  product.versionIterationCount++;

  let newVersion;
  if (versionType === "minor") {
    versionParts[1] = (versionParts[1] || 0) + 1;
    newVersion = `v${versionParts[0]}.${versionParts[1]}`;
  } else if (versionType === "major") {
    versionParts[0]++;
    versionParts[1] = 0;
    newVersion = `v${versionParts[0]}.${versionParts[1]}`;
  } else {
    // revolutionary: 跳到3.0或更高
    versionParts[0] = Math.max(3, versionParts[0] + 1);
    versionParts[1] = 0;
    newVersion = `v${versionParts[0]}.${versionParts[1]}+`;
  }

  // 记录版本历史
  product.versionHistory.push({
    version: newVersion,
    date: new Date().toISOString().split("T")[0],
    day: state.player.day,
    changes: config.desc,
    techScore: product.technologyScore,
    marketScore: product.marketScore,
    cost: actualCost,
    type: versionType,
  });

  // 扣费
  company.cashReserve -= actualCost;
  company.expenses += actualCost;

  // 更新当前版本
  product.version = newVersion;

  // 版本发布通知
  StateManager.addMessage(
    `🚀 「${product.name}」发布 ${config.name} → ${newVersion}！\n` +
      `投入¥${actualCost.toLocaleString()}，技术分+${techGain}，市场分+${marketGain}`,
    "success",
  );

  // 版本发布可能触发生命周期阶段回调（衰退期产品通过大版本更新可能回到成熟期）
  if (product.lifecycleStage === "decline" && versionType === "major") {
    // 大版本更新有30%概率让产品重获新生
    if (Random.chance(0.3)) {
      product.lifecycleStage = "maturity";
      product.consecutiveDeclineDays = 0;
      StateManager.addMessage(
        `✨ 「${product.name}」通过大版本更新重获新生！回到成熟期`,
        "success",
      );
    }
  }

  return {
    success: true,
    product: product,
    newVersion: newVersion,
    techGain: techGain,
    marketGain: marketGain,
    cost: actualCost,
  };
}

/** 手动退市产品 */
function retireProduct(state, productId, reason) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const product = company.products.find((p) => p.id === productId);
  if (!product || product.status !== "launched" || product.retired) {
    return { success: false, message: "产品不存在或已退市" };
  }

  const reasonKeys = [
    "replaced_by_new",
    "market_decline",
    "strategic_pivot",
    "failure",
  ];
  if (!reasonKeys.includes(reason)) {
    return { success: false, message: "无效的退市原因" };
  }

  const reasonTexts = {
    replaced_by_new: "被新产品替代",
    market_decline: "市场萎缩",
    strategic_pivot: "战略调整",
    failure: "产品失败",
  };

  _retireProductInternal(state, product, reason, reasonTexts[reason]);
  return { success: true, product: product };
}

// ====== 核心：IPO准备 ======
function prepareIPO(state) {
  const startup = state.startup;
  const company = startup.company;
  if (!company) return { success: false, message: "没有公司" };

  if (startup.status !== "growth" && startup.status !== "ipo_preparing") {
    return { success: false, message: "公司尚未达到IPO准备阶段" };
  }

  // 检查条件
  const checks = {
    valuation: company.valuation >= 500000000, // 5亿
    funding: company.fundingRounds.length >= 2, // 至少B轮
    profitability: company.revenue > company.expenses, // 盈利
  };

  const allPassed = Object.values(checks).every(Boolean);

  if (!allPassed) {
    const failed = [];
    if (!checks.valuation)
      failed.push(
        "估值需≥5亿（当前¥" + company.valuation.toLocaleString() + "）",
      );
    if (!checks.funding) failed.push("需完成至少B轮融资");
    if (!checks.profitability) failed.push("需连续盈利");
    return {
      success: false,
      message: "IPO条件未达标：" + failed.join("，"),
      checks: checks,
    };
  }

  // 提交IPO申请
  startup.status = "ipo_preparing";
  startup.flags.ipoFiled = true;

  StateManager.addMessage("🔔 已提交IPO申请！等待监管审核...", "info");

  // 3-5天后审核结果（由pendingEvents处理）
  return { success: true, message: "IPO申请已提交" };
}

function processIPOResult(state, approved) {
  const startup = state.startup;
  const company = startup.company;
  if (!company) return;

  if (approved) {
    // IPO成功
    const ipoValuation = company.valuation * Random.float(1.5, 3.0); // 上市溢价
    company.valuation = Math.round(ipoValuation);

    startup.flags.exited = true;
    startup.flags.exitType = "ipo";
    startup.flags.exitDay = state.player.day;
    startup.flags.exitValue = Math.round(
      (company.equity.player / 100) * ipoValuation,
    );

    startup.history.exitedDay = state.player.day;
    startup.history.exitType = "ipo";
    startup.history.exitValue = startup.flags.exitValue;

    StateManager.addMessage(
      "🎉 IPO上市成功！市值¥" +
        Math.round(ipoValuation).toLocaleString() +
        "，你持有" +
        Math.round(company.equity.player) +
        "%股份，价值¥" +
        Math.round(startup.flags.exitValue).toLocaleString() +
        "！",
      "success",
    );

    // 玩家获得现金回报（[自洽修复] 域H A类#2: 防 NaN 污染 cash）
    const ipoPayout = isFinite(startup.flags.exitValue) ? startup.flags.exitValue : 0;
    state.resources.cash = (state.resources.cash || 0) + ipoPayout;
  } else {
    StateManager.addMessage("❌ IPO审核未通过，公司需要继续经营", "danger");
    startup.status = "growth";
    startup.flags.ipoFiled = false;
  }
}

// ====== 核心：被收购 ======
function getAcquisitionOffer(state) {
  const startup = state.startup;
  const company = startup.company;
  if (!company) return null;
  if (company.phase !== "growth" && company.phase !== "mature") return null;

  // 检查是否有收购要约 - 成长期/成熟期公司才有机会
  const offerProb = company.phase === "mature" ? 0.08 : 0.03;
  if (!Random.chance(offerProb)) return null;

  // 生成收购方（从企业命运系统中选择健康度高的公司）
  const companies = state.enterpriseFate?.companies || {};
  const candidates = [];
  for (const [cid, co] of Object.entries(companies)) {
    if (co && co.health > 70 && !co.isPlayerCompany && !co.ceasedExistence) {
      candidates.push({ cid, health: co.health });
    }
  }

  if (candidates.length === 0) return null;

  // 选择最强公司
  candidates.sort((a, b) => b.health - a.health);
  const acquirerCid = candidates[0].cid;
  const acquirerName = getCompanyNameById(acquirerCid);

  // 生成收购报价 - 考虑公司表现
  let offerMultiplier = Random.float(0.8, 1.4); // 基础 0.8-1.4倍
  // 表现好加成
  if (company.revenue > company.expenses) offerMultiplier += 0.15;
  if (company.reputation > 60) offerMultiplier += 0.1;
  if (company.employees.length > 10) offerMultiplier += 0.05;
  // 表现差减成
  if (company.monthsOfRunway < 3) offerMultiplier -= 0.1;
  offerMultiplier = Math.max(0.5, Math.min(2.0, offerMultiplier));

  const offerValue = Math.round(company.valuation * offerMultiplier);
  const playerShareValue = Math.round(
    (company.equity.player / 100) * offerValue,
  );

  // 生成收购方评语
  const _acquirerComments = [
    "对你们的产品方向很感兴趣",
    "看好团队的技术实力",
    "希望整合你们的市场渠道",
    "对我们的用户增长数据印象深刻",
    "想补充他们在该领域的布局",
  ];
  // [全系统自洽修复] 域H A类修复: 中文变量名改英文(_acquirerComments)
  const acquirerComment = Random.fromArray(_acquirerComments);

  return {
    acquirerCid: acquirerCid,
    acquirerName: acquirerName,
    offerValue: offerValue,
    playerShareValue: playerShareValue,
    offerDay: state.player.day,
    offerMultiplier: offerMultiplier,
    acquirerComment: acquirerComment,
    pending: true, // 待玩家决策
  };
}

/** 显示收购要约弹窗 */
if(typeof showAcquisitionModal==="undefined"){
function showAcquisitionModal(state, offer) {
  if (!offer) return;

  const startup = state.startup;
  const company = startup.company;
  const industryInfo = STARTUP_INDUSTRIES[company.industry];

  if (typeof showModal !== "function") return;

  const bodyHtml = `
    <div style="font-size:14px;">
      <div style="text-align:center;padding:16px;background:var(--bg-secondary);border-radius:8px;margin-bottom:16px;">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">🤝 收购要约</div>
        <div style="font-size:16px;font-weight:bold;color:var(--text-primary);">
          「${company.name}」将被「${offer.acquirerName}」收购
        </div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:6px;">
          ${offer.acquirerComment}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div style="padding:12px;background:var(--bg-card);border-radius:6px;">
          <div style="font-size:11px;color:var(--text-muted);">收购方</div>
          <div style="font-size:14px;font-weight:bold;color:var(--text-primary);">${offer.acquirerName}</div>
        </div>
        <div style="padding:12px;background:var(--bg-card);border-radius:6px;">
          <div style="font-size:11px;color:var(--text-muted);">报价倍数</div>
          <div style="font-size:14px;font-weight:bold;color:var(--accent);">${offer.offerMultiplier.toFixed(2)}x 估值</div>
        </div>
        <div style="padding:12px;background:var(--bg-card);border-radius:6px;">
          <div style="font-size:11px;color:var(--text-muted);">公司总估值</div>
          <div style="font-size:14px;font-weight:bold;color:var(--success);">¥${offer.offerValue.toLocaleString()}</div>
        </div>
        <div style="padding:12px;background:var(--bg-card);border-radius:6px;">
          <div style="font-size:11px;color:var(--text-muted);">你获得（${Math.round(company.equity.player)}%股份）</div>
          <div style="font-size:16px;font-weight:bold;color:var(--success);">¥${offer.playerShareValue.toLocaleString()}</div>
        </div>
      </div>

      <div style="padding:12px;background:rgba(245,158,11,0.1);border-radius:6px;border:1px solid rgba(245,158,11,0.3);margin-bottom:12px;">
        <div style="font-size:12px;color:var(--text-secondary);">
          ⚠️ 接受收购后公司将退出历史舞台，你获得现金但失去创业身份。
          建议在公司估值较高（产品成功、团队稳定、盈利）时接受。
        </div>
      </div>

      <div style="font-size:12px;color:var(--text-muted);">
        当前公司状态：估值¥${Math.round(company.valuation).toLocaleString()} |
        月收入¥${Math.round(company.revenue).toLocaleString()} |
        团队${company.employees.length}人 |
        Runway ${Math.round(company.monthsOfRunway)}月
      </div>
    </div>
  `;

  showModal({
    title: "🤝 收购要约",
    body: bodyHtml,
    buttons: [
      {
        text: "💰 接受收购",
        cls: "btn-success",
        callback: function () {
          const result = acceptAcquisition(state, offer);
          if (result.success) {
            if (typeof renderAll === "function") renderAll();
          }
        },
      },
      {
        text: "📊 还价",
        cls: "btn-primary",
        callback: function () {
          // 还价逻辑
          const counterOfferMultiplier =
            offer.offerMultiplier + Random.float(0.2, 0.5);
          const counterOfferValue = Math.round(
            company.valuation * counterOfferMultiplier,
          );
          const counterPlayerShare = Math.round(
            (company.equity.player / 100) * counterOfferValue,
          );

          if (typeof showModal !== "function") return;

          showModal({
            title: "💰 还价",
            body: `
              <div style="font-size:14px;">
                <p style="margin-bottom:12px;">你提出反报价：<strong style="color:var(--accent);">¥${counterOfferValue.toLocaleString()}</strong>（${counterOfferMultiplier.toFixed(2)}x 估值）</p>
                <p style="font-size:12px;color:var(--text-muted);">
                  对方有 ${Random.int(30, 70)}% 的概率接受。
                  如果拒绝，原报价将失效，下次收购要约需等待更久。
                </p>
              </div>
            `,
            buttons: [
              {
                text: "确认还价",
                cls: "btn-primary",
                callback: function () {
                  const accepted = Random.chance(0.3 + Random.float(0, 0.4));
                  if (accepted) {
                    StateManager.addMessage(
                      "🎉 「" +
                        offer.acquirerName +
                        "」接受了你的还价！收购价提升至 ¥" +
                        counterOfferValue.toLocaleString(),
                      "success",
                    );
                    offer.offerValue = counterOfferValue;
                    offer.playerShareValue = counterPlayerShare;
                    acceptAcquisition(state, offer);
                    if (typeof renderAll === "function") renderAll();
                  } else {
                    StateManager.addMessage(
                      "❌ 「" +
                        offer.acquirerName +
                        "」拒绝了你的还价，收购谈判破裂。",
                      "danger",
                    );
                    // 标记收购要约已失效
                    startup.flags._acquisitionOfferExpired = true;
                    if (typeof renderAll === "function") renderAll();
                  }
                },
              },
              {
                text: "取消",
                cls: "",
                callback: function () {},
              },
            ],
          });
        },
      },
      {
        text: "❌ 拒绝",
        cls: "btn-danger",
        callback: function () {
          StateManager.addMessage(
            "你拒绝了收购要约，决定继续经营公司。",
            "warning",
          );
          startup.flags._acquisitionOfferExpired = true;
          if (typeof renderAll === "function") renderAll();
        },
      },
    ],
  });
}
}

function acceptAcquisition(state, offer) {
  const startup = state.startup;
  const company = startup.company;
  if (!company || !offer) return { success: false };

  // 执行收购
  startup.flags.exited = true;
  startup.flags.exitType = "acquired";
  startup.flags.exitDay = state.player.day;
  startup.flags.exitValue = offer.playerShareValue;

  startup.history.exitedDay = state.player.day;
  startup.history.exitType = "acquired";
  startup.history.exitValue = offer.playerShareValue;

  // 玩家获得现金（[自洽修复] 域H A类#3: 防 NaN 污染 cash）
  const acquisitionPayout = isFinite(offer.playerShareValue) ? offer.playerShareValue : 0;
  state.resources.cash = (state.resources.cash || 0) + acquisitionPayout;

  // 在企业命运系统中标记
  if (state.enterpriseFate && state.enterpriseFate.companies) {
    const fateCo = state.enterpriseFate.companies[company.id];
    if (fateCo) {
      fateCo.ceasedExistence = true;
      fateCo.ceasedAt = state.player.day;
      fateCo.absorbedBy = offer.acquirerCid;
      fateCo.absorbedName = offer.acquirerName + "旗下";
    }

    // 收购方增强
    const acquirerCo = state.enterpriseFate.companies[offer.acquirerCid];
    if (acquirerCo) {
      acquirerCo.marketShare = Math.min(40, acquirerCo.marketShare + 2);
      acquirerCo.health = Math.min(100, acquirerCo.health + 5);
    }
  }

  StateManager.addMessage(
    "🤝 「" +
      company.name +
      "」被「" +
      offer.acquirerName +
      "」收购！你获得¥" +
      offer.playerShareValue.toLocaleString() +
      "，公司退出历史舞台",
    "success",
  );

  return { success: true, offer: offer };
}

// ====== 核心：破产 ======
function bankrupt(state) {
  const startup = state.startup;
  const company = startup.company;
  if (!company) return;

  startup.flags.exited = true;
  startup.flags.exitType = "bankrupt";
  startup.flags.exitDay = state.player.day;
  startup.flags.exitValue = 0;

  startup.history.exitedDay = state.player.day;
  startup.history.exitType = "bankrupt";
  startup.history.exitValue = 0;

  // 资产清算（[自洽修复] 域H A类#6: 负 recovery 会双倍扣钱+防裸访问）
  const assetRecovery = Math.max(0, Math.round((company.cashReserve || 0) * 0.3)); // 只能收回30%
  company.cashReserve = assetRecovery;

  // 玩家获得剩余现金（如果有）
  if (!state.resources) state.resources = { cash: 0, bankBalance: 0, totalEarned: 0 };
  state.resources.cash = (state.resources.cash || 0) + assetRecovery;

  // 声誉损失
  // [全系统自洽修复] 域E A类修复: state.status 守卫(防止旧存档/极端初始化崩溃)
  if (state.status) {
    state.status.health = Math.max(0, state.status.health - 10);
  }
  state.player.fame = Math.max(0, state.player.fame - 10);

  // [全系统自洽修复] 域H R170 H→G 联动增强: 创业破产心理创伤
  if (state.needs) {
    state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 15);
  }
  state.player.mental = Math.max(0, (state.player.mental || 50) - 10);

  // 在企业命运系统中标记
  if (state.enterpriseFate && state.enterpriseFate.companies && company.id) {
    const fateCo = state.enterpriseFate.companies[company.id];
    if (fateCo) {
      fateCo.ceasedExistence = true;
      fateCo.ceasedAt = state.player.day;
      fateCo.health = 0;
    }
  }

  StateManager.addMessage(
    "⚰️ 「" +
      company.name +
      "」破产清算！资产回收¥" +
      assetRecovery +
      "，声誉受损",
    "danger",
  );

  // 清空公司（但保留历史）
  startup.company = null;
}

// ====== 辅助：获取公司详情 ======
function getStartupSummary(state) {
  const startup = state.startup;
  if (!startup || startup.status === "none" || !startup.company) {
    return null;
  }

  const company = startup.company;
  return {
    name: company.name,
    industry: STARTUP_INDUSTRIES[company.industry]?.name || company.industry,
    phase: company.phase,
    valuation: company.valuation,
    revenue: company.revenue,
    expenses: company.expenses,
    cashReserve: company.cashReserve,
    monthsOfRunway: company.monthsOfRunway,
    employeeCount: company.employees.length,
    productCount: company.products.length,
    reputation: company.reputation,
    playerEquity: company.equity.player,
    fundingRounds: company.fundingRounds.length,
    status: startup.status,
  };
}

// ====== 辅助：获取可执行行动列表 ======
function getAvailableStartupActions(state) {
  const startup = state.startup;
  if (!startup || startup.status === "none" || startup.flags.exited) {
    return [];
  }

  const actions = [];
  const company = startup.company;

  if (!company) return actions;

  // 产品开发
  actions.push({
    id: "develop_product",
    name: "推进产品开发",
    icon: "💻",
    apCost: 20,
    desc: "投入20点行动力推进产品开发",
    available: company.products.some((p) => p.status === "developing"),
  });

  // 发布产品
  actions.push({
    id: "launch_product",
    name: "发布产品",
    icon: "🚀",
    apCost: 20,
    desc: "发布已开发完成的产品，推入市场",
    available: company.products.some((p) => p.status === "ready_to_launch"),
  });

  // 创建新产品
  actions.push({
    id: "create_product",
    name: "创建新产品",
    icon: "🆕",
    apCost: 15,
    desc: "启动新产品的开发计划",
    available: true,
  });

  // 招聘
  actions.push({
    id: "hire_employee",
    name: "招聘员工",
    icon: "👥",
    apCost: 15,
    desc: "招募新团队成员",
    available: company.cashReserve > 10000,
  });

  // 见投资人
  actions.push({
    id: "meet_investor",
    name: "见投资人",
    icon: "💰",
    apCost: 15,
    desc: "与投资人会面洽谈",
    available: true,
  });

  // 融资
  const eligibleRounds = getEligibleRounds(state);
  actions.push({
    id: "raise_funding",
    name: "发起融资",
    icon: "📈",
    apCost: 10,
    desc: "启动融资流程",
    available: eligibleRounds.length > 0,
    meta: eligibleRounds.map((r) => FUNDING_ROUNDS[r].name).join(", "),
  });

  // 市场推广
  actions.push({
    id: "marketing",
    name: "市场推广",
    icon: "📢",
    apCost: 15,
    desc: "投入资源提升市场知名度",
    available: company.cashReserve > 5000,
  });

  // 查看财报
  actions.push({
    id: "review_financials",
    name: "查看财报",
    icon: "📊",
    apCost: 5,
    desc: "查看公司财务状况",
    available: true,
  });

  // 管理团队
  actions.push({
    id: "manage_team",
    name: "管理团队",
    icon: "🎯",
    apCost: 10,
    desc: "提升团队忠诚度和效率",
    available: company.employees.length > 0,
  });

  // P0-5: KPI/OKR 目标管理
  actions.push({
    id: "kpi_dashboard",
    name: "目标管理",
    icon: "📊",
    apCost: 10,
    desc: "设定和追踪季度 OKR、团队/个人目标",
    available: true,
  });

  // P1-6: 董事会管理
  actions.push({
    id: "board_management",
    name: "董事会管理",
    icon: "📋",
    apCost: 10,
    desc: "查看董事会成员、KPI完成情况和股东沟通",
    available: true,
  });

  // P1-7: 公关/媒体管理
  actions.push({
    id: "pr_management",
    name: "公关管理",
    icon: "📰",
    apCost: 10,
    desc: "管理媒体关系、处理危机事件、举办公关活动",
    available: true,
  });

  // P1-8: 法律/合规管理
  actions.push({
    id: "legal_compliance",
    name: "法律/合规",
    icon: "⚖️",
    apCost: 10,
    desc: "管理法律风险、申请专利、合规检查、处理法律事件",
    available: true,
  });

  // P1-9: 竞争对手防御
  actions.push({
    id: "competitor_defense",
    name: "竞争防御",
    icon: "🛡️",
    apCost: 10,
    desc: "应对竞争对手攻击、投资防御能力、购买竞争情报",
    available: true,
  });

  // P1-10: 危机管理
  actions.push({
    id: "crisis_management",
    name: "危机管理",
    icon: "🚨",
    apCost: 10,
    desc: "应对危机事件、投资危机准备、购买危机保险",
    available: true,
  });

  // IPO准备
  if (company.phase === "growth" && company.fundingRounds.length >= 2) {
    actions.push({
      id: "ipo_prep",
      name: "准备IPO",
      icon: "🔔",
      apCost: 20,
      desc: "准备上市申请材料",
      available:
        startup.status !== "ipo_preparing" && startup.status !== "exited",
    });
  }

  // P2-11: 办公地点管理
  actions.push({
    id: "office_management",
    name: "办公地点",
    icon: "🏢",
    apCost: 10,
    desc: "升级/降级办公地点，查看各等级加成",
    available: true,
  });

  // P2-12: 企业文化管理
  actions.push({
    id: "culture_management",
    name: "企业文化",
    icon: "🏛️",
    apCost: 10,
    desc: "切换企业文化，提升文化适应度",
    available: true,
  });

  // P2-13: 合作伙伴管理
  actions.push({
    id: "partner_management",
    name: "合作伙伴",
    icon: "🤝",
    apCost: 10,
    desc: "招募/管理合作伙伴，提升信任度",
    available: true,
  });

  // P2-14: 产品定价管理
  actions.push({
    id: "pricing_management",
    name: "产品定价",
    icon: "💰",
    apCost: 10,
    desc: "调整产品价格，A/B测试，切换定价策略",
    available: company.products.some((p) => p.status === "launched"),
  });

  // P2-15: 供应链管理
  actions.push({
    id: "supply_chain_management",
    name: "供应链",
    icon: "📦",
    apCost: 10,
    desc: "管理供应商，监控库存，降低供应链风险",
    available:
      company.industry === "manufacturing" ||
      company.industry === "tech" ||
      company.products.some(
        (p) => p.category === "hardware" || p.category === "smart_device",
      ),
  });

  return actions;
}

// ====== 深度交互弹窗 ======

/** 见投资人弹窗 — 多渠道验证 + 投资人关系管理 */
function showMeetInvestorModal(state) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  // 生成投资人反馈
  const investorFeedback = generateInvestorFeedback(state);

  if (typeof showModal !== "function") return { success: true };

  const bodyHtml = `
    <div style="font-size:13px;">
      <div style="padding:12px;background:var(--bg-card);border-radius:8px;margin-bottom:12px;">
        <div style="font-size:14px;font-weight:bold;margin-bottom:8px;">💰 投资人会面</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">投资人类型：${investorFeedback.investorType}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">关注领域：${investorFeedback.focusArea}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">关系度：
          <span style="color:${getRelationshipColor(investorFeedback.relationship)};">${"★".repeat(Math.floor(investorFeedback.relationship / 20))}${"☆".repeat(5 - Math.floor(investorFeedback.relationship / 20))} ${investorFeedback.relationship}%</span>
        </div>
      </div>

      <div style="padding:12px;background:rgba(74,158,92,0.1);border-radius:6px;margin-bottom:12px;border:1px solid rgba(74,158,92,0.2);">
        <div style="font-size:12px;font-weight:bold;color:var(--success);margin-bottom:6px;">✅ 投资人看好</div>
        <div style="font-size:11px;color:var(--text-secondary);">${investorFeedback.positive}</div>
      </div>

      <div style="padding:12px;background:rgba(243,156,18,0.1);border-radius:6px;margin-bottom:12px;border:1px solid rgba(243,156,18,0.2);">
        <div style="font-size:12px;font-weight:bold;color:var(--warning);margin-bottom:6px;">⚠️ 关注风险</div>
        <div style="font-size:11px;color:var(--text-secondary);">${investorFeedback.concerns}</div>
      </div>

      <div style="font-size:11px;color:var(--text-muted);">
        💡 建议：${investorFeedback.advice}
      </div>
    </div>
  `;

  showModal({
    title: "💰 投资人会面",
    body: bodyHtml,
    buttons: [
      {
        text: "📅 约定下次会面",
        cls: "btn-primary",
        callback: function () {
          // 增加关系度
          company.investorRelationship = Math.min(
            100,
            (company.investorRelationship || 0) + investorFeedback.gain,
          );
          StateManager.addMessage(
            "与投资人关系度提升至 " +
              Math.round(company.investorRelationship) +
              "%",
            "success",
          );
          if (typeof renderAll === "function") renderAll();
        },
      },
      {
        text: "关闭",
        cls: "",
        callback: function () {},
      },
    ],
  });

  return { success: true };
}

/** 生成投资人反馈 */
function generateInvestorFeedback(state) {
  const company = state.startup.company;
  const phase = company.phase;

  const investorTypes = [
    "天使投资人",
    "VC机构",
    "企业风投",
    "家族办公室",
    "产业基金",
  ];
  const focusAreas = [
    "产品创新",
    "市场增长",
    "团队能力",
    "技术壁垒",
    "商业模式",
  ];

  const investorType = Random.fromArray(investorTypes);
  const focusArea = Random.fromArray(focusAreas);
  const relationship =
    (company.investorRelationship || 30) + Random.int(10, 29);

  let positive, concerns, advice;

  if (phase === "seed") {
    positive = "产品方向清晰，团队执行力强，种子用户反馈积极";
    concerns = "市场规模待验证，商业模式需要进一步打磨，现金流压力较大";
    advice = "建议先做出MVP验证市场需求，再寻求A轮融资";
  } else if (phase === "growth") {
    positive = "用户增长数据亮眼，产品迭代速度快，团队结构完整";
    concerns = "竞争加剧风险，需要建立护城河，盈利模式需要验证";
    advice = "建议加速市场扩张，同时建立产品壁垒";
  } else {
    positive = "市场份额稳定，盈利模式清晰，团队成熟度高";
    concerns = "增长放缓，需要寻找第二增长曲线，IPO准备需要时间";
    advice = "建议考虑并购机会或加速IPO准备";
  }

  // 表现加成
  if (company.revenue > company.expenses) {
    positive += "，已实现盈利";
    concerns = concerns.replace("盈利模式需要验证", "盈利可持续性强");
  }
  if (company.reputation > 60) {
    positive += "，行业口碑良好";
  }

  return {
    investorType,
    focusArea,
    relationship,
    gain: Random.int(5, 19),
    positive,
    concerns,
    advice,
  };
}

function getRelationshipColor(val) {
  if (val >= 70) return "#2ecc71";
  if (val >= 40) return "#f39c12";
  return "#e74c3c";
}

/** 市场推广弹窗 — 多渠道选择 */
function showMarketingModal(state) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const channels = [
    {
      id: "social_media",
      name: "社交媒体营销",
      icon: "📱",
      cost: 5000,
      desc: "抖音/小红书/微博推广，快速提升知名度",
      effect: "市场分+3，用户增长+5%",
      risk: "效果波动大，需持续投入",
    },
    {
      id: "offline_event",
      name: "线下活动",
      icon: "🎪",
      cost: 15000,
      desc: "行业展会/发布会/沙龙，建立行业影响力",
      effect: "市场分+5，声誉+3，获得媒体曝光",
      risk: "成本高，效果依赖活动质量",
    },
    {
      id: "kol_collab",
      name: "KOL合作",
      icon: "⭐",
      cost: 20000,
      desc: "与行业KOL/博主合作推广",
      effect: "市场分+4，用户增长+8%，口碑传播",
      risk: "KOL选择风险，需评估真实性",
    },
    {
      id: "advertising",
      name: "广告投放",
      icon: "📺",
      cost: 30000,
      desc: "信息流广告/搜索引擎营销",
      effect: "市场分+6，用户增长+10%，直接转化",
      risk: "成本高，ROI不稳定",
    },
    {
      id: "content_marketing",
      name: "内容营销",
      icon: "📝",
      cost: 3000,
      desc: "博客/视频/白皮书，建立专业形象",
      effect: "市场分+2，声誉+2，长期价值",
      risk: "见效慢，需持续产出",
    },
  ];

  const bodyHtml = `
    <div style="font-size:13px;">
      <p style="margin-bottom:12px;color:var(--text-secondary);">
        选择推广渠道，提升市场知名度和用户增长。不同渠道成本效果不同。
      </p>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${channels
          .map(
            (ch) => `
          <div style="padding:10px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border);cursor:pointer;marketing-channel="${ch.id}" onclick="this.style.background='var(--bg-secondary)';this.style.borderColor='var(--accent)';">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <div style="font-size:13px;font-weight:bold;">${ch.icon} ${ch.name}</div>
              <div style="font-size:12px;color:var(--danger);">¥${ch.cost.toLocaleString()}</div>
            </div>
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:2px;">${ch.desc}</div>
            <div style="font-size:10px;color:var(--success);">效果：${ch.effect}</div>
            <div style="font-size:10px;color:var(--warning);">风险：${ch.risk}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;

  if (typeof showModal !== "function") return { success: true };

  showModal({
    title: "📢 市场推广",
    body: bodyHtml,
    buttons: [
      {
        text: "✅ 确认执行",
        cls: "btn-primary",
        callback: function () {
          const selected = document.querySelector(
            '[marketing-channel][style*="var(--bg-secondary)"]',
          );
          if (!selected) {
            StateManager.addMessage("请选择一个推广渠道", "warning");
            return;
          }
          const channelId = selected.getAttribute("marketing-channel");
          const channel = channels.find((c) => c.id === channelId);
          if (!channel) return;

          if (company.cashReserve < channel.cost) {
            StateManager.addMessage(
              "现金不足，需要¥" + channel.cost.toLocaleString(),
              "danger",
            );
            return;
          }

          // 执行推广
          company.cashReserve -= channel.cost;
          company.marketScore = Math.min(
            100,
            company.marketScore +
              Math.floor(channel.effect.match(/\+(\d+)/)[1] / 2),
          );

          // 随机效果波动
          const effectiveness = Random.float(0.7, 1.3);
          const userGrowth = Math.floor(5 * effectiveness);

          StateManager.addMessage(
            "📢 「" +
              channel.name +
              "」推广完成！市场分提升，用户增长 +" +
              userGrowth +
              "%",
            "success",
          );

          if (typeof renderAll === "function") renderAll();
        },
      },
      {
        text: "取消",
        cls: "",
        callback: function () {},
      },
    ],
  });

  return { success: true };
}

/** 查看财报弹窗 — 完整财务报表 */
function showFinancialReportModal(state) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const monthlyRevenue = company.revenue || 0;
  const monthlyExpenses = company.expenses || 0;
  const netIncome = monthlyRevenue - monthlyExpenses;
  const profitMargin =
    monthlyRevenue > 0 ? (netIncome / monthlyRevenue) * 100 : 0;

  const bodyHtml = `
    <div style="font-size:13px;">
      <!-- 损益表 -->
      <div style="padding:12px;background:var(--bg-card);border-radius:8px;margin-bottom:12px;">
        <div style="font-size:14px;font-weight:bold;margin-bottom:8px;">📊 损益表（月度）</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;text-align:center;">
            <div style="font-size:10px;color:var(--text-muted);">月收入</div>
            <div style="font-size:14px;font-weight:bold;color:var(--success);">¥${monthlyRevenue.toLocaleString()}</div>
          </div>
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;text-align:center;">
            <div style="font-size:10px;color:var(--text-muted);">月支出</div>
            <div style="font-size:14px;font-weight:bold;color:var(--danger);">¥${monthlyExpenses.toLocaleString()}</div>
          </div>
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;text-align:center;">
            <div style="font-size:10px;color:var(--text-muted);">净利润</div>
            <div style="font-size:14px;font-weight:bold;color:${netIncome >= 0 ? "var(--success)" : "var(--danger)"};">¥${netIncome.toLocaleString()}</div>
          </div>
        </div>
        <div style="margin-top:8px;padding:6px;background:${profitMargin >= 0 ? "rgba(74,158,92,0.1)" : "rgba(231,76,60,0.1)"};border-radius:4px;font-size:11px;text-align:center;">
          利润率：${profitMargin.toFixed(1)}% ${profitMargin >= 0 ? "✅ 盈利" : "❌ 亏损"}
        </div>
      </div>

      <!-- 资产负债表 -->
      <div style="padding:12px;background:var(--bg-card);border-radius:8px;margin-bottom:12px;">
        <div style="font-size:14px;font-weight:bold;margin-bottom:8px;">💼 资产负债表</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;">
            <div style="font-size:10px;color:var(--text-muted);">现金储备</div>
            <div style="font-size:14px;font-weight:bold;">¥${Math.round(company.cashReserve).toLocaleString()}</div>
          </div>
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;">
            <div style="font-size:10px;color:var(--text-muted);">公司估值</div>
            <div style="font-size:14px;font-weight:bold;color:var(--accent);">¥${Math.round(company.valuation).toLocaleString()}</div>
          </div>
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;">
            <div style="font-size:10px;color:var(--text-muted);">Runway</div>
            <div style="font-size:14px;font-weight:bold;color:${company.monthsOfRunway > 3 ? "var(--success)" : "var(--danger)"};">${Math.round(company.monthsOfRunway)} 月</div>
          </div>
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;">
            <div style="font-size:10px;color:var(--text-muted);">团队规模</div>
            <div style="font-size:14px;font-weight:bold;">${company.employees.length} 人</div>
          </div>
        </div>
      </div>

      <!-- 股权分布 -->
      <div style="padding:12px;background:var(--bg-card);border-radius:8px;">
        <div style="font-size:14px;font-weight:bold;margin-bottom:8px;">📈 股权分布</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:11px;">
          <div style="padding:4px 8px;background:var(--bg-secondary);border-radius:4px;">你：${Math.round(company.equity.player)}%</div>
          <div style="padding:4px 8px;background:var(--bg-secondary);border-radius:4px;">联合创始人：${Math.round(company.equity.coFounders)}%</div>
          <div style="padding:4px 8px;background:var(--bg-secondary);border-radius:4px;">员工期权：${Math.round(company.equity.employees)}%</div>
          <div style="padding:4px 8px;background:var(--bg-secondary);border-radius:4px;">投资人：${Math.round(company.equity.investors)}%</div>
        </div>
      </div>
    </div>
  `;

  if (typeof showModal !== "function") return { success: true };

  showModal({
    title: "📊 财务报表",
    body: bodyHtml,
    buttons: [
      {
        text: "关闭",
        cls: "",
        callback: function () {},
      },
    ],
  });

  return { success: true };
}

/** 团队管理弹窗 — 深度团队管理 */
function showTeamManagementModal(state) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  // P0-4: 获取满意度汇总
  const satSummary =
    typeof getEmployeeSatisfactionSummary === "function"
      ? getEmployeeSatisfactionSummary(company)
      : null;

  const actions = [
    {
      id: "team_building",
      name: "团队建设",
      icon: "🎉",
      cost: 5000,
      desc: "组织团建活动，提升团队凝聚力",
      effect: "全员忠诚度+8，满意度+5",
    },
    {
      id: "training",
      name: "技能培训",
      icon: "📚",
      cost: 10000,
      desc: "安排专业技能培训",
      effect: "全员技能+3，生产力+5%",
    },
    {
      id: "one_on_one",
      name: "一对一谈话",
      icon: "💬",
      cost: 0,
      desc: "与关键员工一对一沟通",
      effect: "选择1名员工忠诚度+15",
    },
    {
      id: "performance_review",
      name: "绩效面谈",
      icon: "📋",
      cost: 0,
      desc: "进行季度绩效评估",
      effect: "显示员工绩效，可调整薪资",
    },
    {
      id: "salary_adjustment",
      name: "调薪",
      icon: "💰",
      cost: 0,
      desc: "为表现优秀的员工调薪",
      effect: "提升员工满意度和留存率",
    },
    // P0-4: 新增满意度提升操作
    {
      id: "flexible_work",
      name: "弹性工作",
      icon: "⏰",
      cost: 3000,
      desc: "推行弹性工作制，减少加班压力",
      effect: "工作强度满意度+10，氛围+5",
    },
    {
      id: "health_check",
      name: "健康检查",
      icon: "🏥",
      cost: 6000,
      desc: "安排全员体检，关注健康",
      effect: "健康值+10，倦怠风险-5",
    },
  ];

  // P0-4: 满意度汇总HTML
  var satSummaryHtml = "";
  if (satSummary) {
    var atRiskColor =
      satSummary.atRiskCount > 0 ? "var(--danger)" : "var(--success)";
    satSummaryHtml =
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px;padding:8px;background:var(--bg-secondary);border-radius:6px;">' +
      '<div style="text-align:center;"><div style="font-size:10px;color:var(--text-muted);">平均满意度</div><div style="font-size:16px;font-weight:bold;color:var(--success);">' +
      satSummary.avgSatisfaction +
      "%</div></div>" +
      '<div style="text-align:center;"><div style="font-size:10px;color:var(--text-muted);">平均健康</div><div style="font-size:16px;font-weight:bold;color:var(--success);">' +
      satSummary.avgHealth +
      "%</div></div>" +
      '<div style="text-align:center;"><div style="font-size:10px;color:var(--text-muted);">倦怠风险</div><div style="font-size:16px;font-weight:bold;color:' +
      (satSummary.avgBurnoutRisk > 40 ? "var(--danger)" : "var(--success)") +
      ';">' +
      satSummary.avgBurnoutRisk +
      "%</div></div>" +
      '<div style="text-align:center;"><div style="font-size:10px;color:var(--text-muted);">⚠️ 风险员工</div><div style="font-size:16px;font-weight:bold;color:' +
      atRiskColor +
      ';">' +
      satSummary.atRiskCount +
      "/" +
      satSummary.totalEmployees +
      "</div></div>" +
      "</div>";
  }

  const bodyHtml = `
    <div style="font-size:13px;">
      ${satSummaryHtml ? '<div style="margin-bottom:12px;">' + satSummaryHtml + "</div>" : ""}
      <p style="margin-bottom:12px;color:var(--text-secondary);">
        选择团队管理行动。团队管理是创业成功的关键！
      </p>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${actions
          .map(
            (act) => `
          <div style="padding:10px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <div style="font-size:13px;font-weight:bold;">${act.icon} ${act.name}</div>
              <div style="font-size:12px;color:${act.cost > 0 ? "var(--danger)" : "var(--success)"};">${act.cost > 0 ? "¥" + act.cost.toLocaleString() : "免费"}</div>
            </div>
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:2px;">${act.desc}</div>
            <div style="font-size:10px;color:var(--success);">效果：${act.effect}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;

  if (typeof showModal !== "function") return { success: true };

  showModal({
    title: "🎯 团队管理",
    body: bodyHtml,
    buttons: [
      {
        text: "执行团队管理",
        cls: "btn-primary",
        callback: function () {
          // 简化：默认执行团队建设
          if (company.cashReserve >= 5000) {
            company.cashReserve -= 5000;
            for (const emp of company.employees) {
              emp.loyalty = Math.min(100, emp.loyalty + 8);
              if (emp.satisfaction === undefined) emp.satisfaction = 50;
              emp.satisfaction = Math.min(100, emp.satisfaction + 5);
              if (emp.satisfactionDetails) {
                emp.satisfactionDetails.workload = Math.min(
                  100,
                  emp.satisfactionDetails.workload + 5,
                );
                emp.satisfactionDetails.atmosphere = Math.min(
                  100,
                  emp.satisfactionDetails.atmosphere + 5,
                );
              }
              emp.burnoutRisk = Math.max(0, emp.burnoutRisk - 5);
            }
            StateManager.addMessage(
              "🎉 团队建设完成！全员忠诚度+8，满意度+5",
              "success",
            );
            if (typeof renderAll === "function") renderAll();
          } else {
            StateManager.addMessage("现金不足，需要¥5,000", "warning");
          }
        },
      },
      {
        text: "关闭",
        cls: "",
        callback: function () {},
      },
    ],
  });

  return { success: true };
}

// ====== P1-6: 董事会管理弹窗 ======
/** 显示董事会管理面板 */
function showBoardManagementModal(state) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  // 董事会成员列表
  let boardMembersHtml = "";
  if (company.boardMembers && company.boardMembers.length > 0) {
    boardMembersHtml = '<div style="margin-bottom:12px;">';
    for (const member of company.boardMembers) {
      const satisfactionColor =
        member.satisfaction >= 60
          ? "var(--success)"
          : member.satisfaction >= 40
            ? "var(--warning)"
            : "var(--danger)";
      const trustColor =
        member.trust >= 60
          ? "var(--success)"
          : member.trust >= 40
            ? "var(--warning)"
            : "var(--danger)";
      const pressureColor = getPressureLevelColor(
        member.pressureTolerance === "极低"
          ? 3
          : member.pressureTolerance === "低"
            ? 2
            : 1,
      );

      boardMembersHtml += `
        <div style="padding:8px;margin-bottom:6px;background:var(--bg-secondary);border-radius:6px;border-left:3px solid ${pressureColor}">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:12px;font-weight:bold;">${member.icon || "📋"} ${member.name} <span style="font-size:10px;color:var(--text-muted);">(${member.investorType} · ${member.role})</span></div>
            <div style="font-size:10px;color:var(--text-muted);">${member.personality}型</div>
          </div>
          <div style="display:flex;gap:12px;margin-top:4px;font-size:10px;">
            <div>满意度: <span style="color:${satisfactionColor};font-weight:bold;">${member.satisfaction}%</span></div>
            <div>信任度: <span style="color:${trustColor};font-weight:bold;">${member.trust}%</span></div>
            <div>耐心: ${member.patience}%</div>
            <div>关注: ${member.focusAreas.slice(0, 2).join(", ")}</div>
          </div>
          ${
            member.concerns && member.concerns.length > 0
              ? `<div style="font-size:10px;color:var(--danger);margin-top:2px;">⚠️ 关注：${member.concerns.join(", ")}</div>`
              : ""
          }
        </div>`;
    }
    boardMembersHtml += "</div>";
  } else {
    boardMembersHtml =
      '<div style="padding:12px;text-align:center;color:var(--text-muted);font-size:12px;">尚未有董事会成员（融资后投资人派代表进入董事会）</div>';
  }

  // KPI完成情况
  let kpiHistoryHtml = "";
  if (company.boardKPIHistory && company.boardKPIHistory.length > 0) {
    kpiHistoryHtml = '<div style="margin-bottom:12px;">';
    kpiHistoryHtml +=
      '<div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">KPI完成历史</div>';
    kpiHistoryHtml += '<div style="display:flex;gap:4px;overflow-x:auto;">';
    for (const record of company.boardKPIHistory.slice(-8)) {
      const scoreColor = record.passed ? "var(--success)" : "var(--danger)";
      const scorePct = Math.round(record.totalScore * 100);
      kpiHistoryHtml += `
        <div style="min-width:50px;padding:4px 6px;background:var(--bg-secondary);border-radius:4px;text-align:center;">
          <div style="font-size:9px;color:var(--text-muted);">Y${record.year}Q${record.quarter}</div>
          <div style="font-size:14px;font-weight:bold;color:${scoreColor};">${scorePct}%</div>
          <div style="font-size:9px;color:${record.passed ? "var(--success)" : "var(--danger)"};">${record.passed ? "✅" : "❌"}</div>
        </div>`;
    }
    kpiHistoryHtml += "</div></div>";
  }

  // 当前压力等级
  const pressureText = getPressureLevelText(company.boardPressureLevel);
  const pressureColor = getPressureLevelColor(company.boardPressureLevel);

  // 待处理行动
  let pendingActionHtml = "";
  if (company.pendingBoardAction) {
    const action = company.pendingBoardAction;
    const daysLeft = Math.ceil((action.deadline - state.player.day) / 30);
    pendingActionHtml = `
      <div style="padding:10px;background:var(--bg-warning);border-radius:6px;margin-bottom:12px;border:1px solid var(--border);">
        <div style="font-size:12px;font-weight:bold;color:var(--danger);margin-bottom:6px;">${action.event.icon} ${action.event.title}</div>
        <div style="font-size:10px;color:var(--text-secondary);margin-bottom:8px;">${action.event.trigger} · 剩余${daysLeft}个季度</div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${action.event.options
            .map(
              (opt, i) => `
            <button class="btn" style="font-size:11px;padding:6px 10px;text-align:left;" onclick="resolveBoardPressureActionFromModal('${Object.keys(BOARD_PRESSURE_EVENTS).find((k) => BOARD_PRESSURE_EVENTS[k] === action.event)}', ${i})">
              ${opt.text} ${opt.cost > 0 ? `(¥${opt.cost.toLocaleString()})` : ""}
            </button>
          `,
            )
            .join("")}
        </div>
      </div>`;
  }

  // 股东沟通行动
  const commActions = getAvailableShareholderActions();
  let commActionsHtml = commActions
    .map(
      (act) => `
    <div style="padding:8px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border);">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:12px;font-weight:bold;">${act.icon} ${act.name}</div>
        <div style="font-size:11px;color:${act.cost > 0 ? "var(--danger)" : "var(--success)"};">${act.cost > 0 ? "¥" + act.cost.toLocaleString() : "免费"}</div>
      </div>
      <div style="font-size:10px;color:var(--text-secondary);margin-top:2px;">${act.desc}</div>
    </div>
  `,
    )
    .join("");

  const bodyHtml = `
    <div style="font-size:13px;max-height:70vh;overflow-y:auto;">
      <!-- 概览 -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px;padding:8px;background:var(--bg-secondary);border-radius:6px;">
        <div style="text-align:center;">
          <div style="font-size:10px;color:var(--text-muted);">董事会压力</div>
          <div style="font-size:16px;font-weight:bold;color:${pressureColor};">${pressureText}</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:10px;color:var(--text-muted);">股东满意度</div>
          <div style="font-size:16px;font-weight:bold;color:${company.shareholderSatisfaction >= 60 ? "var(--success)" : company.shareholderSatisfaction >= 40 ? "var(--warning)" : "var(--danger)"};">${Math.round(company.shareholderSatisfaction)}%</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:10px;color:var(--text-muted);">股东信任度</div>
          <div style="font-size:16px;font-weight:bold;color:${company.shareholderTrust >= 60 ? "var(--success)" : company.shareholderTrust >= 40 ? "var(--warning)" : "var(--danger)"};">${Math.round(company.shareholderTrust)}%</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:10px;color:var(--text-muted);">战略一致性</div>
          <div style="font-size:16px;font-weight:bold;color:${company.boardAlignment >= 60 ? "var(--success)" : company.boardAlignment >= 40 ? "var(--warning)" : "var(--danger)"};">${Math.round(company.boardAlignment)}%</div>
        </div>
      </div>

      ${kpiHistoryHtml}

      <!-- 待处理行动 -->
      ${pendingActionHtml}

      <!-- 董事会成员 -->
      <div style="margin-bottom:12px;">
        <div style="font-size:12px;font-weight:bold;margin-bottom:6px;">📋 董事会成员</div>
        ${boardMembersHtml}
      </div>

      <!-- 股东沟通行动 -->
      <div style="margin-bottom:12px;">
        <div style="font-size:12px;font-weight:bold;margin-bottom:6px;">🤝 股东沟通行动</div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${commActionsHtml}
        </div>
      </div>
    </div>
  `;

  if (typeof showModal !== "function") return { success: true };

  // 绑定全局函数供按钮调用
  window.resolveBoardPressureActionFromModal = function (
    eventKey,
    optionIndex,
  ) {
    const result = resolveBoardPressureAction(state, optionIndex);
    if (result.success) {
      // 重新渲染
      if (typeof renderAll === "function") renderAll();
    }
  };

  showModal({
    title: "📋 董事会管理",
    body: bodyHtml,
    buttons: [
      {
        text: "关闭",
        cls: "",
        callback: function () {},
      },
    ],
  });

  return { success: true };
}

// ====== P1-7: 公关/媒体管理弹窗 ======

/** 显示公关管理面板 */
function showPRManagementModal(state) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  // 媒体关系摘要
  const mediaInfo = getMediaRelationLevelInfo(company.mediaRelationLevel);
  const crisisInfo = getCrisisLevelInfo(company.crisisLevel);

  // 媒体关系等级显示
  const mediaLevelHtml = `
    <div style="padding:12px;margin-bottom:12px;background:var(--bg-secondary);border-radius:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:bold;">📰 媒体关系</div>
        <div style="font-size:11px;color:var(--text-muted);">${mediaInfo.icon} ${mediaInfo.name}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="flex:1;height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${company.mediaRelations}%;background:var(--accent);border-radius:4px;transition:width 0.3s;"></div>
        </div>
        <div style="font-size:14px;font-weight:bold;color:var(--accent);">${company.mediaRelations}%</div>
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">${mediaInfo.bonus}</div>
    </div>
  `;

  // 危机等级显示
  const crisisHtml = `
    <div style="padding:12px;margin-bottom:12px;background:var(--bg-secondary);border-radius:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:bold;">${crisisInfo.icon} 危机等级</div>
        <div style="font-size:11px;color:${crisisInfo.color};font-weight:bold;">${crisisInfo.name}</div>
      </div>
      <div style="display:flex;gap:4px;">
        ${CRISIS_LEVELS.map(
          (l) => `
          <div style="flex:1;height:6px;background:${company.crisisLevel >= l.level ? l.color : "var(--bg-tertiary)"};border-radius:3px;"></div>
        `,
        ).join("")}
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">危机准备度: ${company.crisisPrepLevel}% | 媒体培训: ${company.mediaTrainingLevel}%</div>
    </div>
  `;

  // 待处理危机
  let pendingCrisisHtml = "";
  if (company.pendingCrisisEvent) {
    const crisis = company.pendingCrisisEvent.event;
    const daysRemaining = Math.max(0, crisis.deadline - state.player.day);
    const urgencyColor =
      daysRemaining <= 7
        ? "var(--danger)"
        : daysRemaining <= 14
          ? "var(--warning)"
          : "var(--text-secondary)";

    pendingCrisisHtml = `
      <div style="padding:12px;margin-bottom:12px;background:var(--bg-warning);border-radius:8px;border-left:4px solid var(--danger);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="font-size:13px;font-weight:bold;color:var(--danger);">${crisis.icon} 【待处理危机】${crisis.title}</div>
          <div style="font-size:11px;color:${urgencyColor};font-weight:bold;">剩余${daysRemaining}天</div>
        </div>
        <div style="font-size:10px;color:var(--text-secondary);">严重程度: ${crisis.severity === "high" ? "🔴 严重" : crisis.severity === "medium" ? "🟡 中等" : "🟢 轻微"}</div>
        <div style="margin-top:8px;">
          <button class="btn btn-primary" onclick="showCrisisResponseModal('${crisis.id}')">处理危机</button>
        </div>
      </div>
    `;
  }

  // 近期公关事件
  let recentEventsHtml = "";
  const recentEvents = company.prEvents.slice(-8).reverse();
  if (recentEvents.length > 0) {
    recentEventsHtml = '<div style="margin-bottom:12px;">';
    recentEventsHtml +=
      '<div style="font-size:12px;font-weight:bold;margin-bottom:8px;">📜 近期公关事件</div>';
    recentEventsHtml +=
      '<div style="display:flex;flex-direction:column;gap:4px;max-height:200px;overflow-y:auto;">';

    for (const event of recentEvents) {
      const eventColor =
        event.type === "positive"
          ? event.success
            ? "var(--success)"
            : "var(--warning)"
          : event.severity === "high"
            ? "var(--danger)"
            : event.severity === "medium"
              ? "var(--warning)"
              : "#f59e0b";
      const eventIcon =
        event.type === "positive"
          ? event.success
            ? "✅"
            : "🔶"
          : event.icon || "⚠️";

      recentEventsHtml += `
        <div style="padding:8px;background:var(--bg-card);border-radius:6px;border-left:3px solid ${eventColor}">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:11px;font-weight:bold;">${eventIcon} ${event.title}</div>
            <div style="font-size:9px;color:var(--text-muted);">${_formatDayAgo(state.player.day - event.triggeredDay)}</div>
          </div>
          ${
            event.outcome
              ? `<div style="font-size:9px;color:var(--text-secondary);margin-top:2px;">${Object.entries(
                  event.outcome,
                )
                  .map(([k, v]) => `${k}: ${v > 0 ? "+" : ""}${v}`)
                  .join(", ")}</div>`
              : ""
          }
        </div>
      `;
    }
    recentEventsHtml += "</div></div>";
  }

  // 公关活动列表
  let prActionsHtml = "";
  const prEvents = getAvailablePREvents();
  if (prEvents.length > 0) {
    prActionsHtml = '<div style="margin-bottom:12px;">';
    prActionsHtml +=
      '<div style="font-size:12px;font-weight:bold;margin-bottom:8px;">🎯 公关活动</div>';
    prActionsHtml +=
      '<div style="display:flex;flex-direction:column;gap:4px;">';

    for (const event of prEvents) {
      const canAfford = company.cashReserve >= event.cost;
      const meetsConditions =
        !event.triggerConditions ||
        (event.triggerConditions.minRevenue &&
          company.revenue >= event.triggerConditions.minRevenue);

      const disabled = !canAfford || !meetsConditions;
      const btnClass = disabled
        ? ""
        : "onclick=\"executePRActionFromModal('" +
          event.id +
          "')\" onmouseover=\"this.style.borderColor='var(--accent)';this.style.background='var(--bg-card-hover)';this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px var(--accent-glow)';\" onmouseout=\"this.style.borderColor='var(--border)';this.style.background='var(--bg-card)';this.style.transform='none';this.style.boxShadow='none';\"";

      // 构建条件详情
      var condDetails = "";
      if (event.triggerConditions && event.triggerConditions.minRevenue) {
        var revOk = company.revenue >= event.triggerConditions.minRevenue;
        condDetails +=
          '<div style="font-size:9px;padding:2px 4px;border-radius:2px;margin-top:2px;background:' +
          (revOk ? "rgba(46,204,113,0.06);" : "rgba(231,76,60,0.06);") +
          '">' +
          '<span style="color:' +
          (revOk ? "var(--success)" : "var(--danger)") +
          ';">' +
          (revOk ? "✅" : "❌") +
          " 月收入≥¥" +
          event.triggerConditions.minRevenue.toLocaleString() +
          "（当前¥" +
          company.revenue.toLocaleString() +
          "）</span></div>";
      }
      if (!canAfford) {
        condDetails +=
          '<div style="font-size:9px;padding:2px 4px;border-radius:2px;margin-top:2px;background:rgba(231,76,60,0.06);">' +
          '<span style="color:var(--danger);">❌ 现金≥¥' +
          event.cost.toLocaleString() +
          "（当前¥" +
          (company.cashReserve || 0).toLocaleString() +
          "）</span></div>";
      }

      prActionsHtml += `
        <div style="padding:10px;background:${disabled ? "rgba(0,0,0,0.05)" : "var(--bg-card)"};border-radius:6px;border:1px solid ${disabled ? "var(--border)" : "transparent"};opacity:${disabled ? 0.5 : 1};${disabled ? "" : "cursor:pointer;transition:all 0.2s;"}" ${btnClass}>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:12px;font-weight:bold;">${event.icon} ${event.name}</div>
              <div style="font-size:10px;color:var(--text-secondary);margin-top:2px;">${event.desc}</div>
              <div style="font-size:9px;color:var(--text-muted);margin-top:2px;">成功率: ${Math.round(event.successChance * 100)}% | 持续时间: ${event.duration}天</div>
              ${condDetails}
            </div>
            <div style="text-align:right;">
              <div style="font-size:12px;font-weight:bold;color:${canAfford ? "var(--accent)" : "var(--danger)"};">¥${event.cost.toLocaleString()}</div>
              <div style="font-size:9px;color:${meetsConditions ? "var(--success)" : "var(--danger)"};">${meetsConditions ? "✅ 可执行" : "❌ 条件不足"}</div>
            </div>
          </div>
        </div>
      `;
    }
    prActionsHtml += "</div></div>";
  }

  // 媒体关系管理行动
  let mediaActionsHtml = "";
  if (MEDIA_RELATION_ACTIONS) {
    mediaActionsHtml = '<div style="margin-bottom:12px;">';
    mediaActionsHtml +=
      '<div style="font-size:12px;font-weight:bold;margin-bottom:8px;">🤝 媒体关系管理</div>';
    mediaActionsHtml +=
      '<div style="display:flex;flex-direction:column;gap:4px;">';

    for (const [key, action] of Object.entries(MEDIA_RELATION_ACTIONS)) {
      const canAfford = company.cashReserve >= action.cost;

      // 检查冷却
      let cooldownText = "";
      let cooldownActive = false;
      if (company.lastMediaAction && company.lastMediaAction.actionId === key) {
        const daysSinceLast = state.player.day - company.lastMediaAction.day;
        if (daysSinceLast < action.cooldown) {
          cooldownActive = true;
          cooldownText = `冷却中 (${action.cooldown - daysSinceLast}天)`;
        }
      }

      const disabled = !canAfford || cooldownActive;
      const btnClass = disabled
        ? ""
        : "onclick=\"executeMediaRelationActionFromModal('" +
          key +
          "')\" onmouseover=\"this.style.borderColor='var(--accent)';this.style.background='var(--bg-card-hover)';this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px var(--accent-glow)';\" onmouseout=\"this.style.borderColor='var(--border)';this.style.background='var(--bg-card)';this.style.transform='none';this.style.boxShadow='none';\"";

      mediaActionsHtml += `
        <div style="padding:10px;background:${disabled ? "rgba(0,0,0,0.05)" : "var(--bg-card)"};border-radius:6px;border:1px solid ${disabled ? "var(--border)" : "transparent"};opacity:${disabled ? 0.5 : 1};${disabled ? "" : "cursor:pointer;transition:all 0.2s;"}" ${btnClass}>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:12px;font-weight:bold;">${action.icon} ${action.name}</div>
              <div style="font-size:10px;color:var(--text-secondary);margin-top:2px;">${action.desc}</div>
              ${cooldownText ? `<div style="font-size:9px;color:var(--warning);margin-top:2px;">⏰ ${cooldownText}</div>` : ""}
            </div>
            <div style="text-align:right;">
              <div style="font-size:12px;font-weight:bold;color:${canAfford ? "var(--accent)" : "var(--danger)"};">¥${action.cost.toLocaleString()}</div>
              <div style="font-size:9px;color:${disabled ? "var(--danger)" : "var(--success)"};">${cooldownText || (canAfford ? "✅ 可执行" : "❌ 现金不足")}</div>
            </div>
          </div>
        </div>
      `;
    }
    mediaActionsHtml += "</div></div>";
  }

  const bodyHtml = `
    <div style="font-size:13px;max-height:70vh;overflow-y:auto;">
      ${mediaLevelHtml}
      ${crisisHtml}
      ${pendingCrisisHtml}
      ${prActionsHtml}
      ${mediaActionsHtml}
      ${recentEventsHtml}
    </div>
  `;

  if (typeof showModal !== "function") return { success: true };

  showModal({
    title: "📰 公关/媒体管理",
    body: bodyHtml,
    buttons: [
      {
        text: "关闭",
        cls: "",
        callback: function () {},
      },
    ],
  });

  return { success: true };
}

/** 显示危机应对弹窗 */
function showCrisisResponseModal(crisisId) {
  const state = StateManager.getState();
  const company = state.startup.company;
  if (!company || !company.pendingCrisisEvent) return;

  const crisis = company.pendingCrisisEvent;
  if (crisis.id !== crisisId) return;

  const eventTemplate = PR_EVENT_TEMPLATES[crisis.event.type];
  if (!eventTemplate) return;

  const options = getAvailableCrisisResponses(crisis.event.type);

  let html = '<div style="font-size:13px;">';
  html += '<p style="color:var(--text-secondary);margin-bottom:12px;">';
  html += `${crisis.event.icon} <strong>${crisis.event.title}</strong>`;
  html += `（严重程度：${crisis.event.severity === "high" ? "🔴 严重" : crisis.event.severity === "medium" ? "🟡 中等" : "🟢 轻微"}）`;
  html += "</p>";
  html += '<div style="display:flex;flex-direction:column;gap:8px;">';

  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    const canAfford = company.cashReserve >= opt.cost;

    html += `
      <div style="padding:12px;background:${canAfford ? "var(--bg-card)" : "rgba(0,0,0,0.05)"};border-radius:8px;border:1px solid ${canAfford ? "var(--border)" : "var(--border)"};opacity:${canAfford ? 1 : 0.5};${canAfford ? "cursor:pointer;transition:all 0.2s;" : ""} ${canAfford ? "onmouseover=\"this.style.borderColor='var(--accent)';this.style.background='var(--bg-card-hover)';this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px var(--accent-glow)';\" onmouseout=\"this.style.borderColor='var(--border)';this.style.background='var(--bg-card)';this.style.transform='none';this.style.boxShadow='none';\"" : ""} onclick="${canAfford ? `resolveCrisisActionFromModal(${i})` : ""}">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:13px;font-weight:bold;">${opt.label}</div>
            <div style="font-size:10px;color:var(--text-secondary);margin-top:2px;">${opt.desc}</div>
            <div style="font-size:9px;color:var(--text-muted);margin-top:2px;">风险：${opt.risk}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:12px;font-weight:bold;color:${canAfford ? "var(--accent)" : "var(--danger)"};">${opt.cost > 0 ? "¥" + opt.cost.toLocaleString() : "免费"}</div>
            <div style="font-size:9px;color:${canAfford ? "var(--success)" : "var(--danger)"};">${canAfford ? "✅ 可执行" : "❌ 现金不足"}</div>
          </div>
        </div>
        <div style="font-size:9px;color:var(--success);margin-top:4px;">效果：${Object.entries(
          opt.effect,
        )
          .map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`)
          .join(", ")}</div>
      </div>
    `;
  }

  html += "</div></div>";

  if (typeof showModal !== "function") return;

  const daysRemaining = crisis.deadline - state.player.day;

  showModal({
    title: `${crisis.event.icon} 【危机应对】${crisis.event.title}`,
    body: html,
    buttons: [
      {
        text: `关闭（剩余${daysRemaining}天）`,
        cls: "",
        callback: function () {},
      },
    ],
  });
}

// ====== P1-8: 法律/合规管理弹窗 ======

/** 显示法律/合规管理面板 */
function showLegalComplianceModal(state) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  // 法律风险摘要
  const legalRiskInfo = getLegalRiskLevelInfo(company.legalRiskLevel);
  const complianceInfo = getComplianceGradeInfo(company.complianceGrade);

  // 法律风险等级显示
  const legalRiskHtml = `
    <div style="padding:12px;margin-bottom:12px;background:var(--bg-secondary);border-radius:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:bold;">⚖️ 法律风险</div>
        <div style="font-size:11px;color:${legalRiskInfo.color};font-weight:bold;">${legalRiskInfo.icon} ${legalRiskInfo.name}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="flex:1;height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${company.legalRisk}%;background:${legalRiskInfo.color};border-radius:4px;transition:width 0.3s;"></div>
        </div>
        <div style="font-size:14px;font-weight:bold;color:${legalRiskInfo.color};">${company.legalRisk}%</div>
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">${legalRiskInfo.description}</div>
    </div>
  `;

  // 合规等级显示
  const complianceHtml = `
    <div style="padding:12px;margin-bottom:12px;background:var(--bg-secondary);border-radius:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:bold;">📋 合规等级</div>
        <div style="font-size:11px;color:${complianceInfo.color};font-weight:bold;">${complianceInfo.icon} ${complianceInfo.name}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="flex:1;height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${company.complianceLevel}%;background:${complianceInfo.color};border-radius:4px;transition:width 0.3s;"></div>
        </div>
        <div style="font-size:14px;font-weight:bold;color:${complianceInfo.color};">${company.complianceLevel}%</div>
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">${complianceInfo.description}</div>
    </div>
  `;

  // 法律预算
  const legalBudgetHtml = `
    <div style="padding:12px;margin-bottom:12px;background:var(--bg-secondary);border-radius:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:13px;font-weight:bold;">💰 法律预算</div>
        <div style="font-size:12px;color:var(--accent);">¥${company.legalBudget.toLocaleString()}</div>
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">已花费：¥${company.legalSpent.toLocaleString()} | 专利数：${company.patentCount} | 活跃案件：${company.legalCasesActive}</div>
    </div>
  `;

  // 待处理法律事件
  let pendingLegalHtml = "";
  if (company.pendingLegalEvent) {
    const legalEvent = company.pendingLegalEvent;
    const daysRemaining = Math.max(0, legalEvent.deadline - state.player.day);
    const urgencyColor =
      daysRemaining <= 14
        ? "var(--danger)"
        : daysRemaining <= 21
          ? "var(--warning)"
          : "var(--text-secondary)";
    const riskTypeInfo = LEGAL_RISK_TYPES[legalEvent.riskType];

    pendingLegalHtml = `
      <div style="padding:12px;margin-bottom:12px;background:var(--bg-warning);border-radius:8px;border-left:4px solid var(--danger);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="font-size:13px;font-weight:bold;color:var(--danger);">${riskTypeInfo?.icon || "⚖️"} 【待处理法律事件】${legalEvent.name}</div>
          <div style="font-size:11px;color:${urgencyColor};font-weight:bold;">剩余${daysRemaining}天</div>
        </div>
        <div style="font-size:10px;color:var(--text-secondary);">类型：${riskTypeInfo?.name || legalEvent.riskType} | 严重程度：${legalEvent.severity === "high" ? "🔴 严重" : legalEvent.severity === "medium" ? "🟡 中等" : "🟢 轻微"}</div>
        <div style="margin-top:8px;">
          <button class="btn btn-primary" onclick="showLegalResponseModal('${legalEvent.id}')">处理法律事件</button>
        </div>
      </div>
    `;
  }

  // 专利列表
  let patentsHtml = "";
  if (company.patents && company.patents.length > 0) {
    patentsHtml = '<div style="margin-bottom:12px;">';
    patentsHtml +=
      '<div style="font-size:12px;font-weight:bold;margin-bottom:8px;">📜 已申请专利</div>';
    patentsHtml +=
      '<div style="display:flex;flex-direction:column;gap:4px;max-height:200px;overflow-y:auto;">';

    for (const patent of company.patents) {
      const statusColor =
        patent.status === "granted"
          ? "var(--success)"
          : patent.status === "pending"
            ? "var(--warning)"
            : "var(--text-muted)";
      const statusIcon =
        patent.status === "granted"
          ? "✅"
          : patent.status === "pending"
            ? "⏳"
            : "❌";

      patentsHtml += `
        <div style="padding:8px;background:var(--bg-card);border-radius:6px;border-left:3px solid ${statusColor}">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:11px;font-weight:bold;">${statusIcon} ${patent.typeName}：${patent.name}</div>
            <div style="font-size:9px;color:var(--text-muted);">${patent.protectionYears}年</div>
          </div>
          <div style="font-size:9px;color:var(--text-secondary);margin-top:2px;">申请日：第${patent.applyDay}天${patent.grantDay ? ` | 授权日：第${patent.grantDay}天` : ""}</div>
        </div>
      `;
    }
    patentsHtml += "</div></div>";
  }

  // 合规检查清单
  let checklistHtml = "";
  const checklistItems = getLegalChecklistProgress(state);
  if (checklistItems.length > 0) {
    checklistHtml = '<div style="margin-bottom:12px;">';
    checklistHtml +=
      '<div style="font-size:12px;font-weight:bold;margin-bottom:8px;">✅ 合规检查清单</div>';
    checklistHtml +=
      '<div style="display:flex;flex-direction:column;gap:4px;">';

    for (const item of checklistItems) {
      const completed = item.completed;
      const canAfford = company.legalBudget >= item.cost;
      const disabled = completed || !canAfford;

      checklistHtml += `
        <div style="padding:8px;background:${completed ? "rgba(34,197,94,0.1)" : "var(--bg-card)"};border-radius:6px;border:1px solid ${completed ? "var(--success)" : "var(--border)"};opacity:${disabled ? 0.6 : 1};${!disabled ? "cursor:pointer;transition:all 0.2s;" : ""}${!disabled ? ` onmouseover="this.style.borderColor='var(--accent)';this.style.background='var(--bg-card-hover)';this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px var(--accent-glow)';" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg-card)';this.style.transform='none';this.style.boxShadow='none';"` : ""} ${!disabled ? `onclick="executeLegalChecklistActionFromModal('${item.id}')"` : ""}>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:11px;font-weight:bold;">${item.icon} ${item.name}</div>
              <div style="font-size:9px;color:var(--text-secondary);margin-top:2px;">${item.description}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px;font-weight:bold;color:${completed ? "var(--success)" : canAfford ? "var(--accent)" : "var(--danger)"};">${completed ? "✅ 已完成" : "¥" + item.cost.toLocaleString()}</div>
              <div style="font-size:8px;color:var(--text-muted);margin-top:2px;">${completed ? "第" + item.completedDay + "天完成" : canAfford ? "可执行" : "预算不足"}</div>
            </div>
          </div>
        </div>
      `;
    }
    checklistHtml += "</div></div>";
  }

  // 法律事件列表（机会类）
  let legalEventsHtml = "";
  const availableLegalEvents = getAvailableLegalEvents(state);
  if (availableLegalEvents.length > 0) {
    legalEventsHtml = '<div style="margin-bottom:12px;">';
    legalEventsHtml +=
      '<div style="font-size:12px;font-weight:bold;margin-bottom:8px;">🎯 法律合规行动</div>';
    legalEventsHtml +=
      '<div style="display:flex;flex-direction:column;gap:4px;">';

    for (const event of availableLegalEvents) {
      const canAfford = company.legalBudget >= event.cost;
      const disabled = !canAfford;

      legalEventsHtml += `
        <div style="padding:8px;background:${disabled ? "rgba(0,0,0,0.05)" : "var(--bg-card)"};border-radius:6px;border:1px solid ${disabled ? "var(--border)" : "transparent"};opacity:${disabled ? 0.5 : 1};${!disabled ? "cursor:pointer;transition:all 0.2s;" : ""}${!disabled ? ` onmouseover="this.style.borderColor='var(--accent)';this.style.background='var(--bg-card-hover)';this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px var(--accent-glow)';" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg-card)';this.style.transform='none';this.style.boxShadow='none';"` : ""} ${!disabled ? `onclick="executeLegalEventActionFromModal('${event.id}')"` : ""}>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:11px;font-weight:bold;">${event.icon} ${event.name}</div>
              <div style="font-size:9px;color:var(--text-secondary);margin-top:2px;">${event.desc}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px;font-weight:bold;color:${canAfford ? "var(--accent)" : "var(--danger)"};">¥${event.cost.toLocaleString()}</div>
              <div style="font-size:8px;color:${canAfford ? "var(--success)" : "var(--danger)"};">${canAfford ? "✅ 可执行" : "❌ 预算不足"}</div>
            </div>
          </div>
        </div>
      `;
    }
    legalEventsHtml += "</div></div>";
  }

  // 专利申请选项
  let patentAppsHtml = "";
  const industry = company.industry;
  const applicablePatents = Object.entries(PATENT_TYPES).filter(
    ([key, type]) => {
      return (
        type.categories.includes(industry) || type.categories.includes("all")
      );
    },
  );

  if (applicablePatents.length > 0) {
    patentAppsHtml = '<div style="margin-bottom:12px;">';
    patentAppsHtml +=
      '<div style="font-size:12px;font-weight:bold;margin-bottom:8px;">💡 申请专利</div>';
    patentAppsHtml +=
      '<div style="display:flex;flex-direction:column;gap:4px;">';

    for (const [key, type] of applicablePatents) {
      const canAfford = company.legalBudget >= type.cost;
      const disabled = !canAfford;

      patentAppsHtml += `
        <div style="padding:8px;background:${disabled ? "rgba(0,0,0,0.05)" : "var(--bg-card)"};border-radius:6px;border:1px solid ${disabled ? "var(--border)" : "transparent"};opacity:${disabled ? 0.5 : 1};${!disabled ? "cursor:pointer;transition:all 0.2s;" : ""}${!disabled ? ` onmouseover="this.style.borderColor='var(--accent)';this.style.background='var(--bg-card-hover)';this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px var(--accent-glow)';" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg-card)';this.style.transform='none';this.style.boxShadow='none';"` : ""} ${!disabled ? `onclick="applyPatentFromModal('${key}')"` : ""}>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:11px;font-weight:bold;">${type.icon} ${type.name}</div>
              <div style="font-size:9px;color:var(--text-secondary);margin-top:2px;">${type.description} · ${type.protectionYears}年保护</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px;font-weight:bold;color:${canAfford ? "var(--accent)" : "var(--danger)"};">¥${type.cost.toLocaleString()}</div>
              <div style="font-size:8px;color:${canAfford ? "var(--success)" : "var(--danger)"};">${canAfford ? "✅ 可申请" : "❌ 预算不足"}</div>
            </div>
          </div>
        </div>
      `;
    }
    patentAppsHtml += "</div></div>";
  }

  // 法律保险选项
  let insuranceHtml = "";
  if (!company.legalInsurance) {
    insuranceHtml = '<div style="margin-bottom:12px;">';
    insuranceHtml +=
      '<div style="font-size:12px;font-weight:bold;margin-bottom:8px;">🛡️ 法律保险</div>';
    insuranceHtml +=
      '<div style="display:flex;flex-direction:column;gap:4px;">';

    const insuranceLevels = [
      { level: 1, name: "基础保险", cost: 50000, desc: "覆盖基础法律咨询" },
      { level: 2, name: "标准保险", cost: 150000, desc: "覆盖诉讼费用50%" },
      { level: 3, name: "高级保险", cost: 300000, desc: "覆盖诉讼费用80%" },
    ];

    for (const ins of insuranceLevels) {
      const canAfford = company.legalBudget >= ins.cost;
      const disabled = !canAfford;

      insuranceHtml += `
        <div style="padding:8px;background:${disabled ? "rgba(0,0,0,0.05)" : "var(--bg-card)"};border-radius:6px;border:1px solid ${disabled ? "var(--border)" : "transparent"};opacity:${disabled ? 0.5 : 1};${!disabled ? "cursor:pointer;transition:all 0.2s;" : ""}${!disabled ? ` onmouseover="this.style.borderColor='var(--accent)';this.style.background='var(--bg-card-hover)';this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px var(--accent-glow)';" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg-card)';this.style.transform='none';this.style.boxShadow='none';"` : ""} ${!disabled ? `onclick="buyLegalInsuranceFromModal(${ins.level})"` : ""}>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:11px;font-weight:bold;">🛡️ ${ins.name}</div>
              <div style="font-size:9px;color:var(--text-secondary);margin-top:2px;">${ins.desc}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px;font-weight:bold;color:${canAfford ? "var(--accent)" : "var(--danger)"};">¥${ins.cost.toLocaleString()}</div>
              <div style="font-size:8px;color:${canAfford ? "var(--success)" : "var(--danger)"};">${canAfford ? "✅ 可购买" : "❌ 预算不足"}</div>
            </div>
          </div>
        </div>
      `;
    }
    insuranceHtml += "</div></div>";
  } else {
    insuranceHtml = `
      <div style="padding:8px;margin-bottom:12px;background:var(--bg-success);border-radius:6px;">
        <div style="font-size:11px;font-weight:bold;color:var(--success);">🛡️ 已购买法律保险（${company.legalInsuranceLevel === 1 ? "基础" : company.legalInsuranceLevel === 2 ? "标准" : "高级"}）</div>
      </div>
    `;
  }

  // 监管机构关系
  let regulatoryHtml = "";
  if (company.regulatoryRelationship > 0) {
    regulatoryHtml = `
      <div style="padding:12px;margin-bottom:12px;background:var(--bg-secondary);border-radius:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="font-size:13px;font-weight:bold;">🏛️ 监管机构关系</div>
          <div style="font-size:11px;color:var(--accent);">${company.regulatoryRelationship}%</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="flex:1;height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden;">
            <div style="height:100%;width:${company.regulatoryRelationship}%;background:var(--accent);border-radius:4px;transition:width 0.3s;"></div>
          </div>
        </div>
      </div>
    `;
  }

  const bodyHtml = `
    <div style="font-size:13px;max-height:70vh;overflow-y:auto;">
      ${legalRiskHtml}
      ${complianceHtml}
      ${legalBudgetHtml}
      ${pendingLegalHtml}
      ${checklistHtml}
      ${legalEventsHtml}
      ${patentAppsHtml}
      ${patentsHtml}
      ${insuranceHtml}
      ${regulatoryHtml}
    </div>
  `;

  if (typeof showModal !== "function") return { success: true };

  showModal({
    title: "⚖️ 法律/合规管理",
    body: bodyHtml,
    buttons: [
      {
        text: "关闭",
        cls: "",
        callback: function () {},
      },
    ],
  });

  return { success: true };
}

/** 显示法律事件应对弹窗 */
function showLegalResponseModal(eventId) {
  const state = StateManager.getState();
  // [全系统自洽修复] 域E A类#1: state.startup 可能未定义（Phase1玩家/旧存档），导致 .company 裸访问→TypeError
  if (!state || !state.startup || !state.startup.company) return;
  const company = state.startup.company;
  if (!company || !company.pendingLegalEvent) return;

  const legalEvent = company.pendingLegalEvent;
  if (legalEvent.id !== eventId) return;

  const eventTemplate = LEGAL_EVENT_TEMPLATES[legalEvent.eventTemplateId];
  if (!eventTemplate || !eventTemplate.responseOptions) return;

  const options = getAvailableLegalResponses(eventTemplate.id);

  let html = '<div style="font-size:13px;">';
  html += '<p style="color:var(--text-secondary);margin-bottom:12px;">';
  html += `${eventTemplate.icon} <strong>${legalEvent.name}</strong>`;
  html += `（类型：${LEGAL_RISK_TYPES[legalEvent.riskType]?.name || legalEvent.riskType} | 严重程度：${legalEvent.severity === "high" ? "🔴 严重" : legalEvent.severity === "medium" ? "🟡 中等" : "🟢 轻微"}）`;
  html += "</p>";
  html += '<div style="display:flex;flex-direction:column;gap:8px;">';

  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    const canAfford = company.legalBudget >= opt.cost;

    html += `
      <div style="padding:12px;background:${canAfford ? "var(--bg-card)" : "rgba(0,0,0,0.05)"};border-radius:8px;border:1px solid ${canAfford ? "var(--border)" : "var(--border)"};opacity:${canAfford ? 1 : 0.5};${canAfford ? "cursor:pointer;transition:all 0.2s;" : ""} ${canAfford ? "onmouseover=\"this.style.borderColor='var(--accent)';this.style.background='var(--bg-card-hover)';this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px var(--accent-glow)';\" onmouseout=\"this.style.borderColor='var(--border)';this.style.background='var(--bg-card)';this.style.transform='none';this.style.boxShadow='none';\"" : ""} onclick="${canAfford ? `resolveLegalActionFromModal(${i})` : ""}">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:13px;font-weight:bold;">${opt.label}</div>
            <div style="font-size:10px;color:var(--text-secondary);margin-top:2px;">${opt.desc}</div>
            <div style="font-size:9px;color:var(--text-muted);margin-top:2px;">风险：${opt.risk}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:12px;font-weight:bold;color:${canAfford ? "var(--accent)" : "var(--danger)"};">${opt.cost > 0 ? "¥" + opt.cost.toLocaleString() : "免费"}</div>
            <div style="font-size:9px;color:${canAfford ? "var(--success)" : "var(--danger)"};">${canAfford ? "✅ 可执行" : "❌ 预算不足"}</div>
          </div>
        </div>
        <div style="font-size:9px;color:var(--success);margin-top:4px;">效果：${Object.entries(
          opt.effect,
        )
          .map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`)
          .join(", ")}</div>
      </div>
    `;
  }

  html += "</div></div>";

  if (typeof showModal !== "function") return;

  const daysRemaining = legalEvent.deadline - state.player.day;

  showModal({
    title: `${eventTemplate.icon} 【法律事件应对】${legalEvent.name}`,
    body: html,
    buttons: [
      {
        text: `关闭（剩余${daysRemaining}天）`,
        cls: "",
        callback: function () {},
      },
    ],
  });
}

// ====== P1-9: 竞争对手策略应对弹窗 ======

/** 显示竞争对手防御面板 */
function showCompetitorDefenseModal(state) {
  // [全系统自洽修复] 域E A类#2: state.startup 可能未定义，导致 .company 裸访问→TypeError
  if (!state || !state.startup || !state.startup.company)
    return { success: false, message: "没有公司" };
  const company = state.startup.company;

  const competitors = state.startup.competitors || [];
  const activeAttacks = company.activeCompetitorAttacks || [];
  const defenseInfo = getCompetitorDefenseLevelInfo(
    company.competitorDefenseLevel,
  );

  let html = '<div style="font-size:13px;max-height:70vh;overflow-y:auto;">';

  // 防御等级
  html += `
    <div style="padding:12px;margin-bottom:12px;background:var(--bg-secondary);border-radius:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:bold;">🛡️ 竞争防御等级</div>
        <div style="font-size:11px;color:${defenseInfo.color};font-weight:bold;">${defenseInfo.icon} ${defenseInfo.name}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="flex:1;height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${company.competitorDefenseLevel}%;background:${defenseInfo.color};border-radius:4px;transition:width 0.3s;"></div>
        </div>
        <div style="font-size:14px;font-weight:bold;color:${defenseInfo.color};">${company.competitorDefenseLevel}%</div>
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">${defenseInfo.description}</div>
    </div>
  `;

  // 活跃攻击
  if (activeAttacks.length > 0) {
    html += '<div style="margin-bottom:12px;">';
    html +=
      '<div style="font-size:13px;font-weight:bold;margin-bottom:8px;">⚔️ 活跃攻击（' +
      activeAttacks.length +
      "个）</div>";
    html += '<div style="display:flex;flex-direction:column;gap:8px;">';

    for (let i = 0; i < activeAttacks.length; i++) {
      const attack = activeAttacks[i];
      const attackType = COMPETITOR_ATTACK_TYPES[attack.attackType];
      const severityColor = getAttackSeverityColor(attack.severity);
      const urgencyColor = getAttackUrgencyColor(attack.urgency);

      html += `
        <div style="padding:12px;background:var(--bg-card);border-radius:8px;border:1px solid var(--border);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <div style="font-size:13px;font-weight:bold;">${attack.icon} ${attack.name}</div>
            <div style="font-size:10px;">
              <span style="color:${severityColor};margin-right:6px;">严重程度：${attack.severity}/5</span>
              <span style="color:${urgencyColor};">紧急度：${attack.urgency === "critical" ? "🔴 紧急" : attack.urgency === "high" ? "🟠 高" : "🟡 中"}</span>
            </div>
          </div>
          <div style="font-size:10px;color:var(--text-secondary);margin-bottom:4px;">
            来自：「${attack.competitorName}」 | 剩余：${attack.remainingDays}天
          </div>
          <div style="font-size:10px;color:var(--text-muted);margin-bottom:8px;">
            ${attack.description}
          </div>
          <div style="font-size:9px;color:var(--text-muted);margin-bottom:8px;">
            影响：${Object.entries(attack.effects || {})
              .map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`)
              .join(", ")}
          </div>
          <div style="font-size:11px;font-weight:bold;margin-bottom:6px;">应对方案：</div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">
      `;

      const responses = getAvailableCompetitorResponses(attack.attackType);
      let firstResponseId = null;

      for (const [respId, resp] of Object.entries(responses)) {
        if (!firstResponseId) firstResponseId = respId;
        const canAfford =
          company.cashReserve >=
          (company.revenue > 0 ? company.revenue * resp.costMult : 10000);
        html += `
          <div style="padding:8px;background:${canAfford ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.05)"};border-radius:6px;border:1px solid ${canAfford ? "var(--border)" : "var(--border)"};opacity:${canAfford ? 1 : 0.5};${canAfford ? "cursor:pointer;transition:all 0.2s;" : ""} ${canAfford ? `onmouseover="this.style.borderColor='var(--accent)';this.style.background='var(--bg-card-hover)';this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px var(--accent-glow)';" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg-card)';this.style.transform='none';this.style.boxShadow='none';"` : ""} onclick="${canAfford ? `handleCompetitorResponse(${i}, '${respId}')` : ""}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="font-size:11px;font-weight:bold;">${resp.icon} ${resp.name}</div>
              <div style="font-size:9px;color:${canAfford ? "var(--success)" : "var(--danger)"};">${canAfford ? "✅" : "❌"}</div>
            </div>
            <div style="font-size:9px;color:var(--text-muted);margin-top:2px;">${resp.desc}</div>
            <div style="font-size:8px;color:var(--text-muted);margin-top:2px;">成功率：${Math.round(resp.successChance * 100)}%</div>
          </div>
        `;
      }

      html += "</div>";

      // 快速应对按钮（选择第一个可承受的方案）
      if (firstResponseId) {
        const firstResp = responses[firstResponseId];
        const cost =
          company.revenue > 0 ? company.revenue * firstResp.costMult : 10000;
        if (company.cashReserve >= cost) {
          html += `
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">
              <button class="btn btn-primary" style="font-size:10px;padding:4px 12px;" onclick="handleCompetitorResponse(${i}, '${firstResponseId}')">
                快速应对：${firstResp.name}（¥${Math.round(cost).toLocaleString()}）
              </button>
            </div>
          `;
        }
      }

      html += "</div>";
    }

    html += "</div></div>";
  } else {
    html += `
      <div style="padding:12px;margin-bottom:12px;background:var(--bg-secondary);border-radius:8px;">
        <div style="font-size:13px;font-weight:bold;color:var(--success);">✅ 暂无活跃攻击</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">竞争对手暂时处于观望状态</div>
      </div>
    `;
  }

  // 竞争情报
  html += `
    <div style="padding:12px;margin-bottom:12px;background:var(--bg-secondary);border-radius:8px;">
      <div style="font-size:13px;font-weight:bold;margin-bottom:8px;">📊 竞争情报（等级 ${company.competitiveIntelligence}/100）</div>
      <div style="font-size:10px;color:var(--text-secondary);">
        情报等级越高，越能提前预警竞争对手动向，降低攻击成功率。
      </div>
      <div style="margin-top:8px;">
        <button class="btn btn-primary" style="font-size:11px;padding:6px 16px;" onclick="buyCompetitiveIntelligenceFromModal(1)">
          购买情报 ¥5,000（+5）
        </button>
        <button class="btn btn-primary" style="font-size:11px;padding:6px 16px;margin-left:8px;" onclick="buyCompetitiveIntelligenceFromModal(2)">
          深度调研 ¥20,000（+15）
        </button>
        <button class="btn btn-primary" style="font-size:11px;padding:6px 16px;margin-left:8px;" onclick="buyCompetitiveIntelligenceFromModal(3)">
          专家咨询 ¥50,000（+30）
        </button>
      </div>
    </div>
  `;

  // 防御投资
  html += `
    <div style="padding:12px;margin-bottom:12px;background:var(--bg-secondary);border-radius:8px;">
      <div style="font-size:13px;font-weight:bold;margin-bottom:8px;">💰 防御投资</div>
      <div style="font-size:10px;color:var(--text-secondary);margin-bottom:8px;">
        投入资金提升防御等级，降低攻击效果。
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-primary" style="font-size:11px;padding:6px 12px;" onclick="investBrandDefenseFromModal(10000)">
          品牌防御 ¥10,000
        </button>
        <button class="btn btn-primary" style="font-size:11px;padding:6px 12px;" onclick="investBrandDefenseFromModal(50000)">
          品牌防御 ¥50,000
        </button>
        <button class="btn btn-primary" style="font-size:11px;padding:6px 12px;" onclick="investTalentRetentionFromModal(10000)">
          人才留任 ¥10,000
        </button>
        <button class="btn btn-primary" style="font-size:11px;padding:6px 12px;" onclick="investTalentRetentionFromModal(50000)">
          人才留任 ¥50,000
        </button>
      </div>
      <div style="font-size:9px;color:var(--text-muted);margin-top:8px;">
        品牌防御：¥${(company.brandDefenseBudget || 0).toLocaleString()} | 人才留任：¥${(company.talentRetentionFund || 0).toLocaleString()}
      </div>
    </div>
  `;

  // 市场份额趋势
  if (company.marketShareTrend && company.marketShareTrend.length > 0) {
    html += `
      <div style="padding:12px;background:var(--bg-secondary);border-radius:8px;">
        <div style="font-size:13px;font-weight:bold;margin-bottom:8px;">📈 市场份额趋势（近${company.marketShareTrend.length}天）</div>
        <div style="display:flex;align-items:flex-end;height:40px;gap:1px;">
    `;
    const maxShare = Math.max(...company.marketShareTrend, 1);
    for (let i = 0; i < company.marketShareTrend.length; i++) {
      const h = (company.marketShareTrend[i] / maxShare) * 30;
      const color =
        i >= company.marketShareTrend.length - 2
          ? company.marketShareTrend[i] > company.marketShareTrend[i - 1]
            ? "var(--success)"
            : "var(--danger)"
          : "var(--text-muted)";
      html += `<div style="flex:1;background:${color};height:${h}px;border-radius:1px 1px 0 0;" title="第${state.player.day - company.marketShareTrend.length + i + 1}天: ${company.marketShareTrend[i].toFixed(1)}%"></div>`;
    }
    html += `</div><div style="font-size:9px;color:var(--text-muted);margin-top:4px;">当前：${company.marketShareTrend[company.marketShareTrend.length - 1].toFixed(1)}%</div></div>`;
  }

  html += "</div>";

  if (typeof showModal !== "function") return;

  showModal({
    title: "🛡️ 竞争对手防御",
    body: html,
    buttons: [
      {
        text: "关闭",
        cls: "",
        callback: function () {},
      },
    ],
  });

  // 绑定全局函数
  window.handleCompetitorResponse = function (attackIndex, responseId) {
    const state = StateManager.getState();
    const attack = activeAttacks[attackIndex];
    if (!attack) {
      StateManager.addMessage("攻击已不存在", "warning");
      return;
    }
    const result = executeCompetitorResponse(state, attack, responseId);
    if (result.success) {
      StateManager.addMessage(
        result.message +
          (result.actualSuccess ? " 效果显著！" : " 效果一般。") +
          " 花费 ¥" +
          result.cost.toLocaleString(),
        result.actualSuccess ? "success" : "event",
      );
      renderAll();
    } else {
      StateManager.addMessage(result.message, "warning");
    }
  };

  window.buyCompetitiveIntelligenceFromModal = function (level) {
    const costs = { 1: 5000, 2: 20000, 3: 50000 };
    const bonuses = { 1: 5, 2: 15, 3: 30 };
    const cost = costs[level];
    const bonus = bonuses[level];
    const state = StateManager.getState();
    const company = state.startup.company;
    if (company.cashReserve < cost) {
      StateManager.addMessage("现金不足", "warning");
      return;
    }
    company.cashReserve -= cost;
    company.expenses += cost;
    company.competitiveIntelligence = Math.min(
      100,
      company.competitiveIntelligence + bonus,
    );
    StateManager.addMessage(
      `✅ 购买竞争情报 +${bonus}，花费 ¥${cost.toLocaleString()}`,
      "success",
    );
    renderAll();
  };

  window.investBrandDefenseFromModal = function (amount) {
    const state = StateManager.getState();
    const company = state.startup.company;
    if (company.cashReserve < amount) {
      StateManager.addMessage("现金不足", "warning");
      return;
    }
    company.cashReserve -= amount;
    company.expenses += amount;
    company.brandDefenseBudget = (company.brandDefenseBudget || 0) + amount;
    StateManager.addMessage(
      `✅ 品牌防御投资 ¥${amount.toLocaleString()}`,
      "success",
    );
    renderAll();
  };

  window.investTalentRetentionFromModal = function (amount) {
    const state = StateManager.getState();
    const company = state.startup.company;
    if (company.cashReserve < amount) {
      StateManager.addMessage("现金不足", "warning");
      return;
    }
    company.cashReserve -= amount;
    company.expenses += amount;
    company.talentRetentionFund = (company.talentRetentionFund || 0) + amount;
    StateManager.addMessage(
      `✅ 人才留任基金 ¥${amount.toLocaleString()}`,
      "success",
    );
    renderAll();
  };
}

/** 获取竞争防御等级信息 */
function getCompetitorDefenseLevelInfo(level) {
  if (level >= 80)
    return {
      name: "坚不可摧",
      icon: "🛡️",
      color: "var(--success)",
      description: "竞争对手难以对你造成有效伤害",
    };
  if (level >= 60)
    return {
      name: "防御坚固",
      icon: "🔒",
      color: "#27ae60",
      description: "能有效抵御大部分竞争对手攻击",
    };
  if (level >= 40)
    return {
      name: "有一定防御",
      icon: "⚔️",
      color: "#f39c12",
      description: "能部分抵御攻击，但仍需加强",
    };
  if (level >= 20)
    return {
      name: "防御薄弱",
      icon: "🛡️",
      color: "#e67e22",
      description: "容易被竞争对手突破",
    };
  return {
    name: "无防御",
    icon: "❌",
    color: "var(--danger)",
    description: "完全暴露在竞争对手面前",
  };
}

/** 从行动列表执行竞争对手应对 */
function executeCompetitorResponseFromAction(state, attackIndex, responseId) {
  const company = state.startup.company;
  if (
    !company ||
    !company.activeCompetitorAttacks ||
    !company.activeCompetitorAttacks[attackIndex]
  ) {
    return { success: false, message: "没有活跃攻击" };
  }
  const attack = company.activeCompetitorAttacks[attackIndex];
  return executeCompetitorResponse(state, attack, responseId);
}

/** 投资品牌防御 */
function investBrandDefense(state, amount) {
  const company = state.startup.company;
  if (!company || company.cashReserve < amount) {
    return { success: false, message: "现金不足" };
  }
  company.cashReserve -= amount;
  company.expenses += amount;
  company.brandDefenseBudget = (company.brandDefenseBudget || 0) + amount;
  return { success: true, message: "品牌防御投资成功" };
}

/** 投资人才留任 */
function investTalentRetention(state, amount) {
  const company = state.startup.company;
  if (!company || company.cashReserve < amount) {
    return { success: false, message: "现金不足" };
  }
  company.cashReserve -= amount;
  company.expenses += amount;
  company.talentRetentionFund = (company.talentRetentionFund || 0) + amount;
  return { success: true, message: "人才留任基金投资成功" };
}

/** 购买竞争情报 */
function buyCompetitiveIntelligence(state, level) {
  const company = state.startup.company;
  const costs = { 1: 5000, 2: 20000, 3: 50000 };
  const bonuses = { 1: 5, 2: 15, 3: 30 };
  const cost = costs[level];
  const bonus = bonuses[level];
  if (!company || company.cashReserve < cost) {
    return { success: false, message: "现金不足" };
  }
  company.cashReserve -= cost;
  company.expenses += cost;
  company.competitiveIntelligence = Math.min(
    100,
    company.competitiveIntelligence + bonus,
  );
  return { success: true, message: "购买竞争情报成功，情报等级 +" + bonus };
}

// ====== P1-10: 危机事件管理弹窗 ======

/** 显示危机管理面板 */
function showCrisisManagementModal(state) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const activeCrises = company.activeCrisisEvents || [];
  const resilienceInfo = getCrisisResilienceLevelInfo(
    company.crisisResilienceLevel,
  );

  let html = '<div style="font-size:13px;max-height:70vh;overflow-y:auto;">';

  // 危机韧性等级
  html += `
    <div style="padding:12px;margin-bottom:12px;background:var(--bg-secondary);border-radius:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:bold;">🛡️ 危机韧性等级</div>
        <div style="font-size:11px;color:${resilienceInfo.color};font-weight:bold;">${resilienceInfo.icon} ${resilienceInfo.name}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="flex:1;height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${company.crisisResilienceLevel}%;background:${resilienceInfo.color};border-radius:4px;transition:width 0.3s;"></div>
        </div>
        <div style="font-size:14px;font-weight:bold;color:${resilienceInfo.color};">${company.crisisResilienceLevel}%</div>
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">${resilienceInfo.description}</div>
    </div>
  `;

  // 无危机天数
  html += `
    <div style="padding:8px;margin-bottom:12px;background:var(--bg-secondary);border-radius:6px;">
      <div style="font-size:11px;">连续无危机天数：<strong style="color:var(--success);">${company.crisisFreeDays || 0}</strong> 天</div>
      <div style="font-size:9px;color:var(--text-muted);margin-top:2px;">上次危机：${company.lastCrisisDay ? "第" + company.lastCrisisDay + "天" : "从未"}</div>
    </div>
  `;

  // 活跃危机
  if (activeCrises.length > 0) {
    html += '<div style="margin-bottom:12px;">';
    html +=
      '<div style="font-size:13px;font-weight:bold;margin-bottom:8px;">⚠️ 活跃危机（' +
      activeCrises.length +
      "个）</div>";
    html += '<div style="display:flex;flex-direction:column;gap:8px;">';

    for (let i = 0; i < activeCrises.length; i++) {
      const crisis = activeCrises[i];
      const crisisType = CRISIS_EVENT_TYPES[crisis.crisisType];
      const severityColor = getCrisisSeverityColor(crisis.severity);
      const urgencyColor = getCrisisUrgencyColor(crisis.urgency);

      html += `
        <div style="padding:12px;background:var(--bg-card);border-radius:8px;border:1px solid var(--border);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <div style="font-size:13px;font-weight:bold;">${crisis.icon} ${crisis.name}</div>
            <div style="font-size:10px;">
              <span style="color:${severityColor};margin-right:6px;">严重程度：${crisis.severity}/5</span>
              <span style="color:${urgencyColor};">紧急度：${crisis.urgency === "critical" ? "🔴 紧急" : crisis.urgency === "high" ? "🟠 高" : "🟡 中"}</span>
            </div>
          </div>
          <div style="font-size:10px;color:var(--text-secondary);margin-bottom:4px;">
            类型：${crisisType ? crisisType.name : "未知"} | 剩余：${crisis.remainingDays}天
          </div>
          <div style="font-size:10px;color:var(--text-muted);margin-bottom:8px;">
            ${crisis.description}
          </div>
          <div style="font-size:9px;color:var(--text-muted);margin-bottom:8px;">
            影响：${Object.entries(crisis.effects || {})
              .map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`)
              .join(", ")}
          </div>
          <div style="font-size:11px;font-weight:bold;margin-bottom:6px;">应对方案：</div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">
      `;

      const responses = getAvailableCrisisResponses(crisis.id);
      let firstResponseId = null;

      for (const [respId, resp] of Object.entries(responses)) {
        if (!firstResponseId) firstResponseId = respId;
        const cost =
          company.revenue > 0 ? company.revenue * resp.costMult : 10000;
        const canAfford = company.cashReserve >= cost;
        html += `
          <div style="padding:8px;background:${canAfford ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.05)"};border-radius:6px;border:1px solid ${canAfford ? "var(--border)" : "var(--border)"};opacity:${canAfford ? 1 : 0.5};${canAfford ? "cursor:pointer;transition:all 0.2s;" : ""} ${canAfford ? `onmouseover="this.style.borderColor='var(--accent)';this.style.background='var(--bg-card-hover)';this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px var(--accent-glow)';" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg-card)';this.style.transform='none';this.style.boxShadow='none';"` : ""} onclick="${canAfford ? `handleCrisisResponse(${i}, '${respId}')` : ""}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="font-size:11px;font-weight:bold;">${resp.icon} ${resp.name}</div>
              <div style="font-size:9px;color:${canAfford ? "var(--success)" : "var(--danger)"};">${canAfford ? "✅" : "❌"}</div>
            </div>
            <div style="font-size:9px;color:var(--text-muted);margin-top:2px;">${resp.desc}</div>
            <div style="font-size:8px;color:var(--text-muted);margin-top:2px;">成功率：${Math.round(resp.successChance * 100)}% | 成本：¥${Math.round(cost).toLocaleString()}</div>
          </div>
        `;
      }

      html += "</div>";

      // 快速应对按钮
      if (firstResponseId) {
        const firstResp = CRISIS_RESPONSE_TEMPLATES[firstResponseId];
        const cost =
          company.revenue > 0 ? company.revenue * firstResp.costMult : 10000;
        if (company.cashReserve >= cost) {
          html += `
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">
              <button class="btn btn-primary" style="font-size:10px;padding:4px 12px;" onclick="handleCrisisResponse(${i}, '${firstResponseId}')">
                快速应对：${firstResp.name}（¥${Math.round(cost).toLocaleString()}）
              </button>
            </div>
          `;
        }
      }

      html += "</div>";
    }

    html += "</div></div>";
  } else {
    html += `
      <div style="padding:12px;margin-bottom:12px;background:var(--bg-secondary);border-radius:8px;">
        <div style="font-size:13px;font-weight:bold;color:var(--success);">✅ 暂无活跃危机</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">公司运营稳定，暂无重大危机</div>
      </div>
    `;
  }

  // 危机准备投资
  html += `
    <div style="padding:12px;margin-bottom:12px;background:var(--bg-secondary);border-radius:8px;">
      <div style="font-size:13px;font-weight:bold;margin-bottom:8px;">💰 危机准备投资</div>
      <div style="font-size:10px;color:var(--text-secondary);margin-bottom:8px;">
        提升危机准备度和韧性，降低危机发生概率和影响。
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-primary" style="font-size:11px;padding:6px 12px;" onclick="investCrisisPreparationFromModal(10000)">
          危机预案 ¥10,000
        </button>
        <button class="btn btn-primary" style="font-size:11px;padding:6px 12px;" onclick="investCrisisPreparationFromModal(50000)">
          危机预案 ¥50,000
        </button>
        <button class="btn btn-primary" style="font-size:11px;padding:6px 12px;" onclick="buyCrisisInsuranceFromModal(1)">
          危机保险 ¥20,000
        </button>
        <button class="btn btn-primary" style="font-size:11px;padding:6px 12px;" onclick="buyCrisisInsuranceFromModal(2)">
          危机保险 ¥50,000
        </button>
      </div>
    </div>
  `;

  // 危机历史
  if (company.crisisEventHistory && company.crisisEventHistory.length > 0) {
    html += `
      <div style="padding:12px;background:var(--bg-secondary);border-radius:8px;">
        <div style="font-size:13px;font-weight:bold;margin-bottom:8px;">📜 危机历史（${company.crisisEventHistory.length}次）</div>
        <div style="display:flex;flex-direction:column;gap:4px;">
    `;
    const recentCrises = company.crisisEventHistory.slice(-5).reverse();
    for (const c of recentCrises) {
      const successIcon = c.success ? "✅" : "🔶";
      html += `
        <div style="font-size:10px;padding:4px 8px;background:rgba(0,0,0,0.1);border-radius:4px;">
          ${successIcon} ${c.icon} ${c.name} | 第${c.startedDay}天 | ${c.response ? "已应对" : "未应对"} | 花费¥${c.cost ? c.cost.toLocaleString() : "0"}
        </div>
      `;
    }
    html += "</div></div>";
  }

  html += "</div>";

  if (typeof showModal !== "function") return;

  showModal({
    title: "🚨 危机管理",
    body: html,
    buttons: [
      {
        text: "关闭",
        cls: "",
        callback: function () {},
      },
    ],
  });

  // 绑定全局函数
  window.handleCrisisResponse = function (crisisIndex, responseId) {
    const state = StateManager.getState();
    const crisis = activeCrises[crisisIndex];
    if (!crisis) {
      StateManager.addMessage("危机已不存在", "warning");
      return;
    }
    const result = executeCrisisResponse(state, crisis, responseId);
    if (result.success) {
      StateManager.addMessage(
        result.message +
          (result.actualSuccess ? " 效果显著！" : " 效果一般。") +
          " 花费 ¥" +
          result.cost.toLocaleString(),
        result.actualSuccess ? "success" : "event",
      );
      renderAll();
    } else {
      StateManager.addMessage(result.message, "warning");
    }
  };

  window.investCrisisPreparationFromModal = function (amount) {
    const state = StateManager.getState();
    const company = state.startup.company;
    if (company.cashReserve < amount) {
      StateManager.addMessage("现金不足", "warning");
      return;
    }
    company.cashReserve -= amount;
    company.expenses += amount;
    company.crisisPreparationLevel = Math.min(
      100,
      (company.crisisPreparationLevel || 0) + Math.floor(amount / 5000),
    );
    StateManager.addMessage(
      `✅ 危机准备投资 ¥${amount.toLocaleString()}，准备度 +${Math.floor(amount / 5000)}`,
      "success",
    );
    renderAll();
  };

  window.buyCrisisInsuranceFromModal = function (level) {
    const costs = { 1: 20000, 2: 50000 };
    const cost = costs[level];
    const state = StateManager.getState();
    const company = state.startup.company;
    if (company.cashReserve < cost) {
      StateManager.addMessage("现金不足", "warning");
      return;
    }
    company.cashReserve -= cost;
    company.expenses += cost;
    company.crisisInsuranceLevel = Math.min(
      3,
      (company.crisisInsuranceLevel || 0) + level,
    );
    StateManager.addMessage(
      `✅ 购买危机保险（等级${company.crisisInsuranceLevel}），花费 ¥${cost.toLocaleString()}`,
      "success",
    );
    renderAll();
  };
}

/** 获取危机韧性等级信息 */
function getCrisisResilienceLevelInfo(level) {
  if (level >= 80)
    return {
      name: "坚如磐石",
      icon: "🏰",
      color: "var(--success)",
      description: "公司具备极强的危机应对能力",
    };
  if (level >= 60)
    return {
      name: "准备充分",
      icon: "🛡️",
      color: "#27ae60",
      description: "能有效应对大部分危机事件",
    };
  if (level >= 40)
    return {
      name: "有一定准备",
      icon: "⚠️",
      color: "#f39c12",
      description: "能部分应对危机，但仍有改进空间",
    };
  if (level >= 20)
    return {
      name: "准备不足",
      icon: "🔧",
      color: "#e67e22",
      description: "危机应对能力薄弱",
    };
  return {
    name: "毫无准备",
    icon: "❌",
    color: "var(--danger)",
    description: "完全暴露在危机风险中",
  };
}

/** 从行动列表执行危机应对 */
function executeCrisisResponseFromAction(state, crisisIndex, responseId) {
  const company = state.startup.company;
  if (
    !company ||
    !company.activeCrisisEvents ||
    !company.activeCrisisEvents[crisisIndex]
  ) {
    return { success: false, message: "没有活跃危机" };
  }
  const crisis = company.activeCrisisEvents[crisisIndex];
  return executeCrisisResponse(state, crisis, responseId);
}

/** 投资危机准备 */
function investCrisisPreparation(state, amount) {
  const company = state.startup.company;
  if (!company || company.cashReserve < amount) {
    return { success: false, message: "现金不足" };
  }
  company.cashReserve -= amount;
  company.expenses += amount;
  company.crisisPreparationLevel = Math.min(
    100,
    (company.crisisPreparationLevel || 0) + Math.floor(amount / 5000),
  );
  return { success: true, message: "危机准备投资成功" };
}

/** 购买危机保险 */
function buyCrisisInsurance(state, level) {
  const company = state.startup.company;
  const costs = { 1: 20000, 2: 50000 };
  const cost = costs[level];
  if (!company || company.cashReserve < cost) {
    return { success: false, message: "现金不足" };
  }
  company.cashReserve -= cost;
  company.expenses += cost;
  company.crisisInsuranceLevel = Math.min(
    3,
    (company.crisisInsuranceLevel || 0) + level,
  );
  return { success: true, message: "购买危机保险成功，等级 +" + level };
}

// ====== 执行创业行动 ======
function executeStartupAction(state, actionId, params) {
  params = params || {};

  switch (actionId) {
    case "develop_product":
      {
        const productId = params.productId;
        const effort = params.effort || 2;
        if (!productId) {
          // 自动选择第一个开发中的产品
          const company = state.startup.company;
          const developing = company?.products?.find(
            (p) => p.status === "developing",
          );
          if (!developing) {
            return { success: false, message: "没有正在开发的产品" };
          }
          return developProduct(state, developing.id, effort);
        }
        return developProduct(state, productId, effort);
      }
      break;

    case "launch_product":
      {
        const companyLP = state.startup.company;
        const readyProduct = companyLP?.products?.find(
          (p) => p.status === "ready_to_launch",
        );
        if (!readyProduct) {
          return { success: false, message: "没有可以发布的产品" };
        }
        return launchProduct(state, readyProduct.id);
      }
      break;

    case "create_product":
      showCreateProductModal(state);
      return { success: true, message: "" };

    case "hire_employee":
      return hireEmployee(state, params.role || "engineer", params.salary);

    case "meet_investor":
      return showMeetInvestorModal(state);

    case "raise_funding":
      return raiseFunding(state, params.round || "seed");

    case "marketing":
      return showMarketingModal(state);

    case "review_financials":
      return showFinancialReportModal(state);

    case "manage_team":
      return showTeamManagementModal(state);

    // P0-4: 满意度提升操作
    case "improve_satisfaction":
      return improveEmployeeSatisfaction(state, params.action, params);

    // P0-5: KPI/OKR 目标管理
    case "kpi_dashboard":
      return showKpiDashboard(state);

    // P1-6: 董事会管理
    case "board_management":
      return showBoardManagementModal(state);

    // P1-7: 公关/媒体管理
    case "pr_management":
      return showPRManagementModal(state);

    case "pr_event":
      return executePREvent(state, params.eventId);

    case "media_relation_action":
      return executeMediaRelationAction(state, params.actionId);

    case "crisis_response":
      return resolveCrisisEvent(state, params.optionIndex);

    // P1-8: 法律/合规管理
    case "legal_compliance":
      return showLegalComplianceModal(state);

    case "legal_checklist":
      return executeLegalChecklistAction(state, params.checklistId);

    case "apply_patent":
      return applyPatent(state, params.patentTypeId);

    case "buy_legal_insurance":
      return buyLegalInsurance(state, params.level);

    case "regulatory_communication":
      return regulatoryCommunication(state, params.actionType);

    case "legal_event":
      if (typeof executeLegalEventActionFromModal === "function") {
        return executeLegalEventActionFromModal(params.eventId);
      }
      StateManager.addMessage("⚠️ 法律事件模块未就绪。", "warning");
      return false;

    case "legal_response":
      if (typeof resolveLegalActionFromModal === "function") {
        return resolveLegalActionFromModal(params.optionIndex);
      }
      StateManager.addMessage("⚠️ 法律处理模块未就绪。", "warning");
      return false;

    // P1-9: 竞争对手策略应对
    case "competitor_defense":
      return showCompetitorDefenseModal(state);

    case "competitor_response":
      return executeCompetitorResponseFromAction(
        state,
        params.attackIndex,
        params.responseId,
      );

    case "brand_defense_invest":
      return investBrandDefense(state, params.amount);

    case "talent_retention_invest":
      return investTalentRetention(state, params.amount);

    case "competitive_intel":
      return buyCompetitiveIntelligence(state, params.level);

    // P1-10: 危机事件管理
    case "crisis_management":
      return showCrisisManagementModal(state);

    case "crisis_execute_response":
      return executeCrisisResponseFromAction(
        state,
        params.crisisIndex,
        params.responseId,
      );

    case "crisis_prep_invest":
      return investCrisisPreparation(state, params.amount);

    case "crisis_insurance":
      return buyCrisisInsurance(state, params.level);

    // P2-11: 办公地点系统
    case "office_upgrade":
      return upgradeOffice(state, params.targetLevel);

    case "office_downgrade":
      return downgradeOffice(state, params.targetLevel);

    case "office_management":
      return showOfficeManagementModal(state);

    // P2-12: 企业文化系统
    case "culture_change":
      return changeCulture(state, params.cultureId, params.reason);

    case "culture_adoption":
      return improveCultureAdoptionAction(state, params.amount);

    case "culture_management":
      return showCultureManagementModal(state);

    case "ipo_prep":
      return prepareIPO(state);

    default:
      return { success: false, message: "未知行动：" + actionId };
  }
}

// ====== 创建新产品弹窗（支持自定义产品名） ======
function showCreateProductModal(state) {
  const company = state.startup.company;
  if (!company) return;

  // 产品类别选择列表
  const catKeys = Object.keys(PRODUCT_CATEGORIES).slice(0, 6);
  let catHtml = catKeys
    .map(
      (k) =>
        `<label style="display:inline-block;margin:4px 6px 4px 0;padding:6px 10px;border:1px solid var(--border);border-radius:6px;cursor:pointer;font-size:12px;background:var(--bg-card);">
          <input type="radio" name="prod-category" value="${k}" ${k === "app" ? "checked" : ""} style="margin-right:4px;">
          ${PRODUCT_CATEGORIES[k].icon} ${PRODUCT_CATEGORIES[k].name}
        </label>`,
    )
    .join("");

  var bodyHtml =
    '<div style="font-size:13px;">' +
    "<p>启动新产品的开发计划。给你的产品取个名字吧！</p>" +
    '<div style="margin:12px 0;">' +
    '<label style="font-weight:600;font-size:12px;">📝 产品名称</label>' +
    '<input id="new-product-name" type="text" placeholder="输入产品名称（可选）" maxlength="20" style="width:100%;padding:8px;margin-top:4px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text-primary);font-size:13px;">' +
    "</div>" +
    '<div style="margin:12px 0;">' +
    '<label style="font-weight:600;font-size:12px;">📋 产品类别</label>' +
    '<div style="margin-top:6px;">' +
    catHtml +
    "</div>" +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-muted);margin-top:8px;">产品开发需要消耗行动力和开发周期，确定后会立即开始开发。</div>' +
    "</div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "🆕 创建新产品",
    body: bodyHtml,
    width: "420px",
    buttons: [
      { text: "取消", cls: "", callback: function () {} },
      {
        text: "✅ 开始开发",
        cls: "btn-primary",
        callback: function () {
          var nameInput = document.getElementById("new-product-name");
          var name = nameInput ? nameInput.value.trim() : "";
          var selected = document.querySelector(
            'input[name="prod-category"]:checked',
          );
          var category = selected ? selected.value : "app";
          var result = createProduct(state, name || null, category);
          if (result.success) {
            StateManager.addMessage(
              result.message || "产品开始开发！",
              "success",
            );
            if (typeof renderAll === "function") renderAll();
            if (typeof renderStartupTab === "function")
              renderStartupTab(
                state,
                document.getElementById("startup-content"),
              );
            return true;
          } else {
            StateManager.addMessage(result.message || "创建失败", "warning");
            return false;
          }
        },
      },
    ],
  });
}

// ====== 功能模块开发弹窗 ======
function showFeatureDevelopmentModal(state) {
  const company = state.startup.company;
  if (!company) return;

  // 找已发布的产品
  const launchedProducts = company.products.filter(
    (p) => p.status === "launched",
  );
  if (launchedProducts.length === 0) {
    StateManager.addMessage("没有已发布的产品", "warning");
    return;
  }

  // 构建弹窗内容
  let html = '<div style="font-size:13px;max-height:60vh;overflow-y:auto;">';

  for (const product of launchedProducts) {
    const prodCategory = PRODUCT_CATEGORIES[product.category];
    const availableFeatures = getProductAvailableFeatures(product);

    html +=
      '<div style="margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border);">';
    html +=
      '<div style="font-weight:bold;color:var(--accent);margin-bottom:8px;">📦 ' +
      _esc(product.name) +
      ' <span style="font-size:10px;color:var(--text-muted);">(' +
      (prodCategory ? prodCategory.name : product.category) +
      ")</span></div>";

    if (availableFeatures.length === 0) {
      html +=
        '<div style="font-size:11px;color:var(--text-muted);">所有功能已开发完成 ✅</div>';
    } else {
      html +=
        '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">';
      for (const feat of availableFeatures) {
        const canAfford = company.cashReserve >= feat.cost;
        const onClick = canAfford
          ? "showDevelopFeatureConfirm('" +
            product.id +
            "','" +
            feat.key +
            "','" +
            feat.name +
            "'," +
            feat.cost +
            "," +
            feat.devTime +
            ")"
          : "";
        html +=
          '<div style="padding:8px;background:' +
          (canAfford ? "var(--bg-card)" : "rgba(0,0,0,0.1)") +
          ";border:1px solid " +
          (canAfford ? "var(--border)" : "#ccc") +
          ";border-radius:4px;" +
          (canAfford ? "cursor:pointer;transition:all 0.2s;" : "opacity:0.5;") +
          (canAfford
            ? "onmouseover=\"this.style.borderColor='var(--accent)';this.style.background='var(--bg-card-hover)';this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px var(--accent-glow)';\" onmouseout=\"this.style.borderColor='var(--border)';this.style.background='var(--bg-card)';this.style.transform='none';this.style.boxShadow='none';\""
            : "") +
          (onClick ? 'onclick="' + onClick + '"' : "") +
          ">" +
          '<div style="font-weight:bold;font-size:12px;">' +
          (feat.icon || "") +
          " " +
          _esc(feat.name) +
          "</div>" +
          '<div style="font-size:10px;color:var(--text-muted);margin:2px 0;">' +
          _esc(feat.desc) +
          "</div>" +
          '<div style="font-size:10px;">💰 ¥' +
          feat.cost.toLocaleString() +
          " | ⏱ " +
          feat.devTime +
          "天 | 技术+" +
          feat.techBonus +
          " 市场+" +
          feat.marketBonus +
          "</div>" +
          "</div>";
      }
      html += "</div>";
    }
    html += "</div>";
  }

  html += "</div>";

  if (typeof showModal !== "function") return;

  showModal({
    title: "🔧 开发功能模块",
    body: html,
    buttons: [{ text: "关闭", cls: "", callback: function () {} }],
  });
}

/** 市场调研弹窗 */
function showMarketResearchModal(state) {
  const company = state.startup.company;
  if (!company) return;

  let html =
    '<div style="font-size:13px;">' +
    '<p style="color:var(--text-secondary);margin-bottom:12px;">选择调研深度，获取竞争对手情报和市场洞察。</p>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';

  const actions =
    typeof MARKET_INTELLIGENCE_ACTIONS !== "undefined"
      ? MARKET_INTELLIGENCE_ACTIONS
      : [];
  for (const action of actions) {
    const canAfford = company.cashReserve >= action.cost;
    html +=
      '<div style="padding:10px;background:' +
      (canAfford ? "var(--bg-card)" : "rgba(0,0,0,0.1)") +
      ";border:1px solid " +
      (canAfford ? "var(--border)" : "#ccc") +
      ";border-radius:6px;" +
      (canAfford ? "cursor:pointer;transition:all 0.2s;" : "opacity:0.5;") +
      'onclick="' +
      (canAfford ? "performMarketResearchClick('" + action.id + "')" : "") +
      '" onmouseover="' +
      (canAfford ? "this.style.borderColor='var(--accent)';" : "") +
      '" onmouseout="' +
      (canAfford ? "this.style.borderColor='var(--border)';" : "") +
      '">' +
      '<div style="font-weight:bold;font-size:12px;margin-bottom:4px;">' +
      _esc(action.name) +
      "</div>" +
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">' +
      _esc(action.desc) +
      "</div>" +
      '<div style="font-size:10px;color:var(--danger);">💰 ¥' +
      action.cost.toLocaleString() +
      "</div>" +
      '<div style="font-size:9px;color:var(--text-muted);margin-top:4px;">获得：' +
      action.info.join(", ") +
      "</div>" +
      "</div>";
  }

  html += "</div></div>";

  if (typeof showModal !== "function") return;

  showModal({
    title: "📊 市场调研",
    body: html,
    buttons: [{ text: "关闭", cls: "", callback: function () {} }],
  });
}

/** 执行市场调研（从弹窗调用） */
function performMarketResearchClick(actionId) {
  const state = StateManager.getState();
  const result =
    typeof performMarketResearch === "function"
      ? performMarketResearch(state, actionId)
      : { success: false, message: "功能未加载" };

  if (result.success) {
    StateManager.addMessage("✅ 市场调研完成", "success");
    // 显示报告
    if (typeof showModal !== "function") return;
    showModal({
      title: "📋 调研报告",
      body:
        '<div style="font-size:13px;max-height:50vh;overflow-y:auto;">' +
        '<div style="padding:12px;background:var(--bg-secondary);border-radius:6px;font-size:12px;line-height:1.6;">' +
        _esc(result.report) +
        "</div>" +
        '<div style="margin-top:8px;font-size:11px;color:var(--text-muted);">花费：¥' +
        (result.action ? result.action.cost.toLocaleString() : "0") +
        "</div>" +
        "</div>",
      buttons: [
        { text: "知道了", cls: "btn-primary", callback: function () {} },
      ],
    });
    renderAll();
  } else {
    StateManager.addMessage("⚠️ " + result.message, "warning");
  }
}

/** 显示功能开发确认弹窗 */
function showDevelopFeatureConfirm(
  productId,
  featureKey,
  featureName,
  cost,
  devTime,
) {
  const state = StateManager.getState();
  const company = state.startup.company;

  if (typeof showModal !== "function") return;

  showModal({
    title: "确认开发功能",
    body:
      '<div style="font-size:13px;">' +
      "<p>确定要开发 <strong>" +
      _esc(featureName) +
      "</strong> 吗？</p>" +
      '<div style="padding:8px;background:var(--bg-secondary);border-radius:4px;margin:8px 0;font-size:11px;">' +
      "💰 费用：¥" +
      cost.toLocaleString() +
      "<br>" +
      "⏱ 开发周期：" +
      devTime +
      "天<br>" +
      "💡 完成后：技术分+5~12，市场分+2~10" +
      "</div>" +
      '<p style="font-size:11px;color:var(--text-muted);">开发期间无法修改或取消。</p>' +
      "</div>",
    buttons: [
      { text: "取消", cls: "", callback: function () {} },
      {
        text: "确认开发",
        cls: "btn-primary",
        callback: function () {
          const result = developFeature(state, productId, featureKey);
          if (result.success) {
            StateManager.addMessage("✅ " + result.message, "success");
          } else {
            StateManager.addMessage("⚠️ " + result.message, "warning");
          }
          renderAll();
        },
      },
    ],
  });
}

// ====== UI: 渲染创业Tab ======
function renderStartupTab(state, parent) {
  parent.innerHTML = "";

  var startup = state.startup;
  if (!startup || startup.status === "none") {
    // 剧本感知的触发条件
    var stc = getStartupTriggerConditions(state);
    var cashLabel = "¥" + stc.cashRequired.toLocaleString();
    var readinessNote =
      typeof getStartupReadinessNote === "function"
        ? getStartupReadinessNote(state)
        : "";
    var rankLabel = stc.rankRequired ? stc.rankRequired + "+" : "不限";
    if (stc.effectiveRank) {
      rankLabel += "（当前" + stc.effectiveRank + "）";
    }
    var phaseLabel = stc.phase === "corporate" ? "职场" : "街头";
    var cashNow = (state.resources && state.resources.cash) || 0;
    var cashColor =
      cashNow >= stc.cashRequired ? "var(--success)" : "var(--danger)";
    var cashStatus = cashNow >= stc.cashRequired ? "✅" : "⚠️";

    parent.innerHTML =
      '<div style="padding:30px 20px;text-align:center;color:var(--text-muted);">' +
      "<h3>🚀 创业系统</h3>" +
      '<p style="font-size:13px;color:var(--text-secondary);">你还没有注册公司。注册后可以招聘、融资、做产品。</p>' +
      '<div style="margin:16px auto;padding:14px;max-width:380px;background:var(--bg-card);border-radius:8px;border:1px solid var(--border);text-align:left;font-size:12px;">' +
      '<div style="font-weight:600;margin-bottom:10px;color:var(--text-primary);">📋 ' +
      (stc.label || "注册条件") +
      "</div>" +
      renderStartupConditionRows(canStartStartupDetailed(state)) +
      '<div style="margin-top:6px;">' +
      '<div style="display:flex;justify-content:space-between;padding:3px 0;"><span>💰 最低现金</span><span style="color:' +
      cashColor +
      ';">' +
      cashStatus +
      " " +
      cashLabel +
      "（当前¥" +
      cashNow.toLocaleString() +
      "）</span></div>" +
      '<div style="display:flex;justify-content:space-between;padding:3px 0;"><span>🏢 职级要求</span><span>' +
      rankLabel +
      "</span></div>" +
      '<div style="display:flex;justify-content:space-between;padding:3px 0;border-top:1px solid var(--border);margin-top:4px;padding-top:5px;"><span>💵 注册费</span><span>' +
      cashLabel +
      "</span></div>" +
      (stc.careerDiscount
        ? '<div style="font-size:11px;color:var(--accent);margin-top:6px;">职场资源已抵扣约 ' +
          Math.round(stc.careerDiscount * 100) +
          "% 启动资金</div>"
        : '<div style="font-size:11px;color:var(--text-muted);margin-top:6px;">还没累计职场资源：上班积累行业资源、客户线索可减免注册费</div>') +
      "</div>" +
      (readinessNote
        ? '<div style="margin:0 auto 12px;padding:10px;max-width:360px;background:rgba(74,158,92,0.06);border:1px solid rgba(74,158,92,0.18);border-radius:8px;text-align:left;font-size:12px;color:var(--text-secondary);">💼 ' +
          readinessNote +
          "</div>"
        : "") +
      '<button class="btn btn-lg btn-primary" onclick="showStartupRegisterModal()" ' +
      (stc.canRegister ? "" : 'style="opacity:0.5;" disabled') +
      ">" +
      (stc.canRegister ? "🚀 注册公司" : "🚀 注册公司（条件不足）") +
      "</button>" +
      '<div style="margin-top:12px;font-size:11px;color:var(--text-muted);">注册费 ' +
      cashLabel +
      "，满足资金" +
      (stc.rankRequired ? "和职级" : "") +
      "后即可注册</div>" +
      "</div>";
    return;
  }

  if (startup.flags.exited) {
    parent.innerHTML =
      '<div style="padding:40px;text-align:center;"><h3>📜 创业历史</h3><p>你的公司已经退出历史舞台。</p><p>退出类型：' +
      startup.flags.exitType +
      "</p><p>退出价值：¥" +
      (startup.flags.exitValue || 0).toLocaleString() +
      "</p></div>";
    return;
  }

  var company = startup.company;
  if (!company) {
    parent.innerHTML = "<p>公司数据异常</p>";
    return;
  }

  // 公司概览
  var industryInfo = STARTUP_INDUSTRIES[company.industry];
  var phaseIcon =
    company.phase === "seed" ? "🌱" : company.phase === "growth" ? "📈" : "🚀";
  var runwayColor =
    company.monthsOfRunway > 12
      ? "#4a9e5c"
      : company.monthsOfRunway > 3
        ? "#f59e0b"
        : "#ef4444";

  var overviewHtml =
    '<div style="margin-bottom:20px;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
    '<h3 style="margin:0;">' +
    phaseIcon +
    " 「" +
    company.name +
    "」</h3>" +
    '<span style="font-size:12px;color:var(--text-muted);">行业：' +
    (industryInfo
      ? industryInfo.name + " " + industryInfo.icon
      : company.industry) +
    "</span>" +
    "</div>" +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">' +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">阶段</div>' +
    '<div style="font-size:16px;font-weight:bold;">' +
    (company.phase === "seed"
      ? "种子期"
      : company.phase === "growth"
        ? "成长期"
        : "成熟期") +
    "</div>" +
    "</div>" +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">估值</div>' +
    '<div style="font-size:16px;font-weight:bold;color:var(--success);">¥' +
    Math.round(company.valuation).toLocaleString() +
    "</div>" +
    "</div>" +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">团队</div>' +
    '<div style="font-size:16px;font-weight:bold;">' +
    company.employees.length +
    " 人</div>" +
    "</div>" +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">Runway</div>' +
    '<div style="font-size:16px;font-weight:bold;color:' +
    runwayColor +
    ';">' +
    Math.round(company.monthsOfRunway) +
    " 月</div>" +
    "</div>" +
    "</div>" +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">现金储备</div>' +
    '<div style="font-size:14px;">¥' +
    Math.round(company.cashReserve).toLocaleString() +
    "</div>" +
    "</div>" +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">月收入</div>' +
    '<div style="font-size:14px;color:var(--success);">¥' +
    Math.round(company.revenue).toLocaleString() +
    "</div>" +
    "</div>" +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">月支出</div>' +
    '<div style="font-size:14px;color:var(--danger);">¥' +
    Math.round(company.expenses).toLocaleString() +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div style="margin-top:12px;background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">股权</div>' +
    '<div style="display:flex;gap:16px;margin-top:4px;font-size:12px;">' +
    "<span>你：" +
    Math.round(company.equity.player) +
    "%</span>" +
    "<span>联合创始人：" +
    Math.round(company.equity.coFounders) +
    "%</span>" +
    "<span>员工期权：" +
    Math.round(company.equity.employees) +
    "%</span>" +
    "<span>投资人：" +
    Math.round(company.equity.investors) +
    "%</span>" +
    "</div>" +
    "</div>" +
    "</div>";

  parent.innerHTML = overviewHtml;

  // 产品列表
  if (company.products.length > 0) {
    var productsDiv = document.createElement("div");
    productsDiv.style.cssText = "margin-bottom:20px;";
    productsDiv.innerHTML = '<h4 style="margin:12px 0 8px;">📦 产品</h4>';

    for (var pi = 0; pi < company.products.length; pi++) {
      var product = company.products[pi];
      var prodCategory = PRODUCT_CATEGORIES[product.category];
      var statusIcon =
        product.status === "developing"
          ? "🔨"
          : product.status === "ready_to_launch"
            ? "🚀"
            : "✅";
      var statusText =
        product.status === "developing"
          ? "开发中"
          : product.status === "ready_to_launch"
            ? "待发布"
            : "已发布";

      var prodCard = document.createElement("div");
      prodCard.style.cssText =
        "background:var(--bg-card);padding:12px;margin-bottom:8px;border-radius:6px;";
      prodCard.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
        "<div>" +
        "<strong>" +
        statusIcon +
        " " +
        product.name +
        "</strong>" +
        '<span style="font-size:11px;color:var(--text-muted);margin-left:8px;">' +
        (prodCategory ? prodCategory.name : product.category) +
        "</span>" +
        "</div>" +
        '<span style="font-size:11px;color:var(--text-muted);">' +
        statusText +
        "</span>" +
        "</div>";

      if (product.status === "developing") {
        prodCard.innerHTML +=
          '<div style="margin-top:8px;">' +
          '<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;">' +
          "<span>开发进度</span>" +
          "<span>" +
          Math.round(product.developmentProgress) +
          "%</span>" +
          "</div>" +
          '<div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;">' +
          '<div style="height:100%;width:' +
          product.developmentProgress +
          '%;background:var(--accent);border-radius:3px;"></div>' +
          "</div>" +
          "</div>";
      } else if (product.status === "launched") {
        // P0-1: 生命周期阶段徽章
        const stageIcons = {
          introduction: "🌱",
          growth: "📈",
          maturity: "💎",
          decline: "📉",
        };
        const stageColors = {
          introduction: "#f59e0b", // 黄色
          growth: "#22c55e", // 绿色
          maturity: "#3b82f6", // 蓝色
          decline: "#ef4444", // 红色
        };
        const stageNames = {
          introduction: "引入期",
          growth: "成长期",
          maturity: "成熟期",
          decline: "衰退期",
        };
        const stageIcon = stageIcons[product.lifecycleStage] || "🌱";
        const stageColor = stageColors[product.lifecycleStage] || "#f59e0b";

        // 竞争力评分
        const compScore = product.competitiveness || 0;
        const compColor =
          compScore >= 70
            ? "var(--success)"
            : compScore >= 40
              ? "var(--warning)"
              : "var(--danger)";

        // P0-1: 版本标签
        const versionBadge = `<span style="font-size:10px;padding:2px 6px;background:var(--bg-secondary);border-radius:3px;color:var(--text-secondary);margin-left:6px;">${product.version || "v1.0"}</span>`;

        // P0-1: 生命周期徽章
        const lifecycleBadge = `<span style="font-size:10px;padding:2px 6px;border-radius:3px;color:#fff;margin-left:6px;background:${stageColor};">🔄${stageNames[product.lifecycleStage]}</span>`;

        // P0-1: 市场份额和用户增长率
        const marketShareText =
          product.marketShare > 0
            ? ` | 份额:${product.marketShare.toFixed(1)}%`
            : "";
        const growthRateColor =
          product.userGrowthRate > 0
            ? "var(--success)"
            : product.userGrowthRate < 0
              ? "var(--danger)"
              : "var(--text-muted)";
        const growthRateText = ` | 增长率:${product.userGrowthRate > 0 ? "+" : ""}${product.userGrowthRate.toFixed(1)}%`;
        const churnRateText =
          product.churnRate > 0
            ? ` | 流失:${product.churnRate.toFixed(1)}%`
            : "";

        prodCard.innerHTML =
          '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          "<div>" +
          "<strong>" +
          stageIcon +
          " " +
          product.name +
          versionBadge +
          lifecycleBadge +
          "</strong>" +
          '<span style="font-size:11px;color:var(--text-muted);margin-left:8px;">' +
          (prodCategory ? prodCategory.name : product.category) +
          "</span>" +
          "</div>" +
          '<span style="font-size:11px;color:' +
          stageColor +
          ';">' +
          statusText +
          "</span>" +
          "</div>";

        // 详细数据行
        let detailHtml =
          '<div style="margin-top:8px;font-size:11px;color:var(--text-muted);">' +
          "技术分：" +
          product.technologyScore +
          " | 市场分：" +
          product.marketScore +
          " | 竞争力：" +
          '<strong style="color:' +
          compColor +
          '">' +
          compScore +
          "</strong>" +
          " | 用户：" +
          (product.users || 0).toLocaleString() +
          " | 评分：" +
          (product.rating || 3.5).toFixed(1) +
          "★" +
          " | 月收入：¥" +
          Math.round(product.revenue).toLocaleString() +
          marketShareText +
          growthRateText +
          churnRateText +
          "</div>";

        // P0-1: 峰值记录
        if (product.peakUsers > 0 || product.peakRevenue > 0) {
          detailHtml +=
            '<div style="margin-top:4px;font-size:10px;color:var(--text-muted);">' +
            "📊 峰值：用户" +
            (product.peakUsers || 0).toLocaleString() +
            " | 月收入¥" +
            Math.round(product.peakRevenue).toLocaleString() +
            "</div>";
        }

        // P0-2: AARRR 数据面板
        var arpuText =
          product.arpu > 0 ? " | ARPU:¥" + product.arpu.toFixed(2) + "/天" : "";
        var ltvText =
          product.ltv > 0
            ? " | LTV:¥" + Math.round(product.ltv).toLocaleString()
            : "";
        var cacText =
          product.cac > 0 ? " | CAC:¥" + product.cac.toFixed(0) : "";
        var payRateText =
          " | 付费率:" + (product.payRate * 100).toFixed(1) + "%";
        var kFactorText = " | K因子:" + product.kFactor.toFixed(2);
        var dauText = " | DAU:" + (product.dau || 0).toLocaleString();
        var retentionText =
          " | 留存:D1:" +
          (product.retentionD1 * 100).toFixed(0) +
          "% D7:" +
          (product.retentionD7 * 100).toFixed(0) +
          "% D30:" +
          (product.retentionD30 * 100).toFixed(0) +
          "%";

        // LTV/CAC 比率颜色
        var ltvcacRatio =
          product.cac > 0 && product.ltv > 0 ? product.ltv / product.cac : 0;
        var ltvcacColor =
          ltvcacRatio >= 3
            ? "var(--success)"
            : ltvcacRatio >= 1
              ? "var(--warning)"
              : ltvcacRatio > 0
                ? "var(--danger)"
                : "var(--text-muted)";
        var ltvcacText =
          product.cac > 0
            ? " | LTV/CAC:<strong style='color:" +
              ltvcacColor +
              "'>" +
              ltvcacRatio.toFixed(1) +
              "x</strong>"
            : "";

        detailHtml +=
          '<div style="margin-top:6px;padding:6px;background:rgba(0,0,0,0.15);border-radius:4px;font-size:10px;color:var(--text-secondary);">' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:3px;">' +
          "<span>📊 活跃</span><span>" +
          dauText +
          " MAU:" +
          (product.mau || 0).toLocaleString() +
          "</span>" +
          "</div>" +
          '<div style="display:flex;justify-content:space-between;margin-bottom:3px;">' +
          "<span>💰 变现</span><span>" +
          arpuText +
          ltvText +
          payRateText +
          "</span>" +
          "</div>" +
          '<div style="display:flex;justify-content:space-between;margin-bottom:3px;">' +
          "<span>📢 获客</span><span>" +
          cacText +
          " 新增:" +
          (product.newUsersToday || 0).toLocaleString() +
          "</span>" +
          "</div>" +
          '<div style="display:flex;justify-content:space-between;margin-bottom:3px;">' +
          "<span>🔄 留存</span><span>" +
          retentionText +
          "</span>" +
          "</div>" +
          '<div style="display:flex;justify-content:space-between;">' +
          "<span>🚀 病毒</span><span>" +
          kFactorText +
          "</span>" +
          "</div>" +
          "</div>" +
          '<div style="margin-top:4px;font-size:10px;text-align:center;color:' +
          ltvcacColor +
          ';">' +
          "💡 单位经济模型：" +
          ltvcacText +
          "</div>";

        prodCard.innerHTML += detailHtml;

        // 功能模块列表
        if (product.features && product.features.length > 0) {
          let featuresHtml =
            '<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">';
          for (const feat of product.features) {
            const featDef = FEATURE_MODULES[feat.key];
            const featName = featDef ? featDef.name : feat.name;
            const featIcon = featDef ? featDef.icon : "";
            const featColor =
              feat.status === "completed" ? "var(--success)" : "var(--warning)";
            const featText =
              feat.status === "completed"
                ? "已完成"
                : "开发中" +
                  Math.round(
                    (1 - (feat.targetDay - state.player.day) / 15) * 100,
                  ) +
                  "%";
            featuresHtml +=
              '<span style="font-size:10px;padding:2px 6px;border-radius:3px;background:rgba(0,0,0,0.2);color:' +
              featColor +
              '">' +
              (featIcon || "") +
              " " +
              featName +
              " " +
              featText +
              "</span>";
          }
          featuresHtml += "</div>";
          prodCard.innerHTML += featuresHtml;
        }

        // P0-1: 版本迭代按钮（已发布产品）
        if (typeof showVersionUpdateModal === "function") {
          const versionBtn = document.createElement("div");
          versionBtn.style.cssText = "margin-top:8px;";
          versionBtn.innerHTML =
            '<button class="btn btn-sm btn-primary" onclick="showVersionUpdateModal(\'' +
            product.id +
            '\')" style="font-size:11px;padding:4px 10px;">' +
            "🔄 版本迭代" +
            "</button>";
          prodCard.appendChild(versionBtn);
        }

        // P0-2: AARRR 数据按钮
        if (typeof showAARRRDashboard === "function") {
          const ararBtn = document.createElement("div");
          ararBtn.style.cssText = "margin-top:4px;";
          ararBtn.innerHTML =
            '<button class="btn btn-sm btn-warning" onclick="showAARRRDashboard(\'' +
            product.id +
            '\')" style="font-size:11px;padding:4px 10px;">' +
            "📊 增长漏斗" +
            "</button>";
          prodCard.appendChild(ararBtn);
        }

        // P0-3: 技术债状态显示
        if (
          product.technicalDebt > 0 ||
          typeof showTechDebtModal === "function"
        ) {
          const techDebtDiv = document.createElement("div");
          const debtLevel =
            product.technicalDebt >= 70
              ? "danger"
              : product.technicalDebt >= 40
                ? "warning"
                : "success";
          const debtColor =
            debtLevel === "danger"
              ? "var(--danger)"
              : debtLevel === "warning"
                ? "var(--warning)"
                : "var(--success)";
          const debtIcon =
            debtLevel === "danger"
              ? "🔴"
              : debtLevel === "warning"
                ? "🟡"
                : "🟢";

          techDebtDiv.style.cssText = "margin-top:6px;";
          techDebtDiv.innerHTML =
            '<div style="display:flex;align-items:center;font-size:10px;">' +
            '<span style="color:' +
            debtColor +
            ';">' +
            debtIcon +
            " 技术债:" +
            product.technicalDebt.toFixed(0) +
            "</span>" +
            '<div style="flex:1;margin:0 8px;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;">' +
            '<div style="height:100%;width:' +
            product.technicalDebt +
            "%;background:" +
            debtColor +
            ';border-radius:2px;"></div>' +
            "</div>" +
            '<span style="color:var(--text-muted);">Bug率:' +
            product.bugRate.toFixed(2) +
            "/千用户</span>" +
            "</div>";
          prodCard.appendChild(techDebtDiv);
        }

        // P0-3: 重构按钮（技术债>30时显示）
        if (
          (product.technicalDebt || 0) > 30 &&
          typeof showTechDebtModal === "function"
        ) {
          const refactorBtn = document.createElement("div");
          refactorBtn.style.cssText = "margin-top:4px;";
          refactorBtn.innerHTML =
            '<button class="btn btn-sm btn-success" onclick="showTechDebtModal(\'' +
            product.id +
            '\')" style="font-size:11px;padding:4px 10px;">' +
            "🔧 重构代码" +
            "</button>";
          prodCard.appendChild(refactorBtn);
        }

        // P0-1: 退市按钮（衰退期产品）
        if (
          product.lifecycleStage === "decline" &&
          typeof showRetireProductModal === "function"
        ) {
          const retireBtn = document.createElement("div");
          retireBtn.style.cssText = "margin-top:4px;";
          retireBtn.innerHTML =
            '<button class="btn btn-sm btn-danger" onclick="showRetireProductModal(\'' +
            product.id +
            '\')" style="font-size:11px;padding:4px 10px;">' +
            "💀 手动退市" +
            "</button>";
          prodCard.appendChild(retireBtn);
        }
      }

      productsDiv.appendChild(prodCard);
    }

    parent.appendChild(productsDiv);
  }

  // 团队列表
  if (company.employees.length > 0) {
    var teamDiv = document.createElement("div");
    teamDiv.style.cssText = "margin-bottom:20px;";
    teamDiv.innerHTML =
      '<h4 style="margin:12px 0 8px;">👥 团队（' +
      company.employees.length +
      "人）</h4>";

    for (var ei = 0; ei < company.employees.length; ei++) {
      var emp = company.employees[ei];
      var empRole = EMPLOYEE_ROLES[emp.role];
      var loyaltyColor =
        emp.loyalty > 60 ? "#4a9e5c" : emp.loyalty > 30 ? "#f59e0b" : "#ef4444";

      // P0-4: 满意度/倦怠状态
      var sat = emp.satisfactionDetails || {};
      var burnoutLevel = emp.burnoutLevel || 0;
      var burnoutIcon =
        burnoutLevel >= 3
          ? "🔴"
          : burnoutLevel >= 2
            ? "🟠"
            : burnoutLevel >= 1
              ? "🟡"
              : "🟢";
      var burnoutText =
        burnoutLevel >= 3
          ? "重度倦怠"
          : burnoutLevel >= 2
            ? "中度倦怠"
            : burnoutLevel >= 1
              ? "轻度倦怠"
              : "正常";
      var burnoutColor =
        burnoutLevel >= 3
          ? "var(--danger)"
          : burnoutLevel >= 2
            ? "#f59e0b"
            : burnoutLevel >= 1
              ? "#fbbf24"
              : "var(--success)";

      var empCard = document.createElement("div");
      empCard.style.cssText =
        "background:var(--bg-card);padding:8px 12px;margin-bottom:6px;border-radius:6px;font-size:13px;";
      empCard.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
        "<span>" +
        (empRole ? empRole.icon : "") +
        " " +
        emp.name +
        "（" +
        (empRole ? empRole.name : emp.role) +
        "）</span>" +
        '<span style="font-size:11px;color:' +
        burnoutColor +
        ';">' +
        burnoutIcon +
        " " +
        burnoutText +
        "</span>" +
        "</div>" +
        '<div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px;">' +
        '<span style="color:var(--text-muted);">月薪¥' +
        emp.salary.toLocaleString() +
        "</span>" +
        '<span style="color:' +
        loyaltyColor +
        ';">忠诚度 ' +
        Math.round(emp.loyalty) +
        "%</span>" +
        "</div>" +
        '<div style="margin-top:4px;font-size:10px;color:var(--text-secondary);">' +
        "📊 满意度:" +
        Math.round(emp.satisfaction || 50) +
        "% " +
        "| 薪资:" +
        Math.round(sat.salary || 50) +
        "% " +
        "| 工作:" +
        Math.round(sat.workload || 60) +
        "% " +
        "| 成长:" +
        Math.round(sat.growth || 40) +
        "% " +
        "</div>" +
        '<div style="margin-top:4px;font-size:10px;color:var(--text-secondary);">' +
        "💪 健康:" +
        Math.round(emp.health || 80) +
        "% " +
        "| 压力:" +
        Math.round(emp.stressLevel || 30) +
        "% " +
        "| 倦怠风险:" +
        Math.round(emp.burnoutRisk || 0) +
        "% " +
        "</div>";

      teamDiv.appendChild(empCard);
    }

    parent.appendChild(teamDiv);
  }

  // 融资历史
  if (company.fundingRounds.length > 0) {
    var fundingDiv = document.createElement("div");
    fundingDiv.style.cssText = "margin-bottom:20px;";
    fundingDiv.innerHTML = '<h4 style="margin:12px 0 8px;">💰 融资历史</h4>';

    for (var fi = 0; fi < company.fundingRounds.length; fi++) {
      var round = company.fundingRounds[fi];
      var roundDef = FUNDING_ROUNDS[round.round];
      var fundingCard = document.createElement("div");
      fundingCard.style.cssText =
        "background:var(--bg-card);padding:8px 12px;margin-bottom:6px;border-radius:6px;font-size:13px;";
      fundingCard.innerHTML =
        "<span>" +
        (roundDef ? roundDef.icon : "") +
        " " +
        (roundDef ? roundDef.name : round.round) +
        "轮</span>" +
        '<span style="font-size:11px;color:var(--text-muted);">融资金额：¥' +
        round.amount.toLocaleString() +
        "</span>" +
        '<span style="font-size:11px;color:var(--text-muted);">出让 ' +
        round.equityDilution +
        "%</span>" +
        '<span style="font-size:11px;color:var(--success);">投后估值：¥' +
        round.postValuation.toLocaleString() +
        "</span>";

      fundingDiv.appendChild(fundingCard);
    }

    parent.appendChild(fundingDiv);
  }

  // 竞争对手情报（Phase 4）
  if (state.startup.competitors && state.startup.competitors.length > 0) {
    var compDiv = document.createElement("div");
    compDiv.style.cssText =
      "margin-bottom:20px;border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--bg-secondary);";
    compDiv.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
      '<h4 style="margin:0;font-size:13px;">👥 竞争对手 <span style="font-weight:normal;font-size:11px;color:var(--text-muted);">（同赛道其他公司）</span></h4>' +
      '<span style="font-size:10px;color:var(--text-muted);">共' +
      state.startup.competitors.length +
      "家</span>" +
      "</div>";

    // 市场份额
    var marketShare =
      typeof calculateMarketShare === "function"
        ? calculateMarketShare(state, company, state.startup.competitors)
        : 0;
    var brandLevel =
      typeof getBrandLevel === "function"
        ? getBrandLevel(company.reputation)
        : null;

    compDiv.innerHTML +=
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px;">' +
      '<div style="background:var(--bg-card);padding:10px;border-radius:6px;text-align:center;">' +
      '<div style="font-size:10px;color:var(--text-muted);">市场份额</div>' +
      '<div style="font-size:18px;font-weight:bold;color:var(--accent);">' +
      marketShare +
      "%</div>" +
      "</div>" +
      '<div style="background:var(--bg-card);padding:10px;border-radius:6px;text-align:center;">' +
      '<div style="font-size:10px;color:var(--text-muted);">品牌等级</div>' +
      '<div style="font-size:18px;font-weight:bold;color:var(--success);">' +
      (brandLevel ? brandLevel.icon + brandLevel.name : "未知") +
      "</div>" +
      "</div>" +
      "</div>";

    for (var ci = 0; ci < state.startup.competitors.length; ci++) {
      var comp = state.startup.competitors[ci];
      var compCard = document.createElement("div");
      compCard.style.cssText =
        "background:var(--bg-card);padding:10px;margin-bottom:6px;border-radius:6px;font-size:13px;border-left:3px solid " +
        (comp.trend === "up" ? "var(--success)" : "var(--border)");
      compCard.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
        "<div>" +
        "<strong>" +
        _esc(comp.name) +
        "</strong>" +
        '<span style="font-size:10px;color:var(--text-muted);margin-left:6px;">· ' +
        (comp.focus || "") +
        "</span>" +
        "</div>" +
        '<span style="font-size:10px;color:' +
        (comp.trend === "up" ? "var(--success)" : "var(--text-muted)") +
        ';">' +
        (comp.trend === "up" ? "📈" : "➡️") +
        "</span>" +
        "</div>" +
        '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">' +
        "估值：¥" +
        Math.round(comp.valuation).toLocaleString() +
        " | 团队：" +
        comp.employees +
        "人" +
        " | 技术：" +
        Math.round(comp.technologyScore) +
        " | 市场：" +
        Math.round(comp.marketScore) +
        "</div>";
      compDiv.appendChild(compCard);
    }

    parent.appendChild(compDiv);
  }

  // 行动按钮区域
  var actionsDiv = document.createElement("div");
  actionsDiv.style.cssText =
    "margin-top:20px;padding-top:16px;border-top:1px solid var(--border);";
  actionsDiv.innerHTML = '<h4 style="margin:12px 0 8px;">⚡ 创业行动</h4>';

  var actions = getAvailableStartupActions(state);
  for (var ai = 0; ai < actions.length; ai++) {
    var action = actions[ai];
    var actionBtn = document.createElement("button");
    actionBtn.className = "btn btn-sm";
    actionBtn.style.cssText =
      "margin-right:8px;margin-bottom:8px;" +
      (action.available ? "" : "opacity:0.5;cursor:not-allowed;");
    actionBtn.innerHTML =
      action.icon +
      " " +
      action.name +
      (action.apCost ? " ⚡" + action.apCost : "");
    actionBtn.disabled = !action.available;
    actionBtn.onclick = (function (act) {
      return function () {
        var result = executeStartupAction(state, act.id, {});
        if (!result.success) {
          StateManager.addMessage(result.message || "操作失败", "warning");
        }
        renderStartupTab(state, parent);
        renderSidebar(state);
      };
    })(action);
    actionsDiv.appendChild(actionBtn);
  }

  // 开发功能模块按钮
  if (company.products.some((p) => p.status === "launched")) {
    var featBtn = document.createElement("button");
    featBtn.className = "btn btn-sm btn-primary";
    featBtn.style.cssText = "margin-right:8px;margin-bottom:8px;";
    featBtn.innerHTML = "🔧 开发功能模块";
    featBtn.onclick = function () {
      showFeatureDevelopmentModal(state);
      renderStartupTab(state, parent);
      renderSidebar(state);
    };
    actionsDiv.appendChild(featBtn);
  }

  // 市场调研按钮
  if (state.startup.competitors && state.startup.competitors.length > 0) {
    var researchBtn = document.createElement("button");
    researchBtn.className = "btn btn-sm btn-warning";
    researchBtn.style.cssText = "margin-right:8px;margin-bottom:8px;";
    researchBtn.innerHTML = "📊 市场调研";
    researchBtn.onclick = function () {
      showMarketResearchModal(state);
      renderStartupTab(state, parent);
      renderSidebar(state);
    };
    actionsDiv.appendChild(researchBtn);
  }

  parent.appendChild(actionsDiv);

  // ====== 特殊按钮区域：IPO 审核结果 / 收购要约 ======
  if (startup.flags.ipoFiled && startup.status === "ipo_preparing") {
    // IPO 审核中：显示等待消息
    var ipoWaitDiv = document.createElement("div");
    ipoWaitDiv.style.cssText =
      "margin-top:16px;padding:12px;background:rgba(245,158,11,0.1);border-radius:6px;border:1px solid rgba(245,158,11,0.3);";
    ipoWaitDiv.innerHTML =
      '<span style="color:var(--warning);">🔔 IPO 审核中，等待监管结果（通常 3-5 天）</span>';
    parent.appendChild(ipoWaitDiv);
  }

  // 收购要约
  if (startup.pendingAcquisitionOffer && !startup.flags.exited) {
    var offer = startup.pendingAcquisitionOffer;
    var offerDiv = document.createElement("div");
    offerDiv.style.cssText =
      "margin-top:16px;padding:12px;background:rgba(46,204,113,0.1);border-radius:6px;border:1px solid rgba(46,204,113,0.3);";
    offerDiv.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;">' +
      "<div>" +
      '<span style="color:var(--success);font-weight:bold;">🤝 「' +
      _esc(offer.acquirerName) +
      "」提出收购要约</span>" +
      '<span style="font-size:11px;color:var(--text-muted);margin-left:8px;">报价 ¥' +
      offer.offerValue.toLocaleString() +
      "（" +
      offer.offerMultiplier.toFixed(2) +
      "x 估值）| 你获得 ¥" +
      offer.playerShareValue.toLocaleString() +
      "</span>" +
      "</div>" +
      '<button class="btn btn-sm btn-success" onclick="showAcquisitionModal(StateManager.getState(), startup.pendingAcquisitionOffer);">查看/决策</button>' +
      "</div>";
    parent.appendChild(offerDiv);
  }
}

// ====== 导出 ======
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    STARTUP_INDUSTRIES,
    EMPLOYEE_ROLES,
    FUNDING_ROUNDS,
    INVESTOR_TYPES,
    PRODUCT_CATEGORIES,
    registerStartup,
    createProduct,
    developProduct,
    launchProduct,
    hireEmployee,
    fireEmployee,
    getEligibleRounds,
    raiseFunding,
    tickStartup,
    prepareIPO,
    processIPOResult,
    getAcquisitionOffer,
    acceptAcquisition,
    showAcquisitionModal,
    bankrupt,
    getStartupSummary,
    getAvailableStartupActions,
    executeStartupAction,
    renderStartupTab,
    // P0-1: 版本迭代弹窗
    showVersionUpdateModal,
    // P0-1: 退市弹窗
    showRetireProductModal,
  };
}

// ====== P0-1: 版本迭代弹窗 ======
/** 显示版本迭代弹窗 */
function showVersionUpdateModal(productId) {
  const state = StateManager.getState();
  const company = state.startup.company;
  if (!company) return;

  const product = company.products.find((p) => p.id === productId);
  if (!product || product.status !== "launched" || product.retired) {
    StateManager.addMessage("产品不存在或不可升级", "warning");
    return;
  }

  const versionConfigs = {
    minor: {
      name: "小版本迭代",
      costRange: [5000, 20000],
      techBonus: [2, 5],
      marketBonus: [1, 3],
      desc: "v1.0 → v1.1，修复bug，小幅优化",
      current:
        "v" +
        (product.version?.split(".")[1]
          ? parseInt(product.version.split(".")[1]) + 1
          : 1) +
        ".0",
    },
    major: {
      name: "大版本更新",
      costRange: [50000, 200000],
      techBonus: [8, 15],
      marketBonus: [5, 10],
      desc: "v1.x → v2.0，新功能，体验升级",
      current:
        "v" +
        (product.version?.split(".")[0]
          ? parseInt(product.version.split(".")[0]) + 1
          : 2) +
        ".0",
    },
    revolutionary: {
      name: "革命性升级",
      costRange: [200000, 1000000],
      techBonus: [15, 30],
      marketBonus: [10, 20],
      desc: "v.x → v3.0+，重构核心，颠覆创新",
      current:
        "v" +
        Math.max(
          3,
          product.version?.split(".")[0]
            ? parseInt(product.version.split(".")[0]) + 1
            : 3,
        ) +
        ".0+",
    },
  };

  const html =
    '<div style="font-size:13px;">' +
    '<p style="color:var(--text-secondary);margin-bottom:12px;">' +
    "当前版本：<strong>" +
    (product.version || "v1.0") +
    "</strong> | " +
    "技术分：" +
    product.technologyScore +
    " | 市场分：" +
    product.marketScore +
    "</p>" +
    '<div style="display:grid;grid-template-columns:1fr;gap:12px;">';

  for (const [key, config] of Object.entries(versionConfigs)) {
    const canAffordMin = company.cashReserve >= config.costRange[0];
    html +=
      '<div style="padding:12px;background:' +
      (canAffordMin ? "var(--bg-card)" : "rgba(0,0,0,0.1)") +
      ";border:1px solid " +
      (canAffordMin ? "var(--border)" : "#ccc") +
      ";border-radius:8px;cursor:pointer;transition:all 0.2s;" +
      (canAffordMin ? "" : "opacity:0.6;") +
      '"' +
      (canAffordMin
        ? "onclick=\"handleVersionUpdate('" + productId + "','" + key + "')\""
        : "") +
      '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
      '<strong style="font-size:13px;">' +
      config.name +
      " → " +
      config.current +
      "</strong>" +
      '<span style="font-size:11px;color:' +
      (canAffordMin ? "var(--success)" : "var(--danger)") +
      ';">¥' +
      config.costRange[0].toLocaleString() +
      "~¥" +
      config.costRange[1].toLocaleString() +
      "</span>" +
      "</div>" +
      '<div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">' +
      config.desc +
      "</div>" +
      '<div style="font-size:10px;">' +
      "🔧 技术分+" +
      config.techBonus[0] +
      "~+" +
      config.techBonus[1] +
      " | 📈 市场分+" +
      config.marketBonus[0] +
      "~+" +
      config.marketBonus[1] +
      "</div>" +
      "</div>";
  }

  html += "</div>";

  // 版本历史
  if (product.versionHistory && product.versionHistory.length > 0) {
    html +=
      '<div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">' +
      '<div style="font-size:12px;font-weight:bold;margin-bottom:8px;">📜 版本历史</div>' +
      '<div style="font-size:10px;color:var(--text-muted);max-height:120px;overflow-y:auto;">';
    for (let i = product.versionHistory.length - 1; i >= 0; i--) {
      const v = product.versionHistory[i];
      html +=
        '<div style="padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.05);">' +
        "<strong>" +
        v.version +
        "</strong> (" +
        v.date +
        ") — " +
        v.changes +
        " | 技术分" +
        v.techScore +
        " 市场分" +
        v.marketScore +
        "</div>";
    }
    html += "</div></div>";
  }

  html += "</div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "🔄 「" + product.name + "」版本迭代",
    body: html,
    buttons: [{ text: "关闭", cls: "", callback: function () {} }],
  });
}

/** 处理版本迭代点击 */
function handleVersionUpdate(productId, versionType) {
  const state = StateManager.getState();
  const company = state.startup.company;
  if (!company) return;

  const product = company.products.find((p) => p.id === productId);
  if (!product) return;

  const config = {
    minor: { costRange: [5000, 20000] },
    major: { costRange: [50000, 200000] },
    revolutionary: { costRange: [200000, 1000000] },
  }[versionType];

  if (!config) return;

  // 显示预算输入弹窗
  const budgetPrompt =
    '<div style="font-size:13px;">' +
    "<p>选择投入预算（¥" +
    config.costRange[0].toLocaleString() +
    "~¥" +
    config.costRange[1].toLocaleString() +
    "）：</p>" +
    '<input type="range" id="versionBudget" min="' +
    config.costRange[0] +
    '" max="' +
    config.costRange[1] +
    '" step="5000" value="' +
    config.costRange[0] +
    '" style="width:100%;margin:12px 0;">' +
    '<div id="budgetValue" style="font-size:16px;font-weight:bold;color:var(--accent);text-align:center;">¥' +
    config.costRange[0].toLocaleString() +
    "</div>" +
    "<script>" +
    'document.getElementById("versionBudget").oninput = function() {' +
    '  document.getElementById("budgetValue").textContent = "¥" + parseInt(this.value).toLocaleString();' +
    "};" +
    "</scr" +
    "ipt>" +
    "</div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "投入预算",
    body: budgetPrompt,
    buttons: [
      {
        text: "取消",
        cls: "",
        callback: function () {},
      },
      {
        text: "确认",
        cls: "btn-primary",
        callback: function () {
          const budget = parseInt(
            document.getElementById("versionBudget").value,
          );
          const result = updateProductVersion(
            state,
            productId,
            versionType,
            budget,
          );
          if (result.success) {
            StateManager.addMessage("✅ " + result.message, "success");
            renderAll();
          } else {
            StateManager.addMessage("⚠️ " + result.message, "warning");
          }
        },
      },
    ],
  });

  // 绑定滑块值显示
  setTimeout(() => {
    const slider = document.getElementById("versionBudget");
    const valueDisplay = document.getElementById("budgetValue");
    if (slider && valueDisplay) {
      slider.oninput = function () {
        valueDisplay.textContent = "¥" + parseInt(this.value).toLocaleString();
      };
    }
  }, 100);
}

// ====== P0-1: 退市弹窗 ======
/** 显示退市确认弹窗 */
function showRetireProductModal(productId) {
  const state = StateManager.getState();
  const company = state.startup.company;
  if (!company) return;

  const product = company.products.find((p) => p.id === productId);
  if (!product || product.retired) return;

  const reasons = [
    {
      key: "replaced_by_new",
      label: "被新产品替代",
      desc: "已有更好的产品接替，旧产品自然退市",
    },
    {
      key: "market_decline",
      label: "市场萎缩",
      desc: "市场需求下降，继续运营不划算",
    },
    {
      key: "strategic_pivot",
      label: "战略调整",
      desc: "公司战略方向改变，需要聚焦其他产品",
    },
    { key: "failure", label: "产品失败", desc: "产品表现不佳，及时止损" },
  ];

  let html =
    '<div style="font-size:13px;">' +
    '<p style="color:var(--text-secondary);margin-bottom:12px;">' +
    "确定要退市 <strong>「" +
    product.name +
    "」</strong> 吗？" +
    "</p>" +
    '<div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">' +
    "当前用户：" +
    (product.users || 0).toLocaleString() +
    " | 月收入：¥" +
    Math.round(product.revenue).toLocaleString() +
    " | 生命周期：" +
    product.lifecycleStage +
    "</div>" +
    '<div style="font-size:12px;font-weight:bold;margin-bottom:8px;">选择退市原因：</div>' +
    '<div style="display:grid;grid-template-columns:1fr;gap:8px;">';

  for (const reason of reasons) {
    html +=
      '<label style="display:flex;align-items:center;padding:10px;background:var(--bg-secondary);border-radius:6px;cursor:pointer;">' +
      '<input type="radio" name="retireReason" value="' +
      reason.key +
      '" style="margin-right:8px;">' +
      "<div>" +
      "<strong>" +
      reason.label +
      "</strong>" +
      '<div style="font-size:10px;color:var(--text-muted);">' +
      reason.desc +
      "</div>" +
      "</div>" +
      "</label>";
  }

  html += "</div></div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "💀 退市确认",
    body: html,
    buttons: [
      {
        text: "取消",
        cls: "",
        callback: function () {},
      },
      {
        text: "确认退市",
        cls: "btn-danger",
        callback: function () {
          const selected = document.querySelector(
            'input[name="retireReason"]:checked',
          );
          if (!selected) {
            StateManager.addMessage("请选择退市原因", "warning");
            return;
          }
          const result = retireProduct(state, productId, selected.value);
          if (result.success) {
            StateManager.addMessage(
              "💀 「" + product.name + "」已退市",
              "danger",
            );
            renderAll();
          } else {
            StateManager.addMessage("⚠️ " + result.message, "warning");
          }
        },
      },
    ],
  });
}

// ====== 导出 ======
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    STARTUP_INDUSTRIES,
    EMPLOYEE_ROLES,
    FUNDING_ROUNDS,
    INVESTOR_TYPES,
    PRODUCT_CATEGORIES,
    registerStartup,
    createProduct,
    developProduct,
    launchProduct,
    hireEmployee,
    fireEmployee,
    getEligibleRounds,
    raiseFunding,
    tickStartup,
    prepareIPO,
    processIPOResult,
    getAcquisitionOffer,
    acceptAcquisition,
    showAcquisitionModal,
    bankrupt,
    getStartupSummary,
    getAvailableStartupActions,
    executeStartupAction,
    renderStartupTab,
    // 深度交互弹窗
    showMeetInvestorModal,
    showMarketingModal,
    showFinancialReportModal,
    showTeamManagementModal,
    generateInvestorFeedback,
    // P0-1: 版本迭代弹窗
    showVersionUpdateModal,
    handleVersionUpdate,
    // P0-1: 退市弹窗
    showRetireProductModal,
    retireProduct,
    updateProductVersion,
    // P0-2: AARRR 数据面板
    showAARRRDashboard,
    runAdCampaign,
    updateProductMonetization,
    // P0-3: 技术债弹窗
    showTechDebtModal,
    showRefactorConfirm,
    refactorProduct,
    recordTechDebtEvent,
    // P0-4: 员工满意度系统
    improveEmployeeSatisfaction,
    getEmployeeSatisfactionSummary,
    // P0-5: KPI/OKR 目标系统
    setQuarterlyOkr,
    updateOkrProgress,
    evaluateQuarterlyOkr,
    setTeamGoal,
    updateTeamGoalProgress,
    setEmployeeGoal,
    updateEmployeeGoalProgress,
    getKpiSummary,
    showKpiDashboard,
    showSetOkrModal,
    showTeamGoalModal,
    // P1-6: 董事会/股东压力系统
    showBoardManagementModal,
    evaluateBoardPerformance,
    resolveBoardPressureAction,
    executeShareholderCommunication,
    getAvailableShareholderActions,
    getPressureLevelText,
    getPressureLevelColor,
    // P1-6: 数据常量
    BOARD_MEMBER_TEMPLATES,
    BOARD_KPI_REQUIREMENTS,
    BOARD_PRESSURE_EVENTS,
    SHAREHOLDER_COMMUNICATION_ACTIONS,
    // P1-7: 公关/媒体系统
    showPRManagementModal,
    showCrisisResponseModal,
    executePREvent,
    executeMediaRelationAction,
    resolveCrisisEvent,
    getAvailablePREvents,
    getAvailableCrisisResponses,
    getMediaRelationLevelInfo,
    getCrisisLevelInfo,
    getPREventSummary,
    // P1-7: 数据常量
    MEDIA_TYPES,
    PR_EVENT_TEMPLATES,
    CRISIS_RESPONSE_OPTIONS,
    MEDIA_RELATION_ACTIONS,
    MEDIA_RELATION_LEVELS,
    CRISIS_LEVELS,
    // P1-8: 法律/合规风险系统
    showLegalComplianceModal,
    showLegalResponseModal,
    executeLegalChecklistAction,
    applyPatent,
    buyLegalInsurance,
    regulatoryCommunication,
    resolveLegalEvent,
    getAvailableLegalEvents,
    getAvailableLegalResponses,
    getLegalChecklistProgress,
    getPatentList,
    getLegalRiskLevelInfo,
    getComplianceGradeInfo,
    getLegalEventSummary,
    // P1-8: 数据常量
    LEGAL_RISK_TYPES,
    PATENT_TYPES,
    LEGAL_EVENT_TEMPLATES,
    LEGAL_RESPONSE_OPTIONS,
    LEGAL_CHECKLIST,
    LEGAL_RISK_LEVELS,
    COMPLIANCE_LEVELS,
    // P1-9: 竞争对手策略应对系统
    showCompetitorDefenseModal,
    executeCompetitorResponseFromAction,
    investBrandDefense,
    investTalentRetention,
    buyCompetitiveIntelligence,
    getCompetitorAttackSummary,
    getCompetitorDefenseLevelInfo,
    // P1-9: 数据常量
    COMPETITOR_ATTACK_TYPES,
    COMPETITOR_EVENT_TEMPLATES,
    PRICE_WAR_RESPONSES,
    TALENT_POACHING_RESPONSES,
    MARKETING_WAR_RESPONSES,
    TECH_COMPETITION_RESPONSES,
    // P1-10: 危机事件系统
    showCrisisManagementModal,
    executeCrisisResponseFromAction,
    investCrisisPreparation,
    buyCrisisInsurance,
    getCrisisSummary,
    getCrisisResilienceLevelInfo,
    getCrisisTypeInfo,
    // P1-10: 数据常量
    CRISIS_EVENT_TYPES,
    OPERATIONAL_CRISIS_TEMPLATES,
    CRISIS_RESPONSE_TEMPLATES,
    // P2-11: 办公地点系统
    upgradeOffice,
    downgradeOffice,
    showOfficeManagementModal,
    OFFICE_UPGRADE_PATH,
    // P2-12: 企业文化系统
    changeCulture,
    improveCultureAdoptionAction,
    showCultureManagementModal,
    // P2-13: 合作伙伴系统
    showPartnerManagementModal,
    recruitPartnerAction,
    improvePartnerTrustAction,
    terminatePartnerAction,
    getPartnerSummary,
    // P2-14: 产品定价策略
    showPricingManagementModal,
    adjustProductPrice,
    runProductABTest,
    switchPricingStrategy,
    getPriceElasticity,
    // P2-15: 供应链系统
    showSupplyChainManagementModal,
    addSupplierAction,
    updateSupplierQualityAction,
    manageInventoryAction,
    getSupplyChainRisk,
  };
}

// ====== P0-3: 技术债详情弹窗 ======
/** 显示技术债详情弹窗 */
function showTechDebtModal(productId) {
  const state = StateManager.getState();
  const company = state.startup.company;
  if (!company) return;

  const product = company.products.find((p) => p.id === productId);
  if (!product) return;

  const debt = product.technicalDebt || 0;
  const debtLevel =
    debt >= 70 ? "危险" : debt >= 40 ? "警告" : debt > 0 ? "正常" : "健康";
  const debtColor =
    debt >= 70
      ? "var(--danger)"
      : debt >= 40
        ? "var(--warning)"
        : "var(--success)";

  // 技术债来源分布
  const sources = product.techDebtSources || {};
  const totalSources = Object.values(sources).reduce((a, b) => a + b, 0);

  let sourcesHtml = "";
  const sourceIcons = {
    rushDevelopment: "🏃",
    skippedTests: "⚠️",
    cutFeatures: "✂️",
    quickFixes: "🔨",
    legacyCode: "🗄️",
  };
  const sourceNames = {
    rushDevelopment: "赶工",
    skippedTests: "跳过测试",
    cutFeatures: "砍需求",
    quickFixes: "临时修复",
    legacyCode: "遗留代码",
  };

  for (const [key, value] of Object.entries(sources)) {
    if (value > 0) {
      const pct = totalSources > 0 ? (value / totalSources) * 100 : 0;
      sourcesHtml +=
        '<div style="display:flex;align-items:center;margin-bottom:4px;">' +
        '<span style="font-size:10px;width:60px;">' +
        (sourceIcons[key] || "") +
        " " +
        sourceNames[key] +
        "</span>" +
        '<div style="flex:1;height:12px;background:rgba(255,255,255,0.1);border-radius:2px;">' +
        '<div style="height:100%;width:' +
        pct +
        "%;background:" +
        debtColor +
        ';border-radius:2px;"></div>' +
        "</div>" +
        '<span style="font-size:10px;color:var(--text-muted);width:30px;text-align:right;">' +
        value.toFixed(0) +
        "</span>" +
        "</div>";
    }
  }

  // 技术债历史趋势
  let historyHtml = "";
  if (product.techDebtHistory && product.techDebtHistory.length > 0) {
    const last5 = product.techDebtHistory.slice(-10);
    historyHtml =
      '<div style="margin-top:12px;">' +
      '<div style="font-size:11px;font-weight:bold;margin-bottom:6px;">📈 技术债趋势</div>' +
      '<div style="display:flex;align-items:flex-end;height:60px;gap:2px;">';
    const maxDebt = Math.max(...last5.map((h) => h.debt), 1);
    for (const h of last5) {
      const barH = (h.debt / maxDebt) * 50;
      const barColor =
        h.debt >= 70
          ? "var(--danger)"
          : h.debt >= 40
            ? "var(--warning)"
            : "var(--success)";
      historyHtml +=
        '<div style="flex:1;background:' +
        barColor +
        ";height:" +
        barH +
        'px;border-radius:2px 2px 0 0;" title="第' +
        h.day +
        "天: " +
        h.debt.toFixed(0) +
        '"></div>';
    }
    historyHtml += "</div></div>";
  }

  // Bug 率历史
  let bugHistoryHtml = "";
  if (product.bugHistory && product.bugHistory.length > 0) {
    const last5 = product.bugHistory.slice(-10);
    bugHistoryHtml =
      '<div style="margin-top:8px;">' +
      '<div style="font-size:11px;font-weight:bold;margin-bottom:6px;">🐛 Bug 率趋势</div>' +
      '<div style="display:flex;align-items:flex-end;height:40px;gap:2px;">';
    const maxBug = Math.max(...last5.map((h) => h.bugRate), 0.1);
    for (const h of last5) {
      const barH = (h.bugRate / maxBug) * 30;
      bugHistoryHtml +=
        '<div style="flex:1;background:var(--danger);height:' +
        barH +
        'px;border-radius:2px 2px 0 0;" title="第' +
        h.day +
        "天: " +
        h.bugRate.toFixed(2) +
        '"></div>';
    }
    bugHistoryHtml += "</div></div>";
  }

  const html =
    '<div style="font-size:12px;max-height:60vh;overflow-y:auto;">' +
    // 当前状态
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px;">' +
    _metricCard("🔧 技术债", debt.toFixed(0), debtLevel, debtColor) +
    _metricCard(
      "🐛 Bug率",
      product.bugRate.toFixed(2) + "/千用户",
      "每千用户每日bug数",
    ) +
    _metricCard("📅 上次重构", "第" + product.lastRefactorDay + "天", "") +
    _metricCard(
      "⚡ 重构加成",
      product.refactorBonus > 0 ? "+" + product.refactorBonus.toFixed(0) : "无",
      product.refactorBonus > 0 ? "短期效率提升" : "",
    ) +
    "</div>" +
    // 技术债来源
    '<div style="margin-bottom:12px;">' +
    '<div style="font-size:11px;font-weight:bold;margin-bottom:6px;">📊 技术债来源</div>' +
    '<div style="font-size:10px;">' +
    sourcesHtml +
    "</div>" +
    "</div>" +
    // 趋势图
    historyHtml +
    bugHistoryHtml +
    // 危机历史
    (product.crisisHistory && product.crisisHistory.length > 0
      ? '<div style="margin-top:12px;">' +
        '<div style="font-size:11px;font-weight:bold;margin-bottom:6px;color:var(--danger);">💥 危机历史</div>' +
        '<div style="font-size:10px;color:var(--text-muted);">' +
        product.crisisHistory
          .map((c) => c.type + "（第" + c.day + "天）")
          .join(" | ") +
        "</div></div>"
      : "") +
    // 重构操作
    '<div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">' +
    '<div style="font-size:12px;font-weight:bold;margin-bottom:12px;">🔧 重构操作</div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">' +
    '<button class="btn btn-sm btn-success" onclick="showRefactorConfirm(\'' +
    product.id +
    '\',\'minor\')" style="font-size:11px;">小范围重构 ¥15k<br><span style="font-size:9px;color:var(--text-muted);">技术债-5~10</span></button>' +
    '<button class="btn btn-sm btn-success" onclick="showRefactorConfirm(\'' +
    product.id +
    '\',\'major\')" style="font-size:11px;">全面重构 ¥50k<br><span style="font-size:9px;color:var(--text-muted);">技术债-15~30</span></button>' +
    '<button class="btn btn-sm btn-warning" onclick="showRefactorConfirm(\'' +
    product.id +
    '\',\'emergency\')" style="font-size:11px;">紧急修复 ¥30k<br><span style="font-size:9px;color:var(--text-muted);">技术债-3~8</span></button>' +
    "</div>" +
    '<div style="margin-top:8px;font-size:10px;color:var(--text-muted);">' +
    "💡 重构可降低技术债，提升产品质量和开发效率。技术债越高，bug率越高，竞争力越低。" +
    "</div>" +
    "</div>" +
    "</div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "🔧 「" + product.name + "」技术债",
    body: html,
    buttons: [{ text: "关闭", cls: "", callback: function () {} }],
  });
}

/** 显示重构确认弹窗 */
function showRefactorConfirm(productId, scope) {
  const state = StateManager.getState();
  const company = state.startup.company;
  if (!company) return;

  const product = company.products.find((p) => p.id === productId);
  if (!product) return;

  const scopes = {
    minor: {
      name: "小范围重构",
      cost: 15000,
      debtReduction: "5~10",
      time: "7天",
    },
    major: {
      name: "全面重构",
      cost: 50000,
      debtReduction: "15~30",
      time: "14天",
    },
    emergency: {
      name: "紧急修复",
      cost: 30000,
      debtReduction: "3~8",
      time: "3天",
    },
  };

  const s = scopes[scope];
  if (!s) return;

  const html =
    '<div style="font-size:13px;">' +
    "<p>确定要对 <strong>「" +
    product.name +
    "」</strong> 执行 <strong>" +
    s.name +
    "</strong> 吗？</p>" +
    '<div style="padding:10px;background:var(--bg-secondary);border-radius:6px;margin:12px 0;font-size:11px;">' +
    "💰 费用：¥" +
    s.cost.toLocaleString() +
    "<br>" +
    "📉 技术债减少：~" +
    s.debtReduction +
    "<br>" +
    "⏱ 开发周期：约" +
    s.time +
    "<br>" +
    "💡 当前现金：¥" +
    Math.round(company.cashReserve).toLocaleString() +
    "</div>" +
    '<div style="font-size:10px;color:var(--text-muted);">' +
    "⚠️ 重构期间无法进行其他开发操作，但可继续正常运营。" +
    "</div>" +
    "</div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "🔧 重构确认",
    body: html,
    buttons: [
      { text: "取消", cls: "", callback: function () {} },
      {
        text: "确认重构",
        cls: "btn-success",
        callback: function () {
          const result = refactorProduct(state, productId, scope);
          if (result.success) {
            StateManager.addMessage("✅ " + result.message, "success");
            renderAll();
          } else {
            StateManager.addMessage("⚠️ " + result.message, "warning");
          }
        },
      },
    ],
  });
}

// ====== P0-2: AARRR 数据面板弹窗 ======
/** 显示 AARRR 增长漏斗数据面板 */
function showAARRRDashboard(productId) {
  const state = StateManager.getState();
  const company = state.startup.company;
  if (!company) return;

  const product = company.products.find((p) => p.id === productId);
  if (!product || product.status !== "launched" || product.retired) {
    StateManager.addMessage("产品不存在", "warning");
    return;
  }

  // LTV/CAC 比率
  const ltvcacRatio =
    product.cac > 0 && product.ltv > 0 ? product.ltv / product.cac : 0;
  const ltvcacColor =
    ltvcacRatio >= 3
      ? "var(--success)"
      : ltvcacRatio >= 1
        ? "var(--warning)"
        : ltvcacRatio > 0
          ? "var(--danger)"
          : "var(--text-muted)";

  // 漏斗可视化
  const funnel = product.funnelData || {};
  const funnelMax = Math.max(
    1,
    funnel.impressions,
    funnel.clicks,
    funnel.registrations,
    funnel.activated,
    funnel.paying,
  );

  const html =
    '<div style="font-size:12px;max-height:70vh;overflow-y:auto;">' +
    // 漏斗标题
    '<div style="text-align:center;margin-bottom:16px;">' +
    '<h4 style="margin:0 0 8px;">📊 「' +
    product.name +
    "」增长漏斗</h4>" +
    '<div style="font-size:10px;color:var(--text-muted);">累计数据（产品发布至今）</div>' +
    "</div>" +
    // 漏斗图
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:20px;">' +
    _renderFunnelBar("曝光", funnel.impressions, funnelMax, 100) +
    _renderFunnelBar("点击", funnel.clicks, funnelMax, 80) +
    _renderFunnelBar("注册", funnel.registrations, funnelMax, 60) +
    _renderFunnelBar("激活", funnel.activated, funnelMax, 45) +
    _renderFunnelBar("7日留存", funnel.retainedD7, funnelMax, 35) +
    _renderFunnelBar("30日留存", funnel.retainedD30, funnelMax, 25) +
    _renderFunnelBar("付费", funnel.paying, funnelMax, 15) +
    _renderFunnelBar("推荐", funnel.referred, funnelMax, 10) +
    "</div>" +
    // 关键指标
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:16px;">' +
    _metricCard(
      "💰 ARPU",
      "¥" + product.arpu.toFixed(2) + "/天",
      "每用户日均收入",
    ) +
    _metricCard(
      "💎 LTV",
      "¥" + Math.round(product.ltv).toLocaleString(),
      "用户生命周期价值",
    ) +
    _metricCard(
      "📢 CAC",
      product.cac > 0 ? "¥" + product.cac.toFixed(0) : "—",
      "获客成本",
    ) +
    _metricCard(
      "📈 LTV/CAC",
      ltvcacRatio > 0 ? ltvcacRatio.toFixed(1) + "x" : "—",
      ltvcacRatio >= 3 ? "优秀" : ltvcacRatio >= 1 ? "健康" : "需优化",
      ltvcacColor,
    ) +
    _metricCard(
      "🚀 K因子",
      product.kFactor.toFixed(2),
      product.kFactor >= 1 ? "病毒传播" : "自然增长",
    ) +
    _metricCard(
      "💳 付费率",
      (product.payRate * 100).toFixed(1) + "%",
      "付费用户占比",
    ) +
    "</div>" +
    // 留存数据
    '<div style="margin-bottom:16px;">' +
    '<div style="font-weight:bold;margin-bottom:8px;font-size:12px;">📈 留存率</div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">' +
    _metricCard("次日 D1", (product.retentionD1 * 100).toFixed(0) + "%", "") +
    _metricCard("7日 D7", (product.retentionD7 * 100).toFixed(0) + "%", "") +
    _metricCard("30日 D30", (product.retentionD30 * 100).toFixed(0) + "%", "") +
    "</div>" +
    "</div>" +
    // 活跃用户
    '<div style="margin-bottom:16px;">' +
    '<div style="font-weight:bold;margin-bottom:8px;font-size:12px;">👥 活跃用户</div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">' +
    _metricCard("DAU", (product.dau || 0).toLocaleString(), "日活") +
    _metricCard("WAU", (product.wau || 0).toLocaleString(), "周活") +
    _metricCard("MAU", (product.mau || 0).toLocaleString(), "月活") +
    "</div>" +
    "</div>" +
    // 运营操作
    '<div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">' +
    '<div style="font-weight:bold;margin-bottom:12px;font-size:12px;">⚡ 运营操作</div>' +
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">' +
    '<button class="btn btn-sm btn-primary" onclick="showMonetizationActionModal(\'' +
    product.id +
    "', 'improve_onboarding')\" style=\"font-size:11px;\">🎯 优化新手引导 ¥10k</button>" +
    '<button class="btn btn-sm btn-primary" onclick="showMonetizationActionModal(\'' +
    product.id +
    "', 'increase_payrate')\" style=\"font-size:11px;\">💰 提升付费转化 ¥20k</button>" +
    '<button class="btn btn-sm btn-primary" onclick="showMonetizationActionModal(\'' +
    product.id +
    "', 'improve_retention')\" style=\"font-size:11px;\">🔄 提升留存体验 ¥15k</button>" +
    '<button class="btn btn-sm btn-primary" onclick="showMonetizationActionModal(\'' +
    product.id +
    "', 'boost_viral')\" style=\"font-size:11px;\">🚀 病毒传播优化 ¥25k</button>" +
    "</div>" +
    '<div style="margin-top:8px;">' +
    '<button class="btn btn-sm btn-warning" onclick="showAdCampaignModal(\'' +
    product.id +
    '\')" style="font-size:11px;">📢 投放广告获客</button>' +
    "</div>" +
    "</div>" +
    "</div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "📊 AARRR 增长漏斗",
    body: html,
    buttons: [{ text: "关闭", cls: "", callback: function () {} }],
  });
}

/** 渲染漏斗条形图 */
function _renderFunnelBar(label, value, max, widthPercent) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const color =
    pct > 50 ? "var(--success)" : pct > 20 ? "var(--warning)" : "var(--danger)";
  return (
    '<div style="display:flex;align-items:center;margin-bottom:4px;">' +
    '<div style="width:60px;font-size:11px;text-align:right;margin-right:8px;">' +
    label +
    "</div>" +
    '<div style="width:' +
    widthPercent +
    '%;height:18px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">' +
    '<div style="width:' +
    pct +
    "%;height:100%;background:" +
    color +
    ';border-radius:3px;transition:width 0.3s;"></div>' +
    "</div>" +
    '<div style="width:70px;font-size:11px;text-align:left;margin-left:8px;color:var(--text-secondary);">' +
    (value || 0).toLocaleString() +
    "</div>" +
    "</div>"
  );
}

/** 渲染指标卡片 */
function _metricCard(title, value, subtitle, color) {
  color = color || "var(--text-primary)";
  return (
    '<div style="background:var(--bg-secondary);padding:8px;border-radius:6px;text-align:center;">' +
    '<div style="font-size:10px;color:var(--text-muted);">' +
    title +
    "</div>" +
    '<div style="font-size:14px;font-weight:bold;color:' +
    color +
    ';margin:2px 0;">' +
    value +
    "</div>" +
    (subtitle
      ? '<div style="font-size:9px;color:var(--text-muted);">' +
        subtitle +
        "</div>"
      : "") +
    "</div>"
  );
}

/** 显示运营操作确认弹窗 */
function showMonetizationActionModal(productId, action) {
  const state = StateManager.getState();
  const company = state.startup.company;
  if (!company) return;

  const product = company.products.find((p) => p.id === productId);
  if (!product) return;

  const actions = {
    improve_onboarding: {
      name: "优化新手引导",
      cost: 10000,
      desc: "提升新手引导完成率，增加激活率",
    },
    increase_payrate: {
      name: "提升付费转化",
      cost: 20000,
      desc: "优化付费点设计，提高付费率",
    },
    improve_retention: {
      name: "提升留存体验",
      cost: 15000,
      desc: "增加用户粘性功能，提升各阶段留存",
    },
    boost_viral: {
      name: "病毒传播优化",
      cost: 25000,
      desc: "优化分享机制，提升K因子",
    },
  };

  const act = actions[action];
  if (!act) return;

  const html =
    '<div style="font-size:13px;">' +
    "<p>确定要执行 <strong>" +
    act.name +
    "</strong> 吗？</p>" +
    '<div style="padding:10px;background:var(--bg-secondary);border-radius:6px;margin:12px 0;font-size:11px;">' +
    "💰 费用：¥" +
    act.cost.toLocaleString() +
    "<br>" +
    "📝 " +
    act.desc +
    "<br>" +
    "💡 当前现金：¥" +
    Math.round(company.cashReserve).toLocaleString() +
    "</div>" +
    "</div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "⚡ 运营操作确认",
    body: html,
    buttons: [
      { text: "取消", cls: "", callback: function () {} },
      {
        text: "确认执行",
        cls: "btn-primary",
        callback: function () {
          const result = updateProductMonetization(state, productId, action, {
            cost: act.cost,
          });
          if (result.success) {
            StateManager.addMessage("✅ " + result.message, "success");
            renderAll();
          } else {
            StateManager.addMessage("⚠️ " + result.message, "warning");
          }
        },
      },
    ],
  });
}

/** 显示广告投放弹窗 */
function showAdCampaignModal(productId) {
  const state = StateManager.getState();
  const company = state.startup.company;
  if (!company) return;

  const product = company.products.find((p) => p.id === productId);
  if (!product) return;

  const channels = [
    {
      key: "social",
      name: "社交媒体",
      desc: "微信/微博/抖音，适合大众产品",
      multiplier: 1.2,
      cac: 15,
    },
    {
      key: "search",
      name: "搜索广告",
      desc: "百度/谷歌，精准获客",
      multiplier: 1.0,
      cac: 25,
    },
    {
      key: "video",
      name: "视频平台",
      desc: "B站/优酷/爱奇艺，年轻用户",
      multiplier: 1.3,
      cac: 20,
    },
    {
      key: "influencer",
      name: "KOL合作",
      desc: "网红/博主推荐，信任度高",
      multiplier: 1.5,
      cac: 35,
    },
    {
      key: "programmatic",
      name: "程序化投放",
      desc: "自动优化，成本最低",
      multiplier: 0.9,
      cac: 12,
    },
  ];

  let html =
    '<div style="font-size:13px;">' +
    '<p style="color:var(--text-secondary);margin-bottom:12px;">选择广告渠道和预算：</p>' +
    '<div style="display:grid;grid-template-columns:1fr;gap:8px;">';

  for (const ch of channels) {
    const canAfford = company.cashReserve >= ch.cac * 1000;
    html +=
      '<div style="padding:10px;background:' +
      (canAfford ? "var(--bg-card)" : "rgba(0,0,0,0.1)") +
      ";border:1px solid " +
      (canAfford ? "var(--border)" : "#ccc") +
      ";border-radius:6px;cursor:pointer;transition:all 0.2s;" +
      (canAfford
        ? "onclick=\"showAdBudgetModal('" + productId + "','" + ch.key + "')\""
        : "opacity:0.5;") +
      '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;">' +
      "<strong>" +
      ch.name +
      "</strong>" +
      '<span style="font-size:11px;color:' +
      (canAfford ? "var(--success)" : "var(--danger)") +
      ';">预估CAC¥' +
      ch.cac +
      "</span>" +
      "</div>" +
      '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">' +
      ch.desc +
      "</div>" +
      "</div>";
  }

  html += "</div></div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "📢 投放广告",
    body: html,
    buttons: [{ text: "关闭", cls: "", callback: function () {} }],
  });
}

/** 显示广告预算输入弹窗 */
function showAdBudgetModal(productId, channel) {
  const state = StateManager.getState();
  const company = state.startup.company;

  const channelNames = {
    social: "社交媒体",
    search: "搜索广告",
    video: "视频平台",
    influencer: "KOL合作",
    programmatic: "程序化投放",
  };

  const html =
    '<div style="font-size:13px;">' +
    "<p>投放渠道：<strong>" +
    (channelNames[channel] || channel) +
    "</strong></p>" +
    "<p>预算范围：¥1,000 ~ ¥100,000</p>" +
    '<input type="range" id="adBudget" min="1000" max="100000" step="1000" value="5000" style="width:100%;margin:12px 0;">' +
    '<div id="adBudgetValue" style="font-size:16px;font-weight:bold;color:var(--accent);text-align:center;">¥5,000</div>' +
    "<script>" +
    'document.getElementById("adBudget").oninput = function() {' +
    '  document.getElementById("adBudgetValue").textContent = "¥" + parseInt(this.value).toLocaleString();' +
    "};" +
    "</scr" +
    "ipt>" +
    "</div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "广告预算",
    body: html,
    buttons: [
      { text: "取消", cls: "", callback: function () {} },
      {
        text: "投放",
        cls: "btn-warning",
        callback: function () {
          const budget = parseInt(document.getElementById("adBudget").value);
          const result = runAdCampaign(state, productId, channel, budget);
          if (result.success) {
            StateManager.addMessage(
              "📢 " +
                result.channel +
                "广告已投放，预计带来" +
                result.estimatedUsers +
                "新用户",
              "success",
            );
            renderAll();
          } else {
            StateManager.addMessage("⚠️ " + result.message, "warning");
          }
        },
      },
    ],
  });

  setTimeout(() => {
    const slider = document.getElementById("adBudget");
    const valueDisplay = document.getElementById("adBudgetValue");
    if (slider && valueDisplay) {
      slider.oninput = function () {
        valueDisplay.textContent = "¥" + parseInt(this.value).toLocaleString();
      };
    }
  }, 100);
}

// ====== P1-8: 模态框内联 action 包装函数 ======

function executePRActionFromModal(eventId) {
  const state = StateManager.getState();
  if (!state) return;
  const company = state.startup.company;
  if (!company) return;
  const result = executePREvent(state, eventId);
  if (result && result.success) {
    StateManager.addMessage(result.message || "公关活动执行成功", "success");
    renderAll();
  } else {
    StateManager.addMessage(result?.message || "公关活动执行失败", "warning");
  }
}

function executeMediaRelationActionFromModal(actionId) {
  const state = StateManager.getState();
  if (!state) return;
  const company = state.startup.company;
  if (!company) return;
  const result = executeMediaRelationAction(state, actionId);
  if (result && result.success) {
    StateManager.addMessage(
      result.message || "媒体关系行动执行成功",
      "success",
    );
    renderAll();
  } else {
    StateManager.addMessage(
      result?.message || "媒体关系行动执行失败",
      "warning",
    );
  }
}

function resolveCrisisActionFromModal(optionIndex) {
  const state = StateManager.getState();
  if (!state) return;
  const company = state.startup.company;
  if (!company || !company.pendingCrisisEvent) {
    StateManager.addMessage("没有待处理的危机事件", "warning");
    return;
  }
  const result = resolveCrisisEvent(state, optionIndex);
  if (result && result.success) {
    StateManager.addMessage(result.message || "危机应对成功", "success");
    renderAll();
  } else {
    StateManager.addMessage(result?.message || "危机应对失败", "warning");
  }
}

function executeLegalChecklistActionFromModal(checklistId) {
  const state = StateManager.getState();
  if (!state) return;
  const result = executeLegalChecklistAction(state, checklistId);
  if (result.success) {
    StateManager.addMessage(result.message, "success");
    renderAll();
  } else {
    StateManager.addMessage(result.message, "warning");
  }
}

function applyPatentFromModal(patentTypeId) {
  const state = StateManager.getState();
  if (!state) return;
  const result = applyPatent(state, patentTypeId);
  if (result.success) {
    StateManager.addMessage(result.message, "success");
    renderAll();
  } else {
    StateManager.addMessage(result.message, "warning");
  }
}

function buyLegalInsuranceFromModal(level) {
  const state = StateManager.getState();
  if (!state) return;
  const result = buyLegalInsurance(state, level);
  if (result.success) {
    StateManager.addMessage(result.message, "success");
    renderAll();
  } else {
    StateManager.addMessage(result.message, "warning");
  }
}

function executeLegalEventActionFromModal(eventId) {
  const state = StateManager.getState();
  if (!state) return;
  const company = state.startup.company;
  const eventTemplate = LEGAL_EVENT_TEMPLATES[eventId];
  if (!eventTemplate || eventTemplate.type !== "opportunity") {
    StateManager.addMessage("无效的法律行动", "warning");
    return;
  }
  if (company.legalBudget < eventTemplate.cost) {
    StateManager.addMessage("法律预算不足", "warning");
    return;
  }
  company.legalBudget -= eventTemplate.cost;
  company.legalSpent += eventTemplate.cost;
  if (eventTemplate.effects) {
    for (const [key, value] of Object.entries(eventTemplate.effects)) {
      if (key === "complianceLevel")
        company.complianceLevel = Math.min(
          100,
          company.complianceLevel + value,
        );
      else if (key === "legalRisk")
        company.legalRisk = Math.max(0, company.legalRisk + value);
    }
  }
  StateManager.addMessage(
    eventTemplate.icon + " " + eventTemplate.name + " 完成！",
    "success",
  );
  renderAll();
}

function resolveLegalActionFromModal(optionIndex) {
  const state = StateManager.getState();
  if (!state) return;
  const company = state.startup.company;
  if (!company || !company.pendingLegalEvent) return;
  const legalEvent = company.pendingLegalEvent;
  const eventTemplate = LEGAL_EVENT_TEMPLATES[legalEvent.eventTemplateId];
  if (!eventTemplate) return;
  const optionKey = eventTemplate.responseOptions[optionIndex];
  const response = LEGAL_RESPONSE_OPTIONS[optionKey];
  if (!response) return;
  if (company.legalBudget < response.cost) {
    StateManager.addMessage("法律预算不足", "warning");
    return;
  }
  company.legalBudget -= response.cost;
  company.legalSpent += response.cost;
  const effectiveness = _calculateLegalResponseEffectiveness(company, response);
  if (response.effect) {
    for (const [key, value] of Object.entries(response.effect)) {
      if (key === "legalRisk")
        company.legalRisk = Math.max(0, company.legalRisk + value);
      else if (key === "reputation" && company.reputation !== undefined)
        company.reputation = Math.max(
          0,
          Math.min(100, company.reputation + value),
        );
    }
  }
  if (effectiveness > 0.5)
    company.complianceLevel = Math.min(100, company.complianceLevel + 5);
  company.legalHistory.push({
    day: state.player.day,
    type: legalEvent.riskType,
    severity: legalEvent.severity,
    outcome: "resolved",
    financialImpact: response.cost,
  });
  if (company.legalHistory.length > 20)
    company.legalHistory = company.legalHistory.slice(-20);
  StateManager.addMessage(
    "法律事件处理：" +
      response.label +
      "，" +
      (effectiveness > 0.5 ? "成功" : "部分成功"),
    effectiveness > 0.5 ? "success" : "warning",
  );
  company.pendingLegalEvent = null;
  company.legalCasesActive = Math.max(0, company.legalCasesActive - 1);
  renderAll();
}

// ====== P2-11: 办公地点系统 Action Handlers ======

function upgradeOffice(state, targetLevel) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  if (!OFFICE_LOCATIONS[targetLevel]) {
    return { success: false, message: "无效的办公地点" };
  }

  const result = upgradeOfficeLocation(company, targetLevel, state.player.day);
  if (result.success) {
    StateManager.addMessage(result.message, "success");
    renderAll();
  } else {
    StateManager.addMessage(result.reason, "warning");
  }
  return result;
}

function downgradeOffice(state, targetLevel) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const result = downgradeOfficeLocation(
    company,
    targetLevel,
    state.player.day,
  );
  if (result.success) {
    StateManager.addMessage(result.message, "success");
    renderAll();
  } else {
    StateManager.addMessage(result.reason, "warning");
  }
  return result;
}

function showOfficeManagementModal(state) {
  const company = state.startup.company;
  if (!company) return;

  const currentOffice = OFFICE_LOCATIONS[company.officeLocation];
  const suggestion = getOfficeUpgradeSuggestion(company);
  const nextLevel = getNextOfficeLevel(company.officeLocation);

  let html = '<div style="font-size:13px;max-height:70vh;overflow-y:auto;">';

  // 当前办公地点
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;margin-bottom:12px;">';
  html += `<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">${currentOffice.icon} 当前办公地点</div>`;
  html += `<div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">${currentOffice.name} — ${currentOffice.desc}</div>`;
  html +=
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;font-size:12px;">';
  html += `<div>💰 月租: ¥${currentOffice.cost.toLocaleString()}</div>`;
  if (currentOffice.imageBonus)
    html += `<div>🏆 形象加成: ${currentOffice.imageBonus > 0 ? "+" : ""}${currentOffice.imageBonus}</div>`;
  if (currentOffice.recruitMod)
    html += `<div>👥 招聘修正: ${(currentOffice.recruitMod > 0 ? "+" : "") + (currentOffice.recruitMod * 100).toFixed(0)}%</div>`;
  if (currentOffice.loyaltyMod)
    html += `<div>💚 忠诚度修正: ${(currentOffice.loyaltyMod > 0 ? "+" : "") + (currentOffice.loyaltyMod * 100).toFixed(0)}%</div>`;
  if (currentOffice.techBonus)
    html += `<div>🔬 技术加成: +${currentOffice.techBonus}</div>`;
  if (currentOffice.marketBonus)
    html += `<div>📈 市场加成: +${currentOffice.marketBonus}</div>`;
  html += "</div>";
  html += "</div>";

  // 升级建议
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;margin-bottom:12px;">';
  html += `<div style="font-size:14px;font-weight:bold;margin-bottom:8px;">📊 升级建议</div>`;
  if (suggestion.canUpgrade) {
    html += `<div style="color:var(--success);margin-bottom:8px;">${suggestion.suggestion}</div>`;
    if (nextLevel && OFFICE_LOCATIONS[nextLevel]) {
      const nextOffice = OFFICE_LOCATIONS[nextLevel];
      html +=
        '<div style="font-size:12px;color:var(--text-muted);">下一级：</div>';
      html += `<div style="padding:8px;background:var(--background);border-radius:4px;">${nextOffice.icon} ${nextOffice.name}</div>`;
      html +=
        '<div style="margin-top:8px;display:grid;grid-template-columns:1fr auto;gap:8px;">';
      html += `<button class="btn btn-success" onclick="upgradeOffice(StateManager.getState(),'${nextLevel}')">升级 (¥${nextOffice.cost.toLocaleString()})</button>`;
      html += "</div>";
    }
  } else {
    html += `<div style="color:var(--warning);">${suggestion.suggestion}</div>`;
    if (nextLevel && OFFICE_LOCATIONS[nextLevel]) {
      const nextOffice = OFFICE_LOCATIONS[nextLevel];
      html += `<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">下一级：${nextOffice.icon} ${nextOffice.name}（月租¥${nextOffice.cost.toLocaleString()}）</div>`;
    }
  }
  html += "</div>";

  // 所有办公地点对比
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;">';
  html +=
    '<div style="font-size:14px;font-weight:bold;margin-bottom:8px;">🏢 所有办公地点</div>';
  html +=
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">';
  for (const levelId of OFFICE_UPGRADE_PATH) {
    const office = OFFICE_LOCATIONS[levelId];
    const isCurrent = levelId === company.officeLocation;
    const canUpgrade =
      OFFICE_UPGRADE_PATH.indexOf(levelId) ===
      OFFICE_UPGRADE_PATH.indexOf(company.officeLocation) + 1;
    html += `<div style="padding:8px;border-radius:4px;background:${isCurrent ? "var(--accent-bg)" : "var(--background)"};border:${isCurrent ? "2px solid var(--accent)" : "1px solid var(--border)"};opacity:${!isCurrent && !canUpgrade ? "0.7" : "1"}">`;
    html += `<div style="font-weight:bold;font-size:12px;">${office.icon} ${office.name}${isCurrent ? " ✓" : ""}</div>`;
    html += `<div style="font-size:11px;color:var(--text-muted);">${office.desc}</div>`;
    html += `<div style="font-size:11px;margin-top:4px;">💰 ¥${office.cost.toLocaleString()}/月</div>`;
    html += "</div>";
  }
  html += "</div>";
  html += "</div>";

  html += "</div>";

  StateManager.showModal({
    title: "🏢 办公地点管理",
    body: html,
    buttons: [
      { text: "关闭", style: "secondary", onClick: "StateManager.hideModal()" },
    ],
  });
}

// ====== P2-12: 企业文化系统 Action Handlers ======

function changeCulture(state, cultureId, reason) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  if (!COMPANY_CULTURES[cultureId]) {
    return { success: false, message: "无效的企业文化" };
  }

  const result = changeCompanyCulture(
    company,
    cultureId,
    state.player.day,
    reason,
  );
  if (result.success) {
    StateManager.addMessage(result.message, "success");
    renderAll();
  } else {
    StateManager.addMessage(result.reason, "warning");
  }
  return result;
}

function improveCultureAdoptionAction(state, amount) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const result = improveCultureAdoption(company, state.player.day, amount);
  if (result.success) {
    StateManager.addMessage(
      `文化适应度提升：${result.oldProgress.toFixed(1)}% → ${result.newProgress.toFixed(1)}%`,
      "success",
    );
    renderAll();
  }
  return result;
}

function showCultureManagementModal(state) {
  const company = state.startup.company;
  if (!company) return;

  const currentCulture = COMPANY_CULTURES[company.companyCulture];
  const suggestion = getCultureChangeSuggestion(company);

  let html = '<div style="font-size:13px;max-height:70vh;overflow-y:auto;">';

  // 当前文化
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;margin-bottom:12px;">';
  html += `<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">${currentCulture.icon} 当前企业文化</div>`;
  html += `<div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">${currentCulture.name} — ${currentCulture.desc}</div>`;

  // 文化效果
  html +=
    '<div style="font-size:12px;margin-bottom:8px;color:var(--text-secondary);">文化效果：</div>';
  html +=
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;font-size:11px;">';
  if (currentCulture.loyaltyMod)
    html += `<div>💚 忠诚度修正: ${(currentCulture.loyaltyMod > 0 ? "+" : "") + (currentCulture.loyaltyMod * 100).toFixed(0)}%</div>`;
  if (currentCulture.turnoverMod)
    html += `<div>📉 流失率修正: ${(currentCulture.turnoverMod < 1 ? "-" : "+") + ((currentCulture.turnoverMod - 1) * 100).toFixed(0)}%</div>`;
  if (currentCulture.productivityMod)
    html += `<div>⚡ 生产力修正: ${(currentCulture.productivityMod > 1 ? "+" : "") + ((currentCulture.productivityMod - 1) * 100).toFixed(0)}%</div>`;
  if (currentCulture.innovationMod)
    html += `<div>💡 创新修正: ${(currentCulture.innovationMod > 1 ? "+" : "") + ((currentCulture.innovationMod - 1) * 100).toFixed(0)}%</div>`;
  if (currentCulture.recruitMod)
    html += `<div>👥 招聘修正: ${(currentCulture.recruitMod > 0 ? "+" : "") + (currentCulture.recruitMod * 100).toFixed(0)}%</div>`;
  html += "</div>";

  // 适应度和冲突
  html +=
    '<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">';
  html += `<div style="margin-bottom:8px;">`;
  html += `<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">`;
  html += `<span>📊 文化适应度</span><span>${company.cultureAdoptionProgress.toFixed(0)}%</span>`;
  html += "</div>";
  html += `<div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;">`;
  html += `<div style="width:${company.cultureAdoptionProgress}%;height:100%;background:var(--success);"></div>`;
  html += "</div>";
  html += "</div>";

  html += `<div style="display:flex;justify-content:space-between;font-size:12px;">`;
  html += `<span>⚠️ 文化冲突等级</span><span style="color:${company.cultureConflictLevel >= 3 ? "var(--danger)" : company.cultureConflictLevel >= 1 ? "var(--warning)" : "var(--success)"}">${company.cultureConflictLevel.toFixed(1)}/4</span>`;
  html += "</div>";
  html += "</div>";

  html += "</div>";

  // 文化切换
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;margin-bottom:12px;">';
  html +=
    '<div style="font-size:14px;font-weight:bold;margin-bottom:8px;">🔄 切换文化</div>';
  html +=
    '<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">切换文化需要¥50,000，并重置适应度</div>';

  for (const culture of suggestion.availableCultures) {
    const canChange = culture.canChange;
    html += `<div style="padding:8px;background:var(--background);border-radius:4px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">`;
    html += `<div>`;
    html += `<div style="font-weight:bold;font-size:12px;">${culture.icon} ${culture.name}</div>`;
    html += `<div style="font-size:11px;color:var(--text-muted);">${culture.desc}</div>`;
    html += "</div>";
    if (canChange) {
      html += `<button class="btn btn-primary" onclick="changeCulture(StateManager.getState(),'${culture.key}','主动切换')">切换</button>`;
    } else {
      html += `<span style="font-size:11px;color:var(--warning);">${culture.reason}</span>`;
    }
    html += "</div>";
  }
  html += "</div>";

  // 文化对比
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;">';
  html +=
    '<div style="font-size:14px;font-weight:bold;margin-bottom:8px;">📊 文化对比</div>';
  html +=
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';
  for (const [key, culture] of Object.entries(COMPANY_CULTURES)) {
    const isCurrent = key === company.companyCulture;
    html += `<div style="padding:8px;border-radius:4px;background:${isCurrent ? "var(--accent-bg)" : "var(--background)"};border:${isCurrent ? "2px solid var(--accent)" : "1px solid var(--border)"};">`;
    html += `<div style="font-weight:bold;font-size:12px;text-align:center;">${culture.icon} ${culture.name}</div>`;
    html +=
      '<div style="font-size:10px;color:var(--text-muted);text-align:center;margin-top:4px;">';
    html += `忠诚 ${(culture.loyaltyMod > 0 ? "+" : "") + (culture.loyaltyMod * 100).toFixed(0)}% | `;
    html += `流失 ${(culture.turnoverMod < 1 ? "-" : "+") + ((culture.turnoverMod - 1) * 100).toFixed(0)}% | `;
    html += `生产 ${(culture.productivityMod > 1 ? "+" : "") + ((culture.productivityMod - 1) * 100).toFixed(0)}% | `;
    html += `创新 ${(culture.innovationMod > 1 ? "+" : "") + ((culture.innovationMod - 1) * 100).toFixed(0)}%`;
    html += "</div>";
    html += "</div>";
  }
  html += "</div>";
  html += "</div>";

  html += "</div>";

  StateManager.showModal({
    title: "🏛️ 企业文化管理",
    body: html,
    buttons: [
      { text: "关闭", style: "secondary", onClick: "StateManager.hideModal()" },
    ],
  });
}

// ====== P2-13: 合作伙伴系统 Action Handlers ======

function showPartnerManagementModal(state) {
  const company = state.startup.company;
  if (!company) return;

  let html = '<div style="font-size:13px;max-height:70vh;overflow-y:auto;">';

  // 合作伙伴列表
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;margin-bottom:12px;">';
  html +=
    '<div style="font-size:14px;font-weight:bold;margin-bottom:8px;">🤝 合作伙伴</div>';

  if (!company.partners || company.partners.length === 0) {
    html +=
      '<div style="font-size:12px;color:var(--text-muted);padding:16px;text-align:center;">暂无合作伙伴，点击下方按钮招募</div>';
  } else {
    for (const partner of company.partners) {
      const typeInfo = PARTNER_TYPES[partner.type];
      const trustColor =
        partner.trust >= 70
          ? "var(--success)"
          : partner.trust >= 50
            ? "var(--warning)"
            : "var(--danger)";
      const statusColor =
        partner.status === "active" ? "var(--success)" : "var(--text-muted)";

      html += `<div style="padding:10px;background:var(--background);border-radius:6px;margin-bottom:8px;border-left:4px solid ${trustColor}">`;
      html += `<div style="display:flex;justify-content:space-between;align-items:center;">`;
      html += `<div style="font-weight:bold;font-size:13px;">${typeInfo ? typeInfo.icon : "❓"} ${partner.name}</div>`;
      html += `<div style="font-size:11px;color:${statusColor};">${partner.status === "active" ? "✅ 活跃" : "🚪 已终止"}</div>`;
      html += "</div>";
      html += `<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">类型：${typeInfo ? typeInfo.name : partner.type} | 专注：${partner.focus}</div>`;
      html += `<div style="font-size:11px;margin-top:4px;">`;
      html += `信任度：<span style="color:${trustColor};font-weight:bold;">${partner.trust.toFixed(0)}%</span> | `;
      html += `合作级别：${partner.cooperationLevel.toFixed(1)} | `;
      html += `收入分成：${(partner.revenueShare * 100).toFixed(0)}%`;
      html += "</div>";

      // 信任度操作
      if (partner.status === "active") {
        html += '<div style="margin-top:8px;display:flex;gap:6px;">';
        html += `<button class="btn btn-small" onclick="improvePartnerTrustAction(StateManager.getState(),'${partner.id}',20,30000)">提升信任 (¥30k)</button>`;
        html += `<button class="btn btn-small btn-warning" onclick="terminatePartnerAction(StateManager.getState(),'${partner.id}','主动终止')">终止合作</button>`;
        html += "</div>";
      }
      html += "</div>";
    }
  }

  // 招募新伙伴
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;margin-top:12px;">';
  html +=
    '<div style="font-size:14px;font-weight:bold;margin-bottom:8px;">🆕 招募新伙伴</div>';
  html +=
    '<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">招募合作伙伴需要¥20,000，初始信任度50-70%</div>';
  html +=
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">';

  for (const [key, type] of Object.entries(PARTNER_TYPES)) {
    html += `<button class="btn btn-small" onclick="recruitPartnerAction(StateManager.getState(),'${key}')">`;
    html += `${type.icon} ${type.name}`;
    html += "</button>";
  }
  html += "</div>";
  html += "</div>";

  html += "</div>";

  StateManager.showModal({
    title: "🤝 合作伙伴管理",
    body: html,
    buttons: [
      { text: "关闭", style: "secondary", onClick: "StateManager.hideModal()" },
    ],
  });
}

function recruitPartnerAction(state, partnerType) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const recruitCost = 20000;
  if (company.cashReserve < recruitCost) {
    StateManager.addMessage("资金不足，招募合作伙伴需要¥20,000", "warning");
    return { success: false, reason: "资金不足" };
  }

  company.cashReserve -= recruitCost;
  const partner = createPartner(company, partnerType, state.player.day);

  StateManager.addMessage(
    `🤝 成功招募合作伙伴「${partner.name}」（${PARTNER_TYPES[partnerType].name}），初始信任度${partner.trust.toFixed(0)}%`,
    "success",
  );
  renderAll();

  return { success: true, partner: getPartnerSummary(partner) };
}

function improvePartnerTrustAction(state, partnerId, amount, cost) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const result = improvePartnerTrust(
    company,
    partnerId,
    state.player.day,
    amount,
    cost,
  );
  if (result.success) {
    StateManager.addMessage(result.message, "success");
    renderAll();
  } else {
    StateManager.addMessage(result.reason, "warning");
  }
  return result;
}

function terminatePartnerAction(state, partnerId, reason) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const result = terminatePartner(company, partnerId, state.player.day, reason);
  if (result.success) {
    StateManager.addMessage(result.message, "warning");
    renderAll();
  } else {
    StateManager.addMessage(result.reason, "warning");
  }
  return result;
}

// ====== P2-14: 产品定价策略 Action Handlers ======

function showPricingManagementModal(state) {
  const company = state.startup.company;
  if (!company) return;

  let html = '<div style="font-size:13px;max-height:70vh;overflow-y:auto;">';

  // 当前定价策略
  const currentPricing =
    PRICING_MODELS[company.pricingStrategy] || PRICING_MODELS.tiered;
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;margin-bottom:12px;">';
  html += `<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">${currentPricing.icon} 当前定价策略</div>`;
  html += `<div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">${currentPricing.name} — ${currentPricing.desc}</div>`;
  html +=
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;font-size:11px;">';
  html += `<div>📊 收入稳定性: ${(currentPricing.revenueStability >= 1 ? "+" : "") + (currentPricing.revenueStability - 1).toFixed(1)}x</div>`;
  html += `<div>🚀 增长潜力: ${(currentPricing.growthPotential >= 1 ? "+" : "") + (currentPricing.growthPotential - 1).toFixed(1)}x</div>`;
  html += "</div>";
  html += "</div>";

  // 产品定价
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;margin-bottom:12px;">';
  html +=
    '<div style="font-size:14px;font-weight:bold;margin-bottom:8px;">📱 产品定价</div>';

  for (const product of company.products.filter(
    (p) => p.status === "launched",
  )) {
    const category = PRODUCT_CATEGORIES[product.category];
    const elasticity = getPriceElasticity(product);
    const optimal = calculateOptimalPrice(
      product,
      company,
      state.startup.competitors || [],
    );

    html += `<div style="padding:10px;background:var(--background);border-radius:6px;margin-bottom:8px;">`;
    html += `<div style="font-weight:bold;font-size:12px;">${category ? category.icon : "📦"} ${product.name}</div>`;
    html += `<div style="font-size:11px;color:var(--text-muted);">`;
    html += `当前价格: ¥${(product.currentPrice || 0).toLocaleString()} | `;
    html += `建议价格: ¥${optimal.optimalPrice.toLocaleString()} | `;
    html += `弹性: ${elasticity.interpretation}（${elasticity.elasticity.toFixed(2)}）`;
    html += "</div>";

    // 价格调整
    html += '<div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap;">';
    html += `<button class="btn btn-small" onclick="adjustProductPrice(StateManager.getState(),'${product.id}',${optimal.optimalPrice},'建议调整')">调整至建议价</button>`;
    html += `<button class="btn btn-small" onclick="runProductABTest(StateManager.getState(),'${product.id}')">A/B测试</button>`;
    html += "</div>";
    html += "</div>";
  }
  html += "</div>";

  // 切换定价策略
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;">';
  html +=
    '<div style="font-size:14px;font-weight:bold;margin-bottom:8px;">🔄 切换定价策略</div>';
  html +=
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">';

  for (const [key, model] of Object.entries(PRICING_MODELS)) {
    const isCurrent = key === company.pricingStrategy;
    html += `<button class="btn btn-small" style="${isCurrent ? "background:var(--accent);color:white;" : ""}" onclick="switchPricingStrategy(StateManager.getState(),'${key}')">`;
    html += `${model.icon} ${model.name}`;
    html += "</button>";
  }
  html += "</div>";
  html += "</div>";

  html += "</div>";

  StateManager.showModal({
    title: "💰 产品定价管理",
    body: html,
    buttons: [
      { text: "关闭", style: "secondary", onClick: "StateManager.hideModal()" },
    ],
  });
}

function adjustProductPrice(state, productId, newPrice, reason) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const product = company.products.find((p) => p.id === productId);
  if (!product) return { success: false, message: "产品不存在" };

  const result = applyPriceChange(product, newPrice, state.player.day, reason);
  if (result.success) {
    StateManager.addMessage(result.message, "success");
    if (!company.priceHistory) company.priceHistory = [];
    company.priceHistory.push({
      productId: productId,
      productName: product.name,
      oldPrice: result.oldPrice,
      newPrice: result.newPrice,
      changePercent: result.changePercent,
      day: state.player.day,
      reason: reason,
    });
    renderAll();
  }
  return result;
}

function runProductABTest(state, productId) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const product = company.products.find((p) => p.id === productId);
  if (!product) return { success: false, message: "产品不存在" };

  const currentPrice = product.currentPrice || 100;
  const priceA = Math.round(currentPrice * 0.9);
  const priceB = Math.round(currentPrice * 1.1);
  const sampleSize = 1000;

  const result = runABTest(
    product,
    priceA,
    priceB,
    sampleSize,
    state.player.day,
  );
  if (result.success) {
    StateManager.addMessage(result.message, "success");
    if (!company.abTestHistory) company.abTestHistory = [];
    company.abTestHistory.push(result.test);
    renderAll();
  }
  return result;
}

function switchPricingStrategy(state, strategy) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  if (!PRICING_MODELS[strategy]) {
    StateManager.addMessage("无效的定价策略", "warning");
    return { success: false, reason: "无效策略" };
  }

  const oldStrategy = company.pricingStrategy;
  company.pricingStrategy = strategy;

  StateManager.addMessage(
    `🔄 定价策略从「${PRICING_MODELS[oldStrategy].name}」切换到「${PRICING_MODELS[strategy].name}」`,
    "success",
  );
  renderAll();

  return { success: true, oldStrategy: oldStrategy, newStrategy: strategy };
}

// ====== P2-15: 供应链系统 Action Handlers ======

function showSupplyChainManagementModal(state) {
  const company = state.startup.company;
  if (!company) return;

  const risk = getSupplyChainRisk(company);

  let html = '<div style="font-size:13px;max-height:70vh;overflow-y:auto;">';

  // 供应链风险
  const riskColor =
    risk.level === "critical"
      ? "var(--danger)"
      : risk.level === "high"
        ? "var(--warning)"
        : risk.level === "medium"
          ? "#f39c12"
          : "var(--success)";
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;margin-bottom:12px;">';
  html += `<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">📦 供应链风险</div>`;
  html += `<div style="display:flex;align-items:center;gap:12px;">`;
  html += `<div style="font-size:32px;font-weight:bold;color:${riskColor};">${risk.risk}%</div>`;
  html += `<div>`;
  html += `<div style="font-size:12px;color:var(--text-muted);">风险等级：<span style="color:${riskColor};font-weight:bold;">${risk.level.toUpperCase()}</span></div>`;
  html += `<div style="font-size:11px;color:var(--text-muted);">活跃供应商：${risk.suppliers}家</div>`;
  html += "</div>";
  html += "</div>";

  // 风险进度条
  html +=
    '<div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden;margin-top:8px;">';
  html += `<div style="width:${risk.risk}%;height:100%;background:${riskColor};"></div>`;
  html += "</div>";
  html += "</div>";

  // 供应商列表
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;margin-bottom:12px;">';
  html +=
    '<div style="font-size:14px;font-weight:bold;margin-bottom:8px;">🏭 供应商</div>';

  if (!company.suppliers || company.suppliers.length === 0) {
    html +=
      '<div style="font-size:12px;color:var(--text-muted);padding:16px;text-align:center;">暂无供应商，点击下方按钮添加</div>';
  } else {
    for (const supplier of company.suppliers) {
      if (supplier.status !== "active") continue;

      const typeInfo = SUPPLIER_TYPES[supplier.type];
      const qualityColor =
        supplier.quality >= 80
          ? "var(--success)"
          : supplier.quality >= 60
            ? "var(--warning)"
            : "var(--danger)";

      html += `<div style="padding:10px;background:var(--background);border-radius:6px;margin-bottom:8px;">`;
      html += `<div style="display:flex;justify-content:space-between;align-items:center;">`;
      html += `<div style="font-weight:bold;font-size:13px;">${typeInfo ? typeInfo.icon : "❓"} ${supplier.name}</div>`;
      html += `<div style="font-size:11px;color:var(--text-muted);">${supplier.type}</div>`;
      html += "</div>";
      html += `<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">专注：${supplier.focus}</div>`;
      html += `<div style="font-size:11px;margin-top:4px;">`;
      html += `质量: <span style="color:${qualityColor};font-weight:bold;">${supplier.quality.toFixed(0)}%</span> | `;
      html += `可靠性: ${supplier.reliability.toFixed(0)}% | `;
      html += `交期: ${supplier.leadTime}天 | `;
      html += `价格: ¥${Math.round(supplier.price).toLocaleString()}`;
      html += "</div>";

      // 质量调整
      html +=
        '<div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap;">';
      html += `<button class="btn btn-small" onclick="updateSupplierQualityAction(StateManager.getState(),'${supplier.id}',5,'质量提升')">提升质量</button>`;
      html += `<button class="btn btn-small btn-warning" onclick="updateSupplierQualityAction(StateManager.getState(),'${supplier.id}',-5,'质量下降')">降低质量</button>`;
      html += "</div>";
      html += "</div>";
    }
  }

  // 添加供应商
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;margin-top:12px;">';
  html +=
    '<div style="font-size:14px;font-weight:bold;margin-bottom:8px;">🆕 添加供应商</div>';
  html +=
    '<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">添加供应商需要¥50,000初始投入</div>';
  html +=
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">';

  for (const [key, type] of Object.entries(SUPPLIER_TYPES)) {
    html += `<button class="btn btn-small" onclick="addSupplierAction(StateManager.getState(),'${key}')">`;
    html += `${type.icon} ${type.name}`;
    html += "</button>";
  }
  html += "</div>";
  html += "</div>";

  // 库存管理
  html +=
    '<div style="padding:12px;background:var(--surface);border-radius:8px;">';
  html +=
    '<div style="font-size:14px;font-weight:bold;margin-bottom:8px;">📦 库存管理</div>';

  for (const [typeKey, typeInfo] of Object.entries(INVENTORY_TYPES)) {
    const inv = company.inventory[typeKey] || { quantity: 0, value: 0 };
    const isCritical = inv.quantity < typeInfo.criticalLevel;

    html += `<div style="padding:8px;background:var(--background);border-radius:4px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">`;
    html += `<div>`;
    html += `<div style="font-weight:bold;font-size:12px;">${typeInfo.icon} ${typeInfo.name}</div>`;
    html += `<div style="font-size:11px;color:var(--text-muted);">`;
    html += `数量: <span style="color:${isCritical ? "var(--danger)" : "var(--success)"}">${inv.quantity}</span> | `;
    html += `价值: ¥${inv.value.toLocaleString()} | `;
    html += `警戒线: ${typeInfo.criticalLevel}`;
    html += "</div>";
    html += "</div>";
    html += `<div style="display:flex;gap:4px;">`;
    html += `<button class="btn btn-small" onclick="manageInventoryAction(StateManager.getState(),'${typeKey}','add',50)">+50</button>`;
    html += `<button class="btn btn-small" onclick="manageInventoryAction(StateManager.getState(),'${typeKey}','consume',50)">-50</button>`;
    html += "</div>";
    html += "</div>";
  }
  html += "</div>";

  html += "</div>";

  StateManager.showModal({
    title: "📦 供应链管理",
    body: html,
    buttons: [
      { text: "关闭", style: "secondary", onClick: "StateManager.hideModal()" },
    ],
  });
}

function addSupplierAction(state, supplierType) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const addCost = 50000;
  if (company.cashReserve < addCost) {
    StateManager.addMessage("资金不足，添加供应商需要¥50,000", "warning");
    return { success: false, reason: "资金不足" };
  }

  company.cashReserve -= addCost;
  const supplier = createSupplier(company, supplierType, state.player.day);

  StateManager.addMessage(
    `🏭 成功添加供应商「${supplier.name}」（${SUPPLIER_TYPES[supplierType].name}），质量${supplier.quality.toFixed(0)}%`,
    "success",
  );
  renderAll();

  return { success: true, supplier: supplier };
}

function updateSupplierQualityAction(state, supplierId, change, reason) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const result = updateSupplierQuality(
    company,
    supplierId,
    state.player.day,
    change,
    reason,
  );
  if (result.success) {
    StateManager.addMessage(result.message, change > 0 ? "success" : "warning");
    renderAll();
  } else {
    StateManager.addMessage(result.reason, "warning");
  }
  return result;
}

function manageInventoryAction(state, inventoryType, action, amount) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const result = manageInventory(
    company,
    inventoryType,
    action,
    amount,
    state.player.day,
  );
  if (result.success) {
    StateManager.addMessage(result.message, "success");
    renderAll();
  } else {
    StateManager.addMessage(result.reason, "warning");
  }
  return result;
}
