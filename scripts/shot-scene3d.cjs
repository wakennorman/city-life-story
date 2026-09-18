/**
 * 3D 场景截图（开发用）
 *
 * 用 puppeteer-core 驱动系统已安装的 Edge，逐个地点截图。
 * headless 下 WebGL 需要 SwiftShader 软件渲染，故带一组启动参数。
 *
 * 用法：node scripts/shot-scene3d.cjs [loc1 loc2 ...]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "dev", "shots");

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const DEFAULT_LOCS = [
  "slum",
  "commercialDist",
  "construction",
  "park",
  "temple",
  "night_market",
  "hospital",
  "luxury_community",
  "school",
  "techPark",
  "library",
  "vegetable_market",
];

async function main() {
  const puppeteer = require("puppeteer-core");

  const locs = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_LOCS;
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--enable-unsafe-swiftshader",
      "--use-angle=swiftshader",
      "--use-gl=angle",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e.message)));
  page.on("console", (m) => {
    if (m.type() === "error") pageErrors.push("console: " + m.text());
  });

  const results = [];
  const overlapIssues = [];

  for (const loc of locs) {
    const url = "file:///" + path.join(ROOT, "dev", "scene3d-preview.html").replace(/\\/g, "/") + "?loc=" + loc;
    await page.goto(url, { waitUntil: "load", timeout: 30000 });

    try {
      await page.waitForFunction("window.__ready === true", { timeout: 15000 });
    } catch {
      results.push({ loc, ok: false, reason: "页面未就绪" });
      continue;
    }

    // 等若干帧，确保首帧渲染完成
    await new Promise((r) => setTimeout(r, 900));

    const info = await page.evaluate(() => {
      const s = window.__spec;
      const canvas = document.querySelector("canvas");
      const gl = canvas && canvas.getContext("webgl2");
      const nodes = [...document.querySelectorAll(".scene3d-hotspot")];
      const hotspots = nodes.length;

      // 热点重叠检测：两两比对外接矩形
      const rects = nodes.map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.dataset.actionId, l: r.left, t: r.top, r: r.right, b: r.bottom };
      });
      const overlaps = [];
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i], b = rects[j];
          if (a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t) {
            overlaps.push(`${a.id}×${b.id}`);
          }
        }
      }
      // 是否跑出画布
      const cw = canvas ? canvas.getBoundingClientRect() : null;
      const outOfBounds = cw
        ? rects.filter((r) => r.l < cw.left - 4 || r.r > cw.right + 4).map((r) => r.id)
        : [];
      // 取画布中心区域的颜色，判断是否真的画出了东西（而非全空白）
      return {
        status: document.getElementById("status").textContent,
        name: s && s.name,
        type: s && s.type,
        tier: s && s.wealthTier,
        buildings: s && s.buildings.length,
        props: s && s.props.length,
        hotspots,
        canvasW: canvas && canvas.width,
        canvasH: canvas && canvas.height,
        hasWebGL: !!gl,
        overlaps,
        outOfBounds,
      };
    });

    const file = path.join(OUT_DIR, `${loc}.png`);
    await page.screenshot({ path: file });
    results.push({ loc, ok: true, info, file });
    const flags = [];
    if (!info.hasWebGL) flags.push("无WebGL");
    if (info.overlaps.length) flags.push(`重叠${info.overlaps.length}处`);
    if (info.outOfBounds.length) flags.push(`越界:${info.outOfBounds.join("/")}`);

    console.log(
      `✓ ${loc.padEnd(18)} ${String(info.name).padEnd(6)} ${String(info.type).padEnd(14)} ` +
        `tier${info.tier} 建筑${String(info.buildings).padStart(2)} 道具${String(info.props).padStart(3)} ` +
        `热点${String(info.hotspots).padStart(2)}` +
        (flags.length ? "  ⚠ " + flags.join(" ") : "")
    );
    if (info.overlaps.length) {
      overlapIssues.push(`${loc}: ${info.overlaps.slice(0, 5).join(", ")}`);
    }
  }

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  if (pageErrors.length) {
    console.log("\n页面错误:");
    [...new Set(pageErrors)].slice(0, 8).forEach((e) => console.log("  " + e));
  }
  if (overlapIssues.length) {
    console.log("\n热点重叠明细:");
    overlapIssues.forEach((s) => console.log("  " + s));
  }
  console.log(`\n截图完成: ${results.filter((r) => r.ok).length}/${locs.length} → dev/shots/`);
  if (failed.length) {
    console.log("失败:", failed.map((f) => f.loc + "(" + f.reason + ")").join(", "));
    process.exit(1);
  }
  if (overlapIssues.length) {
    console.log("⚠ 存在热点重叠，需调整布局");
    process.exit(2);
  }
}

main().catch((e) => {
  console.error("截图失败:", e.message);
  process.exit(1);
});
