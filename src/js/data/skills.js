/**
 * 证书/技能训练定义
 * 可在培训中心考取
 */

const CERTIFICATES = [
  {
    id: "construction_safety",
    name: "建筑安全证",
    desc: "进入建筑工地的必要条件，减少受伤风险50%",
    requirements: { cash: 300, intelligence: 20 },
    effects: { injuryReduction: 0.5 },
    examPassRate: 0.85,
  },
  {
    id: "coding_basic",
    name: "编程基础证书",
    desc: "证明你具备基本编程能力，进入职场的重要敲门砖",
    requirements: { cash: 500, intelligence: 35 },
    effects: { codingXp: 50, intelligence: 2 },
    examPassRate: 0.65,
  },
  {
    id: "accounting_cert",
    name: "会计从业证",
    desc: "可以做会计类工作，收入稳定",
    requirements: { cash: 400, intelligence: 30 },
    effects: { accountingXp: 40, intelligence: 1 },
    examPassRate: 0.7,
  },
  {
    id: "welding_cert",
    name: "焊工证",
    desc: "特种作业证书，焊工工资高",
    requirements: { cash: 600, physique: 35 },
    effects: { weldingXp: 50, physique: 2 },
    examPassRate: 0.75,
  },
  {
    id: "driver_license",
    name: "驾照",
    desc: "可以开车，解锁送货司机等高收入工作",
    requirements: { cash: 800, agility: 25 },
    effects: { drivingXp: 40, agility: 1 },
    examPassRate: 0.6,
  },
  {
    id: "english_cert",
    name: "英语四级证书",
    desc: "证明英语水平，对外企和家教有帮助",
    requirements: { cash: 350, intelligence: 40 },
    effects: { englishXp: 60, intelligence: 2 },
    examPassRate: 0.55,
  },
  {
    id: "electrician_cert",
    name: "电工证",
    desc: "家电维修和工业电工的必备证书",
    requirements: { cash: 500, repair: 20, intelligence: 25 },
    effects: { electricianXp: 50, repair: 3 },
    examPassRate: 0.7,
  },
  {
    id: "management_cert",
    name: "管理师证书",
    desc: "职场晋升的加分项",
    requirements: { cash: 800, intelligence: 45 },
    effects: { managementXp: 50, intelligence: 3 },
    examPassRate: 0.5,
  },

  // ============================================================
  // 待完成：新增证书 — 参考《大多数》证书系统 + 真实职业资格
  // 实现提示：在 CERTIFICATES 数组中追加
  // ============================================================
  // TODO: 待实现 - 护理证
  // {
  //   id: "nursing_cert",
  //   name: "护理证",
  //   desc: "可以从事护工/护理工作，收入稳定。",
  //   requirements: { cash: 400, mental: 25 },
  //   effects: { caregiverXp: 30, illnessRiskReduction: 0.1 },
  //   examPassRate: 0.75,
  // },
  // TODO: 待实现 - 食品健康证
  // {
  //   id: "food_health_cert",
  //   name: "食品健康证",
  //   desc: "从事餐饮行业的必要条件，食品安全事件免疫。",
  //   requirements: { cash: 200, hygiene: 15 },
  //   effects: { foodJobIncomeBonus: 0.1, foodSafetyImmune: true },
  //   examPassRate: 0.9,
  // },
  // TODO: 待实现 - 消防证
  // {
  //   id: "fire_safety_cert",
  //   name: "消防证",
  //   desc: "工地/工厂工作的安全证书，受伤概率-15%。",
  //   requirements: { cash: 300, physique: 20 },
  //   effects: { injuryReduction: 0.15 },
  //   examPassRate: 0.8,
  // },
  // TODO: 待实现 - IT支持证
  // {
  //   id: "it_support_cert",
  //   name: "IT支持证",
  //   desc: "可以从事IT客服/技术支持工作，收入+20%。",
  //   requirements: { cash: 600, intelligence: 30, coding: 10 },
  //   effects: { itJobIncomeBonus: 0.2, codingXp: 30 },
  //   examPassRate: 0.6,
  // },
  // TODO: 待实现 - 理财顾问证
  // {
  //   id: "financial_advisor_cert",
  //   name: "理财顾问证",
  //   desc: "可以从事理财咨询工作，投资收入+10%。",
  //   requirements: { cash: 800, intelligence: 40, accounting: 20 },
  //   effects: { investmentIncomeBonus: 0.1, accountingXp: 40 },
  //   examPassRate: 0.5,
  // },
  // TODO: 待实现 - 教师资格证
  // {
  //   id: "teaching_cert",
  //   name: "教师资格证",
  //   desc: "可以从事家教/培训讲师工作，收入+25%。",
  //   requirements: { cash: 500, intelligence: 45, english: 25 },
  //   effects: { teachingJobIncomeBonus: 0.25, intelligence: 3 },
  //   examPassRate: 0.55,
  // },
];

/** 获取证书定义 */
function getCertificateById(certId) {
  return CERTIFICATES.find((c) => c.id === certId) || null;
}

/**
 * 获取某个技能的分支定义（委托至 skill_tree.js 的 SKILL_BRANCHES）
 * 如 SKILL_BRANCHES 未加载则返回空数组
 */
function getSkillBranches(skillKey) {
  if (typeof SKILL_BRANCHES !== "undefined") {
    return SKILL_BRANCHES[skillKey] || [];
  }
  return [];
}

/**
 * 获取某个技能的特定分支对象
 */
function getSkillBranchById(skillKey, branchId) {
  var branches = getSkillBranches(skillKey);
  for (var i = 0; i < branches.length; i++) {
    if (branches[i].id === branchId) return branches[i];
  }
  return null;
}

/** 获取玩家可考的证书 */
function getAvailableCertificates(state) {
  return CERTIFICATES.filter((cert) => {
    if (state.certificates.includes(cert.id)) return false; // 已拥有
    const p = state.player;
    const req = cert.requirements;
    if (req.intelligence && p.intelligence < req.intelligence) return false;
    if (req.physique && p.physique < req.physique) return false;
    if (req.repair && state.skills.repair.level < req.repair) return false;
    if (req.agility && p.agility < req.agility) return false;
    return true;
  });
}
