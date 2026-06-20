/**
 * 玩家创业系统 — 从0到1再到退出的完整创业模拟
 *
 * Phase 2 核心：玩家注册公司→招聘→做项目→融资→IPO/被收购/破产
 *
 * 三阶段模型：
 *   种子期：产品开发、找联合创始人、申请创业基金
 *   成长期：招聘、A/B轮融资、市场扩张
 *   退出期：IPO上市 / 被收购 / 破产清算
 */

// ====== 工具函数 ======

/** 转义 HTML 特殊字符 */
function _esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ====== 行业定义 ======
const STARTUP_INDUSTRIES = {
  tech: {
    name: "科技",
    icon: "💻",
    baseValuation: 2000000,
    avgBurnRate: 80000,
    keySkills: ["coding", "english"],
    desc: "互联网/软件/AI，高增长高波动",
  },
  consumer: {
    name: "消费",
    icon: "🛍️",
    baseValuation: 1000000,
    avgBurnRate: 50000,
    keySkills: ["sales", "cooking"],
    desc: "零售/餐饮/品牌，稳定但增长慢",
  },
  finance: {
    name: "金融科技",
    icon: "💳",
    baseValuation: 3000000,
    avgBurnRate: 100000,
    keySkills: ["accounting", "management"],
    desc: "支付/理财/保险科技，政策敏感",
  },
  healthcare: {
    name: "医疗健康",
    icon: "🏥",
    baseValuation: 2500000,
    avgBurnRate: 90000,
    keySkills: ["management"],
    desc: "医疗/医药/健康服务，监管严格",
  },
  education: {
    name: "教育",
    icon: "📚",
    baseValuation: 800000,
    avgBurnRate: 40000,
    keySkills: ["english", "management"],
    desc: "培训/在线教育/内容，受政策影响大",
  },
  manufacturing: {
    name: "制造",
    icon: "🏭",
    baseValuation: 1500000,
    avgBurnRate: 70000,
    keySkills: ["repair", "electrician"],
    desc: "硬件/智能设备/新材料，重资产",
  },
};

// ====== 员工角色定义 ======
const EMPLOYEE_ROLES = {
  engineer: {
    name: "工程师",
    icon: "🔧",
    baseSalary: 15000,
    baseProductivity: 1.0,
    skillFocus: "coding",
    desc: "产品开发核心",
  },
  designer: {
    name: "设计师",
    icon: "🎨",
    baseSalary: 12000,
    baseProductivity: 0.8,
    skillFocus: "design",
    desc: "产品体验优化",
  },
  sales: {
    name: "销售",
    icon: "💼",
    baseSalary: 10000,
    baseProductivity: 1.2,
    skillFocus: "sales",
    desc: "市场拓展",
  },
  marketing: {
    name: "市场",
    icon: "📢",
    baseSalary: 12000,
    baseProductivity: 0.9,
    skillFocus: "marketing",
    desc: "品牌推广",
  },
  ops: {
    name: "运营",
    icon: "⚙️",
    baseSalary: 8000,
    baseProductivity: 0.7,
    skillFocus: "management",
    desc: "日常运营维护",
  },
  finance: {
    name: "财务",
    icon: "📊",
    baseSalary: 10000,
    baseProductivity: 0.6,
    skillFocus: "accounting",
    desc: "财务合规管理",
  },
};

// ====== 融资轮次定义 ======
const FUNDING_ROUNDS = {
  seed: {
    name: "种子轮",
    icon: "🌱",
    minValuation: 500000,
    minRevenue: 0,
    minEmployees: 1,
    maxRaise: 500000,
    equityDilution: [0.1, 0.2], // 出让10-20%
    investorTypes: ["angel", "family_office"],
    desc: "验证想法，组建核心团队",
  },
  A: {
    name: "A轮",
    icon: "📈",
    minValuation: 3000000,
    minRevenue: 100000,
    minEmployees: 5,
    maxRaise: 3000000,
    equityDilution: [0.15, 0.25],
    investorTypes: ["vc", "cvc"],
    desc: "产品验证后规模化扩张",
  },
  B: {
    name: "B轮",
    icon: "🚀",
    minValuation: 15000000,
    minRevenue: 500000,
    minEmployees: 15,
    maxRaise: 10000000,
    equityDilution: [0.1, 0.2],
    investorTypes: ["vc", "pe", "cvc"],
    desc: "市场扩张，建立壁垒",
  },
  C: {
    name: "C轮",
    icon: "🌍",
    minValuation: 50000000,
    minRevenue: 2000000,
    minEmployees: 50,
    maxRaise: 30000000,
    equityDilution: [0.05, 0.15],
    investorTypes: ["pe", "soe", "strategic"],
    desc: "准备IPO前的最后一轮",
  },
};

// ====== 投资人类型定义 ======
const INVESTOR_TYPES = {
  angel: {
    name: "天使投资人",
    icon: "👼",
    avgCheck: 250000,
    equityReq: [0.05, 0.15],
    terms: "宽松，重人轻数据",
    risk: "低",
  },
  family_office: {
    name: "家族办公室",
    icon: "🏛️",
    avgCheck: 500000,
    equityReq: [0.08, 0.18],
    terms: "稳健，偏好成熟项目",
    risk: "低",
  },
  vc: {
    name: "风险投资",
    icon: "💰",
    avgCheck: 2000000,
    equityReq: [0.15, 0.3],
    terms: "激进，追求高回报",
    risk: "中",
  },
  cvc: {
    name: "企业风投",
    icon: "🏢",
    avgCheck: 3000000,
    equityReq: [0.1, 0.2],
    terms: "战略协同优先",
    risk: "中",
  },
  pe: {
    name: "私募股权",
    icon: "🦈",
    avgCheck: 10000000,
    equityReq: [0.1, 0.25],
    terms: "要求对赌和回购条款",
    risk: "高",
  },
  soe: {
    name: "国资基金",
    icon: "🇨🇳",
    avgCheck: 15000000,
    equityReq: [0.05, 0.15],
    terms: "政策导向，审批慢",
    risk: "低",
  },
  strategic: {
    name: "战略投资人",
    icon: "🤝",
    avgCheck: 20000000,
    equityReq: [0.1, 0.3],
    terms: "可能涉及业务整合",
    risk: "高",
  },
};

// ====== 产品类别（15+类别，每类有独特机制）======
const PRODUCT_CATEGORIES = {
  // === 基础6类（原有）===
  app: {
    name: "移动应用",
    icon: "📱",
    baseDevTime: 60,
    baseCost: 50000,
    revenueModel: "订阅/广告/内购",
    features: ["用户系统", "推送通知", "应用内购买", "社交分享"],
    growthFactor: 1.0,
    churnRate: 0.05,
    description: "iOS/Android应用，用户基数大但竞争激烈",
  },
  saas: {
    name: "SaaS平台",
    icon: "☁️",
    baseDevTime: 90,
    baseCost: 100000,
    revenueModel: "订阅制",
    features: ["多租户", "API接口", "数据看板", "权限管理"],
    growthFactor: 1.2,
    churnRate: 0.03,
    description: "企业级软件服务，高留存高LTV",
  },
  hardware: {
    name: "智能硬件",
    icon: "🔌",
    baseDevTime: 120,
    baseCost: 200000,
    revenueModel: "销售",
    features: ["供应链管理", "质量控制", "售后服务", "渠道分销"],
    growthFactor: 0.8,
    churnRate: 0.02,
    description: "IoT设备/智能产品，重资产但壁垒高",
  },
  content: {
    name: "内容平台",
    icon: "📖",
    baseDevTime: 45,
    baseCost: 30000,
    revenueModel: "广告/订阅",
    features: ["内容审核", "推荐算法", "创作者激励", "付费墙"],
    growthFactor: 1.5,
    churnRate: 0.08,
    description: "图文/视频内容社区，增长快但变现难",
  },
  marketplace: {
    name: "交易平台",
    icon: "🛒",
    baseDevTime: 80,
    baseCost: 80000,
    revenueModel: "佣金",
    features: ["双边市场", "支付结算", "信用体系", "纠纷处理"],
    growthFactor: 1.3,
    churnRate: 0.04,
    description: "C2C/B2C交易撮合，网络效应强",
  },
  ai_service: {
    name: "AI服务",
    icon: "🧠",
    baseDevTime: 100,
    baseCost: 150000,
    revenueModel: "API调用/订阅",
    features: ["模型训练", "API网关", "数据标注", "算力优化"],
    growthFactor: 1.8,
    churnRate: 0.03,
    description: "AI能力输出，高增长高壁垒",
  },

  // === 新增9类 ===
  social: {
    name: "社交应用",
    icon: "💬",
    baseDevTime: 70,
    baseCost: 60000,
    revenueModel: "广告/虚拟物品/会员",
    features: ["即时通讯", "动态发布", "群组功能", "直播"],
    growthFactor: 2.0,
    churnRate: 0.1,
    description: "社交网络/即时通讯，病毒传播强但留存挑战大",
  },
  game: {
    name: "游戏",
    icon: "🎮",
    baseDevTime: 150,
    baseCost: 120000,
    revenueModel: "内购/广告/订阅",
    features: ["游戏引擎", "匹配系统", "反作弊", "运营活动"],
    growthFactor: 1.6,
    churnRate: 0.12,
    description: "手游/页游，爆款效应明显但失败率高",
  },
  ecommerce: {
    name: "电商",
    icon: "🛍️",
    baseDevTime: 100,
    baseCost: 150000,
    revenueModel: "商品差价/平台佣金",
    features: ["商品管理", "物流系统", "客服系统", "营销活动"],
    growthFactor: 1.1,
    churnRate: 0.03,
    description: "垂直电商/综合电商，供应链是核心壁垒",
  },
  edtech: {
    name: "在线教育",
    icon: "📚",
    baseDevTime: 80,
    baseCost: 70000,
    revenueModel: "课程销售/订阅",
    features: ["直播课堂", "录播系统", "作业批改", "学习数据分析"],
    growthFactor: 1.0,
    churnRate: 0.06,
    description: "K12/职业教育/兴趣教育，政策敏感但需求稳定",
  },
  healthtech: {
    name: "医疗AI/健康科技",
    icon: "🏥",
    baseDevTime: 180,
    baseCost: 200000,
    revenueModel: "服务订阅/按次收费",
    features: ["医疗数据", "合规认证", "远程诊疗", "健康管理"],
    growthFactor: 1.4,
    churnRate: 0.02,
    description: "数字健康/远程医疗，监管严格但壁垒极高",
  },
  autopilot: {
    name: "自动驾驶/智能出行",
    icon: "🚗",
    baseDevTime: 200,
    baseCost: 300000,
    revenueModel: "技术服务费/授权费",
    features: ["传感器融合", "高精地图", "仿真测试", "法规合规"],
    growthFactor: 1.5,
    churnRate: 0.01,
    description: "自动驾驶技术/出行服务，重研发但天花板高",
  },
  blockchain: {
    name: "区块链/Web3",
    icon: "⛓️",
    baseDevTime: 120,
    baseCost: 100000,
    revenueModel: "交易手续费/Token经济",
    features: ["智能合约", "去中心化存储", "跨链", "DAO治理"],
    growthFactor: 2.5,
    churnRate: 0.15,
    description: "DeFi/NFT/元宇宙，波动极大但想象空间大",
  },
  metaverse: {
    name: "元宇宙/VR",
    icon: "🥽",
    baseDevTime: 160,
    baseCost: 180000,
    revenueModel: "虚拟物品/订阅/广告",
    features: ["3D引擎", "VR交互", "虚拟经济", "社交空间"],
    growthFactor: 1.8,
    churnRate: 0.1,
    description: "虚拟世界/沉浸式体验，技术门槛高但前景广阔",
  },
  green_tech: {
    name: "新能源/绿色科技",
    icon: "🌱",
    baseDevTime: 140,
    baseCost: 200000,
    revenueModel: "设备销售/服务费",
    features: ["储能技术", "能源管理", "碳追踪", "政策补贴"],
    growthFactor: 1.3,
    churnRate: 0.02,
    description: "新能源/碳中和相关，政策驱动但市场空间大",
  },
  agritech: {
    name: "农业科技",
    icon: "🌾",
    baseDevTime: 100,
    baseCost: 80000,
    revenueModel: "设备销售/数据服务",
    features: ["精准农业", "无人机", "物联网监测", "供应链溯源"],
    growthFactor: 0.9,
    churnRate: 0.02,
    description: "智慧农业/农产品溯源，市场教育成本高但竞争少",
  },
  logitech: {
    name: "物流科技",
    icon: "📦",
    baseDevTime: 90,
    baseCost: 100000,
    revenueModel: "SaaS订阅/按单收费",
    features: ["路径优化", "仓储管理", "运力匹配", "实时追踪"],
    growthFactor: 1.1,
    churnRate: 0.03,
    description: "智慧物流/供应链优化，B端需求稳定",
  },
  creator_tool: {
    name: "内容创作工具",
    icon: "🎨",
    baseDevTime: 60,
    baseCost: 40000,
    revenueModel: "订阅/按量付费",
    features: ["AI生成", "模板库", "协作编辑", "多平台发布"],
    growthFactor: 1.7,
    churnRate: 0.05,
    description: "AI写作/设计/视频工具，创作者经济爆发",
  },
  enterprise: {
    name: "企业服务",
    icon: "🏢",
    baseDevTime: 100,
    baseCost: 120000,
    revenueModel: "SaaS订阅/定制开发",
    features: ["CRM", "ERP", "HR系统", "数据分析"],
    growthFactor: 1.0,
    churnRate: 0.02,
    description: "B端管理软件，销售周期长但客户价值高",
  },
  fintech_pay: {
    name: "支付/金融科技",
    icon: "💳",
    baseDevTime: 120,
    baseCost: 150000,
    revenueModel: "交易手续费",
    features: ["支付网关", "风控系统", "清结算", "合规牌照"],
    growthFactor: 1.2,
    churnRate: 0.02,
    description: "支付/借贷/理财科技，牌照是核心壁垒",
  },
};

// ====== 生成唯一ID ======
function _startupGenerateId() {
  return "sid_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

// ====== 生成公司名 ======
function _startupGenerateCompanyName(industry) {
  const prefixes = {
    tech: ["智", "云", "星", "闪", "极", "元", "深", "联"],
    consumer: ["优", "美", "鲜", "乐", "惠", "好", "精", "趣"],
    finance: ["安", "信", "富", "盈", "通", "稳", "金", "融"],
    healthcare: ["康", "健", "仁", "寿", "安", "和", "泰", "宁"],
    education: ["启", "智", "博", "雅", "明", "慧", "学", "思"],
    manufacturing: ["工", "创", "精", "智", "新", "科", "力", "恒"],
  };
  const suffixes = [
    "科技",
    "智能",
    "创新",
    "数字",
    "云图",
    "智联",
    "未来",
    "先锋",
    "卓越",
    "天成",
  ];
  const industryPrefixes = prefixes[industry] || prefixes.tech;
  const prefix =
    industryPrefixes[Math.floor(Math.random() * industryPrefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return prefix + suffix;
}

// ====== 生成联合创始人 ======
function _startupGenerateCoFounder(index) {
  const names = [
    "老陈",
    "阿杰",
    "小美",
    "老张",
    "阿强",
    "小林",
    "小芳",
    "老李",
  ];
  const skills = [
    "coding",
    "sales",
    "management",
    "design",
    "marketing",
    "accounting",
  ];
  const personalities = [
    { id: "visionary", name: "愿景驱动", desc: "长期主义，能说服投资人" },
    { id: "executor", name: "执行狂人", desc: "落地能力强，但缺乏耐心" },
    { id: "tech_paranoic", name: "技术偏执", desc: "产品极致，不懂商业" },
    { id: "sales_shark", name: "销售鲨鱼", desc: "搞定客户，但技术理解浅" },
    { id: "balanced", name: "均衡型", desc: "各方面都不差，也不突出" },
  ];

  const name = names[index % names.length];
  const skill = skills[Math.floor(Math.random() * skills.length)];
  const personality =
    personalities[Math.floor(Math.random() * personalities.length)];
  const equityReq = 5 + Math.floor(Math.random() * 15);

  return {
    id: "cofounder_" + index,
    name: name,
    skill: skill,
    skillLevel: 50 + Math.floor(Math.random() * 30),
    personality: personality,
    equityRequest: equityReq,
    joinedDay: null,
    loyalty: 70 + Math.floor(Math.random() * 20),
  };
}

/**
 * 获取创业系统触发条件（剧本感知）
 * 去除硬编码 day>200，改为按剧本设置不同的资金/职级门槛
 */
function getStartupTriggerConditions(state) {
  var scenarioId = state.flags && state.flags._scenarioId;
  var phase = state.player && state.player.phase;
  var cash = (state.resources && state.resources.cash) || 0;

  // 各剧本触发条件
  var conditions = {
    classic: {
      street: { cash: 50000, label: "街头发家" },
      corporate: { rank: "P5", cash: 50000, label: "职场攒够启动金" },
    },
    laid_off: {
      street: { cash: 30000, label: "摆摊/零工攒够本钱" },
      corporate: { rank: "P5", cash: 30000, label: "技术岗转创业" },
    },
    small_town_grinder: {
      street: { cash: 50000, label: "白领工作积累" },
      corporate: { rank: "P5", cash: 50000, label: "大厂经验+启动金" },
    },
    foreign_worker: {
      street: { cash: 20000, label: "省吃俭用攒下第一桶金" },
      corporate: { rank: "P5", cash: 20000, label: "技术移民转创业" },
    },
    second_gen: {
      street: { cash: 100000, label: "家里支持启动资金" },
      corporate: { rank: "P5", cash: 100000, label: "家里支持启动资金" },
    },
    midlife_crisis: {
      street: { cash: 80000, label: "补偿金/积蓄转型" },
      corporate: { rank: "P6", cash: 80000, label: "P6+管理经验转型" },
    },
    fresh_grad: {
      street: { cash: 30000, label: "实习+兼职攒钱" },
      corporate: { rank: "P5", cash: 30000, label: "职场新人创业梦" },
    },
  };

  var cond = conditions[scenarioId];
  if (!cond) cond = conditions.classic;
  var pc = cond[phase] || cond.street;
  var rankMet = true;
  if (phase === "corporate" && pc.rank) {
    var rankNames = ["P5", "P6", "P7", "P8", "P9", "P10"];
    var reqIdx = rankNames.indexOf(pc.rank);
    var playerRank = state.corporate && state.corporate.rank;
    var pIdx = rankNames.indexOf(playerRank);
    rankMet = pIdx >= reqIdx;
  }
  return {
    cashRequired: pc.cash || 50000,
    rankRequired: pc.rank || null,
    label: pc.label || "资源积累",
    cashOk: cash >= (pc.cash || 50000),
    rankOk: rankMet,
    canRegister: cash >= 50000, // 注册硬门槛（启动金）
    met: cash >= (pc.cash || 50000) && rankMet,
  };
}

/** 打开注册公司弹窗 */
function showStartupRegisterModal() {
  var state = StateManager.getState();
  var cash = (state.resources && state.resources.cash) || 0;
  if (cash < 50000) {
    StateManager.addMessage("⚠️ 注册公司需要 ¥50,000 启动资金。", "warning");
    return;
  }

  // 构建行业选择 HTML
  var industryHtml = "";
  for (var indKey in STARTUP_INDUSTRIES) {
    if (STARTUP_INDUSTRIES.hasOwnProperty(indKey)) {
      var ind = STARTUP_INDUSTRIES[indKey];
      industryHtml +=
        '<label style="display:block;padding:6px 8px;margin:2px 0;border:1px solid var(--border);border-radius:4px;cursor:pointer;">' +
        '<input type="radio" name="startup-industry" value="' +
        indKey +
        '"> ' +
        ind.icon +
        " <strong>" +
        ind.name +
        "</strong> — " +
        ind.desc +
        "</label>";
    }
  }

  var bodyHtml =
    '<div style="font-size:13px;">' +
    "<p>注册公司需缴纳 <strong>¥50,000</strong> 启动资金。选择行业后即可开始创业之旅。</p>" +
    '<div style="margin:12px 0;">' +
    '<label style="font-weight:600;font-size:12px;">🏢 公司名称</label>' +
    '<input id="startup-name-input" type="text" placeholder="输入公司名（可选）" maxlength="16" style="width:100%;padding:8px;margin-top:4px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text-primary);font-size:13px;">' +
    "</div>" +
    '<div style="margin:12px 0;">' +
    '<label style="font-weight:600;font-size:12px;">📋 选择行业</label>' +
    '<div style="margin-top:4px;">' +
    industryHtml +
    "</div>" +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-muted);">当前现金：¥' +
    cash.toLocaleString() +
    " | 注册后剩余：¥" +
    (cash - 50000).toLocaleString() +
    "</div>" +
    "</div>";

  if (typeof showModal !== "function") return;
  showModal({
    title: "🚀 注册公司",
    body: bodyHtml,
    buttons: [
      { text: "取消", cls: "", callback: function () {} },
      {
        text: "✅ 确认注册",
        cls: "btn-primary",
        callback: function () {
          var nameInput = document.getElementById("startup-name-input");
          var name = nameInput ? nameInput.value.trim() : "";
          // 找选中的行业
          var selected = document.querySelector(
            'input[name="startup-industry"]:checked',
          );
          if (!selected) {
            StateManager.addMessage("⚠️ 请选择一个行业。", "warning");
            return;
          }
          var industry = selected.value;
          var result = registerStartup(state, name || null, industry, "");
          if (result.success) {
            StateManager.addMessage(
              result.message || "公司注册成功！",
              "success",
            );
            if (typeof renderAll === "function") renderAll();
            // 切换到创业Tab
            if (typeof switchTab === "function") switchTab("startup");
          } else {
            StateManager.addMessage(result.message || "注册失败", "warning");
          }
        },
      },
    ],
  });
}

/** 注册新公司 */
function registerStartup(state, name, industry, description) {
  // 检查触发条件
  const cash = state.resources.cash;
  const day = state.player.day;
  const minCash = 50000; // 最低启动资金

  if (cash < minCash) {
    return {
      success: false,
      message: "启动资金不足，至少需要¥" + minCash,
    };
  }

  if (!STARTUP_INDUSTRIES[industry]) {
    return {
      success: false,
      message: "无效的行业选择",
    };
  }

  // 扣减启动资金
  state.resources.cash -= minCash;

  // 生成公司名（如果玩家没输入）
  const companyName = name || _startupGenerateCompanyName(industry);

  // 初始化公司状态
  const company = {
    id: _startupGenerateId(),
    name: companyName,
    industry: industry,
    description: description || "",
    foundedDay: day,
    valuation: STARTUP_INDUSTRIES[industry].baseValuation,
    equity: {
      player: 100,
      coFounders: 0,
      employees: 0,
      investors: 0,
    },
    phase: "seed",
    fundingRounds: [],
    products: [],
    revenue: 0,
    expenses: 0,
    cashReserve: minCash, // 剩余启动资金
    burnRate: STARTUP_INDUSTRIES[industry].avgBurnRate,
    monthsOfRunway: 3, // 初始3个月 runway
    employees: [],
    reputation: 30,
    technologyScore: 20,
    marketScore: 10,
    coFounders: [],
  };

  // 生成1-2个联合创始人
  const numCoFounders = Math.random() < 0.6 ? 1 : 2;
  for (let i = 0; i < numCoFounders; i++) {
    const cofounder = _startupGenerateCoFounder(i);
    // 扣除玩家股权
    company.equity.player -= cofounder.equityRequest;
    company.equity.coFounders += cofounder.equityRequest;
    cofounder.joinedDay = day;
    company.coFounders.push(cofounder);
  }

  // 初始产品（MVP）
  const initialProduct = {
    id: _startupGenerateId(),
    name: companyName + "MVP",
    category: "app",
    description: "最小可行产品",
    developmentProgress: 0,
    targetDay: day + PRODUCT_CATEGORIES.app.baseDevTime,
    launchDay: null,
    technologyScore: 0,
    marketScore: 0,
    revenue: 0,
    status: "developing",
  };
  company.products.push(initialProduct);

  // 更新状态
  state.startup.status = "seed";
  state.startup.company = company;
  state.startup.flags.registered = true;
  state.startup.history.foundedDay = day;

  // 加入企业命运系统（Phase 2 联动）
  if (state.enterpriseFate && state.enterpriseFate.companies) {
    state.enterpriseFate.companies[company.id] = {
      phase: "startup",
      health: 60,
      marketShare: 0.5,
      sentiment: 40,
      productScore: 20,
      talentScore: 30,
      trend: "up",
      knownToPlayer: true,
      fateEventHistory: [],
      ceasedExistence: false,
      ceasedAt: null,
      isPlayerCompany: true,
      ownerId: "player",
    };
  }

  // 初始化竞争对手（Phase 4）
  if (typeof generateCompetitors === "function") {
    state.startup.competitors = generateCompetitors(state, company);
    StateManager.addMessage(
      "👀 市场上出现了" + state.startup.competitors.length + "家竞争对手",
      "info",
    );
  }

  StateManager.addMessage(
    "🏢 公司「" +
      companyName +
      "」已注册！行业：" +
      STARTUP_INDUSTRIES[industry].name +
      "，初始估值：¥" +
      company.valuation.toLocaleString(),
    "success",
  );

  return {
    success: true,
    message: "公司注册成功！",
    company: company,
  };
}

// ====== 核心：产品开发 ======
function createProduct(state, name, category) {
  const company = state.startup.company;
  if (!company || company.phase === "exited") {
    return { success: false, message: "没有可运营的公司" };
  }

  if (!PRODUCT_CATEGORIES[category]) {
    return { success: false, message: "无效的产品类别" };
  }

  const categoryInfo = PRODUCT_CATEGORIES[category];
  const product = {
    id: _startupGenerateId(),
    name: name || company.name + "产品" + (company.products.length + 1),
    category: category,
    description: "",
    developmentProgress: 0,
    targetDay: state.player.day + categoryInfo.baseDevTime,
    launchDay: null,
    technologyScore: 0,
    marketScore: 0,
    revenue: 0,
    status: "developing",
    // 功能模块（产品竞争力来源）
    features: [],
    // 用户数据
    users: 0,
    rating: 3.5,
    // 竞争力评分（0-100）
    competitiveness: 0,
  };

  company.products.push(product);
  StateManager.addMessage("💻 新产品「" + product.name + "」开始开发", "info");
  return { success: true, product: product };
}

function developProduct(state, productId, effort) {
  // effort: 1-3 点行动力
  if (effort < 1 || effort > 3) {
    return { success: false, message: "投入力度应为1-3" };
  }

  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const product = company.products.find((p) => p.id === productId);
  if (!product || product.status !== "developing") {
    return { success: false, message: "产品不存在或已发布" };
  }

  // 计算开发进度增量
  const playerIntelligence = state.player.intelligence || 20;
  const playerCoding = (state.player.skills || {}).coding?.level || 0;
  const teamTechScore = company.technologyScore || 20;

  // 基础进度 + 智力加成 + 技能加成 + 团队加成 + 随机波动
  const baseProgress = 2 + effort;
  const intelligenceBonus = playerIntelligence / 20;
  const codingBonus = playerCoding / 50;
  const teamBonus = teamTechScore / 100;
  const randomFactor = 0.8 + Math.random() * 0.4;

  const progressGain =
    (baseProgress + intelligenceBonus + codingBonus + teamBonus) * randomFactor;

  product.developmentProgress = Math.min(
    100,
    product.developmentProgress + progressGain,
  );

  // 消耗公司现金（研发成本）
  const devCost = 1000 * effort;
  company.cashReserve = Math.max(0, company.cashReserve - devCost);
  company.expenses += devCost;

  // 检查是否完成
  if (product.developmentProgress >= 100) {
    product.status = "ready_to_launch";
    StateManager.addMessage(
      "🎉 产品「" + product.name + "」开发完成，可以发布了！",
      "success",
    );
  } else {
    StateManager.addMessage(
      "💻 产品「" +
        product.name +
        "」开发进度：" +
        Math.round(product.developmentProgress) +
        "%（投入" +
        effort +
        "点）",
      "info",
    );
  }

  return { success: true, progress: product.developmentProgress };
}

function launchProduct(state, productId) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const product = company.products.find((p) => p.id === productId);
  if (!product || product.status !== "ready_to_launch") {
    return { success: false, message: "产品未开发完成" };
  }

  // 计算产品分数
  const techScore = Math.min(
    100,
    30 +
      company.technologyScore +
      (state.player.skills?.coding?.level || 0) * 0.3,
  );
  const marketScore = Math.min(
    100,
    20 + company.marketScore + (state.player.skills?.sales?.level || 0) * 0.3,
  );

  product.technologyScore = Math.round(techScore);
  product.marketScore = Math.round(marketScore);
  product.launchDay = state.player.day;
  product.status = "launched";

  // 计算市场反响
  const productScore = techScore * 0.6 + marketScore * 0.4;
  const marketReaction = productScore / 100;

  // 更新公司分数
  company.technologyScore = Math.max(company.technologyScore, techScore * 0.3);
  company.marketScore = Math.max(company.marketScore, marketScore * 0.3);
  company.reputation = Math.min(
    100,
    company.reputation + 5 + Math.floor(marketReaction * 10),
  );

  // 更新估值
  const valuationBoost = company.valuation * 0.1 * marketReaction;
  company.valuation = Math.round(company.valuation + valuationBoost);

  // 标记首次发布
  if (!state.startup.flags.firstProductLaunched) {
    state.startup.flags.firstProductLaunched = true;
  }

  StateManager.addMessage(
    "🚀 产品「" +
      product.name +
      "」正式发布！技术分：" +
      Math.round(techScore) +
      "，市场分：" +
      Math.round(marketScore) +
      "，公司估值提升至¥" +
      company.valuation.toLocaleString(),
    "success",
  );

  return { success: true, product: product, marketReaction: marketReaction };
}

// ====== 产品功能模块系统 ======

/** 通用功能模块定义 */
const FEATURE_MODULES = {
  user_system: {
    name: "用户系统",
    icon: "👤",
    cost: 10000,
    devTime: 15,
    techBonus: 5,
    marketBonus: 3,
    desc: "注册/登录/个人资料，产品的基础设施",
  },
  payment: {
    name: "支付系统",
    icon: "💳",
    cost: 20000,
    devTime: 20,
    techBonus: 8,
    marketBonus: 5,
    desc: "支持多种支付方式，变现的基础",
  },
  analytics: {
    name: "数据看板",
    icon: "📊",
    cost: 15000,
    devTime: 15,
    techBonus: 6,
    marketBonus: 2,
    desc: "用户行为分析/业务指标监控",
  },
  social_share: {
    name: "社交分享",
    icon: "🔗",
    cost: 8000,
    devTime: 10,
    techBonus: 2,
    marketBonus: 6,
    desc: "一键分享到社交平台，病毒传播",
  },
  push_notification: {
    name: "推送通知",
    icon: "🔔",
    cost: 10000,
    devTime: 12,
    techBonus: 3,
    marketBonus: 5,
    desc: "提升用户活跃度和留存率",
  },
  api_gateway: {
    name: "API网关",
    icon: "🔌",
    cost: 25000,
    devTime: 25,
    techBonus: 10,
    marketBonus: 2,
    desc: "开放API接口，构建生态系统",
  },
  ai_recommend: {
    name: "AI推荐引擎",
    icon: "🧠",
    cost: 40000,
    devTime: 30,
    techBonus: 12,
    marketBonus: 8,
    desc: "个性化推荐，提升用户粘性",
  },
  live_stream: {
    name: "直播功能",
    icon: "📹",
    cost: 35000,
    devTime: 35,
    techBonus: 8,
    marketBonus: 10,
    desc: "实时互动，提升用户参与度",
  },
  search: {
    name: "智能搜索",
    icon: "🔍",
    cost: 12000,
    devTime: 15,
    techBonus: 5,
    marketBonus: 4,
    desc: "全文搜索/智能推荐/搜索结果优化",
  },
  multi_platform: {
    name: "多平台支持",
    icon: "📱",
    cost: 30000,
    devTime: 30,
    techBonus: 7,
    marketBonus: 6,
    desc: "iOS/Android/Web多端同步",
  },
  security: {
    name: "安全加固",
    icon: "🔒",
    cost: 15000,
    devTime: 15,
    techBonus: 8,
    marketBonus: 2,
    desc: "数据加密/风控/防攻击",
  },
  customer_support: {
    name: "客服系统",
    icon: "💬",
    cost: 10000,
    devTime: 12,
    techBonus: 2,
    marketBonus: 5,
    desc: "在线客服/工单系统/FAQ",
  },
  membership: {
    name: "会员体系",
    icon: "⭐",
    cost: 18000,
    devTime: 20,
    techBonus: 3,
    marketBonus: 7,
    desc: "等级/权益/积分体系，提升LTV",
  },
  marketplace_integration: {
    name: "市场对接",
    icon: "🏪",
    cost: 25000,
    devTime: 25,
    techBonus: 4,
    marketBonus: 8,
    desc: "对接第三方市场/平台",
  },
  cloud_scale: {
    name: "云扩展",
    icon: "☁️",
    cost: 20000,
    devTime: 20,
    techBonus: 10,
    marketBonus: 1,
    desc: "弹性伸缩/高可用架构",
  },
};

/** 获取产品可用的功能模块 */
function getProductAvailableFeatures(product) {
  const category = PRODUCT_CATEGORIES[product.category];
  if (!category || !category.features) return [];

  const available = [];
  for (const featName of category.features) {
    // 查找对应的功能模块定义
    for (const [key, def] of Object.entries(FEATURE_MODULES)) {
      if (def.name.includes(featName) || featName.includes(def.name)) {
        if (!product.features.find((f) => f.key === key)) {
          available.push({ key, ...def });
        }
      }
    }
  }
  return available;
}

/** 开发功能模块 */
function developFeature(state, productId, featureKey) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const product = company.products.find((p) => p.id === productId);
  if (!product) return { success: false, message: "产品不存在" };

  const feature = FEATURE_MODULES[featureKey];
  if (!feature) return { success: false, message: "功能模块不存在" };

  // 检查是否已开发
  if (product.features.find((f) => f.key === featureKey)) {
    return { success: false, message: "该功能已开发完成" };
  }

  // 检查现金
  if (company.cashReserve < feature.cost) {
    return {
      success: false,
      message: "现金不足，需要¥" + feature.cost.toLocaleString(),
    };
  }

  // 扣除现金，开始开发
  company.cashReserve -= feature.cost;
  company.expenses += feature.cost;

  // 添加开发中的功能
  product.features.push({
    key: featureKey,
    name: feature.name,
    status: "developing",
    progress: 0,
    targetDay: state.player.day + feature.devTime,
  });

  StateManager.addMessage(
    "🔧 「" + feature.name + "」开始开发，预计" + feature.devTime + "天完成",
    "info",
  );

  return { success: true, feature: feature };
}

/** 完成功能开发（每日管线中检查） */
function checkFeatureCompletion(state) {
  const startup = state.startup;
  if (!startup || !startup.company) return;

  const company = startup.company;
  const day = state.player.day;

  for (const product of company.products) {
    if (product.status !== "launched" && product.status !== "ready_to_launch")
      continue;

    for (let i = product.features.length - 1; i >= 0; i--) {
      const feat = product.features[i];
      if (feat.status === "developing" && day >= feat.targetDay) {
        feat.status = "completed";
        const featDef = FEATURE_MODULES[feat.key];
        if (featDef) {
          product.technologyScore = Math.min(
            100,
            product.technologyScore + featDef.techBonus,
          );
          product.marketScore = Math.min(
            100,
            product.marketScore + featDef.marketBonus,
          );
          StateManager.addMessage(
            "✅ 「" +
              feat.name +
              "」开发完成！技术分+" +
              featDef.techBonus +
              "，市场分+" +
              featDef.marketBonus,
            "success",
          );
        }
      }
    }
  }
}

/** 计算产品竞争力 */
function calculateProductCompetitiveness(product) {
  const category = PRODUCT_CATEGORIES[product.category];
  if (!category) return 0;

  let score = 0;
  // 基础分
  score += product.technologyScore * 0.4;
  score += product.marketScore * 0.3;
  // 功能模块加成
  score += product.features.length * 5;
  // 用户规模加成
  score += Math.min(20, (product.users || 0) / 1000);
  // 评分加成
  score += (product.rating || 3.5) * 4;

  product.competitiveness = Math.round(Math.min(100, score));
  return product.competitiveness;
}

// ====== 核心：招聘员工 ======
function hireEmployee(state, role, salary) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  if (!EMPLOYEE_ROLES[role]) {
    return { success: false, message: "无效的员工角色" };
  }

  const baseSalary = EMPLOYEE_ROLES[role].baseSalary;
  const actualSalary = salary || baseSalary;

  // 检查现金
  if (company.cashReserve < actualSalary) {
    return { success: false, message: "现金不足以支付月薪" };
  }

  // 生成员工
  const employee = {
    id: _startupGenerateId(),
    role: role,
    name: "员工" + (company.employees.length + 1),
    salary: actualSalary,
    productivity: EMPLOYEE_ROLES[role].baseProductivity,
    loyalty: 60 + Math.floor(Math.random() * 30),
    skillFocus: EMPLOYEE_ROLES[role].skillFocus,
    skillLevel: 30 + Math.floor(Math.random() * 30),
    joinedDay: state.player.day,
  };

  company.employees.push(employee);
  company.cashReserve -= actualSalary;
  company.expenses += actualSalary;
  company.equity.employees += 0.5; // 每个员工分配0.5%期权
  company.employeesHired = (company.employeesHired || 0) + 1;

  // 更新公司分数
  if (role === "engineer") {
    company.technologyScore = Math.min(100, company.technologyScore + 3);
  } else if (role === "sales" || role === "marketing") {
    company.marketScore = Math.min(100, company.marketScore + 3);
  }

  // 检查阶段升级
  if (company.employees.length >= 5 && company.phase === "seed") {
    company.phase = "growth";
    state.startup.status = "growth";
    StateManager.addMessage("📈 团队达到5人，公司进入成长期！", "success");
  }

  state.startup.history.employeesHired = company.employeesHired || 0;

  StateManager.addMessage(
    "👥 招聘「" +
      EMPLOYEE_ROLES[role].name +
      "」成功！月薪¥" +
      actualSalary.toLocaleString() +
      "，团队规模：" +
      company.employees.length +
      "人",
    "success",
  );

  return { success: true, employee: employee };
}

function fireEmployee(state, employeeId) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const idx = company.employees.findIndex((e) => e.id === employeeId);
  if (idx === -1) return { success: false, message: "员工不存在" };

  const employee = company.employees[idx];
  company.employees.splice(idx, 1);
  company.equity.employees = Math.max(0, company.equity.employees - 0.5);

  // 离职影响
  company.reputation = Math.max(0, company.reputation - 2);
  company.loyalty = (company.loyalty || 70) - 5;

  StateManager.addMessage(
    "👋 「" + employee.name + "」已离职，公司声誉-2",
    "warning",
  );

  return { success: true };
}

// ====== 核心：融资 ======
function getEligibleRounds(state) {
  const company = state.startup.company;
  if (!company) return [];

  const eligible = [];
  for (const [roundId, roundDef] of Object.entries(FUNDING_ROUNDS)) {
    if (company.phase === "seed" && roundId !== "seed") continue;
    if (company.phase === "growth" && roundId === "seed") continue;

    if (
      company.valuation >= roundDef.minValuation &&
      company.revenue >= roundDef.minRevenue &&
      company.employees.length >= roundDef.minEmployees
    ) {
      eligible.push(roundId);
    }
  }
  return eligible;
}

function raiseFunding(state, roundId) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  if (!FUNDING_ROUNDS[roundId]) {
    return { success: false, message: "无效融资轮次" };
  }

  const roundDef = FUNDING_ROUNDS[roundId];
  const eligibleRounds = getEligibleRounds(state);
  if (!eligibleRounds.includes(roundId)) {
    return {
      success: false,
      message:
        "公司尚未达到" +
        roundDef.name +
        "的标准（估值¥" +
        roundDef.minValuation.toLocaleString() +
        "起）",
    };
  }

  // 生成投资人谈判
  const investorType =
    INVESTOR_TYPES[
      roundDef.investorTypes[
        Math.floor(Math.random() * roundDef.investorTypes.length)
      ]
    ];

  const raiseAmount = Math.floor(
    roundDef.maxRaise * (0.5 + Math.random() * 0.5),
  );
  const equityDilution =
    roundDef.equityDilution[0] +
    Math.random() * (roundDef.equityDilution[1] - roundDef.equityDilution[0]);

  // 更新股权
  const oldPlayerEquity = company.equity.player;
  company.equity.player =
    Math.round(company.equity.player * (1 - equityDilution) * 100) / 100;
  company.equity.investors += equityDilution * 100;

  // 更新公司状态
  company.cashReserve += raiseAmount;
  company.valuation = Math.round(
    company.valuation + raiseAmount / (equityDilution || 0.15),
  );
  company.phase = roundId === "seed" ? "seed" : "growth";
  if (roundId === "C") {
    state.startup.status = "ipo_preparing";
  }

  company.fundingRounds.push({
    round: roundId,
    amount: raiseAmount,
    investorType: investorType.name,
    equityDilution: Math.round(equityDilution * 100),
    postValuation: company.valuation,
    day: state.player.day,
  });

  state.startup.flags.hasInvestors = true;

  // 更新企业命运系统中的公司
  if (state.enterpriseFate && state.enterpriseFate.companies && company.id) {
    const fateCo = state.enterpriseFate.companies[company.id];
    if (fateCo) {
      fateCo.health = Math.min(100, fateCo.health + 15);
      fateCo.sentiment = Math.min(100, fateCo.sentiment + 20);
      fateCo.trend = "up";
    }
  }

  StateManager.addMessage(
    "💰 " +
      roundDef.name +
      "融资成功！融资金额：¥" +
      raiseAmount.toLocaleString() +
      "，出让股权：" +
      Math.round(equityDilution * 100) +
      "%，投后估值：¥" +
      company.valuation.toLocaleString() +
      "（玩家持股从" +
      Math.round(oldPlayerEquity) +
      "%稀释至" +
      Math.round(company.equity.player) +
      "%）",
    "success",
  );

  return {
    success: true,
    round: roundDef,
    amount: raiseAmount,
    equityDilution: equityDilution,
    investor: investorType,
  };
}

// ====== 核心：公司运营（每日/季度）======
/**
 * @param {Object} state - 游戏状态
 * @param {string} tickType - 'daily' | 'quarterly' 调用类型
 */
function tickStartup(state, tickType) {
  tickType = tickType || "quarterly"; // 默认季度（兼容旧调用）
  const startup = state.startup;
  if (!startup || startup.status === "none" || startup.flags.exited) return;

  const company = startup.company;
  if (!company) return;

  const day = state.player.day;

  // 时间倍率：daily=1, quarterly=90（天）
  const timeMult = tickType === "daily" ? 1 : 90;
  // 每日基础参数
  const DAILY_BASE_REVENUE = 180; // ~¥180/天/产品 → ~¥16,200/季度
  const DAILY_SALARY_DIV = 30; // 月薪÷30 = 日薪
  const DAILY_RENT_BASE = 180; // ~¥180/天 → ~¥5,400/季度
  const DAILY_RENT_PER_EMP = 33; // ~¥33/天/人 → ~¥1,000/季度
  const DAILY_RD = 180; // ~¥180/天/产品 → ~¥16,200/季度
  const DAILY_MARKETING_BASE = 120; // ~¥120/天 → ~¥3,600/季度
  const DAILY_MARKETING_RATIO = 0.05 / 90; // 日营收比例
  const DAILY_LOYALTY_DECAY_BAD = 0.12; // ~3.6/季度
  const DAILY_LOYALTY_DECAY_GOOD = 0.02; // ~0.6/季度
  const DAILY_FIRE_PROB = 0.003; // ~0.3%/天 → ~2.7%/季度
  const DAILY_WORD_OF_MOUTH_PROB = 0.003; // ~0.3%/天 → ~2.7%/季度
  const DAILY_BASE_GROWTH = 0.0008; // ~0.08%/天 → ~7%/季度
  const DAILY_CHURN_BASE = 0.002; // ~0.2%/天 → ~18%/季度

  // 1. 收入计算
  let totalRevenue = 0;
  for (const product of company.products) {
    if (product.status === "launched") {
      const baseRevenue = DAILY_BASE_REVENUE * timeMult;
      const techMod = product.technologyScore / 100;
      const marketMod = product.marketScore / 100;
      const industryMod =
        STARTUP_INDUSTRIES[company.industry]?.avgBurnRate / 50000 || 1;
      const growthMod = 1 + (company.revenue > 0 ? 0.003 : 0);

      product.revenue = Math.round(
        baseRevenue *
          techMod *
          marketMod *
          industryMod *
          growthMod *
          (1 + Math.random() * 0.2 - 0.1),
      );
      totalRevenue += product.revenue;
    }
  }

  // 2. 支出计算
  let totalExpenses = 0;
  // 员工工资（日薪 × 天数）
  for (const emp of company.employees) {
    totalExpenses += Math.round((emp.salary / DAILY_SALARY_DIV) * timeMult);
  }
  // 办公租金
  const rent =
    Math.round(DAILY_RENT_BASE * timeMult) +
    company.employees.length * Math.round(DAILY_RENT_PER_EMP * timeMult);
  totalExpenses += rent;
  // 研发成本
  const rAndD =
    company.products.filter((p) => p.status === "developing").length *
    Math.round(DAILY_RD * timeMult);
  totalExpenses += rAndD;
  // 营销
  const marketing =
    Math.round(DAILY_MARKETING_BASE * timeMult) +
    Math.round(company.revenue * DAILY_MARKETING_RATIO * timeMult);
  totalExpenses += marketing;

  company.revenue = totalRevenue;
  company.expenses = totalExpenses;

  // 3. 净现金流
  const netCash = totalRevenue - totalExpenses;
  company.cashReserve += netCash;

  // 4. 烧钱率 & runway
  company.burnRate = Math.max(0, totalExpenses - totalRevenue);
  company.monthsOfRunway =
    company.burnRate > 0 ? company.cashReserve / (company.burnRate / 30) : 999;

  // 5. 估值漂移
  const valuationUpMod = tickType === "daily" ? 0.0003 : 0.02;
  const valuationDownMod = tickType === "daily" ? 0.0002 : 0.01;
  if (netCash > 0) {
    company.valuation *= 1 + valuationUpMod + Math.random() * valuationUpMod;
  } else if (netCash < 0) {
    company.valuation *=
      1 - valuationDownMod - Math.random() * valuationDownMod;
  }
  company.valuation = Math.round(company.valuation);

  // 更新峰值估值
  if (company.valuation > (startup.history.peakValuation || 0)) {
    startup.history.peakValuation = company.valuation;
  }

  // 6. 团队忠诚度衰减
  for (const emp of company.employees) {
    emp.loyalty = Math.max(
      0,
      emp.loyalty -
        (netCash < 0 ? DAILY_LOYALTY_DECAY_BAD : DAILY_LOYALTY_DECAY_GOOD) *
          timeMult,
    );
    // 低忠诚度可能离职
    if (emp.loyalty < 20 && Math.random() < DAILY_FIRE_PROB * timeMult) {
      StateManager.addMessage(
        "⚠️ 「" + emp.name + "」因不满公司状况离职！",
        "danger",
      );
      fireEmployee(state, emp.id);
    }
  }

  // 7. 破产检测
  if (company.monthsOfRunway <= 0 && company.fundingRounds.length >= 2) {
    StateManager.addMessage("⚠️ 资金链告急！尝试紧急融资...", "warning");
  }

  if (company.monthsOfRunway <= 0) {
    bankrupt(state);
  }

  // 8. 阶段升级检查
  if (company.phase === "seed" && company.employees.length >= 5) {
    company.phase = "growth";
    state.startup.status = "growth";
    StateManager.addMessage("📈 团队扩大，公司进入成长期！", "success");
  }

  // 9. 产品运营 — 用户增长 + 口碑传播
  for (const product of company.products) {
    if (product.status === "launched") {
      const wordOfMouth =
        Math.random() < DAILY_WORD_OF_MOUTH_PROB * timeMult ? 0.05 : 0;
      const baseGrowth = DAILY_BASE_GROWTH * timeMult;
      const productFactor =
        (product.technologyScore + product.marketScore) / 200;
      const growthRate = baseGrowth * productFactor + wordOfMouth;

      if (!product.users) product.users = 100;
      product.users = Math.round(product.users * (1 + growthRate));

      // 口碑评分
      if (!product.rating) product.rating = 3.5;
      const ratingChange =
        ((product.technologyScore / 100 - 0.5) * 0.2) / timeMult +
        ((Math.random() - 0.5) * 0.1) / timeMult;
      product.rating = Math.max(1, Math.min(5, product.rating + ratingChange));

      // 用户留存
      const churnRate =
        DAILY_CHURN_BASE * timeMult + (1 - product.rating / 5) * 0.1;
      const retained = Math.floor(
        product.users * (1 - Math.min(churnRate, 0.5)),
      );
      const lost = product.users - retained;

      if (wordOfMouth > 0) {
        StateManager.addMessage(
          "🔥 「" +
            product.name +
            "」口碑爆发！新增用户 +" +
            Math.round(product.users * growthRate) +
            "，当前用户 " +
            product.users +
            "，评分 " +
            product.rating.toFixed(1) +
            "★",
          "success",
        );
      }

      if (lost > 0 && Math.random() < 0.2 / timeMult) {
        StateManager.addMessage(
          "📉 「" +
            product.name +
            "」流失 " +
            lost +
            " 用户（留存率 " +
            (100 - Math.min(churnRate, 0.5) * 100).toFixed(0) +
            "%）",
          "warning",
        );
      }
    }
  }

  // 10. 检查收购要约（仅季度调用时检查，避免每日都弹）
  if (
    tickType !== "daily" &&
    !startup.flags._acquisitionOfferExpired &&
    !startup.flags.ipoFiled
  ) {
    const offer = getAcquisitionOffer(state);
    if (offer) {
      state.startup.pendingAcquisitionOffer = offer;
      StateManager.addMessage(
        "🤝 「" +
          offer.acquirerName +
          "」向你提出收购要约！估值 " +
          offer.offerMultiplier.toFixed(2) +
          "x，前往创业Tab查看详情",
        "event",
      );
    }
  }

  // 11. 检查功能模块开发完成
  checkFeatureCompletion(state);

  // 12. 更新产品竞争力
  for (const product of company.products) {
    calculateProductCompetitiveness(product);
  }

  // 13. 竞争对手演化（每日）
  if (state.startup.competitors && state.startup.competitors.length > 0) {
    if (typeof tickCompetitors === "function") {
      tickCompetitors(state, state.startup.competitors);
    }
  }
}

// ====== 核心：IPO准备 ======
function prepareIPO(state) {
  const startup = state.startup;
  const company = startup.company;
  if (!company) return { success: false, message: "没有公司" };

  if (startup.status !== "growth" && startup.status !== "ipo_preparing") {
    return { success: false, message: "公司尚未达到IPO准备阶段" };
  }

  // 检查条件
  const checks = {
    valuation: company.valuation >= 500000000, // 5亿
    funding: company.fundingRounds.length >= 2, // 至少B轮
    profitability: company.revenue > company.expenses, // 盈利
  };

  const allPassed = Object.values(checks).every(Boolean);

  if (!allPassed) {
    const failed = [];
    if (!checks.valuation)
      failed.push(
        "估值需≥5亿（当前¥" + company.valuation.toLocaleString() + "）",
      );
    if (!checks.funding) failed.push("需完成至少B轮融资");
    if (!checks.profitability) failed.push("需连续盈利");
    return {
      success: false,
      message: "IPO条件未达标：" + failed.join("，"),
      checks: checks,
    };
  }

  // 提交IPO申请
  startup.status = "ipo_preparing";
  startup.flags.ipoFiled = true;

  StateManager.addMessage("🔔 已提交IPO申请！等待监管审核...", "info");

  // 3-5天后审核结果（由pendingEvents处理）
  return { success: true, message: "IPO申请已提交" };
}

function processIPOResult(state, approved) {
  const startup = state.startup;
  const company = startup.company;
  if (!company) return;

  if (approved) {
    // IPO成功
    const ipoValuation = company.valuation * (1.5 + Math.random() * 1.5); // 上市溢价
    company.valuation = Math.round(ipoValuation);

    startup.flags.exited = true;
    startup.flags.exitType = "ipo";
    startup.flags.exitDay = state.player.day;
    startup.flags.exitValue = Math.round(
      (company.equity.player / 100) * ipoValuation,
    );

    startup.history.exitedDay = state.player.day;
    startup.history.exitType = "ipo";
    startup.history.exitValue = startup.flags.exitValue;

    StateManager.addMessage(
      "🎉 IPO上市成功！市值¥" +
        Math.round(ipoValuation).toLocaleString() +
        "，你持有" +
        Math.round(company.equity.player) +
        "%股份，价值¥" +
        Math.round(startup.flags.exitValue).toLocaleString() +
        "！",
      "success",
    );

    // 玩家获得现金回报
    state.resources.cash += startup.flags.exitValue;
  } else {
    StateManager.addMessage("❌ IPO审核未通过，公司需要继续经营", "danger");
    startup.status = "growth";
    startup.flags.ipoFiled = false;
  }
}

// ====== 核心：被收购 ======
function getAcquisitionOffer(state) {
  const startup = state.startup;
  const company = startup.company;
  if (!company) return null;
  if (company.phase !== "growth" && company.phase !== "mature") return null;

  // 检查是否有收购要约 - 成长期/成熟期公司才有机会
  const offerProb = company.phase === "mature" ? 0.08 : 0.03;
  if (Math.random() > offerProb) return null;

  // 生成收购方（从企业命运系统中选择健康度高的公司）
  const companies = state.enterpriseFate?.companies || {};
  const candidates = [];
  for (const [cid, co] of Object.entries(companies)) {
    if (co && co.health > 70 && !co.isPlayerCompany && !co.ceasedExistence) {
      candidates.push({ cid, health: co.health });
    }
  }

  if (candidates.length === 0) return null;

  // 选择最强公司
  candidates.sort((a, b) => b.health - a.health);
  const acquirerCid = candidates[0].cid;
  const acquirerName = getCompanyNameById(acquirerCid);

  // 生成收购报价 - 考虑公司表现
  let offerMultiplier = 0.8 + Math.random() * 0.6; // 基础 0.8-1.4倍
  // 表现好加成
  if (company.revenue > company.expenses) offerMultiplier += 0.15;
  if (company.reputation > 60) offerMultiplier += 0.1;
  if (company.employees.length > 10) offerMultiplier += 0.05;
  // 表现差减成
  if (company.monthsOfRunway < 3) offerMultiplier -= 0.1;
  offerMultiplier = Math.max(0.5, Math.min(2.0, offerMultiplier));

  const offerValue = Math.round(company.valuation * offerMultiplier);
  const playerShareValue = Math.round(
    (company.equity.player / 100) * offerValue,
  );

  // 生成收购方评语
  const评语 = [
    "对你们的产品方向很感兴趣",
    "看好团队的技术实力",
    "希望整合你们的市场渠道",
    "对我们的用户增长数据印象深刻",
    "想补充他们在该领域的布局",
  ];
  const acquirerComment = 评语[Math.floor(Math.random() * 评语.length)];

  return {
    acquirerCid: acquirerCid,
    acquirerName: acquirerName,
    offerValue: offerValue,
    playerShareValue: playerShareValue,
    offerDay: state.player.day,
    offerMultiplier: offerMultiplier,
    acquirerComment: acquirerComment,
    pending: true, // 待玩家决策
  };
}

/** 显示收购要约弹窗 */
function showAcquisitionModal(state, offer) {
  if (!offer) return;

  const startup = state.startup;
  const company = startup.company;
  const industryInfo = STARTUP_INDUSTRIES[company.industry];

  if (typeof showModal !== "function") return;

  const bodyHtml = `
    <div style="font-size:14px;">
      <div style="text-align:center;padding:16px;background:var(--bg-secondary);border-radius:8px;margin-bottom:16px;">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">🤝 收购要约</div>
        <div style="font-size:16px;font-weight:bold;color:var(--text-primary);">
          「${company.name}」将被「${offer.acquirerName}」收购
        </div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:6px;">
          ${offer.acquirerComment}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div style="padding:12px;background:var(--bg-card);border-radius:6px;">
          <div style="font-size:11px;color:var(--text-muted);">收购方</div>
          <div style="font-size:14px;font-weight:bold;color:var(--text-primary);">${offer.acquirerName}</div>
        </div>
        <div style="padding:12px;background:var(--bg-card);border-radius:6px;">
          <div style="font-size:11px;color:var(--text-muted);">报价倍数</div>
          <div style="font-size:14px;font-weight:bold;color:var(--accent);">${offer.offerMultiplier.toFixed(2)}x 估值</div>
        </div>
        <div style="padding:12px;background:var(--bg-card);border-radius:6px;">
          <div style="font-size:11px;color:var(--text-muted);">公司总估值</div>
          <div style="font-size:14px;font-weight:bold;color:var(--success);">¥${offer.offerValue.toLocaleString()}</div>
        </div>
        <div style="padding:12px;background:var(--bg-card);border-radius:6px;">
          <div style="font-size:11px;color:var(--text-muted);">你获得（${Math.round(company.equity.player)}%股份）</div>
          <div style="font-size:16px;font-weight:bold;color:var(--success);">¥${offer.playerShareValue.toLocaleString()}</div>
        </div>
      </div>

      <div style="padding:12px;background:rgba(245,158,11,0.1);border-radius:6px;border:1px solid rgba(245,158,11,0.3);margin-bottom:12px;">
        <div style="font-size:12px;color:var(--text-secondary);">
          ⚠️ 接受收购后公司将退出历史舞台，你获得现金但失去创业身份。
          建议在公司估值较高（产品成功、团队稳定、盈利）时接受。
        </div>
      </div>

      <div style="font-size:12px;color:var(--text-muted);">
        当前公司状态：估值¥${Math.round(company.valuation).toLocaleString()} |
        月收入¥${Math.round(company.revenue).toLocaleString()} |
        团队${company.employees.length}人 |
        Runway ${Math.round(company.monthsOfRunway)}月
      </div>
    </div>
  `;

  showModal({
    title: "🤝 收购要约",
    body: bodyHtml,
    buttons: [
      {
        text: "💰 接受收购",
        cls: "btn-success",
        callback: function () {
          const result = acceptAcquisition(state, offer);
          if (result.success) {
            if (typeof renderAll === "function") renderAll();
          }
        },
      },
      {
        text: "📊 还价",
        cls: "btn-primary",
        callback: function () {
          // 还价逻辑
          const counterOfferMultiplier =
            offer.offerMultiplier + 0.2 + Math.random() * 0.3;
          const counterOfferValue = Math.round(
            company.valuation * counterOfferMultiplier,
          );
          const counterPlayerShare = Math.round(
            (company.equity.player / 100) * counterOfferValue,
          );

          if (typeof showModal !== "function") return;

          showModal({
            title: "💰 还价",
            body: `
              <div style="font-size:14px;">
                <p style="margin-bottom:12px;">你提出反报价：<strong style="color:var(--accent);">¥${counterOfferValue.toLocaleString()}</strong>（${counterOfferMultiplier.toFixed(2)}x 估值）</p>
                <p style="font-size:12px;color:var(--text-muted);">
                  对方有 ${Math.round(30 + Math.random() * 40)}% 的概率接受。
                  如果拒绝，原报价将失效，下次收购要约需等待更久。
                </p>
              </div>
            `,
            buttons: [
              {
                text: "确认还价",
                cls: "btn-primary",
                callback: function () {
                  const accepted = Math.random() < 0.3 + Math.random() * 0.4;
                  if (accepted) {
                    StateManager.addMessage(
                      "🎉 「" +
                        offer.acquirerName +
                        "」接受了你的还价！收购价提升至 ¥" +
                        counterOfferValue.toLocaleString(),
                      "success",
                    );
                    offer.offerValue = counterOfferValue;
                    offer.playerShareValue = counterPlayerShare;
                    acceptAcquisition(state, offer);
                    if (typeof renderAll === "function") renderAll();
                  } else {
                    StateManager.addMessage(
                      "❌ 「" +
                        offer.acquirerName +
                        "」拒绝了你的还价，收购谈判破裂。",
                      "danger",
                    );
                    // 标记收购要约已失效
                    startup.flags._acquisitionOfferExpired = true;
                    if (typeof renderAll === "function") renderAll();
                  }
                },
              },
              {
                text: "取消",
                cls: "",
                callback: function () {},
              },
            ],
          });
        },
      },
      {
        text: "❌ 拒绝",
        cls: "btn-danger",
        callback: function () {
          StateManager.addMessage(
            "你拒绝了收购要约，决定继续经营公司。",
            "warning",
          );
          startup.flags._acquisitionOfferExpired = true;
          if (typeof renderAll === "function") renderAll();
        },
      },
    ],
  });
}

function acceptAcquisition(state, offer) {
  const startup = state.startup;
  const company = startup.company;
  if (!company || !offer) return { success: false };

  // 执行收购
  startup.flags.exited = true;
  startup.flags.exitType = "acquired";
  startup.flags.exitDay = state.player.day;
  startup.flags.exitValue = offer.playerShareValue;

  startup.history.exitedDay = state.player.day;
  startup.history.exitType = "acquired";
  startup.history.exitValue = offer.playerShareValue;

  // 玩家获得现金
  state.resources.cash += offer.playerShareValue;

  // 在企业命运系统中标记
  if (state.enterpriseFate && state.enterpriseFate.companies) {
    const fateCo = state.enterpriseFate.companies[company.id];
    if (fateCo) {
      fateCo.ceasedExistence = true;
      fateCo.ceasedAt = state.player.day;
      fateCo.absorbedBy = offer.acquirerCid;
      fateCo.absorbedName = offer.acquirerName + "旗下";
    }

    // 收购方增强
    const acquirerCo = state.enterpriseFate.companies[offer.acquirerCid];
    if (acquirerCo) {
      acquirerCo.marketShare = Math.min(40, acquirerCo.marketShare + 2);
      acquirerCo.health = Math.min(100, acquirerCo.health + 5);
    }
  }

  StateManager.addMessage(
    "🤝 「" +
      company.name +
      "」被「" +
      offer.acquirerName +
      "」收购！你获得¥" +
      offer.playerShareValue.toLocaleString() +
      "，公司退出历史舞台",
    "success",
  );

  return { success: true, offer: offer };
}

// ====== 核心：破产 ======
function bankrupt(state) {
  const startup = state.startup;
  const company = startup.company;
  if (!company) return;

  startup.flags.exited = true;
  startup.flags.exitType = "bankrupt";
  startup.flags.exitDay = state.player.day;
  startup.flags.exitValue = 0;

  startup.history.exitedDay = state.player.day;
  startup.history.exitType = "bankrupt";
  startup.history.exitValue = 0;

  // 资产清算
  const assetRecovery = Math.round(company.cashReserve * 0.3); // 只能收回30%
  company.cashReserve = assetRecovery;

  // 玩家获得剩余现金（如果有）
  state.resources.cash += assetRecovery;

  // 声誉损失
  state.status.health = Math.max(0, state.status.health - 10);
  state.player.fame = Math.max(0, state.player.fame - 10);

  // 在企业命运系统中标记
  if (state.enterpriseFate && state.enterpriseFate.companies && company.id) {
    const fateCo = state.enterpriseFate.companies[company.id];
    if (fateCo) {
      fateCo.ceasedExistence = true;
      fateCo.ceasedAt = state.player.day;
      fateCo.health = 0;
    }
  }

  StateManager.addMessage(
    "⚰️ 「" +
      company.name +
      "」破产清算！资产回收¥" +
      assetRecovery +
      "，声誉受损",
    "danger",
  );

  // 清空公司（但保留历史）
  startup.company = null;
}

// ====== 辅助：获取公司详情 ======
function getStartupSummary(state) {
  const startup = state.startup;
  if (!startup || startup.status === "none" || !startup.company) {
    return null;
  }

  const company = startup.company;
  return {
    name: company.name,
    industry: STARTUP_INDUSTRIES[company.industry]?.name || company.industry,
    phase: company.phase,
    valuation: company.valuation,
    revenue: company.revenue,
    expenses: company.expenses,
    cashReserve: company.cashReserve,
    monthsOfRunway: company.monthsOfRunway,
    employeeCount: company.employees.length,
    productCount: company.products.length,
    reputation: company.reputation,
    playerEquity: company.equity.player,
    fundingRounds: company.fundingRounds.length,
    status: startup.status,
  };
}

// ====== 辅助：获取可执行行动列表 ======
function getAvailableStartupActions(state) {
  const startup = state.startup;
  if (!startup || startup.status === "none" || startup.flags.exited) {
    return [];
  }

  const actions = [];
  const company = startup.company;

  if (!company) return actions;

  // 产品开发
  actions.push({
    id: "develop_product",
    name: "推进产品开发",
    icon: "💻",
    apCost: 20,
    desc: "投入20点行动力推进产品开发",
    available: company.products.some((p) => p.status === "developing"),
  });

  // 创建新产品
  actions.push({
    id: "create_product",
    name: "创建新产品",
    icon: "🆕",
    apCost: 15,
    desc: "启动新产品的开发计划",
    available: true,
  });

  // 招聘
  actions.push({
    id: "hire_employee",
    name: "招聘员工",
    icon: "👥",
    apCost: 15,
    desc: "招募新团队成员",
    available: company.cashReserve > 10000,
  });

  // 见投资人
  actions.push({
    id: "meet_investor",
    name: "见投资人",
    icon: "💰",
    apCost: 15,
    desc: "与投资人会面洽谈",
    available: true,
  });

  // 融资
  const eligibleRounds = getEligibleRounds(state);
  actions.push({
    id: "raise_funding",
    name: "发起融资",
    icon: "📈",
    apCost: 10,
    desc: "启动融资流程",
    available: eligibleRounds.length > 0,
    meta: eligibleRounds.map((r) => FUNDING_ROUNDS[r].name).join(", "),
  });

  // 市场推广
  actions.push({
    id: "marketing",
    name: "市场推广",
    icon: "📢",
    apCost: 15,
    desc: "投入资源提升市场知名度",
    available: company.cashReserve > 5000,
  });

  // 查看财报
  actions.push({
    id: "review_financials",
    name: "查看财报",
    icon: "📊",
    apCost: 5,
    desc: "查看公司财务状况",
    available: true,
  });

  // 管理团队
  actions.push({
    id: "manage_team",
    name: "管理团队",
    icon: "🎯",
    apCost: 10,
    desc: "提升团队忠诚度和效率",
    available: company.employees.length > 0,
  });

  // IPO准备
  if (company.phase === "growth" && company.fundingRounds.length >= 2) {
    actions.push({
      id: "ipo_prep",
      name: "准备IPO",
      icon: "🔔",
      apCost: 20,
      desc: "准备上市申请材料",
      available:
        startup.status !== "ipo_preparing" && startup.status !== "exited",
    });
  }

  return actions;
}

// ====== 深度交互弹窗 ======

/** 见投资人弹窗 — 多渠道验证 + 投资人关系管理 */
function showMeetInvestorModal(state) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  // 生成投资人反馈
  const investorFeedback = generateInvestorFeedback(state);

  if (typeof showModal !== "function") return { success: true };

  const bodyHtml = `
    <div style="font-size:13px;">
      <div style="padding:12px;background:var(--bg-card);border-radius:8px;margin-bottom:12px;">
        <div style="font-size:14px;font-weight:bold;margin-bottom:8px;">💰 投资人会面</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">投资人类型：${investorFeedback.investorType}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">关注领域：${investorFeedback.focusArea}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">关系度：
          <span style="color:${getRelationshipColor(investorFeedback.relationship)};">${"★".repeat(Math.floor(investorFeedback.relationship / 20))}${"☆".repeat(5 - Math.floor(investorFeedback.relationship / 20))} ${investorFeedback.relationship}%</span>
        </div>
      </div>

      <div style="padding:12px;background:rgba(74,158,92,0.1);border-radius:6px;margin-bottom:12px;border:1px solid rgba(74,158,92,0.2);">
        <div style="font-size:12px;font-weight:bold;color:var(--success);margin-bottom:6px;">✅ 投资人看好</div>
        <div style="font-size:11px;color:var(--text-secondary);">${investorFeedback.positive}</div>
      </div>

      <div style="padding:12px;background:rgba(243,156,18,0.1);border-radius:6px;margin-bottom:12px;border:1px solid rgba(243,156,18,0.2);">
        <div style="font-size:12px;font-weight:bold;color:var(--warning);margin-bottom:6px;">⚠️ 关注风险</div>
        <div style="font-size:11px;color:var(--text-secondary);">${investorFeedback.concerns}</div>
      </div>

      <div style="font-size:11px;color:var(--text-muted);">
        💡 建议：${investorFeedback.advice}
      </div>
    </div>
  `;

  showModal({
    title: "💰 投资人会面",
    body: bodyHtml,
    buttons: [
      {
        text: "📅 约定下次会面",
        cls: "btn-primary",
        callback: function () {
          // 增加关系度
          company.investorRelationship = Math.min(
            100,
            (company.investorRelationship || 0) + investorFeedback.gain,
          );
          StateManager.addMessage(
            "与投资人关系度提升至 " +
              Math.round(company.investorRelationship) +
              "%",
            "success",
          );
          if (typeof renderAll === "function") renderAll();
        },
      },
      {
        text: "关闭",
        cls: "",
        callback: function () {},
      },
    ],
  });

  return { success: true };
}

/** 生成投资人反馈 */
function generateInvestorFeedback(state) {
  const company = state.startup.company;
  const phase = company.phase;

  const investorTypes = [
    "天使投资人",
    "VC机构",
    "企业风投",
    "家族办公室",
    "产业基金",
  ];
  const focusAreas = [
    "产品创新",
    "市场增长",
    "团队能力",
    "技术壁垒",
    "商业模式",
  ];

  const investorType =
    investorTypes[Math.floor(Math.random() * investorTypes.length)];
  const focusArea = focusAreas[Math.floor(Math.random() * focusAreas.length)];
  const relationship =
    (company.investorRelationship || 30) +
    (10 + Math.floor(Math.random() * 20));

  let positive, concerns, advice;

  if (phase === "seed") {
    positive = "产品方向清晰，团队执行力强，种子用户反馈积极";
    concerns = "市场规模待验证，商业模式需要进一步打磨，现金流压力较大";
    advice = "建议先做出MVP验证市场需求，再寻求A轮融资";
  } else if (phase === "growth") {
    positive = "用户增长数据亮眼，产品迭代速度快，团队结构完整";
    concerns = "竞争加剧风险，需要建立护城河，盈利模式需要验证";
    advice = "建议加速市场扩张，同时建立产品壁垒";
  } else {
    positive = "市场份额稳定，盈利模式清晰，团队成熟度高";
    concerns = "增长放缓，需要寻找第二增长曲线，IPO准备需要时间";
    advice = "建议考虑并购机会或加速IPO准备";
  }

  // 表现加成
  if (company.revenue > company.expenses) {
    positive += "，已实现盈利";
    concerns = concerns.replace("盈利模式需要验证", "盈利可持续性强");
  }
  if (company.reputation > 60) {
    positive += "，行业口碑良好";
  }

  return {
    investorType,
    focusArea,
    relationship,
    gain: Math.floor(5 + Math.random() * 15),
    positive,
    concerns,
    advice,
  };
}

function getRelationshipColor(val) {
  if (val >= 70) return "#2ecc71";
  if (val >= 40) return "#f39c12";
  return "#e74c3c";
}

/** 市场推广弹窗 — 多渠道选择 */
function showMarketingModal(state) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const channels = [
    {
      id: "social_media",
      name: "社交媒体营销",
      icon: "📱",
      cost: 5000,
      desc: "抖音/小红书/微博推广，快速提升知名度",
      effect: "市场分+3，用户增长+5%",
      risk: "效果波动大，需持续投入",
    },
    {
      id: "offline_event",
      name: "线下活动",
      icon: "🎪",
      cost: 15000,
      desc: "行业展会/发布会/沙龙，建立行业影响力",
      effect: "市场分+5，声誉+3，获得媒体曝光",
      risk: "成本高，效果依赖活动质量",
    },
    {
      id: "kol_collab",
      name: "KOL合作",
      icon: "⭐",
      cost: 20000,
      desc: "与行业KOL/博主合作推广",
      effect: "市场分+4，用户增长+8%，口碑传播",
      risk: "KOL选择风险，需评估真实性",
    },
    {
      id: "advertising",
      name: "广告投放",
      icon: "📺",
      cost: 30000,
      desc: "信息流广告/搜索引擎营销",
      effect: "市场分+6，用户增长+10%，直接转化",
      risk: "成本高，ROI不稳定",
    },
    {
      id: "content_marketing",
      name: "内容营销",
      icon: "📝",
      cost: 3000,
      desc: "博客/视频/白皮书，建立专业形象",
      effect: "市场分+2，声誉+2，长期价值",
      risk: "见效慢，需持续产出",
    },
  ];

  const bodyHtml = `
    <div style="font-size:13px;">
      <p style="margin-bottom:12px;color:var(--text-secondary);">
        选择推广渠道，提升市场知名度和用户增长。不同渠道成本效果不同。
      </p>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${channels
          .map(
            (ch) => `
          <div style="padding:10px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border);cursor:pointer;marketing-channel="${ch.id}" onclick="this.style.background='var(--bg-secondary)';this.style.borderColor='var(--accent)';">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <div style="font-size:13px;font-weight:bold;">${ch.icon} ${ch.name}</div>
              <div style="font-size:12px;color:var(--danger);">¥${ch.cost.toLocaleString()}</div>
            </div>
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:2px;">${ch.desc}</div>
            <div style="font-size:10px;color:var(--success);">效果：${ch.effect}</div>
            <div style="font-size:10px;color:var(--warning);">风险：${ch.risk}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;

  if (typeof showModal !== "function") return { success: true };

  showModal({
    title: "📢 市场推广",
    body: bodyHtml,
    buttons: [
      {
        text: "✅ 确认执行",
        cls: "btn-primary",
        callback: function () {
          const selected = document.querySelector(
            '[marketing-channel][style*="var(--bg-secondary)"]',
          );
          if (!selected) {
            StateManager.addMessage("请选择一个推广渠道", "warning");
            return;
          }
          const channelId = selected.getAttribute("marketing-channel");
          const channel = channels.find((c) => c.id === channelId);
          if (!channel) return;

          if (company.cashReserve < channel.cost) {
            StateManager.addMessage(
              "现金不足，需要¥" + channel.cost.toLocaleString(),
              "danger",
            );
            return;
          }

          // 执行推广
          company.cashReserve -= channel.cost;
          company.marketScore = Math.min(
            100,
            company.marketScore +
              Math.floor(channel.effect.match(/\+(\d+)/)[1] / 2),
          );

          // 随机效果波动
          const effectiveness = 0.7 + Math.random() * 0.6;
          const userGrowth = Math.floor(5 * effectiveness);

          StateManager.addMessage(
            "📢 「" +
              channel.name +
              "」推广完成！市场分提升，用户增长 +" +
              userGrowth +
              "%",
            "success",
          );

          if (typeof renderAll === "function") renderAll();
        },
      },
      {
        text: "取消",
        cls: "",
        callback: function () {},
      },
    ],
  });

  return { success: true };
}

/** 查看财报弹窗 — 完整财务报表 */
function showFinancialReportModal(state) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const monthlyRevenue = company.revenue || 0;
  const monthlyExpenses = company.expenses || 0;
  const netIncome = monthlyRevenue - monthlyExpenses;
  const profitMargin =
    monthlyRevenue > 0 ? (netIncome / monthlyRevenue) * 100 : 0;

  const bodyHtml = `
    <div style="font-size:13px;">
      <!-- 损益表 -->
      <div style="padding:12px;background:var(--bg-card);border-radius:8px;margin-bottom:12px;">
        <div style="font-size:14px;font-weight:bold;margin-bottom:8px;">📊 损益表（月度）</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;text-align:center;">
            <div style="font-size:10px;color:var(--text-muted);">月收入</div>
            <div style="font-size:14px;font-weight:bold;color:var(--success);">¥${monthlyRevenue.toLocaleString()}</div>
          </div>
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;text-align:center;">
            <div style="font-size:10px;color:var(--text-muted);">月支出</div>
            <div style="font-size:14px;font-weight:bold;color:var(--danger);">¥${monthlyExpenses.toLocaleString()}</div>
          </div>
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;text-align:center;">
            <div style="font-size:10px;color:var(--text-muted);">净利润</div>
            <div style="font-size:14px;font-weight:bold;color:${netIncome >= 0 ? "var(--success)" : "var(--danger)"};">¥${netIncome.toLocaleString()}</div>
          </div>
        </div>
        <div style="margin-top:8px;padding:6px;background:${profitMargin >= 0 ? "rgba(74,158,92,0.1)" : "rgba(231,76,60,0.1)"};border-radius:4px;font-size:11px;text-align:center;">
          利润率：${profitMargin.toFixed(1)}% ${profitMargin >= 0 ? "✅ 盈利" : "❌ 亏损"}
        </div>
      </div>

      <!-- 资产负债表 -->
      <div style="padding:12px;background:var(--bg-card);border-radius:8px;margin-bottom:12px;">
        <div style="font-size:14px;font-weight:bold;margin-bottom:8px;">💼 资产负债表</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;">
            <div style="font-size:10px;color:var(--text-muted);">现金储备</div>
            <div style="font-size:14px;font-weight:bold;">¥${Math.round(company.cashReserve).toLocaleString()}</div>
          </div>
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;">
            <div style="font-size:10px;color:var(--text-muted);">公司估值</div>
            <div style="font-size:14px;font-weight:bold;color:var(--accent);">¥${Math.round(company.valuation).toLocaleString()}</div>
          </div>
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;">
            <div style="font-size:10px;color:var(--text-muted);">Runway</div>
            <div style="font-size:14px;font-weight:bold;color:${company.monthsOfRunway > 3 ? "var(--success)" : "var(--danger)"};">${Math.round(company.monthsOfRunway)} 月</div>
          </div>
          <div style="padding:8px;background:var(--bg-secondary);border-radius:4px;">
            <div style="font-size:10px;color:var(--text-muted);">团队规模</div>
            <div style="font-size:14px;font-weight:bold;">${company.employees.length} 人</div>
          </div>
        </div>
      </div>

      <!-- 股权分布 -->
      <div style="padding:12px;background:var(--bg-card);border-radius:8px;">
        <div style="font-size:14px;font-weight:bold;margin-bottom:8px;">📈 股权分布</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:11px;">
          <div style="padding:4px 8px;background:var(--bg-secondary);border-radius:4px;">你：${Math.round(company.equity.player)}%</div>
          <div style="padding:4px 8px;background:var(--bg-secondary);border-radius:4px;">联合创始人：${Math.round(company.equity.coFounders)}%</div>
          <div style="padding:4px 8px;background:var(--bg-secondary);border-radius:4px;">员工期权：${Math.round(company.equity.employees)}%</div>
          <div style="padding:4px 8px;background:var(--bg-secondary);border-radius:4px;">投资人：${Math.round(company.equity.investors)}%</div>
        </div>
      </div>
    </div>
  `;

  if (typeof showModal !== "function") return { success: true };

  showModal({
    title: "📊 财务报表",
    body: bodyHtml,
    buttons: [
      {
        text: "关闭",
        cls: "",
        callback: function () {},
      },
    ],
  });

  return { success: true };
}

/** 团队管理弹窗 — 深度团队管理 */
function showTeamManagementModal(state) {
  const company = state.startup.company;
  if (!company) return { success: false, message: "没有公司" };

  const actions = [
    {
      id: "team_building",
      name: "团队建设",
      icon: "🎉",
      cost: 5000,
      desc: "组织团建活动，提升团队凝聚力",
      effect: "全员忠诚度+8，满意度+5",
    },
    {
      id: "training",
      name: "技能培训",
      icon: "📚",
      cost: 10000,
      desc: "安排专业技能培训",
      effect: "全员技能+3，生产力+5%",
    },
    {
      id: "one_on_one",
      name: "一对一谈话",
      icon: "💬",
      cost: 0,
      desc: "与关键员工一对一沟通",
      effect: "选择1名员工忠诚度+15",
    },
    {
      id: "performance_review",
      name: "绩效面谈",
      icon: "📋",
      cost: 0,
      desc: "进行季度绩效评估",
      effect: "显示员工绩效，可调整薪资",
    },
    {
      id: "salary_adjustment",
      name: "调薪",
      icon: "💰",
      cost: 0,
      desc: "为表现优秀的员工调薪",
      effect: "提升员工满意度和留存率",
    },
  ];

  const bodyHtml = `
    <div style="font-size:13px;">
      <p style="margin-bottom:12px;color:var(--text-secondary);">
        选择团队管理行动。团队管理是创业成功的关键！
      </p>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${actions
          .map(
            (act) => `
          <div style="padding:10px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <div style="font-size:13px;font-weight:bold;">${act.icon} ${act.name}</div>
              <div style="font-size:12px;color:${act.cost > 0 ? "var(--danger)" : "var(--success)"};">${act.cost > 0 ? "¥" + act.cost.toLocaleString() : "免费"}</div>
            </div>
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:2px;">${act.desc}</div>
            <div style="font-size:10px;color:var(--success);">效果：${act.effect}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;

  if (typeof showModal !== "function") return { success: true };

  showModal({
    title: "🎯 团队管理",
    body: bodyHtml,
    buttons: [
      {
        text: "执行团队管理",
        cls: "btn-primary",
        callback: function () {
          // 简化：默认执行团队建设
          if (company.cashReserve >= 5000) {
            company.cashReserve -= 5000;
            for (const emp of company.employees) {
              emp.loyalty = Math.min(100, emp.loyalty + 8);
              if (emp.satisfaction === undefined) emp.satisfaction = 50;
              emp.satisfaction = Math.min(100, emp.satisfaction + 5);
            }
            StateManager.addMessage(
              "🎉 团队建设完成！全员忠诚度+8，满意度+5",
              "success",
            );
            if (typeof renderAll === "function") renderAll();
          } else {
            StateManager.addMessage("现金不足，需要¥5,000", "warning");
          }
        },
      },
      {
        text: "关闭",
        cls: "",
        callback: function () {},
      },
    ],
  });

  return { success: true };
}

// ====== 执行创业行动 ======
function executeStartupAction(state, actionId, params) {
  params = params || {};

  switch (actionId) {
    case "develop_product":
      {
        const productId = params.productId;
        const effort = params.effort || 2;
        if (!productId) {
          // 自动选择第一个开发中的产品
          const company = state.startup.company;
          const developing = company?.products?.find(
            (p) => p.status === "developing",
          );
          if (!developing) {
            return { success: false, message: "没有正在开发的产品" };
          }
          return developProduct(state, developing.id, effort);
        }
        return developProduct(state, productId, effort);
      }
      break;

    case "create_product":
      return createProduct(state, params.name, params.category || "app");

    case "hire_employee":
      return hireEmployee(state, params.role || "engineer", params.salary);

    case "meet_investor":
      return showMeetInvestorModal(state);

    case "raise_funding":
      return raiseFunding(state, params.round || "seed");

    case "marketing":
      return showMarketingModal(state);

    case "review_financials":
      return showFinancialReportModal(state);

    case "manage_team":
      return showTeamManagementModal(state);

    case "ipo_prep":
      return prepareIPO(state);

    default:
      return { success: false, message: "未知行动：" + actionId };
  }
}

// ====== 功能模块开发弹窗 ======
function showFeatureDevelopmentModal(state) {
  const company = state.startup.company;
  if (!company) return;

  // 找已发布的产品
  const launchedProducts = company.products.filter(
    (p) => p.status === "launched",
  );
  if (launchedProducts.length === 0) {
    StateManager.addMessage("没有已发布的产品", "warning");
    return;
  }

  // 构建弹窗内容
  let html = '<div style="font-size:13px;max-height:60vh;overflow-y:auto;">';

  for (const product of launchedProducts) {
    const prodCategory = PRODUCT_CATEGORIES[product.category];
    const availableFeatures = getProductAvailableFeatures(product);

    html +=
      '<div style="margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border);">';
    html +=
      '<div style="font-weight:bold;color:var(--accent);margin-bottom:8px;">📦 ' +
      _esc(product.name) +
      ' <span style="font-size:10px;color:var(--text-muted);">(' +
      (prodCategory ? prodCategory.name : product.category) +
      ")</span></div>";

    if (availableFeatures.length === 0) {
      html +=
        '<div style="font-size:11px;color:var(--text-muted);">所有功能已开发完成 ✅</div>';
    } else {
      html +=
        '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">';
      for (const feat of availableFeatures) {
        const canAfford = company.cashReserve >= feat.cost;
        const onClick = canAfford
          ? "showDevelopFeatureConfirm('" +
            product.id +
            "','" +
            feat.key +
            "','" +
            feat.name +
            "'," +
            feat.cost +
            "," +
            feat.devTime +
            ")"
          : "";
        html +=
          '<div style="padding:8px;background:' +
          (canAfford ? "var(--bg-card)" : "rgba(0,0,0,0.1)") +
          ";border:1px solid " +
          (canAfford ? "var(--border)" : "#ccc") +
          ";border-radius:4px;" +
          (canAfford ? "cursor:pointer;transition:all 0.2s;" : "opacity:0.5;") +
          (canAfford
            ? "onmouseover=\"this.style.borderColor='var(--accent)';\" onmouseout=\"this.style.borderColor='var(--border)';\""
            : "") +
          (onClick ? 'onclick="' + onClick + '"' : "") +
          ">" +
          '<div style="font-weight:bold;font-size:12px;">' +
          (feat.icon || "") +
          " " +
          _esc(feat.name) +
          "</div>" +
          '<div style="font-size:10px;color:var(--text-muted);margin:2px 0;">' +
          _esc(feat.desc) +
          "</div>" +
          '<div style="font-size:10px;">💰 ¥' +
          feat.cost.toLocaleString() +
          " | ⏱ " +
          feat.devTime +
          "天 | 技术+" +
          feat.techBonus +
          " 市场+" +
          feat.marketBonus +
          "</div>" +
          "</div>";
      }
      html += "</div>";
    }
    html += "</div>";
  }

  html += "</div>";

  if (typeof showModal !== "function") return;

  showModal({
    title: "🔧 开发功能模块",
    body: html,
    buttons: [{ text: "关闭", cls: "", callback: function () {} }],
  });
}

/** 市场调研弹窗 */
function showMarketResearchModal(state) {
  const company = state.startup.company;
  if (!company) return;

  let html =
    '<div style="font-size:13px;">' +
    '<p style="color:var(--text-secondary);margin-bottom:12px;">选择调研深度，获取竞争对手情报和市场洞察。</p>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';

  const actions =
    typeof MARKET_INTELLIGENCE_ACTIONS !== "undefined"
      ? MARKET_INTELLIGENCE_ACTIONS
      : [];
  for (const action of actions) {
    const canAfford = company.cashReserve >= action.cost;
    html +=
      '<div style="padding:10px;background:' +
      (canAfford ? "var(--bg-card)" : "rgba(0,0,0,0.1)") +
      ";border:1px solid " +
      (canAfford ? "var(--border)" : "#ccc") +
      ";border-radius:6px;" +
      (canAfford ? "cursor:pointer;transition:all 0.2s;" : "opacity:0.5;") +
      'onclick="' +
      (canAfford ? "performMarketResearchClick('" + action.id + "')" : "") +
      '" onmouseover="' +
      (canAfford ? "this.style.borderColor='var(--accent)';" : "") +
      '" onmouseout="' +
      (canAfford ? "this.style.borderColor='var(--border)';" : "") +
      '">' +
      '<div style="font-weight:bold;font-size:12px;margin-bottom:4px;">' +
      _esc(action.name) +
      "</div>" +
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">' +
      _esc(action.desc) +
      "</div>" +
      '<div style="font-size:10px;color:var(--danger);">💰 ¥' +
      action.cost.toLocaleString() +
      "</div>" +
      '<div style="font-size:9px;color:var(--text-muted);margin-top:4px;">获得：' +
      action.info.join(", ") +
      "</div>" +
      "</div>";
  }

  html += "</div></div>";

  if (typeof showModal !== "function") return;

  showModal({
    title: "📊 市场调研",
    body: html,
    buttons: [{ text: "关闭", cls: "", callback: function () {} }],
  });
}

/** 执行市场调研（从弹窗调用） */
function performMarketResearchClick(actionId) {
  const state = StateManager.getState();
  const result =
    typeof performMarketResearch === "function"
      ? performMarketResearch(state, actionId)
      : { success: false, message: "功能未加载" };

  if (result.success) {
    StateManager.addMessage("✅ 市场调研完成", "success");
    // 显示报告
    if (typeof showModal !== "function") return;
    showModal({
      title: "📋 调研报告",
      body:
        '<div style="font-size:13px;max-height:50vh;overflow-y:auto;">' +
        '<div style="padding:12px;background:var(--bg-secondary);border-radius:6px;font-size:12px;line-height:1.6;">' +
        _esc(result.report) +
        "</div>" +
        '<div style="margin-top:8px;font-size:11px;color:var(--text-muted);">花费：¥' +
        (result.action ? result.action.cost.toLocaleString() : "0") +
        "</div>" +
        "</div>",
      buttons: [
        { text: "知道了", cls: "btn-primary", callback: function () {} },
      ],
    });
    renderAll();
  } else {
    StateManager.addMessage("⚠️ " + result.message, "warning");
  }
}

/** 显示功能开发确认弹窗 */
function showDevelopFeatureConfirm(
  productId,
  featureKey,
  featureName,
  cost,
  devTime,
) {
  const state = StateManager.getState();
  const company = state.startup.company;

  if (typeof showModal !== "function") return;

  showModal({
    title: "确认开发功能",
    body:
      '<div style="font-size:13px;">' +
      "<p>确定要开发 <strong>" +
      _esc(featureName) +
      "</strong> 吗？</p>" +
      '<div style="padding:8px;background:var(--bg-secondary);border-radius:4px;margin:8px 0;font-size:11px;">' +
      "💰 费用：¥" +
      cost.toLocaleString() +
      "<br>" +
      "⏱ 开发周期：" +
      devTime +
      "天<br>" +
      "💡 完成后：技术分+5~12，市场分+2~10" +
      "</div>" +
      '<p style="font-size:11px;color:var(--text-muted);">开发期间无法修改或取消。</p>' +
      "</div>",
    buttons: [
      { text: "取消", cls: "", callback: function () {} },
      {
        text: "确认开发",
        cls: "btn-primary",
        callback: function () {
          const result = developFeature(state, productId, featureKey);
          if (result.success) {
            StateManager.addMessage("✅ " + result.message, "success");
          } else {
            StateManager.addMessage("⚠️ " + result.message, "warning");
          }
          renderAll();
        },
      },
    ],
  });
}

// ====== UI: 渲染创业Tab ======
function renderStartupTab(state, parent) {
  parent.innerHTML = "";

  var startup = state.startup;
  if (!startup || startup.status === "none") {
    // 剧本感知的触发条件
    var stc = getStartupTriggerConditions(state);
    var cashLabel = "¥" + stc.cashRequired.toLocaleString();
    var rankLabel = stc.rankRequired ? stc.rankRequired + "+" : "不限";
    var phaseLabel =
      state.player && state.player.phase === "corporate" ? "职场" : "街头";
    var cashNow = (state.resources && state.resources.cash) || 0;
    var cashColor =
      cashNow >= stc.cashRequired ? "var(--success)" : "var(--danger)";
    var cashStatus = cashNow >= stc.cashRequired ? "✅" : "⚠️";

    parent.innerHTML =
      '<div style="padding:30px 20px;text-align:center;color:var(--text-muted);">' +
      "<h3>🚀 创业系统</h3>" +
      '<p style="font-size:13px;color:var(--text-secondary);">你还没有注册公司。注册后可以招聘、融资、做产品。</p>' +
      '<div style="margin:16px auto;padding:14px;max-width:360px;background:var(--bg-card);border-radius:8px;border:1px solid var(--border);text-align:left;font-size:12px;">' +
      '<div style="font-weight:600;margin-bottom:10px;color:var(--text-primary);">📋 ' +
      (stc.label || "注册条件") +
      "</div>" +
      '<div style="display:flex;justify-content:space-between;padding:3px 0;"><span>阶段</span><span>' +
      phaseLabel +
      "</span></div>" +
      '<div style="display:flex;justify-content:space-between;padding:3px 0;"><span>💰 最低现金</span><span style="color:' +
      cashColor +
      ';">' +
      cashStatus +
      " " +
      cashLabel +
      "（当前¥" +
      cashNow.toLocaleString() +
      "）</span></div>" +
      '<div style="display:flex;justify-content:space-between;padding:3px 0;"><span>🏢 职级要求</span><span>' +
      rankLabel +
      "</span></div>" +
      '<div style="display:flex;justify-content:space-between;padding:3px 0;border-top:1px solid var(--border);margin-top:4px;padding-top:5px;"><span>💵 注册费</span><span>¥50,000</span></div>' +
      "</div>" +
      '<button class="btn btn-lg btn-primary" onclick="showStartupRegisterModal()" ' +
      (cashNow >= 50000 ? "" : 'style="opacity:0.5;" disabled') +
      ">" +
      (cashNow >= 50000 ? "🚀 注册公司" : "🚀 注册公司（资金不足）") +
      "</button>" +
      '<div style="margin-top:12px;font-size:11px;color:var(--text-muted);">注册费 ¥50,000，不限阶段和天数，随时可注册</div>' +
      "</div>";
    return;
  }

  if (startup.flags.exited) {
    parent.innerHTML =
      '<div style="padding:40px;text-align:center;"><h3>📜 创业历史</h3><p>你的公司已经退出历史舞台。</p><p>退出类型：' +
      startup.flags.exitType +
      "</p><p>退出价值：¥" +
      (startup.flags.exitValue || 0).toLocaleString() +
      "</p></div>";
    return;
  }

  var company = startup.company;
  if (!company) {
    parent.innerHTML = "<p>公司数据异常</p>";
    return;
  }

  // 公司概览
  var industryInfo = STARTUP_INDUSTRIES[company.industry];
  var phaseIcon =
    company.phase === "seed" ? "🌱" : company.phase === "growth" ? "📈" : "🚀";
  var runwayColor =
    company.monthsOfRunway > 12
      ? "#4a9e5c"
      : company.monthsOfRunway > 3
        ? "#f59e0b"
        : "#ef4444";

  var overviewHtml =
    '<div style="margin-bottom:20px;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
    '<h3 style="margin:0;">' +
    phaseIcon +
    " 「" +
    company.name +
    "」</h3>" +
    '<span style="font-size:12px;color:var(--text-muted);">行业：' +
    (industryInfo
      ? industryInfo.name + " " + industryInfo.icon
      : company.industry) +
    "</span>" +
    "</div>" +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">' +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">阶段</div>' +
    '<div style="font-size:16px;font-weight:bold;">' +
    (company.phase === "seed"
      ? "种子期"
      : company.phase === "growth"
        ? "成长期"
        : "成熟期") +
    "</div>" +
    "</div>" +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">估值</div>' +
    '<div style="font-size:16px;font-weight:bold;color:var(--success);">¥' +
    Math.round(company.valuation).toLocaleString() +
    "</div>" +
    "</div>" +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">团队</div>' +
    '<div style="font-size:16px;font-weight:bold;">' +
    company.employees.length +
    " 人</div>" +
    "</div>" +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">Runway</div>' +
    '<div style="font-size:16px;font-weight:bold;color:' +
    runwayColor +
    ';">' +
    Math.round(company.monthsOfRunway) +
    " 月</div>" +
    "</div>" +
    "</div>" +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">现金储备</div>' +
    '<div style="font-size:14px;">¥' +
    Math.round(company.cashReserve).toLocaleString() +
    "</div>" +
    "</div>" +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">月收入</div>' +
    '<div style="font-size:14px;color:var(--success);">¥' +
    Math.round(company.revenue).toLocaleString() +
    "</div>" +
    "</div>" +
    '<div style="background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">月支出</div>' +
    '<div style="font-size:14px;color:var(--danger);">¥' +
    Math.round(company.expenses).toLocaleString() +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div style="margin-top:12px;background:var(--bg-card);padding:12px;border-radius:6px;">' +
    '<div style="font-size:11px;color:var(--text-muted);">股权</div>' +
    '<div style="display:flex;gap:16px;margin-top:4px;font-size:12px;">' +
    "<span>你：" +
    Math.round(company.equity.player) +
    "%</span>" +
    "<span>联合创始人：" +
    Math.round(company.equity.coFounders) +
    "%</span>" +
    "<span>员工期权：" +
    Math.round(company.equity.employees) +
    "%</span>" +
    "<span>投资人：" +
    Math.round(company.equity.investors) +
    "%</span>" +
    "</div>" +
    "</div>" +
    "</div>";

  parent.innerHTML = overviewHtml;

  // 产品列表
  if (company.products.length > 0) {
    var productsDiv = document.createElement("div");
    productsDiv.style.cssText = "margin-bottom:20px;";
    productsDiv.innerHTML = '<h4 style="margin:12px 0 8px;">📦 产品</h4>';

    for (var pi = 0; pi < company.products.length; pi++) {
      var product = company.products[pi];
      var prodCategory = PRODUCT_CATEGORIES[product.category];
      var statusIcon =
        product.status === "developing"
          ? "🔨"
          : product.status === "ready_to_launch"
            ? "🚀"
            : "✅";
      var statusText =
        product.status === "developing"
          ? "开发中"
          : product.status === "ready_to_launch"
            ? "待发布"
            : "已发布";

      var prodCard = document.createElement("div");
      prodCard.style.cssText =
        "background:var(--bg-card);padding:12px;margin-bottom:8px;border-radius:6px;";
      prodCard.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
        "<div>" +
        "<strong>" +
        statusIcon +
        " " +
        product.name +
        "</strong>" +
        '<span style="font-size:11px;color:var(--text-muted);margin-left:8px;">' +
        (prodCategory ? prodCategory.name : product.category) +
        "</span>" +
        "</div>" +
        '<span style="font-size:11px;color:var(--text-muted);">' +
        statusText +
        "</span>" +
        "</div>";

      if (product.status === "developing") {
        prodCard.innerHTML +=
          '<div style="margin-top:8px;">' +
          '<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;">' +
          "<span>开发进度</span>" +
          "<span>" +
          Math.round(product.developmentProgress) +
          "%</span>" +
          "</div>" +
          '<div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;">' +
          '<div style="height:100%;width:' +
          product.developmentProgress +
          '%;background:var(--accent);border-radius:3px;"></div>' +
          "</div>" +
          "</div>";
      } else if (product.status === "launched") {
        // 竞争力评分
        const compScore = product.competitiveness || 0;
        const compColor =
          compScore >= 70
            ? "var(--success)"
            : compScore >= 40
              ? "var(--warning)"
              : "var(--danger)";

        prodCard.innerHTML +=
          '<div style="margin-top:8px;font-size:11px;color:var(--text-muted);">' +
          "技术分：" +
          product.technologyScore +
          " | 市场分：" +
          product.marketScore +
          " | 竞争力：" +
          '<strong style="color:' +
          compColor +
          '">' +
          compScore +
          "</strong>" +
          " | 用户：" +
          (product.users || 0).toLocaleString() +
          " | 评分：" +
          (product.rating || 3.5).toFixed(1) +
          "★" +
          " | 月收入：¥" +
          Math.round(product.revenue).toLocaleString() +
          "</div>";

        // 功能模块列表
        if (product.features && product.features.length > 0) {
          let featuresHtml =
            '<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">';
          for (const feat of product.features) {
            const featDef = FEATURE_MODULES[feat.key];
            const featName = featDef ? featDef.name : feat.name;
            const featIcon = featDef ? featDef.icon : "";
            const featColor =
              feat.status === "completed" ? "var(--success)" : "var(--warning)";
            const featText =
              feat.status === "completed"
                ? "已完成"
                : "开发中" +
                  Math.round(
                    (1 - (feat.targetDay - state.player.day) / 15) * 100,
                  ) +
                  "%";
            featuresHtml +=
              '<span style="font-size:10px;padding:2px 6px;border-radius:3px;background:rgba(0,0,0,0.2);color:' +
              featColor +
              '">' +
              (featIcon || "") +
              " " +
              featName +
              " " +
              featText +
              "</span>";
          }
          featuresHtml += "</div>";
          prodCard.innerHTML += featuresHtml;
        }
      }

      productsDiv.appendChild(prodCard);
    }

    parent.appendChild(productsDiv);
  }

  // 团队列表
  if (company.employees.length > 0) {
    var teamDiv = document.createElement("div");
    teamDiv.style.cssText = "margin-bottom:20px;";
    teamDiv.innerHTML =
      '<h4 style="margin:12px 0 8px;">👥 团队（' +
      company.employees.length +
      "人）</h4>";

    for (var ei = 0; ei < company.employees.length; ei++) {
      var emp = company.employees[ei];
      var empRole = EMPLOYEE_ROLES[emp.role];
      var loyaltyColor =
        emp.loyalty > 60 ? "#4a9e5c" : emp.loyalty > 30 ? "#f59e0b" : "#ef4444";

      var empCard = document.createElement("div");
      empCard.style.cssText =
        "background:var(--bg-card);padding:8px 12px;margin-bottom:6px;border-radius:6px;font-size:13px;display:flex;justify-content:space-between;align-items:center;";
      empCard.innerHTML =
        "<span>" +
        (empRole ? empRole.icon : "") +
        " " +
        emp.name +
        "（" +
        (empRole ? empRole.name : emp.role) +
        "）</span>" +
        '<span style="font-size:11px;color:var(--text-muted);">月薪¥' +
        emp.salary.toLocaleString() +
        "</span>" +
        '<span style="font-size:11px;color:' +
        loyaltyColor +
        ';">忠诚度 ' +
        Math.round(emp.loyalty) +
        "%</span>";

      teamDiv.appendChild(empCard);
    }

    parent.appendChild(teamDiv);
  }

  // 融资历史
  if (company.fundingRounds.length > 0) {
    var fundingDiv = document.createElement("div");
    fundingDiv.style.cssText = "margin-bottom:20px;";
    fundingDiv.innerHTML = '<h4 style="margin:12px 0 8px;">💰 融资历史</h4>';

    for (var fi = 0; fi < company.fundingRounds.length; fi++) {
      var round = company.fundingRounds[fi];
      var roundDef = FUNDING_ROUNDS[round.round];
      var fundingCard = document.createElement("div");
      fundingCard.style.cssText =
        "background:var(--bg-card);padding:8px 12px;margin-bottom:6px;border-radius:6px;font-size:13px;";
      fundingCard.innerHTML =
        "<span>" +
        (roundDef ? roundDef.icon : "") +
        " " +
        (roundDef ? roundDef.name : round.round) +
        "轮</span>" +
        '<span style="font-size:11px;color:var(--text-muted);">融资金额：¥' +
        round.amount.toLocaleString() +
        "</span>" +
        '<span style="font-size:11px;color:var(--text-muted);">出让 ' +
        round.equityDilution +
        "%</span>" +
        '<span style="font-size:11px;color:var(--success);">投后估值：¥' +
        round.postValuation.toLocaleString() +
        "</span>";

      fundingDiv.appendChild(fundingCard);
    }

    parent.appendChild(fundingDiv);
  }

  // 竞争对手情报（Phase 4）
  if (state.startup.competitors && state.startup.competitors.length > 0) {
    var compDiv = document.createElement("div");
    compDiv.style.cssText = "margin-bottom:20px;";
    compDiv.innerHTML = '<h4 style="margin:12px 0 8px;">👥 竞争对手</h4>';

    // 市场份额
    var marketShare =
      typeof calculateMarketShare === "function"
        ? calculateMarketShare(state, company, state.startup.competitors)
        : 0;
    var brandLevel =
      typeof getBrandLevel === "function"
        ? getBrandLevel(company.reputation)
        : null;

    compDiv.innerHTML +=
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px;">' +
      '<div style="background:var(--bg-card);padding:10px;border-radius:6px;text-align:center;">' +
      '<div style="font-size:10px;color:var(--text-muted);">市场份额</div>' +
      '<div style="font-size:18px;font-weight:bold;color:var(--accent);">' +
      marketShare +
      "%</div>" +
      "</div>" +
      '<div style="background:var(--bg-card);padding:10px;border-radius:6px;text-align:center;">' +
      '<div style="font-size:10px;color:var(--text-muted);">品牌等级</div>' +
      '<div style="font-size:18px;font-weight:bold;color:var(--success);">' +
      (brandLevel ? brandLevel.icon + brandLevel.name : "未知") +
      "</div>" +
      "</div>" +
      "</div>";

    for (var ci = 0; ci < state.startup.competitors.length; ci++) {
      var comp = state.startup.competitors[ci];
      var compCard = document.createElement("div");
      compCard.style.cssText =
        "background:var(--bg-card);padding:10px;margin-bottom:6px;border-radius:6px;font-size:13px;border-left:3px solid " +
        (comp.trend === "up" ? "var(--success)" : "var(--border)");
      compCard.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
        "<div>" +
        "<strong>" +
        _esc(comp.name) +
        "</strong>" +
        '<span style="font-size:10px;color:var(--text-muted);margin-left:6px;">· ' +
        (comp.focus || "") +
        "</span>" +
        "</div>" +
        '<span style="font-size:10px;color:' +
        (comp.trend === "up" ? "var(--success)" : "var(--text-muted)") +
        ';">' +
        (comp.trend === "up" ? "📈" : "➡️") +
        "</span>" +
        "</div>" +
        '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">' +
        "估值：¥" +
        Math.round(comp.valuation).toLocaleString() +
        " | 团队：" +
        comp.employees +
        "人" +
        " | 技术：" +
        Math.round(comp.technologyScore) +
        " | 市场：" +
        Math.round(comp.marketScore) +
        "</div>";
      compDiv.appendChild(compCard);
    }

    parent.appendChild(compDiv);
  }

  // 行动按钮区域
  var actionsDiv = document.createElement("div");
  actionsDiv.style.cssText =
    "margin-top:20px;padding-top:16px;border-top:1px solid var(--border);";
  actionsDiv.innerHTML = '<h4 style="margin:12px 0 8px;">⚡ 创业行动</h4>';

  var actions = getAvailableStartupActions(state);
  for (var ai = 0; ai < actions.length; ai++) {
    var action = actions[ai];
    var actionBtn = document.createElement("button");
    actionBtn.className = "btn btn-sm";
    actionBtn.style.cssText =
      "margin-right:8px;margin-bottom:8px;" +
      (action.available ? "" : "opacity:0.5;cursor:not-allowed;");
    actionBtn.innerHTML =
      action.icon +
      " " +
      action.name +
      (action.apCost ? " ⚡" + action.apCost : "");
    actionBtn.disabled = !action.available;
    actionBtn.onclick = (function (act) {
      return function () {
        var result = executeStartupAction(state, act.id, {});
        if (!result.success) {
          StateManager.addMessage(result.message || "操作失败", "warning");
        }
        renderStartupTab(state, parent);
        renderSidebar(state);
      };
    })(action);
    actionsDiv.appendChild(actionBtn);
  }

  // 开发功能模块按钮
  if (company.products.some((p) => p.status === "launched")) {
    var featBtn = document.createElement("button");
    featBtn.className = "btn btn-sm btn-primary";
    featBtn.style.cssText = "margin-right:8px;margin-bottom:8px;";
    featBtn.innerHTML = "🔧 开发功能模块";
    featBtn.onclick = function () {
      showFeatureDevelopmentModal(state);
      renderStartupTab(state, parent);
      renderSidebar(state);
    };
    actionsDiv.appendChild(featBtn);
  }

  // 市场调研按钮
  if (state.startup.competitors && state.startup.competitors.length > 0) {
    var researchBtn = document.createElement("button");
    researchBtn.className = "btn btn-sm btn-warning";
    researchBtn.style.cssText = "margin-right:8px;margin-bottom:8px;";
    researchBtn.innerHTML = "📊 市场调研";
    researchBtn.onclick = function () {
      showMarketResearchModal(state);
      renderStartupTab(state, parent);
      renderSidebar(state);
    };
    actionsDiv.appendChild(researchBtn);
  }

  parent.appendChild(actionsDiv);

  // ====== 特殊按钮区域：IPO 审核结果 / 收购要约 ======
  if (startup.flags.ipoFiled && startup.status === "ipo_preparing") {
    // IPO 审核中：显示等待消息
    var ipoWaitDiv = document.createElement("div");
    ipoWaitDiv.style.cssText =
      "margin-top:16px;padding:12px;background:rgba(245,158,11,0.1);border-radius:6px;border:1px solid rgba(245,158,11,0.3);";
    ipoWaitDiv.innerHTML =
      '<span style="color:var(--warning);">🔔 IPO 审核中，等待监管结果（通常 3-5 天）</span>';
    parent.appendChild(ipoWaitDiv);
  }

  // 收购要约
  if (startup.pendingAcquisitionOffer && !startup.flags.exited) {
    var offer = startup.pendingAcquisitionOffer;
    var offerDiv = document.createElement("div");
    offerDiv.style.cssText =
      "margin-top:16px;padding:12px;background:rgba(46,204,113,0.1);border-radius:6px;border:1px solid rgba(46,204,113,0.3);";
    offerDiv.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;">' +
      "<div>" +
      '<span style="color:var(--success);font-weight:bold;">🤝 「' +
      _esc(offer.acquirerName) +
      "」提出收购要约</span>" +
      '<span style="font-size:11px;color:var(--text-muted);margin-left:8px;">报价 ¥' +
      offer.offerValue.toLocaleString() +
      "（" +
      offer.offerMultiplier.toFixed(2) +
      "x 估值）| 你获得 ¥" +
      offer.playerShareValue.toLocaleString() +
      "</span>" +
      "</div>" +
      '<button class="btn btn-sm btn-success" onclick="showAcquisitionModal(StateManager.getState(), startup.pendingAcquisitionOffer);">查看/决策</button>' +
      "</div>";
    parent.appendChild(offerDiv);
  }
}

// ====== 导出 ======
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    STARTUP_INDUSTRIES,
    EMPLOYEE_ROLES,
    FUNDING_ROUNDS,
    INVESTOR_TYPES,
    PRODUCT_CATEGORIES,
    registerStartup,
    createProduct,
    developProduct,
    launchProduct,
    hireEmployee,
    fireEmployee,
    getEligibleRounds,
    raiseFunding,
    tickStartup,
    prepareIPO,
    processIPOResult,
    getAcquisitionOffer,
    acceptAcquisition,
    showAcquisitionModal,
    bankrupt,
    getStartupSummary,
    getAvailableStartupActions,
    executeStartupAction,
    renderStartupTab,
    // 深度交互弹窗
    showMeetInvestorModal,
    showMarketingModal,
    showFinancialReportModal,
    showTeamManagementModal,
    generateInvestorFeedback,
  };
}
