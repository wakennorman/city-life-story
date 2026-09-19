/**
 * 验收：默认 3D + 键盘真的能用 + 逃生口还在。
 *
 * 这是恒稳 2026-09-19 提的三个问题的直接断言：
 *   ① 打开就应该是 3D（不要再手打 ?mode=3d）
 *   ② Tab / M / R 在 3D 里必须真的起作用
 *   ③ 必须有办法回到 2D（逃生口）
 */
const path = require("path");
const { ensureServer, closeServer } = require("./lib/serve.cjs");
const ROOT = path.resolve(__dirname, "..");
const PORT = 8977;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pass = 0, fail = 0;
const check = (name, ok, detail) => {
  console.log(`  ${ok ? "✅" : "❌"} ${name}${detail ? "  → " + detail : ""}`);
  ok ? pass++ : fail++;
};

(async () => {
  const own = await ensureServer({ root: ROOT, port: PORT, label: "accept" });
  const puppeteer = require("puppeteer-core");
  const b = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });

  const openGame = async (url) => {
    const p = await b.newPage();
    await p.setViewport({ width: 1440, height: 900 });
    const errs = [];
    p.on("pageerror", (e) => errs.push(String(e.message || e).slice(0, 200)));
    await p.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await sleep(3000);
    await p.evaluate(() => { try { window.startNewGame(); } catch (e) {} });
    await sleep(8000);
    return { p, errs };
  };

  const snap = (p) => p.evaluate(() => {
    const f = document.getElementById("scene3d-first");
    const app = document.getElementById("app");
    const cv = document.querySelector("#scene3d-first canvas");
    /* 让位是否彻底：5 个界面都该收起来 */
    const yieldIds = ["app", "welcome-screen", "mode-select-screen", "scenario-select-screen", "sandbox-screen"];
    const stillVisible = yieldIds.filter((id) => {
      const el = document.getElementById(id);
      return el && getComputedStyle(el).display !== "none";
    });
    return {
      mounted: !!f,
      canvas: cv ? `${cv.width}x${cv.height}` : null,
      appDisplay: app ? getComputedStyle(app).display : "(无 #app)",
      appInert: app ? !!app.inert : null,
      stillVisible,
    };
  });

  /* 3D 的 shell 句柄：走桥接的公开调试口。
     注意 `Scene3DBridge.first` 是**对象**（有 mount/unmount/active/shell），
     不是函数 —— 一开始我按函数调用了，报 "first is not a function"。 */
  const yaw = (p) => p.evaluate(() => {
    const f = window.Scene3DBridge && window.Scene3DBridge.first;
    const shell = f && f.shell;
    return shell && shell.view3d ? shell.view3d.view.yaw : null;
  });

  console.log("\n① 默认打开即 3D（不带任何参数）");
  {
    const { p, errs } = await openGame(`http://127.0.0.1:${PORT}/dist/index.html`);
    const s = await snap(p);
    check("默认 URL 就挂上了 3D", s.mounted, `挂载=${s.mounted} canvas=${s.canvas}`);
    check("2D 界面已让位（display:none）", s.appDisplay === "none", `#app display=${s.appDisplay}`);
    check("★ 5 个界面全部收起来了（Tab 不会跑到原网页）",
      s.stillVisible.length === 0,
      s.stillVisible.length ? `仍在显示: ${s.stillVisible.join(", ")}` : "app/welcome/mode-select/scenario-select/sandbox 均已收起");
    check("无页面报错", errs.length === 0, errs.slice(0, 2).join(" | ") || "无");

    console.log("\n② 键盘在 3D 里真的起作用");
    const before = await p.evaluate(() => {
      const tray = document.querySelector("#scene3d-first .s3h [data-f='tray']");
      const el = document.querySelector("#scene3d-first .s3h-tray");
      return { trayEl: !!el, open: el ? el.classList.contains("is-open") : null };
    });
    await p.click("#scene3d-first .s3s3d-stage");
    await p.keyboard.press("Tab");
    await sleep(600);
    const afterTab = await p.evaluate(() => {
      const el = document.querySelector("#scene3d-first .s3h-tray");
      return { open: el ? el.classList.contains("is-open") : null };
    });
    check("Tab 展开了行动托盘", afterTab.open === true, `展开前=${before.open} → 展开后=${afterTab.open}`);

    await p.keyboard.press("Tab");
    await sleep(600);
    const afterTab2 = await p.evaluate(() => {
      const el = document.querySelector("#scene3d-first .s3h-tray");
      return { open: el ? el.classList.contains("is-open") : null };
    });
    check("再按 Tab 收起托盘", afterTab2.open === false, `→ ${afterTab2.open}`);

    await p.keyboard.press("KeyM");
    await sleep(700);
    const afterM = await p.evaluate(() => {
      const el = document.querySelector("#scene3d-first .s3h-map");
      return { open: el ? !el.hidden : null, locs: document.querySelectorAll("#scene3d-first .s3h-loc").length };
    });
    check("M 打开了去处列表", afterM.open === true, `可见=${afterM.open} 地点数=${afterM.locs}`);

    await p.keyboard.press("Escape");
    await sleep(600);
    const afterEsc = await p.evaluate(() => {
      const el = document.querySelector("#scene3d-first .s3h-map");
      return { open: el ? !el.hidden : null };
    });
    check("Escape 收起去处列表", afterEsc.open === false, `→ ${afterEsc.open}`);

    const yawBefore = await yaw(p);
    await p.evaluate(() => {
      const st = document.querySelector("#scene3d-first .s3s3d-stage");
      const r = st.getBoundingClientRect();
      st.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: r.width / 2, clientY: r.height / 2, button: 0, pointerId: 1 }));
      st.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: r.width / 2 + 200, clientY: r.height / 2, pointerId: 1 }));
      st.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: r.width / 2 + 200, clientY: r.height / 2, pointerId: 1 }));
    });
    await sleep(500);
    const yawAfter = await yaw(p);
    check("拖拽转了视角", yawBefore != null && Math.abs(yawAfter - yawBefore) > 0.1,
      `yaw ${yawBefore == null ? "?" : yawBefore.toFixed(3)} → ${yawAfter == null ? "?" : yawAfter.toFixed(3)}`);

    await p.keyboard.press("KeyR");
    await sleep(500);
    const yawReset = await yaw(p);
    check("R 键回正视角", yawReset != null && Math.abs(yawReset - 0.38) < 0.15,
      `yaw=${yawReset == null ? "?" : yawReset.toFixed(3)}（默认 0.380）`);

    console.log("\n③ F3 能切回 2D，再切回 3D");
    await p.keyboard.press("F3");
    await sleep(1500);
    const s2d = await p.evaluate(() => {
      const ids = ["app", "welcome-screen", "mode-select-screen", "scenario-select-screen", "sandbox-screen"];
      return {
        mounted: !!document.getElementById("scene3d-first"),
        visible: ids.filter((id) => { const e = document.getElementById(id); return e && getComputedStyle(e).display !== "none"; }),
        inert: ids.filter((id) => { const e = document.getElementById(id); return e && e.inert; }),
        anyInert: ids.some((id) => { const e = document.getElementById(id); return e && e.inert; }),
      };
    });
    check("F3 切回 2D：3D 已卸", !s2d.mounted, `挂载=${s2d.mounted}`);
    check("F3 切回 2D：至少有一块原界面恢复可见", s2d.visible.length > 0,
      `恢复可见: ${s2d.visible.join(", ") || "（无）"}`);
    check("F3 切回 2D：inert 已全部解除", s2d.anyInert === false,
      s2d.inert.length ? `仍被 inert: ${s2d.inert.join(", ")}` : "已全部解除");

    await p.keyboard.press("F3");
    await sleep(1800);
    const s3d = await snap(p);
    check("再按 F3 回到 3D（且界面又收起来了）",
      s3d.mounted && s3d.stillVisible.length === 0,
      `挂载=${s3d.mounted} 仍可见=${s3d.stillVisible.join(", ") || "无"}`);
    await p.close();
  }

  console.log("\n④ 逃生口 ?mode=2d 强制 2D");
  {
    const { p, errs } = await openGame(`http://127.0.0.1:${PORT}/dist/index.html?mode=2d`);
    const s = await p.evaluate(() => {
      const ids = ["app", "welcome-screen", "mode-select-screen", "scenario-select-screen", "sandbox-screen"];
      return {
        mounted: !!document.getElementById("scene3d-first"),
        visible: ids.filter((id) => { const e = document.getElementById(id); return e && getComputedStyle(e).display !== "none"; }),
        inert: ids.filter((id) => { const e = document.getElementById(id); return e && e.inert; }),
      };
    });
    check("?mode=2d 不进 3D", !s.mounted, `挂载=${s.mounted}`);
    check("?mode=2d 下原界面未被收起、未被 inert",
      s.visible.length > 0 && s.inert.length === 0,
      `可见=${s.visible.length} 块 · inert=${s.inert.length} 块`);
    check("无页面报错", errs.length === 0, errs.slice(0, 2).join(" | ") || "无");
    await p.close();
  }

  console.log("\n⑤ 老链接 ?mode=3d 仍然有效（向后兼容）");
  {
    const { p } = await openGame(`http://127.0.0.1:${PORT}/dist/index.html?mode=3d`);
    const s = await snap(p);
    check("?mode=3d 仍进 3D", s.mounted, `挂载=${s.mounted}`);
    await p.close();
  }

  await b.close();
  await closeServer(own);

  console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════`);
  process.exit(fail ? 1 : 0);
})();
