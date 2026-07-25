/**
 * 状态互联系统 — 状态↔基础属性↔状态的深度交叉影响
 *
 * 设计参考: The Sims需求轮盘/This War of Mine状态惩罚/RimWorld意识系统/大多数生存联动
 *
 * 提供: getEffectiveStats(), getApCostMultiplier(), applyStatusInteractions(), checkExtremeConditions()
 */

/** 获取经状态修正后的有效属性值（工作时、技能判定时使用） */
function getEffectiveStats(state) {
  const n = state.needs,
    st = state.status,
    p = state.player;
  var mult = { physique: 1.0, intelligence: 1.0, agility: 1.0, mental: 1.0 };

  // === 饥饿影响（饿得没力气/脑子转不动） ===
  if (n.hunger < 30) {
    mult.agility *= 0.85;
    mult.mental *= 0.9;
  }
  if (n.hunger < 15) {
    mult.agility *= 0.75;
    mult.mental *= 0.8;
    mult.physique *= 0.85;
  }
  if (n.hunger < 5) {
    mult.agility *= 0.5;
    mult.mental *= 0.5;
    mult.physique *= 0.6;
  }

  // === 疲劳影响 ===
  if (n.fatigue > 70) {
    mult.agility *= 0.85;
    mult.mental *= 0.9;
  }
  if (n.fatigue > 85) {
    mult.agility *= 0.7;
    mult.mental *= 0.75;
    mult.physique *= 0.85;
  }
  if (n.fatigue > 95) {
    mult.agility *= 0.5;
    mult.mental *= 0.5;
    mult.physique *= 0.7;
  }

  // === 健康影响 ===
  if (st.health < 50) {
    mult.physique *= 0.85;
  }
  if (st.health < 30) {
    mult.physique *= 0.7;
    mult.agility *= 0.85;
  }
  if (st.health < 15) {
    mult.physique *= 0.5;
    mult.agility *= 0.7;
    mult.intelligence *= 0.85;
  }

  // === 心情影响 ===
  if (n.happiness < 20) {
    mult.mental *= 0.8;
    mult.intelligence *= 0.9;
  }
  if (n.happiness < 10) {
    mult.mental *= 0.6;
    mult.intelligence *= 0.8;
  }

  // === 生病/受伤 ===
  if (st.sick) {
    mult.physique *= 0.85;
    mult.agility *= 0.9;
    mult.mental *= 0.9;
  }
  if (st.injured) {
    mult.physique *= 0.75;
    mult.agility *= 0.7;
  }

  // === 命名疾病额外属性 debuff（来自 illness.js）===
  if (typeof getIllnessAttrDebuffs === "function") {
    var ad = getIllnessAttrDebuffs(state);
    // ad.physique 等是"扣多少有效点数"，转为乘数：扣10点≈打0.9折
    if (ad.physique) mult.physique *= Math.max(0.3, 1 - ad.physique / 100);
    if (ad.intelligence)
      mult.intelligence *= Math.max(0.3, 1 - ad.intelligence / 100);
    if (ad.agility) mult.agility *= Math.max(0.3, 1 - ad.agility / 100);
    if (ad.mental) mult.mental *= Math.max(0.3, 1 - ad.mental / 100);
  }

  // === 高基础属性正向反馈（好体魄抗压） ===
  if (p.agility > 50) mult.agility *= 1.05;
  if (p.mental > 50) mult.mental *= 1.05;
  if (p.physique > 60) mult.physique *= 1.03;

  // === 基础属性内部互动 ===
  if (p.physique > 50) mult.agility *= 1.03; // 体质好→行动更敏捷
  if (p.mental > 50) mult.intelligence *= 1.03; // 心智强→思考更清晰
  if (p.intelligence > 50) mult.mental *= 1.02; // 智商高→情绪调节更好

  // 计算有效值（保底30%）
  var clamp = function (v) {
    return Math.max(0.3, v);
  };
  return {
    physique: Math.round(p.physique * clamp(mult.physique)),
    intelligence: Math.round(p.intelligence * clamp(mult.intelligence)),
    agility: Math.round(p.agility * clamp(mult.agility)),
    mental: Math.round(p.mental * clamp(mult.mental)),
    multipliers: mult,
  };
}

/** 获取当前AP消耗倍率（影响所有 consumeAP 调用的实际消耗） */
function getApCostMultiplier(state) {
  var n = state.needs,
    st = state.status,
    p = state.player;
  var mult = 1.0;

  // === 负面状态增加AP消耗 ===
  if (n.fatigue > 70) mult += 0.2;
  if (n.fatigue > 85) mult += 0.25; // 累计+0.45
  if (n.fatigue > 95) mult += 0.35; // 累计+0.8

  if (n.hunger < 20) mult += 0.3;
  if (n.hunger < 10) mult += 0.2; // 累计+0.5

  if (st.sick) mult += 0.5;
  if (st.injured) mult += 0.3;

  if (n.happiness < 15) mult += 0.2;

  // === 命名疾病额外 AP 倍率（来自 illness.js）===
  if (typeof getIllnessAttrDebuffs === "function") {
    var ad = getIllnessAttrDebuffs(state);
    if (ad.apMult) mult += ad.apMult;
  }

  // === 天气影响AP ===
  if (state.weather) {
    var w = state.weather.current;
    if (w === "heatwave" || w === "coldwave") mult += 0.2;
    if (w === "storm" || w === "snow") mult += 0.15;
  }

  // === 高敏捷减免（身体灵活→做事高效） ===
  if (p.agility > 50) mult -= 0.1;
  if (p.agility > 75) mult -= 0.1; // 累计-0.2

  // === 保底：AP消耗至少为原始的50%，最多为250% ===
  return Math.max(0.5, Math.min(2.5, mult));
}

/** 每日结算时施加状态→状态的交叉影响（在applyNeedsDecay之后调用） */
function applyStatusInteractions(state) {
  var n = state.needs,
    st = state.status,
    p = state.player;

  // --- 饥饿加速疲劳（没吃饭→没力气→更容易累） ---
  if (n.hunger < 30) n.fatigue = Math.min(100, n.fatigue + 5);
  if (n.hunger < 15) n.fatigue = Math.min(100, n.fatigue + 8);

  // --- 社交缓冲：当社交圈≥3熟人的负面情绪打击降低25% ---
  var _socialBuffHappiness = function (val) {
    if (state.flags && state.flags._socialBuffActive) {
      return Math.max(0, Math.round(val * 0.75));
    }
    return val;
  };

  // --- 饥饿→心情下降（饿肚子不开心） ---
  if (n.hunger < 20) n.happiness = Math.max(0, n.happiness - _socialBuffHappiness(5));

  // --- 疲劳→心情下降（累了心情自然差） ---
  if (n.fatigue > 70) n.happiness = Math.max(0, n.happiness - _socialBuffHappiness(3));
  if (n.fatigue > 85) n.happiness = Math.max(0, n.happiness - _socialBuffHappiness(5));

  // --- 疲劳→懒得洗漱 ---
  if (n.fatigue > 85) n.hygiene = Math.max(0, n.hygiene - 3);

  // --- 卫生差→心情下降 ---
  if (n.hygiene < 20) n.happiness = Math.max(0, n.happiness - _socialBuffHappiness(3));
  if (n.hygiene < 10) n.happiness = Math.max(0, n.happiness - _socialBuffHappiness(5));

  // --- 心情好→缓解疲劳（心情愉快精力恢复快） ---
  if (n.happiness > 70) n.fatigue = Math.max(0, n.fatigue - 3);
  if (n.happiness > 85) n.fatigue = Math.max(0, n.fatigue - 5);

  // --- 心情差→疲劳恢复减半（存入临时标记，endDay睡眠恢复时使用） ---
  state._fatigueRecoveryPenalty = n.happiness < 20 ? 0.5 : 1.0;

  // --- 健康差→疲劳增长（身体不好容易累） ---
  if (st.health < 50) n.fatigue = Math.min(100, n.fatigue + 3);
  if (st.health < 30) n.fatigue = Math.min(100, n.fatigue + 5);

  // --- 生病/受伤的全面影响 ---
  if (st.sick) {
    n.fatigue = Math.min(100, n.fatigue + 8);
    n.happiness = Math.max(0, n.happiness - 5);
    n.hygiene = Math.max(0, n.hygiene - 2);
  }
  if (st.injured) {
    n.fatigue = Math.min(100, n.fatigue + 5);
    n.happiness = Math.max(0, n.happiness - 3);
  }

  // --- 命名疾病的每日 needs 累加（来自 illness.js）---
  if (typeof getIllnessNeedsImpact === "function") {
    var ni = getIllnessNeedsImpact(state);
    if (ni.hunger) n.hunger = Math.max(0, Math.min(100, n.hunger + ni.hunger));
    if (ni.fatigue)
      n.fatigue = Math.max(0, Math.min(100, n.fatigue + ni.fatigue));
    if (ni.hygiene)
      n.hygiene = Math.max(0, Math.min(100, n.hygiene + ni.hygiene));
    if (ni.happiness)
      n.happiness = Math.max(0, Math.min(100, n.happiness + ni.happiness));
  }

  // --- 高体质→减缓疲劳积累（身体底子好扛得住） ---
  if (p.physique > 60) n.fatigue = Math.max(0, n.fatigue - 2);
  if (p.physique > 80) n.fatigue = Math.max(0, n.fatigue - 3);

  // --- 高心智→减缓心情下降（内心强大情绪稳定） ---
  if (p.mental > 60) n.happiness = Math.min(100, n.happiness + 2);
  if (p.mental > 80) n.happiness = Math.min(100, n.happiness + 3);

  // --- 高智力→卫生意识更强 ---
  if (p.intelligence > 50) n.hygiene = Math.min(100, n.hygiene + 2);
  if (p.intelligence > 75) n.hygiene = Math.min(100, n.hygiene + 3);

  // --- 保底值 ---
  n.hunger = Math.max(0, Math.min(100, n.hunger));
  n.fatigue = Math.max(0, Math.min(100, n.fatigue));
  n.hygiene = Math.max(0, Math.min(100, n.hygiene));
  n.happiness = Math.max(0, Math.min(100, n.happiness));
}

/**
 * 极端状态检测（在每个行动之前和endDay中调用）
 * 返回: null(正常) | 'skip_day'(跳过当日剩余时间) | 'forced_rest'(强制休息) | 'game_over'(死亡结局)
 */
function checkExtremeConditions(state) {
  var n = state.needs,
    st = state.status;

  // === 饿晕 → 跳过一整天 ===
  if (n.hunger <= 5) {
    StateManager.addMessage(
      "💀 你饿晕在街头，醒来已经是第二天了...健康严重受损！好心人给了你一点吃的。",
      "danger",
    );
    st.health = Math.max(0, st.health - 15);
    n.hunger = 10; // 好心人给了点吃的
    n.fatigue = Math.min(100, n.fatigue + 20);
    n.happiness = Math.max(0, n.happiness - (state.flags && state.flags._socialBuffActive ? 15 : 20));
    return "skip_day";
  }

  // === 过劳晕倒 → 强制结束当天 ===
  if (n.fatigue >= 98) {
    StateManager.addMessage(
      "😵 你累倒了！身体完全撑不住了，被送回家休息...",
      "danger",
    );
    st.health = Math.max(0, st.health - 10);
    if (Random.chance(0.4)) st.sick = true; // 40%概率过劳生病
    return "skip_day";
  }

  // === 病危送医 ===
  if (st.health <= 5 && !state.flags._forcedHospital) {
    state.flags._forcedHospital = true;
    // [自洽修复] 域D A类: 补 cash ||0 守卫
    if ((state.resources.cash || 0) >= 500) {
      state.resources.cash = (state.resources.cash || 0) - 500;
      st.health = Math.min(50, st.health + 20);
      StateManager.addMessage(
        "🏥 你病危被好心人送进医院，花了¥500急救费用...需要好好休养。",
        "warning",
      );
    } else {
      StateManager.addMessage(
        "🏥 你病危被送医抢救，但付不起¥500医药费...欠下¥500债务。",
        "danger",
      );
      state.resources.bankDebt = (state.resources.bankDebt || 0) + 500;
      state.resources.debt =
        (state.resources.villageDebt || 0) + (state.resources.fineDebt || 0) + (state.resources.bankDebt || 0);
      st.health = Math.min(30, st.health + 10);
    }
    return "skip_day";
  }

  // 重置医院标记（健康恢复到安全水平后）
  if (st.health > 20) {
    state.flags._forcedHospital = false;
  }

  // === 心情极度低落→拒绝工作 ===
  if (n.happiness <= 5 && !state.flags._depressionWarned) {
    state.flags._depressionWarned = true;
    StateManager.addMessage(
      "😢 你心情极度低落，做什么都提不起劲...今天效率大幅下降。",
      "warning",
    );
  }
  if (n.happiness > 15) {
    state.flags._depressionWarned = false;
  }

  return null; // 正常
}

/**
 * 获取状态对工作的综合修正（整合情绪+有效属性+状态惩罚）
 * 返回 { payMultiplier, injuryRisk, skillXpMultiplier, apMultiplier }
 */
function getWorkComprehensiveModifier(state) {
  var emoMod =
    typeof getEmotionWorkModifier === "function"
      ? getEmotionWorkModifier(state)
      : { pay: 1.0, injury: 1.0, skillXp: 1.0 };

  var eff = getEffectiveStats(state);
  var apMult = getApCostMultiplier(state);

  // 有效属性影响收入（能力打折→收入打折）
  var avgEff = (eff.physique + eff.intelligence + eff.agility + eff.mental) / 4;
  var avgNominal =
    (state.player.physique +
      state.player.intelligence +
      state.player.agility +
      state.player.mental) /
    4;
  var statPenalty = avgNominal > 0 ? Math.min(1.0, avgEff / avgNominal) : 1.0;

  return {
    payMultiplier: emoMod.pay * Math.max(0.3, statPenalty),
    injuryRisk:
      emoMod.injury *
      (state.status.sick ? 1.5 : 1) *
      (state.status.injured ? 1.5 : 1),
    skillXpMultiplier: emoMod.skillXp * Math.max(0.3, statPenalty),
    apMultiplier: apMult,
  };
}

/** 获取状态图标简要摘要（用于侧边栏提示） */
function getStatusSummary(state) {
  var warnings = [];
  var n = state.needs,
    st = state.status;

  if (n.hunger <= 5) warnings.push("💀饿晕危险");
  else if (n.hunger < 15) warnings.push("⚠️极度饥饿");
  else if (n.hunger < 30) warnings.push("🍞饥饿");

  if (n.fatigue >= 98) warnings.push("😵过劳危险");
  else if (n.fatigue > 85) warnings.push("⚠️极度疲劳");
  else if (n.fatigue > 70) warnings.push("🥱疲劳");

  if (n.hygiene < 15) warnings.push("🦠卫生差");
  if (n.happiness < 15) warnings.push("😢心情差");

  if (st.sick) warnings.push("🤒生病");
  if (st.injured) warnings.push("🩹受伤");
  if (st.health < 20) warnings.push("💔健康危险");

  var apMult = getApCostMultiplier(state);
  if (apMult > 1.3) warnings.push("🐌效率低×" + apMult.toFixed(1));

  return warnings;
}
