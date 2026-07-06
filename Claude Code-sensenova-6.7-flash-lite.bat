@echo off
chcp 65001 > nul
title Claude Code SenseNova 6.7 Flash-Lite
cd /d "D:\Claude Code+DeepSeekV4"
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "D:\Claude Code+DeepSeekV4\start-sensenova-flash.ps1" %*