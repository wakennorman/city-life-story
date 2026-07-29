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
    trend: 0.003,
    desc: "AI芯片之王,全球最热",
  },
  {
    symbol: "TSMC",
    name: "台积殿",
    category: "股票",
    industry: "科技",
    basePrice: 600,
    volatility: 0.13,
    trend: 0.003,
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
    trend: 0.003,
    desc: "电动+火箭+AI,马斯克概念",
  },
  {
    symbol: "BYD",
    name: "比压迪",
    category: "股票",
    industry: "新能源",
    basePrice: 180,
    volatility: 0.17,
    trend: 0.004,
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
    trend: 0.004,
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
    basePrice: 2000,
    volatility: 0.4,
    trend: -0.003,
    desc: "狗狗币杀手,社区驱动",
    unit: "亿",
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

/**
 * 房产→住所等级映射表
 * 将可购买的房产（住宅类）映射到 HOUSING_TIERS 住所等级，
 * 玩家设定自住时自动升格对应住所品质。
 * 设计参考真实居住市场分级：
 * - 城中村握手楼 → 单间级别（¥80k，小但自己的空间）
 * - 郊区经济房 → 单间级别（¥250k，位置偏但居住舒适）
 * - 老破小学区/Loft/酒店式公寓 → 一居室级别（¥500k~¥600k）
 * - 精装两居室 → 一居室级别（¥1.5M，实际对应改善型住房）
 * - 花园洋房/海景度假屋 → 豪华公寓级别（¥3M~¥3.5M）
 * - 别墅/江景大平层 → 别墅级别（¥5M~¥8M）
 * - 古城四合院/豪宅 → 豪宅级别（¥12M+）
 * - 商铺/写字楼/工业/车位/海外 → 不可自住（null）
 */
const PROPERTY_HOUSING_MAP = {
  apt_cv: 2, // 城中村握手楼 → 单间
  apt_old: 3, // 老破小学区 → 一居室
  apt_suburb: 2, // 郊区经济房 → 单间
  apt_new: 3, // 精装两居室 → 一居室
  apt_loft: 3, // Loft挑高公寓 → 一居室
  apt_garden: 4, // 花园洋房 → 豪华公寓
  luxury: 5, // 江景大平层 → 别墅
  villa: 5, // 山水别墅 → 别墅
  apt_sea: 4, // 海景度假屋 → 豪华公寓
  apt_oldtown: 6, // 古城四合院 → 豪宅
  hotel_room: 3, // 酒店式公寓 → 一居室（商住两用）
  // 商铺/写字楼/工业/车位/海外 不可自住
};

/**
 * 获取房产对应的住所等级
 * @param {string} propId - 房产ID
 * @returns {number|null} 对应 HOUSING_TIERS 的 tier，不可居住返回 null
 */
function getPropertyHousingTier(propId) {
  return PROPERTY_HOUSING_MAP.hasOwnProperty(propId)
    ? PROPERTY_HOUSING_MAP[propId]
    : null;
}

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
    // 同时修复旧存档中价格异常过低（如旧版SHIB basePrice 0.00002→0.01）的数据
    var existing = inv.stockMarket[s.symbol];
    if (!existing || (existing.price <= 0.01 && s.basePrice > 1)) {
      if (existing) {
        delete inv.stockMarket[s.symbol];
      }
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
          price: Math.round(seedPrice * 10000) / 10000,
        });
      }
      history.push({
        day: state.player.day,
        price: Math.round(mPrice * 10000) / 10000,
      });
      inv.stockMarket[s.symbol] = {
        price: Math.round(mPrice * 10000) / 10000,
        history: history,
      };
    }
  }
  // [全系统自洽修复] 域E 修复:btcPrice undefined 判定失效——`undefined <= 0` 恒为 false，
  //   旧存档缺 btcPrice 时永不回填 → sellBtc 用 undefined 算 revenue → 现金被污染为 NaN（经济系统静默报废）。
  //   改为显式类型判定，任何非有限正数都回填 200000。
  if (typeof inv.btcPrice !== "number" || !isFinite(inv.btcPrice) || inv.btcPrice <= 0)
    inv.btcPrice = 200000;
  if (!inv.btcHistory) inv.btcHistory = [];
  // [全系统自洽修复] 域E 修复:initInvestment 未回填 stockHoldings/properties/cars，
  //   而写入路径(buyInvStock/buyProperty/buyCar)裸访问它们 → 旧存档迁移后首次买入即 TypeError。
  //   与本文件读取路径(tick/snapshot/render 均 `|| []`)保持一致，统一在初始化处回填。
  if (!Array.isArray(inv.stockHoldings)) inv.stockHoldings = [];
  if (!Array.isArray(inv.properties)) inv.properties = [];
  if (!Array.isArray(inv.cars)) inv.cars = [];
  if (typeof inv.btcHoldings !== "number" || !isFinite(inv.btcHoldings))
    inv.btcHoldings = 0;
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
  // 仅当确实初始化了新数据时才更新 lastTickDay，避免误重置导致 tick 被跳过
  if (initialized) inv.lastTickDay = state.player.day;

  // 房产市场 v2 初始化/迁移
  if (typeof initPropertyMarket === "function") {
    initPropertyMarket(state);
  }
}

function tickInvestmentDaily(state) {
  var inv = state.investment;
  if (!inv || inv.lastTickDay >= state.player.day) return;
  inv.lastTickDay = state.player.day;
  // [全系统自洽修复] 域E R679 A类: state.flags 守卫(旧存档防 TypeError)
  if (!state.flags) state.flags = {};
  state.flags._invSkillXpToday = false; // [全系统自洽修复] 域E 联动: 每日重置投资技能XP标记

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

    // [全系统自洽修复] 域E A类#2: NaN 价格守卫 — 旧存档/数据异常时重置为 basePrice
    if (!isFinite(m.price) || m.price <= 0) {
      m.price = s.basePrice * Random.float(0.85, 1.15);
      m.price = Math.round(m.price * 10000) / 10000;
    }

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

    // [全系统自洽修复] 域G 联动增强3: 极端天气→市场波动放大（G→E）
    // 极端天气时 volatility 临时放大 15-30%，台风/暴雪影响最大
    if (state.weather && state.weather.current) {
      var _weatherVolMul = 1.0;
      var _wId = state.weather.current;
      if (_wId === "typhoon" || _wId === "sandstorm") _weatherVolMul = 1.3;
      else if (_wId === "snowy" || _wId === "stormy" || _wId === "cold_snap") _weatherVolMul = 1.2;
      else if (_wId === "heatwave" || _wId === "heavy_smog") _weatherVolMul = 1.15;
      if (_weatherVolMul > 1.0) {
        baseChange = 1 + s.trend + Random.float(-s.volatility * _weatherVolMul, s.volatility * _weatherVolMul);
        // 重新应用热度偏置（因 baseChange 被重写，需重新计算）
        if (typeof getSectorHeat === "function") {
          var _heat2 = getSectorHeat(s.industry);
          if (_heat2 && _heat2 !== 1.0) baseChange *= 1 + (_heat2 - 1.0) * 0.1;
        }
      }
    }

    // 新闻效应乘数
    var newsMul =
      typeof getNewsEffectForInvestment === "function"
        ? getNewsEffectForInvestment(s.symbol, s.industry, s.category, state)
        : 1.0;
    // [全系统自洽修复] 域E R237:newsMul返回undefined→NaN守卫(源头修复)
    if (!isFinite(newsMul)) newsMul = 1.0;

    // [全系统自洽修复] 域E A类#1: 市场饱和度惩罚（从每日经济结算读取，按当前总资产动态计算，自修正）
    var _satPenalty = 1.0;
    if (state._economySettlement && isFinite(state._economySettlement.marketSaturationPenalty)) {
      _satPenalty = state._economySettlement.marketSaturationPenalty;
    }

    // [R712 域G 联动增强 G→E]: 年龄财务智慧 — 阅历越深,投资判断越稳
    // 在 volatility 层面降低随机波动,而非直接提升收益(模拟"稳"而非"多")
    var _ageWisdom = (state.flags && state.flags._ageFinWisdomBonus) || 0;
    var _wisdomVolReduction = 1 - _ageWisdom * 0.5; // 8% wisdom → 4% volatility 降低

    var oldPrice = m.price;
    m.price = Math.max(0.01, m.price * baseChange * newsMul * _satPenalty * _wisdomVolReduction);
    m.price = Math.round(m.price * 10000) / 10000;
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
    if (typeof applyNewsToPropertyPolicy === "function") {
      applyNewsToPropertyPolicy(state);
    }
    var propertyNewsMulFallback =
      typeof getNewsEffectForProperty === "function"
        ? getNewsEffectForProperty(state)
        : 1.0;
    for (var p = 0; p < (inv.properties || []).length; p++) {
      var prop = inv.properties[p];
      prop.currentPrice = Math.round(
        (prop.currentPrice || prop.buyPrice) *
          (1 +
            (prop.baseAppreciation || 0.0001) +
            Random.float(-0.001, 0.001)) *
          propertyNewsMulFallback,
      );
      var isSelfLived = inv.selfLivePropertyId === prop.id;
      if (state.player.day % 30 === 0 && !isSelfLived)
        state.resources.cash = (state.resources.cash || 0) + (prop.rent || 0);
    }
  }

  // 汽车（不受新闻直接影响，维持原状）
  for (var c = 0; c < (inv.cars || []).length; c++) {
    var car = inv.cars[c];
    // [全系统自洽修复] 域E A类#3: car.depreciation 可能未定义（旧存档），导致 price×NaN→NaN 传播
    var _depr = (typeof car.depreciation === "number" && isFinite(car.depreciation)) ? car.depreciation : 0.01;
    car.currentPrice = Math.round(
      (car.currentPrice || car.buyPrice) * (1 - _depr),
    );
    if (state.player.day % 30 === 0 && (state.resources.cash || 0) >= car.maintenance) // [全系统自洽修复] 域E A类: cash NaN守卫
      state.resources.cash = Math.max(0, (state.resources.cash || 0) - (car.maintenance || 0));
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

  // ================================================================
  // [域E联动] 组合市值峰值追踪（供 econ_portfolio_drawdown 事件判定回撤）
  // 每日一次，无副作用；try/catch 隔离，绝不拖垮主 tick
  // ================================================================
  try {
    var _pv = 0;
    var _sm = inv.stockMarket || {};
    var _holdings = inv.stockHoldings || [];
    for (var _hi = 0; _hi < _holdings.length; _hi++) {
      var _h = _holdings[_hi];
      var _m = _sm[_h.symbol];
      if (_m && isFinite(_m.price) && isFinite(_h.shares))
        _pv += _m.price * _h.shares;
    }
    var _props = inv.properties || [];
    for (var _pi = 0; _pi < _props.length; _pi++) {
      _pv += _props[_pi].currentPrice || _props[_pi].buyPrice || 0;
    }
    if ((inv.btcHoldings || 0) > 0)
      _pv += (inv.btcPrice || 0) * inv.btcHoldings;
    // [全系统自洽修复] 域E R738b 修复: investment.portfolio 全库零写入方,但 11+ 文件(r443/r454/r493/r497/r501/r509/r520/r529/r710/r718/r726/r734/part7)以其为 conditions 门槛或估值来源→约20个事件恒false死事件/估值恒0。此处每日tick单点维护真实结构(stocks:{symbol:{shares,avgPrice,avgCost}},funds:{},totalValue:含股/房/BTC市值),一次性复活全部读取方
    try {
      var _pf = { stocks: {}, funds: {}, totalValue: isFinite(_pv) ? _pv : 0 };
      for (var _pfi = 0; _pfi < _holdings.length; _pfi++) {
        var _pfh = _holdings[_pfi];
        if (_pfh && _pfh.symbol && isFinite(_pfh.shares) && _pfh.shares > 0) {
          var _pfAvg = isFinite(_pfh.avgPrice) ? _pfh.avgPrice : 0;
          _pf.stocks[_pfh.symbol] = { shares: _pfh.shares, avgPrice: _pfAvg, avgCost: _pfAvg };
        }
      }
      inv.portfolio = _pf;
    } catch (_pfe) { /* 静默:不拖垮主tick */ }
    if (_pv > 0) {
      if (!(inv._portfolioPeak > 0) || _pv > inv._portfolioPeak)
        inv._portfolioPeak = _pv;
      // [全系统自洽修复] 域E 联动增强(E→F): 记录组合市值历史用于趋势可视化
      if (!inv._portfolioPeakHistory) inv._portfolioPeakHistory = [];
      inv._portfolioPeakHistory.push({ day: state.player.day, value: _pv });
      if (inv._portfolioPeakHistory.length > 30) inv._portfolioPeakHistory.shift();
      // [全系统自洽修复] 域E 联动增强: E→G 资产里程碑叙事 — 首次跨越¥1万/¥10万/¥50万/¥100万时触发自我反思
      var _milestones = [10000, 50000, 100000, 500000, 1000000];
      for (var _mi = 0; _mi < _milestones.length; _mi++) {
        var _ms = _milestones[_mi];
        if (_pv >= _ms && !state.flags["_portfolioMilestone_" + _ms]) {
          state.flags["_portfolioMilestone_" + _ms] = true;
          var _msMsg = "";
          if (_ms === 10000) _msMsg = "💭 投资组合突破¥1万！虽然不算多，但这是你第一次真切感受到「钱生钱」的力量。";
          else if (_ms === 50000) _msMsg = "💭 投资组合突破¥5万！你开始认真思考资产配置了。";
          else if (_ms === 100000) _msMsg = "💭 投资组合突破¥10万！你已经不是那个为房租发愁的人了。";
          else if (_ms === 500000) _msMsg = "💭 投资组合突破¥50万！财务自由的目标似乎不再遥不可及。";
          else if (_ms === 1000000) _msMsg = "💭 投资组合突破¥100万！你做到了——这座城市里，你已经站在了前列。";
          if (_msMsg && typeof StateManager !== "undefined") {
            StateManager.addMessage(_msMsg, "event");
          }
          break;
        }
      }
      // [全系统自洽修复] 域E 联动增强: 投资组合首次突破¥10万→财务安全感健康加成（E→G）
      if (_pv >= 100000 && !state.flags._financialSecurityHealth) {
        state.flags._financialSecurityHealth = true;
        if (state.status) {
          state.status.health = Math.min(100, (state.status.health || 0) + 5);
          StateManager.addMessage("💪 投资组合突破¥10万，财务安全感让你身心舒畅。健康+5。", "success");
        }
      }
      // [全系统自洽修复] 域E R246 联动增强(E→C): 投资组合突破¥10万→职业信心加成
      if (_pv >= 100000 && !state.flags._investCareerConfidence) {
        state.flags._investCareerConfidence = true;
        StateManager.addMessage("💼 资产增值让你在职场上更有底气，敢于争取更好的机会和更高的薪资。", "info");
      }
      // [全系统自洽修复] 域E 联动增强(E→G): 投资组合突破¥50万→财务安全感健康加成
      if (_pv >= 500000 && !state.flags._financialSecurityHealth500k) {
        state.flags._financialSecurityHealth500k = true;
        if (state.status) {
          state.status.health = Math.min(100, (state.status.health || 0) + 3);
          StateManager.addMessage("💰 资产突破¥50万，财务自由不再是梦。内心的安定让你容光焕发。健康+3。", "success");
        }
      }
      // [全系统自洽修复] 域E R246 联动增强(E→D): 投资组合突破¥50万→社交圈感知
      if (_pv >= 500000 && !state.flags._investSocialPerception) {
        state.flags._investSocialPerception = true;
        StateManager.addMessage("🏘️ 你资产增值的消息在朋友圈里传开了，熟人看你的眼光似乎有了些变化。", "info");
        // 提升所有已结识NPC的好感
        if (state.relationships) {
          for (var _rni in state.relationships) {
            var _rr = state.relationships[_rni];
            if (_rr && _rr.met) {
              _rr.affinity = Math.min(100, (_rr.affinity || 0) + 3);
            }
          }
        }
      }
    }
  } catch (e) {
    // 静默：峰值追踪失败不影响主流程
  }

  // ================================================================
  // [全系统自洽修复] 域E 联动增强2: 投资回撤→经济焦虑（E→G）
  //  组合回撤>20%时触发疲劳+2 + 健康-1（压力应激）
  //  每日限触发一次，避免叠加速度过快
  // ================================================================
  try {
    var _peak = inv._portfolioPeak || 0;
    var _curPv = 0;
    var _sm2 = inv.stockMarket || {};
    var _h2 = inv.stockHoldings || [];
    for (var _hi2 = 0; _hi2 < _h2.length; _hi2++) {
      var _h2i = _h2[_hi2];
      var _m2 = _sm2[_h2i.symbol];
      if (_m2 && isFinite(_m2.price) && isFinite(_h2i.shares))
        _curPv += _m2.price * _h2i.shares;
    }
    var _p2 = inv.properties || [];
    for (var _pi2 = 0; _pi2 < _p2.length; _pi2++) {
      _curPv += _p2[_pi2].currentPrice || _p2[_pi2].buyPrice || 0;
    }
    if ((inv.btcHoldings || 0) > 0)
      _curPv += (inv.btcPrice || 0) * inv.btcHoldings;
    if (_peak > 0 && _curPv > 0) {
      var _dd = (_peak - _curPv) / _peak;
      if (_dd > 0.2 && state.needs) {
        if (!state.flags._econAnxietyDay || state.flags._econAnxietyDay < state.player.day) {
          state.flags._econAnxietyDay = state.player.day;
          state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 2);
          // [全系统自洽修复] 域E 修复:经济焦虑扣健康写死字段 state.needs.health(不存在)→真实 state.status.health,原每日焦虑健康惩罚静默丢失
          if (state.status)
            state.status.health = Math.max(0, (state.status.health || 100) - 1);
          if (_dd > 0.35) {
            // [全系统自洽修复] 域E 修复:经济焦虑扣心智写死字段 state.needs.mental(不存在)→真实 state.player.mental,原深度回撤心智惩罚静默丢失
            if (state.player)
              state.player.mental = Math.max(0, (state.player.mental || 50) - 3);
          }
        }
      }
    }
  } catch (e) {
    // 静默：经济焦虑不影响主流程
  }

  // [全系统自洽修复] 域E R246 联动增强(E→G): 组合创新高时心情提升
  try {
    var _peakH = inv._portfolioPeak || 0;
    var _curPH = 0;
    var _smH = inv.stockMarket || {};
    var _hH = inv.stockHoldings || [];
    for (var _hiH = 0; _hiH < _hH.length; _hiH++) {
      var _hH2 = _hH[_hiH];
      var _mH = _smH[_hH2.symbol];
      if (_mH && isFinite(_mH.price) && isFinite(_hH2.shares)) _curPH += _mH.price * _hH2.shares;
    }
    if (_curPH > _peakH && _peakH > 0 && state.needs) {
      var _gainPH = (_curPH - _peakH) / _peakH;
      if (_gainPH > 0.05 && (!state.flags._portfolioHighDay || state.flags._portfolioHighDay < state.player.day)) {
        state.flags._portfolioHighDay = state.player.day;
        state.needs.happiness = Math.min(100, (state.needs.happiness || 0) + 5);
        StateManager.addMessage("📈 投资组合创新高！盈利带来的成就感让你心情愉悦。", "success");
      }
    }
  } catch (e) {
    // 静默：组合新高不影响主流程
  }

  // ================================================================
  // [优化] 市场情绪计算 — 基于最近5日整体涨跌幅判定牛熊
  // ================================================================
  try {
    var _moodScores = 0, _moodCount = 0;
    for (var _mi = 0; _mi < INV_STOCKS.length; _mi++) {
      var _ms = INV_STOCKS[_mi];
      var _mm = inv.stockMarket[_ms.symbol];
      if (!_mm || !_mm.history || _mm.history.length < 3) continue;
      var _recent = _mm.history.slice(-3);
      var _start = _recent[0].price;
      var _end = _recent[_recent.length - 1].price;
      if (_start > 0) {
        _moodScores += (_end - _start) / _start;
        _moodCount++;
      }
    }
    if (_moodCount >= 5) {
      var _avgMood = _moodScores / _moodCount;
      if (_avgMood > 0.015) inv._marketMood = "bullish";
      else if (_avgMood < -0.015) inv._marketMood = "bearish";
      else inv._marketMood = "neutral";
    } else {
      inv._marketMood = "neutral";
    }
  } catch (e) {
    // 静默
  }

  // ================================================================
  // [全系统自洽修复] 域E 联动增强3: 市场情绪→NPC话题（E→D）
  //  牛熊市时高好感NPC会谈论市场，增加沉浸感
  //  每日最多一次，仅在有持仓且至少一位NPC好感≥40时触发
  // ================================================================
  try {
    var _mood = inv._marketMood;
    if (_mood && _mood !== "neutral" && inv.stockHoldings && inv.stockHoldings.length > 0) {
      if (!state.flags._npcMarketTalkDay || state.flags._npcMarketTalkDay < state.player.day) {
        var _talkedNpc = null;
        var _rels = state.relationships || {};
        for (var _rid in _rels) {
          if (_rels[_rid] && _rels[_rid].met && (_rels[_rid].affinity || 0) >= 40) {
            _talkedNpc = _rid;
            break;
          }
        }
        if (_talkedNpc) {
          state.flags._npcMarketTalkDay = state.player.day;
          var _npcName = "";
          if (typeof NPC_DATA !== "undefined" && NPC_DATA[_talkedNpc]) {
            _npcName = NPC_DATA[_talkedNpc].name || _talkedNpc;
          } else {
            _npcName = _talkedNpc;
          }
          var _talkMsg = _mood === "bullish"
            ? _npcName + "兴奋地说最近行情不错，问你要不要一起看看机会。"
            : _npcName + "叹气说最近市场不太好，让你投资多留个心眼。";
          StateManager.addMessage("💬 " + _talkMsg, "hint");
        }
      }
    }
  } catch (e) {
    // 静默：NPC话题不影响主流程
  }

  // ================================================================
  // 投资里程碑检查（仅在有持仓时触发，每日最多一次）
  // ================================================================
  if (inv.stockHoldings && inv.stockHoldings.length > 0) {
    try {
      for (var _mi = 0; _mi < inv.stockHoldings.length; _mi++) {
        var _mh = inv.stockHoldings[_mi];
        var _mm = inv.stockMarket && inv.stockMarket[_mh.symbol];
        if (_mm && _mm.history && _mm.history.length >= 2) {
          var _mLast = _mm.history[_mm.history.length - 1];
          var _mPrev = _mm.history[_mm.history.length - 2];
          if (_mPrev && _mPrev.price > 0) {
            var _mDrop = (_mLast.price - _mPrev.price) / _mPrev.price;
            if (_mDrop < -0.08 && typeof StateManager !== "undefined") {
              StateManager.addMessage("📉 " + _mh.symbol + "今日暴跌 " + Math.round(Math.abs(_mDrop) * 100) + "%！市场情绪恐慌，建议关注后续走势。", "warning");
            }
          }
        }
      }
    } catch (e) {}
    if (!state.flags._invMilestoneDay || state.flags._invMilestoneDay < state.player.day) {
      checkInvestmentMilestones(state, inv);
    }
  }

  // [R792 域E E→G 联动增强]: 每日盈亏心情微调
  try {
    if (state.needs && state.investment && state.investment.stockHoldings) {
      var _dailyPnl = 0;
      var _smDG = state.investment.stockMarket || {};
      for (var _hiDG = 0; _hiDG < state.investment.stockHoldings.length; _hiDG++) {
        var _hDG = state.investment.stockHoldings[_hiDG];
        var _mDG = _smDG[_hDG.symbol];
        if (_mDG && _mDG.history && _mDG.history.length >= 2) {
          var _lastDG = _mDG.history[_mDG.history.length - 1];
          var _prevDG = _mDG.history[_mDG.history.length - 2];
          if (_prevDG && _prevDG.price > 0 && _hDG.shares) {
            _dailyPnl += (_lastDG.price - _prevDG.price) * _hDG.shares;
          }
        }
      }
      if (_dailyPnl > 1000) {
        state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 1);
      } else if (_dailyPnl < -1000) {
        state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 1);
      }
    }
  } catch (e) {}

  // [R792 域E E→D 联动增强]: 投资高手社交标签
  try {
    if (state.investment && state.flags) {
      var _totalInv = 0;
      var _holdingInv = state.investment.stockHoldings || [];
      for (var _hiINV = 0; _hiINV < _holdingInv.length; _hiINV++) {
        var _hINV = _holdingInv[_hiINV];
        var _mINV = (state.investment.stockMarket || {})[_hINV.symbol];
        if (_mINV && _mINV.price && _hINV.shares) _totalInv += _mINV.price * _hINV.shares;
      }
      if (_totalInv >= 300000 && !state.flags._investorReputation) {
        state.flags._investorReputation = true;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage("🏆 你的投资眼光在朋友圈里传开了，熟人开始叫你「投资高手」。社交圈对你的看法发生了微妙的变化。", "success");
        }
      }
    }
  } catch (e) {}
}

function checkInvestmentMilestones(state, inv) {
  if (!state.flags) state.flags = {};
  // 计算总持仓市值
  var totalValue = 0;
  var holdings = inv.stockHoldings || [];
  for (var hi = 0; hi < holdings.length; hi++) {
    var h = holdings[hi];
    var m = inv.stockMarket && inv.stockMarket[h.symbol];
    if (m) totalValue += m.price * h.shares;
  }
  // 含房产
  var props = inv.properties || [];
  for (var pi = 0; pi < props.length; pi++) {
    totalValue += props[pi].currentPrice || props[pi].buyPrice || 0;
  }
  // 含 BTC
  if (inv.btcHoldings && inv.btcHoldings > 0) {
    var btcPrice = inv.btcPrice || 0;
    totalValue += btcPrice * inv.btcHoldings;
  }

  // [全系统自洽修复] 域E 联动增强: 投资实践→会计/管理技能XP（E→C 经济-职业联动）
  if (totalValue >= 50000 && !state.flags._invSkillXpToday && state.skills) {
    state.flags._invSkillXpToday = true;
    if (typeof addSkillXp === "function") {
      addSkillXp("accounting", 3); // 投资实践→会计经验
      if (totalValue >= 200000) addSkillXp("management", 2); // 大额投资→管理经验
    }
  }

  var prevMilestone = state.flags._invLastMilestone || 0;
  var milestone = null;
  if (totalValue >= 1000000 && prevMilestone < 1000000) {
    milestone = { level: 1000000, label: "百万持仓", icon: "👑" };
  } else if (totalValue >= 500000 && prevMilestone < 500000) {
    milestone = { level: 500000, label: "半百万持仓", icon: "💎" };
  } else if (totalValue >= 100000 && prevMilestone < 100000) {
    milestone = { level: 100000, label: "六位数持仓", icon: "💰" };
  } else if (totalValue >= 10000 && prevMilestone < 10000) {
    milestone = { level: 10000, label: "万元持仓", icon: "🪙" };
  } else if (totalValue >= 1000 && prevMilestone < 1000) {
    // [全系统自洽修复] 域E 修复:新增¥1000起步档，早期投资成就感
    milestone = { level: 1000, label: "千元持仓", icon: "🌱" };
  }

  if (milestone) {
    state.flags._invLastMilestone = milestone.level;
    state.flags._invMilestoneDay = state.player.day;
    StateManager.addMessage(
      milestone.icon +
        " 投资里程碑：持仓市值突破 ¥" +
        milestone.level.toLocaleString() +
        "！" +
        (milestone.level >= 1000000
          ? " 你已经是这座城市真正的投资者了。"
          : milestone.level >= 500000
            ? " 距离财务自由又近了一步。"
            : milestone.level >= 100000
              ? " 投资初见成效，继续保持。"
              : milestone.level >= 10000
                ? " 好的开始是成功的一半。"
                : " 投资的第一步，永远是最难的。"),
      "success",
    );

    // [全系统自洽修复] 域E R679 联动增强(E→G): 投资里程碑→心情提振
    if (state.needs) {
      state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 3);
    }
  }

    // [全系统自洽修复] 域E R679 联动增强(E→D): 投资成功→社交圈正面影响(≥¥100k时)
    if (state.relationships && milestone.level >= 100000) {
      var _wpNpcs = ["boss_li", "xiao_mei", "zhaojie", "old_zhou"];
      for (var _wi = 0; _wi < _wpNpcs.length; _wi++) {
        var _npc = state.relationships[_wpNpcs[_wi]];
        if (_npc && _npc.met && typeof applyAffinityChange === "function") {
          applyAffinityChange(state, _wpNpcs[_wi], 2, "投资成功影响");
        }
      }
    }
    // [R817 域E E→F 联动增强]: 投资组合多元化评分
    if (state.flags) {
      state.flags._portfolioDiversity = (holdings.length > 0 ? 1 : 0) + (props.length > 0 ? 1 : 0) + (inv.btcHoldings > 0 ? 1 : 0);
      state.flags._portfolioTotalValue = totalValue;
    }
    // [R817 域E E→G 联动增强]: 持续盈利健康加成
    if (totalValue >= 100000 && state.status && state.flags && !state.flags._investHealthBonus) {
      state.flags._investHealthBonus = true;
      state.status.health = Math.min(100, (state.status.health || 100) + 3);
    }
    // [R822 域E E→B 联动增强]: 投资里程碑叙事
    if (milestone && milestone.level >= 100000 && state.flags && !state.flags._investMilestoneNarrative) {
      state.flags._investMilestoneNarrative = true;
    }
    // [R822 域E E→F 联动增强]: 投资组合风险评级
    if (state.flags) {
      var _diversity = (holdings.length > 0 ? 1 : 0) + (props.length > 0 ? 1 : 0) + (inv.btcHoldings > 0 ? 1 : 0);
      var _riskRating = _diversity >= 3 ? 'low' : (_diversity >= 2 ? 'medium' : 'high');
      state.flags._portfolioRiskRating = _riskRating;
    }

    // [R798 域E E→G 联动增强]: 投资组合价值超过阈值提供健康加成
    try {
      if (state.flags && state.status) {
        if (totalValue >= 500000 && !state.flags._investHealthBonus500k) {
          state.flags._investHealthBonus500k = true;
          state.status.health = Math.min(100, (state.status.health || 100) + 3);
          if (typeof StateManager !== "undefined") {
            StateManager.addMessage("💚 财务自由带来的安全感让你的身心健康都得到了提升。健康+3。", "success");
          }
        }
      }
    } catch (e) { /* 静默 */ }

    // [R798 域E E→D 联动增强]: 投资盈利触发NPC社交圈反应
    try {
      if (state.flags && state.relationships && state.player) {
        var _totalInvProfit = inv._totalInvestmentProfit || 0;
        if (_totalInvProfit >= 10000 && !state.flags._investSocialPerception10k) {
          state.flags._investSocialPerception10k = true;
          if (typeof StateManager !== "undefined") {
            StateManager.addMessage("💬 你的投资眼光在朋友圈里传开了，熟人开始向你请教理财建议。", "info");
          }
        }
      }
    } catch (e) { /* 静默 */ }
  }

function buyInvStock(symbol, shares) {
  const state = StateManager.getState();
  if (!state.flags) state.flags = {};
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

  var inv = state.investment;
  // [全系统自洽修复] 域E A类#3: inv/stockMarket 守卫
  if (!inv || !inv.stockMarket) {
    StateManager.addMessage("⚠️ 投资系统未初始化。", "warning");
    return false;
  }
  var m = inv.stockMarket[symbol];
  if (!m) return;
  if (shares <= 0) {
    StateManager.addMessage("⚠️ 至少买入1个单位。", "warning");
    return;
  }
  var cost = Math.round(m.price * shares * 100) / 100;
  if (isNaN(cost) || !isFinite(cost)) {
    StateManager.addMessage("⚠️ 价格异常，买入取消", "danger");
    return;
  }
  if ((state.resources.cash || 0) < cost) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash = Math.max(0, (state.resources.cash || 0) - cost);
  // [全系统自洽修复] 域E 修复:sellInvStock 有 stockHoldings 守卫而 buyInvStock 缺——旧存档缺该数组时买股即 TypeError。
  if (!Array.isArray(inv.stockHoldings)) inv.stockHoldings = [];
  var h = inv.stockHoldings.find(function (s) {
    return s.symbol === symbol;
  });
  if (h) {
    var total = h.shares + shares;
    // [全系统自洽修复] 域E A类#1: avgPrice可能NaN（旧存档/数据异常），防御兜底
    var _oldAvg = (typeof h.avgPrice === "number" && isFinite(h.avgPrice)) ? h.avgPrice : 0;
    h.avgPrice =
      Math.round(((_oldAvg * h.shares + cost) / total) * 100) / 100;
    h.shares = total;
  } else
    inv.stockHoldings.push({
      symbol: symbol,
      shares: shares,
      avgPrice: m.price,
    });
  // 记录成交
  if (!Array.isArray(inv.tradeLog)) inv.tradeLog = [];
  inv.tradeLog.push({
    day: state.player.day,
    symbol: symbol,
    type: "buy",
    price: m.price,
    quantity: shares,
    total: cost,
    unitLabel: def?.unit || "股",
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

  // 首次买入股票里程碑
  if (isStockCat && !state.flags._firstStockBought) {
    state.flags._firstStockBought = true;
    state.flags._firstStockDay = state.player.day;
    StateManager.addMessage(
      "📈 第一次买入股票！你正式踏入了投资理财的大门。",
      "event",
    );
  }

  // [域E R428 联动增强] E→D: 大额买入(≥¥5000)时高好感NPC有概率认可投资眼光
  if (cost >= 5000 && state.relationships) {
    var _invNpcs = [];
    for (var _inid in state.relationships) {
      var _inr = state.relationships[_inid];
      if (_inr && _inr.met && (_inr.affinity || 0) >= 50) _invNpcs.push(_inid);
    }
    if (_invNpcs.length > 0 && Random.chance(0.2)) {
      var _inpc = _invNpcs[Random.int(0, _invNpcs.length - 1)];
      StateManager.addMessage("💬 你投资的消息在朋友圈里传开了，有人觉得你越来越有眼光。", "info");
    }
  }
}

function sellInvStock(symbol, shares) {
  const state = StateManager.getState();
  if (!state.flags) state.flags = {};
  // 根据资产类别区分交易规则
  // 股票（A股）：最小交易单位1股，强制整股
  // 虚拟币/贵金属/期货/基金：支持小数交易
  var def = INV_STOCKS.find(function (s) {
    return s.symbol === symbol;
  });
  if (def && def.category === "股票") {
    shares = Math.floor(shares);
  }

    var inv = state.investation;
  var inv = state.investment;
  // [全系统自洽修复] 域E A类#4: inv/stockHoldings 守卫
  if (!inv || !inv.stockHoldings) {
    StateManager.addMessage("⚠️ 投资系统未初始化。", "warning");
    return false;
  }
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
  // [全系统自洽修复] 域E A类#1: m 可能为空（旧存档/市场数据重置），防御性兜底
  if (!m || !isFinite(m.price)) {
    StateManager.addMessage("⚠️ 该标的市场数据异常，无法卖出", "danger");
    return;
  }
  var revenue = Math.round(m.price * shares * 100) / 100;
  if (isNaN(revenue) || !isFinite(revenue)) {
    StateManager.addMessage("⚠️ 价格异常，卖出取消", "danger");
    return;
  }
  // 连续盈利计数（供 dailyEconomicSettlement 的 getConsecutiveWinDecay 使用）
  // [全系统自洽修复] 域E A类#2: avgPrice 或 m.price 可能 NaN，阻断 pl 传播
  var _sellPrice = isFinite(m.price) ? m.price : 0;
  var _avgPx = (typeof h.avgPrice === "number" && isFinite(h.avgPrice)) ? h.avgPrice : 0;
  var pl = (_sellPrice - _avgPx) * shares;
  if (!isFinite(pl)) pl = 0;
  if (pl > 0) {
    inv._consecutiveWins = (inv._consecutiveWins || 0) + 1;
    // [全系统自洽修复] 域E A类#1: 应用连续盈利衰减（第4次后每次-8%利润）
    var _winDecay = 1.0;
    if (typeof window.EconomySystem !== "undefined" && window.EconomySystem.getConsecutiveWinDecay) {
      _winDecay = window.EconomySystem.getConsecutiveWinDecay(inv._consecutiveWins);
    }
    if (_winDecay < 1.0) {
      var _decayAmount = Math.round(pl * (1 - _winDecay));
      revenue = Math.max(0, revenue - _decayAmount);
      pl = pl - _decayAmount;
    }
    // [全系统自洽修复] 域E 联动增强1: 投资盈利→小幅心情+1（财务安全感）
    if (state.needs) state.needs.happiness = Math.min(100, (state.needs.happiness || 0) + 1);
    // [全系统自洽修复] 域E 联动增强4: E→C 盈利交易→销售经验+5
    if (state.skills && state.skills.sales && typeof state.skills.sales.xp === "number") {
      state.skills.sales.xp += 5;
    }
    // [域E R428 联动增强] E→H: 投资盈利→公司士气提振 — 老板赚钱团队信心+1
    if (state.corporate && state.corporate.company && state.corporate.company.employees) {
      for (var _eei = 0; _eei < state.corporate.company.employees.length; _eei++) {
        var _eem = state.corporate.company.employees[_eei];
        if (_eem && typeof _eem.loyalty === "number") {
          _eem.loyalty = Math.min(100, _eem.loyalty + 0.5);
        }
      }
    }
  } else {
    inv._consecutiveWins = 0;
    // [全系统自洽修复] 域E 联动增强2: 投资亏损叙事（E→B）— 亏损情感回响
    if (pl < 0 && state.needs) {
      state.needs.happiness = Math.max(0, (state.needs.happiness || 0) - 1);
      // [全系统自洽修复] 域E 联动增强1: 亏损较大时引发焦虑→疲劳+（E→G）
      if (Math.abs(pl) > 500) state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 2);
      if (!state.flags._invLossNarrativeDay || state.flags._invLossNarrativeDay < state.player.day) {
        state.flags._invLossNarrativeDay = state.player.day;
        StateManager.addMessage("📉 投资亏损让心情有些低落。投资有风险，入市需谨慎。", "warning");
        // [全系统自洽修复] 域E 联动增强: E→D 亏损时NPC安慰 — 好感≥30的NPC有概率安慰
        if (state.relationships && Math.abs(pl) > 300) {
          var _lossNpcs = [];
          for (var _lid in state.relationships) {
            var _lr = state.relationships[_lid];
            if (_lr && _lr.met && (_lr.affinity || 0) >= 30) _lossNpcs.push(_lid);
          }
          if (_lossNpcs.length > 0 && Random.chance(0.3)) {
            var _lnpc = _lossNpcs[Random.int(0, _lossNpcs.length - 1)];
            var _lname = _lnpc;
            if (typeof NPCS !== "undefined") {
              var _ldef = NPCS.find(function(nn) { return nn.id === _lnpc; });
              if (_ldef) _lname = _ldef.name;
            }
            StateManager.addMessage("💬 " + _lname + "注意到你的郁闷，拍了拍你的肩膀：「投资有赚有赔，别太往心里去。」", "info");
            applyAffinityChange(state, _lnpc, 1, "亏损安慰");
          }
        }
      }
    }
  }
  // [全系统自洽修复] 域E 修复:_totalInvestmentProfit 此前只被 R167/R96 联动事件读取、全代码从未写入
  //   → 那些事件的盈亏门槛(profit≤-5000 / ≥20000 / ≥10000)永不满足=死事件。
  //   此处累计已实现损益(pl 已含连续盈利衰减)，复活这些跨域叙事。
  inv._totalInvestmentProfit = (inv._totalInvestmentProfit || 0) + pl;
  state.resources.cash = (state.resources.cash || 0) + revenue;
  h.shares -= shares;
  if (h.shares <= 0)
    inv.stockHoldings = inv.stockHoldings.filter(function (s) {
      return s.symbol !== symbol;
    });
  // 记录卖出成交
  if (!Array.isArray(inv.tradeLog)) inv.tradeLog = [];
  inv.tradeLog.push({
    day: state.player.day,
    symbol: symbol,
    type: "sell",
    price: m.price,
    quantity: shares,
    total: revenue,
    pl: pl,
    unitLabel: def?.unit || "股",
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
    var inv = state.investation;
  var inv = state.investment;
  // [全系统自洽修复] 域E 修复:buyBtc 与 sellBtc/buyInvStock 存在不对称守卫缺口——
  //   ① 缺 `if(!inv)return`：旧存档 state.investment 未初始化时 `inv.btcPrice` 直接抛 TypeError 使买币崩溃(兄弟函数均已守卫)；
  //   ② 缺 amount 有效性校验：传入负数/NaN 时 cost 为负→`cash<cost` 恒假→`cash-=负数` 凭空增币并写入错误持仓(可利用经济漏洞)。
  if (!inv) return;
  if (typeof amount !== "number" || !isFinite(amount) || amount <= 0) {
    StateManager.addMessage("⚠️ 买入数量无效。", "warning");
    return;
  }
  if (typeof inv.btcPrice !== "number" || !isFinite(inv.btcPrice) || inv.btcPrice <= 0) {
    StateManager.addMessage("⚠️ 比特币行情异常，买入取消", "danger");
    return;
  }
  var cost = Math.round(inv.btcPrice * amount * 100) / 100;
  if (isNaN(cost) || !isFinite(cost)) {
    StateManager.addMessage("⚠️ 价格异常，买入取消", "danger");
    return;
  }
  if ((state.resources.cash || 0) < cost) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  // [全系统自洽修复] 域E A类#2: buyBtc cash守卫修复
  state.resources.cash = Math.max(0, (state.resources.cash || 0) - cost);
  // 追踪加权平均成本
  var oldTotal = (inv.btcAvgCost || 0) * (inv.btcHoldings || 0);
  var newTotal = oldTotal + cost;
  inv.btcHoldings =
    Math.round(((inv.btcHoldings || 0) + amount) * 10000) / 10000;
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
    var inv = state.investation;
  var inv = state.investment;
  // [全系统自洽修复] 域E 修复:buyBtc 有 isNaN(cost) 守卫而 sellBtc 缺——
  //   btcPrice/btcHoldings 为 undefined(旧存档) 时 `undefined < amount` 为 false 不拦截，
  //   继而 revenue=NaN 加进现金 → state.resources.cash 变 NaN，整套经济结算静默报废。
  if (!inv) return;
  if (typeof inv.btcPrice !== "number" || !isFinite(inv.btcPrice) || inv.btcPrice <= 0) {
    StateManager.addMessage("⚠️ 比特币行情异常，卖出取消", "danger");
    return;
  }
  if (typeof inv.btcHoldings !== "number" || !isFinite(inv.btcHoldings) || inv.btcHoldings < amount) {
    StateManager.addMessage("持仓不足", "danger");
    return;
  }
  var curPrice = inv.btcPrice;
  var revenue = Math.round(curPrice * amount * 100) / 100;
  if (isNaN(revenue) || !isFinite(revenue)) {
    StateManager.addMessage("⚠️ 价格异常，卖出取消", "danger");
    return;
  }
  var avgCost = inv.btcAvgCost || 0;
  var pl = avgCost > 0 ? Math.round((curPrice - avgCost) * amount) : 0;
  var plStr = pl !== 0 ? (pl > 0 ? " 📈+" : " 📉") + pl : "";
  // [全系统自洽修复] 域E 修复:同 sellInvStock，累计 BTC 已实现损益到 _totalInvestmentProfit，复活死事件。
  if (isFinite(pl)) inv._totalInvestmentProfit = (inv._totalInvestmentProfit || 0) + pl;
  // 连续盈利计数（供 getConsecutiveWinDecay 使用）
  if (pl > 0) {
    inv._consecutiveWins = (inv._consecutiveWins || 0) + 1;
  } else {
    inv._consecutiveWins = 0;
  }
  state.resources.cash = (state.resources.cash || 0) + revenue;
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
    var inv = state.investation;
  var inv = state.investment;
  var prop = PROPERTIES.find(function (p) {
    return p.id === propId;
  });
  if (!prop) return;

  // 消费点：城市服务·公积金查询激活 _housingFundAvailable → 公积金贷款利率优惠（5% 抵扣，代表公积金贷款相对商贷的利息节省）
  var housingFundDiscount = 0;
  if (state.flags && state.flags._housingFundAvailable) {
    housingFundDiscount = Math.round(prop.price * 0.05);
  }
  var payPrice = prop.price - housingFundDiscount;

  if ((state.resources.cash || 0) < payPrice) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash = Math.max(0, (state.resources.cash || 0) - payPrice);
  // [全系统自洽修复] 域E 修复:写入路径缺 properties 守卫（读取路径均 `|| []`）——旧存档买房即 TypeError。
  if (!Array.isArray(inv.properties)) inv.properties = [];
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
  var msg = "购入" + prop.name;
  if (housingFundDiscount > 0) {
    msg +=
      "（💰 公积金贷款利率优惠抵扣¥" +
      housingFundDiscount.toLocaleString() +
      "）";
  }
  StateManager.addMessage(msg, "success");
}

function sellProperty(propId) {
    var inv = state.investation;
  var inv = state.investment;
  // [全系统自洽修复] 域E 修复:旧存档缺 properties 时读 .length 抛 TypeError。
  if (!inv || !Array.isArray(inv.properties)) return;
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
    // [全系统自洽修复] 域E 修复:裸写 state.housing/state.inventory，缺失时 TypeError。
    if (typeof HOUSING_TIERS !== "undefined" && state.housing && state.inventory) {
      state.housing.tier = 1;
      state.inventory.capacity =
        (HOUSING_TIERS[1] ? HOUSING_TIERS[1].capacity : 50) +
        (state.housing.storageCapacity || 0);
    }
    StateManager.addMessage("🏠 你卖掉了自住房，搬回合租床位。", "warning");
  }

  // NaN 防御：旧存档或未初始化时 currentPrice 可能缺失
  if (prop.currentPrice == null || !isFinite(prop.currentPrice))
    prop.currentPrice = prop.buyPrice || 0;
  // [全系统自洽修复] 域E A类#4: net 可能 NaN（currentPrice 异常），兜底
  var fee = Math.round(prop.currentPrice * 0.02);
  if (!isFinite(fee)) fee = 0;
  var net = prop.currentPrice - fee;
  if (!isFinite(net)) net = 0;
  // [全系统自洽修复] 域E A类修复: 卖房从未将 net 加到玩家现金中！splice 后即丢失，玩家永远拿不到卖房款
  state.resources.cash = (isFinite(state.resources.cash) ? state.resources.cash : 0) + net;
  inv.properties.splice(idx, 1);
  StateManager.addMessage(
    "出售" + prop.name + " 到手¥" + net.toLocaleString(),
    "success",
  );
}

function buyCar(carId) {
    var inv = state.investation;
  var inv = state.investment;
  var car = CAR_TYPES.find(function (c) {
    return c.id === carId;
  });
  if (!car) return;
  if ((state.resources.cash || 0) < (car.price || 0)) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash = Math.max(0, (state.resources.cash || 0) - (car.price || 0));
  // [全系统自洽修复] 域E 修复:写入路径缺 cars 守卫（tick 读取用 `|| []`）——旧存档买车即 TypeError。
  if (!Array.isArray(inv.cars)) inv.cars = [];
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
    (state.player.actionPoints || 0) + car.travelBonus, // [全系统自洽修复] 域E A类#1: actionPoints可能undefined→NaN传播
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
function escapeInvestmentHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getInvestmentNewsTags(news) {
  var invEffs = (news && news.effects && news.effects.investmentEffect) || [];
  var tags = [];

  for (var i = 0; i < invEffs.length; i++) {
    var e = invEffs[i];
    if (e.allStocks) {
      tags.push("全市场");
      break;
    }
    if (e.btc && tags.indexOf("BTC") < 0) tags.push("BTC");
    if (e.industry && tags.indexOf(e.industry) < 0) tags.push(e.industry);
    if (e.category && tags.indexOf(e.category) < 0) tags.push(e.category);
    if (e.symbols) {
      for (var si = 0; si < e.symbols.length; si++) {
        var sym = e.symbols[si];
        if (tags.indexOf(sym) < 0 && sym.length <= 6) tags.push(sym);
      }
    }
  }

  return tags.slice(0, 4);
}

function renderNewsInvestmentDrivers(state) {
  var drivers =
    typeof getNewsInvestmentSummary === "function"
      ? getNewsInvestmentSummary(state)
      : [];
  var activeNews = state.activeNews || [];

  // 智力门控：根据intelligence和finance技能决定信息披露深度
  var intel = (state.player && state.player.intelligence) || 0;
  // [全系统自洽修复] 域E R246 A类: state.skills.finance 不存在(真实技能为accounting)→投资分析深度门控恒为0,高深度分析永不可达
  var financeSkill =
    (state.skills && state.skills.accounting && state.skills.accounting.level) || 0;
  // depth 0=只看趋势方向  1=看板块涨跌%  2=看具体标的+量化数据
  var infoDepth =
    intel >= 50 || financeSkill >= 20
      ? 2
      : intel >= 30 || financeSkill >= 8
        ? 1
        : 0;

  drivers.sort(function (a, b) {
    return b.strength - a.strength;
  });

  var html =
    '<div style="margin-bottom:8px;padding:10px 12px;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.07);border-radius:6px;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;">' +
    '<strong style="font-size:12px;color:var(--accent);">📊 今日市场驱动</strong>';

  // 门控提示：信息深度不足时显示解锁提示
  if (infoDepth === 0) {
    html +=
      '<span style="font-size:9px;color:var(--text-muted);">智力≥30或金融技能≥8可解锁更多细节</span>';
  } else if (infoDepth === 1) {
    html +=
      '<span style="font-size:9px;color:var(--text-muted);">智力≥50或金融技能≥20可解锁标的代码</span>';
  } else {
    html +=
      '<span style="font-size:10px;color:var(--text-muted);">新闻会影响相关资产的每日价格波动</span>';
  }
  html += "</div>";

  if (drivers.length === 0) {
    return (
      html +
      '<div style="font-size:11px;color:var(--text-muted);padding:4px 0;">今日暂无明显新闻冲击，市场主要按基础趋势和随机波动运行。</div>' +
      "</div>"
    );
  }

  for (var i = 0; i < Math.min(drivers.length, 4); i++) {
    var d = drivers[i];
    var relatedNews = null;
    for (var ni = 0; ni < activeNews.length; ni++) {
      if (activeNews[ni].headline === d.headline) {
        relatedNews = activeNews[ni];
        break;
      }
    }

    var tags = infoDepth >= 2 ? getInvestmentNewsTags(relatedNews) : [];
    var change = Math.round(((d.avgMul || 1) - 1) * 100);
    var color =
      change > 0
        ? "var(--danger)"
        : change < 0
          ? "var(--success)"
          : "var(--accent)";

    // depth=0: 只显示方向文字；depth=1: 加板块%；depth=2: 加具体标的代码
    var changeText =
      infoDepth >= 1
        ? (change > 0 ? "+" : "") + change + "%"
        : change > 0
          ? "📈利好"
          : change < 0
            ? "📉利空"
            : "稳定";

    // 标题：不截断，改为横向滚动容器
    html +=
      '<div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-top:1px solid rgba(255,255,255,0.04);font-size:11px;">' +
      '<span style="width:20px;text-align:center;flex-shrink:0;">' +
      d.direction +
      "</span>" +
      '<div style="flex:1;min-width:0;overflow-x:auto;white-space:nowrap;scrollbar-width:none;-ms-overflow-style:none;" class="inv-news-scroll">' +
      '<span style="color:var(--text-primary);">' +
      escapeInvestmentHtml(d.headline || "") +
      "</span>" +
      (infoDepth >= 2 && tags.length
        ? ' <span style="font-size:9px;color:var(--text-muted);">[' +
          escapeInvestmentHtml(tags.slice(0, 4).join("·")) +
          "]</span>"
        : "") +
      "</div>" +
      '<strong style="min-width:44px;text-align:right;color:' +
      color +
      ';flex-shrink:0;">' +
      changeText +
      "</strong>" +
      "</div>";
  }

  return html + "</div>";
}

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
      '<div style="font-size:10px;color:var(--text-light);padding:1px 0;overflow-x:auto;white-space:nowrap;scrollbar-width:none;-ms-overflow-style:none;" class="inv-news-scroll">';
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
      // 支持内联 followUpData（约定式）和旧式 NEWS_FOLLOWUP 查找
      var fu =
        pitem.followUpData && pitem.followUpData.headline
          ? pitem.followUpData
          : fuRef[pitem.id];
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

function getInvestmentAssetDef(symbol) {
  for (var i = 0; i < INV_STOCKS.length; i++) {
    if (INV_STOCKS[i].symbol === symbol) return INV_STOCKS[i];
  }
  return null;
}

function getInvestmentAssetGroup(symbol) {
  var def = getInvestmentAssetDef(symbol);
  if (!def) return "other";
  if (def.category === "股票") return "stocks";
  if (def.category === "虚拟币") return "crypto";
  if (def.category === "贵金属") return "precious";
  if (def.category === "期货" || def.category === "基金") return "futures";
  return "other";
}

function getInvestmentGroupLabel(key) {
  var labels = {
    stocks: "股票",
    crypto: "虚拟币",
    precious: "贵金属",
    futures: "期货基金",
    properties: "房产",
    cars: "汽车",
  };
  return labels[key] || key;
}

function createInvestmentGroupSummary(key) {
  return {
    key: key,
    label: getInvestmentGroupLabel(key),
    value: 0,
    cost: 0,
    pl: 0,
    count: 0,
    rows: [],
  };
}

function addInvestmentRowToGroup(group, row) {
  group.rows.push(row);
  group.count += 1;
  group.value += row.value || 0;
  group.cost += row.cost || 0;
  group.pl += row.pl || 0;
}

function formatInvestmentQuantity(qty, unit, decimals) {
  var n = Number(qty) || 0;
  var digits = decimals == null ? (Math.abs(n) < 1 ? 4 : 2) : decimals;
  var text = n.toFixed(digits);
  text = text.replace(/\.?0+$/g, "");
  if (text === "") text = "0";
  return text + (unit ? unit : "");
}

function getInvestmentAssetSnapshot(state) {
  var inv = (state && state.investment) || {};
  var groups = {
    stocks: createInvestmentGroupSummary("stocks"),
    crypto: createInvestmentGroupSummary("crypto"),
    precious: createInvestmentGroupSummary("precious"),
    futures: createInvestmentGroupSummary("futures"),
    properties: createInvestmentGroupSummary("properties"),
    cars: createInvestmentGroupSummary("cars"),
  };

  var holdings = inv.stockHoldings || [];
  for (var i = 0; i < holdings.length; i++) {
    var h = holdings[i];
    var def = getInvestmentAssetDef(h.symbol);
    var groupKey = getInvestmentAssetGroup(h.symbol);
    if (!groups[groupKey]) continue;
    var market = inv.stockMarket && inv.stockMarket[h.symbol];
    var price = market ? market.price : h.avgPrice || 0;
    var qty = Number(h.shares) || 0;
    var value = price * qty;
    var cost = (h.avgPrice || price) * qty;
    var pl = value - cost;
    var unit =
      def && def.category === "股票" ? "股" : def && def.unit ? def.unit : "";
    addInvestmentRowToGroup(groups[groupKey], {
      symbol: h.symbol,
      name: def ? def.name : h.symbol,
      category: def ? def.category : "",
      unit: unit,
      quantity: qty,
      quantityText: formatInvestmentQuantity(
        qty,
        unit,
        def && def.category === "股票" ? 0 : 4,
      ),
      avgPrice: h.avgPrice || 0,
      price: price,
      value: value,
      cost: cost,
      pl: pl,
      plPct: cost > 0 ? (pl / cost) * 100 : 0,
    });
  }

  // 兼容旧存档或旧事件直接写入的 BTC 持仓。
  // 同时持有 legacy + unified BTC 时合并显示，避免数据丢失 see [v3.99e A3]
  if (inv.btcHoldings && inv.btcHoldings > 0) {
    var unifiedBtcRow = null;
    for (var b = 0; b < holdings.length; b++) {
      if (holdings[b].symbol === "BTC") {
        unifiedBtcRow = holdings[b];
        break;
      }
    }
    if (unifiedBtcRow) {
      // 合并 legacy BTC 到 unified 行
      var btcPrice =
        (inv.stockMarket && inv.stockMarket.BTC && inv.stockMarket.BTC.price) ||
        inv.btcPrice ||
        0;
      var legacyQty = Number(inv.btcHoldings) || 0;
      var legacyCost = (inv.btcAvgCost || 0) * legacyQty;
      var unifiedValue = (unifiedBtcRow.avgPrice || 0) * unifiedBtcRow.shares;
      var mergedShares = unifiedBtcRow.shares + legacyQty;
      var mergedCost = unifiedValue + legacyCost;
      var mergedAvgPrice = mergedShares > 0 ? mergedCost / mergedShares : 0;
      var mergedValue = btcPrice * mergedShares;
      addInvestmentRowToGroup(groups.crypto, {
        symbol: "BTC",
        name: "比特币(含旧版)",
        category: "虚拟币",
        unit: "个",
        quantity: mergedShares,
        quantityText: formatInvestmentQuantity(mergedShares, "个", 4),
        avgPrice: mergedAvgPrice,
        price: btcPrice,
        value: mergedValue,
        cost: mergedCost,
        pl: mergedValue - mergedCost,
        plPct:
          mergedCost > 0 ? ((mergedValue - mergedCost) / mergedCost) * 100 : 0,
      });
    } else {
      var btcPrice =
        (inv.stockMarket && inv.stockMarket.BTC && inv.stockMarket.BTC.price) ||
        inv.btcPrice ||
        inv.btcAvgCost ||
        0;
      var btcQty = Number(inv.btcHoldings) || 0;
      var btcCost = (inv.btcAvgCost || btcPrice) * btcQty;
      var btcValue = btcPrice * btcQty;
      addInvestmentRowToGroup(groups.crypto, {
        symbol: "BTC",
        name: "比特币",
        category: "虚拟币",
        unit: "个",
        quantity: btcQty,
        quantityText: formatInvestmentQuantity(btcQty, "个", 4),
        avgPrice: inv.btcAvgCost || btcPrice,
        price: btcPrice,
        value: btcValue,
        cost: btcCost,
        pl: btcValue - btcCost,
        plPct: btcCost > 0 ? ((btcValue - btcCost) / btcCost) * 100 : 0,
      });
    }
  }

  var props = inv.properties || [];
  for (var p = 0; p < props.length; p++) {
    var prop = props[p];
    var propValue = prop.currentPrice || prop.buyPrice || 0;
    var propCost = prop.buyPrice || propValue;
    addInvestmentRowToGroup(groups.properties, {
      symbol: prop.id,
      name: prop.name || prop.id,
      category: prop.type || "房产",
      unit: "套",
      quantity: 1,
      quantityText: "1套",
      avgPrice: propCost,
      price: propValue,
      value: propValue,
      cost: propCost,
      pl: propValue - propCost,
      plPct: propCost > 0 ? ((propValue - propCost) / propCost) * 100 : 0,
    });
  }

  var cars = inv.cars || [];
  for (var c = 0; c < cars.length; c++) {
    var car = cars[c];
    var carValue = car.currentPrice || car.buyPrice || 0;
    var carCost = car.buyPrice || carValue;
    addInvestmentRowToGroup(groups.cars, {
      symbol: car.id,
      name: car.name || car.id,
      category: "汽车",
      unit: "辆",
      quantity: 1,
      quantityText: "1辆",
      avgPrice: carCost,
      price: carValue,
      value: carValue,
      cost: carCost,
      pl: carValue - carCost,
      plPct: carCost > 0 ? ((carValue - carCost) / carCost) * 100 : 0,
    });
  }

  var investmentValue = 0;
  var investmentCost = 0;
  var keys = Object.keys(groups);
  for (var gi = 0; gi < keys.length; gi++) {
    var g = groups[keys[gi]];
    investmentValue += g.value;
    investmentCost += g.cost;
    g.pl = g.value - g.cost;
  }

  var cash = (state && state.resources && state.resources.cash) || 0;
  var bank = (state && state.resources && state.resources.bankBalance) || 0;
  return {
    groups: groups,
    cash: cash,
    bank: bank,
    investmentValue: investmentValue,
    investmentCost: investmentCost,
    investmentPL: investmentValue - investmentCost,
    totalAssets: cash + bank + investmentValue,
  };
}

function renderInvestmentHoldingPanel(area, inv, groupKeys, title, color) {
  var snapshot = getInvestmentAssetSnapshot(StateManager.getState());
  var rows = [];
  var totalValue = 0;
  var totalPL = 0;
  // 从 groupKeys 推断 tab 名称
  var _tabMap = { stocks: "stocks", crypto: "crypto", precious: "precious", futures: "futures", properties: "re", cars: "car" };
  var _tabName = groupKeys.length > 0 ? (_tabMap[groupKeys[0]] || groupKeys[0]) : "";
  for (var i = 0; i < groupKeys.length; i++) {
    var group = snapshot.groups[groupKeys[i]];
    if (!group) continue;
    rows = rows.concat(group.rows);
    totalValue += group.value;
    totalPL += group.pl;
  }
  if (rows.length === 0) return;

  var panel = document.createElement("div");
  panel.className = "investment-holding-panel";
  panel.style.cssText =
    "margin-bottom:12px;padding:12px;background:rgba(255,255,255,0.04);border:1px solid " +
    color +
    ";border-radius:8px;overflow-x:auto;";

  var totalClr = totalPL >= 0 ? "var(--danger)" : "var(--success)";
  var totalSign = totalPL >= 0 ? "+" : "";
  var rowsHtml = rows
    .map(function (row) {
      var plClr = row.pl >= 0 ? "var(--danger)" : "var(--success)";
      var plSign = row.pl >= 0 ? "+" : "";
      return (
        '<div class="investment-holding-row" data-tab="' + _tabName + '" data-symbol="' + row.symbol + '" style="cursor:default;">' +
        '<span class="inv-h-symbol">' +
        row.symbol +
        "</span>" +
        '<span class="inv-h-name">' +
        row.name +
        "</span>" +
        '<span class="inv-h-qty">' +
        row.quantityText +
        "</span>" +
        '<span class="inv-h-price">均¥' +
        Number(row.avgPrice || 0).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        }) +
        "</span>" +
        '<span class="inv-h-price">现¥' +
        Number(row.price || 0).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        }) +
        "</span>" +
        '<span class="inv-h-value">¥' +
        Math.round(row.value || 0).toLocaleString() +
        "</span>" +
        '<span class="inv-h-pl" style="color:' +
        plClr +
        ';">' +
        plSign +
        "¥" +
        Math.round(row.pl || 0).toLocaleString() +
        " (" +
        plSign +
        Number(row.plPct || 0).toFixed(1) +
        "%)</span>" +
        '<span class="holding-nav-btn" data-symbol="' + row.symbol + '" style="cursor:pointer;font-size:12px;padding:2px 4px;border-radius:3px;margin-left:4px;" title="定位到卡片">🔍</span>' +
        "</div>"
      );
    })
    .join("");

  // [全系统自洽修复] 域F 投资持仓表格 加滚动容器（min-width:680px在小屏溢出）
  panel.innerHTML =
    '<div class="investment-holding-scroll">' +
    '<div class="investment-holding-head">' +
    '<h4 style="margin:0;font-size:13px;color:' +
    color +
    ';">' +
    title +
    "</h4>" +
    '<span style="font-size:11px;">市值 <strong style="color:var(--accent);">¥' +
    Math.round(totalValue).toLocaleString() +
    '</strong> | 盈亏 <strong style="color:' +
    totalClr +
    ';">' +
    totalSign +
    "¥" +
    Math.round(totalPL).toLocaleString() +
    "</strong></span>" +
    "</div>" +
    '<div class="investment-holding-row investment-holding-row-head">' +
    '<span class="inv-h-symbol">代码</span><span class="inv-h-name">名称</span><span class="inv-h-qty">数量</span><span class="inv-h-price">均价</span><span class="inv-h-price">现价</span><span class="inv-h-value">市值</span><span class="inv-h-pl">盈亏</span>' +
    "</div>" +
    rowsHtml +
    "</div>";
  area.appendChild(panel);

  // 🔍 导航按钮：定位到对应卡片
  setTimeout(function() {
    panel.querySelectorAll(".holding-nav-btn").forEach(function(btn) {
      btn.addEventListener("click", function(e) {
        e.stopPropagation();
        var sym = this.dataset.symbol;
        var tab = _tabName;
        // 切换到对应子Tab（子Tab按钮在父容器中）
        var btns = (area.parentElement || document).querySelectorAll(".sub-tab");
        var found = false;
        for (var bi = 0; bi < btns.length; bi++) {
          if (btns[bi].dataset.stab === tab) {
            btns[bi].click();
            found = true;
            break;
          }
        }
        // 滚动到对应卡片
        setTimeout(function() {
          var card = document.getElementById("card-" + sym);
          if (card) {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
            card.style.transition = "background 0.5s, border-color 0.5s, box-shadow 0.5s";
            card.style.background = "rgba(255, 215, 0, 0.25) !important";
            card.style.borderColor = "#ffd700";
            card.style.boxShadow = "0 0 24px rgba(255, 215, 0, 0.6)";
            setTimeout(function() {
              card.style.background = "";
              card.style.borderColor = "";
              card.style.boxShadow = "";
            }, 2500);
          }
        }, found ? 200 : 0);
      });
    });
  }, 0);
}

// ============================================================
//  📊 总持仓 — 统一显示所有资产类别的持仓
// ============================================================
function renderUnifiedHoldingsPanel(state, parent) {
  var snapshot = getInvestmentAssetSnapshot(state);
  var groups = snapshot.groups;
  var allRows = [];
  var totalValue = 0;
  var totalPL = 0;
  var groupLabels = {
    stocks: "股票",
    crypto: "虚拟币",
    precious: "贵金属",
    futures: "期货基金",
    properties: "房产",
    cars: "汽车",
  };
  var groupColors = {
    stocks: "#e07a30",
    crypto: "#9a6cd0",
    precious: "#d4b030",
    futures: "#4a8ee6",
    properties: "#4cb84a",
    cars: "#d07a5a",
  };
  var groupIcons = {
    stocks: "📈",
    crypto: "₿",
    precious: "🥇",
    futures: "📊",
    properties: "🏠",
    cars: "🚗",
  };

  for (var gk in groups) {
    var g = groups[gk];
    if (!g || g.rows.length === 0) continue;
    for (var ri = 0; ri < g.rows.length; ri++) {
      g.rows[ri]._groupKey = gk;
      g.rows[ri]._groupLabel = groupLabels[gk] || gk;
      g.rows[ri]._groupColor = groupColors[gk] || "var(--text-muted)";
      g.rows[ri]._groupIcon = groupIcons[gk] || "📦";
      allRows.push(g.rows[ri]);
    }
    totalValue += g.value;
    totalPL += g.pl;
  }
  if (allRows.length === 0) return;

  // 今日损益
  var dailyPL = typeof calculateDailyPL === "function" ? calculateDailyPL(state) : null;
  var totalDailyPL = dailyPL ? dailyPL.total : 0;

  var totalClr = totalPL >= 0 ? "var(--danger)" : "var(--success)";
  var totalSign = totalPL >= 0 ? "+" : "";
  var dailyClr = totalDailyPL >= 0 ? "var(--danger)" : "var(--success)";
  var dailySign = totalDailyPL >= 0 ? "+" : "";

  var panel = document.createElement("div");
  panel.className = "investment-holding-panel";
  panel.style.cssText = "margin-bottom:12px;padding:12px;background:rgba(0,180,216,0.06);border:1px solid var(--accent);border-radius:8px;overflow-x:auto;";

  var rowsHtml = allRows.map(function (row) {
    var plClr = row.pl >= 0 ? "var(--danger)" : "var(--success)";
    var plSign = row.pl >= 0 ? "+" : "";
    var tabName = "";
    if (row._groupKey === "stocks") tabName = "stocks";
    else if (row._groupKey === "crypto") tabName = "crypto";
    else if (row._groupKey === "precious") tabName = "precious";
    else if (row._groupKey === "futures") tabName = "futures";
    else if (row._groupKey === "properties") tabName = "re";
    else if (row._groupKey === "cars") tabName = "car";
    return '<div class="investment-holding-row unified-holding-row" style="cursor:pointer;" data-tab="' + tabName + '" data-symbol="' + row.symbol + '">' +
      '<span class="inv-h-symbol" style="color:' + row._groupColor + ';">' + row._groupIcon + ' ' + row.symbol + '</span>' +
      '<span class="inv-h-name" title="' + row._groupLabel + '">' + row.name + '</span>' +
      '<span class="inv-h-qty">' + row.quantityText + '</span>' +
      '<span class="inv-h-price">均¥' + Number(row.avgPrice || 0).toLocaleString(undefined, {maximumFractionDigits: 2}) + '</span>' +
      '<span class="inv-h-price">现¥' + Number(row.price || 0).toLocaleString(undefined, {maximumFractionDigits: 2}) + '</span>' +
      '<span class="inv-h-value">¥' + Math.round(row.value || 0).toLocaleString() + '</span>' +
      '<span class="inv-h-pl" style="color:' + plClr + ';">' + plSign + '¥' + Math.round(row.pl || 0).toLocaleString() + ' (' + plSign + Number(row.plPct || 0).toFixed(1) + '%)</span>' +
      '</div>';
  }).join("");

  panel.innerHTML =
    '<div class="investment-holding-scroll">' +
    '<div class="investment-holding-head">' +
    '<h4 style="margin:0;font-size:13px;color:var(--accent);">📊 总持仓 <span style="font-size:10px;color:var(--text-muted);font-weight:400;">（点击行跳转至对应Tab）</span></h4>' +
    '<span style="font-size:11px;">总市值 <strong style="color:var(--accent);">¥' + Math.round(totalValue).toLocaleString() + '</strong> | 总盈亏 <strong style="color:' + totalClr + ';">' + totalSign + '¥' + Math.round(totalPL).toLocaleString() + '</strong> | 今日 <strong style="color:' + dailyClr + ';">' + dailySign + '¥' + Math.round(totalDailyPL).toLocaleString() + '</strong></span>' +
    '</div>' +
    '<div class="investment-holding-row investment-holding-row-head">' +
    '<span class="inv-h-symbol">代码</span><span class="inv-h-name">名称</span><span class="inv-h-qty">数量</span><span class="inv-h-price">均价</span><span class="inv-h-price">现价</span><span class="inv-h-value">市值</span><span class="inv-h-pl">盈亏</span>' +
    '</div>' +
    rowsHtml +
    '</div>';

  parent.appendChild(panel);

  // 点击行跳转到对应Tab
  setTimeout(function() {
    panel.querySelectorAll(".unified-holding-row").forEach(function(rw) {
      rw.addEventListener("click", function() {
        var tab = this.dataset.tab;
        var symbol = this.dataset.symbol;
        // 切换到对应子Tab
        var btns = parent.querySelectorAll(".sub-tab");
        for (var i = 0; i < btns.length; i++) {
          if (btns[i].dataset.stab === tab) {
            btns[i].click();
            // 滚动到对应卡片
            setTimeout(function() {
              var card = document.getElementById("card-" + symbol);
              if (card) {
                card.scrollIntoView({ behavior: "smooth", block: "center" });
                card.style.transition = "background 0.5s, border-color 0.5s, box-shadow 0.5s";
                card.style.background = "rgba(255, 215, 0, 0.25) !important";
                card.style.borderColor = "#ffd700";
                card.style.boxShadow = "0 0 24px rgba(255, 215, 0, 0.6)";
                setTimeout(function() {
                  card.style.background = "";
                  card.style.borderColor = "";
                  card.style.boxShadow = "";
                }, 2500);
              }
            }, 200);
            break;
          }
        }
      });
    });
  }, 0);
}

// [全系统自洽修复] 域E 增强: 每日投资损益汇总计算
function calculateDailyPL(state) {
  var inv = state.investment;
  var dailyPL = { stocks: 0, crypto: 0, precious: 0, futures: 0, total: 0 };
  var holdings = inv.stockHoldings || [];
  for (var i = 0; i < holdings.length; i++) {
    var h = holdings[i];
    var m = inv.stockMarket[h.symbol];
    if (!m || !m.history || m.history.length < 2) continue;
    // [全系统自洽修复] 防止初始化产生的虚假历史数据导致"今日损益"虚高：
    // 只有最后两个历史条目来自不同天（即真实经过了一次日切），才计算每日损益。
    // 否则今天刚买入/刚初始化时，第二旧条目是回溯生成的假数据，算出的损益无意义。
    var last = m.history[m.history.length - 1];
    var prev = m.history[m.history.length - 2];
    if (!last || !prev || !last.day || !prev.day) continue;
    if (last.day === prev.day) continue; // 同一天未日切，跳过
    var prevPrice = (prev && isFinite(prev.price)) ? prev.price : m.price;
    // [全系统自洽修复] 域E A类: h.shares 可能 NaN(旧存档)→change=NaN 污染 dailyPL.total→UI 显示'今日 ¥NaN'
    var _sharesDL = (typeof h.shares === "number" && isFinite(h.shares)) ? h.shares : 0;
    var change = (m.price - prevPrice) * _sharesDL;
    var group = getInvestmentAssetGroup(h.symbol);
    if (group === "stocks") dailyPL.stocks += change;
    else if (group === "crypto") dailyPL.crypto += change;
    else if (group === "precious") dailyPL.precious += change;
    else if (group === "futures") dailyPL.futures += change;
  }
  dailyPL.total =
    dailyPL.stocks + dailyPL.crypto + dailyPL.precious + dailyPL.futures;
  return dailyPL;
}

// [全系统自洽修复] 域E 增强: 每日投资损益汇总UI面板
function renderDailyPLPanel(state) {
  var dailyPL = calculateDailyPL(state);
  var total = dailyPL.total;
  if (total === 0) return "";
  var color = total >= 0 ? "var(--danger)" : "var(--success)";
  var sign = total >= 0 ? "+" : "";
  var parts = [];
  if (dailyPL.stocks)
    parts.push(
      "股票" +
        (dailyPL.stocks >= 0 ? "+" : "") +
        Math.round(dailyPL.stocks).toLocaleString(),
    );
  if (dailyPL.crypto)
    parts.push(
      "虚拟币" +
        (dailyPL.crypto >= 0 ? "+" : "") +
        Math.round(dailyPL.crypto).toLocaleString(),
    );
  if (dailyPL.precious)
    parts.push(
      "贵金属" +
        (dailyPL.precious >= 0 ? "+" : "") +
        Math.round(dailyPL.precious).toLocaleString(),
    );
  if (dailyPL.futures)
    parts.push(
      "期货基金" +
        (dailyPL.futures >= 0 ? "+" : "") +
        Math.round(dailyPL.futures).toLocaleString(),
    );
  return (
    '<div style="padding:6px 10px;margin-bottom:8px;background:rgba(255,255,255,0.04);border:1px solid ' +
    color +
    ';border-radius:6px;font-size:11px;display:flex;align-items:center;justify-content:space-between;">' +
    "<span>📊 今日投资损益</span>" +
    '<span style="font-weight:bold;color:' +
    color +
    ';">' +
    sign +
    "¥" +
    Math.round(total).toLocaleString() +
    "</span>" +
    (parts.length > 0
      ? '<span style="font-size:10px;color:var(--text-muted);">' +
        parts.join(" · ") +
        "</span>"
      : "") +
    "</div>"
  );
}

// ============================================================
//  [域E R428 联动增强] E→B: 市场氛围叙事 — 根据当前市场情绪生成投资故事感
// ============================================================
function renderMarketNarrative(state, inv) {
  if (!inv) return "";
  var mood = inv._marketMood || "neutral";
  var holdings = inv.stockHoldings || [];
  if (holdings.length === 0) return "";
  // 根据市场情绪和持仓生成叙事
  var narratives = {
    bullish: [
      "📈 市场一片红火，你的持仓跟着水涨船高。走在街上都觉得步伐轻快了几分。",
      "📈 最近行情不错，连茶馆里的大爷都在讨论股票。你暗自庆幸自己上车早。",
      "📈 牛市来了，猪都能飞。你看着账户数字，提醒自己别太贪心。",
    ],
    bearish: [
      "📉 市场持续走低，绿油油一片。你告诉自己：别人恐惧我贪婪。",
      "📉 大盘连跌几天，朋友圈里一片哀嚎。你关掉行情页面，决定出去走走。",
      "📉 熊市是最好的老师。你开始认真研究基本面，而不是追涨杀跌。",
    ],
    neutral: [
      "➖ 市场波澜不惊，持仓不温不火。你耐心等待下一个机会。",
      "➖ 行情平稳，没有惊喜也没有惊吓。这种日子适合学习和定投。",
    ],
  };
  var pool = narratives[mood] || narratives.neutral;
  var idx = (state.player.day + holdings.length) % pool.length;
  var narrative = pool[idx];
  return '<div style="padding:8px 12px;margin-bottom:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:6px;font-size:11px;color:var(--text-secondary);line-height:1.5;">' +
    narrative + '</div>';
}

// ============================================================
//  [全系统自洽修复] 域E 联动增强1: 投资组合回撤指示器（E→F）
//  显示当前投资价值与历史峰值的回撤幅度，帮助玩家识别风险
// ============================================================
function renderDrawdownIndicator(state) {
  var inv = state.investment;
  if (!inv) return "";
  var peak = inv._portfolioPeak;
  if (!peak || peak <= 0) return "";
  var snapshot = getInvestmentAssetSnapshot(state);
  var curVal = snapshot.investmentValue || 0;
  if (curVal <= 0) return "";
  var dd = (peak - curVal) / peak;
  if (dd <= 0.01) return ""; // 回撤<1%不显示
  var ddPct = (dd * 100).toFixed(1);
  var color = "var(--text-muted)";
  var icon = "📉";
  var label = "小幅回撤";
  if (dd > 0.2) { color = "var(--danger)"; icon = "🔴"; label = "深度回撤"; }
  else if (dd > 0.1) { color = "var(--warning)"; icon = "⚠️"; label = "明显回撤"; }
  return '<div style="padding:6px 10px;margin-bottom:8px;background:rgba(255,255,255,0.04);border:1px solid ' + color + ';border-radius:6px;font-size:11px;display:flex;align-items:center;justify-content:space-between;">' +
    '<span>' + icon + ' ' + label + '：距历史峰值 ' + ddPct + '%</span>' +
    '<span style="color:' + color + ';font-weight:bold;">峰值 ¥' + Math.round(peak).toLocaleString() + ' → 当前 ¥' + Math.round(curVal).toLocaleString() + '</span>' +
    '</div>';
}

// ============================================================
//  [优化] 资产配置面板 — 显示当前各类资产占比
// ============================================================
function renderAssetAllocationPanel(snapshot) {
  if (!snapshot || !snapshot.groups) return "";
  var total = snapshot.investmentValue || 0;
  if (total <= 0) return "";
  var groups = snapshot.groups;
  var items = [
    { key: "stocks", label: "股票", color: "#e07a30" },
    { key: "crypto", label: "虚拟币", color: "#9a6cd0" },
    { key: "precious", label: "贵金属", color: "#d4b030" },
    { key: "futures", label: "期货基金", color: "#4a8ee6" },
    { key: "properties", label: "房产", color: "#4cb84a" },
    { key: "cars", label: "汽车", color: "#d07a5a" },
  ];
  var html = '<div style="margin-bottom:8px;padding:8px 12px;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.07);border-radius:6px;font-size:11px;">' +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
    '<strong>📊 资产配置</strong>' +
    '<span style="color:var(--text-muted);font-size:10px;">总投资 ¥' + Math.round(total).toLocaleString() + '</span></div>' +
    '<div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;">';
  for (var i = 0; i < items.length; i++) {
    var g = groups[items[i].key];
    var val = (g && g.value) || 0;
    var pct = total > 0 ? (val / total) * 100 : 0;
    if (pct < 0.5) continue;
    html += '<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 6px;background:' + items[i].color + '22;border:1px solid ' + items[i].color + '44;border-radius:4px;font-size:10px;">' +
      '<span style="width:6px;height:6px;border-radius:50%;background:' + items[i].color + ';"></span>' +
      items[i].label + ' ' + pct.toFixed(1) + '%</span>';
  }
  html += '</div></div>';
  return html;
}

// ============================================================
//  [优化] 投资分析弹窗 — 显示技术指标 + 资产配置建议
// ============================================================
function showInvestmentAnalysisModal() {
  var state = typeof StateManager !== "undefined" ? StateManager.getState() : null;
  if (!state || !state.investment) {
    if (typeof StateManager !== "undefined") StateManager.addMessage("投资系统未初始化", "warning");
    return;
  }
  var inv = state.investment;
  var snapshot = getInvestmentAssetSnapshot(state);
  var totalVal = snapshot.investmentValue || 0;

  // 技术指标一览
  var techHtml = '<h4 style="margin:0 0 6px 0;font-size:13px;color:var(--accent);">📈 技术指标说明</h4>' +
    '<div style="font-size:11px;color:var(--text-secondary);line-height:1.7;margin-bottom:8px;">';

  var indicators = typeof TECHNICAL_INDICATORS !== "undefined" ? TECHNICAL_INDICATORS : null;
  if (indicators) {
    techHtml += '<table style="width:100%;border-collapse:collapse;font-size:10px;">' +
      '<tr style="border-bottom:1px solid var(--border);"><th style="text-align:left;padding:4px;">指标</th><th style="text-align:left;padding:4px;">说明</th><th style="text-align:left;padding:4px;">用法</th></tr>';
    for (var k in indicators) {
      var ind = indicators[k];
      techHtml += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">' +
        '<td style="padding:4px;">' + ind.icon + ' ' + ind.name + '</td>' +
        '<td style="padding:4px;color:var(--text-muted);">' + ind.desc + '</td>' +
        '<td style="padding:4px;color:var(--text-muted);font-size:9px;">' + ind.calc + '</td></tr>';
    }
    techHtml += '</table>';
  } else {
    techHtml += '<p>技术指标数据未加载。</p>';
  }
  techHtml += '</div>';

  // 资产配置建议
  var allocHtml = '<h4 style="margin:12px 0 6px 0;font-size:13px;color:var(--accent);">🎯 资产配置建议</h4>' +
    '<div style="font-size:11px;color:var(--text-secondary);line-height:1.7;">';

  var strategies = typeof ASSET_ALLOCATION_STRATEGIES !== "undefined" ? ASSET_ALLOCATION_STRATEGIES : null;
  if (strategies && totalVal > 0) {
    allocHtml += '<table style="width:100%;border-collapse:collapse;font-size:10px;">' +
      '<tr style="border-bottom:1px solid var(--border);"><th style="text-align:left;padding:4px;">类型</th><th style="text-align:left;padding:4px;">风险</th><th style="text-align:left;padding:4px;">配置</th><th style="text-align:left;padding:4px;">预期收益</th></tr>';
    for (var sk in strategies) {
      var strat = strategies[sk];
      var allocStr = "";
      for (var ak in strat.allocation) {
        if (strat.allocation[ak] > 0) allocStr += ak + " " + strat.allocation[ak] + "% ";
      }
      allocHtml += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">' +
        '<td style="padding:4px;">' + strat.icon + ' ' + strat.name + '</td>' +
        '<td style="padding:4px;color:var(--text-muted);">' + strat.riskLevel + '</td>' +
        '<td style="padding:4px;color:var(--text-muted);font-size:9px;">' + allocStr + '</td>' +
        '<td style="padding:4px;color:var(--text-muted);">' + strat.expectedReturn + '</td></tr>';
    }
    allocHtml += '</table>';
  } else {
    allocHtml += '<p>需要先持有投资资产才能给出配置建议。</p>';
  }
  allocHtml += '</div>';

  // 止损止盈策略
  var stopHtml = '<h4 style="margin:12px 0 6px 0;font-size:13px;color:var(--accent);">🛑 止损止盈策略</h4>' +
    '<div style="font-size:11px;color:var(--text-secondary);line-height:1.7;">';

  var stopLoss = typeof STOP_LOSS_STRATEGIES !== "undefined" ? STOP_LOSS_STRATEGIES : null;
  if (stopLoss) {
    stopHtml += '<table style="width:100%;border-collapse:collapse;font-size:10px;">' +
      '<tr style="border-bottom:1px solid var(--border);"><th style="text-align:left;padding:4px;">策略</th><th style="text-align:left;padding:4px;">说明</th><th style="text-align:left;padding:4px;">优缺点</th></tr>';
    for (var slk in stopLoss) {
      var sl = stopLoss[slk];
      stopHtml += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">' +
        '<td style="padding:4px;">' + sl.icon + ' ' + sl.name + '</td>' +
        '<td style="padding:4px;color:var(--text-muted);font-size:9px;">' + sl.desc + '</td>' +
        '<td style="padding:4px;color:var(--text-muted);font-size:9px;">' + sl.pros + ' / ' + sl.cons + '</td></tr>';
    }
    stopHtml += '</table>';
  } else {
    stopHtml += '<p>止损止盈策略数据未加载。</p>';
  }
  stopHtml += '</div>';

  var body = techHtml + '<hr style="border:none;border-top:1px solid var(--border);margin:8px 0;">' +
    allocHtml + '<hr style="border:none;border-top:1px solid var(--border);margin:8px 0;">' +
    stopHtml;

  if (typeof showModal === "function") {
    showModal({
      title: "📊 投资分析工具",
      body: body,
      buttons: [{ text: "知道了", cls: "btn-primary" }],
    });
  } else {
    StateManager.addMessage("弹窗系统未加载", "warning");
  }
}

// ============================================================
//  投资主页面渲染
// ============================================================
function renderInvestmentTab(state, parent) {
  // [全系统自洽修复] 域F 联动增强: 投资Tab渲染时同步更新顶栏
  if (typeof renderHeader === "function") renderHeader(state);
  var inv = state.investment;
  if (!inv) {
    parent.innerHTML = "<p>投资系统初始化中...</p>";
    return;
  }
  if (typeof initInvestment === "function")
    initInvestment(state);

  var assetSnapshot = getInvestmentAssetSnapshot(state);
  var totalPL = assetSnapshot.investmentPL;
  var totalPLColor = totalPL >= 0 ? "var(--danger)" : "var(--success)";
  var totalPLSign = totalPL >= 0 ? "+" : "";

  parent.innerHTML = "";
  var cont = document.createElement("div");

  cont.innerHTML =
    '<h3>投资中心 <span style="font-size:12px;color:var(--accent);">总资产 ' +
    Math.round(assetSnapshot.totalAssets).toLocaleString() +
    '</span> <span style="font-size:12px;color:' +
    totalPLColor +
    ';">投资盈亏 ' +
    totalPLSign +
    "¥" +
    Math.round(totalPL).toLocaleString() +
    '</span> <span style="font-size:11px;color:var(--text-muted);cursor:pointer;" onclick="showInvestmentAnalysisModal()" title="查看投资分析工具">📊 分析</span>' +
    // [全系统自洽修复] 域F R390 联动增强(F→E): 投资组合风险仪表盘
    (function() {
      var _inv = state.investment;
      if (!_inv) return '';
      var _stocks = (_inv.stockHoldings || []).length;
      var _crypto = (_inv.btcHoldings || 0) > 0 ? 1 : 0;
      var _props = (_inv.properties || []).length;
      var _riskScore = _stocks * 3 + _crypto * 5 - _props * 1;
      var _riskLevel = _riskScore >= 10 ? '高' : _riskScore >= 5 ? '中' : '低';
      var _riskColor = _riskScore >= 10 ? 'var(--danger)' : _riskScore >= 5 ? 'var(--warning)' : 'var(--success)';
      var _riskIcon = _riskScore >= 10 ? '🔴' : _riskScore >= 5 ? '🟡' : '🟢';
      return ' <span style="font-size:11px;color:' + _riskColor + ';cursor:pointer;" title="组合风险评分:' + _riskScore + '（股票×3+加密×5-房产×1）">' + _riskIcon + ' ' + _riskLevel + '风险</span>';
    })() +
    '</h3>' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">' +
    summaryCard("股票", assetSnapshot.groups.stocks) +
    summaryCard("虚拟币", assetSnapshot.groups.crypto) +
    summaryCard("贵金属", assetSnapshot.groups.precious) +
    summaryCard("期货基金", assetSnapshot.groups.futures) +
    summaryCard("房产", assetSnapshot.groups.properties) +
    summaryCard("汽车", assetSnapshot.groups.cars) +
    "</div>" +
    renderAssetAllocationPanel(assetSnapshot) +
    renderMarketNarrative(state, inv) +
    renderDrawdownIndicator(state) +
    renderNewsInvestmentDrivers(state) +
    renderMarketSentiment(state, inv) +
    // [全系统自洽修复] 域E 联动增强(E→F): 组合表现趋势 — 基于最近3日组合市值变化显示方向
    (function() {
      try {
        var _inv2 = state.investment;
        if (!_inv2 || !_inv2._portfolioPeakHistory || _inv2._portfolioPeakHistory.length < 2) return '';
        var _recent = _inv2._portfolioPeakHistory.slice(-3);
        var _first = _recent[0], _last = _recent[_recent.length - 1];
        if (_first === _last) return '';
        var _trend = _last > _first ? '📈' : '📉';
        var _pct = _first > 0 ? (((_last - _first) / _first) * 100).toFixed(1) : 0;
        var _trendColor = _last > _first ? 'var(--danger)' : 'var(--success)';
        return '<span style="font-size:10px;color:' + _trendColor + ';margin-left:8px;">' + _trend + ' 近3日 ' + (_last > _first ? '+' : '') + _pct + '%</span>';
      } catch (e) { return ''; }
    })() +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:10px;color:var(--text-muted);flex-wrap:wrap;">' +
    "<span>📉 跌</span>" +
    '<span style="color:var(--success);font-weight:bold;">🟢 绿</span>' +
    '<span style="color:var(--text-muted);">/</span>' +
    "<span>📈 涨</span>" +
    '<span style="color:var(--danger);font-weight:bold;">🔴 红</span>' +
    '<span style="color:var(--text-muted);">· 折线固定蓝色 · 价格/涨跌幅 红涨绿跌</span>' +
    "</div>" +
    '<div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;">' +
    '<button class="btn btn-sm sub-tab active" data-stab="stocks" title="📈 股票：投资A股/港股/美股，30只知名企业，短线波动大">股票</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="crypto" title="₿ 虚拟币：比特币等10种加密货币，高波动高风险">虚拟币</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="precious" title="🥇 贵金属：黄金/白银等实物贵金属，避险保值">贵金属</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="futures" title="📊 期货基金：指数基金/期货合约，长期定投">期货基金</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="re" title="🏠 房产：住宅/商铺/写字楼，大额投资长期持有">房产</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="car" title="🚗 汽车：二手车/新车，代步工具也可投资转卖">汽车</button>' +
    '</div><div id="inv-sub-area"></div>';

  parent.appendChild(cont);

  // 总持仓面板（单独调用，不参与字符串拼接）
  renderUnifiedHoldingsPanel(state, cont);

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
    // 恢复上次的子Tab（购买/卖出后避免跳回股票）
    var lastTab = state._investmentSubTab || "stocks";
    renderSub(lastTab);
    var btns = cont.querySelectorAll(".sub-tab");
    for (var i = 0; i < btns.length; i++) {
      // 高亮当前Tab
      if (btns[i].dataset.stab === lastTab) btns[i].classList.add("active");
      else btns[i].classList.remove("active");
      btns[i].addEventListener("click", function () {
        for (var j = 0; j < btns.length; j++)
          btns[j].classList.remove("active");
        this.classList.add("active");
        state._investmentSubTab = this.dataset.stab;
        renderSub(this.dataset.stab);
      });
    }
  }, 0);
}

// ---- 摘要小卡片 ----
function summaryCard(label, group) {
  var value = group && group.value ? group.value : 0;
  var pl = group && group.pl ? group.pl : 0;
  var count = group && group.count ? group.count : 0;
  var plColor = pl >= 0 ? "var(--danger)" : "var(--success)";
  var plSign = pl >= 0 ? "+" : "";
  return (
    '<div class="action-card investment-summary-card" style="flex:1;min-width:116px;text-align:center;padding:8px 6px;">' +
    '<div style="font-size:10px;color:var(--text-muted);">' +
    label +
    "</div>" +
    '<strong style="font-size:13px;">' +
    "¥" +
    Math.round(value).toLocaleString() +
    "</strong>" +
    '<div style="font-size:10px;color:var(--text-muted);margin-top:2px;">持有 ' +
    count +
    ' 项</div><div style="font-size:10px;color:' +
    plColor +
    ';">' +
    plSign +
    "¥" +
    Math.round(pl).toLocaleString() +
    "</div>" +
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
                  ((s.resources.cash || 0) / mkt.price) *
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
          var maxQ = Math.floor((s.resources.cash || 0) / mkt.price / step) * step;
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
  var holdings = (inv.stockHoldings || []).filter(function (h) {
    return getInvestmentAssetGroup(h.symbol) === "stocks";
  });
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
      // [全系统自洽修复] 域E A类: avgPrice/shares 可能 NaN(旧存档/数据异常)→UI 显示'NaN股/均¥NaN'，兜底为 0
      var _avgPx = (typeof h.avgPrice === "number" && isFinite(h.avgPrice)) ? h.avgPrice : 0;
      var _shares = (typeof h.shares === "number" && isFinite(h.shares)) ? h.shares : 0;
      var val = curPx * _shares;
      var pl = (curPx - _avgPx) * _shares;
      var plPct =
        _avgPx > 0 ? ((curPx - _avgPx) / _avgPx) * 100 : 0;
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
        <div class="stock-holding-row" data-symbol="${h.symbol}" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:11px;gap:6px;cursor:pointer;" title="点击查看${stkName}逐笔成交记录">
          <span style="font-weight:600;min-width:50px;">${h.symbol}</span>
          <span style="color:var(--text-secondary);min-width:55px;font-size:10px;">${stkName}</span>
          <span style="min-width:40px;text-align:right;">${_shares}股</span>
          <span style="min-width:55px;text-align:right;font-size:10px;color:var(--text-muted);">均¥${_avgPx.toFixed(2)}</span>
          <span style="min-width:55px;text-align:right;">现¥${curPx.toFixed(2)}</span>
          <span style="min-width:60px;text-align:right;">市值¥${Math.round(val).toLocaleString()}</span>
          <span style="min-width:70px;text-align:right;color:${plClr};font-weight:600;">${plSign}¥${Math.round(pl).toLocaleString()}</span>
          <span style="min-width:45px;text-align:right;color:${plClr};font-size:10px;">${plSign}${plPct.toFixed(1)}%</span>
          <span class="holding-nav-btn" data-symbol="${h.symbol}" style="cursor:pointer;font-size:13px;padding:2px 4px;border-radius:3px;transition:background 0.15s;" title="定位到 ${stkName} 卡片">🔍</span>
        </div>`;
    }
    var totalClr = totalPL >= 0 ? "var(--danger)" : "var(--success)";
    var totalSign = totalPL >= 0 ? "+" : "";
    // 计算今日股票损益
    var dailyPL = typeof calculateDailyPL === "function" ? calculateDailyPL(state) : null;
    var stockDailyPL = dailyPL ? dailyPL.stocks : 0;
    var dailyClr = stockDailyPL >= 0 ? "var(--danger)" : "var(--success)";
    var dailySign = stockDailyPL >= 0 ? "+" : "";
    portfolioDiv.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <h4 style="margin:0;font-size:13px;color:var(--accent);">📊 我的股票</h4>
        <span style="font-size:11px;">总市值 <strong style="color:var(--accent);">¥${Math.round(totalValue).toLocaleString()}</strong> | 总盈亏 <strong style="color:${totalClr};">${totalSign}¥${Math.round(totalPL).toLocaleString()}</strong> | 今日 <strong style="color:${dailyClr};">${dailySign}¥${Math.round(stockDailyPL).toLocaleString()}</strong></span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:10px;color:var(--text-muted);border-bottom:2px solid var(--border);margin-bottom:4px;">
        <span style="min-width:50px;">代码</span><span style="min-width:55px;">名称</span><span style="min-width:40px;text-align:right;">数量</span><span style="min-width:55px;text-align:right;">均价</span><span style="min-width:55px;text-align:right;">现价</span><span style="min-width:60px;text-align:right;">市值</span><span style="min-width:70px;text-align:right;">盈亏</span><span style="min-width:45px;text-align:right;">幅度</span>
      </div>
      ${rowsHtml}
      <div id="trade-log-area"></div>
    `;
    area.appendChild(portfolioDiv);

    // 持仓行点击展开成交记录 + 🔍 按钮定位到卡片
    setTimeout(function() {
      var logArea = document.getElementById("trade-log-area");
      // 🔍 导航按钮：定位到对应股票卡片
      portfolioDiv.querySelectorAll(".holding-nav-btn").forEach(function(btn){
        btn.addEventListener("click", function(e) {
          e.stopPropagation();
          var sym = this.dataset.symbol;
          var card = document.getElementById("card-" + sym);
          if (card) {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
            card.style.transition = "background 0.5s, border-color 0.5s, box-shadow 0.5s";
            card.style.background = "rgba(255, 215, 0, 0.25) !important";
            card.style.borderColor = "#ffd700";
            card.style.boxShadow = "0 0 24px rgba(255, 215, 0, 0.6)";
            setTimeout(function() {
              card.style.background = "";
              card.style.borderColor = "";
              card.style.boxShadow = "";
            }, 2500);
          } else {
            StateManager.addMessage("⚠️ 未找到 " + sym + " 的卡片，请先切换到股票Tab。", "warning");
          }
        });
      });
      // 持仓行点击展开成交记录
      portfolioDiv.querySelectorAll(".stock-holding-row").forEach(function(rw){
        var sym = rw.dataset.symbol;
        rw.onclick = function(e) {
          // 点击🔍按钮时不触发
          if (e.target.classList.contains("holding-nav-btn")) return;
          if (this._expanded) {
            this._expanded = false;
            this.style.background = "transparent";
            var existing = logArea.querySelector("[data-for-sym='" + sym + "']");
            if (existing) existing.remove();
            return;
          }
          var logs = (inv.tradeLog || []).filter(function(t){ return t.symbol === sym; });
          if (logs.length === 0) {
            StateManager.addMessage("ℹ️ " + sym + " 暂无成交记录。", "info");
            return;
          }
          this._expanded = true;
          this.style.background = "rgba(0,180,216,0.08)";
          var prev = logArea.querySelector("[data-for-sym='" + sym + "']");
          if (prev) prev.remove();
          logs.sort(function(a,b){ return a.day - b.day; });
          var logRows = "";
          logs.forEach(function(t){
            var isBuy = t.type === "buy";
            var signText = isBuy ? "买入" : "卖出";
            var clr = isBuy ? "var(--danger)" : "var(--success)";
            var plHtml = "";
            if (typeof t.pl === "number") {
              var clr2 = t.pl >= 0 ? "var(--danger)" : "var(--success)";
              var plSign = t.pl >= 0 ? "+" : "";
              plHtml = ' <span style="color:' + clr2 + '">(' + plSign + "¥" + Math.round(t.pl) + ")</span>";
            }
            logRows += '<div style="display:flex;gap:8px;font-size:10px;color:var(--text-muted);padding:3px 0;border-bottom:1px dashed rgba(255,255,255,0.06);">';
            logRows += '<span style="min-width:60px;">第' + t.day + '天</span>';
            logRows += '<span style="min-width:30px;color:' + clr + ';font-weight:bold;">' + signText + '</span>';
            logRows += '<span style="min-width:70px;text-align:right;">' + t.price.toFixed(2) + '¥/' + (t.unitLabel||"") + '</span>';
            var qtyDec = (t.unitLabel && t.unitLabel !== "股") ? 4 : 0;
            logRows += '<span style="min-width:50px;text-align:right;">×' + Number(t.quantity).toFixed(qtyDec) + '</span>';
            logRows += '<span style="min-width:80px;text-align:right;">=' + ('¥' + Math.round(t.total).toLocaleString()) + '</span>';
            logRows += plHtml + '</div>';
          });
          var div = document.createElement("div");
          div.setAttribute("data-for-sym", sym);
          div.style.cssText = "margin-top:6px;padding:8px;background:rgba(0,0,0,0.25);border-radius:6px;font-size:10px;";
          div.innerHTML = '<div style="display:flex;gap:8px;font-size:9px;color:var(--text-muted);padding:2px 0 4px 0;border-bottom:1px solid var(--border);margin-bottom:2px;"><span style="min-width:60px;">日期</span><span style="min-width:30px;">操作</span><span style="min-width:70px;text-align:right;">单价</span><span style="min-width:50px;text-align:right;">数量</span><span style="min-width:80px;text-align:right;">金额</span></div>' + logRows;
          logArea.appendChild(div);
        };
      });
    }, 0);
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
    card.id = "card-" + cid.replace("chart-", "");
    card.style.borderLeft = "3px solid " + clr;
    var sharesStr = h ? h.shares.toFixed(2) : "";
    // [优化] 技术指标：计算简单RSI信号（5日均价 vs 当前价）
    var _ma5 = (m.history && m.history.length >= 5)
      ? m.history.slice(-5).reduce(function(a,b){return a+b.price;},0)/5
      : null;
    var _trendSignal = "";
    var _trendClr = "";
    if (_ma5 !== null) {
      if (m.price > _ma5 * 1.02) { _trendSignal = "📈 强势"; _trendClr = "var(--danger)"; }
      else if (m.price < _ma5 * 0.98) { _trendSignal = "📉 弱势"; _trendClr = "var(--success)"; }
      else { _trendSignal = "➡️ 盘整"; _trendClr = "var(--text-muted)"; }
    }
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
      (_trendSignal ? '<div style="font-size:10px;color:' + _trendClr + ';margin:2px 0;">MA5信号: ' + _trendSignal + '</div>' : "") +
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
            ? Math.floor((StateManager.getState().resources.cash || 0) / price)
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

  renderInvestmentHoldingPanel(
    area,
    inv,
    ["crypto"],
    "🪙 我的虚拟币",
    "#9b74b8",
  );

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
    card.id = "card-" + cid.replace("chart-", "");
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
                ((StateManager.getState().resources.cash || 0) / price) * factor,
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
  renderInvestmentHoldingPanel(
    area,
    inv,
    ["precious"],
    "🥇 我的贵金属",
    "#c49a3a",
  );

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
    card.id = "card-" + cid.replace("chart-", "");
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
            ? Math.floor((StateManager.getState().resources.cash || 0) / price)
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
  renderInvestmentHoldingPanel(
    area,
    inv,
    ["futures"],
    "📈 我的期货基金",
    "#5a8ab4",
  );

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
    var sharesStr = h ? h.shares.toFixed(2) : "";

    var card = document.createElement("div");
    card.className = "action-card";
    card.id = "card-" + cid.replace("chart-", "");
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
            ? Math.floor((StateManager.getState().resources.cash || 0) / price)
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
      var canRentHigh = (state.resources.cash || 0) >= highTier.cost && curTier < 4; // [全系统自洽修复] 域E A类: cash NaN守卫
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
              if ((s.resources.cash || 0) < (highTier.cost || 0)) {
                StateManager.addMessage("现金不足", "danger");
                return;
              }
              s.resources.cash = Math.max(0, (s.resources.cash || 0) - (highTier.cost || 0));
              // [全系统自洽修复] 域E A类#1: housing/inventory 裸访问守卫 — 旧存档phase1阶段可能缺失 housing/inventory 对象
              if (!s.housing) s.housing = {};
              if (!s.inventory) s.inventory = {};
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
    var canAfford = (state.resources.cash || 0) >= propDef.price; // [全系统自洽修复] 域E A类: cash NaN守卫
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
        : // [全系统自洽修复] 域E R237:原引用已删除的appreciation字段→改用baseAppreciation
          '<div style="font-size:10px;color:var(--text-muted);">年增值: +' +
          ((propDef.baseAppreciation || 0.0001) * 365 * 100).toFixed(1) +
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
      var pct = buyP > 0 ? ((diff / buyP) * 100).toFixed(1) : "0.0";
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
          // 切换为出租：退出自住，降级住所到合租床位（玩家可重新租房）
          s.investment.selfLivePropertyId = null;
          if (typeof HOUSING_TIERS !== "undefined" && s.housing && s.inventory) {
            s.housing.tier = 1;
            s.inventory.capacity =
              HOUSING_TIERS[1].capacity + (s.housing.storageCapacity || 0);
          }
          StateManager.addMessage(
            "🏢 已将房产改为出租，搬回合租床位（可去城中村重新租房升级）。",
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
          if (typeof HOUSING_TIERS !== "undefined" && s.housing && s.inventory) {
            // 使用精确的房产→住所映射表，不再按价格粗略分级
            var newTier = propDef
              ? typeof getPropertyHousingTier === "function"
                ? getPropertyHousingTier(propDef.id)
                : null
              : null;
            // 如果房产不可自住（商业/海外等），降级到合租床位
            if (newTier === null) {
              newTier = 1;
            }
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
  marketGrid.style.cssText =
    "display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,240px));gap:8px;align-items:start;";

  for (var mi = 0; mi < CAR_TYPES.length; mi++) {
    var carDef = CAR_TYPES[mi];
    var owned = false;
    for (var ci = 0; ci < list.length; ci++) {
      if (list[ci].id === carDef.id) {
        owned = true;
        break;
      }
    }
    var canAfford = (state.resources.cash || 0) >= carDef.price; // [全系统自洽修复] 域E A类: cash NaN守卫
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
      var pct = buyP > 0 ? ((diff / buyP) * 100).toFixed(1) : "0.0";
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

// [全系统自洽修复] 域E R389 联动增强(E→C): 投资组合职业信心—投资成功提升职业绩效
function applyInvestmentCareerBoost(state) {
  if (!state || !state.investment || !state.career || !state.career.currentJob) return;
  if (!state.flags) state.flags = {};
  var inv = state.investment;
  var totalProfit = inv._totalInvestmentProfit || 0;
  if (totalProfit >= 50000 && !state.flags._investCareerBoostActive) {
    state.flags._investCareerBoostActive = true;
    state.career.currentJob.performance = Math.min(100, (state.career.currentJob.performance || 50) + 5);
    StateManager.addMessage("📈 投资成功让你在职场上更有底气。绩效+5。", "success");
  }
  // 每月根据投资盈利调整绩效
  if (state.player && state.player.day % 30 === 0 && totalProfit > 0) {
    var boost = Math.min(3, Math.floor(totalProfit / 100000));
    if (boost > 0 && state.career.currentJob) {
      state.career.currentJob.performance = Math.min(100, (state.career.currentJob.performance || 50) + 1);
    }
  }
}

// [全系统自洽修复] 域E R389 联动增强(E→F): 投资组合快照数据—供UI渲染投资概览
function getPortfolioSnapshot(state) {
  if (!state || !state.investment) return { totalValue: 0, totalCost: 0, pnl: 0, items: [] };
  var inv = state.investment;
  var items = [];
  var totalValue = 0, totalCost = 0;
  // 股票持仓
  var stocks = inv.stockHoldings || [];
  for (var si = 0; si < stocks.length; si++) {
    var h = stocks[si];
    var m = inv.stockMarket && inv.stockMarket[h.symbol];
    var curPrice = m ? m.price : 0;
    var value = curPrice * h.shares;
    var cost = (h.avgPrice || 0) * h.shares;
    totalValue += value; totalCost += cost;
    items.push({ type: "stock", name: h.symbol, shares: h.shares, value: value, cost: cost, pnl: value - cost });
  }
  // 比特币
  if (inv.btcHoldings > 0) {
    var btcVal = (inv.btcPrice || 0) * inv.btcHoldings;
    var btcCost = (inv.btcAvgCost || 0) * inv.btcHoldings;
    totalValue += btcVal; totalCost += btcCost;
    items.push({ type: "btc", name: "比特币", shares: inv.btcHoldings, value: btcVal, cost: btcCost, pnl: btcVal - btcCost });
  }
  // 房产
  var props = inv.properties || [];
  for (var pi = 0; pi < props.length; pi++) {
    var p = props[pi];
    var pVal = p.currentPrice || p.buyPrice || 0;
    totalValue += pVal; totalCost += p.buyPrice || 0;
    items.push({ type: "property", name: p.name || "房产", value: pVal, cost: p.buyPrice || 0, pnl: pVal - (p.buyPrice || 0) });
  }
  // 车辆
  var cars = inv.cars || [];
  for (var ci = 0; ci < cars.length; ci++) {
    var c = cars[ci];
    var cVal = c.currentPrice || c.buyPrice || 0;
    totalValue += cVal; totalCost += c.buyPrice || 0;
    items.push({ type: "car", name: c.name || "车辆", value: cVal, cost: c.buyPrice || 0, pnl: cVal - (c.buyPrice || 0) });
  }
  return { totalValue: Math.round(totalValue), totalCost: Math.round(totalCost), pnl: Math.round(totalValue - totalCost), items: items };
}

// [全系统自洽修复] 域D R419 联动增强(D→E): NPC投资建议 — 基于NPC好感度提供投资情报
function getNpcInvestmentAdvice(state) {
  if (!state || !state.relationships) return null;
  var tips = [];
  for (var npcId in state.relationships) {
    var rel = state.relationships[npcId];
    if (rel && rel.met && (rel.affinity || 0) >= 60) {
      if (typeof NPCS !== 'undefined' && NPCS) {
        var npcDef = NPCS.find(function(n) { return n && n.id === npcId; });
        if (npcDef && npcDef.tradeInfo && npcDef.tradeInfo.expertise) {
          tips.push({ npc: npcDef.name || npcId, expertise: npcDef.tradeInfo.expertise });
        }
      }
    }
  }
  return tips.length > 0 ? tips : null;
}

// [全系统自洽修复] 域E R420 联动增强(E→D): 投资社交影响 — 基于投资表现调整NPC好感度
function applyInvestmentSocialEffect(state, plAmount) {
  if (!state || !plAmount || !state.relationships) return;
  if (Math.abs(plAmount) < 1000) return;
  var isGain = plAmount > 0;
  var magnitude = Math.min(3, Math.floor(Math.abs(plAmount) / 5000));
  for (var npcId in state.relationships) {
    var rel = state.relationships[npcId];
    if (rel && rel.met) {
      if (isGain) rel.affinity = Math.min(100, (rel.affinity || 0) + magnitude);
      else rel.affinity = Math.max(0, (rel.affinity || 0) - Math.floor(magnitude / 2));
    }
  }
}

// [全系统自洽修复] 域E R420 联动增强(E→F): 投资回报评级 — 返回投资表现的可视化评级
function getInvestmentReturnRating(plPercent) {
  if (plPercent == null || isNaN(plPercent)) return { icon: '➖', label: '持平', color: 'var(--text-muted)' };
  if (plPercent >= 50) return { icon: '🚀', label: '暴涨', color: 'var(--success)' };
  if (plPercent >= 20) return { icon: '📈', label: '大涨', color: 'var(--success)' };
  if (plPercent >= 5) return { icon: '📊', label: '上涨', color: 'var(--accent)' };
  if (plPercent >= -5) return { icon: '➖', label: '持平', color: 'var(--text-muted)' };
  if (plPercent >= -20) return { icon: '📉', label: '下跌', color: 'var(--warning)' };
  if (plPercent >= -50) return { icon: '📉', label: '大跌', color: 'var(--danger)' };
  return { icon: '💥', label: '暴跌', color: 'var(--danger)' };
}

// [全系统自洽修复] 域E R420 联动增强(E→C): 投资技能成长 — 成功投资提升商业技能经验
function grantInvestmentSkillXp(state, plAmount) {
  if (!state || !plAmount || plAmount <= 0) return;
  var xp = Math.min(20, Math.floor(plAmount / 1000));
  if (xp <= 0) return;
  if (state.skills) {
    if (state.skills.accounting) state.skills.accounting.xp = (state.skills.accounting.xp || 0) + xp;
    if (state.skills.management) state.skills.management.xp = (state.skills.management.xp || 0) + Math.floor(xp / 2);
  }
}

// [全系统自洽修复] 域E 联动增强(E→A): 投资组合数据摘要 — 供经济分析系统消费
function getInvestmentPortfolioSummary(state) {
  if (!state || !state.investment) return null;
  var inv = state.investment;
  var _stocks = inv.stockHoldings || [];
  var _stockVal = 0;
  for (var _si = 0; _si < _stocks.length; _si++) {
    var _h = _stocks[_si];
    var _m = inv.stockMarket && inv.stockMarket[_h.symbol];
    if (_m && isFinite(_m.price)) _stockVal += _m.price * (_h.shares || 0);
  }
  var _btcVal = (inv.btcPrice || 0) * (inv.btcHoldings || 0);
  var _props = inv.properties || [];
  var _propVal = 0;
  for (var _pi = 0; _pi < _props.length; _pi++) {
    _propVal += _props[_pi].currentPrice || _props[_pi].buyPrice || 0;
  }
  return {
    stockCount: _stocks.length,
    stockValue: Math.round(_stockVal),
    btcValue: Math.round(_btcVal),
    propertyCount: _props.length,
    propertyValue: Math.round(_propVal),
    totalValue: Math.round(_stockVal + _btcVal + _propVal),
  };
}
// [R718 域E 联动增强 E→G]: 投资压力健康影响 — 大额亏损影响心情和健康
function applyInvestmentStressEffect(state, dailyPL) {
  if (!state || !state.needs || typeof dailyPL !== "number") return;
  if (dailyPL < -5000) {
    var stressLevel = Math.min(10, Math.floor(Math.abs(dailyPL) / 5000));
    state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - stressLevel);
    if (state.status) {
      state.status.health = Math.max(0, (state.status.health || 100) - Math.floor(stressLevel / 3));
    }
  }
  if (dailyPL > 10000) {
    var boostLevel = Math.min(5, Math.floor(dailyPL / 10000));
    state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + boostLevel);
  }
}

// [R718 域E 联动增强 E→B]: 投资故事素材 — 基于投资表现生成市场叙事
function getInvestmentStory(state) {
  if (!state || !state.investment) return null;
  var totalInvested = state.investment._totalInvested || 0;
  var totalReturn = state.investment._totalReturn || 0;
  if (totalInvested <= 0) return null;
  var roi = (totalReturn - totalInvested) / totalInvested;
  if (roi > 2) return { type: "investment_genius", title: "投资天才", text: "你在市场上的表现令人惊叹，收益率超过了200%！" };
  if (roi > 0.5) return { type: "investment_steady", title: "稳健收益", text: "你的投资组合表现稳健，收益率超过50%。" };
  if (roi < -0.5) return { type: "investment_loss", title: "投资亏损", text: "市场波动让你损失惨重，累计亏损超过50%。" };
  if (roi < -0.8) return { type: "investment_disaster", title: "投资惨败", text: "你的投资几乎血本无归，是时候重新评估策略了。" };
  return null;
}
// [R429] 域E
// [R453] 域E
// [R477] 域E
// [R501] 域E
// [R525] 域E
// [R549] 域E
// [R573] 域E
// [R597] 域E
// [R613] 域E


// [R726 第三轮 域E 联动增强 E→F]: 投资组合风险评级
function getPortfolioRiskRating(state) {
  if (!state || !state.investment) return { level: 'none', score: 0, label: '无投资' };
  var inv = state.investment;
  var stocks = inv.stockHoldings || [];
  var btc = (inv.btcHoldings || 0) > 0;
  var props = inv.properties || [];
  var diversity = (stocks.length > 0 ? 1 : 0) + (btc ? 1 : 0) + (props.length > 0 ? 1 : 0);
  var stockRisk = 0;
  for (var _si = 0; _si < stocks.length; _si++) {
    var s = stocks[_si];
    var m = inv.stockMarket && inv.stockMarket[s.symbol];
    if (m && m.volatility) stockRisk += m.volatility;
  }
  if (stocks.length > 0) stockRisk /= stocks.length;
  var score = (diversity * 15) + (stockRisk * 50);
  if (score < 30) return { level: 'conservative', score: Math.round(score), label: '保守型' };
  if (score < 60) return { level: 'balanced', score: Math.round(score), label: '均衡型' };
  return { level: 'aggressive', score: Math.round(score), label: '进取型' };
}

// [R726 第三轮 域E 联动增强 E→G]: 财务自由进度
function getFinancialFreedomProgress(state) {
  if (!state || !state.resources) return 0;
  var cash = state.resources.cash || 0;
  var bank = state.resources.bankBalance || 0;
  var total = cash + bank;
  var target = 500000;
  return Math.min(100, Math.round((total / target) * 100));
}

// [R806 域E 联动增强 E→G]: 投资组合健康度 — 分散投资提升健康恢复
function getInvestmentHealthBonus(state) {
  if (!state || !state.investment) return 0;
  var _diversity = 0;
  var inv = state.investment;
  if (inv.stockHoldings && inv.stockHoldings.length > 0) _diversity++;
  if (inv.properties && inv.properties.length > 0) _diversity++;
  if (inv.btcHoldings > 0) _diversity++;
  if (inv.cars && inv.cars.length > 0) _diversity++;
  return Math.min(3, _diversity);
}

// [R806 域E 联动增强 E→F]: 投资组合摘要供UI展示
function getInvestmentSummary(state) {
  if (!state || !state.investment) return null;
  var inv = state.investment;
  var _stockValue = 0;
  if (inv.stockHoldings && inv.stockMarket) {
    for (var _i = 0; _i < inv.stockHoldings.length; _i++) {
      var _h = inv.stockHoldings[_i];
      var _m = inv.stockMarket[_h.symbol];
      if (_m) _stockValue += _m.price * _h.shares;
    }
  }
  var _propValue = 0;
  if (inv.properties) {
    for (var _p = 0; _p < inv.properties.length; _p++) {
      _propValue += inv.properties[_p].currentPrice || inv.properties[_p].buyPrice || 0;
    }
  }
  var _btcValue = (inv.btcHoldings || 0) * (inv.btcPrice || 0);
  return { stocks: _stockValue, properties: _propValue, btc: _btcValue, total: _stockValue + _propValue + _btcValue };
}
