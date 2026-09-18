/**
 * 3D 场景层 · 运行时桥接（旧管线侧）
 *
 * 职责：把 src/app/3d 的 3D 能力接到现有游戏上，不改动任何既有逻辑。
 *
 * 设计要点：
 *   1. **零重复逻辑** —— 3D 场景的几何与热点位置来自 gamedata（数据桥从游戏本体抽取），
 *      但点击执行**必须**走 getAvailableActions(state) 返回的真实行动对象，
 *      调它的 handler()。可用性、AP、条件、扣费全部复用原实现，3D 层不判任何条件。
 *   2. **完全可摘除** —— 全部行为挂在 window.Scene3DBridge 上，删掉本文件与
 *      两个 script 标签即回到纯 2D，不动一行既有代码。
 *   3. **惰性** —— 首次进入游戏才建 WebGL 上下文；离开地点视图即销毁。
 *
 * 热点 id → 游戏行动 id 的映射（2026-09-18 逐一核对源码得出）：
 *   work    gamedata jobs[].id        → "job_"     + id      (main.js:2544)
 *   service gamedata amenities[].id   → "amenity_" + id      (actions_extra.js:1803)
 *   extra   gamedata actionsExtra[].id→ id 原样              (actions.js:291)
 *   risk    gamedata illegal[].id     → id 原样              (illegal_actions.js:275)
 *   trade   "<loc>_trade"             → "item_shop_" + loc   (main.js:2842)
 *   look    "<loc>_look"              → 无对应行动（纯环境，只展示）
 *
 * 依赖（均为旧运行时已有的全局）：
 *   window.Scene3D          ← src/js/scene3d.bundle.js（含内联 gamedata）
 *   window.getAvailableActions / StateManager ← js/main.js
 */

(function () {
  "use strict";

  var MINI_ID = "scene3d-mini";
  var OVERLAY_ID = "scene3d-overlay";

  var mini = null;          // 侧栏微缩景句柄
  var miniHost = null;
  var overlay3d = null;     // 全屏全景句柄
  var overlayEl = null;
  var lastLocId = null;
  var overlayOpen = false;

  function core() {
    return window.Scene3D || null;
  }

  function available() {
    var c = core();
    return !!(c && typeof c.createGame3D === "function" && c.gamedata && c.gamedata.locations);
  }

  /* ─────────── 游戏数据接入 ─────────── */

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

  function locName(id) {
    var c = core();
    var loc = c && c.gamedata && c.gamedata.locations[id];
    return loc ? (loc.icon ? loc.icon + " " + loc.name : loc.name) : id;
  }

  function rawActions() {
    var st = getState();
    if (!st || typeof window.getAvailableActions !== "function") return null;
    try {
      return window.getAvailableActions(st);
    } catch (e) {
      return null;
    }
  }

  /** 按 id 找行动对象（不判可用性，供状态展示） */
  function findAction(actionId) {
    var raw = rawActions();
    if (!raw) return null;
    for (var i = 0; i < raw.length; i++) {
      if (raw[i] && raw[i].id === actionId) return raw[i];
    }
    return null;
  }

  /**
   * 触发行动 —— 走原 action.handler()，与点击行动卡片完全同一条路径。
   * @returns {{ok:boolean, reason?:string}}
   */
  function invokeAction(actionId) {
    var a = findAction(actionId);
    if (!a) return { ok: false, reason: "当前阶段/地点下没有这个行动" };
    if (typeof a.handler !== "function") return { ok: false, reason: "该行动没有可执行处理器" };
    if (a.disabled) {
      return { ok: false, reason: typeof a.reqFail === "string" && a.reqFail ? a.reqFail : "条件不满足" };
    }
    try {
      a.handler();
      return { ok: true };
    } catch (e) {
      return { ok: false, reason: "执行出错：" + (e && e.message ? e.message : e) };
    }
  }

  /**
   * 热点 → 游戏行动 id。
   * 返回 null 表示该热点在游戏里没有对应的可执行行动（如 look 类环境点）。
   */
  function toGameActionId(h) {
    if (!h || !h.id) return null;
    switch (h.kind) {
      case "work":    return "job_" + h.id;
      case "service": return "amenity_" + h.id;
      case "extra":   return h.id;
      case "risk":    return h.id;
      case "action":  return h.id;
      case "trade":   return h.id.slice(0, -"_trade".length) === currentLocId()
        ? "item_shop_" + currentLocId()
        : null;
      default:        return null; // look / 未知
    }
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
    miniHost.title = "点击进入 3D 全景（可走动探索）";
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
    if (!core().gamedata.locations[locId]) return;

    try {
      if (!mini) {
        mini = core().createGame3D({
          container: host,
          data: core().gamedata,
          mode: "mini", // 不接管键盘：否则在游戏里打字会驱动缩略景里的小人
        });
        mini.start();
      }
      mini.loadLocation(locId);
      host.style.display = "";
    } catch (e) {
      // 3D 失败不影响 2D 主流程
      host.style.display = "none";
    }
  }

  /* ─────────── 全屏全景（可走动 + 热点交互） ─────────── */

  function buildOverlay() {
    overlayEl = document.createElement("div");
    overlayEl.id = OVERLAY_ID;
    overlayEl.className = "scene3d-overlay";
    overlayEl.innerHTML =
      '<div class="scene3d-overlay__panel">' +
      '<div class="scene3d-overlay__bar">' +
      '<span class="scene3d-overlay__title"></span>' +
      '<span class="scene3d-overlay__hint">WASD 走动 · Shift 跑 · 靠近亮点按 E 交互 · 滚轮缩放</span>' +
      '<button type="button" class="scene3d-overlay__close" aria-label="关闭">✕</button>' +
      "</div>" +
      '<div class="scene3d-overlay__stage">' +
      '<div class="scene3d-overlay__prompt" hidden></div>' +
      '<div class="scene3d-overlay__toast" hidden></div>' +
      "</div>" +
      "</div>";
    document.body.appendChild(overlayEl);

    overlayEl.querySelector(".scene3d-overlay__close").addEventListener("click", closeOverlay);
    overlayEl.addEventListener("click", function (e) {
      if (e.target === overlayEl) closeOverlay();
    });
    document.addEventListener("keydown", onEsc);
    return overlayEl;
  }

  function onEsc(e) {
    if (e.key === "Escape" && overlayOpen) closeOverlay();
  }

  function setPrompt(h) {
    if (!overlayEl) return;
    var el = overlayEl.querySelector(".scene3d-overlay__prompt");
    if (!el) return;
    if (!h) { el.hidden = true; return; }
    var actionId = toGameActionId(h);
    var a = actionId ? findAction(actionId) : null;
    var suffix = "";
    if (actionId && a && a.disabled) {
      suffix = ' <span class="scene3d-overlay__deny">· ' +
        (typeof a.reqFail === "string" && a.reqFail ? a.reqFail : "条件不满足") + "</span>";
    } else if (actionId && !a) {
      suffix = ' <span class="scene3d-overlay__deny">· 当前不可执行</span>';
    } else if (!actionId) {
      suffix = ' <span class="scene3d-overlay__deny">· 无对应行动</span>';
    }
    el.innerHTML = "<kbd>E</kbd> " + (h.icon || "") + " " + (h.label || "") + suffix;
    el.hidden = false;
  }

  var toastTimer = 0;
  function toast(msg) {
    if (!overlayEl) return;
    var el = overlayEl.querySelector(".scene3d-overlay__toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2600);
  }

  function openOverlay() {
    if (!available()) return;
    var locId = currentLocId();
    if (!locId || !core().gamedata.locations[locId]) return;

    var el = overlayEl || buildOverlay();
    el.querySelector(".scene3d-overlay__title").textContent = locName(locId);
    var stage = el.querySelector(".scene3d-overlay__stage");

    try {
      if (!overlay3d) {
        overlay3d = core().createGame3D({
          container: stage,
          data: core().gamedata,
          mode: "full",
          onInteract: function (h) {
            var actionId = toGameActionId(h);
            if (!actionId) { toast("这里只是看看，没有可执行的事"); return; }
            var r = invokeAction(actionId);
            if (r.ok) {
              closeOverlay(); // handler 内部已触发重渲染
            } else {
              toast("⚠️ " + (h.label || "该行动") + "：" + r.reason);
            }
          },
          onFocus: setPrompt,
          onError: function (e) { toast("3D 不可用：" + e.message); },
        });
        overlay3d.start();
      }
      overlay3d.loadLocation(locId);
    } catch (e) {
      toast("3D 初始化失败：" + (e && e.message ? e.message : e));
      return;
    }

    el.classList.add("is-open");
    overlayOpen = true;
    setPrompt(null);
    setTimeout(function () { if (overlay3d) overlay3d.resize(); }, 60);
  }

  function closeOverlay() {
    if (overlayEl) overlayEl.classList.remove("is-open");
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
    if (mini) { mini.dispose(); mini = null; }
    if (overlay3d) { overlay3d.dispose(); overlay3d = null; }
    if (overlayEl) { overlayEl.remove(); overlayEl = null; }
    document.removeEventListener("keydown", onEsc);
    lastLocId = null;
    overlayOpen = false;
  }

  window.Scene3DBridge = {
    version: "0.2.0",
    available: available,
    sync: sync,
    open: openOverlay,
    close: closeOverlay,
    dispose: disposeAll,
    /* 调试用 —— 3D 层与游戏逻辑的接缝最容易出问题，都留个窥视口 */
    toGameActionId: toGameActionId,
    invokeAction: invokeAction,
    debugMiniStats: function () { return mini ? mini.stats : null; },
    debugOverlayStats: function () { return overlay3d ? overlay3d.stats : null; },
    debugMiniLoc: function () { return mini ? mini.locationId : null; },
    debugOverlayLoc: function () { return overlay3d ? overlay3d.locationId : null; },
    debugOverlayPos: function () { return overlay3d ? overlay3d.playerPos : null; },
    debugFocused: function () {
      if (!overlay3d || !overlay3d.hotspot) return null;
      return { kind: overlay3d.hotspot.kind, id: overlay3d.hotspot.id, label: overlay3d.hotspot.label };
    },
    /** 把全景角色瞬移到某热点旁（测试用：绕开"走过去"的不确定性，专测交互链路） */
    debugTeleportToHotspot: function (kind, id) {
      if (!overlay3d) return null;
      var hit = null;
      for (var i = 0; i < overlay3d.hotspots.length; i++) {
        var h = overlay3d.hotspots[i];
        if (h.kind === kind && (id == null || h.id === id)) { hit = h; break; }
      }
      if (!hit) return null;
      overlay3d.teleport(hit.x, hit.z + 2.4);
      return { kind: hit.kind, id: hit.id, label: hit.label, actionId: toGameActionId(hit) };
    },
    debugHotspots: function () { return overlay3d ? overlay3d.hotspots.map(function (h) { return h.kind + ":" + h.id; }) : []; },
  };
})();
