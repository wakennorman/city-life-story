/**
 * 装备/道具/食材定义
 *
 * 食材分类（isIngredient: true）：
 *   - 主食类：大米、面粉、面条、土豆
 *   - 蔬菜类：青菜、白菜、萝卜、番茄、黄瓜
 *   - 肉类：猪肉、牛肉、鸡肉、鱼
 *   - 调料类：盐、酱油、油、糖、辣椒
 *   - 蛋奶类：鸡蛋、牛奶
 *
 * 食材属性：
 *   - price: 市场购买价格
 *   - perishDays: 常温保鲜天数（冰箱+5天，冷冻+15天）
 *   - isIngredient: 是否为食材（用于烹饪系统）
 *   - ingredientType: 食材分类
 */

var ITEMS = [
  // ============================================================
  // 食材 — 主食类
  // ============================================================
  {
    id: "rice",
    name: "大米",
    icon: "🍚",
    slot: null,
    price: 5,
    perishDays: 30,
    isIngredient: true,
    ingredientType: "主食",
    desc: "基础主食，做饭必备。常温可存1个月。",
  },
  {
    id: "flour",
    name: "面粉",
    icon: "🫓",
    slot: null,
    price: 4,
    perishDays: 30,
    isIngredient: true,
    ingredientType: "主食",
    desc: "可做面条、馒头、饺子皮。",
  },
  {
    id: "noodles",
    name: "面条",
    icon: "🍜",
    slot: null,
    price: 3,
    perishDays: 7,
    isIngredient: true,
    ingredientType: "主食",
    desc: "速食面条，方便快捷。保质期较短。",
  },
  {
    id: "potato",
    name: "土豆",
    icon: "🥔",
    slot: null,
    price: 2,
    perishDays: 14,
    isIngredient: true,
    ingredientType: "主食",
    desc: "万能食材，可炒可炖可炸。",
  },

  // ============================================================
  // 食材 — 蔬菜类
  // ============================================================
  {
    id: "bok_choy",
    name: "青菜",
    icon: "🥬",
    slot: null,
    price: 3,
    perishDays: 5,
    isIngredient: true,
    ingredientType: "蔬菜",
    desc: "新鲜青菜，清炒或煮汤。保质期短。",
  },
  {
    id: "cabbage",
    name: "白菜",
    icon: "🥬",
    slot: null,
    price: 2,
    perishDays: 7,
    isIngredient: true,
    ingredientType: "蔬菜",
    desc: "便宜大碗，炖菜必备。",
  },
  {
    id: "radish",
    name: "萝卜",
    icon: "🥕",
    slot: null,
    price: 2,
    perishDays: 10,
    isIngredient: true,
    ingredientType: "蔬菜",
    desc: "萝卜炖肉，暖胃暖心。",
  },
  {
    id: "tomato",
    name: "番茄",
    icon: "🍅",
    slot: null,
    price: 3,
    perishDays: 5,
    isIngredient: true,
    ingredientType: "蔬菜",
    desc: "酸甜可口，可做汤或炒菜。",
  },
  {
    id: "cucumber",
    name: "黄瓜",
    icon: "🥒",
    slot: null,
    price: 2,
    perishDays: 5,
    isIngredient: true,
    ingredientType: "蔬菜",
    desc: "清爽可口，可凉拌可炒。",
  },

  // ============================================================
  // 食材 — 肉类
  // ============================================================
  {
    id: "pork",
    name: "猪肉",
    icon: "🥩",
    slot: null,
    price: 15,
    perishDays: 5,
    isIngredient: true,
    ingredientType: "肉类",
    desc: "家常必备，可炒可炖。",
  },
  {
    id: "beef",
    name: "牛肉",
    icon: "🥩",
    slot: null,
    price: 25,
    perishDays: 5,
    isIngredient: true,
    ingredientType: "肉类",
    desc: "优质蛋白，红烧或炒牛肉。",
  },
  {
    id: "chicken",
    name: "鸡肉",
    icon: "🍗",
    slot: null,
    price: 12,
    perishDays: 5,
    isIngredient: true,
    ingredientType: "肉类",
    desc: "低脂高蛋白，炖汤或炒鸡丁。",
  },
  {
    id: "fish",
    name: "鱼",
    icon: "🐟",
    slot: null,
    price: 18,
    perishDays: 3,
    isIngredient: true,
    ingredientType: "肉类",
    desc: "新鲜鱼类，清蒸或红烧。保质期很短。",
  },

  // ============================================================
  // 食材 — 调料类
  // ============================================================
  {
    id: "salt",
    name: "盐",
    icon: "🧂",
    slot: null,
    price: 1,
    perishDays: 365,
    isIngredient: true,
    ingredientType: "调料",
    desc: "百味之首，做菜必备。",
  },
  {
    id: "soy_sauce",
    name: "酱油",
    icon: "🫙",
    slot: null,
    price: 3,
    perishDays: 180,
    isIngredient: true,
    ingredientType: "调料",
    desc: "提鲜上色，红烧必备。",
  },
  {
    id: "cooking_oil",
    name: "食用油",
    icon: "🫙",
    slot: null,
    price: 5,
    perishDays: 180,
    isIngredient: true,
    ingredientType: "调料",
    desc: "炒菜必备。",
  },
  {
    id: "sugar",
    name: "糖",
    icon: "🍬",
    slot: null,
    price: 2,
    perishDays: 365,
    isIngredient: true,
    ingredientType: "调料",
    desc: "调味或做甜点。",
  },
  {
    id: "chili",
    name: "辣椒",
    icon: "🌶️",
    slot: null,
    price: 2,
    perishDays: 7,
    isIngredient: true,
    ingredientType: "调料",
    desc: "增加辣味，开胃下饭。",
  },

  // ============================================================
  // 食材 — 蛋奶类
  // ============================================================
  {
    id: "egg",
    name: "鸡蛋",
    icon: "🥚",
    slot: null,
    price: 1,
    perishDays: 7,
    isIngredient: true,
    ingredientType: "蛋奶",
    desc: "万能食材，炒蛋、煮蛋、蒸蛋。",
  },
  {
    id: "milk",
    name: "牛奶",
    icon: "🥛",
    slot: null,
    price: 3,
    perishDays: 5,
    isIngredient: true,
    ingredientType: "蛋奶",
    desc: "补充蛋白质和钙质。",
  },

  // [全系统自洽修复] 域A A类#1: 新增12种菜品食材（在goods.js中定义为isIngredient，用于cooking.js食谱，
  //   但未在items.js中定义，导致validateIngredientPrices不检查、isItemNpcGift无映射）
  {
    id: "corn",
    name: "玉米",
    icon: "🌽",
    slot: null,
    price: 2,
    perishDays: 7,
    isIngredient: true,
    ingredientType: "主食",
    desc: "可做玉米粥、蒸玉米。秋季丰收价低。",
  },
  {
    id: "lettuce",
    name: "生菜",
    icon: "🥬",
    slot: null,
    price: 2,
    perishDays: 3,
    isIngredient: true,
    ingredientType: "蔬菜",
    desc: "可做生菜包肉。保质期短。",
  },
  {
    id: "mushroom",
    name: "蘑菇",
    icon: "🍄",
    slot: null,
    price: 4,
    perishDays: 3,
    isIngredient: true,
    ingredientType: "蔬菜",
    desc: "可做蘑菇汤、炒蘑菇。",
  },
  {
    id: "vinegar",
    name: "醋",
    icon: "🫙",
    slot: null,
    price: 2,
    perishDays: 365,
    isIngredient: true,
    ingredientType: "调料",
    desc: "调味必备，保质期长。",
  },
  {
    id: "tofu",
    name: "豆腐",
    icon: "🫘",
    slot: null,
    price: 3,
    perishDays: 2,
    isIngredient: true,
    ingredientType: "蔬菜",
    desc: "可做麻婆豆腐、豆腐汤。保质期极短。",
  },
  {
    id: "bamboo_shoot",
    name: "竹笋",
    icon: "🎋",
    slot: null,
    price: 5,
    perishDays: 5,
    isIngredient: true,
    ingredientType: "蔬菜",
    desc: "可做竹笋炒肉。春季最鲜。",
  },
  {
    id: "garlic",
    name: "大蒜",
    icon: "🧄",
    slot: null,
    price: 2,
    perishDays: 20,
    isIngredient: true,
    ingredientType: "调料",
    desc: "提味增香，几乎每道菜都用。",
  },
  {
    id: "onion",
    name: "洋葱",
    icon: "🧅",
    slot: null,
    price: 2,
    perishDays: 14,
    isIngredient: true,
    ingredientType: "调料",
    desc: "做菜必备，保鲜期较长。",
  },
  {
    id: "starch",
    name: "淀粉",
    icon: "🫙",
    slot: null,
    price: 2,
    perishDays: 180,
    isIngredient: true,
    ingredientType: "调料",
    desc: "勾芡用，做菜增稠。",
  },
  {
    id: "shrimp",
    name: "虾",
    icon: "🦐",
    slot: null,
    price: 20,
    perishDays: 2,
    isIngredient: true,
    ingredientType: "肉类",
    desc: "高蛋白，清蒸/油焖。保质期极短。",
  },
  {
    id: "duck",
    name: "鸭子",
    icon: "🦆",
    slot: null,
    price: 22,
    perishDays: 4,
    isIngredient: true,
    ingredientType: "肉类",
    desc: "可做烤鸭/炖鸭汤。",
  },
  {
    id: "ginger",
    name: "生姜",
    icon: "🧄",
    slot: null,
    price: 3,
    perishDays: 15,
    isIngredient: true,
    ingredientType: "调料",
    desc: "驱寒暖胃，炖汤必备。",
  },

  // ============================================================
  // 装备/道具
  // ============================================================
  {
    id: "straw_hat",
    name: "草帽",
    icon: "👒",
    slot: "head",
    effects: { hygiene: 2 },
    jobBonuses: {
      street_vending_food: { incomeMultiplier: 1.05 },
      sister_zhang_vending: { incomeMultiplier: 1.05 },
      manual_labor_construction: { incomeMultiplier: 1.03 },
    },
    price: 10,
    desc: "防晒遮雨，摆摊/室外工作收入+3%~5%",
    buyLocations: ["slum", "wholesaleMarket"],
  },
  {
    id: "work_gloves",
    name: "劳保手套",
    icon: "🧤",
    slot: "hand",
    effects: { physique: 3, injury: -0.02 },
    jobBonuses: {
      waste_recycling: { incomeMultiplier: 1.05 },
      old_zhou_recycling: { incomeMultiplier: 1.08 },
      manual_labor_construction: { incomeMultiplier: 1.08 },
      premium_engineering: { incomeMultiplier: 1.05 },
    },
    price: 15,
    desc: "体质+3，受伤概率-2%。建筑/废品回收工作收入+5%~8%",
    buyLocations: ["wholesaleMarket", "construction"],
  },
  {
    id: "mask",
    name: "口罩",
    icon: "😷",
    slot: "head",
    effects: { hygiene: 5, illness: -0.03 },
    jobBonuses: {
      hospital_companion: { incomeMultiplier: 1.06, riskReduction: 0.02 },
      training_assistant: { incomeMultiplier: 1.04 },
      street_vending_food: { incomeMultiplier: 1.03 },
    },
    price: 5,
    desc: "卫生+5，生病概率-3%。护工工作收入+6%，降低感染风险",
    buyLocations: ["slum", "wholesaleMarket", "commercialDist"],
  },
  {
    id: "sturdy_shoes",
    name: "解放鞋",
    icon: "👟",
    slot: "feet",
    effects: { agility: 3, fatigue: -5 },
    jobBonuses: {
      delivery_rider: { incomeMultiplier: 1.1 },
      courier_gig: { incomeMultiplier: 1.08 },
      street_vending_food: { incomeMultiplier: 1.05 },
    },
    price: 25,
    desc: "敏捷+3，每日疲劳减少5。配送/外卖工作收入+5%~10%",
    buyLocations: ["wholesaleMarket", "slum"],
  },
  {
    id: "backpack",
    name: "大背包",
    icon: "🎒",
    slot: "accessory",
    effects: { capacity: 10 },
    jobBonuses: {
      courier_gig: { incomeMultiplier: 1.08 },
      wholesale_delivery: { incomeMultiplier: 1.06 },
      waste_recycling: { incomeMultiplier: 1.05 },
    },
    price: 40,
    desc: "背包容量+10kg。跑腿/快递/废品回收收入+5%~8%",
    buyLocations: ["wholesaleMarket"],
  },
  {
    id: "work_uniform",
    name: "工作服",
    icon: "👔",
    slot: "body",
    effects: { hygiene: 3, fame: 2 },
    jobBonuses: {
      training_assistant: { incomeMultiplier: 1.1 },
      bank_security: { incomeMultiplier: 1.08 },
      restaurant_assistant: { incomeMultiplier: 1.06 },
    },
    price: 35,
    desc: "卫生+3，名气+2，服务业/体力工作收入+6%~10%",
    buyLocations: ["wholesaleMarket", "commercialDist"],
  },
  {
    id: "safety_helmet",
    name: "安全帽",
    icon: "⛑️",
    slot: "head",
    effects: { injury: -0.05 },
    jobBonuses: {
      manual_labor_construction: {
        incomeMultiplier: 1.06,
        riskReduction: 0.03,
      },
      premium_engineering: {
        incomeMultiplier: 1.06,
        riskReduction: 0.03,
      },
      steel_worker: { incomeMultiplier: 1.04, riskReduction: 0.02 },
    },
    price: 20,
    desc: "工地受伤概率-5%。工地工作收入+4%~6%，额外降低受伤风险",
    buyLocations: ["construction", "wholesaleMarket"],
  },
  {
    id: "smartphone",
    name: "智能手机",
    icon: "📱",
    slot: "accessory",
    effects: { intelligence: 2, fame: 3 },
    jobBonuses: {
      delivery_rider: { incomeMultiplier: 1.12 },
      factory_work_assembly: { incomeMultiplier: 1.08 },
      training_assistant: { incomeMultiplier: 1.1 },
      content_writing: { incomeMultiplier: 1.05 },
    },
    price: 500,
    desc: "智力+2，名气+3。骑手/数据/客服工作收入+5%~12%",
    buyLocations: ["commercialDist", "techPark", "school"],
  },
  {
    id: "bicycle",
    name: "自行车",
    icon: "🚲",
    slot: null,
    effects: { agility: 5, fatigue_reduction: 10 },
    jobBonuses: {
      delivery_rider: { incomeMultiplier: 1.2 },
      wholesale_delivery: { incomeMultiplier: 1.15 },
      courier_gig: { incomeMultiplier: 1.18 },
    },
    price: 200,
    desc: "敏捷+5，每日减疲劳10。配送/快递/跑腿收入+15%~20%",
    buyLocations: ["wholesaleMarket", "commercialDist"],
  },
  {
    id: "cert_exam_book",
    name: "考证教材",
    icon: "📖",
    slot: null,
    effects: { skillStudy: 1.5 },
    price: 30,
    desc: "技能学习效率×1.5",
    buyLocations: ["school"],
  },
  {
    id: "backpack_basic",
    name: "帆布背包",
    icon: "🎒",
    slot: "accessory",
    effects: { capacity: 5 },
    price: 20,
    desc: "背包容量+5kg（入门款，比大背包便宜但容量小）",
    buyLocations: ["slum", "wholesaleMarket"],
  },
  {
    id: "backpack_large",
    name: "大号旅行包",
    icon: "🎒",
    slot: "accessory",
    effects: { capacity: 15 },
    price: 150,
    desc: "背包容量+15kg",
    buyLocations: ["wholesaleMarket", "commercialDist"],
  },
  {
    id: "backpack_pro",
    name: "专业登山包",
    icon: "🎒",
    slot: "accessory",
    effects: { capacity: 30 },
    price: 400,
    desc: "背包容量+30kg",
    buyLocations: ["commercialDist"],
  },
  {
    id: "warm_coat",
    name: "厚棉衣",
    icon: "🧥",
    slot: "body",
    effects: { coldProtection: 20, comfort: 5 },
    jobBonuses: {
      street_vending_food: { incomeMultiplier: 1.08 },
      sister_zhang_vending: { incomeMultiplier: 1.08 },
      manual_labor_construction: { incomeMultiplier: 1.06 },
      hospital_companion: { incomeMultiplier: 1.08 },
    },
    price: 80,
    desc: "防寒+20，舒适度+5，冬天必备。室外工作收入+6%~8%",
    buyLocations: ["wholesaleMarket", "commercialDist"],
  },
  {
    id: "sunscreen",
    name: "防晒霜",
    icon: "🧴",
    slot: "accessory",
    effects: { heatProtection: 15, hygiene: 3 },
    jobBonuses: {
      street_vending_food: { incomeMultiplier: 1.06 },
      delivery_rider: { incomeMultiplier: 1.05 },
      manual_labor_construction: { incomeMultiplier: 1.05 },
      courier_gig: { incomeMultiplier: 1.05 },
      wholesale_delivery: { incomeMultiplier: 1.04 },
    },
    price: 25,
    desc: "防暑+15，夏天减少高温损耗。室外工作收入+5%~6%",
    buyLocations: ["commercialDist", "slum"],
  },
  {
    id: "thermos",
    name: "保温杯",
    icon: "☕",
    slot: "accessory",
    effects: { fatigue: -3, hunger: 2 },
    jobBonuses: {
      manual_labor_construction: { incomeMultiplier: 1.04 },
      delivery_rider: { incomeMultiplier: 1.04 },
      waste_recycling: { incomeMultiplier: 1.03 },
      courier_gig: { incomeMultiplier: 1.04 },
      street_vending_food: { incomeMultiplier: 1.03 },
    },
    price: 45,
    desc: "每日减疲劳3，维持体力。体力工作收入+3%~4%",
    buyLocations: ["wholesaleMarket", "commercialDist"],
  },

  // ============================================================
  // 新增装备 — 正式实现（v2.1 内容扩充，补充至35个）
  // 参考来源：《大多数》装备系统 / 《Stardew Valley》工具系统 / 真实中国生活用品（2024年）
  // 兼容性修复：jobBonuses 引用的工作 ID 已全部核对至 jobs.js 现有工作
  // ============================================================

  // ====== 季节性装备 ======
  {
    id: "thermal_underwear",
    name: "保暖内衣",
    icon: "👕",
    slot: "body",
    effects: { coldProtection: 15, fatigue: -3 },
    jobBonuses: {
      manual_labor_construction: { incomeMultiplier: 1.05 },
      waste_recycling: { incomeMultiplier: 1.05 },
      delivery_rider: { incomeMultiplier: 1.04 },
    },
    price: 60,
    desc: "防寒+15，冬天必备。室外工作疲劳减少3点。",
    buyLocations: ["wholesaleMarket", "commercialDist"],
    seasonal: { winter: 1.0, summer: 0.5 },
  },
  {
    id: "raincoat",
    name: "雨衣",
    icon: "🌧️",
    slot: "body",
    effects: { rainProtection: 20, fatigue: -2 },
    jobBonuses: {
      delivery_rider: { incomeMultiplier: 1.08 },
      street_vending_food: { incomeMultiplier: 1.05 },
      courier_gig: { incomeMultiplier: 1.06 },
    },
    price: 40,
    desc: "雨天卫生不下降，疲劳-2。配送/摆摊雨天必备。",
    buyLocations: ["wholesaleMarket", "commercialDist"],
    seasonal: { spring: 1.1, summer: 1.2 },
  },
  {
    id: "umbrella",
    name: "雨伞",
    icon: "☂️",
    slot: null,
    effects: { rainHygiene: 0, travelAp: -1 },
    price: 30,
    desc: "雨天卫生不下降，出行行动力-1。雨天必备。",
    buyLocations: ["wholesaleMarket", "commercialDist"],
  },

  // ====== 安全/健康类 ======
  {
    id: "first_aid_kit",
    name: "急救包",
    icon: "🚑",
    slot: "accessory",
    effects: { illnessReduction: 0.1, injuryAutoHeal: true },
    price: 150,
    desc: "受伤时自动治疗，生病概率-10%。保命神器。",
    buyLocations: ["hospital", "wholesaleMarket", "commercialDist"],
  },
  {
    id: "work_boots",
    name: "劳保靴",
    icon: "👢",
    slot: "feet",
    effects: { physique: 2, injuryReduction: 0.08 },
    jobBonuses: {
      manual_labor_construction: { incomeMultiplier: 1.06 },
      premium_engineering: { incomeMultiplier: 1.05 },
      steel_worker: { incomeMultiplier: 1.05 },
    },
    price: 80,
    desc: "体质+2，工地受伤概率-8%。工地必备。",
    buyLocations: ["construction", "wholesaleMarket"],
  },
  {
    id: "reflective_vest",
    name: "反光背心",
    icon: "🦺",
    slot: "body",
    effects: { nightVisibility: 20 },
    jobBonuses: {
      delivery_rider: { incomeMultiplier: 1.08 },
      wholesale_delivery: { incomeMultiplier: 1.06 },
      factory_overtime: { incomeMultiplier: 1.04 },
    },
    price: 30,
    desc: "夜间工作可见度+20%，配送收入+6%~8%。夜间配送必备。",
    buyLocations: ["wholesaleMarket", "factoryZone"],
  },
  {
    id: "pepper_spray",
    name: "防狼喷雾",
    icon: "🧴",
    slot: "accessory",
    effects: { safety: 30 },
    price: 50,
    desc: "夜间出行安全+30%，降低被袭击概率。女性必备。",
    buyLocations: ["commercialDist", "wholesaleMarket"],
  },

  // ====== 数码/学习类 ======
  {
    id: "power_bank",
    name: "充电宝",
    icon: "🔋",
    slot: "accessory",
    effects: { phoneBattery: true },
    jobBonuses: {
      delivery_rider: { incomeMultiplier: 1.05 },
      training_assistant: { incomeMultiplier: 1.03 },
    },
    price: 100,
    desc: "智能手机不耗电，配送效率+5%。数码党必备。",
    buyLocations: ["commercialDist", "techPark", "wholesaleMarket"],
  },
  {
    id: "laptop_bag",
    name: "电脑包",
    icon: "💼",
    slot: "accessory",
    effects: { intelligence: 1 },
    jobBonuses: {
      factory_work_assembly: { incomeMultiplier: 1.05 },
      training_assistant: { incomeMultiplier: 1.05 },
      content_writing: { incomeMultiplier: 1.05 },
    },
    price: 200,
    desc: "智力+1，科技类工作收入+5%。白领必备。",
    buyLocations: ["techPark", "commercialDist"],
  },
  {
    id: "smart_watch",
    name: "智能手表",
    icon: "⌚",
    slot: "accessory",
    effects: { healthMonitor: true, fatigueRecoveryBonus: 0.05 },
    jobBonuses: {
      delivery_rider: { incomeMultiplier: 1.05 },
      hospital_companion: { incomeMultiplier: 1.04 },
    },
    price: 300,
    desc: "健康监控，疲劳恢复+5%，消息提醒。",
    buyLocations: ["techPark", "commercialDist"],
  },
  {
    id: "noise_cancelling_earphones",
    name: "降噪耳机",
    icon: "🎧",
    slot: "accessory",
    effects: { studyEfficiency: 0.15, fatigue: -3 },
    price: 250,
    desc: "学习环境效率+15%，疲劳-3。学习/办公必备。",
    buyLocations: ["techPark", "commercialDist", "school"],
  },
  {
    id: "memo_pad",
    name: "记事本",
    icon: "📓",
    slot: null,
    effects: { skillXpBonus: 0.1 },
    price: 10,
    desc: "学习技能XP+10%，记录重要信息。学习辅助。",
    buyLocations: ["school", "wholesaleMarket"],
  },
  {
    id: "flashlight",
    name: "手电筒",
    icon: "🔦",
    slot: null,
    effects: { nightWorkIncome: 0.05, nightExploreAp: -1 },
    price: 25,
    desc: "夜间工作收入+5%，夜间探索行动力-1。夜间工作必备。",
    buyLocations: ["wholesaleMarket", "slum"],
  },
  {
    id: "radio",
    name: "收音机",
    icon: "📻",
    slot: null,
    effects: { newsAccess: true, happiness: 2 },
    price: 80,
    desc: "获取新闻信息，心情+2。信息获取渠道。",
    buyLocations: ["wholesaleMarket", "slum"],
  },

  // ====== 生活便利类 ======
  {
    id: "vitamins_item",
    name: "维生素片",
    icon: "💊",
    slot: null,
    effects: { healthDaily: 1, healthBonusStreak: 5 },
    price: 20,
    desc: "每日健康+1，连续服用7天额外+5。需每日服用。",
    buyLocations: ["hospital", "commercialDist", "wholesaleMarket"],
  },
  {
    id: "eye_drops",
    name: "眼药水",
    icon: "💧",
    slot: null,
    effects: { fatigueIntelWork: -2 },
    price: 15,
    desc: "智力工作疲劳-2，连续使用效果递减。程序员必备。",
    buyLocations: ["hospital", "commercialDist", "techPark"],
  },
  {
    id: "back_massager",
    name: "便携按摩仪",
    icon: "💆",
    slot: null,
    effects: { fatigue: -5, physiqueRecovery: 3 },
    price: 200,
    desc: "每日疲劳-5，体质恢复+3。体力工作后放松。",
    buyLocations: ["commercialDist", "hospital"],
  },
  {
    id: "lunch_box",
    name: "保温饭盒",
    icon: "🍱",
    slot: null,
    effects: { foodFreshness: 0.5, hunger: 3 },
    price: 50,
    desc: "饭菜保温时间+50%，吃饭恢复+3饥饱。带饭必备。",
    buyLocations: ["wholesaleMarket", "commercialDist"],
  },
  {
    id: "folding_bike",
    name: "折叠自行车",
    icon: "🚲",
    slot: null,
    effects: { agility: 3, fatigueReduction: 8, travelAp: -2 },
    jobBonuses: {
      delivery_rider: { incomeMultiplier: 1.15 },
      wholesale_delivery: { incomeMultiplier: 1.1 },
      courier_gig: { incomeMultiplier: 1.12 },
    },
    price: 350,
    desc: "敏捷+3，每日减疲劳8，旅行行动力-2。通勤/配送神器。",
    buyLocations: ["wholesaleMarket", "commercialDist"],
  },

  // 装备品质系统已在 src/js/core/equipment_quality.js 实现：
  // 3 档（普通/优质/高档），仅影响售价（×1.0/1.2/1.5），不影响工作收入；附魔已移除。
];

function getItemById(itemId) {
  return ITEMS.find((i) => i.id === itemId) || null;
}

/**
 * 判断特定装备/道具是否符合某个NPC的礼物偏好
 * @param {string} itemId 道具ID
 * @param {string} npcId NPC ID（来自 npcs.js）
 * @returns {boolean} 该NPC是否喜欢这个礼物
 */
function isItemNpcGift(itemId, npcId) {
  var item = getItemById(itemId);
  if (!item) return false;

  // 装备→礼物分类映射
  var EQUIPMENT_GIFT_MAP = {
    // 原有装备
    straw_hat: ["daily_use", "clothing"],
    work_gloves: ["daily_use"],
    mask: ["daily_use"],
    sturdy_shoes: ["daily_use", "clothing"],
    backpack: ["daily_use"],
    work_uniform: ["clothing"],
    safety_helmet: ["daily_use"],
    smartphone: ["daily_use"],
    bicycle: ["daily_use"],
    cert_exam_book: ["daily_use"],
    backpack_basic: ["daily_use"],
    backpack_large: ["daily_use"],
    backpack_pro: ["daily_use"],
    warm_coat: ["clothing", "daily_use"],
    sunscreen: ["daily_use"],
    thermos: ["daily_use"],
    // 新装备礼物映射
    thermal_underwear: ["clothing", "daily_use"],
    raincoat: ["daily_use"],
    umbrella: ["daily_use"],
    first_aid_kit: ["daily_use"],
    work_boots: ["daily_use"],
    reflective_vest: ["daily_use"],
    pepper_spray: ["daily_use"],
    power_bank: ["electronics", "daily_use"],
    laptop_bag: ["daily_use"],
    smart_watch: ["electronics", "daily_use"],
    noise_cancelling_earphones: ["electronics", "daily_use"],
    memo_pad: ["daily_use"], // [全系统自洽修复] 域A 修复: notebook_item→memo_pad (原ID冲突)
    flashlight: ["daily_use"],
    radio: ["daily_use"],
    vitamins_item: ["daily_use"], // [全系统自洽修复] 域A 修复: vitamins_item2→vitamins_item NPC礼物ID对齐
    eye_drops: ["daily_use"],
    back_massager: ["daily_use"],
    lunch_box: ["daily_use"],
    folding_bike: ["daily_use"],
  };

  // 食材→礼物分类映射
  var INGREDIENT_GIFT_MAP = {
    rice: ["daily_use"],
    flour: ["daily_use"],
    noodles: ["instant_noodles", "daily_use"],
    potato: ["vegetables", "daily_use"],
    bok_choy: ["vegetables"],
    cabbage: ["vegetables"],
    radish: ["vegetables"],
    tomato: ["vegetables", "fruits"],
    cucumber: ["vegetables"],
    pork: ["daily_use"],
    beef: ["daily_use"],
    chicken: ["daily_use"],
    fish: ["daily_use"],
    salt: ["daily_use"],
    soy_sauce: ["daily_use"],
    cooking_oil: ["daily_use"],
    sugar: ["daily_use"],
    chili: ["daily_use"],
    egg: ["daily_use"],
    milk: ["daily_use"],
    // [全系统自洽修复] 域A A类#1: 新增12种食材NPC礼物映射
    corn: ["vegetables", "daily_use"],
    lettuce: ["vegetables"],
    mushroom: ["vegetables"],
    vinegar: ["daily_use"],
    tofu: ["vegetables", "daily_use"],
    bamboo_shoot: ["vegetables"],
    garlic: ["daily_use"],
    onion: ["vegetables", "daily_use"],
    starch: ["daily_use"],
    shrimp: ["daily_use"],
    duck: ["daily_use"],
    ginger: ["daily_use"],
  };

  // 查找NPC的礼物偏好（需要全局 NPC 数组）
  var npcPrefers = [];
  if (typeof NPCS !== "undefined") {
    var npc = NPCS.find(function (n) {
      return n.id === npcId;
    });
    if (npc && npc.giftPrefers) {
      npcPrefers = npc.giftPrefers;
    }
  }

  // 如果NPC没有偏好或没有NPCS数组，默认允许赠送
  if (npcPrefers.length === 0) return true;

  var giftCategories = item.isIngredient
    ? INGREDIENT_GIFT_MAP[item.id] || ["daily_use"]
    : EQUIPMENT_GIFT_MAP[item.id] || ["daily_use"];

  // 检查是否有重叠类别
  for (var i = 0; i < giftCategories.length; i++) {
    for (var j = 0; j < npcPrefers.length; j++) {
      if (giftCategories[i] === npcPrefers[j]) return true;
    }
  }
  return false;
}

// ====== 住所层级定义 ======
// 每层住所可在哪些地点升级（tier 0=露宿，任意地点）
// 各地点租金倍率：城中村=1.0(基准), 郊区=0.8(更便宜),
//   工业区=1.1, 大学城=1.0, 商业区=1.5(最贵), 科技园=1.3
const HOUSING_LOCATION_RENT_MOD = {
  slum: 1.0,
  suburb: 0.8,
  factoryZone: 1.1,
  construction: 1.2,
  school: 1.0,
  commercialDist: 1.6,
  techPark: 1.3,
  park: 1.0,
  wholesaleMarket: 1.1,
  entertainment: 1.4,
  hospital: 1.2,
  bank: 1.3,
  gov_office: 1.0,
  temple: 0.7,
  trainingCenter: 1.1,
};
// 哪些地点可以租到哪些档位的住所
// key=地点, value=可租的tier数组(不包括tier0, tier0任意地点都可)
const HOUSING_LOCATION_AVAIL = {
  slum: [1, 2, 3],
  suburb: [1, 2, 3, 5],
  commercialDist: [1, 2, 3, 4, 6],
  factoryZone: [1, 2, 3],
  construction: [1, 2],
  school: [1, 2, 3],
  techPark: [2, 3],
  park: [1, 2],
  wholesaleMarket: [1, 2],
  entertainment: [1, 2, 3],
  hospital: [1],
  bank: [2, 3],
  gov_office: [1],
  temple: [1],
  trainingCenter: [1, 2],
};
/** 计算指定地点、指定住所tier的实际租金 */
function getHousingRentAtLocation(locKey, tier) {
  if (tier <= 0) return 0;
  var baseRent = 0;
  var tData = HOUSING_TIERS[tier];
  if (tData) baseRent = tData.rent || 0;
  var mod = HOUSING_LOCATION_RENT_MOD[locKey] || 1.0;
  return Math.round(baseRent * mod);
}
/** 获取当前地点可选住所tier列表（不含tier0） */
function getAvailableHousingTiersAtLocation(locKey) {
  return HOUSING_LOCATION_AVAIL[locKey] || [1];
}
/** 获取地点中文名 */
function getLocationChineseName(locKey) {
  var loc = typeof getLocation === "function" ? getLocation(locKey) : null;
  return loc ? loc.name : locKey;
}

const HOUSING_TIERS = [
  {
    tier: 0,
    name: "露宿街头",
    cost: 0,
    rent: 0,
    capacity: 20,
    fatigueRecovery: 18,
    desc: "天为被，地为床。碰上刮风下雨就惨了。",
    icon: "🌃",
    hygieneBonus: 0,
    happinessBonus: 0,
    canCook: false,
    canBathe: false,
    canRest: false,
    homeType: "none",
    upgradeTip: "💡去城中村¥150升🛏️合租（遮风挡雨）",
  },
  {
    tier: 1,
    name: "合租床位",
    cost: 150,
    rent: 10,
    capacity: 50,
    fatigueRecovery: 55,
    hygieneBonus: 5,
    desc: "合租屋的一个床位，好歹有个遮风挡雨的地方。",
    icon: "🛏️",
    happinessBonus: 0,
    canCook: false,
    canBathe: false,
    canRest: true,
    homeType: "shared",
    upgradeTip: "💡去人才市场¥500升🚪单间（可做饭洗衣）",
  },
  {
    tier: 2,
    name: "单间",
    cost: 2000,
    rent: 35,
    capacity: 100,
    fatigueRecovery: 70,
    hygieneBonus: 10,
    happinessBonus: 5,
    desc: "独立小单间，有床有柜子，私密多了。",
    icon: "🚪",
    canCook: true,
    canBathe: true,
    canRest: true,
    homeType: "single",
    upgradeTip: "💡去中介¥1000升🏠一居室（独立卫浴）",
  },
  {
    tier: 3,
    name: "一居室",
    cost: 8000,
    rent: 80,
    capacity: 200,
    fatigueRecovery: 75,
    hygieneBonus: 15,
    happinessBonus: 10,
    desc: "正经的一室一厅，独立卫浴，生活质量质的飞跃。",
    icon: "🏠",
    canCook: true,
    canBathe: true,
    canRest: true,
    homeType: "full",
    upgradeTip: "💡去市中心¥6000升🏙️豪华公寓（健身房泳池）",
  },
  {
    tier: 4,
    name: "豪华公寓",
    cost: 6000,
    rent: 160,
    capacity: 400,
    fatigueRecovery: 95,
    hygieneBonus: 25,
    happinessBonus: 20,
    desc: "市中心高档公寓，健身房、游泳池一应俱全，人上人的住所。",
    icon: "🏙️",
    canCook: true,
    canBathe: true,
    canRest: true,
    homeType: "luxury",
    upgradeTip: "💡去郊区¥50000升🏡别墅（花园车库）",
  },
  {
    tier: 5,
    name: "别墅",
    cost: 50000,
    rent: 500,
    capacity: 1000,
    fatigueRecovery: 130,
    desc: "郊区独立别墅，花园、车库、书房一应俱全。真正的成功人士住所。",
    icon: "🏡",
    hygieneBonus: 40,
    happinessBonus: 30,
    canCook: true,
    canBathe: true,
    canRest: true,
    homeType: "villa",
    upgradeTip: "💡¥200000升🏰豪宅（私人电梯+江景）",
    extraFeatures: { canHostNPC: true, garden: true, garage: true },
    effects: {
      healthRecovery: 5,
      skillStudyBonus: 0.1,
      npcVisitBonus: 0.1,
    },
  },
  {
    tier: 6,
    name: "豪宅",
    cost: 200000,
    rent: 1200,
    capacity: 2000,
    fatigueRecovery: 180,
    desc: "市中心顶级豪宅，私人电梯、空中花园、270度江景。站在顶层俯瞰这座城市。",
    icon: "🏰",
    hygieneBonus: 60,
    happinessBonus: 50,
    canCook: true,
    canBathe: true,
    canRest: true,
    homeType: "mansion",
    extraFeatures: {
      canHostNPC: true,
      party: true,
      view: "panoramic",
      staff: true,
    },
    effects: {
      healthRecovery: 10,
      skillStudyBonus: 0.2,
      npcVisitBonus: 0.2,
      fameGain: 0.1,
    },
  },
];

/** 获取当前住所信息 */
function getCurrentHousing(state) {
  return HOUSING_TIERS[state.housing?.tier || 0] || HOUSING_TIERS[0];
}

/**
 * 验证食材在 ITEMS 和 GOODS 之间的价格一致性
 * 仅在开发环境（非生产）调用，防止数据不同步
 * @returns {Array<string>} 不一致项的警告列表
 */
function validateIngredientPrices() {
  var warnings = [];
  if (typeof GOODS === 'undefined') return warnings;
  for (var i = 0; i < ITEMS.length; i++) {
    var item = ITEMS[i];
    if (!item.isIngredient) continue;
    var good = null;
    for (var g = 0; g < GOODS.length; g++) {
      if (GOODS[g].id === item.id && GOODS[g].isIngredient) {
        good = GOODS[g];
        break;
      }
    }
    if (!good) continue;
    if (Math.abs(item.price - good.basePrice) > 0.01) {
      warnings.push(
        '食材价格不一致: ' + item.name + ' — ITEMS: ¥' + item.price + ', GOODS: ¥' + good.basePrice
      );
    }
  }
  if (warnings.length > 0 && typeof console !== 'undefined') {
    console.warn('[数据验证] 食材价格不一致(' + warnings.length + '项):', warnings);
  }
  return warnings;
}

// 自动执行验证（仅在非生产环境）
if (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') {
  setTimeout(validateIngredientPrices, 1000);
}

// [全系统自洽修复] 域A 联动增强#1: 食材价格同步验证函数 — 确保 ITEMS 与 GOODS 间食材价格一致

// P1-2 CLS 命名空间注册
if (typeof window.CLS !== 'undefined' && window.CLS.data) window.CLS.data.ITEMS = ITEMS;
// [R113] 域A 联动增强
// [R145] 域A 联动增强
// [R185] 域A 联动增强
// [R233] 域A 联动增强
// [R265] 域A
// [R361] 域A
