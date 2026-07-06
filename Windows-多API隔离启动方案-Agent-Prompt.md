# **Windows 多 API 隔离启动方案 — Agent Prompt**

> 用途：给任意 AI agent 的独立提示词。需要添加新的 Claude Code 第三方 API 配置时，直接把本文丢给 agent 执行。

---

## **任务：添加新的 Claude Code API 配置**

为本项目的 Claude Code CLI 新增一套独立配置（服务商 + API key + 模型），生成隔离的启动脚本和桌面快捷方式。

### **项目信息**

- 工作目录：`D:\Claude Code+DeepSeekV4`
- Claude Code 安装路径：`%APPDATA%\npm\claude.cmd`
- 已有配置示例：`.claude-volcano-ds4f`、`.claude-deepseek-api-ds4f`（位于 `%USERPROFILE%` 下）

---

## **核心原理**

Claude Code 配置优先级从高到低：

1. **命令行参数**（`-model xxx`）
2. **环境变量**（`ANTHROPIC_MODEL`、`ANTHROPIC_AUTH_TOKEN` 等）
3. **配置文件**（`settings.json` 的 `env` 节）

隔离关键：**每套配置一套独立目录 + 独立 `settings.json` + 独立启动脚本**。

---

## **桌面 Bat 命名规则**

### **格式**

```
Claude-<服务商>-<模型>[-api].bat
```

| **部分**   | **说明**                                      | **示例**                         |
| ---------- | --------------------------------------------- | -------------------------------- |
| `Claude-`  | 固定前缀，C 大写                              | —                                |
| `<服务商>` | 英文小写，一眼识别                            | `volcano` `sensenova` `deepseek` |
| `<模型>`   | 短标识，统一缩写                              | `ds4f` `glm52` `sonnet46`        |
| `[-api]`   | 有 `-api` = **官方直连**，无 = **第三方中转** | `deepseek-api-ds4f`              |

**禁止：** 中文、空格、下划线、点、大小写混用。

### **模型缩写规则**

| **完整模型名**             | **缩写**   | **方法**    |
| -------------------------- | ---------- | ----------- |
| `deepseek-v4-flash`        | `ds4f`     | 每段首字母  |
| `glm-5.2`                  | `glm52`    | 去点号      |
| `claude-sonnet-4-6`        | `sonnet46` | 关键名+数字 |
| `gpt-5-codex`              | `gpt5cx`   | 特征字母    |
| `sensenova-6.7-flash-lite` | `flash`    | 特征词      |

---

## **执行步骤**

### **1. 前置确认**

开始前向用户确认：

- **Key 类型：Coding Plan（有 Anthropic 兼容协议）还是通用 API（原生 OpenAI）？**
- 如果是通用 API，需要找 Anthropic 兼容中转端点
- 如果是 Coding Plan，直接问 Base URL 和模型名

### **2. 建独立目录**

```
$realUserProfile = [Environment]::GetFolderPath("UserProfile")
# 会话状态目录
New-Item -ItemType Directory -Force -Path (Join-Path $realUserProfile ".claude-home-<服务商>-<模型>")
# 配置目录
New-Item -ItemType Directory -Force -Path (Join-Path $realUserProfile ".claude-<服务商>-<模型>")
```

### **3. 写 ps1 启动脚本**

保存到项目目录 `D:\Claude Code+DeepSeekV4\start-<服务商>-<模型>.ps1`：

```
$realUserProfile = [Environment]::GetFolderPath("UserProfile")
$claudeHome = Join-Path $realUserProfile ".claude-home-<服务商>-<模型>"
$claudeConfigDir = Join-Path $realUserProfile ".claude-<服务商>-<模型>"
$claude = Join-Path $env:APPDATA "npm\claude.cmd"

New-Item -ItemType Directory -Force -Path $claudeHome, $claudeConfigDir | Out-Null

$model = "<模型名>"
$apiKey = "<API Key>"
$baseUrl = "<Base URL>"

$settings = @"
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "$apiKey",
    "ANTHROPIC_BASE_URL": "$baseUrl",
    "ANTHROPIC_MODEL": "$model",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "SECURITY_GUIDANCE_DISABLE": "1",
    "ENABLE_STOP_REVIEW": "0",
    "MAX_STOP_HOOK_FIRINGS": "0"
  },
  "permissions": {"allow": ["Bash(*)", "Read(*)", "Write(*)", "Edit(*)"]},
  "theme": "auto", "autoMemoryEnabled": true
}
"@ | Set-Content -LiteralPath (Join-Path $claudeConfigDir "settings.json") -Encoding UTF8

'{"hasCompletedOnboarding":true}' | Set-Content -LiteralPath (Join-Path $claudeHome ".claude.json") -Encoding UTF8

$env:HOME = $claudeHome; $env:USERPROFILE = $claudeHome
$env:CLAUDE_CONFIG_DIR = $claudeConfigDir; $env:ANTHROPIC_API_KEY = ""

Set-Location "D:\Claude Code+DeepSeekV4"
& $claude --model $model @args
```

> 第三方 API 必须保留 `SECURITY_GUIDANCE_DISABLE` 三行防死循环。官方 API 需删除这三行才能用插件。

### **4. 写桌面 bat**

保存到桌面 `Claude-<服务商>-<模型>[-api].bat`：

```
@echo off
chcp 65001 > nul
title Claude <服务商> <模型>
cd /d "D:\Claude Code+DeepSeekV4"
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "D:\Claude Code+DeepSeekV4\start-<服务商>-<模型>.ps1" %*
```

如果不走 ps1（直接 bat 设置环境变量），替换为：

```
@echo off
chcp 65001 > nul
title Claude <服务商> <模型>
cd /d "D:\Claude Code+DeepSeekV4"
set "CLAUDE_CONFIG_DIR=%USERPROFILE%\.claude-<服务商>-<模型>"
set "ANTHROPIC_API_KEY="
set "ANTHROPIC_AUTH_TOKEN=<API Key>"
set "ANTHROPIC_BASE_URL=<Base URL>"
set "ANTHROPIC_MODEL=<模型名>"
set "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1"
set "PATH=%APPDATA%\npm;%PATH%"
call "%APPDATA%\npm\claude.cmd" --model <模型名>
```

### **5. 验证**

```
cmd /k "C:\Users\陈恒稳\Desktop\Claude-<服务商>-<模型>.bat"
```

- 闪退诊断：`cmd //c "C:\Users\陈恒稳\Desktop\Claude-<服务商>-<模型>.bat"`

---

## **踩坑备忘录（必读）**

| **#** | **现象**                                   | **根因**                                     | **解决**                                      |
| ----- | ------------------------------------------ | -------------------------------------------- | --------------------------------------------- |
| 1     | 新 bat 启动后 key 被旧配置覆盖             | `CLAUDE_CONFIG_DIR` 不独立                   | 每套配置用不同目录                            |
| 2     | "There's an issue with the selected model" | settings 模型名 ≠ `--model`                  | 用同一个 `$model` 变量                        |
| 3     | 报 model not found                         | Base URL 与模型名不匹配                      | 先 curl 验证端点                              |
| 4     | key 静默回落到 `api.anthropic.com`         | `ANTHROPIC_API_KEY` 格式校验拒收非 `sk-ant-` | 用 `AUTH_TOKEN`，清空 `API_KEY`               |
| 5     | 双击闪退无提示                             | `chcp 65001` 没加 / title 含中文             | bat 第一行 `chcp 65001 > nul`，title 纯 ASCII |
| 6     | 反复输出同一段话→死循环                    | 插件 Stop 钩子 + 第三方 API 不稳定           | settings 加三行禁用变量                       |

### **工作目录三个坑**

1. 跨盘符不加 `/d` 切不过去
2. 路径含空格/`+`/中文不加引号被拆成多参数
3. 工作目录下 `.claude/settings.json` 若含 `enabledPlugins`，项目级配置反向覆盖独立配置

---

## **最终 Checklist**

- [ ] 确认 key 类型：Coding Plan vs 通用 API
- [ ] 确认 Base URL（API 端点，不是官网）
- [ ] 确认模型名在该端点下可用
- [ ] 生成 bat 文件名 `Claude-<服务商>-<模型>[-api].bat`
- [ ] 生成 ps1 文件名 `start-<服务商>-<模型>.ps1`（如需要）
- [ ] 配置目录 `~/.claude-<服务商>-<模型>`
- [ ] 写 ps1：统一 `$model` 变量，env 节带三行禁用变量
- [ ] 写 bat：chcp + ASCII title + cd /d
- [ ] 验证启动：`cmd /k "bat路径"`
- [ ] 更新 CLAUDE.md 的配置映射表
