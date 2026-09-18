/**
 * 验证脚本共用的本地静态服务工具。
 *
 * 为什么需要它：所有 headless 验证脚本都得先把页面用 HTTP 喂给浏览器（file:// 下
 * 模块加载/跨域行为与线上不一致）。以前靠人工先开一个 python -m http.server，
 * 别人 clone 下来直接跑必然失败。这里做成"已有就复用、没有就自己起"，脚本就能独立运行。
 */

const fs = require("fs");
const http = require("http");
const path = require("path");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".wasm": "application/wasm",
  ".webp": "image/webp",
};

/** 端口上是否已经有能返回 200 的 index.html */
function probe(port, timeoutMs = 1200) {
  return new Promise((resolve) => {
    const req = http.get({ host: "127.0.0.1", port, path: "/index.html", timeout: timeoutMs }, (r) => {
      r.resume();
      resolve(r.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => { req.destroy(); resolve(false); });
  });
}

/**
 * 保证 port 上有服务在提供 root 目录。
 * @returns {Promise<import('http').Server|null>} 自己起的服务实例（需 close），复用时返回 null
 */
async function ensureServer({ root, port, label = "" }) {
  if (await probe(port)) return null;

  const base = path.resolve(root);
  if (!fs.existsSync(base)) throw new Error(`静态根目录不存在: ${base}`);

  const srv = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
    const fp = path.resolve(base, rel);
    // 目录穿越防护
    if (fp !== base && !fp.startsWith(base + path.sep)) { res.writeHead(403).end("forbidden"); return; }
    fs.readFile(fp, (err, buf) => {
      if (err) { res.writeHead(404).end("not found"); return; }
      res.writeHead(200, {
        "Content-Type": MIME[path.extname(fp).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(buf);
    });
  });

  await new Promise((resolve, reject) => {
    srv.once("error", reject);
    srv.listen(port, "127.0.0.1", resolve);
  });
  console.log(`· 已自起本地服务 http://127.0.0.1:${port}/${label ? "  (" + label + ")" : ""}（脚本结束自动关闭）`);
  return srv;
}

/** 收尾：关掉自己起的服务（复用别人的不要动） */
function closeServer(srv) {
  return srv ? new Promise((r) => srv.close(r)) : Promise.resolve();
}

module.exports = { ensureServer, closeServer, probe };
