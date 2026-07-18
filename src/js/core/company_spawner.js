/**
 * 新公司生成系统 — Phase3#1
 *
 * 当现有公司倒闭/被收购后，根据行业生态自然生成新公司，
 * 保持城市商业环境的动态变化感。
 *
 * 生成规则：
 * 1. 行业空缺检测：某行业无活跃公司时触发
 * 2. 文化多样性：不同公司有不同的企业文化标签
 * 3. 风险梯度：新公司从初创期开始，健康度随机
 * 4. 命名随机：从预定义词库中组合生成
 */

// ====== 公司命名词库 ======
const COMPANY_NAME_PREFIXES = [
  "星",
  "云",
  "智",
  "创",
  "科",
  "宏",
  "盛",
  "达",
  "瑞",
  "博",
  "华",
  "腾",
  "跃",
  "启",
  "恒",
  "明",
  "旭",
  "峰",
  "海",
  "天",
  "深",
  "青",
  "蓝",
  "金",
  "银",
  "翠",
  "紫",
  "橙",
  "墨",
  "玉",
  "极",
  "元",
  "超",
  "极",
  "智",
  "灵",
  "妙",
  "奇",
  "幻",
  "梦",
];

const COMPANY_NAME_SUFFIXES = [
  "科技",
  "智能",
  "数码",
  "网络",
  "数据",
  "信息",
  "通信",
  "软件",
  "硬件",
  "电子",
  "生物",
  "医疗",
  "教育",
  "文化",
  "传媒",
  "娱乐",
  "游戏",
  "金融",
  "投资",
  "贸易",
  "物流",
  "制造",
  "能源",
  "环保",
  "汽车",
  "航空",
  "建筑",
  "地产",
  "食品",
  "餐饮",
  "零售",
  "电商",
];

const COMPANY_NAME_VARIANTS = [
  "星辰",
  "星云",
  "智创",
  "宏达",
  "瑞丰",
  "博远",
  "华腾",
  "跃升",
  "启航",
  "恒远",
  "明辉",
  "旭阳",
  "峰顶",
  "海天",
  "深蓝",
  "青云",
  "极光",
  "元宇宙",
  "超维",
  "智灵",
  "妙想",
  "奇幻",
  "梦工厂",
  "量子",
  "纳米",
  "光子",
  "芯片",
  "算法",
  "模型",
  "引擎",
];

// ====== 企业文化标签 ======
const CULTURE_TAGS = [
  {
    id: "狼性",
    icon: "🐺",
    desc: "高强度竞争文化，KPI要求高，晋升快但淘汰也快",
    mods: { kpiReq: 1.3, promoChance: 1.2, fatigueGain: 1.5, dignityLoss: 1.3 },
  },
  {
    id: "家文化",
    icon: "🏠",
    desc: "注重员工关怀，工作生活平衡，但晋升较慢",
    mods: {
      kpiReq: 0.85,
      promoChance: 0.8,
      fatigueGain: 0.8,
      dignityLoss: 0.7,
      happinessGain: 1.2,
    },
  },
  {
    id: "极客文化",
    icon: "💻",
    desc: "技术驱动，能力至上，对技术大牛友好",
    mods: {
      abilityGain: 1.4,
      kpiReq: 1.0,
      promoChance: 1.1,
      intelligenceGain: 1.3,
    },
  },
  {
    id: "扁平化",
    icon: "🔓",
    desc: "层级少决策快，个人影响力大，但资源有限",
    mods: {
      upwardReq: 0.6,
      promoChance: 1.15,
      popularityGain: 1.2,
      teamSizeCap: 0.7,
    },
  },
  {
    id: "大厂规范",
    icon: "🏛️",
    desc: "制度完善，培训体系好，但流程繁琐",
    mods: { abilityGain: 1.1, kpiReq: 1.1, fatigueGain: 1.1, stability: 1.3 },
  },
  {
    id: "创业氛围",
    icon: "🚀",
    desc: "节奏快机会多，可能暴富也可能暴毙",
    mods: { promoChance: 1.5, kpiReq: 1.4, riskGain: 1.3, stockBonus: 2.0 },
  },
  {
    id: "国企风格",
    icon: "🏢",
    desc: "稳定安逸，福利好，但晋升靠资历",
    mods: {
      stability: 1.5,
      fatigueGain: 0.7,
      dignityLoss: 0.5,
      promoChance: 0.6,
      ageBias: 0.5,
    },
  },
  {
    id: "外企风范",
    icon: "🌍",
    desc: "国际化视野，英语要求高，WLB较好",
    mods: {
      englishReq: 50,
      happinessGain: 1.1,
      fatigueGain: 0.85,
      abilityGain: 1.05,
    },
  },
];

// ====== 行业定义 ======
const INDUSTRY_DEFS = {
  "AI/大模型": {
    icon: "🧠",
    color: "#7c3aed",
    baseHealth: 75,
    growthRate: 0.08,
    skillReq: ["coding", "english"],
    minIntelligence: 55,
  },
  "短视频/推荐": {
    icon: "📱",
    color: "#ec4899",
    baseHealth: 80,
    growthRate: 0.06,
    skillReq: ["coding", "management"],
    minIntelligence: 50,
  },
  "云计算/企业服务": {
    icon: "☁️",
    color: "#06b6d4",
    baseHealth: 78,
    growthRate: 0.04,
    skillReq: ["coding"],
    minIntelligence: 52,
  },
  "手游/出海": {
    icon: "🎮",
    color: "#f59e0b",
    baseHealth: 72,
    growthRate: 0.07,
    skillReq: ["coding", "sales"],
    minIntelligence: 48,
  },
  金融科技: {
    icon: "💳",
    color: "#10b981",
    baseHealth: 82,
    growthRate: 0.03,
    skillReq: ["coding", "accounting"],
    minIntelligence: 55,
  },
  "新能源/智能车": {
    icon: "🚗",
    color: "#ef4444",
    baseHealth: 70,
    growthRate: 0.1,
    skillReq: ["coding", "management"],
    minIntelligence: 50,
  },
  生物医药: {
    icon: "🧬",
    color: "#8b5cf6",
    baseHealth: 76,
    growthRate: 0.05,
    skillReq: ["coding", "english"],
    minIntelligence: 58,
  },
  跨境电商: {
    icon: "📦",
    color: "#f97316",
    baseHealth: 68,
    growthRate: 0.09,
    skillReq: ["sales", "english"],
    minIntelligence: 45,
  },
};

/** 生成随机公司名称 */
function generateCompanyName() {
  const useVariant = Random.chance(0.4);
  if (useVariant) {
    const prefix = Random.fromArray(COMPANY_NAME_VARIANTS);
    const suffix = Random.fromArray(COMPANY_NAME_SUFFIXES);
    return prefix + suffix;
  }
  const prefix = Random.fromArray(COMPANY_NAME_PREFIXES);
  const suffix = Random.fromArray(COMPANY_NAME_SUFFIXES);
  return prefix + suffix;
}

/** 生成随机股票代码 */
function generateStockSymbol() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let symbol = "";
  for (let i = 0; i < 4; i++) {
    symbol += letters[Random.int(0, letters.length - 1)];
  }
  return symbol;
}

/** 生成新公司 */
function generateNewCompany(industryOverride) {
  const industry =
    industryOverride || Random.fromArray(Object.keys(INDUSTRY_DEFS));
  const industryDef = INDUSTRY_DEFS[industry];
  const culture = Random.fromArray(CULTURE_TAGS);

  const companyId =
    "comp_" + Date.now() + "_" + Random.int(0, 0xffffff).toString(36);
  const companyName = generateCompanyName();
  const stockSymbol = generateStockSymbol();

  // 初创公司：健康度随机，有波动
  const baseHealth = industryDef.baseHealth + Random.float(-10, 10);
  const health = Math.max(40, Math.min(95, baseHealth));

  // 市场份额：新公司从较小份额开始
  const marketShare = Random.float(2, 7);

  // 产品/人才分数
  const productScore = Random.float(45, 70);
  const talentScore = Random.float(40, 70);

  return {
    id: companyId,
    name: companyName,
    industry: industry,
    culture: culture.id,
    cultureIcon: culture.icon,
    cultureDesc: culture.desc,
    cultureMods: culture.mods,
    color: industryDef.color,
    icon: industryDef.icon,
    stockSymbol: stockSymbol,
    phase: "startup",
    health: Math.round(health),
    marketShare: Math.round(marketShare * 100) / 100,
    sentiment: 50 + Random.int(0, 19),
    productScore: Math.round(productScore),
    talentScore: Math.round(talentScore),
    trend: Random.chance(0.6) ? "up" : "stable",
    knownToPlayer: false,
    ceasedExistence: false,
    ceasedAt: null,
    ipoed: false,
    growthRate: industryDef.growthRate * Random.float(0.8, 1.2),
    minIntelligenceReq: industryDef.minIntelligence,
    skillReqs: industryDef.skillReq,
    stockPrice: Random.float(10, 40),
    equity: { player: 0 }, // 玩家持股比例
    valuation: Random.float(5000000, 20000000), // 估值500万-2000万
    history: [],
    fateEventHistory: [],
    founder: {
      name: Random.fromArray([
        "李总",
        "王总",
        "张总",
        "陈总",
        "刘总",
        "赵总",
        "周总",
        "吴总",
      ]),
      background: Random.fromArray([
        "海归创业",
        "大厂出来创业",
        "连续创业者",
        "技术大牛创业",
        "投资人孵化",
      ]),
    },
    benefits: {
      insurance: Random.chance(0.7),
      housingFund: Random.chance(0.6),
      stockOptions: Random.chance(0.5),
      freeMeals: Random.chance(0.4),
      gym: Random.chance(0.3),
    },
    salaryRange: {
      min: 8000 + Random.int(0, 7999),
      max: 16000 + Random.int(0, 14999),
    },
    // CEO 特质（影响命运事件权重）
    // [全系统自洽修复] 域H 修复:CEO_TRAITS 可能未定义（enterprise_fate.js 未加载）
    ceoTrait: (typeof CEO_TRAITS !== "undefined" ? Random.fromArray(CEO_TRAITS).id : "visionary"),
    ceoBio: generateCeoBio(),
  };
}

/** 生成 CEO 背景故事 */
function generateCeoBio() {
  var traits = {
    aggressive: ["狼性领导者", "雷厉风行", "结果导向", "敢于冒险"],
    conservative: ["稳健派", "步步为营", "风险厌恶", "长期主义"],
    tech_paranoic: ["技术偏执狂", "产品至上", "极客精神", "追求极致"],
    finance_oriented: ["财务高手", "利润优先", "精于算计", "资本玩家"],
    visionary: ["愿景驱动", "长期主义", "改变世界", "理想主义者"],
  };
  var traitKeys = Object.keys(traits);
  var chosenTrait = traitKeys[Random.int(0, traitKeys.length - 1)];
  var traitDescs = traits[chosenTrait];
  var idx = Random.int(0, traitDescs.length - 1);
  return traitDescs[idx];
}

/** 检查是否需要生成新公司 */
function checkAndSpawnNewCompanies(state) {
  const fate = state.enterpriseFate;
  if (!fate || !fate.companies) return [];

  const spawned = [];

  // 检查每个行业是否还有活跃公司
  const activeIndustries = {};
  for (const cid in fate.companies) {
    const co = fate.companies[cid];
    if (!co || co.ceasedExistence) continue;
    activeIndustries[co.industry] = true;
  }

  // 对每个行业，如果无活跃公司，生成新公司
  for (const industry of Object.keys(INDUSTRY_DEFS)) {
    if (!activeIndustries[industry]) {
      // 50%概率生成新公司（不是100%，保持稀缺感）
      if (Random.chance(0.5)) {
        const newCompany = generateNewCompany(industry);
        fate.companies[newCompany.id] = newCompany;

        // 加入股票地图
        if (state.investment && state.investment.stockMarket) {
          state.investment.stockMarket[newCompany.stockSymbol] = {
            price: newCompany.stockPrice,
            company: newCompany.id,
            history: [newCompany.stockPrice],
          };
        }

        // 记录到COMPANIES数组（如果存在）
        if (typeof COMPANIES !== "undefined") {
          COMPANIES.push({
            id: newCompany.id,
            name: newCompany.name,
            industry: industry,
            stockSymbol: newCompany.stockSymbol,
          });
        }

        // 记录历史
        newCompany.history.push({
          day: state.player.day,
          event: "spawned",
          desc: "新公司成立，进入市场",
        });

        spawned.push(newCompany);

        // 生成新闻
        StateManager.addMessage(
          "🏭 【" + newCompany.name + "】成立，进入" + industry + "行业！",
          "info",
        );
      }
    }
  }

  return spawned;
}

/** 获取公司文化标签 */
function getCultureTag(cultureId) {
  return CULTURE_TAGS.find((c) => c.id === cultureId) || CULTURE_TAGS[0];
}

/** 获取行业定义 */
function getIndustryDef(industry) {
  return INDUSTRY_DEFS[industry] || null;
}

/** 获取所有文化标签 */
function getAllCultureTags() {
  return CULTURE_TAGS;
}

/** 获取所有行业定义 */
function getAllIndustries() {
  return INDUSTRY_DEFS;
}

/**
 * Phase 3: 从"废墟"中生成新公司
 * 继承已倒闭公司的部分参数，保持商业生态新陈代谢
 * @param {object} state 游戏状态
 * @param {object} deceasedCompany 已倒闭公司数据
 * @returns {object|null} 生成的新公司，失败返回null
 */
function spawnFromRuins(state, deceasedCompany) {
  if (!deceasedCompany || !deceasedCompany.industry) return null;

  var industry = deceasedCompany.industry;
  var industryDef = INDUSTRY_DEFS[industry];
  if (!industryDef) return null;

  var culture = Random.fromArray(CULTURE_TAGS);

  var companyId =
    "comp_ruins_" + Date.now() + "_" + Random.int(0, 0xffffff).toString(36);
  var companyName = generateCompanyName();
  var stockSymbol = generateStockSymbol();

  // 健康度：倒闭公司最终健康度 × 0.3 + 随机波动
  var baseHealth =
    (deceasedCompany.health || 50) * 0.3 + 30 + Random.float(-10, 10);
  var health = Math.max(40, Math.min(95, baseHealth));

  // 产品分数：倒闭公司最终 productScore × 0.5 + 随机波动
  var productScore = Math.round(
    (deceasedCompany.productScore || 50) * 0.5 + 15 + Random.float(-10, 10),
  );
  productScore = Math.max(30, Math.min(80, productScore));

  // 人才分数：倒闭公司最终 talentScore × 0.4 + 随机波动
  var talentScore = Math.round(
    (deceasedCompany.talentScore || 50) * 0.4 + 15 + Random.float(-10, 10),
  );
  talentScore = Math.max(25, Math.min(70, talentScore));

  // 市场份额：2-5%
  var marketShare = Math.round(Random.float(2, 5) * 100) / 100;

  var newCompany = {
    id: companyId,
    name: companyName,
    industry: industry,
    culture: culture.id,
    cultureIcon: culture.icon,
    cultureDesc: culture.desc,
    cultureMods: culture.mods,
    color: industryDef.color,
    icon: industryDef.icon,
    stockSymbol: stockSymbol,
    phase: "startup",
    health: health,
    marketShare: marketShare,
    sentiment: 45 + Random.int(0, 19),
    productScore: productScore,
    talentScore: talentScore,
    trend: Random.chance(0.5) ? "up" : "stable",
    knownToPlayer: false,
    ceasedExistence: false,
    ceasedAt: null,
    ipoed: false,
    growthRate: industryDef.growthRate * Random.float(0.8, 1.2),
    minIntelligenceReq: industryDef.minIntelligence,
    skillReqs: industryDef.skillReq,
    stockPrice: Random.float(10, 40),
    equity: { player: 0 },
    valuation: Random.float(3000000, 13000000),
    // 遗产标记
    fromRuins: true,
    ruinsSourceId: deceasedCompany.id,
    ruinsSourceName: deceasedCompany.name,
    ruinsSpawnDay: state.player.day,
    // 历史
    history: [
      {
        day: state.player.day,
        event: "spawned_from_ruins",
        desc:
          "从「" +
          (deceasedCompany.name || "未知公司") +
          "」的废墟中重生，继承其技术遗产",
      },
    ],
    fateEventHistory: [],
    founder: {
      name: Random.fromArray(["李总", "王总", "张总", "陈总", "刘总"]),
      background: "原公司技术骨干创业，继承部分专利和人脉",
    },
    benefits: {
      insurance: Random.chance(0.7),
      housingFund: Random.chance(0.6),
      stockOptions: Random.chance(0.5),
      freeMeals: Random.chance(0.4),
      gym: Random.chance(0.3),
    },
    salaryRange: {
      min: 8000 + Random.int(0, 7999),
      max: 16000 + Random.int(0, 14999),
    },
    // [全系统自洽修复] 域H 修复:CEO_TRAITS 可能未定义（enterprise_fate.js 未加载）
    ceoTrait: (typeof CEO_TRAITS !== "undefined" ? Random.fromArray(CEO_TRAITS).id : "visionary"),
    ceoBio: generateCeoBio(),
  };

  // 加入企业命运
  var fate = state.enterpriseFate;
  if (!fate)
    state.enterpriseFate = {
      companies: {},
      fateEventCooldown: {},
      lastFateTick: 0,
    };
  if (!fate.companies) fate.companies = {};
  fate.companies[companyId] = newCompany;

  // 加入股票市场
  if (state.investment && state.investment.stockMarket) {
    state.investment.stockMarket[stockSymbol] = {
      price: newCompany.stockPrice,
      company: companyId,
      history: [newCompany.stockPrice],
    };
  }

  // 加入COMPANIES数组
  if (typeof COMPANIES !== "undefined") {
    COMPANIES.push({
      id: companyId,
      name: companyName,
      industry: industry,
      stockSymbol: stockSymbol,
    });
  }

  // 更新行业格局
  if (typeof updateIndustryEvolution === "function") {
    updateIndustryEvolution(industry, "company_spawned");
  }

  return newCompany;
}

/**
 * 检查并生成从废墟中诞生的新公司
 * 每180天（半年）触发一次，50%概率生成
 * @param {object} state 游戏状态
 * @returns {Array} 生成的新公司列表
 */
function checkAndSpawnFromRuins(state) {
  var fate = state.enterpriseFate;
  if (!fate || !fate.companies) return [];

  // 获取所有已倒闭公司
  var deceasedCompanies = [];
  for (var cid in fate.companies) {
    var co = fate.companies[cid];
    if (co && co.ceasedExistence) {
      deceasedCompanies.push(co);
    }
  }

  if (deceasedCompanies.length === 0) return [];

  // 检查是否需要触发（每180天）
  if (!fate.lastRuinsSpawn) fate.lastRuinsSpawn = 0;
  if (state.player.day - fate.lastRuinsSpawn < 180) return [];

  // 50%概率
  if (!Random.chance(0.5)) return [];

  // 随机选择一个倒闭公司
  var source = Random.fromArray(deceasedCompanies);
  var newCompany = spawnFromRuins(state, source);

  fate.lastRuinsSpawn = state.player.day;

  if (newCompany) {
    StateManager.addMessage(
      "🌱 「" +
        newCompany.name +
        "」从「" +
        source.name +
        "」的废墟中诞生，" +
        "带着" +
        source.industry +
        "行业的技术遗产重新出发！",
      "info",
    );
    return [newCompany];
  }

  return [];
}

// 全局挂载
if (typeof window !== "undefined") {
  Object.assign(window, {
    generateNewCompany,
    checkAndSpawnNewCompanies,
    spawnFromRuins,
    checkAndSpawnFromRuins,
    getCultureTag,
    getIndustryDef,
    getAllCultureTags,
    getAllIndustries,
    CULTURE_TAGS,
    INDUSTRY_DEFS,
    COMPANY_NAME_PREFIXES,
    COMPANY_NAME_SUFFIXES,
    COMPANY_NAME_VARIANTS,
  });
}
