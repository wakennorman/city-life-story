#!/usr/bin/env node
/**
 * Agnes API 启动器
 * 功能：启动本地代理 → 启动 Claude Code → 退出时清理代理
 * 代理职责：完整 Anthropic ↔ OpenAI 格式转换
 *   - 请求: Anthropic → OpenAI /v1/chat/completions
 *   - 响应: OpenAI → Anthropic（含 streaming SSE）
 *   - 剥离 anthropic-beta 头
 */
const http = require("http");
const https = require("https");
const zlib = require("zlib");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const PROXY_PORT = 3456;
const AGNES_BASE = "https://apihub.agnes-ai.com/v1";
const PROJECT_DIR = path.resolve(__dirname);
const HEADERS_BLOCKLIST = new Set([
  "anthropic-beta",
  "host",
  "connection",
  "keep-alive",
  "transfer-encoding",
]);

// ═══════════════════════════════════════════════════════════
//  格式转换工具
// ═══════════════════════════════════════════════════════════

// ── Anthropic system → OpenAI messages[0] system ──
function extractSystem(body) {
  let sys = "";
  if (body.system) {
    sys =
      typeof body.system === "string"
        ? body.system
        : Array.isArray(body.system)
          ? body.system.map((b) => b.text || "").join("\n")
          : "";
  }
  delete body.system;
  return sys;
}

// ── Anthropic messages → OpenAI messages ──
function convertMessages(msgs) {
  const out = [];
  for (const m of msgs) {
    if (m.role === "user") {
      // 可能包含 tool_result
      const toolResults = [];
      const textParts = [];
      const content = Array.isArray(m.content)
        ? m.content
        : [{ type: "text", text: m.content || "" }];
      for (const block of content) {
        if (block.type === "tool_result") {
          const resultText =
            typeof block.content === "string"
              ? block.content
              : Array.isArray(block.content)
                ? block.content.map((c) => c.text || "").join("\n")
                : "";
          toolResults.push({
            role: "tool",
            tool_call_id: block.tool_use_id,
            content: resultText,
          });
        } else if (block.type === "text") {
          textParts.push(block.text || "");
        } else if (block.type === "image" || block.type === "image_url") {
          // 图片直传
          textParts.push("[image]");
        }
      }
      // 先加 text user message
      if (textParts.length > 0) {
        out.push({ role: "user", content: textParts.join("\n") });
      }
      // 再加 tool_result
      out.push(...toolResults);
    } else if (m.role === "assistant") {
      const content = Array.isArray(m.content)
        ? m.content
        : [{ type: "text", text: m.content || "" }];
      const textParts = [];
      const toolCalls = [];
      for (const block of content) {
        if (block.type === "text") {
          textParts.push(block.text || "");
        } else if (block.type === "tool_use") {
          toolCalls.push({
            id: block.id,
            type: "function",
            function: {
              name: block.name,
              arguments: JSON.stringify(block.input || {}),
            },
          });
        }
      }
      const msg = { role: "assistant" };
      if (textParts.length > 0) msg.content = textParts.join("\n");
      else msg.content = null;
      if (toolCalls.length > 0) msg.tool_calls = toolCalls;
      out.push(msg);
    }
  }
  return out;
}

// ── Anthropic tools → OpenAI tools ──
function convertTools(tools) {
  if (!Array.isArray(tools)) return undefined;
  return tools.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description || "",
      parameters: t.input_schema || { type: "object", properties: {} },
    },
  }));
}

// ── 完整请求体转换: Anthropic → OpenAI ──
function anthropicToOpenAI(anthropicBody) {
  const body = JSON.parse(JSON.stringify(anthropicBody)); // deep clone
  const system = extractSystem(body);
  const messages = convertMessages(body.messages || []);
  if (system) messages.unshift({ role: "system", content: system });

  const openai = {
    model: body.model,
    messages,
    max_tokens: body.max_tokens || 4096,
    stream: body.stream || false,
  };
  if (body.temperature !== undefined) openai.temperature = body.temperature;
  if (body.top_p !== undefined) openai.top_p = body.top_p;
  if (body.stop_sequences) openai.stop = body.stop_sequences;
  if (body.metadata?.user_id) openai.user = body.metadata.user_id;

  const oaiTools = convertTools(body.tools);
  if (oaiTools) openai.tools = oaiTools;

  return openai;
}

// ── OpenAI 响应 → Anthropic 响应 ──
function openaiToAnthropicResponse(oai) {
  const choice = oai.choices?.[0]?.message;
  if (!choice) return oai;

  const content = [];
  if (choice.content) content.push({ type: "text", text: choice.content });
  if (choice.tool_calls) {
    for (const tc of choice.tool_calls) {
      content.push({
        type: "tool_use",
        id: tc.id,
        name: tc.function.name,
        input: (() => {
          try {
            return JSON.parse(tc.function.arguments || "{}");
          } catch {
            return {};
          }
        })(),
      });
    }
  }

  const stopReason = choice.tool_calls
    ? "tool_use"
    : oai.choices[0]?.finish_reason === "stop"
      ? "end_turn"
      : oai.choices[0]?.finish_reason || "end_turn";

  return {
    id: oai.id || `msg_${Date.now()}`,
    type: "message",
    role: "assistant",
    content,
    model: oai.model || "agnes-2.0-flash",
    stop_reason: stopReason,
    stop_sequence: null,
    usage: {
      input_tokens: oai.usage?.prompt_tokens || 0,
      output_tokens: oai.usage?.completion_tokens || 0,
    },
  };
}

// ═══════════════════════════════════════════════════════════
//  SSE 流式转换（OpenAI → Anthropic）
// ═══════════════════════════════════════════════════════════

class StreamTranslator {
  constructor() {
    this.hasStarted = false;
    this.hasTextBlock = false; // text content_block 是否已开始
    this._finished = false; // 是否已发送结束事件
    this._tcBlocks = {}; // tool_call index -> {sent, id, name, args}
    this._tcSent = new Set(); // 已发 content_block_start 的 index
  }

  feed(line) {
    const events = [];
    if (!line.startsWith("data: ")) return events;
    const data = line.slice(6).trim();
    if (data === "[DONE]") {
      if (!this._finished) this._emitClose(events, null);
      return events;
    }

    try {
      const parsed = JSON.parse(data);
      const delta = parsed.choices?.[0]?.delta;
      const finishReason = parsed.choices?.[0]?.finish_reason;

      // message_start
      if (!this.hasStarted) {
        this.hasStarted = true;
        events.push(
          `event: message_start\ndata: {"type":"message_start","message":{"id":"msg_${Date.now()}","role":"assistant","content":[],"model":"agnes-2.0-flash","usage":{"input_tokens":0,"output_tokens":0}}}`,
        );
      }

      // text delta
      if (delta?.content) {
        if (!this.hasTextBlock) {
          this.hasTextBlock = true;
          events.push(
            'event: content_block_start\ndata: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}',
          );
        }
        events.push(
          `event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"${this._e(delta.content)}"}}`,
        );
      }

      // tool_calls delta
      if (delta?.tool_calls) {
        for (const tc of delta.tool_calls) {
          const idx = tc.index ?? 0;
          if (!this._tcBlocks[idx])
            this._tcBlocks[idx] = { id: "", name: "", args: "" };
          if (tc.id) this._tcBlocks[idx].id = tc.id;
          if (tc.function?.name) this._tcBlocks[idx].name = tc.function.name;
          if (tc.function?.arguments) {
            const frag = tc.function.arguments;
            this._tcBlocks[idx].args += frag;
            events.push(
              `event: content_block_delta\ndata: {"type":"content_block_delta","index":${idx + 1},"delta":{"type":"input_json_delta","partial_json":"${this._e(frag)}"}}`,
            );
          }

          // 首次见到此 index → 发 content_block_start
          if (!this._tcSent.has(idx)) {
            this._tcSent.add(idx);
            events.push(
              `event: content_block_start\ndata: {"type":"content_block_start","index":${idx + 1},"content_block":{"type":"tool_use","id":"${this._tcBlocks[idx].id}","name":"${this._tcBlocks[idx].name}","input":{}}}`,
            );
          }
        }

        // input_json_delta has already been sent per-chunk above
      }

      // finish_reason → 关闭
      if (finishReason) {
        this._emitClose(events, finishReason);
      }
    } catch {}

    return events;
  }

  _emitClose(events, finishReason) {
    if (this._finished) return;
    this._finished = true;

    if (this.hasTextBlock) {
      events.push(
        'event: content_block_stop\ndata: {"type":"content_block_stop","index":0}',
      );
    }
    for (const idx of Object.keys(this._tcBlocks).sort()) {
      events.push(
        `event: content_block_stop\ndata: {"type":"content_block_stop","index":${parseInt(idx) + 1}}`,
      );
    }
    const reason = finishReason === "tool_calls" ? "tool_use" : "end_turn";
    events.push(
      `event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"${reason}","stop_sequence":null},"usage":{"output_tokens":0}}`,
    );
    events.push('event: message_stop\ndata: {"type":"message_stop"}');
  }

  _e(s) {
    return String(s)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
  }
}

// ═══════════════════════════════════════════════════════════
//  代理服务器
// ═══════════════════════════════════════════════════════════

function startProxy() {
  const server = http.createServer((req, res) => {
    const targetPath = req.url;
    if (targetPath === "/health") {
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify({ status: "ok" }));
    }

    // 白名单：只转发 /v1/messages 和 /v1/chat/completions
    if (
      !targetPath.startsWith("/v1/messages") &&
      !targetPath.startsWith("/v1/chat/completions")
    ) {
      console.log(
        `[proxy] Ignoring non-API request: ${req.method} ${targetPath}`,
      );
      res.writeHead(404);
      return res.end("Not found");
    }

    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const rawBody = Buffer.concat(chunks).toString("utf-8");
      let body;
      try {
        body = JSON.parse(rawBody);
      } catch {
        body = {};
      }

      const isStream = body.stream === true;
      const isAnthropic = targetPath.includes("/messages");

      // 构造转发到 Agnes OpenAI 端点的请求
      let openaiBody;
      let openaiPath;

      if (isAnthropic) {
        // Anthropic 格式 → 转成 OpenAI 格式
        openaiBody = anthropicToOpenAI(body);
        openaiPath = "/chat/completions";
      } else {
        // 已经是 OpenAI 格式（/v1/chat/completions）— 去掉 /v1 前缀
        openaiBody = body;
        openaiPath = targetPath.replace(/^\/v1/, "");
      }

      const agnesUrl = AGNES_BASE + openaiPath;
      const url = new URL(agnesUrl);

      // 清理头
      const headers = { ...req.headers };
      for (const h of HEADERS_BLOCKLIST) delete headers[h];
      delete headers["anthropic-version"];
      delete headers["content-length"];
      headers["content-type"] = "application/json";

      const payload = JSON.stringify(openaiBody);
      headers["content-length"] = Buffer.byteLength(payload);

      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: "POST",
        headers,
        rejectUnauthorized: true,
      };

      const proxyReq = https.request(options, (proxyRes) => {
        // DEBUG: 打印非 200 响应
        if (proxyRes.statusCode !== 200) {
          console.error(
            `[proxy] Non-200 response: ${proxyRes.statusCode} for ${req.method} ${targetPath}`,
          );
          console.error(`[proxy] Target: ${AGNES_BASE}${openaiPath}`);
        }

        // 收集原始响应（可能是 gzip 压缩的）
        const rawChunks = [];
        proxyRes.on("data", (c) => rawChunks.push(c));
        proxyRes.on("end", () => {
          let rawData = Buffer.concat(rawChunks);

          // 解压 gzip 内容
          const encoding = proxyRes.headers["content-encoding"];
          if (encoding === "gzip") {
            try {
              rawData = zlib.gunzipSync(rawData);
            } catch (e) {
              console.error("[proxy] gunzip failed, using raw:", e.message);
            }
          }

          const dataStr = rawData.toString("utf-8");

          if (isStream) {
            // 流式: 将 OpenAI SSE 转为 Anthropic SSE
            res.writeHead(200, {
              "content-type": "text/event-stream",
              "cache-control": "no-cache",
              connection: "keep-alive",
            });

            const translator = new StreamTranslator();
            let buffer = "";

            // 将已收集的完整响应按行拆分后逐行喂给 translator
            const allLines = dataStr.split("\n");
            for (const line of allLines) {
              if (line.startsWith("data: ")) {
                const events = translator.feed(line);
                for (const evt of events) {
                  res.write(evt + "\n\n");
                }
              }
            }

            if (!translator.hasStarted) {
              res.write(
                'event: message_stop\ndata: {"type":"message_stop"}\n\n',
              );
            }
            res.end();
          } else {
            // 非流式: 整块转换
            try {
              const oaiResp = JSON.parse(dataStr);
              const anthropicResp = openaiToAnthropicResponse(oaiResp);
              res.writeHead(proxyRes.statusCode, {
                "content-type": "application/json",
              });
              res.end(JSON.stringify(anthropicResp));
            } catch (e) {
              console.error(`[proxy] Non-stream error: ${e.message}`);
              console.error(
                `[proxy] Status ${proxyRes.statusCode}, body length: ${dataStr.length}`,
              );
              res.writeHead(proxyRes.statusCode, {
                "content-type": "application/json",
              });
              res.end(dataStr);
            }
          }
        });

        proxyRes.on("error", () => res.end());
      });

      proxyReq.write(payload);
      proxyReq.end();
    });
  });

  return new Promise((resolve) => {
    server.listen(PROXY_PORT, "127.0.0.1", () => {
      console.log(`[agnes-launcher] Proxy ready on 127.0.0.1:${PROXY_PORT}`);
      resolve(server);
    });
  });
}

// ═══════════════════════════════════════════════════════════
//  Claude Code 启动
// ═══════════════════════════════════════════════════════════

function startClaudeCode() {
  const claudeExe = path.join(
    process.env.APPDATA,
    "npm",
    "node_modules",
    "@anthropic-ai",
    "claude-code",
    "bin",
    "claude.exe",
  );
  const configDir = path.join(
    process.env.USERPROFILE,
    ".claude-agnes-api-flash",
  );
  const homeDir = path.join(
    process.env.USERPROFILE,
    ".claude-home-agnes-api-flash",
  );

  fs.mkdirSync(configDir, { recursive: true });
  fs.mkdirSync(homeDir, { recursive: true });

  // 确保 settings.json 存在
  const settingsPath = path.join(configDir, "settings.json");
  if (!fs.existsSync(settingsPath)) {
    const settings = {
      env: {
        ANTHROPIC_AUTH_TOKEN:
          "sk-hO5WSjdwEF9DgywtiBU1vDUGTJNU7uz2zPqgktyQbMVxBK0y",
        ANTHROPIC_BASE_URL: `http://127.0.0.1:${PROXY_PORT}`,
        ANTHROPIC_MODEL: "agnes-2.0-flash",
        ANTHROPIC_DEFAULT_SONNET_MODEL: "agnes-2.0-flash",
        ANTHROPIC_DEFAULT_HAIKU_MODEL: "agnes-2.0-flash",
        ANTHROPIC_DEFAULT_OPUS_MODEL: "agnes-2.0-flash",
        CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
        SECURITY_GUIDANCE_DISABLE: "1",
        ENABLE_STOP_REVIEW: "0",
        MAX_STOP_HOOK_FIRINGS: "0",
      },
      permissions: { allow: ["Bash(*)", "Read(*)", "Write(*)", "Edit(*)"] },
      theme: "auto",
      autoMemoryEnabled: true,
    };
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf-8");
  }

  const statePath = path.join(homeDir, ".claude.json");
  if (!fs.existsSync(statePath)) {
    fs.writeFileSync(
      statePath,
      JSON.stringify({ hasCompletedOnboarding: true }),
      "utf-8",
    );
  }

  const env = {
    ...process.env,
    CLAUDE_CONFIG_DIR: configDir,
    HOME: homeDir,
    ANTHROPIC_API_KEY: "sk-hO5WSjdwEF9DgywtiBU1vDUGTJNU7uz2zPqgktyQbMVxBK0y",
    ANTHROPIC_AUTH_TOKEN: "sk-hO5WSjdwEF9DgywtiBU1vDUGTJNU7uz2zPqgktyQbMVxBK0y",
    ANTHROPIC_BASE_URL: `http://127.0.0.1:${PROXY_PORT}`,
    ANTHROPIC_MODEL: "agnes-2.0-flash",
  };

  console.log(`[agnes-launcher] Starting Claude Code via ${claudeExe}`);
  console.log(
    `[agnes-launcher] BASE_URL=http://127.0.0.1:${PROXY_PORT}  MODEL=agnes-2.0-flash`,
  );

  const settingsPayload = JSON.stringify({
    env: {
      ANTHROPIC_AUTH_TOKEN:
        "sk-hO5WSjdwEF9DgywtiBU1vDUGTJNU7uz2zPqgktyQbMVxBK0y",
      ANTHROPIC_BASE_URL: `http://127.0.0.1:${PROXY_PORT}`,
      ANTHROPIC_MODEL: "agnes-2.0-flash",
      ANTHROPIC_DEFAULT_SONNET_MODEL: "agnes-2.0-flash",
      ANTHROPIC_DEFAULT_HAIKU_MODEL: "agnes-2.0-flash",
      ANTHROPIC_DEFAULT_OPUS_MODEL: "agnes-2.0-flash",
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
      SECURITY_GUIDANCE_DISABLE: "1",
      ENABLE_STOP_REVIEW: "0",
      MAX_STOP_HOOK_FIRINGS: "0",
    },
    permissions: { allow: ["Bash(*)", "Read(*)", "Write(*)", "Edit(*)"] },
    theme: "auto",
    autoMemoryEnabled: true,
  });

  const child = spawn(
    claudeExe,
    ["--settings", settingsPayload, "--model", "agnes-2.0-flash", "--bare"],
    {
      stdio: "inherit",
      shell: false,
      env,
      cwd: PROJECT_DIR,
    },
  );
  return child;
}

// ═══════════════════════════════════════════════════════════
//  端口清理
// ═══════════════════════════════════════════════════════════

function cleanupPort(port) {
  const { execSync } = require("child_process");
  try {
    const result = execSync(`netstat -ano | findstr "127.0.0.1:${port}"`, {
      encoding: "utf-8",
    });
    for (const line of result
      .trim()
      .split("\n")
      .filter((l) => l.includes("LISTENING"))) {
      const pid = line.trim().split(/\s+/).pop();
      if (pid && pid !== "0") {
        try {
          process.kill(parseInt(pid));
          console.log(
            `[agnes-launcher] Cleaned old process on port ${port} (PID ${pid})`,
          );
        } catch {}
      }
    }
  } catch {}
}

// ═══════════════════════════════════════════════════════════
//  主流程
// ═══════════════════════════════════════════════════════════

async function main() {
  console.log("[agnes-launcher] Starting proxy server...");
  cleanupPort(PROXY_PORT);
  await new Promise((r) => setTimeout(r, 500));
  const server = await startProxy();

  const claude = startClaudeCode();

  claude.on("exit", (code) => {
    console.log(`[agnes-launcher] Claude Code exited (code ${code})`);
    server.close(() => process.exit(code));
  });

  claude.on("error", (err) => {
    console.error("[agnes-launcher] Failed to start Claude Code:", err.message);
    server.close(() => process.exit(1));
  });
}

main().catch((err) => {
  console.error("[agnes-launcher] Fatal error:", err);
  process.exit(1);
});
