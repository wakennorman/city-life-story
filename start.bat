@echo off
REM 如果是在 bash 下运行，跳转到 bash 逻辑
if "%1"=="" (
  if not defined COMSPEC goto :bash
)
if not "%COMSPEC%"=="" goto :cmd

:bash
cd "D:/Claude Code+DeepSeekV4/city-life-story/dist"
echo "Start game..."
start http://localhost:8080/
python -m http.server 8080
exit /b

:cmd
chcp 65001 >nul
D:
cd "D:\Claude Code+DeepSeekV4\city-life-story\dist"
start http://localhost:8080/
python -m http.server 8080
pause