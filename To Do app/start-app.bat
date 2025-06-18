@echo off
echo Starting Advanced Todo App...
cd /d "c:\Users\bhjon\Desktop\To Do app"

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo Error: npm is not available
    pause
    exit /b 1
)

echo Starting development server...
npm run dev

if %errorlevel% neq 0 (
    echo Error starting the app. Press any key to exit.
    pause
    exit /b 1
)

echo App should be running at http://localhost:3000
pause
