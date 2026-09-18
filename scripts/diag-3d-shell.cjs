/**
 * 一次性诊断：为什么拖拽不改 yaw / 点击行动无反馈 / 换地点不生效
 * 不猜，直接看回调有没有被调到、事件有没有派发到监听器上。
 */
const path = require("path");
const { ensureServer, closeServer } = require("./lib/serve.cjs");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8972;
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const own = await ensureServer({ root: ROOT, port: PORT, label: "诊断" });
  const puppeteer = require("puppeteer-core");
  const b = await puppeteer.launch({
    executablePath: EDGE, headless: "new",
    args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  const errs = [];
  p.on("pageerror", (e) => errs.push("PAGEERR " + e.message));
  p.on("console", (m) => { if (m.type() === "error") errs.push("CONSOLE " + m.text()); });
  p.on("requestfailed", (r) => errs.push("REQFAIL " + r.url() + " " + (r.failure() || {}).errorText));

  await p.goto(`http://127.0.0.1:${PORT}/dev/_3dtest/shell.html`, { waitUntil: "networkidle2" });
  await p.waitForFunction(() => window.__shellReady === true, { timeout: 30000 });
  await sleep(2000);

  console.log("=== 诊断 ===\n");

  // 1) 谁在 (720,420) 这一点的最上层？
  const top = await p.evaluate(() => {
    const el = document.elementFromPoint(720, 420);
    return { tag: el.tagName, cls: el.className, pe: getComputedStyle(el).pointerEvents };
  });
  console.log("1) (720,420) 最上层元素:", JSON.stringify(top));

  // 2) 手写派发 pointer 事件，看 yaw 会不会变（绕开 puppeteer 的鼠标实现）
  const manual = await p.evaluate(() => {
    const stage = document.querySelector(".s3s3d-stage");
    const before = window.__shell.debug.view.yaw;
    const mk = (type, x, y) => new PointerEvent(type, {
      bubbles: true, cancelable: true, clientX: x, clientY: y,
      pointerId: 1, pointerType: "mouse", button: 0, buttons: 1,
    });
    stage.dispatchEvent(mk("pointerdown", 720, 420));
    for (let i = 1; i <= 10; i++) stage.dispatchEvent(mk("pointermove", 720 + i * 18, 420));
    stage.dispatchEvent(mk("pointerup", 900, 420));
    return { before, after: window.__shell.debug.view.yaw, hasStage: !!stage };
  });
  console.log("2) 手写 pointer 事件后 yaw:", JSON.stringify(manual));

  // 3) puppeteer 鼠标拖拽（对比）
  const before = await p.evaluate(() => window.__shell.debug.view.yaw);
  await p.mouse.move(700, 400);
  await p.mouse.down();
  for (let i = 1; i <= 10; i++) { await p.mouse.move(700 + i * 20, 400); await sleep(20); }
  await p.mouse.up();
  await sleep(300);
  const after = await p.evaluate(() => window.__shell.debug.view.yaw);
  console.log(`3) puppeteer 拖拽 yaw: ${before.toFixed(3)} → ${after.toFixed(3)}`);

  // 4) 点击行动条目，看回调计数
  await p.keyboard.press("Tab");
  await sleep(400);
  const click = await p.evaluate(() => {
    const btn = [...document.querySelectorAll(".s3h-act")].find((x) => !x.classList.contains("is-off"));
    if (!btn) return { found: false };
    btn.click();
    return { found: true, name: btn.querySelector(".s3h-act-name").textContent };
  });
  await sleep(600);
  const peek = await p.evaluate(() => window.__peek());
  console.log("4) 点击行动:", JSON.stringify(click), " 回调计数/状态:", JSON.stringify(peek));

  // 5) 换地点
  await p.keyboard.press("KeyM");
  await sleep(400);
  const trav = await p.evaluate(() => {
    const cur = window.__shell.debug.locationId;
    const btn = [...document.querySelectorAll(".s3h-loc")].find((x) => x.dataset.id !== cur);
    if (!btn) return { found: false, cur };
    btn.click();
    return { found: true, target: btn.dataset.id, cur };
  });
  await sleep(2400);
  const peek2 = await p.evaluate(() => ({ ...window.__peek(), loc: window.__shell.debug.locationId }));
  console.log("5) 换地点:", JSON.stringify(trav), " 结果:", JSON.stringify(peek2));

  console.log("\n=== 事件/错误 ===");
  errs.slice(0, 12).forEach((e) => console.log("  " + e));

  await b.close();
  await closeServer(own);
})().catch((e) => { console.error(e); process.exit(1); });
