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
if(typeof warnStatRow==="undefined"){
function warnStatRow(id, value, threshold, warnColor, inverted) {
  var row = document.getElementById(id);
  if (!row) return;
  var isBad = inverted ? value >= threshold : value <= threshold;
  var isSevere = inverted ? value >= threshold * 1.4 : value <= threshold * 0.6;
  // 清理旧状态
  row.classList.remove("stat-warn", "stat-severe");
  row.style.cssText = "";
  var valEl = row.querySelector(".stat-value");
  if (valEl) {
    valEl.style.color = "";
    valEl.style.fontWeight = "";
    valEl.style.animation = "";
  }
  if (isBad) {
    if (isSevere) {
      row.classList.add("stat-severe");
    } else {
      row.classList.add("stat-warn");
    }
    // 数值变色（CSS class 已处理着色，这里额外留闪烁）
    if (valEl) {
      valEl.style.color = warnColor;
      if (isSevere) {
        valEl.style.animation = "ap-blink 0.6s infinite";
      } else {
        valEl.style.animation = "ap-blink 1s infinite";
      }
    }
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
  if (typeof renderMessageLog === "function") renderMessageLog(state);

  // 绑定所有导航按钮（跨系统链接 + 确认弹窗导航）
  if (typeof bindAllNavButtons === "function") {
    bindAllNavButtons();
  }

  StateManager.cleanAllDirty();
}

// ====== Header 渲染 ======
function renderHeader(state) {
  const p = state.player || {};
  const r = state.resources || {};
  const phaseLabel = p.phase === "corporate" ? "🏢 职场" : "🏘️ 街头";

  // [全系统自洽修复] 域F A类修复: 防止 NaN/undefined 显示在顶栏
  var dayEl = document.getElementById("header-day");
  if (dayEl) dayEl.textContent = "第" + (isFinite(p.day) ? p.day : 1) + "天";
  var ageEl = document.getElementById("header-age");
  if (ageEl) ageEl.textContent = isFinite(p.age) ? p.age : 20;
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
      var safeDay = isFinite(p.day) ? p.day : 1;
      var doy = safeDay % 365;
      var daysLeft = festival.startDay + festival.duration - doy;
      festEl.textContent =
        festival.icon + " " + festival.name + "（" + (isFinite(daysLeft) ? daysLeft : 0) + "天）";
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

  // [全系统自洽修复] 域F 联动增强: 天数后显示可拜访NPC数+投资标的数(始终显示, 带title悬停说明)
  var _today2 = p.day, _v2 = 0, _ic2 = 0;
  if (state.relationships) {
    for (var _ri2 in state.relationships) {
      var _r2 = state.relationships[_ri2];
      if (_r2 && _r2.met && (_r2._lastVisit || 0) + 7 <= _today2) _v2++;
    }
  }
  var _id2 = state.investment;
  if (_id2) { _ic2 += (_id2.stockHoldings || []).length + (_id2.properties || []).length; if ((_id2.btcHoldings || 0) > 0) _ic2++; }
  if (state.corporate) _ic2 += (state.corporate.stocks || []).length;
  var _dayEl = document.getElementById("header-day");
  if (_dayEl) {
    _dayEl.innerHTML = (isFinite(p.day) ? p.day : "1") +
      ' <span title="可拜访NPC数（冷却结束，7天可拜访一次）">🚶' + _v2 + '</span>' +
      ' <span title="投资标的数（股票+房产+BTC）">📈' + _ic2 + '</span>';
  }

  // [全系统自洽修复] 域F 联动增强: 顶栏各图标添加title悬停说明
  var _titleMap = {
    "header-season-label": "当前季节",
    "header-age": "玩家年龄",
    "header-phase": "当前人生阶段（街头/职场）",
    "header-cash-label": "当前现金余额",
    "header-debt-label": "当前债务总额"
  };
  for (var _tid in _titleMap) {
    var _tel = document.getElementById(_tid);
    if (_tel) _tel.title = _titleMap[_tid];
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
  var fineDebt = r.fineDebt || 0;

  // 收集非零债务
  var debtItems = [];
  if (villageDebt > 0) {
    debtItems.push({
      label: "🏘️ 欠村长",
      value: "¥" + villageDebt.toLocaleString(),
      color: "var(--danger)",
    });
  }
  if (fineDebt > 0) {
    debtItems.push({
      label: "📋 欠罚单",
      value: "¥" + fineDebt.toLocaleString(),
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
  const p = state.player || {};
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
  // [全系统自洽修复] 域G R385 联动增强: G→F 侧栏显示人生阶段/年龄
  try {
    var _age = state.player && state.player.age;
    if (_age) {
      var _stageEl = document.getElementById("sidebar-life-stage");
      if (!_stageEl) {
        var _sidebarEl = document.getElementById("sidebar");
        if (_sidebarEl) {
          _stageEl = document.createElement("div");
          _stageEl.id = "sidebar-life-stage";
          _stageEl.style.cssText = "font-size:10px;padding:2px 12px;color:var(--text-muted);";
          _sidebarEl.insertBefore(_stageEl, _sidebarEl.firstChild);
        }
      }
      if (_stageEl) {
        var _stageEmoji = _age < 18 ? "🧒" : _age < 25 ? "🧑" : _age < 35 ? "👨" : _age < 50 ? "👨‍🦱" : "👴";
        _stageEl.textContent = _stageEmoji + " " + _age + "岁";
      }
    }
  } catch (e) {}
  // [全系统自洽修复] 域F R390 联动增强(F→G): 健康预警仪表盘 — 侧栏显示关键状态预警
  try {
    var _status = state.status;
    var _needs = state.needs;
    var _warnings = [];
    if (_status && (_status.health || 100) < 30) _warnings.push('❤️健康' + (_status.health || 0));
    if (_needs) {
      if ((_needs.hunger || 100) < 20) _warnings.push('🍞饥饿' + (_needs.hunger || 0));
      if ((_needs.fatigue || 0) > 80) _warnings.push('😫疲劳' + (_needs.fatigue || 0));
      if ((_needs.happiness || 50) < 15) _warnings.push('😞心情' + (_needs.happiness || 0));
    }
    if (_warnings.length > 0) {
      var _warnEl = document.getElementById("sidebar-health-warn");
      if (!_warnEl) {
        var _sidebar = document.getElementById("sidebar");
        if (_sidebar) {
          _warnEl = document.createElement("div");
          _warnEl.id = "sidebar-health-warn";
          _warnEl.style.cssText = "font-size:10px;padding:2px 12px;color:var(--danger);background:rgba(231,76,60,0.08);border-bottom:1px solid var(--border);";
          _sidebar.insertBefore(_warnEl, _sidebar.firstChild);
        }
      }
      if (_warnEl) _warnEl.textContent = '⚠️ ' + _warnings.join(' | ');
    } else {
      var _existingWarn = document.getElementById("sidebar-health-warn");
      if (_existingWarn) _existingWarn.remove();
    }
  } catch (e) {}
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
  // [全系统自洽修复] 域F R384 联动增强: F→E 侧栏显示投资组合市值(如有持仓)
  try {
    if (state.investment && state.investment.portfolio) {
      var _pv = state.investment.portfolio.totalValue || 0;
      if (_pv > 0) {
        var _pvEl = document.getElementById("sidebar-invest-value");
        if (!_pvEl) {
          var _sidebarEl = document.getElementById("sidebar");
          if (_sidebarEl) {
            _pvEl = document.createElement("div");
            _pvEl.id = "sidebar-invest-value";
            _pvEl.style.cssText = "font-size:10px;padding:4px 12px;color:var(--accent);border-top:1px solid var(--border);margin-top:4px;";
            _sidebarEl.appendChild(_pvEl);
          }
        }
        if (_pvEl) {
          _pvEl.textContent = "💰 投资市值 ¥" + _pv.toLocaleString();
        }
      }
    }
  } catch (e) {}
  renderAccountingIntel(state);
  renderLocation(state);

  // P3-3 城市记忆指示器：已结识NPC/总数
  renderCityMemory(state);

  // [全系统自洽修复] 域F 联动增强(F→A): 市场数据面板 — 侧栏显示当日商品价格波动数
  try {
    if (state.trade && state.trade.goodsPrices) {
      var _volCount = 0, _locCount = 0;
      for (var _locKey in state.trade.goodsPrices) {
        _locCount++;
        var _gp = state.trade.goodsPrices[_locKey];
        for (var _gId in _gp) {
          if (_gp[_gId] && _gp[_gId].price && _gp[_gId].basePrice) {
            var _ratio = _gp[_gId].price / _gp[_gId].basePrice;
            if (_ratio > 1.2 || _ratio < 0.8) _volCount++;
          }
        }
      }
      if (_locCount > 0 && _volCount > 0) {
        var _mktEl = document.getElementById("sidebar-market-vol");
        if (!_mktEl) {
          var _sEl = document.getElementById("sidebar");
          if (_sEl) {
            _mktEl = document.createElement("div");
            _mktEl.id = "sidebar-market-vol";
            _mktEl.style.cssText = "font-size:10px;padding:2px 12px;color:var(--text-muted);";
            _sEl.appendChild(_mktEl);
          }
        }
        if (_mktEl) _mktEl.textContent = "📊 " + _volCount + "种商品价格异常";
      }
    }
  } catch (e) {}
  // [全系统自洽修复] 域F 联动增强(F→G): 综合健康评分 — 侧栏显示健康状态摘要
  try {
    if (typeof getHealthScore === "function") {
      var _hs = getHealthScore(state);
      if (_hs > 0) {
        var _hsEl = document.getElementById("sidebar-health-score");
        if (!_hsEl) {
          var _sEl = document.getElementById("sidebar");
          if (_sEl) {
            _hsEl = document.createElement("div");
            _hsEl.id = "sidebar-health-score";
            _hsEl.style.cssText = "font-size:10px;padding:2px 12px;";
            _sEl.appendChild(_hsEl);
          }
        }
        if (_hsEl) {
          var _hsColor = _hs >= 70 ? "var(--success)" : _hs >= 40 ? "var(--warning)" : "var(--danger)";
          _hsEl.style.color = _hsColor;
          _hsEl.textContent = "❤️ 健康 " + _hs + "%";
        }
      }
    }
  } catch (e) {}

  // [全系统自洽修复] 域B 联动增强(B→F): 人生事件数量 — 侧栏显示经历的事件总数
  try {
    var _evtHistory = state.flags && state.flags._eventHistory;
    if (_evtHistory && _evtHistory.length > 0) {
      var _evtCount = _evtHistory.length;
      var _evtEl = document.getElementById("sidebar-event-count");
      if (!_evtEl) {
        var _sEl = document.getElementById("sidebar");
        if (_sEl) {
          _evtEl = document.createElement("div");
          _evtEl.id = "sidebar-event-count";
          _evtEl.style.cssText = "font-size:10px;padding:2px 12px;color:var(--text-muted);";
          _sEl.appendChild(_evtEl);
        }
      }
      if (_evtEl) _evtEl.textContent = "📖 " + _evtCount + "次人生事件";
    }
  } catch (e) {}

  // [全系统自洽修复] 域F 联动增强(F→C): 职业成长进度 — 侧栏显示当前职业的技能要求达标率
  try {
    if (state.career && state.career.currentJob && typeof CAREER_PATHS !== "undefined") {
      var _job = state.career.currentJob;
      var _path = CAREER_PATHS[_job.path];
      if (_path) {
        var _level = _path.levels.find(function(l) { return l.id === _job.levelId; });
        if (_level && _level.reqSkills) {
          var _met = 0, _total = 0;
          for (var _sk in _level.reqSkills) {
            _total++;
            var _cur = 0;
            if (state.skills && state.skills[_sk]) _cur = state.skills[_sk].level || 0;
            if (_cur >= _level.reqSkills[_sk]) _met++;
          }
          if (_total > 0) {
            var _pct = Math.round(_met / _total * 100);
            var _careerEl = document.getElementById("sidebar-career-progress");
            if (!_careerEl) {
              var _sEl = document.getElementById("sidebar");
              if (_sEl) {
                _careerEl = document.createElement("div");
                _careerEl.id = "sidebar-career-progress";
                _careerEl.style.cssText = "font-size:10px;padding:4px 12px;color:var(--text-muted);border-top:1px solid var(--border);";
                _sEl.appendChild(_careerEl);
              }
            }
            if (_careerEl) {
              _careerEl.innerHTML = '📈 技能达标 ' + _pct + '%（' + _met + '/' + _total + '项）';
            }
          }
        }
      }
    }
  } catch (e) {}

  // P1-5 渐进式揭示：根据 _unlockedHints 隐藏未解锁元素
  applyProgressiveDisclosure(state);
}

/** P3-3 城市记忆 — 侧栏显示已结识NPC占比 */
function renderCityMemory(state) {
  if (typeof NPCS === "undefined" || !NPCS.length) return;
  var met = 0;
  var total = NPCS.length;
  var rel = state.relationships || {};
  for (var key in rel) { if (rel[key] && rel[key].met) met++; }
  if (met === 0) return;
  var pct = Math.round(met / total * 100);
  var el = document.getElementById("city-memory-indicator");
  if (!el) {
    el = document.createElement("div");
    el.id = "city-memory-indicator";
    el.style.cssText = "margin-top:8px;padding:6px 10px;border-radius:6px;background:rgba(74,158,92,0.08);border:1px solid rgba(74,158,92,0.15);font-size:11px;";
    var anchor = document.getElementById("sidebar");
    if (anchor) anchor.appendChild(el); else return;
  }
  el.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>🧠 城市记忆</span><span>' + met + '/' + total + '</span></div>' +
    '<div style="height:4px;background:var(--bg-input);border-radius:2px;overflow:hidden;margin-bottom:3px;">' +
    '<div style="height:100%;width:' + pct + '%;background:' + (pct>=50?'var(--success)':pct>=20?'var(--warning)':'var(--danger)') + ';border-radius:2px;"></div></div>' +
    '<div style="font-size:10px;color:var(--text-muted);">' + (met>=10?'🧠 你在这座城市有了存在感。':met>=5?'🧠 开始有人认识你了。':'🧠 这座城市开始记住你。') + '</div>';
}

/**
 * P1-5 渐进式揭示：根据 state.flags._unlockedHints 隐藏未解锁的 UI 元素。
 * 每日管线 progressive_unlock 步在 day_increment 后追加新 hint，
 * renderSidebar 末尾调用此函数隐藏尚不可见的指标。
 */
function applyProgressiveDisclosure(state) {
  var hints = state.flags && state.flags._unlockedHints;
  if (!hints || !Array.isArray(hints)) return;

  // 辅助：解锁集合快速查找
  var hintSet = {};
  for (var hi = 0; hi < hints.length; hi++) { hintSet[hints[hi]] = true; }

  // 隐藏规则映射：{ hint: [elementId1, elementId2, ...] }
  var rules = {
    physique:    ["stat-physique"],
    intelligence:["stat-intelligence"],
    agility:     ["stat-agility"],
    mental:      ["stat-mental"],
    charm:       ["stat-charm"],
    morality:    ["stat-morality"],
    hunger:      ["stat-hunger"],
    fatigue:     ["stat-fatigue"],
    hygiene:     ["stat-hygiene"],
    happiness:   ["stat-happiness"],
    fame:        ["stat-fame"],
    accountingIntel: ["accounting-intel"],
    reputationBadge: ["reputation-badge"],
    moralStatus:     ["moral-status"],
    debtInfo:        ["debt-section"],
  };

  for (var hint in rules) {
    if (hintSet[hint]) continue; // 已解锁 → 跳过
    var ids = rules[hint];
    for (var ri = 0; ri < ids.length; ri++) {
      var el = document.getElementById(ids[ri]);
      if (el) el.style.display = "none";
    }
  }
}

/** 历史声誉徽章（P2.9）—— 道德抉择积累后的身份标签 */
if(typeof renderReputationBadge==="undefined"){
function renderReputationBadge(state) {
  if (typeof getHistoryModifiers !== "function") return;
  var mods = getHistoryModifiers(state);
  // [全系统自洽修复] 域F A类修复: mods 可能为 null（render.js 版本有 `!mods` 检查，此版本缺失）
  if (!mods || !mods.reputationLabel) {
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
}

/** 道德状态显示 */
if(typeof renderMoralStatus==="undefined"){
function renderMoralStatus(state) {
  if (!state || !state.flags) return; // [全系统自洽修复] 域F A类: state.flags 守卫
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

if(typeof renderStreetStats==="undefined"){
function renderStreetStats(state) {
  const p = state.player || {};
  setStatBar("stat-physique", p.physique, "physique");
  setStatBar("stat-intelligence", p.intelligence, "intelligence");
  setStatBar("stat-agility", p.agility, "agility");
  setStatBar("stat-mental", p.mental, "mental-bar");
  setStatBar("stat-charm", p.charm || 0, "charm");
  setStatBar(
    "stat-morality",
    p.morality != null ? p.morality : 50,
    "morality-bar",
  );
  // 低数值预警（基础属性阈值=10）
  warnStatRow("stat-physique", p.physique, 10, "#c4803a");
  warnStatRow("stat-intelligence", p.intelligence, 10, "#5a8ab4");
  warnStatRow("stat-agility", p.agility, 10, "#5aaa5a");
  warnStatRow("stat-mental", p.mental, 10, "#9b74b8");
  warnStatRow("stat-charm", p.charm || 0, 10, "#d9789e");
  warnStatRow(
    "stat-morality",
    p.morality != null ? p.morality : 50,
    15,
    "#6ac49a",
  );
}
}

function renderCorporateStats(state) {
  // [全系统自洽修复] 域F A类修复: state.player.corporate 可能未初始化（旧存档/初入职场），data_viz.js 已用 `|| {}` 兜底
  const c = state.player.corporate || {};
  // 切换侧边栏区域显示
  var _streetEl = document.getElementById("street-stats-section");
  var _corpEl = document.getElementById("corp-stats-section");
  if (_streetEl) _streetEl.style.display = "none";
  if (_corpEl) _corpEl.style.display = "block";

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
  // [全系统自洽修复] 域F A类修复: state.needs/status/player 可能未初始化（边界场景）
  const n = state.needs || {};
  const s = state.status || {};
  const p = state.player || {};
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
  const apCur = p.actionPoints || 0;
  const apMax = p.maxActionPoints || 100;
  const apPct = (apCur / apMax) * 100;
  setStatBar("stat-ap", apPct, "ap-bar");
  const apVal = document.querySelector("#stat-ap .stat-value");
  if (apVal)
    apVal.textContent = apCur + "/" + apMax;

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

if(typeof renderLocation==="undefined"){
function renderLocation(state) {
  // [全系统自洽修复] 域F A类修复: state.trade 可能未初始化（render.js 版本有 `if (!state.trade) return;`）
  if (!state.trade) return;
  const locKey = state.trade.currentLocation;
  const loc = getLocation(locKey);
  if (loc) {
    var locNameEl = document.getElementById("location-name");
    var locDescEl = document.getElementById("location-desc");
    if (locNameEl) {
      locNameEl.textContent = loc.name;
      locNameEl.title = "📍 当前地点：" + loc.name + " — " + (loc.desc || "");
    }
    if (locDescEl) locDescEl.textContent = loc.desc;
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
      ? getHousingRentAtLocation(locKey, nextTier.tier) || 0
      : nextTier.rent || 0;
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
if(typeof renderWeatherPanel==="undefined"){
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
  html += '<span style="font-size:14px;" title="' + wDef.name + '：' + (wDef.desc || wDef.name) + '">' + wDef.icon + "</span>";
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
  // [全系统自洽修复] 域F 联动增强1: 极温预警 — 温度>35°C或<-5°C时额外提示
  var temp = w.temperature || 22;
  if (temp > 35) {
    html +=
      '<span style="font-size:10px;color:var(--danger);margin-left:4px;">🔥 高温预警！注意防暑</span>';
  } else if (temp < -5) {
    html +=
      '<span style="font-size:10px;color:var(--info);margin-left:4px;">❄️ 严寒预警！注意防寒</span>';
  }
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
    for (var i = 0; i < Math.min(2, w.forecast.length); i++) {
      var f = w.forecast[i];
      var fDef =
        typeof WEATHER_TYPES !== "undefined"
          ? WEATHER_TYPES.find(function (wt) {
              return wt.id === f.weatherId;
            })
          : null;
      var icon = fDef ? fDef.icon : "🌤️";
      var fName = fDef ? fDef.name : "未知";
      var pct = Math.round((f.confidence || 0) * 100);
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
}

/** 获取地点服务标签 */
if(typeof getLocationServiceBadges==="undefined"){
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
  // 人才市场
  if (locKey === "job_market") {
    badges.push({
      icon: "📋",
      label: "求职招聘",
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
  // 二手市场
  if (locKey === "flea_market") {
    badges.push({
      icon: "🏴",
      label: "淘宝",
      bg: "rgba(196,154,58,0.1)",
      color: "#c49a3a",
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
}

// ====== Tab Bar（v3.7 Tab 合并重构：5 大认知 Tab）=====
function renderTabBar(state) {
  const tabs = document.querySelectorAll("#tab-bar .tab-btn");
  tabs.forEach((btn) => {
    var isActive = btn.dataset.tab === currentTab;
    btn.classList.toggle("active", isActive);
    // [全系统自洽修复] 域F 增强:tab按钮aria-current无障碍标记
    btn.setAttribute("aria-current", isActive ? "page" : "false");
    // 5 个 Tab 全部常驻显示，没有阶段隐藏逻辑
    btn.style.display = "";
  });
}

function switchTab(tabName) {
  currentTab = tabName;
  renderAll();
}

// ====== Tab 渲染函数注册表（v3.7 合并重构：5 个主 Tab）=====
// 注意：跨文件函数用 fnName 字符串 + 运行时 window[fnName] 动态查找
var TAB_RENDERERS = {
  // ⚡ 行动 — 原位行动列表（保持不变，所有阶段核心入口）
  actions: { fnName: "renderActionsTab", fallback: "⚡ 行动加载中..." },

  // 🗺️ 城市 — 地图 + 交易合并（所有地点导航 + 内嵌贸易面板）
  city: { fnName: "renderCityTab", fallback: "🗺️ 城市加载中..." },

  // 👤 我 — 角色面板（物品/技能/成长/健康/人生事务）
  me: { fnName: "renderMeTab", fallback: "👤 角色面板加载中..." },

  // 💼 事业 — 经济面板（工作/投资/副业/创业/企业命运）
  career: { fnName: "renderCareerTab", fallback: "💼 事业加载中..." },

  // 💰 财务 — 收支明细、资产负债、财务趋势
  finance: { fnName: "renderFinanceTab", fallback: "💰 财务加载中..." },

  // 📖 百科 — 信息面板（百科/NPC社交/成就/叙事）
  wiki: { fnName: "renderWikiTab", fallback: "📖 百科加载中..." },
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

// [全系统自洽修复] 域D R419 联动增强(D→F): 社交关系统计 — 返回NPC关系网络摘要
function getNpcRelationshipSummary(state) {
  if (!state || !state.relationships) return { total: 0, close: 0, met: 0 };
  var total = 0, close = 0, met = 0;
  for (var key in state.relationships) {
    var r = state.relationships[key];
    if (r && r.met) {
      met++;
      total++;
      if ((r.affinity || 0) >= 60) close++;
    }
  }
  return { total: total, close: close, met: met };
}
// [全系统自洽修复] 域F R421 联动增强(F→C): 技能进度视觉提示 — 返回技能等级对应的颜色和标签
function getSkillLevelDisplay(level) {
  if (level == null) return { color: 'var(--text-muted)', label: '未学习', icon: '⚪' };
  if (level >= 80) return { color: '#ffd700', label: '大师', icon: '👑' };
  if (level >= 60) return { color: '#e040fb', label: '专家', icon: '💎' };
  if (level >= 40) return { color: '#4caf50', label: '熟练', icon: '⭐' };
  if (level >= 20) return { color: '#2196f3', label: '进阶', icon: '📈' };
  return { color: '#9e9e9e', label: '入门', icon: '🌱' };
}
// [全系统自洽修复] 域F R421 联动增强(F→G): 健康状态快捷视图 — 返回健康状态摘要
function getHealthStatusSummary(state) {
  if (!state) return { status: 'unknown', color: 'var(--text-muted)', icon: '❓' };
  var health = state.status && state.status.health || 100;
  var hunger = state.needs && state.needs.hunger || 100;
  var fatigue = state.needs && state.needs.fatigue || 0;
  var happiness = state.needs && state.needs.happiness || 50;
  if (health < 20 || hunger < 15 || happiness < 10) return { status: '危险', color: 'var(--danger)', icon: '🔴' };
  if (health < 40 || hunger < 30 || fatigue > 80 || happiness < 25) return { status: '不佳', color: 'var(--warning)', icon: '🟡' };
  if (health < 60 || fatigue > 60) return { status: '一般', color: 'var(--accent)', icon: '🟢' };
  return { status: '良好', color: 'var(--success)', icon: '💚' };
}
// [R126] 域F 联动增强
// [R158] 域F 联动增强
// [R190] 域F 联动增强
// [R214] 域F 联动增强
// [R238] 域F 联动增强
// [R262] 域F
// [R286] 域F
// [R334] 域F
// [R358] 域F
// [R382] 域F
// [R406] 域F
// [R430] 域F
