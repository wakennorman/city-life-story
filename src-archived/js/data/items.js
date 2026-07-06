/**
 * 装备/道具定义
 */

const ITEMS = [
  {
    id: "straw_hat",
    name: "草帽",
    slot: "head",
    effects: { hygiene: 3, fatigue_reduction: 2 },
    price: 8,
  },
  {
    id: "work_gloves",
    name: "劳保手套",
    slot: "hand",
    effects: { physique: 2, injury: -0.03 },
    price: 12,
  },
  {
    id: "mask",
    name: "口罩",
    slot: "head",
    effects: { hygiene: 8, illness: -0.05 },
    price: 3,
  },
  {
    id: "sturdy_shoes",
    name: "解放鞋",
    slot: "feet",
    effects: { agility: 2, fatigue: -8, injury: -0.02 },
    price: 20,
  },
  {
    id: "backpack",
    name: "大背包",
    slot: "accessory",
    effects: { capacity: 15 },
    price: 35,
  },
  {
    id: "work_uniform",
    name: "工作服",
    slot: "body",
    effects: { hygiene: 5, fame: 2, illness: -0.02 },
    price: 28,
  },
  {
    id: "safety_helmet",
    name: "安全帽",
    slot: "head",
    effects: { injury: -0.08, fatigue_reduction: 3 },
    price: 15,
  },
  {
    id: "smartphone",
    name: "智能手机",
    slot: "accessory",
    effects: { intelligence: 3, fame: 3, sales: 2 },
    price: 400,
  },
  {
    id: "bicycle",
    name: "自行车",
    slot: null,
    effects: { agility: 8, fatigue_reduction: 15, travel_speed: 1 },
    price: 150,
  },
  {
    id: "cert_exam_book",
    name: "考证教材",
    slot: null,
    effects: { skillStudy: 2 },
    price: 25,
  },
];

function getItemById(itemId) {
  return ITEMS.find((i) => i.id === itemId) || null;
}
