/**
 * 技能 → 系统加成映射（纯函数规范源）
 *
 * 从 src/js/phase1/skill_bonuses.js 的叶子纯函数迁来（批次3）。
 * 每个函数输入技能等级(number)，输出对应游戏系统的加成(number)。
 * 不读取 state、不触碰 window/document，便于独立测试与逐步 TS 化。
 *
 * 设计理念：每项技能不仅解锁工作，还对相关系统产生渐进式加成，
 * 让技能培养有持续正反馈，形成"学以致用"的良性循环。
 */

/** cooking技能 → 自己做饭折扣（技能越高做饭越划算）
 * 自己做饭花费 = 基础花费 * (1 - cookingLevel * 0.008)
 * level 0: 全额, level 50: 6折, level 100: 2折（最低保底3折）
 */
export function getCookingDiscount(cookingLevel: number): number {
  return Math.min(0.7, cookingLevel * 0.008);
}

/** driving技能 → 旅行AP减免（每20级减1AP，最多减5AP） */
export function getTravelApReduction(drivingLevel: number): number {
  return Math.min(5, Math.floor(drivingLevel / 20));
}

/** english技能 → 家教额外收入加成 */
export function getTutoringBonus(englishLevel: number): number {
  return englishLevel * 0.3;
}

/** accounting技能 → 银行利率加成
 * 每年最多+5%，折算到每日；避免把年化加成误当成日息导致资金指数膨胀。
 */
export function getBankRateBonus(accountingLevel: number): number {
  return Math.min(0.05, accountingLevel * 0.0005) / 365;
}

/** electrician技能 → 工厂类工作收入加成百分比 */
export function getFactoryBonus(electricianLevel: number): number {
  return electricianLevel * 0.005;
}

/** welding技能 → 建筑类工作收入加成百分比 */
export function getConstructionBonus(weldingLevel: number): number {
  return weldingLevel * 0.008;
}

/** coding技能 → 职场能力加成（每10级+2点ability） */
export function getCorpAbilityBonus(codingLevel: number): number {
  return Math.floor(codingLevel / 10) * 2;
}

/** management技能 → 职场向上管理加成（每10级+1点upwardMgmt） */
export function getCorpUpwardBonus(managementLevel: number): number {
  return Math.floor(managementLevel / 10) * 1;
}

/** repair技能 → 装备/工具效果加成（百分比） */
export function getRepairBonus(repairLevel: number): number {
  return repairLevel * 0.005;
}

/** sales技能 → 交易买入折扣（最高15%） */
export function getSalesTradeDiscount(salesLevel: number): number {
  return Math.min(0.15, salesLevel * 0.002);
}

/** sales技能 → 交易卖出溢价（最高15%） */
export function getSalesTradePremium(salesLevel: number): number {
  return Math.min(0.15, salesLevel * 0.002);
}
