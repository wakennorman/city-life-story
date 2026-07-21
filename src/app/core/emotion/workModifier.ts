/**
 * 情绪对工作的修正系数 —— 纯函数 TS 规范源
 *
 * 对应 vanilla: src/js/phase1/needs.js::getEmotionWorkModifier
 * 迁移批次: 阶段3批次7
 *
 * 设计约束:
 * - 纯函数: 仅依赖入参 state.status.emotionalState + 静态映射表，无副作用
 * - 零外部依赖 (不调用 getDifficultyMultiplier/StateManager 等)，可独立单测
 * - 与 vanilla 行为严格一致: 未知/缺失状态一律回退 stable
 * - 防御性克隆返回对象，避免调用方误改共享常量
 */

export interface EmotionWorkModifier {
  /** 工资倍率 */
  pay: number;
  /** 受伤概率倍率 */
  injury: number;
  /** 技能经验倍率 */
  skillXp: number;
}

/** 各情绪状态的固定工作修正表 (与 vanilla 完全一致) */
export const EMOTION_WORK_MODIFIERS: Record<string, EmotionWorkModifier> = {
  depressed: { pay: 0.45, injury: 2.5, skillXp: 0.3 },
  sad: { pay: 0.65, injury: 1.5, skillXp: 0.5 },
  stressed: { pay: 0.8, injury: 1.3, skillXp: 0.7 },
  stable: { pay: 1.0, injury: 1.0, skillXp: 1.0 },
  happy: { pay: 1.25, injury: 0.7, skillXp: 1.5 },
  // [全系统自洽修复] 域G A类修复: 新增 elated 状态（情绪分值≥80时触发）
  elated: { pay: 1.5, injury: 0.5, skillXp: 2.0 },
};

/**
 * 取当前情绪对应的工作修正系数。
 * @param state 含 status.emotionalState 的游戏状态 (与 vanilla 契约一致: 要求 state.status 存在)
 * @returns 工作修正系数对象 (防御性克隆)
 */
export function getEmotionWorkModifier(state: {
  status: { emotionalState?: string };
}): EmotionWorkModifier {
  const emo = state.status.emotionalState || "stable";
  const mod = EMOTION_WORK_MODIFIERS[emo] || EMOTION_WORK_MODIFIERS.stable;
  return { ...mod };
}
