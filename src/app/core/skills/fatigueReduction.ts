// 技能-疲劳减免纯逻辑（阶段3 批次6 TS 规范源）
// vanilla 参照: src/js/phase1/skill_bonuses.js::getSkillFatigueReduction
// 纯函数：输入 jobId + state，输出疲劳减少值(0/3/5/8)，无副作用、无易变内容数据依赖。

/** 工作 → 关联技能映射（与 vanilla 保持一致；稳定、非内容数据） */
export const JOB_SKILL_MAP: Record<string, string> = {
  // 烹饪相关
  street_vending_food: "cooking",
  sister_zhang_vending: "cooking",
  cafeteria_worker: "cooking",
  restaurant_assistant: "cooking",
  // 维修相关
  repair_service: "repair",
  instrument_repair: "repair",
  phone_modding: "repair",
  auto_repair: "repair",
  premium_engineering: "repair",
  // 驾驶相关
  delivery_rider: "driving",
  taxi_driver: "driving",
  truck_assistant: "driving",
  chauffeur: "driving",
  wholesale_delivery: "driving",
  package_delivery: "driving",
  // 销售相关
  shop_assistant: "sales",
  procurement_clerk: "sales",
  car_sales: "sales",
  // 编程相关
  content_writing: "coding",
  junior_analyst: "coding",
  web_designer: "coding",
  server_ops: "coding",
  network_monitor: "coding",
  // 电工相关
  factory_work_assembly: "electrician",
  factory_electrician: "electrician",
  factory_overtime: "electrician",
  // 焊接相关
  manual_labor_construction: "welding",
  steel_worker: "welding",
  // 管理相关
  project_coordinator: "management",
  training_assistant: "management",
  // 会计相关
  audit_assistant: "accounting",
};

export interface FatigueState {
  skills?: Record<string, { level?: number }>;
}

/**
 * 高技能做同领域工作疲劳更少（熟能生巧）。
 * @param jobId 工作ID
 * @param state 游戏状态（含 skills[skillKey].level）
 * @returns 疲劳减少值：大师级(>=70)→8 / 精通级(>=50)→5 / 熟练级(>=30)→3 / 否则 0
 */
export function getSkillFatigueReduction(jobId: string, state: FatigueState): number {
  const skillKey = JOB_SKILL_MAP[jobId];
  if (!skillKey) return 0;

  const skillLevel =
    (state.skills && state.skills[skillKey] && state.skills[skillKey].level) || 0;

  if (skillLevel >= 70) return 8; // 大师级：疲劳-8
  if (skillLevel >= 50) return 5; // 精通级：疲劳-5
  if (skillLevel >= 30) return 3; // 熟练级：疲劳-3
  return 0;
}
