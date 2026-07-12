@echo off
title City-Life-Story Preview

set "DIST_DIR=D:\Claude Code+DeepSeekV4\city-life-story\dist"
set "PORT=8888"

if not exist "%DIST_DIR%\index.html" (
    echo ERROR: %DIST_DIR%\index.html not found
    pause
    exit /b 1
)

echo Starting preview server on port %PORT%...
start /B python -m http.server %PORT% -d "%DIST_DIR%"

ping 127.0.0.1 -n 3 > nul

echo Opening browser...
start http://localhost:%PORT%

echo.
echo ===================================
echo  City-Life-Story Local Preview
echo  http://localhost:%PORT%
echo  Close this window to stop server
echo ===================================
echo.
pause