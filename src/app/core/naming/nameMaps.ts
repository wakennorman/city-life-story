/**
 * [阶段3 TS 规范源] 命名映射纯函数族
 * 忠实移植自 src/js/phase1/skill_bonuses.js (getSkillTierName / getSkillChineseName / getStatChineseName)
 * 零 state / window 依赖，纯映射。vanilla 端保持原样运行（加载序不变）。
 */

export type SkillKey =
  | "cooking"
  | "repair"
  | "coding"
  | "english"
  | "driving"
  | "sales"
  | "management"
  | "accounting"
  | "electrician"
  | "welding";

export type StatKey =
  | "physique"
  | "intelligence"
  | "agility"
  | "mental"
  | "health"
  | "hunger"
  | "fatigue"
  | "hygiene"
  | "happiness"
  | "fame";

const SKILL_NAMES: Record<string, string> = {
  cooking: "烹饪",
  repair: "维修",
  coding: "编程",
  english: "英语",
  driving: "驾驶",
  sales: "销售",
  management: "管理",
  accounting: "会计",
  electrician: "电工",
  welding: "焊接",
};

const STAT_NAMES: Record<string, string> = {
  physique: "体质",
  intelligence: "智力",
  agility: "敏捷",
  mental: "心智",
  health: "健康",
  hunger: "饱食度",
  fatigue: "疲劳",
  hygiene: "卫生",
  happiness: "心情",
  fame: "名气",
};

/**
 * 技能层级称号(C→F)，0级返回空字符串
 */
export function getSkillTierName(level: number): string {
  if (level >= 100) return "👑 超凡入圣";
  if (level >= 70) return "🌟 一代宗师";
  if (level >= 50) return "💎 出神入化";
  if (level >= 30) return "⭐ 炉火纯青";
  if (level >= 10) return "📈 初窥门径";
  return "";
}

/** 获取技能中文名，未知 key 回退到原 key */
export function getSkillChineseName(skillKey: string): string {
  return SKILL_NAMES[skillKey] || skillKey;
}

/** 获取属性中文名，未知 key 回退到原 key */
export function getStatChineseName(key: string): string {
  return STAT_NAMES[key] || key;
}
