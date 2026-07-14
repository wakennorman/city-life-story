/**
 * 烹饪系统 — 食材 → 菜品
 *
 * 参考：Stardew Valley 烹饪系统、模拟人生烹饪技能
 *
 * 设计：
 *   - 食谱定义在 COOKING_RECIPES 数组中
 *   - 每个食谱包含所需食材列表、饱食恢复、效果、解锁条件
 *   - 烹饪需要消耗食材（从库存中扣除）
 *   - 烹饪技能 Lv.1-10，每级解锁新食谱
 *   - 菜品提供临时 Buff（持续数小时/天）
 */

// ====== 食谱定义 ======

const COOKING_RECIPES = [
  // --- Lv.1 初始食谱 ---
  {
    id: "white_rice",
    name: "白米饭",
    icon: "🍚",
    level: 1,
    ingredients: [{ itemId: "rice", amount: 1 }],
    hungerRestore: 30,
    effects: { happiness: 1 },
    duration: null,
    desc: "最简单的米饭，管饱。",
  },
  {
    id: "tomato_egg",
    name: "番茄炒蛋",
    icon: "🍅",
    level: 1,
    ingredients: [
      { itemId: "tomato", amount: 1 },
      { itemId: "egg", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 50,
    effects: { happiness: 3, physique: 1 },
    duration: null,
    desc: "经典家常菜，酸甜可口。",
  },
  {
    id: "boiled_egg",
    name: "水煮蛋",
    icon: "🥚",
    level: 1,
    ingredients: [{ itemId: "egg", amount: 1 }],
    hungerRestore: 20,
    effects: { physique: 1 },
    duration: null,
    desc: "简单健康，蛋白质满满。",
  },
  {
    id: "steamed_rice",
    name: "米饭配青菜",
    icon: "🍚",
    level: 1,
    ingredients: [
      { itemId: "rice", amount: 1 },
      { itemId: "bok_choy", amount: 1 },
      { itemId: "salt", amount: 1 },
    ],
    hungerRestore: 35,
    effects: { hygiene: 2, happiness: 2 },
    duration: null,
    desc: "清淡健康的一餐。",
  },

  // --- Lv.2 食谱 ---
  {
    id: "stir_fry_pork",
    name: "青菜炒肉",
    icon: "🥩",
    level: 2,
    ingredients: [
      { itemId: "bok_choy", amount: 1 },
      { itemId: "pork", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 60,
    effects: { physique: 1, happiness: 3 },
    duration: null,
    desc: "荤素搭配，营养均衡。",
  },
  {
    id: "noodle_soup",
    name: "清汤面",
    icon: "🍜",
    level: 2,
    ingredients: [
      { itemId: "noodles", amount: 1 },
      { itemId: "bok_choy", amount: 1 },
      { itemId: "salt", amount: 1 },
    ],
    hungerRestore: 45,
    effects: { fatigue: -3, happiness: 2 },
    duration: null,
    desc: "热腾腾的清汤面，暖胃暖心。",
  },
  {
    id: "milk",
    name: "热牛奶",
    icon: "🥛",
    level: 2,
    ingredients: [
      { itemId: "milk", amount: 1 },
      { itemId: "sugar", amount: 1 },
    ],
    hungerRestore: 25,
    effects: { fatigue: -5, happiness: 2 },
    duration: null,
    desc: "睡前喝杯热牛奶，助眠。",
  },

  // --- Lv.3 食谱 ---
  {
    id: "stewed_potato",
    name: "土豆炖肉",
    icon: "🥘",
    level: 3,
    ingredients: [
      { itemId: "potato", amount: 2 },
      { itemId: "pork", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "soy_sauce", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 70,
    effects: { physique: 2, happiness: 5 },
    duration: null,
    desc: "软糯的土豆配香浓的肉块，下饭神器。",
  },
  {
    id: "fried_rice",
    name: "蛋炒饭",
    icon: "🍚",
    level: 3,
    ingredients: [
      { itemId: "rice", amount: 1 },
      { itemId: "egg", amount: 1 },
      { itemId: "cabbage", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
      { itemId: "salt", amount: 1 },
    ],
    hungerRestore: 55,
    effects: { happiness: 4, physique: 1 },
    duration: null,
    desc: "香喷喷的蛋炒饭，简单却美味。",
  },

  // --- Lv.4 食谱 ---
  {
    id: "beef_stir_fry",
    name: "红烧牛肉",
    icon: "🥩",
    level: 4,
    ingredients: [
      { itemId: "beef", amount: 1 },
      { itemId: "potato", amount: 1 },
      { itemId: "soy_sauce", amount: 1 },
      { itemId: "sugar", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 80,
    effects: { physique: 2, happiness: 5, mental: 1 },
    duration: { hours: 4 },
    desc: "浓郁的红烧牛肉，补充体力。",
  },
  {
    id: "cucumber_salad",
    name: "凉拌黄瓜",
    icon: "🥒",
    level: 4,
    ingredients: [
      { itemId: "cucumber", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "vinegar", amount: 1 },
    ],
    hungerRestore: 20,
    effects: { hygiene: 3, happiness: 2 },
    duration: null,
    desc: "清爽开胃的凉拌菜。",
  },

  // --- Lv.5 食谱 ---
  {
    id: "chicken_soup",
    name: "鸡汤",
    icon: "🍲",
    level: 5,
    ingredients: [
      { itemId: "chicken", amount: 1 },
      { itemId: "radish", amount: 1 },
      { itemId: "salt", amount: 1 },
    ],
    hungerRestore: 65,
    effects: { health: 2, physique: 2, fatigue: -5 },
    duration: { hours: 6 },
    desc: "滋补鸡汤，恢复健康。",
  },
  {
    id: "steamed_fish",
    name: "清蒸鱼",
    icon: "🐟",
    level: 5,
    ingredients: [
      { itemId: "fish", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "soy_sauce", amount: 1 },
      { itemId: "ginger", amount: 1 },
    ],
    hungerRestore: 70,
    effects: { physique: 3, intelligence: 1 },
    duration: { hours: 4 },
    desc: "鲜嫩清蒸鱼，高蛋白低脂肪。",
  },

  // --- Lv.6 食谱 ---
  {
    id: "seafood_porridge",
    name: "海鲜粥",
    icon: "🥣",
    level: 6,
    ingredients: [
      { itemId: "rice", amount: 2 },
      { itemId: "fish", amount: 1 },
      { itemId: "bok_choy", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "ginger", amount: 1 },
    ],
    hungerRestore: 70,
    effects: { health: 2, fatigue: -3 },
    duration: { days: 3, effect: "healthRecovery", value: 2 },
    desc: "营养丰富的海鲜粥，连续3天每日健康+2。",
  },

  // --- Lv.7 食谱 ---
  {
    id: "hot_pot",
    name: "火锅",
    icon: "🍲",
    level: 7,
    ingredients: [
      { itemId: "pork", amount: 1 },
      { itemId: "cabbage", amount: 1 },
      { itemId: "radish", amount: 1 },
      { itemId: "chili", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 90,
    effects: { happiness: 10, physique: 2 },
    duration: { hours: 8 },
    desc: "热辣火锅，和朋友一起吃最开心。",
  },

  // --- Lv.8 食谱 ---
  {
    id: "braised_pork_rice",
    name: "红烧肉盖饭",
    icon: "🍚",
    level: 8,
    ingredients: [
      { itemId: "rice", amount: 2 },
      { itemId: "pork", amount: 2 },
      { itemId: "soy_sauce", amount: 1 },
      { itemId: "sugar", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 100,
    effects: { happiness: 8, physique: 3, fatigue: -5 },
    duration: { hours: 6 },
    desc: "肥而不腻的红烧肉盖在热米饭上，满足感爆棚。",
  },

  // --- Lv.9 食谱 ---
  {
    id: "full_banquet",
    name: "满汉全席",
    icon: "👑",
    level: 9,
    ingredients: [
      { itemId: "rice", amount: 2 },
      { itemId: "pork", amount: 1 },
      { itemId: "beef", amount: 1 },
      { itemId: "chicken", amount: 1 },
      { itemId: "fish", amount: 1 },
      { itemId: "bok_choy", amount: 1 },
      { itemId: "tomato", amount: 1 },
      { itemId: "egg", amount: 2 },
      { itemId: "milk", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "soy_sauce", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
      { itemId: "sugar", amount: 1 },
      { itemId: "chili", amount: 1 },
    ],
    hungerRestore: 150,
    effects: {
      happiness: 15,
      physique: 3,
      intelligence: 2,
      mental: 2,
      agility: 2,
    },
    duration: { days: 1, effect: "allStatsBoost", value: 3 },
    desc: "传说中的满汉全席！全属性+3，持续1天。需要大量食材和极高的烹饪技巧。",
  },

  // --- Lv.1 扩展食谱 ---
  {
    id: "corn_porridge",
    name: "玉米粥",
    icon: "🥣",
    level: 1,
    ingredients: [
      { itemId: "corn", amount: 1 },
      { itemId: "rice", amount: 1 },
      { itemId: "salt", amount: 1 },
    ],
    hungerRestore: 35,
    effects: { happiness: 1 },
    duration: null,
    desc: "清甜的玉米粥，暖胃醒神。",
  },
  {
    id: "stir_fry_lettuce",
    name: "清炒生菜",
    icon: "🥬",
    level: 1,
    ingredients: [
      { itemId: "lettuce", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 25,
    effects: { hygiene: 2, happiness: 1 },
    duration: null,
    desc: "脆嫩爽口的清炒生菜。",
  },
  {
    id: "corn_steamed",
    name: "蒸玉米",
    icon: "🌽",
    level: 1,
    ingredients: [{ itemId: "corn", amount: 1 }],
    hungerRestore: 25,
    effects: { physique: 1 },
    duration: null,
    desc: "原汁原味的蒸玉米，粗粮健康。",
  },
  {
    id: "simple_rice_porridge",
    name: "白粥",
    icon: "🥣",
    level: 1,
    ingredients: [
      { itemId: "rice", amount: 1 },
      { itemId: "salt", amount: 1 },
    ],
    hungerRestore: 20,
    effects: { fatigue: -3, happiness: 1 },
    duration: null,
    desc: "最简单的一碗粥，生病时吃最好。",
  },

  // --- Lv.2 扩展食谱 ---
  {
    id: "mushroom_soup",
    name: "蘑菇汤",
    icon: "🍄",
    level: 2,
    ingredients: [
      { itemId: "mushroom", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "egg", amount: 1 },
    ],
    hungerRestore: 40,
    effects: { physique: 1, happiness: 2 },
    duration: null,
    desc: "鲜美的蘑菇蛋花汤。",
  },
  {
    id: "lettuce_wrap",
    name: "生菜包肉",
    icon: "🥗",
    level: 2,
    ingredients: [
      { itemId: "lettuce", amount: 1 },
      { itemId: "pork", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "soy_sauce", amount: 1 },
    ],
    hungerRestore: 50,
    effects: { physique: 2, happiness: 2 },
    duration: null,
    desc: "生菜包裹着香嫩的肉片，清爽不腻。",
  },
  {
    id: "vinegar_cucumber",
    name: "醋溜黄瓜",
    icon: "🥒",
    level: 2,
    ingredients: [
      { itemId: "cucumber", amount: 1 },
      { itemId: "vinegar", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "sugar", amount: 1 },
    ],
    hungerRestore: 20,
    effects: { hygiene: 3, happiness: 2 },
    duration: null,
    desc: "酸甜爽脆的凉拌黄瓜。",
  },
  {
    id: "lettuce_pork_soup",
    name: "生菜肉片汤",
    icon: "🥩",
    level: 2,
    ingredients: [
      { itemId: "lettuce", amount: 1 },
      { itemId: "pork", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "ginger", amount: 1 },
    ],
    hungerRestore: 45,
    effects: { health: 1, fatigue: -3 },
    duration: null,
    desc: "清淡滋补的肉片汤，生病时来一碗。",
  },
  {
    id: "stir_fry_mushroom",
    name: "炒蘑菇",
    icon: "🍄",
    level: 2,
    ingredients: [
      { itemId: "mushroom", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 30,
    effects: { physique: 1, intelligence: 1 },
    duration: null,
    desc: "简单快手的素炒蘑菇，鲜美下饭。",
  },

  // --- Lv.3 扩展食谱 ---
  {
    id: "mapo_tofu",
    name: "麻婆豆腐",
    icon: "🥘",
    level: 3,
    ingredients: [
      { itemId: "tofu", amount: 1 },
      { itemId: "pork", amount: 1 },
      { itemId: "chili", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
      { itemId: "soy_sauce", amount: 1 },
    ],
    hungerRestore: 60,
    effects: { happiness: 5, physique: 1 },
    duration: null,
    desc: "麻辣鲜香的经典川菜，超级下饭。",
  },
  {
    id: "stir_fry_bamboo",
    name: "竹笋炒肉",
    icon: "🥬",
    level: 3,
    ingredients: [
      { itemId: "bamboo_shoot", amount: 1 },
      { itemId: "pork", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 55,
    effects: { physique: 2, happiness: 3 },
    duration: null,
    desc: "鲜嫩的竹笋搭配肉片，春意盎然。",
  },
  {
    id: "garlic_pork",
    name: "蒜蓉猪肉",
    icon: "🥩",
    level: 3,
    ingredients: [
      { itemId: "pork", amount: 1 },
      { itemId: "garlic", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 55,
    effects: { physique: 2, happiness: 3, fatigue: -3 },
    duration: null,
    desc: "蒜香浓郁的家常肉菜，吃了精神百倍。",
  },
  {
    id: "mushroom_tofu_soup",
    name: "蘑菇豆腐汤",
    icon: "🥣",
    level: 3,
    ingredients: [
      { itemId: "mushroom", amount: 1 },
      { itemId: "tofu", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "ginger", amount: 1 },
    ],
    hungerRestore: 40,
    effects: { health: 1, physique: 2 },
    duration: null,
    desc: "菌菇和豆腐的完美搭配，清淡养胃。",
  },

  // --- Lv.4 扩展食谱 ---
  {
    id: "onion_beef",
    name: "洋葱炒牛肉",
    icon: "🥩",
    level: 4,
    ingredients: [
      { itemId: "onion", amount: 1 },
      { itemId: "beef", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
      { itemId: "soy_sauce", amount: 1 },
    ],
    hungerRestore: 70,
    effects: { physique: 3, happiness: 3 },
    duration: { hours: 4 },
    desc: "洋葱的甜配合牛肉的嫩，补铁益气。",
  },
  {
    id: "starch_meatballs",
    name: "淀粉肉丸",
    icon: "🧆",
    level: 4,
    ingredients: [
      { itemId: "pork", amount: 1 },
      { itemId: "starch", amount: 1 },
      { itemId: "egg", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 65,
    effects: { physique: 2, happiness: 4 },
    duration: { hours: 4 },
    desc: "外酥里嫩的肉丸，一口一个满足。",
  },
  {
    id: "corn_chicken_soup",
    name: "玉米鸡汤",
    icon: "🍲",
    level: 4,
    ingredients: [
      { itemId: "corn", amount: 1 },
      { itemId: "chicken", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "ginger", amount: 1 },
    ],
    hungerRestore: 60,
    effects: { health: 2, physique: 2, fatigue: -5 },
    duration: { hours: 4 },
    desc: "鲜甜的玉米鸡汤，暖心暖胃。",
  },

  // --- Lv.5 扩展食谱 ---
  {
    id: "steamed_shrimp",
    name: "清蒸虾",
    icon: "🦐",
    level: 5,
    ingredients: [
      { itemId: "shrimp", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "ginger", amount: 1 },
      { itemId: "garlic", amount: 1 },
    ],
    hungerRestore: 65,
    effects: { physique: 3, agility: 2 },
    duration: { hours: 4 },
    desc: "鲜甜弹牙的清蒸虾，高蛋白低脂肪。",
  },
  {
    id: "ginger_duck_soup",
    name: "姜炖鸭汤",
    icon: "🍲",
    level: 5,
    ingredients: [
      { itemId: "duck", amount: 1 },
      { itemId: "ginger", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 75,
    effects: { health: 3, fatigue: -8, physique: 2 },
    duration: { hours: 6 },
    desc: "姜香浓郁的鸭汤，驱寒补身。",
  },

  // --- Lv.6 扩展食谱 ---
  {
    id: "roast_duck",
    name: "烤鸭",
    icon: "🦆",
    level: 6,
    ingredients: [
      { itemId: "duck", amount: 1 },
      { itemId: "sugar", amount: 1 },
      { itemId: "soy_sauce", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 85,
    effects: { happiness: 8, physique: 3 },
    duration: { hours: 6 },
    desc: "金黄酥脆的烤鸭，城市的味道。",
  },
  {
    id: "bamboo_shrimp",
    name: "竹笋炒虾",
    icon: "🦐",
    level: 6,
    ingredients: [
      { itemId: "bamboo_shoot", amount: 1 },
      { itemId: "shrimp", amount: 1 },
      { itemId: "salt", amount: 1 },
      { itemId: "cooking_oil", amount: 1 },
    ],
    hungerRestore: 70,
    effects: { physique: 3, agility: 3, happiness: 3 },
    duration: { hours: 4 },
    desc: "脆嫩竹笋配弹牙鲜虾，宴客佳品。",
  },

  // --- Lv.10 终极食谱 ---
  {
    id: "feast_of_life",
    name: "人生盛宴",
    icon: "✨",
    level: 10,
    ingredients: [
      { itemId: "rice", amount: 3 },
      { itemId: "pork", amount: 2 },
      { itemId: "beef", amount: 2 },
      { itemId: "chicken", amount: 2 },
      { itemId: "fish", amount: 2 },
      { itemId: "bok_choy", amount: 2 },
      { itemId: "tomato", amount: 2 },
      { itemId: "egg", amount: 3 },
      { itemId: "milk", amount: 2 },
      { itemId: "potato", amount: 2 },
      { itemId: "radish", amount: 1 },
      { itemId: "cabbage", amount: 1 },
      { itemId: "cucumber", amount: 1 },
      { itemId: "salt", amount: 2 },
      { itemId: "soy_sauce", amount: 2 },
      { itemId: "cooking_oil", amount: 2 },
      { itemId: "sugar", amount: 1 },
      { itemId: "chili", amount: 1 },
    ],
    hungerRestore: 200,
    effects: {
      happiness: 20,
      physique: 5,
      intelligence: 3,
      mental: 3,
      agility: 3,
      health: 5,
    },
    duration: { days: 2, effect: "allStatsBoost", value: 5 },
    desc: "人生巅峰的盛宴！全属性+5，持续2天。只有烹饪大师才能完成。",
  },
];

// ====== 工具函数 ======

/** 获取所有食谱 */
function getAllRecipes() {
  return COOKING_RECIPES;
}

/** 按烹饪技能等级获取可解锁的食谱 */
function getRecipesByLevel(level) {
  return COOKING_RECIPES.filter(function (r) {
    return r.level <= level;
  });
}

/** 获取单个食谱 */
function getRecipeById(id) {
  for (var i = 0; i < COOKING_RECIPES.length; i++) {
    if (COOKING_RECIPES[i].id === id) return COOKING_RECIPES[i];
  }
  return null;
}

/** 检查是否有足够食材 */
function canCookRecipe(recipe, inventory) {
  if (!inventory || !inventory.items) return false;
  var items = inventory.items;
  for (var i = 0; i < recipe.ingredients.length; i++) {
    var ing = recipe.ingredients[i];
    var itemInInventory = null;
    for (var j = 0; j < items.length; j++) {
      if (items[j].itemId === ing.itemId) {
        itemInInventory = items[j];
        break;
      }
    }
    if (!itemInInventory || itemInInventory.quantity < ing.amount) {
      return false;
    }
  }
  return true;
}

/** 执行烹饪：消耗食材，获得效果 */
function cookRecipe(state, recipeId) {
  var recipe = getRecipeById(recipeId);
  if (!recipe) return { success: false, message: "食谱不存在" };

  var inv = state.inventory || {};
  var items = inv.items || [];

  // 检查食材
  if (!canCookRecipe(recipe, inv)) {
    return { success: false, message: "食材不足" };
  }

  // 消耗食材
  for (var i = 0; i < recipe.ingredients.length; i++) {
    var ing = recipe.ingredients[i];
    for (var j = 0; j < items.length; j++) {
      if (items[j].itemId === ing.itemId) {
        items[j].quantity -= ing.amount;
        if (items[j].quantity <= 0) {
          items.splice(j, 1);
          j--;
        }
        break;
      }
    }
  }

  // 应用效果
  var effectsApplied = {};
  if (recipe.hungerRestore) {
    state.needs.hunger = Math.min(
      100,
      state.needs.hunger + recipe.hungerRestore,
    );
    effectsApplied.hunger = recipe.hungerRestore;
  }
  if (recipe.effects) {
    for (var key in recipe.effects) {
      if (recipe.effects.hasOwnProperty(key)) {
        var val = recipe.effects[key];
        if (key === "happiness") {
          state.needs.happiness = Math.min(100, state.needs.happiness + val);
        } else if (key === "fatigue") {
          state.needs.fatigue = Math.max(0, state.needs.fatigue + val);
        } else if (key === "health") {
          state.status.health = Math.min(100, state.status.health + val);
        } else if (key === "physique") {
          state.player.physique = Math.min(100, state.player.physique + val);
        } else if (key === "intelligence") {
          state.player.intelligence = Math.min(
            100,
            state.player.intelligence + val,
          );
        } else if (key === "mental") {
          state.player.mental = Math.min(100, state.player.mental + val);
        } else if (key === "agility") {
          state.player.agility = Math.min(100, state.player.agility + val);
        } else if (key === "hygiene") {
          state.needs.hygiene = Math.min(100, state.needs.hygiene + val);
        }
        effectsApplied[key] = val;
      }
    }
  }

  // 持续效果
  if (recipe.duration) {
    state.flags._cookingBuffs = state.flags._cookingBuffs || [];
    state.flags._cookingBuffs.push({
      recipeId: recipe.id,
      recipeName: recipe.name,
      icon: recipe.icon,
      effects: recipe.effects,
      duration: recipe.duration,
      appliedDay: state.player.day,
    });
    effectsApplied.duration = recipe.duration;
  }

  // [全系统自洽修复] 域A 修复:烹饪后记录经验值(调用onCookingCompleted)
  if (typeof onCookingCompleted === "function") {
    onCookingCompleted(state, recipe);
  }

  StateManager.addMessage(
    recipe.icon +
      " 你烹饪了「" +
      recipe.name +
      "」！" +
      (recipe.hungerRestore ? "饱食+" + recipe.hungerRestore : "") +
      (recipe.effects ? " 效果已应用" : ""),
    "success",
  );

  return { success: true, recipe: recipe, effects: effectsApplied };
}

/** 获取烹饪技能等级 */
function getCookingLevel(state) {
  var cookingExp = state.flags._cookingExp || 0;
  // 经验公式：Lv.1=0, Lv.2=100, Lv.3=250, Lv.4=450, Lv.5=700, Lv.6=1000, Lv.7=1350, Lv.8=1750, Lv.9=2200, Lv.10=2700
  var thresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700];
  for (var i = thresholds.length - 1; i >= 0; i--) {
    if (cookingExp >= thresholds[i]) return i + 1;
  }
  return 1;
}

/** 增加烹饪经验 */
function addCookingExp(state, amount) {
  state.flags._cookingExp = (state.flags._cookingExp || 0) + amount;
}

/** 记录一次烹饪行为（在 cookRecipe 成功后调用） */
function onCookingCompleted(state, recipe) {
  addCookingExp(state, 10 + recipe.level * 5);
  // 更新烹饪次数
  state.flags._cookingCount = (state.flags._cookingCount || 0) + 1;
}

// ====== 百科注册 ======
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.cooking_system = {
    id: "cooking_system",
    name: "烹饪系统",
    icon: "🍳",
    brief: "食材 → 菜品；烹饪技能Lv.1-10；菜品提供临时Buff",
    version: "1.2.0",
    related: ["items:ingredients", "mechanics:inventory"],
    sections: [
      {
        kind: "desc",
        text: "通过烹饪将食材转化为菜品，获得饱食恢复和临时效果。烹饪技能随烹饪次数提升，解锁更多食谱。",
      },
      {
        kind: "html",
        get: function () {
          var n = COOKING_RECIPES ? COOKING_RECIPES.length : 0;
          return (
            "<p>🍳 当前收录 <b>" +
            n +
            "</b> 种食谱（Lv.1-Lv.10）。前往 " +
            _wkLink("items", null, "🎒 物品/食材") +
            " 查看可用食材。</p>"
          );
        },
      },
      { kind: "subhead", text: "📊 食材分类" },
      {
        kind: "list",
        items: [
          "主食类：大米、面粉、面条、土豆",
          "蔬菜类：青菜、白菜、萝卜、番茄、黄瓜",
          "肉类：猪肉、牛肉、鸡肉、鱼",
          "调料类：盐、酱油、油、糖、辣椒",
          "蛋奶类：鸡蛋、牛奶",
        ],
      },
      { kind: "subhead", text: "🔄 食材保鲜" },
      {
        kind: "list",
        items: [
          "常温：按 perishDays 标注的天数",
          "冰箱（自住房）：+5天",
          "冷冻（自住房）：+15天",
        ],
      },
      { kind: "subhead", text: "💡 提示" },
      {
        kind: "tip",
        text: "在家做饭（amenity）会消耗食材。烹饪技能越高，解锁的食谱越强力。",
      },
    ],
  };
}
