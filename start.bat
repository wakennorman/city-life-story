@echo off
chcp 65001 >nul
cd /d "D:\Claude Code+DeepSeekV4\city-life-story\dist"
echo 🏙️ 正在启动城市浮生记...
start http://localhost:8080/
python -m http.server 8080