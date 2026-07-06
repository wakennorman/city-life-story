/**
 * 主渲染调度器
 *
 * 管理整个 UI 的渲染。使用脏标记 (dirty flag) 按需更新 DOM。
 * 渲染函数命名: render<Section>()
 */

// 当前激活的 Tab
let currentTab = "actions";

// 公司历史书面板展开/折叠状态（由 corp_ui.js 定义，此处声明供引用）
let showHistoryPanel;

// ====== 主渲染入口 ======
function renderAll() {
  const state = StateManager.getState();

  renderHeader(state);
  renderSidebar(state);
  renderTabBar(state);
  renderCurrentTab(state);
  renderMessageLog(state);

  StateManager.cleanAllDirty();
}

// ====== Header 渲染 ======
function renderHeader(state) {
  const p = state.player;
  const r = state.resources;
  const phaseLabel = p.phase === "corporate" ? "🏢 职场" : "🏘️ 街头";

  document.getElementById("header-day").textContent = p.day;
  document.getElementById("header-age").textContent = p.age;
  document.getElementById("header-phase").textContent = phaseLabel;
  document.getElementById("header-cash").textContent =
    "¥" + r.cash.toLocaleString();

  // AP显示
  const apEl = document.getElementById("header-ap");
  if (apEl) {
    const maxAP = p.maxActionPoints || 100;
    const ap = p.actionPoints || 0;
    apEl.textContent = ap;
    // AP低于30%时变红
    if (ap < maxAP * 0.3) {
      apEl.style.color = "var(--danger)";
    } else if (ap < maxAP * 0.6) {
      apEl.style.color = "var(--warning)";
    } else {
      apEl.style.color = "var(--accent)";
    }
  }
}

// ====== Sidebar 渲染 ======
function renderSidebar(state) {
  const p = state.player;

  if (p.phase === "street") {
    renderStreetStats(state);
  } else {
    renderCorporateStats(state);
  }

  renderNeedsBars(state);
  renderDiseases(state);
  renderIngredients(state);
  renderLocation(state);
  renderMoralStatus(state);
  renderRelationships(state);
}

function renderStreetStats(state) {
  const p = state.player;
  setStatBar("stat-physique", p.physique, "physique");
  setStatBar("stat-intelligence", p.intelligence, "intelligence");
  setStatBar("stat-agility", p.agility, "agility");
  setStatBar("stat-mental", p.mental, "mental-bar");
}

function renderCorporateStats(state) {
  const c = state.player.corporate;
  // 切换侧边栏区域显示
  document.getElementById("street-stats-section").style.display = "none";
  document.getElementById("corp-stats-section").style.display = "block";

  setStatBar("stat-hair", c.hair, "hair");
  setStatBar("stat-dignity", c.dignity, "dignity");
  setStatBar("stat-kpi", c.kpi, "kpi");
  setStatBar("stat-ability", c.ability, "intelligence");
  setStatBar("stat-upward", c.upwardMgmt, "physique");
  setStatBar("stat-popularity", c.popularity, "happiness");
  setStatBar("stat-risk", c.risk, "risk");
}

function renderNeedsBars(state) {
  const n = state.needs;
  const s = state.status;
  setStatBar("stat-hunger", n.hunger, "hunger");
  setStatBar("stat-fatigue", n.fatigue, "fatigue");
  setStatBar("stat-hygiene", n.hygiene, "hygiene");
  setStatBar("stat-happiness", n.happiness, "happiness");
  setStatBar("stat-health", s.health, "health");
  setStatBar("stat-fame", s.fame, "fame");
  setStatBar("stat-comfort", s.comfort || 50, "happiness");
}

function renderLocation(state) {
  const locKey = state.trade.currentLocation;
  const loc = getLocation(locKey);
  if (loc) {
    document.getElementById("location-name").textContent = loc.name;
    document.getElementById("location-desc").textContent = loc.desc;
  }

  // 住所信息 + 负重显示
  const HOUSING_NAMES = ["🌃 露宿街头", "🛏️ 合租床位", "🚪 单间", "🏠 一居室"];
  const houseName = HOUSING_NAMES[state.housing?.tier || 0] || HOUSING_NAMES[0];
  const houseEl = document.getElementById("housing-info");
  if (houseEl) {
    // 负重信息（新版）
    let carryInfo = "";
    if (typeof calcEncumbrance === "function") {
      const enc = calcEncumbrance(state);
      const tierColor =
        enc.tier.apPenalty > 2
          ? "var(--danger)"
          : enc.tier.apPenalty > 0
            ? "var(--warning)"
            : "var(--text-secondary)";
      carryInfo = `
        <div style="font-size:11px;color:${tierColor};">
          ⚖️ ${enc.totalWeight}/${enc.maxCarry}千克
          <span style="color:var(--text-muted);margin-left:4px;">📐 ${enc.totalVolume}/${enc.maxVolume}升</span>
        </div>
        ${enc.tier.apPenalty > 0 ? `<div style="font-size:10px;color:var(--warning);">负重${enc.tier.name}：行动+${enc.tier.apPenalty}AP</div>` : ""}
      `;
    } else {
      const itemCount = (state.inventory.items || []).reduce(
        (s, i) => s + i.qty,
        0,
      );
      carryInfo = `<div style="font-size:11px;color:var(--text-muted);">🎒 物品 ${itemCount}/${state.inventory.capacity}</div>`;
    }

    houseEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span style="font-size:12px;">${houseName}</span>
      </div>
      ${carryInfo}
      ${state.housing?.storageRented ? " 📦 已租仓库" : ""}
    `;
  }
}

// ====== Tab Bar ======
function renderTabBar(state) {
  const tabs = document.querySelectorAll("#tab-bar .tab-btn");
  tabs.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === currentTab);

    // 某些 Tab 在特定阶段隐藏
    if (btn.dataset.tab === "corp" && state.player.phase !== "corporate") {
      btn.style.display = "none";
    } else if (btn.dataset.tab === "trade" && state.player.phase !== "street") {
      btn.style.display = "none";
    } else {
      btn.style.display = "";
    }
  });
}

function switchTab(tabName) {
  currentTab = tabName;
  renderAll();
}

// ====== Tab Content 渲染 ======
function renderCurrentTab(state) {
  const area = document.getElementById("content-area");
  area.innerHTML = "";

  // 时间槽指示器
  renderTimeSlot(state, area);

  // 活跃新闻
  renderActiveNews(state, area);

  switch (currentTab) {
    case "actions":
      renderActionsTab(state, area);
      break;
    case "trade":
      renderTradeTab(state, area);
      break;
    case "inventory":
      renderInventoryTab(state, area);
      break;
    case "skills":
      renderSkillsTab(state, area);
      break;
    case "invest":
      renderInvestTab(state, area);
      break;
    case "corp":
      renderCorpTab(state, area);
      break;
    case "achievements":
      renderAchievementsTab(state, area);
      break;
    default:
      area.innerHTML += '<p style="color:var(--text-muted)">开发中...</p>';
  }
}

function renderTimeSlot(state, parent) {
  const slotNames = {
    morning: "☀️ 上午",
    afternoon: "🌤️ 下午",
    evening: "🌙 晚上",
  };
  const slot = state.player.timeSlot;
  const maxAP = state.player.maxActionPoints || 100;
  const ap = state.player.actionPoints || 0;
  const apPct = Math.round((ap / maxAP) * 100);
  const apColor =
    ap < maxAP * 0.3
      ? "var(--danger)"
      : ap < maxAP * 0.6
        ? "var(--warning)"
        : "var(--accent)";

  // 天气信息
  let weatherHtml = "";
  if (state.weather && state.weather.weatherDef) {
    const w = state.weather.weatherDef;
    const t = state.weather.tempEffect || {};
    const s =
      typeof SEASONS !== "undefined" ? SEASONS[state.weather.season] : null;
    const temp = state.weather.temperature || 20;
    const tempColor =
      temp > 35
        ? "var(--danger)"
        : temp > 28
          ? "var(--warning)"
          : temp < 0
            ? "var(--danger)"
            : temp < 8
              ? "var(--warning)"
              : "var(--accent)";

    weatherHtml = `
      <span style="margin-left:12px;cursor:pointer;" onclick="toggleWeatherPanel()" title="点击查看天气详情">${s ? s.icon : ""} ${w.icon} ${w.name}</span>
      <span style="margin-left:6px;">🌡️ <strong style="color:${tempColor}">${temp}°C</strong></span>
      <span style="font-size:10px;color:var(--text-muted);margin-left:4px;">${t.name || ""}</span>
    `;

    // 极端天气警告
    if (!w.visible) {
      weatherHtml += `<span style="margin-left:6px;color:var(--danger);font-weight:bold;">⚠️不宜出行</span>`;
    } else if (w.apMod > 5) {
      weatherHtml += `<span style="margin-left:6px;color:var(--warning);font-size:10px;">出行+${w.apMod}AP</span>`;
    }
  }

  const div = document.createElement("div");
  div.id = "time-slot-indicator";
  div.innerHTML = `
    <span>📅 第 <strong>${state.player.day}</strong> 天</span>
    <span>|</span>
    <span class="time-slot-badge ${slot}">${slotNames[slot]}</span>
    <span style="margin-left:12px;">⚡ AP: <strong style="color:${apColor}">${ap}/${maxAP}</strong></span>
    <div style="display:inline-block;width:80px;height:8px;background:rgba(255,255,255,0.05);border-radius:4px;margin-left:4px;vertical-align:middle;">
      <div style="width:${apPct}%;height:100%;background:${apColor};border-radius:4px;transition:width 0.3s;"></div>
    </div>
    ${weatherHtml}
    <span style="margin-left:auto;font-size:11px;color:var(--text-muted)">
      ${state.player.phase === "corporate" ? `Q${state.player.corpQuarter}` : ""}
    </span>
  `;
  parent.appendChild(div);

  // 天气详情面板（默认折叠）
  renderWeatherDetailPanel(state, parent);
}

/** 切换天气面板展开/折叠 */
function toggleWeatherPanel() {
  const panel = document.getElementById("weather-detail-panel");
  if (!panel) return;
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

/** 渲染天气详情面板 */
function renderWeatherDetailPanel(state, parent) {
  if (!state.weather || !state.weather.weatherDef) return;

  const w = state.weather.weatherDef;
  const t = state.weather.tempEffect || {};
  const s =
    typeof SEASONS !== "undefined" ? SEASONS[state.weather.season] : null;
  const temp = state.weather.temperature || 20;
  const seasonDay = state.weather.seasonDay || 1;
  const seasonPct = Math.round((seasonDay / 30) * 100);

  // 季节进度条颜色
  const seasonColors = {
    spring: "#d4a8c4",
    summer: "#d4b85a",
    autumn: "#b0783a",
    winter: "#90b4d4",
  };
  const seasonColor = seasonColors[state.weather.season] || "var(--accent)";

  // 温度体感颜色
  const tempColor =
    temp > 35
      ? "var(--danger)"
      : temp > 28
        ? "var(--warning)"
        : temp < 0
          ? "var(--danger)"
          : temp < 8
            ? "var(--warning)"
            : "var(--accent)";

  // 影响列表
  const effects = [];
  if (w.apMod > 0)
    effects.push({
      icon: "⚡",
      text: `出行额外消耗 ${w.apMod} AP`,
      color: "var(--warning)",
    });
  if (!w.visible)
    effects.push({
      icon: "🚫",
      text: "极端天气，无法出行",
      color: "var(--danger)",
    });
  if (w.priceMod < 1.0)
    effects.push({
      icon: "📉",
      text: `商品价格下降 ${((1 - w.priceMod) * 100) | 0}%`,
      color: "var(--success)",
    });
  if (w.priceMod > 1.0)
    effects.push({
      icon: "📈",
      text: `商品价格上涨 ${((w.priceMod - 1) * 100) | 0}%`,
      color: "var(--danger)",
    });
  if (w.transportRisk > 1.1)
    effects.push({
      icon: "⚠️",
      text: `运输风险增加 ${Math.round((w.transportRisk - 1) * 100)}%`,
      color: "var(--warning)",
    });
  if (w.moodMod < 0)
    effects.push({
      icon: "😔",
      text: `心情 ${w.moodMod}`,
      color: "var(--danger)",
    });
  if (w.moodMod > 0)
    effects.push({
      icon: "😊",
      text: `心情 +${w.moodMod}`,
      color: "var(--success)",
    });
  if (w.fatigueMod > 0)
    effects.push({
      icon: "😴",
      text: `疲劳 +${w.fatigueMod}`,
      color: "var(--warning)",
    });
  if (w.healthMod < 0)
    effects.push({
      icon: "🤒",
      text: `健康 ${w.healthMod}`,
      color: "var(--danger)",
    });

  // 温度效果
  if (t.fatigueMod > 0)
    effects.push({
      icon: "🌡️",
      text: `体感${t.name}：疲劳 +${t.fatigueMod}`,
      color: "var(--warning)",
    });
  if (t.healthMod < 0)
    effects.push({
      icon: "🩺",
      text: `体感${t.name}：健康 ${t.healthMod}`,
      color: "var(--danger)",
    });
  if (t.moodMod < 0)
    effects.push({
      icon: "😐",
      text: `体感${t.name}：心情 ${t.moodMod}`,
      color: "var(--warning)",
    });
  if (t.moodMod > 0)
    effects.push({
      icon: "😄",
      text: `体感${t.name}：心情 +${t.moodMod}`,
      color: "var(--success)",
    });

  // 衣物防护
  let protectionHtml = "";
  if (typeof getClothingWeatherProtection === "function") {
    const prot = getClothingWeatherProtection(state);
    if (prot.coldProtection > 0 || prot.heatProtection > 0) {
      protectionHtml = `
        <div style="margin-top:8px;padding-top:6px;border-top:1px solid var(--border);">
          <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px;">🧥 衣物防护</div>
          ${prot.coldProtection > 0 ? `<div style="font-size:11px;color:#7ab8d4;">❄️ 防寒 +${prot.coldProtection}</div>` : ""}
          ${prot.heatProtection > 0 ? `<div style="font-size:11px;color:#d4985a;">🔥 防暑 +${prot.heatProtection}</div>` : ""}
        </div>
      `;
    }
  }

  // 舒适度来源
  let comfortHtml = "";
  if (state.status.comfort !== undefined) {
    const housingBonus = [0, 10, 20, 35][state.housing?.tier || 0];
    const housingNames = ["露宿街头", "合租床位", "单间", "一居室"];
    let comfortParts = [];
    comfortParts.push({ label: "基础", value: 50 });
    if (housingBonus > 0)
      comfortParts.push({
        label: housingNames[state.housing?.tier || 0],
        value: housingBonus,
        positive: true,
      });

    const comfort = state.status.comfort;
    const comfortColor =
      comfort > 70
        ? "var(--success)"
        : comfort > 40
          ? "var(--accent)"
          : "var(--danger)";
    comfortHtml = `
      <div style="margin-top:8px;padding-top:6px;border-top:1px solid var(--border);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <span style="font-size:11px;color:var(--text-secondary);">🏠 舒适度</span>
          <span style="font-size:13px;font-weight:bold;color:${comfortColor};">${comfort}</span>
        </div>
        <div style="display:flex;width:100%;height:6px;background:rgba(255,255,255,0.05);border-radius:3px;">
          <div style="width:${Math.min(comfort, 100)}%;height:100%;background:${comfortColor};border-radius:3px;transition:width 0.3s;"></div>
        </div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:3px;">
          基础50${housingBonus > 0 ? ` + 住所+${housingBonus}` : ""} + 天气影响 + 卫生影响
        </div>
      </div>
    `;
  }

  // 天气详情面板
  const panel = document.createElement("div");
  panel.id = "weather-detail-panel";
  panel.style.cssText = `
    display:none;
    margin-top:6px;
    padding:10px 14px;
    background:rgba(4,10,22,0.5);
    border:1px solid var(--border);
    border-radius:8px;
    font-size:12px;
  `;

  let effectsHtml = effects
    .map(
      (e) =>
        `<div style="display:flex;align-items:center;gap:6px;padding:2px 0;">
      <span>${e.icon}</span>
      <span style="color:${e.color};">${e.text}</span>
    </div>`,
    )
    .join("");

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <span style="font-size:16px;">${s ? s.icon : ""}</span>
        <strong style="margin-left:4px;">${s ? s.name + "季" : ""}</strong>
        <span style="color:var(--text-muted);margin-left:6px;">第 ${seasonDay}/30 天</span>
      </div>
      <div style="text-align:right;">
        <div style="font-size:18px;font-weight:bold;color:${tempColor};">${temp}°C</div>
        <div style="font-size:10px;color:var(--text-muted);">${w.icon} ${w.name} · ${t.name || ""}</div>
      </div>
    </div>
    <!-- 季节进度条 -->
    <div style="margin:6px 0;">
      <div style="display:flex;width:100%;height:4px;background:rgba(255,255,255,0.05);border-radius:2px;">
        <div style="width:${seasonPct}%;height:100%;background:${seasonColor};border-radius:2px;transition:width 0.3s;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text-muted);margin-top:2px;">
        <span>🌸春</span><span>☀️夏</span><span>🍂秋</span><span>❄️冬</span>
      </div>
    </div>
    <!-- 当前影响 -->
    <div style="margin-top:6px;">
      <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px;">📋 当前天气影响</div>
      ${effectsHtml || '<div style="color:var(--text-muted);">天气良好，无额外影响</div>'}
    </div>
    ${protectionHtml}
    ${comfortHtml}
    ${s ? `<div style="margin-top:6px;font-size:10px;color:var(--text-muted);font-style:italic;">${s.desc}</div>` : ""}
  `;

  parent.appendChild(panel);
}

function renderActiveNews(state, parent) {
  if (state.activeNews && state.activeNews.length > 0) {
    for (const news of state.activeNews) {
      const banner = document.createElement("div");
      banner.className = "news-banner";
      banner.innerHTML = `<span class="news-icon">📰</span> ${news.headline}`;
      parent.appendChild(banner);
    }
  }
}

// ====== Actions Tab ======
function renderActionsTab(state, parent) {
  const actions = getAvailableActions(state);

  // 分离出行和其他行动
  const travelActions = actions.filter((a) => a.id.startsWith("travel_"));
  const housingActions = actions.filter(
    (a) => a.id.startsWith("housing_") || a.id.startsWith("storage_"),
  );
  const otherActions = actions.filter(
    (a) =>
      !a.id.startsWith("travel_") &&
      !a.id.startsWith("housing_") &&
      !a.id.startsWith("storage_"),
  );

  // === 🌍 出行区域（置顶，醒目） ===
  if (travelActions.length > 0) {
    const travelSection = document.createElement("div");
    travelSection.style.cssText = "margin-bottom:16px;";
    travelSection.innerHTML =
      '<h3 style="color:var(--accent);margin-bottom:8px;font-size:14px;">🌍 出行 — 点击前往其他地点</h3>';

    const travelGrid = document.createElement("div");
    travelGrid.className = "action-cards";
    travelGrid.style.gridTemplateColumns =
      "repeat(auto-fill, minmax(180px, 1fr))";

    for (const action of travelActions) {
      const destKey = action.id.replace("travel_", "");
      const dest =
        typeof getLocation === "function" ? getLocation(destKey) : null;
      const jobCount = dest ? (dest.jobs || []).length : 0;

      // 检查该地点的最佳买卖机会
      let tradeHint = "";
      if (typeof GOODS !== "undefined" && state.trade.goodsPrices[destKey]) {
        const opportunities = [];
        for (const good of GOODS) {
          const destPrice = state.trade.goodsPrices[destKey]?.[good.id];
          const curPrice =
            state.trade.goodsPrices[state.trade.currentLocation]?.[good.id];
          if (destPrice && curPrice && destPrice > curPrice * 1.3) {
            opportunities.push(`${good.name}📈`);
          }
        }
        if (opportunities.length > 0)
          tradeHint = `<br>🤑 可卖: ${opportunities.slice(0, 2).join(" ")}`;
      }

      const card = document.createElement("div");
      card.className = "action-card";
      card.style.borderColor = "var(--accent)";
      card.style.background =
        "linear-gradient(135deg, var(--bg-card), rgba(74,168,204,0.04))";
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="card-title" style="font-size:15px;color:var(--accent);">${dest ? dest.name : destKey}</div>
          <span style="font-size:10px;color:var(--text-muted);">🚶 前往</span>
        </div>
        <div class="card-desc" style="font-size:11px;margin:4px 0;">
          ${dest ? dest.desc : ""}
          ${jobCount > 0 ? `<br>💼 ${jobCount}种工作机会` : ""}
          ${tradeHint}
        </div>
      `;
      card.addEventListener("click", () => {
        action.handler();
        renderAll();
      });
      travelGrid.appendChild(card);
    }
    travelSection.appendChild(travelGrid);
    parent.appendChild(travelSection);
  }

  // === 🏠 住所/仓储区域 ===
  if (housingActions.length > 0) {
    const houseSection = document.createElement("div");
    houseSection.style.cssText = "margin-bottom:12px;";
    houseSection.innerHTML =
      '<h3 style="color:var(--warning);margin-bottom:6px;font-size:13px;">🏠 住所 & 仓储</h3>';
    const houseGrid = document.createElement("div");
    houseGrid.className = "action-cards";
    houseGrid.style.gridTemplateColumns =
      "repeat(auto-fill, minmax(200px, 1fr))";
    for (const action of housingActions) {
      houseGrid.appendChild(createActionCard(action, state));
    }
    houseSection.appendChild(houseGrid);
    parent.appendChild(houseSection);
  }

  // === 其他行动 ===
  if (otherActions.length > 0) {
    const otherLabel = document.createElement("h3");
    otherLabel.style.cssText =
      "color:var(--text-muted);margin-bottom:6px;font-size:13px;";
    otherLabel.textContent = "⚡ 行动";
    parent.appendChild(otherLabel);

    const cards = document.createElement("div");
    cards.className = "action-cards";
    for (const action of otherActions) {
      cards.appendChild(createActionCard(action, state));
    }
    parent.appendChild(cards);
  }
}

function createActionCard(action, state) {
  const card = document.createElement("div");
  card.className = "action-card";
  if (action.disabled) {
    card.classList.add("disabled");
  }

  card.innerHTML = `
    <div class="card-icon">${action.icon}</div>
    <div class="card-title">${action.name}</div>
    <div class="card-desc">${action.desc}</div>
    <div class="card-meta">
      ${action.payEstimate ? `<span class="pay-estimate">💰 ¥${action.payEstimate}</span>` : ""}
      ${action.costEstimate ? `<span class="cost-estimate">💸 ¥${action.costEstimate}</span>` : ""}
      ${action.reqFail ? `<span class="req-fail">⚠ ${action.reqFail}</span>` : ""}
    </div>
  `;

  if (!action.disabled) {
    card.addEventListener("click", () => {
      if (action.handler) {
        action.handler();
        renderAll();
      }
    });
  }

  return card;
}

// ====== Trade Tab ======
function renderTradeTab(state, parent) {
  const locKey = state.trade.currentLocation;
  const loc = getLocation(locKey);
  const prices = state.trade.goodsPrices[locKey] || {};
  const isWholesale = locKey === "wholesaleMarket";
  const goodsList = typeof GOODS !== "undefined" ? GOODS : [];

  // === 搜索和筛选栏 ===
  const filterBar = document.createElement("div");
  filterBar.style.cssText =
    "display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center;";
  filterBar.innerHTML = `
    <input type="text" id="trade-search-input" placeholder="搜索商品..."
      style="flex:1;min-width:120px;padding:6px 10px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-size:12px;" />
    <select id="trade-category-filter"
      style="padding:6px 10px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-size:12px;">
      <option value="">全部分类</option>
    </select>
    <select id="trade-sort-filter"
      style="padding:6px 10px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-size:12px;">
      <option value="name">按名称</option>
      <option value="price-low">价格从低到高</option>
      <option value="price-high">价格从高到低</option>
      <option value="profit">利润率从高到低</option>
    </select>
  `;
  parent.appendChild(filterBar);

  // 标题区
  const headerDiv = document.createElement("div");
  headerDiv.style.cssText =
    "display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;";
  headerDiv.innerHTML = `
    <h3 style="color:var(--text-muted);margin:0;">
      📦 ${loc ? loc.name : "当前地点"} — ${isWholesale ? "批发市场（进货价低）" : "零售市场"}
    </h3>
    <span style="font-size:11px;color:var(--text-muted);">现金: <strong style="color:var(--success)">¥${state.resources.cash.toLocaleString()}</strong></span>
  `;
  parent.appendChild(headerDiv);

  // 市场事件提示
  const marketEvents = state.trade.marketEvents || [];
  if (marketEvents.length > 0) {
    const evtDiv = document.createElement("div");
    evtDiv.style.cssText = "margin-bottom:12px;";
    for (const evt of marketEvents) {
      evtDiv.innerHTML += `
        <div style="padding:6px 10px;margin-bottom:4px;background:rgba(196,154,58,0.1);border:1px solid var(--warning);border-radius:4px;font-size:11px;">
          📰 ${evt.name}（剩余${evt.remaining}天）— ${evt.desc}
          <span style="color:${evt.priceMod > 1 ? "var(--danger)" : "var(--success)"};margin-left:4px;">
            ${evt.priceMod > 1 ? "📈价格+" + Math.round((evt.priceMod - 1) * 100) + "%" : "📉价格" + Math.round((1 - evt.priceMod) * 100) + "%"}
          </span>
        </div>
      `;
    }
    parent.appendChild(evtDiv);
  }

  // 地区差价提示
  const locTags =
    typeof LOCATION_GOODS_TAGS !== "undefined"
      ? LOCATION_GOODS_TAGS[locKey]
      : null;
  if (locTags) {
    const tipDiv = document.createElement("div");
    tipDiv.style.cssText =
      "padding:6px 10px;margin-bottom:12px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;font-size:11px;color:var(--text-muted);";
    let tipHtml = `📍 ${locTags.desc}`;
    if (locTags.specialties && locTags.specialties.length > 0) {
      const specNames = locTags.specialties.map((gid) => {
        const g = typeof getGoodById === "function" ? getGoodById(gid) : null;
        return g ? g.name : gid;
      });
      tipHtml += `<br>🟢 便宜：${specNames.join("、")}`;
    }
    if (locTags.scarce && locTags.scarce.length > 0) {
      const scarceNames = locTags.scarce.map((gid) => {
        const g = typeof getGoodById === "function" ? getGoodById(gid) : null;
        return g ? g.name : gid;
      });
      tipHtml += `<br>🔴 昂贵：${scarceNames.join("、")}`;
    }
    tipDiv.innerHTML = tipHtml;
    parent.appendChild(tipDiv);
  }

  if (goodsList.length === 0) {
    parent.innerHTML +=
      '<p style="color:var(--text-muted)">商品数据加载中...</p>';
    return;
  }

  // === 填充分类筛选下拉 ===
  const categoryFilter = document.getElementById("trade-category-filter");
  if (categoryFilter) {
    const categories = new Set();
    for (const good of goodsList) {
      if (good.category) categories.add(good.category);
    }
    for (const cat of categories) {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    }
  }

  // === 应用筛选和排序 ===
  let filteredGoods = [...goodsList];
  const searchInput = document.getElementById("trade-search-input");
  const categorySelect = document.getElementById("trade-category-filter");
  const sortSelect = document.getElementById("trade-sort-filter");

  if (searchInput && searchInput.value) {
    const searchTerm = searchInput.value.toLowerCase();
    filteredGoods = filteredGoods.filter((g) =>
      g.name.toLowerCase().includes(searchTerm),
    );
  }
  if (categorySelect && categorySelect.value) {
    filteredGoods = filteredGoods.filter(
      (g) => g.category === categorySelect.value,
    );
  }
  if (sortSelect && sortSelect.value) {
    switch (sortSelect.value) {
      case "name":
        filteredGoods.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-low":
        filteredGoods.sort(
          (a, b) =>
            (prices[a.id] || a.basePrice) - (prices[b.id] || b.basePrice),
        );
        break;
      case "price-high":
        filteredGoods.sort(
          (a, b) =>
            (prices[b.id] || b.basePrice) - (prices[a.id] || a.basePrice),
        );
        break;
      case "profit":
        filteredGoods.sort(
          (a, b) =>
            ((prices[a.id] || a.basePrice) - a.basePrice) / a.basePrice -
            ((prices[b.id] || b.basePrice) - b.basePrice) / b.basePrice,
        );
        break;
    }
  }

  // 绑定筛选事件
  setTimeout(() => {
    const searchInp = document.getElementById("trade-search-input");
    const catSel = document.getElementById("trade-category-filter");
    const sortSel = document.getElementById("trade-sort-filter");
    if (searchInp) {
      searchInp.addEventListener("input", () => renderTradeTab(state, parent));
    }
    if (catSel) {
      catSel.addEventListener("change", () => renderTradeTab(state, parent));
    }
    if (sortSel) {
      sortSel.addEventListener("change", () => renderTradeTab(state, parent));
    }
  }, 50);

  // 背包中的商品（方便快速卖出）+ 负重信息
  const ownedGoods = state.inventory.items || [];
  if (ownedGoods.length > 0) {
    // 负重概览
    const enc =
      typeof calcEncumbrance === "function" ? calcEncumbrance(state) : null;
    const ownedDiv = document.createElement("div");
    ownedDiv.style.marginBottom = "16px";
    ownedDiv.innerHTML =
      '<h4 style="color:var(--text-muted);margin-bottom:8px;">🎒 背包中的商品（可卖出）</h4>';

    // 负重条
    if (enc) {
      const weightPct = Math.min(
        100,
        Math.round((enc.totalWeight / enc.maxCarry) * 100),
      );
      const tierColor =
        enc.tier.apPenalty > 2
          ? "var(--danger)"
          : enc.tier.apPenalty > 0
            ? "var(--warning)"
            : "var(--accent)";
      ownedDiv.innerHTML += `
        <div style="padding:6px 8px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;margin-bottom:8px;font-size:11px;">
          <span style="color:${tierColor};font-weight:bold;">${enc.tier.name}</span>
          ⚖️ ${enc.totalWeight}/${enc.maxCarry}千克
          📐 ${enc.totalVolume}/${enc.maxVolume}升
          ${enc.tier.apPenalty > 0 ? `<span style="color:var(--warning);"> 行动+${enc.tier.apPenalty}AP</span>` : ""}
        </div>
      `;
    }

    const ownedGrid = document.createElement("div");
    ownedGrid.className = "action-cards";
    ownedGrid.style.gridTemplateColumns =
      "repeat(auto-fill, minmax(180px, 1fr))";

    for (const item of ownedGoods) {
      const good = getGoodById(item.id);
      if (!good) continue;
      const price = prices[good.id] || good.basePrice;
      const profitInfo = item.avgBuyPrice
        ? price > item.avgBuyPrice
          ? `<span style="color:var(--success)">📈 +¥${((price - item.avgBuyPrice) * item.qty).toFixed(1)}</span>`
          : `<span style="color:var(--danger)">📉 -¥${((item.avgBuyPrice - price) * item.qty).toFixed(1)}</span>`
        : "";

      // 重量/体积/变质信息
      const phys =
        typeof getGoodPhysics === "function" ? getGoodPhysics(item.id) : null;
      let physLine = "";
      if (phys) {
        physLine = `<div style="font-size:10px;color:var(--text-muted);">⚖️${(phys.weight * item.qty).toFixed(1)}千克 📐${(phys.volume * item.qty).toFixed(1)}升</div>`;
      }
      let perishLine = "";
      if (phys && phys.perishable && phys.shelfLife) {
        const daysLeft =
          phys.shelfLife -
          (state.player.day - (item.buyDay || state.player.day));
        perishLine =
          daysLeft <= 2
            ? `<div style="font-size:10px;color:var(--warning);">⏰ ${daysLeft <= 0 ? "已变质！" : daysLeft + "天后变质"}</div>`
            : `<div style="font-size:10px;color:var(--text-muted);">⏰ ${daysLeft}天后变质</div>`;
      }

      const card = document.createElement("div");
      card.className = "action-card";
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="card-title" style="margin:0;">${good.name}</div>
          <span class="slot-tag">×${item.qty}</span>
        </div>
        <div class="card-desc" style="margin:4px 0;">
          买入均价: ¥${item.avgBuyPrice || "?"} | 当前价: ¥${price.toFixed(1)}
        </div>
        ${physLine}${perishLine}
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:11px;">${profitInfo}</span>
          <div style="display:flex;gap:4px;">
            <button class="btn btn-sm btn-danger sell-one-btn" data-good="${good.id}">卖1</button>
            <button class="btn btn-sm btn-danger sell-all-btn" data-good="${good.id}">全卖</button>
          </div>
        </div>
      `;
      ownedGrid.appendChild(card);
    }
    ownedDiv.appendChild(ownedGrid);
    parent.appendChild(ownedDiv);
  }

  // 市场价格表
  const marketLabel = document.createElement("h4");
  marketLabel.style.cssText = "color:var(--text-muted);margin-bottom:8px;";
  marketLabel.textContent = isWholesale
    ? "📋 批发商品（最低5件起批，批发价 = 零售价×0.7）"
    : "📋 市场商品";
  parent.appendChild(marketLabel);

  const grid = document.createElement("div");
  grid.className = "action-cards";
  grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";

  for (const good of goodsList) {
    const price = prices[good.id] || good.basePrice;
    const wholesalePrice = isWholesale
      ? Math.round(price * 0.7 * 100) / 100
      : null;

    // 价格对比：最低价和最高价
    const lowest = getLowestPrice(good.id);
    const highest = getHighestPrice(good.id);
    const isLowest = lowest.location === locKey;
    const isHighest = highest.location === locKey;

    const card = document.createElement("div");
    card.className = "action-card";
    // 重量/体积信息
    const phys =
      typeof getGoodPhysics === "function" ? getGoodPhysics(good.id) : null;
    let physLine = "";
    if (phys) {
      const tags = [];
      tags.push(`⚖️${phys.weight}千克`);
      tags.push(`📐${phys.volume}升`);
      if (phys.perishable) tags.push(`⏰${phys.shelfLife}天`);
      if (phys.fragile) tags.push("易碎");
      physLine = `<div style="font-size:9px;color:var(--text-muted);margin-bottom:2px;">${tags.join(" ")}</div>`;
    }
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div class="card-title" style="margin:0;">${good.name}</div>
        <span class="slot-tag">${good.category}</span>
      </div>
      ${physLine}
      <div class="card-desc" style="margin:4px 0;">
        基准: ¥${good.basePrice}/${good.unit}
        ${wholesalePrice ? `<br>批发价: <strong style="color:var(--success)">¥${wholesalePrice.toFixed(1)}</strong>/件 (零售 ¥${price.toFixed(1)})` : ""}
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;">
        当前零售价: <strong style="color:${isLowest ? "var(--success)" : isHighest ? "var(--danger)" : "var(--text-primary)"}">¥${price.toFixed(1)}</strong>
        ${isLowest ? " 🟢 全城最低" : ""}${isHighest ? " 🔴 全城最高" : ""}
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;">
        <button class="btn btn-sm btn-success buy-btn" data-good="${good.id}" data-qty="1">买1</button>
        <button class="btn btn-sm btn-success buy-btn" data-good="${good.id}" data-qty="5">买5</button>
        ${isWholesale ? `<button class="btn btn-sm btn-primary wholesale-btn" data-good="${good.id}" data-qty="10">批发×10</button>` : ""}
      </div>
    `;
    grid.appendChild(card);
  }
  parent.appendChild(grid);

  // 价格对比速查表
  const compareDiv = document.createElement("div");
  compareDiv.style.marginTop = "20px";
  compareDiv.innerHTML =
    '<h4 style="color:var(--text-muted);margin-bottom:8px;">📍 各地价格对比</h4>';

  const compareTable = document.createElement("div");
  compareTable.style.cssText = "overflow-x:auto;font-size:11px;";
  let tableHtml =
    '<table style="width:100%;border-collapse:collapse;"><thead><tr><th style="padding:4px 8px;text-align:left;border-bottom:1px solid var(--border);color:var(--text-muted);">商品</th>';
  for (const lk of Object.keys(LOCATIONS)) {
    const l = LOCATIONS[lk];
    tableHtml += `<th style="padding:4px 6px;text-align:right;border-bottom:1px solid var(--border);color:var(--text-muted);font-size:10px;">${l.name.substring(0, 2)}</th>`;
  }
  tableHtml += "</tr></thead><tbody>";

  for (const good of goodsList) {
    tableHtml += `<tr><td style="padding:3px 8px;border-bottom:1px solid rgba(255,255,255,0.03);">${good.name}</td>`;
    for (const lk of Object.keys(LOCATIONS)) {
      const p = (state.trade.goodsPrices[lk] || {})[good.id] || good.basePrice;
      const isLow = getLowestPrice(good.id).location === lk;
      const isHigh = getHighestPrice(good.id).location === lk;
      const cellStyle = isLow
        ? "color:var(--success);font-weight:bold;"
        : isHigh
          ? "color:var(--danger);"
          : "color:var(--text-secondary);";
      tableHtml += `<td style="padding:3px 6px;text-align:right;border-bottom:1px solid rgba(255,255,255,0.03);${cellStyle}">${p.toFixed(1)}</td>`;
    }
    tableHtml += "</tr>";
  }
  tableHtml += "</tbody></table>";
  compareTable.innerHTML = tableHtml;
  compareDiv.appendChild(compareTable);
  parent.appendChild(compareDiv);

  // 绑定事件（延迟执行，等 DOM 插入完成）
  setTimeout(() => {
    // 购买按钮
    parent.querySelectorAll(".buy-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const goodId = btn.dataset.good;
        const qty = parseInt(btn.dataset.qty) || 1;
        if (typeof buyGood === "function") {
          buyGood(goodId, qty);
          renderCurrentTab(StateManager.getState(), parent.parentElement);
          renderSidebar(StateManager.getState());
          renderHeader(StateManager.getState());
          renderMessageLog(StateManager.getState());
        }
      });
    });

    // 批发按钮
    parent.querySelectorAll(".wholesale-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const goodId = btn.dataset.good;
        const qty = parseInt(btn.dataset.qty) || 10;
        if (typeof buyWholesale === "function") {
          buyWholesale(goodId, qty);
          renderCurrentTab(StateManager.getState(), parent.parentElement);
          renderSidebar(StateManager.getState());
          renderHeader(StateManager.getState());
          renderMessageLog(StateManager.getState());
        }
      });
    });

    // 卖出按钮（背包区）
    parent.querySelectorAll(".sell-one-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const goodId = btn.dataset.good;
        if (typeof sellGood === "function") {
          sellGood(goodId, 1);
          renderCurrentTab(StateManager.getState(), parent.parentElement);
          renderSidebar(StateManager.getState());
          renderHeader(StateManager.getState());
          renderMessageLog(StateManager.getState());
        }
      });
    });

    parent.querySelectorAll(".sell-all-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const goodId = btn.dataset.good;
        const item = StateManager.getState().inventory.items.find(
          (i) => i.id === goodId,
        );
        if (item && typeof sellGood === "function") {
          sellGood(goodId, item.qty);
          renderCurrentTab(StateManager.getState(), parent.parentElement);
          renderSidebar(StateManager.getState());
          renderHeader(StateManager.getState());
          renderMessageLog(StateManager.getState());
        }
      });
    });
  }, 0);
}

// ====== Inventory Tab（背包/容器/仓库/运输） ======
function renderInventoryTab(state, parent) {
  const div = document.createElement("div");

  // === 负重状态栏 ===
  const enc =
    typeof calcEncumbrance === "function" ? calcEncumbrance(state) : null;
  if (enc) {
    const weightPct = Math.min(
      100,
      Math.round((enc.totalWeight / enc.maxCarry) * 100),
    );
    const volPct = Math.min(
      100,
      Math.round((enc.totalVolume / enc.maxVolume) * 100),
    );
    const tierColor =
      enc.tier.apPenalty > 2
        ? "var(--danger)"
        : enc.tier.apPenalty > 0
          ? "var(--warning)"
          : "var(--accent)";

    const encDiv = document.createElement("div");
    encDiv.style.cssText =
      "background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:16px;";
    encDiv.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <h3 style="color:var(--text-muted);margin:0;font-size:14px;">🎒 背包状态</h3>
        <span style="font-size:13px;font-weight:bold;color:${tierColor};">${enc.tier.name} ${enc.tier.apPenalty > 0 ? `(+${enc.tier.apPenalty}AP)` : ""}</span>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">${enc.tier.desc}</div>
      <div style="margin-bottom:6px;">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px;">
          <span>⚖️ 重量</span>
          <span style="color:${weightPct > 130 ? "var(--danger)" : weightPct > 80 ? "var(--warning)" : "var(--text-primary)"}">${enc.totalWeight}/${enc.maxCarry} 千克</span>
        </div>
        <div style="height:6px;background:rgba(255,255,255,0.05);border-radius:3px;">
          <div style="width:${Math.min(100, weightPct)}%;height:100%;background:${weightPct > 130 ? "var(--danger)" : weightPct > 80 ? "var(--warning)" : "var(--accent)"};border-radius:3px;transition:width 0.3s;"></div>
        </div>
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px;">
          <span>📐 体积</span>
          <span style="color:${volPct > 130 ? "var(--danger)" : volPct > 80 ? "var(--warning)" : "var(--text-primary)"}">${enc.totalVolume}/${enc.maxVolume} 升</span>
        </div>
        <div style="height:6px;background:rgba(255,255,255,0.05);border-radius:3px;">
          <div style="width:${Math.min(100, volPct)}%;height:100%;background:${volPct > 130 ? "var(--danger)" : volPct > 80 ? "var(--warning)" : "var(--accent)"};border-radius:3px;transition:width 0.3s;"></div>
        </div>
      </div>
    `;
    div.appendChild(encDiv);
  } else {
    div.innerHTML += `
      <h3 style="color:var(--text-muted);margin-bottom:12px;">🎒 物品栏
        <span style="font-size:11px;color:var(--text-muted)">
          (${state.inventory.items.length}/${state.inventory.capacity})
        </span>
      </h3>
    `;
  }

  // === 背包商品列表 ===
  const items = state.inventory.items || [];
  if (items.length === 0) {
    div.innerHTML +=
      '<p style="color:var(--text-muted);padding:8px;">背包空空如也</p>';
  } else {
    const sectionLabel = document.createElement("h4");
    sectionLabel.style.cssText =
      "color:var(--text-muted);margin:8px 0;font-size:13px;";
    sectionLabel.textContent = "📦 随身商品";
    div.appendChild(sectionLabel);

    const grid = document.createElement("div");
    grid.className = "action-cards";
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";

    for (const item of items) {
      const good =
        typeof getGoodById === "function" ? getGoodById(item.id) : null;
      const phys =
        typeof getGoodPhysics === "function" ? getGoodPhysics(item.id) : null;
      const name = good ? good.name : item.id;

      // 变质倒计时
      let perishInfo = "";
      if (phys && phys.perishable && phys.shelfLife) {
        const buyDay = item.buyDay || state.player.day;
        const daysLeft = phys.shelfLife - (state.player.day - buyDay);
        if (daysLeft <= 0) {
          perishInfo = `<span style="color:var(--danger);">🗑️ 已变质</span>`;
        } else if (daysLeft <= 2) {
          perishInfo = `<span style="color:var(--warning);">⏰ ${daysLeft}天后变质</span>`;
        } else {
          perishInfo = `<span style="color:var(--text-muted);">⏰ ${daysLeft}天后变质</span>`;
        }
      }

      // 重量/体积信息
      let physInfo = "";
      if (phys) {
        physInfo = `<span style="color:var(--text-muted);">⚖️${(phys.weight * item.qty).toFixed(1)}千克 📐${(phys.volume * item.qty).toFixed(1)}升</span>`;
      }

      const card = document.createElement("div");
      card.className = "action-card";
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="card-title" style="margin:0;font-size:13px;">${name}</div>
          <span class="slot-tag">×${item.qty}</span>
        </div>
        <div style="font-size:11px;margin:4px 0;">
          ${physInfo}
          ${item.avgBuyPrice ? `<br><span style="color:var(--text-muted);">买入均价: ¥${item.avgBuyPrice.toFixed(1)}</span>` : ""}
        </div>
        ${perishInfo ? `<div style="font-size:10px;">${perishInfo}</div>` : ""}
        <div style="display:flex;gap:4px;margin-top:4px;">
          <button class="btn btn-sm btn-danger inv-sell-btn" data-good="${item.id}" data-qty="1">卖1</button>
          <button class="btn btn-sm btn-danger inv-sell-btn" data-good="${item.id}" data-qty="${item.qty}">全卖</button>
        </div>
      `;
      grid.appendChild(card);
    }
    div.appendChild(grid);
  }

  // === 容器装备 ===
  const containers = state.inventory.containers || [];
  const containerSection = document.createElement("div");
  containerSection.style.cssText = "margin-top:16px;";
  containerSection.innerHTML =
    '<h4 style="color:var(--text-muted);margin-bottom:8px;font-size:13px;">🎒 装备的容器</h4>';

  if (containers.length === 0) {
    containerSection.innerHTML +=
      '<div style="font-size:11px;color:var(--text-muted);padding:4px;">只有两只手，考虑买个包？</div>';
  } else {
    const contGrid = document.createElement("div");
    contGrid.className = "action-cards";
    contGrid.style.gridTemplateColumns =
      "repeat(auto-fill, minmax(160px, 1fr))";

    for (const c of containers) {
      const typeDef =
        typeof getContainerType === "function"
          ? getContainerType(c.containerId)
          : null;
      if (!typeDef) continue;
      const card = document.createElement("div");
      card.className = "action-card";
      card.innerHTML = `
        <div style="font-size:11px;color:var(--text-muted)">${typeDef.slot}</div>
        <div style="font-size:13px;color:var(--accent)">${typeDef.name}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">容量+${typeDef.capacity} 体积+${typeDef.volumeCapacity} ${typeDef.weightReduction > 0 ? `减负${Math.round(typeDef.weightReduction * 100)}%` : ""}</div>
      `;
      contGrid.appendChild(card);
    }
    containerSection.appendChild(contGrid);
  }

  // 购买容器按钮
  if (typeof CONTAINER_TYPES !== "undefined") {
    const buySection = document.createElement("div");
    buySection.style.cssText = "margin-top:8px;";
    buySection.innerHTML =
      '<div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">🛒 购买容器</div>';

    const buyGrid = document.createElement("div");
    buyGrid.className = "action-cards";
    buyGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(160px, 1fr))";

    for (const ct of CONTAINER_TYPES) {
      if (ct.id === "none" || ct.price === 0) continue;
      const owned = containers.find((c) => c.containerId === ct.id);
      if (owned) continue; // 已有则不显示

      const canAfford = state.resources.cash >= ct.price;
      const card = document.createElement("div");
      card.className = "action-card";
      card.style.opacity = canAfford ? "1" : "0.5";
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:12px;color:var(--accent);">${ct.name}</div>
          <span style="font-size:10px;color:var(--text-muted);">${ct.slot}</span>
        </div>
        <div style="font-size:10px;color:var(--text-muted);margin:2px 0;">${ct.desc}</div>
        <div style="font-size:10px;color:var(--text-muted);">容量+${ct.capacity} 体积+${ct.volumeCapacity} ${ct.weightReduction > 0 ? `减负${Math.round(ct.weightReduction * 100)}%` : ""}</div>
        <div style="font-size:11px;color:${canAfford ? "var(--success)" : "var(--danger)"};margin-top:4px;">💰 ¥${ct.price}</div>
      `;
      if (canAfford) {
        card.addEventListener("click", () => {
          if (typeof buyContainer === "function") buyContainer(ct.id);
          renderAll();
        });
      }
      buyGrid.appendChild(card);
    }
    buySection.appendChild(buyGrid);
    containerSection.appendChild(buySection);
  }
  div.appendChild(containerSection);

  // === 当地仓库 ===
  const locKey = state.trade.currentLocation;
  const storage = state.inventory.storage || {};
  const localStorage = storage[locKey] || [];

  const storageSection = document.createElement("div");
  storageSection.style.cssText = "margin-top:16px;";
  storageSection.innerHTML =
    '<h4 style="color:var(--text-muted);margin-bottom:8px;font-size:13px;">📦 当地仓库暂存</h4>';

  if (localStorage.length === 0) {
    storageSection.innerHTML +=
      '<div style="font-size:11px;color:var(--text-muted);padding:4px;">当地没有暂存货物</div>';
  } else {
    const stGrid = document.createElement("div");
    stGrid.className = "action-cards";
    stGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(160px, 1fr))";

    for (const item of localStorage) {
      const good =
        typeof getGoodById === "function" ? getGoodById(item.id) : null;
      const name = good ? good.name : item.id;
      const phys =
        typeof getGoodPhysics === "function" ? getGoodPhysics(item.id) : null;

      const card = document.createElement("div");
      card.className = "action-card";
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:12px;">${name}</div>
          <span class="slot-tag">×${item.qty}</span>
        </div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">
          ${phys ? `⚖️${(phys.weight * item.qty).toFixed(1)}千克 📐${(phys.volume * item.qty).toFixed(1)}升` : ""}
        </div>
        <button class="btn btn-sm btn-success storage-retrieve-btn" data-good="${item.id}" data-qty="${item.qty}" style="margin-top:4px;">取回背包</button>
      `;
      stGrid.appendChild(card);
    }
    storageSection.appendChild(stGrid);
  }

  // 其他地点暂存概况
  const otherLocs = Object.keys(storage).filter(
    (k) => k !== locKey && storage[k].length > 0,
  );
  if (otherLocs.length > 0) {
    const otherDiv = document.createElement("div");
    otherDiv.style.cssText =
      "margin-top:8px;font-size:11px;color:var(--text-muted);";
    otherDiv.innerHTML = "📍 其他地点暂存：";
    for (const lk of otherLocs) {
      const loc = typeof getLocation === "function" ? getLocation(lk) : null;
      const totalQty = storage[lk].reduce((s, i) => s + i.qty, 0);
      otherDiv.innerHTML += ` <span style="color:var(--accent);">${loc ? loc.name : lk}(${totalQty}件)</span>`;
    }
    storageSection.appendChild(otherDiv);
  }

  div.appendChild(storageSection);

  // === 雇佣运输 ===
  if (typeof TRANSPORT_SERVICES !== "undefined" && items.length > 0) {
    const transportSection = document.createElement("div");
    transportSection.style.cssText = "margin-top:16px;";
    transportSection.innerHTML =
      '<h4 style="color:var(--text-muted);margin-bottom:8px;font-size:13px;">🚚 雇佣运输</h4>';

    const destOptions =
      typeof getReachableLocations === "function"
        ? getReachableLocations(locKey)
        : [];
    const destSelectId = "transport-dest-select";

    // 运输服务卡片
    const tGrid = document.createElement("div");
    tGrid.className = "action-cards";
    tGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(180px, 1fr))";

    for (const svc of TRANSPORT_SERVICES) {
      const canAfford = state.resources.cash >= svc.cost;
      const card = document.createElement("div");
      card.className = "action-card";
      card.style.opacity = canAfford ? "1" : "0.5";
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:13px;">${svc.icon || ""} ${svc.name}</div>
          <span style="font-size:11px;color:${canAfford ? "var(--success)" : "var(--danger)"};">💰 ¥${svc.cost}</span>
        </div>
        <div style="font-size:10px;color:var(--text-muted);margin:4px 0;">${svc.desc}</div>
        <div style="font-size:10px;color:var(--text-muted);">
          容量: ⚖️${svc.capacity}千克 📐${svc.volumeCapacity}升<br>
          风险: 🦹${svc.theftRisk}%偷窃 💔${svc.damageRisk}%损坏
        </div>
      `;
      tGrid.appendChild(card);
    }
    transportSection.appendChild(tGrid);

    // 运输操作区
    if (destOptions.length > 0) {
      const opDiv = document.createElement("div");
      opDiv.style.cssText =
        "margin-top:8px;padding:8px;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;";
      opDiv.innerHTML = `
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">选择货物和目的地来雇佣运输</div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <select id="${destSelectId}" style="background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border);border-radius:4px;padding:4px 8px;font-size:11px;">
            ${destOptions
              .map((dk) => {
                const d =
                  typeof getLocation === "function" ? getLocation(dk) : null;
                return `<option value="${dk}">${d ? d.name : dk}</option>`;
              })
              .join("")}
          </select>
        </div>
        <div id="transport-goods-list" style="margin-top:8px;"></div>
      `;
      transportSection.appendChild(opDiv);
    }

    div.appendChild(transportSection);
  }

  // === 装备栏 ===
  const equip = state.inventory.equipment;
  const equipDiv = document.createElement("div");
  equipDiv.style.marginTop = "16px";
  equipDiv.innerHTML =
    '<h4 style="color:var(--text-muted);margin-bottom:8px;font-size:13px;">🛡️ 穿戴装备</h4>';
  const slots = [
    { key: "head", name: "头部", icon: "⛑️" },
    { key: "body", name: "身体", icon: "👕" },
    { key: "feet", name: "脚部", icon: "👟" },
    { key: "hand", name: "手部", icon: "🧤" },
    { key: "accessory", name: "配件", icon: "📿" },
  ];
  const equipGrid = document.createElement("div");
  equipGrid.className = "action-cards";
  equipGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(110px, 1fr))";
  for (const slot of slots) {
    const itemId = equip[slot.key];
    const itemDef =
      itemId && typeof ITEMS !== "undefined"
        ? ITEMS.find((i) => i.id === itemId)
        : null;
    const card = document.createElement("div");
    card.className = "action-card";
    card.innerHTML = `
      <div style="font-size:11px;color:var(--text-muted)">${slot.icon} ${slot.name}</div>
      <div style="font-size:12px;color:${itemDef ? "var(--success)" : "var(--text-muted)"}">
        ${itemDef ? itemDef.name : "(空)"}
      </div>
    `;
    equipGrid.appendChild(card);
  }
  equipDiv.appendChild(equipGrid);
  div.appendChild(equipDiv);

  parent.appendChild(div);

  // === 绑定事件（延迟执行） ===
  setTimeout(() => {
    // 背包卖出按钮
    parent.querySelectorAll(".inv-sell-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const goodId = btn.dataset.good;
        const qty = parseInt(btn.dataset.qty) || 1;
        if (typeof sellGood === "function") {
          sellGood(goodId, qty);
          renderAll();
        }
      });
    });

    // 仓库取回按钮
    parent.querySelectorAll(".storage-retrieve-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const goodId = btn.dataset.good;
        const qty = parseInt(btn.dataset.qty) || 1;
        if (typeof retrieveFromStorage === "function") {
          retrieveFromStorage(goodId, qty);
          renderAll();
        }
      });
    });
  }, 0);
}

// ====== Skills Tab ======
function renderSkillsTab(state, parent) {
  const div = document.createElement("div");
  div.innerHTML =
    '<h3 style="color:var(--text-muted);margin-bottom:12px;">📚 技能</h3>';

  const grid = document.createElement("div");
  grid.className = "action-cards";
  grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(180px, 1fr))";

  const skillNames = {
    cooking: "🍳 烹饪",
    repair: "🔧 维修",
    coding: "💻 编程",
    english: "🌐 英语",
    driving: "🚗 驾驶",
    sales: "💼 销售",
    management: "📋 管理",
    accounting: "📊 会计",
    electrician: "⚡ 电工",
    welding: "🔥 焊接",
  };

  for (const [key, skill] of Object.entries(state.skills)) {
    const card = document.createElement("div");
    card.className = "action-card";
    const name = skillNames[key] || key;
    const xpNeeded = (skill.level + 1) * 100;
    const xpPct = Math.min(100, Math.round((skill.xp / xpNeeded) * 100));
    card.innerHTML = `
      <div class="card-title">${name}</div>
      <div class="card-desc">等级 ${skill.level} / 100</div>
      <div style="margin-top:6px;height:6px;background:rgba(255,255,255,0.05);border-radius:3px;">
        <div style="width:${xpPct}%;height:100%;background:var(--accent);border-radius:3px;transition:width 0.3s"></div>
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">经验: ${skill.xp}/${xpNeeded}</div>
    `;
    grid.appendChild(card);
  }
  div.appendChild(grid);

  // 证书
  if (state.certificates.length > 0) {
    const certDiv = document.createElement("div");
    certDiv.style.marginTop = "16px";
    certDiv.innerHTML =
      '<h3 style="color:var(--text-muted);margin-bottom:8px;">📜 证书</h3>';
    const certList = document.createElement("div");
    certList.className = "flex gap-2";
    certList.style.flexWrap = "wrap";
    for (const certId of state.certificates) {
      const badge = document.createElement("span");
      badge.style.cssText =
        "padding:4px 10px;background:rgba(90,170,106,0.08);border:1px solid var(--success);border-radius:4px;font-size:11px;color:var(--success);";
      badge.textContent = certId;
      certList.appendChild(badge);
    }
    certDiv.appendChild(certList);
    div.appendChild(certDiv);
  }

  parent.appendChild(div);
}

// ====== Invest Tab（投资面板） ======
function renderInvestTab(state, parent) {
  // 安全兜底：确保 investment 数据存在（兼容旧存档）
  if (!state.investment) {
    state.investment = createDefaultState().investment;
  }
  const inv = state.investment;

  // 确保市场已初始化
  if (
    Object.keys(inv.stockMarket).length === 0 &&
    typeof initInvestmentMarket === "function"
  ) {
    initInvestmentMarket(state);
  }

  const div = document.createElement("div");
  div.innerHTML = `
    <h3 style="color:var(--text-muted);margin-bottom:12px;">💼 投资中心</h3>
  `;

  // 资产概览
  const stockValue = inv.stocks.reduce((sum, s) => {
    const market = inv.stockMarket[s.symbol];
    return sum + (market ? market.price * s.shares : 0);
  }, 0);
  const btcValue = inv.bitcoin.holdings * inv.bitcoinMarket.price;
  const propValue = inv.realEstate.reduce((sum, p) => sum + p.currentValue, 0);
  const carValue = inv.vehicles.reduce((sum, c) => sum + c.currentValue, 0);
  const totalAssets = stockValue + btcValue + propValue + carValue;

  // 概览卡片
  const overviewDiv = document.createElement("div");
  overviewDiv.className = "action-cards";
  overviewDiv.style.gridTemplateColumns =
    "repeat(auto-fill, minmax(150px, 1fr))";
  overviewDiv.innerHTML = `
    <div class="action-card">
      <div class="card-title" style="font-size:11px;color:var(--text-muted)">📈 股票市值</div>
      <div class="card-desc" style="font-size:16px;color:var(--accent)">¥${Math.round(stockValue).toLocaleString()}</div>
      <div style="font-size:10px;color:var(--text-muted)">${inv.stocks.length} 持仓</div>
    </div>
    <div class="action-card">
      <div class="card-title" style="font-size:11px;color:var(--text-muted)">₿ 比特币</div>
      <div class="card-desc" style="font-size:16px;color:var(--accent)">¥${Math.round(btcValue).toLocaleString()}</div>
      <div style="font-size:10px;color:var(--text-muted)">${inv.bitcoin.holdings.toFixed(4)} BTC</div>
    </div>
    <div class="action-card">
      <div class="card-title" style="font-size:11px;color:var(--text-muted)">🏠 房产</div>
      <div class="card-desc" style="font-size:16px;color:var(--accent)">¥${Math.round(propValue).toLocaleString()}</div>
      <div style="font-size:10px;color:var(--text-muted)">${inv.realEstate.length} 套</div>
    </div>
    <div class="action-card">
      <div class="card-title" style="font-size:11px;color:var(--text-muted)">🚗 车辆</div>
      <div class="card-desc" style="font-size:16px;color:var(--accent)">¥${Math.round(carValue).toLocaleString()}</div>
      <div style="font-size:10px;color:var(--text-muted)">${inv.vehicles.length} 辆</div>
    </div>
  `;
  div.appendChild(overviewDiv);

  // 总资产
  const totalDiv = document.createElement("div");
  totalDiv.style.cssText =
    "text-align:center;padding:12px;margin:12px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;";
  totalDiv.innerHTML = `
    <div style="font-size:12px;color:var(--text-muted);">投资总资产</div>
    <div style="font-size:24px;font-weight:bold;color:var(--success);">¥${Math.round(totalAssets).toLocaleString()}</div>
  `;
  div.appendChild(totalDiv);

  // 快速行情
  if (typeof INVEST_STOCK_LIST !== "undefined") {
    const marketDiv = document.createElement("div");
    marketDiv.style.cssText = "margin-top:12px;";
    marketDiv.innerHTML =
      '<h4 style="color:var(--text-muted);margin-bottom:8px;font-size:13px;">📊 今日行情</h4>';

    for (const stock of INVEST_STOCK_LIST) {
      const market = inv.stockMarket[stock.symbol];
      if (!market) continue;
      const price = market.price;
      const prevPrice = market.prevPrice || price;
      const changePct = (((price - prevPrice) / prevPrice) * 100).toFixed(1);
      const isUp = price >= prevPrice;
      const holding = inv.stocks.find((s) => s.symbol === stock.symbol);

      marketDiv.innerHTML += `
        <div style="display:inline-block;padding:6px 10px;margin:3px;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;font-size:11px;">
          <span style="color:var(--accent)">${stock.symbol}</span>
          <span style="color:${isUp ? "var(--success)" : "var(--danger)"};font-weight:bold;margin-left:4px;">¥${price.toFixed(1)}</span>
          <span style="color:${isUp ? "var(--success)" : "var(--danger)"};font-size:10px;margin-left:2px;">${isUp ? "▲" : "▼"}${changePct}%</span>
          ${holding ? `<span style="color:var(--text-muted);font-size:10px;margin-left:4px;">×${holding.shares}</span>` : ""}
        </div>`;
    }

    // 比特币行情
    const btc = inv.bitcoinMarket;
    const btcPrev = btc.prevPrice || btc.price;
    const btcChange = (((btc.price - btcPrev) / btcPrev) * 100).toFixed(1);
    const btcUp = btc.price >= btcPrev;
    marketDiv.innerHTML += `
      <div style="display:inline-block;padding:6px 10px;margin:3px;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;font-size:11px;">
        <span>₿ BTC</span>
        <span style="color:${btcUp ? "var(--success)" : "var(--danger)"};font-weight:bold;margin-left:4px;">¥${btc.price.toLocaleString()}</span>
        <span style="color:${btcUp ? "var(--success)" : "var(--danger)"};font-size:10px;margin-left:2px;">${btcUp ? "▲" : "▼"}${btcChange}%</span>
        ${inv.bitcoin.holdings > 0 ? `<span style="color:var(--text-muted);font-size:10px;margin-left:4px;">×${inv.bitcoin.holdings.toFixed(4)}</span>` : ""}
      </div>`;

    div.appendChild(marketDiv);
  }

  // 交易入口按钮
  const btnDiv = document.createElement("div");
  btnDiv.style.cssText = "margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;";
  btnDiv.innerHTML = `
    <button class="btn btn-primary" onclick="showInvestmentModal('stocks')" style="flex:1;min-width:100px;">📈 股票交易</button>
    <button class="btn btn-primary" onclick="showInvestmentModal('bitcoin')" style="flex:1;min-width:100px;">₿ 比特币</button>
    <button class="btn btn-primary" onclick="showInvestmentModal('realestate')" style="flex:1;min-width:100px;">🏠 房产</button>
    <button class="btn btn-primary" onclick="showInvestmentModal('vehicles')" style="flex:1;min-width:100px;">🚗 汽车</button>
  `;
  div.appendChild(btnDiv);

  // 持仓明细
  if (
    inv.stocks.length > 0 ||
    inv.bitcoin.holdings > 0 ||
    inv.realEstate.length > 0 ||
    inv.vehicles.length > 0
  ) {
    const holdingDiv = document.createElement("div");
    holdingDiv.style.cssText = "margin-top:16px;";
    holdingDiv.innerHTML =
      '<h4 style="color:var(--text-muted);margin-bottom:8px;font-size:13px;">💼 我的持仓</h4>';

    for (const s of inv.stocks) {
      const market = inv.stockMarket[s.symbol];
      const price = market ? market.price : 0;
      const pnl = Math.round((price - s.avgPrice) * s.shares);
      const pnlColor = pnl >= 0 ? "var(--success)" : "var(--danger)";
      holdingDiv.innerHTML += `
        <div style="padding:6px 10px;margin:3px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;font-size:12px;">
          📈 ${s.name} (${s.symbol}) ×${s.shares} | 均价¥${s.avgPrice.toFixed(1)} | <span style="color:${pnlColor}">${pnl >= 0 ? "+" : ""}¥${pnl.toLocaleString()}</span>
        </div>`;
    }

    if (inv.bitcoin.holdings > 0) {
      const btcPnl = Math.round(
        btcValue - inv.bitcoin.avgPrice * inv.bitcoin.holdings,
      );
      const btcPnlColor = btcPnl >= 0 ? "var(--success)" : "var(--danger)";
      holdingDiv.innerHTML += `
        <div style="padding:6px 10px;margin:3px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;font-size:12px;">
          ₿ BTC ×${inv.bitcoin.holdings.toFixed(6)} | 价值¥${Math.round(btcValue).toLocaleString()} | <span style="color:${btcPnlColor}">${btcPnl >= 0 ? "+" : ""}¥${btcPnl.toLocaleString()}</span>
        </div>`;
    }

    for (const prop of inv.realEstate) {
      const propPnl = prop.currentValue - prop.buyPrice;
      const propPnlColor = propPnl >= 0 ? "var(--success)" : "var(--danger)";
      holdingDiv.innerHTML += `
        <div style="padding:6px 10px;margin:3px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;font-size:12px;">
          🏠 ${prop.name} | 价值¥${prop.currentValue.toLocaleString()} | 月租¥${prop.monthlyRent.toLocaleString()} | <span style="color:${propPnlColor}">${propPnl >= 0 ? "+" : ""}¥${Math.round(propPnl).toLocaleString()}</span>
        </div>`;
    }

    for (const car of inv.vehicles) {
      holdingDiv.innerHTML += `
        <div style="padding:6px 10px;margin:3px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;font-size:12px;">
          🚗 ${car.name} | 当前¥${car.currentValue.toLocaleString()} | AP+${car.apBonus}
        </div>`;
    }

    div.appendChild(holdingDiv);
  }

  parent.appendChild(div);
}
function renderCorpTab(state, parent) {
  if (state.player.phase !== "corporate") {
    parent.innerHTML =
      '<p style="color:var(--text-muted);text-align:center;padding:40px;">🔒 进入职场后解锁</p>';
    return;
  }

  const c = state.corporate;
  const div = document.createElement("div");
  div.innerHTML = `
    <h3 style="color:var(--text-muted);margin-bottom:12px;">🏢 职场信息</h3>
    <div class="action-cards" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
      <div class="action-card">
        <div class="card-title">职级</div>
        <div class="card-desc" style="font-size:18px;color:var(--accent)">${c.rank}</div>
      </div>
      <div class="action-card">
        <div class="card-title">绩效历史</div>
        <div class="card-desc">${c.perfHistory.length} 次评审</div>
        <div style="font-size:10px;color:var(--text-muted)">连续C: ${c.consecutiveC}</div>
      </div>
      <div class="action-card">
        <div class="card-title">团队</div>
        <div class="card-desc">${c.team.length} 人</div>
      </div>
      <div class="action-card">
        <div class="card-title">股票</div>
        <div class="card-desc">${c.stocks?.length || 0} 持仓</div>
      </div>
    </div>
    <div style="margin-top:12px;">
      <button id="btn-view-history" class="btn btn-sm" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:var(--text);">
        📖 查看公司历史
      </button>
    </div>
  `;
  parent.appendChild(div);

  // 绑定查看历史按钮：切换到 actions tab 并展开历史面板
  setTimeout(() => {
    const btn = document.getElementById("btn-view-history");
    if (btn) {
      btn.addEventListener("click", () => {
        if (typeof showHistoryPanel !== "undefined") {
          showHistoryPanel = true;
        }
        if (typeof switchTab === "function") {
          switchTab("actions");
        }
        if (typeof renderAll === "function") {
          renderAll();
        }
      });
    }
  }, 0);
}

// ====== Achievements Tab ======
function renderAchievementsTab(state, parent) {
  const div = document.createElement("div");
  div.innerHTML =
    '<h3 style="color:var(--text-muted);margin-bottom:12px;">🏆 成就</h3>';

  // 进度概览
  const progress =
    typeof getAchievementProgress === "function"
      ? getAchievementProgress(state)
      : { total: 0, unlocked: 0, percentage: 0 };

  const overviewDiv = document.createElement("div");
  overviewDiv.style.cssText =
    "padding:12px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;margin-bottom:16px;";
  overviewDiv.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <span style="font-size:13px;color:var(--text-muted);">成就进度</span>
      <span style="font-size:13px;color:var(--accent);font-weight:bold;">${progress.unlocked}/${progress.total} (${progress.percentage}%)</span>
    </div>
    <div style="height:8px;background:rgba(255,255,255,0.05);border-radius:4px;">
      <div style="width:${progress.percentage}%;height:100%;background:var(--accent);border-radius:4px;transition:width 0.3s;"></div>
    </div>
  `;
  div.appendChild(overviewDiv);

  // 按分类显示成就
  if (
    typeof ACHIEVEMENT_CATEGORIES !== "undefined" &&
    typeof ACHIEVEMENT_DEFS !== "undefined"
  ) {
    for (const [catKey, catDef] of Object.entries(ACHIEVEMENT_CATEGORIES)) {
      const catAchievements = ACHIEVEMENT_DEFS.filter(
        (a) => a.category === catKey,
      );
      const unlockedInCat =
        state.achievements?.unlocked?.filter((a) => a.category === catKey) ||
        [];

      const catSection = document.createElement("div");
      catSection.style.cssText = "margin-bottom:16px;";
      catSection.innerHTML = `
        <h4 style="color:var(--text-muted);margin-bottom:8px;font-size:13px;">
          ${catDef.icon} ${catDef.name}
          <span style="color:var(--text-muted);font-size:11px;">(${unlockedInCat.length}/${catAchievements.length})</span>
        </h4>
      `;

      const grid = document.createElement("div");
      grid.className = "action-cards";
      grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(180px, 1fr))";

      for (const ach of catAchievements) {
        const isUnlocked = unlockedInCat.some((a) => a.id === ach.id);
        const card = document.createElement("div");
        card.className = "action-card";
        card.style.opacity = isUnlocked ? "1" : "0.5";
        card.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
              <div style="font-size:12px;color:${isUnlocked ? "var(--success)" : "var(--text-muted)"};">
                ${isUnlocked ? "✅" : "🔒"} ${ach.name}
              </div>
              <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${ach.desc}</div>
            </div>
          </div>
          ${isUnlocked ? `<div style="font-size:9px;color:var(--text-muted);margin-top:4px;">第 ${unlockedInCat.find((u) => u.id === ach.id)?.unlockedAt || "?"} 天解锁</div>` : ""}
        `;
        grid.appendChild(card);
      }
      catSection.appendChild(grid);
      div.appendChild(catSection);
    }
  }

  parent.appendChild(div);
}

/** 渲染疾病状态 */
function renderDiseases(state) {
  const el = document.getElementById("relationship-info");
  if (!el) return;

  const diseases = state.diseases?.active;
  if (!diseases || diseases.length === 0) return;

  let html =
    '<div style="margin-top:8px;"><div style="font-size:11px;color:var(--danger);margin-bottom:4px;">🏥 当前疾病</div>';

  for (const d of diseases) {
    const def =
      typeof getDisease === "function" ? getDisease(d.diseaseId) : null;
    const stage = def ? getDiseaseStage(d.diseaseId, d.severity) : null;

    const stageColor =
      d.severity >= 85
        ? "var(--danger)"
        : d.severity >= 60
          ? "#f59e0b"
          : d.severity >= 30
            ? "#fbbf24"
            : "var(--warning)";

    html += `
      <div style="display:flex;align-items:center;gap:6px;font-size:10px;margin-bottom:2px;">
        <span>${def?.icon || "🤒"}</span>
        <span style="color:var(--text);">${def?.name || d.diseaseId}</span>
        <span style="color:${stageColor};font-weight:bold;">${stage?.name || "未知"}</span>
        <span style="color:var(--text-muted);">(${d.severity}%, ${d.days}天)</span>
      </div>`;
  }

  html += "</div>";

  // 插入到关系信息之前
  el.insertAdjacentHTML("afterbegin", html);
}

/** 渲染食材库存状态 */
function renderIngredients(state) {
  const el = document.getElementById("relationship-info");
  if (!el) return;

  const summary =
    typeof getIngredientSummary === "function"
      ? getIngredientSummary(state)
      : [];
  if (!summary || summary.length === 0) return;

  let html =
    '<div style="margin-top:8px;"><div style="font-size:11px;color:var(--accent);margin-bottom:4px;">🥬 食材库存</div>';

  for (const item of summary) {
    const color = item.expired
      ? "var(--danger)"
      : item.daysLeft <= 2
        ? "#f59e0b"
        : "var(--text)";

    html += `
      <div style="display:flex;align-items:center;gap:6px;font-size:10px;margin-bottom:2px;">
        <span>${item.icon || "🥬"}</span>
        <span style="color:var(--text);">${item.name}</span>
        <span style="color:${color};font-weight:bold;">${item.qty}${item.unit}</span>
        <span style="color:var(--text-muted);">(${item.daysLeft > 0 ? item.daysLeft + "天" : "已过期"})</span>
      </div>`;
  }

  html += "</div>";

  // 插入到关系信息之前
  el.insertAdjacentHTML("afterbegin", html);
}

/** 渲染关系/恋爱信息 */
function renderMoralStatus(state) {
  const moral = state.flags.moral;
  if (!moral || !moral.actions || moral.actions.length === 0) return;

  const el = document.getElementById("moral-status");
  if (!el) return;

  const score = moral.score || 0;
  const emoji =
    typeof getMoralEmoji === "function" ? getMoralEmoji(score) : "😐";
  const level =
    typeof getMoralLevelName === "function" ? getMoralLevelName(score) : "";
  const color =
    score >= 50
      ? "var(--success)"
      : score >= 20
        ? "var(--accent)"
        : score >= -10
          ? "var(--text-secondary)"
          : score >= -40
            ? "var(--warning)"
            : "var(--danger)";

  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span>${emoji} ${level}</span>
      <span style="font-size:11px;color:${color};">${score > 0 ? "+" : ""}${score}</span>
    </div>
  `;
}

function renderRelationships(state) {
  const el = document.getElementById("relationship-info");
  if (!el) return;

  let html = "";

  // 城管关系
  if (state.relationships && state.relationships.chengguan) {
    const cg = state.relationships.chengguan;
    if (cg.met) {
      const affColor =
        cg.affinity > 20
          ? "var(--success)"
          : cg.affinity > -20
            ? "var(--warning)"
            : "var(--danger)";
      html += `<div style="margin-bottom:4px;">🚔 城管：<span style="color:${cg.affinity > 0 ? "var(--success)" : "var(--danger)"};">${cg.affinity > 0 ? "+" : ""}${cg.affinity}</span></div>`;
    }
  }

  // 恋爱/婚姻
  if (state.romance) {
    const r = state.romance;
    const statusLabels = {
      single: "单身",
      dating: "恋爱中",
      engaged: "已订婚",
      married: "已婚",
      divorced: "离异",
    };
    const statusIcons = {
      single: "💔",
      dating: "💕",
      engaged: "💍",
      married: "💒",
      divorced: "💔",
    };

    html += `<div style="margin-bottom:4px;">${statusIcons[r.relationship] || "💔"} ${statusLabels[r.relationship] || "单身"}</div>`;

    if (r.partner) {
      html += `<div style="font-size:10px;color:var(--text-muted);">${r.partner.name} · ${r.partner.personality} · ${r.partner.job}</div>`;
      html += `<div style="font-size:10px;">好感：<span style="color:${r.partner.affinity > 60 ? "var(--success)" : r.partner.affinity > 30 ? "var(--accent)" : "var(--danger)"};">${r.partner.affinity}/100</span></div>`;
    }

    if (r.relationship === "married") {
      html += `<div style="font-size:10px;color:var(--accent);">共同财产：¥${r.sharedCash || 0}</div>`;
      if (r.children && r.children.length > 0) {
        html += `<div style="font-size:10px;color:var(--text-muted);">👶 ${r.children.map((c) => c.name).join("、")}</div>`;
      }
    }
  }

  // NPC在场加成提示
  if (typeof getNpcPresenceSummary === "function") {
    const bonuses = getNpcPresenceSummary(state);
    if (bonuses.length > 0) {
      html +=
        '<div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--border);">';
      for (const b of bonuses) {
        const color = b.bonusDesc ? "var(--success)" : "var(--text-muted)";
        html += `<div style="font-size: 10px; color: ${color}; margin-bottom: 2px;">
          ${b.emoji} ${b.npcName}·${b.bonusDesc}
        </div>`;
      }
      html += "</div>";
    }
  }

  if (!html) {
    html = '<div style="color:var(--text-muted);">暂无社交关系</div>';
  }

  el.innerHTML = html;
}
