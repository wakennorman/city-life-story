/**
 * 疾病系统 — 分级疾病定义与演化规则
 *
 * 疾病分级：轻微 → 中度 → 重度 → 危重
 * 演化路径：
 *   胃溃疡 → 胃出血 → 胃癌
 *   普通感冒 → 支气管炎 → 肺炎
 *   焦虑 → 抑郁 → 重度抑郁
 *   颈椎病 → 腰椎间盘突出 → 坐骨神经痛
 *   脂肪肝 → 肝硬化 → 肝癌
 *
 * 疾病状态：
 *   - active: 当前活跃疾病列表 [{ diseaseId, stage, days, severity }]
 *   - stage: 0=轻微, 1=中度, 2=重度, 3=危重
 *   - days: 患病天数
 *   - severity: 当前严重程度 (0-100)
 */

// ====== 疾病定义 ======
const DISEASES = [
  // ========== 消化系统 ==========
  {
    id: "gastritis",
    name: "胃溃疡",
    icon: "🤢",
    category: "digestive",
    stages: [
      { name: "轻微", threshold: 0, effects: { hunger: -5, happiness: -5 } },
      {
        name: "中度",
        threshold: 30,
        effects: { hunger: -10, happiness: -10, fatigue: +3 },
      },
      {
        name: "重度",
        threshold: 60,
        effects: { hunger: -20, happiness: -15, fatigue: +8, health: -2 },
      },
      {
        name: "危重",
        threshold: 85,
        effects: { hunger: -30, happiness: -20, fatigue: +15, health: -5 },
      },
    ],
    evolution: {
      nextDisease: "gastric_bleeding",
      triggerThreshold: 80, // 严重程度达80%可能演化
      triggerChance: 0.03, // 每天演化概率
    },
    cure: { method: "medicine", cost: 50, successRate: 0.7 },
    dailyHealthMod: -0.5, // 每天健康值变化
  },
  {
    id: "gastric_bleeding",
    name: "胃出血",
    icon: "🩸",
    category: "digestive",
    stages: [
      {
        name: "轻微",
        threshold: 0,
        effects: { hunger: -10, happiness: -10, health: -1 },
      },
      {
        name: "中度",
        threshold: 30,
        effects: { hunger: -20, happiness: -15, health: -3 },
      },
      {
        name: "重度",
        threshold: 60,
        effects: { hunger: -30, happiness: -20, health: -5, fatigue: +10 },
      },
      {
        name: "危重",
        threshold: 85,
        effects: { hunger: -40, happiness: -30, health: -10, fatigue: +20 },
      },
    ],
    evolution: {
      nextDisease: "stomach_cancer",
      triggerThreshold: 85,
      triggerChance: 0.02,
    },
    cure: { method: "medicine", cost: 200, successRate: 0.4 },
    dailyHealthMod: -1.5,
  },
  {
    id: "stomach_cancer",
    name: "胃癌",
    icon: "💀",
    category: "digestive",
    stages: [
      {
        name: "早期",
        threshold: 0,
        effects: { hunger: -15, happiness: -20, health: -2 },
      },
      {
        name: "中期",
        threshold: 30,
        effects: { hunger: -30, happiness: -30, health: -5, fatigue: +10 },
      },
      {
        name: "晚期",
        threshold: 60,
        effects: { hunger: -50, happiness: -40, health: -10, fatigue: +20 },
      },
      {
        name: "终末期",
        threshold: 85,
        effects: { hunger: -70, happiness: -50, health: -20, fatigue: +30 },
      },
    ],
    evolution: null, // 终末疾病，无演化
    cure: { method: "surgery", cost: 50000, successRate: 0.1 },
    dailyHealthMod: -3,
    terminal: true, // 终末期会致命
  },

  // ========== 呼吸系统 ==========
  {
    id: "common_cold",
    name: "普通感冒",
    icon: "🤧",
    category: "respiratory",
    stages: [
      { name: "轻微", threshold: 0, effects: { fatigue: +5, happiness: -5 } },
      {
        name: "中度",
        threshold: 25,
        effects: { fatigue: +10, happiness: -10, health: -1 },
      },
      {
        name: "重度",
        threshold: 50,
        effects: { fatigue: +20, happiness: -15, health: -3 },
      },
      {
        name: "危重",
        threshold: 75,
        effects: { fatigue: +30, happiness: -20, health: -5 },
      },
    ],
    evolution: {
      nextDisease: "bronchitis",
      triggerThreshold: 70,
      triggerChance: 0.02,
    },
    cure: { method: "rest", cost: 0, successRate: 0.8 },
    dailyHealthMod: -0.3,
    selfHealChance: 0.05, // 每天自愈概率
  },
  {
    id: "bronchitis",
    name: "支气管炎",
    icon: "🫁",
    category: "respiratory",
    stages: [
      {
        name: "轻微",
        threshold: 0,
        effects: { fatigue: +10, happiness: -10, health: -1 },
      },
      {
        name: "中度",
        threshold: 30,
        effects: { fatigue: +20, happiness: -15, health: -3 },
      },
      {
        name: "重度",
        threshold: 60,
        effects: { fatigue: +30, happiness: -20, health: -6 },
      },
      {
        name: "危重",
        threshold: 85,
        effects: { fatigue: +40, happiness: -30, health: -10 },
      },
    ],
    evolution: {
      nextDisease: "pneumonia",
      triggerThreshold: 80,
      triggerChance: 0.02,
    },
    cure: { method: "medicine", cost: 100, successRate: 0.5 },
    dailyHealthMod: -1,
  },
  {
    id: "pneumonia",
    name: "肺炎",
    icon: "🫀",
    category: "respiratory",
    stages: [
      {
        name: "轻微",
        threshold: 0,
        effects: { fatigue: +15, happiness: -15, health: -3 },
      },
      {
        name: "中度",
        threshold: 30,
        effects: { fatigue: +25, happiness: -25, health: -6 },
      },
      {
        name: "重度",
        threshold: 60,
        effects: { fatigue: +40, happiness: -35, health: -10 },
      },
      {
        name: "危重",
        threshold: 85,
        effects: { fatigue: +50, happiness: -50, health: -20 },
      },
    ],
    evolution: null,
    cure: { method: "surgery", cost: 10000, successRate: 0.3 },
    dailyHealthMod: -2,
  },

  // ========== 心理健康 ==========
  {
    id: "anxiety",
    name: "焦虑",
    icon: "😰",
    category: "mental",
    stages: [
      { name: "轻微", threshold: 0, effects: { happiness: -10, fatigue: +5 } },
      {
        name: "中度",
        threshold: 30,
        effects: { happiness: -20, fatigue: +10, mental: -2 },
      },
      {
        name: "重度",
        threshold: 60,
        effects: { happiness: -30, fatigue: +20, mental: -5 },
      },
      {
        name: "危重",
        threshold: 85,
        effects: { happiness: -40, fatigue: +30, mental: -10 },
      },
    ],
    evolution: {
      nextDisease: "depression",
      triggerThreshold: 75,
      triggerChance: 0.02,
    },
    cure: { method: "therapy", cost: 200, successRate: 0.6 },
    dailyHealthMod: 0,
  },
  {
    id: "depression",
    name: "抑郁",
    icon: "😞",
    category: "mental",
    stages: [
      {
        name: "轻微",
        threshold: 0,
        effects: { happiness: -20, fatigue: +10, mental: -3 },
      },
      {
        name: "中度",
        threshold: 30,
        effects: { happiness: -35, fatigue: +20, mental: -6, agility: -2 },
      },
      {
        name: "重度",
        threshold: 60,
        effects: { happiness: -50, fatigue: +30, mental: -10, agility: -5 },
      },
      {
        name: "危重",
        threshold: 85,
        effects: { happiness: -70, fatigue: +40, mental: -15, agility: -10 },
      },
    ],
    evolution: {
      nextDisease: "severe_depression",
      triggerThreshold: 80,
      triggerChance: 0.015,
    },
    cure: { method: "therapy", cost: 500, successRate: 0.3 },
    dailyHealthMod: -0.5,
  },
  {
    id: "severe_depression",
    name: "重度抑郁",
    icon: "🌑",
    category: "mental",
    stages: [
      {
        name: "轻微",
        threshold: 0,
        effects: { happiness: -30, fatigue: +20, mental: -5, agility: -3 },
      },
      {
        name: "中度",
        threshold: 30,
        effects: { happiness: -50, fatigue: +30, mental: -10, agility: -6 },
      },
      {
        name: "重度",
        threshold: 60,
        effects: { happiness: -70, fatigue: +40, mental: -15, agility: -10 },
      },
      {
        name: "危重",
        threshold: 85,
        effects: {
          happiness: -90,
          fatigue: +50,
          mental: -20,
          agility: -15,
          health: -3,
        },
      },
    ],
    evolution: null,
    cure: { method: "therapy", cost: 2000, successRate: 0.1 },
    dailyHealthMod: -1,
    terminal: true,
  },

  // ========== 骨骼肌肉 ==========
  {
    id: "cervical_spondylosis",
    name: "颈椎病",
    icon: "🦒",
    category: "musculoskeletal",
    stages: [
      { name: "轻微", threshold: 0, effects: { fatigue: +5, happiness: -5 } },
      {
        name: "中度",
        threshold: 30,
        effects: { fatigue: +10, happiness: -10, agility: -2 },
      },
      {
        name: "重度",
        threshold: 60,
        effects: { fatigue: +20, happiness: -15, agility: -5 },
      },
      {
        name: "危重",
        threshold: 85,
        effects: { fatigue: +30, happiness: -20, agility: -8 },
      },
    ],
    evolution: {
      nextDisease: "lumbar_disc",
      triggerThreshold: 75,
      triggerChance: 0.02,
    },
    cure: { method: "therapy", cost: 100, successRate: 0.5 },
    dailyHealthMod: -0.3,
  },
  {
    id: "lumbar_disc",
    name: "腰椎间盘突出",
    icon: "🦴",
    category: "musculoskeletal",
    stages: [
      {
        name: "轻微",
        threshold: 0,
        effects: { fatigue: +10, happiness: -10, agility: -3 },
      },
      {
        name: "中度",
        threshold: 30,
        effects: { fatigue: +20, happiness: -15, agility: -6 },
      },
      {
        name: "重度",
        threshold: 60,
        effects: { fatigue: +35, happiness: -25, agility: -10 },
      },
      {
        name: "危重",
        threshold: 85,
        effects: { fatigue: +50, happiness: -35, agility: -15 },
      },
    ],
    evolution: {
      nextDisease: "sciatica",
      triggerThreshold: 80,
      triggerChance: 0.02,
    },
    cure: { method: "surgery", cost: 30000, successRate: 0.3 },
    dailyHealthMod: -0.8,
  },
  {
    id: "sciatica",
    name: "坐骨神经痛",
    icon: "⚡",
    category: "musculoskeletal",
    stages: [
      {
        name: "轻微",
        threshold: 0,
        effects: { fatigue: +15, happiness: -15, agility: -5 },
      },
      {
        name: "中度",
        threshold: 30,
        effects: { fatigue: +25, happiness: -25, agility: -10 },
      },
      {
        name: "重度",
        threshold: 60,
        effects: { fatigue: +40, happiness: -35, agility: -15 },
      },
      {
        name: "危重",
        threshold: 85,
        effects: { fatigue: +60, happiness: -50, agility: -20, health: -2 },
      },
    ],
    evolution: null,
    cure: { method: "surgery", cost: 50000, successRate: 0.2 },
    dailyHealthMod: -1,
  },

  // ========== 肝脏疾病 ==========
  {
    id: "fatty_liver",
    name: "脂肪肝",
    icon: "🍺",
    category: "liver",
    stages: [
      { name: "轻度", threshold: 0, effects: { fatigue: +5, happiness: -3 } },
      {
        name: "中度",
        threshold: 30,
        effects: { fatigue: +10, happiness: -8, health: -1 },
      },
      {
        name: "重度",
        threshold: 60,
        effects: { fatigue: +20, happiness: -15, health: -3 },
      },
      {
        name: "危重",
        threshold: 85,
        effects: { fatigue: +30, happiness: -25, health: -6 },
      },
    ],
    evolution: {
      nextDisease: "cirrhosis",
      triggerThreshold: 75,
      triggerChance: 0.015,
    },
    cure: { method: "lifestyle", cost: 0, successRate: 0.4 },
    dailyHealthMod: -0.3,
  },
  {
    id: "cirrhosis",
    name: "肝硬化",
    icon: "🫀",
    category: "liver",
    stages: [
      {
        name: "代偿期",
        threshold: 0,
        effects: { fatigue: +15, happiness: -15, health: -2 },
      },
      {
        name: "失代偿期",
        threshold: 30,
        effects: { fatigue: +25, happiness: -25, health: -5 },
      },
      {
        name: "晚期",
        threshold: 60,
        effects: { fatigue: +40, happiness: -35, health: -10 },
      },
      {
        name: "终末期",
        threshold: 85,
        effects: { fatigue: +60, happiness: -50, health: -20 },
      },
    ],
    evolution: {
      nextDisease: "liver_cancer",
      triggerThreshold: 80,
      triggerChance: 0.02,
    },
    cure: { method: "surgery", cost: 100000, successRate: 0.15 },
    dailyHealthMod: -2,
  },
  {
    id: "liver_cancer",
    name: "肝癌",
    icon: "💀",
    category: "liver",
    stages: [
      {
        name: "早期",
        threshold: 0,
        effects: { fatigue: +20, happiness: -25, health: -3 },
      },
      {
        name: "中期",
        threshold: 30,
        effects: { fatigue: +35, happiness: -40, health: -8 },
      },
      {
        name: "晚期",
        threshold: 60,
        effects: { fatigue: +50, happiness: -55, health: -15 },
      },
      {
        name: "终末期",
        threshold: 85,
        effects: { fatigue: +70, happiness: -70, health: -30 },
      },
    ],
    evolution: null,
    cure: { method: "surgery", cost: 200000, successRate: 0.05 },
    dailyHealthMod: -5,
    terminal: true,
  },
];

/** 疾病分类列表 */
const DISEASE_CATEGORIES = {
  digestive: { name: "消化系统", icon: "🍽️" },
  respiratory: { name: "呼吸系统", icon: "🫁" },
  mental: { name: "心理健康", icon: "🧠" },
  musculoskeletal: { name: "骨骼肌肉", icon: "🦴" },
  liver: { name: "肝脏", icon: "🫀" },
};

/** 获取疾病定义 */
function getDisease(diseaseId) {
  return DISEASES.find((d) => d.id === diseaseId);
}

/** 获取疾病所有阶段 */
function getDiseaseStages(diseaseId) {
  const disease = getDisease(diseaseId);
  return disease ? disease.stages : [];
}

/** 获取当前疾病阶段 */
function getDiseaseStage(diseaseId, severity) {
  const stages = getDiseaseStages(diseaseId);
  if (!stages.length) return null;
  for (let i = stages.length - 1; i >= 0; i--) {
    if (severity >= stages[i].threshold) {
      return { index: i, ...stages[i] };
    }
  }
  return stages[0];
}

/** 获取所有疾病列表 */
function getAllDiseases() {
  return DISEASES;
}

/** 获取所有疾病分类 */
function getDiseaseCategories() {
  return DISEASE_CATEGORIES;
}

// 全局导出
if (typeof window !== "undefined") {
  Object.assign(window, {
    DISEASES,
    DISEASE_CATEGORIES,
    getDisease,
    getDiseaseStages,
    getDiseaseStage,
    getAllDiseases,
    getDiseaseCategories,
  });
}
