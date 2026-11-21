@echo off
cd /d "%~dp0"
title MDK Enterprises E-Commerce Server
echo ==========================================================
echo Starting MDK Enterprises E-Commerce Website...
echo Once you see "Ready", open: http://localhost:3000
echo ==========================================================
start "" cmd /c "timeout /t 4 >nul & start http://localhost:3000"
node "node_modules\next\dist\bin\next" dev -p 3000
pause
