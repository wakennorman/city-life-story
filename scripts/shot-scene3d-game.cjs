/**
 * 真实游戏 3D 截图（开发用）
 *
 * 与 shot-scene3d.cjs 的区别：那个截的是独立预览页，
 * 这个截的是 **src/index.html 真实游戏**，包含：
 *   - 侧栏微缩景（嵌在游戏 UI 里的那一块）
 *   - 全屏全景（带热点）
 *
 * 用法：node scripts/shot-scene3d-game.cjs [loc1 loc2 ...]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "dev", "shots-game");
/** 纯 3D 画布裁剪图：供像素分析使用（不含游戏 UI 干扰） */
const CANVAS_DIR = path.join(ROOT, "dev", "shots-canvas");
const MINI_DIR = path.join(ROOT, "dev", "shots-mini");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const DEFAULT_LOCS = [
  "slum",
  "commercialDist",
  "construction",
  "park",
  "night_market",
  "hospital",
  "luxury_community",
  "library",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const puppeteer = require("puppeteer-core");
  const locs = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_LOCS;
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(CANVAS_DIR, { recursive: true });
  fs.mkdirSync(MINI_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--enable-unsafe-swiftshader",
      "--use-angle=swiftshader",
      "--use-gl=angle",
      "--hide-scrollbars",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const errs = [];
  page.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));

  await page.goto("file:///" + ROOT.replace(/\\/g, "/") + "/src/index.html", {
    waitUntil: "load",
    timeout: 60000,
  });
  await page.waitForFunction("typeof showModeSelect==='function'", { timeout: 60000 });

  // —— 走真实 UI 进入游戏 ——
  await page.click("#btn-new-game");
  await sleep(400);
  await page.evaluate(() => document.querySelector('[data-mode="classic"]').click());
  await sleep(700);
  await page.evaluate(() => {
    const b = document.getElementById("_talent_decline");
    if (b) b.click();
  });

  // 开场「世界新闻」是异步流程，耗时随网络波动（可能停在加载页）。
  // 轮询真实按钮：跳过等待 → 出发 → 直到主界面可见。
  const enterGame = async () => {
    const deadline = Date.now() + 60000;
    while (Date.now() < deadline) {
      const done = await page.evaluate(() => {
        const app = document.getElementById("app");
        return !!app && getComputedStyle(app).display !== "none";
      });
      if (done) return true;
      await page.evaluate(() => {
        const skip = document.getElementById("world-news-skip-btn");
        if (skip && skip.offsetParent !== null) {
          skip.click();
          return;
        }
        const start = document.getElementById("world-news-start-btn");
        if (start && start.offsetParent !== null) start.click();
      });
      await sleep(500);
    }
    return false;
  };
  const entered = await enterGame();
  if (!entered) throw new Error("60s 内未能进入游戏主界面");
  await sleep(2000);
  console.log("已进入游戏");

  /**
   * 关掉游戏自己的弹窗遮罩。
   * 开局后常见「强制梦境」「教程」等 modal（.modal-overlay，全屏 rgba(0,0,0,.7)），
   * 会把侧栏微缩景压暗，导致截图像素统计失真。先尝试点真实按钮，
   * 再兜底按游戏自身的方式移除节点。
   */
  const dismissModals = async () => {
    await page.evaluate(() => {
      const ov = document.querySelector(".modal-overlay");
      if (!ov) return;
      const btn = [...ov.querySelectorAll("button, .btn")].find((b) =>
        /确定|知道了|关闭|继续|跳过|我明白|开始|下一/.test(b.textContent || "")
      );
      if (btn) btn.click();
      else ov.remove();
    });
    await sleep(600);
    // 教程高亮层 / 残留遮罩
    await page.evaluate(() => {
      document.querySelectorAll(".modal-overlay, .tutorial-overlay, .tour-overlay").forEach((n) => {
        if (getComputedStyle(n).display !== "none") n.remove();
      });
    });
    await sleep(300);
  };
  await dismissModals();

  const report = [];

  for (const loc of locs) {
    const ok = await page.evaluate((id) => {
      if (!window.CLS || !window.CLS.data.LOCATIONS[id]) return false;
      window.StateManager.getState().trade.currentLocation = id;
      if (typeof renderAll === "function") renderAll();
      return true;
    }, loc);
    if (!ok) {
      console.log("跳过未知地点:", loc);
      continue;
    }
    await sleep(1400);
    await dismissModals();

    // 微缩景（整页含侧栏）
    await page.screenshot({ path: path.join(OUT_DIR, loc + "-mini.png") });
    // 微缩景画布裁剪（纯 3D）
    const miniClip = await page.evaluate(() => {
      const c = document.querySelector("#scene3d-mini canvas");
      if (!c) return null;
      const r = c.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    if (miniClip && miniClip.width > 10 && miniClip.height > 10) {
      await page.screenshot({ path: path.join(MINI_DIR, loc + ".png"), clip: miniClip });
    }

    // 全景
    await page.evaluate(() => window.Scene3DBridge.open());
    await sleep(1100);
    await page.screenshot({ path: path.join(OUT_DIR, loc + "-overlay.png") });
    // 全景画布裁剪（纯 3D）
    const ovClip = await page.evaluate(() => {
      const c = document.querySelector("#scene3d-overlay canvas");
      if (!c) return null;
      const r = c.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    if (ovClip && ovClip.width > 10 && ovClip.height > 10) {
      await page.screenshot({ path: path.join(CANVAS_DIR, loc + ".png"), clip: ovClip });
    }

    const info = await page.evaluate(() => {
      const h = document.getElementById("scene3d-mini");
      const ov = document.getElementById("scene3d-overlay");
      const sp = window.Scene3DBridge.debugMiniSpec();
      return {
        miniCanvas: h ? !!h.querySelector("canvas") : false,
        miniBox: h
          ? Math.round(h.getBoundingClientRect().width) + "x" + Math.round(h.getBoundingClientRect().height)
          : null,
        hotspots: ov ? ov.querySelectorAll("[data-scene3d-action]").length : 0,
        specType: sp ? sp.type : null,
        buildings: sp ? sp.buildings.length : null,
        modalOpen: !!document.querySelector(".modal-overlay"),
      };
    });
    await page.evaluate(() => window.Scene3DBridge.close());
    await sleep(250);

    report.push({ loc, ...info });
    console.log(
      "  " + loc.padEnd(20) +
        " 微缩=" + (info.miniCanvas ? info.miniBox : "无") +
        "  热点=" + String(info.hotspots).padStart(2) +
        "  类型=" + info.specType +
        "  建筑=" + info.buildings +
        (info.modalOpen ? "  ⚠️有弹窗遮罩" : "")
    );
  }

  fs.writeFileSync(path.join(OUT_DIR, "_report.json"), JSON.stringify(report, null, 2));

  console.log("\n页面错误:", errs.length ? errs.slice(0, 6).join("\n") : "(无)");
  console.log("截图目录:", OUT_DIR);
  await browser.close();
}

main().catch((e) => {
  console.error("截图失败:", e.message);
  process.exit(1);
});
