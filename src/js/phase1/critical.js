/**
 * Critical 临界值强制选择系统
 *
 * 核心循环：
 *   1. consumeAP / endDay 之前调用 checkCriticalNeeds(state)
 *   2. 任一状态 ≤ 阈值且当日未延期过 → 弹出强制选择窗
 *      - "立即去 XX": 自动旅行 + 消费 + 补充
 *      - "后续自己再去": 标记 _deferred[need]=day，关闭弹窗
 *   3. endDay 时 applyDeferredCriticalPunishments(state)
 *      - 已延期且仍 ≤ 阈值 → 按维度差异化掷骰惩罚
 *
 * 阈值（参考《大多数》生存张力）:
 *   hunger     ≤ 10   再不吃要饿晕
 *   fatigue    ≥ 90   累得快倒下
 *   hygiene    ≤ 10   脏到要生病
 *   happiness  ≤ 10   抑郁到崩溃
 */

// ====== 阈值配置 ======
var CRITICAL_THRESHOLDS = {
  hunger: {
    type: "low",
    value: 10,
    amenityType: "food",
    label: "饥饱",
    icon: "🍚",
  },
  fatigue: {
    type: "high",
    value: 90,
    amenityType: "rest",
    label: "疲劳",
    icon: "😴",
  },
  hygiene: {
    type: "low",
    value: 10,
    amenityType: "bath",
    label: "卫生",
    icon: "🛁",
  },
  happiness: {
    type: "low",
    value: 10,
    amenityType: "fun",
    label: "心情",
    icon: "😊",
  },
};

/** 判断某个状态是否处于临界值 */
function isCriticalNeed(state, key) {
  var cfg = CRITICAL_THRESHOLDS[key];
  if (!cfg) return false;
  var v = state.needs[key];
  if (v == null) return false;
  return cfg.type === "low" ? v <= cfg.value : v >= cfg.value;
}

/** 找到当前需要紧急处理的临界状态（一次只弹一个，按优先级） */
function findCriticalNeed(state) {
  // 优先级：饥饱 > 疲劳 > 卫生 > 心情（饿晕最致命）
  var order = ["hunger", "fatigue", "hygiene", "happiness"];
  if (!state.flags._deferred) state.flags._deferred = {};
  for (var i = 0; i < order.length; i++) {
    var k = order[i];
    if (!isCriticalNeed(state, k)) continue;
    // 当日已延期则跳过（避免反复弹同一个）
    if (state.flags._deferred[k] === state.player.day) continue;
    return k;
  }
  return null;
}

/**
 * 主入口 — 检查临界状态，需要时弹出强制选择窗。
 * 返回 true 表示弹出了窗（调用方应中断本次行动）。
 */
function checkCriticalNeeds(state) {
  // 弹窗模态时不嵌套触发
  if (document.querySelector(".modal-overlay")) return false;
  // 游戏未开始或已结束不触发
  if (!state || state.flags.gameOver || state.flags.victory) return false;
  // 极端临界（≤5）由 checkExtremeConditions 接管，避免冲突
  if (
    state.needs.hunger <= 5 ||
    state.needs.fatigue >= 98 ||
    state.status.health <= 5
  )
    return false;

  var need = findCriticalNeed(state);
  if (!need) return false;
  showCriticalChoiceModal(state, need);
  return true;
}

// ====== UI: 强制选择弹窗 ======

function showCriticalChoiceModal(state, need) {
  var cfg = CRITICAL_THRESHOLDS[need];
  var curVal = state.needs[need];

  // 找最近的 3 个对应类型 amenity
  var nearest =
    typeof getNearestAmenitiesByType === "function"
      ? getNearestAmenitiesByType(state, cfg.amenityType, 4)
      : [];

  // 描述文案（按维度+严重度）
  var msg = _getCriticalMsg(need, curVal);

  // 构造按钮
  var buttons = [];
  for (var i = 0; i < nearest.length; i++) {
    var n = nearest[i];
    var a = n.amenity;
    var travelAp = 0;
    if (n.actualLoc !== state.trade.currentLocation) {
      travelAp =
        typeof getTravelApCost === "function"
          ? getTravelApCost(state.trade.currentLocation, n.actualLoc, state)
          : 12;
    }
    var totalAp = travelAp + (a.ap || 0);
    var totalCost = a.cost || 0;
    var locName =
      LOCATIONS[n.actualLoc] && LOCATIONS[n.actualLoc].name
        ? LOCATIONS[n.actualLoc].name
        : n.actualLoc;
    var affordable = state.resources.cash >= totalCost;
    var hasAp = state.player.actionPoints >= totalAp;

    var btnText =
      a.icon +
      " " +
      a.name +
      "（" +
      locName +
      "）¥" +
      totalCost +
      " · " +
      totalAp +
      "行动力";

    buttons.push({
      text: btnText,
      cls: (affordable && hasAp ? "btn-primary" : "") + " critical-choice-btn",
      _disabled: !affordable || !hasAp,
      disabledReason: affordable ? "行动力不足" : "现金不足",
      callback: (function (amenityId) {
        return function () {
          travelToAmenityAndUse(amenityId);
        };
      })(a.id),
    });
  }

  // 总有"后续自己再去"
  buttons.push({
    text: "🚶 后续自己再去",
    cls: "critical-choice-btn",
    callback: function () {
      var st = StateManager.getState();
      st.flags._deferred = st.flags._deferred || {};
      st.flags._deferred[need] = st.player.day;
      StateManager.addMessage(
        "⏳ 你决定" + cfg.label + "的事后续自己处理...小心后果。",
        "warning",
      );
    },
  });

  // 渲染弹窗
  showModal({
    title: "⚠️ 该补充" + cfg.label + "了！",
    body:
      '<div style="font-size:13px;line-height:1.7;">' +
      msg +
      '<div style="margin-top:10px;padding:8px;background:var(--bg-input);border-radius:4px;">' +
      "当前 " +
      cfg.icon +
      " " +
      cfg.label +
      '：<strong style="color:var(--danger);">' +
      curVal +
      "</strong>" +
      "</div>" +
      (nearest.length === 0
        ? '<p style="margin-top:8px;color:var(--text-muted);">附近暂无可用的恢复点，只能暂时撑着...</p>'
        : '<p style="margin-top:8px;color:var(--text-muted);font-size:11px;">点击下方"立即去"自动前往并消费；选"后续自己再去"则今天结束时若状态仍未恢复，会有不可预料的后果。</p>') +
      "</div>",
    buttons: buttons,
  });

  // 标记禁用按钮（modal.js 不支持 disabled，加个事后样式）
  setTimeout(function () {
    var overlay = document.querySelector(".modal-overlay");
    if (overlay) overlay.classList.add("critical-choice-overlay");
    var box = document.querySelector(".modal-box");
    if (box) box.classList.add("critical-choice-box");
    var actions = document.querySelector(".modal-actions");
    if (actions) actions.classList.add("critical-choice-actions");
    var btns = document.querySelectorAll(".modal-actions .btn");
    var idx = 0;
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      if (b._disabled && btns[idx]) {
        btns[idx].style.opacity = "0.4";
        btns[idx].title = "钱不够或行动力不足";
      }
      idx++;
    }
  }, 0);
}

function _getCriticalMsg(need, val) {
  if (need === "hunger") {
    if (val <= 5) return "💀 饿到眼前发黑，再不吃就要昏倒了！";
    if (val <= 8) return "🍞 肚子咕咕叫，胃酸翻涌，必须吃点东西。";
    return "🍞 已经饿得不行了，赶紧找点吃的。";
  }
  if (need === "fatigue") {
    if (val >= 95) return "😵 眼皮在打架，随时可能晕倒在街上！";
    if (val >= 90) return "🥵 累得腿都抬不起来，再撑着会出事。";
    return "🥱 浑身酸痛、思维迟钝，必须休息了。";
  }
  if (need === "hygiene") {
    if (val <= 5) return "🦠 浑身发臭，皮肤瘙痒，路人都绕着走。";
    return "🦠 已经几天没洗澡了，再不洗要生病。";
  }
  if (need === "happiness") {
    if (val <= 5) return "🌧️ 心如死灰，做什么都没意思。需要去散散心。";
    return "😔 心情低落到谷底，再这样下去人会废掉。";
  }
  return "状态告急，需要补充。";
}

// ====== Amenity 使用核心逻辑 ======

/**
 * 自动旅行到指定 amenity 所在地并消费使用。
 * 含旅行AP+amenity AP+cash 校验。
 */
function travelToAmenityAndUse(amenityId) {
  var state = StateManager.getState();
  var a = getAmenityById(amenityId);
  if (!a) {
    StateManager.addMessage("❌ 找不到该恢复点。", "danger");
    return;
  }

  var actualLoc = a.loc;
  if (a.loc === "*selfLive") {
    actualLoc = getSelfLiveLocKey(state);
    // 无自住房时尝试普通住所定位（租房也能做饭/洗澡）
    if (!actualLoc && typeof getHomeLocationKey === "function") {
      actualLoc = getHomeLocationKey(state);
    }
    if (!actualLoc) {
      StateManager.addMessage("❌ 你还没有住所。", "warning");
      return;
    }
  }

  var curLoc = state.trade.currentLocation;
  var travelAp = 0;
  if (actualLoc !== curLoc) {
    travelAp = getTravelApCost(curLoc, actualLoc, state);
  }
  var useAp = a.ap || 0;
  var totalAp = travelAp + useAp;
  var cost = a.cost || 0;

  if (state.resources.cash < cost) {
    StateManager.addMessage("💸 现金不足 ¥" + cost + "，无法消费。", "warning");
    return;
  }
  if (state.player.actionPoints < totalAp) {
    StateManager.addMessage(
      "⚡ 行动力不足（需要 " + totalAp + " 点行动力）。",
      "warning",
    );
    return;
  }

  // 食谱选择模式（在家做饭 → 弹出食谱选择界面）
  if (a.useRecipeSelection && typeof showCookingRecipeModal === "function") {
    showCookingRecipeModal(state, a, totalAp, cost);
    return;
  }

  // 执行旅行
  if (actualLoc !== curLoc) {
    StateManager.update("trade.currentLocation", actualLoc);
    var locName =
      (LOCATIONS[actualLoc] && LOCATIONS[actualLoc].name) || actualLoc;
    StateManager.addMessage("🚶 你前往了 " + locName + "。", "info");
    consumeAP(travelAp);
  }

  // 重新拿状态（consumeAP 可能导致状态重置）
  state = StateManager.getState();
  if (state.flags.gameOver) return;

  // 执行 amenity
  applyAmenity(state, a);
  consumeAP(useAp);
}

/**
 * 应用 amenity 效果：扣钱 + primary 主效果（按 tier 上限）+ bonusPool 真随机附加 + 标签习惯计数。
 */
function applyAmenity(state, a) {
  // === 食材消耗（在家做饭专用）===
  if (a.requiresIngredients) {
    var ingredientResult = consumeCookingIngredients(state, a);
    if (!ingredientResult.success) {
      StateManager.addMessage("🍳 " + ingredientResult.message, "warning");
      return;
    }
    // 食材消耗成功，记录烹饪经验
    if (typeof addCookingExp === "function") {
      addCookingExp(state, 15);
    }
  }

  // 扣钱
  if (a.cost > 0) {
    state.resources.cash -= a.cost;
    if (typeof addDailyTransaction === "function") {
      addDailyTransaction(state, "expense", "amenity", a.cost, a.name);
    }
  }

  // primary 主效果
  var msgParts = [];
  if (a.primary) {
    for (var key in a.primary) {
      if (!a.primary.hasOwnProperty(key)) continue;
      var amt = a.primary[key];
      if (
        key === "hunger" ||
        key === "fatigue" ||
        key === "hygiene" ||
        key === "happiness"
      ) {
        // fatigue 是反向：负值=减少疲劳=好；正值=增加疲劳=坏
        // 其他三项正值=补充
        var prev = state.needs[key];
        state.needs[key] = Math.max(0, Math.min(100, prev + amt));
        var delta = state.needs[key] - prev;
        msgParts.push(_needLabel(key) + (delta >= 0 ? "+" : "") + delta);
      } else if (
        key === "physique" ||
        key === "intelligence" ||
        key === "agility" ||
        key === "mental" ||
        key === "fame"
      ) {
        state.player[key] = Math.min(100, (state.player[key] || 0) + amt);
        msgParts.push(_attrLabel(key) + "+" + amt);
      } else if (key === "health") {
        state.status.health = Math.max(
          0,
          Math.min(100, state.status.health + amt),
        );
        msgParts.push("健康+" + amt);
      }
    }
  }

  // 累计使用次数（用于规律性 buff，可选放大 chance）
  state.flags._amenityHabitCount = state.flags._amenityHabitCount || {};
  var prevUsed = state.flags._amenityHabitCount[a.id] || 0;
  state.flags._amenityHabitCount[a.id] = prevUsed + 1;
  // 规律性微加成：每使用 5 次，bonusPool 的 chance 整体 ×1.05（封顶 ×1.5）
  var habitMult = Math.min(1.5, 1.0 + Math.floor((prevUsed + 1) / 5) * 0.05);

  // bonusPool 真随机附加效果
  if (a.bonusPool && a.bonusPool.length) {
    for (var i = 0; i < a.bonusPool.length; i++) {
      var b = a.bonusPool[i];
      var ch = (b.chance || 0) * habitMult;
      if (Random.chance(ch)) {
        if (
          b.stat === "hunger" ||
          b.stat === "fatigue" ||
          b.stat === "hygiene" ||
          b.stat === "happiness"
        ) {
          state.needs[b.stat] = Math.max(
            0,
            Math.min(100, state.needs[b.stat] + b.amt),
          );
        } else if (b.stat === "fame") {
          state.player.fame = Math.min(100, (state.player.fame || 0) + b.amt);
        } else {
          state.player[b.stat] = Math.min(
            100,
            (state.player[b.stat] || 0) + b.amt,
          );
        }
        msgParts.push(
          "✨ " +
            (b.stat === "fame" ? "名气" : _attrLabel(b.stat)) +
            "+" +
            b.amt,
        );
      }
    }
  }

  // 标签 → 习惯追踪
  state.flags._habits = state.flags._habits || {};
  if (a.junkFood) {
    state.flags._habits.junkFoodMeals =
      (state.flags._habits.junkFoodMeals || 0) + 1;
  }
  if (a.nutritious) {
    state.flags._habits.junkFoodMeals = Math.max(
      0,
      (state.flags._habits.junkFoodMeals || 0) - 2,
    );
  }
  if (a.lateNight) {
    state.flags._habits.lateNightActions =
      (state.flags._habits.lateNightActions || 0) + 1;
  }

  // 清除该维度的延期标记（已经处理过了）
  if (state.flags._deferred) {
    if (a.type === "food") delete state.flags._deferred.hunger;
    if (a.type === "rest") delete state.flags._deferred.fatigue;
    if (a.type === "bath") delete state.flags._deferred.hygiene;
    if (a.type === "fun") delete state.flags._deferred.happiness;
  }

  StateManager.addMessage(
    a.icon + " " + a.name + "：" + msgParts.join("，") + "。",
    "success",
  );
}

function _needLabel(k) {
  return (
    { hunger: "饥饱", fatigue: "疲劳", hygiene: "卫生", happiness: "心情" }[
      k
    ] || k
  );
}

function _attrLabel(k) {
  return (
    {
      physique: "体质",
      intelligence: "智力",
      agility: "敏捷",
      mental: "心智",
      fame: "名气",
      health: "健康",
    }[k] || k
  );
}

// ====== 延期惩罚（endDay 调用）=====
// 阶梯式惩罚：延期次数越多，惩罚越重
// 第1次延期：轻度警告 + 小额健康/心情损失
// 第2次延期：中度惩罚 + 概率患病
// 第3次延期：重度惩罚 + 强制昏倒/送医
// 第4次+延期：极端后果（健康暴跌/强制住院/解雇风险）

function applyDeferredCriticalPunishments(state) {
  if (!state.flags._deferred) return null;

  var skipDay = false;
  var keys = Object.keys(state.flags._deferred);
  for (var i = 0; i < keys.length; i++) {
    var need = keys[i];
    var deferInfo = state.flags._deferred[need];

    // 兼容旧格式：{ hunger: day } → 转为新格式
    if (typeof deferInfo === "number") {
      deferInfo = { count: 1, lastDay: deferInfo };
      state.flags._deferred[need] = deferInfo;
    }

    // 检查是否是连续延期（同一天内不重复罚）
    if (deferInfo.lastDay === state.player.day) continue;

    if (!isCriticalNeed(state, need)) continue; // 已经回血了不用罚

    // 递增延期次数
    deferInfo.count = (deferInfo.count || 0) + 1;
    deferInfo.lastDay = state.player.day;

    var result = _punishByNeed阶梯式(state, need, deferInfo.count);
    if (result === "skip_day") skipDay = true;
  }

  // 清空当日延期标记（无论是否处罚）
  state.flags._deferred = {};

  return skipDay ? "skip_day" : null;
}

function _punishByNeed阶梯式(state, need, deferCount) {
  // deferCount: 第几次延期（1=轻度, 2=中度, 3=重度, 4+=极端）
  var skipDay = false;

  if (need === "hunger") {
    if (deferCount === 1) {
      // 第1次延期：轻度 — 健康-3，饥饱降至15
      state.status.health = Math.max(0, state.status.health - 3);
      state.needs.hunger = Math.max(0, state.needs.hunger - 5);
      StateManager.addMessage(
        "😣 强忍饥饿撑过了一天，健康-3，肚子更难受了。",
        "warning",
      );
    } else if (deferCount === 2) {
      // 第2次延期：中度 — 健康-8，饥饱-10，概率得肠胃炎
      state.status.health = Math.max(0, state.status.health - 8);
      state.needs.hunger = Math.max(0, state.needs.hunger - 10);
      if (Random.chance(0.4)) {
        _contractIllness(state, "stomach_inflammation");
      }
      StateManager.addMessage(
        "🤢 连续两天挨饿，健康-8，肠胃开始抗议...",
        "danger",
      );
    } else if (deferCount === 3) {
      // 第3次延期：重度 — 饿晕，健康-15，饥饱重置为8
      state.status.health = Math.max(0, state.status.health - 15);
      state.needs.hunger = 8;
      StateManager.addMessage(
        "💀 你饿晕在街头！醒来已是深夜，健康-15。",
        "danger",
      );
      skipDay = true;
    } else {
      // 第4次+延期：极端 — 送医急救或路人施舍
      var fee = Random.int(300, 999);
      if (state.resources.cash >= fee) {
        state.resources.cash -= fee;
        if (typeof addDailyTransaction === "function") {
          addDailyTransaction(state, "expense", "medical", fee, "饿晕送医急救");
        }
      } else {
        state.resources.bankDebt = (state.resources.bankDebt || 0) + fee;
        state.resources.debt =
          (state.resources.villageDebt || 0) + (state.resources.bankDebt || 0);
      }
      state.needs.hunger = 30;
      state.status.health = Math.max(0, state.status.health - 10);
      state.flags._everHospitalized = true;
      StateManager.addMessage(
        "🏥 连续多日挨饿，你被送进医院急救！花了¥" + fee + "。",
        "danger",
      );
      skipDay = true;
    }
  } else if (need === "fatigue") {
    if (deferCount === 1) {
      // 第1次延期：轻度 — 疲劳+5，心情-3
      state.needs.fatigue = Math.min(100, state.needs.fatigue + 5);
      state.needs.happiness = Math.max(0, state.needs.happiness - 3);
      StateManager.addMessage("🥱 强撑了一天，疲劳+5，心情更差了。", "warning");
    } else if (deferCount === 2) {
      // 第2次延期：中度 — 疲劳+15，概率过劳/失眠
      state.needs.fatigue = Math.min(100, state.needs.fatigue + 15);
      state.needs.happiness = Math.max(0, state.needs.happiness - 8);
      if (Random.chance(0.35)) {
        _contractIllness(state, Random.chance(0.5) ? "overwork" : "insomnia");
      }
      StateManager.addMessage("🥵 连续两天过度疲劳，身体发出警告...", "danger");
    } else if (deferCount === 3) {
      // 第3次延期：重度 — 过劳晕倒
      state.needs.fatigue = 20;
      state.needs.happiness = Math.max(0, state.needs.happiness - 15);
      state.status.health = Math.max(0, state.status.health - 8);
      state.flags._everCollapsed = true;
      StateManager.addMessage(
        "😵 你累倒在路边！睡了一觉，疲劳重置但心情和健康受损。",
        "danger",
      );
      skipDay = true;
    } else {
      // 第4次+延期：极端 — 强制住院
      state.needs.fatigue = 10;
      state.status.health = Math.max(0, state.status.health - 15);
      state.flags._everHospitalized = true;
      StateManager.addMessage(
        "🏥 连续多日过劳，你被强制送医治疗！健康-15。",
        "danger",
      );
      skipDay = true;
    }
  } else if (need === "hygiene") {
    if (deferCount === 1) {
      // 第1次延期：轻度 — 心情-3，卫生-5
      state.needs.happiness = Math.max(0, state.needs.happiness - 3);
      state.needs.hygiene = Math.max(0, state.needs.hygiene - 5);
      StateManager.addMessage(
        "🦠 卫生告急但暂无大碍，心情-3，明天一定要洗澡了。",
        "warning",
      );
    } else if (deferCount === 2) {
      // 第2次延期：中度 — 概率患病，心情-8，名气-1
      state.needs.happiness = Math.max(0, state.needs.happiness - 8);
      state.player.fame = Math.max(0, (state.player.fame || 0) - 1);
      if (Random.chance(0.4)) {
        _contractIllness(state, Random.chance(0.5) ? "skin_infection" : "cold");
      }
      StateManager.addMessage(
        "🦠 连续两天卫生差，路人捂鼻避让，你可能生病了...",
        "warning",
      );
    } else if (deferCount === 3) {
      // 第3次延期：重度 — 强制患病
      _contractIllness(state, "skin_infection");
      state.needs.happiness = Math.max(0, state.needs.happiness - 10);
      state.player.fame = Math.max(0, (state.player.fame || 0) - 3);
      StateManager.addMessage(
        "🤒 卫生长期不达标，你得了皮肤病！心情-10，名气-3。",
        "danger",
      );
    } else {
      // 第4次+延期：极端 — 多重感染
      _contractIllness(state, "skin_infection");
      if (Random.chance(0.5)) _contractIllness(state, "cold");
      state.needs.happiness = Math.max(0, state.needs.happiness - 15);
      state.status.health = Math.max(0, state.status.health - 10);
      StateManager.addMessage(
        "🤒 长期卫生极差，多重感染爆发！健康-10。",
        "danger",
      );
    }
  } else if (need === "happiness") {
    if (deferCount === 1) {
      // 第1次延期：轻度 — 心情-5，疲劳+10
      state.needs.happiness = Math.max(0, state.needs.happiness - 5);
      state.needs.fatigue = Math.min(100, state.needs.fatigue + 10);
      StateManager.addMessage(
        "😔 又熬过了一个难熬的夜，心情-5，失眠让你更累了。",
        "warning",
      );
    } else if (deferCount === 2) {
      // 第2次延期：中度 — 心情-10，疲劳+20，累积抑郁计数
      state.needs.happiness = Math.max(0, state.needs.happiness - 10);
      state.needs.fatigue = Math.min(100, state.needs.fatigue + 20);
      state.flags._habits = state.flags._habits || {};
      state.flags._habits.lowHappinessStreak =
        (state.flags._habits.lowHappinessStreak || 0) + 3;
      StateManager.addMessage(
        "🌧️ 心情持续低落，抑郁的种子在心里发芽...",
        "danger",
      );
    } else if (deferCount === 3) {
      // 第3次延期：重度 — 整夜失眠，疲劳+30
      state.needs.fatigue = Math.min(100, state.needs.fatigue + 30);
      state.needs.happiness = Math.max(0, state.needs.happiness - 10);
      StateManager.addMessage("😴 整夜失眠，疲劳+30，明天会很难受。", "danger");
    } else {
      // 第4次+延期：极端 — 借酒消愁 + 概率重度抑郁
      var spend = Math.min(50, state.resources.cash);
      if (spend > 0) {
        state.resources.cash -= spend;
        if (typeof addDailyTransaction === "function") {
          addDailyTransaction(
            state,
            "expense",
            "entertainment",
            spend,
            "借酒消愁",
          );
        }
      }
      state.needs.hunger = Math.max(0, state.needs.hunger - 10);
      state.needs.happiness = Math.min(100, state.needs.happiness + 5);
      state.needs.fatigue = Math.min(100, state.needs.fatigue + 15);
      if (Random.chance(0.3)) {
        _contractIllness(state, "depression");
      }
      StateManager.addMessage(
        "🍶 你买了瓶酒一个人喝，花¥" + spend + "，但抑郁的风险在累积...",
        "warning",
      );
    }
  }

  return skipDay ? "skip_day" : null;
}

/** 让玩家患上疾病（复用，避免重复实现） */
function _contractIllness(state, illnessId) {
  var ill = ILLNESSES && ILLNESSES[illnessId];
  if (!ill) return;
  // 已有同种病不重复
  if (typeof hasIllness === "function" && hasIllness(state, illnessId)) return;
  state.status.illnesses = state.status.illnesses || [];
  state.status.illnesses.push({
    id: illnessId,
    contractedDay: state.player.day,
    severity: ill.severity || 1,
    treated: false,
  });
  // 兼容旧字段
  state.status.sick = true;
  StateManager.addMessage(
    "🤒 你得了" + ill.name + "！" + (ill.desc || ""),
    "danger",
  );
  // 肠胃炎计数（用于演化为胃溃疡）
  if (illnessId === "stomach_inflammation") {
    state.flags._habits = state.flags._habits || {};
    state.flags._habits.stomach_inflammationCount =
      (state.flags._habits.stomach_inflammationCount || 0) + 1;
  }
}

// ================================================================
//  百科自更新：参数从 CRITICAL_THRESHOLDS 自动派生
//  调阈值时无需手动改 wiki.js
// ================================================================
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.critical_needs = {
    id: "critical_needs",
    name: "状态危机系统",
    icon: "⚠️",
    brief: "饥饱/疲劳/卫生/心情低于阈值时强制选择，延期按阶梯式累积惩罚",
    version: "1.1.0",
    reference: "《大多数》生存张力",
    related: ["mechanics:illness_system", "mechanics:ap", "amenities:*"],
    sections: [
      {
        kind: "desc",
        text: "四大状态（饥饱/疲劳/卫生/心情）跌破阈值时，游戏强制玩家做出选择，而非任你慢慢死。",
      },
      {
        kind: "subhead",
        text: "📉 触发阈值（直接读 CRITICAL_THRESHOLDS）",
      },
      {
        kind: "list",
        items: function () {
          var out = [];
          for (var k in CRITICAL_THRESHOLDS) {
            if (!CRITICAL_THRESHOLDS.hasOwnProperty(k)) continue;
            var c = CRITICAL_THRESHOLDS[k];
            out.push(
              c.icon +
                " " +
                c.label +
                " " +
                (c.type === "low" ? "≤ " : "≥ ") +
                c.value,
            );
          }
          return out;
        },
      },
      { kind: "subhead", text: "🪟 弹窗选项" },
      {
        kind: "html",
        get: function () {
          return (
            "<p>系统列出周边最近的 3 个对应类型 " +
            _wkLink("amenities", null, "恢复点") +
            '（含旅行行动力），玩家可：</p><ul class="wiki-list">' +
            "<li><strong>立即去 XX</strong>：自动旅行 + 消费 + 补充状态</li>" +
            "<li><strong>后续自己再去</strong>：标记延期，今天结束时若仍未恢复，按阶梯式惩罚累积后果</li>" +
            "</ul>"
          );
        },
      },
      {
        kind: "subhead",
        text: "📊 延期惩罚阶梯（1.2 起改为阶梯式，非随机掷骰）",
      },
      {
        kind: "list",
        items: [
          "🍚 **饥饱**：第1次健康-3 / 第2次健康-8+概率肠胃炎 / 第3次饿晕（健康-15） / 第4次+送医急救",
          "😴 **疲劳**：第1次疲劳+5 / 第2次疲劳+15+概率过劳/失眠 / 第3次过劳晕倒 / 第4次+强制住院",
          "🛁 **卫生**：第1次心情-3 / 第2次概率患病+名气-1 / 第3次强制患病 / 第4次+多重感染",
          "😊 **心情**：第1次心情-5+疲劳+10 / 第2次心情-10+抑郁计数+3 / 第3次整夜失眠 / 第4次+概率重度抑郁",
        ],
      },
    ],
  };
}

// ====== 食材消耗（在家做饭）======

/**
 * 消耗烹饪食材：从库存中扣除所需食材
 * @param {Object} state - 游戏状态
 * @param {Object} amenity - amenity 定义（含 requiresIngredients: true）
 * @returns {{success: boolean, message: string, consumed: Array}}
 */
function consumeCookingIngredients(state, amenity) {
  // 兼容两种库存格式：
  //   1) state.inventory = [{ itemId, quantity }] (cooking.js 格式)
  //   2) state.inventory = { items: [{ id, qty }], capacity } (实际 state 格式)
  var inv = state.inventory;
  var isOldFormat = Array.isArray(inv);
  if (!inv)
    inv = state.inventory = isOldFormat ? [] : { items: [], capacity: 20 };
  if (!isOldFormat && !inv.items) inv.items = [];

  // 如果食谱指定了要 cookRecipe，就走全食谱流程（显示食谱选择）
  if (amenity.useRecipeSelection) {
    return { success: true, message: "打开食谱选择", useRecipeSelection: true };
  }

  // 默认食材消耗（在家做饭的基础食材组合）
  var defaultIngredients = [
    { itemId: "rice", amount: 1 },
    { itemId: "egg", amount: 1 },
    { itemId: "salt", amount: 1 },
    { itemId: "cooking_oil", amount: 1 },
  ];

  // 如果有自定义食材需求，使用自定义
  var ingredients = amenity.cookingIngredients || defaultIngredients;

  // 检查食材
  var missing = [];
  for (var i = 0; i < ingredients.length; i++) {
    var ing = ingredients[i];
    var found = null;
    if (isOldFormat) {
      for (var j = 0; j < inv.length; j++) {
        if (inv[j].itemId === ing.itemId) {
          found = inv[j];
          break;
        }
      }
    } else {
      for (var j = 0; j < inv.items.length; j++) {
        if (inv.items[j].id === ing.itemId) {
          found = inv.items[j];
          break;
        }
      }
    }
    if (!found || found.quantity < ing.amount) {
      var itemDef =
        typeof getItemById === "function" && getItemById(ing.itemId);
      missing.push({
        itemId: ing.itemId,
        itemName: itemDef ? itemDef.name : ing.itemId,
        icon: itemDef ? itemDef.icon : "📦",
        needed: ing.amount,
        have: found ? found.quantity : 0,
      });
    }
  }

  if (missing.length > 0) {
    var missingText = missing
      .map(function (m) {
        return m.icon + m.itemName + "(需" + m.needed + ", 有" + m.have + ")";
      })
      .join(", ");
    return {
      success: false,
      message: "食材不足：" + missingText,
      missing: missing,
    };
  }

  // 消耗食材
  var consumed = [];
  for (var i = 0; i < ingredients.length; i++) {
    var ing = ingredients[i];
    if (isOldFormat) {
      for (var j = 0; j < inv.length; j++) {
        if (inv[j].itemId === ing.itemId) {
          inv[j].quantity -= ing.amount;
          consumed.push({ itemId: ing.itemId, amount: ing.amount });
          if (inv[j].quantity <= 0) {
            inv.splice(j, 1);
            j--;
          }
          break;
        }
      }
    } else {
      for (var j = 0; j < inv.items.length; j++) {
        if (inv.items[j].id === ing.itemId) {
          inv.items[j].qty -= ing.amount;
          consumed.push({ itemId: ing.itemId, amount: ing.amount });
          if (inv.items[j].qty <= 0) {
            inv.items.splice(j, 1);
            j--;
          }
          break;
        }
      }
    }
  }

  return { success: true, message: "食材消耗成功", consumed: consumed };
}

// ====== 食谱选择界面 ======

/**
 * 检查玩家是否有足够食材做某个食谱（适配 state.inventory.items 格式）
 */
function _canCookRecipeByState(state, recipe) {
  var inv = state.inventory;
  if (!inv) return false;
  var items = inv.items || (Array.isArray(inv) ? inv : []);
  for (var i = 0; i < recipe.ingredients.length; i++) {
    var ing = recipe.ingredients[i];
    var found = null;
    for (var j = 0; j < items.length; j++) {
      // 兼容两种 key 名：id / itemId
      var fid = items[j].id || items[j].itemId;
      if (fid === ing.itemId) {
        found = items[j];
        break;
      }
    }
    var qty = found ? found.qty || found.quantity || 0 : 0;
    if (qty < ing.amount) return false;
  }
  return true;
}

/**
 * 从 state.inventory.items 格式消耗食材
 */
function _consumeIngredientsFromState(state, recipe) {
  var inv = state.inventory;
  if (!inv) return false;
  var items = inv.items || (Array.isArray(inv) ? inv : []);
  for (var i = 0; i < recipe.ingredients.length; i++) {
    var ing = recipe.ingredients[i];
    for (var j = 0; j < items.length; j++) {
      var fid = items[j].id || items[j].itemId;
      if (fid === ing.itemId) {
        if (items[j].qty !== undefined) items[j].qty -= ing.amount;
        else if (items[j].quantity !== undefined)
          items[j].quantity -= ing.amount;
        if ((items[j].qty || items[j].quantity || 0) <= 0) {
          items.splice(j, 1);
          j--;
        }
        break;
      }
    }
  }
  return true;
}

/**
 * 显示食谱选择弹窗（在家做饭）
 * @param {Object} state
 * @param {Object} amenity - selfhome_cook amenity 定义
 * @param {number} totalAp - 已计算的 AP 消耗
 * @param {number} cost - 现金消耗
 */
function showCookingRecipeModal(state, amenity, totalAp, cost) {
  // 获取烹饪等级
  var cookLevel = 1;
  if (typeof getCookingLevel === "function") {
    cookLevel = getCookingLevel(state);
  }

  // 获取可解锁的食谱
  var recipes =
    typeof getRecipesByLevel === "function"
      ? getRecipesByLevel(cookLevel)
      : typeof COOKING_RECIPES !== "undefined"
        ? COOKING_RECIPES
        : [];

  if (!recipes || recipes.length === 0) {
    if (typeof StateManager !== "undefined") {
      StateManager.addMessage("🍳 暂无可用食谱，请提升烹饪技能。", "warning");
    }
    return;
  }

  var html = '<div class="cooking-modal">';
  html += '<h2 style="margin:0 0 8px;font-size:16px;">🍳 在家做饭</h2>';
  html += '<p style="margin:0 0 12px;color:var(--text-muted);font-size:12px;">';
  html += "烹饪 Lv." + cookLevel + " · 可用食谱 " + recipes.length + " 道";
  html += " · 消耗 " + (totalAp || 10) + " 点行动力</p>";
  html += '<div style="max-height:400px;overflow-y:auto;">';

  for (var i = 0; i < recipes.length; i++) {
    var r = recipes[i];
    var canCook = _canCookRecipeByState(state, r);
    // 食材清单
    var ingHtml = [];
    for (var j = 0; j < r.ingredients.length; j++) {
      var ing = r.ingredients[j];
      var itemDef =
        typeof getItemById === "function" ? getItemById(ing.itemId) : null;
      var itemName = itemDef ? itemDef.name : ing.itemId;
      var itemIcon = itemDef ? itemDef.icon : "📦";
      // 检查玩家有多少
      var haveQty = 0;
      var invItems = (state.inventory && state.inventory.items) || [];
      for (var k = 0; k < invItems.length; k++) {
        var fid = invItems[k].id || invItems[k].itemId;
        if (fid === ing.itemId) {
          haveQty = invItems[k].qty || invItems[k].quantity || 0;
          break;
        }
      }
      var enough = haveQty >= ing.amount;
      ingHtml.push(
        (enough ? "✅" : "❌") +
          itemIcon +
          itemName +
          "×" +
          ing.amount +
          " <span style='color:" +
          (enough ? "var(--success)" : "var(--danger)") +
          ";font-size:10px;'>" +
          "有" +
          haveQty +
          "</span>",
      );
    }

    var buffDesc = [];
    if (r.hungerRestore) buffDesc.push("饱食+" + r.hungerRestore);
    if (r.effects) {
      var effLabels = {
        happiness: "心情",
        physique: "体质",
        intelligence: "智力",
        mental: "心智",
        agility: "敏捷",
        hygiene: "卫生",
        fatigue: "疲劳",
        health: "健康",
      };
      for (var ek in r.effects) {
        if (effLabels[ek])
          buffDesc.push(
            effLabels[ek] + (r.effects[ek] >= 0 ? "+" : "") + r.effects[ek],
          );
      }
    }

    html +=
      '<div style="border:1px solid ' +
      (canCook ? "var(--success)" : "var(--border)") +
      ";border-radius:8px;padding:10px;margin-bottom:8px;" +
      (canCook ? "cursor:pointer;" : "opacity:0.6;") +
      '" data-recipe="' +
      r.id +
      '" class="cooking-recipe-card"' +
      (canCook ? " onclick=\"executeCookingRecipe('" + r.id + "')\"" : "") +
      ">";
    html += '<div style="font-weight:600;font-size:14px;margin-bottom:4px;">';
    html += r.icon + " " + r.name;
    html +=
      ' <span style="font-size:11px;color:var(--text-muted);font-weight:400;">Lv.' +
      r.level +
      "</span>";
    html += "</div>";
    html +=
      '<div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px;">';
    html += r.desc + (buffDesc.length ? " · " + buffDesc.join(" ") : "");
    html += "</div>";
    // 烹饪技能门控：价格预览
    if (typeof buildCookingPreview === "function") {
      var cookingPreview = buildCookingPreview(state, r);
      if (cookingPreview) {
        html += cookingPreview;
      }
    }
    html +=
      '<div style="font-size:10px;color:var(--text-muted);">' +
      ingHtml.join(" | ") +
      "</div>";
    html += "</div>";
  }

  html += "</div>"; // scrollable div

  // 如果模式窗存在就使用，否则用 alert
  if (typeof showModal === "function") {
    showModal({
      title: "📋 重要提示",
      body: html,
      buttons: [],
    });
  } else if (typeof showCustomModal === "function") {
    showCustomModal(html);
  } else {
    // 兜底：直接追加到 body
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML =
      '<div class="modal-box" style="max-width:520px;">' +
      html +
      '<div style="text-align:center;margin-top:12px;">' +
      '<button class="btn btn-secondary" onclick="this.closest(\'.modal-overlay\').remove()">取消</button>' +
      "</div></div>";
    document.body.appendChild(overlay);
  }
}

/**
 * 执行已选的食谱
 */
function executeCookingRecipe(recipeId) {
  var state =
    typeof StateManager !== "undefined" ? StateManager.getState() : null;
  if (!state) return;

  var recipe =
    typeof getRecipeById === "function" ? getRecipeById(recipeId) : null;
  if (!recipe) {
    StateManager.addMessage("❌ 食谱不存在。", "danger");
    return;
  }

  // 检查食材
  if (!_canCookRecipeByState(state, recipe)) {
    StateManager.addMessage(
      "❌ 食材不足，无法制作「" + recipe.name + "」。",
      "warning",
    );
    return;
  }

  // 消耗食材
  _consumeIngredientsFromState(state, recipe);

  // 应用效果
  if (recipe.hungerRestore) {
    state.needs.hunger = Math.min(
      100,
      state.needs.hunger + recipe.hungerRestore,
    );
  }
  if (recipe.effects) {
    for (var key in recipe.effects) {
      if (!recipe.effects.hasOwnProperty(key)) continue;
      var val = recipe.effects[key];
      if (key === "happiness")
        state.needs.happiness = Math.min(100, state.needs.happiness + val);
      else if (key === "fatigue")
        state.needs.fatigue = Math.max(0, state.needs.fatigue + val);
      else if (key === "health")
        state.status.health = Math.min(
          100,
          Math.max(0, state.status.health + val),
        );
      else if (key === "physique")
        state.player.physique = Math.min(
          100,
          (state.player.physique || 0) + val,
        );
      else if (key === "intelligence")
        state.player.intelligence = Math.min(
          100,
          (state.player.intelligence || 0) + val,
        );
      else if (key === "mental")
        state.player.mental = Math.min(100, (state.player.mental || 0) + val);
      else if (key === "agility")
        state.player.agility = Math.min(100, (state.player.agility || 0) + val);
      else if (key === "hygiene")
        state.needs.hygiene = Math.min(100, state.needs.hygiene + val);
    }
  }

  // 记录烹饪经验和习惯
  if (typeof addCookingExp === "function")
    addCookingExp(state, 10 + recipe.level * 5);
  if (typeof onCookingCompleted === "function")
    onCookingCompleted(state, recipe);
  state.flags._cookingCount = (state.flags._cookingCount || 0) + 1;

  // 清除延期标记
  if (state.flags._deferred) delete state.flags._deferred.hunger;

  // 消耗 AP
  if (typeof consumeAP === "function") {
    consumeAP(10);
  }

  // 营养均衡标记
  state.flags._habits = state.flags._habits || {};
  state.flags._habits.junkFoodMeals = Math.max(
    0,
    (state.flags._habits.junkFoodMeals || 0) - 2,
  );

  StateManager.addMessage(
    "🍳 你烹饪了「" +
      recipe.name +
      "」！" +
      (recipe.hungerRestore ? "饱食+" + recipe.hungerRestore : ""),
    "success",
  );

  // 关闭弹窗
  var overlay = document.querySelector(".modal-overlay");
  if (overlay) overlay.remove();

  if (typeof renderAll === "function") renderAll();
}

// 全局挂载
if (typeof window !== "undefined") {
  window.showCookingRecipeModal = showCookingRecipeModal;
  window.executeCookingRecipe = executeCookingRecipe;
}
