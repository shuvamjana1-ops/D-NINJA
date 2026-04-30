@echo off
setlocal
echo Syncing Catalog Images...
cd /d "%~dp0tools"
powershell -ExecutionPolicy Bypass -File sync-helper.ps1
echo.
echo Sync Complete!
pause
