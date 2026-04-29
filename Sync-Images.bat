@echo off
cd /d "%~dp0"
echo.
echo  ========================================
echo     D'NINJA  -  Image Sync Tool
echo  ========================================
echo.
echo  Scanning images folder...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sync-helper.ps1"
pause
