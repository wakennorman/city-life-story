$ErrorActionPreference = "Stop"

$settingsPath = Join-Path $PSScriptRoot "config\settings.json"
$settings = Get-Content -Raw -Encoding UTF8 -LiteralPath $settingsPath | ConvertFrom-Json

$model = "claude-haiku-4-5-20251001"
$settings.env.ANTHROPIC_MODEL = $model
$settings.env.ANTHROPIC_DEFAULT_SONNET_MODEL = $model
$settings.env.ANTHROPIC_DEFAULT_HAIKU_MODEL = $model
$settings.env.CLAUDE_CODE_SUBAGENT_MODEL = $model
$settings.env.CLAUDE_CODE_EFFORT_LEVEL = "medium"
$settings.model = $model

$settings | ConvertTo-Json -Depth 20 | Set-Content -Encoding UTF8 -LiteralPath $settingsPath
Write-Host "Freemodel economy mode enabled: $model"
