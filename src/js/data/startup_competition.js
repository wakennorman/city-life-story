/**
 * 创业市场竞争系统 + 辅助系统
 *
 * 包含：
 * - 竞争对手AI（2-5家同赛道竞争公司）
 * - 市场份额动态
 * - 市场情报系统
 * - 办公地点系统
 * - 企业文化系统
 * - 品牌声誉系统
 */

// ====== 工具函数 ======
function _esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ====== 办公地点系统 ======
const OFFICE_LOCATIONS = {
  shared: {
    id: "shared",
    name: "共享办公空间",
    icon: "🏢",
    cost: 3000, // 月租
    imageBonus: -5,
    recruitMod: -0.2,
    loyaltyMod: -0.05,
    desc: "便宜但嘈杂，适合早期团队",
  },
  normal: {
    id: "normal",
    name: "普通写字楼",
    icon: "🏙️",
    cost: 8000,
    imageBonus: 0,
    recruitMod: 0,
    loyaltyMod: 0,
    desc: "中规中矩，不出错的选择",
  },
  techPark: {
    id: "techPark",
    name: "科技园",
    icon: "🌳",
    cost: 15000,
    imageBonus: 5,
    recruitMod: 0.15,
    loyaltyMod: 0.05,
    techBonus: 2,
    desc: "政策补贴+技术氛围，提升形象",
  },
  headquarters: {
    id: "headquarters",
    name: "总部大楼",
    icon: "🏛️",
    cost: 30000,
    imageBonus: 15,
    recruitMod: 0.3,
    loyaltyMod: 0.1,
    techBonus: 3,
    marketBonus: 3,
    desc: "高端形象，吸引顶尖人才",
  },
  campus: {
    id: "campus",
    name: "自建园区",
    icon: "🌲",
    cost: 60000,
    imageBonus: 25,
    recruitMod: 0.5,
    loyaltyMod: 0.2,
    techBonus: 5,
    marketBonus: 5,
    desc: "终极目标，行业巨头的象征",
  },
};

// ====== 企业文化系统 ======
const COMPANY_CULTURES = {
  wolf: {
    id: "wolf",
    name: "狼性文化",
    icon: "🐺",
    desc: "高强度高回报，优胜劣汰",
    loyaltyMod: -0.1,
    turnoverMod: 1.5,
    productivityMod: 1.3,
    innovationMod: 1.2,
    recruitMod: -0.1,
  },
  engineer: {
    id: "engineer",
    name: "工程师文化",
    icon: "🔧",
    desc: "技术至上，代码为王",
    loyaltyMod: 0.05,
    turnoverMod: 0.9,
    productivityMod: 1.0,
    innovationMod: 1.5,
    recruitMod: 0.1,
  },
  family: {
    id: "family",
    name: "家文化",
    icon: "👨‍👩‍👧‍👦",
    desc: "关怀员工，稳定和谐",
    loyaltyMod: 0.2,
    turnoverMod: 0.7,
    productivityMod: 0.9,
    innovationMod: 0.8,
    recruitMod: 0.15,
  },
};

// ====== 品牌声誉系统 ======
const BRAND_LEVELS = [
  {
    level: 0,
    name: "无名小卒",
    icon: "❓",
    minReputation: 0,
    userGrowthMod: 0.5,
    recruitMod: -0.3,
  },
  {
    level: 1,
    name: "小有名气",
    icon: "✨",
    minReputation: 20,
    userGrowthMod: 0.8,
    recruitMod: -0.1,
  },
  {
    level: 2,
    name: "行业知名",
    icon: "⭐",
    minReputation: 40,
    userGrowthMod: 1.0,
    recruitMod: 0,
  },
  {
    level: 3,
    name: "行业领先",
    icon: "🏆",
    minReputation: 60,
    userGrowthMod: 1.3,
    recruitMod: 0.2,
  },
  {
    level: 4,
    name: "知名品牌",
    icon: "💎",
    minReputation: 80,
    userGrowthMod: 1.6,
    recruitMod: 0.4,
  },
  {
    level: 5,
    name: "行业巨头",
    icon: "👑",
    minReputation: 95,
    userGrowthMod: 2.0,
    recruitMod: 0.6,
  },
];

function getBrandLevel(reputation) {
  for (let i = BRAND_LEVELS.length - 1; i >= 0; i--) {
    if (reputation >= BRAND_LEVELS[i].minReputation) {
      return BRAND_LEVELS[i];
    }
  }
  return BRAND_LEVELS[0];
}

// ====== 竞争对手AI ======
const COMPETITOR_TEMPLATES = {
  tech: [
    {
      namePrefix: "智",
      suffixes: ["云科技", "联科技", "星科技", "闪科技"],
      focus: "技术领先",
    },
    {
      namePrefix: "极",
      suffixes: ["客科技", "限科技", "致科技"],
      focus: "产品体验",
    },
    {
      namePrefix: "深",
      suffixes: ["度科技", "蓝科技", "海科技"],
      focus: "AI驱动",
    },
  ],
  consumer: [
    { namePrefix: "优", suffixes: ["购", "选", "惠", "美"], focus: "价格优势" },
    { namePrefix: "快", suffixes: ["享", "达", "速"], focus: "快速服务" },
  ],
  finance: [
    { namePrefix: "安", suffixes: ["付", "理", "信", "赢"], focus: "安全合规" },
    { namePrefix: "易", suffixes: ["付", "贷", "投"], focus: "便捷金融" },
  ],
  healthcare: [
    { namePrefix: "康", suffixes: ["护", "健", "仁", "泰"], focus: "专业服务" },
    { namePrefix: "健", suffixes: ["康", "宝", "安"], focus: "健康管理" },
  ],
  education: [
    { namePrefix: "启", suffixes: ["智", "学", "慧", "思"], focus: "在线教育" },
    { namePrefix: "明", suffixes: ["智", "学", "达"], focus: "职业教育" },
  ],
  manufacturing: [
    { namePrefix: "工", suffixes: ["智", "精", "创", "科"], focus: "智能制造" },
    { namePrefix: "精", suffixes: ["工", "智", "能"], focus: "精密制造" },
  ],
};

/** 生成竞争对手 */
function generateCompetitors(state, playerCompany) {
  const industry = playerCompany.industry;
  const templates = COMPETITOR_TEMPLATES[industry] || COMPETITOR_TEMPLATES.tech;
  const numCompetitors = Math.min(
    3,
    Math.max(1, Math.floor(playerCompany.employees.length / 5) + 1),
  );

  const competitors = [];
  for (let i = 0; i < numCompetitors; i++) {
    const template = templates[i % templates.length];
    const suffix =
      template.suffixes[Math.floor(Math.random() * template.suffixes.length)];
    const name = (template.namePrefix || "") + suffix;

    competitors.push({
      id: "competitor_" + playerCompany.id + "_" + i,
      name: name,
      industry: industry,
      valuation: playerCompany.valuation * (0.3 + Math.random() * 0.7),
      employees: Math.max(
        1,
        Math.floor(
          playerCompany.employees.length * (0.3 + Math.random() * 0.8),
        ),
      ),
      technologyScore: Math.min(
        100,
        playerCompany.technologyScore * (0.5 + Math.random() * 0.6),
      ),
      marketScore: Math.min(
        100,
        playerCompany.marketScore * (0.5 + Math.random() * 0.6),
      ),
      reputation: Math.min(
        100,
        playerCompany.reputation * (0.4 + Math.random() * 0.7),
      ),
      focus: template.focus,
      phase: playerCompany.phase,
      fundingRounds: playerCompany.fundingRounds
        .filter((r) => r.round !== "C")
        .slice(0, Math.max(0, playerCompany.fundingRounds.length - 1)),
      products: playerCompany.products.map((p) => ({
        name: p.name + "竞品",
        category: p.category,
        technologyScore: Math.max(
          0,
          p.technologyScore - 5 + Math.floor(Math.random() * 15),
        ),
        marketScore: Math.max(
          0,
          p.marketScore - 5 + Math.floor(Math.random() * 15),
        ),
        status: "launched",
      })),
      trend: Math.random() > 0.5 ? "up" : "stable",
    });
  }

  return competitors;
}

/** 竞争对手每日演化 */
function tickCompetitors(state, competitors) {
  if (!competitors || competitors.length === 0) return;

  for (const comp of competitors) {
    // 随机演化
    const growth = (Math.random() - 0.4) * 5; // 轻微负偏（玩家有优势）
    comp.technologyScore = Math.max(
      0,
      Math.min(100, comp.technologyScore + growth),
    );
    comp.marketScore = Math.max(0, Math.min(100, comp.marketScore + growth));
    comp.reputation = Math.max(0, Math.min(100, comp.reputation + growth));

    // 随机事件
    if (Math.random() < 0.05) {
      const events = [
        "融资成功",
        "产品发布",
        "核心团队变动",
        "获得大客户",
        "技术突破",
      ];
      const event = events[Math.floor(Math.random() * events.length)];
      comp.trend = "up";
      if (event === "融资成功") comp.valuation *= 1.2;
      if (event === "技术突破") comp.technologyScore += 5;
    } else {
      comp.trend = "stable";
    }
  }
}

/** 计算市场份额 */
function calculateMarketShare(state, playerCompany, competitors) {
  if (!playerCompany) return 0;

  const allCompanies = [playerCompany, ...(competitors || [])];
  const totalScore = allCompanies.reduce((sum, c) => {
    return sum + (c.technologyScore + c.marketScore + c.reputation);
  }, 0);

  if (totalScore === 0) return 100;

  const playerScore =
    playerCompany.technologyScore +
    playerCompany.marketScore +
    playerCompany.reputation;
  return Math.round((playerScore / totalScore) * 100);
}

// ====== 市场情报系统 ======
const MARKET_INTELLIGENCE_ACTIONS = [
  {
    id: "basic_research",
    name: "基础市场调研",
    cost: 5000,
    info: ["竞争对手数量", "行业平均估值"],
    desc: "了解市场基本格局",
  },
  {
    id: "deep_research",
    name: "深度市场调研",
    cost: 20000,
    info: ["竞争对手估值", "竞争对手团队规模", "竞争对手产品"],
    desc: "获取详细竞争情报",
  },
  {
    id: "expert_consult",
    name: "咨询行业专家",
    cost: 50000,
    info: ["行业趋势预测", "竞争对手弱点", "市场机会"],
    desc: "获得深度洞察和建议",
  },
];

function performMarketResearch(state, actionId) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const action = MARKET_INTELLIGENCE_ACTIONS.find((a) => a.id === actionId);
  if (!action) return { success: false, message: "无效操作" };

  if (company.cashReserve < action.cost) {
    return {
      success: false,
      message: "现金不足，需要¥" + action.cost.toLocaleString(),
    };
  }

  company.cashReserve -= action.cost;
  company.expenses += action.cost;

  // 生成情报报告
  const competitors = state.startup.competitors || [];
  let report = "";

  if (action.id === "basic_research") {
    report = "市场情报报告：\n";
    report += "• 主要竞争对手：" + competitors.length + "家\n";
    report +=
      "• 行业平均估值：¥" +
      Math.round(
        competitors.reduce((s, c) => s + c.valuation, 0) /
          Math.max(1, competitors.length),
      ).toLocaleString() +
      "\n";
    report +=
      "• 市场处于" +
      (company.revenue > company.expenses ? "盈利" : "竞争") +
      "阶段";
  } else if (action.id === "deep_research") {
    report = "深度情报报告：\n";
    for (const c of competitors) {
      report +=
        "• 「" +
        c.name +
        "」：估值¥" +
        Math.round(c.valuation).toLocaleString() +
        "，团队" +
        c.employees +
        "人，技术分" +
        Math.round(c.technologyScore) +
        "，市场分" +
        Math.round(c.marketScore) +
        "\n";
    }
  } else if (action.id === "expert_consult") {
    report = "专家咨询报告：\n";
    report += "• 行业趋势：AI/数字化转型加速，传统模式面临挑战\n";
    report += "• 竞争对手弱点：多数公司技术债积累，产品迭代慢\n";
    report += "• 市场机会：下沉市场/海外市场仍有增长空间\n";
    report += "• 建议：加大研发投入，建立技术壁垒";
  }

  return { success: true, report: report, action: action };
}

// ====== P1-9: 竞争对手策略应对系统 ======

/**
 * 竞争对手攻击类型
 * 四种攻击：价格战、挖角、营销战、技术竞争
 */
const COMPETITOR_ATTACK_TYPES = {
  price_war: {
    id: "price_war",
    name: "价格战",
    icon: "💰",
    description: "竞争对手大幅降价抢市场份额",
    severityBase: 3,
    durationDays: [30, 90],
    detectionThreshold: { marketShareDrop: 0.02, priceMod: -0.15 },
  },
  talent_poaching: {
    id: "talent_poaching",
    name: "人才挖角",
    icon: "👥",
    description: "竞争对手高薪挖走核心员工",
    severityBase: 4,
    durationDays: [15, 45],
    detectionThreshold: { keyEmployeeLeave: true, turnoverRate: 0.1 },
  },
  marketing_war: {
    id: "marketing_war",
    name: "营销战",
    icon: "📢",
    description: "竞争对手加大广告投放/公关战",
    severityBase: 2,
    durationDays: [20, 60],
    detectionThreshold: { reputationDrop: 0.05, adSpendGap: 2 },
  },
  tech_competition: {
    id: "tech_competition",
    name: "技术竞争",
    icon: "⚡",
    description: "竞争对手发布技术突破/专利封锁",
    severityBase: 5,
    durationDays: [45, 120],
    detectionThreshold: { technologyGap: 0.1, patentBlock: true },
  },
};

/**
 * 价格战应对方案
 */
const PRICE_WAR_RESPONSES = {
  match_price: {
    id: "match_price",
    name: "跟进降价",
    icon: "📉",
    costMult: 0.8, // 成本增加倍数
    effect: { marketShare: -0.02, revenue: -0.15, profitMargin: -0.1 },
    risk: "短期利润受损，但保住市场份额",
    successChance: 0.65,
    desc: "跟随对手降价，保住客户但利润受损",
  },
  differentiate: {
    id: "differentiate",
    name: "差异化竞争",
    icon: "✨",
    costMult: 0.3,
    effect: { marketShare: +0.01, revenue: +0.05, brandValue: +0.08 },
    risk: "需要时间建立差异化优势",
    successChance: 0.55,
    desc: "强调产品独特价值，避免价格战",
  },
  premium_focus: {
    id: "premium_focus",
    name: "高端市场聚焦",
    icon: "💎",
    costMult: 0.2,
    effect: {
      marketShare: -0.03,
      revenue: +0.02,
      profitMargin: +0.08,
      brandValue: +0.1,
    },
    risk: "放弃低端市场，可能缩小规模",
    successChance: 0.6,
    desc: "放弃价格敏感客户，专注高端市场",
  },
  value_bundle: {
    id: "value_bundle",
    name: "增值服务捆绑",
    icon: "📦",
    costMult: 0.4,
    effect: { marketShare: +0.02, revenue: +0.08, customerSatisfaction: +0.05 },
    risk: "增加运营成本",
    successChance: 0.58,
    desc: "不直接降价，而是增加服务/功能提升性价比",
  },
  exit_market: {
    id: "exit_market",
    name: "退出细分市场",
    icon: "🚪",
    costMult: 0.0,
    effect: {
      marketShare: -0.1,
      revenue: -0.05,
      profitMargin: +0.03,
      stress: -0.1,
    },
    risk: "承认失败，缩小规模保利润",
    successChance: 0.8,
    desc: "战略性退出价格战激烈的细分市场",
  },
};

/**
 * 人才挖角应对方案
 */
const TALENT_POACHING_RESPONSES = {
  counter_offer: {
    id: "counter_offer",
    name: "反挖角加薪",
    icon: "💰",
    costMult: 0.5,
    effect: { employeeRetention: +0.15, salaryCost: +0.1, satisfaction: +0.05 },
    risk: "提高薪资成本，可能引发连锁反应",
    successChance: 0.7,
    desc: "为关键员工加薪挽留，但增加人力成本",
  },
  retention_bonus: {
    id: "retention_bonus",
    name: "留任奖金计划",
    icon: "🏆",
    costMult: 0.3,
    effect: { employeeRetention: +0.12, satisfaction: +0.08, loyalty: +0.1 },
    risk: "短期成本，效果有限",
    successChance: 0.65,
    desc: "设立留任奖金，激励核心员工留下",
  },
  equity_grant: {
    id: "equity_grant",
    name: "股权激励",
    icon: "📈",
    costMult: 0.1,
    effect: { employeeRetention: +0.2, loyalty: +0.15, dilution: +0.02 },
    risk: "股权稀释，但长期绑定效果好",
    successChance: 0.75,
    desc: "授予核心员工期权/股权，长期绑定",
  },
  non_compete: {
    id: "non_compete",
    name: "竞业协议执行",
    icon: "⚖️",
    costMult: 0.15,
    effect: { employeeRetention: +0.05, legalCost: +0.05, deterrent: +0.1 },
    risk: "法律成本高，效果不确定",
    successChance: 0.4,
    desc: "启动竞业限制协议，阻止员工跳槽竞品",
  },
  culture_improve: {
    id: "culture_improve",
    name: "改善企业文化",
    icon: "🌱",
    costMult: 0.2,
    effect: { employeeRetention: +0.1, satisfaction: +0.12, brandValue: +0.05 },
    risk: "见效慢，需要持续投入",
    successChance: 0.5,
    desc: "改善工作环境和团队氛围，从根本上提升吸引力",
  },
  headhunt_back: {
    id: "headhunt_back",
    name: "反向挖角",
    icon: "🎯",
    costMult: 0.4,
    effect: {
      employeeRetention: +0.05,
      technologyScore: +0.03,
      marketScore: +0.02,
    },
    risk: "成本高，可能引发人才战",
    successChance: 0.45,
    desc: "从竞争对手那里挖走他们的核心员工",
  },
};

/**
 * 营销战应对方案
 */
const MARKETING_WAR_RESPONSES = {
  match_ad_spend: {
    id: "match_ad_spend",
    name: "对等广告投入",
    icon: "📺",
    costMult: 1.0,
    effect: { brandValue: +0.05, marketShare: +0.01, revenue: +0.03 },
    risk: "广告预算大幅增加",
    successChance: 0.55,
    desc: "匹配竞争对手的广告投入，保持市场声量",
  },
  pr_counter: {
    id: "pr_counter",
    name: "公关反击",
    icon: "📰",
    costMult: 0.4,
    effect: { reputation: +0.08, brandValue: +0.06, marketShare: +0.02 },
    risk: "可能升级公关战",
    successChance: 0.6,
    desc: "发布正面声明/新闻，反击负面舆论",
  },
  influencer_collab: {
    id: "influencer_collab",
    name: "KOL合作推广",
    icon: "🌟",
    costMult: 0.35,
    effect: { brandValue: +0.1, marketShare: +0.03, revenue: +0.05 },
    risk: "依赖KOL，效果不稳定",
    successChance: 0.58,
    desc: "与行业KOL合作，提升品牌影响力",
  },
  content_marketing: {
    id: "content_marketing",
    name: "内容营销",
    icon: "📝",
    costMult: 0.15,
    effect: { brandValue: +0.04, customerSatisfaction: +0.05, revenue: +0.02 },
    risk: "见效慢，需要持续产出",
    successChance: 0.5,
    desc: "通过高质量内容建立品牌信任",
  },
  channel_expansion: {
    id: "channel_expansion",
    name: "渠道拓展",
    icon: "🔗",
    costMult: 0.3,
    effect: { marketShare: +0.04, revenue: +0.06, brandValue: +0.03 },
    risk: "新渠道投入风险",
    successChance: 0.52,
    desc: "开拓新销售渠道，绕过竞争对手的渠道封锁",
  },
  community_build: {
    id: "community_build",
    name: "社区运营",
    icon: "👥",
    costMult: 0.1,
    effect: { customerSatisfaction: +0.08, loyalty: +0.1, brandValue: +0.05 },
    risk: "见效慢",
    successChance: 0.45,
    desc: "建立用户社区，增强用户粘性和口碑传播",
  },
};

/**
 * 技术竞争应对方案
 */
const TECH_COMPETITION_RESPONSES = {
  accelerate_rd: {
    id: "accelerate_rd",
    name: "加速研发",
    icon: "🚀",
    costMult: 0.6,
    effect: { technologyScore: +0.08, timeToMarket: -0.15, techDebt: +0.05 },
    risk: "增加技术债，可能影响质量",
    successChance: 0.55,
    desc: "加大研发投入，加速产品迭代追赶",
  },
  patent_filing: {
    id: "patent_filing",
    name: "专利布局",
    icon: "🛡️",
    costMult: 0.25,
    effect: { technologyScore: +0.03, patentCount: +0.02, techBarrier: +0.1 },
    risk: "专利申请周期长",
    successChance: 0.6,
    desc: "加速专利申请，建立技术壁垒",
  },
  open_source: {
    id: "open_source",
    name: "开源策略",
    icon: "🌐",
    costMult: 0.05,
    effect: {
      brandValue: +0.08,
      communitySupport: +0.15,
      technologyScore: +0.02,
    },
    risk: "可能失去技术优势",
    successChance: 0.5,
    desc: "开源部分技术，建立社区生态和开发者关系",
  },
  partnership: {
    id: "partnership",
    name: "技术合作",
    icon: "🤝",
    costMult: 0.2,
    effect: { technologyScore: +0.05, marketScore: +0.03, techBarrier: +0.05 },
    risk: "依赖合作伙伴",
    successChance: 0.55,
    desc: "与高校/研究机构/其他公司技术合作",
  },
  acquire_startup: {
    id: "acquire_startup",
    name: "收购技术团队",
    icon: "💼",
    costMult: 0.8,
    effect: { technologyScore: +0.12, marketShare: +0.02, cashReserve: -0.1 },
    risk: "高额支出，整合风险",
    successChance: 0.45,
    desc: "收购有技术的初创团队，快速获取技术能力",
  },
  pivot_tech: {
    id: "pivot_tech",
    name: "技术转型",
    icon: "🔄",
    costMult: 0.35,
    effect: {
      technologyScore: +0.04,
      marketScore: +0.02,
      productDiversity: +0.05,
    },
    risk: "转型风险，可能失去原有优势",
    successChance: 0.4,
    desc: "转向新技术方向，避开正面技术竞争",
  },
};

/**
 * 竞争对手攻击事件模板
 */
const COMPETITOR_EVENT_TEMPLATES = {
  // === 价格战事件 ===
  price_war_aggressive: {
    id: "price_war_aggressive",
    name: "激进价格战",
    attackType: "price_war",
    icon: "📉",
    title: "竞争对手发起激进价格战",
    description:
      "「{competitorName}」宣布全线产品降价{discount}%，直接冲击你的市场份额。客户开始流向更低价的竞品。",
    severity: 3,
    urgency: "high",
    durationDays: 60,
    effects: { marketShare: -0.05, revenue: -0.1, customerChurn: +0.03 },
    detectionTrigger: { marketShareDropRate: 0.02, priceGap: 0.15 },
  },
  price_war_subtle: {
    id: "price_war_subtle",
    name: "隐性价格战",
    attackType: "price_war",
    icon: "💸",
    title: "竞争对手推出低价替代品",
    description:
      "「{competitorName}」推出简化版产品，定价只有你的{percent}%，瞄准价格敏感客户群体。",
    severity: 2,
    urgency: "medium",
    durationDays: 45,
    effects: { marketShare: -0.02, revenue: -0.05, customerChurn: +0.01 },
    detectionTrigger: { newCompetitorProduct: true, priceGap: 0.3 },
  },

  // === 人才挖角事件 ===
  talent_poaching_direct: {
    id: "talent_poaching_direct",
    name: "定向挖角核心员工",
    attackType: "talent_poaching",
    icon: "🎯",
    title: "竞争对手定向挖角",
    description:
      "「{competitorName}」向你的{position}（{employeeName}）发出高薪邀约，薪资比你当前高出{salaryIncrease}%。该员工正在考虑是否跳槽。",
    severity: 4,
    urgency: "critical",
    durationDays: 15,
    effects: {
      employeeRetention: -0.15,
      morale: -0.05,
      technologyScore: -0.02,
    },
    detectionTrigger: { keyEmployeeResignationRisk: 0.6 },
  },
  talent_poaching_bulk: {
    id: "talent_poaching_bulk",
    name: "批量挖角",
    attackType: "talent_poaching",
    icon: "👥",
    title: "竞争对手批量挖角",
    description:
      "「{competitorName}」在你的行业圈发布招聘广告，批量挖角你的团队成员。已有{leftCount}名员工收到邀约，团队稳定性面临挑战。",
    severity: 5,
    urgency: "critical",
    durationDays: 30,
    effects: { employeeRetention: -0.25, morale: -0.1, turnoverRate: +0.08 },
    detectionTrigger: { multipleResignationRisk: true, turnoverRate: 0.05 },
  },

  // === 营销战事件 ===
  marketing_war_ad: {
    id: "marketing_war_ad",
    name: "广告投放战",
    attackType: "marketing_war",
    icon: "📢",
    title: "竞争对手加大广告投放",
    description:
      "「{competitorName}」在主流媒体投放大量广告，广告预算是你的{adRatio}倍。你的品牌声量被压制，用户获取成本上升。",
    severity: 2,
    urgency: "medium",
    durationDays: 45,
    effects: {
      brandValue: -0.05,
      customerAcquisitionCost: +0.15,
      revenue: -0.03,
    },
    detectionTrigger: { adSpendGap: 2, brandMentionDrop: 0.1 },
  },
  marketing_war_pr: {
    id: "marketing_war_pr",
    name: "公关战",
    attackType: "marketing_war",
    icon: "📰",
    title: "竞争对手发布负面公关",
    description:
      "「{competitorName}」在行业媒体发布文章，暗示你的产品存在{issue}问题。媒体开始报道，声誉受到质疑。",
    severity: 4,
    urgency: "high",
    durationDays: 30,
    effects: { reputation: -0.1, brandValue: -0.08, customerTrust: -0.05 },
    detectionTrigger: { negativeMediaMention: true, reputationDropRate: 0.03 },
  },
  marketing_war_channel: {
    id: "marketing_war_channel",
    name: "渠道争夺",
    attackType: "marketing_war",
    icon: "🔗",
    title: "竞争对手争夺渠道合作伙伴",
    description:
      "「{competitorName}」与你的主要渠道合作伙伴签订排他协议，你的销售渠道被封锁。需要寻找新的渠道或直销。",
    severity: 3,
    urgency: "high",
    durationDays: 60,
    effects: { salesChannel: -0.15, revenue: -0.08, marketShare: -0.02 },
    detectionTrigger: { channelPartnerLoss: true },
  },

  // === 技术竞争事件 ===
  tech_competition_breakthrough: {
    id: "tech_competition_breakthrough",
    name: "技术突破",
    attackType: "tech_competition",
    icon: "⚡",
    title: "竞争对手技术突破",
    description:
      "「{competitorName}」宣布在{technology}领域取得突破，性能比你领先{gap}%。你的技术优势正在被追赶甚至超越。",
    severity: 4,
    urgency: "high",
    durationDays: 90,
    effects: {
      technologyScore: -0.05,
      marketShare: -0.03,
      investorConfidence: -0.05,
    },
    detectionTrigger: { technologyGap: 0.1, competitorPatentCount: 3 },
  },
  tech_competition_patent_block: {
    id: "tech_competition_patent_block",
    name: "专利封锁",
    attackType: "tech_competition",
    icon: "🔒",
    title: "竞争对手专利封锁",
    description:
      "「{competitorName}」在{technology}领域申请了核心专利，你的产品开发可能面临侵权风险。需要绕开专利或授权。",
    severity: 5,
    urgency: "critical",
    durationDays: 120,
    effects: {
      technologyScore: -0.03,
      developmentSpeed: -0.1,
      legalRisk: +0.1,
    },
    detectionTrigger: { competitorPatentBlock: true, patentGap: 2 },
  },
  tech_competition_open_source: {
    id: "tech_competition_open_source",
    name: "开源颠覆",
    attackType: "tech_competition",
    icon: "🌐",
    title: "竞争对手开源核心技术",
    description:
      "「{competitorName}」将你的核心技术开源，免费供开发者使用。你的技术壁垒被瓦解，需要寻找新的差异化。",
    severity: 4,
    urgency: "high",
    durationDays: 60,
    effects: {
      technologyScore: -0.08,
      marketShare: -0.05,
      communitySupport: +0.05,
    },
    detectionTrigger: { competitorOpenSource: true, techDependency: 0.5 },
  },
};

/**
 * 检测竞争对手攻击
 */
function detectCompetitorAttack(state, company, competitors) {
  if (!company || !competitors || competitors.length === 0) return null;

  const attacks = [];
  const day = state.player.day;

  // 检查是否已有活跃攻击
  if (
    company.activeCompetitorAttacks &&
    company.activeCompetitorAttacks.length > 0
  ) {
    for (const attack of company.activeCompetitorAttacks) {
      attack.remainingDays--;
      if (attack.remainingDays <= 0) {
        // 攻击结束
        attack.resolved = true;
        attack.resolvedDay = day;
      }
    }
    // 移除已解决的攻击
    company.activeCompetitorAttacks = company.activeCompetitorAttacks.filter(
      (a) => !a.resolved,
    );
  }

  // 检测新攻击
  for (const comp of competitors) {
    const compTrend = comp.trend || "stable";
    const techGap = company.technologyScore - comp.technologyScore;
    const marketGap = company.marketScore - comp.marketScore;

    // 1. 价格战检测：竞争对手技术分接近且市场分增长快
    if (compTrend === "up" && Math.abs(techGap) < 10 && marketGap < 5) {
      if (Math.random() < 0.03) {
        const template =
          Math.random() < 0.6
            ? COMPETITOR_EVENT_TEMPLATES.price_war_aggressive
            : COMPETITOR_EVENT_TEMPLATES.price_war_subtle;
        attacks.push({
          ...template,
          competitorId: comp.id,
          competitorName: comp.name,
          startedDay: day,
          remainingDays: template.durationDays,
          resolved: false,
          // 动态填充模板变量
          discount: Math.floor(15 + Math.random() * 25),
          percent: Math.floor(30 + Math.random() * 40),
        });
      }
    }

    // 2. 人才挖角检测：竞争对手市场分高于玩家
    if (comp.marketScore > company.marketScore && Math.random() < 0.02) {
      const template =
        company.employees.length > 10
          ? COMPETITOR_EVENT_TEMPLATES.talent_poaching_bulk
          : COMPETITOR_EVENT_TEMPLATES.talent_poaching_direct;
      const keyEmployee =
        company.employees.find((e) => e.loyalty < 60) || company.employees[0];
      attacks.push({
        ...template,
        competitorId: comp.id,
        competitorName: comp.name,
        startedDay: day,
        remainingDays: template.durationDays,
        resolved: false,
        position: keyEmployee
          ? EMPLOYEE_ROLES[keyEmployee.role]?.name || "员工"
          : "员工",
        employeeName: keyEmployee ? keyEmployee.name : "某员工",
        salaryIncrease: Math.floor(20 + Math.random() * 40),
        leftCount: Math.floor(
          company.employees.length * (0.1 + Math.random() * 0.2),
        ),
      });
    }

    // 3. 营销战检测：竞争对手声誉高且增长快
    if (
      comp.reputation > company.reputation &&
      compTrend === "up" &&
      Math.random() < 0.025
    ) {
      const templates = [
        COMPETITOR_EVENT_TEMPLATES.marketing_war_ad,
        COMPETITOR_EVENT_TEMPLATES.marketing_war_pr,
        COMPETITOR_EVENT_TEMPLATES.marketing_war_channel,
      ];
      const template = templates[Math.floor(Math.random() * templates.length)];
      attacks.push({
        ...template,
        competitorId: comp.id,
        competitorName: comp.name,
        startedDay: day,
        remainingDays: template.durationDays,
        resolved: false,
        adRatio: Math.floor(1.5 + Math.random() * 3),
        issue:
          template.id === "marketing_war_pr"
            ? ["质量", "安全", "服务"][Math.floor(Math.random() * 3)]
            : "",
      });
    }

    // 4. 技术竞争检测：竞争对手技术分高于玩家
    if (
      comp.technologyScore > company.technologyScore + 10 &&
      Math.random() < 0.02
    ) {
      const templates = [
        COMPETITOR_EVENT_TEMPLATES.tech_competition_breakthrough,
        COMPETITOR_EVENT_TEMPLATES.tech_competition_patent_block,
        COMPETITOR_EVENT_TEMPLATES.tech_competition_open_source,
      ];
      const template = templates[Math.floor(Math.random() * templates.length)];
      const technologies = [
        "AI算法",
        "数据处理",
        "用户体验",
        "云计算",
        "区块链",
        "物联网",
      ];
      attacks.push({
        ...template,
        competitorId: comp.id,
        competitorName: comp.name,
        startedDay: day,
        remainingDays: template.durationDays,
        resolved: false,
        technology:
          technologies[Math.floor(Math.random() * technologies.length)],
        gap: Math.floor(10 + Math.random() * 30),
      });
    }
  }

  return attacks.length > 0 ? attacks : null;
}

/**
 * 应用攻击效果
 */
function applyCompetitorAttackEffects(state, company, attack) {
  const effects = attack.effects;
  if (!effects) return;

  for (const [key, value] of Object.entries(effects)) {
    if (company[key] !== undefined) {
      company[key] = company[key] + value;
    }
  }

  // 记录攻击事件
  if (!company.competitorAttackHistory) {
    company.competitorAttackHistory = [];
  }
  company.competitorAttackHistory.push({
    ...attack,
    resolvedDay: null,
    response: null,
  });
}

/**
 * 选择应对方案
 */
function getAvailableCompetitorResponses(attackType) {
  const responseMaps = {
    price_war: PRICE_WAR_RESPONSES,
    talent_poaching: TALENT_POACHING_RESPONSES,
    marketing_war: MARKETING_WAR_RESPONSES,
    tech_competition: TECH_COMPETITION_RESPONSES,
  };
  return responseMaps[attackType] || {};
}

/**
 * 执行应对方案
 */
function executeCompetitorResponse(state, attack, responseId) {
  const company = state.startup.company;
  if (!company || !attack) return { success: false, message: "无效操作" };

  const responseMaps = {
    price_war: PRICE_WAR_RESPONSES,
    talent_poaching: TALENT_POACHING_RESPONSES,
    marketing_war: MARKETING_WAR_RESPONSES,
    tech_competition: TECH_COMPETITION_RESPONSES,
  };

  const response = responseMaps[attack.attackType][responseId];
  if (!response) return { success: false, message: "无效应对方案" };

  // 计算成本（基于公司月收入）
  const baseCost =
    company.revenue > 0 ? company.revenue * response.costMult : 10000;

  if (company.cashReserve < baseCost) {
    return {
      success: false,
      message: "现金不足，需要¥" + Math.round(baseCost).toLocaleString(),
    };
  }

  // 消耗现金
  company.cashReserve -= baseCost;
  company.expenses += baseCost;

  // 成功率判定
  const success = Math.random() < response.successChance;
  const multiplier = success ? 1 : attack.severity >= 4 ? 0.3 : 0.5;

  // 应用效果
  const results = {};
  for (const [key, value] of Object.entries(response.effect)) {
    if (company[key] !== undefined) {
      const adjustedValue = value * multiplier;
      const oldValue = company[key];
      company[key] = company[key] + adjustedValue;

      // 记录变化
      results[key] = {
        from: oldValue,
        to: company[key],
        change: adjustedValue,
      };
    }
  }

  // 更新攻击状态
  const attackRecord = company.competitorAttackHistory.find(
    (a) => a.id === attack.id && !a.resolved,
  );
  if (attackRecord) {
    attackRecord.resolved = true;
    attackRecord.resolvedDay = state.player.day;
    attackRecord.response = responseId;
    attackRecord.success = success;
    attackRecord.cost = Math.round(baseCost);
    attackRecord.outcome = results;
  }

  // 从活跃攻击中移除
  if (company.activeCompetitorAttacks) {
    company.activeCompetitorAttacks = company.activeCompetitorAttacks.filter(
      (a) => a.id !== attack.id,
    );
  }

  // 移除待处理攻击
  if (
    company.pendingCompetitorAttack &&
    company.pendingCompetitorAttack.id === attack.id
  ) {
    company.pendingCompetitorAttack = null;
  }

  return {
    success: true,
    response: response,
    successRate: response.successChance,
    actualSuccess: success,
    outcomes: results,
    cost: Math.round(baseCost),
    message: success
      ? `✅ 应对成功！${response.desc}，效果显著。`
      : `🔶 应对效果一般。${response.desc}，但竞争对手仍在施压。`,
  };
}

/**
 * 攻击严重程度颜色
 */
function getAttackSeverityColor(severity) {
  if (severity >= 5) return "var(--danger)";
  if (severity >= 4) return "#e67e22";
  if (severity >= 3) return "#f39c12";
  return "var(--accent)";
}

/**
 * 攻击紧急程度颜色
 */
function getAttackUrgencyColor(urgency) {
  if (urgency === "critical") return "var(--danger)";
  if (urgency === "high") return "#e67e22";
  return "#f39c12";
}

/**
 * 获取攻击摘要
 */
function getCompetitorAttackSummary(attack) {
  const comp = COMPETITOR_ATTACK_TYPES[attack.attackType];
  return {
    id: attack.id,
    name: attack.name,
    icon: attack.icon,
    attackType: attack.attackType,
    attackTypeName: comp ? comp.name : "未知",
    severity: attack.severity,
    urgency: attack.urgency,
    remainingDays: attack.remainingDays,
    competitorName: attack.competitorName,
    description: attack.description,
    effects: attack.effects,
  };
}

// ====== 导出 ======
if (typeof window !== "undefined") {
  window.OFFICE_LOCATIONS = OFFICE_LOCATIONS;
  window.COMPANY_CULTURES = COMPANY_CULTURES;
  window.BRAND_LEVELS = BRAND_LEVELS;
  window.getBrandLevel = getBrandLevel;
  window.generateCompetitors = generateCompetitors;
  window.tickCompetitors = tickCompetitors;
  window.calculateMarketShare = calculateMarketShare;
  window.MARKET_INTELLIGENCE_ACTIONS = MARKET_INTELLIGENCE_ACTIONS;
  window.performMarketResearch = performMarketResearch;
  // P1-9: 竞争对手策略应对
  window.COMPETITOR_ATTACK_TYPES = COMPETITOR_ATTACK_TYPES;
  window.COMPETITOR_EVENT_TEMPLATES = COMPETITOR_EVENT_TEMPLATES;
  window.PRICE_WAR_RESPONSES = PRICE_WAR_RESPONSES;
  window.TALENT_POACHING_RESPONSES = TALENT_POACHING_RESPONSES;
  window.MARKETING_WAR_RESPONSES = MARKETING_WAR_RESPONSES;
  window.TECH_COMPETITION_RESPONSES = TECH_COMPETITION_RESPONSES;
  window.detectCompetitorAttack = detectCompetitorAttack;
  window.applyCompetitorAttackEffects = applyCompetitorAttackEffects;
  window.getAvailableCompetitorResponses = getAvailableCompetitorResponses;
  window.executeCompetitorResponse = executeCompetitorResponse;
  window.getAttackSeverityColor = getAttackSeverityColor;
  window.getAttackUrgencyColor = getAttackUrgencyColor;
  window.getCompetitorAttackSummary = getCompetitorAttackSummary;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    OFFICE_LOCATIONS,
    COMPANY_CULTURES,
    BRAND_LEVELS,
    getBrandLevel,
    generateCompetitors,
    tickCompetitors,
    calculateMarketShare,
    MARKET_INTELLIGENCE_ACTIONS,
    performMarketResearch,
    // P1-9
    COMPETITOR_ATTACK_TYPES,
    COMPETITOR_EVENT_TEMPLATES,
    PRICE_WAR_RESPONSES,
    TALENT_POACHING_RESPONSES,
    MARKETING_WAR_RESPONSES,
    TECH_COMPETITION_RESPONSES,
    detectCompetitorAttack,
    applyCompetitorAttackEffects,
    getAvailableCompetitorResponses,
    executeCompetitorResponse,
    getAttackSeverityColor,
    getAttackUrgencyColor,
    getCompetitorAttackSummary,
  };
}
