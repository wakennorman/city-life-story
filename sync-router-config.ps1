$ErrorActionPreference = "Stop"

$source = Join-Path $PSScriptRoot "ccr-config\config.json"
$targetDir = Join-Path $env:USERPROFILE ".claude-code-router"
$target = Join-Path $targetDir "config.json"

New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
Copy-Item -Force -LiteralPath $source -Destination $target

Write-Host "Router config synced: $target"
