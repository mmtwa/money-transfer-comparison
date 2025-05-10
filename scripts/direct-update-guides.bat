@echo off
echo Updating guide content and images with direct MongoDB connection
echo ======================================================

echo Running combined update script...
node "%~dp0update-guides-direct.js"

if %ERRORLEVEL% EQU 0 (
  echo Update successful!
) else (
  echo Error updating guides!
)

pause 