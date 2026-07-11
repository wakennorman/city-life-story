$ErrorActionPreference = "Stop"

$projectDir = $PSScriptRoot
$proxyScript = Join-Path $projectDir "proxy-sensenova.py"
$proxyPort = 8088

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

    # Kill any existing proxy on the port (best-effort, might fail without admin)
    try {
        $existingProc = Get-NetTCPConnection -LocalPort $proxyPort -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -Unique
        if ($existingProc) {
            Stop-Process -Id $existingProc -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 1
        }
        Get-Process python* -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "proxy-sensenova" } |
            Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    } catch { /* ignore permission errors */ }

    # Start proxy in background (reliable method)
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "python"
    $psi.Arguments = "-u `"$proxyScript`" $proxyPort"
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $psi.RedirectStandardOutput = $false
    $psi.RedirectStandardError = $false
    $proxyProcess = [System.Diagnostics.Process]::Start($psi)
    Write-Host "Proxy started (PID: $($proxyProcess.Id)) on port $proxyPort" -ForegroundColor Green

    # Wait for proxy to be ready (poll port)
    $maxWait = 10; $ready = $false
    for ($i = 0; $i -lt $maxWait; $i++) {
        Start-Sleep -Seconds 1
        try { $test = Get-NetTCPConnection -LocalPort $proxyPort -ErrorAction Stop; if ($test.State -eq "Listen") { $ready = $true; break } } catch { }
    }
    if (-not $ready) { throw "Proxy did not start on port $proxyPort within ${maxWait}s" }

    $settings = @'
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-Qiag674sOboyfMoJHkUhB1SmF1xSxw3u",
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:8088",
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

    try {
        & $claude --model sensenova-6.7-flash-lite @args
    }
    finally {
        # Kill proxy when Claude exits
        if ($proxyProcess -and -not $proxyProcess.HasExited) {
            Stop-Process -Id $proxyProcess.Id -Force -ErrorAction SilentlyContinue
            Write-Host "Proxy stopped." -ForegroundColor Gray
        }
    }
}
catch {
    # Cleanup proxy on error
    try {
        $proc = Get-NetTCPConnection -LocalPort $proxyPort -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
        if ($proc) { Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue }
    } catch {}
    Write-Host "Start failed: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}
