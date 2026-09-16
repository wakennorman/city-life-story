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
 * 社交支持心情缓冲（1:1 复刻 vanilla applyNeedsDecay 26-35 行）
 *
 * [同步 · 2026-09-15] 原端口缺失这一段，导致 happiness 衰减与运行时不一致：
 *   vanilla 后加了「高好感 NPC 减轻心情衰减」（域D→G 联动增强），
 *   且 happiness 衰减有 `Math.max(1, ...)` 最低 1 点下限。
 *   本端口当时只写了 `-Math.round(4 * decayMul)`，两者都缺。
 *   实测偏差：decayMul=0.1 时 vanilla 掉 1 点、端口掉 0 点（36 项比对失败）。
 *
 * 规则：每有一个「已见过 且 好感 ≥50」的 NPC，减 0.5 点衰减，最多减 2 点。
 */
export interface RelationshipLike {
  met?: boolean;
  affinity?: number;
}

export function computeSocialSupportBonus(
  relationships?: Record<string, RelationshipLike | undefined>,
): number {
  let support = 0;
  if (relationships) {
    for (const key in relationships) {
      const r = relationships[key];
      if (r && r.met && (r.affinity || 0) >= 50) support++;
    }
  }
  return Math.min(2, support * 0.5); // 每个高好感 NPC 减 0.5 衰减，最多 -2
}

/**
 * 计算衰减后的 needs（1:1 复刻 vanilla applyNeedsDecay 16-39 行）
 * - 饥饱 -13*mul、卫生 -7*mul，各自钳制 [0,100]
 * - 心情 -(max(1, 4*mul - socialBonus))，钳制 [0,100]
 *   → 注意 `Math.max(1, ...)` 是最低 1 点下限；`Math.round` 包在最外层
 * - 不改输入，返回新对象（fatigue 由 endDay 睡眠单独处理，不含在内）
 *
 * @param socialBonus 由 computeSocialSupportBonus(state.relationships) 得到；默认 0
 */
export function computeNeedsDecay(
  needs: NeedsState,
  decayMul: number,
  socialBonus: number = 0,
): NeedsState {
  return {
    hunger: Math.max(0, Math.min(100, (needs.hunger || 0) - Math.round(13 * decayMul))),
    hygiene: Math.max(0, Math.min(100, (needs.hygiene || 0) - Math.round(7 * decayMul))),
    happiness: Math.max(
      0,
      Math.min(100, (needs.happiness || 0) - Math.round(Math.max(1, 4 * decayMul - socialBonus))),
    ),
  };
}
