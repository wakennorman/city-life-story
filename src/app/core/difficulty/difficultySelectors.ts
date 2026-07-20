/**
 * 难度分层系统 · 纯选择器（阶段3 TS 规范源 · 移植自 src/js/core/difficulty_system.js）
 *
 * 仅含「读取配置」的纯函数，无任何副作用、不触碰 window/document/StateManager。
 * 与 vanilla 实现逐行对齐，由 tests/difficulty.canonical.test.cjs 做 TS↔vanilla 双向比对。
 */

import {
  DIFFICULTY_LEVELS,
  DEFAULT_DIFFICULTY,
  isDifficultyLevelId,
  type DifficultyConfig,
  type DifficultyLevelId,
} from "./difficultyLevels";

/** 读取某一档完整配置；非法/空 level 回退到 DEFAULT_DIFFICULTY（与 vanilla 一致）。 */
export function getDifficultyConfig(level?: string | null): DifficultyConfig {
  if (!level || !isDifficultyLevelId(level)) {
    return DIFFICULTY_LEVELS[DEFAULT_DIFFICULTY];
  }
  return DIFFICULTY_LEVELS[level];
}

export type DifficultyMultiplierKey =
  | "eventPenalty"
  | "needsDecay"
  | "wealthTaxProb"
  | "dailyInterest"
  | "wage"
  | "price"
  | "illness";

/** 只读切片：仅实际读取 _difficulty 字段，避免耦合巨型 state 对象。 */
export interface DifficultyStateSlice {
  _difficulty?: string;
}

/**
 * 热路径读取乘数：根据 state._difficulty 取对应档位的某参数乘数。
 * 未知 key / 未知 level / 空 state 一律回退 1.0（与 vanilla 一致）。
 */
export function getDifficultyMultiplier(
  state: DifficultyStateSlice | null | undefined,
  key: DifficultyMultiplierKey
): number {
  const level: DifficultyLevelId =
    (state && state._difficulty && isDifficultyLevelId(state._difficulty)
      ? state._difficulty
      : DEFAULT_DIFFICULTY);
  const cfg = DIFFICULTY_LEVELS[level];
  switch (key) {
    case "eventPenalty":
      return cfg.eventPenaltyMultiplier;
    case "needsDecay":
      return cfg.needsDecayMultiplier;
    case "wealthTaxProb":
      return cfg.wealthTaxProbability;
    case "dailyInterest":
      return cfg.dailyInterestBase;
    case "wage":
      return cfg.wageMultiplier;
    case "price":
      return cfg.priceMultiplier;
    case "illness":
      return cfg.illnessRateMultiplier;
    default:
      return 1.0;
  }
}
