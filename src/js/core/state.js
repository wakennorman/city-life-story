/**
 * GameState — 唯一状态源 (Single Source of Truth)
 *
 * 所有游戏数据集中在此对象中。每个模块通过 getState()/updateState() 读写。
 * 使用 Proxy 实现变更追踪（dirty flag），驱动按需渲染。
 */

// ====== 默认初始状态 ======
function createDefaultState() {
  const now = Date.now();
  return {
    // --- 元数据 ---
    version: "1.1.0",
    createdAt: now,
    lastPlayedAt: now,
    playTime: 0,
    _difficulty: "normal", // 难度档位: 'easy' | 'normal' | 'hard' | 'hell'（v3.1 ④ 默认 normal）

    // --- 玩家身份 ---
    player: {
      name: "无名",
      gender: "male",
      age: 20,
      birthday: { month: 6, day: 15 },

      // 街头 4+2 维属性 (0-100)
      physique: 22, // 体质
      intelligence: 20, // 智力
      agility: 24, // 敏捷
      mental: 26, // 心智（v3.0：UI 显示为"能力"，字段名保留避免破坏）
      charm: 20, // 魅力（v3.0 新增：影响 NPC 初遇好感、职场面试、特殊行动）
      morality: 50, // 道德（v3.0 新增：0-100，违法行为降低，捐款/义工提升）
      fame: 0, // 名气（基础第五维，从 status.fame 迁移而来）

      // 职场 7 维属性 (进入职场后初始化)
      corporate: {
        hair: 100,
        dignity: 60,
        upwardMgmt: 20,
        kpi: 20,
        ability: 30,
        risk: 0,
        popularity: 30,
      },

      // 阶段与时间
      phase: "street", // 'street' | 'corporate'
      day: 1,
      corpYear: 0, // 入职年数
      corpQuarter: 1, // 1-4
      timeSlot: "morning", // 'morning' | 'afternoon' | 'evening' (显示用)
      actionPoints: 100, // 当前行动力 (0-100)
      maxActionPoints: 100, // 每日行动力上限
      education: 0, // 0=大专, 1=本科, 2=研究生, 3=博士
      eduProgress: { studyPoints: 0, examsPassed: 0, totalExams: 6 },
      research: 0, // 发表论文数（学术胜利路线）
    },

    // --- 经济 ---
    resources: {
      cash: 300, // 现金（元）— v3.2 黑暗开局：¥300
      bankBalance: 0, // 银行存款
      debt: 0, // 当前总欠款 — v3.2 无起步债
      villageDebt: 0, // 欠村长的钱 — v3.2 无起步债
      villageDebtInterest: 0, // 累计村长利息
      bankDebt: 0, // 欠银行的钱
      bankDebtDay: 0, // 最近一笔银行贷款发放日
      bankCreditHistory: [], // 信贷记录 [{ day, amount, repaid, rating }]
      loanPrincipal: 0, // v3.2 无起步债
      loanDay: 0, // 借款日
      dailyInterest: 0.0035, // 日息 0.3%
      totalEarned: 0, // 终身总收入
    },

    // --- 历史记录（用于图表/可视化） ---
    history: {
      income: [], // 每日收入数组（索引=天数-1）
      expense: [], // 每日支出数组
    },

    // --- 玩家行为统计（用于智能排序等） ---
    stats: {
      actionFreq: {}, // { actionId: 累计点击次数 }
      actionFirstUse: {}, // { actionId: 首次点击天数 }
      tradeFreq: {}, // { goodId: 累计买卖次数 }
      trainFreq: {}, // { skillKey: 累计训练次数 }
      investFreq: {}, // { symbol: 累计交易次数 }
    },

    // --- 基本需求 (0-100) ---
    needs: {
      hunger: 25, // v3.2 黑暗开局：饥饱见底
      fatigue: 50, // v3.2 黑暗开局：疲惫不堪
      hygiene: 30, // v3.2 黑暗开局：卫生差
      happiness: 20, // v3.2 黑暗开局：心情低落
    },

    // --- 派生状态 ---
    status: {
      health: 70, // v3.2 黑暗开局：健康亮红灯
      emotionalState: "stable", // stable|happy|sad|angry|stressed|depressed
      sick: false, // 兼容旧字段（内部由 illnesses 数组派生）
      injured: false, // 兼容旧字段
      illnesses: [], // [{ id: "cold", contractedDay: 12, severity: 1, treated: false }]
    },

    // --- 技能 (level: 0-100, xp: 0-1000) ---
    skills: {
      cooking: { level: 0, xp: 0 },
      repair: { level: 0, xp: 0 },
      coding: { level: 0, xp: 0 },
      english: { level: 0, xp: 0 },
      driving: { level: 0, xp: 0 },
      sales: { level: 0, xp: 0 },
      management: { level: 0, xp: 0 },
      accounting: { level: 0, xp: 0 },
      electrician: { level: 0, xp: 0 },
      welding: { level: 0, xp: 0 },
    },
    certificates: [],
    skillBranches: {}, // { cooking: "home_chef", ... } 技能→已选分支ID
    talentNodes: {}, // { "cooking_home_chef_knife": true, ... } 已激活的天赋节点
    // 兼容早期存档/误放字段；运行逻辑以 player.education 为准。
    education: 0,
    eduProgress: { studyPoints: 0, examsPassed: 0, totalExams: 6 },

    // --- 物品栏 ---
    inventory: {
      items: [], // [{ id, qty, avgBuyPrice }]
      capacity: 20, // 基础容量
      equipment: {
        head: null,
        body: null,
        feet: null,
        hand: null,
        accessory: null,
      },
      equipmentInstances: {}, // { slot: { itemId, quality, qualityName, durability, ... } } 按 slot 键存储装备实例
    },

    // --- 住所 ---
    housing: {
      tier: 0, // 0=露宿 1=合租床位 2=单间 3=一居室 4=豪华公寓 5=郊区独栋 6=江景豪宅（详见 items.js HOUSING_TIERS）
      rentedDay: 0, // 租房日
      rentedAt: "slum", // 在哪个地点租的（用于计算实际租金）
      storageRented: false, // 是否租了仓库
      storageCapacity: 0, // 仓库额外容量
    },

    // --- 人际关系 ---
    relationships: {}, // { npcId: { affinity: -100~100, met: bool, discovered: { birthday, giftPrefers, favor, deepTask, presenceBonus:[], affinityRewards:[] } } }

    // --- 交易系统 ---
    trade: {
      currentLocation: "slum",
      totalProfit: 0,
      goodsPrices: {}, // { locationKey: { goodId: price } }
      priceTrends: {},
      lastPriceUpdate: 0,
      // 交易情报系统 v1.8
      visitedToday: {}, // { locKey: { visitDay, prices: { goodId: price } } }
      _visitedDay: null, // 今日天数（用于每日重置）
      priceMemory: [], // [{ day, locKey, goodId, tier }] 前N日模糊记忆
      _todayTradeXp: 0, // 通过交易获得的每日销售XP累计
      _xpResetDay: null, // 上次XP重置天数
    },

    // --- 就业 ---
    employment: {
      currentJob: null,
      jobStartDay: 0,
      completedShifts: {},
    },

    // --- 副业系统 (P0-1: 副业系统接入) ---
    sideHustle: {
      active: false,
      type: null, // 'stall' | 'driving' | 'freelance' | 'content' | 'sharing' | 'community'
      fatigue: 0, // 副业疲劳度（影响次日主业效率）
      income: 0, // 当日副业收入
      reputation: 0, // 副业口碑
      history: [], // 副业收入历史
      lastActiveDay: null,
    },

    // --- 职场 ---
    corporate: {
      company: null,
      rank: "P5",
      department: "engineering",
      joinedDay: 0,
      perfHistory: [], // [{ year, quarter, grade, score }]
      consecutiveC: 0,
      quarterlyActions: 3,
      actionsUsed: 0,
      team: [],
      stocks: [],
      stockMarket: {},
      projects: [],
      completedProjects: [],
    },

    // --- 投资系统 ---
    investment: {
      stockMarket: {},
      stockHoldings: [],
      btcPrice: 200000,
      btcHoldings: 0,
      btcHistory: [],
      btcFearGreed: 50,
      btcHalvingDay: 0,
      properties: [],
      selfLivePropertyId: null,
      cars: [],
      lastTickDay: 0,

      // --- 房产市场 v2 状态（波动系统） ---
      propertyMarketPhase: "stable", // "boom" | "stable" | "cooling" | "bust"
      propertyPhaseStartDay: 0, // 当前阶段开始天
      propertyPhaseDuration: 30, // 当前阶段持续期
      _propertyPolicyTightness: 0, // -1~+1 政策趋紧度
      _propertySystemV2: true, // 标记已升级（新游戏直接标记）
    },

    // --- 企业命运系统 (P2#11) ---
    enterpriseFate: {
      companies: {
        star_tech: {
          phase: "growth",
          health: 82,
          marketShare: 15,
          sentiment: 60,
          productScore: 72,
          talentScore: 68,
          trend: "up",
          knownToPlayer: false,
          fateEventHistory: [],
          ceasedExistence: false,
          ceasedAt: null,
        },
        byte_dragon: {
          phase: "growth",
          health: 88,
          marketShare: 22,
          sentiment: 70,
          productScore: 80,
          talentScore: 75,
          trend: "up",
          knownToPlayer: false,
          fateEventHistory: [],
          ceasedExistence: false,
          ceasedAt: null,
        },
        cloud_giant: {
          phase: "mature",
          health: 78,
          marketShare: 18,
          sentiment: 55,
          productScore: 65,
          talentScore: 60,
          trend: "stable",
          knownToPlayer: false,
          fateEventHistory: [],
          ceasedExistence: false,
          ceasedAt: null,
        },
        game_fun: {
          phase: "growth",
          health: 75,
          marketShare: 10,
          sentiment: 65,
          productScore: 70,
          talentScore: 55,
          trend: "up",
          knownToPlayer: false,
          fateEventHistory: [],
          ceasedExistence: false,
          ceasedAt: null,
        },
        safe_fin: {
          phase: "mature",
          health: 85,
          marketShare: 12,
          sentiment: 50,
          productScore: 60,
          talentScore: 70,
          trend: "stable",
          knownToPlayer: false,
          fateEventHistory: [],
          ceasedExistence: false,
          ceasedAt: null,
        },
      },
      fateEventCooldown: {},
      lastFateTick: 0,
      // Phase 1 新增字段
      mergedCompaniesMap: {}, // { targetCid: { absorbedBy, absorbedAt, mergedName, ... } }
      industryIndex: {}, // { industryName: [companyIds] }
      quarterlyReports: [], // 季度报告历史
      // Phase 2 新增字段：风声 pending 事件队列
      pendingEvents: [], // [{ companyId, event, triggerDay, rumorId }]
    },

    // --- 玩家创业系统 (Phase 2) ---
    startup: {
      status: "none", // 'none' | 'preparing' | 'seed' | 'growth' | 'ipo_preparing' | 'exited'
      company: null, // 公司详情（注册后初始化）
      flags: {
        registered: false,
        firstProductLaunched: false,
        hasInvestors: false,
        ipoFiled: false,
        exited: false,
        exitType: null, // 'ipo' | 'acquired' | 'bankrupt'
        exitDay: null,
        exitValue: 0,
      },
      history: {
        foundedDay: null,
        exitedDay: null,
        exitType: null,
        exitValue: 0,
        peakValuation: 0,
        totalRevenue: 0,
        employeesHired: 0,
      },
    },

    // --- 内幕交易系统 (Phase 2) ---
    insiderTrading: {
      activeRumor: null, // { id, companyId, eventType, detectedDay, confidence, channels, estimatedImpact, resolvedDay, playerTraded, playerProfit }
      rumorHistory: [], // 风声历史
      tradeLog: [], // [{ day, symbol, action, shares, price, relatedRumorId }]
      audits: [], // [{ day, companyId, findings, profit, penalty, bannedDays }]
      currentPenalty: {
        tradingBanned: false,
        tradingBanEndDay: 0,
        fine: 0,
        reputationDamage: 0,
      },
    },

    // --- 天气 ---
    weather: {
      current: "sunny",
      temperature: 22,
      season: null, // 将在 initWeather() 中随机初始化
      lastChanged: 0,
      forecast: [], // [{day, weatherId, confidence}] 未来3天预报
      duration: 1, // 当前天气计划持续天数（极端天气 > 1）
      daysActive: 0, // 当前天气已持续天数
      persistent: false, // true=持续期模式（极端天气不随机切换）
    },

    // --- 城管 ---
    chengguan: {
      heat: 0,
      lastRaid: 0,
      warnings: 0,
      relationship: 0, // -100~100 与城管的关系
    },

    // --- Phase 2 玩家深度交互 ---
    workplaceSocial: {
      colleagues: [], // [{ id, name, role, relationship, affinity, mentor, ally, rival, ... }]
      mentorship: null, // { mentorId, level, startedDay }
      officePoliticsLog: [], // [{ day, eventType, outcome, ... }]
      network: { weak: [], strong: [], crossIndustry: [] }, // 人脉网络
    },

    family: {
      relationshipStage: "stranger", // stranger|acquaintance|friend|good_friend|crush|dating|engaged|married
      partner: null, // { type, name, income, companionship, traits, ... }
      children: [], // [{ id, age, stage, education, expenses, ... }]
      parents: {
        father: {
          health: "healthy",
          age: 50,
          companionship: 10,
          medicalCost: 0,
        },
        mother: {
          health: "healthy",
          age: 48,
          companionship: 10,
          medicalCost: 0,
        },
      },
      mortgage: null, // { monthlyPayment, remainingDays, ... }
      activities: [], // 家庭活动历史
    },

    personalGrowth: {
      hobbies: {}, // { hobbyId: { level: 0, xp: 0, hours: 0, ... } }
      health: {
        physical: { score: 50, lastCheckup: 0 },
        mental: {
          score: 50,
          stress: 0,
          anxiety: 0,
          depression: 0,
          lastTherapy: 0,
        },
        metabolic: { score: 50, bmi: 22, lastCheckup: 0 },
      },
      image: { style: 30, skincare: 30, fitness: 30, plastic: 0 }, // 形象各维度 0-100
      goals: [], // [{ id, category, description, targetValue, currentValue, deadline, completed }]
      learning: { booksRead: 0, courses: [], certificates: [] },
    },

    // --- 标志位 ---
    flags: {
      tutorialCompleted: false,
      gameOver: false,
      victory: false,
      victoryType: null,
      gameOverReason: null,
      ageThisYear: false,
      seenNewsToday: [],
      _dailyTransactions: [], // 当日收支流水记录 [{ type, category, amount, description }]
      // --- 状态危机/疾病系统 ---
      _habits: {
        junkFoodMeals: 0, // 累计垃圾食品次数
        lowHungerStreak: 0, // 连续 hunger<25 天数
        lowHygieneStreak: 0, // 连续 hygiene<30 天数
        lowHappinessStreak: 0, // 连续 happiness<20 天数
        highFatigueStreak: 0, // 连续 fatigue>80 天数
        lateNightActions: 0, // 累计夜生活次数
        stomach_inflammationCount: 0, // 已患肠胃炎次数
      },
      _deferred: {}, // { hunger: day, fatigue: day, ... } 当日延后过的临界维度
      _amenityHabitCount: {}, // { amenityId: count } 同一 amenity 累计使用次数（用于规律 buff）
      _hypertensionMonthlyPaid: 0, // 高血压月费上次缴费日
      _chainEventQueue: [], // 链式事件调度队列 [{ eventId, triggerDay, phase }]

      // --- 道德系统 ---
      moral: {
        score: 0, // 累计道德分 (-100 ~ 100)
        actions: [], // [{ id, choice, score, day }] — 道德选择历史
        pendingConsequences: [], // [{ eventId, dueDay, actionId }]
      },
    },

    // --- 世界参数反馈环 ---
    _worldParams: null, // 由 world_params.js 的 tickWorldParams 在首次调用时惰性初始化

    // --- 事件与消息 ---
    activeNews: [],
    newsHistory: [],
    messageLog: [], // [{ day, text, type }]
  };
}

// ====== 顶层命名空间白名单（防止路径 typo 静默创建新顶层字段）======
var _VALID_TOP_KEYS = null;
function _ensureTopKeys() {
  if (!_VALID_TOP_KEYS) {
    _VALID_TOP_KEYS = new Set(Object.keys(createDefaultState()));
  }
}

/**
 * 校验路径的第一段是否在已知的顶层 key 中
 * @param {string} path - 点号路径，如 "player.age"
 * @returns {boolean} 合法返回 true，否则警告并返回 false
 */
function _validateStatePath(path) {
  _ensureTopKeys();
  var topKey = path.split(".")[0];
  if (!_VALID_TOP_KEYS.has(topKey)) {
    console.warn(
      "[StateManager] ⚠️ 未知的顶层状态路径: '" +
        path +
        "'，topKey '" +
        topKey +
        "' 不在 createDefaultState() 中。请检查是否是拼写错误。",
    );
    return false;
  }
  return true;
}

// ====== 状态管理器 ======
class GameStateManager {
  constructor() {
    this._state = null;
    this._dirtyFlags = new Set();
    this._listeners = [];
  }

  /** 初始化新游戏 */
  newGame() {
    this._state = createDefaultState();
    this._markAllDirty();
    this._notify();
    return this._state;
  }

  /** 获取当前完整状态（只读引用，请勿直接修改嵌套对象） */
  getState() {
    if (!this._state) {
      throw new Error(
        "GameState not initialized. Call newGame() or loadGame() first.",
      );
    }
    return this._state;
  }

  /** 获取状态某个路径的值 */
  get(path) {
    const parts = path.split(".");
    let val = this.getState();
    for (const p of parts) {
      if (val == null) return undefined;
      val = val[p];
    }
    return val;
  }

  /**
   * 更新状态某个路径的值
   * 用法: update('player.age', 25) 或 update('player', { age: 25, ... })
   */
  update(path, value) {
    const parts = path.split(".");
    if (parts.length >= 1) _validateStatePath(path);
    const state = this.getState();

    // 导航到父对象
    let parent = state;
    for (let i = 0; i < parts.length - 1; i++) {
      parent = parent[parts[i]];
    }

    const key = parts[parts.length - 1];
    parent[key] = value;

    // 标记脏路径
    this._dirtyFlags.add(path);
    this._notify();
  }

  /** 批量更新（用于一次性修改多个字段） */
  batchUpdate(updates) {
    for (const [path, value] of Object.entries(updates)) {
      const parts = path.split(".");
      if (parts.length >= 1) _validateStatePath(path);
      const state = this.getState();
      let parent = state;
      for (let i = 0; i < parts.length - 1; i++) {
        parent = parent[parts[i]];
      }
      parent[parts[parts.length - 1]] = value;
      this._dirtyFlags.add(path);
    }
    this._notify();
  }

  /** 添加消息到日志 */
  addMessage(text, type = "info") {
    const state = this.getState();
    state.messageLog.push({
      day: state.player.day,
      text,
      type, // 'info'|'success'|'danger'|'event'|'warning'
    });
    // 限制日志长度
    if (state.messageLog.length > 500) {
      state.messageLog = state.messageLog.slice(-300);
    }
    this._dirtyFlags.add("messageLog");
    this._notify();
  }

  /** 导入存档 */
  importState(savedState) {
    this._state = savedState;
    this._state.lastPlayedAt = Date.now();
    // === v1.0 → v1.1 迁移：fame 从 status 移到 player + 新增疾病/习惯容器 ===
    var s = this._state;
    if (!s.relationships) s.relationships = {};
    if (s.npcRelations) {
      for (var legacyNpcId in s.npcRelations) {
        if (!s.relationships[legacyNpcId]) {
          s.relationships[legacyNpcId] = s.npcRelations[legacyNpcId];
        }
      }
      delete s.npcRelations;
    }
    if (s.status && typeof s.status.fame === "number") {
      if (s.player) s.player.fame = s.status.fame;
      delete s.status.fame;
    }
    if (s.player && typeof s.player.fame !== "number") {
      s.player.fame = 0;
    }
    if (s.status && !s.status.illnesses) s.status.illnesses = [];
    if (s.flags && !s.flags._habits) {
      s.flags._habits = {
        junkFoodMeals: 0,
        lowHungerStreak: 0,
        lowHygieneStreak: 0,
        lowHappinessStreak: 0,
        highFatigueStreak: 0,
        lateNightActions: 0,
        stomach_inflammationCount: 0,
      };
    }
    if (s.flags && !s.flags._deferred) s.flags._deferred = {};
    if (s.flags && !s.flags._amenityHabitCount) s.flags._amenityHabitCount = {};
    // v1.1 → v1.2 迁移：skillBranches + talentNodes
    if (!s.skillBranches) s.skillBranches = {};
    if (!s.talentNodes) s.talentNodes = {};
    // v1.2 → v1.3 迁移：企业命运 ceasedExistence
    if (s.enterpriseFate && s.enterpriseFate.companies) {
      for (var _cid in s.enterpriseFate.companies) {
        var _co = s.enterpriseFate.companies[_cid];
        if (_co && typeof _co.ceasedExistence === "undefined") {
          _co.ceasedExistence = false;
          _co.ceasedAt = null;
        }
      }
    }
    // v1.3 → v1.4 迁移：企业命运 Phase 1 新字段
    if (s.enterpriseFate) {
      if (!s.enterpriseFate.mergedCompaniesMap)
        s.enterpriseFate.mergedCompaniesMap = {};
      if (!s.enterpriseFate.industryIndex) s.enterpriseFate.industryIndex = {};
      if (!s.enterpriseFate.quarterlyReports)
        s.enterpriseFate.quarterlyReports = [];
      // 为每家公司添加新字段（兼容旧存档）
      for (var _cid2 in s.enterpriseFate.companies) {
        var _co2 = s.enterpriseFate.companies[_cid2];
        if (_co2) {
          if (typeof _co2.ipoed === "undefined") _co2.ipoed = false;
          if (typeof _co2.ipoDay === "undefined") _co2.ipoDay = null;
          if (typeof _co2.absorbedBy === "undefined") _co2.absorbedBy = null;
          if (typeof _co2.absorbedName === "undefined")
            _co2.absorbedName = null;
        }
      }
    }
    // v1.4 → v1.5 迁移：创业系统 + 内幕交易系统
    if (!s.startup) {
      s.startup = {
        status: "none",
        company: null,
        flags: {
          registered: false,
          firstProductLaunched: false,
          hasInvestors: false,
          ipoFiled: false,
          exited: false,
          exitType: null,
          exitDay: null,
          exitValue: 0,
        },
        history: {
          foundedDay: null,
          exitedDay: null,
          exitType: null,
          exitValue: 0,
          peakValuation: 0,
          totalRevenue: 0,
          employeesHired: 0,
        },
      };
    }
    if (!s.insiderTrading) {
      s.insiderTrading = {
        activeRumor: null,
        rumorHistory: [],
        tradeLog: [],
        audits: [],
        currentPenalty: {
          tradingBanned: false,
          tradingBanEndDay: 0,
          fine: 0,
          reputationDamage: 0,
        },
      };
    }
    // enterpriseFate pendingEvents 字段
    if (s.enterpriseFate && !s.enterpriseFate.pendingEvents) {
      s.enterpriseFate.pendingEvents = [];
    }
    // v1.5 → v1.6 迁移：链式事件队列
    if (s.flags && !s.flags._chainEventQueue) {
      s.flags._chainEventQueue = [];
    }
    // v1.5 → v1.6 迁移：世界参数反馈环
    if (!s._worldParams) {
      if (typeof createDefaultWorldParams === "function") {
        s._worldParams = createDefaultWorldParams();
      } else {
        s._worldParams = null;
      }
    }
    // v1.6 → v1.7 迁移：行动频次统计
    if (!s.stats) {
      s.stats = {
        actionFreq: {},
        actionFirstUse: {},
        tradeFreq: {},
        trainFreq: {},
        investFreq: {},
      };
    }
    // v1.8 → v1.9 迁移：频次追踪扩展（交易/技能/投资）
    if (!s.stats.tradeFreq) s.stats.tradeFreq = {};
    if (!s.stats.trainFreq) s.stats.trainFreq = {};
    if (!s.stats.investFreq) s.stats.investFreq = {};
    // v1.7 → v1.8 迁移：交易情报系统
    if (!s.trade) s.trade = {};
    if (!s.trade.visitedToday) s.trade.visitedToday = {};
    if (typeof s.trade._visitedDay === "undefined") s.trade._visitedDay = null;
    if (!s.trade.priceMemory) s.trade.priceMemory = [];
    if (typeof s.trade._todayTradeXp === "undefined") s.trade._todayTradeXp = 0;
    if (typeof s.trade._xpResetDay === "undefined") s.trade._xpResetDay = null;
    // v1.8 → v1.9 迁移：NPC信息发现系统
    if (s.relationships) {
      for (var _nid in s.relationships) {
        var _rel = s.relationships[_nid];
        if (_rel && !_rel.discovered) {
          var _aff = _rel.affinity || 0;
          _rel.discovered = {
            birthday: false,
            giftPrefers: false,
            favor: _aff >= 30,
            deepTask: _aff >= 70,
            presenceBonus: [],
            affinityRewards: [],
          };
          if (_aff >= 30) _rel.discovered.presenceBonus.push(30);
          if (_aff >= 60) _rel.discovered.presenceBonus.push(60);
          if (_aff >= 80) _rel.discovered.presenceBonus.push(80);
          if (_aff >= 30) _rel.discovered.affinityRewards.push(30);
          if (_aff >= 60) _rel.discovered.affinityRewards.push(60);
          if (_aff >= 80) _rel.discovered.affinityRewards.push(80);
        }
      }
    }
    // 叙事体验追踪
    if (s.flags && !s.flags._experiencedNarratives) {
      s.flags._experiencedNarratives = [];
    }
    // v1.9 → v2.0 迁移：装备实例按 slot 键统一（修复品质系统存储格式不一致）
    // 旧键（itemId_时间戳 / itemId_instance）统一迁到 slot 键；找不到旧品质降为 common
    if (typeof migrateEquipmentInstances === "function") {
      migrateEquipmentInstances(s);
    }
    // 版本升级标记
    if (!s.version) s.version = "1.0.0";
    s.version = "1.9.0";
    this._markAllDirty();
    this._notify();
  }

  /** 检查路径是否脏（自上次 cleanDirty 后） */
  isDirty(path) {
    return this._dirtyFlags.has(path);
  }

  /** 清除所有脏标记（渲染后调用） */
  cleanAllDirty() {
    this._dirtyFlags.clear();
  }

  /** 订阅状态变更 */
  onChange(callback) {
    this._listeners.push(callback);
  }

  // ====== 内部方法 ======
  _markAllDirty() {
    this._dirtyFlags.add("*");
  }

  _notify() {
    for (const cb of this._listeners) {
      try {
        cb(this._state);
      } catch (e) {
        /* 静默 */
      }
    }
  }
}

// ====== 单例导出 ======
const StateManager = new GameStateManager();

// 使其在全局可访问（方便调试）
if (typeof window !== "undefined") {
  window.StateManager = StateManager;
}

/**
 * 添加一条当日收支记录
 * @param {object} state - 游戏状态
 * @param {"income"|"expense"} type - 收入或支出
 * @param {string} category - 分类键（如 "job_income", "rent", "food"）
 * @param {number} amount - 金额（正数）
 * @param {string} description - 描述文本
 */
function addDailyTransaction(state, type, category, amount, description) {
  if (!state.flags._dailyTransactions) {
    state.flags._dailyTransactions = [];
  }
  state.flags._dailyTransactions.push({
    type: type,
    category: category,
    amount: Math.round(amount),
    description: description,
  });
}
