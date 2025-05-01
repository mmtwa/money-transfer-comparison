@echo off
echo Setting up scheduled task for Google Ratings update...

REM Get the current directory path
set CURRENT_DIR=%~dp0
set PARENT_DIR=%CURRENT_DIR%..
set SCRIPT_PATH=%PARENT_DIR%\scripts\updateGoogleRatings.js

REM Create a task to run every 3 days
schtasks /create /tn "MoneyTransferComparison_GoogleRatings" /tr "node %SCRIPT_PATH%" /sc DAILY /mo 3 /st 03:00 /ru SYSTEM

if %errorlevel% equ 0 (
    echo Task scheduled successfully. Will run every 3 days at 3:00 AM.
) else (
    echo Failed to schedule task. Please run as administrator.
)

pause 