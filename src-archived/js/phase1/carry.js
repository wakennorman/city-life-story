/**
 * 背包与运输系统
 *
 * 改进点：
 * - 商品增加重量/体积/易腐属性
 * - 背包容量改为重量+体积双限制
 * - 多层携带：背部+腰带+手持
 * - 负重等级影响AP消耗和移动速度
 * - 雇佣运输：力工/快递/搬家公司
 * - 运输随机事件：偷窃/天气损坏/交通事故
 */

// ====== 商品物理属性扩展 ======
// 为每个商品补充重量、体积、易腐性
const GOOD_PHYSICS = {
  water: {
    weight: 0.5,
    volume: 0.5,
    perishable: false,
    fragile: false,
    tempSensitive: false,
  },
  instant_noodles: {
    weight: 0.2,
    volume: 0.3,
    perishable: false,
    fragile: false,
    tempSensitive: false,
  },
  snacks: {
    weight: 0.15,
    volume: 0.2,
    perishable: true,
    shelfLife: 60,
    fragile: false,
    tempSensitive: false,
  },
  fruits: {
    weight: 0.5,
    volume: 0.6,
    perishable: true,
    shelfLife: 5,
    fragile: true,
    tempSensitive: true,
  },
  vegetables: {
    weight: 0.4,
    volume: 0.5,
    perishable: true,
    shelfLife: 4,
    fragile: true,
    tempSensitive: false,
  },
  beer: {
    weight: 0.6,
    volume: 0.5,
    perishable: false,
    fragile: true,
    tempSensitive: true,
  },
  cigarettes: {
    weight: 0.1,
    volume: 0.1,
    perishable: false,
    fragile: false,
    tempSensitive: false,
  },
  daily_use: {
    weight: 0.3,
    volume: 0.4,
    perishable: false,
    fragile: false,
    tempSensitive: false,
  },
  clothing: {
    weight: 0.4,
    volume: 0.3,
    perishable: false,
    fragile: false,
    tempSensitive: false,
  },
  electronics: {
    weight: 0.8,
    volume: 0.4,
    perishable: false,
    fragile: true,
    tempSensitive: false,
  },
  scrap_metal: {
    weight: 2.0,
    volume: 0.8,
    perishable: false,
    fragile: false,
    tempSensitive: false,
  },
  scrap_paper: {
    weight: 0.3,
    volume: 1.0,
    perishable: false,
    fragile: false,
    tempSensitive: true,
  },
  scrap_plastic: {
    weight: 0.5,
    volume: 0.7,
    perishable: false,
    fragile: false,
    tempSensitive: false,
  },
};

/** 获取商品物理属性 */
function getGoodPhysics(goodId) {
  return (
    GOOD_PHYSICS[goodId] || {
      weight: 0.5,
      volume: 0.5,
      perishable: false,
      fragile: false,
      tempSensitive: false,
    }
  );
}

// ====== 容器定义 ======
// 玩家可装备多个容器，每个容器有重量减免
const CONTAINER_TYPES = [
  {
    id: "none",
    name: "徒手",
    slot: null,
    capacity: 15,
    volumeCapacity: 12,
    weightReduction: 0,
    selfWeight: 0,
    selfVolume: 0,
    price: 0,
    desc: "什么都不带，两只手能拿多少是多少",
  },
  {
    id: "plastic_bag",
    name: "塑料袋",
    slot: "手持",
    capacity: 5,
    volumeCapacity: 8,
    weightReduction: 0.5,
    selfWeight: 0.05,
    selfVolume: 0.1,
    price: 1,
    desc: "超市两毛一个的塑料袋，装不了多少",
  },
  {
    id: "tote_bag",
    name: "帆布袋",
    slot: "手持",
    capacity: 10,
    volumeCapacity: 12,
    weightReduction: 0.7,
    selfWeight: 0.2,
    selfVolume: 0.2,
    price: 8,
    desc: "结实耐用的帆布袋，日常够用",
  },
  {
    id: "small_pack",
    name: "小双肩包",
    slot: "背部",
    capacity: 18,
    volumeCapacity: 16,
    weightReduction: 0.8,
    selfWeight: 0.5,
    selfVolume: 0.3,
    price: 30,
    desc: "学生用的双肩包，轻便实用",
  },
  {
    id: "backpack",
    name: "登山包",
    slot: "背部",
    capacity: 30,
    volumeCapacity: 25,
    weightReduction: 0.9,
    selfWeight: 1.2,
    selfVolume: 0.5,
    price: 80,
    desc: "专业登山包，承重减负，远行必备",
  },
  {
    id: "duffel",
    name: "旅行包",
    slot: "手持",
    capacity: 35,
    volumeCapacity: 30,
    weightReduction: 0.0,
    selfWeight: 1.0,
    selfVolume: 0.6,
    price: 60,
    desc: "大容量旅行包，但没减负，手提很累",
  },
  {
    id: "waist_bag",
    name: "腰包",
    slot: "腰带",
    capacity: 4,
    volumeCapacity: 3,
    weightReduction: 0.95,
    selfWeight: 0.15,
    selfVolume: 0.1,
    price: 15,
    desc: "贴身腰包，贵重物品随身带",
  },
  {
    id: "tool_box",
    name: "工具箱",
    slot: "手持",
    capacity: 12,
    volumeCapacity: 8,
    weightReduction: 0.0,
    selfWeight: 1.5,
    selfVolume: 0.5,
    price: 40,
    desc: "铁皮工具箱，装工具利器，但死沉",
  },
  {
    id: "cart",
    name: "小推车",
    slot: "手持",
    capacity: 60,
    volumeCapacity: 50,
    weightReduction: 0.0,
    selfWeight: 5.0,
    selfVolume: 2.0,
    price: 120,
    desc: "手推板车，搬运大量货物，但推着走很慢",
  },
];

/** 获取容器定义 */
function getContainerType(containerId) {
  return (
    CONTAINER_TYPES.find((c) => c.id === containerId) || CONTAINER_TYPES[0]
  );
}

// ====== 负重等级 ======
const ENCUMBRANCE_TIERS = [
  {
    name: "轻装",
    maxRatio: 0.5,
    movePenalty: 0,
    apPenalty: 0,
    desc: "身轻如燕",
  },
  {
    name: "正常",
    maxRatio: 0.8,
    movePenalty: 0,
    apPenalty: 0,
    desc: "正常负重",
  },
  {
    name: "略重",
    maxRatio: 1.0,
    movePenalty: 0.1,
    apPenalty: 0,
    desc: "背了点东西",
  },
  {
    name: "沉重",
    maxRatio: 1.3,
    movePenalty: 0.2,
    apPenalty: 1,
    desc: "步履沉重",
  },
  {
    name: "超载",
    maxRatio: 1.6,
    movePenalty: 0.4,
    apPenalty: 2,
    desc: "几乎走不动了",
  },
  {
    name: "极限",
    maxRatio: 99,
    movePenalty: 0.6,
    apPenalty: 3,
    desc: "寸步难行！",
  },
];

/** 计算当前负重状态 */
function calcEncumbrance(state) {
  const totalWeight = calcInventoryWeight(state);
  const maxCarry = calcMaxCarryWeight(state);
  const ratio = maxCarry > 0 ? totalWeight / maxCarry : 0;

  let tier = ENCUMBRANCE_TIERS[0];
  for (const t of ENCUMBRANCE_TIERS) {
    if (ratio <= t.maxRatio) {
      tier = t;
      break;
    }
    tier = t;
  }

  return {
    totalWeight: Math.round(totalWeight * 10) / 10,
    maxCarry: Math.round(maxCarry * 10) / 10,
    ratio: Math.round(ratio * 100) / 100,
    tier,
    totalVolume: Math.round(calcInventoryVolume(state) * 10) / 10,
    maxVolume: Math.round(calcMaxCarryVolume(state) * 10) / 10,
  };
}

/** 计算背包中商品总重量 */
function calcInventoryWeight(state) {
  let w = 0;
  for (const item of state.inventory.items) {
    const phys = getGoodPhysics(item.id);
    w += phys.weight * item.qty;
  }
  // 容器自重
  const containers = state.inventory.containers || [];
  for (const c of containers) {
    const typeDef = getContainerType(c.containerId);
    w += typeDef.selfWeight;
  }
  return w;
}

/** 计算背包中商品总体积 */
function calcInventoryVolume(state) {
  let v = 0;
  for (const item of state.inventory.items) {
    const phys = getGoodPhysics(item.id);
    v += phys.volume * item.qty;
  }
  const containers = state.inventory.containers || [];
  for (const c of containers) {
    const typeDef = getContainerType(c.containerId);
    v += typeDef.selfVolume;
  }
  return v;
}

/** 计算最大可携带重量（基础+体质加成+容器减免） */
function calcMaxCarryWeight(state) {
  // 基础承重 = 15 + 体质×0.3
  let base = 15 + (state.player.physique || 20) * 0.3;

  // 容器减负效果
  const containers = state.inventory.containers || [];
  for (const c of containers) {
    const typeDef = getContainerType(c.containerId);
    if (typeDef.weightReduction > 0) {
      // 减负容器：背包容器内的物品重量按减免率计算
      // 简化处理：直接增加有效承重
      base += typeDef.capacity * typeDef.weightReduction * 0.3;
    }
  }

  return base;
}

/** 计算最大可携带体积 */
function calcMaxCarryVolume(state) {
  let base = 12; // 徒手基础体积

  const containers = state.inventory.containers || [];
  for (const c of containers) {
    const typeDef = getContainerType(c.containerId);
    base += typeDef.volumeCapacity;
  }

  return base;
}

/** 获取负重点的AP惩罚 */
function getEncumbranceAPPenalty(state) {
  const enc = calcEncumbrance(state);
  return enc.tier.apPenalty;
}

/** 获取负重点的移动速度惩罚（0-1，0=无惩罚） */
function getEncumbranceMovePenalty(state) {
  const enc = calcEncumbrance(state);
  return enc.tier.movePenalty;
}

/** 检查能否放入更多商品 */
function canCarryMore(state, goodId, qty) {
  const phys = getGoodPhysics(goodId);
  const addedWeight = phys.weight * qty;
  const addedVolume = phys.volume * qty;
  const currentWeight = calcInventoryWeight(state);
  const currentVolume = calcInventoryVolume(state);
  const maxWeight = calcMaxCarryWeight(state);
  const maxVolume = calcMaxCarryVolume(state);

  // 允许超载到1.6倍（极限），但给出警告
  return {
    weightOk: currentWeight + addedWeight <= maxWeight * 1.6,
    volumeOk: currentVolume + addedVolume <= maxVolume * 1.6,
    weightRatio: (currentWeight + addedWeight) / maxWeight,
    volumeRatio: (currentVolume + addedVolume) / maxVolume,
    overLimit:
      currentWeight + addedWeight > maxWeight ||
      currentVolume + addedVolume > maxVolume,
  };
}

// ====== 雇佣运输 ======
const TRANSPORT_SERVICES = [
  {
    id: "porter",
    name: "力工",
    capacity: 30,
    volumeCapacity: 25,
    cost: 50,
    speedMultiplier: 1.0,
    theftRisk: 5, // 偷窃概率%
    damageRisk: 3, // 损坏概率%
    damageRatio: 0.1, // 损坏比例
    desc: "码头力工，便宜但不太靠谱，可能顺手牵羊",
    icon: "👷",
  },
  {
    id: "courier",
    name: "快递员",
    capacity: 60,
    volumeCapacity: 50,
    cost: 120,
    speedMultiplier: 0.8,
    theftRisk: 2,
    damageRisk: 2,
    damageRatio: 0.05,
    desc: "同城快递，靠谱但慢一些，量大划算",
    icon: "📦",
  },
  {
    id: "moving_truck",
    name: "搬家公司",
    capacity: 200,
    volumeCapacity: 160,
    cost: 300,
    speedMultiplier: 0.5,
    theftRisk: 0.5,
    damageRisk: 1,
    damageRatio: 0.03,
    desc: "专业搬家公司，最贵最靠谱，量大首选",
    icon: "🚛",
  },
];

/** 获取运输服务定义 */
function getTransportService(serviceId) {
  return TRANSPORT_SERVICES.find((s) => s.id === serviceId) || null;
}

/** 雇佣运输——将指定商品从当前地点运到目标地点 */
function hireTransport(serviceId, goods, destKey) {
  const state = StateManager.getState();
  const service = getTransportService(serviceId);
  if (!service) {
    StateManager.addMessage("⚠️ 不存在的运输服务。", "danger");
    return false;
  }

  // 检查目标地点是否可达
  const reachable = getReachableLocations(state.trade.currentLocation);
  if (!reachable.includes(destKey)) {
    StateManager.addMessage("⚠️ 该地点无法直接到达。", "danger");
    return false;
  }

  // 计算运费
  let totalQty = 0;
  let totalWeight = 0;
  let totalVolume = 0;
  let totalValue = 0;
  const toShip = []; // { id, qty, good }

  for (const { goodId, qty } of goods) {
    const good = getGoodById(goodId);
    if (!good) continue;
    const inv = state.inventory.items.find((i) => i.id === goodId);
    if (!inv || inv.qty < qty) {
      StateManager.addMessage(`⚠️ 背包中${good.name}不足。`, "danger");
      return false;
    }
    const phys = getGoodPhysics(goodId);
    totalQty += qty;
    totalWeight += phys.weight * qty;
    totalVolume += phys.volume * qty;
    const price = getCurrentPrice(state.trade.currentLocation, goodId);
    totalValue += price * qty;
    toShip.push({ id: goodId, qty, good });
  }

  if (totalQty === 0) {
    StateManager.addMessage("⚠️ 没有需要运输的货物。", "danger");
    return false;
  }

  // 检查运输容量
  if (totalWeight > service.capacity || totalVolume > service.volumeCapacity) {
    StateManager.addMessage(
      `⚠️ ${service.name}装不下这么多货物！重量${Math.round(totalWeight)}/${service.capacity}，体积${Math.round(totalVolume)}/${service.volumeCapacity}`,
      "danger",
    );
    return false;
  }

  // 检查现金
  if (state.resources.cash < service.cost) {
    StateManager.addMessage(`⚠️ 运费¥${service.cost}，现金不足。`, "danger");
    return false;
  }

  // 消耗AP
  if (!consumeAP(AP_COSTS.check_investment)) return false;

  // 扣运费
  state.resources.cash -= service.cost;

  // 从背包中移除货物
  for (const { id, qty } of toShip) {
    const inv = state.inventory.items.find((i) => i.id === id);
    inv.qty -= qty;
    if (inv.qty <= 0) {
      state.inventory.items = state.inventory.items.filter((i) => i.id !== id);
    }
  }

  // 运输随机事件
  let events = [];

  // 1. 偷窃事件
  if (Random.chance(service.theftRisk / 100)) {
    // 随机偷走10-30%的某一种货物
    const targetGood = Random.fromArray(toShip);
    const stolenRatio = Random.float(0.1, 0.3);
    const stolenQty = Math.max(1, Math.floor(targetGood.qty * stolenRatio));
    targetGood.qty -= stolenQty;
    const good = getGoodById(targetGood.id);
    events.push(
      `🦹 ${service.name}偷了${stolenQty}${good.unit}${good.name}！损失约¥${Math.round(getCurrentPrice(state.trade.currentLocation, targetGood.id) * stolenQty)}`,
    );
    state.needs.happiness = Math.max(0, state.needs.happiness - 8);
  }

  // 2. 货物损坏事件
  if (Random.chance(service.damageRisk / 100)) {
    // 随机损坏易碎/温敏货物
    const fragileGoods = toShip.filter((g) => {
      const phys = getGoodPhysics(g.id);
      return phys.fragile || phys.tempSensitive;
    });
    if (fragileGoods.length > 0) {
      const target = Random.fromArray(fragileGoods);
      const damagedQty = Math.max(
        1,
        Math.floor(target.qty * service.damageRatio),
      );
      target.qty -= damagedQty;
      const good = getGoodById(target.id);
      events.push(`💔 运输途中损坏了${damagedQty}${good.unit}${good.name}。`);
    }
  }

  // 3. 交通意外（2%概率，不论什么运输方式）
  if (Random.chance(0.02)) {
    const accidentLoss = Math.floor(totalQty * 0.15);
    if (accidentLoss > 0) {
      // 随机分配损失
      let remaining = accidentLoss;
      for (const g of toShip) {
        if (remaining <= 0) break;
        const loss = Math.min(g.qty, Math.ceil(remaining / toShip.length));
        g.qty -= loss;
        remaining -= loss;
      }
      events.push(`🚨 交通事故！约${accidentLoss}件货物损毁。`);
      state.needs.happiness = Math.max(0, state.needs.happiness - 15);
    }
  }

  // 4. 力工纠纷事件（仅力工，10%概率）
  if (serviceId === "porter" && Random.chance(0.1)) {
    const dispute = Random.chance(0.5);
    if (dispute) {
      // 力工要求加价
      const extraCost = Math.round(service.cost * 0.5);
      if (state.resources.cash >= extraCost) {
        state.resources.cash -= extraCost;
        events.push(`😤 力工临时加价，额外支付¥${extraCost}才肯送货。`);
        state.needs.happiness = Math.max(0, state.needs.happiness - 5);
      } else {
        // 付不起，力工扔货走人
        for (const g of toShip) {
          g.qty = Math.floor(g.qty * 0.5);
        }
        events.push(
          `😤 力工要求加价¥${extraCost}，你付不起，力工扔了一半货走了！`,
        );
        state.needs.happiness = Math.max(0, state.needs.happiness - 20);
      }
    } else {
      events.push(`😊 力工心情不错，帮你多搬了点。`);
    }
  }

  // 5. 下雨天损货（如果当前有下雨天气）
  // 注：天气系统实现后此事件激活
  // if (state.weather && state.weather.rainLevel > 1) { ... }

  // 到达目的地，将货物放入当地仓库（暂存）
  const dest = getLocation(destKey);
  if (!state.inventory.storage) state.inventory.storage = {};
  if (!state.inventory.storage[destKey]) state.inventory.storage[destKey] = [];

  for (const { id, qty, good } of toShip) {
    if (qty <= 0) continue;
    const existing = state.inventory.storage[destKey].find((i) => i.id === id);
    if (existing) {
      existing.qty += qty;
    } else {
      state.inventory.storage[destKey].push({
        id,
        qty,
        avgBuyPrice: getAvgBuyPrice(state, id),
      });
    }
  }

  // 反馈信息
  const destName = dest ? dest.name : destKey;
  StateManager.addMessage(
    `🚚 雇佣${service.name}将货物运往${destName}，运费¥${service.cost}。`,
    "info",
  );

  for (const evt of events) {
    StateManager.addMessage(evt, evt.includes("😊") ? "success" : "warning");
  }

  const arrivedQty = toShip.reduce((s, g) => s + g.qty, 0);
  if (arrivedQty > 0) {
    StateManager.addMessage(
      `📦 ${arrivedQty}件货物已到达${destName}，可从当地仓库取出。`,
      "success",
    );
  }

  return true;
}

/** 从当地仓库取出货物到背包 */
function retrieveFromStorage(goodId, qty) {
  const state = StateManager.getState();
  const locKey = state.trade.currentLocation;
  const storage = state.inventory.storage?.[locKey];
  if (!storage) {
    StateManager.addMessage("⚠️ 当地没有暂存货物。", "warning");
    return false;
  }

  const stored = storage.find((i) => i.id === goodId);
  if (!stored || stored.qty < qty) {
    const good = getGoodById(goodId);
    StateManager.addMessage(
      `⚠️ 仓库中${good ? good.name : goodId}不足。`,
      "danger",
    );
    return false;
  }

  // 检查能否背得动
  const carry = canCarryMore(state, goodId, qty);
  if (carry.overLimit && carry.weightRatio > 1.6) {
    StateManager.addMessage("⚠️ 太重了！背不动这么多。", "danger");
    return false;
  }

  // 移到背包
  const good = getGoodById(goodId);
  const existing = state.inventory.items.find((i) => i.id === goodId);
  if (existing) {
    existing.qty += qty;
  } else {
    state.inventory.items.push({
      id: goodId,
      qty,
      avgBuyPrice: stored.avgBuyPrice || good.basePrice,
    });
  }

  // 从仓库移除
  stored.qty -= qty;
  if (stored.qty <= 0) {
    state.inventory.storage[locKey] = storage.filter((i) => i.id !== goodId);
  }

  StateManager.addMessage(
    `📦 从仓库取出${qty}${good.unit}${good.name}。`,
    "success",
  );
  return true;
}

// ====== 容器装备系统 ======

/** 购买并装备容器 */
function buyContainer(containerId) {
  const state = StateManager.getState();
  const typeDef = getContainerType(containerId);
  if (!typeDef || containerId === "none") {
    StateManager.addMessage("⚠️ 不存在的容器。", "danger");
    return false;
  }

  if (state.resources.cash < typeDef.price) {
    StateManager.addMessage(`⚠️ 需要¥${typeDef.price}，现金不足。`, "danger");
    return false;
  }

  if (!consumeAP(AP_COSTS.buy_backpack)) return false;

  // 检查是否已有同槽位容器
  if (!state.inventory.containers) state.inventory.containers = [];
  const existing = state.inventory.containers.find(
    (c) => c.slot === typeDef.slot,
  );
  if (existing && existing.containerId === containerId) {
    StateManager.addMessage("⚠️ 你已经有一个了。", "warning");
    return false;
  }

  state.resources.cash -= typeDef.price;

  if (existing) {
    // 替换旧容器
    StateManager.addMessage(
      `🎒 换下了${getContainerType(existing.containerId).name}，装备了${typeDef.name}。`,
      "info",
    );
    existing.containerId = containerId;
  } else {
    state.inventory.containers.push({ containerId, slot: typeDef.slot });
    StateManager.addMessage(
      `🎒 购买了${typeDef.name}！容量+${typeDef.capacity}，减负${Math.round(typeDef.weightReduction * 100)}%。`,
      "success",
    );
  }

  return true;
}

// ====== 易腐商品变质系统 ======

/** 每日检查商品变质 */
function tickPerishableGoods(state) {
  if (!state.inventory.items) return;
  let spoiled = [];

  for (const item of state.inventory.items) {
    const phys = getGoodPhysics(item.id);
    if (!phys.perishable) continue;

    // 初始化购入日期
    if (!item.buyDay) item.buyDay = state.player.day;

    const daysHeld = state.player.day - item.buyDay;
    if (phys.shelfLife && daysHeld >= phys.shelfLife) {
      // 商品变质
      const good = getGoodById(item.id);
      spoiled.push(`${good.name}×${item.qty}`);
    }
  }

  // 移除变质商品
  state.inventory.items = state.inventory.items.filter((item) => {
    const phys = getGoodPhysics(item.id);
    if (!phys.perishable) return true;
    if (!item.buyDay) {
      item.buyDay = state.player.day;
      return true;
    }
    const daysHeld = state.player.day - item.buyDay;
    return !phys.shelfLife || daysHeld < phys.shelfLife;
  });

  // 同样检查各地仓库
  if (state.inventory.storage) {
    for (const locKey of Object.keys(state.inventory.storage)) {
      state.inventory.storage[locKey] = state.inventory.storage[locKey].filter(
        (item) => {
          const phys = getGoodPhysics(item.id);
          if (!phys.perishable) return true;
          if (!item.buyDay) {
            item.buyDay = state.player.day;
            return true;
          }
          const daysHeld = state.player.day - item.buyDay;
          return !phys.shelfLife || daysHeld < phys.shelfLife;
        },
      );
    }
  }

  if (spoiled.length > 0) {
    StateManager.addMessage(
      `🗑️ 以下商品已变质被丢弃：${spoiled.join("、")}`,
      "warning",
    );
    state.needs.happiness = Math.max(0, state.needs.happiness - 3);
  }
}

// ====== 修改买卖函数以适配新系统 ======

/** 新版购买商品（考虑重量/体积限制） */
function buyGoodV2(goodId, qty) {
  const state = StateManager.getState();
  const good = getGoodById(goodId);
  if (!good) {
    StateManager.addMessage("⚠️ 不存在的商品。", "danger");
    return false;
  }

  const locKey = state.trade.currentLocation;
  const price = getCurrentPrice(locKey, goodId);
  const totalCost = Math.round(price * qty * 100) / 100;

  // 检查现金
  if (state.resources.cash < totalCost) {
    StateManager.addMessage(
      `⚠️ 钱不够！需要¥${totalCost.toFixed(1)}，你只有¥${state.resources.cash}。`,
      "danger",
    );
    return false;
  }

  // 检查负重/体积
  const carry = canCarryMore(state, goodId, qty);
  if (carry.weightRatio > 1.6 || carry.volumeRatio > 1.6) {
    StateManager.addMessage("⚠️ 太重/太大了！完全背不动。", "danger");
    return false;
  }

  // 扣钱
  state.resources.cash -= totalCost;

  // 买卖消耗AP（每笔交易3AP）
  if (typeof consumeAP === "function") {
    if (!consumeAP(3)) return false;
  }

  // 加入背包
  const existing = state.inventory.items.find((i) => i.id === goodId);
  if (existing) {
    existing.qty += qty;
  } else {
    state.inventory.items.push({
      id: goodId,
      qty,
      avgBuyPrice: price,
      buyDay: state.player.day,
    });
  }

  // 超载警告
  const enc = calcEncumbrance(state);
  let warnMsg = "";
  if (enc.tier.apPenalty > 0) {
    warnMsg = `（负重${enc.tier.name}，行动+${enc.tier.apPenalty}AP）`;
  }

  StateManager.addMessage(
    `🛒 购买了${qty}${good.unit}${good.name}，单价¥${price.toFixed(1)}，共¥${totalCost.toFixed(1)}。${warnMsg}`,
    "success",
  );

  // 记录供需（买入推高当地价格）
  if (typeof recordLocalPurchase === "function")
    recordLocalPurchase(state, locKey, goodId, qty);

  // 买卖影响状态/属性
  if (typeof applyTradeEffects === "function") applyTradeEffects(state, true);

  // 随机邂逅
  if (typeof tryRomanceEncounter === "function") tryRomanceEncounter(state);

  return true;
}

/** 新版卖出商品（记录利润） */
function sellGoodV2(goodId, qty) {
  const state = StateManager.getState();
  const good = getGoodById(goodId);
  if (!good) {
    StateManager.addMessage("⚠️ 不存在的商品。", "danger");
    return false;
  }

  const existing = state.inventory.items.find((i) => i.id === goodId);
  if (!existing || existing.qty < qty) {
    StateManager.addMessage(`⚠️ 背包中没有足够的${good.name}！`, "danger");
    return false;
  }

  const locKey = state.trade.currentLocation;
  const price = getCurrentPrice(locKey, goodId);
  const totalEarned = Math.round(price * qty * 100) / 100;

  state.resources.cash += totalEarned;
  state.resources.totalEarned += totalEarned;

  // 买卖消耗AP（每笔交易3AP，卖出时AP不足也允许，但时间仍推进）
  if (typeof consumeAP === "function") consumeAP(3);

  existing.qty -= qty;
  if (existing.qty <= 0) {
    state.inventory.items = state.inventory.items.filter(
      (i) => i.id !== goodId,
    );
  }

  // 利润计算
  const buyPrice = getAvgBuyPrice(state, goodId);
  let profitMsg = "";
  if (buyPrice > 0) {
    const profit = totalEarned - buyPrice * qty;
    if (profit > 0) {
      profitMsg = ` 📈获利¥${profit.toFixed(1)}！`;
    } else if (profit < 0) {
      profitMsg = ` 📉亏损¥${Math.abs(profit).toFixed(1)}。`;
    }
  }

  StateManager.addMessage(
    `💰 卖出了${qty}${good.unit}${good.name}，单价¥${price.toFixed(1)}，共¥${totalEarned.toFixed(1)}。${profitMsg}`,
    "success",
  );

  // 记录供需（卖出压低当地价格）
  if (typeof recordLocalSale === "function")
    recordLocalSale(state, locKey, goodId, qty);

  // 买卖影响状态/属性
  if (typeof applyTradeEffects === "function") applyTradeEffects(state, false);

  // 随机邂逅
  if (typeof tryRomanceEncounter === "function") tryRomanceEncounter(state);

  return true;
}

/** 新版批发进货 */
function buyWholesaleV2(goodId, qty) {
  const state = StateManager.getState();
  const good = getGoodById(goodId);
  if (!good) {
    StateManager.addMessage("⚠️ 不存在的商品。", "danger");
    return false;
  }

  const locKey = state.trade.currentLocation;
  const price = getCurrentPrice(locKey, goodId);
  const wholesalePrice = Math.round(price * 0.7 * 100) / 100;
  const totalCost = Math.round(wholesalePrice * qty * 100) / 100;

  if (qty < 5) {
    StateManager.addMessage("⚠️ 批发最少购买5件。", "warning");
    return false;
  }

  if (state.resources.cash < totalCost) {
    StateManager.addMessage(
      `⚠️ 钱不够！需要¥${totalCost.toFixed(1)}。`,
      "danger",
    );
    return false;
  }

  // 检查负重
  const carry = canCarryMore(state, goodId, qty);
  if (carry.weightRatio > 1.6 || carry.volumeRatio > 1.6) {
    StateManager.addMessage(
      "⚠️ 批量太大了！完全背不动。考虑雇佣运输？",
      "danger",
    );
    return false;
  }

  state.resources.cash -= totalCost;

  const existing = state.inventory.items.find((i) => i.id === goodId);
  if (existing) {
    const oldTotal = (existing.avgBuyPrice || wholesalePrice) * existing.qty;
    const newTotal = wholesalePrice * qty;
    existing.qty += qty;
    existing.avgBuyPrice =
      Math.round(((oldTotal + newTotal) / existing.qty) * 100) / 100;
  } else {
    state.inventory.items.push({
      id: goodId,
      qty,
      avgBuyPrice: wholesalePrice,
      buyDay: state.player.day,
    });
  }

  const enc = calcEncumbrance(state);
  let warnMsg = "";
  if (enc.tier.apPenalty > 0) {
    warnMsg = `（负重${enc.tier.name}，行动+${enc.tier.apPenalty}AP）`;
  }

  StateManager.addMessage(
    `📦 批发进货${qty}${good.unit}${good.name}，批发价¥${wholesalePrice.toFixed(1)}/件，共¥${totalCost.toFixed(1)}。${warnMsg}`,
    "success",
  );
  return true;
}

// ====== 覆盖旧版买卖函数 ======
// 使 trade.js 中的函数指向新版
// 这在 investment.js 之后加载，会覆盖 showStockTradeModal
// 我们在 main.js 的初始化中重新绑定

/** 将新版函数绑定到旧名（兼容） */
function upgradeTradeFunctions() {
  // 不直接覆盖，通过标志位让 trade.js 的函数走新逻辑
  window._useV2Trade = true;
}
