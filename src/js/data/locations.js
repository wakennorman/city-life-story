/**
 * 地图地点数据
 * 11个地点，每个有：名称、描述、类型、可用工作、旅行连接
 */

const LOCATIONS = {
  slum: {
    id: "slum",
    name: "城中村",
    icon: "🏘️",
    desc: "鱼龙混杂的城中村，房租便宜，机会也多。",
    type: "residential",
    wealthTier: 1, // 1=贫困区 2=中等 3=富裕区 — 影响 amenity 档次和旅行AP
    footfall: 0.6,
    vendingNote: "本地居民为主，消费力弱",
    specialties: ["scrap_metal", "scrap_paper", "scrap_plastic"], // 区域特产（必出）
    dailyProbability: 0.4, // 非特产商品出现概率
    specialCategory: ["scrap"], // 此类别商品额外+0.3概率
    jobs: ["waste_recycling", "street_vending_food"],
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
    icon: "🏪",
    desc: "各种商品批发的集散地，进货的天堂。",
    type: "commercial",
    wealthTier: 2,
    footfall: 0.9,
    vendingNote: "批发商多，但也有零散买家",
    specialties: [], // 批发市场：所有商品由 getDailyGoodsForLocation 特殊处理
    dailyProbability: 1.0, // 批发市场所有商品都会出现
    specialCategory: [],
    jobs: ["wholesale_delivery", "wholesale_sorting"],
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
    icon: "🏗️",
    desc: "尘土飞扬的建筑工地，到处是钢筋水泥。",
    type: "industrial",
    wealthTier: 1,
    footfall: 0.5,
    vendingNote: "工人偶尔消费，管理严格",
    specialties: ["water", "beer", "cigarettes", "instant_noodles"],
    dailyProbability: 0.3,
    specialCategory: ["luxury", "food"],
    jobs: ["manual_labor_construction", "premium_engineering"],
    priceMod: {},
  },
  factoryZone: {
    id: "factoryZone",
    name: "工业区",
    icon: "🏭",
    desc: "工厂聚集的工业区，机器轰鸣声不绝于耳。",
    type: "industrial",
    wealthTier: 2,
    footfall: 1.0,
    vendingNote: "午休工人是主力消费群体",
    specialties: ["beer", "cigarettes", "water", "instant_noodles"],
    dailyProbability: 0.5,
    specialCategory: ["food", "daily"],
    priceMod: {
      water: 1.1,
      snacks: 1.0,
      noodles: 1.0,
      cigarettes: 1.2,
      beer: 1.2,
    },
    jobs: ["factory_work_assembly", "factory_overtime"],
  },
  school: {
    id: "school",
    name: "大学城",
    icon: "🎓",
    desc: "高校云集的大学城，年轻人多，机会特殊。",
    type: "institutional",
    wealthTier: 2,
    footfall: 1.2,
    vendingNote: "学生零食消费旺盛，均价稍低",
    specialties: ["fruits", "vegetables", "snacks"],
    dailyProbability: 0.5,
    specialCategory: ["food", "clothing"],
    jobs: ["tutoring", "xiao_mei_tutoring"],
    // navHints 演示：百科条目会自动读取此字段生成额外导航按钮
    navHints: [
      {
        type: "subTab",
        tab: "me",
        subTab: "me_growth",
        key: "me_growth",
        label: "🎓 查看学历",
      },
      {
        type: "subTab",
        tab: "career",
        subTab: "career_jobs",
        key: "career_jobs",
        label: "💼 查看职业路径",
      },
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
    icon: "🏬",
    desc: "繁华的商业地段，人来人往，商机无限。",
    type: "commercial",
    wealthTier: 3,
    footfall: 1.8,
    vendingNote: "主商圈，客流量最大，但城管也多",
    specialties: ["clothing", "electronics", "beer", "cigarettes", "fruits"],
    dailyProbability: 0.6,
    specialCategory: ["clothing", "electronics", "luxury"],
    jobs: [
      "street_vending_food",
      "sister_zhang_vending",
      "delivery_rider",
      "restaurant_assistant",
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
    icon: "💻",
    desc: "互联网大厂的聚集地，高楼林立，精英云集。",
    type: "corporate",
    wealthTier: 3,
    footfall: 0.7,
    vendingNote: "白领消费力强但习惯点外卖",
    specialties: ["electronics", "daily_use", "snacks"],
    dailyProbability: 0.4,
    specialCategory: ["electronics"],
    jobs: ["content_writing", "junior_analyst"],
    priceMod: {},
  },
  hospital: {
    id: "hospital",
    name: "医院",
    icon: "🏥",
    desc: "看病治疗的地方。健康是革命的本钱。",
    type: "service",
    wealthTier: 2,
    footfall: 0.8,
    vendingNote: "探病家属是主要客群",
    specialties: ["fruits", "water", "snacks"],
    dailyProbability: 0.3,
    specialCategory: ["food"],
    jobs: ["hospital_caregiver", "hospital_companion"],
    priceMod: {},
  },
  bank: {
    id: "bank",
    name: "银行",
    icon: "🏦",
    desc: "存取款、办理贷款。",
    type: "service",
    wealthTier: 2,
    footfall: 0.4,
    vendingNote: "人流稀少，不适合摆摊",
    specialties: [],
    dailyProbability: 0.2,
    specialCategory: [],
    jobs: ["bank_security"],
    priceMod: {},
  },
  park: {
    id: "park",
    name: "公园",
    icon: "🌳",
    desc: "城市中的绿洲，可以放松身心。",
    type: "recreation",
    wealthTier: 2,
    footfall: 1.0,
    vendingNote: "周末家庭聚集，工作日冷清",
    specialties: ["snacks", "water", "fruits"],
    dailyProbability: 0.5,
    specialCategory: ["food"],
    jobs: ["busking"],
    priceMod: {},
  },
  trainingCenter: {
    id: "trainingCenter",
    name: "培训中心",
    icon: "📚",
    desc: "学习技能、考取证书的地方。投资自己。",
    type: "education",
    wealthTier: 2,
    footfall: 0.7,
    vendingNote: "学员课间小消费",
    specialties: ["daily_use", "snacks", "water"],
    dailyProbability: 0.3,
    specialCategory: [],
    jobs: ["training_assistant"],
    priceMod: {},
  },

  // ============================================================
  // 待完成：新增地点 — 参考《大多数》地图系统《北京浮生记》真实中国城市地图
  // 实现提示：在 LOCATIONS 对象中追加，并在 TRAVEL_GRAPH 中配置连接关系
  // 参考来源：
  //   - 《大多数》地图系统：游戏化地点设计思路
  //   - 《北京浮生记》：真实北京城市地图
  //   - 真实中国城市功能区划分
  // ============================================================
  //
  // === 居住区扩展 ===
  suburb: {
    id: "suburb",
    name: "郊区",
    icon: "🌆",
    desc: "城市边缘的郊区，安静但交通不便。房租便宜，适合养病/休息。",
    type: "residential",
    wealthTier: 2,
    footfall: 0.4,
    vendingNote: "客流量少，适合长期居住不适合摆摊",
    specialties: ["vegetables", "fruits"],
    dailyProbability: 0.3,
    specialCategory: ["food"],
    // 注：suburb_cleaning/suburb_security 尚未在 jobs.js 定义，暂不开放
    jobs: [],
    priceMod: {
      water: 0.85,
      vegetables: 0.8,
      fruits: 0.85,
    },
    weatherEffects: {
      rain: { footfallMod: 0.5 },
      snow: { footfallMod: 0.3 },
    },
  },
  // TODO: 待实现 - 高档小区（参考真实高档小区，富人有保安门禁）
  // {
  //   id: "luxury_community",
  //   name: "高档小区",
  //   desc: "高档封闭式小区，有物业和保安。普通摆摊进不去，但可以提供上门服务。",
  //   type: "residential",
  //   wealthTier: 3,
  //   footfall: 0.3,
  //   vendingNote: "门禁严格，需要预约才能进入",
  //   specialties: ["luxury", "electronics"],
  //   dailyProbability: 0.2,
  //   specialCategory: ["luxury"],
  //   jobs: ["premium_housekeeper", "chauffeur"],
  //   priceMod: {
  //     clothing: 1.3,
  //     electronics: 1.2,
  //     luxury: 1.4,
  //   },
  // },
  // TODO: 待实现 - 老旧小区（参考真实老旧小区，设施陈旧但生活便利）
  // {
  //   id: "old_community",
  //   name: "老旧小区",
  //   desc: "90年代建的老小区，设施陈旧但生活便利。居民多为本地老住户。",
  //   type: "residential",
  //   wealthTier: 2,
  //   footfall: 0.7,
  //   vendingNote: "老年居民多，消费习惯保守",
  //   specialties: ["daily_use", "food"],
  //   dailyProbability: 0.4,
  //   specialCategory: ["daily", "food"],
  //   jobs: ["cleaning_service", "repair_service"],
  //   priceMod: {
  //     daily_use: 0.9,
  //     food: 0.85,
  //   },
  // },
  //
  // === 公共服务区 ===
  gov_office: {
    id: "gov_office",
    name: "政府办事大厅",
    icon: "🏛️",
    desc: "办理各种证件/业务的地方。办证/贷款/社保都在这里。",
    type: "service",
    wealthTier: 2,
    footfall: 0.5,
    vendingNote: "人流稀少，不适合摆摊",
    specialties: [],
    dailyProbability: 0.2,
    specialCategory: [],
    jobs: [],
    priceMod: {},
    specialActions: ["办身份证", "办护照", "办社保卡", "申请低保", "办理贷款"],
  },
  // TODO: 待实现 - 法院/司法局（参考真实司法机构）
  // {
  //   id: "court",
  //   name: "法院",
  //   desc: "打官司的地方。可以起诉欠债不还、劳动纠纷等。",
  //   type: "service",
  //   wealthTier: 2,
  //   footfall: 0.3,
  //   vendingNote: "严肃场所，不适合摆摊",
  //   specialties: [],
  //   dailyProbability: 0.1,
  //   specialCategory: [],
  //   jobs: [],
  //   priceMod: {},
  //   specialActions: ["起诉欠债", "劳动仲裁", "法律咨询"],
  // },
  // TODO: 待实现 - 人才市场（参考真实人才交流中心）
  // {
  //   id: "job_market",
  //   name: "人才市场",
  //   desc: "找工作、招聘的地方。每周有招聘会，可以投简历。",
  //   type: "service",
  //   wealthTier: 2,
  //   footfall: 0.8,
  //   vendingNote: "求职者多，但消费力弱",
  //   specialties: ["daily_use"],
  //   dailyProbability: 0.3,
  //   specialCategory: ["daily"],
  //   jobs: [],
  //   priceMod: { daily_use: 0.9 },
  //   specialActions: ["投简历", "参加招聘会", "职业咨询"],
  // },
  //
  // === 娱乐休闲区 ===
  entertainment: {
    id: "entertainment",
    name: "娱乐城",
    icon: "🎮",
    desc: "电影院/KTV/游戏厅聚集地。放松娱乐，消耗现金。",
    type: "recreation",
    wealthTier: 3,
    footfall: 1.5,
    vendingNote: "年轻人多，消费力强",
    specialties: ["snacks", "beer", "electronics"],
    dailyProbability: 0.6,
    specialCategory: ["luxury", "food"],
    // 注：entertainment_staff/game_attendant 尚未在 jobs.js 定义，暂不开放
    jobs: [],
    priceMod: {
      snacks: 1.2,
      beer: 1.3,
      electronics: 1.1,
    },
  },
  temple: {
    id: "temple",
    name: "寺庙",
    icon: "⛩️",
    desc: "城市中的古老寺庙。祈福/冥想/心灵慰藉。",
    type: "recreation",
    wealthTier: 2,
    footfall: 0.6,
    vendingNote: "香客多，不适合摆摊",
    specialties: ["fruits", "water"],
    dailyProbability: 0.3,
    specialCategory: [],
    jobs: [],
    priceMod: {
      fruits: 1.1,
      water: 1.05,
    },
    specialActions: ["祈福", "冥想", "捐香火钱", "求签"],
  },
  // TODO: 待实现 - 图书馆（参考真实公共图书馆）
  // {
  //   id: "library",
  //   name: "图书馆",
  //   desc: "免费看书学习的地方。环境好，可以静心学习技能。",
  //   type: "education",
  //   wealthTier: 2,
  //   footfall: 0.5,
  //   vendingNote: "安静场所，禁止摆摊",
  //   specialties: [],
  //   dailyProbability: 0.2,
  //   specialCategory: [],
  //   jobs: [],
  //   priceMod: {},
  //   specialActions: ["借书学习", "自习", "参加读书会"],
  // },
  // TODO: 待实现 - 体育馆/健身房（参考真实公共体育设施）
  // {
  //   id: "gym",
  //   name: "体育馆",
  //   desc: "可以健身/打球/游泳的地方。增强体质的好去处。",
  //   type: "recreation",
  //   wealthTier: 2,
  //   footfall: 0.8,
  //   vendingNote: "运动人群多，消费力中等",
  //   specialties: ["sports_equipment", "snacks"],
  //   dailyProbability: 0.4,
  //   specialCategory: ["daily"],
  //   jobs: ["gym_coach"],
  //   priceMod: { snacks: 1.1, sports_equipment: 1.0 },
  // },
  // TODO: 待实现 - 网吧（参考真实网吧/电竞馆）
  // {
  //   id: "internet_cafe",
  //   name: "网吧",
  //   desc: "上网/打游戏的地方。可以接线上任务，也可以消磨时间。",
  //   type: "recreation",
  //   wealthTier: 2,
  //   footfall: 0.7,
  //   vendingNote: "年轻人多，零食饮料消费旺盛",
  //   specialties: ["snacks", "beverages"],
  //   dailyProbability: 0.5,
  //   specialCategory: ["food"],
  //   jobs: ["data_entry"],
  //   priceMod: { snacks: 1.0, beverages: 1.0 },
  // },
  // 菜市场（市场下沿，食材供应链终端）
  // vegetable_market: {
  //   id: "vegetable_market",
  //   name: "菜市场",
  //   desc: "买菜的地方。新鲜食材最便宜，但环境嘈杂。",
  //   type: "commercial",
  //   wealthTier: 2,
  //   footfall: 1.2,
  //   vendingNote: "买菜人多，但消费力有限",
  //   specialties: ["vegetables", "fruits", "meat", "seafood"],
  //   dailyProbability: 0.8,
  //   specialCategory: ["food"],
  //   jobs: ["street_vending_food"],
  //   priceMod: {
  //     vegetables: 0.7,
  //     fruits: 0.75,
  //     meat: 0.85,
  //     seafood: 0.8,
  //   },
  // },
  // TODO: 待实现 - 物流园区（参考真实物流集散中心）
  // {
  //   id: "logistics_park",
  //   name: "物流园区",
  //   desc: "快递/物流集散中心。工作机会多，但环境嘈杂。",
  //   type: "industrial",
  //   wealthTier: 2,
  //   footfall: 1.0,
  //   vendingNote: "快递员和司机是主力消费群体",
  //   specialties: ["food", "daily_use"],
  //   dailyProbability: 0.5,
  //   specialCategory: ["food", "daily"],
  //   jobs: ["package_delivery", "warehouse_worker", "logistics_sorting"],
  //   priceMod: { food: 0.9, daily_use: 0.85 },
  // },
  // TODO: 待实现 - 汽车城/4S店集群（参考真实汽车商圈）
  // {
  //   id: "auto_city",
  //   name: "汽车城",
  //   desc: "4S店和二手车市场聚集地。可以买车/修车/找工作。",
  //   type: "commercial",
  //   wealthTier: 3,
  //   footfall: 0.6,
  //   vendingNote: "看车人多，但买车人少",
  //   specialties: ["electronics", "luxury"],
  //   dailyProbability: 0.3,
  //   specialCategory: ["electronics"],
  //   jobs: ["auto_repair", "car_sales"],
  //   priceMod: { electronics: 1.1 },
  // },
  // TODO: 待实现 - 花鸟市场（参考真实花鸟鱼虫市场）
  // {
  //   id: "flower_bird_market",
  //   name: "花鸟市场",
  //   desc: "卖花/宠物/观赏鱼的地方。喜欢动植物的天堂。",
  //   type: "recreation",
  //   wealthTier: 2,
  //   footfall: 0.5,
  //   vendingNote: "爱好者多，消费力中等",
  //   specialties: ["flowers", "pets"],
  //   dailyProbability: 0.3,
  //   specialCategory: [],
  //   jobs: ["pet_sitter"],
  //   priceMod: {},
  // },
  // TODO: 待实现 - 二手市场/跳蚤市场（参考真实二手交易市场）
  // {
  //   id: "flea_market",
  //   name: "二手市场",
  //   desc: "淘二手货的地方。可以低价买入高价卖出，考验眼光。",
  //   type: "commercial",
  //   wealthTier: 2,
  //   footfall: 0.8,
  //   vendingNote: "淘货人多，消费力参差不齐",
  //   specialties: ["clothing", "electronics", "books"],
  //   dailyProbability: 0.5,
  //   specialCategory: ["clothing", "electronics"],
  //   jobs: ["street_vending_goods"],
  //   priceMod: {
  //     clothing: 0.7,
  //     electronics: 0.75,
  //     books: 0.6,
  //   },
  // },
  vegetable_market: {
    id: "vegetable_market",
    name: "菜市场",
    desc: "买菜的地方。新鲜食材最便宜，但环境嘈杂。讨价还价的唇枪舌剑此起彼伏。",
    type: "commercial",
    wealthTier: 2,
    footfall: 1.2,
    vendingNote: "买菜人多，但消费力有限",
    specialties: ["vegetables", "fruits", "meat", "seafood"],
    dailyProbability: 0.8,
    specialCategory: ["food"],
    jobs: ["street_vending_food"],
    priceMod: {
      vegetables: 0.7,
      fruits: 0.75,
      meat: 0.85,
      seafood: 0.8,
    },
  },
};

// 旅行图（哪些地点之间可以直接通行）
// v4.0 重构：按真实中国城市地理重新设计
// v3.44 补丁：全图双向化——所有 A→B 同步保证 B→A
//   图直径=4跳，步行最大AP=28，不再出现99跳/598AP的显示bug
//   新增回边：commercialDist→construction, factoryZone→suburb,
//             school→hospital, school→temple, park→temple
const TRAVEL_GRAPH = {
  // 核心枢纽：商业区连接各类核心设施（含工地回边）
  commercialDist: [
    "wholesaleMarket",
    "techPark",
    "hospital",
    "bank",
    "gov_office",
    "entertainment",
    "construction",
    "vegetable_market",
  ],
  // 内城区：城中村位于核心区边缘
  slum: ["wholesaleMarket", "construction", "park", "bank", "vegetable_market"],
  // 商业物流：批发市场连接工业区和中心区
  wholesaleMarket: [
    "slum",
    "commercialDist",
    "factoryZone",
    "vegetable_market",
  ],
  // 菜市场：紧邻批发市场，买菜人流密集
  vegetable_market: ["wholesaleMarket", "slum", "commercialDist", "park"],
  // 建设区：工地连接城中村和商业区
  construction: ["slum", "commercialDist"],
  // 工业区：在外围，连接批发市场/大学城/郊区（郊区回边）
  factoryZone: ["wholesaleMarket", "school", "suburb"],
  // 大学城：教育集群，连接工业区/公园/培训/娱乐/医院/寺庙（双向补全）
  school: [
    "factoryZone",
    "park",
    "trainingCenter",
    "entertainment",
    "hospital",
    "temple",
  ],
  // 科技园：靠近商业区和娱乐城
  techPark: ["commercialDist", "entertainment"],
  // 医院：医疗集群，连接商业区和大学城
  hospital: ["commercialDist", "school"],
  // 银行：金融中心，连接城中村/商业区/政府
  bank: ["slum", "commercialDist", "gov_office"],
  // 公园：绿色过渡带，连接城中村/大学城/郊区/寺庙（寺庙回边）
  park: ["slum", "school", "suburb", "temple"],
  // 培训中心：紧邻大学城
  trainingCenter: ["school"],
  // 郊区：最外围，通过公园或工业区进入
  suburb: ["park", "factoryZone"],
  // 政府：靠近商业区和银行
  gov_office: ["commercialDist", "bank"],
  // 娱乐城：连接商业区/科技园/大学城
  entertainment: ["commercialDist", "techPark", "school"],
  // 寺庙：位于公园旁/大学城周边；park和school均已添加回边
  temple: ["park", "school"],
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

/**
 * 打车费用：按距离（跳数）递增，可达任意地点
 *   1跳=¥12, 2跳=¥16, 3跳=¥20 ... 封顶¥40
 *   不可达（hops>=99）时按远距离 fallback=¥35
 */
function getTaxiCost(fromKey, toKey) {
  if (fromKey === toKey) return 0;
  var hops = getLocationHops(fromKey, toKey);
  if (hops >= 99) return 35; // 远距离 fallback
  return Math.min(40, 8 + hops * 4);
}

/** BFS 计算两地最短跳数（同地=0，无连通=99） */
function getLocationHops(fromKey, toKey) {
  if (fromKey === toKey) return 0;
  if (!TRAVEL_GRAPH[fromKey] || !LOCATIONS[toKey]) return 99;
  var visited = {};
  visited[fromKey] = 0;
  var queue = [fromKey];
  while (queue.length) {
    var cur = queue.shift();
    var dist = visited[cur];
    var neighbors = TRAVEL_GRAPH[cur] || [];
    for (var i = 0; i < neighbors.length; i++) {
      var n = neighbors[i];
      if (visited[n] !== undefined) continue;
      visited[n] = dist + 1;
      if (n === toKey) return dist + 1;
      queue.push(n);
    }
  }
  return 99; // 不可达
}

/**
 * 计算从 from 到 to 的旅行AP消耗。
 *   基础: 12 + (hops-1) × 4
 *   富裕带间通行(tier3→tier3): -3
 *   贫→富(tier1→tier3): +2 (穷富差距大)
 *   驾驶技能减免、老周三轮车减免
 *   保底 5 AP
 */
function getTravelApCost(fromKey, toKey, state) {
  var hops = getLocationHops(fromKey, toKey);
  if (hops <= 0) return 0;
  if (hops >= 99) return 99; // 不连通

  var base = 12 + (hops - 1) * 4;

  var fromLoc = LOCATIONS[fromKey];
  var toLoc = LOCATIONS[toKey];
  var ft = (fromLoc && fromLoc.wealthTier) || 2;
  var tt = (toLoc && toLoc.wealthTier) || 2;
  if (ft === 3 && tt === 3) base -= 3; // 富区互通方便
  if ((ft === 1 && tt === 3) || (ft === 3 && tt === 1)) base += 2; // 贫富两端跨区

  // 驾驶技能减免
  if (state && state.skills && state.skills.driving) {
    var reduction =
      typeof getTravelApReduction === "function"
        ? getTravelApReduction(state.skills.driving.level || 0)
        : 0;
    base -= reduction;
  }
  // 老周三轮车
  if (state && state.flags && state.flags.oldZhouTricycle) base -= 2;

  // 天气AP修正（天气深化系统）：大雾/暴雨/台风增加出行消耗
  if (typeof getWeatherTravelApMod === "function") {
    var weatherApMod = getWeatherTravelApMod(state);
    if (weatherApMod !== 1.0) {
      base = Math.round(base * weatherApMod);
    }
  }

  return Math.max(5, base);
}
