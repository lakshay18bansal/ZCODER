@echo off
echo Starting ZCODER Development Servers...
echo.

REM Navigate to project root
cd /d "%~dp0"

REM Start backend server in a new command prompt window
echo Starting Backend Server...
start "ZCODER Backend" cmd /k "cd backend && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server in a new command prompt window
echo Starting Frontend Server...
start "ZCODER Frontend" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window (servers will continue running)
pause >nul
