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
const MULTIVERSE_VERSION = "1.0";

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

/** 获取所有已倒闭公司列表 */
function getDeceasedCompanies() {
  var memory = getMultiRunMemory();
  return Object.keys(memory.deceasedCompanies);
}

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
  });
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
    MULTIVERSE_KEY: MULTIVERSE_KEY,
  });
}
