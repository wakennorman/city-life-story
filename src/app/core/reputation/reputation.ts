/**
 * 街坊声望系统 — 纯逻辑 TS 规范源
 *
 * 从 src/js/phase1/reputation.js (1-68行) 迁移的 5 个纯函数：
 *   getReputation / getRepLevel / getRepTitle / getRepDesc / getRepPayMultiplier
 * 全部基于静态配置 REPUTATION_LEVELS / REPUTATION_BONUS + state.reputation[locKey]，
 * 无副作用、无易变内容数据依赖、与 vanilla 行为严格一致。
 *
 * 迁移模式：vanilla 端零改动（加载序不变），此文件为规范源；
 * 双向比对单测见 tests/reputation.canonical.test.cjs（esbuild+vm）。
 */

/** 声望等级配置：level 0=新面孔 → 5=一方之霸 */
export const REPUTATION_LEVELS: ReadonlyArray<{ min: number; title: string; desc: string }> = [
  { min: 0, title: "新面孔", desc: "没人认识你" },
  { min: 10, title: "熟客", desc: "摊主开始记得你的脸" },
  { min: 25, title: "老熟人", desc: "见面会打招呼聊天" },
  { min: 50, title: "街坊", desc: "你是这条街自己人" },
  { min: 75, title: "地头蛇", desc: "你有面子，说话好使" },
  { min: 90, title: "一方之霸", desc: "这条街你说了算" },
];

/** 声望加成曲线（与等级下标对齐） */
export const REPUTATION_BONUS: ReadonlyArray<number> = [0, 0.03, 0.07, 0.12, 0.18, 0.25];

export interface ReputationState {
  reputation?: Record<string, number>;
}

/**
 * 获取声望数值 (0-100)，clamp 到 [0,100]
 * 地点不存在或 state.reputation 缺失时返回 0
 */
export function getReputation(state: ReputationState, locKey: string): number {
  if (!state.reputation || !state.reputation[locKey]) return 0;
  const v = state.reputation[locKey];
  if (v < 0) return 0;
  if (v > 100) return 100;
  return v;
}

/**
 * 获取声望等级 (0-5)
 * 从最高等级向下找第一个满足 min 门槛的等级
 */
export function getRepLevel(state: ReputationState, locKey: string): number {
  const rep = getReputation(state, locKey);
  for (let i = REPUTATION_LEVELS.length - 1; i >= 0; i--) {
    if (rep >= REPUTATION_LEVELS[i].min) return i;
  }
  return 0;
}

/** 获取声望称号 */
export function getRepTitle(state: ReputationState, locKey: string): string {
  const level = getRepLevel(state, locKey);
  return REPUTATION_LEVELS[level].title;
}

/** 获取声望描述 */
export function getRepDesc(state: ReputationState, locKey: string): string {
  const level = getRepLevel(state, locKey);
  return REPUTATION_LEVELS[level].desc;
}

/** 获取声望薪资加成倍率 (1.0 = 无加成) */
export function getRepPayMultiplier(state: ReputationState, locKey: string): number {
  const level = getRepLevel(state, locKey);
  return 1.0 + (REPUTATION_BONUS[level] || 0);
}
