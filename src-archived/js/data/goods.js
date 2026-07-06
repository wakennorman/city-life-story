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
];

/** 获取商品定义 */
function getGoodById(goodId) {
  return GOODS.find((g) => g.id === goodId) || null;
}

/** 获取所有商品 ID */
function getAllGoodIds() {
  return GOODS.map((g) => g.id);
}
