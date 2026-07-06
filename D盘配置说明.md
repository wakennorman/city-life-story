# Claude Code 配置迁移到 D 盘

## 为什么迁移到 D 盘？

- C 盘空间不足
- Claude Code 配置文件默认存储在 C:\Users\用户名\.claude\
- 可以通过环境变量指定配置文件位置

## 配置文件位置

\*\*D:\Claude Code+DeepSeekV4\config\*\*

- `settings.json` - Claude Code 主配置
- `.claude.json` - 绕过登录配置

## 使用方法

### 方法一：设置环境变量（推荐）

在启动 Claude Code 前，设置配置目录环境变量：

**PowerShell**：

```powershell
$env:CLAUDE_CONFIG_DIR="D:\Claude Code+DeepSeekV4\config"
claude
```

**CMD**：

```cmd
set CLAUDE_CONFIG_DIR=D:\Claude Code+DeepSeekV4\config
claude
```

**Git Bash / WSL**：

```bash
export CLAUDE_CONFIG_DIR="/d/Claude Code+DeepSeekV4/config"
claude
```

### 方法二：创建启动脚本

使用项目中的 `start-claude.ps1` 脚本启动（已生成）：

```powershell
cd "D:\Claude Code+DeepSeekV4"
.\start-claude.ps1
```

### 方法三：创建符号链接（需要管理员权限）

如果你不想每次设置环境变量，可以创建符号链接：

**PowerShell（管理员）**：

```powershell
# 删除 C 盘的配置目录（如果存在）
Remove-Item -Path "$env:USERPROFILE\.claude" -Recurse -Force -ErrorAction SilentlyContinue

# 创建符号链接指向 D 盘
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.claude" -Target "D:\Claude Code+DeepSeekV4\config"
```

这样 Claude Code 会自动使用 D 盘的配置，无需设置环境变量。

## 验证配置

运行验证脚本：

```powershell
cd "D:\Claude Code+DeepSeekV4"
bash verify.sh
```

或者手动检查：

1. 配置文件是否存在：`D:\Claude Code+DeepSeekV4\config\settings.json`
2. API Key 是否已替换为实际值
3. 启动 Claude Code 后是否直接进入对话界面

## 完整安装步骤

1. **获取 DeepSeek API Key**
   访问 https://platform.deepseek.com/api_keys

2. **编辑配置文件**
   打开 `D:\Claude Code+DeepSeekV4\config\settings.json`
   将 `sk-your-deepseek-api-key-here` 替换为你的实际 API Key

3. **安装 Claude Code CLI**（如果尚未安装）

   ```powershell
   irm https://claude.ai/install.ps1 | iex
   ```

4. **启动 Claude Code**
   ```powershell
   cd "D:\Claude Code+DeepSeekV4"
   .\start-claude.ps1
   ```

## 环境变量说明

| 变量名                           | 值                                 | 说明                                             |
| -------------------------------- | ---------------------------------- | ------------------------------------------------ |
| `CLAUDE_CONFIG_DIR`              | `D:\Claude Code+DeepSeekV4\config` | 指定配置目录                                     |
| `ANTHROPIC_AUTH_TOKEN`           | API Key                            | 可选，也可在 settings.json 中配置                |
| `CLAUDE_CODE_ATTRIBUTION_HEADER` | `0`                                | 禁用 billing header（已在 settings.json 中设置） |

## 注意事项

- 配置文件中的 `CLAUDE_CODE_ATTRIBUTION_HEADER: "0"` 已设置，解决缓存命中率问题
- 如果使用符号链接方法，删除链接时使用 `Remove-Item`，不会影响 D 盘的配置文件
- 建议使用方法一（环境变量）或方法二（启动脚本），最灵活

## 启动脚本说明

已生成 `start-claude.ps1` 脚本，内容：

```powershell
$env:CLAUDE_CONFIG_DIR = "D:\Claude Code+DeepSeekV4\config"
claude
```

直接运行即可启动 Claude Code 并使用 D 盘配置。
