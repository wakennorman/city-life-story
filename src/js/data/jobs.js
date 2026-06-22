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
      const base = Random.float(20, 55);
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
      const base = Random.float(45 + skillBonus, 80 + skillBonus);
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
      const base = Random.float(38 + skillBonus, 66 + skillBonus);
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
        (65 + state.player.physique * 0.5 + Random.float(0, 30)) *
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
          Random.float(0, 35)) *
          (1 + weldBonus) *
          bossBonus,
      );
    },
    risk: { injury: 0.05 },
  },
  {
    id: "premium_engineering",
    name: "正规工程队（李工头推荐）",
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
          Random.float(0, 60)) *
          (1 + weldBonus),
      );
    },
    risk: { injury: 0.03 },
  },
  {
    id: "restaurant_assistant",
    name: "帮陈师傅打下手",
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
      return Math.floor(50 + cookBonus + Random.float(0, 30));
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
        (80 + state.player.agility * 0.3 + Random.float(0, 18)) *
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
        (115 + state.player.physique * 0.4 + Random.float(0, 25)) *
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
      const base = Random.float(
        95 + state.skills.cooking.level * 1.5,
        145 + state.skills.cooking.level * 1.5,
      );
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
          Random.float(0, 32),
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
      return Math.floor(
        40 + state.player.physique * 0.15 + Random.float(0, 25),
      );
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
        65 + state.skills.repair.level * 2.0 + Random.float(0, 42),
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
      return Math.floor(Random.float(32, 50));
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
      return Math.floor(58 + state.player.physique * 0.4 + Random.float(0, 25));
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
          Random.float(0, 42),
      );
    },
    risk: { illness: 0.08 },
  },

  // ====== NPC关联升级工作 ======
  {
    id: "old_zhou_recycling",
    name: "老周介绍·正规回收站",
    desc: "老周引荐你去了城西正规废品回收站，分类更细、称重公道、收入翻倍。",
    icon: "♻️",
    location: "slum",
    requirements: { physique: 15, minAge: 18, maxAge: 60 },
    requiredFlag: "oldZhouReferred",
    effects: {
      fatigue: 18,
      hygiene: -8,
      physiqueXp: 3,
      repairXp: 2,
    },
    payCalc(state) {
      return Math.floor(
        55 +
          state.player.physique * 0.6 +
          state.skills.sales.level * 0.5 +
          Random.float(0, 30),
      );
    },
    risk: { injury: 0.02 },
  },
  {
    id: "sister_zhang_vending",
    name: "张姐介绍·黄金摊位",
    desc: "张姐帮你弄到了商业区步行街口的好摊位，客流量大，生意兴隆。",
    icon: "🏪",
    location: "commercialDist",
    requirements: { sales: 15, minAge: 18, maxAge: 55 },
    requiredFlag: "sisterZhangReferred",
    effects: { fatigue: 12, hygiene: -3, happiness: 8, salesXp: 5 },
    payCalc(state) {
      var footfall =
        typeof getVendingFootfallMod === "function"
          ? getVendingFootfallMod(state.trade.currentLocation, state)
          : 1.0;
      return Math.floor(
        (80 + state.skills.sales.level * 1.2 + Random.float(0, 35)) *
          Math.min(footfall * 1.3, 3.0),
      );
    },
    risk: {},
  },
  {
    id: "xiao_mei_tutoring",
    name: "小美推荐·精英家教",
    desc: "小美把你的联系方式推荐给了她导师开的补习机构，时薪比普通家教高出一大截。",
    icon: "🎓",
    location: "school",
    requirements: { intelligence: 35, english: 20, minAge: 18 },
    educationRequired: 1,
    requiredFlag: "xiaoMeiReferred",
    effects: { fatigue: 10, intelligenceXp: 5, englishXp: 3, happiness: 12 },
    payCalc(state) {
      return Math.floor(
        100 +
          state.player.intelligence * 0.8 +
          state.skills.english.level * 0.6 +
          Random.float(0, 45),
      );
    },
    risk: {},
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
      return Math.floor(Random.float(42, 64));
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
      return Math.floor(40 + state.player.agility * 0.4 + Random.float(0, 25));
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
          Random.float(0, 32),
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
      return Math.floor(50 + state.player.agility * 0.7 + Random.float(0, 50));
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
          state.player.fame * 0.3 +
          Random.float(0, 42),
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
        70 + state.player.intelligence * 0.4 + Random.float(0, 30),
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
        95 + state.player.intelligence * 0.6 + engBonus + Random.float(0, 40),
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
      return Math.floor(85 + intBonus + engBonus + Random.float(0, 50));
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
        130 + state.player.intelligence * 1.2 + Random.float(0, 60),
      );
    },
    risk: {},
  },
];

// ====== P2#12 技能树分支解锁工作 ======
// 这些工作需要特定技能分支才能看到/执行
(function () {
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
        var base =
          70 + (state.skills.cooking.level || 0) * 1.0 + Random.float(0, 35);
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
        var base =
          100 + (state.skills.repair.level || 0) * 2.5 + Random.float(0, 50);
        var branchBonus =
          typeof getBranchJobBonus === "function"
            ? getBranchJobBonus("instrument_repair", "repair", state)
            : 1.0;
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
        var base =
          80 + (state.skills.repair.level || 0) * 1.8 + Random.float(0, 40);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("phone_modding", "repair", state)
              : 1.0),
        );
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
        var base =
          110 + (state.skills.coding.level || 0) * 2.0 + Random.float(0, 55);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("web_designer", "coding", state)
              : 1.0),
        );
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
        var base =
          130 + (state.skills.coding.level || 0) * 2.5 + Random.float(0, 50);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("server_ops", "coding", state)
              : 1.0),
        );
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
        var base =
          120 + (state.skills.coding.level || 0) * 2.2 + Random.float(0, 45);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("network_monitor", "coding", state)
              : 1.0),
        );
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
        var base =
          90 + (state.skills.english.level || 0) * 1.5 + Random.float(0, 40);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("foreign_trade_assistant", "english", state)
              : 1.0),
        );
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
        var base =
          80 + (state.skills.english.level || 0) * 2.0 + Random.float(0, 40);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("document_translator", "english", state)
              : 1.0),
        );
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
        var base =
          70 + (state.skills.driving.level || 0) * 1.2 + Random.float(0, 45);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("taxi_driver", "driving", state)
              : 1.0),
        );
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
        var base =
          80 + (state.skills.driving.level || 0) * 1.0 + Random.float(0, 35);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("truck_assistant", "driving", state)
              : 1.0),
        );
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
        var base =
          55 + (state.skills.sales.level || 0) * 1.5 + Random.float(0, 35);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("shop_assistant", "sales", state)
              : 1.0),
        );
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
        var base =
          75 + (state.skills.sales.level || 0) * 1.8 + Random.float(0, 40);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("procurement_clerk", "sales", state)
              : 1.0),
        );
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
        var base =
          85 + (state.skills.management.level || 0) * 1.5 + Random.float(0, 35);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("project_coordinator", "management", state)
              : 1.0),
        );
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
      effects: {
        fatigue: 14,
        accountingXp: 7,
        happiness: 5,
        intelligenceXp: 2,
      },
      payCalc(state) {
        var base =
          95 + (state.skills.accounting.level || 0) * 2.0 + Random.float(0, 40);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("audit_assistant", "accounting", state)
              : 1.0),
        );
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
      branchRequirement: {
        skill: "electrician",
        branch: "industrial_electric",
      },
      effects: { fatigue: 22, electricianXp: 7, physiqueXp: 2 },
      payCalc(state) {
        var base =
          100 +
          (state.skills.electrician.level || 0) * 2.0 +
          Random.float(0, 45);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("factory_electrician", "electrician", state)
              : 1.0),
        );
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
        var base =
          120 + (state.skills.welding.level || 0) * 2.5 + Random.float(0, 55);
        return Math.floor(
          base *
            (typeof getBranchJobBonus === "function"
              ? getBranchJobBonus("steel_worker", "welding", state)
              : 1.0),
        );
      },
      risk: { injury: 0.12 },
    },
    // === 灵活配送 → 跑腿零工（修复 items.js 中 4 件装备引用断裂） ===
    {
      id: "courier_gig",
      name: "跑腿零工",
      desc: "帮人取快递、送文件、买咖啡，啥急活都接。灵活自由，多劳多得。",
      icon: "🚶",
      location: "commercialDist",
      requirements: { agility: 15, minAge: 18, maxAge: 50 },
      effects: { fatigue: 8, agilityXp: 2, happiness: 2 },
      payCalc(state) {
        var base = 35 + state.player.agility * 0.3 + Random.float(0, 35);
        // 有配送类技能收入更高
        if (state.skills.driving && state.skills.driving.level > 0)
          base *= 1.15;
        if (state.skills.sales && state.skills.sales.level > 0) base *= 1.1;
        return Math.floor(base);
      },
      risk: { injury: 0.01 },
    },

    // ============================================================
    // 待完成：新增地点专属工作 — 参考《大多数》工作系统《北京浮生记》
    // 实现提示：在 BRANCH_JOBS 数组中追加，注意 location 字段对应 locations.js 中的 ID
    // 参考来源：
    //   - 《大多数》工作系统：游戏化工作设计思路
    //   - 《北京浮生记》街头工作：真实北京街头工作类型
    //   - 真实中国零工经济数据（2024年）
    // ============================================================
    //
    // === 公园地点工作 ===
    // TODO: 待实现 - 公园街头表演（参考真实街头艺人收入¥50-500/天）
    // {
    //   id: "busking",
    //   name: "街头表演",
    //   desc: "在天桥或广场表演才艺。脸皮要厚，观众打赏全看心情。",
    //   icon: "🎸",
    //   location: "park",
    //   requirements: { mental: 30, minAge: 16, maxAge: 60 },
    //   effects: { fatigue: 12, happiness: 18, mental: 2, fame: 3 },
    //   payCalc(state) {
    //     return Math.floor(18 + state.player.mental * 0.2 + state.player.fame * 0.3 + Random.float(0, 42));
    //   },
    //   risk: {},
    // },
    // ============================================================
    // 公园地点工作（正式实现 — 修复公园空地点问题）
    // 参考来源：《大多数》工作系统 / 真实中国公园就业数据（2024年）
    // 联动：公园地点 jobs 数组已更新，需配套添加 NPC + 事件
    // ============================================================
    // TODO: 待实现 - 公园街头表演（参考真实街头艺人收入¥50-500/天）
    {
      id: "busking",
      name: "街头表演",
      desc: "在天桥或广场表演才艺。脸皮要厚，观众打赏全看心情。",
      icon: "🎸",
      location: "park",
      requirements: { mental: 30, minAge: 16, maxAge: 60 },
      effects: { fatigue: 12, happiness: 18, mental: 2, fame: 3 },
      payCalc(state) {
        return Math.floor(
          18 +
            state.player.mental * 0.2 +
            state.player.fame * 0.3 +
            Random.float(0, 42),
        );
      },
      risk: {},
    },
    {
      id: "park_security",
      name: "公园保安",
      icon: "👮",
      location: "park",
      requirements: { minAge: 18, maxAge: 55 },
      effects: { fatigue: 10, happiness: -3, physiqueXp: 1 },
      payCalc: function (state) {
        return Math.floor(Random.float(35, 50));
      },
      risk: {},
    },
    {
      id: "park_cleaning",
      name: "公园清洁",
      icon: "🧹",
      location: "park",
      requirements: { minAge: 18, maxAge: 60 },
      effects: { fatigue: 18, hygiene: -5, physiqueXp: 2 },
      payCalc: function (state) {
        return Math.floor(Random.float(25, 40));
      },
      risk: {},
    },
    {
      id: "park_guide",
      name: "公园导游",
      desc: "在公园/景区为游客提供讲解服务。需要口才好、知识面广。",
      icon: "🗣️",
      location: "park",
      requirements: { intelligence: 25, mental: 20, minAge: 18, maxAge: 50 },
      effects: { fatigue: 8, happiness: 5, intelligenceXp: 2, fame: 2 },
      payCalc(state) {
        return Math.floor(
          50 + state.player.intelligence * 0.3 + Random.float(0, 50),
        );
      },
      risk: {},
    },
    {
      id: "park_flower_vendor",
      name: "公园卖花",
      desc: "在公园门口或内部卖鲜花/盆栽。周末和节日生意好。",
      icon: "💐",
      location: "park",
      requirements: { sales: 10, minAge: 18 },
      effects: { fatigue: 10, happiness: 3, salesXp: 2 },
      payCalc(state) {
        return Math.floor(
          40 + state.skills.sales.level * 2 + Random.float(0, 60),
        );
      },
      risk: {},
      seasonal: { months: [2, 3, 5, 10] }, // 情人节/五一/国庆
    },
    //
    // ============================================================
    // 医院地点工作（正式实现 — 医院目前仅1个工作，需扩充）
    // 参考来源：《大多数》工作系统 / 真实中国医院就业数据（2024年）
    // 联动：医院地点 jobs 数组需更新，需配套添加 NPC + 事件
    // ============================================================
    {
      id: "hospital_cleaning",
      name: "医院保洁",
      icon: "🧹",
      location: "hospital",
      requirements: { hygiene: 10, minAge: 18, maxAge: 55 },
      effects: { fatigue: 15, hygiene: -8, happiness: -2 },
      payCalc: function (state) {
        return Math.floor(Random.float(40, 60));
      },
      risk: { illness: 0.05 },
    },
    {
      id: "hospital_delivery",
      name: "医院配送",
      icon: "📦",
      location: "hospital",
      requirements: { agility: 15, minAge: 18, maxAge: 45 },
      effects: { fatigue: 20, agilityXp: 2 },
      payCalc: function (state) {
        return Math.floor(Random.float(50, 80));
      },
      risk: { illness: 0.03 },
    },
    {
      id: "hospital_orderly",
      name: "医院护工",
      desc: "在医院照顾病人日常生活。需要耐心和体力，有护理证收入更高。",
      icon: "👨‍⚕️",
      location: "hospital",
      requirements: { physique: 20, mental: 25, minAge: 20, maxAge: 55 },
      effects: { fatigue: 25, hygiene: -5, happiness: 2, physiqueXp: 2 },
      payCalc(state) {
        var base = 60 + state.player.physique * 0.3 + Random.float(0, 40);
        if (state.flags.nursingCert) base *= 1.3;
        return Math.floor(base);
      },
      risk: { illness: 0.06 },
    },
    {
      id: "hospital_guidance",
      name: "医院导诊",
      desc: "在医院为患者提供导诊服务。需要熟悉医院流程，耐心解答问题。",
      icon: "🗺️",
      location: "hospital",
      requirements: { mental: 20, intelligence: 15, minAge: 18, maxAge: 50 },
      effects: { fatigue: 10, happiness: 3, mentalXp: 2 },
      payCalc(state) {
        return Math.floor(35 + state.player.mental * 0.2 + Random.float(0, 30));
      },
      risk: { illness: 0.02 },
    },
    // TODO: 待实现 - 殡仪馆工作人员（参考真实殡仪馆工作人员工资¥5000-10000/月）
    // {
    //   id: "funeral_home",
    //   name: "殡仪馆工作人员",
    //   desc: "在殡仪馆协助处理丧事。收入高但心理压力大，需要强大的心理素质。",
    //   icon: "⚰️",
    //   location: "hospital",
    //   requirements: { mental: 40, physique: 15, minAge: 22, maxAge: 50 },
    //   effects: { fatigue: 15, happiness: -10, mental: -3, physiqueXp: 1 },
    //   payCalc(state) { return Math.floor(80 + state.player.mental * 0.5 + Random.float(0, 60)); },
    //   risk: { illness: 0.03 },
    // },
    //
    // ============================================================
    // 银行地点工作（正式实现 — 银行之前是空地点）
    // 参考来源：《大多数》工作系统 / 真实中国银行就业数据（2024年）
    // 联动：银行地点 jobs 数组需更新
    // ============================================================
    {
      id: "bank_security",
      name: "银行保安",
      icon: "👮",
      location: "bank",
      requirements: { minAge: 20, maxAge: 50 },
      effects: { fatigue: 8, happiness: -2, physiqueXp: 0 },
      payCalc: function (state) {
        return Math.floor(Random.float(60, 90));
      },
      risk: {},
    },
    {
      id: "bank_cashier_assist",
      name: "银行大堂助理",
      icon: "💼",
      location: "bank",
      requirements: { intelligence: 25, minAge: 22, maxAge: 35, education: 1 },
      effects: { fatigue: 10, intelligenceXp: 2, happiness: 2 },
      payCalc: function (state) {
        return Math.floor(Random.float(70, 100));
      },
      risk: {},
    },
    {
      id: "atm_maintenance",
      name: "ATM维护员",
      desc: "负责ATM机的日常维护和加钞。需要技术基础，收入稳定。",
      icon: "🏧",
      location: "bank",
      requirements: { repair: 15, intelligence: 20, minAge: 22, maxAge: 45 },
      effects: { fatigue: 12, intelligenceXp: 2, happiness: 2 },
      payCalc(state) {
        return Math.floor(
          70 + state.skills.repair.level * 1.5 + Random.float(0, 50),
        );
      },
      risk: {},
    },
    //
    // ============================================================
    // 培训中心地点工作（正式实现 — 培训中心之前是空地点）
    // 参考来源：《大多数》工作系统 / 真实中国培训机构就业数据（2024年）
    // 联动：培训中心地点 jobs 数组需更新
    // ============================================================
    {
      id: "tutor_care",
      name: "培训辅导",
      icon: "📚",
      location: "trainingCenter",
      requirements: { intelligence: 30, minAge: 22, maxAge: 50 },
      effects: { fatigue: 12, intelligenceXp: 3, happiness: 5 },
      payCalc: function (state) {
        return Math.floor(Random.float(80, 120));
      },
      risk: {},
    },
    {
      id: "center_cleaning",
      name: "培训中心保洁",
      icon: "🧹",
      location: "trainingCenter",
      requirements: { minAge: 18, maxAge: 55 },
      effects: { fatigue: 15, hygiene: -3 },
      payCalc: function (state) {
        return Math.floor(Random.float(30, 50));
      },
      risk: {},
    },
    {
      id: "training_assistant",
      name: "培训助理",
      desc: "协助培训老师管理班级、准备教材。需要耐心和组织能力。",
      icon: "📋",
      location: "trainingCenter",
      requirements: { mental: 20, intelligence: 15, minAge: 18, maxAge: 40 },
      effects: { fatigue: 10, happiness: 3, managementXp: 2 },
      payCalc(state) {
        return Math.floor(40 + state.player.mental * 0.2 + Random.float(0, 40));
      },
      risk: {},
    },
    //
    // === 批发市场地点工作 ===
    // TODO: 待实现 - 批发配送（参考真实批发配送员工资¥5000-8000/月）
    // { id: "wholesale_delivery", name: "批发配送", icon: "🚚", location: "wholesaleMarket", requirements: { driving: 10, minAge: 20, maxAge: 45 }, effects: { fatigue: 25, agilityXp: 2 }, payCalc: function(state) { return Math.floor(Random.float(50, 90)); }, risk: { injury: 0.02 } },
    // TODO: 待实现 - 货物分拣（参考真实仓库分拣员工资¥4000-7000/月）
    // { id: "wholesale_sorting", name: "货物分拣", icon: "📦", location: "wholesaleMarket", requirements: { agility: 15, minAge: 18, maxAge: 45 }, effects: { fatigue: 22, physiqueXp: 2 }, payCalc: function(state) { return Math.floor(Random.float(40, 70)); }, risk: { injury: 0.03 } },
    // TODO: 待实现 - 批发推销员（参考真实批发推销员工资）
    // {
    //   id: "wholesale_salesman",
    //   name: "批发推销员",
    //   desc: "在批发市场帮商家推销商品。需要口才好，收入看业绩。",
    //   icon: "📢",
    //   location: "wholesaleMarket",
    //   requirements: { sales: 15, mental: 20, minAge: 18, maxAge: 45 },
    //   effects: { fatigue: 14, happiness: 2, salesXp: 3 },
    //   payCalc(state) { return Math.floor(50 + state.skills.sales.level * 3 + Random.float(0, 80)); },
    //   risk: {},
    // },
    //
    // === 科技园地点工作 ===
    // TODO: 待实现 - 实验室助理（参考真实实验室助理工资¥5000-9000/月）
    // { id: "lab_assistant", name: "实验室助理", icon: "🔬", location: "techPark", requirements: { intelligence: 35, minAge: 22, maxAge: 35, education: 1 }, effects: { fatigue: 10, intelligenceXp: 4, happiness: 3 }, payCalc: function(state) { return Math.floor(Random.float(90, 150)); }, risk: {} },
    // TODO: 待实现 - 园区保洁（参考真实园区保洁工资）
    // {
    //   id: "techpark_cleaning",
    //   name: "园区保洁",
    //   desc: "在科技园做保洁工作。环境好，工作轻松，但工资不高。",
    //   icon: "🧹",
    //   location: "techPark",
    //   requirements: { minAge: 18, maxAge: 55 },
    //   effects: { fatigue: 12, hygiene: -2, happiness: 2 },
    //   payCalc(state) { return Math.floor(30 + Random.float(0, 20)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 园区保安（参考真实园区保安工资）
    // {
    //   id: "techpark_security",
    //   name: "园区保安",
    //   desc: "在科技园门口值班。工作轻松，可以上网看书。",
    //   icon: "👮",
    //   location: "techPark",
    //   requirements: { minAge: 20, maxAge: 50 },
    //   effects: { fatigue: 8, happiness: 3 },
    //   payCalc(state) { return Math.floor(35 + Random.float(0, 15)); },
    //   risk: {},
    // },
    //
    // === 商业区地点工作 ===
    // TODO: 待实现 - 健身房教练（参考真实健身教练工资¥8000-20000/月）
    // { id: "gym_coach", name: "健身房教练", icon: "🏋️", location: "commercialDist", requirements: { physique: 50, minAge: 22, maxAge: 45 }, effects: { fatigue: 15, physiqueXp: 3, happiness: 8 }, payCalc: function(state) { return Math.floor(80 + state.player.physique * 0.5 + Random.float(0, 50)); }, risk: {} },
    // TODO: 待实现 - 宠物保姆（参考真实宠物保姆工资¥4000-8000/月）
    // { id: "pet_sitter", name: "宠物保姆", icon: "🐕", location: "commercialDist", requirements: { minAge: 18, maxAge: 45 }, effects: { fatigue: 8, happiness: 10 }, payCalc: function(state) { return Math.floor(Random.float(40, 80)); }, risk: {} },
    // TODO: 待实现 - 高端家政（参考真实高端家政工资¥8000-15000/月）
    // {
    //   id: "premium_housekeeper",
    //   name: "高端家政",
    //   desc: "为富裕家庭提供家政服务。要求高、工资高，需要良好的职业素养。",
    //   icon: "👩‍🍳",
    //   location: "commercialDist",
    //   requirements: { mental: 30, hygiene: 25, minAge: 22, maxAge: 50 },
    //   effects: { fatigue: 15, happiness: 3, housekeepingXp: 3 },
    //   payCalc(state) { return Math.floor(100 + state.player.mental * 0.5 + Random.float(0, 80)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 高端司机（参考真实私人司机工资¥8000-15000/月）
    // {
    //   id: "chauffeur",
    //   name: "私人司机",
    //   desc: "为富裕家庭或企业高管开车。需要良好的驾驶技术和职业素养。",
    //   icon: "🚗",
    //   location: "commercialDist",
    //   requirements: { driving: 30, minAge: 25, maxAge: 50, cleanRecord: true },
    //   effects: { fatigue: 15, happiness: 2, drivingXp: 2 },
    //   payCalc(state) { return Math.floor(100 + state.skills.driving.level * 2 + Random.float(0, 80)); },
    //   risk: { injury: 0.02 },
    // },
    // TODO: 待实现 - 高端安保（参考真实高端安保人员工资）
    // {
    //   id: "premium_security",
    //   name: "高端安保",
    //   desc: "为VIP客户提供贴身安保服务。需要强健体魄和应急处理能力。",
    //   icon: "💪",
    //   location: "commercialDist",
    //   requirements: { physique: 45, mental: 30, minAge: 22, maxAge: 45 },
    //   effects: { fatigue: 20, physiqueXp: 3, happiness: -2 },
    //   payCalc(state) { return Math.floor(120 + state.player.physique * 0.8 + Random.float(0, 100)); },
    //   risk: { injury: 0.05 },
    // },
    // TODO: 待实现 - 奢侈品销售（参考真实奢侈品销售工资¥8000-20000/月）
    // {
    //   id: "luxury_sales",
    //   name: "奢侈品销售",
    //   desc: "在奢侈品店销售商品。需要良好的形象和口才，收入看业绩。",
    //   icon: "💎",
    //   location: "commercialDist",
    //   requirements: { sales: 20, agility: 20, minAge: 20, maxAge: 35 },
    //   effects: { fatigue: 12, happiness: 3, salesXp: 3 },
    //   payCalc(state) { return Math.floor(80 + state.skills.sales.level * 4 + Random.float(0, 150)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 美容师（参考真实美容师工资¥5000-12000/月）
    // {
    //   id: "beauty_salon",
    //   name: "美容师",
    //   desc: "在美容院做美容服务。需要手艺和耐心，收入看客源。",
    //   icon: "💅",
    //   location: "commercialDist",
    //   requirements: { agility: 20, minAge: 18, maxAge: 45 },
    //   effects: { fatigue: 14, happiness: 3, beautyXp: 3 },
    //   payCalc(state) { return Math.floor(60 + state.skills.beauty?.level * 3 + Random.float(0, 80)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 美甲师（参考真实美甲师工资¥5000-10000/月）
    // {
    //   id: "nail_artist",
    //   name: "美甲师",
    //   desc: "在美甲店做美甲服务。需要审美和手艺，收入看客源。",
    //   icon: "💅",
    //   location: "commercialDist",
    //   requirements: { agility: 25, minAge: 18, maxAge: 40 },
    //   effects: { fatigue: 10, happiness: 5, beautyXp: 2 },
    //   payCalc(state) { return Math.floor(50 + state.skills.beauty?.level * 2 + Random.float(0, 60)); },
    //   risk: {},
    // },

    // ============================================================
    // 待完成：新增节日/季节性工作 — 参考真实节日经济《大多数》节日工作
    // 实现提示：在 STREET_JOBS 数组中追加，添加 seasonal 字段控制出现时间
    // 参考来源：
    //   - 真实中国节日经济数据（2024年）
    //   - 《大多数》节日工作系统
    //   - 真实节日临时工作市场
    // ============================================================
    //
    // === 春节相关工作 ===
    // TODO: 待实现 - 写春联（参考真实春联价格¥20-200/幅，春节前7天需求旺盛）
    // {
    //   id: "fest_spring_couplet",
    //   name: "写春联",
    //   desc: "春节前帮人写春联，按幅收费。书法好的能赚不少。",
    //   icon: "🧧",
    //   location: "commercialDist",
    //   requirements: { intelligence: 20 },
    //   effects: { fatigue: 8, happiness: 5, intelligenceXp: 2 },
    //   payCalc(state) {
    //     return Math.floor(60 + (state.skills.calligraphy?.level || 0) * 2 + Random.float(0, 40));
    //   },
    //   risk: {},
    //   seasonal: { festival: "spring_festival", daysBefore: 7, daysAfter: 0 },
    // },
    // TODO: 待实现 - 做月饼（参考真实月饼制作收入，中秋节前5天）
    // { id: "fest_mid_autumn_mooncake", name: "做月饼", icon: "🥮", location: "commercialDist", requirements: { cooking: 15 }, effects: { fatigue: 12, happiness: 3, cookingXp: 5 }, payCalc: function(state) { return Math.floor(80 + state.skills.cooking.level * 1.5 + Random.float(0, 50)); }, risk: {}, seasonal: { festival: "mid_autumn", daysBefore: 5, daysAfter: 0 } },
    // TODO: 待实现 - 包粽子（参考真实粽子制作收入，端午节前3天）
    // { id: "fest_dragon_zongzi", name: "包粽子", icon: "🛶", location: "commercialDist", requirements: { cooking: 10 }, effects: { fatigue: 10, happiness: 3, cookingXp: 4 }, payCalc: function(state) { return Math.floor(60 + state.skills.cooking.level * 1.2 + Random.float(0, 40)); }, risk: {}, seasonal: { festival: "dragon_boat", daysBefore: 3, daysAfter: 0 } },
    // TODO: 待实现 - 春节临时工（参考真实春节临时工收入¥200-500/天）
    // {
    //   id: "spring_festival_temp",
    //   name: "春节临时工",
    //   desc: "春节期间商场/餐厅/物流招临时工。三倍工资，但工作强度大。",
    //   icon: "🧨",
    //   location: "commercialDist",
    //   requirements: { minAge: 18, maxAge: 55 },
    //   effects: { fatigue: 25, happiness: 5 },
    //   payCalc(state) { return Math.floor(150 + Random.float(0, 100)); },
    //   risk: {},
    //   seasonal: { festival: "spring_festival", daysBefore: 1, daysAfter: 3 },
    // },
    // TODO: 待实现 - 卖年货（参考真实年货摊贩收入）
    // {
    //   id: "new_year_goods",
    //   name: "卖年货",
    //   desc: "春节前摆摊卖年货。客流量大，利润可观，但需要进货资金。",
    //   icon: "🧧",
    //   location: "commercialDist",
    //   requirements: { sales: 15, cash: 500 },
    //   effects: { fatigue: 15, happiness: 5, salesXp: 3 },
    //   payCalc(state) { return Math.floor(100 + state.skills.sales.level * 3 + Random.float(0, 150)); },
    //   risk: {},
    //   seasonal: { festival: "spring_festival", daysBefore: 5, daysAfter: 0 },
    // },
    // TODO: 待实现 - 送年货（参考真实春节配送收入）
    // {
    //   id: "new_year_delivery",
    //   name: "送年货",
    //   desc: "春节前帮人送年货礼品。需求量大，配送费高。",
    //   icon: "🚚",
    //   location: "commercialDist",
    //   requirements: { agility: 15, minAge: 18, maxAge: 50 },
    //   effects: { fatigue: 20, agilityXp: 2 },
    //   payCalc(state) { return Math.floor(80 + Random.float(0, 70)); },
    //   risk: { injury: 0.03 },
    //   seasonal: { festival: "spring_festival", daysBefore: 3, daysAfter: 1 },
    // },
    //
    // === 季节性工作 ===
    // TODO: 待实现 - 卖冬装（参考真实冬季服装销售，12-2月）
    // { id: "winter_coat_vendor", name: "卖冬装", icon: "🧥", location: "commercialDist", requirements: { sales: 15 }, effects: { fatigue: 14, happiness: 2, salesXp: 4 }, payCalc: function(state) { return Math.floor(100 + state.skills.sales.level * 2 + Random.float(0, 80)); }, risk: {}, seasonal: { months: [12, 1, 2] } },
    // TODO: 待实现 - 卖冷饮（参考真实夏季冷饮销售，6-8月）
    // { id: "summer_cold_drink", name: "卖冷饮", icon: "🍦", location: "commercialDist", requirements: {}, effects: { fatigue: 12, happiness: 5, salesXp: 2 }, payCalc: function(state) { return Math.floor(50 + Random.float(0, 60)); }, risk: {}, seasonal: { months: [6, 7, 8] } },
    // TODO: 待实现 - 卖空调扇（参考真实夏季降温产品销售）
    // {
    //   id: "summer_cooling",
    //   name: "卖降温用品",
    //   desc: "夏季卖风扇/空调扇/冰袖等降温用品。",
    //   icon: "❄️",
    //   location: "commercialDist",
    //   requirements: { sales: 10 },
    //   effects: { fatigue: 12, happiness: 3, salesXp: 2 },
    //   payCalc(state) { return Math.floor(60 + state.skills.sales.level * 2 + Random.float(0, 80)); },
    //   risk: {},
    //   seasonal: { months: [6, 7, 8] },
    // },
    // TODO: 待实现 - 卖防晒霜（参考真实夏季防晒产品销售）
    // {
    //   id: "summer_sunscreen",
    //   name: "卖防晒用品",
    //   desc: "夏季卖防晒霜/遮阳伞/太阳镜等防晒用品。",
    //   icon: "☀️",
    //   location: "commercialDist",
    //   requirements: { sales: 10 },
    //   effects: { fatigue: 10, happiness: 2, salesXp: 2 },
    //   payCalc(state) { return Math.floor(50 + state.skills.sales.level * 2 + Random.float(0, 60)); },
    //   risk: {},
    //   seasonal: { months: [5, 6, 7, 8] },
    // },
    // TODO: 待实现 - 开学季布置（参考真实开学季临时工作，2月/9月）
    // { id: "school_term_prep", name: "开学季布置", icon: "📚", location: "school", requirements: { agility: 15 }, effects: { fatigue: 18, happiness: 3 }, payCalc: function(state) { return Math.floor(80 + Random.float(0, 50)); }, risk: {}, seasonal: { months: [2, 9] } },
    // TODO: 待实现 - 卖秋装（参考真实秋季服装销售，9-11月）
    // {
    //   id: "autumn_clothes",
    //   name: "卖秋装",
    //   desc: "秋季卖外套/毛衣等秋装。",
    //   icon: "🍂",
    //   location: "commercialDist",
    //   requirements: { sales: 10 },
    //   effects: { fatigue: 12, happiness: 2, salesXp: 3 },
    //   payCalc(state) { return Math.floor(70 + state.skills.sales.level * 2 + Random.float(0, 70)); },
    //   risk: {},
    //   seasonal: { months: [9, 10, 11] },
    // },
    //
    // === 情人节/七夕工作 ===
    // TODO: 待实现 - 情人节卖花（参考真实情人节卖花收入，2月14日前3天）
    // { id: "valentine_flower", name: "情人节卖花", icon: "🌹", location: "commercialDist", requirements: { sales: 10 }, effects: { fatigue: 10, happiness: 8, salesXp: 3 }, payCalc: function(state) { return Math.floor(150 + state.skills.sales.level * 3 + Random.float(0, 100)); }, risk: {}, seasonal: { festival: "valentine", daysBefore: 3, daysAfter: 0 } },
    // TODO: 待实现 - 七夕卖礼物（参考真实七夕礼物销售）
    // { id: "chinese_valentine", name: "七夕卖礼物", icon: "💝", location: "commercialDist", requirements: { sales: 15 }, effects: { fatigue: 12, happiness: 8, salesXp: 4 }, payCalc: function(state) { return Math.floor(120 + state.skills.sales.level * 2.5 + Random.float(0, 80)); }, risk: {}, seasonal: { festival: "qixi", daysBefore: 5, daysAfter: 0 } },
    // TODO: 待实现 - 情人节代排队（参考真实情人节代排队服务）
    // {
    //   id: "valentine_queue",
    //   name: "情人节代排队",
    //   desc: "帮人排队买花/餐厅/电影票。情人节当天需求旺盛。",
    //   icon: "⏳",
    //   location: "commercialDist",
    //   requirements: { minAge: 18 },
    //   effects: { fatigue: 15, happiness: 5 },
    //   payCalc(state) { return Math.floor(100 + Random.float(0, 80)); },
    //   risk: {},
    //   seasonal: { festival: "valentine", daysBefore: 0, daysAfter: 0 },
    // },
    //
    // === 圣诞节工作 ===
    // TODO: 待实现 - 圣诞装饰（参考真实圣诞节临时工作，12月）
    // { id: "christmas_deco", name: "圣诞装饰", icon: "🎄", location: "commercialDist", requirements: { agility: 15 }, effects: { fatigue: 15, happiness: 5 }, payCalc: function(state) { return Math.floor(100 + Random.float(0, 60)); }, risk: {}, seasonal: { months: [12] } },
    // TODO: 待实现 - 圣诞老人扮演（参考真实圣诞老人扮演收入）
    // {
    //   id: "santa_claus",
    //   name: "圣诞老人扮演",
    //   desc: "在商场/活动扮演圣诞老人发礼物。需要演技和耐心。",
    //   icon: "🎅",
    //   location: "commercialDist",
    //   requirements: { mental: 20, ageMin: 20, ageMax: 50 },
    //   effects: { fatigue: 12, happiness: 10 },
    //   payCalc(state) { return Math.floor(80 + Random.float(0, 60)); },
    //   risk: {},
    //   seasonal: { festival: "christmas", daysBefore: 1, daysAfter: 1 },
    // },

    // ============================================================
    // 待完成：新增自由职业工作 — 参考《自由职业模拟器》《零工经济》
    // 实现提示：在 STREET_JOBS 数组中追加，注意自由职业的特性（时间灵活、收入波动大）
    // 参考来源：
    //   - 《自由职业模拟器》游戏设计
    //   - 真实中国零工经济数据（2024年）
    //   - 真实自由职业平台（猪八戒、闲鱼、小红书等）
    // ============================================================
    //
    // === 设计类自由职业 ===
    // TODO: 待实现 - 自由设计接单（参考真实平面设计收入¥100-1000/单）
    // {
    //   id: "freelance_design",
    //   name: "自由设计接单",
    //   desc: "接平面设计、LOGO设计、海报设计等单子。时间灵活，收入看能力。",
    //   icon: "🎨",
    //   location: "techPark",
    //   requirements: { design: 20, intelligence: 25 },
    //   effects: { fatigue: 15, intelligenceXp: 3, happiness: 2 },
    //   payCalc(state) {
    //     return Math.floor(80 + state.skills.design.level * 5 + Random.float(0, 220));
    //   },
    //   risk: {},
    // },
    // TODO: 待实现 - UI/UX设计接单（参考真实UI设计收入¥300-2000/单）
    // {
    //   id: "freelance_ui_design",
    //   name: "UI设计接单",
    //   desc: "接APP/网页UI设计单子。收入高，需要审美和技术。",
    //   icon: "🖥️",
    //   location: "techPark",
    //   requirements: { design: 25, intelligence: 30, coding: 10 },
    //   effects: { fatigue: 18, intelligenceXp: 4, happiness: 3 },
    //   payCalc(state) { return Math.floor(150 + state.skills.design.level * 6 + Random.float(0, 350)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 3D建模接单（参考真实3D建模收入¥200-1500/单）
    // {
    //   id: "freelance_3d_model",
    //   name: "3D建模接单",
    //   desc: "接3D建模/渲染单子。需要专业软件和审美能力。",
    //   icon: "🧊",
    //   location: "techPark",
    //   requirements: { design: 30, intelligence: 30 },
    //   effects: { fatigue: 20, intelligenceXp: 5, happiness: 2 },
    //   payCalc(state) { return Math.floor(180 + state.skills.design.level * 5 + Random.float(0, 400)); },
    //   risk: {},
    // },
    //
    // === 写作/内容类自由职业 ===
    // TODO: 待实现 - 自由写作接单（参考真实文案写作收入¥100-800/篇）
    // { id: "freelance_writing", name: "自由写作接单", icon: "✍️", location: "techPark", requirements: { intelligence: 35, writing: 15 }, effects: { fatigue: 12, intelligenceXp: 4, happiness: 5 }, payCalc: function(state) { return Math.floor(50 + state.skills.writing.level * 4 + Random.float(0, 150)); }, risk: {} },
    // TODO: 待实现 - 新媒体运营（参考真实新媒体运营收入¥3000-10000/月）
    // {
    //   id: "freelance_social_media",
    //   name: "新媒体运营",
    //   desc: "帮企业/个人运营公众号/小红书/抖音。收入看粉丝增长和转化。",
    //   icon: "📱",
    //   location: "techPark",
    //   requirements: { intelligence: 25, mental: 20, fame: 5 },
    //   effects: { fatigue: 15, happiness: 5, fame: 3 },
    //   payCalc(state) { return Math.floor(100 + state.player.fame * 2 + Random.float(0, 200)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 视频剪辑（参考真实视频剪辑收入¥200-1000/条）
    // { id: "video_editing", name: "视频剪辑", icon: "🎬", location: "techPark", requirements: { intelligence: 30, videoEditing: 15 }, effects: { fatigue: 15, intelligenceXp: 4, happiness: 3 }, payCalc: function(state) { return Math.floor(100 + state.skills.videoEditing.level * 5 + Random.float(0, 200)); }, risk: {} },
    // TODO: 待实现 - 文案策划（参考真实文案策划收入¥500-2000/篇）
    // {
    //   id: "freelance_copywriting",
    //   name: "文案策划",
    //   desc: "为企业写广告文案/活动策划。需要创意和文字功底。",
    //   icon: "📝",
    //   location: "techPark",
    //   requirements: { intelligence: 35, writing: 20 },
    //   effects: { fatigue: 14, intelligenceXp: 4, happiness: 3 },
    //   payCalc(state) { return Math.floor(120 + state.skills.writing.level * 5 + Random.float(0, 250)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 小说/网文写作（参考真实网文作者收入波动大）
    // {
    //   id: "freelance_novel",
    //   name: "网文写作",
    //   desc: "在网文平台写小说。收入波动极大，需要坚持和天赋。",
    //   icon: "📖",
    //   location: "techPark",
    //   requirements: { intelligence: 30, writing: 25 },
    //   effects: { fatigue: 10, happiness: 5, writingXp: 3 },
    //   payCalc(state) { return Math.floor(50 + state.skills.writing.level * 3 + Random.float(0, 300)); },
    //   risk: {},
    // },
    //
    // === 翻译/语言类自由职业 ===
    // TODO: 待实现 - 自由翻译接单（参考真实翻译收入¥200-800/千字）
    // { id: "freelance_translation", name: "自由翻译接单", icon: "🌐", location: "techPark", requirements: { english: 40 }, effects: { fatigue: 10, intelligenceXp: 3, happiness: 3 }, payCalc: function(state) { return Math.floor(100 + state.skills.english.level * 3 + Random.float(0, 300)); }, risk: {} },
    // TODO: 待实现 - 同声传译（参考真实同传收入¥3000-8000/天）
    // {
    //   id: "freelance_simultaneous",
    //   name: "同声传译",
    //   desc: "为会议/活动提供同声传译服务。顶级翻译职业，收入极高。",
    //   icon: "🎙️",
    //   location: "techPark",
    //   requirements: { english: 55, intelligence: 45, ageMin: 25 },
    //   effects: { fatigue: 25, intelligenceXp: 5, happiness: 5 },
    //   payCalc(state) { return Math.floor(500 + state.skills.english.level * 8 + Random.float(0, 800)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 日语翻译（参考真实日语翻译收入）
    // {
    //   id: "freelance_japanese",
    //   name: "日语翻译",
    //   desc: "接日语翻译单子。需要日语N1水平。",
    //   icon: "🇯🇵",
    //   location: "techPark",
    //   requirements: { japanese: 30, intelligence: 30 },
    //   effects: { fatigue: 12, intelligenceXp: 3 },
    //   payCalc(state) { return Math.floor(120 + state.skills.japanese * 4 + Random.float(0, 250)); },
    //   risk: {},
    // },
    //
    // === 摄影/视频类自由职业 ===
    // TODO: 待实现 - 自由摄影接单（参考真实摄影收入¥300-3000/场）
    // { id: "freelance_photo", name: "自由摄影接单", icon: "📷", location: "commercialDist", requirements: { agility: 25, photography: 10 }, effects: { fatigue: 18, happiness: 8, agilityXp: 2 }, payCalc: function(state) { return Math.floor(150 + state.skills.photography.level * 5 + Random.float(0, 350)); }, risk: {} },
    // TODO: 待实现 - 婚礼摄影（参考真实婚礼摄影收入¥2000-10000/场）
    // {
    //   id: "wedding_photo",
    //   name: "婚礼摄影",
    //   desc: "接婚礼跟拍单子。收入高但压力大，需要技术和耐心。",
    //   icon: "💒",
    //   location: "commercialDist",
    //   requirements: { photography: 30, agility: 25, ageMin: 22 },
    //   effects: { fatigue: 20, happiness: 10, photographyXp: 4 },
    //   payCalc(state) { return Math.floor(500 + state.skills.photography.level * 10 + Random.float(0, 1000)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 商业摄影（参考真实商业摄影收入¥1000-5000/次）
    // {
    //   id: "commercial_photo",
    //   name: "商业摄影",
    //   desc: "接产品/广告/模特摄影单子。需要专业设备和审美。",
    //   icon: "📸",
    //   location: "commercialDist",
    //   requirements: { photography: 35, agility: 25, ageMin: 22 },
    //   effects: { fatigue: 18, happiness: 5, photographyXp: 3 },
    //   payCalc(state) { return Math.floor(300 + state.skills.photography.level * 8 + Random.float(0, 700)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 无人机航拍（参考真实航拍收入¥500-3000/次）
    // {
    //   id: "freelance_drone",
    //   name: "无人机航拍",
    //   desc: "接航拍单子。需要无人机设备和操作技能。",
    //   icon: "🚁",
    //   location: "commercialDist",
    //   requirements: { drone: 20, agility: 20 },
    //   effects: { fatigue: 15, happiness: 5, photographyXp: 3 },
    //   payCalc(state) { return Math.floor(200 + state.skills.drone * 5 + Random.float(0, 400)); },
    //   risk: {},
    // },
    //
    // === 咨询/服务类自由职业 ===
    // TODO: 待实现 - 自由咨询接单（参考真实咨询收入¥500-3000/小时）
    // { id: "freelance_consulting", name: "自由咨询接单", icon: "💡", location: "techPark", requirements: { management: 30, intelligence: 45 }, effects: { fatigue: 8, intelligenceXp: 5, happiness: 5 }, payCalc: function(state) { return Math.floor(200 + state.skills.management.level * 6 + Random.float(0, 600)); }, risk: {} },
    // TODO: 待实现 - 职业规划咨询（参考真实职业规划师收入）
    // {
    //   id: "career_coach",
    //   name: "职业规划咨询",
    //   desc: "为求职者提供职业规划/简历优化/面试辅导。需要职场经验。",
    //   icon: "🎯",
    //   location: "commercialDist",
    //   requirements: { management: 25, intelligence: 35, ageMin: 28 },
    //   effects: { fatigue: 8, happiness: 5, managementXp: 2 },
    //   payCalc(state) { return Math.floor(150 + state.skills.management.level * 4 + Random.float(0, 300)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 心理咨询（参考真实心理咨询收入¥300-1000/小时）
    // {
    //   id: "freelance_psychology",
    //   name: "心理咨询",
    //   desc: "提供心理咨询服务。需要专业资质和同理心。",
    //   icon: "🧠",
    //   location: "commercialDist",
    //   requirements: { psychology: 30, mental: 40, ageMin: 25 },
    //   effects: { fatigue: 10, happiness: 5, mental: 2 },
    //   payCalc(state) { return Math.floor(200 + state.skills.psychology * 5 + Random.float(0, 500)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 健身私教（参考真实私教收入¥200-800/小时）
    // {
    //   id: "freelance_pt",
    //   name: "健身私教",
    //   desc: "一对一健身指导。需要健身教练证和过硬的身材。",
    //   icon: "💪",
    //   location: "commercialDist",
    //   requirements: { fitness_coach: 25, physique: 45, ageMin: 22 },
    //   effects: { fatigue: 15, physiqueXp: 3, happiness: 5 },
    //   payCalc(state) { return Math.floor(200 + state.skills.fitness_coach * 6 + Random.float(0, 400)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 整理收纳师（参考真实整理收纳师收入¥300-1000/小时）
    // {
    //   id: "freelance_organizer",
    //   name: "整理收纳",
    //   desc: "帮客户整理房间/衣柜/办公室。新兴高收入服务业。",
    //   icon: "📦",
    //   location: "commercialDist",
    //   requirements: { organizer: 20, mental: 25, ageMin: 22 },
    //   effects: { fatigue: 12, happiness: 8, organizerXp: 2 },
    //   payCalc(state) { return Math.floor(150 + state.skills.organizer * 5 + Random.float(0, 350)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 线上家教（参考真实线上家教收入¥50-200/小时）
    // { id: "freelance_tutor", name: "线上家教", icon: "📖", location: "school", requirements: { intelligence: 40, teaching: 20 }, effects: { fatigue: 10, intelligenceXp: 3, happiness: 8 }, payCalc: function(state) { return Math.floor(60 + state.skills.teaching.level * 3 + Random.float(0, 90)); }, risk: {} },
    // TODO: 待实现 - 代驾服务（参考真实代驾收入¥50-200/次）
    // { id: "代驾", name: "代驾服务", icon: "🚗", location: "commercialDist", requirements: { driving: 30, minAge: 25, maxAge: 50 }, effects: { fatigue: 12, agilityXp: 2, happiness: 2 }, payCalc: function(state) { return Math.floor(80 + state.skills.driving.level * 2 + Random.float(0, 120)); }, risk: { injury: 0.02 } },
    // TODO: 待实现 - 宠物遛狗（参考真实遛狗服务收入¥30-100/次）
    // {
    //   id: "freelance_dog_walker",
    //   name: "遛狗服务",
    //   desc: "帮忙碌的宠物主人遛狗。需要耐心和爱心。",
    //   icon: "🐕‍🦺",
    //   location: "commercialDist",
    //   requirements: { pet_care: 10, ageMin: 18 },
    //   effects: { fatigue: 8, happiness: 10, petCareXp: 2 },
    //   payCalc(state) { return Math.floor(40 + Random.float(0, 40)); },
    //   risk: {},
    // },
    // TODO: 待实现 - 陪诊服务（参考真实陪诊师收入¥100-300/次）
    // {
    //   id: "freelance_companion",
    //   name: "陪诊服务",
    //   desc: "帮老人/行动不便者去医院陪诊。需要耐心和细心。",
    //   icon: "🏥",
    //   location: "hospital",
    //   requirements: { mental: 25, ageMin: 22, maxAge: 55 },
    //   effects: { fatigue: 15, happiness: 5, caregiverXp: 2 },
    //   payCalc(state) { return Math.floor(80 + state.player.mental * 0.3 + Random.float(0, 80)); },
    //   risk: { illness: 0.02 },
    // },
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
