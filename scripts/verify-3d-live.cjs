/**
 * 线上移动端功能级复验（L3-b）—— `npm run verify:3d-live`
 *
 * ── 为什么必须有这一层 ────────────────────────────────────────────────
 *   L3-a（产物 md5）只证明"文件换成了本地这一份"，**不证明移动端真的能用**。
 *   本地/CI 跑的是 src/，线上跑的是 dist/ —— 构建、部署、CDN 任何一环都可能
 *   让两者不同。四层交付链路（工作树/提交/远程/门禁）不能互相推断，
 *   L3-a 与 L3-b 也不能。
 *
 * ── 为什么不在本地跑一遍就完事 ────────────────────────────────────────
 *   §64 修的 4 个缺陷全是**几何**问题（元素互相压住 / 被祖先裁掉）。
 *   几何依赖：真实视口尺寸 × 真实字体 × 真实生效的 CSS 规则。
 *   dist/index.html 是构建产物，CSS 内联在里面 —— 构建有没有把
 *   scene3d.css 的那几条断点规则带进去，只有打开线上页面才知道。
 *
 * ── 与另外两件仪器的分工 ──────────────────────────────────────────────
 *   | 脚本                        | 测什么                        | 局限             |
 *   |-----------------------------|-------------------------------|------------------|
 *   | verify-3d-mobile.cjs        | 本地 4 档设备 × 15 断言       | 测不到断点空档   |
 *   | verify-3d-hud-geometry.cjs  | 本地 14 档**宽度扫描**        | 只测几何         |
 *   | **verify-3d-live.cjs**（本）| **线上** 2 档 × 10 断言       | 需网络，手动跑   |
 *
 *   ⚠️ 本脚本**不进 CI** —— 它依赖"线上已部署"这一外部前提，
 *      在 CI 里跑会变成"部署没完成就判红"的假失败。
 *      它是**部署之后**的手动一步，与 `verify:deploy` 同类。
 *
 * ⚠️ 线上要拉 17.8MB 的 app.js（实测 ~130s），超时必须给足。
 *    用 curl 手工抓产物时同理 —— 超时不足会**静默截断**，
 *    然后表现为"页面功能缺失"，把仪器问题报成线上缺陷。
 *
 * 用法：npm run verify:3d-live
 */
const path = require("path");
const puppeteer = require("puppeteer-core");

const ROOT = path.resolve(__dirname, "..");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const URL = "https://wakennorman.github.io/city-life-story/?mode=3d";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const TAP_MIN = 44;

const DEVICES = [
  { name: "iphone-portrait", w: 390, h: 844, dpr: 3 },
  { name: "ipad-portrait", w: 768, h: 1024, dpr: 2 },   // HIG 断点边界本身
];

let pass = 0, fail = 0;
const check = (name, ok, detail) => {
  console.log(`  ${ok ? "✅" : "❌"} ${name}${detail ? "  → " + detail : ""}`);
  ok ? pass++ : fail++;
};

/* 与 verify-3d-mobile.cjs 同一套量法（重叠 / 裁切 / 触控目标）。
   在页面里执行，所以必须是自包含函数。 */
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
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;  // 父子包含不是重叠
      const ox = Math.min(a.right, b.right) - Math.max(a.x, b.x);
      const oy = Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y);
      if (ox > 0 && oy > 0) ov.push({ a: a.cls, b: b.cls, ox: Math.round(ox), oy: Math.round(oy) });
    }
  }
  const clipped = [];
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    let p = el.parentElement, lim = null;
    while (p && p !== document.documentElement) {
      const ps = getComputedStyle(p);
      if (ps.overflow !== "visible" || ps.overflowX !== "visible" || ps.overflowY !== "visible") {
        const pr = p.getBoundingClientRect();
        lim = { cls: "." + String(p.className || "").split(" ")[0], top: pr.top, bottom: pr.bottom };
        break;
      }
      p = p.parentElement;
    }
    if (!lim) continue;
    const cutBottom = Math.max(0, r.bottom - lim.bottom);
    const cutTop = Math.max(0, lim.top - r.top);
    if (cutBottom + cutTop > 1) {
      clipped.push({
        cls: "." + String(el.className || "").split(" ")[0], by: lim.cls,
        cutTop: Math.round(cutTop), cutBottom: Math.round(cutBottom),
      });
    }
  }
  const tap = {};
  for (const sel of [".s3-first-exit", ".s3h-tray-toggle"]) {
    const el = document.querySelector(sel);
    tap[sel] = el ? Math.round(el.getBoundingClientRect().height) : null;
  }
  const de = document.documentElement;
  const host = document.getElementById("scene3d-first");
  const cv = host && host.querySelector("canvas");
  const tray = document.querySelector(".s3h-tray");
  const toggle = document.querySelector(".s3h-tray-toggle");
  return {
    vw: window.innerWidth, vh: window.innerHeight,
    narrow: window.matchMedia("(max-width: 768px)").matches,
    tap, clipped, overlaps: ov,
    rects: rects.map((r) => ({ cls: r.cls, x: r.x, y: r.y, w: r.w, h: r.h })),
    canvas: cv ? { w: cv.clientWidth, h: cv.clientHeight } : null,
    scrollW: de.scrollWidth, scrollH: de.scrollHeight,
    tray: tray ? {
      open: tray.classList.contains("is-open"),
      h: Math.round(tray.getBoundingClientRect().height),
      maxH: getComputedStyle(tray).maxHeight,
      anims: tray.getAnimations ? tray.getAnimations().length : 0,
      label: toggle ? (toggle.textContent || "").trim() : null,
      toggleH: toggle ? Math.round(toggle.getBoundingClientRect().height) : null,
    } : null,
  };
}

const MUST_NOT_OVERLAP = [
  [".s3-first-exit", ".s3h-vitals", "缺陷A 退出按钮 与 需求条"],
  [".s3h-ap", ".s3h-tray", "缺陷C 行动力条 与 行动托盘"],
];

async function runDevice(browser, dev) {
  console.log(`\n── ${dev.name}  ${dev.w}×${dev.h} @${dev.dpr}x ──`);
  const page = await browser.newPage();
  await page.setViewport({
    width: dev.w, height: dev.h, deviceScaleFactor: dev.dpr,
    isMobile: true, hasTouch: true,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push("[pageerror] " + String(e.message).slice(0, 140)));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/Failed to load resource/i.test(t)) return;
    /* ★ 外部 RSS 源（36kr.com/feed）的 CORS 拒绝是**已知噪声**，与本页无关。
       不过滤的话，它会把 ⑨ 顶红 —— 而"报出一个已知噪声"的代价是
       整条断言失去信息量（下次真有 JS 报错时，你已经在忽略这一条了）。 */
    if (/CORS policy|Access-Control-Allow-Origin/i.test(t)) return;
    errors.push("[console] " + t.slice(0, 140));
  });

  try {
    /* 线上要拉 17.8MB 的 app.js（实测 ~130s），超时必须给足 ——
       给不够会**静默截断**，然后表现为"页面功能缺失"，把仪器问题报成线上缺陷。 */
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 180000 });

    for (let i = 0; i < 300; i++) {
      if (await page.evaluate(() => typeof window.startNewGame === "function")) break;
      await sleep(300);
    }
    /* 与本地验收同一条前置：真实玩家会在欢迎页停留，先等 8 秒再开局，
       顺带把「等太久也不失效」在线上也覆盖一遍。 */
    await sleep(8000);
    await page.evaluate(() => { try { window.startNewGame(); } catch (e) {} });

    let mounted = false;
    for (let i = 0; i < 120 && !mounted; i++) {
      mounted = await page.evaluate(() => !!(window.Scene3DBridge
        && window.Scene3DBridge.first && window.Scene3DBridge.first.active));
      if (!mounted) await sleep(400);
    }
    check(`① [${dev.name}] 线上 3D-first 在移动端视口挂载成功`, mounted);
    if (!mounted) return;

    await sleep(3000);

    /* 清掉开场模态遮罩（场景构造，不是被测对象 —— 与本地验收同一处置） */
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

    /* ── 收起态几何 ── */
    const m = await page.evaluate(measure);
    console.log(`  ℹ️  innerWidth=${m.vw} · matchMedia(max-width:768px)=${m.narrow}`);
    console.log("  ℹ️  矩形：" + m.rects.map((r) => `${r.cls}@${r.x},${r.y} ${r.w}×${r.h}`).join("  "));

    check(`② [${dev.name}] canvas 铺满视口`,
      !!m.canvas && m.canvas.w === m.vw && m.canvas.h === m.vh,
      m.canvas ? `canvas ${m.canvas.w}×${m.canvas.h} vs 视口 ${m.vw}×${m.vh}` : "无 canvas");

    for (const [a, b, why] of MUST_NOT_OVERLAP) {
      const hit = m.overlaps.find((o) => (o.a === a && o.b === b) || (o.a === b && o.b === a));
      check(`③ [${dev.name}] ${why} 不重叠`, !hit, hit ? `重叠 ${hit.ox}×${hit.oy}px` : "");
    }

    const cutToggle = m.clipped.filter((c) => c.cls === ".s3h-tray-toggle");
    check(`④ [${dev.name}] 缺陷D 收起态托盘不裁掉收起按钮`, cutToggle.length === 0,
      cutToggle.length ? cutToggle.map((c) => `被 ${c.by} 切 上${c.cutTop}/下${c.cutBottom}px`).join(" | ") : "无裁切");

    check(`⑤ [${dev.name}] 触控目标 ≥${TAP_MIN}px`,
      m.tap[".s3-first-exit"] >= TAP_MIN && m.tap[".s3h-tray-toggle"] >= TAP_MIN,
      `.s3-first-exit=${m.tap[".s3-first-exit"]}px  .s3h-tray-toggle=${m.tap[".s3h-tray-toggle"]}px`);

    /* ── 展开态：先触摸展开，再等过渡真的走完 ──
       ★ 本环境 WebGL 走软件渲染，帧率极低，CSS transition 只在出帧时推进，
         220ms 的过渡实测要 ~1.8s 墙钟。固定 sleep 会读到"过渡刚开始"。 */
    const t0 = m.tray;
    if (t0 && t0.toggleH) {
      const r = await page.evaluate(() => {
        const b = document.querySelector(".s3h-tray-toggle");
        const q = b.getBoundingClientRect();
        return { x: q.left + q.width / 2, y: q.top + q.height / 2 };
      });
      await page.touchscreen.tap(Math.round(r.x), Math.round(r.y));

      let t1 = null, prevH = -1;
      for (let i = 0; i < 60; i++) {
        await sleep(200);
        t1 = await page.evaluate(() => {
          const t = document.querySelector(".s3h-tray");
          const b = document.querySelector(".s3h-tray-toggle");
          return {
            open: t.classList.contains("is-open"),
            h: Math.round(t.getBoundingClientRect().height),
            anims: t.getAnimations ? t.getAnimations().length : 0,
            label: (b.textContent || "").trim(),
          };
        });
        if (t1.h === prevH && t1.anims === 0) break;
        prevH = t1.h;
      }
      check(`⑥ [${dev.name}] 触摸展开托盘生效`, t0.open === false && t1.open === true,
        `初始 ${t0.open ? "展开" : "收起"} → 点击后 ${t1.open ? "展开" : "收起"}`);
      /* 类加上了 ≠ 托盘真的变高 —— 只断言"类在"的话，一条被压住 max-height
         的托盘照样通过，而"点了展开什么都没展开"正是最该抓的静默失效。 */
      check(`⑦ [${dev.name}] 展开后托盘真的变高`, t1.h > t0.h + 40,
        `收起 ${t0.h}px → 展开 ${t1.h}px（maxH ${t0.maxH}，过渡已结束 anims=${t1.anims}）`);
      /* 文案与状态同向（hud.js 首屏曾与状态相反） */
      check(`⑧ [${dev.name}] 托盘文案与状态一致`,
        t0.label === (t0.open ? "收起" : "展开") && t1.label === (t1.open ? "收起" : "展开"),
        `初始 "${t0.label}"(open=${t0.open}) → 展开后 "${t1.label}"(open=${t1.open})`);
    }

    check(`⑨ [${dev.name}] 无 JS 报错`, errors.length === 0, errors.slice(0, 3).join(" | "));
  } finally {
    await page.close();
  }
}

async function main() {
  console.log(`线上移动端功能级复验（L3-b）\n目标：${URL}`);
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-gl=swiftshader"],
  });
  try {
    for (const dev of DEVICES) await runDevice(browser, dev);
  } finally {
    await browser.close();
  }
  console.log(`\n结果：${pass} 通过 / ${fail} 失败`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error("崩了：", e && e.stack || e); process.exit(2); });
