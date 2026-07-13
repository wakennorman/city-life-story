/**
 * 事件引擎核心 — 随机事件判定、队列管理、弹窗 UI
 *
 * 拆分说明：事件数据已移至 events_street.js / events_corp.js
 * 这些文件在加载后自动推入 RANDOM_EVENTS 数组。
 */

// ====== 空事件容器（由拆分文件在加载后推入）======
const RANDOM_EVENTS = [];

/**
 * 注册链式事件（P0-4: 链式事件填充）
 * @param {Object} state - 游戏状态
 * @param {string} eventId - 事件ID
 * @param {number} delayDays - 延迟天数
 * @param {Object} conditions - 触发条件（可选）
 */
function queueChainEvent(state, eventId, delayDays, conditions) {
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

  // 触发率随天数递增（Day1 18% → Day365 ~35%），确保后期事件池充分出场
  const baseChance = Math.min(0.35, 0.18 + state.player.day * 0.0005);
  // 健康差或债务高时提高触发率
  let mod = 0;
  if (state.status.health < 50) mod += 0.1;
  if (state.resources.debt > 3000) mod += 0.05;
  if (state.needs.happiness < 30) mod += 0.05;
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
  const baseChance = Math.min(0.4, 0.22 + state.player.day * 0.0005);
  let mod = 0;
  if (state.player.corporate.risk > 50) mod += 0.1;
  if (state.player.corporate.popularity < 30) mod += 0.05;
  if (state.player.corporate.upwardMgmt < 20) mod += 0.05;
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

  return true;
}

function queueRandomEvent(state, phase) {
  const pool = RANDOM_EVENTS.filter((e) => e.phase === phase);
  if (pool.length === 0) return;

  // ponytail: 排除链式事件——它们只能通过 scheduleChainEvent 触发
  var eligible = pool.filter(function (e) {
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
      state.resources.cash + (state.resources.bankBalance || 0) > e.maxCash
    )
      return false;
    if (
      e.minCash &&
      state.resources.cash + (state.resources.bankBalance || 0) < e.minCash
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
  // 先卸掉任何旧弹窗
  document.querySelector(".modal-overlay")?.remove();

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
      if (ch.cost && StateManager.getState().resources.cash < ch.cost) {
        disabled = true;
      }
      const costTag = ch.cost
        ? ` <span style="color:var(--warning);font-size:11px;">需 ¥${ch.cost}</span>`
        : "";
      return `
        <button class="event-choice ${disabled ? "disabled" : ""}" data-idx="${i}" ${disabled ? "disabled" : ""}>
          <div class="choice-main">${ch.text}${costTag}</div>
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
        <div class="event-icon">${evt.icon}</div>
        <h2 class="event-title">${evt.title}</h2>
      </div>
      <p class="event-story ${isSpringFest ? "spring-fest-story" : ""}">${evt.story}</p>
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
            if (efKey === "happiness" || efKey === "fatigue" || efKey === "hunger" || efKey === "hygiene") {
              state.needs[efKey] = Math.min(100, Math.max(0, (state.needs[efKey] || 50) + choice.effects[efKey]));
            } else if (efKey === "health") {
              state.status = state.status || {};
              state.status.health = Math.min(100, Math.max(0, (state.status.health || 100) + choice.effects[efKey]));
            }
          }
        }
        if (choice.flags && typeof choice.flags === "object") {
          for (var flKey in choice.flags) {
            state.flags[flKey] = choice.flags[flKey];
          }
        }
        // v3.1 ⑤ 事件惩罚倍率：快照关键数值，结算后对负向 delta 乘算难度系数
        var _preEvtCash = state.resources.cash;
        var _preEvtHealth = state.stats ? state.stats.health : 0;
        var _preEvtMental = state.player ? state.player.mental : 0;
        if (typeof choice.apply === "function") {
          choice.apply(state);
          // NPC事件桥接：事件结算后自动触发NPC好感变化
          if (typeof afterEventApplied === "function") {
            afterEventApplied(evt.id, state);
          }
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
      // v3.1 ⑤ 难度惩罚倍率结算：休闲×0.7 / 标准×1.0 / 困难×1.3 / 地狱×1.6
      try {
        if (typeof getDifficultyMultiplier === "function") {
          var epMult = getDifficultyMultiplier(state, "eventPenalty");
          if (epMult !== 1.0) {
            // 仅对负向 delta（惩罚）应用倍率，不放大正向收益
            var dCash = state.resources.cash - _preEvtCash;
            if (dCash < 0)
              state.resources.cash = _preEvtCash + Math.round(dCash * epMult);
            if (state.stats) {
              var dHealth = state.stats.health - _preEvtHealth;
              if (dHealth < 0)
                state.stats.health =
                  _preEvtHealth + Math.round(dHealth * epMult);
            }
            if (state.player) {
              var dMental = state.player.mental - _preEvtMental;
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
      <p>另一家公司开出了 <strong style="color:var(--success);">年薪 ¥${offer.salary.toLocaleString()}</strong> 的条件挖你！</p>
      <p style="font-size:12px;color:var(--text-secondary);">跳槽有风险：人缘归零、向上管理归零、KPI 减半、需重新建立关系。</p>
    `,
    buttons: [
      { text: "继续考虑", cls: "", callback: () => {} },
      {
        text: `接受 Offer (¥${offer.salary.toLocaleString()})`,
        cls: "btn-success",
        callback: () => {
          // 简化版：直接加钱 + 重置属性
          state.resources.cash += offer.salary;
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
            `💼 接受了新公司的 offer，拿到 ¥${offer.salary.toLocaleString()} 签字费！`,
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
        (news.desc || "这条新闻正在影响城市里的价格、工作和人心。") +
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
