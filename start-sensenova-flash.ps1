$ErrorActionPreference = "Stop"

$projectDir = $PSScriptRoot
try {
    $realUserProfile = [Environment]::GetFolderPath("UserProfile")
    $claudeHome = Join-Path $realUserProfile ".claude-home-sensenova-flash"
    $claudeConfigDir = Join-Path $realUserProfile ".claude-sensenova-flash"
    $settingsPath = Join-Path $claudeConfigDir "settings.json"
    $statePath = Join-Path $claudeHome ".claude.json"
    $claude = Join-Path $env:APPDATA "npm\claude.cmd"

    if (-not (Test-Path -LiteralPath $claude)) {
        throw "Claude Code is not installed."
    }

    New-Item -ItemType Directory -Force -Path $claudeHome | Out-Null
    New-Item -ItemType Directory -Force -Path $claudeConfigDir | Out-Null

    $settings = @'
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-Qiag674sOboyfMoJHkUhB1SmF1xSxw3u",
    "ANTHROPIC_BASE_URL": "https://token.sensenova.cn",
    "ANTHROPIC_MODEL": "sensenova-6.7-flash-lite",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "sensenova-6.7-flash-lite",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "sensenova-6.7-flash-lite",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "sensenova-6.7-flash-lite",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "systemPrompt": "You are a helpful AI assistant. Respond in Chinese.",
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
'@
    [System.IO.File]::WriteAllText($settingsPath, $settings, [System.Text.UTF8Encoding]::new($false))

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

    $rtkPath = Join-Path $env:USERPROFILE ".local\bin"
    if (Test-Path (Join-Path $rtkPath "rtk.exe")) {
        $env:PATH = "$rtkPath;$env:PATH"
    }

    Set-Location -LiteralPath ([string]$projectDir)

    & $claude --model sensenova-6.7-flash-lite @args
}
catch {
    Write-Host "Start failed: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}