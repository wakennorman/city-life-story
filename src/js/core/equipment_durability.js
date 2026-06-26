/**
 * 装备耐久系统 (Equipment Durability System)
 *
 * 参考：《我的世界》工具耐久 / 《饥荒》装备耐久 / 《暗黑破坏神》装备耐久
 *
 * 耐久机制：
 * - 装备每次使用（工作/旅行/特定行动）消耗耐久
 * - 耐久归零时装备失效，效果不再生效
 * - 修理需要工具+材料+金钱，恢复部分耐久
 * - 高品质装备初始耐久更高，修理成本也更高
 * - 耐久消耗可显示在装备详情中
 */

// 装备耐久基础值（按装备类型）
const DURABILITY_BASE = {
  head: 200, // 头部装备：帽子、头盔等
  hand: 300, // 手部装备：手套等
  feet: 250, // 脚部装备：鞋子、靴子
  body: 350, // 身体装备：衣服、背心等
  accessory: 400, // 配饰：背包、手表、耳机等
  null: 500, // 非穿戴装备：雨伞、手电筒等（消耗较慢）
};

// 装备使用时的耐久消耗（按行动类型）
const DURABILITY_COST = {
  // 工作类型
  street_job: 5, // 街头工作
  corp_job: 2, // 职场工作（消耗较少）
  travel: 3, // 旅行
  learning: 1, // 学习
  rest: 0, // 休息（不消耗）
  cooking: 2, // 烹饪
  trading: 1, // 交易
  social: 1, // 社交
  other: 1, // 其他行动
};

/**
 * 为装备实例添加耐久字段
 * @param {object} itemInstance - 装备实例（来自 createEquipmentInstance）
 * @param {object} itemDef - 装备定义（来自 ITEMS）
 * @returns {object} 带耐久的装备实例
 */
function initItemDurability(itemInstance, itemDef) {
  if (!itemInstance) return null;

  // 跳过非装备物品（食材、证书等）
  if (!itemDef || (!itemDef.slot && !itemDef.id)) {
    return itemInstance;
  }

  var slot = itemDef.slot || null;
  var baseDurability = DURABILITY_BASE[slot] || DURABILITY_BASE.null;

  // 品质加成：高品质装备耐久更高
  var qualityMult = 1.0;
  if (itemInstance.quality) {
    if (itemInstance.quality === "rare") qualityMult = 1.2;
    else if (itemInstance.quality === "epic") qualityMult = 1.5;
    else if (itemInstance.quality === "legendary") qualityMult = 2.0;
  }

  var maxDurability = Math.floor(baseDurability * qualityMult);

  // 复制实例并添加耐久
  var durableItem = {};
  for (var key in itemInstance) {
    durableItem[key] = itemInstance[key];
  }

  durableItem.maxDurability = maxDurability;
  durableItem.durability = maxDurability;
  durableItem.isBroken = false;

  return durableItem;
}

/**
 * 消耗装备耐久（当使用装备进行行动时）
 * @param {object} state - 游戏状态
 * @param {string} actionType - 行动类型（street_job, corp_job, travel等）
 * @param {number} costMultiplier - 消耗倍率（某些工作可能消耗更快）
 */
function consumeEquipmentDurability(state, actionType, costMultiplier) {
  if (!state || !state.equipment || !state.equipment.equipped) return;

  var cost = DURABILITY_COST[actionType] || DURABILITY_COST.other;
  cost *= costMultiplier || 1.0;

  if (cost <= 0) return;

  var equipped = state.equipment.equipped;
  for (var slot in equipped) {
    var item = equipped[slot];
    if (item && item.durability !== undefined) {
      // 耐久归零的装备不消耗
      if (item.isBroken) continue;

      var oldDurability = item.durability;
      item.durability = Math.max(0, item.durability - cost);

      // 检查是否耐久归零
      if (item.durability <= 0 && !item.isBroken) {
        item.isBroken = true;
        item.durability = 0;
        // 触发装备损坏消息
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage(
            "⚠️ 您的「" +
              (item.name || slot) +
              "」耐久耗尽，效果失效！需要修理。",
            "warning",
          );
        }
      }
    }
  }
}

/**
 * 修理装备（恢复耐久）
 * @param {object} state - 游戏状态
 * @param {string} itemId - 要修理的装备ID
 * @param {number} repairAmount - 修理量（0为满修）
 * @returns {object} { success, cost, repairedAmount, message }
 */
function repairEquipment(state, itemId, repairAmount) {
  if (!state || !state.equipment || !state.equipment.equipped) {
    return { success: false, message: "没有可修理的装备" };
  }

  // 查找装备（可能在已装备或背包中）
  var item = null;
  var itemSlot = null;

  // 检查已装备
  for (var slot in state.equipment.equipped) {
    if (state.equipment.equipped[slot].id === itemId) {
      item = state.equipment.equipped[slot];
      itemSlot = slot;
      break;
    }
  }

  // 检查背包
  if (!item && state.equipment.inventory) {
    for (var i = 0; i < state.equipment.inventory.length; i++) {
      if (state.equipment.inventory[i].id === itemId) {
        item = state.equipment.inventory[i];
        break;
      }
    }
  }

  if (!item) {
    return { success: false, message: "找不到该装备" };
  }

  if (!item.durability !== undefined) {
    return { success: false, message: "该装备不支持耐久系统" };
  }

  if (item.isBroken && item.durability <= 0) {
    return { success: false, message: "装备已完全损坏，需要大修（花费更多）" };
  }

  // 计算修理费用
  var maxDur = item.maxDurability || 100;
  var currentDur = item.durability || 0;
  var repairTarget =
    repairAmount > 0 ? Math.min(maxDur, currentDur + repairAmount) : maxDur;
  var repairNeeded = repairTarget - currentDur;

  if (repairNeeded <= 0) {
    return { success: false, message: "装备耐久已满" };
  }

  // 修理费用：每点耐久 ¥1-5，取决于品质
  var pricePerPoint = 1;
  if (item.quality === "rare") pricePerPoint = 2;
  else if (item.quality === "epic") pricePerPoint = 3;
  else if (item.quality === "legendary") pricePerPoint = 5;

  // 完全损坏的装备修理费翻倍
  if (item.isBroken) pricePerPoint *= 2;

  var repairCost = Math.floor(repairNeeded * pricePerPoint);

  // 检查是否有足够金钱
  if (state.resources && state.resources.cash < repairCost) {
    return {
      success: false,
      message:
        "修理需要 ¥" + repairCost + "，您只有 ¥" + (state.resources.cash || 0),
    };
  }

  // 执行修理
  state.resources.cash -= repairCost;
  item.durability = repairTarget;
  item.isBroken = false;

  return {
    success: true,
    cost: repairCost,
    repairedAmount: repairNeeded,
    newDurability: item.durability,
    maxDurability: item.maxDurability,
    message:
      "✅ 「" +
      (item.name || itemId) +
      "」修理完成，耐久 " +
      Math.floor(currentDur) +
      " → " +
      Math.floor(item.durability) +
      "，花费 ¥" +
      repairCost,
  };
}

/**
 * 获取装备耐久状态描述
 * @param {object} item - 装备实例
 * @returns {object} { percent, status, color, icon, desc }
 */
function getDurabilityStatus(item) {
  if (!item || item.durability === undefined) {
    return {
      percent: 100,
      status: "perfect",
      color: "var(--success)",
      icon: "✅",
      desc: "全新",
    };
  }

  var maxDur = item.maxDurability || 100;
  var percent = Math.round((item.durability / maxDur) * 100);

  if (item.isBroken || percent <= 0) {
    return {
      percent: 0,
      status: "broken",
      color: "var(--danger)",
      icon: "💔",
      desc: "已损坏",
    };
  } else if (percent <= 20) {
    return {
      percent: percent,
      status: "critical",
      color: "var(--danger)",
      icon: "⚠️",
      desc: "急需修理",
    };
  } else if (percent <= 50) {
    return {
      percent: percent,
      status: "worn",
      color: "var(--warning)",
      icon: "🔧",
      desc: "磨损",
    };
  } else if (percent <= 80) {
    return {
      percent: percent,
      status: "used",
      color: "#f0ad4e",
      icon: "📦",
      desc: "使用过",
    };
  } else {
    return {
      percent: percent,
      status: "good",
      color: "var(--success)",
      icon: "✨",
      desc: "良好",
    };
  }
}

/**
 * 获取耐久HTML渲染
 * @param {object} item - 装备实例
 * @returns {string} HTML字符串
 */
function renderDurabilityBar(item) {
  var status = getDurabilityStatus(item);
  var barWidth = status.percent + "%";

  return (
    '<div style="margin-top:6px;">' +
    '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-secondary);">' +
    "<span>耐久</span>" +
    '<span style="color:' +
    status.color +
    ';">' +
    Math.floor(item.durability || 0) +
    "/" +
    (item.maxDurability || 0) +
    "</span>" +
    "</div>" +
    '<div style="background:var(--bg-input);border-radius:4px;height:6px;margin-top:2px;overflow:hidden;">' +
    '<div style="background:' +
    status.color +
    ";height:100%;width:" +
    barWidth +
    ';transition:width 0.3s;"></div>' +
    "</div>" +
    '<div style="font-size:10px;color:' +
    status.color +
    ';margin-top:2px;">' +
    status.icon +
    " " +
    status.desc +
    "</div>" +
    "</div>"
  );
}

/**
 * 每日检查装备耐久（自动修理或提醒）
 * @param {object} state - 游戏状态
 */
function tickEquipmentDurability(state) {
  if (!state || !state.equipment || !state.equipment.equipped) return;

  // 检查是否有装备耐久归零
  var brokenItems = [];
  for (var slot in state.equipment.equipped) {
    var item = state.equipment.equipped[slot];
    if (item && item.durability !== undefined && item.isBroken) {
      brokenItems.push(item);
    }
  }

  if (brokenItems.length > 0) {
    // 每天提醒一次
    if (!state.flags || !state.flags._durabilityReminderToday) {
      state.flags = state.flags || {};
      state.flags._durabilityReminderToday = true;
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage(
          "🔧 您有 " +
            brokenItems.length +
            " 件装备耐久耗尽，效果失效。去「装备」Tab修理吧！",
          "warning",
        );
      }
    }
  } else {
    // 重置每日提醒
    if (state.flags) state.flags._durabilityReminderToday = false;
  }
}

// ====== 导出 ======
if (typeof window !== "undefined") {
  window.DURABILITY_BASE = DURABILITY_BASE;
  window.DURABILITY_COST = DURABILITY_COST;
  window.initItemDurability = initItemDurability;
  window.consumeEquipmentDurability = consumeEquipmentDurability;
  window.repairEquipment = repairEquipment;
  window.getDurabilityStatus = getDurabilityStatus;
  window.renderDurabilityBar = renderDurabilityBar;
  window.tickEquipmentDurability = tickEquipmentDurability;
}

// ====== 百科注册 ======
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  MECHANICS.equipment_durability = {
    id: "equipment_durability",
    name: "装备耐久",
    icon: "🔧",
    brief: "装备使用会消耗耐久，耐久归零时效果失效，需要修理恢复。",
    version: "1.0",
    related: ["mechanics:inventory", "mechanics:equipment_quality"],
    sections: [
      {
        type: "desc",
        content:
          "每件装备都有耐久值，进行工作、旅行等行动时会消耗耐久。耐久归零时装备失效，需要花费金钱修理。高品质装备耐久更高，但修理也更贵。",
      },
      {
        type: "table",
        headers: ["装备类型", "基础耐久", "典型消耗"],
        rows: [
          ["头部（帽子/头盔）", "200", "工作-5/旅行-3"],
          ["手部（手套）", "300", "工作-5/旅行-3"],
          ["脚部（鞋子/靴子）", "250", "工作-5/旅行-3"],
          ["身体（衣服）", "350", "工作-5/旅行-3"],
          ["配饰（背包/手表）", "400", "工作-5/旅行-3"],
          ["非穿戴（雨伞等）", "500", "工作-5/旅行-3"],
        ],
      },
      {
        type: "tip",
        content:
          "修理费用：每点耐久 ¥1-5（取决于品质），完全损坏的装备修理费翻倍。建议在装备耐久低于30%时及时修理。",
      },
    ],
  };
}
