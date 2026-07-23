/**
 * 装备耐久度系统 — 磨损·维修·回收联动
 *
 * 设计原则：
 * - 日常使用轻微磨损，极端天气/高风险工作磨损加速
 * - 维修技能决定「你能看到什么信息」和「能修到什么程度」
 * - 维修消耗回收废料（scrap_metal 等），打通回收→维修闭环
 * - 耐久归零的装备效果失效，但不消失（可以修）
 *
 * ┌──────────────┐
 * │  玩家装备物品  │
 * └──────┬───────┘
 *        ↓ 每日使用
 * ┌──────────────┐
 * │  durability-- │ ← 磨损
 * │  （装备专属）  │
 * └──────┬───────┘
 *        ↓ 耐久 ≤ 0
 * ┌──────────────┐
 * │  装备效果失效  │ ← 仍可装备，但不提供加成
 * └──────┬───────┘
 *        ↓ 维修
 * ┌──────────────┐
 * │  消耗回收废料  │ ← 打通回收→维修闭环
 * │  恢复耐久度    │
 * └──────────────┘
 */

// ====== 装备基底耐久度 ======
var _DURABILITY_BASE = {
  // 套装/通用装备（按价格分档）
  straw_hat: { max: 30, category: "light" },
  work_gloves: { max: 50, category: "heavy" },
  mask: { max: 20, category: "light" },
  sturdy_shoes: { max: 60, category: "heavy" },
  backpack: { max: 80, category: "heavy" },
  work_uniform: { max: 60, category: "standard" },
  safety_helmet: { max: 100, category: "heavy" },
  smartphone: { max: 100, category: "electronic" },
  bicycle: { max: 120, category: "vehicle" },
  // 高品质背包
  backpack_basic: { max: 50, category: "heavy" },
  backpack_large: { max: 100, category: "heavy" },
  backpack_pro: { max: 150, category: "heavy" },
  // 季节装
  warm_coat: { max: 80, category: "standard" },
  thermal_underwear: { max: 60, category: "light" },
  raincoat: { max: 40, category: "light" },
  umbrella: { max: 30, category: "light" },
  sunscreen: { max: 20, category: "consumable" },
  // 安全类
  first_aid_kit: { max: 15, category: "consumable" },
  work_boots: { max: 120, category: "heavy" },
  reflective_vest: { max: 60, category: "standard" },
  pepper_spray: { max: 20, category: "consumable" },
  // 数码
  power_bank: { max: 80, category: "electronic" },
  laptop_bag: { max: 100, category: "standard" },
  smart_watch: { max: 100, category: "electronic" },
  noise_cancelling_earphones: { max: 70, category: "electronic" },
  // 生活
  thermos: { max: 90, category: "standard" },
  folding_bike: { max: 150, category: "vehicle" },
  // 学习
  cert_exam_book: { max: 30, category: "light" },
  notebook_item: { max: 20, category: "light" },
  // 杂项
  flashlight: { max: 60, category: "electronic" },
  radio: { max: 80, category: "electronic" },
};

// 默认耐久度（未在 _DURABILITY_BASE 中定义的装备）
var _DEFAULT_MAX_DURABILITY = 50;

/**
 * 获取装备的基底耐久度配置
 */
function getDurabilityBase(itemId) {
  return (
    _DURABILITY_BASE[itemId] || {
      max: _DEFAULT_MAX_DURABILITY,
      category: "standard",
    }
  );
}

// ====== 耐久度描述（维修技能可见性） ======

/**
 * 根据维修技能等级返回装备「可见状态」。
 *
 * Lv  0：只看得到装备名称，看不到任何状态
 * Lv 20：能看到模糊描述（"看起来还行" / "有点磨损了" / "快不行了"）
 * Lv 40：能看到精确耐久值（"72/100"）
 * Lv 60：能看到维修成本估算 + 可修复
 *
 * @param {Object} state - 游戏状态
 * @param {number} durability - 当前耐久度
 * @param {number} maxDurability - 最大耐久度
 * @returns {Object} { visible: bool, label: string, detail: string|null, repairable: bool, repairCost: number|null }
 */
function getDurabilityVisibility(state, durability, maxDurability) {
  var repairLevel =
    (state.skills && state.skills.repair && state.skills.repair.level) || 0;

  var ratio = maxDurability > 0 ? durability / maxDurability : 0;

  // Lv 0: 完全不可见
  if (repairLevel < 20) {
    return {
      visible: false,
      label: "",
      detail: null,
      repairable: false,
      repairCost: null,
    };
  }

  // Lv 20+: 模糊描述
  var label;
  if (ratio <= 0) label = "⚠️ 已损坏，无效果";
  else if (ratio <= 0.25) label = "⚡ 严重磨损，快不行了";
  else if (ratio <= 0.5) label = "🔧 有点磨损了";
  else if (ratio <= 0.75) label = "👍 看起来还行";
  else label = "✨ 几乎全新";

  // Lv 40+: 可见精确值
  var detail = null;
  if (repairLevel >= 40) {
    detail = durability + "/" + maxDurability;
  }

  // Lv 60+: 可维修 + 成本估算
  var repairable = false;
  var repairCost = null;
  if (repairLevel >= 60 && durability < maxDurability) {
    repairable = true;
    // 维修成本 = 缺失耐久度 * 0.3，按 scrap_metal 数量折算
    var missing = maxDurability - durability;
    repairCost = Math.max(1, Math.ceil(missing * 0.3));
  }

  return {
    visible: true,
    label: label,
    detail: detail,
    repairable: repairable,
    repairCost: repairCost,
  };
}

// ====== 磨损系统 ======

/**
 * 检查装备是否需要耐久度初始化。
 * 装备首次被放入 equipment slot 时，如果没有 durability 字段则初始化。
 *
 * @param {Object} state - 游戏状态
 */
function initEquipmentDurability(state) {
  if (!state.inventory || !state.inventory.equipment) return;
  if (!state.inventory.equipmentInstances)
    state.inventory.equipmentInstances = {};

  for (var slot in state.inventory.equipment) {
    var itemId = state.inventory.equipment[slot];
    if (!itemId) continue;
    var inst = getEquippedInstance(state, slot);
    if (!inst) {
      // 兜底：实例缺失（迁移后不应发生），补一个 common 实例
      var def = typeof getItemById === "function" ? getItemById(itemId) : null;
      if (def && typeof createEquipmentInstance === "function") {
        inst = createEquipmentInstance(def, "migrate", {
          forceQuality: "common",
        });
      } else {
        var base = getDurabilityBase(itemId);
        inst = {
          itemId: itemId,
          durability: base.max,
          maxDurability: base.max,
          isBroken: false,
        };
      }
      state.inventory.equipmentInstances[slot] = inst;
      continue;
    }
    if (inst.durability === undefined) {
      var base2 = getDurabilityBase(itemId);
      inst.durability = base2.max;
      inst.maxDurability = base2.max;
    }
  }
}

/**
 * 每日磨损：对当前装备的所有物品施加磨损。
 *
 * 磨损规则：
 * - 基础磨损：每个装备 -1~3 点（随机）
 * - 高风险工作（建筑/搬运/回收）：额外 -1~2
 * - 极端天气（暴雨/台风/暴雪）：额外 -1~2
 * - 背包类（vehicle/category="heavy" 以外的 accessory）：磨损减半
 * - 消耗品（consumable category）：磨损翻倍（用得快）
 *
 * 在 daily_pipeline 中调用。
 *
 * @param {Object} state - 游戏状态
 */
function applyDailyWear(state) {
  if (!state.inventory || !state.inventory.equipment) return;

  // 确保耐久度已初始化
  initEquipmentDurability(state);

  // 检查玩家当前工作是否是高风险
  var highRiskJobs = [
    "manual_labor_construction",
    "waste_recycling",
    "steel_worker",
    "premium_engineering",
  ];
  var isHighRisk =
    state.employment &&
    state.employment.currentJob &&
    highRiskJobs.indexOf(state.employment.currentJob) >= 0;

  // 检查天气
  var harshWeather = false;
  if (state.weather && state.weather.current) {
    var w = state.weather.current;
    harshWeather = w === "typhoon" || w === "blizzard" || w === "heavy_rain";
  }

  for (var slot in state.inventory.equipment) {
    var itemId = state.inventory.equipment[slot];
    if (!itemId) continue;

    var base = getDurabilityBase(itemId);
    var inst = getEquippedInstance(state, slot);
    if (!inst || inst.durability === undefined || inst.durability <= 0)
      continue;

    // 计算磨损
    var wear = Random.int(1, 3); // 基础磨损 1~3

    // 高风险工作加成
    if (isHighRisk) wear += Random.int(1, 2);

    // 恶劣天气加成
    if (harshWeather) wear += Random.int(1, 2);

    // 消耗品磨损翻倍
    if (base.category === "consumable") wear *= 2;

    // 轻量装备磨损减半
    if (base.category === "light") wear = Math.max(1, Math.floor(wear / 2));

    // 应用磨损
    inst.durability = Math.max(0, inst.durability - wear);
  }
}

/**
 * 维修一件装备。
 *
 * 条件：
 * - 维修技能 ≥ 60
 * - 背包中有足够的废料（scrap_metal）
 * - 装备耐久未满
 *
 * @param {Object} state - 游戏状态
 * @param {string} itemId - 装备ID
 * @returns {boolean} 是否成功维修
 */
// 装备维修功能由 equipment_durability.js 提供完整实现（含 repairEquipment）
// 本文件不再定义 repairEquipment，避免与 equipment_durability.js 的 function 声明冲突

/**
 * 为 render.js 装备卡片提供耐久度预览 HTML。
 * 这个函数名是 render.js 中已预留的钩子。
 *
 * @param {Object} state - 游戏状态
 * @param {Object} itemDef - 物品定义
 * @returns {string|null} HTML 字符串，或 null（不可见时）
 */
function buildRepairPreview(state, itemDef) {
  if (!state.inventory || !state.inventory.equipment) return null;

  var itemId = itemDef && itemDef.id;
  if (!itemId) return null;

  // 检查该物品是否在装备中，并记录 slot
  var itemSlot = null;
  for (var s in state.inventory.equipment) {
    if (state.inventory.equipment[s] === itemId) {
      itemSlot = s;
      break;
    }
  }
  if (!itemSlot) return null;

  // 检查耐久度实例
  var inst = getEquippedInstance(state, itemSlot);
  if (!inst || inst.durability === undefined) return null;

  var vis = getDurabilityVisibility(state, inst.durability, inst.maxDurability);
  if (!vis.visible) return null;

  var parts = [vis.label];
  if (vis.detail) parts.push(" (" + vis.detail + ")");

  var html = parts.join("");

  // 可维修时显示修复按钮
  if (vis.repairable && vis.repairCost !== null) {
    // 检查废料是否足够
    var scrapCount = 0;
    if (state.inventory.items) {
      var scrap1 = state.inventory.items.find(function (i) {
        return i.id === "scrap_metal";
      });
      var scrap2 = state.inventory.items.find(function (i) {
        return i.id === "scrap_recycled";
      });
      scrapCount = (scrap1 ? scrap1.qty : 0) + (scrap2 ? scrap2.qty : 0);
    }
    var canAfford = scrapCount >= vis.repairCost;
    var costColor = canAfford ? "var(--success)" : "var(--warning)";

    html +=
      ' <span style="font-size:9px;color:' +
      costColor +
      ';">🔧修:' +
      vis.repairCost +
      "废料" +
      (scrapCount > 0 ? "(有" + scrapCount + ")" : "(无)") +
      "</span>";

    if (canAfford) {
      html +=
        ' <button style="font-size:10px;padding:2px 6px;margin-left:4px;background:var(--accent);color:#fff;border:none;border-radius:3px;cursor:pointer;" onclick="repairEquipment(StateManager.getState(), \'' +
        itemId +
        "')\">修复</button>";
    }
  }

  return html;
}

// ====== 装备效果检查（耐久≤0时无效果） ======

/**
 * 获取装备的实际效果（考虑耐久度）。
 * 耐久度 ≤ 0 时，装备效果为 0（装备效果失效）。
 *
 * @param {Object} state - 游戏状态
 * @param {string} itemId - 装备ID
 * @param {Object} effects - 原始效果对象
 * @returns {Object|null} 实际生效的效果，或 null（耐久为0）
 */
function getEffectiveEffects(state, itemId, effects) {
  if (!state.inventory || !state.inventory.equipment) return effects;

  // 检查该装备是否当前装备中，并记录 slot
  var itemSlot = null;
  for (var s in state.inventory.equipment) {
    if (state.inventory.equipment[s] === itemId) {
      itemSlot = s;
      break;
    }
  }
  if (!itemSlot) return effects;

  // 检查耐久度
  var inst = getEquippedInstance(state, itemSlot);
  if (!inst || inst.durability === undefined) return effects;

  if (inst.durability <= 0) {
    return null; // 装备失效
  }

  return effects;
}

/**
 * 检查装备是否已损坏（耐久≤0）。
 */
function isEquipmentBroken(state, itemId) {
  if (!state.inventory || !state.inventory.equipment) return false;
  // 从 itemId 反查 slot
  var itemSlot = null;
  for (var s in state.inventory.equipment) {
    if (state.inventory.equipment[s] === itemId) {
      itemSlot = s;
      break;
    }
  }
  if (!itemSlot) return false;
  var inst = getEquippedInstance(state, itemSlot);
  if (!inst || inst.durability === undefined) return false;
  return inst.durability <= 0;
}

// ====== 百科注册 ======
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.durability = {
    id: "durability",
    name: "装备耐久度系统",
    icon: "🔧",
    brief:
      "日常使用会磨损装备，耐久归零效果失效，维修技能提升可解锁更多信息并修复装备",
    version: "1.0.0",
    related: ["skills:repair"],
    sections: [
      {
        kind: "desc",
        text: "装备耐久度系统将日常磨损、维修技能与回收体系打通。每个装备都有耐久度，使用越多磨损越严重。耐久归零时装备效果失效，但仍可维修恢复。维修消耗回收废料，形成了「回收→维修→再用」的完整闭环。",
      },
      {
        kind: "subhead",
        text: "👁️ 维修技能可见等级",
      },
      {
        kind: "table",
        headers: ["技能等级", "可见信息"],
        rows: [
          ["Lv 0-19", "只看得到装备名称，看不到任何状态"],
          ["Lv 20-39", "可见模糊描述（几乎全新/看起来还行/有点磨损/快不行了）"],
          ["Lv 40-59", "可见精确耐久数值（如 72/100）"],
          ["Lv 60+", "可见维修成本估算，可消耗废料修复装备"],
        ],
      },
      {
        kind: "subhead",
        text: "⏳ 磨损规则",
      },
      {
        kind: "list",
        items: [
          "基础磨损：每个装备每日-1~3点耐久",
          "高风险工作（建筑/搬运/回收等）：额外-1~2",
          "恶劣天气（暴雨/台风/暴雪）：额外-1~2",
          "消耗品（防晒霜/急救包等）：磨损翻倍",
          "轻量装备（口罩/草帽等）：磨损减半",
        ],
      },
      {
        kind: "subhead",
        text: "♻️ 维修—回收闭环",
      },
      {
        kind: "desc",
        text: "维修消耗回收废料（scrap_metal），每点缺失耐久消耗0.3个废料。废料可通过废品回收工作、拾荒等途径获得。维修成功时还获得10点维修技能经验，鼓励玩家在实践中提升技能。",
      },
    ],
  };
}
