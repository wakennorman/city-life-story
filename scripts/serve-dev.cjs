/**
 * 常驻开发预览服务（不自动退出）
 *
 * 用途：给「人」看的 —— 把 dev/ 下的原型页用 HTTP 喂给浏览器，
 *       让用户双击一次就能在浏览器里打开看。
 *
 * 与 scripts/lib/serve.cjs 的区别：
 *   serve.cjs 是给**验证脚本**用的，跑完就 close()；
 *   本脚本是给人用的，起完一直挂着，Ctrl+C 才停。
 *
 * ★ 本次修的两处真实故障（恒稳报 404）：
 *   1. 路径解析要做**污染容错**。聊天窗口里自动链接会把中文全角括号 `）`
 *      吞进 URL，于是服务器收到 "dev/_3dtest/shell.html）" 而 404。
 *      现在：多次解码 → 找不到就逐次裁掉末尾的非路径字符再重试。
 *   2. "/" 现在是个真正的首页（三个入口的可点列表）。
 *      告知用户路径变短 = 更难被链接器弄坏。
 *
 * ★ 服务根必须是**项目根**。dev/_3dtest/shell.html 里引用的是
 *   /src/css/scene3d.css（绝对路径），根指到 dev/_3dtest 就会 404，
 *   页面会变成没样式的裸奔状态 —— 这个坑踩过一次，别再改。
 *
 * 用法：
 *   node scripts/serve-dev.cjs            # 默认 8977 端口
 *   node scripts/serve-dev.cjs 9000       # 指定端口
 */

const path = require("path");
const http = require("http");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.argv[2]) || 8977;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
};

const PAGES = [
  { label: "3D-first 外壳（开局就是 3D + HUD）", path: "/dev/_3dtest/shell.html", tip: "目标形态" },
  { label: "3D 场景画廊（29 地点逐个看）", path: "/dev/scene3d-gallery.html", tip: "看逐个地点" },
  { label: "正式游戏（dist 构建产物）", path: "/dist/index.html", tip: "当前线上同款" },
];

/* ── 短别名 ────────────────────────────────────────────────────────────────
 * 为什么需要：聊天窗口/编辑器会把长路径里的字符吃掉（`**`、`）`、`` ` ``），
 * 于是链接点开就 404。上面那条"裁掉末尾污染字符"的容错能兜住大部分，
 * 但**越短的 URL 越不可能被弄坏** —— `/s` 只有两个字符，几乎无从损坏。
 * 所以对外只给短别名，长路径留给浏览器内部跳转（浏览器里点击不经聊天窗口）。 */
const ALIAS = {
  "/s": "/dev/_3dtest/shell.html",
  "/shell": "/dev/_3dtest/shell.html",
  "/g": "/dev/scene3d-gallery.html",
  "/gallery": "/dev/scene3d-gallery.html",
  "/d": "/dist/index.html",
  "/game": "/dist/index.html",
};

/* 健康检查体。启动器用它区分「端口上是我们的服务」和「端口被别的程序占了」——
 * 只看端口有没有应答是不够的：任何程序应答都会让启动器以为服务已在跑，
 * 然后打开浏览器指向一个不是我们的服务，于是 404。 */
const PING_BODY = "serve-dev-ok";

/* ── 路径解析：先做污染容错 ─────────────────────────────────────────────── */

function resolveFile(rawUrl) {
  // 只要 query 前的路径部分；然后能接受多次百分号编码（全角括号常带来二层编码）
  let rel = rawUrl.split("?")[0].split("#")[0];
  for (let i = 0; i < 3; i++) {
    try {
      const d = decodeURIComponent(rel);
      if (d === rel) break;
      rel = d;
    } catch { break; }
  }
  rel = rel.replace(/\\/g, "/").replace(/>/g, "").replace(/^[\/]+/, "");

  // 空路径 → 首页
  if (!rel) return null;

  /* ── 短别名优先 ──────────────────────────────────────────────────────────
   * 别名同样要容错：`/s）` 这种带尾巴的也得命中，否则短别名的好处就白费了。 */
  let aliasTry = "/" + rel.replace(/\/+$/, "").toLowerCase();
  for (let trim = 0; trim <= 8; trim++) {
    if (ALIAS[aliasTry]) {
      const afp = path.join(ROOT, ALIAS[aliasTry]);
      try {
        if (fs.existsSync(afp) && fs.statSync(afp).isFile()) return afp;
      } catch { /* fall through */ }
    }
    const am = aliasTry.match(/[^a-z0-9\/\-]+$/);
    if (!am || am.index === 0) break;
    aliasTry = aliasTry.slice(0, am.index);
  }

  // 先按原样试（保留合法的中文文件名）
  let candidate = rel;
  for (let trim = 0; trim <= 12; trim++) {
    const fp = path.resolve(ROOT, candidate);
    if (fp === ROOT || fp.startsWith(ROOT + path.sep)) {
      try {
        if (fs.existsSync(fp) && fs.statSync(fp).isFile()) return fp;
      } catch { /* fall through */ }
    }
    // 找不到就裁掉末尾的一段非路径可用字符（全角括号/乱字符/截断的百分号等），重试
    const m = candidate.match(/[^0-9A-Za-z._\-\/~!$&'()+,;=@%]+$/);
    if (!m || m.index === 0) break;
    candidate = candidate.slice(0, m.index);
  }
  return null;
}

function indexHtml() {
  const cards = PAGES.map((p) => {
    const abs = path.join(ROOT, p.path);
    const exists = fs.existsSync(abs);
    return `<a class="card ${exists ? "" : "ghostify"}" href="${p.path}">
      <div class="t">${p.label}</div>
      <div class="path">${p.path}</div>
      <div class="tip">${p.tip}${exists ? "" : " · ⚠ 文件不存在，需先构建"}</div>
    </a>`;
  }).join("");
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>城市浮生记 · 本地预览</title>
<style>
  body { margin: 0; min-height: 100vh; background: #15171b; color: #e8e4d8;
         font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
         display: flex; align-items: center; justify-content: center; }
  main { width: min(640px, 92vw); padding: 40px 0; }
  h1 { font-size: 20px; font-weight: 600; letter-spacing: .05em; margin: 0 0 4px; }
  .sub { color: #9aa091; font-size: 12px; margin-bottom: 28px; }
  .card { display: block; text-decoration: none; color: inherit;
          border: 1px solid #2e3236; border-radius: 12px; padding: 14px 18px;
          margin-bottom: 10px; transition: border-color .15s, background .15s; }
  .card:hover { border-color: #d8b45a; background: #1b1e22; }
  .t { font-size: 14px; font-weight: 600; }
  .path { font-family: Consolas, monospace; font-size: 11px; color: #7d8489; margin: 2px 0; }
  .tip { font-size: 11px; color: #d8b45a; }
  .ghostify { opacity: .45; }
  .foot { margin-top: 26px; font-size: 11px; color: #666c6f; }
  code { background: #23262b; padding: 2px 7px; border-radius: 5px; }
  kbd { background: #23262b; padding: 1px 6px; border-radius: 4px;
        border: 1px solid #3a3f45; font-size: 10px; }
</style></head><body><main>
  <h1>城市浮生记 · 本地预览</h1>
  <div class="sub">双击 <code>start-3d-shell.bat</code> 可随时重启本服务</div>
  ${cards}
  <div class="foot">3D 页内：<kbd>WASD</kbd> 走动 · <kbd>按住左键拖动</kbd> 转视角 · <kbd>E</kbd> 交互 · <kbd>Tab</kbd> 行动 · <kbd>M</kbd> 去处</div>
</main></body></html>`;
}

/* ── 404 页：不给"没这个页面"这种死胡同，而是把可用入口和服务根摆出来 ──────
 * 恒稳报的那个 404，根因是**服务根不对**：旧启动器（start-3d.bat）的服务根是
 * experiments/3d，在那儿请求 dev/_3dtest/shell.html 必然 404 —— 路径本身没错，
 * 是连错了服务。所以这一页必须把「本服务的根在哪」直接印出来，
 * 一眼就能判断是不是连错了。 */
function notFoundHtml(rawUrl) {
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const cards = PAGES.map((p) => {
    const exists = fs.existsSync(path.join(ROOT, p.path));
    return `<a class="card" href="${p.path}">
      <div class="t">${p.label}</div>
      <div class="path">${p.path}</div>
      <div class="tip">${exists ? p.tip : "⚠ 文件不存在，需先构建"}</div>
    </a>`;
  }).join("");
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">
<title>404 · 城市浮生记本地预览</title>
<style>
  body { margin:0; min-height:100vh; background:#15171b; color:#e8e4d8;
         font-family:"PingFang SC","Microsoft YaHei",sans-serif;
         display:flex; align-items:center; justify-content:center; }
  main { width:min(680px,92vw); padding:40px 0; }
  h1 { font-size:19px; font-weight:600; margin:0 0 6px; }
  .sub { color:#9aa091; font-size:12px; margin-bottom:20px; line-height:1.7; }
  .diag { background:#1b1e22; border:1px solid #2e3236; border-radius:10px;
          padding:12px 16px; font-family:Consolas,monospace; font-size:11px;
          color:#9aa091; line-height:1.9; margin-bottom:20px; word-break:break-all; }
  .diag b { color:#d8b45a; font-weight:600; }
  .card { display:block; text-decoration:none; color:inherit; border:1px solid #2e3236;
          border-radius:12px; padding:13px 17px; margin-bottom:9px;
          transition:border-color .15s, background .15s; }
  .card:hover { border-color:#d8b45a; background:#1b1e22; }
  .t { font-size:14px; font-weight:600; }
  .path { font-family:Consolas,monospace; font-size:11px; color:#7d8489; margin:2px 0; }
  .tip { font-size:11px; color:#d8b45a; }
  code { background:#23262b; padding:2px 7px; border-radius:5px; }
</style></head><body><main>
  <h1>404 — 这个路径不存在</h1>
  <div class="sub">但你多半不是要找这个页面，而是想进 3D 外壳。下面几条都能进。</div>
  <div class="diag">
    你请求的：<b>${esc(rawUrl)}</b><br>
    本服务的根：<b>${esc(ROOT)}</b><br>
    快捷入口：<b>http://127.0.0.1:${PORT}/s</b>（3D 外壳）<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>/g</b>（地点画廊）·
    <b>/d</b>（正式游戏）
  </div>
  ${cards}
  <div class="sub" style="margin:18px 0 0;">
    如果上面的「本服务的根」不是 <code>city-life-story</code> 目录，
    说明你连到了另一个服务 —— 关掉那个窗口，重新双击
    <code>start-3d-shell.bat</code> 即可。
  </div>
</main></body></html>`;
}

const srv = http.createServer((req, res) => {
  const rawPath = req.url.split("?")[0].split("#")[0];

  /* 健康检查 —— 启动器用它确认「端口上是我们的服务」，而不是任何别的程序。
     只探测「端口有没有应答」是不够的：别的程序应答了，启动器会以为
     服务已在跑，于是打开浏览器指向一个不是我们的服务 → 404。 */
  if (rawPath === "/__ping") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    res.end(PING_BODY);
    return;
  }

  // 首页
  if (!rawPath || rawPath === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
    res.end(indexHtml());
    return;
  }

  const fp = resolveFile(req.url);
  if (!fp) {
    // 不存在 → 诊断型 404（把服务根印出来，便于判断是不是连错了服务）
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
    res.end(notFoundHtml(req.url));
    return;
  }
  fs.readFile(fp, (err, buf) => {
    if (err) {
      res.writeHead(500).end("read error: " + fp);
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(fp).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(buf);
  });
});

srv.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error(`端口 ${PORT} 已被占用 —— 可能已有一个服务在跑。`);
    console.error(`直接访问 http://127.0.0.1:${PORT}/ 试试；或换端口：node scripts/serve-dev.cjs 8978`);
  } else {
    console.error("服务启动失败:", e.message);
  }
  process.exit(1);
});

srv.listen(PORT, "127.0.0.1", () => {
  console.log("");
  console.log("  城市浮生记 · 本地预览已启动");
  console.log("  " + "─".repeat(56));
  console.log(`  ★ 直接访问首页（三个入口都在里面）：`);
  console.log(`      http://127.0.0.1:${PORT}/`);
  console.log("  " + "─".repeat(56));
  for (const p of PAGES) {
    const exists = fs.existsSync(path.join(ROOT, p.path));
    console.log(`  ${exists ? "  " : "!!"} ${p.label}${exists ? "" : "  ← 文件不存在"}`);
  }
  console.log("  " + "─".repeat(56));
  console.log("  按 Ctrl+C 停止");
  console.log("");
});
