/**
 * diag-3d-boot.cjs — 诊断「打开网页为什么没进 3D」
 *
 * 照恒稳的实际入口：把 **src/** 当根目录起静态服务（他桌面快捷方式就是
 * `python -m http.server 8888 --directory src`），打开 `/`，然后**逐条报出**
 * autoStartFirst() 三道守卫的实际取值，而不是只给一个"没挂上"。
 *
 *   ① available()     → window.Scene3D / createGame3D / gamedata.locations
 *   ② wantsFirst()    → 默认应为 true（无参数时）
 *   ③ webglUsable()   → 能否建起 webgl2/webgl 上下文
 * 外加：脚本是否真的加载、页面报错、失败请求。
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const SRC_ROOT = path.join(process.cwd(), "src");
const PORT = 8891;
/* 可选：--url <地址> 直接诊断**线上/任意地址**，不再起本地服务。
   线上与本地是两套发布面（线上由 CI 的 python build.py 重建），
   「我这边好的、你那边还是旧版」这类分歧必须能分别验。 */
const PROXY_ARG = (() => {
  const i = process.argv.indexOf("--proxy");
  return i >= 0 ? process.argv[i + 1] : null;
})();
const URL_ARG = (() => {
  const i = process.argv.indexOf("--url");
  return i >= 0 ? process.argv[i + 1] : null;
})();
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".glb": "model/gltf-binary", ".gltf": "model/gltf+json", ".bin": "application/octet-stream",
  ".mp3": "audio/mpeg", ".webp": "image/webp", ".wasm": "application/wasm",
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0].split("#")[0]);
  if (p === "/") p = "/index.html";
  const fp = path.join(SRC_ROOT, p);
  if (!fp.startsWith(SRC_ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    res.writeHead(404); res.end("404"); return;
  }
  res.writeHead(200, { "Content-Type": MIME[path.extname(fp).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(fp).pipe(res);
});

(async () => {
  if (!URL_ARG) {
    await new Promise((r) => server.listen(PORT, "127.0.0.1", r));
    console.log(`· 服务 src/ → http://127.0.0.1:${PORT}/  （与恒稳的 8888 同形）`);
  }

  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    /* 可选 --proxy <url>：访问线上站时本机直连 github.io 会超时，
       需显式走 Karing（127.0.0.1:3067）。 */
    args: PROXY_ARG ? ["--no-sandbox", `--proxy-server=${PROXY_ARG}`] : ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  const failed = [];
  page.on("pageerror", (e) => errors.push(String(e.message || e).slice(0, 200)));
  page.on("requestfailed", (r) => failed.push(`${r.url()} → ${r.failure() && r.failure().errorText}`));

  /* 用 domcontentloaded：本页会持续发外部行情/新闻请求，networkidle2 可能永远不满足 */
  const target = URL_ARG || `http://127.0.0.1:${PORT}/`;
  console.log(`· 目标：${target}`);
  /* 线上 dist 的 app.js 有十几 MB，DOMContentLoaded 会被它挡住 →
     远端目标改用 "commit"（拿到底层响应即返回）再固定等一会儿。 */
  if (URL_ARG) {
    await page.goto(target, { waitUntil: "commit", timeout: 120000 });
    await new Promise((r) => setTimeout(r, 30000));
  } else {
    await page.goto(target, { waitUntil: "domcontentloaded", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 7000));
  }

  const d = await page.evaluate(() => {
    const S3 = window.Scene3D;
    let webgl = "no";
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
      webgl = gl ? "yes" : "no";
    } catch (e) { webgl = "throw: " + e.message; }
    const scripts = [...document.querySelectorAll("script[src]")].map((s) => s.getAttribute("src"));
    return {
      search: location.search || "(空)",
      scene3dType: typeof S3,
      createGame3D: S3 ? typeof S3.createGame3D : "(无 Scene3D)",
      hasGamedata: !!(S3 && S3.gamedata),
      locCount: S3 && S3.gamedata && S3.gamedata.locations ? Object.keys(S3.gamedata.locations).length : 0,
      webgl,
      bridgeLoaded: typeof window.Scene3DBridge,
      hostPresent: !!document.getElementById("scene3d-first"),
      bodyClass: document.body.className,
      welcomeDisplay: (() => { const w = document.getElementById("welcome-screen"); return w ? getComputedStyle(w).display : "(无)"; })(),
      bundleTag: scripts.find((s) => s && s.includes("scene3d.bundle")) || "(HTML 里没有 bundle 标签)",
      bridgeTag: scripts.find((s) => s && s.includes("scene3d_bridge")) || "(HTML 里没有 bridge 标签)",
      scriptCount: scripts.length,
    };
  });

  console.log("\n══ 三道守卫的实际取值 ══");
  console.log("  location.search        :", d.search);
  console.log("  ① available() 需要的东西：");
  console.log("     typeof window.Scene3D     :", d.scene3dType, d.scene3dType === "object" ? "✅" : "❌ ← 这一条断了，autoStartFirst 直接 return");
  console.log("     typeof createGame3D       :", d.createGame3D);
  console.log("     Scene3D.gamedata          :", d.hasGamedata, `(地点 ${d.locCount} 个)`);
  console.log("  ③ webglUsable()           :", d.webgl, d.webgl === "yes" ? "✅" : "❌ ← 会降级到 2D 并 console.warn");
  console.log("\n══ 页面实际状态 ══");
  console.log("  window.Scene3DBridge      :", d.bridgeLoaded);
  console.log("  #scene3d-first 存在       :", d.hostPresent, d.hostPresent ? "✅" : "❌ ← 3D 没挂上");
  console.log("  body.className            :", JSON.stringify(d.bodyClass));
  console.log("  #welcome-screen display   :", d.welcomeDisplay);
  console.log("  HTML 里的 bundle 标签     :", d.bundleTag);
  console.log("  HTML 里的 bridge 标签     :", d.bridgeTag);
  console.log("  script[src] 总数          :", d.scriptCount);

  if (errors.length) {
    console.log("\n══ 页面报错 ══");
    [...new Set(errors)].slice(0, 8).forEach((e) => console.log("  ⚠️ ", e));
  } else console.log("\n══ 页面报错 ══ 无");

  const localFail = failed.filter((f) => !/polyhaven|kenney|news|quote|sina|163|tencent/.test(f));
  if (localFail.length) {
    console.log("\n══ 失败请求（本地）══");
    [...new Set(localFail)].slice(0, 8).forEach((f) => console.log("  ⚠️ ", f));
  }

  const out = path.join(process.cwd(), "dev", "_3dtest", "shots-opening", "probe-boot.png");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out });
  console.log("\n📸 " + out);

  await browser.close();
  if (server.listening) server.close();
})();
