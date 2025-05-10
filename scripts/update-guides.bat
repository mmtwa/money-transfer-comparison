@echo off
setlocal EnableDelayedExpansion

echo ======================================================
echo Updating guide content and images...
echo ======================================================
echo.

rem Try to extract MongoDB URI from .env file
set "MONGODB_URI="
for /f "tokens=1,* delims==" %%a in ('type .env ^| findstr MONGODB_URI') do (
    set "MONGODB_URI=%%b"
    echo Using MongoDB URI from .env file
)

if not defined MONGODB_URI (
    echo MONGODB_URI not found in .env file!
    echo Make sure your .env file contains a MONGODB_URI setting.
    pause
    exit /b 1
)

echo Step 1: Migrating guide content from React components...
node "%~dp0migrate-guide-content.js"
if %ERRORLEVEL% NEQ 0 (
    echo Error migrating guide content!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Step 2: Fixing guide status and adding images...
node "%~dp0fix-guides-status.js"
if %ERRORLEVEL% NEQ 0 (
    echo Error fixing guide status!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ======================================================
echo All guide updates completed successfully!
echo ======================================================
echo.
echo You can now access the guides in the admin panel.
echo.
pause

exit /b 0 