/**
 * 每日需求衰减 — 纯逻辑 TS 规范源
 *
 * 从 src/js/phase1/needs.js::applyNeedsDecay 提取纯计算核心。
 * vanilla 端零改动、加载序不变；本文件为权威实现 + 双向比对测试保真。
 *
 * 关键：衰减计算本身不守卫 NaN（依赖 getNeedsDecayMultiplier 的前置钳制），
 * 因此 computeNeedsDecay 严格 1:1 复刻 vanilla，不额外加防护，保证等价。
 */

export interface NeedsState {
  hunger?: number;
  hygiene?: number;
  happiness?: number;
  fatigue?: number;
  [key: string]: number | undefined;
}

export type DifficultyMultiplierFn = (state: unknown, key: string) => number;

/**
 * 计算需求衰减难度乘数（1:1 复刻 vanilla applyNeedsDecay 9-15 行）
 * - 优先用注入的 getDifficultyMultiplier(state, "needsDecay")
 * - 守卫非有限值 → 1.0
 * - 钳制到 [0.1, 5.0]
 */
export function getNeedsDecayMultiplier(
  state: unknown,
  getDifficultyMultiplier?: DifficultyMultiplierFn,
): number {
  let decayMul =
    typeof getDifficultyMultiplier === "function"
      ? getDifficultyMultiplier(state, "needsDecay")
      : 1.0;
  if (!isFinite(decayMul) || isNaN(decayMul)) decayMul = 1.0;
  decayMul = Math.max(0.1, Math.min(5.0, decayMul));
  return decayMul;
}

/**
 * 计算衰减后的 needs（1:1 复刻 vanilla applyNeedsDecay 16-27 行）
 * - 饥饱 -13*mul、卫生 -7*mul、心情 -4*mul，各自钳制 [0,100]
 * - 不改输入，返回新对象（fatigue 由 endDay 睡眠单独处理，不含在内）
 */
export function computeNeedsDecay(
  needs: NeedsState,
  decayMul: number,
): NeedsState {
  return {
    hunger: Math.max(0, Math.min(100, (needs.hunger || 0) - Math.round(13 * decayMul))),
    hygiene: Math.max(0, Math.min(100, (needs.hygiene || 0) - Math.round(7 * decayMul))),
    happiness: Math.max(0, Math.min(100, (needs.happiness || 0) - Math.round(4 * decayMul))),
  };
}
