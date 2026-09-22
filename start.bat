@echo off
setlocal

REM ===========================================================================
REM  Starts the birthday site locally and opens it in your browser.
REM
REM  Just double-click this file. Leave the window open while you're working --
REM  it's running the server. Close it (or run stop.bat) when you're done.
REM
REM  Edits to src\content.ts show up in the browser instantly; no restart.
REM ===========================================================================

REM Pinned on purpose: --strictPort makes Vite fail loudly instead of quietly
REM moving to 5174, which would leave stop.bat killing the wrong port.
set PORT=5173

REM Work from this script's own folder, so it doesn't matter where it's run from.
pushd "%~dp0"

echo.
echo  Happy Birthday, Cherry -- starting the site
echo  ------------------------------------------
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo  [X] Node.js isn't installed, or isn't on your PATH.
    echo.
    echo      Install the LTS version from https://nodejs.org/ then
    echo      double-click this file again.
    echo.
    popd
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo  First run -- installing dependencies. This takes a minute or two.
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo  [X] npm install failed. Scroll up for the reason.
        echo.
        popd
        pause
        exit /b 1
    )
    echo.
)

echo  Serving on http://localhost:%PORT%/
echo  Your browser will open by itself in a moment.
echo.
echo  To stop: close this window, press Ctrl+C, or run stop.bat
echo.

REM --open makes Vite wait until the server is actually ready before
REM launching the browser, so there's no race and no blank tab.
call npm run dev -- --port %PORT% --strictPort --open

REM Reached when Vite exits (Ctrl+C, or the port was already taken).
echo.
echo  Server stopped.
echo.
popd
pause
