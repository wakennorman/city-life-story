$ErrorActionPreference = "Stop"

$projectDir = $PSScriptRoot
try {
    $realUserProfile = [Environment]::GetFolderPath("UserProfile")
    $claudeHome = Join-Path $realUserProfile ".claude-home-freemodel-haiku"
    $claudeConfigDir = Join-Path $realUserProfile ".claude-freemodel-haiku"
    $settingsPath = Join-Path $claudeConfigDir "settings.json"
    $statePath = Join-Path $claudeHome ".claude.json"
    $claude = Join-Path $env:APPDATA "npm\claude.cmd"

    if (-not (Test-Path -LiteralPath $claude)) {
        throw "Claude Code is not installed."
    }

    New-Item -ItemType Directory -Force -Path $claudeHome | Out-Null
    New-Item -ItemType Directory -Force -Path $claudeConfigDir | Out-Null

    $model = "claude-haiku-4-5-20251001"
    $apiKey = "fe_oa_b1d7c17acd0c32bc7270cbbffaf09cd91994059f8db40e22"
    $baseUrl = "https://cc.freemodel.dev"

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
    "CLAUDE_CODE_EFFORT_LEVEL": "low",
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

    $rtkPath = "$env:USERPROFILE\.local\bin"
    if (Test-Path (Join-Path $rtkPath "rtk.exe")) {
        $env:PATH = "$rtkPath;$env:PATH"
    }

    Set-Location -LiteralPath ([string]$projectDir)

    Write-Host "====================================="
    Write-Host "  Freemodel Haiku 经济模式"
    Write-Host "  模型: $model"
    Write-Host "  Effort: low (最短输出)"
    Write-Host "====================================="
    Write-Host ""

    & $claude --model $model @args
}
catch {
    Write-Host "Start failed: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}
