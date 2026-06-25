export type CityServiceCategory = "medical" | "legal" | "travel";

export interface CityServiceAction {
  id: string;
  category: CityServiceCategory;
  title: string;
  icon: string;
  locationIds: string[];
  cost: number;
  apCost: number;
  brief: string;
  stateEffects: string[];
  followUps: string[];
  feedback: string;
  designReason: string;
}

export const CITY_SERVICE_ACTIONS: CityServiceAction[] = [
  {
    id: "labor_dispute_precheck",
    category: "legal",
    title: "劳动争议预检",
    icon: "⚖️",
    locationIds: ["gov_office"],
    cost: 120,
    apCost: 5,
    brief: "把欠薪、裁员、合同风险先做一次材料预检。",
    stateEffects: ["legal.prepScore +1", "_webApp.cityServices.legalPrep +1", "happiness +2"],
    followUps: ["次日获得 caseConfidence +5", "后续劳动纠纷可读取材料准备度"],
    feedback: "办事大厅窗口帮你理了一遍材料，之后打劳动官司更有底。",
    designReason: "把 Papers, Please 式制度压力转成低成本预防行动，降低法律系统入口门槛。",
  },
  {
    id: "insurance_bill_review",
    category: "medical",
    title: "医保账单复核",
    icon: "🪪",
    locationIds: ["hospital"],
    cost: 30,
    apCost: 3,
    brief: "让医院医保窗口复核治疗账单，已参保时可能追回报销差额。",
    stateEffects: ["medical.billingReviews +1", "insured: cash +refund", "uninsured: consultVoucher +1"],
    followUps: ["次日获得 costAwareness +1", "多次复核可扩展为医保/商业保险建议链"],
    feedback: "医保窗口帮你重新算了一遍账，医疗支出不再是一笔糊涂账。",
    designReason: "把真实医保的报销、复核、保障感转成玩家能主动执行的医疗经济动作。",
  },
  {
    id: "weekend_micro_trip",
    category: "travel",
    title: "周末城市微旅行",
    icon: "🚌",
    locationIds: ["commercialDist", "park"],
    cost: 180,
    apCost: 12,
    brief: "不离开本城，坐一日公交线走完老街、公园和夜市。",
    stateEffects: ["travel.dayTrips +1", "happiness +16", "fatigue -6", "souvenir +城市漫游手账"],
    followUps: ["次日获得 localFamiliarity +1", "后续可解锁城市熟悉度相关地点/NPC"],
    feedback: "你花一天在城市里绕了一圈，发现生活并不只有工作和还债。",
    designReason: "用低成本旅行验证城市生活、心理恢复、收藏反馈的联动。",
  },
];

export function actionsForLocation(locationId: string): CityServiceAction[] {
  return CITY_SERVICE_ACTIONS.filter((action) => action.locationIds.includes(locationId));
}
