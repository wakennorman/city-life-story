# Agnes API + Claude Code 踩坑记录

> **日期**：2026-07-08
> **模型**：agnes-2.0-flash（免费，支持视觉+1M上下文）
> **端点**：https://apihub.agnes-ai.com/v1

---

## 核心问题

Claude Code v2.1.201 的原生二进制 `claude.exe` 不认 `ANTHROPIC_BASE_URL` 环境变量。

Agnes API 的 Anthropic 兼容层有两个 Bug：

1. `anthropic-beta` 请求头 → 导致 `model=None` 报错
2. Anthropic 格式的 `tools` 定义不被识别（需要 OpenAI 格式）
3. 响应是 gzip 压缩的，直接 JSON.parse 会失败

---

## 错误尝试清单

| #   | 方案                                          | 结果                              | 原因                                                 |
| --- | --------------------------------------------- | --------------------------------- | ---------------------------------------------------- |
| 1   | 直连 Agnes API + `ANTHROPIC_BASE_URL` env var | ❌ "model may not exist"          | claude.exe 原生二进制不读该 env var                  |
| 2   | PowerShell 启动脚本 + 环境变量                | ❌ 同上                           | 同上                                                 |
| 3   | 纯 bat 设置环境变量                           | ❌ 同上                           | 同上                                                 |
| 4   | Node.js 代理剥离 anthropic-beta 头            | ❌ 307 重定向                     | claude.exe 仍不走代理                                |
| 5   | 直接调用 claude.exe + shell:false             | ❌ 同上                           | 同上                                                 |
| 6   | **`--settings` JSON 参数**                    | ✅ 通了                           | 命令行参数优先级最高，绕过环境变量读取问题           |
| 7   | 工具调用返回空参数                            | ❌ "Invalid tool parameters"      | input_json_delta 发的是完整累积值而非增量片段        |
| 8   | gzip 解压                                     | ❌ "Unexpected end of JSON input" | 响应体被 gzip 压缩但未解压                           |
| 9   | HEAD / 请求转发                               | ❌ 307                            | Claude Code 启动时发 HEAD / 探测，被代理转发到 Agnes |

---

## 正确方案

### 架构

```
双击 bat
  → launch-agnes.js (Node.js)
    → 启动本地代理 (:3456)
      → 剥离 anthropic-beta 头
      → Anthropic ↔ OpenAI 格式转换
      → gzip 解压
      → 转发到 apihub.agnes-ai.com/v1
    → 启动 claude.exe --settings JSON --bare
      → BASE_URL=http://127.0.0.1:3456
      → 所有请求走本地代理
    → Claude 退出 → 自动关代理
```

### 关键文件

| 文件                         | 作用                                 |
| ---------------------------- | ------------------------------------ |
| `launch-agnes.js`            | 启动器：启代理→启claude.exe→退出清理 |
| `Claude-agnes-api-flash.bat` | 桌面快捷方式：`node launch-agnes.js` |

### 必须注意的点

1. **`--settings` 参数**：必须用命令行参数传 JSON 配置，环境变量无效
2. **`--bare` 模式**：禁用插件/自动记忆等（因为 OAuth 握手冲突），功能受限但能用
3. **代理路径白名单**：只转发 `/v1/messages` 和 `/v1/chat/completions`，其他 404
4. **OpenAI 路径去前缀**：`/v1/chat/completions` → `/chat/completions`（Agnes 不接受 `/v1/` 前缀）
5. **gzip 解压**：Agnes 响应是 gzip 压缩的，代理必须先 gunzip 再解析
6. **input_json_delta 增量**：tool_call 参数通过 `input_json_delta` 流式下发，每次只发新片段，客户端自己拼接
7. **`ANTHROPIC_API_KEY` 也要设**：bare 模式下只看这个

### 代理格式转换要点

- **Anthropic system → OpenAI messages[0] system**
- **Anthropic messages → OpenAI messages**（处理 tool_result ↔ role: "tool"）
- **Anthropic tools → OpenAI tools**（`input_schema` → `parameters`）
- **OpenAI response → Anthropic response**（`tool_calls` ↔ `tool_use`）
- **SSE 流式转换**：OpenAI SSE → Anthropic SSE（含 `input_json_delta` 增量）

---

## 已知限制

- `--bare` 模式：无插件、无 LSP、无自动记忆、无 Vercel 集成
- 复杂工具调用场景可能有边界情况（如多轮 tool_use/tool_result 嵌套）
- 图片输入需要通过特殊方式传递（base64 编码）

---

## 相关文件

- `start-agnes-api-flash.ps1` — 旧版启动脚本（已废弃，不用了）
- `agnes-proxy.js` — 旧版代理（已废弃）
- `CLAUDE.md` — 映射表已更新
