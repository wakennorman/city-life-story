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
    footfall: 0.6,
    vendingNote: "本地居民为主，消费力弱",
    jobs: ["waste_recycling", "street_vending_goods", "street_vending_food"],
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
    footfall: 0.9,
    vendingNote: "批发商多，但也有零散买家",
    jobs: ["street_vending_goods", "warehouse_worker"],
    priceMod: {
      water: 0.8,
      snacks: 0.78,
      noodles: 0.75,
      cigarettes: 0.85,
      beer: 0.82,
      clothing: 0.8,
      electronics: 0.8,
      fruits: 0.75,
      vegetables: 0.75,
    },
  },
  construction: {
    id: "construction",
    name: "建筑工地",
    desc: "尘土飞扬的建筑工地，到处是钢筋水泥。",
    type: "industrial",
    footfall: 0.5,
    vendingNote: "工人偶尔消费，管理严格",
    jobs: [
      "manual_labor_construction",
      "skilled_labor_construction",
      "street_vending_food",
    ],
    priceMod: {},
  },
  factoryZone: {
    id: "factoryZone",
    name: "工业区",
    desc: "工厂聚集的工业区，机器轰鸣声不绝于耳。",
    type: "industrial",
    footfall: 1.0,
    vendingNote: "午休工人是主力消费群体",
    jobs: [
      "factory_work_assembly",
      "factory_overtime",
      "security_guard",
      "warehouse_worker",
      "street_vending_food",
      "street_vending_goods",
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
    footfall: 1.2,
    vendingNote: "学生零食消费旺盛，均价稍低",
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
    footfall: 1.8,
    vendingNote: "主商圈，客流量最大，但城管也多",
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
      water: 1.1,
      snacks: 1.15,
      noodles: 1.1,
      cigarettes: 1.15,
      beer: 1.2,
      clothing: 1.15,
      electronics: 1.15,
      fruits: 1.18,
      vegetables: 1.15,
    },
  },
  techPark: {
    id: "techPark",
    name: "科技园",
    desc: "互联网大厂的聚集地，高楼林立，精英云集。",
    type: "corporate",
    footfall: 0.7,
    vendingNote: "白领消费力强但习惯点外卖",
    jobs: ["street_vending_food"],
    priceMod: {},
  },
  hospital: {
    id: "hospital",
    name: "医院",
    desc: "看病治疗的地方。健康是革命的本钱。",
    type: "service",
    footfall: 0.8,
    vendingNote: "探病家属是主要客群",
    jobs: [],
    priceMod: {},
  },
  bank: {
    id: "bank",
    name: "银行",
    desc: "存取款、办理贷款。",
    type: "service",
    footfall: 0.4,
    vendingNote: "人流稀少，不适合摆摊",
    jobs: [],
    priceMod: {},
  },
  park: {
    id: "park",
    name: "公园",
    desc: "城市中的绿洲，可以放松身心。",
    type: "recreation",
    footfall: 1.0,
    vendingNote: "周末家庭聚集，工作日冷清",
    jobs: [
      "street_vending_food",
      "street_vending_goods",
      "street_performer",
      "busking",
    ],
    priceMod: {},
  },
  trainingCenter: {
    id: "trainingCenter",
    name: "培训中心",
    desc: "学习技能、考取证书的地方。投资自己。",
    type: "education",
    footfall: 0.7,
    vendingNote: "学员课间小消费",
    jobs: [],
    priceMod: {},
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
