$ErrorActionPreference = "Stop"

$projectDir = $PSScriptRoot
try {
    $realUserProfile = [Environment]::GetFolderPath("UserProfile")
    $claudeHome = Join-Path $realUserProfile ".claude-home-siliconflow-ds4pro"
    $claudeConfigDir = Join-Path $realUserProfile ".claude-siliconflow-ds4pro"
    $settingsPath = Join-Path $claudeConfigDir "settings.json"
    $statePath = Join-Path $claudeHome ".claude.json"
    $claude = Join-Path $env:APPDATA "npm\claude.cmd"

    if (-not (Test-Path -LiteralPath $claude)) {
        throw "Claude Code is not installed."
    }

    New-Item -ItemType Directory -Force -Path $claudeHome | Out-Null
    New-Item -ItemType Directory -Force -Path $claudeConfigDir | Out-Null

    $proxyUrl = "http://127.0.0.1:8090"

    $portInUse = netstat -ano | Select-String ":8090 " | Select-String "LISTENING"
    if ($portInUse) {
        Write-Host "Proxy already running on $proxyUrl, reusing." -ForegroundColor Green
    } else {
        Write-Host "Starting SiliconFlow proxy at $proxyUrl..." -ForegroundColor Cyan
    }

    $apiKey = "«redacted:sk-…»"
    $settings = @"
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "$apiKey",
    "ANTHROPIC_BASE_URL": "$proxyUrl",
    "ANTHROPIC_MODEL": "deepseek-ai/DeepSeek-V4-Pro",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-ai/DeepSeek-V4-Pro",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-ai/DeepSeek-V4-Pro",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-ai/DeepSeek-V4-Pro",
    "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-ai/DeepSeek-V4-Pro",
    "CLAUDE_CODE_EFFORT_LEVEL": "medium",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "SECURITY_GUIDANCE_DISABLE": "1",
    "ENABLE_STOP_REVIEW": "0",
    "MAX_STOP_HOOK_FIRINGS": "0"
  },
  "permissions": {
    "allow": [
      "Bash(*)",
      "Read(*)",
      "Write(*)",
      "Edit(*)"
    ]
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

    & $claude --model "deepseek-ai/DeepSeek-V4-Pro" @args
}
catch {
    Write-Host "Start failed: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}
