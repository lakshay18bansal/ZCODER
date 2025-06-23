@echo off
title ZCODER Quick Start
color 0A

echo  ███████╗ ██████╗ ██████╗ ██████╗ ███████╗██████╗ 
echo  ╚══███╔╝██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗
echo    ███╔╝ ██║     ██║   ██║██║  ██║█████╗  ██████╔╝
echo   ███╔╝  ██║     ██║   ██║██║  ██║██╔══╝  ██╔══██╗
echo  ███████╗╚██████╗╚██████╔╝██████╔╝███████╗██║  ██║
echo  ╚══════╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
echo.
echo  Starting Development Environment...
echo.

REM Navigate to project root
cd /d "%~dp0"

REM Start both servers
call start-dev.bat

echo.
echo Development servers are now running!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo You can close this window - servers will continue running.
timeout /t 5 /nobreak >nul
