/**
 * 装备套装系统 (Equipment Suites System)
 *
 * 参考：《暗黑破坏神》套装效果 / 《魔兽世界》套装属性 / 《Stardew Valley》工具套装
 *
 * 套装定义：多件同主题装备同时装备时触发额外加成
 * 套装效果：基于装备数量递增（2件/3件/4件/全套装）
 * 套装识别：通过装备ID列表匹配，自动检测玩家当前装备是否属于某套装
 */

const EQUIPMENT_SUITES = {
  // ============================================================
  // 街头生存套装 - 底层生存者的必备装备
  // ============================================================
  street_survival: {
    id: "street_survival",
    name: "街头生存套装",
    icon: "🏚️",
    theme: "底层生存",
    desc: "在街头摸爬滚打多年积累的经验，每一件装备都见证过你的挣扎。",
    items: [
      { id: "straw_hat", name: "草帽", slot: "head" },
      { id: "work_gloves", name: "劳保手套", slot: "hand" },
      { id: "sturdy_shoes", name: "解放鞋", slot: "feet" },
      { id: "work_uniform", name: "工作服", slot: "body" },
    ],
    tiers: [
      { count: 2, name: "初识街头", effects: { streetIncomeBonus: 0.05 } },
      {
        count: 3,
        name: "街头老手",
        effects: { streetIncomeBonus: 0.1, injuryReduction: 0.05 },
      },
      {
        count: 4,
        name: "街头王者",
        effects: {
          streetIncomeBonus: 0.15,
          injuryReduction: 0.1,
          fatigueReduction: 5,
        },
      },
    ],
  },

  // ============================================================
  // 配送达人套装 - 外卖骑手的终极装备
  // ============================================================
  delivery_master: {
    id: "delivery_master",
    name: "配送达人套装",
    icon: "🛵",
    theme: "外卖骑手",
    desc: "风雨无阻的配送路上，这些装备是你最可靠的伙伴。",
    items: [
      { id: "mask", name: "口罩", slot: "head" },
      { id: "sturdy_shoes", name: "解放鞋", slot: "feet" },
      { id: "backpack", name: "大背包", slot: "accessory" },
      { id: "smartphone", name: "智能手机", slot: "accessory" },
    ],
    tiers: [
      {
        count: 2,
        name: "新手骑手",
        effects: { deliveryIncomeBonus: 0.08, travelApReduction: 1 },
      },
      {
        count: 3,
        name: "资深骑手",
        effects: {
          deliveryIncomeBonus: 0.15,
          travelApReduction: 1,
          fatigueRecoveryBonus: 0.05,
        },
      },
      {
        count: 4,
        name: "配送达人",
        effects: {
          deliveryIncomeBonus: 0.2,
          travelApReduction: 2,
          fatigueRecoveryBonus: 0.1,
          deliverySpeedBonus: 0.15,
        },
      },
    ],
  },

  // ============================================================
  // 工地安全套装 - 建筑工人的专业装备
  // ============================================================
  construction_safety: {
    id: "construction_safety",
    name: "工地安全套装",
    icon: "🏗️",
    theme: "建筑工人",
    desc: "工地上的每一滴汗水，都凝结在这些专业装备里。",
    items: [
      { id: "safety_helmet", name: "安全帽", slot: "head" },
      { id: "work_gloves", name: "劳保手套", slot: "hand" },
      { id: "work_boots", name: "劳保靴", slot: "feet" },
      { id: "reflective_vest", name: "反光背心", slot: "body" },
    ],
    tiers: [
      {
        count: 2,
        name: "工地新人",
        effects: { constructionIncomeBonus: 0.05, injuryReduction: 0.05 },
      },
      {
        count: 3,
        name: "工地熟手",
        effects: {
          constructionIncomeBonus: 0.1,
          injuryReduction: 0.12,
          nightWorkIncomeBonus: 0.05,
        },
      },
      {
        count: 4,
        name: "工地专家",
        effects: {
          constructionIncomeBonus: 0.15,
          injuryReduction: 0.2,
          nightWorkIncomeBonus: 0.1,
          nightVisibilityBonus: 0.3,
        },
      },
    ],
  },

  // ============================================================
  // 科技精英套装 - IT从业者的标配
  // ============================================================
  tech_elite: {
    id: "tech_elite",
    name: "科技精英套装",
    icon: "💻",
    theme: "IT从业者",
    desc: "代码世界的利器，每一样都是提升效率的必需品。",
    items: [
      { id: "smart_watch", name: "智能手表", slot: "accessory" },
      { id: "noise_cancelling_earphones", name: "降噪耳机", slot: "accessory" },
      { id: "laptop_bag", name: "电脑包", slot: "accessory" },
      { id: "power_bank", name: "充电宝", slot: "accessory" },
    ],
    tiers: [
      {
        count: 2,
        name: "技术新人",
        effects: { techIncomeBonus: 0.08, studyEfficiencyBonus: 0.1 },
      },
      {
        count: 3,
        name: "技术骨干",
        effects: {
          techIncomeBonus: 0.12,
          studyEfficiencyBonus: 0.15,
          fatigueIntelWorkReduction: 3,
        },
      },
      {
        count: 4,
        name: "技术精英",
        effects: {
          techIncomeBonus: 0.15,
          studyEfficiencyBonus: 0.2,
          fatigueIntelWorkReduction: 5,
          codingXpBonus: 0.15,
        },
      },
    ],
  },

  // ============================================================
  // 四季防护套装 - 户外工作者的全天候装备
  // ============================================================
  all_weather: {
    id: "all_weather",
    name: "四季防护套装",
    icon: "🌦️",
    theme: "户外工作者",
    desc: "无论春夏秋冬，这些装备都能让你在户外工作更舒适。",
    items: [
      { id: "warm_coat", name: "厚棉衣", slot: "body" },
      { id: "thermal_underwear", name: "保暖内衣", slot: "body" },
      { id: "raincoat", name: "雨衣", slot: "body" },
      { id: "umbrella", name: "雨伞", slot: null },
    ],
    tiers: [
      {
        count: 2,
        name: "季节适应",
        effects: { weatherPenaltyReduction: 0.25, seasonalIncomeBonus: 0.05 },
      },
      {
        count: 3,
        name: "四季自如",
        effects: {
          weatherPenaltyReduction: 0.4,
          seasonalIncomeBonus: 0.08,
          coldProtectionBonus: 10,
          heatProtectionBonus: 10,
        },
      },
      {
        count: 4,
        name: "风雨无阻",
        effects: {
          weatherPenaltyReduction: 0.5,
          seasonalIncomeBonus: 0.1,
          coldProtectionBonus: 20,
          heatProtectionBonus: 15,
          rainProtectionBonus: 25,
        },
      },
    ],
  },

  // ============================================================
  // 理财达人套装 - 投资人的必备工具
  // ============================================================
  finance_master: {
    id: "finance_master",
    name: "理财达人套装",
    icon: "📈",
    theme: "投资人",
    desc: "在金融市场的博弈中，这些工具帮你保持清醒和效率。",
    items: [
      { id: "smart_watch", name: "智能手表", slot: "accessory" },
      { id: "smartphone", name: "智能手机", slot: "accessory" },
      { id: "noise_cancelling_earphones", name: "降噪耳机", slot: "accessory" },
      { id: "memo_pad", name: "记事本", slot: null }, // [全系统自洽修复] 域A 修复: notebook_item→memo_pad (原ID与stationery笔记本冲突导致死代码)
    ],
    tiers: [
      {
        count: 2,
        name: "投资入门",
        effects: { financeIncomeBonus: 0.05, newsAccess: true },
      },
      {
        count: 3,
        name: "投资老手",
        effects: {
          financeIncomeBonus: 0.1,
          newsAccess: true,
          studyEfficiencyBonus: 0.1,
        },
      },
      {
        count: 4,
        name: "投资达人",
        effects: {
          financeIncomeBonus: 0.15,
          newsAccess: true,
          studyEfficiencyBonus: 0.15,
          tradingFeeReduction: 0.1,
        },
      },
    ],
  },
};

/**
 * 检测玩家当前装备属于哪些套装
 * @param {object} state - 游戏状态
 * @returns {object} 每个套装的已装备数量和最高达成等级
 */
function checkEquipmentSuites(state) {
  if (!state || !state.inventory || !state.inventory.equipment) {
    return {};
  }

  var equippedIds = {};
  var equippedSlots = {};

  // 收集已装备的装备ID和槽位（equipment[slot] = itemId 字符串）
  for (var slot in state.inventory.equipment) {
    var itemId = state.inventory.equipment[slot];
    if (itemId) {
      equippedIds[itemId] = true;
      equippedSlots[slot] = itemId;
    }
  }

  var results = {};

  for (var suiteId in EQUIPMENT_SUITES) {
    var suite = EQUIPMENT_SUITES[suiteId];
    var equippedCount = 0;
    var equippedItems = [];

    for (var i = 0; i < suite.items.length; i++) {
      var itemDef = suite.items[i];
      // 检查装备是否在已装备列表中
      if (equippedIds[itemDef.id]) {
        equippedCount++;
        equippedItems.push(itemDef.id);
      }
    }

    // 找到达到的最高等级
    var achievedTier = null;
    for (var j = 0; j < suite.tiers.length; j++) {
      var tier = suite.tiers[j];
      if (equippedCount >= tier.count) {
        achievedTier = tier;
      }
    }

    if (equippedCount > 0) {
      results[suiteId] = {
        suiteId: suiteId,
        name: suite.name,
        icon: suite.icon,
        theme: suite.theme,
        equippedCount: equippedCount,
        totalCount: suite.items.length,
        achievedTier: achievedTier,
        achievedTierName: achievedTier ? achievedTier.name : null,
        equippedItems: equippedItems,
      };
    }
  }

  return results;
}

/**
 * 获取套装加成效果（合并所有达成的套装等级）
 * @param {object} suiteResults - checkEquipmentSuites的返回结果
 * @returns {object} 合并后的效果对象
 */
function getSuiteEffects(suiteResults) {
  var effects = {};

  for (var suiteId in suiteResults) {
    var result = suiteResults[suiteId];
    if (result.achievedTier && result.achievedTier.effects) {
      var tierEffects = result.achievedTier.effects;
      for (var effectKey in tierEffects) {
        var newValue = tierEffects[effectKey];
        var existingValue = effects[effectKey] || 0;

        // 处理不同类型的效果叠加
        if (
          effectKey.indexOf("Reduction") >= 0 ||
          effectKey.indexOf("Bonus") >= 0
        ) {
          // 百分比加成或减少值，取最大值（不叠加）
          effects[effectKey] = Math.max(existingValue, newValue);
        } else if (
          effectKey === "travelApReduction" ||
          effectKey === "fatigueIntelWorkReduction"
        ) {
          // AP减少值，可叠加
          effects[effectKey] = existingValue + newValue;
        } else {
          // 其他效果，取最大值
          effects[effectKey] = Math.max(existingValue, newValue);
        }
      }
    }
  }

  return effects;
}

/**
 * 获取套装达成进度描述
 * @param {string} suiteId - 套装ID
 * @param {number} equippedCount - 已装备数量
 * @returns {string} 进度描述文本
 */
function getSuiteProgressDesc(suiteId, equippedCount) {
  var suite = EQUIPMENT_SUITES[suiteId];
  if (!suite) return "";

  var currentTier = null;
  for (var i = 0; i < suite.tiers.length; i++) {
    if (equippedCount >= suite.tiers[i].count) {
      currentTier = suite.tiers[i];
    }
  }

  if (!currentTier) {
    // 未达到任何等级
    var nextTier = suite.tiers[0];
    return (
      "还需装备 " +
      (nextTier.count - equippedCount) +
      " 件装备解锁「" +
      nextTier.name +
      "」"
    );
  }

  // 检查是否已达最高等级
  if (currentTier === suite.tiers[suite.tiers.length - 1]) {
    return "✅ 套装效果已全部解锁！";
  }

  // 还有未解锁等级
  var nextIndex = suite.tiers.indexOf(currentTier) + 1;
  if (nextIndex < suite.tiers.length) {
    var next = suite.tiers[nextIndex];
    return (
      "已解锁「" +
      currentTier.name +
      "」，再装备 " +
      (next.count - equippedCount) +
      " 件解锁「" +
      next.name +
      "」"
    );
  }

  return "已解锁「" + currentTier.name + "」";
}

/**
 * 获取套装HTML渲染
 * @param {object} suiteResult - checkEquipmentSuites的单个结果
 * @returns {string} HTML字符串
 */
function renderSuiteCard(suiteResult) {
  var suite = EQUIPMENT_SUITES[suiteResult.suiteId];
  if (!suite) return "";

  var progressDesc = getSuiteProgressDesc(
    suiteResult.suiteId,
    suiteResult.equippedCount,
  );
  var tierColor = suiteResult.achievedTier
    ? "var(--success)"
    : "var(--text-muted)";

  var itemsHtml = "";
  for (var i = 0; i < suite.items.length; i++) {
    var item = suite.items[i];
    var isEquipped = suiteResult.equippedItems.indexOf(item.id) >= 0;
    var itemIcon = isEquipped ? "✅" : "⬜";
    itemsHtml +=
      '<span style="margin-right:8px;">' +
      itemIcon +
      " " +
      item.name +
      "</span>";
  }

  var tierHtml = "";
  if (suiteResult.achievedTier) {
    tierHtml =
      '<div style="color:' +
      tierColor +
      ';font-weight:bold;margin-top:8px;">' +
      "🏆 已解锁：「" +
      suiteResult.achievedTierName +
      "」" +
      "</div>";
  }

  return (
    '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:10px;">' +
    '<div style="display:flex;align-items:center;gap:8px;">' +
    '<span style="font-size:24px;">' +
    suite.icon +
    "</span>" +
    '<div style="font-weight:bold;color:var(--text-primary);">' +
    suite.name +
    "</div>" +
    '<span style="font-size:12px;color:var(--text-secondary);margin-left:auto;">' +
    suiteResult.equippedCount +
    "/" +
    suiteResult.totalCount +
    "</span>" +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-secondary);margin-top:4px;">' +
    suite.theme +
    "</div>" +
    '<div style="margin-top:8px;font-size:12px;">' +
    itemsHtml +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-muted);margin-top:6px;">' +
    progressDesc +
    "</div>" +
    tierHtml +
    "</div>"
  );
}

// ====== 百科注册 ======
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.EQUIPMENT_SUITES = EQUIPMENT_SUITES;
  window.checkEquipmentSuites = checkEquipmentSuites;
  window.getSuiteEffects = getSuiteEffects;
  window.getSuiteProgressDesc = getSuiteProgressDesc;
  window.renderSuiteCard = renderSuiteCard;

  MECHANICS.equipment_suites = {
    id: "equipment_suites",
    name: "装备套装",
    icon: "🎒",
    brief:
      "同时装备同套装的多件装备可触发额外加成效果，套装等级随装备数量递增。",
    version: "1.0",
    related: ["mechanics:inventory", "mechanics:equipment_quality"],
    sections: [
      {
        type: "desc",
        content:
          "套装效果基于同时装备的同主题装备数量递增。每套装备有2/3/4件三档加成，全部集齐可获得最强效果。套装效果可与其他装备效果叠加。",
      },
      {
        type: "list",
        items: Object.keys(EQUIPMENT_SUITES).map(function (id) {
          var s = EQUIPMENT_SUITES[id];
          return (
            s.icon +
            " **" +
            s.name +
            "**（" +
            s.items.length +
            "件）— " +
            s.theme
          );
        }),
      },
      {
        type: "tip",
        content:
          "套装效果在装备/卸下装备时自动检测，无需手动激活。在「装备」Tab可查看当前套装进度。",
      },
    ],
  };
}
