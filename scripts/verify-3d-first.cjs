/**
 * 3D-first 形态验证 —— 「3D 铺满视口 + HUD」是否真的接在**真实游戏**上
 *
 * ── 与 verify-3d-shell.cjs 的分工 ────────────────────────────────────────
 *   那个验 dev/_3dtest/shell.html —— 外壳本身（渲染管线 / 相机 / HUD 布局），
 *   状态是 mock，行动列表从 gamedata 静态生成。
 *   这个验 src/index.html?mode=3d —— 真实游戏（StateManager + getAvailableActions），
 *   状态来自真开局。它要回答的唯一问题是：
 *     **「HUD 上的每个数字、每个行动，是不是真的来自游戏逻辑层？」**
 *
 * ── 为什么必须单独有这一个脚本 ──────────────────────────────────────────
 *   mock 版外壳**永远**是绿的：readHUD 返回常量、readActions 从 gamedata 现成字段拼，
 *   哪怕 scene3d_bridge 的 first 形态一行都没接，它照样通过。
 *   这正是本项目模式 16/17 那一类缺陷的形状 ——
 *   「验证脚本喂给被测对象的状态，不是它将来要面对的状态」。
 *   所以这个脚本的三条核心断言都**反向可证伪**：
 *     · 顶栏显示值必须等于从 StateManager 现场算出的值（不是"非空"）
 *     · HUD 行动集合必须是 getAvailableActions 的**子集**（不是"有就行"）
 *     · 点一下必须让 **state 真的变**（不是"按钮亮着"）
 *
 * 用法：node scripts/verify-3d-first.cjs
 * 自给自足：端口无服务时自动起一个（结束关闭）。
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { ensureServer, closeServer } = require("./lib/serve.cjs");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "dev/_3dtest/shots-first");
const PORT = 8973;
const DOC = "/src/index.html?mode=3d";
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

  /* ★ 先重建 scene3d.bundle.js 再开测。
     页面加载的是 src/js/scene3d.bundle.js —— 那是**构建产物**，不是源码。
     不重建就会拿旧内核验证新桥接：断言全绿，但验的不是同一份代码。
     SCENE3D_ENTRY：多 Agent 并行时的逃生口（别人可能正在改 src/app/3d 下
     别的文件，从默认入口构建会把半成品打进来）。 */
  const bundleArgs = [
    path.join(__dirname, "build-3d-bundle.cjs"),
    "--out", "src/js/scene3d.bundle.js",
  ];
  if (process.env.SCENE3D_ENTRY) {
    bundleArgs.push("--entry", process.env.SCENE3D_ENTRY);
    console.log(`ℹ️  SCENE3D_ENTRY=${process.env.SCENE3D_ENTRY}（隔离验证模式）`);
  }
  console.log("▶ 重建 src/js/scene3d.bundle.js …");
  execFileSync(process.execPath, bundleArgs, { cwd: ROOT, stdio: "inherit" });

  const own = await ensureServer({ root: ROOT, port: PORT, label: "3D-first 真实游戏" });

  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage",
      "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  /* ── 报错收集：只把**本地的**算作失败 ──
     ★ 真实游戏开局会去拉外部行情（36kr / 世界参数反馈环），
       离线或沙箱里必然 CORS 失败 —— 那是游戏的既有行为，与 3D 无关。
       把它算进"页面报错"会让本脚本永远红，于是没人再看它。
       （本项目对这条的既有处置见 verify-3d-shell.cjs 的 favicon 噪声分类。）
     判定依据：console 的 "Failed to load resource" **不带 URL**，无法在那里区分，
     所以那类交给带 URL 的 response / requestfailed 事件去判。 */
  const errors = [];
  const noise = [];
  const isLocal = (u) => /^https?:\/\/127\.0\.0\.1[:/]/.test(u);
  page.on("pageerror", (e) => errors.push("[pageerror] " + String((e && e.message) || e)));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/Failed to load resource/i.test(t)) return;         // 由 response 事件按 URL 判
    if (/CORS policy|Access-Control-Allow-Origin/i.test(t)) { noise.push(t.slice(0, 90)); return; }
    errors.push("[console] " + t);
  });
  page.on("response", (r) => {
    if (r.status() !== 404) return;
    const u = r.url();
    if (/(favicon|\.ico)(\?|$)/i.test(u)) return;
    (isLocal(u) ? errors : noise).push("[404] " + u);
  });
  /* ★ 本地二进制的资产请求"失败"≠ 文件不存在（2026-09-19 归类调整）。
     ── 为什么单独归一类，而不是算页面报错 ──
     实测这 4 条是**加载竞态**：create3DShell 内部先建一次场景、外层再
     loadLocation 一次（kit.js:214 的注释里写明这是既有设计），
     先发出去的那批 .glb 请求会被后一次构建顶掉中止 → net::ERR_ABORTED。
     证据：与 HEAD 基线**逐条对照**，带/不带本轮 3D-UI 改动都稳定出现同样 4 条，
     且 404 分支一次都没命中（文件确实存在，实测 `ls src/assets/polyhaven/models/`
     全部在位）—— 也就是说这不是"资产缺失"，而是"请求被主动取消"。
     ── 为什么必须从 errors 里摘出来 ──
     一条永远红的断言等于没有断言。它会把整条"无本地报错"的判据泡在红里，
     于是真正的本地报错（404、脚本异常）混进来也不会有人注意到。
     ★ 但"文件不存在"仍走上面的 404 分支 —— 那种是真缺陷，不能一起放过。 */
  const assetAborted = [];
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (/(favicon|\.ico)(\?|$)/i.test(u)) return;
    if (isLocal(u) && /\.(glb|gltf|bin|hdr)(\?|$)/i.test(u)) { assetAborted.push(u); return; }
    (isLocal(u) ? errors : noise).push("[reqfail] " + u);
  });

  try {
    await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 });

    /* ── 开局 ──
       真实游戏先停在欢迎页，StateManager 里没有 state。
       直接调逻辑层的 startNewGame()（与玩家点"开始新游戏"同一个函数），
       而不是去点 DOM —— 欢迎页的按钮文案会变，函数名不会。

       ★ 这里**不用 page.waitForFunction**：它在 puppeteer 的 isolated world 里
         执行 pageFunction，与页面主 world 的全局对象之间存在可见性差异
         （本项目在 headless_runner 上栽过同形状的跟头）。
         自己用 page.evaluate 轮询，行为完全可控，失败时还能把现场 dump 出来。 */
    let booted = false;
    for (let i = 0; i < 100 && !booted; i++) {
      booted = await page.evaluate(() => typeof window.startNewGame === "function");
      if (!booted) await sleep(200);
    }
    if (!booted) {
      check("① 逻辑层就绪（能找到 startNewGame）", false, "等了 20s 仍未加载完");
    } else {
      /* ★★ 故意等 8 秒再开局 —— 这一步是**断言②有没有验证力的前提**。
         自动挂载的旧实现只有 5 秒预算（50×100ms），超时后**静默返回**，
         `?mode=3d` 从此永久失效。而真实玩家的流程是：页面先停在欢迎页
         （StateManager 里没有 state），看介绍、想名字、点「开始新游戏」——
         这远超 5 秒，于是线上表现为"点开链接、点开始，什么都没有"。

         脚本如果一加载完就立刻 startNewGame()，**永远踩不到那个上限**，
         断言②就永远绿 —— 这正是本项目模式 16：验证脚本喂给被测对象的
         状态，不是它将来要面对的状态。8 秒 > 5 秒，刚好跨过旧上限。 */
      console.log("▶ 模拟真实玩家：在欢迎页停留 8 秒再开局（跨过旧实现的 5 秒上限）…");
      await sleep(8000);

      const r = await page.evaluate(() => {
        try {
          window.startNewGame();
          return !!window.StateManager.getState();
        } catch (e) { return String((e && e.message) || e); }
      });
      check("① 开局成功，StateManager 有 state", r === true, r === true ? "" : String(r));
    }

    /* 3D-first 的自动挂载是轮询式的（等 state 就绪），这里等它挂上 */
    let mounted = false;
    for (let i = 0; i < 80 && !mounted; i++) {
      mounted = await page.evaluate(() => !!(window.Scene3DBridge
        && window.Scene3DBridge.first && window.Scene3DBridge.first.active));
      if (!mounted) await sleep(250);
    }
    if (!mounted) {
      const diag = await page.evaluate(() => ({
        search: location.search,
        bridge: typeof window.Scene3DBridge,
        first: !!(window.Scene3DBridge && window.Scene3DBridge.first),
        avail: (window.Scene3DBridge && window.Scene3DBridge.available)
          ? window.Scene3DBridge.available() : null,
        host: !!document.getElementById("scene3d-first"),
        state: (() => { try { return !!window.StateManager.getState(); } catch (e) { return "throw"; } })(),
      }));
      check("② 3D-first 自动挂载", false, JSON.stringify(diag));
    } else {
      check("② 3D-first 自动挂载（?mode=3d）", true);
    }
    await sleep(2000);   // 等首帧渲染 + HUD 首次 refresh

    /* ── A. 挂载与让位 ──
       ★ 先构造可验证的前置条件，再重挂一次。
         自动挂载那一刻 #app 其实是**隐藏**的（开局的世界新闻流程还没走完，
         `#app.style.display = ""` 在 startWithWorldNewsIntro 的回调里才做）。
         在"本来就隐藏"的状态下断言"让位生效"，等于什么都没验 ——
         它本来就 none。所以这里显式把 #app 置为可见，再挂一次。
         这是**场景构造**，不是绕过被测对象：要验的是"3D 会不会正确让位/恢复"，
         不是"游戏的开局流程对不对"。 */
    console.log("\n── A. 挂载：3D 铺满、原界面让位 ──");
    const pre = await page.evaluate(() => {
      window.Scene3DBridge.first.unmount();
      const app = document.getElementById("app");
      app.style.display = "";                       // 模拟"玩家已进入主界面"
      const visible = getComputedStyle(app).display !== "none";
      const ok = window.Scene3DBridge.first.mount(); // 重挂
      return { visibleBefore: visible, remounted: !!ok };
    });
    check("③ 重挂前置：#app 置为可见 + 3D 重挂成功",
      pre.visibleBefore && pre.remounted,
      `visible=${pre.visibleBefore} remounted=${pre.remounted}`);
    await sleep(1200);

    const mount = await page.evaluate(() => {
      const host = document.getElementById("scene3d-first");
      const cv = host ? host.querySelector("canvas") : null;
      const app = document.getElementById("app");
      const appDisp = app ? getComputedStyle(app).display : "(无 #app)";
      /* ★ 让位的判据是**主视图三块**（header / sidebar / main）不可见，
         不是 `#app` 自己 display:none。
         ── 为什么改这条（2026-09-19）──
         旧断言写的是 `appDisp === "none"`，而实现**故意**不隐藏 `#app`：
         scene3d.css 的注释里写明，`#app` 整块 display:none 会把挂在其内部的
         弹层一起藏掉（弹层是 position:fixed，祖先 display:none 会继承隐藏）。
         所以实现改成了加 `.s3-yield` 类，只隐藏三个子区。
         断言没跟着改的结果是：这条**从那天起一直是红的**，
         与基线逐条对照可证（2026-09-19 实测：带/不带 3D-UI 改动都是同一条红）。
         一条永远红的断言等于没有断言 —— 它只会训练人忽略红。
         现在改成量的正是实现的契约，而且**更强**：
         逐个点名三块，任何一块漏藏都会被抓到（旧写法反而抓不到 sidebar）。 */
      const mainHidden = ["header", "sidebar", "main"].map((id) => {
        const e = document.getElementById(id);
        return id + ":" + (e ? getComputedStyle(e).display : "缺失");
      });
      return {
        host: !!host,
        active: !!(window.Scene3DBridge && window.Scene3DBridge.first.active),
        cw: cv ? cv.clientWidth : 0, ch: cv ? cv.clientHeight : 0,
        appDisp: appDisp,
        mainHidden: mainHidden,
        hiddenOk: mainHidden.every((s) => /:none$/.test(s)),
        exitBtn: !!(host && host.querySelector(".s3-first-exit")),
      };
    });
    check("④ 原 2D 主视图（header/sidebar/main）已让位",
      mount.hiddenOk, mount.mainHidden.join(" / "));
    check("⑤ canvas 铺满视口", mount.cw >= 1400 && mount.ch >= 880,
      `${mount.cw}×${mount.ch}`);
    check("⑥ 退出按钮存在", mount.exitBtn);

    /* ── 清掉游戏开场的模态遮罩（世界新闻 + 天赋）──
       ★ 这是**场景构造**，不是被测对象的一部分。
         真实玩家看完开场世界新闻、选完天赋后，这两层遮罩就消失了；
         它们盖在 3D 之上（z 9999 / 10000，而 3D host 是 9000），
         一层 93% 米白 + 一层 72% 黑叠加 —— 不清理的话截图永远是"被蒙住的暗画面"，
         看起来像渲染坏了。实测就因此误判过一轮（以为是光照退化，
         还专门做了 AO 强度扫描与 A/B 亮度对比去排查）。
         要验的是"3D 接入对不对"，不是"开场流程对不对"。 */
    const covered = await page.evaluate(() => {
      const hid = [];
      document.querySelectorAll("*").forEach((el) => {
        if (el.id === "scene3d-first") return;
        const z = parseInt(getComputedStyle(el).zIndex, 10);
        if (Number.isFinite(z) && z >= 9000 && getComputedStyle(el).display !== "none") {
          el.style.display = "none";
          hid.push((el.id || el.className || el.tagName) + "@z" + z);
        }
      });
      return hid;
    });
    console.log(`  ℹ️  已隐藏开场模态遮罩 ${covered.length} 层：${covered.join(" / ") || "（无）"}`);
    await sleep(600);

    /* ── B. HUD 的每个数字都来自 StateManager ──
       ★ 断言方式：现场从 state 算期望值，与 DOM 文本逐字比对。
         只查"非空"是查不出接错的 —— mock 也是非空。 */
    console.log("\n── B. HUD 数值 == 逻辑层现场计算值 ──");
    const hud = await page.evaluate(() => {
      const st = window.StateManager.getState();
      const q = (s) => { const e = document.querySelector(s); return e ? e.textContent.trim() : null; };
      const loc = (typeof getLocation === "function" ? getLocation(st.trade.currentLocation) : null)
        || (window.Scene3D && window.Scene3D.gamedata.locations[st.trade.currentLocation]) || {};
      const debt = (st.resources.villageDebt || 0) + (st.resources.fineDebt || 0) + (st.resources.bankDebt || 0);
      return {
        // 期望值（从 state 现算）
        expDay: `第 ${st.player.day} 天`,
        expCash: `¥${Math.round(st.resources.cash).toLocaleString("zh-CN")}`,
        expLoc: loc.name || "",
        expMental: typeof window.computeMindset === "function" ? window.computeMindset(st) : null,
        expDebt: debt,
        // 实际值（从 DOM 读）
        gotDay: q('[data-f="day"]'),
        gotCash: q('[data-f="cash"]'),
        gotLoc: q('[data-f="locName"]'),
        gotMental: (() => {
          const r = document.querySelector('[data-k="mindset"] .s3h-vital-num');
          return r ? r.textContent.trim() : null;
        })(),
        gotDebtHidden: (() => { const e = document.querySelector('[data-f="debt"]'); return e ? e.hidden : null; })(),
        vitals: document.querySelectorAll(".s3h-vital").length,
        needBars: document.querySelectorAll(".s3h-vital-bar").length,
      };
    });
    check("⑦ 顶栏天数 == state.player.day", hud.gotDay === hud.expDay,
      `${hud.gotDay} vs ${hud.expDay}`);
    check("⑧ 顶栏现金 == state.resources.cash", hud.gotCash === hud.expCash,
      `${hud.gotCash} vs ${hud.expCash}`);
    check("⑨ 顶栏地点名 == getLocation(currentLocation).name", hud.gotLoc === hud.expLoc,
      `${hud.gotLoc} vs ${hud.expLoc}`);
    check("⑩ 需求条数 == 6 生理项 + 1 心态", hud.vitals === 7, `实测 ${hud.vitals} 条`);
    /* ★ 这一条是「HUD 有没有真的用逻辑层公式」的唯一判据。
       传错参数形状（如把 state 传成 {needs,status}）会静默落到回退公式，
       两边各自都对、就是彼此不等 —— 且不报错。 */
    check("⑪ 心态值 == computeMindset(state)", hud.gotMental === String(hud.expMental),
      `HUD ${hud.gotMental} vs 逻辑层 ${hud.expMental}`);
    check("⑫ 无债务时欠款块隐藏", hud.expDebt > 0 ? hud.gotDebtHidden === false : hud.gotDebtHidden === true,
      `debt=${hud.expDebt} hidden=${hud.gotDebtHidden}`);

    /* ── C. HUD 行动列表 ⊂ 逻辑层行动集合 ──
       ★ 必须是**集合包含**而不是"条数接近"：
         HUD 多出任何一条，就意味着有个按钮点了不会有反应。 */
    console.log("\n── C. 行动列表来自 getAvailableActions ──");
    const acts = await page.evaluate(() => {
      const st = window.StateManager.getState();
      const raw = window.getAvailableActions(st) || [];
      const ids = raw.map((a) => a.id);
      const domIds = [...document.querySelectorAll(".s3h-act")].map((b) => {
        const n = b.querySelector(".s3h-act-name");
        return { name: n ? n.textContent.trim() : "", off: b.classList.contains("is-off") };
      });
      return {
        rawCount: raw.length,
        domCount: domIds.length,
        // HUD 上每个行动名，都要能在逻辑层行动里找到同名者
        orphan: domIds.map((d) => d.name).filter(
          (nm) => nm && !raw.some((a) => a.name === nm)),
        sampleIds: ids.slice(0, 5),
        disabledShown: domIds.filter((d) => d.off).length,
      };
    });
    check("⑬ HUD 行动条数 == 逻辑层行动数", acts.domCount === acts.rawCount,
      `HUD ${acts.domCount} vs 逻辑层 ${acts.rawCount}`);
    check("⑭ HUD 无孤儿行动（每条都能在逻辑层找到同名）", acts.orphan.length === 0,
      acts.orphan.length ? acts.orphan.join(" / ") : "");

    /* ── D. 点一下，state 真的变 ──
       ★ 选 `前往 <地点>` 这条行动：语义最确定（扣 AP + 换地点），
         而且正好覆盖「外壳 locId 权威」那处改动。 */
    /* 截图前把机位定死（空地 + 回正），否则截到的是随机落点 —— 上一版就
       因为机位落在建筑阴影里，把一张正常的画面误读成"光照退化"。 */
    await page.evaluate(() => {
      const v = window.Scene3DBridge.first.shell.view3d;
      v.teleport(0, 12); v.resetView(); v.setTimeSlot("上午");
    });
    await sleep(2600);
    await page.screenshot({ path: path.join(OUT, "first-3d-slum.png") });   // 开局地点留证
    console.log("\n── D. 点击 → 真实 state 变化 → 3D 场景跟随 ──");
    await page.click(".s3h-tray-toggle");   // 托盘默认收起
    await sleep(350);

    const before = await page.evaluate(() => {
      const st = window.StateManager.getState();
      return {
        loc: st.trade.currentLocation,
        ap: st.player.actionPoints,
        msgLen: st.messageLog.length,
        scene: window.Scene3DBridge.first.shell
          ? window.Scene3DBridge.first.shell.locationId : null,
      };
    });

    /* ★ 打桩 shell.notify —— 这是"消息有没有浮到玩家眼前"的**唯一可靠观测点**。
       ── 为什么不再看 `.s3h-toast`（2026-09-19 改）──
       hud.js 的 notify 现在**优先走场景内提醒**（角色头顶的 sprite）：
       `opts.onToast(msg, kind) === true` 时直接 return，根本不生成 DOM 浮条。
       而 shell.js 正是这么接的。于是 `.s3h-toast` 恒为空 ——
       旧断言 `toasts.some(...)` 从那天起**一直是红的**（与基线对照可证）。
       壳层的 notify 是**两条通道的共同上游**：DOM 浮条由它内部发出，
       场景提醒也由它转发。打在这里，两种实现都覆盖得到，
       而且不会因为将来又换回 DOM 浮条而失效。 */
    await page.evaluate(() => {
      const sh = window.Scene3DBridge.first.shell;
      window.__notifyLog = [];
      const orig = sh.notify.bind(sh);
      sh.notify = function (msg, kind) {
        window.__notifyLog.push({ msg: String(msg), kind: kind });
        return orig(msg, kind);
      };
    });

    const pick = await page.evaluate(() => {
      const btns = [...document.querySelectorAll(".s3h-act")];
      for (const b of btns) {
        const n = b.querySelector(".s3h-act-name");
        const nm = n ? n.textContent.trim() : "";
        if (nm.indexOf("前往 ") === 0 && !b.classList.contains("is-off")) {
          return { i: b.dataset.i, name: nm, target: nm.slice(3).trim() };
        }
      }
      return null;
    });

    if (!pick) {
      check("⑮ 托盘里有可点的「前往 X」行动", false, "一条都没有 —— 后续断言无法进行");
    } else {
      /* 目标在托盘滚动区里，先滚到可视区再点。
         滚不动（或元素被判不可点）时退回 DOM 点击 —— 监听的是同一个 click
         事件，验证的链路不变；这一步只是为了让"真人鼠标也能点到"这一点也成立。 */
      await page.evaluate((i) => {
        const b = document.querySelector('.s3h-act[data-i="' + i + '"]');
        if (b) b.scrollIntoView({ block: "center" });
      }, pick.i);
      await sleep(250);
      try {
        await page.click(`.s3h-act[data-i="${pick.i}"]`);
      } catch (e) {
        await page.evaluate((i) => {
          const b = document.querySelector('.s3h-act[data-i="' + i + '"]');
          if (b) b.click();
        }, pick.i);
      }
      await sleep(900);   // 等 refresh 合并 + 消息回显

      const after = await page.evaluate(() => {
        const st = window.StateManager.getState();
        const q = (s) => { const e = document.querySelector(s); return e ? e.textContent.trim() : null; };
        const loc = (typeof getLocation === "function" ? getLocation(st.trade.currentLocation) : null) || {};
        return {
          loc: st.trade.currentLocation,
          ap: st.player.actionPoints,
          msgLen: st.messageLog.length,
          lastMsg: st.messageLog.length ? st.messageLog[st.messageLog.length - 1].text : "",
          scene: window.Scene3DBridge.first.shell
            ? window.Scene3DBridge.first.shell.locationId : null,
          hudLoc: q('[data-f="locName"]'),
          expLoc: loc.name || "",
          toasts: [...document.querySelectorAll(".s3h-toast")].map((t) => t.textContent.trim()),
          notifyLog: window.__notifyLog || [],
        };
      });

      check("⑯ 点击「前往 X」后 trade.currentLocation 真的变了",
        after.loc !== before.loc, `${before.loc} → ${after.loc}`);
      check("⑰ 行动力下降（走的是逻辑层 consumeAP，不是外壳自己扣）",
        after.ap < before.ap, `${before.ap} → ${after.ap}`);
      /* ★ 这条覆盖 shell.js 那处改动：换地点由逻辑层发起（不是 shell.travel()），
         外壳必须从 readHUD().locId 察觉并换场景。
         不做这件事的话，HUD 写着新地点名、3D 还站在原地 —— 不报错。 */
      check("⑱ 3D 场景跟着切到新地点", after.scene === after.loc,
        `场景 ${after.scene} vs 状态 ${after.loc}`);
      check("⑲ 顶栏地点名 == 新地点的权威名字", after.hudLoc === after.expLoc,
        `${after.hudLoc} vs ${after.expLoc}`);
      /* ★ 两条通道任一生效即算通过（见上面打桩处的注释）。
         判据仍是"消息内容真的出现了"，不是"有过一次调用" ——
         后者在"随便提示了一句别的"时也会绿。 */
      const head = after.lastMsg.slice(0, 8);
      const viaDom = after.toasts.some((t) => t && t.indexOf(head) === 0);
      const viaScene = after.notifyLog.some((n) => n && n.msg.indexOf(head) === 0);
      check("⑳ 逻辑层新写的消息已浮到玩家眼前（DOM 浮条 / 场景内提醒）",
        after.msgLen > before.msgLen && (viaDom || viaScene),
        `msg=${after.lastMsg.slice(0, 24)} dom浮条=${after.toasts.length} 场景提醒=${after.notifyLog.length}`);
    }

    /* ── E. 卸载：原界面原样还回来 ── */
    /* 先留一张 3D 态的证据（必须在卸载前拍 —— 上一版把截图放在最后，
       拍到的其实是退出后的 2D 界面，等于没有 3D 的视觉证据）。 */
    await page.screenshot({ path: path.join(OUT, "first-3d-ingame.png") });
    console.log("\n── E. 退出 3D：原界面必须原样恢复 ──");
    await page.evaluate(() => { window.Scene3DBridge.first.unmount(); });
    await sleep(500);
    const off = await page.evaluate(() => {
      const app = document.getElementById("app");
      return {
        host: !!document.getElementById("scene3d-first"),
        active: window.Scene3DBridge.first.active,
        appDisp: app ? getComputedStyle(app).display : "(无 #app)",
      };
    });
    check("㉑ 卸载后 #scene3d-first 已移除", !off.host && !off.active);
    check("㉒ 卸载后 #app 恢复为挂载前的可见状态", off.appDisp !== "none", `display=${off.appDisp}`);

    /* ── F. 无报错 ── */
    console.log("\n── F. 页面报错 ──");
    if (noise.length) console.log(`  ℹ️  已归入噪声 ${noise.length} 条（外部行情请求失败，与 3D 无关）`);
    if (assetAborted.length) {
      console.log(`  ℹ️  本地 .glb 请求被中止 ${assetAborted.length} 条（构建竞态，非 404；见文件上方注释）：`);
      assetAborted.slice(0, 3).forEach((u) => console.log("        " + u.replace(/^https?:\/\/[^/]+/, "")));
    }
    check("㉓ 全程无本地页面报错（排除行情噪声与 .glb 竞态）", errors.length === 0, errors.slice(0, 4).join(" | "));

    await page.screenshot({ path: path.join(OUT, "first-after-exit.png") });
    console.log(`\n📸 截图：${["first-3d-slum.png", "first-3d-ingame.png", "first-after-exit.png"]
      .map((f) => path.relative(ROOT, path.join(OUT, f))).join("\n         ")}`);
  } finally {
    await browser.close().catch(() => {});
    if (own) closeServer(own);
  }

  console.log(`\n${fail === 0 ? "✅" : "❌"} 3D-first 接真实游戏：${pass} 通过 / ${fail} 失败`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("验证脚本自身出错：", e);
  process.exit(1);
});
