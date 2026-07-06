Set-Location "D:\Claude Code+DeepSeekV4\city-life-story\dist"
Write-Host "Starting City Life Story..."
Start-Process "http://localhost:8080/"
python -m http.server 8080