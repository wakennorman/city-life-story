/**
 * 主渲染调度器
 *
 * 管理整个 UI 的渲染。使用脏标记 (dirty flag) 按需更新 DOM。
 * 渲染函数命名: render<Section>()
 */

// 当前激活的 Tab — 定义在 render_core.js 中，这里不重复声明
// let currentTab = "actions";

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

// ====== Header 渲染 ======


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


/**
 * 资金展示初始化（原现金轮播 → 现资金展示）
 * 由 renderHeader → renderFundsHeader / renderDebtHeader 自动处理；
 * 此函数保留仅用于向后兼容 main.js 的调用。
 */


// ====== Sidebar 渲染 ======


/** 历史声誉徽章（P2.9）—— 道德抉择积累后的身份标签 */
function renderReputationBadge(state) {
  if (typeof getHistoryModifiers !== "function") return;
  var mods = getHistoryModifiers(state);
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

/** 道德状态显示 */
function renderMoralStatus(state) {
  if (!state || !state.flags) return;
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




/** 梦想追踪侧边栏区块 */


/** 侧边栏显示村长/银行债务 */


function renderStreetStats(state) {
  const p = state.player;
  setStatBar("stat-physique", p.physique, "physique");
  setStatBar("stat-intelligence", p.intelligence, "intelligence");
  setStatBar("stat-agility", p.agility, "agility");
  setStatBar("stat-mental", p.mental, "mental-bar");
  setStatBar("stat-charm", p.charm || 0, "charm");
  // [全系统自洽修复] 域F A类#1: render_core.js 的 renderStreetStats 含道德 bar 但被 render.js 覆盖→补上
  setStatBar("stat-morality", p.morality != null ? p.morality : 50, "morality-bar");
  // 低数值预警（基础属性阈值=10）
  warnStatRow("stat-physique", p.physique, 10, "#c4803a");
  warnStatRow("stat-intelligence", p.intelligence, 10, "#5a8ab4");
  warnStatRow("stat-agility", p.agility, 10, "#5aaa5a");
  warnStatRow("stat-mental", p.mental, 10, "#9b74b8");
  warnStatRow("stat-charm", p.charm || 0, 10, "#d9789e");
  warnStatRow("stat-morality", p.morality != null ? p.morality : 50, 15, "#6ac49a");
}





function renderLocation(state) {
  if (!state.trade) return;
  const locKey = state.trade && state.trade.currentLocation;
  const loc = getLocation(locKey);
  if (loc) {
    // [全系统自洽修复] 域F A类修复: DOM 元素可能不存在（动态渲染场景）
    var _locNameEl = document.getElementById("location-name");
    var _locDescEl = document.getElementById("location-desc");
    if (_locNameEl) _locNameEl.textContent = loc.name;
    if (_locDescEl) _locDescEl.textContent = loc.desc;
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
  // [全系统自洽修复] 域F 联动增强1: 极温预警（F→G）
  var _temp = w.temperature || 22;
  if (_temp >= 35) html += '<span style="font-size:10px;color:var(--danger);margin-left:2px;">🔥 高温预警</span>';
  else if (_temp <= 0) html += '<span style="font-size:10px;color:var(--info);margin-left:2px;">❄️ 低温预警</span>';
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
/**
 * 📍 当前地点服务条 + 声望条（地图 Tab 顶部通用件）
 * - 服务标签：仓库 / 工作 / 银行 / 医院 / 客流量...
 * - 街坊声望：⭐⭐ + 进度条 + 下一档称号
 * 移入地图 Tab 后桌面/移动端均可见（替代原 sidebar 位置）
 */


// ====== Life Systems Tab: 人生节点 / 医疗 / 旅行 / 法律 ======
function _lifeSystemsEscape(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[ch];
  });
}

function _lifeSystemsMoney(value) {
  return "¥" + Math.round(value || 0).toLocaleString();
}

function _lifeSystemsLocationNames(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return "当前地点";
  return ids
    .map(function (id) {
      var loc =
        Array.isArray(window.LOCATIONS) &&
        window.LOCATIONS.find(function (item) {
          return item && item.id === id;
        });
      return (loc && (loc.name || loc.title)) || id;
    })
    .join(" / ");
}

function _lifeSystemsLines(lines, emptyText) {
  if (!Array.isArray(lines) || lines.length === 0) {
    lines = [emptyText || "暂无记录"];
  }
  return lines
    .map(function (line) {
      return (
        '<li style="margin:4px 0;color:var(--text-secondary);">' +
        _lifeSystemsEscape(line) +
        "</li>"
      );
    })
    .join("");
}

function _lifeSystemsCard(icon, title, bodyHtml, buttonHtml) {
  return (
    '<section style="border:1px solid var(--border);border-radius:8px;background:var(--bg-card);padding:12px;min-height:170px;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;">' +
    '<h3 style="margin:0;font-size:14px;color:var(--text-primary);">' +
    icon +
    " " +
    title +
    "</h3>" +
    (buttonHtml || "") +
    "</div>" +
    bodyHtml +
    "</section>"
  );
}

function openLifeSystemsPendingNode() {
  var state = StateManager.getState();
  var status =
    typeof getLifeNodeStatus === "function"
      ? getLifeNodeStatus(state)
      : { pending: null };
  var node =
    state._pendingLifeNode ||
    (status.pending &&
      window.LIFE_NODES &&
      window.LIFE_NODES[status.pending.id]);

  if (node && typeof showLifeNodeModal === "function") {
    showLifeNodeModal(node);
    return;
  }
  if (typeof showModal === "function") {
    showModal({
      title: "🎯 人生节点",
      body: '<p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">当前没有待处理的人生节点。<br>随着游戏进行，重要的人生抉择会在此触发：高考、职业转型、婚姻家庭、人生岔路……</p>',
      buttons: [{ text: "知道了", cls: "btn-primary" }],
    });
    return;
  }
  StateManager.addMessage("当前没有待处理的人生节点。", "info");
}

function openLifeSystemsMedicalTreatment() {
  if (typeof showMedicalTreatmentModal === "function") {
    showMedicalTreatmentModal();
    return;
  }
  StateManager.addMessage("医疗治疗入口尚未加载。", "warning");
}

function openLifeSystemsMedicalInsurance() {
  if (typeof showMedicalInsuranceModal === "function") {
    showMedicalInsuranceModal();
    return;
  }
  StateManager.addMessage("医保咨询入口尚未加载。", "warning");
}

function openLifeSystemsTravel() {
  if (typeof showTravelAgencyModal === "function") {
    showTravelAgencyModal();
    return;
  }
  StateManager.addMessage("旅行系统尚未加载。", "warning");
}

function openLifeSystemsLegal() {
  if (typeof showLegalOfficeModal === "function") {
    showLegalOfficeModal();
    return;
  }
  StateManager.addMessage("法律系统尚未加载。", "warning");
}

function openLifeSystemsCityServices() {
  if (
    window.WebAppBridge &&
    typeof window.WebAppBridge.showCityServiceModal === "function"
  ) {
    window.WebAppBridge.showCityServiceModal();
    return;
  }
  if (typeof showModal === "function") {
    showModal({
      title: "🏙️ 城市服务中心",
      body:
        '<div style="font-size:13px;line-height:1.8;">' +
        '<p style="color:var(--text-secondary);">城市服务中心提供以下服务，前往对应地点即可办理：</p>' +
        '<ul style="margin:8px 0;padding-left:18px;color:var(--text-primary);">' +
        "<li>🏥 <strong>医疗就诊</strong> — 前往医院看病，需当前有疾病</li>" +
        "<li>⚖️ <strong>法律咨询</strong> — 前往法律援助中心，需有案件</li>" +
        "<li>🏦 <strong>金融服务</strong> — 前往银行办理贷款/存款</li>" +
        "<li>🎓 <strong>技能培训</strong> — 前往培训中心学习技能</li>" +
        "<li>🏢 <strong>政务办理</strong> — 前往政务大厅办证</li>" +
        "</ul>" +
        '<p style="color:var(--text-muted);font-size:11px;">提示：在「城市」Tab → 对应地点旁可直接进入服务。</p>' +
        "</div>",
      buttons: [{ text: "知道了", cls: "btn-primary" }],
    });
    return;
  }
  StateManager.addMessage("城市服务中心尚未加载。", "warning");
}

function _renderLifeNodePanel(state) {
  var status =
    typeof getLifeNodeStatus === "function"
      ? getLifeNodeStatus(state)
      : { completed: [], pending: null };
  var completed = status.completed || [];
  var lines = [];
  lines.push(
    "已完成节点：" +
      (completed.length
        ? completed
            .map(function (node) {
              return node.icon + node.name;
            })
            .join("、")
        : "暂无"),
  );
  lines.push(
    "待处理节点：" +
      (status.pending ? status.pending.icon + status.pending.name : "暂无"),
  );
  if (typeof getGaokaoNarrative === "function") {
    var narrative = getGaokaoNarrative(state);
    if (narrative) lines.push("高考回忆：" + narrative);
  }
  return _lifeSystemsCard(
    "🎯",
    "人生节点",
    '<ul style="margin:0;padding-left:18px;">' +
      _lifeSystemsLines(lines) +
      "</ul>",
    '<button class="btn btn-sm btn-primary" onclick="openLifeSystemsPendingNode()">处理节点</button>',
  );
}

function _renderMedicalPanel(state) {
  var lines =
    typeof getMedicalSummary === "function"
      ? getMedicalSummary(state)
      : ["医疗系统未加载"];
  var illnesses =
    (state.status && state.status.illnesses && state.status.illnesses.length) ||
    0;
  if (illnesses > 0)
    lines.unshift("当前疾病：" + illnesses + " 种，建议先去医院看病");
  return _lifeSystemsCard(
    "🏥",
    "医疗与医保",
    '<ul style="margin:0;padding-left:18px;">' +
      _lifeSystemsLines(lines, "暂无医疗记录") +
      "</ul>",
    '<div class="life-system-actions" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end;">' +
      '<button class="btn btn-sm btn-primary" onclick="openLifeSystemsMedicalTreatment()">就医治疗</button>' +
      '<button class="btn btn-sm" onclick="openLifeSystemsMedicalInsurance()">医保咨询</button>' +
      "</div>",
  );
}

function _renderTravelPanel(state) {
  var lines =
    typeof getTravelStatus === "function"
      ? getTravelStatus(state)
      : ["旅行系统未加载"];
  return _lifeSystemsCard(
    "✈️",
    "旅行记录",
    '<ul style="margin:0;padding-left:18px;">' +
      _lifeSystemsLines(lines, "暂无旅行记录") +
      "</ul>",
    '<button class="btn btn-sm btn-primary" onclick="openLifeSystemsTravel()">长途旅行</button>',
  );
}

function _renderLegalPanel(state) {
  var lines =
    typeof getLegalSummary === "function"
      ? getLegalSummary(state)
      : ["法律系统未加载"];
  return _lifeSystemsCard(
    "⚖️",
    "法律事务",
    '<ul style="margin:0;padding-left:18px;">' +
      _lifeSystemsLines(lines, "暂无案件记录") +
      "</ul>",
    '<button class="btn btn-sm btn-primary" onclick="openLifeSystemsLegal()">法律咨询</button>',
  );
}

function _renderBridgeRecommendations(state) {
  var bridge = window.WebAppBridge;
  var recs = [];
  if (bridge && typeof bridge.getRecommendedCityServices === "function") {
    recs = bridge.getRecommendedCityServices(state) || [];
  }

  var body = "";
  if (recs.length > 0) {
    body =
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;">' +
      recs
        .map(function (rec) {
          var action = rec.action || {};
          return (
            '<div style="border:1px solid var(--border);border-radius:8px;padding:10px;background:var(--bg-input);">' +
            '<strong style="font-size:13px;color:var(--text-primary);">' +
            _lifeSystemsEscape((action.icon || "🏙️") + " " + action.title) +
            "</strong>" +
            '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">' +
            _lifeSystemsEscape(rec.reason || action.brief || "") +
            "</div>" +
            '<div style="font-size:11px;color:var(--text-muted);margin-top:6px;">' +
            _lifeSystemsMoney(action.cost || 0) +
            " · " +
            (action.apCost || 0) +
            "行动力 · 入口：" +
            _lifeSystemsEscape(_lifeSystemsLocationNames(action.locationIds)) +
            "</div>" +
            "</div>"
          );
        })
        .join("") +
      "</div>";
  } else {
    body =
      '<p style="margin:0;color:var(--text-secondary);font-size:13px;">当前没有强推荐服务。你仍可打开城市服务中心，查看当前地点可用的政务、金融和健康服务。</p>';
  }

  return (
    '<section style="border:1px solid var(--border);border-radius:8px;background:var(--bg-card);padding:12px;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;">' +
    '<h3 style="margin:0;font-size:14px;color:var(--text-primary);">🏙️ 城市服务推荐</h3>' +
    '<button class="btn btn-sm btn-primary" onclick="openLifeSystemsCityServices()">打开服务中心</button>' +
    "</div>" +
    body +
    "</section>"
  );
}

function _renderDataCatalogBridgeStatus() {
  var bridge = window.WebAppBridge;
  if (!bridge || typeof bridge.getDataCatalogSummary !== "function") return "";
  var summary = bridge.getDataCatalogSummary();
  var statusLabel = {
    playable: "可玩",
    partial: "部分接入",
    typed: "仅类型化",
  };
  return (
    '<section style="border:1px solid var(--border);border-radius:8px;background:var(--bg-card);padding:12px;">' +
    '<h3 style="margin:0 0 8px;font-size:14px;color:var(--text-primary);">📂 TypeScript 内容接入状态</h3>' +
    '<div style="display:flex;flex-wrap:wrap;gap:6px;">' +
    (summary.catalogs || [])
      .map(function (catalog) {
        return (
          '<span style="display:inline-flex;gap:4px;align-items:center;border:1px solid var(--border);border-radius:999px;padding:4px 8px;font-size:11px;background:var(--bg-input);">' +
          _lifeSystemsEscape(catalog.name) +
          " · " +
          _lifeSystemsEscape(String(catalog.count)) +
          " · " +
          _lifeSystemsEscape(statusLabel[catalog.status] || catalog.status) +
          "</span>"
        );
      })
      .join("") +
    "</div>" +
    '<p style="margin:8px 0 0;font-size:11px;color:var(--text-muted);">总计 ' +
    _lifeSystemsEscape(String(summary.totalRecords || 0)) +
    " 条 TS 内容；显示为“仅类型化”的目录尚未自动进入旧游戏行动或事件池。</p>" +
    "</section>"
  );
}

function renderLifeSystemsTab(state, parent) {
  if (typeof initMedicalState === "function") initMedicalState(state);
  if (typeof initTravelState === "function") initTravelState(state);
  if (typeof initLegalState === "function") initLegalState(state);

  var wrap = document.createElement("div");
  wrap.style.cssText =
    "padding:12px;display:flex;flex-direction:column;gap:12px;";
  wrap.innerHTML =
    '<section style="border:1px solid var(--border);border-radius:8px;background:var(--bg-secondary);padding:12px;">' +
    '<h2 style="margin:0 0 6px;font-size:16px;color:var(--text-primary);">🧭 人生事务</h2>' +
    '<p style="margin:0;color:var(--text-secondary);font-size:13px;line-height:1.6;">集中查看会影响长期人生的事务：关键节点、医保治疗、旅行记录、法律案件，以及城市公共服务。</p>' +
    "</section>" +
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;">' +
    _renderLifeNodePanel(state) +
    _renderMedicalPanel(state) +
    _renderTravelPanel(state) +
    _renderLegalPanel(state) +
    "</div>" +
    _renderBridgeRecommendations(state);

  parent.appendChild(wrap);
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

  // 属性说明（v3.0：心智→能力，新增魅力/道德，标题"属性"取代"基础属性"）
  var statSummary = document.createElement("div");
  statSummary.style.cssText = "flex:1;min-width:0;padding-top:28px;";
  var stats = [
    { label: "体质", value: p.physique, color: "#c4803a" },
    { label: "智力", value: p.intelligence, color: "#5a8ab4" },
    { label: "敏捷", value: p.agility, color: "#5aaa5a" },
    { label: "能力", value: p.mental, color: "#9b74b8" },
    { label: "魅力", value: (p && p.charm) || 20, color: "#e08aa8" },
    { label: "名气", value: (p && p.fame) || 0, color: "#d4a017" },
    { label: "道德", value: (p && p.morality) || 50, color: "#6ac49a" },
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
  var assetSnapshot =
    typeof getInvestmentAssetSnapshot === "function"
      ? getInvestmentAssetSnapshot(state)
      : null;
  var totalAsset = assetSnapshot
    ? Math.round(assetSnapshot.totalAssets)
    : (state.resources.cash || 0) + (state.resources.bankBalance || 0);
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
      // [全系统自洽修复] 域A 联动增强#3: A→D NPC礼物偏好提示
      var _giftHint = "";
      if (npc.giftPrefers && Array.isArray(npc.giftPrefers) && npc.giftPrefers.length > 0) {
        var _giftIcons = { fruits: "🍎", daily_use: "🧴", snacks: "🍪", cigarettes: "🚬", beer: "🍺", clothing: "👔", electronics: "📱", vegetables: "🥬", luxury: "💎", instant_noodles: "🍜" };
        var _prefIcons = [];
        for (var _gpi = 0; _gpi < Math.min(2, npc.giftPrefers.length); _gpi++) {
          _prefIcons.push(_giftIcons[npc.giftPrefers[_gpi]] || "🎁");
        }
        _giftHint = ' <span style="font-size:9px;color:var(--text-muted);">' + _prefIcons.join("") + "</span>";
      }
      npcHtml +=
        '<div style="background:var(--bg-input);border-radius:6px;padding:8px;border:1px solid var(--border);">' +
        '<div style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:4px;">' +
        _esc(npc.name) +
        " " +
        affLabel +
        _giftHint +
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
    drawAssetLineChart(
      lineCanvas.getContext("2d"),
      state,
      0,
      0,
      lineCanvas.width,
      lineCanvas.height,
    );

    // 使用data_viz雷达图（支持职场属性 + 历史对比）
    drawRadarChart(
      radarCanvas.getContext("2d"),
      state,
      0,
      0,
      radarCanvas.width,
      radarCanvas.height,
      p.phase,
    );

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

/** 时间槽 + 住所/背包信息 */
/**
 * 移动端位置+背包状态行（时间指示器下方）
 * 结构：🎒 X/Y · 🌃 住所名  （常显，一目了然）
 */
// [全系统自洽修复] 域F 修复: renderLocationBar 已迁移至 render_infra.js（含位置名+天气预报），
// 此处旧版本删除避免覆盖（render.js 后加载）
// 如需修改移动端位置栏，请改 render_infra.js 中的版本

/**
 * 移动端常驻状态条（位置/背包 与 人生目标 之间）
 * 结构：2 行 × 5 条，每条「细标签 + 细色带 + 数值」
 *  第1行：体/智/敏/心/魅  5基础属性
 *  第2行：饿/疲/卫/情/健  5状态
 * 与侧栏 #stat-* 采用同一 CSS 色梯度类、同一预警阈值
 */
function renderTimeSlot(state, parent) {
  // [全系统自洽修复] 域G A类#4: renderTimeSlot 守卫 — state.player 可能未初始化
  if (!state || !state.player) {
    if (parent) parent.innerHTML = '<div style="padding:6px 12px;font-size:12px;color:var(--text-muted);">📅 第 1 天</div>';
    return;
  }
  const slotNames = {
    morning: "☀️ 上午",
    afternoon: "🌤️ 下午",
    evening: "🌙 晚上",
  };
  const slot = state.player.timeSlot;
  const div = document.createElement("div");
  div.id = "time-slot-indicator";

  // 住所数据（用于 "· Qn" 企业季标签）
  var phaseLabel =
    state.player.phase === "corporate" ? ` · Q${state.player.corpQuarter || 1}` : "";

  const ap = state.player.actionPoints || 0;
  const maxAp = state.player.maxActionPoints || 100;
  // 低AP闪烁警告（≤20时加CSS闪烁动画）
  const lowAp = ap <= 20 && ap > 0;
  const apColor =
    ap > 50 ? "var(--success)" : ap > 20 ? "var(--warning)" : "var(--danger)";
  // 底部独立行：🎒 背包 / 🌃 已提取到 renderLocationBar，此处仅保留日期 + 时段 + AP
  div.style.cssText = `display:flex;align-items:center;gap:6px;padding:6px 12px;background:var(--bg-card);border-radius:8px;margin-bottom:6px;${lowAp ? "border:2px solid var(--warning);box-shadow:0 0 12px rgba(196,154,58,0.35);animation:ap-blink-border 1.5s infinite;" : "border:1px solid var(--border);"}`;
  div.innerHTML = `
    <span style="white-space:nowrap;">📅 第 <strong>${state.player.day}</strong> 天</span>
    ${typeof getEmotionIcon === "function" && typeof getEmotionName === "function" ? `<span style="font-size:14px;line-height:1;cursor:help;" title="情绪: ${getEmotionName(state)}">${getEmotionIcon(state)}</span>` : typeof getEmotionIcon === "function" ? `<span style="font-size:14px;line-height:1;">${getEmotionIcon(state)}</span>` : ""}
    <span style="color:var(--text-muted);">|</span>
    <span class="time-slot-badge ${slot}">${slotNames[slot]}</span>
    <span style="white-space:nowrap;font-size:12px;margin-left:auto;">
      ⚡ <strong style="color:${apColor};${lowAp ? "animation:ap-blink 0.8s infinite;" : ""}">${ap}</strong>/${maxAp}
      ${lowAp ? `<span style="font-size:10px;color:var(--warning);animation:ap-blink 0.8s infinite;">⚠</span>` : ""}
    </span>
    ${phaseLabel ? `<span style="font-size:10px;color:var(--text-muted);margin-left:2px;">${phaseLabel}</span>` : ""}
  `;
  parent.appendChild(div);
}

/** 在内容区时间槽下方显示人生目标（🌟 紧凑横条） */
function renderGoalStrip(state, parent) {
  if (typeof getCurrentDream !== "function") return;
  var dream = getCurrentDream(state);
  if (!dream) return;
  var progress = (typeof getDreamProgress === "function" ? getDreamProgress(state) : 0) || 0;
  // [全系统自洽修复] 域F A类#2: 确保 progress 是有效数字，NaN/null→0
  if (typeof progress !== "number" || !isFinite(progress)) progress = 0;
  var curTitle =
    typeof getDreamCurrentTitle === "function"
      ? getDreamCurrentTitle(state)
      : "";
  var div = document.createElement("div");
  div.className = "goal-strip-mobile";
  div.style.cssText =
    "display:flex;align-items:center;gap:8px;padding:4px 12px;margin:0 0 6px 0;background:rgba(74,158,92,0.06);border-radius:8px;font-size:12px;";
  div.innerHTML =
    '<span style="font-weight:600;color:var(--accent);white-space:nowrap;">🌟 人生目标</span>' +
    '<span style="font-size:11px;">' +
    (dream.icon || "🎯") +
    " " +
    (dream.name || "未设定") +
    "</span>" +
    '<div style="flex:1;max-width:160px;height:5px;background:var(--bg-input);border-radius:3px;overflow:hidden;">' +
    '<div style="width:' +
    progress +
    '%;height:100%;background:var(--accent);border-radius:3px;"></div>' +
    "</div>" +
    '<span style="font-size:10px;color:var(--text-muted);white-space:nowrap;">' +
    progress +
    "%</span>" +
    (curTitle
      ? '<span style="font-size:10px;color:var(--text-secondary);">· ' +
        curTitle +
        "</span>"
      : "");
  parent.appendChild(div);
}

function renderActiveNews(state, parent) {
  // v3.97: 移动端最多展示 1 条新闻，避免把「🎯 当前目标」和行动卡片挤出首屏
  const _isMob = typeof window !== "undefined" && window.innerWidth <= 768;
  let _shown = 0;
  const _maxN = _isMob ? 1 : 99;
  if (state.activeNews && state.activeNews.length > 0) {
    for (const news of state.activeNews) {
      if (news._isIntroNews) continue;
      if (_shown >= _maxN) break;
      // [全系统自洽修复] 域F A类#2: 新闻物件可能不含 headline（格式异常）
      if (!news || !news.headline) continue;
      const banner = document.createElement("div");
      banner.className = "news-banner";
      banner.innerHTML =
        '<span class="news-icon">📰</span> ' + _esc(news.headline);
      parent.appendChild(banner);
      _shown++;
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

  // [全系统自洽修复] 域F R69 联动增强1: 极温天气预警（G→F 天气系统可视化）
  (function () {
    var weather = state.weather || {};
    var current = weather.current || "sunny";
    var temperature = weather.temperature;
    var tempWarning = null;
    if (isFinite(temperature)) {
      if (temperature > 38) tempWarning = "🔥 极高温！注意防暑降温，多喝水，避免长时间户外暴晒";
      else if (temperature > 35) tempWarning = "⚠️ 高温预警！户外活动可能消耗额外体力";
      else if (temperature < -10) tempWarning = "❄️ 极寒天气！注意保暖，外出增加衣物消耗";
      else if (temperature < 0) tempWarning = "🌨️ 寒冷天气！注意防滑保暖";
    }
    // 极端天气视觉提示
    var severeWeathers = ["storm", "heavy_rain", "heavy_smog", "foggy", "sandstorm"];
    if (severeWeathers.indexOf(current) >= 0) {
      var severeMsgs = {
        storm: "⛈️ 暴风雨！减少外出，注意财产安全",
        heavy_rain: "🌧️ 大雨！路面湿滑，交通时间延长",
        heavy_smog: "🌫️ 重度雾霾！建议戴口罩，减少户外运动",
        foggy: "🌫️ 大雾！能见度低，出行注意安全",
        sandstorm: "🌪️ 沙尘暴！紧闭门窗，避免外出",
      };
      if (severeMsgs[current]) tempWarning = severeMsgs[current];
    }
    if (tempWarning) {
      var warnDiv = document.createElement("div");
      warnDiv.className = "weather-warning-banner";
      warnDiv.style.cssText = "font-size:11px;padding:4px 8px;margin:2px 0;background:rgba(196,85,61,0.08);border-left:3px solid var(--danger);border-radius:4px;color:var(--danger);";
      warnDiv.textContent = tempWarning;
      parent.appendChild(warnDiv);
    }
  })();

  // [全系统自洽修复] 域F R69 联动增强2: 情绪状态每日目标引导（G→F 情绪系统可视化）
  (function () {
    var status = state.status || {};
    var emo = status.emotionalState;
    if (!emo) return;
    var emotionHints = {
      depressed: "💭 情绪低落——试试去公园散步或与朋友聊天，心情恢复后工作效率更高",
      sad: "😔 心情一般——做件让自己开心的小事吧，心情好才能事半功倍",
      anxious: "😰 焦虑不安——深呼吸，去寺庙静心或做次按摩，心静自然凉",
      calm: "😌 平静如水——很好的状态，适合处理复杂事务",
      happy: "😊 心情愉悦——趁现在多做一些需要创造力的事",
      elated: "🌟 兴奋不已——巅峰状态！抓住机会做件大事",
      stressed: "😫 压力山大——别硬扛，休息一天比硬撑效率高",
    };
    var hint = emotionHints[emo];
    if (hint) {
      var emoDiv = document.createElement("div");
      emoDiv.className = "emotion-hint-banner";
      emoDiv.style.cssText = "font-size:11px;padding:4px 8px;margin:2px 0;background:rgba(90,138,180,0.08);border-left:3px solid var(--info);border-radius:4px;color:var(--info);";
      emoDiv.textContent = hint;
      parent.appendChild(emoDiv);
    }
  })();
}

// ====== Actions Tab ======
var _esc = _esc || function _esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

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
    urgent.push("🍚 饥饿极高！再不吃东西会晕倒，先找食物！");
  else if (needs.hunger <= 30) tips.push("🍚 已经很饿了，记得先吃顿饭再干活。");
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

  // === 今日重点整合（原daily_focus内容）===
  // 装备耐久预警
  var equipped = (state.inventory && state.inventory.equipment) || {};
  Object.keys(equipped).forEach(function (slot) {
    var inst =
      typeof getEquippedInstance === "function"
        ? getEquippedInstance(state, slot)
        : null;
    if (
      !inst ||
      typeof inst.durability !== "number" ||
      typeof inst.maxDurability !== "number" ||
      inst.maxDurability <= 0
    )
      return;
    var pct = inst.durability / inst.maxDurability;
    if (pct < 0.2) {
      var def =
        typeof getItemById === "function" ? getItemById(inst.itemId) : null;
      var nm = (def && def.name) || inst.itemId;
      urgent.push(
        "🔧 " + nm + "耐久仅" + Math.round(pct * 100) + "%，快修理别报废！",
      );
    }
  });
  // 露宿街头提示
  var currentTier = state.housing ? state.housing.tier || 0 : 0;
  if (currentTier === 0 && day > 3) {
    urgent.push("💡露宿街头不利于身心健康，请至少去城中村升级为🛏️合租床位");
  }
  // 35岁危机预警
  if (p.phase === "street" && p.age >= 33 && p.age < 36) {
    tips.push("⏳ 接近35岁分水岭，现在还来得及转型或上岸！");
  }
  // 极低属性预警
  if ((p.intelligence || 0) < 15 && day > 20) {
    tips.push(
      "📚 智力过低（" + (p.intelligence || 0) + "），去图书馆或夜校提升一下。",
    );
  }
  if ((p.physique || 0) < 15 && day > 20) {
    tips.push(
      "💪 体质过低（" +
        (p.physique || 0) +
        "），影响体力工作，多锻炼或补充营养。",
    );
  }
  // 梦想进度
  if (typeof getDreamProgress === "function" && day > 30) {
    try {
      var dreamProg = getDreamProgress(state);
      if (dreamProg >= 60 && dreamProg < 100) {
        tips.push("🌟 梦想进度 " + dreamProg + "%！继续努力完成下一阶段。");
      }
    } catch (e) {}
  }

  // ===== 基础层建议（mental≥0，所有人可见）=====

  // 天气
  if (state.weather) {
    var wid = state.weather.current;
    if (wid === "rainy" || wid === "stormy" || wid === "plum_rain") {
      tips.push("🌧️ 今天下雨，室内工作比户外更合适。");
    } else if (wid === "sunny") {
      if (typeof getVendingFootfallMod === "function") {
        var mod = getVendingFootfallMod(loc, state);
        if (mod > 1.2) tips.push("☀️ 天气晴好，客流量高，今天摆摊收益不错！");
      }
    } else if (wid === "heatwave") {
      tips.push("🥵 高温天气，多备点水，户外劳动注意防暑。");
    } else if (wid === "cold_snap" || wid === "snowy") {
      tips.push("🧊 寒潮来袭，厚衣物和泡面很畅销，可以考虑囤货出售。");
    } else if (wid === "typhoon") {
      tips.push("🌀 台风天，所有室外工作暂停，注意安全！");
    } else if (wid === "heavy_smog" || wid === "sandstorm") {
      tips.push("😷 空气质量差，佩戴口罩减少户外活动。");
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
                "天！提前准备相关商品或攒行动力。",
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

  // 保底建议：凑齐 8 条让面板内容充实
  var combined = urgent.concat(tips);
  var _BASELINE_TIPS = [
    "⚡ 行动力最多100点，合理规划才能最大化每天收益，别浪费！",
    "🏦 把闲置现金存进银行，每天自动生息，长期积累很可观。",
    "📅 周末（7的倍数天）公园和商业区客流翻倍，是摆摊赚钱的好时机。",
    "🎒 背包满了无法继续拾荒或进货，及时去市场出售减轻负重。",
    "🤝 和NPC多打交道——好感提升后会解锁独家情报和特殊机会。",
    "📚 技能越高，工作收入越高；技能接近升级时重点刷该技能工作。",
    "🏠 住所越好，每日疲劳/卫生恢复越快，间接提高打工效率。",
    "💊 保持健康！生病期间工作效率大幅下降，去诊所比硬撑划算。",
    "🌤️ 天气决定客流——晴天摆摊/雨天做室内工作，顺势而为收益更高。",
    "💡 存够¥5000后可以解锁进阶玩法，优先攒钱是最快的发展路径。",
  ];
  var needed = 8 - combined.length;
  if (needed > 0) {
    var _dayOffset =
      ((state.player && state.player.day) || 0) % _BASELINE_TIPS.length;
    for (var bi = 0; bi < needed && bi < _BASELINE_TIPS.length; bi++) {
      combined.push(_BASELINE_TIPS[(_dayOffset + bi) % _BASELINE_TIPS.length]);
    }
  }
  return combined;
}

// ── 引导面板：三格横排常驻（阶段 | 当前目标 | 今日建议），无需展开 ──────────────
function renderGuidanceBar(state, parent) {
  var _SM = {
    survival: { icon: "🌱", label: "初来乍到" },
    debt: { icon: "💪", label: "站稳脚跟" },
    growth: { icon: "🚀", label: "积累成长" },
    corporate: { icon: "🏢", label: "职场打拼" },
    advanced: { icon: "🏆", label: "有头有脸" },
  };
  var p = state.player,
    r = state.resources || {};
  var cash = (r.cash || 0) + (r.bankBalance || 0);
  var debt = (r.villageDebt || r.debt || 0) + (r.bankDebt || 0);
  var stageId =
    p.day <= 7
      ? "survival"
      : debt > 0
        ? "debt"
        : p.phase === "corporate"
          ? cash >= 50000
            ? "advanced"
            : "corporate"
          : "growth";
  var si = _SM[stageId] || _SM.survival;

  var dream =
    typeof getCurrentDream === "function" ? getCurrentDream(state) : null;
  var progress =
    dream && typeof getDreamProgress === "function"
      ? Math.round(getDreamProgress(state))
      : 0;
  var tips = getDailyActionTips(state);
  var mental = (state.player && state.player.mental) || 0;

  var bar = document.createElement("div");
  bar.className = "guidance-bar";

  var row = document.createElement("div");
  row.className = "gb-row";
  bar.appendChild(row);

  // ── 格1：阶段（高亮 + 定位标记）──
  var c1 = document.createElement("div");
  c1.className = "gb-cell gb-cell-stage gb-cell-active";

  var stageTitle = document.createElement("div");
  stageTitle.className = "gb-cell-title";
  stageTitle.textContent = "当前阶段";
  c1.appendChild(stageTitle);

  // 定位针
  var stagePin = document.createElement("div");
  stagePin.className = "gb-cell-pin";
  stagePin.innerHTML = "📍 <strong>" + si.icon + " " + si.label + "</strong>";
  c1.appendChild(stagePin);

  // 人生旅程弧（横向滚动小点）
  if (typeof window !== "undefined" && window.renderLifeArcStrip) {
    var arcWrap = document.createElement("div");
    arcWrap.className = "gb-arc-wrap";
    window.renderLifeArcStrip(state, arcWrap);
    c1.appendChild(arcWrap);
  }

  // 人生目标进度
  if (dream) {
    var goalRow = document.createElement("div");
    goalRow.style.cssText =
      "display:flex;align-items:center;gap:5px;margin-top:4px;";
    goalRow.innerHTML =
      '<span style="font-size:10px;color:var(--text-muted);white-space:nowrap;">' +
      _esc(dream.icon + " " + dream.name) +
      "</span>" +
      '<div style="flex:1;height:3px;background:var(--bg-input);border-radius:2px;overflow:hidden;">' +
      '<div style="width:' +
      progress +
      '%;height:100%;background:var(--accent);border-radius:2px;"></div>' +
      "</div>" +
      '<span style="font-size:9px;color:var(--text-muted);">' +
      progress +
      "%</span>";
    c1.appendChild(goalRow);
  }

  row.appendChild(c1);

  // ── 格2：当前目标（高亮）──
  var c2 = document.createElement("div");
  c2.className = "gb-cell gb-cell-quest gb-cell-active";

  var questTitle = document.createElement("div");
  questTitle.className = "gb-cell-title";
  questTitle.textContent = "当前目标"; // 🎯 已在 renderDailyQuestCard 内部显示，不重复
  c2.appendChild(questTitle);

  if (typeof window !== "undefined" && window.renderDailyQuestCard) {
    var questWrap = document.createElement("div");
    questWrap.className = "gb-quest-inner";
    window.renderDailyQuestCard(state, questWrap);
    c2.appendChild(questWrap);
  }

  row.appendChild(c2);

  // ── 格3：今日建议 ──
  var c3 = document.createElement("div");
  c3.className = "gb-cell gb-cell-tips";

  var mentalTag =
    mental >= 80 ? "🧠 专家洞察" : mental >= 60 ? "💡 进阶建议" : "💡 今日建议";
  var tipsTitle = document.createElement("div");
  tipsTitle.className = "gb-cell-title";
  tipsTitle.textContent = mentalTag;
  c3.appendChild(tipsTitle);

  if (tips.length > 0) {
    // 轮播式显示：一次显示一条，每2秒切换
    var tipInner = document.createElement("div");
    tipInner.className = "gb-tips-inner gb-tips-cycle";
    var tipDisplay = document.createElement("div");
    tipDisplay.className = "gb-tip-display";
    tipDisplay.setAttribute("aria-live", "polite");
    tipDisplay.setAttribute("role", "status");
    tipDisplay.textContent = tips[0];
    tipInner.appendChild(tipDisplay);

    var dotRow = document.createElement("div");
    dotRow.style.cssText =
      "display:flex;gap:3px;margin-top:4px;justify-content:center;flex-wrap:wrap;";
    tips.forEach(function (_, i) {
      var dot = document.createElement("span");
      dot.className = "gb-tip-dot" + (i === 0 ? " active" : "");
      dotRow.appendChild(dot);
    });
    tipInner.appendChild(dotRow);

    // 所有建议列表（折叠展开）
    var allTipsWrap = document.createElement("div");
    allTipsWrap.className = "gb-tips-all-wrap";
    allTipsWrap.style.display = "none";
    tips.forEach(function (t) {
      var trow = document.createElement("div");
      trow.style.cssText =
        "font-size:11px;color:var(--text-secondary);padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.04);line-height:1.4;";
      trow.textContent = t;
      allTipsWrap.appendChild(trow);
    });
    tipInner.appendChild(allTipsWrap);

    // 展开全部按钮
    var expandBtn = document.createElement("div");
    expandBtn.style.cssText =
      "font-size:10px;color:var(--accent);cursor:pointer;margin-top:3px;text-align:center;";
    expandBtn.textContent = "展开全部" + tips.length + "条";
    var expanded = false;
    expandBtn.onclick = function () {
      expanded = !expanded;
      allTipsWrap.style.display = expanded ? "" : "none";
      dotRow.style.display = expanded ? "none" : "";
      tipDisplay.style.display = expanded ? "none" : "";
      expandBtn.textContent = expanded
        ? "收起"
        : "展开全部" + tips.length + "条";
    };
    tipInner.appendChild(expandBtn);

    c3.appendChild(tipInner);

    // 启动轮播
    var _tipIdx = 0;
    var _tipTimer = setInterval(function () {
      if (!tipInner.isConnected) {
        clearInterval(_tipTimer);
        return;
      }
      if (expanded) return;
      _tipIdx = (_tipIdx + 1) % tips.length;
      tipDisplay.style.animation = "none";
      tipDisplay.offsetHeight; // reflow
      tipDisplay.style.animation = "";
      tipDisplay.textContent = tips[_tipIdx];
      dotRow.querySelectorAll(".gb-tip-dot").forEach(function (d, i) {
        d.classList.toggle("active", i === _tipIdx);
      });
    }, 4500);
  } else {
    var noTip = document.createElement("div");
    noTip.style.cssText = "font-size:11px;color:var(--text-muted);";
    noTip.textContent = "暂无紧急建议，继续当前计划。";
    c3.appendChild(noTip);
  }

  row.appendChild(c3);
  parent.appendChild(bar);
}

function renderActionsTab(state, parent) {
  try {
    // 防御性检查：state.trade/state.player 未初始化
    if (!state || !state.trade || !state.player) {
      parent.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">⚡ 游戏状态尚未完全初始化，请稍后再试。</div>';
      return;
    }
    // 游戏已结束，显示提示
    if (state.flags && state.flags.gameOver) {
      parent.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">💀 游戏已结束，请刷新页面重新开始。</div>';
      return;
    }
    var actions = getAvailableActions(state);

    // === F→G 联动: 健康/疲劳预警横幅 ===
    var _health = state.status && state.status.health;
    var _fatigue = state.needs && state.needs.fatigue;
    var _warnings = [];
    if (_health !== undefined && _health <= 30) {
      _warnings.push("🏥 健康 " + _health + "%，危险！立即就医！");
    }
    if (_fatigue !== undefined && _fatigue >= 85) {
      _warnings.push("😴 疲劳 " + _fatigue + "%，快撑不住了！休息！");
    }
    if (_warnings.length > 0) {
      var _warnBar = document.createElement("div");
      _warnBar.style.cssText = "margin-bottom:10px;padding:8px 12px;background:rgba(196,61,61,0.12);border:1px solid rgba(196,61,61,0.3);border-radius:8px;font-size:12px;font-weight:600;color:var(--danger);line-height:1.5;";
      _warnBar.textContent = _warnings.join(" ");
      parent.appendChild(_warnBar);
    }

  // 移除"地点不符"的冗余行动（不在当前地点的行动直接不展示）
  actions = actions.filter(function (a) {
    return !(
      a.disabled &&
      a.reqFail &&
      typeof a.reqFail === "string" &&
      a.reqFail.indexOf("地点不符") === 0
    );
  });

  // === 引导面板（今日建议/当前目标/当前阶段）===
  renderGuidanceBar(state, parent);

  // === 地点氛围描写（放在引导面板之后，不遮挡主要信息）===
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

  // === 频次追踪 + 智能排序 ===
  if (typeof ActionSort !== "undefined" && ActionSort.sortActions) {
    // 包装所有行动的 handler，记录点击频次 + 最近使用时间
    var freq =
      state.stats && state.stats.actionFreq ? state.stats.actionFreq : {};
    var firstUse =
      state.stats && state.stats.actionFirstUse
        ? state.stats.actionFirstUse
        : {};
    var lastUse =
      state.stats && state.stats.actionLastUse
        ? state.stats.actionLastUse
        : {};
    if (state.stats && !state.stats.actionLastUse) {
      state.stats.actionLastUse = {};
    }

    for (var _ai = 0; _ai < actions.length; _ai++) {
      (function (_act) {
        if (_act.id && !_act.disabled && typeof _act.handler === "function") {
          var _orig = _act.handler;
          var _aid = _act.id;
          _act.handler = function () {
            if (typeof freq[_aid] === "undefined") {
              freq[_aid] = 0;
              if (state && state.player) firstUse[_aid] = state.player.day;
            }
            freq[_aid]++;
            // 记录最近使用天
            if (state && state.player) {
              lastUse[_aid] = state.player.day;
            }
            return _orig.apply(this, arguments);
          };
        }
      })(actions[_ai]);
    }

    // 多层排序
    actions = ActionSort.sortActions(actions, state);
  }

  // === 🏃 最近行动（显示最近使用的 5 个行动） ===
  if (state.stats && state.stats.actionLastUse) {
    var lastUseMap = state.stats.actionLastUse;
    var recentActionIds = Object.keys(lastUseMap).filter(function (id) {
      return lastUseMap[id] > 0;
    });
    // 按最近使用天降序排序
    recentActionIds.sort(function (a, b) {
      return (lastUseMap[b] || 0) - (lastUseMap[a] || 0);
    });
    // 取前N个（手机端4个，桌面端5个）
    var _recentMax = window.innerWidth <= 768 ? 4 : 5;
    var topRecentIds = recentActionIds.slice(0, _recentMax);
    if (topRecentIds.length > 0) {
      var recentActions = [];
      for (var _ri = 0; _ri < topRecentIds.length; _ri++) {
        for (var _aj2 = 0; _aj2 < actions.length; _aj2++) {
          if (actions[_aj2].id === topRecentIds[_ri]) {
            recentActions.push(actions[_aj2]);
            break;
          }
        }
      }
      if (recentActions.length > 0) {
        var recentBox = document.createElement("div");
        recentBox.style.cssText =
          "margin-bottom:14px;padding:10px 14px;background:linear-gradient(135deg, rgba(52,152,219,0.06), rgba(46,204,113,0.04));border:1px solid rgba(52,152,219,0.25);border-radius:var(--radius-md);";
        var recentTitle = document.createElement("div");
        recentTitle.style.cssText =
          "font-size:11px;color:var(--info);font-weight:700;margin-bottom:6px;letter-spacing:0.5px;";
        recentTitle.innerHTML =
          "🏃 最近行动 <span style='font-size:9px;color:var(--text-muted);font-weight:400;'>（最近 " + _recentMax + " 个，按使用时间排序）</span>";
        recentBox.appendChild(recentTitle);
        var recentGrid = document.createElement("div");
        recentGrid.className = "action-cards";
        recentGrid.style.gridTemplateColumns =
          "repeat(auto-fill, minmax(160px, 1fr))";
        for (var _rn = 0; _rn < recentActions.length; _rn++) {
          recentGrid.appendChild(createActionCard(recentActions[_rn], state));
        }
        recentBox.appendChild(recentGrid);
        parent.appendChild(recentBox);
      }
    }
  }

  // 分离住所/仓储（出行已整合到城市地图）
  const housingActions = actions.filter(
    (a) => a.id.startsWith("housing_") || a.id.startsWith("storage_"),
  );
  const nonTravelActions = actions.filter(
    (a) =>
      !a.id.startsWith("travel_") &&
      !a.id.startsWith("housing_") &&
      !a.id.startsWith("storage_"),
  );

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

  // === 分类行动（地点感知重排） ===
  if (nonTravelActions.length > 0 && typeof ActionSort !== "undefined") {
    var groups = ActionSort.groupActionsByCategory(nonTravelActions, state);
    var locKey_cat = state.trade && state.trade.currentLocation;
    var cats =
      typeof ActionSort.getLocationCategories === "function"
        ? ActionSort.getLocationCategories(locKey_cat)
        : ActionSort.CATEGORIES || [];

    // === 分类置顶提示（展示当前地点的分类编排策略） ===
    if (
      locKey_cat &&
      typeof ActionSort.getLocationCategoryHint === "function"
    ) {
      var catHintText = ActionSort.getLocationCategoryHint(locKey_cat);
      if (catHintText) {
        var catHintBox = document.createElement("div");
        catHintBox.style.cssText =
          "margin-bottom:10px;padding:6px 10px;background:rgba(74,158,92,0.04);border:1px solid rgba(74,158,92,0.12);border-radius:var(--radius-sm);font-size:11px;color:var(--text-muted);text-align:center;";
        catHintBox.textContent = catHintText;
        parent.appendChild(catHintBox);
      }
    }

    // 按分类顺序渲染
    for (var _ci = 0; _ci < cats.length; _ci++) {
      var catId = cats[_ci].id;
      var catActions = groups[catId];
      if (!catActions || catActions.length === 0) continue;

      // 分类标题
      var catHeader = document.createElement("div");
      catHeader.className = "action-category-header";
      catHeader.innerHTML =
        cats[_ci].icon +
        " " +
        cats[_ci].name +
        '<span class="cat-count">' +
        catActions.length +
        "</span>";
      parent.appendChild(catHeader);

      // 分类内行动卡片网格
      var catGrid = document.createElement("div");
      catGrid.className = "action-cards";
      for (var _aj = 0; _aj < catActions.length; _aj++) {
        catGrid.appendChild(createActionCard(catActions[_aj], state));
      }
      parent.appendChild(catGrid);
    }
  } else if (nonTravelActions.length > 0) {
    // 兜底：如果 ActionSort 未加载，保持旧平铺模式
    var fallbackLabel = document.createElement("h3");
    fallbackLabel.style.cssText =
      "color:var(--text-muted);margin-bottom:6px;font-size:13px;";
    fallbackLabel.textContent = "⚡ 行动";
    parent.appendChild(fallbackLabel);

    var fallbackCards = document.createElement("div");
    fallbackCards.className = "action-cards";
    for (var _ak = 0; _ak < nonTravelActions.length; _ak++) {
      fallbackCards.appendChild(createActionCard(nonTravelActions[_ak], state));
    }
    parent.appendChild(fallbackCards);
  }

  } catch (e) {
    console.error("[renderActionsTab] 渲染异常:", e);
    console.error("[renderActionsTab] 错误详情:", e.message, e.stack);
    parent.innerHTML += '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">⚡ 行动加载异常 (' + (e.message || '未知错误') + ')，请刷新页面重试</div>';
  }
}

function createActionCard(action, state) {
  const card = document.createElement("div");
  card.className = "action-card";
  // v3.0 引导系统需要：在卡片上加 data-action-id 让 tutorial.js 能定位
  if (action.id) card.dataset.actionId = action.id;
  // 行动卡片悬停说明
  var _titleParts = [(action.icon || "⚡") + " " + action.name];
  if (action.desc) _titleParts.push("— " + action.desc);
  if (action.apCost) _titleParts.push("⚇ 消耗行动力:" + action.apCost);
  if (action.payEstimate) _titleParts.push("💰 收益:" + action.payEstimate);
  if (action.costEstimate) _titleParts.push("💸 花费:¥" + action.costEstimate);
  card.title = _titleParts.join(" ");
  if (action.disabled) {
    card.classList.add("disabled");
  }

  // v3.70 热招工作高亮
  if (
    state &&
    state.flags &&
    state.flags._dailyHotJob &&
    state.flags._dailyHotJob.jobId === action.id
  ) {
    card.classList.add("card-hot");
  }

  // 新行动标记
  var isNew = false;
  if (typeof ActionSort !== "undefined" && ActionSort.isActionNew && state) {
    isNew = ActionSort.isActionNew(action.id, state);
  }

  // ====== 效果描述字段：智能区分"金钱收益"和"属性效果" ======
  function isMoneyValue(v) {
    if (!v) return false;
    // 以数字开头、含 ¥、或形如 "0~100" "0或50万" 视为金钱
    return /^[\d¥\-]/.test(v) || /^\d+(~|或)/.test(v);
  }

  var payHtml = "";
  if (action.payEstimate) {
    if (isMoneyValue(action.payEstimate)) {
      payHtml = `<span class="pay-estimate">💰 ¥${action.payEstimate}</span>`;
    } else {
      payHtml = `<span class="effect-estimate">📈 ${action.payEstimate}</span>`;
    }
  }

  // effectEstimate 新字段：纯属性效果（优先于 payEstimate 中的属性描述）
  var effectHtml = "";
  if (action.effectEstimate) {
    effectHtml = `<span class="effect-estimate">📈 ${action.effectEstimate}</span>`;
  }

  card.innerHTML = `
    <div class="card-icon">${action.icon}</div>
    <div class="card-title">${action.name}${isNew ? ' <span class="badge-new">✨新</span>' : ""}</div>
    <div class="card-desc">${action.desc}</div>
    <div class="card-meta">
      ${action.apCost ? `<span class="ap-cost">⚡${action.apCost}</span>` : ""}
      ${action.costEstimate ? `<span class="cost-estimate">💸 ¥${action.costEstimate}</span>` : ""}
      ${effectHtml}${payHtml}
      ${action.reqFail ? `<span class="req-fail">⚠ ${action.reqFail}</span>` : ""}
    </div>
    ${action.pricePreview ? `<div class="price-preview">${action.pricePreview}</div>` : ""}
    ${action.payTags && action.payTags.length > 0 ? `<div style="font-size:10px;color:var(--accent);margin-top:3px;letter-spacing:0.3px;line-height:1.4;">💡 ${action.payTags.join(" · ")}</div>` : ""}
  `;

  if (!action.disabled) {
    card.addEventListener("click", () => {
      if (action.handler) {
        action.handler();
        renderAll();
      } else {
        // [约定式自动归类] 幽灵按钮检测：正常卡牌无 handler = 幽灵按钮
        console.warn(
          "⚠️ [幽灵按钮] 行动",
          action.id || "(无ID)",
          "未禁用但无 handler — 请检查 action 定义",
        );
      }
    });
  }

  return card;
}

// ====== Map Tab =====
function renderMapTab(state, parent) {
  // [全系统自洽修复] 域F A类#3: state.trade可能未初始化（初始状态/旧存档）
  if (!state.trade) { parent.innerHTML = '<p style="color:var(--text-muted);padding:20px;text-align:center;">🗺️ 地图加载中...</p>'; return; }
  const locKey = state.trade && state.trade.currentLocation;
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

  // 服务标签 + 声望条（从 sidebar 迁移到地图 Tab 顶部）
  appendLocationServicesStrip(container, state, locKey);

  // 可达地点列表（用于地图节点点击和交通方式计算）
  const reachableList = Array.from(reachable).filter((k) => k !== locKey);

  // 地铁沿线大站定义（用于交通方式计算）
  const METRO_STATIONS = [
    "techPark",
    "commercialDist",
    "hospital",
    "school",
    "trainingCenter",
    "entertainment",
    "slum",
    "wholesaleMarket",
  ];

  // 城市地图 — 使用 CSS Grid 布局，按地理关系排列
  const mapWrap = document.createElement("div");
  mapWrap.className = "city-map";
  mapWrap.style.cssText =
    "position:relative;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;min-height:500px;overflow:auto;";

  // 地图网格（用绝对定位模拟地理位置）
  const mapGrid = document.createElement("div");
  mapGrid.style.cssText = "position:relative;width:100%;min-height:460px;";

  // v4.0 地图坐标重构：按真实城市地理重新排布
  // 商业区在中心，郊区/工业区在边缘，寺/校在远端
  const positions = {
    commercialDist: { x: 50, y: 38 }, // 市中心
    bank: { x: 58, y: 22 }, // 金融区（市中心偏上）
    gov_office: { x: 42, y: 18 }, // 政务区（市中心偏上）
    job_market: { x: 48, y: 14 }, // 人才市场（政务区附近）
    techPark: { x: 72, y: 22 }, // 科技园（东侧）
    entertainment: { x: 78, y: 42 }, // 娱乐城（东侧偏下）
    hospital: { x: 62, y: 52 }, // 医院（南侧偏右）
    slum: { x: 30, y: 48 }, // 城中村（西侧）
    wholesaleMarket: { x: 22, y: 32 }, // 批发市场（西北）
    flea_market: { x: 20, y: 44 }, // 二手市场（批发市场南侧）
    construction: { x: 42, y: 58 }, // 建筑工地（南侧）
    park: { x: 35, y: 68 }, // 公园（南侧偏左）
    school: { x: 55, y: 72 }, // 大学城（南侧偏右）
    trainingCenter: { x: 62, y: 82 }, // 培训中心（最下偏右）
    temple: { x: 35, y: 82 }, // 寺庙（最下偏左）
    factoryZone: { x: 18, y: 58 }, // 工业区（西南）
    suburb: { x: 18, y: 75 }, // 郊区（最下偏左）
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
    const curKey = locKey;
    const currentReachable = TRAVEL_GRAPH[curKey] || [];
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
        const isFromCurrent = from === curKey;
        const isToCurrent = to === curKey;
        const isCurrentPath = isFromCurrent || isToCurrent;
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute(
          "stroke",
          isCurrentPath ? "rgba(0,180,216,0.5)" : "rgba(0,180,216,0.12)",
        );
        line.setAttribute("stroke-width", isCurrentPath ? "2.5" : "1");
        line.setAttribute("stroke-dasharray", isCurrentPath ? "6,3" : "3,4");
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
      <div style="display:flex;flex-wrap:wrap;gap:2px;justify-content:center;" class="map-node-badges">${badgeStr}</div>
      ${canTravel ? '<div class="map-node-action" style="font-size:9px;color:var(--accent);margin-top:4px;">' + (state.player.transitMode === "walk" ? "🚶" : state.player.transitMode === "bike" ? "🚲" : state.player.transitMode === "metro" ? "🚇" : state.player.transitMode === "taxi" ? "🚕" : state.player.transitMode === "car" ? "🚗" : "👆") + ' 点击前往</div>' : ""}
      ${!isReachable && !isCurrent ? '<div class="map-node-action" style="font-size:9px;color:var(--text-muted);margin-top:2px;">🔒 未探索</div>' : ""}
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
        const dest = getLocation(key);
        const mode = state.player.transitMode || "walk";
        const hops = typeof getLocationHops === "function" ? getLocationHops(locKey, key) : 1;
        var ap = 15, price = 0, modeName = "🚶 步行", canReach = true;
        if (mode === "walk") {
          ap = Math.max(6, 6 + hops * 4);
          price = 0;
          modeName = "🚶 步行";
        } else if (mode === "bike") {
          ap = 6; price = 3;
          modeName = "🚲 共享单车";
        } else if (mode === "metro") {
          if (METRO_STATIONS.indexOf(key) < 0) { canReach = false; }
          else { ap = 5; price = 4; modeName = "🚇 地铁"; }
        } else if (mode === "taxi") {
          ap = 3; price = 10 + (typeof Random !== "undefined" && Random.int ? Random.int(0, 30) : 15);
          modeName = "🚕 打车";
        } else if (mode === "car") {
          if (!hasCar) {
            StateManager.addMessage("🚗 你还没有车，无法自驾出行。可以去汽车城看看。", "warning");
            return;
          }
          ap = 2; price = 5;
          modeName = "🚗 自驾";
        }
        if (!canReach) {
          StateManager.addMessage("🚇 " + (dest ? dest.name : key) + "不在地铁沿线，请选择其他出行方式。", "warning");
          return;
        }
        if ((state.resources.cash || 0) < price) {
          StateManager.addMessage("💸 " + modeName + "需要¥" + price + "，你现金不够。", "warning");
          return;
        }
        state.resources.cash = (state.resources.cash || 0) - price; // [全系统自洽修复] 域F A类: cash NaN守卫
        StateManager.update("trade.currentLocation", key);
        StateManager.addMessage(
          modeName + " 你来到了" + (dest ? dest.name : key) + costStr({ap: ap, cash: price}),
          "info",
        );
        if (typeof consumeAP === "function") consumeAP(ap);
        renderAll();
      });
    }

    mapGrid.appendChild(node);
  }

  mapWrap.appendChild(mapGrid);

  // === 交通方式选择栏（地图底部，紧凑型） ===
  const transitBar = document.createElement("div");
  transitBar.style.cssText =
    "display:flex;flex-direction:column;gap:2px;padding:8px 0 4px;";
  const curMode = state.player.transitMode || "walk";
  var hasCar = state.investment && state.investment.cars && state.investment.cars.length > 0;
  const TRANSIT_MODES = [
    { mode: "walk", label: "🚶 步行", desc: "免费" },
    { mode: "bike", label: "🚲 单车", desc: "¥3" },
    { mode: "metro", label: "🚇 地铁", desc: "¥4" },
    { mode: "taxi", label: "🚕 打车", desc: "¥10-40" },
    { mode: "car", label: "🚗 自驾", desc: hasCar ? "¥5" : "🔒 需购车" },
  ];

  // 按钮行
  var btnRow = document.createElement("div");
  btnRow.style.cssText = "display:flex;gap:4px;flex-wrap:wrap;";
  TRANSIT_MODES.forEach(function(tm) {
    var btn = document.createElement("button");
    btn.className = "transit-bar-btn";
    btn.dataset.mode = tm.mode;
    var isCarLocked = tm.mode === "car" && !hasCar;
    var isActive = tm.mode === curMode && !isCarLocked;
    btn.style.cssText =
      "padding:4px 8px;font-size:11px;border-radius:6px;border:1px solid " +
      (isCarLocked ? "var(--border-light)" : isActive ? "var(--accent)" : "var(--border-light)") +
      ";background:" +
      (isCarLocked ? "var(--bg-secondary)" : isActive ? "rgba(0,180,216,0.15)" : "var(--bg-input)") +
      ";color:" +
      (isCarLocked ? "var(--text-muted)" : isActive ? "var(--accent)" : "var(--text-secondary)") +
      ";cursor:" + (isCarLocked ? "not-allowed" : "pointer") +
      ";font-weight:" +
      (isActive ? "600" : "400") +
      ";opacity:" + (isCarLocked ? "0.5" : "1") +
      ";transition:all 0.15s;white-space:nowrap;";
    btn.innerHTML = tm.label + ' <span style="font-size:9px;opacity:0.7;">' + tm.desc + "</span>";
    btn.title = isCarLocked ? "需要先购买一辆车才能自驾出行" : "";
    btn.addEventListener("click", function() {
      if (isCarLocked) {
        StateManager.addMessage("🚗 你还没有车，无法自驾出行。可以去汽车城看看。", "warning");
        return;
      }
      if (curMode !== tm.mode) {
        StateManager.update("player.transitMode", tm.mode);
        renderAll();
      }
    });
    btnRow.appendChild(btn);
  });
  transitBar.appendChild(btnRow);

  // 当前模式提示（单独一行，避免换行不一致）
  var modeHints = {
    walk: "💡 步行到达，按距离消耗6~26AP，免费",
    bike: "💡 共享单车，2跳内可达，消耗6AP，费用¥3",
    metro: "💡 地铁，仅限沿线站点，消耗5AP，费用¥4",
    taxi: "💡 打车直达，消耗3AP，按距离计费¥10-40",
    car: hasCar ? "💡 自驾直达，消耗2AP，油费¥5" : "💡 自驾需先购车，解锁后消耗2AP，油费¥5",
  };
  var hint = document.createElement("div");
  hint.style.cssText = "font-size:10px;color:var(--text-muted);";
  hint.textContent = modeHints[curMode] || "💡 选择出行方式";
  transitBar.appendChild(hint);

  mapWrap.appendChild(transitBar);
  container.appendChild(mapWrap);

  // 图例（紧凑型，便于后续扩展）
  const legend = document.createElement("div");
  legend.style.cssText =
    "display:flex;gap:8px;flex-wrap:wrap;font-size:10px;color:var(--text-muted);padding:6px 0;";
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
        <div style="margin-top:2px;color:var(--text-secondary);font-size:10px;">${mapLoc.desc}</div><div style="font-size:9px;color:var(--text-muted);margin-top:2px;">${isCur ? "📍 当前位置" : canReach ? "🚶 " + getLocationHops(locKey, key) + "跳可达" : "🔒 需先探索中间区"}</div>
        ${badgeStr ? `<div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:2px;">${badgeStr}</div>` : ""}
      </div>`;
  }
  quickTable.appendChild(table);
  container.appendChild(quickTable);

  parent.appendChild(container);

  // 延迟绘制 SVG 连线
  setTimeout(drawConnections, 100);
  // 再绘制一次确保
  setTimeout(drawConnections, 500);
}

// ====== Trade Tab ======
function renderTradeTab(state, parent) {
  // [全系统自洽修复] 域F A类修复: state.trade 可能未初始化（初始状态/旧存档）
  if (!state.trade) { parent.innerHTML = '<p style="color:var(--text-muted);padding:20px;text-align:center;">📦 交易系统加载中...</p>'; return; }
  const locKey = state.trade && state.trade.currentLocation;
  const loc = getLocation(locKey);
  const prices = state.trade.goodsPrices[locKey] || {};
  const isWholesale = locKey === "wholesaleMarket";
  // v3.0 BUGFIX: 原为 const goodsList，但下方 SortUtils.sortInteractiveList 会重新赋值，
  // 触发 "Assignment to constant variable" 错误导致整个交易Tab崩溃。改为 let。
  let goodsList =
    typeof getAvailableGoodsAtLocation === "function"
      ? getAvailableGoodsAtLocation(locKey, state)
      : typeof GOODS !== "undefined"
        ? GOODS
        : [];

  // 已访问区域数量提示（供 skillTag 使用）
  var visitedLocs =
    typeof getRememberedLocations === "function"
      ? getRememberedLocations(state)
      : [];
  var salesLvl =
    state.skills && state.skills.sales ? state.skills.sales.level : 0;
  var canCompare =
    typeof canSeePriceMarkers === "function"
      ? canSeePriceMarkers(state)
      : false;

  // 技能等级标签
  var skillTag = "";
  if (salesLvl < 20) {
    skillTag =
      '<span style="font-size:11px;color:var(--text-muted);margin-left:8px;">🔍 销售' +
      salesLvl +
      "级 — 仅看本地价格</span>";
  } else {
    skillTag =
      '<span style="font-size:11px;color:var(--text-muted);margin-left:8px;">🔍 销售' +
      salesLvl +
      "级 — 可对比" +
      visitedLocs.length +
      "个区域</span>";
  }

  // 标题区
  const headerDiv = document.createElement("div");
  headerDiv.style.cssText =
    "display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;";
  headerDiv.innerHTML = `
    <div>
      <h3 style="color:var(--text-muted);margin:0;">
        📦 ${loc ? loc.name : "当前地点"} — ${isWholesale ? "批发市场（进货价低）" : "零售市场"}
      </h3>
      ${skillTag}
    </div>
    <div style="text-align:right;">
      <span style="font-size:11px;color:var(--text-muted);">现金: <strong style="color:var(--success)">¥${(state.resources && state.resources.cash ? state.resources.cash : 0).toLocaleString()}</strong></span>
      ${(function() {
        var activeEvents = 0;
        if (state.trade && state.trade.marketEvents) {
          for (var _ei = 0; _ei < state.trade.marketEvents.length; _ei++) {
            if (state.trade.marketEvents[_ei].remaining > 0) activeEvents++;
          }
        }
        var html = "";
        if (activeEvents > 0) {
          html += '<div style="font-size:10px;color:#e8a838;margin-top:2px;">📊 ' + activeEvents + '个市场活动</div>';
          for (var ei = 0; ei < state.trade.marketEvents.length; ei++) {
            var me = state.trade.marketEvents[ei];
            if (me.remaining > 0) {
              html += '<div style="font-size:9px;color:var(--text-muted);margin-top:1px;">' + me.desc + ' (剩' + me.remaining + '天)</div>';
            }
          }
        }
        return html;
      })()}
    </div>
  `;
  parent.appendChild(headerDiv);

  // [全系统自洽修复] 域A 联动增强#2: 财富税档位UI展示（EconomySystem.getActiveTaxTier 数据此前无UI出口）
  if (typeof EconomySystem !== "undefined" && EconomySystem && state.resources) {
    var _nwTax = (state.resources.cash || 0) + (state.resources.bankBalance || 0);
    var _tier = EconomySystem.getActiveTaxTier(_nwTax);
    if (_tier) {
      var _taxBar = document.createElement("div");
      _taxBar.style.cssText =
        "display:flex;align-items:center;justify-content:space-between;" +
        "background:rgba(232,168,56,0.06);border:1px solid rgba(232,168,56,0.15);border-radius:6px;" +
        "padding:5px 10px;margin-bottom:10px;font-size:11px;color:var(--text-secondary);";
      _taxBar.innerHTML =
        '<span>💼 财富税档：<strong style="color:#e8a838;">' + _tier.label + '</strong></span>' +
        '<span style="color:var(--text-muted);">日税率 ' + ((_tier.rate || 0) * 100).toFixed(3) + '% · 起征 ¥' + (_tier.min || 0).toLocaleString() + '</span>';
      parent.appendChild(_taxBar);
    }
  }

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
        flowers: "鲜花",
        medicine: "药品",
        books: "书籍",
        stationery: "文具",
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

  // [v3.9] 市场情报条：显示当前地点的特产（便宜）和稀缺（贵）商品
  var priceTags =
    typeof LOCATION_GOODS_TAGS !== "undefined" && LOCATION_GOODS_TAGS[locKey];
  if (priceTags) {
    var miDiv = document.createElement("div");
    miDiv.style.cssText =
      "display:flex;align-items:center;gap:8px;font-size:11px;padding:4px 10px;margin-bottom:10px;" +
      "background:var(--bg-card);border-radius:6px;border:1px solid var(--border-light);flex-wrap:wrap;";
    var miHtml =
      '<span style="font-weight:600;color:var(--text-muted);">📊 市场情报</span>';
    if (priceTags.specialties && priceTags.specialties.length > 0) {
      var cheapGoods = priceTags.specialties
        .map(function (gid) {
          var g = typeof getGoodById === "function" ? getGoodById(gid) : null;
          return g ? g.name : gid;
        })
        .filter(Boolean);
      miHtml +=
        '<span style="color:var(--success);font-weight:500;">✅ 便宜: ' +
        cheapGoods.join("、") +
        "</span>";
    }
    if (priceTags.scarce && priceTags.scarce.length > 0) {
      var expensiveGoods = priceTags.scarce
        .map(function (gid) {
          var g = typeof getGoodById === "function" ? getGoodById(gid) : null;
          return g ? g.name : gid;
        })
        .filter(Boolean);
      miHtml +=
        '<span style="color:var(--danger);font-weight:500;">❌ 贵: ' +
        expensiveGoods.join("、") +
        "</span>";
    }
    miDiv.innerHTML = miHtml;
    parent.appendChild(miDiv);
  }

  // 记录今日已访问地点（用于价格对比记忆）
  if (typeof recordLocationVisit === "function") {
    recordLocationVisit(state, locKey);
  }
  // 重置每日交易XP计数器
  if (typeof resetDailyTradeXp === "function") {
    resetDailyTradeXp(state);
  }

  // 模糊记忆提示条
  var memoryHints =
    typeof getPriceMemoryHints === "function"
      ? getPriceMemoryHints(state, locKey)
      : [];
  if (memoryHints.length > 0) {
    var memoryBanner = document.createElement("div");
    memoryBanner.style.cssText =
      "background:rgba(102,126,234,0.06);border:1px solid rgba(102,126,234,0.15);border-radius:6px;" +
      "padding:5px 10px;margin-bottom:10px;font-size:11px;color:#667eea;";
    memoryBanner.innerHTML =
      "💭 模糊记忆：<br>" +
      memoryHints
        .map(function (h) {
          return "· " + h;
        })
        .join("<br>");
    parent.appendChild(memoryBanner);
  }

  if (goodsList.length === 0) {
    parent.innerHTML +=
      '<p style="color:var(--text-muted)">商品数据加载中...</p>';
    return;
  }

  // ====== 分类排序系统：品类优先 → 频次辅助 → 价格 → 名称 ======
  if (typeof SortUtils !== "undefined") {
    goodsList = SortUtils.sortInteractiveList(
      goodsList,
      {
        categoryOrder: [
          "food",
          "daily",
          "clothing",
          "electronics",
          "luxury",
          "scrap",
        ],
        priorityMap: {
          water: 10,
          rice: 11,
          vegetables: 12,
          fruits: 13,
          noodles: 14,
          pork: 20,
          beef: 21,
          chicken: 22,
          fish: 23,
          egg: 24,
          milk: 25,
        },
        freqMap: "tradeFreq",
        getCategory: function (g) {
          return g.category || "other";
        },
        getFreqKey: function (g) {
          return g.id;
        },
        getCost: function (g) {
          return g.basePrice || 0;
        },
        getName: function (g) {
          return g.name || g.id;
        },
      },
      state,
    );
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
      const displayName = good ? good.name : getUiDisplayName(item.id);
      const displayId = good ? good.id : item.id;
      const price = good ? prices[good.id] || good.basePrice : null;
      const profitInfo = item.avgBuyPrice
        ? price !== null && price > item.avgBuyPrice
          ? `<span style="color:var(--success)">📈 +¥${((price - item.avgBuyPrice) * item.qty).toFixed(1)}</span>`
          : price !== null
            ? `<span style="color:var(--danger)">📉 -¥${((item.avgBuyPrice - price) * item.qty).toFixed(1)}</span>`
            : ""
        : "";
      const avgPriceText =
        item.avgBuyPrice !== undefined && item.avgBuyPrice !== null
          ? "¥" + Number(item.avgBuyPrice).toFixed(1)
          : "暂无";
      const currentPriceText =
        price !== null ? "¥" + price.toFixed(1) : "不可交易";
      const tradeButtons = good
        ? `
          <button class="btn btn-sm btn-danger sell-one-btn" data-good="${displayId}">卖1</button>
          <button class="btn btn-sm btn-danger sell-all-btn" data-good="${displayId}">全卖</button>
          <button class="qty-toggle-btn" data-good="${displayId}" data-side="sell" title="自定义数量">✏️</button>
          <div class="qty-input-group" data-good="${displayId}" data-side="sell" style="display:none;">
            <button class="qty-step-btn" data-good="${displayId}" data-dir="-1">−</button>
            <input type="number" class="qty-num-input" value="1" min="1" max="999" step="1" data-good="${displayId}">
            <button class="qty-step-btn" data-good="${displayId}" data-dir="1">+</button>
            <button class="btn btn-sm btn-danger qty-action-btn" data-good="${displayId}" data-side="sell">卖</button>
          </div>
        `
        : '<span style="font-size:11px;color:var(--text-muted);">非交易物品</span>';

      const card = document.createElement("div");
      card.className = "action-card";
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="card-title" style="margin:0;">${displayName}</div>
          <span class="slot-tag">×${item.qty}</span>
        </div>
        <div class="card-desc" style="margin:4px 0;">
          买入均价: ${avgPriceText} | 当前价: ${currentPriceText}
        </div>
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
          <span style="font-size:11px;">${profitInfo}</span>
          <div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;margin-left:auto;">
            ${tradeButtons}
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
  grid.id = "trade-market-grid";
  grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";

  for (const good of goodsList) {
    const price = prices[good.id] || good.basePrice;
    const wholesalePrice = isWholesale
      ? Math.round(price * 0.7 * 100) / 100
      : null;

    // 价格标记：技能驱动的红绿 + 极端值
    var priceMarker =
      typeof getPriceMarker === "function"
        ? getPriceMarker(state, locKey, good.id, price)
        : { direction: null, label: "" };
    var visitedExtreme =
      typeof getVisitedExtreme === "function"
        ? getVisitedExtreme(state, locKey, good.id)
        : { isVisitedLowest: false, isVisitedHighest: false, label: "" };
    var cityExtreme =
      typeof getCityExtreme === "function"
        ? getCityExtreme(state, locKey, good.id)
        : { isCityLowest: false, isCityHighest: false, label: "" };
    var trendArrow =
      typeof getPriceTrend === "function"
        ? getPriceTrend(state, locKey, good.id)
        : "";

    // 价格颜色：红绿基于已访问区域对比
    var priceColor = "var(--text-primary)";
    if (priceMarker.direction === "down") priceColor = "var(--success)";
    else if (priceMarker.direction === "up") priceColor = "var(--danger)";
    // 全城极端值覆盖颜色（更高优先级）
    if (cityExtreme.isCityLowest) priceColor = "var(--success)";
    else if (cityExtreme.isCityHighest) priceColor = "var(--danger)";
    // 已访问极端值（如果没有全城数据）
    else if (visitedExtreme.isVisitedLowest) priceColor = "var(--success)";
    else if (visitedExtreme.isVisitedHighest) priceColor = "var(--danger)";

    // 价格标签文本
    var priceLabel = "";
    if (cityExtreme.label) priceLabel = " " + cityExtreme.label;
    else if (visitedExtreme.label) priceLabel = " " + visitedExtreme.label;
    else if (priceMarker.label) priceLabel = " " + priceMarker.label;

    // 趋势箭头
    var trendHtml = trendArrow
      ? '<span style="font-size:14px;margin-left:4px;" title="趋势预测">' +
        trendArrow +
        "</span>"
      : "";

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

    // [全系统自洽修复] 域A 增强: 市场事件标签 — 当有活跃市场事件影响该商品时显示标记
    var marketEventTag = "";
    if (state.trade && state.trade.marketEvents) {
      for (var mei = 0; mei < state.trade.marketEvents.length; mei++) {
        if (
          state.trade.marketEvents[mei].goodId === good.id &&
          state.trade.marketEvents[mei].remaining > 0
        ) {
          marketEventTag =
            state.trade.marketEvents[mei].priceMod > 1
              ? '<span style="color:var(--danger);font-size:10px;margin-left:8px;">🔥 行情看涨</span>'
              : '<span style="color:var(--success);font-size:10px;margin-left:8px;">💥 行情看跌</span>';
          break;
        }
      }
    }

    const card = document.createElement("div");
    card.className = "action-card";
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div class="card-title" style="margin:0;">${good.name}</div>
        <span class="slot-tag">${{ daily: "日用品", luxury: "奢侈品", food: "食品", clothing: "服装", electronics: "电子", scrap: "废品" }[good.category] || good.category}</span>
        ${seasonTag}${marketEventTag}
      </div>
      <div class="card-desc" style="margin:4px 0;">
        基准: ¥${good.basePrice}/${good.unit}
        ${wholesalePrice ? `<br>批发价: <strong style="color:var(--success)">¥${wholesalePrice.toFixed(1)}</strong>/件 (零售 ¥${price.toFixed(1)})` : ""}
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;">
        当前零售价: <strong style="color:${priceColor}">¥${price.toFixed(1)}</strong>${trendHtml}
        ${priceLabel}
        ${_renderSupplyDemandTag(state, good.id)}
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;">
        <button class="btn btn-sm btn-success buy-btn" data-good="${good.id}" data-qty="1">买1</button>
        <button class="btn btn-sm btn-success buy-btn" data-good="${good.id}" data-qty="5">买5</button>
        ${isWholesale ? `<button class="btn btn-sm btn-primary wholesale-btn" data-good="${good.id}" data-qty="10">批发×10</button>` : ""}
        <button class="qty-toggle-btn" data-good="${good.id}" data-side="buy" title="自定义数量">✏️</button>
        <div class="qty-input-group" data-good="${good.id}" data-side="buy" style="display:none;">
          <button class="qty-step-btn" data-good="${good.id}" data-dir="-1">−</button>
          <input type="number" class="qty-num-input" value="1" min="1" max="999" step="1" data-good="${good.id}">
          <button class="qty-step-btn" data-good="${good.id}" data-dir="1">+</button>
          <button class="btn btn-sm btn-success qty-action-btn" data-good="${good.id}" data-side="buy">买</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  }
  parent.appendChild(grid);

  // ====== 价格对比（仅已访问区域 + 技能门控） ======
  var canExtremes =
    typeof canSeeCityExtremes === "function"
      ? canSeeCityExtremes(state)
      : false;
  var visitedLocs2 =
    typeof getRememberedLocations === "function"
      ? getRememberedLocations(state)
      : [];
  var allLocKeys = Object.keys(LOCATIONS);

  if (canCompare && visitedLocs2.length >= 2) {
    // 有技能 + 至少访问过2个区域 → 显示已访区域对比
    var compareDiv = document.createElement("div");
    compareDiv.style.marginTop = "20px";
    compareDiv.innerHTML =
      '<h4 style="color:var(--text-muted);margin-bottom:8px;">📍 已访区域价格对比 <span style="font-size:11px;font-weight:normal;">（' +
      visitedLocs2.length +
      "/" +
      allLocKeys.length +
      "个区域）</span></h4>";

    var compareTable = document.createElement("div");
    compareTable.style.cssText = "overflow-x:auto;font-size:11px;";
    var tableHtml =
      '<table style="width:100%;border-collapse:collapse;"><thead><tr><th style="padding:4px 8px;text-align:left;border-bottom:1px solid var(--border);color:var(--text-muted);">商品</th>';

    for (var vi = 0; vi < visitedLocs2.length; vi++) {
      var vlk = visitedLocs2[vi];
      var vl = LOCATIONS[vlk];
      tableHtml +=
        '<th style="padding:4px 6px;text-align:right;border-bottom:1px solid var(--border);color:var(--text-muted);font-size:10px;">' +
        (vl ? vl.name.substring(0, 3) : vlk.substring(0, 2)) +
        "</th>";
    }
    tableHtml += "</tr></thead><tbody>";

    // 只对比当前可见的商品
    var compareGoods = goodsList;
    for (var gi = 0; gi < compareGoods.length; gi++) {
      var gd = compareGoods[gi];
      tableHtml +=
        '<tr><td style="padding:3px 8px;border-bottom:1px solid rgba(255,255,255,0.03);">' +
        gd.name +
        "</td>";

      // 收集已访问区域中该商品的所有价格
      var visitedPrices = [];
      for (var vj = 0; vj < visitedLocs2.length; vj++) {
        var vlk2 = visitedLocs2[vj];
        var snap =
          (state.trade.visitedToday &&
            state.trade.visitedToday[vlk2] &&
            state.trade.visitedToday[vlk2].prices) ||
          {};
        var p = snap[gd.id];
        if (p !== undefined) {
          visitedPrices.push({ loc: vlk2, price: p });
        } else {
          // fallback to goodsPrices
          p = (state.trade.goodsPrices[vlk2] || {})[gd.id] || gd.basePrice;
          visitedPrices.push({ loc: vlk2, price: p });
        }
      }

      for (var vk = 0; vk < visitedLocs2.length; vk++) {
        var curLk = visitedLocs2[vk];
        // 找到该商品在当前区域的精确价格
        var curPrice = gd.basePrice;
        for (var pi = 0; pi < visitedPrices.length; pi++) {
          if (visitedPrices[pi].loc === curLk) {
            curPrice = visitedPrices[pi].price;
            break;
          }
        }

        // 判断是否为已访区域最低/最高
        var isVisLow = true;
        var isVisHigh = true;
        for (var qi = 0; qi < visitedPrices.length; qi++) {
          if (visitedPrices[qi].price < curPrice) isVisLow = false;
          if (visitedPrices[qi].price > curPrice) isVisHigh = false;
        }

        // 如果是全城跑完且销售>=60，判断全城极端值
        var cellStyle = "color:var(--text-secondary);";
        if (canExtremes) {
          if (typeof getLowestPrice === "function") {
            var cityLow = getLowestPrice(gd.id);
            if (cityLow.location === curLk) {
              cellStyle = "color:var(--success);font-weight:bold;";
            }
          }
          if (typeof getHighestPrice === "function") {
            var cityHigh = getHighestPrice(gd.id);
            if (
              cityHigh.location === curLk &&
              cellStyle.indexOf("success") === -1
            ) {
              cellStyle = "color:var(--danger);";
            }
          }
        } else if (isVisLow) {
          cellStyle = "color:var(--success);";
        } else if (isVisHigh) {
          cellStyle = "color:var(--danger);";
        }
        tableHtml +=
          '<td style="padding:3px 6px;text-align:right;border-bottom:1px solid rgba(255,255,255,0.03);' +
          cellStyle +
          '">' +
          curPrice.toFixed(1) +
          "</td>";
      }
      tableHtml += "</tr>";
    }
    tableHtml += "</tbody></table>";
    compareTable.innerHTML = tableHtml;
    compareDiv.appendChild(compareTable);
    parent.appendChild(compareDiv);
  } else if (visitedLocs2.length < 2) {
    // 还没跑够2个区域 → 提示探索
    var exploreHint = document.createElement("div");
    exploreHint.style.cssText =
      "margin-top:16px;padding:10px;background:rgba(102,126,234,0.06);border-radius:6px;font-size:12px;color:var(--text-muted);text-align:center;";
    var remainCount = allLocKeys.length - visitedLocs2.length;
    exploreHint.innerHTML =
      "🧭 已访问 " +
      visitedLocs2.length +
      "/" +
      allLocKeys.length +
      " 个区域。再逛 " +
      remainCount +
      " 个区域就能解锁价格对比！（需销售≥20级）";
    parent.appendChild(exploreHint);
  }

  // ====== NPC 交易情报入口（仅当该区域有NPC且好感足够时显示） ======
  var locNpcs =
    typeof getNpcsAtLocation === "function" ? getNpcsAtLocation(locKey) : [];
  var hasTradeInfo = false;
  for (var ni = 0; ni < locNpcs.length; ni++) {
    if (locNpcs[ni].tradeInfo) {
      hasTradeInfo = true;
      break;
    }
  }
  if (hasTradeInfo && typeof getNPCTradeInfo === "function") {
    var npcInfoDiv = document.createElement("div");
    npcInfoDiv.style.cssText =
      "margin-top:16px;padding:10px;background:rgba(255,193,7,0.06);border:1px solid rgba(255,193,7,0.15);border-radius:8px;";
    npcInfoDiv.innerHTML =
      '<h4 style="color:var(--text-muted);margin:0 0 8px 0;">💬 当地情报</h4>';

    var hasAnyInfo = false;
    for (var ni2 = 0; ni2 < locNpcs.length; ni2++) {
      var npcData = locNpcs[ni2];
      var info = getNPCTradeInfo(npcData.id, state);
      if (info && info.availableInfo.length > 0) {
        hasAnyInfo = true;
        var npcLine = document.createElement("div");
        npcLine.style.cssText =
          "margin-bottom:6px;padding:6px 8px;background:rgba(255,255,255,0.03);border-radius:6px;";
        npcLine.innerHTML =
          '<div style="font-weight:bold;font-size:12px;margin-bottom:4px;">' +
          npcData.name +
          "（" +
          npcData.role +
          "）</div>";

        for (var ai = 0; ai < info.availableInfo.length; ai++) {
          var aiData = info.availableInfo[ai];
          var costStr = aiData.free ? "免费" : "¥" + aiData.currentCost;
          var btnHtml =
            '<button class="btn btn-sm npc-info-btn" data-npc="' +
            npcData.id +
            '" data-info="' +
            aiData.id +
            '" style="margin:2px 4px 2px 0;">' +
            aiData.label +
            "（" +
            costStr +
            "）</button>";
          npcLine.innerHTML += btnHtml;
        }
        npcInfoDiv.appendChild(npcLine);
      }
    }

    if (hasAnyInfo) {
      parent.appendChild(npcInfoDiv);
    }
  }

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
          // 追踪买卖频次
          var st = StateManager.getState();
          if (st && st.stats) {
            st.stats.tradeFreq[goodId] =
              (st.stats.tradeFreq[goodId] || 0) + qty;
          }
          // 传入 goodId 作为滚动锚点，避免重绘后布局伸缩导致光标错位
          renderCurrentTab(st, goodId);
          renderSidebar(st);
          renderHeader(st);
          renderMessageLog(st);
        }
      });
    });

    // 批发按钮（与买1/买5 同路径：带锚定重绘，UI 一致且不跳位）
    parent.querySelectorAll(".wholesale-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const goodId = btn.dataset.good;
        const qty = parseInt(btn.dataset.qty) || 10;
        if (typeof buyWholesale === "function") {
          buyWholesale(goodId, qty);
          var st = StateManager.getState();
          if (st && st.stats) {
            st.stats.tradeFreq[goodId] =
              (st.stats.tradeFreq[goodId] || 0) + qty;
          }
          renderCurrentTab(st, goodId);
          renderSidebar(st);
          renderHeader(st);
          renderMessageLog(st);
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
          var st = StateManager.getState();
          if (st && st.stats) {
            st.stats.tradeFreq[goodId] = (st.stats.tradeFreq[goodId] || 0) + 1;
          }
          renderCurrentTab(st, goodId);
          renderSidebar(st);
          renderHeader(st);
          renderMessageLog(st);
        }
      });
    });

    parent.querySelectorAll(".sell-all-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const goodId = btn.dataset.good;
        const st = StateManager.getState();
        const item = st.inventory.items.find((i) => i.id === goodId);
        if (item && typeof sellGood === "function") {
          sellGood(goodId, item.qty);
          if (st && st.stats) {
            st.stats.tradeFreq[goodId] =
              (st.stats.tradeFreq[goodId] || 0) + item.qty;
          }
          renderCurrentTab(st, goodId);
          renderSidebar(st);
          renderHeader(st);
          renderMessageLog(st);
        }
      });
    });

    // --- 自定义数量输入：展开/收起 ---
    parent.querySelectorAll(".qty-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const goodId = btn.dataset.good;
        const side = btn.dataset.side; // "buy" or "sell"
        const group = parent.querySelector(
          `.qty-input-group[data-good="${goodId}"][data-side="${side}"]`,
        );
        if (!group) return;
        const isHidden = group.style.display === "none";
        group.style.display = isHidden ? "inline-flex" : "none";
        btn.style.opacity = isHidden ? "0.7" : "1";
        btn.style.background = isHidden ? "var(--accent-glow)" : "transparent";
        if (isHidden) {
          const input = group.querySelector(".qty-num-input");
          if (input) {
            // 初始化：买侧默认1，卖侧默认持有数量的一半（向下取整）
            if (side === "sell") {
              const item = StateManager.getState().inventory.items.find(
                (i) => i.id === goodId,
              );
              if (item) {
                input.max = item.qty;
                input.value = Math.max(1, Math.floor(item.qty / 2));
              }
              if (item && parseInt(input.value) > item.qty)
                input.value = Math.min(1, item.qty);
            } else {
              const state = StateManager.getState();
              const locKey = state.trade && state.trade.currentLocation;
              const cash = state.resources.cash || 0; // [全系统自洽修复] 域F A类: cash NaN守卫
              const price = getCurrentPrice(locKey, goodId);
              // 批发市场按批发价计算最大可买数量
              const effectivePrice =
                locKey === "wholesaleMarket" ? price * 0.95 : price;
              if (effectivePrice > 0) {
                input.max = Math.floor(cash / effectivePrice) || 1;
                // 批发市场默认最少5件
                if (locKey === "wholesaleMarket" && input.max >= 5) {
                  input.value = 5;
                }
              }
            }
            input.focus();
            input.select();
          }
        }
      });
    });

    // --- 步进按钮 ---
    parent.querySelectorAll(".qty-step-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const goodId = btn.dataset.good;
        const dir = parseInt(btn.dataset.dir) || 0;
        const group = btn.closest(".qty-input-group");
        if (!group) return;
        const input = group.querySelector(".qty-num-input");
        if (!input) return;
        let val = parseInt(input.value) || 1;
        const max = parseInt(input.max) || 999;
        const step = Math.abs(dir) >= 10 ? Math.abs(dir) : 1;
        val = Math.max(1, Math.min(max, val + (dir > 0 ? step : -step)));
        input.value = val;
      });
    });

    // --- 数量输入实时校验 ---
    parent.querySelectorAll(".qty-num-input").forEach((input) => {
      input.addEventListener("change", () => {
        let val = parseInt(input.value) || 1;
        const max = parseInt(input.max) || 999;
        if (val < 1) val = 1;
        if (val > max) val = max;
        input.value = val;
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const goodId = input.dataset.good;
          const group = input.closest(".qty-input-group");
          if (!group) return;
          const side = group.dataset.side || "buy";
          const actionBtn = group.querySelector(".qty-action-btn");
          if (actionBtn) actionBtn.click();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          const group = input.closest(".qty-input-group");
          if (group) group.style.display = "none";
          // 同时恢复 toggle 按钮样式
          const goodId = input.dataset.good;
          const side = group.dataset.side;
          const toggle = parent.querySelector(
            `.qty-toggle-btn[data-good="${goodId}"][data-side="${side}"]`,
          );
          if (toggle) {
            toggle.style.opacity = "";
            toggle.style.background = "";
          }
        }
      });
    });

    // --- 自定义数量购买/卖出 ---
    parent.querySelectorAll(".qty-action-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const goodId = btn.dataset.good;
        const side = btn.dataset.side; // "buy" or "sell"
        const group = parent.querySelector(
          `.qty-input-group[data-good="${goodId}"][data-side="${side}"]`,
        );
        if (!group) return;
        const input = group.querySelector(".qty-num-input");
        if (!input) return;
        let qty = parseInt(input.value) || 1;
        if (qty < 1) qty = 1;

        if (side === "buy") {
          // 用现金做最终校验
          const state = StateManager.getState();
          const locKey = state.trade && state.trade.currentLocation;
          const isWholesaleLoc = locKey === "wholesaleMarket";
          const price = getCurrentPrice(locKey, goodId);
          const maxBuy =
            price > 0 ? Math.floor((state.resources.cash || 0) / price) : 0;
          if (qty > maxBuy) {
            if (maxBuy <= 0) {
              StateManager.addMessage("⚠️ 现金不足以购买任何数量。", "danger");
              return;
            }
            qty = maxBuy;
            input.value = qty;
            StateManager.addMessage(
              `ℹ️ 现金不足，调整为购买 ${qty} 件。`,
              "info",
            );
          }
          // 批发市场自定义数量走批发通道（最低5件起，buyWholesale内部校验）
          if (
            isWholesaleLoc &&
            qty >= 5 &&
            typeof buyWholesale === "function"
          ) {
            buyWholesale(goodId, qty);
          } else if (typeof buyGood === "function") {
            if (isWholesaleLoc && qty < 5) {
              StateManager.addMessage(
                "ℹ️ 批发市场自定义数量≥5件走批发价，＜5件走零售价。",
                "info",
              );
            }
            buyGood(goodId, qty);
          }
          // 追踪自定义买卖频次
          var st2 = StateManager.getState();
          if (st2 && st2.stats) {
            st2.stats.tradeFreq[goodId] =
              (st2.stats.tradeFreq[goodId] || 0) + qty;
          }
        } else {
          // sell
          const item = StateManager.getState().inventory.items.find(
            (i) => i.id === goodId,
          );
          const maxSell = item ? item.qty : 0;
          if (qty > maxSell) {
            if (maxSell <= 0) {
              StateManager.addMessage("⚠️ 没有该商品可卖出。", "danger");
              return;
            }
            qty = maxSell;
            input.value = qty;
          }
          if (typeof sellGood === "function") {
            sellGood(goodId, qty);
          }
          // 追踪自定义卖出频次
          var st3 = StateManager.getState();
          if (st3 && st3.stats) {
            st3.stats.tradeFreq[goodId] =
              (st3.stats.tradeFreq[goodId] || 0) + qty;
          }
        }
        // 成功后收起面板
        group.style.display = "none";
        const toggle = parent.querySelector(
          `.qty-toggle-btn[data-good="${goodId}"][data-side="${side}"]`,
        );
        if (toggle) {
          toggle.style.opacity = "";
          toggle.style.background = "";
        }

        renderCurrentTab(StateManager.getState(), goodId);
        renderSidebar(StateManager.getState());
        renderHeader(StateManager.getState());
        renderMessageLog(StateManager.getState());
      });
    });

    // --- NPC 情报按钮 ---
    parent.querySelectorAll(".npc-info-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        var npcId = btn.dataset.npc;
        var infoTypeId = btn.dataset.info;
        if (typeof buyInfoFromNpc === "function") {
          var result = buyInfoFromNpc(
            npcId,
            infoTypeId,
            StateManager.getState(),
          );
          StateManager.addMessage(
            result.message,
            result.success ? "success" : "warning",
          );
          renderCurrentTab(StateManager.getState());
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
  // 计算负重信息
  var totalWeight = 0;
  var maxCarry = 15 + (state.player.physique || 0) * 0.3;
  if (typeof calcEncumbrance === "function") {
    var enc = calcEncumbrance(state);
    totalWeight = Math.round(enc.totalWeight * 10) / 10;
    maxCarry = Math.round(enc.maxCarry * 10) / 10;
  }
  div.innerHTML = `
    <h3 style="color:var(--text-muted);margin-bottom:12px;">🎒 物品栏
      <span style="font-size:11px;color:var(--text-muted)">
        (仓库 ${(state.inventory && state.inventory.items.length) || 0}/${(state.inventory && state.inventory.capacity) || 0} 槽位)
      </span>
      <span style="font-size:10px;color:var(--text-muted);margin-left:8px;">
        负重 ${totalWeight}/${maxCarry}kg
      </span>
    </h3>
  `;

  const items = state.inventory && state.inventory.items ? state.inventory.items : []; // [全系统自洽修复] 域F A类: state.inventory 守卫
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
      // 品质颜色
      var qualityStyle = "";
      if (
        item.quality &&
        item.quality !== "common" &&
        typeof getQualityColor === "function"
      ) {
        qualityStyle =
          "border-left:3px solid " + getQualityColor(item.quality) + ";";
      }
      el.innerHTML = `
        <div class="item-name" style="${qualityStyle}">${def ? def.name : item.id}</div>
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
  // 购买地点引导提示（仅含真实装备槽对应地点）
  var equipHint = document.createElement("div");
  equipHint.style.cssText =
    "font-size:10px;color:var(--text-muted);margin-bottom:8px;padding:4px 8px;background:rgba(255,255,255,0.03);border-radius:4px;";
  equipHint.textContent =
    "购买地点：⛑️头部/🧤手部→批发市场/工地 | 👕身体/👟脚部→批发市场/商业区 | 📿配件→批发市场/商业区";
  equipDiv.appendChild(equipHint);
  const slots = [
    {
      key: "head",
      name: "头部",
      icon: "⛑️",
      buyLocs: ["wholesaleMarket", "construction", "slum"],
    },
    {
      key: "body",
      name: "身体",
      icon: "👕",
      buyLocs: ["wholesaleMarket", "commercialDist"],
    },
    {
      key: "feet",
      name: "脚部",
      icon: "👟",
      buyLocs: ["wholesaleMarket", "construction"],
    },
    {
      key: "hand",
      name: "手部",
      icon: "🧤",
      buyLocs: ["wholesaleMarket", "construction"],
    },
    {
      key: "accessory",
      name: "配件",
      icon: "📿",
      buyLocs: ["wholesaleMarket", "commercialDist", "techPark"],
    },
  ];
  const equipGrid = document.createElement("div");
  equipGrid.className = "action-cards";
  equipGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(130px, 1fr))";
  for (const slot of slots) {
    const itemId = equip[slot.key];
    const equipInstance =
      itemId && state.inventory?.equipmentInstances
        ? state.inventory.equipmentInstances[slot.key]
        : null;
    const itemDef =
      itemId && typeof ITEMS !== "undefined"
        ? ITEMS.find((i) => i.id === itemId)
        : null;
    const displayItem = equipInstance || itemDef;
    const qualityId = equipInstance?.quality || null;
    const qualityInfo =
      qualityId && typeof getQualityInfo === "function"
        ? getQualityInfo(qualityId)
        : null;

    const card = document.createElement("div");
    card.className =
      "action-card" +
      (qualityId && typeof getQualityClass === "function"
        ? " " + getQualityClass(qualityId)
        : "");
    var repairHtml = "";
    if (itemDef && typeof buildRepairPreview === "function") {
      var rp = buildRepairPreview(state, itemDef);
      if (rp)
        repairHtml =
          '<div style="font-size:9px;color:var(--text-muted);margin-top:3px;">' +
          rp +
          "</div>";
    }
    var qualityBadge = "";
    if (qualityInfo && displayItem && displayItem.actualPrice) {
      qualityBadge = `<span class="quality-badge quality-${qualityId}">${qualityInfo.icon} ${qualityInfo.name} ¥${displayItem.actualPrice}</span>`;
    }
    var priceDisplay = displayItem?.actualPrice
      ? `<div class="quality-price">¥${displayItem.actualPrice}</div>`
      : "";

    card.innerHTML = `
      <div style="font-size:11px;color:var(--text-muted)">${slot.icon} ${slot.name}</div>
      <div style="font-size:12px;color:${displayItem ? "var(--success)" : "var(--text-muted)"};display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
        ${displayItem ? displayItem.name : "(空)"}  ${qualityBadge}
      </div>
      ${priceDisplay}
      ${repairHtml}
      ${!displayItem ? '<div style="font-size:10px;color:var(--accent);margin-top:4px;">👆 点击查看购买</div>' : ""}
    `;

    // 空槽：点击弹出导航弹窗
    if (!displayItem) {
      card.style.cursor = "pointer";
      (function (s) {
        card.addEventListener("click", function () {
          var slotItems =
            typeof ITEMS !== "undefined"
              ? ITEMS.filter(function (i) {
                  return i.slot === s.key && !i.isIngredient;
                })
              : [];
          var itemLines = slotItems
            .map(function (i) {
              var locNames = (i.buyLocations || [])
                .map(function (l) {
                  return typeof getLocation === "function"
                    ? (getLocation(l) || {}).name || l
                    : l;
                })
                .join("、");
              return (
                i.icon + " " + i.name + "（¥" + i.price + "）→ " + locNames
              );
            })
            .join("\n");
          // 推荐地点（出现次数最多的 buyLocation）
          var locCount = {};
          slotItems.forEach(function (i) {
            (i.buyLocations || []).forEach(function (l) {
              locCount[l] = (locCount[l] || 0) + 1;
            });
          });
          var topLoc = s.buyLocs[0];
          var topScore = 0;
          Object.keys(locCount).forEach(function (l) {
            if (locCount[l] > topScore) {
              topScore = locCount[l];
              topLoc = l;
            }
          });
          var topLocName =
            typeof getLocation === "function"
              ? (getLocation(topLoc) || {}).name || "批发市场"
              : "批发市场";
          showModal({
            title: s.icon + " " + s.name + "装备购买指南",
            message:
              "可购买的" + s.name + "装备：\n\n" + (itemLines || "暂无数据"),
            buttons: [
              {
                text: "🗺️ 前往" + topLocName,
                cls: "btn-primary",
                callback: function () {
                  if (typeof navigateTo === "function") {
                    navigateTo(state, { type: "location", key: topLoc });
                  } else {
                    state.location = topLoc;
                    if (typeof renderAll === "function") renderAll(state);
                  }
                },
              },
              { text: "关闭", cls: "btn", callback: function () {} },
            ],
          });
        });
      })(slot);
    }

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
  var _synCount = typeof getActiveSynergiesCount === "function" ? getActiveSynergiesCount(state) : 0;
  div.innerHTML =
    '<h3 style="color:var(--text-muted);margin-bottom:12px;">📚 技能 <span style="font-size:11px;color:var(--accent);">⚡15+💰¥50 = 训练一次</span>' +
    (_synCount > 0 ? '<span style="font-size:11px;color:var(--success);margin-left:8px;">🔗 ' + _synCount + '个连携活跃</span>' : "") +
    '</h3>';

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
  var skillTrainingLocationOk =
    state.trade && state.trade.currentLocation === "trainingCenter";
  if (!skillTrainingLocationOk) {
    var gate = document.createElement("div");
    gate.style.cssText =
      "margin-bottom:12px;padding:10px 12px;border:1px solid rgba(196,85,61,0.35);background:rgba(196,85,61,0.08);border-radius:8px;color:var(--danger);font-size:12px;line-height:1.5;";
    gate.textContent =
      "技能训练需要前往培训中心；当前地点只能查看技能与解锁条件。";
    parent.appendChild(gate);
  }

  // ====== 分类排序系统：实用型→学术型→体能型 → 训练频次 → 等级 → 名称 ======
  if (typeof SortUtils !== "undefined") {
    var skillObjs = skillKeys.map(function (k) {
      return {
        id: k,
        name: skillNamesCache[k] || k,
        level: state.skills[k].level,
      };
    });
    var sortedSkills = SortUtils.sortInteractiveList(
      skillObjs,
      {
        categoryOrder: ["practical", "academic", "physical"],
        priorityMap: {
          cooking: 10,
          repair: 15,
          coding: 20,
          driving: 25,
          english: 30,
          accounting: 35,
          electrician: 40,
          management: 45,
          sales: 50,
          welding: 55,
        },
        freqMap: "trainFreq",
        getCategory: function (s) {
          return SortUtils.getSkillCategory
            ? SortUtils.getSkillCategory(s.id)
            : "physical";
        },
        getFreqKey: function (s) {
          return s.id;
        },
        getCost: function (s) {
          return 15;
        },
        getName: function (s) {
          return s.name || s.id;
        },
      },
      state,
    );
    skillKeys = sortedSkills.map(function (s) {
      return s.id;
    });
  }

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
    card.style.cursor = skillTrainingLocationOk ? "pointer" : "not-allowed";
    if (!skillTrainingLocationOk) card.classList.add("disabled");
    card.setAttribute("data-skill", key);
    card.title = skillTrainingLocationOk
      ? "⚡15+💰¥50 = 训练" + name
      : "前往培训中心才能训练技能";

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
      "font-size:10px;color:" +
      (skillTrainingLocationOk ? "var(--warning)" : "var(--danger)") +
      ";margin-top:4px;";
    metaDiv.textContent = skillTrainingLocationOk
      ? "⚡15 + ¥50 / 次 | EXP ~5~12"
      : "地点不符：请前往培训中心训练";
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
        if (!st.trade || st.trade.currentLocation !== "trainingCenter") {
          StateManager.addMessage(
            "📚 技能训练需要前往培训中心；当前地点只能查看技能。",
            "warning",
          );
          return;
        }
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
        st.player.actionPoints = Math.max(0, (st.player.actionPoints || 0) - 15);
        st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50);
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
        // 追踪训练频次（用于排序）
        if (!st.stats.trainFreq) st.stats.trainFreq = {};
        st.stats.trainFreq[skillKey] = (st.stats.trainFreq[skillKey] || 0) + 1;
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
      '<h3 style="color:var(--text-muted);margin-bottom:8px;font-size:12px;">✨ 技能协同增益' +
      (activeSyn.length > 0 ? ' <span style="color:var(--success);font-size:10px;">(' + activeSyn.length + '项激活)</span>' : '') +
      '</h3>';
    if (activeSyn.length === 0) {
      synDiv.innerHTML =
        synTitle +
        '<div style="font-size:11px;color:var(--text-muted);">多技能达到门槛时激活持续加成。已定义组合：</div>';
      // 技能名称映射（中文）
      var SKILL_NAMES_CN = {
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

      var allHtml = "";
      for (var si = 0; si < SKILL_SYNERGIES.length; si++) {
        var syn = SKILL_SYNERGIES[si];
        var reqs = Object.entries
          ? Object.entries(syn.skills)
              .map(function (e) {
                var skillName = SKILL_NAMES_CN[e[0]] || e[0];
                return skillName + "≥Lv." + e[1];
              })
              .join(" + ")
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
  var pct =
    totalVisible > 0 ? Math.round((unlockedCount / totalVisible) * 100) : 0;

  // 分类图标映射
  var CATEGORY_ICONS = {
    人生第一次: "🎯",
    里程碑: "🏆",
    道德档案: "⚖️",
    隐藏: "🔮",
    节日: "🎉",
    创业: "🚀",
    新闻: "📰",
    "健康/生活线": "❤️",
    社交线: "👥",
  };

  // 分类排序（优先级）
  var CATEGORY_ORDER = [
    "人生第一次",
    "里程碑",
    "创业",
    "节日",
    "道德档案",
    "健康/生活线",
    "社交线",
    "新闻",
    "隐藏",
  ];

  // ====== 顶部统计 ======
  var header = document.createElement("div");
  header.style.cssText =
    "padding:16px;background:var(--bg-card);border-bottom:1px solid var(--border);margin-bottom:8px;";
  header.innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
    '<span style="font-size:24px;">🏅</span>' +
    '<h3 style="margin:0;font-size:16px;color:var(--text-primary);">成就档案</h3>' +
    "</div>" +
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:4px;">' +
    '<span style="font-size:13px;color:var(--text-primary);font-weight:bold;">' +
    unlockedCount +
    " / " +
    totalVisible +
    "</span>" +
    '<span style="font-size:11px;color:var(--text-muted);">已解锁</span>' +
    '<span style="flex:1;"></span>' +
    '<span style="font-size:12px;color:var(--accent);font-weight:bold;">' +
    pct +
    "%</span>" +
    "</div>" +
    '<div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;">' +
    '<div style="height:100%;width:' +
    pct +
    '%;background:linear-gradient(90deg,var(--accent),#e8b84c);border-radius:3px;transition:width 0.4s;"></div>' +
    "</div>";
  parent.appendChild(header);

  // ====== 分类列表 ======
  CATEGORY_ORDER.forEach(function (cat) {
    var catAchs = all.filter(function (a) {
      return a.category === cat && (!a.hidden || a.unlocked);
    });
    if (catAchs.length === 0) return;

    var catUnlocked = catAchs.filter(function (a) {
      return a.unlocked;
    }).length;
    var catIcon = CATEGORY_ICONS[cat] || "📌";

    var section = document.createElement("div");
    section.style.cssText = "margin-bottom:8px;";

    // 分类标题 + 进度条
    var catHeader = document.createElement("div");
    catHeader.style.cssText =
      "display:flex;align-items:center;gap:8px;padding:8px 16px 4px;cursor:pointer;user-select:none;";
    catHeader.innerHTML =
      '<span style="font-size:14px;">' +
      catIcon +
      "</span>" +
      '<span style="flex:1;font-size:12px;font-weight:bold;color:var(--text-primary);">' +
      cat +
      "</span>" +
      '<span style="font-size:10px;color:var(--text-muted);">' +
      catUnlocked +
      "/" +
      catAchs.length +
      "</span>" +
      '<span style="font-size:10px;color:var(--accent);">' +
      Math.round((catUnlocked / catAchs.length) * 100) +
      "%</span>" +
      '<span style="font-size:10px;color:var(--text-muted);margin-left:4px;" class="ach-toggle">▲</span>';
    section.appendChild(catHeader);

    // 分类进度条
    var catBar = document.createElement("div");
    catBar.style.cssText = "padding:0 16px 6px;";
    catBar.innerHTML =
      '<div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden;">' +
      '<div style="height:100%;width:' +
      (catUnlocked / catAchs.length) * 100 +
      '%;background:var(--accent);border-radius:2px;"></div>' +
      "</div>";
    section.appendChild(catBar);

    // 成就卡片容器（可折叠）
    var cardContainer = document.createElement("div");
    cardContainer.style.cssText =
      "overflow:hidden;transition:max-height 0.3s;max-height:9999px;";

    catAchs.forEach(function (ach) {
      var card = document.createElement("div");
      card.style.cssText =
        "display:flex;gap:10px;align-items:flex-start;padding:8px 14px;margin:2px 12px;" +
        "background:var(--bg-card);border:1px solid " +
        (ach.unlocked ? "var(--accent)" : "var(--border)") +
        ";border-radius:8px;opacity:" +
        (ach.unlocked ? "1" : "0.5") +
        ";";

      var iconEl = document.createElement("div");
      iconEl.style.cssText =
        "font-size:20px;flex-shrink:0;width:32px;text-align:center;";
      iconEl.textContent = ach.unlocked ? ach.icon : "🔒";

      var info = document.createElement("div");
      info.style.cssText = "flex:1;min-width:0;";

      var nameRow = document.createElement("div");
      nameRow.style.cssText = "display:flex;align-items:center;gap:6px;";
      var nameEl = document.createElement("span");
      nameEl.style.cssText =
        "font-size:12px;font-weight:bold;color:" +
        (ach.unlocked ? "var(--text-primary)" : "var(--text-muted)") +
        ";";
      nameEl.textContent = ach.name;
      nameRow.appendChild(nameEl);

      if (ach.unlocked) {
        var badge = document.createElement("span");
        badge.style.cssText =
          "font-size:9px;padding:1px 5px;border-radius:4px;background:var(--accent-light);color:var(--accent);" +
          "font-weight:bold;";
        badge.textContent = "✓";
        nameRow.appendChild(badge);
      }

      info.appendChild(nameRow);

      var descEl = document.createElement("div");
      descEl.style.cssText =
        "font-size:10px;color:var(--text-secondary);margin-top:1px;";
      descEl.textContent = ach.desc;
      info.appendChild(descEl);

      if (ach.unlocked && ach.story) {
        var storyEl = document.createElement("div");
        storyEl.style.cssText =
          "font-size:9px;color:var(--text-muted);margin-top:4px;font-style:italic;" +
          "border-top:1px solid var(--border);padding-top:3px;";
        storyEl.textContent = '"' + ach.story + '"';
        info.appendChild(storyEl);
      }

      card.appendChild(iconEl);
      card.appendChild(info);
      cardContainer.appendChild(card);
    });

    section.appendChild(cardContainer);
    parent.appendChild(section);

    // 可折叠功能
    catHeader.addEventListener("click", function () {
      var container = this.nextElementSibling.nextElementSibling;
      var toggle = this.querySelector(".ach-toggle");
      if (
        container.style.maxHeight === "0px" ||
        container.style.maxHeight === "0"
      ) {
        container.style.maxHeight = "9999px";
        toggle.textContent = "▲";
      } else {
        container.style.maxHeight = "0px";
        toggle.textContent = "▼";
      }
    });
  });
}

/**
 * 成就解锁通知弹窗
 * 在成就解锁时调用，显示一个飘窗动画
 */
function showAchievementUnlockedPopup(ach) {
  if (!ach) return;
  var existing = document.getElementById("ach-popup");
  if (existing) existing.remove();

  var popup = document.createElement("div");
  popup.id = "ach-popup";
  popup.style.cssText =
    "position:fixed;top:80px;right:20px;z-index:9999;" +
    "background:linear-gradient(135deg,var(--bg-card),#2a2520);" +
    "border:2px solid var(--accent);border-radius:12px;" +
    "padding:16px 20px;min-width:260px;max-width:320px;" +
    "box-shadow:0 8px 32px rgba(0,0,0,0.4);" +
    "animation:achSlideIn 0.5s ease-out;" +
    "display:flex;gap:12px;align-items:flex-start;";

  // [全系统自洽修复] 域F 成就弹窗 innerHTML 加 _esc 防 XSS/文字截断
  popup.innerHTML =
    '<div style="font-size:32px;flex-shrink:0;">' +
    _esc(ach.icon || "🏅") +
    "</div>" +
    '<div style="flex:1;min-width:0;">' +
    '<div style="font-size:10px;color:var(--accent);font-weight:bold;margin-bottom:2px;">🏆 成就解锁</div>' +
    '<div style="font-size:14px;font-weight:bold;color:var(--text-primary);margin-bottom:2px;">' +
    _esc(ach.name) +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-secondary);">' +
    _esc(ach.desc || "") +
    "</div>" +
    "</div>";

  document.body.appendChild(popup);

  // 3秒后淡出移除
  setTimeout(function () {
    popup.style.transition = "opacity 0.5s, transform 0.5s";
    popup.style.opacity = "0";
    popup.style.transform = "translateX(50px)";
    setTimeout(function () {
      if (popup.parentNode) popup.remove();
    }, 500);
  }, 3000);
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
    "，选择一个发展方向后获得独特加成。消耗 ⚡15点行动力 + ¥200</div>" +
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

  // 第1天且无疾病记录（旧存档残留）→ 隐藏伤病栏
  if (state.player.day <= 1 && illnesses.length === 0) {
    box.style.display = "none";
    state.status.injured = false;
    return;
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

// ====== Phase 2 新 Tab 渲染函数 ======

function renderWorkplaceSocialTab(state, parent) {
  const ws = state.workplaceSocial || {};
  const html = `
    <div class="tab-content">
      <h2>👥 职场社交</h2>
      ${
        ws.colleagues && ws.colleagues.length > 0
          ? `
        <div class="section">
          <h3>同事关系网</h3>
          ${ws.colleagues
            .map(
              (c) => `
            <div class="card" style="margin:8px 0;padding:12px;">
              <div><strong>${c.name}</strong> <span class="tag">${c.role || "普通同事"}</span></div>
              <div style="margin-top:6px;">好感度: <span class="affinity">${c.affinity || 0}</span></div>
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : '<p style="color:var(--text-muted);">暂无同事关系数据</p>'
      }
      ${
        ws.mentorship
          ? `
        <div class="section">
          <h3>👨‍🏫 导师关系</h3>
          <p>当前导师: ${ws.mentorship.mentorId} (等级: ${ws.mentorship.level || "初级"})</p>
        </div>
      `
          : ""
      }
      ${
        ws.officePoliticsLog && ws.officePoliticsLog.length > 0
          ? `
        <div class="section">
          <h3>📋 办公室政治记录</h3>
          ${ws.officePoliticsLog
            .slice(-5)
            .reverse()
            .map(
              (e) => `
            <div style="font-size:12px;color:var(--text-muted);margin:4px 0;">第${e.day}天: ${e.eventType} → ${e.outcome || "未知"}</div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }
    </div>
  `;
  parent.innerHTML = html;
}

function renderFamilyTab(state, parent) {
  if (typeof initFamilySystem === "function") initFamilySystem(state);
  const fam = state.family || {};
  const spouse = fam.spouse || fam.partner || null;
  const totalAssets =
    typeof getFamilyTotalAssets === "function"
      ? getFamilyTotalAssets(state)
      : 0;
  const eligibleNpcs =
    typeof getEligibleMarriageNpcs === "function"
      ? getEligibleMarriageNpcs(state)
      : [];
  const canProposeByAsset = totalAssets >= 200000;
  const proposalHtml = spouse
    ? ""
    : `
      <div style="margin-top:10px;">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">求婚条件：NPC好感≥80，且总资产≥¥200,000（当前 ¥${totalAssets.toLocaleString()}）</div>
        ${
          eligibleNpcs.length > 0
            ? eligibleNpcs
                .map(
                  (npc) => `
          <button class="btn btn-sm btn-success family-propose-btn" data-npc="${npc.id}" ${canProposeByAsset ? "" : "disabled"}>
            💍 向${npc.name}求婚
          </button>
        `,
                )
                .join("")
            : '<p style="color:var(--text-muted);">暂无好感达到80的 NPC。</p>'
        }
      </div>`;
  const childActionHtml = spouse
    ? '<button class="btn btn-sm btn-primary family-have-child-btn">👶 迎接孩子</button>'
    : "";
  const html = `
    <div class="tab-content">
      <h2>👨‍👩‍👧 家庭与生活</h2>
      
      <div class="section">
        <h3>婚恋状态</h3>
        <p>当前阶段: <strong>${spouse ? "已婚" : fam.relationshipStage || "陌生人"}</strong></p>
        ${
          spouse
            ? `
          <div class="card" style="margin-top:8px;padding:12px;">
            <div><strong>${spouse.name || "伴侣"}</strong> <span class="tag">${spouse.typeData?.name || spouse.type || "未知类型"}</span></div>
            <div>收入: ¥${spouse.income || 0}/月 | 陪伴值: ${spouse.companionship || 0} | 幸福: ${spouse.happiness || 80}</div>
            <div style="margin-top:8px;">${childActionHtml}</div>
          </div>
        `
            : '<p style="color:var(--text-muted);">尚未建立伴侣关系</p>'
        }
        ${proposalHtml}
      </div>

      <div class="section">
        <h3>👶 子女</h3>
        ${
          fam.children && fam.children.length > 0
            ? fam.children
                .map(
                  (c) => `
          <div class="card" style="margin:8px 0;padding:12px;">
            <div><strong>${c.name || "孩子"}</strong> — ${Math.floor(c.age || 0)}岁 (${c.stage || "未知"})</div>
            <div>教育: ${c.education || "未入学"} | 教育等级: ${c.educationLevel || 0} | 月支出: ¥${c.expenses || 0}</div>
            <button class="btn btn-sm btn-primary family-edu-btn" data-child="${c.id}" style="margin-top:6px;">📚 追加教育投入</button>
          </div>
        `,
                )
                .join("")
            : '<p style="color:var(--text-muted);">暂无子女</p>'
        }
      </div>

      <div class="section">
        <h3>👴 父母养老</h3>
        ${
          fam.parents
            ? `
          <div style="display:flex;gap:16px;">
            <div class="card" style="flex:1;padding:12px;">
              <div><strong>父亲</strong> ${fam.parents.father?.age || 50}岁</div>
              <div>健康: <span class="tag">${fam.parents.father?.health || "健康"}</span></div>
              <div>陪伴需求: ${fam.parents.father?.companionship || 0}</div>
            </div>
            <div class="card" style="flex:1;padding:12px;">
              <div><strong>母亲</strong> ${fam.parents.mother?.age || 48}岁</div>
              <div>健康: <span class="tag">${fam.parents.mother?.health || "健康"}</span></div>
              <div>陪伴需求: ${fam.parents.mother?.companionship || 0}</div>
            </div>
          </div>
        `
            : ""
        }
      </div>

      <div class="section">
        <h3>🏠 房贷</h3>
        ${
          fam.mortgage
            ? `
          <p>月供: ¥${fam.mortgage.monthlyPayment || 0} | 剩余: ${fam.mortgage.remainingDays || 0}天</p>
        `
            : '<p style="color:var(--text-muted);">无房贷</p>'
        }
      </div>
    </div>
  `;
  parent.innerHTML = html;

  parent.querySelectorAll(".family-propose-btn").forEach(function (btn) {
    btn.onclick = function () {
      var result = proposeToNpc(state, btn.dataset.npc);
      if (!result.success) StateManager.addMessage(result.message, "warning");
      renderFamilyTab(state, parent);
      if (typeof renderAll === "function") renderAll();
    };
  });
  var childBtn = parent.querySelector(".family-have-child-btn");
  if (childBtn) {
    childBtn.onclick = function () {
      var result = haveChild(state);
      if (!result.success) StateManager.addMessage(result.message, "warning");
      renderFamilyTab(state, parent);
      if (typeof renderAll === "function") renderAll();
    };
  }
  parent.querySelectorAll(".family-edu-btn").forEach(function (btn) {
    btn.onclick = function () {
      var result = investChildEducation(state, btn.dataset.child);
      if (!result.success) StateManager.addMessage(result.message, "warning");
      renderFamilyTab(state, parent);
      if (typeof renderAll === "function") renderAll();
    };
  });
}

function renderPersonalGrowthTab(state, parent) {
  const pg = state.personalGrowth || {};
  const html = `
    <div class="tab-content">
      <h2>🌱 个人成长</h2>

      <div class="section">
        <h3>🏃 兴趣爱好</h3>
        ${
          pg.hobbies && Object.keys(pg.hobbies).length > 0
            ? Object.entries(pg.hobbies)
                .map(
                  ([id, h]) => `
          <div class="card" style="margin:8px 0;padding:12px;">
            <div><strong>${h.name || id}</strong> — 等级: ${h.level || 0} | XP: ${h.xp || 0}</div>
            <div>累计时长: ${h.hours || 0}小时</div>
          </div>
        `,
                )
                .join("")
            : '<p style="color:var(--text-muted);">暂无爱好记录</p>'
        }
      </div>

      <div class="section">
        <h3>💪 健康指标</h3>
        ${
          pg.health
            ? `
          <div style="display:flex;gap:12px;">
            <div class="card" style="flex:1;padding:12px;">
              <div>💪 身体健康</div>
              <div>评分: ${pg.health.physical?.score || 50}</div>
              <div>上次体检: ${pg.health.physical?.lastCheckup ? "第" + pg.health.physical.lastCheckup + "天" : "未体检"}</div>
            </div>
            <div class="card" style="flex:1;padding:12px;">
              <div>🧠 心理健康</div>
              <div>评分: ${pg.health.mental?.score || 50}</div>
              <div>压力: ${pg.health.mental?.stress || 0} | 焦虑: ${pg.health.mental?.anxiety || 0} | 抑郁: ${pg.health.mental?.depression || 0}</div>
            </div>
            <div class="card" style="flex:1;padding:12px;">
              <div>⚖️ 代谢健康</div>
              <div>评分: ${pg.health.metabolic?.score || 50}</div>
              <div>BMI: ${pg.health.metabolic?.bmi || 22}</div>
            </div>
          </div>
        `
            : ""
        }
      </div>

      <div class="section">
        <h3>👔 个人形象</h3>
        ${
          pg.image
            ? `
          <div style="display:flex;gap:12px;">
            <div>穿搭: ${pg.image.style || 0}</div>
            <div>护肤: ${pg.image.skincare || 0}</div>
            <div>健身: ${pg.image.fitness || 0}</div>
            <div>整容: ${pg.image.plastic || 0}</div>
          </div>
        `
            : ""
        }
      </div>

      <div class="section">
        <h3>🎯 人生目标</h3>
        ${
          pg.goals && pg.goals.length > 0
            ? pg.goals
                .map(
                  (g) => `
          <div class="card" style="margin:8px 0;padding:12px;">
            <div><strong>${g.category || "目标"}</strong>: ${g.description || ""}</div>
            <div>进度: ${g.currentValue || 0} / ${g.targetValue || 0} (${g.completed ? "✅ 已完成" : Math.round(((g.currentValue || 0) / (g.targetValue || 1)) * 100) + "%"})</div>
            <div>截止日期: ${g.deadline ? "第" + g.deadline + "天" : "未设定"}</div>
          </div>
        `,
                )
                .join("")
            : '<p style="color:var(--text-muted);">暂无人生目标</p>'
        }
      </div>

      <div class="section">
        <h3>📚 终身学习</h3>
        ${
          pg.learning
            ? `
          <p>已读书: ${pg.learning.booksRead || 0}本</p>
          <p>课程: ${(pg.learning.courses || []).length || 0}门</p>
          <p>证书: ${(pg.learning.certificates || []).length || 0}个</p>
        `
            : ""
        }
      </div>
    </div>
  `;
  parent.innerHTML = html;
}

/**
 * 合并的个人成长Tab（原数据可视化+原个人成长系统合并）
 * 包含：属性训练(v3.0新增,排第一) + 数据图表(排最后) + 兴趣爱好 + 健康管理 + 心理状态 + 个人形象 + 终身学习
 */
function renderMergedPersonalGrowthTab(state, parent) {
  parent.innerHTML = "";
  var p = state.player;
  var pg = state.personalGrowth || {};

  // ---- 子Tab导航（v3.0：属性训练排第一，数据排最后）----
  var subTabs = [
    { id: "pg_stat_train", label: "🏋️ 属性训练", icon: "🏋️", title: "🏋️ 属性训练 — 提升基础属性（体质/智力/敏捷/心智/魅力）" },
    { id: "pg_edu", label: "🎓 学历", icon: "🎓", title: "🎓 学历 — 查看学历等级、进修深造" },
    { id: "pg_hobbies", label: "🏃 爱好", icon: "🏃", title: "🏃 爱好 — 培养业余爱好，丰富生活" },
    { id: "pg_health", label: "💪 健康", icon: "💪", title: "💪 健康 — 健康管理、疾病治疗、保健养生" },
    { id: "pg_goals", label: "🎯 目标", icon: "🎯", title: "🎯 目标 — 人生目标追踪、阶段任务" },
    { id: "pg_charts", label: "📈 数据", icon: "📈", title: "📈 数据 — 查看个人数据统计和图表" },
  ];
  var currentSubTab = state._pgSubTab || "pg_stat_train";

  var nav = document.createElement("div");
  nav.style.cssText =
    "display:flex;gap:4px;padding:8px 12px;background:var(--bg-secondary);border-bottom:1px solid var(--border);overflow-x:auto;flex-shrink:0;";
  subTabs.forEach(function (st) {
    var btn = document.createElement("button");
    btn.className = "tab-btn" + (currentSubTab === st.id ? " active" : "");
    btn.style.cssText = "font-size:11px;padding:4px 10px;white-space:nowrap;";
    btn.textContent = st.label;
    btn.title = st.title;
    btn.onclick = function () {
      state._pgSubTab = st.id;
      renderMergedPersonalGrowthTab(state, parent);
    };
    nav.appendChild(btn);
  });
  parent.appendChild(nav);

  var content = document.createElement("div");
  content.style.cssText = "flex:1;overflow-y:auto;padding:8px;";

  switch (currentSubTab) {
    case "pg_stat_train":
      renderPgStatTrain(state, content);
      break;
    case "pg_charts":
      renderPgCharts(state, content);
      break;
    case "pg_edu":
      renderPgEdu(state, content);
      break;
    case "pg_hobbies":
      renderPgHobbies(state, content, pg);
      break;
    case "pg_health":
      renderPgHealth(state, content, pg);
      break;
    case "pg_goals":
      renderPgGoals(state, content, pg);
      break;
  }

  parent.appendChild(content);
}

/** v3.85 属性训练统一数据源（单一定义，render/logic 共享）*/
var TRAIN_DATA = {
  train_physique: {
    id: "train_physique",
    name: "🏋️ 健身房训练",
    stat: "physique",
    statLabel: "体质",
    basePrice: 30,
    priceStep: 15,
    gain: [2, 4],
    apCost: 6,
    location: "gym",
    desc: "力量训练+有氧器械，提升身体素质和抗打击能力",
    tip: "💡 体质影响搬运/工地等体力工作的效率和收入",
  },
  train_intelligence: {
    id: "train_intelligence",
    name: "📚 自习充电",
    stat: "intelligence",
    statLabel: "智力",
    basePrice: 20,
    priceStep: 12,
    gain: [1, 3],
    apCost: 6,
    location: "school",
    desc: "图书馆/自习室系统学习，提升思维和分析能力",
    tip: "💡 智力影响脑力工作表现、副业收入和事件成功率",
  },
  train_agility: {
    id: "train_agility",
    name: "🏃 晨跑锻炼",
    stat: "agility",
    statLabel: "敏捷",
    basePrice: 0,
    priceStep: 0,
    gain: [1, 2],
    apCost: 3,
    location: "park",
    desc: "公园晨跑+拉伸，提升反应速度和身体协调性",
    tip: "💡 敏捷影响快递/配送等灵活工作的效率",
  },
  train_mental: {
    id: "train_mental",
    name: "🧘 冥想静心",
    stat: "mental",
    statLabel: "心智",
    basePrice: 0,
    priceStep: 0,
    gain: [1, 2],
    apCost: 2,
    location: null,
    desc: "深呼吸+正念冥想，提升精神力和情绪稳定性",
    tip: "💡 心智影响情绪稳定、道德判断和高压下决策质量",
  },
  train_charm_grooming: {
    id: "train_charm_grooming",
    name: "💇 形象打理",
    stat: "charm",
    statLabel: "魅力",
    basePrice: 50,
    priceStep: 30,
    gain: [1, 3],
    apCost: 3,
    location: "commercial",
    desc: "理发+护肤+穿搭建议，提升外在形象和气质",
    tip: "💡 魅力影响社交效果、副业收入和人际关系",
  },
  train_charm_surgery: {
    id: "train_charm_surgery",
    name: "💉 整容手术",
    stat: "charm",
    statLabel: "魅力",
    basePrice: 2000,
    priceStep: 1500,
    gain: [5, 15],
    apCost: 8,
    location: "hospital",
    risky: true,
    desc: "高风险高回报，20%失败率（魅力-5/健康-15）",
    tip: "⚠️ 仅建议魅力需求高的玩家尝试",
  },
  train_medicine: {
    id: "train_medicine",
    name: "🏥 医学培训",
    stat: "medicine",
    statLabel: "医学",
    basePrice: 200,
    priceStep: 100,
    gain: [3, 6],
    apCost: 8,
    location: "hospital",
    desc: "在医院参加护理培训和医学讲座，积累专业知识",
    tip: "💡 医学技能是医疗护理/医师路径的门槛，需配合nursing_cert/medical_license证书",
  },
  train_social: {
    id: "train_social",
    name: "🤝 社交拓展",
    stat: "social",
    statLabel: "社交",
    basePrice: 100,
    priceStep: 50,
    gain: [2, 5],
    apCost: 5,
    location: null,
    desc: "参加行业交流会/商会活动，建立人脉网络",
    tip: "💡 社交技能影响批发倒卖、商务谈判和NPC关系深度",
  },
};

// 地点标签映射
var _TRAIN_LOC_LABELS = {
  gym: "🏋️ 健身房",
  school: "📚 学校/图书馆",
  park: "🌳 公园",
  commercial: "🏬 商业区",
  hospital: "🏥 医院",
};

/** 获取训练属性值（兼容数字属性和 skill 对象 { level, xp }） */
function _getTrainStatVal(p, stat) {
  var v = p[stat];
  if (v && typeof v === "object" && typeof v.level === "number") return v.level;
  return typeof v === "number" ? v : 0;
}
/** 设置训练属性值（兼容数字属性和 skill 对象 { level, xp }） */
function _setTrainStatVal(p, stat, val) {
  var v = p[stat];
  val = Math.min(100, Math.max(0, Math.round(val)));
  if (v && typeof v === "object" && "level" in v) {
    v.level = val;
  } else {
    p[stat] = val;
  }
}

/** v3.85 属性训练子面板（数据来自 TRAIN_DATA 常量）*/
function renderPgStatTrain(state, content) {
  var p = state.player;
  var flags = state.flags || (state.flags = {});
  var trainKeys = Object.keys(TRAIN_DATA);

  var html =
    '<div style="margin-bottom:10px;">' +
    '<h3 style="margin:0 0 4px;color:var(--text-primary);font-size:15px;">🏋️ 属性训练</h3>' +
    '<p style="font-size:11px;color:var(--text-secondary);margin-bottom:6px;line-height:1.5;">属性是角色的根基，比状态更难提升，但每一点都永久有效。每次训练随机提升属性值，价格随训练次数递增。</p>' +
    '<p style="font-size:10px;color:var(--text-muted);margin-bottom:0;">💡 属性 ≥70 开始收益递减（80→60%、90→40%）。冥想免费且随处可做，晨跑只需去公园。</p>' +
    "</div>";

  html +=
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;">';

  for (var ti = 0; ti < trainKeys.length; ti++) {
    var t = TRAIN_DATA[trainKeys[ti]];
    var count = flags["_trainCount_" + t.id] || 0;
    var price = t.basePrice + count * t.priceStep;
    var curVal = _getTrainStatVal(p, t.stat);
    var canAfford = t.basePrice === 0 || (state.resources.cash || 0) >= price;
    var locLabel = t.location
      ? _TRAIN_LOC_LABELS[t.location] || "📍 任意地点"
      : "📍 任意地点";
    var dimMult =
      curVal >= 90
        ? "0.4x"
        : curVal >= 80
          ? "0.6x"
          : curVal >= 70
            ? "0.8x"
            : "";

    html +=
      '<div style="padding:12px;background:var(--bg-card);border:2px solid var(--border);border-left:4px solid var(--accent);border-radius:10px;transition:all 0.2s;position:relative;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">' +
      '<span style="font-weight:700;font-size:14px;">' +
      t.name +
      "</span>" +
      (t.risky
        ? '<span style="font-size:9px;padding:2px 6px;background:rgba(196,85,61,0.12);color:var(--danger);border-radius:10px;font-weight:bold;">⚠️ 有风险</span>'
        : "") +
      "</div>" +
      '<div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px;line-height:1.5;">' +
      t.desc +
      "</div>" +
      '<div style="display:flex;align-items:center;gap:8px;font-size:11px;color:var(--text-muted);margin-bottom:4px;">' +
      "<span>" +
      locLabel +
      "</span>" +
      '<span style="color:var(--text-muted);">·</span>' +
      "<span>当前" +
      t.statLabel +
      '：<strong style="color:var(--text-primary);">' +
      curVal +
      "</strong>/100</span>" +
      "</div>" +
      '<div style="display:flex;align-items:center;gap:6px;font-size:11px;margin-bottom:4px;flex-wrap:wrap;">' +
      (t.basePrice > 0
        ? '<span style="color:' +
          (canAfford ? "var(--success)" : "var(--danger)") +
          ';font-weight:bold;">¥' +
          price +
          "</span>"
        : '<span style="color:var(--success);font-weight:bold;">🆓 免费</span>') +
      '<span style="color:var(--text-muted);">·</span>' +
      "<span>⏱ AP " +
      t.apCost +
      "</span>" +
      '<span style="color:var(--text-muted);">·</span>' +
      '<span style="color:var(--accent);">+' +
      t.gain[0] +
      "~" +
      t.gain[1] +
      t.statLabel +
      "</span>" +
      (dimMult
        ? '<span style="color:var(--warning);font-size:10px;">(' +
          dimMult +
          ")</span>"
        : "") +
      "</div>" +
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">已训练 ' +
      count +
      " 次" +
      (count > 0 ? "（下次价格 ¥" + (price + t.priceStep) + "）" : "") +
      "</div>" +
      '<div style="font-size:10px;color:var(--info);line-height:1.4;margin-bottom:6px;">' +
      t.tip +
      "</div>" +
      "<button onclick=\"window.__doTrain('" +
      t.id +
      "')\" " +
      (canAfford ? "" : "disabled") +
      ' style="width:100%;padding:8px 12px;background:' +
      (canAfford ? "var(--accent)" : "var(--bg-secondary)") +
      ";color:#fff;" +
      ";border:1px solid " +
      (canAfford ? "var(--accent)" : "var(--border)") +
      ";border-radius:6px;cursor:" +
      (canAfford ? "pointer" : "not-allowed") +
      ';font-size:13px;font-weight:600;transition:all 0.15s;">' +
      (canAfford ? "⚡ 开始训练" : "💸 现金不足") +
      "</button></div>";
  }

  html += "</div>";

  // 属性成长说明
  html +=
    '<div style="margin-top:14px;padding:12px;background:rgba(90,138,180,0.06);border:1px solid rgba(90,138,180,0.25);border-radius:8px;font-size:11px;color:var(--text-secondary);line-height:1.6;">' +
    '<strong style="color:var(--text-primary);">📊 属性成长说明</strong><br>' +
    "🏋️ 体质 → 体力工作 &nbsp;|&nbsp; " +
    "📚 智力 → 脑力工作 &nbsp;|&nbsp; " +
    "🏃 敏捷 → 灵活工作 &nbsp;|&nbsp; " +
    "🧘 心智 → 决策质量 &nbsp;|&nbsp; " +
    "💇 魅力 → 社交效果<br>" +
    '<span style="color:var(--text-muted);font-size:10px;">💡 属性影响：工作绩效、副业收入、事件成功率、晋升条件。属性越高成长越慢，保持长期投入是关键。</span>' +
    "</div>";

  content.innerHTML = html;
}

/** v3.85 训练执行（暴露给 onclick，数据源 TRAIN_DATA）*/
window.__doTrain = function (trainId) {
  var state = StateManager.getState();
  var p = state.player;
  var flags = state.flags || (state.flags = {});
  var t = TRAIN_DATA[trainId];
  if (!t) return;

  // 地点检查：不在所需地点时弹出确认导航弹窗
  if (t.location) {
    var curLoc = state.location || state.currentLocation || "slum";
    if (curLoc !== t.location) {
      var navFn = typeof navigateTo === "function" ? navigateTo : null;
      var locLabel = _TRAIN_LOC_LABELS[t.location] || t.location;
      // 从 TRAIN_DATA key 提取 emoji
      var icon = trainId.substring(0, 2);
      showModal({
        title: icon + " 需要前往" + locLabel.replace(/[^\u4e00-\u9fa5]/g, ""),
        body:
          '<div style="padding:8px 0;font-size:13px;line-height:1.7;">' +
          "<p>你当前不在 <strong>" +
          locLabel +
          "</strong>，无法在此进行训练。</p>" +
          '<p style="margin-top:6px;">前往 ' +
          locLabel +
          " 需要消耗行动力和交通费。</p>" +
          '<p style="margin-top:6px;color:var(--text-muted);font-size:12px;">💡 ' +
          t.statLabel +
          " 当前值：" +
          _getTrainStatVal(p, t.stat) +
          "，训练可提升属性点。</p></div>",
        buttons: [
          {
            text: "🚶 前往" + locLabel + "并训练",
            cls: "btn btn-primary",
            callback: function () {
              if (navFn) {
                navFn(state, { type: "location", key: t.location });
                setTimeout(function () {
                  window.__doTrainCore(trainId);
                }, 400);
              } else {
                window.__doTrainCore(trainId);
              }
            },
          },
          { text: "取消", cls: "btn btn-secondary", callback: function () {} },
        ],
      });
      return;
    }
  }
  window.__doTrainCore(trainId);
};

/** v3.85 训练核心逻辑（地点已验证，数据源 TRAIN_DATA）*/
window.__doTrainCore = function (trainId) {
  var state = StateManager.getState();
  var p = state.player;
  var flags = state.flags || (state.flags = {});
  var t = TRAIN_DATA[trainId];
  if (!t) return;

  // AP 检查
  var ap = state.resources.actionPoints || 0;
  if (ap < t.apCost) {
    StateManager.addMessage(
      "⏱ 行动力不足，需要 " + t.apCost + " AP",
      "warning",
    );
    return;
  }

  var count = flags["_trainCount_" + t.id] || 0;
  var price = t.basePrice + count * t.priceStep;
  if (t.basePrice > 0 && (state.resources.cash || 0) < price) {
    StateManager.addMessage("💸 现金不足，需要¥" + price, "warning");
    return;
  }
  if (t.basePrice > 0) state.resources.cash = (state.resources.cash || 0) - price; // [全系统自洽修复] 域F A类: cash NaN守卫
  flags["_trainCount_" + t.id] = count + 1;

  // 属性训练——基于当前值递减收益（参考《完美人生》难提升设计）
  var curVal = _getTrainStatVal(p, t.stat);
  var diminishingMult =
    curVal >= 90 ? 0.4 : curVal >= 80 ? 0.6 : curVal >= 70 ? 0.8 : 1.0;

  // 风险检查（整容）
  if (t.risky && Random.chance(0.2)) {
    var oldVal = _getTrainStatVal(p, t.stat);
    _setTrainStatVal(p, t.stat, oldVal - 5);
    state.status.health = Math.max(20, (state.status.health || 100) - 15);
    state.needs.happiness = Math.max(0, (state.needs.happiness || 0) - 10);
    StateManager.addMessage(
      "💉 整容失败！魅力-5，健康-15，心情-10。医生技术不行...",
      "error",
    );
  } else {
    var baseGain = t.gain[0] + Random.int(0, t.gain[1] - t.gain[0]);
    var crit = Random.chance(0.1) ? 2 : 0;
    baseGain = Math.max(1, Math.round(baseGain * diminishingMult));
    var totalGain = baseGain + crit;
    _setTrainStatVal(p, t.stat, _getTrainStatVal(p, t.stat) + totalGain);
    var msg = "✨ " + (t.name || "训练") + " " + t.statLabel + "+" + totalGain;
    if (crit > 0) msg += "（爆击！）";
    msg += costStr({ap: t.apCost});
    if (diminishingMult < 1.0) msg += "（高属性收益递减）";
    StateManager.addMessage(msg, "success");
  }
  if (typeof consumeAP === "function") consumeAP(t.apCost);
  if (typeof renderAll === "function") renderAll();
};

/** 图表子面板（数据可视化） */
function renderPgCharts(state, content) {
  if (typeof _dataVizRenderGrowthTab === "function") {
    _dataVizRenderGrowthTab(state, content);
    return;
  }
  var p = state.player;
  var wrapper = document.createElement("div");
  wrapper.style.cssText = "padding:12px;";

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
  var statSummary = document.createElement("div");
  statSummary.style.cssText = "flex:1;min-width:0;padding-top:28px;";
  var stats = [
    { label: "体质", value: p.physique, color: "#c4803a" },
    { label: "智力", value: p.intelligence, color: "#5a8ab4" },
    { label: "敏捷", value: p.agility, color: "#5aaa5a" },
    { label: "能力", value: p.mental, color: "#9b74b8" },
    { label: "魅力", value: (p && p.charm) || 20, color: "#e08aa8" },
    { label: "名气", value: (p && p.fame) || 0, color: "#d4a017" },
    { label: "道德", value: (p && p.morality) || 50, color: "#6ac49a" },
  ];
  stats.forEach(function (s) {
    var row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:6px;margin:3px 0;";
    row.innerHTML =
      '<span style="font-size:11px;color:' +
      s.color +
      ';width:32px;">' +
      s.label +
      '</span><span style="font-size:11px;color:var(--text-secondary);">' +
      Math.round(s.value) +
      "</span>";
    statSummary.appendChild(row);
  });
  radarSection.appendChild(statSummary);
  wrapper.appendChild(radarSection);

  content.appendChild(wrapper);
  setTimeout(function () {
    try {
      if (typeof drawLineChart === "function")
        drawLineChart(
          lineCanvas,
          state._assetHistory || [],
          "#c4803a",
          "#c4803a22",
        );
      if (typeof drawRadarChart === "function")
        drawRadarChart(radarCanvas, stats, 80);
    } catch (e) {}
  }, 50);
}

/** 爱好子面板 */
function renderPgHobbies(state, content, pg) {
  var html = '<div class="tab-content">';
  html += '<h2 style="font-size:15px;">🏃 兴趣爱好</h2>';

  var hobbyEntries = pg.hobbies ? Object.entries(pg.hobbies) : [];
  if (hobbyEntries.length > 0) {
    hobbyEntries.forEach(function (_a) {
      var id = _a[0],
        h = _a[1];
      html +=
        '<div class="card" style="margin:6px 0;padding:10px;font-size:12px;">';
      html += "<strong>" + (h.name || id) + "</strong> — Lv." + (h.level || 1);
      if (h.totalSessions) html += " · 练习" + h.totalSessions + "次";
      html += "</div>";
    });
  } else {
    html +=
      '<p style="color:var(--text-muted);font-size:12px;">还没有开始任何爱好，去行动Tab培养爱好吧！</p>';
  }

  html += "</div>";
  content.innerHTML = html;
}

/** 健康子面板 */
function renderPgHealth(state, content, pg) {
  var html = '<div class="tab-content">';
  html += '<h2 style="font-size:15px;">💪 健康管理</h2>';

  html += '<div class="section"><h3>🏥 健康指标</h3>';
  html += '<div class="card" style="padding:12px;font-size:12px;">';
  if (pg.health) {
    // health的每个维度是对象{score,lastCheckup}，取score并转换为文字描述
    function _healthScoreLabel(scoreObj, dim) {
      var score =
        typeof scoreObj === "object" && scoreObj !== null
          ? scoreObj.score || 50
          : scoreObj || 50;
      var label =
        score >= 80
          ? "良好"
          : score >= 60
            ? "一般"
            : score >= 40
              ? "欠佳"
              : "较差";
      var color =
        score >= 80
          ? "var(--success)"
          : score >= 60
            ? "var(--text-secondary)"
            : score >= 40
              ? "var(--warning)"
              : "var(--danger)";
      return (
        '<span style="color:' +
        color +
        ';">' +
        label +
        "（" +
        Math.round(score) +
        "/100）</span>"
      );
    }
    html +=
      "<p>💪 身体：" + _healthScoreLabel(pg.health.physical, "body") + "</p>";
    html +=
      "<p>🧠 心理：" + _healthScoreLabel(pg.health.mental, "mental") + "</p>";
    html +=
      "<p>⚖️ 代谢：" +
      _healthScoreLabel(pg.health.metabolic, "metabolic") +
      "</p>";
  } else {
    html += "<p>暂无数据</p>";
  }
  html += "</div></div>";

  if (pg.psychology) {
    html += '<div class="section"><h3>🧠 心理状态</h3>';
    html += '<div class="card" style="padding:12px;font-size:12px;">';
    html += "<p>😰 压力：" + Math.round(pg.psychology.stress || 0) + "/100</p>";
    html +=
      "<p>😟 焦虑：" + Math.round(pg.psychology.anxiety || 0) + "/100</p>";
    html +=
      "<p>😔 抑郁：" + Math.round(pg.psychology.depression || 0) + "/100</p>";
    html += "<p>😊 心情：" + Math.round(pg.psychology.mood || 0) + "/100</p>";
    html += "</div></div>";
  }

  html += "</div>";
  content.innerHTML = html;
}

/** 目标子面板 */
function renderPgGoals(state, content, pg) {
  var html = '<div class="tab-content">';
  html += '<h2 style="font-size:15px;">🎯 人生目标</h2>';

  var goals = pg.lifeGoals || {};
  var active = goals.active || [];
  var completed = goals.completed || [];

  if (active.length > 0) {
    active.forEach(function (g) {
      var pct =
        g.targetValue > 0
          ? Math.round(((g.currentValue || 0) / g.targetValue) * 100)
          : 0;
      html +=
        '<div class="card" style="margin:6px 0;padding:10px;font-size:12px;">';
      html += "<strong>" + (g.description || "目标") + "</strong>";
      html +=
        '<div style="height:4px;background:var(--border);border-radius:2px;margin-top:6px;">' +
        '<div style="height:100%;width:' +
        pct +
        '%;background:var(--accent);border-radius:2px;"></div></div>';
      html +=
        '<span style="font-size:10px;color:var(--text-muted);">' +
        pct +
        "%</span>";
      html += "</div>";
    });
  } else {
    html +=
      '<p style="color:var(--text-muted);font-size:12px;">还没有设定人生目标。</p>';
  }

  if (completed.length > 0) {
    html += '<div style="margin-top:16px;"><h3>✅ 已完成目标</h3>';
    completed.forEach(function (g) {
      html +=
        '<div class="card" style="margin:4px 0;padding:8px;font-size:11px;">✅ ' +
        (g.description || "已完成") +
        "</div>";
    });
    html += "</div>";
  }

  html += "</div>";
  content.innerHTML = html;
}

/** 学历子面板（已从侧边栏移入个人成长Tab） */
function renderPgEdu(state, content) {
  var p = state.player;
  var edu = p.education ?? state.education ?? 0;
  var ep = p.eduProgress ||
    state.eduProgress || { studyPoints: 0, examsPassed: 0, totalExams: 6 };
  var eduNames = ["大专", "本科", "研究生", "博士"]; // [全系统自洽修复] 域F 修复: 补充博士(edu=3)定义，原缺失致渲染"undefined"
  var eduIcons = ["🎓", "📜", "🏛️", "🎓"];
  var label = (eduIcons[edu] || "🎓") + " " + (eduNames[edu] || "大专");
  var html = '<div class="tab-content">';
  html += '<h2 style="font-size:15px;">🎓 学历</h2>';
  html += '<div class="card" style="padding:16px;margin:8px 0;">';
  html +=
    '<div style="font-size:18px;font-weight:600;margin-bottom:8px;">' +
    label +
    "</div>";
  if (edu === 0) {
    var pct = Math.round((ep.examsPassed / (ep.totalExams || 6)) * 100);
    html +=
      '<div style="background:var(--bg-input);border-radius:3px;height:8px;overflow:hidden;margin:8px 0;">';
    html +=
      '<div style="width:' +
      pct +
      '%;height:100%;background:var(--accent);border-radius:3px;"></div></div>';
    html += '<div style="font-size:13px;color:var(--text-secondary);">';
    html +=
      "📝 备考进度：" +
      ep.examsPassed +
      "/" +
      (ep.totalExams || 6) +
      "门</div>";
    html +=
      '<div style="font-size:12px;color:var(--text-muted);margin-top:4px;">';
    html += "学习点：" + ep.studyPoints + "/150";
    html +=
      ' <span style="font-size:11px;">（在行动页训练属性可获取学习点）</span>';
    html += "</div>";
  } else {
    html +=
      '<div style="font-size:12px;color:var(--text-secondary);">已通过所有考试，当前学历为 ' +
      (eduNames[edu] || "博士") + // [全系统自洽修复] 域F 修复: edu=3时eduNames[edu]为undefined→兜底"博士"
      "。</div>";
  }
  html += "</div></div>";
  content.innerHTML = html;
}

// ====== 事件记录渲染 ======
function renderMessageLog(state) {
  var logEl = document.getElementById("message-log");
  if (!logEl) return;
  var contentEl = logEl.querySelector(".log-content");

  // 确保 .log-content 存在
  if (!contentEl) {
    contentEl = document.createElement("div");
    contentEl.className = "log-content";
    contentEl.style.cssText = "max-height:220px;overflow-y:auto;";
    logEl.appendChild(contentEl);
  }

  // === 首次渲染：添加折叠按钮头+预览元素（移动端可折叠） ===
  var headerEl = logEl.querySelector("h3");
  if (headerEl && !headerEl.querySelector("#message-log-toggle")) {
    var toggleBtn = document.createElement("button");
    toggleBtn.id = "message-log-toggle";
    toggleBtn.className = "btn btn-sm";
    // [全系统自洽修复] 域F 修复: 初始标签基于当前折叠状态（桌面端默认展开应显示"收起"）
    toggleBtn.textContent = logEl.classList.contains("collapsed") ? "📌 展开" : "📌 收起";
    toggleBtn.title = "展开/收起事件记录列表";
    toggleBtn.onclick = function (e) {
      e.stopPropagation();
      logEl.classList.toggle("collapsed");
      toggleBtn.textContent = logEl.classList.contains("collapsed")
        ? "📌 展开"
        : "📌 收起";
      // 展开后自动滚动到最新
      scrollMessageLogToTop();
    };
    headerEl.appendChild(toggleBtn);
  }
  // 创建预览行（仅移动端可见）
  if (!document.getElementById("message-log-preview")) {
    var preview = document.createElement("div");
    preview.id = "message-log-preview";
    preview.onclick = function () {
      logEl.classList.remove("collapsed");
      var tb = logEl.querySelector("#message-log-toggle");
      if (tb) tb.textContent = "📌 收起";
      scrollMessageLogToTop();
    };
    logEl.appendChild(preview);
  }

  // 移动端默认折叠（首次渲染时）
  if (window.innerWidth <= 768 && !logEl._collapseInit) {
    logEl.classList.add("collapsed");
    logEl._collapseInit = true;
    var tb = logEl.querySelector("#message-log-toggle");
    if (tb) tb.textContent = "📌 展开";
  }

  // [全系统自洽修复] 域F 联动增强: 消息记录类型过滤（F→B 帮助玩家快速定位事件/收入/系统消息）
  var _logFilter = state._logFilter || "all";
  if (headerEl && !headerEl.querySelector("#message-log-filter")) {
    var filterWrap = document.createElement("span");
    filterWrap.id = "message-log-filter";
    filterWrap.style.cssText = "display:inline-flex;gap:2px;margin-left:6px;";
    var _filters = [
      { id: "all", label: "全部" },
      { id: "event", label: "🎭" },
      { id: "success", label: "✅" },
      { id: "warning", label: "⚠️" },
    ];
    for (var _fi = 0; _fi < _filters.length; _fi++) {
      (function (f) {
        var fb = document.createElement("button");
        fb.className = "btn btn-sm";
        fb.style.cssText = "padding:1px 5px;font-size:10px;min-width:auto;";
        fb.textContent = f.label;
        fb.title = "过滤: " + f.id;
        if (_logFilter === f.id) fb.style.borderColor = "var(--accent)";
        fb.onclick = function () {
          state._logFilter = f.id;
          renderMessageLog(state);
        };
        filterWrap.appendChild(fb);
      })(_filters[_fi]);
    }
    headerEl.appendChild(filterWrap);
  }

  var msgs = (state && state.messageLog) || [];
  // 显示全部记录（state.js 自动限制在300条以内，不再额外截断）
  var recent = msgs;
  var html = "";
  for (var i = recent.length - 1; i >= 0; i--) {
    var m = recent[i];
    var cls = m.type || "info";
    // 类型过滤
    if (_logFilter !== "all" && cls !== _logFilter) continue;
    var dayStr = m.day ? "<span class='log-day'>D" + m.day + "</span>" : "";
    var txt = String(m.text || "")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    html += "<div class='log-entry " + cls + "'>" + dayStr + txt + "</div>";
  }
  contentEl.innerHTML =
    html ||
    "<div class='log-entry info' style='color:var(--text-muted);'>暂无事件记录</div>";

  // === 更新预览行：显示最新一条 ===
  var previewEl = document.getElementById("message-log-preview");
  if (previewEl && recent.length > 0) {
    var last = recent[recent.length - 1];
    var dayStr = last.day
      ? "<span class='log-day'>D" + last.day + "</span>"
      : "";
    var txt = String(last.text || "")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    previewEl.innerHTML =
      "<div class='log-preview-inner'>" +
      dayStr +
      txt.slice(0, 40) +
      (txt.length > 40 ? "…" : "") +
      "</div>";
  } else if (previewEl) {
    previewEl.innerHTML =
      "<div class='log-preview-inner' style='color:var(--text-muted);'>暂无事件</div>";
  }

  // 自动滚动到最新（最上方）
  scrollMessageLogToTop();
}

function scrollMessageLogToTop() {
  var logEl = document.getElementById("message-log");
  if (!logEl) return;
  var c = logEl.querySelector(".log-content");
  if (c) c.scrollTop = 0;
}

/** [全系统自洽修复] 域A 联动增强1: 供需状态标签 — 在交易Tab商品卡片显示供需指示器 */
function _renderSupplyDemandTag(state, goodId) {
  if (!state || !state.trade || !state.trade.supplyDemand) return "";
  var locKey = state.trade.currentLocation;
  if (!locKey || !state.trade.supplyDemand[locKey]) return "";
  var sd = state.trade.supplyDemand[locKey][goodId];
  if (sd === undefined || sd === null) return "";
  if (sd > 15) return '<span style="color:var(--danger);font-size:10px;margin-left:4px;">📈 供不应求</span>';
  if (sd > 5) return '<span style="color:var(--warning);font-size:10px;margin-left:4px;">📈 需求旺盛</span>';
  if (sd < -15) return '<span style="color:var(--success);font-size:10px;margin-left:4px;">📉 供过于求</span>';
  if (sd < -5) return '<span style="color:var(--info);font-size:10px;margin-left:4px;">📉 供给过剩</span>';
  return "";
}
