/**
 * 技能天赋树系统（P2#12）
 *
 * 参考《中国式家长》天赋树设计：
 * - 每项技能在Lv.30时可选择 2~3 个发展方向
 * - 每个分支有 3 个天赋节点（Lv.10/25/50解锁），树状前置关系
 * - 分支提供独特的被动加成，影响相关工作和收入
 * - 特定分支影响职场晋升门槛
 */

// ====== 技能分支定义 ======

var SKILL_BRANCHES = {
  cooking: [
    {
      id: "home_chef",
      name: "家常大厨",
      icon: "👨‍🍳",
      desc: "深耕家常菜系，餐馆帮厨收入+25%，降低食材成本",
      jobBonuses: ["restaurant_assistant", "cafeteria_worker"],
      incomeMult: 1.25,
      costReduction: 0.15,
      talentNodes: [
        {
          id: "cook_knife",
          name: "刀工精进",
          desc: "烹饪XP获取+30%",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { cookingXpMult: 1.3 },
        },
        {
          id: "cook_supply",
          name: "食材渠道",
          desc: "食材/吃饭成本-15%",
          apCost: 25,
          cashCost: 600,
          prereq: "cook_knife",
          requireLevel: 25,
          effects: { foodCostReduction: 0.15 },
        },
        {
          id: "cook_management",
          name: "后厨管理",
          desc: "餐饮类工作收入+20%，解锁高级后厨管理",
          apCost: 30,
          cashCost: 1200,
          prereq: "cook_supply",
          requireLevel: 50,
          effects: { kitchenIncomeBonus: 0.2 },
        },
      ],
    },
    {
      id: "street_foodie",
      name: "街头美食家",
      icon: "🌮",
      desc: "专注街头美食，摆摊收入+30%，提升客流量",
      jobBonuses: ["street_vending_food", "food_stall"],
      incomeMult: 1.3,
      footfallBonus: 0.15,
      talentNodes: [
        {
          id: "street_flavor",
          name: "独家配方",
          desc: "摆摊小吃收入+15%",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { vendingFoodBonus: 0.15 },
        },
        {
          id: "street_marketing",
          name: "口碑营销",
          desc: "摆摊客流量+18%",
          apCost: 25,
          cashCost: 500,
          prereq: "street_flavor",
          requireLevel: 25,
          effects: { footfallBonus: 0.18 },
        },
        {
          id: "street_chain",
          name: "美食档口",
          desc: "解锁固定美食档口，每日被动收入+¥80",
          apCost: 35,
          cashCost: 1500,
          prereq: "street_marketing",
          requireLevel: 50,
          effects: { passiveIncome: 80 },
        },
      ],
    },
  ],

  repair: [
    {
      id: "precision_repair",
      name: "精密维修",
      icon: "🔬",
      desc: "专修精密仪器，维修收入+25%，解锁仪器仪表维修工作",
      jobBonuses: ["instrument_repair", "electronics_repair"],
      incomeMult: 1.25,
      talentNodes: [
        {
          id: "repair_tool",
          name: "工具升级",
          desc: "维修效果+15%，维修XP获取+20%",
          apCost: 20,
          cashCost: 400,
          prereq: null,
          requireLevel: 10,
          effects: { repairEffectBonus: 0.15, repairXpMult: 1.2 },
        },
        {
          id: "repair_precision",
          name: "精密操作",
          desc: "精密类工作收入+20%，解锁高级维修",
          apCost: 25,
          cashCost: 700,
          prereq: "repair_tool",
          requireLevel: 25,
          effects: { precisionIncomeBonus: 0.2 },
        },
        {
          id: "repair_master",
          name: "维修大师",
          desc: "所有维修工作收入+25%，装备维修损耗-30%",
          apCost: 30,
          cashCost: 1300,
          prereq: "repair_precision",
          requireLevel: 50,
          effects: { allRepairBonus: 0.25, repairWearReduction: 0.3 },
        },
      ],
    },
    {
      id: "modder",
      name: "改装达人",
      icon: "🛠️",
      desc: "擅长改装升级，解锁改装工作，装备效果+20%",
      jobBonuses: ["bike_customization", "phone_modding"],
      equipmentBonus: 0.2,
      talentNodes: [
        {
          id: "mod_basic",
          name: "基础改装",
          desc: "改装类工作解锁，收入+12%",
          apCost: 20,
          cashCost: 350,
          prereq: null,
          requireLevel: 10,
          effects: { modIncomeBonus: 0.12 },
        },
        {
          id: "mod_electronics",
          name: "电子改装",
          desc: "数码产品改装收入+20%，装备效果+10%",
          apCost: 25,
          cashCost: 650,
          prereq: "mod_basic",
          requireLevel: 25,
          effects: { electronicsModBonus: 0.2, equipmentBonusAdd: 0.1 },
        },
        {
          id: "mod_custom",
          name: "私人定制",
          desc: "定制改装收入+30%，可制作特殊道具",
          apCost: 35,
          cashCost: 1400,
          prereq: "mod_electronics",
          requireLevel: 50,
          effects: { customModBonus: 0.3 },
        },
      ],
    },
  ],

  coding: [
    {
      id: "frontend_dev",
      name: "前端开发",
      icon: "🎨",
      desc: "专注用户界面开发，职场能力加成+30%，解锁前端岗位",
      jobBonuses: ["web_designer", "ui_assistant"],
      corpAbilityMult: 1.3,
      talentNodes: [
        {
          id: "frontend_html",
          name: "页面基础",
          desc: "编程XP获取+25%，解锁网页设计工作",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { codingXpMult: 1.25 },
        },
        {
          id: "frontend_framework",
          name: "框架精通",
          desc: "职场能力额外+10，前端开发收入+18%",
          apCost: 25,
          cashCost: 600,
          prereq: "frontend_html",
          requireLevel: 25,
          effects: { abilityFlatBonus: 10, frontendIncomeBonus: 0.18 },
        },
        {
          id: "frontend_arch",
          name: "前端架构",
          desc: "职场晋升能力要求-8，前端项目收入+25%",
          apCost: 35,
          cashCost: 1400,
          prereq: "frontend_framework",
          requireLevel: 50,
          effects: { promoAbilityReduction: 8, frontendSeniorBonus: 0.25 },
        },
      ],
    },
    {
      id: "backend_arch",
      name: "后端架构",
      icon: "⚙️",
      desc: "专注服务端与架构，职场能力加成+50%，解锁后端运维岗位",
      jobBonuses: ["server_ops", "database_clerk"],
      corpAbilityMult: 1.5,
      talentNodes: [
        {
          id: "backend_db",
          name: "数据库基础",
          desc: "编程XP获取+25%，解锁数据库相关工作",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { codingXpMult: 1.25 },
        },
        {
          id: "backend_api",
          name: "接口开发",
          desc: "职场能力额外+15，后端工作收入+20%",
          apCost: 25,
          cashCost: 650,
          prereq: "backend_db",
          requireLevel: 25,
          effects: { abilityFlatBonus: 15, backendIncomeBonus: 0.2 },
        },
        {
          id: "backend_system",
          name: "系统架构",
          desc: "职场晋升能力要求-10，解锁P7+快速通道",
          apCost: 35,
          cashCost: 1500,
          prereq: "backend_api",
          requireLevel: 50,
          effects: { promoAbilityReduction: 10, backendSeniorBonus: 0.3 },
        },
      ],
    },
    {
      id: "security",
      name: "安全攻防",
      icon: "🔒",
      desc: "专注网络安全，解锁安全审计岗位，降低职场风险",
      jobBonuses: ["network_monitor", "security_auditor"],
      riskReduction: 0.3,
      talentNodes: [
        {
          id: "sec_network",
          name: "网络基础",
          desc: "编程XP获取+25%，解锁网络安全相关工作",
          apCost: 20,
          cashCost: 350,
          prereq: null,
          requireLevel: 10,
          effects: { codingXpMult: 1.25 },
        },
        {
          id: "sec_audit",
          name: "安全审计",
          desc: "职场风险-20%，安全类工作收入+20%",
          apCost: 25,
          cashCost: 700,
          prereq: "sec_network",
          requireLevel: 25,
          effects: { riskReductionBonus: 0.2, secIncomeBonus: 0.2 },
        },
        {
          id: "sec_expert",
          name: "安全专家",
          desc: "职场风险-40%，解锁高级安全顾问岗位",
          apCost: 35,
          cashCost: 1600,
          prereq: "sec_audit",
          requireLevel: 50,
          effects: { riskReductionBonus: 0.4, secSeniorBonus: 0.25 },
        },
      ],
    },
    // === 全栈人生线 v1：新增 coding 技能分支 ===
    {
      id: "fullstack_dev",
      name: "全栈开发",
      icon: "🧩",
      desc: "前后端通吃，职场能力加成+40%，解锁全栈接单与全栈岗位",
      jobBonuses: ["fullstack_project", "open_source_bounty"],
      corpAbilityMult: 1.4,
      talentNodes: [
        {
          id: "fullstack_base",
          name: "全栈基础",
          desc: "编程XP获取+25%，解锁全栈项目工作",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { codingXpMult: 1.25 },
        },
        {
          id: "fullstack_integration",
          name: "前后端打通",
          desc: "职场能力额外+12，全栈工作收入+20%",
          apCost: 25,
          cashCost: 650,
          prereq: "fullstack_base",
          requireLevel: 25,
          effects: { abilityFlatBonus: 12, fullstackIncomeBonus: 0.2 },
        },
        {
          id: "fullstack_arch",
          name: "全栈架构",
          desc: "职场晋升能力要求-8，全栈项目收入+25%",
          apCost: 35,
          cashCost: 1500,
          prereq: "fullstack_integration",
          requireLevel: 50,
          effects: { promoAbilityReduction: 8, fullstackSeniorBonus: 0.25 },
        },
      ],
    },
    {
      id: "data_ai",
      name: "数据/AI",
      icon: "🤖",
      desc: "数据洞察与AI工程，解锁数据分析接单，降低职场风险",
      jobBonuses: ["data_analysis_gig"],
      riskReduction: 0.2,
      corpAbilityMult: 1.35,
      talentNodes: [
        {
          id: "data_base",
          name: "数据基础",
          desc: "编程XP获取+25%，解锁数据分析工作",
          apCost: 20,
          cashCost: 320,
          prereq: null,
          requireLevel: 10,
          effects: { codingXpMult: 1.25 },
        },
        {
          id: "data_ml",
          name: "机器学习",
          desc: "职场能力额外+14，数据工作收入+22%",
          apCost: 25,
          cashCost: 700,
          prereq: "data_base",
          requireLevel: 25,
          effects: { abilityFlatBonus: 14, dataAiIncomeBonus: 0.22 },
        },
        {
          id: "data_ai_arch",
          name: "AI 工程化",
          desc: "职场风险-25%，解锁高端AI岗位",
          apCost: 35,
          cashCost: 1500,
          prereq: "data_ml",
          requireLevel: 50,
          effects: { riskReductionBonus: 0.25, dataAiSeniorBonus: 0.25 },
        },
      ],
    },
    {
      id: "mobile_dev",
      name: "移动端开发",
      icon: "📱",
      desc: "iOS/Android 开发，解锁 App 接单，解锁移动岗位",
      jobBonuses: ["app_dev"],
      corpAbilityMult: 1.3,
      talentNodes: [
        {
          id: "mobile_base",
          name: "移动基础",
          desc: "编程XP获取+25%，解锁 App 开发工作",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { codingXpMult: 1.25 },
        },
        {
          id: "mobile_cross",
          name: "跨端开发",
          desc: "职场能力额外+10，App 工作收入+18%",
          apCost: 25,
          cashCost: 620,
          prereq: "mobile_base",
          requireLevel: 25,
          effects: { abilityFlatBonus: 10, mobileIncomeBonus: 0.18 },
        },
        {
          id: "mobile_perf",
          name: "性能优化",
          desc: "职场晋升能力要求-6，移动项目收入+22%",
          apCost: 35,
          cashCost: 1400,
          prereq: "mobile_cross",
          requireLevel: 50,
          effects: { promoAbilityReduction: 6, mobileSeniorBonus: 0.22 },
        },
      ],
    },
  ],

  english: [
    {
      id: "business_english",
      name: "商务英语",
      icon: "💼",
      desc: "专注商务场景，家教/外贸收入+30%，解锁商务翻译工作",
      jobBonuses: ["foreign_trade_assistant", "biz_translator"],
      incomeMult: 1.3,
      talentNodes: [
        {
          id: "eng_biz_writing",
          name: "商务写作",
          desc: "英语XP获取+25%，商务英语收入+15%",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { englishXpMult: 1.25, bizWritingBonus: 0.15 },
        },
        {
          id: "eng_negotiation",
          name: "商务谈判",
          desc: "外贸工作收入+20%，解锁外企相关机会",
          apCost: 25,
          cashCost: 600,
          prereq: "eng_biz_writing",
          requireLevel: 25,
          effects: { tradeIncomeBonus: 0.2 },
        },
        {
          id: "eng_global",
          name: "全球化视野",
          desc: "所有教育/外语类收入+25%，外企职场亲和度+20",
          apCost: 30,
          cashCost: 1200,
          prereq: "eng_negotiation",
          requireLevel: 50,
          effects: { globalIncomeBonus: 0.25, foreignAffinity: 20 },
        },
      ],
    },
    {
      id: "translation",
      name: "翻译达人",
      icon: "📝",
      desc: "专注文本翻译，解锁翻译类工作，内容创作收入+25%",
      jobBonuses: ["document_translator", "subtitle_worker"],
      incomeMult: 1.25,
      talentNodes: [
        {
          id: "trans_doc",
          name: "文档翻译",
          desc: "英语XP获取+25%，翻译工作收入+15%",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { englishXpMult: 1.25, transDocBonus: 0.15 },
        },
        {
          id: "trans_consecutive",
          name: "交替传译",
          desc: "口译工作收入+25%，解锁内容创作加成",
          apCost: 25,
          cashCost: 600,
          prereq: "trans_doc",
          requireLevel: 25,
          effects: { interpretBonus: 0.25 },
        },
        {
          id: "trans_master",
          name: "翻译大师",
          desc: "所有翻译/内容类收入+30%，可接高级翻译订单",
          apCost: 30,
          cashCost: 1300,
          prereq: "trans_consecutive",
          requireLevel: 50,
          effects: { transMasterBonus: 0.3 },
        },
      ],
    },
  ],

  driving: [
    {
      id: "passenger_transport",
      name: "客运驾驶",
      icon: "🚕",
      desc: "专注载客运输，驾驶行动力减免翻倍，解锁出租车工作",
      jobBonuses: ["taxi_driver", "chauffeur"],
      apReductionMult: 2.0,
      talentNodes: [
        {
          id: "drive_passenger",
          name: "载客服务",
          desc: "驾驶XP获取+25%，客运收入+15%",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { drivingXpMult: 1.25, passengerBonus: 0.15 },
        },
        {
          id: "drive_navigation",
          name: "路线精通",
          desc: "旅行行动力额外-2，客运收入+20%",
          apCost: 25,
          cashCost: 500,
          prereq: "drive_passenger",
          requireLevel: 25,
          effects: { extraApReduction: 2, navBonus: 0.2 },
        },
        {
          id: "drive_fleet",
          name: "车队管理",
          desc: "解锁车队调度，每日被动收入+¥60",
          apCost: 30,
          cashCost: 1200,
          prereq: "drive_navigation",
          requireLevel: 50,
          effects: { fleetPassiveIncome: 60 },
        },
      ],
    },
    {
      id: "freight",
      name: "货运驾驶",
      icon: "🚚",
      desc: "专注货物运输，货运/配送收入+30%，解锁物流工作",
      jobBonuses: ["truck_assistant", "warehouse_logistics"],
      incomeMult: 1.3,
      talentNodes: [
        {
          id: "freight_basic",
          name: "货物装卸",
          desc: "驾驶XP获取+25%，货运收入+15%",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { drivingXpMult: 1.25, freightBonus: 0.15 },
        },
        {
          id: "freight_route",
          name: "路线优化",
          desc: "货运效率+20%，解锁长途运输工作",
          apCost: 25,
          cashCost: 550,
          prereq: "freight_basic",
          requireLevel: 25,
          effects: { routeBonus: 0.2 },
        },
        {
          id: "freight_logistics",
          name: "物流管理",
          desc: "所有配送/物流收入+25%，解锁物流调度岗位",
          apCost: 30,
          cashCost: 1300,
          prereq: "freight_route",
          requireLevel: 50,
          effects: { logisticsBonus: 0.25 },
        },
      ],
    },
  ],

  sales: [
    {
      id: "store_sales",
      name: "门店销售",
      icon: "🏪",
      desc: "专注门店零售，买入折扣上限提升至25%，解锁导购工作",
      jobBonuses: ["shop_assistant", "promoter"],
      discountCap: 0.25,
      talentNodes: [
        {
          id: "sales_service",
          name: "客户服务",
          desc: "销售XP获取+25%，门店收入+15%",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { salesXpMult: 1.25, storeBonus: 0.15 },
        },
        {
          id: "sales_stock",
          name: "库存管理",
          desc: "买入折扣额外+5%，解锁批发渠道",
          apCost: 25,
          cashCost: 500,
          prereq: "sales_service",
          requireLevel: 25,
          effects: { extraDiscount: 0.05 },
        },
        {
          id: "sales_management",
          name: "店长经验",
          desc: "所有销售类收入+20%，可管理门店运营",
          apCost: 30,
          cashCost: 1100,
          prereq: "sales_stock",
          requireLevel: 50,
          effects: { salesMgmtBonus: 0.2 },
        },
      ],
    },
    {
      id: "biz_negotiation",
      name: "商务谈判",
      icon: "🤝",
      desc: "擅长商务谈判，卖出溢价上限提升至25%，解锁采购工作",
      jobBonuses: ["procurement_clerk", "biz_negotiator"],
      premiumCap: 0.25,
      talentNodes: [
        {
          id: "nego_basic",
          name: "谈判基础",
          desc: "销售XP获取+25%，谈判收入+15%",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { salesXpMult: 1.25, negoBonus: 0.15 },
        },
        {
          id: "nego_contract",
          name: "合同管理",
          desc: "卖出溢价额外+5%，解锁商务合同工作",
          apCost: 25,
          cashCost: 600,
          prereq: "nego_basic",
          requireLevel: 25,
          effects: { extraPremium: 0.05 },
        },
        {
          id: "nego_master",
          name: "谈判大师",
          desc: "所有商务类收入+25%，可参与重大谈判",
          apCost: 30,
          cashCost: 1300,
          prereq: "nego_contract",
          requireLevel: 50,
          effects: { negoMasterBonus: 0.25 },
        },
      ],
    },
  ],

  management: [
    {
      id: "team_mgmt",
      name: "团队管理",
      icon: "👥",
      desc: "专注团队建设，向上管理加成+50%，团队规模+2",
      jobBonuses: ["team_lead", "project_coordinator"],
      upwardMgmtMult: 1.5,
      teamSizeBonus: 2,
      talentNodes: [
        {
          id: "mgmt_communication",
          name: "沟通技巧",
          desc: "管理XP获取+25%，人缘成长+10%",
          apCost: 20,
          cashCost: 350,
          prereq: null,
          requireLevel: 10,
          effects: { mgmtXpMult: 1.25, popularityBonus: 10 },
        },
        {
          id: "mgmt_delegation",
          name: "授权管理",
          desc: "团队效率+15%，解锁项目管理",
          apCost: 25,
          cashCost: 650,
          prereq: "mgmt_communication",
          requireLevel: 25,
          effects: { delegationBonus: 0.15 },
        },
        {
          id: "mgmt_leadership",
          name: "领导力",
          desc: "晋升人缘要求-10，团队规模+3",
          apCost: 35,
          cashCost: 1400,
          prereq: "mgmt_delegation",
          requireLevel: 50,
          effects: { promoPopularityReduction: 10, teamSizeExtra: 3 },
        },
      ],
    },
    {
      id: "strategy_planning",
      name: "战略规划",
      icon: "📊",
      desc: "专注战略规划，向上管理加成+50%，解锁分析师岗位",
      jobBonuses: ["analyst", "planning_assistant"],
      upwardMgmtMult: 1.5,
      talentNodes: [
        {
          id: "strategy_analysis",
          name: "数据分析",
          desc: "管理XP获取+25%，分析工作收入+15%",
          apCost: 20,
          cashCost: 350,
          prereq: null,
          requireLevel: 10,
          effects: { mgmtXpMult: 1.25, analysisBonus: 0.15 },
        },
        {
          id: "strategy_decision",
          name: "决策支持",
          desc: "向上管理额外+10，解锁战略决策参与",
          apCost: 25,
          cashCost: 700,
          prereq: "strategy_analysis",
          requireLevel: 25,
          effects: { upwardFlatBonus: 10 },
        },
        {
          id: "strategy_vision",
          name: "战略视野",
          desc: "晋升向上管理要求-10，解锁P8+快速通道",
          apCost: 35,
          cashCost: 1500,
          prereq: "strategy_decision",
          requireLevel: 50,
          effects: { promoUpwardReduction: 10, strategySeniorBonus: 0.2 },
        },
      ],
    },
  ],

  accounting: [
    {
      id: "tax_accounting",
      name: "税务会计",
      icon: "🧾",
      desc: "专注税务处理，银行利率加成翻倍，解锁税务工作",
      jobBonuses: ["tax_assistant", "bookkeeper"],
      bankRateMult: 2.0,
      talentNodes: [
        {
          id: "acct_tax_basic",
          name: "税务基础",
          desc: "会计XP获取+25%，税务工作收入+15%",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { acctXpMult: 1.25, taxBonus: 0.15 },
        },
        {
          id: "acct_tax_planning",
          name: "税务筹划",
          desc: "银行利率额外+2%/年，解锁税务筹划",
          apCost: 25,
          cashCost: 600,
          prereq: "acct_tax_basic",
          requireLevel: 25,
          effects: { extraBankRate: 0.02 },
        },
        {
          id: "acct_tax_expert",
          name: "税务专家",
          desc: "财务类收入+25%，可处理复杂税务案件",
          apCost: 30,
          cashCost: 1200,
          prereq: "acct_tax_planning",
          requireLevel: 50,
          effects: { financeBonus: 0.25 },
        },
      ],
    },
    {
      id: "audit_risk",
      name: "审计风控",
      icon: "🔍",
      desc: "专注审计风控，职场风险-30%，解锁审计工作",
      jobBonuses: ["audit_assistant", "risk_controller"],
      riskReduction: 0.3,
      talentNodes: [
        {
          id: "audit_basic",
          name: "审计基础",
          desc: "会计XP获取+25%，审计工作收入+15%",
          apCost: 20,
          cashCost: 350,
          prereq: null,
          requireLevel: 10,
          effects: { acctXpMult: 1.25, auditBonus: 0.15 },
        },
        {
          id: "audit_compliance",
          name: "合规审查",
          desc: "职场风险额外-20%，解锁合规审查工作",
          apCost: 25,
          cashCost: 650,
          prereq: "audit_basic",
          requireLevel: 25,
          effects: { extraRiskReduction: 0.2 },
        },
        {
          id: "audit_forensic",
          name: "法务会计",
          desc: "财务类收入+25%，职场风险-50%",
          apCost: 30,
          cashCost: 1300,
          prereq: "audit_compliance",
          requireLevel: 50,
          effects: { forensicBonus: 0.25, forensicRiskReduction: 0.5 },
        },
      ],
    },
  ],

  electrician: [
    {
      id: "industrial_electric",
      name: "强电工程",
      icon: "⚡",
      desc: "专注工业强电，工厂收入加成翻倍，解锁电力维护工作",
      jobBonuses: ["factory_electrician", "power_line_assistant"],
      factoryBonusMult: 2.0,
      talentNodes: [
        {
          id: "elec_industrial",
          name: "工业配电",
          desc: "电工XP获取+25%，工业电力工作收入+15%",
          apCost: 20,
          cashCost: 350,
          prereq: null,
          requireLevel: 10,
          effects: { elecXpMult: 1.25, industrialBonus: 0.15 },
        },
        {
          id: "elec_high_voltage",
          name: "高压作业",
          desc: "电力维护收入+25%，解锁高压作业资质",
          apCost: 25,
          cashCost: 650,
          prereq: "elec_industrial",
          requireLevel: 25,
          effects: { highVoltageBonus: 0.25 },
        },
        {
          id: "elec_power_master",
          name: "电力专家",
          desc: "所有电工类收入+30%，可管理电力工程项目",
          apCost: 35,
          cashCost: 1400,
          prereq: "elec_high_voltage",
          requireLevel: 50,
          effects: { powerMasterBonus: 0.3 },
        },
      ],
    },
    {
      id: "smart_electric",
      name: "弱电智能",
      icon: "💡",
      desc: "专注弱电智能化，解锁智能家居/网络布线工作",
      jobBonuses: ["smart_home_tech", "network_cabling"],
      incomeMult: 1.25,
      talentNodes: [
        {
          id: "smart_network",
          name: "网络布线",
          desc: "电工XP获取+25%，弱电工作收入+15%",
          apCost: 20,
          cashCost: 300,
          prereq: null,
          requireLevel: 10,
          effects: { elecXpMult: 1.25, smartBonus: 0.15 },
        },
        {
          id: "smart_home",
          name: "智能家居",
          desc: "智能家居工作收入+25%，解锁智能设备安装",
          apCost: 25,
          cashCost: 600,
          prereq: "smart_network",
          requireLevel: 25,
          effects: { homeBonus: 0.25 },
        },
        {
          id: "smart_integration",
          name: "系统集成",
          desc: "所有弱电类收入+30%，可承接智能化项目",
          apCost: 30,
          cashCost: 1300,
          prereq: "smart_home",
          requireLevel: 50,
          effects: { integrationBonus: 0.3 },
        },
      ],
    },
  ],

  welding: [
    {
      id: "structural_welding",
      name: "结构焊接",
      icon: "🏗️",
      desc: "专注建筑结构焊接，建筑收入加成+50%，解锁钢结构工作",
      jobBonuses: ["steel_worker", "bridge_welder"],
      constructionBonusMult: 1.5,
      talentNodes: [
        {
          id: "weld_structural",
          name: "结构基础",
          desc: "焊接XP获取+25%，结构焊接收入+15%",
          apCost: 20,
          cashCost: 350,
          prereq: null,
          requireLevel: 10,
          effects: { weldXpMult: 1.25, structureBonus: 0.15 },
        },
        {
          id: "weld_heavy",
          name: "重型焊接",
          desc: "建筑类收入+20%，解锁重型钢结构工作",
          apCost: 25,
          cashCost: 650,
          prereq: "weld_structural",
          requireLevel: 25,
          effects: { heavyWeldBonus: 0.2 },
        },
        {
          id: "weld_master",
          name: "焊接大师",
          desc: "所有焊接类收入+30%，可担任焊接工程主管",
          apCost: 35,
          cashCost: 1400,
          prereq: "weld_heavy",
          requireLevel: 50,
          effects: { weldMasterBonus: 0.3 },
        },
      ],
    },
    {
      id: "precision_welding",
      name: "精密焊接",
      icon: "🔬",
      desc: "专注精密器件焊接，解锁珠宝/电子焊接工作",
      jobBonuses: ["jewelry_welder", "electronics_welder"],
      incomeMult: 1.3,
      talentNodes: [
        {
          id: "weld_precision",
          name: "精密操作",
          desc: "焊接XP获取+25%，精密焊接收入+18%",
          apCost: 20,
          cashCost: 400,
          prereq: null,
          requireLevel: 10,
          effects: { weldXpMult: 1.25, precisionWeldBonus: 0.18 },
        },
        {
          id: "weld_micro",
          name: "微型焊接",
          desc: "电子焊接收入+25%，解锁微型器件焊接",
          apCost: 25,
          cashCost: 700,
          prereq: "weld_precision",
          requireLevel: 25,
          effects: { microWeldBonus: 0.25 },
        },
        {
          id: "weld_artisan",
          name: "工艺大师",
          desc: "所有精细焊接收入+30%，可制作高端工艺品",
          apCost: 30,
          cashCost: 1500,
          prereq: "weld_micro",
          requireLevel: 50,
          effects: { artisanBonus: 0.3 },
        },
      ],
    },
  ],
};

/**
 * 获取某个技能的分支定义数组
 */
function getSkillBranchDef(skillKey) {
  return SKILL_BRANCHES[skillKey] || [];
}

/**
 * 获取某个技能的特定分支
 */
function getBranchById(skillKey, branchId) {
  var branches = SKILL_BRANCHES[skillKey];
  if (!branches) return null;
  for (var i = 0; i < branches.length; i++) {
    if (branches[i].id === branchId) return branches[i];
  }
  return null;
}

/**
 * 获取技能可用的分支（已达Lv.30的）
 */
function getAvailableBranches(skillKey, state) {
  var branches = SKILL_BRANCHES[skillKey];
  if (!branches) return [];
  var skill = state.skills[skillKey];
  if (!skill) return [];
  var available = [];
  for (var i = 0; i < branches.length; i++) {
    if (skill.level >= 30) {
      available.push(branches[i]);
    }
  }
  return available;
}

/**
 * 获取天赋节点定义
 */
function getTalentNodeDef(skillKey, branchId, nodeId) {
  var branch = getBranchById(skillKey, branchId);
  if (!branch || !branch.talentNodes) return null;
  for (var i = 0; i < branch.talentNodes.length; i++) {
    if (branch.talentNodes[i].id === nodeId) return branch.talentNodes[i];
  }
  return null;
}

/**
 * 获取该技能已选的分支（如未选返回null）
 */
function getChosenBranch(skillKey, state) {
  var branchId = state.skillBranches && state.skillBranches[skillKey];
  if (!branchId) return null;
  return getBranchById(skillKey, branchId);
}

/**
 * 检查是否能选择分支
 */
function canChooseBranch(skillKey, state) {
  var skill = state.skills[skillKey];
  if (!skill) return { allowed: false, reason: "技能不存在" };
  if (state.skillBranches && state.skillBranches[skillKey]) {
    return { allowed: false, reason: "该技能已选择发展方向" };
  }
  if (skill.level < 30) {
    return {
      allowed: false,
      reason: "需技能等级≥Lv.30（当前Lv." + skill.level + "）",
    };
  }
  var branches = SKILL_BRANCHES[skillKey];
  if (!branches || branches.length === 0) {
    return { allowed: false, reason: "该技能暂无分支方向" };
  }
  return { allowed: true, reason: "" };
}

/**
 * 选择技能分支（消耗 15AP + ¥200）
 */
function chooseSkillBranch(skillKey, branchId, state) {
  var check = canChooseBranch(skillKey, state);
  if (!check.allowed) {
    StateManager.addMessage("⚠️ " + check.reason, "warning");
    return false;
  }
  var branch = getBranchById(skillKey, branchId);
  if (!branch) {
    StateManager.addMessage("⚠️ 分支不存在", "warning");
    return false;
  }
  if (state.player.actionPoints < 15) {
    StateManager.addMessage(
      "⚠️ 行动力不足，需要15点行动力选择发展方向",
      "warning",
    );
    return false;
  }
  if (state.resources.cash < 200) {
    StateManager.addMessage("⚠️ 现金不足，选择发展方向需要¥200", "warning");
    return false;
  }

  state.player.actionPoints -= 15;
  state.resources.cash -= 200;
  state.skillBranches[skillKey] = branchId;

  StateManager.addMessage(
    "🎯 确定了" +
      getSkillChineseName(skillKey) +
      "的发展方向：" +
      branch.icon +
      " " +
      branch.name +
      "！",
    "success",
  );
  return true;
}

/**
 * 切换技能分支（消耗 30AP + ¥500，保留天赋节点状态但清除旧分支节点）
 */
function switchSkillBranch(skillKey, newBranchId, state) {
  if (!state.skillBranches || !state.skillBranches[skillKey]) {
    return chooseSkillBranch(skillKey, newBranchId, state);
  }
  if (state.player.actionPoints < 30) {
    StateManager.addMessage("⚠️ 切换发展方向需要30行动力", "warning");
    return false;
  }
  if (state.resources.cash < 500) {
    StateManager.addMessage("⚠️ 切换发展方向需要¥500", "warning");
    return false;
  }

  // 清除旧分支的节点激活记录
  var oldBranchId = state.skillBranches[skillKey];
  for (var nodeKey in state.talentNodes) {
    if (nodeKey.indexOf(skillKey + "_" + oldBranchId) === 0) {
      delete state.talentNodes[nodeKey];
    }
  }

  state.player.actionPoints -= 30;
  state.resources.cash -= 500;
  state.skillBranches[skillKey] = newBranchId;

  StateManager.addMessage(
    "🔄 重新选择了" +
      getSkillChineseName(skillKey) +
      "的方向，旧天赋节点已重置",
    "success",
  );
  return true;
}

/**
 * 检查是否能激活天赋节点
 */
function canActivateTalentNode(skillKey, nodeId, state) {
  var branchId = state.skillBranches && state.skillBranches[skillKey];
  if (!branchId) {
    return { allowed: false, reason: "请先选择发展方向" };
  }
  var node = getTalentNodeDef(skillKey, branchId, nodeId);
  if (!node) {
    return { allowed: false, reason: "天赋节点不存在" };
  }

  // 生成全局唯一key（一致性）
  var nodeKey = skillKey + "_" + branchId + "_" + nodeId;
  if (state.talentNodes && state.talentNodes[nodeKey]) {
    return { allowed: false, reason: "该天赋节点已激活" };
  }

  var skill = state.skills[skillKey];
  if (!skill || skill.level < node.requireLevel) {
    return {
      allowed: false,
      reason:
        "需技能等级≥Lv." +
        node.requireLevel +
        "（当前Lv." +
        (skill ? skill.level : 0) +
        "）",
    };
  }

  // 检查前置节点
  if (node.prereq) {
    var prereqKey = skillKey + "_" + branchId + "_" + node.prereq;
    if (!state.talentNodes || !state.talentNodes[prereqKey]) {
      var prereqNode = getTalentNodeDef(skillKey, branchId, node.prereq);
      return {
        allowed: false,
        reason:
          "需要先激活前置节点「" +
          (prereqNode ? prereqNode.name : node.prereq) +
          "」",
      };
    }
  }

  if (state.player.actionPoints < (node.apCost || 0)) {
    return {
      allowed: false,
      reason: "行动力不足，需要" + node.apCost + "点行动力",
    };
  }
  if (state.resources.cash < (node.cashCost || 0)) {
    return {
      allowed: false,
      reason: "现金不足，需要¥" + node.cashCost,
    };
  }

  return { allowed: true, reason: "" };
}

/**
 * 激活天赋节点
 */
function activateTalentNode(skillKey, nodeId, state) {
  var check = canActivateTalentNode(skillKey, nodeId, state);
  if (!check.allowed) {
    StateManager.addMessage("⚠️ " + check.reason, "warning");
    return false;
  }

  var branchId = state.skillBranches[skillKey];
  var node = getTalentNodeDef(skillKey, branchId, nodeId);
  var nodeKey = skillKey + "_" + branchId + "_" + nodeId;

  state.player.actionPoints -= node.apCost;
  state.resources.cash -= node.cashCost;
  state.talentNodes[nodeKey] = true;

  StateManager.addMessage(
    "⭐ 激活了天赋节点：「" + node.name + "」— " + node.desc,
    "success",
  );

  // 被动收入立即生效
  if (node.effects && node.effects.passiveIncome) {
    state.resources.cash += node.effects.passiveIncome;
    StateManager.addMessage(
      "💰 天赋效果：获得 ¥" + node.effects.passiveIncome + " 被动收入",
      "info",
    );
  }

  return true;
}

/**
 * 获取所有已激活天赋节点的累积效果
 */
function getTalentNodeEffects(state) {
  var merged = {};
  if (!state.talentNodes) return merged;

  for (var nodeKey in state.talentNodes) {
    if (!state.talentNodes[nodeKey]) continue;
    // nodeKey format: "skillKey_branchId_nodeId"
    var parts = nodeKey.split("_");
    // 至少3部分：skill + branch + node
    if (parts.length < 3) continue;
    var skillKey = parts[0];
    // branchId可能包含下划线，所以重组
    // 简单方法：遍历所有可能分支来匹配
    var branches = SKILL_BRANCHES[skillKey];
    if (!branches) continue;
    for (var bi = 0; bi < branches.length; bi++) {
      var branch = branches[bi];
      if (nodeKey.indexOf(skillKey + "_" + branch.id + "_") !== 0) continue;
      var nodeId = nodeKey.substring((skillKey + "_" + branch.id + "_").length);
      var node = getTalentNodeDef(skillKey, branch.id, nodeId);
      if (node && node.effects) {
        for (var eff in node.effects) {
          merged[eff] = (merged[eff] || 0) + node.effects[eff];
        }
      }
    }
  }

  return merged;
}

/**
 * 获取分支工作的收入加成倍数
 */
function getBranchJobBonus(jobId, skillKey, state) {
  if (!state.skillBranches) return 1.0;
  var branchId = state.skillBranches[skillKey];
  if (!branchId) return 1.0;
  var branch = getBranchById(skillKey, branchId);
  if (!branch) return 1.0;

  // 检查该工作是否在分支加成范围内
  if (branch.jobBonuses && branch.jobBonuses.indexOf(jobId) >= 0) {
    var mult = 1.0;
    if (branch.incomeMult) mult = branch.incomeMult;
    // 叠加天赋节点效果
    var nodeEff = getTalentNodeEffects(state);
    // 收集所有收入类加成
    var totalBonus = 0;
    for (var key in nodeEff) {
      if (key.indexOf("Bonus") > 0 || key.indexOf("Income") > 0) {
        totalBonus += nodeEff[key];
      }
    }
    return mult + totalBonus;
  }

  return 1.0;
}

/**
 * 获取分支对职场晋升的修正（返回 { abilityReduction, upwardReduction, popularityReduction }）
 */
function getBranchCorpPromotionModifier(state) {
  var mod = { abilityReduction: 0, upwardReduction: 0, popularityReduction: 0 };

  // coding → backend/frontend：能力要求降低
  var codingBranch = state.skillBranches && state.skillBranches.coding;
  if (codingBranch === "backend_arch" || codingBranch === "frontend_dev") {
    var nodeEff = getTalentNodeEffects(state);
    mod.abilityReduction += nodeEff.promoAbilityReduction || 0;
    // 基础分支加成（Lv.30选择即有）
    mod.abilityReduction += 5;
  }

  // management → strategy：向上管理要求降低
  var mgmtBranch = state.skillBranches && state.skillBranches.management;
  if (mgmtBranch === "strategy_planning") {
    var nodeEff2 = getTalentNodeEffects(state);
    mod.upwardReduction += nodeEff2.promoUpwardReduction || 0;
    mod.upwardReduction += 5;
  }

  // management → team：人缘要求降低
  if (mgmtBranch === "team_mgmt") {
    var nodeEff3 = getTalentNodeEffects(state);
    mod.popularityReduction += nodeEff3.promoPopularityReduction || 0;
    mod.popularityReduction += 5;
  }

  return mod;
}

/**
 * 获取某一技能的分支名称（用于UI展示）
 */
function getSkillBranchLabel(skillKey, state) {
  var branchId = state.skillBranches && state.skillBranches[skillKey];
  if (!branchId) return null;
  var branch = getBranchById(skillKey, branchId);
  return branch ? branch.icon + " " + branch.name : null;
}

/**
 * 检查技能是否刚达到天赋节点解锁等级，返回可解锁的节点
 */
function getUnlockedTalentNodes(skillKey, state) {
  var branchId = state.skillBranches && state.skillBranches[skillKey];
  if (!branchId) return [];
  var branch = getBranchById(skillKey, branchId);
  if (!branch || !branch.talentNodes) return [];

  var skill = state.skills[skillKey];
  if (!skill) return [];

  var unlocked = [];
  for (var i = 0; i < branch.talentNodes.length; i++) {
    var node = branch.talentNodes[i];
    var nodeKey = skillKey + "_" + branchId + "_" + node.id;
    if (state.talentNodes && state.talentNodes[nodeKey]) continue;
    if (skill.level >= node.requireLevel) {
      // 检查前置
      if (node.prereq) {
        var prereqKey = skillKey + "_" + branchId + "_" + node.prereq;
        if (!state.talentNodes || !state.talentNodes[prereqKey]) continue;
      }
      unlocked.push(node);
    }
  }
  return unlocked;
}

/**
 * 获取技能中文名（本地引用，避免循环依赖）
 */
function getSkillChineseName(skillKey) {
  var names = {
    cooking: "烹饪",
    repair: "维修",
    coding: "编程",
    english: "英语",
    driving: "驾驶",
    sales: "销售",
    management: "管理",
    accounting: "会计",
    electrician: "电工",
    welding: "焊接",
  };
  return names[skillKey] || skillKey;
}
