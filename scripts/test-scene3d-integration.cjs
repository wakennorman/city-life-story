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
/* ★★ 必须带 `?mode=2d`：本脚本测的是**侧栏微缩景**那条链路
   （微缩景 → 点开全屏全景），而微缩景只存在于 2D 形态的侧栏里。
   2026-09-19 起 3D 已是**默认**形态（scene3d_bridge.js::wantsFirst）：
   不带参数时 `#app` 会被加上 `.s3-yield`、侧栏 `display:none`，
   于是 `#scene3d-mini` 的 rect 恒为 0x0、`pointer-events:none`，
   `click()` 直接抛 "Node is either not clickable" —— 症状看着像 3D 坏了，
   其实是这个脚本的前提过期了（3D-first 那条链路由 verify-3d-first.cjs 覆盖）。
   走 `?mode=2d` 只是把这个脚本**拉回它本来的测试对象**，不是绕过断言。 */
const URL = `http://127.0.0.1:${PORT}/index.html?mode=2d`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pass = 0, fail = 0;
const check = (name, ok, detail) => {
  console.log(`  ${ok ? "✅" : "❌"} ${name}${detail ? "  → " + detail : ""}`);
  ok ? pass++ : fail++;
};

/**
 * 按**仿真秒**推进（与 verify-actors.cjs 同一套方法）。
 *
 * ★ 为什么不能用 sleep：主循环把 dt clamp 到 0.05s/帧。软渲染（SwiftShader）
 *   下全屏全景一帧（1300+ draw call）要接近 1 秒墙钟，于是"按住 W 两秒"
 *   实际只跑了 **1 帧** = 0.05 仿真秒 = 位移 0.16m —— 与"按键没接线"
 *   在读数上完全一样，是一条**确定性假红**（实测连跑两次都是 0.16m）。
 *   正解：按帧累加 min(0.05, 帧间隔)，等够**仿真秒数**再看结果，
 *   并把 sim/frames/wall 一起报出来 —— 失败时能立刻区分
 *   "逻辑坏了"与"机器太慢"。
 */
const advanceSim = (page, sec) => page.evaluate((sec) => new Promise((resolve) => {
  let sim = 0, frames = 0;
  const t0 = performance.now();
  let prev = t0;
  const f = () => {
    const now = performance.now();
    sim += Math.min(0.05, (now - prev) / 1000);
    prev = now; frames++;
    if (sim >= sec || frames > 1800 || (now - t0) > 90000) {
      resolve({ sim: +sim.toFixed(2), frames, wall: +((now - t0) / 1000).toFixed(2) });
    } else requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}), sec);

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
  /* ★ [2026-09-18 修偶发] 原来这里是**直接读 DOM**，靠 enterGame 末尾的
     sleep(1600) 兜底。但 3D 侧栏微缩景是**异步挂载**的：
       renderLocation() → Scene3DBridge.sync() → mountMini() → ensureMiniHost()
     而 ensureMiniHost() 在 `#location-desc` 还没进 DOM 时**直接返回 null**
     （见 scene3d_bridge.js:146 `if (!anchor || !anchor.parentNode) return null;`）。
     于是机器负载高/首次渲染慢时，1600ms 不够 → ③ 四条一起变红
     （宿主没建、canvas 没有、三角面 0、地点 null），紧接着 ④ 因为
     `page.click("#scene3d-mini")` 找不到元素**直接抛异常终止整个测试**。
     这就是"首跑挂了、重跑就好"的根因 —— 不是功能坏，是**等待方式错**。

     正确做法：等"宿主出现"这个**条件**，而不是等一个**时长**。
     用 waitForSelector 拿到 DOM 就绪，再用 waitForFunction 等
     Scene3DBridge 报告出三角面（DOM 有了不等于 WebGL 已经画出第一帧）。
     超时给足 20s —— 修复的目标是消除偶发，不是把偶发窗口往后挪。 */
  const miniReady = await page.waitForFunction(() => {
    const host = document.getElementById("scene3d-mini");
    if (!host || !host.querySelector("canvas")) return false;
    const st = window.Scene3DBridge && window.Scene3DBridge.debugMiniStats();
    return !!(st && st.triangles > 500);
  }, { timeout: 20000, polling: 250 }).then(() => true).catch(() => false);

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
  check("微缩景宿主已创建", mini.exists, mini.exists ? `${mini.w}x${mini.h}px` : "20s 内未出现");
  check("微缩景内已渲染 canvas", mini.hasCanvas && mini.h > 20);
  check("微缩景已渲染三角面", mini.tris > 500, `${mini.tris} 三角面 / ${mini.calls} draw calls`);
  check("微缩景跟随当前地点", mini.loc === gameState.loc, `${mini.loc} vs 游戏 ${gameState.loc}`);

  console.log("\n④ 全屏全景");
  /* ★ [2026-09-18 修偶发] `page.click("#scene3d-mini")` 在元素缺失时会**抛异常**，
     直接终止整个测试 —— 上面 ⑤⑥⑦⑧⑨ 全部不跑，报告只显示前半截的失败。
     这让"一条断言坏了"伪装成"整个 3D 层崩了"，排查方向被带偏。
     改成"找不到就记一条失败、带着原因继续跑"：测试的价值在于一次跑完
     把所有问题都列出来，而不是第一个问题就掀桌。 */
  /* ★ 2026-09-19 补：上面那句"修偶发"其实只修了一半 ——
     `page.$()` 返回非 null 只说明**元素在 DOM 里**，不代表它可点。
     元素被遮挡 / 尺寸为 0 / 在视口外时，`elementHandle.click()` 会抛
     `Node is either not clickable or not an Element`，照样把整个测试打断，
     症状与当初要修的一模一样（后半截断言一个都不跑）。
     这里连抛异常也接住，并把"为什么点不了"直接查出来报出去 ——
     不查根因的话，这条红永远只能靠重跑碰运气。 */
  const miniClickable = await page.$("#scene3d-mini");
  let miniClickErr = null;
  if (miniClickable) {
    try {
      await miniClickable.click();
      /* 成功也要报一条 —— 原来只在失败时 check，成功的用例**一条计数都不产生**，
         于是"跑了但没验证"与"验证通过"在结果里长得一模一样。 */
      check("微缩景可点击（点得下去）", true, "已派发点击，等待全景打开");
    } catch (e) {
      miniClickErr = e.message;
      const why = await page.evaluate(() => {
        const el = document.getElementById("scene3d-mini");
        if (!el) return { exists: false };
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const cx = Math.round(r.left + r.width / 2), cy = Math.round(r.top + r.height / 2);
        const top = document.elementFromPoint(cx, cy);
        /* ★ 光报自己的 rect 是查不下去的：`.scene3d-mini` 的 CSS 是
           `width:100%; aspect-ratio:16/10` —— 它自己 0x0 只说明**祖先宽度为 0**，
           真正塌掉的是哪一层必须打出来。所以把祖先链一并报上。 */
        const chain = [];
        let p = el.parentElement;
        while (p && p !== document.documentElement && chain.length < 12) {
          const a = p.getBoundingClientRect();
          const acs = getComputedStyle(p);
          chain.push(`${p.tagName.toLowerCase()}${p.id ? "#" + p.id : ""}`
            + `${p.className && typeof p.className === "string" ? "." + p.className.split(/\s+/)[0] : ""}`
            + `[${Math.round(a.width)}x${Math.round(a.height)} ${acs.display}/${acs.pointerEvents}]`);
          p = p.parentElement;
        }
        return {
          rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
          display: cs.display, visibility: cs.visibility, pointerEvents: cs.pointerEvents,
          视口: [innerWidth, innerHeight],
          中心点上的元素: top ? (top.id || top.className || top.tagName) : null,
          祖先链: chain.join(" < "),
        };
      });
      check("微缩景可点击（打开全景）", false,
        `click() 抛出：${miniClickErr} ｜ 现场 ${JSON.stringify(why)}`);
    }
  } else {
    check("微缩景可点击（打开全景）", false, "#scene3d-mini 不存在，跳过 ④ 的后续断言");
  }
  /* ★★ 不能只睡固定时长。`openOverlay()` 里的 `classList.add("is-open")` 是
     **在 `createGame3D()` 之后**才执行的，而首次构建全景（编译着色器 +
     载入远端资产）实测要 2~4 秒 —— 睡 1400ms 在冷启动时必然读到"没打开"，
     热缓存时又刚好能过。这正是一条"重跑一次就好"的假红，会训练人
     "红了就再跑一遍"，比不报还糟。改成**等它真的开了**，并在超时后
     把元素建没建、有没有提示一并报出来（见下）。 */
  let opened = true;
  try {
    await page.waitForFunction(() => {
      const el = document.getElementById("scene3d-overlay");
      return !!el && el.classList.contains("is-open");
    }, { timeout: 60000, polling: 250 });
  } catch (e) { opened = false; }
  await sleep(700);   /* 给全景 3D 一点时间渲染出第一帧（下面要数三角面） */
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
      /* ★ 现场取证：`buildOverlay()` 是**惰性**的（首次 openOverlay 才建），
         所以"元素不存在"与"元素存在但没打开"是两种完全不同的故障 ——
         前者说明 openOverlay 压根没跑（或提前 return），
         后者说明跑了但卡在中途。不区分就只能靠猜。 */
      elExists: !!el,
      overlayCount: document.querySelectorAll("#scene3d-overlay").length,
      overlayToast: (() => {
        const t = document.querySelector(".scene3d-overlay__toast");
        return t && !t.hidden ? t.textContent : null;
      })(),
      domToast: (() => {
        const t = document.querySelector(".scene3d-toast, .s3h-toast");
        return t && !t.hidden ? t.textContent : null;
      })(),
    };
  });
  check("全景已打开", ov.open,
    ov.open ? undefined
      : `${opened ? "类已加但读数不一致" : "20s 内未出现 is-open"}`
        + ` ｜ 元素${ov.elExists ? "已建" : "未建"}（共 ${ov.overlayCount} 个）`
        + ` ｜ 全景内提示=${ov.overlayToast || "无"} ｜ DOM 提示=${ov.domToast || "无"}`);
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
  /* ★ 2026-09-19 补：`debugOverlayPos()` 在全景没打开时返回 null，
     而下面直接读 `.x` → TypeError，整个测试再次被打断（与 ④ 同一个病）：
     一个"上游没准备好"的状态，被写成了"下游崩溃"。
     这里把 null 当成一条带原因的红，继续往下跑。 */
  const posBefore = await page.evaluate(() => window.Scene3DBridge.debugOverlayPos());
  if (!posBefore) {
    check("按 W 角色真实位移", false, "全景未打开 → debugOverlayPos() 为 null（根因见 ④）");
  } else {
    await page.keyboard.down("KeyW");
    /* ★ 等**仿真秒**，不是墙钟秒 —— 见 advanceSim 顶注。
       取 0.5 仿真秒（≈1.5m）而不是更多：阈值要的是"按键确实驱动了角色"，
       0.5s 已有 6 倍余量；而软渲染下这段等 1 秒要花 ~50 秒墙钟，
       持续重渲染期间实测偶发过一次 tab 崩溃 —— 窗口越短越稳。 */
    const adv = await advanceSim(page, 0.5);
    await page.keyboard.up("KeyW");
    await sleep(400);
    const walk = await page.evaluate(() => ({
      pos: window.Scene3DBridge.debugOverlayPos(),
      fps: (window.Scene3DBridge.debugOverlayStats() || {}).fps || 0,
    }));
    const moved = (walk.pos && posBefore)
      ? Math.hypot(walk.pos.x - posBefore.x, walk.pos.z - posBefore.z) : 0;
    /* 此断言验证的是"按键确实驱动了角色"，不是"走得够快"。
       阈值 0.25m 现在是**仿真秒口径**下的（0.8 仿真秒 × 走路速度），
       不再受帧率压制 —— 报出 sim/frames/wall 是为了让"机器慢"与"逻辑坏"
       能被一眼分开。 */
    check("按 W 角色真实位移", moved > 0.25,
      `${moved.toFixed(2)}m  (${posBefore.x.toFixed(1)}, ${posBefore.z.toFixed(1)}) → `
      + `(${walk.pos ? walk.pos.x.toFixed(1) : "?"}, ${walk.pos ? walk.pos.z.toFixed(1) : "?"})`
      + ` · 仿真 ${adv.sim}s/${adv.frames} 帧 · 墙钟 ${adv.wall}s · 软渲染 ${walk.fps} fps`);
  }

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
    /* ★ [2026-09-18 修偶发] 原来是 sleep(700) 后直接读 debugFocused()。
       但"聚焦"不是瞬移的同步结果 —— 它是**玩家每帧跑的距离判定**
       （走到热点半径内才 setHotspot）。sleep(700) 是按帧率拍的，
       机器一慢就还没跑到判定帧，于是"未聚焦"。
       改成等条件：轮询到真的聚焦为止，最多 5s。
       这条同时覆盖了下面"按 E 执行行动"—— 没有聚焦就按 E 必然无事发生，
       两条断言是**同一个根因**，修一处即可。 */
    const focused = await page.waitForFunction(() => !!window.Scene3DBridge.debugFocused(),
      { timeout: 5000, polling: 100 }).then(() => true).catch(() => false);
    const fc = await page.evaluate(() => window.Scene3DBridge.debugFocused());
    check("瞬移到热点后已聚焦", focused && !!fc,
      fc ? `${fc.kind}:${fc.id}` : "5s 内未进入热点半径");
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
    /* 同 ④：元素缺失 / 点不动都不要掀桌，记一条失败继续跑；
       且成功也要报一条 —— 只在失败时 check 的话，"跑了"与"通过了"在结果里没区别。 */
    const mc = await page.$("#scene3d-mini");
    if (!mc) {
      check("可重新打开全景", false, "#scene3d-mini 不存在");
    } else {
      try {
        await mc.click();
        check("可重新打开全景（点得下去）", true, "已派发点击");
      } catch (e) {
        check("可重新打开全景", false, `click() 抛出：${e.message}`);
      }
      /* ★ 同样不能睡固定时长：`is-open` 是 openOverlay 里**最后**才加的，
         而它前面那段 `overlay3d.loadLocation()` 是同步重建整条街。
         ★ 上限给到 60s 且用 250ms 轮询（而不是默认的 rAF 轮询）：
         实测这台机器跑全屏全景只有 ~0.5 fps（16 帧花了 30.5 秒墙钟），
         20s 的等待在这种帧率下**卡在门槛上**，会变成新的假红源。 */
      try {
        await page.waitForFunction(() => {
          const el = document.getElementById("scene3d-overlay");
          return !!el && el.classList.contains("is-open");
        }, { timeout: 60000, polling: 250 });
      } catch (e) {
        check("重新打开后全景确实处于打开态", false, "60s 内未出现 is-open");
      }
    }
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
  /* ★★ 必须先确认它**开着**，再按 Esc。
     原来只断言"按完 Esc 是关的" —— 而"从来没打开过"同样满足这一句，
     于是这条断言在最该红的场景（全景压根打不开）下反而是绿的。
     这种**空真**（vacuous truth）比直接报红更糟：它给了一个假的安全感。
     与 ⑤-b 那两条一样，前置条件要单独断言出来。 */
  const openBeforeClose = await page.evaluate(() => {
    const el = document.getElementById("scene3d-overlay");
    return !!el && el.classList.contains("is-open");
  });
  check("关闭前全景确实处于打开态（前置条件）", openBeforeClose,
    openBeforeClose ? "is-open 存在" : "按 Esc 前全景就没打开 → 下面的关闭断言无意义");
  if (openBeforeClose) {
    await page.keyboard.press("Escape");
    await sleep(600);
    const closed = await page.evaluate(() => {
      const el = document.getElementById("scene3d-overlay");
      return !el || !el.classList.contains("is-open");
    });
    check("全景可正常关闭", closed);
  }

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
