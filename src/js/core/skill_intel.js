/**
 * 技能情报系统 — 各技能门控数据/价格可见度（v1.0）
 *
 * 延续 trade_intel.js 的「技能等级决定可见度」模式，
 * 为会计/烹饪/维修/驾驶/编程 5 个技能增加信息门控预览。
 *
 * 设计原则：
 *   1. 每个技能 3 档可见度（Lv.20 / Lv.40 / Lv.60）
 *   2. 产生紧凑的 HTML 预览文本（适配 action-card 的 pricePreview 槽位）
 *   3. 每个函数以 buildSkillNamePreview 命名，返回 string
 *   4. 纯展示层，不修改任何游戏数据
 *
 * 依赖: state.skills.xxx.level, goods.js, items.js
 * 在 index.html 中位于 trade_intel.js 之后、render.js 之前加载
 */

// ====== 技能可见度阈值定义（每技能4档，Lv.0/Lv.20/Lv.40/Lv.60） ======
var SKILL_INTEL_THRESHOLDS = {
  accounting: {
    PNL: 20, // 日收支明细
    ROI: 40, // 投资回报率估算
    TAX_TIP: 60, // 税务/利率提示
  },
  cooking: {
    COST_ESTIMATE: 20, // 食材成本估算
    VALUE_COMPARE: 40, // 性价比对比（在家做vs外卖）
    MARKET_TREND: 60, // 食材价格波动
  },
  repair: {
    WEAR_LEVEL: 20, // 磨损程度
    REPAIR_COST: 40, // 维修成本预估
    RESALE_VALUE: 60, // 二手估值
  },
  driving: {
    ROUTE_COST: 20, // 各路线可行成本
    DELIVERY_EVAL: 40, // 配送费合理性
    BEST_ROUTE: 60, // 最优路线推荐
  },
  coding: {
    HOURS_ESTIMATE: 20, // 工时估算
    QUOTE_EVAL: 40, // 报价合理性
    TECH_DEBT: 60, // 技术债务评估
  },
};

// ====== 会计技能 — 财务情报 ======

function canSeeAccountingPnL(state) {
  var lvl =
    (state.skills &&
      state.skills.accounting &&
      state.skills.accounting.level) ||
    0;
  return lvl >= SKILL_INTEL_THRESHOLDS.accounting.PNL;
}

function canSeeAccountingROI(state) {
  var lvl =
    (state.skills &&
      state.skills.accounting &&
      state.skills.accounting.level) ||
    0;
  return lvl >= SKILL_INTEL_THRESHOLDS.accounting.ROI;
}

function canSeeAccountingTaxTip(state) {
  var lvl =
    (state.skills &&
      state.skills.accounting &&
      state.skills.accounting.level) ||
    0;
  return lvl >= SKILL_INTEL_THRESHOLDS.accounting.TAX_TIP;
}

/**
 * 构建会计财务预览（用于银行/投资/存款等 action card）
 * @param {object} state - 游戏状态
 * @param {string} context - "bank" | "investment" | "deposit"
 * @returns {string} 预览文本（可能为空）
 */
function buildAccountingPreview(state, context) {
  var parts = [];
  var lvl =
    (state.skills &&
      state.skills.accounting &&
      state.skills.accounting.level) ||
    0;

  // Lv.20: 日收支统计
  if (lvl >= SKILL_INTEL_THRESHOLDS.accounting.PNL) {
    var todayIncome =
      state.stats && state.stats.dailyIncome ? state.stats.dailyIncome : 0;
    var todayExpense =
      state.stats && state.stats.dailyExpense ? state.stats.dailyExpense : 0;
    var net = todayIncome - todayExpense;
    parts.push(
      "📊 今日收支: +¥" +
        todayIncome +
        " / -¥" +
        todayExpense +
        (net >= 0 ? " (盈余¥" + net + ")" : " (赤字¥" + Math.abs(net) + ")"),
    );
  }

  // Lv.40: 投资回报率
  if (
    lvl >= SKILL_INTEL_THRESHOLDS.accounting.ROI &&
    (context === "investment" || context === "bank")
  ) {
    var deposits =
      state.finance && state.finance.deposits ? state.finance.deposits : 0;
    var bankRate =
      typeof getBankInterestRate === "function"
        ? getBankInterestRate(state)
        : 0.02;
    if (deposits > 0) {
      var yearlyInterest = Math.round(deposits * bankRate);
      var monthlyInterest = Math.round(yearlyInterest / 12);
      parts.push(
        "🏦 存款年化" +
          (bankRate * 100).toFixed(1) +
          "% → 月息≈¥" +
          monthlyInterest,
      );
    } else {
      parts.push("🏦 当前年利率" + (bankRate * 100).toFixed(1) + "%");
    }
  }

  // Lv.60: 税务/理财提示
  if (lvl >= SKILL_INTEL_THRESHOLDS.accounting.TAX_TIP) {
    if (state.resources && state.resources.cash > 5000) {
      var nonEarningCash =
        state.resources.cash -
        (state.finance && state.finance.deposits ? state.finance.deposits : 0);
      if (nonEarningCash > 3000) {
        parts.push(
          "💡 闲钱¥" +
            nonEarningCash +
            "建议存银行，每月多赚¥" +
            Math.round((nonEarningCash * bankRate) / 12),
        );
      }
    }
  }

  return parts.length > 0 ? parts.join("<br>") : "";
}

// ====== 烹饪技能 — 食材/菜品价格情报 ======

function canSeeCookingCost(state) {
  var lvl =
    (state.skills && state.skills.cooking && state.skills.cooking.level) || 0;
  return lvl >= SKILL_INTEL_THRESHOLDS.cooking.COST_ESTIMATE;
}

function canSeeCookingValueCompare(state) {
  var lvl =
    (state.skills && state.skills.cooking && state.skills.cooking.level) || 0;
  return lvl >= SKILL_INTEL_THRESHOLDS.cooking.VALUE_COMPARE;
}

function canSeeCookingMarketTrend(state) {
  var lvl =
    (state.skills && state.skills.cooking && state.skills.cooking.level) || 0;
  return lvl >= SKILL_INTEL_THRESHOLDS.cooking.MARKET_TREND;
}

/**
 * 估算食材成本（从当前市场价格或基准价计算）
 */
function estimateIngredientCost(itemId, state) {
  // 尝试从市场价格获取
  var prices = state.trade && state.trade.goodsPrices;
  if (prices) {
    for (var locKey in prices) {
      if (!prices.hasOwnProperty(locKey)) continue;
      var locPrices = prices[locKey];
      if (locPrices && typeof locPrices[itemId] === "number") {
        return locPrices[itemId];
      }
    }
  }
  // 兜底基准价
  var basePrices = {
    rice: 3,
    tomato: 4,
    egg: 2,
    salt: 1,
    cooking_oil: 5,
    bok_choy: 3,
    pork: 8,
    noodles: 3,
    cabbage: 3,
    radish: 3,
    chili: 2,
    soy_sauce: 3,
    sugar: 2,
    ginger: 4,
    fish: 10,
    chicken: 9,
    shrimp: 15,
    beef: 12,
    tofu: 3,
    mushroom: 5,
    garlic: 2,
    vinegar: 3,
    starch: 2,
    sesame_oil: 6,
  };
  return basePrices[itemId] || 3;
}

/**
 * 构建烹饪价格预览（用于 cook action card）
 * @param {object} state - 游戏状态
 * @param {object} recipe - COOKING_RECIPES 中的食谱对象
 * @returns {string} 预览文本
 */
function buildCookingPreview(state, recipe) {
  if (!recipe || !recipe.ingredients) return "";
  var parts = [];
  var lvl =
    (state.skills && state.skills.cooking && state.skills.cooking.level) || 0;

  // Lv.20: 食材成本
  if (lvl >= SKILL_INTEL_THRESHOLDS.cooking.COST_ESTIMATE) {
    var totalCost = 0;
    var ingList = [];
    for (var i = 0; i < recipe.ingredients.length; i++) {
      var ing = recipe.ingredients[i];
      var price = estimateIngredientCost(ing.itemId, state);
      totalCost += price * ing.amount;
      ingList.push(ing.itemId + "×" + ing.amount);
    }
    parts.push("🧾 食材成本≈¥" + totalCost);
  }

  // Lv.40: 性价比对比
  if (lvl >= SKILL_INTEL_THRESHOLDS.cooking.VALUE_COMPARE) {
    var hungerRestore = recipe.hungerRestore || 0;
    var totalCost2 = 0;
    for (var j = 0; j < recipe.ingredients.length; j++) {
      var ing2 = recipe.ingredients[j];
      totalCost2 += estimateIngredientCost(ing2.itemId, state) * ing2.amount;
    }
    // 对比外卖价格（按饱食度折算）
    var eatOutCost = Math.round(hungerRestore * 0.7); // 商业区吃饭每点饱食~¥0.7
    var savings = eatOutCost - totalCost2;
    if (savings > 0) {
      parts.push("💰 比外卖省¥" + savings + "（外卖约¥" + eatOutCost + "）");
    } else if (savings <= 0 && totalCost2 > 0) {
      parts.push("📌 成本与外卖相当");
    }
  }

  // Lv.60: 食材价格波动提示
  if (lvl >= SKILL_INTEL_THRESHOLDS.cooking.MARKET_TREND) {
    var volatileCount = 0;
    var checked = {};
    for (var k = 0; k < recipe.ingredients.length; k++) {
      var ing3 = recipe.ingredients[k];
      if (checked[ing3.itemId]) continue;
      checked[ing3.itemId] = true;
      // 通过价格记忆系统检测波动
      var price = estimateIngredientCost(ing3.itemId, state);
      var base = 3; // 默认基准
      var basePrices2 = {
        rice: 3,
        tomato: 4,
        egg: 2,
        salt: 1,
        cooking_oil: 5,
        bok_choy: 3,
        pork: 8,
        noodles: 3,
        cabbage: 3,
        radish: 3,
        chili: 2,
        soy_sauce: 3,
        sugar: 2,
        ginger: 4,
        fish: 10,
        chicken: 9,
        shrimp: 15,
        beef: 12,
      };
      if (basePrices2[ing3.itemId]) base = basePrices2[ing3.itemId];
      var ratio = price / base;
      if (ratio > 1.2) volatileCount++;
      else if (ratio < 0.8) volatileCount--;
    }
    if (volatileCount > 0) {
      parts.push("📈 " + volatileCount + "种食材比平时贵");
    } else if (volatileCount < 0) {
      parts.push("📉 " + Math.abs(volatileCount) + "种食材比平时便宜");
    } else {
      parts.push("✅ 食材价格平稳");
    }
  }

  return parts.length > 0
    ? '<div class="price-preview">' + parts.join("<br>") + "</div>"
    : "";
}

// ====== 维修技能 — 物品价值评估 ======

function canSeeWearLevel(state) {
  var lvl =
    (state.skills && state.skills.repair && state.skills.repair.level) || 0;
  return lvl >= SKILL_INTEL_THRESHOLDS.repair.WEAR_LEVEL;
}

function canSeeRepairCost(state) {
  var lvl =
    (state.skills && state.skills.repair && state.skills.repair.level) || 0;
  return lvl >= SKILL_INTEL_THRESHOLDS.repair.REPAIR_COST;
}

function canSeeResaleValue(state) {
  var lvl =
    (state.skills && state.skills.repair && state.skills.repair.level) || 0;
  return lvl >= SKILL_INTEL_THRESHOLDS.repair.RESALE_VALUE;
}

/**
 * 获取物品磨损程度文本
 */
function getWearLevelText(wearPct) {
  if (wearPct >= 90) return "🆕 几乎全新";
  if (wearPct >= 70) return "✅ 轻微磨损";
  if (wearPct >= 40) return "⚠️ 中等磨损";
  if (wearPct >= 15) return "🔧 严重磨损";
  return "🛠️ 濒临报废";
}

/**
 * 构建维修预览（用于装备/物品 action card）
 * @param {object} state - 游戏状态
 * @param {object} itemDef - ITEMS 中的装备定义
 * @param {number} [wearPct] - 耐久百分比 0-100，未提供时默认100
 * @returns {string} 预览文本
 */
function buildRepairPreview(state, itemDef, wearPct) {
  if (!itemDef) return "";
  var parts = [];
  var lvl =
    (state.skills && state.skills.repair && state.skills.repair.level) || 0;

  // Lv.20: 质量评级（基于装备价格/效果）
  if (lvl >= SKILL_INTEL_THRESHOLDS.repair.WEAR_LEVEL) {
    var price = itemDef.basePrice || itemDef.cost || 0;
    var quality = "普通";
    if (price >= 500) quality = "精良";
    else if (price >= 200) quality = "良好";
    else if (price > 0) quality = "普通";
    parts.push("📊 品质: " + quality);
    if (price > 0) parts.push("¥" + price);
  }

  // Lv.40: 维修成本预估（按价格比例）
  if (lvl >= SKILL_INTEL_THRESHOLDS.repair.REPAIR_COST) {
    var baseCost = itemDef.basePrice || itemDef.cost || 100;
    parts.push("🔧 维护成本≈¥" + Math.round(baseCost * 0.15) + "/月");
  }

  // Lv.60: 二手转卖估值
  if (lvl >= SKILL_INTEL_THRESHOLDS.repair.RESALE_VALUE) {
    var basePrice = itemDef.basePrice || itemDef.cost || 100;
    parts.push("💰 二手≈¥" + Math.round(basePrice * 0.4));
  }

  return parts.length > 0 ? parts.join(" | ") : "";
}

// ====== 驾驶技能 — 物流/交通成本 ======

function canSeeRouteCost(state) {
  var lvl =
    (state.skills && state.skills.driving && state.skills.driving.level) || 0;
  return lvl >= SKILL_INTEL_THRESHOLDS.driving.ROUTE_COST;
}

function canSeeDeliveryEval(state) {
  var lvl =
    (state.skills && state.skills.driving && state.skills.driving.level) || 0;
  return lvl >= SKILL_INTEL_THRESHOLDS.driving.DELIVERY_EVAL;
}

function canSeeBestRoute(state) {
  var lvl =
    (state.skills && state.skills.driving && state.skills.driving.level) || 0;
  return lvl >= SKILL_INTEL_THRESHOLDS.driving.BEST_ROUTE;
}

/**
 * 构建驾驶路线预览（用于 travel action card）
 * @param {object} state - 游戏状态
 * @param {string} fromLocKey - 出发地
 * @param {string} toLocKey - 目的地
 * @param {number} apCost - 本次旅行的AP消耗
 * @returns {string} 预览文本
 */
function buildDrivingPreview(state, fromLocKey, toLocKey, apCost) {
  var parts = [];
  var lvl =
    (state.skills && state.skills.driving && state.skills.driving.level) || 0;

  // Lv.20: 路线成本
  if (lvl >= SKILL_INTEL_THRESHOLDS.driving.ROUTE_COST) {
    var hops =
      typeof getLocationHops === "function"
        ? getLocationHops(fromLocKey, toLocKey)
        : 1;
    var baseCost = apCost * 2; // 模拟无技能时的AP消耗
    var saved = baseCost - apCost;
    parts.push(
      "⚡AP消耗" + apCost + (saved > 0 ? "（技能-" + saved + "）" : ""),
    );
    if (hops > 1) parts.push("📍跨" + hops + "段");
  }

  // Lv.40: 配送费合理性
  if (lvl >= SKILL_INTEL_THRESHOLDS.driving.DELIVERY_EVAL) {
    var dist =
      typeof getLocationHops === "function"
        ? getLocationHops(fromLocKey, toLocKey)
        : 1;
    var fairCost = 5 + dist * 3;
    parts.push("📮 合理配送费≈¥" + fairCost);
  }

  // Lv.60: 最优路线推荐
  if (lvl >= SKILL_INTEL_THRESHOLDS.driving.BEST_ROUTE) {
    var dist2 =
      typeof getLocationHops === "function"
        ? getLocationHops(fromLocKey, toLocKey)
        : 1;
    if (dist2 <= 2) {
      parts.push("✅ 步行即可，无需绕路");
    } else {
      parts.push("🛵 建议骑行，比步行省40%AP");
    }
  }

  return parts.length > 0 ? parts.join(" | ") : "";
}

// ====== 编程技能 — 项目/外包估值 ======

function canSeeHoursEstimate(state) {
  var lvl =
    (state.skills && state.skills.coding && state.skills.coding.level) || 0;
  return lvl >= SKILL_INTEL_THRESHOLDS.coding.HOURS_ESTIMATE;
}

function canSeeQuoteEval(state) {
  var lvl =
    (state.skills && state.skills.coding && state.skills.coding.level) || 0;
  return lvl >= SKILL_INTEL_THRESHOLDS.coding.QUOTE_EVAL;
}

function canSeeTechDebt(state) {
  var lvl =
    (state.skills && state.skills.coding && state.skills.coding.level) || 0;
  return lvl >= SKILL_INTEL_THRESHOLDS.coding.TECH_DEBT;
}

/**
 * 构建编程项目预览（用于 freelance/coding 相关 action）
 * @param {object} state - 游戏状态
 * @param {object} project - 项目对象 { name, budget, complexity, deadline }
 * @returns {string} 预览文本
 */
function buildCodingPreview(state, project) {
  if (!project) return "";
  var parts = [];
  var lvl =
    (state.skills && state.skills.coding && state.skills.coding.level) || 0;

  // Lv.20: 工时估算
  if (lvl >= SKILL_INTEL_THRESHOLDS.coding.HOURS_ESTIMATE) {
    var complexity = project.complexity || 3;
    var codingLevel =
      (state.skills && state.skills.coding && state.skills.coding.level) || 1;
    var hours = Math.max(
      1,
      Math.round((complexity * 8) / (1 + codingLevel / 20)),
    );
    parts.push("⏱ 预估" + hours + "工时");
  }

  // Lv.40: 报价合理性
  if (lvl >= SKILL_INTEL_THRESHOLDS.coding.QUOTE_EVAL) {
    var budget = project.budget || 0;
    var complexity2 = project.complexity || 3;
    var marketRate = complexity2 * 200;
    var diff = budget - marketRate;
    if (diff > 100) {
      parts.push("💰 高于市场价¥" + diff + "（优质单）");
    } else if (diff < -100) {
      parts.push("⚠️ 低于市场价¥" + Math.abs(diff) + "（压价单）");
    } else {
      parts.push("💰 报价合理");
    }
  }

  // Lv.60: 技术债务评估
  if (lvl >= SKILL_INTEL_THRESHOLDS.coding.TECH_DEBT) {
    var complexity3 = project.complexity || 3;
    var techDebtCost = complexity3 * 80;
    parts.push("🏗️ 后续维护≈¥" + techDebtCost + "/月");
  }

  return parts.length > 0 ? parts.join(" | ") : "";
}

// ====== 获取技能相关数据的通用辅助函数 ======

/**
 * 获取技能中文名（本地引用）
 */
function getIntelSkillName(skillKey) {
  var names = {
    accounting: "会计",
    cooking: "烹饪",
    repair: "维修",
    driving: "驾驶",
    coding: "编程",
  };
  return names[skillKey] || skillKey;
}

// ====== 注册到全局（供Wiki引用） ======
if (typeof window !== "undefined") {
  window.SKILL_INTEL_THRESHOLDS = SKILL_INTEL_THRESHOLDS;
}
