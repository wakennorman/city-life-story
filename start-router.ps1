$ErrorActionPreference = "Stop"

$ccr = Join-Path $PSScriptRoot "ccr-config\node_modules\.bin\ccr.cmd"
if (-not (Test-Path -LiteralPath $ccr)) {
    throw "Claude Code Router is not installed in ccr-config."
}

& (Join-Path $PSScriptRoot "sync-router-config.ps1") | Out-Null

$listening = Get-NetTCPConnection -State Listen -LocalPort 3456 -ErrorAction SilentlyContinue
if (-not $listening) {
    Start-Process -FilePath $ccr -ArgumentList "start" -WorkingDirectory (Split-Path $ccr) -WindowStyle Hidden | Out-Null
}

$deadline = (Get-Date).AddSeconds(15)
do {
    Start-Sleep -Milliseconds 300
    $listening = Get-NetTCPConnection -State Listen -LocalPort 3456 -ErrorAction SilentlyContinue
} until ($listening -or (Get-Date) -ge $deadline)

if (-not $listening) {
    throw "Claude Code Router failed to listen on 127.0.0.1:3456."
}

Write-Host "Claude Code Router is ready on http://127.0.0.1:3456"
