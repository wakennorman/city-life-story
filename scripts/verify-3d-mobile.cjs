/**
 * 3D-first 移动端验收 —— 手机视口下外壳还能不能用
 *
 * ── 为什么必须单独有这一个 ──────────────────────────────────────────────
 *   verify-3d-first.cjs 固定 1440×900（桌面）。HUD 是**绝对定位 + 固定 px 宽**
 *   拼出来的，窄屏规则只有 `@media (max-width: 720px)` 那几行。
 *   「算一算觉得没重叠」不算验收 —— 移动端的失效形态是
 *   **元素互相压住 / 跑出视口 / 点不到**，全都不报错。
 *
 * ── 断言的取法 ──────────────────────────────────────────────────────────
 *   ① 硬约束（一定不能违反）：canvas == 视口、无滚动溢出、可见元素都在视口内
 *   ② 重叠：只对**明确不该压住**的几对做断言（见 MUST_NOT_OVERLAP）
 *      —— 其余重叠（如 toast 浮在需求条上）是设计意图，只报告不断言
 *   ③ 触摸：tap 一条「前往 X」，断言 state 真的变（与桌面同一条链路）
 *   ④ 触控契约：≤768px 时 3D 浮层按钮 ≥44px（见 TAP_TARGETS）。
 *      这一条锁的是「style.css 的全局 HIG 规则会伸进 3D 浮层」这件事 ——
 *      本层现在自己声明尺寸，所以断言测的是本层的声明。
 *   ⑤ 不被祖先 overflow 裁切。尺寸对、位置对、不重叠，但下半截看不见 ——
 *      上面每一条都会放它过去，必须单独量。
 *   ⑥ 触摸链路：**先展开托盘**再点「前往 X」。收起态下行动按钮是 display:none，
 *      不先展开就会拿到 0×0 的按钮、把"没点到东西"误报成"触摸坏了"。
 *   ⑪⑫⑭ 托盘交互：触摸展开生效（类）+ **展开后真的变高** + 按钮文案与托盘状态同向
 *      （文案在 HTML 里写死过一份，首屏会与状态相反；
 *        "类加上了但高度没变"是更隐蔽的一种：只断言类就抓不到）。
 *      ⚠️ 这几条必须**等过渡走完**再读 —— 本环境 WebGL 走软件渲染，帧率极低，
 *         CSS transition 只在出帧时推进，220ms 的过渡实测要 ~1.8s 墙钟。
 *         固定 sleep 会读到"过渡刚开始"的状态。
 *   ⑬ 探针瞄准校验：tap 之前用 elementFromPoint 确认这个点上最顶层的就是目标按钮。
 *      scrollIntoView 之后再读 rect 可能读到滚动前的值 → 瞄偏到邻居按钮，
 *      而"点错了按钮"会被读成"触摸链路坏了"。探针必须先证明自己瞄得准。
 *
 * 调试用法：ONLY_DEVICE=iphone-portrait node scripts/verify-3d-mobile.cjs
 *   —— 只跑一档，做反向可证伪（把被测改动撤掉，确认对应断言真的会红）。
 *
 *   设备档位含 **768（HIG 断点边界本身）**：断点不一致造成的空档只出现在
 *   边界附近，不把边界列进来就永远测不到。
 *
 * 用法：node scripts/verify-3d-mobile.cjs
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { ensureServer, closeServer } = require("./lib/serve.cjs");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "dev/_3dtest/shots-mobile");
const PORT = 8975;
const DOC = "/src/index.html?mode=3d";
const URL = `http://127.0.0.1:${PORT}${DOC}`;
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* 设备档位。注意 844×390 是**横屏** —— 844 > 768，不匹配窄屏断点，
   所以它是"没被 @media 覆盖到的窄屏"，最容易出问题的一档。
   768 这一档是**断点边界本身**：style.css 的 HIG 规则挂在 768，
   本层布局原先挂在 720 → 721~768 是"按钮已变高、布局还是桌面值"的空档。
   把边界本身列进来，空档就不会再悄悄出现。 */
const DEVICES = [
  { name: "iphone-portrait", w: 390, h: 844, dpr: 3, desc: "iPhone 14 竖屏（匹配窄屏断点）" },
  { name: "iphone-landscape", w: 844, h: 390, dpr: 3, desc: "iPhone 14 横屏（**不**匹配窄屏断点）" },
  { name: "android-small", w: 360, h: 640, dpr: 2, desc: "小屏安卓竖屏" },
  { name: "ipad-portrait", w: 768, h: 1024, dpr: 2, desc: "iPad 竖屏 = HIG 断点边界（空档区上沿）" },
];

/* 触控契约：≤768px 时 3D 浮层的按钮必须 ≥44px（Apple HIG）。
   它同时是「style.css 的全局 HIG 规则会伸进 3D 浮层」这件事的**显式锚点** ——
   本层现在自己声明这个尺寸，所以这条断言测的是本层的声明，不是外部规则。 */
const TAP_TARGETS = [".s3-first-exit", ".s3h-tray-toggle"];
const TAP_MIN = 44;
const NARROW_MAX = 768;

/* 明确不该互相压住的元素对。名字用 CSS 类名，脚本自己找 rect。
   其它重叠只报告 —— 有些是设计意图（toast 浮层压在需求条上是想要的效果）。 */
const MUST_NOT_OVERLAP = [
  [".s3h-ap", ".s3h-tray", "行动力条 与 行动托盘（都在左下/右下，最易撞）"],
  [".s3-first-exit", ".s3h-vitals", "退出按钮 与 需求条"],
  [".s3-first-exit", ".s3h-top", "退出按钮 与 顶栏"],
  /* 两者都是"贴底浮层"：按键条居中、托盘右下，原先各写各的底边
     （托盘 bottom:20 / 按键条 bottom:4+高18=22）→ **恒定重叠 1px**，
     与视口尺寸无关，桌面同样有（当时误记成"仅横屏"）。已改为由按键条占的带推导。 */
  [".s3h-tray", ".s3h-keys", "行动托盘 与 按键条（都贴底，原先恒定重叠 1px）"],
];

let pass = 0, fail = 0;
const check = (name, ok, detail) => {
  console.log(`  ${ok ? "✅" : "❌"} ${name}${detail ? "  → " + detail : ""}`);
  ok ? pass++ : fail++;
};

/** 在页面里量所有可见 .s3h-* / .s3-first-exit 的矩形，并算两两重叠 */
function measure() {
  const SEL = ".s3h-top, .s3h-vitals, .s3h-ap, .s3h-tray, .s3h-tray-head, .s3h-tray-toggle, .s3h-prompt, .s3h-keys, .s3h-toast-wrap, .s3-first-exit, .s3h-map";
  const els = Array.from(document.querySelectorAll(SEL));
  const rects = [];
  for (const el of els) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    rects.push({
      el,
      cls: "." + (el.className || "").split(" ")[0],
      x: Math.round(r.left), y: Math.round(r.top),
      w: Math.round(r.width), h: Math.round(r.height),
      right: Math.round(r.right), bottom: Math.round(r.bottom),
    });
  }
  const ov = [];
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i], b = rects[j];
      /* ★ 跳过**父子包含**：容器与它自己的子元素当然"重叠"，
         那不是缺陷，是 DOM 结构。不排除的话每轮都会多出 4 行噪声
         （实测 .s3h-tray×.s3h-tray-head / ×.s3h-tray-toggle 各 2 条），
         而噪声正是让真信号被忽略的方式。 */
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const ox = Math.min(a.right, b.right) - Math.max(a.x, b.x);
      const oy = Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y);
      if (ox > 0 && oy > 0) ov.push({ a: a.cls, b: b.cls, ox: Math.round(ox), oy: Math.round(oy) });
    }
  }
  /* ★ 被祖先 overflow 裁掉多少 —— 必须分**两层**看：
       ① 盒子被切（可能只切 padding）—— 观感问题，不是缺陷
       ② **内容被切**（子元素也跟着出去了）—— 真缺陷，"下半截看不见"

     ★ 为什么要分两层（这是本仪器自己的一个盲区，实测踩到）：
       原先只检查 `.s3h-tray-toggle` 有没有被裁 → 报"无裁切"。
       但真正被裁的是 `.s3h-tray-head`（收起态写死 max-height:38px，
       而头部自然高 41px）→ 底部 padding 被切 4px。
       被查的那个元素恰好完整可见，于是**断言一直绿**。
       判据换成"内容有没有被切"之后，两类都能覆盖：
       子元素被切 ⇒ 父元素进 badCut；只切 padding ⇒ 只进报告。

     ★★ 裁切边界是 **padding box，不是 border box**（本仪器第二个盲区）：
       CSS 规范规定 `overflow: hidden` 把内容裁到 **padding edge**（边框内侧）。
       而原先取的是 `p.getBoundingClientRect()` —— 那是 **border box**，
       于是**少算一个边框宽**。`.s3h-tray` 有 `border: 1px` →
       真实的 2px 裁切被读成 1px，再撞上下面 `<= 1` 的容差 → 读成 0。
       **两个盲区叠加，把一个真实存在的裁切消成了"没问题"。**
       （2026-09-18 由线上读数 `.s3h-tray@146,766 236×62` /
         `.s3h-tray-head@147,767 234×62` 的 1px 越界反查出来的。） */
  const clipAmt = (el, lim) => {
    const r = el.getBoundingClientRect();
    return { top: Math.max(0, lim.top - r.top), bottom: Math.max(0, r.bottom - lim.bottom) };
  };
  const clipped = [];
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    let p = el.parentElement, lim = null;
    while (p && p !== document.documentElement) {
      const ps = getComputedStyle(p);
      if (ps.overflow !== "visible" || ps.overflowX !== "visible" || ps.overflowY !== "visible") {
        const pr = p.getBoundingClientRect();
        const bT = parseFloat(ps.borderTopWidth) || 0;
        const bB = parseFloat(ps.borderBottomWidth) || 0;
        lim = {
          cls: "." + String(p.className || "").split(" ")[0],
          top: pr.top + bT, bottom: pr.bottom - bB,   /* ← padding box（规范口径） */
        };
        break;
      }
      p = p.parentElement;
    }
    if (!lim) continue;
    const cut = clipAmt(el, lim);
    if (cut.top + cut.bottom <= 1) continue;
    /* 它的后代有没有跟着被切 —— 有 = 真的切到了内容 */
    const contentCut = [];
    for (const d of el.querySelectorAll("*")) {
      const dr = d.getBoundingClientRect();
      if (dr.width < 1 || dr.height < 1) continue;
      const dc = clipAmt(d, lim);
      if (dc.top + dc.bottom > 1) {
        contentCut.push("." + String(d.className || "").split(" ")[0]
          + ` 上${Math.round(dc.top)}/下${Math.round(dc.bottom)}`);
      }
    }
    clipped.push({
      cls: "." + String(el.className || "").split(" ")[0], by: lim.cls,
      cutTop: Math.round(cut.top), cutBottom: Math.round(cut.bottom),
      contentCut,
    });
  }
  const de = document.documentElement;
  const host = document.getElementById("scene3d-first");
  const cv = host && host.querySelector("canvas");
  const cs = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    return { top: s.top, right: s.right, left: s.left, bottom: s.bottom, width: s.width };
  };
  /* 触控目标实测高度（契约断言用） */
  const tap = {};
  for (const sel of [".s3-first-exit", ".s3h-tray-toggle"]) {
    const el = document.querySelector(sel);
    tap[sel] = el ? Math.round(el.getBoundingClientRect().height) : null;
  }
  return {
    vw: window.innerWidth, vh: window.innerHeight,
    narrowMQ: window.matchMedia("(max-width: " + 768 + "px)").matches,
    computed: { exit: cs(".s3-first-exit"), vitals: cs(".s3h-vitals"), ap: cs(".s3h-ap"), tray: cs(".s3h-tray") },
    tap,
    canvas: cv ? { w: cv.clientWidth, h: cv.clientHeight, bw: cv.width, bh: cv.height } : null,
    scrollW: de.scrollWidth, scrollH: de.scrollHeight,
    hostScrollW: host ? host.scrollWidth : null,
    hostScrollH: host ? host.scrollHeight : null,
    rects, overlaps: ov, clipped,
  };
}

/** 读瞄准信息（可反复调用 —— 用来轮询到滚动落地） */
function readAim() {
  const b = document.querySelector('[data-probe-aim="1"]');
  if (!b) return { err: "记号丢失（列表被重渲染）" };
  const r = b.getBoundingClientRect();
  const x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
  const top = document.elementFromPoint(x, y);
  /* 托盘体到底能不能滚？这决定"手机上一屏放不下的行动还能不能点到" ——
     如果 .s3h-tray-body 不是滚动容器（flex 子项 min-height:auto 的经典坑），
     多出来的行动会被 .s3h-tray 的 overflow:hidden 直接裁掉、永远够不着。 */
  const body = document.querySelector(".s3h-tray-body");
  const tray = document.querySelector(".s3h-tray");
  const br = body.getBoundingClientRect(), trr = tray.getBoundingClientRect();
  return {
    x, y,
    rect: `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}×${Math.round(r.height)}`,
    hit: !!(top && (top === b || b.contains(top))),
    topTag: top ? `${top.tagName}.${String(top.className || "").split(" ")[0]}` : "null",
    fullyVisible: r.top >= br.top - 1 && r.bottom <= br.bottom + 1,
    actCount: document.querySelectorAll(".s3h-act").length,
    /* ★ 托盘为什么从"展开"变回收起？两种可能必须分开：
         (a) 同一个节点上的 `is-open` 类被摘掉了
         (b) 节点被**重建**了（新节点天生没有 is-open）
       只有区分开，才知道该去查"谁摘了类"还是"谁重建了 HUD"。 */
    open: tray.classList.contains("is-open"),
    sameNode: tray === window.__trayAtFound,
    openAtFound: window.__trayAtFoundOpen === undefined ? null : window.__trayAtFoundOpen,
    trayCount: document.querySelectorAll(".s3h-tray").length,
    /* 展开态却没变高 ⇒ 得知道是谁在压高度：内联样式？还是计算出的 max-height 就不对？ */
    cls: tray.className,
    trayInline: tray.getAttribute("style"),
    trayMaxH: getComputedStyle(tray).maxHeight,
    bodyDisplay: getComputedStyle(body).display,
    bodyInline: body.getAttribute("style"),
    headH: (() => { const h = document.querySelector(".s3h-tray-head"); return h ? Math.round(h.getBoundingClientRect().height) : null; })(),
    toggleH: (() => { const g = document.querySelector(".s3h-tray-toggle"); return g ? Math.round(g.getBoundingClientRect().height) : null; })(),
    body: {
      top: Math.round(br.top), bottom: Math.round(br.bottom), h: Math.round(br.height),
      clientH: body.clientHeight, scrollH: body.scrollHeight, scrollTop: Math.round(body.scrollTop),
      overflowY: getComputedStyle(body).overflowY, minH: getComputedStyle(body).minHeight,
    },
    tray: { top: Math.round(trr.top), bottom: Math.round(trr.bottom), h: Math.round(trr.height), scrollH: tray.scrollHeight },
    vh: window.innerHeight,
  };
}

async function runDevice(browser, dev) {
  console.log(`\n════ ${dev.name}  ${dev.w}×${dev.h} @${dev.dpr}x  —— ${dev.desc} ════`);
  const page = await browser.newPage();
  await page.setViewport({
    width: dev.w, height: dev.h, deviceScaleFactor: dev.dpr,
    isMobile: true, hasTouch: true,
  });

  const errors = [];
  const noise = [];
  page.on("pageerror", (e) => errors.push("[pageerror] " + String(e.message).slice(0, 140)));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/Failed to load resource/i.test(t)) return;
    if (/CORS policy|Access-Control-Allow-Origin/i.test(t)) { noise.push(t.slice(0, 80)); return; }
    errors.push("[console] " + t.slice(0, 140));
  });

  await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 });

  /* 与 verify-3d-first 同一条前置条件：真实玩家会在欢迎页停留，
     而自动挂载的等待**没有放弃上限**（07f10db2 修），所以先等 8 秒再开局，
     顺带把「等太久也不失效」这件事在移动端也覆盖一遍。 */
  for (let i = 0; i < 100; i++) {
    if (await page.evaluate(() => typeof window.startNewGame === "function")) break;
    await sleep(200);
  }
  await sleep(8000);
  await page.evaluate(() => { try { window.startNewGame(); } catch (e) {} });

  let mounted = false;
  for (let i = 0; i < 80 && !mounted; i++) {
    mounted = await page.evaluate(() => !!(window.Scene3DBridge
      && window.Scene3DBridge.first && window.Scene3DBridge.first.active));
    if (!mounted) await sleep(250);
  }
  check(`① [${dev.name}] 移动端视口下 3D-first 挂载成功`, mounted);
  if (!mounted) { await page.close(); return; }
  await sleep(2500);   // 等首帧 + HUD 首次 refresh

  /* 清掉开场模态遮罩（与 verify-3d-first 同一处置：那是场景构造，不是被测对象） */
  const cleared = await page.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll("body > *")) {
      const z = parseInt(getComputedStyle(el).zIndex, 10);
      if (Number.isFinite(z) && z >= 9000 && el.id !== "scene3d-first"
          && getComputedStyle(el).display !== "none") { el.style.display = "none"; n++; }
    }
    return n;
  });
  if (cleared) console.log(`  ℹ️  已隐藏开场模态遮罩 ${cleared} 层`);

  /* ── A. 几何 ── */
  const m = await page.evaluate(measure);

  console.log(`  ℹ️  innerWidth=${m.vw} · matchMedia(max-width:720px)=${m.narrowMQ}`);
  console.log("  ℹ️  矩形：" + m.rects.map((r) => `${r.cls}@${r.x},${r.y} ${r.w}×${r.h}`).join("  "));
  console.log("  ℹ️  计算样式：" + Object.entries(m.computed)
    .map(([k, v]) => `${k}${v ? `{top:${v.top},right:${v.right},w:${v.width}}` : "=无"}`).join("  "));

  check(`② [${dev.name}] canvas 铺满视口`,
    !!m.canvas && m.canvas.w === m.vw && m.canvas.h === m.vh,
    m.canvas ? `canvas ${m.canvas.w}×${m.canvas.h} vs 视口 ${m.vw}×${m.vh}` : "无 canvas");

  check(`③ [${dev.name}] 页面无滚动溢出`,
    m.scrollW <= m.vw + 1 && m.scrollH <= m.vh + 1,
    `scroll ${m.scrollW}×${m.scrollH} vs 视口 ${m.vw}×${m.vh}`);

  const out = m.rects.filter((r) => r.x < -1 || r.y < -1 || r.right > m.vw + 1 || r.bottom > m.vh + 1);
  check(`④ [${dev.name}] HUD 可见元素全部在视口内`, out.length === 0,
    out.length ? out.map((r) => `${r.cls}(${r.x},${r.y},${r.w}×${r.h})`).join(" ") : `${m.rects.length} 个元素`);

  /* ── B. 必须不重叠的几对 ── */
  for (const [a, b, why] of MUST_NOT_OVERLAP) {
    const hit = m.overlaps.find((o) =>
      (o.a === a && o.b === b) || (o.a === b && o.b === a));
    check(`⑤ [${dev.name}] ${why} 不重叠`, !hit,
      hit ? `重叠 ${hit.ox}×${hit.oy}px` : "");
  }

  /* ── B2. 触控契约：≤768px 时 3D 浮层按钮必须 ≥44px ── */
  if (m.narrowMQ) {
    const bad = TAP_TARGETS.filter((s) => m.tap[s] !== null && m.tap[s] < TAP_MIN);
    check(`⑨ [${dev.name}] 3D 浮层触控目标 ≥${TAP_MIN}px`, bad.length === 0,
      TAP_TARGETS.map((s) => `${s}=${m.tap[s] === null ? "无" : m.tap[s] + "px"}`).join(" ")
      + (bad.length ? `  ← ${bad.join(" , ")} 不达标` : ""));
  } else {
    console.log(`  ℹ️  ⑨ 跳过触控契约（视口 ${m.vw} > ${NARROW_MAX}，鼠标档）`);
  }

  /* ── B3. 被祖先 overflow 裁切 ──
     这一类失效在上面所有断言里都是"通过"的：尺寸对、位置对、不重叠，
     只是下半截看不见。必须单独量。
     ★ 断言落在「**内容**有没有被切」上，不是「盒子有没有被切」：
       盒子被切但子元素全在（只切了 padding）不是缺陷；子元素也被切才是真缺陷。
       原先只查一个写死的元素（`.s3h-tray-toggle`），而真正被切的是它的邻居
       `.s3h-tray-head` → 断言恒绿、报告说"无裁切"，实际有 4px 被切。 */
  const badCut = m.clipped.filter((c) => c.contentCut.length > 0);
  const padOnly = m.clipped.filter((c) => c.contentCut.length === 0);
  check(`⑩ [${dev.name}] 被裁元素的内容完整可见`, badCut.length === 0,
    badCut.length
      ? badCut.map((c) => `${c.cls} 被 ${c.by} 切 上${c.cutTop}/下${c.cutBottom}，**内容也被切**：${c.contentCut.join(" , ")}`).join(" | ")
      : (padOnly.length
        ? `${padOnly.length} 处只切到 padding（内容完整）：` +
          padOnly.map((c) => `${c.cls} 上${c.cutTop}/下${c.cutBottom}`).join(" / ")
        : "无裁切"));

  /* ⑩-b：收起态托盘的头部**整体**不被裁 —— 只切 padding 也不算通过。
     ★ 为什么要单独一条：切 padding 不影响可用性，所以 ⑩ 会放它过去
       （⑩ 的判据是"内容完整可见"，而内容确实完整）。
       但它正是"两个本该同源的数字各写各的"这个味道的复发点：
       头部高度由内容撑（41px），收起态写死 38px → 差 3px 就靠切 padding 抹平。
       本层现在用 `--s3h-tray-head` 让两者同源，这条断言就是那个契约的守卫。 */
  const headCut = m.clipped.filter((c) => c.cls === ".s3h-tray-head");
  check(`⑩-b [${dev.name}] 收起态托盘头部不被祖先裁切`, headCut.length === 0,
    headCut.length
      ? headCut.map((c) => `${c.cls} 被 ${c.by} 切 上${c.cutTop}/下${c.cutBottom}px`).join(" | ")
      : "头部完整（高度与收起态同源）");

  /* ── C. 报告所有重叠（不断言 —— 有些是设计意图） ── */
  if (m.overlaps.length) {
    console.log("  ℹ️  其余重叠（仅报告）：" +
      m.overlaps.map((o) => `${o.a}×${o.b} ${o.ox}×${o.oy}`).join(" / "));
  }

  /* ── D. 触摸：**先展开托盘**（真实玩家必须做这一步），再 tap 一条「前往 X」 ── */
  /* ★ 为什么必须先展开：`.s3h-tray:not(.is-open) .s3h-tray-body { display: none }`
     —— 收起态下行动按钮**根本没被渲染**，getBoundingClientRect() 全是 0，
     tap 会落在 (0,0)。脚本若上来就找 .s3h-act，会拿到一个 0×0 的按钮，
     再把"没点到东西"报成"触摸链路坏了"（第一轮就是这么误报的）。 */
  const tray0 = await page.evaluate(() => {
    const t = document.querySelector(".s3h-tray");
    const b = document.querySelector(".s3h-tray-toggle");
    const r = b.getBoundingClientRect();
    return {
      open: t.classList.contains("is-open"), label: (b.textContent || "").trim(),
      h: Math.round(t.getBoundingClientRect().height),
      x: r.left + r.width / 2, y: r.top + r.height / 2, w: Math.round(r.width), h2: Math.round(r.height),
    };
  });
  await page.touchscreen.tap(Math.round(tray0.x), Math.round(tray0.y));
  /* ★★ 不能只 sleep 一个固定值 —— 这是本项目反复栽的「喂得太快」（模式 16-b）。
     这个环境里 WebGL 走**软件渲染**（swiftshader），帧率极低，而 CSS transition
     只在出帧时推进：`.s3h-tray` 那条 220ms 的 `max-height` 过渡，实测要 ~1.8s
     墙钟才走完（`getAnimations()` 显示它长时间停在 `currentTime: 0`）。
     sleep 800ms 会读到"过渡刚开始"的状态：托盘还是 62px，于是此后所有几何
     读数都建立在一个**没展开的托盘**上（第一版就是如此，⑥ 只能靠
     scrollIntoView 把按钮挤进 8px 的缝里才侥幸点到）。
     判据：轮询到高度连续两次一致**且没有运行中的过渡**为止。 */
  let tray1 = null, prevH = -1;
  for (let i = 0; i < 40; i++) {
    await sleep(150);
    tray1 = await page.evaluate(() => {
      const t = document.querySelector(".s3h-tray");
      const b = document.querySelector(".s3h-tray-toggle");
      return {
        open: t.classList.contains("is-open"), label: (b.textContent || "").trim(),
        h: Math.round(t.getBoundingClientRect().height),
        anims: t.getAnimations ? t.getAnimations().length : 0,
      };
    });
    if (tray1.h === prevH && tray1.anims === 0) break;
    prevH = tray1.h;
  }
  check(`⑪ [${dev.name}] 触摸展开托盘生效（is-open 类被加上）`,
    tray0.open === false && tray1.open === true,
    `初始 ${tray0.open ? "展开" : "收起"} → 点击后 ${tray1.open ? "展开" : "收起"}`);
  /* ★ 类加上了 ≠ 托盘真的变高。只断言"类在"的话，一条被压住 max-height 的
     托盘照样能通过 —— 而"点了展开却什么都没展开"正是最该抓的静默失效。
     这里直接量高度：收起态只有头部（~62px），展开态必须显著更高。 */
  check(`⑭ [${dev.name}] 展开后托盘真的变高（不只是加了个类）`,
    tray1.h > tray0.h + 40,
    `收起 ${tray0.h}px → 展开 ${tray1.h}px（过渡已结束 anims=${tray1.anims}）`);
  /* 文案与状态必须同向：hud.js 的 toggleTray 里是由状态推出文案，
     但 HTML 里也写死过一份 —— 写死的那份在首屏会与状态相反（实测）。 */
  check(`⑫ [${dev.name}] 托盘按钮文案与托盘状态一致`,
    tray0.label === (tray0.open ? "收起" : "展开") && tray1.label === (tray1.open ? "收起" : "展开"),
    `初始 "${tray0.label}"(open=${tray0.open}) → 展开后 "${tray1.label}"(open=${tray1.open})`);

  const before = await page.evaluate(() => {
    const st = window.StateManager.getState();
    return { loc: st.trade.currentLocation, ap: st.player.actionPoints };
  });
  /* ★ 只挑**可点**的那条：hud.js 给不可用的行动加了 `disabled` 属性
     （`${a.disabled ? "disabled" : ""}`），点到它身上 tap 是空操作，
     会把「探针选错按钮」误报成「触摸链路坏了」。
     同时要求 rect 有面积 —— 否则拿到的是没渲染的隐藏按钮。 */
  /* ── 第一步：选中一条**可点且有面积**的「前往 X」，只负责滚动 ── */
  /* ★ 只挑可点的：hud.js 给不可用的行动加了 `disabled` 属性
     （`${a.disabled ? "disabled" : ""}`），点到它身上是空操作。
     同时要求 rect 有面积 —— 否则拿到的是没渲染的隐藏按钮。 */
  const found = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll(".s3h-act"));
    const all = btns.map((x) => {
      const r = x.getBoundingClientRect();
      return {
        t: (x.textContent || "").trim().replace(/\s+/g, " ").slice(0, 20),
        dis: x.disabled === true || x.classList.contains("is-off"),
        box: `${Math.round(r.width)}×${Math.round(r.height)}`,
      };
    });
    const b = btns.find((x) => {
      if (x.disabled === true || x.classList.contains("is-off")) return false;
      const r = x.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return false;
      return (x.textContent || "").includes("前往");
    });
    if (!b) return { none: true, all };
    b.dataset.probeAim = "1";                 // 打个记号，下一步按记号找同一个按钮
    window.__trayAtFound = document.querySelector(".s3h-tray");
    window.__trayAtFoundOpen = window.__trayAtFound.classList.contains("is-open");
    b.scrollIntoView({ block: "center" });
    return { name: (b.textContent || "").trim().replace(/\s+/g, " ").slice(0, 24), all };
  });

  if (!found || found.none) {
    check(`⑥ [${dev.name}] 触摸点击「前往 X」生效`, false,
      "托盘里没有**可点且有面积**的「前往」行动："
      + ((found && found.all) || []).map((a) => `${a.t}${a.dis ? "(禁用)" : ""}[${a.box}]`).join(" / "));
  } else {
    /* ── 第二步：**等滚动真正落地**，再读坐标，并用 elementFromPoint 校验瞄准 ──
       ★★ 为什么不能读一次就完事：`scrollIntoView` 引发的滚动是**异步落地**的
          （实测同一帧读到的还是滚动前的矩形：scrollTop 0→518，按钮 y 796→480）。
          读到旧坐标 → tap 落在旁边那个按钮上 → 四档设备读到的文案都是
          「前往 批发市场」，点完却分别去了 park / bank / internet_cafe。
          **"文案与结果不符"就是瞄偏的指纹。**
       ★ 也不能只 sleep 一个固定值 —— 那正是本项目栽过的「喂得太快」（模式 16-b）。
         这里轮询到矩形连续两次一致为止：滚动真的停了才读。 */
    let aim = null, prevRect = "";
    for (let i = 0; i < 30; i++) {
      await sleep(100);
      aim = await page.evaluate(readAim);
      const key = aim && aim.rect;
      if (!key || key === prevRect) break;
      prevRect = key;
    }
    check(`⑬ [${dev.name}] 探针瞄准校验（elementFromPoint 命中目标按钮）`,
      !!aim && aim.hit === true,
      aim && aim.err ? aim.err : `点(${aim.x},${aim.y}) 矩形 ${aim.rect} 命中 ${aim.topTag}`);
    if (aim && aim.body) {
      console.log(`  ℹ️  托盘体：${aim.body.top}..${aim.body.bottom} (h=${aim.body.h}) clientH=${aim.body.clientH} scrollH=${aim.body.scrollH} scrollTop=${aim.body.scrollTop} overflowY=${aim.body.overflowY} minH=${aim.body.minH}`);
      console.log(`  ℹ️  托盘：${aim.tray.top}..${aim.tray.bottom} (h=${aim.tray.h}) scrollH=${aim.tray.scrollH} · 行动数=${aim.actCount} · 目标完整可见=${aim.fullyVisible} · 视口高=${aim.vh}`);
      console.log(`  ℹ️  托盘状态：现在 open=${aim.open} · 选中时 open=${aim.openAtFound} · 同一节点=${aim.sameNode} · .s3h-tray 个数=${aim.trayCount}`);
      console.log(`  ℹ️  谁在压高度：cls="${aim.cls}" inline="${aim.trayInline}" maxH=${aim.trayMaxH} · head=${aim.headH} toggle=${aim.toggleH} · body.display=${aim.bodyDisplay} body.inline="${aim.bodyInline}"`);
    }

    if (!aim || !aim.hit) {
      /* 探针没瞄准 ⇒ ⑥ 的结论不可信，**不冒充"触摸坏了"** */
      check(`⑥ [${dev.name}] 触摸点击「前往 X」生效`, false,
        `未执行：探针未瞄准目标（命中 ${aim ? aim.topTag : "?"}），⑥ 的结论不可信`);
    } else {
      await page.touchscreen.tap(aim.x, aim.y);
      await sleep(1800);
      const after = await page.evaluate(() => {
        const st = window.StateManager.getState();
        return { loc: st.trade.currentLocation, ap: st.player.actionPoints };
      });
      check(`⑥ [${dev.name}] 触摸点击「前往 X」生效（${found.name}）`,
        after.loc !== before.loc && after.ap < before.ap,
        `${before.loc}(${before.ap}) → ${after.loc}(${after.ap})`);
    }
  }

  /* ── E. 渲染在跑 ── */
  /* ★ 字段名是 `tris`（shell.js 的 debug getter），不是 `triangles`。
     写成 `d.triangles` 会恒为 undefined → 断言恒假 → 把「探针读错字段」
     报成「渲染没跑」。 */
  const dbg = await page.evaluate(() => {
    const d = window.Scene3DBridge.first.debug;
    return d ? { tris: d.tris, calls: d.calls, fps: d.fps } : null;
  });
  check(`⑦ [${dev.name}] 渲染在跑（有三角形输出）`,
    !!dbg && Number(dbg.tris) > 1000, dbg ? `tris=${dbg.tris} calls=${dbg.calls}` : "无 debug");

  check(`⑧ [${dev.name}] 无本地页面报错`, errors.length === 0,
    errors.length ? errors.slice(0, 3).join(" | ") : (noise.length ? `（噪声 ${noise.length} 条）` : ""));

  const shot = path.join(OUT, `mobile-${dev.name}.png`);
  await page.screenshot({ path: shot });
  console.log(`  📸 ${path.relative(ROOT, shot)}`);

  await page.close();
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  console.log("▶ 重建 src/js/scene3d.bundle.js …");
  execFileSync(process.execPath,
    [path.join(__dirname, "build-3d-bundle.cjs"), "--out", "src/js/scene3d.bundle.js"],
    { cwd: ROOT, stdio: "inherit" });

  const own = await ensureServer({ root: ROOT, port: PORT, label: "3D-first 移动端" });

  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage",
      "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });

  try {
    const only = process.env.ONLY_DEVICE;
    const devs = only ? DEVICES.filter((d) => d.name === only) : DEVICES;
    if (only && !devs.length) {
      console.error(`ONLY_DEVICE=${only} 没有匹配的档位。可选：${DEVICES.map((d) => d.name).join(" / ")}`);
      process.exit(2);
    }
    for (const dev of devs) await runDevice(browser, dev);
  } finally {
    await browser.close();
    if (own) closeServer(own);
  }

  console.log(`\n${fail === 0 ? "✅" : "❌"} 3D-first 移动端：${pass} 通过 / ${fail} 失败`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => { console.error("脚本自身出错：", e); process.exit(2); });
