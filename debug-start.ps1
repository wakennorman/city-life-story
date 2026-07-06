param(
    [string]$TargetPs1,
    [string]$LogPath = 'D:\Claude Code+DeepSeekV4\debug-start.log'
)
$ErrorActionPreference = 'Stop'
$torun = Join-Path $PSScriptRoot $TargetPs1
if (-not (Test-Path -LiteralPath $torun)) { $torun = $TargetPs1 }
if (-not (Test-Path -LiteralPath $torun)) { $torun = Resolve-Path -Path $TargetPs1 }
try {
    $scriptContent = Get-Content -LiteralPath $torun -Raw
    if ($scriptContent -match 'PSScriptRoot') { $scriptContent = $scriptContent -replace '\$PSScriptRoot', '$script:projectDir'; Write-Host "replaced"; }
    $scriptBlock = [ScriptBlock]::Create($scriptContent)
    & $scriptBlock
    Write-Host '=== wrapper ended normally ==='
} catch {
    Write-Host "=== wrapper caught exception ==="
    Write-Host $_.Exception.Message
    if ($_.InvocationInfo) {
        Write-Host "Line=$($_.InvocationInfo.ScriptLineNumber)"
        Write-Host "Command=$($_.InvocationInfo.MyCommand)"
    }
    if ($script:projectDir) { Write-Host "projectDir=$script:projectDir"; } else { Write-Host 'projectDir=<undefined>'; }
    if ($MyInvocation) { Write-Host "MyInvocation.ScriptName=$($MyInvocation.MyCommand.Path)"; }
} finally {
    Write-Host '=== wrapper finally ==='
}
