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

// ====== P2#12 技能树分支感知加成（调用原函数 + 叠加分支加成） ======

/**
 * 获取厨艺打折 + 分支加成（家常大厨额外减食材成本）
 */
function getBranchCookingDiscount(state) {
  var base = getCookingDiscount((state.skills.cooking && state.skills.cooking.level) || 0);
  if (!state.skillBranches || state.skillBranches.cooking !== "home_chef") return base;
  var reduction = 0.15; // 家常大厨基础成本减免
  if (typeof getTalentNodeEffects === "function") {
    var eff = getTalentNodeEffects(state);
    reduction += eff.foodCostReduction || 0;
  }
  return Math.min(0.8, base + reduction);
}

/**
 * 获取旅行AP减免 + 分支加成（客运驾驶额外减免）
 */
function getBranchTravelApReduction(state) {
  var base = getTravelApReduction((state.skills.driving && state.skills.driving.level) || 0);
  if (!state.skillBranches || state.skillBranches.driving !== "passenger_transport") return base;
  if (typeof getTalentNodeEffects === "function") {
    var eff = getTalentNodeEffects(state);
    return base + (eff.extraApReduction || 2);
  }
  return base + 1;
}

/**
 * 获取家教加成 + 分支加成（商务英语额外+50%）
 */
function getBranchTutoringBonus(state) {
  var base = getTutoringBonus((state.skills.english && state.skills.english.level) || 0);
  if (!state.skillBranches || state.skillBranches.english !== "business_english") return base;
  return base * 1.5;
}

/**
 * 获取工厂加成 + 分支加成（强电工程翻倍）
 */
function getBranchFactoryBonus(state) {
  var base = getFactoryBonus((state.skills.electrician && state.skills.electrician.level) || 0);
  if (!state.skillBranches || state.skillBranches.electrician !== "industrial_electric") return base;
  return base * 2.0;
}

/**
 * 获取建筑加成 + 分支加成（结构焊接+50%）
 */
function getBranchConstructionBonus(state) {
  var base = getConstructionBonus((state.skills.welding && state.skills.welding.level) || 0);
  if (!state.skillBranches || state.skillBranches.welding !== "structural_welding") return base;
  return base * 1.5;
}

/**
 * 获取买入折扣 + 分支加成（门店销售上限提升到25%）
 */
function getBranchSalesDiscount(state) {
  var base = getSalesTradeDiscount((state.skills.sales && state.skills.sales.level) || 0);
  if (!state.skillBranches || state.skillBranches.sales !== "store_sales") return base;
  var extra = 0;
  if (typeof getTalentNodeEffects === "function") {
    extra = getTalentNodeEffects(state).extraDiscount || 0;
  }
  return Math.min(0.25, base + 0.10 + extra);
}

/**
 * 获取卖出溢价 + 分支加成（商务谈判上限提升到25%）
 */
function getBranchSalesPremium(state) {
  var base = getSalesTradePremium((state.skills.sales && state.skills.sales.level) || 0);
  if (!state.skillBranches || state.skillBranches.sales !== "biz_negotiation") return base;
  var extra = 0;
  if (typeof getTalentNodeEffects === "function") {
    extra = getTalentNodeEffects(state).extraPremium || 0;
  }
  return Math.min(0.25, base + 0.10 + extra);
}

// 城市脉搏规则：把新闻从"提示文本"转成地点、工作和行动建议的即时变化。
var CITY_PULSE_RULES = [
  {
    id: "vending_crackdown",
    label: "城管严查",
    test: /城管|执法|清查|整治市容|严查摆摊/,
    footfall: { commercialDist: 0.65, park: 0.75, slum: 0.8 },
    jobs: {
      street_vending_food: 0.65,
      street_vending_goods: 0.65,
      food_stall: 0.72,
      delivery_rider: 1.08,
    },
    tip: "🚨 城管严查期，摆摊客流和收入下滑，外卖/室内服务更稳。",
  },
  {
    id: "platform_orders",
    label: "外卖爆单",
    test: /外卖|骑手|平台补贴|补贴大战|订单爆炸/,
    footfall: { commercialDist: 1.15, techPark: 1.1, school: 1.08 },
    jobs: {
      delivery_rider: 1.25,
      street_vending_food: 0.92,
      food_stall: 0.95,
    },
    tip: "🛵 平台补贴期，外卖骑手短期收益高，但餐饮摊会被平台分走客流。",
  },
  {
    id: "urban_renewal",
    label: "旧改施工",
    test: /旧改|城中村改造|拆迁|装修|清运|新楼盘开工/,
    footfall: { construction: 1.25, slum: 0.82, wholesaleMarket: 1.12 },
    jobs: {
      manual_labor_construction: 1.18,
      skilled_labor_construction: 1.18,
      cleaning_service: 1.12,
      repair_service: 1.15,
      waste_recycling: 1.08,
    },
    tip: "🏚️ 旧改带动工地、清运和维修需求，相关工作比平时更值得做。",
  },
  {
    id: "property_slump",
    label: "楼市降温",
    test: /楼市调控|限购|限贷|房价预期大跌|楼盘降价/,
    footfall: { construction: 0.82, bank: 1.08 },
    jobs: {
      manual_labor_construction: 0.85,
      skilled_labor_construction: 0.88,
      premium_engineering: 0.92,
      repair_service: 1.05,
    },
    tip: "🏠 楼市降温会压低工地需求，维修和银行相关机会相对更稳。",
  },
  {
    id: "factory_supply",
    label: "工厂景气",
    test: /电子厂订单|工厂加班|订单暴增|供应链.*恢复/,
    footfall: { factoryZone: 1.2, wholesaleMarket: 1.08 },
    jobs: {
      factory_work_assembly: 1.18,
      factory_overtime: 1.22,
      warehouse_worker: 1.12,
    },
    tip: "🏭 工厂订单旺，流水线和仓库搬运的现金效率提升。",
  },
  {
    id: "chip_pressure",
    label: "供应链承压",
    test: /芯片战|出口管制|供应链承压|反垄断调查/,
    footfall: { techPark: 0.9, factoryZone: 0.92 },
    jobs: {
      data_entry: 0.92,
      customer_service_tech: 0.9,
      content_writing: 0.95,
      factory_work_assembly: 0.9,
      factory_overtime: 0.88,
    },
    tip: "🛡️ 科技供应链承压，科技园和电子厂短工收益有折扣，现金为王。",
  },
  {
    id: "ai_demand",
    label: "AI需求",
    test: /AI|大模型|算力|科技展|显卡|云服务器/,
    footfall: { techPark: 1.25, school: 1.08 },
    jobs: {
      data_entry: 1.15,
      customer_service_tech: 1.14,
      content_writing: 1.12,
      junior_analyst: 1.18,
      tutoring: 1.08,
    },
    tip: "🤖 AI热潮会抬高科技园相关岗位价值，学历和智力越能变现。",
  },
  {
    id: "school_demand",
    label: "开学旺季",
    test: /开学季|大学城|家教|快递需求/,
    footfall: { school: 1.2, trainingCenter: 1.08 },
    jobs: {
      package_delivery: 1.18,
      tutoring: 1.16,
      school_maintenance: 1.08,
      street_vending_food: 1.05,
    },
    tip: "🎒 开学相关需求旺，大学城快递、家教和小吃摊都有机会。",
  },
  {
    id: "flu_surge",
    label: "流感高峰",
    test: /流感|发热门诊|医院|护工紧缺|口罩/,
    footfall: { hospital: 1.45, commercialDist: 0.95 },
    jobs: {
      hospital_caregiver: 1.35,
      delivery_rider: 1.08,
      street_vending_food: 0.92,
    },
    tip: "🤒 流感高峰让医院陪诊护工紧缺，但生病风险也更高。",
  },
  {
    id: "inflation_pressure",
    label: "通胀压力",
    test: /通胀|物价|CPI|能源价格传导|涨价/,
    footfall: { wholesaleMarket: 1.08, bank: 1.08 },
    jobs: {
      warehouse_worker: 1.08,
      delivery_rider: 1.06,
      street_vending_goods: 0.94,
    },
    tip: "📈 物价上涨时现金购买力下降，批发周转和银行储蓄更重要。",
  },
];

function _mulCityPulseMap(target, source) {
  if (!source) return;
  for (var key in source) {
    target[key] = (target[key] || 1) * source[key];
  }
}

function getCityPulse(state) {
  var pulse = {
    footfall: {},
    jobs: {},
    labels: [],
    tips: [],
    rules: [],
  };
  var activeNews = (state && state.activeNews) || [];
  for (var i = 0; i < activeNews.length; i++) {
    var news = activeNews[i] || {};
    var text = (news.id || "") + " " + (news.headline || "");
    for (var r = 0; r < CITY_PULSE_RULES.length; r++) {
      var rule = CITY_PULSE_RULES[r];
      if (!rule.test.test(text)) continue;
      _mulCityPulseMap(pulse.footfall, rule.footfall);
      _mulCityPulseMap(pulse.jobs, rule.jobs);
      if (pulse.labels.indexOf(rule.label) === -1)
        pulse.labels.push(rule.label);
      if (rule.tip && pulse.tips.indexOf(rule.tip) === -1)
        pulse.tips.push(rule.tip);
      pulse.rules.push(rule);
    }
  }
  return pulse;
}

function getNewsJobMultiplier(jobId, state) {
  var pulse = getCityPulse(state);
  return pulse.jobs[jobId] || 1.0;
}

function getNewsJobMultiplierDesc(jobId, state) {
  var pulse = getCityPulse(state);
  var hits = [];
  for (var i = 0; i < pulse.rules.length; i++) {
    var rule = pulse.rules[i];
    if (rule.jobs && rule.jobs[jobId] && rule.jobs[jobId] !== 1) {
      var pct = Math.round((rule.jobs[jobId] - 1) * 100);
      hits.push(rule.label + (pct > 0 ? "+" : "") + pct + "%");
    }
  }
  return hits.length ? hits.join("，") : "";
}

function getLocationNewsBadges(locKey, state) {
  var pulse = getCityPulse(state);
  var badges = [];
  for (var i = 0; i < pulse.rules.length; i++) {
    var rule = pulse.rules[i];
    if (rule.footfall && rule.footfall[locKey]) {
      var pct = Math.round((rule.footfall[locKey] - 1) * 100);
      badges.push({
        label: rule.label + (pct > 0 ? "+" : "") + pct + "%",
        positive: pct >= 0,
        tip: rule.tip || "",
      });
    }
  }
  return badges;
}

function getCityPulseTips(state, limit) {
  var tips = getCityPulse(state).tips;
  return typeof limit === "number" ? tips.slice(0, limit) : tips;
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
    hospital_caregiver: { skill: "sales", min: 2, max: 5 },
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

  // 天赋节点XP加成（P2#12 技能树系统）
  if (typeof getTalentNodeEffects === "function" && state.talentNodes) {
    var nodeEff = getTalentNodeEffects(state);
    var xpMultKey = entry.skill + "XpMult";
    if (nodeEff[xpMultKey]) {
      xpGain = Math.round(xpGain * nodeEff[xpMultKey]);
    }
  }

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

  // 天赋节点解锁提示（P2#12）
  if (typeof getUnlockedTalentNodes === "function" && state.skillBranches) {
    var unlocked = getUnlockedTalentNodes(skillKey, state);
    for (var ni = 0; ni < unlocked.length; ni++) {
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage(
          "🌟 可在技能页激活「" + unlocked[ni].name + "」天赋节点！",
          "hint"
        );
      }
    }
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

  // 节日修正（普通节日+30%；全民剁手节人流爆炸×2.5）
  if (typeof getCurrentFestival === "function") {
    var festival = getCurrentFestival(state.player.day);
    if (festival) {
      base *= festival.id === "shopping_festival" ? 2.5 : 1.3;
    }
  }

  // 周末修正（day%7=0或6时为"周末"，客流量+20%）
  var dow = state.player.day % 7;
  if (dow === 0 || dow === 6) base *= 1.2;

  // 新闻/政策形成的城市脉搏会改变地点客流。
  if (typeof getCityPulse === "function") {
    var pulse = getCityPulse(state);
    if (pulse.footfall && pulse.footfall[locKey])
      base *= pulse.footfall[locKey];
  }

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
 * NPC在场加成 — 当玩家在某地点工作时，驻扎该地点且好感度足够的NPC会提供加成
 *
 * 设计参考《星露谷》：熟识的村民会帮助你更有效率地工作
 * 加成逻辑：NPC.presenceBonus 数组中每条规则 { minAffinity, jobs, multiplier }
 *   - minAffinity: 触发所需最低好感值
 *   - jobs: 受益的工作ID数组（null表示所有工作）
 *   - multiplier: 收入倍率（叠加，各NPC独立计算后相乘）
 *
 * @param {string} locKey   - 当前地点 ID
 * @param {string} jobId    - 正在执行的工作 ID
 * @param {object} state    - 游戏状态
 * @returns {number}        - 总收入乘数（≥1.0）
 */
function getNpcPresenceBonus(locKey, jobId, state) {
  if (typeof NPCS === "undefined" || !state.relationships) return 1.0;
  var totalMult = 1.0;

  for (var i = 0; i < NPCS.length; i++) {
    var npc = NPCS[i];
    if (npc.location !== locKey) continue;
    if (!npc.presenceBonus) continue;

    var rel = state.relationships[npc.id];
    var affinity = rel ? rel.affinity || 0 : 0;

    for (var b = 0; b < npc.presenceBonus.length; b++) {
      var bonus = npc.presenceBonus[b];
      if (affinity < (bonus.minAffinity || 0)) continue;
      var jobMatch = !bonus.jobs || bonus.jobs.indexOf(jobId) >= 0;
      if (!jobMatch) continue;
      totalMult *= bonus.multiplier || 1.0;
    }
  }

  return totalMult;
}

/**
 * 获取NPC在场加成说明（用于行动提示展示）
 * @returns {string|null}  - 提示文字，无加成时返回 null
 */
function getNpcPresenceBonusDesc(locKey, jobId, state) {
  if (typeof NPCS === "undefined" || !state.relationships) return null;
  var lines = [];

  for (var i = 0; i < NPCS.length; i++) {
    var npc = NPCS[i];
    if (npc.location !== locKey) continue;
    if (!npc.presenceBonus) continue;

    var rel = state.relationships[npc.id];
    var affinity = rel ? rel.affinity || 0 : 0;

    for (var b = 0; b < npc.presenceBonus.length; b++) {
      var bonus = npc.presenceBonus[b];
      if (affinity < (bonus.minAffinity || 0)) continue;
      var jobMatch = !bonus.jobs || bonus.jobs.indexOf(jobId) >= 0;
      if (!jobMatch) continue;
      var pct = Math.round((bonus.multiplier - 1) * 100);
      lines.push("👤 " + npc.name + "在场: +" + pct + "%");
    }
  }

  return lines.length ? lines.join("，") : null;
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
    addDailyTransaction(
      state,
      "income",
      "bank_interest",
      interest,
      "存款利息（利率" + (rate * 100).toFixed(3) + "%）",
    );
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

/**
 * P2.9 玩家历史→世界状态效果
 * 过去的道德抉择在全局留下持续性加成/惩罚。
 * 返回一个 mods 对象，供 main.js / events.js 读取。
 *
 * @param {object} state
 * @returns {{ earningsBonus: number, luckBonus: number, priceDiscount: number,
 *             npcAffinityBonus: number, reputationLabel: string|null }}
 */
function getHistoryModifiers(state) {
  var mods = {
    earningsBonus: 1.0,
    luckBonus: 0,
    priceDiscount: 1.0,
    npcAffinityBonus: 0,
    reputationLabel: null,
  };
  var flags = state.flags || {};

  // 钱包善报：随机事件有隐形幸运加成
  if (flags._walletKarmaGood) {
    mods.luckBonus += 5;
  }

  // 帮助工友（_helpedCoworker）：打工人认你这个人
  if (flags._helpedCoworker) {
    mods.earningsBonus *= 1.03;
  }

  // 拒绝售假（_refusedFakeGoods）：诚信口碑，供货商给微小折扣
  if (flags._refusedFakeGoods) {
    mods.priceDiscount *= 0.98;
  }

  // 维权成功（_foughtWageTheft）：敢维权的人在工人圈里有威望
  if (flags._foughtWageTheft) {
    mods.earningsBonus *= 1.04;
  }

  // 诚信复利（_honestyCompound）：两项道德选择叠加后的综合声誉效果
  if (flags._honestyCompound) {
    mods.earningsBonus *= 1.06;
    mods.priceDiscount *= 0.96;
    mods.reputationLabel = "诚信经营者";
  }

  // 劳工组织者（_laborOrganizer）：打工人主心骨，工人聚集地收入额外加成
  if (flags._laborNetworkGrown || flags._laborOrganizer) {
    mods.earningsBonus *= 1.08;
    mods.npcAffinityBonus += 2;
    mods.reputationLabel = mods.reputationLabel || "打工人主心骨";
  }

  // 持证经营（_hasBusinessLicense）：合法经营声誉
  if (flags._hasBusinessLicense) {
    mods.earningsBonus *= 1.1;
    mods.reputationLabel = mods.reputationLabel || "持证经营者";
  }

  return mods;
}

// ================================================================
//  技能协同增益系统（P3.3）
//  多技能组合达到门槛时，相关工作收入持续提升
// ================================================================

var SKILL_SYNERGIES = [
  {
    id: "food_merchant",
    label: "🍜 美食创业者",
    desc: "烹饪≥Lv.10 + 销售≥Lv.10：餐饮摆摊收入+15%",
    skills: { cooking: 10, sales: 10 },
    jobBonus: 0.15,
    jobs: ["food_stall", "street_vending_food", "restaurant_assistant"],
  },
  {
    id: "handyman",
    label: "🔧 全能工匠",
    desc: "维修≥Lv.10 + 电工≥Lv.10：维修/建筑工作收入+14%",
    skills: { repair: 10, electrician: 10 },
    jobBonus: 0.14,
    jobs: [
      "repair_service",
      "school_maintenance",
      "skilled_labor_construction",
      "premium_engineering",
    ],
  },
  {
    id: "global_dev",
    label: "💻 海外外包专家",
    desc: "编程≥Lv.15 + 英语≥Lv.15：技术/教育类工作收入+22%",
    skills: { coding: 15, english: 15 },
    jobBonus: 0.22,
    jobs: [
      "tutoring",
      "customer_service_tech",
      "junior_analyst",
      "content_writing",
    ],
  },
  {
    id: "delivery_ace",
    label: "🛵 跑单达人",
    desc: "销售≥Lv.8 + 驾驶≥Lv.8：配送工作收入+12%",
    skills: { sales: 8, driving: 8 },
    jobBonus: 0.12,
    jobs: ["delivery_rider", "package_delivery"],
  },
  {
    id: "biz_elite",
    label: "📋 商务精英",
    desc: "管理≥Lv.15 + 会计≥Lv.15：仓储/商务类工作收入+18%",
    skills: { management: 15, accounting: 15 },
    jobBonus: 0.18,
    jobs: [
      "warehouse_worker",
      "security_guard",
      "data_entry",
      "restaurant_assistant",
    ],
  },
  {
    id: "trade_expert",
    label: "🌐 外贸达人",
    desc: "英语≥Lv.12 + 销售≥Lv.12：教育/客服类工作收入+20%",
    skills: { english: 12, sales: 12 },
    jobBonus: 0.2,
    jobs: ["tutoring", "customer_service_tech", "content_writing"],
  },
];

/** 返回当前激活的协同增益列表 */
function getSkillSynergies(state) {
  var active = [];
  for (var i = 0; i < SKILL_SYNERGIES.length; i++) {
    var syn = SKILL_SYNERGIES[i];
    var qualifies = true;
    for (var sk in syn.skills) {
      var skData = state.skills && state.skills[sk];
      if (!skData || skData.level < syn.skills[sk]) {
        qualifies = false;
        break;
      }
    }
    if (qualifies) active.push(syn);
  }
  return active;
}

/** 返回特定工作的协同收入加成（叠加比例，如 0.22 = 22%） */
function getSkillSynergyBonus(jobId, state) {
  var active = getSkillSynergies(state);
  var total = 0;
  for (var i = 0; i < active.length; i++) {
    if (active[i].jobs.indexOf(jobId) >= 0) {
      total += active[i].jobBonus;
    }
  }
  return total;
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
