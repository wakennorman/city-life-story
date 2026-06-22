/**
 * 分类排序工具 — SortUtils
 *
 * 通用交互列表排序系统，适用于所有"可点击选项列表"。
 * 将 ActionSort 的 分类优先+频次辅助 模式抽象为可配置的排序函数。
 *
 * 排序层级（5层）：
 *   1. 分类固定顺序（生存必需 > 赚钱谋生 > ... > 其他）
 *   2. 同类内默认优先级（关键条目置顶）
 *   3. 交互频次（高频优先，轻量反馈）
 *   4. 成本消耗（低消耗优先）
 *   5. 名称拼音（最终保底）
 *
 * 用法：
 *   SortUtils.sortInteractiveList(items, config, state) → sorted[]
 *   SortUtils.registerListType(id, config) → 注册新列表类型
 *   SortUtils.detectApplicableLists() → 审计所有注册列表
 *
 * 检测规则（判断一个列表是否适用本系统）：
 *   1. 以可点击卡片/按钮的网格或列表渲染（非纯展示）
 *   2. 条目有唯一字符串 ID
 *   3. 条目数 >5
 *   4. 条目有分类依据（category / type / industry 等字段，或可按规则分组）
 *   5. 玩家与它多轮次多次交互
 *
 * 未来新增内容后自动使用本系统：
 *   1. 在数据定义中检查是否有 category/type/industry 字段
 *   2. 确认条目数是否 >5
 *   3. 调用 SortUtils.registerListType() 注册配置
 *   4. 在对应的 render 函数中调用 sortInteractiveList() 排序
 *   5. 在交互事件中更新频次追踪
 */

(function () {
  "use strict";

  // ====== 注册表 ======
  var LIST_REGISTRY = {};

  /**
   * 注册一个新列表类型
   * @param {string} id - 唯一标识
   * @param {Object} config - 排序配置
   * @param {string} config.name - 显示名称
   * @param {string[]} config.categoryOrder - 分类固定顺序（升序=先显示）
   * @param {Object} [config.priorityMap] - 同类默认优先级 { id: number }
   * @param {string} [config.freqMap] - state.stats 中的频次字段名
   * @param {Function} config.getCategory - (item) => categoryId
   * @param {Function} config.getFreqKey - (item) => key into freqMap
   * @param {Function} [config.getCost] - (item) => cost number（升序优先）
   * @param {Function} config.getName - (item) => display name string
   * @param {string} [config.description] - 列表描述
   */
  function registerListType(id, config) {
    if (!id || !config) return;
    LIST_REGISTRY[id] = {
      id: id,
      name: config.name || id,
      categoryOrder: config.categoryOrder || [],
      priorityMap: config.priorityMap || {},
      freqMap: config.freqMap || null,
      getCategory:
        config.getCategory ||
        function () {
          return "other";
        },
      getFreqKey:
        config.getFreqKey ||
        function (item) {
          return item.id;
        },
      getCost:
        config.getCost ||
        function () {
          return 0;
        },
      getName:
        config.getName ||
        function (item) {
          return item.name || item.id || "";
        },
      description: config.description || "",
    };
  }

  /**
   * 通用多层排序
   * @param {Array} items - 条目数组
   * @param {Object} config - 排序配置（同 registerListType 的 config）
   * @param {Object} state - 游戏状态（读取频次）
   * @returns {Array} 新排序数组
   */
  function sortInteractiveList(items, config, state) {
    if (!items || items.length === 0) return items || [];

    // 构建 categoryOrder 查找表
    var catIndex = {};
    if (config.categoryOrder) {
      for (var ci = 0; ci < config.categoryOrder.length; ci++) {
        catIndex[config.categoryOrder[ci]] = ci;
      }
    }

    // 获取频次映射
    var freq = {};
    if (config.freqMap && state && state.stats) {
      freq = state.stats[config.freqMap] || {};
    }

    var defaultPriority = config.priorityMap || {};

    var sorted = items.slice();
    sorted.sort(function (a, b) {
      // Level 1: 分类顺序
      var catA = config.getCategory ? config.getCategory(a) : "other";
      var catB = config.getCategory ? config.getCategory(b) : "other";
      var idxA = catIndex.hasOwnProperty(catA) ? catIndex[catA] : 999;
      var idxB = catIndex.hasOwnProperty(catB) ? catIndex[catB] : 999;
      if (idxA !== idxB) return idxA - idxB;

      // Level 2: 同类内默认优先级
      var keyA = config.getFreqKey ? config.getFreqKey(a) : a.id;
      var keyB = config.getFreqKey ? config.getFreqKey(b) : b.id;
      var priA = defaultPriority.hasOwnProperty(keyA)
        ? defaultPriority[keyA]
        : 50;
      var priB = defaultPriority.hasOwnProperty(keyB)
        ? defaultPriority[keyB]
        : 50;
      if (priA !== priB) return priA - priB;

      // Level 3: 交互频次（高频优先）
      var freqA = freq[keyA] || 0;
      var freqB = freq[keyB] || 0;
      if (freqA !== freqB) return freqB - freqA;

      // Level 4: 成本消耗（低消耗优先）
      if (config.getCost) {
        var costA = config.getCost(a) || 0;
        var costB = config.getCost(b) || 0;
        if (costA !== costB) return costA - costB;
      }

      // Level 5: 名称拼音（保底）
      var nameA = config.getName ? config.getName(a) : a.name || a.id || "";
      var nameB = config.getName ? config.getName(b) : b.name || b.id || "";
      return nameA.localeCompare(nameB, "zh-CN");
    });

    return sorted;
  }

  /**
   * 审计所有已注册列表的输出
   * @param {Object} state - 游戏状态
   * @returns {Array} 审计结果数组
   */
  function detectApplicableLists(state) {
    var results = [];
    var ids = Object.keys(LIST_REGISTRY);
    for (var i = 0; i < ids.length; i++) {
      var def = LIST_REGISTRY[ids[i]];
      var freqSize = 0;
      var freqKey = def.freqMap;
      if (freqKey && state && state.stats && state.stats[freqKey]) {
        freqSize = Object.keys(state.stats[freqKey]).length;
      }
      results.push({
        id: def.id,
        name: def.name,
        description: def.description,
        categoryCount: def.categoryOrder ? def.categoryOrder.length : 0,
        freqTrackingActive: freqKey
          ? state && state.stats && state.stats[freqKey]
            ? true
            : false
          : false,
        freqEntries: freqSize,
        layers: 5,
      });
    }
    return results;
  }

  /**
   * 获取注册列表定义
   * @param {string} id
   * @returns {Object|null}
   */
  function getListDef(id) {
    return LIST_REGISTRY[id] || null;
  }

  /**
   * 获取所有已注册列表 ID
   * @returns {string[]}
   */
  function getRegisteredIds() {
    return Object.keys(LIST_REGISTRY);
  }

  // ====== 技能分类辅助函数 ======
  var SKILL_CATEGORY_MAP = {
    cooking: "practical",
    repair: "practical",
    electrician: "practical",
    welding: "practical",
    coding: "academic",
    english: "academic",
    accounting: "academic",
    driving: "physical",
    sales: "physical",
    management: "physical",
  };

  function getSkillCategory(skillId) {
    return SKILL_CATEGORY_MAP[skillId] || "physical";
  }

  // ====== 注册内置列表类型 ======

  // 1. 交易商品列表
  registerListType("trade_goods", {
    name: "交易商品",
    description: "市场购买/出售的商品列表，按品类→频次→价格→名称排序",
    categoryOrder: [
      "food",
      "daily",
      "clothing",
      "electronics",
      "luxury",
      "scrap",
    ],
    priorityMap: {
      water: 10,
      rice: 11,
      vegetables: 12,
      fruits: 13,
      noodles: 14,
      pork: 20,
      beef: 21,
      chicken: 22,
      fish: 23,
      egg: 24,
      milk: 25,
      daily_use: 15,
    },
    freqMap: "tradeFreq",
    getCategory: function (g) {
      return g.category || "other";
    },
    getFreqKey: function (g) {
      return g.id;
    },
    getCost: function (g) {
      return g.basePrice || 0;
    },
    getName: function (g) {
      return g.name || g.id;
    },
  });

  // 2. 技能列表
  registerListType("skills", {
    name: "技能训练",
    description: "技能训练列表，按实用型→学术型→体能型分组，频次优先",
    categoryOrder: ["practical", "academic", "physical"],
    priorityMap: {
      cooking: 10,
      repair: 15,
      coding: 20,
      driving: 25,
      english: 30,
      accounting: 35,
      electrician: 40,
      management: 45,
      sales: 50,
      welding: 55,
    },
    freqMap: "trainFreq",
    getCategory: function (s) {
      return getSkillCategory(s.id);
    },
    getFreqKey: function (s) {
      return s.id;
    },
    getCost: function (s) {
      return 15;
    },
    getName: function (s) {
      return s.name || s.id;
    },
  });

  // 3. 投资股票列表（股票子标签内）
  registerListType("stocks", {
    name: "投资股票",
    description: "股票市场（A股），按行业→频次→价格→代码排序",
    categoryOrder: ["科技", "新能源", "消费", "金融", "房地产", "医药"],
    priorityMap: {},
    freqMap: "investFreq",
    getCategory: function (s) {
      return s.industry || "其他";
    },
    getFreqKey: function (s) {
      return s.symbol;
    },
    getCost: function (s) {
      return s.basePrice || 0;
    },
    getName: function (s) {
      return s.symbol;
    },
  });

  // ====== 全局注册 ======
  window.SortUtils = {
    sortInteractiveList: sortInteractiveList,
    registerListType: registerListType,
    detectApplicableLists: detectApplicableLists,
    getListDef: getListDef,
    getRegisteredIds: getRegisteredIds,
    getSkillCategory: getSkillCategory,
  };
})();
