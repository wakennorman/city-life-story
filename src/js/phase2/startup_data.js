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

// ====== 工具函数 ======

/** 转义 HTML 特殊字符 */
function _esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ====== 行业定义 ======
const STARTUP_INDUSTRIES = {
  tech: {
    name: "科技",
    icon: "💻",
    baseValuation: 1400000,
    avgBurnRate: 120000,
    keySkills: ["coding", "english"],
    desc: "互联网/软件/AI，高增长高波动",
  },
  consumer: {
    name: "消费",
    icon: "🛍️",
    baseValuation: 700000,
    avgBurnRate: 80000,
    keySkills: ["sales", "cooking"],
    desc: "零售/餐饮/品牌，稳定但增长慢",
  },
  finance: {
    name: "金融科技",
    icon: "💳",
    baseValuation: 2100000,
    avgBurnRate: 150000,
    keySkills: ["accounting", "management"],
    desc: "支付/理财/保险科技，政策敏感",
  },
  healthcare: {
    name: "医疗健康",
    icon: "🏥",
    baseValuation: 1750000,
    avgBurnRate: 130000,
    keySkills: ["management"],
    desc: "医疗/医药/健康服务，监管严格",
  },
  education: {
    name: "教育",
    icon: "📚",
    baseValuation: 560000,
    avgBurnRate: 110000,
    keySkills: ["english", "management"],
    desc: "培训/在线教育/内容，受政策影响大",
  },
  manufacturing: {
    name: "制造",
    icon: "🏭",
    baseValuation: 1050000,
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

// ====== P1-6: 董事会成员定义 ======
const BOARD_MEMBER_TEMPLATES = {
  angel: {
    role: "观察员",
    icon: "👼",
    personality: "宽容",
    patience: 80,
    focusAreas: ["团队稳定性", "产品方向"],
    pressureTolerance: "高",
    desc: "天使投资人更看重创始人潜力，容忍度较高",
  },
  family_office: {
    role: "董事",
    icon: "🏛️",
    personality: "稳健",
    patience: 70,
    focusAreas: ["现金流", "风险控制"],
    pressureTolerance: "中高",
    desc: "家族办公室偏好稳健增长，关注长期回报",
  },
  vc: {
    role: "董事",
    icon: "💰",
    personality: "激进",
    patience: 40,
    focusAreas: ["增长率", "市场份额", "估值提升"],
    pressureTolerance: "低",
    desc: "VC追求高增长高回报，对业绩要求严格",
  },
  cvc: {
    role: "董事",
    icon: "🏢",
    personality: "战略",
    patience: 50,
    focusAreas: ["战略协同", "技术壁垒"],
    pressureTolerance: "中",
    desc: "企业风投关注战略价值，对短期业绩容忍度中等",
  },
  pe: {
    role: "董事",
    icon: "🦈",
    personality: "苛刻",
    patience: 30,
    focusAreas: ["净利润", "现金流", "对赌条款"],
    pressureTolerance: "极低",
    desc: "私募股权要求严格对赌，业绩不达标触发回购",
  },
  soe: {
    role: "董事",
    icon: "🇨🇳",
    personality: "保守",
    patience: 60,
    focusAreas: ["合规性", "就业贡献", "政策目标"],
    pressureTolerance: "中",
    desc: "国资基金关注政策合规，业绩压力中等",
  },
  strategic: {
    role: "董事",
    icon: "🤝",
    personality: "务实",
    patience: 45,
    focusAreas: ["业务整合", "渠道协同"],
    pressureTolerance: "中低",
    desc: "战略投资人关注业务协同，对整合进度有要求",
  },
};

// ====== P1-6: 董事会KPI要求 ======
const BOARD_KPI_REQUIREMENTS = {
  seed: {
    // 种子轮 KPI（较宽松）
    revenue: { target: 50000, weight: 0.25, desc: "季度营收" },
    userGrowth: {
      target: 0.05,
      targetDesc: "5%/天",
      weight: 0.25,
      desc: "用户增长率",
    },
    productMilestone: {
      target: 0.8,
      targetDesc: "80%进度",
      weight: 0.25,
      desc: "产品开发进度",
    },
    teamStability: {
      target: 0.85,
      targetDesc: "85%留存",
      weight: 0.25,
      desc: "核心团队成员留存率",
    },
    totalWeight: 1.0,
    passThreshold: 0.6, // 60%通过
    warningThreshold: 0.4, // 40%警告
  },
  A: {
    // A轮 KPI（增长导向）
    revenue: { target: 300000, weight: 0.3, desc: "季度营收" },
    revenueGrowth: {
      target: 0.2,
      targetDesc: "20%/季度",
      weight: 0.25,
      desc: "营收增长率",
    },
    userGrowth: {
      target: 0.08,
      targetDesc: "8%/天",
      weight: 0.2,
      desc: "用户增长率",
    },
    marketShare: {
      target: 0.05,
      targetDesc: "5%市场份额",
      weight: 0.15,
      desc: "市场份额",
    },
    teamGrowth: {
      target: 10,
      targetDesc: "10人",
      weight: 0.1,
      desc: "团队规模",
    },
    totalWeight: 1.0,
    passThreshold: 0.65,
    warningThreshold: 0.45,
  },
  B: {
    // B轮 KPI（规模化）
    revenue: { target: 1500000, weight: 0.3, desc: "季度营收" },
    revenueGrowth: {
      target: 0.15,
      targetDesc: "15%/季度",
      weight: 0.25,
      desc: "营收增长率",
    },
    profitability: {
      target: 0.0,
      targetDesc: "盈亏平衡",
      weight: 0.2,
      desc: "净现金流",
    },
    marketShare: {
      target: 0.1,
      targetDesc: "10%市场份额",
      weight: 0.15,
      desc: "市场份额",
    },
    teamScale: {
      target: 30,
      targetDesc: "30人",
      weight: 0.1,
      desc: "团队规模",
    },
    totalWeight: 1.0,
    passThreshold: 0.7,
    warningThreshold: 0.5,
  },
  C: {
    // C轮 KPI（IPO前冲刺）
    revenue: { target: 6000000, weight: 0.3, desc: "季度营收" },
    revenueGrowth: {
      target: 0.1,
      targetDesc: "10%/季度",
      weight: 0.2,
      desc: "营收增长率",
    },
    profitability: {
      target: 0.05,
      targetDesc: "5%利润率",
      weight: 0.25,
      desc: "净利润率",
    },
    marketShare: {
      target: 0.15,
      targetDesc: "15%市场份额",
      weight: 0.15,
      desc: "市场份额",
    },
    teamScale: {
      target: 80,
      targetDesc: "80人",
      weight: 0.1,
      desc: "团队规模",
    },
    valuationGrowth: {
      target: 0.15,
      targetDesc: "15%/季度",
      weight: 0.1,
      desc: "估值增长率",
    },
    totalWeight: 1.0,
    passThreshold: 0.75,
    warningThreshold: 0.55,
  },
};

// ====== P1-6: 董事会压力事件 ======
const BOARD_PRESSURE_EVENTS = {
  mild_warning: {
    icon: "⚠️",
    title: "董事会温和提醒",
    severity: 1,
    trigger: "KPI完成率 45-60%",
    options: [
      {
        text: "召开董事会汇报，展示增长计划",
        cost: 0,
        effects: { satisfaction: -5, trust: +10 },
        feedback: "坦诚沟通，投资人理解阶段性困难",
      },
      {
        text: "提交书面报告，承诺下季度改善",
        cost: 0,
        effects: { satisfaction: -10, trust: +5 },
        feedback: "书面承诺增加了压力，但暂时稳住",
      },
      {
        text: "邀请投资人参与产品发布会",
        cost: 15000,
        effects: { satisfaction: +5, trust: +15 },
        feedback: "展示产品进展，投资人信心回升",
      },
    ],
  },
  moderate_warning: {
    icon: "🔶",
    title: "董事会正式警告",
    severity: 2,
    trigger: "KPI完成率 30-45% 或连续2季未达标",
    options: [
      {
        text: "调整战略方向，聚焦核心业务",
        cost: 50000,
        effects: { satisfaction: +10, trust: +5, revenue: -20000 },
        feedback: "战略收缩获得董事会认可，但短期收入下降",
      },
      {
        text: "引入新的战略合作伙伴",
        cost: 30000,
        effects: { satisfaction: +15, trust: +10 },
        feedback: "战略伙伴注入资源，董事会态度缓和",
      },
      {
        text: "承诺对赌条款，设定业绩底线",
        cost: 0,
        effects: { satisfaction: -20, trust: -10, risk: +25 },
        feedback: "对赌条款增加了未来压力，但暂时过关",
      },
    ],
  },
  severe_warning: {
    icon: "🔴",
    title: "董事会紧急会议",
    severity: 3,
    trigger: "KPI完成率 <30% 或连续3季未达标",
    options: [
      {
        text: "CEO主动降薪，与团队共渡难关",
        cost: 0,
        effects: { satisfaction: +20, trust: +15, employeeMorale: +10 },
        feedback: "CEO表率作用感动团队和董事会",
      },
      {
        text: "更换CEO（玩家让位给联合创始人）",
        cost: 0,
        effects: { satisfaction: -30, trust: -20, leadershipChange: true },
        feedback: "被迫让出CEO职位，但公司可能起死回生",
      },
      {
        text: "接受强制融资条款（高利息过桥贷款）",
        cost: 100000,
        effects: {
          satisfaction: +5,
          trust: +5,
          debt: +100000,
          interestRate: 0.15,
        },
        feedback: "高息过桥贷款暂时缓解现金流，但债务负担加重",
      },
    ],
  },
  ultimatum: {
    icon: "💀",
    title: "董事会最后通牒",
    severity: 4,
    trigger: "KPI完成率 <20% 或 Runway < 3个月",
    options: [
      {
        text: "接受投资人接管，降为COO",
        cost: 0,
        effects: { satisfaction: -50, trust: -30, playerRoleChange: "COO" },
        feedback: "失去CEO职位，但仍留在公司",
      },
      {
        text: "寻找白衣骑士（紧急融资）",
        cost: 50000,
        effects: { satisfaction: +10, trust: +10, dilution: 0.2 },
        feedback: "紧急出让20%股权引入新投资人",
      },
      {
        text: "拒绝所有条件，独自承担风险",
        cost: 0,
        effects: { satisfaction: -80, trust: -50, boardRevolt: true },
        feedback: "董事会威胁启动罢免程序",
      },
    ],
  },
};

// ====== P1-6: 股东沟通行动 ======
const SHAREHOLDER_COMMUNICATION_ACTIONS = {
  quarterly_report: {
    id: "quarterly_report",
    name: "季度财报汇报",
    icon: "📊",
    cost: 5000,
    desc: "准备详细的季度财报，向董事会展示业绩",
    effects: { satisfaction: +8, trust: +5 },
    requiresRank: null,
  },
  investor_meeting: {
    id: "investor_meeting",
    name: "投资人面对面",
    icon: "🤝",
    cost: 10000,
    desc: "邀请主要投资人参加闭门会议，深度沟通",
    effects: { satisfaction: +12, trust: +15 },
    requiresRank: null,
  },
  board_retreat: {
    id: "board_retreat",
    name: "董事会务虚会",
    icon: "🏖️",
    cost: 30000,
    desc: "组织董事会务虚会，统一战略方向",
    effects: { satisfaction: +20, trust: +25, alignment: +15 },
    requiresRank: null,
  },
  roadshow: {
    id: "roadshow",
    name: "投资人路演",
    icon: "🎤",
    cost: 50000,
    desc: "举办大型路演活动，展示公司愿景和规划",
    effects: { satisfaction: +25, trust: +30, reputation: +10 },
    requiresRank: null,
  },
  crisis_communication: {
    id: "crisis_communication",
    name: "危机公关沟通",
    icon: "🚨",
    cost: 20000,
    desc: "在危机时刻主动与投资人沟通，争取理解",
    effects: { satisfaction: +10, trust: +10, crisisMitigation: true },
    requiresRank: null,
  },
};

// ====== P1-7: 公关/媒体系统数据常量 ======

/** 媒体关系类型 */
const MEDIA_TYPES = {
  tech_media: {
    name: "科技媒体",
    icon: "💻",
    examples: ["36Kr", "虎嗅", "钛媒体", "品玩", "创业邦"],
    influenceWeight: 0.35,
    audience: "科技从业者/投资人",
    coverageBias: "产品/技术",
  },
  business_media: {
    name: "商业媒体",
    icon: "📰",
    examples: ["财经", "第一财经", "界面", "彭博社", "路透社"],
    influenceWeight: 0.3,
    audience: "商业人士/投资者",
    coverageBias: "融资/业绩",
  },
  social_media: {
    name: "社交媒体",
    icon: "📱",
    examples: ["微博", "抖音", "小红书", "B站", "知乎"],
    influenceWeight: 0.25,
    audience: "大众用户",
    coverageBias: "用户故事/品牌",
  },
  industry_media: {
    name: "行业媒体",
    icon: "🏭",
    examples: ["行业垂直媒体", "行业协会刊物", "行业峰会报道"],
    influenceWeight: 0.1,
    audience: "行业从业者",
    coverageBias: "行业动态",
  },
};

/** 公关活动类型 */
const PR_EVENT_TEMPLATES = {
  // === 正面公关活动 ===
  press_conference: {
    id: "press_conference",
    name: "新闻发布会",
    icon: "🎤",
    type: "positive",
    cost: 50000,
    duration: 7,
    mediaTypes: ["tech_media", "business_media"],
    effects: { reputation: +15, mediaRelations: +20, brandAwareness: +10 },
    triggerConditions: { rank: "registered", minRevenue: 100000 },
    desc: "举办产品发布会或公司重大里程碑发布会",
    successChance: 0.75,
  },
  media_interview: {
    id: "media_interview",
    name: "高管专访",
    icon: "🎙️",
    type: "positive",
    cost: 15000,
    duration: 3,
    mediaTypes: ["tech_media", "business_media"],
    effects: { reputation: +8, mediaRelations: +15, trust: +5 },
    triggerConditions: { rank: "registered" },
    desc: "安排CEO/CTO接受主流媒体专访",
    successChance: 0.85,
  },
  industry_summit: {
    id: "industry_summit",
    name: "行业峰会演讲",
    icon: "🏛️",
    type: "positive",
    cost: 30000,
    duration: 5,
    mediaTypes: ["industry_media", "tech_media"],
    effects: { reputation: +10, mediaRelations: +12, industryInfluence: +8 },
    triggerConditions: { rank: "registered", minRevenue: 50000 },
    desc: "参加行业峰会并发表主题演讲",
    successChance: 0.8,
  },
  csr_activity: {
    id: "csr_activity",
    name: "企业社会责任活动",
    icon: "❤️",
    type: "positive",
    cost: 20000,
    duration: 4,
    mediaTypes: ["social_media", "business_media"],
    effects: { reputation: +12, mediaRelations: +10, brandLoyalty: +5 },
    triggerConditions: { rank: "registered", minRevenue: 30000 },
    desc: "组织公益活动/环保行动/教育捐赠等CSR活动",
    successChance: 0.9,
  },
  award_submission: {
    id: "award_submission",
    name: "申报行业奖项",
    icon: "🏆",
    type: "positive",
    cost: 10000,
    duration: 14,
    mediaTypes: ["industry_media", "tech_media"],
    effects: { reputation: +8, mediaRelations: +8, brandPrestige: +5 },
    triggerConditions: { rank: "registered", minRevenue: 20000 },
    desc: "申报创业大赛/创新奖/行业评选等",
    successChance: 0.6,
  },
  thought_leadership: {
    id: "thought_leadership",
    name: "发布行业白皮书",
    icon: "📄",
    type: "positive",
    cost: 40000,
    duration: 21,
    mediaTypes: ["tech_media", "business_media", "industry_media"],
    effects: {
      reputation: +15,
      mediaRelations: +18,
      industryInfluence: +12,
      brandPrestige: +8,
    },
    triggerConditions: { rank: "established", minRevenue: 200000 },
    desc: "联合研究机构发布行业趋势白皮书",
    successChance: 0.7,
  },

  // === 负面事件/危机 ===
  product_failure: {
    id: "product_failure",
    name: "产品故障/质量危机",
    icon: "⚠️",
    type: "crisis",
    severity: "medium",
    mediaTypes: ["tech_media", "social_media"],
    effects: { reputation: -15, mediaRelations: -10, userTrust: -20 },
    triggerChance: 0.02, // 2%概率触发
    descTemplate: "产品出现重大故障/质量问题，引发用户投诉和媒体关注",
    responseOptions: ["recall", "compensate", "apologize", "ignore"],
  },
  data_breach: {
    id: "data_breach",
    name: "数据泄露事件",
    icon: "🔒",
    type: "crisis",
    severity: "high",
    mediaTypes: ["tech_media", "business_media", "social_media"],
    effects: {
      reputation: -25,
      mediaRelations: -15,
      userTrust: -30,
      legalRisk: +20,
    },
    triggerChance: 0.01,
    descTemplate: "用户数据泄露/黑客攻击/内部泄露，引发监管和用户担忧",
    responseOptions: [
      "notify_users",
      "hire_security",
      "cooperate_authorities",
      "settle",
    ],
  },
  executive_scandal: {
    id: "executive_scandal",
    name: "高管丑闻",
    icon: "😱",
    type: "crisis",
    severity: "high",
    mediaTypes: ["social_media", "business_media"],
    effects: { reputation: -20, mediaRelations: -10, employeeMorale: -15 },
    triggerChance: 0.008,
    descTemplate: "CEO/高管个人丑闻曝光，影响公司声誉",
    responseOptions: [
      "suspend_exec",
      "public_statement",
      "legal_action",
      "wait",
    ],
  },
  customer_complaint: {
    id: "customer_complaint",
    name: "用户投诉发酵",
    icon: "😤",
    type: "crisis",
    severity: "low",
    mediaTypes: ["social_media"],
    effects: { reputation: -8, mediaRelations: -5, userTrust: -10 },
    triggerChance: 0.03,
    descTemplate: "用户投诉在社交媒体发酵，形成负面舆论",
    responseOptions: [
      "respond_publicly",
      "private_settlement",
      "improve_service",
      "ignore",
    ],
  },
  competitor_attack: {
    id: "competitor_attack",
    name: "竞争对手抹黑",
    icon: "⚔️",
    type: "crisis",
    severity: "medium",
    mediaTypes: ["tech_media", "industry_media"],
    effects: { reputation: -10, mediaRelations: -5, marketShare: -3 },
    triggerChance: 0.015,
    descTemplate: "竞争对手通过媒体/社交网络散布负面信息",
    responseOptions: [
      "counter_statement",
      "legal_action",
      "ignore",
      "focus_product",
    ],
  },
  regulatory_investigation: {
    id: "regulatory_investigation",
    name: "监管调查",
    icon: "👮",
    type: "crisis",
    severity: "high",
    mediaTypes: ["business_media", "tech_media"],
    effects: {
      reputation: -20,
      mediaRelations: -15,
      legalRisk: +25,
      stockImpact: -10,
    },
    triggerChance: 0.005,
    descTemplate: "监管机构对公司展开调查（数据合规/反垄断/劳动等）",
    responseOptions: ["cooperate", "legal_defense", "settle", "lobby"],
  },
};

/** 危机应对选项 */
const CRISIS_RESPONSE_OPTIONS = {
  // 产品故障应对
  recall: {
    label: "召回产品",
    cost: 100000,
    effect: { reputation: +10, userTrust: +15, mediaRelations: +5 },
    desc: "立即召回问题产品，全额退款，展现负责任态度",
    risk: "财务损失大，但赢得用户信任",
  },
  compensate: {
    label: "赔偿用户",
    cost: 50000,
    effect: { reputation: +5, userTrust: +10, mediaRelations: +3 },
    desc: "对受影响用户进行赔偿，修复关系",
    risk: "中等财务损失",
  },
  apologize: {
    label: "公开道歉",
    cost: 0,
    effect: { reputation: +3, userTrust: +5, mediaRelations: +2 },
    desc: "CEO公开道歉，承诺改进",
    risk: "成本低但效果有限",
  },
  ignore: {
    label: "冷处理",
    cost: 0,
    effect: { reputation: -10, userTrust: -15, mediaRelations: -5 },
    desc: "不回应，等待舆论自然消散",
    risk: "声誉持续受损，可能发酵",
  },

  // 数据泄露应对
  notify_users: {
    label: "通知用户",
    cost: 20000,
    effect: { reputation: +5, userTrust: +10, legalRisk: -5 },
    desc: "主动通知受影响用户，提供保护建议",
    risk: "短期负面但展现透明度",
  },
  hire_security: {
    label: "聘请安全团队",
    cost: 100000,
    effect: { reputation: +8, mediaRelations: +5, legalRisk: -10 },
    desc: "聘请顶级网络安全公司调查和修复",
    risk: "高成本但专业处理",
  },
  cooperate_authorities: {
    label: "配合调查",
    cost: 30000,
    effect: { reputation: +10, legalRisk: -15, mediaRelations: +3 },
    desc: "主动配合监管机构调查，展现合规态度",
    risk: "可能面临罚款但减轻处罚",
  },
  settle: {
    label: "和解",
    cost: 200000,
    effect: { reputation: +5, legalRisk: -20, mediaRelations: +2 },
    desc: "与受影响用户/机构达成和解",
    risk: "高额和解金但快速解决",
  },

  // 高管丑闻应对
  suspend_exec: {
    label: "暂停高管职务",
    cost: 0,
    effect: { reputation: +8, employeeMorale: +5, mediaRelations: +3 },
    desc: "立即暂停涉事高管职务，展开内部调查",
    risk: "可能影响公司运营",
  },
  public_statement: {
    label: "发布声明",
    cost: 0,
    effect: { reputation: +3, mediaRelations: +2 },
    desc: "发布官方声明，表明公司立场",
    risk: "效果有限",
  },
  legal_action: {
    label: "法律行动",
    cost: 50000,
    effect: { reputation: +5, mediaRelations: +3 },
    desc: "对不实报道/诽谤采取法律行动",
    risk: "可能激化矛盾",
  },
  wait: {
    label: "等待澄清",
    cost: 0,
    effect: { reputation: -5, mediaRelations: -3 },
    desc: "等待事实澄清后再处理",
    risk: "舆论可能发酵",
  },

  // 用户投诉应对
  respond_publicly: {
    label: "公开回应",
    cost: 0,
    effect: { reputation: +5, userTrust: +8, mediaRelations: +3 },
    desc: "在社交媒体公开回应，展现重视态度",
    risk: "需要快速响应",
  },
  private_settlement: {
    label: "私下和解",
    cost: 10000,
    effect: { reputation: +2, userTrust: +5 },
    desc: "与投诉用户私下沟通解决",
    risk: "可能无法阻止发酵",
  },
  improve_service: {
    label: "改进服务",
    cost: 20000,
    effect: { reputation: +8, userTrust: +10, mediaRelations: +5 },
    desc: "借机改进服务，变危机为转机",
    risk: "需要实际改进",
  },
  ignore_crisis: {
    label: "冷处理",
    cost: 0,
    effect: { reputation: -5, userTrust: -8 },
    desc: "不回应，等待舆论自然消散",
    risk: "可能发酵成更大危机",
  },

  // 竞争对手抹黑应对
  counter_statement: {
    label: "反驳声明",
    cost: 10000,
    effect: { reputation: +5, mediaRelations: +3, marketShare: +2 },
    desc: "发布事实澄清声明，反驳不实信息",
    risk: "可能引发公关战",
  },
  legal_action_competitor: {
    label: "法律诉讼",
    cost: 100000,
    effect: { reputation: +8, mediaRelations: +5, marketShare: +3 },
    desc: "对竞争对手提起不正当竞争诉讼",
    risk: "高成本，结果不确定",
  },
  ignore_competitor: {
    label: "无视",
    cost: 0,
    effect: { reputation: -3, mediaRelations: -2 },
    desc: "不回应，专注产品",
    risk: "市场份额可能受损",
  },
  focus_product: {
    label: "专注产品",
    cost: 50000,
    effect: { reputation: +10, mediaRelations: +5, marketShare: +5 },
    desc: "发布新版本/新功能，用产品力反击",
    risk: "需要快速迭代",
  },

  // 监管调查应对
  cooperate_regulatory: {
    label: "全力配合",
    cost: 50000,
    effect: { reputation: +10, legalRisk: -20, mediaRelations: +5 },
    desc: "主动配合监管，展现合规诚意",
    risk: "可能面临处罚但减轻",
  },
  legal_defense: {
    label: "法律抗辩",
    cost: 200000,
    effect: { reputation: +5, legalRisk: -10 },
    desc: "聘请顶级律师团队抗辩",
    risk: "高成本，长期拉锯",
  },
  settle_regulatory: {
    label: "和解",
    cost: 500000,
    effect: { reputation: +3, legalRisk: -25 },
    desc: "与监管机构达成和解，支付罚款",
    risk: "高额罚款但快速解决",
  },
  lobby: {
    label: "游说",
    cost: 300000,
    effect: { reputation: -5, legalRisk: -15, mediaRelations: -10 },
    desc: "通过行业协会/政府关系影响调查",
    risk: "可能引发更大关注",
  },
};

/** 媒体关系管理行动 */
const MEDIA_RELATION_ACTIONS = {
  build_relationship: {
    id: "build_relationship",
    name: "建立媒体关系",
    icon: "🤝",
    cost: 10000,
    desc: "邀请媒体记者/编辑参加公司活动，建立初步关系",
    effect: { mediaRelations: +10, reputation: +3 },
    cooldown: 30,
  },
  exclusive_interview: {
    id: "exclusive_interview",
    name: "独家专访",
    icon: "🎙️",
    cost: 25000,
    desc: "安排高管接受特定媒体独家专访",
    effect: { mediaRelations: +15, reputation: +8, brandAwareness: +5 },
    cooldown: 60,
  },
  press_trip: {
    id: "press_trip",
    name: "媒体参访",
    icon: "🏢",
    cost: 40000,
    desc: "组织媒体记者参观公司，深度了解业务",
    effect: { mediaRelations: +20, reputation: +10, brandAwareness: +8 },
    cooldown: 90,
  },
  media_luncheon: {
    id: "media_luncheon",
    name: "媒体午餐会",
    icon: "🍽️",
    cost: 15000,
    desc: "举办媒体午餐会，非正式交流",
    effect: { mediaRelations: +8, reputation: +3 },
    cooldown: 45,
  },
  crisis_prep: {
    id: "crisis_prep",
    name: "危机公关演练",
    icon: "🛡️",
    cost: 30000,
    desc: "聘请公关公司进行危机应对培训和演练",
    effect: { crisisPrepLevel: +15, reputation: +2 },
    cooldown: 180,
  },
  media_training: {
    id: "media_training",
    name: "高管媒体培训",
    icon: "📚",
    cost: 20000,
    desc: "为CEO/高管提供媒体采访技巧培训",
    effect: { mediaTrainingLevel: +10, crisisPrepLevel: +5 },
    cooldown: 120,
  },
};

/** 媒体关系等级 */
const MEDIA_RELATION_LEVELS = [
  { level: 0, name: "无关系", icon: "⚪", threshold: 0, bonus: "无" },
  { level: 1, name: "陌生", icon: "👤", threshold: 20, bonus: "基础报道" },
  { level: 2, name: "认识", icon: "🤝", threshold: 40, bonus: "正面报道+5%" },
  {
    level: 3,
    name: "友好",
    icon: "😊",
    threshold: 60,
    bonus: "正面报道+10%，危机缓冲",
  },
  {
    level: 4,
    name: "信任",
    icon: "🤝",
    threshold: 80,
    bonus: "正面报道+15%，优先报道",
  },
  {
    level: 5,
    name: "伙伴",
    icon: "🌟",
    threshold: 100,
    bonus: "正面报道+20%，主动推荐",
  },
];

/** 公关危机等级 */
const CRISIS_LEVELS = [
  { level: 0, name: "平稳", icon: "✅", color: "var(--success)", threshold: 0 },
  { level: 1, name: "轻微", icon: "⚠️", color: "var(--warning)", threshold: 1 },
  { level: 2, name: "中等", icon: "🔶", color: "#f59e0b", threshold: 3 },
  { level: 3, name: "严重", icon: "🔴", color: "var(--danger)", threshold: 5 },
  { level: 4, name: "危急", icon: "🚨", color: "#dc2626", threshold: 8 },
];

// ====== P1-8: 法律/合规风险系统数据常量 ======

/** 法律风险类型 */
const LEGAL_RISK_TYPES = {
  patent: {
    name: "专利/知识产权",
    icon: "📜",
    description: "专利申请、侵权纠纷、专利战",
    industries: ["tech", "manufacturing", "healthcare"],
    severityBase: "medium",
  },
  data_compliance: {
    name: "数据合规",
    icon: "🔒",
    description: "GDPR/个人信息保护/数据泄露/跨境传输",
    industries: ["tech", "finance", "healthcare"],
    severityBase: "high",
  },
  labor: {
    name: "劳动法风险",
    icon: "⚖️",
    description: "加班纠纷/裁员补偿/劳动仲裁/社保合规",
    industries: ["consumer", "tech", "manufacturing"],
    severityBase: "medium",
  },
  antitrust: {
    name: "反垄断",
    icon: "🏛️",
    description: "市场支配地位/价格垄断/排他性协议",
    industries: ["tech", "finance"],
    severityBase: "high",
  },
  advertising: {
    name: "广告/宣传合规",
    icon: "📢",
    description: "虚假宣传/夸大功效/违规广告",
    industries: ["consumer", "healthcare", "tech"],
    severityBase: "low",
  },
  financial: {
    name: "财务/税务合规",
    icon: "💰",
    description: "税务稽查/财务造假/融资合规",
    industries: ["finance", "tech"],
    severityBase: "high",
  },
};

/** 专利系统常量 */
const PATENT_TYPES = {
  invention: {
    name: "发明专利",
    icon: "💡",
    protectionYears: 20,
    cost: 50000,
    description: "核心技术/算法/方法，保护力度最强",
    categories: ["tech", "healthcare", "manufacturing"],
  },
  utility_model: {
    name: "实用新型专利",
    icon: "🔧",
    protectionYears: 10,
    cost: 15000,
    description: "产品结构/外观设计，申请周期短",
    categories: ["manufacturing", "hardware"],
  },
  software_copyright: {
    name: "软件著作权",
    icon: "💻",
    protectionYears: 50,
    cost: 5000,
    description: "源代码/软件作品，自动保护",
    categories: ["tech", "saas", "app"],
  },
  trademark: {
    name: "商标",
    icon: "®️",
    protectionYears: 10,
    cost: 3000,
    description: "品牌名称/Logo，防止仿冒",
    categories: ["consumer", "tech", "all"],
  },
  design_patent: {
    name: "外观设计专利",
    icon: "🎨",
    protectionYears: 15,
    cost: 10000,
    description: "产品外观设计",
    categories: ["manufacturing", "hardware", "consumer"],
  },
};

/** 法律事件模板 */
const LEGAL_EVENT_TEMPLATES = {
  // === 专利相关 ===
  patent_application: {
    id: "patent_application",
    name: "专利申请",
    icon: "📜",
    type: "opportunity",
    cost: 30000,
    duration: 30,
    riskType: "patent",
    effects: { patents: +1, legalRisk: -5, technologyScore: +3 },
    desc: "为公司核心技术申请专利保护",
    successChance: 0.7,
  },
  patent_infringement_suit: {
    id: "patent_infringement_suit",
    name: "专利侵权诉讼（被诉）",
    icon: "⚖️",
    type: "crisis",
    severity: "high",
    riskType: "patent",
    effects: { reputation: -15, legalRisk: +30, financialLoss: 200000 },
    triggerChance: 0.008,
    descTemplate: "被竞争对手/专利流氓起诉专利侵权",
    responseOptions: [
      "settle_patent",
      "fight_patent",
      "design_around",
      "invalid_patent",
    ],
  },
  patent_attack: {
    id: "patent_attack",
    name: "专利攻击（主动）",
    icon: "🗡️",
    type: "strategy",
    cost: 80000,
    riskType: "patent",
    effects: { reputation: -5, marketShare: -5, competitorDamage: +10 },
    desc: "利用专利组合攻击竞争对手",
    successChance: 0.55,
  },

  // === 数据合规相关 ===
  data_audit: {
    id: "data_audit",
    name: "数据合规审计",
    icon: "🔍",
    type: "opportunity",
    cost: 50000,
    duration: 14,
    riskType: "data_compliance",
    effects: { complianceLevel: +15, legalRisk: -10 },
    desc: "聘请第三方进行数据合规审计",
    successChance: 0.9,
  },
  data_breach_regulatory: {
    id: "data_breach_regulatory",
    name: "数据泄露监管处罚",
    icon: "🔒",
    type: "crisis",
    severity: "high",
    riskType: "data_compliance",
    effects: { reputation: -20, legalRisk: +40, financialLoss: 500000 },
    triggerChance: 0.005,
    descTemplate: "因数据泄露/违规收集被监管机构处罚",
    responseOptions: ["pay_fine", "appeal", "remediate", "cooperate"],
  },
  gdpr_violation: {
    id: "gdpr_violation",
    name: "跨境数据传输违规",
    icon: "🌐",
    type: "crisis",
    severity: "high",
    riskType: "data_compliance",
    effects: { reputation: -15, legalRisk: +35, financialLoss: 300000 },
    triggerChance: 0.003,
    descTemplate: "跨境数据传输违反GDPR/个人信息保护法",
    responseOptions: ["comply_transfer", "localize_data", "settle", "appeal"],
  },

  // === 劳动法相关 ===
  labor_arbitration: {
    id: "labor_arbitration",
    name: "劳动仲裁",
    icon: "⚖️",
    type: "crisis",
    severity: "medium",
    riskType: "labor",
    effects: {
      reputation: -10,
      legalRisk: +15,
      financialLoss: 100000,
      employeeMorale: -10,
    },
    triggerChance: 0.01,
    descTemplate: "员工提起劳动仲裁（加班/裁员/薪资纠纷）",
    responseOptions: ["settle_labor", "fight_labor", "negotiate", "comply"],
  },
  labor_inspection: {
    id: "labor_inspection",
    name: "劳动监察",
    icon: "👮",
    type: "crisis",
    severity: "medium",
    riskType: "labor",
    effects: { reputation: -8, legalRisk: +20, financialLoss: 50000 },
    triggerChance: 0.006,
    descTemplate: "劳动监察部门对公司展开调查",
    responseOptions: [
      "cooperate_inspection",
      "remediate_labor",
      "legal_defense",
      "settle_inspection",
    ],
  },
  mass_layoff_dispute: {
    id: "mass_layoff_dispute",
    name: "大规模裁员纠纷",
    icon: "😢",
    type: "crisis",
    severity: "high",
    riskType: "labor",
    effects: {
      reputation: -25,
      legalRisk: +25,
      financialLoss: 300000,
      employeeMorale: -30,
    },
    triggerChance: 0.004,
    descTemplate: "大规模裁员引发员工集体维权/诉讼",
    responseOptions: [
      "increase_severance",
      "negotiate_collective",
      "legal_defense",
      "public_apology",
    ],
  },

  // === 反垄断相关 ===
  antitrust_investigation: {
    id: "antitrust_investigation",
    name: "反垄断调查",
    icon: "🏛️",
    type: "crisis",
    severity: "high",
    riskType: "antitrust",
    effects: {
      reputation: -20,
      legalRisk: +40,
      financialLoss: 1000000,
      marketShare: -5,
    },
    triggerChance: 0.002,
    descTemplate: "监管机构对公司展开反垄断调查",
    responseOptions: [
      "cooperate_antitrust",
      "legal_defense_antitrust",
      "settle_antitrust",
      "divest",
    ],
  },

  // === 广告/宣传合规 ===
  false_advertising: {
    id: "false_advertising",
    name: "虚假宣传处罚",
    icon: "📢",
    type: "crisis",
    severity: "low",
    riskType: "advertising",
    effects: { reputation: -10, legalRisk: +10, financialLoss: 30000 },
    triggerChance: 0.015,
    descTemplate: "广告/宣传内容被认定为虚假宣传",
    responseOptions: ["correct_ad", "pay_fine_ad", "apologize_ad", "settle_ad"],
  },

  // === 财务/税务合规 ===
  tax_audit: {
    id: "tax_audit",
    name: "税务稽查",
    icon: "💰",
    type: "crisis",
    severity: "high",
    riskType: "financial",
    effects: { reputation: -15, legalRisk: +30, financialLoss: 200000 },
    triggerChance: 0.005,
    descTemplate: "税务部门对公司展开稽查",
    responseOptions: [
      "cooperate_tax",
      "legal_defense_tax",
      "settle_tax",
      "remediate_tax",
    ],
  },
  financial_misstatement: {
    id: "financial_misstatement",
    name: "财务信息披露违规",
    icon: "📊",
    type: "crisis",
    severity: "high",
    riskType: "financial",
    effects: {
      reputation: -25,
      legalRisk: +35,
      financialLoss: 500000,
      investorTrust: -20,
    },
    triggerChance: 0.003,
    descTemplate: "财报/融资信息被认定为虚假披露",
    responseOptions: [
      "correct_financial",
      "legal_defense_financial",
      "settle_financial",
      "restate",
    ],
  },
};

/** 法律事件应对选项 */
const LEGAL_RESPONSE_OPTIONS = {
  // === 专利诉讼应对 ===
  settle_patent: {
    label: "和解",
    cost: 150000,
    effect: { reputation: +3, legalRisk: -15, financialLoss: 150000 },
    desc: "与原告达成和解，支付许可费",
    risk: "财务损失，但快速解决",
  },
  fight_patent: {
    label: "抗辩",
    cost: 300000,
    effect: { reputation: +5, legalRisk: -10 },
    desc: "聘请律师团队积极抗辩",
    risk: "高成本，长期诉讼",
  },
  design_around: {
    label: "绕开设计",
    cost: 100000,
    effect: { reputation: +2, legalRisk: -5, technologyScore: -3 },
    desc: "修改产品设计以绕开专利",
    risk: "产品需要重新设计",
  },
  invalid_patent: {
    label: "专利无效化",
    cost: 200000,
    effect: { reputation: +8, legalRisk: -20 },
    desc: "挑战对方专利有效性",
    risk: "高风险高回报",
  },

  // === 数据泄露监管处罚应对 ===
  pay_fine: {
    label: "缴纳罚款",
    cost: 500000,
    effect: { reputation: -5, legalRisk: -25 },
    desc: "接受处罚，缴纳罚款",
    risk: "高额罚款",
  },
  appeal: {
    label: "提起上诉",
    cost: 100000,
    effect: { reputation: 0, legalRisk: -5 },
    desc: "对处罚决定提起行政复议/诉讼",
    risk: "结果不确定",
  },
  remediate: {
    label: "整改",
    cost: 200000,
    effect: { reputation: +5, legalRisk: -20 },
    desc: "全面整改数据合规体系",
    risk: "需要时间和资源投入",
  },
  cooperate: {
    label: "配合调查",
    cost: 50000,
    effect: { reputation: +3, legalRisk: -15 },
    desc: "主动配合监管机构调查",
    risk: "可能面临更重处罚",
  },

  // === 跨境数据传输违规应对 ===
  comply_transfer: {
    label: "合规传输",
    cost: 150000,
    effect: { reputation: +3, legalRisk: -20 },
    desc: "建立合规的跨境数据传输机制",
    risk: "需要技术投入",
  },
  localize_data: {
    label: "数据本地化",
    cost: 300000,
    effect: { reputation: +5, legalRisk: -25, operationalCost: +20000 },
    desc: "将数据完全本地化存储",
    risk: "高成本，影响海外业务",
  },
  settle_data: {
    label: "和解",
    cost: 300000,
    effect: { reputation: 0, legalRisk: -20 },
    desc: "与监管机构达成和解",
    risk: "高额和解金",
  },
  appeal_data: {
    label: "上诉",
    cost: 80000,
    effect: { reputation: 0, legalRisk: -5 },
    desc: "对处罚提起行政诉讼",
    risk: "结果不确定",
  },

  // === 劳动仲裁应对 ===
  settle_labor: {
    label: "和解赔偿",
    cost: 100000,
    effect: { reputation: +2, legalRisk: -15, employeeMorale: +5 },
    desc: "与员工达成和解，支付补偿",
    risk: "财务损失，但快速解决",
  },
  fight_labor: {
    label: "抗辩",
    cost: 50000,
    effect: { reputation: -3, legalRisk: -5, employeeMorale: -5 },
    desc: "通过法律途径抗辩",
    risk: "员工关系恶化",
  },
  negotiate: {
    label: "协商",
    cost: 20000,
    effect: { reputation: +3, legalRisk: -10, employeeMorale: +3 },
    desc: "与员工/工会协商解决方案",
    risk: "需要时间",
  },
  comply_labor: {
    label: "接受裁决",
    cost: 80000,
    effect: { reputation: +5, legalRisk: -15, employeeMorale: +8 },
    desc: "接受仲裁裁决并执行",
    risk: "财务损失",
  },

  // === 劳动监察应对 ===
  cooperate_inspection: {
    label: "配合检查",
    cost: 20000,
    effect: { reputation: +3, legalRisk: -15 },
    desc: "主动配合劳动监察部门检查",
    risk: "可能发现更多问题",
  },
  remediate_labor: {
    label: "整改",
    cost: 80000,
    effect: { reputation: +5, legalRisk: -20 },
    desc: "全面整改劳动合规问题",
    risk: "需要时间和资源",
  },
  legal_defense_labor: {
    label: "法律抗辩",
    cost: 100000,
    effect: { reputation: 0, legalRisk: -10 },
    desc: "聘请律师进行抗辩",
    risk: "高成本",
  },
  settle_inspection: {
    label: "和解",
    cost: 50000,
    effect: { reputation: +2, legalRisk: -15 },
    desc: "与监察部门达成和解",
    risk: "财务损失",
  },

  // === 大规模裁员纠纷应对 ===
  increase_severance: {
    label: "提高补偿",
    cost: 300000,
    effect: { reputation: +10, legalRisk: -20, employeeMorale: +15 },
    desc: "大幅提高裁员补偿标准",
    risk: "高财务成本",
  },
  negotiate_collective: {
    label: "集体协商",
    cost: 50000,
    effect: { reputation: +5, legalRisk: -10, employeeMorale: +5 },
    desc: "与员工代表/工会集体协商",
    risk: "需要谈判技巧",
  },
  legal_defense_layoff: {
    label: "法律抗辩",
    cost: 150000,
    effect: { reputation: -5, legalRisk: -5, employeeMorale: -10 },
    desc: "通过法律途径抗辩",
    risk: "员工关系严重恶化",
  },
  public_apology: {
    label: "公开道歉",
    cost: 0,
    effect: { reputation: +3, legalRisk: 0, employeeMorale: +5 },
    desc: "CEO公开道歉，承诺改进",
    risk: "效果有限",
  },

  // === 反垄断调查应对 ===
  cooperate_antitrust: {
    label: "配合调查",
    cost: 100000,
    effect: { reputation: +3, legalRisk: -20 },
    desc: "主动配合反垄断调查",
    risk: "可能面临重罚",
  },
  legal_defense_antitrust: {
    label: "法律抗辩",
    cost: 500000,
    effect: { reputation: 0, legalRisk: -10 },
    desc: "聘请顶级反垄断律师团队",
    risk: "极高成本",
  },
  settle_antitrust: {
    label: "和解",
    cost: 1000000,
    effect: { reputation: -5, legalRisk: -30, marketShare: -3 },
    desc: "与监管机构达成和解",
    risk: "巨额罚款+业务限制",
  },
  divest: {
    label: "剥离资产",
    cost: 2000000,
    effect: { reputation: -10, legalRisk: -40, marketShare: -10 },
    desc: "剥离部分业务/资产以消除垄断嫌疑",
    risk: "重大战略损失",
  },

  // === 虚假宣传处罚应对 ===
  correct_ad: {
    label: "更正广告",
    cost: 20000,
    effect: { reputation: +3, legalRisk: -10 },
    desc: "立即更正/下架违规广告",
    risk: "营销中断",
  },
  pay_fine_ad: {
    label: "缴纳罚款",
    cost: 30000,
    effect: { reputation: -2, legalRisk: -15 },
    desc: "接受处罚，缴纳罚款",
    risk: "财务损失",
  },
  apologize_ad: {
    label: "公开道歉",
    cost: 0,
    effect: { reputation: +2, legalRisk: -5 },
    desc: "公开道歉并承诺整改",
    risk: "效果有限",
  },
  settle_ad: {
    label: "和解",
    cost: 20000,
    effect: { reputation: +1, legalRisk: -10 },
    desc: "与监管部门达成和解",
    risk: "财务损失",
  },

  // === 税务稽查应对 ===
  cooperate_tax: {
    label: "配合稽查",
    cost: 30000,
    effect: { reputation: +3, legalRisk: -15 },
    desc: "主动配合税务部门稽查",
    risk: "可能发现更多问题",
  },
  legal_defense_tax: {
    label: "法律抗辩",
    cost: 150000,
    effect: { reputation: 0, legalRisk: -10 },
    desc: "聘请税务律师抗辩",
    risk: "高成本",
  },
  settle_tax: {
    label: "和解",
    cost: 200000,
    effect: { reputation: -2, legalRisk: -20 },
    desc: "与税务部门达成和解",
    risk: "财务损失",
  },
  remediate_tax: {
    label: "整改",
    cost: 100000,
    effect: { reputation: +5, legalRisk: -25 },
    desc: "全面整改税务合规问题",
    risk: "需要时间和资源",
  },

  // === 财务信息披露违规应对 ===
  correct_financial: {
    label: "更正披露",
    cost: 50000,
    effect: { reputation: +3, legalRisk: -10, investorTrust: +5 },
    desc: "发布更正后的财务信息",
    risk: "市场信心受损",
  },
  legal_defense_financial: {
    label: "法律抗辩",
    cost: 300000,
    effect: { reputation: -5, legalRisk: -5, investorTrust: -10 },
    desc: "通过法律途径抗辩",
    risk: "投资者信心进一步受损",
  },
  settle_financial: {
    label: "和解",
    cost: 500000,
    effect: { reputation: -10, legalRisk: -20, investorTrust: -5 },
    desc: "与监管机构/投资者达成和解",
    risk: "高额和解金+声誉损失",
  },
  restate: {
    label: "重述财报",
    cost: 100000,
    effect: { reputation: -5, legalRisk: -15, investorTrust: +3 },
    desc: "重述过往财报，全面披露",
    risk: "市场信心短期受损",
  },
};

/** 法律合规检查清单 */
const LEGAL_CHECKLIST = {
  patent_filing: {
    id: "patent_filing",
    name: "核心专利申请",
    icon: "📜",
    category: "patent",
    cost: 50000,
    benefit: { legalRisk: -10, technologyScore: +2 },
    description: "为至少1项核心技术申请专利",
  },
  data_compliance_audit: {
    id: "data_compliance_audit",
    name: "数据合规审计",
    icon: "🔍",
    category: "data_compliance",
    cost: 50000,
    benefit: { legalRisk: -15, complianceLevel: +20 },
    description: "完成数据合规第三方审计",
  },
  labor_contract_review: {
    id: "labor_contract_review",
    name: "劳动合同审查",
    icon: "📄",
    category: "labor",
    cost: 10000,
    benefit: { legalRisk: -5, employeeMorale: +3 },
    description: "审查所有劳动合同合规性",
  },
  privacy_policy_update: {
    id: "privacy_policy_update",
    name: "隐私政策更新",
    icon: "🔒",
    category: "data_compliance",
    cost: 5000,
    benefit: { legalRisk: -3, complianceLevel: +5 },
    description: "更新隐私政策符合最新法规",
  },
  tax_compliance_check: {
    id: "tax_compliance_check",
    name: "税务合规检查",
    icon: "💰",
    category: "financial",
    cost: 30000,
    benefit: { legalRisk: -8, financialRisk: -5 },
    description: "聘请税务师进行合规检查",
  },
  employment_handbook: {
    id: "employment_handbook",
    name: "员工手册更新",
    icon: "📖",
    category: "labor",
    cost: 5000,
    benefit: { legalRisk: -3, employeeMorale: +2 },
    description: "更新员工手册符合最新劳动法",
  },
  ip_assignment: {
    id: "ip_assignment",
    name: "知识产权归属协议",
    icon: "💼",
    category: "patent",
    cost: 10000,
    benefit: { legalRisk: -5 },
    description: "与所有员工签署IP归属协议",
  },
  advertising_review: {
    id: "advertising_review",
    name: "广告内容审查",
    icon: "📢",
    category: "advertising",
    cost: 10000,
    benefit: { legalRisk: -5, reputation: +2 },
    description: "审查所有广告内容合规性",
  },
};

/** 法律风险等级 */
const LEGAL_RISK_LEVELS = [
  {
    level: 0,
    name: "健康",
    icon: "✅",
    color: "var(--success)",
    threshold: 0,
    description: "法律风险极低，合规状况良好",
  },
  {
    level: 1,
    name: "低",
    icon: "🟢",
    color: "#22c55e",
    threshold: 10,
    description: "法律风险较低，注意日常合规",
  },
  {
    level: 2,
    name: "中",
    icon: "🟡",
    color: "var(--warning)",
    threshold: 25,
    description: "法律风险中等，需要加强合规",
  },
  {
    level: 3,
    name: "高",
    icon: "🟠",
    color: "#f97316",
    description: "法律风险较高，需要立即行动",
    threshold: 45,
  },
  {
    level: 4,
    name: "危急",
    icon: "🔴",
    color: "var(--danger)",
    threshold: 65,
    description: "法律风险极高，面临重大威胁",
  },
];

/** 公司合规等级 */
const COMPLIANCE_LEVELS = [
  {
    level: 0,
    name: "无合规体系",
    icon: "⚠️",
    color: "var(--danger)",
    threshold: 0,
    description: "没有任何合规措施，风险极高",
  },
  {
    level: 1,
    name: "基础合规",
    icon: "📋",
    color: "var(--warning)",
    threshold: 15,
    description: "有基础合规意识，但体系不完善",
  },
  {
    level: 2,
    name: "合规框架",
    icon: "📄",
    color: "#f59e0b",
    threshold: 35,
    description: "有合规框架，但执行不到位",
  },
  {
    level: 3,
    name: "合规体系",
    icon: "✅",
    color: "#22c55e",
    threshold: 55,
    description: "有完整的合规体系，运行良好",
  },
  {
    level: 4,
    name: "合规标杆",
    icon: "🏆",
    color: "var(--primary)",
    threshold: 75,
    description: "行业合规标杆，风险极低",
  },
];

// ====== 产品类别（15+类别，每类有独特机制）======
const PRODUCT_CATEGORIES = {
  // === 基础6类（原有）===
  app: {
    name: "移动应用",
    icon: "📱",
    baseDevTime: 60,
    baseCost: 50000,
    revenueModel: "订阅/广告/内购",
    features: ["用户系统", "推送通知", "应用内购买", "社交分享"],
    growthFactor: 1.0,
    churnRate: 0.05,
    baseArpu: 0.5, // 元/天/用户
    description: "iOS/Android应用，用户基数大但竞争激烈",
  },
  saas: {
    name: "SaaS平台",
    icon: "☁️",
    baseDevTime: 90,
    baseCost: 100000,
    revenueModel: "订阅制",
    features: ["多租户", "API接口", "数据看板", "权限管理"],
    growthFactor: 1.2,
    churnRate: 0.03,
    baseArpu: 2.0, // B端用户价值高
    description: "企业级软件服务，高留存高LTV",
  },
  hardware: {
    name: "智能硬件",
    icon: "🔌",
    baseDevTime: 120,
    baseCost: 200000,
    revenueModel: "销售",
    features: ["供应链管理", "质量控制", "售后服务", "渠道分销"],
    growthFactor: 0.8,
    churnRate: 0.02,
    baseArpu: 0.3, // 硬件一次性购买，后续收入低
    description: "IoT设备/智能产品，重资产但壁垒高",
  },
  content: {
    name: "内容平台",
    icon: "📖",
    baseDevTime: 45,
    baseCost: 30000,
    revenueModel: "广告/订阅",
    features: ["内容审核", "推荐算法", "创作者激励", "付费墙"],
    growthFactor: 1.5,
    churnRate: 0.08,
    baseArpu: 0.4, // 内容平台广告收入为主
    description: "图文/视频内容社区，增长快但变现难",
  },
  marketplace: {
    name: "交易平台",
    icon: "🛒",
    baseDevTime: 80,
    baseCost: 80000,
    revenueModel: "佣金",
    features: ["双边市场", "支付结算", "信用体系", "纠纷处理"],
    growthFactor: 1.3,
    churnRate: 0.04,
    baseArpu: 0.8, // 交易佣金收入
    description: "C2C/B2C交易撮合，网络效应强",
  },
  ai_service: {
    name: "AI服务",
    icon: "🧠",
    baseDevTime: 100,
    baseCost: 150000,
    revenueModel: "API调用/订阅",
    features: ["模型训练", "API网关", "数据标注", "算力优化"],
    growthFactor: 1.8,
    churnRate: 0.03,
    baseArpu: 1.5, // API调用按量付费
    description: "AI能力输出，高增长高壁垒",
  },

  // === 新增9类 ===
  social: {
    name: "社交应用",
    icon: "💬",
    baseDevTime: 70,
    baseCost: 60000,
    revenueModel: "广告/虚拟物品/会员",
    features: ["即时通讯", "动态发布", "群组功能", "直播"],
    growthFactor: 2.0,
    churnRate: 0.1,
    baseArpu: 0.6, // 社交广告+虚拟物品
    description: "社交网络/即时通讯，病毒传播强但留存挑战大",
  },
  game: {
    name: "游戏",
    icon: "🎮",
    baseDevTime: 150,
    baseCost: 120000,
    revenueModel: "内购/广告/订阅",
    features: ["游戏引擎", "匹配系统", "反作弊", "运营活动"],
    growthFactor: 1.6,
    churnRate: 0.12,
    baseArpu: 1.0, // 游戏内购收入高但波动大
    description: "手游/页游，爆款效应明显但失败率高",
  },
  ecommerce: {
    name: "电商",
    icon: "🛍️",
    baseDevTime: 100,
    baseCost: 150000,
    revenueModel: "商品差价/平台佣金",
    features: ["商品管理", "物流系统", "客服系统", "营销活动"],
    growthFactor: 1.1,
    churnRate: 0.03,
    baseArpu: 0.7, // 电商交易佣金
    description: "垂直电商/综合电商，供应链是核心壁垒",
  },
  edtech: {
    name: "在线教育",
    icon: "📚",
    baseDevTime: 80,
    baseCost: 70000,
    revenueModel: "课程销售/订阅",
    features: ["直播课堂", "录播系统", "作业批改", "学习数据分析"],
    growthFactor: 1.0,
    churnRate: 0.06,
    baseArpu: 0.8, // 课程订阅收入
    description: "K12/职业教育/兴趣教育，政策敏感但需求稳定",
  },
  healthtech: {
    name: "医疗AI/健康科技",
    icon: "🏥",
    baseDevTime: 180,
    baseCost: 200000,
    revenueModel: "服务订阅/按次收费",
    features: ["医疗数据", "合规认证", "远程诊疗", "健康管理"],
    growthFactor: 1.4,
    churnRate: 0.02,
    baseArpu: 1.2, // 医疗健康服务价值高
    description: "数字健康/远程医疗，监管严格但壁垒极高",
  },
  autopilot: {
    name: "自动驾驶/智能出行",
    icon: "🚗",
    baseDevTime: 200,
    baseCost: 300000,
    revenueModel: "技术服务费/授权费",
    features: ["传感器融合", "高精地图", "仿真测试", "法规合规"],
    growthFactor: 1.5,
    churnRate: 0.01,
    baseArpu: 1.5, // B端授权费高
    description: "自动驾驶技术/出行服务，重研发但天花板高",
  },
  blockchain: {
    name: "区块链/Web3",
    icon: "⛓️",
    baseDevTime: 120,
    baseCost: 100000,
    revenueModel: "交易手续费/Token经济",
    features: ["智能合约", "去中心化存储", "跨链", "DAO治理"],
    growthFactor: 2.5,
    churnRate: 0.15,
    baseArpu: 0.5, // 交易手续费波动大
    description: "DeFi/NFT/元宇宙，波动极大但想象空间大",
  },
  metaverse: {
    name: "元宇宙/VR",
    icon: "🥽",
    baseDevTime: 160,
    baseCost: 180000,
    revenueModel: "虚拟物品/订阅/广告",
    features: ["3D引擎", "VR交互", "虚拟经济", "社交空间"],
    growthFactor: 1.8,
    churnRate: 0.1,
    baseArpu: 0.6, // 虚拟物品收入
    description: "虚拟世界/沉浸式体验，技术门槛高但前景广阔",
  },
  green_tech: {
    name: "新能源/绿色科技",
    icon: "🌱",
    baseDevTime: 140,
    baseCost: 200000,
    revenueModel: "设备销售/服务费",
    features: ["储能技术", "能源管理", "碳追踪", "政策补贴"],
    growthFactor: 1.3,
    churnRate: 0.02,
    baseArpu: 0.4, // 设备销售为主
    description: "新能源/碳中和相关，政策驱动但市场空间大",
  },
  agritech: {
    name: "农业科技",
    icon: "🌾",
    baseDevTime: 100,
    baseCost: 80000,
    revenueModel: "设备销售/数据服务",
    features: ["精准农业", "无人机", "物联网监测", "供应链溯源"],
    growthFactor: 0.9,
    churnRate: 0.02,
    baseArpu: 0.3, // B端数据服务
    description: "智慧农业/农产品溯源，市场教育成本高但竞争少",
  },
  logitech: {
    name: "物流科技",
    icon: "📦",
    baseDevTime: 90,
    baseCost: 100000,
    revenueModel: "SaaS订阅/按单收费",
    features: ["路径优化", "仓储管理", "运力匹配", "实时追踪"],
    growthFactor: 1.1,
    churnRate: 0.03,
    baseArpu: 0.6, // SaaS订阅
    description: "智慧物流/供应链优化，B端需求稳定",
  },
  creator_tool: {
    name: "内容创作工具",
    icon: "🎨",
    baseDevTime: 60,
    baseCost: 40000,
    revenueModel: "订阅/按量付费",
    baseArpu: 0.5, // 订阅制
    features: ["AI生成", "模板库", "协作编辑", "多平台发布"],
    growthFactor: 1.7,
    churnRate: 0.05,
    description: "AI写作/设计/视频工具，创作者经济爆发",
  },
  enterprise: {
    name: "企业服务",
    icon: "🏢",
    baseDevTime: 100,
    baseCost: 120000,
    revenueModel: "SaaS订阅/定制开发",
    baseArpu: 1.8, // B端高价值
    features: ["CRM", "ERP", "HR系统", "数据分析"],
    growthFactor: 1.0,
    churnRate: 0.02,
    description: "B端管理软件，销售周期长但客户价值高",
  },
  fintech_pay: {
    name: "支付/金融科技",
    icon: "💳",
    baseDevTime: 120,
    baseCost: 150000,
    revenueModel: "交易手续费",
    baseArpu: 1.0, // 交易手续费收入
    features: ["支付网关", "风控系统", "清结算", "合规牌照"],
    growthFactor: 1.2,
    churnRate: 0.02,
    description: "支付/借贷/理财科技，牌照是核心壁垒",
  },
};
