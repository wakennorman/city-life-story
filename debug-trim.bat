@echo off
setlocal
chcp 65001 > nul
title Claude DS4F Trim Test
cd /d "D:\Claude Code+DeepSeekV4"

echo;
echo [1] Checking python...
python --version >nul 2>&1
if errorlevel 1 (
  echo python missing
) else (
  python --version
)

echo;
echo [2] Checking proxy script...
if exist "proxy-sensenova.py" (
  echo proxy-sensenova.py found
) else (
  echo proxy script missing
)

echo;
echo [3] Checking install.ps1...
if exist "install.ps1" (
  echo install.ps1 present
) else (
  echo install.ps1 missing
)

echo;
echo [4] Checking claude.cmd...
if exist "%APPDATA%\npm\claude.cmd" (
  echo claude.cmd found
) else (
  echo claude.cmd missing
)

echo;
echo [5] Checking NVDA HelperBridge / NVDA...
if exist "C:\Program Files (x86)\NVDA\helperBridge.exe" (
  echo NVDA helperBridge present
) else (
  echo NVDA helperBridge NOT present
)

echo;
echo [6] Launching claude directly via cmd...
if exist "%APPDATA%\npm\claude.cmd" (
  "'%APPDATA%\npm\claude.cmd' --model deepseek-v4-flash"
  "%APPDATA%\npm\claude.cmd" --model deepseek-v4-flash
) else (
  echo skip
)
echo;
echo [7] ExitCode=%ERRORLEVEL%
pause
