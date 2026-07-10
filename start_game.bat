@echo off
chcp 65001 >nul
title City Life Story
cd /d D:\Claude Code+DeepSeekV4\city-life-story

echo [1/3] Starting server...
start "Vite" cmd /c "npm run dev"
echo [2/3] Waiting 6s for server...
timeout /t 6 /nobreak >nul
start "" "http://127.0.0.1:5173/"
echo [3/3] Done! Game opened in browser.
echo.
echo If nothing happens, visit: http://127.0.0.1:5173/
echo.
pause