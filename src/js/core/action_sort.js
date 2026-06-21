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
    eat: "survival",
    rest: "survival",
    shower: "survival",
    heal: "survival",
    see_doctor: "survival",
    relax_park: "survival",
    pharmacy: "survival",
    go_home: "survival",

    scavenge_trash: "work",
    busking: "work",
    beg: "work",
    vending_advice: "work",
    play_dice: "work",
    apply_job: "work",
    corpteam_view: "career",
    corp_team_view: "career",

    call_home: "social",
    remit_home: "social",
    salon_chat: "social",
    internet_bar: "social",
    movie: "social",
    ktv: "social",
    gym: "social",

    self_study: "education",
    night_school: "education",
    study: "education",

    buy_ingredients: "shopping",
    pharmacy: "shopping",

    repay_village: "finance",
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
    relax_park: 20,
    pharmacy: 25,
    go_home: 30,
    // 赚钱谋生：正规工作优先
    apply_job: 10, // 求职（职场入口）
    // job_* 前缀的保持默认50，排在 apply_job 之后
    scavenge_trash: 55, // 拾荒（替代性收入）
    vending_advice: 56,
    busking: 60,
    play_dice: 65,
    beg: 70,
    // 学习提升：系统学习优先
    study: 10, // 培训中心学习
    self_study: 15, // 图书馆自习
    night_school: 20, // 夜校
    // edu_study 由前缀 ^edu_ 匹配，设默认50
    // edu_exam
    // edu_cert
    // 社交休闲：NPC互动优先
    call_home: 10,
    remit_home: 12,
    // npc_* 前缀的保持默认50
    salon_chat: 55,
    internet_bar: 60,
    movie: 65,
    ktv: 70,
    gym: 50, // 健身归于成长
    // 购物装备：食材采购优先
    buy_ingredients: 10,
    // buy_* 前缀（背包升级等）保持默认50
    // 金融理财
    deposit: 10,
    withdraw: 15,
    repay_village: 16,
    // 职业发展
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
   * 多层排序主函数
   * @param {Array} actions - 行动数组
   * @param {Object} state - 游戏状态（用于读取频次）
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

      // Level 2: 同类内默认优先级
      var priA = getActionPriority(a.id);
      var priB = getActionPriority(b.id);
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

  // ====== 全局注册 ======
  window.ActionSort = {
    CATEGORIES: CATEGORIES,
    getActionCategory: getActionCategory,
    getCategoryOrder: getCategoryOrder,
    getActionPriority: getActionPriority,
    sortActions: sortActions,
    groupActionsByCategory: groupActionsByCategory,
  };
})();
