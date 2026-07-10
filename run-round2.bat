@echo off
set HOME=%USERPROFILE%\.claude-home-sensenova-flash
set CLAUDE_CONFIG_DIR=%USERPROFILE%\.claude-sensenova-flash
cd /d "D:\Claude Code+DeepSeekV4\city-life-story"
type expansion-round2.txt | claude --model sensenova-6.7-flash-lite --print --allow-dangerously-skip-permissions --max-turns 50