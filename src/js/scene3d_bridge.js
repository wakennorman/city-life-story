/**
 * scene3d 运行时桥接（旧管线侧）
 *
 * 职责：把 src/app/scene3d 的 3D 能力接到现有游戏上，不改动任何既有逻辑。
 *
 * 设计要点：
 *   1. **零重复逻辑** —— 热点不自己判条件，直接用 getAvailableActions(state)
 *      返回的行动对象，点击调它的 handler()。可用性、AP、条件判断全部复用原实现。
 *   2. **完全可摘除** —— 全部行为挂在 window.Scene3DBridge 上，删掉本文件与
 *      两个 script 标签即回到纯 2D，不动一行既有代码。
 *   3. **惰性** —— 首次进入游戏才建 WebGL 上下文；离开地点视图即销毁。
 *
 * 依赖（均为旧运行时已有的全局）：
 *   window.Scene3D          ← src/js/scene3d.bundle.js
 *   window.LOCATIONS        ← js/data/locations.js
 *   window.getAvailableActions / getJobById ← js/main.js / js/data/jobs.js
 *   window.StateManager     ← 状态管理
 */

(function () {
  "use strict";

  var MINI_ID = "scene3d-mini";
  var OVERLAY_ID = "scene3d-overlay";

  var mini = null; // 侧栏微缩景句柄
  var miniHost = null;
  var overlayHandle = null;
  var lastLocId = null;
  var overlayOpen = false;

  function core() {
    return window.Scene3D || null;
  }

  function available() {
    return !!(core() && core().createScene3D);
  }

  /* ─────────── 数据接入 ─────────── */

  function getState() {
    if (
      typeof window.StateManager !== "undefined" &&
      typeof window.StateManager.getState === "function"
    ) {
      try {
        return window.StateManager.getState();
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  function currentLocId() {
    var st = getState();
    return st && st.trade ? st.trade.currentLocation : null;
  }

  function getLoc(id) {
    if (!id) return null;
    // 优先命名空间；locations.js 顶层是 const，不会挂到 window 上
    var bag =
      (window.CLS && window.CLS.data && window.CLS.data.LOCATIONS) ||
      (typeof LOCATIONS !== "undefined" ? LOCATIONS : null) ||
      window.LOCATIONS ||
      null;
    if (!bag) return null;
    return (bag[id] || (window.LOCATIONS && window.LOCATIONS[id])) || null;
  }

  /**
   * 取当前地点可执行的行动。
   * 直接复用主游戏的 getAvailableActions —— 不复制任何条件判断。
   * 返回 { enabled: [...], disabledIds: [...] }
   */
  function currentActions() {
    var st = getState();
    if (!st || typeof window.getAvailableActions !== "function") {
      return { list: [], disabled: [] };
    }
    var raw;
    try {
      raw = window.getAvailableActions(st);
    } catch (e) {
      return { list: [], disabled: [] };
    }
    var list = [];
    var disabled = [];
    for (var i = 0; i < raw.length; i++) {
      var a = raw[i];
      if (!a || !a.id) continue;
      // 「地点不符」的行动原 UI 也会剔除，这里保持一致
      if (
        a.disabled &&
        typeof a.reqFail === "string" &&
        a.reqFail.indexOf("地点不符") === 0
      ) {
        continue;
      }
      // 存储/住房等常驻面板行动不放进 3D 热点，避免喧宾夺主
      if (
        a.id.indexOf("housing_") === 0 ||
        a.id.indexOf("storage_") === 0 ||
        a.id.indexOf("travel_") === 0
      ) {
        continue;
      }
      list.push({ id: a.id, name: a.name, apCost: a.apCost || 0 });
      if (a.disabled) disabled.push(a.id);
    }
    return { list: list, disabled: disabled };
  }

  /** 触发行动 —— 走原 action.handler()，与点击按钮完全同一条路径 */
  function invokeAction(actionId) {
    var st = getState();
    if (!st || typeof window.getAvailableActions !== "function") return false;
    var raw;
    try {
      raw = window.getAvailableActions(st);
    } catch (e) {
      return false;
    }
    for (var i = 0; i < raw.length; i++) {
      var a = raw[i];
      if (a && a.id === actionId && typeof a.handler === "function") {
        if (a.disabled) return false;
        a.handler();
        return true;
      }
    }
    return false;
  }

  /* ─────────── 侧栏微缩景 ─────────── */

  function ensureMiniHost() {
    if (miniHost && document.body.contains(miniHost)) return miniHost;
    var anchor = document.getElementById("location-desc");
    if (!anchor || !anchor.parentNode) return null;

    miniHost = document.createElement("div");
    miniHost.id = MINI_ID;
    miniHost.className = "scene3d-mini";
    miniHost.setAttribute("role", "button");
    miniHost.setAttribute("tabindex", "0");
    miniHost.title = "点击查看 3D 全景与可执行行动";
    anchor.parentNode.insertBefore(miniHost, anchor.nextSibling);

    miniHost.addEventListener("click", openOverlay);
    miniHost.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openOverlay();
      }
    });
    return miniHost;
  }

  function mountMini(locId) {
    if (!available()) return;
    var host = ensureMiniHost();
    if (!host) return;
    var loc = getLoc(locId);
    if (!loc) return;

    try {
      if (!mini) {
        mini = core().createScene3D({
          container: host,
          hotspots: false, // 250px 宽度放不下热点
        });
      }
      mini.show(loc);
    } catch (e) {
      // 3D 失败不影响 2D 主流程
      host.style.display = "none";
    }
  }

  /* ─────────── 全屏全景（带热点） ─────────── */

  function buildOverlay() {
    var el = document.createElement("div");
    el.id = OVERLAY_ID;
    el.className = "scene3d-overlay";
    el.innerHTML =
      '<div class="scene3d-overlay__panel">' +
      '<div class="scene3d-overlay__bar">' +
      '<span class="scene3d-overlay__title"></span>' +
      '<span class="scene3d-overlay__hint">拖拽旋转 · 滚轮缩放 · 双击复位</span>' +
      '<button type="button" class="scene3d-overlay__close" aria-label="关闭">✕</button>' +
      "</div>" +
      '<div class="scene3d-overlay__stage"></div>' +
      "</div>";
    document.body.appendChild(el);

    el.querySelector(".scene3d-overlay__close").addEventListener("click", closeOverlay);
    el.addEventListener("click", function (e) {
      if (e.target === el) closeOverlay();
    });
    document.addEventListener("keydown", onEsc);
    return el;
  }

  function onEsc(e) {
    if (e.key === "Escape" && overlayOpen) closeOverlay();
  }

  function openOverlay() {
    if (!available()) return;
    var locId = currentLocId();
    var loc = getLoc(locId);
    if (!loc) return;

    var el = document.getElementById(OVERLAY_ID) || buildOverlay();
    el.querySelector(".scene3d-overlay__title").textContent =
      loc.icon ? loc.icon + " " + loc.name : loc.name;

    var stage = el.querySelector(".scene3d-overlay__stage");
    var acts = currentActions();

    if (!overlayHandle) {
      overlayHandle = core().createScene3D({
        container: stage,
        hotspots: true,
        onAction: function (actionId) {
          var ok = invokeAction(actionId);
          if (ok) closeOverlay();
          // handler 内部会触发重渲染；失败则不关闭，让玩家看到状态未变
        },
      });
    }
    overlayHandle.show(loc, acts.list);
    if (acts.disabled.length) overlayHandle.setDisabledActions(acts.disabled);

    el.classList.add("is-open");
    overlayOpen = true;
    setTimeout(function () {
      if (overlayHandle) overlayHandle.resize();
    }, 60);
  }

  function closeOverlay() {
    var el = document.getElementById(OVERLAY_ID);
    if (el) el.classList.remove("is-open");
    overlayOpen = false;
  }

  /* ─────────── 生命周期 ─────────── */

  /** 由 renderLocation 调用；同一地点重复调用不会重建场景 */
  function sync() {
    if (!available()) return;
    var locId = currentLocId();
    if (!locId) return;
    if (locId === lastLocId && mini) return;
    lastLocId = locId;
    mountMini(locId);
  }

  function disposeAll() {
    if (mini) {
      mini.dispose();
      mini = null;
    }
    if (overlayHandle) {
      overlayHandle.dispose();
      overlayHandle = null;
    }
    var el = document.getElementById(OVERLAY_ID);
    if (el) el.remove();
    document.removeEventListener("keydown", onEsc);
    lastLocId = null;
    overlayOpen = false;
  }

  window.Scene3DBridge = {
    version: "0.1.0",
    available: available,
    sync: sync,
    open: openOverlay,
    close: closeOverlay,
    dispose: disposeAll,
    /** 供调试：取当前场景描述 */
    debugSpec: function () {
      return overlayHandle ? overlayHandle.spec : mini ? mini.spec : null;
    },
    /** 供调试：专取侧栏微缩景的场景（区别于全景） */
    debugMiniSpec: function () {
      return mini ? mini.spec : null;
    },
  };
})();
