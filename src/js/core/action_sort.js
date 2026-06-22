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
 */

(function () {
  "use strict";

  // ====== 分类定义 ======
  // 顺序决定了页面上分类的显示顺序
  var CATEGORIES = [
    { id: "survival", name: "生存必需", icon: "🌾", order: 10 },
    { id: "work", name: "赚钱谋生", icon: "💼", order: 20 },
    { id: "appliance", name: "地点服务", icon: "🏪", order: 25 },
    { id: "shopping", name: "购物装备", icon: "🛒", order: 30 },
    { id: "education", name: "学习提升", icon: "🎓", order: 40 },
    { id: "social", name: "社交休闲", icon: "🎭", order: 50 },
    { id: "finance", name: "金融理财", icon: "💳", order: 60 },
    { id: "career", name: "职业发展", icon: "🏢", order: 70 },
    { id: "other", name: "其他", icon: "📌", order: 100 },
  ];

  // 快速查找：categoryId → CATEGORIES 索引
  var CATEGORY_INDEX = {};
  for (var ci = 0; ci < CATEGORIES.length; ci++) {
    CATEGORY_INDEX[CATEGORIES[ci].id] = ci;
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
    start_business: "career",

    // === 社交休闲 ===
    call_home: "social",
    remit_home: "social",
    salon_chat: "social",
    internet_bar: "social",
    movie: "social",
    ktv: "social",
    gym: "social",
    gift_npc: "social",
    diary: "social",
    meditation: "social",

    // === 学习提升 ===
    self_study: "education",
    night_school: "education",
    study: "education",
    set_dream: "education",
    view_dream: "education",

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
    set_dream: 25, // 确立人生目标
    view_dream: 26,
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
    start_business: 10, // 摆地摊创业（街头→创业的跳板）
    // corp_* 和 startup_* 保持默认50
  };

  // ====== 公共API ======

  /**
   * 根据 action ID 返回分类 ID
   * @param {string} actionId
   * @returns {string} 分类 ID
   */
  function getActionCategory(actionId) {
    if (!actionId) return "other";

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
   * @returns {number}
   */
  function getCategoryOrder(categoryId) {
    var idx = CATEGORY_INDEX[categoryId];
    return idx !== undefined ? idx : CATEGORIES.length - 1; // 未识别分类排最后
  }

  /**
   * 获取行动在同类内的默认优先级
   * @param {string} actionId
   * @returns {number}
   */
  function getActionPriority(actionId) {
    if (!actionId) return 999;
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

    var sorted = actions.slice(); // 不修改原数组

    sorted.sort(function (a, b) {
      // Level 1: 分类顺序
      var catA = getActionCategory(a.id);
      var catB = getActionCategory(b.id);
      var catOrdA = getCategoryOrder(catA);
      var catOrdB = getCategoryOrder(catB);
      if (catOrdA !== catOrdB) return catOrdA - catOrdB;

      // Level 2: 同类内默认优先级 + 新行动临时加成
      var priA = getActionPriority(a.id) + getActionNewBoost(a.id, state);
      var priB = getActionPriority(b.id) + getActionNewBoost(b.id, state);
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
      var cat = getActionCategory(action.id);
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(action);
    }

    return groups;
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
      for (var ai2 = 0; ai2 < actions.length; ai2++) {
        var act = actions[ai2];
        if (!act || !act.id) continue;
        var cat = getActionCategory(act.id);
        if (!auditMap[cat]) auditMap[cat] = [];
        auditMap[cat].push(act.id + "(" + (act.name || "") + ")");
        if (cat === "other") totalOther++;
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
        "精确匹配: " +
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
    getActionCategory: getActionCategory,
    getCategoryOrder: getCategoryOrder,
    getActionPriority: getActionPriority,
    isActionNew: isActionNew,
    getActionNewBoost: getActionNewBoost,
    sortActions: sortActions,
    groupActionsByCategory: groupActionsByCategory,
    runAudit: runAudit,
  };
})();
