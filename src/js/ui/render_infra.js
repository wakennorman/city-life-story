// ====== 通用滚动锚定辅助函数 ======
// 返回当前在 #content-area 视口内、位置最靠上的那张 .action-card 的屏幕 top，
// 作为通用锚点（不含 goodId 时使用，覆盖行动/技能等 tab）。没有则返回 null。
function _firstVisibleActionCardTop(area) {
  var cards = area.querySelectorAll(".action-card");
  if (!cards.length) return null;
  var areaTop = area.getBoundingClientRect().top;
  for (var i = 0; i < cards.length; i++) {
    var t = cards[i].getBoundingClientRect().top;
    if (t >= areaTop - 1) return t; // 首张位于（或刚好没过）容器顶的卡片
  }
  // 全部卡片滚到上方视口外时，回退到首张卡片
  return cards[0].getBoundingClientRect().top;
}

// ====== Tab Content 渲染 ======
// anchorGoodId（可选，仅交易页）: 传入被操作商品的 id。
// 重绘后通过滚动锚定把目标卡片拉回重绘前的视口位置，避免上方区块出现/消失
// 把内容推离光标导致连点错位。
//   - 传入 anchorGoodId：精确定位到该商品所在卡片（交易页专用）；
//   - 未传入：自动锚定首张可见 .action-card（行动/技能等 tab 通用）。
function renderCurrentTab(state, anchorGoodId) {
  const area = document.getElementById("content-area");

  // ===== 阶段一（重绘前）：保存滚动状态 =====
  // 1. 卡片屏幕-位置锚定（修正上方区块伸缩导致的位移，交易/行动/技能 tab）
  var anchorOldCardScreenTop = null;
  var useSpecific = false;
  if (anchorGoodId) {
    // 精确定位：锚定用户刚点击的那张商品卡片（交易页）
    var oldCardEl = area.querySelector(
      '#trade-market-grid [data-good="' + anchorGoodId + '"]',
    );
    var oldActionCard =
      oldCardEl && oldCardEl.closest ? oldCardEl.closest(".action-card") : null;
    if (oldActionCard) {
      anchorOldCardScreenTop = oldActionCard.getBoundingClientRect().top;
      useSpecific = true;
    }
  }
  if (anchorOldCardScreenTop === null) {
    // 通用定位：锚定首张可见的 .action-card（行动/技能等 tab）
    anchorOldCardScreenTop = _firstVisibleActionCardTop(area);
  }

  // 2. 内层滚动容器 scrollTop 备份 + 锚点内容坐标（事业 tab 等拥有独立内层滚动容器的情况）
  //    同时记录容器内 [data-scroll-anchor] 在内容坐标系中的位置，用于修正上方区块伸缩导致的按钮位移
  var innerScrollRestore = null;
  for (var _ci = 0; _ci < area.children.length; _ci++) {
    var _child = area.children[_ci];
    var _oy =
      _child.style && _child.style.overflowY
        ? _child.style.overflowY
        : getComputedStyle(_child).overflowY;
    if (_oy === "auto" || _oy === "scroll") {
      innerScrollRestore = {
        childIndex: _ci,
        scrollTop: _child.scrollTop,
        anchorContentPos: null,
      };
      var _anchor = _child.querySelector("[data-scroll-anchor]");
      if (_anchor) {
        // 锚点在内容坐标系中的位置 = 屏幕相对位置 + 已滚动偏移（与 position 无关的稳健算法）
        innerScrollRestore.anchorContentPos =
          _anchor.getBoundingClientRect().top -
          _child.getBoundingClientRect().top +
          _child.scrollTop;
      }
      break;
    }
  }

  area.innerHTML = "";

  // 时间槽指示器（日期 + 时段 + AP）
  renderTimeSlot(state, area);

  // 移动端专属：背包 + 住所状态条（上移至标题行位置，标题行已移除）
  renderLocationBar(state, area);

  // 移动端专属：常驻状态条（10 个核心数值，2 行 × 5 条 — 直观显性化）
  renderStatsStrip(state, area);

  // 人生目标（🌟 人生目标）跟随时间槽下方，紧凑显示
  renderGoalStrip(state, area);

  // 活跃新闻
  renderActiveNews(state, area);

  const renderer = TAB_RENDERERS[currentTab];
  if (typeof renderer === "function") {
    renderer(state, area);
  } else if (renderer) {
    // 尝试获取渲染函数：优先用 fn 引用，否则通过 fnName 动态查找
    var actualFn =
      typeof renderer.fn === "function"
        ? renderer.fn
        : typeof renderer.fnName === "string"
          ? window[renderer.fnName]
          : null;
    if (typeof actualFn === "function") {
      actualFn(state, area);
    } else {
      area.innerHTML +=
        '<p style="color:var(--text-muted);text-align:center;padding:40px;">' +
        (renderer.fallback || "开发中...") +
        "</p>";
    }
  } else {
    area.innerHTML += '<p style="color:var(--text-muted)">📌 开发中...</p>';
  }

  // ===== 阶段二（重绘后）：恢复滚动状态 =====
  // 1. 恢复内层滚动容器 scrollTop，并按锚点位移差修正（优先执行）
  if (innerScrollRestore) {
    var newChild = area.children[innerScrollRestore.childIndex];
    if (newChild) {
      var newOy =
        newChild.style && newChild.style.overflowY
          ? newChild.style.overflowY
          : getComputedStyle(newChild).overflowY;
      if (newOy === "auto" || newOy === "scroll") {
        var restoredScroll = innerScrollRestore.scrollTop;
        // 若存在锚点，按内容位移差修正 scrollTop，保持锚点屏幕位置不变
        if (innerScrollRestore.anchorContentPos != null) {
          var newAnchor = newChild.querySelector("[data-scroll-anchor]");
          if (newAnchor) {
            var newAnchorContentPos =
              newAnchor.getBoundingClientRect().top -
              newChild.getBoundingClientRect().top +
              newChild.scrollTop; // 此时 scrollTop 刚被 innerHTML="" 归零，≈ 0
            var delta =
              newAnchorContentPos - innerScrollRestore.anchorContentPos;
            restoredScroll = innerScrollRestore.scrollTop + delta;
          }
        }
        newChild.scrollTop = Math.max(0, restoredScroll);
      }
    }
  }

  // 2. 卡片屏幕-位置锚定（修正上方区块伸缩导致的位移）
  if (anchorOldCardScreenTop === null) return;

  var newCardScreenTop;
  if (useSpecific) {
    var newCardEl = area.querySelector(
      '#trade-market-grid [data-good="' + anchorGoodId + '"]',
    );
    var newActionCard =
      newCardEl && newCardEl.closest ? newCardEl.closest(".action-card") : null;
    if (!newActionCard) return; // 商品不再显示，放弃锚定
    newCardScreenTop = newActionCard.getBoundingClientRect().top;
  } else {
    newCardScreenTop = _firstVisibleActionCardTop(area);
    if (newCardScreenTop === null) return; // 新页面没有卡片，放弃锚定
  }
  var delta = newCardScreenTop - anchorOldCardScreenTop;
  if (delta !== 0) {
    area.scrollTop += delta;
    // 防止上方区块缩小时滚到负值
    if (area.scrollTop < 0) area.scrollTop = 0;
  }
}

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
function renderLocationBar(state, parent) {
  var div = document.createElement("div");
  div.className = "mobile-location-strip";
  div.style.cssText =
    "display:flex;align-items:center;gap:4px;padding:3px 8px;background:rgba(74,158,92,0.04);border:1px solid rgba(74,158,92,0.18);border-radius:8px;margin-bottom:4px;font-size:12px;";

  // 背包容量
  var itemCount = 0;
  if (state.inventory && state.inventory.items) {
    itemCount = state.inventory.items.reduce(function (sum, item) {
      return sum + (item.qty || 0);
    }, 0);
  }
  var totalCap = state.inventory ? state.inventory.capacity || 0 : 0;
  var hasStorage = state.housing && state.housing.storageRented ? " 📦仓" : "";

  var bagSpan = document.createElement("span");
  bagSpan.style.cssText = "white-space:nowrap;font-weight:600;";
  bagSpan.textContent = "🎒" + itemCount + "/" + totalCap + hasStorage;
  div.appendChild(bagSpan);

  // 分隔符
  var sep = document.createElement("span");
  sep.style.cssText = "color:var(--text-muted);font-size:10px;";
  sep.textContent = "·";
  div.appendChild(sep);

  // 住所 + 住所名紧贴升级提示（均与住所名紧邻，右对齐组）
  var houseData =
    (typeof HOUSING_TIERS !== "undefined" &&
      HOUSING_TIERS[state.housing?.tier || 0]) ||
    null;
  var houseName = houseData ? houseData.name : "露宿街头";
  var houseIcon = houseData ? houseData.icon || "🏠" : "🌃";

  // 右侧组（住所名 + 升级提示 紧贴，作为整体右对齐）
  var rightGroup = document.createElement("span");
  rightGroup.style.cssText =
    "display:flex;align-items:center;gap:2px;margin-left:auto;white-space:nowrap;";

  var houseSpan = document.createElement("span");
  houseSpan.style.cssText = "color:var(--text-secondary);";
  houseSpan.textContent = houseIcon + houseName;
  rightGroup.appendChild(houseSpan);

  var currentTier = state.housing ? state.housing.tier || 0 : 0;
  // 升级提示：露宿时引导升级（提示随住所变化而变化）
  if (currentTier === 0) {
    var tipSpan = document.createElement("span");
    tipSpan.style.cssText = "font-size:10px;color:var(--warning);";
    tipSpan.textContent = "💡去城中村可升级为🛏️合租床位";
    rightGroup.appendChild(tipSpan);
  }

  // 移动端：在住所后添加天气预报（交替闪烁）
  if (
    window.innerWidth <= 768 &&
    state.weather &&
    state.weather.forecast &&
    state.weather.forecast.length > 0
  ) {
    var forecastArr = state.weather.forecast;
    var forecastText = "";
    for (var fi = 0; fi < forecastArr.length; fi++) {
      var f = forecastArr[fi];
      var fDef =
        typeof WEATHER_TYPES !== "undefined"
          ? WEATHER_TYPES.find(function (wt) {
              return wt.id === f.weatherId;
            })
          : null;
      var fic = fDef ? fDef.icon : "\u{1F324}️";
      var fnm = fDef ? fDef.name : "未知";
      var pct = Math.round(f.confidence * 100);
      forecastText += fic + fnm + pct + "%";
      if (fi < forecastArr.length - 1) forecastText += " ";
    }

    var altContainer = document.createElement("span");
    altContainer.className = "mobile-forecast-alt";
    altContainer.title = "未来天气预报";

    var labelSpan = document.createElement("span");
    labelSpan.className = "f-label";
    labelSpan.textContent = "📅明日天气预报";
    altContainer.appendChild(labelSpan);

    var valueSpan = document.createElement("span");
    valueSpan.className = "f-value";
    valueSpan.textContent = forecastText;
    altContainer.appendChild(valueSpan);

    rightGroup.appendChild(altContainer);
  }

  div.appendChild(rightGroup);

  parent.appendChild(div);
}

/**
 * 移动端常驻状态条（位置/背包 与 人生目标 之间）
 * 结构：2 行 × 5 条，每条「细标签 + 细色带 + 数值」
 *  第1行：体/智/敏/心/魅  5基础属性
 *  第2行：饿/疲/卫/情/健  5状态
 * 与侧栏 #stat-* 采用同一 CSS 色梯度类、同一预警阈值
 */
function renderStatsStrip(state, parent) {
  var p = state.player;
  var n = state.needs || {};
  var s = state.status || {};

  var container = document.createElement("div");
  container.className = "mobile-stats-strip";

  // 单行 5 条紧凑型细色带
  function buildRow(items) {
    var row = document.createElement("div");
    row.className = "mss-row";
    items.forEach(function (cfg) {
      var val = cfg.getVal();
      var cell = document.createElement("div");
      cell.className = "mss-cell";

      // 预警：低数值（或高即坏如疲劳）时用该要素本身色值予以薄边+数值变色
      var isBad = cfg.inverted ? val >= cfg.threshold : val <= cfg.threshold;
      var warnStyle = isBad ? "border-bottom:2px solid " + cfg.color + ";" : "";

      cell.style.cssText =
        "flex:1;min-width:0;display:flex;align-items:center;gap:3px;padding:2px 3px;border-radius:4px;background:rgba(0,0,0,0.02);" +
        warnStyle;

      // 细标签（1~2 中文字）
      var label = document.createElement("span");
      label.className = "mss-label";
      label.textContent = cfg.label;
      cell.appendChild(label);

      // 细色带（复用侧栏同名 CSS 渐变色，不重新定义）
      var track = document.createElement("div");
      track.className = "mss-track";
      var fill = document.createElement("div");
      fill.className = "mss-fill " + cfg.cls;
      fill.style.width = Math.max(0, Math.min(100, val)) + "%";
      track.appendChild(fill);
      cell.appendChild(track);

      // 数值（坏值时变色）
      var num = document.createElement("span");
      num.className = "mss-val";
      num.textContent = Math.round(val);
      if (isBad) {
        num.style.color = cfg.color;
        num.style.fontWeight = "700";
      }
      cell.appendChild(num);

      row.appendChild(cell);
    });
    return row;
  }

  var attrs = [
    {
      label: "体质",
      cls: "physique",
      color: "#c4803a",
      threshold: 10,
      getVal: function () {
        return p.physique || 0;
      },
    },
    {
      label: "智力",
      cls: "intelligence",
      color: "#5a8ab4",
      threshold: 10,
      getVal: function () {
        return p.intelligence || 0;
      },
    },
    {
      label: "敏捷",
      cls: "agility",
      color: "#5aaa5a",
      threshold: 10,
      getVal: function () {
        return p.agility || 0;
      },
    },
    {
      label: "心智",
      cls: "mental-bar",
      color: "#9b74b8",
      threshold: 10,
      getVal: function () {
        return p.mental || 0;
      },
    },
    {
      label: "魅力",
      cls: "charm",
      color: "#d9789e",
      threshold: 10,
      getVal: function () {
        return p.charm || 0;
      },
    },
  ];

  var needs = [
    {
      label: "饥饿",
      cls: "hunger",
      color: "#c9a838",
      threshold: 15,
      getVal: function () {
        return n.hunger != null ? n.hunger : 100;
      },
    },
    {
      label: "疲劳",
      cls: "fatigue",
      color: "#8a9080",
      threshold: 85,
      inverted: true,
      getVal: function () {
        return n.fatigue != null ? n.fatigue : 0;
      },
    },
    {
      label: "卫生",
      cls: "hygiene",
      color: "#4a9490",
      threshold: 15,
      getVal: function () {
        return n.hygiene != null ? n.hygiene : 100;
      },
    },
    {
      label: "心情",
      cls: "happiness",
      color: "#cc7868",
      threshold: 10,
      getVal: function () {
        return n.happiness != null ? n.happiness : 100;
      },
    },
    {
      label: "健康",
      cls: "health",
      color: "#cc7868",
      threshold: 20,
      getVal: function () {
        return s.health != null ? s.health : 100;
      },
    },
  ];

  container.appendChild(buildRow(attrs));
  container.appendChild(buildRow(needs));

  // 疾病行：有疾病时在第2行之后追加（保持 5+急性病的紧凑信息）
  if (s.illnesses && s.illnesses.length > 0) {
    var illnessDiv = document.createElement("div");
    illnessDiv.className = "mss-illness";
    var names = s.illnesses
      .map(function (d) {
        var nm = typeof d === "string" ? d : d.name || d.id || "";
        return nm;
      })
      .filter(Boolean);
    illnessDiv.textContent = "🤒 " + names.join("、");
    container.appendChild(illnessDiv);
  }

  parent.appendChild(container);
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

  // 住所数据（用于 "· Qn" 企业季标签）
  var phaseLabel =
    state.player.phase === "corporate" ? ` · Q${state.player.corpQuarter}` : "";

  const ap = state.player.actionPoints || 0;
  const maxAp = state.player.maxActionPoints || 100;
  // 低AP闪烁警告（≤20时加CSS闪烁动画）
  const lowAp = ap <= 20 && ap > 0;
  const apColor =
    ap > 50 ? "var(--success)" : ap > 20 ? "var(--warning)" : "var(--danger)";
  // 底部独立行：🎒 背包 / 🌃 已提取到 renderLocationBar，此处仅保留日期 + 时段 + AP
  div.style.cssText = `display:flex;align-items:center;gap:6px;padding:6px 12px;background:var(--bg-card);border-radius:8px;margin-bottom:6px;${lowAp ? "border:2px solid var(--warning);box-shadow:0 0 12px rgba(196,154,58,0.35);animation:ap-blink-border 1.5s infinite;" : "border:1px solid var(--border);"}`;
  // 移动端：在时段和AP之间插入天气简况
  var weatherHTML = "";
  if (window.innerWidth <= 768 && state.weather && state.weather.current) {
    var wDef =
      typeof WEATHER_TYPES !== "undefined"
        ? WEATHER_TYPES.find(function (wt) {
            return wt.id === state.weather.current;
          })
        : null;
    if (wDef) {
      var temp = Math.round(state.weather.temperature || 22);
      var tempEffect =
        typeof getTempEffect === "function"
          ? getTempEffect(state.weather.temperature || 22)
          : null;
      var comfort =
        state.status && state.status.comfort != null
          ? state.status.comfort
          : 50;
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
      weatherHTML =
        '<span style="color:var(--text-muted);font-size:10px;">|</span>' +
        '<span style="font-size:11px;white-space:nowrap;">' +
        wDef.icon +
        wDef.name +
        " " +
        temp +
        "°C" +
        (tempEffect
          ? '<span style="font-size:10px;color:var(--text-muted);">(' +
            tempEffect.name +
            ")</span>"
          : "") +
        '<span style="font-size:10px;color:' +
        comfortColor +
        ';margin-left:2px;">' +
        comfortLabel +
        "</span>" +
        "</span>";
    }
  }

  div.innerHTML = `
    <span style="white-space:nowrap;">📅 第 <strong>${state.player.day}</strong> 天</span>
    <span style="color:var(--text-muted);">|</span>
    <span class="time-slot-badge ${slot}">${slotNames[slot]}</span>
    ${weatherHTML}
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
  var progress =
    typeof getDreamProgress === "function" ? getDreamProgress(state) : 0;
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
    dream.icon +
    " " +
    dream.name +
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
