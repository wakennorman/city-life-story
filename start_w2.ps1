$projectDir = "D:\Claude Code+DeepSeekV4\city-life-story"
$claudeHome = Join-Path ([Environment]::GetFolderPath("UserProfile")) ".claude-home-sensenova-deepseek-v4-flash"
$claudeConfigDir = Join-Path ([Environment]::GetFolderPath("UserProfile")) ".claude-sensenova-deepseek-v4-flash"
$claude = Join-Path $env:APPDATA "npm\claude.cmd"

$env:HOME = $claudeHome
$env:USERPROFILE = $claudeHome
$env:CLAUDE_CONFIG_DIR = $claudeConfigDir
$env:ANTHROPIC_API_KEY = ""

Set-Location -LiteralPath $projectDir

$prompt = [System.IO.File]::ReadAllText("PROMPT_v3.3_W2.txt", [System.Text.Encoding]::UTF8)
& $claude --model deepseek-v4-flash --print --permission-mode bypassPermissions --max-turns 200 --output-format text $prompt
