@echo off
title ZCODER Simple Starter
color 0A

echo ====================================
echo    ZCODER Development Environment    
echo ====================================
echo.
echo This will start both servers in separate windows.
echo.

REM Navigate to project root
cd /d "%~dp0"

echo [1/2] Starting Backend Server...
start "ZCODER Backend Server" cmd /k "cd backend && echo Backend Server Starting... && npm start"

echo [2/2] Starting Frontend Server...
start "ZCODER Frontend Server" cmd /k "cd frontend && echo Frontend Server Starting... && npm start"

echo.
echo ✅ Both servers are starting in separate windows!
echo.
echo 📋 URLs:
echo    Backend:  http://localhost:5000
echo    Frontend: http://localhost:3000
echo.
echo 💡 To stop servers: Close the individual terminal windows
echo.
echo This window can be closed safely.
timeout /t 5 /nobreak >nul
exit
