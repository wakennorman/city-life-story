@echo off
chcp 65001 > nul
title Claude Code Freemodel

cd /d "%USERPROFILE%"
set "CLAUDE_CONFIG_DIR=%USERPROFILE%\.claude-freemodel"
set "ANTHROPIC_API_KEY="
set "ANTHROPIC_AUTH_TOKEN=fe_oa_b1d7c17acd0c32bc7270cbbffaf09cd91994059f8db40e22"
set "ANTHROPIC_BASE_URL=https://cc.freemodel.dev"
set "ANTHROPIC_MODEL=claude-sonnet-4-6"
set "CLAUDE_CODE_ATTRIBUTION_HEADER=1"
set "CLAUDE_CODE_EFFORT_LEVEL=medium"
set "NO_PROXY=cc.freemodel.dev,*.freemodel.dev"
set "no_proxy=cc.freemodel.dev,*.freemodel.dev"

if not exist "%CLAUDE_CONFIG_DIR%\settings.json" (
  echo Missing "%CLAUDE_CONFIG_DIR%\settings.json"
  pause
  exit /b 1
)

set "CLAUDE_CMD="
if exist "%APPDATA%\npm\claude.cmd" set "CLAUDE_CMD=%APPDATA%\npm\claude.cmd"
if not defined CLAUDE_CMD (
  for /f "delims=" %%I in ('where claude.cmd 2^>nul') do if not defined CLAUDE_CMD set "CLAUDE_CMD=%%I"
)

if not defined CLAUDE_CMD (
  echo Claude Code is not installed.
  pause
  exit /b 1
)

call "%CLAUDE_CMD%" --model claude-sonnet-4-6 %*
