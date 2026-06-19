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
];

/** 获取商品定义 */
function getGoodById(goodId) {
  return GOODS.find((g) => g.id === goodId) || null;
}

/** 获取所有商品 ID */
function getAllGoodIds() {
  return GOODS.map((g) => g.id);
}
