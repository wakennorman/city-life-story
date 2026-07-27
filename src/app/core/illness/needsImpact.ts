// 阶段3批次11 — 疾病需求影响纯函数（迁自 src/js/phase1/illness.js:getIllnessNeedsImpact）
// 纯逻辑：累计所有疾病症状对 needs/health 的每日影响。无副作用。
// ILLNESSES 配置以注入参数传入（与 illnessDebuffs/talentEffects 同一依赖注入模式），
// 避免 513 行疾病数据双源；vanilla 端由全局 ILLNESSES 提供，TS 端由调用方注入同一份。

export interface IllnessSymptom {
  hunger?: number;
  fatigue?: number;
  hygiene?: number;
  happiness?: number;
  health?: number;
  physiqueDebuff?: number;
  intelligenceDebuff?: number;
  agilityDebuff?: number;
  mentalDebuff?: number;
  apMult?: number;
  fatigueRecoveryMult?: number;
  [k: string]: unknown;
}

export interface IllnessDef {
  id: string;
  symptom?: IllnessSymptom;
  [k: string]: unknown;
}

export interface IllnessesConfig {
  [id: string]: IllnessDef;
}

export interface NeedsImpact {
  hunger: number;
  fatigue: number;
  hygiene: number;
  happiness: number;
  health: number;
}

export interface IllnessState {
  status?: {
    illnesses?: Array<{ id: string }>;
  };
}

/**
 * 累计所有疾病症状对 needs/health 的每日影响。
 * @param state 游戏状态（需含 status.illnesses）
 * @param illnessesConfig 疾病定义表（ILLNESSES）。注入式，默认空表 -> 零影响
 */
export function getIllnessNeedsImpact(
  state: IllnessState,
  illnessesConfig: IllnessesConfig
): NeedsImpact {
  const impact: NeedsImpact = { hunger: 0, fatigue: 0, hygiene: 0, happiness: 0, health: 0 };
  if (!state.status) return impact;
  const illnesses = state.status.illnesses;
  if (!illnesses) return impact;
  for (let i = 0; i < illnesses.length; i++) {
    const ill = illnessesConfig[illnesses[i].id];
    if (!ill || !ill.symptom) continue;
    if (ill.symptom.hunger) impact.hunger += ill.symptom.hunger;
    if (ill.symptom.fatigue) impact.fatigue += ill.symptom.fatigue;
    if (ill.symptom.hygiene) impact.hygiene += ill.symptom.hygiene;
    if (ill.symptom.happiness) impact.happiness += ill.symptom.happiness;
    if (ill.symptom.health) impact.health += ill.symptom.health;
  }
  return impact;
}
