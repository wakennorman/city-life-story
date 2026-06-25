/**
 * 装备品质系统 (Equipment Quality System)
 *
 * 为装备/道具添加品质等级和随机附魔。
 * 参考：《暗黑破坏神》装备品质、《魔兽世界》物品稀有度、《Stardew Valley》工具等级
 *
 * 品质等级: common(普通) → rare(稀有) → epic(史诗) → legendary(传说)
 * 品质影响：基础属性倍率、价格倍率、附魔数量
 * 附魔：随机附加特殊效果（如收入+5%、疲劳恢复+10%等）
 */

const EQUIPMENT_QUALITIES = {
  common: {
    id: "common",
    name: "普通",
    color: "#99958e",
    icon: "⬜",
    priceMult: 1.0,
    effectMult: 1.0,
    enchantCount: 0,
    weight: 70,
  },
  rare: {
    id: "rare",
    name: "稀有",
    color: "#4a9e5c",
    icon: "🟩",
    priceMult: 1.3,
    effectMult: 1.1,
    enchantCount: 1,
    weight: 20,
  },
  epic: {
    id: "epic",
    name: "史诗",
    color: "#4a6cf7",
    icon: "🟦",
    priceMult: 1.8,
    effectMult: 1.2,
    enchantCount: 2,
    weight: 8,
  },
  legendary: {
    id: "legendary",
    name: "传说",
    color: "#e8b84c",
    icon: "🟨",
    priceMult: 2.5,
    effectMult: 1.5,
    enchantCount: 3,
    weight: 2,
  },
};

const ENCHANTMENTS = [
  {
    id: "lucky",
    name: "幸运",
    icon: "🍀",
    desc: "收入+5%",
    weight: 15,
    apply: function () {
      return { incomeBonus: 0.05 };
    },
  },
  {
    id: "endurance",
    name: "耐力",
    icon: "💪",
    desc: "疲劳恢复+10%",
    weight: 15,
    apply: function () {
      return { fatigueRecoveryBonus: 0.1 };
    },
  },
  {
    id: "wisdom",
    name: "智慧",
    icon: "🧠",
    desc: "学习XP+10%",
    weight: 12,
    apply: function () {
      return { skillXpBonus: 0.1 };
    },
  },
  {
    id: "vitality",
    name: "活力",
    icon: "✨",
    desc: "健康恢复+10%",
    weight: 12,
    apply: function () {
      return { healthRecoveryBonus: 0.1 };
    },
  },
  {
    id: "agility_up",
    name: "轻快",
    icon: "🏃",
    desc: "敏捷+2",
    weight: 12,
    apply: function () {
      return { agility: 2 };
    },
  },
  {
    id: "strength_up",
    name: "力量",
    icon: "🦾",
    desc: "体质+2",
    weight: 12,
    apply: function () {
      return { physique: 2 };
    },
  },
  {
    id: "hygiene_up",
    name: "洁净",
    icon: "✨",
    desc: "卫生+3",
    weight: 10,
    apply: function () {
      return { hygiene: 3 };
    },
  },
  {
    id: "fame_up",
    name: "名望",
    icon: "⭐",
    desc: "名气+1",
    weight: 8,
    apply: function () {
      return { fame: 1 };
    },
  },
  {
    id: "fortune",
    name: "财运",
    icon: "💰",
    desc: "交易收入+8%",
    weight: 4,
    apply: function () {
      return { tradeIncomeBonus: 0.08 };
    },
  },
];

function rollItemQuality() {
  var totalWeight = 0;
  for (var q in EQUIPMENT_QUALITIES) {
    if (EQUIPMENT_QUALITIES.hasOwnProperty(q))
      totalWeight += EQUIPMENT_QUALITIES[q].weight;
  }
  var roll = Random.float(0, totalWeight);
  for (var qid in EQUIPMENT_QUALITIES) {
    if (!EQUIPMENT_QUALITIES.hasOwnProperty(qid)) continue;
    roll -= EQUIPMENT_QUALITIES[qid].weight;
    if (roll <= 0) return qid;
  }
  return "common";
}

function rollEnchantments(quality) {
  var qDef = EQUIPMENT_QUALITIES[quality] || EQUIPMENT_QUALITIES.common;
  var count = qDef.enchantCount;
  if (count <= 0) return [];
  var totalWeight = 0;
  for (var i = 0; i < ENCHANTMENTS.length; i++)
    totalWeight += ENCHANTMENTS[i].weight;
  var result = [];
  var usedIds = {};
  for (var e = 0; e < count; e++) {
    var attempts = 0;
    while (attempts < 10) {
      var roll = Random.float(0, totalWeight);
      for (var j = 0; j < ENCHANTMENTS.length; j++) {
        roll -= ENCHANTMENTS[j].weight;
        if (roll <= 0) {
          var ench = ENCHANTMENTS[j];
          if (!usedIds[ench.id]) {
            usedIds[ench.id] = true;
            result.push({
              id: ench.id,
              name: ench.name,
              icon: ench.icon,
              desc: ench.desc,
              effects: ench.apply(),
            });
            attempts = 999;
          }
          break;
        }
      }
      attempts++;
    }
  }
  return result;
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

function generateItemQuality(itemDef, options) {
  if (!itemDef) return null;
  if (itemDef.isIngredient) return null;
  if (itemDef.id && itemDef.id.indexOf("cert_") === 0) return null;
  var quality =
    options && options.forceQuality ? options.forceQuality : rollItemQuality();
  var enchantments = rollEnchantments(quality);
  var qDef = EQUIPMENT_QUALITIES[quality] || EQUIPMENT_QUALITIES.common;
  return {
    quality: quality,
    enchantments: enchantments,
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

function describeItemQuality(qualityInfo) {
  if (!qualityInfo || qualityInfo.quality === "common") return "";
  var parts = [];
  if (qualityInfo.enchantments && qualityInfo.enchantments.length > 0) {
    qualityInfo.enchantments.forEach(function (e) {
      parts.push(e.icon + " " + e.desc);
    });
  }
  return parts.join(" ");
}

function createItemWithQuality(itemId, options) {
  options = options || {};
  var def = null;
  if (typeof ITEMS !== "undefined") {
    def = ITEMS.find(function (i) {
      return i.id === itemId;
    });
  }
  var qualityInfo = def ? generateItemQuality(def, options) : null;
  var item = { id: itemId, qty: options.qty || 1 };
  if (qualityInfo) {
    item.quality = qualityInfo.quality;
    item.enchantments = qualityInfo.enchantments;
  }
  return item;
}

function getQualityInfo(quality) {
  return EQUIPMENT_QUALITIES[quality] || EQUIPMENT_QUALITIES.common;
}

function formatEnchantmentDesc(enchantments) {
  if (!enchantments || enchantments.length === 0) return "";
  return enchantments
    .map(function (e) {
      return e.icon + " " + e.desc;
    })
    .join(" ");
}

function getQualityClass(quality) {
  return "quality-" + quality;
}

/**
 * 创建设备实例（带品质 + 耐久）
 * 被 modal.js 的 buyItemFromShop 调用
 * @param {object} itemDef - 装备定义对象（来自 ITEMS 数组）
 * @param {string} source - "buy" | "loot" | "reward"
 * @returns {object} { instanceId, quality, qualityName, qualityColor, qualityIcon, enchantments, actualPrice, durability, maxDurability, isBroken }
 */
function createEquipmentInstance(itemDef, source) {
  if (!itemDef || !itemDef.slot) return null;

  var qualityInfo = generateItemQuality(itemDef, {});
  if (!qualityInfo) {
    // 回退到普通品质
    var basicInstance = {
      instanceId: itemDef.id + "_inst",
      quality: "common",
      qualityName: "普通",
      qualityColor: "#99958e",
      qualityIcon: "⬜",
      enchantments: [],
      actualPrice: itemDef.price || 0,
    };
    // 添加耐久
    if (typeof initItemDurability === "function") {
      basicInstance =
        initItemDurability(basicInstance, itemDef) || basicInstance;
    }
    return basicInstance;
  }

  var actualPrice = Math.round((itemDef.price || 0) * qualityInfo.priceMult);
  var instanceId = itemDef.id + "_" + Date.now() + "_" + Random.int(0, 999);
  var instance = {
    instanceId: instanceId,
    quality: qualityInfo.quality,
    qualityName: qualityInfo.qualityName,
    qualityColor: qualityInfo.qualityColor,
    qualityIcon: qualityInfo.qualityIcon,
    enchantments: qualityInfo.enchantments,
    actualPrice: actualPrice,
  };

  // 添加耐久
  if (typeof initItemDurability === "function") {
    instance = initItemDurability(instance, itemDef) || instance;
  }

  return instance;
}

// ====== 百科注册 ======
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  MECHANICS.equipment_quality = {
    id: "equipment_quality",
    name: "装备品质",
    icon: "💎",
    brief:
      "装备有普通/稀有/史诗/传说四档品质，品质越高效果越强，并可附带随机附魔效果。",
    version: "1.0",
    related: ["mechanics:items"],
    sections: [
      {
        type: "desc",
        content:
          "购买装备时随机生成品质。品质越高，基础属性倍率越高，还可获得额外附魔效果。",
      },
      {
        type: "table",
        headers: ["品质", "图标", "出现概率", "价格倍率", "效果倍率", "附魔数"],
        rows: [
          ["普通", "⬜", "70%", "×1.0", "×1.0", "无"],
          ["稀有", "🟩", "20%", "×1.3", "×1.1", "1个"],
          ["史诗", "🟦", "8%", "×1.8", "×1.2", "2个"],
          ["传说", "🟨", "2%", "×2.5", "×1.5", "3个"],
        ],
      },
    ],
  };
}
