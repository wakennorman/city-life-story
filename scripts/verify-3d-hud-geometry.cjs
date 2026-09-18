/**
 * 3D HUD 几何：**宽度扫描**（断点空档探测器）
 *
 * ── 它和 verify-3d-mobile.cjs 的分工 ────────────────────────────────────────
 *   verify-3d-mobile.cjs  用 4 档**固定设备**跑真实玩家流程（挂载/触摸/渲染），
 *                         是权威判据。
 *   本脚本                 用**连续宽度**跑同一批几何断言，只为回答一个问题：
 *                         「断点边界附近有没有一段没人管？」
 *
 * ── 为什么必须有它（2026-09-18 的真实事故） ────────────────────────────────
 *   style.css 的 HIG 触控规则挂在 `@media (max-width: 768px)`，
 *   而 scene3d.css 的窄屏布局挂在 `@media (max-width: 720px)`。
 *   两条断点不一致 → 721~768px 成了空档：按钮已被顶到 44px、布局还在用桌面值，
 *   于是"退出按钮压住需求条"这同一个缺陷在两个区间各出现一次。
 *   **固定设备列表测不到这个**（390 与 844 都在空档外）—— 只有扫宽度才看得见。
 *
 * ── 为什么跑真实页面而不是复刻页 ───────────────────────────────────────────
 *   复刻页（手写一份 HUD markup）会与 src/app/3d/hud.js 漂移，
 *   于是本脚本会开始测一个"和线上不是同一个东西"的对象。
 *   所以这里直接开真实游戏 `?mode=3d`，跳过 8 秒等待（几何不依赖它）。
 *
 * 用法：node scripts/verify-3d-hud-geometry.cjs
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { ensureServer, closeServer } = require("./lib/serve.cjs");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "dev/_3dtest/hud-geometry");
const PORT = 8978;
const URL = `http://127.0.0.1:${PORT}/src/index.html?mode=3d`;
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* 宽度序列：常规档 + **断点边界本身**（719/720/721 与 767/768/769）。
   边界两侧必须各有一个采样点，否则空档会藏在两点之间。 */
const WIDTHS = [320, 360, 390, 414, 540, 600, 719, 720, 721, 767, 768, 769, 844, 900];
const NARROW_MAX = 768;   // 与 style.css 的 HIG 断点一致
const TAP_MIN = 44;

function measure() {
  const R = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (cs.display === "none") return null;
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, h: r.height };
  };
  const tray = document.querySelector(".s3h-tray");
  const tg = document.querySelector(".s3h-tray-toggle");
  const tr = tray ? tray.getBoundingClientRect() : null;
  const tgr = tg ? tg.getBoundingClientRect() : null;
  return {
    exit: R(".s3-first-exit"), vitals: R(".s3h-vitals"),
    ap: R(".s3h-ap"), tray: R(".s3h-tray"),
    keys: R(".s3h-keys"),
    toggleH: tgr ? Math.round(tgr.height) : null,
    /* ★ 量的必须是「托盘里有没有元素被托盘裁掉」，不是「收起按钮有没有被裁」。
       原先只量 toggle —— 而真正被裁的是 `.s3h-tray-head`（收起态写死
       `max-height: 38px`，而头部自然高 41px）→ 底部 padding 被切 4px；
       toggle 恰好完整可见 → `toggleCut` 恒 0，14 档全报"—"。
       盲区形状与 `verify-3d-mobile.cjs` 的断言⑩**完全一样**：
       **只查一个写死的元素，而缺陷在它的邻居身上。** */
    contentCut: (() => {
      if (!tray || !tr) return null;
      let worst = 0, who = null;
      for (const el of tray.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
        const c = Math.max(0, r.bottom - tr.bottom) + Math.max(0, tr.top - r.top);
        if (c > worst) { worst = c; who = "." + String(el.className || "").split(" ")[0]; }
      }
      return worst > 1 ? { px: Math.round(worst), who } : null;
    })(),
    mounted: !!(window.Scene3DBridge && window.Scene3DBridge.first && window.Scene3DBridge.first.active),
  };
}

async function runWidth(browser, w) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 });
  for (let i = 0; i < 100; i++) {
    if (await page.evaluate(() => typeof window.startNewGame === "function")) break;
    await sleep(200);
  }
  /* 几何不依赖"玩家在欢迎页停留多久"，所以这里不等 8 秒 ——
     那 8 秒是 verify-3d-mobile.cjs 为了跨过旧实现的 5 秒上限而故意加的。 */
  await page.evaluate(() => { try { window.startNewGame(); } catch (e) {} });
  let ok = false;
  for (let i = 0; i < 80 && !ok; i++) {
    ok = await page.evaluate(() => !!(window.Scene3DBridge && window.Scene3DBridge.first && window.Scene3DBridge.first.active));
    if (!ok) await sleep(250);
  }
  await sleep(1200);
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("body > *")) {
      const z = parseInt(getComputedStyle(el).zIndex, 10);
      if (Number.isFinite(z) && z >= 9000 && el.id !== "scene3d-first"
          && getComputedStyle(el).display !== "none") el.style.display = "none";
    }
  });
  const d = await page.evaluate(measure);
  await page.close();
  return d;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  console.log("▶ 重建 src/js/scene3d.bundle.js …");
  execFileSync(process.execPath,
    [path.join(__dirname, "build-3d-bundle.cjs"), "--out", "src/js/scene3d.bundle.js"],
    { cwd: ROOT, stdio: "inherit" });

  const own = await ensureServer({ root: ROOT, port: PORT, label: "3D HUD 几何扫描" });
  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage",
      "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });

  let bad = 0;
  const rows = [];
  try {
    console.log("\n  宽度  挂载  退出高  退出底  需求条顶  纵向重叠 | 行动力右  托盘左  横向重叠 | 收起钮高  内容被裁");
    for (const w of WIDTHS) {
      const d = await runWidth(browser, w);
      const vOv = d.exit && d.vitals ? Math.max(0, Math.round(d.exit.bottom - d.vitals.top)) : 0;
      const hOv = d.ap && d.tray ? Math.max(0, Math.round(d.ap.right - d.tray.left)) : 0;
      const narrow = w <= NARROW_MAX;
      const tapBad = narrow && ((d.exit && Math.round(d.exit.h) < TAP_MIN)
        || (d.toggleH !== null && d.toggleH < TAP_MIN));
      const fails = [];
      if (!d.mounted) fails.push("未挂载");
      if (vOv > 0) fails.push(`退出按钮压住需求条 ${vOv}px`);
      if (hOv > 0) fails.push(`行动力条压住托盘 ${hOv}px`);
      if (d.contentCut) fails.push(`托盘内容被裁 ${d.contentCut.px}px(${d.contentCut.who})`);
      /* 贴底浮层的两个邻居：按键条（居中）与托盘（右下）。原先各写各的底边 →
         恒定重叠 1px。窄屏按键条 display:none，R() 会返回 null → 自然跳过。 */
      if (d.tray && d.keys) {
        const kx = Math.min(d.tray.right, d.keys.right) - Math.max(d.tray.left, d.keys.left);
        const ky = Math.min(d.tray.bottom, d.keys.bottom) - Math.max(d.tray.top, d.keys.top);
        if (kx > 0 && ky > 0) fails.push(`托盘压住按键条 ${Math.round(kx)}×${Math.round(ky)}px`);
      }
      if (tapBad) fails.push("触控目标 <44px");
      if (fails.length) bad++;
      rows.push({ w, fails });
      console.log(
        `  ${String(w).padStart(4)}  ${(d.mounted ? " ✅ " : " ❌ ").padStart(4)}  `
        + `${String(d.exit ? Math.round(d.exit.h) : "-").padStart(6)}  `
        + `${String(d.exit ? Math.round(d.exit.bottom) : "-").padStart(6)}  `
        + `${String(d.vitals ? Math.round(d.vitals.top) : "-").padStart(8)}  `
        + `${(vOv ? "★ " + vOv + "px" : "—").padStart(10)} | `
        + `${String(d.ap ? Math.round(d.ap.right) : "-").padStart(8)}  `
        + `${String(d.tray ? Math.round(d.tray.left) : "-").padStart(6)}  `
        + `${(hOv ? "★ " + hOv + "px" : "—").padStart(8)} | `
        + `${String(d.toggleH === null ? "-" : d.toggleH).padStart(8)}  `
        + `${(d.contentCut ? "★ " + d.contentCut.px + "px" : "—").padStart(4)}`
        + (fails.length ? `   ← ${fails.join(" ; ")}` : ""));
    }
  } finally {
    await browser.close();
    if (own) closeServer(own);
  }

  console.log(`\n${bad === 0 ? "✅" : "❌"} HUD 几何扫描：${WIDTHS.length} 档宽度，${bad} 档不合格`);
  if (bad) {
    console.log("   不合格档位：" + rows.filter((r) => r.fails.length)
      .map((r) => `${r.w}px(${r.fails.join("/")})`).join("  "));
  }
  process.exit(bad === 0 ? 0 : 1);
}

main().catch((e) => { console.error("脚本自身出错：", e); process.exit(2); });
