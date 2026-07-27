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
    triggerHabit: { lowHygieneStreak: 8, highFatigueStreak: 5 },
    triggerChance: 0.25,
    // 细化：增加季节倾向（冬春多发）
    seasonInfluence: { spring: 1.3, summer: 0.6, autumn: 0.9, winter: 1.5 },
    symptom: { health: -1, fatigue: 5, appetiteDown: true },
    treatCost: { pharmacy: 60, hospital: 200 },
    desc: "鼻塞咳嗽流鼻涕，浑身没劲。换季着凉+卫生不好就容易中招。多喝热水，药店买点药就好。",
    evolvesTo: ["pneumonia"],
  },
  stomach_inflammation: {
    id: "stomach_inflammation",
    name: "肠胃炎",
    icon: "🤢",
    severity: 2,
    naturalCureDays: [5, 8],
    triggerHabit: { junkFoodMeals: 20 },
    triggerChance: 0.25,
    symptom: { health: -2, hunger: -3 },
    treatCost: { pharmacy: 150, hospital: 600 },
    desc: "肚子绞痛、拉肚子，吃啥都没胃口。垃圾食品吃多了，反复发作会拖成慢性胃炎。",
    evolvesTo: ["gastritis"],
  },
  malnutrition: {
    id: "malnutrition",
    name: "营养不良",
    icon: "💀",
    severity: 2,
    naturalCureDays: [10, 15],
    triggerHabit: { lowHungerStreak: 15 },
    triggerChance: 0.3,
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
    naturalCureDays: [7, 14],
    triggerHabit: {
      lateNightActions: 15,
      lowHappinessStreak: 8,
      highFatigueStreak: 8,
    },
    triggerChance: 0.22,
    // 细化：渐变触发——连续熬夜越多概率越大
    graduatedTrigger: {
      baseChance: 0.1,
      perUnit: { lateNightActions: 0.015, highFatigueStreak: 0.02 },
      maxChance: 0.4,
    },
    symptom: {
      fatigueRecoveryMult: 0.65,
      mentalDebuff: 4,
      fatigue: 3,
      concentrationDown: true,
    },
    treatCost: { pharmacy: 80, hospital: 350, herbal: 50 },
    desc: "翻来覆去睡不着，第二天头晕脑胀。夜生活太多+压力大，身体想休息脑子却停不下来。安神茶+规律作息可缓解。",
    evolvesTo: ["severe_insomnia"],
  },
  skin_infection: {
    id: "skin_infection",
    name: "皮肤感染",
    icon: "🦠",
    severity: 1,
    naturalCureDays: [4, 7],
    triggerHabit: { lowHygieneStreak: 12 },
    triggerChance: 0.25,
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
    triggerHabit: { highFatigueStreak: 12 },
    triggerChance: 0.25,
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
    triggerHabit: { lowHappinessStreak: 20 },
    triggerChance: 0.2,
    symptom: { mentalDebuff: 15, apMult: 0.2, happiness: -3 },
    treatCost: { hospital: 1500 },
    desc: "什么都没意思，连床都不想下。走出来需要时间和帮助。",
    evolvesTo: ["major_depression"],
  },

  // ========== 慢性进阶疾病 ==========
  gastritis: {
    id: "gastritis",
    name: "胃炎",
    icon: "🩸",
    severity: 3,
    naturalCureDays: [10, 20],
    triggerHabit: { stomach_inflammationCount: 2 },
    triggerChance: 0.22,
    symptom: { health: -2, hunger: -3, physiqueDebuff: 2, stomachPain: true },
    treatCost: { pharmacy: 150, hospital: 600 },
    desc: "肠胃炎反复发作拖出来的慢性胃炎。胃酸过多、烧心、饭后胀气。要注意饮食调理。",
    evolvesTo: ["gastric_ulcer"],
  },
  gastric_ulcer: {
    id: "gastric_ulcer",
    name: "胃溃疡",
    icon: "🩸",
    severity: 4,
    naturalCureDays: [20, 40],
    triggerHabit: { gastritisCount: 2 },
    triggerChance: 0.22,
    symptom: {
      health: -4,
      hunger: -6,
      physiqueDebuff: 5,
      stomachBleedingCh: 0.05,
      bloodInStool: true,
    },
    treatCost: { hospital: 3000 },
    desc: "慢性胃炎长期未愈发展为胃溃疡。胃壁破了口子，吃饭像受刑。偶发胃出血，需要住院治疗。",
    isEvolution: true,
    evolvesFrom: ["gastritis"],
    evolvesTo: ["stomach_cancer"],
  },
  hypertension: {
    id: "hypertension",
    name: "高血压",
    icon: "💢",
    severity: 4,
    isChronic: true,
    triggerHabit: { junkFoodMeals: 60, age: 40 },
    triggerChance: 0.25,
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
    // [全系统自洽修复] 域A A类#6: gastritisCount→gastric_ulcerCount（匹配 evolvesFrom: gastric_ulcer，原字段致演化链断裂）
    triggerHabit: { gastric_ulcerCount: 1, age: 45 },
    triggerChance: 0.2,
    symptom: {
      health: -5,
      hunger: -10,
      physiqueDebuff: 8,
      randomVomitCh: 0.08,
    },
    treatCost: { hospital: 15000 },
    desc: "胃溃疡长期未治愈演化成的恶性肿瘤。健康持续暴跌，食欲严重下降，偶有吐血。手术是唯一根治手段，费用高昂。",
    isEvolution: true,
    evolvesFrom: ["gastric_ulcer"],
  },

  // 抑郁 → 重度抑郁 → 自杀风险
  major_depression: {
    id: "major_depression",
    name: "重度抑郁",
    icon: "🌑",
    severity: 5,
    // [全系统自洽修复] 域A: 原 naturalCureDays 与 treatCostMonthly 并存(数据矛盾)→移除自然痊愈(慢性病需持续治疗)
    triggerHabit: { depressionCount: 2 },
    triggerChance: 0.18,
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
    triggerHabit: { coldCount: 2, highFatigueStreak: 5, healthUnder30: 2 },
    triggerChance: 0.2,
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
    triggerChance: 0.15,
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
    triggerChance: 0.22,
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
    // [全系统自洽修复] 域A: 原 naturalCureDays 与 treatCostMonthly 并存(数据矛盾)→移除自然痊愈(慢性病需持续治疗)
    triggerHabit: { insomniaCount: 1, age: 40 },
    triggerChance: 0.2,
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
    // [全系统自洽修复] 域A R245: 删除 naturalCureDays——每日2%死亡率、severity:8的致命风险不应能"自然痊愈"(A类)
    isCritical: true,
    triggerHabit: { overworkCount: 1, age: 45 },
    triggerChance: 0.12,
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
    triggerHabit: { officeWorkDays: 100, lowHygieneStreak: 15 },
    triggerChance: 0.25,
    // 细化：分级症状，久坐累积伤害
    graduatedTrigger: {
      baseChance: 0.08,
      perUnit: { officeWorkDays: 0.003 },
      maxChance: 0.4,
    },
    symptom: {
      intelligenceDebuff: 3,
      fatigue: 3,
      neckPain: true,
      dizzinessCh: 0.03,
      typingSpeedDown: true,
    },
    treatCost: { pharmacy: 80, hospital: 250, physiotherapy: 200 },
    desc: "长期伏案工作导致的颈椎劳损。脖子僵硬、头晕手麻，严重时转头都疼。做颈椎操+理疗可缓解，但根治难。",
    isOccupational: true,
    preventionHint: "每工作45分钟起来活动5分钟，做颈椎操",
  },

  // 糖尿病（新增慢性病）
  diabetes: {
    id: "diabetes",
    name: "糖尿病",
    icon: "🍬",
    severity: 5,
    isChronic: true,
    triggerHabit: { junkFoodMeals: 100, age: 45, hungerHighStreak: 40 },
    triggerChance: 0.18,
    symptom: { health: -1, hunger: 5, fatigue: 2, randomVisionBlur: 0.02 },
    treatCost: { hospital_monthly: 300 },
    desc: "长期垃圾食品+肥胖+年龄增长导致的慢性病。需要持续控制饮食+药物（按月¥300）。",
  },

  // ============================================================
  // 流感（感冒演化链）
  // 已细化：cold(感冒) → flu(流感) → pneumonia(肺炎)→ organ_failure(器官衰竭)
  // ============================================================

  flu: {
    id: "flu",
    name: "流感",
    icon: "🤒",
    severity: 3,
    naturalCureDays: [5, 10],
    triggerHabit: { coldCount: 2, highFatigueStreak: 3 },
    triggerChance: 0.2,
    // [全系统自洽修复] 域A A类#2: 补充flu的季节影响（流感冬春高发，与cold一致）
    seasonInfluence: { spring: 1.4, summer: 0.4, autumn: 0.8, winter: 1.6 },
    symptom: { health: -3, fatigue: 10, fever: true },
    treatCost: { pharmacy: 200, hospital: 500 },
    desc: "比普通感冒更严重，高烧、全身酸痛。需要休息+药物治疗。",
    evolvesTo: ["pneumonia"],
  },

  // 焦虑症（失眠相关精神类疾病）
  // 已细化：insomnia(失眠症) → severe_insomnia(重度失眠)
  //         lowHappinessStreak → anxiety(焦虑症) → depression(抑郁)

  anxiety: {
    id: "anxiety",
    name: "焦虑症",
    icon: "😰",
    severity: 3,
    naturalCureDays: [20, 40],
    triggerHabit: { lowHappinessStreak: 25, highFatigueStreak: 15 },
    triggerChance: 0.18,
    symptom: { mentalDebuff: 10, apMult: 0.15, heartRateHigh: true },
    treatCost: { hospital: 2000 },
    desc: "长期心情低落+压力过大导致的焦虑症。心跳加速、坐立不安。需要心理治疗。",
    evolvesTo: ["depression"],
  },

  fatty_liver: {
    id: "fatty_liver",
    name: "脂肪肝",
    icon: "🫘",
    severity: 3,
    isChronic: true,
    triggerHabit: { junkFoodMeals: 80, age: 35 },
    triggerChance: 0.2,
    symptom: { health: -1, fatigue: 2, liverEnzymeHigh: true },
    treatCost: { hospital_monthly: 150 },
    desc: "长期垃圾食品+缺乏运动导致的脂肪肝。慢性病，需要按月治疗（¥150/月）+ 改善生活习惯。",
    evolvesTo: ["liver_cirrhosis"],
  },

  // 腰椎间盘突出（职业病演化链）
  // 已细化：cervical_spondylosis(颈椎病·伏案职业病) + herniated_disc(腰椎·体力劳动职业病)

  herniated_disc: {
    id: "herniated_disc",
    name: "腰椎间盘突出",
    icon: "🦴",
    severity: 4,
    naturalCureDays: [30, 60],
    triggerHabit: { manualLaborDays: 250, age: 40 },
    triggerChance: 0.18,
    symptom: {
      physiqueDebuff: 8,
      fatigue: 5,
      backPain: true,
      walkingSpeedReduction: 0.2,
    },
    treatCost: { hospital: 8000 },
    desc: "长期体力劳动+年龄增长导致的腰椎间盘突出。走路变慢，弯腰困难。理疗+手术可选。",
  },

  // 肾病（慢性病演化链）
  // 已细化：gastritis(胃炎) → gastric_ulcer(胃溃疡) → stomach_cancer(胃癌)
  //         hypertension(高血压) → kidney_disease(肾病)

  kidney_disease: {
    id: "kidney_disease",
    name: "肾病",
    icon: "🫘",
    severity: 5,
    isChronic: true,
    triggerHabit: { hypertensionCount: 1, age: 45 },
    triggerChance: 0.15,
    symptom: { health: -2, fatigue: 5, kidneyFunctionLow: true },
    treatCost: { hospital_monthly: 500 },
    desc: "高血压长期未控制导致的肾病。慢性病，需要按月治疗（¥500/月）+ 定期透析。",
    evolvesTo: ["kidney_failure"],
  },

  heart_disease: {
    id: "heart_disease",
    name: "心脏病",
    icon: "💔",
    severity: 5,
    isChronic: true,
    triggerHabit: { overworkCount: 2, age: 40, hypertensionCount: 1 },
    triggerChance: 0.15,
    symptom: {
      health: -2,
      fatigue: 5,
      heartRateIrregular: true,
      randomChestPain: 0.02,
    },
    treatCost: { hospital_monthly: 400 },
    desc: "长期过劳+高血压导致的心脏病。慢性病，需要按月治疗（¥400/月）+ 避免剧烈运动。",
    evolvesTo: ["heart_attack"],
  },
  // [全系统自洽修复] 域A A类#1–3: 补充3个evolvesTo引用但缺失的疾病定义
  liver_cirrhosis: {
    id: "liver_cirrhosis",
    name: "肝硬化",
    icon: "🫁",
    severity: 5,
    // [全系统自洽修复] 域A A类#1: 删除 naturalCureDays（isChronic=true 的疾病不会自然痊愈，原字段矛盾且为死数据）
    isChronic: true,
    triggerHabit: { fattyLiverCount: 1, age: 35 },
    triggerChance: 0.18,
    symptom: { health: -3, fatigue: 4, physiqueDebuff: 5, liverEnzymeHigh: true },
    treatCost: { hospital_monthly: 300 },
    desc: "脂肪肝长期未控制发展为肝硬化。肝功能持续下降，需要按月治疗（¥300/月）。",
    isEvolution: true,
    evolvesFrom: ["fatty_liver"],
    // [全系统自洽修复] 域A A类#1: 删除 evolvesTo（慢性病不会自然演化，原字段为死数据）
  },
  kidney_failure: {
    id: "kidney_failure",
    name: "肾衰竭",
    icon: "🫘",
    severity: 6,
    // [全系统自洽修复] 域A A类#2: 删除 naturalCureDays（isChronic=true 矛盾字段）
    isChronic: true,
    triggerHabit: { kidneyDiseaseCount: 1, age: 50 }, // [全系统自洽修复] 域A A类#4: nephropathyCount→kidneyDiseaseCount
    triggerChance: 0.12,
    symptom: { health: -4, fatigue: 6, physiqueDebuff: 8, kidneyFunctionLow: true },
    treatCost: { hospital_monthly: 800 },
    desc: "肾病恶化至肾衰竭，需要定期透析或移植。按月治疗（¥800/月）。",
    isEvolution: true,
    evolvesFrom: ["kidney_disease"], // [全系统自洽修复] 域A A类#1: hypertensive_nephropathy→kidney_disease
  },
  heart_attack: {
    id: "heart_attack",
    name: "心脏病发作",
    icon: "💔",
    severity: 6,
    // [全系统自洽修复] 域A A类#3: 删除 naturalCureDays（非慢性病却含自然痊愈天数，与 treatCostMonthly 并存矛盾）
    triggerHabit: { heartDiseaseCount: 1, age: 45 }, // [全系统自洽修复] 域A A类#5: coronaryHeartDiseaseCount→heartDiseaseCount
    triggerChance: 0.1,
    symptom: { health: -5, fatigue: 8, physiqueDebuff: 10, randomChestPain: 0.05 },
    treatCost: { hospital_monthly: 600 },
    desc: "冠心病恶化导致心脏病发作。需要按月治疗（¥600/月）+ 严格避免劳累和情绪激动。",
    isEvolution: true,
    evolvesFrom: ["heart_disease"], // [全系统自洽修复] 域A A类#2: coronary_heart_disease→heart_disease
  },

  liver_cancer: {
    id: "liver_cancer",
    name: "肝癌",
    icon: "☠️",
    severity: 8,
    // [全系统自洽修复] 域A R245: 删除 naturalCureDays——肝癌 severity:8、treatCost:50000 却定义60-120天自然痊愈，与"手术是唯一可能根治的手段"严重矛盾(A类)
    isCritical: true,
    triggerHabit: { liverCirrhosisCount: 1, age: 50 },
    triggerChance: 0.12,
    symptom: { health: -6, hunger: -8, physiqueDebuff: 10, liverFailure: true },
    treatCost: { hospital: 50000 },
    desc: "脂肪肝长期未愈演化成肝癌。健康急剧下降，食欲严重丧失。手术是唯一可能根治的手段，费用极高。",
    isEvolution: true,
    evolvesFrom: ["liver_cirrhosis"], // [全系统自洽修复] 域A A类#3: fatty_liver→liver_cirrhosis 正确演化链: 脂肪肝→肝硬化→肝癌
    isCritical: true,
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
// [R105] 域A 联动增强
// [R169] 域A 联动增强
