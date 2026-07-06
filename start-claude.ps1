$ErrorActionPreference = "Stop"
$env:CLAUDE_CONFIG_DIR = Join-Path $PSScriptRoot "config"
$env:ANTHROPIC_API_KEY = $null

$candidates = @(
    (Join-Path $env:APPDATA "npm\claude.cmd"),
    (Join-Path ([Environment]::GetFolderPath("ApplicationData")) "npm\claude.cmd")
)

if (Get-Command npm -ErrorAction SilentlyContinue) {
    $npmPrefix = npm config get prefix 2>$null
    if ($npmPrefix) {
        $candidates += Join-Path $npmPrefix "claude.cmd"
    }
}

$claudeCommand = Get-Command claude.cmd -ErrorAction SilentlyContinue
if ($claudeCommand) {
    $candidates += $claudeCommand.Source
}

$claude = $candidates | Where-Object { $_ -and (Test-Path -LiteralPath $_) } | Select-Object -First 1
if (-not $claude) {
    throw "Claude Code is not installed. Run .\install.ps1 first."
}

& $claude @args
