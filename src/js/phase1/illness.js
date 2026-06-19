/**
 * Illness 系统 — 长期不良习惯 → 命名疾病
 *
 * 三大循环：
 *   1. 每日 tickHabits(state) — 根据当日 needs 更新各种 streak/counter。
 *   2. 每日 rollDailyIllness(state) — 检查 habit 阈值，按 severity 决定的概率患病。
 *   3. 每日 tickIllnessDecay(state) — 已患疾病按 naturalCureDays 自然恢复。
 *
 * 症状叠加：
 *   - getIllnessStatusMods(state) — 返回 {health, hunger, fatigue, ...} 累加值
 *   - 由 applyStatusInteractions 调用，叠加到 needs 上
 *   - getIllnessAttrDebuffs(state) — 返回 {physiqueDebuff, mentalDebuff, ...}
 *   - 由 getEffectiveStats 调用，进一步打折
 *
 * 治疗：
 *   - openClinicModal() 在医院解锁的"看病"行动里调起
 *   - 选病种 + 选档次（药店便宜慢 / 医院贵快）
 */

// ====== 每日习惯追踪 ======

/** 每日结算时调用：更新 streak/counter */
function tickHabits(state) {
  var n = state.needs;
  state.flags._habits = state.flags._habits || {
    junkFoodMeals: 0,
    lowHungerStreak: 0,
    lowHygieneStreak: 0,
    lowHappinessStreak: 0,
    highFatigueStreak: 0,
    lateNightActions: 0,
    stomach_inflammationCount: 0,
  };
  var h = state.flags._habits;

  // 连续低 hunger
  if (n.hunger < 25) h.lowHungerStreak = (h.lowHungerStreak || 0) + 1;
  else h.lowHungerStreak = 0;

  // 连续低 hygiene
  if (n.hygiene < 30) h.lowHygieneStreak = (h.lowHygieneStreak || 0) + 1;
  else h.lowHygieneStreak = 0;

  // 连续低 happiness
  if (n.happiness < 20) h.lowHappinessStreak = (h.lowHappinessStreak || 0) + 1;
  else h.lowHappinessStreak = 0;

  // 连续高 fatigue
  if (n.fatigue > 80) h.highFatigueStreak = (h.highFatigueStreak || 0) + 1;
  else h.highFatigueStreak = 0;
}

// ====== 每日患病判定 ======

/** 检查所有疾病的触发条件，按概率患病 */
function rollDailyIllness(state) {
  if (!ILLNESSES) return;
  state.flags._habits = state.flags._habits || {};
  var h = state.flags._habits;

  for (var key in ILLNESSES) {
    if (!ILLNESSES.hasOwnProperty(key)) continue;
    var ill = ILLNESSES[key];
    if (!ill.triggerHabit) continue;

    // 已有该病则跳过
    if (hasIllness(state, key)) continue;

    // 检查 triggerHabit 所有条件
    var conditionsMet = true;
    var habitName = null;
    for (var hk in ill.triggerHabit) {
      if (!ill.triggerHabit.hasOwnProperty(hk)) continue;
      var threshold = ill.triggerHabit[hk];
      var actual;
      if (hk === "age") actual = state.player.age || 20;
      else actual = h[hk] || 0;
      if (actual < threshold) {
        conditionsMet = false;
        break;
      }
      if (!habitName) habitName = hk;
    }
    if (!conditionsMet) continue;

    // 概率掷骰
    var ch = ill.triggerChance || 0.5;
    if (Math.random() >= ch) continue;

    // 患病！
    _addIllness(state, key);
    state.flags._everGotSick = true; // 成就追踪

    // 部分清零相关 habit（避免立刻再得一次）
    if (habitName === "lowHungerStreak")
      h.lowHungerStreak = Math.floor(h.lowHungerStreak / 2);
    else if (habitName === "lowHygieneStreak")
      h.lowHygieneStreak = Math.floor(h.lowHygieneStreak / 2);
    else if (habitName === "lowHappinessStreak")
      h.lowHappinessStreak = Math.floor(h.lowHappinessStreak / 2);
    else if (habitName === "highFatigueStreak")
      h.highFatigueStreak = Math.floor(h.highFatigueStreak / 2);
    else if (habitName === "junkFoodMeals")
      h.junkFoodMeals = Math.max(0, h.junkFoodMeals - 5);
    else if (habitName === "lateNightActions")
      h.lateNightActions = Math.max(0, h.lateNightActions - 4);
  }
}

function _addIllness(state, illnessId) {
  var ill = ILLNESSES[illnessId];
  if (!ill) return;
  state.status.illnesses = state.status.illnesses || [];
  state.status.illnesses.push({
    id: illnessId,
    contractedDay: state.player.day,
    severity: ill.severity || 1,
    treated: false,
  });
  // 兼容旧字段（让现有代码能继续读 sick）
  state.status.sick = true;

  StateManager.addMessage(
    (ill.icon || "🤒") + " 你患上了" + ill.name + "！" + (ill.desc || ""),
    "danger",
  );

  if (illnessId === "stomach_inflammation") {
    state.flags._habits = state.flags._habits || {};
    state.flags._habits.stomach_inflammationCount =
      (state.flags._habits.stomach_inflammationCount || 0) + 1;
  }
}

// ====== 每日疾病结算 ======

/** 每日：自然恢复 / 慢性病按月扣费 / 累计症状副作用 */
function tickIllnessDecay(state) {
  if (!state.status.illnesses) state.status.illnesses = [];
  var remaining = [];
  for (var i = 0; i < state.status.illnesses.length; i++) {
    var inst = state.status.illnesses[i];
    var ill = ILLNESSES[inst.id];
    if (!ill) continue;

    // 慢性病不会自然好（hypertension）
    if (ill.isChronic) {
      _tickChronic(state, inst, ill);
      remaining.push(inst);
      continue;
    }

    // 已治疗：加速康复
    var daysSince = state.player.day - inst.contractedDay;
    var minDays =
      ill.naturalCureDays && ill.naturalCureDays[0]
        ? ill.naturalCureDays[0]
        : 5;
    var maxDays =
      ill.naturalCureDays && ill.naturalCureDays[1]
        ? ill.naturalCureDays[1]
        : 8;
    if (inst.treated) {
      // 治疗后康复时间减半
      minDays = Math.ceil(minDays / 2);
      maxDays = Math.ceil(maxDays / 2);
    }

    // 营养不良需要 nutritious 餐才能康复
    if (ill.requiresNutrition && !inst.treated) {
      var recentNutrition =
        (state.flags._habits && state.flags._habits.junkFoodMeals) || 0;
      if (recentNutrition >= 3) {
        // 还在吃垃圾食品，不康复
        remaining.push(inst);
        continue;
      }
    }

    // 累计症状（health 持续掉、需要的 needs 加成）
    if (ill.symptom) {
      if (ill.symptom.health) {
        state.status.health = Math.max(
          0,
          state.status.health + ill.symptom.health,
        );
      }
      // 随机晕厥（高血压）
      if (
        ill.symptom.randomFaintCh &&
        Math.random() < ill.symptom.randomFaintCh
      ) {
        state.needs.fatigue = Math.min(100, state.needs.fatigue + 20);
        StateManager.addMessage(
          "💢 " + ill.name + "突发，你眩晕了一下。",
          "warning",
        );
      }
    }

    // 自然康复判定
    if (daysSince >= minDays) {
      var cureChance = (daysSince - minDays + 1) / (maxDays - minDays + 1);
      if (Math.random() < cureChance) {
        StateManager.addMessage(
          (ill.icon || "🤒") + " 你的" + ill.name + "好了。",
          "success",
        );
        continue; // 不放回 remaining
      }
    }
    remaining.push(inst);
  }
  state.status.illnesses = remaining;

  // 派生兼容字段
  state.status.sick = state.status.illnesses.length > 0;
}

function _tickChronic(state, inst, ill) {
  // 慢性病按月（30天）扣费；不交则发作
  var lastPaid = state.flags._hypertensionMonthlyPaid || inst.contractedDay;
  var due = state.player.day - lastPaid >= 30;
  if (due) {
    var monthly =
      ill.treatCost && ill.treatCost.hospital_monthly
        ? ill.treatCost.hospital_monthly
        : 200;
    if (state.resources.cash >= monthly) {
      state.resources.cash -= monthly;
      state.flags._hypertensionMonthlyPaid = state.player.day;
      if (typeof addDailyTransaction === "function") {
        addDailyTransaction(
          state,
          "expense",
          "medical",
          monthly,
          ill.name + "月费",
        );
      }
      StateManager.addMessage(
        "💊 " + ill.name + "月费 ¥" + monthly + " 已自动扣除。",
        "info",
      );
    } else {
      // 没钱→症状加重
      state.status.health = Math.max(0, state.status.health - 5);
      StateManager.addMessage(
        "⚠️ 没钱付" + ill.name + "月费，症状加重，健康-5！",
        "danger",
      );
    }
  }
}

// ====== 症状对外接口（给 interactions.js 调用）======

/** 累计所有疾病症状对 needs/health 的每日影响（applyStatusInteractions 调用） */
function getIllnessNeedsImpact(state) {
  var impact = { hunger: 0, fatigue: 0, hygiene: 0, happiness: 0 };
  if (!state.status.illnesses) return impact;
  for (var i = 0; i < state.status.illnesses.length; i++) {
    var ill = ILLNESSES[state.status.illnesses[i].id];
    if (!ill || !ill.symptom) continue;
    if (ill.symptom.hunger) impact.hunger += ill.symptom.hunger;
    if (ill.symptom.fatigue) impact.fatigue += ill.symptom.fatigue;
    if (ill.symptom.hygiene) impact.hygiene += ill.symptom.hygiene;
    if (ill.symptom.happiness) impact.happiness += ill.symptom.happiness;
  }
  return impact;
}

/** 累计所有疾病对有效属性的扣减（getEffectiveStats 调用） */
function getIllnessAttrDebuffs(state) {
  var d = {
    physique: 0,
    intelligence: 0,
    agility: 0,
    mental: 0,
    apMult: 0,
    fatigueRecoveryMult: 1.0,
  };
  if (!state.status.illnesses) return d;
  for (var i = 0; i < state.status.illnesses.length; i++) {
    var ill = ILLNESSES[state.status.illnesses[i].id];
    if (!ill || !ill.symptom) continue;
    if (ill.symptom.physiqueDebuff) d.physique += ill.symptom.physiqueDebuff;
    if (ill.symptom.intelligenceDebuff)
      d.intelligence += ill.symptom.intelligenceDebuff;
    if (ill.symptom.agilityDebuff) d.agility += ill.symptom.agilityDebuff;
    if (ill.symptom.mentalDebuff) d.mental += ill.symptom.mentalDebuff;
    if (ill.symptom.apMult) d.apMult += ill.symptom.apMult;
    if (ill.symptom.fatigueRecoveryMult)
      d.fatigueRecoveryMult *= ill.symptom.fatigueRecoveryMult;
  }
  return d;
}

// ====== 治疗 UI ======

/** 打开诊所 / 看病弹窗（在医院解锁的行动里调用） */
function openClinicModal() {
  var state = StateManager.getState();
  var illnesses = state.status.illnesses || [];
  if (illnesses.length === 0) {
    showModal({
      title: "🏥 医院",
      body: '<p style="font-size:13px;line-height:1.7;">医生说：你目前没有患病，注意保持健康习惯就好。</p>',
      buttons: [{ text: "好的", cls: "btn-primary" }],
    });
    return;
  }

  var html =
    '<div style="font-size:13px;line-height:1.7;">医生帮你检查了一下，你目前有以下疾病：</div>';
  html +=
    '<div style="margin-top:10px;display:flex;flex-direction:column;gap:8px;">';
  for (var i = 0; i < illnesses.length; i++) {
    var inst = illnesses[i];
    var ill = ILLNESSES[inst.id];
    if (!ill) continue;
    var daysSince = state.player.day - inst.contractedDay;
    var pharCost = (ill.treatCost && ill.treatCost.pharmacy) || null;
    var hospCost = (ill.treatCost && ill.treatCost.hospital) || null;

    html +=
      '<div style="padding:8px;background:var(--bg-input);border-radius:4px;border-left:3px solid var(--danger);">';
    html +=
      '<div style="font-weight:600;">' +
      (ill.icon || "🤒") +
      " " +
      ill.name +
      ' <span style="font-size:11px;color:var(--text-muted);font-weight:normal;">已患' +
      daysSince +
      "天</span></div>";
    html +=
      '<div style="font-size:11px;color:var(--text-secondary);margin-top:4px;">' +
      (ill.desc || "") +
      "</div>";
    html += '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">';
    if (pharCost) {
      html +=
        '<button class="btn btn-sm" data-treat="pharmacy" data-ill="' +
        inst.id +
        '">💊 药店治疗 ¥' +
        pharCost +
        "</button>";
    }
    if (hospCost) {
      html +=
        '<button class="btn btn-sm btn-primary" data-treat="hospital" data-ill="' +
        inst.id +
        '">🏥 医院治疗 ¥' +
        hospCost +
        "</button>";
    }
    if (inst.treated) {
      html +=
        '<span style="font-size:11px;color:var(--success);">✓ 已治疗，等待康复</span>';
    }
    html += "</div></div>";
  }
  html += "</div>";
  html +=
    '<div style="margin-top:10px;font-size:11px;color:var(--text-muted);">药店便宜恢复慢，医院贵但效果立竿见影。</div>';

  showModal({
    title: "🏥 看病",
    body: html,
    buttons: [{ text: "关闭", cls: "" }],
  });

  // 给治疗按钮挂监听
  setTimeout(function () {
    var btns = document.querySelectorAll("[data-treat]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function (e) {
        var tier = e.currentTarget.getAttribute("data-treat");
        var illId = e.currentTarget.getAttribute("data-ill");
        treatIllness(illId, tier);
        // 关闭并重开（刷新列表）
        var overlay = document.querySelector(".modal-overlay");
        if (overlay) document.body.removeChild(overlay);
        openClinicModal();
      });
    }
  }, 0);
}

function treatIllness(illnessId, tier) {
  var state = StateManager.getState();
  var ill = ILLNESSES[illnessId];
  if (!ill) return;
  var cost = (ill.treatCost && ill.treatCost[tier]) || 0;
  if (cost === 0 && tier === "pharmacy") {
    StateManager.addMessage("💊 此病无法仅靠药店治疗，请去医院。", "warning");
    return;
  }
  if (state.resources.cash < cost) {
    StateManager.addMessage("💸 现金不足 ¥" + cost + "。", "warning");
    return;
  }
  state.resources.cash -= cost;
  if (typeof addDailyTransaction === "function") {
    addDailyTransaction(state, "expense", "medical", cost, ill.name + "治疗");
  }

  // 找到该病实例并标记
  for (var i = 0; i < state.status.illnesses.length; i++) {
    var inst = state.status.illnesses[i];
    if (inst.id === illnessId) {
      if (tier === "hospital") {
        // 医院立刻康复
        state.status.illnesses.splice(i, 1);
        StateManager.addMessage(
          "🏥 你接受了" +
            ill.name +
            "的医院治疗（¥" +
            cost +
            "），症状立刻消失。",
          "success",
        );
      } else {
        // 药店：标记 treated=true，自然康复时间减半
        inst.treated = true;
        StateManager.addMessage(
          "💊 你买了" + ill.name + "的药（¥" + cost + "），症状会逐渐减轻。",
          "info",
        );
      }
      break;
    }
  }

  // 更新派生兼容字段
  state.status.sick = state.status.illnesses.length > 0;
}
