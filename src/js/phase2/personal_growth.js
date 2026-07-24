/**
 * 个人成长系统 — Phase 2 深度交互
 *
 * 包含：
 * 1. 兴趣爱好 — 技能学习、等级提升、社交圈子
 * 2. 健康管理 — 运动、饮食、睡眠、体检
 * 3. 心理状态 — 压力、焦虑、抑郁、心理咨询
 * 4. 个人形象 — 穿搭、护肤、健身、整容
 * 5. 终身学习 — 读书、课程、考证、游学
 * 6. 人生目标 — 梦想追踪、里程碑、成就反馈
 */

// ====== 兴趣爱好定义 ======
const HOBBY_CATEGORIES = {
  sports: {
    name: "运动健身",
    icon: "🏃",
    hobbies: [
      {
        id: "running",
        name: "跑步",
        icon: "🏃",
        baseCost: 0,
        baseAP: 10,
        benefits: ["健康+2", "压力-3", "身材+1"],
      },
      {
        id: "gym",
        name: "健身房",
        icon: "🏋️",
        baseCost: 100,
        baseAP: 15,
        benefits: ["身材+3", "健康+1", "压力-2"],
      },
      {
        id: "yoga",
        name: "瑜伽",
        icon: "🧘",
        baseCost: 80,
        baseAP: 12,
        benefits: ["身心平衡+3", "压力-5", "健康+1"],
      },
      {
        id: "swimming",
        name: "游泳",
        icon: "🏊",
        baseCost: 50,
        baseAP: 15,
        benefits: ["健康+3", "压力-4", "身材+2"],
      },
      {
        id: "basketball",
        name: "篮球",
        icon: "🏀",
        baseCost: 0,
        baseAP: 20,
        benefits: ["健康+2", "社交+2", "压力-3"],
      },
      {
        id: "tennis",
        name: "网球",
        icon: "🎾",
        baseCost: 150,
        baseAP: 20,
        benefits: ["健康+2", "社交+3", "身材+2"],
      },
      {
        id: "cycling",
        name: "骑行",
        icon: "🚴",
        baseCost: 0,
        baseAP: 15,
        benefits: ["健康+2", "压力-3", "视野+1"],
      },
      {
        id: "hiking",
        name: "徒步",
        icon: "🥾",
        baseCost: 50,
        baseAP: 25,
        benefits: ["健康+2", "压力-5", "视野+2"],
      },
    ],
  },
  arts: {
    name: "艺术文化",
    icon: "🎨",
    hobbies: [
      {
        id: "reading",
        name: "阅读",
        icon: "📚",
        baseCost: 30,
        baseAP: 10,
        benefits: ["智力+2", "视野+2", "压力-2"],
      },
      {
        id: "painting",
        name: "绘画",
        icon: "🎨",
        baseCost: 100,
        baseAP: 15,
        benefits: ["创造力+3", "压力-4", "审美+2"],
      },
      {
        id: "music",
        name: "音乐",
        icon: "🎵",
        baseCost: 80,
        baseAP: 12,
        benefits: ["审美+2", "压力-5", "心情+2"],
      },
      {
        id: "photography",
        name: "摄影",
        icon: "📷",
        baseCost: 150,
        baseAP: 15,
        benefits: ["审美+3", "创造力+2", "社交+1"],
      },
      {
        id: "writing",
        name: "写作",
        icon: "✍️",
        baseCost: 20,
        baseAP: 15,
        benefits: ["智力+2", "创造力+2", "表达+2"],
      },
      {
        id: "calligraphy",
        name: "书法",
        icon: "🖌️",
        baseCost: 50,
        baseAP: 12,
        benefits: ["审美+2", "耐心+3", "压力-3"],
      },
      {
        id: "dance",
        name: "舞蹈",
        icon: "💃",
        baseCost: 100,
        baseAP: 18,
        benefits: ["身材+2", "审美+2", "自信+2"],
      },
      {
        id: "acting",
        name: "表演",
        icon: "🎭",
        baseCost: 120,
        baseAP: 20,
        benefits: ["表达+3", "自信+3", "社交+2"],
      },
    ],
  },
  learning: {
    name: "学习提升",
    icon: "📖",
    hobbies: [
      {
        id: "coding",
        name: "编程学习",
        icon: "💻",
        baseCost: 50,
        baseAP: 20,
        benefits: ["技能+3", "智力+2", "收入潜力+1"],
      },
      {
        id: "english",
        name: "英语学习",
        icon: "🌐",
        baseCost: 80,
        baseAP: 15,
        benefits: ["技能+2", "视野+2", "收入潜力+1"],
      },
      {
        id: "finance",
        name: "金融学习",
        icon: "📈",
        baseCost: 100,
        baseAP: 15,
        benefits: ["投资能力+3", "智力+1", "收入潜力+2"],
      },
      {
        id: "cooking_class",
        name: "烹饪课",
        icon: "🍳",
        baseCost: 150,
        baseAP: 15,
        benefits: ["生活技能+3", "心情+2", "健康+1"],
      },
      {
        id: "public_speaking",
        name: "演讲",
        icon: "🎤",
        baseCost: 100,
        baseAP: 15,
        benefits: ["表达+3", "自信+3", "职场+2"],
      },
      {
        id: "management",
        name: "管理课程",
        icon: "👔",
        baseCost: 200,
        baseAP: 15,
        benefits: ["领导力+3", "职场+2", "收入潜力+1"],
      },
    ],
  },
  social: {
    name: "社交娱乐",
    icon: "🎉",
    hobbies: [
      {
        id: "board_games",
        name: "桌游",
        icon: "🎲",
        baseCost: 50,
        baseAP: 15,
        benefits: ["社交+3", "智力+1", "心情+2"],
      },
      {
        id: "cards",
        name: "扑克",
        icon: "🃏",
        baseCost: 30,
        baseAP: 10,
        benefits: ["社交+2", "智力+1", "心情+1"],
      },
      {
        id: "mahjong",
        name: "麻将",
        icon: "🀄",
        baseCost: 50,
        baseAP: 15,
        benefits: ["社交+3", "智力+1", "心情+2"],
      },
      {
        id: "chess",
        name: "棋类",
        icon: "♟️",
        baseCost: 30,
        baseAP: 12,
        benefits: ["智力+3", "耐心+2", "压力-2"],
      },
      {
        id: "gaming",
        name: "游戏",
        icon: "🎮",
        baseCost: 50,
        baseAP: 10,
        benefits: ["心情+3", "压力-5", "社交+1"],
      },
      {
        id: "travel",
        name: "旅行",
        icon: "✈️",
        baseCost: 1000,
        baseAP: 30,
        benefits: ["视野+5", "心情+5", "压力-5"],
      },
    ],
  },
  wellness: {
    name: "身心健康",
    icon: "🧘",
    hobbies: [
      {
        id: "meditation",
        name: "冥想",
        icon: "🧘",
        baseCost: 0,
        baseAP: 10,
        benefits: ["压力-5", "焦虑-3", "身心平衡+3"],
      },
      {
        id: "spa",
        name: "SPA",
        icon: "💆",
        baseCost: 300,
        baseAP: 15,
        benefits: ["压力-5", "心情+3", "形象+1"],
      },
      {
        id: "massage",
        name: "按摩",
        icon: "💆‍♂️",
        baseCost: 200,
        baseAP: 12,
        benefits: ["疲劳-5", "压力-3", "健康+1"],
      },
      {
        id: "therapy",
        name: "心理咨询",
        icon: "👂",
        baseCost: 500,
        baseAP: 20,
        benefits: ["焦虑-5", "抑郁-5", "心理+5"],
      },
      {
        id: "sleep_therapy",
        name: "睡眠改善",
        icon: "😴",
        baseCost: 100,
        baseAP: 5,
        benefits: ["疲劳-5", "健康+2", "心情+1"],
      },
    ],
  },
};

// ====== 健康指标 ======
const HEALTH_INDICATORS = {
  physical: {
    name: "身体健康",
    icon: "💪",
    factors: ["体重", "血压", "血糖", "血脂", "心肺功能"],
    checkFrequency: 365, // 每年检查
  },
  mental: {
    name: "心理健康",
    icon: "🧠",
    factors: ["压力", "焦虑", "抑郁", "情绪稳定", "睡眠质量"],
    checkFrequency: 180, // 每半年
  },
  metabolic: {
    name: "代谢健康",
    icon: "⚖️",
    factors: ["BMI", "体脂率", "腰围", "基础代谢"],
    checkFrequency: 180,
  },
  dental: {
    name: "口腔健康",
    icon: "🦷",
    factors: ["牙齿", "牙龈", "口气"],
    checkFrequency: 180,
  },
  vision: {
    name: "视力健康",
    icon: "👁️",
    factors: ["近视", "散光", "眼压"],
    checkFrequency: 365,
  },
};

// ====== 心理状态 ======
const PSYCHOLOGICAL_STATES = {
  excellent: {
    name: "状态极佳",
    icon: "🌟",
    stress: [0, 20],
    anxiety: [0, 20],
    depression: [0, 10],
  },
  good: {
    name: "状态良好",
    icon: "🙂",
    stress: [20, 40],
    anxiety: [20, 35],
    depression: [10, 20],
  },
  normal: {
    name: "状态正常",
    icon: "😐",
    stress: [40, 60],
    anxiety: [35, 50],
    depression: [20, 35],
  },
  stressed: {
    name: "压力较大",
    icon: "😰",
    stress: [60, 80],
    anxiety: [50, 70],
    depression: [35, 50],
  },
  anxious: {
    name: "焦虑状态",
    icon: "😟",
    stress: [70, 90],
    anxiety: [70, 90],
    depression: [40, 65],
  },
  depressed: {
    name: "抑郁倾向",
    icon: "😔",
    stress: [75, 100],
    anxiety: [60, 90],
    depression: [65, 85],
  },
  critical: {
    name: "心理危机",
    icon: "🚨",
    stress: [85, 100],
    anxiety: [80, 100],
    depression: [85, 100],
  },
};

// ====== 个人形象维度 ======
const IMAGE_DIMENSIONS = {
  appearance: {
    name: "外貌",
    icon: "✨",
    factors: ["五官", "皮肤", "发型", "身材"],
    maxLevel: 100,
  },
  style: {
    name: "穿搭",
    icon: "👔",
    factors: ["品味", "搭配", "品牌", "场合适配"],
    maxLevel: 100,
  },
  grooming: {
    name: "仪容",
    icon: "💇",
    factors: ["发型", "胡须", "指甲", "气味"],
    maxLevel: 100,
  },
  fitness: {
    name: "身材",
    icon: "💪",
    factors: ["肌肉", "体脂", "体态", "健康"],
    maxLevel: 100,
  },
  charisma: {
    name: "气质",
    icon: "🌟",
    factors: ["自信", "谈吐", "风度", "魅力"],
    maxLevel: 100,
  },
};

// ====== 人生目标/梦想 ======
const LIFE_GOAL_CATEGORIES = {
  career: {
    name: "事业成就",
    icon: "💼",
    examples: ["成为CEO", "创业成功", "财务自由", "行业专家"],
  },
  wealth: {
    name: "财富积累",
    icon: "💰",
    examples: ["存款100万", "存款1000万", "被动收入覆盖支出", "投资获利"],
  },
  family: {
    name: "家庭幸福",
    icon: "👨‍👩‍👧",
    examples: ["结婚", "生子", "买房", "父母安享晚年"],
  },
  personal: {
    name: "个人成长",
    icon: "🌱",
    examples: ["读完100本书", "学会3门外语", "环游世界", "学会乐器"],
  },
  health: {
    name: "健康生活",
    icon: "🏃",
    examples: ["跑马拉松", "减重10公斤", "体检全优", "戒烟戒酒"],
  },
  contribution: {
    name: "社会贡献",
    icon: "🌍",
    examples: ["做慈善", "帮助100人", "环保行动", "知识分享"],
  },
};

/**
 * 初始化个人成长系统
 */
function initPersonalGrowth(state) {
  if (!state.personalGrowth) {
    state.personalGrowth = {
      hobbies: {}, // { hobbyId: { level: 1, exp: 0, lastPracticed: day } }
      health: {
        physical: 80,
        mental: 70,
        metabolic: 75,
        dental: 85,
        vision: 70,
        lastCheckup: state.player.day,
        checkupHistory: [],
      },
      psychology: {
        stress: 30,
        anxiety: 25,
        depression: 15,
        mood: 70,
        sleepQuality: 70,
        lastTherapy: null,
      },
      image: {
        appearance: 60,
        style: 50,
        grooming: 65,
        fitness: 55,
        charisma: 50,
      },
      lifeGoals: {
        active: [], // { id, category, description, targetValue, currentValue, deadline }
        completed: [],
      },
      reading: {
        booksRead: 0,
        booksThisYear: 0,
        readingList: [],
        currentBook: null,
      },
    };
  }
  var pg = state.personalGrowth;
  if (!pg.hobbies) pg.hobbies = {};
  if (!pg.health) {
    pg.health = {
      physical: 80,
      mental: 70,
      metabolic: 75,
      dental: 85,
      vision: 70,
      lastCheckup: state.player.day,
      checkupHistory: [],
    };
  }
  if (!pg.psychology) {
    pg.psychology = {
      stress: 30,
      anxiety: 25,
      depression: 15,
      mood: 70,
      sleepQuality: 70,
      lastTherapy: null,
    };
  }
  if (!pg.image) {
    pg.image = {
      appearance: 60,
      style: 50,
      grooming: 65,
      fitness: 55,
      charisma: 50,
    };
  }
  if (!pg.lifeGoals) pg.lifeGoals = { active: [], completed: [] };
  if (!pg.reading) {
    pg.reading = {
      booksRead: 0,
      booksThisYear: 0,
      readingList: [],
      currentBook: null,
    };
  }
  pg.reading.booksRead = pg.reading.booksRead || 0;
  pg.reading.booksThisYear = pg.reading.booksThisYear || 0;
  pg.reading.readingList = Array.isArray(pg.reading.readingList)
    ? pg.reading.readingList
    : [];
}

/**
 * 练习爱好
 */
function practiceHobby(state, hobbyId) {
  // 查找爱好
  let hobby = null;
  let categoryKey = null;
  for (const [catKey, cat] of Object.entries(HOBBY_CATEGORIES)) {
    const found = cat.hobbies.find((h) => h.id === hobbyId);
    if (found) {
      hobby = found;
      categoryKey = catKey;
      break;
    }
  }

  if (!hobby) {
    return { success: false, message: "不存在的爱好" };
  }

  // 检查行动力
  if (state.player.actionPoints < hobby.baseAP) {
    return { success: false, message: `需要${hobby.baseAP}点行动力` };
  }

  // 检查费用
  const cost =
    hobby.baseCost + Math.floor(Random.float(0, hobby.baseCost * 0.5));
  if ((state.resources.cash || 0) < cost) {
    return { success: false, message: `需要¥${cost}，现金不足` };
  }

  state.player.actionPoints = Math.max(0, (state.player.actionPoints || 0) - hobby.baseAP);
  state.resources.cash = Math.max(0, (state.resources.cash || 0) - cost);

  // 更新爱好等级
  if (!state.personalGrowth.hobbies[hobbyId]) {
    state.personalGrowth.hobbies[hobbyId] = {
      level: 1,
      exp: 0,
      lastPracticed: state.player.day,
      totalSessions: 0,
    };
  }

  const hobbyState = state.personalGrowth.hobbies[hobbyId];
  const expGain = Random.int(10, 19);
  hobbyState.exp += expGain;
  hobbyState.lastPracticed = state.player.day;
  hobbyState.totalSessions++;

  // 升级检查
  const expToNextLevel = hobbyState.level * 50;
  if (hobbyState.exp >= expToNextLevel) {
    hobbyState.level++;
    hobbyState.exp -= expToNextLevel;
    StateManager.addMessage(
      `🎉 ${hobby.name}等级提升到${hobbyState.level}级！`,
      "success",
    );
  }

  // 应用爱好效果
  applyHobbyBenefits(state, hobby);

  StateManager.addMessage(
    `🎨 练习${hobby.icon} ${hobby.name}（Lv.${hobbyState.level}），${hobby.benefits.join("、")}`,
    "info",
  );

  return { success: true, level: hobbyState.level, exp: hobbyState.exp };
}

/**
 * 应用爱好效果
 */
function applyHobbyBenefits(state, hobby) {
  const pg = state.personalGrowth;
  const p = state.player;
  const needs = state.needs;

  for (const benefit of hobby.benefits) {
    if (benefit.includes("健康")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      pg.health.physical = Math.min(100, pg.health.physical + value);
    }
    if (benefit.includes("压力")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      pg.psychology.stress = Math.max(0, pg.psychology.stress + value);
      needs.happiness = Math.min(100, needs.happiness - value);
    }
    if (benefit.includes("智力")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      p.intelligence = Math.min(100, p.intelligence + value);
    }
    if (benefit.includes("身材")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      pg.image.fitness = Math.min(100, pg.image.fitness + value);
    }
    if (benefit.includes("社交")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      if (p.corporate)
        p.corporate.popularity = Math.min(100, p.corporate.popularity + value);
    }
    if (benefit.includes("心情")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      needs.happiness = Math.min(100, needs.happiness + value);
    }
    if (benefit.includes("视野")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      p.fame = Math.min(100, p.fame + Math.floor(value / 2));
    }
    if (benefit.includes("技能")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      // 根据爱好类型增加对应技能
      if (hobby.id === "coding") {
        if (p.skills && p.skills.coding)
          p.skills.coding.level = Math.min(100, p.skills.coding.level + value);
      } else if (hobby.id === "english") {
        if (p.skills && p.skills.english)
          p.skills.english.level = Math.min(
            100,
            p.skills.english.level + value,
          );
      }
    }
    if (benefit.includes("收入潜力")) {
      // 隐性加成，不直接显示
    }
    if (benefit.includes("审美")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      pg.image.appearance = Math.min(100, pg.image.appearance + value);
      pg.image.style = Math.min(100, pg.image.style + value);
    }
    if (benefit.includes("创造力")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      p.intelligence = Math.min(100, p.intelligence + Math.floor(value / 2));
    }
    if (benefit.includes("表达")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      if (p.skills && p.skills.sales)
        p.skills.sales.level = Math.min(100, p.skills.sales.level + value);
    }
    if (benefit.includes("自信")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      pg.psychology.mood = Math.min(100, pg.psychology.mood + value);
    }
    if (benefit.includes("领导力")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      if (p.corporate)
        p.corporate.ability = Math.min(100, p.corporate.ability + value);
    }
    if (benefit.includes("职场")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      if (p.corporate)
        p.corporate.upwardMgmt = Math.min(100, p.corporate.upwardMgmt + value);
    }
    if (benefit.includes("生活技能")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      if (p.skills && p.skills.cooking)
        p.skills.cooking.level = Math.min(100, p.skills.cooking.level + value);
    }
    if (benefit.includes("耐心")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      pg.psychology.stress = Math.max(0, pg.psychology.stress - value);
    }
    if (benefit.includes("焦虑")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      pg.psychology.anxiety = Math.max(0, pg.psychology.anxiety + value);
    }
    if (benefit.includes("抑郁")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      pg.psychology.depression = Math.max(0, pg.psychology.depression + value);
    }
    if (benefit.includes("身心平衡")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      pg.psychology.stress = Math.max(0, pg.psychology.stress - value);
      pg.psychology.mood = Math.min(
        100,
        pg.psychology.mood + Math.floor(value / 2),
      );
    }
    if (benefit.includes("疲劳")) {
      const value = parseInt(benefit.match(/[\d-]+/)[0]);
      needs.fatigue = Math.max(0, needs.fatigue + value);
    }
  }
}

/**
 * 进行体检
 */
function healthCheckup(state) {
  const cost = Random.int(500, 999);
  if ((state.resources.cash || 0) < cost) {
    return { success: false, message: `体检需要¥${cost}，现金不足` };
  }

  state.resources.cash = Math.max(0, (state.resources.cash || 0) - cost);

  const pg = state.personalGrowth;
  const day = state.player.day;

  // 生成体检报告
  const report = {
    day: day,
    physical: pg.health.physical + Random.int(-5, 4),
    mental: pg.health.mental + Random.int(-5, 4),
    metabolic: pg.health.metabolic + Random.int(-5, 4),
    dental: pg.health.dental + Random.int(-5, 4),
    vision: pg.health.vision + Random.int(-5, 4),
    issues: [],
  };

  // 检查是否有健康问题
  if (report.physical < 60) report.issues.push("身体健康需要关注");
  if (report.mental < 50) report.issues.push("心理健康需要关注");
  if (report.metabolic < 60) report.issues.push("代谢指标异常，注意饮食");
  if (report.dental < 70) report.issues.push("牙齿需要护理");
  if (report.vision < 60) report.issues.push("视力下降，注意用眼");

  pg.health.lastCheckup = day;
  pg.health.checkupHistory.push(report);

  // 保存并生成报告
  const issueText =
    report.issues.length > 0
      ? ` ⚠️ 发现${report.issues.length}项需要关注：${report.issues.join("、")}`
      : " ✅ 各项指标正常";

  StateManager.addMessage(
    `🏥 体检完成！身体${report.physical} 心理${report.mental} 代谢${report.metabolic}${issueText}`,
    "info",
  );

  return { success: true, report: report };
}

/**
 * 心理咨询
 */
function 心理咨询(state) {
  const cost = 500;
  if ((state.resources.cash || 0) < cost) {
    return { success: false, message: `心理咨询需要¥${cost}，现金不足` };
  }

  state.resources.cash = Math.max(0, (state.resources.cash || 0) - cost);

  const pg = state.personalGrowth;
  pg.psychology.stress = Math.max(0, pg.psychology.stress - 10);
  pg.psychology.anxiety = Math.max(0, pg.psychology.anxiety - 8);
  pg.psychology.depression = Math.max(0, pg.psychology.depression - 5);
  pg.psychology.mood = Math.min(100, pg.psychology.mood + 5);
  pg.psychology.lastTherapy = state.player.day;

  StateManager.addMessage(
    `👂 心理咨询结束，压力-10，焦虑-8，抑郁-5`,
    "success",
  );

  return { success: true };
}

/**
 * 形象提升
 */
function improveImage(state, dimension, method) {
  const pg = state.personalGrowth;
  const dimValue = pg.image[dimension];

  if (
    !dimValue &&
    dimension !== "appearance" &&
    dimension !== "style" &&
    dimension !== "grooming" &&
    dimension !== "fitness" &&
    dimension !== "charisma"
  ) {
    return { success: false, message: "不存在的形象维度" };
  }

  const methods = {
    shopping: { cost: 500, gain: 5, desc: "购买新衣服/配饰" },
    haircut: { cost: 100, gain: 3, desc: "理发/造型" },
    skincare: { cost: 300, gain: 4, desc: "护肤护理" },
    gym: { cost: 100, gain: 3, desc: "健身塑形" },
    style_consult: { cost: 800, gain: 6, desc: "形象顾问" },
    makeup: { cost: 200, gain: 3, desc: "化妆/造型" },
  };

  const methodData = methods[method];
  if (!methodData) {
    return { success: false, message: "不存在的提升方法" };
  }

  if (state.resources.cash < methodData.cost) {
    return { success: false, message: `需要¥${methodData.cost}，现金不足` };
  }

  state.resources.cash = Math.max(0, (state.resources.cash || 0) - methodData.cost);

  pg.image[dimension] = Math.min(100, dimValue + methodData.gain);

  StateManager.addMessage(
    `✨ ${methodData.desc}，${IMAGE_DIMENSIONS[dimension].name}+${methodData.gain}`,
    "success",
  );

  return { success: true, value: pg.image[dimension] };
}

/**
 * 设定人生目标
 */
function setLifeGoal(state, category, description, targetValue, deadline) {
  const pg = state.personalGrowth;

  const goal = {
    id:
      "goal_" +
      state.player.day +
      "_" +
      Random.float(0, 1).toString(36).substr(2, 9),
    category: category,
    description: description,
    targetValue: targetValue,
    currentValue: 0,
    deadline: deadline,
    createdDay: state.player.day,
    progress: 0,
  };

  pg.lifeGoals.active.push(goal);
  StateManager.addMessage(
    `🎯 设定人生目标：${description}（${category}）`,
    "success",
  );

  return { success: true, goal: goal };
}

/**
 * 更新目标进度
 */
function updateGoalProgress(state, goalId, progressChange) {
  const pg = state.personalGrowth;
  const goal = pg.lifeGoals.active.find((g) => g.id === goalId);
  if (!goal) return { success: false, message: "目标不存在" };

  goal.currentValue = Math.min(
    goal.targetValue,
    goal.currentValue + progressChange,
  );
  goal.progress = Math.round((goal.currentValue / goal.targetValue) * 100);

  // 检查是否完成
  if (goal.currentValue >= goal.targetValue) {
    completeGoal(state, goal);
    return { success: true, completed: true, progress: 100 };
  }

  return { success: true, progress: goal.progress };
}

/**
 * 完成目标
 */
function completeGoal(state, goal) {
  const pg = state.personalGrowth;

  // 从进行中移除
  pg.lifeGoals.active = pg.lifeGoals.active.filter((g) => g.id !== goal.id);

  // 加入已完成
  goal.completedDay = state.player.day;
  pg.lifeGoals.completed.push(goal);

  StateManager.addMessage(`🎉 目标达成：${goal.description}！`, "success");

  // 给予奖励
  const reward = Random.int(1000, 2999);
  state.resources.cash = (state.resources.cash || 0) + reward;
  state.player.fame = Math.min(100, state.player.fame + 5);

  StateManager.addMessage(`💰 目标达成奖励：¥${reward}，名气+5`, "success");
}

/**
 * 读书
 */
function readBook(state, bookTitle) {
  const pg = state.personalGrowth;

  if (state.player.actionPoints < 15) {
    return { success: false, message: "需要15点行动力" };
  }

  state.player.actionPoints = Math.max(0, (state.player.actionPoints || 0) - 15);

  pg.reading.booksRead++;
  pg.reading.booksThisYear++;

  // 智力提升
  state.player.intelligence = Math.min(100, state.player.intelligence + 1);

  // 压力减轻
  pg.psychology.stress = Math.max(0, pg.psychology.stress - 2);
  state.needs.happiness = Math.min(100, state.needs.happiness + 2);

  StateManager.addMessage(`📚 读完《${bookTitle}》，智力+1，压力-2`, "info");

  return { success: true, booksRead: pg.reading.booksRead };
}

/**
 * 每日个人成长更新
 */
function tickPersonalGrowthDaily(state) {
  initPersonalGrowth(state);
  const pg = state.personalGrowth;
  const day = state.player.day;

  if (!pg) return;

  // 自然衰减（不练习的爱好会遗忘）
  for (const [hobbyId, hobbyState] of Object.entries(pg.hobbies)) {
    if (day - hobbyState.lastPracticed > 90) {
      hobbyState.level = Math.max(1, hobbyState.level - 1);
      StateManager.addMessage(`📉 ${hobbyId}因长期未练习，等级-1`, "hint");
    }
  }

  // 心理压力自然恢复
  if (!pg.psychology) {
    pg.psychology = { stress: 50, anxiety: 30, depression: 10, mood: 60 };
  }
  pg.psychology.stress = Math.max(0, pg.psychology.stress - 0.5);
  pg.psychology.anxiety = Math.max(0, pg.psychology.anxiety - 0.3);
  pg.psychology.depression = Math.max(0, pg.psychology.depression - 0.2);

  // 睡眠影响
  if (state.needs && state.needs.fatigue < 30) {
    pg.psychology.stress = Math.min(100, pg.psychology.stress + 2);
    pg.psychology.mood = Math.max(0, pg.psychology.mood - 2);
  }

  // 年度重置读书统计
  if (state.player.day % 365 === 0) {
    pg.reading.booksThisYear = 0;
  }

  // 检查心理危机
  checkPsychologicalCrisis(state);
}

/**
 * 检查心理危机
 */
function checkPsychologicalCrisis(state) {
  const pg = state.personalGrowth;
  if (!pg) return;

  const psy = pg.psychology;

  if (psy.stress > 85 && psy.anxiety > 80 && psy.depression > 85) {
    StateManager.addMessage("🚨 心理危机预警！建议立即寻求专业帮助", "danger");

    // 触发游戏机制：强制休息
    if (!state.flags) state.flags = {};
    state.flags.forceRest = true;
  } else if (psy.stress > 75 || psy.anxiety > 70 || psy.depression > 70) {
    StateManager.addMessage(
      "⚠️ 心理状态需要关注，建议休息或寻求心理咨询",
      "warning",
    );
  }
}

/**
 * 获取个人成长摘要
 */
function getPersonalGrowthSummary(state) {
  const pg = state.personalGrowth;
  if (!pg) return null;

  return {
    hobbyCount: Object.keys(pg.hobbies).length,
    maxHobbyLevel: Math.max(
      0,
      ...Object.values(pg.hobbies).map((h) => h.level),
    ),
    healthStatus:
      pg.health.physical >= 70
        ? "良好"
        : pg.health.physical >= 50
          ? "一般"
          : "需要关注",
    psychologicalState: getPsychologicalStateLabel(pg.psychology),
    imageScore: Math.round(
      (pg.image.appearance +
        pg.image.style +
        pg.image.grooming +
        pg.image.fitness +
        pg.image.charisma) /
        5,
    ),
    activeGoals: pg.lifeGoals.active.length,
    completedGoals: pg.lifeGoals.completed.length,
    booksRead: pg.reading.booksRead,
    lastCheckup: pg.health.lastCheckup,
  };
}

/**
 * 获取心理状态标签
 */
function getPsychologicalStateLabel(psy) {
  const stress = psy.stress;
  const anxiety = psy.anxiety;
  const depression = psy.depression;

  if (stress > 85 || anxiety > 80 || depression > 85) return "🚨 危机";
  if (stress > 75 || anxiety > 70 || depression > 70) return "😟 焦虑";
  if (stress > 60 || anxiety > 50 || depression > 50) return "😰 压力";
  if (stress > 40 || anxiety > 35 || depression > 35) return "😐 正常";
  if (stress > 20 || anxiety > 20 || depression > 20) return "🙂 良好";
  return "🌟 极佳";
}

/**
 * 百科注册
 */
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.personal_growth = {
    id: "personal_growth",
    name: "个人成长",
    icon: "🌱",
    brief: "兴趣爱好、健康管理、心理状态、个人形象、终身学习、人生目标",
    version: "1.0.0",
    related: [
      "mechanics:main",
      "mechanics:critical_needs",
      "mechanics:family_life",
    ],
    sections: [
      {
        kind: "desc",
        text: "人生不止眼前的苟且，还有诗和远方。个人成长系统让你体验从技能提升到身心健康、从形象塑造到人生目标实现的完整成长旅程。",
      },
      {
        kind: "subhead",
        text: "🎨 爱好分类",
      },
      {
        kind: "list",
        items: [
          "🏃 运动健身：跑步、健身房、瑜伽、游泳、篮球、网球、骑行、徒步",
          "🎨 艺术文化：阅读、绘画、音乐、摄影、写作、书法、舞蹈、表演",
          "📖 学习提升：编程、英语、金融、烹饪、演讲、管理",
          "🎉 社交娱乐：桌游、扑克、麻将、棋类、游戏、旅行",
          "🧘 身心健康：冥想、SPA、按摩、心理咨询、睡眠改善",
        ],
      },
      {
        kind: "subhead",
        text: "🏥 健康检查",
      },
      {
        kind: "list",
        items: [
          "💪 身体健康：体重、血压、血糖、血脂、心肺功能",
          "🧠 心理健康：压力、焦虑、抑郁、情绪稳定、睡眠质量",
          "⚖️ 代谢健康：BMI、体脂率、腰围、基础代谢",
          "🦷 口腔健康：牙齿、牙龈、口气",
          "👁️ 视力健康：近视、散光、眼压",
        ],
      },
      {
        kind: "subhead",
        text: "✨ 形象维度",
      },
      {
        kind: "list",
        items: [
          "✨ 外貌：五官、皮肤、发型、身材",
          "👔 穿搭：品味、搭配、品牌、场合适配",
          "💇 仪容：发型、胡须、指甲、气味",
          "💪 身材：肌肉、体脂、体态、健康",
          "🌟 气质：自信、谈吐、风度、魅力",
        ],
      },
      {
        kind: "tip",
        text: "💡 提示：爱好需要持续练习才能保持等级；定期体检很重要；心理健康和身体健康同等重要；设定并追求人生目标让生命更有意义。",
      },
    ],
  };
}
