@echo off
chcp 65001 >nul
title City Life Story
setlocal

rem ============================================================================
rem  启动器（已含 3D 场景层）
rem ----------------------------------------------------------------------------
rem  为什么原版会失败：原版直接调用 `python -m http.server`，但本机 python
rem  **不在系统 PATH 上**（只存在于隔离目录），双击时 cmd 的 PATH 里没有它，
rem  于是报「不是内部或外部命令」—— 服务起不来，浏览器打开也是空白页。
rem  现改为三级回退查找，换机器也能用。
rem
rem  用法：双击即可。
rem        加 --no-browser 只起服务、不开浏览器（供脚本/测试用）。
rem ============================================================================

set "PORT=8080"
set "APPDIR=%~dp0dist"
set "URL=http://127.0.0.1:%PORT%/index.html"

if not exist "%APPDIR%\index.html" (
  echo [ERROR] dist\index.html not found.
  echo         Build it first:  python build.py
  pause
  exit /b 1
)

rem ---- 1) 已在服务中，就直接开浏览器 ----
rem    为什么要先探测：在已占用的端口上重复起服务会报错，用户看到一堆红字很慌。
curl -s -o nul --max-time 2 "%URL%" 2>nul
if not errorlevel 1 (
  if /i not "%1"=="--no-browser" start "" "%URL%"
  exit /b 0
)

rem ---- 2) 找 Python：PATH -> py 启动器 -> 通配隔离目录 ----
rem    通配目录而非写死版本号：升级后目录名会变（如 3.13.12 -> 3.13.14），写死即失效。
set "PY="
where python >nul 2>nul && set "PY=python"
if not defined PY ( where py >nul 2>nul && set "PY=py" )
if not defined PY (
  for /d %%D in ("C:\Users\%USERNAME%\.workbuddy\binaries\python\versions\*") do (
    if not defined PY if exist "%%~fD\python.exe" set "PY=%%~fD\python.exe"
  )
)
if not defined PY (
  echo [ERROR] Python not found on PATH nor in the WorkBuddy binaries dir.
  echo         Install Python or add it to PATH, then retry.
  pause
  exit /b 1
)

echo.
echo   Serving : %APPDIR%
echo   Open at : %URL%
echo   Stop    : close the minimized "CityLifeServer" window
echo.

rem ---- 3) 用独立窗口起服务（关掉那个最小化窗口即停止），等一下就绪再开浏览器 ----
rem    必须独立窗口：若用 start /B，本 bat 退出时子进程可能被一起杀掉。
start "CityLifeServer" /MIN cmd /c ""%PY%" -m http.server %PORT% --bind 127.0.0.1 --directory "%APPDIR%""
ping 127.0.0.1 -n 3 >nul
if /i not "%1"=="--no-browser" start "" "%URL%"

endlocal
