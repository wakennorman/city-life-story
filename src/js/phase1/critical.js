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
 *   hunger     ≤ 12   再不吃要饿晕
 *   fatigue    ≥ 88   累得快倒下
 *   hygiene    ≤ 10   脏到要生病
 *   happiness  ≤ 10   抑郁到崩溃
 */

// ====== 阈值配置 ======
var CRITICAL_THRESHOLDS = {
  hunger: {
    type: "low",
    value: 12,
    amenityType: "food",
    label: "饥饱",
    icon: "🍚",
  },
  fatigue: {
    type: "high",
    value: 88,
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
      "AP";

    buttons.push({
      text: btnText,
      cls: affordable && hasAp ? "btn-primary" : "",
      _disabled: !affordable || !hasAp,
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
    cls: "",
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
    if (!actualLoc) {
      StateManager.addMessage("❌ 你还没有自住房。", "warning");
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
      "⚡ 行动力不足（需要 " + totalAp + " AP）。",
      "warning",
    );
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
      if (Math.random() < ch) {
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

// ====== 延期惩罚（endDay 调用） ======

function applyDeferredCriticalPunishments(state) {
  if (!state.flags._deferred) return null;

  var skipDay = false;
  var keys = Object.keys(state.flags._deferred);
  for (var i = 0; i < keys.length; i++) {
    var need = keys[i];
    var deferDay = state.flags._deferred[need];
    if (deferDay !== state.player.day) continue; // 不是当日延期则跳过
    if (!isCriticalNeed(state, need)) continue; // 已经回血了不用罚

    var rolled = _punishByNeed(state, need);
    if (rolled === "skip_day") skipDay = true;
  }

  // 清空当日延期标记（无论是否处罚）
  state.flags._deferred = {};

  return skipDay ? "skip_day" : null;
}

function _punishByNeed(state, need) {
  var r = Math.random();
  if (need === "hunger") {
    if (r < 0.3) {
      // 饿晕街头
      state.status.health = Math.max(0, state.status.health - 10);
      state.needs.hunger = 8;
      StateManager.addMessage(
        "💀 你饿晕在街头！醒来已是深夜，健康-10。",
        "danger",
      );
      return "skip_day";
    } else if (r < 0.5) {
      // 晕送医院
      var fee = 300 + Math.floor(Math.random() * 700);
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
      state.status.health = Math.max(0, state.status.health - 5);
      state.flags._everHospitalized = true; // 成就追踪
      StateManager.addMessage(
        "🏥 你饿晕被送进医院！花了¥" + fee + "急救费。明天醒来。",
        "danger",
      );
      return "skip_day";
    } else if (r < 0.8) {
      // 路人施舍
      state.needs.hunger = Math.min(100, state.needs.hunger + 20);
      state.needs.happiness = Math.min(100, state.needs.happiness + 8);
      StateManager.addMessage(
        "🥺 一位好心阿姨给了你两个馒头和一瓶水，饥饱+20，心情+8。",
        "info",
      );
    } else {
      state.needs.hunger = Math.max(0, state.needs.hunger - 5);
      StateManager.addMessage("😣 强忍饥饿撑过了一天，但更虚了。", "warning");
    }
  } else if (need === "fatigue") {
    if (r < 0.4) {
      // 过劳晕倒
      state.needs.fatigue = 20;
      state.needs.happiness = Math.max(0, state.needs.happiness - 15);
      state.status.health = Math.max(0, state.status.health - 5);
      state.flags._everCollapsed = true; // 成就追踪
      StateManager.addMessage(
        "😵 你累倒在路边！睡了一觉，疲劳重置但心情和健康受损。",
        "danger",
      );
      return "skip_day";
    } else if (r < 0.6) {
      // 引发疾病（过劳综合症 or 失眠）
      _contractIllness(state, Math.random() < 0.5 ? "overwork" : "insomnia");
    } else {
      state.needs.fatigue = Math.min(100, state.needs.fatigue);
      StateManager.addMessage(
        "🥱 强撑了一天，但效率惨淡，明天的状态会更糟。",
        "warning",
      );
    }
  } else if (need === "hygiene") {
    if (r < 0.5) {
      _contractIllness(state, Math.random() < 0.5 ? "skin_infection" : "cold");
    } else if (r < 0.8) {
      state.needs.happiness = Math.max(0, state.needs.happiness - 10);
      state.player.fame = Math.max(0, (state.player.fame || 0) - 2);
      StateManager.addMessage(
        "🦠 路人捂鼻避让，你听到嘲笑，心情-10、名气-2。",
        "warning",
      );
    } else {
      StateManager.addMessage(
        "🦠 卫生告急但暂无大碍，明天一定要洗澡了。",
        "warning",
      );
    }
  } else if (need === "happiness") {
    if (r < 0.3) {
      // 累积抑郁
      state.flags._habits = state.flags._habits || {};
      state.flags._habits.lowHappinessStreak =
        (state.flags._habits.lowHappinessStreak || 0) + 3;
      StateManager.addMessage(
        "🌧️ 心情持续低落，抑郁的种子在心里发芽...",
        "danger",
      );
    } else if (r < 0.6) {
      // 整夜失眠
      state.needs.fatigue = Math.min(100, state.needs.fatigue + 30);
      StateManager.addMessage("😴 整夜失眠，疲劳+30，明天会很难受。", "danger");
    } else if (r < 0.8) {
      // 借酒消愁
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
      state.needs.happiness = Math.min(100, state.needs.happiness + 10);
      StateManager.addMessage(
        "🍶 你买了瓶酒一个人喝，花¥" + spend + "，饥饱-10但心情好了点。",
        "warning",
      );
    } else {
      StateManager.addMessage(
        "😔 又熬过了一个难熬的夜，但伤痕累积。",
        "warning",
      );
    }
  }
  return null;
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
    brief: "饥饱/疲劳/卫生/心情低于阈值时强制选择，延期会昏倒/送医",
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
            '（含旅行 AP），玩家可：</p><ul class="wiki-list">' +
            "<li><strong>立即去 XX</strong>：自动旅行 + 消费 + 补充状态</li>" +
            "<li><strong>后续自己再去</strong>：标记延期，今天结束时若仍未恢复，按概率触发昏倒/送医/路人施舍</li>" +
            "</ul>"
          );
        },
      },
      {
        kind: "subhead",
        text: "🎲 延期惩罚（endDay 时按维度差异化掷骰）",
      },
      {
        kind: "list",
        items: [
          "🍚 饥饱临界：30% 饿晕街头 / 20% 送医院（¥300-1000）/ 30% 路人施舍 / 20% 硬撑",
          "😴 疲劳临界：40% 过劳晕倒 / 20% 引发疾病（过劳综合症或失眠）/ 40% 效率惨淡",
          "🛁 卫生临界：50% 生病（皮肤感染或感冒）/ 30% 名气-2 / 20% 没事",
          "😊 心情临界：30% 累积抑郁 / 30% 整夜失眠 / 20% 借酒消愁 / 20% 硬撑",
        ],
      },
    ],
  };
}
