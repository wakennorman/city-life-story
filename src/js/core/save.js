/**
 * 存档系统 — localStorage 多槽位持久化（无限槽位）
 *
 * 索引键: 'city_life_story_index' — 存储各槽位元信息
 * 存档键: 'city_life_story_slot_<id>' (id 为数字或字符串)
 * 自动存档键: 'city_life_story_autosave' + 'city_life_story_autosave_prev'
 */

const SLOT_PREFIX = "city_life_story_slot_";
const AUTO_SAVE_KEY = "city_life_story_autosave";
const AUTO_SAVE_PREV_KEY = "city_life_story_autosave_prev"; // 滚动双槽·前一日备份
const INDEX_KEY = "city_life_story_index";

// localStorage 配额警戒线（字节）
const QUOTA_WARN_THRESHOLD = 2 * 1024 * 1024; // 剩余<2MB时预警

/** 获取槽位键（支持数字或字符串 ID） */
function slotKey(id) {
  return SLOT_PREFIX + id;
}

/** 读取存档索引 */
function getSaveIndex() {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/** 写入存档索引 */
function setSaveIndex(index) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

/**
 * 检测 localStorage 剩余空间
 *
 * 浏览器 localStorage 典型限额（每域名）：
 *   Chrome:  ~10MB  |  Firefox: ~10MB  |  Safari: ~5MB  |  Edge: ~10MB
 *
 * 策略：
 *   1. 快速写 500KB 探针 → 成功则空间充足（剩余 ≥ 5MB 参考值）
 *   2. 失败则二分法精确探测 0~500KB
 *
 * 返回 { ok: boolean, remaining: number, detail: string, measured: boolean }
 *   ok: 剩余空间 ≥ QUOTA_WARN_THRESHOLD (2MB)
 *   remaining: 真实剩余空间估值（充足时返回 5MB 参考值，不触发预警）
 *   measured: true=真实测量值，false=参考值（空间充足）
 */
function checkStorageQuota() {
  try {
    var probeKey = "__quota_probe__";
    // 先确认 localStorage 可写
    localStorage.setItem(probeKey, "1");

    // 快速检测：尝试写入 500KB
    var quickTest = new Array(500 * 1024).join("x");
    try {
      localStorage.setItem(probeKey, quickTest);
      localStorage.removeItem(probeKey);
      // 500KB 写入成功 → 空间充足，返回 5MB 参考值（高于所有预警阈值）
      return { ok: true, remaining: 5 * 1024 * 1024, detail: "充足", measured: false };
    } catch (_) {
      // 500KB 写入失败 → 空间不足，二分法精确探测 0~500KB
      localStorage.removeItem(probeKey);
    }

    // 二分法探测 0~500KB 之间的精确剩余空间
    var lo = 0,
      hi = 500 * 1024,
      lastOk = 0;
    while (lo <= hi) {
      var mid = Math.floor((lo + hi) / 2);
      try {
        var test = new Array(mid).join("x");
        localStorage.setItem(probeKey, test);
        lastOk = mid;
        localStorage.removeItem(probeKey);
        lo = mid + 1;
      } catch (e) {
        hi = mid - 1;
      }
    }

    // 清理探针
    try { localStorage.removeItem(probeKey); } catch (_) {}

    var remaining = lastOk;
    var ok = remaining >= QUOTA_WARN_THRESHOLD;

    var detail = remaining >= 1024 * 1024
      ? "剩余约 " + (remaining / (1024 * 1024)).toFixed(1) + "MB"
      : remaining >= 1024
        ? "剩余约 " + Math.round(remaining / 1024) + "KB"
        : "剩余 " + remaining + "B";

    return { ok: ok, remaining: remaining, detail: detail, measured: true };
  } catch (e) {
    return { ok: false, remaining: -1, detail: "无法检测: " + e.message, measured: false };
  }
}

/** 生成"那时候你..."回忆文案（存储于索引，读档时展示） */
function generateSaveNarrative(state) {
  var p = state.player;
  var r = state.resources;
  var day = p.day;
  var cash = (r.cash || 0) + (r.bankBalance || 0);
  var debt = (r.villageDebt || 0) + (r.fineDebt || 0) + (r.bankDebt || 0);

  var locNames = {
    slum: "城中村",
    wholesaleMarket: "批发市场",
    construction: "建筑工地",
    factoryZone: "工厂区",
    school: "大学城",
    commercialDist: "商业区",
    techPark: "科技园",
    hospital: "医院",
    bank: "银行",
    park: "公园",
    trainingCenter: "培训中心",
  };
  var loc = locNames[state.trade && state.trade.currentLocation] || "城市某处";

  if (p.phase === "corporate") {
    var rank = (state.corporate && state.corporate.rank) || "P5";
    var company = (state.corporate && state.corporate.company) || "科技公司";
    return (
      "那时候你已经是" +
      company +
      "的" +
      rank +
      "，在职场打拼了" +
      day +
      "天，存款" +
      (cash >= 1000 ? (cash / 1000).toFixed(1) + "万" : "¥" + cash) +
      "元。"
    );
  }

  var tail = "";
  var dreamId = state.flags && state.flags._dreamId;
  if (dreamId) {
    var dreamNames = {
      restaurant: "开餐馆",
      apartment: "买房",
      abroad: "出国",
      investor: "投资大亨",
      celebrity: "城市名人",
    };
    tail = "，梦想着" + (dreamNames[dreamId] || dreamId);
  }

  if (day <= 15) {
    return (
      "那时候你刚来这座城市第" +
      day +
      "天，在" +
      loc +
      "落脚，兜里" +
      (debt > 0
        ? "还欠着¥" + debt.toLocaleString() + "的债"
        : "有¥" + cash.toLocaleString()) +
      tail +
      "。"
    );
  } else if (cash < 500) {
    return (
      "那时候你在城里漂了" +
      day +
      "天，手里只剩¥" +
      cash.toLocaleString() +
      "，日子过得很紧巴" +
      tail +
      "。"
    );
  } else if (cash >= 50000) {
    return (
      "那时候你在" +
      loc +
      "打拼了" +
      day +
      "天，已经攒下" +
      Math.round(cash / 1000) +
      "千元，离梦想越来越近" +
      tail +
      "。"
    );
  } else {
    return (
      "那时候你在城里走过了" +
      day +
      "天，在" +
      loc +
      "一步一步往前走，手里有¥" +
      cash.toLocaleString() +
      tail +
      "。"
    );
  }
}

/**
 * 生成读档时的回忆文案（P1 - 存档快照）
 *
 * 基于存档快照生成"那时候你..."的叙事文案
 */

/**
 * 裁剪存档数据中的冗余字段，减小体积
 * - messageLog: 保留前100条+后100条完整，中间浓缩摘要（仅当超过200条时触发）
 */
function _trimStateForSave(saveData) {
  if (saveData.messageLog && saveData.messageLog.length > 200) {
    var head = saveData.messageLog.slice(0, 100);
    var tail = saveData.messageLog.slice(-100);
    var middle = saveData.messageLog.slice(100, -100);
    var condensed = [];
    // 按每10条一组浓缩
    for (var i = 0; i < middle.length; i += 10) {
      var chunk = middle.slice(i, i + 10);
      var summaries = [];
      for (var j = 0; j < chunk.length; j++) {
        var m = chunk[j];
        var txt = typeof m === "string" ? m : m.text || "";
        if (txt.length > 40) txt = txt.slice(0, 40) + "…";
        summaries.push(txt);
      }
      condensed.push({
        text: "📋 " + chunk.length + "条消息：" + summaries.join(" · "),
        condensed: true,
      });
    }
    saveData.messageLog = head.concat(condensed).concat(tail);
  }
  return saveData;
}

/** 保存游戏到指定槽位（支持数字或字符串 ID） */
function saveGame(slot) {
  if (slot == null || slot === "") {
    StateManager.addMessage("⚠️ 无效的存档槽位。", "danger");
    return false;
  }

  try {
    const state = StateManager.getState();

    // 配额检测
    var quota =
      typeof checkStorageQuota === "function" ? checkStorageQuota() : null;
    if (quota && !quota.ok) {
      const delMsg = "请删除旧存档以腾出空间。";
      StateManager.addMessage(
        "⚠️ 存储空间不足（" + quota.detail + "），" + delMsg,
        "danger",
      );
      return false;
    }
    // 低空间预警（仅真实测量值且剩余 < 5MB，但还能存）
    if (quota && quota.measured && quota.remaining < 5 * 1024 * 1024 && quota.remaining > 0) {
      StateManager.addMessage(
        "⚠️ 存储空间剩余不多（" + quota.detail + "），建议删除旧存档。",
        "warning",
      );
    }

    state.lastPlayedAt = Date.now();

    const saveData = JSON.parse(JSON.stringify(state));
    // 附加存档快照（用于读档回忆文案）
    if (typeof createSnapshot === "function") {
      saveData._snapshot = createSnapshot(state);
    }
    // 精简消息日志
    if (saveData.messageLog && saveData.messageLog.length > 200) {
      saveData.messageLog = saveData.messageLog.slice(-200);
    }
    // 进一步压缩（保留前50+后50，中间浓缩）
    _trimStateForSave(saveData);

    localStorage.setItem(slotKey(slot), JSON.stringify(saveData));

    // 更新索引
    const index = getSaveIndex();
    index[slot] = {
      day: state.player.day,
      phase: state.player.phase,
      cash: state.resources.cash,
      age: state.player.age,
      debt: state.resources.debt,
      totalEarned: state.resources.totalEarned,
      location: state.trade.currentLocation,
      rank: state.player.phase === "corporate" ? state.corporate.rank : null,
      savedAt: Date.now(),
      narrative: generateSaveNarrative(state),
      mode: state.flags._isScenarioMode
        ? "📜" + (state.flags._scenarioName || "剧本")
        : state.flags._isSandboxMode
          ? "⚙️沙盒"
          : "🎯经典",
      // 为字符串 ID 槽位记录标签（首次保存时）
      label: typeof slot === "string" && isNaN(Number(slot)) ? "存档 " + new Date().toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : undefined,
    };
    setSaveIndex(index);

    StateManager.addMessage(
      `💾 已保存（第${state.player.day}天，¥${state.resources.cash.toLocaleString()}）`,
      "success",
    );
    return true;
  } catch (e) {
    console.error("存档失败:", e);
    StateManager.addMessage("⚠️ 存档失败: " + e.message, "danger");
    return false;
  }
}

/** 自动存档（含配额检测 + 消息压缩 + 滚动双槽 + 用户反馈） */
function autoSave(reason) {
  try {
    const state = StateManager.getState();

    // 配额检测
    var quota = checkStorageQuota();
    if (!quota.ok) {
      StateManager.addMessage(
        "⚠️ 存储空间不足（" + quota.detail + "），自动存档失败！请清理旧存档。",
        "danger",
      );
      return false;
    }
    // 低空间预警（仅真实测量值）
    if (quota.measured && quota.remaining < 5 * 1024 * 1024 && quota.remaining > 0) {
      StateManager.addMessage(
        "⚠️ 存储空间不足（" + quota.detail + "），建议删除旧存档以防自动存档失败。",
        "warning",
      );
    }

    // 深拷贝
    var saveData = JSON.parse(JSON.stringify(state));
    saveData.lastPlayedAt = Date.now();
    // 存档快照
    if (typeof createSnapshot === "function") {
      saveData._snapshot = createSnapshot(state);
    }
    // 压缩消息日志
    _trimStateForSave(saveData);

    // 滚动双槽：当前 → 前一日备份
    var existing = null;
    try {
      existing = localStorage.getItem(AUTO_SAVE_KEY);
    } catch (e) {
      /* 忽略 */
    }
    if (existing) {
      try {
        localStorage.setItem(AUTO_SAVE_PREV_KEY, existing);
      } catch (e) {
        /* 忽略 */
      }
    }

    // 写入新存档
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData));

    // 更新索引
    var index = getSaveIndex();
    index._auto = {
      day: state.player.day,
      phase: state.player.phase,
      cash: state.resources.cash,
      age: state.player.age,
      debt: state.resources.debt,
      totalEarned: state.resources.totalEarned,
      location: state.trade.currentLocation,
      rank: state.player.phase === "corporate" ? state.corporate.rank : null,
      savedAt: Date.now(),
      narrative: generateSaveNarrative(state),
      reason: reason || "daily",
    };
    setSaveIndex(index);

    // 用户反馈（里程碑存档用不同文案，但不重复刷屏）
    if (reason !== "milestone" || !window._autoSaveMsgDay) {
      window._autoSaveMsgDay = window._autoSaveMsgDay || {};
    }
    if (reason === "milestone" && window._autoSaveMsgDay[state.player.day]) {
      // 同一日已发过里程碑消息，不再重复
    } else {
      StateManager.addMessage(
        reason === "milestone"
          ? "💾 里程碑自动保存（第" + state.player.day + "天）"
          : "💾 第" + state.player.day + "天已自动保存",
        "success",
      );
      if (reason === "milestone") {
        window._autoSaveMsgDay[state.player.day] = true;
      }
    }

    return true;
  } catch (e) {
    console.error("自动存档失败:", e);
    StateManager.addMessage("⚠️ 自动存档失败: " + e.message, "warning");
    return false;
  }
}

/** 生成新的存档 ID（唯一，基于时间戳） */
function generateSlotId() {
  return "s_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
}

/** 创建新存档（自动分配新 ID） */
function saveGameNew() {
  var newId = generateSlotId();
  return saveGame(newId) ? newId : null;
}

/** 从指定槽位加载存档 */
function loadGame(slot) {
  try {
    let key;
    if (slot === "_auto") {
      key = AUTO_SAVE_KEY;
    } else {
      // 统一通过 slotKey 构建键名（支持数字或字符串 ID）
      key = slotKey(slot);
    }

    const json = localStorage.getItem(key);
    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    console.error("读档失败:", e);
    return null;
  }
}

/** 删除指定槽位的存档 */
function deleteSave(slot) {
  if (slot === "_auto") {
    localStorage.removeItem(AUTO_SAVE_KEY);
    localStorage.removeItem(AUTO_SAVE_PREV_KEY);
    const index = getSaveIndex();
    delete index._auto;
    setSaveIndex(index);
    return;
  }
  localStorage.removeItem(slotKey(slot));
  const index = getSaveIndex();
  delete index[slot];
  setSaveIndex(index);
}

/** 检查指定槽位是否有存档 */
function hasSave(slot) {
  if (slot === "_auto") return localStorage.getItem(AUTO_SAVE_KEY) !== null;
  return localStorage.getItem(slotKey(slot)) !== null;
}

/** 获取存档槽位的显示信息 */
function getSlotInfo(slot) {
  if (slot === "_auto") {
    const index = getSaveIndex();
    const meta = index._auto;
    if (!meta) {
      const raw = localStorage.getItem(AUTO_SAVE_KEY);
      if (!raw) return null;
      try {
        const data = JSON.parse(raw);
        var autoMode = "";
        if (data.flags && data.flags._isScenarioMode) {
          autoMode = "📜" + (data.flags._scenarioName || "剧本");
        } else if (data.flags && data.flags._isSandboxMode) {
          autoMode = "⚙️沙盒";
        }
        return {
          day: data.player?.day || 1,
          phase: data.player?.phase || "street",
          cash: data.resources?.cash || 0,
          age: data.player?.age || 20,
          debt: data.resources?.debt || 0,
          totalEarned: data.resources?.totalEarned || 0,
          location: data.trade?.currentLocation || "slum",
          rank:
            data.player?.phase === "corporate" ? data.corporate?.rank : null,
          savedAt: data.lastPlayedAt || data.createdAt,
          mode: autoMode,
        };
      } catch (e) {
        return null;
      }
    }
    return { ...meta, slot: "_auto", label: "🤖 自动存档" };
  }

  const index = getSaveIndex();
  const meta = index[slot];
  if (!meta) return null;

  const date = new Date(meta.savedAt);
  const loc =
    typeof LOCATIONS !== "undefined" && LOCATIONS[meta.location]
      ? LOCATIONS[meta.location].name
      : meta.location;

  // 标签：优先使用索引中保存的 label，其次用数字槽位名
  var label = meta.label;
  if (!label) {
    label = typeof slot === "number" || (typeof slot === "string" && /^\d+$/.test(slot))
      ? "存档 #" + slot
      : "存档 " + date.toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  return {
    slot,
    label: label,
    day: meta.day,
    phase: meta.phase,
    cash: meta.cash,
    age: meta.age,
    debt: meta.debt,
    totalEarned: meta.totalEarned,
    location: loc,
    rank: meta.rank,
    date: date.toLocaleString("zh-CN"),
    savedAt: meta.savedAt,
    mode: meta.mode,
  };
}

/** 获取所有存档槽位信息（自动存档 + 所有手动存档，无数量限制） */
function getAllSlots() {
  const slots = [];
  // 自动存档
  const auto = getSlotInfo("_auto");
  if (auto) slots.push(auto);
  // 遍历索引中所有手动存档
  const index = getSaveIndex();
  for (var key in index) {
    if (key === "_auto") continue;
    const info = getSlotInfo(key);
    if (info) slots.push(info);
  }
  return slots;
}

/** 获取所有槽位（含空槽位占位，当前仅返回已有存档，无空槽位概念） */
function getAllSlotsWithEmpty() {
  return getAllSlots();
}

function createSnapshot(state) {
  var snapshot = {
    // 基础信息
    day: state.player.day,
    age: state.player.age,
    phase: state.player.phase,
    rank: state.player.phase === "corporate" ? state.corporate.rank : null,
    cash: state.resources.cash,
    bankBalance: state.resources.bankBalance,
    debt: state.resources.debt,
    totalEarned: state.resources.totalEarned,

    // 需求状态
    hunger: state.needs?.hunger || 0,
    fatigue: state.needs?.fatigue || 0,
    hygiene: state.needs?.hygiene || 0,
    happiness: state.needs?.happiness || 0,
    health: state.status?.health || 100,

    // 属性
    physique: state.player.physique || 0,
    intelligence: state.player.intelligence || 0,
    agility: state.player.agility || 0,
    mental: state.player.mental || 0,

    // 疾病状态
    illnesses: (function () {
      var ills = [];
      if (state.status?.illnesses && state.status.illnesses.length > 0) {
        for (var i = 0; i < state.status.illnesses.length; i++) {
          var ill = state.status.illnesses[i];
          var illData =
            typeof getIllnessData === "function" ? getIllnessData(ill) : null;
          ills.push({
            id: ill.id,
            name: illData?.name || ill.name || "未知疾病",
            severity: illData?.severity || 1,
            stage: ill.stage || 1,
            health: ill.health || 0,
          });
        }
      }
      return ills;
    })(),

    // 食材库存
    ingredients: (function () {
      var ings = [];
      if (state.inventory?.items && state.inventory.items.length > 0) {
        var ingredientItems = state.inventory.items.filter(function (item) {
          return item.isIngredient || item.ingredientType;
        });
        for (var j = 0; j < ingredientItems.length; j++) {
          var ing = ingredientItems[j];
          ings.push({
            itemId: ing.itemId || ing.id,
            quantity: ing.quantity || ing.qty || 0,
            expiredAt: ing.expiredAt,
          });
        }
      }
      return ings;
    })(),

    // 烹饪技能
    cookingLevel: (function () {
      if (typeof getCookingLevel === "function") {
        return getCookingLevel(state);
      }
      return 0;
    })(),

    // 当前地点
    location: state.trade?.currentLocation || "slum",

    // 梦想
    dreamId: state.flags?._dreamId || null,
    dreamMilestone: state.flags?._dreamMilestone || 0,

    // 技能树
    skillBranches: state.skillBranches || {},
    talentNodes: state.talentNodes || {},

    // 关系
    relationshipCount: Object.keys(state.relationships || {}).filter(
      function (npcId) {
        var r = state.relationships[npcId];
        return r && r.met && (r.affinity || 0) >= 30;
      },
    ).length,

    // 公司历史（职场阶段）
    corpHistory: (function () {
      if (state.player.phase === "corporate" && state.corporate) {
        return {
          company: state.corporate.company?.name || null,
          rank: state.corporate.rank,
          teamSize: state.corporate.team?.length || 0,
          perfHistory: state.corporate.perfHistory || [],
          completedProjects: state.corporate.completedProjects || [],
          consecutiveC: state.corporate.consecutiveC || 0,
        };
      }
      return null;
    })(),

    // 企业命运（如果有）
    enterpriseFate: (function () {
      if (state.enterpriseFate?.companies) {
        var companies = [];
        for (var cid in state.enterpriseFate.companies) {
          var co = state.enterpriseFate.companies[cid];
          companies.push({
            id: cid,
            name: co.name,
            phase: co.phase,
            health: co.health,
            ipoed: co.ipoed,
            ceasedExistence: co.ceasedExistence,
          });
        }
        return { companies: companies };
      }
      return null;
    })(),
  };

  return snapshot;
}

/**
 * 生成读档时的回忆文案（P1 - 存档快照）
 *
 * 基于存档快照生成"那时候你..."的叙事文案
 */
function getLoadMemoryText(snapshot) {
  if (!snapshot) return "";

  var day = snapshot.day;
  var cash = (snapshot.cash || 0) + (snapshot.bankBalance || 0);
  var debt = snapshot.debt || 0;
  var phase = snapshot.phase || "street";

  // 职场阶段
  if (phase === "corporate") {
    var rank = snapshot.rank || "P5";
    var company = snapshot.corpHistory?.company || "科技公司";
    var teamSize = snapshot.corpHistory?.teamSize || 0;
    var perfCount = snapshot.corpHistory?.perfHistory?.length || 0;

    return (
      "那时候你已经是" +
      company +
      "的" +
      rank +
      "，在职场打拼了" +
      day +
      "天，带领" +
      teamSize +
      "人团队，完成了" +
      perfCount +
      "次绩效评审，存款" +
      (cash >= 1000
        ? Math.round(cash / 1000) + "千元"
        : "¥" + Math.round(cash)) +
      "元。"
    );
  }

  // 街头阶段
  var locNames = {
    slum: "城中村",
    wholesaleMarket: "批发市场",
    construction: "建筑工地",
    factoryZone: "工厂区",
    school: "大学城",
    commercialDist: "商业区",
    techPark: "科技园",
    hospital: "医院",
    bank: "银行",
    park: "公园",
    trainingCenter: "培训中心",
  };
  var loc = locNames[snapshot.location] || "城市某处";

  var tail = "";
  if (snapshot.dreamId) {
    var dreamNames = {
      restaurant: "开餐馆",
      apartment: "买房",
      abroad: "出国",
      investor: "投资大亨",
      celebrity: "城市名人",
    };
    tail = "，梦想着" + (dreamNames[snapshot.dreamId] || snapshot.dreamId);
  }

  // 疾病状态
  var illnessNote = "";
  if (snapshot.illnesses && snapshot.illnesses.length > 0) {
    var illNames = [];
    for (var i = 0; i < snapshot.illnesses.length; i++) {
      illNames.push(snapshot.illnesses[i].name);
    }
    illnessNote = "，身上带着" + illNames.join("、") + "的病痛";
  }

  // 食材库存
  var ingredientNote = "";
  if (snapshot.ingredients && snapshot.ingredients.length > 0) {
    ingredientNote = "，冰箱里还有" + snapshot.ingredients.length + "种食材";
  }

  // 烹饪技能
  var cookingNote = "";
  if (snapshot.cookingLevel > 0) {
    cookingNote = "，烹饪技能 Lv." + snapshot.cookingLevel;
  }

  // 健康状态
  var healthNote = "";
  if (snapshot.health < 60) {
    healthNote = "，健康值只有" + snapshot.health + "%";
  }

  // 疲劳状态
  var fatigueNote = "";
  if (snapshot.fatigue > 70) {
    fatigueNote = "，疲惫不堪";
  }

  if (day <= 15) {
    return (
      "那时候你刚来这座城市第" +
      day +
      "天，在" +
      loc +
      "落脚，兜里" +
      (debt > 0
        ? "还欠着¥" + Math.round(debt).toLocaleString() + "的债"
        : "有¥" + Math.round(cash).toLocaleString()) +
      illnessNote +
      cookingNote +
      ingredientNote +
      healthNote +
      fatigueNote +
      tail +
      "。"
    );
  } else if (cash < 500) {
    return (
      "那时候你在城里漂了" +
      day +
      "天，手里只剩¥" +
      Math.round(cash).toLocaleString() +
      illnessNote +
      cookingNote +
      ingredientNote +
      healthNote +
      fatigueNote +
      tail +
      "，日子过得很紧巴。"
    );
  } else if (cash >= 50000) {
    return (
      "那时候你在" +
      loc +
      "打拼了" +
      day +
      "天，已经攒下" +
      Math.round(cash / 1000) +
      "千元" +
      illnessNote +
      cookingNote +
      ingredientNote +
      healthNote +
      fatigueNote +
      tail +
      "，离梦想越来越近。"
    );
  } else {
    return (
      "那时候你在城里走过了" +
      day +
      "天，在" +
      loc +
      "一步一步往前走，手里有¥" +
      Math.round(cash).toLocaleString() +
      illnessNote +
      cookingNote +
      ingredientNote +
      healthNote +
      fatigueNote +
      tail +
      "。"
    );
  }
}

/** 导出存档（用于备份） */
function exportSave(slot) {
  const data = loadGame(slot || "_auto");
  if (!data) return null;
  return JSON.stringify(data, null, 2);
}

/** 导入存档 */
function importSave(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    // P0-3：版本缺失不再硬拒——importState 会把无版本存档视为 v0 跑全套迁移。
    // 仍要求 player 存在（缺 player 是结构性损坏，无法安全迁移）。
    if (!data.player || typeof data.player !== "object") {
      throw new Error("无效的存档格式");
    }
    // [全系统自洽修复] 域G A类#3: 防御性检查——关键字段缺失时补默认值而非崩溃
    if (!data.resources) data.resources = { cash: 0, bankBalance: 0, debt: 0 };
    if (!data.status) data.status = { health: 70 };
    if (!data.needs) data.needs = { hunger: 70, fatigue: 0, hygiene: 60, happiness: 50 };
    StateManager.importState(data);
    StateManager.addMessage("📥 存档导入成功！", "success");
    return true;
  } catch (e) {
    StateManager.addMessage("⚠️ 存档导入失败: " + e.message, "danger");
    return false;
  }
}

// ====== 存储空间管理 ======

/** 获取存储空间使用情况概览 */
function getStorageInfo() {
  var info = {
    total: 0,         // 总使用量（字节）
    limit: 0,         // 总配额（字节）
    remaining: 0,     // 剩余空间（字节）
    saveCount: 0,     // 存档数量
    saves: [],        // 每个存档的大小
    percent: 0,       // 使用百分比
    ok: true,
  };
  try {
    // 计算各存档大小
    var index = getSaveIndex();
    for (var key in index) {
      var lsKey = key === "_auto" ? AUTO_SAVE_KEY : slotKey(key);
      var raw = localStorage.getItem(lsKey);
      if (raw) {
        var size = typeof Blob !== "undefined" ? new Blob([raw]).size : raw.length * 2;
        info.saves.push({ slot: key, label: index[key].label || key, size: size, day: index[key].day || 0 });
        info.total += size;
        info.saveCount++;
      }
    }
    // 检测剩余空间
    var quota = checkStorageQuota();
    info.remaining = quota.remaining;
    info.ok = quota.ok;
    info.detail = quota.detail;
    info.measured = quota.measured;
  } catch (e) {
    info.ok = false;
    info.detail = "无法检测: " + e.message;
  }
  return info;
}

/** 格式化字节为可读字符串 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + "B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + "KB";
  return (bytes / (1024 * 1024)).toFixed(1) + "MB";
}

// 全局挂载
if (typeof window !== "undefined") {
  Object.assign(window, {
    saveGame,
    saveGameNew,
    loadGame,
    deleteSave,
    hasSave,
    autoSave,
    getSlotInfo,
    getAllSlots,
    getAllSlotsWithEmpty,
    exportSave,
    importSave,
    checkStorageQuota,
    getStorageInfo,
    formatSize,
    _trimStateForSave,
    SLOT_PREFIX,
    AUTO_SAVE_KEY,
    AUTO_SAVE_PREV_KEY,
    INDEX_KEY,
    slotKey,
    getSaveIndex,
    setSaveIndex,
    QUOTA_WARN_THRESHOLD,
  });
}
