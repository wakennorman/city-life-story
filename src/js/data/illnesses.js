/**
 * Illnesses — 命名疾病数据库
 *
 * 设计原则：
 *   1. 每种病有明确触发条件（习惯阈值），避免随机暴击。
 *   2. 症状以"持续 debuff"为主，让玩家持续感到"哎我得病了"。
 *   3. 治疗有两档：药店（便宜慢）/ 医院（贵快）；少数严重病只能去医院。
 *   4. 部分病可由其它病演化而来（反复肠胃炎 → 胃溃疡）。
 *
 * triggerHabit 字段（state.flags._habits 计数器名）:
 *   - junkFoodMeals       : 累计垃圾食品次数
 *   - lowHungerStreak     : 连续饥饱<25 天数
 *   - lowHygieneStreak    : 连续卫生<30 天数
 *   - lowHappinessStreak  : 连续心情<20 天数
 *   - highFatigueStreak   : 连续疲劳>80 天数
 *   - lateNightActions    : 累计夜间娱乐次数
 *   - stomach_inflammationCount : 已得过几次肠胃炎
 *
 * symptom 字段（applyStatusInteractions 中累加）:
 *   - health              : 每日健康变化（负=持续掉血）
 *   - hunger / fatigue / happiness / hygiene : 每日 needs 额外变化
 *   - physiqueDebuff / mentalDebuff / agilityDebuff / intelligenceDebuff : 有效属性扣减
 *   - apMult              : AP 消耗倍率额外加成
 *   - fatigueRecoveryMult : 睡眠疲劳恢复倍率（<1=恢复打折）
 *
 * treatCost 字段:
 *   - pharmacy : 药店治疗费用（None = 不可药店）
 *   - hospital : 医院治疗费用
 *   - hospital_monthly : 慢性病按月治疗（持续付费才不发作）
 */

const ILLNESSES = {
  // ========== 常见轻症 ==========
  cold: {
    id: "cold",
    name: "感冒",
    icon: "🤧",
    severity: 1,
    naturalCureDays: [3, 5],
    triggerHabit: { lowHygieneStreak: 7, highFatigueStreak: 3 },
    triggerChance: 0.5,
    symptom: { health: -1, fatigue: 5 },
    treatCost: { pharmacy: 80, hospital: 300 },
    desc: "鼻塞咳嗽，没力气干活。卫生不好+疲劳就容易着凉。",
    evolvesTo: ["pneumonia"],
  },
  stomach_inflammation: {
    id: "stomach_inflammation",
    name: "肠胃炎",
    icon: "🤢",
    severity: 2,
    naturalCureDays: [5, 8],
    triggerHabit: { junkFoodMeals: 15 },
    triggerChance: 0.45,
    symptom: { health: -2, hunger: -3 },
    treatCost: { pharmacy: 150, hospital: 600 },
    desc: "肚子绞痛、拉肚子，吃啥都没胃口。垃圾食品吃多了。",
    evolvesTo: ["gastritis"],
  },
  malnutrition: {
    id: "malnutrition",
    name: "营养不良",
    icon: "💀",
    severity: 2,
    naturalCureDays: [10, 15],
    triggerHabit: { lowHungerStreak: 10 },
    triggerChance: 0.5,
    symptom: { physiqueDebuff: 5, fatigue: 3 },
    treatCost: { pharmacy: 200, hospital: 800 },
    requiresNutrition: true,
    desc: "脸黄面瘦，气血两亏。需要营养餐+治疗双管齐下。",
    evolvesTo: ["anemia"],
  },
  insomnia: {
    id: "insomnia",
    name: "失眠症",
    icon: "🌙",
    severity: 2,
    naturalCureDays: [10, 20],
    triggerHabit: { lateNightActions: 15, lowHappinessStreak: 5 },
    triggerChance: 0.4,
    symptom: { fatigueRecoveryMult: 0.6, mentalDebuff: 5 },
    treatCost: { pharmacy: 100, hospital: 400 },
    desc: "翻来覆去睡不着，第二天精神涣散。夜生活太多+心情差。",
    evolvesTo: ["severe_insomnia"],
  },
  skin_infection: {
    id: "skin_infection",
    name: "皮肤感染",
    icon: "🦠",
    severity: 1,
    naturalCureDays: [4, 7],
    triggerHabit: { lowHygieneStreak: 8 },
    triggerChance: 0.45,
    symptom: { health: -1, happiness: -2 },
    treatCost: { pharmacy: 120, hospital: 350 },
    desc: "湿疹、皮疹反复发作，痒得心烦。卫生太差闹的。",
  },

  // ========== 中度疾病 ==========
  overwork: {
    id: "overwork",
    name: "过劳综合症",
    icon: "🥵",
    severity: 3,
    naturalCureDays: [7, 12],
    triggerHabit: { highFatigueStreak: 8 },
    triggerChance: 0.45,
    symptom: { mentalDebuff: 8, fatigue: 5, apMult: 0.15 },
    treatCost: { hospital: 1200 },
    desc: "头晕乏力、注意力涣散，做啥效率都低。该停下来歇歇了。",
    evolvesTo: ["sudden_death_risk"],
  },
  depression: {
    id: "depression",
    name: "抑郁倾向",
    icon: "🌧️",
    severity: 3,
    naturalCureDays: [15, 30],
    triggerHabit: { lowHappinessStreak: 15 },
    triggerChance: 0.35,
    symptom: { mentalDebuff: 15, apMult: 0.2, happiness: -3 },
    treatCost: { hospital: 1500 },
    desc: "什么都没意思，连床都不想下。走出来需要时间和帮助。",
    evolvesTo: ["major_depression"],
  },

  // ========== 慢性进阶疾病 ==========
  gastritis: {
    id: "gastritis",
    name: "胃溃疡",
    icon: "🩸",
    severity: 4,
    naturalCureDays: [20, 40],
    triggerHabit: { stomach_inflammationCount: 3 },
    triggerChance: 0.45,
    symptom: { health: -3, hunger: -5, physiqueDebuff: 4 },
    treatCost: { hospital: 3000 },
    desc: "肠胃炎反复拖出来的慢性病。烧心反酸不停。",
    evolvesTo: ["stomach_cancer"],
  },
  hypertension: {
    id: "hypertension",
    name: "高血压",
    icon: "💢",
    severity: 4,
    isChronic: true,
    triggerHabit: { junkFoodMeals: 50, age: 35 },
    triggerChance: 0.45,
    symptom: { physiqueDebuff: 10, randomFaintCh: 0.005 },
    treatCost: { hospital_monthly: 200 },
    desc: "慢性病，需要持续吃药控制（按月¥200），不吃血压飙高有概率晕厥。",
  },

  // ========== 疾病演化链：三阶进阶 ==========

  // 肠胃炎 → 胃溃疡 → 胃癌
  stomach_cancer: {
    id: "stomach_cancer",
    name: "胃癌",
    icon: "☠️",
    severity: 6,
    naturalCureDays: [60, 120],
    triggerHabit: { gastritisCount: 3, age: 45 },
    triggerChance: 0.35,
    symptom: {
      health: -5,
      hunger: -10,
      physiqueDebuff: 8,
      randomVomitCh: 0.08,
    },
    treatCost: { hospital: 15000 },
    desc: "胃溃疡长期未治愈演化成的恶性肿瘤。健康持续暴跌，食欲严重下降，偶有吐血。手术是唯一根治手段，费用高昂。",
    isEvolution: true,
    evolvesFrom: ["gastritis"],
  },

  // 抑郁 → 重度抑郁 → 自杀风险
  major_depression: {
    id: "major_depression",
    name: "重度抑郁",
    icon: "🌑",
    severity: 5,
    naturalCureDays: [30, 60],
    triggerHabit: { depressionCount: 2 },
    triggerChance: 0.3,
    symptom: {
      mentalDebuff: 25,
      apMult: 0.3,
      happiness: -8,
      workRefusalCh: 0.6,
    },
    treatCost: { hospital: 3000 },
    treatCostMonthly: 3000,
    desc: "抑郁倾向反复未愈，演化成重度抑郁。拒绝工作，社交封闭，AP消耗大幅增加。需要长期心理治疗+药物。",
    isEvolution: true,
    evolvesFrom: ["depression"],
  },

  // 感冒 → 肺炎 → 器官衰竭
  pneumonia: {
    id: "pneumonia",
    name: "肺炎",
    icon: "🫁",
    severity: 4,
    naturalCureDays: [10, 20],
    triggerHabit: { coldCount: 1, highFatigueStreak: 3, healthUnder30: 1 },
    triggerChance: 0.35,
    symptom: { health: -3, fatigue: 8, breathingDifficulty: true },
    treatCost: { pharmacy: 300, hospital: 800 },
    desc: "感冒未及时治疗+疲劳累积，发展成肺炎。呼吸困难，健康持续下降。",
    isEvolution: true,
    evolvesFrom: ["cold"],
    evolvesTo: ["organ_failure"],
  },

  organ_failure: {
    id: "organ_failure",
    name: "器官衰竭",
    icon: "⚰️",
    severity: 7,
    naturalCureDays: [30, 90],
    triggerHabit: { pneumoniaCount: 1, healthUnder30: 1 },
    triggerChance: 0.25,
    symptom: {
      health: -8,
      physiqueDebuff: 15,
      mentalDebuff: 10,
      multiOrganDamage: true,
    },
    treatCost: { hospital: 30000 },
    desc: "肺炎恶化导致多器官受损。健康急剧下降，随时可能危及生命。ICU治疗费用极高。",
    isEvolution: true,
    evolvesFrom: ["pneumonia"],
  },

  // 营养不良 → 贫血
  anemia: {
    id: "anemia",
    name: "贫血",
    icon: "🩸",
    severity: 3,
    naturalCureDays: [15, 30],
    triggerHabit: { malnutritionCount: 1, age: 35 },
    triggerChance: 0.4,
    symptom: { physiqueDebuff: 5, fatigue: 3, dizzinessCh: 0.05 },
    treatCost: { pharmacy: 200, hospital: 500 },
    desc: "营养不良长期未愈，加上年龄增长，发展成贫血。体质下降，容易头晕。",
    isEvolution: true,
    evolvesFrom: ["malnutrition"],
  },

  // 失眠症 → 重度失眠
  severe_insomnia: {
    id: "severe_insomnia",
    name: "重度失眠",
    icon: "🌙",
    severity: 4,
    naturalCureDays: [20, 40],
    triggerHabit: { insomniaCount: 1, age: 40 },
    triggerChance: 0.35,
    symptom: {
      fatigueRecoveryMult: 0.3,
      mentalDebuff: 10,
      hallucinationCh: 0.03,
    },
    treatCost: { hospital: 800 },
    treatCostMonthly: 800,
    desc: "失眠症长期未愈，年龄增长加重病情。睡眠恢复效果严重打折，偶有幻觉。",
    isEvolution: true,
    evolvesFrom: ["insomnia"],
  },

  // 过劳 → 猝死风险
  sudden_death_risk: {
    id: "sudden_death_risk",
    name: "猝死风险",
    icon: "💔",
    severity: 8,
    naturalCureDays: [7, 14],
    triggerHabit: { overworkCount: 1, age: 45 },
    triggerChance: 0.2,
    symptom: { dailyDeathChance: 0.02, mentalDebuff: 20, physiqueDebuff: 10 },
    treatCost: { hospital: 5000 },
    desc: "过劳综合症未愈+年龄增长，猝死风险极高。每日有2%概率直接死亡。必须强制休息7天以上。",
    isEvolution: true,
    evolvesFrom: ["overwork"],
    isCritical: true,
  },

  // 职业病：颈椎病
  cervical_spondylosis: {
    id: "cervical_spondylosis",
    name: "颈椎病",
    icon: "🦴",
    severity: 3,
    naturalCureDays: [30, 60],
    triggerHabit: { officeWorkDays: 100 },
    triggerChance: 0.5,
    symptom: { intelligenceDebuff: 2, fatigue: 2, neckPain: true },
    treatCost: { pharmacy: 100, hospital: 300 },
    desc: "长期办公室工作导致的职业病。智力轻微下降，每日疲劳增加。理疗可缓解。",
    isOccupational: true,
  },

  // 糖尿病（新增慢性病）
  diabetes: {
    id: "diabetes",
    name: "糖尿病",
    icon: "🍬",
    severity: 5,
    isChronic: true,
    triggerHabit: { junkFoodMeals: 80, age: 40, hungerHighStreak: 30 },
    triggerChance: 0.3,
    symptom: { health: -1, hunger: 5, fatigue: 2, randomVisionBlur: 0.02 },
    treatCost: { hospital_monthly: 300 },
    desc: "长期垃圾食品+肥胖+年龄增长导致的慢性病。需要持续控制饮食+药物（按月¥300）。",
  },
};

/** 列出当前可能患的疾病（按 habits 字段判断） */
function getIllnessById(id) {
  return ILLNESSES[id] || null;
}

/** 获取已得疾病实例上的疾病数据 */
function getIllnessData(instance) {
  return ILLNESSES[instance.id] || null;
}

/** 检查玩家当前是否患有某种疾病 */
function hasIllness(state, illnessId) {
  if (!state.status || !state.status.illnesses) return false;
  for (var i = 0; i < state.status.illnesses.length; i++) {
    if (state.status.illnesses[i].id === illnessId) return true;
  }
  return false;
}
