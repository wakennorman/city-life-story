# Claude Code Auto-Config and Start Script

Write-Host "======================================"
Write-Host "Claude Code + DeepSeek Launcher"
Write-Host "======================================"
Write-Host ""

# 1. Set npm registry
Write-Host "[1/5] Configuring npm registry..."
npm config set registry https://registry.npmmirror.com

# 2. Get npm global path
Write-Host ""
Write-Host "[2/5] Finding npm global path..."
$npmPrefix = npm config get prefix
Write-Host "npm prefix: $npmPrefix"

# 3. Add to PATH
Write-Host ""
Write-Host "[3/5] Configuring environment..."
if ($env:PATH -notlike "*$npmPrefix*") {
    $env:PATH = "$npmPrefix;$env:PATH"
}

# 4. Set config directory
Write-Host ""
Write-Host "[4/5] Setting config directory..."
$configDir = "D:\Claude Code+DeepSeekV4\config"
$env:CLAUDE_CONFIG_DIR = $configDir
Write-Host "Config dir: $configDir"

$settingsFile = "$configDir\settings.json"
if (Test-Path $settingsFile) {
    Write-Host "Config file found"
} else {
    Write-Host "WARNING: Config file not found"
}

# 5. Start Claude Code
Write-Host ""
Write-Host "[5/5] Starting Claude Code..."
Write-Host ""
Write-Host "======================================"

# Try different methods
$claudeCmd = "$npmPrefix\claude.cmd"
$claudeJs = "$npmPrefix\node_modules\@anthropic-ai\claude-code\cli.js"

if (Test-Path $claudeCmd) {
    & $claudeCmd
} elseif (Test-Path $claudeJs) {
    node $claudeJs
} else {
    npx @anthropic-ai/claude-code
}
