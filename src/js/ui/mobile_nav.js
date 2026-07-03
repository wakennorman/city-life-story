/**
 * mobile_nav.js — 移动端底部导航栏 v1.0
 *
 * 设计原则（参考 BitLife / 大多数 / Stardew Valley Mobile / iOS HIG）：
 *  • 5个底部导航大组，拇指热区，单手可操作
 *  • 组内多个Tab用顶部pill子Tab展示（节省垂直空间）
 *  • 桌面端完全不受影响（display:none 纯CSS控制）
 *  • 与现有 switchTab() / renderAll() 零侵入式集成
 *
 * 分组逻辑（对标大多数/BitLife结构）：
 *  ⚡ 行动  → actions（高频核心，直达）
 *  🗺️ 探索  → map / trade（世界交互）
 *  💼 职业  → skills / corp / career_dev（成长路径）
 *  💰 财富  → inventory / investment（资产管理）
 *  👤 我的  → social / achievements / wiki（社交/信息）
 */

// ===== 底部导航分组配置表 =====
var BOTTOM_NAV_GROUPS = {
  actions: {
    icon: "⚡",
    label: "行动",
    tabs: ["actions"],
    tabLabels: {},
  },
  explore: {
    icon: "🗺️",
    label: "探索",
    tabs: ["map", "trade"],
    tabLabels: { map: "🗺️ 地图", trade: "📦 交易" },
  },
  career: {
    icon: "💼",
    label: "职业",
    tabs: ["skills", "corp", "career_dev"],
    tabLabels: { skills: "📚 技能", corp: "🏢 职场", career_dev: "🚀 事业" },
  },
  wealth: {
    icon: "💰",
    label: "财富",
    tabs: ["inventory", "investment"],
    tabLabels: { inventory: "🎒 物品", investment: "💹 投资" },
  },
  profile: {
    icon: "👤",
    label: "我的",
    tabs: ["social", "achievements", "wiki"],
    tabLabels: { social: "👥 社交", achievements: "🏅 成就", wiki: "📖 百科" },
  },
};

// Tab → Group 反向查找表
var _TAB_TO_GROUP = {};
Object.keys(BOTTOM_NAV_GROUPS).forEach(function (group) {
  BOTTOM_NAV_GROUPS[group].tabs.forEach(function (tab) {
    _TAB_TO_GROUP[tab] = group;
  });
});

// 当前活跃的底部导航组
var _currentBnGroup = "actions";

// ===== 工具函数 =====

/** 是否在移动视口（与CSS媒体查询断点保持一致） */
function _isMobileViewport() {
  return window.innerWidth <= 768;
}

/** 判断某个Tab在当前游戏状态下是否可见（与render.js的Tab可见性逻辑同步） */
function _isTabVisibleMobile(tabName) {
  // 兜底：state未加载时默认全部可见
  if (typeof state === "undefined" || !state || !state.player) return true;
  var phase = state.player.phase;

  switch (tabName) {
    case "trade":
      return phase === "street";
    case "corp":
      return phase === "corporate";
    case "career_dev":
      if (phase === "street") return true;
      if (
        phase === "corporate" &&
        typeof state.startup !== "undefined" &&
        state.startup &&
        state.startup.status !== "none"
      )
        return true;
      return false;
    default:
      return true;
  }
}

// ===== 核心功能 =====

/**
 * 切换底部导航大组
 * @param {string} groupName - 分组键名 (actions/explore/career/wealth/profile)
 */
function switchBottomNavGroup(groupName) {
  var cfg = BOTTOM_NAV_GROUPS[groupName];
  if (!cfg) return;

  _currentBnGroup = groupName;

  // 更新底部导航按钮激活状态
  var btns = document.querySelectorAll(".bottom-nav-btn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.toggle("active", btns[i].dataset.group === groupName);
  }

  // 计算该组内可见的Tab
  var visibleTabs = cfg.tabs.filter(_isTabVisibleMobile);

  // 单Tab组：直接跳转，不显示子Tab栏
  if (visibleTabs.length <= 1) {
    _hideMobileSubTabs();
    var targetTab = visibleTabs.length === 1 ? visibleTabs[0] : cfg.tabs[0];
    if (typeof switchTab === "function") switchTab(targetTab);
    return;
  }

  // 多Tab组：决定跳哪个Tab
  var activeCurrent = typeof currentTab !== "undefined" ? currentTab : "";
  var targetTab =
    visibleTabs.indexOf(activeCurrent) >= 0 ? activeCurrent : visibleTabs[0];

  // 显示子Tab pill栏
  _renderMobileSubTabs(groupName, visibleTabs, targetTab);

  // 如果当前Tab不在此组，切换到组内首个可见Tab
  if (activeCurrent !== targetTab) {
    if (typeof switchTab === "function") switchTab(targetTab);
  }
}

/**
 * 渲染子Tab pill栏
 */
function _renderMobileSubTabs(groupName, visibleTabs, activeTab) {
  var container = document.getElementById("mobile-sub-tabs");
  if (!container) return;

  var cfg = BOTTOM_NAV_GROUPS[groupName];
  var labels = cfg ? cfg.tabLabels : {};

  var html = "";
  for (var i = 0; i < visibleTabs.length; i++) {
    var tab = visibleTabs[i];
    var isActive = tab === activeTab;
    html +=
      '<button class="mobile-sub-tab' +
      (isActive ? " active" : "") +
      '" data-tab="' +
      tab +
      '" onclick="switchTabFromMobileSubTab(\'' +
      tab +
      "')\">" +
      (labels[tab] || tab) +
      "</button>";
  }

  container.innerHTML = html;
  container.style.display = "flex";
}

/**
 * 隐藏子Tab pill栏
 */
function _hideMobileSubTabs() {
  var container = document.getElementById("mobile-sub-tabs");
  if (container) {
    container.style.display = "none";
    container.innerHTML = "";
  }
}

/**
 * 从子Tab pill点击切换Tab
 * 更新pill高亮 + 调用主switchTab
 */
function switchTabFromMobileSubTab(tabName) {
  // 更新pill激活状态
  var pills = document.querySelectorAll(".mobile-sub-tab");
  for (var i = 0; i < pills.length; i++) {
    pills[i].classList.toggle("active", pills[i].dataset.tab === tabName);
  }
  if (typeof switchTab === "function") switchTab(tabName);
}

/**
 * 根据当前Tab反向同步底部导航高亮状态
 * 每次renderAll()后调用，保持底部导航与实际状态一致
 */
function syncBottomNavState() {
  if (!_isMobileViewport()) return;

  // === 根据游戏状态显示/隐藏底部导航 ===
  // #bottom-nav 在 #app 之外，初始 style="display:none"
  // 游戏激活（#app 可见）时才显示，欢迎/选模式界面隐藏
  var bottomNav = document.getElementById("bottom-nav");
  var appEl = document.getElementById("app");
  if (bottomNav && appEl) {
    var gameActive =
      appEl.style.display !== "none" && appEl.style.display !== "";
    // appEl.style.display === "" 表示 CSS 控制（即 display:none 被清除，游戏已启动）
    // 准确判断：app 不是 display:none 就是游戏状态
    var isAppVisible = appEl.style.display !== "none";
    if (isAppVisible && typeof gameStarted !== "undefined" && gameStarted) {
      bottomNav.style.display = "flex";
    } else if (!isAppVisible) {
      bottomNav.style.display = "none";
    }
  }

  var tabName = typeof currentTab !== "undefined" ? currentTab : "actions";
  var group = _TAB_TO_GROUP[tabName] || "actions";

  // 同步大组按钮高亮
  if (group !== _currentBnGroup) {
    _currentBnGroup = group;
    var btns = document.querySelectorAll(".bottom-nav-btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle("active", btns[i].dataset.group === group);
    }
  }

  // 同步子Tab pill高亮
  var pills = document.querySelectorAll(".mobile-sub-tab");
  for (var i = 0; i < pills.length; i++) {
    pills[i].classList.toggle("active", pills[i].dataset.tab === tabName);
  }

  // 确保多Tab组的子Tab栏已显示
  var cfg = BOTTOM_NAV_GROUPS[group];
  if (cfg && cfg.tabs.length > 1) {
    var visibleTabs = cfg.tabs.filter(_isTabVisibleMobile);
    if (visibleTabs.length > 1) {
      var container = document.getElementById("mobile-sub-tabs");
      if (container && container.style.display === "none") {
        _renderMobileSubTabs(group, visibleTabs, tabName);
      }
    }
  }
}

// ===== 隐藏底部导航（欢迎/选模式界面调用）=====
/**
 * 立即隐藏底部导航栏，供 showWelcome / showModeSelect 调用
 * 解决「从游戏返回主菜单后 bottom-nav 残留可见，遮挡模式卡片点击」的 bug
 */
function _hideMobileNav() {
  var bottomNav = document.getElementById("bottom-nav");
  if (bottomNav) bottomNav.style.display = "none";
  _hideMobileSubTabs();
}

// ===== Hook renderAll / showWelcome / showModeSelect — 零侵入式集成 =====
window.addEventListener("load", function () {
  // 1. 挂钩 renderAll（游戏内状态同步）
  if (typeof renderAll === "function") {
    var _origRenderAll = renderAll;
    renderAll = function () {
      _origRenderAll.apply(this, arguments);
      syncBottomNavState();
    };
  }

  // 2. 挂钩 showWelcome — 返回欢迎界面时立即隐藏底部导航
  if (typeof showWelcome === "function") {
    var _origShowWelcome = showWelcome;
    showWelcome = function () {
      _origShowWelcome.apply(this, arguments);
      _hideMobileNav();
    };
  }

  // 3. 挂钩 showModeSelect — 进入模式选择界面时立即隐藏底部导航
  if (typeof showModeSelect === "function") {
    var _origShowModeSelect = showModeSelect;
    showModeSelect = function () {
      _origShowModeSelect.apply(this, arguments);
      _hideMobileNav();
    };
  }
});

// ===== 初始化 =====
document.addEventListener("DOMContentLoaded", function () {
  if (!_isMobileViewport()) return;

  // 初始隐藏子Tab栏
  var subTabs = document.getElementById("mobile-sub-tabs");
  if (subTabs) subTabs.style.display = "none";

  // 初始高亮"行动"组
  var firstBtn = document.querySelector(
    '.bottom-nav-btn[data-group="actions"]',
  );
  if (firstBtn) firstBtn.classList.add("active");
});

// ===== 视口变化适配 =====
window.addEventListener("resize", function () {
  if (!_isMobileViewport()) {
    // 桌面端：清理移动端状态
    _hideMobileSubTabs();
  } else {
    // 重新进入移动端：恢复底部导航状态
    syncBottomNavState();
  }
});
