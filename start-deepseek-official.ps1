$ErrorActionPreference = "Stop"
$env:CLAUDE_CONFIG_DIR = Join-Path $PSScriptRoot "config-deepseek"
$env:ANTHROPIC_API_KEY = $null
$env:ANTHROPIC_AUTH_TOKEN = "sk-ed5b96225594485e83c0344daa6ae257"
$env:ANTHROPIC_BASE_URL = "https://api.deepseek.com/anthropic"
$env:CLAUDE_CODE_ATTRIBUTION_HEADER = "0"
$env:ANTHROPIC_MODEL = "deepseek-v4-flash"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "deepseek-v4-flash"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "deepseek-v4-flash"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL = "deepseek-v4-flash"
$env:CLAUDE_CODE_EFFORT_LEVEL = "medium"

# Add rtk to PATH
$rtkPath = Join-Path ([Environment]::GetFolderPath("UserProfile")) ".local\bin"
if (Test-Path (Join-Path $rtkPath "rtk.exe")) {
    $env:PATH = "$rtkPath;$env:PATH"
}

$candidates = @(
    (Join-Path $env:APPDATA "npm\claude.cmd"),
    (Join-Path ([Environment]::GetFolderPath("ApplicationData")) "npm\claude.cmd")
)

if (Get-Command npm -ErrorAction SilentlyContinue) {
    $npmPrefix = npm config get prefix 2>$null
    if ($npmPrefix) {
        $candidates += Join-Path $npmPrefix "claude.cmd"
    }
}

$claudeCommand = Get-Command claude.cmd -ErrorAction SilentlyContinue
if ($claudeCommand) {
    $candidates += $claudeCommand.Source
}

$claude = $candidates | Where-Object { $_ -and (Test-Path -LiteralPath $_) } | Select-Object -First 1
if (-not $claude) {
    throw "Claude Code is not installed. Run .\\install.ps1 first."
}

Push-Location $PSScriptRoot
try {
    & $claude @args
} finally {
    Pop-Location
}
