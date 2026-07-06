$ErrorActionPreference = "Stop"
$env:CLAUDE_CONFIG_DIR = Join-Path $PSScriptRoot "config-minimax"
$env:CLAUDE_CODE_ATTRIBUTION_HEADER = "0"

$claude = Join-Path $env:APPDATA "npm\claude.cmd"
if (-not (Test-Path -LiteralPath $claude)) {
    throw "Claude Code is not installed."
}

& $claude @args
