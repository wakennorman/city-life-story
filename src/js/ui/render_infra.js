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

// ====== Life Systems Tab: 人生节点 / 医疗 / 旅行 / 法律 ======
