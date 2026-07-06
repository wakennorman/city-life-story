/**
 * 地图地点数据
 * 11个地点，每个有：名称、描述、类型、可用工作、旅行连接
 */

const LOCATIONS = {
  slum: {
    id: "slum",
    name: "城中村",
    desc: "鱼龙混杂的城中村，房租便宜，机会也多。",
    type: "residential",
    jobs: ["waste_recycling", "street_vending_goods"],
    priceMod: {
      water: 0.9,
      snacks: 0.85,
      noodles: 0.8,
      scrap_metal: 1.6,
      scrap_paper: 1.5,
      scrap_plastic: 1.5,
      daily_use: 0.7,
    },
  },
  wholesaleMarket: {
    id: "wholesaleMarket",
    name: "批发市场",
    desc: "各种商品批发的集散地，进货的天堂。",
    type: "commercial",
    jobs: ["street_vending_goods", "warehouse_worker"],
    priceMod: {
      water: 0.6,
      snacks: 0.55,
      noodles: 0.5,
      cigarettes: 0.7,
      beer: 0.7,
      clothing: 0.6,
      electronics: 0.55,
      fruits: 0.5,
      vegetables: 0.5,
    },
  },
  construction: {
    id: "construction",
    name: "建筑工地",
    desc: "尘土飞扬的建筑工地，到处是钢筋水泥。",
    type: "industrial",
    jobs: [
      "manual_labor_construction",
      "skilled_labor_construction",
      "street_vending_goods",
    ],
    priceMod: {
      water: 1.3,
      snacks: 1.2,
      cigarettes: 1.3,
      beer: 1.4,
      scrap_metal: 0.5,
      scrap_paper: 0.6,
      scrap_plastic: 0.6,
      daily_use: 1.2,
    },
  },
  factoryZone: {
    id: "factoryZone",
    name: "工业区",
    desc: "工厂聚集的工业区，机器轰鸣声不绝于耳。",
    type: "industrial",
    jobs: [
      "factory_work_assembly",
      "factory_overtime",
      "security_guard",
      "warehouse_worker",
      "street_vending_food",
    ],
    priceMod: {
      water: 1.1,
      snacks: 1.0,
      noodles: 1.0,
      cigarettes: 1.2,
      beer: 1.2,
    },
  },
  school: {
    id: "school",
    name: "大学城",
    desc: "高校云集的大学城，年轻人多，机会特殊。",
    type: "institutional",
    jobs: [
      "school_maintenance",
      "package_delivery",
      "tutoring",
      "street_vending_food",
      "street_vending_goods",
    ],
    priceMod: {
      water: 0.8,
      snacks: 0.9,
      noodles: 0.9,
      fruits: 1.0,
      vegetables: 1.0,
    },
  },
  commercialDist: {
    id: "commercialDist",
    name: "商业区",
    desc: "繁华的商业地段，人来人往，商机无限。",
    type: "commercial",
    jobs: [
      "street_vending_food",
      "food_stall",
      "barber",
      "cleaning_service",
      "repair_service",
      "delivery_rider",
      "street_performer",
    ],
    priceMod: {
      water: 1.3,
      snacks: 1.4,
      noodles: 1.3,
      cigarettes: 1.4,
      beer: 1.5,
      clothing: 1.5,
      electronics: 1.6,
      fruits: 1.6,
      vegetables: 1.5,
    },
  },
  techPark: {
    id: "techPark",
    name: "科技园",
    desc: "互联网大厂的聚集地，高楼林立，精英云集。",
    type: "corporate",
    jobs: ["street_vending_food", "street_vending_goods"],
    priceMod: {
      water: 1.5,
      snacks: 1.3,
      instant_noodles: 1.2,
      coffee: 1.4,
      cigarettes: 1.3,
      electronics: 0.7,
      clothing: 0.8,
      daily_use: 1.2,
    },
  },
  hospital: {
    id: "hospital",
    name: "医院",
    desc: "看病治疗的地方。健康是革命的本钱。",
    type: "service",
    jobs: ["street_vending_food", "street_vending_goods"],
    priceMod: {
      water: 1.4,
      snacks: 1.3,
      fruits: 1.5,
      daily_use: 1.2,
    },
  },
  bank: {
    id: "bank",
    name: "银行",
    desc: "存取款、办理贷款。",
    type: "service",
    jobs: ["street_vending_goods"],
    priceMod: {
      water: 1.5,
      snacks: 1.4,
      cigarettes: 1.3,
    },
  },
  park: {
    id: "park",
    name: "公园",
    desc: "城市中的绿洲，可以放松身心。",
    type: "recreation",
    jobs: ["street_vending_food", "street_vending_goods"],
    priceMod: {
      water: 1.2,
      snacks: 1.1,
      fruits: 0.8,
      beer: 1.1,
    },
  },
  trainingCenter: {
    id: "trainingCenter",
    name: "培训中心",
    desc: "学习技能、考取证书的地方。投资自己。",
    type: "education",
    jobs: ["street_vending_food", "street_vending_goods"],
    priceMod: {
      water: 1.3,
      snacks: 1.2,
      instant_noodles: 1.1,
    },
  },
};

// 旅行图（哪些地点之间可以直接通行）
const TRAVEL_GRAPH = {
  slum: ["wholesaleMarket", "construction", "park", "bank"],
  wholesaleMarket: ["slum", "commercialDist", "factoryZone"],
  construction: ["slum", "commercialDist"],
  factoryZone: ["wholesaleMarket", "school", "hospital"],
  school: ["factoryZone", "park", "trainingCenter"],
  commercialDist: ["wholesaleMarket", "construction", "techPark", "hospital"],
  techPark: ["commercialDist"],
  hospital: ["factoryZone", "commercialDist"],
  bank: ["slum", "commercialDist"],
  park: ["slum", "school", "commercialDist"],
  trainingCenter: ["school"],
};

// 地点间距离（对称矩阵），用于计算旅行AP消耗
// 距离1=近(10AP), 2=中(20AP), 3=远(30AP)
const TRAVEL_DISTANCES = {
  slum: { wholesaleMarket: 1, construction: 1, park: 1, bank: 1 },
  wholesaleMarket: { slum: 1, commercialDist: 2, factoryZone: 2 },
  construction: { slum: 1, commercialDist: 2 },
  factoryZone: { wholesaleMarket: 2, school: 1, hospital: 2 },
  school: { factoryZone: 1, park: 2, trainingCenter: 1 },
  commercialDist: {
    wholesaleMarket: 2,
    construction: 2,
    techPark: 2,
    hospital: 2,
  },
  techPark: { commercialDist: 2 },
  hospital: { factoryZone: 2, commercialDist: 2 },
  bank: { slum: 1, commercialDist: 2 },
  park: { slum: 1, school: 2, commercialDist: 1 },
  trainingCenter: { school: 1 },
};

// 行动力消耗常量
const AP_COSTS = {
  // 旅行
  travel_per_distance: 8, // 每单位距离消耗8AP

  // 工作
  job_light: 20, // 轻度工作（收废品、送快递等）
  job_medium: 30, // 中度工作（摆摊、小贩等）
  job_heavy: 45, // 重度工作（建筑工、工厂加班等）
  job_skilled: 25, // 技能工作（家教、维修等）

  // 日常
  eat: 5, // 吃饭
  rest: 15, // 休息
  shower: 5, // 洗澡
  study: 25, // 自学
  relax: 10, // 公园放松
  heal: 20, // 看病

  // 银行
  deposit: 5, // 存款
  withdraw: 5, // 取款
  loan: 10, // 贷款
  repay: 5, // 还债

  // 社交
  talk_npc: 6, // 与NPC交谈

  // 住所/仓储
  upgrade_housing: 12, // 搬家升级
  rent_storage: 8, // 租仓库
  buy_backpack: 5, // 买背包

  // 投资
  check_investment: 5, // 查看行情
  trade_stock: 8, // 买卖股票/比特币
  buy_realestate: 15, // 买房
  buy_vehicle: 12, // 买车

  // 职场
  corp_action: 12, // 职场行动（每季度有限次数）

  // 考证
  take_exam: 25, // 参加考试

  // 应聘
  interview: 15, // 面试
};

/** 获取地点信息 */
function getLocation(locKey) {
  return LOCATIONS[locKey] || null;
}

/** 获取从当前地点可到达的地点 */
function getReachableLocations(currentKey) {
  return TRAVEL_GRAPH[currentKey] || [];
}

/** 获取当前地点可做的工作列表 */
function getJobsAtLocation(locKey) {
  const loc = LOCATIONS[locKey];
  if (!loc) return [];
  return loc.jobs || [];
}
