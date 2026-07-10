@echo off
chcp 65001 > nul
cd /d "D:\Claude Code+DeepSeekV4\city-life-story"
set CLAUDE_CONFIG_DIR=%USERPROFILE%\.claude-volcano
set ANTHROPIC_API_KEY=
set ANTHROPIC_AUTH_TOKEN=ark-...f1
set ANTHROPIC_BASE_URL=https://ark.cn-beijing.volces.com/api/coding
set ANTHROPIC_MODEL=
type PROMPT.txt | claude --model glm-5.2 --print --permission-mode bypassPermissions --max-turns 120 --output-format text
