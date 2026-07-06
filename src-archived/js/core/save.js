/**
 * 存档系统 — localStorage 多槽位持久化
 *
 * 5个手动存档槽 + 1个自动存档
 * 索引键: 'city_life_story_index' — 存储各槽位元信息
 * 存档键: 'city_life_story_slot_N' (N=1..5) + 'city_life_story_autosave'
 *
 * 新增：存档快照功能
 * - 存档时自动记录状态快照（关键状态字段）
 * - 读档时显示"那时候你..."回忆文案
 * - 支持多版本快照对比
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
    // 精简消息日志
    if (saveData.messageLog && saveData.messageLog.length > 200) {
      saveData.messageLog = saveData.messageLog.slice(-200);
    }

    localStorage.setItem(slotKey(slot), JSON.stringify(saveData));

    // ====== 生成存档快照 ======
    const snapshot = createSnapshot(state);

    // 更新索引（含快照）
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
      snapshot: snapshot, // 关键状态快照
      snapshotDesc: snapshot.description, // 回忆文案
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
    if (saveData.messageLog && saveData.messageLog.length > 200) {
      saveData.messageLog = saveData.messageLog.slice(-200);
    }
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData));

    // ====== 生成自动存档快照 ======
    const snapshot = createSnapshot(state);

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
      snapshot: snapshot,
      snapshotDesc: snapshot.description,
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

/**
 * 获取读档时的回忆文案
 * @param {number|string} slot - 槽位编号
 * @returns {string} 回忆文案，如 "那时候你第120天，21岁，住在单间，攒了¥8,000"
 */
function getLoadMemoryText(slot) {
  const info = getSlotInfo(slot);
  if (!info || !info.snapshotDesc) return "";
  return `那时候你${info.snapshotDesc}。`;
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
        const snapshot = createSnapshot(data);
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
          snapshot: snapshot,
          snapshotDesc: generateMemoryText(snapshot),
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
    snapshot: meta.snapshot || null,
    snapshotDesc: meta.snapshotDesc || generateMemoryText(meta.snapshot),
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

// ====== 存档快照系统 ======

/**
 * 创建存档快照 — 提取关键状态字段
 * @param {Object} state - 当前游戏状态
 * @returns {Object} 快照对象
 */
function createSnapshot(state) {
  const p = state.player;
  const s = state.status;
  const n = state.needs;
  const c = state.corporate;

  // 构建快照数据
  const snapshot = {
    // 基础状态
    day: p.day,
    age: p.age,
    phase: p.phase,

    // 街头阶段状态
    street: null,
    // 职场阶段状态
    corporate: null,

    // 当前状态摘要
    summary: {},

    // 食材库存
    ingredients: null,
  };

  if (state.ingredients?.items) {
    const ingItems = {};
    for (const [id, item] of Object.entries(state.ingredients.items)) {
      if (item.qty > 0) {
        ingItems[id] = { qty: item.qty, buyDay: item.buyDay };
      }
    }
    if (Object.keys(ingItems).length > 0) {
      snapshot.ingredients = {
        items: ingItems,
        capacity: state.ingredients.capacity,
        fridge: state.ingredients.fridge,
      };
    }
  }

  if (p.phase === "street") {
    snapshot.street = {
      physique: p.physique,
      intelligence: p.intelligence,
      agility: p.agility,
      mental: p.mental,
      hunger: n.hunger,
      fatigue: n.fatigue,
      hygiene: n.hygiene,
      happiness: n.happiness,
      health: s.health,
      fame: s.fame,
      comfort: s.comfort || 50,
      housingTier: state.housing?.tier || 0,
      debt: state.resources.debt,
    };
  } else if (p.phase === "corporate") {
    snapshot.corporate = {
      rank: c.rank,
      hair: c.hair,
      dignity: c.dignity,
      upwardMgmt: c.upwardMgmt,
      kpi: c.kpi,
      ability: c.ability,
      risk: c.risk,
      popularity: c.popularity,
      perfHistoryLen: c.perfHistory?.length || 0,
      consecutiveC: c.consecutiveC,
      teamSize: c.team?.length || 0,
      year: p.corpYear,
      quarter: p.corpQuarter,
    };
  }

  // 当前状态摘要
  snapshot.summary = {
    cash: state.resources.cash,
    totalEarned: state.resources.totalEarned,
    sick: s.sick,
    injured: s.injured,
    emotionalState: s.emotionalState,
    diseases:
      state.diseases?.active?.map((d) => ({
        diseaseId: d.diseaseId,
        stage: d.stage,
        severity: d.severity,
        days: d.days,
      })) || [],
    ingredients: state.ingredients?.items
      ? Object.entries(state.ingredients.items)
          .filter(([, item]) => item.qty > 0)
          .map(([id, item]) => ({ id, qty: item.qty }))
      : [],
  };

  return snapshot;
}

/**
 * 生成"那时候你..."回忆文案
 * @param {Object} snapshot - 存档快照
 * @returns {string} 回忆文案
 */
function generateMemoryText(snapshot) {
  if (!snapshot) return "";

  const parts = [];
  const s = snapshot.summary;
  const p = snapshot.phase;

  // 基础信息
  parts.push(`第${snapshot.day}天，${snapshot.age}岁`);

  // 阶段信息
  if (p === "street") {
    const st = snapshot.street;
    if (!st) return parts.join("，");

    // 属性状态
    if (st.physique > 60) parts.push("身体还算硬朗");
    else if (st.physique < 30) parts.push("身体已经透支");

    if (st.mental > 60) parts.push("心智清醒");
    else if (st.mental < 30) parts.push("精神有些恍惚");

    // 需求状态
    if (st.hunger > 70) parts.push("肚子咕咕叫");
    else if (st.hunger < 30) parts.push("饿得前胸贴后背");

    if (st.fatigue > 70) parts.push("疲惫不堪");
    else if (st.fatigue < 30) parts.push("精神饱满");

    if (st.hygiene < 30) parts.push("浑身脏兮兮的");

    // 健康
    if (s.sick) parts.push("病着");
    if (s.injured) parts.push("带着伤");

    // 住房
    const housingNames = ["露宿街头", "合租床位", "单间", "一居室"];
    parts.push(`住在${housingNames[st.housingTier] || "未知的地方"}`);

    // 债务
    if (st.debt > 0) parts.push(`欠着¥${st.debt.toLocaleString()}`);

    // 财富
    if (s.cash > 5000) parts.push(`攒了¥${s.cash.toLocaleString()}`);
    else if (s.cash < 500) parts.push("身无分文");

    // 疾病
    if (s.diseases?.length) {
      const diseaseList = s.diseases.map((d) => {
        const def =
          typeof getDisease === "function" ? getDisease(d.diseaseId) : null;
        return `${def?.name || d.diseaseId}（${d.stage}级，${d.severity}%）`;
      });
      parts.push(`患有${diseaseList.join("、")}`);
    }

    // 食材库存
    if (s.ingredients?.length) {
      const ingList = s.ingredients.map((i) => {
        const def =
          typeof getIngredient === "function" ? getIngredient(i.id) : null;
        return `${def?.name || i.id}×${i.qty}`;
      });
      parts.push(`冰箱里有${ingList.join("、")}`);
    }

    // 情感状态
    if (s.emotionalState === "happy") parts.push("心情不错");
    else if (s.emotionalState === "depressed") parts.push("情绪低落");
    else if (s.emotionalState === "stressed") parts.push("压力山大");
  } else if (p === "corporate") {
    const ct = snapshot.corporate;
    if (!ct) return parts.join("，");

    // 职级
    parts.push(`已经是${ct.rank}了`);

    // 发量
    if (ct.hair > 80) parts.push("发量还够用");
    else if (ct.hair < 40) parts.push("发量告急");
    else parts.push("发量堪忧");

    // 尊严
    if (ct.dignity > 70) parts.push("还保持着尊严");
    else if (ct.dignity < 30) parts.push("尊严所剩无几");

    // 绩效
    if (ct.consecutiveC > 0) {
      parts.push(`连续${ct.consecutiveC}次绩效C`);
    }

    // 风险
    if (ct.risk > 50) parts.push("风险值偏高");

    // 团队
    if (ct.teamSize > 0) parts.push(`带着${ct.teamSize}人的团队`);

    // 财富
    if (s.cash > 100000) parts.push(`手握¥${(s.cash / 10000).toFixed(1)}万`);
    else if (s.cash > 10000) parts.push(`攒了¥${(s.cash / 1000).toFixed(0)}千`);

    // 疾病
    if (s.diseases?.length) {
      const diseaseList = s.diseases.map((d) => {
        const def =
          typeof getDisease === "function" ? getDisease(d.diseaseId) : null;
        return `${def?.name || d.diseaseId}（${d.stage}级，${d.severity}%）`;
      });
      parts.push(`患有${diseaseList.join("、")}`);
    }

    // 食材库存
    if (s.ingredients?.length) {
      const ingList = s.ingredients.map((i) => {
        const def =
          typeof getIngredient === "function" ? getIngredient(i.id) : null;
        return `${def?.name || i.id}×${i.qty}`;
      });
      parts.push(`冰箱里有${ingList.join("、")}`);
    }

    // 情感状态
    if (s.emotionalState === "happy") parts.push("挺开心");
    else if (s.emotionalState === "stressed") parts.push("压力很大");
    else if (s.emotionalState === "depressed") parts.push("有点抑郁");
  }

  return parts.join("，");
}

/**
 * 更新指定槽位的快照信息（用于读档后更新快照）
 * @param {number|string} slot - 槽位编号
 * @param {Object} state - 新状态
 */
function updateSlotSnapshot(slot, state) {
  const index = getSaveIndex();
  if (!index[slot]) return;

  const snapshot = createSnapshot(state);
  index[slot].snapshot = snapshot;
  index[slot].snapshotDesc = generateMemoryText(snapshot);
  index[slot].savedAt = Date.now();
  setSaveIndex(index);
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
    updateSlotSnapshot,
    getLoadMemoryText,
    createSnapshot,
    generateMemoryText,
    NUM_SLOTS,
    SLOT_PREFIX,
    AUTO_SAVE_KEY,
    INDEX_KEY,
    slotKey,
    getSaveIndex,
    setSaveIndex,
  });
}
