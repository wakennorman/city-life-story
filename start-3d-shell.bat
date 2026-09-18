@echo off
chcp 65001 >nul
setlocal
title City-Life-Story 3D-First Shell

rem ============================================================
rem  《城市浮生记》3D-first 外壳 —— 本地预览启动器
rem
rem  双击 → 起服务 → 自动开浏览器 → 进入"开局就是 3D + HUD"的外壳页
rem
rem  为什么需要 HTTP 服务，不能双击 dev/_3dtest/shell.html：
rem    shell.html 会引用 /src/css/scene3d.css 的绝对路径，且 bundle
rem    里塞的是 gamedata.json。走 file:// 这根路线后它取不到（CORS）,
rem    画面白屏。必须有个服务根 = 项目根的服务。
rem
rem  服务本身 (scripts/serve-dev.cjs) 会把"/"做成首页浏览器入口，
rem    所以下面给的路径很短 —— 不容易被链接器再吞字符，你给我报的
rem    "404 not found" 就是因为消息里 URL 被吃了末尾的全角括号。
rem    若再报 404，直接访问 http://127.0.0.1:8977/ 这个超短入口。
rem ============================================================

set "APP_DIR=%~dp0"
set "PORT=8977"
set "URL=http://127.0.0.1:%PORT%/dev/_3dtest/shell.html"

if not exist "%APP_DIR%scripts\serve-dev.cjs" (
    echo ERROR: scripts/serve-dev.cjs not found
    echo Working dir should be the project root (city-life-story^).
    pause
    exit /b 1
)

rem —— 端口已经在服务了就直接开浏览器，不重复起进程 ——
curl -s -o nul --max-time 2 "%URL%" 2>nul && (
    echo Server already running on port %PORT%. Opening browser...
    start "" "%URL%"
    echo.
    echo Close the OTHER server window to stop it.
    timeout /t 4 >nul
    exit /b 0
)

rem —— 找一个可用的 Node（三级回退：PATH → WorkBuddy binaries 通配）——
set "NODE="
where node >nul 2>nul && set "NODE=node"
if not defined NODE (
    rem 用通配目录而不是写死版本号：WorkBuddy 升级后目录名会变
    for /d %%D in ("C:\Users\chw\.workbuddy\binaries\node\versions\*") do (
        if not defined NODE if exist "%%~fD\node.exe" set "NODE=%%~fD\node.exe"
    )
)
if not defined NODE (
    echo ERROR: no Node.js found on PATH or in the WorkBuddy binaries dir.
    echo Run any static server from this folder instead:
    echo   %APP_DIR%
    pause
    exit /b 1
)
echo Using Node: %NODE%
echo Starting 3D-first shell preview on port %PORT% ...
echo   URL: %URL%
echo   Close this window to stop the server.

start "" /B %NODE% "%APP_DIR%scripts\serve-dev.cjs" %PORT%

rem 等服务起来再开浏览器，否则会看到"无法访问"
ping 127.0.0.1 -n 3 >nul
start "" "%URL%"

echo.
echo ===================================
echo  City-Life-Story 3D-First Shell
echo  Home (all entries): http://127.0.0.1:%PORT%/
echo  Close this window to stop the server
echo ===================================
pause
