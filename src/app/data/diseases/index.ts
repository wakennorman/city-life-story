export type DiseaseSeverity = "minor" | "moderate" | "severe" | "critical";
export type TreatmentType = "rest" | "medicine" | "surgery";

export interface Disease {
  id: string;
  name: string;
  icon: string;
  severity: DiseaseSeverity;
  triggerConditions: {
    healthBelow?: number;
    season?: string;
    exposure?: string;
    probability: number;
  };
  symptoms: string[];
  treatment: {
    type: TreatmentType;
    cost: number;
    duration: number;
    effectPerDay: number;
  };
  insuranceCoverage: number;
  complications?: string[];
}

export const DISEASES: Disease[] = [
  {
    id: "cold",
    name: "感冒",
    icon: "🤧",
    severity: "minor",
    triggerConditions: {
      healthBelow: 75,
      exposure: "低卫生或高疲劳连续多日",
      probability: 0.18,
    },
    symptoms: ["鼻塞咳嗽", "疲劳上升", "每日健康小幅下降"],
    treatment: { type: "medicine", cost: 80, duration: 3, effectPerDay: 4 },
    insuranceCoverage: 0.5,
    complications: ["pneumonia"],
  },
  {
    id: "stomach_inflammation",
    name: "肠胃炎",
    icon: "🤢",
    severity: "moderate",
    triggerConditions: {
      healthBelow: 80,
      exposure: "垃圾食品或变质食材累计过多",
      probability: 0.16,
    },
    symptoms: ["腹痛腹泻", "饱腹下降", "工作效率下降"],
    treatment: { type: "medicine", cost: 150, duration: 5, effectPerDay: 5 },
    insuranceCoverage: 0.55,
    complications: ["gastritis"],
  },
  {
    id: "malnutrition",
    name: "营养不良",
    icon: "💀",
    severity: "moderate",
    triggerConditions: {
      healthBelow: 70,
      exposure: "连续低饱腹",
      probability: 0.14,
    },
    symptoms: ["体质临时降低", "疲劳恢复变慢", "更易感染"],
    treatment: { type: "rest", cost: 200, duration: 7, effectPerDay: 3 },
    insuranceCoverage: 0.3,
    complications: ["anemia"],
  },
  {
    id: "insomnia",
    name: "失眠症",
    icon: "🌙",
    severity: "moderate",
    triggerConditions: {
      exposure: "夜间行动过多或心情长期过低",
      probability: 0.15,
    },
    symptoms: ["睡眠恢复降低", "心智能力临时下降", "行动效率降低"],
    treatment: { type: "medicine", cost: 120, duration: 6, effectPerDay: 4 },
    insuranceCoverage: 0.4,
    complications: ["severe_insomnia", "depression"],
  },
  {
    id: "skin_infection",
    name: "皮肤感染",
    icon: "🦠",
    severity: "minor",
    triggerConditions: {
      exposure: "低卫生和潮湿环境",
      probability: 0.12,
    },
    symptoms: ["健康小幅下降", "心情下降", "部分服务岗位受影响"],
    treatment: { type: "medicine", cost: 120, duration: 4, effectPerDay: 4 },
    insuranceCoverage: 0.45,
  },
  {
    id: "overwork",
    name: "过劳综合症",
    icon: "🥵",
    severity: "severe",
    triggerConditions: {
      healthBelow: 65,
      exposure: "高疲劳连续工作",
      probability: 0.13,
    },
    symptoms: ["行动力成本上升", "心智下降", "每日疲劳额外增加"],
    treatment: { type: "rest", cost: 1200, duration: 8, effectPerDay: 6 },
    insuranceCoverage: 0.6,
    complications: ["sudden_death_risk"],
  },
  {
    id: "depression",
    name: "抑郁倾向",
    icon: "🌧️",
    severity: "severe",
    triggerConditions: {
      exposure: "低心情持续多日或重大失败事件",
      probability: 0.1,
    },
    symptoms: ["心情持续下降", "行动力成本提高", "社交收益降低"],
    treatment: { type: "medicine", cost: 1500, duration: 14, effectPerDay: 5 },
    insuranceCoverage: 0.5,
    complications: ["major_depression"],
  },
  {
    id: "gastritis",
    name: "胃溃疡",
    icon: "🩸",
    severity: "severe",
    triggerConditions: {
      healthBelow: 60,
      exposure: "肠胃炎反复发作",
      probability: 0.08,
    },
    symptoms: ["饱腹下降", "健康下降", "体质临时降低"],
    treatment: { type: "medicine", cost: 3000, duration: 18, effectPerDay: 5 },
    insuranceCoverage: 0.65,
    complications: ["stomach_cancer"],
  },
  {
    id: "hypertension",
    name: "高血压",
    icon: "💢",
    severity: "severe",
    triggerConditions: {
      healthBelow: 70,
      exposure: "年龄增长、高盐饮食或长期压力",
      probability: 0.07,
    },
    symptoms: ["体质下降", "偶发眩晕", "慢性月度治疗支出"],
    treatment: { type: "medicine", cost: 200, duration: 30, effectPerDay: 2 },
    insuranceCoverage: 0.7,
    complications: ["stroke_risk"],
  },
  {
    id: "pneumonia",
    name: "肺炎",
    icon: "🫁",
    severity: "critical",
    triggerConditions: {
      healthBelow: 50,
      season: "winter",
      exposure: "感冒拖延不治",
      probability: 0.06,
    },
    symptoms: ["健康快速下降", "行动力显著受限", "必须医院治疗"],
    treatment: { type: "medicine", cost: 5000, duration: 12, effectPerDay: 8 },
    insuranceCoverage: 0.75,
  },
  {
    id: "major_depression",
    name: "重度抑郁",
    icon: "🕳️",
    severity: "critical",
    triggerConditions: {
      healthBelow: 55,
      exposure: "抑郁倾向长期未治疗",
      probability: 0.05,
    },
    symptoms: ["心情和行动力严重受限", "工作表现下降", "需要长期治疗"],
    treatment: { type: "medicine", cost: 8000, duration: 30, effectPerDay: 6 },
    insuranceCoverage: 0.6,
  },
  {
    id: "work_injury",
    name: "工伤扭伤",
    icon: "🩼",
    severity: "moderate",
    triggerConditions: {
      exposure: "工地、工厂、外卖等高风险工作",
      probability: 0.11,
    },
    symptoms: ["体力工作收益下降", "疲劳增加", "可引出工伤赔偿纠纷"],
    treatment: { type: "medicine", cost: 600, duration: 6, effectPerDay: 5 },
    insuranceCoverage: 0.7,
    complications: ["labor_dispute"],
  },
];

export const DISEASE_CATALOG_STATUS = {
  migrated: DISEASES.length,
  legacySource: "src/js/data/illnesses.js + src/js/core/medical.js",
  nextStep:
    "新增疾病继续按触发条件/治疗/医保/并发症四段建模，再由医疗系统接入。",
} as const;
