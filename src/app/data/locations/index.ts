export type LocationCategory =
  "work" | "life" | "gov" | "entertainment" | "service";

export interface LocationAction {
  id: string;
  name: string;
  apCost: number;
  minDay?: number;
}

export interface Location {
  id: string;
  name: string;
  icon: string;
  category: LocationCategory;
  description: string;
  requires?: string[];
  availableActions: LocationAction[];
  services?: string[];
  npcs?: string[];
}

export const LOCATIONS: Location[] = [
  {
    id: "slum",
    name: "城中村",
    icon: "🏚️",
    category: "life",
    description: "低成本居住区，废品、便宜饭、邻里矛盾和生存机会都在这里。",
    availableActions: [
      { id: "waste_recycling", name: "废品回收", apCost: 10 },
      { id: "street_vending_food", name: "小吃摆摊", apCost: 12, minDay: 3 },
    ],
    npcs: ["old_zhou"],
  },
  {
    id: "wholesaleMarket",
    name: "批发市场",
    icon: "📦",
    category: "work",
    description: "商品套利、食材采购和摊贩情报的核心地点。",
    availableActions: [
      { id: "wholesale_delivery", name: "批发配送", apCost: 12 },
      { id: "wholesale_sorting", name: "货物分拣", apCost: 10 },
    ],
    npcs: ["aunt_lin"],
  },
  {
    id: "construction",
    name: "建筑工地",
    icon: "🏗️",
    category: "work",
    description: "高风险高体力消耗的日结工作区。",
    availableActions: [
      { id: "manual_labor_construction", name: "工地苦力", apCost: 14 },
      { id: "premium_engineering", name: "正规工程队", apCost: 12, minDay: 20 },
    ],
    npcs: ["boss_li"],
  },
  {
    id: "factoryZone",
    name: "工业区",
    icon: "🏭",
    category: "work",
    description: "流水线、加班、维修和工友关系交织的地方。",
    availableActions: [
      { id: "factory_work_assembly", name: "工厂流水线", apCost: 12 },
      { id: "factory_overtime", name: "工厂加班", apCost: 16, minDay: 8 },
    ],
    npcs: ["master_zhao"],
  },
  {
    id: "school",
    name: "大学城",
    icon: "🎓",
    category: "life",
    description: "学生、家教、图书馆和低价小吃聚集地。",
    availableActions: [
      { id: "tutoring", name: "家教辅导", apCost: 12 },
      { id: "library_study", name: "图书馆学习", apCost: 8 },
    ],
    npcs: ["xiao_mei"],
  },
  {
    id: "commercialDist",
    name: "商业区",
    icon: "🏙️",
    category: "entertainment",
    description: "客流最大、消费最高、机会和风险都最密集的城区。",
    availableActions: [
      { id: "street_vending_food", name: "摆摊卖小吃", apCost: 12 },
      { id: "delivery_rider", name: "外卖骑手", apCost: 10 },
      { id: "webapp_city_services", name: "城市服务中心", apCost: 0 },
    ],
    services: ["weekend_micro_trip"],
    npcs: ["sister_zhang"],
  },
  {
    id: "techPark",
    name: "科技园",
    icon: "💻",
    category: "work",
    description: "内容创作、数据分析和公司线入口。",
    availableActions: [
      { id: "content_writing", name: "内容创作", apCost: 10 },
      { id: "junior_analyst", name: "数据分析助理", apCost: 12, minDay: 30 },
    ],
    npcs: ["xiao_li"],
  },
  {
    id: "hospital",
    name: "医院",
    icon: "🏥",
    category: "service",
    description: "治疗、医保、陪诊和健康预防的核心服务地点。",
    availableActions: [
      { id: "hospital_companion", name: "陪诊服务", apCost: 10 },
      { id: "webapp_city_services", name: "城市服务中心", apCost: 0 },
    ],
    services: ["insurance_bill_review", "community_health_check"],
    npcs: ["doctor_wang"],
  },
  {
    id: "bank",
    name: "银行",
    icon: "🏦",
    category: "service",
    description: "存款、贷款、信用报告和稳定岗位入口。",
    availableActions: [
      { id: "bank_security", name: "银行保安", apCost: 10 },
      { id: "webapp_city_services", name: "城市服务中心", apCost: 0 },
    ],
    services: ["credit_report_query"],
  },
  {
    id: "park",
    name: "公园",
    icon: "🌳",
    category: "entertainment",
    description: "低成本恢复心情和体力，也能接触社区活动。",
    availableActions: [
      { id: "busking", name: "街头表演", apCost: 8 },
      { id: "webapp_city_services", name: "城市服务中心", apCost: 0 },
    ],
    services: ["weekend_micro_trip", "community_health_check"],
  },
  {
    id: "trainingCenter",
    name: "培训中心",
    icon: "📚",
    category: "service",
    description: "证书、技能和转行准备的长期投入地点。",
    availableActions: [
      { id: "training_assistant", name: "培训助理", apCost: 10 },
      { id: "skill_course", name: "参加技能课", apCost: 12 },
    ],
  },
  {
    id: "gov_office",
    name: "政府办事大厅",
    icon: "🏛️",
    category: "gov",
    description: "劳动争议、社保、公积金、社区服务等制度入口。",
    availableActions: [
      { id: "webapp_city_services", name: "城市服务中心", apCost: 0 },
      { id: "community_clerk", name: "社区协理员", apCost: 10, minDay: 60 },
    ],
    services: [
      "labor_dispute_precheck",
      "social_security_query",
      "housing_fund_query",
    ],
  },
  {
    id: "oldCommunity",
    name: "老旧小区",
    icon: "🏘️",
    category: "life",
    description: "物业问题、邻里关系和低成本生活服务集中出现。",
    requires: ["player.day >= 20"],
    availableActions: [
      { id: "neighbor_repair", name: "邻里维修", apCost: 8 },
      { id: "community_visit", name: "社区走访", apCost: 8 },
    ],
    npcs: ["aunt_lin", "doctor_wang"],
  },
  {
    id: "library",
    name: "城市图书馆",
    icon: "📖",
    category: "service",
    description: "低成本提升智力、写作和职业转型准备。",
    requires: ["player.day >= 15"],
    availableActions: [
      { id: "library_study", name: "自习充电", apCost: 8 },
      { id: "resume_update", name: "整理简历", apCost: 6 },
    ],
  },
];

export const LOCATION_CATALOG_STATUS = {
  migrated: LOCATIONS.length,
  legacySource: "src/js/data/locations.js",
  nextStep:
    "新增地点继续保持 services/jobs/npcs 三类关联，bridge 只追加入口不重排脚本。",
} as const;
