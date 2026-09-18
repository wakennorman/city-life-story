/**
 * 3D 场景层 · 真实游戏集成测试
 *
 * 走真实玩家路径（点按钮进游戏，非 mock），验证：
 *   1. 侧栏微缩景出现并渲染
 *   2. 点微缩景 → 全屏全景打开
 *   3. 全景内角色可走动
 *   4. 热点 id → 游戏行动 id 的映射正确
 *   5. 按 E 触发热点 → 真实游戏行动被执行（AP/资金/日志发生变化）
 *   6. 切换地点 → 微缩景跟随更新
 *   7. 全景可关闭
 *
 * 用法：node scripts/test-scene3d-integration.cjs
 * 自给自足：src/ 的本地服务不存在会自动起一个（用完关掉），无需先手动开 python -m http.server。
 */

const path = require("path");
const { ensureServer, closeServer } = require("./lib/serve.cjs");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 8931;
const URL = `http://127.0.0.1:${PORT}/index.html`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pass = 0, fail = 0;
const check = (name, ok, detail) => {
  console.log(`  ${ok ? "✅" : "❌"} ${name}${detail ? "  → " + detail : ""}`);
  ok ? pass++ : fail++;
};

/** 真实玩家路径进游戏 */
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
  const ownServer = await ensureServer({ root: path.join(__dirname, "..", "src"), port: PORT, label: "游戏 src" });
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
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });

  const errors = [];
  const noise = [];
  // 外部 RSS/新闻源在本地开发环境下必然跨域失败，与 3D 层无关，单独归类不参与断言。
  // 之所以敢过滤 "Failed to load resource"，是因为 ② 已经断言 Scene3D 内核存在且 ③④ 断言真的渲染出了三角面 ——
  // 万一 3D bundle 404，那些断言会先挂。
  const NOISE = /36kr\.com|CORS policy|ERR_FAILED|Failed to load resource|status of 4\d\d|net::ERR/i;
  const classify = (s) => (NOISE.test(s) ? noise : errors).push(s);
  page.on("pageerror", (e) => errors.push("[pageerror] " + String(e.message || e))); // 真异常一律致命
  page.on("console", (m) => { if (m.type() === "error") classify("[console] " + m.text()); });
  page.on("requestfailed", (r) => { if (!/^http:\/\/127\.0\.0\.1/.test(r.url())) noise.push("[reqfail] " + r.url()); });

  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  // 上一轮跑完会把进度写进 localStorage，导致下一轮变成"续档"、开局界面不同 → 测试必须每轮冷启
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload({ waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1000);

  console.log("=== 3D 场景层 · 真实游戏集成测试 ===\n");
  console.log("① 进入游戏");
  await enterGame(page);

  const gameState = await page.evaluate(() => {
    const app = document.getElementById("app");
    const st = typeof StateManager !== "undefined" ? StateManager.getState() : null;
    return {
      appVisible: !!app && getComputedStyle(app).display !== "none",
      loc: st && st.trade ? st.trade.currentLocation : null,
      ap: st && st.resources ? st.resources.ap : null,
      bridgeAvailable: !!(window.Scene3DBridge && window.Scene3DBridge.available()),
      coreOk: !!(window.Scene3D && window.Scene3D.createGame3D && window.Scene3D.gamedata),
      locCount: window.Scene3D && window.Scene3D.gamedata
        ? Object.keys(window.Scene3D.gamedata.locations).length : 0,
    };
  });
  check("已进入游戏主界面", gameState.appVisible, `地点=${gameState.loc}`);

  console.log("\n② 3D 内核已加载");
  check("window.Scene3D 暴露 createGame3D", gameState.coreOk);
  check("内联 gamedata 完整", gameState.locCount === 29, `${gameState.locCount} 个地点`);
  check("Scene3DBridge 可用", gameState.bridgeAvailable);

  console.log("\n③ 侧栏微缩景");
  const mini = await page.evaluate(() => {
    const host = document.getElementById("scene3d-mini");
    const canvas = host && host.querySelector("canvas");
    const stats = window.Scene3DBridge.debugMiniStats();
    return {
      exists: !!host,
      hasCanvas: !!canvas,
      w: host ? Math.round(host.getBoundingClientRect().width) : 0,
      h: host ? Math.round(host.getBoundingClientRect().height) : 0,
      loc: window.Scene3DBridge.debugMiniLoc(),
      tris: stats ? stats.triangles : 0,
      calls: stats ? stats.calls : 0,
    };
  });
  check("微缩景宿主已创建", mini.exists, mini.exists ? `${mini.w}x${mini.h}px` : "");
  check("微缩景内已渲染 canvas", mini.hasCanvas && mini.h > 20);
  check("微缩景已渲染三角面", mini.tris > 500, `${mini.tris} 三角面 / ${mini.calls} draw calls`);
  check("微缩景跟随当前地点", mini.loc === gameState.loc, `${mini.loc} vs 游戏 ${gameState.loc}`);

  console.log("\n④ 全屏全景");
  await page.click("#scene3d-mini");
  await sleep(1400);
  const ov = await page.evaluate(() => {
    const el = document.getElementById("scene3d-overlay");
    const stage = el && el.querySelector(".scene3d-overlay__stage");
    const stats = window.Scene3DBridge.debugOverlayStats();
    return {
      open: !!el && el.classList.contains("is-open"),
      hasCanvas: !!(stage && stage.querySelector("canvas")),
      tris: stats ? stats.triangles : 0,
      calls: stats ? stats.calls : 0,
      hotspots: window.Scene3DBridge.debugHotspots(),
      loc: window.Scene3DBridge.debugOverlayLoc(),
    };
  });
  check("全景已打开", ov.open);
  check("全景内已渲染 3D", ov.tris > 500, `${ov.tris} 三角面 / ${ov.calls} draw calls`);
  check("全景热点已生成", ov.hotspots.length > 0, `${ov.hotspots.length} 个：${ov.hotspots.slice(0, 5).join(", ")}`);

  console.log("\n⑤ 热点 → 游戏行动 映射");
  const mapping = await page.evaluate(() => {
    const B = window.Scene3DBridge;
    const probe = [
      { kind: "work", id: "waste_recycling" },
      { kind: "service", id: "slum_canteen" },
      { kind: "extra", id: "internet_bar" },
      { kind: "risk", id: "illegal_steal_battery" },
      { kind: "look", id: "slum_look" },
    ];
    return probe.map((h) => ({ ...h, mapped: B.toGameActionId(h) }));
  });
  const mapOk =
    mapping[0].mapped === "job_waste_recycling" &&
    mapping[1].mapped === "amenity_slum_canteen" &&
    mapping[2].mapped === "internet_bar" &&
    mapping[3].mapped === "illegal_steal_battery" &&
    mapping[4].mapped === null;
  check("四类热点映射到正确行动 id", mapOk,
    mapping.map((m) => `${m.kind}→${m.mapped}`).join("  "));

  console.log("\n⑥ 走动（真实按键，量位移）");
  const posBefore = await page.evaluate(() => window.Scene3DBridge.debugOverlayPos());
  await page.keyboard.down("KeyW");
  await sleep(2000);
  await page.keyboard.up("KeyW");
  await sleep(400);
  const walk = await page.evaluate(() => ({
    pos: window.Scene3DBridge.debugOverlayPos(),
    fps: (window.Scene3DBridge.debugOverlayStats() || {}).fps || 0,
  }));
  const moved = Math.hypot(walk.pos.x - posBefore.x, walk.pos.z - posBefore.z);
  // 注意：dt 在主循环里被 clamp 到 0.05s，软渲染(SwiftShader)下 fps 只有个位数，
  // 位移量级受帧率压制。此断言验证的是"按键确实驱动了角色"，不是"走得够快"。
  check("按 W 角色真实位移", moved > 0.25,
    `${moved.toFixed(2)}m  (${posBefore.x.toFixed(1)}, ${posBefore.z.toFixed(1)}) → (${walk.pos.x.toFixed(1)}, ${walk.pos.z.toFixed(1)}) · 软渲染 ${walk.fps} fps`);

  console.log("\n⑦ 按 E 触发 → 真实游戏行动");
  // 挑一个「在当前阶段/地点确实可执行」的热点，专测最关键的接缝
  const pick = await page.evaluate(() => {
    const B = window.Scene3DBridge;
    const st = StateManager.getState();
    const raw = getAvailableActions(st) || [];
    const byId = {};
    raw.forEach((a) => { byId[a.id] = a; });
    const spots = B.debugHotspots();
    let enabled = null, anyMapped = null;
    for (const s of spots) {
      const i = s.indexOf(":");
      const kind = s.slice(0, i), id = s.slice(i + 1);
      const aid = B.toGameActionId({ kind, id });
      if (!aid) continue;
      if (!anyMapped) anyMapped = { kind, id, aid };
      if (byId[aid] && !byId[aid].disabled) { enabled = { kind, id, aid }; break; }
    }
    return {
      enabled, anyMapped, spotCount: spots.length,
      // 字段名逐一核对过：AP 在 state.player.actionPoints，现金在 state.resources.cash
      before: { ap: st.player.actionPoints, cash: st.resources.cash },
    };
  });
  check("全景内存在可映射到游戏行动的热点", !!pick.anyMapped,
    `${pick.spotCount} 个热点，首个可映射=${pick.anyMapped ? pick.anyMapped.aid : "无"}`);

  if (pick.enabled) {
    const tp = await page.evaluate((t) => window.Scene3DBridge.debugTeleportToHotspot(t.kind, t.id), pick.enabled);
    await sleep(700);
    const fc = await page.evaluate(() => window.Scene3DBridge.debugFocused());
    check("瞬移到热点后已聚焦", !!fc, fc ? `${fc.kind}:${fc.id}` : "未聚焦");
    await page.keyboard.press("KeyE");
    await sleep(1000);
    const after = await page.evaluate(() => {
      const el = document.getElementById("scene3d-overlay");
      const st = StateManager.getState();
      const t = el && el.querySelector(".scene3d-overlay__toast");
      return {
        closed: !el || !el.classList.contains("is-open"),
        toast: t && !t.hidden ? t.textContent : "",
        ap: st.player.actionPoints, cash: st.resources.cash,
      };
    });
    const delta = pick.before.ap !== after.ap || pick.before.cash !== after.cash;
    check("按 E 真的执行了游戏行动（状态变化 或 面板关闭）",
      after.closed || delta,
      `行动=${tp ? tp.actionId : pick.enabled.aid} · 关闭=${after.closed} · AP ${pick.before.ap}→${after.ap} · 现金 ${pick.before.cash}→${after.cash}` +
      (after.toast ? ` · toast="${after.toast}"` : ""));
    if (!after.closed && after.toast) {
      // 未关闭但给出了明确提示，也是正确的接线行为
      check("未执行时有明确原因提示", after.toast.length > 2, after.toast);
    }
  } else {
    // 该地点/阶段没有可执行热点 → 退化为验证「无对应行动」提示链路
    await page.evaluate(() => window.Scene3DBridge.debugTeleportToHotspot("risk", null)
      || window.Scene3DBridge.debugTeleportToHotspot("work", null));
    await sleep(700);
    await page.keyboard.press("KeyE");
    await sleep(900);
    const fb = await page.evaluate(() => {
      const el = document.getElementById("scene3d-overlay");
      const t = el && el.querySelector(".scene3d-overlay__toast");
      return t && !t.hidden ? t.textContent : "";
    });
    check("无可执行热点时给出明确提示（非静默失败）", fb.length > 0, fb || "（无提示）");
  }

  // 重新打开全景，供后续步骤使用
  const stillOpen = await page.evaluate(() => {
    const el = document.getElementById("scene3d-overlay");
    return !!el && el.classList.contains("is-open");
  });
  if (!stillOpen) {
    await page.click("#scene3d-mini");
    await sleep(1400);
  }

  console.log("\n⑧ 切换地点");
  const switched = await page.evaluate(async () => {
    const st = StateManager.getState();
    const from = st.trade.currentLocation;
    const to = from === "slum" ? "commercialDist" : "slum";
    st.trade.currentLocation = to;
    // renderLocation 需要 state 入参（render.js:229）
    if (typeof renderLocation === "function") renderLocation(st);
    else if (window.Scene3DBridge) window.Scene3DBridge.sync();
    return { from, to };
  });
  await sleep(1600);
  const afterSwitch = await page.evaluate(() => ({
    miniLoc: window.Scene3DBridge.debugMiniLoc(),
    tris: (window.Scene3DBridge.debugMiniStats() || {}).triangles || 0,
  }));
  check("切换地点后微缩景跟随更新", afterSwitch.miniLoc === switched.to,
    `${switched.from} → ${afterSwitch.miniLoc}（${afterSwitch.tris} 三角面）`);

  console.log("\n⑨ 关闭全景");
  await page.keyboard.press("Escape");
  await sleep(600);
  const closed = await page.evaluate(() => {
    const el = document.getElementById("scene3d-overlay");
    return !el || !el.classList.contains("is-open");
  });
  check("全景可正常关闭", closed);

  console.log("\n=== 页面报错 ===");
  if (errors.length) errors.slice(0, 8).forEach((e) => console.log("   ❌ " + e.slice(0, 160)));
  else console.log("   （无）");
  check("无页面报错（自身代码/3D 层）", errors.length === 0, errors.length ? `${errors.length} 条` : "0 条");
  if (noise.length) console.log(`   ℹ️  已忽略 ${noise.length} 条外部资源噪声（RSS 跨域等，与 3D 无关）`);

  console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════`);
  await browser.close();
  await closeServer(ownServer);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error("集成测试失败:", e); process.exit(1); });
