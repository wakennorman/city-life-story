/**
 * 装备/道具定义
 */

const ITEMS = [
  {
    id: "straw_hat",
    name: "草帽",
    slot: "head",
    effects: { hygiene: 2 },
    price: 10,
  },
  {
    id: "work_gloves",
    name: "劳保手套",
    slot: "hand",
    effects: { physique: 3, injury: -0.02 },
    price: 15,
  },
  {
    id: "mask",
    name: "口罩",
    slot: "head",
    effects: { hygiene: 5, illness: -0.03 },
    price: 5,
  },
  {
    id: "sturdy_shoes",
    name: "解放鞋",
    slot: "feet",
    effects: { agility: 3, fatigue: -5 },
    price: 25,
  },
  {
    id: "backpack",
    name: "大背包",
    slot: "accessory",
    effects: { capacity: 10 },
    price: 40,
  },
  {
    id: "work_uniform",
    name: "工作服",
    slot: "body",
    effects: { hygiene: 3, fame: 2 },
    price: 35,
  },
  {
    id: "safety_helmet",
    name: "安全帽",
    slot: "head",
    effects: { injury: -0.05 },
    price: 20,
  },
  {
    id: "smartphone",
    name: "智能手机",
    slot: "accessory",
    effects: { intelligence: 2, fame: 3 },
    price: 500,
  },
  {
    id: "bicycle",
    name: "自行车",
    slot: null,
    effects: { agility: 5, fatigue_reduction: 10 },
    price: 200,
  },
  {
    id: "cert_exam_book",
    name: "考证教材",
    slot: null,
    effects: { skillStudy: 1.5 },
    price: 30,
  },
  // 背包（商业区购买，扩容背包）
  {
    id: "backpack_basic",
    name: "帆布背包",
    slot: "accessory",
    effects: { capacity: 5 },
    price: 50,
    icon: "🎒",
  },
  {
    id: "backpack_large",
    name: "大号旅行包",
    slot: "accessory",
    effects: { capacity: 15 },
    price: 150,
    icon: "🎒",
  },
  {
    id: "backpack_pro",
    name: "专业登山包",
    slot: "accessory",
    effects: { capacity: 30 },
    price: 400,
    icon: "🎒",
  },
];

function getItemById(itemId) {
  return ITEMS.find((i) => i.id === itemId) || null;
}

// ====== 住所层级定义 ======
const HOUSING_TIERS = [
  {
    tier: 0,
    name: "露宿街头",
    cost: 0,
    rent: 0,
    capacity: 20,
    fatigueRecovery: 15,
    desc: "天为被，地为床。碰上刮风下雨就惨了。",
    icon: "🌃",
    hygieneBonus: 0,
    happinessBonus: 0,
  },
  {
    tier: 1,
    name: "合租床位",
    cost: 300,
    rent: 12,
    capacity: 50,
    fatigueRecovery: 25,
    hygieneBonus: 5,
    desc: "城中村合租屋的一个床位，好歹有个遮风挡雨的地方。",
    icon: "🛏️",
    happinessBonus: 0,
  },
  {
    tier: 2,
    name: "单间",
    cost: 800,
    rent: 25,
    capacity: 100,
    fatigueRecovery: 35,
    hygieneBonus: 10,
    happinessBonus: 5,
    desc: "独立小单间，有床有柜子，私密多了。",
    icon: "🚪",
  },
  {
    tier: 3,
    name: "一居室",
    cost: 2000,
    rent: 50,
    capacity: 200,
    fatigueRecovery: 50,
    hygieneBonus: 15,
    happinessBonus: 10,
    desc: "正经的一室一厅，独立卫浴，生活质量质的飞跃。",
    icon: "🏠",
  },
];

/** 获取当前住所信息 */
function getCurrentHousing(state) {
  return HOUSING_TIERS[state.housing?.tier || 0] || HOUSING_TIERS[0];
}
