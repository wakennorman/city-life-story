@echo off
echo ============================================
echo   Claude Code Router 启动器
echo ============================================
echo.
echo  监听地址: http://127.0.0.1:3456
echo  DeepSeek: deepseek-v4-pro[1m]  (代码/文本/逻辑)
echo  MiniMax:  MiniMax-M3          (图片/视频/语音)
echo.
echo  按 Ctrl+C 停止服务
echo ============================================
echo.
cd /d "%~dp0"
node node_modules\@musistudio\claude-code-router\dist\cli.js start
pause
