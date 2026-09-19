/**
 * 出行方式规则（单一事实源）
 *
 * ── 为什么要有这个文件（2026-09-19）────────────────────────────────
 * 在此之前，出行方式与收费**只存在于 `ui/render.js` 的 renderMapTab 内部**：
 *   · `METRO_STATIONS` 是函数内的局部常量（8 个站，且**漏了 bank**）
 *   · AP / 价格 / 可达性在**两处各写一遍**：节点渲染时判一次能不能点，
 *     点击回调里再判一次 —— 两处口径不一，就出现
 *     **「地图显示能去、点下去却弹『不在地铁沿线』」**
 *   · 交通费直写 `state.resources.cash`、不走 `addDailyTransaction`
 *     → 钱扣了但日报「今日收支明细」看不到，账实不符
 *   · 3D 模式的 M 键地图走逻辑层 `travel_<key>` 行动，那条**根本不收费**
 *     → 同一个「去某地」动作，2D 收费 / 3D 免费，玩家换个界面价格就变了
 *
 * 本文件把这些规则收拢成**唯一实现**，UI 只负责展示与调用：
 *   2D 地图、3D 地图、以及将来的测试都读同一份 `resolveTransit()`。
 *
 * ── 设计原则 ─────────────────────────────────────────────────────
 * 1. **纯函数**：`resolveTransit()` 不改任何状态，只**回答**"这个出行方式
 *    能否到达 / 要多少 AP / 要多少钱"。扣钱扣 AP 仍由调用方负责，
 *    这样它可以在渲染期被安全地预判调用（不产生副作用）。
 * 2. **失败必须给理由**：返回 `reason`，UI 直接拿去显示，
 *    不再让玩家面对"点了没反应"。
 * 3. **数据驱动**：地铁沿线是数据表，不是散落在 if-else 里的魔法判断。
 */

/**
 * 地铁沿线站点。
 *
 * 判据 = 该地点是否属于「城区主干线」：市中心商业区、政务/金融（含 bank）、
 * 大型公共服务（医院/大学城/培训中心/娱乐城）、以及两大人口集散地
 * （城中村/批发市场）。**郊区与工业区（suburb / factoryZone / logistics_park /
 * auto_city）刻意不在线上** —— 那是"要转公交或骑车才能到"的地方，
 * 保留地铁的覆盖边界，出行方式才有取舍意义。
 *
 * ★ 2026-09-19 修正：原表 8 站漏了 `bank`。
 *   银行是金融区核心（`CITY_MAP_POS.bank` 就在市中心偏上），
 *   与 gov_office / commercialDist 同级，漏掉是明显的疏漏 ——
 *   玩家反馈的「坐地铁到不了银行」即此。
 *   一并补上 `court`（法院，与政务区同区）、`job_market`（人才市场，政务区附近）、
 *   `gym`（体育馆，紧邻商业区）、`library`（图书馆，大学城旁）。
 *   新增依据均取自 `CITY_MAP_POS` 的地理注释，不是随意加。
 */
const METRO_STATIONS = [
  // —— 城市核心 ——
  "commercialDist", // 市中心
  "bank", // 金融区（★ 2026-09-19 补，原表漏）
  "gov_office", // 政务区
  "court", // 法院（政务区同区）
  "job_market", // 人才市场（政务区附近）
  "techPark", // 科技园
  "luxury_community", // 高档小区（银行与科技园之间）
  // —— 大型公共服务 ——
  "hospital", // 医院
  "school", // 大学城
  "library", // 图书馆（大学城旁）
  "trainingCenter", // 培训中心
  "entertainment", // 娱乐城
  "gym", // 体育馆（紧邻商业区）
  // —— 人口集散 ——
  "slum", // 城中村
  "wholesaleMarket", // 批发市场
  "vegetable_market", // 菜市场（批发市场旁）
];

/**
 * 各出行方式的静态参数。
 * `ap`/`price` 为基准值；步行与打车的实际值随距离变化，故标 null 由 resolveTransit 计算。
 */
const TRANSIT_MODES = {
  walk: {
    mode: "walk",
    label: "🚶 步行",
    icon: "🚶",
    desc: "免费",
    hint: "💡 步行到达，按距离消耗6~26AP，免费",
    apBase: null, // 随跳数变化
    apMin: 6,
    apPerHop: 4,
    price: 0,
    priceText: "免费",
    requiresCar: false,
    metroOnly: false,
    maxHops: null,
  },
  bike: {
    mode: "bike",
    label: "🚲 单车",
    icon: "🚲",
    desc: "¥3",
    hint: "💡 共享单车，2跳内可达，消耗6AP，费用¥3",
    apBase: 6,
    price: 3,
    priceText: "¥3",
    requiresCar: false,
    metroOnly: false,
    // ★ 原代码的提示语写"2跳内可达"，但实现里**没有任何跳数限制**（文案与实现不符）。
    //   这里把提示语的承诺落实为真实约束：超过 2 跳骑车到不了。
    maxHops: 2,
  },
  metro: {
    mode: "metro",
    label: "🚇 地铁",
    icon: "🚇",
    desc: "¥4",
    hint: "💡 地铁，仅限沿线站点，消耗5AP，费用¥4",
    apBase: 5,
    price: 4,
    priceText: "¥4",
    requiresCar: false,
    metroOnly: true,
    maxHops: null,
  },
  taxi: {
    mode: "taxi",
    label: "🚕 打车",
    icon: "🚕",
    desc: "¥10-40",
    hint: "💡 打车直达，消耗3AP，按距离计费¥10-40",
    apBase: 3,
    priceBase: 10,
    priceRandomMax: 30,
    priceText: "¥10-40",
    requiresCar: false,
    metroOnly: false,
    maxHops: null,
  },
  car: {
    mode: "car",
    label: "🚗 自驾",
    icon: "🚗",
    desc: "¥5",
    hint: "💡 自驾直达，消耗2AP，油费¥5",
    apBase: 2,
    price: 5,
    priceText: "¥5",
    requiresCar: true,
    metroOnly: false,
    maxHops: null,
  },
};

/** 出行方式的展示顺序 */
const TRANSIT_MODE_ORDER = ["walk", "bike", "metro", "taxi", "car"];

/**
 * 玩家是否拥有可自驾的车辆。
 * @param {object} state
 */
function hasOwnCar(state) {
  return !!(
    state &&
    state.investment &&
    state.investment.cars &&
    state.investment.cars.length > 0
  );
}

/**
 * 解析一次出行的结果 —— **纯函数，无副作用**。
 *
 * 可在渲染期安全调用（例如"这个节点在该出行方式下能不能点"），
 * 也可在点击时调用；两处用**同一个函数**，从根上杜绝
 * 「显示能去、点下去却失败」的口径分叉。
 *
 * @param {string} mode    出行方式 id（walk/bike/metro/taxi/car）
 * @param {string} fromKey 出发地点 id
 * @param {string} toKey   目的地点 id
 * @param {object} state   游戏状态（用于取跳数、车辆、技能等）
 * @returns {{ok:boolean, mode:string, modeName:string, icon:string,
 *            ap:number, price:number, reason:string|null}}
 */
function resolveTransit(mode, fromKey, toKey, state) {
  const def = TRANSIT_MODES[mode] || TRANSIT_MODES.walk;
  const fail = (reason) => ({
    ok: false,
    mode: def.mode,
    modeName: def.label,
    icon: def.icon,
    ap: 0,
    price: 0,
    reason: reason,
  });

  if (!toKey) return fail("没有这个地点");
  if (toKey === fromKey) return fail("你已经在这里了");

  // 跳数：优先用逻辑层的权威实现，缺失则退化为 1 跳
  // ⚠️ `getLocationHops` 在不可达时返回 **99**（不是抛错、也不是 0），
  //    所以下面凡是用跳数的地方都要处理这个哨兵值，否则文案会变成
  //    "骑车太远了（99个地段）"这种怪话。
  const hops =
    typeof getLocationHops === "function" ? getLocationHops(fromKey, toKey) : 1;
  const UNREACHABLE = 99;

  // ── 车辆门槛 ──
  if (def.requiresCar && !hasOwnCar(state)) {
    return fail("你还没有车，无法自驾出行。可以去汽车城看看。");
  }

  // ── 地铁：仅沿线站点 ──
  if (def.metroOnly && METRO_STATIONS.indexOf(toKey) < 0) {
    return fail("不在地铁沿线，请选择其他出行方式。");
  }

  // ── 单车：跳数上限 ──
  if (def.maxHops !== null && (hops > def.maxHops || hops >= UNREACHABLE)) {
    const why =
      hops >= UNREACHABLE
        ? "这个地方去不了"
        : "骑车太远了（" + hops + "个地段），超过 " + def.maxHops + " 个地段请换地铁或打车。";
    return fail(why);
  }

  // ── AP 计算 ──
  let ap;
  if (def.apBase !== null && def.apBase !== undefined) {
    ap = def.apBase;
  } else {
    // 步行：随跳数线性增长，但有下限
    ap = Math.max(def.apMin || 6, (def.apMin || 6) + hops * (def.apPerHop || 4));
  }

  // ── 价格计算 ──
  let price = 0;
  if (def.price !== undefined) {
    price = def.price;
  } else if (def.priceBase !== undefined) {
    // 打车：基准价 + 随机里程费
    const rnd =
      typeof Random !== "undefined" && Random.int
        ? Random.int(0, def.priceRandomMax || 30)
        : Math.floor((def.priceRandomMax || 30) / 2);
    price = def.priceBase + rnd;
  }

  return {
    ok: true,
    mode: def.mode,
    modeName: def.label,
    icon: def.icon,
    ap: ap,
    price: price,
    reason: null,
  };
}

/**
 * 结算交通费 —— **唯一允许扣交通费的入口**。
 *
 * 同时做三件事：扣现金、写账本、返回可展示的文案。
 * 之所以要收口，是因为此前 UI 直接 `cash -= price`：
 * 钱扣了，但 `addDailyTransaction` 没被调用 → 日报「今日收支明细」
 * 与「净收入」都看不到这笔钱，**账实不符**。
 *
 * @returns {{paid:number, ok:boolean, reason:string|null}}
 */
function payTransitFee(state, price, modeName, toName) {
  if (!state || !state.resources) return { paid: 0, ok: false, reason: "状态不可用" };
  const p = Math.max(0, Math.round(price || 0));
  if (p === 0) return { paid: 0, ok: true, reason: null };

  const cash = state.resources.cash || 0;
  if (cash < p) {
    return {
      paid: 0,
      ok: false,
      reason: (modeName || "出行") + "需要¥" + p + "，你现金不够。",
    };
  }

  state.resources.cash = cash - p;
  if (typeof addDailyTransaction === "function") {
    addDailyTransaction(
      state,
      "expense",
      "transit",
      p,
      (modeName || "出行") + "前往" + (toName || "目的地"),
    );
  }
  return { paid: p, ok: true, reason: null };
}

// 导出到全局（与 locations.js 同一套 window 约定）
if (typeof window !== "undefined") {
  window.METRO_STATIONS = METRO_STATIONS;
  window.TRANSIT_MODES = TRANSIT_MODES;
  window.TRANSIT_MODE_ORDER = TRANSIT_MODE_ORDER;
  window.resolveTransit = resolveTransit;
  window.payTransitFee = payTransitFee;
  window.hasOwnCar = hasOwnCar;
}
