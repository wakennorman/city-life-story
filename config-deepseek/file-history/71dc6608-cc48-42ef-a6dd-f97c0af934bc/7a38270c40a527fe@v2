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
  renderMoralStatus(state);
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

/** 道德状态显示 */
function renderMoralStatus(state) {
  var moral = state.flags.moral;
  if (!moral || !moral.actions || moral.actions.length === 0) return;
  var score = moral.score || 0;
  var el = document.getElementById("moral-status");
  if (!el) {
    el = document.createElement("div");
    el.id = "moral-status";
    el.style.cssText = "font-size:11px;margin-bottom:4px;margin-top:-4px;";
    var dreamEl = document.getElementById("dream-section");
    var parent = dreamEl ? dreamEl.parentNode : null;
    if (parent) parent.insertBefore(el, dreamEl ? dreamEl.nextSibling : null);
    else return;
  }
  var emoji = typeof getMoralEmoji === "function" ? getMoralEmoji(score) : "😐";
  var level =
    typeof getMoralLevelName === "function" ? getMoralLevelName(score) : "";
  var color =
    score >= 50
      ? "var(--success)"
      : score >= 20
        ? "var(--accent)"
        : score >= -10
          ? "var(--text-secondary)"
          : score >= -40
            ? "var(--warning)"
            : "var(--danger)";
  el.innerHTML =
    emoji +
    " " +
    level +
    " <span style='color:" +
    color +
    ";font-weight:bold;'>(" +
    (score > 0 ? "+" : "") +
    score +
    ")</span>";
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
    } else if (btn.dataset.tab === "startup") {
      // 创业Tab：注册了公司才显示
      if (
        !state.startup ||
        state.startup.status === "none" ||
        !state.startup.company
      ) {
        btn.style.display = "none";
      } else {
        btn.style.display = "";
      }
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

// ====== Growth Tab — 委托到 data_viz.js 新版 ======
function renderGrowthTab(state, parent) {
  if (typeof _dataVizRenderGrowthTab === "function") {
    _dataVizRenderGrowthTab(state, parent);
    return;
  }
  parent.innerHTML = "";
  var p = state.player;
  var wrapper = document.createElement("div");
  wrapper.style.cssText = "padding:12px;";

  // ---- 1. 资产曲线 ----
  var chartSection = document.createElement("div");
  chartSection.style.cssText =
    "background:var(--bg-card);border-radius:8px;padding:14px;margin-bottom:12px;border:1px solid var(--border);";
  chartSection.innerHTML =
    '<h3 style="margin:0 0 10px;font-size:13px;color:var(--text-primary);">📈 资产变化曲线</h3>';

  var lineCanvas = document.createElement("canvas");
  lineCanvas.width = 520;
  lineCanvas.height = 160;
  lineCanvas.style.cssText = "width:100%;height:auto;display:block;";
  chartSection.appendChild(lineCanvas);
  wrapper.appendChild(chartSection);

  // ---- 2. 属性雷达图 ----
  var radarSection = document.createElement("div");
  radarSection.style.cssText =
    "background:var(--bg-card);border-radius:8px;padding:14px;margin-bottom:12px;border:1px solid var(--border);display:flex;gap:16px;align-items:flex-start;";

  var radarInfo = document.createElement("div");
  radarInfo.style.cssText = "flex:1;min-width:0;";
  radarInfo.innerHTML =
    '<h3 style="margin:0 0 10px;font-size:13px;color:var(--text-primary);">🕸️ 能力雷达图</h3>';
  var radarCanvas = document.createElement("canvas");
  radarCanvas.width = 200;
  radarCanvas.height = 200;
  radarCanvas.style.cssText =
    "width:100%;max-width:200px;height:auto;display:block;margin:0 auto;";
  radarInfo.appendChild(radarCanvas);
  radarSection.appendChild(radarInfo);

  // 属性说明
  var statSummary = document.createElement("div");
  statSummary.style.cssText = "flex:1;min-width:0;padding-top:28px;";
  var stats = [
    { label: "体质", value: p.physique, color: "#c4803a" },
    { label: "智力", value: p.intelligence, color: "#5a8ab4" },
    { label: "敏捷", value: p.agility, color: "#5aaa5a" },
    { label: "心智", value: p.mental, color: "#9b74b8" },
    { label: "名气", value: (p && p.fame) || 0, color: "#d4a017" },
  ];
  stats.forEach(function (s) {
    var row = document.createElement("div");
    row.style.cssText =
      "display:flex;align-items:center;gap:6px;margin-bottom:6px;";
    row.innerHTML =
      '<span style="width:32px;font-size:11px;color:var(--text-muted);">' +
      s.label +
      "</span>" +
      '<div style="flex:1;height:5px;background:var(--bg-input);border-radius:3px;overflow:hidden;">' +
      '<div style="width:' +
      Math.min(100, s.value) +
      "%;height:100%;background:" +
      s.color +
      ';border-radius:3px;"></div>' +
      "</div>" +
      '<span style="width:24px;font-size:11px;color:var(--text-secondary);text-align:right;">' +
      s.value +
      "</span>";
    statSummary.appendChild(row);
  });
  radarSection.appendChild(statSummary);
  wrapper.appendChild(radarSection);

  // ---- 3. 今日简报 ----
  var briefSection = document.createElement("div");
  briefSection.style.cssText =
    "background:var(--bg-card);border-radius:8px;padding:14px;border:1px solid var(--border);";
  var totalAsset =
    (state.resources.cash || 0) + (state.resources.bankBalance || 0);
  var debt =
    (state.resources.villageDebt || state.resources.debt || 0) +
    (state.resources.bankDebt || 0);
  briefSection.innerHTML =
    '<h3 style="margin:0 0 10px;font-size:13px;color:var(--text-primary);">📊 我的数字</h3>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;">' +
    _growthStat("📅 游戏天数", "第" + p.day + "天") +
    _growthStat("🎂 当前年龄", p.age + "岁") +
    _growthStat("💰 总资产", "¥" + totalAsset.toLocaleString()) +
    _growthStat(
      "🏦 银行存款",
      "¥" + (state.resources.bankBalance || 0).toLocaleString(),
    ) +
    (debt > 0
      ? _growthStat("💸 总负债", "¥" + debt.toLocaleString(), "#c4553d")
      : "") +
    _growthStat(
      "🏅 成就数",
      ((state.flags && state.flags._unlockedAchievements) || []).length + "个",
    ) +
    _growthStat(
      "🌟 梦想进度",
      typeof getDreamProgress === "function"
        ? getDreamProgress(state) + "%"
        : "未设定",
    ) +
    (state.trade && state.trade.totalProfit
      ? _growthStat(
          "📦 贸易总利润",
          "¥" + (state.trade.totalProfit || 0).toLocaleString(),
        )
      : "") +
    "</div>";
  wrapper.appendChild(briefSection);

  // ---- 4. NPC 人际关系面板 ----
  if (typeof NPCS !== "undefined" && state.relationships) {
    var npcSection = document.createElement("div");
    npcSection.style.cssText =
      "background:var(--bg-card);border-radius:8px;padding:14px;margin-top:12px;border:1px solid var(--border);";
    var npcHtml =
      '<h3 style="margin:0 0 10px;font-size:13px;color:var(--text-primary);">🤝 人际关系</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;">';
    NPCS.forEach(function (npc) {
      var rel = state.relationships[npc.id];
      if (!rel || !rel.met) return;
      var aff = rel.affinity || 0;
      var affLabel =
        typeof getAffinityLabel === "function" ? getAffinityLabel(aff) : "";
      var deepDone = !!(state.flags && state.flags["_npcDeepTask_" + npc.id]);
      var favorDone = !!(state.flags && state.flags["_npcFavor_" + npc.id]);
      var bar = Math.min(100, Math.max(0, aff));
      var barColor = aff >= 70 ? "#4caf50" : aff >= 40 ? "#ff9800" : "#2196f3";
      npcHtml +=
        '<div style="background:var(--bg-input);border-radius:6px;padding:8px;border:1px solid var(--border);">' +
        '<div style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:4px;">' +
        _esc(npc.name) +
        " " +
        affLabel +
        "</div>" +
        '<div style="background:var(--bg-card);border-radius:3px;height:4px;overflow:hidden;margin-bottom:4px;">' +
        '<div style="width:' +
        bar +
        "%;height:100%;background:" +
        barColor +
        ';transition:width 0.3s;"></div>' +
        "</div>" +
        '<div style="font-size:10px;color:var(--text-muted);">' +
        (favorDone ? "✅ 委托完成 " : "⬜ 委托未完 ") +
        (deepDone ? "💌 深度对话" : aff >= 70 ? "💌 可对话" : "") +
        "</div>" +
        "</div>";
    });
    npcHtml += "</div>";
    npcSection.innerHTML = npcHtml;
    wrapper.appendChild(npcSection);
  }

  parent.appendChild(wrapper);

  // ---- 绘制图表（DOM插入后） ----
  setTimeout(function () {
    var history = (state.flags && state.flags._cashHistory) || [];
    drawAssetLineChart(lineCanvas, history);

    // 使用新的data_viz雷达图（支持职场属性）
    if (typeof drawRadarChart === "function") {
      drawRadarChart(
        radarCanvas.getContext("2d"),
        state,
        0,
        0,
        radarCanvas.width,
        radarCanvas.height,
        p.phase,
      );
    } else {
      drawRadarChart(
        radarCanvas,
        [
          p.physique,
          p.intelligence,
          p.agility,
          p.mental,
          Math.min(100, (p && p.fame) || 0),
        ],
        ["体质", "智力", "敏捷", "心智", "名气"],
        100,
      );
    }

    // 如果有收入/支出历史，绘制收入曲线
    if (typeof drawIncomeChart === "function") {
      var incomeSection2 = document.createElement("div");
      incomeSection2.style.cssText =
        "background:var(--bg-card);border-radius:8px;padding:14px;margin-bottom:12px;border:1px solid var(--border);";
      incomeSection2.innerHTML =
        '<h3 style="margin:0 0 10px;font-size:13px;color:var(--text-primary);">💰 收入/支出曲线</h3>';
      var incomeCanvas = document.createElement("canvas");
      incomeCanvas.width = 520;
      incomeCanvas.height = 160;
      incomeCanvas.style.cssText = "width:100%;height:auto;display:block;";
      incomeSection2.appendChild(incomeCanvas);
      wrapper.insertBefore(incomeSection2, wrapper.firstChild);

      setTimeout(function () {
        var ctx = incomeCanvas.getContext("2d");
        drawIncomeChart(
          ctx,
          state,
          0,
          0,
          incomeCanvas.width,
          incomeCanvas.height,
        );
      }, 10);
    }

    // 如果有技能成长历史，绘制技能成长图
    if (typeof drawSkillGrowthChart === "function") {
      var skills = state.skills || {};
      var skillKeys = Object.keys(skills);
      if (skillKeys.length > 0) {
        var skillSection = document.createElement("div");
        skillSection.style.cssText =
          "background:var(--bg-card);border-radius:8px;padding:14px;margin-bottom:12px;border:1px solid var(--border);";
        skillSection.innerHTML =
          '<h3 style="margin:0 0 10px;font-size:13px;color:var(--text-primary);">📚 技能成长</h3>';

        var skillSelect = document.createElement("select");
        skillSelect.style.cssText =
          "margin-bottom:12px;padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-size:13px;background:var(--bg-primary);";
        var skillNames = {
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
        skillKeys.forEach(function (k) {
          var opt = document.createElement("option");
          opt.value = k;
          opt.textContent =
            skillNames[k] || k + " (Lv." + (skills[k].level || 0) + ")";
          if (skills[k].history && skills[k].history.length > 0) {
            opt.selected = true;
          }
          skillSelect.appendChild(opt);
        });
        skillSection.appendChild(skillSelect);

        var skillCanvas = document.createElement("canvas");
        skillCanvas.width = 520;
        skillCanvas.height = 160;
        skillCanvas.style.cssText = "width:100%;height:auto;display:block;";
        skillSection.appendChild(skillCanvas);
        wrapper.appendChild(skillSection);

        function renderSkillChart(sk) {
          var ctx = skillCanvas.getContext("2d");
          ctx.clearRect(0, 0, skillCanvas.width, skillCanvas.height);
          drawSkillGrowthChart(
            ctx,
            state,
            0,
            0,
            skillCanvas.width,
            skillCanvas.height,
            sk,
          );
        }

        renderSkillChart(skillSelect.value);

        skillSelect.addEventListener("change", function () {
          renderSkillChart(this.value);
        });
      }
    }
  }, 30);
}

function _growthStat(label, value, color) {
  return (
    '<div style="background:var(--bg-input);border-radius:6px;padding:8px;text-align:center;">' +
    '<div style="font-size:10px;color:var(--text-muted);margin-bottom:2px;">' +
    label +
    "</div>" +
    '<div style="font-size:13px;font-weight:700;color:' +
    (color || "var(--text-primary)") +
    ';">' +
    value +
    "</div>" +
    "</div>"
  );
}

/** 资产折线图 (Canvas) */
function drawAssetLineChart(canvas, data) {
  var ctx = canvas.getContext("2d");
  var W = canvas.width,
    H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  var pad = { t: 18, r: 10, b: 24, l: 52 };
  var cw = W - pad.l - pad.r,
    ch = H - pad.t - pad.b;

  if (!data || data.length < 2) {
    ctx.fillStyle = "#aaa";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("数据积累中（每天结束后记录一次）", W / 2, H / 2);
    return;
  }

  var values = data.map(function (d) {
    return d.value;
  });
  var maxV = Math.max.apply(null, values) * 1.15 || 1000;
  var minV = Math.min(0, Math.min.apply(null, values) * 0.9);

  function tx(i) {
    return pad.l + (i / (data.length - 1)) * cw;
  }
  function ty(v) {
    return pad.t + (1 - (v - minV) / (maxV - minV)) * ch;
  }

  // Grid & Y-axis labels
  ctx.font = "9px sans-serif";
  ctx.textAlign = "right";
  for (var g = 0; g <= 4; g++) {
    var gy = pad.t + (g / 4) * ch;
    ctx.strokeStyle = "rgba(0,0,0,0.07)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.l, gy);
    ctx.lineTo(W - pad.r, gy);
    ctx.stroke();
    var lv = maxV - (g / 4) * (maxV - minV);
    ctx.fillStyle = "#999";
    ctx.fillText(
      "¥" + (lv >= 1000 ? (lv / 1000).toFixed(1) + "k" : Math.round(lv)),
      pad.l - 4,
      gy + 3,
    );
  }

  // Area fill
  ctx.beginPath();
  ctx.moveTo(tx(0), ty(data[0].value));
  data.forEach(function (d, i) {
    ctx.lineTo(tx(i), ty(d.value));
  });
  ctx.lineTo(tx(data.length - 1), pad.t + ch);
  ctx.lineTo(tx(0), pad.t + ch);
  ctx.closePath();
  ctx.fillStyle = "rgba(74,158,92,0.12)";
  ctx.fill();

  // Line
  ctx.beginPath();
  data.forEach(function (d, i) {
    if (i === 0) ctx.moveTo(tx(0), ty(d.value));
    else ctx.lineTo(tx(i), ty(d.value));
  });
  ctx.strokeStyle = "#4a9e5c";
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.stroke();

  // Last point dot
  var last = data[data.length - 1];
  ctx.beginPath();
  ctx.arc(tx(data.length - 1), ty(last.value), 4, 0, Math.PI * 2);
  ctx.fillStyle = "#4a9e5c";
  ctx.fill();

  // X-axis day labels
  var step = Math.max(1, Math.ceil(data.length / 7));
  ctx.textAlign = "center";
  ctx.fillStyle = "#aaa";
  data.forEach(function (d, i) {
    if (i % step === 0 || i === data.length - 1) {
      ctx.fillText("D" + d.day, tx(i), H - 5);
    }
  });
}

/** 属性雷达图 (Canvas) */
function drawRadarChart(canvas, values, labels, maxVal) {
  var ctx = canvas.getContext("2d");
  var W = canvas.width,
    H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  var cx = W / 2,
    cy = H / 2;
  var r = Math.min(cx, cy) - 28;
  var n = values.length;
  var colors = ["#c4803a", "#5a8ab4", "#5aaa5a", "#9b74b8", "#d4a017"];

  function pt(i, radius) {
    var angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  }

  // Grid rings
  [0.25, 0.5, 0.75, 1.0].forEach(function (f) {
    ctx.beginPath();
    for (var i = 0; i < n; i++) {
      var p = pt(i, r * f);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(0,0,0,0.09)";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Axis lines
  for (var i = 0; i < n; i++) {
    var ep = pt(i, r);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ep.x, ep.y);
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Data polygon
  ctx.beginPath();
  values.forEach(function (v, i) {
    var p = pt(i, r * Math.min(v / maxVal, 1));
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(74,158,92,0.18)";
  ctx.fill();
  ctx.strokeStyle = "#4a9e5c";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Data points
  values.forEach(function (v, i) {
    var dp = pt(i, r * Math.min(v / maxVal, 1));
    ctx.beginPath();
    ctx.arc(dp.x, dp.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = colors[i] || "#4a9e5c";
    ctx.fill();
  });

  // Labels
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  labels.forEach(function (lbl, i) {
    var lp = pt(i, r + 16);
    ctx.fillStyle = colors[i] || "#666";
    ctx.fillText(lbl, lp.x, lp.y);
  });
}

function renderTimeSlot(state, parent) {
  const slotNames = {
    morning: "☀️ 上午",
    afternoon: "🌤️ 下午",
    evening: "🌙 晚上",
  };
  const slot = state.player.timeSlot;
  const div = document.createElement("div");
  div.id = "time-slot-indicator";
  const ap = state.player.actionPoints || 0;
  const maxAp = state.player.maxActionPoints || 100;
  // 低AP闪烁警告（≤30时加CSS闪烁动画）
  const lowAp = ap <= 20 && ap > 0;
  const apColor =
    ap > 50 ? "var(--success)" : ap > 20 ? "var(--warning)" : "var(--danger)";
  div.style.cssText = `display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--bg-card);border-radius:8px;margin-bottom:8px;${lowAp ? "border:2px solid var(--warning);box-shadow:0 0 12px rgba(196,154,58,0.35);animation:ap-blink-border 1.5s infinite;" : "border:1px solid var(--border);"}`;
  div.innerHTML = `
    <span>📅 第 <strong>${state.player.day}</strong> 天</span>
    <span>|</span>
    <span class="time-slot-badge ${slot}">${slotNames[slot]}</span>
    <span style="font-size:11px;margin-left:8px;">
      ⚡ <strong style="color:${apColor};${lowAp ? "animation: ap-blink 0.8s infinite;" : ""}">${ap}</strong>/${maxAp}
      ${lowAp ? ` <span style="font-size:10px;color:var(--warning);animation:ap-blink 0.8s infinite;">⚠仅剩${ap}点</span>` : ""}
    </span>
    <span style="margin-left:auto;font-size:11px;color:var(--text-muted)">
      ${state.player.phase === "corporate" ? `Q${state.player.corpQuarter}` : ""}
    </span>
  `;
  parent.appendChild(div);
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

  var intelList = (state.flags && state.flags._activeIntel) || [];
  var today = state.player ? state.player.day : 1;
  for (var ii = 0; ii < intelList.length; ii++) {
    var intel = intelList[ii];
    if (intel.expireDay < today) continue;
    var daysLeft = Math.max(0, intel.triggerDay - today);
    var intelBanner = document.createElement("div");
    intelBanner.className = "news-banner";
    intelBanner.style.background = "rgba(255, 193, 7, 0.12)";
    intelBanner.style.borderColor = "rgba(255, 193, 7, 0.35)";
    intelBanner.textContent =
      "🗞️ " +
      intel.sourceName +
      "的风声：" +
      intel.text +
      "（约" +
      daysLeft +
      "天后，可信度" +
      intel.confidence +
      "%）";
    parent.appendChild(intelBanner);
  }
}

// ====== Actions Tab ======
function _esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 根据当前状态生成若干条行动建议（数量由心智决定） */
function getDailyActionTips(state) {
  var urgent = []; // 紧急（最前）
  var tips = []; // 普通建议
  var p = state.player;
  var needs = state.needs || {};
  var loc = state.trade && state.trade.currentLocation;
  var day = p.day;
  var dayOfWeek = day % 7;
  var mental = p.mental || 0;
  var cash = (state.resources && state.resources.cash) || 0;
  var bankBalance = (state.resources && state.resources.bankBalance) || 0;

  // ===== 紧急警示（无心智门槛，任何时候都显示）=====

  // NPC生日置顶
  if (typeof NPCS !== "undefined") {
    var dayOfYear = ((day - 1) % 365) + 1;
    for (var i = 0; i < NPCS.length; i++) {
      var npc = NPCS[i];
      if (npc.birthday === dayOfYear) {
        var rel = state.relationships && state.relationships[npc.id];
        if (rel && rel.met) {
          urgent.push(
            "🎂 今天是" + _esc(npc.name) + "的生日！送礼好感×2，快去找ta！",
          );
          break;
        }
      }
    }
  }
  // 里程碑
  if (day === 29)
    urgent.push("🌟 明天就是第30天！准备迎接一个重要的人生节点。");
  if (day === 59) urgent.push("🌟 明天就是第60天里程碑，回顾一下自己的成长。");
  if (day === 89) urgent.push("🌟 明天就是第90天！这是城市生涯的重要转折点。");

  // 需求警示（基础层，无门槛）
  if (needs.hunger <= 15)
    urgent.push("🍚 饥饱极低！再不吃东西会晕倒，先找食物！");
  else if (needs.hunger <= 30) tips.push("🍚 饥饱不足，记得先吃顿饭再干活。");
  if (needs.fatigue >= 90)
    urgent.push("😴 体力耗尽！今天必须休息，否则健康会受损。");
  else if (needs.fatigue >= 75)
    tips.push("😴 太疲惫了，今天多休息，明天效率更高。");
  if (needs.hygiene <= 10)
    urgent.push("🚿 卫生告急！形象太差会影响工作收入，快去洗澡。");
  else if (needs.hygiene <= 25)
    tips.push("🚿 卫生偏低，找个地方洗洗澡保持状态。");

  // 健康警示
  var health = (state.status && state.status.health) || 100;
  if (health <= 30) urgent.push("🏥 健康危险！立刻去诊所看病，否则可能倒下！");
  else if (health <= 50)
    tips.push("🏥 健康偏低，今天注意休息，考虑去诊所检查。");
  if (state.status && state.status.sick)
    tips.push("🤒 你生病了，户外工作效率下降，药和休息是最好的选择。");

  // 财务警示
  var villageDebt =
    (state.resources &&
      (state.resources.villageDebt || state.resources.debt)) ||
    0;
  var bankDebt = (state.resources && state.resources.bankDebt) || 0;
  if (cash < 30 && day > 3)
    urgent.push("💸 现金见底！今天必须打工，否则连饭都吃不上。");
  else if (cash < 100 && day > 5)
    tips.push("💸 现金快用完了，今天务必赚点钱补充。");
  if (villageDebt > 0 && day % 10 === 0)
    tips.push("🏘️ 村长贷款日息0.35%，欠款越久越多，有钱就去还一点。");

  // ===== 基础层建议（mental≥0，所有人可见）=====

  // 天气
  if (state.weather) {
    var wid = state.weather.weatherId || state.weather.type;
    if (wid === "rainy" || wid === "storm" || wid === "thunderstorm") {
      tips.push("🌧️ 今天下雨，室内工作（工厂/理发/摆摊室内）比户外更合适。");
    } else if (wid === "sunny" || wid === "clear") {
      if (typeof getVendingFootfallMod === "function") {
        var mod = getVendingFootfallMod(loc, state);
        if (mod > 1.2) tips.push("☀️ 天气晴好，客流量高，今天摆摊收益不错！");
      }
    } else if (wid === "heatwave" || wid === "hot") {
      tips.push("🥵 高温天气，多备点水，户外劳动注意防暑。");
    } else if (wid === "coldwave" || wid === "blizzard") {
      tips.push("🧊 寒潮来袭，厚衣物和泡面很畅销，可以考虑囤货出售。");
    }
  }

  // 周期
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    tips.push("🛍️ 今天是周末！公园/商业区客流翻倍，去摆摊能多赚一笔。");
  }
  if (dayOfWeek === 1) {
    tips.push("📋 周一新起点！去工地/工业区打听零工机会，有时会有意外收获。");
  }

  if (typeof getCityPulseTips === "function") {
    var pulseTips = getCityPulseTips(state, mental >= 60 ? 4 : 2);
    for (var pti = 0; pti < pulseTips.length; pti++) {
      tips.push(pulseTips[pti]);
    }
  }

  if (typeof getActiveIntelTips === "function") {
    var intelTips = getActiveIntelTips(state, mental >= 70 ? 3 : 1);
    for (var iti = 0; iti < intelTips.length; iti++) {
      tips.push(intelTips[iti]);
    }
  }

  // 季节/节日提示（P1.8）
  if (typeof getCurrentFestival === "function") {
    var festNow = getCurrentFestival(day);
    if (festNow) {
      var doyFest = ((day - 1) % 365) + 1;
      var daysLeftFest = festNow.startDay + festNow.duration - doyFest;
      // 节日限定工作提示
      if (typeof FESTIVAL_JOBS !== "undefined" && FESTIVAL_JOBS[festNow.id]) {
        var fjNames = FESTIVAL_JOBS[festNow.id]
          .map(function (fj) {
            return fj.name;
          })
          .join("、");
        tips.push(
          festNow.icon +
            " " +
            festNow.name +
            "限定工作开放（还剩" +
            daysLeftFest +
            "天）：" +
            fjNames +
            "，收入比平时高！",
        );
      } else {
        tips.push(
          festNow.icon +
            " " +
            festNow.name +
            "期间（还剩" +
            daysLeftFest +
            "天），心情加成中，去看看有没有特别的机会。",
        );
      }
    } else {
      // 节日倒计时：提前3天预警
      var doyNow = ((day - 1) % 365) + 1;
      if (typeof FESTIVALS !== "undefined") {
        for (var fi = 0; fi < FESTIVALS.length; fi++) {
          var upcoming = FESTIVALS[fi];
          var daysUntil = upcoming.startDay - doyNow;
          if (daysUntil > 0 && daysUntil <= 3) {
            tips.push(
              upcoming.icon +
                " 距离" +
                upcoming.name +
                "还有" +
                daysUntil +
                "天！提前准备相关商品或攒AP。",
            );
            break;
          }
        }
      }
    }
    // 季节建议
    if (typeof getCurrentSeason === "function") {
      var season = getCurrentSeason(day);
      if (season.id === "summer") {
        tips.push("☀️ 夏季高温，饮料/防暑物资好卖，户外劳动记得防暑。");
      } else if (season.id === "winter") {
        tips.push("❄️ 冬季寒冷，保暖衣物/热食需求旺盛，可以考虑相关进货。");
      } else if (season.id === "spring") {
        tips.push("🌸 春季万物复苏，体力恢复略快，是积累技能的好时机。");
      } else if (season.id === "autumn") {
        tips.push("🍂 秋收时节，市场上农产品充裕，进货成本更低。");
      }
    }
  }

  // 属性警示/解锁
  var physique = p.physique || 0;
  var intelligence = p.intelligence || 0;
  var agility = p.agility || 0;
  if (physique < 15)
    tips.push(
      "💪 体质过低（" +
        physique +
        "），负重上限不足15kg，今天先养生休息补体力。",
    );
  if (physique >= 50 && !(state.flags && state.flags._tipPhysique50))
    tips.push("💪 体质达到50！可以挑战重体力工作，收入更高。");
  if (intelligence >= 40 && !(state.flags && state.flags._tipInt40))
    tips.push("📚 智力达到40！编程技能现在可以更高效地学习。");
  if (agility >= 40 && loc === "market")
    tips.push("⚡ 敏捷够高，在批发市场讨价还价更有优势！");

  // 技能快升级提示
  if (state.skills) {
    var skillLabels = {
      sales: "销售",
      cooking: "烹饪",
      repair: "修理",
      fitness: "体能",
      coding: "编程",
    };
    for (var sk in state.skills) {
      var s2 = state.skills[sk];
      if (s2 && s2.xp !== undefined && s2.maxXp !== undefined) {
        var pct = s2.maxXp > 0 ? s2.xp / s2.maxXp : 0;
        if (pct >= 0.85 && pct < 1) {
          var label = skillLabels[sk] || sk;
          tips.push(
            "⬆️ " +
              label +
              "技能快升级了（" +
              Math.round(pct * 100) +
              "%），再努力一下！",
          );
          break; // 每次最多提一个技能
        }
      }
    }
  }

  // 工地特殊机会
  if (loc === "school" && intelligence >= 25) {
    tips.push("📚 在大学城，可以接编程外包单，收入不错。");
  }
  if (loc === "construction" && state.flags && state.flags.bossLiReferred) {
    tips.push("🏗️ 李工头已推荐你，可以申请正规工程队，工资大幅提升！");
  }

  // 学历备考提示
  var eduProgress = p.eduProgress || state.eduProgress;
  var currentEducation = p.education ?? state.education ?? 0;
  if (eduProgress && currentEducation === 0 && eduProgress.examsPassed < 6) {
    var pctEdu = Math.round((eduProgress.examsPassed / 6) * 100);
    if (eduProgress.studyPoints > 0 || eduProgress.examsPassed > 0) {
      tips.push(
        "🎓 自考本科备考进度：" +
          pctEdu +
          "%（" +
          eduProgress.examsPassed +
          "/6门已通过），去大学城继续备考！",
      );
    } else if (day > 20) {
      tips.push("🎓 提升学历能解锁更好的工作！去大学城可以参加自考本科备考。");
    }
  }

  // ===== 中级建议（mental≥30）=====
  if (mental >= 30) {
    // 银行存款建议（提高到1万门槛）
    if (cash > 10000 && bankBalance === 0) {
      tips.push("🏦 现金超过1万，去银行存一些，每天收利息，钱生钱更稳健！");
    } else if (cash > 50000) {
      tips.push(
        "🏦 现金充裕，除了银行存款，也可以考虑低风险的贵金属投资分散风险。",
      );
    }

    // 市场事件+位置联动
    if (
      state.trade &&
      state.trade.marketEvents &&
      state.trade.marketEvents.length > 0
    ) {
      var ev = state.trade.marketEvents[0];
      if (ev.remaining > 0) {
        if (loc === ev.locKey || !ev.locKey) {
          tips.push(
            "📊 市场活动：" +
              ev.name +
              " 还剩" +
              ev.remaining +
              "天，" +
              (ev.priceMod > 1
                ? "价格偏高，适合出货！"
                : "价格偏低，适合进货！"),
          );
        }
      }
    }

    // 库存提示：背包快满
    if (typeof calcEncumbrance === "function") {
      var enc = calcEncumbrance(state);
      if (enc.ratio > 0.85) {
        tips.push(
          "🎒 背包快满了（" +
            Math.round(enc.ratio * 100) +
            "%），今天优先出货减轻负重。",
        );
      }
    }
  }

  // ===== 进阶建议（mental≥60，投资/新闻联动）=====
  if (mental >= 60) {
    // 新闻联动投资建议
    var activeNews = state.activeNews || [];
    for (var ni = 0; ni < activeNews.length; ni++) {
      var hl = activeNews[ni].headline || "";
      if (/房地产|楼市|房价/.test(hl)) {
        tips.push(
          "🏠 新闻：" +
            _esc(
              hl
                .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
                .trim()
                .slice(0, 20),
            ) +
            "…→房产投资有压力，工地收入也可能受影响，谨慎操作。",
        );
        break;
      } else if (/科技|电子|数码/.test(hl)) {
        tips.push(
          "💻 新闻：" +
            _esc(
              hl
                .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
                .trim()
                .slice(0, 20),
            ) +
            "…→科技板块利好，电子股和科技园工作值得关注。",
        );
        break;
      } else if (/通胀|物价|涨价/.test(hl)) {
        tips.push(
          "📈 物价上涨信号——现金贬值，考虑将闲钱存银行或买入贵金属保值。",
        );
        break;
      } else if (/比特币|加密|虚拟币/.test(hl)) {
        tips.push("₿ 加密市场有消息，近期波动可能加大，持仓注意风险。");
        break;
      } else if (/股市|大盘|暴跌/.test(hl)) {
        tips.push("📉 股市下行消息——持股注意止损，现金为王比贸然抄底更稳。");
        break;
      } else if (/废品|金属|回收/.test(hl)) {
        tips.push("♻️ 废金属/废品价格有动向，今天拾荒或出售废品收益可能更高。");
        break;
      } else if (/城管|执法/.test(hl)) {
        tips.push("🚨 城管严查消息！今天摆摊风险高，选好地点或改做室内工作。");
        break;
      }
    }

    // 投资持仓收益提示
    var inv = state.investment;
    if (inv && inv.stockHoldings && inv.stockHoldings.length > 0) {
      var bestStock = null,
        bestPct = 0;
      for (var hi = 0; hi < inv.stockHoldings.length; hi++) {
        var h2 = inv.stockHoldings[hi];
        var mkt = inv.stockMarket && inv.stockMarket[h2.symbol];
        if (mkt && h2.avgPrice > 0) {
          var gainPct = (mkt.price - h2.avgPrice) / h2.avgPrice;
          if (gainPct > bestPct) {
            bestPct = gainPct;
            bestStock = h2.symbol;
          }
        }
      }
      if (bestStock && bestPct > 0.15) {
        tips.push(
          "📊 持仓" +
            bestStock +
            "已涨" +
            Math.round(bestPct * 100) +
            "%，可以考虑分批止盈。",
        );
      }
    }
  }

  // ===== 精准建议（mental≥80）=====
  if (mental >= 80) {
    // 精确的差价机会提示
    if (typeof calcFinalPrice === "function" && state.trade) {
      var locs2 = [
        "slum",
        "market",
        "construction",
        "school",
        "mall",
        "tech_park",
      ];
      var curLoc = loc;
      var GOODS2 = typeof GOODS !== "undefined" ? GOODS : [];
      var bestProfit = 0,
        bestGoodName = "";
      for (var gi = 0; gi < GOODS2.length && gi < 6; gi++) {
        var g = GOODS2[gi];
        var minP = 9999,
          maxP = 0;
        for (var li2 = 0; li2 < locs2.length; li2++) {
          var pp = calcFinalPrice(state, locs2[li2], g.id);
          if (pp < minP) minP = pp;
          if (pp > maxP) maxP = pp;
        }
        var profit = maxP - minP;
        if (profit > bestProfit) {
          bestProfit = profit;
          bestGoodName = g.name;
        }
      }
      if (bestProfit > 20) {
        tips.push(
          "💡 今日最佳差价：" +
            bestGoodName +
            " 地区差价约¥" +
            Math.round(bestProfit) +
            "，低价地进货再去高价地出售。",
        );
      }
    }

    // 资产配置建议
    var totalAssets = cash + bankBalance;
    var inv2 = state.investment;
    if (inv2) {
      var stockVal = 0;
      for (var hi2 = 0; hi2 < (inv2.stockHoldings || []).length; hi2++) {
        var h3 = inv2.stockHoldings[hi2];
        var m3 = inv2.stockMarket && inv2.stockMarket[h3.symbol];
        if (m3) stockVal += m3.price * h3.shares;
      }
      var propVal = 0;
      for (var pi2 = 0; pi2 < (inv2.properties || []).length; pi2++) {
        propVal +=
          inv2.properties[pi2].currentPrice ||
          inv2.properties[pi2].buyPrice ||
          0;
      }
      totalAssets += stockVal + propVal;
      if (stockVal > totalAssets * 0.6) {
        tips.push(
          "⚖️ 股票仓位占资产" +
            Math.round((stockVal / totalAssets) * 100) +
            "%，集中度偏高，适当分散到现金或房产。",
        );
      }
    }
  }

  return urgent.concat(tips);
}

function renderActionsTab(state, parent) {
  const actions = getAvailableActions(state);

  // === 地点氛围描写（每日轮换，让城市有生命感）===
  if (typeof getLocationFlavor === "function") {
    var locId = state.trade && state.trade.currentLocation;
    var flavorText = getLocationFlavor(locId, state.player.day);
    if (flavorText) {
      var flavorBox = document.createElement("div");
      flavorBox.style.cssText =
        "margin-bottom:12px;padding:9px 12px;background:rgba(255,255,255,0.03);border-left:3px solid var(--border);border-radius:0 6px 6px 0;color:var(--text-muted);font-size:12px;font-style:italic;line-height:1.5;";
      flavorBox.textContent = flavorText;
      parent.appendChild(flavorBox);
    }
  }

  // === 今日智能建议（心智驱动，不限数量，滚动展示）===
  {
    var tips = getDailyActionTips(state);
    if (tips.length > 0) {
      var tipBox = document.createElement("div");
      tipBox.style.cssText =
        "margin-bottom:14px;padding:10px 12px;background:rgba(74,158,92,0.06);border:1px solid rgba(74,158,92,0.25);border-radius:8px;";
      var mental = (state.player && state.player.mental) || 0;
      var mentalTag =
        mental >= 80
          ? "🧠 专家洞察"
          : mental >= 60
            ? "💡 进阶建议"
            : "💡 今日建议";
      // 标题行（静态文字，safe to innerHTML）
      var titleDiv = document.createElement("div");
      titleDiv.style.cssText =
        "font-size:10px;color:var(--accent);font-weight:700;margin-bottom:6px;letter-spacing:0.5px;";
      titleDiv.innerHTML =
        mentalTag +
        ' <span style="font-size:9px;color:var(--text-muted);font-weight:400;">（心智' +
        mental +
        "）</span>";
      tipBox.appendChild(titleDiv);
      // 建议列表（用 textContent 避免 XSS）
      var listDiv = document.createElement("div");
      listDiv.style.cssText =
        "max-height:110px;overflow-y:auto;padding-right:2px;";
      tips.forEach(function (t) {
        var item = document.createElement("div");
        item.style.cssText =
          "font-size:12px;color:var(--text-secondary);padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.04);";
        item.textContent = t;
        listDiv.appendChild(item);
      });
      tipBox.appendChild(listDiv);
      parent.appendChild(tipBox);
    }
  }

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

      // 服务标签
      const badges =
        typeof getLocationServiceBadges === "function"
          ? getLocationServiceBadges(destKey)
          : [];
      const badgeStr =
        badges.length > 0
          ? badges
              .map(
                (b) =>
                  `<span style="font-size:9px;padding:2px 5px;border-radius:3px;background:${b.bg};color:${b.color};border:1px solid ${b.color};">${b.icon} ${b.label}</span>`,
              )
              .join(" ")
          : "";

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
        "linear-gradient(135deg, var(--bg-card), rgba(0,180,216,0.05))";
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
        ${badgeStr ? `<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:3px;">${badgeStr}</div>` : ""}
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

  // === 🏠 住所/仓储区域（醒目） ===
  if (housingActions.length > 0) {
    const houseSection = document.createElement("div");
    houseSection.style.cssText =
      "margin-bottom:16px;padding:12px;background:rgba(243,156,18,0.05);border:1px solid rgba(243,156,18,0.2);border-radius:var(--radius-md);";
    houseSection.innerHTML =
      '<h3 style="color:var(--warning);margin-bottom:8px;font-size:14px;">🏠 住所 & 仓储 — 提升生活质量</h3>';
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
      ${action.apCost ? `<span class="ap-cost">⚡${action.apCost}</span>` : ""}
      ${action.payEstimate ? `<span class="pay-estimate">💰 ¥${action.payEstimate}</span>` : ""}
      ${action.costEstimate ? `<span class="cost-estimate">💸 ¥${action.costEstimate}</span>` : ""}
      ${action.reqFail ? `<span class="req-fail">⚠ ${action.reqFail}</span>` : ""}
    </div>
    ${action.payTags && action.payTags.length > 0 ? `<div style="font-size:9px;color:var(--accent);margin-top:2px;letter-spacing:0.5px;">${action.payTags.join(" ")}</div>` : ""}
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

// ====== Map Tab =====
function renderMapTab(state, parent) {
  const locKey = state.trade.currentLocation;
  const loc = getLocation(locKey);
  const reachable = new Set(getReachableLocations(locKey));
  reachable.add(locKey);

  const container = document.createElement("div");
  container.style.cssText = "display:flex;flex-direction:column;gap:16px;";

  // 标题
  const title = document.createElement("div");
  title.innerHTML = `
    <h3 style="color:var(--text-muted);margin-bottom:4px;">🗺️ 城市地图</h3>
    <p style="font-size:12px;color:var(--text-secondary);">
      当前在 <strong style="color:var(--accent);">${loc ? loc.name : "未知"}</strong> — 点击地点直接前往（仅显示已探索的相邻地点可到达的）
    </p>
  `;
  container.appendChild(title);

  // === ⭐ 快速出行置顶区（解决"地图没了"问题） ===
  const reachableList = Array.from(reachable).filter((k) => k !== locKey);
  if (reachableList.length > 0) {
    const quick = document.createElement("div");
    quick.style.cssText =
      "padding:14px;background:linear-gradient(135deg, var(--bg-card), rgba(0,180,216,0.08));border:1px solid var(--accent);border-radius:var(--radius-md);";
    quick.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <h4 style="color:var(--accent);margin:0;font-size:14px;">🚶 快速出行</h4>
        <span style="font-size:10px;color:var(--text-muted);">从 ${loc ? loc.name : "当前位置"} 出发</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;">
    `;
    for (const destKey of reachableList) {
      const dest = getLocation(destKey);
      if (!dest) continue;
      const destType =
        dest.type === "commercial"
          ? "🛒商业"
          : dest.type === "industrial"
            ? "🏭工业"
            : dest.type === "residential"
              ? "🏘️居住"
              : dest.type === "service"
                ? "🏥服务"
                : dest.type === "education"
                  ? "📚教育"
                  : dest.type === "corporate"
                    ? "🏢职场"
                    : dest.type === "recreation"
                      ? "🌳休闲"
                      : dest.type === "institutional"
                        ? "🏫机构"
                        : "📍其他";
      quick.innerHTML += `
        <button class="quick-travel-btn" data-dest="${destKey}" style="
          padding:10px 12px;
          background:var(--bg-secondary);
          border:1px solid var(--border);
          border-radius:6px;
          cursor:pointer;
          text-align:left;
          color:var(--text-primary);
          font-size:12px;
          transition:all 0.15s;
        " onmouseover="this.style.borderColor='var(--accent)';this.style.background='rgba(0,180,216,0.06)';"
           onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg-secondary)';">
          <div style="font-weight:600;color:var(--accent);">📍 ${dest.name}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${destType}</div>
          <div style="font-size:10px;color:var(--text-secondary);margin-top:2px;line-height:1.3;">${dest.desc}</div>
        </button>
      `;
    }
    quick.innerHTML += "</div>";
    container.appendChild(quick);
  }

  // 城市地图 — 使用 CSS Grid 布局，按地理关系排列
  const mapWrap = document.createElement("div");
  mapWrap.className = "city-map";
  mapWrap.style.cssText =
    "position:relative;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;min-height:500px;overflow:auto;";

  // 地图网格（用绝对定位模拟地理位置）
  const mapGrid = document.createElement("div");
  mapGrid.style.cssText = "position:relative;width:100%;min-height:460px;";

  // 地点坐标映射（百分比定位）
  const positions = {
    techPark: { x: 65, y: 5 },
    commercialDist: { x: 58, y: 22 },
    wholesaleMarket: { x: 28, y: 18 },
    construction: { x: 70, y: 38 },
    factoryZone: { x: 35, y: 40 },
    hospital: { x: 78, y: 30 },
    slum: { x: 30, y: 55 },
    bank: { x: 12, y: 50 },
    park: { x: 50, y: 62 },
    school: { x: 42, y: 72 },
    trainingCenter: { x: 55, y: 85 },
  };

  // SVG连线
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.style.cssText =
    "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;";
  mapGrid.appendChild(svg);

  // 延迟绘制连线（需要等节点渲染后获取位置）
  const drawConnections = () => {
    svg.innerHTML = "";
    const mapRect = mapGrid.getBoundingClientRect();
    for (const [from, toList] of Object.entries(TRAVEL_GRAPH)) {
      const fromEl = mapGrid.querySelector(`[data-map-loc="${from}"]`);
      if (!fromEl) continue;
      for (const to of toList) {
        const toEl = mapGrid.querySelector(`[data-map-loc="${to}"]`);
        if (!toEl) continue;
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        const x1 = fromRect.left + fromRect.width / 2 - mapRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - mapRect.top;
        const x2 = toRect.left + toRect.width / 2 - mapRect.left;
        const y2 = toRect.top + toRect.height / 2 - mapRect.top;
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "rgba(0,180,216,0.2)");
        line.setAttribute("stroke-width", "1.5");
        line.setAttribute("stroke-dasharray", "4,3");
        svg.appendChild(line);
      }
    }
  };

  // 检查从当前位置可达的地点（reachable 已在函数开头声明并填充，此处复用）

  // 放置节点
  for (const [key, pos] of Object.entries(positions)) {
    const mapLoc = getLocation(key);
    if (!mapLoc) continue;
    const badges = getLocationServiceBadges(key);
    const badgeStr =
      badges.length > 0
        ? badges
            .map(
              (b) =>
                `<span style="font-size:9px;padding:1px 4px;border-radius:2px;background:${b.bg};color:${b.color};">${b.icon}${b.label}</span>`,
            )
            .join(" ")
        : "";
    const isCurrent = key === locKey;
    const isReachable = reachable.has(key);
    const canTravel = isReachable && !isCurrent;

    const node = document.createElement("div");
    node.className = "map-node";
    node.dataset.mapLoc = key;
    node.style.cssText = `
      position:absolute; left:${pos.x}%; top:${pos.y}%;
      transform:translate(-50%,-50%);
      padding:8px 12px;
      background:${isCurrent ? "linear-gradient(135deg, rgba(0,180,216,0.3), var(--bg-card))" : "var(--bg-card)"};
      border:2px solid ${isCurrent ? "var(--accent)" : isReachable ? "var(--border-light)" : "rgba(255,255,255,0.06)"};
      border-radius:8px;
      cursor:${canTravel ? "pointer" : isCurrent ? "default" : "not-allowed"};
      z-index:2;
      transition:all 0.2s;
      opacity:${isReachable ? 1 : 0.35};
      min-width:80px;
      text-align:center;
      box-shadow:${isCurrent ? "0 0 16px rgba(0,180,216,0.3)" : "none"};
    `;
    node.innerHTML = `
      <div style="font-size:12px;font-weight:600;color:${isCurrent ? "var(--accent)" : "var(--text-primary)"};margin-bottom:2px;">
        ${isCurrent ? "📍 " : ""}${mapLoc.name}
      </div>
      <div style="font-size:9px;color:var(--text-muted);margin-bottom:3px;">${mapLoc.type === "commercial" ? "🛒商业" : mapLoc.type === "industrial" ? "🏭工业" : mapLoc.type === "residential" ? "🏘️居住" : mapLoc.type === "service" ? "🏥服务" : mapLoc.type === "education" ? "📚教育" : mapLoc.type === "corporate" ? "🏢职场" : mapLoc.type === "recreation" ? "🌳休闲" : mapLoc.type === "institutional" ? "🏫机构" : ""}</div>
      <div style="display:flex;flex-wrap:wrap;gap:2px;justify-content:center;">${badgeStr}</div>
      ${canTravel ? '<div style="font-size:9px;color:var(--accent);margin-top:4px;">👆 点击前往</div>' : ""}
      ${!isReachable && !isCurrent ? '<div style="font-size:9px;color:var(--text-muted);margin-top:2px;">🔒 未探索</div>' : ""}
    `;

    if (canTravel) {
      node.addEventListener("mouseenter", () => {
        node.style.borderColor = "var(--accent)";
        node.style.boxShadow = "0 0 12px rgba(0,180,216,0.3)";
        node.style.transform = "translate(-50%,-50%) scale(1.05)";
      });
      node.addEventListener("mouseleave", () => {
        node.style.borderColor = "var(--border-light)";
        node.style.boxShadow = "none";
        node.style.transform = "translate(-50%,-50%) scale(1)";
      });
      node.addEventListener("click", () => {
        StateManager.update("trade.currentLocation", key);
        const dest = getLocation(key);
        StateManager.addMessage(
          `🚶 你来到了${dest ? dest.name : key}。`,
          "info",
        );
        if (typeof consumeAP === "function") consumeAP(15);
        renderAll();
      });
    }

    mapGrid.appendChild(node);
  }

  mapWrap.appendChild(mapGrid);
  container.appendChild(mapWrap);

  // 图例
  const legend = document.createElement("div");
  legend.style.cssText =
    "display:flex;gap:16px;flex-wrap:wrap;font-size:11px;color:var(--text-muted);padding:8px 0;";
  legend.innerHTML = `
    <span>🟦 蓝框 = 当前位置</span>
    <span>⬜ 亮框 = 可前往</span>
    <span>🔒 暗色 = 未探索</span>
    <span>🏠 绿标 = 可租房</span>
    <span>📦 橙标 = 仓库/批发</span>
    <span>🏥 红标 = 医院</span>
  `;
  container.appendChild(legend);

  // 地点速查表
  const quickTable = document.createElement("div");
  quickTable.innerHTML =
    '<h4 style="color:var(--text-muted);margin-bottom:8px;">📍 地点速查表</h4>';
  const table = document.createElement("div");
  table.style.cssText =
    "display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px;";
  for (const [key, mapLoc] of Object.entries(LOCATIONS)) {
    const badges = getLocationServiceBadges(key);
    const badgeStr =
      badges.length > 0
        ? badges
            .map(
              (b) =>
                `<span style="font-size:9px;padding:1px 4px;border-radius:2px;background:${b.bg};color:${b.color};">${b.icon}${b.label}</span>`,
            )
            .join(" ")
        : "";
    const canReach = reachable.has(key);
    const isCur = key === locKey;
    table.innerHTML += `
      <div style="padding:8px 10px;background:var(--bg-card);border:1px solid ${isCur ? "var(--accent)" : canReach ? "var(--border)" : "rgba(255,255,255,0.04)"};border-radius:6px;font-size:11px;opacity:${canReach ? 1 : 0.4};">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="color:${isCur ? "var(--accent)" : "var(--text-primary)"};">${isCur ? "📍 " : ""}${mapLoc.name}</strong>
          <span style="font-size:9px;color:var(--text-muted);">${mapLoc.type === "commercial" ? "商业" : mapLoc.type === "industrial" ? "工业" : mapLoc.type === "residential" ? "居住" : mapLoc.type === "service" ? "服务" : mapLoc.type === "education" ? "教育" : mapLoc.type === "corporate" ? "职场" : mapLoc.type === "recreation" ? "休闲" : mapLoc.type === "institutional" ? "机构" : ""}</span>
        </div>
        <div style="margin-top:2px;color:var(--text-secondary);font-size:10px;">${mapLoc.desc}</div>
        ${badgeStr ? `<div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:2px;">${badgeStr}</div>` : ""}
      </div>`;
  }
  quickTable.appendChild(table);
  container.appendChild(quickTable);

  parent.appendChild(container);

  // 绑定快速出行按钮
  setTimeout(() => {
    document.querySelectorAll(".quick-travel-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const destKey = btn.dataset.dest;
        StateManager.update("trade.currentLocation", destKey);
        const dest = getLocation(destKey);
        StateManager.addMessage(
          `🚶 你来到了${dest ? dest.name : destKey}。`,
          "info",
        );
        if (typeof consumeAP === "function") consumeAP(15);
        renderAll();
      });
    });
  }, 0);

  // 延迟绘制 SVG 连线
  setTimeout(drawConnections, 100);
  // 再绘制一次确保
  setTimeout(drawConnections, 500);
}

// ====== Trade Tab ======
function renderTradeTab(state, parent) {
  const locKey = state.trade.currentLocation;
  const loc = getLocation(locKey);
  const prices = state.trade.goodsPrices[locKey] || {};
  const isWholesale = locKey === "wholesaleMarket";
  const goodsList = typeof GOODS !== "undefined" ? GOODS : [];

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

  // 节日价格提示横幅
  if (typeof getFestivalPriceNote === "function") {
    var festNote = getFestivalPriceNote(state);
    if (festNote) {
      var festBanner = document.createElement("div");
      festBanner.style.cssText =
        "background:rgba(196,85,61,0.08);border:1px solid rgba(196,85,61,0.2);border-radius:6px;" +
        "padding:6px 10px;margin-bottom:12px;font-size:12px;color:#c4553d;";
      festBanner.textContent = festNote;
      parent.appendChild(festBanner);
    }
  }

  // 季节性价格波动提示横幅
  if (typeof getSeasonalPriceMod === "function") {
    var seasonMods = getSeasonalPriceMod(state);
    if (Object.keys(seasonMods).length > 0) {
      var hotBuy = [];
      var hotSell = [];
      var CATEGORY_NAMES_TRADE = {
        daily: "日用品",
        luxury: "奢侈品",
        food: "食品",
        clothing: "服装",
        electronics: "电子",
        scrap: "废品",
      };
      for (var cat in seasonMods) {
        var catName = CATEGORY_NAMES_TRADE[cat] || cat;
        if (seasonMods[cat] < 0.9) {
          hotBuy.push(catName);
        } else if (seasonMods[cat] > 1.1) {
          hotSell.push(catName);
        }
      }
      if (hotBuy.length > 0 || hotSell.length > 0) {
        var seasonBanner = document.createElement("div");
        seasonBanner.style.cssText =
          "background:rgba(102,126,234,0.08);border:1px solid rgba(102,126,234,0.2);border-radius:6px;" +
          "padding:6px 10px;margin-bottom:12px;font-size:12px;color:#667eea;";
        var seasonTxt = [];
        if (hotBuy.length > 0) {
          seasonTxt.push("🟢 进货好时机：" + hotBuy.join("、") + "降价中");
        }
        if (hotSell.length > 0) {
          seasonTxt.push("🔴 卖出好时机：" + hotSell.join("、") + "涨价中");
        }
        seasonBanner.textContent = seasonTxt.join(" | ");
        parent.appendChild(seasonBanner);
      }
    }
  }

  if (goodsList.length === 0) {
    parent.innerHTML +=
      '<p style="color:var(--text-muted)">商品数据加载中...</p>';
    return;
  }

  // 背包中的商品（方便快速卖出）
  const ownedGoods = state.inventory.items || [];
  if (ownedGoods.length > 0) {
    const ownedDiv = document.createElement("div");
    ownedDiv.style.marginBottom = "16px";
    ownedDiv.innerHTML =
      '<h4 style="color:var(--text-muted);margin-bottom:8px;">🎒 背包中的商品（可卖出）</h4>';
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

    // 季节性价格标签
    var seasonTag = "";
    if (typeof getSeasonalPriceMod === "function") {
      var cat = good.category;
      var seasonMod = getSeasonalPriceMod(state)[cat];
      if (seasonMod && seasonMod < 0.85) {
        seasonTag =
          '<span style="color:var(--success);font-size:10px;margin-left:8px;">🟢 季节性低价</span>';
      } else if (seasonMod && seasonMod > 1.15) {
        seasonTag =
          '<span style="color:var(--danger);font-size:10px;margin-left:8px;">🔴 季节性高价</span>';
      }
    }

    const card = document.createElement("div");
    card.className = "action-card";
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div class="card-title" style="margin:0;">${good.name}</div>
        <span class="slot-tag">${{ daily: "日用品", luxury: "奢侈品", food: "食品", clothing: "服装", electronics: "电子", scrap: "废品" }[good.category] || good.category}</span>
        ${seasonTag}
      </div>
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

// ====== Inventory Tab ======
function renderInventoryTab(state, parent) {
  parent.innerHTML = "";
  const div = document.createElement("div");
  div.innerHTML = `
    <h3 style="color:var(--text-muted);margin-bottom:12px;">🎒 物品栏
      <span style="font-size:11px;color:var(--text-muted)">
        (${state.inventory.items.length}/${state.inventory.capacity})
      </span>
    </h3>
  `;

  const items = state.inventory.items;
  if (items.length === 0) {
    div.innerHTML += '<p style="color:var(--text-muted)">背包空空如也</p>';
  } else {
    const grid = document.createElement("div");
    grid.className = "inventory-grid";
    for (const item of items) {
      const def =
        typeof ITEMS !== "undefined"
          ? ITEMS.find((i) => i.id === item.id)
          : null;
      const el = document.createElement("div");
      el.className = "inventory-item";
      el.innerHTML = `
        <div class="item-name">${def ? def.name : item.id}</div>
        <div class="item-qty">数量: ${item.qty}</div>
        ${def ? `<div class="item-effects">${describeItemEffects(def)}</div>` : ""}
      `;
      grid.appendChild(el);
    }
    div.appendChild(grid);
  }

  // 装备栏
  const equip = state.inventory.equipment;
  const equipDiv = document.createElement("div");
  equipDiv.style.marginTop = "16px";
  var equipTitle = document.createElement("h3");
  equipTitle.style.cssText = "color:var(--text-muted);margin-bottom:4px;";
  equipTitle.textContent = "🛡️ 装备";
  equipDiv.appendChild(equipTitle);
  // 购买地点引导提示
  var equipHint = document.createElement("div");
  equipHint.style.cssText =
    "font-size:10px;color:var(--text-muted);margin-bottom:8px;padding:4px 8px;background:rgba(255,255,255,0.03);border-radius:4px;";
  equipHint.textContent =
    "购买地点：劳保/工具→批发市场 | 服装→商业区 | 电子→商业区/科技园 | 书本→大学城";
  equipDiv.appendChild(equipHint);
  const slots = [
    { key: "head", name: "头部", icon: "⛑️" },
    { key: "body", name: "身体", icon: "👕" },
    { key: "feet", name: "脚部", icon: "👟" },
    { key: "hand", name: "手部", icon: "🧤" },
    { key: "accessory", name: "配件", icon: "📿" },
  ];
  const equipGrid = document.createElement("div");
  equipGrid.className = "action-cards";
  equipGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(130px, 1fr))";
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
}

// ====== Skills Tab ======
function renderSkillsTab(state, parent) {
  parent.innerHTML = "";
  var div = document.createElement("div");
  div.innerHTML =
    '<h3 style="color:var(--text-muted);margin-bottom:12px;">📚 技能 <span style="font-size:11px;color:var(--accent);">⚡15+💰¥50 = 训练一次</span></h3>';

  var grid = document.createElement("div");
  grid.className = "action-cards";
  grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";

  var skillNames = {
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
  var skillNamesCache = skillNames;

  var skillKeys = Object.keys(state.skills);
  for (var ki = 0; ki < skillKeys.length; ki++) {
    var key = skillKeys[ki];
    var skill = state.skills[key];
    var name = skillNames[key] || key;
    var xpNeeded = (skill.level + 1) * 100;
    var xpPct = Math.min(100, Math.round((skill.xp / xpNeeded) * 100));

    // 工作解锁检查
    var unlockedJobs = [];
    if (typeof STREET_JOBS !== "undefined") {
      for (var ji = 0; ji < STREET_JOBS.length; ji++) {
        var j = STREET_JOBS[ji];
        if (
          j.requirements &&
          j.requirements[key] &&
          skill.level >= j.requirements[key]
        ) {
          unlockedJobs.push(j);
        }
      }
    }
    var pendingJobs = [];
    if (typeof STREET_JOBS !== "undefined") {
      for (var pji = 0; pji < STREET_JOBS.length; pji++) {
        var pj = STREET_JOBS[pji];
        if (
          pj.requirements &&
          pj.requirements[key] &&
          skill.level < pj.requirements[key]
        ) {
          pendingJobs.push({ name: pj.name, need: pj.requirements[key] });
        }
      }
    }

    var card = document.createElement("div");
    card.className = "action-card";
    card.style.cursor = "pointer";
    card.setAttribute("data-skill", key);
    card.title = "⚡15+💰¥50 = 训练" + name;

    var jobHtml = "";
    if (unlockedJobs.length > 0) {
      jobHtml =
        '<div style="font-size:9px;color:var(--success);margin-top:4px;">✅ 解锁: ' +
        unlockedJobs
          .slice(0, 3)
          .map(function (jj) {
            return jj.name;
          })
          .join(" / ") +
        "</div>";
    }
    for (var kji = 0; kji < pendingJobs.length && kji < 3; kji++) {
      var pp = pendingJobs[kji];
      jobHtml +=
        '<div style="font-size:9px;color:var(--text-muted);margin-top:2px;">🔒 ' +
        pp.name +
        "(≥Lv." +
        pp.need +
        ")</div>";
    }

    // --- P2#12 分支徽章 ---
    var branchLabel = "";
    if (typeof getSkillBranchLabel === "function") {
      var bl = getSkillBranchLabel(key, state);
      if (bl)
        branchLabel =
          '<div style="font-size:10px;color:var(--accent);margin:2px 0 4px;">🌳 ' +
          bl +
          "</div>";
    }

    // --- P2#12 天赋节点迷你树 ---
    var talentHtml = "";
    if (typeof getChosenBranch === "function") {
      var chosenBranch = getChosenBranch(key, state);
      if (chosenBranch && chosenBranch.talentNodes) {
        talentHtml =
          '<div style="margin:6px 0;display:flex;gap:4px;align-items:center;">';
        for (var ti = 0; ti < chosenBranch.talentNodes.length; ti++) {
          var nd = chosenBranch.talentNodes[ti];
          var nk = key + "_" + chosenBranch.id + "_" + nd.id;
          var activated = state.talentNodes && state.talentNodes[nk];
          var canActivate = false;
          if (typeof getUnlockedTalentNodes === "function") {
            var unlockedArr = getUnlockedTalentNodes(key, state);
            for (var ui = 0; ui < unlockedArr.length; ui++) {
              if (unlockedArr[ui].id === nd.id) {
                canActivate = true;
                break;
              }
            }
          }
          var nodeStyle = activated
            ? "background:var(--accent);color:#fff;"
            : canActivate
              ? "background:rgba(255,200,50,0.2);color:var(--warning);cursor:pointer;border:1px solid var(--warning);"
              : "background:rgba(255,255,255,0.05);color:var(--text-muted);";
          var nodeTitle = nd.name + (activated ? " ✓" : " (" + nd.desc + ")");
          talentHtml +=
            '<div style="width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;' +
            nodeStyle +
            '" title="' +
            nodeTitle +
            '" data-node="' +
            nk +
            '">' +
            (activated ? "★" : canActivate ? "☆" : "·") +
            "</div>";
          if (ti < chosenBranch.talentNodes.length - 1) {
            talentHtml +=
              '<div style="width:8px;height:1px;background:var(--border-color, rgba(255,255,255,0.1));"></div>';
          }
        }
        talentHtml += "</div>";
      }
    }

    // --- P2#12 分支选择按钮（Lv.30+未选择）---
    var branchBtnHtml = "";
    if (
      skill.level >= 30 &&
      !(state.skillBranches && state.skillBranches[key])
    ) {
      var hasBranches = false;
      if (typeof getSkillBranchDef === "function") {
        hasBranches = getSkillBranchDef(key).length > 0;
      }
      if (hasBranches) {
        branchBtnHtml =
          '<div style="margin-top:6px;padding:4px 8px;background:var(--accent);color:#fff;border-radius:4px;font-size:10px;text-align:center;cursor:pointer;" data-branch-select="' +
          key +
          '">🌳 选择发展方向</div>';
      }
    }

    card.innerHTML =
      '<div class="card-title">' +
      name +
      "</div>" +
      branchLabel +
      '<div class="card-desc">Lv.' +
      skill.level +
      " / 100</div>" +
      '<div style="margin-top:6px;height:6px;background:rgba(255,255,255,0.05);border-radius:3px;">' +
      '<div style="width:' +
      xpPct +
      "%;height:100%;background:" +
      (xpPct > 0 ? "var(--accent)" : "rgba(255,255,255,0.1)") +
      ';border-radius:3px;"></div></div>' +
      '<div style="font-size:10px;color:var(--text-muted);margin-top:2px;">EXP: ' +
      skill.xp +
      "/" +
      xpNeeded +
      "</div>" +
      talentHtml +
      branchBtnHtml +
      jobHtml +
      '<div style="margin-top:8px;font-size:11px;color:var(--warning);font-weight:bold;">⚡ 点击训练</div>';

    // === 训练次数限制（每种技能每天最多3次） ===
    if (!state.flags._dailyTrainingCounts)
      state.flags._dailyTrainingCounts = {};
    var trainedToday = state.flags._dailyTrainingCounts[key] || 0;
    var maxDaily = 3;
    var remainingStr = "";
    if (trainedToday >= maxDaily) {
      remainingStr =
        '<div style="font-size:10px;color:var(--danger);margin-top:2px;">⛔ 今日已训满 ' +
        maxDaily +
        " 次</div>";
    } else {
      remainingStr =
        '<div style="font-size:10px;color:var(--text-muted);margin-top:2px;">📅 今日已训 ' +
        trainedToday +
        "/" +
        maxDaily +
        "</div>";
    }

    // 更新卡片底部显示（旧html替换）
    var oldBottom = card.querySelector(".card-meta");
    // card.innerHTML会重建，这里直接追加到末尾
    var metaDiv = document.createElement("div");
    metaDiv.style.cssText =
      "font-size:10px;color:var(--warning);margin-top:4px;";
    metaDiv.textContent = "⚡15 + ¥50 / 次 | EXP ~5~12";
    card.appendChild(metaDiv);
    var remainDiv = document.createElement("div");
    remainDiv.innerHTML = remainingStr;
    remainDiv.className = "train-remain";
    card.appendChild(remainDiv);

    // 点击训练技能
    (function (skillKey) {
      card.addEventListener("click", function () {
        var st = StateManager.getState();
        var sk = st.skills[skillKey];
        if (!sk) return;
        // 每日训练次数检查
        if (!st.flags._dailyTrainingCounts) st.flags._dailyTrainingCounts = {};
        var trained = st.flags._dailyTrainingCounts[skillKey] || 0;
        if (trained >= 3) {
          StateManager.addMessage(
            "⛔ 今天已经训练了" +
              (skillNames[skillKey] || skillKey) +
              " 3 次，明天再来吧！",
            "warning",
          );
          return;
        }
        if (st.player.actionPoints < 15) {
          StateManager.addMessage(
            "⚠️ 行动力不足(需15点)，请休息后再来训练",
            "warning",
          );
          return;
        }
        if (st.resources.cash < 50) {
          StateManager.addMessage("⚠️ 训练需要¥50书本费，钱不够", "warning");
          return;
        }
        // 扣除资源
        st.player.actionPoints -= 15;
        st.resources.cash -= 50;
        // 训练EXP（大幅降低，技能学习变难）
        var baseGain = 5 + Random.int(0, 7); // 5~12
        var intBonus = Math.floor((st.player.intelligence || 0) / 20) * 2; // 智力加成减半
        var xpGain = baseGain + intBonus;
        // 心情加成
        var emoMod =
          typeof getEmotionWorkModifier === "function"
            ? getEmotionWorkModifier(st)
            : null;
        if (emoMod && emoMod.skillXp) {
          xpGain = Math.round(xpGain * emoMod.skillXp);
        }
        sk.xp += xpGain;
        // 记录训练次数
        st.flags._dailyTrainingCounts[skillKey] = trained + 1;
        // 升级处理（新阈值：120）
        while (sk.xp >= (sk.level + 1) * 120 && sk.level < 100) {
          sk.xp -= (sk.level + 1) * 120;
          sk.level += 1;
          StateManager.addMessage(
            "🎉 " +
              (skillNames[skillKey] || skillKey) +
              " 升级到 Lv." +
              sk.level +
              "！",
            "success",
          );
          if (typeof playSound === "function") playSound("levelup");
          // 升级提升关联属性
          if (
            ["cooking", "welding", "repair", "electrician"].indexOf(skillKey) >=
            0
          ) {
            st.player.physique = Math.min(100, (st.player.physique || 0) + 1);
          }
          if (
            ["coding", "english", "accounting", "management"].indexOf(
              skillKey,
            ) >= 0
          ) {
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 1,
            );
          }
          if (["driving", "sales"].indexOf(skillKey) >= 0) {
            st.player.agility = Math.min(100, (st.player.agility || 0) + 1);
          }
        }
        StateManager.addMessage(
          "📚 训练了" +
            (skillNames[skillKey] || skillKey) +
            "，EXP+" +
            xpGain +
            "（-⚡15 -💰¥50，今日" +
            (trained + 1) +
            "/3）",
          "success",
        );
        if (typeof playSound === "function") playSound("train");
        if (typeof consumeAP === "function") consumeAP(15);
        if (typeof renderAll === "function") renderAll(st);
      });
    })(key);

    grid.appendChild(card);

    // P2#12 分支选择按钮点击
    (function (skillKey) {
      var branchBtn = card.querySelector("[data-branch-select]");
      if (branchBtn) {
        branchBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          if (typeof showBranchSelectionModal === "function") {
            showBranchSelectionModal(skillKey);
          }
        });
      }
      // 天赋节点点击激活
      var nodeEls = card.querySelectorAll("[data-node]");
      for (var ni = 0; ni < nodeEls.length; ni++) {
        (function (el) {
          el.addEventListener("click", function (e) {
            e.stopPropagation();
            var nk = el.getAttribute("data-node");
            if (!nk) return;
            var parts = nk.split("_");
            if (parts.length < 3) return;
            var sk = parts[0];
            var branchId = state.skillBranches && state.skillBranches[sk];
            if (!branchId) return;
            var prefix = sk + "_" + branchId + "_";
            var nodeId = nk.substring(prefix.length);
            if (typeof handleActivateTalentNode === "function") {
              handleActivateTalentNode(sk, nodeId);
            } else if (typeof activateTalentNode === "function") {
              var st = StateManager.getState();
              activateTalentNode(sk, nodeId, st);
              if (typeof renderAll === "function") renderAll(st);
            }
          });
        })(nodeEls[ni]);
      }
    })(key);
  }
  div.appendChild(grid);

  // 技能协同面板（P3.3）
  if (
    typeof getSkillSynergies === "function" &&
    typeof SKILL_SYNERGIES !== "undefined"
  ) {
    var activeSyn = getSkillSynergies(state);
    var synDiv = document.createElement("div");
    synDiv.style.cssText =
      "margin-top:14px;padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.06);";
    var synTitle =
      '<h3 style="color:var(--text-muted);margin-bottom:8px;font-size:12px;">✨ 技能协同增益</h3>';
    if (activeSyn.length === 0) {
      synDiv.innerHTML =
        synTitle +
        '<div style="font-size:11px;color:var(--text-muted);">多技能达到门槛时激活持续加成。已定义组合：</div>';
      var allHtml = "";
      for (var si = 0; si < SKILL_SYNERGIES.length; si++) {
        var syn = SKILL_SYNERGIES[si];
        var reqs = Object.entries
          ? Object.entries(syn.skills)
              .map(function (e) {
                return e[0] + "≥" + e[1];
              })
              .join("+")
          : "";
        allHtml +=
          '<div style="font-size:10px;color:var(--text-muted);padding:2px 0;">🔒 ' +
          syn.label +
          "（" +
          reqs +
          "）</div>";
      }
      synDiv.innerHTML += allHtml;
    } else {
      synDiv.innerHTML = synTitle;
      for (var ai = 0; ai < activeSyn.length; ai++) {
        var asyn = activeSyn[ai];
        var badge = document.createElement("div");
        badge.style.cssText =
          "padding:6px 8px;margin-bottom:5px;background:rgba(46,204,113,0.08);border:1px solid rgba(46,204,113,0.2);border-radius:6px;";
        badge.innerHTML =
          '<div style="font-size:11px;font-weight:bold;color:var(--success);">' +
          asyn.label +
          "</div>" +
          '<div style="font-size:10px;color:var(--text-muted);margin-top:2px;">' +
          asyn.desc +
          "</div>";
        synDiv.appendChild(badge);
      }
      // 未激活的协同
      var remaining = SKILL_SYNERGIES.filter(function (s) {
        return activeSyn.every(function (a) {
          return a.id !== s.id;
        });
      });
      if (remaining.length > 0) {
        var remDiv = document.createElement("div");
        remDiv.style.cssText =
          "margin-top:6px;font-size:10px;color:var(--text-muted);";
        remDiv.textContent =
          "🔒 未激活：" +
          remaining
            .map(function (r) {
              return r.label;
            })
            .join(" / ");
        synDiv.appendChild(remDiv);
      }
    }
    div.appendChild(synDiv);
  }

  // 证书
  if (state.certificates && state.certificates.length > 0) {
    var certDiv = document.createElement("div");
    certDiv.style.marginTop = "16px";
    certDiv.innerHTML =
      '<h3 style="color:var(--text-muted);margin-bottom:8px;">📜 已获证书</h3>';
    var certList = document.createElement("div");
    certList.style.display = "flex";
    certList.style.gap = "6px";
    certList.style.flexWrap = "wrap";
    for (var ci = 0; ci < state.certificates.length; ci++) {
      var badge = document.createElement("span");
      badge.style.cssText =
        "padding:4px 10px;background:rgba(46,204,113,0.1);border:1px solid var(--success);border-radius:4px;font-size:11px;color:var(--success);";
      badge.textContent = state.certificates[ci];
      certList.appendChild(badge);
    }
    certDiv.appendChild(certList);
    div.appendChild(certDiv);
  }

  parent.appendChild(div);
}

// ====== Corp Tab（职场中才有效） ======
function renderCorpTab(state, parent) {
  if (state.player.phase !== "corporate") {
    parent.innerHTML =
      '<p style="color:var(--text-muted);text-align:center;padding:40px;">🔒 进入职场后解锁</p>';
    return;
  }

  const c = state.corporate;
  const div = document.createElement("div");

  // === 职场核心信息 ===
  var companyName = (c.company && c.company.name) || "当前公司";
  var quartersTotal = Math.max(
    1,
    Math.floor((state.player.day - (c.joinedDay || 0)) / 30),
  );

  // 企业命运标签
  var fateTag = "";
  if (typeof _fateTag === "function" && c.company) {
    fateTag = _fateTag(state, c.company.id);
  }

  var summaryHtml =
    '<h3 style="color:var(--text-muted);margin-bottom:12px;">🏢 职场信息 — ' +
    companyName +
    fateTag +
    " | 入职第" +
    quartersTotal +
    "个季度</h3>" +
    '<div class="action-cards" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">' +
    '<div class="action-card"><div class="card-title">职级</div><div class="card-desc" style="font-size:20px;color:var(--accent);font-weight:700;">' +
    c.rank +
    "</div></div>" +
    '<div class="action-card"><div class="card-title">本季剩余行动</div><div class="card-desc" style="font-size:16px;color:var(--warning);">' +
    ((c.quarterlyActions || 3) - (c.actionsUsed || 0)) +
    " / " +
    (c.quarterlyActions || 3) +
    "</div></div>" +
    '<div class="action-card"><div class="card-title">连续C次数</div><div class="card-desc" style="font-size:14px;color:' +
    (c.consecutiveC >= 2 ? "var(--danger)" : "var(--text-muted)") +
    ';">' +
    (c.consecutiveC || 0) +
    "</div></div>";

  // 公司股票
  if (c.stocks && c.stocks.length > 0) {
    var stockVal = 0;
    for (var si = 0; si < c.stocks.length; si++) {
      var s = c.stocks[si];
      stockVal += (s.currentPrice || s.grantPrice) * (s.shares || 0);
    }
    summaryHtml +=
      '<div class="action-card"><div class="card-title">公司股票</div><div class="card-desc">' +
      c.stocks.length +
      ' 持仓 | 市值 <strong style="color:var(--accent);">¥' +
      Math.round(stockVal).toLocaleString() +
      "</strong></div></div>";
  }

  summaryHtml += "</div>";

  // === 绩效明细 ===
  if (c.perfHistory && c.perfHistory.length > 0) {
    var perfRows = "";
    var grades = {
      S: "var(--success)",
      A: "#4a9e5c",
      B: "var(--warning)",
      C: "var(--danger)",
    };
    for (
      var pi = c.perfHistory.length - 1;
      pi >= Math.max(0, c.perfHistory.length - 6);
      pi--
    ) {
      var pr = c.perfHistory[pi];
      var gColor = grades[pr.grade] || "var(--text-muted)";
      perfRows +=
        '<div style="display:flex;justify-content:space-between;padding:5px 8px;border-bottom:1px solid rgba(255,255,255,0.03);font-size:11px;">' +
        "<span>Y" +
        (pr.year || "?") +
        " Q" +
        (pr.quarter || "?") +
        "</span>" +
        '<span style="color:' +
        gColor +
        ';font-weight:600;">' +
        pr.grade +
        "</span>" +
        '<span style="color:var(--text-muted);">评分 ' +
        (pr.score || "?") +
        "</span>" +
        "</div>";
    }
    summaryHtml +=
      '<div style="margin-top:12px;padding:10px 12px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;">' +
      '<h4 style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">📊 绩效记录（最近6次）</h4>' +
      '<div style="display:flex;justify-content:space-between;padding:3px 8px;font-size:10px;color:var(--text-muted);border-bottom:1px solid var(--border);"><span>季度</span><span>评级</span><span>评分</span></div>' +
      perfRows +
      "</div>";
  }

  // === 团队视图 ===
  if (c.team && c.team.length > 0) {
    var teamRows = "";
    var totalOutput = 0;
    for (var ti = 0; ti < c.team.length; ti++) {
      var tm = c.team[ti];
      var output = (tm.productivity || 0.5) * (tm.skill || 50);
      totalOutput += output;
      var loyaltyColor =
        (tm.loyalty || 50) >= 70
          ? "var(--success)"
          : (tm.loyalty || 50) >= 40
            ? "var(--warning)"
            : "var(--danger)";
      teamRows +=
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border-bottom:1px solid rgba(255,255,255,0.03);font-size:11px;">' +
        '<span style="font-weight:600;">👤 ' +
        (tm.name || "成员") +
        "</span>" +
        '<span style="color:var(--text-muted);font-size:10px;">' +
        (tm.role || "") +
        "</span>" +
        '<span style="color:var(--text-muted);">能力 ' +
        (tm.skill || 50) +
        "</span>" +
        '<span style="color:' +
        loyaltyColor +
        ';">忠诚 ' +
        (tm.loyalty || 50) +
        "</span>" +
        '<span style="color:var(--accent);">产出 ' +
        Math.round(output) +
        "</span>" +
        "</div>";
    }
    summaryHtml +=
      '<div style="margin-top:12px;padding:10px 12px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;">' +
      '<h4 style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">👥 团队 (' +
      c.team.length +
      '人 | 总产出 <strong style="color:var(--accent);">' +
      Math.round(totalOutput) +
      "</strong>)</h4>" +
      '<div style="display:flex;justify-content:space-between;padding:3px 8px;font-size:10px;color:var(--text-muted);border-bottom:1px solid var(--border);"><span>成员</span><span>角色</span><span>能力</span><span>忠诚</span><span>产出</span></div>' +
      teamRows +
      "</div>";
  }

  div.innerHTML = summaryHtml;
  parent.appendChild(div);

  // === 公司历史书入口 ===
  if (c.company && typeof renderCompanyHistory === "function") {
    var historyBtnArea = document.createElement("div");
    historyBtnArea.style.cssText =
      "margin-top:16px;padding:12px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;text-align:center;";
    var historyBtn = document.createElement("button");
    historyBtn.className = "btn btn-secondary";
    historyBtn.textContent = "📖 查看公司历史书";
    historyBtn.style.cssText = "cursor:pointer;";
    historyBtn.addEventListener("click", function () {
      if (typeof renderCompanyHistory === "function") {
        renderCompanyHistory(state);
      }
    });
    historyBtnArea.appendChild(historyBtn);
    parent.appendChild(historyBtnArea);
  }
}

/**
 * 企业命运标签 — 在公司名旁显示健康度+阶段
 * 同时被 renderCorpTab 和 corp_ui.js 使用
 */
function _fateTag(state, companyId) {
  if (!state.enterpriseFate || !state.enterpriseFate.companies || !companyId)
    return "";
  var co = state.enterpriseFate.companies[companyId];
  if (!co) return "";
  var phaseDef = CORP_LIFECYCLE_PHASES[co.phase];
  if (!phaseDef) return "";
  var healthColor =
    co.health > 60 ? "#4a9e5c" : co.health > 30 ? "#f39c12" : "#c4553d";
  var tag =
    '<span style="margin-left:8px;font-size:10px;color:' +
    phaseDef.color +
    ';">' +
    phaseDef.icon +
    " " +
    phaseDef.name +
    ' · 健康度<span style="color:' +
    healthColor +
    ';">' +
    Math.round(co.health) +
    "</span></span>";

  // 如果已IPO，添加上市标记
  if (co.ipoed) {
    tag +=
      '<span style="margin-left:4px;font-size:9px;color:#f59e0b;">🔔 IPO</span>';
  }

  return tag;
}

// ====== Enterprise Fate Tab ======
function renderEnterpriseFateTab(state, parent) {
  parent.innerHTML = "";
  if (!state.enterpriseFate || typeof getCompanyFateSummary !== "function") {
    parent.innerHTML =
      '<p style="color:var(--text-muted);text-align:center;padding:40px;">🏭 企业生态系统中...</p>';
    return;
  }

  var container = document.createElement("div");
  container.style.cssText = "padding:12px;";

  // 标题
  var title = document.createElement("h2");
  title.style.cssText =
    "margin:0 0 4px;font-size:16px;color:var(--text-primary);";
  title.textContent = "🏭 企业命运生态";
  container.appendChild(title);

  var subtitle = document.createElement("p");
  subtitle.style.cssText =
    "margin:0 0 12px;font-size:11px;color:var(--text-muted);";
  subtitle.textContent =
    "城市中的企业并非静止不变。你投资、就职过的公司会随时间成长、合并或倒闭，形成动态的商业世界。";
  container.appendChild(subtitle);

  // 公司卡片列表
  var companyIds = [
    "star_tech",
    "byte_dragon",
    "cloud_giant",
    "game_fun",
    "safe_fin",
  ];
  for (var ci = 0; ci < companyIds.length; ci++) {
    var cid = companyIds[ci];
    var summary = getCompanyFateSummary(cid, state);
    if (!summary) continue;

    var card = document.createElement("div");
    card.style.cssText =
      "background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:10px;";

    // 公司名称行
    var headerRow = document.createElement("div");
    headerRow.style.cssText =
      "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;";
    var nameSpan = document.createElement("span");
    nameSpan.style.cssText =
      "font-size:14px;font-weight:bold;color:var(--text-primary);";
    nameSpan.textContent = summary.knownToPlayer
      ? summary.phaseIcon + " " + summary.name
      : "❓ " + summary.name;
    headerRow.appendChild(nameSpan);

    var phaseBadge = document.createElement("span");
    phaseBadge.style.cssText =
      "font-size:11px;padding:2px 8px;border-radius:10px;color:#fff;background:" +
      summary.phaseColor +
      ";";
    phaseBadge.textContent = summary.phaseName;
    headerRow.appendChild(phaseBadge);
    card.appendChild(headerRow);

    if (!summary.knownToPlayer) {
      // 未知公司：模糊显示
      var hiddenNote = document.createElement("p");
      hiddenNote.style.cssText =
        "font-size:11px;color:var(--text-muted);font-style:italic;";
      hiddenNote.textContent = "💡 就职或购买该公司股票后解锁详情";
      card.appendChild(hiddenNote);
      container.appendChild(card);
      continue;
    }

    // 已知公司：显示详细数据
    // 健康度条
    var healthRow = _escRow(
      "健康度",
      summary.health,
      summary.health > 60
        ? "#4a9e5c"
        : summary.health > 30
          ? "#f39c12"
          : "#c4553d",
    );
    card.appendChild(healthRow);

    // 市场份额条
    var shareRow = _escRow("市场份额", summary.marketShare, "#4fc3f7");
    card.appendChild(shareRow);

    // 市场情绪条
    var sentimentRow = _escRow(
      "市场情绪",
      summary.sentiment,
      summary.sentiment > 50 ? "#4a9e5c" : "#e67e22",
    );
    card.appendChild(sentimentRow);

    // 趋势 + 行业
    var metaDiv = document.createElement("div");
    metaDiv.style.cssText =
      "display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:6px;";
    var trendIcon =
      summary.trend === "up" ? "📈" : summary.trend === "down" ? "📉" : "➡️";
    metaDiv.innerHTML =
      "<span>趋势: " +
      trendIcon +
      "</span><span>行业: " +
      summary.industry +
      "</span><span>产品力: " +
      summary.productScore +
      "</span>";
    card.appendChild(metaDiv);

    // 命运事件历史（最多5条）
    var history = getFateHistoryText(cid, state);
    if (history && history.length > 0) {
      var historyDiv = document.createElement("div");
      historyDiv.style.cssText =
        "margin-top:8px;padding-top:6px;border-top:1px solid var(--border);";
      var historyTitle = document.createElement("div");
      historyTitle.style.cssText =
        "font-size:10px;color:var(--text-muted);margin-bottom:4px;";
      historyTitle.textContent = "📜 命运事件记录";
      historyDiv.appendChild(historyTitle);
      for (
        var hi = Math.max(0, history.length - 5);
        hi < history.length;
        hi++
      ) {
        var hEntry = document.createElement("div");
        hEntry.style.cssText =
          "font-size:10px;color:var(--text-secondary);padding:1px 0;";
        hEntry.textContent = "第" + history[hi].day + "天 " + history[hi].text;
        historyDiv.appendChild(hEntry);
      }
      card.appendChild(historyDiv);
    }

    // 查看历史书按钮
    var historyBtn = document.createElement("button");
    historyBtn.className = "ch-history-btn";
    historyBtn.textContent = "📖 查看公司历史书";
    historyBtn.addEventListener("click", function () {
      if (typeof showCompanyHistory === "function") {
        showCompanyHistory(cid, state);
      } else {
        StateManager.addMessage("📖 公司历史书功能加载中...", "hint");
      }
    });
    card.appendChild(historyBtn);

    container.appendChild(card);
  }

  parent.appendChild(container);
}

/** 内部工具：生成百分比条 */
function _escRow(label, value, color) {
  var row = document.createElement("div");
  row.style.cssText = "display:flex;align-items:center;margin:2px 0;";
  var labelSpan = document.createElement("span");
  labelSpan.style.cssText =
    "font-size:11px;color:var(--text-secondary);width:70px;flex-shrink:0;";
  labelSpan.textContent = label;
  row.appendChild(labelSpan);

  var barWrap = document.createElement("div");
  barWrap.style.cssText =
    "flex:1;height:8px;background:var(--bg);border-radius:4px;overflow:hidden;margin:0 6px;";
  var bar = document.createElement("div");
  bar.style.cssText =
    "height:100%;width:" +
    Math.round(value) +
    "%;background:" +
    color +
    ";border-radius:4px;transition:width 0.3s;";
  barWrap.appendChild(bar);
  row.appendChild(barWrap);

  var valSpan = document.createElement("span");
  valSpan.style.cssText =
    "font-size:11px;color:var(--text-secondary);width:30px;text-align:right;";
  valSpan.textContent = Math.round(value) + "%";
  row.appendChild(valSpan);
  return row;
}

// ====== Achievements Tab ======
function renderAchievementsTab(state, parent) {
  parent.innerHTML = "";
  if (typeof getAchievementsWithStatus !== "function") {
    parent.innerHTML =
      '<p style="color:var(--text-muted);text-align:center;padding:40px;">🏅 成就系统加载中...</p>';
    return;
  }
  var all = getAchievementsWithStatus(state);
  var unlockedCount = all.filter(function (a) {
    return a.unlocked;
  }).length;
  var totalVisible = all.filter(function (a) {
    return !a.hidden || a.unlocked;
  }).length;

  var header = document.createElement("div");
  header.style.cssText =
    "padding:12px 16px;background:var(--bg-card);border-bottom:1px solid var(--border);margin-bottom:8px;";
  header.innerHTML =
    '<h3 style="margin:0;font-size:14px;color:var(--text-primary);">🏅 成就档案</h3>' +
    '<p style="margin:4px 0 0;font-size:11px;color:var(--text-muted);">已解锁 ' +
    unlockedCount +
    " / " +
    totalVisible +
    " 个 &nbsp;|&nbsp; 记录你在这座城市走过的路</p>";
  parent.appendChild(header);

  var categories = ["人生第一次", "里程碑", "道德档案", "隐藏"];
  categories.forEach(function (cat) {
    var catAchs = all.filter(function (a) {
      return a.category === cat && (!a.hidden || a.unlocked);
    });
    if (catAchs.length === 0) return;
    var section = document.createElement("div");
    section.style.cssText = "margin-bottom:12px;";
    var catTitle = document.createElement("div");
    catTitle.style.cssText =
      "padding:6px 16px;font-size:11px;font-weight:bold;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;";
    catTitle.textContent = cat;
    section.appendChild(catTitle);
    catAchs.forEach(function (ach) {
      var card = document.createElement("div");
      card.style.cssText =
        "display:flex;gap:10px;align-items:flex-start;padding:10px 14px;margin:2px 8px;background:var(--bg-card);border:1px solid " +
        (ach.unlocked ? "var(--accent)" : "var(--border)") +
        ";border-radius:8px;opacity:" +
        (ach.unlocked ? "1" : "0.55") +
        ";";
      var iconEl = document.createElement("div");
      iconEl.style.cssText = "font-size:22px;flex-shrink:0;";
      iconEl.textContent = ach.icon;
      var info = document.createElement("div");
      info.style.cssText = "flex:1;min-width:0;";
      var nameEl = document.createElement("div");
      nameEl.style.cssText =
        "font-size:13px;font-weight:bold;color:" +
        (ach.unlocked ? "var(--text-primary)" : "var(--text-muted)") +
        ";";
      nameEl.textContent = ach.name;
      var descEl = document.createElement("div");
      descEl.style.cssText =
        "font-size:11px;color:var(--text-secondary);margin-top:2px;";
      descEl.textContent = ach.desc;
      info.appendChild(nameEl);
      info.appendChild(descEl);
      if (ach.unlocked && ach.story) {
        var storyEl = document.createElement("div");
        storyEl.style.cssText =
          "font-size:10px;color:var(--text-muted);margin-top:4px;font-style:italic;border-top:1px solid var(--border);padding-top:4px;";
        storyEl.textContent = '"' + ach.story + '"';
        info.appendChild(storyEl);
      }
      card.appendChild(iconEl);
      card.appendChild(info);
      section.appendChild(card);
    });
    parent.appendChild(section);
  });
}

// ====== P2#12 技能分支选择弹窗 ======
function showBranchSelectionModal(skillKey) {
  if (typeof StateManager === "undefined") return;
  var state = StateManager.getState();
  var skill = state.skills[skillKey];
  if (!skill) return;

  var branches = [];
  if (typeof getSkillBranchDef === "function") {
    branches = getSkillBranchDef(skillKey);
  }
  if (branches.length === 0) return;

  // 创建遮罩
  var overlay = document.createElement("div");
  overlay.style.cssText =
    "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;";

  var modal = document.createElement("div");
  modal.style.cssText =
    "background:var(--bg-card,#1a1a2e);border:1px solid var(--border,rgba(255,255,255,0.1));border-radius:12px;padding:20px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;";

  var skillName = "";
  if (typeof getSkillChineseName === "function") {
    skillName = getSkillChineseName(skillKey);
  }

  modal.innerHTML =
    '<h3 style="color:var(--text-muted);margin-bottom:6px;">🌳 ' +
    skillName +
    " — 选择发展方向</h3>" +
    '<div style="font-size:11px;color:var(--text-muted);margin-bottom:14px;">技能Lv.' +
    skill.level +
    "，选择一个发展方向后获得独特加成。消耗 ⚡15AP + ¥200</div>" +
    '<div style="margin-bottom:12px;">';

  for (var bi = 0; bi < branches.length; bi++) {
    var branch = branches[bi];
    var branchDiv = document.createElement("div");
    branchDiv.style.cssText =
      "padding:10px 12px;margin-bottom:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;cursor:pointer;transition:all 0.15s;";
    branchDiv.setAttribute("data-branch-id", branch.id);

    // 天赋节点预览
    var nodePreview = "";
    if (branch.talentNodes) {
      nodePreview =
        '<div style="margin-top:6px;font-size:10px;color:var(--text-muted);">天赋节点：';
      for (var ni = 0; ni < branch.talentNodes.length; ni++) {
        var nd = branch.talentNodes[ni];
        nodePreview +=
          '<span style="margin-right:4px;">Lv.' +
          nd.requireLevel +
          " " +
          nd.name +
          "</span>";
        if (ni < branch.talentNodes.length - 1) nodePreview += " → ";
      }
      nodePreview += "</div>";
    }

    // 解锁工作预览
    var jobPreview = "";
    if (branch.jobBonuses && branch.jobBonuses.length > 0) {
      jobPreview =
        '<div style="margin-top:4px;font-size:10px;color:var(--success);">解锁工作：';
      if (typeof STREET_JOBS !== "undefined") {
        for (var ji = 0; ji < branch.jobBonuses.length; ji++) {
          for (var jqi = 0; jqi < STREET_JOBS.length; jqi++) {
            if (STREET_JOBS[jqi].id === branch.jobBonuses[ji]) {
              jobPreview +=
                STREET_JOBS[jqi].icon + " " + STREET_JOBS[jqi].name + " ";
              break;
            }
          }
        }
      }
      jobPreview += "</div>";
    }

    branchDiv.innerHTML =
      '<div style="font-size:14px;font-weight:bold;color:var(--accent);">' +
      branch.icon +
      " " +
      branch.name +
      "</div>" +
      '<div style="font-size:11px;color:var(--text-muted);margin-top:3px;">' +
      branch.desc +
      "</div>" +
      nodePreview +
      jobPreview;

    // hover效果
    branchDiv.addEventListener("mouseenter", function () {
      this.style.borderColor = "var(--accent)";
      this.style.background = "rgba(255,255,255,0.06)";
    });
    branchDiv.addEventListener("mouseleave", function () {
      this.style.borderColor = "rgba(255,255,255,0.08)";
      this.style.background = "rgba(255,255,255,0.03)";
    });

    // 选择确认
    (function (bid) {
      branchDiv.addEventListener("click", function () {
        // 确认选择
        var confirmDiv = document.createElement("div");
        confirmDiv.style.cssText =
          "margin-top:8px;display:flex;gap:8px;justify-content:center;";
        confirmDiv.innerHTML =
          '<button style="padding:6px 16px;background:var(--accent);color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;">✅ 确认选择</button>' +
          '<button style="padding:6px 16px;background:rgba(255,255,255,0.1);color:var(--text-muted);border:none;border-radius:6px;cursor:pointer;font-size:12px;">❌ 取消</button>';
        this.appendChild(confirmDiv);

        var self = this;
        var confirmBtn = confirmDiv.querySelector("button:first-child");
        var cancelBtn = confirmDiv.querySelector("button:last-child");

        cancelBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          confirmDiv.remove();
        });

        confirmBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          var st = StateManager.getState();
          if (typeof chooseSkillBranch === "function") {
            var result = chooseSkillBranch(skillKey, bid, st);
            if (result && typeof renderAll === "function") {
              renderAll(st);
            }
          }
          overlay.remove();
        });
      });
    })(branch.id);

    modal.querySelector("div").appendChild(branchDiv);
  }

  // 关闭按钮
  var closeBtn = document.createElement("div");
  closeBtn.style.cssText =
    "text-align:center;margin-top:8px;padding:8px;font-size:12px;color:var(--text-muted);cursor:pointer;";
  closeBtn.textContent = "以后再选";
  closeBtn.addEventListener("click", function () {
    overlay.remove();
  });
  modal.appendChild(closeBtn);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // 点击遮罩外部关闭
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) overlay.remove();
  });
}

// ====== 疾病列表渲染 ======

/**
 * 在 stat-fame 行之后注入疾病列表（如有），点击可打开诊所弹窗。
 * 每天疾病变化时自动刷新（StateManager 标记的 dirty 路径会触发 renderAll）。
 */
function renderIllnessRow(state) {
  if (!state.status) return;
  var illnesses = state.status.illnesses || [];
  var injured = state.status.injured;

  // 找/创建容器
  var fameRow = document.getElementById("stat-fame");
  if (!fameRow) return;
  var box = document.getElementById("illness-row");
  if (!box) {
    box = document.createElement("div");
    box.id = "illness-row";
    box.style.cssText =
      "margin-top:6px;padding:6px 8px;background:var(--bg-input);border-radius:4px;font-size:11px;line-height:1.6;display:none;";
    fameRow.parentNode.insertBefore(box, fameRow.nextSibling);
  }

  if (illnesses.length === 0 && !injured) {
    box.style.display = "none";
    return;
  }

  var html =
    '<div style="font-weight:600;color:var(--danger);margin-bottom:3px;">⚕️ 当前伤病</div>';
  if (injured) {
    html += '<div style="color:var(--text-secondary);">🩹 受伤（恢复中）</div>';
  }
  for (var i = 0; i < illnesses.length; i++) {
    var inst = illnesses[i];
    var ill = (typeof ILLNESSES !== "undefined" && ILLNESSES[inst.id]) || null;
    if (!ill) continue;
    var daysSince = (state.player.day || 0) - (inst.contractedDay || 0);
    var status = inst.treated
      ? '<span style="color:var(--success);">·药</span>'
      : "";
    html +=
      '<div style="color:var(--text-secondary);">' +
      (ill.icon || "🤒") +
      " " +
      ill.name +
      ' <span style="color:var(--text-muted);">' +
      daysSince +
      "天" +
      status +
      "</span></div>";
  }
  if (
    illnesses.length > 0 &&
    state.trade &&
    state.trade.currentLocation === "hospital"
  ) {
    html +=
      '<div style="margin-top:4px;color:var(--accent);cursor:pointer;" onclick="openClinicModal()">点击看病 →</div>';
  } else if (illnesses.length > 0) {
    html +=
      '<div style="margin-top:4px;color:var(--text-muted);font-size:10px;">去医院看病</div>';
  }
  box.innerHTML = html;
  box.style.display = "block";
}
