export type CityServiceCategory =
  "medical" | "legal" | "travel" | "financial" | "social" | "health";

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
  unlockCondition?: string;
}

export const CITY_SERVICE_ACTIONS: CityServiceAction[] = [
  // === 原基础 3 个服务 ===
  {
    id: "labor_dispute_precheck",
    category: "legal",
    title: "劳动争议预检",
    icon: "⚖️",
    locationIds: ["gov_office"],
    cost: 120,
    apCost: 5,
    brief: "把欠薪、裁员、合同风险先做一次材料预检。",
    stateEffects: [
      "legal.prepScore +1",
      "_webApp.cityServices.legalPrep +1",
      "happiness +2",
    ],
    followUps: ["次日获得 caseConfidence +5", "后续劳动纠纷可读取材料准备度"],
    feedback: "办事大厅窗口帮你理了一遍材料，之后打劳动官司更有底。",
    designReason:
      "把 Papers, Please 式制度压力转成低成本预防行动，降低法律系统入口门槛。",
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
    stateEffects: [
      "medical.billingReviews +1",
      "insured: cash +refund",
      "uninsured: consultVoucher +1",
    ],
    followUps: [
      "次日获得 costAwareness +1",
      "多次复核可扩展为医保/商业保险建议链",
    ],
    feedback: "医保窗口帮你重新算了一遍账，医疗支出不再是一笔糊涂账。",
    designReason:
      "把真实医保的报销、复核、保障感转成玩家能主动执行的医疗经济动作。",
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
    stateEffects: [
      "travel.dayTrips +1",
      "happiness +16",
      "fatigue -6",
      "souvenir +城市漫游手账",
    ],
    followUps: [
      "次日获得 localFamiliarity +1",
      "后续可解锁城市熟悉度相关地点/NPC",
    ],
    feedback: "你花一天在城市里绕了一圈，发现生活并不只有工作和还债。",
    designReason: "用低成本旅行验证城市生活、心理恢复、收藏反馈的联动。",
  },

  // === v3.8 新增服务：金融 ===
  {
    id: "social_security_query",
    category: "financial",
    title: "社保缴纳查询",
    icon: "🏛️",
    locationIds: ["gov_office"],
    cost: 0,
    apCost: 3,
    brief: "查询社保缴纳记录，了解医保/养老/失业累计情况。",
    stateEffects: ["flags._socialCredit +1", "fame +1"],
    followUps: ["累计查询 3 次解锁社保卡激活选项", "可作为贷款信用佐证"],
    feedback: "工作人员打印了你的社保缴费明细，这几年没白干。",
    designReason: "让社保不只是抽象概念，而是玩家可追踪的社会信用资产。",
    unlockCondition: "phase >= 'street'",
  },
  {
    id: "credit_report_query",
    category: "financial",
    title: "个人信用报告",
    icon: "📊",
    locationIds: ["bank"],
    cost: 20,
    apCost: 3,
    brief: "查询个人征信报告，了解贷款资格和利率信息。",
    stateEffects: ["flags._creditChecked +1", "解锁贷款利率信息"],
    followUps: ["知晓自己能否贷款做生意", "信用良好时可获得更低利率"],
    feedback: "征信报告显示你的信用记录良好，银行愿意给你更好的贷款条件。",
    designReason: "用个人信用系统打通银行贷款、创业融资和住房贷款的信息链。",
    unlockCondition: "resources.cash >= 20",
  },
  {
    id: "housing_fund_query",
    category: "financial",
    title: "公积金提取咨询",
    icon: "💰",
    locationIds: ["gov_office"],
    cost: 0,
    apCost: 2,
    brief: "咨询住房公积金提取条件和流程，为买房做准备。",
    stateEffects: ["flags._housingFundChecked +1"],
    followUps: ["了解公积金贷款额度", "后续购房时可使用公积金贷款"],
    feedback: "你了解了公积金提取政策，发现存的钱比想象中多。",
    designReason: "住房是核心经济目标，公积金是连接工作与住房的重要桥梁。",
    unlockCondition: "player.day >= 30",
  },

  // === v3.8 新增服务：健康 ===
  {
    id: "community_health_check",
    category: "health",
    title: "社区免费体检",
    icon: "🏥",
    locationIds: ["hospital", "park"],
    cost: 0,
    apCost: 4,
    brief: "社区组织的免费基础体检，了解身体状况。",
    stateEffects: ["flags._healthChecked +1", "health +2", "happiness +1"],
    followUps: ["体检异常时可转介到医院深度检查", "年度定期体检降低大病概率"],
    feedback: "体检结果显示你总体健康，但医生提醒要注意休息和饮食。",
    designReason: "低成本健康检查入口，降低医疗系统门槛，预防大于治疗。",
    unlockCondition: "day % 30 === 0 || !flags._healthChecked",
  },
];

export function actionsForLocation(locationId: string): CityServiceAction[] {
  return CITY_SERVICE_ACTIONS.filter((action) =>
    action.locationIds.includes(locationId),
  );
}

export function getRecommendedServices(state: {
  health?: number;
  cash?: number;
  day?: number;
  flags?: Record<string, unknown>;
}): CityServiceAction[] {
  const recommendations: CityServiceAction[] = [];

  for (const service of CITY_SERVICE_ACTIONS) {
    if (service.id === "community_health_check" && (state.health ?? 100) < 70) {
      recommendations.push(service);
    }
    if (
      service.id === "credit_report_query" &&
      (state.cash ?? 0) > 500 &&
      !state.flags?._creditChecked
    ) {
      recommendations.push(service);
    }
    if (service.id === "social_security_query" && (state.day ?? 0) >= 60) {
      recommendations.push(service);
    }
  }

  return recommendations.slice(0, 3);
}
