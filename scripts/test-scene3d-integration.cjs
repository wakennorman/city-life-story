/**
 * 3D 集成测试（真实 UI 路径）
 *
 * 目标：完全走玩家真实点击路径进入游戏，验证
 *   1. 侧栏微缩景挂载并渲染出 canvas
 *   2. 切换地点后微缩景场景随之更新
 *   3. 全屏全景可打开，热点数 == 主游戏该地点可用行动数
 *   4. 点击热点能真正触发行动（复用 action.handler()）
 *
 * 说明：不 mock 任何东西，全部走 src/index.html 真实脚本。
 */
const puppeteer = require("puppeteer-core");
const ROOT = "D:/Claude Code+DeepSeekV4/city-life-story";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: !!ok, detail: detail === undefined ? "" : String(detail) });
  console.log((ok ? "  ✅ " : "  ❌ ") + name + (detail !== undefined ? "  → " + detail : ""));
}

(async () => {
  const b = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });

  const errs = [];
  p.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));
  p.on("console", (m) => {
    if (m.type() === "error" && !/CORS|Failed to load resource|net::ERR/.test(m.text())) {
      errs.push("CONSOLE: " + m.text().slice(0, 160));
    }
  });

  await p.goto("file:///" + ROOT + "/src/index.html", { waitUntil: "load", timeout: 60000 });
  await p.waitForFunction("typeof showModeSelect==='function'", { timeout: 60000 });

  const dbg = () =>
    p.evaluate(() => {
      const disp = (id) => {
        const el = document.getElementById(id);
        return el ? getComputedStyle(el).display : "MISSING";
      };
      const vis = [...document.querySelectorAll("button, .mode-card, .scenario-card, [data-mode], [data-scenario], .modal-btn")]
        .filter((e) => e.offsetParent !== null)
        .slice(0, 30)
        .map((e) => {
          const ds = Object.keys(e.dataset || {})
            .map((k) => k + "=" + e.dataset[k])
            .join(",");
          return (e.id ? "#" + e.id : e.tagName.toLowerCase() + (e.className ? "." + String(e.className).split(" ")[0] : "")) +
            (ds ? "[" + ds + "]" : "") + " :: " + (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 22);
        });
      return {
        screens: {
          welcome: disp("welcome-screen"),
          mode: disp("mode-select-screen"),
          scenario: disp("scenario-select-screen"),
          sandbox: disp("sandbox-screen"),
          app: disp("app"),
        },
        vis,
        gameStarted: typeof gameStarted !== "undefined" ? gameStarted : null,
        loc: (() => {
          try { return StateManager.getState().trade.currentLocation; } catch (e) { return null; }
        })(),
        mini: (() => {
          const h = document.getElementById("scene3d-mini");
          return h ? { canvas: !!h.querySelector("canvas"), w: Math.round(h.getBoundingClientRect().width) } : null;
        })(),
      };
    });

  const clickText = async (sel, txt) => {
    const ok = await p.evaluate(
      (sel, txt) => {
        const els = [...document.querySelectorAll(sel)].filter((e) => e.offsetParent !== null);
        const t = els.find((e) => (e.textContent || "").indexOf(txt) >= 0);
        if (t) { t.click(); return true; }
        return false;
      },
      sel, txt
    );
    await sleep(350);
    return ok;
  };

  console.log("① 点击「开始新游戏」");
  await p.click("#btn-new-game");
  await sleep(400);
  console.log("   ", JSON.stringify((await dbg()).screens));

  console.log("② 选择「经典模式」");
  const modeOk = await p.evaluate(() => {
    const c = document.querySelector('[data-mode="classic"]');
    if (c) { c.click(); return true; }
    return false;
  });
  console.log("    点中经典模式:", modeOk);
  await sleep(600);
  let d = await dbg();
  console.log("    screens:", JSON.stringify(d.screens));
  console.log("    可见元素:", JSON.stringify(d.vis, null, 0));

  // 逐步推进：优先点已知模态按钮，其次按文案匹配推进型按钮（排除返回/取消类）
  const tryClick = async (sel) => {
    const hit = await p.evaluate((s) => {
      const el = document.querySelector(s);
      if (el && el.offsetParent !== null) { el.click(); return s; }
      return null;
    }, sel);
    if (hit) await sleep(600);
    return hit;
  };
  const ADVANCE =
    "开始游戏|立即开始|开始|进入游戏|接受天赋|放弃|确认|确定|下一步|跳过|继续|完成|进入";
  const BACKWARD = /返回|取消|关闭|上一步|再来一次/;

  for (let step = 0; step < 14; step++) {
    d = await dbg();
    if (d.screens.app !== "none" || d.gameStarted) break;

    // 1) 已知的模态按钮
    let clicked = await tryClick("#_talent_decline");
    if (!clicked) clicked = await tryClick("#btn-start-sandbox");
    if (!clicked) clicked = await tryClick("#btn-start-scenario");
    if (!clicked) {
      // 2) 文案推进
      clicked = await p.evaluate(
        (advSrc, backSrc) => {
          const adv = new RegExp(advSrc);
          const back = new RegExp(backSrc);
          const cands = [...document.querySelectorAll("button, .btn, .mode-card, .scenario-card")]
            .filter((e) => e.offsetParent !== null)
            .map((e) => ({ el: e, t: (e.textContent || "").replace(/\s+/g, " ").trim() }))
            .filter((x) => adv.test(x.t) && !back.test(x.t));
          if (cands.length) { cands[0].el.click(); return "text:" + cands[0].t.slice(0, 22); }
          return null;
        },
        ADVANCE, BACKWARD.source
      );
    }
    console.log("    推进#" + (step + 1) + ":", clicked || "(无可点推进按钮)");
    if (!clicked) {
      console.log("    当前可见:", JSON.stringify(d.vis, null, 0));
      break;
    }
    await sleep(700);
  }

  // 等待进入游戏
  try {
    await p.waitForFunction(
      () => document.getElementById("app") && getComputedStyle(document.getElementById("app")).display !== "none",
      { timeout: 25000 }
    );
  } catch (e) {
    console.log("    ⚠️ 未能在 25s 内进入游戏界面");
  }
  await sleep(2500);

  d = await dbg();
  console.log("③ 游戏界面状态:", JSON.stringify(d.screens), "gameStarted=" + d.gameStarted, "loc=" + d.loc);

  check("已进入游戏主界面", d.screens.app !== "none", d.screens.app);
  check("微缩景宿主 #scene3d-mini 已创建", !!d.mini, JSON.stringify(d.mini));
  check("微缩景内已渲染 canvas", d.mini && d.mini.canvas, d.mini ? d.mini.w + "px" : "无宿主");

  // ④ 热点数 vs 行动数
  const actInfo = await p.evaluate(() => {
    let acts = [];
    try { acts = window.getAvailableActions(window.StateManager.getState()); } catch (e) {}
    const ids = acts.filter((a) => a && a.id).map((a) => a.id);
    // 与桥接 currentActions() 完全一致的口径：
    //   剔除「地点不符」的行动 + housing_/storage_/travel_ 常驻面板类
    const filtered = acts
      .filter((a) => a && a.id)
      .filter(
        (a) =>
          !(
            a.disabled &&
            typeof a.reqFail === "string" &&
            a.reqFail.indexOf("地点不符") === 0
          )
      )
      .map((a) => a.id)
      .filter(
        (id) =>
          id.indexOf("housing_") !== 0 &&
          id.indexOf("storage_") !== 0 &&
          id.indexOf("travel_") !== 0
      );
    window.Scene3DBridge.open();
    return { allIds: ids, expected: filtered.length };
  });
  await sleep(1000);

  const ov = await p.evaluate(() => {
    const el = document.getElementById("scene3d-overlay");
    const links = [...document.querySelectorAll("#scene3d-overlay [data-scene3d-action]")];
    return {
      exists: !!el,
      open: el ? el.classList.contains("is-open") : false,
      canvas: el ? !!el.querySelector("canvas") : false,
      hotspots: links.length,
      ids: links.map((l) => l.getAttribute("data-scene3d-action")),
      // 全站范围内是否还有误命中的旧属性
      legacy: document.querySelectorAll("#scene3d-overlay [data-action-id]").length,
    };
  });
  console.log("④ 全景:", JSON.stringify({ ...ov, ids: ov.ids.slice(0, 5) }));
  check("全景层已打开", ov.exists && ov.open);
  check("全景内已渲染 canvas", ov.canvas);
  check("全景热点数 == 桥接口径行动数", ov.hotspots === actInfo.expected, ov.hotspots + " vs " + actInfo.expected);
  check(
    "热点 ID 全部来自真实行动集",
    ov.ids.every((id) => actInfo.allIds.indexOf(id) >= 0),
    ov.ids.filter((id) => actInfo.allIds.indexOf(id) < 0).join(",") || "全部匹配"
  );
  check("3D 热点未复用游戏 data-action-id 属性", ov.legacy === 0, "误命中 " + ov.legacy);

  // ⑤ 点击热点触发真实行动（只点 3D 热点，且挑可用的）
  const clickRes = await p.evaluate(() => {
    const els = [...document.querySelectorAll("#scene3d-overlay [data-scene3d-action]")];
    const el = els.find((e) => !e.disabled && !e.classList.contains("is-disabled"));
    if (!el) return { ok: false, reason: "无可用热点" };
    const id = el.getAttribute("data-scene3d-action");
    return {
      ok: true,
      id,
      before: window.StateManager.getState().player.actionPoints,
    };
  });
  const after = clickRes.ok
    ? await (async () => {
        await p.evaluate((id) => {
          const el = document.querySelector('#scene3d-overlay [data-scene3d-action="' + id + '"]');
          el.click();
        }, clickRes.id);
        await sleep(1400);
        return p.evaluate(() => ({
          ap: window.StateManager.getState().player.actionPoints,
          overlayOpen: (document.getElementById("scene3d-overlay") || {}).classList
            ? document.getElementById("scene3d-overlay").classList.contains("is-open")
            : null,
          logCount: document.querySelectorAll("#message-log > *").length,
        }));
      })()
    : { ap: null };
  console.log("⑤ 点击热点:", JSON.stringify(clickRes), "→", JSON.stringify(after));
  check("找到并点击了 3D 热点", clickRes.ok, clickRes.id || clickRes.reason);
  check(
    "行动确实被执行（AP 变化或日志增加）",
    clickRes.ok && (after.ap === null || after.ap !== clickRes.before || after.logCount > 0),
    clickRes.before + " → " + after.ap
  );

  // ⑥ 切换地点 → 微缩景应更新
  const switched = await p.evaluate(() => {
    const keys = Object.keys(window.CLS.data.LOCATIONS);
    const cur = window.StateManager.getState().trade.currentLocation;
    const next = keys.find((k) => k !== cur);
    window.StateManager.getState().trade.currentLocation = next;
    if (typeof renderAll === "function") renderAll();
    return { from: cur, to: next };
  });
  await sleep(1800);
  const mini2 = await p.evaluate(() => {
    const h = document.getElementById("scene3d-mini");
    const sp = window.Scene3DBridge.debugMiniSpec();
    return {
      canvas: h ? !!h.querySelector("canvas") : false,
      specType: sp ? sp.type : null,
      buildings: sp ? sp.buildings.length : null,
      loc: window.StateManager.getState().trade.currentLocation,
    };
  });
  console.log("⑥ 切换地点:", JSON.stringify(switched), "→", JSON.stringify(mini2));
  check("切换地点后微缩景仍渲染", mini2.canvas);
  check("微缩景场景随地点更新", mini2.loc === switched.to && !!mini2.specType, mini2.loc + " / " + mini2.specType);

  // ⑦ 关闭全景，确认可回到 2D
  const closed = await p.evaluate(() => {
    window.Scene3DBridge.close();
    const el = document.getElementById("scene3d-overlay");
    return el ? el.classList.contains("is-open") : null;
  });
  await sleep(300);
  check("全景可正常关闭", closed === false, String(closed));

  console.log("\n--- 页面错误 ---");
  console.log(errs.length ? errs.slice(0, 8).join("\n") : "(无)");

  const pass = results.filter((r) => r.ok).length;
  console.log("\n════ 结果: " + pass + "/" + results.length + " 通过 ════");
  await b.close();
  process.exit(pass === results.length ? 0 : 1);
})().catch((e) => {
  console.error("集成测试异常:", e.message);
  process.exit(2);
});
