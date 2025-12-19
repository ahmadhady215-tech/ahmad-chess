@echo off
echo ========================================
echo AETHER-BOARD Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo After installation, restart your terminal and run this script again.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo npm version:
npm --version
echo.

REM Install dependencies
echo [2/5] Installing dependencies...
echo This may take a few minutes...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

REM Check for .env.local
echo [3/5] Checking environment configuration...
if not exist .env.local (
    echo WARNING: .env.local not found
    echo Creating .env.local from example...
    copy .env.local.example .env.local >nul
    echo.
    echo IMPORTANT: Please edit .env.local and add your Supabase credentials:
    echo - NEXT_PUBLIC_SUPABASE_URL
    echo - NEXT_PUBLIC_SUPABASE_ANON_KEY
    echo.
    echo See SUPABASE_SETUP.md for detailed instructions.
    echo.
) else (
    echo .env.local found!
)
echo.

REM Build type definitions
echo [4/5] Checking TypeScript configuration...
echo Running type check...
call npm run lint
echo.

REM Setup complete
echo [5/5] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Configure Supabase (if not done):
echo    - Create a Supabase project
echo    - Run the database migration
echo    - Update .env.local with credentials
echo    See SUPABASE_SETUP.md for details
echo.
echo 2. Start the development server:
echo    npm run dev
echo.
echo 3. Open http://localhost:3000
echo.
echo ========================================
echo.
pause
