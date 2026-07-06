# Backward-compatible entry point.
& (Join-Path $PSScriptRoot "install.ps1")
if ($LASTEXITCODE -eq 0) {
    & (Join-Path $PSScriptRoot "start-claude.ps1")
}
