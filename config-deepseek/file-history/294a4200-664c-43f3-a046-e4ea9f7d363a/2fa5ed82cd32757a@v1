@echo off
setlocal
chcp 65001 > nul
title Claude Code DeepSeek API
cd /d "D:\Claude Code+DeepSeekV4"

set "CLAUDE_CONFIG_DIR=D:\Claude Code+DeepSeekV4\config-deepseek"
set "ANTHROPIC_API_KEY="
set "ANTHROPIC_AUTH_TOKEN=sk-ed5b96225594485e83c0344daa6ae257"
set "ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic"
set "CLAUDE_CODE_ATTRIBUTION_HEADER=0"
set "ANTHROPIC_MODEL=deepseek-v4-flash"
set "ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-flash"
set "ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-flash"
set "ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash"
set "CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash"
set "CLAUDE_CODE_EFFORT_LEVEL=medium"
set "PATH=%APPDATA%\npm;%PATH%"

if not exist "%APPDATA%\npm\claude.cmd" (
    echo.
    echo Claude Code is not installed, or %%APPDATA%%\npm\claude.cmd is missing.
    pause
    exit /b 1
)

call "%APPDATA%\npm\claude.cmd" %*
set "CLAUDE_EXIT_CODE=%ERRORLEVEL%"

if not "%CLAUDE_EXIT_CODE%"=="0" (
    echo.
    echo Claude Code exited with an error. See the message above.
    pause
)

exit /b %CLAUDE_EXIT_CODE%
