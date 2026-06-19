/**
 * Amenities — 散落各地点的"状态恢复点"
 *
 * 每个 amenity 绑定一个地点 + 一个状态类型 + 一个 tier (1=贫 / 2=中 / 3=富)。
 * tier 越高：cost 越高、primary 恢复值上限越高、bonusPool 随机附加奖励越丰富。
 *
 * 标签字段（喂给 illness 系统的习惯追踪器）:
 *   - junkFood        : 垃圾食品（累计>=10次有概率得肠胃炎）
 *   - nutritious      : 营养均衡（每次抵消2点 junkFoodMeals 计数）
 *   - lateNight       : 夜生活（累计>=8次有概率得失眠症）
 *
 * 自住房用占位符 loc:"*selfLive"，运行时映射到 state 中的实际地点。
 */

const AMENITIES = [
  // ============================================================
  // 餐饮（恢复 hunger）
  // ============================================================
  {
    id: "slum_canteen",
    loc: "slum",
    type: "food",
    tier: 1,
    name: "城中村小食堂",
    icon: "🍚",
    cost: 6,
    ap: 5,
    primary: { hunger: 30 },
    bonusPool: [],
    junkFood: true,
    desc: "6块钱管饱，油大盐重，凑合一顿。",
  },
  {
    id: "construction_lunchbox",
    loc: "construction",
    type: "food",
    tier: 1,
    name: "工地盒饭",
    icon: "🥡",
    cost: 10,
    ap: 5,
    primary: { hunger: 32 },
    bonusPool: [],
    junkFood: true,
    desc: "工地附近的盒饭车，肉沫白菜配米饭。",
  },
  {
    id: "wholesale_noodle",
    loc: "wholesaleMarket",
    type: "food",
    tier: 2,
    name: "批发市场面馆",
    icon: "🍜",
    cost: 14,
    ap: 5,
    primary: { hunger: 45, happiness: 3 },
    bonusPool: [{ stat: "physique", chance: 0.05, amt: 0.2 }],
    desc: "老板娘的牛肉面，分量足，性价比尚可。",
  },
  {
    id: "factory_canteen",
    loc: "factoryZone",
    type: "food",
    tier: 2,
    name: "工厂食堂",
    icon: "🍱",
    cost: 12,
    ap: 5,
    primary: { hunger: 42, happiness: 2 },
    bonusPool: [{ stat: "physique", chance: 0.04, amt: 0.2 }],
    desc: "三菜一汤，标配饭量，吃饱不浪费。",
  },
  {
    id: "school_takeout",
    loc: "school",
    type: "food",
    tier: 2,
    name: "大学城外卖",
    icon: "🍱",
    cost: 18,
    ap: 5,
    primary: { hunger: 40, happiness: 5 },
    bonusPool: [{ stat: "happiness", chance: 0.1, amt: 3 }],
    desc: "学生街的小炒，年轻人最爱。",
  },
  {
    id: "park_streetfood",
    loc: "park",
    type: "food",
    tier: 2,
    name: "公园小吃摊",
    icon: "🌭",
    cost: 12,
    ap: 5,
    primary: { hunger: 35, happiness: 4 },
    bonusPool: [],
    junkFood: true,
    desc: "烤串、烤肠、煎饼果子，夜市的诱惑。",
  },
  {
    id: "commercial_restaurant",
    loc: "commercialDist",
    type: "food",
    tier: 3,
    name: "商业区中餐馆",
    icon: "🍽️",
    cost: 35,
    ap: 8,
    primary: { hunger: 65, happiness: 10 },
    bonusPool: [
      { stat: "physique", chance: 0.15, amt: 0.5 },
      { stat: "happiness", chance: 0.25, amt: 5 },
    ],
    nutritious: true,
    desc: "荤素搭配，营养均衡，吃完精神百倍。",
  },
  {
    id: "techpark_brunch",
    loc: "techPark",
    type: "food",
    tier: 3,
    name: "科技园轻食",
    icon: "🥗",
    cost: 35,
    ap: 8,
    primary: { hunger: 60, happiness: 8 },
    bonusPool: [
      { stat: "physique", chance: 0.18, amt: 0.6 },
      { stat: "intelligence", chance: 0.1, amt: 0.3 },
    ],
    nutritious: true,
    desc: "藜麦三文鱼沙拉，互联网精英的标配午餐。",
  },
  {
    id: "selfhome_cook",
    loc: "*selfLive",
    type: "food",
    tier: 3,
    name: "在家做饭",
    icon: "🍳",
    cost: 12,
    ap: 10,
    primary: { hunger: 55, happiness: 5 },
    bonusPool: [
      { stat: "physique", chance: 0.12, amt: 0.4 },
      { stat: "happiness", chance: 0.2, amt: 4 },
    ],
    nutritious: true,
    desc: "自己买菜下厨，干净卫生，省钱又健康。（需消耗食材）",
    requiresIngredients: true,
    useRecipeSelection: true,
  },

  // ============================================================
  // 沐浴（恢复 hygiene）
  // ============================================================
  {
    id: "slum_publicbath",
    loc: "slum",
    type: "bath",
    tier: 1,
    name: "城中村公共澡堂",
    icon: "🛁",
    cost: 8,
    ap: 8,
    primary: { hygiene: 35 },
    bonusPool: [],
    desc: "热水管够，人多点，但便宜。",
  },
  {
    id: "factory_shower",
    loc: "factoryZone",
    type: "bath",
    tier: 2,
    name: "工厂浴室",
    icon: "🚿",
    cost: 8,
    ap: 6,
    primary: { hygiene: 40 },
    bonusPool: [],
    desc: "下班后顺路冲个澡，工人福利。",
  },
  {
    id: "school_shower",
    loc: "school",
    type: "bath",
    tier: 2,
    name: "大学城澡堂",
    icon: "🚿",
    cost: 10,
    ap: 6,
    primary: { hygiene: 42, happiness: 2 },
    bonusPool: [],
    desc: "学校配套澡堂，干净整洁。",
  },
  {
    id: "commercial_spa",
    loc: "commercialDist",
    type: "bath",
    tier: 3,
    name: "商业区高级SPA",
    icon: "🧖",
    cost: 50,
    ap: 12,
    primary: { hygiene: 60, fatigue: -25, happiness: 12 },
    bonusPool: [
      { stat: "physique", chance: 0.18, amt: 0.6 },
      { stat: "happiness", chance: 0.3, amt: 6 },
      { stat: "mental", chance: 0.12, amt: 0.4 },
    ],
    desc: "精油按摩+蒸桑拿，身心都得到净化。",
  },
  {
    id: "techpark_gymshower",
    loc: "techPark",
    type: "bath",
    tier: 3,
    name: "科技园健身房淋浴",
    icon: "🚿",
    cost: 20,
    ap: 8,
    primary: { hygiene: 50, fatigue: -10 },
    bonusPool: [{ stat: "physique", chance: 0.12, amt: 0.4 }],
    desc: "刷一下健身卡顺便淋浴，互联网人省时之选。",
  },
  {
    id: "selfhome_bath",
    loc: "*selfLive",
    type: "bath",
    tier: 3,
    name: "在家洗澡",
    icon: "🛀",
    cost: 2,
    ap: 6,
    primary: { hygiene: 50, happiness: 4 },
    bonusPool: [{ stat: "happiness", chance: 0.15, amt: 3 }],
    desc: "自家浴室，热水自由，泡到舒服为止。（水电费¥2）",
  },

  // ============================================================
  // 娱乐（恢复 happiness）
  // ============================================================
  {
    id: "park_chat",
    loc: "park",
    type: "fun",
    tier: 1,
    name: "公园闲坐",
    icon: "🪑",
    cost: 0,
    ap: 8,
    primary: { happiness: 18, fatigue: -5 },
    bonusPool: [],
    desc: "晒晒太阳，看老人下棋，心情慢慢好起来。",
  },
  {
    id: "slum_chesssquare",
    loc: "slum",
    type: "fun",
    tier: 1,
    name: "城中村棋牌摊",
    icon: "♟️",
    cost: 5,
    ap: 10,
    primary: { happiness: 20 },
    bonusPool: [{ stat: "intelligence", chance: 0.05, amt: 0.2 }],
    desc: "和大爷下两盘象棋，赢了请烟，输了听吹牛。",
  },
  {
    id: "school_arcade",
    loc: "school",
    type: "fun",
    tier: 2,
    name: "大学城游戏厅",
    icon: "🕹️",
    cost: 18,
    ap: 12,
    primary: { happiness: 30, fatigue: 5 },
    bonusPool: [{ stat: "agility", chance: 0.1, amt: 0.3 }],
    lateNight: true,
    desc: "拳皇、街霸、跳舞机，年轻人的解压圣地。",
  },
  {
    id: "factory_karaoke",
    loc: "factoryZone",
    type: "fun",
    tier: 2,
    name: "工业区KTV",
    icon: "🎤",
    cost: 25,
    ap: 15,
    primary: { happiness: 35, fatigue: 5, hunger: -8 },
    bonusPool: [{ stat: "fame", chance: 0.08, amt: 1 }],
    lateNight: true,
    desc: "工人大哥的下班嗨歌局，酒过三巡情绪高涨。",
  },
  {
    id: "commercial_cinema",
    loc: "commercialDist",
    type: "fun",
    tier: 3,
    name: "商业区电影院",
    icon: "🎬",
    cost: 45,
    ap: 12,
    primary: { happiness: 45, fatigue: -10 },
    bonusPool: [
      { stat: "intelligence", chance: 0.1, amt: 0.3 },
      { stat: "mental", chance: 0.15, amt: 0.4 },
    ],
    desc: "IMAX 大片，爆米花配可乐，沉浸2小时不想出来。",
  },
  {
    id: "commercial_bar",
    loc: "commercialDist",
    type: "fun",
    tier: 3,
    name: "商业区酒吧",
    icon: "🍸",
    cost: 70,
    ap: 18,
    primary: { happiness: 50, fatigue: 10, hunger: -10 },
    bonusPool: [
      { stat: "fame", chance: 0.15, amt: 2 },
      { stat: "happiness", chance: 0.2, amt: 8 },
    ],
    lateNight: true,
    junkFood: true,
    desc: "鸡尾酒、小食拼盘、霓虹灯光，但喝多明天难受。",
  },

  // ============================================================
  // 休息（恢复 fatigue）— 主要靠住所睡觉，这里是白天小憩
  // ============================================================
  {
    id: "park_nap",
    loc: "park",
    type: "rest",
    tier: 1,
    name: "公园长椅小憩",
    icon: "😴",
    cost: 0,
    ap: 10,
    primary: { fatigue: -20 },
    bonusPool: [],
    desc: "找张长椅躺一会，蚊子可能多点。",
  },
  {
    id: "slum_napshop",
    loc: "slum",
    type: "rest",
    tier: 1,
    name: "城中村钟点房",
    icon: "🛏️",
    cost: 10,
    ap: 12,
    primary: { fatigue: -28 },
    bonusPool: [],
    desc: "5块钱一小时，简陋但能躺平。",
  },
  {
    id: "school_studyroom",
    loc: "school",
    type: "rest",
    tier: 2,
    name: "大学城自习室小憩",
    icon: "📚",
    cost: 5,
    ap: 10,
    primary: { fatigue: -22, happiness: 2 },
    bonusPool: [{ stat: "intelligence", chance: 0.05, amt: 0.2 }],
    desc: "趴在书桌上眯一会，醒来还能学一会。",
  },
  {
    id: "techpark_napcapsule",
    loc: "techPark",
    type: "rest",
    tier: 3,
    name: "科技园午睡舱",
    icon: "🛌",
    cost: 20,
    ap: 8,
    primary: { fatigue: -40, happiness: 5 },
    bonusPool: [
      { stat: "mental", chance: 0.15, amt: 0.5 },
      { stat: "intelligence", chance: 0.08, amt: 0.3 },
    ],
    desc: "高科技睡眠舱，30分钟顶3小时。",
  },
  {
    id: "selfhome_nap",
    loc: "*selfLive",
    type: "rest",
    tier: 3,
    name: "在家休息",
    icon: "🛏️",
    cost: 1,
    ap: 12,
    primary: { fatigue: -32, happiness: 3 },
    bonusPool: [{ stat: "mental", chance: 0.1, amt: 0.3 }],
    desc: "自家床铺，躺到不想起。（水电费¥1）",
  },
];

// ====== 查询/工具函数 ======

/** 获取自住房所在地点 key（无自住房则返回 null） */
function getSelfLiveLocKey(state) {
  if (!state || !state.investment) return null;
  var pid = state.investment.selfLivePropertyId;
  if (pid == null) return null;
  var props = state.investment.properties || [];
  for (var i = 0; i < props.length; i++) {
    if (props[i].id === pid || props[i].instanceId === pid) {
      return props[i].loc || null;
    }
  }
  return null;
}

/** 获取在指定地点可用的 amenities（按 type 过滤可选） */
function getAmenitiesAtLoc(locKey, type) {
  var state = null;
  try {
    state = StateManager && StateManager.getState && StateManager.getState();
  } catch (e) {
    state = null;
  }
  var selfLoc = state ? getSelfLiveLocKey(state) : null;
  var result = [];
  for (var i = 0; i < AMENITIES.length; i++) {
    var a = AMENITIES[i];
    var matchLoc =
      a.loc === locKey || (a.loc === "*selfLive" && selfLoc === locKey);
    if (!matchLoc) continue;
    if (type && a.type !== type) continue;
    result.push(a);
  }
  return result;
}

/** 获取所有地点中能提供 type 的 amenities，按距离当前位置排序（最近优先） */
function getNearestAmenitiesByType(state, type, limit) {
  limit = limit || 3;
  var curLoc = (state && state.trade && state.trade.currentLocation) || "slum";
  var selfLoc = getSelfLiveLocKey(state);

  // 收集所有候选 + 计算距离
  var candidates = [];
  for (var i = 0; i < AMENITIES.length; i++) {
    var a = AMENITIES[i];
    if (a.type !== type) continue;
    var actualLoc = a.loc === "*selfLive" ? selfLoc : a.loc;
    if (!actualLoc) continue; // 自住房未拥有则跳过
    var hops =
      typeof getLocationHops === "function"
        ? getLocationHops(curLoc, actualLoc)
        : actualLoc === curLoc
          ? 0
          : 99;
    candidates.push({ amenity: a, actualLoc: actualLoc, hops: hops });
  }

  // 按 hops 升序，同距离再按 tier 降序（同距离优先选好的）
  candidates.sort(function (a, b) {
    if (a.hops !== b.hops) return a.hops - b.hops;
    return (b.amenity.tier || 0) - (a.amenity.tier || 0);
  });

  return candidates.slice(0, limit);
}

/** 获取 amenity 数据（按 id） */
function getAmenityById(id) {
  for (var i = 0; i < AMENITIES.length; i++) {
    if (AMENITIES[i].id === id) return AMENITIES[i];
  }
  return null;
}

/** 类型 → 中文标签 */
function getAmenityTypeName(type) {
  return (
    {
      food: "饥饱",
      bath: "卫生",
      fun: "心情",
      rest: "疲劳",
    }[type] || type
  );
}

/** 类型 → 图标 */
function getAmenityTypeIcon(type) {
  return (
    {
      food: "🍚",
      bath: "🛁",
      fun: "🎭",
      rest: "🛏️",
    }[type] || "✨"
  );
}
