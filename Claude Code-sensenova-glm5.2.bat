@echo off
chcp 65001 > nul
title Claude Code SenseNova glm-5.2
cd /d "D:\Claude Code+DeepSeekV4"
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "D:\Claude Code+DeepSeekV4\start-sensenova-glm5.2.ps1" %*