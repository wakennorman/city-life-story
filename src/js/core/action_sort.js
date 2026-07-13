/**
 * 行动排序系统 — Action Sort
 *
 * 为游戏行动选项提供分类分组 + 多层排序。
 * 参考：《大多数》（分类Tab）、《中国式家长》（功能区分类）、《Stardew Valley》（工具分类）
 *
 * 排序层级：
 *   1. 分类优先级（固定，0=最先）
 *   2. 同类内默认优先级（关键行动置顶）
 *   3. 玩家点击频次（高频优先，轻量反馈）
 *   4. AP消耗（低消耗优先，便捷操作）
 *   5. 名称拼音（最终保底）
 *
 * 用法：ActionSort.sortActions(actions, state) → sorted[]
 *       ActionSort.groupActionsByCategory(actions, state) → { catId: [actions] }
 *
 * ====== [v3.99] UI 统一标准（约定式自动归类扩展） ======
 * 所有"可点击"元素采用统一 CSS 交互语言：
 *
 *   .interactive       — 标准可点击元素（hover → 高亮边框+抬升+阴影）
 *   .interactive:active — 触摸反馈（scale 0.97）
 *   .disabled          — 不可交互态（opacity 0.45 + cursor not-allowed）
 *
 * 行动对象约定字段：
 *   category (string)  → 所属分类（约定式优先）
 *   priority (number)  → 同类内排序（约定式优先）
 *   disabled (boolean) → true 时自动套用 .disabled 样式
 *
 * 渲染时惯例（由 renderActionsTab 执行）：
 *   1. 每个 action-card 自动获得 .action-card + .interactive（非 disabled）
 *   2. disabled = true 时自动增加 .disabled 类 + cursor not-allowed
 *   3. 无 category 字段 → 走 action_sort 的精确/前缀/兜底匹配
 */

(function () {
  "use strict";

  // ====== 分类定义 ======
  // 顺序决定了页面上分类的显示顺序
  // v3.0：赚钱谋生 → 短期临时工作（更准确）
  var CATEGORIES = [
    { id: "survival", name: "生存必需", icon: "🌾", order: 10 },
    { id: "work", name: "短期临时工作", icon: "💼", order: 20 },
    { id: "appliance", name: "地点服务", icon: "🏪", order: 25 },
    { id: "shopping", name: "购物装备", icon: "🛒", order: 30 },
    { id: "education", name: "学习提升", icon: "🎓", order: 40 },
    { id: "social", name: "社交休闲", icon: "🎭", order: 50 },
    { id: "restore", name: "生活服务", icon: "🏠", order: 55 },
    { id: "finance", name: "金融理财", icon: "💳", order: 60 },
    { id: "career", name: "职业发展", icon: "🏢", order: 70 },
    { id: "other", name: "其他", icon: "📌", order: 100 },
  ];

  /**
   * 地点感知分类重排 — 根据所在地点调整行动分类显示顺序
   *
   * 每个地点指定哪些分类优先展示（按数组顺序），其余分类按默认顺序排后。
   * 设计原则：
   *   - 银行 → 金融理财优先（存款/取款/贷款是核心功能）
   *   - 医院 → 生存必需优先（看病/治疗是首要需求）
   *   - 大学城/培训中心 → 学习提升优先（教育机构核心功能）
   *   - 科技园 → 职业发展优先（与职业/创业相关）
   *   - 批发市场 → 购物装备优先（进货/买卖是主要目的）
   *   - 建筑工地/工业区 → 短期临时工作优先（体力劳动者聚集）
   *   - 商业区 → 短期临时工作优先（商业活动中心）
   *   - 公园/寺庙/娱乐城 → 社交休闲优先（放松娱乐场所）
   *   - 城中村/郊区 → 生存必需优先（基本生活需求）
   *   - 政府办事大厅 → 地点服务优先（办证/社保是核心功能）
   */
  var LOCATION_CATEGORY_REORDER = {
    // 🏦 银行：金融理财 → 生存必需 → 短期工作 → 社交休闲 → 学习 → 职业 → 服务 → 购物
    bank: [
      "finance",
      "survival",
      "work",
      "social",
      "education",
      "career",
      "appliance",
      "shopping",
    ],

    // 🏥 医院：生存必需 → 短期工作 → 学习 → 社交 → 金融 → 职业 → 服务 → 购物
    hospital: [
      "survival",
      "work",
      "education",
      "social",
      "finance",
      "career",
      "appliance",
      "shopping",
    ],

    // 🎓 大学城：学习提升 → 社交休闲 → 短期工作 → 生存必需 → 金融 → 职业 → 服务 → 购物
    school: [
      "education",
      "social",
      "work",
      "survival",
      "finance",
      "career",
      "appliance",
      "shopping",
    ],

    // 📚 培训中心：学习提升 → 职业发展 → 短期工作 → 生存必需 → 金融 → 社交 → 服务 → 购物
    trainingCenter: [
      "education",
      "career",
      "work",
      "survival",
      "finance",
      "social",
      "appliance",
      "shopping",
    ],

    // 🌳 公园：社交休闲 → 生存必需 → 短期工作 → 学习 → 金融 → 职业 → 服务 → 购物
    park: [
      "social",
      "survival",
      "work",
      "education",
      "finance",
      "career",
      "appliance",
      "shopping",
    ],

    // 🏢 科技园：职业发展 → 学习提升 → 短期工作 → 金融 → 生存必需 → 社交 → 服务 → 购物
    techPark: [
      "career",
      "education",
      "work",
      "finance",
      "survival",
      "social",
      "appliance",
      "shopping",
    ],

    // 🏘️ 城中村：生存必需 → 短期工作 → 购物 → 学习 → 社交 → 金融 → 职业 → 服务
    slum: [
      "survival",
      "work",
      "shopping",
      "education",
      "social",
      "finance",
      "career",
      "appliance",
    ],

    // 🏪 批发市场：购物装备 → 短期工作 → 金融 → 生存必需 → 社交 → 学习 → 职业 → 服务
    wholesaleMarket: [
      "shopping",
      "work",
      "finance",
      "survival",
      "social",
      "education",
      "career",
      "appliance",
    ],

    // 🏗️ 建筑工地：短期临时工作 → 生存必需 → 购物 → 学习 → 社交 → 金融 → 职业 → 服务
    construction: [
      "work",
      "survival",
      "shopping",
      "education",
      "social",
      "finance",
      "career",
      "appliance",
    ],

    // 🏭 工业区：短期临时工作 → 生存必需 → 购物 → 学习 → 社交 → 金融 → 职业 → 服务
    factoryZone: [
      "work",
      "survival",
      "shopping",
      "education",
      "social",
      "finance",
      "career",
      "appliance",
    ],

    // 🏙️ 商业区：短期临时工作 → 购物 → 社交 → 生存必需 → 金融 → 学习 → 职业 → 服务
    commercialDist: [
      "work",
      "shopping",
      "social",
      "survival",
      "finance",
      "education",
      "career",
      "appliance",
    ],

    // 🎪 娱乐城：社交休闲 → 购物 → 短期工作 → 生存必需 → 金融 → 学习 → 职业 → 服务
    entertainment: [
      "social",
      "shopping",
      "work",
      "survival",
      "finance",
      "education",
      "career",
      "appliance",
    ],

    // 🥬 菜市场：购物 → 短期工作 → 生存必需 → 学习 → 社交 → 金融 → 职业 → 服务
    vegetable_market: [
      "shopping",
      "work",
      "survival",
      "education",
      "social",
      "finance",
      "career",
      "appliance",
    ],

    // 🏡 郊区：生存必需 → 短期工作 → 购物 → 学习 → 社交 → 金融 → 职业 → 服务
    suburb: [
      "survival",
      "work",
      "shopping",
      "education",
      "social",
      "finance",
      "career",
      "appliance",
    ],

    // 🏛️ 政府办事大厅：地点服务 → 金融 → 生存必需 → 短期工作 → 社交 → 学习 → 职业 → 购物
    gov_office: [
      "appliance",
      "finance",
      "survival",
      "work",
      "social",
      "education",
      "career",
      "shopping",
    ],

    // ⛩️ 寺庙：社交休闲 → 生存必需 → 学习 → 短期工作 → 金融 → 职业 → 服务 → 购物
    temple: [
      "social",
      "survival",
      "education",
      "work",
      "finance",
      "career",
      "appliance",
      "shopping",
    ],
  };

  // 快速查找：categoryId → CATEGORIES 索引
  var CATEGORY_INDEX = {};
  for (var ci2 = 0; ci2 < CATEGORIES.length; ci2++) {
    CATEGORY_INDEX[CATEGORIES[ci2].id] = ci2;
  }

  // ====== ID → 分类映射 ======
  // 前缀匹配规则（优先级：先匹配的优先）
  var PREFIX_RULES = [
    { pattern: /^job_/, category: "work" },
    { pattern: /^festival_job_/, category: "work" },
    { pattern: /^fest_/, category: "work" },
    { pattern: /^npc_/, category: "social" },
    { pattern: /^intel_/, category: "social" },
    { pattern: /^favor_/, category: "social" },
    { pattern: /^deeptask_/, category: "social" },
    { pattern: /^edu_/, category: "education" },
    { pattern: /^cert_/, category: "education" },
    { pattern: /^corp_(?!team_view$)/, category: "career" },
    { pattern: /^startup_/, category: "career" },
    { pattern: /^fame_/, category: "appliance" },
    { pattern: /^amenity_/, category: "appliance" },
    { pattern: /^buy_/, category: "shopping" },
    { pattern: /^item_shop_/, category: "shopping" },
    { pattern: /^deposit/, category: "finance" },
    { pattern: /^withdraw/, category: "finance" },
    { pattern: /^loan/, category: "finance" },
    { pattern: /^repay_(?!village$)/, category: "finance" },
  ];

  // 精确ID匹配（优先级高于前缀规则）
  var EXACT_MAP = {
    // === 生存必需 ===
    eat: "survival",
    rest: "survival",
    shower: "survival",
    heal: "survival",
    see_doctor: "survival",
    relax_park: "survival",
    go_home: "survival",
    pharmacy: "survival",

    // === 赚钱谋生 ===
    scavenge_trash: "work",
    busking: "work",
    beg: "work",
    vending_advice: "work",
    play_dice: "work",
    apply_job: "work",
    trade_header: "work",
    wholesale_header: "work",
    freelance_coding: "work",
    weekend_market: "work",
    monday_job_board: "work",

    // === 职业发展 ===
    corpteam_view: "career",
    corp_team_view: "career",
    // v3.2：start_business（摆地摊创业）从 other 移到 work 分类（用户要求归类到短期临时工作）
    start_business: "work",

    // === 社交休闲 ===
    call_home: "social",
    remit_home: "social",
    salon_chat: "social",
    internet_bar: "social",
    movie: "social",
    ktv: "social",
    gym: "social",
    hair_design: "social",
    gift_npc: "social",
    diary: "social",
    meditation: "social",

    // === 学习提升 ===
    self_study: "education",
    night_school: "education",
    study: "education",
    set_dream: "other", // v3.0：从 education 移到 other，归类到个人成长Tab的目标子项
    view_dream: "other",
    change_dream: "other", // v3.2：更改人生目标

    // === 购物装备 ===
    buy_ingredients: "shopping",
    supermarket: "shopping",
    clothing: "shopping",

    // === 金融理财 ===
    repay_village: "finance",
    deposit: "finance",
    withdraw: "finance",
    loan: "finance",
    repay: "finance",
    lottery: "finance",
    yu_e_bao: "finance",
    buy_insurance: "finance",
  };

  // 处理 buy_backpack_* → shopping 的精确前缀
  // buy_backpack_* 由前缀规则 ^buy_ 覆盖

  // 禁用/占位行动 → other
  var DISABLED_CATEGORY = "other";

  // ====== 同类默认优先级 ======
  // 数字越小越靠前（默认 50）
  var IN_CATEGORY_PRIORITY = {
    // 生存必需：关键行动置顶
    eat: 10,
    rest: 11,
    shower: 12,
    heal: 13,
    see_doctor: 14,
    pharmacy: 15,
    relax_park: 20,
    go_home: 30,

    // 赚钱谋生：正规工作优先
    apply_job: 10, // 求职（职场入口）
    // job_* 前缀的保持默认50，排在 apply_job 之后
    freelance_coding: 30, // 技能型收入
    weekend_market: 35,
    monday_job_board: 36,
    trade_header: 40, // 零售买卖（导航桩）
    wholesale_header: 41, // 批发进货（导航桩）
    scavenge_trash: 55,
    vending_advice: 56,
    busking: 60,
    play_dice: 65,
    beg: 70,

    // 学习提升：系统学习优先
    study: 10,
    self_study: 15,
    night_school: 20,
    // v3.0：set_dream / view_dream 移到"其他"分类，归类到个人成长Tab的目标子项
    set_dream: 5, // 但归类改为 other
    view_dream: 6,
    // edu_study 由前缀 ^edu_ 匹配，设默认50
    // edu_exam
    // edu_cert

    // 社交休闲：NPC互动优先
    call_home: 10,
    remit_home: 12,
    gift_npc: 14,
    // npc_* 前缀的保持默认50
    salon_chat: 55,
    internet_bar: 60,
    movie: 65,
    ktv: 70,
    gym: 50,
    hair_design: 58,
    diary: 75,
    meditation: 76,

    // 购物装备：食材采购优先
    buy_ingredients: 10,
    supermarket: 15,
    clothing: 20,
    // buy_* 前缀（背包升级等）保持默认50

    // 金融理财
    deposit: 10,
    withdraw: 15,
    repay_village: 16,
    repay: 17,
    yu_e_bao: 30,
    lottery: 35,
    buy_insurance: 40,
    // loan 保持默认50

    // 职业发展
    // v3.2：start_business（摆地摊创业）从 other 移到 work，放在短期工作靠下位置
    start_business: 50, // 摆地摊创业（归"短期临时工作"）
    // corp_* 和 startup_* 保持默认50
  };

  // ====== 公共API ======

  /**
   * 根据 action 对象或 ID 返回分类 ID
   * 约定式自动归类：行动对象声明 category 字段，系统自动读取
   * @param {Object|string} actionOrId - 行动对象（含 category/id）或行动 ID 字符串
   * @returns {string} 分类 ID
   */
  function getActionCategory(actionOrId) {
    if (!actionOrId) return "other";

    // 约定式优先：行动对象声明了 category 字段直接读取
    if (typeof actionOrId === "object" && actionOrId.category) {
      return actionOrId.category;
    }

    // 兼容旧调用：传入的是字符串 ID
    var actionId =
      typeof actionOrId === "string" ? actionOrId : actionOrId.id || "";

    // 1. 精确匹配
    if (EXACT_MAP.hasOwnProperty(actionId)) {
      return EXACT_MAP[actionId];
    }

    // 2. 前缀匹配
    for (var i = 0; i < PREFIX_RULES.length; i++) {
      var rule = PREFIX_RULES[i];
      if (rule.pattern.test(actionId)) {
        return rule.category;
      }
    }

    // 3. 兜底
    return "other";
  }

  /**
   * 获取分类在 CATEGORIES 数组中的顺序
   * @param {string} categoryId
   * @param {string} [locationId] - 可选，当前地点ID，启用感知重排
   * @returns {number}
   */
  function getCategoryOrder(categoryId, locationId) {
    // 如果指定了地点且该地点有重排规则 → 使用地点感知顺序
    if (locationId && LOCATION_CATEGORY_REORDER.hasOwnProperty(locationId)) {
      var reorder = LOCATION_CATEGORY_REORDER[locationId];
      var pos = reorder.indexOf(categoryId);
      if (pos !== -1) {
        return pos; // 0=最前
      }
      // 未在重排列表中的分类：排在所有重排分类之后，保留默认相对位置
      var defaultIdx = CATEGORY_INDEX[categoryId];
      return (
        (defaultIdx !== undefined ? defaultIdx : CATEGORIES.length - 1) +
        reorder.length
      );
    }
    // 默认顺序（无地点或地点无重排规则）
    var idx = CATEGORY_INDEX[categoryId];
    return idx !== undefined ? idx : CATEGORIES.length - 1; // 未识别分类排最后
  }

  /**
   * 获取行动在同类内的默认优先级
   * 约定式自动归类：行动对象声明 priority 字段，系统自动读取
   * @param {Object|string} actionOrId - 行动对象（含 priority/id）或行动 ID 字符串
   * @returns {number}
   */
  function getActionPriority(actionOrId) {
    if (!actionOrId) return 999;

    // 约定式优先：行动对象声明了 priority 字段直接读取
    if (
      typeof actionOrId === "object" &&
      typeof actionOrId.priority === "number"
    ) {
      return actionOrId.priority;
    }

    // 兼容旧调用：传入的是字符串 ID
    var actionId =
      typeof actionOrId === "string" ? actionOrId : actionOrId.id || "";

    if (IN_CATEGORY_PRIORITY.hasOwnProperty(actionId)) {
      return IN_CATEGORY_PRIORITY[actionId];
    }
    // 精确匹配在前缀匹配之下的优先级
    if (EXACT_MAP.hasOwnProperty(actionId)) {
      return 50;
    }
    // 对于以 _ 分隔的泛化匹配，尝试匹配单纯前缀模式的部分
    // job_waste_recycling → 检查是否有 job_ 通用优先级? 用默认
    return 50;
  }

  /**
   * 判断行动是否为"新解锁"（首次使用后 3 天内）
   * @param {string} actionId
   * @param {Object} state
   * @returns {boolean}
   */
  function isActionNew(actionId, state) {
    if (!actionId || !state || !state.player) return false;
    var firstUse =
      state.stats && state.stats.actionFirstUse
        ? state.stats.actionFirstUse
        : {};
    var day = firstUse[actionId];
    if (typeof day === "undefined" || day === null) return false;
    var currentDay = state.player.day || 0;
    return currentDay - day >= 0 && currentDay - day <= 3;
  }

  /**
   * 获取新行动在排序中的临时优先级加成（负值 = 越靠前）
   * 第0天（刚使用）：-40（几乎置顶）
   * 第1天：-25
   * 第2天：-15
   * 第3天：-5（微弱推动）
   * 第4天+：0（过期）
   * @param {string} actionId
   * @param {Object} state
   * @returns {number}
   */
  function getActionNewBoost(actionId, state) {
    if (!actionId || !state || !state.player) return 0;
    var firstUse =
      state.stats && state.stats.actionFirstUse
        ? state.stats.actionFirstUse
        : {};
    var day = firstUse[actionId];
    if (typeof day === "undefined" || day === null) return 0;
    var currentDay = state.player.day || 0;
    var age = currentDay - day;
    if (age < 0 || age > 3) return 0;
    if (age === 0) return -40; // 今天刚用 → 非常靠前
    if (age === 1) return -25;
    if (age === 2) return -15;
    if (age === 3) return -5; // 最后一天微推
    return 0;
  }

  /**
   * 多层排序主函数
   * @param {Array} actions - 行动数组
   * @param {Object} state - 游戏状态（用于读取频次和新行动状态）
   * @returns {Array} 排序后的新数组
   */
  function sortActions(actions, state) {
    var freq =
      state && state.stats && state.stats.actionFreq
        ? state.stats.actionFreq
        : {};

    // v3.12：提取当前地点用于地点感知分类重排
    var currentLocation =
      state && state.trade && state.trade.currentLocation
        ? state.trade.currentLocation
        : null;

    var sorted = actions.slice(); // 不修改原数组

    sorted.sort(function (a, b) {
      // Level 1: 分类顺序（地点感知）— 传入完整行动对象以支持约定式 category 字段
      var catA = getActionCategory(a);
      var catB = getActionCategory(b);
      var catOrdA = getCategoryOrder(catA, currentLocation);
      var catOrdB = getCategoryOrder(catB, currentLocation);
      if (catOrdA !== catOrdB) return catOrdA - catOrdB;

      // Level 2: 同类内默认优先级 + 新行动临时加成 — 传入完整行动对象
      var priA = getActionPriority(a) + getActionNewBoost(a.id, state);
      var priB = getActionPriority(b) + getActionNewBoost(b.id, state);
      if (priA !== priB) return priA - priB;

      // Level 3: 禁用项排同类末尾
      var disA = a.disabled ? 1 : 0;
      var disB = b.disabled ? 1 : 0;
      if (disA !== disB) return disA - disB;

      // Level 4: 点击频次（高频优先）
      var freqA = freq[a.id] || 0;
      var freqB = freq[b.id] || 0;
      if (freqA !== freqB) return freqB - freqA;

      // Level 5: AP消耗（低消耗优先）
      var apA = a.apCost || 0;
      var apB = b.apCost || 0;
      if (apA !== apB) return apA - apB;

      // Level 6: 名称拼音（保底）
      var nameA = a.name || a.id || "";
      var nameB = b.name || b.id || "";
      return nameA.localeCompare(nameB, "zh-CN");
    });

    return sorted;
  }

  /**
   * 按分类分组
   * @param {Array} actions - 已排序的行动数组
   * @param {Object} state - 游戏状态
   * @returns {Object} { categoryId: [actions] }
   */
  function groupActionsByCategory(actions, state) {
    var groups = {};

    for (var i = 0; i < actions.length; i++) {
      var action = actions[i];
      var cat = getActionCategory(action);
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(action);
    }

    return groups;
  }

  /**
   * 获取地点感知的分类顺序（用于UI渲染迭代）
   * 返回按地点优先级排序的 CATEGORIES 数组副本
   * 若地点无重排规则，返回默认顺序
   * @param {string} [locationId] - 当前地点ID
   * @returns {Array} 排序后的分类数组
   */
  function getLocationCategories(locationId) {
    if (!locationId || !LOCATION_CATEGORY_REORDER.hasOwnProperty(locationId)) {
      return CATEGORIES; // 默认顺序
    }
    var reordered = CATEGORIES.slice();
    reordered.sort(function (a, b) {
      return (
        getCategoryOrder(a.id, locationId) - getCategoryOrder(b.id, locationId)
      );
    });
    return reordered;
  }

  /**
   * 获取当前地点的分类推荐文案（智能标题提示）
   * @param {string} locationId
   * @returns {string|null}
   */
  function getLocationCategoryHint(locationId) {
    var hints = {
      bank: "💰 金融理财服务已置顶 — 存取款/贷款优先展示",
      hospital: "🏥 看病治疗置顶 — 生存必需优先展示",
      school: "📖 学习提升置顶 — 教育培训优先展示",
      trainingCenter: "📚 考证学习置顶 — 职业发展/培训优先展示",
      park: "🌳 休闲放松置顶 — 社交休闲优先展示",
      techPark: "💼 职业发展置顶 — 科技园相关行动优先展示",
      slum: "🏘️ 基本生存置顶 — 城中村生活需求优先展示",
      wholesaleMarket: "🛒 进货买卖置顶 — 批发交易优先展示",
      construction: "🏗️ 体力工作置顶 — 工地工作优先展示",
      factoryZone: "🏭 工厂工作置顶 — 工业区优先展示",
      commercialDist: "🏙️ 商业活动置顶 — 赚钱/购物优先展示",
      entertainment: "🎪 娱乐休闲置顶 — 社交/购物优先展示",
      suburb: "🏡 基本生活置顶 — 郊区生活需求优先展示",
      gov_office: "🏛️ 政务服务置顶 — 办证/社保优先展示",
      temple: "⛩️ 心灵休憩置顶 — 祈福/社交优先展示",
    };
    return hints[locationId] || null;
  }

  // ====== 处理 travel_ / housing_ / storage_ 分类特殊放行 ======
  // 这些行动由 renderActionsTab 先分离出去，不会进入分类系统
  // getActionCategory 对它们依然返回各自分类（travel→other, housing→other）
  // 因此分离逻辑必须发生在 sort 之前

  // ====== 运行时审计（控制台调用） ======
  /**
   * 在游戏启动后调用，打印所有已注册的 action_sort 映射摘要
   * 用法：ActionSort.runAudit()
   *       或从 getAvailableActions() 传入 actions 数组运行完整审计
   */
  function runAudit(actions) {
    var totalExact = 0,
      totalPrefix = 0,
      totalOther = 0;
    var lines = ["===== ActionSort 审计 ====="];
    lines.push("分类数: " + CATEGORIES.length);
    for (var ai = 0; ai < CATEGORIES.length; ai++) {
      var c = CATEGORIES[ai];
      lines.push(
        "  " + c.order + ". " + c.icon + " " + c.name + " (id:" + c.id + ")",
      );
    }
    lines.push("");
    lines.push(
      "精确映射 (EXACT_MAP): " + Object.keys(EXACT_MAP).length + " 条",
    );
    lines.push("前缀规则 (PREFIX_RULES): " + PREFIX_RULES.length + " 条");
    lines.push(
      "同类优先级 (IN_CATEGORY_PRIORITY): " +
        Object.keys(IN_CATEGORY_PRIORITY).length +
        " 条",
    );

    if (actions && actions.length > 0) {
      lines.push("");
      lines.push("行动审计 (" + actions.length + " 个行动):");
      var auditMap = {};
      var totalDeclared = 0;
      for (var ai2 = 0; ai2 < actions.length; ai2++) {
        var act = actions[ai2];
        if (!act || !act.id) continue;
        var cat = getActionCategory(act);
        if (!auditMap[cat]) auditMap[cat] = [];
        auditMap[cat].push(act.id + "(" + (act.name || "") + ")");
        if (cat === "other") totalOther++;
        else if (typeof act.category === "string") totalDeclared++;
        else if (EXACT_MAP.hasOwnProperty(act.id)) totalExact++;
        else totalPrefix++;
      }
      for (var ci2 = 0; ci2 < CATEGORIES.length; ci2++) {
        var catId2 = CATEGORIES[ci2].id;
        var items = auditMap[catId2];
        if (items && items.length > 0) {
          lines.push(
            "  " +
              CATEGORIES[ci2].icon +
              " " +
              CATEGORIES[ci2].name +
              " (" +
              items.length +
              "):",
          );
          lines.push("    " + items.join(", "));
        }
      }
      lines.push("");
      lines.push(
        "约定式声明: " +
          totalDeclared +
          " | 精确匹配: " +
          totalExact +
          " | 前缀匹配: " +
          totalPrefix +
          " | 兜底(other): " +
          totalOther,
      );
    }
    lines.push("===== 审计结束 =====");
    console.log(lines.join("\n"));
    return {
      totalExact: totalExact,
      totalPrefix: totalPrefix,
      totalOther: totalOther,
    };
  }

  // ====== 全局注册 ======
  window.ActionSort = {
    CATEGORIES: CATEGORIES,
    LOCATION_CATEGORY_REORDER: LOCATION_CATEGORY_REORDER,
    getActionCategory: getActionCategory,
    getCategoryOrder: getCategoryOrder,
    getActionPriority: getActionPriority,
    isActionNew: isActionNew,
    getActionNewBoost: getActionNewBoost,
    sortActions: sortActions,
    groupActionsByCategory: groupActionsByCategory,
    getLocationCategories: getLocationCategories,
    getLocationCategoryHint: getLocationCategoryHint,
    runAudit: runAudit,
  };
})();
