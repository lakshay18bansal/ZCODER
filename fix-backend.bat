@echo off
echo 🔧 Fixing ZCODER Backend Dependencies...
echo.

cd backend

echo 📦 Removing node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo 📥 Installing stable dependencies...
npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ Dependencies fixed! Backend is ready to run.
    echo 🚀 You can now use: npm start
) else (
    echo.
    echo ❌ Installation failed. Please check the error messages above.
)

cd ..
pause
