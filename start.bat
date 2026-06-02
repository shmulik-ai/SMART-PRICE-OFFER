@echo off
cd /d "%~dp0"
taskkill /F /IM node.exe >nul 2>&1
start "PRICE OFFER" cmd /k "cd /d %~dp0 & npm run dev"
timeout /t 5 /nobreak >nul
start "" http://localhost:5173/
