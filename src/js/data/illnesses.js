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
    triggerHabit: { lowHygieneStreak: 5 },
    triggerChance: 0.6,
    symptom: { health: -1, fatigue: 5 },
    treatCost: { pharmacy: 80, hospital: 300 },
    desc: "鼻塞咳嗽，没力气干活。卫生不好就容易着凉。",
  },
  stomach_inflammation: {
    id: "stomach_inflammation",
    name: "肠胃炎",
    icon: "🤢",
    severity: 2,
    naturalCureDays: [5, 8],
    triggerHabit: { junkFoodMeals: 10 },
    triggerChance: 0.5,
    symptom: { health: -2, hunger: -3 },
    treatCost: { pharmacy: 150, hospital: 600 },
    desc: "肚子绞痛、拉肚子，吃啥都没胃口。垃圾食品吃多了。",
  },
  malnutrition: {
    id: "malnutrition",
    name: "营养不良",
    icon: "💀",
    severity: 2,
    naturalCureDays: [10, 15],
    triggerHabit: { lowHungerStreak: 8 },
    triggerChance: 0.55,
    symptom: { physiqueDebuff: 5, fatigue: 3 },
    treatCost: { pharmacy: 200, hospital: 800 },
    requiresNutrition: true,
    desc: "脸黄面瘦，气血两亏。需要营养餐+治疗双管齐下。",
  },
  insomnia: {
    id: "insomnia",
    name: "失眠症",
    icon: "🌙",
    severity: 2,
    naturalCureDays: [10, 20],
    triggerHabit: { lateNightActions: 8 },
    triggerChance: 0.45,
    symptom: { fatigueRecoveryMult: 0.6, mentalDebuff: 5 },
    treatCost: { pharmacy: 100, hospital: 400 },
    desc: "翻来覆去睡不着，第二天精神涣散。夜生活太多。",
  },
  skin_infection: {
    id: "skin_infection",
    name: "皮肤感染",
    icon: "🦠",
    severity: 1,
    naturalCureDays: [4, 7],
    triggerHabit: { lowHygieneStreak: 8 },
    triggerChance: 0.5,
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
    triggerHabit: { highFatigueStreak: 6 },
    triggerChance: 0.5,
    symptom: { mentalDebuff: 8, fatigue: 5, apMult: 0.15 },
    treatCost: { hospital: 1200 },
    desc: "头晕乏力、注意力涣散，做啥效率都低。该停下来歇歇了。",
  },
  depression: {
    id: "depression",
    name: "抑郁倾向",
    icon: "🌧️",
    severity: 3,
    naturalCureDays: [15, 30],
    triggerHabit: { lowHappinessStreak: 10 },
    triggerChance: 0.4,
    symptom: { mentalDebuff: 15, apMult: 0.2, happiness: -3 },
    treatCost: { hospital: 1500 },
    desc: "什么都没意思，连床都不想下。走出来需要时间和帮助。",
  },

  // ========== 慢性进阶疾病 ==========
  gastritis: {
    id: "gastritis",
    name: "胃溃疡",
    icon: "🩸",
    severity: 4,
    naturalCureDays: [20, 40],
    triggerHabit: { stomach_inflammationCount: 3 },
    triggerChance: 0.5,
    symptom: { health: -3, hunger: -5, physiqueDebuff: 4 },
    treatCost: { hospital: 3000 },
    desc: "肠胃炎反复拖出来的慢性病。烧心反酸不停。",
  },
  hypertension: {
    id: "hypertension",
    name: "高血压",
    icon: "💢",
    severity: 4,
    isChronic: true,
    triggerHabit: { junkFoodMeals: 50, age: 35 },
    triggerChance: 0.5,
    symptom: { physiqueDebuff: 10, randomFaintCh: 0.005 },
    treatCost: { hospital_monthly: 200 },
    desc: "慢性病，需要持续吃药控制（按月¥200），不吃血压飙高有概率晕厥。",
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
