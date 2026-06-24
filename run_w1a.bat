@echo off
chcp 65001 > nul
title W1A
cd /d "D:\Claude Code+DeepSeekV4\city-life-story"
set CLAUDE_CONFIG_DIR=%USERPROFILE%\.claude-volcano
set ANTHROPIC_API_KEY=
set ANTHROPIC_AUTH_TOKEN=ark-7cfaba66-34e9-4957-897d-4661d7388078-5f8f1
set ANTHROPIC_BASE_URL=https://ark.cn-beijing.volces.com/api/coding
set ANTHROPIC_MODEL=
powershell -NoProfile -Command "$p = [System.IO.File]::ReadAllText('PROMPT_v3.3_W1A.txt', [System.Text.Encoding]::UTF8); claude --model glm-5.2 --print --permission-mode bypassPermissions --max-turns 120 --output-format text $p"
