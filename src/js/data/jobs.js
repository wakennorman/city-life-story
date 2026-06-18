/**
 * 街头工作定义（15+种）
 *
 * 每项工作格式:
 * {
 *   id, name, desc, icon,                    // 显示
 *   location: '...',                          // 需要在此地点
 *   requirements: { ... },                    // 属性/技能/年龄要求
 *   effects: { ... },                         // 执行后属性变化
 *   payCalc(state),                           // 收入计算函数（引用 state）
 *   risk: { injury, illness },                // 风险概率
 *   startupCost: 0,                           // 启动资金（可选）
 * }
 */

const STREET_JOBS = [
  // ====== 城中村 ======
  {
    id: "waste_recycling",
    name: "废品回收",
    desc: "走街串巷收废纸板、废金属、废塑料，转手卖给回收站。脏活累活但门槛最低。",
    icon: "♻️",
    location: "slum",
    requirements: { minAge: 16, maxAge: 65 },
    effects: {
      fatigue: 22,
      hygiene: -15,
      happiness: -5,
      physiqueXp: 2,
      agilityXp: 1,
    },
    payCalc(state) {
      const base = 20 + Math.random() * 35;
      const multi = 1 + state.skills.sales.level * 0.005;
      return Math.floor(base * Math.min(multi, 2));
    },
    risk: { injury: 0.04, illness: 0.03 },
  },

  // ====== 街头摆摊（多地点，收益受客流量影响）======
  {
    id: "street_vending_food",
    name: "摆摊卖小吃",
    desc: "在街边支个小摊卖烤串、煎饼果子。客流量越大，手艺越好，赚得越多。",
    icon: "🍢",
    location: "commercialDist",
    requirements: { minAge: 16, maxAge: 60 },
    effects: { fatigue: 16, hygiene: -5, happiness: 3, cookingXp: 4 },
    payCalc(state) {
      const skillBonus = state.skills.cooking.level * 0.8;
      const base = 45 + skillBonus + Math.random() * 35;
      const footfall =
        typeof getVendingFootfallMod === "function"
          ? getVendingFootfallMod(state.trade.currentLocation, state)
          : 1.0;
      return Math.floor(base * footfall);
    },
    startupCost: 50,
    risk: {},
  },
  {
    id: "street_vending_goods",
    name: "摆摊卖小商品",
    desc: "从批发市场进些日用品、小电子产品，在各地摆摊赚差价。",
    icon: "🧦",
    location: "commercialDist",
    requirements: { minAge: 16, maxAge: 60 },
    effects: { fatigue: 14, happiness: 2, salesXp: 3 },
    payCalc(state) {
      const skillBonus = state.skills.sales.level * 0.6;
      const base = 38 + skillBonus + Math.random() * 28;
      const footfall =
        typeof getVendingFootfallMod === "function"
          ? getVendingFootfallMod(state.trade.currentLocation, state)
          : 1.0;
      return Math.floor(base * footfall);
    },
    startupCost: 30,
    risk: { injury: 0.02 },
  },

  // ====== 建筑工地 ======
  {
    id: "manual_labor_construction",
    name: "建筑工地苦力",
    desc: "在工地搬砖、扛水泥、推砂石。纯体力活，工资日结不拖欠。",
    icon: "🧱",
    location: "construction",
    requirements: { physique: 20, minAge: 18, maxAge: 55 },
    effects: { fatigue: 38, hygiene: -22, physiqueXp: 6, happiness: -10 },
    payCalc(state) {
      const weldBonus =
        typeof getConstructionBonus === "function"
          ? getConstructionBonus(state.skills.welding.level || 0)
          : 0;
      const bossBonus = state.flags && state.flags.bossLiSkillJob ? 1.2 : 1.0;
      return Math.floor(
        (65 + state.player.physique * 0.5 + Math.random() * 30) *
          (1 + weldBonus) *
          bossBonus,
      );
    },
    risk: { injury: 0.1, illness: 0.04 },
  },
  {
    id: "skilled_labor_construction",
    name: "工地技术工",
    desc: "会手艺的工地活——水电安装、木工、钢筋工。收入比苦力高不少。",
    icon: "🔨",
    location: "construction",
    requirements: {
      physique: 25,
      repair: 15,
      agility: 20,
      minAge: 20,
      maxAge: 60,
    },
    effects: {
      fatigue: 28,
      hygiene: -12,
      physiqueXp: 3,
      repairXp: 5,
      weldingXp: 2,
    },
    payCalc(state) {
      const weldBonus =
        typeof getConstructionBonus === "function"
          ? getConstructionBonus(state.skills.welding.level || 0)
          : 0;
      const bossBonus = state.flags && state.flags.bossLiSkillJob ? 1.2 : 1.0;
      return Math.floor(
        (120 +
          state.skills.repair.level * 1.2 +
          state.player.physique * 0.25 +
          Math.random() * 35) *
          (1 + weldBonus) *
          bossBonus,
      );
    },
    risk: { injury: 0.05 },
  },
  {
    id: "premium_engineering",
    name: "🏗️ 正规工程队（李工头推荐）",
    desc: "李工头介绍的正规建筑公司，工资两倍、有工伤险，活儿也相对规范。",
    icon: "🏗️",
    location: "construction",
    requirements: { physique: 30, minAge: 20, maxAge: 60 },
    requiredFlag: "bossLiReferred",
    effects: {
      fatigue: 22,
      hygiene: -8,
      physiqueXp: 3,
      repairXp: 5,
      weldingXp: 3,
    },
    payCalc(state) {
      const weldBonus =
        typeof getConstructionBonus === "function"
          ? getConstructionBonus(state.skills.welding.level || 0)
          : 0;
      return Math.floor(
        (220 +
          state.player.physique * 0.8 +
          state.skills.repair.level * 1.5 +
          Math.random() * 60) *
          (1 + weldBonus),
      );
    },
    risk: { injury: 0.03 },
  },
  {
    id: "restaurant_assistant",
    name: "🍳 帮陈师傅打下手",
    desc: "在陈师傅餐厅打下手，学做菜的同时赚点辛苦钱。",
    icon: "🍳",
    location: "commercialDist",
    requirements: { minAge: 16 },
    requiredFlag: "chefChenAssistant",
    effects: { fatigue: 20, hygiene: -5, cookingXp: 12, happiness: 5 },
    payCalc(state) {
      const cookBonus =
        typeof getCookingDiscount === "function"
          ? Math.floor(state.skills.cooking.level * 0.5)
          : 0;
      return Math.floor(50 + cookBonus + Math.random() * 30);
    },
    risk: {},
  },

  // ====== 工业区 — 工厂 ======
  {
    id: "factory_work_assembly",
    name: "工厂流水线",
    desc: "在电子厂做装配工。机械重复手不停，但收入稳定包吃住。",
    icon: "🏭",
    location: "factoryZone",
    requirements: { agility: 15, minAge: 18, maxAge: 45 },
    effects: {
      fatigue: 28,
      hygiene: -5,
      happiness: -15,
      mental: -2,
      agilityXp: 3,
      electricianXp: 2,
    },
    payCalc(state) {
      const elecBonus =
        typeof getFactoryBonus === "function"
          ? getFactoryBonus(state.skills.electrician.level || 0)
          : 0;
      return Math.floor(
        (80 + state.player.agility * 0.3 + Math.random() * 18) *
          (1 + elecBonus),
      );
    },
    risk: { injury: 0.03, illness: 0.02 },
  },
  {
    id: "factory_overtime",
    name: "工厂加班",
    desc: "晚上加班赶订单，加班费可观，但这钱是用身体换的。",
    icon: "🌙",
    location: "factoryZone",
    requirements: { agility: 15, physique: 18, minAge: 18, maxAge: 45 },
    effects: {
      fatigue: 42,
      hygiene: -3,
      happiness: -20,
      mental: -4,
      electricianXp: 3,
    },
    payCalc(state) {
      const elecBonus =
        typeof getFactoryBonus === "function"
          ? getFactoryBonus(state.skills.electrician.level || 0)
          : 0;
      return Math.floor(
        (115 + state.player.physique * 0.4 + Math.random() * 25) *
          (1 + elecBonus),
      );
    },
    risk: { illness: 0.06 },
  },

  // ====== 商业区 — 餐饮服务 ======
  {
    id: "food_stall",
    name: "餐饮摊贩",
    desc: "租个小摊位卖早餐、夜宵。辛苦但利润不错，手艺好能赚更多。",
    icon: "🍜",
    location: "commercialDist",
    requirements: { cooking: 10, minAge: 18, maxAge: 55 },
    effects: { fatigue: 22, hygiene: -8, cookingXp: 5, happiness: 2 },
    payCalc(state) {
      const base = 95 + state.skills.cooking.level * 1.5 + Math.random() * 50;
      const footfall =
        typeof getVendingFootfallMod === "function"
          ? getVendingFootfallMod(state.trade.currentLocation, state)
          : 1.0;
      return Math.floor(base * footfall);
    },
    startupCost: 200,
    risk: { injury: 0.02 },
  },

  // ====== 商业区 — 服务业 ======
  {
    id: "barber",
    name: "理发师",
    desc: "在街边理发店做理发师。手艺活，环境干净，收入稳定。",
    icon: "💇",
    location: "commercialDist",
    requirements: { agility: 20, sales: 5, minAge: 18, maxAge: 60 },
    effects: { fatigue: 16, happiness: 5, agilityXp: 2, salesXp: 3 },
    payCalc(state) {
      return Math.floor(
        48 +
          state.player.agility * 0.25 +
          state.skills.sales.level * 0.5 +
          Math.random() * 32,
      );
    },
    risk: {},
  },
  {
    id: "cleaning_service",
    name: "保洁/家政",
    desc: "帮人打扫卫生、收拾屋子。活不重，收入不高但稳定。",
    icon: "🧹",
    location: "commercialDist",
    requirements: { minAge: 18, maxAge: 55 },
    effects: { fatigue: 20, hygiene: -8, physiqueXp: 2 },
    payCalc(state) {
      return Math.floor(40 + state.player.physique * 0.15 + Math.random() * 25);
    },
    risk: {},
  },
  {
    id: "repair_service",
    name: "家电维修",
    desc: "帮人修家电、手机、电脑。技术活，口碑好了收入越来越高。",
    icon: "🔧",
    location: "commercialDist",
    requirements: { repair: 20, intelligence: 20, minAge: 18, maxAge: 65 },
    effects: { fatigue: 14, repairXp: 5, happiness: 8 },
    payCalc(state) {
      return Math.floor(
        65 + state.skills.repair.level * 2.0 + Math.random() * 42,
      );
    },
    risk: {},
  },

  // ====== 工业区 ======
  {
    id: "security_guard",
    name: "保安",
    desc: "在工厂或小区看大门。活不多，能坐着，但工资不高。",
    icon: "👮",
    location: "factoryZone",
    requirements: { minAge: 20, maxAge: 55 },
    effects: { fatigue: 10, happiness: -3, physiqueXp: 1 },
    payCalc(state) {
      return Math.floor(32 + Math.random() * 18);
    },
    risk: {},
  },
  {
    id: "warehouse_worker",
    name: "仓库搬运",
    desc: "在物流仓库搬货、分拣包裹。体力消耗大但按件计酬。",
    icon: "📦",
    location: "factoryZone",
    requirements: { physique: 18, minAge: 18, maxAge: 50 },
    effects: { fatigue: 32, hygiene: -10, physiqueXp: 4 },
    payCalc(state) {
      return Math.floor(58 + state.player.physique * 0.4 + Math.random() * 25);
    },
    risk: { injury: 0.05 },
  },

  // ====== 医院 ======
  {
    id: "hospital_caregiver",
    name: "临时陪诊护工",
    desc: "在医院帮病人挂号、取药、陪检。需要耐心和体力，流感季需求会暴涨。",
    icon: "🏥",
    location: "hospital",
    requirements: { physique: 18, mental: 22, minAge: 18, maxAge: 60 },
    effects: {
      fatigue: 30,
      hygiene: -10,
      happiness: 4,
      mental: -2,
      physiqueXp: 2,
      salesXp: 2,
    },
    payCalc(state) {
      return Math.floor(
        72 +
          state.player.mental * 0.45 +
          state.player.physique * 0.25 +
          Math.random() * 42,
      );
    },
    risk: { illness: 0.08 },
  },

  // ====== 大学城 ======
  {
    id: "school_maintenance",
    name: "学校勤杂工",
    desc: "在学校做维修、绿化、清洁等杂活。环境好，氛围轻松。",
    icon: "🏫",
    location: "school",
    requirements: { minAge: 18, maxAge: 60 },
    effects: { fatigue: 16, hygiene: -5, happiness: 8, repairXp: 2 },
    payCalc(state) {
      return Math.floor(42 + Math.random() * 22);
    },
    risk: {},
  },
  {
    id: "package_delivery",
    name: "校园/社区快递",
    desc: "帮学生和社区居民收发快递包裹。腿脚麻利跑得快是核心竞争力。",
    icon: "📬",
    location: "school",
    requirements: { agility: 15, minAge: 18, maxAge: 50 },
    effects: { fatigue: 24, hygiene: -5, agilityXp: 4 },
    payCalc(state) {
      return Math.floor(40 + state.player.agility * 0.4 + Math.random() * 25);
    },
    risk: { injury: 0.03 },
  },
  {
    id: "tutoring",
    name: "家教",
    desc: "给中小学生辅导功课。知识就是金钱，智力越高收入越好。需要本科学历。",
    icon: "📖",
    location: "school",
    requirements: { intelligence: 30, minAge: 18, maxAge: 65 },
    educationRequired: 1,
    effects: { fatigue: 12, intelligenceXp: 3, englishXp: 2, happiness: 10 },
    payCalc(state) {
      return Math.floor(
        62 +
          state.player.intelligence * 0.45 +
          state.skills.english.level * 0.3 +
          Math.random() * 32,
      );
    },
    risk: {},
  },

  // ====== 商业区 — 更多 ======
  {
    id: "delivery_rider",
    name: "外卖骑手",
    desc: "平台众包骑手，接单送餐。多劳多得，风里来雨里去。",
    icon: "🛵",
    location: "commercialDist",
    requirements: { agility: 22, minAge: 18, maxAge: 45 },
    effects: { fatigue: 34, hygiene: -8, agilityXp: 5, happiness: -5 },
    payCalc(state) {
      return Math.floor(50 + state.player.agility * 0.7 + Math.random() * 50);
    },
    risk: { injury: 0.07 },
  },
  {
    id: "street_performer",
    name: "街头卖艺",
    desc: "在天桥或广场表演才艺。脸皮要厚，观众打赏全看心情。",
    icon: "🎸",
    location: "commercialDist",
    requirements: { mental: 30, minAge: 16, maxAge: 60 },
    effects: { fatigue: 12, happiness: 18, mental: 2, fame: 3 },
    payCalc(state) {
      return Math.floor(
        18 +
          state.player.mental * 0.2 +
          state.status.fame * 0.3 +
          Math.random() * 42,
      );
    },
    risk: {},
  },

  // ====== 科技园 — 需要学历 ======
  {
    id: "data_entry",
    name: "数据录入员",
    desc: "在科技公司做基础数据录入整理。大专学历起步，入门白领工作。",
    icon: "💻",
    location: "techPark",
    requirements: { intelligence: 18, minAge: 18, maxAge: 45 },
    educationRequired: 0,
    effects: { fatigue: 14, happiness: 5, intelligenceXp: 2, happiness: 8 },
    payCalc(state) {
      return Math.floor(
        70 + state.player.intelligence * 0.4 + Math.random() * 30,
      );
    },
    risk: {},
  },
  {
    id: "customer_service_tech",
    name: "科技客服专员",
    desc: "在互联网公司做线上客服，处理用户投诉和咨询。需要本科学历，薪资比普通体力活高一档。",
    icon: "🎧",
    location: "techPark",
    requirements: { intelligence: 25, mental: 20, minAge: 18, maxAge: 40 },
    educationRequired: 1,
    effects: {
      fatigue: 16,
      happiness: 3,
      mental: -2,
      intelligenceXp: 3,
      salesXp: 2,
    },
    payCalc(state) {
      const engBonus = state.skills.english
        ? state.skills.english.level * 0.3
        : 0;
      return Math.floor(
        95 + state.player.intelligence * 0.6 + engBonus + Math.random() * 40,
      );
    },
    risk: {},
  },
  {
    id: "content_writing",
    name: "内容创作者",
    desc: "给平台和公众号写文章、做内容。要有文字功底和英语能力，本科以上学历优先。",
    icon: "✍️",
    location: "techPark",
    requirements: { intelligence: 30, english: 15, minAge: 18, maxAge: 50 },
    educationRequired: 1,
    effects: {
      fatigue: 12,
      happiness: 12,
      intelligenceXp: 4,
      englishXp: 3,
      mental: 1,
    },
    payCalc(state) {
      const engBonus = state.skills.english
        ? state.skills.english.level * 0.8
        : 0;
      const intBonus = state.player.intelligence * 0.7;
      return Math.floor(85 + intBonus + engBonus + Math.random() * 50);
    },
    risk: {},
  },
  {
    id: "junior_analyst",
    name: "初级数据分析师",
    desc: "用Excel/表格做市场数据分析，输出报告。高学历高智力才能胜任，但薪资也是街头最高档。",
    icon: "📊",
    location: "techPark",
    requirements: { intelligence: 40, minAge: 20, maxAge: 45 },
    educationRequired: 1,
    effects: { fatigue: 18, intelligenceXp: 5, happiness: 5 },
    payCalc(state) {
      return Math.floor(
        130 + state.player.intelligence * 1.2 + Math.random() * 60,
      );
    },
    risk: {},
  },
];

// ====== P2#12 技能树分支解锁工作 ======
// 这些工作需要特定技能分支才能看到/执行
(function() {
  var BRANCH_JOBS = [
    // === cooking → 家常大厨 ===
    {
      id: "cafeteria_worker",
      name: "食堂帮厨",
      desc: "在企事业单位食堂帮厨，切菜配菜打饭。稳定轻松，比街边摊环境好。",
      icon: "🥘",
      location: "commercialDist",
      requirements: { cooking: 30, minAge: 18, maxAge: 55 },
      branchRequirement: { skill: "cooking", branch: "home_chef" },
      effects: { fatigue: 14, hygiene: -3, happiness: 5, cookingXp: 6 },
      payCalc(state) {
        var base = 70 + (state.skills.cooking.level || 0) * 1.0 + Math.random() * 35;
        var branchBonus = 1.25;
        if (typeof getBranchJobBonus === "function") {
          branchBonus = getBranchJobBonus("cafeteria_worker", "cooking", state);
        }
        return Math.floor(base * branchBonus);
      },
      risk: {},
    },
    // === repair → 精密维修 ===
    {
      id: "instrument_repair",
      name: "仪器仪表维修",
      desc: "维修精密测量仪器、实验室设备。技术含量高，收入可观。",
      icon: "🔬",
      location: "techPark",
      requirements: { repair: 35, intelligence: 30, minAge: 20, maxAge: 60 },
      branchRequirement: { skill: "repair", branch: "precision_repair" },
      effects: { fatigue: 12, repairXp: 8, happiness: 8, intelligenceXp: 2 },
      payCalc(state) {
        var base = 100 + (state.skills.repair.level || 0) * 2.5 + Math.random() * 50;
        var branchBonus = typeof getBranchJobBonus === "function" ? getBranchJobBonus("instrument_repair", "repair", state) : 1.0;
        return Math.floor(base * branchBonus);
      },
      risk: {},
    },
    // === repair → 改装达人 ===
    {
      id: "phone_modding",
      name: "手机改装",
      desc: "帮客户改装手机——换壳、扩容、改色。年轻客户多，利润不错。",
      icon: "📱",
      location: "commercialDist",
      requirements: { repair: 30, agility: 20, minAge: 18, maxAge: 50 },
      branchRequirement: { skill: "repair", branch: "modder" },
      effects: { fatigue: 10, repairXp: 6, happiness: 10, salesXp: 2 },
      payCalc(state) {
        var base = 80 + (state.skills.repair.level || 0) * 1.8 + Math.random() * 40;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("phone_modding", "repair", state) : 1.0));
      },
      risk: {},
    },
    // === coding → 前端开发 ===
    {
      id: "web_designer",
      name: "网页设计师",
      desc: "帮小公司做网页设计制作。学了前端正好用上，按项目计酬。",
      icon: "🎨",
      location: "techPark",
      requirements: { coding: 35, intelligence: 28, minAge: 18 },
      branchRequirement: { skill: "coding", branch: "frontend_dev" },
      effects: { fatigue: 10, codingXp: 8, happiness: 12, intelligenceXp: 2 },
      payCalc(state) {
        var base = 110 + (state.skills.coding.level || 0) * 2.0 + Math.random() * 55;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("web_designer", "coding", state) : 1.0));
      },
      risk: {},
    },
    // === coding → 后端架构 ===
    {
      id: "server_ops",
      name: "服务器运维",
      desc: "维护公司服务器、数据库。夜班少，工作稳定，是技术岗的敲门砖。",
      icon: "⚙️",
      location: "techPark",
      requirements: { coding: 40, intelligence: 32, minAge: 20 },
      branchRequirement: { skill: "coding", branch: "backend_arch" },
      effects: { fatigue: 12, codingXp: 10, happiness: 5, intelligenceXp: 3 },
      payCalc(state) {
        var base = 130 + (state.skills.coding.level || 0) * 2.5 + Math.random() * 50;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("server_ops", "coding", state) : 1.0));
      },
      risk: {},
    },
    // === coding → 安全攻防 ===
    {
      id: "network_monitor",
      name: "网络安全监控",
      desc: "监控公司网络安全状况，排查异常流量。责任重大，薪资丰厚。",
      icon: "🔒",
      location: "techPark",
      requirements: { coding: 35, intelligence: 30, mental: 25, minAge: 20 },
      branchRequirement: { skill: "coding", branch: "security" },
      effects: { fatigue: 14, codingXp: 8, happiness: 8, mental: 1 },
      payCalc(state) {
        var base = 120 + (state.skills.coding.level || 0) * 2.2 + Math.random() * 45;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("network_monitor", "coding", state) : 1.0));
      },
      risk: {},
    },
    // === english → 商务英语 ===
    {
      id: "foreign_trade_assistant",
      name: "外贸助理",
      desc: "在外贸公司协助处理订单、邮件往来。英语好是核心竞争力。",
      icon: "📦",
      location: "commercialDist",
      requirements: { english: 30, intelligence: 25, minAge: 20 },
      branchRequirement: { skill: "english", branch: "business_english" },
      effects: { fatigue: 14, englishXp: 7, happiness: 10, intelligenceXp: 2 },
      payCalc(state) {
        var base = 90 + (state.skills.english.level || 0) * 1.5 + Math.random() * 40;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("foreign_trade_assistant", "english", state) : 1.0));
      },
      risk: {},
    },
    // === english → 翻译达人 ===
    {
      id: "document_translator",
      name: "文档翻译",
      desc: "接翻译公司的文档翻译单子。自由职业，在家也能做，时间灵活。",
      icon: "📝",
      location: "school",
      requirements: { english: 35, intelligence: 28, minAge: 18 },
      branchRequirement: { skill: "english", branch: "translation" },
      effects: { fatigue: 8, englishXp: 8, happiness: 15, intelligenceXp: 1 },
      payCalc(state) {
        var base = 80 + (state.skills.english.level || 0) * 2.0 + Math.random() * 40;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("document_translator", "english", state) : 1.0));
      },
      risk: {},
    },
    // === driving → 客运驾驶 ===
    {
      id: "taxi_driver",
      name: "出租车司机",
      desc: "开出租拉客，多劳多得。驾龄越长路线越熟，赚得越多。",
      icon: "🚕",
      location: "commercialDist",
      requirements: { driving: 30, minAge: 20, maxAge: 55 },
      branchRequirement: { skill: "driving", branch: "passenger_transport" },
      effects: { fatigue: 28, drivingXp: 6, happiness: 3, agilityXp: 2 },
      payCalc(state) {
        var base = 70 + (state.skills.driving.level || 0) * 1.2 + Math.random() * 45;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("taxi_driver", "driving", state) : 1.0));
      },
      risk: { injury: 0.03 },
    },
    // === driving → 货运驾驶 ===
    {
      id: "truck_assistant",
      name: "跟车助理",
      desc: "跟货车跑运输，负责装卸货和单据交接。体力活但收入稳定。",
      icon: "🚚",
      location: "factoryZone",
      requirements: { driving: 25, physique: 20, minAge: 20, maxAge: 50 },
      branchRequirement: { skill: "driving", branch: "freight" },
      effects: { fatigue: 30, drivingXp: 5, physiqueXp: 3 },
      payCalc(state) {
        var base = 80 + (state.skills.driving.level || 0) * 1.0 + Math.random() * 35;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("truck_assistant", "driving", state) : 1.0));
      },
      risk: { injury: 0.05 },
    },
    // === sales → 门店销售 ===
    {
      id: "shop_assistant",
      name: "导购员",
      desc: "在商场门店做导购，底薪加提成。销售技巧越好收入越高。",
      icon: "🏪",
      location: "commercialDist",
      requirements: { sales: 25, minAge: 18, maxAge: 45 },
      branchRequirement: { skill: "sales", branch: "store_sales" },
      effects: { fatigue: 16, salesXp: 6, happiness: 5 },
      payCalc(state) {
        var base = 55 + (state.skills.sales.level || 0) * 1.5 + Math.random() * 35;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("shop_assistant", "sales", state) : 1.0));
      },
      risk: {},
    },
    // === sales → 商务谈判 ===
    {
      id: "procurement_clerk",
      name: "采购员",
      desc: "为公司采购物资，谈价格比质量。嘴皮子和眼力见都要好。",
      icon: "📋",
      location: "commercialDist",
      requirements: { sales: 30, intelligence: 25, minAge: 20 },
      branchRequirement: { skill: "sales", branch: "biz_negotiation" },
      effects: { fatigue: 14, salesXp: 7, happiness: 8, intelligenceXp: 2 },
      payCalc(state) {
        var base = 75 + (state.skills.sales.level || 0) * 1.8 + Math.random() * 40;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("procurement_clerk", "sales", state) : 1.0));
      },
      risk: {},
    },
    // === management → 团队管理 ===
    {
      id: "project_coordinator",
      name: "项目协调员",
      desc: "协调团队内部工作进度，做会议记录和任务追踪。管理入门岗。",
      icon: "📊",
      location: "techPark",
      requirements: { management: 30, intelligence: 25, minAge: 20 },
      branchRequirement: { skill: "management", branch: "team_mgmt" },
      effects: { fatigue: 12, managementXp: 7, happiness: 8 },
      payCalc(state) {
        var base = 85 + (state.skills.management.level || 0) * 1.5 + Math.random() * 35;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("project_coordinator", "management", state) : 1.0));
      },
      risk: {},
    },
    // === accounting → 审计风控 ===
    {
      id: "audit_assistant",
      name: "审计助理",
      desc: "协助注册会计师做账目审计，核对票据和凭证。严谨细致是核心要求。",
      icon: "🔍",
      location: "techPark",
      requirements: { accounting: 35, intelligence: 30, minAge: 20 },
      branchRequirement: { skill: "accounting", branch: "audit_risk" },
      effects: { fatigue: 14, accountingXp: 7, happiness: 5, intelligenceXp: 2 },
      payCalc(state) {
        var base = 95 + (state.skills.accounting.level || 0) * 2.0 + Math.random() * 40;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("audit_assistant", "accounting", state) : 1.0));
      },
      risk: {},
    },
    // === electrician → 强电工程 ===
    {
      id: "factory_electrician",
      name: "工厂电工",
      desc: "在工厂负责电气设备维护和检修。技术硬、责任大、工资高。",
      icon: "⚡",
      location: "factoryZone",
      requirements: { electrician: 35, physique: 22, minAge: 20, maxAge: 55 },
      branchRequirement: { skill: "electrician", branch: "industrial_electric" },
      effects: { fatigue: 22, electricianXp: 7, physiqueXp: 2 },
      payCalc(state) {
        var base = 100 + (state.skills.electrician.level || 0) * 2.0 + Math.random() * 45;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("factory_electrician", "electrician", state) : 1.0));
      },
      risk: { injury: 0.06 },
    },
    // === welding → 结构焊接 ===
    {
      id: "steel_worker",
      name: "钢结构工人",
      desc: "在建筑工地做钢结构焊接和安装。高空作业，收入高但风险也高。",
      icon: "🏗️",
      location: "construction",
      requirements: { welding: 35, physique: 28, minAge: 22, maxAge: 50 },
      branchRequirement: { skill: "welding", branch: "structural_welding" },
      effects: { fatigue: 32, weldingXp: 8, physiqueXp: 3, happiness: -5 },
      payCalc(state) {
        var base = 120 + (state.skills.welding.level || 0) * 2.5 + Math.random() * 55;
        return Math.floor(base * (typeof getBranchJobBonus === "function" ? getBranchJobBonus("steel_worker", "welding", state) : 1.0));
      },
      risk: { injury: 0.12 },
    },
  ];

  // 将分支工作合并到 STREET_JOBS 中
  for (var bi = 0; bi < BRANCH_JOBS.length; bi++) {
    STREET_JOBS.push(BRANCH_JOBS[bi]);
  }
})();

/** 根据 ID 获取工作定义 */
function getJobById(jobId) {
  return STREET_JOBS.find((j) => j.id === jobId) || null;
}
