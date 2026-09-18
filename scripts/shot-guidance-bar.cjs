/**
 * 引导面板（Guidance Bar）桌面端渲染取证
 *
 * 背景：style.css:5662 的 @media (max-width:600px) 漏了闭合 `}`，
 * 把后面 78 条规则一路吞到 EOF。桌面端因此完全丢失：
 *   .guidance-bar / .gb-* / .action-card:hover|:active / .quick-travel-btn /
 *   .npc-rel-card / .transit-btn ...
 *
 * 本脚本：真实进入游戏 → 截图 → 输出关键元素的 computed style。
 * 用法：node scripts/shot-guidance-bar.cjs <输出前缀，如 dev/gb/before>
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const URL = "http://127.0.0.1:8931/index.html";
const TARGETS = [".guidance-bar", ".gb-row", ".gb-cell", ".action-card", ".transit-btn"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function enterGame(page) {
  // 1) 新游戏
  await page.waitForSelector("#btn-new-game", { timeout: 30000 });
  await page.click("#btn-new-game");
  await sleep(600);

  // 2) 经典模式
  const modeSel = '.mode-card[data-mode="classic"]';
  await page.waitForSelector(modeSel, { timeout: 15000 }).catch(() => {});
  const mode = await page.$(modeSel);
  if (mode) { await mode.click(); await sleep(400); }

  // 3) 天赋页：跳过（点"不选"）
  for (const sel of ["#_talent_decline", "#_talent_skip", "[data-talent-decline]"]) {
    const el = await page.$(sel);
    if (el) { await el.click(); await sleep(400); break; }
  }

  // 4) 开场世界新闻：先 skip 再 start，轮询真实按钮，避免异步卡死
  for (let i = 0; i < 60; i++) {
    const btn = await page.$("#world-news-skip-btn");
    if (btn) { await btn.click(); break; }
    await sleep(500);
  }
  await sleep(800);
  for (let i = 0; i < 40; i++) {
    const btn = await page.$("#world-news-start-btn");
    if (btn) { await btn.click(); break; }
    await sleep(500);
  }
  await sleep(1500);

  // 5) 关掉一切 modal 遮罩（否则截图被盖黑）
  await page.evaluate(() => {
    document.querySelectorAll(".modal-overlay").forEach((m) => {
      m.style.display = "none";
    });
  });
  await sleep(400);
}

async function main() {
  const prefix = process.argv[2] || "dev/gb/shot";
  const outDir = path.dirname(path.join(ROOT, prefix));
  fs.mkdirSync(outDir, { recursive: true });

  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--enable-unsafe-swiftshader"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message || e)));
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1000);

  await enterGame(page);

  const full = path.join(ROOT, prefix + "-full.png");
  await page.screenshot({ path: full, fullPage: false });

  // 引导面板单独裁剪
  const info = await page.evaluate((TARGETS) => {
    const res = { elements: [], notes: [] };
    for (const sel of TARGETS) {
      const el = document.querySelector(sel);
      if (!el) { res.elements.push({ selector: sel, present: false }); continue; }
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      res.elements.push({
        selector: sel,
        present: true,
        box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        display: cs.display,
        padding: cs.padding,
        marginBottom: cs.marginBottom,
        background: cs.backgroundColor,
        fontSize: cs.fontSize,
        gridTemplateColumns: cs.gridTemplateColumns,
        opacity: cs.opacity,
      });
    }
    return res;
  }, TARGETS);

  for (const t of TARGETS) {
    const el = await page.$(t);
    if (!el) continue;
    const box = await el.boundingBox();
    if (!box || box.width < 2 || box.height < 2) continue;
    const name = t.replace(/[^a-z0-9]/gi, "_");
    await page.screenshot({
      path: path.join(ROOT, `${prefix}-${name}.png`),
      clip: {
        x: Math.max(0, box.x - 4),
        y: Math.max(0, box.y - 4),
        width: Math.min(box.width + 8, 1280),
        height: Math.min(box.height + 8, 900),
      },
    });
  }

  console.log("=== 截图前缀:", prefix, "===");
  console.log("整页:", path.relative(ROOT, full));
  console.log("\n=== 关键元素 computed style ===");
  for (const e of info.elements) console.log("  ", JSON.stringify(e));
  if (errors.length) {
    console.log("\n=== 页面 JS 报错 ===");
    errors.slice(0, 8).forEach((e) => console.log("   ", e.slice(0, 160)));
  }

  await browser.close();
}

main().catch((e) => { console.error("失败:", e); process.exit(1); });
