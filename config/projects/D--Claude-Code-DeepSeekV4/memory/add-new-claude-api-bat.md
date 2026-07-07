---
name: add-new-claude-api-bat
description: 在 Windows 上为新 API 服务商（火山/智谱/DeepSeek/魔搭等第三方 Claude 兼容端点）建立桌面 bat 快捷启动方式，与已有配置完全隔离的标准操作步骤
metadata:
  node_type: memory
  type: feedback
  originSessionId: 866da720-658b-4db5-97fa-337a78724015
---

# Windows 多 API 隔离启动方案（Claude Code 第三方服务商 + 桌面 bat）

用户已有一套 Claude Code 配置在跑（例如 `D:\Claude Code+DeepSeekV4\config` 下的 freemodel/Anthropic），现在要再加一个新 API 服务商（如火山引擎 GLM-5.2、智谱、DeepSeek、魔搭等），并希望桌面双击 bat 就能进入新配置，且**绝对不影响**原有窗口。

## 三个必须避开的坑（按踩坑频率排序）

### 坑 1：`CLAUDE_CONFIG_DIR` 已被系统级设置指向旧目录（根本原因，最容易漏）

用户原有启动脚本通常会设 `CLAUDE_CONFIG_DIR=D:\Claude Code+DeepSeekV4\config`，那个 `settings.json` 里的 `env` 节会在 Claude 启动后**覆盖** bat 里 `set` 的环境变量。即使 bat 里的 `ANTHROPIC_BASE_URL` 是新的，一启动就被旧 `settings.json` 改回 freemodel 的地址，结果还是连 `api.anthropic.com`。

→ **解法：为新 API 建独立配置目录**，例如 `%USERPROFILE%\.claude-<服务商>`（如 `.claude-volcano`），bat 里把 `CLAUDE_CONFIG_DIR` 指向它，两套配置物理隔离。

### 坑 2：`ANTHROPIC_API_KEY` 格式校验拒绝非 `sk-ant-` 开头的 key

Claude Code 对 `ANTHROPIC_API_KEY` 做格式校验，只认 Anthropic 官方 `sk-ant-xxx` 格式。第三方 key（`ark-xxx`、`sk-xxx`、`ms-xxx` 等）会被拒绝，然后**静默回落到 `api.anthropic.com`**，表现为「URL 设了但没用」。

→ **解法：用 `ANTHROPIC_AUTH_TOKEN` 传 key**（不做格式校验），不要用 `ANTHROPIC_API_KEY`。

### 坑 3：bat 文件中文 title 导致 `'aude' 不是内部命令` 闪退

bat 保存为 UTF-8 但 cmd 默认 GBK 解码，title 行的中文字节错位会吃掉下一行 `claude` 的首字符 `c`，变成 `aude` 不是命令。

→ **解法：bat 第一行加 `chcp 65001 > nul`，title 用纯 ASCII 更稳。**

## 标准操作步骤（任何 agent 或人手都能跟着做）

### 第 1 步：建立独立配置目录

路径建议：`C:\Users\<用户名>\.claude-<服务商英文名>`，例如：

- 火山引擎 → `.claude-volcano`
- 智谱 GLM → `.claude-zhipu`
- DeepSeek → `.claude-deepseek`
- 魔搭 → `.claude-modelscope`

```bash
mkdir -p "C:/Users/<用户名>/.claude-<服务商>"
```

### 第 2 步：在该目录下写 `settings.json`

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "<新服务商的 API key 原样填入>",
    "ANTHROPIC_BASE_URL": "<新服务商的 base URL，注意结尾是否带 /api 或 /api/coding>"
  },
  "model": "<新服务商支持的模型 ID,如 glm-5.2、deepseek-chat 等>",
  "permissions": {
    "allow": ["Bash(*)", "Read(*)", "Write(*)", "Edit(*)"]
  },
  "autoMemoryEnabled": true
}
```

注意 key 必须放 `ANTHROPIC_AUTH_TOKEN` 字段，**不是** `ANTHROPIC_API_KEY`。

### 第 3 步：在桌面写 bat 文件

路径：`C:\Users\<用户名>\Desktop\Claude-<服务商>.bat`

模板（可直接复制改三处占位符）：

```bat
@echo off
chcp 65001 > nul
title Claude Code - <Vendor> <Model>
cd /d %USERPROFILE%
set CLAUDE_CONFIG_DIR=%USERPROFILE%\.claude-<服务商>
set ANTHROPIC_API_KEY=
set ANTHROPIC_AUTH_TOKEN=<key 原样填入>
set ANTHROPIC_BASE_URL=<base URL>
set ANTHROPIC_MODEL=
claude --model <模型 ID>
```

每行的作用：

| 行                             | 作用                         | 不能省略的原因                                                                                                                                                                                                                      |
| ------------------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chcp 65001 > nul`             | 切换 cmd 到 UTF-8 编码       | 避免坑 3 闪退                                                                                                                                                                                                                       |
| `title ...` 用 ASCII           | 不依赖编码                   | 双重保险                                                                                                                                                                                                                            |
| `cd /d <工作目录>`             | 设定 Claude 启动后的工作目录 | 默认写 `%USERPROFILE%` 最稳；想直接落到项目目录就写 `cd /d "D:\项目路径"`（**跨盘符必须 `/d`**；路径含空格、`+`、中文等任何特殊字符**必须加引号**）。前提：该目录下不能有 `.claude/settings.json`，否则项目级配置会覆盖独立配置目录 |
| `set CLAUDE_CONFIG_DIR=...`    | 指向新独立目录               | **核心隔离开关**（坑 1）                                                                                                                                                                                                            |
| `set ANTHROPIC_API_KEY=`       | 清空旧 key                   | 防止从用户/系统环境变量继承到                                                                                                                                                                                                       |
| `set ANTHROPIC_AUTH_TOKEN=...` | 传第三方 key                 | 绕开格式校验（坑 2）                                                                                                                                                                                                                |
| `set ANTHROPIC_BASE_URL=...`   | 指新端点                     | 必须                                                                                                                                                                                                                                |
| `set ANTHROPIC_MODEL=`         | 清空旧模型变量               | 防止从父环境继承到错误模型名                                                                                                                                                                                                        |
| `claude --model <id>`          | 启动并显式指定模型           | settings.json 里的 model 是兜底，命令行优先级更高更稳                                                                                                                                                                               |

### 第 4 步：双击 bat 验证

- 正常情况：直接进入 Claude Code 欢迎界面，左下角显示新模型名（如 `glm-5.2 · API Usage Billing`）。
- 如果闪退：在已开的 cmd 窗口里跑 `cmd /k "C:\Users\<用户名>\Desktop\Claude-<服务商>.bat"`，看停住的窗口报什么错。
- 如果显示 `Unable to connect to Anthropic services / api.anthropic.com`：说明环境变量被旧配置覆盖了，回去检查坑 1 / 坑 2 是否两个都修了。

## 验证 API 端点本身可用（排错时用）

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST "<base-url>/v1/messages" -H "x-api-key: <key>"
```

返回 200 / 400 / 401 都说明端点活着，是配置问题；返回 000 / 超时才是网络/端点错。

## 几个容易问错的点

- **不要**把新配置直接加进 `~/.claude/settings.json`（用户的全局默认），那会污染所有其它启动方式。新服务商一定建独立目录。
- **不要**在新 bat 里用 `start cmd` 之类再起一个 cmd，那会丢失环境变量传递。直接在当前 cmd 里 `claude` 即可。
- **工作目录（`cd /d` 那一行）**：用户常希望 bat 启动后直接落在项目目录而不是 `C:\Users\<用户名>`。改法是把 `cd /d %USERPROFILE%` 替换成 `cd /d "D:\项目路径"`。三个隐形坑：① 跨盘符不加 `/d` 切不过去；② 路径含空格 / `+` / 中文不加引号会被拆成多参数报错；③ 该目录下若存在 `.claude/settings.json`，项目级配置会反向覆盖 `CLAUDE_CONFIG_DIR` 指向的独立配置——隔离就失效了。
- 如果用户走代理（`HTTPS_PROXY` 等），代理变量会从父环境继承，不需要在 bat 里再设；除非新端点要求不走代理，那就 `set HTTPS_PROXY=`。

## 给 agent 的最简协议

用户只会提供两条信息：

1. **服务商名字**（中英文皆可，如「火山引擎」「智谱」「DeepSeek」「魔搭」）
2. **API key 原样**（必须用户给，搜不到）

其余信息 agent 自己解决：

- **base URL、模型 ID、是否需要 `/api/coding` 之类的路径后缀** → WebSearch / WebFetch 查官方文档
- **服务商英文短名**（用作 `.claude-xxx` 目录名）→ 自己起，常见映射：火山=volcano、智谱=zhipu、深度求索=deepseek、魔搭=modelscope
- **该服务商 key 是用 `ANTHROPIC_API_KEY` 还是 `ANTHROPIC_AUTH_TOKEN`** → 看坑 2，非 `sk-ant-` 开头一律用 `AUTH_TOKEN`

搜文档时关键词建议：「<服务商> Claude Code 接入」「<服务商> Anthropic 兼容 API」「<服务商> ANTHROPIC_BASE_URL」。

相关：[[user-default-language-chinese]]
