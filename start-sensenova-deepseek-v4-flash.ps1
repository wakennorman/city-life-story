$ErrorActionPreference = "Stop"

$projectDir = $PSScriptRoot
$realUserProfile = [Environment]::GetFolderPath("UserProfile")
$claudeHome = Join-Path $realUserProfile ".claude-home-sensenova-deepseek-v4-flash"
$claudeConfigDir = Join-Path $realUserProfile ".claude-sensenova-deepseek-v4-flash"
$settingsPath = Join-Path $claudeConfigDir "settings.json"
$statePath = Join-Path $claudeHome ".claude.json"
$claude = Join-Path $env:APPDATA "npm\claude.cmd"

if (-not (Test-Path -LiteralPath $claude)) {
    throw "Claude Code is not installed."
}

New-Item -ItemType Directory -Force -Path $claudeHome | Out-Null
New-Item -ItemType Directory -Force -Path $claudeConfigDir | Out-Null

$proxyPort = 8089
$proxyScript = Join-Path $projectDir "proxy-sensenova.py"

# Kill any existing proxy on the port (best-effort, might fail without admin)
try {
    $existingProc = Get-NetTCPConnection -LocalPort $proxyPort -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique
    if ($existingProc) { Stop-Process -Id $existingProc -Force -ErrorAction SilentlyContinue; Start-Sleep -Seconds 1 }
} catch { /* ignore permission errors */ }

# Start proxy in background
$proxyProcess = Start-Process python "-u" $proxyScript $proxyPort -PassThru -WindowStyle Hidden
Write-Host "Proxy started (PID: $($proxyProcess.Id)) on port $proxyPort" -ForegroundColor Green
Start-Sleep -Seconds 2

$model = "deepseek-v4-flash"
$apiKey = "sk-OhjHsyX8dLoYru9zMjzZ7AvHe5EWf9XE"
$baseUrl = "http://127.0.0.1:$proxyPort"

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
    "allow": [
      "Bash(*)",
      "Read(*)",
      "Write(*)",
      "Edit(*)"
    ]
  },
  "theme": "auto",
  "autoMemoryEnabled": true,
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "rtk hook claude",
            "timeout": 5000
          }
        ]
      }
    ]
  }
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

# Add rtk to PATH
$rtkPath = "$env:USERPROFILE\.local\bin"
if (Test-Path (Join-Path $rtkPath "rtk.exe")) {
    $env:PATH = "$rtkPath;$env:PATH"
}

Set-Location -LiteralPath $projectDir

try {
    & $claude --model $model @args
}
catch {
    try {
        $proc = Get-NetTCPConnection -LocalPort $proxyPort -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -Unique
        if ($proc) { Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue }
    } catch {}
    Write-Host "Launch failed: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}
finally {
    # Kill proxy when Claude exits
    if ($proxyProcess -and -not $proxyProcess.HasExited) {
        Stop-Process -Id $proxyProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Proxy stopped." -ForegroundColor Gray
    }
}
