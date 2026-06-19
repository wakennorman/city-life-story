/**
 * 玩家创业系统 — 从0到1再到退出的完整创业模拟
 *
 * Phase 2 核心：玩家注册公司→招聘→做项目→融资→IPO/被收购/破产
 *
 * 三阶段模型：
 *   种子期：产品开发、找联合创始人、申请创业基金
 *   成长期：招聘、A/B轮融资、市场扩张
 *   退出期：IPO上市 / 被收购 / 破产清算
 */

// ====== 行业定义 ======
const STARTUP_INDUSTRIES = {
  tech: {
    name: "科技",
    icon: "💻",
    baseValuation: 2000000,
    avgBurnRate: 80000,
    keySkills: ["coding", "english"],
    desc: "互联网/软件/AI，高增长高波动",
  },
  consumer: {
    name: "消费",
    icon: "🛍️",
    baseValuation: 1000000,
    avgBurnRate: 50000,
    keySkills: ["sales", "cooking"],
    desc: "零售/餐饮/品牌，稳定但增长慢",
  },
  finance: {
    name: "金融科技",
    icon: "💳",
    baseValuation: 3000000,
    avgBurnRate: 100000,
    keySkills: ["accounting", "management"],
    desc: "支付/理财/保险科技，政策敏感",
  },
  healthcare: {
    name: "医疗健康",
    icon: "🏥",
    baseValuation: 2500000,
    avgBurnRate: 90000,
    keySkills: ["management"],
    desc: "医疗/医药/健康服务，监管严格",
  },
  education: {
    name: "教育",
    icon: "📚",
    baseValuation: 800000,
    avgBurnRate: 40000,
    keySkills: ["english", "management"],
    desc: "培训/在线教育/内容，受政策影响大",
  },
  manufacturing: {
    name: "制造",
    icon: "🏭",
    baseValuation: 1500000,
    avgBurnRate: 70000,
    keySkills: ["repair", "electrician"],
    desc: "硬件/智能设备/新材料，重资产",
  },
};

// ====== 员工角色定义 ======
const EMPLOYEE_ROLES = {
  engineer: {
    name: "工程师",
    icon: "🔧",
    baseSalary: 15000,
    baseProductivity: 1.0,
    skillFocus: "coding",
    desc: "产品开发核心",
  },
  designer: {
    name: "设计师",
    icon: "🎨",
    baseSalary: 12000,
    baseProductivity: 0.8,
    skillFocus: "design",
    desc: "产品体验优化",
  },
  sales: {
    name: "销售",
    icon: "💼",
    baseSalary: 10000,
    baseProductivity: 1.2,
    skillFocus: "sales",
    desc: "市场拓展",
  },
  marketing: {
    name: "市场",
    icon: "📢",
    baseSalary: 12000,
    baseProductivity: 0.9,
    skillFocus: "marketing",
    desc: "品牌推广",
  },
  ops: {
    name: "运营",
    icon: "⚙️",
    baseSalary: 8000,
    baseProductivity: 0.7,
    skillFocus: "management",
    desc: "日常运营维护",
  },
  finance: {
    name: "财务",
    icon: "📊",
    baseSalary: 10000,
    baseProductivity: 0.6,
    skillFocus: "accounting",
    desc: "财务合规管理",
  },
};

// ====== 融资轮次定义 ======
const FUNDING_ROUNDS = {
  seed: {
    name: "种子轮",
    icon: "🌱",
    minValuation: 500000,
    minRevenue: 0,
    minEmployees: 1,
    maxRaise: 500000,
    equityDilution: [0.1, 0.2], // 出让10-20%
    investorTypes: ["angel", "family_office"],
    desc: "验证想法，组建核心团队",
  },
  A: {
    name: "A轮",
    icon: "📈",
    minValuation: 3000000,
    minRevenue: 100000,
    minEmployees: 5,
    maxRaise: 3000000,
    equityDilution: [0.15, 0.25],
    investorTypes: ["vc", "cvc"],
    desc: "产品验证后规模化扩张",
  },
  B: {
    name: "B轮",
    icon: "🚀",
    minValuation: 15000000,
    minRevenue: 500000,
    minEmployees: 15,
    maxRaise: 10000000,
    equityDilution: [0.1, 0.2],
    investorTypes: ["vc", "pe", "cvc"],
    desc: "市场扩张，建立壁垒",
  },
  C: {
    name: "C轮",
    icon: "🌍",
    minValuation: 50000000,
    minRevenue: 2000000,
    minEmployees: 50,
    maxRaise: 30000000,
    equityDilution: [0.05, 0.15],
    investorTypes: ["pe", "soe", "strategic"],
    desc: "准备IPO前的最后一轮",
  },
};

// ====== 投资人类型定义 ======
const INVESTOR_TYPES = {
  angel: {
    name: "天使投资人",
    icon: "👼",
    avgCheck: 250000,
    equityReq: [0.05, 0.15],
    terms: "宽松，重人轻数据",
    risk: "低",
  },
  family_office: {
    name: "家族办公室",
    icon: "🏛️",
    avgCheck: 500000,
    equityReq: [0.08, 0.18],
    terms: "稳健，偏好成熟项目",
    risk: "低",
  },
  vc: {
    name: "风险投资",
    icon: "💰",
    avgCheck: 2000000,
    equityReq: [0.15, 0.3],
    terms: "激进，追求高回报",
    risk: "中",
  },
  cvc: {
    name: "企业风投",
    icon: "🏢",
    avgCheck: 3000000,
    equityReq: [0.1, 0.2],
    terms: "战略协同优先",
    risk: "中",
  },
  pe: {
    name: "私募股权",
    icon: "🦈",
    avgCheck: 10000000,
    equityReq: [0.1, 0.25],
    terms: "要求对赌和回购条款",
    risk: "高",
  },
  soe: {
    name: "国资基金",
    icon: "🇨🇳",
    avgCheck: 15000000,
    equityReq: [0.05, 0.15],
    terms: "政策导向，审批慢",
    risk: "低",
  },
  strategic: {
    name: "战略投资人",
    icon: "🤝",
    avgCheck: 20000000,
    equityReq: [0.1, 0.3],
    terms: "可能涉及业务整合",
    risk: "高",
  },
};

// ====== 产品类别 ======
const PRODUCT_CATEGORIES = {
  app: {
    name: "移动应用",
    icon: "📱",
    baseDevTime: 60, // 天
    baseCost: 50000,
    revenueModel: "订阅/广告/内购",
  },
  saas: {
    name: "SaaS平台",
    icon: "☁️",
    baseDevTime: 90,
    baseCost: 100000,
    revenueModel: "订阅制",
  },
  hardware: {
    name: "智能硬件",
    icon: "🔌",
    baseDevTime: 120,
    baseCost: 200000,
    revenueModel: "销售",
  },
  content: {
    name: "内容平台",
    icon: "📖",
    baseDevTime: 45,
    baseCost: 30000,
    revenueModel: "广告/订阅",
  },
  marketplace: {
    name: "交易平台",
    icon: "🛒",
    baseDevTime: 80,
    baseCost: 80000,
    revenueModel: "佣金",
  },
  ai_service: {
    name: "AI服务",
    icon: "🧠",
    baseDevTime: 100,
    baseCost: 150000,
    revenueModel: "API调用/订阅",
  },
};

// ====== 生成唯一ID ======
function _startupGenerateId() {
  return "sid_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
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
  const prefix =
    industryPrefixes[Math.floor(Math.random() * industryPrefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
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
  const skill = skills[Math.floor(Math.random() * skills.length)];
  const personality =
    personalities[Math.floor(Math.random() * personalities.length)];
  const equityReq = 5 + Math.floor(Math.random() * 15);

  return {
    id: "cofounder_" + index,
    name: name,
    skill: skill,
    skillLevel: 50 + Math.floor(Math.random() * 30),
    personality: personality,
    equityRequest: equityReq,
    joinedDay: null,
    loyalty: 70 + Math.floor(Math.random() * 20),
  };
}

/**
 * 获取创业系统触发条件（剧本感知）
 * 去除硬编码 day>200，改为按剧本设置不同的资金/职级门槛
 */
function getStartupTriggerConditions(state) {
  var scenarioId = state.flags && state.flags._scenarioId;
  var phase = state.player && state.player.phase;
  var cash = (state.resources && state.resources.cash) || 0;

  // 各剧本触发条件
  var conditions = {
    classic: {
      street: { cash: 50000, label: "街头发家" },
      corporate: { rank: "P5", cash: 50000, label: "职场攒够启动金" },
    },
    laid_off: {
      street: { cash: 30000, label: "摆摊/零工攒够本钱" },
      corporate: { rank: "P5", cash: 30000, label: "技术岗转创业" },
    },
    small_town_grinder: {
      street: { cash: 50000, label: "白领工作积累" },
      corporate: { rank: "P5", cash: 50000, label: "大厂经验+启动金" },
    },
    foreign_worker: {
      street: { cash: 20000, label: "省吃俭用攒下第一桶金" },
      corporate: { rank: "P5", cash: 20000, label: "技术移民转创业" },
    },
    second_gen: {
      street: { cash: 100000, label: "家里支持启动资金" },
      corporate: { rank: "P5", cash: 100000, label: "家里支持启动资金" },
    },
    midlife_crisis: {
      street: { cash: 80000, label: "补偿金/积蓄转型" },
      corporate: { rank: "P6", cash: 80000, label: "P6+管理经验转型" },
    },
    fresh_grad: {
      street: { cash: 30000, label: "实习+兼职攒钱" },
      corporate: { rank: "P5", cash: 30000, label: "职场新人创业梦" },
    },
  };

  var cond = conditions[scenarioId];
  if (!cond) cond = conditions.classic;
  var pc = cond[phase] || cond.street;
  var rankMet = true;
  if (phase === "corporate" && pc.rank) {
    var rankNames = ["P5", "P6", "P7", "P8", "P9", "P10"];
    var reqIdx = rankNames.indexOf(pc.rank);
    var playerRank = state.corporate && state.corporate.rank;
    var pIdx = rankNames.indexOf(playerRank);
    rankMet = pIdx >= reqIdx;
  }
  return {
    cashRequired: pc.cash || 50000,
    rankRequired: pc.rank || null,
    label: pc.label || "资源积累",
    cashOk: cash >= (pc.cash || 50000),
    rankOk: rankMet,
    canRegister: cash >= 50000, // 注册硬门槛（启动金）
    met: cash >= (pc.cash || 50000) && rankMet,
  };
}

/** 打开注册公司弹窗 */
function showStartupRegisterModal() {
  var state = StateManager.getState();
  var cash = (state.resources && state.resources.cash) || 0;
  if (cash < 50000) {
    StateManager.addMessage("⚠️ 注册公司需要 ¥50,000 启动资金。", "warning");
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
    "<p>注册公司需缴纳 <strong>¥50,000</strong> 启动资金。选择行业后即可开始创业之旅。</p>" +
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
    (cash - 50000).toLocaleString() +
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
          var nameInput = document.getElementById("startup-name-input");
          var name = nameInput ? nameInput.value.trim() : "";
          // 找选中的行业
          var selected = document.querySelector(
            'input[name="startup-industry"]:checked',
          );
          if (!selected) {
            StateManager.addMessage("⚠️ 请选择一个行业。", "warning");
            return;
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
          } else {
            StateManager.addMessage(result.message || "注册失败", "warning");
          }
        },
      },
    ],
  });
}

/** 注册新公司 */
function registerStartup(state, name, industry, description) {
  // 检查触发条件
  const cash = state.resources.cash;
  const day = state.player.day;
  const minCash = 50000; // 最低启动资金

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
  state.resources.cash -= minCash;

  // 生成公司名（如果玩家没输入）
  const companyName = name || _startupGenerateCompanyName(industry);

  // 初始化公司状态
  const company = {
    id: _startupGenerateId(),
    name: companyName,
    industry: industry,
    description: description || "",
    foundedDay: day,
    valuation: STARTUP_INDUSTRIES[industry].baseValuation,
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
  };

  // 生成1-2个联合创始人
  const numCoFounders = Math.random() < 0.6 ? 1 : 2;
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
  company.products.push(initialProduct);

  // 更新状态
  state.startup.status = "seed";
  state.startup.company = company;
  state.startup.flags.registered = true;
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

  StateManager.addMessage(
    "🏢 公司「" +
      companyName +
      "」已注册！行业：" +
      STARTUP_INDUSTRIES[industry].name +
      "，初始估值：¥" +
      company.valuation.toLocaleString(),
    "success",
  );

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

  const product = {
    id: _startupGenerateId(),
    name: name || company.name + "产品" + (company.products.length + 1),
    category: category,
    description: "",
    developmentProgress: 0,
    targetDay: state.player.day + PRODUCT_CATEGORIES[category].baseDevTime,
    launchDay: null,
    technologyScore: 0,
    marketScore: 0,
    revenue: 0,
    status: "developing",
  };

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
  const randomFactor = 0.8 + Math.random() * 0.4;

  const progressGain =
    (baseProgress + intelligenceBonus + codingBonus + teamBonus) * randomFactor;

  product.developmentProgress = Math.min(
    100,
    product.developmentProgress + progressGain,
  );

  // 消耗公司现金（研发成本）
  const devCost = 1000 * effort;
  company.cashReserve = Math.max(0, company.cashReserve - devCost);
  company.expenses += devCost;

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
    loyalty: 60 + Math.floor(Math.random() * 30),
    skillFocus: EMPLOYEE_ROLES[role].skillFocus,
    skillLevel: 30 + Math.floor(Math.random() * 30),
    joinedDay: state.player.day,
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

  // 检查阶段升级
  if (company.employees.length >= 5 && company.phase === "seed") {
    company.phase = "growth";
    state.startup.status = "growth";
    StateManager.addMessage("📈 团队达到5人，公司进入成长期！", "success");
  }

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
  company.loyalty = (company.loyalty || 70) - 5;

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
      roundDef.investorTypes[
        Math.floor(Math.random() * roundDef.investorTypes.length)
      ]
    ];

  const raiseAmount = Math.floor(
    roundDef.maxRaise * (0.5 + Math.random() * 0.5),
  );
  const equityDilution =
    roundDef.equityDilution[0] +
    Math.random() * (roundDef.equityDilution[1] - roundDef.equityDilution[0]);

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

  return {
    success: true,
    round: roundDef,
    amount: raiseAmount,
    equityDilution: equityDilution,
    investor: investorType,
  };
}

// ====== 核心：季度运营 ======
function tickStartup(state) {
  const startup = state.startup;
  if (!startup || startup.status === "none" || startup.flags.exited) return;

  const company = startup.company;
  if (!company) return;

  const day = state.player.day;

  // 1. 收入计算
  let totalRevenue = 0;
  for (const product of company.products) {
    if (product.status === "launched") {
      // 产品收入 = 基础收入 × 技术分 × 市场分 × 行业系数
      const baseRevenue = 5000;
      const techMod = product.technologyScore / 100;
      const marketMod = product.marketScore / 100;
      const industryMod =
        STARTUP_INDUSTRIES[company.industry]?.avgBurnRate / 50000 || 1;
      const growthMod = 1 + (company.revenue > 0 ? 0.01 : 0); // 轻微增长

      product.revenue = Math.round(
        baseRevenue *
          techMod *
          marketMod *
          industryMod *
          growthMod *
          (1 + Math.random() * 0.2 - 0.1),
      );
      totalRevenue += product.revenue;
    }
  }

  // 2. 支出计算
  let totalExpenses = 0;
  // 员工工资
  for (const emp of company.employees) {
    totalExpenses += emp.salary;
  }
  // 办公租金（按团队规模）
  const rent = 5000 + company.employees.length * 1000;
  totalExpenses += rent;
  // 研发成本
  const rAndD =
    company.products.filter((p) => p.status === "developing").length * 5000;
  totalExpenses += rAndD;
  // 营销
  const marketing = 3000 + company.revenue * 0.05;
  totalExpenses += marketing;

  company.revenue = totalRevenue;
  company.expenses = totalExpenses;

  // 3. 净现金流
  const netCash = totalRevenue - totalExpenses;
  company.cashReserve += netCash;

  // 4. 烧钱率 & runway
  company.burnRate = Math.max(0, totalExpenses - totalRevenue);
  company.monthsOfRunway =
    company.burnRate > 0 ? company.cashReserve / company.burnRate : 999;

  // 5. 估值漂移
  if (netCash > 0) {
    company.valuation *= 1 + 0.02 + Math.random() * 0.03;
  } else if (netCash < 0) {
    company.valuation *= 1 - 0.01 - Math.random() * 0.02;
  }
  company.valuation = Math.round(company.valuation);

  // 更新峰值估值
  if (company.valuation > (startup.history.peakValuation || 0)) {
    startup.history.peakValuation = company.valuation;
  }

  // 6. 团队忠诚度衰减
  for (const emp of company.employees) {
    emp.loyalty = Math.max(0, emp.loyalty - (netCash < 0 ? 3 : 0.5));
    // 低忠诚度可能离职
    if (emp.loyalty < 20 && Math.random() < 0.1) {
      StateManager.addMessage(
        "⚠️ 「" + emp.name + "」因不满公司状况离职！",
        "danger",
      );
      fireEmployee(state, emp.id);
    }
  }

  // 7. 破产检测
  if (company.monthsOfRunway <= 0 && company.fundingRounds.length >= 2) {
    // 尝试最后融资
    StateManager.addMessage("⚠️ 资金链告急！尝试紧急融资...", "warning");
    // 简化：直接破产
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
    const ipoValuation = company.valuation * (1.5 + Math.random() * 1.5); // 上市溢价
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

    // 玩家获得现金回报
    state.resources.cash += startup.flags.exitValue;
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

  // 检查是否有收购要约
  // 大企业可能收购玩家公司
  const offerProb = 0.05; // 5%概率
  if (Math.random() > offerProb) return null;

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

  // 生成收购报价
  const offerMultiplier = 0.8 + Math.random() * 0.6; // 0.8-1.4倍估值
  const offerValue = Math.round(company.valuation * offerMultiplier);
  const playerShareValue = Math.round(
    (company.equity.player / 100) * offerValue,
  );

  return {
    acquirerCid: acquirerCid,
    acquirerName: acquirerName,
    offerValue: offerValue,
    playerShareValue: playerShareValue,
    offerDay: state.player.day,
  };
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

  // 玩家获得现金
  state.resources.cash += offer.playerShareValue;

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

  // 资产清算
  const assetRecovery = Math.round(company.cashReserve * 0.3); // 只能收回30%
  company.cashReserve = assetRecovery;

  // 玩家获得剩余现金（如果有）
  state.resources.cash += assetRecovery;

  // 声誉损失
  state.status.health = Math.max(0, state.status.health - 10);
  state.player.fame = Math.max(0, state.player.fame - 10);

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

  return actions;
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

    case "create_product":
      return createProduct(state, params.name, params.category || "app");

    case "hire_employee":
      return hireEmployee(state, params.role || "engineer", params.salary);

    case "meet_investor":
      // 简化：直接增加融资可能性
      StateManager.addMessage(
        "💼 与投资人会面，对方对公司的" +
          (state.startup.company?.phase === "growth"
            ? "成长潜力"
            : "创新产品") +
          "表示兴趣",
        "info",
      );
      return { success: true };

    case "raise_funding":
      return raiseFunding(state, params.round || "seed");

    case "marketing":
      {
        const company = state.startup.company;
        const spend = params.spend || 5000;
        if (company.cashReserve < spend) {
          return { success: false, message: "现金不足" };
        }
        company.cashReserve -= spend;
        company.marketScore = Math.min(100, company.marketScore + 2);
        company.revenue = Math.round(company.revenue * (1 + 0.02));
        StateManager.addMessage("📢 市场推广完成，市场分+2", "info");
        return { success: true };
      }
      break;

    case "review_financials":
      return { success: true, summary: getStartupSummary(state) };

    case "manage_team":
      {
        const company = state.startup.company;
        for (const emp of company.employees) {
          emp.loyalty = Math.min(100, emp.loyalty + 5);
        }
        StateManager.addMessage("🎯 团队管理完成，全员忠诚度+5", "info");
        return { success: true };
      }
      break;

    case "ipo_prep":
      return prepareIPO(state);

    default:
      return { success: false, message: "未知行动：" + actionId };
  }
}

// ====== UI: 渲染创业Tab ======
function renderStartupTab(state, parent) {
  parent.innerHTML = "";

  var startup = state.startup;
  if (!startup || startup.status === "none") {
    // 剧本感知的触发条件
    var stc = getStartupTriggerConditions(state);
    var cashLabel = "¥" + stc.cashRequired.toLocaleString();
    var rankLabel = stc.rankRequired ? stc.rankRequired + "+" : "不限";
    var phaseLabel =
      state.player && state.player.phase === "corporate" ? "职场" : "街头";
    var cashNow = (state.resources && state.resources.cash) || 0;
    var cashColor =
      cashNow >= stc.cashRequired ? "var(--success)" : "var(--danger)";
    var cashStatus = cashNow >= stc.cashRequired ? "✅" : "⚠️";

    parent.innerHTML =
      '<div style="padding:30px 20px;text-align:center;color:var(--text-muted);">' +
      "<h3>🚀 创业系统</h3>" +
      '<p style="font-size:13px;color:var(--text-secondary);">你还没有注册公司。注册后可以招聘、融资、做产品。</p>' +
      '<div style="margin:16px auto;padding:14px;max-width:360px;background:var(--bg-card);border-radius:8px;border:1px solid var(--border);text-align:left;font-size:12px;">' +
      '<div style="font-weight:600;margin-bottom:10px;color:var(--text-primary);">📋 ' +
      (stc.label || "注册条件") +
      "</div>" +
      '<div style="display:flex;justify-content:space-between;padding:3px 0;"><span>阶段</span><span>' +
      phaseLabel +
      "</span></div>" +
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
      '<div style="display:flex;justify-content:space-between;padding:3px 0;border-top:1px solid var(--border);margin-top:4px;padding-top:5px;"><span>💵 注册费</span><span>¥50,000</span></div>' +
      "</div>" +
      '<button class="btn btn-lg btn-primary" onclick="showStartupRegisterModal()" ' +
      (cashNow >= 50000 ? "" : 'style="opacity:0.5;" disabled') +
      ">" +
      (cashNow >= 50000 ? "🚀 注册公司" : "🚀 注册公司（资金不足）") +
      "</button>" +
      '<div style="margin-top:12px;font-size:11px;color:var(--text-muted);">注册费 ¥50,000，不限阶段和天数，随时可注册</div>' +
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
        prodCard.innerHTML +=
          '<div style="margin-top:8px;font-size:11px;color:var(--text-muted);">' +
          "技术分：" +
          product.technologyScore +
          " | 市场分：" +
          product.marketScore +
          " | 月收入：¥" +
          Math.round(product.revenue).toLocaleString() +
          "</div>";
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

      var empCard = document.createElement("div");
      empCard.style.cssText =
        "background:var(--bg-card);padding:8px 12px;margin-bottom:6px;border-radius:6px;font-size:13px;display:flex;justify-content:space-between;align-items:center;";
      empCard.innerHTML =
        "<span>" +
        (empRole ? empRole.icon : "") +
        " " +
        emp.name +
        "（" +
        (empRole ? empRole.name : emp.role) +
        "）</span>" +
        '<span style="font-size:11px;color:var(--text-muted);">月薪¥' +
        emp.salary.toLocaleString() +
        "</span>" +
        '<span style="font-size:11px;color:' +
        loyaltyColor +
        ';">忠诚度 ' +
        Math.round(emp.loyalty) +
        "%</span>";

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
    bankrupt,
    getStartupSummary,
    getAvailableStartupActions,
    executeStartupAction,
    renderStartupTab,
  };
}
