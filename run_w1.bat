@echo off
chcp 65001 > nul
title Claude Code v3.3-W1 (Volcano GLM-5.2)
cd /d "D:\Claude Code+DeepSeekV4\city-life-story"
set CLAUDE_CONFIG_DIR=%USERPROFILE%\.claude-volcano
set ANTHROPIC_API_KEY=
set ANTHROPIC_AUTH_TOKEN=ark-7cfaba66-34e9-4957-897d-4661d7388078-5f8f1
set ANTHROPIC_BASE_URL=https://ark.cn-beijing.volces.com/api/coding
set ANTHROPIC_MODEL=
type PROMPT_v3.3_W1.txt | claude --model glm-5.2 --print --permission-mode bypassPermissions --max-turns 200 --output-format text
