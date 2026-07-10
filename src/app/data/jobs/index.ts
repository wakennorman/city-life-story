export type JobCategory = "street" | "corporate" | "freelance" | "public";

export interface JobRequirement {
  field: string;
  min?: number;
}

export interface Job {
  id: string;
  name: string;
  icon: string;
  category: JobCategory;
  requirements: JobRequirement[];
  baseSalary: number;
  salaryGrowth: number;
  maxLevel: number;
  skills: string[];
  stressPerDay: number;
  description: string;
  unlockDescription: string;
  events?: string[];
}

export const JOBS: Job[] = [
  {
    id: "waste_recycling",
    name: "废品回收",
    icon: "♻️",
    category: "street",
    requirements: [{ field: "player.age", min: 16 }],
    baseSalary: 35,
    salaryGrowth: 0.04,
    maxLevel: 5,
    skills: ["sales", "physique"],
    stressPerDay: 18,
    description: "走街串巷收废纸板、废金属和塑料，是最早期的现金入口。",
    unlockDescription: "开局即可尝试，体力越好收入越稳定。",
    events: ["webapp_found_shared_bike", "webapp_rent_arrears_notice"],
  },
  {
    id: "manual_labor_construction",
    name: "建筑工地苦力",
    icon: "🧱",
    category: "street",
    requirements: [
      { field: "player.physique", min: 20 },
      { field: "player.age", min: 18 },
    ],
    baseSalary: 85,
    salaryGrowth: 0.06,
    maxLevel: 7,
    skills: ["physique", "repair", "welding"],
    stressPerDay: 34,
    description: "高疲劳、高受伤风险，但前期日结现金很关键。",
    unlockDescription: "体质达到 20 后在建筑工地解锁。",
  },
  {
    id: "factory_work_assembly",
    name: "工厂流水线",
    icon: "🏭",
    category: "street",
    requirements: [
      { field: "player.agility", min: 15 },
      { field: "player.age", min: 18 },
    ],
    baseSalary: 95,
    salaryGrowth: 0.05,
    maxLevel: 6,
    skills: ["agility", "electrician"],
    stressPerDay: 28,
    description: "收入稳定，重复劳动会压低心情。",
    unlockDescription: "在工业区，敏捷达到 15 后可做。",
    events: ["webapp_factory_overtime_choice"],
  },
  {
    id: "street_vending_food",
    name: "摆摊卖小吃",
    icon: "🍢",
    category: "street",
    requirements: [{ field: "resources.cash", min: 50 }],
    baseSalary: 70,
    salaryGrowth: 0.08,
    maxLevel: 10,
    skills: ["cooking", "sales"],
    stressPerDay: 16,
    description: "客流、天气、烹饪和销售都会影响收入。",
    unlockDescription: "准备一点启动资金后，在商业区或城中村摆摊。",
    events: ["webapp_food_safety_complaint"],
  },
  {
    id: "delivery_rider",
    name: "外卖骑手",
    icon: "🛵",
    category: "freelance",
    requirements: [
      { field: "player.agility", min: 20 },
      { field: "resources.cash", min: 200 },
    ],
    baseSalary: 110,
    salaryGrowth: 0.05,
    maxLevel: 8,
    skills: ["agility", "driving"],
    stressPerDay: 26,
    description: "天气、交通和平台规则会明显影响收益。",
    unlockDescription: "有交通工具或足够押金后解锁。",
    events: ["webapp_platform_account_ban"],
  },
  {
    id: "hospital_companion",
    name: "陪诊服务",
    icon: "🏥",
    category: "freelance",
    requirements: [
      { field: "player.charm", min: 18 },
      { field: "player.intelligence", min: 18 },
    ],
    baseSalary: 120,
    salaryGrowth: 0.05,
    maxLevel: 6,
    skills: ["charm", "medical"],
    stressPerDay: 18,
    description: "帮患者挂号、取药、看单据，需要耐心和沟通。",
    unlockDescription: "医院地点可见，魅力和智力达到 18 后更容易接单。",
    events: ["webapp_medical_bill_argument"],
  },
  {
    id: "content_writing",
    name: "内容创作者",
    icon: "✍️",
    category: "freelance",
    requirements: [{ field: "player.intelligence", min: 25 }],
    baseSalary: 90,
    salaryGrowth: 0.1,
    maxLevel: 12,
    skills: ["writing", "charm"],
    stressPerDay: 20,
    description: "写探店、短视频脚本和平台文案，波动大但成长快。",
    unlockDescription: "科技园可见，智力达到 25 后解锁。",
    events: ["webapp_live_stream_collab"],
  },
  {
    id: "bank_security",
    name: "银行保安",
    icon: "🏦",
    category: "public",
    requirements: [
      { field: "player.physique", min: 25 },
      { field: "player.fame", min: 0 },
    ],
    baseSalary: 100,
    salaryGrowth: 0.03,
    maxLevel: 5,
    skills: ["physique", "charm"],
    stressPerDay: 12,
    description: "稳定、单调、风险低，适合从高风险日结转向稳定岗位。",
    unlockDescription: "体质 25 后在银行解锁。",
    events: ["webapp_credit_card_call"],
  },
  {
    id: "community_clerk",
    name: "社区协理员",
    icon: "📋",
    category: "public",
    requirements: [
      { field: "player.charm", min: 20 },
      { field: "flags._communityService", min: 1 },
    ],
    baseSalary: 130,
    salaryGrowth: 0.04,
    maxLevel: 7,
    skills: ["charm", "intelligence"],
    stressPerDay: 14,
    description: "处理社区登记、走访和材料，收入不高但社会信用稳定。",
    unlockDescription: "参与社区志愿服务后，在政府办事大厅出现机会。",
    events: ["webapp_community_volunteer"],
  },
  {
    id: "junior_analyst",
    name: "数据分析助理",
    icon: "📊",
    category: "corporate",
    requirements: [
      { field: "player.intelligence", min: 35 },
      { field: "skills.programming.level", min: 5 },
    ],
    baseSalary: 260,
    salaryGrowth: 0.09,
    maxLevel: 10,
    skills: ["programming", "intelligence"],
    stressPerDay: 22,
    description: "把表格、指标和业务需求串起来，是进入公司线的桥。",
    unlockDescription: "智力 35 且编程 5 级后，在科技园可见。",
    events: ["webapp_layoff_rumor"],
  },
  {
    id: "labor_rights_assistant",
    name: "劳动权益助理",
    icon: "⚖️",
    category: "public",
    requirements: [
      { field: "legal.prepScore", min: 2 },
      { field: "player.intelligence", min: 25 },
    ],
    baseSalary: 150,
    salaryGrowth: 0.05,
    maxLevel: 6,
    skills: ["intelligence", "charm"],
    stressPerDay: 16,
    description: "帮人整理欠薪证据、合同材料，把法律知识变成工作能力。",
    unlockDescription: "多次完成劳动争议预检后，在政府办事大厅解锁。",
  },
  {
    id: "urban_trip_planner",
    name: "城市微旅行策划",
    icon: "🗺️",
    category: "freelance",
    requirements: [
      { field: "travel.localFamiliarity", min: 2 },
      { field: "player.charm", min: 25 },
    ],
    baseSalary: 160,
    salaryGrowth: 0.06,
    maxLevel: 8,
    skills: ["charm", "writing"],
    stressPerDay: 15,
    description: "给本地人和外地游客设计低成本城市路线。",
    unlockDescription: "完成几次城市微旅行并提升城市熟悉度后解锁。",
  },
];

export const JOB_CATALOG_STATUS = {
  migrated: JOBS.length,
  legacySource: "src/js/data/jobs.js",
  nextStep: "新增职业优先写入 JOBS，并在 bridge/legacy 行动列表中分批开放。",
} as const;
