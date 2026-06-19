/**
 * 主渲染调度器
 *
 * 管理整个 UI 的渲染。使用脏标记 (dirty flag) 按需更新 DOM。
 * 渲染函数命名: render<Section>()
 */

// 当前激活的 Tab
let currentTab = "actions";

// ====== 紧凑型低数值预警 ======
/**
 * 为 stat-row 元素添加颜色匹配的紧凑预警
 * @param id - stat-row 的 DOM ID
 * @param value - 当前值
 * @param threshold - 低于此值触发预警（疲劳/风险等高即坏的值用 inverted=true）
 * @param warnColor - 预警边框和闪烁颜色（匹配该要素本身的颜色）
 * @param inverted - true 表示"高于阈值"触发预警（用于疲劳、风险）
 */
function warnStatRow(id, value, threshold, warnColor, inverted) {
  var row = document.getElementById(id);
  if (!row) return;
  var isBad = inverted ? value >= threshold : value <= threshold;
  if (isBad) {
    // 紧凑预警：薄左边框 + 极淡背景 + 无额外 padding
    row.style.cssText =
      "border-left:3px solid " +
      warnColor +
      ";" +
      "background:linear-gradient(90deg, " +
      warnColor +
      "15, transparent 40%);" +
      "padding-left:6px;margin:1px 0;border-radius:0 4px 4px 0;" +
      "transition:all 0.3s;";
    // 数值变色
    var valEl = row.querySelector(".stat-value");
    if (valEl) {
      valEl.style.color = warnColor;
      valEl.style.fontWeight = "bold";
      valEl.style.animation = "ap-blink 0.7s infinite";
    }
  } else {
    row.style.cssText = "";
    var valEl2 = row.querySelector(".stat-value");
    if (valEl2) {
      valEl2.style.color = "";
      valEl2.style.fontWeight = "";
      valEl2.style.animation = "";
    }
  }
}

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

  // 模式指示器
  var modeEl = document.getElementById("header-mode");
  var modeStat = document.getElementById("header-mode-stat");
  if (modeEl && modeStat) {
    var modeLabel = "";
    if (state.flags && state.flags._isScenarioMode) {
      modeLabel = "📜 " + (state.flags._scenarioName || "剧本模式");
    } else if (state.flags && state.flags._isSandboxMode) {
      modeLabel = "⚙️ 沙盒模式";
    }
    if (modeLabel) {
      modeEl.textContent = modeLabel;
      modeStat.style.display = "";
    } else {
      modeStat.style.display = "none";
    }
  }

  // ===== 资金（cash-label区域）：展示现金+储蓄，单资金静态/多资金温和轮播 =====
  renderFundsHeader(state);

  // ===== 债务：独立区域，单债务闪烁/多债务轮播闪烁 =====
  renderDebtHeader(state);

  // 季节显示
  var seasonEl = document.getElementById("header-season-label");
  if (seasonEl && typeof getSeason === "function") {
    var season = getSeason(p.day);
    seasonEl.textContent = season.icon + " " + season.name;
  }

  // 节日显示
  var festStat = document.getElementById("header-festival-stat");
  var festEl = document.getElementById("header-festival");
  if (festStat && festEl && typeof getCurrentFestival === "function") {
    var festival = getCurrentFestival(p.day);
    if (festival) {
      var doy = p.day % 365;
      var daysLeft = festival.startDay + festival.duration - doy;
      festEl.textContent =
        festival.icon + " " + festival.name + "（" + daysLeft + "天）";
      festStat.style.display = "";
    } else {
      festStat.style.display = "none";
    }
  }

  // 季节显示（在 header-season-label 旁边添加季节描述）
  var seasonLabel = document.getElementById("header-season-label");
  if (seasonLabel && typeof getSeasonDesc === "function") {
    var seasonDesc = getSeasonDesc(p.day);
    seasonLabel.title = seasonDesc; // 鼠标悬停显示季节描述
  }
}

/**
 * 资金头部渲染 — 展示现金+储蓄，温和滚动
 *
 * 设计参考：
 * - 大多数 (The Most)：资产负债分栏，资金整洁展示
 * - 王权 (Reigns)：资源固定独立槽位，互不干扰
 * - 中国式家长：金钱展示不带警告感，数字干净直接
 *
 * 规则：
 * - 只有现金 → 静态 "💰 ¥X,XXX"
 * - 现金+储蓄 → 温和轮播（4s切换，纯文本更新，无闪烁）
 * - 展示风格比债务低调（无闪烁、无脉冲背景）
 */
function renderFundsHeader(state) {
  var labelEl = document.getElementById("header-cash-label");
  var valueEl = document.getElementById("header-cash");
  if (!labelEl || !valueEl) return;

  var r = state.resources;
  var cash = r.cash || 0;
  var bankBalance = r.bankBalance || 0;

  // 收集资金条目
  var fundItems = [];
  fundItems.push({
    label: "💰",
    value: "¥" + cash.toLocaleString(),
    color: "var(--success)",
  });
  if (bankBalance > 0) {
    fundItems.push({
      label: "🏦",
      value: "¥" + bankBalance.toLocaleString(),
      color: "#4fc3f7",
    });
  }

  if (fundItems.length === 1) {
    // === 只有现金：静态展示（无动画） ===
    if (window._fundsCarouselTimer) {
      clearInterval(window._fundsCarouselTimer);
      window._fundsCarouselTimer = null;
    }
    labelEl.textContent = fundItems[0].label;
    valueEl.textContent = fundItems[0].value;
    valueEl.style.color = fundItems[0].color;
    valueEl.style.animation = "";
    valueEl.className = "value cash";
  } else {
    // === 现金+储蓄：温和轮播（每4s，纯文字切换，无闪烁） ===
    var areaEl = document.getElementById("header-cash-area");
    if (areaEl) {
      areaEl.className = "header-stat";
      areaEl.style.cssText = "cursor: default; min-width: 100px;";
    }

    var fundCarouselData = fundItems.map(function (f) {
      return { label: f.label, value: f.value, color: f.color };
    });

    if (!window._fundsCarouselTimer) {
      // 首次启动
      window._fundsCarouselIdx = 0;
      var f0 = fundCarouselData[0];
      labelEl.textContent = f0.label;
      valueEl.textContent = f0.value;
      valueEl.style.color = f0.color;
      valueEl.className = "value cash";

      window._fundsCarouselData = fundCarouselData;
      window._fundsCarouselTimer = setInterval(function () {
        var fdata = window._fundsCarouselData;
        if (!fdata || fdata.length <= 1) return;
        window._fundsCarouselIdx =
          (window._fundsCarouselIdx + 1) % fdata.length;
        var fnext = fdata[window._fundsCarouselIdx];
        var fl = document.getElementById("header-cash-label");
        var fv = document.getElementById("header-cash");
        if (fl) fl.textContent = fnext.label;
        if (fv) {
          fv.textContent = fnext.value;
          fv.style.color = fnext.color;
          fv.className = "value cash";
        }
      }, 4000);
    } else {
      // 定时器已存在，刷新当前项（金额可能变化）
      var idx2 = window._fundsCarouselIdx || 0;
      if (fundCarouselData[idx2]) {
        var fcur = fundCarouselData[idx2];
        labelEl.textContent = fcur.label;
        valueEl.textContent = fcur.value;
        valueEl.style.color = fcur.color;
        valueEl.className = "value cash";
      }
      window._fundsCarouselData = fundCarouselData;
    }
  }
}

/**
 * 债务头部渲染 — 现金和债务彻底分离，独立槽位
 *
 * 设计参考：
 * - 北京浮生记：债务红色独立警示，不混在资金栏
 * - 大多数 (The Most)：资产负债分栏，债务用醒目警示色
 * - 王权 (Reigns)：每种资源固定独立槽位，互不干扰
 * - 中国式家长：面子/金钱分占不同视觉区域
 *
 * 规则：
 * - 无债务 → 隐藏
 * - 单种债务 → 静态闪烁（debt-blink）
 * - 多种债务 → 轮播（3s切换）+ 每项闪烁
 */
function renderDebtHeader(state) {
  var debtArea = document.getElementById("header-debt-area");
  var debtLabel = document.getElementById("header-debt-label");
  var debtValue = document.getElementById("header-debt");
  if (!debtArea || !debtLabel || !debtValue) return;

  var r = state.resources;
  var villageDebt = r.villageDebt || r.debt || 0;
  var bankDebt = r.bankDebt || 0;

  // 收集非零债务
  var debtItems = [];
  if (villageDebt > 0) {
    debtItems.push({
      label: "🏘️ 欠村长",
      value: "¥" + villageDebt.toLocaleString(),
      color: "var(--danger)",
    });
  }
  if (bankDebt > 0) {
    debtItems.push({
      label: "🏦 欠银行",
      value: "¥" + bankDebt.toLocaleString(),
      color: "var(--warning)",
    });
  }

  if (debtItems.length === 0) {
    // 无债务 → 隐藏区块，清除计时器
    debtArea.style.display = "none";
    if (window._debtCarouselTimer) {
      clearInterval(window._debtCarouselTimer);
      window._debtCarouselTimer = null;
    }
    debtArea.className = "header-stat";
    return;
  }

  // 有债务 → 显示
  debtArea.style.display = "";

  if (debtItems.length === 1) {
    // === 只有一种债务：静态显示 + 闪烁 ===
    if (window._debtCarouselTimer) {
      clearInterval(window._debtCarouselTimer);
      window._debtCarouselTimer = null;
    }
    var item = debtItems[0];
    debtLabel.textContent = item.label;
    debtValue.textContent = item.value;
    debtValue.style.color = item.color;
    debtValue.className = "value debt single-debt-blink";
    debtArea.className = "header-stat header-debt-active";
  } else {
    // === 多种债务：轮播（3s 切换）+ 每项闪烁 ===
    debtArea.className = "header-stat header-debt-carousel-active";
    var debtCarouselData = debtItems.map(function (d) {
      return { label: d.label, value: d.value, color: d.color };
    });

    if (!window._debtCarouselTimer) {
      // 首次启动
      window._debtCarouselIdx = 0;
      var first = debtCarouselData[0];
      debtLabel.textContent = first.label;
      debtValue.textContent = first.value;
      debtValue.style.color = first.color;
      debtValue.className = "value debt carousel-debt-blink debt-fade-in";
      setTimeout(function () {
        var dv = document.getElementById("header-debt");
        if (dv) dv.className = "value debt carousel-debt-blink";
      }, 400);

      window._debtCarouselData = debtCarouselData;
      window._debtCarouselTimer = setInterval(function () {
        var data = window._debtCarouselData;
        if (!data || data.length <= 1) return;
        window._debtCarouselIdx = (window._debtCarouselIdx + 1) % data.length;
        var next = data[window._debtCarouselIdx];
        var dl = document.getElementById("header-debt-label");
        var dv = document.getElementById("header-debt");
        if (dl) dl.textContent = next.label;
        if (dv) {
          dv.textContent = next.value;
          dv.style.color = next.color;
          dv.className = "value debt carousel-debt-blink debt-fade-in";
          setTimeout(function () {
            var dv2 = document.getElementById("header-debt");
            if (dv2) dv2.className = "value debt carousel-debt-blink";
          }, 400);
        }
      }, 3000);
    } else {
      // 定时器已存在，刷新当前显示项（金额可能变化）
      var idx = window._debtCarouselIdx || 0;
      if (debtCarouselData[idx]) {
        var cur = debtCarouselData[idx];
        debtLabel.textContent = cur.label;
        debtValue.textContent = cur.value;
        debtValue.style.color = cur.color;
        debtValue.className = "value debt carousel-debt-blink";
      }
      window._debtCarouselData = debtCarouselData;
    }
  }
}

/**
 * 资金展示初始化（原现金轮播 → 现资金展示）
 * 由 renderHeader → renderFundsHeader / renderDebtHeader 自动处理；
 * 此函数保留仅用于向后兼容 main.js 的调用。
 */
function initCashCarousel() {
  // 债务展示已在 renderDebtHeader 中自动初始化，无需额外操作
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
  renderDebtInfo(state);
  renderDreamSection(state);
  renderEduSection(state);
  renderReputationBadge(state);
  renderLocation(state);
}

/** 历史声誉徽章（P2.9）—— 道德抉择积累后的身份标签 */
function renderReputationBadge(state) {
  if (typeof getHistoryModifiers !== "function") return;
  var mods = getHistoryModifiers(state);
  if (!mods.reputationLabel) {
    var el = document.getElementById("reputation-badge");
    if (el) el.style.display = "none";
    return;
  }
  var el = document.getElementById("reputation-badge");
  if (!el) {
    // 动态创建并附加到 edu-section 之后
    el = document.createElement("div");
    el.id = "reputation-badge";
    el.style.cssText =
      "margin-top:6px;padding:6px 10px;background:rgba(74,158,92,0.10);border:1px solid rgba(74,158,92,0.30);border-radius:8px;";
    var eduEl = document.getElementById("edu-section");
    if (eduEl && eduEl.parentNode) {
      eduEl.parentNode.insertBefore(el, eduEl.nextSibling);
    } else {
      return;
    }
  }
  el.style.display = "block";
  var earning =
    mods.earningsBonus > 1.0
      ? "收入+" + Math.round((mods.earningsBonus - 1) * 100) + "%"
      : "";
  var luck = mods.luckBonus > 0 ? " 幸运+" + mods.luckBonus : "";
  el.innerHTML =
    "<h3>🏅 声誉</h3>" +
    '<div style="font-size:12px;font-weight:600;color:var(--accent);">' +
    mods.reputationLabel +
    "</div>" +
    (earning || luck
      ? '<div style="font-size:11px;color:var(--text-muted);margin-top:3px;">' +
        earning +
        luck +
        "</div>"
      : "");
}

function renderEduSection(state) {
  var el = document.getElementById("edu-section");
  if (!el) return;
  var p = state.player;
  var edu = p.education ?? state.education ?? 0;
  var ep = p.eduProgress ||
    state.eduProgress || { studyPoints: 0, examsPassed: 0, totalExams: 6 };
  var eduNames = ["大专", "本科", "研究生"];
  var eduIcons = ["🎓", "📜", "🏛️"];
  el.style.display = "block";
  var label = (eduIcons[edu] || "🎓") + " " + (eduNames[edu] || "大专");
  var progressHtml = "";
  if (edu === 0) {
    var pct = Math.round((ep.examsPassed / (ep.totalExams || 6)) * 100);
    progressHtml =
      '<div style="background:var(--bg-input);border-radius:3px;height:5px;overflow:hidden;margin:4px 0;">' +
      '<div style="width:' +
      pct +
      '%;height:100%;background:var(--accent);border-radius:3px;"></div></div>' +
      '<div style="font-size:10px;color:var(--text-muted);">' +
      "备考进度：" +
      ep.examsPassed +
      "/" +
      (ep.totalExams || 6) +
      "门（学习点" +
      ep.studyPoints +
      "/150）</div>";
  }
  el.innerHTML =
    "<h3>🎓 学历</h3>" +
    '<div style="font-size:12px;font-weight:600;">' +
    label +
    "</div>" +
    progressHtml;
}

/** 梦想追踪侧边栏区块 */
function renderDreamSection(state) {
  var dreamEl = document.getElementById("dream-section");
  if (!dreamEl) return;
  if (typeof getCurrentDream !== "function") {
    dreamEl.style.display = "none";
    return;
  }
  var dream = getCurrentDream(state);
  if (!dream) {
    dreamEl.style.display = "none";
    return;
  }
  var progress =
    typeof getDreamProgress === "function" ? getDreamProgress(state) : 0;
  var curTitle =
    typeof getDreamCurrentTitle === "function"
      ? getDreamCurrentTitle(state)
      : "";
  dreamEl.style.display = "";
  dreamEl.innerHTML =
    "<h3>🌟 人生目标</h3>" +
    '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">' +
    '<span style="font-size:18px;">' +
    dream.icon +
    "</span>" +
    '<span style="font-size:12px;font-weight:600;color:var(--text-primary);">' +
    dream.name +
    "</span></div>" +
    '<div style="background:var(--bg-input);border-radius:4px;height:6px;overflow:hidden;margin-bottom:4px;">' +
    '<div style="width:' +
    progress +
    '%;height:100%;background:var(--accent);border-radius:4px;"></div>' +
    "</div>" +
    '<div style="font-size:10px;color:var(--text-muted);">' +
    progress +
    "% · " +
    curTitle +
    "</div>";
}

/** 侧边栏显示村长/银行债务 */
function renderDebtInfo(state) {
  const debtSection = document.getElementById("debt-section");
  if (!debtSection) return;
  const villageDebt = state.resources.villageDebt || 0;
  const villageInterest = state.resources.villageDebtInterest || 0;
  const bankDebt = state.resources.bankDebt || 0;
  let html = "";
  if (villageDebt > 0) {
    html += `<div style="padding:6px 10px;margin:2px 0;background:rgba(231,76,60,0.08);border-radius:4px;font-size:11px;">
      🏘️ 欠村长: <strong style="color:var(--danger);">¥${villageDebt.toLocaleString()}</strong>
      ${villageInterest > 0 ? ` <span style="color:var(--text-muted);">(利息+¥${villageInterest.toLocaleString()})</span>` : ""}
    </div>`;
  }
  if (bankDebt > 0) {
    html += `<div style="padding:6px 10px;margin:2px 0;background:rgba(243,156,18,0.08);border-radius:4px;font-size:11px;">
      🏦 欠银行: <strong style="color:var(--warning);">¥${bankDebt.toLocaleString()}</strong>
    </div>`;
  }
  debtSection.innerHTML = html;
  debtSection.style.display =
    villageDebt > 0 || bankDebt > 0 ? "block" : "none";
}

function renderStreetStats(state) {
  const p = state.player;
  setStatBar("stat-physique", p.physique, "physique");
  setStatBar("stat-intelligence", p.intelligence, "intelligence");
  setStatBar("stat-agility", p.agility, "agility");
  setStatBar("stat-mental", p.mental, "mental-bar");
  // 低数值预警（基础属性阈值=10）
  warnStatRow("stat-physique", p.physique, 10, "#c4803a");
  warnStatRow("stat-intelligence", p.intelligence, 10, "#5a8ab4");
  warnStatRow("stat-agility", p.agility, 10, "#5aaa5a");
  warnStatRow("stat-mental", p.mental, 10, "#9b74b8");
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

  // 职场属性预警：发量≤25 尊严≤15 KPI≤15 能力≤15 向上管理≤10 人缘≤15 风险≥70
  warnStatRow("stat-hair", c.hair, 25, "#7ab8d8");
  warnStatRow("stat-dignity", c.dignity, 15, "#9b74b8");
  warnStatRow("stat-kpi", c.kpi, 15, "#c9a440");
  warnStatRow("stat-ability", c.ability, 15, "#5a8ab4");
  warnStatRow("stat-upward", c.upwardMgmt, 10, "#c4803a");
  warnStatRow("stat-popularity", c.popularity, 15, "#5aaa5a");
  warnStatRow("stat-risk", c.risk, 70, "#c4553d", true); // 风险高是坏事
}

function renderNeedsBars(state) {
  const n = state.needs;
  const s = state.status;
  const p = state.player;
  setStatBar("stat-hunger", n.hunger, "hunger");
  setStatBar("stat-fatigue", n.fatigue, "fatigue");
  setStatBar("stat-hygiene", n.hygiene, "hygiene");
  setStatBar("stat-happiness", n.happiness, "happiness");
  setStatBar("stat-health", s.health, "health");
  // 名气：v1.1 起统一读 player.fame
  setStatBar("stat-fame", (p && p.fame) || 0, "fame");
  // 疾病列表（动态渲染到 stat-fame 之后）
  renderIllnessRow(state);
  // 行动力
  const apPct = (p.actionPoints / (p.maxActionPoints || 100)) * 100;
  setStatBar("stat-ap", apPct, "ap-bar");
  const apVal = document.querySelector("#stat-ap .stat-value");
  if (apVal)
    apVal.textContent = p.actionPoints + "/" + (p.maxActionPoints || 100);

  // === 紧凑型低数值预警 ===
  // 状态：饥饱≤15 疲劳≥85 卫生≤15 心情≤10 健康≤20 名气≤5
  warnStatRow("stat-hunger", n.hunger, 15, "#c9a838");
  warnStatRow("stat-fatigue", n.fatigue, 85, "#8a9080", true); // 疲劳高是坏事
  warnStatRow("stat-hygiene", n.hygiene, 15, "#4a9490");
  warnStatRow("stat-happiness", n.happiness, 10, "#cc7868");
  warnStatRow("stat-health", s.health, 20, "#cc7868");
  warnStatRow("stat-fame", (p && p.fame) || 0, 5, "#9b74b8");
  // AP≤20
  warnStatRow("stat-ap", p.actionPoints, 20, "#d49a3a");
}

function renderLocation(state) {
  const locKey = state.trade.currentLocation;
  const loc = getLocation(locKey);
  if (loc) {
    document.getElementById("location-name").textContent = loc.name;
    document.getElementById("location-desc").textContent = loc.desc;
  }

  // 天气显示
  const weather = state.weather || {};
  const weatherDef =
    typeof WEATHER_TYPES !== "undefined"
      ? WEATHER_TYPES.find((w) => w.id === weather.current)
      : null;
  const seasonDef =
    typeof SEASONS !== "undefined"
      ? SEASONS.find((s) => s.id === weather.season)
      : null;
  const locNameEl = document.getElementById("location-name");
  if (locNameEl && weatherDef && seasonDef) {
    locNameEl.innerHTML = `${loc.name} <span style="font-size:11px;color:var(--text-secondary);">${seasonDef.icon}${seasonDef.name} ${weatherDef.icon}${weatherDef.name} ${Math.round(weather.temperature || 22)}°C</span>`;
  }

  // 服务标签
  const servicesEl = document.getElementById("location-services");
  if (servicesEl) {
    const badges = getLocationServiceBadges(locKey);
    let badgeHtml = badges
      .map(
        (b) =>
          `<span style="font-size:10px;padding:2px 6px;border-radius:3px;background:${b.bg};color:${b.color};border:1px solid ${b.color};">${b.icon} ${b.label}</span>`,
      )
      .join("");
    // 客流量徽章（摆摊选址策略）
    if (
      typeof getVendingFootfallMod === "function" &&
      typeof getFootfallStars === "function" &&
      loc &&
      loc.footfall
    ) {
      const footfall = getVendingFootfallMod(locKey, state);
      const stars = getFootfallStars(footfall);
      const note = loc.vendingNote || "";
      badgeHtml +=
        `<span style="font-size:10px;padding:2px 6px;border-radius:3px;` +
        `background:rgba(74,158,92,0.1);color:var(--accent);border:1px solid rgba(74,158,92,0.3);" ` +
        `title="${note}">🧑‍🤝‍🧑 ${stars}</span>`;
    }
    if (typeof getLocationNewsBadges === "function") {
      const pulseBadges = getLocationNewsBadges(locKey, state);
      pulseBadges.forEach(function (b) {
        const color = b.positive ? "var(--success)" : "var(--warning)";
        const bg = b.positive
          ? "rgba(46,204,113,0.10)"
          : "rgba(243,156,18,0.10)";
        badgeHtml +=
          `<span style="font-size:10px;padding:2px 6px;border-radius:3px;` +
          `background:${bg};color:${color};border:1px solid ${color};" ` +
          `title="${_esc(b.tip || "")}">📰 ${_esc(b.label)}</span>`;
      });
    }
    servicesEl.innerHTML = badgeHtml;
  }

  // 附近可前往地点（仅街头阶段显示）
  const nearbySection = document.getElementById("nearby-section");
  if (nearbySection) {
    nearbySection.style.display = state.player.phase === "street" ? "" : "none";
  }
  const nearbyEl = document.getElementById("nearby-locations");
  if (nearbyEl && state.player.phase === "street") {
    const reachable = getReachableLocations(locKey);
    if (reachable.length > 0) {
      nearbyEl.innerHTML = reachable
        .map((destKey) => {
          const dest = getLocation(destKey);
          if (!dest) return "";
          const badges = getLocationServiceBadges(destKey);
          const badgeStr =
            badges.length > 0
              ? badges
                  .slice(0, 2)
                  .map((b) => `${b.icon}`)
                  .join(" ")
              : "";
          return `
          <div class="nearby-loc-item" data-dest="${destKey}"
               style="padding:6px 8px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;cursor:pointer;font-size:11px;display:flex;justify-content:space-between;align-items:center;transition:all 0.2s;"
               onmouseover="this.style.borderColor='var(--accent)';this.style.background='var(--bg-card-hover)';"
               onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg-card)';">
            <span>🚶 <strong>${dest.name}</strong> <span style="color:var(--text-muted);font-size:10px;">${dest.type === "commercial" ? "商业" : dest.type === "industrial" ? "工业" : dest.type === "residential" ? "居住" : dest.type === "service" ? "服务" : dest.type === "education" ? "教育" : dest.type === "corporate" ? "职场" : dest.type === "recreation" ? "娱乐" : dest.type === "institutional" ? "机构" : ""}</span></span>
            <span style="font-size:10px;">${badgeStr}</span>
          </div>`;
        })
        .join("");
      // 绑定点击
      setTimeout(() => {
        nearbyEl.querySelectorAll(".nearby-loc-item").forEach((item) => {
          item.addEventListener("click", () => {
            StateManager.update("trade.currentLocation", item.dataset.dest);
            const dest = getLocation(item.dataset.dest);
            StateManager.addMessage(
              `🚶 你来到了${dest ? dest.name : item.dataset.dest}。`,
              "info",
            );
            if (typeof consumeAP === "function") consumeAP(15);
            renderAll();
          });
        });
      }, 0);
    } else {
      nearbyEl.innerHTML =
        '<span style="font-size:11px;color:var(--text-muted);">没有可通行路线</span>';
    }
  }
  const HOUSING_NAMES = ["🌃 露宿街头", "🛏️ 合租床位", "🚪 单间", "🏠 一居室"];
  const houseName = HOUSING_NAMES[state.housing?.tier || 0] || HOUSING_NAMES[0];
  const houseEl = document.getElementById("housing-info");
  if (houseEl) {
    const totalCap = state.inventory.capacity;
    const itemCount = (state.inventory.items || []).reduce(
      (s, i) => s + i.qty,
      0,
    );
    const HOUSING_RENTS = [0, 12, 25, 50];
    const curRent = HOUSING_RENTS[state.housing?.tier || 0] || 0;
    houseEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span style="font-size:12px;">${houseName}</span>
        ${curRent > 0 ? `<span style="font-size:10px;color:var(--warning);">日租¥${curRent}</span>` : ""}
      </div>
      <div style="font-size:11px;color:var(--text-muted);">
        🎒 背包 ${itemCount}/${totalCap}
        ${state.housing?.storageRented ? " 📦 已租仓库" : ""}
      </div>
      ${state.housing?.tier < 3 ? `<div style="font-size:10px;color:var(--text-muted);margin-top:3px;">💡 去<strong style="color:var(--accent);">城中村</strong>可升级住所</div>` : ""}
    `;
  }
}

/** 获取地点服务标签 */
function getLocationServiceBadges(locKey) {
  const badges = [];
  const loc = getLocation(locKey);
  if (!loc) return badges;

  // 可租房
  if (locKey === "slum") {
    badges.push({
      icon: "🏠",
      label: "租房",
      bg: "rgba(74,158,92,0.1)",
      color: "#4a9e5c",
    });
  }
  // 可租仓库 & 批发
  if (locKey === "wholesaleMarket") {
    badges.push({
      icon: "📦",
      label: "仓库+批发",
      bg: "rgba(196,154,58,0.1)",
      color: "#c49a3a",
    });
  }
  // 医院
  if (locKey === "hospital") {
    badges.push({
      icon: "🏥",
      label: "看病",
      bg: "rgba(196,85,61,0.1)",
      color: "#c4553d",
    });
  }
  // 银行
  if (locKey === "bank") {
    badges.push({
      icon: "🏦",
      label: "存取款",
      bg: "rgba(90,138,180,0.1)",
      color: "#5a8ab4",
    });
  }
  // 培训
  if (locKey === "trainingCenter") {
    badges.push({
      icon: "📚",
      label: "学习考证",
      bg: "rgba(155,116,184,0.1)",
      color: "#9b74b8",
    });
  }
  // 公园
  if (locKey === "park") {
    badges.push({
      icon: "🌳",
      label: "放松",
      bg: "rgba(74,158,92,0.1)",
      color: "#4a9e5c",
    });
  }
  // 科技园
  if (locKey === "techPark") {
    badges.push({
      icon: "💼",
      label: "应聘",
      bg: "rgba(74,158,92,0.1)",
      color: "#4a9e5c",
    });
  }
  // 商业区
  if (locKey === "commercialDist") {
    badges.push({
      icon: "🛍️",
      label: "购物+摆摊",
      bg: "rgba(74,158,92,0.1)",
      color: "#4a9e5c",
    });
  }
  // 工作数量
  if (loc.jobs && loc.jobs.length > 0) {
    badges.push({
      icon: "💼",
      label: loc.jobs.length + "种工作",
      bg: "rgba(196,154,58,0.1)",
      color: "#c49a3a",
    });
  }

  return badges;
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
    } else if (btn.dataset.tab === "enterprise") {
      // 企业命运生态 — 后台系统，不单独显示Tab
      // 信息已在职场Tab的公司名旁通过 _fateTag() 显示
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
    case "map":
      renderMapTab(state, area);
      break;
    case "trade":
      renderTradeTab(state, area);
      break;
    case "inventory":
      renderInventoryTab(state, area);
      break;
    case "skills":
      if (typeof renderSkillsTab === "function") renderSkillsTab(state, area);
      else
        area.innerHTML =
          '<p style="color:var(--text-muted);text-align:center;padding:40px;">📚 技能系统加载中...</p>';
      break;
    case "corp":
      renderCorpTab(state, area);
      break;
    case "investment":
      if (typeof renderInvestmentTab === "function")
        renderInvestmentTab(state, area);
      else
        area.innerHTML =
          '<p style="color:var(--text-muted);text-align:center;padding:40px;">投资系统加载中...</p>';
      break;
    case "startup":
      if (typeof renderStartupTab === "function") renderStartupTab(state, area);
      else
        area.innerHTML =
          '<p style="color:var(--text-muted);text-align:center;padding:40px;">创业系统加载中...</p>';
      break;
    case "enterprise":
      if (typeof renderEnterpriseFateTab === "function")
        renderEnterpriseFateTab(state, area);
      else
        area.innerHTML =
          '<p style="color:var(--text-muted);text-align:center;padding:40px;">企业生态加载中...</p>';
      break;
    case "achievements":
      renderAchievementsTab(state, area);
      break;
    case "growth":
      renderGrowthTab(state, area);
      break;
    case "wiki":
      if (typeof renderWikiTab === "function") renderWikiTab(state, area);
      else
        area.innerHTML +=
          '<p style="color:var(--text-muted);text-align:center;padding:40px;">📖 百科系统加载中...</p>';
      break;
    default:
      area.innerHTML += '<p style="color:var(--text-muted)">开发中...</p>';
  }
}

// ====== Growth Tab — 委托给 data_viz.js（整合版） ======
// render.js 保留此函数作为委托入口，实际实现由 data_viz.js 提供
// 原因：data_viz.js 是专用可视化模块，架构更清晰，符合单一职责原则
function renderGrowthTab(state, parent) {
  // data_viz.js 的 renderGrowthTab 已注册为 _dataVizRenderGrowthTab
  if (
    typeof window !== "undefined" &&
    typeof window._dataVizRenderGrowthTab === "function"
  ) {
    window._dataVizRenderGrowthTab(state, parent);
  } else if (typeof renderGrowthTabDataViz === "function") {
    renderGrowthTabDataViz(state, parent);
  } else {
    parent.innerHTML =
      "<p style='color:var(--text-muted);text-align:center;padding:40px;'>📈 成长数据模块加载中...</p>";
  }
}

// ====== Inventory Tab — 物品 + 食材 + 烹饪 ======

/** 渲染物品/食材库存 Tab */
function renderInventoryTab(state, area) {
  var inv = (state.inventory = state.inventory || []);
  var cookingLevel =
    typeof getCookingLevel === "function" ? getCookingLevel(state) : 1;
  var cookingExp = state.flags._cookingExp || 0;
  var unlockedRecipes =
    typeof getRecipesByLevel === "function"
      ? getRecipesByLevel(cookingLevel)
      : [];

  // 分类物品
  var ingredients = [];
  var equipment = [];
  var others = [];

  for (var i = 0; i < inv.length; i++) {
    var item = inv[i];
    var itemDef = getItemById && getItemById(item.itemId);
    if (itemDef && itemDef.isIngredient) {
      ingredients.push({ ...item, def: itemDef });
    } else if (itemDef && itemDef.slot) {
      equipment.push({ ...item, def: itemDef });
    } else {
      others.push({ ...item, def: itemDef });
    }
  }

  // 按分类排序
  ingredients.sort(function (a, b) {
    var typeOrder = { 主食: 1, 蔬菜: 2, 肉类: 3, 调料: 4, 蛋奶: 5 };
    return (
      (typeOrder[a.def.ingredientType] || 9) -
      (typeOrder[b.def.ingredientType] || 9)
    );
  });

  var html = "";

  // === 烹饪技能面板 ===
  html +=
    '<div style="background:var(--bg-card);border-radius:8px;padding:16px;margin-bottom:16px;">';
  html +=
    '<div style="display:flex;align-items:center;justify-content:space-between;">';
  html += "<div>";
  html += '<h3 style="margin:0 0 8px 0;">🍳 烹饪系统</h3>';
  html += '<div style="font-size:13px;color:var(--text-secondary);">';
  html +=
    '烹饪等级：<strong style="color:var(--primary);">Lv.' +
    cookingLevel +
    "</strong>";
  html += "  | 经验: " + cookingExp;
  html +=
    "  | 已解锁食谱: " +
    unlockedRecipes.length +
    "/" +
    (typeof getAllRecipes === "function"
      ? getAllRecipes().length
      : COOKING_RECIPES
        ? COOKING_RECIPES.length
        : 0);
  html += "</div>";
  html += "</div>";
  html += '<div style="width:200px;">';
  // 经验进度条
  var thresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700];
  var nextThreshold =
    cookingLevel < 10
      ? thresholds[cookingLevel]
      : thresholds[thresholds.length - 1];
  var prevThreshold = cookingLevel > 1 ? thresholds[cookingLevel - 2] : 0;
  var expProgress =
    cookingLevel < 10
      ? Math.min(
          100,
          ((cookingExp - prevThreshold) / (nextThreshold - prevThreshold)) *
            100,
        )
      : 100;
  html +=
    '<div style="background:var(--bg-input);border-radius:4px;height:8px;overflow:hidden;">';
  html +=
    '<div style="background:linear-gradient(90deg, #f59e0b, #fbbf24);width:' +
    expProgress +
    '%;height:100%;"></div>';
  html += "</div>";
  html +=
    '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">';
  html +=
    cookingLevel < 10
      ? "还需 " +
        (nextThreshold - cookingExp) +
        " 经验升至 Lv." +
        (cookingLevel + 1)
      : "已达满级";
  html += "</div>";
  html += "</div>";
  html += "</div>";
  html += "</div>";

  // === 已解锁食谱 ===
  if (unlockedRecipes.length > 0) {
    html +=
      '<div style="background:var(--bg-card);border-radius:8px;padding:16px;margin-bottom:16px;">';
    html +=
      '<h4 style="margin:0 0 12px 0;">📖 已解锁食谱（Lv.' +
      cookingLevel +
      "）</h4>";
    html +=
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px;">';

    for (var i = 0; i < unlockedRecipes.length; i++) {
      var recipe = unlockedRecipes[i];
      var canCook =
        typeof canCookRecipe === "function"
          ? canCookRecipe(recipe, inv)
          : false;

      html +=
        '<div style="background:var(--bg-input);border-radius:6px;padding:10px;border-left:4px solid ' +
        (canCook ? "var(--success)" : "var(--border)") +
        '">';
      html +=
        '<div style="display:flex;justify-content:space-between;align-items:center;">';
      html +=
        '<div style="font-weight:600;">' + recipe.icon + " " + recipe.name;
      html +=
        '<span style="font-size:11px;color:var(--text-muted);margin-left:6px;">(Lv.' +
        recipe.level +
        ")</span></div>";
      if (canCook) {
        html +=
          '<button class="btn btn-sm btn-primary" onclick="doCooking(\'' +
          recipe.id +
          '\')" style="padding:2px 8px;font-size:12px;">🍳 烹饪</button>';
      } else {
        html +=
          '<span style="font-size:11px;color:var(--text-muted);">食材不足</span>';
      }
      html += "</div>";
      html +=
        '<div style="font-size:11px;color:var(--text-secondary);margin-top:4px;">' +
        recipe.desc +
        "</div>";
      html +=
        '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">';
      html += "饱食+" + recipe.hungerRestore;
      if (recipe.effects) {
        for (var key in recipe.effects) {
          if (recipe.effects.hasOwnProperty(key) && key !== "health") {
            html += " | " + key + ":" + recipe.effects[key];
          }
        }
      }
      html += "</div>";
      html +=
        '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">';
      html +=
        "所需食材: " +
        recipe.ingredients
          .map(function (ing) {
            var itemDef = getItemById && getItemById(ing.itemId);
            return (
              (itemDef ? itemDef.icon : "") +
              ing.amount +
              (itemDef ? " " + itemDef.name : "")
            );
          })
          .join(", ");
      html += "</div>";
      html += "</div>";
    }

    html += "</div>";
    html += "</div>";
  }

  // === 食材库存 ===
  if (ingredients.length > 0) {
    html +=
      '<div style="background:var(--bg-card);border-radius:8px;padding:16px;margin-bottom:16px;">';
    html +=
      '<h4 style="margin:0 0 12px 0;">🥬 食材库存（' +
      ingredients.length +
      " 种）</h4>";

    // 按分类分组显示
    var categories = {};
    for (var i = 0; i < ingredients.length; i++) {
      var cat = ingredients[i].def.ingredientType || "其他";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(ingredients[i]);
    }

    for (var cat in categories) {
      html += '<div style="margin-bottom:12px;">';
      html +=
        '<div style="font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:6px;">';
      html += cat + " (" + categories[cat].length + "种)";
      html += "</div>";
      html +=
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:6px;">';

      for (var j = 0; j < categories[cat].length; j++) {
        var item = categories[cat][j];
        html +=
          '<div style="background:var(--bg-input);border-radius:4px;padding:6px 8px;font-size:13px;display:flex;justify-content:space-between;align-items:center;">';
        html += "<span>" + (item.def.icon || "📦") + " " + item.def.name;
        html +=
          '<span style="color:var(--text-muted);font-size:11px;">(保鲜' +
          item.def.perishDays +
          "天)</span>";
        html += "</span>";
        html +=
          '<span style="font-weight:600;color:var(--primary);">×' +
          item.quantity +
          "</span>";
        html += "</div>";
      }

      html += "</div>";
      html += "</div>";
    }

    html += "</div>";
  } else {
    html +=
      '<div style="background:var(--bg-card);border-radius:8px;padding:16px;margin-bottom:16px;">';
    html += '<h4 style="margin:0 0 12px 0;">🥬 食材库存</h4>';
    html +=
      '<p style="color:var(--text-muted);">暂无食材。前往市场购买食材，然后在家做饭或手动烹饪。</p>';
    html += "</div>";
  }

  // === 其他物品 ===
  if (equipment.length > 0 || others.length > 0) {
    html +=
      '<div style="background:var(--bg-card);border-radius:8px;padding:16px;">';
    html += '<h4 style="margin:0 0 12px 0;">🎒 其他物品</h4>';

    if (equipment.length > 0) {
      html += '<div style="margin-bottom:12px;">';
      html +=
        '<div style="font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:6px;">装备</div>';
      html +=
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:6px;">';
      for (var i = 0; i < equipment.length; i++) {
        var item = equipment[i];
        html +=
          '<div style="background:var(--bg-input);border-radius:4px;padding:6px 8px;font-size:13px;display:flex;justify-content:space-between;align-items:center;">';
        html +=
          "<span>" + (item.def.icon || "📦") + " " + item.def.name + "</span>";
        html +=
          '<span style="font-weight:600;color:var(--primary);">×' +
          item.quantity +
          "</span>";
        html += "</div>";
      }
      html += "</div>";
      html += "</div>";
    }

    if (others.length > 0) {
      html += "<div>";
      html +=
        '<div style="font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:6px;">其他</div>';
      html +=
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:6px;">';
      for (var i = 0; i < others.length; i++) {
        var item = others[i];
        html +=
          '<div style="background:var(--bg-input);border-radius:4px;padding:6px 8px;font-size:13px;display:flex;justify-content:space-between;align-items:center;">';
        html +=
          "<span>" + (item.def.icon || "📦") + " " + item.def.name + "</span>";
        html +=
          '<span style="font-weight:600;color:var(--primary);">×' +
          item.quantity +
          "</span>";
        html += "</div>";
      }
      html += "</div>";
      html += "</div>";
    }

    html += "</div>";
  }

  area.innerHTML = html;
}

/** 执行烹饪（由 UI 按钮调用）*/
function doCooking(recipeId) {
  var state = StateManager.getState();
  if (typeof cookRecipe !== "function") {
    StateManager.addMessage("🍳 烹饪系统未加载", "warning");
    return;
  }

  var result = cookRecipe(state, recipeId);
  if (result.success) {
    // 记录烹饪经验
    if (typeof onCookingCompleted === "function") {
      onCookingCompleted(state, result.recipe);
    }
    // 刷新界面
    if (typeof renderInventoryTab === "function") {
      renderInventoryTab(state, document.getElementById("content-area"));
    }
    // 刷新 header
    if (typeof updateHeaderStats === "function") {
      updateHeaderStats(state);
    }
  } else {
    StateManager.addMessage("🍳 " + result.message, "warning");
  }
}
