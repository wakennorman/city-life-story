/**
 * 食材系统 — 食材定义、烹饪配方、食材消耗
 *
 * 食材分类：
 *   - 主食类：大米、面粉、面条
 *   - 蔬菜类：青菜、白菜、土豆、西红柿、鸡蛋
 *   - 肉类：猪肉、鸡肉、牛肉、鱼
 *   - 调料类：盐、酱油、糖、辣椒、姜蒜
 *   - 水果类：苹果、香蕉、橘子
 *
 * 烹饪配方：
 *   - 简单料理：番茄炒蛋、青椒肉丝、鸡蛋汤
 *   - 家常料理：红烧肉、麻婆豆腐、宫保鸡丁
 *   - 高级料理：鱼香肉丝、糖醋里脊、清蒸鱼
 *
 * 食材消耗机制：
 *   - 在家做饭时消耗对应食材
 *   - 食材有保质期，过期变质
 *   - 烹饪技能越高，成功率越高，产出越好
 */

// ====== 食材定义 ======
const INGREDIENTS = [
  // 主食类
  {
    id: "rice",
    name: "大米",
    category: "grain",
    unit: "斤",
    basePrice: 3,
    shelfLife: 30, // 保质期（天）
    nutrition: { hunger: 30, energy: 15 },
  },
  {
    id: "flour",
    name: "面粉",
    category: "grain",
    unit: "斤",
    basePrice: 3,
    shelfLife: 30,
    nutrition: { hunger: 25, energy: 12 },
  },
  {
    id: "noodles",
    name: "挂面",
    category: "grain",
    unit: "把",
    basePrice: 2,
    shelfLife: 45,
    nutrition: { hunger: 20, energy: 10 },
  },

  // 蔬菜类
  {
    id: "green_veg",
    name: "青菜",
    category: "vegetable",
    unit: "斤",
    basePrice: 2,
    shelfLife: 5,
    nutrition: { hunger: 8, vitamins: 10 },
  },
  {
    id: "cabbage",
    name: "白菜",
    category: "vegetable",
    unit: "斤",
    basePrice: 1.5,
    shelfLife: 7,
    nutrition: { hunger: 10, vitamins: 8 },
  },
  {
    id: "potato",
    name: "土豆",
    category: "vegetable",
    unit: "斤",
    basePrice: 1.5,
    shelfLife: 14,
    nutrition: { hunger: 15, vitamins: 5 },
  },
  {
    id: "tomato",
    name: "西红柿",
    category: "vegetable",
    unit: "斤",
    basePrice: 2.5,
    shelfLife: 5,
    nutrition: { hunger: 6, vitamins: 12 },
  },
  {
    id: "egg",
    name: "鸡蛋",
    category: "protein",
    unit: "个",
    basePrice: 1,
    shelfLife: 10,
    nutrition: { hunger: 12, protein: 15, energy: 8 },
  },

  // 肉类
  {
    id: "pork",
    name: "猪肉",
    category: "meat",
    unit: "斤",
    basePrice: 15,
    shelfLife: 5,
    nutrition: { hunger: 25, protein: 20, energy: 25 },
  },
  {
    id: "chicken",
    name: "鸡肉",
    category: "meat",
    unit: "斤",
    basePrice: 12,
    shelfLife: 5,
    nutrition: { hunger: 22, protein: 18, energy: 20 },
  },
  {
    id: "beef",
    name: "牛肉",
    category: "meat",
    unit: "斤",
    basePrice: 25,
    shelfLife: 5,
    nutrition: { hunger: 30, protein: 25, energy: 30 },
  },
  {
    id: "fish",
    name: "鱼",
    category: "meat",
    unit: "条",
    basePrice: 10,
    shelfLife: 3,
    nutrition: { hunger: 20, protein: 22, energy: 15 },
  },

  // 调料类
  {
    id: "salt",
    name: "盐",
    category: "condiment",
    unit: "袋",
    basePrice: 2,
    shelfLife: 365,
    nutrition: {},
  },
  {
    id: "soy_sauce",
    name: "酱油",
    category: "condiment",
    unit: "瓶",
    basePrice: 5,
    shelfLife: 180,
    nutrition: {},
  },
  {
    id: "sugar",
    name: "白糖",
    category: "condiment",
    unit: "袋",
    basePrice: 4,
    shelfLife: 365,
    nutrition: { energy: 5 },
  },
  {
    id: "chili",
    name: "辣椒",
    category: "condiment",
    unit: "斤",
    basePrice: 3,
    shelfLife: 7,
    nutrition: { vitamins: 3 },
  },
  {
    id: "ginger_garlic",
    name: "姜蒜",
    category: "condiment",
    unit: "份",
    basePrice: 2,
    shelfLife: 10,
    nutrition: {},
  },

  // 水果类
  {
    id: "apple",
    name: "苹果",
    category: "fruit",
    unit: "个",
    basePrice: 3,
    shelfLife: 10,
    nutrition: { hunger: 5, vitamins: 8 },
  },
  {
    id: "banana",
    name: "香蕉",
    category: "fruit",
    unit: "根",
    basePrice: 2,
    shelfLife: 7,
    nutrition: { hunger: 8, energy: 10 },
  },
  {
    id: "orange",
    name: "橘子",
    category: "fruit",
    unit: "个",
    basePrice: 2.5,
    shelfLife: 8,
    nutrition: { hunger: 4, vitamins: 15 },
  },

  // 补充食材（配方中引用但未定义的）
  {
    id: "tofu",
    name: "豆腐",
    category: "vegetable",
    unit: "块",
    basePrice: 3,
    shelfLife: 3,
    nutrition: { hunger: 15, protein: 10 },
  },
  {
    id: "peanut",
    name: "花生",
    category: "condiment",
    unit: "两",
    basePrice: 4,
    shelfLife: 30,
    nutrition: { hunger: 8, protein: 5 },
  },
  {
    id: "vinegar",
    name: "醋",
    category: "condiment",
    unit: "瓶",
    basePrice: 4,
    shelfLife: 180,
    nutrition: {},
  },
];

// ====== 烹饪配方 ======
const RECIPES = [
  // 简单料理（烹饪技能 1-20）
  {
    id: "tomato_egg",
    name: "番茄炒蛋",
    icon: "🍅",
    minSkill: 1,
    ingredients: [
      { id: "tomato", qty: 1 },
      { id: "egg", qty: 2 },
      { id: "salt", qty: 1 },
    ],
    effects: { hunger: -40, happiness: +5, energy: +5 },
    cookTime: 5, // AP消耗
    desc: "家常菜，简单又下饭。",
  },
  {
    id: "egg_soup",
    name: "鸡蛋汤",
    icon: "🥣",
    minSkill: 1,
    ingredients: [
      { id: "egg", qty: 2 },
      { id: "green_veg", qty: 0.5 },
      { id: "salt", qty: 1 },
    ],
    effects: { hunger: -25, happiness: +2 },
    cookTime: 3,
    desc: "清淡暖胃。",
  },
  {
    id: "boiled_rice",
    name: "白米饭",
    icon: "🍚",
    minSkill: 1,
    ingredients: [{ id: "rice", qty: 1 }],
    effects: { hunger: -35, energy: +10 },
    cookTime: 3,
    desc: "最基础的饱腹。",
  },
  {
    id: "noodle_soup",
    name: "清汤面",
    icon: "🍜",
    minSkill: 1,
    ingredients: [
      { id: "noodles", qty: 1 },
      { id: "green_veg", qty: 0.5 },
      { id: "salt", qty: 1 },
    ],
    effects: { hunger: -30, happiness: +3 },
    cookTime: 4,
    desc: "简单的一碗面。",
  },

  // 家常料理（烹饪技能 21-50）
  {
    id: "pepper_pork",
    name: "青椒肉丝",
    icon: "🥩",
    minSkill: 21,
    ingredients: [
      { id: "pork", qty: 1 },
      { id: "green_veg", qty: 1 },
      { id: "salt", qty: 1 },
      { id: "soy_sauce", qty: 1 },
    ],
    effects: { hunger: -55, happiness: +10, energy: +15 },
    cookTime: 8,
    desc: "经典家常菜，营养均衡。",
  },
  {
    id: "braised_pork",
    name: "红烧肉",
    icon: "🍖",
    minSkill: 25,
    ingredients: [
      { id: "pork", qty: 2 },
      { id: "sugar", qty: 1 },
      { id: "soy_sauce", qty: 1 },
    ],
    effects: { hunger: -60, happiness: +15, energy: +20 },
    cookTime: 10,
    desc: "肥而不腻，入口即化。",
  },
  {
    id: "mapo_tofu",
    name: "麻婆豆腐",
    icon: "🌶️",
    minSkill: 22,
    ingredients: [
      { id: "tofu", qty: 1 },
      { id: "pork", qty: 0.5 },
      { id: "chili", qty: 1 },
      { id: "soy_sauce", qty: 1 },
    ],
    effects: { hunger: -50, happiness: +12, energy: +10 },
    cookTime: 8,
    desc: "麻辣鲜香，超级下饭。",
  },
  {
    id: "stir_fry_cabbage",
    name: "手撕白菜",
    icon: "🥬",
    minSkill: 20,
    ingredients: [
      { id: "cabbage", qty: 1 },
      { id: "pork", qty: 0.3 },
      { id: "salt", qty: 1 },
    ],
    effects: { hunger: -35, happiness: +5 },
    cookTime: 5,
    desc: "清淡爽口。",
  },

  // 高级料理（烹饪技能 51-80）
  {
    id: "fish_fragrance_pork",
    name: "鱼香肉丝",
    icon: "🐟",
    minSkill: 51,
    ingredients: [
      { id: "pork", qty: 1.5 },
      { id: "cabbage", qty: 1 },
      { id: "soy_sauce", qty: 1 },
      { id: "vinegar", qty: 1 },
      { id: "chili", qty: 1 },
    ],
    effects: { hunger: -65, happiness: +18, energy: +20 },
    cookTime: 12,
    desc: "酸甜微辣，风味独特。",
  },
  {
    id: "sweet_sour_pork",
    name: "糖醋里脊",
    icon: "🍯",
    minSkill: 55,
    ingredients: [
      { id: "pork", qty: 2 },
      { id: "sugar", qty: 2 },
      { id: "vinegar", qty: 1 },
    ],
    effects: { hunger: -70, happiness: +20, energy: +25 },
    cookTime: 15,
    desc: "外酥里嫩，酸甜可口。",
  },
  {
    id: "steamed_fish",
    name: "清蒸鱼",
    icon: "🐠",
    minSkill: 50,
    ingredients: [
      { id: "fish", qty: 1 },
      { id: "ginger_garlic", qty: 1 },
      { id: "soy_sauce", qty: 1 },
    ],
    effects: { hunger: -60, happiness: +15, energy: +18, protein: +10 },
    cookTime: 12,
    desc: "原汁原味，营养丰富。",
  },
  {
    id: "kung_pao_chicken",
    name: "宫保鸡丁",
    icon: "🥜",
    minSkill: 52,
    ingredients: [
      { id: "chicken", qty: 1.5 },
      { id: "peanut", qty: 0.5 },
      { id: "chili", qty: 2 },
      { id: "soy_sauce", qty: 1 },
    ],
    effects: { hunger: -65, happiness: +18, energy: +22 },
    cookTime: 12,
    desc: "香辣酸甜，口感丰富。",
  },

  // 顶级料理（烹饪技能 81+）
  {
    id: "beef_stir_fry",
    name: "黑椒牛柳",
    icon: "🥩",
    minSkill: 81,
    ingredients: [
      { id: "beef", qty: 2 },
      { id: "green_veg", qty: 1 },
      { id: "soy_sauce", qty: 1 },
    ],
    effects: { hunger: -80, happiness: +25, energy: +30, protein: +15 },
    cookTime: 15,
    desc: "顶级享受，肉质鲜嫩。",
  },
  {
    id: "hot_pot",
    name: "火锅",
    icon: "🍲",
    minSkill: 80,
    ingredients: [
      { id: "beef", qty: 2 },
      { id: "pork", qty: 1 },
      { id: "green_veg", qty: 2 },
      { id: "potato", qty: 1 },
      { id: "chili", qty: 2 },
    ],
    effects: { hunger: -90, happiness: +35, energy: +30 },
    cookTime: 20,
    desc: "亲朋好友围坐，热气腾腾。",
  },
];

/** 食材分类 */
const INGREDIENT_CATEGORIES = {
  grain: { name: "主食", icon: "🌾" },
  vegetable: { name: "蔬菜", icon: "🥬" },
  meat: { name: "肉类", icon: "🥩" },
  protein: { name: "蛋白", icon: "🥚" },
  condiment: { name: "调料", icon: "🧂" },
  fruit: { name: "水果", icon: "🍎" },
};

/** 获取食材定义 */
function getIngredient(ingredientId) {
  return INGREDIENTS.find((i) => i.id === ingredientId);
}

/** 获取所有食材 */
function getAllIngredients() {
  return INGREDIENTS;
}

/** 获取所有配方 */
function getAllRecipes() {
  return RECIPES;
}

/** 获取单个配方 */
function getRecipe(recipeId) {
  return RECIPES.find((r) => r.id === recipeId);
}

/** 获取可用配方（根据烹饪技能和现有食材） */
function getAvailableRecipes(state) {
  const cookingLevel = state.skills?.cooking?.level || 0;
  const inventory = state.inventory?.ingredients || {};

  return RECIPES.filter((recipe) => {
    if (recipe.minSkill > cookingLevel) return false;
    // 检查食材是否足够
    for (const ing of recipe.ingredients) {
      const haveQty = inventory[ing.id]?.qty || 0;
      if (haveQty < ing.qty) return false;
    }
    return true;
  });
}

/** 检查食材是否过期 */
function isIngredientExpired(ingredient, buyDay) {
  const def = getIngredient(ingredient.id);
  if (!def) return true;
  const state = StateManager?.getState?.();
  if (!state) return true;
  return state.player.day - buyDay > def.shelfLife;
}

// 全局导出
if (typeof window !== "undefined") {
  Object.assign(window, {
    INGREDIENTS,
    INGREDIENT_CATEGORIES,
    RECIPES,
    getIngredient,
    getRecipe,
    getAllIngredients,
    getAllRecipes,
    getAvailableRecipes,
    isIngredientExpired,
  });
}
