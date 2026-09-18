@echo off
chcp 65001 >nul
title City-Life-Story 3D-First Shell

rem ============================================================================
rem  《城市浮生记》3D-first 外壳 —— 双击即可
rem
rem  本文件只做两件事：找到 Node，然后调用 scripts\launch-3d-shell.cjs。
rem  端口探测 / 服务身份校验 / 就绪等待 全在那个 .cjs 里。
rem
rem  ── 为什么逻辑不写在 bat 里 ──────────────────────────────────────────────
rem    那段逻辑需要 for /f 捕获 curl 输出、netstat|findstr、延迟展开三样技巧
rem    叠加，而且**无法被自动化测试** —— 写错了只能靠人双击才发现。
rem    挪到 node 后可以用探针脚本回归，bat 语法降到最低。
rem
rem  ── ★ 为什么不能直接双击 dev\_3dtest\shell.html ──────────────────────────
rem    shell.html 引用 /src/css/scene3d.css 的绝对路径，bundle 里塞的是
rem    gamedata.json。走 file:// 协议这两样都被 CORS 拦掉 → 白屏。
rem    必须有一个「服务根 = 项目根」的 HTTP 服务。
rem
rem  ── ★ 为什么必须校验服务身份（这是上一版报 404 的真因）──────────────────
rem    旧版只探测「端口有没有应答」，任何程序应答都算服务已在跑，于是直接开
rem    浏览器。可旧启动器 start-3d.bat 的服务根是 experiments\3d，
rem    在那种服务上请求 dev/_3dtest/shell.html 必然 404 ——
rem    路径本身没错，是连错了服务。
rem ============================================================================

set "APP_DIR=%~dp0"

if not exist "%APP_DIR%scripts\launch-3d-shell.cjs" (
    echo [ERROR] 找不到 scripts\launch-3d-shell.cjs
    echo         这个 bat 必须放在 city-life-story 项目根目录下。
    pause
    exit /b 1
)

rem ── 找 Node（三级回退：PATH → WorkBuddy 通配目录）──
set "NODE="
where node >nul 2>nul && set "NODE=node"
if not defined NODE (
    rem 用通配目录而不是写死版本号：WorkBuddy 升级后目录名会变
    for /d %%D in ("C:\Users\%USERNAME%\.workbuddy\binaries\node\versions\*") do (
        if not defined NODE if exist "%%~fD\node.exe" set "NODE=%%~fD\node.exe"
    )
)
if not defined NODE (
    echo [ERROR] 找不到 Node.js（PATH 与 WorkBuddy binaries 目录都没有）。
    echo         可改用任意静态服务器，根目录指向：
    echo           %APP_DIR%
    pause
    exit /b 1
)

echo.
echo   City-Life-Story 3D-First Shell
echo   -----------------------------------
"%NODE%" "%APP_DIR%scripts\launch-3d-shell.cjs"
echo   -----------------------------------
echo.
echo   停止服务：关掉最小化的 "CityLifeServer" 窗口
echo.
pause
