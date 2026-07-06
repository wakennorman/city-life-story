@echo off
setlocal
chcp 65001 > nul
title Claude SenseNova ds4f-tmp
cd /d "D:\Claude Code+DeepSeekV4"
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "D:\Claude Code+DeepSeekV4\debug-start.ps1" -TargetPs1 "D:\Claude Code+DeepSeekV4\start-sensenova-ds4f.ps1"
pause
