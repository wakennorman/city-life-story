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

/* 需求条：key 与 state.needs / state.status 的字段名严格一一对应。
   字段名是核对 src/js/core/state.js 得来的，不要凭命名习惯猜。
   ★ 显示名（label）与字段名是两回事：显示名按恒稳要求改接《大多数》的词汇，
     字段名保持不动 —— 3700+ 事件读的是字段名，改名会波及全局。

   ★ 《大多数》的组织方式：**一条「心态」生命线 + 若干生理需求**。
     生理需求（恒稳给的清单）：
       饱腹 / 卫生 / 衣物整洁 / 食物满足感 / 情绪
     外加「健康」—— 我们的游戏里它是独立底线（伤病直接扣），
     不像上面几条只影响情绪，所以单列。
   ★ 疲劳**不单独成条** —— 它是派生量，只作为「影响恢复速度的系数」
     显示成一行小字，并参与心态公式。理由见 shell.js 顶注：
     原双轨设计会出现「刚睡醒却提示快撑不住了」（AP 回满而 fatigue 归零被判 100%）。
   ★ 下面几组不是重复项，别合并：
       饱腹 vs 食物满足感 —— 「吃了多少」 vs 「吃得好不好」
       卫生 vs 衣物整洁     —— 身体 vs 衣着
     所以路边摊能填饱肚子但不涨满足感；洗澡也不解决衣服脏。 */
const NEED_SPEC = [
  { key: "hunger", label: "饱腹", icon: "🍚", invert: false },
  { key: "hygiene", label: "卫生", icon: "🚿", invert: false },
  { key: "clothing", label: "衣物整洁", icon: "👕", invert: false },
  { key: "foodSatisfaction", label: "食物满足感", icon: "🍜", invert: false },
  { key: "happiness", label: "情绪", icon: "🙂", invert: false },
  { key: "health", label: "健康", icon: "❤️", invert: false, from: "status" },
];

/** 值越低越糟的条用绿→琥珀→红；invert 的（疲劳）反过来 */
function toneOf(value, invert) {
  const v = invert ? 100 - value : value;
  if (v >= 55) return "ok";
  if (v >= 25) return "warn";
  return "bad";
}

/** 心态取值：优先问逻辑层的权威实现，取不到才用等价回退
 *
 *  ★ 为什么优先问逻辑层：公式写两遍必然漂移，而漂移后**HUD 显示与游戏判定会对不上**
 *    ——玩家看到心态 60，事件判定却按 48 走，这种分歧极难查（不报错、不崩溃）。
 *    权威实现在 src/js/phase1/needs.js::computeMindset。
 *
 *  ★ 为什么还要回退：3D 内核要能在「没有游戏逻辑层」的预览页里单独跑
 *    （dev/_3dtest/shell.html 只加载 bundle + mock 状态）。
 *    回退公式与 computeMindset 必须保持一致 —— 改一边就要改另一边。
 *
 *  两种访问方式都试：裸标识符与 globalThis。3D 内核和游戏逻辑层是两个
 *  独立打包产物，只能靠全局名通信（同项目的既有写法见 needs.js 对
 *  getDifficultyMultiplier 的 typeof 检查）。
 */
function mentalOf(needs, status) {
  /* ── 优先用逻辑层的权威实现 ── */
  let fn = null;
  try {
    if (typeof computeMindset === "function") fn = computeMindset;
  } catch { /* 未定义，走 globalThis */ }
  if (!fn) {
    const g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && typeof g.computeMindset === "function") fn = g.computeMindset;
  }
  if (fn && needs) {
    try {
      const v = fn({ needs, status });
      if (typeof v === "number" && isFinite(v)) return Math.max(0, Math.min(100, v));
    } catch { /* 落到回退 */ }
  }

  /* ── 回退：字段集必须与 computeMindset 严格一致 —— 注意**不含 health** ──
     ★ 这里曾经写成「把 HUD 上所有条求平均」，于是把 health 也算了进去：
       预览页显示心态 39，真实游戏里却是 33，两个数字各自都对不上对方。
     ★ 那次错误正是上面这段注释警告的「公式写两遍必然漂移」，而它**当场就发生了**
       —— 而且验证脚本没抓到（它只查条数，不查数值语义）。
       所以现在 verify-3d-shell.cjs 里加了一条「心态值必须等于按字段集算出的期望值」，
       把这条不变式变成可回归的断言，而不是靠注释提醒。
     ★ 结论：改这里就必须改 phase1/needs.js::computeMindset，反之亦然。 */
  if (!needs) return null;
  const parts = [];
  const push = (v) => {
    if (typeof v === "number" && isFinite(v)) parts.push(Math.max(0, Math.min(100, v)));
  };
  push(needs.hunger);
  push(needs.hygiene);
  push(needs.clothing);
  push(needs.foodSatisfaction);
  push(needs.happiness);
  const f = typeof needs.fatigue === "number" && isFinite(needs.fatigue) ? needs.fatigue : 0;
  push(100 - Math.max(0, Math.min(100, f))); // 疲劳反向
  if (!parts.length) return null;
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
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
  /* 最顶一行是派生出来的「心态」（《大多数》的生命线），
     下面才是逐条的生理需求。 */
  f.vitals.innerHTML = `
    <div class="s3h-vital s3h-mindset" data-k="mindset" title="心态（派生：综合生理值 + 睡眠）">
      <span class="s3h-vital-icon">🧭</span>
      <span class="s3h-vital-bar"><i></i></span>
      <span class="s3h-vital-num">—</span>
    </div>` + NEED_SPEC.map((s) => `
    <div class="s3h-vital" data-k="${s.key}" title="${s.label}">
      <span class="s3h-vital-icon">${s.icon}</span>
      <span class="s3h-vital-bar"><i></i></span>
      <span class="s3h-vital-num">0</span>
    </div>`).join("") + `
    <div class="s3h-fatigue" data-f="fatigue"></div>`;

  const wrapRow = (row) => {
    row._fill = row.querySelector(".s3h-vital-bar i");
    row._num = row.querySelector(".s3h-vital-num");
    row._track = row.querySelector(".s3h-vital-bar");
    return row;
  };

  const clamp01 = (x) => Math.max(0, Math.min(100, x));
  const applyRow = (row, v, invert) => {
    row._fill.style.width = v + "%";
    row._fill.dataset.tone = toneOf(v, invert);
    row._num.textContent = Math.round(v);
    row.dataset.tone = toneOf(v, invert);
  };

  const vitalEls = NEED_SPEC.map((s) => ({
    spec: s,
    row: wrapRow(f.vitals.querySelector(`[data-k="${s.key}"]`)),
  }));
  const mentalRow = wrapRow(f.vitals.querySelector(`[data-k="mindset"]`));
  const fatigueRow = f.vitals.querySelector('[data-f="fatigue"]');

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

    /** 需求条。needs 传 state.needs，status 传 state.status（健康在里面）
        顺带派生「心态」与「疲劳系数」。 */
    setNeeds(needs, status) {
      for (const { spec, row } of vitalEls) {
        const src = spec.from === "status" ? status : needs;
        if (!src) continue;
        const raw = src[spec.key];
        if (typeof raw === "number") applyRow(row, clamp01(raw), spec.invert);
      }

      /* 疲劳：不单独成条，只以「疲劳系数」文本派生。
         旧设计里睡意 = 独立需求条，充满之后在 AP 里抬杠；
         现在它只有「影响恢复速度」这一条作用，因果跟《大多数》一样自洽。
         （它同时参与下面的心态公式，但那是 mentalOf 内部的事 ——
           这里刻意不再收集一份"参与心态的字段清单"，
           那种清单每多一份，就多一个会漂移的地方。） */
      const fatigueRaw = needs && typeof needs.fatigue === "number" ? needs.fatigue : null;
      if (fatigueRaw != null) {
        fatigueRow.textContent = `疲劳系数 ${Math.round(clamp01(fatigueRaw))} · 影响恢复速度`;
        fatigueRow.style.display = "block";
      } else {
        fatigueRow.style.display = "none";
      }

      /* 心态（派生生命线）——《大多数》的组织方式：它不是一项独立数值，
         而是综合生理值。玩家一眼看到整体状态；任一项极低都会把它拉下来，
         于是「该去解决什么」自己浮现出来，不需要额外堆提示系统。 */
      const mental = mentalOf(needs, status);
      if (mental != null) applyRow(mentalRow, mental, false);
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
