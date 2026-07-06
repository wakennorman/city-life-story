/**
 * 城市浮生记 — 主入口
 *
 * 初始化游戏、管理渲染循环、绑定事件。
 */

// ====== 全局游戏实例 ======
let gameStarted = false;

// ====== 工具函数 ======

/** 设置属性条 */
function setStatBar(id, value, cssClass) {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  const bar = wrap.querySelector(".stat-bar");
  const valEl = wrap.querySelector(".stat-value");
  if (bar) {
    bar.style.width = Math.max(0, Math.min(100, value)) + "%";
    bar.className = "stat-bar " + cssClass;
  }
  if (valEl) {
    valEl.textContent = Math.round(value);
  }
}

/** 描述装备效果 */
function describeItemEffects(itemDef) {
  if (!itemDef || !itemDef.effects) return "";
  const parts = [];
  for (const [key, val] of Object.entries(itemDef.effects)) {
    if (key === "capacity") parts.push(`容量+${val}`);
    else if (key === "injury") parts.push(`受伤率${val < 0 ? val : "+" + val}`);
    else if (key === "illness")
      parts.push(`生病率${val < 0 ? val : "+" + val}`);
    else if (key === "fatigue") parts.push(`疲劳${val < 0 ? val : "+" + val}`);
    else if (typeof val === "number")
      parts.push(`${key}${val > 0 ? "+" + val : val}`);
  }
  return parts.join(", ");
}

// ====== 疾病演化系统 ======

/** 根据工作类型返回可能触发的疾病ID */
function getIllnessDiseaseId(job) {
  // 餐饮/食品相关 → 消化系统疾病
  if (job.id?.includes("food") || job.id?.includes("vending")) {
    return Random.chance(0.6) ? "gastritis" : "common_cold";
  }
  // 工地/体力劳动 → 骨骼肌肉疾病
  if (job.id?.includes("construction") || job.id?.includes("labor")) {
    return Random.chance(0.5) ? "cervical_spondylosis" : "common_cold";
  }
  // 工厂 → 呼吸系统疾病
  if (job.id?.includes("factory")) {
    return Random.chance(0.5) ? "bronchitis" : "common_cold";
  }
  // 默认：普通感冒
  return "common_cold";
}

/**
 * 添加疾病到玩家状态
 * @param {Object} state - 游戏状态
 * @param {string} diseaseId - 疾病ID
 */
function addDisease(state, diseaseId) {
  if (!state.diseases) state.diseases = { active: [] };

  const existing = state.diseases.active.find((d) => d.diseaseId === diseaseId);
  if (existing) {
    // 疾病已存在，提升严重程度
    existing.severity = Math.min(100, existing.severity + 20);
    existing.days = 0; // 重置天数
    StateManager.addMessage(
      `⚠️ 原有疾病「${getDiseaseName(diseaseId)}」加重了！严重程度提升至${existing.severity}%。`,
      "danger",
    );
  } else {
    // 新增疾病
    state.diseases.active.push({
      diseaseId,
      stage: 0,
      days: 0,
      severity: 15, // 初始严重程度
    });
    StateManager.addMessage(
      `🤒 你得了「${getDiseaseName(diseaseId)}」！请注意休息和治疗。`,
      "danger",
    );
  }

  // 清除旧的二元生病状态
  state.status.sick = false;
}

/** 获取疾病名称 */
function getDiseaseName(diseaseId) {
  const disease =
    typeof getDisease === "function" ? getDisease(diseaseId) : null;
  return disease ? disease.name : diseaseId;
}

/**
 * 每日疾病演化处理
 * @param {Object} state - 游戏状态
 */
function tickDiseaseEvolution(state) {
  if (!state.diseases?.active?.length) return;

  const newDiseases = [];
  const healedDiseases = [];

  for (const disease of state.diseases.active) {
    const def =
      typeof getDisease === "function" ? getDisease(disease.diseaseId) : null;
    if (!def) continue;

    disease.days++;
    disease.severity = Math.min(
      100,
      disease.severity + def.dailyHealthMod * 0.5,
    );

    // 应用疾病效果
    applyDiseaseEffects(state, disease, def);

    // 检查演化
    if (def.evolution && disease.severity >= def.evolution.triggerThreshold) {
      if (Random.chance(def.evolution.triggerChance)) {
        // 演化为下一阶段疾病
        const nextId = def.evolution.nextDisease;
        disease.diseaseId = nextId;
        disease.severity = 20; // 新疾病初始严重程度
        disease.days = 0;
        StateManager.addMessage(
          `🔥 「${getDiseaseName(def.id)}」恶化为「${getDiseaseName(nextId)}」！`,
          "danger",
        );
      }
    }

    // 检查自愈（仅对非终末疾病）
    if (
      def.selfHealChance &&
      !def.terminal &&
      Random.chance(def.selfHealChance)
    ) {
      healedDiseases.push(disease.diseaseId);
      continue;
    }

    // 检查终末疾病致命
    if (def.terminal && disease.severity >= 95 && Random.chance(0.05)) {
      state.flags.gameOver = true;
      state.flags.gameOverReason = `因「${def.name}」病情恶化，生命走到了尽头...`;
      StateManager.addMessage(
        `💀 你因「${def.name}」病情恶化，生命走到了尽头...`,
        "danger",
      );
      continue;
    }

    newDiseases.push(disease);
  }

  // 更新疾病列表
  state.diseases.active = newDiseases;

  if (healedDiseases.length) {
    StateManager.addMessage(
      `✨ 疾病痊愈：${healedDiseases.map(getDiseaseName).join("、")}。`,
      "success",
    );
  }

  // 如果没有活跃疾病，清除生病状态
  if (state.diseases.active.length === 0) {
    state.status.sick = false;
  }
}

// ====== 食材系统 ======

/**
 * 每日食材变质检查
 * @param {Object} state - 游戏状态
 */
function tickIngredientSpoilage(state) {
  const ingredients = state.ingredients?.items || {};
  const fridge = state.ingredients?.fridge;
  let expiredCount = 0;

  for (const [id, item] of Object.entries(ingredients)) {
    const def =
      typeof getIngredient === "function" ? getIngredient(item.id || id) : null;
    if (!def) continue;

    const shelfLife = fridge ? def.shelfLife * 2 : def.shelfLife;
    const daysPassed = state.player.day - item.buyDay;

    if (daysPassed > shelfLife) {
      item.expired = true;
      expiredCount++;
    }
  }

  if (expiredCount > 0) {
    StateManager.addMessage(
      `🗑️ 有 ${expiredCount} 种食材过期变质了，扔掉了。`,
      "warning",
    );
  }
}

/**
 * 购买食材
 * @param {Object} state - 游戏状态
 * @param {string} ingredientId - 食材ID
 * @param {number} qty - 购买数量
 * @returns {Object} 购买结果
 */
function buyIngredient(state, ingredientId, qty) {
  const def =
    typeof getIngredient === "function" ? getIngredient(ingredientId) : null;
  if (!def) {
    return { success: false, message: `未知食材：${ingredientId}` };
  }

  const cost = Math.round(def.basePrice * qty * 10) / 10;
  if (state.resources.cash < cost) {
    return { success: false, message: `需要 ¥${cost}，现金不足。` };
  }

  // 检查库存容量
  const currentQty = state.ingredients?.items?.[ingredientId]?.qty || 0;
  const totalQty = currentQty + qty;
  if (totalQty > (state.ingredients?.capacity || 50)) {
    return {
      success: false,
      message: `食材库存已满（${state.ingredients?.capacity || 50}），无法购买更多。`,
    };
  }

  state.resources.cash -= cost;

  if (!state.ingredients)
    state.ingredients = { items: {}, capacity: 50, fridge: false };
  if (!state.ingredients.items) state.ingredients.items = {};

  state.ingredients.items[ingredientId] = {
    qty: totalQty,
    buyDay: state.player.day,
    expired: false,
  };

  StateManager.addMessage(
    `🛒 购买了 ${qty}${def.unit} ${def.name}，花费 ¥${cost}。`,
    "success",
  );

  return { success: true, cost, item: def, qty };
}

/**
 * 烹饪料理
 * @param {Object} state - 游戏状态
 * @param {string} recipeId - 配方ID
 * @returns {Object} 烹饪结果
 */
function cookRecipe(state, recipeId) {
  const recipe = typeof getRecipe === "function" ? getRecipe(recipeId) : null;
  if (!recipe) {
    return { success: false, message: "未知配方。" };
  }

  // 检查烹饪技能
  const cookingLevel = state.skills?.cooking?.level || 0;
  if (cookingLevel < recipe.minSkill) {
    return {
      success: false,
      message: `烹饪技能不足，需要 ${recipe.minSkill} 级（当前 ${cookingLevel} 级）。`,
    };
  }

  // 检查食材库存
  const inventory = state.ingredients?.items || {};
  const missingIngredients = [];

  for (const ing of recipe.ingredients) {
    const haveQty = inventory[ing.id]?.qty || 0;
    if (haveQty < ing.qty) {
      const ingDef =
        typeof getIngredient === "function" ? getIngredient(ing.id) : null;
      missingIngredients.push(
        `${ingDef?.name || ing.id}（需要${ing.qty}${ingDef?.unit || ""}，现有${haveQty}${ingDef?.unit || ""}）`,
      );
    }
  }

  if (missingIngredients.length > 0) {
    return {
      success: false,
      message: `缺少食材：${missingIngredients.join("、")}`,
    };
  }

  // 扣除食材
  for (const ing of recipe.ingredients) {
    if (inventory[ing.id]) {
      inventory[ing.id].qty -= ing.qty;
      if (inventory[ing.id].qty <= 0) {
        delete inventory[ing.id];
      }
    }
  }

  // 应用料理效果
  const effects = recipe.effects || {};
  for (const [key, val] of Object.entries(effects)) {
    if (key === "hunger") {
      state.needs.hunger = Math.max(0, state.needs.hunger + val);
    } else if (key === "happiness") {
      state.needs.happiness = Math.min(100, state.needs.happiness + val);
    } else if (key === "energy") {
      state.player.actionPoints = Math.min(
        state.player.maxActionPoints || 100,
        state.player.actionPoints + val,
      );
    }
  }

  // 烹饪技能提升
  const xpGain = Math.floor(recipe.cookTime * 2);
  addSkillXp("cooking", xpGain);

  StateManager.addMessage(
    `🍳 烹饪了「${recipe.name}」！${effects.hunger ? `饥饿-${Math.abs(effects.hunger)}` : ""}${effects.happiness ? `，心情+${effects.happiness}` : ""}，获得 ${xpGain} 烹饪经验。`,
    "success",
  );

  return { success: true, recipe, effects };
}

/**
 * 烹饪料理（旧版兼容）
 * @param {Object} state - 游戏状态
 * @param {string} recipeId - 配方ID
 * @returns {Object} 烹饪结果
 */
function cookRecipeCompat(state, recipeId) {
  return cookRecipe(state, recipeId);
}

/** 获取食材库存摘要 */
function getIngredientSummary(state) {
  const items = state.ingredients?.items || {};
  const summary = [];

  for (const [id, item] of Object.entries(items)) {
    if (item.qty <= 0) continue;
    const def =
      typeof getIngredient === "function" ? getIngredient(item.id || id) : null;
    if (!def) continue;

    const shelfLife = state.ingredients?.fridge
      ? def.shelfLife * 2
      : def.shelfLife;
    const daysLeft = shelfLife - (state.player.day - item.buyDay);

    summary.push({
      id: def.id,
      name: def.name,
      icon: def.icon || "🥬",
      category: def.category,
      qty: item.qty,
      unit: def.unit,
      daysLeft: daysLeft,
      expired: item.expired || daysLeft <= 0,
      price: def.basePrice,
    });
  }

  return summary;
}

/** 获取可用配方列表 */
function getAvailableCookingRecipes(state) {
  return typeof getAvailableRecipes === "function"
    ? getAvailableRecipes(state)
    : [];
}

/** 应用疾病效果到状态 */
function applyDiseaseEffects(state, disease, def) {
  const stage =
    typeof getDiseaseStage === "function"
      ? getDiseaseStage(disease.diseaseId, disease.severity)
      : null;
  if (!stage) return;

  disease.stage = stage.index;

  const effects = stage.effects || {};
  for (const [key, val] of Object.entries(effects)) {
    if (key === "health") {
      state.status.health = Math.max(0, state.status.health + val);
    } else if (key === "fatigue") {
      state.needs.fatigue = Math.min(100, state.needs.fatigue + val);
    } else if (key === "hunger") {
      state.needs.hunger = Math.min(100, state.needs.hunger + val);
    } else if (key === "happiness") {
      state.needs.happiness = Math.max(0, state.needs.happiness + val);
    } else if (key === "mental") {
      state.player.mental = Math.max(0, state.player.mental + val);
    } else if (key === "agility") {
      state.player.agility = Math.max(0, state.player.agility + val);
    }
  }
}

/**
 * 治疗疾病
 * @param {Object} state - 游戏状态
 * @param {string} diseaseId - 疾病ID（可选，不传则治疗所有）
 * @returns {Object} 治疗结果
 */
function treatDisease(state, diseaseId) {
  if (!state.diseases?.active?.length) {
    return { success: false, message: "目前没有活跃疾病。" };
  }

  const results = [];
  const targetDiseases = diseaseId
    ? state.diseases.active.filter((d) => d.diseaseId === diseaseId)
    : state.diseases.active;

  for (const disease of targetDiseases) {
    const def =
      typeof getDisease === "function" ? getDisease(disease.diseaseId) : null;
    if (!def || !def.cure) continue;

    const cure = def.cure;
    if (state.resources.cash < cure.cost) {
      results.push({
        diseaseId: disease.diseaseId,
        success: false,
        message: `治疗需要¥${cure.cost}，现金不足。`,
      });
      continue;
    }

    state.resources.cash -= cure.cost;

    if (Random.chance(cure.successRate)) {
      // 治疗成功
      const idx = state.diseases.active.findIndex(
        (d) => d.diseaseId === disease.diseaseId,
      );
      if (idx >= 0) state.diseases.active.splice(idx, 1);
      results.push({
        diseaseId: disease.diseaseId,
        success: true,
        message: `✅ 「${getDiseaseName(disease.diseaseId)}」治疗成功！`,
      });
    } else {
      // 治疗失败，病情加重
      disease.severity = Math.min(100, disease.severity + 15);
      results.push({
        diseaseId: disease.diseaseId,
        success: false,
        message: `❌ 「${getDiseaseName(disease.diseaseId)}」治疗失败，病情加重了！`,
      });
    }
  }

  return {
    success: results.some((r) => r.success),
    results,
  };
}

/** 获取当前疾病列表的摘要 */
function getDiseaseSummary(state) {
  if (!state.diseases?.active?.length) return null;

  return state.diseases.active.map((d) => {
    const def =
      typeof getDisease === "function" ? getDisease(d.diseaseId) : null;
    const stage = def ? getDiseaseStage(d.diseaseId, d.severity) : null;
    return {
      diseaseId: d.diseaseId,
      name: def?.name || d.diseaseId,
      icon: def?.icon || "🤒",
      stage: stage?.name || "未知",
      severity: d.severity,
      days: d.days,
      category: def?.category || "unknown",
    };
  });
}

// ====== 工具函数 ======

/** 检查工作需求，返回不满足的原因（通过返回null） */
function checkJobRequirements(job, state) {
  const reqs = job.requirements || {};
  const p = state.player;
  const s = state.skills;

  if (reqs.minAge && p.age < reqs.minAge) return `需要年满${reqs.minAge}岁`;
  if (reqs.maxAge && p.age > reqs.maxAge) return `年龄超过${reqs.maxAge}岁限制`;
  if (reqs.physique && p.physique < reqs.physique)
    return `体质不足 (需要${reqs.physique})`;
  if (reqs.intelligence && p.intelligence < reqs.intelligence)
    return `智力不足 (需要${reqs.intelligence})`;
  if (reqs.agility && p.agility < reqs.agility)
    return `敏捷不足 (需要${reqs.agility})`;
  if (reqs.mental && p.mental < reqs.mental)
    return `心智不足 (需要${reqs.mental})`;
  if (reqs.cooking && s.cooking.level < reqs.cooking)
    return `烹饪技能不足 (需要${reqs.cooking})`;
  if (reqs.repair && s.repair.level < reqs.repair)
    return `维修技能不足 (需要${reqs.repair})`;
  if (reqs.sales && s.sales.level < reqs.sales)
    return `销售技能不足 (需要${reqs.sales})`;
  if (reqs.english && s.english.level < reqs.english)
    return `英语技能不足 (需要${reqs.english})`;

  return null; // 通过
}

/** 估算工作收入 */
function estimateJobPay(job, state) {
  // 模拟3次取平均
  let total = 0;
  for (let i = 0; i < 10; i++) {
    total += job.payCalc(state);
  }
  let baseEstimate = Math.floor(total / 10);

  // 摆摊工作额外估算卖货收入
  const jobId = job.id || "";
  const isVendingJob = [
    "street_vending_goods",
    "street_vending_food",
    "food_stall",
  ].includes(jobId);
  if (
    isVendingJob &&
    state.inventory.items &&
    state.inventory.items.length > 0
  ) {
    const locKey = state.trade.currentLocation;
    const preferCategories =
      typeof getVendingPreferredGoods === "function"
        ? getVendingPreferredGoods(jobId)
        : [];
    let vendingEst = 0;
    for (const item of state.inventory.items) {
      const isPreferred = preferCategories.includes(item.id);
      const price =
        typeof getCurrentPrice === "function"
          ? getCurrentPrice(locKey, item.id)
          : 5;
      const ratio = isPreferred ? 0.65 : 0.2;
      vendingEst += price * item.qty * ratio;
    }
    baseEstimate += Math.floor(vendingEst);
  }

  return baseEstimate;
}

// ====== 欢迎界面 ======
function showWelcome() {
  document.getElementById("app").style.display = "none";
  const welcome = document.getElementById("welcome-screen");
  welcome.style.display = "flex";

  // 更新继续游戏按钮区域
  const loadSection = document.getElementById("load-section");
  if (loadSection) {
    const allSlots = getAllSlots();
    if (allSlots.length > 0) {
      // 找最新存档
      allSlots.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
      const latest = allSlots[0];
      loadSection.style.display = "";
      loadSection.innerHTML = `
        <button id="btn-load-latest" class="btn btn-lg">📂 继续游戏 (第${latest.day}天, ¥${latest.cash?.toLocaleString() || 0})</button>
        <button id="btn-load-menu" class="btn btn-sm" style="margin-top:8px;">📋 选择存档...</button>
      `;
      document.getElementById("btn-load-latest").onclick = () =>
        loadExistingGame(latest.slot);
      document.getElementById("btn-load-menu").onclick = () =>
        showLoadMenuOnWelcome();
    } else {
      loadSection.style.display = "none";
    }
  }

  document.getElementById("btn-new-game").onclick = () => startNewGame();
}

function startNewGame() {
  StateManager.newGame();
  initializePrices();
  // 初始化投资市场
  if (typeof initInvestmentMarket === "function") {
    initInvestmentMarket(StateManager.getState());
  }
  // 初始化天气系统
  if (typeof initWeatherState === "function") {
    initWeatherState(StateManager.getState());
  }
  StateManager.addMessage(
    "🏘️ 你揣着2000元来到了这座城市。欠村长5500元，日息0.3%。活下去，活出个人样来！",
    "event",
  );
  StateManager.addMessage(
    "💡 提示：去城中村收废品是最简单的起步方式。有了本钱可以去批发市场进货摆摊。",
    "info",
  );
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("app").style.display = "";
  gameStarted = true;
  renderAll();
}

function loadExistingGame(slot) {
  const saveData = loadGame(slot);
  if (saveData) {
    StateManager.importState(saveData);
    // 补齐投资市场数据（旧存档可能缺少）
    const state = StateManager.getState();
    if (
      state.investment &&
      Object.keys(state.investment.stockMarket).length === 0
    ) {
      if (typeof initInvestmentMarket === "function")
        initInvestmentMarket(state);
    }
    // 补齐天气数据（旧存档可能缺少weatherDef）
    if (!state.weather || !state.weather.weatherDef) {
      if (typeof initWeatherState === "function") initWeatherState(state);
    }
    StateManager.addMessage("📂 存档已加载，欢迎回来！", "info");
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("app").style.display = "";
    gameStarted = true;
    renderAll();
  }
}

/** 欢迎界面上显示存档选择 */
function showLoadMenuOnWelcome() {
  const allSlots = getAllSlotsWithEmpty();
  let bodyHtml = '<div style="max-height:400px;overflow-y:auto;">';
  for (const s of allSlots) {
    if (s.empty) {
      bodyHtml += `<div style="padding:8px;margin:4px 0;background:var(--bg-card);border-radius:4px;opacity:0.4;font-size:12px;color:var(--text-muted);">${s.label} — 空</div>`;
    } else {
      const phaseLabel = s.phase === "corporate" ? "🏢" : "🏘️";
      bodyHtml += `
        <div style="padding:10px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;cursor:pointer;transition:all 0.2s;"
             onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'"
             onclick="document.querySelector('.modal-overlay')?.remove();loadExistingGame('${s.slot}')">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>${s.label}</strong>
            <span style="font-size:11px;color:var(--text-muted)">${s.date}</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">
            ${phaseLabel} 第${s.day}天 | 年龄${s.age} | 💰 ¥${s.cash?.toLocaleString() || 0}
            ${s.rank ? ` | 🏢 ${s.rank}` : ""}
            ${s.debt > 0 ? ` | ⚠️ 欠款 ¥${s.debt.toLocaleString()}` : ""}
          </div>
        </div>
      `;
    }
  }
  bodyHtml += "</div>";

  showModal({
    title: "📂 读取存档",
    body: bodyHtml,
    buttons: [{ text: "取消", cls: "", callback: () => {} }],
  });
}

/** 初始化各地商品价格 */
function initializePrices() {
  const state = StateManager.getState();
  for (const locKey of Object.keys(LOCATIONS)) {
    state.trade.goodsPrices[locKey] = {};
    const loc = LOCATIONS[locKey];
    for (const good of GOODS) {
      let price = good.basePrice;
      if (loc.priceMod && loc.priceMod[good.id]) {
        price *= loc.priceMod[good.id];
      }
      // 随机波动 ±10%
      price *= Random.float(0.9, 1.1);
      price = Math.round(price * 100) / 100;
      state.trade.goodsPrices[locKey][good.id] = price;
    }
  }
  state.trade.lastPriceUpdate = state.player.day;
}

// ====== 可用行动列表 ======
function getAvailableActions(state) {
  const actions = [];

  if (state.player.phase === "street") {
    // --- 街头阶段行动 ---

    // 1. 工作
    const locKey = state.trade.currentLocation;
    const jobIds = getJobsAtLocation(locKey);
    for (const jobId of jobIds) {
      const job = getJobById(jobId);
      if (!job) continue;
      const reqFail = checkJobRequirements(job, state);
      const payEstimate = reqFail ? null : estimateJobPay(job, state);

      // 摆摊工作：如果有货物在背包，追加提示
      const isVendingJob = [
        "street_vending_goods",
        "street_vending_food",
        "food_stall",
      ].includes(jobId);
      let jobDesc = job.desc;
      if (
        isVendingJob &&
        state.inventory.items &&
        state.inventory.items.length > 0
      ) {
        jobDesc += " 背包有货可卖，收入更高！";
      } else if (isVendingJob) {
        jobDesc += " 进货后摆摊可获额外收入。";
      }

      actions.push({
        id: "job_" + jobId,
        name: job.name,
        desc: jobDesc,
        icon: job.icon,
        payEstimate: payEstimate
          ? `${payEstimate - (job.startupCost || 0)}~${payEstimate + Math.floor(payEstimate * 0.3)}`
          : null,
        costEstimate: job.startupCost || null,
        reqFail,
        disabled:
          !!reqFail ||
          (job.startupCost && state.resources.cash < job.startupCost
            ? `启动资金不足(需¥${job.startupCost})`
            : null) ||
          null,
        handler: () => {
          const finalReq = checkJobRequirements(job, state);
          if (finalReq) {
            StateManager.addMessage(`⚠️ ${finalReq}`, "warning");
            return;
          }
          if (job.startupCost && state.resources.cash < job.startupCost) {
            StateManager.addMessage(
              `⚠️ 启动资金不足，需要 ¥${job.startupCost}`,
              "warning",
            );
            return;
          }
          doStreetJob(job);
        },
      });
    }

    // 如果没有可用工作
    if (jobIds.length === 0) {
      actions.push({
        id: "no_jobs",
        name: "当前地点没有工作机会",
        desc: "尝试旅行到其他地点寻找工作。",
        icon: "🚫",
        disabled: true,
      });
    }

    // 批发市场 — 批发进货
    if (locKey === "wholesaleMarket") {
      actions.push({
        id: "wholesale_header",
        name: "📦 批发进货（转到交易Tab）",
        desc: "在批发市场以折扣价批量购入商品，转手到商业区卖出赚差价！",
        icon: "📦",
        handler: () => {
          switchTab("trade");
        },
      });
      // 和批发商套近乎
      actions.push({
        id: "befriend_wholesaler",
        name: "和批发商套近乎",
        desc: "花¥20请批发商喝杯茶，改善关系后进货更便宜。(-8AP)",
        icon: "🍵",
        costEstimate: 20,
        disabled:
          state.resources.cash < 20
            ? "资金不足"
            : state.player.actionPoints < 8
              ? "AP不足"
              : null,
        handler: () => {
          if (!consumeAP(8)) return;
          const st = StateManager.getState();
          if (st.resources.cash < 20) return;
          st.resources.cash -= 20;
          if (!st.relationships.wholesaler)
            st.relationships.wholesaler = { affinity: 0, met: false };
          st.relationships.wholesaler.met = true;
          const gain = Random.int(3, 7);
          st.relationships.wholesaler.affinity = Math.min(
            100,
            (st.relationships.wholesaler.affinity || 0) + gain,
          );
          StateManager.addMessage(
            `🍵 请批发商喝了杯茶，关系+${gain}（当前${st.relationships.wholesaler.affinity}）。`,
            "info",
          );
        },
      });
    }

    // 零售买卖 — 在任何有价格数据的地点都可以买卖
    if (
      state.trade.goodsPrices[locKey] &&
      Object.keys(state.trade.goodsPrices[locKey]).length > 0
    ) {
      actions.push({
        id: "trade_header",
        name: "🛒 买卖商品（转到交易Tab）",
        desc: "查看当前市场价格，低买高卖赚取差价。",
        icon: "🛒",
        handler: () => {
          switchTab("trade");
        },
      });
    }

    // === 住所系统 ===
    if (locKey === "slum") {
      const currentTier = state.housing?.tier || 0;
      const HOUSING_TIERS = [
        {
          tier: 0,
          name: "露宿街头",
          cost: 0,
          rent: 0,
          capacity: 20,
          fatigueRecovery: 15,
          desc: "天为被，地为床。碰上刮风下雨就惨了。",
          icon: "🌃",
        },
        {
          tier: 1,
          name: "合租床位",
          cost: 300,
          rent: 12,
          capacity: 50,
          fatigueRecovery: 25,
          hygieneBonus: 5,
          desc: "城中村合租屋的一个床位，好歹有个遮风挡雨的地方。",
          icon: "🛏️",
        },
        {
          tier: 2,
          name: "单间",
          cost: 800,
          rent: 25,
          capacity: 100,
          fatigueRecovery: 35,
          hygieneBonus: 10,
          happinessBonus: 5,
          desc: "独立小单间，有床有柜子，私密多了。",
          icon: "🚪",
        },
        {
          tier: 3,
          name: "一居室",
          cost: 2000,
          rent: 50,
          capacity: 200,
          fatigueRecovery: 50,
          hygieneBonus: 15,
          happinessBonus: 10,
          desc: "正经的一室一厅，独立卫浴，生活质量质的飞跃。",
          icon: "🏠",
        },
      ];

      // 显示当前住所
      const curHouse = HOUSING_TIERS[currentTier];
      actions.push({
        id: "housing_current",
        name: `${curHouse.icon} 当前住所：${curHouse.name}`,
        desc: `容量+${curHouse.capacity} | 睡眠恢复疲劳-${curHouse.fatigueRecovery} | ${curHouse.desc}${curHouse.rent > 0 ? ` | 日租¥${curHouse.rent}/天` : ""}`,
        icon: curHouse.icon,
        disabled: true,
      });

      // 可升级的住所
      for (let t = currentTier + 1; t < HOUSING_TIERS.length; t++) {
        const house = HOUSING_TIERS[t];
        const canAfford = state.resources.cash >= house.cost;
        actions.push({
          id: "housing_upgrade_" + t,
          name: `⬆️ 升级到${house.name}`,
          desc: `${house.desc} 一次性付¥${house.cost} + 日租¥${house.rent}/天`,
          icon: house.icon,
          costEstimate: house.cost,
          disabled: !canAfford,
          reqFail: !canAfford ? `需 ¥${house.cost}` : null,
          handler: () => {
            state.resources.cash -= house.cost;
            state.housing.tier = t;
            state.housing.rentedDay = state.player.day;
            state.inventory.capacity =
              house.capacity + (state.housing.storageCapacity || 0);
            StateManager.addMessage(
              `🏠 搬进了${house.name}！容量提升至${state.inventory.capacity}。`,
              "success",
            );
          },
        });
      }
    }

    // === 仓库租赁（批发市场）===
    if (locKey === "wholesaleMarket") {
      const hasStorage = state.housing?.storageRented;
      const STORAGE_OPTIONS = [
        {
          id: "small",
          name: "小仓库",
          cost: 500,
          rent: 20,
          capacity: 150,
          icon: "📦",
        },
        {
          id: "big",
          name: "大仓库",
          cost: 1500,
          rent: 50,
          capacity: 500,
          icon: "🏗️",
        },
      ];

      if (hasStorage) {
        actions.push({
          id: "storage_current",
          name: `📦 已租仓库 (额外+${state.housing.storageCapacity || 0}容量)`,
          desc: `日租¥${STORAGE_OPTIONS.find((s) => s.capacity === state.housing.storageCapacity)?.rent || "?"}/天`,
          icon: "📦",
          disabled: true,
        });
      } else {
        for (const opt of STORAGE_OPTIONS) {
          const canAfford = state.resources.cash >= opt.cost;
          actions.push({
            id: "storage_rent_" + opt.id,
            name: `📦 租用${opt.name}`,
            desc: `额外+${opt.capacity}商品存储容量。一次性¥${opt.cost} + 日租¥${opt.rent}/天`,
            icon: opt.icon,
            costEstimate: opt.cost,
            disabled: !canAfford,
            reqFail: !canAfford ? `需 ¥${opt.cost}` : null,
            handler: () => {
              state.resources.cash -= opt.cost;
              state.housing.storageRented = true;
              state.housing.storageCapacity = opt.capacity;
              const baseCap = [20, 50, 100, 200][state.housing.tier || 0];
              state.inventory.capacity = baseCap + opt.capacity;
              StateManager.addMessage(
                `📦 租下了${opt.name}！总容量提升至${state.inventory.capacity}。`,
                "success",
              );
            },
          });
        }
      }
    }

    // === 容器购买（所有地点可用，carry.js 系统） ===
    if (typeof CONTAINER_TYPES !== "undefined") {
      const containers = state.inventory.containers || [];
      for (const ct of CONTAINER_TYPES) {
        if (ct.id === "none" || ct.price === 0) continue;
        const owned = containers.find((c) => c.containerId === ct.id);
        if (owned) continue;
        const canAfford = state.resources.cash >= ct.price;
        actions.push({
          id: "buy_container_" + ct.id,
          name: `🛍️ 购买${ct.name}`,
          desc: `${ct.desc} 容量+${ct.capacity} 体积+${ct.volumeCapacity}${ct.weightReduction > 0 ? ` 减负${Math.round(ct.weightReduction * 100)}%` : ""}。(-5AP)`,
          icon: "🎒",
          costEstimate: ct.price,
          disabled: !canAfford
            ? `需要¥${ct.price}`
            : state.player.actionPoints < 5
              ? "AP不足"
              : false,
          handler: () => {
            if (!consumeAP(5)) return;
            if (typeof buyContainer === "function") buyContainer(ct.id);
            renderAll();
          },
        });
      }
    }

    // 2. 旅行（距离决定AP消耗，负重+天气增加消耗）
    const reachable = getReachableLocations(locKey);
    const weatherBlocked =
      typeof isWeatherTravelBlocked === "function"
        ? isWeatherTravelBlocked(state)
        : false;
    const weatherAPPenalty =
      typeof getWeatherTravelAPPenalty === "function"
        ? getWeatherTravelAPPenalty(state)
        : 0;
    for (const destKey of reachable) {
      const dest = getLocation(destKey);
      if (!dest) continue;
      let travelAP = getTravelAPCost(locKey, destKey);
      // 负重AP惩罚
      const encAP =
        typeof getEncumbranceAPPenalty === "function"
          ? getEncumbranceAPPenalty(state)
          : 0;
      if (encAP > 0) travelAP += encAP;
      // 负重速度惩罚增加额外AP
      const encMove =
        typeof getEncumbranceMovePenalty === "function"
          ? getEncumbranceMovePenalty(state)
          : 0;
      if (encMove > 0) travelAP += Math.ceil(travelAP * encMove);
      // 天气AP惩罚
      if (weatherAPPenalty > 0) travelAP += weatherAPPenalty;
      const travelLabel =
        travelAP <= 10 ? "🚶 近" : travelAP <= 20 ? "🚶🚶 中" : "🚶🚶🚶 远";
      const encLabel = encAP > 0 ? ` 负重+${encAP}AP` : "";
      const weatherLabel =
        weatherAPPenalty > 0 ? ` 天气+${weatherAPPenalty}AP` : "";
      actions.push({
        id: "travel_" + destKey,
        name: `前往 ${dest.name}`,
        desc: `${dest.desc} [${travelLabel} | -${travelAP}AP${encLabel}${weatherLabel}]`,
        icon: "🚶",
        disabled: weatherBlocked
          ? "⚠️极端天气不宜出行"
          : state.player.actionPoints < travelAP
            ? `AP不足(${travelAP})`
            : null,
        handler: () => {
          if (weatherBlocked) {
            StateManager.addMessage("⚠️ 天气太恶劣，无法出行！", "danger");
            return;
          }
          if (!consumeAP(travelAP)) return;
          StateManager.update("trade.currentLocation", destKey);
          StateManager.addMessage(
            `🚶 你来到了${dest.name}。(-${travelAP}AP)`,
            "info",
          );
        },
      });
    }

    // 3. 通用行动
    actions.push({
      id: "rest",
      name: "休息一会",
      desc: "找个地方坐坐，恢复一些疲劳。(-20AP)",
      icon: "😴",
      disabled: state.player.actionPoints < AP_COSTS.rest ? "AP不足" : null,
      handler: () => {
        if (!consumeAP(AP_COSTS.rest)) return;
        const state = StateManager.getState();
        const recovery = Random.int(25, 39);
        state.needs.fatigue = Math.max(0, state.needs.fatigue - recovery);
        state.needs.happiness = Math.min(100, state.needs.happiness + 5);
        StateManager.addMessage(
          `😴 你休息了一会，疲劳-${recovery}。(-${AP_COSTS.rest}AP)`,
          "info",
        );
      },
    });

    actions.push({
      id: "eat",
      name: "吃顿饭",
      desc: "花10元在路边摊吃个快餐，填饱肚子。(-5AP)",
      icon: "🍚",
      costEstimate: 10,
      disabled:
        state.resources.cash < 10
          ? true
          : state.player.actionPoints < AP_COSTS.eat
            ? "AP不足"
            : false,
      handler: () => {
        if (!consumeAP(AP_COSTS.eat)) return;
        const st = StateManager.getState();
        if (st.resources.cash < 10) {
          StateManager.addMessage("⚠️ 钱不够吃饭了！", "danger");
          return;
        }
        st.resources.cash -= 10;
        st.needs.hunger = Math.min(100, st.needs.hunger + 35);
        st.needs.happiness = Math.min(100, st.needs.happiness + 8);
        StateManager.addMessage(
          "🍚 你花10元吃了顿饭，肚子饱了心情好了。(-5AP)",
          "success",
        );
      },
    });

    actions.push({
      id: "shower",
      name: "洗澡",
      desc: "花5元去公共澡堂洗个澡。(-5AP)",
      icon: "🚿",
      costEstimate: 5,
      disabled:
        state.resources.cash < 5
          ? true
          : state.player.actionPoints < AP_COSTS.shower
            ? "AP不足"
            : false,
      handler: () => {
        if (!consumeAP(AP_COSTS.shower)) return;
        const st = StateManager.getState();
        if (st.resources.cash < 5) {
          StateManager.addMessage("⚠️ 不够钱洗澡。", "danger");
          return;
        }
        st.resources.cash -= 5;
        st.needs.hygiene = Math.min(100, st.needs.hygiene + 40);
        StateManager.addMessage("🚿 洗了个澡，神清气爽。(-5AP)", "success");
      },
    });

    // 银行相关行动（晚上银行关门）
    const bankOpen = state.player.timeSlot !== "evening";
    if (locKey === "bank") {
      const bankDisabled = !bankOpen;
      actions.push({
        id: "deposit",
        name: "存款",
        desc:
          "把钱存入银行，吃利息也更安全。(-5AP)" +
          (bankDisabled ? " ⏰银行晚上不营业" : ""),
        icon: "🏦",
        disabled: bankDisabled
          ? "银行晚上不营业"
          : state.resources.cash <= 0
            ? true
            : state.player.actionPoints < AP_COSTS.deposit
              ? "AP不足"
              : false,
        handler: () => {
          if (!consumeAP(AP_COSTS.deposit)) return;
          showDepositModal();
        },
      });
      actions.push({
        id: "withdraw",
        name: "取款",
        desc: "从银行取出存款。(-5AP)",
        icon: "💰",
        disabled: bankDisabled
          ? "银行晚上不营业"
          : state.resources.bankBalance <= 0
            ? true
            : state.player.actionPoints < AP_COSTS.withdraw
              ? "AP不足"
              : false,
        handler: () => {
          if (!consumeAP(AP_COSTS.withdraw)) return;
          showWithdrawModal();
        },
      });
      actions.push({
        id: "loan",
        name: "贷款",
        desc: "向银行贷款（日息0.3%），解燃眉之急。(-10AP)",
        icon: "📝",
        disabled: bankDisabled
          ? "银行晚上不营业"
          : state.player.actionPoints < AP_COSTS.loan
            ? "AP不足"
            : null,
        handler: () => {
          if (!consumeAP(AP_COSTS.loan)) return;
          showLoanModal();
        },
      });
      actions.push({
        id: "repay",
        name: "还债",
        desc: "偿还部分或全部欠款。(-5AP)",
        icon: "💸",
        disabled: bankDisabled
          ? "银行晚上不营业"
          : state.resources.debt <= 0 && state.resources.cash <= 0
            ? true
            : state.player.actionPoints < AP_COSTS.repay
              ? "AP不足"
              : false,
        handler: () => {
          if (!consumeAP(AP_COSTS.repay)) return;
          showRepayModal();
        },
      });
    }

    // 医院
    if (locKey === "hospital") {
      actions.push({
        id: "heal",
        name: "看病治疗",
        desc: "花50元看病，恢复健康、治疗伤病。(-25AP)",
        icon: "🏥",
        costEstimate: 50,
        disabled:
          state.resources.cash < 50
            ? true
            : state.player.actionPoints < AP_COSTS.heal
              ? "AP不足"
              : false,
        handler: () => {
          if (!consumeAP(AP_COSTS.heal)) return;
          const st = StateManager.getState();
          st.resources.cash -= 50;
          st.status.health = Math.min(100, st.status.health + 40);
          st.status.sick = false;
          st.status.injured = false;
          StateManager.addMessage(
            "🏥 看了医生，健康恢复了不少。(-25AP)",
            "success",
          );
        },
      });
    }

    // 培训中心
    if (locKey === "trainingCenter") {
      actions.push({
        id: "study",
        name: "自学提升",
        desc: "花时间看书学习，提升技能等级。(-30AP)",
        icon: "📚",
        disabled: state.player.actionPoints < AP_COSTS.study ? "AP不足" : null,
        handler: () => {
          if (!consumeAP(AP_COSTS.study)) return;
          const st = StateManager.getState();
          // 学习效率受智力和疲劳影响
          const intBonus = 1 + st.player.intelligence * 0.005;
          const fatiguePenalty =
            st.needs.fatigue > 60 ? 0.7 : st.needs.fatigue > 40 ? 0.85 : 1.0;
          const efficiency = intBonus * fatiguePenalty;
          const skillKeys = Object.keys(st.skills);
          const key = Random.fromArray(skillKeys);
          const xpGain = Math.floor((20 + Random.float(0, 30)) * efficiency);
          st.skills[key].xp += xpGain;
          // 检查升级
          const skill = st.skills[key];
          const xpNeeded = (skill.level + 1) * 100;
          if (skill.xp >= xpNeeded && skill.level < 100) {
            skill.level++;
            skill.xp -= xpNeeded;
            StateManager.addMessage(
              `📚 你的${getSkillName(key)}提升到了等级 ${skill.level}！`,
              "success",
            );
          }
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 8);
          const effLabel =
            efficiency < 0.8
              ? "（效率低）"
              : efficiency > 1.1
                ? "（效率高）"
                : "";
          StateManager.addMessage(
            `📚 你花时间学习了${getSkillName(key)}，获得${xpGain}经验${effLabel}。(-30AP)`,
            "info",
          );
        },
      });

      // 夜校：只有晚上才能上
      if (state.player.timeSlot === "evening") {
        actions.push({
          id: "night_school",
          name: "上夜校",
          desc: "晚上参加夜校课程，系统学习技能。效果比自学好。花费¥20。(-25AP)",
          icon: "🏫",
          costEstimate: 20,
          disabled:
            state.resources.cash < 20
              ? "资金不足"
              : state.player.actionPoints < 25
                ? "AP不足"
                : null,
          handler: () => {
            if (!consumeAP(25)) return;
            const st = StateManager.getState();
            if (st.resources.cash < 20) return;
            st.resources.cash -= 20;
            // 夜校效率更高（有老师指导）
            const intBonus = 1 + st.player.intelligence * 0.008;
            const fatiguePenalty = st.needs.fatigue > 70 ? 0.75 : 1.0;
            const efficiency = intBonus * fatiguePenalty * 1.5; // 夜校1.5倍效率
            const skillKeys = Object.keys(st.skills);
            const key = Random.fromArray(skillKeys);
            const xpGain = Math.floor((35 + Random.float(0, 25)) * efficiency);
            st.skills[key].xp += xpGain;
            const skill = st.skills[key];
            const xpNeeded = (skill.level + 1) * 100;
            if (skill.xp >= xpNeeded && skill.level < 100) {
              skill.level++;
              skill.xp -= xpNeeded;
              StateManager.addMessage(
                `🏫 夜校学习：${getSkillName(key)}提升到了等级 ${skill.level}！`,
                "success",
              );
            }
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 12);
            StateManager.addMessage(
              `🏫 参加了夜校${getSkillName(key)}课程，获得${xpGain}经验。(-25AP)`,
              "info",
            );
          },
        });
      }
    }

    // 公园（晚上公园行动不同）
    if (locKey === "park") {
      const isEvening = state.player.timeSlot === "evening";
      actions.push({
        id: "relax_park",
        name: isEvening ? "公园夜散步" : "公园放松",
        desc: isEvening
          ? "夜晚的公园别有风味，人少但有点冷。(-15AP)"
          : "在公园散步、看风景，放松身心。(-15AP)",
        icon: isEvening ? "🌙" : "🌳",
        disabled: state.player.actionPoints < AP_COSTS.relax ? "AP不足" : null,
        handler: () => {
          if (!consumeAP(AP_COSTS.relax)) return;
          const st = StateManager.getState();
          st.needs.happiness = Math.min(100, st.needs.happiness + 20);
          st.needs.fatigue = Math.max(0, st.needs.fatigue - 10);
          StateManager.addMessage(
            "🌳 在公园散了会步，心情舒畅多了。(-15AP)",
            "success",
          );
        },
      });
    }

    // 科技园 — 触发职场阶段入口
    if (locKey === "techPark" && state.player.phase === "street") {
      const canTransition = state.player.intelligence >= 45;
      actions.push({
        id: "apply_job",
        name: "应聘互联网公司",
        desc: canTransition
          ? "你的能力已经足够，可以去试试看！(-20AP)"
          : "需要智力 ≥ 45 才能获得面试机会。",
        icon: "💼",
        disabled:
          !canTransition || state.player.actionPoints < AP_COSTS.interview,
        reqFail: !canTransition
          ? "智力不足45"
          : state.player.actionPoints < AP_COSTS.interview
            ? "AP不足"
            : null,
        handler: () => {
          if (!consumeAP(AP_COSTS.interview)) return;
          if (canTransition) {
            showInterviewModal();
          }
        },
      });
    }
  }

  // --- 职场阶段行动 ---
  if (state.player.phase === "corporate") {
    const rankData = CORP_RANKS[state.corporate.rank] || CORP_RANKS.P5;
    for (const action of CORP_ACTIONS) {
      let disabled = false;
      let reqText = "";
      if (action.requiresRank) {
        const rankIdx = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(
          state.corporate.rank,
        );
        const reqIdx = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(
          action.requiresRank,
        );
        if (rankIdx < reqIdx) {
          disabled = true;
          reqText = `需 ${action.requiresRank}+`;
        }
      }
      if (action.cost && state.resources.cash < action.cost) {
        disabled = true;
        reqText = `需 ¥${action.cost}`;
      }

      const effPreview = [];
      if (action.effects.kpi)
        effPreview.push(
          `KPI${action.effects.kpi > 0 ? "+" + action.effects.kpi : action.effects.kpi}`,
        );
      if (action.effects.hair)
        effPreview.push(
          `发量${action.effects.hair > 0 ? "+" + action.effects.hair : action.effects.hair}`,
        );
      if (action.effects.risk)
        effPreview.push(
          `风险${action.effects.risk > 0 ? "+" + action.effects.risk : action.effects.risk}`,
        );

      actions.push({
        id: "corp_" + action.id,
        name: action.name,
        desc: action.desc,
        icon: action.icon,
        costEstimate: action.cost || null,
        reqFail: reqText || null,
        disabled,
        handler: () => {
          if (typeof doCorporateAction === "function")
            doCorporateAction(action.id);
        },
      });
    }

    // 团队管理入口
    if (state.corporate.team.length > 0 || rankData.canManageTeam) {
      actions.push({
        id: "corp_team_view",
        name: "👥 查看团队详情",
        desc: `管理你的${state.corporate.team.length}名团队成员。Q2可招聘。`,
        icon: "👥",
        handler: () => {
          renderCorporateActions(StateManager.getState());
          renderSidebar(StateManager.getState());
        },
      });
    }
  }

  // --- 培训中心：证书考试 ---
  if (locKey === "trainingCenter" && typeof CERTIFICATES !== "undefined") {
    const available =
      typeof getAvailableCertificates === "function"
        ? getAvailableCertificates(state)
        : [];
    for (const cert of available) {
      if (state.certificates.includes(cert.id)) continue;
      const canAfford = state.resources.cash >= cert.requirements.cash;
      actions.push({
        id: "cert_" + cert.id,
        name: `📜 考取${cert.name}`,
        desc: `${cert.desc} 费用:¥${cert.requirements.cash} 通过率:${Math.round(cert.examPassRate * 100)}%`,
        icon: "📜",
        costEstimate: cert.requirements.cash,
        disabled: !canAfford || state.player.actionPoints < AP_COSTS.take_exam,
        reqFail: !canAfford
          ? `需 ¥${cert.requirements.cash}`
          : state.player.actionPoints < AP_COSTS.take_exam
            ? "AP不足"
            : null,
        handler: () => {
          if (!consumeAP(AP_COSTS.take_exam)) return;
          if (Random.chance(cert.examPassRate)) {
            state.certificates.push(cert.id);
            state.resources.cash -= cert.requirements.cash;
            if (cert.effects.codingXp)
              addSkillXp("coding", cert.effects.codingXp);
            if (cert.effects.englishXp)
              addSkillXp("english", cert.effects.englishXp);
            if (cert.effects.weldingXp)
              addSkillXp("welding", cert.effects.weldingXp);
            if (cert.effects.electricianXp)
              addSkillXp("electrician", cert.effects.electricianXp);
            if (cert.effects.accountingXp)
              addSkillXp("accounting", cert.effects.accountingXp);
            if (cert.effects.managementXp)
              addSkillXp("management", cert.effects.managementXp);
            if (cert.effects.drivingXp)
              addSkillXp("driving", cert.effects.drivingXp);
            if (cert.effects.intelligence)
              state.player.intelligence = Math.min(
                100,
                state.player.intelligence + cert.effects.intelligence,
              );
            if (cert.effects.physique)
              state.player.physique = Math.min(
                100,
                state.player.physique + cert.effects.physique,
              );
            if (cert.effects.repair) addSkillXp("repair", cert.effects.repair);
            StateManager.addMessage(
              `📜 恭喜！成功考取${cert.name}！`,
              "success",
            );
          } else {
            state.resources.cash -= Math.floor(cert.requirements.cash / 2);
            StateManager.addMessage(
              `📜 ${cert.name}考试未通过，报名费损失一半。下次再努力！`,
              "warning",
            );
          }
        },
      });
    }
  }

  // --- NPC 互动 ---
  if (typeof NPCS !== "undefined") {
    const npcsHere = getNpcsAtLocation(locKey);
    for (const npc of npcsHere) {
      const rel = state.relationships[npc.id] || { affinity: 0, met: false };
      const affLabel =
        typeof getAffinityLabel === "function"
          ? getAffinityLabel(rel.affinity)
          : "";
      actions.push({
        id: "npc_" + npc.id,
        name: `💬 与${npc.name}交谈`,
        desc: `${npc.role} — ${affLabel} (-8AP)`,
        icon: "💬",
        disabled:
          state.player.actionPoints < AP_COSTS.talk_npc ? "AP不足" : null,
        handler: () => {
          if (!consumeAP(AP_COSTS.talk_npc)) return;
          if (!state.relationships[npc.id])
            state.relationships[npc.id] = { affinity: 0, met: true };
          const r = state.relationships[npc.id];
          r.met = true;
          r.affinity = Math.min(100, r.affinity + Random.int(5, 9));
          const line = npc.talkLines[Random.int(0, npc.talkLines.length - 1)];
          StateManager.addMessage(
            `💬 ${npc.name}：${line} (好感+${5})`,
            "info",
          );
          state.needs.happiness = Math.min(100, state.needs.happiness + 3);
          if (r.affinity >= 60 && !r._gifted) {
            StateManager.addMessage(
              `🎁 ${npc.name}给了你一点小礼物！`,
              "success",
            );
            state.resources.cash += 20;
            r._gifted = true;
          }
        },
      });
    }
  }

  // 6. 恋爱/社交行动
  if (state.romance) {
    // 约会
    if (
      state.romance.partner &&
      (state.romance.relationship === "single" ||
        state.romance.relationship === "dating")
    ) {
      actions.push({
        id: "date",
        name: "约会",
        desc: `和${state.romance.partner.name}出去约会，提升好感。花费约¥30-80。(-10AP)`,
        icon: "🌹",
        costEstimate: 50,
        disabled: state.player.actionPoints < 10 ? "AP不足" : null,
        handler: () => {
          goOnDate(StateManager.getState());
        },
      });
    }
    // 求婚
    if (
      state.romance.relationship === "dating" &&
      state.romance.partner &&
      state.romance.partner.affinity >= 80
    ) {
      actions.push({
        id: "propose",
        name: "求婚",
        desc: `向${state.romance.partner.name}求婚！需要¥500+。`,
        icon: "💍",
        costEstimate: 800,
        disabled: state.resources.cash < 500 ? "资金不足" : null,
        handler: () => {
          propose(StateManager.getState());
        },
      });
    }
    // 行贿城管
    if (state.relationships.chengguan && state.relationships.chengguan.met) {
      actions.push({
        id: "bribe_chengguan",
        name: "请城管吃顿饭",
        desc: `改善城管关系，降低被查风险。当前关系：${state.relationships.chengguan.affinity || 0}`,
        icon: "🤝",
        costEstimate: 50,
        disabled: state.resources.cash < 30 ? "资金不足" : null,
        handler: () => {
          bribeChengguan(
            StateManager.getState(),
            30 + Math.floor(Random.float(0, 30)),
          );
        },
      });
    }
  }

  return actions;
}

/** 执行街头工作 */
function doStreetJob(job) {
  const state = StateManager.getState();

  // 确定AP消耗（根据工作类型）
  let jobAP = AP_COSTS.job_medium; // 默认
  const jobId = job.id || "";
  if (
    jobId.includes("waste") ||
    jobId.includes("delivery") ||
    jobId.includes("package") ||
    jobId.includes("maintenance") ||
    jobId.includes("security") ||
    jobId.includes("guard")
  ) {
    jobAP = AP_COSTS.job_light;
  } else if (
    jobId.includes("construction") ||
    jobId.includes("overtime") ||
    jobId.includes("manual")
  ) {
    jobAP = AP_COSTS.job_heavy;
  } else if (
    jobId.includes("tutor") ||
    jobId.includes("repair") ||
    jobId.includes("barber") ||
    jobId.includes("performer")
  ) {
    jobAP = AP_COSTS.job_skilled;
  }

  // 消耗AP（NPC在场可减少AP消耗）
  if (typeof getNpcPresenceBonus === "function") {
    const apBonus = getNpcPresenceBonus(state, "apEfficiency");
    if (apBonus.bonus > 0) {
      jobAP = Math.max(5, jobAP - apBonus.bonus);
    }
  }
  if (!consumeAP(jobAP)) return;

  // 扣除启动资金
  if (job.startupCost) {
    state.resources.cash -= job.startupCost;
  }

  // 计算基础收入（固定收入，受技能/属性影响）
  const basePay = job.payCalc(state);

  // NPC在场加成：好感度影响工作收入
  let npcIncomeBonus = 0;
  if (typeof getNpcPresenceBonus === "function") {
    const npcBonus = getNpcPresenceBonus(state, "jobIncome");
    if (npcBonus.bonus > 0) {
      npcIncomeBonus = Math.round(basePay * npcBonus.bonus);
    }
  }
  const totalBasePay = basePay + npcIncomeBonus;
  state.resources.cash += totalBasePay;
  state.resources.totalEarned += totalBasePay;

  if (npcIncomeBonus > 0) {
    StateManager.addMessage(
      `🤝 NPC好感加成，收入+¥${npcIncomeBonus}！`,
      "success",
    );
  }

  // === 摆摊卖货：背包中的商品自动售出 ===
  const isVendingJob = [
    "street_vending_goods",
    "street_vending_food",
    "food_stall",
  ].includes(jobId);
  let vendingIncome = 0;
  let vendingDetails = [];

  if (
    isVendingJob &&
    state.inventory.items &&
    state.inventory.items.length > 0
  ) {
    const locKey = state.trade.currentLocation;
    // 根据摆摊类型确定偏好商品类别
    const preferCategories = getVendingPreferredGoods(jobId);

    // 遍历背包商品，按偏好程度决定卖出数量
    for (const item of [...state.inventory.items]) {
      const good =
        typeof getGoodById === "function" ? getGoodById(item.id) : null;
      if (!good) continue;

      // 判断是否属于该摆摊偏好的商品
      const isPreferred = preferCategories.includes(item.id);
      // 偏好商品卖出更多（50%-80%），非偏好商品少量卖出（10%-30%）
      const sellRatio = isPreferred
        ? Random.float(0.5, 0.8)
        : Random.float(0.1, 0.3);
      const sellQty = Math.max(1, Math.floor(item.qty * sellRatio));

      if (sellQty <= 0) continue;

      // 计算售价（使用当前地点价格 + 摆摊加成）
      let price =
        typeof getCurrentPrice === "function"
          ? getCurrentPrice(locKey, item.id)
          : good.basePrice || 1;
      // 摆摊加成：销售技能提升售价（最高+30%）
      const salesBonus = 1 + state.skills.sales.level * 0.006;
      // 名气加成（回头客效应）
      const fameBonus = 1 + (state.status.fame || 0) * 0.001;
      price = price * Math.min(salesBonus * fameBonus, 1.5);

      const earned = Math.round(price * sellQty * 100) / 100;
      vendingIncome += earned;

      // 扣减背包
      item.qty -= sellQty;
      if (item.qty <= 0) {
        state.inventory.items = state.inventory.items.filter(
          (i) => i.id !== item.id,
        );
      }

      // 记录供需
      if (typeof recordLocalSale === "function")
        recordLocalSale(state, locKey, item.id, sellQty);

      const profitLabel = isPreferred ? "主力" : "附带";
      vendingDetails.push(
        `${profitLabel}${good.name}×${sellQty} ¥${earned.toFixed(0)}`,
      );
    }

    // 保存天气调整前的原始摆摊收入
    const rawVendingIncome = vendingIncome;

    // === 🌤️ 天气 → 客流量 → 摆摊收益闭环 ===
    if (isVendingJob && state.weather && state.weather.weatherDef) {
      const w = state.weather.weatherDef;
      const trafficMod =
        typeof getWeatherFootTrafficModifier === "function"
          ? getWeatherFootTrafficModifier(state)
          : 1.0;

      // 客流量影响摆摊卖货收入（vendingIncome部分）
      if (trafficMod < 1.0 && rawVendingIncome > 0) {
        // 某些坏天气下特定商品有需求加成，部分抵消客流影响
        let demandCompensation = 1.0;
        if (typeof getWeatherDemandBonus === "function") {
          let totalBonus = 0;
          let bonusCount = 0;
          for (const item of state.inventory.items || []) {
            const db = getWeatherDemandBonus(w.id, item.id);
            if (db > 1.0) {
              totalBonus += db;
              bonusCount++;
            }
          }
          if (bonusCount > 0) demandCompensation = totalBonus / bonusCount;
        }

        // 有效客流量 = 基础客流 + 需求补偿的一半（封顶1.0）
        const effectiveTraffic = Math.min(
          1.0,
          trafficMod + (demandCompensation - 1.0) * 0.5,
        );
        vendingIncome = Math.round(rawVendingIncome * effectiveTraffic);
        const lossAmount = rawVendingIncome - vendingIncome;

        if (lossAmount > 5) {
          const demandGoods = (state.inventory.items || [])
            .filter(
              (i) =>
                typeof getWeatherDemandBonus === "function" &&
                getWeatherDemandBonus(w.id, i.id) > 1.0,
            )
            .map((i) => {
              const g =
                typeof getGoodById === "function" ? getGoodById(i.id) : null;
              return g ? g.name : i.id;
            });
          if (demandGoods.length > 0 && trafficMod < 0.7) {
            StateManager.addMessage(
              `🌤️ 客流偏少(↓${Math.round((1 - effectiveTraffic) * 100)}%)，但${demandGoods.slice(0, 2).join("、")}还算好卖。`,
              "event",
            );
          } else {
            StateManager.addMessage(
              `🌧️ 天气影响客流(↓${Math.round((1 - effectiveTraffic) * 100)}%)，摆摊少赚约¥${lossAmount}。`,
              "warning",
            );
          }
        }
      } else if (trafficMod > 1.0 && rawVendingIncome > 0) {
        // 好天气加成
        const sunnyBonus = Math.round(rawVendingIncome * (trafficMod - 1.0));
        vendingIncome += sunnyBonus;
        if (sunnyBonus > 0 && Random.chance(0.3)) {
          StateManager.addMessage(
            "☀️ 天气好客流量大，多赚了¥" + sunnyBonus + "！",
            "success",
          );
        }
      }
    }

    // 将最终调整后的摆摊收入加入现金（天气调整统一在此处完成）
    if (vendingIncome > 0) {
      // NPC在场加成：好感度提升摆摊收入
      let npcVendingBonus = 0;
      if (typeof getNpcPresenceBonus === "function") {
        const npcBonus = getNpcPresenceBonus(state, "jobIncome");
        if (npcBonus.bonus > 0) {
          npcVendingBonus = Math.round(vendingIncome * npcBonus.bonus);
          vendingIncome += npcVendingBonus;
        }
      }
      state.resources.cash += vendingIncome;
      state.resources.totalEarned += vendingIncome;
      if (npcVendingBonus > 0) {
        StateManager.addMessage(
          `🤝 NPC关照，摆摊额外+¥${npcVendingBonus}。`,
          "success",
        );
      }
    }
  }

  // === 城管巡查 ===
  if (isVendingJob) {
    const confiscated = checkChengguan(state);
    if (confiscated) {
      // 城管没收后减少本次收入
      const lossPct = confiscated.fullConfiscation ? 0.8 : 0.3;
      const lostIncome = Math.round(basePay * lossPct);
      state.resources.cash = Math.max(0, state.resources.cash - lostIncome);
      state.resources.totalEarned = Math.max(
        0,
        state.resources.totalEarned - lostIncome,
      );
    }
  }

  state.employment.completedShifts[job.id] =
    (state.employment.completedShifts[job.id] || 0) + 1;

  // 应用效果
  if (job.effects) {
    if (job.effects.fatigue)
      state.needs.fatigue = Math.min(
        100,
        state.needs.fatigue + job.effects.fatigue,
      );
    if (job.effects.hygiene)
      state.needs.hygiene = Math.max(
        0,
        Math.min(100, state.needs.hygiene + job.effects.hygiene),
      );
    if (job.effects.happiness)
      state.needs.happiness = Math.max(
        0,
        Math.min(100, state.needs.happiness + job.effects.happiness),
      );
    if (job.effects.mental)
      state.player.mental = Math.max(
        0,
        Math.min(100, state.player.mental + job.effects.mental),
      );
    if (job.effects.fame)
      state.status.fame = Math.max(
        0,
        Math.min(100, state.status.fame + job.effects.fame),
      );

    // 技能经验
    addSkillXp("cooking", job.effects.cookingXp || 0);
    addSkillXp("repair", job.effects.repairXp || 0);
    addSkillXp("agility", job.effects.agilityXp || 0);
    addSkillXp("sales", job.effects.salesXp || 0);
    addSkillXp("physique", job.effects.physiqueXp || 0);
    addSkillXp("intelligence", job.effects.intelligenceXp || 0);
    addSkillXp("english", job.effects.englishXp || 0);

    // NPC在场技能经验加成（老周→维修、陈师傅→烹饪、小美→英语）
    if (typeof getNpcPresenceBonus === "function") {
      for (const skillKey of ["cooking", "repair", "english"]) {
        if (job.effects[skillKey + "Xp"]) {
          const npcSkill = getNpcPresenceBonus(state, "skillXp", skillKey);
          if (npcSkill.bonus > 0) {
            const bonusXp = Math.round(
              (job.effects[skillKey + "Xp"] || 0) * npcSkill.bonus,
            );
            if (bonusXp > 0) addSkillXp(skillKey, bonusXp);
          }
        }
      }
    }
  }

  // 属性经验转化
  if (job.effects) {
    if (job.effects.agilityXp)
      state.player.agility = Math.min(
        100,
        state.player.agility + job.effects.agilityXp * 0.1,
      );
    if (job.effects.physiqueXp)
      state.player.physique = Math.min(
        100,
        state.player.physique + job.effects.physiqueXp * 0.1,
      );
    if (job.effects.intelligenceXp)
      state.player.intelligence = Math.min(
        100,
        state.player.intelligence + job.effects.intelligenceXp * 0.1,
      );
  }

  // 受伤/生病风险（情绪影响风险倍率）
  if (job.risk) {
    const riskMod =
      typeof getEmotionWorkModifier === "function"
        ? getEmotionWorkModifier(state).injury || 1
        : 1;
    if (
      job.risk.injury &&
      Random.chance(Math.min(1, job.risk.injury * riskMod))
    ) {
      state.status.injured = true;
      state.status.health = Math.max(0, state.status.health - 15);
      StateManager.addMessage(
        "🤕 工作中受伤了！健康-15。建议去医院看看。",
        "danger",
      );
    }
    if (
      job.risk.illness &&
      Random.chance(Math.min(1, (job.risk.illness || 0) * riskMod))
    ) {
      // 使用疾病演化系统：根据工作类型触发不同疾病
      const diseaseId = getIllnessDiseaseId(job);
      addDisease(state, diseaseId);
    }
  }

  // 结果提示
  let msg = `💰 ${job.name}完成，基础收入 ¥${basePay}`;
  if (vendingIncome > 0) {
    msg += ` + 卖货收入 ¥${vendingIncome.toFixed(0)}`;
  }
  msg += `，合计 ¥${(basePay + vendingIncome).toFixed(0)} (-${jobAP}AP)`;
  StateManager.addMessage(msg, "success");

  // 摆摊卖货明细
  if (vendingDetails.length > 0) {
    StateManager.addMessage(
      `📦 摆摊卖货：${vendingDetails.join("、")}`,
      "info",
    );
  }
}

/** 获取摆摊类型偏好的商品列表 */
function getVendingPreferredGoods(jobId) {
  // 摆摊卖小商品：偏好日用品、小电子、服饰、零食
  if (jobId === "street_vending_goods") {
    return [
      "daily_use",
      "electronics",
      "clothing",
      "snacks",
      "cigarettes",
      "water",
    ];
  }
  // 摆摊卖小吃：偏好食材类（水果、蔬菜、啤酒等可以加工的）
  if (jobId === "street_vending_food") {
    return [
      "fruits",
      "vegetables",
      "beer",
      "water",
      "snacks",
      "instant_noodles",
    ];
  }
  // 餐饮摊贩：偏好食材（更高级的食材搭配）
  if (jobId === "food_stall") {
    return [
      "fruits",
      "vegetables",
      "beer",
      "water",
      "noodles",
      "instant_noodles",
    ];
  }
  return [];
}

function addSkillXp(skillKey, amount) {
  if (!amount || amount <= 0) return;
  const state = StateManager.getState();
  const skill = state.skills[skillKey];
  if (!skill) return;
  // 加速技能经验获取（2倍）
  const acceleratedAmount = amount * 2;
  skill.xp += acceleratedAmount;
  const xpNeeded = (skill.level + 1) * 100;
  if (skill.xp >= xpNeeded && skill.level < 100) {
    skill.level++;
    skill.xp -= xpNeeded;
    StateManager.addMessage(
      `⭐ ${getSkillName(skillKey)}升级到 Lv.${skill.level}！`,
      "success",
    );
  }
}

function getSkillName(key) {
  const names = {
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
  return names[key] || key;
}

// ====== 时间推进 ======
function advanceTimeSlot() {
  const state = StateManager.getState();
  const slots = ["morning", "afternoon", "evening"];
  const idx = slots.indexOf(state.player.timeSlot);

  if (idx < 2) {
    // 推进到下一个时段
    state.player.timeSlot = slots[idx + 1];
    // 时段转换时触发随机事件（20%概率）
    triggerMidDayEvent(state);
    // 道德随机事件（独立判定，每日最多一次，用showModal展示选择）
    if (typeof triggerMoralEvent === "function") {
      triggerMoralEvent(state);
    }
  } else {
    // 一天结束
    endDay();
    state.player.timeSlot = "morning";
  }
}

/** 时段转换时的随机事件 */
function triggerMidDayEvent(state) {
  const events = [
    {
      text: "🚶 路边遇到发传单的，顺手接了一张。",
      chance: 0.15,
      apply: (s) => {
        s.needs.happiness = Math.max(0, s.needs.happiness - 1);
      },
    },
    {
      text: "☕ 路边有人请你喝了杯热茶，心情好了点。",
      chance: 0.08,
      apply: (s) => {
        s.needs.happiness = Math.min(100, s.needs.happiness + 3);
        s.needs.fatigue = Math.max(0, s.needs.fatigue - 3);
      },
    },
    {
      text: "💨 一阵大风吹来，灰尘迷了眼。",
      chance: 0.12,
      apply: (s) => {
        s.needs.hygiene = Math.max(0, s.needs.hygiene - 3);
      },
    },
    {
      text: "📱 手机推送了一条本地新闻，你随手划过了。",
      chance: 0.1,
      apply: () => {},
    },
    {
      text: "🪙 在地上捡到了一枚硬币！",
      chance: 0.06,
      apply: (s) => {
        s.resources.cash += 1;
      },
    },
    {
      text: "🤧 打了个喷嚏，好像有点着凉。",
      chance: 0.08,
      apply: (s) => {
        if (Random.chance(0.2)) {
          s.status.health = Math.max(0, s.status.health - 3);
        }
      },
    },
    {
      text: "🎵 远处传来卖唱的歌声，你驻足听了一会儿。",
      chance: 0.1,
      apply: (s) => {
        s.needs.happiness = Math.min(100, s.needs.happiness + 2);
      },
    },
    {
      text: "🌧️ 天色突然变暗，似乎要下雨了。",
      chance: 0.07,
      apply: (s) => {
        s.needs.fatigue = Math.min(100, s.needs.fatigue + 2);
      },
    },
    {
      text: "🏪 路过一家新开的小店，门口排着长队。",
      chance: 0.05,
      apply: () => {},
    },
    {
      text: "🐕 一只流浪狗跟着你走了一小段路。",
      chance: 0.06,
      apply: (s) => {
        s.needs.happiness = Math.min(100, s.needs.happiness + 1);
      },
    },
  ];

  for (const evt of events) {
    if (Random.chance(evt.chance)) {
      evt.apply(state);
      StateManager.addMessage(evt.text, "event");
      break; // 每次最多触发一个事件
    }
  }

  // 天气相关随机事件
  if (state.weather && state.weather.weatherDef) {
    const w = state.weather.weatherDef;
    if (w.id === "heavy_rain" || w.id === "thunderstorm") {
      if (Random.chance(0.3)) {
        state.needs.hygiene = Math.max(0, state.needs.hygiene - 5);
        StateManager.addMessage("🌧️ 大雨淋湿了你的衣服，卫生下降了。", "event");
      }
    }
    if (w.id === "heatwave") {
      if (Random.chance(0.25)) {
        state.needs.fatigue = Math.min(100, state.needs.fatigue + 5);
        state.status.health = Math.max(0, state.status.health - 2);
        StateManager.addMessage("🌡️ 酷暑难耐，中暑了一点点。", "warning");
      }
    }
  }
}

function endDay() {
  const state = StateManager.getState();

  state.player.day++;

  // AP恢复（新一天开始恢复满）
  const maxAP = typeof calcMaxAP === "function" ? calcMaxAP(state) : 100;
  state.player.actionPoints = maxAP;
  state.player.maxActionPoints = maxAP;

  // 使用需求系统模块
  if (typeof applyNeedsDecay === "function") applyNeedsDecay(state);
  else {
    state.needs.hunger = Math.max(0, state.needs.hunger - 18);
    state.needs.hygiene = Math.max(0, state.needs.hygiene - 8);
  }
  // 睡眠恢复（基础25 + 住所加成）
  const HOUSING_TIERS = [
    {
      tier: 0,
      fatigueRecovery: 15,
      rent: 0,
      hygieneBonus: 0,
      happinessBonus: 0,
    },
    {
      tier: 1,
      fatigueRecovery: 25,
      rent: 12,
      hygieneBonus: 5,
      happinessBonus: 0,
    },
    {
      tier: 2,
      fatigueRecovery: 35,
      rent: 25,
      hygieneBonus: 10,
      happinessBonus: 5,
    },
    {
      tier: 3,
      fatigueRecovery: 50,
      rent: 50,
      hygieneBonus: 15,
      happinessBonus: 10,
    },
  ];
  const house = HOUSING_TIERS[state.housing?.tier || 0] || HOUSING_TIERS[0];
  state.needs.fatigue = Math.max(
    0,
    state.needs.fatigue - house.fatigueRecovery,
  );
  state.needs.hygiene = Math.min(
    100,
    state.needs.hygiene + (house.hygieneBonus || 0),
  );
  state.needs.happiness = Math.max(
    0,
    Math.min(100, state.needs.happiness - 3 + (house.happinessBonus || 0)),
  );

  // 扣房租
  if (house.rent > 0) {
    if (state.resources.cash >= house.rent) {
      state.resources.cash -= house.rent;
    } else {
      StateManager.addMessage(
        `⚠️ 付不起房租 ¥${house.rent}！被赶回流落街头。`,
        "danger",
      );
      state.housing.tier = 0;
      state.inventory.capacity = 20 + (state.housing?.storageCapacity || 0);
    }
  }
  // 扣仓库租金
  if (state.housing?.storageRented && state.housing?.storageCapacity > 0) {
    const storageRent = state.housing.storageCapacity >= 500 ? 50 : 20;
    if (state.resources.cash >= storageRent) {
      state.resources.cash -= storageRent;
    } else {
      StateManager.addMessage("⚠️ 付不起仓库租金，仓库被收回。", "danger");
      state.housing.storageRented = false;
      state.housing.storageCapacity = 0;
      const baseCap = [20, 50, 100, 200][state.housing.tier || 0];
      state.inventory.capacity = baseCap;
    }
  }

  // 伤病结算
  if (typeof tickHealthStatus === "function") tickHealthStatus(state);

  // 疾病演化系统：每日处理疾病进展和演化
  if (typeof tickDiseaseEvolution === "function") {
    tickDiseaseEvolution(state);
  } else {
    // 降级兼容：旧版二元生病状态
    if (!state.status.sick && !state.status.injured)
      state.status.health = Math.min(100, state.status.health + 1);
    if (state.status.sick) {
      state.status.health = Math.max(0, state.status.health - 3);
      if (Random.chance(0.1)) state.status.sick = false;
    }
    if (state.status.injured) {
      state.status.health = Math.max(0, state.status.health - 2);
      if (Random.chance(0.05)) state.status.injured = false;
    }
  }

  // 需求阈值检查
  if (typeof checkNeedsThresholds === "function") checkNeedsThresholds(state);

  // 情绪判定
  if (typeof determineEmotionalState === "function")
    determineEmotionalState(state);

  // 易腐商品变质检查
  if (typeof tickPerishableGoods === "function") tickPerishableGoods(state);

  // 天气系统：更新天气 + 应用天气效果
  if (typeof initWeatherState === "function") {
    initWeatherState(state);
    applyWeatherDailyEffects(state);
  }

  // 食材变质检查
  if (typeof tickIngredientSpoilage === "function")
    tickIngredientSpoilage(state);

  // 供需衰减 + 市场事件
  if (typeof decaySupplyDemand === "function") decaySupplyDemand(state);
  if (typeof checkMarketEvents === "function") checkMarketEvents(state);

  // 投资市场每日更新
  if (typeof tickInvestmentDaily === "function") tickInvestmentDaily(state);

  // 同步旧版股票数据到新投资系统
  if (typeof syncStockToInvestment === "function") syncStockToInvestment(state);

  // 贷款利息
  if (state.resources.debt > 0) {
    const interest = Math.floor(
      state.resources.debt * state.resources.dailyInterest,
    );
    if (interest > 0) {
      state.resources.debt += interest;
      StateManager.addMessage(
        `🏦 欠款利息：+¥${interest}（欠款 ¥${state.resources.debt.toLocaleString()}）`,
        "warning",
      );
    }
  }

  // 银行存款利息
  if (state.resources.bankBalance > 0) {
    const bankInterest = Math.floor(state.resources.bankBalance * 0.001);
    if (bankInterest > 0) state.resources.bankBalance += bankInterest;
  }

  // 每3天更新价格
  if (state.player.day - state.trade.lastPriceUpdate >= 3) {
    if (typeof updateAllPrices === "function") updateAllPrices(state);
  }

  // 新闻事件
  if (typeof rollDailyNews === "function") rollDailyNews(state);
  else if (Random.chance(0.1)) triggerRandomEvent(state);

  // 清理过期效果
  if (typeof dailyCleanup === "function") dailyCleanup(state);

  // 恋爱/婚姻每日结算
  if (typeof tickRomanceDaily === "function") tickRomanceDaily(state);

  // 子女成长
  if (state.romance && state.romance.children) {
    for (const child of state.romance.children) {
      child.age = Math.round((child.age + 0.0027) * 1000) / 1000; // 约0.0027/天 ≈ 1岁/年
    }
  }

  // 每年年龄增长
  if (state.player.day % 365 === 0) {
    state.player.age++;
    StateManager.addMessage(
      `🎂 又过了一年，你现在${state.player.age}岁了。`,
      "event",
    );
  }

  // 失败条件检查
  checkLoseConditions(state);

  // 成就检查
  if (typeof checkAchievements === "function") {
    const newlyUnlocked = checkAchievements(state);
    for (const achievement of newlyUnlocked) {
      StateManager.addMessage(
        `🏆 成就解锁：${achievement.name} — ${achievement.desc}`,
        "success",
      );
    }
  }

  // 道德后果链检查（需在渲染前触发，确保后果弹窗在日结之前弹出）
  if (typeof checkMoralConsequences === "function") {
    checkMoralConsequences(state);
  }

  // 自动存档
  autoSave();

  const emoIcon =
    typeof getEmotionIcon === "function" ? getEmotionIcon(state) : "";
  StateManager.addMessage(
    `🌙 第${state.player.day}天结束。${emoIcon} 新的一天开始了。`,
    "info",
  );
}

function triggerRandomEvent(state) {
  const events = [
    { text: "街头有人发传单，给了你一张优惠券", type: "info" },
    { text: "路边有人在摆摊，生意好像不错", type: "info" },
    { text: "天气突然变冷，街上的行人少了", type: "info" },
    { text: "邻居抱怨最近废品价格又跌了", type: "warning" },
  ];
  const evt = Random.fromArray(events);
  StateManager.addMessage(`📰 ${evt.text}`, evt.type);
}

function checkLoseConditions(state) {
  if (state.status.health <= 0) {
    state.flags.gameOver = true;
    state.flags.gameOverReason = "健康耗尽，你倒在了这座城市的街头...";
    showGameOverModal();
    return;
  }
  if (state.resources.debt > 80000) {
    // 提高：从50000到80000
    state.flags.gameOver = true;
    state.flags.gameOverReason = "债务超过8万元，讨债的人找上门来...";
    showGameOverModal();
    return;
  }
  // 职场失败条件
  if (
    state.player.phase === "corporate" &&
    typeof checkCorpLoseConditions === "function"
  ) {
    if (checkCorpLoseConditions(state)) return;
  }
}

// ====== 模态对话框 ======
function showModal({ title, body, buttons }) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const box = document.createElement("div");
  box.className = "modal-box";
  box.innerHTML = `
    <h2>${title}</h2>
    <div class="modal-body">${body}</div>
    <div class="modal-actions"></div>
  `;

  const actionsDiv = box.querySelector(".modal-actions");
  for (const btn of buttons) {
    const btnEl = document.createElement("button");
    btnEl.className = "btn " + (btn.cls || "btn-primary");
    btnEl.textContent = btn.text;
    btnEl.addEventListener("click", () => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      if (btn.callback) btn.callback();
    });
    actionsDiv.appendChild(btnEl);
  }

  overlay.appendChild(box);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) document.body.removeChild(overlay);
  });
  document.body.appendChild(overlay);
}

function showGameOverModal() {
  const state = StateManager.getState();
  showModal({
    title: "💀 游戏结束",
    body: `
      <p>${state.flags.gameOverReason}</p>
      <table class="stats-summary">
        <tr><td>存活天数</td><td>${state.player.day} 天</td></tr>
        <tr><td>年龄</td><td>${state.player.age} 岁</td></tr>
        <tr><td>现金</td><td>¥${state.resources.cash.toLocaleString()}</td></tr>
        <tr><td>总收入</td><td>¥${state.resources.totalEarned.toLocaleString()}</td></tr>
        <tr><td>债务</td><td>¥${state.resources.debt.toLocaleString()}</td></tr>
      </table>
    `,
    buttons: [
      { text: "重新开始", cls: "btn-primary", callback: () => startNewGame() },
      {
        text: "返回标题",
        cls: "",
        callback: () => {
          location.reload();
        },
      },
    ],
  });
}

function showDepositModal() {
  const state = StateManager.getState();
  showModal({
    title: "🏦 存款",
    body: `<p>当前现金: ¥${state.resources.cash.toLocaleString()}</p>
           <p>银行余额: ¥${state.resources.bankBalance.toLocaleString()}</p>
           <label>存入金额: <input id="deposit-amount" type="number" min="1" max="${state.resources.cash}" value="${state.resources.cash}" style="width:100%;padding:8px;margin-top:8px;background:var(--bg-input);border:1px solid var(--border);color:var(--text-primary);border-radius:4px;"></label>`,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      {
        text: "存入全部",
        cls: "btn-success",
        callback: () => {
          const amt = state.resources.cash;
          state.resources.bankBalance += amt;
          state.resources.cash = 0;
          StateManager.addMessage(
            `🏦 存入 ¥${amt.toLocaleString()} 到银行。`,
            "success",
          );
          renderAll();
        },
      },
    ],
  });
  // 延迟绑定输入框事件
  setTimeout(() => {
    const input = document.getElementById("deposit-amount");
    if (input) {
      input.addEventListener("input", () => {
        const val = parseInt(input.value) || 0;
        // update last button
        const btns = document.querySelectorAll(".modal-actions .btn");
        const lastBtn = btns[btns.length - 1];
        if (lastBtn && !lastBtn.classList.contains("btn-success")) {
          lastBtn.textContent = `存入 ¥${val.toLocaleString()}`;
          lastBtn.onclick = () => {
            const amt = Math.min(val, state.resources.cash);
            state.resources.bankBalance += amt;
            state.resources.cash -= amt;
            StateManager.addMessage(
              `🏦 存入 ¥${amt.toLocaleString()} 到银行。`,
              "success",
            );
            document.querySelector(".modal-overlay")?.remove();
            renderAll();
          };
        }
      });
    }
  }, 50);
}

function showWithdrawModal() {
  const state = StateManager.getState();
  showModal({
    title: "💰 取款",
    body: `<p>银行余额: ¥${state.resources.bankBalance.toLocaleString()}</p>
           <label>取出金额: <input id="withdraw-amount" type="number" min="1" max="${state.resources.bankBalance}" value="${state.resources.bankBalance}" style="width:100%;padding:8px;margin-top:8px;background:var(--bg-input);border:1px solid var(--border);color:var(--text-primary);border-radius:4px;"></label>`,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      {
        text: `取出全部 ¥${state.resources.bankBalance.toLocaleString()}`,
        cls: "btn-primary",
        callback: () => {
          const amt = state.resources.bankBalance;
          state.resources.cash += amt;
          state.resources.bankBalance = 0;
          StateManager.addMessage(
            `💰 从银行取出 ¥${amt.toLocaleString()}。`,
            "success",
          );
          renderAll();
        },
      },
    ],
  });
}

function showLoanModal() {
  const state = StateManager.getState();
  const maxLoan = 10000;
  showModal({
    title: "📝 贷款",
    body: `<p>可贷金额: ¥${maxLoan.toLocaleString()}</p>
           <p style="color:var(--danger)">⚠️ 日息 0.3%（复利），请谨慎！</p>
           <p>当前欠款: ¥${state.resources.debt.toLocaleString()}</p>`,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      {
        text: "贷款 ¥3,000",
        cls: "btn-warning",
        callback: () => {
          state.resources.cash += 3000;
          state.resources.debt += 3000;
          StateManager.addMessage(
            "📝 贷款 ¥3,000，日息0.3%。记得按时还款！",
            "warning",
          );
          renderAll();
        },
      },
      {
        text: "贷款 ¥5,000",
        cls: "btn-warning",
        callback: () => {
          state.resources.cash += 5000;
          state.resources.debt += 5000;
          StateManager.addMessage("📝 贷款 ¥5,000。", "warning");
          renderAll();
        },
      },
    ],
  });
}

function showRepayModal() {
  const state = StateManager.getState();
  showModal({
    title: "💸 还债",
    body: `<p>当前欠款: ¥${state.resources.debt.toLocaleString()}</p>
           <p>现金: ¥${state.resources.cash.toLocaleString()}</p>`,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      {
        text: "能还多少还多少",
        cls: "btn-primary",
        callback: () => {
          const amt = Math.min(state.resources.cash, state.resources.debt);
          state.resources.cash -= amt;
          state.resources.debt -= amt;
          StateManager.addMessage(
            `💸 还款 ¥${amt.toLocaleString()}。${state.resources.debt > 0 ? `还剩 ¥${state.resources.debt.toLocaleString()}。` : "债务已还清！"}`,
            "success",
          );
          renderAll();
        },
      },
    ],
  });
}

// ====== 存档 / 读档菜单 ======
function showSaveMenu() {
  const allSlots = getAllSlotsWithEmpty();
  let bodyHtml =
    '<p style="margin-bottom:8px;color:var(--text-secondary);">选择一个槽位保存当前进度：</p>';
  bodyHtml += '<div style="max-height:400px;overflow-y:auto;">';
  for (const s of allSlots) {
    if (s.slot === "_auto") continue; // 自动存档单独处理
    if (s.empty) {
      bodyHtml += `
        <div class="save-slot-card" data-slot="${s.slot}" style="padding:12px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;cursor:pointer;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="color:var(--accent);">${s.label}</strong>
            <span style="font-size:11px;color:var(--text-muted);">空槽位</span>
          </div>
        </div>`;
    } else {
      const phaseLabel = s.phase === "corporate" ? "🏢" : "🏘️";
      bodyHtml += `
        <div class="save-slot-card" data-slot="${s.slot}" style="padding:12px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;cursor:pointer;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="color:var(--warning);">${s.label}</strong>
            <span style="font-size:11px;color:var(--text-muted);">${s.date}</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">
            ${phaseLabel} 第${s.day}天 | 年龄${s.age} | 💰 ¥${s.cash?.toLocaleString()}
            ${s.rank ? ` | 🏢 ${s.rank}` : ""}
          </div>
          <div style="font-size:10px;color:var(--danger);margin-top:2px;">⚠️ 覆盖后旧存档将丢失</div>
        </div>`;
    }
  }
  bodyHtml += "</div>";

  showModal({
    title: "💾 保存游戏",
    body: bodyHtml,
    buttons: [{ text: "取消", cls: "", callback: () => {} }],
  });

  // 绑定槽位点击
  setTimeout(() => {
    document.querySelectorAll(".save-slot-card").forEach((card) => {
      card.addEventListener("click", () => {
        const slot = parseInt(card.dataset.slot);
        const existing = getSlotInfo(slot);
        if (existing) {
          // 确认覆盖
          const slotEl = card;
          const oldHtml = slotEl.innerHTML;
          slotEl.innerHTML =
            '<p style="color:var(--warning);text-align:center;padding:10px;">⚠️ 点击确认覆盖此存档</p>';
          slotEl.style.borderColor = "var(--warning)";
          slotEl.onclick = () => {
            document.querySelector(".modal-overlay")?.remove();
            saveGame(slot);
            renderAll();
          };
          setTimeout(() => {
            if (document.querySelector(".modal-overlay")) {
              slotEl.innerHTML = oldHtml;
              slotEl.style.borderColor = "var(--border)";
            }
          }, 3000);
        } else {
          document.querySelector(".modal-overlay")?.remove();
          saveGame(slot);
          renderAll();
        }
      });
    });
  }, 50);
}

function showLoadMenu() {
  const allSlots = getAllSlotsWithEmpty();
  let bodyHtml =
    '<p style="margin-bottom:8px;color:var(--text-secondary);">选择一个存档读取（当前进度将丢失）：</p>';
  bodyHtml += '<div style="max-height:400px;overflow-y:auto;">';
  let hasAnySave = false;
  for (const s of allSlots) {
    if (s.empty) {
      bodyHtml += `<div style="padding:8px;margin:4px 0;background:var(--bg-card);border-radius:4px;opacity:0.4;font-size:12px;color:var(--text-muted);">${s.label} — 空</div>`;
    } else {
      hasAnySave = true;
      const phaseLabel = s.phase === "corporate" ? "🏢" : "🏘️";
      bodyHtml += `
        <div class="load-slot-card" data-slot="${s.slot}" style="padding:12px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;cursor:pointer;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>${s.label}</strong>
            <span style="font-size:11px;color:var(--text-muted);">${s.date}</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">
            ${phaseLabel} 第${s.day}天 | 年龄${s.age} | 💰 ¥${s.cash?.toLocaleString() || 0}
            ${s.rank ? ` | 🏢 ${s.rank}` : ""}
            ${s.debt > 0 ? ` | ⚠️ 欠款 ¥${s.debt.toLocaleString()}` : ""}
            ${s.totalEarned > 0 ? ` | 总赚 ¥${s.totalEarned.toLocaleString()}` : ""}
          </div>
        </div>`;
    }
  }
  bodyHtml += "</div>";
  if (!hasAnySave) {
    bodyHtml +=
      '<p style="text-align:center;color:var(--text-muted);padding:20px;">还没有任何存档</p>';
  }

  showModal({
    title: "📂 读取存档",
    body: bodyHtml,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      ...(hasAnySave
        ? [
            {
              text: "🗑️ 删除存档",
              cls: "btn-danger",
              callback: () => {
                document.querySelector(".modal-overlay")?.remove();
                showDeleteMenu();
              },
            },
          ]
        : []),
    ],
  });

  // 绑定槽位点击
  setTimeout(() => {
    document.querySelectorAll(".load-slot-card").forEach((card) => {
      card.addEventListener("click", () => {
        if (!gameStarted || confirm("当前进度未保存，确定要读取存档吗？")) {
          document.querySelector(".modal-overlay")?.remove();
          const slot = card.dataset.slot;
          loadExistingGame(slot);
        }
      });
    });
  }, 50);
}

function showDeleteMenu() {
  const allSlots = getAllSlots();
  if (allSlots.length === 0) {
    StateManager.addMessage("📭 没有可删除的存档。", "info");
    return;
  }

  let bodyHtml =
    '<p style="margin-bottom:8px;color:var(--danger);">选择要删除的存档（不可恢复）：</p>';
  bodyHtml += '<div style="max-height:300px;overflow-y:auto;">';
  for (const s of allSlots) {
    const phaseLabel = s.phase === "corporate" ? "🏢" : "🏘️";
    bodyHtml += `
      <div class="del-slot-card" data-slot="${s.slot}" style="padding:10px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <strong>${s.label}</strong>
          <span style="font-size:11px;color:var(--text-muted);margin-left:8px;">${s.date}</span>
        </div>
        <span style="font-size:11px;color:var(--text-muted);">${phaseLabel} Day${s.day} ¥${s.cash?.toLocaleString()}</span>
      </div>`;
  }
  bodyHtml += "</div>";

  showModal({
    title: "🗑️ 删除存档",
    body: bodyHtml,
    buttons: [{ text: "取消", cls: "", callback: () => {} }],
  });

  setTimeout(() => {
    document.querySelectorAll(".del-slot-card").forEach((card) => {
      card.addEventListener("click", () => {
        if (confirm("确定永久删除此存档吗？")) {
          deleteSave(card.dataset.slot);
          document.querySelector(".modal-overlay")?.remove();
          StateManager.addMessage("🗑️ 存档已删除。", "info");
        }
      });
    });
  }, 50);
}

function showInterviewModal() {
  let body =
    '<p style="color:var(--success);">🎉 你的能力获得了多家公司的面试机会！</p>';
  body += "<p>选择一家公司加入：</p>";
  body += '<div style="max-height:300px;overflow-y:auto;">';
  for (const company of COMPANIES) {
    body += `
      <div class="company-card" data-company="${company.id}" style="padding:12px;margin:6px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;cursor:pointer;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="color:var(--accent);">${company.name}</strong>
          <span style="font-size:11px;color:var(--text-muted);">${company.industry}</span>
        </div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">${company.culture}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">
          薪资倍率:${company.salaryMod}x | 风险:${company.riskMod}x | 成长:${company.growthRate}x
        </div>
      </div>`;
  }
  body += "</div>";

  showModal({
    title: "💼 选择公司",
    body,
    buttons: [{ text: "再考虑考虑", cls: "", callback: () => {} }],
  });

  setTimeout(() => {
    document.querySelectorAll(".company-card").forEach((card) => {
      card.onclick = () => {
        document.querySelector(".modal-overlay")?.remove();
        if (typeof enterCorporatePhase === "function")
          enterCorporatePhase(card.dataset.company);
      };
      card.onmouseover = () => {
        card.style.borderColor = "var(--accent)";
      };
      card.onmouseout = () => {
        card.style.borderColor = "var(--border)";
      };
    });
  }, 50);
}

// ====== 消息日志渲染 ======
function renderMessageLog(state) {
  const log = document.getElementById("message-log");
  if (!log) return;

  const content = log.querySelector(".log-content");
  if (!content) return;

  const messages = state.messageLog.slice(-50); // 最近50条
  content.innerHTML = messages
    .map(
      (m) => `
    <div class="log-entry ${m.type}">
      <span class="log-day">[第${m.day}天]</span>${m.text}
    </div>
  `,
    )
    .join("");

  // 滚动到底部
  content.scrollTop = content.scrollHeight;
}

// ====== 初始化 ======
function init() {
  // 检查是否有存档
  if (hasSave()) {
    // 显示欢迎界面
  }

  // 注册状态变更回调
  StateManager.onChange(() => {
    if (gameStarted) {
      // 函数节流：每 100ms 最多渲染一次
      if (!init._renderTimeout) {
        init._renderTimeout = setTimeout(() => {
          renderAll();
          init._renderTimeout = null;
        }, 100);
      }
    }
  });

  // 显示欢迎界面
  showWelcome();

  // 全局点击事件委托（Tab 切换）
  document.getElementById("tab-bar").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (btn && btn.dataset.tab) {
      switchTab(btn.dataset.tab);
    }
  });

  // 存档按钮
  document.getElementById("btn-save").addEventListener("click", () => {
    if (gameStarted) showSaveMenu();
  });

  // 读档按钮
  document.getElementById("btn-load").addEventListener("click", () => {
    showLoadMenu();
  });

  // 新游戏按钮（Header）
  document
    .getElementById("btn-new-game-header")
    .addEventListener("click", () => {
      if (gameStarted) {
        showModal({
          title: "开始新游戏？",
          body: "<p>当前进度将会丢失。建议先存档。</p>",
          buttons: [
            { text: "取消", cls: "", callback: () => {} },
            {
              text: "确认新游戏",
              cls: "btn-danger",
              callback: () => startNewGame(),
            },
          ],
        });
      }
    });

  // 移动端菜单按钮
  document.getElementById("mobile-menu-btn").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });

  console.log("🏙️ 城市浮生记 initialized.");
}

// ====== 城管系统 ======
/** 地点城管巡查风险（0=无城管，1=最严格） */
const CHENGGUAN_RISK = {
  commercialDist: 0.2, // 商业区：降低
  techPark: 0.15, // 科技园：降低
  school: 0.12, // 大学城：降低
  park: 0.08, // 公园：降低
  hospital: 0.1, // 医院：降低
  bank: 0.08, // 银行：降低
  wholesaleMarket: 0.06, // 批发市场：降低
  slum: 0.03, // 城中村：降低
  factoryZone: 0.02, // 工业区：降低
  construction: 0.0, // 建筑工地：无城管
  trainingCenter: 0.02, // 培训中心：降低
};

/** 城管巡查：返回没收结果或null */
function checkChengguan(state) {
  const locKey = state.trade.currentLocation;
  const baseRisk = CHENGGUAN_RISK[locKey] || 0;

  if (baseRisk <= 0) return null; // 该地点无城管

  // 城管关系降低风险（每10点好感降低5%风险）
  const cg = state.relationships.chengguan;
  const affinityBonus = (cg.affinity || 0) * 0.005;
  const effectiveRisk = Math.max(0, baseRisk - affinityBonus);

  // 名气提高风险（名气越高越容易被注意）
  const fameRisk = (state.status.fame || 0) * 0.001;

  const finalRisk = Math.min(0.6, effectiveRisk + fameRisk);

  if (!Random.chance(finalRisk)) return null; // 没遇到城管

  // 遇到城管了！
  cg.met = true;

  // 判断是部分没收还是全部没收
  const confiscationResult = Random.multichance([0.25, 0.35]);
  let result = null;

  if (confiscationResult === 0) {
    // 全部没收！
    const confiscatedItems = [...state.inventory.items];
    if (confiscatedItems.length > 0) {
      const totalValue = confiscatedItems.reduce((sum, i) => {
        const good =
          typeof getGoodById === "function" ? getGoodById(i.id) : null;
        return sum + (good ? good.basePrice * i.qty : 0);
      }, 0);
      state.inventory.items = [];
      cg.affinity = Math.max(-100, (cg.affinity || 0) - 10);
      state.needs.happiness = Math.max(0, state.needs.happiness - 15);
      StateManager.addMessage(
        `🚔 城管来了！所有商品被没收！损失约¥${totalValue}。心情暴跌。`,
        "danger",
      );
      result = {
        fullConfiscation: true,
        items: confiscatedItems,
        value: totalValue,
      };
    }
  } else if (confiscationResult === 1) {
    // 部分没收
    if (state.inventory.items.length > 0) {
      const confiscateCount = Math.max(
        1,
        Math.ceil(state.inventory.items.length * Random.float(0.3, 0.6)),
      );
      let confiscatedValue = 0;
      for (
        let i = 0;
        i < confiscateCount && state.inventory.items.length > 0;
        i++
      ) {
        const idx = Random.int(0, state.inventory.items.length - 1);
        const item = state.inventory.items[idx];
        const good =
          typeof getGoodById === "function" ? getGoodById(item.id) : null;
        confiscatedValue += good ? good.basePrice * item.qty : 0;
        state.inventory.items.splice(idx, 1);
      }
      cg.affinity = Math.max(-100, (cg.affinity || 0) - 5);
      state.needs.happiness = Math.max(0, state.needs.happiness - 8);
      StateManager.addMessage(
        `🚔 城管巡查！部分商品被没收，损失约¥${confiscatedValue}。`,
        "warning",
      );
      result = { fullConfiscation: false, value: confiscatedValue };
    }
  } else {
    // 只是警告/驱赶
    cg.affinity = Math.max(-100, (cg.affinity || 0) - 2);
    state.needs.happiness = Math.max(0, state.needs.happiness - 3);
    StateManager.addMessage(
      "🚔 城管来了！赶紧收摊跑了，幸好没被没收。",
      "warning",
    );
    result = { fullConfiscation: false, value: 0 };
  }

  return result;
}

/** 行贿城管（降低风险） */
function bribeChengguan(state, amount) {
  if (state.resources.cash < amount) {
    StateManager.addMessage("⚠️ 现金不足，无法行贿。", "warning");
    return;
  }
  state.resources.cash -= amount;
  const gain = Math.min(30, Math.floor(amount / 10));
  state.relationships.chengguan.affinity = Math.min(
    100,
    (state.relationships.chengguan.affinity || 0) + gain,
  );
  state.relationships.chengguan.bribed =
    (state.relationships.chengguan.bribed || 0) + 1;
  StateManager.addMessage(
    `🤝 给城管塞了¥${amount}，关系提升${gain}点。`,
    "info",
  );
}

// ====== 买卖状态/属性影响 ======
/** 每次交易后随机影响状态和基础属性 */
function applyTradeEffects(state, isBuy) {
  // 疲劳：搬运商品消耗体力
  const fatigueGain = Random.int(1, 3);
  state.needs.fatigue = Math.min(100, state.needs.fatigue + fatigueGain);

  // 心情波动
  const moodResult = Random.multichance([0.15, 0.7, 0.15]);
  if (moodResult === 0) {
    // 好交易心情好
    state.needs.happiness = Math.min(100, state.needs.happiness + 2);
  } else if (moodResult === 2) {
    // 差交易心情差
    state.needs.happiness = Math.max(0, state.needs.happiness - 2);
  }

  // 卫生：进货搬运弄脏
  if (isBuy && Random.chance(0.2)) {
    state.needs.hygiene = Math.max(0, state.needs.hygiene - 2);
  }

  // 基础属性微量提升（熟能生巧）
  if (Random.chance(0.3)) {
    const attrGain = Random.float(0.05, 0.15);
    const attr = Random.chance(0.5) ? "agility" : "intelligence";
    state.player[attr] = Math.min(100, state.player[attr] + attrGain);
  }

  // 销售经验
  if (Random.chance(0.4)) {
    addSkillXp("sales", 0.5);
  }
}

// ====== 恋爱/婚姻系统 ======
const ROMANCE_PERSONALITIES = [
  "温柔",
  "活泼",
  "内向",
  "理性",
  "浪漫",
  "务实",
  "文艺",
  "豪爽",
];
const ROMANCE_JOBS = [
  "服务员",
  "快递员",
  "文员",
  "小贩",
  "护士",
  "老师",
  "程序员",
  "设计师",
];

/** 随机生成一个恋爱对象 */
function generateRomancePartner(state) {
  const gender = state.player.gender === "male" ? "female" : "male";
  const maleNames = [
    "小明",
    "大壮",
    "阿强",
    "老李",
    "小伟",
    "建国",
    "志强",
    "海涛",
  ];
  const femaleNames = [
    "小芳",
    "阿兰",
    "秀英",
    "小红",
    "美玲",
    "丽华",
    "晓薇",
    "雨晴",
  ];
  const names = gender === "male" ? maleNames : femaleNames;
  return {
    name: Random.fromArray(names),
    gender,
    personality: Random.fromArray(ROMANCE_PERSONALITIES),
    affinity: Random.int(30, 59), // 初始好感30-60
    age: Random.int(18, 32),
    job: Random.fromArray(ROMANCE_JOBS),
  };
}

/** 尝试邂逅（在特定地点有概率遇到） */
function tryRomanceEncounter(state) {
  if (state.romance.relationship !== "single") return null;
  // 每次行动5%概率邂逅
  if (!Random.chance(0.95)) return null;

  const partner = generateRomancePartner(state);
  state.romance.partner = partner;
  state.romance.lastEncounter = {
    day: state.player.day,
    location: state.trade.currentLocation,
  };
  StateManager.addMessage(
    `💫 你遇到了${partner.name}，一个${partner.personality}的${partner.job}。好感度${partner.affinity}。`,
    "event",
  );
  return partner;
}

/** 约会（提升好感） */
function goOnDate(state) {
  if (!state.romance.partner) {
    StateManager.addMessage("⚠️ 你还没有遇到心仪的人。", "warning");
    return;
  }
  if (
    state.romance.relationship !== "single" &&
    state.romance.relationship !== "dating"
  ) {
    StateManager.addMessage("⚠️ 当前状态不适合约会。", "warning");
    return;
  }

  const cost = Random.int(30, 79);
  if (state.resources.cash < cost) {
    StateManager.addMessage(`⚠️ 约会至少需要¥${cost}。`, "warning");
    return;
  }

  if (!consumeAP(10)) return;

  state.resources.cash -= cost;
  const affinityGain = Random.int(5, 14);
  state.romance.partner.affinity = Math.min(
    100,
    state.romance.partner.affinity + affinityGain,
  );
  state.needs.happiness = Math.min(100, state.needs.happiness + 8);
  state.needs.fatigue = Math.min(100, state.needs.fatigue + 5);

  if (
    state.romance.relationship === "single" &&
    state.romance.partner.affinity >= 60
  ) {
    state.romance.relationship = "dating";
    state.romance.datingDays = 0;
    StateManager.addMessage(
      `💕 你们正式在一起了！和${state.romance.partner.name}的恋爱关系开始。`,
      "event",
    );
  } else {
    StateManager.addMessage(
      `🌹 和${state.romance.partner.name}约会花了¥${cost}，好感+${affinityGain}（当前${state.romance.partner.affinity}）。`,
      "success",
    );
  }
}

/** 求婚 */
function propose(state) {
  if (state.romance.relationship !== "dating" || !state.romance.partner) {
    StateManager.addMessage("⚠️ 你还没有恋人。", "warning");
    return;
  }
  if (state.romance.partner.affinity < 80) {
    StateManager.addMessage(
      `💔 ${state.romance.partner.name}觉得你们还不够了解（好感度需≥80）。`,
      "warning",
    );
    return;
  }
  if (state.resources.cash < 500) {
    StateManager.addMessage("⚠️ 结婚至少需要¥500。", "warning");
    return;
  }

  const weddingCost = Random.int(500, 999);
  state.resources.cash -= weddingCost;
  state.romance.relationship = "married";
  state.romance.marriageDays = 0;
  state.needs.happiness = Math.min(100, state.needs.happiness + 20);

  // 共同财产系统启动
  state.romance.sharedCash = Math.floor(weddingCost * 0.3); // 30%彩礼进入共同财产

  StateManager.addMessage(
    `💒 你们结婚了！婚礼花费¥${weddingCost}。共同财产¥${state.romance.sharedCash}。`,
    "event",
  );
}

/** 每日恋爱/婚姻结算 */
function tickRomanceDaily(state) {
  if (!state.romance.partner) return;

  // 恋爱天数递增
  if (state.romance.relationship === "dating") {
    state.romance.datingDays++;
    // 长期不约会好感下降
    if (state.romance.datingDays > 3 && Random.chance(0.3)) {
      state.romance.partner.affinity = Math.max(
        0,
        state.romance.partner.affinity - 2,
      );
    }
  }

  // 婚姻天数递增
  if (state.romance.relationship === "married") {
    state.romance.marriageDays++;
    // 配偶有收入（随机50-200）
    const spouseIncome = Random.int(50, 199);
    state.romance.sharedCash += spouseIncome;
    // 共同财产有10%概率转入现金
    if (Random.chance(0.1) && state.romance.sharedCash > 0) {
      const transfer = Math.min(state.romance.sharedCash, 100);
      state.romance.sharedCash -= transfer;
      state.resources.cash += transfer;
    }
    // 好感自然波动
    if (Random.chance(0.15)) {
      const change = Random.chance(0.6) ? -1 : 1;
      state.romance.partner.affinity = Math.max(
        0,
        Math.min(100, state.romance.partner.affinity + change),
      );
    }
    // 好感太低可能离婚
    if (state.romance.partner.affinity < 20 && Random.chance(0.05)) {
      state.romance.relationship = "divorced";
      state.needs.happiness = Math.max(0, state.needs.happiness - 30);
      StateManager.addMessage(
        `💔 ${state.romance.partner.name}提出了离婚！共同财产被分割。`,
        "danger",
      );
      // 分割共同财产
      const halfShared = Math.floor(state.romance.sharedCash / 2);
      state.resources.cash += halfShared;
      state.romance.sharedCash = 0;
    }
    // 结婚满365天可能生子
    if (
      state.romance.marriageDays >= 365 &&
      state.romance.children.length === 0 &&
      Random.chance(0.1)
    ) {
      const childGender = Random.chance(0.5) ? "男" : "女";
      const childName =
        childGender === "男"
          ? Random.fromArray(["小明", "小强", "小伟"])
          : Random.fromArray(["小红", "小美", "小丽"]);
      state.romance.children.push({
        name: childName,
        age: 0,
        gender: childGender,
      });
      StateManager.addMessage(`👶 你们有了孩子！${childName}出生了。`, "event");
    }
  }
}

// ====== 启动 ======
document.addEventListener("DOMContentLoaded", init);
