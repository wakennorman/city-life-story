#!/bin/bash
# 快速配置脚本 - 仅配置，不安装
# 适用于已安装 Claude Code 但需要配置 DeepSeek 的场景

set -e

echo "======================================"
echo "Claude Code + DeepSeek 快速配置"
echo "======================================"

# 检查 Claude Code 是否已安装
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code 未安装"
    echo "请先运行 install.sh 或手动安装"
    exit 1
fi

echo "✓ Claude Code 已安装: $(claude --version 2>&1 || echo 'unknown')"

# 提示用户输入 API Key
echo ""
echo "请输入你的 DeepSeek API Key:"
echo "（获取地址：https://platform.deepseek.com/api_keys）"
read -p "API Key: " API_KEY

if [ -z "$API_KEY" ]; then
    echo "❌ API Key 不能为空"
    exit 1
fi

# 创建配置目录
mkdir -p ~/.claude

# 配置 settings.json
cat > ~/.claude/settings.json << EOF
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "$API_KEY",
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

echo "✓ 已创建 ~/.claude/settings.json"

# 创建 .claude.json（绕过登录）
cat > ~/.claude.json << 'EOF'
{
  "hasCompletedOnboarding": true,
  "hasSeenWelcome": true,
  "installationId": "local-install",
  "version": "2.1.173"
}
EOF

echo "✓ 已创建 ~/.claude.json"

echo ""
echo "======================================"
echo "✓ 配置完成！"
echo "======================================"
echo ""
echo "现在可以运行 'claude' 启动了"
echo ""
echo "验证配置："
echo "1. 启动后应该直接进入对话界面（无需登录）"
echo "2. 使用一段时间后检查 DeepSeek 控制台的缓存命中率"
echo ""
