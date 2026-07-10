@echo off
chcp 65001 >nul
title 城市浮生记 - 安装桌面快捷方式

echo ┌──────────────────────────────┐
echo │  城市浮生记 - 安装桌面快捷方式  │
echo └──────────────────────────────┘
echo.
echo 正在创建桌面快捷方式（带地球图标）...

:: 用 PowerShell 创建快捷方式（-ExecutionPolicy Bypass 绕过执行策略）
powershell.exe -NoLogo -ExecutionPolicy Bypass -Command "$wshell=New-Object -ComObject WScript.Shell;$sc=$wshell.CreateShortcut([Environment]::GetFolderPath('Desktop')+'\城市浮生记.lnk');$sc.TargetPath='D:\Claude Code+DeepSeekV4\city-life-story\城市浮生记启动.bat';$sc.WorkingDirectory='D:\Claude Code+DeepSeekV4\city-life-story';$sc.Description='城市浮生记 - City Life Story';$sc.WindowStyle=1;$sc.IconLocation='%SystemRoot%\system32\url.dll,0';$sc.Save();Write-Host 'OK' -ForegroundColor Green"

echo.
if exist "%USERPROFILE%\Desktop\城市浮生记.lnk" (
    echo ✅ 桌面快捷方式已创建！
    echo 以后双击桌面「城市浮生记」即可启动游戏
) else (
    if exist "%USERPROFILE%\OneDrive\Desktop\城市浮生记.lnk" (
        echo ✅ 桌面快捷方式已创建！（OneDrive 桌面）
    ) else (
        echo ❌ 创建失败，请以管理员身份运行本脚本
    )
)
echo.
pause