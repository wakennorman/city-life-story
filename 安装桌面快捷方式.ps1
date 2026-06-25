<#
  城市浮生记 — 桌面快捷方式安装脚本
#>

$projectDir = "D:\Claude Code+DeepSeekV4\city-life-story"
$batPath = Join-Path $projectDir "城市浮生记启动.bat"
$desktop = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktop "城市浮生记.lnk"

# 检查启动文件是否存在
if (-not (Test-Path $batPath)) {
    Write-Host "❌ 未找到启动文件: $batPath" -ForegroundColor Red
    Read-Host "按 Enter 退出"
    exit 1
}

Write-Host "正在创建桌面快捷方式..." -ForegroundColor Cyan

# 创建 WScript.Shell COM 对象
try {
    $wshell = New-Object -ComObject WScript.Shell
} catch {
    Write-Host "❌ 无法创建 COM 对象: $_" -ForegroundColor Red
    Write-Host "请尝试以管理员身份运行" -ForegroundColor Yellow
    Read-Host "按 Enter 退出"
    exit 2
}

$shortcut = $wshell.CreateShortcut($shortcutPath)

# 基本属性
$shortcut.TargetPath = $batPath
$shortcut.WorkingDirectory = $projectDir
$shortcut.Description = "城市浮生记 — City Life Story（浏览器文字人生模拟游戏）"
$shortcut.WindowStyle = 1  # 普通窗口

# 设置图标 — 使用 Windows 内置地球图标
$shortcut.IconLocation = "$env:SystemRoot\system32\url.dll,0"

$shortcut.Save()

# 验证
if (Test-Path $shortcutPath) {
    Write-Host "✅ 桌面快捷方式已创建成功！" -ForegroundColor Green
    Write-Host "📌 位置: $shortcutPath" -ForegroundColor Cyan
    Write-Host "" -ForegroundColor Cyan
    Write-Host "🎮 以后重启电脑后，双击桌面「城市浮生记」即可启动游戏" -ForegroundColor Yellow
} else {
    Write-Host "❌ 快捷方式未创建成功，请检查权限" -ForegroundColor Red
}

Read-Host "按 Enter 退出"