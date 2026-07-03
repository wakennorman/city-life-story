/**
 * 主渲染调度器
 *
 * 管理整个 UI 的渲染。使用脏标记 (dirty flag) 按需更新 DOM。
 * 渲染函数命名: render<Section>()
 */

// 当前激活的 Tab
let currentTab = "actions";

// ====== 玩家可见名称兜底 ======
var DISPLAY_NAME_ALIASES = {
  vitamins_item: "维生素片",
  electronics: "电子产品",
  electronics_item: "电子产品",
  daily: "日用品",
  food: "食品",
  clothing: "衣物",
  luxury: "奢侈品",
  scrap: "废品",
};

function formatIdAsDisplayName(id) {
  if (id === undefined || id === null || id === "") return "未知项目";
  return String(id)
    .replace(/_item$/g, "")
    .split(/[_-]+/)
    .filter(Boolean)
    .map(function (part) {
      return DISPLAY_NAME_ALIASES[part] || part;
    })
    .join(" ");
}

function getUiDisplayName(id, fallback) {
  if (fallback && fallback !== "undefined") return fallback;
  if (id === undefined || id === null || id === "") return "未知项目";
  var key = String(id);
  if (DISPLAY_NAME_ALIASES[key]) return DISPLAY_NAME_ALIASES[key];
  if (typeof getItemById === "function") {
    var item = getItemById(key);
    if (item && item.name) return item.name;
  }
  if (typeof getGoodById === "function") {
    var good = getGoodById(key);
    if (good && good.name) return good.name;
  }
  if (
    typeof LOCATIONS !== "undefined" &&
    LOCATIONS[key] &&
    LOCATIONS[key].name
  ) {
    return LOCATIONS[key].name;
  }
  if (typeof STREET_JOBS !== "undefined" && Array.isArray(STREET_JOBS)) {
    var job = STREET_JOBS.find(function (j) {
      return j && j.id === key;
    });
    if (job && job.name) return job.name;
  }
  return formatIdAsDisplayName(key);
}

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
  var phaseEl = document.getElementById("header-phase");
  if (phaseEl) phaseEl.textContent = phaseLabel;

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
      modeStat.classList.add("has-mode");
    } else {
      modeStat.style.display = "none";
      modeStat.classList.remove("has-mode");
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
  var villageDebt = r.villageDebt || 0;
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
  var sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("phase-street", p.phase === "street");
    sidebar.classList.toggle("phase-corporate", p.phase !== "street");
  }

  if (p.phase === "street") {
    renderStreetStats(state);
  } else {
    renderCorporateStats(state);
  }

  renderNeedsBars(state);
  renderDebtInfo(state);
  // 人生目标已移到内容区时间槽下方（renderCurrentTab 中渲染）
  // renderDreamSection(state);
  // 今日重点已整合到行动页的"今日智能建议"中
  // if (typeof renderDailyFocusSection === "function") {
  //   renderDailyFocusSection(state);
  // }
  // 学历已移到个人成长Tab的"🎓 学历"子Tab中
  // renderEduSection(state);
  renderReputationBadge(state);
  renderMoralStatus(state);
  renderAccountingIntel(state);
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
    // 动态创建并附加到梦想区之后；学历已移出侧栏。
    el = document.createElement("div");
    el.id = "reputation-badge";
    el.style.cssText =
      "margin-top:6px;padding:6px 10px;background:rgba(74,158,92,0.10);border:1px solid rgba(74,158,92,0.30);border-radius:8px;";
    var anchorEl = document.getElementById("dream-section");
    if (anchorEl && anchorEl.parentNode) {
      anchorEl.parentNode.insertBefore(el, anchorEl.nextSibling);
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

/** 会计情报（技能门控，Lv.20+侧边栏显示） */
function renderAccountingIntel(state) {
  var el = document.getElementById("accounting-intel");
  if (!el) return;
  var lvl =
    (state.skills &&
      state.skills.accounting &&
      state.skills.accounting.level) ||
    0;
  if (lvl < 20) {
    el.style.display = "none";
    return;
  }
  el.style.display = "block";
  var html = '<h3 style="font-size:12px;margin-bottom:4px;">🧾 财务情报</h3>';
  var preview = buildAccountingPreview(state, "bank");
  if (preview) {
    html +=
      '<div style="font-size:11px;color:var(--text-secondary);line-height:1.5;">' +
      preview +
      "</div>";
  }
  html +=
    '<div style="font-size:9px;color:var(--text-muted);margin-top:3px;">📊 会计 Lv.' +
    lvl +
    "</div>";
  el.innerHTML = html;
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
  const bankDebt = state.resources.bankDebt || 0;
  let html = "";
  if (bankDebt > 0) {
    html += `<div style="padding:6px 10px;margin:2px 0;background:rgba(243,156,18,0.08);border-radius:4px;font-size:11px;">
      🏦 欠银行: <strong style="color:var(--warning);">¥${bankDebt.toLocaleString()}</strong>
    </div>`;
  }
  debtSection.innerHTML = html;
  debtSection.style.display = bankDebt > 0 ? "block" : "none";
}

function renderStreetStats(state) {
  const p = state.player;
  setStatBar("stat-physique", p.physique, "physique");
  setStatBar("stat-intelligence", p.intelligence, "intelligence");
  setStatBar("stat-agility", p.agility, "agility");
  setStatBar("stat-mental", p.mental, "mental-bar");
  setStatBar("stat-charm", p.charm || 0, "charm");
  // 低数值预警（基础属性阈值=10）
  warnStatRow("stat-physique", p.physique, 10, "#c4803a");
  warnStatRow("stat-intelligence", p.intelligence, 10, "#5a8ab4");
  warnStatRow("stat-agility", p.agility, 10, "#5aaa5a");
  warnStatRow("stat-mental", p.mental, 10, "#9b74b8");
  warnStatRow("stat-charm", p.charm || 0, 10, "#d9789e");
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
  var statusSection = document.getElementById("location-section");
  if (statusSection) statusSection.style.display = "block";
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
  // 状态：饥饿≤15 疲劳≥85 卫生≤15 心情≤10 健康≤20 名气≤5
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
  // location-name 仅显示地点名（天气详情由下方 weather-panel 展示，避免冗余）
  renderHeaderContext(state, loc, weatherDef, seasonDef);

  // 服务标签 + 街坊声望已移至地图 Tab（renderMapTab → appendLocationServicesStrip）
  // sidebar 的 location-services / location-reputation 容器保持空占位，避免其他代码 getElementById 报错

  var houseData =
    (typeof HOUSING_TIERS !== "undefined" &&
      HOUSING_TIERS[state.housing?.tier || 0]) ||
    null;
  var houseName = houseData
    ? houseData.icon + " " + houseData.name
    : "🌃 露宿街头";
  var curRent = houseData ? houseData.rent : 0;
  var houseEl = document.getElementById("housing-info");
  if (houseEl) {
    houseEl.style.display = "none";
    houseEl.innerHTML = "";
  }

  // 天气面板（天气深化系统）
  renderWeatherPanel(state);
}

function renderHeaderContext(state, loc, weatherDef, seasonDef) {
  var el = document.getElementById("header-context");
  if (!el) return;
  var houseData =
    (typeof HOUSING_TIERS !== "undefined" &&
      HOUSING_TIERS[state.housing?.tier || 0]) ||
    null;
  var houseName = houseData ? houseData.name : "露宿街头";
  var houseIcon = houseData ? houseData.icon || "🏠" : "🌃";
  // 住所和背包信息已移到时间槽下方展示，此处只做简洁展示
  el.innerHTML =
    '<span class="context-chip" style="font-size:11px;">' +
    houseIcon +
    " " +
    houseName +
    "</span>";
  el.title = "当前住所：" + houseName;
}

function getHousingUpgradeTip(state) {
  if (typeof HOUSING_TIERS === "undefined" || !Array.isArray(HOUSING_TIERS)) {
    return "";
  }
  if (typeof getAvailableHousingTiersAtLocation !== "function") return "";
  var locKey = state.trade ? state.trade.currentLocation : "slum";
  var availableTiers = getAvailableHousingTiersAtLocation(locKey);
  var currentTier = state.housing ? state.housing.tier || 0 : 0;
  // 找到当前地点可选的、比当前高的最低档
  var nextTier = null;
  for (var i = 0; i < availableTiers.length; i++) {
    if (availableTiers[i] > currentTier) {
      nextTier = HOUSING_TIERS[availableTiers[i]];
      break;
    }
  }
  if (!nextTier) return "";
  var locName = getLocationChineseName(locKey);
  var actualRent =
    typeof getHousingRentAtLocation === "function"
      ? getHousingRentAtLocation(locKey, nextTier.tier)
      : nextTier.rent;
  return (
    "在" +
    locName +
    "可升级为" +
    (nextTier.icon || "🏠") +
    nextTier.name +
    "（¥" +
    actualRent +
    "/天）"
  );
}

/**
 * 渲染天气面板（天气深化系统）
 * 显示：当前天气详情、舒适度、持续期、天气预报
 */
function renderWeatherPanel(state) {
  var panel = document.getElementById("weather-panel");
  if (!panel) return;
  var w = state.weather;
  if (!w || !w.current) {
    panel.style.display = "none";
    return;
  }
  var wDef =
    typeof WEATHER_TYPES !== "undefined"
      ? WEATHER_TYPES.find(function (wt) {
          return wt.id === w.current;
        })
      : null;
  if (!wDef) {
    panel.style.display = "none";
    return;
  }
  var tempEffect =
    typeof getTempEffect === "function"
      ? getTempEffect(w.temperature || 22)
      : null;

  var isExtreme =
    typeof isExtremeWeather === "function"
      ? isExtremeWeather(w.current)
      : false;
  var isPersistent = w.persistent && w.duration > 1;

  var comfort =
    state.status && state.status.comfort != null ? state.status.comfort : 50;
  var comfortLabel =
    comfort >= 80
      ? "舒适"
      : comfort >= 60
        ? "还行"
        : comfort >= 40
          ? "不适"
          : comfort >= 20
            ? "难受"
            : "恶劣";
  var comfortColor =
    comfort >= 60
      ? "var(--success)"
      : comfort >= 40
        ? "var(--warning)"
        : "var(--danger)";

  var html = "";

  html +=
    '<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">';
  html += '<span style="font-size:14px;">' + wDef.icon + "</span>";
  html +=
    '<span style="font-size:12px;font-weight:600;">' + wDef.name + "</span>";
  html +=
    '<span style="font-size:11px;color:var(--text-secondary);">🌡️' +
    Math.round(w.temperature || 22) +
    "°C</span>";
  if (tempEffect) {
    html +=
      '<span style="font-size:10px;color:var(--text-muted);">(' +
      tempEffect.name +
      ")</span>";
  }
  html +=
    '<span style="font-size:10px;color:' +
    comfortColor +
    ';margin-left:auto;">☂️' +
    comfortLabel +
    "</span>";
  html += "</div>";

  if (isPersistent) {
    html += '<div style="margin-top:3px;font-size:10px;color:var(--warning);">';
    html += "📅 第" + w.daysActive + "/" + w.duration + "天";
    if (w.current === "plum_rain") html += " · 注意防潮防霉";
    else if (w.current === "heatwave") html += " · 注意防暑降温";
    else if (w.current === "cold_snap") html += " · 注意防寒保暖";
    else if (w.current === "typhoon") html += " · 注意人身安全";
    else if (w.current === "sandstorm") html += " · 做好防护措施";
    else if (w.current === "heavy_smog") html += " · 建议佩戴口罩";
    html += "</div>";
  }

  if (w.forecast && w.forecast.length > 0) {
    html +=
      '<div style="margin-top:4px;padding-top:4px;border-top:1px solid var(--border);">';
    html +=
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:2px;">📅 未来天气展望：</div>';
    html += '<div style="display:flex;gap:3px;">';
    for (var i = 0; i < w.forecast.length; i++) {
      var f = w.forecast[i];
      var fDef =
        typeof WEATHER_TYPES !== "undefined"
          ? WEATHER_TYPES.find(function (wt) {
              return wt.id === f.weatherId;
            })
          : null;
      var icon = fDef ? fDef.icon : "🌤️";
      var fName = fDef ? fDef.name : "未知";
      var pct = Math.round(f.confidence * 100);
      html +=
        '<div style="flex:1;text-align:center;font-size:10px;padding:3px 2px;border-radius:4px;background:var(--bg-card);">';
      html += "<div>" + icon + "</div>";
      html +=
        '<div style="font-size:9px;color:var(--text-secondary);">' +
        fName +
        "</div>";
      html +=
        '<div style="font-size:8px;color:var(--text-muted);">' +
        pct +
        "%</div>";
      html += "</div>";
    }
    html += "</div></div>";
  }

  if (isExtreme) {
    panel.style.cssText =
      "margin-top:6px;padding:6px 8px;border-radius:6px;" +
      "background:rgba(196,85,61,0.08);font-size:11px;line-height:1.5;display:block;" +
      "border-left:3px solid var(--danger);";
  } else {
    panel.style.cssText =
      "margin-top:6px;padding:6px 8px;border-radius:6px;" +
      "background:var(--bg-input);font-size:11px;line-height:1.5;display:block;";
  }

  // === v3.3 W2-T2: 明日预报 + 准备状态 ===
  if (typeof getForecastHTML === "function") {
    html += getForecastHTML(state);
  }

  panel.innerHTML = html;
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
    } else if (btn.dataset.tab === "career_dev") {
      // 事业发展Tab：街头阶段显示上班族工作引导，公司阶段不冲突时显示
      if (
        state.player.phase === "corporate" &&
        (!state.startup || state.startup.status === "none")
      ) {
        btn.style.display = "none";
      } else {
        btn.style.display = "";
      }
    } else if (btn.dataset.tab === "social") {
      // 社交Tab全阶段显示（家庭系统+职场社交，后者仅公司阶段活跃）
      btn.style.display = "";
    } else if (btn.dataset.tab === "side_hustle") {
      // 副业Tab：公司阶段显示（Phase 2）
      if (state.player.phase === "corporate") {
        btn.style.display = "";
      } else {
        btn.style.display = "none";
      }
    } else if (btn.dataset.tab === "personal_growth") {
      // 个人成长不再作为主入口；成长行为拆回具体地点行动，保留 renderer 兼容旧入口。
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

// ====== Tab 渲染函数注册表 ======
// 新增标签页只需在这里加一行，无需修改 renderCurrentTab
//
// 注意：对于定义在其他 JS 文件中的函数（跨文件），
// 不能直接用引用（const 创建时函数尚未加载），
// 要用 fnName 字符串 + 运行时 window[fnName] 动态查找。
//
// ⚠️ 所有跨文件的渲染函数必须用 fnName 字符串 + 运行时 window[fnName] 动态查找。
//    渲染函数定义在 render.js（后加载）或 render_infra.js（后加载）中时，
//    const 创建时函数还不存在，直接引用/对象 fn 引用的值都是 undefined。
//    只有同文件或更早加载的函数才可以用直接引用。
const TAB_RENDERERS = {
  actions: { fnName: "renderActionsTab", fallback: "⚡ 行动加载中..." },
  map: { fnName: "renderMapTab", fallback: "🗺️ 地图加载中..." },
  trade: { fnName: "renderTradeTab", fallback: "📦 交易加载中..." },
  inventory: { fnName: "renderInventoryTab", fallback: "🎒 物品加载中..." },
  skills: { fnName: "renderSkillsTab", fallback: "📚 技能系统加载中..." },
  corp: { fnName: "renderCorpTab", fallback: "🏢 职场加载中..." },
  // renderInvestmentTab 在 investment.js 中定义（跨文件）
  investment: { fnName: "renderInvestmentTab", fallback: "投资系统加载中..." },
  // renderStartupTab + career jobs 在 career_dev.js 中定义（跨文件）
  career_dev: {
    fnName: "renderCareerDevTab",
    fallback: "事业发展系统加载中...",
  },
  enterprise: {
    fnName: "renderEnterpriseFateTab",
    fallback: "企业生态加载中...",
  },
  // renderSideHustleTab 在 side_hustle_ui.js 中定义（跨文件）
  side_hustle: { fnName: "renderSideHustleTab", fallback: "副业系统加载中..." },
  achievements: {
    fnName: "renderAchievementsTab",
    fallback: "🏅 成就加载中...",
  },
  // 社交Tab：合并职场社交+家庭（跨文件）
  social: { fnName: "renderSocialTab", fallback: "社交系统加载中..." },
  life_systems: {
    fnName: "renderLifeSystemsTab",
    fallback: "人生事务系统加载中...",
  },
  // 个人成长Tab（合并了原成长数据可视化+原个人成长）
  personal_growth: {
    fnName: "renderMergedPersonalGrowthTab",
    fallback: "个人成长系统加载中...",
  },
  equipmentSuites: {
    fnName: "renderEquipmentSuitesTab",
    fallback: "装备套装加载中...",
  },
  wiki: { fnName: "renderWikiTab", fallback: "📖 百科系统加载中..." },
};

/**
 * 📍 当前地点服务条 + 声望条（地图 Tab 顶部通用件）
 * - 服务标签：仓库 / 工作 / 银行 / 医院 / 客流量...
 * - 街坊声望：⭐⭐ + 进度条 + 下一档称号
 * 移入地图 Tab 后桌面/移动端均可见（替代原 sidebar 位置）
 */
function appendLocationServicesStrip(container, state, locKey) {
  if (!container || !locKey) return;
  const loc = getLocation(locKey);
  if (!loc) return;

  const strip = document.createElement("div");
  strip.className = "map-location-services-strip";
  strip.style.cssText =
    "display:flex;flex-direction:column;gap:4px;padding:6px 8px;" +
    "background:var(--bg-card);border:1px solid var(--border-light);border-radius:6px;" +
    "font-size:11px;margin-bottom:4px;";

  const badges = getLocationServiceBadges(locKey);
  let badgeHtml = `<div style="display:flex;flex-wrap:wrap;gap:4px;">`;
  badges.forEach((b) => {
    badgeHtml += `<span style="font-size:10px;padding:1px 6px;border-radius:3px;background:${b.bg};color:${b.color};border:1px solid ${b.color};">${b.icon} ${b.label}</span>`;
  });
  if (
    typeof getVendingFootfallMod === "function" &&
    typeof getFootfallStars === "function" &&
    loc.footfall
  ) {
    const footfall = getVendingFootfallMod(locKey, state);
    const stars = getFootfallStars(footfall);
    const note = loc.vendingNote || "";
    badgeHtml +=
      `<span style="font-size:10px;padding:1px 6px;border-radius:3px;` +
      `background:rgba(74,158,92,0.1);color:var(--accent);border:1px solid rgba(74,158,92,0.3);" ` +
      `title="${note}">🧑‍🤝‍🧑 ${stars}</span>`;
  }
  if (typeof getLocationNewsBadges === "function") {
    const pulseBadges = getLocationNewsBadges(locKey, state);
    pulseBadges.forEach((b) => {
      const color = b.positive ? "var(--success)" : "var(--warning)";
      const bg = b.positive ? "rgba(46,204,113,0.10)" : "rgba(243,156,18,0.10)";
      badgeHtml +=
        `<span style="font-size:10px;padding:1px 6px;border-radius:3px;` +
        `background:${bg};color:${color};border:1px solid ${color};" ` +
        `title="${_esc(b.tip || "")}">📰 ${_esc(b.label)}</span>`;
    });
  }
  badgeHtml += `</div>`;
  strip.innerHTML = badgeHtml;

  // 街坊声望
  if (typeof getReputationUIData === "function") {
    const repData = getReputationUIData(state, locKey);
    let stars = "";
    for (let i = 0; i < repData.level; i++) stars += "⭐";
    if (repData.level === 0) stars = "〇";
    const bonusText =
      repData.bonus > 0 ? ` +${Math.round(repData.bonus * 100)}%收入` : "";
    const progressBar =
      repData.level < 5
        ? `<span style="display:inline-block;width:40px;height:4px;background:rgba(0,0,0,0.1);border-radius:2px;vertical-align:middle;margin-left:3px;"><span style="display:block;height:100%;width:${repData.progress}%;background:var(--accent);border-radius:2px;"></span></span>`
        : "✨MAX";
    const nextText = repData.nextTitle ? ` → ${repData.nextTitle}` : "";
    const repEl = document.createElement("div");
    repEl.style.cssText =
      "display:flex;align-items:center;justify-content:space-between;" +
      "padding:3px 6px;background:rgba(243,156,18,0.06);border:1px solid rgba(243,156,18,0.2);border-radius:4px;";
    repEl.innerHTML =
      `<span><span style="font-weight:600;">👥 ${_esc(repData.title)}</span>${bonusText}</span>` +
      `<span style="font-size:10px;color:var(--text-secondary);">${stars}${progressBar}${nextText}</span>`;
    strip.appendChild(repEl);
  }

  container.appendChild(strip);
}
