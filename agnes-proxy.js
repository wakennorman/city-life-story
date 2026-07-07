#!/usr/bin/env node
/**
 * Agnes API 本地翻译代理
 * =======================
 * 解决 Agnes API Anthropic 兼容层的两个 Bug:
 *   ① anthropic-beta 头 → model=None 丢失
 *   ② Anthropic 格式 tools 不被识别
 *
 * 用法: node agnes-proxy.js [--port 3456]
 *
 * Claude Code → localhost:3456 → agnes-proxy → apihub.agnes-ai.com/v1
 */

const http = require("http");
const https = require("https");
const { URL } = require("url");

// ─── 配置 ─────────────────────────────────────────────────────────
const PORT = parseInt(
  process.argv[2] === "--port" ? process.argv[3] : "3456",
  10,
);
const AGNES_BASE = "https://apihub.agnes-ai.com/v1";
const PROXY_NAME = "[agnes-proxy]";

// ─── 要剥离的请求头 ──────────────────────────────────────────────
const HEADERS_BLOCKLIST = new Set([
  "anthropic-beta", // Bug ①: 导致 model=None
  "anthropic-version", // 由 proxy 重写，避免旧版本引发歧义
  "host",
  "connection",
  "keep-alive",
  "transfer-encoding",
]);

// ─── 工具格式转换 ────────────────────────────────────────────────
// Anthropic: { name, description, input_schema }
// OpenAI:    { type:"function", function:{ name, description, parameters } }
function convertToolsToOpenAI(tools) {
  if (!Array.isArray(tools)) return tools;
  return tools.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description || "",
      parameters: t.input_schema || { type: "object", properties: {} },
    },
  }));
}

// ─── 请求体重写 ──────────────────────────────────────────────────
function rewriteBody(raw) {
  try {
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object") return raw;

    // 转换 tools 格式
    if (body.tools) body.tools = convertToolsToOpenAI(body.tools);

    return JSON.stringify(body);
  } catch {
    return raw; // 不是 JSON 就透传
  }
}

// ─── 转发请求 ────────────────────────────────────────────────────
function forwardRequest(agnesUrl, method, headers, body, res) {
  const url = new URL(agnesUrl);
  const options = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname + url.search,
    method,
    headers: { ...headers },
    rejectUnauthorized: true,
  };

  // 删掉 blocklist 中的头
  for (const h of HEADERS_BLOCKLIST) delete options.headers[h];
  // 确保 content-length 正确
  if (body) options.headers["content-length"] = Buffer.byteLength(body);

  const proxyReq = https.request(options, (proxyRes) => {
    // 转发状态码
    res.writeHead(proxyRes.statusCode, proxyRes.headers);

    // Streaming: 边收边发
    proxyRes.on("data", (chunk) => res.write(chunk));
    proxyRes.on("end", () => res.end());
    proxyRes.on("error", (err) => {
      console.error(`${PROXY_NAME} upstream stream error:`, err.message);
      if (!res.writableEnded) res.end();
    });
  });

  proxyReq.on("error", (err) => {
    console.error(`${PROXY_NAME} upstream request error:`, err.message);
    if (!res.headersSent) {
      res.writeHead(502, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          type: "error",
          error: {
            type: "proxy_error",
            message: `Cannot reach Agnes API: ${err.message}`,
          },
        }),
      );
    }
  });

  if (body) proxyReq.write(body);
  proxyReq.end();
}

// ─── HTTP 服务器 ─────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const method = req.method.toUpperCase();
  const targetPath = req.url;

  // 健康检查端点
  if (targetPath === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify({ status: "ok", proxy: "agnes-proxy" }));
  }

  // 只转发 /v1/* 路径
  if (!targetPath.startsWith("/v1/")) {
    res.writeHead(404, { "content-type": "application/json" });
    return res.end(JSON.stringify({ error: "Not found" }));
  }

  // 收集请求体
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const rawBody = Buffer.concat(chunks).toString("utf-8");

    // 重写请求体（tools 格式转换）
    const rewrittenBody = rawBody ? rewriteBody(rawBody) : rawBody;

    // 构建转发 URL
    const agnesUrl = `${AGNES_BASE}${targetPath.replace(/^\/v1/, "")}`;
    console.log(`${PROXY_NAME} ${method} ${targetPath} -> ${agnesUrl}`);

    forwardRequest(agnesUrl, method, req.headers, rewrittenBody, res);
  });

  req.on("error", (err) => {
    console.error(`${PROXY_NAME} client request error:`, err.message);
    if (!res.headersSent) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Bad request" }));
    }
  });
});

// ─── 启动 ────────────────────────────────────────────────────────
server.listen(PORT, "127.0.0.1", () => {
  console.log(`${PROXY_NAME} Listening on http://127.0.0.1:${PORT}`);
  console.log(`${PROXY_NAME} Upstream: ${AGNES_BASE}`);
  console.log(
    `${PROXY_NAME} Headers stripped: ${[...HEADERS_BLOCKLIST].join(", ")}`,
  );
});
