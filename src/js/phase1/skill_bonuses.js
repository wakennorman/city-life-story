/**
 * 技能→系统加成映射 — 技能影响多系统（吃饭/旅行/工作/银行/职场等）
 *
 * 设计理念：每项技能不仅解锁工作，还对相关的游戏系统产生渐进式加成，
 * 让技能培养有持续正反馈，形成"学以致用"的良性循环。
 */

/** cooking技能 → 自己做饭折扣（技能越高做饭越划算） */
function getCookingDiscount(cookingLevel) {
  // 自己做饭花费 = 基础花费 * (1 - cookingLevel * 0.008)
  // level 0: 全额, level 50: 6折, level 100: 2折（最低保底3折）
  return Math.min(0.7, cookingLevel * 0.008);
}

/** driving技能 → 旅行AP减免 */
function getTravelApReduction(drivingLevel) {
  // 每20级减1AP，最多减5AP
  return Math.min(5, Math.floor(drivingLevel / 20));
}

/** english技能 → 家教额外收入加成 */
function getTutoringBonus(englishLevel) {
  return englishLevel * 0.3;
}

/** accounting技能 → 银行利率加成 */
function getBankRateBonus(accountingLevel) {
  // 每年最多+5%（日息约+0.00014），100级满分
  return accountingLevel * 0.0005;
}

/** electrician技能 → 工厂类工作收入加成百分比 */
function getFactoryBonus(electricianLevel) {
  return electricianLevel * 0.005;
}

/** welding技能 → 建筑类工作收入加成百分比 */
function getConstructionBonus(weldingLevel) {
  return weldingLevel * 0.008;
}

/** coding技能 → 职场能力加成（每10级+2点ability） */
function getCorpAbilityBonus(codingLevel) {
  return Math.floor(codingLevel / 10) * 2;
}

/** management技能 → 职场向上管理加成（每10级+1点upwardMgmt） */
function getCorpUpwardBonus(managementLevel) {
  return Math.floor(managementLevel / 10) * 1;
}

/** repair技能 → 装备/工具效果加成（百分比） */
function getRepairBonus(repairLevel) {
  return repairLevel * 0.005;
}

/** sales技能 → 交易买卖价格优势 */
function getSalesTradeDiscount(salesLevel) {
  // 买入折扣：最高15%
  return Math.min(0.15, salesLevel * 0.002);
}
function getSalesTradePremium(salesLevel) {
  // 卖出溢价：最高15%
  return Math.min(0.15, salesLevel * 0.002);
}

/**
 * 工作后分发技能经验值（与工作类型关联）
 * 返回字符串描述获得了什么XP
 */
function grantJobSkillXp(jobId, state) {
  var job =
    typeof STREET_JOBS !== "undefined"
      ? STREET_JOBS.find(function (j) {
          return j.id === jobId;
        })
      : null;
  if (!job) return "";

  var xpMap = {
    // 烹饪相关工作 → cooking XP
    street_vending_food: { skill: "cooking", min: 2, max: 5 },
    food_stall: { skill: "cooking", min: 3, max: 7 },
    // 销售相关工作 → sales XP
    street_vending_goods: { skill: "sales", min: 2, max: 5 },
    barber: { skill: "sales", min: 2, max: 4 },
    // 维修相关工作 → repair XP
    skilled_labor_construction: { skill: "repair", min: 3, max: 6 },
    repair_service: { skill: "repair", min: 4, max: 8 },
    // 英语相关工作 → english XP
    tutoring: { skill: "english", min: 2, max: 4 },
    // 驾驶相关工作 → driving XP
    delivery_rider: { skill: "driving", min: 3, max: 6 },
    // 电工相关工作 → electrician XP
    factory_work_assembly: { skill: "electrician", min: 2, max: 4 },
    factory_overtime: { skill: "electrician", min: 3, max: 6 },
    // 焊接相关工作 → welding XP
    manual_labor_construction: { skill: "welding", min: 1, max: 3 },
  };

  var entry = xpMap[jobId];
  if (!entry) return "";

  var sk = state.skills[entry.skill];
  if (!sk) return "";

  var xpGain =
    entry.min + Math.floor(Math.random() * (entry.max - entry.min + 1));

  // 情绪加成技能XP（happy时1.5倍，depressed时0.3倍）
  var emoMod =
    typeof getEmotionWorkModifier === "function"
      ? getEmotionWorkModifier(state)
      : { skillXp: 1.0 };
  xpGain = Math.round(xpGain * emoMod.skillXp);

  // 智力高有一定加成
  var intBonus = Math.floor((state.player.intelligence || 0) / 30);
  xpGain += intBonus;

  sk.xp = (sk.xp || 0) + xpGain;

  // 检查升级
  var leveledUp = false;
  while (sk.xp >= (sk.level + 1) * 120 && sk.level < 100) {
    sk.xp -= (sk.level + 1) * 120;
    sk.level++;
    leveledUp = true;
    // 升级提升关联属性（微量）
    applySkillLevelUpBonus(entry.skill, state);
  }

  var msg = "📚 " + getSkillChineseName(entry.skill) + " +" + xpGain + "XP";
  if (leveledUp) msg += " 🎉升级至Lv." + sk.level + "!";

  return msg;
}

/** 技能升级时提升关联属性 */
function applySkillLevelUpBonus(skillKey, state) {
  var p = state.player;
  var strengthSkills = ["cooking", "welding", "repair", "electrician"];
  var intSkills = ["coding", "english", "accounting", "management"];
  var agilitySkills = ["driving", "sales"];

  if (strengthSkills.indexOf(skillKey) !== -1) {
    if (p.physique < 100) p.physique = Math.min(100, p.physique + 1);
  }
  if (intSkills.indexOf(skillKey) !== -1) {
    if (p.intelligence < 100)
      p.intelligence = Math.min(100, p.intelligence + 1);
  }
  if (agilitySkills.indexOf(skillKey) !== -1) {
    if (p.agility < 100) p.agility = Math.min(100, p.agility + 1);
  }
}

/** 行动后分发微量属性增长 */
function grantActionStatGain(actionId, state) {
  var statMap = {
    scavenge_trash: { physique: 0.1 },
    manual_labor_construction: { physique: 0.2 },
    factory_work_assembly: { agility: 0.2 },
    factory_overtime: { physique: 0.1, agility: 0.1 },
    barber: { agility: 0.1 },
    delivery_rider: { agility: 0.2 },
    street_performer: { mental: 0.1, fame: 1 },
    busking: { mental: 0.1, fame: 0.5 },
    tutoring: { intelligence: 0.1 },
    gym: { physique: 0.5 + Math.random() * 0.5 },
    night_school: { intelligence: 0.2 },
    meditation: { mental: 0.3 },
    diary: { mental: 0.1 },
    skilled_labor_construction: { physique: 0.1 },
  };

  var entry = statMap[actionId];
  if (!entry) return "";

  var p = state.player;
  var gains = [];

  Object.keys(entry).forEach(function (key) {
    var gain = entry[key];
    if (key === "fame") {
      state.status.fame = (state.status.fame || 0) + gain;
    } else if (p[key] !== undefined && p[key] < 100) {
      p[key] = Math.min(100, p[key] + gain);
    }
    if (gain >= 0.5) {
      gains.push(getStatChineseName(key) + " +" + gain.toFixed(1));
    }
  });

  return gains.length > 0 ? "💪 " + gains.join(", ") : "";
}

/** 获取技能中文名 */
function getSkillChineseName(skillKey) {
  var names = {
    cooking: "烹饪",
    repair: "维修",
    coding: "编程",
    english: "英语",
    driving: "驾驶",
    sales: "销售",
    management: "管理",
    accounting: "会计",
    electrician: "电工",
    welding: "焊接",
  };
  return names[skillKey] || skillKey;
}

/**
 * 摆摊客流量综合修正（位置 × 天气 × 节日 × 周末）
 * 供 jobs.js 的 payCalc 调用
 */
function getVendingFootfallMod(locKey, state) {
  // 基础客流量（来自 LOCATIONS 定义）
  var loc = typeof LOCATIONS !== "undefined" ? LOCATIONS[locKey] : null;
  var base = loc ? loc.footfall || 1.0 : 1.0;

  // 天气修正（雨天-35%/-70%，晴天+10%）
  var weather = state.weather ? state.weather.current : null;
  if (weather === "stormy") base *= 0.3;
  else if (weather === "rainy") base *= 0.65;
  else if (weather === "snowy") base *= 0.5;
  else if (weather === "sunny") base *= 1.1;

  // 节日修正（节日期间客流量+30%）
  if (typeof getCurrentFestival === "function") {
    var festival = getCurrentFestival(state.player.day);
    if (festival) base *= 1.3;
  }

  // 周末修正（day%7=0或6时为"周末"，客流量+20%）
  var dow = state.player.day % 7;
  if (dow === 0 || dow === 6) base *= 1.2;

  return Math.max(0.1, base);
}

/** 获取客流量星级说明（用于UI展示） */
function getFootfallStars(mod) {
  if (mod >= 2.0) return "⭐⭐⭐⭐⭐ 爆满";
  if (mod >= 1.5) return "⭐⭐⭐⭐ 旺盛";
  if (mod >= 1.0) return "⭐⭐⭐ 正常";
  if (mod >= 0.7) return "⭐⭐ 冷清";
  return "⭐ 萧条";
}

/**
 * NPC 好感阈值检测 — 每次好感变动后调用
 * 参考 Stardew Valley Heart Events：达到阈值触发一次性奖励
 */
function checkNpcAffinityRewards(npcId, state) {
  var npc = typeof getNpcById === "function" ? getNpcById(npcId) : null;
  if (!npc || !npc.affinityRewards) return;
  var rel = state.relationships[npcId];
  if (!rel) return;
  var affinity = rel.affinity || 0;
  if (!state.flags._npcRewardsClaimed) state.flags._npcRewardsClaimed = {};
  npc.affinityRewards.forEach(function (reward) {
    if (
      affinity >= reward.threshold &&
      !state.flags._npcRewardsClaimed[reward.id]
    ) {
      state.flags._npcRewardsClaimed[reward.id] = true;
      reward.effect(state);
    }
  });
}

/** 每日财务结算 — 银行利息（含accounting技能加成） */
function settleDailyFinance(state) {
  var bal = state.resources.bankBalance || 0;
  if (bal <= 0) return;
  var accountingLvl =
    (state.skills.accounting && state.skills.accounting.level) || 0;
  var baseRate = 0.001;
  var bonus =
    typeof getBankRateBonus === "function"
      ? getBankRateBonus(accountingLvl)
      : 0;
  var rate = baseRate + bonus;
  var interest = Math.floor(bal * rate);
  if (interest > 0) {
    state.resources.bankBalance += interest;
    StateManager.addMessage(
      "🏦 银行利息 +¥" +
        interest +
        "（日利率" +
        (rate * 100).toFixed(3) +
        "%，存款¥" +
        bal.toLocaleString() +
        "）",
      "info",
    );
  }
}

/** 获取属性中文名 */
function getStatChineseName(key) {
  var names = {
    physique: "体质",
    intelligence: "智力",
    agility: "敏捷",
    mental: "心智",
    health: "健康",
    hunger: "饱食度",
    fatigue: "疲劳",
    hygiene: "卫生",
    happiness: "心情",
    fame: "名气",
  };
  return names[key] || key;
}
