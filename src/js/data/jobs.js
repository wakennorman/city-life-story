/**
 * 街头工作定义（精简版 v2.1 — 20个代表性工作）
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
  // ====== 城中村（2个）=====
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
      // v3.8 P1修复：zhouScrapBonus（老周好感奖励→废品+20%）
      const zhouBonus = state.flags && state.flags.zhouScrapBonus ? 1.2 : 1.0;
      return Math.floor(base * Math.min(multi, 2) * zhouBonus);
    },
    risk: { injury: 0.01, illness: 0.005 },
  },
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

  // ====== 建筑工地（2个）=====
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
    risk: { injury: 0.03, illness: 0.02 },
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
    risk: { injury: 0.015 },
  },

  // ====== 工业区 — 工厂（1个）=====
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
      // v3.8 P1修复：zhangFactoryBonus（张姐好感80奖励→工厂+15%）
      const zhangBonus =
        state.flags && state.flags.zhangFactoryBonus ? 0.15 : 0;
      return Math.floor(
        (80 + state.player.agility * 0.3 + Random.float(0, 18)) *
          (1 + elecBonus + zhangBonus),
      );
    },
    risk: { injury: 0.03, illness: 0.02 },
  },

  // ====== 商业区 — 摆摊/餐饮（2个）=====
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
      // v3.8 P1修复：bossLiStallBonus（李工头好感奖励→摊位+10%）
      const liBonus = state.flags && state.flags.bossLiStallBonus ? 1.1 : 1.0;
      return Math.floor(base * footfall * liBonus);
    },
    startupCost: 50,
    risk: {},
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

  // ====== 商业区 — 服务/配送（2个）=====
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

  // ====== 大学城（1个）=====
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

  // ====== 科技园 — 白领/技术（2个）=====
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

  // ====== 其他地点（3个）=====
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
  {
    id: "hospital_companion",
    name: "陪诊服务",
    desc: "帮老人/行动不便者去医院陪诊挂号、取药。需要耐心和细心，收入稳定。",
    icon: "🏥",
    location: "hospital",
    requirements: { mental: 25, minAge: 22, maxAge: 55 },
    effects: { fatigue: 15, happiness: 5, caregiverXp: 2 },
    payCalc(state) {
      return Math.floor(80 + state.player.mental * 0.3 + Random.float(0, 80));
    },
    risk: { illness: 0.02 },
  },
  {
    id: "tutoring",
    name: "家教辅导",
    desc: "给中小学生辅导功课。智力要求不高，但需要耐心和责任心。",
    icon: "📚",
    location: "school",
    requirements: { intelligence: 20, minAge: 18 },
    effects: { fatigue: 8, intelligenceXp: 2, happiness: 5 },
    payCalc(state) {
      return Math.floor(
        40 + state.player.intelligence * 0.3 + Random.float(0, 30),
      );
    },
    risk: {},
  },
  {
    id: "factory_overtime",
    name: "工厂加班",
    desc: "工业区工厂招临时加班工。工资高但疲劳增加快，适合短期冲刺。",
    icon: "⏰",
    location: "factoryZone",
    requirements: { physique: 15, minAge: 18, maxAge: 45 },
    effects: { fatigue: 40, hygiene: -3, physiqueXp: 1 },
    payCalc(state) {
      return Math.floor(
        120 + state.player.physique * 0.4 + Random.float(0, 40),
      );
    },
    risk: { injury: 0.05, illness: 0.02 },
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
    // 批发市场地点工作（正式实现 — 参考真实批发行业就业）
    // 联动：wholesaleMarket 地点 jobs 数组需更新
    // ============================================================
    {
      id: "wholesale_delivery",
      name: "批发配送",
      desc: "帮批发商送货上门。需要会开车，体力好，收入稳定。",
      icon: "🚚",
      location: "wholesaleMarket",
      requirements: { driving: 10, minAge: 20, maxAge: 45 },
      effects: { fatigue: 25, agilityXp: 2 },
      payCalc(state) {
        const drivingBonus = state.skills.driving?.level || 0;
        return Math.floor(Random.float(50, 90) * (1 + drivingBonus * 0.02));
      },
      risk: { injury: 0.02 },
    },
    {
      id: "wholesale_sorting",
      name: "货物分拣",
      desc: "在批发市场仓库分拣货物。重复劳动但轻松，适合休息养病。",
      icon: "📦",
      location: "wholesaleMarket",
      requirements: { agility: 15, minAge: 18, maxAge: 45 },
      effects: { fatigue: 22, physiqueXp: 2 },
      payCalc(state) {
        return Math.floor(Random.float(40, 70));
      },
      risk: { injury: 0.03 },
    },
    // ──────── 注释掉的占位符工作已全部移除（v3.1 审查，约 500 行死代码） ────────
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
