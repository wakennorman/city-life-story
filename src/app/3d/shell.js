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
    loadLocation(id);
    refresh();
    hud.notify("已到达：" + (pickLoc(id)?.name || id), "ok");
  }

  function pickLoc(id) {
    const list = (readLocations && readLocations()) || [];
    for (const l of list) if (l.id === id) return l;
    return null;
  }

  /* ── 键盘 ───────────────────────────────────────────────────────────── */
  function onKey(e) {
    const t = e.target;
    if (t && t.tagName && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (e.code === "Tab") { e.preventDefault(); hud.toggleTray(); }
    else if (e.code === "KeyM") { e.preventDefault(); hud.toggleMap(); }
    else if (e.code === "KeyR") { core().resetView(); }
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
      window.addEventListener("keydown", onKey);
      window.addEventListener("resize", () => v.resize());
      refresh();
      return this;
    },

    stop() {
      running = false;
      window.removeEventListener("keydown", onKey);
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
      };
    },
  };
}
