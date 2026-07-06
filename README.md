# Claude Code + DeepSeekV4 配置指南

## 核心问题与解决方案

### 问题一：缓存命中率下降（Claude Code 2.1.36+）

**现象**：

- 使用第三方 API（DeepSeek、vLLM、Bedrock 等）时
- Token 消耗暴涨、推理变慢
- 缓存命中率几乎为零

**原因**：
Claude Code 从 2.1.36 版本开始，在每个 API 请求的 system prompt 开头添加了：

```
x-anthropic-billing-header: cc_version=2.1.143.f09; cc_entrypoint=cli; cch=0f646;
```

其中 `cch` 是一个 5 位十六进制字符，每次请求都不同。这会导致：

1. 前缀哈希每次都变化
2. 所有断点缓存全部失效
3. 第三方网关/代理不知道要过滤这个字段

**解决方案**：
在 `~/.claude/settings.json` 的 `env` 中添加：

```json
{
  "env": {
    "CLAUDE_CODE_ATTRIBUTION_HEADER": "0"
  }
}
```

**验证方法**：
使用抓包工具（如 Claude Tab）检查请求，system 的第一个 block 应该直接是：

```
You are Claude Code, Anthropic's official CLI for Claude.
```

而不是 billing header。

---

### 问题二：最新版 Claude Code 强制登录

**现象**：

- 全新安装的 Claude Code 提示需要登录
- 即使配置了 `settings.json` 也无法绕过

**原因**：
Claude Code 检查 `ANTHROPIC_AUTH_TOKEN` 环境变量和 onboarding 状态。

**解决方案**：

1. 确保 `~/.claude/settings.json` 中配置了 `ANTHROPIC_AUTH_TOKEN`
2. 创建 `~/.claude.json` 文件：

```json
{
  "hasCompletedOnboarding": true,
  "hasSeenWelcome": true,
  "installationId": "local-install",
  "version": "2.1.173"
}
```

---

## 完整安装步骤

### 方式一：使用安装脚本（推荐）

**Linux/macOS**：

```bash
chmod +x install.sh
./install.sh
```

**Windows PowerShell**：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
.\install.ps1
```

### 方式二：手动安装

#### 1. 安装 Claude Code CLI

**Linux/macOS**：

```bash
curl -fsSL https://claude.ai/install.sh | sh
```

**Windows PowerShell**：

```powershell
irm https://claude.ai/install.ps1 | iex
```

#### 2. 创建配置目录

```bash
mkdir -p ~/.claude
```

#### 3. 创建 settings.json

```bash
cat > ~/.claude/settings.json << 'EOF'
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-your-deepseek-api-key-here",
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com",
    "CLAUDE_CODE_ATTRIBUTION_HEADER": "0"
  },
  "model": "deepseek-chat",
  "permissions": {
    "allow": [
      "Bash(*)",
      "Read(*)",
      "Write(*)",
      "Edit(*)"
    ]
  },
  "apiProvider": "anthropic"
}
EOF
```

**重要**：将 `sk-your-deepseek-api-key-here` 替换为你的实际 API Key。

#### 4. 创建 .claude.json（绕过登录）

```bash
cat > ~/.claude.json << 'EOF'
{
  "hasCompletedOnboarding": true,
  "hasSeenWelcome": true,
  "installationId": "local-install",
  "version": "2.1.173"
}
EOF
```

#### 5. 启动 Claude Code

```bash
claude
```

---

## 配置说明

### settings.json 字段说明

| 字段                             | 说明                                                               |
| -------------------------------- | ------------------------------------------------------------------ |
| `ANTHROPIC_AUTH_TOKEN`           | DeepSeek API Key（从 https://platform.deepseek.com/api_keys 获取） |
| `ANTHROPIC_BASE_URL`             | DeepSeek API 地址：`https://api.deepseek.com`                      |
| `CLAUDE_CODE_ATTRIBUTION_HEADER` | **设为 "0"**，禁用 billing header，解决缓存问题                    |
| `model`                          | 模型名称：`deepseek-chat`（V4）或 `deepseek-reasoner`（R1）        |

### DeepSeek 模型价格对比

| 模型              | 输入价格（元/百万token） | 输出价格（元/百万token） | 缓存命中价格   |
| ----------------- | ------------------------ | ------------------------ | -------------- |
| DeepSeek V4 Flash | ¥1                       | ¥2                       | ¥0.02（2分钱） |
| DeepSeek V4 Pro   | ¥4                       | ¥16                      | ¥0.08          |
| Claude Opus 4     | $15（~¥108）             | $75（~¥540）             | -              |

**省钱技巧**：

- 95% 以上的输入会命中缓存
- 实际使用一天可能只需要几块钱

---

## 验证配置

### 1. 验证 billing header 已禁用

使用抓包工具检查请求体，system prompt 应该直接以：

```
You are Claude Code, Anthropic's official CLI for Claude.
```

开头，而不是：

```
x-anthropic-billing-header: cc_version=...; cch=...;
```

### 2. 验证缓存命中率

- 使用一段时间后，检查 DeepSeek 控制台的用量统计
- 如果输入缓存命中率很高（>90%），说明配置正确

### 3. 验证登录绕过

- 启动 `claude` 后应该直接进入对话界面
- 不应该出现浏览器登录页面

---

## 常见问题

### Q1: 为什么我的缓存命中率还是低？

可能原因：

1. `CLAUDE_CODE_ATTRIBUTION_HEADER` 未设置为 `"0"`（注意是字符串）
2. 使用的是不支持缓存过滤的网关
3. 每次对话都在添加大量新内容（正常现象）

### Q2: vLLM 用户需要注意什么？

vLLM 0.17.1+ 已经修复了这个问题（PR #36829），会自动过滤 billing header。

如果你使用的是旧版本 vLLM，升级到 0.17.1+ 或设置 `CLAUDE_CODE_ATTRIBUTION_HEADER=0`。

### Q3: 还是提示需要登录怎么办？

1. 检查 `ANTHROPIC_AUTH_TOKEN` 是否正确设置
2. 检查 `~/.claude.json` 是否存在且内容正确
3. 尝试在终端中直接设置环境变量：
   ```bash
   export ANTHROPIC_AUTH_TOKEN="sk-xxx"
   claude
   ```

---

## 相关资源

- DeepSeek 官方文档：https://platform.deepseek.com/docs
- Claude Code 文档：https://docs.anthropic.com/en/docs/claude-code
- Claude Code GitHub Issues：https://github.com/anthropics/claude-code/issues
- vLLM PR #36829：https://github.com/vllm-project/vllm/pull/36829
