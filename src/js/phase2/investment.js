/**
 * 投资系统 — 股票 / 比特币 / 贵金属 / 期货基金 / 房地产 / 汽车
 */

const INV_STOCKS = [
  // ========== 股票（30只，映射真实名企） ==========
  // 科技互联网（映射：阿里/腾讯/百度/京东/拼多多/小米/美团/网易/字节/B站/快手/滴滴）
  {
    symbol: "ALIM",
    name: "阿里妈妈",
    category: "股票",
    industry: "科技",
    basePrice: 180,
    volatility: 0.15,
    trend: 0.003,
    desc: "电商帝国,受双11/618大促利好",
  },
  {
    symbol: "TENC",
    name: "腾飞控股",
    category: "股票",
    industry: "科技",
    basePrice: 320,
    volatility: 0.12,
    trend: 0.004,
    desc: "社交+游戏霸主,政策敏感",
  },
  {
    symbol: "BAID",
    name: "百寻科技",
    category: "股票",
    industry: "科技",
    basePrice: 95,
    volatility: 0.14,
    trend: -0.002,
    desc: "AI搜索转型中,自动驾驶概念",
  },
  {
    symbol: "JD",
    name: "京西商城",
    category: "股票",
    industry: "科技",
    basePrice: 55,
    volatility: 0.16,
    trend: 0.001,
    desc: "自营电商+物流,618主场",
  },
  {
    symbol: "PDD",
    name: "拼少少",
    category: "股票",
    industry: "科技",
    basePrice: 38,
    volatility: 0.22,
    trend: 0.005,
    desc: "下沉市场之王,增长迅猛",
  },
  {
    symbol: "XIAO",
    name: "小麦科技",
    category: "股票",
    industry: "科技",
    basePrice: 22,
    volatility: 0.18,
    trend: 0.002,
    desc: "手机+IoT+汽车,生态链",
  },
  {
    symbol: "MEIT",
    name: "美团团",
    category: "股票",
    industry: "科技",
    basePrice: 120,
    volatility: 0.17,
    trend: 0.003,
    desc: "本地生活霸主,外卖+到店",
  },
  {
    symbol: "NETE",
    name: "网难游戏",
    category: "股票",
    industry: "科技",
    basePrice: 75,
    volatility: 0.15,
    trend: 0.001,
    desc: "游戏+音乐,现金牛稳定",
  },
  {
    symbol: "BYTE",
    name: "字节龙",
    category: "股票",
    industry: "科技",
    basePrice: 280,
    volatility: 0.16,
    trend: 0.004,
    desc: "短视频+AI全球扩张",
  },
  {
    symbol: "BILI",
    name: "噼哩噼哩",
    category: "股票",
    industry: "科技",
    basePrice: 18,
    volatility: 0.24,
    trend: -0.003,
    desc: "Z世代社区,游戏发行",
  },
  {
    symbol: "KUAI",
    name: "快手抖",
    category: "股票",
    industry: "科技",
    basePrice: 42,
    volatility: 0.2,
    trend: 0.0,
    desc: "直播电商+短剧爆发",
  },
  {
    symbol: "DIDI",
    name: "滴滴答",
    category: "股票",
    industry: "科技",
    basePrice: 35,
    volatility: 0.19,
    trend: -0.001,
    desc: "出行平台,监管回暖",
  },
  // 芯片/硬件（映射：中芯/华为/英伟达/台积电/AMD/英特尔/高通）
  {
    symbol: "SMIC",
    name: "中心国际",
    category: "股票",
    industry: "科技",
    basePrice: 28,
    volatility: 0.21,
    trend: 0.006,
    desc: "国产芯片代工,地缘受益",
  },
  {
    symbol: "HUAW",
    name: "华威电子",
    category: "股票",
    industry: "科技",
    basePrice: 200,
    volatility: 0.17,
    trend: 0.007,
    desc: "通信+手机+鸿蒙生态",
  },
  {
    symbol: "NVDA",
    name: "恩威达",
    category: "股票",
    industry: "科技",
    basePrice: 850,
    volatility: 0.28,
    trend: 0.015,
    desc: "AI芯片之王,全球最热",
  },
  {
    symbol: "TSMC",
    name: "台积殿",
    category: "股票",
    industry: "科技",
    basePrice: 600,
    volatility: 0.13,
    trend: 0.008,
    desc: "全球代工霸主,地缘风险",
  },
  // 新能源车（映射：特斯拉/比亚迪/蔚来/小鹏/理想/宁德时代）
  {
    symbol: "TSLA",
    name: "哥斯拉",
    category: "股票",
    industry: "新能源",
    basePrice: 250,
    volatility: 0.3,
    trend: 0.008,
    desc: "电动+火箭+AI,马斯克概念",
  },
  {
    symbol: "BYD",
    name: "比压迪",
    category: "股票",
    industry: "新能源",
    basePrice: 180,
    volatility: 0.17,
    trend: 0.01,
    desc: "全球销冠,电池自研",
  },
  {
    symbol: "NIO",
    name: "蔚蓝汽车",
    category: "股票",
    industry: "新能源",
    basePrice: 8,
    volatility: 0.3,
    trend: -0.005,
    desc: "高端电动,换电模式",
  },
  {
    symbol: "XPEV",
    name: "小鹏鸟",
    category: "股票",
    industry: "新能源",
    basePrice: 12,
    volatility: 0.28,
    trend: -0.002,
    desc: "智能驾驶,年轻品牌",
  },
  {
    symbol: "LI",
    name: "理想国",
    category: "股票",
    industry: "新能源",
    basePrice: 35,
    volatility: 0.2,
    trend: 0.006,
    desc: "增程之王,盈利稳健",
  },
  {
    symbol: "CATL",
    name: "宁王电池",
    category: "股票",
    industry: "新能源",
    basePrice: 320,
    volatility: 0.16,
    trend: 0.009,
    desc: "动力电池全球第一",
  },
  // 消费/零售（映射：茅台/五粮液/海底捞/泡泡玛特/名创优品/农夫山泉）
  {
    symbol: "MAOT",
    name: "茅小台",
    category: "股票",
    industry: "消费",
    basePrice: 650,
    volatility: 0.08,
    trend: 0.002,
    desc: "白酒之王,分红大方",
  },
  {
    symbol: "SEAH",
    name: "海捞底",
    category: "股票",
    industry: "消费",
    basePrice: 22,
    volatility: 0.16,
    trend: 0.0,
    desc: "火锅连锁,消费恢复受益",
  },
  {
    symbol: "POPM",
    name: "泡泡龙",
    category: "股票",
    industry: "消费",
    basePrice: 42,
    volatility: 0.25,
    trend: 0.007,
    desc: "潮玩盲盒,海外扩张",
  },
  {
    symbol: "MINI",
    name: "名优创",
    category: "股票",
    industry: "消费",
    basePrice: 28,
    volatility: 0.18,
    trend: 0.005,
    desc: "全球杂货连锁",
  },
  // 金融/地产/能源/医药
  {
    symbol: "SAFE",
    name: "安信金融",
    category: "股票",
    industry: "金融",
    basePrice: 65,
    volatility: 0.08,
    trend: 0.002,
    desc: "国有大行,股息稳健",
  },
  {
    symbol: "PING",
    name: "平安宝",
    category: "股票",
    industry: "金融",
    basePrice: 78,
    volatility: 0.14,
    trend: 0.001,
    desc: "保险+科技,综合金融",
  },
  {
    symbol: "ESTATE",
    name: "万城地产",
    category: "股票",
    industry: "房地产",
    basePrice: 8.5,
    volatility: 0.2,
    trend: -0.008,
    desc: "行业寒冬,政策博弈",
  },
  {
    symbol: "DRUG",
    name: "华佗医药",
    category: "股票",
    industry: "医药",
    basePrice: 95,
    volatility: 0.13,
    trend: 0.003,
    desc: "创新药+疫苗龙头",
  },

  // ========== 虚拟币（10种） ==========
  {
    symbol: "BTC",
    name: "比特币",
    category: "虚拟币",
    basePrice: 420000,
    volatility: 0.08,
    trend: 0.003,
    desc: "数字黄金,减半周期",
    unit: "个",
  },
  {
    symbol: "ETH",
    name: "以太币",
    category: "虚拟币",
    basePrice: 22000,
    volatility: 0.1,
    trend: 0.004,
    desc: "智能合约之王",
    unit: "个",
  },
  {
    symbol: "DOGE",
    name: "狗狗币",
    category: "虚拟币",
    basePrice: 0.5,
    volatility: 0.35,
    trend: -0.002,
    desc: "马斯克最爱,memecoin",
    unit: "个",
  },
  {
    symbol: "SOL",
    name: "索拉纳",
    category: "虚拟币",
    basePrice: 900,
    volatility: 0.14,
    trend: 0.006,
    desc: "高性能公链,Speed",
    unit: "个",
  },
  {
    symbol: "BNB",
    name: "币安币",
    category: "虚拟币",
    basePrice: 2500,
    volatility: 0.09,
    trend: 0.005,
    desc: "交易所之王",
    unit: "个",
  },
  {
    symbol: "XRP",
    name: "波纹币",
    category: "虚拟币",
    basePrice: 3.5,
    volatility: 0.15,
    trend: -0.001,
    desc: "跨境支付,SEC诉讼",
    unit: "个",
  },
  {
    symbol: "ADA",
    name: "卡尔达诺",
    category: "虚拟币",
    basePrice: 2,
    volatility: 0.13,
    trend: 0.001,
    desc: "学术派公链",
    unit: "个",
  },
  {
    symbol: "AVAX",
    name: "雪崩币",
    category: "虚拟币",
    basePrice: 120,
    volatility: 0.16,
    trend: 0.002,
    desc: "子网生态,GameFi",
    unit: "个",
  },
  {
    symbol: "MATIC",
    name: "多边形币",
    category: "虚拟币",
    basePrice: 4,
    volatility: 0.14,
    trend: 0.0,
    desc: "以太坊L2,ZK技术",
    unit: "个",
  },
  {
    symbol: "SHIB",
    name: "柴犬币",
    category: "虚拟币",
    basePrice: 0.00002,
    volatility: 0.4,
    trend: -0.003,
    desc: "狗狗币杀手,社区驱动",
    unit: "亿个",
  },

  // ========== 贵金属（8种） ==========
  {
    symbol: "XAU",
    name: "黄金",
    category: "贵金属",
    basePrice: 450,
    volatility: 0.04,
    trend: 0.001,
    desc: "避险之王,央行增持",
    unit: "g",
  },
  {
    symbol: "XAG",
    name: "白银",
    category: "贵金属",
    basePrice: 5.2,
    volatility: 0.06,
    trend: 0.0005,
    desc: "工业+贵金属双属性",
    unit: "g",
  },
  {
    symbol: "XPT",
    name: "铂金",
    category: "贵金属",
    basePrice: 280,
    volatility: 0.05,
    trend: -0.0005,
    desc: "汽车催化剂需求",
    unit: "g",
  },
  {
    symbol: "XPD",
    name: "钯金",
    category: "贵金属",
    basePrice: 1500,
    volatility: 0.07,
    trend: 0.002,
    desc: "尾气催化,供应紧张",
    unit: "g",
  },
  {
    symbol: "COPPER",
    name: "铜",
    category: "贵金属",
    basePrice: 0.06,
    volatility: 0.03,
    trend: 0.003,
    desc: "工业金属之王,AI电网需求",
    unit: "kg",
  },
  {
    symbol: "NICKEL",
    name: "镍",
    category: "贵金属",
    basePrice: 0.04,
    volatility: 0.05,
    trend: 0.001,
    desc: "不锈钢+电池原料",
    unit: "kg",
  },
  {
    symbol: "ALUM",
    name: "铝",
    category: "贵金属",
    basePrice: 0.015,
    volatility: 0.02,
    trend: 0.002,
    desc: "绿色建筑+轻量化",
    unit: "kg",
  },
  {
    symbol: "LITH",
    name: "锂",
    category: "贵金属",
    basePrice: 0.08,
    volatility: 0.06,
    trend: 0.005,
    desc: "电池命脉,电动车爆发",
    unit: "kg",
  },

  // ========== 期货/基金（12种） ==========
  {
    symbol: "CL",
    name: "原油期货",
    category: "期货",
    basePrice: 580,
    volatility: 0.12,
    trend: 0.002,
    desc: "布伦特/桶,地缘敏感",
    unit: "桶",
  },
  {
    symbol: "NG",
    name: "天然气期货",
    category: "期货",
    basePrice: 28,
    volatility: 0.14,
    trend: 0.001,
    desc: "冬季取暖需求驱动",
    unit: "百万BTU",
  },
  {
    symbol: "CORN",
    name: "玉米期货",
    category: "期货",
    basePrice: 18,
    volatility: 0.06,
    trend: 0.0005,
    desc: "粮食安全+乙醇",
    unit: "蒲式耳",
  },
  {
    symbol: "SOY",
    name: "大豆期货",
    category: "期货",
    basePrice: 38,
    volatility: 0.07,
    trend: 0.001,
    desc: "中国进口需求大",
    unit: "蒲式耳",
  },
  {
    symbol: "WHEAT",
    name: "小麦期货",
    category: "期货",
    basePrice: 22,
    volatility: 0.08,
    trend: 0.0,
    desc: "俄乌冲突影响供给",
    unit: "蒲式耳",
  },
  {
    symbol: "COFFEE",
    name: "咖啡期货",
    category: "期货",
    basePrice: 7.5,
    volatility: 0.09,
    trend: 0.002,
    desc: "巴西产量关键",
    unit: "磅",
  },
  {
    symbol: "COTTON",
    name: "棉花期货",
    category: "期货",
    basePrice: 3.2,
    volatility: 0.05,
    trend: 0.001,
    desc: "纺织业原材料",
    unit: "磅",
  },
  {
    symbol: "SUGAR",
    name: "白糖期货",
    category: "期货",
    basePrice: 0.8,
    volatility: 0.06,
    trend: 0.0003,
    desc: "印度出口政策敏感",
    unit: "磅",
  },
  {
    symbol: "BOND",
    name: "国债基金",
    category: "基金",
    basePrice: 105,
    volatility: 0.01,
    trend: 0.0003,
    desc: "稳健理财,降息利好",
    unit: "份",
  },
  {
    symbol: "SP500",
    name: "标普500ETF",
    category: "基金",
    basePrice: 420,
    volatility: 0.04,
    trend: 0.002,
    desc: "一篮子美企龙头",
    unit: "份",
  },
  {
    symbol: "HS300",
    name: "沪深300ETF",
    category: "基金",
    basePrice: 3.8,
    volatility: 0.05,
    trend: 0.001,
    desc: "中国核心资产",
    unit: "份",
  },
  {
    symbol: "REIT",
    name: "REITs地产基金",
    category: "基金",
    basePrice: 88,
    volatility: 0.06,
    trend: 0.0005,
    desc: "收租型REITs,分红",
    unit: "份",
  },
];

const PROPERTIES = [
  // === 住宅类（10处）===
  // 移除固定 appreciation，改为 volatility + baseAppreciation + zoneWeight 波动系统
  {
    id: "apt_cv",
    name: "城中村握手楼",
    type: "住宅",
    price: 80000,
    rent: 500,
    desc: "入门级,拆迁赌注",
    zone: "urban_village",
    volatility: 0.005,
    baseAppreciation: 0.0,
    zoneWeight: { sectorHeat: 0.6, policy: 1.2, cycle: 0.8 },
  },
  {
    id: "apt_old",
    name: "老破小学区",
    type: "住宅",
    price: 500000,
    rent: 1500,
    desc: "学区光环,硬通货",
    zone: "old_city",
    volatility: 0.003,
    baseAppreciation: -0.0001,
    zoneWeight: { sectorHeat: 0.5, policy: 1.5, cycle: 0.7 },
  },
  {
    id: "apt_suburb",
    name: "郊区经济房",
    type: "住宅",
    price: 250000,
    rent: 900,
    desc: "地铁规划中",
    zone: "suburb",
    volatility: 0.004,
    baseAppreciation: 0.0001,
    zoneWeight: { sectorHeat: 0.7, policy: 1.3, cycle: 0.8 },
  },
  {
    id: "apt_new",
    name: "精装两居室",
    type: "住宅",
    price: 1500000,
    rent: 4000,
    desc: "CBD白领最爱",
    zone: "city_center",
    volatility: 0.003,
    baseAppreciation: 0.0002,
    zoneWeight: { sectorHeat: 0.8, policy: 1.0, cycle: 0.9 },
  },
  {
    id: "apt_loft",
    name: "Loft挑高公寓",
    type: "住宅",
    price: 600000,
    rent: 2000,
    desc: "年轻人第一套房",
    zone: "city_center",
    volatility: 0.005,
    baseAppreciation: 0.0002,
    zoneWeight: { sectorHeat: 0.8, policy: 0.9, cycle: 0.9 },
  },
  {
    id: "apt_garden",
    name: "花园洋房",
    type: "住宅",
    price: 3000000,
    rent: 8000,
    desc: "中产改善",
    zone: "suburb",
    volatility: 0.003,
    baseAppreciation: 0.0003,
    zoneWeight: { sectorHeat: 0.9, policy: 0.8, cycle: 1.0 },
  },
  {
    id: "luxury",
    name: "江景大平层",
    type: "住宅",
    price: 5000000,
    rent: 12000,
    desc: "CEO标配",
    zone: "city_center",
    volatility: 0.004,
    baseAppreciation: 0.0004,
    zoneWeight: { sectorHeat: 1.0, policy: 0.7, cycle: 1.1 },
  },
  {
    id: "villa",
    name: "山水别墅",
    type: "住宅",
    price: 8000000,
    rent: 20000,
    desc: "终极住房梦",
    zone: "suburb",
    volatility: 0.004,
    baseAppreciation: 0.0004,
    zoneWeight: { sectorHeat: 1.0, policy: 0.7, cycle: 1.1 },
  },
  {
    id: "apt_sea",
    name: "海景度假屋",
    type: "住宅",
    price: 3500000,
    rent: 10000,
    desc: "三亚/北海概念",
    zone: "tourist",
    volatility: 0.005,
    baseAppreciation: 0.0003,
    zoneWeight: { sectorHeat: 0.9, policy: 0.5, cycle: 0.9 },
  },
  {
    id: "apt_oldtown",
    name: "古城四合院",
    type: "住宅",
    price: 12000000,
    rent: 35000,
    desc: "文化溢价,稀缺品",
    zone: "old_city",
    volatility: 0.006,
    baseAppreciation: 0.0006,
    zoneWeight: { sectorHeat: 1.1, policy: 1.0, cycle: 1.2 },
  },
  // === 商业地产（8处）===
  {
    id: "shop_street",
    name: "街边早餐铺",
    type: "商铺",
    price: 120000,
    rent: 1500,
    desc: "现金牛,门槛低",
    zone: "urban_village",
    volatility: 0.006,
    baseAppreciation: 0.0001,
    zoneWeight: { sectorHeat: 0.7, policy: 0.8, cycle: 0.8 },
  },
  {
    id: "shop",
    name: "社区底商",
    type: "商铺",
    price: 800000,
    rent: 5000,
    desc: "人流稳定",
    zone: "city_center",
    volatility: 0.005,
    baseAppreciation: 0.0003,
    zoneWeight: { sectorHeat: 0.8, policy: 0.7, cycle: 0.9 },
  },
  {
    id: "shop_mall",
    name: "商场内铺",
    type: "商铺",
    price: 2000000,
    rent: 12000,
    desc: "品牌效应",
    zone: "city_center",
    volatility: 0.006,
    baseAppreciation: 0.0002,
    zoneWeight: { sectorHeat: 0.9, policy: 0.6, cycle: 0.9 },
  },
  {
    id: "office",
    name: "写字间隔断",
    type: "写字楼",
    price: 2000000,
    rent: 8000,
    desc: "企业租户多",
    zone: "city_center",
    volatility: 0.005,
    baseAppreciation: 0.0001,
    zoneWeight: { sectorHeat: 0.8, policy: 0.8, cycle: 0.8 },
  },
  {
    id: "office_floor",
    name: "整层写字楼",
    type: "写字楼",
    price: 8000000,
    rent: 35000,
    desc: "大厂分部最爱",
    zone: "city_center",
    volatility: 0.005,
    baseAppreciation: 0.0002,
    zoneWeight: { sectorHeat: 0.9, policy: 0.7, cycle: 0.9 },
  },
  {
    id: "warehouse",
    name: "物流仓库",
    type: "工业",
    price: 1500000,
    rent: 10000,
    desc: "电商红利",
    zone: "industrial",
    volatility: 0.007,
    baseAppreciation: 0.0002,
    zoneWeight: { sectorHeat: 0.6, policy: 0.6, cycle: 0.7 },
  },
  {
    id: "parking",
    name: "地下车位",
    type: "车位",
    price: 80000,
    rent: 400,
    desc: "车位比车贵",
    zone: "city_center",
    volatility: 0.003,
    baseAppreciation: 0.0002,
    zoneWeight: { sectorHeat: 0.5, policy: 1.0, cycle: 0.6 },
  },
  {
    id: "hotel_room",
    name: "酒店式公寓",
    type: "商住",
    price: 500000,
    rent: 3000,
    desc: "日租模式",
    zone: "tourist",
    volatility: 0.005,
    baseAppreciation: 0.0002,
    zoneWeight: { sectorHeat: 0.8, policy: 0.8, cycle: 0.8 },
  },
  // === 海外地产（3处）===
  // 海外房产 sectorHeat 权重仅 0.2，基本不受中国房地产周期影响
  {
    id: "apt_tokyo",
    name: "东京小公寓",
    type: "海外",
    price: 1200000,
    rent: 5000,
    desc: "日元贬值机会",
    zone: "overseas",
    volatility: 0.004,
    baseAppreciation: 0.0001,
    zoneWeight: { sectorHeat: 0.2, policy: 0.2, cycle: 0.5 },
  },
  {
    id: "apt_bangkok",
    name: "曼谷公寓",
    type: "海外",
    price: 350000,
    rent: 2000,
    desc: "东南亚热点",
    zone: "overseas",
    volatility: 0.004,
    baseAppreciation: 0.0002,
    zoneWeight: { sectorHeat: 0.2, policy: 0.2, cycle: 0.5 },
  },
  {
    id: "apt_dubai",
    name: "迪拜投资房",
    type: "海外",
    price: 2000000,
    rent: 10000,
    desc: "免税天堂",
    zone: "overseas",
    volatility: 0.006,
    baseAppreciation: 0.0003,
    zoneWeight: { sectorHeat: 0.2, policy: 0.2, cycle: 0.5 },
  },
];

const CAR_TYPES = [
  // === 经济代步（7款） ===
  {
    id: "ebike",
    name: "电动小毛驴",
    price: 2500,
    depreciation: 0.001,
    maintenance: 30,
    travelBonus: 3,
    desc: "城中村之王",
  },
  {
    id: "scooter",
    name: "二手小踏板",
    price: 5000,
    depreciation: 0.0009,
    maintenance: 50,
    travelBonus: 4,
    desc: "见缝插针",
  },
  {
    id: "van",
    name: "二手面包车",
    price: 30000,
    depreciation: 0.0008,
    maintenance: 300,
    travelBonus: 5,
    desc: "拉货神器",
  },
  {
    id: "bike_elec",
    name: "电动自行车",
    price: 1800,
    depreciation: 0.0012,
    maintenance: 20,
    travelBonus: 2,
    desc: "买菜接娃",
  },
  {
    id: "tricycle",
    name: "三轮蹦蹦",
    price: 8000,
    depreciation: 0.0009,
    maintenance: 100,
    travelBonus: 4,
    desc: "摆摊必备",
  },
  {
    id: "mini_ev",
    name: "五菱宏光MINI",
    price: 35000,
    depreciation: 0.0007,
    maintenance: 200,
    travelBonus: 6,
    desc: "国民神车",
  },
  {
    id: "old_sedan",
    name: "八手捷达",
    price: 15000,
    depreciation: 0.0006,
    maintenance: 400,
    travelBonus: 5,
    desc: "皮实耐造",
  },
  // === 家用舒适（6款） ===
  {
    id: "sedan",
    name: "家用轿车",
    price: 120000,
    depreciation: 0.0005,
    maintenance: 800,
    travelBonus: 10,
    desc: "省油体面",
  },
  {
    id: "suv",
    name: "紧凑型SUV",
    price: 180000,
    depreciation: 0.0005,
    maintenance: 1000,
    travelBonus: 10,
    desc: "视野高,空间大",
  },
  {
    id: "mpv",
    name: "家庭MPV",
    price: 220000,
    depreciation: 0.00045,
    maintenance: 1100,
    travelBonus: 12,
    desc: "二孩家庭",
  },
  {
    id: "hatch",
    name: "小钢炮两厢",
    price: 90000,
    depreciation: 0.0005,
    maintenance: 600,
    travelBonus: 8,
    desc: "驾驶乐趣",
  },
  {
    id: "hybrid",
    name: "丰田混动",
    price: 160000,
    depreciation: 0.0004,
    maintenance: 700,
    travelBonus: 11,
    desc: "省油之王",
  },
  {
    id: "pickup",
    name: "皮卡长城炮",
    price: 150000,
    depreciation: 0.0005,
    maintenance: 900,
    travelBonus: 9,
    desc: "能装能越野",
  },
  // === 豪华/性能（7款） ===
  {
    id: "luxury_sedan",
    name: "宝马奔驰E级",
    price: 450000,
    depreciation: 0.0009,
    maintenance: 2000,
    travelBonus: 13,
    desc: "商务排面",
  },
  {
    id: "luxury_car",
    name: "保时捷911",
    price: 1200000,
    depreciation: 0.0008,
    maintenance: 5000,
    travelBonus: 15,
    desc: "倍有面子",
  },
  {
    id: "tesla_3",
    name: "哥斯拉Model3",
    price: 250000,
    depreciation: 0.0006,
    maintenance: 500,
    travelBonus: 12,
    desc: "科技感十足",
  },
  {
    id: "tesla_y",
    name: "哥斯拉ModelY",
    price: 300000,
    depreciation: 0.0006,
    maintenance: 600,
    travelBonus: 13,
    desc: "纯电SUV销冠",
  },
  {
    id: "nio_et7",
    name: "蔚蓝ET7",
    price: 420000,
    depreciation: 0.0007,
    maintenance: 700,
    travelBonus: 12,
    desc: "换电黑科技",
  },
  {
    id: "supercar",
    name: "法拉利488",
    price: 3500000,
    depreciation: 0.0012,
    maintenance: 15000,
    travelBonus: 18,
    desc: "人生巅峰",
  },
  {
    id: "rr",
    name: "劳斯莱斯幻影",
    price: 8000000,
    depreciation: 0.0006,
    maintenance: 30000,
    travelBonus: 20,
    desc: "终极排面",
  },
];

function initInvestment(state) {
  var inv = state.investment;
  if (!inv) return;
  var initialized = false;
  for (var i = 0; i < INV_STOCKS.length; i++) {
    var s = INV_STOCKS[i];
    if (!inv.stockMarket[s.symbol]) {
      initialized = true;
      var mPrice = s.basePrice * Random.float(0.85, 1.15);
      var history = [];
      // 回溯生成 5-8 个历史数据点，保证首日就有小曲线
      var seedPrice = mPrice * Random.float(0.9, 1.1);
      var numPoints = 5 + Random.int(0, 3);
      for (var k = 0; k < numPoints; k++) {
        seedPrice =
          seedPrice * (1 + s.trend + Random.float(-s.volatility, s.volatility));
        seedPrice = Math.max(0.5, seedPrice);
        history.push({
          day: state.player.day - numPoints + k,
          price: Math.round(seedPrice * 100) / 100,
        });
      }
      history.push({
        day: state.player.day,
        price: Math.round(mPrice * 100) / 100,
      });
      inv.stockMarket[s.symbol] = {
        price: Math.round(mPrice * 100) / 100,
        history: history,
      };
    }
  }
  if (inv.btcPrice <= 0) inv.btcPrice = 200000;
  if (!inv.btcHistory) inv.btcHistory = [];
  // 同样为 BTC 生成回溯历史
  if (inv.btcHistory.length === 0 && inv.btcPrice > 0) {
    var btcSeed = inv.btcPrice * Random.float(0.85, 1.15);
    var btcPoints = Random.int(5, 8);
    for (var b = 0; b < btcPoints; b++) {
      btcSeed = btcSeed * (1 + Random.float(-0.04, 0.04));
      btcSeed = Math.max(1000, btcSeed);
      inv.btcHistory.push({
        day: state.player.day - btcPoints + b,
        price: Math.round(btcSeed),
      });
    }
    inv.btcHistory.push({ day: state.player.day, price: inv.btcPrice });
    if (inv.btcHistory.length > 30) inv.btcHistory.shift();
  }
  inv.lastTickDay = state.player.day;

  // 房产市场 v2 初始化/迁移
  if (typeof initPropertyMarket === "function") {
    initPropertyMarket(state);
  }
}

function tickInvestmentDaily(state) {
  var inv = state.investment;
  if (!inv || inv.lastTickDay >= state.player.day) return;
  inv.lastTickDay = state.player.day;

  // ================================================================
  // 新闻→投资价格传导：计算活跃新闻对各标的的综合影响
  // ================================================================
  var newsSummary =
    typeof getNewsInvestmentSummary === "function"
      ? getNewsInvestmentSummary(state)
      : [];
  var hasNewsDrivers = newsSummary.length > 0;

  // 股票/贵金属/期货/基金每日波动
  for (var i = 0; i < INV_STOCKS.length; i++) {
    var s = INV_STOCKS[i];
    var m = inv.stockMarket[s.symbol];
    if (!m) continue;

    // 基础随机游走 + 世界参数行业热度偏置
    var baseChange = 1 + s.trend + Random.float(-s.volatility, s.volatility);
    if (typeof getSectorHeat === "function") {
      var heat = getSectorHeat(s.industry);
      if (heat && heat !== 1.0) {
        // heat 偏离 1.0 的 10% 转化为每日趋势偏移
        // 如 heat=1.10 → 每日约 +1% 额外偏上
        baseChange *= 1 + (heat - 1.0) * 0.1;
      }
    }

    // 新闻效应乘数
    var newsMul =
      typeof getNewsEffectForInvestment === "function"
        ? getNewsEffectForInvestment(s.symbol, s.industry, s.category, state)
        : 1.0;

    m.price = Math.max(0.01, m.price * baseChange * newsMul);
    m.price = Math.round(m.price * 100) / 100;
    m.history.push({ day: state.player.day, price: m.price });
    if (m.history.length > 20) m.history.shift();
  }

  // 比特币
  if (inv.btcPrice > 0) {
    inv.btcFearGreed = Math.round(
      Math.max(5, Math.min(95, (inv.btcFearGreed || 50) + Random.float(-5, 5))),
    );
    var btcNewsMul =
      typeof getNewsEffectForBtc === "function"
        ? getNewsEffectForBtc(state)
        : 1.0;
    inv.btcPrice = Math.max(
      1000,
      Math.round(
        inv.btcPrice *
          (1 +
            Random.float(-0.04, 0.04) +
            ((inv.btcFearGreed - 50) / 50) * 0.02) *
          btcNewsMul,
      ),
    );
    if (!inv.btcHistory) inv.btcHistory = [];
    inv.btcHistory.push({ day: state.player.day, price: inv.btcPrice });
    if (inv.btcHistory.length > 30) inv.btcHistory.shift();

    if (state.player.day - inv.btcHalvingDay > 1460) {
      inv.btcHalvingDay = state.player.day;
      inv.btcFearGreed = Math.min(95, inv.btcFearGreed + 20);
      StateManager.addMessage("比特币减半事件！", "event");
    }
  }

  // 房产（v2 波动系统：委托 property_market.js 引擎）
  if (typeof tickPropertyMarket === "function") {
    tickPropertyMarket(state);
  } else {
    // 降级：维持旧逻辑（防止 property_market.js 未加载时崩溃）
    var propertyNewsMulFallback =
      typeof getNewsEffectForProperty === "function"
        ? getNewsEffectForProperty(state)
        : 1.0;
    for (var p = 0; p < (inv.properties || []).length; p++) {
      var prop = inv.properties[p];
      prop.currentPrice = Math.round(
        (prop.currentPrice || prop.buyPrice) *
          (1 + (prop.appreciation || 0.0001) + Random.float(-0.001, 0.001)) *
          propertyNewsMulFallback,
      );
      var isSelfLived = inv.selfLivePropertyId === prop.id;
      if (state.player.day % 30 === 0 && !isSelfLived)
        state.resources.cash += prop.rent || 0;
    }
  }

  // 汽车（不受新闻直接影响，维持原状）
  for (var c = 0; c < (inv.cars || []).length; c++) {
    var car = inv.cars[c];
    car.currentPrice = Math.round(
      (car.currentPrice || car.buyPrice) * (1 - car.depreciation),
    );
    if (state.player.day % 30 === 0 && state.resources.cash >= car.maintenance)
      state.resources.cash -= car.maintenance;
  }

  // ================================================================
  // 新闻驱动市场消息（仅在强冲击时通知玩家）
  // ================================================================
  if (
    hasNewsDrivers &&
    typeof hasStrongNewsEffect === "function" &&
    hasStrongNewsEffect(state)
  ) {
    // 只输出最强的一条驱动消息（每日最多一次）
    if (
      !state.flags._newsMarketMsgDay ||
      state.flags._newsMarketMsgDay < state.player.day
    ) {
      state.flags._newsMarketMsgDay = state.player.day;
      // 按强度排序
      newsSummary.sort(function (a, b) {
        return b.strength - a.strength;
      });
      var top = newsSummary[0];
      var changeText = top.avgMul > 1 ? "利好推高" : "利空打压";
      StateManager.addMessage(
        "📊 市场 " +
          top.direction +
          " " +
          top.headline.slice(0, 20) +
          "… " +
          changeText +
          "相关资产价格",
        top.avgMul > 1 ? "hint" : "warning",
      );
    }
  }
}

function buyInvStock(symbol, shares) {
  // 根据资产类别区分交易规则
  // 股票（A股）：最小交易单位1股，强制整股
  // 虚拟币/贵金属/期货/基金：支持小数交易
  var def = INV_STOCKS.find(function (s) {
    return s.symbol === symbol;
  });
  if (def && def.category === "股票") {
    shares = Math.floor(shares);
  }
  // 其他类别保留小数（虚拟币精确到小数位，贵金属按g/kg可小数，期货/基金按份/桶可小数）

  var state = StateManager.getState();
  var inv = state.investment;
  var m = inv.stockMarket[symbol];
  if (!m) return;
  if (shares <= 0) {
    StateManager.addMessage("⚠️ 至少买入1个单位。", "warning");
    return;
  }
  var cost = Math.round(m.price * shares * 100) / 100;
  if (state.resources.cash < cost) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash -= cost;
  var h = inv.stockHoldings.find(function (s) {
    return s.symbol === symbol;
  });
  if (h) {
    var total = h.shares + shares;
    h.avgPrice =
      Math.round(((h.avgPrice * h.shares + cost) / total) * 100) / 100;
    h.shares = total;
  } else
    inv.stockHoldings.push({
      symbol: symbol,
      shares: shares,
      avgPrice: m.price,
    });
  // 追踪交易频次（用于排序）
  if (state.stats) {
    if (!state.stats.investFreq) state.stats.investFreq = {};
    state.stats.investFreq[symbol] =
      (state.stats.investFreq[symbol] || 0) + shares;
  }
  var isStockCat = def && def.category === "股票";
  var qtyStr = isStockCat ? Math.floor(shares) : shares.toFixed(6);
  StateManager.addMessage(
    "买入 " +
      symbol +
      " " +
      qtyStr +
      (isStockCat ? "股" : " " + (def?.unit || "")),
    "success",
  );
}

function sellInvStock(symbol, shares) {
  // 根据资产类别区分交易规则
  // 股票（A股）：最小交易单位1股，强制整股
  // 虚拟币/贵金属/期货/基金：支持小数交易
  var def = INV_STOCKS.find(function (s) {
    return s.symbol === symbol;
  });
  if (def && def.category === "股票") {
    shares = Math.floor(shares);
  }

  var state = StateManager.getState();
  var inv = state.investment;
  var h = inv.stockHoldings.find(function (s) {
    return s.symbol === symbol;
  });
  if (!h || h.shares < shares) {
    StateManager.addMessage("持仓不足", "danger");
    return;
  }
  if (shares <= 0) {
    StateManager.addMessage("⚠️ 至少卖出1个单位。", "warning");
    return;
  }
  var m = inv.stockMarket[symbol];
  var revenue = Math.round(m.price * shares * 100) / 100;
  state.resources.cash += revenue;
  h.shares -= shares;
  if (h.shares <= 0)
    inv.stockHoldings = inv.stockHoldings.filter(function (s) {
      return s.symbol !== symbol;
    });
  // 追踪卖出频次（用于排序）
  if (state.stats) {
    if (!state.stats.investFreq) state.stats.investFreq = {};
    state.stats.investFreq[symbol] =
      (state.stats.investFreq[symbol] || 0) + shares;
  }
  var isStockCat = def && def.category === "股票";
  var qtyStr = isStockCat ? Math.floor(shares) : shares.toFixed(6);
  StateManager.addMessage(
    "卖出 " +
      symbol +
      " " +
      qtyStr +
      (isStockCat ? "股" : " " + (def?.unit || "")),
    "success",
  );
}

function buyBtc(amount) {
  var state = StateManager.getState();
  var inv = state.investment;
  var cost = Math.round(inv.btcPrice * amount * 100) / 100;
  if (state.resources.cash < cost) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash -= cost;
  // 追踪加权平均成本
  var oldTotal = (inv.btcAvgCost || 0) * (inv.btcHoldings || 0);
  var newTotal = oldTotal + cost;
  inv.btcHoldings = Math.round((inv.btcHoldings + amount) * 10000) / 10000;
  inv.btcAvgCost =
    inv.btcHoldings > 0
      ? Math.round((newTotal / inv.btcHoldings) * 100) / 100
      : 0;
  StateManager.addMessage(
    "买入 " + amount.toFixed(6) + " BTC, 均价 ¥" + inv.btcAvgCost.toFixed(2),
    "success",
  );
}

function sellBtc(amount) {
  var state = StateManager.getState();
  var inv = state.investment;
  if (inv.btcHoldings < amount) {
    StateManager.addMessage("持仓不足", "danger");
    return;
  }
  var curPrice = inv.btcPrice;
  var revenue = Math.round(curPrice * amount * 100) / 100;
  var avgCost = inv.btcAvgCost || 0;
  var pl = avgCost > 0 ? Math.round((curPrice - avgCost) * amount) : 0;
  var plStr = pl !== 0 ? (pl > 0 ? " 📈+" : " 📉") + pl : "";
  state.resources.cash += revenue;
  inv.btcHoldings = Math.round((inv.btcHoldings - amount) * 10000) / 10000;
  // 清仓时重置成本
  if (inv.btcHoldings <= 0) inv.btcAvgCost = 0;
  StateManager.addMessage(
    "卖出 " +
      amount.toFixed(6) +
      " BTC, 到手 ¥" +
      Math.round(revenue).toLocaleString() +
      plStr,
    "success",
  );
}

function buyProperty(propId) {
  var state = StateManager.getState();
  var inv = state.investment;
  var prop = PROPERTIES.find(function (p) {
    return p.id === propId;
  });
  if (!prop) return;
  if (state.resources.cash < prop.price) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash -= prop.price;
  inv.properties.push({
    id: prop.id,
    name: prop.name,
    type: prop.type,
    zone: prop.zone || "general",
    zoneWeight: prop.zoneWeight || { sectorHeat: 0.8, policy: 0.8, cycle: 0.8 },
    volatility: prop.volatility || 0.004,
    baseAppreciation: prop.baseAppreciation || 0.0,
    rent: prop.rent,
    buyPrice: prop.price,
    currentPrice: prop.price,
    buyDay: state.player.day,
  });
  StateManager.addMessage("购入" + prop.name, "success");
}

function sellProperty(propId) {
  var state = StateManager.getState();
  var inv = state.investment;
  var idx = -1;
  for (var i = 0; i < inv.properties.length; i++) {
    if (inv.properties[i].id === propId) {
      idx = i;
      break;
    }
  }
  if (idx < 0) return;
  var prop = inv.properties[idx];

  // 如果卖的是自住房，重置自住状态
  var wasSelfLived = inv.selfLivePropertyId === prop.id;
  if (wasSelfLived) {
    inv.selfLivePropertyId = null;
    // 降级住所到 tier 1（合租床位），日租恢复
    if (typeof HOUSING_TIERS !== "undefined") {
      state.housing.tier = 1;
      state.inventory.capacity =
        (HOUSING_TIERS[1] ? HOUSING_TIERS[1].capacity : 50) +
        (state.housing.storageCapacity || 0);
    }
    StateManager.addMessage("🏠 你卖掉了自住房，搬回合租床位。", "warning");
  }

  var net = prop.currentPrice - Math.round(prop.currentPrice * 0.05);
  state.resources.cash += net;
  inv.properties.splice(idx, 1);
  StateManager.addMessage(
    "出售" + prop.name + " 到手¥" + net.toLocaleString(),
    "success",
  );
}

function buyCar(carId) {
  var state = StateManager.getState();
  var inv = state.investment;
  var car = CAR_TYPES.find(function (c) {
    return c.id === carId;
  });
  if (!car) return;
  if (state.resources.cash < car.price) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash -= car.price;
  inv.cars.push({
    id: car.id,
    name: car.name,
    depreciation: car.depreciation,
    maintenance: car.maintenance,
    travelBonus: car.travelBonus,
    buyPrice: car.price,
    currentPrice: car.price,
    buyDay: state.player.day,
  });
  state.player.maxActionPoints =
    (state.player.maxActionPoints || 100) + car.travelBonus;
  state.player.actionPoints = Math.min(
    state.player.maxActionPoints,
    state.player.actionPoints + car.travelBonus,
  );
  StateManager.addMessage(
    "购入" + car.name + " 行动力上限+" + car.travelBonus,
    "success",
  );
}

// ============================================================
//  Canvas 涨跌曲线图
//  颜色标准：中国/A股标准 红涨绿跌
//  🔴 #c4553d = 涨 = 红色（同 var(--danger)）
//  🟢 #4a9e5c = 跌 = 绿色（同 var(--success)）
//  注意：与投资Tab中持仓盈亏颜色（红涨绿跌）保持一致
//  Canvas 不支持 CSS var()，直接用硬编码色值
// ============================================================
function drawPriceChart(canvasId, priceData, color) {
  var canvas =
    typeof canvasId === "string" ? document.getElementById(canvasId) : canvasId;
  if (!canvas) return;

  // Retina/HiDPI 支持（与 data_viz.js setupCanvas 一致）
  var dpr = window.devicePixelRatio || 1;
  var cssW = canvas.style.width
    ? parseInt(canvas.style.width)
    : canvas.width / dpr;
  var cssH = canvas.style.height
    ? parseInt(canvas.style.height)
    : canvas.height / dpr;
  // 仅在物理像素与 CSS 像素 × DPR 不匹配时重新设置
  if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
  }
  var ctx = canvas.getContext("2d");
  // 清空全部物理像素
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 缩放至 CSS 像素坐标系，后续所有绘制使用 cssW / cssH
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var W = cssW,
    H = cssH;

  var data = (priceData || []).slice(-20);
  if (data.length < 2) {
    // 无历史数据时：画一条水平线 + 首日上市提示
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(4, H / 2);
    ctx.lineTo(W - 4, H / 2);
    ctx.stroke();
    ctx.fillStyle = "#888";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("今日首日上市", W / 2, H / 2 - 12);
    // 若有当前价格则显示
    var curPrice = null;
    if (priceData && priceData.length === 1) curPrice = priceData[0].price;
    if (curPrice !== null) {
      ctx.fillStyle = "#4a9e5c";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("¥" + curPrice.toFixed(2), W / 2, H / 2 + 18);
    }
    return;
  }

  var prices = [];
  for (var i = 0; i < data.length; i++) prices.push(data[i].price);

  // 折线/填充使用固定色（信息蓝 #5a8ab4），不随涨跌方向变化
  var lastPrice = prices[prices.length - 1];
  // 方向信息由价格数字和涨跌幅文字（红涨绿跌）负责
  var lineColor = "#5a8ab4";
  var fillColor = "rgba(90,138,180,0.12)";

  var minP = prices[0],
    maxP = prices[0];
  for (var i = 1; i < prices.length; i++) {
    if (prices[i] < minP) minP = prices[i];
    if (prices[i] > maxP) maxP = prices[i];
  }
  var range = maxP - minP;
  if (range === 0) range = minP * 0.1 || 1;
  var padT = 4,
    padB = 4,
    padL = 4,
    padR = 4;
  var chartW = W - padL - padR;
  var chartH = H - padT - padB;

  // 网格线
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 0.5;
  for (var i = 0; i < 4; i++) {
    var y = padT + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();
  }

  // 折线
  ctx.beginPath();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.5;
  var firstX, firstY, lastX, lastY;
  for (var i = 0; i < prices.length; i++) {
    var x = padL + (i / (prices.length - 1)) * chartW;
    var y = padT + chartH - ((prices[i] - minP) / range) * chartH;
    if (i === 0) {
      ctx.moveTo(x, y);
      firstX = x;
      firstY = y;
    } else {
      ctx.lineTo(x, y);
    }
    if (i === prices.length - 1) {
      lastX = x;
      lastY = y;
    }
  }
  ctx.stroke();

  // 渐变填充（与 stock.js renderKLine 的 fillColor 一致）
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(firstX, H - padB);
  for (var i = 0; i < prices.length; i++) {
    var x = padL + (i / (prices.length - 1)) * chartW;
    var y = padT + chartH - ((prices[i] - minP) / range) * chartH;
    if (i === 0) ctx.lineTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.lineTo(lastX, H - padB);
  ctx.closePath();
  ctx.fill();

  // 当前价格 & 涨跌幅
  var prevPrice = prices.length >= 2 ? prices[prices.length - 2] : lastPrice;
  var chg = lastPrice - prevPrice;
  var chgPct = prevPrice !== 0 ? ((chg / prevPrice) * 100).toFixed(2) : "0.00";
  var chgText = (chg >= 0 ? "+" : "") + chgPct + "%";
  var dayColor = chg >= 0 ? "#c4553d" : "#4a9e5c";

  ctx.fillStyle = dayColor;
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(lastPrice.toFixed(2), padL + 2, padT + 10);

  ctx.fillStyle = dayColor;
  ctx.font = "10px sans-serif";
  ctx.fillText(chgText, padL + 2, padT + 21);
}

// ============================================================
//  市场情绪看板（P3.2）
// ============================================================
function renderMarketSentiment(state, inv) {
  var activeNews = state.activeNews || [];
  var pending = (state.flags && state.flags._pendingFollowUpNews) || [];

  // 计算牛熊分数
  var bullScore = 0,
    bearScore = 0;
  for (var i = 0; i < activeNews.length; i++) {
    var effs = (activeNews[i].effects || {}).investmentEffect || [];
    for (var j = 0; j < effs.length; j++) {
      var mul = effs[j].mul || 1;
      if (mul > 1) bullScore += (mul - 1) * 8;
      else if (mul < 1) bearScore += (1 - mul) * 8;
    }
  }
  var fg = Math.round((inv && inv.btcFearGreed) || 50);
  if (fg > 65) bullScore += (fg - 65) * 0.4;
  else if (fg < 35) bearScore += (35 - fg) * 0.4;

  var sentiment, sentColor;
  if (bullScore > bearScore + 1.5) {
    sentiment = "🐂 牛市氛围";
    sentColor = "var(--danger)";
  } else if (bearScore > bullScore + 1.5) {
    sentiment = "🐻 熊市氛围";
    sentColor = "var(--success)";
  } else {
    sentiment = "⚖️ 震荡市";
    sentColor = "var(--accent)";
  }

  if (activeNews.length === 0 && pending.length === 0) return "";

  var html =
    '<div style="margin-bottom:8px;padding:8px 10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:6px;">';
  html +=
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">';
  html +=
    '<span style="font-size:11px;font-weight:bold;color:' +
    sentColor +
    ';">' +
    sentiment +
    "</span>";
  html +=
    '<span style="font-size:10px;color:var(--text-muted);">BTC恐贪: ' +
    fg +
    "/100</span>";
  html += "</div>";

  // 市场驱动摘要
  if (typeof getNewsInvestmentSummary === "function") {
    var drivers = getNewsInvestmentSummary(state);
    if (drivers.length > 0) {
      // 只显示前2个最强驱动
      drivers.sort(function (a, b) {
        return b.strength - a.strength;
      });
      html +=
        '<div style="font-size:9px;color:var(--text-muted);margin-bottom:3px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.04);">📊 市场驱动：';
      for (var di = 0; di < Math.min(drivers.length, 2); di++) {
        var d = drivers[di];
        html +=
          '<span style="margin-right:6px;">' +
          d.direction +
          '<span style="' +
          (d.avgMul > 1 ? "color:var(--danger);" : "color:var(--success);") +
          '">' +
          (d.avgMul > 1 ? "+" : "") +
          d.strength +
          "%</span></span>";
      }
      html += "</div>";
    }
  }

  // 当前活跃新闻（最多3条）+ 市场驱动指示
  var shownNews = 0;
  for (var k = 0; k < activeNews.length && shownNews < 3; k++) {
    var news = activeNews[k];
    var daysLeft =
      (news._appliedDay || 0) +
      ((news.effects && news.effects.duration) || 5) -
      state.player.day;
    if (daysLeft <= 0) continue;

    // 计算该新闻影响的行业标签
    var invEffs = (news.effects || {}).investmentEffect || [];
    var tags = [];
    for (var te = 0; te < invEffs.length; te++) {
      var e = invEffs[te];
      if (e.allStocks) {
        tags.push("全市场");
        break;
      }
      if (e.btc) {
        if (tags.indexOf("BTC") < 0) tags.push("BTC");
        continue;
      }
      if (e.industry) {
        if (tags.indexOf(e.industry) < 0) tags.push(e.industry);
      }
      if (e.category) {
        if (tags.indexOf(e.category) < 0) tags.push(e.category);
      }
      if (e.symbols) {
        for (var si = 0; si < e.symbols.length; si++) {
          var sym = e.symbols[si];
          if (tags.indexOf(sym) < 0 && sym.length <= 6) tags.push(sym);
        }
      }
    }
    var tagHtml =
      tags.length > 0
        ? ' <span style="font-size:9px;color:var(--text-muted);">[' +
          tags.slice(0, 3).join("·") +
          (tags.length > 3 ? "…" : "") +
          "]</span>"
        : "";

    html +=
      '<div style="font-size:10px;color:var(--text-light);padding:1px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">';
    html +=
      news.headline +
      tagHtml +
      ' <span style="color:var(--text-muted);">(' +
      daysLeft +
      "天)</span>";
    html += "</div>";
    shownNews++;
  }

  // 即将触发的级联新闻预告
  if (pending.length > 0) {
    html +=
      '<div style="font-size:10px;color:var(--accent);margin-top:4px;margin-bottom:2px;">⏰ 近期动向：</div>';
    var fuRef = typeof NEWS_FOLLOWUP !== "undefined" ? NEWS_FOLLOWUP : {};
    var shownPend = 0;
    for (var m = 0; m < pending.length && shownPend < 2; m++) {
      var pitem = pending[m];
      var fu = fuRef[pitem.id];
      if (!fu) continue;
      var daysUntil = pitem.triggerDay - state.player.day;
      html +=
        '<div style="font-size:10px;color:var(--text-muted);padding:1px 0;">';
      html +=
        (daysUntil <= 0 ? "今日" : daysUntil + "天后") + "：" + fu.headline;
      html += "</div>";
      shownPend++;
    }
  }

  html += "</div>";
  return html;
}

// ============================================================
//  投资主页面渲染
// ============================================================
function renderInvestmentTab(state, parent) {
  var inv = state.investment;
  if (!inv) {
    parent.innerHTML = "<p>投资系统初始化中...</p>";
    return;
  }
  if (
    Object.keys(inv.stockMarket).length === 0 &&
    typeof initInvestment === "function"
  )
    initInvestment(state);

  // 按类别统计资产市值
  var stockVal = 0,
    preciousVal = 0,
    futuresVal = 0;
  for (var i = 0; i < inv.stockHoldings.length; i++) {
    var h = inv.stockHoldings[i];
    var def = null;
    for (var j = 0; j < INV_STOCKS.length; j++) {
      if (INV_STOCKS[j].symbol === h.symbol) {
        def = INV_STOCKS[j];
        break;
      }
    }
    if (!def) continue;
    var val =
      (inv.stockMarket[h.symbol] ? inv.stockMarket[h.symbol].price : 0) *
      h.shares;
    if (def.category === "股票") stockVal += val;
    else if (def.category === "贵金属") preciousVal += val;
    else if (def.category === "期货" || def.category === "基金")
      futuresVal += val;
  }
  var btcVal = inv.btcPrice * (inv.btcHoldings || 0);
  var propVal = 0;
  for (var i = 0; i < (inv.properties || []).length; i++)
    propVal += inv.properties[i].currentPrice || inv.properties[i].buyPrice;
  var carVal = 0;
  for (var i = 0; i < (inv.cars || []).length; i++)
    carVal += inv.cars[i].currentPrice || inv.cars[i].buyPrice;
  var totalInv =
    stockVal + btcVal + preciousVal + futuresVal + propVal + carVal;

  parent.innerHTML = "";
  var cont = document.createElement("div");

  cont.innerHTML =
    '<h3>投资中心 <span style="font-size:12px;color:var(--accent);">总资产 ' +
    totalInv.toLocaleString() +
    "</span></h3>" +
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">' +
    summaryCard("股票", stockVal) +
    summaryCard("比特币", btcVal) +
    summaryCard("贵金属", preciousVal) +
    summaryCard("期货基金", futuresVal) +
    summaryCard("房产", propVal) +
    summaryCard("汽车", carVal) +
    "</div>" +
    renderMarketSentiment(state, inv) +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:10px;color:var(--text-muted);flex-wrap:wrap;">' +
    "<span>📉 跌</span>" +
    '<span style="color:var(--success);font-weight:bold;">🟢 绿</span>' +
    '<span style="color:var(--text-muted);">/</span>' +
    "<span>📈 涨</span>" +
    '<span style="color:var(--danger);font-weight:bold;">🔴 红</span>' +
    '<span style="color:var(--text-muted);">· 折线固定蓝色 · 价格/涨跌幅 红涨绿跌</span>' +
    "</div>" +
    '<div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;">' +
    '<button class="btn btn-sm sub-tab active" data-stab="stocks">股票</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="crypto">虚拟币</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="precious">贵金属</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="futures">期货基金</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="re">房产</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="car">汽车</button>' +
    '</div><div id="inv-sub-area"></div>';

  parent.appendChild(cont);

  var renderSub = function (stab) {
    var area = document.getElementById("inv-sub-area");
    if (!area) return;
    area.innerHTML = "";
    if (stab === "stocks") renderStocks(area, inv, state, parent);
    else if (stab === "crypto") renderBtc(area, inv, state, parent);
    else if (stab === "precious") renderPrecious(area, inv, state, parent);
    else if (stab === "futures") renderFutures(area, inv, state, parent);
    else if (stab === "re") renderProperties(area, inv, state, parent);
    else if (stab === "car") renderCars(area, inv, state, parent);
  };

  setTimeout(function () {
    renderSub("stocks");
    var btns = cont.querySelectorAll(".sub-tab");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        for (var j = 0; j < btns.length; j++)
          btns[j].classList.remove("active");
        this.classList.add("active");
        renderSub(this.dataset.stab);
      });
    }
  }, 0);
}

// ---- 摘要小卡片 ----
function summaryCard(label, value) {
  return (
    '<div class="action-card" style="flex:1;min-width:90px;text-align:center;padding:6px 4px;">' +
    '<div style="font-size:10px;color:var(--text-muted);">' +
    label +
    "</div>" +
    '<strong style="font-size:13px;">' +
    Math.round(value).toLocaleString() +
    "</strong>" +
    "</div>"
  );
}

// ---- 子tab渲染：股票 ----
/**
 * 标准投资按钮组 — 所有子tab统一使用此样式
 * 买（绿色）3个按钮一行，卖（红色）3个按钮一行，每行末尾加 ✏️ 自定义数量
 * @param {string} sym    股票/币种代号
 * @param {number} price  当前价格
 * @param {object|null} h 持仓对象 {shares, avgPrice} 或 null
 * @param {string} qty1   第一档数量（如 "1", "10", "0.001"）
 * @param {string} qty2   第二档数量
 * @param {string} lbl1   按钮标签1（如 "买1", "买10"）
 * @param {string} lbl2   按钮标签2
 * @param {number} decimals 全买计算的小数位数
 */
function stdInvBtns(sym, price, h, qty1, qty2, lbl1, lbl2, decimals) {
  var shares = h ? h.shares : 0;
  var decAttr = decimals != null ? ' data-dec="' + decimals + '"' : "";
  var step = decimals > 0 ? Math.pow(10, -decimals) : 1;

  // 构建一行按钮：买行（3绿 + ✏️ + 隐藏数量面板）
  function buildRow(className, qA, qB, labelA, labelB, showAll, side, allQty) {
    var isBuy = side === "buy";
    var btnCls = isBuy ? "btn-success" : "btn-danger";
    var actCls = isBuy ? "ibuy" : "isell";
    var allLbl = isBuy ? "全买" : "全卖";
    var allAttr = isBuy
      ? ' class="btn btn-sm btn-success ibuy-all" data-s="' +
        sym +
        '" data-p="' +
        price.toFixed(4) +
        '"' +
        decAttr
      : ' class="btn btn-sm btn-danger isell" data-s="' +
        sym +
        '" data-q="' +
        allQty +
        '"';
    return (
      '<div style="display:flex;gap:3px;flex-wrap:wrap;align-items:center;">' +
      '<button class="btn btn-sm ' +
      btnCls +
      " " +
      actCls +
      '" data-s="' +
      sym +
      '" data-q="' +
      qA +
      '">' +
      labelA +
      "</button>" +
      '<button class="btn btn-sm ' +
      btnCls +
      " " +
      actCls +
      '" data-s="' +
      sym +
      '" data-q="' +
      qB +
      '">' +
      labelB +
      "</button>" +
      "<button" +
      allAttr +
      ">" +
      allLbl +
      "</button>" +
      '<button class="qty-toggle-btn" data-sym="' +
      sym +
      '" data-side="' +
      side +
      '" title="自定义数量">✏️</button>' +
      '<div class="qty-input-group" data-sym="' +
      sym +
      '" data-side="' +
      side +
      '" style="display:none;">' +
      '<button class="qty-step-btn" data-sym="' +
      sym +
      '" data-dir="-1">−</button>' +
      '<input type="number" class="qty-num-input" value="' +
      qA +
      '" min="' +
      step +
      '" step="' +
      step +
      '" data-sym="' +
      sym +
      '" data-dec="' +
      (decimals || 0) +
      '">' +
      '<button class="qty-step-btn" data-sym="' +
      sym +
      '" data-dir="1">+</button>' +
      '<button class="btn btn-sm ' +
      btnCls +
      ' qty-inv-btn" data-sym="' +
      sym +
      '" data-side="' +
      side +
      '">' +
      (isBuy ? "买" : "卖") +
      "</button>" +
      "</div>" +
      "</div>"
    );
  }

  var sellAllQty = shares > 0 ? shares : 0;
  return (
    '<div class="inv-btn-group" style="margin-top:4px;">' +
    buildRow("buy-row", qty1, qty2, lbl1, lbl2, true, "buy", "0") +
    buildRow(
      "sell-row",
      qty1,
      qty2,
      lbl1.replace("买", "卖"),
      lbl2.replace("买", "卖"),
      true,
      "sell",
      sellAllQty,
    ) +
    "</div>"
  );
}

// ---- 投资面板自定义数量输入事件绑定（所有子tab共享） ----
function bindInvQtyHandlers(area, state, parent, tabFn) {
  if (!area) return;

  // 展开/收起 ✏️
  area.querySelectorAll(".qty-toggle-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var sym = this.dataset.sym;
      var side = this.dataset.side;
      var group = area.querySelector(
        '.qty-input-group[data-sym="' + sym + '"][data-side="' + side + '"]',
      );
      if (!group) return;
      var isHidden = group.style.display === "none";
      group.style.display = isHidden ? "inline-flex" : "none";
      this.style.opacity = isHidden ? "0.7" : "1";
      this.style.background = isHidden ? "var(--accent-glow)" : "transparent";
      if (isHidden) {
        var input = group.querySelector(".qty-num-input");
        if (input) {
          var s = StateManager.getState();
          // 卖侧：上限 = 持有量；买侧：上限 = 现金/价格
          if (side === "sell") {
            var holding = null;
            for (
              var i = 0;
              i < (s.investment.stockHoldings || []).length;
              i++
            ) {
              if (s.investment.stockHoldings[i].symbol === sym) {
                holding = s.investment.stockHoldings[i];
                break;
              }
            }
            if (holding) {
              input.max = holding.shares;
              input.value = Math.max(
                parseFloat(input.step) || 1,
                Math.floor(
                  (holding.shares / 2) * (1 / (parseFloat(input.step) || 1)),
                ) * (parseFloat(input.step) || 1),
              );
            }
          } else {
            var def = null;
            for (var i = 0; i < INV_STOCKS.length; i++) {
              if (INV_STOCKS[i].symbol === sym) {
                def = INV_STOCKS[i];
                break;
              }
            }
            var mkt = s.investment.stockMarket[sym];
            if (mkt && mkt.price > 0) {
              var maxQ =
                Math.floor(
                  (s.resources.cash / mkt.price) *
                    (1 / (parseFloat(input.step) || 1)),
                ) * (parseFloat(input.step) || 1);
              if (def && def.category === "股票") maxQ = Math.floor(maxQ);
              input.max = Math.max(
                parseFloat(input.step) || 1,
                maxQ || parseFloat(input.step) || 1,
              );
            }
          }
          input.focus();
          input.select();
        }
      }
    });
  });

  // 步进按钮
  area.querySelectorAll(".qty-step-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var sym = this.dataset.sym;
      var dir = parseInt(this.dataset.dir) || 0;
      var group = this.closest(".qty-input-group");
      if (!group) return;
      var input = group.querySelector(".qty-num-input");
      if (!input) return;
      var step = parseFloat(input.step) || 1;
      var max = parseFloat(input.max) || 999999;
      var val = parseFloat(input.value) || step;
      val = Math.max(step, Math.min(max, val + (dir > 0 ? step : -step)));
      // 按step对齐
      val = Math.round(val / step) * step;
      // 保留正确的小数位数
      var dec = parseInt(input.dataset.dec) || 0;
      input.value = val.toFixed(dec);
    });
  });

  // 数量输入校验
  area.querySelectorAll(".qty-num-input").forEach(function (input) {
    input.addEventListener("change", function () {
      var step = parseFloat(this.step) || 1;
      var max = parseFloat(this.max) || 999999;
      var dec = parseInt(this.dataset.dec) || 0;
      var val = parseFloat(this.value) || step;
      if (val < step) val = step;
      if (val > max) val = max;
      val = Math.round(val / step) * step;
      this.value = val.toFixed(dec);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var group = this.closest(".qty-input-group");
        if (!group) return;
        var actionBtn = group.querySelector(".qty-inv-btn");
        if (actionBtn) actionBtn.click();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        var group = this.closest(".qty-input-group");
        if (!group) return;
        group.style.display = "none";
        var sym = this.dataset.sym;
        var side = group.dataset.side;
        var toggle = area.querySelector(
          '.qty-toggle-btn[data-sym="' + sym + '"][data-side="' + side + '"]',
        );
        if (toggle) {
          toggle.style.opacity = "";
          toggle.style.background = "";
        }
      }
    });
  });

  // 自定义数量买/卖
  area.querySelectorAll(".qty-inv-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var sym = this.dataset.sym;
      var side = this.dataset.side;
      var group = area.querySelector(
        '.qty-input-group[data-sym="' + sym + '"][data-side="' + side + '"]',
      );
      if (!group) return;
      var input = group.querySelector(".qty-num-input");
      if (!input) return;
      var step = parseFloat(input.step) || 1;
      var dec = parseInt(input.dataset.dec) || 0;
      var qty = parseFloat(input.value) || step;
      if (qty < step) qty = step;
      qty = Math.round(qty / step) * step;
      input.value = qty.toFixed(dec);

      // 校验上限
      if (side === "buy") {
        var s = StateManager.getState();
        var mkt = s.investment.stockMarket[sym];
        if (mkt && mkt.price > 0) {
          var maxQ = Math.floor(s.resources.cash / mkt.price / step) * step;
          var def = null;
          for (var i = 0; i < INV_STOCKS.length; i++) {
            if (INV_STOCKS[i].symbol === sym) {
              def = INV_STOCKS[i];
              break;
            }
          }
          if (def && def.category === "股票") maxQ = Math.floor(maxQ);
          if (qty > maxQ) {
            if (maxQ <= 0) {
              StateManager.addMessage("⚠️ 现金不足以购买。", "danger");
              return;
            }
            qty = maxQ;
            input.value = qty.toFixed(dec);
            StateManager.addMessage(
              "ℹ️ 现金不足，调整为 " + qty.toFixed(dec) + "。",
              "info",
            );
          }
        }
        buyInvStock(sym, qty);
      } else {
        var s = StateManager.getState();
        var holding = null;
        for (var i = 0; i < (s.investment.stockHoldings || []).length; i++) {
          if (s.investment.stockHoldings[i].symbol === sym) {
            holding = s.investment.stockHoldings[i];
            break;
          }
        }
        var maxSell = holding ? holding.shares : 0;
        if (qty > maxSell) {
          if (maxSell <= 0) {
            StateManager.addMessage("⚠️ 没有持仓可卖。", "danger");
            return;
          }
          qty = maxSell;
          input.value = qty.toFixed(dec);
        }
        sellInvStock(sym, qty);
      }

      // 收起面板
      group.style.display = "none";
      var toggle = area.querySelector(
        '.qty-toggle-btn[data-sym="' + sym + '"][data-side="' + side + '"]',
      );
      if (toggle) {
        toggle.style.opacity = "";
        toggle.style.background = "";
      }

      // 刷新
      if (typeof tabFn === "function") tabFn(state, parent);
      else renderInvestmentTab(state, parent);
    });
  });
}

function renderStocks(area, inv, state, parent) {
  // === 📊 我的持仓汇总 ===
  var holdings = inv.stockHoldings || [];
  var hasHoldings = holdings.length > 0;

  if (hasHoldings) {
    var portfolioDiv = document.createElement("div");
    portfolioDiv.style.cssText =
      "margin-bottom:12px;padding:12px;background:rgba(0,180,216,0.06);border:1px solid var(--accent);border-radius:8px;";
    var totalPL = 0,
      totalValue = 0;
    var rowsHtml = "";
    for (var hIdx = 0; hIdx < holdings.length; hIdx++) {
      var h = holdings[hIdx];
      var mkt = inv.stockMarket[h.symbol];
      var curPx = mkt ? mkt.price : 0;
      var val = curPx * h.shares;
      var pl = (curPx - h.avgPrice) * h.shares;
      var plPct =
        h.avgPrice > 0 ? ((curPx - h.avgPrice) / h.avgPrice) * 100 : 0;
      totalPL += pl;
      totalValue += val;
      var plClr = pl >= 0 ? "var(--danger)" : "var(--success)";
      var plSign = pl >= 0 ? "+" : "";
      // Find stock name
      var stkName = h.symbol;
      for (var si = 0; si < INV_STOCKS.length; si++) {
        if (INV_STOCKS[si].symbol === h.symbol) {
          stkName = INV_STOCKS[si].name;
          break;
        }
      }
      rowsHtml += `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:11px;gap:8px;">
          <span style="font-weight:600;min-width:50px;">${h.symbol}</span>
          <span style="color:var(--text-secondary);min-width:55px;font-size:10px;">${stkName}</span>
          <span style="min-width:40px;text-align:right;">${h.shares}股</span>
          <span style="min-width:55px;text-align:right;font-size:10px;color:var(--text-muted);">均¥${h.avgPrice.toFixed(2)}</span>
          <span style="min-width:55px;text-align:right;">现¥${curPx.toFixed(2)}</span>
          <span style="min-width:60px;text-align:right;">市值¥${Math.round(val).toLocaleString()}</span>
          <span style="min-width:70px;text-align:right;color:${plClr};font-weight:600;">${plSign}¥${Math.round(pl).toLocaleString()}</span>
          <span style="min-width:45px;text-align:right;color:${plClr};font-size:10px;">${plSign}${plPct.toFixed(1)}%</span>
        </div>`;
    }
    var totalClr = totalPL >= 0 ? "var(--danger)" : "var(--success)";
    var totalSign = totalPL >= 0 ? "+" : "";
    portfolioDiv.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <h4 style="margin:0;font-size:13px;color:var(--accent);">📊 我的持仓</h4>
        <span style="font-size:11px;">总市值 <strong style="color:var(--accent);">¥${Math.round(totalValue).toLocaleString()}</strong> | 总盈亏 <strong style="color:${totalClr};">${totalSign}¥${Math.round(totalPL).toLocaleString()}</strong></span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:10px;color:var(--text-muted);border-bottom:2px solid var(--border);margin-bottom:4px;">
        <span style="min-width:50px;">代码</span><span style="min-width:55px;">名称</span><span style="min-width:40px;text-align:right;">数量</span><span style="min-width:55px;text-align:right;">均价</span><span style="min-width:55px;text-align:right;">现价</span><span style="min-width:60px;text-align:right;">市值</span><span style="min-width:70px;text-align:right;">盈亏</span><span style="min-width:45px;text-align:right;">幅度</span>
      </div>
      ${rowsHtml}
    `;
    area.appendChild(portfolioDiv);
  }

  var grid = document.createElement("div");
  grid.className = "action-cards";
  grid.style.gridTemplateColumns = "repeat(auto-fill,minmax(230px,1fr))";

  // ====== 分类排序系统：行业优先 → 交易频次 → 价格 → 代码 ======
  var stockList = [];
  for (var si = 0; si < INV_STOCKS.length; si++) {
    if (INV_STOCKS[si].category === "股票") stockList.push(INV_STOCKS[si]);
  }
  if (typeof SortUtils !== "undefined") {
    stockList = SortUtils.sortInteractiveList(
      stockList,
      {
        categoryOrder: ["科技", "新能源", "消费", "金融", "房地产", "医药"],
        freqMap: "investFreq",
        getCategory: function (s) {
          return s.industry || "其他";
        },
        getFreqKey: function (s) {
          return s.symbol;
        },
        getCost: function (s) {
          return s.basePrice || 0;
        },
        getName: function (s) {
          return s.symbol;
        },
      },
      state,
    );
  }

  for (var i = 0; i < stockList.length; i++) {
    var s = stockList[i];
    var m = inv.stockMarket[s.symbol];
    if (!m) continue;
    var h = null;
    for (var j = 0; j < inv.stockHoldings.length; j++) {
      if (inv.stockHoldings[j].symbol === s.symbol) {
        h = inv.stockHoldings[j];
        break;
      }
    }
    var chg =
      m.history.length >= 2
        ? m.price - m.history[m.history.length - 2].price
        : 0;
    var clr = chg >= 0 ? "var(--danger)" : "var(--success)";

    // Canvas ID
    var cid = "chart-" + s.symbol;

    var card = document.createElement("div");
    card.className = "action-card";
    card.style.borderLeft = "3px solid " + clr;
    var sharesStr = h ? h.shares.toFixed(2) : "";
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;">' +
      "<strong>" +
      s.symbol +
      " " +
      s.name +
      "</strong>" +
      '<span style="color:' +
      clr +
      '">' +
      m.price.toFixed(2) +
      "</span>" +
      "</div>" +
      '<div style="font-size:10px;color:var(--text-muted);">' +
      s.industry +
      " | " +
      s.desc +
      "</div>" +
      (h
        ? '<div style="font-size:10px;margin:4px 0;">' +
          "持仓" +
          h.shares +
          "股 均价" +
          h.avgPrice.toFixed(2) +
          ' 盈亏<span style="color:' +
          clr +
          '">' +
          Math.round((m.price - h.avgPrice) * h.shares) +
          "</span>" +
          "</div>"
        : "") +
      stdInvBtns(s.symbol, m.price, h, "10", "100", "买10", "买100") +
      '<canvas id="' +
      cid +
      '" width="160" height="40" style="width:160px;height:40px;margin-top:4px;background:rgba(0,0,0,0.15);border-radius:3px;"></canvas>';
    grid.appendChild(card);
  }

  area.appendChild(grid);

  setTimeout(function () {
    // Draw charts（颜色由 drawPriceChart 方向判定，不再传固定色）
    for (var i = 0; i < INV_STOCKS.length; i++) {
      var s = INV_STOCKS[i];
      if (s.category !== "股票") continue;
      var m = inv.stockMarket[s.symbol];
      if (m) drawPriceChart("chart-" + s.symbol, m.history);
    }
    // Bind buy/sell
    area.querySelectorAll(".ibuy").forEach(function (b) {
      b.onclick = function () {
        buyInvStock(this.dataset.s, parseInt(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
    area.querySelectorAll(".ibuy-all").forEach(function (b) {
      b.onclick = function () {
        var price = parseFloat(this.dataset.p);
        var maxQ =
          price > 0
            ? Math.floor(StateManager.getState().resources.cash / price)
            : 0;
        if (maxQ < 1) {
          StateManager.addMessage("现金不足，无法全买", "warning");
          return;
        }
        buyInvStock(this.dataset.s, maxQ);
        renderInvestmentTab(state, parent);
      };
    });
    area.querySelectorAll(".isell").forEach(function (b) {
      b.onclick = function () {
        sellInvStock(this.dataset.s, parseInt(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
    // 自定义数量事件绑定
    bindInvQtyHandlers(area, state, parent, null);
  }, 0);
}

// ---- 子tab渲染：虚拟币（10种） ----
function renderBtc(area, inv, state, parent) {
  var grid = document.createElement("div");
  grid.className = "action-cards";
  grid.style.gridTemplateColumns = "repeat(auto-fill,minmax(230px,1fr))";

  var fg = Math.round(inv.btcFearGreed || 50);
  var fgColor = fg > 60 ? "#c4553d" : fg > 40 ? "#c49a3a" : "#4a9e5c";
  var fgLabel = fg > 60 ? "贪婪" : fg > 40 ? "中性" : "恐惧";

  // 顶部市场情绪
  var header = document.createElement("div");
  header.style.cssText =
    "margin-bottom:10px;display:flex;gap:10px;flex-wrap:wrap;";
  header.innerHTML =
    '<div class="action-card" style="flex:1;min-width:160px;padding:10px;text-align:center;">' +
    '<div style="font-size:12px;color:var(--text-muted);">虚拟币市场情绪</div>' +
    '<div style="font-size:28px;font-weight:bold;color:' +
    fgColor +
    ';">' +
    fg +
    "</div>" +
    '<div style="font-size:11px;color:' +
    fgColor +
    ';">' +
    fgLabel +
    "（影响全网波动）</div>" +
    "</div>";
  area.appendChild(header);

  // 所有虚拟币
  var cryptos = [];
  for (var j = 0; j < INV_STOCKS.length; j++) {
    if (INV_STOCKS[j].category === "虚拟币") cryptos.push(INV_STOCKS[j]);
  }
  for (var i = 0; i < cryptos.length; i++) {
    var s = cryptos[i];
    var m = inv.stockMarket[s.symbol];
    if (!m) continue;
    var h = null;
    for (var j = 0; j < inv.stockHoldings.length; j++) {
      if (inv.stockHoldings[j].symbol === s.symbol) {
        h = inv.stockHoldings[j];
        break;
      }
    }
    var chg =
      m.history.length >= 2
        ? m.price - m.history[m.history.length - 2].price
        : 0;
    var clr = chg >= 0 ? "var(--danger)" : "var(--success)";
    var unit = s.unit || "个";
    var cid = "chart-" + s.symbol;

    var card = document.createElement("div");
    card.className = "action-card";
    card.style.borderLeft = "3px solid " + clr;
    var bq = s.basePrice > 1000 ? 0.001 : s.basePrice > 100 ? 0.1 : 10;
    var dec = s.basePrice > 1000 ? 4 : s.basePrice > 100 ? 2 : 0;
    var sharesStr = h ? h.shares.toFixed(dec) : "";
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;">' +
      "<strong>" +
      s.name +
      " (" +
      s.symbol +
      ")</strong>" +
      '<span style="color:' +
      clr +
      '">¥' +
      m.price.toLocaleString() +
      "</span>" +
      "</div>" +
      '<div style="font-size:10px;color:var(--text-muted);">' +
      s.desc +
      "</div>" +
      (h
        ? '<div style="font-size:10px;margin:4px 0;">' +
          "持有 " +
          sharesStr +
          " " +
          unit +
          " 均价¥" +
          h.avgPrice.toFixed(2) +
          ' 盈亏<span style="color:' +
          clr +
          '">¥' +
          Math.round((m.price - h.avgPrice) * h.shares) +
          "</span>" +
          "</div>"
        : "") +
      (function () {
        var bq2 = s.basePrice > 1000 ? 0.01 : s.basePrice > 100 ? 1 : 100;
        var qtyLabel = bq < 1 ? bq.toString() : Math.round(bq).toString();
        var qtyLabel2 = bq2 < 1 ? bq2.toString() : Math.round(bq2).toString();
        return stdInvBtns(
          s.symbol,
          m.price,
          h,
          bq.toString(),
          bq2.toString(),
          "买" + qtyLabel,
          "买" + qtyLabel2,
          dec,
        );
      })() +
      '<canvas id="' +
      cid +
      '" width="160" height="40" style="width:160px;height:40px;margin-top:4px;background:rgba(0,0,0,0.15);border-radius:3px;"></canvas>';
    grid.appendChild(card);
  }

  area.appendChild(grid);

  setTimeout(function () {
    for (var i = 0; i < cryptos.length; i++) {
      var m = inv.stockMarket[cryptos[i].symbol];
      if (m) drawPriceChart("chart-" + cryptos[i].symbol, m.history);
    }
    area.querySelectorAll(".ibuy").forEach(function (b) {
      b.onclick = function () {
        buyInvStock(this.dataset.s, parseFloat(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
    area.querySelectorAll(".ibuy-all").forEach(function (b) {
      b.onclick = function () {
        var price = parseFloat(this.dataset.p);
        var dec = parseInt(this.dataset.dec) || 0;
        var factor = Math.pow(10, dec);
        var maxQ =
          price > 0
            ? Math.floor(
                (StateManager.getState().resources.cash / price) * factor,
              ) / factor
            : 0;
        if (maxQ <= 0) {
          StateManager.addMessage("现金不足，无法全买", "warning");
          return;
        }
        buyInvStock(this.dataset.s, maxQ);
        renderInvestmentTab(state, parent);
      };
    });
    area.querySelectorAll(".isell").forEach(function (b) {
      b.onclick = function () {
        sellInvStock(this.dataset.s, parseFloat(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
    // 自定义数量事件绑定
    bindInvQtyHandlers(area, state, parent, null);
  }, 0);
}

// ---- 子tab渲染：贵金属 ----
function renderPrecious(area, inv, state, parent) {
  var grid = document.createElement("div");
  grid.className = "action-cards";
  grid.style.gridTemplateColumns = "repeat(auto-fill,minmax(230px,1fr))";

  var metals = [];
  for (var j = 0; j < INV_STOCKS.length; j++) {
    if (INV_STOCKS[j].category === "贵金属") metals.push(INV_STOCKS[j].symbol);
  }
  for (var i = 0; i < metals.length; i++) {
    var sym = metals[i];
    var s = null;
    for (var j = 0; j < INV_STOCKS.length; j++) {
      if (INV_STOCKS[j].symbol === sym) {
        s = INV_STOCKS[j];
        break;
      }
    }
    if (!s) continue;
    var m = inv.stockMarket[sym];
    if (!m) continue;
    var h = null;
    for (var j = 0; j < inv.stockHoldings.length; j++) {
      if (inv.stockHoldings[j].symbol === sym) {
        h = inv.stockHoldings[j];
        break;
      }
    }
    var chg =
      m.history.length >= 2
        ? m.price - m.history[m.history.length - 2].price
        : 0;
    var clr = chg >= 0 ? "var(--danger)" : "var(--success)";
    var unit = s.unit || "g";
    var cid = "chart-" + sym;

    var card = document.createElement("div");
    card.className = "action-card";
    card.style.borderLeft = "3px solid " + clr;
    var sharesStr = h ? h.shares.toFixed(2) : "";
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;">' +
      "<strong>" +
      s.name +
      " (" +
      sym +
      ")</strong>" +
      '<span style="color:' +
      clr +
      '">' +
      m.price.toFixed(2) +
      "</span>" +
      "</div>" +
      '<div style="font-size:10px;color:var(--text-muted);">' +
      s.desc +
      "</div>" +
      (h
        ? '<div style="font-size:10px;margin:4px 0;">' +
          "持有 " +
          sharesStr +
          " " +
          unit +
          " 均价" +
          h.avgPrice.toFixed(2) +
          ' 盈亏<span style="color:' +
          clr +
          '">' +
          Math.round((m.price - h.avgPrice) * h.shares) +
          "</span>" +
          "</div>"
        : "") +
      stdInvBtns(sym, m.price, h, "10", "100", "买10", "买100") +
      '<canvas id="' +
      cid +
      '" width="160" height="40" style="width:160px;height:40px;margin-top:4px;background:rgba(0,0,0,0.15);border-radius:3px;"></canvas>';
    grid.appendChild(card);
  }

  area.appendChild(grid);

  setTimeout(function () {
    for (var i = 0; i < metals.length; i++) {
      var m = inv.stockMarket[metals[i]];
      if (m) drawPriceChart("chart-" + metals[i], m.history);
    }
    area.querySelectorAll(".ibuy").forEach(function (b) {
      b.onclick = function () {
        buyInvStock(this.dataset.s, parseInt(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
    area.querySelectorAll(".ibuy-all").forEach(function (b) {
      b.onclick = function () {
        var price = parseFloat(this.dataset.p);
        var maxQ =
          price > 0
            ? Math.floor(StateManager.getState().resources.cash / price)
            : 0;
        if (maxQ < 1) {
          StateManager.addMessage("现金不足，无法全买", "warning");
          return;
        }
        buyInvStock(this.dataset.s, maxQ);
        renderInvestmentTab(state, parent);
      };
    });
    area.querySelectorAll(".isell").forEach(function (b) {
      b.onclick = function () {
        sellInvStock(this.dataset.s, parseInt(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
    // 自定义数量事件绑定
    bindInvQtyHandlers(area, state, parent, null);
  }, 0);
}

// ---- 子tab渲染：期货基金 ----
function renderFutures(area, inv, state, parent) {
  var grid = document.createElement("div");
  grid.className = "action-cards";
  grid.style.gridTemplateColumns = "repeat(auto-fill,minmax(230px,1fr))";

  var items = [];
  for (var j = 0; j < INV_STOCKS.length; j++) {
    var c = INV_STOCKS[j].category;
    if (c === "期货" || c === "基金") items.push(INV_STOCKS[j].symbol);
  }
  for (var i = 0; i < items.length; i++) {
    var sym = items[i];
    var s = null;
    for (var j = 0; j < INV_STOCKS.length; j++) {
      if (INV_STOCKS[j].symbol === sym) {
        s = INV_STOCKS[j];
        break;
      }
    }
    if (!s) continue;
    var m = inv.stockMarket[sym];
    if (!m) continue;
    var h = null;
    for (var j = 0; j < inv.stockHoldings.length; j++) {
      if (inv.stockHoldings[j].symbol === sym) {
        h = inv.stockHoldings[j];
        break;
      }
    }
    var chg =
      m.history.length >= 2
        ? m.price - m.history[m.history.length - 2].price
        : 0;
    var clr = chg >= 0 ? "var(--danger)" : "var(--success)";
    var unit = s.unit || "份";
    var cid = "chart-" + sym;

    var card = document.createElement("div");
    card.className = "action-card";
    card.style.borderLeft = "3px solid " + clr;
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;">' +
      "<strong>" +
      s.name +
      " (" +
      sym +
      ")</strong>" +
      '<span style="color:' +
      clr +
      '">' +
      m.price.toFixed(2) +
      "</span>" +
      "</div>" +
      '<div style="font-size:10px;color:var(--text-muted);">' +
      s.desc +
      "</div>" +
      (h
        ? '<div style="font-size:10px;margin:4px 0;">' +
          "持有 " +
          sharesStr +
          " " +
          unit +
          " 均价" +
          h.avgPrice.toFixed(2) +
          ' 盈亏<span style="color:' +
          clr +
          '">' +
          Math.round((m.price - h.avgPrice) * h.shares) +
          "</span>" +
          "</div>"
        : "") +
      stdInvBtns(sym, m.price, h, "1", "10", "买1", "买10") +
      '<canvas id="' +
      cid +
      '" width="160" height="40" style="width:160px;height:40px;margin-top:4px;background:rgba(0,0,0,0.15);border-radius:3px;"></canvas>';
    grid.appendChild(card);
  }

  area.appendChild(grid);

  setTimeout(function () {
    for (var i = 0; i < items.length; i++) {
      var m = inv.stockMarket[items[i]];
      if (m) drawPriceChart("chart-" + items[i], m.history);
    }
    area.querySelectorAll(".ibuy").forEach(function (b) {
      b.onclick = function () {
        buyInvStock(this.dataset.s, parseInt(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
    area.querySelectorAll(".ibuy-all").forEach(function (b) {
      b.onclick = function () {
        var price = parseFloat(this.dataset.p);
        var maxQ =
          price > 0
            ? Math.floor(StateManager.getState().resources.cash / price)
            : 0;
        if (maxQ < 1) {
          StateManager.addMessage("现金不足，无法全买", "warning");
          return;
        }
        buyInvStock(this.dataset.s, maxQ);
        renderInvestmentTab(state, parent);
      };
    });
    area.querySelectorAll(".isell").forEach(function (b) {
      b.onclick = function () {
        sellInvStock(this.dataset.s, parseInt(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
    // 自定义数量事件绑定
    bindInvQtyHandlers(area, state, parent, null);
  }, 0);
}

// ---- 子tab渲染：房产 ----
function renderProperties(area, inv, state, parent) {
  var list = inv.properties || [];

  // === 说明区 ===
  var tipDiv = document.createElement("div");
  tipDiv.style.cssText =
    "font-size:10px;color:var(--text-muted);background:rgba(255,255,255,0.04);border-radius:6px;padding:6px 10px;margin-bottom:10px;";
  tipDiv.textContent =
    "💡 租房 = 日常居住开销（在城中村升级住所）；买房 = 投资，可切换「自住」模式免日租并提升生活品质。自住房不产生租金，其他房产照常收租。";
  area.appendChild(tipDiv);

  // === 🏡 高档租赁区（供玩家作为租客升格到更高tier） ===
  if (typeof HOUSING_TIERS !== "undefined") {
    var highTier = HOUSING_TIERS[4]; // tier 4 豪华公寓
    if (highTier) {
      var rentDiv = document.createElement("div");
      rentDiv.style.cssText =
        "margin-bottom:12px;padding:10px;background:rgba(52,152,219,0.08);border:1px solid var(--info,#3498db);border-radius:8px;";
      var curTier = state.housing ? state.housing.tier || 0 : 0;
      var canRentHigh = state.resources.cash >= highTier.cost && curTier < 4;
      var alreadyHigh = curTier >= 4;
      rentDiv.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
        '<h4 style="margin:0;font-size:12px;color:var(--info,#3498db);">🏡 高档租赁房源</h4>' +
        '<span style="font-size:10px;color:var(--text-muted);">押金即日费，日租持续扣除</span>' +
        "</div>" +
        '<div style="display:flex;align-items:center;gap:12px;">' +
        '<span style="font-size:20px;">' +
        highTier.icon +
        "</span>" +
        '<div style="flex:1;">' +
        '<div style="font-weight:600;font-size:12px;">' +
        highTier.name +
        "</div>" +
        '<div style="font-size:10px;color:var(--text-muted);">' +
        highTier.desc +
        "</div>" +
        '<div style="font-size:11px;margin-top:3px;">押金 <strong style="color:var(--warning);">¥' +
        highTier.cost.toLocaleString() +
        "</strong> | 日租 <strong>¥" +
        highTier.rent +
        "/天</strong> | 疲劳恢复+" +
        highTier.fatigueRecovery +
        " 卫生+" +
        highTier.hygieneBonus +
        " 心情+" +
        highTier.happinessBonus +
        "</div>" +
        "</div>" +
        (alreadyHigh
          ? '<span style="font-size:11px;color:var(--success);">✅ 当前住所</span>'
          : '<button class="btn btn-sm btn-primary" id="rent-high-tier-btn"' +
            (canRentHigh ? "" : " disabled") +
            ">" +
            (canRentHigh ? "租入" : "现金不足") +
            "</button>") +
        "</div>";
      area.appendChild(rentDiv);
      if (!alreadyHigh) {
        setTimeout(function () {
          var btn = document.getElementById("rent-high-tier-btn");
          if (btn)
            btn.onclick = function () {
              var s = StateManager.getState();
              if (s.resources.cash < highTier.cost) {
                StateManager.addMessage("现金不足", "danger");
                return;
              }
              s.resources.cash -= highTier.cost;
              s.housing.tier = 4;
              s.housing.rentedDay = s.player.day;
              s.inventory.capacity =
                highTier.capacity + (s.housing.storageCapacity || 0);
              StateManager.addMessage(
                "🏙️ 搬入豪华公寓！每日租金¥" +
                  highTier.rent +
                  "，享受人上人的生活。",
                "success",
              );
              renderInvestmentTab(s, parent);
            };
        }, 0);
      }
    }
  }

  // === 📊 市场阶段横幅（v2 波动系统） ===
  if (typeof renderPropertyPhaseBanner === "function") {
    var bannerHtml = renderPropertyPhaseBanner(state);
    if (bannerHtml) {
      var bannerDiv = document.createElement("div");
      bannerDiv.innerHTML = bannerHtml;
      var bannerNode = bannerDiv.firstChild;
      if (bannerNode) area.appendChild(bannerNode);
    }
  }

  // === 🏠 可购买房产市场 ===
  var marketDiv = document.createElement("div");
  marketDiv.style.cssText = "margin-bottom:12px;";
  marketDiv.innerHTML =
    '<h4 style="font-size:13px;color:var(--accent);margin-bottom:8px;">🏠 房产市场</h4>';
  var marketGrid = document.createElement("div");
  marketGrid.className = "action-cards";
  marketGrid.style.gridTemplateColumns = "repeat(auto-fill,minmax(200px,1fr))";

  for (var mi = 0; mi < PROPERTIES.length; mi++) {
    var propDef = PROPERTIES[mi];
    var owned = false;
    for (var pi = 0; pi < list.length; pi++) {
      if (list[pi].id === propDef.id) {
        owned = true;
        break;
      }
    }
    var canAfford = state.resources.cash >= propDef.price;
    var card = document.createElement("div");
    card.className = "action-card";
    card.style.borderLeft =
      "3px solid " + (owned ? "var(--success)" : "var(--warning)");
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;"><strong>' +
      propDef.name +
      "</strong>" +
      '<span style="font-size:10px;color:var(--text-muted);">' +
      (propDef.type || "") +
      "</span></div>" +
      '<div style="font-size:10px;color:var(--text-muted);">' +
      propDef.desc +
      "</div>" +
      '<div style="font-size:11px;margin:4px 0;">售价: <strong style="color:var(--warning);">¥' +
      propDef.price.toLocaleString() +
      "</strong> | 月租: ¥" +
      propDef.rent.toLocaleString() +
      "</div>" +
      (typeof getPropertyVolatilityLabel === "function"
        ? getPropertyVolatilityLabel(propDef)
        : '<div style="font-size:10px;color:var(--text-muted);">年增值: +' +
          ((propDef.appreciation || 0.0001) * 365 * 100).toFixed(1) +
          "%</div>") +
      (owned
        ? '<div style="font-size:10px;color:var(--success);margin-top:4px;">✅ 已持有</div>'
        : '<button class="btn btn-sm btn-success buy-prop-btn" data-id="' +
          propDef.id +
          '"' +
          (canAfford ? "" : " disabled") +
          ">" +
          (canAfford ? "购买" : "现金不足") +
          "</button>");
    marketGrid.appendChild(card);
  }
  marketDiv.appendChild(marketGrid);
  area.appendChild(marketDiv);

  // === 📊 已持有房产汇总 ===
  if (list.length > 0) {
    var holdingsDiv = document.createElement("div");
    holdingsDiv.style.cssText =
      "margin-bottom:12px;padding:12px;background:rgba(46,204,113,0.06);border:1px solid var(--success);border-radius:8px;";
    var totalPropVal = 0,
      totalPropPL = 0;
    var holdingRows = "";
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      var cur = p.currentPrice || p.buyPrice;
      var buyP = p.buyPrice;
      var diff = cur - buyP;
      var pct = ((diff / buyP) * 100).toFixed(1);
      var clr = diff >= 0 ? "var(--danger)" : "var(--success)";
      var sign = diff >= 0 ? "+" : "";
      totalPropVal += cur;
      totalPropPL += diff;
      var monthlyRent = p.rent || 0;
      var isSelf = inv.selfLivePropertyId === p.id;
      holdingRows += `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:11px;gap:8px;">
          <span style="font-weight:600;min-width:80px;">${p.name}${isSelf ? ' <span style="color:var(--info,#3498db);font-size:9px;">🏠自住</span>' : ""}</span>
          <span style="color:var(--text-muted);min-width:35px;font-size:10px;">${p.type || ""}</span>
          <span style="min-width:70px;text-align:right;">买入 ¥${buyP.toLocaleString()}</span>
          <span style="min-width:70px;text-align:right;color:${clr};">现值 ¥${cur.toLocaleString()}</span>
          <span style="min-width:80px;text-align:right;color:${clr};font-weight:600;">${sign}¥${Math.round(diff).toLocaleString()} (${sign}${pct}%)</span>
          <span style="min-width:55px;text-align:right;font-size:10px;">${isSelf ? '<span style="color:var(--info,#3498db);">自住(无租金)</span>' : "月租 ¥" + monthlyRent.toLocaleString()}</span>
          <button class="btn btn-sm ${isSelf ? "btn-secondary" : "btn-info"} toggle-self-live" data-id="${p.id}" style="font-size:10px;">${isSelf ? "改出租" : "自住"}</button>
          <button class="btn btn-sm btn-danger sell-prop" data-id="${p.id}" style="font-size:10px;">出售</button>
        </div>`;
    }
    var tClr = totalPropPL >= 0 ? "var(--danger)" : "var(--success)";
    var tSign = totalPropPL >= 0 ? "+" : "";
    holdingsDiv.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <h4 style="margin:0;font-size:13px;color:var(--success);">🏠 我的房产</h4>
        <span style="font-size:11px;">总估值 <strong style="color:var(--accent);">¥${Math.round(totalPropVal).toLocaleString()}</strong> | 总盈亏 <strong style="color:${tClr};">${tSign}¥${Math.round(totalPropPL).toLocaleString()}</strong></span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:10px;color:var(--text-muted);border-bottom:2px solid var(--border);margin-bottom:4px;">
        <span style="min-width:80px;">房产</span><span style="min-width:35px;">类型</span><span style="min-width:70px;text-align:right;">买入价</span><span style="min-width:70px;text-align:right;">现值</span><span style="min-width:80px;text-align:right;">盈亏</span><span style="min-width:55px;text-align:right;">月租</span><span style="min-width:40px;"></span>
      </div>
      ${holdingRows}
    `;
    area.appendChild(holdingsDiv);
  }

  // 绑定事件
  setTimeout(function () {
    area.querySelectorAll(".buy-prop-btn").forEach(function (b) {
      b.onclick = function () {
        buyProperty(this.dataset.id);
        renderInvestmentTab(state, parent);
      };
    });
    area.querySelectorAll(".sell-prop").forEach(function (b) {
      b.onclick = function () {
        sellProperty(this.dataset.id);
        renderInvestmentTab(state, parent);
      };
    });
    area.querySelectorAll(".toggle-self-live").forEach(function (b) {
      b.onclick = function () {
        var s = StateManager.getState();
        var propId = this.dataset.id;
        if (s.investment.selfLivePropertyId === propId) {
          // 切换为出租
          s.investment.selfLivePropertyId = null;
          StateManager.addMessage(
            "🏢 已将房产改为出租，恢复日常租房模式。",
            "info",
          );
        } else {
          // 切换为自住：找对应房产定义，升格住所tier
          s.investment.selfLivePropertyId = propId;
          var propDef = (
            typeof PROPERTIES !== "undefined" ? PROPERTIES : []
          ).find(function (pd) {
            return pd.id === propId;
          });
          if (typeof HOUSING_TIERS !== "undefined") {
            var newTier = propDef
              ? propDef.price >= 1000000
                ? 4
                : propDef.price >= 200000
                  ? 3
                  : 2
              : 3;
            if (newTier > (s.housing.tier || 0)) {
              s.housing.tier = newTier;
              s.inventory.capacity =
                HOUSING_TIERS[newTier].capacity +
                (s.housing.storageCapacity || 0);
            }
          }
          StateManager.addMessage(
            "🏠 已将房产设为自住，每日免租金！" +
              (propDef ? "住所升格为" + propDef.name + "。" : ""),
            "success",
          );
        }
        renderInvestmentTab(s, parent);
      };
    });
  }, 0);
}

// ---- 子tab渲染：汽车 ----
function renderCars(area, inv, state, parent) {
  var list = inv.cars || [];

  // === 🚗 可购买汽车市场 ===
  var marketDiv = document.createElement("div");
  marketDiv.style.cssText = "margin-bottom:12px;";
  marketDiv.innerHTML =
    '<h4 style="font-size:13px;color:var(--accent);margin-bottom:8px;">🚗 汽车市场</h4>';
  var marketGrid = document.createElement("div");
  marketGrid.className = "action-cards";
  marketGrid.style.gridTemplateColumns = "repeat(auto-fill,minmax(210px,1fr))";

  for (var mi = 0; mi < CAR_TYPES.length; mi++) {
    var carDef = CAR_TYPES[mi];
    var owned = false;
    for (var ci = 0; ci < list.length; ci++) {
      if (list[ci].id === carDef.id) {
        owned = true;
        break;
      }
    }
    var canAfford = state.resources.cash >= carDef.price;
    var card = document.createElement("div");
    card.className = "action-card";
    card.style.borderLeft =
      "3px solid " + (owned ? "var(--success)" : "var(--warning)");
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;"><strong>' +
      carDef.name +
      "</strong>" +
      '<span style="font-size:10px;color:var(--text-muted);">' +
      carDef.desc +
      "</span></div>" +
      '<div style="font-size:11px;margin:4px 0;">售价: <strong style="color:var(--warning);">¥' +
      carDef.price.toLocaleString() +
      "</strong> | 月维护: ¥" +
      carDef.maintenance.toLocaleString() +
      "</div>" +
      '<div style="font-size:10px;color:var(--text-muted);">行动力上限 +' +
      carDef.travelBonus +
      " | 年折旧: " +
      (carDef.depreciation * 365 * 100).toFixed(1) +
      "%</div>" +
      (owned
        ? '<div style="font-size:10px;color:var(--success);margin-top:4px;">✅ 已持有</div>'
        : '<button class="btn btn-sm btn-success buy-car-btn" data-id="' +
          carDef.id +
          '"' +
          (canAfford ? "" : " disabled") +
          ">" +
          (canAfford ? "购买" : "现金不足") +
          "</button>");
    marketGrid.appendChild(card);
  }
  marketDiv.appendChild(marketGrid);
  area.appendChild(marketDiv);

  // === 📊 已持有汽车汇总 ===
  if (list.length > 0) {
    var holdingsDiv = document.createElement("div");
    holdingsDiv.style.cssText =
      "margin-bottom:12px;padding:12px;background:rgba(243,156,18,0.06);border:1px solid var(--warning);border-radius:8px;";
    var totalCarVal = 0,
      totalCarPL = 0;
    var holdingRows = "";
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      var cur = c.currentPrice || c.buyPrice;
      var buyP = c.buyPrice;
      var diff = cur - buyP;
      var pct = ((diff / buyP) * 100).toFixed(1);
      var clr = diff >= 0 ? "var(--danger)" : "var(--success)";
      var sign = diff >= 0 ? "+" : "";
      totalCarVal += cur;
      totalCarPL += diff;
      holdingRows += `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:11px;gap:8px;">
          <span style="font-weight:600;min-width:80px;">${c.name}</span>
          <span style="min-width:65px;text-align:right;">买入 ¥${buyP.toLocaleString()}</span>
          <span style="min-width:65px;text-align:right;color:${clr};">现值 ¥${cur.toLocaleString()}</span>
          <span style="min-width:80px;text-align:right;color:${clr};font-weight:600;">${sign}¥${Math.round(diff).toLocaleString()} (${sign}${pct}%)</span>
          <span style="min-width:60px;text-align:right;font-size:10px;">月维护 ¥${c.maintenance || 0}</span>
        </div>`;
    }
    var tClr = totalCarPL >= 0 ? "var(--danger)" : "var(--success)";
    var tSign = totalCarPL >= 0 ? "+" : "";
    holdingsDiv.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <h4 style="margin:0;font-size:13px;color:var(--warning);">🚗 我的车辆</h4>
        <span style="font-size:11px;">总估值 <strong style="color:var(--accent);">¥${Math.round(totalCarVal).toLocaleString()}</strong> | 总盈亏 <strong style="color:${tClr};">${tSign}¥${Math.round(totalCarPL).toLocaleString()}</strong></span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:10px;color:var(--text-muted);border-bottom:2px solid var(--border);margin-bottom:4px;">
        <span style="min-width:80px;">车辆</span><span style="min-width:65px;text-align:right;">买入价</span><span style="min-width:65px;text-align:right;">现值</span><span style="min-width:80px;text-align:right;">盈亏</span><span style="min-width:60px;text-align:right;">月维护</span>
      </div>
      ${holdingRows}
    `;
    area.appendChild(holdingsDiv);
  }

  // 绑定事件
  setTimeout(function () {
    area.querySelectorAll(".buy-car-btn").forEach(function (b) {
      b.onclick = function () {
        buyCar(this.dataset.id);
        renderInvestmentTab(state, parent);
      };
    });
  }, 0);
}
