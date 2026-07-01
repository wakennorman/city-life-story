/**
 * 装备品质系统 (Equipment Quality System)
 *
 * 为装备添加品质等级（普通/稀有/史诗/传说），影响基础价格与工作收入加成倍率。
 * 参考：《暗黑破坏神》装备品质、《魔兽世界》物品稀有度
 *
 * 品质等级: common(普通) → rare(稀有) → epic(史诗) → legendary(传说)
 * 品质影响：价格倍率（priceMult）、工作收入加成倍率（effectMult）
 *
 * v2.0：移除附魔系统（奇幻色彩不符写实调性）；实例按 slot 键存储；新增迁移与统一读取入口。
 */

const EQUIPMENT_QUALITIES = {
  common: {
    id: "common",
    name: "普通",
    color: "#99958e",
    icon: "⬜",
    priceMult: 1.0,
    effectMult: 1.0,
    weight: 70,
  },
  rare: {
    id: "rare",
    name: "稀有",
    color: "#4a9e5c",
    icon: "🟩",
    priceMult: 1.3,
    effectMult: 1.1,
    weight: 20,
  },
  epic: {
    id: "epic",
    name: "史诗",
    color: "#4a6cf7",
    icon: "🟦",
    priceMult: 1.8,
    effectMult: 1.2,
    weight: 8,
  },
  legendary: {
    id: "legendary",
    name: "传说",
    color: "#e8b84c",
    icon: "🟨",
    priceMult: 2.5,
    effectMult: 1.5,
    weight: 2,
  },
};

// 品质固定顺序（common → rare → epic → legendary）
var QUALITY_ORDER = ["common", "rare", "epic", "legendary"];

/**
 * 按来源的品质分布权重 [common, rare, epic, legendary]
 * 对应 DEVELOPMENT.md:2167 设计意图
 */
var QUALITY_WEIGHTS_BY_SOURCE = {
  buy: [70, 20, 8, 2],
  loot: [85, 12, 3, 0],
  reward: [50, 35, 12, 3],
  event: [40, 35, 20, 5],
  migrate: [100, 0, 0, 0],
};

/**
 * 随机品质
 * @param {number[]} weights - [w_common, w_rare, w_epic, w_legendary]，缺省用 EQUIPMENT_QUALITIES 的 weight
 * @returns {string} 品质 id
 */
function rollItemQuality(weights) {
  var w =
    weights ||
    QUALITY_ORDER.map(function (q) {
      return EQUIPMENT_QUALITIES[q].weight;
    });
  var totalWeight = 0;
  for (var i = 0; i < w.length; i++) totalWeight += w[i];
  var roll = Random.float(0, totalWeight);
  for (var i = 0; i < QUALITY_ORDER.length; i++) {
    roll -= w[i] || 0;
    if (roll <= 0) return QUALITY_ORDER[i];
  }
  return "common";
}

function getQualityColor(quality) {
  var qDef = EQUIPMENT_QUALITIES[quality] || EQUIPMENT_QUALITIES.common;
  return qDef.color;
}

function getQualityIcon(quality) {
  var qDef = EQUIPMENT_QUALITIES[quality] || EQUIPMENT_QUALITIES.common;
  return qDef.icon;
}

function getQualityName(quality) {
  var qDef = EQUIPMENT_QUALITIES[quality] || EQUIPMENT_QUALITIES.common;
  return qDef.name;
}

function getQualityPriceMult(quality) {
  var qDef = EQUIPMENT_QUALITIES[quality] || EQUIPMENT_QUALITIES.common;
  return qDef.priceMult;
}

function getQualityEffectMult(quality) {
  var qDef = EQUIPMENT_QUALITIES[quality] || EQUIPMENT_QUALITIES.common;
  return qDef.effectMult;
}

function getQualityInfo(quality) {
  return EQUIPMENT_QUALITIES[quality] || EQUIPMENT_QUALITIES.common;
}

function getQualityClass(quality) {
  return "quality-" + quality;
}

/**
 * 生成品质信息（不含附魔）
 * @param {object} itemDef - 装备定义
 * @param {object} options - { forceQuality, qualityWeights }
 * @returns {object|null} 品质信息，食材/证书返回 null
 */
function generateItemQuality(itemDef, options) {
  if (!itemDef) return null;
  if (itemDef.isIngredient) return null;
  if (itemDef.id && itemDef.id.indexOf("cert_") === 0) return null;
  var quality;
  if (options && options.forceQuality) {
    quality = options.forceQuality;
  } else if (options && options.qualityWeights) {
    quality = rollItemQuality(options.qualityWeights);
  } else {
    quality = rollItemQuality();
  }
  var qDef = EQUIPMENT_QUALITIES[quality] || EQUIPMENT_QUALITIES.common;
  return {
    quality: quality,
    qualityName: qDef.name,
    qualityColor: qDef.color,
    qualityIcon: qDef.icon,
    priceMult: qDef.priceMult,
    effectMult: qDef.effectMult,
  };
}

function getItemPriceWithQuality(basePrice, qualityInfo) {
  if (!qualityInfo) return basePrice;
  return Math.round(basePrice * (qualityInfo.priceMult || 1.0));
}

/**
 * 创建装备实例（带品质 + 耐久，不含附魔）
 * 被 modal.js buyItemFromShop / 拾荒 / 事件 / NPC 赠予调用
 * @param {object} itemDef - 装备定义对象（来自 ITEMS 数组，必须有 slot）
 * @param {string} source - "buy" | "loot" | "reward" | "event" | "migrate"
 * @param {object} options - { forceQuality, qualityWeights }（forceQuality 绕过 RNG，用于迁移）
 * @returns {object|null} 实例对象（含 itemId），无 slot 返回 null
 */
function createEquipmentInstance(itemDef, source, options) {
  if (!itemDef || !itemDef.slot) return null;
  source = source || "buy";
  options = options || {};

  // 组装品质选项：forceQuality > qualityWeights > 按来源默认权重
  var qOpts = {};
  if (options.forceQuality) {
    qOpts.forceQuality = options.forceQuality;
  } else if (options.qualityWeights) {
    qOpts.qualityWeights = options.qualityWeights;
  } else {
    var srcWeights = QUALITY_WEIGHTS_BY_SOURCE[source];
    if (srcWeights) qOpts.qualityWeights = srcWeights;
  }

  var qualityInfo = generateItemQuality(itemDef, qOpts);
  if (!qualityInfo) {
    // 非品质物品兜底（食材/证书已在上游过滤）
    var basicInstance = {
      itemId: itemDef.id,
      instanceId: itemDef.id + "_inst",
      quality: "common",
      qualityName: "普通",
      qualityColor: "#99958e",
      qualityIcon: "⬜",
      actualPrice: itemDef.price || 0,
    };
    if (typeof initItemDurability === "function") {
      basicInstance =
        initItemDurability(basicInstance, itemDef) || basicInstance;
    }
    return basicInstance;
  }

  var actualPrice = getItemPriceWithQuality(itemDef.price || 0, qualityInfo);
  var instanceId = itemDef.id + "_" + Date.now() + "_" + Random.int(0, 999);
  var instance = {
    itemId: itemDef.id,
    instanceId: instanceId,
    quality: qualityInfo.quality,
    qualityName: qualityInfo.qualityName,
    qualityColor: qualityInfo.qualityColor,
    qualityIcon: qualityInfo.qualityIcon,
    actualPrice: actualPrice,
  };

  // 添加耐久
  if (typeof initItemDurability === "function") {
    instance = initItemDurability(instance, itemDef) || instance;
  }

  return instance;
}

/**
 * 读取某槽位的已装备实例（统一入口）
 * 所有读装备实例的代码都应走这里，避免 key 不一致。
 * @param {object} state - 游戏状态
 * @param {string} slot - 槽位名 head/body/feet/hand/accessory
 * @returns {object|null} 实例对象（含 itemId/quality/durability...）
 */
function getEquippedInstance(state, slot) {
  if (!state || !state.inventory || !state.inventory.equipmentInstances)
    return null;
  var inst = state.inventory.equipmentInstances[slot];
  if (inst && inst.itemId) return inst;
  return null;
}

/**
 * 迁移旧存档的 equipmentInstances 到按 slot 确定性键
 * 旧键可能是 itemId_时间戳_随机 或 itemId_instance；统一迁到 slot 键。
 * 找不到旧品质则降为 common（品质系统此前完全失效，无玩家受损）。
 * 在 StateManager.importState 末尾调用，覆盖 load + import。
 */
function migrateEquipmentInstances(state) {
  if (!state || !state.inventory) return;
  if (!state.inventory.equipment) {
    state.inventory.equipment = {
      head: null,
      body: null,
      feet: null,
      hand: null,
      accessory: null,
    };
  }
  if (!state.inventory.equipmentInstances) {
    state.inventory.equipmentInstances = {};
  }

  var SLOTS = ["head", "body", "feet", "hand", "accessory"];
  var oldMap = state.inventory.equipmentInstances;
  var newMap = {};

  for (var s = 0; s < SLOTS.length; s++) {
    var slot = SLOTS[s];
    var itemId = state.inventory.equipment[slot];
    if (!itemId) continue;

    // 1) 已有 slot 键且匹配
    if (oldMap[slot] && oldMap[slot].itemId === itemId) {
      newMap[slot] = oldMap[slot];
      continue;
    }

    // 2) 扫旧键（时间戳 / itemId_instance），找 value.itemId 匹配的
    var found = null;
    for (var k in oldMap) {
      if (!oldMap.hasOwnProperty(k) || k === slot) continue;
      var v = oldMap[k];
      if (v && v.itemId === itemId) {
        found = v;
        break;
      }
    }
    if (found) {
      found.itemId = itemId;
      newMap[slot] = found;
    } else {
      // 3) 重建 common 实例（forceQuality 绕过 RNG，确定性）
      var def = typeof getItemById === "function" ? getItemById(itemId) : null;
      if (def) {
        newMap[slot] = createEquipmentInstance(def, "migrate", {
          forceQuality: "common",
        });
      } else {
        newMap[slot] = {
          itemId: itemId,
          instanceId: itemId + "_inst",
          quality: "common",
          qualityName: "普通",
          qualityColor: "#99958e",
          qualityIcon: "⬜",
          actualPrice: 0,
        };
      }
    }
  }

  state.inventory.equipmentInstances = newMap;
}

// ====== 百科注册 ======
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  MECHANICS.equipment_quality = {
    id: "equipment_quality",
    name: "装备品质",
    icon: "💎",
    brief:
      "装备有普通/稀有/史诗/传说四档品质，品质越高价格越高、工作收入加成越强。",
    version: "2.0",
    related: ["mechanics:inventory"],
    sections: [
      {
        type: "desc",
        content:
          "购买/拾取/获赠装备时随机生成品质。品质越高，价格倍率越高，对应工作的收入加成也按效果倍率放大。",
      },
      {
        type: "table",
        headers: ["品质", "图标", "购买出现概率", "价格倍率", "效果倍率"],
        rows: [
          ["普通", "⬜", "70%", "×1.0", "×1.0"],
          ["稀有", "🟩", "20%", "×1.3", "×1.1"],
          ["史诗", "🟦", "8%", "×1.8", "×1.2"],
          ["传说", "🟨", "2%", "×2.5", "×1.5"],
        ],
      },
    ],
  };
}
