@echo off
cd /d "%~dp0"
echo.
echo  ========================================
echo     D'NINJA  -  MASTER SYNC TOOL
echo  ========================================
echo.
echo  Updating all catalogs (Branding, Logo, 
echo  Social, Greetings, Accessories, etc.)
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sync-helper.ps1"
pause
