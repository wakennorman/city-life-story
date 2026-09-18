/**
 * 常驻开发预览服务（不自动退出）
 *
 * 用途：给「人」看的 —— 把 dev/ 下的原型页用 HTTP 喂给浏览器，
 *       让用户双击一次就能在浏览器里打开看。
 *
 * 与 scripts/lib/serve.cjs 的区别：
 *   serve.cjs 是给**验证脚本**用的，跑完就 close()；
 *   本脚本是给人用的，起完一直挂着，Ctrl+C 才停。
 *   两者共用同一套 MIME/目录穿越防护逻辑，这里直接复用它。
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
  ["3D-first 外壳（开局就是 3D + HUD）", "/dev/_3dtest/shell.html"],
  ["3D 场景画廊（29 地点逐个看）", "/dev/scene3d-gallery.html"],
  ["正式游戏（dist 构建产物）", "/dist/index.html"],
];

const srv = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
  const fp = path.resolve(ROOT, rel);
  if (fp !== ROOT && !fp.startsWith(ROOT + path.sep)) {
    res.writeHead(403).end("forbidden");
    return;
  }
  fs.readFile(fp, (err, buf) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 not found: " + rel);
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
  for (const [label, p] of PAGES) {
    const exists = fs.existsSync(path.join(ROOT, p));
    console.log(`  ${exists ? "  " : "!!"} ${label}`);
    console.log(`      http://127.0.0.1:${PORT}${p}${exists ? "" : "   ← 文件不存在，需先构建"}`);
  }
  console.log("  " + "─".repeat(56));
  console.log("  按 Ctrl+C 停止");
  console.log("");
});
