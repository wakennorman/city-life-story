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

  // ===== 移动端固定 HUD（flex-shrink:0 兄弟节点） =====
  // 创建 #mobile-hud 作为 #content-area 的兄弟节点（与 #tab-bar 同级），
  // 利用 flex 布局让其固定不动，只有 #content-area 滚动，AP/状态始终可见
  var _isMobile = window.innerWidth <= 768;
  if (_isMobile) {
    var _hudEl = document.getElementById("mobile-hud");
    if (!_hudEl) {
      _hudEl = document.createElement("div");
      _hudEl.id = "mobile-hud";
      area.parentNode.insertBefore(_hudEl, area);
    }
    _hudEl.innerHTML = "";
    renderTimeSlot(state, _hudEl);
    renderLocationBar(state, _hudEl);
    renderStatsStrip(state, _hudEl);
  } else {
    var _oldHud = document.getElementById("mobile-hud");
    if (_oldHud) _oldHud.remove();
  }

  area.innerHTML = "";

  // 人生目标（🌟 人生目标）跟随时间槽下方，紧凑显示
  renderGoalStrip(state, area);

  // 活跃新闻横幅已隐藏：新闻内容通过消息日志+弹窗传达，横幅占空间且玩家不看

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

// ====== 移动端 HUD 组件（位置/背包 + 属性/状态条）======

/**
 * 移动端位置+背包状态行
 * 结构：🎒 X/Y · 🌃 住所名  （常显，一目了然）
 */
function renderLocationBar(state, parent) {
  var container = document.createElement("div");
  container.style.cssText = "margin-bottom:4px;";

  // ---- 主行：🎒X/Y · 🌃 住所 + 天气（右对齐）----
  var div = document.createElement("div");
  div.className = "mobile-location-strip";
  div.style.cssText =
    "display:flex;align-items:center;gap:4px;padding:3px 8px;background:rgba(74,158,92,0.04);border:1px solid rgba(74,158,92,0.18);border-radius:8px;font-size:12px;";

  // v3.53：添加当前位置名 — 解决移动端"我在哪"缺失（留存三要素之首）
  var locKey = state.trade && state.trade.currentLocation;
  var locObj = typeof getLocation === "function" ? getLocation(locKey) : null;
  var locName = locObj ? locObj.name : "";
  var locSpan = document.createElement("span");
  locSpan.style.cssText =
    "white-space:nowrap;font-weight:600;color:var(--accent);max-width:30vw;overflow:hidden;text-overflow:ellipsis;";
  locSpan.textContent = "📍" + locName;

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

  // 分隔符
  var sep = document.createElement("span");
  sep.style.cssText = "color:var(--text-muted);font-size:10px;";
  sep.textContent = "·";

  // 从左到右：位置·背包 | (右侧：住所+天气)
  div.appendChild(locSpan);
  div.appendChild(sep);
  div.appendChild(bagSpan);

  // 住所 + 天气预报（右侧组，与背包不抢空间）
  var houseData =
    (typeof HOUSING_TIERS !== "undefined" &&
      HOUSING_TIERS[state.housing?.tier || 0]) ||
    null;
  var houseName = houseData ? houseData.name : "露宿街头";
  var houseIcon = houseData ? houseData.icon || "🏠" : "🌃";

  var rightGroup = document.createElement("span");
  rightGroup.style.cssText =
    "display:flex;align-items:center;gap:3px;white-space:nowrap;";

  var houseSpan = document.createElement("span");
  houseSpan.style.cssText = "color:var(--text-secondary);";
  houseSpan.textContent = houseIcon + houseName;
  rightGroup.appendChild(houseSpan);

  // 移动端：天气预报——"📅 未来天气展望" 与具体天气值交替闪烁
  if (
    window.innerWidth <= 768 &&
    state.weather &&
    state.weather.forecast &&
    state.weather.forecast.length > 0
  ) {
    var forecastArr = state.weather.forecast;
    var forecastText = "";
    for (var fi = 0; fi < Math.min(2, forecastArr.length); fi++) {
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

    // 两层绝对定位重叠，CSS forecastAlt 动画交替 opacity（3.6s 循环）
    var labelSpan = document.createElement("span");
    labelSpan.className = "f-label";
    labelSpan.textContent = "📅 未来天气展望";

    var valueSpan = document.createElement("span");
    valueSpan.className = "f-value";
    valueSpan.textContent = forecastText;

    altContainer.appendChild(labelSpan);
    altContainer.appendChild(valueSpan);
    rightGroup.appendChild(altContainer);
  }

  div.appendChild(rightGroup);
  container.appendChild(div);

  // ---- 第二行：住所升级提示（根据当前 tier 动态显示下一阶，最高级不显示）----
  var currentTier = state.housing ? state.housing.tier || 0 : 0;
  if (houseData && houseData.upgradeTip && currentTier < 6) {
    var hintDiv = document.createElement("div");
    hintDiv.className = "mobile-housing-hint";
    hintDiv.style.cssText =
      "font-size:11px;color:var(--warning);padding:2px 8px 3px;background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.15);border-radius:6px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
    hintDiv.textContent = houseData.upgradeTip;
    container.appendChild(hintDiv);
  }

  parent.appendChild(container);
}

/**
 * 移动端常驻状态条（位置/背包 与 人生目标 之间）
 * v3.9 全面重设计：加图标 + 更粗色条 + 更大字号 + 更醒目的警告态 + 卡片化
 * 结构：2 行 × 5~6 条，每条「图标 + 标签 + 粗色带 + 数值」
 *  第1行：体/智/敏/心/魅/德  6基础属性（无track bar，label flex:1 右对齐数值）
 *  第2行：饿/疲/卫/情/健  5状态（有track bar色带）
 */
function renderStatsStrip(state, parent) {
  var p = state.player;
  var n = state.needs || {};
  var s = state.status || {};

  var container = document.createElement("div");
  container.className = "mobile-stats-strip";

  /**
   * 构建一行状态单元格
   * @param {Array} items - 配置数组
   * @param {boolean} showTrack - 是否显示色带（第1行6属性不显示，第2行5需求显示）
   */
  function buildRow(items, showTrack) {
    var row = document.createElement("div");
    row.className = "mss-row";

    items.forEach(function (cfg) {
      var val = cfg.getVal();
      var valClamped = Math.max(0, Math.min(100, val));

      // 预警判定（高即坏的如疲劳用 inverted）
      var isBad = cfg.inverted ? val >= cfg.threshold : val <= cfg.threshold;
      var isSevere = cfg.inverted
        ? val >= cfg.threshold * 1.4
        : val <= cfg.threshold * 0.6;

      var cell = document.createElement("div");
      cell.className =
        "mss-cell" +
        (showTrack ? " mss-cell-has-track" : " mss-cell-no-track") +
        (isBad ? " mss-warn" : "") +
        (isSevere ? " mss-severe" : "");

      // emoji 图标
      if (cfg.icon) {
        var iconSpan = document.createElement("span");
        iconSpan.className = "mss-icon";
        iconSpan.textContent = cfg.icon;
        cell.appendChild(iconSpan);
      }

      // 标签（2 中文字）
      var label = document.createElement("span");
      label.className = "mss-label";
      label.textContent = cfg.label;
      cell.appendChild(label);

      // 色带（仅第2行5需求显示；第1行6属性无色带，节省空间）
      if (showTrack) {
        var track = document.createElement("div");
        track.className = "mss-track" + (isBad ? " mss-track-warn" : "");
        var fill = document.createElement("div");
        fill.className = "mss-fill " + cfg.cls;
        fill.style.width = valClamped + "%";
        if (isBad) {
          fill.style.background = cfg.color;
          fill.style.animation = "ap-blink 1.2s infinite";
        }
        if (isSevere) {
          fill.style.animation = "ap-blink 0.6s infinite";
        }
        track.appendChild(fill);
        cell.appendChild(track);
      }

      // 数值（坏值变色 + 加粗）
      var num = document.createElement("span");
      num.className = "mss-val";
      num.textContent = (isSevere && !showTrack ? "⚠" : "") + Math.round(val);
      if (isBad) {
        num.style.color = cfg.color;
        num.style.fontWeight = "800";
      }
      cell.appendChild(num);

      row.appendChild(cell);
    });
    return row;
  }

  // ---- 第1行：6 基础属性（体质/智力/敏捷/心智/魅力/道德）----
  var attrs = [
    {
      label: "体质",
      icon: "💪",
      cls: "physique",
      color: "#e07a30",
      threshold: 10,
      getVal: function () {
        return p.physique || 0;
      },
    },
    {
      label: "智力",
      icon: "🧠",
      cls: "intelligence",
      color: "#4a8ee6",
      threshold: 10,
      getVal: function () {
        return p.intelligence || 0;
      },
    },
    {
      label: "敏捷",
      icon: "🏃",
      cls: "agility",
      color: "#4cb84a",
      threshold: 10,
      getVal: function () {
        return p.agility || 0;
      },
    },
    {
      label: "心智",
      icon: "💭",
      cls: "mental-bar",
      color: "#9a6cd0",
      threshold: 10,
      getVal: function () {
        return p.mental || 0;
      },
    },
    {
      label: "魅力",
      icon: "💋",
      cls: "charm",
      color: "#e06a92",
      threshold: 10,
      getVal: function () {
        return p.charm || 0;
      },
    },
    {
      label: "道德",
      icon: "⚖️",
      cls: "morality-bar",
      color: "#5ab480",
      threshold: 20,
      getVal: function () {
        return (p && p.morality) != null ? p.morality : 50;
      },
    },
  ];

  // ---- 第2行：5 需求状态（饥饿/疲劳/卫生/心情/健康）----
  var needs = [
    {
      label: "饥饿",
      icon: "🍚",
      cls: "hunger",
      color: "#d4b030",
      threshold: 15,
      getVal: function () {
        return n.hunger != null ? n.hunger : 100;
      },
    },
    {
      label: "疲劳",
      icon: "😰",
      cls: "fatigue",
      color: "#8a9a6a",
      threshold: 85,
      inverted: true,
      getVal: function () {
        return n.fatigue != null ? n.fatigue : 0;
      },
    },
    {
      label: "卫生",
      icon: "🚿",
      cls: "hygiene",
      color: "#3aa89e",
      threshold: 15,
      getVal: function () {
        return n.hygiene != null ? n.hygiene : 100;
      },
    },
    {
      label: "心情",
      icon: "😊",
      cls: "happiness",
      color: "#d07a5a",
      threshold: 10,
      getVal: function () {
        return n.happiness != null ? n.happiness : 100;
      },
    },
    {
      label: "健康",
      icon: "❤️",
      cls: "health",
      color: "#d45050",
      threshold: 20,
      getVal: function () {
        return s.health != null ? s.health : 100;
      },
    },
  ];

  container.appendChild(buildRow(attrs, false)); // 第1行6属性：无track bar，label flex:1右对齐数值
  container.appendChild(buildRow(needs, true)); // 第2行5需求：有色带

  // 疾病行：有疾病时在第2行之后追加
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

// ====== Tab 渲染函数（被 TAB_RENDERERS 注册表通过 window[fnName] 调用）======

/**
 * 🗺️ 城市 Tab — 地图 + 交易
 */
function renderCityTab(state, parent) {
  parent.innerHTML = "";
  // ---- 子Tab导航 ----
  var SUB_TABS = [
    { id: "city_map", label: "🗺️ 地图" },
    { id: "city_trade", label: "📦 行情" },
  ];
  var currentSubTab = state._citySubTab || "city_map";

  var nav = document.createElement("div");
  nav.style.cssText =
    "display:flex;gap:6px;padding:6px 0;flex-wrap:wrap;border-bottom:1px solid var(--border);margin-bottom:8px;";
  SUB_TABS.forEach(function (st) {
    var btn = document.createElement("button");
    btn.className =
      "btn btn-sm" + (currentSubTab === st.id ? " btn-primary" : "");
    btn.style.cssText = "font-size:11px;padding:4px 10px;white-space:nowrap;";
    btn.textContent = st.label;
    btn.onclick = function () {
      state._citySubTab = st.id;
      renderCityTab(state, parent);
      if (typeof bindAllNavButtons === "function") bindAllNavButtons();
    };
    nav.appendChild(btn);
  });
  parent.appendChild(nav);

  // ---- 内容 ----
  if (currentSubTab === "city_map") {
    if (typeof renderMapTab === "function") {
      renderMapTab(state, parent);
    } else {
      parent.innerHTML +=
        '<p style="color:var(--text-muted);text-align:center;">🗺️ 地图加载中...</p>';
    }
  } else if (currentSubTab === "city_trade") {
    if (typeof renderTradeTab === "function") {
      renderTradeTab(state, parent);
    } else {
      parent.innerHTML +=
        '<p style="color:var(--text-muted);text-align:center;">📦 交易数据加载中...</p>';
    }
  }
  // 绑定导航按钮（子Tab切换不会经过 renderAll）
  if (typeof bindAllNavButtons === "function") bindAllNavButtons();
}

/**
 * 👤 我 Tab — 角色面板（背包/技能/成长/人生事务）
 */
function renderMeTab(state, parent) {
  parent.innerHTML = "";
  // ---- 子Tab导航 ----
  var SUB_TABS = [
    { id: "me_inventory", label: "🎒 背包" },
    { id: "me_skills", label: "📚 技能" },
    { id: "me_growth", label: "🌱 成长" },
    { id: "me_life", label: "🏥 人生事务" },
  ];
  var currentSubTab = state._meSubTab || "me_inventory";

  var nav = document.createElement("div");
  nav.style.cssText =
    "display:flex;gap:6px;padding:6px 0;flex-wrap:wrap;border-bottom:1px solid var(--border);margin-bottom:8px;";
  SUB_TABS.forEach(function (st) {
    var btn = document.createElement("button");
    btn.className =
      "btn btn-sm" + (currentSubTab === st.id ? " btn-primary" : "");
    btn.style.cssText = "font-size:11px;padding:4px 10px;white-space:nowrap;";
    btn.textContent = st.label;
    btn.onclick = function () {
      state._meSubTab = st.id;
      renderMeTab(state, parent);
      if (typeof bindAllNavButtons === "function") bindAllNavButtons();
    };
    nav.appendChild(btn);
  });
  parent.appendChild(nav);

  // ---- 内容 ----
  switch (currentSubTab) {
    case "me_inventory": {
      if (typeof renderInventoryTab === "function") {
        renderInventoryTab(state, parent);
      } else {
        parent.innerHTML +=
          '<p style="color:var(--text-muted);text-align:center;">🎒 背包加载中...</p>';
      }
      break;
    }
    case "me_skills": {
      if (typeof renderSkillsTab === "function") {
        renderSkillsTab(state, parent);
      } else {
        parent.innerHTML +=
          '<p style="color:var(--text-muted);text-align:center;">📚 技能系统加载中...</p>';
      }
      break;
    }
    case "me_growth": {
      if (typeof renderMergedPersonalGrowthTab === "function") {
        renderMergedPersonalGrowthTab(state, parent);
      } else {
        parent.innerHTML +=
          '<p style="color:var(--text-muted);text-align:center;">🌱 个人成长加载中...</p>';
      }
      break;
    }
    case "me_life": {
      if (typeof renderLifeSystemsTab === "function") {
        renderLifeSystemsTab(state, parent);
      } else {
        parent.innerHTML +=
          '<p style="color:var(--text-muted);text-align:center;">🏥 人生事务加载中...</p>';
      }
      break;
    }
  }
  // 绑定导航按钮（子Tab切换不会经过 renderAll）
  if (typeof bindAllNavButtons === "function") bindAllNavButtons();
}

/**
 * 💼 事业 Tab — 经济面板（工作/投资/副业/创业/成就）
 */
function renderCareerTab(state, parent) {
  parent.innerHTML = "";
  // ---- 子Tab导航 ----
  var SUB_TABS = [
    { id: "career_overview", label: "📊 总览" },
    { id: "career_jobs", label: "💼 求职" },
    { id: "career_invest", label: "💰 投资" },
    { id: "career_hustle", label: "🔄 副业" },
    { id: "career_startup", label: "🚀 创业" },
    { id: "career_achievements", label: "🏅 成就" },
  ];
  var hasJob = !!(state.career && state.career.currentJob);
  var currentSubTab =
    state._careerTabSubTab || (hasJob ? "career_overview" : "career_jobs");

  var nav = document.createElement("div");
  nav.style.cssText =
    "display:flex;gap:6px;padding:6px 0;flex-wrap:wrap;border-bottom:1px solid var(--border);margin-bottom:8px;";
  SUB_TABS.forEach(function (st) {
    var btn = document.createElement("button");
    btn.className =
      "btn btn-sm" + (currentSubTab === st.id ? " btn-primary" : "");
    btn.style.cssText = "font-size:11px;padding:4px 10px;white-space:nowrap;";
    btn.textContent = st.label;
    btn.onclick = function () {
      state._careerTabSubTab = st.id;
      renderCareerTab(state, parent);
      if (typeof bindAllNavButtons === "function") bindAllNavButtons();
    };
    nav.appendChild(btn);
  });
  parent.appendChild(nav);

  // ---- 内容（使用子容器，避免投资等全页模块清空导航）----
  var contentDiv = document.createElement("div");
  contentDiv.id = "career-sub-content";
  parent.appendChild(contentDiv);

  switch (currentSubTab) {
    case "career_overview": {
      if (typeof renderCareerOverview === "function") {
        renderCareerOverview(state, contentDiv);
      } else {
        contentDiv.innerHTML +=
          '<p style="color:var(--text-muted);text-align:center;">📊 总览加载中...</p>';
      }
      break;
    }
    case "career_jobs": {
      if (typeof renderCareerJobs === "function") {
        renderCareerJobs(state, contentDiv);
      } else {
        contentDiv.innerHTML +=
          '<p style="color:var(--text-muted);text-align:center;">💼 求职信息加载中...</p>';
      }
      break;
    }
    case "career_invest": {
      if (typeof renderInvestmentTab === "function") {
        renderInvestmentTab(state, contentDiv);
      } else {
        contentDiv.innerHTML +=
          '<p style="color:var(--text-muted);text-align:center;">💰 投资系统加载中...</p>';
      }
      break;
    }
    case "career_hustle": {
      var hustleContainer = document.createElement("div");
      if (typeof renderSideHustleTab === "function") {
        renderSideHustleTab(state, hustleContainer);
      }
      if (
        state.player.phase === "corporate" &&
        typeof renderEnterpriseFateTab === "function"
      ) {
        var sep = document.createElement("hr");
        sep.style.cssText =
          "margin:12px 0;border:none;border-top:1px solid var(--border);";
        hustleContainer.appendChild(sep);
        var fateTitle = document.createElement("h3");
        fateTitle.textContent = "🏭 企业生态";
        fateTitle.style.cssText = "margin-bottom:8px;";
        hustleContainer.appendChild(fateTitle);
        renderEnterpriseFateTab(state, hustleContainer);
      }
      contentDiv.appendChild(hustleContainer);
      break;
    }
    case "career_startup": {
      if (typeof renderStartupTab === "function") {
        state._careerSubTab = "career_startup";
        renderStartupTab(state, contentDiv);
      } else {
        contentDiv.innerHTML +=
          '<p style="color:var(--text-muted);text-align:center;">🚀 创业系统加载中...</p>';
      }
      break;
    }
    case "career_achievements": {
      if (typeof renderAchievementsTab === "function") {
        renderAchievementsTab(state, contentDiv);
      } else {
        contentDiv.innerHTML +=
          '<p style="color:var(--text-muted);text-align:center;">🏅 成就系统加载中...</p>';
      }
      break;
    }
  }
  // 绑定导航按钮（子Tab切换不会经过 renderAll）
  if (typeof bindAllNavButtons === "function") bindAllNavButtons();
}

// ====== Life Systems Tab: 人生节点 / 医疗 / 旅行 / 法律 ======
