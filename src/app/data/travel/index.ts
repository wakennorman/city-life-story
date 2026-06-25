export interface TravelRequirement {
  field: string;
  min?: number;
}

export interface TravelSouvenir {
  id: string;
  name: string;
  description: string;
}

export interface TravelEffect {
  target: string;
  op: "add" | "set" | "mul";
  value: number;
}

export interface TravelDestination {
  id: string;
  name: string;
  icon: string;
  region: string;
  cost: number;
  duration: number;
  apCost: number;
  requirements: TravelRequirement[];
  events: string[];
  souvenirs: TravelSouvenir[];
  effects: TravelEffect[];
  description: string;
}

export const TRAVEL_DESTINATIONS: TravelDestination[] = [
  {
    id: "beijing",
    name: "北京",
    icon: "🏛️",
    region: "华北",
    cost: 800,
    duration: 3,
    apCost: 30,
    requirements: [{ field: "resources.cash", min: 800 }],
    events: ["forbidden_city_reflection", "hutong_noodle_chat"],
    souvenirs: [
      { id: "peking_duck_coupon", name: "烤鸭券", description: "一张老字号烤鸭纪念券。" },
      { id: "opera_mask", name: "京剧脸谱", description: "挂在出租屋墙上会显得很郑重。" },
    ],
    effects: [
      { target: "needs.happiness", op: "add", value: 10 },
      { target: "player.intelligence", op: "add", value: 1 },
    ],
    description: "历史厚重、制度感强，适合触发公共服务和职业方向思考。",
  },
  {
    id: "shanghai",
    name: "上海",
    icon: "🌃",
    region: "华东",
    cost: 1000,
    duration: 3,
    apCost: 30,
    requirements: [{ field: "resources.cash", min: 1000 }],
    events: ["bund_skyline", "lane_wonton"],
    souvenirs: [
      { id: "silk_scarf", name: "丝巾", description: "旧弄堂小店买来的丝巾。" },
      { id: "old_brand_pastry", name: "老字号糕点", description: "带回来分给朋友正合适。" },
    ],
    effects: [
      { target: "needs.happiness", op: "add", value: 12 },
      { target: "player.charm", op: "add", value: 1 },
    ],
    description: "商业、职场和现代城市节奏的旅行样本。",
  },
  {
    id: "chengdu",
    name: "成都",
    icon: "🐼",
    region: "西南",
    cost: 600,
    duration: 3,
    apCost: 25,
    requirements: [{ field: "resources.cash", min: 600 }],
    events: ["panda_base_afternoon", "hotpot_tears"],
    souvenirs: [
      { id: "panda_doll", name: "熊猫公仔", description: "抱起来让人松一口气。" },
      { id: "pepper_oil", name: "花椒油", description: "能让普通面条变得像旅行。" },
    ],
    effects: [
      { target: "needs.happiness", op: "add", value: 15 },
      { target: "needs.fatigue", op: "add", value: -8 },
    ],
    description: "低成本高恢复，适合压力过载后的短期修复。",
  },
  {
    id: "xian",
    name: "西安",
    icon: "🏯",
    region: "西北",
    cost: 500,
    duration: 3,
    apCost: 25,
    requirements: [{ field: "resources.cash", min: 500 }],
    events: ["terracotta_silence", "city_wall_ride"],
    souvenirs: [
      { id: "terracotta_replica", name: "兵马俑仿品", description: "很小，却有两千年的沉默。" },
      { id: "shadow_puppet", name: "皮影", description: "纸影里藏着另一种生活。" },
    ],
    effects: [
      { target: "player.intelligence", op: "add", value: 1 },
      { target: "player.physique", op: "add", value: 1 },
    ],
    description: "历史感和低成本旅行平衡，适合开阔长期叙事。",
  },
  {
    id: "dali",
    name: "大理",
    icon: "🏔️",
    region: "西南",
    cost: 400,
    duration: 4,
    apCost: 20,
    requirements: [{ field: "resources.cash", min: 400 }],
    events: ["erhai_cycling", "folk_song_night"],
    souvenirs: [
      { id: "tie_dye_cloth", name: "扎染布", description: "蓝白纹路像水面和云。" },
      { id: "flower_cake", name: "鲜花饼", description: "甜得很轻，适合慢慢吃。" },
    ],
    effects: [
      { target: "needs.happiness", op: "add", value: 18 },
      { target: "needs.fatigue", op: "add", value: -12 },
    ],
    description: "最便宜但天数较长，强调慢生活与心理恢复。",
  },
  {
    id: "hangzhou",
    name: "杭州",
    icon: "🌊",
    region: "华东",
    cost: 700,
    duration: 2,
    apCost: 22,
    requirements: [{ field: "resources.cash", min: 700 }],
    events: ["west_lake_walk", "internet_city_visit"],
    souvenirs: [
      { id: "longjing_tea", name: "龙井茶样", description: "小小一包，闻起来很清。" },
      { id: "west_lake_postcard", name: "西湖明信片", description: "写给未来自己的明信片。" },
    ],
    effects: [
      { target: "needs.happiness", op: "add", value: 10 },
      { target: "skills.writing.xp", op: "add", value: 5 },
    ],
    description: "把自然景观和互联网职业想象放在同一条路线里。",
  },
  {
    id: "shenzhen",
    name: "深圳",
    icon: "🚄",
    region: "华南",
    cost: 900,
    duration: 2,
    apCost: 24,
    requirements: [
      { field: "resources.cash", min: 900 },
      { field: "player.intelligence", min: 25 },
    ],
    events: ["maker_space_visit", "bay_area_overtime"],
    souvenirs: [
      { id: "maker_badge", name: "创客贴纸", description: "贴在二手电脑上刚刚好。" },
      { id: "metro_day_pass", name: "地铁日票", description: "一座高效率城市的纸片。" },
    ],
    effects: [
      { target: "skills.programming.xp", op: "add", value: 8 },
      { target: "needs.fatigue", op: "add", value: 6 },
    ],
    description: "创业、硬件和高强度职场路线的旅行样本。",
  },
  {
    id: "local_city_loop",
    name: "本城环线",
    icon: "🚌",
    region: "本地",
    cost: 180,
    duration: 1,
    apCost: 12,
    requirements: [{ field: "resources.cash", min: 180 }],
    events: ["old_street_breakfast", "night_market_bus"],
    souvenirs: [
      { id: "city_walking_notebook", name: "城市漫游手账", description: "记着公交线路、便宜饭馆和几个街角。" },
    ],
    effects: [
      { target: "travel.localFamiliarity", op: "add", value: 1 },
      { target: "needs.happiness", op: "add", value: 8 },
    ],
    description: "不离开当前城市的低成本恢复路线，也是 bridge 已接入的微旅行。",
  },
];

export const TRAVEL_CATALOG_STATUS = {
  migrated: TRAVEL_DESTINATIONS.length,
  legacySource: "src/js/core/travel.js",
  nextStep: "新增目的地继续写入 TRAVEL_DESTINATIONS，再分批接入旧旅行 UI。",
} as const;
