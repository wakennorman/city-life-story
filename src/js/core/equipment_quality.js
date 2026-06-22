/**
 * 装备品质系统 v1.0
 * 四档品质：普通/稀有/史诗/传说 + 随机附魔特效
 * 参考：《暗黑破坏神》装备品质、《魔兽世界》物品稀有度、《Stardew Valley》工具等级
 */

// ============================================================
// 品质等级定义
// ============================================================
const EQUIPMENT_QUALITY = {
  common: {
    id: "common",
    name: "普通",
    icon: "⚪",
    color: "#999999",
    textColor: "#888888",
    priceMultiplier: 1.0,
    effectMultiplier: 1.0,
    probability: 0.7,
    description: "最常见的装备，属性标准。",
  },
  rare: {
    id: "rare",
    name: "稀有",
    icon: "🔵",
    color: "#4A90D9",
    textColor: "#5DADE2",
    priceMultiplier: 1.3,
    effectMultiplier: 1.1,
    probability: 0.2,
    description: "品质较好的装备，属性略强。",
  },
  epic: {
    id: "epic",
    name: "史诗",
    icon: "🟣",
    color: "#9B59B6",
    textColor: "#AF7AC5",
    priceMultiplier: 1.8,
    effectMultiplier: 1.2,
    probability: 0.08,
    description: "罕见的优质装备，属性显著增强。",
  },
  legendary: {
    id: "legendary",
    name: "传说",
    icon: "🟠",
    color: "#E67E22",
    textColor: "#F39C12",
    priceMultiplier: 2.5,
    effectMultiplier: 1.5,
    probability: 0.02,
    description: "传说中的装备，属性强大，可能附带特殊能力。",
  },
};

const QUALITY_RANK = { common: 1, rare: 2, epic: 3, legendary: 4 };

// ============================================================
// 附魔特效定义
// ============================================================
const ENCHANTMENTS = {
  lucky: {
    id: "lucky",
    name: "幸运",
    icon: "🍀",
    effect: { incomeBonus: 0.05 },
    desc: "幸运：收入+5%",
    rarity: "common",
  },
  endurance: {
    id: "endurance",
    name: "耐力",
    icon: "💪",
    effect: { fatigueRecoveryBonus: 0.1 },
    desc: "耐力：疲劳恢复+10%",
    rarity: "common",
  },
  wisdom: {
    id: "wisdom",
    name: "智慧",
    icon: "📚",
    effect: { skillXpBonus: 0.1 },
    desc: "智慧：学习XP+10%",
    rarity: "rare",
  },
  vitality: {
    id: "vitality",
    name: "活力",
    icon: "❤️",
    effect: { healthRecoveryBonus: 0.1 },
    desc: "活力：健康恢复+10%",
    rarity: "rare",
  },
  agility_up: {
    id: "agility_up",
    name: "迅捷",
    icon: "⚡",
    effect: { agility: 2 },
    desc: "迅捷：敏捷+2",
    rarity: "rare",
  },
  strength_up: {
    id: "strength_up",
    name: "力量",
    icon: "🏋️",
    effect: { physique: 2 },
    desc: "力量：体质+2",
    rarity: "rare",
  },
  hygiene_up: {
    id: "hygiene_up",
    name: "洁净",
    icon: "✨",
    effect: { hygiene: 3 },
    desc: "洁净：卫生+3",
    rarity: "common",
  },
  fame_up: {
    id: "fame_up",
    name: "声望",
    icon: "🌟",
    effect: { fame: 1 },
    desc: "声望：名气+1",
    rarity: "rare",
  },
  sharpness: {
    id: "sharpness",
    name: "锋利",
    icon: "⚔️",
    effect: { repairEfficiency: 0.15 },
    desc: "锋利：维修效率+15%",
    rarity: "epic",
  },
  guardian: {
    id: "guardian",
    name: "守护",
    icon: "🛡️",
    effect: { injuryReduction: 0.05, illnessReduction: 0.05 },
    desc: "守护：受伤/生病概率-5%",
    rarity: "epic",
  },
  master: {
    id: "master",
    name: "大师",
    icon: "👑",
    effect: { allSkillsBonus: 0.05 },
    desc: "大师：所有技能XP+5%",
    rarity: "legendary",
  },
  dragon: {
    id: "dragon",
    name: "龙魂",
    icon: "🐉",
    effect: { healthBonus: 10, fame: 5, incomeBonus: 0.1 },
    desc: "龙魂：健康+10、名气+5、收入+10%",
    rarity: "legendary",
  },
};

const ENCHANTMENT_BY_QUALITY = {
  common: ["lucky", "endurance", "hygiene_up"],
  rare: ["wisdom", "vitality", "agility_up", "strength_up", "fame_up"],
  epic: ["sharpness", "guardian", "wisdom", "vitality"],
  legendary: ["master", "dragon", "guardian"],
};

// ============================================================
// 核心函数
// ============================================================

function generateQuality(source) {
  let probs = { common: 0.7, rare: 0.2, epic: 0.08, legendary: 0.02 };
  if (source === "pickup")
    probs = { common: 0.85, rare: 0.12, epic: 0.03, legendary: 0.0 };
  else if (source === "gift")
    probs = { common: 0.5, rare: 0.35, epic: 0.12, legendary: 0.03 };
  else if (source === "event")
    probs = { common: 0.4, rare: 0.35, epic: 0.2, legendary: 0.05 };
  else if (source === "shop_premium")
    probs = { common: 0.3, rare: 0.45, epic: 0.2, legendary: 0.05 };

  const rand = Math.random();
  let cumulative = 0;
  for (const [qualityId, quality] of Object.entries(probs)) {
    cumulative += quality;
    if (rand <= cumulative) return qualityId;
  }
  return "common";
}

function generateEnchantments(quality) {
  const available =
    ENCHANTMENT_BY_QUALITY[quality] || ENCHANTMENT_BY_QUALITY.common;
  const count =
    quality === "legendary"
      ? 2
      : quality === "epic"
        ? 1
        : Math.random() < 0.3
          ? 1
          : 0;
  const enchantments = [];
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    enchantments.push(shuffled[i]);
  }
  return enchantments;
}

function calculateActualEffects(item, qualityId, enchantments) {
  const quality = EQUIPMENT_QUALITY[qualityId] || EQUIPMENT_QUALITY.common;
  const effectMultiplier = quality.effectMultiplier;
  const effects = {};
  if (item.effects) {
    for (const [key, value] of Object.entries(item.effects)) {
      effects[key] =
        typeof value === "number" ? value * effectMultiplier : value;
    }
  }
  for (const enchantId of enchantments) {
    const enchant = ENCHANTMENTS[enchantId];
    if (enchant?.effect) {
      for (const [key, value] of Object.entries(enchant.effect)) {
        effects[key] =
          (effects[key] || 0) + (typeof value === "number" ? value : value);
      }
    }
  }
  return effects;
}

function calculateQualityPrice(basePrice, qualityId) {
  const quality = EQUIPMENT_QUALITY[qualityId] || EQUIPMENT_QUALITY.common;
  return Math.round(basePrice * quality.priceMultiplier);
}

function getQualityInfo(qualityId) {
  return EQUIPMENT_QUALITY[qualityId] || EQUIPMENT_QUALITY.common;
}
function getEnchantmentInfo(enchantId) {
  return ENCHANTMENTS[enchantId] || null;
}
function compareQuality(a, b) {
  return (QUALITY_RANK[a] || 1) - (QUALITY_RANK[b] || 1);
}

function createEquipmentInstance(itemDef, source) {
  const qualityId = generateQuality(source);
  const enchantments = generateEnchantments(qualityId);
  const actualEffects = calculateActualEffects(
    itemDef,
    qualityId,
    enchantments,
  );
  const actualPrice = calculateQualityPrice(itemDef.price, qualityId);
  return {
    ...itemDef,
    quality: qualityId,
    enchantments,
    actualEffects,
    actualPrice,
    baseEffects: itemDef.effects || {},
    basePrice: itemDef.price,
  };
}

function formatEnchantmentDesc(enchantments) {
  if (!enchantments?.length) return "";
  return enchantments
    .map((id) => {
      const info = ENCHANTMENTS[id];
      return info ? `${info.icon} ${info.name}` : id;
    })
    .join(" · ");
}

function getQualityClass(qualityId) {
  return `quality-${qualityId}`;
}

// ============================================================
// 全局注册
// ============================================================
if (typeof window !== "undefined") {
  window.EQUIPMENT_QUALITY = EQUIPMENT_QUALITY;
  window.ENCHANTMENTS = ENCHANTMENTS;
  window.generateQuality = generateQuality;
  window.generateEnchantments = generateEnchantments;
  window.calculateActualEffects = calculateActualEffects;
  window.calculateQualityPrice = calculateQualityPrice;
  window.getQualityInfo = getQualityInfo;
  window.getEnchantmentInfo = getEnchantmentInfo;
  window.compareQuality = compareQuality;
  window.createEquipmentInstance = createEquipmentInstance;
  window.formatEnchantmentDesc = formatEnchantmentDesc;
  window.getQualityClass = getQualityClass;
  window.QUALITY_RANK = QUALITY_RANK;
}

// ============================================================
// 百科注册
// ============================================================
if (typeof window !== "undefined" && typeof window.MECHANICS !== "undefined") {
  window.MECHANICS.equipment_quality = {
    id: "equipment_quality",
    name: "装备品质系统",
    icon: "💎",
    brief: "装备有普通/稀有/史诗/传说四档品质，附带随机附魔特效",
    version: "v1.0",
    related: ["items:*", "mechanics:equipment"],
    sections: [
      {
        title: "品质等级",
        html: () => {
          const rows = Object.entries(EQUIPMENT_QUALITY)
            .map(
              ([id, q]) =>
                `<tr><td style="color:${q.color}">${q.icon} ${q.name}</td><td>${q.probability * 100}%</td><td>价格×${q.priceMultiplier}</td><td>效果×${q.effectMultiplier}</td><td>${q.description}</td></tr>`,
            )
            .join("");
          return `<table style="width:100%;text-align:left"><tr style="background:var(--background-secondary)"><th>品质</th><th>概率</th><th>价格</th><th>效果</th><th>说明</th></tr>${rows}</table>`;
        },
      },
      {
        title: "附魔特效",
        list: Object.entries(ENCHANTMENTS).map(([id, e]) => ({
          icon: e.icon,
          text: `${e.name}：${e.desc}`,
          color: EQUIPMENT_QUALITY[e.rarity]?.color || "#999",
        })),
      },
      {
        title: "品质来源",
        list: [
          "普通购买：70%普通 / 20%稀有 / 8%史诗 / 2%传说",
          "拾荒/掉落：85%普通 / 12%稀有 / 3%史诗",
          "NPC赠送：50%普通 / 35%稀有 / 12%史诗 / 3%传说",
          "特殊事件：40%普通 / 35%稀有 / 20%史诗 / 5%传说",
          "高端商店：30%普通 / 45%稀有 / 20%史诗 / 5%传说",
        ],
      },
      {
        title: "提示",
        list: [
          "高品质装备价格更高，但效果更强",
          "传说装备可能附带2个附魔特效",
          "附魔效果会叠加到基础属性上",
          "NPC好感度越高，赠送装备品质越好",
        ],
      },
    ],
  };
}
