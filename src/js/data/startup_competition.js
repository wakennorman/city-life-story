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
  };
}
