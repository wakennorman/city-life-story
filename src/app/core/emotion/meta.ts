/**
 * 情绪元数据 — 图标/中文名查表（纯函数，无副作用）
 * 规范源：与 src/js/phase1/needs.js getEmotionIcon/getEmotionName 行为严格一致
 */

export const EMOTION_ICONS: Record<string, string> = {
  depressed: "😢",
  sad: "😔",
  stressed: "😰",
  stable: "😐",
  happy: "😊",
  // [全系统自洽修复] 域G A类修复: 新增 elated 状态图标
  elated: "🌟",
};

export const EMOTION_NAMES: Record<string, string> = {
  depressed: "抑郁",
  sad: "悲伤",
  stressed: "焦虑",
  stable: "平稳",
  happy: "开心",
  elated: "极佳",
};

export interface EmotionStateHolder {
  status?: { emotionalState?: string };
}

/** 获取情绪图标（未知/缺失 → 😐，与 vanilla 回退一致） */
export function getEmotionIcon(state: EmotionStateHolder): string {
  const emo = state.status?.emotionalState || "";
  return EMOTION_ICONS[emo] || "😐";
}

/** 获取情绪中文名（未知/缺失 → 未知，与 vanilla 回退一致） */
export function getEmotionName(state: EmotionStateHolder): string {
  const emo = state.status?.emotionalState || "";
  return EMOTION_NAMES[emo] || "未知";
}
