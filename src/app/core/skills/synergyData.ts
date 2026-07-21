/**
 * 技能连携数据表（canonical source / 规范源）
 *
 * 与 vanilla src/js/core/skill_synergy.js 的 SKILL_SYNERGY_DUAL / TRIPLE / THEME
 * 逐字段一致。阶段3 纯逻辑 TS 化批次16：TS 侧为规范源，vanilla 端零改动。
 * 任何字段调整须同步两侧，并由 tests/skillSynergy.canonical.test.cjs 的数据保真断言守护。
 */

// 双技能连携（2门技能达到阈值）
export const SKILL_SYNERGY_DUAL = {
  // 烹饪 + 销售 = 餐饮创业加成
  cooking_sales: {
    id: "cooking_sales",
    name: "餐饮创业",
    icon: "🍽️",
    skills: [
      { id: "cooking", minLevel: 40 },
      { id: "sales", minLevel: 40 },
    ],
    effects: {
      // 摆摊小吃收入+30%
      street_vending_food: { incomeMultiplier: 1.3 },
      sister_zhang_vending: { incomeMultiplier: 1.3 },
      // 实装连携解锁工作
      unlockJobs: ["food_truck_owner"],
      // 食材成本-15%
      foodCostReduction: 0.15,
      // 顾客满意度+20%
      customerSatisfactionBonus: 0.2,
    },
    desc: "懂烹饪又懂销售，开个小餐馆或摆摊卖小吃都能赚钱。",
  },

  // 编程 + 英语 = 国际外包
  coding_english: {
    id: "coding_english",
    name: "国际外包",
    icon: "🌐",
    skills: [
      { id: "coding", minLevel: 50 },
      { id: "english", minLevel: 50 },
    ],
    effects: {
      // 编程类工作收入+40%
      coding: { incomeMultiplier: 1.4 },
      freelance_writing: { incomeMultiplier: 1.3 },
      content_writing: { incomeMultiplier: 1.3 },
      // 解锁国际外包工作
      unlockJobs: ["remote_dev"],
      // 学习XP+20%
      codingXpBonus: 0.2,
      englishXpBonus: 0.2,
    },
    desc: "会编程又会英语，可以接国际外包单，收入翻倍。",
  },

  // 维修 + 电工 = 综合维修
  repair_electrician: {
    id: "repair_electrician",
    name: "综合维修",
    icon: "🔧",
    skills: [
      { id: "repair", minLevel: 40 },
      { id: "electrician", minLevel: 40 },
    ],
    effects: {
      // 维修类工作收入+35%
      instrument_repair: { incomeMultiplier: 1.35 },
      electronics_repair: { incomeMultiplier: 1.35 },
      factory_electrician: { incomeMultiplier: 1.3 },
      // 解锁综合维修工作
      unlockJobs: ["master_repairman"],
      // 装备维修损耗-30%
      repairWearReduction: 0.3,
    },
    desc: "既能修机械又能修电路，成为综合维修师傅，收入翻倍。",
  },

  // 销售 + 管理 = 团队销售
  sales_management: {
    id: "sales_management",
    name: "团队销售",
    icon: "👥",
    skills: [
      { id: "sales", minLevel: 50 },
      { id: "management", minLevel: 40 },
    ],
    effects: {
      // 销售类工作收入+30%
      shop_assistant: { incomeMultiplier: 1.3 },
      promoter: { incomeMultiplier: 1.3 },
      // 解锁团队销售管理
      unlockJobs: ["sales_team_lead"],
      // 团队规模+2
      teamSizeBonus: 2,
      // 人缘成长+15%
      popularityBonus: 15,
    },
    desc: "懂销售又会管理，可以带领销售团队，收入翻倍。",
  },

  // 驾驶 + 物流 = 长途运输
  driving_logistics: {
    id: "driving_logistics",
    name: "长途运输",
    icon: "🚛",
    skills: [
      { id: "driving", minLevel: 50 },
      { id: "accounting", minLevel: 30 }, // 会计用于计算运费
    ],
    effects: {
      // 货运/配送收入+40%
      truck_assistant: { incomeMultiplier: 1.4 },
      warehouse_logistics: { incomeMultiplier: 1.3 },
      wholesale_delivery: { incomeMultiplier: 1.35 },
      // 解锁长途运输工作
      unlockJobs: ["long_haul_driver"],
      // 旅行AP-3（效率更高）
      travelApReduction: 3,
    },
    desc: "会开车又会算账，可以跑长途运输，收入翻倍。",
  },

  // 烹饪 + 维修 = 家庭全能
  cooking_repair: {
    id: "cooking_repair",
    name: "家庭全能",
    icon: "🏠",
    skills: [
      { id: "cooking", minLevel: 30 },
      { id: "repair", minLevel: 30 },
    ],
    effects: {
      // 在家做饭效果+50%
      homeCookingBonus: 0.5,
      // 自己修理装备节省50%修理费
      selfRepairDiscount: 0.5,
      // 解锁家庭维修行动
      unlockActions: [], // home_repair 待实现
      // 幸福感+10%
      happinessBonus: 10,
    },
    desc: "会做饭又会修东西，在家就能解决大部分问题，省钱又幸福。",
  },

  // 英语 + 管理 = 外企晋升
  english_management: {
    id: "english_management",
    name: "外企晋升",
    icon: "🏢",
    skills: [
      { id: "english", minLevel: 60 },
      { id: "management", minLevel: 50 },
    ],
    effects: {
      // 职场能力+15
      abilityFlatBonus: 15,
      // 向上管理+20
      upwardMgmtBonus: 20,
      // 解锁外企管理岗位
      unlockJobs: ["foreign_company_staff"],
      // 晋升速度+25%
      promoSpeedBonus: 0.25,
    },
    desc: "英语好又会管理，在外企如鱼得水，晋升飞快。",
  },

  // 会计 + 投资 = 财务自由
  accounting_investment: {
    id: "accounting_investment",
    name: "财务自由",
    icon: "💰",
    skills: [
      { id: "accounting", minLevel: 50 },
      { id: "management", minLevel: 40 }, // 管理用于投资决策
    ],
    effects: {
      // 投资收入+30%
      investmentIncomeBonus: 0.3,
      // 股票交易手续费-50%
      tradingFeeReduction: 0.5,
      // 实装连携解锁工作
      unlockJobs: ["finance_analyst"],
      // 每日被动收入+¥50（来自投资）
      passiveInvestmentIncome: 50,
    },
    desc: "懂会计又会投资，钱生钱的速度远超打工，早日财务自由。",
  },
};

// 三技能连携（3门技能达到阈值）
export const SKILL_SYNERGY_TRIPLE = {
  // 烹饪 + 销售 + 管理 = 餐饮帝国
  cooking_sales_management: {
    id: "cooking_sales_management",
    name: "餐饮帝国",
    icon: "👑",
    skills: [
      { id: "cooking", minLevel: 60 },
      { id: "sales", minLevel: 60 },
      { id: "management", minLevel: 50 },
    ],
    effects: {
      // 所有餐饮相关收入+50%
      restaurantIncomeBonus: 0.5,
      // 解锁连锁餐厅
      unlockBusinesses: [], // restaurant_chain 待实现
      // 每日被动收入+¥200
      passiveRestaurantIncome: 200,
      // 员工效率+30%
      employeeEfficiencyBonus: 0.3,
      // 品牌等级提升速度+50%
      brandGrowthBonus: 0.5,
    },
    desc: "集烹饪、销售、管理于一身，可以打造自己的餐饮品牌，实现财务自由。",
  },

  // 编程 + 英语 + 管理 = 技术高管
  coding_english_management: {
    id: "coding_english_management",
    name: "技术高管",
    icon: "🚀",
    skills: [
      { id: "coding", minLevel: 70 },
      { id: "english", minLevel: 60 },
      { id: "management", minLevel: 60 },
    ],
    effects: {
      // 职场能力+25
      abilityFlatBonus: 25,
      // 向上管理+30
      upwardMgmtBonus: 30,
      // 解锁CTO岗位
      unlockJobs: [], // cto/tech_director — 属于职场路径，需 corporate 阶段
      // 晋升速度+50%
      promoSpeedBonus: 0.5,
      // 团队规模+5
      teamSizeBonus: 5,
      // 每日被动收入+¥300（来自股票期权）
      passiveStockIncome: 300,
    },
    desc: "技术、英语、管理全精通，可以成为技术高管，实现财富自由。",
  },

  // 维修 + 电工 + 编程 = 智能家居专家
  repair_electrician_coding: {
    id: "repair_electrician_coding",
    name: "智能家居专家",
    icon: "🏡",
    skills: [
      { id: "repair", minLevel: 50 },
      { id: "electrician", minLevel: 50 },
      { id: "coding", minLevel: 40 },
    ],
    effects: {
      // 维修类工作收入+50%
      comprehensiveRepairBonus: 0.5,
      // 解锁智能家居安装工作
      unlockJobs: ["smart_home_tech"],
      // 装备维修损耗-50%
      repairWearReduction: 0.5,
      // 每日被动收入+¥100（来自智能家居项目）
      passiveSmartHomeIncome: 100,
    },
    desc: "机械、电路、编程全都会，可以接智能家居项目，收入翻倍。",
  },

  // 驾驶 + 物流 + 会计 = 物流帝国
  driving_logistics_accounting: {
    id: "driving_logistics_accounting",
    name: "物流帝国",
    icon: "🚚",
    skills: [
      { id: "driving", minLevel: 60 },
      { id: "accounting", minLevel: 50 },
      { id: "management", minLevel: 40 },
    ],
    effects: {
      // 货运/配送收入+50%
      logisticsIncomeBonus: 0.5,
      // 解锁物流公司
      unlockBusinesses: [], // logistics_company 待实现
      // 每日被动收入+¥250
      passiveLogisticsIncome: 250,
      // 车队规模+3
      fleetSizeBonus: 3,
    },
    desc: "会开车、会算账、会管理，可以开物流公司，实现财务自由。",
  },
};

// 主题连携（同主题多技能）
export const SKILL_SYNERGY_THEME = {
  // 技术主题：编程 + 电工 + 维修
  tech_theme: {
    id: "tech_theme",
    name: "技术全能",
    icon: "⚙️",
    theme: "技术",
    skills: ["coding", "electrician", "repair"],
    minSkills: 2, // 至少2门达到阈值
    threshold: 40,
    effects: {
      techIncomeBonus: 0.15,
      techXpBonus: 0.1,
      unlockJobs: [], // tech_consultant 待实现
    },
    desc: "技术相关技能多，成为技术顾问，收入翻倍。",
  },

  // 商业主题：销售 + 管理 + 会计
  business_theme: {
    id: "business_theme",
    name: "商业奇才",
    icon: "💼",
    theme: "商业",
    skills: ["sales", "management", "accounting"],
    minSkills: 2,
    threshold: 40,
    effects: {
      businessIncomeBonus: 0.15,
      businessXpBonus: 0.1,
      unlockJobs: [], // business_consultant 待实现
    },
    desc: "商业相关技能多，成为商业顾问，收入翻倍。",
  },

  // 生活服务主题：烹饪 + 维修 + 驾驶
  service_theme: {
    id: "service_theme",
    name: "生活服务专家",
    icon: "🛠️",
    theme: "生活服务",
    skills: ["cooking", "repair", "driving"],
    minSkills: 2,
    threshold: 40,
    effects: {
      serviceIncomeBonus: 0.15,
      serviceXpBonus: 0.1,
      unlockJobs: [], // personal_assistant 待实现
    },
    desc: "生活服务技能多，成为私人助理，收入翻倍。",
  },
};
