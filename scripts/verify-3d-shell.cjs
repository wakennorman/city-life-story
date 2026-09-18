/**
 * 3D-first 外壳验证
 *
 * 验证目标形态（全屏 3D + HUD）真的跑得起来，而不是"看起来像"：
 *   ① 3D 铺满视口并渲染出三角面
 *   ② HUD 的顶栏/需求条/行动托盘都有真实内容
 *   ③ 按住左键拖动真的改变相机 yaw（这是之前的第 2 条抱怨）
 *   ④ 双击回正回到默认机位（R 键同理）
 *   ⑤ 点击行动条目真的驱动状态变化（AP 下降）
 *   ⑥ M 打开去处列表并能切地点
 *   ⑦ 无页面报错
 *
 * 用法：node scripts/verify-3d-shell.cjs
 * 自给自足：端口无服务时自动起一个（结束关闭）。
 */

const fs = require("fs");
const path = require("path");
const { ensureServer, closeServer } = require("./lib/serve.cjs");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "dev/_3dtest");
const OUT = path.join(DIR, "shots-shell");
const PORT = 8971;
/* 服务根必须是**项目根**而不是 dev/_3dtest：
   预览页要引用 /src/css/scene3d.css，根目录指错就 404，
   结果是页面半裸奔 —— 上一版就是这么翻车的（canvas 尺寸不对 + HUD 无样式）。 */
const DOC = "/dev/_3dtest/shell.html";
const URL = `http://127.0.0.1:${PORT}${DOC}`;
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pass = 0, fail = 0;
const check = (name, ok, detail) => {
  console.log(`  ${ok ? "✅" : "❌"} ${name}${detail ? "  → " + detail : ""}`);
  ok ? pass++ : fail++;
};

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const own = await ensureServer({ root: ROOT, port: PORT, label: "3D-first 外壳预览" });

  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage",
      "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const errors = [];
  const noise = [];
  page.on("pageerror", (e) => errors.push("[pageerror] " + String(e.message || e)));
  /* console 的 "Failed to load resource ... 404" **不带 URL**，
     无法在那条消息里判断是不是 favicon。所以：
       · 该条不在这里归类（避免与 response 事件重复计数）
       · 404 一律由下面的 response 处理器按 URL 判定
     这样"资源真的没加载"仍会被抓到（[404] 前缀），favicon 则进噪声。 */
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/Failed to load resource/i.test(t)) return;
    errors.push("[console] " + t);
  });
  page.on("response", (r) => {
    if (r.status() !== 404) return;
    const u = r.url();
    (/(favicon|\.ico)(\?|$)/i.test(u) ? noise : errors).push("[404] " + u);
  });
  page.on("requestfailed", (r) => {
    const u = r.url();
    (/(favicon|\.ico)(\?|$)/i.test(u) ? noise : errors).push("[reqfail] " + u);
  });

  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await page.waitForFunction(() => window.__shellReady === true, { timeout: 30000, polling: 200 });
  await sleep(2200);

  console.log("=== 3D-first 外壳验证 ===\n");

  console.log("① 3D 主视图");
  const s0 = await page.evaluate(() => window.__shell.debug);
  check("3D 已渲染出三角面", s0.tris > 1000, `${s0.tris} 三角面 / ${s0.calls} draw calls`);
  const fill = await page.evaluate(() => {
    const c = document.querySelector('.s3s3d-stage canvas');
    const r = c.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), vw: innerWidth, vh: innerHeight };
  });
  check("3D 铺满整个视口（不是塞在某个控件里）",
    fill.w >= fill.vw - 2 && fill.h >= fill.vh - 2,
    `canvas ${fill.w}x${fill.h} vs 视口 ${fill.vw}x${fill.vh}`);

  console.log("\n② HUD 内容");
  const hud = await page.evaluate(() => ({
    day: document.querySelector('[data-f="day"]').textContent,
    slot: document.querySelector('[data-f="slot"]').textContent,
    cash: document.querySelector('[data-f="cash"]').textContent,
    loc: document.querySelector('[data-f="locName"]').textContent,
    ap: document.querySelector('[data-f="apText"]').textContent,
    vitals: document.querySelectorAll('.s3h-vital').length,
    vitalNums: [...document.querySelectorAll('.s3h-vital-num')].map((e) => e.textContent),
  }));
  check("顶栏有日期/时段/地点/现金", !!hud.day && !!hud.loc && !!hud.cash,
    `${hud.day} ${hud.slot} · ${hud.loc} · ${hud.cash}`);
  check("行动力条有数值", /\d+\s*\/\s*\d+/.test(hud.ap), hud.ap);
  check("需求条 5 条且已填数", hud.vitals === 5 && hud.vitalNums.every((n) => n !== ""),
    `${hud.vitals} 条：${hud.vitalNums.join(" / ")}`);

  // 展开行动托盘
  await page.keyboard.press("Tab");
  await sleep(500);
  const tray = await page.evaluate(() => ({
    open: document.querySelector('.s3h-tray').classList.contains('is-open'),
    acts: [...document.querySelectorAll('.s3h-act')].map((b) => ({
      name: b.querySelector('.s3h-act-name').textContent,
      off: b.classList.contains('is-off'),
    })),
  }));
  check("Tab 展开行动托盘", tray.open);
  check("托盘内是真实行动（来自 gamedata）", tray.acts.length > 0,
    `${tray.acts.length} 条：${tray.acts.slice(0, 4).map((a) => a.name).join(" / ")}`);
  await page.screenshot({ path: path.join(OUT, "1-shell-hud.png") });

  console.log("\n③ 左键拖拽转视角（原先的第 2 条抱怨）");
  const v0 = (await page.evaluate(() => window.__shell.debug)).view;
  await page.mouse.move(720, 420);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(720 + i * 18, 420 + i * 2); await sleep(24); }
  await page.mouse.up();
  await sleep(400);
  const v1 = (await page.evaluate(() => window.__shell.debug)).view;
  check("拖拽后 yaw 真的变了", Math.abs(v1.yaw - v0.yaw) > 0.1,
    `yaw ${v0.yaw.toFixed(3)} → ${v1.yaw.toFixed(3)}（Δ${(v1.yaw - v0.yaw).toFixed(3)}）`);
  await page.screenshot({ path: path.join(OUT, "2-rotated.png") });

  console.log("\n④ 视角回正");
  await page.keyboard.press("KeyR");
  await sleep(400);
  const v2 = (await page.evaluate(() => window.__shell.debug)).view;
  check("R 键回到默认机位", Math.abs(v2.yaw - 0.38) < 0.02 && Math.abs(v2.pitch - 0.76) < 0.02,
    `yaw ${v2.yaw.toFixed(3)} / pitch ${v2.pitch.toFixed(3)}`);

  console.log("\n⑤ 点击行动 → 状态变化");
  const before = await page.evaluate(() => document.querySelector('[data-f="apText"]').textContent);
  const clicked = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.s3h-act')].find((x) => !x.classList.contains('is-off'));
    if (!b) return null;
    const name = b.querySelector('.s3h-act-name').textContent;
    b.click();
    return name;
  });
  await sleep(600);
  const after = await page.evaluate(() => document.querySelector('[data-f="apText"]').textContent);
  check("点击行动有真实反馈（AP 下降）", !!clicked && before !== after,
    `${clicked}：AP ${before} → ${after}`);

  console.log("\n⑥ 去处列表 + 切换地点");
  await page.keyboard.press("KeyM");
  await sleep(500);
  const mapOpen = await page.evaluate(() => !document.querySelector('[data-f="map"]').hidden);
  const locCount = await page.evaluate(() => document.querySelectorAll('.s3h-loc').length);
  check("M 打开去处列表", mapOpen, `${locCount} 个地点可选`);
  const beforeLoc = (await page.evaluate(() => window.__shell.debug)).locationId;
  const actsBefore = await page.evaluate(() =>
    [...document.querySelectorAll('.s3h-act-name')].map((e) => e.textContent));
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.s3h-loc')].find((x) => x.dataset.id !== window.__shell.debug.locationId);
    b.click();
  });
  await sleep(2400);
  const afterLoc = (await page.evaluate(() => window.__shell.debug)).locationId;
  const tris2 = (await page.evaluate(() => window.__shell.debug)).tris;
  check("切换地点后 3D 重建且 HUD 跟随", afterLoc !== beforeLoc && tris2 > 1000,
    `${beforeLoc} → ${afterLoc}（${tris2} 三角面）`);

  /* ★ 断言行动托盘跟着换 —— 这条是补上的。
     原先只查了地点名，于是漏掉一个真 bug：readActions 读的是页面本地的
     curId，travel 只更新了外壳的 locationId，行动托盘就一直停在旧地点的
     行动上，点下去执行的是别处的事。地点名对、行动列表错，断言全绿。 */
  const actsAfter = await page.evaluate(() =>
    [...document.querySelectorAll('.s3h-act-name')].map((e) => e.textContent));
  const same = actsBefore.length === actsAfter.length &&
    actsBefore.every((n, i) => n === actsAfter[i]);
  check("换地点后行动托盘同步换掉（不是停在旧地点）",
    actsBefore.length > 0 && actsAfter.length > 0 && !same,
    `${actsBefore.length} 条 → ${actsAfter.length} 条；` +
    `旧首条「${actsBefore[0]}」/ 新首条「${actsAfter[0]}」`);
  await page.screenshot({ path: path.join(OUT, "3-other-location.png") });

  console.log("\n=== 页面报错 ===");
  if (errors.length) errors.slice(0, 6).forEach((e) => console.log("   ❌ " + e.slice(0, 150)));
  else console.log("   （无）");
  check("无页面报错", errors.length === 0, errors.length ? `${errors.length} 条` : "0 条");
  if (noise.length) console.log(`   ℹ️  已忽略 ${noise.length} 条浏览器自动请求噪声（favicon）`);

  console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════`);
  console.log(`截图：${path.relative(ROOT, OUT)}`);
  await browser.close();
  await closeServer(own);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error("验证失败:", e); process.exit(1); });
