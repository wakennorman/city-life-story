/**
 * 难度分层系统 · 配置表（阶段3 TS 规范源 · 移植自 src/js/core/difficulty_system.js）
 *
 * 设计参考：
 * - 《大多数》：心态值分级做硬失败指标，难度只调衰减速率
 * - 《中国式家长》：用经济复利成本曲线隐性加压
 * - 《This War of Mine》：用角色组合与士气分级做隐性难度
 *
 * 三/四档难度（玩家在剧本选择时选）：
 *   easy   休闲 — 适合 1-10h 玩家，先体验叙事
 *   normal 标准 — 默认值，v3.0 审查前的所有数值
 *   hard   困难 — 适合 50h+ 玩家，反向闸门全开
 *   hell   地狱 — 极限生存，只为挑战自我的硬核玩家
 *
 * 影响的参数（仅调衰减/惩罚，不调收益曲线）：
 *   dailyInterestBase      村长债日利率
 *   wealthTaxProbability   中产税触发概率
 *   eventPenaltyMultiplier 事件惩罚倍率
 *   needsDecayMultiplier   需求衰减倍率
 *   wageMultiplier         工资乘数
 *   priceMultiplier        物价乘数
 *   illnessRateMultiplier  疾病率乘数
 *   startingCashBonus      启动资金缓冲（仅休闲档）
 *
 * 本文件为「纯数据 + 类型」，无任何运行时依赖，可被 src/app 任意模块安全引入。
 */

export type DifficultyLevelId = "easy" | "normal" | "hard" | "hell";

export interface DifficultyConfig {
  level: DifficultyLevelId;
  name: string;
  icon: string;
  desc: string;
  color: string;
  dailyInterestBase: number;
  wealthTaxProbability: number;
  eventPenaltyMultiplier: number;
  needsDecayMultiplier: number;
  wageMultiplier: number;
  priceMultiplier: number;
  illnessRateMultiplier: number;
  startingCashBonus: number;
}

/**
 * 难度配置表 —— 数值与 vanilla difficulty_system.js 逐字段一致。
 * 修改此处即视为「规范源变更」，须同步 src/js 端（或经 bridge 调用本模块）。
 */
export const DIFFICULTY_LEVELS: Record<DifficultyLevelId, DifficultyConfig> = {
  easy: {
    level: "easy",
    name: "休闲",
    icon: "🍵",
    desc: "压力更小，叙事优先。物价低、工资高、疾病少、需求衰减慢。",
    color: "var(--success)",
    dailyInterestBase: 0.002, // 0.20% / 日
    wealthTaxProbability: 0.2,
    eventPenaltyMultiplier: 0.7,
    needsDecayMultiplier: 0.85,
    wageMultiplier: 1.15,
    priceMultiplier: 0.9,
    illnessRateMultiplier: 0.6,
    startingCashBonus: 500, // 休闲档给一点启动资金缓冲
  },
  normal: {
    level: "normal",
    name: "标准",
    icon: "⚖️",
    desc: "经典体验，所有 v3.0 审查前数值不变。",
    color: "var(--text-secondary)",
    dailyInterestBase: 0.0035, // 0.35% / 日（与旧版一致）
    wealthTaxProbability: 0.35,
    eventPenaltyMultiplier: 1.0,
    needsDecayMultiplier: 1.0,
    wageMultiplier: 1.0,
    priceMultiplier: 1.0,
    illnessRateMultiplier: 1.0,
    startingCashBonus: 0,
  },
  hard: {
    level: "hard",
    name: "困难",
    icon: "🔥",
    desc: "为老玩家准备。物价高、工资低、疾病多、需求衰减快、反向闸门全开。",
    color: "var(--danger)",
    dailyInterestBase: 0.005, // 0.50% / 日
    wealthTaxProbability: 0.5,
    eventPenaltyMultiplier: 1.3,
    needsDecayMultiplier: 1.15,
    wageMultiplier: 0.85,
    priceMultiplier: 1.15,
    illnessRateMultiplier: 1.5,
    startingCashBonus: 0,
  },
  hell: {
    level: "hell",
    name: "地狱",
    icon: "💀",
    desc: "极限生存。全面数值惩罚，只为挑战自我的硬核玩家。",
    color: "var(--danger)",
    dailyInterestBase: 0.007, // 0.70% / 日
    wealthTaxProbability: 0.7,
    eventPenaltyMultiplier: 1.6,
    needsDecayMultiplier: 1.4,
    wageMultiplier: 0.7,
    priceMultiplier: 1.3,
    illnessRateMultiplier: 2.0,
    startingCashBonus: 0,
  },
};

export const DEFAULT_DIFFICULTY: DifficultyLevelId = "normal";

export function isDifficultyLevelId(value: unknown): value is DifficultyLevelId {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(DIFFICULTY_LEVELS, value)
  );
}
