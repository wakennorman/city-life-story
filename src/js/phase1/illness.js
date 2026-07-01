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
    // 疾病演化追踪：每种病治愈/痊愈的次数
    gastritisCount: 0,
    depressionCount: 0,
    coldCount: 0,
    pneumoniaCount: 0,
    malnutritionCount: 0,
    insomniaCount: 0,
    overworkCount: 0,
    // 特殊习惯
    officeWorkDays: 0,
    hungerHighStreak: 0,
    healthUnder30: 0,
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

  // 连续高 hunger（肥胖风险）
  if (n.hunger > 80) h.hungerHighStreak = (h.hungerHighStreak || 0) + 1;
  else h.hungerHighStreak = 0;

  // 健康<30 天数
  if (state.status && state.status.health < 30)
    h.healthUnder30 = (h.healthUnder30 || 0) + 1;
  else h.healthUnder30 = 0;

  // 办公室工作天数（由外部调用累加）
  // tickOfficeWorkDays 在 daily_pipeline 中调用

  // 疾病演化计数：已痊愈的疾病计入历史
  // 在 tickIllnessDecay 中，当疾病自然康复时调用 recordIllnessCure
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
    // 消费点：城市服务·社区免费体检 medical.healthCheckDone → 建立健康基线，降低大病（severity≥4 或危急重症）触发概率
    if (
      state.medical &&
      state.medical.healthCheckDone &&
      (ill.isCritical || (ill.severity || 1) >= 4)
    ) {
      ch *= 0.5;
    }
    if (!Random.chance(ch)) continue;

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

  var msg = (ill.icon || "🤒") + " 你患上了" + ill.name + "！";
  if (ill.isEvolution) {
    msg += "（由既往疾病演化而来）";
  }
  if (ill.isCritical) {
    msg += " ⚠️ 危急重症！";
  }
  msg += " " + (ill.desc || "");

  StateManager.addMessage(msg, "danger");

  // 追踪病史计数（用于演化链）- 患病时计数
  state.flags._habits = state.flags._habits || {};
  var evolutionCountMap = {
    cold: "coldCount",
    stomach_inflammation: "stomach_inflammationCount",
    gastritis: "gastritisCount",
    depression: "depressionCount",
    pneumonia: "pneumoniaCount",
    malnutrition: "malnutritionCount",
    insomnia: "insomniaCount",
    overwork: "overworkCount",
  };
  if (evolutionCountMap[illnessId]) {
    var countKey = evolutionCountMap[illnessId];
    state.flags._habits[countKey] = (state.flags._habits[countKey] || 0) + 1;
  }
}

/** 记录疾病痊愈（用于演化链追踪） */
function recordIllnessCure(state, illnessId) {
  var ill = ILLNESSES[illnessId];
  if (!ill) return;
  var h = (state.flags._habits = state.flags._habits || {});

  // 将痊愈的疾病计入演化历史
  if (illnessId === "cold") h.coldCount = (h.coldCount || 0) + 1;
  else if (illnessId === "stomach_inflammation")
    h.stomach_inflammationCount = (h.stomach_inflammationCount || 0) + 1;
  else if (illnessId === "gastritis")
    h.gastritisCount = (h.gastritisCount || 0) + 1;
  else if (illnessId === "depression")
    h.depressionCount = (h.depressionCount || 0) + 1;
  else if (illnessId === "pneumonia")
    h.pneumoniaCount = (h.pneumoniaCount || 0) + 1;
  else if (illnessId === "malnutrition")
    h.malnutritionCount = (h.malnutritionCount || 0) + 1;
  else if (illnessId === "insomnia")
    h.insomniaCount = (h.insomniaCount || 0) + 1;
  else if (illnessId === "overwork")
    h.overworkCount = (h.overworkCount || 0) + 1;
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
        Random.chance(ill.symptom.randomFaintCh)
      ) {
        state.needs.fatigue = Math.min(100, state.needs.fatigue + 20);
        StateManager.addMessage(
          "💢 " + ill.name + "突发，你眩晕了一下。",
          "warning",
        );
      }

      // 随机吐血（胃癌）
      if (
        ill.symptom.randomVomitCh &&
        Random.chance(ill.symptom.randomVomitCh)
      ) {
        state.status.health = Math.max(0, state.status.health - 3);
        StateManager.addMessage(
          "🩸 " + ill.name + "发作，你吐了血，健康-3！",
          "danger",
        );
      }

      // 幻觉（重度失眠）
      if (
        ill.symptom.hallucinationCh &&
        Random.chance(ill.symptom.hallucinationCh)
      ) {
        StateManager.addMessage(
          "👻 " + ill.name + "让你产生了幻觉，精神恍惚。",
          "warning",
        );
      }

      // 猝死风险检测
      if (
        ill.symptom.dailyDeathChance &&
        Random.chance(ill.symptom.dailyDeathChance)
      ) {
        StateManager.addMessage(
          "💔 " + ill.name + "导致猝死！你的心脏停止了跳动。",
          "danger",
        );
        state.player.alive = false;
        state.status.health = 0;
        // 游戏结束处理由外部接管
        continue;
      }

      // 头晕（贫血）
      if (ill.symptom.dizzinessCh && Random.chance(ill.symptom.dizzinessCh)) {
        state.needs.fatigue += 5;
        StateManager.addMessage(
          "😵 " + ill.name + "让你头晕目眩，疲劳+5。",
          "warning",
        );
      }
    }

    // 自然康复判定
    if (daysSince >= minDays) {
      var cureChance = (daysSince - minDays + 1) / (maxDays - minDays + 1);
      if (Random.chance(cureChance)) {
        StateManager.addMessage(
          (ill.icon || "🤒") + " 你的" + ill.name + "好了。",
          "success",
        );
        // 记录痊愈，用于演化链追踪
        recordIllnessCure(state, inst.id);
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
  var lastPaid = state.flags._chronicMonthlyPaid || inst.contractedDay;
  var due = state.player.day - lastPaid >= 30;
  if (due) {
    var monthly =
      (typeof ill.treatCostMonthly === "number" && ill.treatCostMonthly) ||
      (ill.treatCost && ill.treatCost.hospital_monthly) ||
      200;
    if (state.resources.cash >= monthly) {
      state.resources.cash -= monthly;
      state.flags._chronicMonthlyPaid = state.player.day;
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
  var impact = { hunger: 0, fatigue: 0, hygiene: 0, happiness: 0, health: 0 };
  if (!state.status.illnesses) return impact;
  for (var i = 0; i < state.status.illnesses.length; i++) {
    var ill = ILLNESSES[state.status.illnesses[i].id];
    if (!ill || !ill.symptom) continue;
    if (ill.symptom.hunger) impact.hunger += ill.symptom.hunger;
    if (ill.symptom.fatigue) impact.fatigue += ill.symptom.fatigue;
    if (ill.symptom.hygiene) impact.hygiene += ill.symptom.hygiene;
    if (ill.symptom.happiness) impact.happiness += ill.symptom.happiness;
    if (ill.symptom.health) impact.health += ill.symptom.health;
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

/** 每日累加办公室工作天数（由 daily_pipeline 调用） */
function tickOfficeWorkDays(state) {
  if (state.corporate && state.corporate.company) {
    var jobDef = getJobById && getJobById(state.corporate.jobId);
    if (jobDef && (jobDef.type === "office" || jobDef.type === "corp")) {
      state.flags._habits = state.flags._habits || {};
      state.flags._habits.officeWorkDays =
        (state.flags._habits.officeWorkDays || 0) + 1;
    }
  }
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

// ====== 疾病演化提示 ======

/** 检查疾病演化风险（每日结算时调用） */
function checkEvolutionRisk(state) {
  if (!ILLNESSES || !state.status || !state.status.illnesses) return;
  var illnesses = state.status.illnesses;
  var warnedEvolution = state.flags._evolutionWarningShown || {};

  for (var i = 0; i < illnesses.length; i++) {
    var inst = illnesses[i];
    var ill = ILLNESSES[inst.id];
    if (!ill || !ill.evolvesTo || ill.evolvesTo.length === 0) continue;

    // 检查演化条件是否接近满足
    var h = state.flags._habits || {};
    for (var ei = 0; ei < ill.evolvesTo.length; ei++) {
      var targetId = ill.evolvesTo[ei];
      var targetIll = ILLNESSES[targetId];
      if (!targetIll || !targetIll.triggerHabit) continue;

      // 检查每个触发条件
      var riskLevel = 0; // 0=无风险, 1=低风险, 2=中风险, 3=高风险
      var maxThreshold = 0;
      var closestHabit = null;

      for (var hk in targetIll.triggerHabit) {
        if (!targetIll.triggerHabit.hasOwnProperty(hk)) continue;
        var threshold = targetIll.triggerHabit[hk];
        var actual = h[hk] || 0;
        if (hk === "age") actual = state.player.age || 20;

        maxThreshold = Math.max(maxThreshold, threshold);
        var ratio = actual / threshold;

        if (ratio >= 0.7) riskLevel = Math.max(riskLevel, 3);
        else if (ratio >= 0.5) riskLevel = Math.max(riskLevel, 2);
        else if (ratio >= 0.3) riskLevel = Math.max(riskLevel, 1);

        if (ratio >= 0.3 && (!closestHabit || ratio > closestHabit.ratio)) {
          closestHabit = {
            habit: hk,
            actual: actual,
            threshold: threshold,
            ratio: ratio,
          };
        }
      }

      // 只显示高风险提示（避免刷屏）
      if (riskLevel >= 2 && !warnedEvolution[inst.id + "_" + targetId]) {
        warnedEvolution[inst.id + "_" + targetId] = true;
        state.flags._evolutionWarningShown = warnedEvolution;

        var riskLabel = riskLevel === 3 ? "🚨 高危" : "⚠️ 中危";
        var habitLabel =
          {
            junkFoodMeals: "垃圾食品",
            lowHungerStreak: "长期饥饿",
            lowHygieneStreak: "卫生极差",
            lowHappinessStreak: "心情低落",
            highFatigueStreak: "过度疲劳",
            lateNightActions: "夜生活",
            stomach_inflammationCount: "肠胃炎",
            coldCount: "感冒",
            pneumoniaCount: "肺炎",
            malnutritionCount: "营养不良",
            insomniaCount: "失眠",
            depressionCount: "抑郁",
            officeWorkDays: "办公室工作",
            hungerHighStreak: "过度饱食",
            healthUnder30: "健康低下",
            age: "年龄",
          }[closestHabit?.habit || "unknown"] ||
          closestHabit?.habit ||
          "未知习惯";

        var msg =
          riskLabel +
          "：你的" +
          ill.name +
          "有演化成" +
          targetIll.name +
          "的风险！" +
          "当前" +
          habitLabel +
          "（" +
          closestHabit.actual +
          "/" +
          closestHabit.threshold +
          "）接近阈值。" +
          "建议尽快治疗！";

        StateManager.addMessage(msg, riskLevel === 3 ? "danger" : "warning");

        // 首次高危演化风险时弹出提示弹窗
        if (riskLevel === 3 && !state.flags._evolutionModalShown) {
          state.flags._evolutionModalShown = {};
          _showEvolutionWarningModal(state, ill, targetIll, closestHabit);
        }
      }
    }
  }
}

/** 显示演化警告弹窗 */
function _showEvolutionWarningModal(
  state,
  currentIll,
  targetIll,
  closestHabit,
) {
  var habitLabel =
    {
      junkFoodMeals: "累计吃垃圾食品",
      lowHungerStreak: "连续饥饿天数",
      lowHygieneStreak: "连续卫生极差天数",
      lowHappinessStreak: "连续心情低落天数",
      highFatigueStreak: "连续过度疲劳天数",
      lateNightActions: "夜生活次数",
      stomach_inflammationCount: "得过肠胃炎次数",
      coldCount: "得过感冒次数",
      pneumoniaCount: "得过肺炎次数",
      malnutritionCount: "得过营养不良次数",
      insomniaCount: "得过失眠次数",
      depressionCount: "得过抑郁次数",
      officeWorkDays: "办公室工作天数",
      hungerHighStreak: "连续过度饱食天数",
      healthUnder30: "健康<30天数",
      age: "年龄",
    }[closestHabit?.habit || "unknown"] ||
    closestHabit?.habit ||
    "未知习惯";

  var html =
    '<div style="font-size:14px;line-height:1.8;">' +
    '<div style="text-align:center;padding:15px;background:linear-gradient(135deg,#ff4444,#cc0000);border-radius:8px;color:white;margin-bottom:15px;">' +
    '<div style="font-size:32px;">🚨</div>' +
    '<div style="font-weight:700;font-size:16px;margin-top:8px;">疾病演化高危预警</div>' +
    "</div>" +
    "<p>你目前患有 <strong>" +
    currentIll.name +
    "</strong>，如果不及时治疗，有极高风险演化成：</p>" +
    '<div style="background:#fff3f3;border-left:4px solid #cc0000;padding:12px;margin:10px 0;border-radius:4px;">' +
    '<div style="font-size:18px;font-weight:700;color:#cc0000;">' +
    (targetIll.icon || "☠️") +
    " " +
    targetIll.name +
    "</div>" +
    '<div style="font-size:12px;color:#666;margin-top:4px;">' +
    (targetIll.desc || "") +
    "</div>" +
    "</div>" +
    '<p style="font-size:13px;">⚠️ 触发条件接近：</p>' +
    '<ul style="font-size:13px;">' +
    "<li><strong>" +
    habitLabel +
    "</strong>：当前 <strong>" +
    closestHabit.actual +
    "</strong> / 阈值 <strong>" +
    closestHabit.threshold +
    "</strong></li>" +
    "<li>演化概率：<strong>" +
    Math.round((targetIll.triggerChance || 0.5) * 100) +
    "%</strong></li>" +
    "</ul>" +
    '<p style="font-size:13px;color:#666;">💡 建议立即前往医院治疗，避免病情恶化！</p>' +
    "</div>";

  if (typeof showModal === "function") {
    showModal({
      title: "⚠️ 疾病演化预警",
      body: html,
      buttons: [
        {
          text: "立即治疗",
          cls: "btn-danger",
          onClick: function () {
            if (typeof openClinicModal === "function") {
              openClinicModal();
            }
          },
        },
        { text: "知道了", cls: "btn-primary" },
      ],
    });
  }
}

/** 获取疾病演化链（用于百科展示） */
function getEvolutionChain(illnessId) {
  if (!ILLNESSES || !ILLNESSES[illnessId]) return null;
  var ill = ILLNESSES[illnessId];
  var chain = { current: ill, evolvesFrom: [], evolvesTo: [] };

  // 追溯演化来源
  if (ill.evolvesFrom) {
    for (var i = 0; i < ill.evolvesFrom.length; i++) {
      var fromId = ill.evolvesFrom[i];
      var fromIll = ILLNESSES[fromId];
      if (fromIll) {
        chain.evolvesFrom.push({
          id: fromIll.id,
          name: fromIll.name,
          icon: fromIll.icon,
          severity: fromIll.severity,
        });
      }
    }
  }

  // 前瞻演化目标
  if (ill.evolvesTo) {
    for (var j = 0; j < ill.evolvesTo.length; j++) {
      var toId = ill.evolvesTo[j];
      var toIll = ILLNESSES[toId];
      if (toIll) {
        chain.evolvesTo.push({
          id: toIll.id,
          name: toIll.name,
          icon: toIll.icon,
          severity: toIll.severity,
        });
      }
    }
  }

  return chain;
}

// ================================================================
//  百科自更新：疾病库大小自动反映；新增疾病无需碰 wiki.js
// ================================================================
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.illness_system = {
    id: "illness_system",
    name: "疾病系统",
    icon: "🤒",
    brief: "长期不良习惯 → 命名疾病；疾病演化链；药店/医院两档治疗",
    version: "1.2.0",
    related: ["illnesses:*", "mechanics:critical_needs", "items:ingredients"],
    sections: [
      {
        kind: "desc",
        text: "长期不良习惯 → 命名疾病。每种病有触发条件、症状、治疗方式，可同时患多种。部分疾病可演化进阶。",
      },
      {
        kind: "html",
        get: function () {
          var n =
            typeof ILLNESSES === "object" && ILLNESSES
              ? Object.keys(ILLNESSES).length
              : 0;
          return (
            "<p>📚 疾病库当前收录 <b>" +
            n +
            "</b> 种命名疾病（前往 " +
            _wkLink("illnesses", null, "🤒 疾病图鉴") +
            " 查看完整列表）。</p>"
          );
        },
      },
      { kind: "subhead", text: "📊 习惯追踪器（state.flags._habits）" },
      {
        kind: "list",
        items: [
          { html: "<code>junkFoodMeals</code>：累计垃圾食品次数" },
          { html: "<code>lowHungerStreak</code>：连续饥饱 &lt;25 天数" },
          { html: "<code>lowHygieneStreak</code>：连续卫生 &lt;30 天数" },
          { html: "<code>lowHappinessStreak</code>：连续心情 &lt;20 天数" },
          { html: "<code>highFatigueStreak</code>：连续疲劳 &gt;80 天数" },
          { html: "<code>lateNightActions</code>：累计夜生活次数" },
          { html: "<code>officeWorkDays</code>：累计办公室工作天数（职业病）" },
          {
            html: "<code>hungerHighStreak</code>：连续饥饱 &gt;80 天数（肥胖风险）",
          },
          { html: "<code>healthUnder30</code>：连续健康 &lt;30 天数" },
        ],
      },
      { kind: "subhead", text: "🔄 疾病演化链" },
      {
        kind: "html",
        get: function () {
          var chains = [
            {
              from: "stomach_inflammation",
              mid: "gastritis",
              to: "stomach_cancer",
              label: "消化系统",
            },
            {
              from: "depression",
              mid: null,
              to: "major_depression",
              label: "心理健康",
            },
            {
              from: "cold",
              mid: "pneumonia",
              to: "organ_failure",
              label: "呼吸系统",
            },
            {
              from: "malnutrition",
              mid: null,
              to: "anemia",
              label: "营养代谢",
            },
            {
              from: "insomnia",
              mid: null,
              to: "severe_insomnia",
              label: "睡眠障碍",
            },
            {
              from: "overwork",
              mid: null,
              to: "sudden_death_risk",
              label: "过劳猝死",
            },
          ];
          var html =
            '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">';
          for (var ci = 0; ci < chains.length; ci++) {
            var ch = chains[ci];
            var fromIll = ILLNESSES[ch.from];
            var toIll = ILLNESSES[ch.to];
            var midIll = ch.mid ? ILLNESSES[ch.mid] : null;
            html +=
              '<div style="background:var(--bg-input);padding:8px;border-radius:6px;font-size:12px;">';
            html +=
              '<div style="font-weight:600;margin-bottom:4px;">📌 ' +
              ch.label +
              "</div>";
            html += '<div style="line-height:1.6;">';
            if (fromIll) html += fromIll.icon + " " + fromIll.name + " → ";
            if (midIll)
              html +=
                '<span style="color:#ff9800;">' +
                midIll.icon +
                " " +
                midIll.name +
                " → </span>";
            if (toIll)
              html +=
                '<span style="color:#cc0000;font-weight:600;">' +
                toIll.icon +
                " " +
                toIll.name +
                "</span>";
            html += "</div></div>";
          }
          html += "</div>";
          return html;
        },
      },
      { kind: "subhead", text: "💊 治疗" },
      {
        kind: "list",
        items: [
          "药店：便宜，标记 treated=true，自然康复时间减半",
          "医院：贵，立即康复",
          "慢性病（如高血压、糖尿病）：必须按月持续付费才不发作",
        ],
      },
      {
        kind: "tip",
        text: "在医院触发「看病」行动可一站式选病种 + 选档次。疾病演化后治疗费用大幅上升。",
      },
    ],
  };
}

/**
 * 疾病-工作交互系统 — 不同工作对疾病风险的影响
 * 在 doStreetJob 末尾调用。
 */
function trackJobDiseaseRisk(jobId, state) {
  if (!state || !state.flags) return;
  state.flags._habits = state.flags._habits || {};
  var h = state.flags._habits;

  var jobRiskMap = {
    // 高体力消耗 → 过劳风险
    manual_labor_construction: { hf: 2, lh: 1, pb: 1 },
    skilled_labor_construction: { hf: 1, lh: 1, pb: 1 },
    factory_overtime: { hf: 3, md: 1, pb: 1 },
    warehouse_worker: { hf: 2, pb: 1 },
    delivery_rider: { hf: 1 },
    // 脏活 → 卫生下降
    waste_recycling: { lh: 2, pb: 1 },
    cleaning_service: { lh: 1, pb: 1 },
    // 久坐 → 颈椎病
    data_entry: { ow: 2, md: 1 },
    customer_service_tech: { ow: 2, md: 2 },
    content_writing: { ow: 1, md: 1 },
    junior_analyst: { ow: 2, md: 1 },
    // 餐饮 → 烹饪增益
    food_stall: { jf: 1 },
    street_vending_food: { jf: 1 },
    // 高压力
    factory_work_assembly: { md: 1 },
    // 破旧险→体质增强
    premium_engineering: { pb: 1, lh: 1 },
  };

  var risks = jobRiskMap[jobId];
  if (!risks) return;

  if (risks.hf) {
    h._jobFatigueAccum = (h._jobFatigueAccum || 0) + risks.hf;
    if (h._jobFatigueAccum >= 5) {
      h.highFatigueStreak = (h.highFatigueStreak || 0) + 1;
      h._jobFatigueAccum = 0;
    }
  }
  if (risks.lh) {
    h._jobHygieneAccum = (h._jobHygieneAccum || 0) + risks.lh;
    if (h._jobHygieneAccum >= 3) {
      h.lowHygieneStreak = (h.lowHygieneStreak || 0) + 1;
      h._jobHygieneAccum = 0;
    }
  }
  if (risks.md) {
    h._jobMentalAccum = (h._jobMentalAccum || 0) + risks.md;
    if (h._jobMentalAccum >= 5) {
      h.lowHappinessStreak = (h.lowHappinessStreak || 0) + 1;
      h._jobMentalAccum = 0;
    }
  }
  if (risks.jf) {
    h._jobJunkAccum = (h._jobJunkAccum || 0) + risks.jf;
    if (h._jobJunkAccum >= 5) {
      h.junkFoodMeals = (h.junkFoodMeals || 0) + 1;
      h._jobJunkAccum = 0;
    }
  }
  if (risks.ow) {
    h._jobOfficeAccum = (h._jobOfficeAccum || 0) + risks.ow;
    if (h._jobOfficeAccum >= 3) {
      h.officeWorkDays = (h.officeWorkDays || 0) + 1;
      h._jobOfficeAccum = 0;
    }
  }
  if (risks.pb) {
    h._totalPhysiqueBuild = (h._totalPhysiqueBuild || 0) + risks.pb;
  }
}

// ====== 天气→疾病触发（天气深化系统） ======

/**
 * 直接触发一种疾病（供天气系统/外部系统调用）
 * @param {Object} state - 游戏状态
 * @param {string} illnessId - 疾病ID
 * @param {string} source - 触发来源："weather" | "event" | "system"
 * @returns {boolean} 是否成功触发
 */
function triggerIllness(state, illnessId, source) {
  if (!ILLNESSES || !ILLNESSES[illnessId]) return false;
  // 已有该病则不重复触发
  if (hasIllness(state, illnessId)) return false;
  // 初始化
  if (!state.status) state.status = {};
  if (!state.status.illnesses) state.status.illnesses = [];
  // 加入疾病
  state.status.illnesses.push({
    id: illnessId,
    daysRemaining:
      Random.int(
        ILLNESSES[illnessId].naturalCureDays[0],
        ILLNESSES[illnessId].naturalCureDays[1],
      ) || 5,
    severity: ILLNESSES[illnessId].severity || 1,
  });
  return true;
}
