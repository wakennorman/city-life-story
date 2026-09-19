/**
 * 外部资产「实物取证」截图
 *
 * 为什么单独拍：verify-3d-assets.cjs 拍的是默认机位，那些 GLB 路边件
 * （垃圾箱/电线杆/遮阳篷）在默认构图里又小又被建筑挡住 —— 数值断言全绿，
 * 但人看不出"到底长什么样"。本脚本把相机拉到每个 GLB 物件的近处逐个拍，
 * 用于人工复核形状与贴图是否正确（而不是靠断言替代眼睛）。
 *
 * 用法：node scripts/shot-3d-assets.cjs
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { ensureServer, closeServer } = require("./lib/serve.cjs");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "dev/_3dtest/shots-assets");
const PORT = 8979;
const DIV = "/dev/_3dtest/assets-shot.html";
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  execFileSync(process.execPath,
    [path.join(__dirname, "build-3d-bundle.cjs"), "--out", "dev/_3dtest/bundle-probe.js"],
    { cwd: ROOT, stdio: "inherit" });

  const own = await ensureServer({ root: ROOT, port: PORT, label: "资产取证" });
  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage",
      "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${PORT}${DIV}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => window.__shot && window.__shot.ready, { timeout: 40000 });

  const items = await page.evaluate(() => window.__shot.list());
  console.log(`可拍物件：${items.length} 个 → ${items.map((i) => i.label).join(" , ")}`);

  let n = 0;
  for (const it of items) {
    const ok = await page.evaluate((id) => window.__shot.focus(id), it.id);
    if (!ok) { console.log(`  · 跳过 ${it.label}（在场景里找不到）`); continue; }
    await new Promise((r) => setTimeout(r, 500));
    n++;
    const file = path.join(OUT, `prop-${String(n).padStart(2, "0")}-${it.id}.png`);
    await page.screenshot({ path: file });
    console.log(`  · ${path.basename(file)}  （${it.kit}/${it.name}）`);
  }

  // 再补一张总览
  await page.evaluate(() => window.__shot.overview());
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT, "overview-wide.png") });
  console.log(`  · overview-wide.png`);

  await browser.close();
  await closeServer(own);
  console.log(`\n截图目录：${path.relative(ROOT, OUT)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
