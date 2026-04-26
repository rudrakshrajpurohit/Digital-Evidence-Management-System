@echo off
title Start Digital Evidence Project
echo ==========================================
echo Starting Digital Evidence Project Services
echo ==========================================
echo.

:: 1. Start Backend
echo Starting Backend...
if not exist "backend\venv\Scripts\activate.bat" (
    echo [ERROR] Backend virtual environment not found in backend\venv!
    echo Please make sure the venv exists and is installed correctly.
) else (
    start "FastAPI Backend" cmd /k "cd backend && call venv\Scripts\activate && uvicorn app.main:app --reload"
    echo Backend started in a new terminal.
)
echo.

:: Return to Root (though start cmd /k already keeps current context for script, just being explicit)
cd "%~dp0"

:: 2. Start Frontend
echo Starting Frontend...
if not exist "frontend\package.json" (
    if exist "package.json" (
        echo [INFO] package.json found in root, assuming frontend is in root.
        start "React Frontend" cmd /k "npm run dev"
        echo Frontend started in a new terminal.
    ) else (
        echo [ERROR] package.json not found in frontend directory!
    )
) else (
    start "React Frontend" cmd /k "cd frontend && npm run dev"
    echo Frontend started in a new terminal.
)
echo.

:: Return to Root
cd "%~dp0"

:: Wait 5 seconds
echo Waiting 5 seconds for services to initialize...
timeout /t 5 /nobreak >nul

:: Open browser
echo Opening Browser at http://localhost:5173
start http://localhost:5173

echo.
echo ==========================================
echo Project Started Successfully
echo ==========================================
pause
