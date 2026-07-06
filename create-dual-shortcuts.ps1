$ErrorActionPreference = "Stop"
$wt = Join-Path $env:LOCALAPPDATA "Microsoft\WindowsApps\wt.exe"
$desktop = [Environment]::GetFolderPath("Desktop")

$items = @(
    @{ Name = "Claude Code - Freemodel"; Script = "start-wt.ps1"; Description = "Code, text and reasoning with Freemodel" },
    @{ Name = "Claude Code - MiniMax Multimodal"; Script = "start-minimax-wt.ps1"; Description = "Images and multimodal tasks with MiniMax" }
)

$shell = New-Object -ComObject WScript.Shell
foreach ($item in $items) {
    $shortcut = $shell.CreateShortcut((Join-Path $desktop ($item.Name + ".lnk")))
    $shortcut.TargetPath = $wt
    $shortcut.Arguments = "-d `"$PSScriptRoot`" powershell.exe -NoLogo -NoExit -ExecutionPolicy Bypass -File `"$PSScriptRoot\$($item.Script)`""
    $shortcut.WorkingDirectory = $PSScriptRoot
    $shortcut.Description = $item.Description
    $shortcut.IconLocation = "$wt,0"
    $shortcut.Save()
}

Write-Host "Created Freemodel and MiniMax desktop shortcuts."
