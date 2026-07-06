$ErrorActionPreference = "Stop"

$projectDir = $PSScriptRoot
try {
    $realUserProfile = [Environment]::GetFolderPath("UserProfile")
    $claudeHome = Join-Path $realUserProfile ".claude-home-longcat-cat20"
    $claudeConfigDir = Join-Path $realUserProfile ".claude-longcat-cat20"
    $settingsPath = Join-Path $claudeConfigDir "settings.json"
    $statePath = Join-Path $claudeHome ".claude.json"
    $claude = Join-Path $env:APPDATA "npm\claude.cmd"

    if (-not (Test-Path -LiteralPath $claude)) {
        throw "Claude Code is not installed."
    }

    New-Item -ItemType Directory -Force -Path $claudeHome | Out-Null
    New-Item -ItemType Directory -Force -Path $claudeConfigDir | Out-Null

    $model = "LongCat-2.0"
    $apiKey = "ak_26H2398QO88F8rN8Qy0Ou0ov2Az3k"
    $baseUrl = "http://127.0.0.1:8087"

    $settings = @"
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "$apiKey",
    "ANTHROPIC_BASE_URL": "$baseUrl",
    "ANTHROPIC_MODEL": "$model",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "$model",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "$model",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "$model",
    "CLAUDE_CODE_SUBAGENT_MODEL": "$model",
    "CLAUDE_CODE_EFFORT_LEVEL": "medium",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "SECURITY_GUIDANCE_DISABLE": "1",
    "ENABLE_STOP_REVIEW": "0",
    "MAX_STOP_HOOK_FIRINGS": "0"
  },
  "permissions": {
    "allow": ["Bash(*)", "Read(*)", "Write(*)", "Edit(*)"]
  },
  "theme": "auto",
  "autoMemoryEnabled": true
}
"@
    Set-Content -LiteralPath $settingsPath -Value $settings -Encoding UTF8

    $state = @'
{
  "hasCompletedOnboarding": true
}
'@
    Set-Content -LiteralPath $statePath -Value $state -Encoding UTF8

    $env:HOME = $claudeHome
    $env:USERPROFILE = $claudeHome
    $env:CLAUDE_CONFIG_DIR = $claudeConfigDir
    $env:ANTHROPIC_API_KEY = ""

    Set-Location -LiteralPath ([string]$projectDir)

    & $claude --model $model @args
}
catch {
    Write-Host "Start failed: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}
