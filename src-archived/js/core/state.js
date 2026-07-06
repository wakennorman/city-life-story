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
    version: "1.0.0",
    createdAt: now,
    lastPlayedAt: now,
    playTime: 0,

    // --- 玩家身份 ---
    player: {
      name: "无名",
      gender: "male",
      age: 20,
      birthday: { month: 6, day: 15 },

      // 街头 4 维属性 (0-100)
      physique: 22, // 体质
      intelligence: 20, // 智力
      agility: 24, // 敏捷
      mental: 26, // 心智

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
      timeSlot: "morning", // 'morning' | 'afternoon' | 'evening'
      actionPoints: 100, // 行动力点数 (0-100)，每行动消耗不同AP
      maxActionPoints: 100, // AP上限（可被住所/汽车加成提升）
    },

    // --- 经济 ---
    resources: {
      cash: 1000, // 现金（元）
      bankBalance: 0, // 银行存款
      debt: 3000, // 当前欠款
      loanPrincipal: 3000, // 原始借款额
      loanDay: 0, // 借款日
      dailyInterest: 0.001, // 日息 0.1%
      totalEarned: 0, // 终身总收入
    },

    // --- 基本需求 (0-100) ---
    needs: {
      hunger: 70,
      fatigue: 15,
      hygiene: 75,
      happiness: 55,
    },

    // --- 派生状态 ---
    status: {
      health: 100,
      fame: 0,
      comfort: 50, // 舒适度（0-100），受住所+衣物+天气影响
      emotionalState: "stable", // stable|happy|sad|angry|stressed|depressed
      sick: false,
      injured: false,
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
    education: 0,

    // --- 物品栏 ---
    inventory: {
      items: [], // [{ id, qty, avgBuyPrice, buyDay }]
      capacity: 20, // 基础容量（旧版兼容）
      containers: [], // [{ containerId, slot }] 装备的容器
      storage: {}, // { locationKey: [{ id, qty, avgBuyPrice }] } 各地暂存仓库
      equipment: {
        head: null,
        body: null,
        feet: null,
        hand: null,
        accessory: null,
      },
    },

    // --- 住所 ---
    housing: {
      tier: 0, // 0=露宿, 1=合租床位, 2=单间, 3=一居室
      rentedDay: 0, // 租房日
      storageRented: false, // 是否租了仓库
      storageCapacity: 0, // 仓库额外容量
    },

    // --- 人际关系 ---
    relationships: {
      chengguan: { affinity: 0, met: false, bribed: 0 }, // 城管关系：-100~100，met是否遇到过，bribed行贿次数
      landlord: { affinity: 0, met: false }, // 房东关系
      wholesaler: { affinity: 0, met: false }, // 批发商关系
      neighbors: {}, // 邻居关系 { npcId: affinity }
    },

    // --- 恋爱与婚姻 ---
    romance: {
      partner: null, // { name, gender, personality, affinity, age, job }
      relationship: "single", // single | dating | engaged | married | divorced
      datingDays: 0, // 恋爱天数
      marriageDays: 0, // 婚姻天数
      sharedCash: 0, // 共同财产（现金）
      sharedAssets: [], // 共同资产 [{ type, name, value }]
      children: [], // 子女 [{ name, age, gender }]
      lastEncounter: null, // 上次邂逅信息
    },

    // --- 交易系统 ---
    trade: {
      currentLocation: "slum",
      goodsPrices: {}, // { locationKey: { goodId: price } }
      priceTrends: {},
      lastPriceUpdate: 0,
      supplyDemand: {}, // { locationKey: { goodId: number } } 供需记录
      marketEvents: [], // [{ id, name, goodId, priceMod, remaining, desc }] 活跃市场事件
    },

    // --- 就业 ---
    employment: {
      currentJob: null,
      jobStartDay: 0,
      completedShifts: {},
    },

    // --- 投资 ---
    investment: {
      stocks: [], // [{ symbol, name, shares, avgPrice }]
      stockMarket: {}, // { symbol: { price, prevPrice, trend, history } }
      bitcoin: {
        holdings: 0, // 持有数量（BTC）
        avgPrice: 0, // 买入均价
      },
      bitcoinMarket: {
        price: 200000, // 当前价格
        prevPrice: 200000,
        fearGreed: 50, // 恐慌贪婪指数 0-100
        halvingCountdown: 1460, // 减半倒计时
      },
      realEstate: [], // [{ type, name, buyPrice, buyDay, monthlyRent }]
      vehicles: [], // [{ type, name, buyPrice, buyDay, monthlyMaint, apBonus }]
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
      projects: [],
      completedProjects: [],
    },

    // --- 疾病 ---
    diseases: {
      active: [], // [{ diseaseId, stage, days, severity }]
    },

    // --- 食材库存 ---
    ingredients: {
      items: {}, // { ingredientId: { qty, buyDay, expired } }
      capacity: 50, // 食材库存容量
      fridge: false, // 是否有冰箱（延长保质期）
    },

    // --- 随机事件日追踪（Random.canTriggerToday 使用） ---
    _randomDailyEvents: {},

    // --- 标志位 ---
    flags: {
      tutorialCompleted: false,
      gameOver: false,
      victory: false,
      victoryType: null,
      gameOverReason: null,
      ageThisYear: false,
      seenNewsToday: [],

      // --- 道德系统 ---
      moral: {
        score: 0, // 累计道德分 (-100 ~ 100)
        actions: [], // [{ id, choice, day }] — 道德选择历史
        pendingConsequences: [], // [{ eventId, dueDay, actionId }]
      },
    },

    // --- 成就系统 ---
    achievements: {
      unlocked: [], // [{ id, name, desc, unlockedAt }]
      stats: {
        totalDaysSurvived: 0,
        totalCashEarned: 0,
        totalJobsCompleted: 0,
        maxSingleDayIncome: 0,
        housesOwned: 0,
        companiesJoined: 0,
        highestRank: null,
        marriages: 0,
        children: 0,
        diseasesHealed: 0,
        itemsTraded: 0,
      },
    },

    // --- 天气 ---
    weather: {
      weatherId: "sunny", // 当前天气类型ID
      temperature: 20, // 当前温度（摄氏度）
      season: "spring", // 当前季节
      seasonDay: 1, // 季节内天数（1-30）
      year: 1, // 年份
      weatherDef: null, // 天气类型定义（缓存）
      tempEffect: null, // 温度体感效果（缓存）
    },

    // --- 事件与消息 ---
    activeNews: [],
    newsHistory: [],
    messageLog: [], // [{ day, text, type }]
  };
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

  /** 深度合并：defaults 为基础，saved 覆盖已有字段，缺失字段用默认值补齐 */
  _deepMerge(defaults, saved) {
    const result = { ...defaults };
    for (const key of Object.keys(saved)) {
      if (
        saved[key] !== null &&
        typeof saved[key] === "object" &&
        !Array.isArray(saved[key]) &&
        defaults[key] !== null &&
        typeof defaults[key] === "object" &&
        !Array.isArray(defaults[key])
      ) {
        result[key] = this._deepMerge(defaults[key], saved[key]);
      } else {
        result[key] = saved[key];
      }
    }
    return result;
  }

  /** 验证状态完整性 */
  _validateState(state) {
    if (!state || typeof state !== "object") return false;
    if (!state.player || typeof state.player !== "object") return false;
    if (typeof state.player.day !== "number" || state.player.day < 1)
      return false;
    if (typeof state.resources.cash !== "number") return false;
    if (!state.needs || typeof state.needs !== "object") return false;
    if (!state.skills || typeof state.skills !== "object") return false;
    return true;
  }

  /** 导入存档（与默认值深度合并，兼容旧版存档） */
  importState(savedState) {
    // 验证存档完整性
    if (!this._validateState(savedState)) {
      throw new Error("Invalid save data: missing required fields");
    }
    const defaults = createDefaultState();
    this._state = this._deepMerge(defaults, savedState);
    this._state.lastPlayedAt = Date.now();
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
