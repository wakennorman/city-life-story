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
      // 解锁新工作：餐饮摊主
      unlockJobs: ["restaurant_owner"],
      // 食材成本-15%
      foodCostReduction: 0.15,
      // 顾客满意度+20%
      customerSatisfactionBonus: 0.2,
    },
    desc: "懂烹饪又懂销售，开个小餐馆或摆摊卖小吃都能赚钱。",
  },

  // 编程 + 英语 = 国际外包
  coding_english: {
    id: "coding_english",
    name: "国际外包",
    icon: "🌐",
    skills: [
      { id: "coding", minLevel: 50 },
      { id: "english", minLevel: 50 },
    ],
    effects: {
      // 编程类工作收入+40%
      coding: { incomeMultiplier: 1.4 },
      freelance_writing: { incomeMultiplier: 1.3 },
      content_writing: { incomeMultiplier: 1.3 },
      // 解锁国际外包工作
      unlockJobs: ["international_freelance", "foreign_client_coding"],
      // 学习XP+20%
      codingXpBonus: 0.2,
      englishXpBonus: 0.2,
    },
    desc: "会编程又会英语，可以接国际外包单，收入翻倍。",
  },

  // 维修 + 电工 = 综合维修
  repair_electrician: {
    id: "repair_electrician",
    name: "综合维修",
    icon: "🔧",
    skills: [
      { id: "repair", minLevel: 40 },
      { id: "electrician", minLevel: 40 },
    ],
    effects: {
      // 维修类工作收入+35%
      instrument_repair: { incomeMultiplier: 1.35 },
      electronics_repair: { incomeMultiplier: 1.35 },
      factory_electrician: { incomeMultiplier: 1.3 },
      // 解锁综合维修工作
      unlockJobs: ["comprehensive_repairman"],
      // 装备维修损耗-30%
      repairWearReduction: 0.3,
    },
    desc: "既能修机械又能修电路，成为综合维修师傅，收入翻倍。",
  },

  // 销售 + 管理 = 团队销售
  sales_management: {
    id: "sales_management",
    name: "团队销售",
    icon: "👥",
    skills: [
      { id: "sales", minLevel: 50 },
      { id: "management", minLevel: 40 },
    ],
    effects: {
      // 销售类工作收入+30%
      shop_assistant: { incomeMultiplier: 1.3 },
      promoter: { incomeMultiplier: 1.3 },
      // 解锁团队销售管理
      unlockJobs: ["sales_team_lead"],
      // 团队规模+2
      teamSizeBonus: 2,
      // 人缘成长+15%
      popularityBonus: 15,
    },
    desc: "懂销售又会管理，可以带领销售团队，收入翻倍。",
  },

  // 驾驶 + 物流 = 长途运输
  driving_logistics: {
    id: "driving_logistics",
    name: "长途运输",
    icon: "🚛",
    skills: [
      { id: "driving", minLevel: 50 },
      { id: "accounting", minLevel: 30 }, // 会计用于计算运费
    ],
    effects: {
      // 货运/配送收入+40%
      truck_assistant: { incomeMultiplier: 1.4 },
      warehouse_logistics: { incomeMultiplier: 1.3 },
      wholesale_delivery: { incomeMultiplier: 1.35 },
      // 解锁长途运输工作
      unlockJobs: ["long_haul_driver", "logistics_manager"],
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
      unlockActions: ["home_repair"],
      // 幸福感+10%
      happinessBonus: 10,
    },
    desc: "会做饭又会修东西，在家就能解决大部分问题，省钱又幸福。",
  },

  // 英语 + 管理 = 外企晋升
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
      // 解锁外企管理岗位
      unlockJobs: ["foreign_company_manager", "international_project_lead"],
      // 晋升速度+25%
      promoSpeedBonus: 0.25,
    },
    desc: "英语好又会管理，在外企如鱼得水，晋升飞快。",
  },

  // 会计 + 投资 = 财务自由
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
      // 解锁高级投资分析
      unlockActions: ["advanced_investment_analysis"],
      // 每日被动收入+¥50（来自投资）
      passiveInvestmentIncome: 50,
    },
    desc: "懂会计又会投资，钱生钱的速度远超打工，早日财务自由。",
  },
};

// 三技能连携（3门技能达到阈值）
const SKILL_SYNERGY_TRIPLE = {
  // 烹饪 + 销售 + 管理 = 餐饮帝国
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
      // 解锁连锁餐厅
      unlockBusinesses: ["restaurant_chain"],
      // 每日被动收入+¥200
      passiveRestaurantIncome: 200,
      // 员工效率+30%
      employeeEfficiencyBonus: 0.3,
      // 品牌等级提升速度+50%
      brandGrowthBonus: 0.5,
    },
    desc: "集烹饪、销售、管理于一身，可以打造自己的餐饮品牌，实现财务自由。",
  },

  // 编程 + 英语 + 管理 = 技术高管
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
      // 解锁CTO岗位
      unlockJobs: ["cto", "tech_director"],
      // 晋升速度+50%
      promoSpeedBonus: 0.5,
      // 团队规模+5
      teamSizeBonus: 5,
      // 每日被动收入+¥300（来自股票期权）
      passiveStockIncome: 300,
    },
    desc: "技术、英语、管理全精通，可以成为技术高管，实现财富自由。",
  },

  // 维修 + 电工 + 编程 = 智能家居专家
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
      // 解锁智能家居安装工作
      unlockJobs: ["smart_home_installer", "iot_developer"],
      // 装备维修损耗-50%
      repairWearReduction: 0.5,
      // 每日被动收入+¥100（来自智能家居项目）
      passiveSmartHomeIncome: 100,
    },
    desc: "机械、电路、编程全都会，可以接智能家居项目，收入翻倍。",
  },

  // 驾驶 + 物流 + 会计 = 物流帝国
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
      // 解锁物流公司
      unlockBusinesses: ["logistics_company"],
      // 每日被动收入+¥250
      passiveLogisticsIncome: 250,
      // 车队规模+3
      fleetSizeBonus: 3,
    },
    desc: "会开车、会算账、会管理，可以开物流公司，实现财务自由。",
  },
};

// 主题连携（同主题多技能）
const SKILL_SYNERGY_THEME = {
  // 技术主题：编程 + 电工 + 维修
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
      unlockJobs: ["tech_consultant"],
    },
    desc: "技术相关技能多，成为技术顾问，收入翻倍。",
  },

  // 商业主题：销售 + 管理 + 会计
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
      unlockJobs: ["business_consultant"],
    },
    desc: "商业相关技能多，成为商业顾问，收入翻倍。",
  },

  // 生活服务主题：烹饪 + 维修 + 驾驶
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
      unlockJobs: ["personal_assistant"],
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
      bonus += effects[jobId].incomeMultiplier - 1;
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
          "👑 **餐饮帝国**：烹饪60+ 销售60+ 管理50+ → 被动收入+¥200",
          "🚀 **技术高管**：编程70+ 英语60+ 管理60+ → 被动收入+¥300",
          "🏡 **智能家居专家**：维修50+ 电工50+ 编程40+ → 被动收入+¥100",
          "🚚 **物流帝国**：驾驶60+ 会计50+ 管理40+ → 被动收入+¥250",
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
