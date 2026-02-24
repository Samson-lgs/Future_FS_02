@echo off
echo ========================================
echo   Client Lead CRM - Setup Script
echo ========================================
echo.

echo [1/4] Installing server dependencies...
call npm install
if errorlevel 1 (
    echo Error: Failed to install server dependencies
    pause
    exit /b 1
)
echo ✓ Server dependencies installed
echo.

echo [2/4] Installing client dependencies...
cd client
call npm install
if errorlevel 1 (
    echo Error: Failed to install client dependencies
    pause
    exit /b 1
)
echo ✓ Client dependencies installed
echo.

cd ..

echo [3/4] Checking environment files...
if not exist .env (
    echo .env file already exists
) else (
    echo ✓ .env file found
)

if not exist client\.env (
    echo client/.env file already exists
) else (
    echo ✓ client/.env file found
)
echo.

echo [4/4] Setup complete!
echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo.
echo 1. Make sure MongoDB is running
echo    - Run: mongod
echo.
echo 2. Start the application:
echo    - Run: npm run dev:full
echo.
echo 3. Open browser:
echo    - Frontend: http://localhost:3000
echo    - Backend:  http://localhost:5000
echo.
echo ========================================
echo.
pause
