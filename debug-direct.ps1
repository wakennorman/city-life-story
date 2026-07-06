param([string]$Target= 'D:\Claude Code+DeepSeekV4\start-sensenova-ds4f.ps1')
$ErrorActionPreference='Stop'
if (-not (Test-Path -LiteralPath $Target)) { throw "missing: $Target" }

Write-Host "=== direct script ==="
try { . $Target @args; Write-Host "DONE"; exit 0 } catch {
   Write-Host "ERROR: $($_.Exception.Message) line=$($_.InvocationInfo.ScriptLineNumber)"; exit 1
}
