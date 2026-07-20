// 技能分支加成 —— 从 src/js/phase1/skill_bonuses.js::getBranch* 系忠实迁移的 TS 规范源。
//
// 设计要点:
//  1. 这 7 个函数不是叶子函数, 它们调用批次3已迁出的叶子加成函数
//     (getCookingDiscount / getTravelApReduction / getTutoringBonus / getFactoryBonus /
//      getConstructionBonus / getSalesTradeDiscount / getSalesTradePremium), 此处直接 import 复用,
//     形成 TS 侧真实依赖图, 而非重复实现。
//  2. vanilla 侧通过全局 `getTalentNodeEffects(state)` 读取天赋节点效果, 用
//     `typeof getTalentNodeEffects === "function"` 守卫。TS 侧把它改造为**可选注入依赖**
//     (talentEffects?: GetTalentNodeEffects), 默认 undefined —— 行为与原守卫完全一致
//     (undefined 时各分支回退到无天赋的基础值), 且可测性更好。
//  3. 窄 state 切片类型 BranchBonusState 只声明函数实际读取的字段, 避免耦合巨型 state 对象。
//
// vanilla 端零改动, 加载序与游戏行为不变。

import {
  getCookingDiscount,
  getTravelApReduction,
  getTutoringBonus,
  getFactoryBonus,
  getConstructionBonus,
  getSalesTradeDiscount,
  getSalesTradePremium,
} from "./skillBonuses";

/** 函数实际读取的 state 局部切片 (窄类型)。 */
export interface BranchBonusState {
  skills?: {
    cooking?: { level?: number };
    driving?: { level?: number };
    english?: { level?: number };
    electrician?: { level?: number };
    welding?: { level?: number };
    sales?: { level?: number };
  };
  skillBranches?: {
    cooking?: string;
    driving?: string;
    english?: string;
    electrician?: string;
    welding?: string;
    sales?: string;
  };
}

/** 天赋节点效果 (getTalentNodeEffects 返回值中分支加成实际读取的字段)。 */
export interface TalentNodeEffects {
  foodCostReduction?: number;
  extraApReduction?: number;
  extraDiscount?: number;
  extraPremium?: number;
}

/** 天赋节点效果读取函数 (vanilla 侧为全局 getTalentNodeEffects)。 */
export type GetTalentNodeEffects = (
  state: BranchBonusState
) => TalentNodeEffects;

/** 家常大厨分支: 烹饪成本减免, 上限 0.8。 */
export function getBranchCookingDiscount(
  state: BranchBonusState,
  talentEffects?: GetTalentNodeEffects
): number {
  const base = getCookingDiscount(state.skills?.cooking?.level || 0);
  if (!state.skillBranches || state.skillBranches.cooking !== "home_chef")
    return base;
  let reduction = 0.15; // 家常大厨基础成本减免
  const eff = talentEffects?.(state);
  reduction += eff?.foodCostReduction || 0;
  return Math.min(0.8, base + reduction);
}

/** 客运驾驶分支: 旅行AP减免 + 额外减免 (有天赋则用天赋值, 否则 +1)。 */
export function getBranchTravelApReduction(
  state: BranchBonusState,
  talentEffects?: GetTalentNodeEffects
): number {
  const base = getTravelApReduction(state.skills?.driving?.level || 0);
  if (!state.skillBranches || state.skillBranches.driving !== "passenger_transport")
    return base;
  const eff = talentEffects?.(state);
  if (eff) return base + (eff.extraApReduction || 2);
  return base + 1;
}

/** 商务英语分支: 家教加成 ×1.5。 */
export function getBranchTutoringBonus(state: BranchBonusState): number {
  const base = getTutoringBonus(state.skills?.english?.level || 0);
  if (!state.skillBranches || state.skillBranches.english !== "business_english")
    return base;
  return base * 1.5;
}

/** 强电工程分支: 工厂加成 ×2.0。 */
export function getBranchFactoryBonus(state: BranchBonusState): number {
  const base = getFactoryBonus(state.skills?.electrician?.level || 0);
  if (
    !state.skillBranches ||
    state.skillBranches.electrician !== "industrial_electric"
  )
    return base;
  return base * 2.0;
}

/** 结构焊接分支: 建筑加成 ×1.5。 */
export function getBranchConstructionBonus(state: BranchBonusState): number {
  const base = getConstructionBonus(state.skills?.welding?.level || 0);
  if (
    !state.skillBranches ||
    state.skillBranches.welding !== "structural_welding"
  )
    return base;
  return base * 1.5;
}

/** 门店销售分支: 买入折扣 +0.1 (有天赋叠加), 上限 0.25。 */
export function getBranchSalesDiscount(
  state: BranchBonusState,
  talentEffects?: GetTalentNodeEffects
): number {
  const base = getSalesTradeDiscount(state.skills?.sales?.level || 0);
  if (!state.skillBranches || state.skillBranches.sales !== "store_sales")
    return base;
  let extra = 0;
  const eff = talentEffects?.(state);
  extra = eff?.extraDiscount || 0;
  return Math.min(0.25, base + 0.1 + extra);
}

/** 商务谈判分支: 卖出溢价 +0.1 (有天赋叠加), 上限 0.25。 */
export function getBranchSalesPremium(
  state: BranchBonusState,
  talentEffects?: GetTalentNodeEffects
): number {
  const base = getSalesTradePremium(state.skills?.sales?.level || 0);
  if (!state.skillBranches || state.skillBranches.sales !== "biz_negotiation")
    return base;
  let extra = 0;
  const eff = talentEffects?.(state);
  extra = eff?.extraPremium || 0;
  return Math.min(0.25, base + 0.1 + extra);
}
