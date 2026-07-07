/**
 * 全游戏统一导航系统 (v1.0)
 *
 * 集中管理所有跳转逻辑，提供统一的 navigateTo API：
 *   - Tab 切换
 *   - 地点旅行（含行动力/金钱消耗确认）
 *   - 百科条目跳转
 *   - 子Tab导航
 *   - 跨系统上下文导航
 *
 * 设计参照：《城市：天际线》右键菜单跳转 / 《Papers Please》弹窗确认 / 《大多数》UI流畅性
 *
 * 用法：
 *   navigateTo(state, { type: 'tab', name: 'actions' })
 *   navigateTo(state, { type: 'location', key: 'school', ap: 12 })
 *   navigateTo(state, { type: 'wiki', cat: 'locations', entry: 'school' })
 *   navigateTo(state, { type: 'subTab', tab: 'personal_growth', subTab: 'pg_edu' })
 */

// ================================================================
//  导航目标类型
// ================================================================
var NAV_TYPES = {
  TAB: "tab",
  LOCATION: "location",
  WIKI: "wiki",
  SUB_TAB: "subTab",
  ACTION: "action",
  WIKI_LIST: "wikiList",
};

// ================================================================
//  统一导航入口
// ================================================================

/**
 * 统一导航入口 — 所有跳转最终都走向这里
 *
 * @param {Object} state       当前游戏状态
 * @param {Object} target      导航目标
 * @param {string} target.type  导航类型：'tab' | 'location' | 'wiki' | 'subTab' | 'action'
 * @param {string} target.name  目标 Tab 名（type='tab' 或 type='subTab' 时）
 * @param {string} target.key   目标地点 key（type='location' 时）
 * @param {string} target.cat   百科分类（type='wiki' 时）
 * @param {string} target.entry 百科条目 ID（type='wiki' 时）
 * @param {string} target.subTab 子Tab ID（type='subTab' 时）
 * @param {string} target.actionId 行动 ID（type='action' 时）
 * @param {Object} [options]    可选参数
 * @param {string} [options.title]        确认弹窗标题（覆盖默认）
 * @param {string} [options.body]         确认弹窗内容（覆盖默认）
 * @param {number} [options.apCost]       AP 消耗（覆盖自动计算）
 * @param {number} [options.cashCost]     ¥ 消耗（覆盖自动计算）
 * @param {boolean} [options.skipConfirm] 跳过确认弹窗
 * @param {string} [options.confirmText]  确认按钮文字（默认"出发"）
 * @param {string} [options.cancelText]   取消按钮文字（默认"算了"）
 * @param {Function} [options.onComplete] 导航完成回调
 * @param {Function} [options.onCancel]   取消回调
 * @returns {boolean} 成功发起了导航（不是"已完成"，弹窗确认后才会真正完成）
 */
function navigateTo(state, target, options) {
  if (!state)
    state =
      typeof StateManager !== "undefined" ? StateManager.getState() : null;
  if (!state) {
    console.warn("[Nav] 无法导航：无游戏状态");
    return false;
  }
  options = options || {};

  // ---- 1. 检查目标是否可达 ----
  var check = _navCheck(state, target);
  if (!check.valid) {
    if (typeof StateManager !== "undefined" && check.message) {
      StateManager.addMessage("🚫 " + check.message, "warning");
    }
    if (options.onCancel) options.onCancel();
    return false;
  }

  // ---- 2. 是否需要确认弹窗 ----
  var apCost =
    options.apCost !== undefined ? options.apCost : check.apCost || 0;
  var cashCost =
    options.cashCost !== undefined ? options.cashCost : check.cashCost || 0;
  var hasCost = apCost > 0 || cashCost > 0;
  var skipConfirm = options.skipConfirm === true || !hasCost;

  // ---- 3. 检查资源是否充足 ----
  if (apCost > 0 && state.player && (state.player.actionPoints || 0) < apCost) {
    if (typeof StateManager !== "undefined") {
      StateManager.addMessage(
        "⚠️ 行动力不足（需要 " +
          apCost +
          "，当前 " +
          Math.floor(state.player.actionPoints || 0) +
          "）",
        "warning",
      );
    }
    if (options.onCancel) options.onCancel();
    return false;
  }
  if (
    cashCost > 0 &&
    state.resources &&
    (state.resources.cash || 0) < cashCost
  ) {
    if (typeof StateManager !== "undefined") {
      StateManager.addMessage(
        "💸 现金不足（需要 ¥" +
          cashCost +
          "，当前 ¥" +
          Math.floor(state.resources.cash || 0) +
          "）",
        "warning",
      );
    }
    if (options.onCancel) options.onCancel();
    return false;
  }

  // ---- 4. 执行导航（免确认时直接走，需确认时弹窗）----
  if (skipConfirm) {
    _doNavigate(state, target, options);
    return true;
  }

  // ---- 需要确认弹窗 ----
  var title = options.title || check.title || "导航确认";
  var body = options.body || _buildConfirmBody(target, apCost, cashCost, check);
  var confirmText = options.confirmText || "✅ 出发";
  var cancelText = options.cancelText || "❌ 算了";

  if (typeof showModal === "function") {
    showModal({
      title: title,
      body: body,
      buttons: [
        {
          text: cancelText,
          cls: "btn-secondary",
          callback: function () {
            if (options.onCancel) options.onCancel();
            StateManager.addMessage("❌ 取消了行动", "hint");
          },
        },
        {
          text: confirmText,
          cls: "btn-primary",
          callback: function () {
            _doNavigate(state, target, options);
          },
        },
      ],
    });
  } else {
    // fallback: 无弹窗支持时直接导航
    _doNavigate(state, target, options);
  }
  return true;
}

// ================================================================
//  内部实现
// ================================================================

/**
 * 检查导航目标是否有效，返回可达性、消耗、描述信息
 */
function _navCheck(state, target) {
  var result = { valid: false, apCost: 0, cashCost: 0, title: "", message: "" };

  if (!target || !target.type) {
    result.message = "导航目标无效";
    return result;
  }

  switch (target.type) {
    case NAV_TYPES.TAB: {
      var tabName = target.name;
      // 检查 Tab 是否在 TAB_RENDERERS 中注册
      if (typeof TAB_RENDERERS !== "undefined" && !TAB_RENDERERS[tabName]) {
        result.message = "找不到 Tab：" + tabName;
        return result;
      }
      // v3.7 合并重构：5 个 Tab 全阶段常驻可见，不做阶段限制
      result.valid = true;
      result.title = "📋 切换到 " + (target.displayName || tabName);
      result.message = "";
      break;
    }
    case NAV_TYPES.LOCATION: {
      var locKey = target.key;
      if (typeof LOCATIONS === "undefined" || !LOCATIONS[locKey]) {
        result.message = "找不到地点：" + locKey;
        return result;
      }
      var curLoc = state.trade && state.trade.currentLocation;
      if (curLoc === locKey) {
        // 已在目标地点，无需旅行
        result.valid = true;
        result.apCost = 0;
        result.title = "📍 已在" + LOCATIONS[locKey].name;
        result.message = "";
        return result;
      }
      // 计算旅行消耗
      if (typeof getTravelApCost === "function") {
        result.apCost = getTravelApCost(curLoc, locKey, state);
      } else {
        result.apCost = 12; // 默认消耗
      }
      // 计算交通费用（取最低价）
      if (typeof getLocation === "function") {
        var hops =
          typeof getLocationHops === "function"
            ? getLocationHops(curLoc, locKey)
            : 1;
        if (hops <= 2) {
          result.cashCost = 3; // 共享单车
        } else {
          result.cashCost = 4; // 地铁
        }
      }
      result.valid = true;
      result.title = "🚶 前往 " + LOCATIONS[locKey].name;
      break;
    }
    case NAV_TYPES.WIKI: {
      var wCat = target.cat;
      var wEntry = target.entry;
      if (typeof WIKI_CATEGORIES !== "undefined") {
        var catFound = WIKI_CATEGORIES.some(function (c) {
          return c.id === wCat;
        });
        if (!catFound) {
          result.message = "找不到百科分类：" + wCat;
          return result;
        }
      }
      result.valid = true;
      result.title = "📖 百科：查看详情";
      result.apCost = 0;
      break;
    }
    case NAV_TYPES.SUB_TAB: {
      // 子Tab导航依赖于父Tab必须先可达
      if (target.tab) {
        var parentCheck = _navCheck(state, { type: "tab", name: target.tab });
        if (!parentCheck.valid) {
          result.message = "无法导航：" + parentCheck.message;
          return result;
        }
      }
      result.valid = true;
      result.title = "📋 打开 " + (target.displayName || target.subTab);
      break;
    }
    case NAV_TYPES.ACTION: {
      // 查找行动是否可用（不实际执行）
      if (typeof getAvailableActions === "function") {
        var allActions = getAvailableActions(state);
        var found = false;
        for (var i = 0; i < allActions.length; i++) {
          if (allActions[i].id === target.actionId && !allActions[i].disabled) {
            found = true;
            break;
          }
        }
        if (!found) {
          result.message =
            "行动不可用：" + (target.displayName || target.actionId);
          return result;
        }
      }
      result.valid = true;
      result.title = "⚡ 执行行动";
      break;
    }
    case NAV_TYPES.WIKI_LIST: {
      // 百科列表页（回到分类列表）
      result.valid = true;
      result.title = "📖 百科列表";
      break;
    }
    default:
      result.message = "未知导航类型：" + target.type;
  }

  return result;
}

/**
 * 构建确认弹窗内容
 */
function _buildConfirmBody(target, apCost, cashCost, check) {
  var parts = [];

  // 描述即将做什么
  switch (target.type) {
    case NAV_TYPES.TAB:
      parts.push(
        "📋 切换到 <strong>" +
          _navEsc(target.displayName || target.name) +
          "</strong> Tab",
      );
      break;
    case NAV_TYPES.LOCATION: {
      var locName =
        LOCATIONS && LOCATIONS[target.key]
          ? LOCATIONS[target.key].name
          : target.key;
      var curLoc = check.curLocName || "当前位置";
      parts.push(
        "🚶 从 <strong>" +
          _navEsc(curLoc) +
          "</strong> 前往 <strong>" +
          _navEsc(locName) +
          "</strong>",
      );
      // 显示地点简介
      if (LOCATIONS && LOCATIONS[target.key] && LOCATIONS[target.key].desc) {
        parts.push(
          '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">' +
            _navEsc(LOCATIONS[target.key].desc) +
            "</div>",
        );
      }
      // 显示该地点的服务标签
      if (typeof getLocationServiceBadges === "function") {
        var badges = getLocationServiceBadges(target.key);
        if (badges.length > 0) {
          var badgeHtml = badges
            .map(function (b) {
              return (
                '<span style="font-size:10px;padding:1px 5px;border-radius:3px;background:' +
                b.bg +
                ";color:" +
                b.color +
                ';">' +
                b.icon +
                _navEsc(b.label) +
                "</span>"
              );
            })
            .join(" ");
          parts.push(
            '<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:3px;">' +
              badgeHtml +
              "</div>",
          );
        }
      }
      break;
    }
    case NAV_TYPES.WIKI: {
      var entryLabel = target.entry;
      var catLabel = target.cat;
      var catObj = null;
      if (typeof WIKI_CATEGORIES !== "undefined") {
        for (var i = 0; i < WIKI_CATEGORIES.length; i++) {
          if (WIKI_CATEGORIES[i].id === catLabel) {
            catObj = WIKI_CATEGORIES[i];
            break;
          }
        }
      }
      parts.push(
        "📖 查看百科 — <strong>" +
          (catObj ? catObj.icon + " " + catObj.name : _navEsc(catLabel)) +
          (entryLabel ? " / " + _navEsc(entryLabel) : "（列表）") +
          "</strong>",
      );
      parts.push(
        '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">查阅资料不需要消耗资源</div>',
      );
      break;
    }
    case NAV_TYPES.SUB_TAB:
      parts.push(
        "📋 打开 <strong>" +
          _navEsc(target.displayName || target.subTab) +
          "</strong>" +
          (target.tab ? "（在 " + _navEsc(target.tab) + " Tab 内）" : ""),
      );
      break;
    case NAV_TYPES.ACTION:
      parts.push(
        "⚡ 执行行动：<strong>" +
          _navEsc(target.displayName || target.actionId) +
          "</strong>",
      );
      break;
  }

  // 资源消耗汇总
  if (apCost > 0 || cashCost > 0) {
    var costParts = [];
    if (apCost > 0) costParts.push("⚡ 行动力 -" + apCost);
    if (cashCost > 0) costParts.push("💰 ¥" + cashCost);
    parts.push(
      '<div style="margin-top:8px;padding:6px 10px;background:rgba(255,193,7,0.08);border:1px solid rgba(255,193,7,0.2);border-radius:6px;font-size:12px;color:var(--warning);">' +
        "消耗：<strong>" +
        costParts.join(" · ") +
        "</strong>" +
        "</div>",
    );
  }

  return '<div style="line-height:1.6;">' + parts.join("<br>") + "</div>";
}

/**
 * 实际执行导航
 */
function _doNavigate(state, target, options) {
  options = options || {};

  switch (target.type) {
    case NAV_TYPES.TAB: {
      var tabName = target.name;
      if (typeof switchTab === "function") {
        switchTab(tabName);
      } else {
        // fallback
        if (typeof currentTab !== "undefined") currentTab = tabName;
        if (typeof renderAll === "function") renderAll();
      }
      break;
    }

    case NAV_TYPES.LOCATION: {
      var locKey = target.key;
      var curLoc = state.trade && state.trade.currentLocation;
      if (curLoc === locKey) {
        // 已在该地点，切换到指定Tab或地图Tab
        var alreadyHereTab = target.navTab || "map";
        if (typeof switchTab === "function") switchTab(alreadyHereTab);
        StateManager.addMessage(
          "📍 已在" + (LOCATIONS[locKey] ? LOCATIONS[locKey].name : locKey),
          "info",
        );
        break;
      }

      // 扣减资源
      var apCost = options.apCost !== undefined ? options.apCost : 0;
      var cashCost = options.cashCost !== undefined ? options.cashCost : 0;
      if (apCost > 0 && state.player) {
        state.player.actionPoints = Math.max(
          0,
          (state.player.actionPoints || 0) - apCost,
        );
      }
      if (cashCost > 0 && state.resources) {
        state.resources.cash = Math.max(
          0,
          (state.resources.cash || 0) - cashCost,
        );
      }

      // 更新位置
      StateManager.update("trade.currentLocation", locKey);

      // 触发到达事件
      if (typeof triggerOnArrivalEvents === "function") {
        try {
          triggerOnArrivalEvents(locKey, state);
        } catch (e) {
          /* ignore */
        }
      }
      if (typeof rollNpcEncounterOnArrival === "function") {
        try {
          rollNpcEncounterOnArrival(locKey, state);
        } catch (e) {
          /* ignore */
        }
      }

      // 记录访问
      if (typeof recordLocationVisit === "function") {
        try {
          recordLocationVisit(state, locKey);
        } catch (e) {
          /* ignore */
        }
      }

      var locName =
        LOCATIONS && LOCATIONS[locKey] ? LOCATIONS[locKey].name : locKey;
      StateManager.addMessage("🚶 你来到了" + locName + "。", "info");

      // 到达后导航到指定Tab（默认行动Tab，可传target.navTab覆盖）
      var postNavTab = target.navTab || "actions";
      // 同时设置子Tab（用于培训中心等场景）：到达后切换到"我→技能"而非固定Tab
      if (target.subTab) {
        if (postNavTab === "me") {
          state._meSubTab = target.subTab;
        } else if (postNavTab === "career") {
          state._careerTabSubTab = target.subTab;
        } else if (postNavTab === "city") {
          state._citySubTab = target.subTab;
        }
      }
      if (typeof switchTab === "function") switchTab(postNavTab);
      else if (typeof renderAll === "function") renderAll();
      break;
    }

    case NAV_TYPES.WIKI: {
      if (typeof wikiNavigate === "function") {
        wikiNavigate(target.cat, target.entry || null);
      } else {
        if (typeof switchTab === "function") switchTab("wiki");
        else if (typeof renderAll === "function") renderAll();
      }
      break;
    }

    case NAV_TYPES.WIKI_LIST: {
      if (typeof _wikiBackToList === "function") {
        _wikiBackToList();
      } else {
        if (typeof switchTab === "function") switchTab("wiki");
        else if (typeof renderAll === "function") renderAll();
      }
      break;
    }

    case NAV_TYPES.SUB_TAB: {
      // 先切换到父Tab，再设置子Tab状态
      if (target.tab) {
        // 设置子Tab状态
        var subTabKey = "_" + target.tab.replace(/-/g, "_") + "SubTab";
        // v3.7 合并重构：旧 tab 名映射到新 tab
        var parentTab = target.tab;
        if (parentTab === "personal_growth") {
          parentTab = "me";
          state._meSubTab = target.subTab;
        } else if (parentTab === "career_dev") {
          parentTab = "career";
          state._careerTabSubTab = target.subTab;
        } else if (parentTab === "me") {
          state._meSubTab = target.subTab;
        } else if (parentTab === "career") {
          state._careerTabSubTab = target.subTab;
        } else {
          state[subTabKey] = target.subTab;
        }
        // 切换到父Tab
        if (typeof switchTab === "function") {
          switchTab(parentTab);
        } else {
          if (typeof currentTab !== "undefined") currentTab = parentTab;
          if (typeof renderAll === "function") renderAll();
        }
      }
      break;
    }

    case NAV_TYPES.ACTION: {
      // 查找并执行行动
      if (typeof getAvailableActions === "function") {
        var allActions = getAvailableActions(state);
        for (var i = 0; i < allActions.length; i++) {
          if (allActions[i].id === target.actionId && !allActions[i].disabled) {
            if (typeof allActions[i].handler === "function") {
              allActions[i].handler();
              if (typeof renderAll === "function") renderAll();
            }
            break;
          }
        }
      }
      break;
    }
  }

  // 完成回调
  if (options.onComplete) options.onComplete();
}

/**
 * 安全转义 HTML
 */
function _navEsc(s) {
  if (s === undefined || s === null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ================================================================
//  快捷导航函数（常用场景）
// ================================================================

/**
 * 一键导航到指定 Tab
 * @param {string} tabName - Tab 名称
 */
function navToTab(tabName) {
  var state =
    typeof StateManager !== "undefined" ? StateManager.getState() : null;
  if (!state) {
    if (typeof switchTab === "function") {
      switchTab(tabName);
    }
    return;
  }
  navigateTo(
    state,
    { type: "tab", name: tabName, displayName: _tabDisplayName(tabName) },
    { skipConfirm: true },
  );
}

/**
 * 一键前往某个地点（带消耗确认）
 * @param {string} locKey    - 地点 key
 * @param {Object} [opts]    - 可选参数
 */
function navToLocation(locKey, opts) {
  opts = opts || {};
  var state =
    typeof StateManager !== "undefined" ? StateManager.getState() : null;
  if (!state) {
    StateManager.addMessage("⚠️ 无法导航：游戏未加载", "warning");
    return;
  }
  var loc =
    typeof LOCATIONS !== "undefined" && LOCATIONS[locKey]
      ? LOCATIONS[locKey]
      : null;
  navigateTo(
    state,
    {
      type: "location",
      key: locKey,
      displayName: loc ? loc.name : locKey,
    },
    {
      skipConfirm: opts.skipConfirm || false,
      title: opts.title,
      onComplete: opts.onComplete,
      onCancel: opts.onCancel,
    },
  );
}

/**
 * 一键导航到百科
 * @param {string} catId   - 百科分类
 * @param {string} entryId - 条目 ID（可选）
 */
function navToWiki(catId, entryId) {
  var state =
    typeof StateManager !== "undefined" ? StateManager.getState() : null;
  navigateTo(
    state,
    {
      type: "wiki",
      cat: catId,
      entry: entryId || null,
    },
    { skipConfirm: true },
  );
}

/**
 * 一键导航到个人成长Tab的学历子面板
 */
function navToEducation() {
  var state =
    typeof StateManager !== "undefined" ? StateManager.getState() : null;
  navigateTo(
    state,
    {
      type: "subTab",
      tab: "me",
      subTab: "me_growth",
      displayName: "🎓 学历",
    },
    { skipConfirm: true },
  );
}

/**
 * 一键前往大学城（并切换到行动Tab）
 */
function navToUniversity() {
  var state =
    typeof StateManager !== "undefined" ? StateManager.getState() : null;
  if (!state) return;
  var curLoc = state.trade && state.trade.currentLocation;
  if (curLoc === "school") {
    // 已在大学城，直接切换到行动Tab让用户看到备考按钮
    navToTab("actions");
    StateManager.addMessage("📍 你已在大学城，可以开始备考了", "info");
    return;
  }
  // 需要前往大学城
  navToLocation("school", {
    skipConfirm: false,
    title: "🎓 去大学城备考",
    onComplete: function () {
      // 到达后自动切换到行动Tab
      setTimeout(function () {
        navToTab("actions");
      }, 100);
    },
  });
}

/**
 * Tab名中文显示
 */
function _tabDisplayName(tabName) {
  var names = {
    actions: "⚡ 行动",
    city: "🗺️ 城市",
    me: "👤 我",
    career: "💼 事业",
    wiki: "📖 百科",
  };
  return names[tabName] || tabName;
}

// ================================================================
//  导航链接生成器（用于在各种界面生成可点击的导航链接）
// ================================================================

/**
 * 生成导航链接 HTML（点击后弹出确认弹窗）
 *
 * @param {Object} target - 导航目标（同 navigateTo 的 target）
 * @param {string} label  - 链接显示文字
 * @param {Object} [opts] - 选项
 * @param {boolean} [opts.inline] - 内联显示（不加额外的容器样式）
 * @returns {string} HTML 字符串
 *
 * 用法：
 *   navLink({ type: 'location', key: 'school' }, '📚 去大学城')
 *   navLink({ type: 'tab', name: 'inventory' }, '🎒 查看背包')
 *   navLink({ type: 'wiki', cat: 'jobs', entry: 'programmer' }, '💻 查看程序员工作')
 *   navLink({ type: 'subTab', tab: 'personal_growth', subTab: 'pg_edu' }, '🎓 查看学历')
 */
function navLink(target, label, opts) {
  opts = opts || {};
  var extraAttrs = "";
  if (opts.inline) {
    extraAttrs =
      ' style="display:inline;padding:0;background:none;border:none;color:var(--accent);cursor:pointer;text-decoration:underline;font-size:inherit;"';
  }
  return (
    '<button class="nav-link-btn" data-nav-type="' +
    _navEsc(target.type) +
    "\" data-nav-target='" +
    _navEsc(JSON.stringify(target)) +
    "'" +
    extraAttrs +
    ">" +
    _navEsc(label) +
    "</button>"
  );
}

/**
 * 导航链接点击绑定（在 DOM 更新后调用）
 * 查找所有 .nav-link-btn 并绑定点击事件
 */
function bindNavLinks() {
  var btns = document.querySelectorAll(".nav-link-btn");
  for (var i = 0; i < btns.length; i++) {
    (function (btn) {
      // 避免重复绑定
      if (btn.dataset._navBound) return;
      btn.dataset._navBound = "1";
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var navType = btn.dataset.navType;
        var navTarget = null;
        try {
          navTarget = JSON.parse(btn.dataset.navTarget);
        } catch (err) {
          StateManager.addMessage("⚠️ 导航链接解析失败", "warning");
          return;
        }
        if (navTarget) {
          navTarget.type = navType; // 确保 type 一致
          var state =
            typeof StateManager !== "undefined"
              ? StateManager.getState()
              : null;
          navigateTo(state, navTarget);
        }
      });
    })(btns[i]);
  }
}

// ================================================================
//  Tab 按钮事件绑定 — 修复核心 Bug
// ================================================================

/**
 * 绑定 Tab 按钮点击事件
 * 在游戏启动后调用一次即可，之后 renderTabBar 只管理显示
 *
 * 修复：原代码中 tab-btn 没有 click 事件处理函数
 */
function initTabNavigation() {
  var tabBar = document.getElementById("tab-bar");
  if (!tabBar) return;

  // 使用事件委托（更可靠，也能处理动态添加的按钮）
  if (!tabBar.dataset._navInit) {
    tabBar.dataset._navInit = "1";
    tabBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".tab-btn");
      if (!btn) return;
      var tabName = btn.dataset.tab;
      if (!tabName) return;

      // 检查是否被禁用（v3.7 合并后所有 Tab 常驻可见）
      if (btn.style.display === "none") {
        StateManager.addMessage("⛔ 该 Tab 当前不可用", "warning");
        return;
      }

      // 检查阶段限制
      var state =
        typeof StateManager !== "undefined" ? StateManager.getState() : null;
      if (state) {
        if (
          tabName === "corp" &&
          state.player &&
          state.player.phase !== "corporate"
        ) {
          StateManager.addMessage("⛔ 职场 Tab 仅在公司阶段可用", "warning");
          return;
        }
        if (
          tabName === "trade" &&
          state.player &&
          state.player.phase !== "street"
        ) {
          StateManager.addMessage("⛔ 交易 Tab 仅在街头阶段可用", "warning");
          return;
        }
      }

      // 执行 Tab 切换
      if (typeof switchTab === "function") {
        switchTab(tabName);
      } else if (typeof currentTab !== "undefined") {
        currentTab = tabName;
        if (typeof renderAll === "function") renderAll();
      }
    });
  }
}

// ================================================================
//  从 wiki-link 跳转到游戏内位置
// ================================================================

/**
 * 在百科条目详情中添加"前往实地"按钮
 * 返回一个导航到游戏地点/Tab的按钮 HTML
 *
 * @param {string} destType  - 目标类型 ('location' | 'tab' | 'wiki')
 * @param {string} destKey   - 目标 key
 * @param {string} label     - 按钮文字
 * @param {Object} [opts]    - 选项
 * @returns {string} HTML
 */
function navActionButton(destType, destKey, label, opts) {
  opts = opts || {};
  var target = { type: destType, key: destKey, name: destKey };
  if (destType === "wiki") {
    target = {
      type: "wiki",
      cat: destKey,
      entry: opts.entry || null,
      displayName: label,
    };
  } else if (destType === "tab") {
    target = { type: "tab", name: destKey, displayName: label };
  } else if (destType === "subTab") {
    // destKey = subTab id, opts.tab = parent tab name
    target = {
      type: "subTab",
      subTab: destKey,
      tab: opts.tab || "me",
      displayName: label,
    };
  } else if (destType === "location") {
    target = { type: "location", key: destKey, displayName: label };
    if (opts.navTab) target.navTab = opts.navTab;
    if (opts.subTab) target.subTab = opts.subTab; // 到达后设置子Tab
  }
  return (
    '<button class="btn btn-sm nav-action-btn" style="margin:2px 4px;min-height:36px;" ' +
    'data-nav-type="' +
    _navEsc(destType) +
    '" ' +
    "data-nav-target='" +
    _navEsc(JSON.stringify(target)) +
    "' " +
    ">" +
    _navEsc(label) +
    "</button>"
  );
}

/**
 * 绑定所有导航按钮（nav-link-btn + nav-action-btn）
 * 每次 renderAll 后调用
 */
function bindAllNavButtons() {
  bindNavLinks();

  // 绑定 nav-action-btn
  var actionBtns = document.querySelectorAll(".nav-action-btn");
  for (var i = 0; i < actionBtns.length; i++) {
    (function (btn) {
      if (btn.dataset._navBound) return;
      btn.dataset._navBound = "1";
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var navTarget = null;
        try {
          navTarget = JSON.parse(btn.dataset.navTarget);
        } catch (err) {
          return;
        }
        if (navTarget) {
          var state =
            typeof StateManager !== "undefined"
              ? StateManager.getState()
              : null;
          navigateTo(state, navTarget);
        }
      });
    })(actionBtns[i]);
  }
}

// ================================================================
//  辅助：渲染导航按钮分类区（用于提示框/卡片底部）
// ================================================================

/**
 * 生成一个"快速跳转"区域 HTML
 * @param {Array} links - 导航链接配置 [{ target: {...}, label: '...' }, ...]
 * @returns {string} HTML
 */
function navQuickLinks(links) {
  if (!links || links.length === 0) return "";
  var html =
    '<div style="margin-top:8px;padding-top:6px;border-top:1px solid var(--border);">' +
    '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">🔗 快速跳转</div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:4px;">';
  for (var i = 0; i < links.length; i++) {
    var l = links[i];
    html += navLink(l.target, l.label, { inline: true });
  }
  html += "</div></div>";
  return html;
}

// ================================================================
//  自动初始化
// ================================================================

// 页面加载完成后自动绑定 Tab 按钮
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initTabNavigation();
    });
  } else {
    // 已经加载完成
    initTabNavigation();
  }
}

// 也暴露一个延迟初始化（供 main.js 在游戏启动后调用）
window._navEnsureInit = function () {
  initTabNavigation();
};
