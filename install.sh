#!/bin/bash
# Claude Code + DeepSeekV4 安装脚本
# 解决缓存命中率和登录绕过问题

set -e

echo "======================================"
echo "Claude Code + DeepSeekV4 安装脚本"
echo "======================================"

# 检测操作系统
OS_TYPE=$(uname -s)
echo "检测到操作系统: $OS_TYPE"

# 1. 安装 Claude Code CLI
echo ""
echo "[1/4] 安装 Claude Code..."
if command -v claude &> /dev/null; then
    echo "Claude Code 已安装，版本: $(claude --version)"
else
    echo "正在安装 Claude Code..."
    # 使用国内镜像加速（如果需要）
    if [[ "$OS_TYPE" == "Linux" ]] || [[ "$OS_TYPE" == "Darwin" ]]; then
        # macOS/Linux
        curl -fsSL https://claude.ai/install.sh | sh
    else
        echo "Windows 系统请使用 PowerShell 执行以下命令："
        echo "irm https://claude.ai/install.ps1 | iex"
        exit 1
    fi
fi

# 2. 创建 Claude 配置目录
echo ""
echo "[2/4] 创建配置目录..."
mkdir -p ~/.claude
mkdir -p ~/.claude/projects

# 3. 配置 settings.json（核心：解决缓存命中率问题）
echo ""
echo "[3/4] 配置 settings.json..."

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

echo "已创建 ~/.claude/settings.json"
echo "⚠️  请手动编辑该文件，将 sk-your-deepseek-api-key-here 替换为你的 DeepSeek API Key"

# 4. 创建 .claude.json（解决登录绕过问题）
echo ""
echo "[4/4] 配置 .claude.json（绕过登录）..."

cat > ~/.claude.json << 'EOF'
{
  "hasCompletedOnboarding": true,
  "hasSeenWelcome": true,
  "installationId": "local-install",
  "version": "2.1.173"
}
EOF

echo "已创建 ~/.claude.json"

# 完成
echo ""
echo "======================================"
echo "✓ 安装配置完成！"
echo "======================================"
echo ""
echo "后续步骤："
echo "1. 获取 DeepSeek API Key: https://platform.deepseek.com/api_keys"
echo "2. 编辑 ~/.claude/settings.json，替换 API Key"
echo "3. 运行 'claude' 启动"
echo ""
echo "配置说明："
echo "- CLAUDE_CODE_ATTRIBUTION_HEADER=0 已设置，解决缓存命中率问题"
echo "- hasCompletedOnboarding=true 已设置，绕过登录流程"
echo ""
