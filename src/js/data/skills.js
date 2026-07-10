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
    salaryBonus: { construction: 0.1 },
    examPassRate: 0.85,
  },
  {
    id: "coding_basic",
    name: "编程基础证书",
    desc: "证明你具备基本编程能力，进入职场的重要敲门砖",
    requirements: { cash: 500, intelligence: 35 },
    effects: { codingXp: 50, intelligence: 2 },
    salaryBonus: { tech: 0.05, design: 0.03 },
    examPassRate: 0.65,
  },
  {
    id: "accounting_cert",
    name: "会计从业证",
    desc: "可以做会计类工作，收入稳定",
    requirements: { cash: 400, intelligence: 30 },
    effects: { accountingXp: 40, intelligence: 1 },
    salaryBonus: { finance: 0.08, operations: 0.05 },
    examPassRate: 0.7,
  },
  {
    id: "welding_cert",
    name: "焊工证",
    desc: "特种作业证书，焊工工资高",
    requirements: { cash: 600, physique: 35 },
    effects: { weldingXp: 50, physique: 2 },
    salaryBonus: { construction: 0.1 },
    examPassRate: 0.75,
  },
  {
    id: "driver_license",
    name: "驾照",
    desc: "可以开车，解锁送货司机等高收入工作",
    requirements: { cash: 800, agility: 25 },
    effects: { drivingXp: 40, agility: 1 },
    salaryBonus: { logistics: 0.08 },
    examPassRate: 0.6,
  },
  {
    id: "english_cert",
    name: "英语四级证书",
    desc: "证明英语水平，对外企和家教有帮助",
    requirements: { cash: 350, intelligence: 40 },
    effects: { englishXp: 60, intelligence: 2 },
    salaryBonus: {
      universal: 0.03,
      education: 0.06,
      doctor: 0.05,
      public_institution: 0.05,
      civil: 0.05,
    },
    examPassRate: 0.55,
  },
  {
    id: "electrician_cert",
    name: "电工证",
    desc: "家电维修和工业电工的必备证书",
    requirements: { cash: 500, repair: 20, intelligence: 25 },
    effects: { electricianXp: 50, repair: 3 },
    salaryBonus: { construction: 0.08 },
    examPassRate: 0.7,
  },
  {
    id: "management_cert",
    name: "管理师证书",
    desc: "职场晋升的加分项",
    requirements: { cash: 800, intelligence: 45 },
    effects: { managementXp: 50, intelligence: 3 },
    salaryBonus: {
      operations: 0.06,
      sales: 0.06,
      legal: 0.05,
      public_institution: 0.06,
      civil: 0.06,
    },
    examPassRate: 0.5,
  },

  // ============================================================
  // 待完成：新增证书 — 参考《大多数》证书系统 + 真实中国职业资格目录(2024版) + 《北京浮生记》
  // 实现提示：在 CERTIFICATES 数组中追加，注意 effects 字段与现有技能系统兼容
  // 参考来源：
  //   - 人社部《国家职业资格目录（2024年版）》：真实职业资格清单
  //   - 《大多数》证书系统：游戏化证书设计思路
  //   - 真实培训考证费用：参考各地培训市场价
  //   - 真实考试通过率：参考各职业资格官方公布数据
  // ============================================================
  //
  // 【证书设计原则】：
  // 1. 每个证书对应真实中国职业资格（参考人社部目录）
  // 2. 考试通过率反映真实难度（参考真实数据）
  // 3. 效果设计参考《大多数》装备/技能加成系统
  // 4. 价格参考真实培训考证费用（2024年市场价）
  //
  // ============================================================
  // 医疗健康类证书（正式实现 — 配套医院地点工作）
  // 参考来源：人社部《国家职业资格目录（2024年版）》/ 真实中国医疗培训数据
  // 联动：医院地点 jobs 数组已更新（hospital_cleaning/hospital_delivery/hospital_orderly/hospital_guidance）
  // ============================================================
  {
    id: "nursing_cert",
    name: "护理员证",
    desc: "经过专业培训取得护理员资格，可以从事护工/养老院护理工作。老龄化社会需求旺盛，医院护工收入+30%。",
    requirements: { cash: 400, mental: 25, ageMin: 18, ageMax: 55 },
    effects: { caregiverXp: 50, illnessRiskReduction: 0.1 },
    salaryBonus: { medical: 0.1 },
    examPassRate: 0.7,
    trainingDays: 7,
  },
  {
    id: "health_manager",
    name: "健康管理师",
    desc: "新兴职业，为企业和个人提供健康咨询和健康管理方案。适合有医学背景或长期关注健康的人。",
    requirements: { cash: 600, intelligence: 35, mental: 30 },
    effects: { healthBonus: 5, illnessRiskReduction: 0.05 },
    salaryBonus: { medical: 0.05, doctor: 0.04 },
    examPassRate: 0.65,
    trainingDays: 10,
  },
  {
    id: "rehab_therapist",
    name: "康复理疗师",
    desc: "掌握推拿、按摩、理疗等康复技能。适合有体力基础、愿意服务他人的人。",
    requirements: { cash: 500, physique: 25, mental: 20 },
    effects: { physiotherapyXp: 40, fatigueReduction: 3 },
    salaryBonus: { medical: 0.06 },
    examPassRate: 0.72,
    trainingDays: 7,
  },
  {
    id: "food_safety",
    name: "食品健康证",
    desc: "从事餐饮/食品行业必备证书。没有这个证，餐饮类工作无法入职。",
    requirements: { cash: 100, ageMin: 16, ageMax: 60 },
    effects: { foodHandlingXp: 20 },
    salaryBonus: { catering: 0.06 },
    examPassRate: 0.9,
    trainingDays: 1,
  },

  // ============================================================
  // cooking/repair/sales 技能证书（正式实现 — 配套技能树分支）
  // 参考来源：人社部《国家职业资格目录》/ 真实中国职业资格培训数据
  // 联动：skill_tree.js 中 cooking/repair/sales 分支在Lv.30解锁
  // ============================================================
  {
    id: "cooking_cert",
    name: "厨师证",
    desc: "餐饮行业从业必备证书，证明烹饪技能水平。解锁餐厅厨师/行政总厨工作，餐饮收入+20%。",
    requirements: { cash: 500, cooking: 20, ageMin: 18, ageMax: 50 },
    effects: {
      cookingXpBonus: 0.2,
      chefJobIncomeBonus: 0.2,
      chefJobUnlock: true,
    },
    salaryBonus: { catering: 0.1 },
    examPassRate: 0.75,
    trainingDays: 7,
  },
  {
    id: "repair_cert",
    name: "维修工证",
    desc: "家电维修/设备维护的专业证书。解锁高级维修工作，维修收入+25%。",
    requirements: {
      cash: 600,
      repair: 25,
      physique: 15,
      ageMin: 18,
      ageMax: 50,
    },
    effects: {
      repairXpBonus: 0.15,
      repairJobIncomeBonus: 0.25,
      repairJobUnlock: true,
    },
    salaryBonus: { construction: 0.08 },
    examPassRate: 0.7,
    trainingDays: 10,
  },
  {
    id: "sales_cert",
    name: "销售师证",
    desc: "专业销售资格证书。解锁高级销售/商务谈判工作，销售收入+20%。",
    requirements: { cash: 400, sales: 20, mental: 25, ageMin: 18, ageMax: 50 },
    effects: {
      salesXpBonus: 0.15,
      salesJobIncomeBonus: 0.2,
      salesJobUnlock: true,
    },
    salaryBonus: { sales: 0.08 },
    examPassRate: 0.8,
    trainingDays: 5,
  },
  {
    id: "psychologist",
    name: "心理咨询师",
    desc: "经过系统培训取得心理咨询资格，可以为他人提供心理疏导服务。需要较强的共情能力和沟通技巧。",
    requirements: { cash: 800, intelligence: 40, mental: 40 },
    effects: { psychologyXp: 60, mentalBonus: 5 },
    salaryBonus: {
      medical: 0.05,
      doctor: 0.06,
      operations: 0.04,
      legal: 0.04,
      education: 0.04,
      civil: 0.04,
    },
    examPassRate: 0.5,
    trainingDays: 14,
  },
  {
    id: "medical_license",
    name: "医师资格证",
    desc: "取得医师执业资格，可独立从事医疗诊断与处方。医生路径薪资+20%（通过事件推入，不可直接考取）。",
    requirements: {},
    effects: {},
    salaryBonus: { doctor: 0.2 },
    examPassRate: 1,
    trainingDays: 1,
  },
  {
    id: "professional_title_cert",
    name: "事业单位职称证",
    desc: "事业单位专业技术职务资格证明，与薪级工资直接挂钩。事业单位路径薪资+10%（通过事件推入，不可直接考取）。",
    requirements: {},
    effects: {},
    salaryBonus: { public_institution: 0.1 },
    examPassRate: 1,
    trainingDays: 1,
  },
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
    if (
      req.repair &&
      state.skills.repair &&
      state.skills.repair.level < req.repair
    )
      return false;
    if (req.agility && p.agility < req.agility) return false;
    if (
      req.cooking &&
      state.skills.cooking &&
      state.skills.cooking.level < req.cooking
    )
      return false;
    if (req.sales && state.skills.sales && state.skills.sales.level < req.sales)
      return false;
    return true;
  });
}
