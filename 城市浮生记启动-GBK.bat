@echo off
chcp 65001 >nul
title City Life Story
cd /d D:\Claude Code+DeepSeekV4\city-life-story

echo Starting server...
start "Vite" cmd /c "npm run dev"
echo Waiting for server startup...
timeout /t 6 /nobreak >nul
start "" "http://127.0.0.1:5173/"
echo OK - Game started in browser
echo If browser didn't open, go to http://127.0.0.1:5173/
echo.
pause
