# Claude Code + DeepSeek V4 installer for Windows
$ErrorActionPreference = "Stop"

$projectDir = $PSScriptRoot
$configDir = Join-Path $projectDir "config"
$settingsPath = Join-Path $configDir "settings.json"
$statePath = Join-Path $configDir ".claude.json"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js 18+ is required: https://nodejs.org/"
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm is required."
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git for Windows is required: https://git-scm.com/download/win"
}

Write-Host "Installing the latest Claude Code..."
npm install -g @anthropic-ai/claude-code@latest

New-Item -ItemType Directory -Force -Path $configDir | Out-Null

if (Test-Path $settingsPath) {
    $settings = Get-Content -Raw -Encoding UTF8 -LiteralPath $settingsPath | ConvertFrom-Json
} else {
    $settings = [pscustomobject]@{
        env = [pscustomobject]@{
            ANTHROPIC_AUTH_TOKEN = "sk-your-deepseek-api-key-here"
        }
        permissions = [pscustomobject]@{
            allow = @("Bash(*)", "Read(*)", "Write(*)", "Edit(*)")
        }
    }
}

if (-not $settings.env) {
    $settings | Add-Member -NotePropertyName env -NotePropertyValue ([pscustomobject]@{})
}

$deepSeekEnv = [ordered]@{
    ANTHROPIC_BASE_URL = "https://api.deepseek.com/anthropic"
    ANTHROPIC_MODEL = "deepseek-v4-pro[1m]"
    ANTHROPIC_DEFAULT_OPUS_MODEL = "deepseek-v4-pro[1m]"
    ANTHROPIC_DEFAULT_SONNET_MODEL = "deepseek-v4-pro[1m]"
    ANTHROPIC_DEFAULT_HAIKU_MODEL = "deepseek-v4-flash"
    CLAUDE_CODE_SUBAGENT_MODEL = "deepseek-v4-flash"
    CLAUDE_CODE_EFFORT_LEVEL = "max"
    CLAUDE_CODE_ATTRIBUTION_HEADER = "0"
}

foreach ($item in $deepSeekEnv.GetEnumerator()) {
    if ($settings.env.PSObject.Properties.Name -contains $item.Key) {
        $settings.env.($item.Key) = $item.Value
    } else {
        $settings.env | Add-Member -NotePropertyName $item.Key -NotePropertyValue $item.Value
    }
}

if ($settings.PSObject.Properties.Name -contains "model") {
    $settings.model = "deepseek-v4-pro[1m]"
} else {
    $settings | Add-Member -NotePropertyName model -NotePropertyValue "deepseek-v4-pro[1m]"
}

$settings | ConvertTo-Json -Depth 20 | Set-Content -Encoding UTF8 -LiteralPath $settingsPath

if (-not (Test-Path $statePath)) {
    [pscustomobject]@{
        hasCompletedOnboarding = $true
        hasSeenWelcome = $true
        installationId = "local-install"
    } | ConvertTo-Json | Set-Content -Encoding UTF8 -LiteralPath $statePath
}

[Environment]::SetEnvironmentVariable("CLAUDE_CONFIG_DIR", $configDir, "User")
[Environment]::SetEnvironmentVariable("CLAUDE_CODE_ATTRIBUTION_HEADER", "0", "User")

$npmPrefix = npm config get prefix
& (Join-Path $npmPrefix "claude.cmd") --version

Write-Host ""
Write-Host "Installation complete."
Write-Host "Config: $settingsPath"
if ($settings.env.ANTHROPIC_AUTH_TOKEN -eq "sk-your-deepseek-api-key-here") {
    Write-Warning "Replace the API key placeholder in config\settings.json before starting."
} else {
    Write-Host "Run .\start-claude.ps1 to start Claude Code."
}
