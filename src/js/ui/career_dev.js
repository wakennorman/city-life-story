/**
 * 事业发展Tab — 合并创业系统 + 固定工作/上班族职业路径
 *
 * 包含：
 * 1. 创业系统（原 startup 全部内容）
 * 2. 固定工作/上班族职业路径（v3.2 扩展为6路径×20+职位）
 * 3. 职业发展与职场社交联动（晋升需要关系）
 *
 * v3.2 升级：
 * - 4路径→6路径（新增设计创意+法律服务）
 * - 晋升条件增加：属性(体质/智力/敏捷/能力/颜值)+社交+业绩
 * - 图标去重（每个路径用不同emoji）
 */

// ====== 上班族/固定工作职业路径定义 ======
// v3.2 扩展为6路径×3-4级 ≈ 22个职位
const CAREER_PATHS = {
  tech: {
    name: "IT技术",
    icon: "💻",
    category: "white_collar", // 白领
    levels: [
      {
        id: "tech_junior",
        name: "初级程序员",
        minAge: 20,
        reqSkills: { coding: 15 },
        salary: 6000,
        reqEducation: 1,
        desc: "写业务代码、修Bug",
      },
      {
        id: "tech_mid",
        name: "中级开发工程师",
        minAge: 23,
        reqSkills: { coding: 30, english: 10 },
        reqAttrs: { intelligence: 30 },
        salary: 12000,
        reqEducation: 1,
        reqWorkDays: 365,
        desc: "独立负责模块开发",
      },
      {
        id: "tech_senior",
        name: "高级开发工程师",
        minAge: 26,
        reqSkills: { coding: 50, english: 20, management: 10 },
        reqAttrs: { intelligence: 45, mental: 30 },
        salary: 22000,
        reqEducation: 1,
        reqWorkDays: 1095,
        desc: "技术方案设计、带新人",
      },
      {
        id: "tech_lead",
        name: "技术架构师",
        minAge: 30,
        reqSkills: { coding: 65, management: 30, english: 25 },
        reqAttrs: { intelligence: 60, mental: 45 },
        salary: 35000,
        reqEducation: 1,
        reqWorkDays: 2190,
        desc: "架构设计、技术决策",
        reqSocial: 60,
      },
    ],
  },
  finance: {
    name: "金融财务",
    icon: "📈",
    category: "white_collar",
    levels: [
      {
        id: "fin_junior",
        name: "财务助理",
        minAge: 20,
        reqSkills: { accounting: 15 },
        reqAttrs: { intelligence: 20 },
        salary: 5500,
        reqEducation: 1,
        desc: "整理票据、录入凭证",
      },
      {
        id: "fin_mid",
        name: "会计/分析师",
        minAge: 23,
        reqSkills: { accounting: 30, english: 10 },
        reqAttrs: { intelligence: 35 },
        salary: 10000,
        reqEducation: 1,
        reqWorkDays: 365,
        desc: "做账、出报表、财务分析",
      },
      {
        id: "fin_senior",
        name: "高级分析师",
        minAge: 26,
        reqSkills: { accounting: 45, management: 15 },
        reqAttrs: { intelligence: 50, mental: 35 },
        salary: 18000,
        reqEducation: 1,
        reqWorkDays: 1095,
        desc: "财务分析、预算管控",
      },
      {
        id: "fin_manager",
        name: "财务经理",
        minAge: 30,
        reqSkills: { accounting: 55, management: 35 },
        reqAttrs: { intelligence: 60, mental: 45 },
        salary: 30000,
        reqEducation: 1,
        reqWorkDays: 2190,
        desc: "管团队、做决策",
        reqSocial: 60,
      },
    ],
  },
  sales: {
    name: "销售市场",
    icon: "🏪",
    category: "service",
    levels: [
      {
        id: "sales_junior",
        name: "销售助理",
        minAge: 18,
        reqSkills: { sales: 15 },
        reqAttrs: { agility: 20, charm: 15 },
        salary: 4000,
        desc: "跟单、电话邀约",
      },
      {
        id: "sales_mid",
        name: "销售代表",
        minAge: 21,
        reqSkills: { sales: 30 },
        reqAttrs: { agility: 30, charm: 25, mental: 20 },
        salary: 8000,
        reqWorkDays: 365,
        desc: "独立谈客户、签单",
      },
      {
        id: "sales_senior",
        name: "高级销售",
        minAge: 25,
        reqSkills: { sales: 50, management: 15 },
        reqAttrs: { charm: 35, mental: 35 },
        salary: 15000,
        reqWorkDays: 1095,
        desc: "带客户资源、跟大单",
      },
      {
        id: "sales_manager",
        name: "销售经理",
        minAge: 28,
        reqSkills: { sales: 60, management: 35 },
        reqAttrs: { charm: 45, mental: 45, intelligence: 40 },
        salary: 25000,
        reqWorkDays: 2190,
        desc: "带销售团队、定策略",
        reqSocial: 60,
      },
    ],
  },
  operations: {
    name: "运营管理",
    icon: "⚙️",
    category: "service",
    levels: [
      {
        id: "ops_junior",
        name: "运营助理",
        minAge: 18,
        reqSkills: { management: 10 },
        reqAttrs: { intelligence: 20 },
        salary: 4500,
        reqEducation: 1,
        desc: "数据录入、文档整理",
      },
      {
        id: "ops_mid",
        name: "运营专员",
        minAge: 21,
        reqSkills: { management: 25 },
        reqAttrs: { intelligence: 30, mental: 20 },
        salary: 8000,
        reqEducation: 1,
        reqWorkDays: 365,
        desc: "活动执行、数据分析",
      },
      {
        id: "ops_senior",
        name: "运营主管",
        minAge: 25,
        reqSkills: { management: 40, sales: 15 },
        reqAttrs: { intelligence: 40, mental: 35, agility: 25 },
        salary: 14000,
        reqEducation: 1,
        reqWorkDays: 1095,
        desc: "带项目、优化流程",
      },
      {
        id: "ops_manager",
        name: "运营经理",
        minAge: 28,
        reqSkills: { management: 55, sales: 25 },
        reqAttrs: { intelligence: 50, mental: 45 },
        salary: 22000,
        reqEducation: 1,
        reqWorkDays: 2190,
        desc: "部门管理、策略制定",
        reqSocial: 60,
      },
    ],
  },
  design: {
    name: "设计创意",
    icon: "🎨",
    category: "white_collar",
    levels: [
      {
        id: "des_junior",
        name: "初级设计师",
        minAge: 18,
        reqSkills: { coding: 10 },
        reqAttrs: { intelligence: 20, charm: 20 },
        salary: 5000,
        desc: "修图、做页面、跟需求",
      },
      {
        id: "des_mid",
        name: "资深设计师",
        minAge: 22,
        reqSkills: { coding: 20, english: 10 },
        reqAttrs: { intelligence: 30, charm: 30, mental: 20 },
        salary: 9000,
        reqWorkDays: 365,
        desc: "独立出设计方案",
      },
      {
        id: "des_senior",
        name: "设计主管",
        minAge: 26,
        reqSkills: { coding: 30, management: 15, english: 15 },
        reqAttrs: { intelligence: 40, charm: 40, mental: 30 },
        salary: 16000,
        reqWorkDays: 1095,
        desc: "带设计组、定设计规范",
      },
      {
        id: "des_director",
        name: "创意总监",
        minAge: 30,
        reqSkills: { management: 35, english: 20 },
        reqAttrs: { intelligence: 50, charm: 50, mental: 45 },
        salary: 28000,
        reqEducation: 1,
        reqWorkDays: 2190,
        desc: "品牌/产品创意决策",
        reqSocial: 50,
      },
    ],
  },
  // [全系统自洽修复] 域C R74: 删除重复的legal路径定义(L265-315死代码)，保留新版(L705-738)
  // [全系统自洽修复] 域C 修复:education 重复键——本条(edu_assist系, category:service)被下方第689行同名键(edu_assistant系)静默覆盖，整条不可达(死职业)。删除被覆盖的死路径，保留第689行活路径。

  logistics: {
    name: "物流快递",
    icon: "🚚",
    category: "blue_collar_gov",
    levels: [
      {
        id: "log_sorter",
        name: "仓储分拣工",
        minAge: 18,
        reqSkills: {},
        reqAttrs: { physique: 20 },
        salary: 4500,
        desc: "仓库分拣、打包装货、库存盘点",
      },
      {
        id: "log_courier",
        name: "快递员",
        minAge: 20,
        reqSkills: {},
        reqAttrs: { physique: 25, agility: 25 },
        salary: 7000,
        reqWorkDays: 180,
        desc: "日均派件200+、建立客户关系",
      },
      {
        id: "log_supervisor",
        name: "站点主管",
        minAge: 24,
        reqSkills: { management: 15 },
        reqAttrs: { agility: 35, mental: 28, intelligence: 28 },
        salary: 11500,
        reqWorkDays: 730,
        desc: "管理快递站点、协调派送、处理投诉",
      },
      {
        id: "log_manager",
        name: "区域运营经理",
        minAge: 28,
        reqSkills: { management: 30, sales: 15 },
        reqAttrs: { intelligence: 40, mental: 38, agility: 32 },
        salary: 20000,
        reqWorkDays: 1825,
        desc: "区域配送网络管理、KPI考核、成本控制",
        reqSocial: 40,
      },
    ],
  },

  catering: {
    name: "餐饮服务",
    icon: "🍜",
    category: "service",
    levels: [
      {
        id: "cat_server",
        name: "服务员/洗碗工",
        minAge: 16,
        reqSkills: {},
        reqAttrs: { physique: 15 },
        salary: 3500,
        desc: "餐厅服务、清洁打扫、收银开单",
      },
      {
        id: "cat_cook",
        name: "厨师/领班",
        minAge: 20,
        reqSkills: { cooking: 20 },
        reqAttrs: { physique: 25, charm: 20 },
        salary: 7000,
        reqWorkDays: 365,
        desc: "烹饪制作、备料管理、小团队协调",
      },
      {
        id: "cat_chef",
        name: "厨师长",
        minAge: 26,
        reqSkills: { cooking: 38, management: 15 },
        reqAttrs: { physique: 28, charm: 30, mental: 25 },
        salary: 13500,
        reqWorkDays: 1095,
        desc: "菜单设计、厨房管理、食材成本控制",
      },
      {
        id: "cat_manager",
        name: "餐厅店长",
        minAge: 30,
        reqSkills: { management: 32, sales: 18, cooking: 25 },
        reqAttrs: { charm: 38, intelligence: 38, mental: 32 },
        salary: 21000,
        reqWorkDays: 2190,
        desc: "全店运营、人员招聘、外卖平台维护",
        reqSocial: 40,
      },
    ],
  },
  medical: {
    name: "医疗护理",
    icon: "🏥",
    category: "blue_collar_gov",
    levels: [
      {
        id: "med_aide",
        name: "护理员",
        minAge: 18,
        reqSkills: { medicine: 5 },
        reqAttrs: { physique: 20, mental: 15 },
        salary: 4500,
        desc: "协助护士完成基础护理工作",
      },
      {
        id: "med_nurse",
        name: "注册护士",
        minAge: 21,
        reqSkills: { medicine: 20 },
        reqAttrs: { physique: 28, mental: 25, intelligence: 25 },
        salary: 8500,
        reqEducation: 1,
        reqWorkDays: 365,
        desc: "独立负责病区护理，值班执行医嘱",
      },
      {
        id: "med_senior_nurse",
        name: "主管护师",
        minAge: 26,
        reqSkills: { medicine: 38, management: 12 },
        reqAttrs: { physique: 30, mental: 38, intelligence: 38 },
        salary: 15000,
        reqEducation: 1,
        reqWorkDays: 1095,
        desc: "带教新护士，参与科室管理",
      },
      {
        id: "med_head_nurse",
        name: "护士长",
        minAge: 30,
        reqSkills: { medicine: 50, management: 30 },
        reqAttrs: { physique: 30, mental: 48, intelligence: 48, charm: 35 },
        salary: 24000,
        reqEducation: 1,
        reqWorkDays: 2190,
        desc: "主管科室护理质量，协调医护团队",
        reqSocial: 45,
      },
    ],
  },
  /**
   * 👨‍⚕️ 医师路径（v3.11 新增）
   * 中国医生职称体系：实习→住院→主治→副高→正高
   * 参考：真实中国医师晋升制度 / BitLife医生职业 / 大多数职业系统
   * 与 medical.js 联动：医师职业可享受治疗折扣和医疗资源
   */
  doctor: {
    name: "医师",
    icon: "👨‍⚕️",
    category: "blue_collar_gov",
    levels: [
      {
        id: "doc_intern",
        name: "实习医生",
        minAge: 22,
        reqSkills: { medicine: 15, english: 10 },
        reqAttrs: { intelligence: 30, mental: 25 },
        salary: 4000,
        reqEducation: 1,
        desc: "临床轮转、写病历、跟台手术",
      },
      {
        id: "doc_resident",
        name: "住院医师",
        minAge: 24,
        reqSkills: { medicine: 30, english: 15 },
        reqAttrs: { intelligence: 38, mental: 35, physique: 25 },
        salary: 8000,
        reqEducation: 1,
        reqWorkDays: 365,
        desc: "独立管床、值夜班、急诊处置",
      },
      {
        id: "doc_attending",
        name: "主治医师",
        minAge: 28,
        reqSkills: { medicine: 50, english: 20, management: 10 },
        reqAttrs: { intelligence: 48, mental: 45, charm: 25 },
        salary: 15000,
        reqEducation: 1,
        reqWorkDays: 1095,
        desc: "门诊主诊、带教住院医、科室课题",
      },
      {
        id: "doc_associate_chief",
        name: "副主任医师",
        minAge: 33,
        reqSkills: { medicine: 65, english: 28, management: 25 },
        reqAttrs: { intelligence: 55, mental: 52, charm: 35 },
        salary: 25000,
        reqEducation: 1,
        reqWorkDays: 2190,
        desc: "专家门诊、科研课题、亚专科带头人",
        reqSocial: 40,
      },
      {
        id: "doc_chief",
        name: "主任医师",
        minAge: 38,
        reqSkills: { medicine: 80, english: 30, management: 35 },
        reqAttrs: { intelligence: 62, mental: 58, charm: 42 },
        salary: 38000,
        reqEducation: 1,
        reqWorkDays: 3650,
        desc: "科室主任/学科带头人、重大手术、学术领军",
        reqSocial: 55,
      },
    ],
  },
  /**
   * 🏢 事业单位路径（v3.11 新增）
   * 中国事业编制体系：办事员→科员→副科级→科级→副处级
   * 参考：真实中国事业编制体系 / 公务员与事业编双轨制
   * 与 legal.js 联动：公职身份提供法律资源和行政保护
   */
  public_institution: {
    name: "事业单位",
    icon: "🏢",
    category: "blue_collar_gov",
    levels: [
      {
        id: "pi_clerk",
        name: "办事员",
        minAge: 20,
        reqSkills: { management: 5 },
        reqAttrs: { intelligence: 22, mental: 18 },
        salary: 4500,
        reqEducation: 1,
        desc: "窗口服务、文件归档、基础行政",
      },
      {
        id: "pi_officer",
        name: "科员",
        minAge: 23,
        reqSkills: { management: 18, english: 5 },
        reqAttrs: { intelligence: 30, mental: 25, charm: 20 },
        salary: 7000,
        reqEducation: 1,
        reqWorkDays: 730,
        desc: "专项工作执行、项目协调、公文起草",
      },
      {
        id: "pi_deputy_section",
        name: "副科长级",
        minAge: 27,
        reqSkills: { management: 32, english: 10 },
        reqAttrs: { intelligence: 40, mental: 35, charm: 30 },
        salary: 11000,
        reqEducation: 1,
        reqWorkDays: 1460,
        desc: "分管专项领域、带领小组、政策研究",
        reqSocial: 30,
      },
      {
        id: "pi_section_chief",
        name: "科长级",
        minAge: 32,
        reqSkills: { management: 45, english: 15, sales: 10 },
        reqAttrs: { intelligence: 48, mental: 42, charm: 40 },
        salary: 16000,
        reqEducation: 1,
        reqWorkDays: 2190,
        desc: "部门管理、预算审批、上下协调",
        reqSocial: 45,
      },
      {
        id: "pi_deputy_div",
        name: "副处长级",
        minAge: 38,
        reqSkills: { management: 58, english: 20, sales: 15 },
        reqAttrs: { intelligence: 55, mental: 50, charm: 48 },
        salary: 23000,
        reqEducation: 1,
        reqWorkDays: 3650,
        desc: "分管单位整体业务、政策制定与执行",
        reqSocial: 55,
      },
    ],
  },
  civil: {
    name: "公务员",
    icon: "🏛️",
    category: "blue_collar_gov",
    levels: [
      {
        id: "civil_clerk",
        name: "基层公务员",
        minAge: 22,
        reqSkills: { management: 10 },
        reqAttrs: { intelligence: 28, mental: 20 },
        salary: 5500,
        reqEducation: 1,
        desc: "办理日常行政事务，接待群众来访",
      },
      {
        id: "civil_officer",
        name: "科员/主任科员",
        minAge: 25,
        reqSkills: { management: 25, english: 8 },
        reqAttrs: { intelligence: 38, mental: 32, charm: 25 },
        salary: 9000,
        reqEducation: 1,
        reqWorkDays: 730,
        desc: "独立承担专项工作，撰写政策报告",
      },
      {
        id: "civil_deputy",
        name: "副科长/副主任",
        minAge: 30,
        reqSkills: { management: 40, english: 15 },
        reqAttrs: { intelligence: 48, mental: 42, charm: 38 },
        salary: 16000,
        reqEducation: 1,
        reqWorkDays: 1825,
        desc: "协助科长分管业务，带领小组完成任务",
        reqSocial: 50,
      },
      {
        id: "civil_chief",
        name: "科长/处长",
        minAge: 35,
        reqSkills: { management: 55, english: 20, sales: 15 },
        reqAttrs: { intelligence: 55, mental: 52, charm: 48 },
        salary: 26000,
        reqEducation: 1,
        reqWorkDays: 3650,
        desc: "主管科室全面工作，承担政策制定与执行",
        reqSocial: 65,
      },
    ],
  },
  // [全系统自洽修复] 域C 深度开发: 新增法律路径
  legal: {
    name: "法律服务",
    icon: "⚖️",
    category: "white_collar",
    levels: [
      {
        id: "legal_assistant", name: "法律助理", minAge: 22,
        reqSkills: { english: 10 }, reqAttrs: { intelligence: 25 },
        salary: 6000, reqEducation: 1,
        desc: "整理案卷、法律检索、起草文书",
      },
      {
        id: "legal_officer", name: "法务专员", minAge: 25,
        reqSkills: { english: 20, management: 10 }, reqAttrs: { intelligence: 35, mental: 25 },
        salary: 11000, reqEducation: 1, reqWorkDays: 365,
        desc: "独立处理合同审核、法律咨询、纠纷调解",
      },
      {
        id: "legal_senior", name: "资深法务", minAge: 28,
        reqSkills: { english: 30, management: 25 }, reqAttrs: { intelligence: 48, mental: 38 },
        salary: 20000, reqEducation: 1, reqWorkDays: 1095,
        desc: "重大合同谈判、诉讼策略、团队指导",
        reqSocial: 40,
      },
      {
        id: "legal_director", name: "法务总监", minAge: 32,
        reqSkills: { english: 40, management: 40 }, reqAttrs: { intelligence: 58, mental: 50, charm: 35 },
        salary: 35000, reqEducation: 1, reqWorkDays: 2190,
        desc: "法务部全面管理、公司治理、合规体系搭建",
        reqSocial: 55,
      },
    ],
  },
  // [全系统自洽修复] 域C 深度开发: 新增教育路径
  education: {
    name: "教育培训",
    icon: "📚",
    category: "white_collar",
    levels: [
      {
        id: "edu_assistant", name: "助教", minAge: 20,
        reqSkills: { social: 10 }, reqAttrs: { mental: 20 },
        salary: 5000, reqEducation: 1,
        desc: "协助主讲老师批改作业、课后辅导、维持课堂纪律",
      },
      {
        id: "edu_teacher", name: "教师", minAge: 23,
        reqSkills: { social: 20, management: 10 }, reqAttrs: { mental: 30, intelligence: 30 },
        salary: 9000, reqEducation: 1, reqWorkDays: 365,
        desc: "独立备课授课、班级管理、家校沟通",
      },
      {
        id: "edu_senior", name: "高级教师", minAge: 28,
        reqSkills: { social: 35, management: 25 }, reqAttrs: { mental: 42, intelligence: 42 },
        salary: 16000, reqEducation: 1, reqWorkDays: 1095,
        desc: "学科带头人、教研组长、课程开发",
        reqSocial: 35,
      },
      {
        id: "edu_director", name: "教务主任", minAge: 32,
        reqSkills: { social: 45, management: 40 }, reqAttrs: { mental: 50, intelligence: 50, charm: 30 },
        salary: 28000, reqEducation: 1, reqWorkDays: 2190,
        desc: "教务管理、师资培训、教学质量管理",
        reqSocial: 50,
      },
    ],
  },
};

// ====== ======

/**
 * P1-5：证书→职业薪资加成（每月额外补贴，不修改job.salary基准）
 * 返回当月额外收入（整数），0表示无加成
 */
/**
 * P1-5：证书→职业薪资加成（每月额外补贴，不修改job.salary基准）
 * 约定式自动归类：证书声明 salaryBonus 字段，系统自动扫描应用
 * 返回当月额外收入（整数），0表示无加成
 */
function _calcCertSalaryBonus(state, pathId, baseSalary) {
  var certs = state.certificates || [];
  var rate = 0;

  // 约定式优先：扫描所有证书，自动应用 salaryBonus 字段
  for (var ci = 0; ci < certs.length; ci++) {
    var certDef = getCertificateById(certs[ci]);
    if (!certDef || !certDef.salaryBonus) continue;
    var sb = certDef.salaryBonus;
    // 路径专属加成: { tech: 0.05, finance: 0.08 }
    if (sb[pathId]) rate += sb[pathId];
    // 通用加成: { universal: 0.03 }
    if (sb.universal) rate += sb.universal;
  }

  return Math.round((baseSalary || 0) * rate);
}

function ensureCareerCapital(state) {
  if (!state.careerCapital) {
    state.careerCapital = {
      industryResources: 0,
      clientLeads: 0,
      reputation: 0,
      partnerTrust: 0,
      burnout: 0,
    };
  }
  return state.careerCapital;
}

function clampCareerCapital(cap) {
  [
    "industryResources",
    "clientLeads",
    "reputation",
    "partnerTrust",
    "burnout",
  ].forEach(function (key) {
    cap[key] = Math.max(0, Math.min(100, cap[key] || 0));
  });
}

function getCareerPathLabel(pathId) {
  var path = CAREER_PATHS[pathId];
  if (!path) return "未选择方向";
  return path.icon + " " + path.name;
}

/** 职业路径分类图标和中文名 */
var CAREER_CATEGORIES = {
  white_collar: { icon: "👔", name: "白领·专业技术", order: 0 },
  service: { icon: "🛒", name: "服务·销售运营", order: 1 },
  blue_collar_gov: { icon: "🔧", name: "蓝领·体制内", order: 2 },
};

function getCategoryLabel(cat) {
  var c = CAREER_CATEGORIES[cat];
  return c ? c.icon + " " + c.name : "其他";
}

/**
 * 根据玩家当前技能/属性推荐最适合的3条职业路径
 * v3.47 新增：约定式推荐系统，技能匹配度×属性匹配度加权评分
 */
function getRecommendedCareerPaths(state) {
  var p = state.player;
  var skills = state.skills || {};
  var scored = [];
  for (var key in CAREER_PATHS) {
    var path = CAREER_PATHS[key];
    var entry = path.levels[0];
    if (!entry) continue;

    var score = 0;
    var maxScore = 0;

    // [CoC] 技能匹配：玩家当前技能 / 技能要求
    if (entry.reqSkills) {
      for (var s in entry.reqSkills) {
        maxScore += 30;
        var sActual = _getSkillValue(state, s);
        var ratio = Math.min(1, sActual / Math.max(1, entry.reqSkills[s]));
        score += ratio * 30;
      }
    }

    // 属性匹配
    if (entry.reqAttrs) {
      for (var a in entry.reqAttrs) {
        maxScore += 20;
        var aActual = p[a] || 0;
        var aRatio = Math.min(1, aActual / Math.max(1, entry.reqAttrs[a]));
        score += aRatio * 20;
      }
    }

    // 学历加分：满足则+10
    if (entry.reqEducation && p.education) {
      maxScore += 10;
      score += 10;
    } else if (!entry.reqEducation) {
      maxScore += 5;
      score += 5;
    }

    // 年龄加成
    maxScore += 5;
    var age = p.age || 20;
    if (!entry.minAge || age >= entry.minAge) score += 5;

    var pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    scored.push({ key: key, score: pct, path: path });
  }

  scored.sort(function (a, b) {
    return b.score - a.score;
  });
  return scored.slice(0, 3);
}

function getCareerCapitalStartupDiscount(state) {
  var cap = ensureCareerCapital(state);
  var score =
    (cap.industryResources || 0) * 0.5 +
    (cap.clientLeads || 0) * 0.8 +
    (cap.reputation || 0) * 0.4 +
    (cap.partnerTrust || 0) * 0.3 -
    (cap.burnout || 0) * 0.25;
  return Math.max(0, Math.min(0.15, score / 1000));
}

function getStartupReadinessNote(state) {
  var cap = ensureCareerCapital(state);
  var discount = getCareerCapitalStartupDiscount(state);
  if (discount <= 0) {
    // 街头阶段：显示技能和NPC好感准备进度
    var prepTips = [];
    var skills = state.skills || {};
    var skillCount = 0;
    for (var k in skills) {
      if (skills[k] && skills[k].level >= 12) skillCount++;
    }
    if (skillCount < 2)
      prepTips.push("技能等级≥12还需" + (2 - skillCount) + "项");
    else prepTips.push("✅ 技能达标（" + skillCount + "项≥12级）");
    var rels = state.relationships || {};
    var highAffNpcs = 0;
    for (var nid in rels) {
      if (rels[nid] && (rels[nid].affinity || 0) >= 40) highAffNpcs++;
    }
    if (highAffNpcs < 2)
      prepTips.push("好感≥40的NPC还需" + (2 - highAffNpcs) + "位");
    else prepTips.push("✅ 人脉达标（" + highAffNpcs + "位好感≥40）");
    if ((state.resources.cash || 0) < 30000) prepTips.push("现金¥30k+");
    var careerNote =
      state.career && state.career.currentJob
        ? "建议先积累行业资源、客户线索或合伙人信任"
        : "暂无工作积累，建议先上班攒职场资源";
    return (
      careerNote +
      "。<br>" +
      '<span style="color:var(--text-secondary);font-size:11px;">' +
      prepTips.join(" · ") +
      " · " +
      "行业资源 " +
      Math.round(cap.industryResources || 0) +
      "/建议≥30 · " +
      "客户线索 " +
      Math.round(cap.clientLeads || 0) +
      "/建议≥20</span>"
    );
  }
  var burnoutWarning =
    (cap.burnout || 0) >= 20
      ? '<span style="color:var(--danger)"> ⚠️ 职业倦怠(' +
        Math.round(cap.burnout) +
        ")已抵消部分减免</span>"
      : "";
  return (
    "职场积累可转化为创业准备度：注册资金约 <strong>-" +
    Math.round(discount * 100) +
    "%</strong> 减免。<br>" +
    '<span style="font-size:11px;color:var(--text-secondary);">' +
    "行业资源 " +
    Math.round(cap.industryResources || 0) +
    "（×0.5） · " +
    "客户线索 " +
    Math.round(cap.clientLeads || 0) +
    "（×0.8） · " +
    "声誉 " +
    Math.round(cap.reputation || 0) +
    "（×0.4） · " +
    "合伙人信任 " +
    Math.round(cap.partnerTrust || 0) +
    "（×0.3）" +
    "</span>" +
    burnoutWarning
  );
}

function getCareerGuidanceHtml(state) {
  var cap = ensureCareerCapital(state);
  clampCareerCapital(cap);
  var career = state.career || {};
  var job = career.currentJob;
  var startup = state.startup || {};
  var dream =
    typeof getCurrentDream === "function" ? getCurrentDream(state) : null;
  var status = "待选择事业方向";
  var next = "先找一份稳定工作，或继续积累创业启动资金。";
  var action = "查看上班族路径 / 调研创业条件";
  if (job) {
    status = getCareerPathLabel(job.path) + " · " + (job.levelName || "在职");
    next =
      (job.performance || 50) >= 70
        ? "绩效不错，可以准备晋升或积累客户线索后创业。"
        : "优先做项目、补技能和维护同事关系，先把绩效拉上来。";
    action = "准备晋升 / 承接关键项目 / 维护职场人脉";
  } else if (startup && startup.status !== "none" && startup.company) {
    status = "创业中 · " + (startup.company.name || "未命名公司");
    next = "关注现金流、团队稳定和融资可信度，避免烧钱过快。";
    action = "看现金流 / 推进产品 / 处理团队风险";
  }
  // v3.48：职业资本数值改为迷你进度条（替代纯数字）
  var _barItems = [
    { key: "industryResources", label: "行业", color: "#4fc3f7" },
    { key: "clientLeads", label: "客户", color: "#81c784" },
    { key: "reputation", label: "声誉", color: "#ffb74d" },
    { key: "partnerTrust", label: "信任", color: "#ce93d8" },
    { key: "burnout", label: "倦怠", color: "#ef5350" },
  ];
  var _barHtml = "";
  for (var _bi = 0; _bi < _barItems.length; _bi++) {
    var _b = _barItems[_bi];
    var _v = Math.round(cap[_b.key] || 0);
    _barHtml +=
      '<div style="text-align:center;font-size:9px;color:var(--text-muted);">';
    _barHtml +=
      '<div style="font-size:11px;font-weight:bold;color:var(--text-primary);">' +
      _v +
      "</div>";
    _barHtml +=
      '<div style="height:3px;background:rgba(255,255,255,0.1);border-radius:2px;margin:2px 0;overflow:hidden;">';
    _barHtml +=
      '<div style="height:100%;width:' +
      _v +
      "%;background:" +
      _b.color +
      ';border-radius:2px;"></div></div>';
    _barHtml += _b.label + "</div>";
  }

  return (
    '<div class="card" style="padding:12px;margin-bottom:10px;background:rgba(74,158,92,0.07);border:1px solid rgba(74,158,92,0.22);">' +
    '<div style="font-weight:700;color:var(--text-primary);margin-bottom:6px;display:flex;align-items:center;gap:6px;">🧭 今日事业建议</div>' +
    '<div style="font-size:12px;color:var(--text-secondary);line-height:1.7;">' +
    "<div>📍 " +
    status +
    "</div><div>⏭️ " +
    next +
    "</div><div>🎯 " +
    action +
    "</div>" +
    (dream
      ? "<div>💫 人生目标加成：" +
        (typeof getDreamBonusText === "function"
          ? getDreamBonusText(dream)
          : dream.name) +
        "</div>"
      : "") +
    "</div>" +
    '<div class="career-capital-bar" style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;margin-top:8px;">' +
    _barHtml +
    "</div></div>"
  );
}

function getCareerRequirementText(level) {
  if (!level) return "已到达当前路径顶层";
  var parts = [];
  if (level.reqEducation) parts.push("学历本科+");
  if (level.reqWorkDays) parts.push("在职" + level.reqWorkDays + "天");
  if (level.reqSocial) parts.push("人脉" + level.reqSocial + "+");
  if (level.reqSkills) {
    Object.keys(level.reqSkills).forEach(function (k) {
      var skillLabel = typeof getSkillName === "function" ? getSkillName(k) : k;
      parts.push(skillLabel + "Lv." + level.reqSkills[k]);
    });
  }
  if (level.reqAttrs) {
    var attrNames = {
      physique: "体质",
      intelligence: "智力",
      agility: "敏捷",
      mental: "心智",
      charm: "魅力",
    };
    Object.keys(level.reqAttrs).forEach(function (k) {
      parts.push((attrNames[k] || k) + level.reqAttrs[k] + "+");
    });
  }
  return parts.length ? parts.join(" / ") : "无硬性门槛";
}

// 学历已在「我→成长→学历」中展示，事业总览不再重复

/** 事业发展Tab主渲染函数 — 简化导航：去掉创业子Tab（已在上级Tab独立），智能默认视图 */
function renderCareerDevTab(state, parent) {
  parent.innerHTML = "";

  // 子Tab导航 — 上班族 + 总览（创业已在上级Tab独立，不在二级导航中重复）
  var subTabs = [
    { id: "career_jobs", label: "💼 上班族", icon: "💼", title: "💼 上班族 — 找工作和上班相关" },
    { id: "career_overview", label: "📊 总览", icon: "📊", title: "📊 总览 — 工作总览、收入支出概览" },
  ];
  // 智能默认：无工作→上班族列表直接可选，有工作→总览面板
  var hasJob = !!(state.career && state.career.currentJob);
  var currentSubTab =
    state._careerSubTab || (hasJob ? "career_overview" : "career_jobs");

  var nav = document.createElement("div");
  nav.style.cssText =
    "display:flex;gap:4px;padding:8px 12px;background:var(--bg-secondary);border-bottom:1px solid var(--border);overflow-x:auto;flex-shrink:0;";
  subTabs.forEach(function (st) {
    var btn = document.createElement("button");
    btn.className = "tab-btn" + (currentSubTab === st.id ? " active" : "");
    btn.style.cssText = "font-size:11px;padding:4px 10px;white-space:nowrap;";
    btn.textContent = st.label;
    btn.title = st.title;
    btn.onclick = function () {
      state._careerSubTab = st.id;
      renderCareerDevTab(state, parent);
    };
    nav.appendChild(btn);
  });
  parent.appendChild(nav);

  var content = document.createElement("div");
  content.style.cssText = "flex:1;overflow-y:auto;padding:8px;";

  switch (currentSubTab) {
    case "career_jobs":
      renderCareerJobs(state, content);
      break;
    case "career_overview":
    default:
      renderCareerOverview(state, content);
      break;
  }

  parent.appendChild(content);
}

/** 创业子面板（委托到原 startup.js） */
function renderCareerStartup(state, parent) {
  if (typeof renderStartupTab === "function") {
    renderStartupTab(state, parent);
    parent.insertAdjacentHTML("afterbegin", getCareerGuidanceHtml(state));
  } else {
    parent.innerHTML =
      '<p style="color:var(--text-muted);padding:40px;text-align:center;">🚀 创业系统加载中...</p>';
  }
}

/** 职业路径子面板（上班族固定工作） */
function renderCareerJobs(state, parent) {
  // [全系统自洽修复] 域F A类#1: canPromote变量作用域泄漏——var声明在if块内，外部引用时若currentJob为null则ReferenceError
  var canPromote = false;
  var p = state.player;
  var career = state.career || {};
  var currentJob = career.currentJob || null;
  var careerHistory = career.history || [];

  var html = '<div class="tab-content">';
  html += getCareerGuidanceHtml(state);
  html += '<h2 style="font-size:15px;">💼 上班族职业路径</h2>';
  html +=
    '<p style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">v3.11：10条路径×42个职位。晋升需要技能+属性+证书+人脉。新增医师路径(👨‍⚕️5级)和事业单位路径(🏢5级)。</p>';

  // ---- 当前工作状态 ----
  if (currentJob) {
    var path = CAREER_PATHS[currentJob.path];
    var levelData = null;
    if (path) {
      levelData = path.levels.find(function (l) {
        return l.id === currentJob.levelId;
      });
    }
    html += '<div class="section"><h3>📌 当前工作</h3>';
    html +=
      '<div class="card" style="padding:12px;border:2px solid var(--accent);border-radius:10px;background:rgba(74,158,92,0.04);">';
    html +=
      '<div style="font-size:13px;font-weight:bold;">' +
      (path ? path.icon : "💼") +
      " " +
      (levelData ? levelData.name : currentJob.levelId || "未知") +
      "</div>";
    html +=
      '<div style="font-size:11px;color:var(--text-secondary);">' +
      (path ? path.name : "") +
      " · 第" +
      (currentJob.workDays || 0) +
      "天</div>";
    // v3.48：在职天数里程碑标记
    var _wd = currentJob.workDays || 0;
    var _milestone = null;
    if (_wd === 7) _milestone = "🌱 入职一周";
    else if (_wd === 30) _milestone = "🎯 满月达成";
    else if (_wd === 90) _milestone = "💪 百日坚持";
    else if (_wd === 180) _milestone = "🔥 半年磨一剑";
    else if (_wd === 365) _milestone = "🏆 一周年！";
    else if (_wd > 0 && _wd % 365 === 0)
      _milestone = "🏆 " + _wd / 365 + "周年！";
    if (_milestone) {
      html +=
        '<div style="display:inline-block;margin-left:6px;padding:1px 6px;background:rgba(255,183,77,0.12);border-radius:10px;font-size:9px;color:var(--warning);">' +
        _milestone +
        "</div>";
    }
    html +=
      '<div style="font-size:13px;color:var(--accent);font-weight:bold;margin:6px 0;">月薪 ¥' +
      (levelData ? levelData.salary.toLocaleString() : "?") +
      "</div>";
    html +=
      '<div style="font-size:11px;color:var(--text-secondary);">' +
      (levelData ? levelData.desc : "") +
      "</div>";

    // v3.51：职业风险标识
    var _riskProfile =
      _CAREER_RISK_PROFILES && _CAREER_RISK_PROFILES[currentJob.path];
    if (_riskProfile) {
      html +=
        '<div style="margin-top:6px;display:flex;align-items:center;gap:4px;">' +
        '<span style="font-size:9px;padding:1px 6px;background:rgba(239,83,80,0.12);border-radius:10px;color:#e57373;">⚠️ 职业风险：' +
        _riskProfile.diseaseMsg +
        "</span></div>";
    }

    // 晋升条件
    var nextLevel = getNextCareerLevel(currentJob.path, currentJob.levelId);
    if (nextLevel) {
      var canPromote = checkCareerPromotion(state, currentJob.path, nextLevel);
      html +=
        '<div style="margin-top:10px;padding:12px;background:var(--bg-secondary);border:2px solid var(--border);border-radius:8px;">';
      html +=
        '<div style="font-size:11px;font-weight:bold;margin-bottom:4px;">⬆️ 晋升条件：' +
        nextLevel.name +
        "（月薪¥" +
        nextLevel.salary.toLocaleString() +
        "）</div>";
      html +=
        '<div style="font-size:10px;color:var(--text-muted);">' +
        renderPromotionReqs(state, currentJob.path, nextLevel) +
        "</div>";
      if (canPromote) {
        html +=
          '<button class="btn btn-sm" style="margin-top:6px;" onclick="applyCareerPromotion(\'' +
          currentJob.path +
          "','" +
          nextLevel.id +
          "')\">⬆️ 申请晋升</button>";
      } else {
        html +=
          '<div style="font-size:10px;color:var(--warning);margin-top:4px;cursor:pointer;" onclick="showCareerRequirementsModal_Global(\'' +
          currentJob.path +
          "','" +
          nextLevel.id +
          "')\">⚠️ 条件不足，点击查看详情</div>";
      }
      html += "</div>";
    } else {
      html +=
        '<div style="margin-top:8px;font-size:11px;color:var(--accent);">🏆 已到达该路径最高级别！</div>';
    }

    // ---- v3.48：晋升就绪横幅（条件满足时突出显示）----
    if (canPromote) {
      html +=
        '<div style="margin-top:12px;padding:10px 12px;background:rgba(74,158,92,0.1);border:1px solid rgba(74,158,92,0.35);border-radius:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">';
      html += "<div>";
      html +=
        '<div style="font-size:12px;font-weight:bold;color:var(--success);">🎉 晋升条件已满足！</div>';
      html +=
        '<div style="font-size:10px;color:var(--text-muted);margin-top:2px;">可晋升至「' +
        nextLevel.name +
        "」，月薪 ¥" +
        nextLevel.salary.toLocaleString() +
        "</div>";
      html += "</div>";
      html +=
        '<button class="btn btn-sm btn-primary" onclick="applyCareerPromotion(\'' +
        currentJob.path +
        "','" +
        nextLevel.id +
        "')\">⬆️ 立即晋升</button>";
      html += "</div>";
    }

    // ---- 辞职按钮 ----
    html +=
      '<div style="margin-top:12px;padding:10px;background:rgba(255,80,80,0.04);border:2px solid rgba(255,80,80,0.25);border-radius:8px;">';
    html +=
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">⚠️ 辞职后当前工作清零，需重新求职。职业倦怠归零，但行业资源-5。</div>';
    html +=
      '<button class="btn btn-sm" style="background:rgba(255,80,80,0.15);color:var(--danger);border:1px solid rgba(255,80,80,0.3);" onclick="resignCareerJob()">🚪 辞职</button>';
    html += "</div>";

    // ---- 工作行动（v3.48：分组展示 — 业绩提升 vs 压力缓解）----
    html +=
      '<div style="margin-top:12px;"><h3 style="font-size:13px;">⚡ 工作行动</h3>';
    // 业绩组
    html +=
      '<div style="font-size:9px;color:var(--text-muted);margin:4px 0 2px;">📈 提升业绩/资源</div>';
    html +=
      '<div style="display:flex;flex-wrap:wrap;gap:4px;" data-scroll-anchor="career-actions">';
    html +=
      '<button class="btn btn-sm" style="min-height:44px;font-size:11px;" title="业绩+8, 行业资源+2, 消耗AP3" onclick="careerWorkAction(\'project\')">💼 做项目<span style="font-size:9px;display:block;color:var(--text-muted);">AP3 · 业绩+8</span></button>';
    html +=
      '<button class="btn btn-sm" style="min-height:44px;font-size:11px;" title="业绩+3, 消耗AP2" onclick="careerWorkAction(\'overtime\')">🌙 加班<span style="font-size:9px;display:block;color:var(--text-muted);">AP2 · 业绩+3</span></button>';
    html +=
      '<button class="btn btn-sm" style="min-height:44px;font-size:11px;" title="业绩+12, 消耗AP4" onclick="careerWorkAction(\'kpi\')">🎯 冲刺KPI<span style="font-size:9px;display:block;color:var(--text-muted);">AP4 · 业绩+12</span></button>';
    html += "</div>";
    // 休息组
    html +=
      '<div style="font-size:9px;color:var(--text-muted);margin:8px 0 2px;">😴 缓解倦怠/恢复状态</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:4px;">';
    html +=
      '<button class="btn btn-sm" style="min-height:44px;font-size:11px;" title="消耗AP1, 倦怠-8, 心情+5" onclick="careerTakeBreak()">😴 调休<span style="font-size:9px;display:block;color:var(--text-muted);">AP1 · 倦怠-8</span></button>';
    // [全系统自洽修复] 域C R391: state.career.currentJob 无守卫→无工作时TypeError
    var _cj = state.career && state.career.currentJob;
    var _onLeaveCooldown =
      _cj && (_cj._lastPaidLeaveDay || 0) > 0 &&
      state.player.day - (_cj._lastPaidLeaveDay || 0) < 180;
    var _leaveDaysLeft = _cj && _cj._lastPaidLeaveDay
      ? 180 - (state.player.day - _cj._lastPaidLeaveDay)
      : 0;
    if (!_onLeaveCooldown && _cj && (_cj.workDays || 0) >= 90) {
      html +=
        '<button class="btn btn-sm" style="min-height:44px;font-size:11px;" title="消耗5天薪资, 倦怠-45, 心情+25" onclick="careerTakePaidLeave()">🏖️ 带薪年假<span style="font-size:9px;display:block;color:var(--accent);">倦怠-45 · 180天CD</span></button>';
    } else if (_onLeaveCooldown) {
      html +=
        '<button class="btn btn-sm" style="min-height:44px;font-size:11px;opacity:0.5;" disabled>🏖️ 带薪年假<span style="font-size:9px;display:block;color:var(--text-muted);">还需' +
        _leaveDaysLeft +
        "天</span></button>";
    } else {
      html +=
        '<button class="btn btn-sm" style="min-height:44px;font-size:11px;opacity:0.5;" disabled>🏖️ 带薪年假<span style="font-size:9px;display:block;color:var(--text-muted);">需在职90天</span></button>';
    }
    html += "</div></div>";

    // ---- 跳槽机会（P1-2：主动跳槽） ----
    var jobOffers = generateJobOffers(state);
    if (jobOffers.length) {
      html +=
        '<div style="margin-top:12px;"><h3 style="font-size:13px;">🔍 跳槽机会</h3>';
      html +=
        '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">客户线索或声誉打开新机会（接受后30天冷却）</div>';
      for (var oi = 0; oi < jobOffers.length; oi++) {
        var of = jobOffers[oi];
        html +=
          '<div class="card" style="padding:10px;margin:4px 0;font-size:11px;border:2px solid var(--border);border-radius:8px;">';
        html +=
          "<div><strong>" +
          of.levelName +
          "</strong> · 月薪¥" +
          of.salary.toLocaleString() +
          "</div>";
        html +=
          '<div style="font-size:10px;color:var(--text-muted);margin:2px 0 6px;">' +
          of.desc +
          "</div>";
        html +=
          '<button class="btn btn-xs" style="min-height:44px;font-size:11px;padding:4px 10px;" onclick="applyJobhop(\'' +
          of.id +
          "')\">接受offer</button>";
        html += "</div>";
      }
      html += "</div>";
    }

    // ---- 职场社交（P0-2：主动社交UI） ----
    var colleagues =
      state.corporate &&
      state.corporate.colleagues &&
      state.corporate.colleagues.network;
    html +=
      '<div style="margin-top:12px;"><h3 style="font-size:13px;">🤝 职场社交</h3>';
    html +=
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">与同事维护关系有助于晋升和获取内推</div>';
    if (colleagues && colleagues.length) {
      for (var ci = 0; ci < colleagues.length; ci++) {
        var co = colleagues[ci];
        html +=
          '<div class="card" style="padding:8px 10px;margin:3px 0;font-size:11px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;border:2px solid var(--border);border-radius:8px;">';
        html +=
          "<div><strong>" +
          (co.name || "同事") +
          '</strong> <span style="color:var(--text-muted);font-size:10px;">关系' +
          (co.relationship || 0) +
          " 信任" +
          (co.trust || 0) +
          "</span></div>";
        html += '<div style="display:flex;gap:3px;flex-wrap:wrap;">';
        html +=
          '<button class="btn btn-xs" style="min-height:44px;font-size:10px;padding:4px 8px;" onclick="careerSocialAction(\'meal\',\'' +
          co.id +
          "')\">🍚请客</button>";
        html +=
          '<button class="btn btn-xs" style="min-height:44px;font-size:10px;padding:4px 8px;" onclick="careerSocialAction(\'chat\',\'' +
          co.id +
          "')\">💬闲聊</button>";
        if ((co.relationship || 0) >= 60 && co.role !== "mentor") {
          html +=
            '<button class="btn btn-xs" style="min-height:44px;font-size:10px;padding:4px 8px;" onclick="careerSocialAction(\'mentor\',\'' +
            co.id +
            "')\">👨‍🏫拜师</button>";
        }
        // [全系统自洽修复] 域H 修复:导师关系死路 —— 拜师提示"你已有导师，先解除"，
        // 但全库无任何解除入口(endMentorship 死函数零调用方)，导师一旦确立永不可换。
        if (co.role === "mentor") {
          html +=
            '<button class="btn btn-xs" style="min-height:44px;font-size:10px;padding:4px 8px;" onclick="careerSocialAction(\'unmentor\',\'' +
            co.id +
            "')\">👋解除师徒</button>";
        }
        html += "</div></div>";
      }
    } else {
      html +=
        '<div style="font-size:10px;color:var(--text-muted);padding:8px 0;">暂无同事数据，入职后自动生成</div>';
    }
    html += "</div>";

    // 离职按钮
    html +=
      '<button class="btn btn-sm btn-danger" style="margin-top:8px;" onclick="if(confirm(\'确定要辞职吗？\'))resignCareerJob()">🚪 辞职</button>';
    html += "</div></div>";
  } else {
    // 没有工作，显示可选职业路径
    html +=
      '<div class="card" style="padding:12px;margin-bottom:12px;border-left-color:var(--warning);background:var(--bg-secondary);">';
    html +=
      '<p style="font-size:11px;">💡 你目前没有固定工作。选择一条职业路线投递简历，从基层做起。</p>';
    html += "</div>";
  }

  // ---- 街头工作→职业路径桥接（v3.46: 让街头经历可见地转化为职场资本） ----
  if (!currentJob) {
    // 计算街头工作总天数（使用唯一工作天数，非 actionFreq 点击次数）
    var streetTotalDays = (state.flags && state.flags._totalStreetDays) || 0;
    // 街头经验转为职场资本感知
    if (streetTotalDays > 0) {
      var skills = state.skills || {};
      html +=
        '<div class="card" style="padding:10px;margin-bottom:10px;border-left-color:rgba(255,152,0,0.5);background:rgba(255,152,0,0.04);">';
      html +=
        '<div style="font-size:12px;font-weight:bold;margin-bottom:4px;">🌆 街边经历 → 职场准备</div>';
      html +=
        '<div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;">你已经做了 <strong style="color:var(--accent);">' +
        streetTotalDays +
        "</strong> 天街头工作，积累了宝贵的基层经验。</div>";
      // 推荐路径：根据已有技能推荐匹配的职业方向
      var skillPathMap = [
        { skill: "cooking", level: 8, path: "catering", tip: "厨艺→餐饮服务" },
        { skill: "coding", level: 8, path: "tech", tip: "编程→IT技术" },
        {
          skill: "accounting",
          level: 8,
          path: "finance",
          tip: "财务→金融财务",
        },
        {
          skill: "management",
          level: 5,
          path: "operations",
          tip: "管理→运营管理",
        },
        { skill: "sales", level: 8, path: "sales", tip: "销售→销售市场" },
        {
          skill: "english",
          level: 10,
          path: "design",
          tip: "英语+创意→设计创意（设计需同时提升coding技能）",
        },
        { skill: "english", level: 12, path: "legal", tip: "英语→法律服务" },
        { skill: "medicine", level: 5, path: "medical", tip: "医学→医疗护理" },
        { skill: "medicine", level: 10, path: "doctor", tip: "医学深入→医师" },
        {
          skill: "driving",
          level: 10,
          path: "logistics",
          tip: "驾驶→物流快递",
        },
        {
          skill: "repair",
          level: 10,
          path: "public_institution",
          tip: "维修→事业单位（技术岗）",
        },
      ];
      var matched = [];
      for (var mi = 0; mi < skillPathMap.length; mi++) {
        var sp = skillPathMap[mi];
        var skData = skills[sp.skill];
        var skLv = skData ? skData.level || 0 : 0;
        if (skLv >= sp.level && CAREER_PATHS[sp.path]) {
          matched.push({ pathKey: sp.path, tip: sp.tip, level: skLv });
        }
      }
      if (matched.length > 0) {
        html +=
          '<div style="font-size:10px;color:var(--text-secondary);">根据你的技能积累，推荐职业方向：<br>';
        for (var mi2 = 0; mi2 < matched.length; mi2++) {
          var mp = CAREER_PATHS[matched[mi2].pathKey];
          html +=
            '<span style="display:inline-block;padding:2px 6px;margin:2px;background:rgba(74,158,92,0.1);border-radius:4px;cursor:pointer;" onclick="showCareerPathPreviewModal(\'' +
            matched[mi2].pathKey +
            "')\">" +
            mp.icon +
            " " +
            mp.name +
            " (Lv." +
            matched[mi2].level +
            ")</span> ";
        }
        html += "</div>";
      } else {
        html +=
          '<div style="font-size:10px;color:var(--text-muted);">💡 继续在街头工作中提升技能，满足条件后可直接投递对口职位。</div>';
      }
      html += "</div>";
    }
  }

  // ---- 职业路径选择（没有工作时显示，按分类分组 + 推荐） ----
  if (!currentJob) {
    html += '<div class="section">';

    // --- 推荐路径（基于技能/属性匹配度） ---
    var recs =
      typeof getRecommendedCareerPaths === "function"
        ? getRecommendedCareerPaths(state)
        : [];
    if (recs.length > 0 && recs[0].score > 15) {
      html += '<h3 style="font-size:13px;">🌟 推荐路径</h3>';
      html +=
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px;">';
      for (var ri = 0; ri < recs.length; ri++) {
        var rp = recs[ri];
        var rEntry = rp.path.levels[0];
        var rMax = rp.path.levels[rp.path.levels.length - 1];
        var rMeet = checkCareerPromotion(state, rp.key, rEntry);
        html +=
          '<div class="card" style="padding:8px;cursor:pointer;border-left:3px solid ' +
          (rMeet ? "var(--success)" : "var(--text-muted)") +
          ";background:" +
          (rMeet ? "var(--bg-card)" : "var(--bg-card)") +
          ';" onclick="showCareerPathPreviewModal(\'' +
          rp.key +
          "')\">";
        html +=
          '<div style="font-size:12px;font-weight:bold;">' +
          rp.path.icon +
          " " +
          rp.path.name +
          "</div>";
        html +=
          '<div style="font-size:10px;color:var(--text-muted);">匹配度 <span style="color:var(--accent);font-weight:bold;">' +
          rp.score +
          "%</span> · ¥" +
          rEntry.salary.toLocaleString() +
          " → " +
          rMax.salary.toLocaleString() +
          "</div>";
        html +=
          '<div style="font-size:9px;margin-top:2px;">' +
          (rMeet
            ? "✅ 可投递 · 点击预览"
            : "⚠️ " +
              (_renderMissingSummary(
                checkCareerPromotionDetailed(state, rp.key, rEntry),
              ) || "条件不足") +
              " · 点击查看") +
          "</div>";
        html += "</div>";
      }
      html += "</div>";
    }

    // --- 按分类展示所有路径（v3.48：可折叠分类 + 薪资范围 + 路线预览入口）---
    html += '<h3 style="font-size:13px;">📂 所有职业方向</h3>';
    var catOrder = ["white_collar", "service", "blue_collar_gov"];
    for (var ci = 0; ci < catOrder.length; ci++) {
      var catId = catOrder[ci];
      var catPaths = [];
      for (var pk in CAREER_PATHS) {
        if (CAREER_PATHS[pk].category === catId) catPaths.push(pk);
      }
      if (catPaths.length === 0) continue;

      var catLabel =
        typeof getCategoryLabel === "function"
          ? getCategoryLabel(catId)
          : catId;
      var catCollapseId = "career-cat-" + catId;
      html +=
        "<div class=\"career-cat-header\" style=\"margin:8px 0 4px;font-size:12px;font-weight:bold;color:var(--text-secondary);padding:6px 8px;border:1px solid var(--border);border-radius:6px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;\" onclick=\"this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'':'none';this.querySelector('.caret').textContent=this.nextElementSibling.style.display==='none'?'▸':'▾';\">" +
        "<span>" +
        catLabel +
        ' <span style="font-weight:normal;font-size:10px;color:var(--text-muted);">' +
        catPaths.length +
        "条路径</span></span>" +
        '<span class="caret" style="font-size:10px;">▾</span></div>';
      html +=
        '<div class="career-path-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;">';

      for (var pi = 0; pi < catPaths.length; pi++) {
        var pathKey = catPaths[pi];
        var pData = CAREER_PATHS[pathKey];
        var entryLevel = pData.levels[0];
        var maxLevel = pData.levels[pData.levels.length - 1];
        var meetReqs = checkCareerPromotion(state, pathKey, entryLevel);
        var reqsHtml = renderPromotionReqs(state, pathKey, entryLevel);

        // v3.48：点击卡片打开预览弹窗，不再直接投递/显示不足
        html +=
          '<div class="card" style="padding:8px;cursor:pointer;opacity:' +
          (meetReqs ? "1" : "0.7") +
          ";border-left-color:" +
          (meetReqs ? "var(--success)" : "var(--text-muted)") +
          ';" onclick="showCareerPathPreviewModal(\'' +
          pathKey +
          "')\">";
        html +=
          '<div style="font-size:12px;font-weight:bold;">' +
          pData.icon +
          " " +
          pData.name +
          "</div>";
        html +=
          '<div style="font-size:10px;color:var(--text-secondary);margin:2px 0;">' +
          entryLevel.name +
          " · ¥" +
          entryLevel.salary.toLocaleString() +
          " → " +
          maxLevel.salary.toLocaleString() +
          "</div>";
        html +=
          '<div style="font-size:9px;color:var(--text-muted);">' +
          entryLevel.desc +
          "</div>";
        html +=
          '<div style="font-size:9px;color:var(--text-muted);margin-top:2px;">' +
          reqsHtml +
          "</div>";
        if (meetReqs) {
          html +=
            '<div style="font-size:9px;color:var(--accent);margin-top:4px;">✅ 可投递 · 点击预览路线</div>';
        } else {
          var _missingDetails = _renderMissingSummary(
            checkCareerPromotionDetailed(state, pathKey, entryLevel),
          );
          html +=
            '<div style="font-size:9px;color:var(--warning);margin-top:4px;">⚠️ ' +
            (_missingDetails || "条件不足") +
            " · 点击查看</div>";
        }
        html += "</div>";
      }
      html += "</div>";
    }
    html += "</div>";
  }

  // ---- 晋升历史（v3.48：可视化时间线） ----
  if (careerHistory.length > 0) {
    html +=
      '<div class="section" style="margin-top:12px;"><h3>📜 职业历程</h3>';
    html += '<div style="max-height:200px;overflow-y:auto;">';
    var sorted = careerHistory.slice().sort(function (a, b) {
      return b.day - a.day;
    });
    html += '<div style="position:relative;padding-left:16px;">';
    // 竖线
    html +=
      '<div style="position:absolute;left:5px;top:0;bottom:0;width:2px;background:var(--border);"></div>';
    sorted.forEach(function (h) {
      var isPromo =
        h.event.indexOf("晋升") === 0 || h.event.indexOf("跳槽") === 0;
      var dotColor = isPromo ? "var(--accent)" : "var(--text-muted)";
      html +=
        '<div style="position:relative;margin-bottom:6px;padding:6px 8px;font-size:11px;background:var(--bg-secondary);border-radius:6px;">';
      // 圆点
      html +=
        '<div style="position:absolute;left:-14px;top:10px;width:8px;height:8px;border-radius:50%;background:' +
        dotColor +
        ';border:2px solid var(--bg-primary);"></div>';
      html +=
        '<span style="color:var(--text-muted);font-size:9px;">第' +
        h.day +
        "天</span> " +
        h.event;
      html += "</div>";
    });
    html += "</div></div></div>";
  }

  html += "</div>";
  parent.innerHTML = html;
}

/** 事业概览子面板 */
/** P1-7：增强版事业总览——数据可视化 */
function renderCareerOverview(state, parent) {
  var html = '<div class="tab-content">';

  // === 一、当前职业状态卡 ===
  var career = state.career || {};
  var job = career.currentJob;
  var cap = ensureCareerCapital(state);
  if (job) {
    var pathData = CAREER_PATHS[job.path];
    var levelData = pathData
      ? pathData.levels.find(function (l) {
          return l.id === job.levelId;
        })
      : null;
    var nextLevel = getNextCareerLevel(job.path, job.levelId);
    var certBonus = _calcCertSalaryBonus(state, job.path, job.salary || 5000);
    html +=
      '<div class="section"><h3>💼 当前职位</h3><div class="card" style="padding:12px;">';
    html +=
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:6px;">';
    html += "<div>";
    html +=
      '<div style="font-size:14px;font-weight:bold;">' +
      (pathData ? pathData.icon : "💼") +
      " " +
      (job.levelName || "在职") +
      "</div>";
    html +=
      '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">' +
      (pathData ? pathData.name : "") +
      " · 在职第 " +
      (job.workDays || 0) +
      " 天</div>";
    html += "</div>";
    html += '<div style="text-align:right;">';
    html +=
      '<div style="font-size:15px;color:var(--accent);font-weight:bold;">¥' +
      (job.salary || 0).toLocaleString() +
      "/月</div>";
    if (certBonus > 0) {
      var bonusRate = Math.round((certBonus / (job.salary || 1)) * 100);
      html +=
        '<div style="font-size:10px;color:var(--success);">+ 证书加成 ¥' +
        certBonus.toLocaleString() +
        ' <span style="font-size:9px;">(+' +
        bonusRate +
        "%)</span></div>";
    }
    html += "</div>";
    html += "</div>";

    // 业绩 & 倦怠条
    var perf = job.performance || 50;
    var burnout = cap.burnout || 0;
    var perfColor =
      perf >= 70
        ? "var(--success)"
        : perf >= 40
          ? "var(--warning)"
          : "var(--danger)";
    var burnColor =
      burnout >= 80
        ? "var(--danger)"
        : burnout >= 50
          ? "var(--warning)"
          : "var(--accent)";
    html += '<div style="margin-top:10px;">';
    html +=
      '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:10px;color:var(--text-muted);">';
    html += "<span>📊 业绩 " + perf + "%</span>";
    html +=
      '<div style="flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">';
    html +=
      '<div style="height:100%;width:' +
      perf +
      "%;background:" +
      perfColor +
      ';border-radius:3px;transition:width 0.3s;"></div></div></div>';
    html +=
      '<div style="display:flex;align-items:center;gap:6px;font-size:10px;color:var(--text-muted);">';
    html += "<span>🔥 倦怠 " + Math.round(burnout) + "%</span>";
    html +=
      '<div style="flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">';
    html +=
      '<div style="height:100%;width:' +
      Math.min(100, burnout) +
      "%;background:" +
      burnColor +
      ';border-radius:3px;transition:width 0.3s;"></div></div></div>';
    html += "</div>";
    // [全系统自洽修复] 域C联动: 高倦怠→健康预警展示 (C→G/F 联动)
    if (burnout >= 60) {
      var bleedWarn = Math.floor((burnout - 60) / 20);
      if (bleedWarn >= 1) {
        html +=
          '<div style="margin-top:4px;font-size:9px;color:var(--danger);">⚠️ 高压侵蚀健康：每日最高-' +
          bleedWarn +
          "健康，务必安排休息</div>";
      }
    }

    // 晋升进度
    if (nextLevel) {
      var canPromote = checkCareerPromotion(state, job.path, nextLevel);
      html +=
        '<div style="margin-top:10px;padding:8px;background:var(--bg-secondary);border-radius:6px;">';
      html +=
        '<div style="font-size:10px;font-weight:bold;margin-bottom:4px;">⬆️ 下一级：' +
        nextLevel.name +
        " ¥" +
        nextLevel.salary.toLocaleString() +
        "/月</div>";
      html +=
        '<div style="font-size:9px;color:' +
        (canPromote ? "var(--success)" : "var(--text-muted)") +
        ';">' +
        renderPromotionReqs(state, job.path, nextLevel) +
        "</div>";
      if (canPromote)
        html +=
          '<button class="btn btn-sm" style="margin-top:4px;" onclick="applyCareerPromotion(\'' +
          job.path +
          "','" +
          nextLevel.id +
          "')\">⬆️ 立即晋升</button>";
      html += "</div>";
    } else {
      html +=
        '<div style="margin-top:8px;font-size:11px;color:var(--accent);">🏆 已到达路径最高级！考虑跳槽或创业</div>';
    }
    html += "</div></div>";
  }

  // === 1.5、副业状态（有副业时显示）===
  if (state.sideHustle && state.sideHustle.active) {
    var sh = state.sideHustle;
    var shTypeNames = {
      stall: "摆摊",
      driving: "代驾",
      freelance: "自由职业",
      content: "内容创作",
      sharing: "共享经济",
      community: "社区服务",
    };
    var shTypeName = shTypeNames[sh.type] || sh.type || "未知";
    html +=
      '<div class="section" style="margin-top:8px;"><h3>🔀 副业状态</h3><div class="card" style="padding:10px;">';
    html +=
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
    html +=
      '<div style="font-size:12px;font-weight:bold;">🔀 ' +
      shTypeName +
      '</div><div style="font-size:10px;color:var(--success);">● 进行中</div>';
    html += "</div>";
    html +=
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;font-size:10px;color:var(--text-muted);">';
    html +=
      '<div>💰 今日收入: <b style="color:var(--accent);">¥' +
      (sh.income || 0).toLocaleString() +
      "</b></div>";
    html +=
      '<div>📢 口碑: <b style="color:var(--accent);">' +
      Math.round(sh.reputation || 0) +
      "</b></div>";
    html +=
      '<div>😫 疲劳: <b style="color:' +
      ((sh.fatigue || 0) > 60 ? "var(--danger)" : "var(--accent)") +
      '">' +
      Math.round(sh.fatigue || 0) +
      "</b></div>";
    html += "</div></div></div>";
  }

  // === [全系统自洽修复] 域C 联动增强: 技能连携状态（C→F，daily_pipeline 计算但 career UI 未展示）===
  if (
    state.skillSynergies &&
    ((state.skillSynergies.dual && Object.keys(state.skillSynergies.dual).length) ||
      (state.skillSynergies.triple &&
        Object.keys(state.skillSynergies.triple).length) ||
      (state.skillSynergies.theme &&
        Object.keys(state.skillSynergies.theme).length))
  ) {
    html +=
      '<div class="section" style="margin-top:8px;"><h3>🔗 技能连携</h3><div class="card" style="padding:10px;">';
    var _synergyTypes = [
      { key: "dual", label: "双技能", color: "#4a9e5c" },
      { key: "triple", label: "三技能", color: "#4a6cf7" },
      { key: "theme", label: "主题", color: "#e8b84c" },
    ];
    for (var _sti = 0; _sti < _synergyTypes.length; _sti++) {
      var _st = _synergyTypes[_sti];
      var _syn = state.skillSynergies[_st.key];
      if (!_syn) continue;
      for (var _sid in _syn) {
        if (!_syn.hasOwnProperty(_sid)) continue;
        var _s = _syn[_sid];
        if (!_s) continue;
        var _name = _s.name || _sid;
        html +=
          '<div style="font-size:11px;font-weight:bold;color:' +
          _st.color +
          ';margin-top:4px;">' +
          _st.label +
          " · " +
          _wkE(_name) +
          "</div>";
        if (_s.effects) {
          for (var _ek in _s.effects) {
            if (!_s.effects.hasOwnProperty(_ek)) continue;
            if (_ek === "unlockJobs" || _ek === "unlockActions") continue;
            html +=
              '<div style="font-size:10px;color:var(--text-secondary);margin-left:8px;">• ' +
              _wkE(_ek) +
              ": " +
              _wkE(String(_s.effects[_ek])) +
              "</div>";
          }
        }
      }
    }
    html += "</div></div>";
  }

  // === [全系统自洽修复] 域C R357 联动增强: C→F 技能提升进度(晋升所需技能XP缺口可视化) ===
  if (job) {
    var _nextLevel = getNextCareerLevel(job.path, job.levelId);
    if (_nextLevel && _nextLevel.reqSkills) {
      var _skillGapItems = [];
      for (var _sgSkill in _nextLevel.reqSkills) {
        var _sgReq = _nextLevel.reqSkills[_sgSkill];
        var _sgCur = _getSkillValue(state, _sgSkill);
        var _sgLabel = _careerLabelMap[_sgSkill] || _sgSkill;
        var _sgSkillData = state.skills && state.skills[_sgSkill];
        var _sgXp = _sgSkillData ? (_sgSkillData.xp || 0) : 0;
        var _sgXpNeeded = Math.max(0, (_sgReq - _sgCur) * 100 - _sgXp);
        _skillGapItems.push({
          label: _sgLabel, current: _sgCur, required: _sgReq,
          xp: _sgXp, xpNeeded: _sgXpNeeded, met: _sgCur >= _sgReq
        });
      }
      if (_skillGapItems.length > 0) {
        html += '<div class="section" style="margin-top:8px;"><h3>📈 技能提升进度</h3><div class="card" style="padding:10px;">';
        html += '<div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;">下一级「' + _nextLevel.name + '」所需技能 — 点击技能Tab查看详情</div>';
        for (var _sgi = 0; _sgi < _skillGapItems.length; _sgi++) {
          var _sg = _skillGapItems[_sgi];
          var _sgColor = _sg.met ? 'var(--success)' : 'var(--warning)';
          var _sgIcon = _sg.met ? '✅' : '⬆️';
          html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:10px;">';
          html += '<span style="color:' + _sgColor + ';">' + _sgIcon + ' ' + _sg.label + ' Lv.' + _sg.current + '/' + _sg.required + '</span>';
          if (!_sg.met) {
            html += '<span style="font-size:8px;color:var(--text-muted);">(约需' + _sg.xpNeeded + 'XP)</span>';
          }
          var _sgPct = Math.min(100, Math.round((_sg.current / Math.max(1, _sg.required)) * 100));
          html += '<div style="flex:1;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;">';
          html += '<div style="height:100%;width:' + _sgPct + '%;background:' + _sgColor + ';border-radius:2px;"></div></div>';
          html += '</div>';
        }
        html += '</div></div>';
      }
    }
  }

  // === 二、职业资本雷达卡 ===
  html +=
    '<div class="section" style="margin-top:8px;"><h3>📊 职业资本</h3><div class="card" style="padding:10px;">';
  var capitals = [
    {
      key: "industryResources",
      label: "行业资源",
      icon: "🏭",
      color: "#4fc3f7",
    },
    { key: "clientLeads", label: "客户线索", icon: "🤝", color: "#81c784" },
    { key: "reputation", label: "职业声誉", icon: "⭐", color: "#ffb74d" },
    { key: "partnerTrust", label: "合作信任", icon: "🔗", color: "#ce93d8" },
    { key: "burnout", label: "职业倦怠", icon: "🔥", color: "#ef5350" },
  ];
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
  capitals.forEach(function (c) {
    var val = Math.round(cap[c.key] || 0);
    var pct = Math.min(100, val);
    var isBurnout = c.key === "burnout";
    var barColor = isBurnout
      ? val >= 80
        ? "#ef5350"
        : val >= 50
          ? "#ffb74d"
          : "#81c784"
      : c.color;
    html += '<div style="font-size:10px;">';
    html +=
      '<div style="display:flex;justify-content:space-between;color:var(--text-muted);margin-bottom:2px;">';
    html +=
      "<span>" +
      c.icon +
      " " +
      c.label +
      "</span><span>" +
      val +
      "</span></div>";
    html +=
      '<div style="height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;">';
    html +=
      '<div style="height:100%;width:' +
      pct +
      "%;background:" +
      barColor +
      ';border-radius:3px;"></div></div></div>';
  });
  html += "</div>";
  // 证书加成提示
  if (job) {
    var certB = _calcCertSalaryBonus(state, job.path, job.salary || 5000);
    var certs = state.certificates || [];
    html +=
      '<div style="margin-top:8px;font-size:10px;color:var(--text-muted);">🎓 证书加成：每月额外 ¥' +
      certB.toLocaleString() +
      "（持有 " +
      certs.length +
      " 张证书）</div>";
  }
  html += "</div></div>";

  // === 职业路径全景图（v3.48：鸟瞰所有路径的玩家进度）===
  html +=
    '<div class="section" style="margin-top:8px;"><h3>🗺️ 职业路径全景</h3>';
  html +=
    '<div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;">你对10条职业路线的掌握程度 — 点击任意路线查看详情</div>';
  html +=
    '<div class="career-panorama-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">';
  var catOrder = ["white_collar", "service", "blue_collar_gov"];
  for (var _pki = 0; _pki < catOrder.length; _pki++) {
    var _catId = catOrder[_pki];
    for (var _pk2 in CAREER_PATHS) {
      if (CAREER_PATHS[_pk2].category !== _catId) continue;
      var _pd = CAREER_PATHS[_pk2];
      var _entryOk = checkCareerPromotion(state, _pk2, _pd.levels[0]);
      var _curLevel = job && job.path === _pk2 ? job.levelId : null;
      var _maxLevel = _pd.levels[_pd.levels.length - 1].id;
      var _status, _statusColor;
      if (_curLevel) {
        var _promotable = checkCareerPromotion(
          state,
          _pk2,
          _pd.levels[_pd.levels.length - 1],
        );
        if (_curLevel === _maxLevel && _promotable) {
          _status = "🏆 已满级";
          _statusColor = "var(--accent)";
        } else {
          _status = "⭐ 当前";
          _statusColor = "var(--success)";
        }
      } else if (_entryOk) {
        _status = "✅ 可投递";
        _statusColor = "var(--text-secondary)";
      } else {
        _status = "🔒 未解锁";
        _statusColor = "var(--text-muted)";
      }
      html +=
        '<div class="card" style="padding:6px 8px;cursor:pointer;border:1px solid ' +
        (_curLevel ? "rgba(74,158,92,0.3)" : "var(--border)") +
        ';" onclick="showCareerPathPreviewModal(\'' +
        _pk2 +
        "')\">";
      html +=
        '<div style="display:flex;justify-content:space-between;align-items:center;">';
      html +=
        '<span style="font-size:11px;font-weight:bold;">' +
        _pd.icon +
        " " +
        _pd.name +
        "</span>";
      html +=
        '<span style="font-size:9px;color:' +
        _statusColor +
        ';">' +
        _status +
        "</span>";
      html += "</div>";
      if (_curLevel) {
        var _curLvIdx = -1;
        for (var _li = 0; _li < _pd.levels.length; _li++) {
          if (_pd.levels[_li].id === _curLevel) {
            _curLvIdx = _li;
            break;
          }
        }
        html += '<div style="margin-top:3px;display:flex;gap:2px;">';
        for (var _pi2 = 0; _pi2 < _pd.levels.length; _pi2++) {
          html +=
            '<div style="flex:1;height:3px;border-radius:2px;background:' +
            (_pi2 <= _curLvIdx ? "var(--accent)" : "rgba(255,255,255,0.1)") +
            ';"></div>';
        }
        html +=
          '</div><div style="font-size:9px;color:var(--text-muted);margin-top:2px;">' +
          job.levelName +
          " · ¥" +
          (job.salary || 0).toLocaleString() +
          "</div>";
      }
      html += "</div>";
    }
  }
  html += "</div></div>";

  // === 无工作状态：推荐路径 + 证书引导 ===
  if (!job) {
    var _sd = (state.flags && state.flags._totalStreetDays) || 0;
    html +=
      '<div class="section" style="margin-top:8px;"><h3>🎯 事业准备</h3><div class="card" style="padding:10px;">';
    if (_sd > 0) {
      html +=
        '<div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px;">🌆 已积累 <strong>' +
        _sd +
        "</strong> 天街头工作经验</div>";
    }
    var _r2 =
      typeof getRecommendedCareerPaths === "function"
        ? getRecommendedCareerPaths(state)
        : [];
    if (_r2.length > 0) {
      html +=
        '<div style="font-size:11px;font-weight:bold;margin-bottom:4px;">🌟 推荐职业方向</div><div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">';
      for (var _ri2 = 0; _ri2 < _r2.length; _ri2++) {
        html +=
          '<span style="padding:3px 8px;background:rgba(74,158,92,0.1);border-radius:12px;font-size:10px;cursor:pointer;" onclick="switchCareerSubTab(\'career_jobs\')">' +
          _r2[_ri2].path.icon +
          " " +
          _r2[_ri2].path.name +
          ' <span style="color:var(--accent);">' +
          _r2[_ri2].score +
          "%</span></span>";
      }
      html += "</div>";
    }
    var _certs = state.certificates || [];
    var _avail =
      typeof getAvailableCertificates === "function"
        ? getAvailableCertificates(state)
        : [];
    html +=
      '<div style="font-size:10px;color:var(--text-muted);">🎓 已获证书 ' +
      _certs.length +
      " 张";
    if (_avail.length > 0) {
      html += " · 可考 " + _avail.length + " 张（培训中心→考证）";
    }
    html +=
      '</div><div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap;">';
    html +=
      '<button class="btn btn-xs" style="font-size:10px;min-height:36px;" onclick="switchCareerSubTab(\'career_jobs\')">💼 查看职业路线</button>';
    html +=
      "<button class=\"btn btn-xs\" style=\"font-size:10px;min-height:36px;\" onclick=\"showLocationNavModal('trainingCenter', '🏫 去培训中心考证书', 'actions')\">🎓 去考证书</button>";
    html += "</div></div></div>";
  }

  // === 三、跳槽机会提示（有offer时） ===
  if (job) {
    var offers = generateJobOffers(state);
    if (offers.length) {
      html +=
        '<div class="section" style="margin-top:8px;"><h3>🔍 跳槽机会</h3>';
      html +=
        '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">切换到「上班族」Tab可查看详情并接受offer</div>';
      offers.forEach(function (of) {
        html +=
          '<div class="card" style="padding:6px 8px;margin:3px 0;font-size:11px;display:flex;justify-content:space-between;align-items:center;">';
        html +=
          "<span>" +
          of.levelName +
          '</span><span style="color:var(--accent);font-weight:bold;">¥' +
          of.salary.toLocaleString() +
          "</span></div>";
      });
      html += "</div>";
    }
  }

  // === 四、创业状态 ===
  var startup = state.startup;
  if (startup && startup.status !== "none" && startup.company) {
    html +=
      '<div class="section" style="margin-top:8px;"><h3>🚀 创业状态</h3><div class="card" style="padding:10px;font-size:11px;">';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">';
    html += "<div>🏢 " + (startup.company.name || "未命名") + "</div>";
    html +=
      "<div>📊 估值 ¥" +
      (startup.company.valuation || 0).toLocaleString() +
      "</div>";
    html +=
      "<div>💰 现金 ¥" +
      (startup.company.cash || 0).toLocaleString() +
      "</div>";
    html += "<div>👥 " + (startup.company.employees || []).length + " 人</div>";
    html += "</div></div></div>";
  }
  // [全系统自洽修复] 域C 联动增强(C→E): 职业收入→投资潜力估算
  if (state.career && state.career.currentJob) {
    var _job = state.career.currentJob;
    var _salary = _job.salary || 0;
    if (_salary >= 10000) {
      var _investPotential = Math.round(_salary * 0.3);
      html += '<div class="section" style="margin-top:8px;"><h3>📈 投资潜力</h3><div class="card" style="padding:10px;font-size:11px;">';
      html += '<div>月薪 ¥' + _salary.toLocaleString() + '，建议每月 ' + Math.round(0.3 * 100) + '%（¥' + _investPotential.toLocaleString() + '）用于投资。</div>';
      html += '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">💡 稳定的职业收入是投资的基石，建议先建立3-6个月生活费的应急储备金。</div>';
      html += '</div></div>';
    }
  }

  // === 五、Phase2 过渡仪式（峰终定律·最后一峰）===
  // 打工末期达标 → 一次性引导弹窗，避免每天刷屏
  if (
    state.startup &&
    state.startup.status === "none" &&
    state.flags &&
    !state.flags._phase2RitualShown
  ) {
    var _totalCash =
      (state.resources.cash || 0) + (state.resources.bankBalance || 0);
    var _workDays =
      (state.career &&
        state.career.currentJob &&
        state.career.currentJob.workDays) ||
      0;
    // [MC平衡] 街头策略也可触发创业：总资产≥¥15,000 或 在职≥90天+总资产≥¥30,000
    var _streetTotalEarned = (state.resources && state.resources.totalEarned) || 0;
    var _canStartup = (_totalCash >= 15000 && _streetTotalEarned >= 20000) || (_totalCash >= 30000 && _workDays >= 90);
    if (_canStartup) {
      state.flags._phase2RitualShown = true;
      // 异步弹仪式弹窗（避免 DOM 嵌套）
      setTimeout(function () {
        if (typeof showStartupRegisterModal === "function") {
          showStartupRegisterModal();
        }
      }, 50);
      html +=
        '<div class="card" style="padding:10px;margin-top:8px;border:1px solid var(--accent);background:color-mix(in srgb, var(--accent) 10%, var(--bg-card));">';
      html +=
        '<div style="font-size:13px;font-weight:bold;">🎉 你已具备创业基础</div>';
      html +=
        '<div style="font-size:10px;color:var(--text-muted);margin-top:3px;line-height:1.6;">' +
        "总资产 ¥" +
        _totalCash.toLocaleString() +
        " · 在职 " +
        _workDays +
        " 天<br>" +
        "系统将为你弹出创业注册引导。如果暂时不创业，可在事业发展页随时点击「开公司」。</div>";
      html +=
        '<button class="btn btn-sm btn-primary" style="margin-top:6px;font-size:11px;padding:5px 10px;" ' +
        "onclick=\"typeof showStartupRegisterModal === 'function' &amp;&amp; showStartupRegisterModal()\">" +
        "🚀 去开公司</button>";
      html += "</div>";
    }
  }

  // === 六、智能建议（剧本专属优先级 hook，损失厌恶抓手）===
  html +=
    '<div class="card" style="padding:10px;background:var(--bg-warning);margin-top:8px;">';
  html +=
    '<div style="font-size:11px;font-weight:bold;margin-bottom:4px;">💡 当前建议</div>';
  html +=
    '<ul style="font-size:10px;color:var(--text-muted);margin:0 0 0 14px;padding:0;line-height:1.8;">';
  // v3.1 ⑦ 剧本专属建议 — 用玩家的"压力源"数字做损失厌恶钩子
  var _scnId = (state.flags && state.flags._scenarioId) || "";
  var _debt =
    state.resources && state.resources.debt ? state.resources.debt : 0;
  var _day = state.player && state.player.day ? state.player.day : 1;
  if (_scnId === "fresh_grad" && !job) {
    html += "<li>🎓 应届起薪低，赶紧投简历+考第一本证书涨¥2k</li>";
  } else if (_scnId === "laid_off" && _debt > 0) {
    html +=
      "<li>⚠️ 下岗再就业培训还 ¥" +
      _debt.toLocaleString() +
      "，每天损失 ¥200+ 潜在收入</li>";
  } else if (_scnId === "foreign_worker" && _debt > 10000) {
    html += "<li>🏥 家里手术费倒计时，优先攒钱别炒股</li>";
  } else if (_scnId === "midlife_crisis" && _day > 180) {
    html += "<li>🔄 职场后浪月薪¥8k，你夜校充电了吗</li>";
  } else if (
    _scnId === "second_gen" &&
    (!startup || startup.status === "none")
  ) {
    html += "<li>🏦 家族资源是你优势，认识叔伯攒人脉</li>";
  } else if (_scnId === "small_town_grinder") {
    html += "<li>📚 智力是硬通货，培训中心考到证书就是铁饭碗</li>";
  }
  if (!job) {
    html += "<li>投递一份固定工作，获得稳定收入和晋升路径</li>";
  } else {
    var _perf = job.performance || 50;
    var _burnout = cap.burnout || 0;
    var _wdays = job.workDays || 0;
    if (_burnout >= 70)
      html +=
        "<li>⚠️ 倦怠过高（" +
        Math.round(_burnout) +
        "%），优先调休或旅行降压</li>";
    if (_perf < 50) html += "<li>📈 业绩不足，每天做项目（AP3）提升绩效</li>";
    if ((cap.clientLeads || 0) < 15 && (cap.reputation || 0) < 30)
      html += "<li>🤝 多闲聊同事、做项目积累线索，达到跳槽门槛</li>";
    if (_wdays >= 365 && _perf >= 70)
      html +=
        "<li>💰 年度考核业绩" +
        _perf +
        "分，有望获得" +
        (_perf >= 85 ? "S级（+12%）" : "A级（+8%）") +
        "调薪</li>";
    var nextL = getNextCareerLevel(job.path, job.levelId);
    if (nextL && checkCareerPromotion(state, job.path, nextL))
      html += "<li>⬆️ 晋升条件已满足，可立即申请！</li>";
  }
  if (!startup || startup.status === "none") {
    var cash = (state.resources && state.resources.cash) || 0;
    var disc = getCareerCapitalStartupDiscount(state);
    var startupCost = Math.max(20000, Math.round(cash * (1 - disc)));
    html +=
      "<li>🚀 创业启动资金约¥" +
      startupCost.toLocaleString() +
      "，职业资本折扣 " +
      Math.round(disc * 100) +
      "%</li>";
  }
  html += "</ul></div>";

  // 导航按钮（带弹窗说明）
  html +=
    '<div style="margin-top:14px;padding:10px;background:rgba(0,180,216,0.05);border:1px solid rgba(0,180,216,0.2);border-radius:8px;text-align:center;">' +
    '<div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">🔗 快速跳转</div>' +
    '<button class="btn btn-sm nav-action-btn" style="margin:2px 4px;min-height:36px;" ' +
    "onclick=\"showCareerNavModal('career_jobs', 'career_dev', '💼 查看上班族职位', " +
    "'在这里可以浏览各行业职业路线，从基层做起，逐步晋升至管理层。')" +
    '">💼 查看上班族职位</button>' +
    ' <span style="font-size:10px;color:var(--text-muted);">|</span> ' +
    '<button class="btn btn-sm nav-action-btn" style="margin:2px 4px;min-height:36px;" ' +
    "onclick=\"showCareerNavModal('career_startup', 'career_dev', '🚀 创业系统', " +
    "'从零开始创办公司，需要足够的资金、人脉和行业经验。')" +
    '">🚀 创业系统</button>' +
    ' <span style="font-size:10px;color:var(--text-muted);">|</span> ' +
    '<button class="btn btn-sm nav-action-btn" style="margin:2px 4px;min-height:36px;" ' +
    "onclick=\"showLocationNavModal('school', '🎓 去大学城提升学历', 'me', " +
    "'大学城有图书馆、培训班，在这里可以参加自考提升学历，接编程外包单赚外快。', 'me_growth')" +
    '">🎓 去大学城提升学历</button>' +
    "</div>";

  html += "</div>";
  parent.innerHTML = html;
}

// ====== 工具函数 ======

// ====== 事业主动行动（v3.9：社交/业绩/调休，激活同事网络数据流） ======

/** 入职时初始化同事网络（initColleagueNetwork 只建空壳，这里生成初始同事） */
function initCareerColleagues(state) {
  if (typeof initColleagueNetwork === "function") {
    initColleagueNetwork(state);
  } else {
    if (!state.corporate) state.corporate = {};
    if (!state.corporate.colleagues) {
      state.corporate.colleagues = { network: [], factions: [], mentees: [] };
    }
  }
  var net = state.corporate.colleagues.network;
  if (net.length) return;
  var names = [
    "老王",
    "小张",
    "小李",
    "小刘",
    "小陈",
    "小赵",
    "小周",
    "小吴",
    "小郑",
    "小孙",
    "小徐",
    "小高",
  ];
  var traits = [
    { type: "热心肠", bonus: "愿意帮忙" },
    { type: "老油条", bonus: "经验丰富" },
    { type: "卷王", bonus: "工作能力强" },
    { type: "和事佬", bonus: "调解能力" },
    { type: "八卦王", bonus: "信息灵通" },
    { type: "老实人", bonus: "可靠" },
    { type: "社交达人", bonus: "人脉广" },
    { type: "技术宅", bonus: "技术强" },
  ];
  var n = Random.int(2, 3);
  for (var i = 0; i < n; i++) {
    net.push({
      id:
        "colleague_" +
        state.player.day +
        "_" +
        i +
        "_" +
        Random.int(10000, 99999),
      name: Random.fromArray(names),
      role: "neutral",
      personality: Random.fromArray(traits),
      relationship: 20 + Random.int(0, 19),
      trust: 15 + Random.int(0, 14),
      lastInteraction: state.player.day,
    });
  }
}

/** 职场社交行动（请客/闲聊/拜师），操作 state.corporate.colleagues.network */
function careerSocialAction(action, colleagueId) {
  var state = StateManager.getState();
  if (!state.career || !state.career.currentJob) {
    StateManager.addMessage("⚠️ 你目前没有工作", "warning");
    return;
  }
  var net =
    state.corporate &&
    state.corporate.colleagues &&
    state.corporate.colleagues.network;
  if (!net || !net.length) {
    StateManager.addMessage("⚠️ 同事网络未初始化", "warning");
    return;
  }
  var c = null;
  for (var i = 0; i < net.length; i++) {
    if (net[i].id === colleagueId) {
      c = net[i];
      break;
    }
  }
  if (!c) {
    StateManager.addMessage("⚠️ 找不到该同事", "warning");
    return;
  }
  var p = state.player;
  var cap = ensureCareerCapital(state);

  if (action === "meal") {
    if ((state.resources.cash || 0) < 50) {
      StateManager.addMessage("⚠️ 现金不足¥50", "warning");
      return;
    }
    if (p.actionPoints < 2) {
      StateManager.addMessage("⚠️ 行动力不足(需2)", "warning");
      return;
    }
    state.resources.cash = Math.max(0, (state.resources.cash || 0) - 50);
    p.actionPoints -= 2;
    var gain = Math.round(5 + c.relationship / 20);
    c.relationship = Math.min(100, (c.relationship || 0) + gain);
    c.trust = Math.min(100, (c.trust || 0) + 3);
    c.lastInteraction = p.day;
    cap.reputation = (cap.reputation || 0) + 0.5;
    clampCareerCapital(cap);
    StateManager.addMessage(
      "🍚 请" + c.name + "吃饭，关系+" + gain + "，信任+3",
      "success",
    );
  } else if (action === "chat") {
    if (p.actionPoints < 1) {
      StateManager.addMessage("⚠️ 行动力不足(需1)", "warning");
      return;
    }
    p.actionPoints -= 1;
    var cg = Random.int(2, 4);
    c.relationship = Math.min(100, (c.relationship || 0) + cg);
    c.lastInteraction = p.day;
    var lead = Random.chance(0.3);
    if (lead) cap.clientLeads = (cap.clientLeads || 0) + 1;
    clampCareerCapital(cap);
    StateManager.addMessage(
      "💬 和" + c.name + "闲聊，关系+" + cg + (lead ? "，获得客户线索+1" : ""),
      "info",
    );
  } else if (action === "mentor") {
    if ((c.relationship || 0) < 60) {
      StateManager.addMessage(
        "⚠️ 需与" + c.name + "关系≥60才能拜师",
        "warning",
      );
      return;
    }
    if (state.corporate.colleagues.mentorship) {
      StateManager.addMessage("⚠️ 你已有导师，先解除", "warning");
      return;
    }
    if (p.actionPoints < 2) {
      StateManager.addMessage("⚠️ 行动力不足(需2)", "warning");
      return;
    }
    p.actionPoints -= 2;
    state.corporate.colleagues.mentorship = {
      mentorId: c.id,
      mentorName: c.name,
      startedDay: p.day,
      level: 80,
    };
    c.role = "mentor";
    c.relationship = Math.min(100, (c.relationship || 0) + 5);
    cap.partnerTrust = (cap.partnerTrust || 0) + 5;
    clampCareerCapital(cap);
    StateManager.addMessage(
      "👨‍🏫 拜" + c.name + "为师！晋升推荐与危机保护已解锁",
      "success",
    );
  } else if (action === "unmentor") {
    // [全系统自洽修复] 域H 修复:导师关系死路 —— 补解除师徒入口，
    // 复活死函数 endMentorship(workplace_social.js:392，全库此前零调用方)。
    if (
      !state.corporate.colleagues.mentorship ||
      state.corporate.colleagues.mentorship.mentorId !== c.id
    ) {
      StateManager.addMessage("⚠️ " + c.name + "不是你的导师", "warning");
      return;
    }
    if (typeof endMentorship === "function") {
      endMentorship(state);
    } else {
      // 兜底：与 endMentorship 同语义的内联实现
      c.role = "ally";
      c.relationship = Math.max(40, (c.relationship || 0) - 20);
      state.corporate.colleagues.mentorship = null;
      StateManager.addMessage("👋 你结束了和" + c.name + "的导师关系。", "warning");
    }
  }
  if (typeof renderAll === "function") renderAll();
}

/** 业绩主动行动（做项目/加班/冲刺KPI） */
function careerWorkAction(type) {
  var state = StateManager.getState();
  if (!state.career || !state.career.currentJob) return;
  var job = state.career.currentJob;
  var p = state.player;
  var cap = ensureCareerCapital(state);

  if (type === "project") {
    if (p.actionPoints < 3) {
      StateManager.addMessage("⚠️ 行动力不足(需3)", "warning");
      return;
    }
    p.actionPoints -= 3;
    job.performance = Math.min(100, (job.performance || 50) + 8);
    cap.burnout = (cap.burnout || 0) + 3;
    cap.industryResources = (cap.industryResources || 0) + 2;
    var leadP = Random.chance(0.1);
    if (leadP) cap.clientLeads = (cap.clientLeads || 0) + 3;
    clampCareerCapital(cap);
    StateManager.addMessage(
      "💼 完成项目：业绩+8，行业资源+2" + (leadP ? "，意外获得客户线索+3" : ""),
      "success",
    );
  } else if (type === "overtime") {
    if (p.actionPoints < 2) {
      StateManager.addMessage("⚠️ 行动力不足(需2)", "warning");
      return;
    }
    p.actionPoints -= 2;
    job.performance = Math.min(100, (job.performance || 50) + 5);
    var ot = Math.round((job.salary || 5000) / 30);
    state.resources.cash = (state.resources.cash || 0) + (ot || 0);
    state.resources.totalEarned = (state.resources.totalEarned || 0) + ot;
    cap.burnout = (cap.burnout || 0) + 5;
    if (state.status)
      state.status.health = Math.max(0, (state.status.health || 100) - 2);
    clampCareerCapital(cap);
    StateManager.addMessage(
      "🌙 加班：业绩+5，加班费¥" + ot + "，倦怠+5，健康-2",
      "info",
    );
  } else if (type === "kpi") {
    if ((job.performance || 50) < 40) {
      StateManager.addMessage("⚠️ 业绩需≥40才能冲刺KPI", "warning");
      return;
    }
    if (p.actionPoints < 4) {
      StateManager.addMessage("⚠️ 行动力不足(需4)", "warning");
      return;
    }
    p.actionPoints -= 4;
    job.performance = Math.min(100, (job.performance || 50) + 12);
    cap.burnout = (cap.burnout || 0) + 6;
    cap.industryResources = (cap.industryResources || 0) + 5;
    cap.reputation = (cap.reputation || 0) + 3;
    clampCareerCapital(cap);
    StateManager.addMessage(
      "🎯 冲刺KPI成功：业绩+12，行业资源+5，声誉+3",
      "success",
    );
  }
  if (typeof renderAll === "function") renderAll();
}

/** 调休减压（每月1次，需在职≥20天） */
function careerTakeBreak() {
  var state = StateManager.getState();
  if (!state.career || !state.career.currentJob) return;
  var job = state.career.currentJob;
  var p = state.player;
  var cap = ensureCareerCapital(state);
  if ((job.workDays || 0) < 20) {
    StateManager.addMessage("⚠️ 需在职≥20天才能调休", "warning");
    return;
  }
  var lastBreak = job._lastBreakDay || -999;
  if (p.day - lastBreak < 30) {
    StateManager.addMessage(
      "⚠️ 每月只能调休1次（上次第" + lastBreak + "天）",
      "warning",
    );
    return;
  }
  if (p.actionPoints < 1) {
    StateManager.addMessage("⚠️ 行动力不足(需1)", "warning");
    return;
  }
  p.actionPoints -= 1;
  cap.burnout = Math.max(0, (cap.burnout || 0) - 25);
  job.performance = Math.max(0, (job.performance || 50) - 2);
  job._lastBreakDay = p.day;
  if (state.needs)
    state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 5);
  clampCareerCapital(cap);
  StateManager.addMessage("😴 调休一天：倦怠-25，心情+5，业绩-2", "success");
  if (typeof renderAll === "function") renderAll();
}

/**
 * 带薪休假（每180天1次，需在职≥90天，倦怠≥30）
 * 参考：现实中国企业年假制度（1-15天/年）
 * 效果：真正清空倦怠、回血心情精神，但损失5天薪资
 */
function careerTakePaidLeave() {
  var state = StateManager.getState();
  if (!state.career || !state.career.currentJob) return;
  var job = state.career.currentJob;
  var p = state.player;
  var cap = ensureCareerCapital(state);
  if ((job.workDays || 0) < 90) {
    StateManager.addMessage("⚠️ 需在职满90天才能申请年假", "warning");
    return;
  }
  var lastLeave = job._lastPaidLeaveDay || -999;
  if (p.day - lastLeave < 180) {
    var nextDay = lastLeave + 180;
    StateManager.addMessage(
      "⚠️ 年假每180天1次，第" + nextDay + "天后可用",
      "warning",
    );
    return;
  }
  var burnout = cap.burnout || 0;
  if (burnout < 30) {
    StateManager.addMessage("⚠️ 倦怠低于30，还不到需要年假的程度", "hint");
    return;
  }
  // 扣除5天薪资
  var dailySalary = Math.floor((job.salary || 5000) / 22);
  var leaveCost = dailySalary * 5;
  state.resources.cash = Math.max(0, (state.resources.cash || 0) - leaveCost);
  // 清倦怠、回血
  cap.burnout = Math.max(0, burnout - 45);
  if (state.needs) {
    state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 25);
    // [全系统自洽修复] 域C A类修复: state.status 守卫(防止旧存档崩溃)
    if (state.status) {
      state.status.health = Math.min(100, (state.status.health || 70) + 8);
    }
  }
  p.mental = Math.min(100, (p.mental || 30) + 15);
  job._lastPaidLeaveDay = p.day;
  job.performance = Math.max(0, (job.performance || 50) - 3);
  clampCareerCapital(cap);
  StateManager.addMessage(
    "🏖️ 年假已批！倦怠-45，心情+25，精神+15，健康+8（扣薪¥" + leaveCost + "）",
    "success",
  );
  if (typeof renderAll === "function") renderAll();
}

/** 生成跳槽offer（P1-2：主动跳槽，需门路+30天冷却）
 * 设计参考：BitLife 主动换工作 / 现实中国职场跳槽年均涨薪20-30%
 */
function generateJobOffers(state) {
  if (!state.career || !state.career.currentJob) return [];
  var job = state.career.currentJob;
  var path = CAREER_PATHS[job.path];
  if (!path) return [];
  var cap = ensureCareerCapital(state);
  // 门路检查：有客户线索或声誉才能拿到offer
  var hasLeads = (cap.clientLeads || 0) >= 15 || (cap.reputation || 0) >= 30;
  if (!hasLeads) return [];
  // 30天冷却
  var lastHop = job._lastJobhopDay || -999;
  if (state.player.day - lastHop < 30) return [];

  var curIdx = -1;
  for (var i = 0; i < path.levels.length; i++) {
    if (path.levels[i].id === job.levelId) {
      curIdx = i;
      break;
    }
  }
  var offers = [];
  // offer1: 同路径高半级（晋升式跳槽，到顶则无）
  if (curIdx >= 0 && curIdx < path.levels.length - 1) {
    var nl = path.levels[curIdx + 1];
    offers.push({
      id: "hop_promo",
      path: job.path,
      levelId: nl.id,
      levelName: nl.name,
      salary: Math.round((nl.salary || 0) * 0.95),
      desc: "同行业晋升跳（职级升半级，月薪随职级）",
    });
  }
  // offer2/3: 跨路径（用day种子确定性挑选，避免每次刷新变化）
  var otherPaths = [];
  for (var k in CAREER_PATHS) {
    if (k !== job.path) otherPaths.push(k);
  }
  if (otherPaths.length) {
    var seed = state.player.day;
    var pick1 = otherPaths[seed % otherPaths.length];
    var p1 = CAREER_PATHS[pick1];
    var idx1 = Math.min(p1.levels.length - 1, Math.max(0, curIdx));
    if (p1.levels[idx1]) {
      // 跨路径薪资下限：不低于当前薪资×0.85，避免跳槽反而降薪
      var cross1Salary = Math.max(
        Math.round((job.salary || 5000) * 0.85),
        Math.round((p1.levels[idx1].salary || 0) * 1.1),
      );
      offers.push({
        id: "hop_cross1",
        path: pick1,
        levelId: p1.levels[idx1].id,
        levelName: p1.levels[idx1].name,
        salary: cross1Salary,
        desc: "跨行平级跳（市场价+10%，不低于当前85%）",
      });
    }
    if (otherPaths.length > 1) {
      var pick2 = otherPaths[(seed + 1) % otherPaths.length];
      var p2 = CAREER_PATHS[pick2];
      var idx2 = Math.min(p2.levels.length - 1, Math.max(0, curIdx + 1));
      if (p2.levels[idx2] && !(pick2 === pick1 && idx2 === idx1)) {
        var cross2Salary = Math.max(
          Math.round((job.salary || 5000) * 0.95),
          Math.round(p2.levels[idx2].salary * 1.2),
        );
        offers.push({
          id: "hop_cross2",
          path: pick2,
          levelId: p2.levels[idx2].id,
          levelName: p2.levels[idx2].name,
          salary: cross2Salary,
          desc: "跨行高半级跳（市场价+20%，不低于当前95%）",
        });
      }
    }
  }
  return offers;
}

/** 执行跳槽（P1-2） */
function applyJobhop(offerId) {
  var state = StateManager.getState();
  if (!state.career || !state.career.currentJob) return;
  var offers = generateJobOffers(state);
  var offer = null;
  for (var i = 0; i < offers.length; i++) {
    if (offers[i].id === offerId) {
      offer = offers[i];
      break;
    }
  }
  if (!offer) {
    StateManager.addMessage("⚠️ 该offer已失效", "warning");
    return;
  }
  var targetPath = CAREER_PATHS[offer.path];
  if (!targetPath) return;
  var targetLevel = null;
  for (var j = 0; j < targetPath.levels.length; j++) {
    if (targetPath.levels[j].id === offer.levelId) {
      targetLevel = targetPath.levels[j];
      break;
    }
  }
  if (!targetLevel) return;
  // 仍需满足目标职级门槛（技能/属性/人脉）
  if (!checkCareerPromotion(state, offer.path, targetLevel)) {
    StateManager.addMessage(
      "⚠️ 不满足「" + offer.levelName + "」的门槛（技能/属性/人脉）",
      "warning",
    );
    return;
  }
  var job = state.career.currentJob;
  var cap = ensureCareerCapital(state);
  var oldName = job.levelName;
  state.career.history.push({
    day: state.player.day,
    event:
      "跳槽：" +
      oldName +
      " → " +
      offer.levelName +
      "（" +
      CAREER_PATHS[offer.path].name +
      "）",
  });
  // v3.51：跨路径跳槽成就标记
  var _oldPath = job.path;
  if (_oldPath !== offer.path) {
    state.flags._crossPathJobhop = true;
    // 追踪所有走过的路径（字符串集合）
    var _pathSet = state.flags._careerPathsWorked || {};
    _pathSet[_oldPath] = true;
    _pathSet[offer.path] = true;
    state.flags._careerPathsWorked = _pathSet;
  }
  job.path = offer.path;
  job.levelId = offer.levelId;
  job.levelName = offer.levelName;
  job.salary = offer.salary;
  job.workDays = 0;
  job.startDay = state.player.day;
  job.performance = 50;
  job._lastJobhopDay = state.player.day;
  // 跳槽消耗人脉、换环境减压
  cap.clientLeads = Math.max(0, (cap.clientLeads || 0) - 5);
  cap.reputation = (cap.reputation || 0) + 3;
  cap.burnout = Math.max(0, (cap.burnout || 0) - 5);
  clampCareerCapital(cap);
  StateManager.addMessage(
    "🎉 跳槽成功！" +
      oldName +
      " → " +
      offer.levelName +
      "，月薪¥" +
      offer.salary.toLocaleString(),
    "success",
  );
  // 里程碑：跳槽/入职
  if (typeof autoSave === "function") autoSave("milestone");
  if (typeof renderAll === "function") renderAll();
}

/** 获取职业路径的下一级 */
function getNextCareerLevel(pathId, currentLevelId) {
  var path = CAREER_PATHS[pathId];
  if (!path) return null;
  for (var i = 0; i < path.levels.length - 1; i++) {
    if (path.levels[i].id === currentLevelId) {
      return path.levels[i + 1];
    }
  }
  return null;
}

// [CoC] 约定式技能/属性路径映射 — 新增属性只需在此加一行，零代码修改
var _SKILL_PATH_MAP = {
  intelligence: "player.intelligence",
  mental: "player.mental",
  physique: "player.physique",
  agility: "player.agility",
  charm: "player.charm",
  fame: "player.fame",
  morality: "player.morality",
  // [全系统自洽修复] 域C R173 A类#1: design→player.intelligence 映射补全
  // [全系统自洽修复] 域C 修复:social是真实训练技能(state.skills.social),不应映射到player.charm
  // 原映射导致教育培训路径reqSkills:{social:N}静默读取charm属性(初始20)而非social技能(初始0)
  design: "player.intelligence",
  // social已移除: _getSkillValue对未映射key会回退到state.skills[skill].level(正确行为)
};
function _getSkillValue(state, skill) {
  if (!state) return 0;
  var path = _SKILL_PATH_MAP[skill];
  if (path) {
    var parts = path.split(".");
    var val = state;
    for (var i = 0; i < parts.length; i++) {
      if (val == null) return 0;
      val = val[parts[i]];
    }
    return val || 0;
  }
  // 非属性技能（如编程/英语/会计等）
  if (state.skills && state.skills[skill])
    return state.skills[skill].level || 0;
  return 0;
}

/** 检查晋升条件（v3.2 新增：属性+颜值+社交检查） */
function checkCareerPromotion(state, pathId, level) {
  // [全系统自洽修复] 域C R74: state空守卫
  if (!state) return false;
  var p = state.player;

  // 年龄检查
  if (level.minAge && (state.player.age || 20) < level.minAge) return false;

  // 学历检查
  if (level.reqEducation && !p.education) return false;

  // [CoC] 技能检查 — 声明式映射取代 if-else 链
  if (level.reqSkills) {
    for (var skill in level.reqSkills) {
      var required = level.reqSkills[skill];
      var actual = _getSkillValue(state, skill);
      if (actual < required) return false;
    }
  }

  // [CoC] 属性要求检查 — 声明式映射取代 if-else 链
  if (level.reqAttrs) {
    for (var attr in level.reqAttrs) {
      var attrReq = level.reqAttrs[attr];
      var attrVal = _getSkillValue(state, attr);
      if (attrVal < attrReq) return false;
    }
  }

  // [全系统自洽修复] 域C 修复:reqSocial原checkCareerPromotion未检查(UI显示需求但晋升不验证)
  if (level.reqSocial) {
    var socialVal = _getSkillValue(state, "social");
    if (socialVal < level.reqSocial) return false;
  }

  // 工作天数检查
  var career = state.career || {};
  var workDays = career.currentJob ? career.currentJob.workDays || 0 : 0;
  if (level.reqWorkDays && workDays < level.reqWorkDays) return false;

  // 业绩检查：高阶职位不仅熬年限，还要有可见绩效。
  var performanceReq = getCareerPerformanceRequirement(level);
  if (performanceReq && getCareerPerformanceScore(state) < performanceReq) {
    return false;
  }

  // 社交关系检查（高阶职位需要）
  if (level.reqSocial) {
    if (
      getCareerTrustedNetworkCount(state) < Math.floor(level.reqSocial / 20)
    ) {
      return false;
    }
  }

  return true;
}

/** 补充属性标签（🟢/🔴 条件构建用） */
var _careerLabelMap = {
  coding: "编程",
  english: "英语",
  accounting: "财务",
  management: "管理",
  sales: "销售",
  cooking: "烹饪",
  medicine: "医学",
  driving: "驾驶",
  repair: "维修",
  electrician: "电工",
  welding: "焊工",
  social: "社交", // [全系统自洽修复] 域C A类: education路径 reqSkills:{social:N} 缺失该标签→UI显示"social≥10"而非"社交≥10"
  caregiving: "护理",
  intelligence: "智力",
  mental: "能力",
  physique: "体质",
  agility: "敏捷",
  charm: "颜值",
  fame: "名气",
  morality: "道德",
};

/**
 * 获取技能/属性当前值（与 checkCareerPromotion 一致）
 */
function _getCareerReqValue(state, key) {
  if (!state || !state.player) return 0; // [全系统自洽修复] 域C A类: state.player 守卫
  var p = state.player;
  if (key === "intelligence") return p.intelligence || 0;
  if (key === "mental") return p.mental || 0;
  if (key === "physique") return p.physique || 0;
  if (key === "agility") return p.agility || 0;
  if (key === "charm") return p.charm || 0;
  if (key === "fame") return p.fame || 0;
  if (key === "morality") return p.morality || 0;
  if (state.skills && state.skills[key]) return state.skills[key].level || 0;
  return 0;
}

/**
 * 检查晋升条件并返回详细结果
 * @returns {Array<{label:string, ok:boolean, current:number, required:(number|string)}>}
 */
function checkCareerPromotionDetailed(state, pathId, level) {
  if (!state || !state.player) return []; // [全系统自洽修复] 域C A类: state.player 守卫
  var p = state.player;
  var results = [];

  // 年龄
  if (level.minAge) {
    var curAge = p.age || 20;
    results.push({
      label: "年龄≥" + level.minAge,
      ok: curAge >= level.minAge,
      current: curAge,
      required: level.minAge,
    });
  }

  // 学历
  if (level.reqEducation) {
    results.push({
      label: "大专以上学历",
      ok: !!p.education,
      current: p.education ? "有" : "无",
      required: "有",
    });
  }

  // 技能/属性 (reqSkills)
  if (level.reqSkills) {
    for (var s in level.reqSkills) {
      var reqv = level.reqSkills[s];
      var cur = _getCareerReqValue(state, s);
      results.push({
        label: (_careerLabelMap[s] || s) + "≥" + reqv,
        ok: cur >= reqv,
        current: cur,
        required: reqv,
      });
    }
  }

  // 属性要求 (reqAttrs)
  if (level.reqAttrs) {
    for (var a in level.reqAttrs) {
      var reqa = level.reqAttrs[a];
      var cura = _getCareerReqValue(state, a);
      results.push({
        label: (_careerLabelMap[a] || a) + "≥" + reqa,
        ok: cura >= reqa,
        current: cura,
        required: reqa,
      });
    }
  }

  // [全系统自洽修复] 域C 修复:reqSocial详情面板(原仅文本显示,现与晋升逻辑一致)
  if (level.reqSocial) {
    var socialCur = _getCareerReqValue(state, "social");
    results.push({
      label: "人脉≥" + level.reqSocial,
      ok: socialCur >= level.reqSocial,
      current: socialCur,
      required: level.reqSocial,
    });
  }

  // 工作天数
  var career = state.career || {};
  var workDays = career.currentJob ? career.currentJob.workDays || 0 : 0;
  if (level.reqWorkDays) {
    results.push({
      label: "在职≥" + Math.floor(level.reqWorkDays / 365) + "年",
      ok: workDays >= level.reqWorkDays,
      current: Math.floor(workDays / 30) + "个月",
      required: Math.floor(level.reqWorkDays / 365) + "年",
    });
  }

  // 业绩
  var performanceReq = getCareerPerformanceRequirement(level);
  if (performanceReq) {
    var perfScore = getCareerPerformanceScore(state);
    results.push({
      label: "业绩≥" + performanceReq,
      ok: perfScore >= performanceReq,
      current: perfScore,
      required: performanceReq,
    });
  }

  // 社交关系
  if (level.reqSocial) {
    var networkCount = getCareerTrustedNetworkCount(state);
    var requiredNet = Math.floor(level.reqSocial / 20);
    results.push({
      label: "人脉≥" + requiredNet + "人",
      ok: networkCount >= requiredNet,
      current: networkCount,
      required: requiredNet,
    });
  }

  return results;
}

/**
 * 渲染一条条件 HTML（✅ green / ❌ red + 当前值）
 */
function _renderCondRow(label, ok, currentStr) {
  return (
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:2px 4px;border-radius:3px;' +
    (ok
      ? "background:rgba(46,204,113,0.06);"
      : "background:rgba(231,76,60,0.06);") +
    '"><span>' +
    (ok
      ? '✅ <span style="color:var(--success);font-weight:bold;">'
      : '❌ <span style="color:var(--danger);">') +
    label +
    "</span></span>" +
    '<span style="font-size:11px;' +
    (ok ? "color:var(--success);" : "color:var(--danger);") +
    '">' +
    (ok ? "✔ 当前 " : "✘ 当前 ") +
    currentStr +
    "</span></div>"
  );
}

/**
 * 从 checkCareerPromotionDetailed 结果批量渲染 HTML
 */
function _renderCondRows(results) {
  return results
    .map(function (r) {
      return _renderCondRow(r.label, r.ok, String(r.current));
    })
    .join("");
}

/** 从详细结果判断是否全部通过 */
function _allMet(results) {
  for (var i = 0; i < results.length; i++) {
    if (!results[i].ok) return false;
  }
  return true;
}

function getCareerPerformanceRequirement(level) {
  if (level.reqPerformance) return level.reqPerformance;
  if (!level.reqWorkDays) return 0;
  var years = Math.floor(level.reqWorkDays / 365);
  return Math.min(80, 25 + years * 12);
}

function getCareerPerformanceScore(state) {
  var career = state.career || {};
  var job = career.currentJob || {};
  if (typeof job.performance === "number") {
    // [全系统自洽修复] 域C A类#3: 确保返回有效数字，NaN/Infinity→回退
    if (isFinite(job.performance)) return job.performance;
  }
  var corp = state.player && state.player.corporate;
  if (corp && typeof corp.kpi === "number" && isFinite(corp.kpi)) return corp.kpi;
  if (state.corporate && typeof state.corporate.kpi === "number" && isFinite(state.corporate.kpi)) {
    return state.corporate.kpi;
  }
  return 50;
}

function getCareerTrustedNetworkCount(state) {
  // 主读路径与写入方(initColleagueNetwork→state.corporate.colleagues)一致
  var colleagues = [];
  if (
    state.corporate &&
    state.corporate.colleagues &&
    Array.isArray(state.corporate.colleagues.network)
  ) {
    colleagues = state.corporate.colleagues.network;
  }
  // fallback：兼容旧路径
  if (
    !colleagues.length &&
    state.workplaceSocial &&
    state.workplaceSocial.colleagues &&
    Array.isArray(state.workplaceSocial.colleagues.network)
  ) {
    colleagues = state.workplaceSocial.colleagues.network;
  }
  return colleagues.filter(function (c) {
    return (c.relationship || c.trust || c.affinity || 0) >= 60;
  }).length;
}

/** 从 checkCareerPromotionDetailed 结果生成紧凑缺失摘要（供卡片状态行用） */
function _renderMissingSummary(results) {
  var missing = [];
  for (var i = 0; i < results.length; i++) {
    if (!results[i].ok) missing.push(results[i].label.replace("≥", ""));
  }
  if (missing.length === 0) return "";
  return (
    "缺" +
    missing.slice(0, 3).join(" ") +
    (missing.length > 3 ? " 等" + missing.length + "项" : "")
  );
}

/** 渲染晋升条件文字（v3.97+ overhaul: ✅/❌ 每项带当前值） */
function renderPromotionReqs(state, pathId, level) {
  var results = checkCareerPromotionDetailed(state, pathId, level);
  if (results.length === 0) return "";
  if (typeof ConditionSystem !== "undefined" && ConditionSystem.renderRows) {
    return ConditionSystem.renderRows(results);
  }
  var html = '<div style="font-size:10px;line-height:1.8;">';
  for (var i = 0; i < results.length; i++) {
    var r = results[i];
    html +=
      '<div style="display:flex;justify-content:space-between;align-items:center;">' +
      "<span>" +
      (r.ok ? "✅" : "❌") +
      " " +
      r.label +
      "</span>" +
      '<span style="color:' +
      (r.ok ? "var(--success)" : "var(--danger)") +
      ';font-size:9px;">' +
      "当前" +
      r.current +
      "</span></div>";
  }
  html += "</div>";
  return html;
}

/** 投递简历（申请初级职位） */
function applyCareerJob(pathId, levelId) {
  var state = StateManager.getState();
  var path = CAREER_PATHS[pathId];
  if (!path) {
    StateManager.addMessage("⚠️ 该职业路径不存在", "warning");
    return;
  }

  var level = path.levels.find(function (l) {
    return l.id === levelId;
  });
  if (!level) return;

  if (!checkCareerPromotion(state, pathId, level)) {
    StateManager.addMessage("⚠️ 你不满足该职位的条件", "warning");
    return;
  }

  // 初始化 career 状态
  if (!state.career) state.career = { currentJob: null, history: [] };
  var cap = ensureCareerCapital(state);
  if (state.career.currentJob) {
    StateManager.addMessage(
      "⚠️ 你已经有工作了，先辞职才能投递新职位",
      "warning",
    );
    return;
  }

  state.career.currentJob = {
    path: pathId,
    levelId: levelId,
    levelName: level.name,
    salary: level.salary,
    workDays: 0,
    startDay: state.player.day,
    performance: 50,
  };
  // 初始化同事网络（P0-2：入职时生成初始同事）
  if (typeof initCareerColleagues === "function") {
    initCareerColleagues(state);
  }

  // [全系统自洽修复] 域C R251 联动增强(C→D): 职业路径入职→NPC社交圈影响
  if (state.relationships) {
    var _pathNpcMap = { medical: "dr_wang", doctor: "dr_wang", legal: "zhaojie", education: "xiao_mei", finance: "uncle_chen_bank", tech: "xiaochen" };
    var _npcId = _pathNpcMap[pathId];
    if (_npcId && state.relationships[_npcId] && state.relationships[_npcId].met) {
      state.relationships[_npcId].affinity = Math.min(100, (state.relationships[_npcId].affinity || 0) + 5);
      StateManager.addMessage("🤝 入职" + (getCareerPathLabel(pathId) || pathId) + "后，你与" + (state.relationships[_npcId].name || _npcId) + "的联系更紧密了。", "info");
    }
  }

  // [全系统自洽修复] 域C R357 联动增强: C→B 职业路径入职叙事(首次进入某路径时触发人生故事)
  if (!state.flags) state.flags = {};
  var _firstPathFlag = '_firstCareerPath_' + pathId;
  if (!state.flags[_firstPathFlag]) {
    state.flags[_firstPathFlag] = true;
    var _pathStory = {
      tech: "你坐在电脑前，第一次以程序员身份写代码。屏幕的光映在脸上，你想起小时候玩红白机的那个下午。",
      finance: "你整理完第一张凭证，把数字对齐。财务人的路，从一分一厘开始。",
      sales: "你拨出第一个客户电话，手心在冒汗。销售的世界，脸皮厚一点才能活下去。",
      operations: "你打开第一份运营报表，密密麻麻的数据让你头晕。但你知道，这是看懂生意的开始。",
      design: "你打开设计软件，画下第一根线条。从兴趣到职业，这条路你选择了。",
      legal: "你翻开第一本案卷，密密麻麻的法条让你头大。但正义的种子，就在这些文字里。",
      education: "你站上讲台，看着下面几十双眼睛。你深吸一口气——从此，你是老师了。",
      logistics: "你穿上工装，开始第一天的分拣。物流是城市的血脉，而你，是血流中的一粒细胞。",
      catering: "你系上围裙，握起菜刀。厨房里的烟火气，让你觉得踏实。",
      medical: "你穿上白大褂，第一次走进病房。患者信任的目光，让你觉得这份工作有意义。",
      doctor: "你穿上白大褂，胸前挂着听诊器。从医这条路，你选择了责任与担当。",
      public_institution: "你坐在办公桌前，桌上堆着文件。体制内的工作，稳定但需要耐心。",
      civil: "你穿上制服，为人民服务不是口号，而是每一天的具体工作。"
    };
    var _story = _pathStory[pathId];
    if (_story) {
      StateManager.addMessage("📖 " + _story, "narrative");
    }
  }

  cap.reputation = (cap.reputation || 0) + 2;
  cap.industryResources = (cap.industryResources || 0) + 1;
  clampCareerCapital(cap);

  StateManager.addMessage(
    "✅ 入职成功！你成为了" +
      getCareerPathLabel(pathId) +
      "的" +
      level.name +
      "，月薪¥" +
      level.salary.toLocaleString(),
    "success",
  );

  if (typeof renderAll === "function") renderAll();
}

/** 申请晋升 */
function applyCareerPromotion(pathId, levelId) {
  var state = StateManager.getState();
  var path = CAREER_PATHS[pathId];
  var level = path.levels.find(function (l) {
    return l.id === levelId;
  });
  if (!level) return;

  if (!state.career || !state.career.currentJob) {
    StateManager.addMessage("⚠️ 你目前没有工作", "warning");
    return;
  }

  if (!checkCareerPromotion(state, pathId, level)) {
    if (typeof showCareerRequirementsModal === "function") {
      showCareerRequirementsModal(StateManager.getState(), pathId, level);
    } else {
      StateManager.addMessage("⚠️ 晋升条件不足，查看具体要求", "warning");
    }
    return;
  }

  // 晋升成功
  var oldJob = state.career.currentJob;
  var cap = ensureCareerCapital(state);
  state.career.history.push({
    day: state.player.day,
    event: "晋升：" + oldJob.levelName + " → " + level.name,
  });
  // v3.51：首次晋升成就标记
  if (!state.flags) state.flags = {}; // [全系统自洽修复] 域C A类: state.flags 守卫
  if (!state.flags._careerFirstPromotion) {
    state.flags._careerFirstPromotion = true;
  }
  state.flags._careerPromotionCount =
    (state.flags._careerPromotionCount || 0) + 1;

  state.career.currentJob.levelId = levelId;
  state.career.currentJob.levelName = level.name;
  state.career.currentJob.salary = level.salary;
  state.career.currentJob.performance = Math.max(
    45,
    // [全系统自洽修复] 域C R74: performance重置NaN守卫
    (isFinite(state.career.currentJob.performance) ? state.career.currentJob.performance : 55) - 10,
  );
  cap.reputation = (cap.reputation || 0) + 8;
  cap.industryResources = (cap.industryResources || 0) + 4;
  cap.partnerTrust = (cap.partnerTrust || 0) + 2;
  clampCareerCapital(cap);

  // [全系统自洽修复] 域C 联动增强(C→A): 晋升时主技能XP奖励 — 晋升路径所需技能获得经验加成
  if (level.reqSkills && state.skills) {
    for (var _ps in level.reqSkills) {
      if (typeof addSkillXp === "function" && state.skills[_ps]) {
        var _xpGain = 20 + Math.floor((level.salary || 0) / 1000);
        addSkillXp(_ps, _xpGain);
      }
    }
  }

  // [全系统自洽修复] 域C 增强:晋升时同事好感提升(C→D)
  var _promoNet = state.corporate && state.corporate.colleagues && state.corporate.colleagues.network;
  if (_promoNet && _promoNet.length > 0) {
    var _promoAffGain = 3 + Math.floor((level.salary || 0) / 10000);
    for (var _pi = 0; _pi < _promoNet.length; _pi++) {
      _promoNet[_pi].relationship = Math.min(100, (_promoNet[_pi].relationship || 0) + _promoAffGain);
      _promoNet[_pi].trust = Math.min(100, (_promoNet[_pi].trust || 0) + 2);
    }
  }

  StateManager.addMessage(
    "🎉 晋升成功！你成为了" +
      level.name +
      "，月薪涨至¥" +
      level.salary.toLocaleString(),
    "success",
  );

  // [全系统自洽修复] 域C R243 联动增强(C→B): 晋升管理级职位叙事 — 行业新闻风格
  if (level.reqSocial || (level.salary || 0) >= 20000) {
    // [全系统自洽修复] 域C R306 A类: `job` 从未声明(ReferenceError,晋升管理级必崩)→改用本函数已声明的 path(=CAREER_PATHS[pathId])
    var _promoNews = "📰 行业动态：" + (path && path.name ? path.name : "") + "领域" + level.name + "职位出现人事变动，业内关注薪资水平与职业发展空间。";
    StateManager.addMessage(_promoNews, "info");
  }

  // [全系统自洽修复] 域C R251 联动增强(C→G): 晋升带来健康信心加成
  if (level.salary >= 15000 && state.status) {
    state.status.health = Math.min(100, (state.status.health || 100) + 1);
    StateManager.addMessage("💪 晋升带来的成就感让你精神焕发，健康+1。", "success");
  }

  // === v3.23: 触发槽 — career_promo ===
  if (typeof window.TriggerRegistry !== "undefined") {
    try {
      var careerPromoEvent = window.TriggerRegistry.triggerRandom(
        "career_promo",
        state,
      );
      if (careerPromoEvent) {
        setTimeout(function () {
          if (typeof showEventModal === "function")
            showEventModal(careerPromoEvent);
        }, 100);
      }
    } catch (e) {
      console.warn("TriggerRegistry career_promo 触发失败:", e);
    }
  }

  if (typeof renderAll === "function") renderAll();
}

/** 辞职 */
function resignCareerJob() {
  try {
    var state = StateManager.getState();
    if (!state.career || !state.career.currentJob) return;

    // 记录辞职前的职位名（用于离职消息）
    var oldJobName = state.career.currentJob.levelName;
    var oldPath = state.career.currentJob.path;
    var oldWorkDays = state.career.currentJob.workDays || 0;

    // 记录到历史（增强版：包含完整路径信息）
    state.career.history.push({
      day: state.player.day,
      path: oldPath,
      levelId: state.career.currentJob.levelId,
      levelName: oldJobName,
      salary: state.career.currentJob.salary,
      workDays: oldWorkDays,
      event: "辞职：离开了" + oldJobName + "岗位（在职" + oldWorkDays + "天）",
    });

    state.career.currentJob = null;

    // 重置职业倦怠，扣除行业资源（重新求职需重新积累）
    var cap = ensureCareerCapital(state);
    cap.burnout = 0;
    cap.industryResources = Math.max(0, (cap.industryResources || 0) - 5);
    clampCareerCapital(cap);

    var pathLabel = oldPath
      ? (CAREER_PATHS[oldPath] ? CAREER_PATHS[oldPath].icon + " " : "") +
        (CAREER_PATHS[oldPath] ? CAREER_PATHS[oldPath].name : "")
      : "";

    StateManager.addMessage(
      "👋 你已辞去" +
        pathLabel +
        oldJobName +
        "（在职" +
        oldWorkDays +
        "天）。职业倦怠清零，行业资源-5。",
      "warning",
    );

    // [全系统自洽修复] 域C R357 联动增强: C→D 辞职影响NPC社交圈(离职后相关NPC好感下降)
    if (state.relationships) {
      var _resignNpcMap = { medical: "dr_wang", doctor: "dr_wang", legal: "zhaojie", education: "xiao_mei", finance: "uncle_chen_bank", tech: "xiaochen" };
      var _resignNpcId = _resignNpcMap[oldPath];
      if (_resignNpcId && state.relationships[_resignNpcId] && state.relationships[_resignNpcId].met) {
        state.relationships[_resignNpcId].affinity = Math.max(0, (state.relationships[_resignNpcId].affinity || 0) - 5);
        StateManager.addMessage("💔 辞职后，你与" + (state.relationships[_resignNpcId].name || _resignNpcId) + "的联系变淡了。", "info");
      }
    }

    // 自动切换到"上班族"子Tab，方便立刻找工作
    state._careerSubTab = "career_jobs";

    if (typeof renderAll === "function") renderAll();
  } catch (e) {
    console.error("[career_dev] resignCareerJob error:", e);
  }
}

/** 每日固定工作结算 */
function tickCareerJobDaily(state) {
  // [全系统自洽修复] 域C 联动增强(C→A): 每月记录职业资产数据快照
  if (state.player && state.player.day % 30 === 1) {
    if (!state.flags) state.flags = {};
    if (!state.flags._careerMonthlySnapshots) state.flags._careerMonthlySnapshots = [];
    state.flags._careerMonthlySnapshots.push({
      day: state.player.day,
      salary: state.career && state.career.currentJob ? state.career.currentJob.salary || 0 : 0,
      cash: (state.resources && state.resources.cash) || 0,
      bankBalance: (state.resources && state.resources.bankBalance) || 0,
    });
    if (state.flags._careerMonthlySnapshots.length > 24) state.flags._careerMonthlySnapshots.shift();
  }
  // ----- 退休人员只发养老金（P0-3） -----
  if (state.flags && state.flags._retired) {
    var pension =
      state.career && state.career.pensionBase
        ? Math.round(state.career.pensionBase * 0.4)
        : 2000;
    var payCycle = state.career && (state.career._pensionPayCycle || 0);
    state.career = state.career || {};
    state.career._pensionPayCycle = (payCycle || 0) + 1;
    if (state.career._pensionPayCycle % 30 === 0) {
      state.resources.cash = (state.resources.cash || 0) + pension;
      StateManager.addMessage(
        "🏖️ 收到养老金 ¥" + pension.toLocaleString(),
        "info",
      );
    }
    return;
  }

  if (!state.career || !state.career.currentJob) return;

  // ====== 连续工作天数追踪（上班族版本）======
  if (!state.flags) state.flags = {}; // [全系统自洽修复] 域C A类: state.flags 守卫
  if (!state.flags._workStreak) state.flags._workStreak = 0;
  if (!state.flags._lastWorkDay) state.flags._lastWorkDay = 0;
  if (state.flags._lastWorkDay === state.player.day - 1) {
    state.flags._workStreak = (state.flags._workStreak || 0) + 1;
  } else if (state.flags._lastWorkDay !== state.player.day) {
    state.flags._workStreak = 1;
  }
  state.flags._lastWorkDay = state.player.day;
  state.flags._workedToday = true;

  var job = state.career.currentJob;
  var cap = ensureCareerCapital(state);
  job.workDays = (job.workDays || 0) + 1;
  job.performance = Math.max(0, Math.min(100, job.performance || 50));
  cap.reputation = (cap.reputation || 0) + 0.1;

  // v3.48：在职天数里程碑消息（峰终定律·小胜利庆祝）
  var _newWd = job.workDays;
  var _milestoneMsg = null;
  if (_newWd === 7) _milestoneMsg = "🌱 入职一周了！开始适应新的工作节奏";
  else if (_newWd === 30)
    _milestoneMsg = "🎯 满月达成！你已经在这份工作上坚持了一个月";
  else if (_newWd === 60) _milestoneMsg = "💪 两个月稳步前进，继续保持";
  else if (_newWd === 90) _milestoneMsg = "⭐ 百日坚持！认真工作的样子真帅";
  else if (_newWd === 180)
    _milestoneMsg = "🔥 半年磨一剑，你已经从新人成长为老手";
  else if (_newWd === 365)
    _milestoneMsg = "🏆 一周年纪念日！这是你职业生涯的重要里程碑";
  else if (_newWd > 365 && _newWd % 365 === 0)
    _milestoneMsg = "🏆 入职" + _newWd / 365 + "周年！坚持就是胜利";
  if (_milestoneMsg) {
    StateManager.addMessage(_milestoneMsg, "success");
    // [全系统自洽修复] 域C R389 联动增强(C→B): 工作里程碑叙事—记录事件历史供UI展示
    if (typeof recordEventToHistory === "function") {
      recordEventToHistory(state, "career_milestone_" + _newWd, _milestoneMsg);
    }
    // [全系统自洽修复] 域C 联动增强#1: C→G 里程碑幸福感 — 重大里程碑给予心情/健康加成
    if (_newWd === 30 || _newWd === 90 || _newWd === 365 || _newWd % 365 === 0) {
      // [全系统自洽修复] 域C A类修复: state.status 守卫(防止旧存档崩溃)
      if (!state.status) state.status = {};
      if (state.needs) {
        state.needs.happiness = Math.min(100, (state.needs.happiness || 0) + 3);
        // [全系统自洽修复] 域F 修复:career_dev.js 里程碑健康加成写 state.needs.health 死字段
        // （state.needs 无 health，真实且被渲染的字段为 state.status.health）→「+1 健康」被静默丢弃，改为真实字段
        state.status.health = Math.min(100, (state.status.health || 100) + 1);
      }
      // [全系统自洽修复] 域C R243 联动增强(C→G): 年度里程碑(365天)额外健康+2与叙事叠加
      if (_newWd === 365) {
        state.status.health = Math.min(100, (state.status.health || 100) + 2);
        state.needs.happiness = Math.min(100, (state.needs.happiness || 0) + 5);
        StateManager.addMessage('🎉 入职一周年！稳定工作带来的安全感让你身心俱佳，健康+2，心情+5。', 'success');
      } else if (_newWd > 0 && _newWd % 365 === 0) {
        var _annivYears = _newWd / 365;
        state.status.health = Math.min(100, (state.status.health || 100) + 3);
        state.needs.happiness = Math.min(100, (state.needs.happiness || 0) + 8);
        StateManager.addMessage('🎊 ' + _annivYears + '周年！多年的职场沉淀让你愈发从容，健康+3，心情+8。', 'success');
      }
    }
  }
  // 职业倦怠：工作日常量增长，但有被动恢复（周末/休息自然降低）
  var dailyBurnoutChange = 0.04;
  // 周末（第7天）有额外恢复，模拟休息日
  if (state.player.day % 7 === 0) dailyBurnoutChange -= 2;
  cap.burnout = Math.max(0, (cap.burnout || 0) + dailyBurnoutChange);

  // [全系统自洽修复] 域C 联动增强(C→G): 高压倦怠→健康侵蚀 — 每日最高-1健康(倦怠≥70时触发)
  if (cap.burnout >= 70 && state.status && state.status.health > 10) {
    state.status.health = Math.max(0, (state.status.health || 100) - 1);
    if (cap.burnout >= 85 && state.player.day % 5 === 0) {
      StateManager.addMessage("⚠️ 长期高压工作正在侵蚀你的健康，考虑调休或年假！", "warning");
    }
  }

  // [全系统自洽修复] 域C 联动增强(C→D): 职业里程碑→社交网络扩展 — 在职180天/365天/730天时结识职场朋友
  var _wd = job.workDays || 0;
  if (_wd === 180 || _wd === 365 || _wd === 730) {
    if (!state.flags) state.flags = {};
    var _netFlag = '_careerNetworkExpanded_' + _wd;
    if (!state.flags[_netFlag]) {
      state.flags[_netFlag] = true;
      // 给已有NPC关系加少量好感(模拟职场人脉积累)
      if (state.relationships) {
        var _relCount = 0;
        for (var _nid in state.relationships) {
          if (state.relationships[_nid] && state.relationships[_nid].met) {
            state.relationships[_nid].affinity = Math.min(100, (state.relationships[_nid].affinity || 0) + 1);
            _relCount++;
          }
        }
        if (_relCount > 0) {
          StateManager.addMessage("🤝 职场人脉扩展：长期积累的工作关系让你与" + _relCount + "位熟人联系更紧密了。", "info");
        }
      }
    }
  }

  // [全系统自洽修复] 域C 联动增强(C→F): 职业绩效趋势提示 — 每月发薪日展示绩效变化趋势
  if (state.player.day % 30 === 1 && job.workDays > 30) {
    var _perfNow = job.performance || 50;
    var _perfPrev = job._lastMonthPerf || _perfNow;
    var _perfDiff = _perfNow - _perfPrev;
    if (_perfDiff >= 5) {
      StateManager.addMessage("📈 本月绩效上升 " + _perfDiff + " 分，保持势头！", "success");
    } else if (_perfDiff <= -5) {
      StateManager.addMessage("📉 本月绩效下降 " + Math.abs(_perfDiff) + " 分，需要加把劲了。", "warning");
    }
    job._lastMonthPerf = _perfNow;
  }

  // 每月1日发薪
  if (state.player.day % 30 === 1) {
    var salary = calcActualSalary(state);
    if (typeof applyDreamIncomeBonus === "function") {
      salary = applyDreamIncomeBonus(state, salary, "salary");
    }
    // P1-5：证书→职业薪资加成
    var certBonus = _calcCertSalaryBonus(state, job.path, job.salary || 5000);
    state.resources.cash = (state.resources.cash || 0) + (salary || 0) + (certBonus || 0);
    // [全系统自洽修复] 域C A类#1: totalEarned NaN守卫（原裸+=，旧存档/极端值可致NaN传播）
    state.resources.totalEarned = (state.resources.totalEarned || 0) + (salary || 0) + (certBonus || 0);
    // [全系统自洽修复] 域C 联动增强#1 C→E: 高薪职业→投资信心加成（月薪≥20000时解锁投资分析增益）
    if (job.salary >= 20000) {
      if (!state.flags._highSalaryInvestor) {
        state.flags._highSalaryInvestor = true;
        StateManager.addMessage("💼 高薪让你有了更多投资底气。投资分析能力获得小幅加成。", "info");
      }
      // [全系统自洽修复] 域C R243 联动增强(C→E): 高薪发薪日叙事 — 每月发薪时提示资金规划
      if (job.salary >= 30000) {
        StateManager.addMessage("📈 月薪¥" + job.salary.toLocaleString() + "，除了消费，不妨考虑多元化资产配置。", "info");
      } else {
        StateManager.addMessage("💡 月薪¥" + job.salary.toLocaleString() + "，建议将20%收入用于储蓄或低风险投资。", "info");
      }
    }
    // [全系统自洽修复] 域C R357 联动增强: C→E 职业路径专属投资洞察(基于职业背景推荐相关行业)
    if (job.salary >= 15000 && state.player.day % 90 === 1) {
      var _careerInvestTips = {
        tech: "💻 你身处IT行业，对科技趋势有敏锐洞察。关注AI、云计算领域的成长股，利用行业认知优势。",
        finance: "📊 金融从业者让你对宏观数据敏感。债券基金+蓝筹股的组合适合你稳健增值。",
        sales: "🤝 销售让你懂市场冷暖。消费类ETF和地产REITs可以关注。",
        operations: "⚙️ 运营管理培养了你对效率的敏感。关注自动化、物流行业的龙头股。",
        design: "🎨 创意行业让你对消费趋势敏感。文创、IP经济相关题材值得关注。",
        legal: "⚖️ 法律专业让你能识别合规风险。优先考虑监管完善的蓝筹板块。",
        education: "📚 教育行业让你了解人才流向。教育培训、在线学习赛道有长期价值。",
        logistics: "🚚 物流行业让你对经济脉动有直观感受。关注基建、交通类基金。",
        catering: "🍜 餐饮经验让你对消费有深刻理解。消费类基金是合适的投资方向。",
        medical: "🏥 医疗行业让你了解健康产业发展。医药ETF和医疗器械股值得配置。",
        doctor: "👨‍⚕️ 医师视角让你看重长期价值。医疗健康类基金+固收组合是稳健选择。",
        public_institution: "🏢 体制内工作让你偏好稳健。国债+高分红蓝筹股适合你的风险偏好。",
        civil: "🏛️ 公务员视角让你关注政策风向。关注政策受益板块，避免高波动品种。"
      };
      var _careerTip = _careerInvestTips[job.path];
      if (_careerTip && !state.flags['_careerInvestTip_' + job.path]) {
        state.flags['_careerInvestTip_' + job.path] = true;
        StateManager.addMessage(_careerTip, "info");
      }
    }
    var salaryMsg =
      "💰 收到月薪 ¥" + salary.toLocaleString() + "（" + job.levelName + "）";
    if (isInProbation(state)) salaryMsg += "（试用期八折）";
    if (certBonus > 0)
      salaryMsg += " + 证书加成 ¥" + certBonus.toLocaleString();
    StateManager.addMessage(salaryMsg, "success");

    // 高阶职位需要维持社交关系
    var path = CAREER_PATHS[job.path];
    if (path) {
      var level = path.levels.find(function (l) {
        return l.id === job.levelId;
      });
      if (level && level.reqSocial) {
        // 社交关系不足会有绩效警告
        var colleagues = state.corporate?.colleagues?.network || [];
        var highTrust = colleagues.filter(function (c) {
          return c.relationship >= 60;
        }).length;
        if (highTrust < Math.floor(level.reqSocial / 20)) {
          StateManager.addMessage(
            "⚠️ 你的社交关系网络不足以支撑当前职位，小心被取代！",
            "warning",
          );
        }
      }
    }
  }
  if (job.workDays > 0 && job.workDays % 20 === 0) {
    var projectGain = Math.max(2, Math.floor((job.performance || 50) / 20));
    job.performance = Math.min(100, job.performance + 5);
    cap.industryResources = (cap.industryResources || 0) + projectGain;
    cap.clientLeads = (cap.clientLeads || 0) + Math.max(1, projectGain - 1);
    cap.burnout = (cap.burnout || 0) + 2;
    clampCareerCapital(cap);
    StateManager.addMessage(
      "💼 完成了一个阶段项目：业绩+5，行业资源+" +
        projectGain +
        "，客户线索+" +
        Math.max(1, projectGain - 1) +
        "。这些积累未来可转化为跳槽或创业优势。",
      "success",
    );
    // P1-3：项目完成记入职业历程（历程颗粒度从入职/晋升/辞职/跳槽4类→含项目完成）
    state.career.history.push({
      day: state.player.day,
      event:
        "完成项目（业绩" +
        (job.performance || 0) +
        "，资源+" +
        projectGain +
        "）",
    });
  }

  // ----- burnout 过劳后果（P0-5） -----
  // [全系统自洽修复] 域C 修复:Math.random→Random.chance 统一随机系统
  if (cap.burnout >= 80 && Random.chance(0.15)) {
    // 强制过劳病假
    state.status = state.status || {};
    state.status.health = Math.max(0, (state.status.health || 100) - 10);
    cap.burnout = Math.max(0, cap.burnout - 30);
    job.performance = Math.max(0, (job.performance || 50) - 5);
    clampCareerCapital(cap);
    StateManager.addMessage(
      "🏥 过度劳累导致病倒！被迫休养，健康-10，倦怠-30，业绩-5",
      "danger",
    );
  } else if (cap.burnout >= 50) {
    // 慢性过劳：每日降绩效+轻微掉健康
    job.performance = Math.max(0, (job.performance || 50) - 1);
    state.status = state.status || {};
    state.status.health = Math.max(0, (state.status.health || 100) - 0.5);
    if (Random.chance(0.05)) {
      StateManager.addMessage(
        "⚠️ 身体发出警告：长期高压工作正在消耗你的健康",
        "warning",
      );
    }
  }

  // [域C R418 联动增强] C→D: 高技能等级→NPC社交尊重 — 每10级skills提升NPC初始好感
  if (state.skills && state.player.day % 10 === 0) {
    var _totalSkillLevel = 0;
    for (var _sk in state.skills) {
      if (state.skills[_sk] && typeof state.skills[_sk].level === "number") {
        _totalSkillLevel += state.skills[_sk].level;
      }
    }
    if (_totalSkillLevel >= 50 && state.relationships && !state.flags._skillRespectNotified) {
      state.flags._skillRespectNotified = true;
      StateManager.addMessage("🌟 你掌握的多项技能让周围人刮目相看，社交圈中获得了更多尊重。", "info");
    }
  }

  // [域C R418 联动增强] C→G: 职业倦怠影响心情 — burnout>40时每日心情微降
  if (cap && cap.burnout > 40 && state.needs) {
    state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 0.5);
    if (cap.burnout > 70 && state.needs) {
      state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 0.5);
    }
  }

  // ----- 年终奖（P0-C, Blueprint 3.1.2） -----
  // 每工作满365天发放一次，系数由业绩+司龄+倦怠+随机加权
  var lastBonusDay = job._lastBonusDay || job.startDay || state.player.day;
  if (job.workDays > 0 && job.workDays - (job._lastBonusWorkDays || 0) >= 365) {
    var perfScore = (job.performance || 50) / 100; // 0-1
    var years = Math.floor(job.workDays / 365);
    var tenureScore = Math.min(1, years / 10); // 10年封顶
    var burnoutOk =
      (cap.burnout || 0) < 50 ? 1 : (cap.burnout || 0) < 70 ? 0.5 : 0;
    var randomScore = Random ? Random.float(0, 1) : 0.5;
    var raw =
      perfScore * 0.3 + tenureScore * 0.2 + burnoutOk * 0.2 + randomScore * 0.3;
    var coeff;
    if (raw < 0.25) coeff = 0;
    else if (raw < 0.45) coeff = 0.5;
    else if (raw < 0.65) coeff = 1;
    else if (raw < 0.82) coeff = 1.5;
    else coeff = 3;
    var baseMonthly = calcActualSalary(state);
    var bonus = Math.round(baseMonthly * coeff);
    job._lastBonusWorkDays = job.workDays;
    if (coeff <= 0) {
      StateManager.addMessage(
        "📊 年终考核不合格，取消年终奖。继续加油！",
        "warning",
      );
      state.career.history.push({
        day: state.player.day,
        event: "年终奖：系数0（不合格）",
      });
    } else {
      var dreamBonus = bonus;
      if (typeof applyDreamIncomeBonus === "function") {
        dreamBonus = applyDreamIncomeBonus(state, bonus, "bonus");
      }
      var finalBonus = dreamBonus;
      state.resources.cash = (state.resources.cash || 0) + (finalBonus || 0);
      // [全系统自洽修复] 域C A类#1: totalEarned NaN守卫
      state.resources.totalEarned = (state.resources.totalEarned || 0) + (finalBonus || 0);
      var coeffLabel =
        coeff === 3
          ? "超额完成(×3)"
          : coeff === 1.5
            ? "优秀(×1.5)"
            : coeff === 1
              ? "达标(×1)"
              : "低于预期(×0.5)";
      StateManager.addMessage(
        "🎉 年终奖 " +
          coeffLabel +
          "：+¥" +
          finalBonus.toLocaleString() +
          "（" +
          Math.round(raw * 100) +
          "分）",
        "success",
      );
      state.career.history.push({
        day: state.player.day,
        event: "年终奖：系数" + coeff + "，+¥" + finalBonus.toLocaleString(),
      });
    }
  }

  // ----- 年度考核调薪（P1-3） -----
  // 设计参考：现实中国职场年度考核涨薪5-15%
  var lastReview = job._lastReviewDay || job.startDay || state.player.day;
  if (state.player.day - lastReview >= 365) {
    var perf = job.performance || 50;
    var oldSalary = job.salary || 5000;
    var raise = 0;
    var grade = "";
    if (perf >= 85) {
      raise = 0.12;
      grade = "S（卓越）";
    } else if (perf >= 70) {
      raise = 0.08;
      grade = "A（优秀）";
    } else if (perf >= 50) {
      raise = 0.03;
      grade = "B（合格）";
    } else {
      raise = 0;
      grade = "C（待改进）";
    }
    job._lastReviewDay = state.player.day;
    if (raise > 0) {
      job.salary = Math.round(oldSalary * (1 + raise));
      state.career.history.push({
        day: state.player.day,
        event:
          "年度考核" +
          grade +
          "：涨薪" +
          Math.round(raise * 100) +
          "%（¥" +
          oldSalary.toLocaleString() +
          "→¥" +
          job.salary.toLocaleString() +
          "）",
      });
      StateManager.addMessage(
        "📊 年度考核" +
          grade +
          "！月薪涨" +
          Math.round(raise * 100) +
          "%：¥" +
          oldSalary.toLocaleString() +
          " → ¥" +
          job.salary.toLocaleString(),
        "success",
      );
    } else {
      cap.burnout = (cap.burnout || 0) + 5;
      clampCareerCapital(cap);
      state.career.history.push({
        day: state.player.day,
        event: "年度考核" + grade + "：未涨薪，倦怠+5",
      });
      StateManager.addMessage(
        "📊 年度考核" + grade + "：业绩不达标未涨薪，注意提升表现，倦怠+5",
        "warning",
      );
    }
  }

  // ----- 职业健康风险（v3.51）-----
  tickCareerOccupationalRisk(state);

  // ----- 倦怠恢复成就追踪 -----
  if (!state.flags) state.flags = {}; // [全系统自洽修复] 域C A类: state.flags 守卫
  if ((cap.burnout || 0) >= 70) {
    state.flags._burnoutWasHigh = true;
  }
  if (state.flags._burnoutWasHigh && (cap.burnout || 0) <= 20) {
    state.flags._burnoutSurvivor = true;
  }
}

// ============================================================
// 💊 职业健康风险系统（v3.51）
// 设计参考：《This War of Mine》职业代价 / 真实职业病数据 / 峰终定律
// 每个职业路径有专属的健康风险，体现职业的真实代价
// ============================================================

var _CAREER_RISK_PROFILES = {
  // IT：颈椎病+过劳综合征（996文化）
  tech: {
    dailyProb: [0.003, 0.005, 0.008, 0.012],
    msgs: [
      "🖥️ 长时间盯屏幕，脖子开始发酸——职业病正在悄悄找上你",
      "💻 连续敲代码伤了颈椎，健康受损",
      "😫 高级工程师的颈椎病发作，健康明显下降",
      "🏥 架构师的慢性过劳状态，身体在透支",
    ],
    healthDmg: [1, 2, 3, 5],
    attrKey: "mental",
    attrDmg: [0, 0.5, 1, 1.5],
    flagKey: "_careerDiseased_tech",
    diseaseMsg: "颈椎病/过劳综合征",
  },
  // 金融：焦虑症+睡眠障碍（业绩压力）
  finance: {
    dailyProb: [0.002, 0.004, 0.006, 0.009],
    msgs: [
      "📊 报表截止日，压力让你今晚难以入睡",
      "💼 季度审计压力积累，情绪开始绷紧",
      "😰 长期高压核账，睡眠质量下降，健康悄悄流失",
      "🧠 财务总监的决策压力已造成慢性焦虑，精神损耗",
    ],
    healthDmg: [1, 2, 3, 4],
    attrKey: "mental",
    attrDmg: [0.5, 1, 1.5, 2],
    flagKey: "_careerDiseased_finance",
    diseaseMsg: "焦虑症/睡眠障碍",
  },
  // 销售：情绪耗竭（长期高压推销）
  sales: {
    dailyProb: [0.002, 0.004, 0.007, 0.01],
    msgs: [
      "📞 一天接了几十个客户电话，情绪开始消耗",
      "😤 被拒绝太多次，心理韧性在流失",
      "🔥 长期高压谈单让你情绪耗竭，魅力和精神双双受损",
      "💀 销售经理的情绪黑洞——你开始麻木了",
    ],
    healthDmg: [1, 2, 3, 4],
    attrKey: "charm",
    attrDmg: [0.5, 1, 1.5, 2],
    flagKey: "_careerDiseased_sales",
    diseaseMsg: "情绪耗竭综合征",
  },
  // 医护：感染风险（医院环境）
  medical: {
    dailyProb: [0.004, 0.006, 0.008, 0.01],
    msgs: [
      "🦠 护理员接触传染患者，轻微感染风险",
      "😷 注册护士值夜班期间接触高危患者，有感染风险",
      "🏥 主管护师长期暴露高强度医护环境，健康悄悄流失",
      "⚠️ 护士长长期超负荷工作，免疫力下降",
    ],
    healthDmg: [2, 3, 4, 5],
    attrKey: "physique",
    attrDmg: [0, 0.5, 1, 1.5],
    flagKey: "_careerDiseased_medical",
    diseaseMsg: "职业感染/过劳",
  },
  // 医师：感染+超时工作（医生版）
  doctor: {
    dailyProb: [0.005, 0.007, 0.01, 0.012],
    msgs: [
      "🩺 实习医生连轴转，体力大幅透支",
      "😴 住院医师值36小时班，身体已在极限边缘",
      "🦠 主治医师接触高感染风险患者，健康受损",
      "⚡ 副主任医师长期精力超支，慢性职业病正在形成",
    ],
    healthDmg: [3, 4, 5, 6],
    attrKey: "physique",
    attrDmg: [0.5, 1, 1.5, 2],
    flagKey: "_careerDiseased_doctor",
    diseaseMsg: "职业感染/过劳综合征",
  },
  // 物流：腰椎损伤+交通风险
  logistics: {
    dailyProb: [0.005, 0.008, 0.006, 0.005],
    msgs: [
      "📦 长时间搬运重物，腰椎开始酸痛",
      "🛵 骑电动车风吹日晒，体力悄悄流失",
      "😤 站点主管还得身体力行，腰腿酸痛",
      "📋 区域经理长期出差，体力消耗比想象中大",
    ],
    healthDmg: [2, 3, 2, 2],
    attrKey: "physique",
    attrDmg: [1, 1.5, 1, 0.5],
    flagKey: "_careerDiseased_logistics",
    diseaseMsg: "腰椎损伤/体力透支",
  },
  // 餐饮：烫伤+腰腿痛
  catering: {
    dailyProb: [0.004, 0.006, 0.008, 0.007],
    msgs: [
      "🍳 餐厅服务站了一天，腿开始肿胀",
      "🔥 厨房油烟、高温环境让体力加速流失",
      "🏃 厨师长长时间站立操作，腰腿已成职业伤",
      "🌡️ 店长操劳过度，你不记得上次好好吃饭是什么时候了",
    ],
    healthDmg: [2, 3, 4, 3],
    attrKey: "physique",
    attrDmg: [0.5, 1, 1.5, 1],
    flagKey: "_careerDiseased_catering",
    diseaseMsg: "职业性腰腿痛/油烟肺",
  },
  // 教育：咽喉炎+嗓子损伤
  education: {
    dailyProb: [0.003, 0.005, 0.007, 0.006],
    msgs: [
      "🗣️ 今天讲了六节课，嗓子开始沙哑",
      "📚 教师职业嗓子损耗，咽喉已在发炎边缘",
      "😮‍💨 骨干教师长期高强度授课，慢性咽喉炎找上门",
      "🎤 管理+授课双重消耗，魅力与精力同步流失",
    ],
    healthDmg: [1, 2, 3, 3],
    attrKey: "charm",
    attrDmg: [0.5, 1, 1.5, 1.5],
    flagKey: "_careerDiseased_edu",
    diseaseMsg: "慢性咽喉炎/职业性嗓音病",
  },
  // 设计：视力退化（其余路径不触发）
  design: {
    dailyProb: [0.002, 0.004, 0.005, 0.007],
    msgs: [
      "👁️ 长时间盯着显示器做设计，眼睛开始干涩",
      "🖼️ 资深设计师的用眼量惊人，视力在悄悄下降",
      "💡 设计主管高强度创意输出，精神和视力双重消耗",
      "🎨 创意总监的大脑一刻不停，过劳开始侵蚀身体",
    ],
    healthDmg: [1, 2, 2, 4],
    attrKey: "mental",
    attrDmg: [0.5, 1, 1, 2],
    flagKey: "_careerDiseased_design",
    diseaseMsg: "视力退化/过劳综合征",
  },
  // [全系统自洽修复] 域C 修复:新增4条缺失职业路径
  // 运营管理：长期加班+久坐腰椎负担
  operations: {
    dailyProb: [0.003, 0.005, 0.007, 0.009],
    msgs: [
      "📋 运营报表堆成山，腰椎开始抗议久坐",
      "📊 季度运营复盘连续加班，精力明显下滑",
      "😤 运营主管被夹在高层和一线之间，情绪压力骤增",
      "⚡ 运营总监长期跨部门协调，精神和体力双重透支",
    ],
    healthDmg: [1, 2, 3, 4],
    attrKey: "mental",
    attrDmg: [0.5, 1, 1.5, 2],
    flagKey: "_careerDiseased_operations",
    diseaseMsg: "腰椎过劳/高压焦虑症",
  },
  // 法律服务：久坐+用眼过度
  legal: {
    dailyProb: [0.002, 0.004, 0.006, 0.008],
    msgs: [
      "📜 翻阅卷宗的第三个小时，脖子已经僵硬",
      "⚖️ 案件堆积如山，连续熬夜导致精神疲惫",
      "📑 资深律师长期伏案工作，颈椎开始发出警报",
      "🏛️ 合伙人级别的案头工作让你身心俱疲",
    ],
    healthDmg: [1, 2, 3, 4],
    attrKey: "mental",
    attrDmg: [0.5, 1, 1, 1.5],
    flagKey: "_careerDiseased_legal",
    diseaseMsg: "颈椎病/慢性疲劳",
  },
  // 事业单位：久坐+慢性疲劳
  public_institution: {
    dailyProb: [0.002, 0.003, 0.005, 0.007],
    msgs: [
      "🏢 坐了一整天等下班，腰酸背痛",
      "📋 文山会海让你的眼睛和腰椎都在抗议",
      "😴 年复一年的案头工作让你精力走下坡",
      "📑 长期伏案让你的身体亮起黄灯",
    ],
    healthDmg: [1, 1, 2, 3],
    attrKey: "physique",
    attrDmg: [0, 0.5, 1, 1],
    flagKey: "_careerDiseased_public",
    diseaseMsg: "久坐综合征/腰椎退化",
  },
  // 公务员：应酬+久坐
  civil: {
    dailyProb: [0.002, 0.003, 0.004, 0.006],
    msgs: [
      "🍺 今晚又有应酬，喝酒躲不掉",
      "📋 年底考核材料堆积，加班写材料写到头晕",
      "😮‍💨 长期应酬+伏案双重消耗，身体被掏空",
      "🏛️ 高级别岗位的政务压力开始侵蚀你的健康",
    ],
    healthDmg: [1, 2, 3, 4],
    attrKey: "physique",
    attrDmg: [0.5, 1, 1.5, 2],
    flagKey: "_careerDiseased_civil",
    diseaseMsg: "应酬病/久坐综合征",
  },
};

function tickCareerOccupationalRisk(state) {
  if (!state.career || !state.career.currentJob) return;
  var job = state.career.currentJob;
  var profile = _CAREER_RISK_PROFILES[job.path];
  if (!profile) return;

  // 找当前等级索引
  var path = CAREER_PATHS[job.path];
  if (!path) return;
  var levelIdx = 0;
  for (var i = 0; i < path.levels.length; i++) {
    if (path.levels[i].id === job.levelId) {
      levelIdx = i;
      break;
    }
  }

  var prob = profile.dailyProb[levelIdx] || 0.003;
  var rng = Random.float(0, 1);
  if (rng >= prob) return;

  // 触发职业风险
  state.status = state.status || {};
  var dmg = profile.healthDmg[levelIdx] || 1;
  state.status.health = Math.max(0, (state.status.health || 100) - dmg);

  var attrKey = profile.attrKey;
  var attrDmg = profile.attrDmg[levelIdx] || 0;
  if (attrDmg > 0) {
    // [全系统自洽修复] 域C 修复:state.player.attributes不存在，改用state.player[attrKey]直接访问
    var _attrVal = state.player[attrKey] || 0;
    state.player[attrKey] = Math.max(0, _attrVal - attrDmg);
  }

  StateManager.addMessage(profile.msgs[levelIdx], "warning");

  // 设置职业病成就标记
  if (!state.flags) state.flags = {}; // [全系统自洽修复] 域C A类: state.flags 守卫
  state.flags[profile.flagKey] = true;
  state.flags._hasOccupationalDisease = true;

  // 严重级别（高等级岗位伤害≥4）额外写入历史
  if (dmg >= 4) {
    state.career.history = state.career.history || [];
    state.career.history.push({
      day: state.player.day,
      event: "⚠️ 职业病发作：" + profile.diseaseMsg + "（健康-" + dmg + "）",
    });
  }
}

// ============================================================
// 🏥 医疗路径 × 疾病系统 跨系统联动（v3.11）
// 设计参考：真实医生看病打折 / 《大多数》技能联动 / This War of Mine 职业特长
// ============================================================

/**
 * 获取医疗职业的治疗折扣
 * 医师路径：利用专业知识和人脉获取医疗优惠
 * 护理路径：利用医院工作福利获取优惠
 */
function getCareerMedicalDiscount(state) {
  if (!state.career || !state.career.currentJob) return 0;
  var job = state.career.currentJob;
  // 👨‍⚕️ 医师路径：随职级递增，主任医师可免费治疗自己
  if (job.path === "doctor") {
    var discounts = {
      doc_intern: 0.05,
      doc_resident: 0.1,
      doc_attending: 0.18,
      doc_associate_chief: 0.25,
      doc_chief: 0.35,
    };
    return discounts[job.levelId] || 0;
  }
  // 🏥 护理路径：医院工作福利
  if (job.path === "medical") {
    var nurseDiscounts = {
      med_aide: 0.03,
      med_nurse: 0.08,
      med_senior_nurse: 0.12,
      med_head_nurse: 0.18,
    };
    return nurseDiscounts[job.levelId] || 0;
  }
  return 0;
}

/**
 * 医师/护理职业对健康的影响（每日加成）
 */
function tickCareerHealthBonus(state) {
  if (!state.career || !state.career.currentJob) return;
  var job = state.career.currentJob;
  var p = state.player;
  // 👨‍⚕️ 医师：医学知识带来日常健康维护
  if (job.path === "doctor") {
    var medicineLevel =
      (state.skills && state.skills.medicine && state.skills.medicine.level) ||
      0;
    if (medicineLevel >= 20 && Random.chance(0.3)) {
      state.status = state.status || {};
      state.status.health = Math.min(100, (state.status.health || 100) + 0.5);
    }
  }
  // 🏥 护理：医疗环境工作，疾病抵抗力更强
  if (job.path === "medical") {
    if (Random.chance(0.2)) {
      state.status = state.status || {};
      state.status.health = Math.min(100, (state.status.health || 100) + 0.3);
    }
  }
}

// ============================================================
// ⚖️ 公职路径 × 法律系统 跨系统联动（v3.11）
// 设计参考：真实中国公务员法律保护 / Papers Please 体制内优势
// ============================================================

/**
 * 获取公职人员的法律费用折扣
 * 公务员/事业单位：通过体制内资源获得法律服务优惠
 */
function getCareerLegalDiscount(state) {
  if (!state.career || !state.career.currentJob) return 0;
  var job = state.career.currentJob;
  // 🏛️ 公务员路径
  if (job.path === "civil") {
    var civilDiscounts = {
      civil_clerk: 0.05,
      civil_officer: 0.1,
      civil_deputy: 0.18,
      civil_chief: 0.25,
    };
    return civilDiscounts[job.levelId] || 0;
  }
  // 🏢 事业单位路径
  if (job.path === "public_institution") {
    var piDiscounts = {
      pi_clerk: 0.03,
      pi_officer: 0.08,
      pi_deputy_section: 0.15,
      pi_section_chief: 0.2,
      pi_deputy_div: 0.28,
    };
    return piDiscounts[job.levelId] || 0;
  }
  return 0;
}

// ============================================================
// 💼 面试/试用期/解雇机制（v3.11）
// 设计参考：真实中国职场流程 / BitLife 雇佣系统 / Papers Please 绩效压力
// ============================================================

/**
 * 获取试用期剩余天数（入职前90天为试用期，薪资80%）
 */
function getProbationRemaining(state) {
  if (!state.career || !state.career.currentJob) return 0;
  var job = state.career.currentJob;
  var workDays = job.workDays || 0;
  // v3.1：跳槽等特殊情况可自定义试用期天数（默认90天）
  var totalProbation = job._probationDays || 90;
  return Math.max(0, totalProbation - workDays);
}

function isInProbation(state) {
  return getProbationRemaining(state) > 0;
}

/**
 * 计算实际工资（试用期只发80%）
 */
function calcActualSalary(state) {
  if (!state.career || !state.career.currentJob) return 0;
  var job = state.career.currentJob;
  var base = job.salary || 0;
  if (isInProbation(state)) base = Math.round(base * 0.8);
  var cb =
    typeof _calcCertSalaryBonus === "function"
      ? _calcCertSalaryBonus(state, job.path, job.salary || 5000)
      : 0;
  return base + cb;
}

/**
 * 每日检视解雇条件
 * 连续30天业绩低于20将被解雇
 */
function tickCareerFiringRisk(state) {
  if (!state.career || !state.career.currentJob) return;
  var job = state.career.currentJob;
  var perf = job.performance || 50;
  if (perf < 20) {
    job._lowPerfDays = (job._lowPerfDays || 0) + 1;
  } else {
    job._lowPerfDays = 0;
  }
  if ((job._lowPerfDays || 0) >= 30) {
    StateManager.addMessage(
      "⚠️ 因长期业绩不达标，你被公司解雇了！职场不相信眼泪。",
      "danger",
    );
    state.career.history.push({
      day: state.player.day,
      event: "因业绩不达标被解雇（" + job.levelName + "）",
    });
    state.career.currentJob = null;
    if (typeof renderAll === "function") renderAll();
  }
}

/**
 * 为applyCareerJob增加面试检查和试用期
 * 在原有入职流程中嵌入
 */
function enhancedApplyCareerJob(pathId, levelId) {
  try {
    var state = StateManager.getState();
    // [全系统自洽修复] 域C A类#2: CAREER_PATHS 可能未定义（加载顺序问题）
    if (typeof CAREER_PATHS === "undefined" || !CAREER_PATHS) {
      StateManager.addMessage("⚠️ 职业系统尚未加载", "warning");
      return;
    }
    var path = CAREER_PATHS[pathId];
    if (!path) {
      StateManager.addMessage("⚠️ 该职业路径不存在", "warning");
      return;
    }
    var level = path.levels.find(function (l) {
      return l.id === levelId;
    });
    if (!level) return;

    // --- 面试检测 ---
    var meetReqs = checkCareerPromotion(state, pathId, level);
    if (!meetReqs) {
      if (typeof showCareerRequirementsModal === "function") {
        showCareerRequirementsModal(state, pathId, level);
      } else if (typeof showModal === "function") {
        showModal({
          title: "❌ 条件不足",
          body: '<div style="text-align:center;padding:12px;"><p style="font-size:14px;">你不满足该职位的招聘条件</p></div>',
          buttons: [
            {
              text: "知道了",
              cls: "btn-primary",
              callback: function () {
                return true;
              },
            },
          ],
        });
      } else {
        StateManager.addMessage("⚠️ 你不满足该职位的条件，面试失败", "warning");
      }
      return;
    }

    var p = state.player;
    var totalWorkDays = p.day || 0;

    // 最低经验门槛：需要至少3天的基础历练才能投递正式工作
    if (totalWorkDays < 3) {
      if (typeof showModal === "function") {
        // 构建具体经验不足弹窗
        var pathName = path.icon + " " + path.name;
        var levelName = level.name;
        var daysNeeded = 3 - totalWorkDays;
        var reqLines = [];

        // 年龄检测
        var pAge = p.age || 18;
        var ageReqs = level.minAge || 0;
        var ageOk = pAge >= ageReqs;
        reqLines.push(
          "<div style='display:flex;justify-content:space-between;padding:2px 0;'>" +
            "<span>" +
            (ageOk ? "✅" : "❌") +
            " 年龄 ≥" +
            ageReqs +
            "岁</span>" +
            "<span style='color:var(--text-muted);font-size:12px;'>当前 " +
            pAge +
            "岁</span>" +
            "</div>",
        );

        // 属性检测
        if (level.reqAttrs) {
          for (var ra in level.reqAttrs) {
            var curAttr = p[ra] || 0;
            var reqAttr = level.reqAttrs[ra];
            var attrMap = {
              physique: "💪 体质",
              intelligence: "🧠 智力",
              agility: "⚡ 敏捷",
              mental: "❤️ 心智",
              charm: "🌟 魅力",
            };
            var attrLabel = attrMap[ra] || ra;
            var attrOk = curAttr >= reqAttr;
            reqLines.push(
              "<div style='display:flex;justify-content:space-between;padding:2px 0;'>" +
                "<span>" +
                (attrOk ? "✅" : "❌") +
                " " +
                attrLabel +
                " ≥" +
                reqAttr +
                "</span>" +
                "<span style='color:var(--text-muted);font-size:12px;'>当前 " +
                curAttr +
                "</span>" +
                "</div>",
            );
          }
        }

        // 技能检测
        if (level.reqSkills) {
          for (var rs in level.reqSkills) {
            var curSkill = (state.skills && state.skills[rs] && state.skills[rs].level) || 0; // [全系统自洽修复] 域C 修复:p.skills不存在→改用state.skills[rs].level
            var reqSkill = level.reqSkills[rs];
            var skillOk = curSkill >= reqSkill;
            var skillLabelMap = {
              cooking: "🍳 厨艺",
              management: "📊 管理",
              sales: "💼 销售",
              medicine: "💊 医学",
              driving: "🚗 驾驶",
              logistics: "📦 物流",
              computing: "💻 计算机",
              construction: "🔨 建造",
              repair: "🔧 维修",
              communication: "🗣️ 沟通",
              fitness: "🏋️ 健身",
              dodge: "🤸 闪避",
              stealth: "👤 潜行",
              crafting: "🔨 制作",
              planting: "🌱 种植",
              fishing: "🎣 钓鱼",
              performance: "🎭 表演",
              leadership: "⚑ 领导",
            };
            var skillLabel = skillLabelMap[rs] || rs;
            reqLines.push(
              "<div style='display:flex;justify-content:space-between;padding:2px 0;'>" +
                (skillOk ? "✅" : "❌") +
                " " +
                skillLabel +
                " Lv." +
                reqSkill +
                "<span style='color:var(--text-muted);font-size:12px;'>当前 Lv." +
                curSkill +
                "</span>" +
                "</div>",
            );
          }
        }

        // 教育检测
        var eduReqs = level.reqEducation || 0; // [全系统自洽修复] 域C 修复:level.education→level.reqEducation（字段名对齐checkCareerPromotion）
        var pEdu = p.education || 0;
        var eduOk = pEdu >= eduReqs;
        var eduNameMap = [
          "无",
          "小学",
          "初中",
          "高中/中专",
          "大专",
          "本科",
          "硕士",
          "博士",
        ];
        if (eduReqs > 0) {
          reqLines.push(
            "<div style='display:flex;justify-content:space-between;padding:2px 0;'>" +
              (eduOk ? "✅" : "❌") +
              " 学历 ≥" +
              (eduNameMap[eduReqs] || eduReqs) +
              "</span>" +
              "<span style='color:var(--text-muted);font-size:12px;'>当前 " +
              (eduNameMap[pEdu] || pEdu) +
              "</span>" +
              "</div>",
          );
        }

        var progressBar =
          "<div style='background:#444;border-radius:4px;height:8px;margin:8px 0;overflow:hidden;'>" +
          "<div style='background:var(--accent,#ff9800);width:" +
          Math.round((totalWorkDays / 3) * 100) +
          "%;height:100%;border-radius:4px;'></div>" +
          "</div>" +
          "<div style='display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);'>" +
          "<span>已工作 " +
          totalWorkDays +
          " 天</span>" +
          "<span>还需 " +
          daysNeeded +
          " 天</span>" +
          "</div>";

        showModal({
          title: "⏳ 经验不足",
          body:
            '<div style="padding:8px 12px;">' +
            "<p style='font-size:14px;font-weight:bold;margin-bottom:4px;'>" +
            pathName +
            " · " +
            levelName +
            "</p>" +
            "<p style='font-size:12px;color:var(--text-muted);margin-bottom:6px;'>需要至少 3 天工作经验才能投递正式工作</p>" +
            progressBar +
            "<div style='margin:8px 0;padding:6px 8px;background:rgba(255,255,255,0.05);border-radius:6px;'>" +
            reqLines.join("") +
            "</div>" +
            "<p style='font-size:12px;color:var(--accent,#ff9800);margin-top:6px;'>💡 建议：先去做日结工作积累经验和资金</p>" +
            "<p style='font-size:11px;color:var(--text-muted);'>👉 点击左侧「⚡ 行动」标签页找日结工作</p>" +
            "</div>",
          buttons: [
            {
              text: "知道了",
              cls: "btn-primary",
              callback: function () {
                return true;
              },
            },
          ],
        });
      } else {
        StateManager.addMessage(
          "⚠️ 经验不足（当前" +
            totalWorkDays +
            "天，需要3天工作经验才能投递正式工作）",
          "warning",
        );
      }
      return;
    }

    // --- 面试成功率 v3.2 大修：技能 × 状态 × 履历 × 装备 ---
    // 设计原则：街头→职场应有显著门槛，临时工不鸡肋，职场不白给

    // (A) 基础概率：基于工作经验天数，职场需要"磨"出来
    // 0天 → 25%，15天 → 40%，30天 → 55%，60天 → 85%
    // 让街头工作成为必需品
    var workExpBonus = Math.min(0.6, totalWorkDays * 0.01);
    var interviewChance = 0.25 + workExpBonus;

    // (B) 属性优势：属性远超要求 → +5%/项
    if (level.reqAttrs) {
      for (var a in level.reqAttrs) {
        var attrVal = p[a] || 0;
        var req = level.reqAttrs[a];
        if (attrVal >= req * 1.5) interviewChance += 0.05;
        else if (attrVal < req) interviewChance -= 0.15;
      }
    }

    // (C) 技能优势：相关技能超过要求 → 每高5级+2%
    if (level.reqSkills) {
      for (var sk in level.reqSkills) {
        var skReq = level.reqSkills[sk];
        var skActual = 0;
        if (state.skills && state.skills[sk])
          skActual = state.skills[sk].level || 0;
        var skOver = skActual - skReq;
        if (skOver > 0) interviewChance += Math.min(0.15, skOver * 0.02);
      }
    }

    // (D) 状态惩罚（重要：生存状态差的角色面试成功率暴跌）
    var statePenaltyMessages = [];
    var penaltyLines = [];
    var needs = state.needs || {};
    // [全系统自洽修复] 域C A类修复: needs.food→needs.hunger, needs.stamina→needs.fatigue（字段名错误导致面试惩罚从未生效）
    if ((needs.hunger || 100) < 25) {
      statePenaltyMessages.push("饥饿");
      penaltyLines.push("🍖 饥饿 -12%");
      interviewChance -= 0.12;
    } else if ((needs.hunger || 100) < 45) {
      statePenaltyMessages.push("半饥饿状态");
      penaltyLines.push("🍖 半饥饿 -5%");
      interviewChance -= 0.05;
    }
    if ((needs.fatigue || 100) < 20) {
      statePenaltyMessages.push("极度疲劳");
      penaltyLines.push("😴 极度疲劳 -15%");
      interviewChance -= 0.15;
    } else if ((needs.fatigue || 100) < 45) {
      statePenaltyMessages.push("疲劳");
      penaltyLines.push("😴 疲劳 -6%");
      interviewChance -= 0.06;
    }
    // [全系统自洽修复] 域C A类修复: state.status 守卫(防止旧存档面试崩溃)
    var _health = state.status ? (state.status.health || 100) : 100;
    if (_health < 50) {
      statePenaltyMessages.push("健康状况差");
      penaltyLines.push("🏥 健康状况差 -12%");
      interviewChance -= 0.12;
    } else if (_health < 75) {
      statePenaltyMessages.push("亚健康");
      penaltyLines.push("🏥 亚健康 -4%");
      interviewChance -= 0.04;
    }
    // [全系统自洽修复] 域C A类修复: needs.mood→needs.happiness
    if ((needs.happiness || 100) < 20) {
      statePenaltyMessages.push("心情极差");
      penaltyLines.push("😢 心情极差 -10%");
      interviewChance -= 0.1;
    } else if ((needs.happiness || 100) < 45) {
      statePenaltyMessages.push("心情不佳");
      penaltyLines.push("😢 心情不佳 -5%");
      interviewChance -= 0.05;
    }
    if ((needs.hygiene || 100) < 20) {
      statePenaltyMessages.push("衣衫不整");
      penaltyLines.push("🚿 衣衫不整 -10%");
      interviewChance -= 0.1;
    } else if ((needs.hygiene || 100) < 45) {
      statePenaltyMessages.push("形象欠佳");
      penaltyLines.push("🚿 形象欠佳 -4%");
      interviewChance -= 0.04;
    }

    // (E) 住房惩罚：露宿街头 → 面试大减分
    var housing = state.housing || state.home || null;
    var loc =
      typeof LOCATIONS !== "undefined"
        ? LOCATIONS[state.trade && state.trade.currentLocation]
        : null;
    var homeless = !housing;
    if (homeless || (state.trade && state.trade.currentLocation === "slum")) {
      statePenaltyMessages.push("无固定住所");
      penaltyLines.push("🏚️ 无固定住所 -15%");
      interviewChance -= 0.15;
    }

    // (F) 装备加成：得体着装大幅提升面试成功率
    var hasFormalClothes = false;
    var hasMarketVendorOutfit = false;
    var inventory = state.inventory || [];
    for (var ii = 0; ii < inventory.length; ii++) {
      var invItem = inventory[ii];
      var itemId = typeof invItem === "string" ? invItem : invItem.id;
      if (itemId === "suit" || itemId === "formal_shoes") {
        hasFormalClothes = true;
        break;
      }
      if (itemId === "decent_outfit" || itemId === "blazer") {
        hasFormalClothes = true;
      }
    }
    if (hasFormalClothes) {
      interviewChance += 0.15;
    }

    // (G) 最新消息加分：最近30天内NPC好感>-5 +3%
    var npcAff = state.npcAffinity || {};
    var anyGoodRelation = false;
    for (var ni in npcAff) {
      if (npcAff[ni] > -5) {
        anyGoodRelation = true;
        break;
      }
    }
    if (anyGoodRelation) interviewChance += 0.03;

    // [全系统自洽修复] 域D 联动增强: D→C NPC面试推荐加成 — 高好感关键NPC提供面试成功率加成
    if (typeof getNpcReferralBonus === "function") {
      var _npcBonus = getNpcReferralBonus(state);
      if (_npcBonus > 0) {
        interviewChance += _npcBonus / 100;
      }
    }

    interviewChance = Math.max(0.1, Math.min(0.95, interviewChance));

    // 构建反馈信息
    var feedbackParts = [];
    if (totalWorkDays < 30) {
      feedbackParts.push("📊 资历较浅（仅" + totalWorkDays + "天经验）");
    }
    if (statePenaltyMessages.length > 0) {
      feedbackParts.push("😰 状态劣势：" + statePenaltyMessages.join("、"));
    }
    if (hasFormalClothes) {
      feedbackParts.push("👔 着装得体 +15%");
    }
    // [全系统自洽修复] 域D 联动增强: D→C NPC面试推荐加成反馈
    if (typeof getNpcReferralBonus === "function") {
      var _npcBonus = getNpcReferralBonus(state);
      if (_npcBonus > 0) {
        feedbackParts.push("👥 人脉推荐 +" + _npcBonus + "%");
      }
    }

    var randVal = Random.float(0, 1);
    if (randVal > interviewChance) {
      // 面试失败 → 弹窗展示详细原因
      var failChancePct = Math.round(interviewChance * 100);
      var bodyLines = [
        '<div style="text-align:center;padding:8px 0;">',
        '<p style="font-size:24px;margin:4px 0;">❌</p>',
        '<p style="font-size:15px;font-weight:bold;margin:4px 0;">' +
          level.name +
          " 面试未通过</p>",
        '<p style="font-size:12px;color:var(--text-muted);margin:8px 0;">面试成功率仅 <span style="color:var(--danger);font-weight:bold;">' +
          failChancePct +
          "%</span></p>",
      ];
      if (penaltyLines.length > 0) {
        bodyLines.push(
          '<div style="text-align:left;font-size:11px;color:var(--text-muted);padding:6px 12px;border-top:1px solid var(--border);margin-top:4px;">',
        );
        bodyLines.push(
          '<p style="font-weight:bold;margin:2px 0;">📉 不利因素：</p>',
        );
        penaltyLines.forEach(function (pl) {
          bodyLines.push(
            '<p style="margin:1px 0;padding-left:8px;">' + pl + "</p>",
          );
        });
        bodyLines.push("</div>");
      }
      bodyLines.push(
        '<p style="font-size:11px;color:var(--text-muted);margin-top:6px;">💡 改善状态、积累经验后再来试试</p>',
      );
      bodyLines.push("</div>");

      var failMsg = "📄 面试未通过。" + level.name + "的竞争很激烈";
      if (feedbackParts.length > 0) {
        failMsg += "（" + feedbackParts.join("；") + "）";
      }
      failMsg += "，继续提升自己再来试试。";
      StateManager.addMessage(failMsg, "warning");

      if (typeof showModal === "function") {
        showModal({
          title: "📄 面试未通过",
          body: bodyLines.join(""),
          buttons: [
            {
              text: "继续努力",
              cls: "btn-primary",
              callback: function () {
                return true;
              },
            },
          ],
        });
      }
      return;
    }

    // --- 入职流程 ---
    if (!state.career) state.career = { currentJob: null, history: [] };
    var cap = ensureCareerCapital(state);
    if (state.career.currentJob) {
      if (typeof showModal === "function") {
        showModal({
          title: "⚠️ 已有工作",
          body: '<div style="text-align:center;padding:12px;"><p style="font-size:14px;">你已经有工作了</p><p style="font-size:12px;color:var(--text-muted);margin-top:4px;">先辞职才能投递新职位</p></div>',
          buttons: [
            {
              text: "知道了",
              cls: "btn-primary",
              callback: function () {
                return true;
              },
            },
          ],
        });
      } else {
        StateManager.addMessage(
          "⚠️ 你已经有工作了，先辞职才能投递新职位",
          "warning",
        );
      }
      return;
    }

    state.career.currentJob = {
      path: pathId,
      levelId: levelId,
      levelName: level.name,
      salary: level.salary,
      workDays: 0,
      startDay: state.player.day,
      performance: 50,
    };
    if (typeof initCareerColleagues === "function") {
      initCareerColleagues(state);
    }
    cap.reputation = (cap.reputation || 0) + 2;
    cap.industryResources = (cap.industryResources || 0) + 1;
    clampCareerCapital(cap);

    var probationMsg = isInProbation(state)
      ? "（前90天为试用期，薪资按80%发放）"
      : "";

    // 最终入职消息（修复 passMsg 未定义 bug）
    var finalMsg =
      "✅ 面试通过！入职成功！你成为" +
      getCareerPathLabel(pathId) +
      "的" +
      level.name +
      "，月薪¥" +
      level.salary.toLocaleString();
    if (probationMsg) finalMsg += "，" + probationMsg;
    StateManager.addMessage(finalMsg, "success");

    // 面试通过 → 弹窗庆祝
    var successChancePct = Math.round(interviewChance * 100);
    var successBody = [
      '<div style="text-align:center;padding:8px 0;">',
      '<p style="font-size:24px;margin:4px 0;">🎉</p>',
      '<p style="font-size:15px;font-weight:bold;margin:4px 0;">恭喜入职 ' +
        getCareerPathLabel(pathId) +
        "</p>",
      '<p style="font-size:13px;color:var(--accent);margin:4px 0;">' +
        level.name +
        " · 月薪¥" +
        level.salary.toLocaleString() +
        "</p>",
    ];
    if (probationMsg) {
      successBody.push(
        '<p style="font-size:11px;color:var(--warning);margin:4px 0;">' +
          probationMsg +
          "</p>",
      );
    }
    successBody.push(
      '<p style="font-size:11px;color:var(--text-muted);margin-top:6px;">面试成功率 ' +
        successChancePct +
        "% · 脱颖而出！</p>",
    );
    successBody.push("</div>");

    if (typeof showModal === "function") {
      showModal({
        title: "✅ 面试通过！",
        body: successBody.join(""),
        buttons: [
          {
            text: "开始工作！",
            cls: "btn-primary",
            callback: function () {
              return true;
            },
          },
        ],
      });
    }

    if (typeof renderAll === "function") renderAll();
  } catch (e) {
    console.error("[career_dev] enhancedApplyCareerJob error:", e);
    StateManager.addMessage("⚠️ 求职过程中出现异常，请查看控制台", "danger");
  }
}

// ====== 导航弹窗辅助函数（约定式：可被未来新增职业路线自动复用） ======
/** 子Tab导航弹窗：说明 + 确认跳转 */
function showCareerNavModal(subTab, parentTab, label, desc) {
  if (typeof showModal !== "function") {
    return;
  }
  showModal({
    title: label,
    body:
      '<div style="text-align:center;padding:8px 0;">' +
      '<div style="font-size:32px;margin-bottom:10px;">' +
      (label.indexOf("上班族") >= 0 ? "💼" : "🚀") +
      "</div>" +
      '<p style="font-size:14px;color:var(--text-secondary);line-height:1.6;">' +
      desc +
      "</p>" +
      "</div>",
    buttons: [
      {
        text: "取消",
        cls: "btn-secondary",
        callback: function () {
          return true;
        },
      },
      {
        text: "好的，去那里",
        cls: "btn-primary",
        callback: function () {
          var st =
            typeof StateManager !== "undefined" &&
            typeof StateManager.getState === "function"
              ? StateManager.getState()
              : null;
          if (st) {
            // v3.7 合并重构：映射旧 tab 到新 tab
            if (parentTab === "career_dev" || parentTab === "career") {
              st._careerTabSubTab = subTab;
              if (typeof switchTab === "function") switchTab("career");
            } else {
              st._careerSubTab = subTab;
              if (typeof switchTab === "function") switchTab(parentTab);
            }
          }
          return true;
        },
      },
    ],
  });
}
/** 地点导航弹窗：说明 + 确认跳转 */
function showLocationNavModal(locKey, label, navTab, desc, subTab) {
  if (typeof showModal !== "function") {
    return;
  }
  showModal({
    title: label,
    body:
      '<div style="text-align:center;padding:8px 0;">' +
      '<div style="font-size:32px;margin-bottom:10px;">🎓</div>' +
      '<p style="font-size:14px;color:var(--text-secondary);line-height:1.6;">' +
      desc +
      "</p>" +
      "</div>",
    buttons: [
      {
        text: "取消",
        cls: "btn-secondary",
        callback: function () {
          return true;
        },
      },
      {
        text: "出发",
        cls: "btn-primary",
        callback: function () {
          var st =
            typeof StateManager !== "undefined" &&
            typeof StateManager.getState === "function"
              ? StateManager.getState()
              : null;
          if (st && typeof _doNavigate === "function") {
            _doNavigate(st, {
              type: "location",
              key: locKey,
              navTab: navTab || "actions",
              subTab: subTab || undefined,
            });
          }
          return true;
        },
      },
    ],
  });
}

// ====== 条件不足详细弹窗（约定式：自动解释缺失条件） ======
/** 根据 checkCareerPromotion 逆向生成 "你差什么" 说明，并弹窗 */
function showCareerRequirementsModal(state, pathKey, level) {
  if (typeof showModal !== "function") {
    StateManager.addMessage("⚠️ 条件不足，请查看要求提升自己", "warning");
    return;
  }
  var path = CAREER_PATHS[pathKey];
  if (!path || !level) return;

  var results = checkCareerPromotionDetailed(state, pathKey, level);

  // 使用约定式条件系统统一弹窗
  if (typeof ConditionSystem !== "undefined" && ConditionSystem.showModal) {
    ConditionSystem.showModal(results, {
      icon: path.icon,
      subtitle: path.name + " — " + level.name,
      passText: "全部条件满足！可以投递该职位",
      failText: "红色项需要优先提升，满足所有条件后再来投递",
    });
    return;
  }

  // fallback
  var metCount = 0;
  for (var ri = 0; ri < results.length; ri++) {
    if (results[ri].ok) metCount++;
  }
  var allMet = metCount === results.length;

  var body =
    '<div style="text-align:left;font-size:13px;">' +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border);">' +
    '<span style="font-size:22px;">' +
    path.icon +
    "</span>" +
    '<div><div style="font-weight:bold;font-size:14px;">' +
    path.name +
    " — " +
    level.name +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-muted);">' +
    metCount +
    "/" +
    results.length +
    " 条件已满足</div></div></div>" +
    '<div style="display:flex;flex-direction:column;gap:2px;">' +
    _renderCondRows(results) +
    "</div>" +
    (allMet
      ? '<div style="margin-top:10px;padding:6px 8px;background:rgba(46,204,113,0.1);border-radius:4px;text-align:center;font-size:12px;color:var(--success);font-weight:bold;">🎉 全部条件满足！可以投递该职位</div>'
      : '<div style="margin-top:10px;font-size:11px;color:var(--text-muted);font-style:italic;">💡 红色项需要优先提升，满足所有条件后再来投递</div>') +
    "</div>";

  showModal({
    title: allMet ? "✅ 条件检查" : "❌ 条件不足",
    body: body,
    buttons: [
      {
        text: "知道了",
        cls: "btn-primary",
        callback: function () {
          return true;
        },
      },
    ],
  });
}

// ====== 职业路线预览弹窗（v3.48） ======
/**
 * 显示职业路线完整预览 — 晋升阶梯图 + 各等级要求 + 玩家当前达标状态
 * 设计意图：让玩家在投递前就看到完整职业发展路径，降低决策焦虑
 */
function showCareerPathPreviewModal(pathKey) {
  var st = StateManager.getState();
  var path = CAREER_PATHS[pathKey];
  if (!path || !Array.isArray(path.levels) || path.levels.length === 0) return; // [全系统自洽修复] 域F 职业路径 levels 数组守卫
  var p = st.player;
  var skills = st.skills || {};

  var body = '<div style="padding:4px 0;">';
  // 路径头部
  body +=
    '<div style="text-align:center;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--border);">';
  body +=
    '<div style="font-size:20px;margin-bottom:4px;">' + path.icon + "</div>";
  body +=
    '<div style="font-size:15px;font-weight:bold;">' + path.name + "</div>";
  body +=
    '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">' +
    (typeof getCategoryLabel === "function"
      ? getCategoryLabel(path.category)
      : path.category) +
    " · " +
    path.levels.length +
    "级晋升</div>";
  var entrySalary = path.levels[0].salary;
  var maxSalary = path.levels[path.levels.length - 1].salary;
  body +=
    '<div style="font-size:12px;color:var(--accent);margin-top:4px;">月薪范围 ¥' +
    entrySalary.toLocaleString() +
    " → ¥" +
    maxSalary.toLocaleString() +
    "</div>";
  body += "</div>";

    // [全系统自洽修复] 域C 增强:证书加成展示
  var _certs2 = st.certificates || [];
  if (_certs2.length > 0) {
    var _pathCertBonus = [];
    for (var _ci2 = 0; _ci2 < _certs2.length; _ci2++) {
      var _cd2 = getCertificateById(_certs2[_ci2]);
      if (_cd2 && _cd2.salaryBonus && _cd2.salaryBonus[pathKey]) {
        _pathCertBonus.push(_cd2.name + ' +' + Math.round(_cd2.salaryBonus[pathKey] * 100) + '%');
      }
    }
    if (_pathCertBonus.length > 0) {
      body += '<div style="font-size:10px;color:var(--success);padding:6px 8px;margin-bottom:8px;background:rgba(74,158,92,0.06);border-radius:6px;">';
      body += '🎓 你的证书加成本路径：' + _pathCertBonus.join(' · ');
      body += '</div>';
    }
  }

  // [全系统自洽修复] 域C 增强:技能树分支推荐(职业路径→最佳技能分支)
  var _branchRecMap = {
    tech: { skill: 'coding', branches: ['frontend_dev', 'backend_arch', 'security'], tip: '编程技能树分支直接提升IT职场能力' },
    finance: { skill: 'accounting', branches: ['tax_accounting', 'audit_risk'], tip: '会计税务/审计分支提升财务类收入' },
    sales: { skill: 'sales', branches: ['store_sales', 'biz_negotiation'], tip: '门店销售/商务谈判分支提升销售业绩' },
    operations: { skill: 'management', branches: ['team_mgmt', 'strategy_planning'], tip: '团队管理/战略规划分支提升运营能力' },
    design: { skill: 'coding', branches: ['frontend_dev'], tip: '前端开发分支提升设计创意类收入' },
    legal: { skill: 'english', branches: ['translation', 'business_english'], tip: '翻译/商务英语分支累积法律语言优势' },
    education: { skill: 'english', branches: ['business_english'], tip: '商务英语分支有助于教育培训沟通' },
    logistics: { skill: 'driving', branches: ['passenger_transport', 'freight'], tip: '客运/货运驾驶分支提升物流效率' },
    catering: { skill: 'cooking', branches: ['home_chef', 'street_foodie'], tip: '家常大厨/街头美食家分支提升餐饮收入' },
    public_institution: { skill: 'management', branches: ['team_mgmt', 'strategy_planning'], tip: '管理分支有助于体制内晋升' },
    civil: { skill: 'management', branches: ['team_mgmt', 'strategy_planning'], tip: '管理分支有助于公务员晋升' },
  };
  var _rec = _branchRecMap[pathKey];
  if (_rec) {
    var _skBranch = st.skillBranches && st.skillBranches[_rec.skill];
    var _hasBranch = _skBranch && _rec.branches.indexOf(_skBranch) >= 0;
    var _skLv = (st.skills[_rec.skill] && st.skills[_rec.skill].level) || 0;
    body += '<div style="font-size:10px;color:var(--text-muted);padding:6px 8px;margin-bottom:8px;background:rgba(255,183,77,0.06);border:1px solid rgba(255,183,77,0.2);border-radius:6px;">';
    body += '🌳 推荐技能分支：<strong>' + getSkillChineseName(_rec.skill) + '</strong>（当前Lv.' + _skLv + '）→ ';
    body += _hasBranch ? '✅ 已选择「' + getSkillBranchLabel(_rec.skill, st) + '」' : '推荐' + _rec.tip;
    body += '</div>';
  }


  // [全系统自洽修复] 域C R391: 技能连携解锁状态（C→F，职业路径预览中显示相关连携）
  // 修复: 原 checkJobCareerPath/checkSynergyUnlocked 未定义→预览UI永远显示错误状态
  // [全系统自洽修复] 域C A类: _jobDef.path 在 STREET_JOBS 上不存在(无path字段)→条件恒假→连携区块永不显示
  // 改用 _jobToCareerPathMap 正向映射(工作ID→职业路径ID)
  var _jobToCareerPathMap = {
    food_truck_owner: 'catering',
    remote_dev: 'tech',
    master_repairman: 'operations',
    sales_team_lead: 'sales',
    long_haul_driver: 'logistics',
    foreign_company_staff: 'tech',
    finance_analyst: 'finance',
    smart_home_tech: 'tech',
  };
  if (typeof SKILL_SYNERGY_DUAL !== "undefined") {
    var _pathSynergies = [];
    for (var _sid in SKILL_SYNERGY_DUAL) {
      if (!Object.prototype.hasOwnProperty.call(SKILL_SYNERGY_DUAL, _sid)) continue;
      var _syn = SKILL_SYNERGY_DUAL[_sid];
      if (_syn.effects && _syn.effects.unlockJobs) {
        for (var _uj = 0; _uj < _syn.effects.unlockJobs.length; _uj++) {
          var _jobId = _syn.effects.unlockJobs[_uj];
          if (_jobToCareerPathMap[_jobId] === pathKey) {
            _pathSynergies.push(_syn);
            break;
          }
        }
      }
    }
    if (_pathSynergies.length > 0) {
      body += '<div style="font-size:10px;padding:6px 8px;margin-bottom:8px;background:rgba(74,158,92,0.06);border-radius:6px;">';
      body += "🔗 相关技能连携：";
      for (var _psi = 0; _psi < _pathSynergies.length; _psi++) {
        var _ps = _pathSynergies[_psi];
        // 检查连携是否已解锁(双技能均达到门槛)
        var _unlocked = true;
        if (_ps.skills && st.skills) {
          for (var _si = 0; _si < _ps.skills.length; _si++) {
            var _req = _ps.skills[_si];
            var _actual = (st.skills[_req.id] && st.skills[_req.id].level) || 0;
            if (_actual < _req.minLevel) { _unlocked = false; break; }
          }
        }
        body += '<span style="margin:0 3px;">' + (_unlocked ? "✅" : "🔒") + " " + _ps.name + "</span>";
      }
      body += "</div>";
    }
  }
  // 晋升阶梯图
  body +=
    '<div style="font-size:12px;font-weight:bold;margin-bottom:8px;">📈 晋升路线</div>';
  body += '<div style="display:flex;flex-direction:column;gap:0;">';

  var skillLabels2 = {
    coding: "编程",
    english: "英语",
    accounting: "财务",
    management: "管理",
    sales: "销售",
    cooking: "厨艺",
    medicine: "医学",
    driving: "驾驶",
    repair: "维修",
    electrician: "电工",
    welding: "焊工",
    caregiving: "护理",
  };
  var attrLabels2 = {
    physique: "体质",
    intelligence: "智力",
    agility: "敏捷",
    mental: "能力",
    charm: "颜值",
    fame: "名气",
  };

  for (var i = 0; i < path.levels.length; i++) {
    var lv = path.levels[i];
    var canReach = checkCareerPromotion(st, pathKey, lv);
    var isLast = i === path.levels.length - 1;
    var color = canReach ? "rgba(74,158,92,0.1)" : "rgba(255,255,255,0.03)";
    var border = canReach ? "rgba(74,158,92,0.35)" : "var(--border)";
    var icon = canReach ? "✅" : "🔒";

    body +=
      '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:' +
      color +
      ";border:1px solid " +
      border +
      ";border-radius:6px;margin-bottom:" +
      (isLast ? "0" : "4px") +
      ';">';
    body +=
      '<div style="width:28px;height:28px;border-radius:50%;background:' +
      (canReach ? "var(--accent)" : "rgba(255,255,255,0.1)") +
      ";color:" +
      (canReach ? "#fff" : "var(--text-muted)") +
      ';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;flex-shrink:0;">' +
      (i + 1) +
      "</div>";
    body += '<div style="flex:1;min-width:0;">';
    body +=
      '<div style="font-size:12px;font-weight:bold;">' +
      icon +
      " " +
      lv.name +
      "</div>";
    body +=
      '<div style="font-size:10px;color:var(--text-muted);margin-top:1px;">' +
      lv.desc +
      "</div>";
    var reqParts = [];
    if (lv.reqSkills) {
      for (var s in lv.reqSkills) {
        var actual = skills[s] ? skills[s].level || 0 : 0;
        var met = actual >= lv.reqSkills[s];
        reqParts.push(
          (met ? "✅" : "❌") + (skillLabels2[s] || s) + lv.reqSkills[s],
        );
      }
    }
    if (lv.reqAttrs) {
      for (var a in lv.reqAttrs) {
        var av = p[a] || 0;
        var am = av >= lv.reqAttrs[a];
        reqParts.push(
          (am ? "✅" : "❌") + (attrLabels2[a] || a) + lv.reqAttrs[a],
        );
      }
    }
    if (lv.reqWorkDays)
      reqParts.push("≥" + Math.floor(lv.reqWorkDays / 365) + "年");
    if (lv.reqEducation) reqParts.push("大专+");
    if (lv.reqSocial) reqParts.push("人脉≥" + Math.floor(lv.reqSocial / 20));
    if (reqParts.length > 0) {
      body +=
        '<div style="font-size:9px;color:var(--text-muted);margin-top:2px;">' +
        reqParts.join(" · ") +
        "</div>";
    }
    body += "</div>";
    body +=
      '<div style="text-align:right;flex-shrink:0;font-size:11px;color:var(--accent);font-weight:bold;">¥' +
      lv.salary.toLocaleString() +
      '<span style="font-size:9px;color:var(--text-muted);font-weight:normal;">/月</span></div>';
    body += "</div>";
    if (!isLast) {
      body +=
        '<div style="width:2px;height:6px;background:var(--border);margin:0 0 0 20px;"></div>';
    }
  }
  body += "</div>";

  body += "</div>";

  // 底部按钮通过 showModal 的 buttons 参数传入（body 里不写 inline 按钮）
  var entryLevel = path.levels[0];
  var canApply = checkCareerPromotion(st, pathKey, entryLevel);
  var modalButtons = [];
  if (canApply) {
    modalButtons.push({
      text: "📄 投递简历",
      cls: "btn-primary",
      callback: function () {
        // 用 setTimeout 让当前弹窗先关闭，避免新弹窗被 blocked
        setTimeout(function () {
          if (typeof enhancedApplyCareerJob === "function") {
            enhancedApplyCareerJob(pathKey, entryLevel.id);
          }
        }, 100);
      },
    });
  } else {
    modalButtons.push({
      text: "🔒 条件不足",
      cls: "",
      _disabled: true,
      disabledReason: "不满足入职条件，查看上方需求",
    });
  }
  modalButtons.push({ text: "关闭", cls: "", callback: function () {} });

  showModal({
    title: path.icon + " " + path.name + " — 职业路线预览",
    body: "<div>" + body + "</div>",
    buttons: modalButtons,
  });
}

// ====== 百科注册 ======
if (typeof window !== "undefined") {
  window.ensureCareerCapital = ensureCareerCapital;
  window.getCareerCapitalStartupDiscount = getCareerCapitalStartupDiscount;
  window.getStartupReadinessNote = getStartupReadinessNote;
  // v3.47 分类与推荐系统
  window.getRecommendedCareerPaths = getRecommendedCareerPaths;
  window.getCategoryLabel = getCategoryLabel;
  window.CAREER_CATEGORIES = CAREER_CATEGORIES;
  // v3.48 路线预览
  window.showCareerPathPreviewModal = showCareerPathPreviewModal;
  // v3.11 跨系统联动暴露
  window.getCareerMedicalDiscount = getCareerMedicalDiscount;
  window.getCareerLegalDiscount = getCareerLegalDiscount;
  window.enhancedApplyCareerJob = enhancedApplyCareerJob;
  window.clampCareerCapital = clampCareerCapital;
  window.showCareerNavModal = showCareerNavModal;
  window.showLocationNavModal = showLocationNavModal;
  /** 子Tab快速切换（供inline onclick使用） */
  window.switchCareerSubTab = function (subTab) {
    try {
      var st =
        typeof StateManager !== "undefined" &&
        typeof StateManager.getState === "function"
          ? StateManager.getState()
          : null;
      if (st) {
        st._careerSubTab = subTab;
        if (typeof renderAll === "function") renderAll();
      }
    } catch (e) {
      console.warn("[career_dev] switchCareerSubTab error:", e);
    }
  };
  /** 全局条件不足弹窗（供 inline onclick 调用） */
  window.showCareerRequirementsModal_Global = function (pathKey, levelId) {
    try {
      var st =
        typeof StateManager !== "undefined" &&
        typeof StateManager.getState === "function"
          ? StateManager.getState()
          : null;
      if (!st) return;
      var path = CAREER_PATHS[pathKey];
      if (!path) return;
      var level = path.levels.find(function (l) {
        return l.id === levelId;
      });
      if (!level) return;
      showCareerRequirementsModal(st, pathKey, level);
    } catch (e) {
      console.error(
        "[career_dev] showCareerRequirementsModal_Global error:",
        e,
      );
      StateManager.addMessage("⚠️ 查看条件时出现异常", "warning");
    }
  };

  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.career_dev = {
    id: "career_dev",
    name: "事业发展",
    icon: "🚀",
    brief:
      "创业系统 + 上班族职业路径（10路径×42职位），从基层到高管的完整职业生涯",
    version: "3.11.0",
    related: [
      "mechanics:startup_system",
      "mechanics:workplace_social",
      "mechanics:medical",
      "mechanics:legal",
    ],
    sections: [
      {
        kind: "desc",
        text: "事业是人生的支柱。从街头打零工到成为上市公司CEO，事业系统让你体验不同职业路径的酸甜苦辣。",
      },
      {
        kind: "subhead",
        text: "💼 职业路径",
      },
      {
        kind: "list",
        items: [
          "💻 IT技术：初级程序员→中级开发→高级开发→技术Leader",
          "📊 金融财务：财务助理→会计/分析师→高级分析师→财务经理",
          "💼 销售市场：销售助理→销售代表→高级销售→销售经理",
          "⚙️ 运营管理：运营助理→运营专员→运营主管→运营经理",
          "🎨 设计创意：初级设计师→资深设计师→设计主管→创意总监",
          "⚖️ 法律服务：法务助理→法务专员→高级法务→法务总监",
          "🏫 教育培训：教学助理→教师→骨干教师→副校长/校长",
          "🚚 物流快递：仓储分拣→快递员→站点主管→区域运营经理",
          "🍜 餐饮服务：服务员→厨师→厨师长→餐厅店长",
          "🏥 医疗护理：护理员→注册护士→主管护师→护士长",
          "👨‍⚕️ 医师：实习医生→住院医师→主治医师→副主任医师→主任医师",
          "🏢 事业单位：办事员→科员→副科长级→科长级→副处长级",
          "🏛️ 公务员：基层公务员→科员→副科长→科长",
        ],
      },
      {
        kind: "subhead",
        text: "🚀 创业路径",
      },
      {
        kind: "list",
        items: [
          "种子轮：验证想法，组建核心团队",
          "A轮：产品验证后规模化扩张",
          "B轮：市场扩张，建立壁垒",
          "C轮：准备IPO前的最后一轮",
        ],
      },
      {
        kind: "tip",
        text: "💡 提示：创业启动资金按剧本+职业资本动态计算（职业资本越高减免越多，最低¥2万，最高减免15%）；固定工作提供稳定收入但晋升需要技能+人脉；高级职位需维护好同事关系才能顺利晋升；倦怠过高会过劳病假，记得调休。",
      },
    ],
  };
  if (typeof window !== "undefined") {
    window.careerSocialAction = careerSocialAction;
  }
}

// v3.46: 路径推荐标签（rec-path-tag）点击处理 — 事件委托
if (typeof document !== "undefined") {
  document.addEventListener("click", function (e) {
    var el = e.target;
    while (el && !el.classList) el = el.parentNode;
    if (!el || !el.classList || !el.classList.contains("rec-path-tag")) return;
    var path = el.getAttribute("data-path");
    var level = el.getAttribute("data-level");
    if (path && level && typeof enhancedApplyCareerJob === "function") {
      enhancedApplyCareerJob(path, level);
    }
  });
}

// ====== 联动增强：职业满级里程碑事件（3个新增） ======
// 填补"满级无叙事回报"空白——玩家达到职业路径最高级后触发专属事件
// 设计心理学：峰终定律（满级成为记忆锚点）/ 禀赋效应（珍惜职业成就）
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._careerMaxLevelLoaded) return;
  RANDOM_EVENTS._careerMaxLevelLoaded = true;

  var MAX_LEVEL_EVENTS = [
    {
      id: "career_max_level_celebration",
      phase: "street",
      icon: "🏆",
      title: "你做到了！",
      story:
        "你在 '{pathName}' 路径已经达到了最高职级 '{levelName}'。回头看这一路，从最初的不适应到现在的游刃有余，你已经走了很远。",
      triggers: { minDay: 180 },
      conditions: function (st) {
        var career = st.career || {};
        var currentJob = career.currentJob;
        if (!currentJob || !currentJob.path || !currentJob.levelId)
          return false;
        var pathId = currentJob.path;
        var levelId = currentJob.levelId;
        var pData = CAREER_PATHS && CAREER_PATHS[pathId];
        if (!pData || !pData.levels) return false;
        var maxLevelId = pData.levels[pData.levels.length - 1].id;
        if (levelId !== maxLevelId) return false;
        if (st.flags._careerMaxLevelCelebrated) return false;
        return true;
      },
      choices: [
        {
          text: "🎉 为自己骄傲，出去吃顿好的",
          hint: "庆祝成就，花¥500",
          cost: 500,
          apply: function (st) {
            var job = (st.career && st.career.currentJob) || {};
            var pathName = job.pathName || "职业";
            if ((st.resources && (st.resources.cash || 0)) < 500) {
              StateManager.addMessage(
                "🏆 你已经达到了「" +
                  pathName +
                  "」的最高职级！但¥500庆祝费用你暂时拿不出来，先在心里为自己鼓掌吧。",
                "warning",
              );
              st.flags._careerMaxLevelCelebrated = true;
              return;
            }
            st.flags._careerMaxLevelCelebrated = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
            if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            StateManager.addMessage(
              "🏆 你达到了「" +
                pathName +
                "」的最高职级！花¥500庆祝一下，你值得。心情+20，心智+10。",
              "success",
            );
          },
        },
        {
          text: "📖 写经验分享帖",
          hint: "帮助后来者，名气+10",
          apply: function (st) {
            st.flags._careerMaxLevelCelebrated = true;
            st.player.fame = Math.min(100, (st.player.fame || 50) + 10);
            if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            StateManager.addMessage(
              "🏆 你把经验写成了帖子发在网上，获得了很多点赞。名气+10，心情+8。",
              "success",
            );
          },
        },
        {
          text: "🎯 下一站：创业",
          hint: "职业资本转化为创业优势",
          apply: function (st) {
            st.flags._careerMaxLevelCelebrated = true;
            st.flags._startupFromMaxLevel = true;
            st.player.corporate = st.player.corporate || {};
            st.player.corporate.kpi = Math.min(
              150,
              (st.player.corporate.kpi || 0) + 20,
            );
            StateManager.addMessage(
              "🏆 你决定把职业积累的经验带到创业中去。KPI+20，解锁创业资本加成。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "career_mentor_request",
      phase: "street",
      icon: "👨‍🏫",
      title: "有人想拜你为师",
      story:
        "你在 '{pathName}' 达到了最高职级后，开始有人注意到你了。今天一个刚入行的年轻人找到你，说想跟你学习经验。",
      triggers: { minDay: 200 },
      conditions: function (st) {
        var career = st.career || {};
        var currentJob = career.currentJob;
        if (!currentJob || !currentJob.path || !currentJob.levelId)
          return false;
        var pathId = currentJob.path;
        var levelId = currentJob.levelId;
        var pData = CAREER_PATHS && CAREER_PATHS[pathId];
        if (!pData || !pData.levels) return false;
        var maxLevelId = pData.levels[pData.levels.length - 1].id;
        return levelId === maxLevelId && !st.flags._careerMentorSeen;
      },
      choices: [
        {
          text: "🤝 收下这个徒弟",
          hint: "花时间教导，获得忠诚助手",
          apply: function (st) {
            st.flags._careerMentorSeen = true;
            st.flags._hasApprentice = true;
            if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            st.player.charm = Math.min(100, (st.player.charm || 50) + 3);
            StateManager.addMessage(
              "👨‍🏫 你收下了徒弟。看着他认真记笔记的样子，你想起了当初的自己。心情+10，心智+5，魅力+3。",
              "success",
            );
          },
        },
        {
          text: "📝 给他一份学习清单",
          hint: "低成本帮助，获得尊重",
          apply: function (st) {
            st.flags._careerMentorSeen = true;
            st.flags._apprenticeList = true;
            st.player.fame = Math.min(100, (st.player.fame || 50) + 5);
            StateManager.addMessage(
              "👨‍🏫 你整理了一份学习清单给他。虽然没有直接教导，但他还是很感激。名气+5。",
              "info",
            );
          },
        },
        {
          text: "🙅 没时间教人",
          hint: "专注自己",
          apply: function (st) {
            st.flags._careerMentorSeen = true;
            st.player.mental = Math.max(0, (st.player.mental || 50) - 3);
            StateManager.addMessage(
              "👨‍🏫 你婉拒了。每个人都有各自的路要走。但心里有一点愧疚。心智-3。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "career_legacy_project",
      phase: "street",
      icon: "🏗️",
      title: "一个改变行业的项目",
      story:
        "你在 '{pathName}' 达到了最高职级后，行业内出现了一个重大机会——一个需要你这种资深人士才能主导的项目。但它有风险：要么大获成功，要么一败涂地。",
      triggers: { minDay: 300 },
      conditions: function (st) {
        var career = st.career || {};
        var currentJob = career.currentJob;
        if (!currentJob || !currentJob.path || !currentJob.levelId)
          return false;
        var pathId = currentJob.path;
        var levelId = currentJob.levelId;
        var pData = CAREER_PATHS && CAREER_PATHS[pathId];
        if (!pData || !pData.levels) return false;
        var maxLevelId = pData.levels[pData.levels.length - 1].id;
        return (
          levelId === maxLevelId &&
          !st.flags._careerLegacySeen &&
          st.player.day >= 300
        );
      },
      choices: [
        {
          text: "🚀 全力投入！",
          hint: "高风险高回报，可能获得行业声誉",
          apply: function (st) {
            st.flags._careerLegacySeen = true;
            st.flags._legacyProjectStarted = true;
            st.flags._legacyProjectDay = st.player.day;
            if(st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 50) + 20);
            st.player.corporate = st.player.corporate || {};
            st.player.corporate.risk = Math.min(
              100,
              (st.player.corporate.risk || 0) + 15,
            );
            StateManager.addMessage(
              "🏗️ 你接下了这个项目。虽然风险很大，但这是你职业生涯最重要的挑战。疲劳+20，风险+15。",
              "event",
            );
            // [全系统自洽修复] 域C 修复:scheduled chain event→改用daily check flag
            st.flags._careerLegacyDueDay = st.player.day + 90;
          },
        },
        {
          text: "🤔 先观望一段时间",
          hint: "保守选择，不冒险",
          apply: function (st) {
            st.flags._careerLegacySeen = true;
            st.flags._legacyWatched = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 50) + 2,
            );
            StateManager.addMessage(
              "🏗️ 你决定先观望。有时候耐心比勇气更重要。智力+2。",
              "info",
            );
          },
        },
      ],
    },
  ];

  for (var mle = 0; mle < MAX_LEVEL_EVENTS.length; mle++) {
    RANDOM_EVENTS.push(MAX_LEVEL_EVENTS[mle]);
  }
})();

// ====== 联动增强：技能Lv.100满级叙事事件（C→B） ======
// 填补"技能满级无叙事回报"空白——任何技能达到Lv.100触发专属成就事件
// 设计心理学：峰终定律（满级锚点）/ 禀赋效应（珍惜技能成就）
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._skillMaxLevelLoaded) return;
  RANDOM_EVENTS._skillMaxLevelLoaded = true;

  var SKILL_MAX_EVENTS = [
    {
      id: "skill_max_level_mastery",
      phase: "street",
      icon: "👑",
      title: "登峰造极！",
      story: "经过日复一日的练习和实战，你的'{skillName}'技能终于达到了Lv.100——人类所能达到的极限！\n\n你在这个领域已经是大师级别的人物了。消息传开后，有人慕名而来想请你指点，也有人想挖你去他们公司。",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (st.flags && st.flags._skillMaxLevelTriggered) return false;
        if (!st.skills) return false;
        for (var k in st.skills) {
          if (st.skills[k] && st.skills[k].level >= 100) return true;
        }
        return false;
      },
      choices: [
        {
          text: "🏆 接受采访，分享经验",
          hint: "名气+15，魅力+5",
          apply: function (st) {
            st.flags._skillMaxLevelTriggered = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 15);
            st.player.charm = Math.min(100, (st.player.charm || 0) + 5);
            StateManager.addMessage(
              "👑 你的故事被媒体报道，一夜之间成了业内知名人物！名气+15，魅力+5。",
              "success",
            );
          },
        },
        {
          text: "🤫 低调，继续精进",
          hint: "智力+8，心智+5",
          apply: function (st) {
            st.flags._skillMaxLevelTriggered = true;
            st.player.intelligence = Math.min(100, (st.player.intelligence || 0) + 8);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            StateManager.addMessage(
              "👑 你选择保持低调。真正的强者从不炫耀，但求内心充实。智力+8，心智+5。",
              "success",
            );
          },
        },
        {
          text: "💼 考虑开培训班",
          hint: "解锁被动收入+¥150/天",
          apply: function (st) {
            st.flags._skillMaxLevelTriggered = true;
            st.flags._skillMasterTrainer = true;
            StateManager.addMessage(
              "👑 你决定用你的技能开办培训班。虽然前期投入大，但这是一条可持续的被动收入来源。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "skill_master_student",
      phase: "street",
      icon: "🎓",
      title: "慕名而来的学徒",
      story: "你在'{skillName}'上的造诣已经传遍了大街小巷。今天一个年轻人找到你，说想拜你为师，愿意免费给你打下手，只求学到真本事。",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (st.flags && st.flags._skillMasterStudentSeen) return false;
        if (!st.skills) return false;
        for (var k in st.skills) {
          if (st.skills[k] && st.skills[k].level >= 100) return true;
        }
        return false;
      },
      choices: [
        {
          text: "👨‍🏫 收下，倾囊相授",
          hint: "心智+10，名气+5，获得助手",
          apply: function (st) {
            st.flags._skillMasterStudentSeen = true;
            st.flags._hasSkillApprentice = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 10);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            StateManager.addMessage(
              "🎓 你收下了这个学徒。看着他认真记笔记的样子，你想起了当初的自己。心智+10，名气+5。",
              "success",
            );
          },
        },
        {
          text: "📝 推荐他去培训机构",
          hint: "心智+3，不增加负担",
          apply: function (st) {
            st.flags._skillMasterStudentSeen = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            StateManager.addMessage(
              "🎓 你推荐了几家靠谱的培训机构。虽然没收徒，但他还是很感激你的指点。心智+3。",
              "info",
            );
          },
        },
      ],
    },
  ];

  // ===== 联动增强1：技能满级→NPC慕名而来求教（C→D 职业成长→NPC社交） =====
  // 设计意图：技能满级不应只有数值成就感，还应有叙事层面的社交回报
  // 参考：《大多数》老手带新手的传承感 / Stardew Valley 村民来访
  var SKILL_MASTER_VISITOR = {
    id: "skill_master_visitor",
    phase: "street",
    icon: "🙏",
    title: "慕名而来的求教者",
    story:
      "你在街上走着，一个年轻人快步追上来：「请问您是{skillName}的{masterName}吗？我听说您在这方面已经达到顶尖水平了，能不能指点我两句？」\n\n你愣了一下，没想到自己的名声已经传出去了。",
    triggers: { minDay: 365 },
    conditions: function (st) {
      if (!st.skills) return false;
      var hasMaster = false;
      var masterSkill = null;
      var masterName = "";
      for (var sk in st.skills) {
        var lv = (st.skills[sk] && st.skills[sk].level) || 0;
        if (lv >= 80) {
          hasMaster = true;
          masterSkill = sk;
          masterName = sk;
          break;
        }
      }
      st._skillMasterVisitorSkill = masterSkill;
      return hasMaster;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "📚 耐心指点，传授经验",
        hint: "心智+8，名气+5，解锁长期徒弟关系",
        apply: function (st) {
          st.flags._skillMasterVisitorDone = true;
          st.flags._hasApprentice = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          // 徒弟偶尔会带来收入
          if (typeof Random !== "undefined" && Random.chance(0.3)) {
            var apprenticeGift = Random.int(100, 500);
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + apprenticeGift;
            StateManager.addMessage(
              "📚 你花了半天时间给他讲解了要点。一周后，他寄来了¥" +
                apprenticeGift +
                "表示感谢。你的技艺改变了另一个人的人生。心智+8，名气+5，心情+5，获得徒弟心意¥" +
                apprenticeGift +
                "。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "📚 你倾囊相授。他感激地说：「我一定会努力的！」看着他的背影，你仿佛看到了当年的自己。心智+8，名气+5，心情+5。",
              "success",
            );
          }
        },
      },
      {
        text: "💼 推荐他去正规培训",
        hint: "心智+3，不增加负担",
        apply: function (st) {
          st.flags._skillMasterVisitorDone = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "🎓 你推荐了几家靠谱的培训机构。虽然没收徒，但他还是很感激你的指点。心智+3。",
            "info",
          );
        },
      },
      {
        text: "🤷 抱歉，我很忙",
        hint: "无影响，但错失一次传承机会",
        apply: function (st) {
          st.flags._skillMasterVisitorDone = true;
          st.player.morality = Math.max(
            0,
            (st.player.morality || 50) - 2,
          );
          StateManager.addMessage(
            "🤷 你摆摆手说自己在忙。年轻人眼里闪过一丝失望，默默离开了。道德-2。",
            "warning",
          );
        },
      },
    ],
  };

  // ===== 联动增强2：职业履历→简历故事（C→G 职业成长→生命周期叙事） =====
  // 设计意图：让玩家感受到职业选择的重量——每一次跳槽/坚持都有叙事回响
  var CAREER_LEGACY_REFLECTION = {
    id: "career_legacy_reflection",
    phase: "street",
    icon: "📋",
    title: "职业履历的厚度",
    story:
      "你翻出抽屉里那本旧笔记本，里面记着你这些年换过的每一份工作。从最初的{firstJob}到现在现在的{currentJob}，这条路你走了{workYears}年。\n\n每一份工作都留下了印记——有些是伤疤，有些是勋章。",
    triggers: { minDay: 365 },
    conditions: function (st) {
      if (!st.career || !st.career.history) return false;
      var historyLen = st.career.history.length;
      if (historyLen < 2) return false;
      if (st.flags._careerLegacyReflectionSeen) return false;
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "📖 把经历写成博客",
        hint: "名气+8，心智+5，帮助他人",
        apply: function (st) {
          st.flags._careerLegacyReflectionSeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "📖 你把职业经历写成了系列博客。没想到阅读量破万，很多人留言说受到了启发。名气+8，心智+5，心情+3。",
            "success",
          );
        },
      },
      {
        text: "🤔 默默合上笔记本",
        hint: "心智+2，继续前行",
        apply: function (st) {
          st.flags._careerLegacyReflectionSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          StateManager.addMessage(
            "🤔 你合上笔记本，深吸一口气。过去的就让它过去，未来还在前方等着。心智+2。",
            "info",
          );
        },
      },
    ],
  };

  RANDOM_EVENTS.push(SKILL_MASTER_VISITOR);
  RANDOM_EVENTS.push(CAREER_LEGACY_REFLECTION);

  for (var sme = 0; sme < SKILL_MAX_EVENTS.length; sme++) {
    RANDOM_EVENTS.push(SKILL_MAX_EVENTS[sme]);
  }
})();

// [全系统自洽修复] 域C R389 联动增强(C→F): 职业路径进度数据—UI展示各路径晋升条件
function getCareerPathProgress(state) {
  if (!state) return [];
  var result = [];
  for (var pathId in CAREER_PATHS) {
    var path = CAREER_PATHS[pathId];
    var levels = path.levels || [];
    var currentLevel = -1;
    if (state.career && state.career.currentJob && state.career.currentJob.path === pathId) {
      currentLevel = levels.findIndex(function(l) { return l.id === state.career.currentJob.levelId; });
    }
    var nextLevel = currentLevel + 1 < levels.length ? levels[currentLevel + 1] : null;
    var canPromote = nextLevel ? checkCareerPromotion(state, pathId, nextLevel) : false;
    result.push({
      pathId: pathId,
      pathName: path.name,
      icon: path.icon,
      currentLevel: currentLevel,
      totalLevels: levels.length,
      nextLevelName: nextLevel ? nextLevel.name : null,
      canPromote: canPromote,
      salary: state.career && state.career.currentJob && state.career.currentJob.path === pathId ? state.career.currentJob.salary : 0,
    });
  }
  return result;
}

// [全系统自洽修复] 域C R389 联动增强(C→G): 职业健康影响—高压工作对健康产生长期影响
function applyCareerHealthEffect(state) {
  if (!state || !state.career || !state.career.currentJob) return;
  if (!state.status) return;
  var job = state.career.currentJob;
  var salary = job.salary || 0;
  // 高薪高压工作: 月薪≥30000→每日健康微量损耗(熬夜/压力)
  if (salary >= 30000 && state.player && state.player.day % 3 === 0) {
    state.status.health = Math.max(0, (state.status.health || 80) - 1);
    if (state.flags && !state.flags._highSalaryHealthWarn && state.status.health < 50) {
      state.flags._highSalaryHealthWarn = true;
      StateManager.addMessage("⚠️ 高薪工作的压力正在侵蚀你的健康。注意劳逸结合，定期体检。", "warning");
    }
  }
  // 长期工作压力累积: 工作满1年且健康持续下降
  if (job.workDays >= 365 && state.status.health < 40 && state.needs) {
    state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 1);
  }
}
// [R131] 域C 联动增强
// [R179] 域C 联动增强
// [R219] 域C 联动增强
