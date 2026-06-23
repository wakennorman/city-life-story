/**
 * 搬运与物理系统 — 重量/体积/容器/负重/运输服务
 *
 * 为物品增加物理属性（重量/体积/易碎），容器系统（多槽位），
 * 负重等级（影响 AP），雇佣运输（跨地点货物转移）。
 */

// ====== 商品物理属性扩展 ======
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

/** 获取商品物理属性（默认值兜底） */
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
    desc: "什么都不带",
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
    desc: "超市塑料袋",
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
    desc: "结实耐用",
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
    desc: "轻便实用",
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
    desc: "专业登山包",
  },
  {
    id: "duffel",
    name: "旅行包",
    slot: "手持",
    capacity: 35,
    volumeCapacity: 30,
    weightReduction: 0,
    selfWeight: 1.0,
    selfVolume: 0.6,
    price: 60,
    desc: "大容量但没减负",
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
    desc: "贴身腰包",
  },
  {
    id: "tool_box",
    name: "工具箱",
    slot: "手持",
    capacity: 12,
    volumeCapacity: 8,
    weightReduction: 0,
    selfWeight: 1.5,
    selfVolume: 0.5,
    price: 40,
    desc: "铁皮工具箱",
  },
  {
    id: "cart",
    name: "小推车",
    slot: "手持",
    capacity: 60,
    volumeCapacity: 50,
    weightReduction: 0,
    selfWeight: 5.0,
    selfVolume: 2.0,
    price: 120,
    desc: "手推板车",
  },
];

function getContainerType(containerId) {
  return (
    CONTAINER_TYPES.find(function (c) {
      return c.id === containerId;
    }) || CONTAINER_TYPES[0]
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
    desc: "寸步难行",
  },
];

/** 计算当前负重状态 */
function calcEncumbrance(state) {
  var totalWeight = calcInventoryWeight(state);
  var maxCarry = calcMaxCarryWeight(state);
  var ratio = maxCarry > 0 ? totalWeight / maxCarry : 0;
  var tier = ENCUMBRANCE_TIERS[0];
  for (var i = 0; i < ENCUMBRANCE_TIERS.length; i++) {
    if (ratio <= ENCUMBRANCE_TIERS[i].maxRatio) {
      tier = ENCUMBRANCE_TIERS[i];
      break;
    }
    tier = ENCUMBRANCE_TIERS[i];
  }
  return {
    totalWeight: Math.round(totalWeight * 10) / 10,
    maxCarry: Math.round(maxCarry * 10) / 10,
    ratio: Math.round(ratio * 100) / 100,
    tier: tier,
    totalVolume: Math.round(calcInventoryVolume(state) * 10) / 10,
    maxVolume: Math.round(calcMaxCarryVolume(state) * 10) / 10,
  };
}

function calcInventoryWeight(state) {
  var w = 0;
  var items = state.inventory.items || [];
  for (var i = 0; i < items.length; i++) {
    var phys = getGoodPhysics(items[i].id);
    w += phys.weight * items[i].qty;
  }
  return w;
}

function calcInventoryVolume(state) {
  var v = 0;
  var items = state.inventory.items || [];
  for (var i = 0; i < items.length; i++) {
    var phys = getGoodPhysics(items[i].id);
    v += phys.volume * items[i].qty;
  }
  return v;
}

function calcMaxCarryWeight(state) {
  var base = 15 + (state.player.physique || 20) * 0.3;
  // 容器减负 (state.inventory.containers)
  var containers = state.inventory.containers || [];
  for (var i = 0; i < containers.length; i++) {
    var typeDef = getContainerType(containers[i].containerId);
    if (typeDef.weightReduction > 0) {
      base += typeDef.capacity * typeDef.weightReduction * 0.3;
    }
  }
  return base;
}

function calcMaxCarryVolume(state) {
  var base = 12;
  var containers = state.inventory.containers || [];
  for (var i = 0; i < containers.length; i++) {
    var typeDef = getContainerType(containers[i].containerId);
    base += typeDef.volumeCapacity;
  }
  return base;
}

function getEncumbranceAPPenalty(state) {
  return calcEncumbrance(state).tier.apPenalty;
}

function getEncumbranceMovePenalty(state) {
  return calcEncumbrance(state).tier.movePenalty;
}

/** 检查能否装入更多商品 */
function canCarryMore(state, goodId, qty) {
  var phys = getGoodPhysics(goodId);
  var addedWeight = phys.weight * qty;
  var addedVolume = phys.volume * qty;
  var currentWeight = calcInventoryWeight(state);
  var currentVolume = calcInventoryVolume(state);
  var maxWeight = calcMaxCarryWeight(state);
  var maxVolume = calcMaxCarryVolume(state);
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
    theftRisk: 5,
    damageRisk: 3,
    damageRatio: 0.1,
    icon: "👷",
    desc: "码头力工，便宜但不太靠谱",
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
    icon: "📦",
    desc: "同城快递，量大划算",
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
    icon: "🚛",
    desc: "专业搬家公司，最贵最靠谱",
  },
];

function getTransportService(serviceId) {
  return (
    TRANSPORT_SERVICES.find(function (s) {
      return s.id === serviceId;
    }) || null
  );
}

/** 雇佣运输：将商品从当前地点运到目标地点 */
function hireTransport(serviceId, goods, destKey) {
  var state = StateManager.getState();
  var service = getTransportService(serviceId);
  if (!service) {
    StateManager.addMessage("⚠️ 不存在的运输服务。", "danger");
    return false;
  }

  var reachable = getReachableLocations(state.trade.currentLocation);
  if (!reachable.includes(destKey)) {
    StateManager.addMessage("⚠️ 该地点无法直接到达。", "danger");
    return false;
  }

  var totalQty = 0,
    totalWeight = 0,
    totalVolume = 0,
    totalValue = 0;
  var toShip = [];
  for (var gi = 0; gi < goods.length; gi++) {
    var g = goods[gi];
    var good = getGoodById(g.goodId);
    if (!good) continue;
    var inv = state.inventory.items.find(function (i) {
      return i.id === g.goodId;
    });
    if (!inv || inv.qty < g.qty) {
      StateManager.addMessage("⚠️ 背包中" + good.name + "不足。", "danger");
      return false;
    }
    var phys = getGoodPhysics(g.goodId);
    totalQty += g.qty;
    totalWeight += phys.weight * g.qty;
    totalVolume += phys.volume * g.qty;
    var price = getCurrentPrice(state.trade.currentLocation, g.goodId);
    totalValue += price * g.qty;
    toShip.push({ id: g.goodId, qty: g.qty, good: good });
  }
  if (totalQty === 0) {
    StateManager.addMessage("⚠️ 没有需要运输的货物。", "danger");
    return false;
  }
  if (totalWeight > service.capacity || totalVolume > service.volumeCapacity) {
    StateManager.addMessage(
      "⚠️ " + service.name + "装不下这么多货物！",
      "danger",
    );
    return false;
  }
  if (state.resources.cash < service.cost) {
    StateManager.addMessage(
      "⚠️ 运费¥" + service.cost + "，现金不足。",
      "danger",
    );
    return false;
  }

  // 扣费
  state.resources.cash -= service.cost;
  // 消耗 AP (硬编码 10)
  if (typeof consumeAP === "function") {
    if (!consumeAP(10)) return false;
  }

  // 从背包移除
  for (var si = 0; si < toShip.length; si++) {
    var ship = toShip[si];
    var invItem = state.inventory.items.find(function (i) {
      return i.id === ship.id;
    });
    if (invItem) {
      invItem.qty -= ship.qty;
      if (invItem.qty <= 0) {
        state.inventory.items = state.inventory.items.filter(function (i) {
          return i.id !== ship.id;
        });
      }
    }
  }

  // 运输随机事件
  var events = [];
  // 1. 偷窃
  if (Random.chance(service.theftRisk / 100)) {
    var target = Random.fromArray(toShip);
    var stolenQty = Math.max(
      1,
      Math.floor(target.qty * Random.float(0.1, 0.3)),
    );
    target.qty -= stolenQty;
    events.push(
      "🦹 " +
        service.name +
        "偷了" +
        stolenQty +
        target.good.unit +
        target.good.name +
        "！",
    );
    state.needs.happiness = Math.max(0, state.needs.happiness - 8);
  }
  // 2. 货物损坏
  if (Random.chance(service.damageRisk / 100)) {
    var fragileGoods = toShip.filter(function (g) {
      var p = getGoodPhysics(g.id);
      return p.fragile || p.tempSensitive;
    });
    if (fragileGoods.length > 0) {
      var dmg = Random.fromArray(fragileGoods);
      var dmgQty = Math.max(1, Math.floor(dmg.qty * service.damageRatio));
      dmg.qty -= dmgQty;
      events.push(
        "💔 运输途中损坏了" + dmgQty + dmg.good.unit + dmg.good.name + "。",
      );
    }
  }
  // 3. 交通意外 (2%)
  if (Random.chance(0.02)) {
    var loss = Math.floor(totalQty * 0.15);
    if (loss > 0) {
      events.push("🚨 交通事故！约" + loss + "件货物损毁。");
      state.needs.happiness = Math.max(0, state.needs.happiness - 15);
    }
  }

  // 到达目的地，放入当地仓库
  if (!state.inventory.storage) state.inventory.storage = {};
  if (!state.inventory.storage[destKey]) state.inventory.storage[destKey] = [];
  for (var di = 0; di < toShip.length; di++) {
    if (toShip[di].qty <= 0) continue;
    var existing = state.inventory.storage[destKey].find(function (i) {
      return i.id === toShip[di].id;
    });
    if (existing) {
      existing.qty += toShip[di].qty;
    } else {
      state.inventory.storage[destKey].push({
        id: toShip[di].id,
        qty: toShip[di].qty,
      });
    }
  }

  var destLoc = getLocation(destKey);
  var destName = destLoc ? destLoc.name : destKey;
  StateManager.addMessage(
    "🚚 雇佣" +
      service.name +
      "将货物运往" +
      destName +
      "，运费¥" +
      service.cost +
      "。",
    "info",
  );
  for (var ei = 0; ei < events.length; ei++) {
    StateManager.addMessage(
      events[ei],
      events[ei].includes("😊") ? "success" : "warning",
    );
  }
  StateManager.addMessage(
    "📦 货物已到达" + destName + "，可从当地仓库取出。",
    "success",
  );
  return true;
}

/** 从当地仓库取出货物到背包 */
function retrieveFromStorage(goodId, qty) {
  var state = StateManager.getState();
  var locKey = state.trade.currentLocation;
  var storage = state.inventory.storage
    ? state.inventory.storage[locKey]
    : null;
  if (!storage) {
    StateManager.addMessage("⚠️ 当地没有暂存货物。", "warning");
    return false;
  }
  var stored = storage.find(function (i) {
    return i.id === goodId;
  });
  if (!stored || stored.qty < qty) {
    StateManager.addMessage("⚠️ 仓库中该商品不足。", "danger");
    return false;
  }
  var carry = canCarryMore(state, goodId, qty);
  if (carry.overLimit && carry.weightRatio > 1.6) {
    StateManager.addMessage("⚠️ 超重！请减少携带或加强体质。", "danger");
    return false;
  }
  var good = getGoodById(goodId);
  var existing = state.inventory.items.find(function (i) {
    return i.id === goodId;
  });
  if (existing) {
    existing.qty += qty;
  } else {
    state.inventory.items.push({
      id: goodId,
      qty: qty,
      avgBuyPrice: stored.avgBuyPrice || (good ? good.basePrice : 0),
    });
  }
  stored.qty -= qty;
  if (stored.qty <= 0) {
    state.inventory.storage[locKey] = storage.filter(function (i) {
      return i.id !== goodId;
    });
  }
  StateManager.addMessage(
    "📦 从仓库取出" +
      qty +
      (good ? good.unit : "件") +
      (good ? good.name : goodId) +
      "。",
    "success",
  );
  return true;
}

// ====== 易腐商品变质系统 ======
function tickPerishableGoods(state) {
  if (!state.inventory.items) return;
  var spoiled = [];
  for (var i = 0; i < state.inventory.items.length; i++) {
    var item = state.inventory.items[i];
    var phys = getGoodPhysics(item.id);
    if (!phys.perishable) continue;
    if (!item.buyDay) item.buyDay = state.player.day;
    var daysHeld = state.player.day - item.buyDay;
    if (phys.shelfLife && daysHeld >= phys.shelfLife) {
      var good = getGoodById(item.id);
      spoiled.push((good ? good.name : item.id) + "×" + item.qty);
    }
  }
  state.inventory.items = state.inventory.items.filter(function (item) {
    var phys = getGoodPhysics(item.id);
    if (!phys.perishable) return true;
    if (!item.buyDay) {
      item.buyDay = state.player.day;
      return true;
    }
    var daysHeld = state.player.day - item.buyDay;
    return !phys.shelfLife || daysHeld < phys.shelfLife;
  });
  // 也检查仓库
  if (state.inventory.storage) {
    for (var locKey in state.inventory.storage) {
      if (state.inventory.storage.hasOwnProperty(locKey)) {
        state.inventory.storage[locKey] = state.inventory.storage[
          locKey
        ].filter(function (item) {
          var phys = getGoodPhysics(item.id);
          if (!phys.perishable) return true;
          if (!item.buyDay) {
            item.buyDay = state.player.day;
            return true;
          }
          var daysHeld = state.player.day - item.buyDay;
          return !phys.shelfLife || daysHeld < phys.shelfLife;
        });
      }
    }
  }
  if (spoiled.length > 0) {
    StateManager.addMessage(
      "🗑️ 以下商品已变质被丢弃：" + spoiled.join("、"),
      "warning",
    );
    state.needs.happiness = Math.max(0, state.needs.happiness - 3);
  }
}

// 全局导出
if (typeof window !== "undefined") {
  Object.assign(window, {
    GOOD_PHYSICS: GOOD_PHYSICS,
    CONTAINER_TYPES: CONTAINER_TYPES,
    ENCUMBRANCE_TIERS: ENCUMBRANCE_TIERS,
    TRANSPORT_SERVICES: TRANSPORT_SERVICES,
    getGoodPhysics: getGoodPhysics,
    getContainerType: getContainerType,
    calcEncumbrance: calcEncumbrance,
    canCarryMore: canCarryMore,
    getEncumbranceAPPenalty: getEncumbranceAPPenalty,
    getEncumbranceMovePenalty: getEncumbranceMovePenalty,
    calcInventoryWeight: calcInventoryWeight,
    calcInventoryVolume: calcInventoryVolume,
    calcMaxCarryWeight: calcMaxCarryWeight,
    calcMaxCarryVolume: calcMaxCarryVolume,
    hireTransport: hireTransport,
    retrieveFromStorage: retrieveFromStorage,
    getTransportService: getTransportService,
    tickPerishableGoods: tickPerishableGoods,
  });
}
