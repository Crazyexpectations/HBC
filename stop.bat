@echo off
setlocal enabledelayedexpansion

REM ===========================================================================
REM  Stops the local birthday-site server.
REM
REM  You only need this if the server is still running somewhere you can't
REM  easily get to -- e.g. you closed the terminal without pressing Ctrl+C,
REM  or start.bat says the port is already in use.
REM
REM  Deliberately kills only whatever is LISTENING on this project's ports,
REM  looked up via netstat. The blunt alternative ("taskkill /IM node.exe")
REM  would also kill unrelated Node processes -- editor language servers,
REM  other projects -- which is a nasty surprise.
REM ===========================================================================

REM 5173 = dev server (start.bat), 4173 = "npm run preview" production preview.
set PORTS=5173 4173

echo.
echo  Stopping the birthday site
echo  --------------------------
echo.

set /a FOUND=0

for %%P in (%PORTS%) do (
    for /f "tokens=5" %%I in ('netstat -ano ^| findstr /c:":%%P " ^| findstr /c:"LISTENING"') do (
        REM PID 0 is the System Idle Process -- never a real server.
        if not "%%I"=="0" (
            taskkill /F /PID %%I >nul 2>&1
            if not errorlevel 1 (
                echo   Stopped the server on port %%P  ^(PID %%I^)
                set /a FOUND+=1
            ) else (
                echo   [!] Found something on port %%P ^(PID %%I^) but couldn't stop it.
                echo       Try running this file as Administrator.
            )
        )
    )
)

if !FOUND! EQU 0 (
    echo   Nothing was running on port 5173 or 4173 -- already stopped.
)

echo.
pause
