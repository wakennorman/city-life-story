$ErrorActionPreference = "Stop"

$projectDir = $PSScriptRoot
try {
    $realUserProfile = [Environment]::GetFolderPath("UserProfile")
    $claudeHome = Join-Path $realUserProfile ".claude-home-agnes-api-flash"
    $claudeConfigDir = Join-Path $realUserProfile ".claude-agnes-api-flash"
    $settingsPath = Join-Path $claudeConfigDir "settings.json"
    $statePath = Join-Path $claudeHome ".claude.json"
    $claude = Join-Path $env:APPDATA "npm\claude.cmd"

    if (-not (Test-Path -LiteralPath $claude)) {
        throw "Claude Code is not installed."
    }

    New-Item -ItemType Directory -Force -Path $claudeHome | Out-Null
    New-Item -ItemType Directory -Force -Path $claudeConfigDir | Out-Null

    # ── Agnes-2.0-Flash ──────────────────────────────────────
    #   ● 视觉能力（图片输入）— DeepSeek V4 Flash / GLM-5.2 都不支持
    #   ● 1M Token 百万上下文（高峰期限速至 512K）
    #   ● 最大输出 65536 (64K) Token
    #   ● 免费文本生成模型
    # ──────────────────────────────────────────────────────────
    $model = "agnes-2.0-flash"
    $apiKey = "sk-hO5WSjdwEF9DgywtiBU1vDUGTJNU7uz2zPqgktyQbMVxBK0y"
    $agnesDirectUrl = "https://apihub.agnes-ai.com/v1"

    # ── 启动本地翻译代理 ──────────────────────────────────────
    # 解决 Agnes API 的 anthropic-beta / tools 兼容问题
    $proxyPort = 3456
    $proxyScript = Join-Path $projectDir "agnes-proxy.js"
    $proxyLog = Join-Path $projectDir "agnes-proxy.log"
    $proxyErrLog = Join-Path $projectDir "agnes-proxy-error.log"

    if (Test-Path $proxyScript) {
        # 检查 node 是否可用
        $nodePath = (Get-Command "node" -ErrorAction SilentlyContinue).Source
        if (-not $nodePath) {
            Write-Host "Warning: node not found, using direct connection" -ForegroundColor Yellow
            $baseUrl = $agnesDirectUrl
        } else {
            Write-Host "Starting local proxy (127.0.0.1:$proxyPort) using $nodePath..." -ForegroundColor Cyan
            $proxyProc = Start-Process -FilePath $nodePath -ArgumentList @("`"$proxyScript`"", "--port", "$proxyPort") -WindowStyle Hidden -PassThru -RedirectStandardOutput $proxyLog -RedirectStandardError $proxyErrLog
            Start-Sleep -Milliseconds 1500

            # 等待代理就绪（最多等 5 秒）
            $ready = $false
            for ($i = 0; $i -lt 10; $i++) {
                try {
                    $r = Invoke-WebRequest -Uri "http://127.0.0.1:$proxyPort/health" -UseBasicParsing -TimeoutSec 1
                    if ($r.StatusCode -eq 200) { $ready = $true; break }
                } catch { }
                Start-Sleep -Milliseconds 500
            }

            if (-not $ready) {
                Write-Host "Warning: Proxy did not respond (check $proxyErrLog), falling back to direct" -ForegroundColor Yellow
                $baseUrl = $agnesDirectUrl
        } else {
            Write-Host "Proxy ready. Routing via http://127.0.0.1:$proxyPort" -ForegroundColor Green
            $baseUrl = "http://127.0.0.1:$proxyPort"
        }
    } else {
        Write-Host "Warning: agnes-proxy.js not found, using direct connection" -ForegroundColor Yellow
        $baseUrl = $agnesDirectUrl
    }

    $settings = @"
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "$apiKey",
    "ANTHROPIC_BASE_URL": "$baseUrl",
    "ANTHROPIC_MODEL": "$model",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "$model",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "$model",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "$model",
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

    # 1M 上下文（1048576 输入）: 服务端模型原生支持，无需客户端参数
    # 64K 输出（65536）: 模型上限，Claude Code 自动协商
    & $claude --model $model @args
}
catch {
    Write-Host "Start failed: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}
finally {
    # ── 清理：关闭本地代理 ────────────────────────────────────
    if ($proxyProc -and -not $proxyProc.HasExited) {
        Write-Host "Shutting down local proxy..." -ForegroundColor Cyan
        Stop-Process -Id $proxyProc.Id -Force -ErrorAction SilentlyContinue
    }
}