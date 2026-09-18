/**
 * scene3d · 配色板
 *
 * 色调定位：低饱和 + 暖灰底。
 *   —— 与游戏现有「奶油白暖色 UI」保持同族，但场景本身偏暗，
 *      形成「晦暗世界 + 暖色界面」的对比（这是本作既定的视觉语言）。
 *
 * 三个富裕等级各一套色，等级越高越干净、越冷、越亮；
 * 等级越低越脏、越暖、越暗。
 */

import type { WealthTier, SceneType } from "./types";

export interface ScenePalette {
  sky: string;
  fog: string;
  groundBase: string;
  road: string;
  curb: string;
  /** 建筑主色池，按序取用 */
  buildingBodies: string[];
  /** 屋顶色池 */
  buildingRoofs: string[];
  /** 窗色 */
  window: string;
  /** 点缀色池（招牌、雨棚、门头） */
  accents: string[];
  /** 植被色 */
  foliage: string[];
  /** 金属/杂项 */
  metal: string;
  /** 光照强度 */
  lightIntensity: number;
}

const TIER1: ScenePalette = {
  sky: "#b9b3a4",
  fog: "#b0a998",
  groundBase: "#8a8275",
  road: "#6f695f",
  curb: "#9c948a",
  buildingBodies: ["#9b9084", "#8d857a", "#a39889", "#877e73", "#a89c8c"],
  buildingRoofs: ["#6b6459", "#7a7266", "#5f5950"],
  window: "#4a4a48",
  accents: ["#8f6b52", "#7a6a58", "#96543f", "#6d7a5e"],
  foliage: ["#6b7a52", "#5c6b47", "#7a8459"],
  metal: "#7d7a74",
  lightIntensity: 0.62,
};

const TIER2: ScenePalette = {
  sky: "#c9c3b4",
  fog: "#c2bcac",
  groundBase: "#9b9488",
  road: "#7c766b",
  curb: "#ada79a",
  buildingBodies: ["#b3a996", "#a89d8b", "#bdb3a0", "#9e9584", "#c0b6a3"],
  buildingRoofs: ["#7d7466", "#8a8172", "#6e675b"],
  window: "#55605f",
  accents: ["#a06b4c", "#8b7355", "#a8543c", "#7d8a63"],
  foliage: ["#6f8055", "#61734a", "#7d8a5e"],
  metal: "#8b8880",
  lightIntensity: 0.72,
};

const TIER3: ScenePalette = {
  sky: "#c4cfd4",
  fog: "#c7d0d4",
  groundBase: "#a9a9a4",
  road: "#87878a",
  curb: "#bcbcb8",
  buildingBodies: ["#a9b2b8", "#98a4ad", "#bcc4c8", "#8e9aa3", "#c6ccce"],
  buildingRoofs: ["#737d84", "#828c92", "#67717a"],
  window: "#93b4c4",
  accents: ["#b07a52", "#7f9aa8", "#a85f45", "#6f8fa0"],
  foliage: ["#728a5e", "#648052", "#7f9468"],
  metal: "#9a9e9f",
  lightIntensity: 0.84,
};

const BY_TIER: Record<WealthTier, ScenePalette> = {
  1: TIER1,
  2: TIER2,
  3: TIER3,
};

export function paletteFor(tier: WealthTier): ScenePalette {
  return BY_TIER[tier] ?? TIER2;
}

/** 按类型微调：工业区偏锈色，休闲区偏绿，政务偏庄重灰 */
const TYPE_TINT: Partial<Record<SceneType, { accent?: string[]; foliage?: string[] }>> = {
  industrial: { accent: ["#8a5a3c", "#7d5a44", "#94603f"], foliage: ["#6b7350", "#5e6647"] },
  recreation: { accent: ["#9a7a4a", "#8a6a52"], foliage: ["#66804d", "#587544", "#74905a"] },
  service: { accent: ["#8a8a8a", "#7d7d80"], foliage: ["#6d7a58", "#617048"] },
  corporate: { accent: ["#7f9aa8", "#6f8fa0"], foliage: ["#6d8460", "#617a54"] },
};

export function paletteForLocation(tier: WealthTier, type: SceneType): ScenePalette {
  const base = paletteFor(tier);
  const tint = TYPE_TINT[type];
  if (!tint) return base;
  return {
    ...base,
    accents: tint.accent ?? base.accents,
    foliage: tint.foliage ?? base.foliage,
  };
}

/** 稳定伪随机：同一地点每次生成结果一致（避免每次进场景都变样） */
export function makeRng(seed: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return function next(): number {
    h ^= h << 13;
    h >>>= 0;
    h ^= h >> 17;
    h ^= h << 5;
    h >>>= 0;
    return h / 4294967296;
  };
}
