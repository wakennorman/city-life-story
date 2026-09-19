/**
 * 3D 场景层 · 运行时桥接（旧管线侧）
 *
 * 职责：把 src/app/3d 的 3D 能力接到现有游戏上，不改动任何既有逻辑。
 *
 * ── 两个形态 ──────────────────────────────────────────────────────────────
 *  A. **2D-first（mini + overlay）** —— 2D 界面是主体，侧栏挂一块缩略景，
 *     点开一个可走动的全屏浮层。见 `mountMini` / `openOverlay`。
 *  B. **3D-first（first）** —— 3D 铺满视口、状态与行动浮在其上，原 2D 界面
 *     整体让位。见 `mountFirst` 一节。由 `?mode=3d` / `#3d` 启动，F3 切换。
 *  两者共用同一份数据接入（getState / getAvailableActions / handler），
 *  不存在"第二套玩法逻辑"。
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
  /* 3D 挂载期间被"让位"的界面：{el, prev, kind} 数组（见 mountFirst）。
     kind: "hidden" → 整块 display:none + inert（欢迎屏）
           "class"  → 加 .s3-yield 类，保持可显示（#app，为了让弹层能浮出）
     记原值是为了卸载时逐个还原 —— 不能统一置 "". */
  var yieldEls = [];
  var appElDisplayPrev = "";

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
  /**
   * 浮层形态下的反馈。
   * ★ 与 3D-first 形态一致：优先走**场景内提醒**（角色头顶的 sprite），
   *   而不是页面上弹一条 HTML。3D 起不来时才退回 DOM —— 那时场景内提醒没有载体。
   * @param {string} msg
   * @param {object} [opt] { kind, forceDom }
   */
  function toast(msg, opt) {
    var o = opt || {};
    if (!o.forceDom && overlay3d && typeof overlay3d.notify === "function") {
      overlay3d.notify(msg, { kind: o.kind });
      return;
    }
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
              toast("⚠️ " + (h.label || "该行动") + "：" + r.reason, { kind: "warn" });
            }
          },
          onFocus: setPrompt,
          /* ★ 这两条描述的是"3D 本身出了问题"，场景内提醒没有载体 → 必须走 DOM。 */
          onError: function (e) { toast("3D 不可用：" + e.message, { forceDom: true }); },
        });
        overlay3d.start();
      }
      overlay3d.loadLocation(locId);
    } catch (e) {
      toast("3D 初始化失败：" + (e && e.message ? e.message : e), { forceDom: true });
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

  /* ═══════════════ 3D-first 形态：3D 铺满视口，HUD 浮层，接真实游戏 ═══════════════
   *
   * ── 与上面 mini / overlay 的关系 ──
   * 上面那两个是「2D 是主体、3D 是附属」：侧栏一块缩略景 + 点开一个浮层。
   * 这一节把关系倒过来：**3D 是主体**，原 2D 界面整体让位（display:none），
   * 状态与行动浮在 3D 之上。逻辑层**一行不改**，全部读写都走既有全局：
   *
   *   读 state   → StateManager.getState()          （只读）
   *   读行动     → getAvailableActions(state)       （与 2D 行动卡片同一份）
   *   执行       → action.handler()                 （与点击卡片同一条路径）
   *   换地点     → invokeAction("travel_" + key)    （同城移动本就是一条行动）
   *   消息回显   → state.messageLog 增量            （只读）
   *
   * ── 为什么一律走 invokeAction，绝不自己算 ──
   * 同城移动在逻辑层里就是一条行动（main.js:3455 `travel_<key>`），它的 handler
   * 内部做了四件事：按路况/技能/天气扣 AP、记 `_visitedLocations` 成就、写消息
   * 日志、触发到达时的 NPC 遭遇。自己实现一份必然漏掉后三件，AP 口径也会漂移。
   * **能复用的入口就绝不重写** —— 这条在 3D 层尤其重要，因为漏掉的都是
   * 不报错、不崩溃、只是"那个功能再也不触发"的东西。
   *
   * ── 可摘除 ──
   * 只在 URL 带 `?mode=3d` / `#3d` 时自动启动，运行时按 F3 切换。
   * 不启动时本节的代码一行也不执行。
   */

  var FIRST_ID = "scene3d-first";
  var firstShell = null;   // create3DShell 句柄
  var firstHost = null;    // 全屏宿主（含退出按钮）
  var appEl = null;        // 被让位的原 2D 根（#app）
  var appPrevDisplay = ""; // 它的原 display，退出时原样还回去
  var lastMsgLen = -1;     // messageLog 长度游标，用来只播"新增的消息"
  var pending = false;     // 刷新合并标志（见 scheduleFirst）
  var changeHooked = false;// onChange 是否已订阅（该 API 没有退订，只能订阅一次）
  var hooksInstalled = false;// F3 / 自动启动是否已装（见 installHooks 的环境守卫）
  var autoStartPending = false;// 「等玩家开始游戏」是否还挂着（见 autoStartFirst）
  var pollTicks = 0;       // 兜底轮询计数，只用来降频，**不作为放弃条件**

  var SLOT_CN = { morning: "上午", afternoon: "下午", evening: "傍晚" };

  /**
   * 时段：逻辑层只有三档（main.js:5490 按 AP 百分比派生），3D 照明有四档。
   * 把「AP 见底」映射成夜间 —— 语义自洽：天黑了，该回住处睡了，
   * 而 AP 归零本来也正是 endDay 的触发条件。
   */
  function slotOf(st) {
    var p = (st && st.player) || {};
    var ts = p.timeSlot;
    if (ts === "morning" || ts === "afternoon") return SLOT_CN[ts];
    var ap = typeof p.actionPoints === "number" ? p.actionPoints : 0;
    return ap > 0 ? "傍晚" : "夜间";
  }

  /** 天气：借逻辑层的 WEATHER_TYPES 表，拿不到就退回 id 原文（不编造中文名） */
  function weatherLabel(st) {
    var id = st && st.weather && st.weather.current;
    if (!id) return "";
    var list = null;
    try { if (typeof WEATHER_TYPES !== "undefined") list = WEATHER_TYPES; } catch (e) { /* TDZ/未定义 */ }
    if (!list && window.WEATHER_TYPES) list = window.WEATHER_TYPES;
    if (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i] && list[i].id === id) {
          return (list[i].icon ? list[i].icon + " " : "") + (list[i].name || id);
        }
      }
    }
    return id;
  }

  /**
   * 地点元信息。优先问逻辑层（LOCATIONS 里有 type / wealthTier 等 3D 用不到的字段，
   * 但**名字与图标必须与 2D 界面逐字一致**），拿不到才退回 3D 自己的 gamedata。
   */
  function locMeta(id) {
    var l = null;
    try { if (typeof getLocation === "function") l = getLocation(id); } catch (e) { /* 未定义 */ }
    if (!l) {
      var c = core();
      l = c && c.gamedata && c.gamedata.locations ? c.gamedata.locations[id] : null;
    }
    return l || { id: id, name: id, icon: "📍", desc: "" };
  }

  /**
   * 债务合计 —— 口径必须与游戏 header 逐字一致（render_core.js:348-351）。
   * ★ 那里用的是 villageDebt / fineDebt / bankDebt 三项，
   *   **不含 `resources.debt`**（那个字段默认 0，全库没有权威消费点）。
   *   若这里"顺手"把 debt 也加上，玩家会看到一个从没在别处出现过的数字。
   */
  function debtOf(st) {
    var r = (st && st.resources) || {};
    return (r.villageDebt || 0) + (r.fineDebt || 0) + (r.bankDebt || 0);
  }

  /** readHUD：外壳的 HUD 数据源。返回 null 表示"现在还没有状态可显示" */
  function readHUD() {
    var st = getState();
    if (!st || !st.player) return null;
    var locId = (st.trade && st.trade.currentLocation) || null;
    var lm = locId ? locMeta(locId) : null;
    return {
      day: st.player.day || 1,
      slot: slotOf(st),
      weather: weatherLabel(st),
      cash: (st.resources && st.resources.cash) || 0,
      debt: debtOf(st),
      /* ★ locId 交给外壳当权威：玩家点「前往 公园」走的是逻辑层的行动，
         外壳的 travel() 根本没参与。外壳据此比对并换场景（见 shell.js 注释）。 */
      locId: locId,
      locIcon: lm ? lm.icon : "📍",
      locName: lm ? lm.name : "",
      needs: st.needs,
      status: st.status,
      ap: {
        cur: typeof st.player.actionPoints === "number" ? st.player.actionPoints : 0,
        max: typeof st.player.maxActionPoints === "number" && st.player.maxActionPoints > 0
          ? st.player.maxActionPoints : 100,
      },
    };
  }

  /** 行动分类 → HUD 上的小标签 */
  var CAT_CN = {
    work: "工作", service: "服务", trade: "买卖", other: "出行",
    crime: "违法", social: "社交", study: "学习", rest: "休息",
  };

  function clip(s, n) {
    if (typeof s !== "string") return "";
    var t = s.replace(/\s+/g, " ").trim();
    return t.length > n ? t.slice(0, n - 1) + "…" : t;
  }

  /**
   * readActions：直接把 getAvailableActions 的结果投影成 HUD 条目。
   *
   * ★ `action.disabled` 是**字符串或 null**（不是布尔）—— 它既当标志又当理由。
   *   写成 `disabled: a.disabled` 会把字符串塞进 DOM 的 disabled 属性判断，
   *   虽然 `!!"理由"` 恰好为真，但 `reason` 就丢了，玩家只看到灰掉却不知道为什么。
   */
  function readActions() {
    var raw = rawActions();
    if (!raw) return [];
    var out = [];
    for (var i = 0; i < raw.length; i++) {
      var a = raw[i];
      if (!a || !a.id) continue;
      var why = typeof a.disabled === "string" ? a.disabled : (a.reqFail || "");
      var desc = clip(a.desc, 44);
      if (a.payEstimate) desc = "收益 ¥" + a.payEstimate + (desc ? " · " + desc : "");
      out.push({
        id: a.id,
        icon: a.icon || "•",
        name: a.name || a.id,
        desc: desc,
        cost: a.apCost ? "AP" + a.apCost : (a.costEstimate ? "¥" + a.costEstimate : ""),
        kind: CAT_CN[a.category] || (a.category || "行动"),
        disabled: !!a.disabled,
        reason: clip(why, 30),
      });
    }
    return out;
  }

  /**
   * readLocations：地图面板的"去哪里"。
   * 只列**可达**地点 —— 这与逻辑层 `travel_<key>` 行动的集合是同一个，
   * 所以地图上点得动的每一个，`invokeAction` 都必然找得到（不会点了没反应）。
   */
  function readLocations() {
    var cur = currentLocId();
    var keys = null;
    try { if (typeof getReachableLocations === "function") keys = getReachableLocations(cur); } catch (e) { /* 未定义 */ }
    if (!keys || !keys.length) {
      var c = core();
      keys = c && c.gamedata ? Object.keys(c.gamedata.locations) : [];
    }
    var out = [];
    for (var i = 0; i < keys.length; i++) {
      var m = locMeta(keys[i]);
      out.push({ id: keys[i], name: m.name, icon: m.icon, desc: m.desc });
    }
    return out;
  }

  /* ── 执行：一切交互都收敛到 invokeAction ── */

  function onAction(item) {
    var r = invokeAction(item.id);
    if (!r.ok) return { ok: false, reason: r.reason };
    /* handler 内部**不一定**走 StateManager.update（不少地方直接改 state.xxx），
       所以不能只靠 onChange 订阅。外壳拿到 {ok:true} 后会自己 refresh 一次。 */
    return { ok: true };
  }

  function onTravel(id) {
    if (!id) return { ok: false, reason: "没有这个地点" };
    if (id === currentLocId()) return { ok: false, reason: "你已经在这里了" };
    /* 走逻辑层的 `travel_<key>` 行动，而不是直接写 trade.currentLocation ——
       理由见本节开头：AP 扣除、成就记录、NPC 遭遇都只在那条行动里。 */
    var r = invokeAction("travel_" + id);
    return r.ok ? { ok: true } : { ok: false, reason: r.reason || "去不了那里" };
  }

  function kindOfMsg(t) {
    if (t === "warning" || t === "warn") return "warn";
    if (t === "error" || t === "danger" || t === "bad") return "bad";
    return "ok";
  }

  /**
   * 刷新合并。StateManager 的 update() 每调一次就 notify 一次，而一次玩家操作
   * 内部可能连着 update 十几个字段 —— 不合并就会把行动托盘整个重建十几遍。
   */
  function scheduleFirst() {
    if (pending) return;
    pending = true;
    setTimeout(function () { pending = false; refreshFirst(); }, 0);
  }

  /**
   * 刷新 HUD，并把逻辑层新写的消息浮上来。
   *
   * ★ 为什么必须回显 messageLog：游戏的反馈**全部**是 `StateManager.addMessage`
   *   写的（"🚶 你来到了公园"、"⚠️ 行动力不足"）。3D-first 把 2D 界面藏起来后，
   *   消息栏也跟着没了 —— 玩家点了行动，钱扣了、AP 少了，却看不到任何解释。
   *   这不是崩溃，是"游戏突然不说话了"，比崩溃更难意识到是缺陷。
   *   这里只读不写，逻辑层不需要为 3D 做任何配合。
   */
  function refreshFirst() {
    if (!firstShell) return;
    var st = getState();
    if (st && st.messageLog) {
      var n = st.messageLog.length;
      /* messageLog 超过 500 条会 slice(-300)（state.js:910），长度**会变小**。
         所以只在变长时播，变小说明被裁剪了，静默重置游标即可。 */
      if (lastMsgLen >= 0 && n > lastMsgLen) {
        var m = st.messageLog[n - 1];
        if (m && m.text) firstShell.notify(m.text, kindOfMsg(m.type));
      }
      lastMsgLen = n;
    }
    firstShell.refresh();
  }

  /* ── 挂载 / 卸载 ── */

  function mountFirst() {
    if (firstShell) return firstShell;
    if (!available()) return null;
    var S3 = core();
    if (typeof S3.create3DShell !== "function") return null;
    if (!getState()) return null;   // 逻辑层还没 newGame/loadGame

    /* ── 让位：分成两类，处理方式**不同** ──────────────────────────────────
     *
     * 【A 类】开始游戏之前的界面（4 张欢迎屏）—— 直接 display:none
     *   #welcome-screen  #mode-select-screen
     *   #scenario-select-screen  #sandbox-screen
     *
     *   ★ 2026-09-19 修「3D 模式下按 Tab，焦点跑到原网页」。
     *   真凶是这 4 张屏：它们是 body 的直接子元素，**不在 `#app` 内部**，
     *   所以 `#app` 的 display:none 完全管不到。实测 3D 模式下它们仍可见，
     *   里面 20+ 个按钮（「开始新游戏」「传承商店」「帮助」…）
     *   全都留在 tab 顺序里 —— 玩家按 Tab，焦点就在这些**看不见的**
     *   按钮上游走。
     *   设 `inert` 双保险：2D 逻辑随时可能把这些屏重新显示出来
     *   （readHUD 那条 onChange 链上就有）。
     *
     * 【B 类】`#app` —— **不能整块 display:none**（这是"完全 3D"的关键）
     *
     *   原实现把 `#app` 一起藏了，代价是**整个游戏主界面消失**：
     *   header / sidebar / main（行动·城市·我·事业·百科 五个 tab）
     *   全部不可见，只剩 3D 的 HUD。实测 `#main` 高度从 852px 掉到 0。
     *   玩家在 3D 里点「商店」→ 弹窗虽然能浮出来（挂 body、z=10000），
     *   但**所有依赖 #app 内部结构的功能都拿不到容器**。
     *
     *   改成**加一个 CSS 类 `.s3-yield`**（见 scene3d.css）：
     *     · 隐藏主视图（header/sidebar/main 都 display:none）
     *     · **但 `#app` 自身保持可见**（不设 display、不设 inert）
     *   这样：
     *     · 主界面让位给 3D —— 视觉上就是"完全 3D"
     *     · 而挂进 `#app` 内部的弹层/浮层仍能正常显示（它们是 position:fixed
     *       的，父级 display:none 会把它们一起藏掉，这就是原方案的根本问题）
     *     · 也**不能设 inert**：inert 会让 #app 内所有弹窗变成不可交互。
     *
     *   用一个类而不是内联样式，是为了让"让位长什么样"这件事集中在 CSS 里 ——
     *   以后要调（比如想让侧栏留一条窄边）只改一处。 */
    yieldEls = [];
    /* A 类：整块隐藏 + inert */
    var YIELD_HIDDEN = ["welcome-screen", "mode-select-screen", "scenario-select-screen", "sandbox-screen"];
    for (var yi = 0; yi < YIELD_HIDDEN.length; yi++) {
      var he = document.getElementById(YIELD_HIDDEN[yi]);
      if (!he) continue;
      yieldEls.push({ el: he, prev: he.style.display || "", kind: "hidden" });
      he.style.display = "none";
      try { he.inert = true; } catch (e) { /* 老浏览器会忽略 inert */ }
    }
    /* B 类：#app 加类让位（保持可显示、可交互，只藏主视图） */
    appEl = document.getElementById("app");
    if (appEl) {
      appElDisplayPrev = appEl.style.display || "";
      yieldEls.push({ el: appEl, prev: appElDisplayPrev, kind: "class" });
      appEl.classList.add("s3-yield");
    }
    appPrevDisplay = appElDisplayPrev;

    /* body 级状态类 —— 供 CSS 把**游戏弹层**抬到 3D 之上。
     *
     * ★ 为什么必须是 body 级：游戏的弹窗全部 `document.body.appendChild`
     *   （main.js:852 / ui/modal.js:208,1529,1711 / events_core.js:839 /
     *    actions_extra.js:1993 / critical.js:1217 / daily_report.js:1329 /
     *    companyHistory.js:226 / world_news_intro.js:2976,3124 —— 共 11 处），
     *   **不在 `#app` 内部**。所以 `#app.s3-yield .modal-overlay` 这类
     *   selector 一个都匹配不上（我第一版就这么写的，规则全部落空，
     *   测出来弹窗 z 仍是 1000、被 3D 的 9000 盖住）。
     *   挂在 body 上才能覆盖到所有弹层。 */
    if (document.body) document.body.classList.add("s3-first-mode");

    firstHost = document.createElement("div");
    firstHost.id = FIRST_ID;
    firstHost.className = "s3-first";

    var exit = document.createElement("button");
    exit.type = "button";
    exit.className = "s3-first-exit";
    exit.textContent = "✕ 退出 3D";
    exit.title = "回到原界面（快捷键 F3）";
    exit.addEventListener("click", unmountFirst);
    firstHost.appendChild(exit);

    document.body.appendChild(firstHost);

    firstShell = S3.create3DShell({
      container: firstHost,
      data: S3.gamedata,
      readHUD: readHUD,
      readActions: readActions,
      readLocations: readLocations,
      onAction: onAction,
      onTravel: onTravel,
    });
    firstShell.start();

    var cur = currentLocId();
    if (cur) firstShell.loadLocation(cur);
    lastMsgLen = (getState().messageLog || []).length;

    ensureChangeHook();

    /* 提示文案随「默认 / 强制」变化：
       默认进 3D 时，玩家没做任何选择就"界面变了"，更需要一句明确的返回指引。
       而用 ?mode=3d 强制进来的人，本来就知道自己在做什么。 */
    firstShell.notify(wants2D() ? "2D 模式" : "3D 模式 · 按 F3 切换界面", "ok");
    return firstShell;
  }

  function unmountFirst() {
    if (firstShell) { firstShell.dispose(); firstShell = null; }
    if (firstHost) { firstHost.remove(); firstHost = null; }

    /* 还原让位的界面，按 kind 分两种处理：
         hidden → 写回原 display + 解除 inert
         class  → 摘掉 .s3-yield（不碰 display，它本来就没被改过） */
    for (var i = 0; i < yieldEls.length; i++) {
      var rec = yieldEls[i];
      if (!rec || !rec.el) continue;
      if (rec.kind === "class") {
        rec.el.classList.remove("s3-yield");
      } else {
        rec.el.style.display = rec.prev;
        try { rec.el.inert = false; } catch (e) { /* 老浏览器忽略 */ }
      }
    }
    yieldEls = [];

    if (document.body) document.body.classList.remove("s3-first-mode");

    appEl = null;
    appPrevDisplay = "";
    lastMsgLen = -1;
    pending = false;
  }

  function toggleFirst() {
    if (firstShell) { unmountFirst(); return false; }
    return !!mountFirst();
  }

  /**
   * 是否进 3D-first 形态。
   *
   * ★ 2026-09-19 改为 **3D 成为默认形态**（恒稳拍板）。
   *
   * 旧行为是「默认 2D，必须显式要求才进 3D」：要手打 `?mode=3d`，
   * 或用 `#3d`。实测的后果是——**玩家根本不知道有这个模式**。
   * 恒稳打开 `/d` 看到的仍是 2D 界面 + 侧栏缩略图，于是问
   * "为什么还有原来的网页界面""是不是还没转成 3D 游戏"。
   * 一个要手打 URL 才能进的主形态，等于没有。
   *
   * 新行为（三条，顺序即优先级）：
   *   1. `?mode=2d` / `#2d` / `#2d-first`  → **强制 2D**（逃生口，见下）
   *   2. `?mode=3d` / `#3d` / `#3d-first` → 强制 3D（保留，老链接不失效）
   *   3. 什么都不带                        → **默认 3D**
   *
   * 为什么必须留 `?mode=2d` 这个逃生口：
   *   2D 界面里有一批功能 3D 层还没接手（商店/工作/事件弹窗等仍是 2D DOM）。
   *   而且 3D 层依赖 WebGL —— 老旧机器/禁用 WebGL 的浏览器上，
   *   若没有一条"回到能用的界面"的路，游戏会直接变砖。
   *   `available()` 那条守卫只能挡住"3D 代码没加载"，
   *   挡不住"加载了但 WebGL 上下文创建失败"。所以逃生口必须是 URL 级的，
   *   不依赖任何 JS 成功执行。
   *
   * @returns {boolean}
   */
  function wantsFirst() {
    if (typeof window === "undefined" || !window.location) return false;
    var q = window.location.search || "";
    var h = window.location.hash || "";

    /* 1. 显式强制 2D —— 逃生口，优先级最高 */
    if (/[?&]mode=2d(&|$)/.test(q) || h === "#2d" || h === "#2d-first") return false;

    /* 2. 显式强制 3D —— 保留旧链接的语义 */
    if (/[?&]mode=3d(&|$)/.test(q) || h === "#3d" || h === "#3d-first") return true;

    /* 3. 默认 3D */
    return true;
  }

  /** 是否被显式要求回到 2D（供 UI 提示文案区分"默认"与"强制"） */
  function wants2D() {
    if (typeof window === "undefined" || !window.location) return false;
    var q = window.location.search || "";
    var h = window.location.hash || "";
    return /[?&]mode=2d(&|$)/.test(q) || h === "#2d" || h === "#2d-first";
  }

  /**
   * 订阅逻辑层的状态变更。
   *
   * ★ StateManager.onChange 没有对应的 off（state.js:990 只 push 不提供退订），
   *   所以用一个模块级标志保证**只订阅一次** —— 否则挂载/卸载来回几次就会堆起
   *   同样数量的监听器，每次 update 都被调用 N 遍。
   *   （这一点由 verify-3d-first.cjs 的「重挂」步骤暴露出来：
   *    那条步骤本来只是为了构造 #app 可见的前置条件。）
   *
   * ★ 这个订阅**必须在挂载之前就可能装上** —— 见 autoStartFirst 的说明。
   *   所以它从 mountFirst 里抽出来，成为独立函数，两个调用点都能用。
   */
  function ensureChangeHook() {
    if (changeHooked) return;
    if (typeof window === "undefined") return;
    try {
      if (window.StateManager && typeof window.StateManager.onChange === "function") {
        window.StateManager.onChange(function () {
          if (firstShell) { scheduleFirst(); return; }
          /* 还没挂载，但玩家可能刚刚开始了游戏 —— 这正是 autoStart 要等的那一刻 */
          if (autoStartPending) tryAutoStart();
        });
        changeHooked = true;
      }
    } catch (e) { /* 订阅失败不影响已挂载的界面 */ }
  }

  /** 逻辑层的 state 是否已经可用（建 state 之前 getState() 会**抛异常**，state.js:843） */
  function stateReady() {
    var st = getState();
    return !!(st && st.player && st.trade && st.trade.currentLocation);
  }

  /** 条件一满足就挂载；返回是否已挂上 */
  function tryAutoStart() {
    if (firstShell) { autoStartPending = false; return true; }
    if (!stateReady()) return false;
    autoStartPending = false;
    return !!mountFirst();
  }

  /**
   * 兜底轮询 —— 只在 onChange 那条路走不通时才需要。
   *
   * ★★ 这里**没有放弃上限**，这是本函数唯一重要的一点。
   *
   * 旧实现是 `tries < 50 → setTimeout(attempt, 100)`，即 **5 秒预算**，
   * 超时后**静默返回**，`?mode=3d` 从此永久失效。
   * 而真实游戏的流程是：**页面先停在欢迎页，StateManager 里没有 state**，
   * 玩家看完介绍、想清楚名字、点「开始新游戏」—— 这远超 5 秒。
   *
   * 于是线上实测的表现是：点开 `?mode=3d` 链接 → 点开始新游戏 → **什么都没有**，
   * 也不报错、也不提示。玩家只会以为"这个链接坏了"。
   *
   * 本地 verify-3d-first.cjs 之所以一直是绿的，是因为它**自己**在 5 秒内调了
   * `startNewGame()` 造前置条件 —— 典型的「验证脚本喂给被测对象的状态，
   * 不是它将来要面对的状态」（本项目模式 16）。
   *
   * 所以：把"玩家还没开始游戏"当成**正常的等待**，而不是"永远不会发生"。
   * 轮询前 5 秒密（100ms，覆盖"立刻就开局"的常见情形），之后降到 1s
   * —— 一次 getState() 的代价可以忽略，而误判的代价是功能永久消失。
   */
  function pollForState() {
    if (!autoStartPending) return;
    ensureChangeHook();          // StateManager 可能比我们晚挂上
    if (tryAutoStart()) return;
    pollTicks++;
    setTimeout(pollForState, pollTicks < 50 ? 100 : 1000);
  }

  /**
   * WebGL 上下文能不能建起来。
   *
   * ★ 为什么必须单独探一次，而不是等 create3DShell 抛异常：
   *   Three.js 在拿不到 WebGL 上下文时的表现**不统一** —— 有的版本抛
   *   "Error creating WebGL context"，有的只是往 console 打一行 error 然后
   *   渲染出一个**全黑但结构完整**的 canvas。后者不会中断我们的挂载流程，
   *   于是玩家看到的是"黑屏 + HUD"，而不是"回到 2D"。
   *   探针的代价是创建又销毁一个上下文（~毫秒级），换来的是
   *   一个**确定的**降级决策点。
   * @returns {boolean}
   */
  function webglUsable() {
    if (typeof document === "undefined" || typeof document.createElement !== "function") return false;
    try {
      var c = document.createElement("canvas");
      var gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
      if (!gl) return false;
      /* 主动释放，别占着一个上下文（浏览器有 ~16 个的上限） */
      var lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 启动开关：默认进 3D（除非 URL 显式要求 2D，或 WebGL 不可用）。
   *
   * ★ 三处守卫的顺序是有意的：
   *   1. `available()` —— 3D 代码本身加载了没（bundle 缺失时什么都不做）
   *   2. `wantsFirst()` —— 玩家/URL 的意愿（默认 true，`?mode=2d` 为 false）
   *   3. `webglUsable()` —— **环境能力**。这一条是 2026-09-19 补的：
   *      前两条都通过、但 WebGL 建不起来时，旧代码会挂上一个黑屏 canvas，
   *      比"没进 3D"更糟 —— 玩家看不出是环境不支持，只当游戏坏了。
   *      降级到 2D 并在 console 说明原因，是唯一体面的处理。
   */
  function autoStartFirst() {
    if (!available()) return;
    if (!wantsFirst()) return;
    if (!webglUsable()) {
      /* 不弹 alert（会打断开场流程）。留一行可检索的日志，
         并把决定权交回 2D —— 2D 界面本来就是完整的。 */
      try {
        console.warn("[Scene3D] WebGL 不可用，已降级到 2D 界面。加 ?mode=3d 可强制重试。");
      } catch (e) { /* ignore */ }
      return;
    }
    autoStartPending = true;
    ensureChangeHook();   // 玩家「开始新游戏 / 读档」那一刻必然触发 update → notify
    pollForState();       // 兜底：onChange 若不可用（StateManager 尚未挂载等）
  }

  /* 运行时钩子：F3 切换 + 自动启动。
   *
   * ★ 整块必须有环境守卫 —— 本文件会被 tests/*.cjs 在 **Node** 里加载，
   *   那里只有一个 mock 的 window 对象，没有 addEventListener。
   *   没有守卫时的表现是 `TypeError: window.addEventListener is not a function`，
   *   而它会**把整个事件完整性门禁打红** —— 一个纯前端快捷键把后端测试打挂，
   *   排查方向会被完全带偏（实测：npm test 报的是"脚本加载错误"）。
   *   本文件其余部分本来就没有顶层副作用（全是函数定义），这一块也保持同样纪律：
   *   所有 DOM/全局副作用都收在 installHooks() 里，且先验环境。 */
  function installHooks() {
    if (typeof window === "undefined" || typeof window.addEventListener !== "function") return;
    if (hooksInstalled) return;
    hooksInstalled = true;

    /* F3 运行时切换。用捕获阶段 + 阻止默认，避免被 2D 界面或浏览器的
       "查找"快捷键（部分浏览器 F3 = 再次查找）吃掉。 */
    window.addEventListener("keydown", function (e) {
      if (e.key !== "F3") return;
      if (!available()) return;
      e.preventDefault();
      toggleFirst();
    }, true);

    if (typeof document === "undefined" || typeof document.addEventListener !== "function") return;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { setTimeout(autoStartFirst, 0); });
    } else {
      setTimeout(autoStartFirst, 0);
    }
  }
  installHooks();

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
    unmountFirst();   // 3D-first 形态也要跟着卸（否则 #app 会一直是 display:none）
    if (mini) { mini.dispose(); mini = null; }
    if (overlay3d) { overlay3d.dispose(); overlay3d = null; }
    if (overlayEl) { overlayEl.remove(); overlayEl = null; }
    document.removeEventListener("keydown", onEsc);
    lastLocId = null;
    overlayOpen = false;
  }

  window.Scene3DBridge = {
    version: "0.3.0",
    available: available,
    sync: sync,
    open: openOverlay,
    close: closeOverlay,
    dispose: disposeAll,
    /* 3D-first 形态（3D 铺满视口 + HUD，接真实游戏） */
    first: {
      mount: mountFirst,
      unmount: unmountFirst,
      toggle: toggleFirst,
      get active() { return !!firstShell; },
      get shell() { return firstShell; },
      get debug() { return firstShell ? firstShell.debug : null; },
    },
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
