/**
 * 分类排序工具 — 逻辑规范源 (canonical logic)
 *
 * 从 src/js/core/sort_utils.js 的 sortInteractiveList / getSkillCategory
 * 逐字节对齐迁移。sortInteractiveList 为纯函数：仅依赖传入的 config + state，
 * 不读取任何模块级注册表，故可独立作为规范源。
 */

import {
  SKILL_CATEGORY_MAP,
  BUILTIN_LIST_CONFIGS,
  type SortConfig,
} from "./sortData";

export { SKILL_CATEGORY_MAP, BUILTIN_LIST_CONFIGS };
export type { SortConfig };

/** 技能 → 分类查找（约定式自动归类用） */
export function getSkillCategory(skillId: string): string {
  return SKILL_CATEGORY_MAP[skillId] || "physical";
}

function hasOwn(obj: Record<string, any>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

interface SortState {
  stats?: Record<string, Record<string, number>>;
}

/**
 * 通用多层排序
 * @param items 条目数组
 * @param config 排序配置（同 vanilla registerListType 的 config）
 * @param state 游戏状态（读取频次）
 * @returns 新排序数组（不修改入参）
 */
export function sortInteractiveList(
  items: any[] | null | undefined,
  config: SortConfig,
  state?: SortState | null
): any[] {
  if (!items || items.length === 0) return items || [];

  // 构建 categoryOrder 查找表
  const catIndex: Record<string, number> = {};
  if (config.categoryOrder) {
    for (let ci = 0; ci < config.categoryOrder.length; ci++) {
      catIndex[config.categoryOrder[ci]] = ci;
    }
  }

  // 获取频次映射
  let freq: Record<string, number> = {};
  if (config.freqMap && state && state.stats) {
    freq = state.stats[config.freqMap] || {};
  }

  const defaultPriority = config.priorityMap || {};

  const sorted = (items as any[]).slice();
  sorted.sort((a: any, b: any) => {
    // Level 1: 分类顺序
    const catA = config.getCategory ? config.getCategory(a) : "other";
    const catB = config.getCategory ? config.getCategory(b) : "other";
    const idxA = hasOwn(catIndex, catA) ? catIndex[catA] : 999;
    const idxB = hasOwn(catIndex, catB) ? catIndex[catB] : 999;
    if (idxA !== idxB) return idxA - idxB;

    // Level 2: 同类内默认优先级
    const keyA = config.getFreqKey ? config.getFreqKey(a) : a.id;
    const keyB = config.getFreqKey ? config.getFreqKey(b) : b.id;
    const priA = hasOwn(defaultPriority, keyA) ? defaultPriority[keyA] : 50;
    const priB = hasOwn(defaultPriority, keyB) ? defaultPriority[keyB] : 50;
    if (priA !== priB) return priA - priB;

    // Level 3: 交互频次（高频优先）
    const freqA = freq[keyA] || 0;
    const freqB = freq[keyB] || 0;
    if (freqA !== freqB) return freqB - freqA;

    // Level 4: 成本消耗（低消耗优先）
    if (config.getCost) {
      const costA = config.getCost(a) || 0;
      const costB = config.getCost(b) || 0;
      if (costA !== costB) return costA - costB;
    }

    // Level 5: 名称拼音（保底）
    const nameA = config.getName ? config.getName(a) : a.name || a.id || "";
    const nameB = config.getName ? config.getName(b) : b.name || b.id || "";
    return nameA.localeCompare(nameB, "zh-CN");
  });

  return sorted;
}
