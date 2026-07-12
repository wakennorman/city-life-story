/**
 * 职场数据 — 职级、部门、公司、职场行动
 */

const CORP_RANKS = {
  P5: {
    name: "初级工程师",
    title: "P5",
    next: "P6",
    minAge: 22,
    baseSalary: 15000,
    salaryMultiplier: 1.0,
    maxActions: 3,
    stockUnits: 0,
    promotionReqs: {
      minAbility: 40,
      minUpward: 20,
      minPopularity: 30,
      minGrade: "A",
    },
  },
  P6: {
    name: "高级工程师",
    title: "P6",
    next: "P7",
    minAge: 24,
    baseSalary: 25000,
    salaryMultiplier: 1.3,
    maxActions: 3,
    stockUnits: 200,
    promotionReqs: {
      minAbility: 60,
      minUpward: 40,
      minPopularity: 60,
      minGrade: "A",
    },
  },
  P7: {
    name: "技术专家",
    title: "P7",
    next: "P8",
    minAge: 27,
    baseSalary: 40000,
    salaryMultiplier: 1.6,
    maxActions: 4,
    stockUnits: 500,
    canManageTeam: true,
    maxTeamSize: 5,
    promotionReqs: {
      minAbility: 80,
      minUpward: 80,
      minGrade: "S",
      minTeamSize: 2,
      minProjects: 1,
    },
  },
  P8: {
    name: "高级专家",
    title: "P8",
    next: "P9",
    minAge: 30,
    baseSalary: 65000,
    salaryMultiplier: 2.0,
    maxActions: 4,
    stockUnits: 1000,
    canManageTeam: true,
    maxTeamSize: 8,
    promotionReqs: {
      minAbility: 85,
      minUpward: 85,
      minGrade: "S",
      minTeamSize: 5,
      minProjects: 2,
    },
  },
  P9: {
    name: "资深专家",
    title: "P9",
    next: "P10",
    minAge: 33,
    baseSalary: 100000,
    salaryMultiplier: 2.5,
    maxActions: 5,
    stockUnits: 2000,
    canManageTeam: true,
    maxTeamSize: 10,
    promotionReqs: {
      minAbility: 92,
      minUpward: 90,
      minGrade: "S+",
      minTeamSize: 10,
    },
  },
  P10: {
    name: "合伙人",
    title: "P10",
    next: null,
    minAge: 35,
    baseSalary: 180000,
    salaryMultiplier: 3.5,
    maxActions: 5,
    stockUnits: 5000,
    canManageTeam: true,
    maxTeamSize: 15,
    promotionReqs: {},
  },
};

const COMPANIES = [
  {
    id: "star_tech",
    name: "星辰科技",
    industry: "AI/大模型",
    culture: "工程师文化，崇尚技术",
    salaryMod: 1.0,
    riskMod: 1.0,
    growthRate: 1.2,
  },
  {
    id: "byte_dragon",
    name: "字节龙",
    industry: "短视频/推荐",
    culture: "狼性文化，卷王聚集地",
    salaryMod: 1.4,
    riskMod: 1.5,
    growthRate: 1.8,
  },
  {
    id: "cloud_giant",
    name: "云巨人",
    industry: "云计算/企业服务",
    culture: "稳健保守，WLB较好",
    salaryMod: 0.85,
    riskMod: 0.6,
    growthRate: 0.9,
  },
  {
    id: "game_fun",
    name: "好玩游戏",
    industry: "手游/出海",
    culture: "创意驱动，氛围轻松",
    salaryMod: 0.9,
    riskMod: 0.8,
    growthRate: 1.1,
  },
  {
    id: "safe_fin",
    name: "安信金融科技",
    industry: "金融科技",
    culture: "合规优先，流程繁琐",
    salaryMod: 1.2,
    riskMod: 0.9,
    growthRate: 0.7,
  },
  {
    id: "neo_finance",
    name: "新金融集团",
    industry: "金融科技",
    culture: "稳健合规，流程严谨",
    salaryMod: 1.1,
    riskMod: 0.7,
    growthRate: 0.9,
  },
  {
    id: "green_tech",
    name: "绿源科技",
    industry: "新能源",
    culture: "理想主义，环保驱动",
    salaryMod: 0.95,
    riskMod: 1.2,
    growthRate: 1.5,
  },
  {
    id: "media_hub",
    name: "传媒中心",
    industry: "媒体/内容",
    culture: "创意自由，节奏快",
    salaryMod: 1.0,
    riskMod: 1.3,
    growthRate: 1.1,
  },
  {
    id: "bio_innovate",
    name: "生物创新",
    industry: "生物医药",
    culture: "科研导向，长期投入",
    salaryMod: 1.15,
    riskMod: 0.8,
    growthRate: 0.8,
  },
  {
    id: "edu_future",
    name: "未来教育",
    industry: "教育科技",
    culture: "以人为本，教学优先",
    salaryMod: 0.9,
    riskMod: 0.9,
    growthRate: 1.0,
  },
];

/**
 * 企业生命周期阶段定义 — 用于企业命运系统 (P2#11)
 */
const CORP_LIFECYCLE_PHASES = {
  startup: {
    name: "初创期",
    color: "#4fc3f7",
    icon: "🚀",
    desc: "高增长高风险的早期阶段",
    growthMult: 1.5,
    riskMult: 2.0,
    healthDecay: 0.1,
    recoveryRate: 0.3,
  },
  growth: {
    name: "成长期",
    color: "#4a9e5c",
    icon: "📈",
    desc: "高速成长，市场份额快速扩大",
    growthMult: 1.2,
    riskMult: 1.2,
    healthDecay: 0.05,
    recoveryRate: 0.2,
  },
  mature: {
    name: "成熟期",
    color: "#f39c12",
    icon: "🏛️",
    desc: "稳定经营，创新放缓",
    growthMult: 0.8,
    riskMult: 0.6,
    healthDecay: 0.08,
    recoveryRate: 0.1,
  },
  decline: {
    name: "衰退期",
    color: "#e67e22",
    icon: "📉",
    desc: "市场份额萎缩，经营困难",
    growthMult: 0.4,
    riskMult: 1.5,
    healthDecay: 0.2,
    recoveryRate: 0.05,
  },
  dying: {
    name: "濒死期",
    color: "#c4553d",
    icon: "💀",
    desc: "面临破产或收购",
    growthMult: 0.1,
    riskMult: 3.0,
    healthDecay: 0.4,
    recoveryRate: 0.02,
  },
};

/**
 * 公司→股票映射 — 每家公司对应的股票symbol列表
 * 用于企业命运系统影响股价
 */
const CORP_STOCK_MAP = {
  star_tech: ["BAID", "SMIC", "HUAW"],
  byte_dragon: ["BYTE", "BILI", "KUAI"],
  cloud_giant: ["HUAW", "BAID"],
  game_fun: ["NETE", "TENC"],
  safe_fin: ["SAFE", "PING", "ALIM"],
};

const CORP_ACTIONS = [
  {
    id: "project_work",
    name: "做项目",
    icon: "💻",
    desc: "埋头写代码/做需求，提升KPI和能力。消耗发量。",
    effects: { kpi: 15, ability: 5, hair: -3, fatigue: 15, risk: 2 },
  },
  {
    id: "network_upward",
    name: "向上社交",
    icon: "🤝",
    desc: "跟领导1on1、汇报成果、展示价值。",
    effects: { upwardMgmt: 12, popularity: 2, dignity: -3, kpi: 2 },
  },
  {
    id: "peer_network",
    name: "拉通对齐",
    icon: "🫂",
    desc: "和同事吃饭聚会、交流信息、建立同盟。",
    effects: { popularity: 10, happiness: 8, upwardMgmt: 2 },
  },
  {
    id: "learn_tech",
    name: "学习新技术",
    icon: "📚",
    desc: "读书、刷网课、研究前沿技术。花500元培训费。",
    effects: { ability: 10, intelligence: 3, fatigue: 5, happiness: 3 },
    cost: 500,
  },
  {
    id: "take_risk",
    name: "走捷径/埋雷",
    icon: "💣",
    desc: "抄近道完成KPI，技术债积累。高风险高回报。",
    effects: { kpi: 25, risk: 20, ability: -2, dignity: -5, hair: -5 },
  },
  {
    id: "defuse_risk",
    name: "排查风险",
    icon: "🔍",
    desc: "修bug、写测试、优化代码。降低埋雷值。",
    effects: { risk: -15, kpi: -3, ability: 3, hair: -2 },
  },
  {
    id: "manage_team",
    name: "管理团队",
    icon: "👥",
    desc: "分配任务、辅导下属、开会推进。P7+可用。",
    effects: { kpi: 8, ability: 3, popularity: 3, dignity: -3 },
    requiresRank: "P7",
  },
  {
    id: "rest_balance",
    name: "摸鱼/休息",
    icon: "🎮",
    desc: "正常下班，周末躺平。恢复身心但KPI下降。",
    effects: {
      hair: 8,
      dignity: 5,
      fatigue: -20,
      happiness: 10,
      kpi: -8,
      upwardMgmt: -3,
    },
  },
  {
    id: "stock_trade",
    name: "股票交易",
    icon: "📈",
    desc: "买入/卖出公司股票。每季度限1次。",
    effects: {},
    special: "stock",
  },
  {
    id: "mentor_junior",
    name: "指导新人",
    icon: "👨‍🏫",
    desc: "带新人，传帮带。提升团队整体水平。",
    effects: { popularity: 5, ability: 2, kpi: -2 },
    requiresRank: "P6",
  },
  {
    id: "cross_dept_collab",
    name: "跨部门协作",
    icon: "🤝",
    desc: "拉通对齐，跨部门推进项目。",
    effects: { popularity: 8, fatigue: 10, kpi: 5 },
    requiresRank: "P7",
  },
  {
    id: "innovation_proposal",
    name: "提出创新方案",
    icon: "💡",
    desc: "写方案、提建议。可能改变产品方向。",
    effects: { ability: 8, risk: 5, kpi: 3 },
    requirements: { intelligence: 50 },
  },
  {
    id: "office_politics",
    name: "办公室政治",
    icon: "🎭",
    desc: "站队、拉帮结派。短期有利，长期有风险。",
    effects: { popularity: -5, upwardMgmt: 10, dignity: -3 },
    requirements: { mental: 40 },
  },
  {
    id: "work_from_home",
    name: "远程办公",
    icon: "🏠",
    desc: "申请在家办公。恢复身心，但KPI受影响。",
    effects: { fatigue: -10, kpi: -5, happiness: 8 },
    requiresRank: "P6",
  },
  {
    id: "side_project",
    name: "接私活",
    icon: "💰",
    desc: "下班后接私活赚钱。收入可观，但影响主业。",
    effects: { cash: 300, fatigue: 20, kpi: -8 },
    requirements: { coding: 30 },
  },
  // === 全栈人生线 v1：开发者职场行动 ===
  {
    id: "code_review",
    name: "代码评审",
    icon: "🔎",
    desc: "review 同事的 PR，把坑拦在合并前。降低技术债，稳步提升能力。",
    effects: { kpi: 5, ability: 4, risk: -8, fatigue: 8, hair: -1 },
    requirements: { coding: 30 },
  },
  {
    id: "on_call_firefight",
    name: "线上救火",
    icon: "🚨",
    desc: "半夜被报警叫醒，紧急修复线上故障。疲劳爆炸，但保住了 KPI 和技术债。",
    effects: {
      kpi: 10,
      fatigue: 22,
      hair: -3,
      risk: -6,
      happiness: -5,
      ability: 2,
    },
    requirements: { coding: 35 },
  },
  {
    id: "agile_sprint",
    name: "迭代冲刺",
    icon: "🏃",
    desc: "带小组冲一波 sprint，集中交付需求。KPI 大涨，但技术债和疲劳也涨。",
    effects: { kpi: 18, ability: 3, fatigue: 16, risk: 6, hair: -4 },
    requiresRank: "P6",
  },
];

/**
 * 获取当前可用的公司列表（过滤已倒闭的公司 + 添加历史提示）
 * 多周目系统：前一局倒闭的公司不再显示为可选雇主
 */
function getAvailableCompanies() {
  if (typeof isCompanyDeceased !== "function") return COMPANIES;
  return COMPANIES.filter(function (c) {
    return !isCompanyDeceased(c.id);
  });
}

/**
 * 检查某公司ID是否在可用列表中
 */
function isCompanyAvailable(companyId) {
  if (typeof isCompanyDeceased === "function" && isCompanyDeceased(companyId)) {
    return false;
  }
  for (var i = 0; i < COMPANIES.length; i++) {
    if (COMPANIES[i].id === companyId) return true;
  }
  return false;
}

const TEAM_MEMBERS = [
  {
    id: "geek_coder",
    name: "技术极客",
    role: "技术骨干",
    skill: "coding",
    desc: "技术能力极强，产出高但沟通差",
    productivity: 8,
    loyalty: 5,
    salary: 20000,
  },
  {
    id: "old_hand",
    name: "老黄牛",
    role: "稳定输出",
    skill: "general",
    desc: "不加班但也不出错，稳稳的幸福",
    productivity: 4,
    loyalty: 8,
    salary: 12000,
  },
  {
    id: "new_graduate",
    name: "应届生",
    role: "培养对象",
    skill: "learning",
    desc: "便宜能干活，成长空间大，但容易跑路",
    productivity: 2,
    loyalty: 3,
    salary: 8000,
  },
  {
    id: "politics_master",
    name: "办公室政治家",
    role: "关系网",
    skill: "politics",
    desc: "向上管理能力一流，帮你搞定各种跨部门协调",
    productivity: 3,
    loyalty: 2,
    salary: 25000,
  },
  {
    id: "mortgage_warrior",
    name: "房贷战神",
    role: "高压输出",
    skill: "endurance",
    desc: "背着房贷不敢辞职，加班到死。但容易崩溃。",
    productivity: 10,
    loyalty: 10,
    salary: 28000,
  },
  {
    id: "burnout_coder",
    name: "倦怠程序员",
    role: "疲惫的老员工",
    skill: "coding",
    desc: "干了5年，累了。产出低但不出错。",
    productivity: 3,
    loyalty: 2,
    salary: 15000,
  },
  {
    id: "office_diplomat",
    name: "职场外交官",
    role: "关系大师",
    skill: "politics",
    desc: "什么都懂，什么都能说。跨部门协调神器。",
    productivity: 5,
    loyalty: 7,
    salary: 30000,
  },
  {
    id: "jack_of_all_trades",
    name: "多面手",
    role: "什么都能干",
    skill: "general",
    desc: "不精但啥都会。团队里的万能胶。",
    productivity: 5,
    loyalty: 6,
    salary: 15000,
  },
];
