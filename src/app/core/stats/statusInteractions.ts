/**
 * 状态互联系统 — 有效属性 / AP消耗倍率 纯函数（TS 规范源）
 *
 * 从 src/js/phase1/interactions.js 的 getEffectiveStats / getApCostMultiplier 提取。
 * 纯函数：静态阈值逻辑 + 仅可选依赖 getIllnessAttrDebuffs（illnessDebuffs 注入参数）。
 * 无副作用、无易变内容数据依赖，src/js 端零改动、加载序不变。
 *
 * 设计参考: The Sims需求轮盘 / This War of Mine状态惩罚 / RimWorld意识系统 / 大多数生存联动
 */

/** 状态互联系统读取的最小 state 形状（字段均为游戏内已初始化数值） */
export interface StatusInteractionState {
  needs: {
    hunger: number;
    fatigue: number;
    hygiene: number;
    happiness: number;
    [key: string]: number | undefined;
  };
  status: {
    health: number;
    sick: boolean;
    injured: boolean;
    [key: string]: unknown;
  };
  player: {
    physique: number;
    intelligence: number;
    agility: number;
    mental: number;
    [key: string]: number | undefined;
  };
  weather?: { current?: string };
  [key: string]: unknown;
}

/** 命名疾病属性 debuff 注入器（可选，替代 vanilla 的全局 getIllnessAttrDebuffs） */
export type IllnessAttrDebuffs = (state: StatusInteractionState) => {
  physique?: number;
  intelligence?: number;
  agility?: number;
  mental?: number;
  apMult?: number;
};

export interface EffectiveStats {
  physique: number;
  intelligence: number;
  agility: number;
  mental: number;
  multipliers: {
    physique: number;
    intelligence: number;
    agility: number;
    mental: number;
  };
}

const clamp = (v: number): number => Math.max(0.3, v);

/** 获取经状态修正后的有效属性值（工作时、技能判定时使用） */
export function getEffectiveStats(
  state: StatusInteractionState,
  illnessDebuffs?: IllnessAttrDebuffs,
): EffectiveStats {
  const n = state.needs,
    st = state.status,
    p = state.player;
  const mult = { physique: 1.0, intelligence: 1.0, agility: 1.0, mental: 1.0 };

  // === 饥饿影响（饿得没力气/脑子转不动） ===
  if (n.hunger < 30) {
    mult.agility *= 0.85;
    mult.mental *= 0.9;
  }
  if (n.hunger < 15) {
    mult.agility *= 0.75;
    mult.mental *= 0.8;
    mult.physique *= 0.85;
  }
  if (n.hunger < 5) {
    mult.agility *= 0.5;
    mult.mental *= 0.5;
    mult.physique *= 0.6;
  }

  // === 疲劳影响 ===
  if (n.fatigue > 70) {
    mult.agility *= 0.85;
    mult.mental *= 0.9;
  }
  if (n.fatigue > 85) {
    mult.agility *= 0.7;
    mult.mental *= 0.75;
    mult.physique *= 0.85;
  }
  if (n.fatigue > 95) {
    mult.agility *= 0.5;
    mult.mental *= 0.5;
    mult.physique *= 0.7;
  }

  // === 健康影响 ===
  if (st.health < 50) {
    mult.physique *= 0.85;
  }
  if (st.health < 30) {
    mult.physique *= 0.7;
    mult.agility *= 0.85;
  }
  if (st.health < 15) {
    mult.physique *= 0.5;
    mult.agility *= 0.7;
    mult.intelligence *= 0.85;
  }

  // === 心情影响 ===
  if (n.happiness < 20) {
    mult.mental *= 0.8;
    mult.intelligence *= 0.9;
  }
  if (n.happiness < 10) {
    mult.mental *= 0.6;
    mult.intelligence *= 0.8;
  }

  // === 生病/受伤 ===
  if (st.sick) {
    mult.physique *= 0.85;
    mult.agility *= 0.9;
    mult.mental *= 0.9;
  }
  if (st.injured) {
    mult.physique *= 0.75;
    mult.agility *= 0.7;
  }

  // === 命名疾病额外属性 debuff（illnessDebuffs 注入；vanilla 为可选全局 getIllnessAttrDebuffs）===
  if (illnessDebuffs) {
    const ad = illnessDebuffs(state);
    // ad.physique 等是"扣多少有效点数"，转为乘数：扣10点≈打0.9折
    if (ad.physique) mult.physique *= Math.max(0.3, 1 - ad.physique / 100);
    if (ad.intelligence)
      mult.intelligence *= Math.max(0.3, 1 - ad.intelligence / 100);
    if (ad.agility) mult.agility *= Math.max(0.3, 1 - ad.agility / 100);
    if (ad.mental) mult.mental *= Math.max(0.3, 1 - ad.mental / 100);
  }

  // === 高基础属性正向反馈（好体魄抗压） ===
  if (p.agility > 50) mult.agility *= 1.05;
  if (p.mental > 50) mult.mental *= 1.05;
  if (p.physique > 60) mult.physique *= 1.03;

  // === 基础属性内部互动 ===
  if (p.physique > 50) mult.agility *= 1.03; // 体质好→行动更敏捷
  if (p.mental > 50) mult.intelligence *= 1.03; // 心智强→思考更清晰
  if (p.intelligence > 50) mult.mental *= 1.02; // 智商高→情绪调节更好

  // 计算有效值（保底30%）
  return {
    physique: Math.round(p.physique * clamp(mult.physique)),
    intelligence: Math.round(p.intelligence * clamp(mult.intelligence)),
    agility: Math.round(p.agility * clamp(mult.agility)),
    mental: Math.round(p.mental * clamp(mult.mental)),
    multipliers: mult,
  };
}

/** 获取当前AP消耗倍率（影响所有 consumeAP 调用的实际消耗） */
export function getApCostMultiplier(
  state: StatusInteractionState,
  illnessDebuffs?: IllnessAttrDebuffs,
): number {
  const n = state.needs,
    st = state.status,
    p = state.player;
  let mult = 1.0;

  // === 负面状态增加AP消耗 ===
  if (n.fatigue > 70) mult += 0.2;
  if (n.fatigue > 85) mult += 0.25; // 累计+0.45
  if (n.fatigue > 95) mult += 0.35; // 累计+0.8

  if (n.hunger < 20) mult += 0.3;
  if (n.hunger < 10) mult += 0.2; // 累计+0.5

  if (st.sick) mult += 0.5;
  if (st.injured) mult += 0.3;

  if (n.happiness < 15) mult += 0.2;

  // === 命名疾病额外 AP 倍率（illnessDebuffs 注入；vanilla 为可选全局 getIllnessAttrDebuffs）===
  if (illnessDebuffs) {
    const ad = illnessDebuffs(state);
    if (ad.apMult) mult += ad.apMult;
  }

  // === 天气影响AP ===
  if (state.weather) {
    const w = state.weather.current;
    if (w === "heatwave" || w === "coldwave") mult += 0.2;
    if (w === "storm" || w === "snow") mult += 0.15;
  }

  // === 高敏捷减免（身体灵活→做事高效） ===
  if (p.agility > 50) mult -= 0.1;
  if (p.agility > 75) mult -= 0.1; // 累计-0.2

  // === 保底：AP消耗至少为原始的50%，最多为250% ===
  return Math.max(0.5, Math.min(2.5, mult));
}
