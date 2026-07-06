#!/bin/bash
# 配置验证脚本 - D盘配置版本

CONFIG_DIR="/d/Claude Code+DeepSeekV4/config"

echo "======================================"
echo "Claude Code + DeepSeek 配置验证"
echo "配置目录: $CONFIG_DIR"
echo "======================================"

# 检查配置文件
echo ""
echo "[检查配置文件]"

if [ -f "$CONFIG_DIR/settings.json" ]; then
    echo "✓ $CONFIG_DIR/settings.json 存在"
    
    # 检查关键配置
    if grep -q "CLAUDE_CODE_ATTRIBUTION_HEADER" "$CONFIG_DIR/settings.json"; then
        echo "✓ CLAUDE_CODE_ATTRIBUTION_HEADER 已配置"
        
        if grep -q '"CLAUDE_CODE_ATTRIBUTION_HEADER": "0"' "$CONFIG_DIR/settings.json"; then
            echo "✓ CLAUDE_CODE_ATTRIBUTION_HEADER 值为 '0'（正确）"
        else
            echo "⚠ CLAUDE_CODE_ATTRIBUTION_HEADER 值可能不正确（应为字符串 '0'）"
        fi
    else
        echo "✗ 缺少 CLAUDE_CODE_ATTRIBUTION_HEADER 配置"
    fi
    
    if grep -q "ANTHROPIC_AUTH_TOKEN" "$CONFIG_DIR/settings.json"; then
        if grep -q "sk-your-deepseek-api-key-here" "$CONFIG_DIR/settings.json"; then
            echo "⚠ ANTHROPIC_AUTH_TOKEN 还是占位符，需要替换为实际 API Key"
        else
            echo "✓ ANTHROPIC_AUTH_TOKEN 已配置"
        fi
    else
        echo "✗ 缺少 ANTHROPIC_AUTH_TOKEN 配置"
    fi
    
    if grep -q "api.deepseek.com" "$CONFIG_DIR/settings.json"; then
        echo "✓ ANTHROPIC_BASE_URL 已配置为 DeepSeek"
    else
        echo "⚠ ANTHROPIC_BASE_URL 可能未配置为 DeepSeek"
    fi
else
    echo "✗ $CONFIG_DIR/settings.json 不存在"
fi

if [ -f "$CONFIG_DIR/.claude.json" ]; then
    echo "✓ $CONFIG_DIR/.claude.json 存在"
    
    if grep -q "hasCompletedOnboarding.*true" "$CONFIG_DIR/.claude.json"; then
        echo "✓ hasCompletedOnboarding 已设置为 true"
    else
        echo "⚠ hasCompletedOnboarding 未设置或为 false"
    fi
else
    echo "✗ $CONFIG_DIR/.claude.json 不存在（可能需要登录）"
fi

# 检查 Claude Code 安装
echo ""
echo "[检查 Claude Code 安装]"

if command -v claude &> /dev/null; then
    echo "✓ Claude Code 已安装"
    claude --version 2>&1 || echo "  版本信息获取失败"
else
    echo "✗ Claude Code 未安装"
    echo "  Windows PowerShell 运行以下命令安装："
    echo "  irm https://claude.ai/install.ps1 | iex"
fi

# 环境变量检查
echo ""
echo "[环境变量检查]"

if [ -n "$CLAUDE_CONFIG_DIR" ]; then
    echo "✓ CLAUDE_CONFIG_DIR 环境变量已设置: $CLAUDE_CONFIG_DIR"
else
    echo "⚠ CLAUDE_CONFIG_DIR 环境变量未设置"
    echo "  需要设置: export CLAUDE_CONFIG_DIR=\"$CONFIG_DIR\""
fi

if [ -n "$ANTHROPIC_AUTH_TOKEN" ]; then
    echo "✓ ANTHROPIC_AUTH_TOKEN 环境变量已设置"
else
    echo "  ANTHROPIC_AUTH_TOKEN 环境变量未设置（将使用 settings.json 中的配置）"
fi

if [ -n "$CLAUDE_CODE_ATTRIBUTION_HEADER" ]; then
    echo "✓ CLAUDE_CODE_ATTRIBUTION_HEADER 环境变量已设置: $CLAUDE_CODE_ATTRIBUTION_HEADER"
fi

# 检查启动脚本
echo ""
echo "[检查启动脚本]"

if [ -f "start-claude.ps1" ]; then
    echo "✓ start-claude.ps1 存在"
else
    echo "✗ start-claude.ps1 不存在"
fi

# 总结
echo ""
echo "======================================"
echo "验证完成"
echo "======================================"
echo ""
echo "下一步："
echo "1. 如果 API Key 还是占位符，编辑 $CONFIG_DIR/settings.json 替换为实际 Key"
echo "2. 使用启动脚本运行：./start-claude.ps1（PowerShell）或 ./start-claude.sh（Bash）"
echo "3. 或手动设置环境变量后运行 'claude'"
echo ""
