/**
 * 房产市场周期引擎 — 让房价真正波动起来
 *
 * 设计原则：
 * - 房价不再固定增值，而是随市场周期、行业热度、政策、新闻波动
 * - 参考中国房地产市场真实周期的四个阶段拐点
 * - 海外房产受国内市场影响小（低 zoneWeight.sectorHeat）
 * - 与新闻系统、世界参数反馈环、投资系统形成完整联动
 *
 * █ 市场阶段 ███████████████████████████████████
 *   boom   火爆  → 活跃上涨，政策风险积累
 *   stable 平稳  → 正常波动，基线状态
 *   cooling 降温 → 价格回落，成交量萎缩
 *   bust   萧条  → 加速下跌，恐慌情绪
 * █████████████████████████████████████████████
 */

// ====== 阶段定义 ======
const PROPERTY_PHASES = {
  boom: {
    label: "🔥 楼市火爆",
    icon: "📈",
    driftMin: 0.0008,
    driftMax: 0.0025,
    minDuration: 15,
    maxDuration: 45,
    color: "var(--danger)",
  },
  stable: {
    label: "➡️ 市场平稳",
    icon: "➡️",
    driftMin: -0.0005,
    driftMax: 0.0008,
    minDuration: 20,
    maxDuration: 60,
    color: "var(--text-muted)",
  },
  cooling: {
    label: "❄️ 市场降温",
    icon: "📉",
    driftMin: -0.0015,
    driftMax: -0.0003,
    minDuration: 15,
    maxDuration: 40,
    color: "var(--info)",
  },
  bust: {
    label: "💥 楼市萧条",
    icon: "💥",
    driftMin: -0.003,
    driftMax: -0.0008,
    minDuration: 10,
    maxDuration: 30,
    color: "var(--success)",
  },
};

// ====== 阶段转换消息 ======
const PHASE_TRANSITION_MSGS = {
  boom: "🔥 楼市火爆！房价持续上涨，但政策风险在积累…",
  stable: "➡️ 楼市进入平稳期，价格波动收窄。",
  cooling: "❄️ 楼市开始降温，注意控制房产仓位。",
  bust: "💥 楼市萧条！房价持续下跌，抄底还是逃离？",
};

// ====== 初始化 ======

/**
 * 初始化房产市场系统
 * 新游戏 / 存档迁移时调用
 */
function initPropertyMarket(state) {
  var inv = state.investment;
  if (!inv) return;

  // 已初始化则跳过
  if (inv._propertySystemV2) return;

  // 设置初始市场阶段
  inv.propertyMarketPhase = "stable";
  inv.propertyPhaseStartDay = state.player.day;
  inv.propertyPhaseDuration = getRandomPhaseDuration("stable");
  inv._propertyPolicyTightness = 0;
  inv._propertySystemV2 = true;

  // 迁移已持有房产：补充新字段
  var props = inv.properties || [];
  for (var i = 0; i < props.length; i++) {
    var p = props[i];
    var def = getPropertyDef(p.id);
    if (def) {
      p.zone = def.zone;
      p.zoneWeight = JSON.parse(JSON.stringify(def.zoneWeight));
      p.volatility = def.volatility;
      p.baseAppreciation = def.baseAppreciation;
    } else {
      // 兜底（理论上不会发生）
      p.zone = "general";
      p.zoneWeight = { sectorHeat: 0.8, policy: 0.8, cycle: 0.8 };
      p.volatility = 0.004;
      p.baseAppreciation = 0.0;
    }
  }

  StateManager.addMessage(
    "📊 房产市场系统已升级：价格将随市场波动，不再固定增值。",
    "hint",
  );
}

/** 从 PROPERTIES 常量查找房产定义（兼容未加载时的回退） */
function getPropertyDef(propId) {
  if (typeof PROPERTIES === "undefined") return null;
  for (var i = 0; i < PROPERTIES.length; i++) {
    if (PROPERTIES[i].id === propId) return PROPERTIES[i];
  }
  return null;
}

// ====== 每日更新 ======

/**
 * 每日房产市场更新（由 tickInvestmentDaily 调用，替换原有内联逻辑）
 */
function tickPropertyMarket(state) {
  var inv = state.investment;
  if (!inv) return;

  // 1. 检查是否需要阶段转换
  checkPhaseTransition(state);

  // 2. 政策趋紧度自然衰减（每天 2% 向 0 回归）
  if (inv._propertyPolicyTightness) {
    inv._propertyPolicyTightness *= 0.98;
    if (Math.abs(inv._propertyPolicyTightness) < 0.01) {
      inv._propertyPolicyTightness = 0;
    }
  }

  // 3. 从活跃新闻提取政策趋紧度影响（仅一次，不在属性循环内重复调用）
  if (typeof applyNewsToPropertyPolicy === "function") {
    applyNewsToPropertyPolicy(state);
  }

  // 4. 为每套已持有房产计算当天的价格变化
  var props = inv.properties || [];
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    var def = getPropertyDef(prop.id);

    var changeMult = calculatePropertyDailyChange(prop, def, state);

    // [全系统自洽修复] 域E A类#2: currentPrice 可能为0（被保底逻辑重置），用 != null 避免0被误判为缺失
    var currentPrice = (prop.currentPrice != null && !isNaN(prop.currentPrice)) ? prop.currentPrice : prop.buyPrice;
    prop.currentPrice = Math.round(
      (currentPrice || prop.buyPrice) * changeMult,
    );
    if (!isFinite(prop.currentPrice)) prop.currentPrice = prop.buyPrice || 0;
    // 保底价（不低于买入价的 10%，防止归零）
    var floor = Math.round((prop.buyPrice || 0) * 0.1);
    if (prop.currentPrice < floor) prop.currentPrice = floor;

    // 月租结算（维持原逻辑，增加收支记录）
    var isSelfLived = inv.selfLivePropertyId === prop.id;
    if (state.player.day % 30 === 0 && !isSelfLived) {
      var rentAmount = prop.rent || 0;
      state.resources.cash = (state.resources.cash || 0) + rentAmount; // [全系统自洽修复] 域E A类: cash NaN守卫
      if (typeof addDailyTransaction === "function") {
        addDailyTransaction(
          state,
          "income",
          "property_rent",
          rentAmount,
          prop.name + " 月租金",
        );
      }
    }
  }
}

// ====== 阶段转换逻辑 ======

/**
 * 检查并执行市场阶段转换
 */
function checkPhaseTransition(state) {
  var inv = state.investment;
  var phase = inv.propertyMarketPhase || "stable";
  var daysInPhase = state.player.day - (inv.propertyPhaseStartDay || 0);
  var duration = inv.propertyPhaseDuration || 30;

  var shouldTransition = false;

  // 条件A：阶段持续期满
  if (daysInPhase >= duration) {
    shouldTransition = true;
  }

  // 条件B：sectorHeat 阈值触发（每日检查）
  var heat = 1.0;
  if (typeof getSectorHeat === "function") {
    heat = getSectorHeat("房地产");
  }

  if (phase !== "boom" && heat >= 1.15 && daysInPhase >= 10) {
    // 行业热度高→转向火爆
    transitionPropertyPhase(state, "boom");
    return;
  }
  if (phase !== "bust" && heat <= 0.8 && daysInPhase >= 10) {
    // 行业热度极低→转向萧条
    transitionPropertyPhase(state, "bust");
    return;
  }
  if (phase === "stable" && heat <= 0.9 && daysInPhase >= 10) {
    // 热度小幅低于正常→降温
    transitionPropertyPhase(state, "cooling");
    return;
  }

  // 条件C：活跃新闻中的强房地产新闻
  var newsDriven = checkNewsDrivenTransition(state, phase);
  if (newsDriven) return;

  // 条件D：随机提前结束（每日 10% 概率，需至少持续 10 天）
  if (!shouldTransition && daysInPhase >= 10 && Random.chance(0.1)) {
    shouldTransition = true;
  }

  if (shouldTransition) {
    transitionPropertyPhase(state);
  }
}

/**
 * 检查活跃新闻是否强制驱动阶段转换
 */
function checkNewsDrivenTransition(state, currentPhase) {
  var activeNews = state.activeNews || [];
  for (var i = 0; i < activeNews.length; i++) {
    var n = activeNews[i];
    // 强利空新闻：强制转向降温（除非已在萧条）
    if (
      (n.id === "property_cooling" ||
        n.id === "developer_default" ||
        n.id === "property_tax_pilot") &&
      currentPhase !== "bust" &&
      currentPhase !== "cooling"
    ) {
      transitionPropertyPhase(state, "cooling");
      return true;
    }
    // 强刺激新闻：强制转向火爆（除非已在火爆）
    if (n.id === "property_stimulus" && currentPhase !== "boom") {
      transitionPropertyPhase(state, "boom");
      return true;
    }
  }
  return false;
}

/**
 * 执行阶段转换
 * @param {object} state - 游戏状态
 * @param {string} forcedPhase - 强制指定目标阶段（可选）
 */
function transitionPropertyPhase(state, forcedPhase) {
  var inv = state.investment;
  var currentPhase = inv.propertyMarketPhase || "stable";

  var newPhase;
  if (forcedPhase) {
    newPhase = forcedPhase;
  } else {
    newPhase = pickNextPhase(state, currentPhase);
  }

  if (!newPhase || newPhase === currentPhase) return;

  // 执行转换
  inv.propertyMarketPhase = newPhase;
  inv.propertyPhaseStartDay = state.player.day;
  inv.propertyPhaseDuration = getRandomPhaseDuration(newPhase);

  // 发送转换消息
  var msg =
    PHASE_TRANSITION_MSGS[newPhase] || "🏠 房产市场进入" + newPhase + "阶段。";
  var msgType = "info";
  if (newPhase === "boom") msgType = "warning";
  if (newPhase === "bust") msgType = "danger";
  StateManager.addMessage(msg, msgType);
}

/**
 * 基于权重随机选择下一个阶段
 * 不允许从 boom→bust 或 bust→boom 的跳跃
 */
function pickNextPhase(state, currentPhase) {
  var phases = ["boom", "stable", "cooling", "bust"];
  var weights = { boom: 0, stable: 0, cooling: 0, bust: 0 };

  var heat = 1.0;
  if (typeof getSectorHeat === "function") {
    heat = getSectorHeat("房地产");
  }
  var tightness = state.investment._propertyPolicyTightness || 0;

  // 为每个潜在目标赋权重
  for (var i = 0; i < phases.length; i++) {
    var target = phases[i];

    // 不能转到自己
    if (target === currentPhase) {
      weights[target] = 0;
      continue;
    }

    // 禁止跳级：boom↔bust 不能直接转换
    if (
      (currentPhase === "boom" && target === "bust") ||
      (currentPhase === "bust" && target === "boom")
    ) {
      weights[target] = 0;
      continue;
    }

    // 基础权重
    weights[target] = 20;

    // sectorHeat 调节
    if (target === "boom") {
      if (heat > 1.1) weights[target] += 40;
      else if (heat < 0.9) weights[target] -= 10;
    }
    if (target === "cooling" || target === "bust") {
      if (heat < 0.9) weights[target] += 40;
      else if (heat > 1.1) weights[target] -= 10;
    }

    // 政策趋紧度调节
    if (target === "cooling" && tightness > 0.2) weights[target] += 20;
    if (target === "boom" && tightness < -0.2) weights[target] += 20;
    if (target === "stable" && Math.abs(tightness) < 0.2) weights[target] += 15;

    // 当前阶段的惯性（偏向相邻阶段）
    if (currentPhase === "boom" && target === "stable") weights[target] += 15;
    if (currentPhase === "bust" && target === "cooling") weights[target] += 15;
    if (currentPhase === "cooling" && target === "bust") weights[target] += 10;
    if (currentPhase === "cooling" && target === "stable")
      weights[target] += 10;
    if (currentPhase === "stable" && target === "cooling")
      weights[target] += 10;
    if (currentPhase === "stable" && target === "boom") weights[target] += 10;

    // 保底权重为正
    if (weights[target] < 1) weights[target] = 1;
  }

  // 加权随机选择
  var totalWeight = 0;
  for (var w in weights) totalWeight += weights[w];

  if (totalWeight <= 0) return "stable";

  var r = Random.float(0, totalWeight);
  var cumulative = 0;
  for (var pi = 0; pi < phases.length; pi++) {
    var p = phases[pi];
    cumulative += weights[p];
    if (r <= cumulative) return p;
  }

  return "stable";
}

// ====== 价格计算 ======

/**
 * 计算单套房产当天的价格变化乘数
 *
 * 变化率 = cycleDrift + sectorDrift + policyDrift + baseAppreciation + noise
 * 乘数 = 1 + 变化率
 * 最终 = 乘数 × newsMul
 */
function calculatePropertyDailyChange(prop, propDef, state) {
  var inv = state.investment;
  var phase = inv.propertyMarketPhase || "stable";

  // 1. 周期漂移（根据市场阶段）
  var cycleDrift = getCycleDrift(phase);

  // 2. 行业热度漂移（sectorHeat["房地产"] 偏离 1.0 的 5% 转化为日漂移）
  var sectorDrift = 0;
  if (typeof getSectorHeat === "function") {
    var heat = getSectorHeat("房地产");
    var zoneWeight = (propDef && propDef.zoneWeight) ||
      prop.zoneWeight || {
        sectorHeat: 0.8,
      };
    sectorDrift = (heat - 1.0) * 0.05 * (zoneWeight.sectorHeat || 0.8);
  }

  // 3. 政策漂移（政策趋紧度 × 系数 × 政策敏感度）
  var tightness = inv._propertyPolicyTightness || 0;
  var policyWeight =
    (propDef && propDef.zoneWeight && propDef.zoneWeight.policy) ||
    (prop.zoneWeight && prop.zoneWeight.policy) ||
    0.8;
  var policyDrift = tightness * 0.002 * policyWeight;

  // 4. 基础增值（房产自身的结构性趋势）
  var baseAppr =
    propDef && typeof propDef.baseAppreciation === "number"
      ? propDef.baseAppreciation
      : typeof prop.baseAppreciation === "number"
        ? prop.baseAppreciation
        : 0.0;

  // 5. 每日噪声
  var vol = (propDef && propDef.volatility) || prop.volatility || 0.004;
  var noise = Random.float(-vol, vol);

  // 6. 新闻乘数
  var newsMul = 1.0;
  if (typeof getNewsEffectForProperty === "function") {
    newsMul = getNewsEffectForProperty(state);
  }

  // 总变化率
  // [全系统自洽修复] 域E A类#1: totalDrift NaN 防御（任一组件 NaN 会导致所有房产价格永久损坏）
  var totalDrift = (cycleDrift || 0) + (sectorDrift || 0) + (policyDrift || 0) + (baseAppr || 0) + (noise || 0);
  if (!isFinite(totalDrift)) totalDrift = 0;

  // 限制单日最大涨跌幅度（防止极端值）
  totalDrift = Math.max(-0.08, Math.min(0.08, totalDrift));

  // 保守乘数 = (1 + 漂移)，乘以新闻乘数
  var mult = (1 + totalDrift) * newsMul;

  return mult;
}

/**
 * 根据当前市场阶段获取日周期漂移值
 */
function getCycleDrift(phase) {
  var def = PROPERTY_PHASES[phase];
  if (!def) return 0;
  return Random.float(def.driftMin, def.driftMax);
}

/**
 * 获取随机阶段持续期
 */
function getRandomPhaseDuration(phase) {
  var def = PROPERTY_PHASES[phase];
  if (!def) return 30;
  return def.minDuration + Random.int(0, def.maxDuration - def.minDuration);
}

// ====== UI 辅助函数 ======

/**
 * 生成市场阶段横幅 HTML
 */
function renderPropertyPhaseBanner(state) {
  var inv = state.investment;
  var phase = (inv && inv.propertyMarketPhase) || "stable";
  var def = PROPERTY_PHASES[phase];
  if (!def) return "";

  var heat = 1.0;
  if (typeof getSectorHeat === "function") {
    heat = getSectorHeat("房地产");
  }
  var heatArrow = heat > 1.05 ? "↑" : heat < 0.95 ? "↓" : "→";

  var tightness = inv._propertyPolicyTightness || 0;
  var policyLabel =
    tightness > 0.2
      ? "🏛️ 调控趋紧"
      : tightness < -0.2
        ? "🏛️ 政策宽松"
        : "🏛️ 政策中性";

  var daysInPhase = state.player.day - (inv.propertyPhaseStartDay || 0);

  return (
    '<div style="padding:8px 12px;margin-bottom:12px;background:rgba(255,255,255,0.03);border:1px solid ' +
    def.color +
    ';border-radius:6px;font-size:11px;display:flex;justify-content:space-between;align-items:center;">' +
    '<span><strong style="color:' +
    def.color +
    ';">' +
    def.icon +
    " " +
    def.label +
    "</strong>" +
    " <span style='color:var(--text-muted);font-size:10px;'>(已持续" +
    daysInPhase +
    "天)</span></span>" +
    '<span style="color:var(--text-muted);">行业热度 ' +
    heatArrow +
    " " +
    (heat * 100).toFixed(0) +
    "% | " +
    policyLabel +
    "</span>" +
    "</div>"
  );
}

/**
 * 生成房产卡片上的波动率/预期标签（替换固定年增值）
 */
function getPropertyVolatilityLabel(propDef) {
  if (!propDef) return "";
  var vol = propDef.volatility || 0.004;
  var base = propDef.baseAppreciation || 0;
  var annualVol = (vol * Math.sqrt(365) * 100).toFixed(1);
  var annualBase = (base * 365 * 100).toFixed(1);
  var sign = base >= 0 ? "+" : "";
  return (
    '<div style="font-size:10px;color:var(--text-muted);">波动率: ±' +
    annualVol +
    "%/年 | 结构趋势: " +
    sign +
    annualBase +
    "%/年</div>"
  );
}

// ====== 百科注册 ======
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.property_market = {
    id: "property_market",
    name: "房产市场周期",
    icon: "🏠",
    brief:
      "房产价格不再固定增值，而是随市场周期、行业热度、政策调控和新闻事件真实波动",
    version: "1.0.0",
    related: [
      "mechanics:world_params",
      "mechanics:investment",
      "mechanics:news_system",
    ],
    sections: [
      {
        kind: "desc",
        text: "房产市场系统为游戏中的房地产投资引入了真实的市场波动。每个房产的价格受四个主要因素影响：市场周期阶段（火爆/平稳/降温/萧条）、房地产行业热度、政府政策趋紧度，以及新闻事件冲击。",
      },
      {
        kind: "subhead",
        text: "📊 四大市场阶段",
      },
      {
        kind: "list",
        items: [
          "🔥 火爆期：房价快速上涨，持续 15-45 天，但政策风险累积",
          "➡️ 平稳期：正常波动，持续 20-60 天，基线状态",
          "❄️ 降温期：价格回落，持续 15-40 天，常由调控政策引发",
          "💥 萧条期：加速下跌，持续 10-30 天，恐慌情绪蔓延",
        ],
      },
      {
        kind: "subhead",
        text: "🔗 联动系统",
      },
      {
        kind: "list",
        items: [
          "新闻系统：调控政策、房贷利率、房企违约等新闻直接影响房价",
          "世界参数：房地产行业热度通过反馈环影响整体市场方向",
          "政策趋紧度：新闻事件累积导致政策立场变化（宽松→趋紧）",
          "不同类型房产敏感度不同：学区房对政策最敏感，海外房产基本不受国内周期影响",
        ],
      },
      {
        kind: "tip",
        text: "海外房产（东京/曼谷/迪拜）受中国房地产周期影响极小，是分散投资风险的好选择。但它们的流动性也较低。",
      },
    ],
  };
}
// [R101] 域E 联动增强
// [R141] 域E 联动增强
// [R173] 域E 联动增强
// [R205] 域E 联动增强
// [R229] 域E 联动增强
// [R253] 域E
// [R277] 域E
// [R349] 域E
