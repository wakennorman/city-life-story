/**
 * 3D-first 游戏外壳
 *
 * ── 为什么要有这个文件 ──────────────────────────────────────────────────
 * 之前的样子：游戏是一个「网页应用」（header + 侧栏 + 内容区 + 卡片流），
 * 3D 被塞进侧栏当一个 229×143 的缩略控件 —— 那是"缝合"，不是 3D 游戏。
 *
 * 这里把关系倒过来：**3D 是主视图，UI 变成浮在 3D 之上的 HUD**。
 * 3D 铺满整个视口，状态/提示按需浮在边缘，不占版面。
 *
 * ── 关于"疲劳 vs 行动力该不该择其一"（对标《大多数》的结论）──────────────
 * 《大多数》**没有**"疲劳条 + 行动力条"双轨。它的结构是：
 *     一条生命线（心态/mental） + 若干生理需求（饱腹/卫生/衣物整洁/食物满足感/情绪）
 * 其中睡眠不足不表现为一条独立的"疲劳 100%"，而是**扣心态与情绪**。
 *
 * 现有设计的毛病正是双轨：睡一觉 AP 回满，但 fatigue 归零后又被算成 100%
 * → 出现"刚睡醒却提示快撑不住了"这种自相矛盾。
 * 建议（待拍板，本文件已按此预留接口，但没擅自改数值）：
 *   fatigue 从"独立需求条"改为"派生量" —— 由 (距上次睡眠时长 / 睡眠质量) 算出，
 *   只作为**扣减 AP 恢复量**和**情绪恢复速度**的系数，
 *   不再单独显示成一条会跟 AP 打架的条。
 *   → 结果：睡够 = AP 回满且 fatigue 低；熬夜 = AP 回不满 + 情绪掉。因果自洽。
 * shell.setNeeds() 已支持只传存在的字段，所以这个改动**不需要动 HUD 代码**。
 *
 * ── 职责边界 ────────────────────────────────────────────────────────────
 * 本文件不含任何游戏业务知识：读数据靠 opts.readHUD/readActions/readLocations，
 * 执行靠 opts.onAction/onTravel 回调。游戏侧只要提供这几个函数即可接入。
 */

import { createGame3D } from "./bridge.js";
import { createHUD } from "./hud.js";

export function create3DShell(opts = {}) {
  const {
    container, data,
    readHUD, readActions, readLocations,
    onAction, onTravel, onNotice, onExit,
  } = opts;

  if (!container) throw new Error("create3DShell: 缺少 container");

  const root = document.createElement("div");
  root.className = "s3s3d";
  const stage = document.createElement("div");
  stage.className = "s3s3d-stage";
  root.appendChild(stage);
  container.appendChild(root);

  const hud = createHUD();
  root.appendChild(hud.el);   // HUD 必须挂进外壳根，否则只是个游离的 DOM

  let view = null;
  let currentId = null;
  let running = false;

  function core() {
    if (view) return view;
    view = createGame3D({
      container: stage,
      data,
      mode: "full",
      onInteract: (h) => {
        // 3D 里的空间交互：交给游戏执行。成功/失败都反馈到 HUD 上。
        const r = onAction?.(h);
        if (r && r.ok === false) hud.notify(r.reason || "这一步现在做不了", "warn");
        else if (r && r.message) hud.notify(r.message, "ok");
      },
      onFocus: (h) => hud.setPrompt(h),
      onError: (e) => hud.notify("3D 不可用：" + (e && e.message ? e.message : e), "bad"),
    });
    return view;
  }

  /* ── 刷新 HUD ───────────────────────────────────────────────────────── */
  function refresh() {
    try {
      if (readHUD) {
        const s = readHUD();
        if (s) {
          /* ★ 谁决定「当前在哪」：readHUD 返回的 locId 是权威。
             ── 为什么不能只靠 shell.travel() ──
             接真实游戏后，换地点是**逻辑层**的事：点「前往 公园」执行的是
             `travel_公园` 行动，它内部改 state.trade.currentLocation。
             外壳的 travel() 根本没被调用（HUD 行动托盘走的是 onAction）。
             若这里不比对，玩家会在顶栏看到「公园」，而 3D 场景仍是旧地点
             —— 画面与文字各说各话，且不报错、不崩溃，最难查的一类。
             所以场景切换只有这一个入口，travel() 也交给它。 */
          if (s.locId && s.locId !== currentId && view) {
            if (view.loadLocation(s.locId)) {
              currentId = s.locId;
              // 可达地点随所在地变化，地图列表要跟着重刷
              if (readLocations) hud.setLocations(readLocations() || [], travel);
            }
          }
          hud.setTop(s);
          hud.setNeeds(s.needs, s.status);
          if (s.ap) hud.setAP(s.ap.cur, s.ap.max);
          /* 时段照明：上午/下午/傍晚/夜间 四个 slot 跟着走，阳光/雾/曝光都追平。
             inZOI 拟真的核心就是「动态时间」而非 materia。 */
          if (s.slot && view) view.setTimeSlot(s.slot);
        }
      }
      if (readActions) {
        const items = readActions() || [];
        hud.setActions(items, (it) => {
          const r = onAction?.(it);
          if (r && r.ok === false) hud.notify(r.reason || "这一步现在做不了", "warn");
          else { refresh(); }
        });
      }
    } catch (e) {
      hud.notify("状态刷新失败：" + (e && e.message ? e.message : e), "bad");
    }
  }

  /* ── 地点 ───────────────────────────────────────────────────────────── */
  function loadLocation(id) {
    const v = core();
    const w = v.loadLocation(id);
    if (!w) return null;
    currentId = id;
    return w;
  }

  function travel(id) {
    if (!id || id === currentId) return;
    const r = onTravel?.(id);
    if (r && r.ok === false) { hud.notify(r.reason || "去不了那里", "warn"); return; }
    /* 场景由 refresh 统一决定（见那里的注释）。只有当 readHUD 不提供权威
       locId 时（预览页 / 独立使用外壳），才由外壳自己切。 */
    const s = readHUD ? readHUD() : null;
    if (!s || !s.locId) loadLocation(id);
    refresh();
    hud.notify("已到达：" + (pickLoc(id)?.name || id), "ok");
  }

  function pickLoc(id) {
    const list = (readLocations && readLocations()) || [];
    for (const l of list) if (l.id === id) return l;
    return null;
  }

  /* ── 键盘 ─────────────────────────────────────────────────────────────
   *
   * ★ 2026-09-19 修「Tab 键一半的响应跑到别处」。
   *
   * 症状：3D 模式下按 Tab，行动托盘**有时**展开、有时不展开，
   *       而且原 2D 界面里会有元素被聚焦（虽然它已 display:none）。
   *
   * 两个原因叠在一起：
   *   1. 监听挂在**冒泡阶段**（默认）。Tab 是浏览器内建行为，
   *      在冒泡到达我们之前，焦点已经开始移动了。虽然 preventDefault
   *      能取消默认行为，但若链路上有别的监听先 stopPropagation，
   *      我们就永远收不到这个事件 —— 表现就是"有时不好使"。
   *   2. 没 stopPropagation，事件继续上传给 2D 层与宿主页面。
   *
   * 解法：捕获阶段（第三个参数 true）+ stopPropagation。
   *   捕获是从 window 往下走，我们是最外层容器，**一定**是最先拿到的那个。
   *   拿到就吃掉，后面的默认行为与其它监听都不会再看到它。
   *
   * 另外补 Escape 关闭已展开的面板 —— 这是全屏界面的通用期待，
   * 原先只能"再按一次 Tab"或点关闭按钮。
   *
   * ★ 关于 Space：**外壳不处理 Space**。
   *   上一轮口头说"Space 切换时段"是错的，代码里从来没有过。
   *   这里明确写下来，免得下次又有人（包括我）凭印象当成已有功能。
   *   时段由游戏状态驱动（readHUD 的 slot），不需要手动切换键。
   *   但 full 模式里 Space 会被 preventDefault 以防页面滚动 —— 见 index.js。 */
  function onKey(e) {
    const t = e.target;
    const typing = !!(t && t.tagName && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || (t && t.isContentEditable);

    /* ★ 输入态下的例外清单 —— 2026-09-19 修「打开去处列表后 Escape 失效」。
     *
     * 原实现是「只要焦点在输入框，一律 return」。这条守卫本身没错
     * （否则在搜索框里打字会触发一堆快捷键），但它顺手把 Escape 也挡掉了：
     *   M 打开去处列表 → toggleMap 会 f.mapSearch.focus()
     *   → 焦点落在搜索框 → 之后按 Escape 想在"关闭面板"时，
     *   事件被这条守卫直接吞掉，面板关不掉。
     * 实测现象就是"地图开了之后 Escape 没反应"，而 Tab/M 在**开地图之前**
     * 测是好的 —— 典型的「顺序相关的假象」。
     *
     * 输入态下仍应生效的两个键：
     *   Escape —— 清空搜索框并收起面板是通用期待，绝不能挡。
     *   全局呼出键（Tab/M）—— 在输入框里也应当能切面板。
     * 其余（R 回正等）在打字时应让路，避免误触。
     */
    const globalKeys = e.code === "Escape" || e.code === "Tab" || e.code === "KeyM";
    if (typing && !globalKeys) return;

    if (e.code === "Tab") {
      e.preventDefault();
      e.stopPropagation();
      hud.toggleTray();
    } else if (e.code === "KeyM") {
      e.preventDefault();
      e.stopPropagation();
      hud.toggleMap();
    } else if (e.code === "Escape") {
      /* Escape 只负责"收起"，不负责"展开" —— 且不抢默认，
         让浏览器的其它 Escape 行为（退出全屏等）仍能工作。
         优先级：地图 > 托盘（地图是更"上层"的面板）。
         收起地图时顺带把焦点从搜索框移走，否则下一次按键
         仍然落在输入框里（虽然现在有 globalKeys 例外兜着，
         但让焦点回到 3D 舞台才是干净的状态）。 */
      if (hud.mapOpen) {
        e.preventDefault();
        const search = document.querySelector("#scene3d-first .s3h-map-search");
        if (search && document.activeElement === search) search.blur();
        hud.toggleMap(false);
      } else if (hud.trayOpen) {
        e.preventDefault();
        hud.toggleTray(false);
      }
    } else if (e.code === "KeyR") {
      e.stopPropagation();
      core().resetView();
    }
  }

  return {
    el: root,
    hud,

    start() {
      if (running) return;
      running = true;
      const v = core();
      v.start();
      if (readLocations) hud.setLocations(readLocations() || [], travel);
      /* ★ 捕获阶段（true）—— 见 onKey 顶注：必须抢在浏览器内建的 Tab
         焦点移动、以及 2D 层/宿主的任何监听之前拿到事件。
         冒泡阶段拿不到的情形是真实存在的（链路上有人 stopPropagation），
         表现就是"快捷键有时灵有时不灵"，最难查的一类 bug。 */
      window.addEventListener("keydown", onKey, true);
      window.addEventListener("resize", () => v.resize());
      refresh();
      return this;
    },

    stop() {
      running = false;
      window.removeEventListener("keydown", onKey, true);
      view?.stop();
    },

    dispose() {
      this.stop();
      view?.dispose();
      view = null;
      hud.destroy();
      root.remove();
    },

    loadLocation,
    travel,
    refresh,
    resize() { view?.resize(); },

    /** 让外部（游戏侧）在状态变化后推一次 HUD */
    sync() { refresh(); },

    notify(msg, kind) { hud.notify(msg, kind); },
    get locationId() { return currentId; },
    get view3d() { return view; },
    get stats() { return view ? view.stats : null; },

    /** 调试口：HUD 是否已渲染出内容（验证脚本用） */
    get debug() {
      return {
        locationId: currentId,
        actions: hud.el.querySelectorAll(".s3h-act").length,
        vitals: hud.el.querySelectorAll(".s3h-vital").length,
        promptVisible: !hud.el.querySelector('[data-f="prompt"]').hidden,
        view: view ? view.view : null,
        timeSlot: view ? view.timeSlot : null,
        tris: view ? view.stats.triangles : 0,
        calls: view ? view.stats.calls : 0,
        lampAnchors: view ? view.stats.lampAnchors : 0,
        lamps: view ? view.stats.lamps : 0,
        /* 渲染管线的可观测读数。放这里而不是让验证脚本去翻内部对象：
           管线类缺陷（顺序错、pass 没加、Bloom 白天还开着）都不产生报错，
           只有把"链是什么样"直接暴露出来才断言得了。 */
        postFx: view ? view.stats.postFx : null,
        sun: view ? view.stats.sun : null,
        cameraDepth: view ? { near: view.camera.near, far: view.camera.far } : null,
        /* 外部资产（Kenney CC0 GLB）运行态。
           放这里的原因与 postFx 相同：资产链的失败模式（404、CSP 拦、贴图没解析、
           pump 时机错）**全部是静默的** —— 画面照常渲染，只是退回了程序化几何。
           不把加载器状态暴露出来，就没有任何手段区分"真用了 GLB"和"静静退回了兜底"。 */
        assets: view ? view.assets : null,
      };
    },

    /** 外部资产快照的直通口（验证脚本用；避免脚本去翻 view 内部结构） */
    get assets() { return view ? view.assets : null; },
  };
}
