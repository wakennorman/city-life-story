/**
 * 3D 内核迁移验证（开发用）
 *
 * 只加载打包产物（bundle-probe.js），不碰游戏本体。
 * 确认 src/app/3d/ 的内核在 IIFE 形态下：能渲染 / 能走动 / 能触发交互 / 无报错。
 *
 * 自给自足：探针包缺失会自动打包，本地服务不存在会自动起一个（用完关掉），
 *          所以直接 `node scripts/verify-3d-bundle.cjs` 即可，无需先手动准备环境。
 *
 * 用法：node scripts/verify-3d-bundle.cjs [loc1 loc2 ...]
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { ensureServer, closeServer } = require("./lib/serve.cjs");
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "dev/_3dtest/shots");
const PROBE = path.join(ROOT, "dev/_3dtest/bundle-probe.js");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 8951;
const URL = `http://127.0.0.1:${PORT}/index.html`;

const DEFAULT = ["slum", "commercialDist", "park", "construction", "luxury_community"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 探针包是构建产物，不进版本库；缺了就现打一个 */
function ensureProbeBundle() {
  if (fs.existsSync(PROBE)) return;
  console.log("· 探针包不存在，先打包…");
  execFileSync(process.execPath, [path.join(__dirname, "build-3d-bundle.cjs"), "--out", "dev/_3dtest/bundle-probe.js"], {
    cwd: ROOT, stdio: "inherit",
  });
}

async function main() {
  const list = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT;
  fs.mkdirSync(OUT, { recursive: true });
  ensureProbeBundle();
  const ownServer = await ensureServer({ root: path.join(ROOT, "dev/_3dtest"), port: PORT, label: "3D 探针页" });

  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: "new",
    args: [
      "--no-sandbox", "--disable-dev-shm-usage",
      "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 640, deviceScaleFactor: 1 });

  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e.message || e)));
  page.on("console", (m) => { if (m.type() === "error") pageErrors.push("[console] " + m.text()); });

  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000, polling: 200 });
  await sleep(600);

  console.log("=== 3D 内核迁移验证 ===\n");
  let pass = 0, fail = 0;
  const check = (name, ok, detail) => {
    console.log(`  ${ok ? "✅" : "❌"} ${name}${detail ? "  → " + detail : ""}`);
    ok ? pass++ : fail++;
  };

  const rows = [];
  for (const id of list) {
    const ok = await page.evaluate((x) => window.__load(x), id);
    if (!ok) { check(`加载 ${id}`, false, "loadLocation 返回 false"); continue; }
    await sleep(900); // 让 SwiftShader 渲染几帧

    const shot = path.join(OUT, id + ".png");
    await page.screenshot({ path: shot });

    const st = await page.evaluate(() => {
      const s = window.__s3;
      const pos0 = s.playerPos;
      s.key("KeyW", true);
      return { pos0, hotspots: s.hotspots.length, stats: s.stats, id: s.locationId };
    });
    await sleep(700);
    const after = await page.evaluate(() => {
      const s = window.__s3;
      s.key("KeyW", false);
      return { pos1: s.playerPos, stats: s.stats, build: (window.__builds || []).slice(-1)[0] };
    });

    const moved = Math.hypot(after.pos1.x - st.pos0.x, after.pos1.z - st.pos0.z);
    rows.push({
      id, hotspots: st.hotspots, moved: +moved.toFixed(2),
      calls: after.stats.calls, tris: after.stats.triangles,
      buildMs: after.build && after.build.ms,
      spawnBlocked: after.build && after.build.spawnBlocked,
      meshes: after.build && `${after.build.meshes.before}→${after.build.meshes.after}`,
    });

    check(`${id} 渲染`, after.stats.triangles > 1000, `${after.stats.triangles} 三角面 / ${after.stats.calls} draw calls`);
    check(`${id} 出生点未被压住`, after.build.spawnBlocked === 0, `遮挡 ${after.build.spawnBlocked}`);
    check(`${id} 角色可走动`, moved > 0.3, `位移 ${moved.toFixed(2)}m`);
  }

  // 交互链路：瞬移到热点旁 → 真实按键 E → 应回调到 onInteract
  // 用 page.keyboard.press 而不是 s.key()：走真实 keydown 路径，
  // 顺带验证"瞬移后最近热点能在一帧内被算出"，这正是玩家走到摊位前的场景。
  await page.evaluate(() => window.__load("slum"));
  await sleep(700);
  const inter = await page.evaluate(() => {
    const s = window.__s3;
    const h = s.hotspots[0];
    if (!h) return { ok: false, reason: "无热点" };
    s.teleport(h.x, h.z);
    return { ok: true, target: h.kind + ":" + h.label };
  });
  await sleep(400); // 等主循环把 focused 更新到最近热点
  await page.keyboard.press("KeyE");
  await sleep(400);
  const interResult = await page.evaluate(() => ({
    focus: window.__focus,
    interacted: window.__interacted || [],
  }));
  check("热点可触发并回调游戏", interResult.interacted.length > 0,
    inter.ok ? `目标 ${inter.target} · 聚焦 ${interResult.focus} · 回调 ${JSON.stringify(interResult.interacted)}` : inter.reason);

  console.log("\n=== 逐地点指标 ===");
  console.log("  地点".padEnd(22) + "热点  位移    draw  calls    三角面    构建ms  出生遮挡  网格合并");
  for (const r of rows) {
    console.log(
      "  " + String(r.id).padEnd(20) +
      String(r.hotspots).padStart(4) +
      String(r.moved).padStart(7) + "m" +
      String(r.calls).padStart(7) +
      String(r.tris).padStart(10) +
      String(r.buildMs).padStart(9) +
      String(r.spawnBlocked).padStart(9) +
      "   " + (r.meshes || "-")
    );
  }

  console.log("\n=== 页面报错 ===");
  if (pageErrors.length) pageErrors.slice(0, 10).forEach((e) => console.log("   " + e.slice(0, 170)));
  else console.log("   （无）");
  check("无页面报错", pageErrors.length === 0, pageErrors.length ? `${pageErrors.length} 条` : "");

  console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════`);
  console.log(`截图目录: ${path.relative(ROOT, OUT)}`);

  await browser.close();
  await closeServer(ownServer);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error("验证脚本失败:", e); process.exit(1); });
