/**
 * 3D-first HUD —— 把状态与提示画进 3D 页面里
 *
 * 设计依据（对标《大多数》的 HUD 取舍）：
 *   · 《大多数》没有"疲劳条 + 行动力条"双轨，它有**一条生命线（心态）+ 若干生理需求**。
 *     这是回应"疲劳和行动力该怎么平衡"这个问题的核心参考 —— 详见 shell.js 顶注。
 *   · 《大多数》HUD 的铁律是**不遮挡视野**：状态贴在屏幕边缘、半透明、
 *     不需要时几乎看不见；信息按"随时要看的（钱/时间/AP）"与
 *     "扫一眼就够的（饱腹/卫生/心情）"分两级，前者常驻、后者半透明。
 *
 * 为什么不用现成的游戏 DOM：
 *   现有 DOM 是"网页应用"的排版（侧栏 + 内容区 + 卡片流），放在 3D 上会
 *   把 3D 挤成一个控件。这里重做一套只服务于 3D 视口的极简 HUD。
 *
 * 全部 class 前缀 `s3h-`（scene3d-HUD），样式在 src/css/scene3d.css。
 */

/* 需求条：id 与 state.needs / state.status 的字段名严格一一对应。
   字段名是核对 src/js/core/state.js:92-107 得来的，不要凭命名习惯猜。 */
const NEED_SPEC = [
  { key: "hunger", label: "饱腹", icon: "🍚", invert: false },
  { key: "fatigue", label: "疲劳", icon: "😴", invert: true },
  { key: "hygiene", label: "卫生", icon: "🚿", invert: false },
  { key: "happiness", label: "心情", icon: "🙂", invert: false },
  { key: "health", label: "健康", icon: "❤️", invert: false, from: "status" },
];

/** 值越低越糟的条用绿→琥珀→红；invert 的（疲劳）反过来 */
function toneOf(value, invert) {
  const v = invert ? 100 - value : value;
  if (v >= 55) return "ok";
  if (v >= 25) return "warn";
  return "bad";
}

export function createHUD(opts = {}) {
  const root = document.createElement("div");
  root.className = "s3h";
  root.innerHTML = `
    <div class="s3h-top">
      <div class="s3h-clock">
        <span class="s3h-day" data-f="day">第 1 天</span>
        <span class="s3h-sep">·</span>
        <span class="s3h-slot" data-f="slot">上午</span>
        <span class="s3h-weather" data-f="weather"></span>
      </div>
      <div class="s3h-place">
        <span class="s3h-place-icon" data-f="locIcon">📍</span>
        <span class="s3h-place-name" data-f="locName">—</span>
      </div>
      <div class="s3h-purse">
        <span class="s3h-cash" data-f="cash">¥0</span>
        <span class="s3h-debt" data-f="debt" hidden></span>
      </div>
    </div>

    <div class="s3h-vitals" data-f="vitals"></div>

    <div class="s3h-ap">
      <div class="s3h-ap-head">
        <span>行动力</span>
        <span data-f="apText">0 / 100</span>
      </div>
      <div class="s3h-ap-track"><i data-f="apFill"></i></div>
    </div>

    <div class="s3h-prompt" hidden data-f="prompt"></div>

    <div class="s3h-tray" data-f="tray">
      <div class="s3h-tray-head">
        <span class="s3h-tray-title" data-f="trayTitle">当前可做的事</span>
        <button type="button" class="s3h-tray-toggle" data-f="trayToggle">收起</button>
      </div>
      <div class="s3h-tray-body" data-f="trayBody"></div>
    </div>

    <div class="s3h-keys">
      <kbd>WASD</kbd> 走动 <kbd>Shift</kbd> 跑 ·
      <b>按住左键拖动</b> 转视角 · <kbd>滚轮</kbd> 缩放 ·
      <kbd>E</kbd> 交互 · <kbd>Tab</kbd> 行动 · <kbd>M</kbd> 去处
    </div>

    <div class="s3h-toast-wrap" data-f="toasts"></div>

    <div class="s3h-map" hidden data-f="map">
      <div class="s3h-map-panel">
        <div class="s3h-map-head">
          <span>去哪里</span>
          <button type="button" class="s3h-map-close" data-f="mapClose">✕</button>
        </div>
        <input class="s3h-map-search" data-f="mapSearch" placeholder="搜索地点…" />
        <div class="s3h-map-list" data-f="mapList"></div>
      </div>
    </div>
  `;

  const q = (name) => root.querySelector(`[data-f="${name}"]`);
  const f = {
    day: q("day"), slot: q("slot"), weather: q("weather"),
    locIcon: q("locIcon"), locName: q("locName"),
    cash: q("cash"), debt: q("debt"),
    vitals: q("vitals"),
    apText: q("apText"), apFill: q("apFill"),
    prompt: q("prompt"),
    tray: q("tray"), trayTitle: q("trayTitle"), trayToggle: q("trayToggle"), trayBody: q("trayBody"),
    toasts: q("toasts"),
    map: q("map"), mapList: q("mapList"), mapSearch: q("mapSearch"),
    mapClose: q("mapClose"),
  };

  /* ── 状态条 ─────────────────────────────────────────────────────────── */
  f.vitals.innerHTML = NEED_SPEC.map((s) => `
    <div class="s3h-vital" data-k="${s.key}" title="${s.label}">
      <span class="s3h-vital-icon">${s.icon}</span>
      <span class="s3h-vital-bar"><i></i></span>
      <span class="s3h-vital-num">0</span>
    </div>`).join("");

  const vitalEls = NEED_SPEC.map((s) => ({
    spec: s,
    row: f.vitals.querySelector(`[data-k="${s.key}"]`),
  }));
  vitalEls.forEach(({ row }) => {
    row._fill = row.querySelector("i");
    row._num = row.querySelector(".s3h-vital-num");
    row._track = row.querySelector(".s3h-vital-bar");
  });

  let trayOpen = false;
  let mapOpen = false;

  const api = {
    el: root,

    /** 顶栏：时间 / 天气 / 地点 / 现金 */
    setTop({ day, slot, weather, cash, debt, locIcon, locName }) {
      if (day != null) f.day.textContent = `第 ${day} 天`;
      if (slot != null) f.slot.textContent = slot;
      if (weather != null) f.weather.textContent = weather ? ` · ${weather}` : "";
      if (locName != null) f.locName.textContent = locName;
      if (locIcon != null) f.locIcon.textContent = locIcon || "📍";
      if (cash != null) f.cash.textContent = `¥${Math.round(cash).toLocaleString("zh-CN")}`;
      if (debt != null) {
        const has = Number(debt) > 0;
        f.debt.hidden = !has;
        if (has) f.debt.textContent = `欠 ¥${Math.round(debt).toLocaleString("zh-CN")}`;
      }
    },

    /** 需求条。needs 传 state.needs，status 传 state.status（健康在里面） */
    setNeeds(needs, status) {
      for (const { spec, row } of vitalEls) {
        const src = spec.from === "status" ? status : needs;
        if (!src) continue;
        const raw = src[spec.key];
        if (typeof raw !== "number") continue;
        const v = Math.max(0, Math.min(100, raw));
        row._fill.style.width = v + "%";
        row._fill.dataset.tone = toneOf(v, spec.invert);
        row._num.textContent = Math.round(v);
        row.dataset.tone = toneOf(v, spec.invert);
      }
    },

    setAP(cur, max) {
      const m = max || 100;
      f.apText.textContent = `${Math.round(cur)} / ${Math.round(m)}`;
      f.apFill.style.width = Math.max(0, Math.min(100, (cur / m) * 100)) + "%";
      f.apFill.dataset.tone = cur / m >= 0.25 ? "ok" : "bad";
    },

    /** 靠近可交互物时的 E 提示。h 为 null 收起 */
    setPrompt(h) {
      if (!h) { f.prompt.hidden = true; return; }
      f.prompt.innerHTML = `<kbd>E</kbd><span>${h.icon || ""} ${h.label || ""}</span>` +
        (h.hint ? `<em>${h.hint}</em>` : "");
      f.prompt.hidden = false;
    },

    /**
     * 行动托盘 —— 这里是"能真正点击执行"的入口，
     * 不只是显示信息（原型的 E 面板只做展示，那是它作为数据巡检工具的定位）。
     * items: [{ id, icon, name, desc, cost, disabled, reason, kind }]
     */
    setActions(items, onPick) {
      if (!items || !items.length) {
        f.trayBody.innerHTML = `<div class="s3h-empty">此刻这里没有可做的事，换个地方看看。</div>`;
        return;
      }
      f.trayBody.innerHTML = items.map((a, i) => {
        const tag = a.kind ? `<span class="s3h-chip">${a.kind}</span>` : "";
        const cost = a.cost ? `<span class="s3h-cost">${a.cost}</span>` : "";
        return `
        <button type="button" class="s3h-act${a.disabled ? " is-off" : ""}" data-i="${i}"
                ${a.disabled ? "disabled" : ""} title="${a.reason || a.desc || ""}">
          <span class="s3h-act-icon">${a.icon || "•"}</span>
          <span class="s3h-act-main">
            <span class="s3h-act-name">${a.name}</span>
            ${a.desc ? `<span class="s3h-act-desc">${a.desc}</span>` : ""}
            ${a.disabled && a.reason ? `<span class="s3h-act-reason">${a.reason}</span>` : ""}
          </span>
          ${tag}${cost}
        </button>`;
      }).join("");
      f.trayBody.querySelectorAll(".s3h-act").forEach((b) => {
        b.addEventListener("click", () => {
          const it = items[Number(b.dataset.i)];
          if (it && !it.disabled) onPick(it);
        });
      });
    },

    toggleTray(force) {
      trayOpen = force == null ? !trayOpen : !!force;
      f.tray.classList.toggle("is-open", trayOpen);
      f.trayToggle.textContent = trayOpen ? "收起" : "展开";
      return trayOpen;
    },

    /** 地点列表（去哪里）。items: [{ id, name, icon, desc }] */
    setLocations(items, onPick) {
      const render = (kw = "") => {
        const k = kw.trim().toLowerCase();
        const list = k ? items.filter((l) =>
          `${l.name} ${l.desc || ""}`.toLowerCase().includes(k)) : items;
        f.mapList.innerHTML = list.length
          ? list.map((l) => `<button type="button" class="s3h-loc" data-id="${l.id}">
              <span class="s3h-loc-icon">${l.icon || "📍"}</span>
              <span class="s3h-loc-name">${l.name}</span>
            </button>`).join("")
          : `<div class="s3h-empty">没有匹配的地点</div>`;
        f.mapList.querySelectorAll(".s3h-loc").forEach((b) => {
          b.addEventListener("click", () => { api.toggleMap(false); onPick(b.dataset.id); });
        });
      };
      render("");
      f.mapSearch.addEventListener("input", () => render(f.mapSearch.value));
    },

    toggleMap(force) {
      mapOpen = force == null ? !mapOpen : !!force;
      f.map.hidden = !mapOpen;
      if (mapOpen) f.mapSearch.focus();
      return mapOpen;
    },

    get mapOpen() { return mapOpen; },

    /** 反馈条。kind: ok | warn | bad */
    notify(msg, kind = "ok") {
      const el = document.createElement("div");
      el.className = `s3h-toast is-${kind}`;
      el.textContent = msg;
      f.toasts.appendChild(el);
      setTimeout(() => el.classList.add("is-out"), 2400);
      setTimeout(() => el.remove(), 3000);
    },

    destroy() { root.remove(); },
  };

  f.trayToggle.addEventListener("click", () => api.toggleTray());
  f.mapClose.addEventListener("click", () => api.toggleMap(false));
  f.map.addEventListener("click", (e) => { if (e.target === f.map) api.toggleMap(false); });

  return api;
}

export { NEED_SPEC };
