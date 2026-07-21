/**
 * 分类排序工具 — 规范源数据表 (canonical data)
 *
 * 从 src/js/core/sort_utils.js 逐字段对齐迁移。
 * 内置列表类型配置（trade_goods / skills / stocks）的回调函数在
 * sortUtils.ts 中以等效实现复用；此处保留原始语义，供 TS 侧自包含使用。
 *
 * 注：sortInteractiveList 本身是纯函数（仅依赖传入的 config + state），
 * 不读取任何模块级注册表，因此可独立作为规范源。
 */

/** 技能 → 分类映射（约定式自动归类用） */
export const SKILL_CATEGORY_MAP: Record<string, string> = {
  cooking: "practical",
  repair: "practical",
  electrician: "practical",
  welding: "practical",
  coding: "academic",
  english: "academic",
  accounting: "academic",
  driving: "physical",
  sales: "physical",
  management: "physical",
};

/** 排序配置项类型 — 与 vanilla sortInteractiveList 期望的 config 对齐 */
export interface SortConfig {
  categoryOrder: string[];
  priorityMap: Record<string, number>;
  freqMap: string | null;
  getCategory: (item: any) => string;
  getFreqKey: (item: any) => string;
  getCost: (item: any) => number;
  getName: (item: any) => string;
}

function getSkillCategoryRef(skillId: string): string {
  return SKILL_CATEGORY_MAP[skillId] || "physical";
}

/** 内置列表类型配置（与 vanilla registerListType 三次调用逐一对应） */
export const BUILTIN_LIST_CONFIGS: Record<string, SortConfig> = {
  // 1. 交易商品列表
  trade_goods: {
    categoryOrder: [
      "food",
      "daily",
      "clothing",
      "electronics",
      "luxury",
      "scrap",
    ],
    priorityMap: {
      water: 10,
      rice: 11,
      vegetables: 12,
      fruits: 13,
      noodles: 14,
      pork: 20,
      beef: 21,
      chicken: 22,
      fish: 23,
      egg: 24,
      milk: 25,
      daily_use: 15,
    },
    freqMap: "tradeFreq",
    getCategory: (g: any) => g.category || "other",
    getFreqKey: (g: any) => g.id,
    getCost: (g: any) => g.basePrice || 0,
    getName: (g: any) => g.name || g.id,
  },

  // 2. 技能列表
  skills: {
    categoryOrder: ["practical", "academic", "physical"],
    priorityMap: {
      cooking: 10,
      repair: 15,
      coding: 20,
      driving: 25,
      english: 30,
      accounting: 35,
      electrician: 40,
      management: 45,
      sales: 50,
      welding: 55,
    },
    freqMap: "trainFreq",
    getCategory: (s: any) => getSkillCategoryRef(s.id),
    getFreqKey: (s: any) => s.id,
    getCost: (_s: any) => 15,
    getName: (s: any) => s.name || s.id,
  },

  // 3. 投资股票列表（股票子标签内）
  stocks: {
    categoryOrder: ["科技", "新能源", "消费", "金融", "房地产", "医药"],
    priorityMap: {},
    freqMap: "investFreq",
    getCategory: (s: any) => s.industry || "其他",
    getFreqKey: (s: any) => s.symbol,
    getCost: (s: any) => s.basePrice || 0,
    getName: (s: any) => s.symbol,
  },
};
