$ErrorActionPreference = "Stop"

$settingsPath = Join-Path $PSScriptRoot "config\settings.json"
$settings = Get-Content -Raw -Encoding UTF8 -LiteralPath $settingsPath | ConvertFrom-Json

$settings.env.ANTHROPIC_MODEL = "claude-sonnet-4-6"
$settings.env.ANTHROPIC_DEFAULT_SONNET_MODEL = "claude-sonnet-4-6"
$settings.env.ANTHROPIC_DEFAULT_HAIKU_MODEL = "claude-haiku-4-5-20251001"
$settings.env.CLAUDE_CODE_SUBAGENT_MODEL = "claude-sonnet-4-6"
$settings.env.CLAUDE_CODE_EFFORT_LEVEL = "max"
$settings.model = "claude-sonnet-4-6"

$settings | ConvertTo-Json -Depth 20 | Set-Content -Encoding UTF8 -LiteralPath $settingsPath
Write-Host "Freemodel performance mode enabled: claude-sonnet-4-6"
