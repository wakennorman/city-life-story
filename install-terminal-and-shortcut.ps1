$ErrorActionPreference = "Stop"

$projectDir = $PSScriptRoot
$launcher = Join-Path $projectDir "start-wt.ps1"
$wt = Join-Path $env:LOCALAPPDATA "Microsoft\WindowsApps\wt.exe"

if (-not (Test-Path -LiteralPath $wt)) {
    throw "Windows Terminal is not installed. Install it from Microsoft Store, then run this script again."
}
if (-not (Test-Path -LiteralPath $launcher)) {
    throw "Launcher not found: $launcher"
}

$desktop = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktop "Claude Code + DeepSeek V4.lnk"
$oldShortcutPath = Join-Path $desktop "Claude Code.lnk"

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $wt
$shortcut.Arguments = "-d `"$projectDir`" powershell.exe -NoLogo -NoExit -ExecutionPolicy Bypass -File `"$launcher`""
$shortcut.WorkingDirectory = $projectDir
$shortcut.Description = "Claude Code + DeepSeek V4 in Windows Terminal"
$shortcut.IconLocation = "$wt,0"
$shortcut.Save()

if (Test-Path -LiteralPath $oldShortcutPath) {
    Remove-Item -LiteralPath $oldShortcutPath -Force
}

Write-Host "Windows Terminal detected: $wt"
Write-Host "Desktop shortcut created: $shortcutPath"
