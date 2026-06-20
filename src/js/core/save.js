/**
 * 存档系统 — localStorage 多槽位持久化
 *
 * 5个手动存档槽 + 1个自动存档
 * 索引键: 'city_life_story_index' — 存储各槽位元信息
 * 存档键: 'city_life_story_slot_N' (N=1..5) + 'city_life_story_autosave'
 */

const NUM_SLOTS = 5;
const SLOT_PREFIX = "city_life_story_slot_";
const AUTO_SAVE_KEY = "city_life_story_autosave";
const INDEX_KEY = "city_life_story_index";

/** 获取槽位键 */
function slotKey(n) {
  return SLOT_PREFIX + n;
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

/** 生成"那时候你..."回忆文案（存储于索引，读档时展示） */
function generateSaveNarrative(state) {
  var p = state.player;
  var r = state.resources;
  var day = p.day;
  var cash = (r.cash || 0) + (r.bankBalance || 0);
  var debt = (r.villageDebt || 0) + (r.bankDebt || 0);

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

/** 保存游戏到指定槽位（1-5） */
function saveGame(slot) {
  if (slot < 1 || slot > NUM_SLOTS) {
    StateManager.addMessage("⚠️ 无效的存档槽位。", "danger");
    return false;
  }

  try {
    const state = StateManager.getState();
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
    };
    setSaveIndex(index);

    StateManager.addMessage(
      `💾 已保存到槽位 ${slot}（第${state.player.day}天，¥${state.resources.cash.toLocaleString()}）`,
      "success",
    );
    return true;
  } catch (e) {
    console.error("存档失败:", e);
    StateManager.addMessage("⚠️ 存档失败: " + e.message, "danger");
    return false;
  }
}

/** 自动存档 */
function autoSave() {
  try {
    const state = StateManager.getState();
    const saveData = JSON.parse(JSON.stringify(state));
    saveData.lastPlayedAt = Date.now();
    // 附加存档快照（用于读档回忆文案）
    if (typeof createSnapshot === "function") {
      saveData._snapshot = createSnapshot(state);
    }
    if (saveData.messageLog && saveData.messageLog.length > 200) {
      saveData.messageLog = saveData.messageLog.slice(-200);
    }
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData));

    // 更新索引中的自动存档信息
    const index = getSaveIndex();
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
    };
    setSaveIndex(index);
  } catch (e) {
    /* 静默 */
  }
}

/** 从指定槽位加载存档 */
function loadGame(slot) {
  try {
    let key;
    if (slot === "_auto") {
      key = AUTO_SAVE_KEY;
    } else if (typeof slot === "number" && slot >= 1 && slot <= NUM_SLOTS) {
      key = slotKey(slot);
    } else {
      // 兼容旧版：尝试直接以 slot 为键
      key = slot;
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
    const index = getSaveIndex();
    delete index._auto;
    setSaveIndex(index);
    return;
  }
  if (slot < 1 || slot > NUM_SLOTS) return;
  localStorage.removeItem(slotKey(slot));
  const index = getSaveIndex();
  delete index[slot];
  setSaveIndex(index);
}

/** 检查指定槽位是否有存档 */
function hasSave(slot) {
  if (slot === "_auto") return localStorage.getItem(AUTO_SAVE_KEY) !== null;
  if (typeof slot === "number")
    return localStorage.getItem(slotKey(slot)) !== null;
  // 兼容检查任意存档
  const index = getSaveIndex();
  return Object.keys(index).length > 0;
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

  return {
    slot,
    label: `存档槽位 ${slot}`,
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

/** 获取所有存档槽位信息 */
function getAllSlots() {
  const slots = [];
  // 自动存档
  const auto = getSlotInfo("_auto");
  if (auto) slots.push(auto);
  // 手动存档 1-5
  for (let i = 1; i <= NUM_SLOTS; i++) {
    const info = getSlotInfo(i);
    if (info) slots.push(info);
  }
  return slots;
}

/** 获取所有槽位（含空槽位） */
function getAllSlotsWithEmpty() {
  const slots = [];
  // 自动存档
  const auto = getSlotInfo("_auto");
  slots.push(auto || { slot: "_auto", label: "🤖 自动存档", empty: true });
  // 手动存档
  for (let i = 1; i <= NUM_SLOTS; i++) {
    const info = getSlotInfo(i);
    slots.push(info || { slot: i, label: `存档槽位 ${i}`, empty: true });
  }
  return slots;
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
    if (!data.version || !data.player) {
      throw new Error("无效的存档格式");
    }
    StateManager.importState(data);
    StateManager.addMessage("📥 存档导入成功！", "success");
    return true;
  } catch (e) {
    StateManager.addMessage("⚠️ 存档导入失败: " + e.message, "danger");
    return false;
  }
}

// 全局挂载
if (typeof window !== "undefined") {
  Object.assign(window, {
    saveGame,
    loadGame,
    deleteSave,
    hasSave,
    autoSave,
    getSlotInfo,
    getAllSlots,
    getAllSlotsWithEmpty,
    exportSave,
    importSave,
    NUM_SLOTS,
    SLOT_PREFIX,
    AUTO_SAVE_KEY,
    INDEX_KEY,
    slotKey,
    getSaveIndex,
    setSaveIndex,
  });
}
