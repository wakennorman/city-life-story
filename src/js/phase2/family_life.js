/**
 * 家庭与生活系统 — Phase 2 深度交互
 *
 * 包含：
 * 1. 婚恋系统 — 约会、表白、恋爱、结婚
 * 2. 子女教育 — 出生、成长、升学、就业
 * 3. 父母养老 — 健康、医疗、陪伴、赡养
 * 4. 家庭生活 — 房贷、日常开销、家庭活动
 * 5. 人际关系 — 亲戚、朋友、邻居、社区
 */

// ====== 婚恋阶段 ======
const RELATIONSHIP_STAGES = {
  stranger: { name: "陌生人", icon: "❓", level: 0, interactions: ["偶遇"] },
  acquaintance: {
    name: "认识",
    icon: "👋",
    level: 20,
    interactions: ["聊天", "加微信"],
  },
  friend: {
    name: "朋友",
    icon: "🙂",
    level: 40,
    interactions: ["聊天", "吃饭", "看电影"],
  },
  good_friend: {
    name: "好朋友",
    icon: "👫",
    level: 60,
    interactions: ["聊天", "吃饭", "看电影", "约会"],
  },
  crush: {
    name: "暧昧",
    icon: "💕",
    level: 75,
    interactions: ["聊天", "吃饭", "看电影", "约会", "表白"],
  },
  dating: {
    name: "恋爱中",
    icon: "💑",
    level: 85,
    interactions: ["聊天", "吃饭", "看电影", "约会", "见家长"],
  },
  engaged: { name: "订婚", icon: "💍", level: 95, interactions: ["筹备婚礼"] },
  married: {
    name: "结婚",
    icon: "💒",
    level: 100,
    interactions: ["共同生活", "生育"],
  },
};

// ====== 配偶/伴侣类型 ======
const PARTNER_TYPES = {
  career_driven: {
    name: "事业型",
    icon: "💼",
    desc: "职场精英，收入高但忙碌",
    income: 20000,
    companionship: 20,
    traits: ["独立", "上进", "强势"],
  },
  gentle_home: {
    name: "温柔顾家",
    icon: "🏠",
    desc: "性格温和，擅长持家",
    income: 5000,
    companionship: 80,
    traits: ["温柔", "体贴", "传统"],
  },
  romantic: {
    name: "浪漫型",
    icon: "🌹",
    desc: "注重仪式感，情感丰富",
    income: 8000,
    companionship: 70,
    traits: ["浪漫", "感性", "依赖"],
  },
  intellectual: {
    name: "知性型",
    icon: "📚",
    desc: "学历高，谈吐优雅",
    income: 15000,
    companionship: 50,
    traits: ["知性", "理性", "独立"],
  },
  energetic: {
    name: "活力型",
    icon: "⚡",
    desc: "性格开朗，热爱运动",
    income: 6000,
    companionship: 60,
    traits: ["阳光", "活力", "直率"],
  },
  mysterious: {
    name: "神秘型",
    icon: "🌙",
    desc: "性格内敛，有故事",
    income: 10000,
    companionship: 40,
    traits: ["神秘", "敏感", "独特"],
  },
};

// ====== 子女成长阶段 ======
const CHILD_STAGES = {
  infant: {
    name: "婴儿",
    icon: "👶",
    age: [0, 2],
    needs: ["奶粉", "尿布", "陪伴"],
    education: "早教启蒙",
  },
  toddler: {
    name: "幼儿",
    icon: "🧒",
    age: [3, 5],
    needs: ["玩具", "绘本", "陪伴"],
    education: "幼儿园",
  },
  primary: {
    name: "小学生",
    icon: "📚",
    age: [6, 11],
    needs: ["学费", "课外班", "零花钱"],
    education: "小学",
  },
  middle: {
    name: "初中生",
    icon: "📖",
    age: [12, 14],
    needs: ["学费", "补习班", "零花钱"],
    education: "初中",
  },
  high: {
    name: "高中生",
    icon: "📝",
    age: [15, 17],
    needs: ["学费", "补习班", "生活费"],
    education: "高中",
  },
  university: {
    name: "大学生",
    icon: "🎓",
    age: [18, 22],
    needs: ["学费", "生活费"],
    education: "大学",
  },
  adult: {
    name: "成年人",
    icon: "👨",
    age: [23, 100],
    needs: ["独立"],
    education: "已独立",
  },
};

// ====== 父母健康状态 ======
const PARENT_HEALTH_STATES = {
  healthy: {
    name: "健康",
    icon: "✅",
    ageRange: [0, 60],
    medicalCost: 0,
    companionshipNeed: 10,
  },
  minor_illness: {
    name: "小病",
    icon: "🤒",
    ageRange: [55, 70],
    medicalCost: 500,
    companionshipNeed: 30,
  },
  chronic_illness: {
    name: "慢性病",
    icon: "💊",
    ageRange: [65, 80],
    medicalCost: 3000,
    companionshipNeed: 50,
  },
  serious_illness: {
    name: "重病",
    icon: "🏥",
    ageRange: [70, 90],
    medicalCost: 30000,
    companionshipNeed: 80,
  },
  critical: {
    name: "危重",
    icon: "🚨",
    ageRange: [75, 100],
    medicalCost: 100000,
    companionshipNeed: 100,
  },
};

// ====== 约会/恋爱事件 ======
const DATING_EVENTS = {
  first_meal: {
    name: "第一次吃饭",
    icon: "🍽️",
    cost: [100, 300],
    successChance: 0.7,
    relationshipGain: 5,
    desc: "第一次单独约会吃饭，紧张又期待",
  },
  movie_date: {
    name: "看电影",
    icon: "🎬",
    cost: [60, 120],
    successChance: 0.75,
    relationshipGain: 8,
    desc: "一起看电影，享受二人世界",
  },
  park_walk: {
    name: "公园散步",
    icon: "🌳",
    cost: [0, 20],
    successChance: 0.8,
    relationshipGain: 6,
    desc: "牵手漫步，感受微风",
  },
  cafe_chat: {
    name: "咖啡馆聊天",
    icon: "☕",
    cost: [50, 100],
    successChance: 0.85,
    relationshipGain: 10,
    desc: "安静地聊天，了解彼此",
  },
  trip: {
    name: "短途旅行",
    icon: "✈️",
    cost: [1000, 3000],
    successChance: 0.6,
    relationshipGain: 20,
    desc: "一起旅行，增进感情",
  },
  meet_parents: {
    name: "见家长",
    icon: "👨‍👩‍👧",
    cost: [500, 2000],
    successChance: 0.5,
    relationshipGain: 15,
    desc: "见对方父母，关系更进一步",
  },
  confession: {
    name: "表白",
    icon: "💌",
    cost: [200, 1000],
    successChance: 0.4,
    relationshipGain: 30,
    desc: "鼓起勇气表白，等待回应",
  },
};

/**
 * 初始化家庭系统
 */
function initFamilySystem(state) {
  if (!state.family) {
    state.family = {
      relationship: null,
      spouse: null,
      children: [],
      parents: {
        father: { age: 55, health: "healthy", name: "父亲" },
        mother: { age: 53, health: "healthy", name: "母亲" },
      },
      expenses: {
        monthlyMortgage: 0,
        monthlyLiving: 3000,
        monthlyChildren: 0,
        monthlyParents: 0,
      },
      events: [],
    };
  }
}

/**
 * 寻找约会对象
 */
function findDatingTarget(state, location) {
  const locations = {
    workplace: { pool: "同事", probability: 0.3 },
    social: { pool: "社交活动", probability: 0.4 },
    online: { pool: "社交软件", probability: 0.5 },
    friend_intro: { pool: "朋友介绍", probability: 0.6 },
    random: { pool: "偶遇", probability: 0.2 },
  };

  const loc = locations[location] || locations.random;

  if (Math.random() > loc.probability) {
    StateManager.addMessage(`在${loc.pool}没有遇到合适的人...`, "hint");
    return null;
  }

  const names = [
    "小雅",
    "小晴",
    "小雯",
    "小琳",
    "小婷",
    "小慧",
    "小蕾",
    "小琪",
    "小欣",
    "小怡",
    "小萱",
    "小颖",
    "小菲",
    "小静",
    "小美",
    "小丽",
    "小娜",
    "小燕",
    "小萍",
    "小芳",
  ];
  const partnerTypeKeys = Object.keys(PARTNER_TYPES);
  const typeKey =
    partnerTypeKeys[Math.floor(Math.random() * partnerTypeKeys.length)];
  const partnerType = PARTNER_TYPES[typeKey];
  const name = names[Math.floor(Math.random() * names.length)];

  const target = {
    id:
      "target_" +
      state.player.day +
      "_" +
      Math.random().toString(36).substr(2, 9),
    name: name,
    type: typeKey,
    typeData: partnerType,
    relationship: 20, // 初始认识
    stage: "acquaintance",
    lastInteraction: state.player.day,
    favoriteActivities: ["cafe_chat", "movie_date", "park_walk"],
  };

  state.family.datingTarget = target;
  StateManager.addMessage(
    `💕 在${loc.pool}认识了${name}（${partnerType.name}型）`,
    "success",
  );

  return target;
}

/**
 * 进行约会
 */
function goDating(state, eventId) {
  const target = state.family.datingTarget;
  if (!target) {
    return { success: false, message: "还没有约会对象" };
  }

  const event = DATING_EVENTS[eventId];
  if (!event) {
    return { success: false, message: "不存在的约会事件" };
  }

  // 检查阶段是否允许
  const stageOrder = [
    "acquaintance",
    "friend",
    "good_friend",
    "crush",
    "dating",
    "engaged",
    "married",
  ];
  const allowedStages = {
    first_meal: ["acquaintance", "friend", "good_friend"],
    movie_date: ["friend", "good_friend", "crush", "dating"],
    park_walk: ["friend", "good_friend", "crush", "dating"],
    cafe_chat: ["acquaintance", "friend", "good_friend", "crush", "dating"],
    trip: ["good_friend", "crush", "dating"],
    meet_parents: ["dating"],
    confession: ["crush"],
  };

  if (!allowedStages[eventId].includes(target.stage)) {
    return { success: false, message: `当前关系阶段还不适合${event.name}` };
  }

  // 检查费用
  const cost =
    event.cost[0] + Math.floor(Math.random() * (event.cost[1] - event.cost[0]));
  if (state.resources.cash < cost) {
    return { success: false, message: `现金不足，需要¥${cost}` };
  }

  state.resources.cash -= cost;

  // 计算成功率（基础成功率 + 关系加成）
  const relationshipBonus = (target.relationship / 100) * 0.3;
  const successChance = Math.min(0.95, event.successChance + relationshipBonus);

  if (Math.random() < successChance) {
    // 成功
    target.relationship = Math.min(
      100,
      target.relationship + event.relationshipGain,
    );
    target.lastInteraction = state.player.day;

    // 检查阶段升级
    checkRelationshipStage(target);

    StateManager.addMessage(
      `✅ ${event.icon} ${event.name}很成功！关系+${event.relationshipGain}`,
      "success",
    );

    // 检查是否进入下一阶段
    if (eventId === "confession" && target.relationship >= 85) {
      target.stage = "dating";
      StateManager.addMessage(`💑 你和${target.name}正式在一起了！`, "success");
    }

    return {
      success: true,
      relationship: target.relationship,
      stage: target.stage,
    };
  } else {
    // 失败
    target.relationship = Math.max(0, target.relationship - 5);
    StateManager.addMessage(
      `❌ ${event.icon} ${event.name}不太顺利...关系-5`,
      "warning",
    );
    return { success: false, relationship: target.relationship };
  }
}

/**
 * 检查关系阶段升级
 */
function checkRelationshipStage(target) {
  const oldStage = target.stage;

  if (target.relationship >= 100) target.stage = "married";
  else if (target.relationship >= 95) target.stage = "engaged";
  else if (target.relationship >= 85) target.stage = "dating";
  else if (target.relationship >= 75) target.stage = "crush";
  else if (target.relationship >= 60) target.stage = "good_friend";
  else if (target.relationship >= 40) target.stage = "friend";
  else if (target.relationship >= 20) target.stage = "acquaintance";
  else target.stage = "stranger";

  if (oldStage !== target.stage) {
    const stageData = RELATIONSHIP_STAGES[target.stage];
    StateManager.addMessage(`💕 关系升级为「${stageData.name}」！`, "success");
  }
}

/**
 * 结婚
 */
function getMarried(state) {
  const target = state.family.datingTarget;
  if (!target || target.stage !== "engaged") {
    return { success: false, message: "需要先订婚" };
  }

  const weddingCost = 50000 + Math.floor(Math.random() * 100000);
  if (state.resources.cash < weddingCost) {
    return { success: false, message: `婚礼需要¥${weddingCost}，现金不足` };
  }

  state.resources.cash -= weddingCost;

  state.family.spouse = {
    name: target.name,
    type: target.type,
    typeData: target.typeData,
    age: 25 + Math.floor(Math.random() * 5),
    income: target.typeData.income,
    relationship: 100,
    children: [],
    happiness: 80,
  };

  state.family.datingTarget = null;
  state.family.relationship = null;

  StateManager.addMessage(`💒 你和${target.name}结婚了！`, "success");

  // 更新家庭支出
  state.family.expenses.monthlyLiving += 2000; // 婚后生活成本增加

  return { success: true };
}

/**
 * 生育子女
 */
function haveChild(state) {
  const spouse = state.family.spouse;
  if (!spouse) {
    return { success: false, message: "需要先结婚" };
  }

  const birthCost = 5000 + Math.floor(Math.random() * 10000);
  if (state.resources.cash < birthCost) {
    return { success: false, message: `生育需要¥${birthCost}，现金不足` };
  }

  state.resources.cash -= birthCost;

  const names = [
    "宝宝",
    "小宝贝",
    "小天使",
    "小星星",
    "小阳光",
    "小花朵",
    "小可爱",
    "小宝贝",
  ];
  const genders = ["男", "女"];
  const gender = genders[Math.floor(Math.random() * genders.length)];
  const name = names[Math.floor(Math.random() * names.length)];

  const child = {
    id:
      "child_" +
      state.player.day +
      "_" +
      Math.random().toString(36).substr(2, 9),
    name: name,
    gender: gender,
    birthDay: state.player.day,
    age: 0,
    stage: "infant",
    intelligence: 50 + Math.floor(Math.random() * 30),
    personality: ["活泼", "安静", "内向", "外向", "敏感", "乐观"][
      Math.floor(Math.random() * 6)
    ],
    happiness: 80,
    health: 90,
    educationLevel: 0,
    interests: [],
  };

  state.family.children.push(child);
  spouse.children.push(child.id);

  // 更新家庭支出
  updateChildExpenses(state);

  StateManager.addMessage(
    `👶 你有了${gender === "男" ? "儿子" : "女儿"}${name}！`,
    "success",
  );

  return { success: true, child: child };
}

/**
 * 更新子女支出
 */
function updateChildExpenses(state) {
  let monthlyTotal = 0;

  for (const child of state.family.children) {
    const stage = getChildStage(child.age);
    if (stage) {
      monthlyTotal += getStageMonthlyCost(stage);
    }
  }

  state.family.expenses.monthlyChildren = monthlyTotal;
}

/**
 * 获取子女阶段
 */
function getChildStage(age) {
  for (const [key, stage] of Object.entries(CHILD_STAGES)) {
    if (age >= stage.age[0] && age <= stage.age[1]) {
      return key;
    }
  }
  return "adult";
}

/**
 * 获取阶段月花费
 */
function getStageMonthlyCost(stageKey) {
  const costs = {
    infant: 2000,
    toddler: 1500,
    primary: 1000,
    middle: 2000,
    high: 3000,
    university: 4000,
    adult: 0,
  };
  return costs[stageKey] || 0;
}

/**
 * 每日家庭更新
 */
function tickFamilyDaily(state) {
  const day = state.player.day;
  const family = state.family;

  if (!family) return;

  // 更新子女年龄
  for (const child of family.children) {
    const oldAge = child.age;
    child.age = (day - child.birthDay) / 365;

    if (oldAge < 1 && child.age >= 1) {
      StateManager.addMessage(`🎂 ${child.name}满1岁了！`, "event");
    }

    // 更新阶段
    const stageKey = getChildStage(Math.floor(child.age));
    if (stageKey !== child.stage) {
      child.stage = stageKey;
      const stage = CHILD_STAGES[stageKey];
      StateManager.addMessage(
        `📚 ${child.name}进入${stage.name}阶段（${stage.education}）`,
        "info",
      );
    }

    // 随机成长事件
    if (Math.random() < 0.05) {
      child.intelligence = Math.min(100, child.intelligence + 1);
      StateManager.addMessage(`📈 ${child.name}又聪明了一点（智力+1）`, "hint");
    }
  }

  // 更新父母健康
  if (family.parents) {
    const parents = family.parents;

    // 父母年龄增长
    parents.father.age++;
    parents.mother.age++;

    // 根据年龄更新健康状态
    updateParentHealth(parents.father);
    updateParentHealth(parents.mother);

    // 随机健康事件
    if (Math.random() < 0.02) {
      const parentKey = Math.random() < 0.5 ? "father" : "mother";
      const parent = parents[parentKey];
      StateManager.addMessage(
        `⚠️ ${parent.name}身体不太舒服，需要关注`,
        "warning",
      );
    }
  }

  // 更新配偶关系
  if (family.spouse) {
    const spouse = family.spouse;

    // 自然衰减（不互动的情况下）
    if (day - spouse.lastInteraction > 7) {
      spouse.relationship = Math.max(0, spouse.relationship - 1);
    }

    // 月度收入
    state.resources.cash += spouse.income;
    state.resources.totalEarned += spouse.income;
  }

  // 月度家庭支出
  if (day % 30 === 0) {
    const expenses = family.expenses;
    const totalMonthly =
      expenses.monthlyMortgage +
      expenses.monthlyLiving +
      expenses.monthlyChildren +
      expenses.monthlyParents;

    if (state.resources.cash >= totalMonthly) {
      state.resources.cash -= totalMonthly;
      StateManager.addMessage(
        `📊 本月家庭支出¥${totalMonthly.toLocaleString()}`,
        "hint",
      );
    } else {
      StateManager.addMessage(
        `⚠️ 家庭支出¥${totalMonthly.toLocaleString()}，现金不足！`,
        "warning",
      );
    }
  }
}

/**
 * 更新父母健康状态
 */
function updateParentHealth(parent) {
  const age = parent.age;

  if (age < 55) {
    parent.health = "healthy";
  } else if (age < 65) {
    parent.health = Math.random() < 0.3 ? "minor_illness" : "healthy";
  } else if (age < 75) {
    const rand = Math.random();
    if (rand < 0.3) parent.health = "healthy";
    else if (rand < 0.7) parent.health = "chronic_illness";
    else parent.health = "serious_illness";
  } else {
    const rand = Math.random();
    if (rand < 0.2) parent.health = "chronic_illness";
    else if (rand < 0.6) parent.health = "serious_illness";
    else parent.health = "critical";
  }
}

/**
 * 陪伴父母
 */
function accompanyParents(state, parentKey) {
  const parents = state.family.parents;
  const parent = parents[parentKey];
  if (!parent) return { success: false, message: "父母信息不存在" };

  const AP_COST = 15;
  if (state.player.actionPoints < AP_COST) {
    return { success: false, message: "行动力不足" };
  }

  state.player.actionPoints -= AP_COST;

  const healthState = PARENT_HEALTH_STATES[parent.health];
  parent.companionshipDays = (parent.companionshipDays || 0) + 1;

  StateManager.addMessage(
    `👨‍👦 陪伴${parent.name}，${healthState.name}状态，需要更多关心`,
    "info",
  );

  return { success: true };
}

/**
 * 带父母看病
 */
function takeParentToHospital(state, parentKey) {
  const parents = state.family.parents;
  const parent = parents[parentKey];
  if (!parent) return { success: false, message: "父母信息不存在" };

  const healthState = PARENT_HEALTH_STATES[parent.health];
  const cost = healthState.medicalCost;

  if (state.resources.cash < cost) {
    return {
      success: false,
      message: `治疗需要¥${cost.toLocaleString()}，现金不足`,
    };
  }

  state.resources.cash -= cost;

  // 治疗成功，健康改善
  const healthOrder = [
    "healthy",
    "minor_illness",
    "chronic_illness",
    "serious_illness",
    "critical",
  ];
  const currentIndex = healthOrder.indexOf(parent.health);
  if (currentIndex > 0) {
    parent.health = healthOrder[currentIndex - 1];
    StateManager.addMessage(
      `🏥 带${parent.name}看病，健康从${healthState.name}改善到${PARENT_HEALTH_STATES[parent.health].name}`,
      "success",
    );
  } else {
    StateManager.addMessage(
      `✅ ${parent.name}身体健康，定期检查很有必要`,
      "hint",
    );
  }

  return { success: true };
}

/**
 * 设置房贷
 */
function setMortgage(state, monthlyPayment) {
  state.family.expenses.monthlyMortgage = monthlyPayment;
  StateManager.addMessage(
    `🏠 房贷设置为每月¥${monthlyPayment.toLocaleString()}`,
    "info",
  );
  return { success: true };
}

/**
 * 家庭活动
 */
const FAMILY_ACTIVITIES = {
  family_dinner: {
    name: "家庭聚餐",
    icon: "🍲",
    cost: [200, 500],
    apCost: 20,
    happinessGain: 10,
    desc: "一家人一起吃顿好的",
  },
  park_outing: {
    name: "公园游玩",
    icon: "🌳",
    cost: [50, 150],
    apCost: 15,
    happinessGain: 8,
    desc: "带家人去公园散步游玩",
  },
  movie_night: {
    name: "家庭电影夜",
    icon: "🎬",
    cost: [100, 200],
    apCost: 10,
    happinessGain: 6,
    desc: "一起看部电影",
  },
  travel: {
    name: "家庭旅行",
    icon: "✈️",
    cost: [3000, 10000],
    apCost: 50,
    happinessGain: 25,
    desc: "带家人出去旅行",
  },
  home_renovate: {
    name: "家居改造",
    icon: "🔨",
    cost: [5000, 20000],
    apCost: 30,
    happinessGain: 15,
    desc: "装修房子，提升居住品质",
  },
};

function doFamilyActivity(state, activityId) {
  const activity = FAMILY_ACTIVITIES[activityId];
  if (!activity) return { success: false, message: "不存在的家庭活动" };

  // 检查行动力
  if (state.player.actionPoints < activity.apCost) {
    return { success: false, message: `需要${activity.apCost}点行动力` };
  }

  // 检查费用
  const cost =
    activity.cost[0] +
    Math.floor(Math.random() * (activity.cost[1] - activity.cost[0]));
  if (state.resources.cash < cost) {
    return { success: false, message: `需要¥${cost}，现金不足` };
  }

  state.player.actionPoints -= activity.apCost;
  state.resources.cash -= cost;

  // 应用效果
  if (state.family.spouse) {
    state.family.spouse.happiness = Math.min(
      100,
      (state.family.spouse.happiness || 80) + activity.happinessGain,
    );
  }

  for (const child of state.family.children) {
    child.happiness = Math.min(100, child.happiness + activity.happinessGain);
  }

  StateManager.addMessage(
    `👨‍👩‍👧‍👦 ${activity.icon} ${activity.name}！家人很开心`,
    "success",
  );

  return { success: true };
}

/**
 * 获取家庭摘要
 */
function getFamilySummary(state) {
  const family = state.family;
  if (!family) return null;

  const summary = {
    hasSpouse: !!family.spouse,
    spouseName: family.spouse?.name || null,
    childCount: family.children.length,
    parentsAlive: 0,
    parentsHealthy: 0,
    monthlyExpenses: 0,
  };

  if (family.parents) {
    for (const key of ["father", "mother"]) {
      const parent = family.parents[key];
      if (parent.age < 100) {
        summary.parentsAlive++;
        if (parent.health === "healthy") summary.parentsHealthy++;
      }
    }
  }

  summary.monthlyExpenses =
    family.expenses.monthlyMortgage +
    family.expenses.monthlyLiving +
    family.expenses.monthlyChildren +
    family.expenses.monthlyParents;

  return summary;
}

/**
 * 百科注册
 */
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.family_life = {
    id: "family_life",
    name: "家庭与生活",
    icon: "👨‍👩‍👧",
    brief: "婚恋系统、子女教育、父母养老、家庭生活、人际关系",
    version: "1.0.0",
    related: ["mechanics:main", "mechanics:needs"],
    sections: [
      {
        kind: "desc",
        text: "人生不只是奋斗，还有家人。家庭系统让你体验从单身到结婚、从二人世界到三口之家的完整人生旅程。",
      },
      {
        kind: "subhead",
        text: "💕 关系发展阶段",
      },
      {
        kind: "list",
        items: [
          "❓ 陌生人 → 👋 认识 → 🙂 朋友 → 👫 好朋友 → 💕 暧昧 → 💑 恋爱 → 💍 订婚 → 💒 结婚",
        ],
      },
      {
        kind: "subhead",
        text: "👶 子女成长阶段",
      },
      {
        kind: "list",
        items: [
          "👶 婴儿（0-2岁）：奶粉、尿布、陪伴",
          "🧒 幼儿（3-5岁）：幼儿园、玩具、绘本",
          "📚 小学生（6-11岁）：学费、课外班",
          "📖 初中生（12-14岁）：补习班、青春期",
          "📝 高中生（15-17岁）：高考压力、补习",
          "🎓 大学生（18-22岁）：学费、生活费",
          "👨 成年人（23岁+）：独立生活",
        ],
      },
      {
        kind: "subhead",
        text: "👴 父母健康等级",
      },
      {
        kind: "list",
        items: [
          "✅ 健康：无需特别照顾",
          "🤒 小病：偶尔感冒发烧，花费¥500",
          "💊 慢性病：高血压/糖尿病等，花费¥3000/月",
          "🏥 重病：需要住院治疗，花费¥30000+",
          "🚨 危重：生命垂危，花费¥100000+",
        ],
      },
      {
        kind: "tip",
        text: "💡 提示：陪伴是最长情的告白。多花时间陪伴家人，定期带父母体检，关注子女成长。家庭幸福是人生的重要组成部分。",
      },
    ],
  };
}
