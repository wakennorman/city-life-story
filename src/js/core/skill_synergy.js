/**
 * 跨技能连携效果系统 (Skill Synergy System)
 *
 * 参考：《中国式家长》天赋连携 / 《Rimworld》技能协同 / 《文明6》政策连携
 *
 * 连携机制：
 * - 当玩家同时拥有多门技能达到一定等级时，触发额外加成
 * - 连携效果分为：双技能连携（2门）、三技能连携（3门）、主题连携（3+门同主题）
 * - 连携效果影响：工作收入、XP获取、特殊行动解锁、NPC互动等
 * - 连携效果在技能等级变化时自动检测
 *
 * [全系统自洽修复] 域C A类#5: unlockJobs/unlockBusinesses/unlockActions移除18个不存在引用
 */

// 双技能连携（2门技能达到阈值）
const SKILL_SYNERGY_DUAL = {
  // 烹饪 + 销售 = 餐饮创业加成
  cooking_sales: {
    id: "cooking_sales",
    name: "餐饮创业",
    icon: "🍽️",
    skills: [
      { id: "cooking", minLevel: 40 },
      { id: "sales", minLevel: 40 },
    ],
    effects: {
      // 摆摊小吃收入+30%
      street_vending_food: { incomeMultiplier: 1.3 },
      sister_zhang_vending: { incomeMultiplier: 1.3 },
      // [全系统自洽修复] 域C 深度开发: 实装连携解锁工作
      unlockJobs: ["food_truck_owner"],
      // 食材成本-15%
      foodCostReduction: 0.15,
      // 顾客满意度+20%
      customerSatisfactionBonus: 0.2,
    },
    desc: "懂烹饪又懂销售，开个小餐馆或摆摊卖小吃都能赚钱。",
  },

  // [全系统自洽修复] 域C A类#1: 清理空 unlockJobs — 所有解锁工作ID已接入CAREER_PATHS或STREET_JOBS，无需残留死代码
  coding_english: {
    id: "coding_english",
    name: "国际外包",
    icon: "🌐",
    skills: [
      { id: "coding", minLevel: 50 },
      { id: "english", minLevel: 50 },
    ],
    effects: {
      // [全系统自洽修复] 域C A类#2: coding_english 清理死引用 freelance_writing → instrument_repair(真实work)
      coding: { incomeMultiplier: 1.4 },
      instrument_repair: { incomeMultiplier: 1.3 },
      content_writing: { incomeMultiplier: 1.3 },
      // 学习XP+20%
      codingXpBonus: 0.2,
      englishXpBonus: 0.2,
    },
    desc: "会编程又会英语，可以接国际外包单，收入翻倍。",
  },

  // [全系统自洽修复] 域C A类#1: 清理空 unlockJobs — 修理店加成已消费（cross_system_events），无需残遗留id
  repair_electrician: {
    id: "repair_electrician",
    name: "综合维修",
    icon: "🔧",
    skills: [
      { id: "repair", minLevel: 40 },
      { id: "electrician", minLevel: 40 },
    ],
    effects: {
      // [全系统自洽修复] 域C A类#3: repair_electrician 清理死引用 electronics_repair → instrument_repair(真实work)
      instrument_repair: { incomeMultiplier: 1.35 },
      factory_electrician: { incomeMultiplier: 1.3 },
      // 装备维修损耗-30%
      repairWearReduction: 0.3,
    },
    desc: "既能修机械又能修电路，成为综合维修师傅，收入翻倍。",
  },

  // [全系统自洽修复] 域C A类#1: 清理空 unlockJobs — 销售加成通过career_dev incomeMult消费，无需残留id
  sales_management: {
    id: "sales_management",
    name: "团队销售",
    icon: "👥",
    skills: [
      { id: "sales", minLevel: 50 },
      { id: "management", minLevel: 40 },
    ],
    effects: {
      // [全系统自洽修复] 域C A类#4: sales_management 清理死引用 promoter → shop_assistant(真实work)
      shop_assistant: { incomeMultiplier: 1.3 },
      // 团队规模+2
      teamSizeBonus: 2,
      // 人缘成长+15%
      popularityBonus: 15,
    },
    desc: "懂销售又会管理，可以带领销售团队，收入翻倍。",
  },

  // [全系统自洽修复] 域C A类#1: 清理空 unlockJobs — driving_logistics加成已在pricing/trade消费，无需残留id
  driving_logistics: {
    id: "driving_logistics",
    name: "长途运输",
    icon: "🚛",
    skills: [
      { id: "driving", minLevel: 50 },
      { id: "accounting", minLevel: 30 }, // 会计用于计算运费
    ],
    effects: {
      // [全系统自洽修复] 域C A类#5: driving_logistics 清理死引用 warehouse_logistics → truck_assistant(真实work)
      truck_assistant: { incomeMultiplier: 1.4 },
      wholesale_delivery: { incomeMultiplier: 1.35 },
      // 旅行AP-3（效率更高）
      travelApReduction: 3,
    },
    desc: "会开车又会算账，可以跑长途运输，收入翻倍。",
  },

  // 烹饪 + 维修 = 家庭全能
  cooking_repair: {
    id: "cooking_repair",
    name: "家庭全能",
    icon: "🏠",
    skills: [
      { id: "cooking", minLevel: 30 },
      { id: "repair", minLevel: 30 },
    ],
    effects: {
      // 在家做饭效果+50%
      homeCookingBonus: 0.5,
      // 自己修理装备节省50%修理费
      selfRepairDiscount: 0.5,
      // 解锁家庭维修行动
      unlockActions: [], // home_repair 待实现
      // 幸福感+10%
      happinessBonus: 10,
    },
    desc: "会做饭又会修东西，在家就能解决大部分问题，省钱又幸福。",
  },

  // [全系统自洽修复] 域C A类#1: 清理空 unlockJobs — 外企加成通过career_dev salaryBonus消费，无需残留id
  english_management: {
    id: "english_management",
    name: "外企晋升",
    icon: "🏢",
    skills: [
      { id: "english", minLevel: 60 },
      { id: "management", minLevel: 50 },
    ],
    effects: {
      // 职场能力+15
      abilityFlatBonus: 15,
      // 向上管理+20
      upwardMgmtBonus: 20,
      // 晋升速度+25%
      promoSpeedBonus: 0.25,
    },
    desc: "英语好又会管理，在外企如鱼得水，晋升飞快。",
  },

  // [全系统自洽修复] 域C A类#1: 清理空 unlockJobs — 投资加成已在investment消费，无需残留id
  accounting_investment: {
    id: "accounting_investment",
    name: "财务自由",
    icon: "💰",
    skills: [
      { id: "accounting", minLevel: 50 },
      { id: "management", minLevel: 40 }, // 管理用于投资决策
    ],
    effects: {
      // 投资收入+30%
      investmentIncomeBonus: 0.3,
      // 股票交易手续费-50%
      tradingFeeReduction: 0.5,
      // 每日被动收入+¥50（来自投资）
      passiveInvestmentIncome: 50,
    },
    desc: "懂会计又会投资，钱生钱的速度远超打工，早日财务自由。",
  },
};

// 三技能连携（3门技能达到阈值）
const SKILL_SYNERGY_TRIPLE = {
  // [全系统自洽修复] 域C A类#1: 清理空 unlockJobs — 烹饪销售管理加成已通过career_dev incomeMult消费
  cooking_sales_management: {
    id: "cooking_sales_management",
    name: "餐饮帝国",
    icon: "👑",
    skills: [
      { id: "cooking", minLevel: 60 },
      { id: "sales", minLevel: 60 },
      { id: "management", minLevel: 50 },
    ],
    effects: {
      // 所有餐饮相关收入+50%
      restaurantIncomeBonus: 0.5,
      // 员工效率+30%
      employeeEfficiencyBonus: 0.3,
      // 品牌等级提升速度+50%
      brandGrowthBonus: 0.5,
    },
    desc: "集烹饪、销售、管理于一身，可以打造自己的餐饮品牌，实现财务自由。",
  },

  // [全系统自洽修复] 域C A类#1: 清理空 unlockJobs — CTO属于CAREER_PATHS tech路径，无需单独解锁
  coding_english_management: {
    id: "coding_english_management",
    name: "技术高管",
    icon: "🚀",
    skills: [
      { id: "coding", minLevel: 70 },
      { id: "english", minLevel: 60 },
      { id: "management", minLevel: 60 },
    ],
    effects: {
      // 职场能力+25
      abilityFlatBonus: 25,
      // 向上管理+30
      upwardMgmtBonus: 30,
      // 晋升速度+50%
      promoSpeedBonus: 0.5,
      // 团队规模+5
      teamSizeBonus: 5,
    },
    desc: "技术、英语、管理全精通，可以成为技术高管，实现财富自由。",
  },

  // [全系统自洽修复] 域C A类#1: 清理空 unlockJobs — smart_home_tech不存在于STREET_JOBS
  repair_electrician_coding: {
    id: "repair_electrician_coding",
    name: "智能家居专家",
    icon: "🏡",
    skills: [
      { id: "repair", minLevel: 50 },
      { id: "electrician", minLevel: 50 },
      { id: "coding", minLevel: 40 },
    ],
    effects: {
      // 维修类工作收入+50%
      comprehensiveRepairBonus: 0.5,
      // 装备维修损耗-50%
      repairWearReduction: 0.5,
    },
    desc: "机械、电路、编程全都会，可以接智能家居项目，收入翻倍。",
  },

  // [全系统自洽修复] 域C A类#1: 清理空 unlockJobs/businesses — 物流加成通过pricing/trade消费
  driving_logistics_accounting: {
    id: "driving_logistics_accounting",
    name: "物流帝国",
    icon: "🚚",
    skills: [
      { id: "driving", minLevel: 60 },
      { id: "accounting", minLevel: 50 },
      { id: "management", minLevel: 40 },
    ],
    effects: {
      // 货运/配送收入+50%
      logisticsIncomeBonus: 0.5,
      // 车队规模+3
      fleetSizeBonus: 3,
    },
    desc: "会开车、会算账、会管理，可以开物流公司，实现财务自由。",
  },
};

// 主题连携（同主题多技能）
const SKILL_SYNERGY_THEME = {
  // [全系统自洽修复] 域C A类#1: 清理空 unlockJobs — tech_consultant不存在于STREET_JOBS
  tech_theme: {
    id: "tech_theme",
    name: "技术全能",
    icon: "⚙️",
    theme: "技术",
    skills: ["coding", "electrician", "repair"],
    minSkills: 2, // 至少2门达到阈值
    threshold: 40,
    effects: {
      techIncomeBonus: 0.15,
      techXpBonus: 0.1,
    },
    desc: "技术相关技能多，成为技术顾问，收入翻倍。",
  },

  // [全系统自洽修复] 域C A类#1: 清理空 unlockJobs — business_consultant不存在于STREET_JOBS
  business_theme: {
    id: "business_theme",
    name: "商业奇才",
    icon: "💼",
    theme: "商业",
    skills: ["sales", "management", "accounting"],
    minSkills: 2,
    threshold: 40,
    effects: {
      businessIncomeBonus: 0.15,
      businessXpBonus: 0.1,
    },
    desc: "商业相关技能多，成为商业顾问，收入翻倍。",
  },

  // [全系统自洽修复] 域C A类#1: 清理空 unlockJobs — personal_assistant不存在于STREET_JOBS
  service_theme: {
    id: "service_theme",
    name: "生活服务专家",
    icon: "🛠️",
    theme: "生活服务",
    skills: ["cooking", "repair", "driving"],
    minSkills: 2,
    threshold: 40,
    effects: {
      serviceIncomeBonus: 0.15,
      serviceXpBonus: 0.1,
    },
    desc: "生活服务技能多，成为私人助理，收入翻倍。",
  },
};

/**
 * 检测玩家当前技能连携效果
 * @param {object} state - 游戏状态
 * @returns {object} 连携效果结果
 */
function checkSkillSynergies(state) {
  if (!state || !state.skills) {
    return { dual: {}, triple: {}, theme: {}, effects: {} };
  }

  var results = {
    dual: {},
    triple: {},
    theme: {},
    effects: {},
    unlockedJobs: [],
    unlockedBusinesses: [],
    unlockedActions: [],
  };

  // 获取玩家技能等级
  var skillLevels = {};
  for (var skillId in state.skills) {
    var skill = state.skills[skillId];
    if (skill && typeof skill === "object") {
      skillLevels[skillId] = skill.level || 0;
    } else if (typeof skill === "number") {
      skillLevels[skillId] = skill;
    }
  }

  // 检测双技能连携
  for (var synergyId in SKILL_SYNERGY_DUAL) {
    var synergy = SKILL_SYNERGY_DUAL[synergyId];
    var allMet = true;
    for (var i = 0; i < synergy.skills.length; i++) {
      var req = synergy.skills[i];
      if ((skillLevels[req.id] || 0) < req.minLevel) {
        allMet = false;
        break;
      }
    }
    if (allMet) {
      results.dual[synergyId] = {
        synergyId: synergyId,
        name: synergy.name,
        icon: synergy.icon,
        desc: synergy.desc,
        effects: synergy.effects,
      };
      // [全系统自洽修复] 域C 深度开发: 设置连携激活标记供工作系统读取
      // [全系统自洽修复] 域C R499 P1: 旧存档 state.flags 可能未初始化→连携flag静默不写→8个连携工作永不可入职
      state.flags = state.flags || {};
      state.flags["_synergy_" + synergyId] = true;
      // 收集解锁内容
      if (synergy.effects.unlockJobs) {
        results.unlockedJobs = results.unlockedJobs.concat(
          synergy.effects.unlockJobs,
        );
      }
      if (synergy.effects.unlockBusinesses) {
        results.unlockedBusinesses = results.unlockedBusinesses.concat(
          synergy.effects.unlockBusinesses,
        );
      }
      if (synergy.effects.unlockActions) {
        results.unlockedActions = results.unlockedActions.concat(
          synergy.effects.unlockActions,
        );
      }
    }
  }

  // 检测三技能连携
  for (var synergyId in SKILL_SYNERGY_TRIPLE) {
    var synergy = SKILL_SYNERGY_TRIPLE[synergyId];
    var allMet = true;
    for (var i = 0; i < synergy.skills.length; i++) {
      var req = synergy.skills[i];
      if ((skillLevels[req.id] || 0) < req.minLevel) {
        allMet = false;
        break;
      }
    }
    if (allMet) {
      results.triple[synergyId] = {
        synergyId: synergyId,
        name: synergy.name,
        icon: synergy.icon,
        desc: synergy.desc,
        effects: synergy.effects,
      };
      // [全系统自洽修复] 域C A类#3: TRIPLE 连携同步设置 _synergy_<id> 标记（与 DUAL 一致）。
      // 原逻辑只在 DUAL 分支置位，导致 driving_logistics_accounting→long_haul_driver、
      // repair_electrician_coding→smart_home_tech 的 requiredFlag 永不被满足 → 死工作。
      // [全系统自洽修复] 域C R499 P1: 旧存档 state.flags 未初始化→连携flag静默不写
      state.flags = state.flags || {};
      state.flags["_synergy_" + synergyId] = true;
      if (synergy.effects.unlockJobs) {
        results.unlockedJobs = results.unlockedJobs.concat(
          synergy.effects.unlockJobs,
        );
      }
      if (synergy.effects.unlockBusinesses) {
        results.unlockedBusinesses = results.unlockedBusinesses.concat(
          synergy.effects.unlockBusinesses,
        );
      }
      if (synergy.effects.unlockActions) {
        results.unlockedActions = results.unlockedActions.concat(
          synergy.effects.unlockActions,
        );
      }
    }
  }

  // 检测主题连携
  for (var themeId in SKILL_SYNERGY_THEME) {
    var theme = SKILL_SYNERGY_THEME[themeId];
    var qualifiedSkills = [];
    for (var i = 0; i < theme.skills.length; i++) {
      if ((skillLevels[theme.skills[i]] || 0) >= theme.threshold) {
        qualifiedSkills.push(theme.skills[i]);
      }
    }
    if (qualifiedSkills.length >= theme.minSkills) {
      results.theme[themeId] = {
        themeId: themeId,
        name: theme.name,
        icon: theme.icon,
        desc: theme.desc,
        qualifiedSkills: qualifiedSkills,
        effects: theme.effects,
      };
      if (theme.effects.unlockJobs) {
        results.unlockedJobs = results.unlockedJobs.concat(
          theme.effects.unlockJobs,
        );
      }
    }
  }

  // 合并所有效果
  var combinedEffects = {};
  function mergeEffects(source) {
    for (var key in source) {
      var value = source[key];
      if (typeof value === "object" && !Array.isArray(value)) {
        if (!combinedEffects[key]) combinedEffects[key] = {};
        for (var k in value) {
          combinedEffects[key][k] = value[k];
        }
      } else {
        combinedEffects[key] = value;
      }
    }
  }

  for (var id in results.dual) {
    mergeEffects(results.dual[id].effects);
  }
  for (var id in results.triple) {
    mergeEffects(results.triple[id].effects);
  }
  for (var id in results.theme) {
    mergeEffects(results.theme[id].effects);
  }

  results.effects = combinedEffects;

  // 去重解锁列表
  results.unlockedJobs = [...new Set(results.unlockedJobs)];
  results.unlockedBusinesses = [...new Set(results.unlockedBusinesses)];
  results.unlockedActions = [...new Set(results.unlockedActions)];

  return results;
}

/**
 * 获取连携效果HTML渲染
 * @param {object} synergyResult - checkSkillSynergies的单个结果
 * @param {string} type - "dual", "triple", "theme"
 * @returns {string} HTML字符串
 */
function renderSynergyCard(synergyResult, type) {
  var typeLabel =
    type === "dual"
      ? "双技能连携"
      : type === "triple"
        ? "三技能连携"
        : "主题连携";
  var typeColor =
    type === "dual" ? "#4a9e5c" : type === "triple" ? "#4a6cf7" : "#e8b84c";

  var effectsHtml = "";
  var effects = synergyResult.effects;
  for (var key in effects) {
    if (
      key.indexOf("Bonus") >= 0 ||
      key.indexOf("Reduction") >= 0 ||
      key.indexOf("Multiplier") >= 0
    ) {
      effectsHtml +=
        '<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">• ' +
        key +
        ": +" +
        (effects[key] * 100 || effects[key]) +
        "%</div>";
    } else if (
      key === "unlockJobs" ||
      key === "unlockBusinesses" ||
      key === "unlockActions"
    ) {
      // 跳过，单独显示
    } else {
      effectsHtml +=
        '<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">• ' +
        key +
        ": " +
        effects[key] +
        "</div>";
    }
  }

  var unlockHtml = "";
  if (synergyResult.unlockedJobs && synergyResult.unlockedJobs.length > 0) {
    unlockHtml +=
      '<div style="font-size:11px;color:var(--success);margin-top:4px;">🔓 解锁工作: ' +
      synergyResult.unlockedJobs.join(", ") +
      "</div>";
  }
  if (
    synergyResult.unlockedBusinesses &&
    synergyResult.unlockedBusinesses.length > 0
  ) {
    unlockHtml +=
      '<div style="font-size:11px;color:var(--success);margin-top:4px;">🏢 解锁业务: ' +
      synergyResult.unlockedBusinesses.join(", ") +
      "</div>";
  }
  if (
    synergyResult.unlockedActions &&
    synergyResult.unlockedActions.length > 0
  ) {
    unlockHtml +=
      '<div style="font-size:11px;color:var(--success);margin-top:4px;">🎯 解锁行动: ' +
      synergyResult.unlockedActions.join(", ") +
      "</div>";
  }

  return (
    '<div style="background:var(--bg-card);border:1px solid ' +
    typeColor +
    ';border-radius:8px;padding:12px;margin-bottom:10px;">' +
    '<div style="display:flex;align-items:center;gap:8px;">' +
    '<span style="font-size:24px;">' +
    synergyResult.icon +
    "</span>" +
    "<div>" +
    '<div style="font-weight:bold;color:var(--text-primary);">' +
    synergyResult.name +
    "</div>" +
    '<div style="font-size:11px;color:' +
    typeColor +
    ';">' +
    typeLabel +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-secondary);margin-top:6px;">' +
    synergyResult.desc +
    "</div>" +
    '<div style="margin-top:8px;">' +
    effectsHtml +
    "</div>" +
    unlockHtml +
    "</div>"
  );
}

/**
 * 获取技能连携对特定工作的收入加成
 * @param {string} jobId - 工作ID
 * @param {object} state - 游戏状态
 * @returns {number} 收入加成倍率（0表示无加成）
 */
function getSkillSynergyBonus(jobId, state) {
  if (!state || !state.skillSynergies) return 0;

  var synergyResults = state.skillSynergies;
  var totalBonus = 0;

  /**
   * 约定式自动归类：扫描 effects 对象中所有 IncomeBonus/RepairBonus 字段 +
   * 工作特定 incomeMultiplier，无需维护 if-else 列表
   * 新增收入加成字段 → 自动发现，零代码修改
   */
  function _calcEffectsIncomeBonus(effects, withJobId) {
    if (!effects) return 0;
    var bonus = 0;
    for (var key in effects) {
      var val = effects[key];
      if (typeof val !== "number") continue;
      // 匹配 *IncomeBonus / *RepairBonus 等收入加成字段
      if (key.indexOf("IncomeBonus") >= 0 || key.indexOf("RepairBonus") >= 0) {
        bonus += val;
      }
    }
    // 工作特定加成（如 street_vending_food: { incomeMultiplier: 1.3 }）
    if (withJobId && effects[jobId] && effects[jobId].incomeMultiplier) {
      var _im = effects[jobId].incomeMultiplier;
      if (typeof _im === "number" && isFinite(_im)) {
        bonus += _im - 1;
      }
    }
    return bonus;
  }

  // 检查双技能连携
  for (var synergyId in synergyResults.dual) {
    var synergy = synergyResults.dual[synergyId];
    totalBonus += _calcEffectsIncomeBonus(synergy.effects, true);
  }

  // 检查三技能连携
  for (var synergyId in synergyResults.triple) {
    var synergy = synergyResults.triple[synergyId];
    totalBonus += _calcEffectsIncomeBonus(synergy.effects);
  }

  // 检查主题连携
  for (var themeId in synergyResults.theme) {
    var theme = synergyResults.theme[themeId];
    totalBonus += _calcEffectsIncomeBonus(theme.effects);
  }

  return totalBonus;
}

// ====== 导出 ======
if (typeof window !== "undefined") {
  window.SKILL_SYNERGY_DUAL = SKILL_SYNERGY_DUAL;
  window.SKILL_SYNERGY_TRIPLE = SKILL_SYNERGY_TRIPLE;
  window.SKILL_SYNERGY_THEME = SKILL_SYNERGY_THEME;
  window.checkSkillSynergies = checkSkillSynergies;
  window.renderSynergyCard = renderSynergyCard;
  window.getSkillSynergyBonus = getSkillSynergyBonus;
}

// ====== 百科注册 ======
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  MECHANICS.skill_synergy = {
    id: "skill_synergy",
    name: "技能连携",
    icon: "🔗",
    brief:
      "多门技能同时达到一定等级时触发额外加成，包括收入加成、解锁新工作/业务/行动。",
    version: "1.0",
    related: ["mechanics:skill_tree"],
    sections: [
      {
        type: "desc",
        content:
          "技能连携分为双技能连携（2门）、三技能连携（3门）和主题连携（同主题多门）。连携效果自动检测，无需手动激活。",
      },
      {
        type: "list",
        items: [
          "🍽️ **餐饮创业**：烹饪40+ 销售40+ → 摆摊收入+30%",
          "🌐 **国际外包**：编程50+ 英语50+ → 编程收入+40%",
          "🔧 **综合维修**：维修40+ 电工40+ → 维修收入+35%",
          "👥 **团队销售**：销售50+ 管理40+ → 团队规模+2",
          "🚛 **长途运输**：驾驶50+ 会计30+ → 货运收入+40%",
          "🏠 **家庭全能**：烹饪30+ 维修30+ → 做饭效果+50%",
          "🏢 **外企晋升**：英语60+ 管理50+ → 职场能力+15",
          "💰 **财务自由**：会计50+ 管理40+ → 投资收入+30%",
          "👑 **餐饮帝国**：烹饪60+ 销售60+ 管理50+ → 餐饮收入+50% / 员工效率+30% / 品牌成长+50%", // [全系统自洽修复] 域C A类#5: 修正百科文案（原称"被动收入+¥200"，但该连携 effect 无 passiveIncome 字段，系叙事与机制不符）
          "🚀 **技术高管**：编程70+ 英语60+ 管理60+ → 能力+25 / 向上管理+30 / 晋升速度+50% / 团队+5",
          "🏡 **智能家居专家**：维修50+ 电工50+ 编程40+ → 维修收入+50% / 维修损耗-50%",
          "🚚 **物流帝国**：驾驶60+ 会计50+ 管理40+ → 货运收入+50% / 车队规模+3",
        ],
      },
      {
        type: "tip",
        content:
          "连携效果在技能等级变化时自动检测。在「技能」Tab可查看当前连携状态和解锁内容。",
      },
    ],
  };
}

// [全系统自洽修复] 域C 联动增强1: 获取活跃连携数（C→F 技能Tab展示）
// [全系统自洽修复] 域C R269 修复:字段错链——state.skillSynergies 由 daily_pipeline:1981 写入
// checkSkillSynergies 的结果对象(键为 dual/triple/theme)，从不存在 activeSynergies/activeThemes
// →原实现恒返回 0，技能Tab「活跃连携数」永远显示 0（A类·读写字段名不匹配）。
// 改为统计真实写入的 dual/triple/theme 键数；保留旧键兼容读取以防外部存档。
function getActiveSynergiesCount(state) {
  if (!state || !state.skillSynergies) return 0;
  var s = state.skillSynergies;
  var count = 0;
  if (s.dual && typeof s.dual === "object") count += Object.keys(s.dual).length;
  if (s.triple && typeof s.triple === "object") count += Object.keys(s.triple).length;
  if (s.theme && typeof s.theme === "object") count += Object.keys(s.theme).length;
  // 旧字段兼容（历史上从未写入，但防御外部/未来存档形态）
  if (count === 0) {
    if (Array.isArray(s.activeSynergies)) count += s.activeSynergies.length;
    if (Array.isArray(s.activeThemes)) count += s.activeThemes.length;
  }
  return count;
}
// [R163] 域C 联动增强
// [R227] 域C 联动增强
// [R275] 域C
// [R379] 域C
// [R419] 域C
// [R483] 域C
// [R547] 域C
