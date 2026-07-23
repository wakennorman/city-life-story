/**
 * 多周目企业记忆 — 跨周目持久化层
 *
 * P2#10：前一局让某公司倒闭，新一局该公司已不存在于地图上。
 * 使用独立 localStorage 键（city_life_story_multiverse）存储，不依赖存档槽位。
 *
 * 数据结构：
 * {
 *   version: "1.0",
 *   totalPlaythroughs: 0,          // 累计完成周目数
 *   lastUpdated: 0,                // 时间戳
 *   deceasedCompanies: {           // 已倒闭公司记录
 *     "star_tech": {
 *       diedAt: { day: 200, age: 25, phase: "corporate" },
 *       cause: "资金链断裂",
 *       deathEvent: "cash_crisis",
 *       killedByPlayer: false,     // 玩家是否直接导致（就职时摆烂/做空）
 *       playerWasEmployee: false,  // 玩家曾在此公司工作
 *       playthrough: 1,            // 第几周目倒闭的
 *       finalHealth: 3,
 *       finalPhase: "dying",
 *       epitaph: "星辰科技，一代AI明星，终因资金断裂而陨落。",
 *     }
 *   }
 * }
 */

const MULTIVERSE_KEY = "city_life_story_multiverse";
const MULTIVERSE_VERSION = "2.0";

/** 公司中文名映射（本地副本，避免循环依赖） */
function _coName(cid) {
  var names = {
    star_tech: "星辰科技",
    byte_dragon: "字节龙",
    cloud_giant: "云巨人",
    game_fun: "好玩游戏",
    safe_fin: "安信金融科技",
  };
  return names[cid] || cid;
}

/** 读取多周目记忆 */
function getMultiRunMemory() {
  try {
    var raw = localStorage.getItem(MULTIVERSE_KEY);
    if (raw) {
      var data = JSON.parse(raw);
      if (data && data.version === MULTIVERSE_VERSION) return data;
    }
  } catch (e) {
    /* localStorage 不可用或数据损坏 */
  }
  return {
    version: MULTIVERSE_VERSION,
    totalPlaythroughs: 0,
    lastUpdated: Date.now(),
    deceasedCompanies: {},
    ipoHistory: [], // IPO 历史
    mergerHistory: {}, // 合并历史
    legendaryCompanies: [], // 传奇企业
    industryEvolution: {}, // 行业格局变迁
    legacyEvents: [], // 倒闭遗产事件
    firstSeenAt: Date.now(),
  };
}

/** 写入多周目记忆 */
function saveMultiRunMemory(data) {
  try {
    data.lastUpdated = Date.now();
    localStorage.setItem(MULTIVERSE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("多周目记忆保存失败:", e);
  }
}

/** 检查某公司是否已在历史中倒闭 */
function isCompanyDeceased(cid) {
  var memory = getMultiRunMemory();
  return !!memory.deceasedCompanies[cid];
}

/** 获取所有已倒闭公司列表 — 由 enterprise_fate.js 提供完整实现 */
// [全系统自洽修复] 域G: 去除重复函数声明 — multi_run_memory.js 不再定义 getDeceasedCompanies
// enterprise_fate.js 已提供更完整的实现（含详细公司信息），加载顺序在前面

/** 获取所有仍存活的原始公司ID（过滤掉已倒闭的） */
function getSurvivingCompanyIds() {
  var memory = getMultiRunMemory();
  return Object.keys(COMPANIES_RAW || COMPANIES || {}).filter(function (c) {
    // 兼容：COMPANIES 是数组，取其 id
    return true;
  }).length
    ? typeof COMPANIES !== "undefined"
      ? COMPANIES.filter(function (c) {
          return !memory.deceasedCompanies[c.id];
        }).map(function (c) {
          return c.id;
        })
      : []
    : [];
}

/**
 * 记录公司倒闭 — 由企业命运系统调用
 * @param {string} cid 公司ID
 * @param {object} state 当前游戏状态
 * @param {string} cause 倒闭原因描述
 * @param {string} deathEvent 倒闭触发的事件ID
 */
function recordCompanyDeath(cid, state, cause, deathEvent) {
  var memory = getMultiRunMemory();
  if (memory.deceasedCompanies[cid]) return; // 已记录过

  var co =
    state.enterpriseFate &&
    state.enterpriseFate.companies &&
    state.enterpriseFate.companies[cid];
  var playerWasEmployee =
    state.corporate &&
    (typeof state.corporate.company === "string"
      ? state.corporate.company === cid
      : state.corporate.company && state.corporate.company.id === cid);

  memory.deceasedCompanies[cid] = {
    diedAt: {
      day: state.player.day || 0,
      age: state.player.age || 20,
      phase: state.player.phase || "unknown",
    },
    cause: cause || "未知原因",
    deathEvent: deathEvent || "unknown",
    killedByPlayer: false,
    playerWasEmployee: !!playerWasEmployee,
    playthrough: memory.totalPlaythroughs + 1,
    finalHealth: co ? Math.round(co.health) : 0,
    finalPhase: co ? co.phase : "unknown",
    epitaph: generateEpitaph(cid, cause, co),
  };

  saveMultiRunMemory(memory);
  return memory.deceasedCompanies[cid];
}

/** 生成长眠词 */
function generateEpitaph(cid, cause, co) {
  var name = _coName(cid);
  var industry =
    typeof getCompanyIndustry === "function" ? getCompanyIndustry(cid) : "科技";
  if (cause && cause.indexOf("收购") >= 0) {
    return name + "，曾经在" + industry + "领域叱咤风云，最终被巨头收入囊中。";
  } else if (cause && cause.indexOf("断裂") >= 0) {
    return name + "，一代" + industry + "明星，终因资金链断裂而陨落。";
  } else if (cause && cause.indexOf("丑闻") >= 0) {
    return name + "，在" + industry + "行业曾风光无限，却因丑闻走向终结。";
  }
  return name + "，曾在" + industry + "领域留下印记，如今已不复存在。";
}

/**
 * 记录周目结束 — 由游戏结束/胜利时调用
 * 检查所有公司的最终状态，将濒死公司记录为倒闭
 * @param {object} state 当前游戏状态
 */
function recordPlaythroughEnd(state) {
  var memory = getMultiRunMemory();
  memory.totalPlaythroughs++;

  // 遍历企业命运，记录濒死公司
  if (state.enterpriseFate && state.enterpriseFate.companies) {
    for (var cid in state.enterpriseFate.companies) {
      var co = state.enterpriseFate.companies[cid];
      if (!co) continue;

      // 已记录过或健康度很低视为倒闭
      if (memory.deceasedCompanies[cid]) continue;

      if (co.ceasedExistence || co.phase === "dying" || co.health < 8) {
        var cause = "经营不善，在竞争中逐渐消亡";
        var deathEvent = "natural_death";
        // 从 fateEventHistory 中找最后一条事件作为死因
        if (co.fateEventHistory && co.fateEventHistory.length > 0) {
          var last = co.fateEventHistory[co.fateEventHistory.length - 1];
          cause = last.description;
          deathEvent = last.eventType;
        }
        recordCompanyDeath(cid, state, cause, deathEvent);
      }
    }
  }

  saveMultiRunMemory(memory);
}

/**
 * 获取已倒闭公司的铭文列表（用于百科/UI展示）
 */
function getDeceasedCompanyEpitaphs() {
  var memory = getMultiRunMemory();
  var list = [];
  for (var cid in memory.deceasedCompanies) {
    var d = memory.deceasedCompanies[cid];
    list.push({
      id: cid,
      name: _coName(cid),
      epitaph: d.epitaph,
      diedAt: d.diedAt,
      cause: d.cause,
      playthrough: d.playthrough,
      playerWasEmployee: d.playerWasEmployee,
    });
  }
  // 按倒闭周目排序
  list.sort(function (a, b) {
    return a.playthrough - b.playthrough;
  });
  return list;
}

/**
 * 重置多周目记忆（调试/重置用）
 */
function resetMultiRunMemory() {
  saveMultiRunMemory({
    version: MULTIVERSE_VERSION,
    totalPlaythroughs: 0,
    lastUpdated: Date.now(),
    deceasedCompanies: {},
    ipoHistory: [],
    mergerHistory: {},
    legendaryCompanies: [],
    industryEvolution: {},
    legacyEvents: [],
    firstSeenAt: Date.now(),
  });
}

/**
 * 记录倒闭遗产事件 — 由企业命运系统调用
 * @param {object} aftermath 遗产事件数据
 * @param {object} state 游戏状态
 */
function recordLegacyEventToMemory(aftermath, state) {
  var memory = getMultiRunMemory();
  if (!memory.legacyEvents) memory.legacyEvents = [];

  var event = {
    day: state.player.day,
    type: aftermath.type,
    sourceCompanyId:
      aftermath.sourceCompanyId ||
      aftermath.newCompanyId ||
      aftermath.targetCompanyId,
    sourceCompanyName:
      aftermath.sourceCompanyName ||
      aftermath.newCompanyName ||
      aftermath.targetCompanyName,
    details: aftermath,
    playthrough: memory.totalPlaythroughs + 1,
  };

  memory.legacyEvents.push(event);
  saveMultiRunMemory(memory);
  return event;
}

/**
 * 获取所有遗产事件
 */
function getLegacyEvents() {
  var memory = getMultiRunMemory();
  return memory.legacyEvents || [];
}

/**
 * 获取某公司的遗产事件
 */
function getLegacyEventsBySource(sourceCompanyId) {
  var memory = getMultiRunMemory();
  return (memory.legacyEvents || []).filter(function (e) {
    return e.sourceCompanyId === sourceCompanyId;
  });
}

// ====== 增强功能：IPO 历史 ======

/**
 * 记录 IPO 历史
 * @param {string} cid 公司ID
 * @param {object} state 游戏状态
 * @param {number} valuation 估值
 */
function recordIpoHistory(cid, state, valuation) {
  var memory = getMultiRunMemory();
  var name = _coName(cid);
  var industry =
    typeof getCompanyIndustry === "function" ? getCompanyIndustry(cid) : "未知";

  memory.ipoHistory.push({
    cid: cid,
    name: name,
    industry: industry,
    ipoDay: state.player.day,
    ipoRun: memory.totalPlaythroughs + 1,
    valuation: valuation,
    recordedAt: Date.now(),
  });

  // 标记为传奇企业
  _addLegendaryCompany(memory, cid, name, industry, "IPO上市");

  saveMultiRunMemory(memory);
}

// ====== 增强功能：合并历史 ======

/**
 * 记录公司合并
 * @param {string} acquirerCid 收购方ID
 * @param {string} targetCid 被收购方ID
 * @param {string} mergedName 合并后名称
 * @param {object} state 游戏状态
 */
function recordMergerHistory(acquirerCid, targetCid, mergedName, state) {
  var memory = getMultiRunMemory();
  var key = targetCid + "_merged_" + acquirerCid;

  memory.mergerHistory[key] = {
    acquirerId: acquirerCid,
    acquirerName: _coName(acquirerCid),
    targetId: targetCid,
    targetName: _coName(targetCid),
    mergedName: mergedName,
    mergedDay: state.player.day,
    mergedRun: memory.totalPlaythroughs + 1,
    recordedAt: Date.now(),
  };

  saveMultiRunMemory(memory);
}

// ====== 增强功能：传奇企业 ======

/**
 * 添加传奇企业
 */
function _addLegendaryCompany(memory, cid, name, industry, reason) {
  // 检查是否已存在
  for (var i = 0; i < memory.legendaryCompanies.length; i++) {
    if (memory.legendaryCompanies[i].cid === cid) {
      memory.legendaryCompanies[i].achievements.push({
        reason: reason,
        day: new Date().toISOString(),
      });
      return;
    }
  }

  memory.legendaryCompanies.push({
    cid: cid,
    name: name,
    industry: industry,
    achievements: [{ reason: reason, day: new Date().toISOString() }],
    firstSeenRun: memory.totalPlaythroughs + 1,
  });
}

/**
 * 获取传奇企业列表
 */
function getLegendaryCompanies() {
  var memory = getMultiRunMemory();
  return memory.legendaryCompanies || [];
}

/**
 * 获取 IPO 历史
 */
function getIpoHistory() {
  var memory = getMultiRunMemory();
  return memory.ipoHistory || [];
}

/**
 * 获取合并历史
 */
function getMergerHistory() {
  var memory = getMultiRunMemory();
  return memory.mergerHistory || {};
}

// ====== 增强功能：行业格局变迁 ======

/**
 * 更新行业格局
 * @param {string} industry 行业名
 * @param {string} action 动作：company_died / company_ipo / company_merged
 */
function updateIndustryEvolution(industry, action) {
  var memory = getMultiRunMemory();
  if (!memory.industryEvolution[industry]) {
    memory.industryEvolution[industry] = {
      companiesStarted: 0,
      companiesDied: 0,
      companiesIpo: 0,
      companiesMerged: 0,
      lastUpdated: 0,
    };
  }

  var data = memory.industryEvolution[industry];
  if (action === "company_died") data.companiesDied++;
  else if (action === "company_ipo") data.companiesIpo++;
  else if (action === "company_merged") data.companiesMerged++;
  else if (action === "company_spawned") data.companiesStarted++;
  else if (action === "patent_acquired")
    data.patentAcquisitions = (data.patentAcquisitions || 0) + 1;
  else if (action === "talent_dispersion")
    data.talentDispersions = (data.talentDispersions || 0) + 1;

  data.lastUpdated = Date.now();

  saveMultiRunMemory(memory);
}

/**
 * 获取行业格局变迁
 */
function getIndustryEvolution() {
  var memory = getMultiRunMemory();
  return memory.industryEvolution || {};
}

/**
 * 获取多周目记忆摘要（用于UI）
 */
function getMultiRunMemorySummary() {
  var memory = getMultiRunMemory();
  if (!memory || memory.totalPlaythroughs === 0) {
    return {
      totalRuns: 0,
      hasMemory: false,
      message: "🆕 这是你的第一个周目，企业记忆将从本周目开始积累。",
    };
  }

  var deceasedCount = Object.keys(memory.deceasedCompanies || {}).length;
  var ipoCount = (memory.ipoHistory || []).length;
  var legendaryCount = (memory.legendaryCompanies || []).length;
  var mergerCount = Object.keys(memory.mergerHistory || {}).length;

  var msg = "📊 已进行 <b>" + memory.totalPlaythroughs + "</b> 周目";
  if (memory.totalPlaythroughs > 1) {
    msg += "，记录了 <b>" + deceasedCount + "</b> 家倒闭企业";
    msg += "、<b>" + ipoCount + "</b> 次 IPO";
    msg += "、<b>" + legendaryCount + "</b> 家传奇企业";
    if (mergerCount > 0) msg += "、<b>" + mergerCount + "</b> 次合并";
  }

  return {
    totalRuns: memory.totalPlaythroughs,
    hasMemory: true,
    deceasedCount: deceasedCount,
    ipoCount: ipoCount,
    legendaryCount: legendaryCount,
    mergerCount: mergerCount,
    message: msg,
    memory: memory,
  };
}

/**
 * 周目结束：更新周目历史
 */
function recordPlaythroughEndEnhanced(state) {
  var memory = getMultiRunMemory();
  memory.totalPlaythroughs++;

  // 检查传奇企业（市场份额>35%）
  if (state.enterpriseFate && state.enterpriseFate.companies) {
    for (var cid in state.enterpriseFate.companies) {
      var co = state.enterpriseFate.companies[cid];
      if (co && co.marketShare > 35 && !co.ceasedExistence) {
        _addLegendaryCompany(
          memory,
          cid,
          _coName(cid),
          typeof getCompanyIndustry === "function"
            ? getCompanyIndustry(cid)
            : "未知",
          "市场份额>" + Math.round(co.marketShare) + "%",
        );
      }
    }
  }

  saveMultiRunMemory(memory);
}

// 全局挂载
if (typeof window !== "undefined") {
  Object.assign(window, {
    getMultiRunMemory: getMultiRunMemory,
    saveMultiRunMemory: saveMultiRunMemory,
    isCompanyDeceased: isCompanyDeceased,
    getDeceasedCompanies: getDeceasedCompanies,
    recordCompanyDeath: recordCompanyDeath,
    recordPlaythroughEnd: recordPlaythroughEnd,
    getDeceasedCompanyEpitaphs: getDeceasedCompanyEpitaphs,
    resetMultiRunMemory: resetMultiRunMemory,
    // 增强功能
    recordIpoHistory: recordIpoHistory,
    recordMergerHistory: recordMergerHistory,
    getLegendaryCompanies: getLegendaryCompanies,
    getIpoHistory: getIpoHistory,
    getMergerHistory: getMergerHistory,
    updateIndustryEvolution: updateIndustryEvolution,
    getIndustryEvolution: getIndustryEvolution,
    getMultiRunMemorySummary: getMultiRunMemorySummary,
    recordPlaythroughEndEnhanced: recordPlaythroughEndEnhanced,
    // Phase 3: 遗产链
    recordLegacyEventToMemory: recordLegacyEventToMemory,
    getLegacyEvents: getLegacyEvents,
    getLegacyEventsBySource: getLegacyEventsBySource,
    MULTIVERSE_KEY: MULTIVERSE_KEY,
  });
}
