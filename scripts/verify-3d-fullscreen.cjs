/**
 * 关键验收：3D 模式下，游戏的功能面板/弹窗能不能真的显示出来？
 * 这决定"完全 3D"是否成立。
 */
const path = require("path");
const { EDGE, attachErrorSink, boot, dismissModals } = require("./_boot.cjs");
const { ensureServer, closeServer } = require("./lib/serve.cjs");
const ROOT = path.resolve(__dirname, "..");
const PORT = 8977;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pass = 0, fail = 0;
const check = (n, ok, d) => { console.log(`  ${ok ? "✅" : "❌"} ${n}${d ? "  → " + d : ""}`); ok ? pass++ : fail++; };

(async () => {
  const own = await ensureServer({ root: ROOT, port: PORT, label: "panels3d" });
  const puppeteer = require("puppeteer-core");
  const b = await puppeteer.launch({
    executablePath: EDGE.replace(/\//g, "\\"),
    headless: "new",
    args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  const errs = attachErrorSink(p);
  await boot(p, `http://127.0.0.1:${PORT}/dist/index.html`);
  await sleep(3000);
  await dismissModals(p);

  console.log("\n① 3D 已挂载且主界面已让位");
  const s1 = await p.evaluate(() => {
    const g = (id) => document.getElementById(id);
    const app = g("app"), main = g("main");
    return {
      first: !!g("scene3d-first"),
      canvas: (() => { const c = document.querySelector("#scene3d-first canvas"); return c ? c.width + "x" + c.height : null; })(),
      appHasYield: app ? app.classList.contains("s3-yield") : null,
      appDisplay: app ? getComputedStyle(app).display : "(无)",
      appInert: app ? !!app.inert : null,
      appPointer: app ? getComputedStyle(app).pointerEvents : null,
      mainDisplay: main ? getComputedStyle(main).display : "(无)",
      mainH: main ? Math.round(main.getBoundingClientRect().height) : -1,
    };
  });
  check("3D 铺满视口", s1.first && s1.canvas === "1440x900", `canvas=${s1.canvas}`);
  check("#app 加了 .s3-yield 类", s1.appHasYield === true, `class=${s1.appHasYield}`);
  check("#app 本身未被隐藏（弹层能浮出的前提）", s1.appDisplay !== "none", `display=${s1.appDisplay}`);
  check("#app 未被 inert（弹窗不会被废掉交互）", s1.appInert === false, `inert=${s1.appInert}`);
  check("主视图已让位（#main 隐藏）", s1.mainDisplay === "none" || s1.mainH === 0, `#main display=${s1.mainDisplay} 高=${s1.mainH}`);
  check("#app 容器不拦截 3D 的鼠标操作", s1.appPointer === "none", `pointer-events=${s1.appPointer}`);

  console.log("\n② 游戏弹窗能浮在 3D 之上（核心验收）");
  await p.evaluate(() => {
    try { if (typeof window.showModal === "function") window.showModal("测试弹窗", "3D 模式下这个面板应当可见、可点。"); } catch (e) {}
  });
  await sleep(1200);
  /* ★ 必须强制推进 CSS 动画再测。
     无头浏览器里页面若不可见，**CSS 动画不推进** ——
     `.modal-overlay` 带 `animation: fadeIn 0.2s`，实测它会永远停在
     `playState: "running"` 且 `opacity: 0`。这会让"弹窗不可见"
     这类断言**恒假**，看起来像真 bug，实际只是测试环境伪影。
     （我第一版就被它骗过一轮：以为 CSS 没生效，其实改对了。）
     解法：调 Animation.finish() 把动画推到终态，再读 computed style。 */
  await p.evaluate(() => {
    document.querySelectorAll(".modal-overlay, [class*='modal']").forEach((el) => {
      if (el.getAnimations) el.getAnimations().forEach((a) => { try { a.finish(); } catch (e) {} });
    });
  });
  const s2 = await p.evaluate(() => {
    const ov = document.querySelector(".modal-overlay") || document.querySelector('[class*="modal-overlay"]');
    if (!ov) return { found: false };
    const cs = getComputedStyle(ov);
    const r = ov.getBoundingClientRect();
    /* 3D 宿主的层级 —— 用它做对照，而不是写死 9000。
       写死的话，以后谁调了 3D 的 z-index，这条断言就失去意义了。 */
    const host = document.getElementById("scene3d-first");
    const hostZ = host ? Number(getComputedStyle(host).zIndex) : 0;
    /* 按钮：信息型弹窗可能真的没有按钮，所以只断言"**如果有**按钮，
       它必须可点"。要求必须有按钮是错的（我第一版就这么写，
       于是 showModal 造出的纯信息框永远过不了）。 */
    const btns = [...ov.querySelectorAll("button, .btn, [role=button]")];
    const stuck = btns.filter((x) => getComputedStyle(x).pointerEvents === "none");
    return {
      found: true,
      display: cs.display, visibility: cs.visibility, opacity: cs.opacity,
      pointer: cs.pointerEvents, z: Number(cs.zIndex), hostZ,
      w: Math.round(r.width), h: Math.round(r.height),
      text: (ov.innerText || "").slice(0, 40).replace(/\s+/g, " "),
      btnCount: btns.length, stuckBtns: stuck.length,
    };
  });
  check("弹窗元素存在", s2.found === true);
  if (s2.found) {
    check("弹窗可见（display/visibility/opacity 全通过）",
      s2.display !== "none" && s2.visibility !== "hidden" && Number(s2.opacity) > 0.5,
      `display=${s2.display} vis=${s2.visibility} opacity=${s2.opacity}`);
    check("弹窗有实际尺寸", s2.w > 100 && s2.h > 50, `${s2.w}x${s2.h}`);
    check("弹窗层级高于 3D 宿主", s2.z > s2.hostZ, `弹窗 z=${s2.z} > 3D z=${s2.hostZ}`);
    check("弹窗容器自身可交互", s2.pointer !== "none", `pointer-events=${s2.pointer}`);
    check("弹窗内的按钮（若有）均可点", s2.stuckBtns === 0,
      s2.btnCount ? `${s2.btnCount} 个按钮，不可点 ${s2.stuckBtns} 个` : "本弹窗无按钮（信息型）");
    check("弹窗内容正确渲染", s2.text.length > 4, `文字="${s2.text}"`);
  } else {
    console.log("   ℹ️  本环境未能触发 showModal，跳过弹窗断言");
  }

  console.log("\n③ F3 切回 2D 后主界面完整恢复");
  await p.keyboard.press("Escape");
  await sleep(500);
  await dismissModals(p);
  await p.keyboard.press("F3");
  await sleep(2000);
  const s3 = await p.evaluate(() => {
    const g = (id) => document.getElementById(id);
    const app = g("app"), main = g("main"), sidebar = g("sidebar");
    return {
      first: !!g("scene3d-first"),
      appHasYield: app ? app.classList.contains("s3-yield") : null,
      mainDisplay: main ? getComputedStyle(main).display : "(无)",
      mainH: main ? Math.round(main.getBoundingClientRect().height) : -1,
      sidebarVis: sidebar ? sidebar.offsetParent !== null : null,
    };
  });
  check("3D 已卸载", !s3.first, `挂载=${s3.first}`);
  check(".s3-yield 类已摘除", s3.appHasYield === false, `class=${s3.appHasYield}`);
  check("主界面恢复（#main 有高度）", s3.mainH > 100, `#main 高=${s3.mainH}`);
  check("#sidebar 恢复可见", s3.sidebarVis === true, `可见=${s3.sidebarVis}`);

  console.log("\n④ 无自身代码报错");
  check("页面无报错", errs.length === 0, errs.slice(0, 2).join(" | ") || "无");

  await b.close();
  await closeServer(own);
  console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════`);
  process.exit(fail ? 1 : 0);
})();
