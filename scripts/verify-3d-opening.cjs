/**
 * 开局三屏取证 —— 「打开网页就是 3D，提示浮在 3D 上」是否真的成立
 *
 * ── 验证的是什么 ─────────────────────────────────────────────────────────
 * 恒稳的原话：
 *   「我一点开网站就进入 3D 游戏页面，这个时候再弹出这些提示，
 *     这些提示要融入游戏画面中，左上角或者右上角或者中间都可以，
 *     让玩家点击后才能跳过。」
 *
 * 对应到可执行断言，是三件互相独立的事 —— 少验任何一件都会漏：
 *   ① 3D 必须在**还没有 state** 的时候就挂上（欢迎页阶段）
 *      —— 否则"点开网站"看到的仍是纯 HTML，就是他截图里那两张的样子。
 *   ② 三屏（欢迎 / 今日头条 / 确立人生目标）背后都要有 3D 画面
 *      —— 判据不是"canvas 存在"，而是**玩家眼睛看到的那张图上，
 *         遮罩区不是米白**。所以这里直接采样截图像素，而不是读 DOM。
 *   ③ 弹窗本体必须是暗色游戏面板，不再是米白卡片。
 *
 * ── 为什么用像素而不是读 CSS ─────────────────────────────────────────────
 * 读 `getComputedStyle` 只能证明"某条规则声明了什么"，
 * 证明不了"它最终赢了层叠、且没有被别的规则盖回去"。
 * 本项目已经栽过一次同形状的跟头：`#app.s3-yield .modal-overlay` 那条
 * 选择器因为弹窗其实挂在 body 上而**一条都没匹配到**，
 * 当时如果只看 CSS 源码会以为已经修好了。
 * 像素是层叠的最终结果，没有中间解释层。
 *
 * ── 为什么亮度阈值取这个区间 ─────────────────────────────────────────────
 * 实测基准：改造前的世界新闻遮罩是 rgba(245,241,232,0.93) + blur → 图上约 240+；
 * 改造后是暗色玻璃 → 图上约 30~110。两者相差一个数量级，
 * 所以阈值不敏感（取 150 都行），这里取 160 留足余量。
 * 下限 8 用来区分"暗色画面"与"3D 没渲染出东西的全黑"。
 *
 * ── 取样区域是**运行时从 DOM 量的**，不是写死的坐标 ──────────────────────
 * 第一版写死 (700,430,120,60) 当"面板区" —— 结果弹窗换了位置就采到场景里去了，
 * 断言照样"通过"，但通过得毫无意义（这正是本项目模式 16 那一类：
 * 验证脚本量的东西不是它声称量的东西）。现在先量 boundingClientRect 再采样。
 *
 * 用法：node scripts/verify-3d-opening.cjs
 * 自给自足：端口无服务时自动起一个（结束关闭）。
 */

const fs = require("fs");
const path = require("path");
const { ensureServer, closeServer } = require("./lib/serve.cjs");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "dev/_3dtest/shots-opening");
const PORT = 8981;
const URL = `http://127.0.0.1:${PORT}/src/index.html`;
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const VW = 1440, VH = 900;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pass = 0, fail = 0;
const check = (name, ok, detail) => {
  console.log(`  ${ok ? "✅" : "❌"} ${name}${detail ? "  → " + detail : ""}`);
  ok ? pass++ : fail++;
};

/** 采样一张图（或其子区域）的平均亮度 0~255 */
async function meanLuma(pngPath, region) {
  const sharp = require("sharp");
  let img = sharp(pngPath);
  if (region) img = img.extract(region);
  const st = await img.stats();
  const ch = st.channels.slice(0, 3);
  return ch.reduce((a, c) => a + c.mean, 0) / ch.length;
}

/** 页面里某元素的位置（CSS 像素，与 setViewport 同坐标系） */
function rectOf(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    return { left: Math.round(r.left), top: Math.round(r.top),
             width: Math.round(r.width), height: Math.round(r.height) };
  }, selector);
}

/** 夹进视口 —— sharp.extract 越界会直接抛错，而不是返回空 */
function clampRect(r, vw = VW, vh = VH) {
  if (!r) return null;
  const left = Math.max(0, Math.min(vw - 1, r.left));
  const top = Math.max(0, Math.min(vh - 1, r.top));
  const width = Math.max(1, Math.min(vw - left, r.width));
  const height = Math.max(1, Math.min(vh - top, r.height));
  return { left, top, width, height };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const own = await ensureServer({ root: ROOT, port: PORT, label: "开局三屏" });

  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage",
      "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: VW, height: VH, deviceScaleFactor: 1 });

  /* 报错收集口径与 verify-3d-first.cjs 一致：外部行情在离线环境必然失败，
     那是游戏的既有行为，算进来会让本脚本永远红，于是没人再看它。 */
  const errors = [], noise = [];
  const isLocal = (u) => /^https?:\/\/127\.0\.0\.1[:/]/.test(u);
  page.on("pageerror", (e) => errors.push("[pageerror] " + String((e && e.message) || e)));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/Failed to load resource/i.test(t)) return;
    if (/CORS policy|Access-Control-Allow-Origin/i.test(t)) { noise.push(t.slice(0, 90)); return; }
    errors.push("[console] " + t);
  });
  page.on("response", (r) => {
    if (r.status() !== 404) return;
    const u = r.url();
    if (/(favicon|\.ico)(\?|$)/i.test(u)) return;
    (isLocal(u) ? errors : noise).push("[404] " + u);
  });
  /* ★ 本地的 .glb 请求"失败"≠ 文件不存在。
     实测这 4 条是**加载竞态**：create3DShell 内部先建一次场景、外层再
     loadLocation 一次（kit.js:214 的注释里写明这是既有设计），
     先发出去的那批请求会被后一次构建顶掉中止 → net::ERR_ABORTED。
     第一次跑本脚本时把它们当成"页面报错"，红了一整片，
     但那个红与本轮改动（挂载时机 + CSS 皮肤）没有任何关系 ——
     判据必须描述**被测对象**，否则它只会训练人忽略红。
     所以：本地 .glb 的请求失败单独归一类，并在最后单独打印行数。
     ★ 但"文件根本不存在"要另算 —— 那种是真缺陷，走上面的 404 分支。 */
  const glbAborted = [];
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (/(favicon|\.ico)(\?|$)/i.test(u)) return;
    if (isLocal(u) && /\.(glb|gltf|bin|hdr)(\?|$)/i.test(u)) { glbAborted.push(u); return; }
    (isLocal(u) ? errors : noise).push("[reqfail] " + u);
  });

  const shots = [];
  const shot = async (name) => {
    const p = path.join(OUT, name);
    await page.screenshot({ path: p });
    shots.push(name);
    return p;
  };

  try {
    await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 });

    /* ══ ① 欢迎页：没有 state，3D 也必须已经在跑 ══════════════════════════ */
    console.log("\n── ① 打开网页：3D 先于 state 挂载 ──");
    let booted = false;
    for (let i = 0; i < 100 && !booted; i++) {
      booted = await page.evaluate(() => typeof window.startNewGame === "function");
      if (!booted) await sleep(200);
    }
    check("① 逻辑层就绪", booted, booted ? "" : "等了 20s");

    let mounted = false;
    for (let i = 0; i < 120 && !mounted; i++) {
      mounted = await page.evaluate(() => !!(window.Scene3DBridge
        && window.Scene3DBridge.first && window.Scene3DBridge.first.active));
      if (!mounted) await sleep(250);
    }
    const pre = await page.evaluate(() => {
      const host = document.getElementById("scene3d-first");
      const cv = host ? host.querySelector("canvas") : null;
      return {
        mounted: !!(window.Scene3DBridge && window.Scene3DBridge.first
          && window.Scene3DBridge.first.active),
        hasState: (() => { try { return !!window.StateManager.getState(); } catch (e) { return false; } })(),
        stage: !!(host && host.classList.contains("s3-stage")),
        cw: cv ? cv.clientWidth : 0, ch: cv ? cv.clientHeight : 0,
        tris: (() => {
          try { return window.Scene3DBridge.first.shell.debug.tris; } catch (e) { return -1; }
        })(),
        glass: [...document.querySelectorAll(".welcome-screen.s3-glass")]
          .map((e) => e.id + (getComputedStyle(e).display !== "none" ? ":可见" : ":隐藏")),
        welcomeVisible: (() => {
          const w = document.getElementById("welcome-screen");
          return w ? getComputedStyle(w).display !== "none" : null;
        })(),
      };
    });
    check("② 无 state 时 3D 已挂载（这是「点开就是 3D」的前提）",
      pre.mounted && !pre.hasState, `mounted=${pre.mounted} hasState=${pre.hasState}`);
    check("③ canvas 铺满视口", pre.cw >= VW - 40 && pre.ch >= VH - 40, `${pre.cw}×${pre.ch}`);
    check("④ 场景真的建了东西（三角形数 > 1000，排除黑屏假通过）",
      pre.tris > 1000, `tris=${pre.tris}`);
    check("⑤ 挂载处于舞台态（HUD 数据块应被隐藏）", pre.stage, `.s3-stage=${pre.stage}`);
    /* ★ 这里别再写 indexOf(...) === 0：`.s3-glass` 同时挂在
       mode-select / scenario-select / sandbox 三个兄弟屏上（它们此时是隐藏态），
       welcome-screen 排在数组末尾。用 includes 判「集合里有它」才稳。 */
    check("⑥ 欢迎屏仍可见且已玻璃化（没被 3D 盖掉、也没被藏起来）",
      pre.welcomeVisible === true && pre.glass.includes("welcome-screen:可见"),
      JSON.stringify(pre.glass));

    await sleep(2500);
    const p1 = await shot("opening-1-welcome.png");
    const l1 = await meanLuma(p1);
    const l1center = await meanLuma(p1, clampRect({ left: 460, top: 300, width: 520, height: 300 }));
    check("⑦ 欢迎页整幅不是米白（< 160，改造前 ~245）", l1 < 160, `平均亮度 ${l1.toFixed(1)}`);
    check("⑧ 欢迎页中央有内容（> 8，排除全黑）", l1center > 8, `中央亮度 ${l1center.toFixed(1)}`);

    /* ══ ② 开局：先过天赋弹窗，再等今日头条 ═══════════════════════════════
       ★ 顺序是实测踩出来的：startNewGame → **天赋弹窗**（showTalentRevealModal，
       挂在 main.js:774，overlay 无 class、z-index 10000）→ 玩家点掉它之后
       才走 _afterTalentSelected → startWithWorldNewsIntro → 今日头条。
       第一版脚本不知道有这一步，于是"今日头条永远不出现"，
       后面 5 条断言跟着全红 —— 而这 5 条红的都不是被测对象的问题。 */
    console.log("\n── ② 开局：天赋 → 今日头条 ──");
    const opened = await page.evaluate(() => {
      try { window.startNewGame(); } catch (e) { return String((e && e.message) || e); }
      return true;
    });
    check("⑨ 开局成功", opened === true, opened === true ? "" : String(opened));

    let talentDismissed = "无需过场（未弹天赋）";
    for (let i = 0; i < 40; i++) {
      const t = await page.evaluate(() => {
        const btn = document.getElementById("_talent_ok")
          || document.getElementById("_talent_accept");
        if (!btn) return null;
        btn.click();
        return btn.id;
      });
      if (t) { talentDismissed = "点了 #" + t; break; }
      await sleep(200);
    }
    check("⑩ 天赋过场已处理（有就点掉，没有就跳过）",
      true, talentDismissed);

    let newsShown = false;
    for (let i = 0; i < 160 && !newsShown; i++) {   // 最多 40s：离线时实时新闻要等超时才回落
      newsShown = await page.evaluate(() => {
        const el = document.getElementById("world-news-intro-overlay");
        return !!(el && getComputedStyle(el).opacity !== "0");
      });
      if (!newsShown) await sleep(250);
    }
    check("⑪ 今日头条弹层已出现（等实时新闻超时后回落预存新闻）",
      newsShown, newsShown ? "" : "等 40s 仍未出现");

    await sleep(1200);
    const p2 = await shot("opening-2-headline.png");
    const l2 = await meanLuma(p2);
    const r2 = clampRect(await rectOf(page, ".world-news-panel"));
    const l2panel = r2 ? await meanLuma(p2, r2) : -1;
    const l2mask = r2 ? await meanLuma(p2, clampRect({
      left: 6, top: r2.top, width: Math.max(10, Math.min(90, r2.left - 10)), height: Math.min(r2.height, 340),
    })) : -1;
    /* ★ 这条是本轮改动的核心判据。
       改造前：.world-news-overlay = rgba(245,241,232,0.93) + blur(6px)，
       整幅图 ~240 —— 就是恒稳截图里那张"浅灰毛玻璃、看不到城市"。 */
    check("⑫ 今日头条整幅不是米白（< 160，改造前 ~240）", l2 < 160, `平均亮度 ${l2.toFixed(1)}`);
    check("⑬ 弹窗左侧遮罩区是暗的（3D 在那里透出来，不是米白糊死）",
      l2mask > 4 && l2mask < 170, `遮罩区亮度 ${l2mask.toFixed(1)}（取样 ${r2 ? `${r2.left},${r2.top}` : "无"}）`);
    check("⑭ 弹窗本体是暗色面板（< 130，改造前白卡片 ~230）",
      l2panel > 0 && l2panel < 130, `面板区亮度 ${l2panel.toFixed(1)}`);

    /* ══ ③ 确立人生目标：走的是通用 .modal-box，必须同套皮肤 ═════════════ */
    console.log("\n── ③ 确立人生目标：走的是通用 .modal-box，必须同套皮肤 ──");
    const clicked = await page.evaluate(() => {
      const b = document.getElementById("world-news-start-btn");
      if (!b) return false;
      b.click();
      return true;
    });
    check("⑮ 点到「带着这个世界，出发」", clicked, clicked ? "" : "按钮不存在");

    let dreamShown = false;
    for (let i = 0; i < 80 && !dreamShown; i++) {
      dreamShown = await page.evaluate(() => {
        const box = document.querySelector(".modal-overlay .modal-box");
        if (!box) return false;
        const h2 = box.querySelector("h2");
        return !!(h2 && /人生目标/.test(h2.textContent || ""));
      });
      if (!dreamShown) await sleep(250);
    }
    check("⑯ 「确立人生目标」弹窗已出现", dreamShown, dreamShown ? "" : "等 20s 仍未出现");

    await sleep(800);
    const p3 = await shot("opening-3-dream.png");
    const l3 = await meanLuma(p3);
    const r3 = clampRect(await rectOf(page, ".modal-overlay .modal-box"));
    const l3panel = r3 ? await meanLuma(p3, r3) : -1;
    const l3mask = r3 ? await meanLuma(p3, clampRect({
      left: 6, top: r3.top, width: Math.max(10, Math.min(90, r3.left - 10)), height: Math.min(r3.height, 340),
    })) : -1;
    check("⑰ 人生目标整幅不是米白（< 160）", l3 < 160, `平均亮度 ${l3.toFixed(1)}`);
    check("⑱ 遮罩区透出 3D（4 < 亮度 < 170，既非全黑也非米白）",
      l3mask > 4 && l3mask < 170, `遮罩区亮度 ${l3mask.toFixed(1)}`);
    check("⑲ 弹窗本体是暗色面板（< 130，改造前纯白卡片 ~230）",
      l3panel > 0 && l3panel < 130, `面板区亮度 ${l3panel.toFixed(1)}`);

    const ovBg = await page.evaluate(() => {
      const ov = document.querySelector(".modal-overlay");
      return ov ? getComputedStyle(ov).backgroundImage : null;
    });
    check("⑳ 通用遮罩用的是径向渐变（中心亮/边缘暗，替代原来的全屏不透明）",
      typeof ovBg === "string" && /radial-gradient/.test(ovBg),
      String(ovBg).slice(0, 64));

    /* ══ ④ 点击才能跳过 ═══════════════════════════════════════════════════ */
    console.log("\n── ④ 「点击后才能跳过」 ──");
    const dismiss = await page.evaluate(() => {
      const ov = document.querySelector(".modal-overlay");
      if (!ov) return { before: false, after: false };
      ov.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      return { before: true, after: !!document.querySelector(".modal-overlay") };
    });
    check("㉑ 点击遮罩空白处不会关掉弹窗（必须点按钮/明确选项）",
      dismiss.before && dismiss.after, `点前=${dismiss.before} 点后=${dismiss.after}`);

    console.log("\n── ⑤ 页面报错 ──");
    if (noise.length) console.log(`  ℹ️  已归入噪声 ${noise.length} 条（外部行情请求失败，与本次改动无关）`);
    if (glbAborted.length) {
      console.log(`  ℹ️  本地 .glb 请求被中止 ${glbAborted.length} 条（构建竞态，非 404）：`);
      glbAborted.slice(0, 3).forEach((u) => console.log("        " + u.replace(/^https?:\/\/[^/]+/, "")));
    }
    check("㉒ 全程无本地页面报错（排除行情噪声与 .glb 竞态）",
      errors.length === 0, errors.slice(0, 4).join(" | "));

    console.log(`\n📸 截图（${path.relative(ROOT, OUT)}）：\n         ` + shots.join("\n         "));
  } finally {
    await browser.close().catch(() => {});
    if (own) closeServer(own);
  }

  console.log(`\n${fail === 0 ? "✅" : "❌"} 开局三屏接入 3D：${pass} 通过 / ${fail} 失败`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("验证脚本自身出错：", e);
  process.exit(1);
});
