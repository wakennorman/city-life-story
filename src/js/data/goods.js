/**
 * 交易商品定义
 *
 * 商品格式: { id, name, basePrice, unit, category }
 * category: daily | food | luxury | clothing | electronics | scrap
 */

const GOODS = [
  {
    id: "water",
    name: "瓶装水",
    basePrice: 1.5,
    unit: "瓶",
    category: "daily",
  },
  {
    id: "instant_noodles",
    name: "方便面",
    basePrice: 4,
    unit: "袋",
    category: "food",
  },
  { id: "snacks", name: "零食", basePrice: 5, unit: "包", category: "food" },
  { id: "fruits", name: "水果", basePrice: 6, unit: "斤", category: "food" },
  {
    id: "vegetables",
    name: "蔬菜",
    basePrice: 3,
    unit: "斤",
    category: "food",
  },
  { id: "beer", name: "啤酒", basePrice: 4, unit: "瓶", category: "luxury" },
  {
    id: "cigarettes",
    name: "香烟",
    basePrice: 15,
    unit: "包",
    category: "luxury",
  },
  {
    id: "daily_use",
    name: "日用品",
    basePrice: 10,
    unit: "件",
    category: "daily",
  },
  {
    id: "clothing",
    name: "二手衣物",
    basePrice: 25,
    unit: "件",
    category: "clothing",
  },
  {
    id: "electronics",
    name: "小电子产品",
    basePrice: 80,
    unit: "个",
    category: "electronics",
  },
  {
    id: "scrap_metal",
    name: "废金属",
    basePrice: 2.5,
    unit: "斤",
    category: "scrap",
  },
  {
    id: "scrap_paper",
    name: "废纸板",
    basePrice: 0.8,
    unit: "斤",
    category: "scrap",
  },
  {
    id: "scrap_plastic",
    name: "废塑料",
    basePrice: 1.5,
    unit: "斤",
    category: "scrap",
  },

  // ============================================================
  // 食材（烹饪用）
  // ============================================================
  {
    id: "rice",
    name: "大米",
    basePrice: 5,
    unit: "斤",
    category: "food",
    isIngredient: true,
  },
  {
    id: "flour",
    name: "面粉",
    basePrice: 4,
    unit: "斤",
    category: "food",
    isIngredient: true,
  },
  {
    id: "noodles",
    name: "面条",
    basePrice: 3,
    unit: "袋",
    category: "food",
    isIngredient: true,
  },
  {
    id: "potato",
    name: "土豆",
    basePrice: 2,
    unit: "斤",
    category: "food",
    isIngredient: true,
  },
  {
    id: "bok_choy",
    name: "青菜",
    basePrice: 3,
    unit: "斤",
    category: "food",
    isIngredient: true,
  },
  {
    id: "cabbage",
    name: "白菜",
    basePrice: 2,
    unit: "斤",
    category: "food",
    isIngredient: true,
  },
  {
    id: "radish",
    name: "萝卜",
    basePrice: 2,
    unit: "斤",
    category: "food",
    isIngredient: true,
  },
  {
    id: "tomato",
    name: "番茄",
    basePrice: 3,
    unit: "斤",
    category: "food",
    isIngredient: true,
  },
  {
    id: "cucumber",
    name: "黄瓜",
    basePrice: 2,
    unit: "斤",
    category: "food",
    isIngredient: true,
  },
  {
    id: "pork",
    name: "猪肉",
    basePrice: 15,
    unit: "斤",
    category: "food",
    isIngredient: true,
  },
  {
    id: "beef",
    name: "牛肉",
    basePrice: 25,
    unit: "斤",
    category: "food",
    isIngredient: true,
  },
  {
    id: "chicken",
    name: "鸡肉",
    basePrice: 12,
    unit: "斤",
    category: "food",
    isIngredient: true,
  },
  {
    id: "fish",
    name: "鱼",
    basePrice: 18,
    unit: "条",
    category: "food",
    isIngredient: true,
  },
  {
    id: "salt",
    name: "盐",
    basePrice: 1,
    unit: "包",
    category: "food",
    isIngredient: true,
  },
  {
    id: "soy_sauce",
    name: "酱油",
    basePrice: 3,
    unit: "瓶",
    category: "food",
    isIngredient: true,
  },
  {
    id: "cooking_oil",
    name: "食用油",
    basePrice: 5,
    unit: "瓶",
    category: "food",
    isIngredient: true,
  },
  {
    id: "sugar",
    name: "糖",
    basePrice: 2,
    unit: "包",
    category: "food",
    isIngredient: true,
  },
  {
    id: "chili",
    name: "辣椒",
    basePrice: 2,
    unit: "包",
    category: "food",
    isIngredient: true,
  },
  {
    id: "egg",
    name: "鸡蛋",
    basePrice: 1,
    unit: "个",
    category: "food",
    isIngredient: true,
  },
  {
    id: "milk",
    name: "牛奶",
    basePrice: 3,
    unit: "盒",
    category: "food",
    isIngredient: true,
  },

  // ============================================================
  // 待完成：新增商品类别 — 参考《模拟人生》物品系统
  // 实现提示：在 GOODS 数组中追加，注意 isIngredient 字段区分食材
  // ============================================================
  // TODO: 待实现 - 书籍类
  // { id: "second_hand_book", name: "二手书", basePrice: 15, unit: "本", category: "books", desc: "可提升智力，随机获得技能XP" },
  // TODO: 待实现 - 鲜花类
  // { id: "carnation", name: "康乃馨", basePrice: 5, unit: "支", category: "flowers", desc: "送礼NPC增加好感，母亲节/教师节专用" },
  // { id: "rose", name: "玫瑰花", basePrice: 10, unit: "支", category: "flowers", desc: "情人节/七夕特殊礼物，表白必备" },
  // TODO: 待实现 - 药品类
  // { id: "cold_medicine", name: "感冒药", basePrice: 20, unit: "盒", category: "medicine", desc: "治疗感冒类疾病" },
  // { id: "painkiller", name: "止痛药", basePrice: 10, unit: "盒", category: "medicine", desc: "缓解疼痛，临时健康+5" },
  // { id: "vitamins", name: "维生素", basePrice: 25, unit: "瓶", category: "medicine", desc: "每日健康+1" },
  // TODO: 待实现 - 文具类
  // { id: "pen", name: "笔", basePrice: 3, unit: "支", category: "stationery", desc: "提升学习XP+5%" },
  // { id: "notebook_item", name: "笔记本", basePrice: 5, unit: "本", category: "stationery", desc: "记录信息，智力+1" },

  // ============================================================
  // 待完成：新增食材 — 参考《大多数》食材系统 + 真实菜市场
  // 实现提示：在 GOODS 数组中追加 isIngredient: true 的条目
  // ============================================================
  // TODO: 待实现 - 豆腐
  // { id: "tofu", name: "豆腐", basePrice: 3, unit: "块", category: "food", isIngredient: true, desc: "可做麻婆豆腐、豆腐汤" },
  // TODO: 待实现 - 蘑菇
  // { id: "mushroom", name: "蘑菇", basePrice: 4, unit: "斤", category: "food", isIngredient: true, desc: "可做蘑菇汤、炒蘑菇" },
  // TODO: 待实现 - 竹笋
  // { id: "bamboo_shoot", name: "竹笋", basePrice: 5, unit: "斤", category: "food", isIngredient: true, desc: "可做竹笋炒肉" },
  // TODO: 待实现 - 生菜
  // { id: "lettuce", name: "生菜", basePrice: 2, unit: "斤", category: "food", isIngredient: true, desc: "可做生菜包肉" },
  // TODO: 待实现 - 玉米
  // { id: "corn", name: "玉米", basePrice: 2, unit: "根", category: "food", isIngredient: true, desc: "可做玉米粥、蒸玉米" },
  // TODO: 待实现 - 洋葱
  // { id: "onion", name: "洋葱", basePrice: 2, unit: "斤", category: "food", isIngredient: true, desc: "做菜必备" },
  // TODO: 待实现 - 大蒜
  // { id: "garlic", name: "大蒜", basePrice: 2, unit: "斤", category: "food", isIngredient: true, desc: "提味增香" },
  // TODO: 待实现 - 生姜
  // { id: "ginger", name: "生姜", basePrice: 3, unit: "斤", category: "food", isIngredient: true, desc: "驱寒暖胃" },
  // TODO: 待实现 - 醋
  // { id: "vinegar", name: "醋", basePrice: 2, unit: "瓶", category: "food", isIngredient: true, desc: "调味必备" },
  // TODO: 待实现 - 淀粉
  // { id: "starch", name: "淀粉", basePrice: 2, unit: "袋", category: "food", isIngredient: true, desc: "勾芡用" },
  // TODO: 待实现 - 虾
  // { id: "shrimp", name: "虾", basePrice: 20, unit: "斤", category: "food", isIngredient: true, desc: "高蛋白，清蒸/油焖" },
  // TODO: 待实现 - 鸭子
  // { id: "duck", name: "鸭子", basePrice: 22, unit: "只", category: "food", isIngredient: true, desc: "可做烤鸭/炖鸭汤" },

  // ============================================================
  // 待完成：新增食谱 — 参考《大多数》烹饪系统
  // 实现提示：在 cooking.js 的 RECIPES 数组中追加
  // ============================================================
  // TODO: 待实现（20个新食谱）
  // { id: "mapo_tofu", name: "麻婆豆腐", ingredients: ["tofu", "pork", "chili", "soy_sauce"], skillRequired: 15, hungerRestore: 35, sellPrice: 25 },
  // { id: "mushroom_soup", name: "蘑菇汤", ingredients: ["mushroom", "tofu", "salt", "cooking_oil"], skillRequired: 10, hungerRestore: 25, sellPrice: 18 },
  // { id: "stir_fry_bamboo", name: "竹笋炒肉", ingredients: ["bamboo_shoot", "pork", "soy_sauce", "garlic"], skillRequired: 12, hungerRestore: 30, sellPrice: 22 },
  // { id: "corn_porridge", name: "玉米粥", ingredients: ["corn", "water", "sugar"], skillRequired: 5, hungerRestore: 15, sellPrice: 8 },
  // { id: "lettuce_wrap", name: "生菜包肉", ingredients: ["lettuce", "pork", "chili", "garlic"], skillRequired: 15, hungerRestore: 35, sellPrice: 28 },
  // { id: "steamed_shrimp", name: "清蒸虾", ingredients: ["shrimp", "ginger", "soy_sauce", "cooking_oil"], skillRequired: 20, hungerRestore: 40, sellPrice: 35 },
  // { id: "roast_duck", name: "烤鸭", ingredients: ["duck", "sugar", "soy_sauce", "star_anise"], skillRequired: 25, hungerRestore: 50, sellPrice: 50 },
  // { id: "stir_fry_lettuce", name: "清炒生菜", ingredients: ["lettuce", "garlic", "cooking_oil", "salt"], skillRequired: 8, hungerRestore: 20, sellPrice: 12 },
  // { id: "corn_steamed", name: "蒸玉米", ingredients: ["corn"], skillRequired: 3, hungerRestore: 18, sellPrice: 10 },
  // { id: "onion_beef", name: "洋葱炒牛肉", ingredients: ["onion", "beef", "soy_sauce", "ginger"], skillRequired: 18, hungerRestore: 40, sellPrice: 38 },
  // { id: "garlic_pork", name: "蒜蓉猪肉", ingredients: ["pork", "garlic", "soy_sauce", "cooking_oil"], skillRequired: 12, hungerRestore: 32, sellPrice: 26 },
  // { id: "ginger_duck_soup", name: "姜炖鸭汤", ingredients: ["duck", "ginger", "salt", "water"], skillRequired: 20, hungerRestore: 45, sellPrice: 42 },
  // { id: "vinegar_cucumber", name: "醋溜黄瓜", ingredients: ["cucumber", "vinegar", "garlic", "chili"], skillRequired: 10, hungerRestore: 22, sellPrice: 14 },
  // { id: "starch_meatballs", name: "淀粉肉丸", ingredients: ["pork", "starch", "soy_sauce", "salt"], skillRequired: 15, hungerRestore: 38, sellPrice: 30 },
  // { id: "mushroom_tofu_soup", name: "蘑菇豆腐汤", ingredients: ["mushroom", "tofu", "salt", "cooking_oil", "ginger"], skillRequired: 12, hungerRestore: 28, sellPrice: 20 },
  // { id: "bamboo_shrimp", name: "竹笋炒虾", ingredients: ["bamboo_shoot", "shrimp", "soy_sauce", "ginger"], skillRequired: 22, hungerRestore: 42, sellPrice: 40 },
  // { id: "lettuce_pork_soup", name: "生菜肉片汤", ingredients: ["lettuce", "pork", "salt", "cooking_oil"], skillRequired: 10, hungerRestore: 26, sellPrice: 18 },
  // { id: "corn_chicken_soup", name: "玉米鸡汤", ingredients: ["corn", "chicken", "salt", "ginger", "water"], skillRequired: 18, hungerRestore: 40, sellPrice: 35 },
  // { id: "stir_fry_mushroom", name: "炒蘑菇", ingredients: ["mushroom", "garlic", "soy_sauce", "cooking_oil"], skillRequired: 8, hungerRestore: 20, sellPrice: 15 },
  // { id: "simple_rice_porridge", name: "白粥", ingredients: ["rice", "water"], skillRequired: 1, hungerRestore: 12, sellPrice: 5 },
];

/** 获取商品定义 */
function getGoodById(goodId) {
  return GOODS.find((g) => g.id === goodId) || null;
}

/** 获取所有商品 ID */
function getAllGoodIds() {
  return GOODS.map((g) => g.id);
}
