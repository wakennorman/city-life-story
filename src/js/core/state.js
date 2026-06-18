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
      timeSlot: "morning", // 'morning' | 'afternoon' | 'evening' (显示用)
      actionPoints: 100, // 当前行动力 (0-100)
      maxActionPoints: 100, // 每日行动力上限
      education: 0, // 0=大专, 1=本科, 2=研究生
      eduProgress: { studyPoints: 0, examsPassed: 0, totalExams: 6 },
    },

    // --- 经济 ---
    resources: {
      cash: 1500, // 现金（元）
      bankBalance: 0, // 银行存款
      debt: 5500, // 当前总欠款（兼容旧字段）
      villageDebt: 5500, // 欠村长的钱
      villageDebtInterest: 0, // 累计村长利息
      bankDebt: 0, // 欠银行的钱
      loanPrincipal: 5500, // 原始借款额
      loanDay: 0, // 借款日
      dailyInterest: 0.0035, // 日息 0.3%
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
    },

    // --- 住所 ---
    housing: {
      tier: 0, // 0=露宿, 1=合租床位, 2=单间, 3=一居室
      rentedDay: 0, // 租房日
      storageRented: false, // 是否租了仓库
      storageCapacity: 0, // 仓库额外容量
    },

    // --- 人际关系 ---
    relationships: {}, // { npcId: { affinity: -100~100, met: bool } }

    // --- 交易系统 ---
    trade: {
      currentLocation: "slum",
      totalProfit: 0,
      goodsPrices: {}, // { locationKey: { goodId: price } }
      priceTrends: {},
      lastPriceUpdate: 0,
    },

    // --- 就业 ---
    employment: {
      currentJob: null,
      jobStartDay: 0,
      completedShifts: {},
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
        },
      },
      fateEventCooldown: {},
      lastFateTick: 0,
    },

    // --- 天气 ---
    weather: {
      current: "sunny",
      temperature: 22,
      season: "spring",
      lastChanged: 0,
    },

    // --- 城管 ---
    chengguan: {
      heat: 0,
      lastRaid: 0,
      warnings: 0,
      relationship: 0, // -100~100 与城管的关系
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

  /** 导入存档 */
  importState(savedState) {
    this._state = savedState;
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
