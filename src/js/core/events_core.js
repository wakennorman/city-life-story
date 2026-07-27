/**
 * 事件引擎核心 — 随机事件判定、队列管理、弹窗 UI
 *
 * 拆分说明：事件数据已移至 events_street.js / events_corp.js
 * 这些文件在加载后自动推入 RANDOM_EVENTS 数组。
 */

// ====== 空事件容器（由拆分文件在加载后推入）======
const RANDOM_EVENTS = [];

/**
 * 金额缩放函数 — 根据玩家累计总收入缩放事件金额
 * 防止早期天价事件崩盘、晚期小额事件无感
 * @param {number} base - 基础金额
 * @param {number} totalEarned - 玩家累计总收入
 * @returns {number} 缩放后的金额
 */
function scaleAmount(base, totalEarned) {
  if (typeof base !== "number" || !isFinite(base)) return 0;
  if (typeof totalEarned !== "number" || !isFinite(totalEarned) || totalEarned <= 0) return base;
  // 每累计 ¥500,000 总收入，金额增加 10%，上限 3x
  var factor = 1 + Math.min(2, Math.floor(totalEarned / 500000) * 0.1);
  return Math.round(base * factor);
}

/**
 * 注册链式事件（P0-4: 链式事件填充）
 * @param {Object} state - 游戏状态
 * @param {string} eventId - 事件ID
 * @param {number} delayDays - 延迟天数
 * @param {Object} conditions - 触发条件（可选）
 */
function queueChainEvent(state, eventId, delayDays, conditions) {
  if (!state.flags) state.flags = {};
  if (!state.flags._chainEventQueue) {
    state.flags._chainEventQueue = [];
  }
  state.flags._chainEventQueue.push({
    eventId: eventId,
    triggerDay: state.player.day + delayDays,
    conditions: conditions || {},
    phase: state.player.phase || "street",
    triggered: false,
  });
}

/* =========================================================
 * 二、事件触发与队列管理
 * ========================================================= */

/**
 * 统一事件触发匹配器：支持 triggers 数据对象 + conditions 函数
 * @param {Object} event - 事件定义对象
 * @param {Object} state - 游戏状态
 * @returns {boolean}
 */
function eTriggersMatch(event, state) {
  if (!event) return false;
  // triggers 数据对象检查（如果存在）
  if (event.triggers && typeof event.triggers === "object") {
    if (!evaluateTriggers(event.triggers, state)) return false;
  } else if (event.triggers) {
    // 有 triggers 定义但 evaluateTriggers 不可用 → 默认放行（向前兼容）
    // 不阻断后续条件检查
  }
  // conditions 函数检查（如果存在，与 triggers 是 and 关系）
  if (typeof event.conditions === "function") {
    return event.conditions(state);
  }
  return true;
}

/** 街头每日事件判定 */
function rollStreetEvent(state) {
  // 基础 18% 触发率，已存在待弹事件时不重复触发
  if (state._pendingEvent) return;

  // 心理危机事件：mental<20时优先检查，不占用随机事件槽
  var mentalCrisisIds = [
    "mental_breakdown_edge",
    "mental_therapy_chance",
    "mental_recovery_milestone",
  ];
  for (var mci = 0; mci < mentalCrisisIds.length; mci++) {
    var mce = RANDOM_EVENTS.find(function (e) {
      return e.id === mentalCrisisIds[mci];
    });
    if (mce && eTriggersMatch(mce, state)) {
      state._pendingEvent = mce;
      state.flags._todayMentalEvent = true;
      return;
    }
  }

  // 村长债务追讨事件：债务未还时优先触发，不占用随机事件槽
  var debtEventIds = [
    "village_chief_warning",
    "village_chief_pressure",
    "village_chief_final",
  ];
  for (var dci = 0; dci < debtEventIds.length; dci++) {
    var dce = RANDOM_EVENTS.find(function (e) {
      return e.id === debtEventIds[dci];
    });
    if (dce && eTriggersMatch(dce, state)) {
      state._pendingEvent = dce;
      state.flags._todayDebtEvent = true;
      return;
    }
  }

  // 链式事件队列检查（高优先级，插入心理危机/债务检查之后，随机池之前）
  if (
    typeof checkChainEventQueue === "function" &&
    checkChainEventQueue(state, "street")
  )
    return;

  // [全系统自洽修复] 域B R388 联动增强: B→C 职业里程碑事件(入职特定天数触发叙事)
  if (state.career && state.career.currentJob) {
    var _jobWd = state.career.currentJob.workDays || 0;
    var _path = state.career.currentJob.path;
    if (_jobWd === 1 && !state.flags['_careerStartEvent_' + _path]) {
      state.flags['_careerStartEvent_' + _path] = true;
      // 入职第一天特殊叙事（已在 career_dev.js 的 applyCareerJob 中处理，但作为兜底）
    } else if (_jobWd === 365 && !state.flags._careerAnniversaryEvent) {
      state.flags._careerAnniversaryEvent = true;
      // 一周年叙事已在 tickCareerJobDaily 中处理
    }
    // [全系统自洽修复] 域B R52 联动增强(B→C): 工作满90天技能成长叙事
    if (_jobWd === 90 && !state.flags._career90dSkillEvent) {
      state.flags._career90dSkillEvent = true;
      if (typeof addSkillXp === "function" && state.skills) {
        addSkillXp(_path === "corporate" ? "management" : "sales", 10);
        StateManager.addMessage("📚 工作满90天，你在实践中积累了宝贵的职业技能经验。", "success");
      }
    }
    // [全系统自洽修复] 域B R52 联动增强(B→D): 工作满180天人脉拓展叙事
    if (_jobWd === 180 && !state.flags._career180dSocialEvent) {
      state.flags._career180dSocialEvent = true;
      if (state.relationships) {
        for (var _wpc = 0; _wpc < state.career.currentJob.workplaceNPCs.length; _wpc++) {
          var _npcId = state.career.currentJob.workplaceNPCs[_wpc];
          if (state.relationships[_npcId] && typeof applyAffinityChange === "function") {
            applyAffinityChange(state, _npcId, 5, "长期共事");
          }
        }
        StateManager.addMessage("🤝 工作半年，你和同事建立了深厚的默契和信任。", "success");
      }
    }
  }

  // [全系统自洽修复] 域B R52 联动增强(B→A): 叙事驱动的市场波动 — 活跃交易影响供需
  if (state.trade && state.trade.supplyDemand && state.player.day % 15 === 0) {
    var _tradeCount = state.flags._dailyTradeCount || 0;
    if (_tradeCount >= 5) {
      for (var _gid in state.trade.supplyDemand) {
        for (var _lid in state.trade.supplyDemand[_gid]) {
          if (Random.chance(0.3)) {
            state.trade.supplyDemand[_gid][_lid] = (state.trade.supplyDemand[_gid][_lid] || 0) - 2;
          }
        }
      }
      StateManager.addMessage("📊 市场注意到你频繁交易的活跃度，部分商品供需关系正在调整。", "info");
    }
  }

  // 触发率随天数递增（Day1 18% → Day365 ~35%），确保后期事件池充分出场
  const baseChance = Math.min(0.35, 0.18 + state.player.day * 0.0005);
  // 健康差或债务高时提高触发率
  // [全系统自洽修复] 域A R387 修复:rollStreetEvent 缺失 mod 声明(并行域B守卫修复漏删声明→每日抛 ReferenceError:mod is not defined→全策略100%死亡),补 let mod=0 与 rollCorporateEvent(:150)一致
  let mod = 0;
  // [全系统自洽修复] 域B A类修复: state.status/needs 守卫(防止旧存档崩溃)
  if (state.status && state.status.health < 50) mod += 0.1;
  if (state.resources && state.resources.debt > 3000) mod += 0.05;
  if (state.needs && state.needs.happiness < 30) mod += 0.05;
  // 历史声誉幸运加成（P2.9）：积善之人事件触发率降低
  if (typeof getHistoryModifiers === "function") {
    var lk = getHistoryModifiers(state).luckBonus || 0;
    mod -= lk * 0.008; // 每点幸运降低0.8%触发率（+5幸运≈-4%）
  }
  if (Random.chance(baseChance + mod)) {
    queueRandomEvent(state, "street");
  }
}

/** 职场每日事件判定 */
function rollCorporateEvent(state) {
  if (state._pendingEvent) return;

  // 链式事件队列检查（高优先级）
  if (
    typeof checkChainEventQueue === "function" &&
    checkChainEventQueue(state, "corporate")
  )
    return;

  // 职场触发率亦随天数递增（Day1 22% → Day365 ~40%）
  // [全系统自洽修复] 域B A类修复: state.player.corporate 守卫(防止旧存档/无职场状态崩溃)
  const baseChance = Math.min(0.4, 0.22 + state.player.day * 0.0005);
  let mod = 0;
  var _corp = state.player && state.player.corporate;
  if (_corp && _corp.risk > 50) mod += 0.1;
  if (_corp && _corp.popularity < 30) mod += 0.05;
  if (_corp && _corp.upwardMgmt < 20) mod += 0.05;
  if (Random.chance(baseChance + mod)) {
    queueRandomEvent(state, "corporate");
  }
}

/** 把一个随机事件塞进待弹队列 */
function isCrisis35FollowupEvent(evt, state) {
  return (
    evt &&
    typeof evt.id === "string" &&
    evt.id.indexOf("c35_") === 0 &&
    state.flags &&
    !!state.flags._crisis35Path
  );
}

/**
 * 约定式事件触发条件评估
 * 事件声明 triggers 数据对象，系统自动匹配条件，无需手写 conditions 函数
 *
 * triggers 支持字段：
 *   minDay / maxDay       — 天数范围
 *   minCash / maxCash     — 财富范围（cash + bankBalance）
 *   minStat               — { physique: 20, intelligence: 25 } 属性下限
 *   maxStat               — { physique: 40 } 属性上限
 *   minSkill              — { cooking: 10, coding: 15 } 技能等级下限
 *   maxSkill              — { cooking: 30 } 技能等级上限
 *   requireFlags          — 必须全部存在: ["_oldZhouReferred"]
 *   excludeFlags          — 必须全部不存在: ["_eraEvent_90"]
 *   minAge / maxAge       — 年龄范围
 *   educationMin          — 最低学历等级
 *   moralityMin / moralityMax — 道德范围
 *   phase                 — 阶段过滤: "street" / "corporate"
 *   minNeeds / maxNeeds   — 需求范围: { health: 30, hunger: 20 }
 *   hasDebt               — 是否负债: true/false
 *   hasCert               — 证书判定: "cooking_cert" 或 ["cooking_cert"]
 *   hasFlag               — requireFlags 别名
 *   weather               — 天气过滤: ["rainy", "stormy"]
 *
 * @param {Object} triggers - 触发条件数据对象
 * @param {Object} state    - 游戏状态
 * @returns {boolean} 是否满足所有条件
 */
function evaluateTriggers(triggers, state) {
  if (!triggers || typeof triggers !== "object") return true;
  var p = state.player || {};

  // 天数范围
  if (triggers.minDay !== undefined && p.day < triggers.minDay) return false;
  if (triggers.maxDay !== undefined && p.day > triggers.maxDay) return false;

  // 财富范围
  if (triggers.minCash !== undefined) {
    var cash = (state.resources && state.resources.cash) || 0;
    cash += (state.resources && state.resources.bankBalance) || 0;
    if (cash < triggers.minCash) return false;
  }
  if (triggers.maxCash !== undefined) {
    var cash2 = (state.resources && state.resources.cash) || 0;
    cash2 += (state.resources && state.resources.bankBalance) || 0;
    if (cash2 > triggers.maxCash) return false;
  }

  // 属性下限
  if (triggers.minStat && typeof triggers.minStat === "object") {
    for (var sk in triggers.minStat) {
      var attrVal = p[sk] || 0;
      if (attrVal < triggers.minStat[sk]) return false;
    }
  }
  // 属性上限
  if (triggers.maxStat && typeof triggers.maxStat === "object") {
    for (var sk2 in triggers.maxStat) {
      var attrVal2 = p[sk2] || 0;
      if (attrVal2 > triggers.maxStat[sk2]) return false;
    }
  }

  // 技能等级下限
  if (triggers.minSkill && typeof triggers.minSkill === "object") {
    for (var skl in triggers.minSkill) {
      var skillDef = state.skills && state.skills[skl];
      var skillLvl = skillDef ? skillDef.level || 0 : 0;
      if (skillLvl < triggers.minSkill[skl]) return false;
    }
  }
  // 技能等级上限
  if (triggers.maxSkill && typeof triggers.maxSkill === "object") {
    for (var skl2 in triggers.maxSkill) {
      var skillDef2 = state.skills && state.skills[skl2];
      var skillLvl2 = skillDef2 ? skillDef2.level || 0 : 0;
      if (skillLvl2 > triggers.maxSkill[skl2]) return false;
    }
  }

  // Flag 必须存在
  if (triggers.requireFlags && Array.isArray(triggers.requireFlags)) {
    var flags = state.flags || {};
    for (var fi = 0; fi < triggers.requireFlags.length; fi++) {
      if (!flags[triggers.requireFlags[fi]]) return false;
    }
  }
  // Flag 必须不存在
  if (triggers.excludeFlags && Array.isArray(triggers.excludeFlags)) {
    var flags2 = state.flags || {};
    for (var fi2 = 0; fi2 < triggers.excludeFlags.length; fi2++) {
      if (flags2[triggers.excludeFlags[fi2]]) return false;
    }
  }

  // 年龄范围
  if (triggers.minAge !== undefined && p.age < triggers.minAge) return false;
  if (triggers.maxAge !== undefined && p.age > triggers.maxAge) return false;

  // 学历下限
  if (
    triggers.educationMin !== undefined &&
    (p.education ?? 0) < triggers.educationMin
  )
    return false;

  // 道德范围
  if (
    triggers.moralityMin !== undefined &&
    (p.morality ?? 50) < triggers.moralityMin
  )
    return false;
  if (
    triggers.moralityMax !== undefined &&
    (p.morality ?? 50) > triggers.moralityMax
  )
    return false;

  // 需求下限（state.needs 中对应维度 ≥ 值即匹配）
  if (triggers.minNeeds && typeof triggers.minNeeds === "object") {
    var needs = state.needs || {};
    for (var mn in triggers.minNeeds) {
      if ((needs[mn] || 0) < triggers.minNeeds[mn]) return false;
    }
  }
  // 需求上限（同上取反）
  if (triggers.maxNeeds && typeof triggers.maxNeeds === "object") {
    var needs2 = state.needs || {};
    for (var mxn in triggers.maxNeeds) {
      if ((needs2[mxn] || 0) > triggers.maxNeeds[mxn]) return false;
    }
  }

  // 负债判定
  if (triggers.hasDebt !== undefined) {
    var debt = (state.resources && state.resources.debt) || 0;
    if (triggers.hasDebt && debt <= 0) return false;
    if (!triggers.hasDebt && debt > 0) return false;
  }

  // 证书判定（字符串或数组，state.certificates 包含即匹配）
  if (triggers.hasCert !== undefined) {
    var certs = state.certificates || [];
    var reqCert = Array.isArray(triggers.hasCert)
      ? triggers.hasCert
      : [triggers.hasCert];
    for (var ci = 0; ci < reqCert.length; ci++) {
      if (certs.indexOf(reqCert[ci]) < 0) return false;
    }
  }

  // Flag 别名（兼容 trigger_registry 模板风格）
  if (triggers.hasFlag !== undefined) {
    var reqF = Array.isArray(triggers.hasFlag)
      ? triggers.hasFlag
      : [triggers.hasFlag];
    var fState = state.flags || {};
    for (var hfi = 0; hfi < reqF.length; hfi++) {
      if (!fState[reqF[hfi]]) return false;
    }
  }

  // 阶段过滤（state.player.phase 等于值）
  if (triggers.phase !== undefined && p.phase !== triggers.phase) return false;

  // 天气过滤（state.weather.current 在数组中）
  if (triggers.weather !== undefined) {
    var curWeather = state.weather && state.weather.current;
    var weatherArr = Array.isArray(triggers.weather)
      ? triggers.weather
      : [triggers.weather];
    if (weatherArr.indexOf(curWeather) < 0) return false;
  }

  // NPC 关系·已结识（v3.99d 约定式自动归类）
  if (triggers.relationshipMet !== undefined) {
    var relMetArr = Array.isArray(triggers.relationshipMet)
      ? triggers.relationshipMet
      : [triggers.relationshipMet];
    var rels = state.relationships || {};
    for (var rmi = 0; rmi < relMetArr.length; rmi++) {
      var npcRel = rels[relMetArr[rmi]];
      if (!npcRel || !npcRel.met) return false;
    }
  }

  // NPC 好感下限（v3.99d 约定式自动归类）
  if (triggers.relationshipAffinityMin !== undefined) {
    var affReqs = Array.isArray(triggers.relationshipAffinityMin)
      ? triggers.relationshipAffinityMin
      : [triggers.relationshipAffinityMin];
    var rels2 = state.relationships || {};
    for (var afi = 0; afi < affReqs.length; afi++) {
      var req = affReqs[afi];
      var npcRel2 = rels2[req.id];
      if (!npcRel2 || !npcRel2.met || (npcRel2.affinity || 0) < req.min) return false;
    }
  }

  // 季节过滤（v3.99d 约定式）
  if (triggers.season !== undefined) {
    var curSeason = state.weather && state.weather.season;
    var seasonArr = Array.isArray(triggers.season)
      ? triggers.season
      : [triggers.season];
    if (seasonArr.indexOf(curSeason) < 0) return false;
  }

  // 就业状态过滤（v3.99d 约定式）
  // "any"=有工作, "none"=无工作, 字符串=具体路径ID
  if (triggers.employment !== undefined) {
    var hasJob = !!(state.employment && state.employment.currentJob);
    var jobPath =
      state.employment &&
      state.employment.currentJob &&
      state.employment.currentJob.path;
    if (triggers.employment === "any" && !hasJob) return false;
    if (triggers.employment === "none" && hasJob) return false;
    if (triggers.employment !== "any" && triggers.employment !== "none") {
      if (!hasJob || jobPath !== triggers.employment) return false;
    }
  }

  // 名气范围（v3.99d 约定式·联动增强）
  if (triggers.minFame !== undefined) {
    var fame = state.player.fame || 0;
    if (fame < triggers.minFame) return false;
  }
  if (triggers.maxFame !== undefined) {
    var fame2 = state.player.fame || 0;
    if (fame2 > triggers.maxFame) return false;
  }

  // 位置过滤（v3.99d 约定式—state.trade.currentLocation / state.player.location）
  if (triggers.location !== undefined) {
    var curLoc =
      (state.trade && state.trade.currentLocation) ||
      (state.player && state.player.location) ||
      "";
    var locArr = Array.isArray(triggers.location)
      ? triggers.location
      : [triggers.location];
    if (locArr.indexOf(curLoc) < 0) return false;
  }

  return true;
}

function queueRandomEvent(state, phase) {
  const pool = RANDOM_EVENTS.filter((e) => e.phase === phase);
  if (pool.length === 0) return;

  // ponytail: 排除链式事件——它们只能通过 scheduleChainEvent 触发
  var eligible = pool.filter(function (e) {
    // [全系统自洽修复] 域B A类#2: 事件无phase字段时静默跳过（防止undefined===phase永假导致死循环）
    if (!e.phase) return false;
    // [全系统自洽修复] 域B A类#3: 事件被标记为dead时跳过（防死锁——事件质量差致永远无法触发但占据权重）
    if (e._dead) return false;
    if (e._isChainEvent) return false;

    // 约定式触发条件评估：triggers 数据对象 + conditions 函数
    // 两者共存时都需要满足（and 关系）。修复 v3.54 的 else-if 短路bug——
    // 原来 if-else-if 导致有 triggers 的事件完全跳过 conditions 函数
    if (e.triggers && typeof e.triggers === "object") {
      if (!evaluateTriggers(e.triggers, state)) return false;
    }
    if (e.conditions && typeof e.conditions === "function") {
      if (!e.conditions(state)) return false;
    }
    if (e.trigger && !e.trigger(state)) return false;

    // 财富检查：太有钱时不出贫穷主题事件
    if (
      e.maxCash &&
      (state.resources.cash || 0) + (state.resources.bankBalance || 0) > e.maxCash
    )
      return false;
    if (
      e.minCash &&
      (state.resources.cash || 0) + (state.resources.bankBalance || 0) < e.minCash
    )
      return false;
    return true;
  });
  if (eligible.length === 0) return;

  // 新闻桥接加权：活跃新闻提升特定事件的触发权重
  var weights = eligible.map(function (e) {
    var w = 1.0;
    // v3.57: 基于 probability 字段的权重归一化（以 0.05 为基准）
    // probability: 0.01 → ×0.2, 0.05 → ×1.0, 0.10 → ×2.0
    var prob = e.probability;
    if (typeof prob === "number" && prob > 0) {
      w *= prob / 0.05;
    }
    if (typeof getNewsBonusWeight === "function") {
      w += getNewsBonusWeight(e.id, state);
    }
    // 世界参数反馈环：行业热度高的领域相关事件更易触发
    if (typeof getSectorEventWeightMod === "function" && e.sector) {
      w *= getSectorEventWeightMod(e.sector);
    }
    // [全系统自洽修复] 域B 联动增强1: 极端天气提升相关事件概率（B→G）
    if (e.weather && state.weather && state.weather.current) {
      if (e.weather === state.weather.current) w *= 2.5;
    }
    // 35岁危机追访：路径已选且事件条件满足时，提高出场优先级
    if (isCrisis35FollowupEvent(e, state)) {
      w *= 3;
    }
    return Math.max(0.1, w);
  });
  var totalWeight = weights.reduce(function (a, b) {
    return a + b;
  }, 0);
  var roll = Random.float(0, totalWeight);
  var cursor = 0;
  var evt = eligible[0];
  for (var wi = 0; wi < eligible.length; wi++) {
    cursor += weights[wi];
    if (roll <= cursor) {
      evt = eligible[wi];
      break;
    }
  }
  // 使用唯一事件ID替代引用比较，避免引用失效导致事件卡住
  state._pendingEvent = evt;
  state._pendingEventId = evt.id;
  // 触发延迟到 render 阶段弹（避免在 tick 内部阻塞）
  setTimeout(() => {
    const s = StateManager.getState();
    if (s._pendingEvent && s._pendingEventId === evt.id) {
      showEventModal(evt);
      if (typeof playSound === "function") playSound("event");
      // [全系统自洽修复] 域B R387: 事件日记记录+市场情绪影响
      if (typeof recordEventToHistory === "function") {
        recordEventToHistory(s, evt.id, evt.title);
      }
      if (typeof applyEventMarketEffect === "function") {
        applyEventMarketEffect(s, evt.id);
      }
      // 不再自动关闭——玩家必须手动点击选择（游戏设计决定）
    }
  }, 50);
}

/* =========================================================
 * 三、事件弹窗 UI
 * ========================================================= */

/**
 * 渲染并展示一个事件模态框
 * @param {Object} evt - 事件对象
 */
function showEventModal(evt) {
  // 保护：如果已存在其他弹窗（如每日结算），不强制移除，让事件排队
  if (document.querySelector(".modal-overlay")) {
    // 已有弹窗，不覆盖——事件会留在 state._pendingEvent 中稍后弹出
    return;
  }

  // 保护：evt 为 null/undefined 时静默返回
  // 防御空 choices 数组（否则弹窗无按钮，游戏永久卡死）
  if (
    !evt ||
    !evt.choices ||
    (Array.isArray(evt.choices) && evt.choices.length === 0)
  ) {
    var s = StateManager.getState();
    s._pendingEvent = null;
    s._pendingEventId = null;
    return;
  }

  var choicesArr = evt.choices;
// [全系统自洽修复] 域B 联动增强: B→G 情绪状态影响事件选择 — 情绪低落时"消极"选项标记
  if (typeof choicesArr === "object" && choicesArr.length > 0) {
    var _stateForEmo = StateManager.getState();
    var _emoState = _stateForEmo.status && _stateForEmo.status.emotionalState;
    if (_emoState === "depressed" || _emoState === "sad") {
      for (var _ei = 0; _ei < choicesArr.length; _ei++) {
        if (choicesArr[_ei] && choicesArr[_ei].text) {
          var _txt = choicesArr[_ei].text;
          if (_txt.indexOf("忍") >= 0 || _txt.indexOf("放弃") >= 0 || _txt.indexOf("算了") >= 0 || _txt.indexOf("逃避") >= 0) {
            choicesArr[_ei]._moodTag = "sad";
          }
        }
      }
    } else if (_emoState === "elated" || _emoState === "happy") {
      for (var _ej = 0; _ej < choicesArr.length; _ej++) {
        if (choicesArr[_ej] && choicesArr[_ej].text) {
          var _txt2 = choicesArr[_ej].text;
          if (_txt2.indexOf("努力") >= 0 || _txt2.indexOf("坚持") >= 0 || _txt2.indexOf("试试") >= 0 || _txt2.indexOf("拼搏") >= 0) {
            choicesArr[_ej]._moodTag = "happy";
          }
        }
      }
    }
  }

  
// 支持 choices 为函数（动态生成，如政策套利兑现事件）
  var choicesArr = evt.choices;
  if (typeof choicesArr === "function") {
    choicesArr = choicesArr(StateManager.getState());
    if (!choicesArr || !choicesArr.length) {
      // 没有可用选项时自动跳过
      var s = StateManager.getState();
      s._pendingEvent = null;
      s._pendingEventId = null;
      return;
    }
  }

  // ====== 春节事件专属检测 ======
  var isSpringFest = !!evt._isSpringFestivalEvent;
  var springFestClass = isSpringFest ? "spring-fest-modal" : "";
  var springFestProgressHtml = "";
  var springFestDecorHtml = "";

  if (isSpringFest) {
    // 进度指示器：春节7天（除夕→初六）
    var dayNames = ["除夕", "初一", "初二", "初三", "初四", "初五", "初六"];
    var dayIcons = ["🏠", "🧧", "👨‍👩‍👧", "🔴", "💰", "🔨", "🗑️"];
    var currentDay = evt.id
      ? parseInt(evt.id.replace("spring_fest_day", ""))
      : 0;
    currentDay = Math.max(0, Math.min(6, currentDay));

    var dotsHtml = "";
    for (var d = 0; d < 7; d++) {
      var dotClass = "spring-fest-progress-dot";
      if (d === currentDay) dotClass += " active";
      else if (d < currentDay) dotClass += " passed";
      dotsHtml += '<div class="' + dotClass + '"></div>';
    }

    springFestProgressHtml =
      '<div class="spring-fest-progress">' +
      '<span class="spring-fest-progress-label">🧨 春节</span>' +
      '<div class="spring-fest-progress-dots">' +
      dotsHtml +
      "</div>" +
      '<span class="spring-fest-progress-label" style="margin-left:4px;">第' +
      (currentDay + 1) +
      "/7天 · " +
      dayNames[currentDay] +
      "</span>" +
      "</div>";

    // 春节装饰元素
    springFestDecorHtml =
      '<span class="spring-fest-decor lantern-left">🏮</span>' +
      '<span class="spring-fest-decor lantern-right">🏮</span>' +
      '<span class="spring-fest-decor coin-bottom">💰</span>';
  }

  // 构建选项HTML
  const choicesHtml = choicesArr
    .map((ch, i) => {
      const hintStr = ch.hint
        ? `<div class="choice-hint">${ch.hint}</div>`
        : "";
      // 检查现金是否够
      let disabled = false;
      if (ch.cost && (StateManager.getState().resources.cash || 0) < ch.cost) {
        disabled = true;
      }
      const costTag = ch.cost
        ? ` <span style="color:var(--warning);font-size:11px;">需 ¥${ch.cost}</span>`
        : "";
      // [全系统自洽修复] 域B 联动增强: B→G 情绪标记显示
      var _moodTagHtml = "";
      if (ch._moodTag === "sad") _moodTagHtml = ' <span style="font-size:9px;color:var(--text-muted);">😔</span>';
      else if (ch._moodTag === "happy") _moodTagHtml = ' <span style="font-size:9px;color:var(--success);">😊</span>';
      return `
        <button class="event-choice ${disabled ? "disabled" : ""}" data-idx="${i}" ${disabled ? "disabled" : ""}>
          <div class="choice-main">${ch.text}${costTag}${_moodTagHtml}</div>
          ${hintStr}
        </button>
      `;
    })
    .join("");

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay event-modal " + springFestClass;
  overlay.innerHTML = `
    <div class="modal-box event-box ${springFestClass}">
      ${springFestDecorHtml}
      ${springFestProgressHtml}
      <div class="event-header">
        <div class="event-icon" title="${evt.title}">${evt.icon}</div>
        <h2 class="event-title" title="${evt.story ? evt.story.replace(/<[^>]*>/g, '').substring(0, 100) : ''}">${evt.title}</h2>
        ${evt.weather ? '<span class="event-tag weather-tag" style="font-size:10px;padding:1px 6px;border-radius:3px;background:rgba(90,138,180,0.15);color:var(--info);margin-left:8px;">🌤️ 天气</span>' : ""}
        ${evt.sector ? '<span class="event-tag sector-tag" style="font-size:10px;padding:1px 6px;border-radius:3px;background:rgba(74,158,92,0.15);color:var(--success);margin-left:4px;">🏭 ' + evt.sector + '</span>' : ""}
      </div>
      <p class="event-story ${isSpringFest ? "spring-fest-story" : ""}">${(function () {
        // [全系统自洽修复] 域D R455 A类: 29个联动文件采用 text:function(st) 动态叙述惯例但渲染层从不调用→story中"{desc}"占位符原样泄漏给玩家。优先调用 text() 取动态叙述,失败/为空回退 story
        if (typeof evt.text === "function") {
          try {
            var _dyn = evt.text(typeof StateManager !== "undefined" ? StateManager.getState() : null);
            if (_dyn && typeof _dyn === "string") return _dyn;
          } catch (e) { /* 动态文本失败回退story */ }
        }
        return evt.story || evt.desc || "";
      })()}</p>
      <div class="event-choices">${choicesHtml}</div>
      <div style="text-align:center;margin-top:8px;font-size:10px;color:var(--accent);">
        ${isSpringFest ? "🧨 做出你的选择，迎接新的一年" : "⚡ 请选择一个选项继续"}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // 绑定选项点击
  overlay.querySelectorAll(".event-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx);
      const choice = choicesArr[idx];
      if (!choice) return;
      const state = StateManager.getState();
      try {
        // v3.99c 约定式自动归类：声明式 effects/flags 自动应用（节日事件等）
        if (choice.effects && typeof choice.effects === "object") {
          for (var efKey in choice.effects) {
            if (
              efKey === "happiness" ||
              efKey === "fatigue" ||
              efKey === "hunger" ||
              efKey === "hygiene"
            ) {
              state.needs[efKey] = Math.min(
                100,
                Math.max(0, (state.needs[efKey] || 50) + choice.effects[efKey]),
              );
            } else if (efKey === "health") {
              state.status = state.status || {};
              state.status.health = Math.min(
                100,
                Math.max(
                  0,
                  (state.status.health || 100) + choice.effects[efKey],
                ),
              );
            }
          }
        }
        if (choice.flags && typeof choice.flags === "object") {
          for (var flKey in choice.flags) {
            state.flags[flKey] = choice.flags[flKey];
          }
        }
        // v3.1 ⑤ 事件惩罚倍率：快照关键数值，结算后对负向 delta 乘算难度系数
        // [全系统自洽修复] 域B A类#1: _preEvtCash NaN 守卫 — 防止旧存档/极端值导致现金永久损坏
        var _preEvtCash = (typeof state.resources.cash === "number" && isFinite(state.resources.cash)) ? state.resources.cash : 0;
        var _preEvtHealth = (state.status && state.status.health) || 100;
        var _preEvtMental = state.player ? state.player.mental : 0;
        if (typeof choice.apply === "function") {
          choice.apply(state);
          // NPC事件桥接：事件结算后自动触发NPC好感变化
          if (typeof afterEventApplied === "function") {
            afterEventApplied(evt.id, state);
          }
        } else if (typeof choice.immediate === "function") {
          // [全系统自洽修复] 域B A类#2: 兼容 moral_events 的 immediate 格式（trigger_registry 路径的道德事件）
          choice.immediate(state);
        } else if (typeof choice.effect === "function") {
          // 兼容春节活动事件的 effect 模式（返回 {ok, msg}）
          var result = choice.effect(state);
          if (result && result.ok === false) {
            // 效果失败（如钱不够），不关闭弹窗
            return;
          }
        }
      } catch (e) {
        console.error("Event choice apply error:", e);
      }
      // [全系统自洽修复] 域B 联动增强#1 B→G: 记录最近事件(最多3个)，供UI展示和NPC话题引用
      state.flags._recentEvents = state.flags._recentEvents || [];
      state.flags._recentEvents.unshift({
        id: evt.id,
        title: evt.title || evt.id,
        icon: evt.icon || "📰",
        day: state.player.day,
      });
      if (state.flags._recentEvents.length > 3) state.flags._recentEvents.length = 3;

      // [全系统自洽修复] 域B 联动增强#2 B→D: 高风险事件后NPC安慰 — 亲近NPC会主动关心玩家
      try {
        if (evt._isChainEvent || evt.id.indexOf("moral_") === 0 || evt.id.indexOf("risk") >= 0) {
          var _rels = state.relationships || {};
          var _comfortNpc = null;
          for (var _rid in _rels) {
            if (_rels[_rid] && _rels[_rid].met && (_rels[_rid].affinity || 0) >= 40) {
              _comfortNpc = _rid;
              break;
            }
          }
          if (_comfortNpc && typeof NPCS !== "undefined") {
            var _npcDef = NPCS.find(function(nn) { return nn.id === _comfortNpc; });
            if (_npcDef && Random.chance(0.4)) {
              StateManager.addMessage("💬 " + _npcDef.name + "注意到了你的经历，对你点点头：「没事吧？有什么需要帮忙的尽管说。」", "info");
            }
          }
        }
      } catch (e) {
        // 静默：NPC安慰不影响主流程
      }

      // [全系统自洽修复] 域B 联动增强#3 B→A: 新闻事件短期影响商品价格
      try {
        if (evt._converted === "news" && evt.newsEffects && evt.newsEffects.priceMod && state.trade) {
          for (var _pmId in evt.newsEffects.priceMod) {
            if (evt.newsEffects.priceMod.hasOwnProperty(_pmId)) {
              // 在所有地点应用价格修正
              for (var _locKey in state.trade.goodsPrices) {
                if (state.trade.goodsPrices.hasOwnProperty(_locKey) && state.trade.goodsPrices[_locKey][_pmId]) {
                  state.trade.goodsPrices[_locKey][_pmId] = Math.round(
                    state.trade.goodsPrices[_locKey][_pmId] * evt.newsEffects.priceMod[_pmId] * 100
                  ) / 100;
                }
              }
            }
          }
        }
      } catch (e) {
        // 静默：新闻价格影响不影响主流程
      }
      if (typeof state.resources.cash !== "number" || !isFinite(state.resources.cash)) state.resources.cash = 0;
      state.resources.cash = Math.max(0, state.resources.cash || 0);
      // [域B R417 联动增强] B→A: 事件类型统计 — 累计moral/risk/news等事件计数，供经济系统感知
      if (!state.stats) state.stats = {};
      if (!state.stats.eventCounts) state.stats.eventCounts = {};
      var _evtCat = "other";
      if (evt.id.indexOf("moral_") === 0) _evtCat = "moral";
      else if (evt.id.indexOf("risk_") === 0) _evtCat = "risk";
      else if (evt._converted === "news") _evtCat = "news";
      else if (evt._isChainEvent) _evtCat = "chain";
      state.stats.eventCounts[_evtCat] = (state.stats.eventCounts[_evtCat] || 0) + 1;

      // [域B R417 联动增强] B→G: 重大事件对心智的长期影响 — 连续负面事件降低心智韧性
      if (evt._isChainEvent || evt.id.indexOf("moral_") === 0) {
        if (!state.flags) state.flags = {};
        state.flags._lastSeriousEventDay = state.player.day;
        // 连续3天内第二次重大事件 → 心智-2（累积压力）
        if (state.flags._lastSeriousEventDay && state.player.day - (state.flags._lastSeriousEventDay || 0) <= 3) {
          if (state.player) state.player.mental = Math.max(0, (state.player.mental || 50) - 2);
        }
      }

      // [域B R417 联动增强] B→F: 事件响应追踪 — 记录玩家选择模式，供UI显示决策风格
      if (choice && !state.flags._eventChoiceTrack) state.flags._eventChoiceTrack = {};
      if (choice && choice.text) {
        var _choiceType = "other";
        if (choice.text.indexOf("报警") >= 0 || choice.text.indexOf("举报") >= 0) _choiceType = "lawful";
        else if (choice.text.indexOf("忍") >= 0 || choice.text.indexOf("算了") >= 0) _choiceType = "passive";
        else if (choice.text.indexOf("拼") >= 0 || choice.text.indexOf("搏") >= 0 || choice.text.indexOf("赌") >= 0) _choiceType = "risky";
        else if (choice.text.indexOf("帮") >= 0 || choice.text.indexOf("捐") >= 0 || choice.text.indexOf("救") >= 0) _choiceType = "helpful";
        state.flags._eventChoiceTrack[_choiceType] = (state.flags._eventChoiceTrack[_choiceType] || 0) + 1;
      }

      // [全系统自洽修复] 域B 联动增强: B→F 事件历史记录
      if (!state.flags) state.flags = {};
  if (!state.flags._eventHistory) state.flags._eventHistory = [];
      if (evt && evt.id) {
        var _dup = state.flags._eventHistory.find(function(e) { return e.id === evt.id && e.day === state.player.day; });
        if (!_dup) {
          state.flags._eventHistory.push({ id: evt.id, title: evt.title || evt.id, day: state.player.day, phase: state.player.phase });
          if (state.flags._eventHistory.length > 100) state.flags._eventHistory = state.flags._eventHistory.slice(-100);
        }
      }
      // v3.1 ⑤ 难度惩罚倍率结算：休闲×0.7 / 标准×1.0 / 困难×1.3 / 地狱×1.6
      try {
        if (typeof getDifficultyMultiplier === "function") {
          var epMult = getDifficultyMultiplier(state, "eventPenalty");
          if (epMult !== 1.0) {
            // 仅对负向 delta（惩罚）应用倍率，不放大正向收益
            // [全系统自洽修复] 域B A类#1: dCash/state.resources.cash NaN 守卫 — 扩散到 cash 则永久损坏
            var dCash = (state.resources.cash || 0) - (_preEvtCash || 0);
            if (!isFinite(dCash)) dCash = 0;
            if (dCash < 0)
              state.resources.cash = (_preEvtCash || 0) + Math.round(dCash * epMult);
            if (state.stats) {
              var dHealth =
                (state.status ? state.status.health : 100) - _preEvtHealth;
              if (!isFinite(dHealth)) dHealth = 0;
              if (dHealth < 0)
                state.status.health =
                  _preEvtHealth + Math.round(dHealth * epMult);
            }
            if (state.player) {
              var dMental = state.player.mental - _preEvtMental;
              if (!isFinite(dMental)) dMental = 0;
              if (dMental < 0)
                state.player.mental =
                  _preEvtMental + Math.round(dMental * epMult);
            }
          }
        }
      } catch (e) {
        console.error("v3.1 eventPenalty apply error:", e);
      }
      // 清掉待弹事件（三字段全部清理）
      state._pendingEvent = null;
      state._pendingEventId = null;
      // [全系统自洽修复] 域B 联动增强: 追踪每日事件触发次数（供日报使用）
      if (state.flags) {
        if (!state.flags._dailyEventCount || state.flags._dailyEventDay !== state.player.day) {
          state.flags._dailyEventCount = 1;
          state.flags._dailyEventDay = state.player.day;
        } else {
          state.flags._dailyEventCount++;
        }
      }
      // 关闭弹窗 + 重新渲染
      document.body.removeChild(overlay);
      renderAll();
    });
  });

  // ponytail: 事件弹窗必须点击按钮，不允许点击遮罩关闭
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      // 不做任何事——玩家必须点击按钮选择
    }
  });
}

/** 跳槽 offer 决策弹窗（被 corp_headhunter 事件调用） */
function showJobOfferModal() {
  const state = StateManager.getState();
  const offer = state.corporate.jobOffer;
  if (!offer) return;
  showModal({
    title: "💼 跳槽 Offer 决策",
    body: `
      <p>另一家公司开出了 <strong style="color:var(--success);">年薪 ¥${(offer.salary || 0).toLocaleString()}</strong> 的条件挖你！</p>
      <p style="font-size:12px;color:var(--text-secondary);">跳槽有风险：人缘归零、向上管理归零、KPI 减半、需重新建立关系。</p>
    `,
    buttons: [
      { text: "继续考虑", cls: "", callback: () => {} },
      {
        text: `接受 Offer (¥${(offer.salary || 0).toLocaleString()})`,
        cls: "btn-success",
        callback: () => {
          // 简化版：直接加钱 + 重置属性
          state.resources.cash = (state.resources.cash || 0) + offer.salary;
          state.player.corporate.kpi = Math.max(
            0,
            state.player.corporate.kpi * 0.5,
          );
          state.player.corporate.popularity = Math.max(
            0,
            state.player.corporate.popularity - 30,
          );
          state.player.corporate.upwardMgmt = Math.max(
            0,
            state.player.corporate.upwardMgmt - 30,
          );
          state.corporate.jobOffer = null;
          StateManager.addMessage(
            `💼 接受了新公司的 offer，拿到 ¥${(offer.salary || 0).toLocaleString()} 签字费！`,
            "event",
          );
          renderAll();
        },
      },
    ],
  });
}

/* =========================================================
 * 三·五、链式事件调度管理
 * ========================================================= */

/**
 * 调度一个链式事件在 delayDays 后触发
 * @param {Object} state - 游戏状态
 * @param {string} eventId - 事件ID
 * @param {number} delayDays - 延迟天数
 * @param {string} phase - "street" | "corporate"
 */
function scheduleChainEvent(state, eventId, delayDays, phase) {
  if (!state.flags._chainEventQueue) {
    state.flags._chainEventQueue = [];
  }
  var triggerDay = state.player.day + delayDays;
  // 避免重复调度同一事件
  for (var i = 0; i < state.flags._chainEventQueue.length; i++) {
    if (state.flags._chainEventQueue[i].eventId === eventId) {
      state.flags._chainEventQueue[i].triggerDay = triggerDay;
      return;
    }
  }
  state.flags._chainEventQueue.push({
    eventId: eventId,
    triggerDay: triggerDay,
    phase: phase,
  });
}

/**
 * 检查链式事件队列，有到期事件时直接弹出
 * @param {Object} state - 游戏状态
 * @param {string} phase - "street" | "corporate"
 * @returns {boolean} 是否触发了链式事件
 */
function checkChainEventQueue(state, phase) {
  if (state._pendingEvent) return false;
  var queue = state.flags._chainEventQueue;
  if (!queue || queue.length === 0) return false;

  // 按触发日排序，最急的在前
  queue.sort(function (a, b) {
    return a.triggerDay - b.triggerDay;
  });

  for (var i = 0; i < queue.length; i++) {
    var entry = queue[i];
    if (entry.phase !== phase) continue;
    if (state.player.day < entry.triggerDay) continue;

    // 从队列移除该事件，i-- 防止跳过下一个元素
    queue.splice(i, 1);
    i--;

    // 在 RANDOM_EVENTS 中查找对应事件
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j].id === entry.eventId) {
        state._pendingEvent = RANDOM_EVENTS[j];
        state._pendingEventId = entry.eventId;
        // 延迟弹窗（避免在 tick 内部阻塞）
        setTimeout(
          (function (evt) {
            return function () {
              var s = StateManager.getState();
              if (s._pendingEvent && s._pendingEventId === evt.id) {
                showEventModal(evt);
                if (typeof playSound === "function") playSound("event");
              }
            };
          })(RANDOM_EVENTS[j]),
          80,
        );
        return true;
      }
    }
    // 没找到事件（可能被删了），继续检查下一条
  }
  return false;
}

/* =========================================================
 * 四、兼容旧 API
 * ========================================================= */

/** 每日新闻判定（旧 API，保持兼容） */

/**
 * 约定式自动归类 — 新闻效果描述生成器 v1.0
 *
 * 根据 news 的 type/level/effects 字段自动生成合适的 desc（效果描述），
 * 无需手动为每条新闻编写 desc。遵循"约定优于配置"原则：
 *
 * 约定规则：
 *   1. L4/personal/neighborhood → 邻里见闻风格（温暖轻量、生活化）
 *   2. L1/L2/L3 → 新闻快报风格（简洁客观、信息性）
 *   3. effects 字段决定具体描述方向（正向/负向/中性）
 *   4. 手动设置的 news.desc 优先级最高（跳过此函数）
 *
 * 新增一条新闻时，只需保证 type/level/effects 字段完整，
 * 系统自动为其生成合适的 desc，零配置。
 */
function autoGenerateNewsDesc(news) {
  if (!news) return "";
  if (!news.effects) {
    return "这件事在街头巷尾传开了。";
  }

  var eff = news.effects;
  var isNeighborhood =
    news.level === "L4" ||
    news.type === "personal" ||
    news.type === "neighborhood";

  // ——— 邻里见闻风格（温暖、轻量、生活化） ———
  if (isNeighborhood) {
    // 正向效果
    if (eff.happinessBonus > 0 || eff.hungerBonus > 0 || eff.fatigueBonus > 0) {
      return "今天心情不错，日子平平淡淡也是福。";
    }
    // 负向效果（轻度）
    if (eff.happinessPenalty > 0 || eff.fatiguePenalty > 0) {
      return "一点小插曲，不影响明天的太阳照常升起。";
    }
    // 花钱消息
    if (eff.cashLoss > 0) {
      return "花点小钱，给生活添点滋味。";
    }
    // 赚钱/省钱消息
    if (eff.cashBonus > 0) {
      return "省了一笔，日子能过得宽松点。";
    }
    // 工作机会
    if (eff.jobBonus || eff.jobPenalty) {
      return "街坊们都在议论这事，跟生计有关的总让人上心。";
    }
    // 物价
    if (eff.priceMod) {
      return "柴米油盐的事，人人都关心。";
    }
    // 投资
    if (eff.investmentEffect) {
      return "有头脑的人已经开始盘算了。";
    }
    // 兜底
    return "小小的新闻，在街坊邻里间漾开了一圈涟漪。";
  }

  // ——— 新闻快报风格（简洁客观、信息性） ———
  if (eff.investmentEffect && eff.jobBonus) {
    return "市场和就业都在变化，值得留意。";
  }
  if (eff.investmentEffect) {
    return "市场正在消化这条消息，留意后续变化。";
  }
  if (eff.jobBonus || eff.jobPenalty || eff.allJobsBonus) {
    return "就业市场正在发生变化，有人欢喜有人愁。";
  }
  if (eff.priceMod) {
    return "物价有所调整，精打细算的人已经注意到了。";
  }
  if (eff.cashBonus || eff.cashLoss) {
    return "这条消息对你的钱包有一定影响。";
  }
  if (eff.sectorHeat) {
    return "行业格局正在调整，机会与风险并存。";
  }
  return "这条新闻值得关注，可能会影响你的选择。";
}

function showNewsBriefingModal(news, state) {
  if (!news || typeof document === "undefined") return;
  state.flags._newsPopupSeen = state.flags._newsPopupSeen || {};
  var key = news.id + "_" + state.player.day;
  if (state.flags._newsPopupSeen[key]) return;
  state.flags._newsPopupSeen[key] = true;

  var attempts = 0;
  function openWhenReady() {
    attempts++;
    if (document.querySelector(".modal-overlay") && attempts < 8) {
      setTimeout(openWhenReady, 450);
      return;
    }
    if (typeof showModal !== "function") return;
    var level = news.level ? " · " + news.level : "";
    var type = news.type ? " · " + news.type : "";
    var duration = news.duration
      ? "影响约" + news.duration + "天"
      : "影响持续观察";

    // ponytail: 智力和技能影响新闻深度见解
    var intel = state.player.intelligence || 0;
    var engLvl =
      state.skills && state.skills.english
        ? state.skills.english.level || 0
        : 0;
    var acctLvl =
      state.skills && state.skills.accounting
        ? state.skills.accounting.level || 0
        : 0;
    var codingLvl =
      state.skills && state.skills.coding ? state.skills.coding.level || 0 : 0;
    var insightParts = [];

    // 智力 >= 25: 基础新闻解读
    if (intel >= 25) {
      if (news.type === "investment" || news.industry) {
        insightParts.push(
          "💡 这条新闻可能影响 " +
            (news.industry || "相关行业") +
            " 的市场走向",
        );
      } else if (news.effects && news.effects.jobMultiplier) {
        insightParts.push("💡 注意：部分行业收入可能因此波动");
      } else {
        insightParts.push("💡 你隐约感觉到这条新闻背后有更大的趋势");
      }
    }

    // 智力 >= 40 + 会计 >= 15: 财务分析级见解
    if (intel >= 40 && acctLvl >= 15) {
      insightParts.push(
        "📊 根据财务分析，此类政策/事件通常影响周期约3-6个月，建议提前布局",
      );
    }

    // 智力 >= 50 + 英语 >= 20: 国际视野级见解
    if (intel >= 50 && engLvl >= 20) {
      var engSuffix =
        "🌍 从国际视角看，此事件与全球趋势高度相关——外语能力让你能直接阅读外媒深度分析";
      if (
        news.type === "investment" ||
        (news.id &&
          (news.id.includes("exchange") ||
            news.id.includes("tariff") ||
            news.id.includes("export")))
      ) {
        engSuffix =
          "🌍 你通过外媒了解到，国际市场对此事件的反应比国内报道更剧烈——汇率波动风险需要关注";
      }
      insightParts.push(engSuffix);
    }

    // 智力 >= 60: 系统性见解
    if (intel >= 60) {
      insightParts.push(
        "🎯 你看到的不仅是事件本身——你发现这是系统性变化的信号，值得重新评估自己的职业和投资方向",
      );
    }

    // 编码 >= 25: 技术类新闻深入解读
    if (codingLvl >= 25 && news.industry === "科技") {
      insightParts.push(
        "💻 从技术角度看，这项变化将影响整个产业链——编程背景让你能理解其真实技术含量",
      );
    }

    var insightHtml = "";
    if (insightParts.length > 0) {
      insightHtml =
        '<div style="margin-top:10px;padding:10px 12px;background:linear-gradient(135deg,rgba(102,126,234,0.08),rgba(46,204,113,0.05));border:1px solid rgba(102,126,234,0.2);border-radius:6px;">' +
        '<div style="font-size:11px;font-weight:600;color:var(--accent);margin-bottom:4px;">🧠 你的分析</div>' +
        insightParts
          .map(function (p) {
            return (
              '<div style="font-size:11px;color:var(--text-secondary);margin:3px 0;">' +
              p +
              "</div>"
            );
          })
          .join("") +
        "</div>";
    }

    // 个人/邻里类小事用"邻里见闻"，大事件用"新闻快报"
    var _modalNewsTitle =
      news.level === "L4" ||
      news.type === "personal" ||
      news.type === "neighborhood"
        ? "🏘️ 邻里见闻"
        : "📰 新闻快报";
    showModal({
      title: _modalNewsTitle,
      body:
        '<div style="font-size:13px;line-height:1.65;">' +
        '<div style="font-weight:700;color:var(--text-primary);margin-bottom:8px;">' +
        (news.headline || "突发新闻") +
        "</div>" +
        '<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">' +
        "第" +
        state.player.day +
        "天" +
        level +
        type +
        " · " +
        duration +
        "</div>" +
        '<div style="padding:8px 10px;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;color:var(--text-secondary);">' +
        (news.desc || autoGenerateNewsDesc(news)) +
        "</div>" +
        insightHtml +
        "</div>",
      buttons: [
        { text: "知道了", cls: "btn-primary", callback: function () {} },
      ],
    });
  }
  setTimeout(openWhenReady, 120);
}

function rollDailyNews(state) {
  state.activeNews = state.activeNews || [];
  state.flags.seenNewsToday = state.flags.seenNewsToday || [];

  // 每日必出一条新闻（L1-L4 系统优先，fallback 旧池）
  _rollOneDailyNews(state);

  // 街头阶段额外触发事件弹窗
  if (state.player.phase === "street") {
    rollStreetEvent(state);
  } else {
    // 职场阶段触发职场事件
    rollCorporateEvent(state);
  }

  // 每3天重置已见新闻列表，让新闻可以重复出现
  if (state.player.day % 3 === 0) {
    state.flags.seenNewsToday = [];
  }
}

/** 每日一条新闻核心函数：从 L1-L4 池中选取，避免当日重复 */
function _rollOneDailyNews(state) {
  var seen = state.flags.seenNewsToday || [];
  var news = null;

  // 优先从 L1-L4 新闻池取（已有 2660 条）
  if (typeof getRandomNewsByLevel === "function") {
    // 按天数选层级：早期多 L3/L4 接地气，后期 L1/L2 宏观影响加深
    var day = state.player.day || 1;
    var levelPool;
    if (day < 30) levelPool = ["L3", "L4", "L4"];
    else if (day < 90) levelPool = ["L2", "L3", "L4"];
    else levelPool = ["L1", "L2", "L3", "L4"];
    var targetLevel = Random.fromArray(levelPool);
    for (var _a = 0; _a < 5; _a++) {
      var candidate = getRandomNewsByLevel(targetLevel, state);
      if (candidate && !seen.includes(candidate.id)) {
        news = candidate;
        break;
      }
    }
  }

  // fallback：旧新闻池
  if (!news && typeof getRandomNewsEvent === "function") {
    for (var _b = 0; _b < 5; _b++) {
      var fb = getRandomNewsEvent(state);
      if (fb && !seen.includes(fb.id)) {
        news = fb;
        break;
      }
    }
  }

  if (!news) return;

  news._appliedDay = state.player.day;
  state.activeNews.push(news);
  seen.push(news.id);
  state.flags.seenNewsToday = seen;
  applyNewsEffect(news, state);
  StateManager.addMessage("📰 " + news.headline, "event");
  showNewsBriefingModal(news, state);
}

/** 每日结束时的清理 */
function dailyCleanup(state) {
  cleanupExpiredNews(state);
  // 清理链式事件队列中已过期的条目
  if (state.flags._chainEventQueue && state.flags._chainEventQueue.length > 0) {
    state.flags._chainEventQueue = state.flags._chainEventQueue.filter(
      function (entry) {
        return state.player.day < entry.triggerDay + 30;
      },
    );
  }
  // 清理 L1-L4 新闻传导队列
  if (typeof cleanupConduitQueue === "function") {
    cleanupConduitQueue(state);
  }
}

// ====== P1-1 事件格式收敛：MORAL_EVENTS / NEWS_EVENTS → RANDOM_EVENTS 适配器 ======
// 把 MORAL_EVENTS 和 NEWS_EVENTS 注册到 RANDOM_EVENTS 统一池中，使所有事件
// 都走同一套 schema + 同一触发层。保留旧数组向后兼容。

/**
 * 把 MORAL_EVENTS 转换为 RANDOM_EVENTS 格式并注册到统一池
 */
function registerMoralEventsToPool() {
  if (typeof MORAL_EVENTS === "undefined" || !Array.isArray(MORAL_EVENTS)) return;
  if (RANDOM_EVENTS._moralRegistered) return;
  RANDOM_EVENTS._moralRegistered = true;

  for (var mi = 0; mi < MORAL_EVENTS.length; mi++) {
    var me = MORAL_EVENTS[mi];
    if (!me || !me.id) continue;
    var entry = {
      id: me.id,
      title: me.title,
      story: me.desc || me.title,
      phase: "street",
      probability: me.dailyChance || 0.04,
      _converted: "moral",
      choices: Array.isArray(me.choices) ? me.choices.map(function(c) {
        return { text: c.text, apply: c.immediate || function(){} };
      }) : [],
      conditions: (function(minDay, origCond) {
        return function(st) {
          if (minDay && st.player.day < minDay) return false;
          if (typeof origCond === "function" && !origCond(st)) return false;
          return true;
        };
      })(me.minDay, typeof me.condition === "function" ? me.condition : null),
    };
    RANDOM_EVENTS.push(entry);
  }
}

/**
 * 把 NEWS_EVENTS 转换为 RANDOM_EVENTS 格式并注册到统一池
 */
function registerNewsEventsToPool() {
  if (typeof NEWS_EVENTS === "undefined" || !Array.isArray(NEWS_EVENTS)) return;
  if (RANDOM_EVENTS._newsRegistered) return;
  RANDOM_EVENTS._newsRegistered = true;

  for (var ni = 0; ni < NEWS_EVENTS.length; ni++) {
    var ne = NEWS_EVENTS[ni];
    if (!ne || !ne.id) continue;
    var entry = {
      id: ne.id,
      title: ne.title,
      story: ne.content || ne.title,
      phase: "street",
      probability: ne.dailyChance || 0.03,
      _converted: "news",
      choices: Array.isArray(ne.choices) ? ne.choices.map(function(c) {
        return { text: c.text, apply: c.immediate || function(){} };
      }) : [],
      conditions: (function(minDay, origCond) {
        return function(st) {
          if (minDay && st.player.day < minDay) return false;
          if (typeof origCond === "function" && !origCond(st)) return false;
          return true;
        };
      })(ne.minDay, typeof ne.condition === "function" ? ne.condition : null),
    };
    RANDOM_EVENTS.push(entry);
  }
}

// [全系统自洽修复] 域B R387 联动增强(B→F): 事件日记记录—每次事件触发后写入历史供UI展示
function recordEventToHistory(state, eventId, eventTitle) {
  if (!state || !eventId) return;
  if (!state.flags) state.flags = {};
  if (!state.flags._eventHistory) state.flags._eventHistory = [];
  state.flags._eventHistory.push({
    id: eventId,
    title: eventTitle || eventId,
    day: state.player ? state.player.day : 0,
    phase: state.player ? state.player.phase : "street",
  });
  // 保持最近50条
  if (state.flags._eventHistory.length > 50) {
    state.flags._eventHistory = state.flags._eventHistory.slice(-50);
  }

  // [全系统自洽修复] 域B 联动增强(B→D): 重大事件社交传播 — 每10个事件触发一次社交圈好感提升
  var _evtCount = state.flags._eventHistory.length;
  if (_evtCount > 0 && _evtCount % 10 === 0 && state.relationships) {
    var _evtFlag = '_eventSocialBoost_' + _evtCount;
    if (!state.flags[_evtFlag]) {
      state.flags[_evtFlag] = true;
      var _boosted = 0;
      for (var _eId in state.relationships) {
        var _eRel = state.relationships[_eId];
        if (_eRel && _eRel.met) {
          _eRel.affinity = Math.min(100, (_eRel.affinity || 0) + 1);
          _boosted++;
        }
      }
      if (_boosted > 0 && typeof StateManager !== "undefined") {
        StateManager.addMessage("📖 经历了" + _evtCount + "次人生事件，你的故事成了街坊邻居的谈资，关系更近了。", "info");
      }
    }
  }
  // [全系统自洽修复] 域B 联动增强(B→G): 人生阅历→心理韧性
  if (_evtCount > 0 && _evtCount % 20 === 0) {
    var _resilienceFlag = '_eventResilience_' + _evtCount;
    if (!state.flags[_resilienceFlag] && state.status) {
      state.flags[_resilienceFlag] = true;
      state.status.health = Math.min(100, (state.status.health || 0) + 2);
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage("💪 经历了" + _evtCount + "次人生起落，你的心理韧性越来越强。健康+2。", "success");
      }
    }
  }
}

// [全系统自洽修复] 域B 联动增强(B→E): 事件经济影响 — 记录事件对经济数据的影响
  if (eventId && state.investment) {
    if (!state.flags) state.flags = {};
    if (!state.flags._eventEconomicImpact) state.flags._eventEconomicImpact = {};
    state.flags._eventEconomicImpact[eventId] = (state.flags._eventEconomicImpact[eventId] || 0) + 1;
  }
  // [全系统自洽修复] 域B R387 联动增强(B→A): 事件市场情绪—特定事件影响商品价格
function applyEventMarketEffect(state, eventId) {
  if (!state || !eventId || !state.trade) return;
  if (!state.trade.marketEvents) state.trade.marketEvents = [];
  var effects = {
    health_scam: { goodId: "cold_medicine", priceMod: 1.3, duration: 3, name: "保健品骗局冲击" },
    community_group_buy: { goodId: "vegetables", priceMod: 0.8, duration: 5, name: "团购冲击菜价" },
    scrap_surge_echo: { goodId: "scrap_metal", priceMod: 1.2, duration: 3, name: "废品涨价余波" },
    inflation_cycle: { goodId: "*", priceMod: 1.1, duration: 5, name: "通胀预期升温" },
  };
  var effect = effects[eventId];
  if (!effect) return;
  // 避免重复
  if (state.trade.marketEvents.find(function(e) { return e.id === "event_" + eventId; })) return;
  state.trade.marketEvents.push({
    id: "event_" + eventId,
    name: effect.name,
    goodId: effect.goodId,
    priceMod: effect.priceMod,
    remaining: effect.duration,
    desc: "事件影响：" + (effect.name),
  });
}

// [全系统自洽修复] 域B R410 联动增强(B→A): 事件行为数据追踪
function trackEventBehavior(state, eventId, choiceId) {
  if (!state || !eventId) return;
  if (!state.flags) state.flags = {};
  if (!state.flags._eventBehaviorLog) state.flags._eventBehaviorLog = [];
  state.flags._eventBehaviorLog.push({
    eventId: eventId,
    choice: choiceId || "unknown",
    day: (state.player && state.player.day) || 0,
  });
  if (state.flags._eventBehaviorLog.length > 100) state.flags._eventBehaviorLog.shift();
}

// [全系统自洽修复] 域B R410 联动增强(B→F): 事件视觉提示 — 返回事件类型对应的emoji
function getEventTypeIcon(eventType) {
  var iconMap = {
    price: "📈", job: "💼", policy: "📋", moral: "⚖️",
    crisis: "🚨", achievement: "🏆", health: "🏥", social: "👥",
    crime: "🚔", disaster: "🌪️", festival: "🎉", news: "📰",
  };
  return iconMap[eventType] || "📌";
}

// [全系统自洽修复] 域B R410 联动增强(B→G): 事件健康影响系数
function getEventHealthImpact(state, eventId) {
  if (!state || !eventId) return 0;
  var impactMap = {
    rain_storm: { fatigue: 15, health: -5 },
    heatwave: { fatigue: 5, happiness: -5 },
    cold_wave: { health: -3 },
    pickpocket: { happiness: -5 },
    food_poisoning: { health: -10, hunger: -10 },
  };
  var impact = impactMap[eventId];
  if (!impact) return 0;
  var total = 0;
  for (var k in impact) total += Math.abs(impact[k]);
  return total;
}
// [R122] 域B 联动增强
