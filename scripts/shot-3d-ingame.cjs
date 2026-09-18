/**
 * 3D 场景层 · 真实游戏内截图
 *
 * 拍三张，作为"3D 真的接进游戏"的可视证据：
 *   1. 游戏主界面 + 侧栏微缩景
 *   2. 全屏 3D 全景（热点 + E 提示可见）
 *   3. 切地点后的另一张全景
 *
 * 用法：node scripts/shot-3d-ingame.cjs
 */

const path = require("path");
const fs = require("fs");
const { ensureServer, closeServer } = require("./lib/serve.cjs");

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 8931;
const URL = `http://127.0.0.1:${PORT}/index.html`;
const OUT = path.join(__dirname, "..", "dev", "_3dtest", "shots-ingame");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function enterGame(page) {
  await page.waitForSelector("#btn-new-game", { timeout: 30000 });
  await page.click("#btn-new-game");
  await sleep(600);
  const mode = await page.$('.mode-card[data-mode="classic"]');
  if (mode) { await mode.click(); await sleep(500); }
  for (const sel of ["#_talent_decline", "#_talent_skip"]) {
    const el = await page.$(sel);
    if (el) { await el.click(); await sleep(400); break; }
  }
  for (let i = 0; i < 60; i++) {
    const b = await page.$("#world-news-skip-btn");
    if (b) { await b.click(); break; }
    await sleep(500);
  }
  await sleep(700);
  for (let i = 0; i < 40; i++) {
    const b = await page.$("#world-news-start-btn");
    if (b) { await b.click(); break; }
    await sleep(500);
  }
  await sleep(1600);
  await page.evaluate(() => {
    document.querySelectorAll(".modal-overlay").forEach((m) => { m.style.display = "none"; });
  });
  await sleep(500);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const ownServer = await ensureServer({ root: path.join(__dirname, "..", "src"), port: PORT, label: "游戏 src" });

  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage",
      "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload({ waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1000);

  console.log("=== 3D 场景层 · 游戏内截图 ===\n");
  await enterGame(page);

  const loc = await page.evaluate(() => StateManager.getState().trade.currentLocation);
  console.log(`当前地点：${loc}`);

  // ① 主界面 + 侧栏微缩景
  await sleep(1200);
  const miniBox = await page.evaluate(() => {
    const h = document.getElementById("scene3d-mini");
    if (!h) return null;
    const r = h.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  await page.screenshot({ path: path.join(OUT, "1-main-with-mini.png") });
  if (miniBox) {
    await page.screenshot({
      path: path.join(OUT, "2-mini-closeup.png"),
      clip: {
        x: Math.max(0, miniBox.x - 8), y: Math.max(0, miniBox.y - 8),
        width: Math.min(1440, miniBox.width + 16), height: Math.min(900, miniBox.height + 16),
      },
    });
  }
  console.log(`① 主界面 + 微缩景  → ${miniBox ? `${Math.round(miniBox.width)}x${Math.round(miniBox.height)}px` : "⚠️ 未找到微缩景"}`);

  // ② 全屏全景（等相机稳定 + 热点呼吸动画跑起来）
  await page.click("#scene3d-mini");
  await sleep(2600);
  await page.screenshot({ path: path.join(OUT, "3-overlay.png") });
  const ov = await page.evaluate(() => ({
    tris: (window.Scene3DBridge.debugOverlayStats() || {}).triangles || 0,
    spots: window.Scene3DBridge.debugHotspots().length,
  }));
  console.log(`② 全屏全景        → ${ov.tris} 三角面 / ${ov.spots} 热点`);

  // ③ 换一个地点再拍（证明微缩景与全景都跟随游戏状态）
  const next = await page.evaluate(() => {
    const st = StateManager.getState();
    const to = st.trade.currentLocation === "slum" ? "commercialDist" : "slum";
    st.trade.currentLocation = to;
    if (typeof renderLocation === "function") renderLocation(st);
    window.Scene3DBridge.close();
    return to;
  });
  await sleep(1800);
  await page.click("#scene3d-mini");
  await sleep(2600);
  await page.screenshot({ path: path.join(OUT, "4-overlay-other-loc.png") });
  const ov2 = await page.evaluate(() => ({
    loc: window.Scene3DBridge.debugOverlayLoc(),
    tris: (window.Scene3DBridge.debugOverlayStats() || {}).triangles || 0,
  }));
  console.log(`③ 切换后全景      → ${ov2.loc}，${ov2.tris} 三角面（请求 ${next}）`);

  console.log(`\n截图目录: ${path.relative(path.join(__dirname, ".."), OUT)}`);
  await browser.close();
  await closeServer(ownServer);
}

main().catch((e) => { console.error("截图失败:", e); process.exit(1); });
